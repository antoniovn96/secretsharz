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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '150px' }}>
                <div className="pb-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Registered</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{students.length}</div>
                </div>
                <div style={{ width: '100%', height: '60px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="registered" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '150px' }}>
                <div className="pb-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Assessed Students</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{totalAssessed}</div>
                </div>
                <div style={{ width: '100%', height: '60px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="assessed" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '150px' }}>
                <div className="pb-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Action Queue</span>
                  <div className="text-3xl font-bold text-amber-500 mt-1">{pendingCount}</div>
                </div>
                <div style={{ width: '100%', height: '60px' }}>
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '300px' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Adoption</h3>
                <div style={{ width: '100%', height: '250px' }}>
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '300px' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Engagement</h3>
                <div style={{ width: '100%', height: '250px' }}>
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '300px' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Traffic</h3>
                <div style={{ width: '100%', height: '250px' }}>
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
      {/* 1. FIXED SIDEBAR */}
      <aside className="w-[260px] bg-[#1A1F36] text-white flex-shrink-0 flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-20">
        <div className="h-[68px] flex items-center px-6 border-b border-gray-800 flex-shrink-0">
          <div className="text-xl font-bold tracking-tight">EmployX Admin</div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {allowedTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-[68px] bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="text-xl font-bold text-gray-800">
             {allowedTabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onBackToApp} className="text-sm font-semibold text-blue-600">Live Site</button>
            <button onClick={handleLogout} className="text-sm font-semibold text-red-500">Sign Out</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}