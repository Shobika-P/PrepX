import React from 'react';
import { Award, BookOpen } from 'lucide-react';

export default function GradeDistributionCard({ gradeDistribution = {} }) {
  const grades = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count
  }));

  const totalSubjects = grades.reduce((acc, curr) => acc + curr.count, 0);

  const getGradeBg = (grade) => {
    if (grade.includes('O') || grade.includes('A+')) return 'bg-emerald-500';
    if (grade.includes('A') || grade.includes('B+')) return 'bg-indigo-500';
    if (grade.includes('B') || grade.includes('C')) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">Grade Point Distribution</h3>
          <p className="text-xs text-slate-500">Distribution across 10-point UGC/AICTE scale</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {grades.map(({ grade, count }) => {
          const percentage = totalSubjects > 0 ? Math.round((count / totalSubjects) * 100) : 0;
          return (
            <div key={grade} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">{grade}</span>
                <span className="text-slate-500 font-semibold">{count} subject(s) ({percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getGradeBg(grade)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
