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

const StatCard = ({ title, value, change, trend, changeLabel, icon: Icon, color }) => {
  const hasChange = typeof change === 'number' && Number.isFinite(change);
  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-sm`}><Icon className="w-6 h-6 text-white" /></div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${hasChange ? (isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600') : 'bg-slate-100 text-slate-500'}`}>
          {hasChange ? <>{isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{Math.abs(change)}%</> : 'Live'}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{Number(value || 0).toLocaleString()}</p>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-[11px] text-slate-400 mt-1">{changeLabel || 'Live total'}</p>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100">
      <p className="font-semibold text-slate-900 mb-2">{label}</p>
      {payload.map((entry, index) => <p key={index} className="text-sm" style={{ color: entry.color }}>{entry.name}: <span className="font-bold">{Number(entry.value || 0).toLocaleString()}</span></p>)}
    </div>
  );
};

const OverviewTab = ({ data }) => {
  const stats = { ...EMPTY_STATS, ...(data?.stats || {}) };
  const engagementData = data?.engagementData || [];
  const pathDistribution = data?.pathDistribution || [];
  const counts = data?.counts || {};
  const limitations = data?.limitations || {};

  const totalStudents = pathDistribution.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const profileComplete = Number(counts.profileCompleteStudents || 0);
  const completionRate = totalStudents > 0 ? Math.round((profileComplete / totalStudents) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2><p className="text-slate-500 font-medium mt-1">Live analytics calculated from the current platform data</p></div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-semibold text-emerald-700">Live</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" {...stats.totalUsers} icon={Users} color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Sessions (7d)" {...stats.recentSessions} icon={Activity} color="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatCard title="Pending IEPs" {...stats.pendingIEPs} icon={FileText} color="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard title="Completed Assessments" {...stats.completedAssessments} icon={CheckCircle} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6"><h3 className="text-lg font-bold text-slate-900">Platform Engagement</h3><p className="text-sm text-slate-500 font-medium">Recorded activity by month · last 6 months</p></div>
          <div className="h-72 min-w-0 w-full" style={{ minHeight: 288 }}>
            {engagementData.length ? (
              <ResponsiveContainer width="100%" height={288} minWidth={1} minHeight={288}>
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/><stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" iconSize={8} />
                  <Area type="monotone" dataKey="registrations" name="Registrations" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRegistrations)" />
                  <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorSessions)" />
                  <Area type="monotone" dataKey="moodCheckins" name="Mood check-ins" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorMood)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-slate-400">No activity data available yet.</div>}
          </div>
        </div>

        <div className="min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6"><h3 className="text-lg font-bold text-slate-900">Student Distribution</h3><p className="text-sm text-slate-500 font-medium">By learning path</p></div>
          <div className="h-52 min-w-0 w-full relative" style={{ minHeight: 208 }}>
            {totalStudents > 0 ? (
              <ResponsiveContainer width="100%" height={208} minWidth={1} minHeight={208}>
                <PieChart><Pie data={pathDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">{pathDistribution.map(entry => <Cell key={entry.name} fill={PATH_COLORS[entry.name] || '#94A3B8'} />)}</Pie><Tooltip content={<CustomTooltip />} formatter={value => [Number(value).toLocaleString(), 'Students']} /></PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-slate-400">No students yet.</div>}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center"><p className="text-2xl font-bold text-slate-900">{totalStudents.toLocaleString()}</p><p className="text-xs text-slate-500">Students</p></div></div>
          </div>
          <div className="mt-6 space-y-3">{pathDistribution.map(item => <div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: PATH_COLORS[item.name] || '#94A3B8' }} /><span className="text-sm font-medium text-slate-600">{item.name}</span></div><span className="text-sm font-bold text-slate-900">{Number(item.value || 0).toLocaleString()}</span></div>)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white"><div className="flex items-center justify-between mb-2"><p className="text-slate-400 text-sm font-medium">Student Profile Completion</p><ClipboardCheck className="w-5 h-5 text-emerald-400" /></div><p className="text-3xl font-bold mb-1">{completionRate}%</p><div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: `${completionRate}%` }} /></div><p className="text-xs text-slate-500 mt-3">{profileComplete.toLocaleString()} of {totalStudents.toLocaleString()} student profiles complete</p></div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white"><div className="flex items-center justify-between mb-2"><p className="text-slate-400 text-sm font-medium">Wellbeing Check-ins</p><HeartPulse className="w-5 h-5 text-teal-400" /></div><p className="text-3xl font-bold mb-1">{Number(counts.moodCheckins || 0).toLocaleString()}</p><p className="text-xs text-slate-500 mt-3">Mood entries recorded across student profiles</p></div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white"><div className="flex items-center justify-between mb-2"><p className="text-slate-400 text-sm font-medium">Career Roadmaps</p><Map className="w-5 h-5 text-indigo-400" /></div><p className="text-3xl font-bold mb-1">{Number(counts.careerRoadmaps || 0).toLocaleString()}</p><p className="text-xs text-slate-500 mt-3">Published roadmap records</p></div>
      </div>

      {(limitations.assessmentHistory || limitations.sessionRating || limitations.responseTime) && <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5"><p className="text-sm font-bold text-slate-700 mb-2">Data integrity notes</p><ul className="space-y-1 text-xs text-slate-500">{limitations.assessmentHistory && <li>• {limitations.assessmentHistory}</li>}{limitations.sessionRating && <li>• {limitations.sessionRating}</li>}{limitations.responseTime && <li>• {limitations.responseTime}</li>}</ul></div>}
    </div>
  );
};

export default OverviewTab;
