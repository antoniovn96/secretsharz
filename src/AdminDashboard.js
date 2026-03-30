import React, { useState, useEffect, useRef, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

const COLLECTIONS = {
  USERS: 'users',
  INSTITUTIONS: 'institutions',
  SETTINGS: 'system_settings'
};

// Mock Counsellors for Assignment System (In production, fetch from a 'staff' collection)
const COUNSELLORS = [
  { id: 'c1', name: 'Dr. Sarah Menon' },
  { id: 'c2', name: 'Arjun Patel' },
  { id: 'c3', name: 'Priya Sharma' }
];

const STYLES = `
  :root {
    --bg: #0f172a; --sidebar: #1e1b4b; --card-bg: #1e293b; 
    --primary: #8b5cf6; --secondary: #06b6d4; --accent: #f43f5e;
    --text-main: #f8fafc; --text-muted: #94a3b8; --border: #334155;
    --success: #10b981; --warning: #f59e0b; --danger: #ef4444;
  }
  .admin-root { background-color: var(--bg); font-family: 'Nunito', sans-serif; color: var(--text-main); margin: 0; display: flex; height: 100vh; overflow: hidden; }
  
  /* --- SIDEBAR --- */
  .admin-sidebar { width: 260px; background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; z-index: 1000; flex-shrink: 0;}
  .admin-sidebar::-webkit-scrollbar { width: 4px; }
  .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  .admin-brand { padding: 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px; position: sticky; top:0; background: var(--sidebar); z-index: 10; cursor: pointer; transition: opacity 0.2s;}
  .admin-brand:hover { opacity: 0.8; }
  .admin-brand h2 { margin: 0; font-size: 1.3rem; background: -webkit-linear-gradient(45deg, var(--secondary), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
  .nav-btn { background: transparent; color: var(--text-muted); border: none; text-align: left; padding: 12px 25px; font-size: 0.95rem; font-weight: bold; cursor: pointer; transition: 0.2s; border-left: 4px solid transparent; width: 100%; display: flex; align-items: center; gap: 10px; }
  .nav-btn:hover { background: rgba(255,255,255,0.05); color: white; }
  .nav-btn.active { background: rgba(139, 92, 246, 0.1); color: var(--primary); border-left-color: var(--primary); }

  /* --- MAIN LAYOUT & TOP HEADER --- */
  .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;}
  .top-header { background: var(--card-bg); height: 70px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; flex-shrink: 0;}
  .header-actions { display: flex; align-items: center; gap: 15px; }
  .site-link { color: var(--secondary); text-decoration: none; font-weight: bold; padding: 8px 12px; border-radius: 8px; background: rgba(6, 182, 212, 0.1); transition: 0.2s; font-size: 0.9rem;}
  .site-link:hover { background: rgba(6, 182, 212, 0.2); }
  
  .notify-bell { position: relative; background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 5px; }
  .notify-bell:hover { color: white; }
  .notify-badge { position: absolute; top: 0; right: 0; background: var(--accent); color: white; font-size: 0.6rem; font-weight: bold; height: 16px; width: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

  .dropdown-content { position: absolute; right: 0; background-color: var(--card-bg); min-width: 200px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5); z-index: 100; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; margin-top: 10px;}
  .dropdown-content button, .dropdown-content .notify-item { background:transparent; border:none; width:100%; text-align:left; color: var(--text-main); padding: 12px 16px; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.05); cursor:pointer;}
  .dropdown-content button:hover, .dropdown-content .notify-item:hover { background-color: rgba(255,255,255,0.05); color: var(--primary); }
  .avatar-btn { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary); cursor: pointer; object-fit: cover; background: #000; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;}

  /* --- CONTENT AREA --- */
  .main-content { flex: 1; padding: 20px; overflow-y: auto; position: relative;}
  .header-bar { margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end;}
  .header-bar h1 { margin: 0 0 5px 0; font-size: 1.5rem; color: white;}
  .header-bar p { margin: 0; color: var(--text-muted); font-size: 0.9rem;}
  
  .admin-card { background: var(--card-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow-x: auto;}
  .admin-card h3 { margin-top: 0; color: white; border-bottom: 1px solid var(--border); padding-bottom: 10px; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center; }
  
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px; }
  .kpi-box { background: linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%); padding: 15px; border-radius: 12px; border: 1px solid var(--border); cursor: pointer; transition: transform 0.2s, border-color 0.2s; }
  .kpi-box:hover { transform: translateY(-3px); border-color: var(--primary); }
  .kpi-box h4 { margin:0 0 5px 0; color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;}
  .kpi-box .val { font-size:1.5rem; font-weight:900; color:white; }
  
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3col { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

  .form-group { margin-bottom: 15px; }
  .form-label { display: block; font-weight: 700; margin-bottom: 6px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;}
  .form-input, .form-select, .form-textarea { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; color: white; background: #0f172a; box-sizing: border-box; font-family: inherit;}
  .form-input:focus, .form-select:focus { border-color: var(--primary); outline: none; }
  .search-bar { display: flex; gap: 10px; margin-bottom: 20px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); }
  
  .admin-btn { background: linear-gradient(45deg, var(--primary), #a855f7); color: white; border: none; padding: 10px 20px; font-size: 0.95rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .admin-btn:hover { opacity: 0.9; transform: translateY(-2px); }
  .admin-btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main); padding: 10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; display: inline-flex; align-items: center; gap: 8px;}
  .admin-btn-outline:hover { border-color: var(--primary); color: var(--primary); }

  .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.85rem; min-width: 600px;}
  .data-table th, .data-table td { padding: 12px 10px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; background: rgba(0,0,0,0.2);}
  .data-table tr.clickable:hover { background: rgba(139, 92, 246, 0.1); cursor: pointer; }

  .admin-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; white-space: nowrap;}
  .badge-warn { background: rgba(245, 158, 11, 0.2); color: var(--warning); border: 1px solid var(--warning);}
  .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); border: 1px solid var(--success);}
  .badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger);}
  .badge-neutral { background: rgba(148, 163, 184, 0.2); color: var(--text-muted); border: 1px solid var(--text-muted);}

  /* Modals & Tabs */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .modal-content { background: var(--card-bg); width: 100%; max-width: 700px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
  .modal-header { padding: 20px 20px 0 20px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); }
  .modal-tabs { display: flex; gap: 20px; margin-top: 15px; }
  .modal-tab { background: none; border: none; color: var(--text-muted); font-weight: bold; padding: 10px 0; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.2s; }
  .modal-tab.active { color: white; border-bottom-color: var(--primary); }
  .close-btn { background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; position: absolute; right: 20px; top: 15px;}
  .modal-body { padding: 20px; overflow-y: auto; flex: 1; }

  /* Timeline */
  .timeline { border-left: 2px solid var(--border); margin-left: 10px; padding-left: 20px; position: relative; }
  .timeline-item { margin-bottom: 20px; position: relative; }
  .timeline-dot { position: absolute; left: -27px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid var(--card-bg); }
  .timeline-date { font-size: 0.75rem; color: var(--text-muted); font-weight: bold; }
  
  /* Funnel */
  .funnel-container { display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px; border: 1px solid var(--border); }
  .funnel-step { text-align: center; flex: 1; position: relative; }
  .funnel-step:not(:last-child)::after { content: '➔'; position: absolute; right: -10px; top: 30%; color: var(--border); font-size: 1.5rem; }
  .funnel-val { font-size: 1.8rem; font-weight: 900; color: white; }
  .funnel-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

  .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.5; }
`;

const ALL_NAV_TABS = [
  { id: 'overview', icon: '🏠', label: 'Overview Dashboard', roles: ['super_admin', 'counsellor'] },
  { id: 'students', icon: '🎓', label: 'Student Master', roles: ['super_admin', 'counsellor'] },
  { id: 'counselling', icon: '🧠', label: 'Counselling Workflow', roles: ['super_admin', 'counsellor'] },
  { id: 'analytics', icon: '📊', label: 'Analytics & Funnel', roles: ['super_admin'] },
  { id: 'institutions', icon: '🏫', label: 'Institution Control', roles: ['super_admin'] },
  { id: 'settings', icon: '⚙️', label: 'System Settings', roles: ['super_admin'] },
];

export default function AdminDashboard({ user, onBackToApp }) {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  
  // Data
  const [institutions, setInstitutions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile & RBAC
  const [profile, setProfile] = useState({ name: user?.displayName || 'User', role: 'super_admin' });
  const isCounsellor = profile.role === 'counsellor';
  const allowedTabs = ALL_NAV_TABS.filter(t => t.roles.includes(profile.role));

  // Search & Filter (Debounced)
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals & Forms
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalTab, setModalTab] = useState('overview');
  const [newSession, setNewSession] = useState({ date: '', duration: '30', outcome: '' });

  // Notifications
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const searchRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 🚀 6. PRO UX: Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🚀 Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // URL Routing
  useEffect(() => {
    const hash = window.location.hash.replace('#admin/', '');
    if (allowedTabs.find(t => t.id === hash)) setActiveTab(hash);
  }, [allowedTabs]);

  useEffect(() => {
    window.location.hash = `#admin/${activeTab}`;
  }, [activeTab]);

  // Toast Auto-Clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- FETCH DATA ---
  useEffect(() => {
    let isMounted = true;
    const fetchPlatformData = async () => {
      setLoadingData(true);
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, "superadmin_profile"));
        if (isMounted && docSnap.exists()) setProfile(prev => ({ ...prev, ...docSnap.data() }));

        const instSnap = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS));
        if (isMounted) setInstitutions(instSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const stuSnap = await getDocs(collection(db, COLLECTIONS.USERS));
        if (isMounted) {
          let allStudents = stuSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          // Role-Based Filtering: If counsellor, only show assigned students
          if (isCounsellor) {
            allStudents = allStudents.filter(s => s.assignedCounsellorId === user.uid);
          }

          // Mock empty arrays for new features if they don't exist in DB yet
          const formatted = allStudents.map(s => ({
            ...s,
            counsellingStatus: s.counsellingStatus || 'Not Started',
            sessions: s.sessions || [],
            assignedCounsellorId: s.assignedCounsellorId || ''
          }));
          
          setStudents(formatted);
        }
      } catch (e) {
        console.error("Data fetch error", e);
        setToast({ type: 'error', message: 'Failed to load platform data.'});
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };
    fetchPlatformData();
    return () => { isMounted = false; };
  }, [isCounsellor, user.uid]);

  // --- ACTIONS ---
  const handleUpdateStudent = async (studentId, updates) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, studentId), updates);
      setStudents(students.map(s => s.id === studentId ? { ...s, ...updates } : s));
      setSelectedStudent(prev => prev ? { ...prev, ...updates } : null);
      setToast({ type: 'success', message: 'Student record updated.' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update record.' });
    }
  };

  const handleAddSession = async () => {
    if (!newSession.date || !newSession.outcome) return setToast({type: 'error', message: 'Fill date & outcome.'});
    const updatedSessions = [...(selectedStudent.sessions || []), { id: Date.now(), ...newSession }];
    
    // Auto-update status to "In Progress" when a session is logged
    await handleUpdateStudent(selectedStudent.id, { 
      sessions: updatedSessions,
      counsellingStatus: selectedStudent.counsellingStatus === 'Not Started' ? 'In Progress' : selectedStudent.counsellingStatus
    });
    setNewSession({ date: '', duration: '30', outcome: '' });
  };

  // --- DERIVED METRICS ---
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = (s.name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) || (s.email || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.counsellingStatus === statusFilter;
      return matchesSearch && matchesStatus && s.riasecCode; // Only show assessed in table
    });
  }, [students, debouncedSearch, statusFilter]);

  const pendingInterventions = students.filter(s => s.counsellingStatus === 'Not Started' && s.riasecCode).length;
  
  // Analytics Funnel
  const totalRegistered = students.length;
  const totalAssessed = students.filter(s => s.riasecCode).length;
  const totalCounselled = students.filter(s => s.counsellingStatus !== 'Not Started').length;
  const totalCompleted = students.filter(s => s.counsellingStatus === 'Completed').length;

  // Notifications Mock
  const notifications = [
    { id: 1, text: `${pendingInterventions} students need counsellor assignment.`, type: 'warning' },
    { id: 2, text: "System backup completed successfully.", type: 'success' }
  ].filter(n => n.text[0] !== '0');

  // --- RENDERERS ---
  const renderTabContent = () => {
    if (loadingData) return <div className="empty-state"><div className="empty-icon">⏳</div><h2>Loading Platform Data...</h2></div>;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <div><h1>Overview Dashboard</h1><p>Real-time snapshot of your assigned metrics.</p></div>
            </div>

            <div className="kpi-grid">
              {!isCounsellor && (
                <div className="kpi-box" style={{borderTop: '3px solid var(--primary)'}} onClick={() => setActiveTab('institutions')}>
                  <h4>Institutions</h4><div className="val">{institutions.length}</div>
                </div>
              )}
              <div className="kpi-box" style={{borderTop: '3px solid var(--success)'}} onClick={() => setActiveTab('students')}>
                <h4>Your Students</h4><div className="val">{totalAssessed}</div>
              </div>
              <div className="kpi-box" style={{borderTop: '3px solid var(--danger)'}} onClick={() => { setStatusFilter('Not Started'); setActiveTab('students'); }}>
                <h4>Pending Interventions</h4>
                <div className="val" style={{color: pendingInterventions > 0 ? 'var(--danger)' : 'white'}}>{pendingInterventions}</div>
              </div>
            </div>

            <div className="grid-2col">
              <div className="admin-card" style={{borderTop: '4px solid var(--warning)'}}>
                <h3>Action Queue</h3>
                {pendingInterventions > 0 ? (
                  <div className="list-item clickable" onClick={() => { setStatusFilter('Not Started'); setActiveTab('students'); }}>
                    <span>Unassigned Students</span> 
                    <span className="admin-badge badge-danger">{pendingInterventions} Students</span>
                  </div>
                ) : (
                   <div className="empty-state" style={{padding: '20px'}}><div className="empty-icon" style={{fontSize:'2rem', marginBottom: '5px'}}>🎉</div><p style={{margin:0}}>Inbox Zero! All clear.</p></div>
                )}
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <div><h1>Student Master Directory</h1><p>Search, filter, and manage all assessed students.</p></div>
            </div>
            
            <div className="admin-card" style={{ borderTop: '4px solid var(--success)' }}>
              <div className="search-bar">
                <input 
                  type="text" 
                  id="student-search"
                  ref={searchRef}
                  className="form-input" 
                  placeholder="🔍 Search name (Press '/' to focus)..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{flex: 2}}
                />
                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{flex: 1}}>
                  <option value="All">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">👻</div><h3>No students found</h3><p>Try adjusting your search or filters.</p></div>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>RIASEC</th><th>Status</th><th>Counsellor</th></tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="clickable" onClick={() => { setSelectedStudent(student); setModalTab('overview'); }}>
                          <td style={{fontWeight: 'bold'}}>{student.name || 'Unknown'}</td>
                          <td style={{color: 'var(--text-muted)'}}>{student.email}</td>
                          <td><span className="admin-badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)'}}>{student.riasecCode}</span></td>
                          <td><span className={`admin-badge ${student.counsellingStatus === 'Not Started' ? 'badge-danger' : student.counsellingStatus === 'In Progress' ? 'badge-warn' : 'badge-success'}`}>{student.counsellingStatus}</span></td>
                          <td style={{color: 'var(--text-muted)'}}>{COUNSELLORS.find(c=>c.id===student.assignedCounsellorId)?.name || 'Unassigned'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="tab-content">
            <div className="header-bar"><h1>Analytics & Conversion</h1><p>Platform-wide pipeline and completion metrics.</p></div>
            <div className="admin-card" style={{borderTop: '4px solid var(--secondary)'}}>
              <h3>Conversion Funnel</h3>
              <div className="funnel-container">
                <div className="funnel-step"><div className="funnel-val">{totalRegistered}</div><div className="funnel-label">Registered</div></div>
                <div className="funnel-step"><div className="funnel-val" style={{color:'var(--primary)'}}>{totalAssessed}</div><div className="funnel-label">Assessed</div></div>
                <div className="funnel-step"><div className="funnel-val" style={{color:'var(--warning)'}}>{totalCounselled}</div><div className="funnel-label">In Counselling</div></div>
                <div className="funnel-step"><div className="funnel-val" style={{color:'var(--success)'}}>{totalCompleted}</div><div className="funnel-label">Completed</div></div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="tab-content">
            <div className="header-bar"><h1>{allowedTabs.find(t => t.id === activeTab)?.label}</h1><p>Module configuration.</p></div>
            <div className="empty-state"><div className="empty-icon">🚧</div><h3>Under Construction</h3><p>Enterprise features are locked for your current role tier.</p></div>
          </div>
        );
    }
  };

  return (
    <div className="admin-root">
      
      {/* 🧩 SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-brand" onClick={() => setActiveTab('overview')}>
          <h2>Career Intel ⚡</h2>
        </div>
        {allowedTabs.map(tab => (
          <button 
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-main">
        {/* 🧩 TOP HEADER */}
        <div className="top-header">
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <span className={`admin-badge ${isCounsellor ? 'badge-primary' : 'badge-danger'}`}>
              Role: {profile.role?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="header-actions">
            {/* Notifications Dropdown */}
            <div style={{position: 'relative'}}>
              <button className="notify-bell" onClick={() => setNotifyOpen(!notifyOpen)}>
                🔔 {notifications.length > 0 && <div className="notify-badge">{notifications.length}</div>}
              </button>
              {notifyOpen && (
                <div className="dropdown-content" style={{width: '300px'}}>
                  <div style={{padding: '10px 15px', borderBottom: '1px solid var(--border)', fontWeight: 'bold'}}>Notifications</div>
                  {notifications.length === 0 ? <div style={{padding: '15px', color:'var(--text-muted)'}}>No new alerts</div> : 
                    notifications.map(n => <button key={n.id} className="notify-item" style={{color: n.type==='warning'?'var(--warning)':'var(--success)'}}>{n.text}</button>)
                  }
                </div>
              )}
            </div>

            <button onClick={onBackToApp} className="site-link" style={{border:'none', cursor:'pointer', fontFamily:'inherit'}}>🌐 Live Site</button>
            <div className="profile-menu">
              <div className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>{profile.name.charAt(0).toUpperCase()}</div>
              {profileOpen && (
                <div className="dropdown-content">
                  <div style={{padding: '15px', borderBottom: '1px solid var(--border)'}}><strong style={{color:'white'}}>{profile.name}</strong></div>
                  <button style={{color: 'var(--danger)'}} onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
          {renderTabContent()}
        </div>
      </div>

      {/* 🚀 1. MASSIVE STUDENT MODAL UPGRADE */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            
            <div className="modal-header" style={{position:'relative'}}>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
              <h2 style={{fontSize:'1.5rem'}}>🎓 {selectedStudent.name || 'Unknown'}</h2>
              <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>{selectedStudent.email}</span>
              
              {/* MODAL TABS */}
              <div className="modal-tabs">
                <button className={`modal-tab ${modalTab === 'overview' ? 'active' : ''}`} onClick={()=>setModalTab('overview')}>Overview</button>
                <button className={`modal-tab ${modalTab === 'counselling' ? 'active' : ''}`} onClick={()=>setModalTab('counselling')}>Counselling Log</button>
                <button className={`modal-tab ${modalTab === 'documents' ? 'active' : ''}`} onClick={()=>setModalTab('documents')}>Documents</button>
              </div>
            </div>

            <div className="modal-body">
              
              {/* OVERVIEW TAB */}
              {modalTab === 'overview' && (
                <div className="anim-up">
                  <div className="grid-2col" style={{marginBottom: '20px'}}>
                    <div style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)'}}>
                      <label className="form-label">RIASEC Profile</label>
                      <div style={{fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '5px'}}>{selectedStudent.riasecCode}</div>
                      <div style={{color: 'var(--gold)', fontWeight: 'bold'}}>{selectedStudent.bestCareer || 'Pending Match'}</div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Assign Counsellor</label>
                      <select 
                        className="form-select" 
                        value={selectedStudent.assignedCounsellorId || ''} 
                        onChange={(e) => handleUpdateStudent(selectedStudent.id, { assignedCounsellorId: e.target.value })}
                      >
                        <option value="">-- Unassigned --</option>
                        {COUNSELLORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Status</label>
                    <select className="form-select" value={selectedStudent.counsellingStatus} onChange={(e) => handleUpdateStudent(selectedStudent.id, {counsellingStatus: e.target.value})}>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}

              {/* COUNSELLING TAB */}
              {modalTab === 'counselling' && (
                <div className="anim-up">
                  {/* Session Timeline */}
                  <div style={{marginBottom: '30px'}}>
                    <h3 style={{marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: '10px'}}>Session History</h3>
                    {!selectedStudent.sessions || selectedStudent.sessions.length === 0 ? (
                      <p style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>No sessions logged yet.</p>
                    ) : (
                      <div className="timeline">
                        {selectedStudent.sessions.map((sess, idx) => (
                          <div key={idx} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">{new Date(sess.date).toLocaleDateString('en-GB')} • {sess.duration} mins</div>
                            <div style={{background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '5px'}}>
                              {sess.outcome}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Session Form */}
                  <div style={{background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)'}}>
                    <h4 style={{marginTop: 0, color: 'var(--primary)'}}>➕ Log New Session</h4>
                    <div className="grid-2col">
                      <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={newSession.date} onChange={e=>setNewSession({...newSession, date: e.target.value})}/></div>
                      <div className="form-group"><label className="form-label">Duration (mins)</label><input type="number" className="form-input" value={newSession.duration} onChange={e=>setNewSession({...newSession, duration: e.target.value})}/></div>
                    </div>
                    <div className="form-group"><label className="form-label">Session Notes / Outcome</label><textarea className="form-textarea" rows="2" placeholder="Discussed parental pressure regarding science stream..." value={newSession.outcome} onChange={e=>setNewSession({...newSession, outcome: e.target.value})}></textarea></div>
                    <button className="admin-btn" style={{width:'100%'}} onClick={handleAddSession}>Save Session</button>
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {modalTab === 'documents' && (
                <div className="anim-up empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>Document Vault</h3>
                  <p>Upload psychometric reports and consent forms here.</p>
                  <button className="admin-btn-outline" disabled>Cloud Storage Disabled</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
        </div>
      )}
    </div>
  );
}
