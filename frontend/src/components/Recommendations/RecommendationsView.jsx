import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import LearningRoadmapCard from './LearningRoadmapCard';
import { 
  Sparkles, 
  Target, 
  CheckSquare, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  GraduationCap, 
  Layers, 
  Cpu,
  Brain
} from 'lucide-react';

export default function RecommendationsView() {
  const { recommendations, activeStudent, loading } = useStudent();
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (loading && !recommendations) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">No recommendation data generated for this student.</p>
      </div>
    );
  }

  const allRecs = recommendations.recommendations || [];
  
  // Extract unique categories
  const categories = ['All', ...new Set(allRecs.map((r) => r.category))];

  const filteredRecs = selectedCategory === 'All'
    ? allRecs
    : allRecs.filter((r) => r.category === selectedCategory);

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-rose-700',
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          border: 'border-rose-300',
          accent: 'text-rose-700',
        };
      case 'high':
        return {
          bg: 'bg-rose-600',
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
          border: 'border-rose-200',
          accent: 'text-rose-600',
        };
      case 'medium':
        return {
          bg: 'bg-indigo-500',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          border: 'border-indigo-200',
          accent: 'text-indigo-600',
        };
      default:
        return {
          bg: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          border: 'border-emerald-200',
          accent: 'text-emerald-600',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Personalized Improvement Recommendations
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> PrepX Advisor
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Rule-synthesized academic remediation, attendance recovery plans, and career gap-closing roadmaps.
        </p>
      </div>

      {/* 30-Day Milestone Plan */}
      <LearningRoadmapCard thirtyDayPlan={recommendations.thirty_day_plan} />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Filter By:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Detailed Recommendations List */}
      <div key={selectedCategory} className="recommendation-results space-y-4">
        {filteredRecs.map((rec) => {
          const style = getPriorityStyle(rec.priority);

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl border ${style.border} p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden`}
            >
              {/* Left Accent Bar */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${style.bg}`}></div>

              {/* Title & Priority Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Target className={`w-5 h-5 ${style.accent} shrink-0`} />
                  <h3 className="font-bold text-base text-slate-900">{rec.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200">
                    {rec.category}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                    {rec.priority} Priority
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {rec.description}
              </p>

              {/* Actionable Steps Checklist */}
              {rec.actionable_steps && rec.actionable_steps.length > 0 && (
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                    Recommended Action Steps:
                  </h4>
                  <ul className="space-y-2">
                    {rec.actionable_steps.map((step, sIdx) => (
                      <li key={sIdx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer: Resources & Target Timeframe */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                {rec.recommended_resources && rec.recommended_resources.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="font-semibold text-slate-700">Resources:</span>
                    {rec.recommended_resources.map((res, rIdx) => (
                      <span key={rIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {res}
                      </span>
                    ))}
                  </div>
                )}

                {rec.target_timeframe && (
                  <div className="flex items-center gap-1 font-medium text-slate-600 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target: <strong className="text-slate-800">{rec.target_timeframe}</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI & ML Architecture Extensibility Callout */}
      <div className="recommendation-note rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">How recommendations are generated</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          PrepX uses your academic results, attendance, and career skill gaps to prioritize practical next steps.
        </p>
      </div>

    </div>
  );
}
