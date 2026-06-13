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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1f2937', margin: 0 }}>Dashboard</h1>
              <Home size={14} color="#9ca3af" style={{ marginLeft: '8px' }} />
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>- Overview - Dashboard</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
              {/* Left Column - Stats Cards */}
              <div style={{ gridColumn: 'span 1 / span 1', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                {/* Total Registered */}
                <div className="admin-card">
                  <div className="admin-stats-number">
                    <h3>+{students.length}</h3>
                    <p>Total Registered</p>
                  </div>
                  <div className="admin-stats-bottom bg-indigo">
                    <Users size={24} />
                  </div>
                </div>

                {/* Assessed Students */}
                <div className="admin-card">
                  <div className="admin-stats-number">
                    <h3>{totalAssessed}</h3>
                    <p>Assessed</p>
                  </div>
                  <div className="admin-stats-bottom bg-yellow">
                    <CheckCircle size={24} />
                  </div>
                </div>

                {/* Action Queue */}
                <div className="admin-card">
                  <div className="admin-stats-number">
                    <h3>{pendingCount}</h3>
                    <p>Action Queue</p>
                  </div>
                  <div className="admin-stats-bottom bg-green">
                    <MessageSquare size={24} />
                  </div>
                </div>

                {/* Institutions */}
                <div className="admin-card">
                  <div className="admin-stats-number">
                    <h3>{institutionsCount}</h3>
                    <p>Institutions</p>
                  </div>
                  <div className="admin-stats-bottom bg-rose">
                    <Shield size={24} />
                  </div>
                </div>
              </div>

              {/* Middle Column - Pie Chart */}
              <div className="admin-card" style={{ padding: '24px', gridColumn: 'span 1 / span 1', height: '320px' }}>
                <h3 style={{ fontSize: '15px', color: '#374151', margin: '0 0 8px 0' }}>Platform Adoption</h3>
                <div style={{ height: '200px', position: 'relative' }}>
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
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pieData.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></div>
                        <span style={{ color: '#4b5563' }}>{item.name}</span>
                      </div>
                      <span style={{ color: '#4b5563', fontWeight: '500' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Bar Chart */}
              <div className="admin-card" style={{ padding: '24px', gridColumn: 'span 2 / span 2', height: '320px', position: 'relative' }}>
                <h3 style={{ fontSize: '15px', color: '#374151', margin: '0 0 24px 0' }}>Monthly Engagement</h3>
                <div style={{ height: '220px' }}>
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
                <div style={{ position: 'absolute', right: '24px', top: '24px', display: 'flex', gap: '16px', fontSize: '11px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#6366F1', borderRadius: '50%' }}></span> Registered</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%' }}></span> Assessed</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#F43F5E', borderRadius: '50%' }}></span> Sessions</div>
                </div>
              </div>
            </div>

            {/* Bottom Table Section */}
            <div className="admin-card" style={{ marginTop: '24px' }}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h2 style={{ fontSize: '16px', color: '#1f2937', margin: 0 }}>Student Master Directory</h2>
                  <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Manage {students.length} registered students</p>
              </div>
              <div style={{ padding: '0 20px 16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>Show</span>
                  <select style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', outline: 'none', background: '#fff' }}>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>entries</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>Search:</span>
                  <input type="text" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 12px', outline: 'none', fontSize: '13px', width: '200px' }} />
                </div>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>RIASEC Code</th>
                      <th>Counselling Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 10).map((student, idx) => (
                      <tr key={student.id || idx}>
                        <td>10{idx + 11}</td>
                        <td className="text-blue" style={{ fontWeight: '500', cursor: 'pointer' }}>{student.name || 'Unknown'}</td>
                        <td>{student.email || 'N/A'}</td>
                        <td>
                          <span className={`admin-status-pill ${student.riasecCode ? 'admin-status-pill-green' : 'admin-status-pill-yellow'}`}>
                            {student.riasecCode || 'Pending'}
                          </span>
                        </td>
                        <td>{student.counsellingStatus}</td>
                        <td>
                           <button className="admin-action-btn admin-action-btn-rose">
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: '32px', textAlign: 'center' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="admin-table-btn admin-table-btn-primary">
                  All Students
                </button>
                <button className="admin-table-btn admin-table-btn-outline">
                  Assessed
                </button>
                <button className="admin-table-btn admin-table-btn-outline">
                  Pending
                </button>
              </div>
              <button className="admin-table-btn admin-table-btn-danger">
                Add Student
              </button>
            </div>
            
            {/* Top Stat tabs */}
            <div className="admin-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', marginBottom: '24px', flexDirection: 'row' }}>
               <div style={{ background: '#EFF6FF', textAlign: 'center', padding: '16px 8px', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '20px', color: '#1f2937', fontWeight: '500' }}>{students.length}</div>
                 <div style={{ fontSize: '12px', color: '#1f2937', fontWeight: '500', marginTop: '4px' }}>Total Students</div>
               </div>
               <div style={{ background: '#ffffff', textAlign: 'center', padding: '16px 8px', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '20px', color: '#1f2937', fontWeight: '500' }}>{students.filter(s => s.riasecCode).length}</div>
                 <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginTop: '4px' }}>Assessed</div>
               </div>
               <div style={{ background: '#ffffff', textAlign: 'center', padding: '16px 8px', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '20px', color: '#1f2937', fontWeight: '500' }}>{students.filter(s => !s.riasecCode).length}</div>
                 <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginTop: '4px' }}>Pending</div>
               </div>
               <div style={{ background: '#ffffff', textAlign: 'center', padding: '16px 8px', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '20px', color: '#1f2937', fontWeight: '500' }}>{students.filter(s => s.assignedCounsellorId).length}</div>
                 <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginTop: '4px' }}>Assigned</div>
               </div>
               <div style={{ background: '#ffffff', textAlign: 'center', padding: '16px 8px', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '20px', color: '#1f2937', fontWeight: '500' }}>{students.filter(s => !s.assignedCounsellorId).length}</div>
                 <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', marginTop: '4px' }}>Unassigned</div>
               </div>
               <div style={{ background: '#ffffff', textAlign: 'center', padding: '16px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '20px', color: '#9ca3af', fontWeight: '500' }}>{institutionsCount}</div>
                 <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', marginTop: '4px' }}>Institutions</div>
               </div>
            </div>

            <div className="admin-card">
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '48px' }}><input type="checkbox" style={{ width: '16px', height: '16px' }} /></th>
                      <th><span style={{ color: '#9ca3af', fontWeight: 'normal', marginRight: '4px' }}>↓↑</span> Name</th>
                      <th><span style={{ color: '#9ca3af', fontWeight: 'normal', marginRight: '4px' }}>↓↑</span> Email</th>
                      <th><span style={{ color: '#9ca3af', fontWeight: 'normal', marginRight: '4px' }}>↓↑</span> RIASEC</th>
                      <th><span style={{ color: '#9ca3af', fontWeight: 'normal', marginRight: '4px' }}>↓↑</span> Status</th>
                      <th><span style={{ color: '#9ca3af', fontWeight: 'normal', marginRight: '4px' }}>↓↑</span> Complete?</th>
                      <th><span style={{ color: '#9ca3af', fontWeight: 'normal', marginRight: '4px' }}>↓↑</span> Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={student.id || idx}>
                        <td><input type="checkbox" style={{ width: '16px', height: '16px' }} /></td>
                        <td style={{ color: '#1f2937', fontWeight: '500' }}>{student.name || 'Unknown'}</td>
                        <td>{student.email}</td>
                        <td>
                          {student.riasecCode ? (
                            <span className="admin-status-pill admin-status-pill-green">{student.riasecCode}</span>
                          ) : (
                            <span className="admin-status-pill admin-status-pill-yellow">Pending</span>
                          )}
                        </td>
                        <td>{student.counsellingStatus}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {student.riasecCode ? (
                              <button className="admin-action-btn admin-action-btn-green"><Check size={14} strokeWidth={3} /></button>
                            ) : (
                              <button className="admin-action-btn admin-action-btn-rose"><X size={14} strokeWidth={3} /></button>
                            )}
                            <button className="admin-action-btn admin-action-btn-blue" style={{ fontSize: '12px' }}>?</button>
                          </div>
                        </td>
                        <td>
                          <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ padding: '32px', textAlign: 'center' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{allowedTabs.find(t => t.id === activeTab)?.label || 'Module'}</h1>
              <Home size={14} color="#9ca3af" style={{ marginLeft: '8px' }} />
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>- {allowedTabs.find(t => t.id === activeTab)?.label || 'Module'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
              <div className="admin-card" style={{ padding: '24px', height: '160px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <h3 style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500', margin: 0 }}>Box progress</h3>
                 </div>
                 <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                   This module ({allowedTabs.find(t => t.id === activeTab)?.label}) is currently under construction.
                   It has been styled to match the EmployX dashboard perfectly.
                 </p>
              </div>

              <div className="admin-card" style={{ padding: '24px', height: '160px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <h3 style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500', margin: 0 }}>Box switch</h3>
                 </div>
                 <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
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
    <div className="admin-layout">
      
      {/* 1. FIXED SIDEBAR */}
      <aside className="admin-sidebar">
        {/* Logo Section */}
        <div className="admin-sidebar-logo" onClick={() => setActiveTab('overview')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '22px', fontWeight: '600', color: '#ffffff', letterSpacing: '0.025em' }}>EmployX</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="admin-sidebar-nav custom-scrollbar">
          {allowedTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? 'active' : ''}
              >
                {isActive && <div className="left-border"></div>}
                <div className="icon-text">
                  <span style={{ color: isActive ? '#3B82F6' : 'inherit' }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </div>
                {!isActive && <ChevronRight size={14} color="#51546E" />}
                {isActive && <ChevronDown size={14} color="#3B82F6" />}
              </button>
            )
          })}
        </nav>
        
        {/* Bottom illustration placeholder */}
        <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', justifyContent: 'center', paddingBottom: '32px', opacity: 0.8 }}>
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="80" height="40" rx="4" fill="#2C2E4A"/>
            <circle cx="60" cy="40" r="10" fill="#3B82F6"/>
            <path d="M30 60 L40 50 L80 50 L90 60" stroke="#F43F5E" strokeWidth="2"/>
          </svg>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="admin-main-area">
        
        {/* TOP NAVBAR */}
        <header className="admin-header">
          {/* Left: Hamburger & Search */}
          <div className="admin-header-left">
            <button className="admin-icon-btn">
              <Menu size={22} strokeWidth={2} />
            </button>
            <div className="admin-search-bar">
              <input type="text" placeholder="Search" />
              <Search size={16} color="#9ca3af" style={{ marginLeft: '8px' }} />
            </div>
          </div>
          
          {/* Right: Icons & Avatar */}
          <div className="admin-header-right">
            <button className="admin-icon-btn">
              <Moon size={18} strokeWidth={2} />
            </button>
            <button className="admin-icon-btn" style={{ position: 'relative' }}>
              <Bell size={18} strokeWidth={2} />
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', backgroundColor: '#F43F5E', borderRadius: '50%', border: '1px solid #ffffff' }}></span>
            </button>
            <button className="admin-icon-btn">
              <MessageSquare size={18} strokeWidth={2} />
            </button>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', fontSize: '18px' }}>
              🇺🇸
            </button>
            <button className="admin-icon-btn">
              <Maximize size={18} strokeWidth={2} />
            </button>
            <button className="admin-icon-btn">
              <Sliders size={18} strokeWidth={2} />
            </button>
            <button onClick={onBackToApp} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '0 8px' }}>Live Site</button>
            <button onClick={handleLogout} className="admin-icon-btn" style={{ color: '#F43F5E' }} title="Sign Out">
              <LogOut size={18} strokeWidth={2} />
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', marginLeft: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', backgroundColor: '#dbeafe' }}>
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23DBEAFE"/><text x="50" y="65" font-family="Arial" font-size="40" font-weight="bold" fill="%232563EB" text-anchor="middle">A</text></svg>' }} />
            </div>
          </div>
        </header>

        {/* MAIN TAB CONTENT */}
        <main className="admin-main-content">
          {renderTabContent()}
        </main>
      </div>
      
    </div>
  );
}
