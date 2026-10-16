import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, LockKeyhole } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

const inputClass = 'w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm';
const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function AuthModal() {
  const { isSignedIn, login, register, loading, careerRoles } = useStudent();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [form, setForm] = useState({ name: '', email: '', roll_number: '', password: '', college: '', department: '', semester: '', cgpa: '', target_role: '', skills: '', subjects: '', projects: '', certifications: '', internships: '', goals: '', timeframe: '', companies: '', milestone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  if (isSignedIn) return null;
  const setRegistration = () => { setMode('register'); setStep(1); setError(''); };

  const continueStep = (event) => {
    event.preventDefault(); setError('');
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.roll_number.trim() || form.password.length < 8 || !form.department.trim() || !form.semester) {
        setError('Complete all required fields. Passwords must contain at least 8 characters.'); return;
      }
      setStep(2); return;
    }
    if (step === 2) { if (!form.target_role) { setError('Choose a primary career goal to continue.'); return; } setStep(3); return; }
  };
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true);
    try {
      if (mode === 'login') await login({ identifier: identifier.trim(), password: form.password });
      else {
        const subjects = form.subjects.split('\n').map((row) => row.trim()).filter(Boolean).map((row) => {
          const [name, mark] = row.split(':');
          if (!name || mark === undefined || !Number.isFinite(Number(mark)) || Number(mark) < 0 || Number(mark) > 100) throw new Error('Enter subjects as “Subject name: marks (0–100)”, one per line.');
          return { name: name.trim(), marks: Number(mark), credits: 3 };
        });
        await register({ name: form.name.trim(), email: form.email.trim(), roll_number: form.roll_number.trim(), password: form.password,
          college: form.college.trim(), department: form.department.trim(), semester: Number(form.semester),
          ...(form.cgpa ? { cgpa: Number(form.cgpa) } : {}), target_role: form.target_role,
          technical_skills: splitList(form.skills), subjects, projects: splitList(form.projects),
          certifications: splitList(form.certifications), internships: splitList(form.internships),
          career_goal: { target_role: form.target_role, preferred_skills: splitList(form.goals), timeframe: form.timeframe, target_companies: splitList(form.companies), salary_expectation: form.milestone } });
      }
    } catch (err) { setError(err.message || 'Unable to save your profile.'); }
    finally { setSubmitting(false); }
  };

  return <main className="login-page"><section className="login-shell">
    <div className="login-intro"><div className="login-brand"><span className="brand-mark"><BookOpen size={22} /></span><span>PrepX</span></div>
      <p className="eyebrow">STUDENT SUCCESS PLATFORM</p><h1>Make your next<br />semester count.</h1>
      <p className="intro-copy">Track your academic progress, understand career skill requirements, and plan what to focus on next.</p>
      <div className="login-proof"><span className="proof-line" /> Personal academic insights · Skill planning · Progress reports</div>
    </div>
    <div className="login-card"><div className="login-card-heading"><div className="login-lock"><LockKeyhole size={18} /></div><div><p className="eyebrow">YOUR CAMPUS SPACE</p><h2>{mode === 'login' ? 'Sign in to continue' : ['Account and academics', 'Career preferences', 'Review your profile'][step - 1]}</h2></div></div>
      {mode === 'login' ? <form onSubmit={submit} className="login-form">
        <label htmlFor="identifier">Email or student ID</label><input className={inputClass} id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" required />
        <label htmlFor="password">Password</label><input className={inputClass} id="password" type="password" value={form.password} onChange={update('password')} autoComplete="current-password" required />
        {error && <p className="login-error" role="alert">{error}</p>}<button className="solid-button" disabled={submitting || loading}>{submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button>
        <p className="login-hint">New here? <button type="button" className="text-link" onClick={setRegistration}>Create your profile</button></p>
      </form> : <>
        <div className="onboarding-progress" aria-label={`Step ${step} of 3`}><div style={{ width: `${step * 33.33}%` }} /><span>Step {step} of 3</span></div>
        <form onSubmit={step < 3 ? continueStep : submit} className="login-form onboarding-form">
          {step === 1 && <>
            <label htmlFor="name">Full name <em>Required</em></label><input id="name" className={inputClass} value={form.name} onChange={update('name')} autoComplete="name" required />
            <label htmlFor="email">Email <em>Required</em></label><input id="email" className={inputClass} type="email" value={form.email} onChange={update('email')} autoComplete="email" required />
            <div className="form-two"><div><label htmlFor="roll">Student ID <em>Required</em></label><input id="roll" className={inputClass} value={form.roll_number} onChange={update('roll_number')} required /></div><div><label htmlFor="semester">Semester <em>Required</em></label><input id="semester" className={inputClass} type="number" min="1" max="12" value={form.semester} onChange={update('semester')} required /></div></div>
            <label htmlFor="password-signup">Password <em>8+ characters</em></label><input id="password-signup" className={inputClass} type="password" value={form.password} onChange={update('password')} autoComplete="new-password" minLength="8" required />
            <label htmlFor="college">College / University <em>Optional</em></label><input id="college" className={inputClass} value={form.college} onChange={update('college')} />
            <label htmlFor="department">Department <em>Required</em></label><input id="department" className={inputClass} value={form.department} onChange={update('department')} required placeholder="e.g. Computer Science" />
            <div className="form-two"><div><label htmlFor="cgpa">Current CGPA <em>Optional</em></label><input id="cgpa" className={inputClass} type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={update('cgpa')} /></div><div><label htmlFor="skills">Technical skills <em>Optional, comma separated</em></label><input id="skills" className={inputClass} value={form.skills} onChange={update('skills')} placeholder="Python, SQL" /></div></div>
            <label htmlFor="subjects">Subject marks <em>Optional, one per line</em></label><textarea id="subjects" className="onboarding-textarea" value={form.subjects} onChange={update('subjects')} placeholder={'Data Structures: 82\nDatabase Systems: 76'} rows="3" />
          </>}
          {step === 2 && <>
            <label htmlFor="role">Primary career goal <em>Required</em></label><select id="role" className={inputClass} value={form.target_role} onChange={update('target_role')} required><option value="">Select a role</option>{careerRoles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}</select>
            <label htmlFor="goals">Skills you want to learn <em>Optional, comma separated</em></label><input id="goals" className={inputClass} value={form.goals} onChange={update('goals')} placeholder="React, cloud fundamentals" />
            <label htmlFor="timeframe">Preferred learning timeframe <em>Optional</em></label><select id="timeframe" className={inputClass} value={form.timeframe} onChange={update('timeframe')}><option value="">Choose a timeframe</option><option>1 month</option><option>3 months</option><option>6 months</option><option>1 year</option></select>
            <label htmlFor="companies">Target companies <em>Optional, comma separated</em></label><input id="companies" className={inputClass} value={form.companies} onChange={update('companies')} placeholder="Company names" />
            <label htmlFor="milestone">Target package or milestone <em>Optional</em></label><input id="milestone" className={inputClass} value={form.milestone} onChange={update('milestone')} placeholder="e.g. internship by next summer" />
            <label htmlFor="projects">Projects <em>Optional, comma separated</em></label><input id="projects" className={inputClass} value={form.projects} onChange={update('projects')} placeholder="Project names or summaries" />
            <label htmlFor="certifications">Certifications <em>Optional, comma separated</em></label><input id="certifications" className={inputClass} value={form.certifications} onChange={update('certifications')} placeholder="Completed certifications" />
            <label htmlFor="internships">Internships or experience <em>Optional, comma separated</em></label><input id="internships" className={inputClass} value={form.internships} onChange={update('internships')} placeholder="Role, company, or experience" />
            <p className="onboarding-note">You can add projects, certifications, internships, and more academic records from your profile after sign-up.</p>
          </>}
          {step === 3 && <div className="review-summary"><p>Check the information before creating your account.</p><dl>{[['Name',form.name],['Email',form.email],['Student ID',form.roll_number],['College',form.college || 'Not provided'],['Department',form.department],['Semester',form.semester],['Career goal',careerRoles.find((role) => role.id === form.target_role)?.title || ''],['Skills',form.skills || 'Not provided'],['Subject records',form.subjects || 'Not provided'],['Projects',form.projects || 'Not provided'],['Certifications',form.certifications || 'Not provided'],['Internships',form.internships || 'Not provided'],['Target companies',form.companies || 'Not provided']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>}
          {error && <p className="login-error" role="alert">{error}</p>}
          <div className="onboarding-actions">{step === 1 ? <button type="button" className="plain-button" onClick={() => { setMode('login'); setError(''); }}>Back to sign in</button> : <button type="button" className="plain-button" onClick={() => { setStep(step - 1); setError(''); }}><ArrowLeft size={15} /> Back</button>}
            <button className="solid-button" disabled={submitting || loading}>{step < 3 ? <>Continue <ArrowRight size={16} /></> : submitting ? 'Saving profile…' : <>Create account <ArrowRight size={16} /></>}</button></div>
        </form>
      </>}
      {mode === 'register' && <div className="auth-switch">Already registered? <button type="button" className="text-link" onClick={() => { setMode('login'); setError(''); }}>Sign in</button></div>}
    </div>
  </section><footer className="login-footer">PrepX · Academic progress, made actionable</footer></main>;
}
