import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function AttendanceWidget() {
  const { academicAudit, activeStudent } = useStudent();

  if (!academicAudit?.attendance_analysis) return null;

  const att = academicAudit.attendance_analysis;
  const pct = att.percentage || 0;
  const isCritical = pct < 75.0;
  const isWarning = pct >= 75.0 && pct < 80.0;

  return (
    <section className="section-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${
            isCritical ? 'bg-rose-50 text-rose-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Attendance Health</h3>
            <p className="text-xs text-slate-500">Statutory threshold: 75% minimum</p>
          </div>
        </div>

        <span className={`shrink-0 whitespace-nowrap text-xs font-bold px-2.5 py-1 rounded-full border ${
          isCritical
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : isWarning
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {att.status}
        </span>
      </div>

      {/* Visual Meter */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Current Attendance</span>
          <span className={`font-extrabold text-sm ${
            isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {pct}%
          </span>
        </div>

        <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
          {/* 75% marker */}
          <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-400 z-10" title="75% Exam Minimum Threshold"></div>
          
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>0%</span>
          <span className="font-semibold text-slate-600">75% (Min Exam Req)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Guidance Message */}
      <div className={`text-xs p-3 rounded-xl border flex items-start gap-2.5 ${
        isCritical
          ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
          : isWarning
          ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
          : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
      }`}>
        {isCritical ? (
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        ) : isWarning ? (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <p className="font-medium leading-relaxed">{att.message}</p>
          {att.classes_to_reach_75 > 0 && (
            <p className="font-bold text-rose-700">
              Must attend the next {att.classes_to_reach_75} consecutive classes to reach 75%.
            </p>
          )}
          {att.classes_to_reach_85 > 0 && att.classes_to_reach_75 === 0 && (
            <p className="text-amber-800">
              Need {att.classes_to_reach_85} consecutive sessions to build a high distinction buffer (85%).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
