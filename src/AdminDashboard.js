import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Home, Users, Briefcase, Shield, 
  Settings, Moon, CheckCircle, PieChart, MessageSquare, Maximize, Sliders, Globe, LogOut, Ticket, Check, X, ChevronRight, ChevronDown, MoreHorizontal, Download, Edit3, Trash2, ThumbsUp
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
  { id: 'profile', icon: <Users size={18} strokeWidth={2} />, label: 'My Profile', roles: ['super_admin', 'counsellor'] },
  { id: 'overview', icon: <Home size={18} strokeWidth={2} />, label: 'Dashboard', roles: ['super_admin', 'counsellor'] },
  { id: 'students', icon: <Briefcase size={18} strokeWidth={2} />, label: 'Student Master', roles: ['super_admin', 'counsellor'] },
  { id: 'counselling', icon: <CheckCircle size={18} strokeWidth={2} />, label: 'Counselling Workflow', roles: ['super_admin', 'counsellor'] },
  { id: 'analytics', icon: <PieChart size={18} strokeWidth={2} />, label: 'Analytics & Funnel', roles: ['super_admin'] },
  { id: 'institutions', icon: <Shield size={18} strokeWidth={2} />, label: 'Institution Control', roles: ['super_admin'] },
  { id: 'settings', icon: <Settings size={18} strokeWidth={2} />, label: 'System Settings', roles: ['super_admin'] },
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
        <p>Loading Data...</p>
      </div>
    );

    switch (activeTab) {
      case 'overview':
        const pendingCount = students.filter(s => !s.assignedCounsellorId && s.riasecCode).length;
        const totalAssessed = students.filter(s => s.riasecCode).length;
        
        const pieData = [
          { name: 'Pending', value: pendingCount || 1, color: '#F43F5E' },
          { name: 'Assessed', value: totalAssessed || 1, color: '#10B981' },
          { name: 'Other', value: institutionsCount || 1, color: '#3B82F6' }
        ];

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-[20px] font-medium text-gray-800">Dashboard</h1>
              <Home size={14} className="text-gray-400 ml-2" />
              <span className="text-gray-400 text-[13px]">- Overview - Dashboard</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Column - Stats Cards */}
              <div className="xl:col-span-1 grid grid-cols-2 gap-4">
                {/* Total Registered */}
                <div className="bg-white rounded shadow-sm overflow-hidden flex flex-col h-[150px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl text-gray-800 font-medium">+{students.length}</h3>
                    <p className="text-gray-500 text-[13px] mt-1">Total Registered</p>
                  </div>
                  <div className="bg-[#6366F1] text-white p-3 flex justify-center items-center h-[50px]">
                    <Users size={24} />
                  </div>
                </div>

                {/* Assessed Students */}
                <div className="bg-white rounded shadow-sm overflow-hidden flex flex-col h-[150px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl text-gray-800 font-medium">{totalAssessed}</h3>
                    <p className="text-gray-500 text-[13px] mt-1">Assessed</p>
                  </div>
                  <div className="bg-[#FBBF24] text-white p-3 flex justify-center items-center h-[50px]">
                    <CheckCircle size={24} />
                  </div>
                </div>

                {/* Action Queue */}
                <div className="bg-white rounded shadow-sm overflow-hidden flex flex-col h-[150px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl text-gray-800 font-medium">{pendingCount}</h3>
                    <p className="text-gray-500 text-[13px] mt-1">Action Queue</p>
                  </div>
                  <div className="bg-[#10B981] text-white p-3 flex justify-center items-center h-[50px]">
                    <MessageSquare size={24} />
                  </div>
                </div>

                {/* Institutions */}
                <div className="bg-white rounded shadow-sm overflow-hidden flex flex-col h-[150px]">
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl text-gray-800 font-medium">{institutionsCount}</h3>
                    <p className="text-gray-500 text-[13px] mt-1">Institutions</p>
                  </div>
                  <div className="bg-[#F43F5E] text-white p-3 flex justify-center items-center h-[50px]">
                    <Shield size={24} />
                  </div>
                </div>
              </div>

              {/* Middle Column - Pie Chart */}
              <div className="bg-white rounded shadow-sm p-6 xl:col-span-1 h-[320px]">
                <h3 className="text-[15px] text-gray-700 mb-2">Platform Adoption</h3>
                <div className="h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
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
                <div className="mt-2 space-y-2">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-gray-600 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Bar Chart */}
              <div className="bg-white rounded shadow-sm p-6 xl:col-span-2 h-[320px]">
                <h3 className="text-[15px] text-gray-700 mb-6">Monthly Engagement</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2} barCategoryGap={10}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <Tooltip cursor={{ fill: '#F3F4F6' }} />
                      <Bar dataKey="registered" fill="#6366F1" radius={[2, 2, 0, 0]} barSize={10} />
                      <Bar dataKey="assessed" fill="#10B981" radius={[2, 2, 0, 0]} barSize={10} />
                      <Bar dataKey="sessions" fill="#F43F5E" radius={[2, 2, 0, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute right-6 top-6 flex gap-4 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-[#6366F1] rounded-full"></span> Registered</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-[#10B981] rounded-full"></span> Assessed</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-[#F43F5E] rounded-full"></span> Sessions</div>
                </div>
              </div>
            </div>

            {/* Bottom Table Section */}
            <div className="bg-white rounded shadow-sm mt-6">
              <div className="p-5 flex flex-col justify-between items-start gap-2">
                  <h2 className="text-[16px] text-gray-800">Student Master Directory</h2>
                  <p className="text-[13px] text-gray-400">Manage {students.length} registered students</p>
              </div>
              <div className="px-5 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600">Show</span>
                  <select className="border border-gray-200 rounded px-2 py-1 text-[13px] outline-none text-gray-600 bg-white">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span className="text-[13px] text-gray-600">entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-600">Search:</span>
                  <input type="text" className="border border-gray-200 rounded px-3 py-1 outline-none text-[13px] w-[200px]" />
                </div>
              </div>
              <div className="overflow-x-auto border-t border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-white">
                      <th className="px-5 py-3 text-[13px] font-semibold text-gray-800">ID</th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-gray-800">Student Name</th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-gray-800">Email</th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-gray-800">RIASEC Code</th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-gray-800">Counselling Status</th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.slice(0, 10).map((student, idx) => (
                      <tr key={student.id || idx} className="hover:bg-gray-50/50 bg-white">
                        <td className="px-5 py-3 text-[13px] text-gray-600">10{idx + 11}</td>
                        <td className="px-5 py-3 text-[13px] text-[#3B82F6] cursor-pointer hover:underline font-medium">{student.name || 'Unknown'}</td>
                        <td className="px-5 py-3 text-[13px] text-gray-600">{student.email || 'N/A'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 text-[11px] rounded ${student.riasecCode ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'} font-medium`}>
                            {student.riasecCode || 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-gray-600">{student.counsellingStatus}</td>
                        <td className="px-5 py-3 text-[13px] text-[#F43F5E] cursor-pointer">
                           <Trash2 size={16} />
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-5 py-8 text-center text-gray-500 text-[13px]">
                          No students found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button className="bg-[#3B82F6] text-white px-4 py-1.5 rounded text-[14px] font-medium transition-colors shadow-sm">
                  All Students
                </button>
                <button className="bg-white text-[#3B82F6] px-4 py-1.5 rounded border border-transparent hover:border-blue-100 text-[14px] font-medium transition-colors">
                  Assessed
                </button>
                <button className="bg-white text-[#3B82F6] px-4 py-1.5 rounded border border-transparent hover:border-blue-100 text-[14px] font-medium transition-colors">
                  Pending
                </button>
              </div>
              <button className="bg-[#F43F5E] text-white px-5 py-2 rounded text-[14px] font-medium hover:bg-rose-600 transition-colors shadow-sm">
                Add Student
              </button>
            </div>
            
            {/* Top Stat tabs */}
            <div className="grid grid-cols-6 gap-0 bg-white rounded shadow-sm border border-gray-100 overflow-hidden mb-6">
               <div className="bg-[#EFF6FF] text-center py-4 px-2 border-r border-gray-100 flex flex-col justify-center">
                 <div className="text-[20px] text-gray-800 font-medium">{students.length}</div>
                 <div className="text-[12px] text-gray-800 font-medium mt-1">Total Students</div>
               </div>
               <div className="bg-white text-center py-4 px-2 border-r border-gray-100 flex flex-col justify-center">
                 <div className="text-[20px] text-gray-800 font-medium">{students.filter(s => s.riasecCode).length}</div>
                 <div className="text-[12px] text-gray-500 font-medium mt-1">Assessed</div>
               </div>
               <div className="bg-white text-center py-4 px-2 border-r border-gray-100 flex flex-col justify-center">
                 <div className="text-[20px] text-gray-800 font-medium">{students.filter(s => !s.riasecCode).length}</div>
                 <div className="text-[12px] text-gray-500 font-medium mt-1">Pending</div>
               </div>
               <div className="bg-white text-center py-4 px-2 border-r border-gray-100 flex flex-col justify-center">
                 <div className="text-[20px] text-gray-800 font-medium">{students.filter(s => s.assignedCounsellorId).length}</div>
                 <div className="text-[12px] text-gray-500 font-medium mt-1">Assigned</div>
               </div>
               <div className="bg-white text-center py-4 px-2 border-r border-gray-100 flex flex-col justify-center">
                 <div className="text-[20px] text-gray-800 font-medium">{students.filter(s => !s.assignedCounsellorId).length}</div>
                 <div className="text-[12px] text-gray-500 font-medium mt-1">Unassigned</div>
               </div>
               <div className="bg-white text-center py-4 px-2 flex flex-col justify-center">
                 <div className="text-[20px] text-gray-400 font-medium">{institutionsCount}</div>
                 <div className="text-[12px] text-gray-400 font-medium mt-1">Institutions</div>
               </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300 w-4 h-4" /></th>
                      <th className="px-6 py-4 text-[13px] font-bold text-gray-800 flex items-center gap-1"><span className="text-gray-400 font-normal">↓↑</span> Name</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-gray-800"><span className="text-gray-400 font-normal">↓↑</span> Email</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-gray-800"><span className="text-gray-400 font-normal">↓↑</span> RIASEC</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-gray-800"><span className="text-gray-400 font-normal">↓↑</span> Status</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-gray-800"><span className="text-gray-400 font-normal">↓↑</span> Complete?</th>
                      <th className="px-6 py-4 text-[13px] font-bold text-gray-800"><span className="text-gray-400 font-normal">↓↑</span> Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student, idx) => (
                      <tr key={student.id || idx} className="hover:bg-gray-50/50 bg-white">
                        <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 w-4 h-4" /></td>
                        <td className="px-6 py-4 text-[13px] text-gray-800 font-medium">{student.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-[13px] text-gray-500">{student.email}</td>
                        <td className="px-6 py-4">
                          {student.riasecCode ? (
                            <span className="bg-[#ECFDF5] text-[#10B981] text-[11px] px-2 py-0.5 rounded font-medium">{student.riasecCode}</span>
                          ) : (
                            <span className="bg-[#FFFBEB] text-[#F59E0B] text-[11px] px-2 py-0.5 rounded font-medium">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[13px] text-gray-500">{student.counsellingStatus}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1.5">
                            {student.riasecCode ? (
                              <button className="w-7 h-7 flex items-center justify-center border border-[#10B981] text-[#10B981] rounded hover:bg-[#ECFDF5]"><Check size={14} strokeWidth={3} /></button>
                            ) : (
                              <button className="w-7 h-7 flex items-center justify-center border border-[#F43F5E] text-[#F43F5E] rounded hover:bg-[#FFF1F2]"><X size={14} strokeWidth={3} /></button>
                            )}
                            <button className="w-7 h-7 flex items-center justify-center border border-[#3B82F6] text-[#3B82F6] rounded hover:bg-[#EFF6FF] font-bold text-xs">?</button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 cursor-pointer hover:text-gray-600">
                          <MoreHorizontal size={18} />
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-[13px]">
                          No candidates found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-[20px] font-medium text-gray-800">{allowedTabs.find(t => t.id === activeTab)?.label || 'Module'}</h1>
              <Home size={14} className="text-gray-400 ml-2" />
              <span className="text-gray-400 text-[13px]">- {allowedTabs.find(t => t.id === activeTab)?.label || 'Module'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded shadow-sm p-6 border border-gray-100 h-[160px]">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-[15px] text-gray-800 font-medium">Box progress</h3>
                   <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="w-1/2 h-full bg-[#3B82F6]"></div>
                   </div>
                 </div>
                 <p className="text-[13px] text-gray-500 leading-relaxed">
                   This module ({allowedTabs.find(t => t.id === activeTab)?.label}) is currently under construction.
                   It has been styled to match the EmployX dashboard perfectly.
                 </p>
              </div>

              <div className="bg-white rounded shadow-sm p-6 border border-gray-100 h-[160px]">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-[15px] text-gray-800 font-medium">Box switch</h3>
                   <div className="w-8 h-4 bg-[#3B82F6] rounded-full relative">
                     <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                   </div>
                 </div>
                 <p className="text-[13px] text-gray-500 leading-relaxed">
                   Your Firebase data is fully connected. The {students.length} students and {institutionsCount} institutions are ready to be managed here.
                 </p>
              </div>
            </div>
          </div>
        );
    }
  };

  // ── MAIN LAYOUT RENDER ──────────────────────────────────────────────────────
  return (
    <div className="!fixed !inset-0 !z-[9999] !bg-[#F4F7FE] !flex !w-screen !h-screen !m-0 !p-0 !overflow-hidden font-sans">
      
      {/* 1. FIXED SIDEBAR */}
      <aside className="!fixed !left-0 !top-0 !bottom-0 !w-[250px] !bg-[#242539] !text-gray-300 !flex-shrink-0 !flex !flex-col !z-50 border-r border-[#2C2E4A]">
        {/* Logo Section */}
        <div className="h-[72px] flex items-center px-6 flex-shrink-0 cursor-pointer bg-[#242539]">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[22px] font-semibold text-white tracking-wide">EmployX</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {allowedTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-6 py-3 text-[14px] transition-colors relative group ${
                  isActive 
                    ? 'text-[#3B82F6]' 
                    : 'text-[#9AA0B1] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#3B82F6]' : 'text-[#9AA0B1] group-hover:text-white'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </div>
                {!isActive && <ChevronRight size={14} className="text-[#51546E]" />}
                {isActive && <ChevronDown size={14} className="text-[#3B82F6]" />}
              </button>
            )
          })}
        </nav>
        
        {/* Bottom illustration placeholder */}
        <div className="mt-auto p-4 flex justify-center pb-8 opacity-80">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="80" height="40" rx="4" fill="#2C2E4A"/>
            <circle cx="60" cy="40" r="10" fill="#3B82F6"/>
            <path d="M30 60 L40 50 L80 50 L90 60" stroke="#F43F5E" strokeWidth="2"/>
          </svg>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="!absolute !left-[250px] !w-[calc(100vw-250px)] !top-0 !bottom-0 !flex !flex-col !overflow-y-auto !bg-[#F4F7FE]">
        
        {/* TOP NAVBAR */}
        <header className="h-[72px] bg-[#F4F7FE] flex items-center justify-between px-6 flex-shrink-0 z-10 sticky top-0">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-4">
            <button className="text-[#3B82F6] hover:text-blue-700 transition-colors p-2">
              <Menu size={22} strokeWidth={2} />
            </button>
            <div className="bg-white rounded shadow-sm flex items-center px-4 py-2 w-[280px]">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-[13px] text-gray-600 w-full placeholder-gray-400" 
              />
              <Search size={16} className="text-gray-400 ml-2" />
            </div>
          </div>
          
          {/* Right: Icons & Avatar */}
          <div className="flex items-center gap-2">
            <button className="text-[#3B82F6] hover:bg-blue-50 p-2 rounded-full transition-colors">
              <Moon size={18} strokeWidth={2} />
            </button>
            <button className="text-[#3B82F6] hover:bg-blue-50 p-2 rounded-full transition-colors relative">
              <Bell size={18} strokeWidth={2} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#F43F5E] rounded-full border border-white"></span>
            </button>
            <button className="text-[#3B82F6] hover:bg-blue-50 p-2 rounded-full transition-colors">
              <MessageSquare size={18} strokeWidth={2} />
            </button>
            <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors text-[18px]">
              🇺🇸
            </button>
            <button className="text-[#3B82F6] hover:bg-blue-50 p-2 rounded-full transition-colors">
              <Maximize size={18} strokeWidth={2} />
            </button>
            <button className="text-[#3B82F6] hover:bg-blue-50 p-2 rounded-full transition-colors">
              <Sliders size={18} strokeWidth={2} />
            </button>
            <button onClick={onBackToApp} className="text-[13px] font-semibold text-gray-500 hover:text-gray-700 mx-2">Live Site</button>
            <button onClick={handleLogout} className="text-[#3B82F6] hover:text-[#F43F5E] transition-colors ml-1 p-2" title="Sign Out">
              <LogOut size={18} strokeWidth={2} />
            </button>
            <div className="w-9 h-9 rounded-full ml-2 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-white shadow-sm bg-blue-100">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23DBEAFE"/><text x="50" y="65" font-family="Arial" font-size="40" font-weight="bold" fill="%232563EB" text-anchor="middle">A</text></svg>' }} />
            </div>
          </div>
        </header>

        {/* MAIN TAB CONTENT */}
        <main className="flex-1 p-6 pt-2">
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