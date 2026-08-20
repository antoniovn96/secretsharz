import React from 'react';
import { Users, GraduationCap, UserCheck, Activity, CheckCircle, ClipboardCheck, HeartPulse, Map, ArrowRight, AlertTriangle, BriefcaseBusiness, HeartHandshake, Brain, Building2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EMPTY_STATS = {
  totalUsers: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  recentSessions: { value: 0, change: null, trend: 'up', changeLabel: 'sessions · 7d' },
  pendingIEPs: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  completedAssessments: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
};

const SERVICE_META = {
  career: { label: 'Career Guidance', icon: BriefcaseBusiness, key: 'Career' },
  wellbeing: { label: 'Counselling & Wellbeing', icon: HeartHandshake, key: 'Wellbeing' },
  sen: { label: 'SEN / Learning Support', icon: Brain, key: 'SEN' },
};

const Panel = ({ children, dark, borderedCards, compactRadius, className = '' }) => (
  <div className={`${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'} ${borderedCards ? 'border' : 'border-transparent'} ${compactRadius ? 'rounded-lg' : 'rounded-2xl'} p-5 shadow-sm min-w-0 ${className}`}>{children}</div>
);

const Metric = ({ title, value, icon: Icon, dark, onClick, note }) => (
  <button onClick={onClick} className={`text-left w-full ${dark ? 'bg-[#151515] border-[#292929] hover:bg-[#191919]' : 'bg-white border-slate-200 hover:border-slate-300'} border rounded-2xl p-5 shadow-sm transition-all group`}>
    <div className="flex items-start justify-between"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Icon className="w-5 h-5" /></div><ArrowRight className={`w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity ${dark ? 'text-white' : 'text-slate-900'}`} /></div>
    <p className={`mt-5 text-3xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(value || 0).toLocaleString()}</p>
    <p className={`text-xs font-bold mt-1 ${dark ? 'text-[#aaa]' : 'text-slate-700'}`}>{title}</p>
    {note && <p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>{note}</p>}
  </button>
);

const ServiceCard = ({ service, data, dark, onNavigate }) => {
  const meta = SERVICE_META[service];
  const Icon = meta.icon;
  const students = Number(data?.[meta.key] || 0);
  const totalStudents = Number(data?.total || 0);
  const pct = totalStudents ? Math.round((students / totalStudents) * 100) : 0;
  return (
    <div className={`${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Icon className="w-4 h-4" /></div><div><p className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{meta.label}</p><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>{pct}% of current students</p></div></div><span className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{students}</span></div>
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => onNavigate(`${service}Students`)} className={`rounded-lg p-2 text-left ${dark ? 'bg-white/[0.04] hover:bg-white/[0.08]' : 'bg-slate-50 hover:bg-slate-100'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Students</p><p className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{students}</p></button>
        <button onClick={() => onNavigate(`${service}Parents`)} className={`rounded-lg p-2 text-left ${dark ? 'bg-white/[0.04] hover:bg-white/[0.08]' : 'bg-slate-50 hover:bg-slate-100'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Parents</p><p className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>View</p></button>
        <button onClick={() => onNavigate(`${service}Institutions`)} className={`rounded-lg p-2 text-left ${dark ? 'bg-white/[0.04] hover:bg-white/[0.08]' : 'bg-slate-50 hover:bg-slate-100'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Institutions</p><p className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>View</p></button>
      </div>
    </div>
  );
};

const OverviewTab = ({ data, theme = 'light', borderedCards = true, compactRadius = false, onNavigate = () => {} }) => {
  const dark = theme === 'dark';
  const stats = { ...EMPTY_STATS, ...(data?.stats || {}) };
  const counts = data?.counts || {};
  const pathDistribution = data?.pathDistribution || [];
  const engagementData = data?.engagementData || [];
  const limitations = data?.limitations || {};
  const totalStudents = Number(counts.students || pathDistribution.reduce((sum, item) => sum + Number(item.value || 0), 0));
  const complete = Number(counts.profileCompleteStudents || 0);
  const incomplete = Math.max(totalStudents - complete, 0);
  const career = Number(pathDistribution.find(x => x.name === 'Career')?.value || 0);
  const wellbeing = Number(pathDistribution.find(x => x.name === 'Wellbeing')?.value || 0);
  const sen = Number(pathDistribution.find(x => x.name === 'SEN')?.value || 0);
  const unassigned = Number(pathDistribution.find(x => x.name === 'Unassigned')?.value || 0);
  const axis = dark ? '#777' : '#64748B';
  const grid = dark ? '#292929' : '#E2E8F0';

  return <div className="space-y-6">
    <div className="flex items-end justify-between gap-4"><div><p className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Super Admin Command Center</p><h2 className={`text-2xl md:text-3xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>Good morning, {data?.adminName || 'Antonio'}</h2><p className={`text-xs mt-1 ${dark ? 'text-[#777]' : 'text-slate-500'}`}>A live operational view of the Secret Sharz ecosystem.</p></div><div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full ${dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/><span className="text-[10px] font-bold">Live</span></div></div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Metric title="Total Users" value={stats.totalUsers.value} icon={Users} dark={dark} onClick={() => onNavigate('students')} note="All platform accounts" />
      <Metric title="Students" value={counts.students} icon={GraduationCap} dark={dark} onClick={() => onNavigate('students')} note={`${complete} profiles complete`} />
      <Metric title="Professionals" value={counts.professionals} icon={UserCheck} dark={dark} onClick={() => onNavigate('professionals')} note="Career · Wellbeing · SEN" />
      <Metric title="Parents" value={counts.parents} icon={Users} dark={dark} onClick={() => onNavigate('parents')} note="Linked parent accounts" />
    </div>

    <div><div className="flex items-center justify-between mb-3"><div><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Service Overview</h3><p className={`text-[10px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Three services · three audiences · one platform</p></div></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><ServiceCard service="career" data={{Career: career, total: totalStudents}} dark={dark} onNavigate={onNavigate}/><ServiceCard service="wellbeing" data={{Wellbeing: wellbeing, total: totalStudents}} dark={dark} onNavigate={onNavigate}/><ServiceCard service="sen" data={{SEN: sen, total: totalStudents}} dark={dark} onNavigate={onNavigate}/></div></div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}>
        <div className="flex items-start justify-between mb-4"><div><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Attention Required</h3><p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Items that may need Super Admin action</p></div><AlertTriangle className={`w-4 h-4 ${dark ? 'text-[#aaa]' : 'text-slate-500'}`}/></div>
        <div className="space-y-2">
          <button onClick={() => onNavigate('students')} className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-slate-50 hover:bg-slate-100'}`}><div><p className={`text-[11px] font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{incomplete} student profile{incomplete === 1 ? '' : 's'} incomplete</p><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Review All Students</p></div><ArrowRight className="w-3.5 h-3.5 opacity-50"/></button>
          <button onClick={() => onNavigate('students')} className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-slate-50 hover:bg-slate-100'}`}><div><p className={`text-[11px] font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{unassigned} student{unassigned === 1 ? '' : 's'} unassigned to a service</p><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Review student service paths</p></div><ArrowRight className="w-3.5 h-3.5 opacity-50"/></button>
          <button onClick={() => onNavigate('professionals')} className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-slate-50 hover:bg-slate-100'}`}><div><p className={`text-[11px] font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(counts.professionals || 0)} professionals in the platform</p><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Open Professional Management</p></div><ArrowRight className="w-3.5 h-3.5 opacity-50"/></button>
        </div>
      </Panel>
      <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}>
        <div className="flex items-start justify-between mb-4"><div><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Operational Snapshot</h3><p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Live platform activity</p></div><Activity className="w-4 h-4"/></div>
        <div className="grid grid-cols-2 gap-3"><div className={`p-3 rounded-lg ${dark ? 'bg-white/[0.04]' : 'bg-slate-50'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Sessions · 7d</p><p className={`text-xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(stats.recentSessions.value || 0).toLocaleString()}</p></div><div className={`p-3 rounded-lg ${dark ? 'bg-white/[0.04]' : 'bg-slate-50'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Assessments complete</p><p className={`text-xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(stats.completedAssessments.value || 0).toLocaleString()}</p></div><div className={`p-3 rounded-lg ${dark ? 'bg-white/[0.04]' : 'bg-slate-50'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Wellbeing check-ins</p><p className={`text-xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(counts.moodCheckins || 0).toLocaleString()}</p></div><div className={`p-3 rounded-lg ${dark ? 'bg-white/[0.04]' : 'bg-slate-50'}`}><p className={`text-[9px] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Career roadmaps</p><p className={`text-xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(counts.careerRoadmaps || 0).toLocaleString()}</p></div></div>
      </Panel>
    </div>

    <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}>
      <div className="flex items-start justify-between mb-5"><div><h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Platform Activity</h3><p className={`text-[10px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Recorded activity · last 6 months</p></div><span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${dark ? 'bg-white/5 text-[#888]' : 'bg-slate-50 text-slate-400'}`}>6 months</span></div>
      <div className="h-64 min-w-0 w-full">{engagementData.length ? <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}><AreaChart data={engagementData} margin={{top:5,right:5,left:-20,bottom:0}}><defs><linearGradient id="adminReg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={dark?'#fff':'#111'} stopOpacity={0.16}/><stop offset="95%" stopColor={dark?'#fff':'#111'} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:axis,fontSize:10}}/><YAxis axisLine={false} tickLine={false} tick={{fill:axis,fontSize:10}} allowDecimals={false}/><Tooltip/><Legend wrapperStyle={{paddingTop:'14px',fontSize:'10px'}} iconType="circle" iconSize={6}/><Area type="monotone" dataKey="registrations" name="Registrations" stroke={dark?'#fff':'#111'} strokeWidth={2} fill="url(#adminReg)"/><Area type="monotone" dataKey="sessions" name="Sessions" stroke={dark?'#888':'#666'} strokeWidth={2} fillOpacity={0}/><Area type="monotone" dataKey="moodCheckins" name="Mood check-ins" stroke={dark?'#bbb':'#999'} strokeWidth={1.5} fillOpacity={0}/></AreaChart></ResponsiveContainer> : <div className={`h-full flex items-center justify-center text-xs ${dark?'text-[#555]':'text-slate-400'}`}>No activity data available yet.</div>}</div>
    </Panel>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}><div className="flex items-center justify-between mb-2"><p className={`text-[10px] font-semibold ${dark?'text-[#888]':'text-slate-500'}`}>Profile Completion</p><ClipboardCheck className="w-4 h-4"/></div><p className={`text-2xl font-bold ${dark?'text-white':'text-slate-900'}`}>{totalStudents ? Math.round((complete/totalStudents)*100) : 0}%</p><div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${dark?'bg-white/10':'bg-slate-100'}`}><div className={`h-full rounded-full ${dark?'bg-white':'bg-black'}`} style={{width:`${totalStudents?Math.round((complete/totalStudents)*100):0}%`}}/></div><p className={`text-[9px] mt-2 ${dark?'text-[#555]':'text-slate-400'}`}>{complete} of {totalStudents} student profiles complete</p></Panel>
      <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}><div className="flex items-center justify-between mb-2"><p className={`text-[10px] font-semibold ${dark?'text-[#888]':'text-slate-500'}`}>Wellbeing Check-ins</p><HeartPulse className="w-4 h-4"/></div><p className={`text-2xl font-bold ${dark?'text-white':'text-slate-900'}`}>{Number(counts.moodCheckins||0).toLocaleString()}</p><p className={`text-[9px] mt-2 ${dark?'text-[#555]':'text-slate-400'}`}>Mood entries recorded across student profiles</p></Panel>
      <Panel dark={dark} borderedCards={borderedCards} compactRadius={compactRadius}><div className="flex items-center justify-between mb-2"><p className={`text-[10px] font-semibold ${dark?'text-[#888]':'text-slate-500'}`}>Career Roadmaps</p><Map className="w-4 h-4"/></div><p className={`text-2xl font-bold ${dark?'text-white':'text-slate-900'}`}>{Number(counts.careerRoadmaps||0).toLocaleString()}</p><p className={`text-[9px] mt-2 ${dark?'text-[#555]':'text-slate-400'}`}>Published roadmap records</p></Panel>
    </div>

    {(limitations.assessmentHistory || limitations.sessionRating || limitations.responseTime) && <details className={`${dark?'bg-white/[0.03] border-[#292929] text-[#777]':'bg-slate-50 border-slate-200 text-slate-500'} border ${compactRadius?'rounded-lg':'rounded-xl'} p-4`}><summary className="text-[10px] font-bold cursor-pointer">System data notes</summary><ul className="space-y-1 text-[9px] mt-2">{limitations.assessmentHistory&&<li>• {limitations.assessmentHistory}</li>}{limitations.sessionRating&&<li>• {limitations.sessionRating}</li>}{limitations.responseTime&&<li>• {limitations.responseTime}</li>}</ul></details>}
  </div>;
};

export default OverviewTab;
