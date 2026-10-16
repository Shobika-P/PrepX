import React from 'react';
import { useStudent } from '../context/StudentContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Compass, 
  Sparkles, 
  FileText,
  CheckCircle2,
  ClipboardCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'academic', label: 'Academic audit', icon: GraduationCap, badge: null },
  { id: 'skillgap', label: 'Career readiness', icon: Compass, badge: null },
  { id: 'assessment', label: 'Skill Assessment', icon: ClipboardCheck, badge: null },
  { id: 'recommendations', label: 'Study plan', icon: Sparkles, badge: null },
  { id: 'report', label: 'Progress report', icon: FileText, badge: null },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, activeStudent, academicAudit, skillGap } = useStudent();

  return (
    <aside className="app-sidebar w-full md:w-64 bg-white min-h-0 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          <nav className="sidebar-nav space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
            <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Active Profile Snapshot Widget */}
        {activeStudent && (
          <div className="profile-summary text-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-indigo-300 uppercase">
                Active Student
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                <CheckCircle2 className="w-3 h-3" /> Audited
              </span>
            </div>

            <h4 className="font-bold text-sm text-white truncate">{activeStudent.name}</h4>
            <p className="text-xs text-indigo-200/80 mb-3">Roll: {activeStudent.roll_number}</p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white/10 rounded-xl p-2 border border-white/5">
                <p className="text-[10px] text-indigo-200">Avg Score</p>
                <p className="font-bold text-white text-sm">
                  {academicAudit?.average_marks != null ? `${academicAudit.average_marks}%` : '--'}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-2 border border-white/5">
                <p className="text-[10px] text-indigo-200">Readiness</p>
                <p className="font-bold text-emerald-300 text-sm">
                  {skillGap?.overall_readiness_score != null ? `${skillGap.overall_readiness_score}%` : '--'}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-indigo-200">Attendance:</span>
              <span className={`font-semibold ${
                (activeStudent.attendance_percentage || 0) < 75 ? 'text-rose-400' : 'text-emerald-300'
              }`}>
                {activeStudent.attendance_percentage}%
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        PrepX &copy; 2026
      </div>
    </aside>
  );
}
