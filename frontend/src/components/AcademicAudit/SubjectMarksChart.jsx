import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export default function SubjectMarksChart({ subjects = [], onSubjectClick }) {
  const chartData = subjects.map((s) => ({
    code: s.code || s.name.substring(0, 8),
    name: s.name,
    marks: s.marks,
    credits: s.credits,
    letterGrade: s.letter_grade,
    gradePoint: s.grade_point
  }));

  const getBarColor = (marks) => {
    if (marks >= 75) return '#10b981';
    if (marks >= 60) return '#6366f1';
    return '#f43f5e';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-sm text-indigo-300">{data.name}</p>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>Subject Code:</span>
            <span className="font-semibold text-white">{data.code}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>Score:</span>
            <span className="font-bold text-emerald-400">{data.marks}%</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>Credits:</span>
            <span className="font-semibold text-white">{data.credits}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>Grade & Points:</span>
            <span className="font-semibold text-amber-300">{data.letterGrade} ({data.gradePoint} pts)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7ecf0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            interval={0} 
            angle={-30} 
            textAnchor="end"
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference line at 75% Strong mark & 60% Passing Standard */}
          <ReferenceLine y={75} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Strong (75%)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />
          <ReferenceLine y={60} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Minimum Target (60%)', fill: '#f43f5e', fontSize: 10, position: 'insideBottomRight' }} />
          
          <Bar dataKey="marks" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.marks)} cursor="pointer" onClick={() => onSubjectClick?.(subjects[index])} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
