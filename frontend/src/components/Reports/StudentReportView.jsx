import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  Printer, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Compass, 
  Sparkles, 
  Calendar,
  FileCheck
} from 'lucide-react';

export default function StudentReportView() {
  const { 
    activeStudent, 
    academicAudit, 
    skillGap, 
    recommendations, 
    reportData,
    loading 
  } = useStudent();
  const [reportType, setReportType] = useState('full');

  if (loading && !academicAudit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Compiling official student dossier...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Top Action Bar (hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-base text-slate-900">Student Progress Report</h2>
          <p className="text-xs text-slate-500">Choose a report preview, then print or save it as PDF.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2"><label className="text-xs font-semibold text-slate-600">Report type <select value={reportType} onChange={event => setReportType(event.target.value)} className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="full">Full report</option><option value="academic">Academic audit</option><option value="career">Career skills & recommendations</option></select></label><button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button></div>
      </div>

      {/* Printable Official Document Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                PrepX Academic Audit System
              </h1>
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Automated Academic Audit & Personalized Skill-Gap Analysis Report
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5 sm:border-l sm:pl-4 border-slate-200">
            <p><strong>Report Date:</strong> {currentDate}</p>
            <p><strong>Document ID:</strong> AUD-{activeStudent?.roll_number || '2026'}-SEC</p>
            <p><strong>Status:</strong> Student-generated report</p>
          </div>
        </div>

        {/* Student Demographics Header Grid */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Student Name</span>
            <span className="font-extrabold text-slate-900 text-sm">{activeStudent?.name}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Roll / Registration No</span>
            <span className="font-extrabold text-slate-900 text-sm font-mono">{activeStudent?.roll_number}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Department & Sem</span>
            <span className="font-semibold text-slate-800">Sem {activeStudent?.semester} • {activeStudent?.department}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Target Career Path</span>
            <span className="font-bold text-indigo-700">{skillGap?.role_title || activeStudent?.target_role}</span>
          </div>
        </div>

        {/* High Level Key Performance Indicator Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div hidden={reportType === 'career'} className="p-4 rounded-xl border border-slate-200 text-center bg-white shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400">Average Score</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{academicAudit?.average_marks == null ? 'Not available' : `${academicAudit.average_marks}%`}</p>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
              {academicAudit?.performance_category}
            </span>
          </div>

          <div hidden={reportType === 'career'} className="p-4 rounded-xl border border-slate-200 text-center bg-white shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400">Weighted GPA</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{academicAudit?.weighted_gpa == null ? 'Not available' : academicAudit.weighted_gpa}</p>
            <span className="text-[10px] text-slate-500 block mt-1">10.0 Scale</span>
          </div>

          <div hidden={reportType === 'career'} className="p-4 rounded-xl border border-slate-200 text-center bg-white shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400">Attendance</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{academicAudit?.attendance_analysis?.percentage == null ? 'Not available' : `${academicAudit.attendance_analysis.percentage}%`}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
              (academicAudit?.attendance_analysis?.percentage || 0) < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {academicAudit?.attendance_analysis?.badge}
            </span>
          </div>

          <div hidden={reportType === 'academic'} className="p-4 rounded-xl border border-slate-200 text-center bg-white shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400">Career Readiness</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{skillGap?.overall_readiness_score == null ? 'Not available' : `${skillGap.overall_readiness_score}%`}</p>
            <span className="text-[10px] text-slate-500 block mt-1">{skillGap?.readiness_badge}</span>
          </div>
        </div>

        {/* 1. Academic Performance Scorecard */}
        <div hidden={reportType === 'career'} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">
              1. Curricular Academic Performance Scorecard
            </h3>
          </div>

          <table className="w-full text-left text-xs text-slate-700 border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3 text-center">Credits</th>
                <th className="p-3 text-center">Marks (%)</th>
                <th className="p-3 text-center">Grade Point</th>
                <th className="p-3 text-center">Letter Grade</th>
                <th className="p-3 text-right">Proficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {!(academicAudit?.subjects_breakdown || []).length && <tr><td colSpan="7" className="p-5 text-center text-slate-500">No academic subject records have been saved.</td></tr>}
              {(academicAudit?.subjects_breakdown || []).map((s, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-3 font-mono font-bold text-slate-800">{s.code}</td>
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3 text-center">{s.credits}</td>
                  <td className="p-3 text-center font-bold">{s.marks}%</td>
                  <td className="p-3 text-center">{s.grade_point}</td>
                  <td className="p-3 text-center font-bold">{s.letter_grade}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.marks >= 75 ? 'bg-emerald-100 text-emerald-800' : s.marks >= 60 ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.marks >= 75 ? 'Strong' : s.marks >= 60 ? 'Satisfactory' : 'Needs Focus'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Skill-Gap & Industry Readiness Matrix */}
        <div hidden={reportType === 'academic'} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">
              2. Technical Competency & Skill-Gap Audit ({skillGap?.role_title})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Acquired Skills ({skillGap?.acquired_core_count})
              </h4>
              <div className="flex flex-wrap gap-1">
                {(skillGap?.acquired_core_skills || []).map((s, idx) => (
                  <span key={idx} className="bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Missing Role Prerequisites ({skillGap?.missing_core_count})
              </h4>
              <div className="flex flex-wrap gap-1">
                {(skillGap?.missing_core_skills || []).map((s, idx) => (
                  <span key={idx} className="bg-white text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Actionable Remediation & Growth Plan */}
        <div hidden={reportType === 'academic'} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">
              3. Prioritized Recommendations & Improvement Roadmap
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {(recommendations?.recommendations || []).map((rec, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{idx + 1}. {rec.title}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-slate-600">{rec.description}</p>
                {rec.actionable_steps && (
                  <p className="text-indigo-800 font-medium pt-1">
                    Primary Action: {rec.actionable_steps[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
