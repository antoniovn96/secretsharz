import React, { useState, useEffect, useRef, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

const COLLECTIONS = {
  USERS: 'users',
  INSTITUTIONS: 'institutions',
  SETTINGS: 'system_settings'
};

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

  .profile-menu { position: relative; display: inline-block; }
  .avatar-btn { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary); cursor: pointer; object-fit: cover; background: #000; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;}
  .dropdown-content { position: absolute; right: 0; background-color: var(--card-bg); min-width: 200px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5); z-index: 100; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; margin-top: 10px;}
  .dropdown-content button { background:transparent; border:none; width:100%; text-align:left; color: var(--text-main); padding: 12px 16px; font-size: 0.9rem; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); cursor:pointer;}
  .dropdown-content button:hover { background-color: rgba(255,255,255,0.05); color: var(--primary); }

  .welcome-banner { background: linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.05)); border-bottom: 1px solid var(--border); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;}
  .quote-text { font-size: 0.95rem; font-style: italic; color: var(--text-main); margin: 0; }
  .quote-text strong { color: var(--primary); font-style: normal;}
  .clock-container { font-family: monospace; font-size: 1rem; color: var(--secondary); font-weight: bold; background: rgba(0,0,0,0.2); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border);}

  /* --- CONTENT AREA --- */
  .main-content { flex: 1; padding: 20px; overflow-y: auto; position: relative;}
  .header-bar { margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end;}
  .header-bar h1 { margin: 0 0 5px 0; font-size: 1.5rem; color: white;}
  .header-bar p { margin: 0; color: var(--text-muted); font-size: 0.9rem;}
  
  .tab-content { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  
  /* UI COMPONENTS */
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
  .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .admin-btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main); padding: 10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; display: inline-flex; align-items: center; gap: 8px;}
  .admin-btn-outline:hover { border-color: var(--primary); color: var(--primary); }

  .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.85rem; min-width: 600px;}
  .data-table th, .data-table td { padding: 12px 10px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; background: rgba(0,0,0,0.2);}
  .data-table tr { transition: background 0.2s; }
  .data-table tr.clickable:hover { background: rgba(139, 92, 246, 0.1); cursor: pointer; }

  .admin-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; white-space: nowrap;}
  .badge-warn { background: rgba(245, 158, 11, 0.2); color: var(--warning); border: 1px solid var(--warning);}
  .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); border: 1px solid var(--success);}
  .badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger);}
  .badge-neutral { background: rgba(148, 163, 184, 0.2); color: var(--text-muted); border: 1px solid var(--text-muted);}

  .list-item { padding: 12px 10px; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; border-radius: 6px;}
  .list-item.clickable:hover { background: rgba(255,255,255,0.05); cursor: pointer; }
  .list-item:last-child { border-bottom: none; }

  /* Pagination */
  .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.85rem; }
  .page-controls { display: flex; gap: 10px; }
  .page-btn { background: var(--sidebar); color: white; border: 1px solid var(--border); padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
  .page-btn:hover:not(:disabled) { background: var(--primary); border-color: var(--primary); }
  .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Modals */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .modal-content { background: var(--card-bg); width: 100%; max-width: 600px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
  .modal-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
  .modal-header h2 { margin: 0; font-size: 1.2rem; color: white; }
  .close-btn { background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; transition: color 0.2s; }
  .close-btn:hover { color: var(--danger); }
  .modal-body { padding: 20px; overflow-y: auto; flex: 1; }
  .modal-footer { padding: 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; background: rgba(0,0,0,0.2); }

  /* Analytics Charts */
  .bar-chart { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
  .bar-row { display: flex; align-items: center; gap: 15px; }
  .bar-label { width: 60px; font-weight: bold; color: var(--text-muted); font-size: 0.85rem; }
  .bar-track { flex: 1; height: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 6px; transition: width 1s ease-out; }
  .bar-value { width: 40px; text-align: right; font-weight: bold; font-size: 0.85rem; }

  /* Profile Accordions */
  .profile-acc { background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 15px; overflow: hidden; }
  .profile-acc summary { padding: 18px 20px; font-weight: 800; font-size: 1.05rem; color: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none; outline: none; background: var(--card-bg); }
  .profile-acc summary::-webkit-details-marker { display: none; }
  .profile-acc summary::after { content: '+'; color: var(--primary); font-size: 1.5rem; transition: 0.3s;}
  .profile-acc[open] summary::after { content: '×'; transform: rotate(45deg); color: var(--danger);}
  .profile-acc[open] summary { border-bottom: 1px solid var(--border); }
  .acc-body { padding: 20px; }

  /* Toast */
  .admin-toast { position: fixed; bottom: 30px; right: 30px; padding: 16px 24px; border-radius: 8px; color: white; font-weight: bold; z-index: 9999; animation: floatUp 0.3s ease; box-shadow: 0 10px 25px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; }
  .admin-toast.success { background: var(--success); border: 1px solid #059669; }
  .admin-toast.error { background: var(--danger); border: 1px solid #b91c1c; }
`;

const NAV_TABS = [
  { id: 'overview', icon: '🏠', label: 'Overview Dashboard' },
  { id: 'students', icon: '🎓', label: 'Student Master' },
  { id: 'institutions', icon: '🏫', label: 'Institution Control' },
  { id: 'analytics', icon: '📊', label: 'Analytics & Intel' },
  { id: 'counselling', icon: '🧠', label: 'Counselling Control' },
  { id: 'settings', icon: '⚙️', label: 'System Settings' },
  { id: 'profile', icon: '👤', label: 'My Profile' },
];

export default function AdminDashboard({ user, onBackToApp }) {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [timeStr, setTimeStr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Data
  const [institutions, setInstitutions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Student Master: Search, Filter, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [profile, setProfile] = useState({
    name: user?.displayName || 'Admin User',
    role: 'super_admin',
    photo: '' 
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(`${now.toLocaleDateString('en-GB')}, ${now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🚀 10. URL-BASED ROUTING
  useEffect(() => {
    const hash = window.location.hash.replace('#admin/', '');
    if (NAV_TABS.find(t => t.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = `#admin/${activeTab}`;
    setCurrentPage(1); // Reset pagination on tab change
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
        // Fetch Profile
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, "superadmin_profile"));
        if (isMounted && docSnap.exists()) setProfile(prev => ({ ...prev, ...docSnap.data() }));

        // Fetch Institutions
        const instSnap = await getDocs(collection(db, COLLECTIONS.INSTITUTIONS));
        if (isMounted) setInstitutions(instSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Students
        const stuSnap = await getDocs(collection(db, COLLECTIONS.USERS));
        if (isMounted) {
          const assessedStudents = stuSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(u => u.riasecCode);
            
          // Mocking counselling status for visual demo if not present
          const formattedStudents = assessedStudents.map(s => ({
            ...s,
            counsellingStatus: s.counsellingStatus || 'Not Started',
            counsellorNotes: s.counsellorNotes || ''
          }));
          
          setStudents(formattedStudents);
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
  }, []);

  // --- ACTIONS ---
  const handleLogout = async () => {
    await signOut(auth);
    onBackToApp();
  };

  const handleUpdateStudentStatus = async (studentId, newStatus) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, studentId), { counsellingStatus: newStatus });
      setStudents(students.map(s => s.id === studentId ? { ...s, counsellingStatus: newStatus } : s));
      setSelectedStudent(prev => prev ? { ...prev, counsellingStatus: newStatus } : null);
      setToast({ type: 'success', message: 'Student status updated.' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update status.' });
    }
  };

  const exportCSV = () => {
    if (students.length === 0) return;
    const headers = "Name,Email,Class,RIASEC,Top Career,Status\n";
    const rows = students.map(s => `"${s.name || 'Unknown'}","${s.email}","${s.classLevel || ''}","${s.riasecCode}","${s.bestCareer || ''}","${s.counsellingStatus}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `VidyaVantage_Students_${new Date().toLocaleDateString('en-GB')}.csv`;
    a.click();
    setToast({ type: 'success', message: 'Download started!' });
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.counsellingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pendingInterventions = students.filter(s => s.counsellingStatus === 'Not Started').length;
  const inProgress = students.filter(s => s.counsellingStatus === 'In Progress').length;

  // Analytics Calculation
  const riasecCounts = useMemo(() => {
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    students.forEach(s => {
      if (s.riasecCode) {
        const primary = s.riasecCode.charAt(0);
        if (counts[primary] !== undefined) counts[primary]++;
      }
    });
    return counts;
  }, [students]);
  const maxRiasec = Math.max(...Object.values(riasecCounts), 1);

  // --- RENDERERS ---
  const renderTabContent = () => {
    if (loadingData) {
      return (
        <div className="tab-content" style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)'}}>
          <div style={{fontSize: '2rem', marginBottom: '15px'}}>⏳</div>
          <h2>Loading Platform Data...</h2>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <div><h1>Overview Dashboard</h1><p>Real-time snapshot of platform activity and metrics.</p></div>
              <button className="admin-btn-outline" onClick={exportCSV}>📥 Export Data</button>
            </div>

            <div className="kpi-grid">
              <div className="kpi-box" style={{borderTop: '3px solid var(--primary)'}} onClick={() => setActiveTab('institutions')}>
                <h4>Total Institutions</h4>
                <div className="val">{institutions.length}</div>
              </div>
              <div className="kpi-box" style={{borderTop: '3px solid var(--success)'}} onClick={() => setActiveTab('students')}>
                <h4>Assessed Students</h4>
                <div className="val">{students.length}</div>
              </div>
              <div className="kpi-box" style={{borderTop: '3px solid var(--danger)'}} onClick={() => { setStatusFilter('Not Started'); setActiveTab('students'); }}>
                <h4>Pending Interventions</h4>
                <div className="val" style={{color: pendingInterventions > 0 ? 'var(--danger)' : 'white'}}>{pendingInterventions}</div>
              </div>
            </div>

            <div className="grid-2col">
              <div className="admin-card" style={{borderTop: '4px solid var(--warning)'}}>
                <h3>Action Queue</h3>
                <div className="list-item clickable" onClick={() => { setStatusFilter('Not Started'); setActiveTab('students'); }}>
                  <span>Unassigned Students</span> 
                  <span className={`admin-badge ${pendingInterventions > 0 ? 'badge-danger' : 'badge-neutral'}`}>{pendingInterventions} Students</span>
                </div>
                <div className="list-item clickable" onClick={() => { setStatusFilter('In Progress'); setActiveTab('students'); }}>
                  <span>Active Counselling Sessions</span> 
                  <span className="admin-badge badge-warn">{inProgress} Students</span>
                </div>
                <div className="list-item">
                  <span>System Alerts</span> 
                  <span className="admin-badge badge-success">All Clear</span>
                </div>
              </div>

              <div className="admin-card" style={{borderTop: '4px solid var(--secondary)'}}>
                <h3>Quick Analytics: Primary Personality Types</h3>
                <div className="bar-chart">
                  {Object.entries(riasecCounts).map(([type, count]) => {
                    const colors = { R:'#ef4444', I:'#f59e0b', A:'#8b5cf6', S:'#10b981', E:'#06b6d4', C:'#64748b' };
                    return (
                      <div key={type} className="bar-row">
                        <div className="bar-label">{type} Type</div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${(count / maxRiasec) * 100}%`, background: colors[type] }}></div>
                        </div>
                        <div className="bar-value">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <div><h1>Assessed Student Master</h1><p>Complete directory of all students who have taken the assessment.</p></div>
              <button className="admin-btn" onClick={exportCSV}>📥 Download CSV</button>
            </div>
            
            <div className="admin-card" style={{ borderTop: '4px solid var(--success)' }}>
              {/* 🚀 4. SEARCH + FILTER */}
              <div className="search-bar">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="🔍 Search by name or email..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{flex: 2}}
                />
                <select 
                  className="form-select" 
                  value={statusFilter} 
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  style={{flex: 1}}
                >
                  <option value="All">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {filteredStudents.length === 0 ? (
                <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '20px'}}>No students found matching your criteria.</p>
              ) : (
                <>
                  <div style={{overflowX: 'auto'}}>
                    <table className="data-table">
                      <thead>
                        <tr><th>Student Name</th><th>Email</th><th>RIASEC Code</th><th>Status</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {currentStudents.map(student => (
                          <tr key={student.id} className="clickable" onClick={() => setSelectedStudent(student)}>
                            <td style={{fontWeight: 'bold'}}>{student.name || 'Unknown'}</td>
                            <td style={{color: 'var(--text-muted)'}}>{student.email}</td>
                            <td><span className="admin-badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)', letterSpacing:'1px'}}>{student.riasecCode}</span></td>
                            <td>
                              <span className={`admin-badge ${student.counsellingStatus === 'Not Started' ? 'badge-danger' : student.counsellingStatus === 'In Progress' ? 'badge-warn' : 'badge-success'}`}>
                                {student.counsellingStatus}
                              </span>
                            </td>
                            <td><button className="admin-btn-outline" style={{padding: '4px 10px', fontSize: '0.75rem'}}>View</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries</span>
                      <div className="page-controls">
                        <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                        <span style={{padding: '5px 10px', fontWeight: 'bold'}}>{currentPage} / {totalPages}</span>
                        <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'counselling':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <h1>Counselling Workflow</h1>
              <p>Manage active student interventions and session notes.</p>
            </div>
            <div className="grid-2col">
              <div className="admin-card" style={{borderTop: '4px solid var(--warning)'}}>
                <h3>In Progress ({inProgress})</h3>
                {students.filter(s => s.counsellingStatus === 'In Progress').map(s => (
                  <div key={s.id} className="list-item clickable" onClick={() => setSelectedStudent(s)}>
                    <div>
                      <strong style={{display: 'block', color: 'white'}}>{s.name || 'Unknown Student'}</strong>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{s.riasecCode} • {s.classLevel}</span>
                    </div>
                    <button className="admin-btn-outline" style={{padding: '4px 10px', fontSize: '0.75rem'}}>Open</button>
                  </div>
                ))}
                {inProgress === 0 && <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>No active sessions.</p>}
              </div>

              <div className="admin-card" style={{borderTop: '4px solid var(--danger)'}}>
                <h3>Needs Assignment ({pendingInterventions})</h3>
                {students.filter(s => s.counsellingStatus === 'Not Started').slice(0, 5).map(s => (
                  <div key={s.id} className="list-item clickable" onClick={() => setSelectedStudent(s)}>
                    <div>
                      <strong style={{display: 'block', color: 'white'}}>{s.name || 'Unknown Student'}</strong>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{s.email}</span>
                    </div>
                    <button className="admin-btn" style={{padding: '4px 10px', fontSize: '0.75rem', background: 'var(--danger)'}}>Assign</button>
                  </div>
                ))}
                {pendingInterventions > 5 && <p style={{fontSize: '0.85rem', color: 'var(--primary)', textAlign: 'center', marginTop: '10px', cursor: 'pointer'}} onClick={() => {setStatusFilter('Not Started'); setActiveTab('students');}}>View all {pendingInterventions} pending...</p>}
                {pendingInterventions === 0 && <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>All students assigned!</p>}
              </div>
            </div>
          </div>
        );

      case 'institutions':
      case 'analytics':
      case 'health':
      case 'settings':
      case 'access':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <h1>{NAV_TABS.find(t => t.id === activeTab)?.label}</h1>
              <p>Advanced administration module.</p>
            </div>
            <div className="admin-card">
              <h3>🚧 Enterprise Feature</h3>
              <p style={{color: 'var(--text-muted)'}}>This module requires a Super Admin or Enterprise tier to fully unlock configuration controls. Current active read-only metrics are shown on the Overview tab.</p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="admin-root">
      
      {/* 🧩 SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-brand" onClick={() => setActiveTab('overview')}>
          <h2>Career Intel ⚡</h2>
        </div>
        <div style={{padding: '0 20px', marginBottom: '15px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 'bold'}}>
          Menu
        </div>
        {NAV_TABS.map(tab => (
          <button 
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={tab.id === 'settings' ? {borderTop: '1px solid #334155', marginTop: '20px', paddingTop: '20px'} : {}}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-main">
        {/* 🧩 TOP HEADER */}
        <div className="top-header">
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <span className="admin-badge badge-warn">Role: {profile.role?.replace('_', ' ').toUpperCase()}</span>
          </div>
          
          <div className="header-actions">
            <button className="notify-bell">
              🔔 <div className="notify-badge">{pendingInterventions > 9 ? '9+' : pendingInterventions}</div>
            </button>
            <button onClick={onBackToApp} className="site-link" style={{border:'none', cursor:'pointer', fontFamily:'inherit'}}>🌐 Live Site</button>
            <div className="profile-menu">
              <div className="avatar-btn" onClick={handleLogout} title="Click to Logout">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        
        {/* WELCOME */}
        <div className="welcome-banner">
          <div><p className="quote-text"><strong>Welcome back, {profile?.name?.split(' ')[0] || 'Admin'}.</strong> "Quality is not an act, it is a habit."</p></div>
          <div className="clock-container">{timeStr}</div>
        </div>

        {/* CONTENT */}
        <div className="main-content">
          {renderTabContent()}
        </div>
      </div>

      {/* 🚀 1. STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎓 Student Dossier: {selectedStudent.name || 'Unknown'}</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2col" style={{marginBottom: '20px'}}>
                <div>
                  <label className="form-label">Email</label>
                  <div style={{fontWeight: 'bold', marginBottom: '10px'}}>{selectedStudent.email}</div>
                  <label className="form-label">Class/Level</label>
                  <div style={{fontWeight: 'bold'}}>{selectedStudent.classLevel || 'Not specified'}</div>
                </div>
                <div style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)'}}>
                  <label className="form-label">Primary Career Match</label>
                  <div style={{fontSize: '1.2rem', fontWeight: '900', color: 'var(--gold)', marginBottom: '5px'}}>{selectedStudent.bestCareer || 'N/A'}</div>
                  <span className="admin-badge" style={{background: 'var(--primary)', color: 'white'}}>{selectedStudent.riasecCode} Profile</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">RIASEC Personality Summary</label>
                <div style={{background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)'}}>
                  {selectedStudent.riasecSummary || 'Detailed summary pending generation.'}
                </div>
              </div>

              {/* 🚀 2. COUNSELLING WORKFLOW */}
              <hr style={{border: 'none', borderTop: '1px solid var(--border)', margin: '25px 0'}} />
              <h3 style={{marginTop: 0, fontSize: '1.1rem'}}>🧠 Counselling Workflow</h3>
              
              <div className="grid-2col" style={{alignItems: 'end'}}>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label className="form-label">Intervention Status</label>
                  <select 
                    className="form-select" 
                    value={selectedStudent.counsellingStatus} 
                    onChange={(e) => handleUpdateStudentStatus(selectedStudent.id, e.target.value)}
                  >
                    <option value="Not Started">Not Started (Needs Review)</option>
                    <option value="In Progress">In Progress (Active Sessions)</option>
                    <option value="Completed">Completed / Discharged</option>
                  </select>
                </div>
                <button className="admin-btn-outline">Add Session Note</button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn-outline" onClick={() => setSelectedStudent(null)}>Close</button>
              <button className="admin-btn">Save Notes</button>
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
