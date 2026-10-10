import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Award, AlertCircle, ArrowRight } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function AcademicOverviewCard() {
  const { academicAudit, setActiveTab } = useStudent();

  if (!academicAudit) return null;

  const data = (academicAudit.subjects_breakdown || []).map(s => ({
    name: s.code || s.name.substring(0, 10),
    fullName: s.name,
    marks: s.marks,
    grade: s.letter_grade
  }));

  const getBarColor = (marks) => {
    if (marks >= 75) return '#10b981';
    if (marks >= 60) return '#6366f1';
    return '#f43f5e';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-bold">{p.fullName}</p>
          <p className="text-slate-300 mt-1">Score: <span className="text-emerald-400 font-bold">{p.marks}%</span></p>
          <p className="text-slate-400">Grade: {p.grade}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="section-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">Academic Marks Breakdown</h3>
          <p className="text-xs text-slate-500">Subject-wise marks vs 60% proficiency threshold</p>
        </div>
        <button
          onClick={() => setActiveTab('academic')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
        >
          Detailed Audit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7ecf0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-25} textAnchor="end" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="marks" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.marks)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strengths & Weaknesses Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        {/* Strong Subjects */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">
              Strong Subjects ({academicAudit.strong_subjects_count})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {academicAudit.strong_subjects.length > 0 ? (
              academicAudit.strong_subjects.map((s, idx) => (
                <span key={idx} className="text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  {s.name} ({s.marks}%)
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">None exceeding 75%</span>
            )}
          </div>
        </div>

        {/* Weak Subjects */}
        <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-900">
              Needs Focus ({academicAudit.weak_subjects_count})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {academicAudit.weak_subjects.length > 0 ? (
              academicAudit.weak_subjects.map((s, idx) => (
                <span key={idx} className="text-[11px] font-medium bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                  {s.name} ({s.marks}%)
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-medium">All subjects above 60% standard!</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
