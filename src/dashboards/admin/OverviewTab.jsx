import React from 'react';
import { 
  Users, Activity, FileText, CheckCircle, 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Mock data for platform engagement
const engagementData = [
  { month: 'Jan', registrations: 120, sessions: 340, assessments: 85 },
  { month: 'Feb', registrations: 145, sessions: 420, assessments: 110 },
  { month: 'Mar', registrations: 178, sessions: 510, assessments: 145 },
  { month: 'Apr', registrations: 195, sessions: 580, assessments: 168 },
  { month: 'May', registrations: 220, sessions: 645, assessments: 195 },
  { month: 'Jun', registrations: 258, sessions: 720, assessments: 230 },
];

// User distribution by path
const pathDistribution = [
  { name: 'Wellbeing', value: 42, color: '#8B5CF6' },
  { name: 'SEN', value: 28, color: '#F59E0B' },
  { name: 'Career', value: 30, color: '#10B981' },
];

// KPI Data (will be populated from Firestore in production)
const kpiData = {
  totalUsers: { value: 1247, change: 12.5, trend: 'up' },
  activeSessions: { value: 89, change: 8.2, trend: 'up' },
  pendingIEPs: { value: 23, change: -15.3, trend: 'down' },
  completedAssessments: { value: 456, change: 24.1, trend: 'up' },
};

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
          isPositive 
            ? 'bg-emerald-50 text-emerald-600' 
            : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value.toLocaleString()}</p>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100">
        <p className="font-semibold text-slate-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OverviewTab = ({ data }) => {
  const stats = data?.stats || kpiData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-700">Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.value}
          change={stats.totalUsers.change}
          trend={stats.totalUsers.trend}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeSessions.value}
          change={stats.activeSessions.change}
          trend={stats.activeSessions.trend}
          icon={Activity}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Pending IEPs"
          value={stats.pendingIEPs.value}
          change={stats.pendingIEPs.change}
          trend={stats.pendingIEPs.trend}
          icon={FileText}
          color="bg-gradient-to-br from-amber-500 to-orange-500"
        />
        <StatCard
          title="Completed Assessments"
          value={stats.completedAssessments.value}
          change={stats.completedAssessments.change}
          trend={stats.completedAssessments.trend}
          icon={CheckCircle}
          color="bg-gradient-to-br from-emerald-500 to-teal-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Engagement Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Platform Engagement</h3>
              <p className="text-sm text-slate-500 font-medium">Monthly activity trends</p>
            </div>
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRegistrations)"
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Sessions"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                />
                <Area
                  type="monotone"
                  dataKey="assessments"
                  name="Assessments"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAssessments)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Donut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">User Distribution</h3>
            <p className="text-sm text-slate-500 font-medium">By learning path</p>
          </div>
          <div className="h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pathDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pathDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => [`${value}%`, 'Distribution']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">1.2K</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-6 space-y-3">
            {pathDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <p className="text-slate-400 text-sm font-medium mb-2">Student Completion Rate</p>
          <p className="text-3xl font-bold mb-1">87.3%</p>
          <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
            <div className="h-full w-[87%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <p className="text-slate-400 text-sm font-medium mb-2">Average Session Rating</p>
          <p className="text-3xl font-bold mb-1">4.8<span className="text-lg text-emerald-400">/5</span></p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <p className="text-slate-400 text-sm font-medium mb-2">Response Time</p>
          <p className="text-3xl font-bold mb-1">2.4<span className="text-lg text-emerald-400">hrs</span></p>
          <p className="text-xs text-slate-500 mt-3">Average counsellor response</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
