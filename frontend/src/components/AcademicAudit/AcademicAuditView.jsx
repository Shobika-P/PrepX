import React from 'react';
import { useStudent } from '../../context/StudentContext';
import SubjectMarksChart from './SubjectMarksChart';
import GradeDistributionCard from './GradeDistributionCard';
import { 
  GraduationCap, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Info,
  Calculator
} from 'lucide-react';

export default function AcademicAuditView() {
  const { activeStudent, academicAudit, loading } = useStudent();

  if (loading && !academicAudit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Auditing academic records...</p>
        </div>
      </div>
    );
  }

  if (!academicAudit) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">No academic audit data available for this student.</p>
      </div>
    );
  }

  const getStatusBadge = (marks) => {
    if (marks >= 75) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Strong Proficiency</span>;
    }
    if (marks >= 60) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Proficient</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Needs Remediation</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Automated Academic Audit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {academicAudit.engine || 'Statistical Engine'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Standardized evaluation of curriculum credits, weighted GPA, statistical variance, and subject proficiencies.
          </p>
        </div>

        {/* Performance Category Banner */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 ${
          academicAudit.performance_category === 'Excellent'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : academicAudit.performance_category === 'Good'
            ? 'bg-blue-50 text-blue-900 border-blue-200'
            : academicAudit.performance_category === 'Average'
            ? 'bg-amber-50 text-amber-900 border-amber-200'
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <Award className="w-6 h-6 shrink-0" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Standing</p>
            <p className="text-sm font-extrabold">{academicAudit.performance_category}</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Average Marks</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{academicAudit.average_marks}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Weighted GPA</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{academicAudit.weighted_gpa} / 10</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Credits</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{academicAudit.total_credits}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Highest Score</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{academicAudit.highest_mark}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Lowest Score</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{academicAudit.lowest_mark}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Std Deviation</p>
          <p className="text-xl font-bold text-slate-700 mt-1">±{academicAudit.marks_std_dev}</p>
        </div>
      </div>

      {/* Main Analysis Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Subject Marks vs Benchmark</h3>
            <p className="text-xs text-slate-500">Green: Strong (≥75%), Purple: Proficient (60-74%), Red: Attention Needed (&lt;60%)</p>
          </div>
          <SubjectMarksChart subjects={academicAudit.subjects_breakdown} />
        </div>

        <div className="space-y-6">
          <GradeDistributionCard gradeDistribution={academicAudit.grade_distribution} />

          {/* Automated Statistical Insights Panel */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-sm text-indigo-950">Audit Summary Insights</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {academicAudit.summary_insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Subject Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Comprehensive Subject Scorecard</h3>
            <p className="text-xs text-slate-500">Detailed transcript and credit weightings for Semester {activeStudent?.semester}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Code</th>
                <th className="px-6 py-3.5">Subject Name</th>
                <th className="px-6 py-3.5 text-center">Credits</th>
                <th className="px-6 py-3.5 text-center">Marks (%)</th>
                <th className="px-6 py-3.5 text-center">Letter Grade</th>
                <th className="px-6 py-3.5 text-center">Grade Point</th>
                <th className="px-6 py-3.5 text-right">Audit Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {academicAudit.subjects_breakdown.map((subj, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700 text-xs">{subj.code}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{subj.name}</td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">{subj.credits}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${
                      subj.marks >= 75 ? 'text-emerald-600' : subj.marks >= 60 ? 'text-indigo-600' : 'text-rose-600'
                    }`}>
                      {subj.marks}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">{subj.letter_grade}</td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">{subj.grade_point}</td>
                  <td className="px-6 py-4 text-right">
                    {getStatusBadge(subj.marks)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
