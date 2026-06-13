import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Home, Users, Briefcase, Shield, 
  Settings, Moon, CheckCircle, PieChart, MessageSquare, Maximize, Sliders, Globe, LogOut, Ticket, Check, Clock, ThumbsUp
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
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
  const [loadingData, setLoadingData] = useState(true);

  // Firestore Data
  const [institutionsCount, setInstitutionsCount] = useState(0);
  const [firestoreStudents, setFirestoreStudents] = useState([]);
  const [firestoreStaff, setFirestoreStaff] = useState([]);
  const [profile, setProfile] = useState({ name: user?.displayName || 'Admin', role: 'super_admin' });

  // Merge Context & Live Data
  const students = firestoreStudents.length > 0 ? firestoreStudents : ctxStudents || [];
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mb-4"></div>
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
          { name: 'Other', value: 10, color: '#10B981' }
        ];

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
              <span className="text-gray-400 text-sm">~ Overview</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Stats Cards */}
              <div className="xl:col-span-1 grid grid-cols-2 gap-4">
                {/* Total Registered */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[140px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-gray-800">+{students.length}</h3>
                    <p className="text-gray-500 text-sm mt-1">Total Registered</p>
                  </div>
                  <div className="bg-[#6B46C1] text-white p-3 flex justify-center items-center">
                    <Users size={20} />
                  </div>
                </div>

                {/* Assessed Students */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[140px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-gray-800">{totalAssessed}</h3>
                    <p className="text-gray-500 text-sm mt-1">Assessed</p>
                  </div>
                  <div className="bg-[#F59E0B] text-white p-3 flex justify-center items-center">
                    <MessageSquare size={20} />
                  </div>
                </div>

                {/* Action Queue */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[140px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-gray-800">{pendingCount}</h3>
                    <p className="text-gray-500 text-sm mt-1">Action Queue</p>
                  </div>
                  <div className="bg-[#10B981] text-white p-3 flex justify-center items-center">
                    <ThumbsUp size={20} />
                  </div>
                </div>

                {/* Institutions */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[140px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-gray-800">{institutionsCount}</h3>
                    <p className="text-gray-500 text-sm mt-1">Institutions</p>
                  </div>
                  <div className="bg-[#EF4444] text-white p-3 flex justify-center items-center">
                    <Ticket size={20} />
                  </div>
                </div>
              </div>

              {/* Middle Column - Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 xl:col-span-1 h-full">
                <h3 className="text-base text-gray-600 mb-6">Platform Adoption</h3>
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div><span className="text-gray-600">Assessed</span></div>
                    <span className="font-medium text-gray-700">{totalAssessed - pendingCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div><span className="text-gray-600">Pending</span></div>
                    <span className="font-medium text-gray-700">{pendingCount}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 xl:col-span-1 h-full">
                <h3 className="text-base text-gray-600 mb-6">Monthly Engagement</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <Tooltip cursor={{ fill: '#F3F4F6' }} />
                      <Bar dataKey="registered" fill="#6B46C1" radius={[2, 2, 0, 0]} barSize={12} />
                      <Bar dataKey="assessed" fill="#F59E0B" radius={[2, 2, 0, 0]} barSize={12} />
                      <Bar dataKey="sessions" fill="#10B981" radius={[2, 2, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-400">
                  <div className="text-right w-full">
                    <span className="inline-block mr-4">Total: {students.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Table Section */}
            <div className="bg-white rounded-lg shadow-sm mt-6">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg text-gray-800">Student List</h2>
                  <p className="text-sm text-gray-400">List of registered students</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select className="border border-gray-200 rounded px-2 py-1 text-sm outline-none">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                    <span className="text-sm text-gray-500">entries</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-gray-500">Search:</span>
                    <input type="text" className="border border-gray-200 rounded px-3 py-1 outline-none text-sm w-48" />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-800">ID</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-800">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-800">Email</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-800">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-800">RIASEC</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.slice(0, 10).map((student, idx) => (
                      <tr key={student.id || idx} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-500">10{idx + 11}</td>
                        <td className="px-6 py-4 text-sm text-[#3B82F6] font-medium cursor-pointer">{student.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            student.counsellingStatus === 'Not Started' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {student.counsellingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.riasecCode || 'Pending'}</td>
                        <td className="px-6 py-4 text-sm text-red-400 cursor-pointer hover:text-red-600">
                           <LogOut size={16} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl text-gray-800">Candidate List</h2>
              </div>
              <button className="bg-[#F43F5E] text-white px-4 py-2 rounded text-sm font-medium hover:bg-rose-600 transition-colors">
                Post A Jobs
              </button>
            </div>
            
            {/* Top Stat tabs (simulated) */}
            <div className="grid grid-cols-6 gap-2 p-6 border-b border-gray-50 bg-gray-50/30">
               <div className="bg-[#EFF6FF] text-center p-3 rounded border border-blue-100">
                 <div className="text-xl font-semibold text-gray-800">{students.length}</div>
                 <div className="text-xs text-gray-500 mt-1">Active</div>
               </div>
               <div className="bg-white text-center p-3 rounded border border-gray-100">
                 <div className="text-xl font-semibold text-gray-800">41</div>
                 <div className="text-xs text-gray-500 mt-1">Awaiting Review</div>
               </div>
               <div className="bg-white text-center p-3 rounded border border-gray-100">
                 <div className="text-xl font-semibold text-gray-800">0</div>
                 <div className="text-xs text-gray-500 mt-1">Reviewed</div>
               </div>
               <div className="bg-white text-center p-3 rounded border border-gray-100">
                 <div className="text-xl font-semibold text-gray-800">10</div>
                 <div className="text-xs text-gray-500 mt-1">Contacting</div>
               </div>
               <div className="bg-white text-center p-3 rounded border border-gray-100">
                 <div className="text-xl font-semibold text-gray-800">0</div>
                 <div className="text-xs text-gray-500 mt-1">Hired</div>
               </div>
               <div className="bg-white text-center p-3 rounded border border-gray-100">
                 <div className="text-xl font-semibold text-gray-800">0</div>
                 <div className="text-xs text-gray-500 mt-1">Rejected</div>
               </div>
            </div>

            <div className="overflow-x-auto p-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded text-blue-500 border-gray-300" /></th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">Screener Questions</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">Interested?</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4"><input type="checkbox" className="rounded text-blue-500 border-gray-300" /></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Awaiting Review</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-50 text-green-500 text-xs px-2 py-1 rounded">1/1 Preferred Question met</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">19 Nov</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button className="w-6 h-6 flex items-center justify-center border border-green-200 text-green-500 rounded hover:bg-green-50"><Check size={12} /></button>
                          <button className="w-6 h-6 flex items-center justify-center border border-blue-200 text-blue-500 rounded hover:bg-blue-50">?</button>
                          <button className="w-6 h-6 flex items-center justify-center border border-red-200 text-red-500 rounded hover:bg-red-50"><XAxis size={12} /></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Settings size={28} />
            </div>
            <h2 className="text-xl text-gray-800 mb-2">{allowedTabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-gray-500">This module is beautifully prepared in the EmployX style.</p>
          </div>
        );
    }
  };

  // ── MAIN LAYOUT RENDER ──────────────────────────────────────────────────────
  return (
    <div className="!fixed !inset-0 !z-[9999] !bg-[#F4F7FE] !flex !w-screen !h-screen !m-0 !p-0 !overflow-hidden font-sans">
      
      {/* 1. FIXED SIDEBAR */}
      <aside className="!fixed !left-0 !top-0 !bottom-0 !w-[260px] !bg-[#28293D] !text-gray-300 !flex-shrink-0 !flex !flex-col !z-50 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        {/* Logo Section */}
        <div className="h-[72px] flex items-center px-6 flex-shrink-0 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-red-500 flex items-center justify-center text-white font-bold text-lg">
              <span className="transform -skew-x-12">G</span>
            </div>
            <span className="text-2xl font-semibold text-white tracking-wide">EmployX</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {allowedTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded text-sm transition-colors ${
                  isActive 
                    ? 'text-[#3B82F6] font-medium' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className={`${isActive ? 'text-[#3B82F6]' : 'text-gray-500'}`}>
                  {React.cloneElement(tab.icon, { size: 18 })}
                </span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="!absolute !left-[260px] !w-[calc(100vw-260px)] !top-0 !bottom-0 !flex !flex-col !overflow-y-auto !bg-[#F4F7FE]">
        
        {/* TOP NAVBAR */}
        <header className="h-[72px] bg-[#F4F7FE] flex items-center justify-between px-6 flex-shrink-0 z-10 sticky top-0">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-6">
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors">
              <Menu size={24} />
            </button>
            <div className="bg-white rounded flex items-center px-4 py-2 w-72 shadow-sm border border-gray-100">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-sm text-gray-600 w-full placeholder-gray-400" 
              />
              <Search size={16} className="text-gray-400 ml-2" />
            </div>
          </div>
          
          {/* Right: Icons & Avatar */}
          <div className="flex items-center gap-5">
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors">
              <Moon size={20} />
            </button>
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors">
              <MessageSquare size={20} />
            </button>
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors">
              <Globe size={20} />
            </button>
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors">
              <Maximize size={20} />
            </button>
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors">
              <Sliders size={20} />
            </button>
            <button onClick={onBackToApp} className="text-sm font-semibold text-gray-500 hover:text-gray-700">Live Site</button>
            <button onClick={handleLogout} className="text-[#3B82F6] hover:text-red-500 transition-colors ml-2" title="Sign Out">
              <LogOut size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 ml-2 overflow-hidden flex items-center justify-center cursor-pointer border border-blue-200">
               <span className="text-blue-600 font-bold text-sm">{user?.displayName?.charAt(0) || 'A'}</span>
            </div>
          </div>
        </header>

        {/* MAIN TAB CONTENT */}
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
      
      {/* Custom styles for specific EmployX scrollbar and tweaks */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f4056;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
