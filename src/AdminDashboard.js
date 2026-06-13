import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, Search, Bell, Home, Users, Briefcase, Shield, 
  Settings, Moon, Sun, ChevronDown, CheckCircle, Clock, AlertCircle, X, Check, Eye 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { useDashboard } from './context/DashboardContext';

const COLLECTIONS = {
  USERS: 'users',
  INSTITUTIONS: 'institutions',
  SETTINGS: 'system_settings',
  STAFF: 'staff'
};

const ALL_NAV_TABS = [
  { id: 'profile', icon: <Users size={20} />, label: 'My Profile', roles: ['super_admin', 'counsellor'] },
  { id: 'overview', icon: <Home size={20} />, label: 'Dashboard', roles: ['super_admin', 'counsellor'] },
  { id: 'students', icon: <Briefcase size={20} />, label: 'Student Master', roles: ['super_admin', 'counsellor'] },
  { id: 'counselling', icon: <CheckCircle size={20} />, label: 'Counselling Workflow', roles: ['super_admin', 'counsellor'] },
  { id: 'analytics', icon: <PieChart size={20} />, label: 'Analytics & Funnel', roles: ['super_admin'] },
  { id: 'institutions', icon: <Shield size={20} />, label: 'Institution Control', roles: ['super_admin'] },
  { id: 'settings', icon: <Settings size={20} />, label: 'System Settings', roles: ['super_admin'] },
];

export default function AdminDashboard({ user, onBackToApp, navigate }) {
  // ── Context & State ────────────────────────────────────────────────────────
  const { students: ctxStudents, counsellors: ctxCounsellors } = useDashboard();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Firestore Data
  const [institutionsCount, setInstitutionsCount] = useState(0);
  const [firestoreStudents, setFirestoreStudents] = useState([]);
  const [firestoreStaff, setFirestoreStaff] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [profile, setProfile] = useState({ name: user?.displayName || 'Admin', role: 'super_admin' });

  // Merge Context & Live Data
  const students = firestoreStudents.length > 0 ? firestoreStudents : ctxStudents || [];
  const counsellorsList = firestoreStaff.length > 0 ? firestoreStaff : ctxCounsellors || [];
  const allowedTabs = ALL_NAV_TABS.filter(t => t.roles.includes(profile.role));

  // Visual Trend Data (Mock data for advanced charts)
  const trendData = [
    { name: 'Jan', registered: 40, assessed: 24, sessions: 15 },
    { name: 'Feb', registered: 30, assessed: 13, sessions: 28 },
    { name: 'Mar', registered: 20, assessed: 58, sessions: 42 },
    { name: 'Apr', registered: 27, assessed: 39, sessions: 35 },
    { name: 'May', registered: 18, assessed: 48, sessions: 25 },
    { name: 'Jun', registered: 23, assessed: 38, sessions: 40 },
    { name: 'Jul', registered: 34, assessed: 43, sessions: 50 },
  ];

  // ── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const fetchPlatformData = async () => {
      setLoadingData(true);
      try {
        const instSnap = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS));
        if (isMounted) setInstitutionsCount(instSnap.size);

        const staffSnap = await getDocs(collection(db, COLLECTIONS.STAFF));
        if (isMounted) setFirestoreStaff(staffSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
          if (isMounted) {
            setFirestoreStudents(snapshot.docs.map(d => ({
              id: d.id, ...d.data(),
              counsellingStatus: d.data().counsellingStatus || 'Not Started'
            })));
          }
        });
      } catch (e) {
        console.error('Data fetch error', e);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };
    fetchPlatformData();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch (error) { console.error('Logout failed', error); }
  };

  // ── RENDER TAB CONTENT ──────────────────────────────────────────────────────
  const renderTabContent = () => {
    if (loadingData) return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p>Loading Platform Data...</p>
      </div>
    );

    switch (activeTab) {
      case 'overview':
        const pendingCount = students.filter(s => !s.assignedCounsellorId && s.riasecCode).length;
        const totalAssessed = students.filter(s => s.riasecCode).length;
        
        const pieData = [
          { name: 'Pending', value: pendingCount, color: '#F59E0B' },
          { name: 'Assessed', value: totalAssessed - pendingCount, color: '#3B82F6' },
        ];

        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm">Welcome back. Here is your platform summary.</p>
            </div>

            {/* TOP ROW: Sparkline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 pb-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Registered</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{students.length}</div>
                </div>
                <div style={{ height: 60, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="registered" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 pb-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Assessed Students</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{totalAssessed}</div>
                </div>
                <div style={{ height: 60, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="assessed" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 pb-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Action Queue</span>
                  <div className="text-3xl font-bold text-amber-500 mt-1">{pendingCount}</div>
                </div>
                <div style={{ height: 60, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="sessions" stroke="#F59E0B" fill="#FFFBEB" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: Advanced Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gauge Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Adoption</h3>
                <div style={{ height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-xs text-gray-600">Assessed</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-xs text-gray-600">Pending</span></div>
                </div>
              </div>

              {/* Stacked Bar Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Engagement</h3>
                <div style={{ height: 220, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip cursor={{ fill: '#F3F4F6' }} />
                      <Bar dataKey="registered" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="assessed" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Overlapping Area Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Traffic</h3>
                <div style={{ height: 220, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="registered" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                      <Area type="monotone" dataKey="sessions" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Student Master Directory</h2>
                <p className="text-sm text-gray-500 mt-1">Manage {students.length} registered students.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Profile</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">RIASEC</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {(student.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{student.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                          {student.riasecCode || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {student.counsellingStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Settings size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{allowedTabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-gray-500">This module is correctly routed and ready for your components.</p>
          </div>
        );
    }
  };

  // ── MAIN LAYOUT RENDER ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-[#F4F7FE] font-sans text-gray-900 w-full overflow-hidden">
      
      {/* 1. FIXED SIDEBAR (Matches HTML .main-sidebar width: 260px) */}
      <aside className="w-[260px] bg-[#1A1F36] text-white flex-shrink-0 flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-20">
        <div className="h-[68px] flex items-center px-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg">V</div>
            <span className="text-xl font-bold tracking-tight">VidyaVantage</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2 mt-2">Main Menu</p>
          {allowedTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}>{tab.icon}</span>
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA (.content-wrapper) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F4F7FE]">
        
        {/* TOP HEADER (.main-header) */}
        <header className="h-[68px] bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg w-64 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>

            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{profile?.name || 'Admin'}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{profile?.role?.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {(profile?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={onBackToApp} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">🌐 Live Site</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">🚪 Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT (.content) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {renderTabContent()}
        </main>
      </div>

      {/* Global Styles for Scrollbars to match EmployX */}
      <style dangerouslySetContent={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
      `}} />
    </div>
  );
}