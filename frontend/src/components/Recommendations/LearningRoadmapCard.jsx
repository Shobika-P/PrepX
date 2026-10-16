import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function LearningRoadmapCard({ thirtyDayPlan = [] }) {
  const { activeStudent, updateProfile } = useStudent();
  const [completedSteps, setCompletedSteps] = useState(() => new Set(activeStudent?.roadmap_progress || []));
  const [saving, setSaving] = useState(false);
  useEffect(() => setCompletedSteps(new Set(activeStudent?.roadmap_progress || [])), [activeStudent?.roadmap_progress]);
  const toggleStep = async (step) => {
    const id = `${step.day}:${step.focus}`;
    const next = new Set(completedSteps);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSaving(true);
    try { await updateProfile({ roadmap_progress: [...next] }); setCompletedSteps(next); } catch { /* updateProfile exposes the API error in the app shell. */ }
    finally { setSaving(false); }
  };

  return (
    <section className="section-card space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900">30-day learning plan</h3>
          <p className="text-xs text-slate-500">Step-by-step roadmap to bridge academic gaps and learn career prerequisites</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {thirtyDayPlan.map((step, idx) => (
          <article
          key={`${step.day}:${step.focus}`}
            className="roadmap-step p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {step.day}
              </span>
              <span className="text-xs font-bold text-slate-400">Step {idx + 1}</span>
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">{step.focus}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{step.task}</p>
            </div>

            <button
              type="button"
              aria-pressed={completedSteps.has(`${step.day}:${step.focus}`)}
              disabled={saving}
              onClick={() => toggleStep(step)}
              className={`roadmap-toggle flex items-center gap-1.5 text-[11px] font-semibold pt-2 border-t border-slate-200/60 transition-colors ${completedSteps.has(`${step.day}:${step.focus}`) ? 'text-emerald-700' : 'priority-high-pending text-rose-700 hover:text-rose-800'}`}
            >
              {completedSteps.has(`${step.day}:${step.focus}`) ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span>{completedSteps.has(`${step.day}:${step.focus}`) ? 'Completed' : 'Pending action · Mark complete'}</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
