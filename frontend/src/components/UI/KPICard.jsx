import React from 'react';

const KPICard = ({ title, value, icon, change, changeType, index = 0 }) => {
  return (
    <div 
      className="glass rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${changeType === 'increase' ? 'bg-indigo-50 text-indigo-500' : 'bg-rose-50 text-rose-500'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-sm font-semibold flex items-center gap-1 ${changeType === 'increase' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {changeType === 'increase' ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
          )}
          {change}
        </span>
        <span className="text-sm text-slate-400">vs last month</span>
      </div>
    </div>
  );
};

export default KPICard;
