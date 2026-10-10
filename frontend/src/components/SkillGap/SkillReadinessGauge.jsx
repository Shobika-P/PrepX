import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

export default function SkillReadinessGauge({ skillGap }) {
  if (!skillGap) return null;

  const score = skillGap.overall_readiness_score || 0;
  const coreMatch = skillGap.core_match_percentage || 0;
  const advancedMatch = skillGap.advanced_match_percentage || 0;

  // Chart data for donut gauge
  const data = [
    { name: 'Completed', value: score },
    { name: 'Gap', value: 100 - score },
  ];

  const getScoreColor = (val) => {
    if (val >= 80) return '#10b981'; // Emerald
    if (val >= 60) return '#6366f1'; // Indigo
    if (val >= 40) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const activeColor = getScoreColor(score);
  const COLORS = [activeColor, '#e2e8f0'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
      <div>
        <h3 className="font-bold text-base text-slate-900">Career Competency Readiness</h3>
        <p className="text-xs text-slate-500">Weighted competency score for {skillGap.role_title}</p>
      </div>

      {/* Radial Donut Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={82}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} cornerRadius={4} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: activeColor }}>
            {score}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Readiness
          </span>
        </div>
      </div>

      {/* Readiness Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
        <Award className="w-3.5 h-3.5 text-indigo-600" />
        <span>Level: {skillGap.readiness_level}</span>
      </div>

      {/* Core vs Advanced Breakdown Badges */}
      <div className="grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 block">Core Skills Match</span>
          <span className="font-bold text-slate-900 text-sm">{coreMatch}%</span>
          <span className="text-[10px] text-slate-400 block">
            ({skillGap.acquired_core_count}/{skillGap.total_core_skills} Skills)
          </span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 block">Advanced Electives</span>
          <span className="font-bold text-slate-900 text-sm">{advancedMatch}%</span>
          <span className="text-[10px] text-slate-400 block">
            ({skillGap.acquired_advanced_count}/{skillGap.total_advanced_skills} Skills)
          </span>
        </div>
      </div>
    </div>
  );
}
