import React from 'react';
import { Compass, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function SkillGapOverviewCard() {
  const { skillGap, activeRole, careerRoles, selectRole, setActiveTab } = useStudent();

  if (!skillGap) return null;

  const score = skillGap.overall_readiness_score || 0;
  const missingCore = skillGap.missing_core_skills || [];
  const acquiredCore = skillGap.acquired_core_skills || [];

  return (
    <section className="section-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base leading-snug text-slate-900">Career Skill-Gap Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">Matching current competencies vs industry prerequisites</p>
          <label className="inline-flex items-center gap-2 mt-2 text-[11px] font-medium text-slate-500">
            Career path
            <select
              value={activeRole?.id || ''}
              onChange={(event) => selectRole(event.target.value)}
              aria-label="Choose career path for skill gap analysis"
              className="max-w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 outline-none transition-colors hover:border-indigo-300 focus:border-indigo-500"
            >
              {careerRoles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}
            </select>
          </label>
        </div>
        <button
          onClick={() => setActiveTab('skillgap')}
          className="shrink-0 self-start text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group rounded-lg px-2.5 py-2 hover:bg-indigo-50 focus-visible:outline-indigo-600 transition-colors"
        >
          View Matrix <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Readiness Progress Bar & Score */}
      <button type="button" onClick={() => setActiveTab('skillgap')} aria-label={`Open career readiness details, currently ${score}%`} className="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4 transition-all hover:border-slate-300 hover:bg-slate-100/70 focus-visible:outline-indigo-600">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700">Role Readiness Score</span>
          <span className="font-extrabold text-indigo-600 text-sm">{score}%</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>Acquired: <strong className="text-emerald-700">{acquiredCore.length}</strong> core skills</span>
          <span>Missing: <strong className="text-rose-600">{missingCore.length}</strong> core skills</span>
        </div>
      </button>

      {/* Missing Skills Warning Tags */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <XCircle className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-slate-800">Key Missing Skills to Learn:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {missingCore.length > 0 ? (
            missingCore.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-1 rounded-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {skill.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> All core skills acquired for this role!
            </span>
          )}
        </div>
      </div>

      {/* Acquired Skills Summary */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">Verified Proficiencies:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {acquiredCore.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
