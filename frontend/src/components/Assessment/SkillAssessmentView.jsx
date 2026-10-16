import React, { useEffect, useMemo, useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { api } from '../../api/client';
import { ClipboardCheck, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, Circle, Loader2 } from 'lucide-react';

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm';

export default function SkillAssessmentView() {
  const { authToken, activeRole, refreshStudentData } = useStudent();
  const [skills, setSkills] = useState([]);
  const [history, setHistory] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reload = async () => {
    setBusy(true); setError('');
    try {
      const [skillRes, historyRes] = await Promise.all([api.getAssessmentSkills(authToken), api.getAssessmentHistory(authToken)]);
      setSkills(skillRes.data || []); setHistory(historyRes.data || []);
    } catch (e) { setError(e.message || 'Unable to load assessments.'); }
    finally { setBusy(false); }
  };
  useEffect(() => { reload(); }, [authToken, activeRole?.id]);

  const latestBySkill = useMemo(() => {
    const map = {};
    history.forEach(item => { if (!map[item.skill_id]) map[item.skill_id] = item; });
    return map;
  }, [history]);

  const start = async (skill, level) => {
    setBusy(true); setError(''); setResult(null); setAnswers({}); setIndex(0); setSelectedSkill(skill); setSelectedLevel(level);
    try { const res = await api.getAssessmentQuestions(skill.id, level, authToken); setQuestions(res.data || []); }
    catch (e) { setError(e.message || 'Unable to load questions.'); setSelectedSkill(null); }
    finally { setBusy(false); }
  };

  const submit = async () => {
    if (Object.keys(answers).length !== questions.length) { setError('Please answer every question before submitting.'); return; }
    if (!window.confirm('Submit this assessment? You can review the result after submission.')) return;
    setSubmitting(true); setError('');
    try {
      const payload = questions.map(q => ({ question_id: q.id, selected_option: answers[q.id] }));
      const res = await api.submitAssessment(selectedSkill.id, selectedLevel, payload, authToken);
      setResult(res.result); setSelectedSkill(null); setQuestions([]);
      const historyRes = await api.getAssessmentHistory(authToken); setHistory(historyRes.data || []);
      await refreshStudentData();
    } catch (e) { setError(e.message || 'Assessment submission failed.'); }
    finally { setSubmitting(false); }
  };

  if (busy) return <div className="flex items-center gap-3 p-8 text-slate-600"><Loader2 className="animate-spin" size={19}/> Loading your assessment portal…</div>;

  return <section className="space-y-6" aria-labelledby="assessment-title">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="eyebrow">CAREER SKILLS</p><h1 id="assessment-title" className="text-2xl font-bold text-slate-900">Skill Assessment</h1>
        <p className="mt-1 text-sm text-slate-600">Role: <strong>{activeRole?.title || 'No role selected'}</strong>. Results use PrepX assessment bands.</p></div>
      <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700"><strong>{skills.length}</strong> available · <strong>{history.length}</strong> completed</div>
    </header>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</div>}

    {result && <div className={panel} aria-live="polite">
      <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">ASSESSMENT RESULT · LEVEL {result.level}: {result.level_name}</p><h2 className="text-xl font-bold">{result.skill_name}</h2><p className="mt-1 text-sm text-slate-500">{result.career_role_title} · {new Date(result.created_at).toLocaleString()}</p></div><div className="text-right"><div className="text-3xl font-bold text-slate-900">{result.score_percentage}%</div><span className="text-sm text-slate-600">{result.proficiency}</span></div></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Stat label="Questions" value={result.total_questions}/><Stat label="Correct / incorrect" value={`${result.correct_answers} / ${result.incorrect_answers}`}/><Stat label="Role requirement" value={result.required_level || 'Unavailable'}/></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><strong>Strength</strong><p className="mt-1">You answered {result.correct_answers} of {result.total_questions} questions correctly. {result.proficiency === 'Proficient' || result.proficiency === 'Advanced' ? `${result.proficiency} performance in ${result.skill_name}.` : 'This gives you a starting point to build on.'}</p></div><div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><strong>{result.needs_improvement ? 'Improvement area' : 'Suggested next step'}</strong><p className="mt-1">{result.recommendation} {result.level < 3 && result.score_percentage >= 60 ? `Level ${result.level + 1} is now unlocked.` : result.score_percentage < 60 ? 'Score at least 60% to unlock the next level.' : 'You have completed all three levels.'}</p></div></div>
      <div className="mt-6"><h3 className="font-bold">Answer review</h3><p className="mt-1 text-sm text-slate-500">Correct answers and explanations are shown after submission.</p><div className="mt-3 space-y-3">{(result.question_review || []).map((item, i) => <article key={item.question_id} className={`rounded-xl border p-4 ${item.is_correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/60'}`}><div className="flex items-start justify-between gap-3"><p className="font-semibold">{i + 1}. {item.question}</p><span className={`shrink-0 text-xs font-bold ${item.is_correct ? 'text-emerald-800' : 'text-rose-800'}`}>{item.is_correct ? 'Correct' : 'Incorrect'}</span></div><p className="mt-2 text-sm">Your answer: <strong>{item.options[item.selected_option]}</strong></p>{!item.is_correct && <p className="mt-1 text-sm text-emerald-800">Correct answer: <strong>{item.options[item.correct_option]}</strong></p>}<p className="mt-1 text-xs text-slate-600">{item.explanation}</p></article>)}</div></div>
      <p className="mt-3 text-xs text-slate-500">PrepX assessment bands: Beginner (0–39%), Developing (40–59%), Proficient (60–79%), Advanced (80–100%). These are not industry-certified levels.</p>
      <button onClick={() => setResult(null)} className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold"><RotateCcw size={15}/> Back to assessments</button>
    </div>}

    {selectedSkill && questions.length > 0 && <div className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">{selectedSkill.name} · LEVEL {selectedLevel}</p><h2 className="text-lg font-bold">Question {index + 1} of {questions.length}</h2></div><span className="text-sm text-slate-600">{Object.keys(answers).length}/{questions.length} answered</span></div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-slate-700 transition-all" style={{width:`${(Object.keys(answers).length/questions.length)*100}%`}}/></div>
      <h3 className="mt-6 text-lg font-semibold leading-relaxed">{questions[index]?.text}</h3>
      <fieldset className="mt-4 space-y-2"><legend className="sr-only">Choose one answer</legend>{questions[index]?.options.map((option, i) => <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm hover:bg-slate-50 ${answers[questions[index].id] === i ? 'border-slate-700 bg-slate-50' : 'border-slate-200'}`}><input type="radio" name={`answer-${questions[index].id}`} checked={answers[questions[index].id] === i} onChange={() => setAnswers(prev => ({...prev, [questions[index].id]:i}))}/><span>{option}</span></label>)}</fieldset>
      <div className="mt-6 flex flex-wrap justify-between gap-3"><button disabled={index===0} onClick={()=>setIndex(i=>i-1)} className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm disabled:opacity-40"><ChevronLeft size={16}/> Previous</button><div className="flex gap-2">{index < questions.length-1 ? <button onClick={()=>setIndex(i=>i+1)} className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">Next <ChevronRight size={16}/></button> : <button onClick={submit} disabled={submitting} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit assessment'}</button>}</div></div>
    </div>}

    {!selectedSkill && !result && <>
      <div className={panel}><div className="flex items-center gap-2"><ClipboardCheck size={19}/><h2 className="font-bold">Assessments for your selected role</h2></div>
        {!activeRole && <p className="mt-3 text-sm text-slate-600">Select a career role in your profile to see relevant assessments.</p>}
        {activeRole && !skills.length && <p className="mt-3 text-sm text-slate-600">No assessment categories are currently configured for {activeRole.title}.</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{skills.map(skill => { const latest=latestBySkill[skill.id]; return <article key={skill.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{skill.name}</h3>{skill.levels?.some(l=>l.passed) ? <CheckCircle2 className="shrink-0 text-emerald-700" size={18}/> : <Circle className="shrink-0 text-slate-300" size={18}/>}</div><p className="mt-2 text-xs text-slate-500">Role requirement: {skill.required_level} · 10 questions per level</p><div className="mt-3 space-y-2">{(skill.levels || []).map(level => <div key={level.level} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"><div><p className="text-sm font-semibold">Level {level.level}: {level.name}</p><p className="text-xs text-slate-500">{level.passed ? `Passed · latest ${level.latest_score}%` : level.completed ? `Try again · latest ${level.latest_score}%` : level.unlocked ? 'Available' : 'Locked'}{level.attempt_count ? ` · ${level.attempt_count} attempt${level.attempt_count===1?'':'s'}` : ''}</p></div><button disabled={!level.unlocked} onClick={()=>start(skill, level.level)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">{level.completed ? 'Retake' : level.unlocked ? 'Start' : 'Locked'}</button></div>)}</div><p className="mt-3 text-xs text-slate-600">Latest overall: {latest ? `${latest.score_percentage}% · L${latest.level || 1} · ${latest.proficiency}` : 'No attempts yet'}</p></article>; })}</div>
      </div>
      <div className={panel}><h2 className="font-bold">Assessment history</h2>{history.length === 0 ? <p className="mt-3 text-sm text-slate-500">Completed assessments will appear here.</p> : <div className="mt-3 divide-y">{history.map(item=><div key={item.attempt_id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><div><strong>{item.skill_name}</strong><span className="ml-2 text-slate-500">{item.career_role_title} · Level {item.level || 1} {item.level_name || 'Foundation'}</span><p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p></div><span className="font-semibold">{item.score_percentage}% · {item.proficiency}</span></div>)}</div>}</div>
    </>}
  </section>;
}

function Stat({label,value}) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></div>; }
