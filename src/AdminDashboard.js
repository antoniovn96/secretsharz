import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Home, Users, Briefcase, Shield, 
  Settings, Moon, CheckCircle, PieChart, MessageSquare, Maximize, Sliders, Globe, LogOut, Ticket, Check, X, ChevronRight, ChevronDown, MoreHorizontal, Download, Edit3, Trash2, ThumbsUp, Headset, Grid, Layers, Lock, AlertTriangle
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
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

export default function AdminDashboard({ user, onBackToApp, navigate }) {
  const { students: ctxStudents, counsellors: ctxCounsellors } = useDashboard();
  
  // State to track which sidebar menus are expanded
  const [openMenus, setOpenMenus] = useState({
    support: true,
    features: false,
    card: false,
    widgets: false,
    custom: false
  });
  
  // State for active menu item
  const [activeMenu, setActiveMenu] = useState('support-ticket');
  
  const [loadingData, setLoadingData] = useState(true);

  // Firestore Data
  const [institutionsCount, setInstitutionsCount] = useState(0);
  const [firestoreStudents, setFirestoreStudents] = useState([]);

  // Merge Context & Live Data
  const students = firestoreStudents.length > 0 ? firestoreStudents : ctxStudents || [];

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPlatformData = async () => {
      setLoadingData(true);
      try {
        const instSnap = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS));
        if (isMounted) setInstitutionsCount(instSnap.size);

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

  const pendingCount = students.filter(s => !s.assignedCounsellorId && s.riasecCode).length;
  const totalAssessed = students.filter(s => s.riasecCode).length;
  const totalStudents = students.length || 264;

  const pieData = [
    { name: 'Technical', value: totalAssessed || 8952, color: '#F43F5E' },
    { name: 'Accounts', value: pendingCount || 7458, color: '#FBBF24' },
    { name: 'Other', value: institutionsCount || 3254, color: '#3B82F6' }
  ];

  const barData = [
    { name: 'A', val1: 154, val2: 0, val3: 0, val4: 0, val5: 0 },
    { name: 'B', val1: 0, val2: 154, val3: 0, val4: 0, val5: 0 },
    { name: 'E', val1: 0, val2: 0, val3: 254, val4: 0, val5: 0 },
    { name: 'C', val1: 0, val2: 0, val3: 0, val4: 854, val5: 0 },
    { name: 'D', val1: 0, val2: 0, val3: 0, val4: 0, val5: 215 },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F4F7FE] overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#242539] flex-shrink-0 flex flex-col overflow-y-auto custom-scrollbar shadow-lg z-20">
        
        {/* LOGO */}
        <div className="h-[70px] flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[24px] font-semibold text-white tracking-wide">EmployX</span>
          </div>
        </div>
        
        {/* MENU */}
        <nav className="flex-1 py-2 text-[14px]">
          {/* Dashboard */}
          <div className="px-6 py-3 flex items-center gap-3 text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <Home size={18} strokeWidth={2} />
            <span>Dashboard</span>
          </div>
          
          {/* Jobs */}
          <div className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Briefcase size={18} strokeWidth={2} />
              <span>Jobs</span>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Candidates */}
          <div className="px-6 py-3 flex items-center gap-3 text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <Users size={18} strokeWidth={2} />
            <span>Candidates</span>
          </div>

          {/* Support */}
          <div>
            <div 
              className={`px-6 py-3 flex items-center justify-between cursor-pointer transition-colors ${openMenus.support ? 'text-[#3B82F6]' : 'text-[#8a8b9f] hover:text-white'}`}
              onClick={() => toggleMenu('support')}
            >
              <div className="flex items-center gap-3">
                <Headset size={18} strokeWidth={2} />
                <span>Support</span>
              </div>
              {openMenus.support ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {openMenus.support && (
              <div className="flex flex-col py-1">
                <div 
                  className={`pl-[46px] pr-6 py-2.5 flex items-center gap-3 cursor-pointer text-[13px] ${activeMenu === 'support-ticket' ? 'text-[#3B82F6]' : 'text-[#8a8b9f] hover:text-white'}`}
                  onClick={() => setActiveMenu('support-ticket')}
                >
                  <div className={`w-1.5 h-1.5 rounded-full border ${activeMenu === 'support-ticket' ? 'border-[#3B82F6] bg-transparent' : 'border-[#8a8b9f]'}`}></div>
                  <span>Support Ticket</span>
                </div>
                <div className="pl-[46px] pr-6 py-2.5 flex items-center gap-3 cursor-pointer text-[13px] text-[#8a8b9f] hover:text-white">
                  <div className="w-1.5 h-1.5 rounded-full border border-[#8a8b9f]"></div>
                  <span>Chat</span>
                </div>
              </div>
            )}
          </div>

          {/* Components Header */}
          <div className="px-6 py-4 text-[11px] font-bold text-[#8a8b9f] uppercase tracking-wider mt-2">
            Components
          </div>

          {/* Features */}
          <div>
            <div 
              className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors"
              onClick={() => toggleMenu('features')}
            >
              <div className="flex items-center gap-3">
                <Edit3 size={18} strokeWidth={2} />
                <span>Features</span>
              </div>
              {openMenus.features ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </div>

          {/* Forms & Charts */}
          <div className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <PieChart size={18} strokeWidth={2} />
              <span>Forms & Charts</span>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Tables */}
          <div className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Grid size={18} strokeWidth={2} />
              <span>Tables</span>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Apps & Widgets */}
          <div className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Layers size={18} strokeWidth={2} />
              <span>Apps & Widgets</span>
            </div>
            <ChevronDown size={14} />
          </div>

          {/* Authentication */}
          <div className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors mt-2">
            <div className="flex items-center gap-3">
              <Lock size={18} strokeWidth={2} />
              <span>Authentication</span>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Miscellaneous */}
          <div className="px-6 py-3 flex items-center justify-between text-[#8a8b9f] hover:text-white cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} strokeWidth={2} />
              <span>Miscellaneous</span>
            </div>
            <ChevronRight size={14} />
          </div>
        </nav>

        {/* Sidebar Bottom Illustration */}
        <div className="mt-8 mb-6 mx-6 relative">
          <svg viewBox="0 0 200 120" className="w-full h-auto opacity-90" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <rect x="20" y="40" width="160" height="60" rx="8" fill="#2C2D43"/>
            
            {/* Connection lines */}
            <path d="M70 70 L100 50 L130 70" stroke="#4A4C6B" strokeWidth="2" strokeDasharray="4 4"/>
            <path d="M70 70 L100 90 L130 70" stroke="#4A4C6B" strokeWidth="2" strokeDasharray="4 4"/>
            
            {/* Avatar 1 (Left) */}
            <circle cx="70" cy="70" r="16" fill="#3B82F6"/>
            <circle cx="70" cy="65" r="6" fill="#1E3A8A"/>
            <path d="M60 80 Q70 70 80 80" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
            
            {/* Avatar 2 (Top Middle) */}
            <circle cx="100" cy="50" r="16" fill="#F43F5E"/>
            <circle cx="100" cy="45" r="6" fill="#881337"/>
            <path d="M90 60 Q100 50 110 60" stroke="#881337" strokeWidth="3" strokeLinecap="round"/>
            
            {/* Avatar 3 (Right) */}
            <circle cx="130" cy="70" r="16" fill="#FBBF24"/>
            <circle cx="130" cy="65" r="6" fill="#78350F"/>
            <path d="M120 80 Q130 70 140 80" stroke="#78350F" strokeWidth="3" strokeLinecap="round"/>
            
            {/* Action elements */}
            <rect x="15" y="60" width="16" height="16" rx="4" fill="#10B981"/>
            <path d="M19 68 L22 71 L28 65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            <rect x="165" y="45" width="16" height="16" rx="4" fill="#3B82F6"/>
            <path d="M169 53 H177 M173 49 V57" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-[70px] bg-white flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-5">
            <button className="text-[#3B82F6] hover:bg-blue-50 p-2 rounded transition-colors">
              <Menu size={20} strokeWidth={2.5} />
            </button>
            <div className="bg-[#F3F4F6] rounded flex items-center px-4 py-2 w-[320px]">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-[13px] text-gray-600 w-full placeholder-gray-500 font-medium" 
              />
              <Search size={16} className="text-gray-400 ml-2" />
            </div>
          </div>
          
          {/* Right: Icons & Avatar */}
          <div className="flex items-center gap-3">
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
            <button onClick={handleLogout} className="text-[#3B82F6] hover:bg-red-50 p-2 rounded-full transition-colors" title="Sign Out">
              <LogOut size={18} strokeWidth={2} />
            </button>
            <div className="w-9 h-9 rounded-full ml-3 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-gray-100 bg-[#E0E7FF]">
               <img src="https://i.pravatar.cc/150?u=employx_admin" alt="User" className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23DBEAFE"/><text x="50" y="65" font-family="Arial" font-size="40" font-weight="bold" fill="%232563EB" text-anchor="middle">A</text></svg>' }} />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#F4F7FE] custom-scrollbar">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-[18px] font-semibold text-gray-800 tracking-wide">Tickets</h1>
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
              <Home size={12} className="text-gray-500" />
              <span>-</span>
              <span className="text-[#3B82F6]">Extra</span>
              <span>-</span>
              <span>Tickets</span>
            </div>
          </div>

          {/* TOP ROW GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            
            {/* 4 STATS CARDS (2x2) */}
            <div className="xl:col-span-1 grid grid-cols-2 gap-4">
              
              {/* Total Tickets */}
              <div className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col h-[150px]">
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                  <h3 className="text-[26px] text-gray-800 font-semibold">+{totalStudents}</h3>
                  <p className="text-gray-500 text-[12px] mt-0.5">Total Tickets</p>
                </div>
                <div className="bg-[#6366F1] text-white p-3 flex justify-center items-center h-[55px]">
                  <Ticket size={24} strokeWidth={2} />
                </div>
              </div>

              {/* Responded */}
              <div className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col h-[150px]">
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                  <h3 className="text-[26px] text-gray-800 font-semibold">{totalAssessed || 175}</h3>
                  <p className="text-gray-500 text-[12px] mt-0.5">Responded</p>
                </div>
                <div className="bg-[#FBBF24] text-white p-3 flex justify-center items-center h-[55px]">
                  <MessageSquare size={24} strokeWidth={2} />
                </div>
              </div>

              {/* Resolve */}
              <div className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col h-[150px]">
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                  <h3 className="text-[26px] text-gray-800 font-semibold">{institutionsCount || 110}</h3>
                  <p className="text-gray-500 text-[12px] mt-0.5">Resolve</p>
                </div>
                <div className="bg-[#10B981] text-white p-3 flex justify-center items-center h-[55px]">
                  <ThumbsUp size={24} strokeWidth={2} />
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col h-[150px]">
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                  <h3 className="text-[26px] text-gray-800 font-semibold">{pendingCount || 59}</h3>
                  <p className="text-gray-500 text-[12px] mt-0.5">Pending</p>
                </div>
                <div className="bg-[#F43F5E] text-white p-3 flex justify-center items-center h-[55px]">
                  <Ticket size={24} strokeWidth={2} />
                </div>
              </div>

            </div>

            {/* PIE CHART */}
            <div className="bg-white rounded-md shadow-sm p-6 xl:col-span-1 h-[316px] flex flex-col">
              <h3 className="text-[14px] text-gray-800 font-medium mb-4">Tickets share per category</h3>
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={75}
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
              <div className="mt-4 space-y-2.5">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[12px] font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-gray-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-white rounded-md shadow-sm p-6 xl:col-span-2 h-[316px] relative">
              <h3 className="text-[14px] text-gray-800 font-medium mb-6">Tickets share per agent</h3>
              <div className="h-[220px] w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={2} barCategoryGap={4}>
                    <Tooltip cursor={{ fill: '#F3F4F6' }} />
                    <Bar dataKey="val1" fill="#6366F1" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="val2" fill="#F97316" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="val3" fill="#10B981" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="val4" fill="#F43F5E" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="val5" fill="#FBBF24" radius={[2, 2, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Absolute Legend matching screenshot */}
              <div className="absolute right-12 bottom-12 flex flex-col gap-2 text-[12px] text-gray-600 font-medium">
                <div className="flex justify-between items-center w-[120px]">
                  <span>Andrew</span> 
                  <span className="bg-[#6366F1] text-white px-1.5 py-0.5 rounded text-[10px]">154</span>
                </div>
                <div className="flex justify-between items-center w-[120px]">
                  <span>Benjamin</span> 
                  <span className="bg-[#8B5CF6] text-white px-1.5 py-0.5 rounded text-[10px]">154</span>
                </div>
                <div className="flex justify-between items-center w-[120px]">
                  <span>Elijah</span> 
                  <span className="bg-[#10B981] text-white px-1.5 py-0.5 rounded text-[10px]">254</span>
                </div>
                <div className="flex justify-between items-center w-[120px]">
                  <span>Chloe</span> 
                  <span className="bg-[#F43F5E] text-white px-1.5 py-0.5 rounded text-[10px]">854</span>
                </div>
                <div className="flex justify-between items-center w-[120px]">
                  <span>Daniel</span> 
                  <span className="bg-[#FBBF24] text-white px-1.5 py-0.5 rounded text-[10px]">215</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM TABLE */}
          <div className="bg-white rounded-md shadow-sm">
            <div className="p-6 pb-2">
                <h2 className="text-[16px] text-gray-800 font-medium">Support Ticket List</h2>
                <p className="text-[13px] text-gray-400 mt-1">List of ticket opend by customers</p>
            </div>
            
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-800 font-medium">Show</span>
                <select className="border border-gray-200 rounded px-2 py-1 text-[13px] outline-none text-gray-600 bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-[13px] text-gray-800 font-medium">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-800 font-medium">Search:</span>
                <input type="text" className="border border-gray-200 rounded px-3 py-1.5 outline-none text-[13px] w-[220px]" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-t border-b border-gray-200 bg-white">
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">ID <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Ope. by <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Cust. Email <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Subject <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Status <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Ass. to <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Date <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                    <th className="px-6 py-3 text-[12px] font-bold text-gray-800">Action <span className="text-gray-300 font-normal ml-1">↓↑</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.slice(0, 10).map((student, idx) => (
                    <tr key={student.id || idx} className="hover:bg-gray-50 bg-white transition-colors">
                      <td className="px-6 py-4 text-[13px] text-gray-800 font-medium">10{idx + 11}</td>
                      <td className="px-6 py-4 text-[13px] text-[#3B82F6] cursor-pointer hover:underline">{student.name || (idx%2===0?'Sophia':'Mia')}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{student.email || 'sophia@gmail.com'}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">How to customize the template?</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] rounded bg-[#FBBF24] text-white font-medium`}>
                          New
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">Elijah</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">14-10-2018</td>
                      <td className="px-6 py-4 text-[13px] text-[#F43F5E] cursor-pointer">
                         <Trash2 size={16} strokeWidth={2} />
                      </td>
                    </tr>
                  ))}
                  {/* Fallback mock data if students are empty to ensure it looks like the screenshot */}
                  {students.length === 0 && [1,2].map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 bg-white transition-colors">
                      <td className="px-6 py-4 text-[13px] text-gray-800 font-medium">1011</td>
                      <td className="px-6 py-4 text-[13px] text-[#3B82F6] cursor-pointer hover:underline">Sophia</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">sophia@gmail.com</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">How to customize the template?</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] rounded bg-[#FBBF24] text-white font-medium`}>
                          New
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">Elijah</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">14-10-2018</td>
                      <td className="px-6 py-4 text-[13px] text-[#F43F5E] cursor-pointer">
                         <Trash2 size={16} strokeWidth={2} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination placeholder as seen in some tables */}
            <div className="p-6 flex justify-end">
              <div className="w-10 h-10 bg-[#FBBF24] rounded-md flex items-center justify-center cursor-pointer shadow-md transform rotate-45 hover:scale-105 transition-transform">
                <ChevronRight size={18} className="text-white transform -rotate-45" strokeWidth={3} />
              </div>
            </div>
          </div>
          
        </main>
      </div>
      
      {/* Custom styles for scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
        aside.custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f4056;
        }
      `}} />
    </div>
  );
}
