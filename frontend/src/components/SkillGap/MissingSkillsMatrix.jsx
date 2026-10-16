import React, { useState } from 'react';
import { CheckCircle2, XCircle, Layers, PlusCircle, ChevronDown } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function MissingSkillsMatrix({ skillGap }) {
  const { addSkillToProfile, setActiveTab } = useStudent();
  const [addingSkill, setAddingSkill] = useState(null);

  if (!skillGap) return null;

  const categories = Object.entries(skillGap.categories_breakdown || {}).filter(
    ([_, data]) => data.total > 0
  );
  const requirements = [
    ...(skillGap.acquired_core_skills || []), ...(skillGap.missing_core_skills || []),
    ...(skillGap.acquired_advanced_skills || []), ...(skillGap.missing_advanced_skills || [])
  ];

  const handleAddSkillClick = async (skillName) => {
    setAddingSkill(skillName);
    try {
      await addSkillToProfile(skillName);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingSkill(null);
    }
  };

  return (
    <div className="space-y-6">

      <section className="section-card space-y-3">
        <div>
          <h3 className="font-bold text-base text-slate-900">Current skills vs role requirements</h3>
          <p className="mt-1 text-xs text-slate-500">Bars show whether each skill is listed in your profile. The role requires every listed competency; proficiency levels are not currently collected.</p>
        </div>
        <div className="space-y-2">
          {requirements.map((skill) => {
            const profileListed = (skillGap.all_student_skills || []).some(value => value.toLowerCase() === skill.name.toLowerCase());
            const assessed = skill.assessment;
            const meets = assessed ? !assessed.needs_improvement : profileListed;
            const current = meets ? 100 : 0;
            return <details key={`${skill.name}-${skill.is_core}`} className="skill-requirement">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className={`min-w-0 flex-1 text-sm font-semibold ${current ? 'text-slate-800' : 'text-slate-600'}`}>{skill.name}</span>
                <span className="hidden w-32 text-right text-[11px] text-slate-500 sm:block">{assessed ? `${assessed.proficiency} · ${assessed.score_percentage}%` : profileListed ? 'Profile listed · not assessed' : 'Not assessed'}</span>
                <span className="h-2 w-20 overflow-hidden rounded-full bg-slate-100 sm:w-28" aria-hidden="true"><span className={`block h-full rounded-full ${current ? 'bg-teal-600' : 'bg-amber-500'}`} style={{ width: `${current}%` }} /></span>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-800">{skill.is_core ? 'Core' : 'Advanced'}</span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform" />
              </summary>
              <div className="grid gap-3 border-x border-b border-slate-200 px-4 py-3 text-xs sm:grid-cols-2">
                <div><span className="font-semibold text-slate-500">Recorded proficiency</span><p className="mt-1 font-medium text-slate-800">{assessed ? `${assessed.proficiency} (${assessed.score_percentage}%, assessed)` : profileListed ? 'Listed in profile; no assessment score yet' : 'Unassessed'}</p></div>
                <div><span className="font-semibold text-slate-500">Role target</span><p className="mt-1 font-medium text-slate-800">{assessed?.required_level || (skill.is_core ? 'Proficient (core)' : 'Advanced (advanced)')}</p></div>
                <p className="sm:col-span-2 text-slate-600">{assessed?.needs_improvement ? `This is a configured requirement for the selected role; your ${assessed.proficiency} result is below the target. Next action: practice ${skill.name} fundamentals, then retake its assessment.` : meets ? 'This competency is currently counted toward role readiness. Next action: apply it in a role-relevant project.' : `${skill.name} is a configured role requirement. Next action: take its assessment to establish a proficiency score, then use the recommended learning resources.`}</p>
                <div className="sm:col-span-2"><button type="button" onClick={() => setActiveTab('assessment')} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-800 hover:bg-indigo-100">Open Skill Assessment</button></div>
              </div>
            </details>;
          })}
        </div>
      </section>
      
      {/* Category breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(([categoryName, data]) => {
          const categoryMatch = data.total > 0 ? Math.round((data.acquired / data.total) * 100) : 0;
          return (
            <div key={categoryName} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-sm text-slate-900">{categoryName}</h4>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {data.acquired} / {data.total} ({categoryMatch}%)
                </span>
              </div>

              {/* Category Mini Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    categoryMatch >= 75 ? 'bg-emerald-500' : categoryMatch >= 40 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${categoryMatch}%` }}
                ></div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
                      skill.status === 'Acquired'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                        : 'bg-rose-50 text-rose-800 border-rose-200/80'
                    }`}
                  >
                    {skill.status === 'Acquired' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                    )}
                    <span>{skill.name}</span>
                    {skill.is_core && (
                      <span className="text-[9px] font-bold uppercase opacity-60 ml-0.5">• Core</span>
                    )}
                    {skill.status !== 'Acquired' && !skill.assessment && (
                      <button
                        onClick={() => handleAddSkillClick(skill.name)}
                        disabled={addingSkill === skill.name}
                        className="ml-1 text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                        title={`Add ${skill.name} to persistent profile`}
                      >
                        {addingSkill === skill.name ? '...' : '+Add'}
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Core vs Missing Skills Detailed Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missing Core Skills (Action Required) */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <div>
                <h4 className="font-bold text-sm text-rose-950">Missing Core Skills (Action Required)</h4>
                <p className="text-xs text-rose-700/80">Take an assessment or add a learned skill to your profile</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full">
              {skillGap.missing_core_count} Missing
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {skillGap.missing_core_skills.length > 0 ? (
              skillGap.missing_core_skills.map((skill, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-rose-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {skill.category}
                    </span>
                  </div>
                  {skill.assessment ? <button type="button" onClick={() => setActiveTab('assessment')} className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200">Retake assessment</button> : <button
                    onClick={() => handleAddSkillClick(skill.name)}
                    disabled={addingSkill === skill.name}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
                  ><PlusCircle className="w-3 h-3 text-indigo-600" /><span>{addingSkill === skill.name ? 'Adding...' : 'Add to Profile'}</span></button>}
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-semibold p-3 bg-white rounded-xl border border-emerald-200">
                All core industry skills verified and acquired!
              </p>
            )}
          </div>
        </div>

        {/* Verified Acquired Skills */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Verified Acquired Skills</h4>
                <p className="text-xs text-emerald-700/80">Proficiencies saved in student persistent memory</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {skillGap.acquired_core_count} Verified
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {skillGap.acquired_core_skills.map((skill, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
