import React from 'react';
import {
  Users, Activity, FileText, CheckCircle,
  ArrowUpRight, ArrowDownRight, ClipboardCheck, Map, HeartPulse
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PATH_COLORS = {
  Wellbeing: '#8B5CF6',
  SEN: '#F59E0B',
  Career: '#10B981',
  Unassigned: '#94A3B8',
};

const EMPTY_STATS = {
  totalUsers: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  recentSessions: { value: 0, change: null, trend: 'up', changeLabel: 'sessions · 7d' },
  pendingIEPs: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  completedAssessments: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
};

const StatCard = ({ title, value, change, trend, changeLabel, icon: Icon, dark, borderedCards, compactRadius }) => {
  const hasChange = typeof change === 'number' && Number.isFinite(change);
  const isPositive = trend === 'up';
  return (
    <div className={`${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'} ${borderedCards ? 'border' : 'border-transparent'} ${compactRadius ? 'rounded-lg' : 'rounded-2xl'} p-5 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${compactRadius ? 'rounded-lg' : 'rounded-xl'} flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Icon className="w-5 h-5" /></div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${hasChange ? (isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600') : (dark ? 'bg-white/10 text-[#aaa]' : 'bg-slate-100 text-slate-500')}`}>
          {hasChange ? <>{isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{Math.abs(change)}%</> : 'Live'}
        </div>
      </div>
      <p className={`text-3xl font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(value || 0).toLocaleString()}</p>
      <p className={`text-xs font-semibold ${dark ? 'text-[#aaa]' : 'text-slate-600'}`}>{title}</p>
      <p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>{changeLabel || 'Live total'}</p>
    </div>
  );
};

const Panel = ({ children, dark, borderedCards, compactRadius, className = '' }) => (
  <div className={`${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'} ${borderedCards ? 'border' : 'border-transparent'} ${compactRadius ? 'rounded-lg' : 'rounded-2xl'} p-5 shadow-sm min-w-0 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={`${dark ? 'bg-[#111] border-[#333] text-white' : 'bg-white border-slate-200 text-slate-900'} px-3 py-2 rounded-lg shadow-xl border`}>
      <p className="font-semibold text-xs mb-1">{label}</p>
      {payload.map((entry, index) => <p key={index} className="text-xs" style={{ color: entry.color }}>{entry.name}: <span className="font-bold">{Number(entry.value || 0).toLocaleString()}</span></p>)}
    </div>
  );
};

const OverviewTab = ({ data, theme = 'light', borderedCards = true, compactRadius = false }) => {
  const dark = theme === 'dark';
  const stats = { ...EMPTY_STATS, ...(data?.stats || {}) };
  const engagementData = data?.engagementData || [];
  const pathDistribution = data?.pathDistribution || [];
  const counts = data?.counts || {};
  const limitations = data?.limitations || {};
  const totalStudents = pathDistribution.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const profileComplete = Number(counts.profileCompleteStudents || 0);
  const completionRate = totalStudents > 0 ? Math.round((profileComplete / totalStudents) * 1000) / 10 : 0;
  const axis = dark ? '#777' : '#64748B';
  const grid = dark ? '#292929' : '#E2E8F0';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className={`text-xl md:text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Platform Overview</h2><p className={`text-xs font-medium mt-1 ${dark ? 'text-[#777]' : 'text-slate-500'}`}>Live analytics calculated from the current platform data</p></div>
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full ${dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-bold">Live</span></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" {...stats.totalUsers} icon={Users} dark={dark} borderedCards={borderedCards} compactRadius={compactRadius} />
        <StatCard title="Sessions (7d)" {...stats.recentSessions} icon={Activity} dark={dark} borderedCards={borderedCards} compactRadius={compactRadius} />
        <StatCard title="Pending IEPs" {...stats.pendingIEPs} icon={FileText} dark={dark} borderedCards={borderedCards} compactRadius={compactRadius} />
        <StatCard title="Completed Assessments" {...stats.completedAssessments} icon={CheckCircle} dark={dark} borderedCards={borderedCards} compactRadius={compactRadius} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius} className="xl:col-span-2">
          <div className="flex items-start justify-between mb-5"><div><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Platform Engagement</h3><p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Recorded activity by month · last 6 months</p></div><span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${dark ? 'bg-white/5 text-[#888]' : 'bg-slate-50 text-slate-400'}`}>6 months</span></div>
          <div className="h-64 min-w-0 w-full">
            {engagementData.length ? <ResponsiveContainer width="100%" height="100%" minWidth={1}>
              <AreaChart data={engagementData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminReg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={dark ? '#fff' : '#111'} stopOpacity={0.18}/><stop offset="95%" stopColor={dark ? '#fff' : '#111'} stopOpacity={0}/></linearGradient>
                  <linearGradient id="adminSession" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={dark ? '#aaa' : '#555'} stopOpacity={0.15}/><stop offset="95%" stopColor={dark ? '#aaa' : '#555'} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 10 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Legend wrapperStyle={{ paddingTop: '14px', fontSize: '10px' }} iconType="circle" iconSize={6} />
                <Area type="monotone" dataKey="registrations" name="Registrations" stroke={dark ? '#fff' : '#111'} strokeWidth={2} fill="url(#adminReg)" />
                <Area type="monotone" dataKey="sessions" name="Sessions" stroke={dark ? '#888' : '#666'} strokeWidth={2} fill="url(#adminSession)" />
                <Area type="monotone" dataKey="moodCheckins" name="Mood check-ins" stroke={dark ? '#bbb' : '#999'} strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer> : <div className={`h-full flex items-center justify-center text-xs ${dark ? 'text-[#555]' : 'text-slate-400'}`}>No activity data available yet.</div>}
          </div>
        </Panel>

        <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}>
          <div className="mb-4"><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Student Distribution</h3><p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>By learning path</p></div>
          <div className="h-48 relative">
            {totalStudents > 0 ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pathDistribution} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={3} dataKey="value">{pathDistribution.map(entry => <Cell key={entry.name} fill={dark ? '#fff' : (PATH_COLORS[entry.name] || '#94A3B8')} opacity={dark ? (entry.name === 'Unassigned' ? 0.25 : entry.name === 'Wellbeing' ? 0.9 : entry.name === 'Career' ? 0.65 : 0.45) : 1} />)}</Pie><Tooltip content={<CustomTooltip dark={dark} />} /></PieChart></ResponsiveContainer> : <div className={`h-full flex items-center justify-center text-xs ${dark ? 'text-[#555]' : 'text-slate-400'}`}>No students yet.</div>}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center"><p className={`text-xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{totalStudents.toLocaleString()}</p><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Students</p></div></div>
          </div>
          <div className="mt-3 space-y-2">{pathDistribution.map(item => <div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: dark ? '#fff' : (PATH_COLORS[item.name] || '#94A3B8'), opacity: dark ? (item.name === 'Unassigned' ? .25 : item.name === 'Career' ? .65 : item.name === 'Wellbeing' ? .9 : .45) : 1 }} /><span className={`text-[10px] font-medium ${dark ? 'text-[#999]' : 'text-slate-500'}`}>{item.name}</span></div><span className={`text-[10px] font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(item.value || 0).toLocaleString()}</span></div>)}</div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}><div className="flex items-center justify-between mb-2"><p className={`text-[10px] font-semibold ${dark ? 'text-[#888]' : 'text-slate-500'}`}>Student Profile Completion</p><ClipboardCheck className="w-4 h-4" /></div><p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{completionRate}%</p><div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${dark ? 'bg-white/10' : 'bg-slate-100'}`}><div className={`h-full rounded-full ${dark ? 'bg-white' : 'bg-black'}`} style={{ width: `${completionRate}%` }} /></div><p className={`text-[9px] mt-2 ${dark ? 'text-[#555]' : 'text-slate-400'}`}>{profileComplete.toLocaleString()} of {totalStudents.toLocaleString()} student profiles complete</p></Panel>
        <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}><div className="flex items-center justify-between mb-2"><p className={`text-[10px] font-semibold ${dark ? 'text-[#888]' : 'text-slate-500'}`}>Wellbeing Check-ins</p><HeartPulse className="w-4 h-4" /></div><p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(counts.moodCheckins || 0).toLocaleString()}</p><p className={`text-[9px] mt-2 ${dark ? 'text-[#555]' : 'text-slate-400'}`}>Mood entries recorded across student profiles</p></Panel>
        <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}><div className="flex items-center justify-between mb-2"><p className={`text-[10px] font-semibold ${dark ? 'text-[#888]' : 'text-slate-500'}`}>Career Roadmaps</p><Map className="w-4 h-4" /></div><p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(counts.careerRoadmaps || 0).toLocaleString()}</p><p className={`text-[9px] mt-2 ${dark ? 'text-[#555]' : 'text-slate-400'}`}>Published roadmap records</p></Panel>
      </div>

      {(limitations.assessmentHistory || limitations.sessionRating || limitations.responseTime) && <div className={`${dark ? 'bg-white/[0.03] border-[#292929] text-[#777]' : 'bg-slate-50 border-slate-200 text-slate-500'} border ${compactRadius ? 'rounded-lg' : 'rounded-xl'} p-4`}><p className="text-[10px] font-bold mb-1">Data integrity notes</p><ul className="space-y-1 text-[9px]">{limitations.assessmentHistory && <li>• {limitations.assessmentHistory}</li>}{limitations.sessionRating && <li>• {limitations.sessionRating}</li>}{limitations.responseTime && <li>• {limitations.responseTime}</li>}</ul></div>}
    </div>
  );
};

export default OverviewTab;
