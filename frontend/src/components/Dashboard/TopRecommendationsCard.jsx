import React from 'react';
import { Sparkles, ArrowRight, CheckSquare, Target } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function TopRecommendationsCard() {
  const { recommendations, setActiveTab } = useStudent();

  if (!recommendations) return null;

  const topRecs = (recommendations.recommendations || []).slice(0, 3);

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <section className="section-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Recommended next steps</h3>
            <p className="text-xs text-slate-500">A short list of actions to focus on now</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('recommendations')}
          className="shrink-0 text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group rounded-lg px-2.5 py-2 hover:bg-indigo-50 transition-colors"
        >
          Full Plan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {topRecs.map((rec, index) => (
          <div
            key={rec.id || index}
            className="recommendation-preview-row grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5 p-3 rounded-xl border border-slate-200 transition-all"
          >
            <span className="text-xs font-bold text-slate-800 flex items-start gap-1.5 min-w-0">
              <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{rec.title}</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${getPriorityBadge(rec.priority)}`}>
              {rec.priority}
            </span>

            <p className="col-span-2 text-xs text-slate-600 line-clamp-2 leading-relaxed pl-5">
              {rec.description}
            </p>

            {rec.actionable_steps && rec.actionable_steps.length > 0 && (
              <div className="col-span-2 text-[11px] text-slate-700 font-medium flex items-start gap-1.5 pt-1 pl-5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="line-clamp-2">{rec.actionable_steps[0]}</span>
              </div>
            )}
          </div>
        ))}
        {topRecs.length === 0 && <p className="text-sm text-slate-600 py-4">No actions are pending right now.</p>}
      </div>
    </section>
  );
}
