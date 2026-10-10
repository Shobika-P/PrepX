import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', badge, trend }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-100',
      text: 'text-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-100',
      text: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800',
      gradient: 'from-amber-500 to-amber-600',
    },
    rose: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-100',
      text: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800',
      gradient: 'from-rose-500 to-rose-600',
    },
    purple: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-100',
      text: 'text-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      gradient: 'from-purple-500 to-purple-600',
    },
    blue: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
      text: 'text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800',
      gradient: 'from-blue-500 to-blue-600',
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`section-card p-5 rounded-2xl bg-white border ${scheme.border} shadow-sm transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${scheme.bg} ${scheme.text} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {badge && (
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${scheme.badgeBg}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
          {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
          {subtitle}
        </p>
      )}
    </div>
  );
}
