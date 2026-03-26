import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const STYLES = `
  :root {
    --bg: #0f172a; --sidebar: #1e1b4b; --card-bg: #1e293b; 
    --primary: #8b5cf6; --secondary: #06b6d4; --accent: #f43f5e;
    --text-main: #f8fafc; --text-muted: #94a3b8; --border: #334155;
    --success: #10b981; --warning: #f59e0b; --danger: #ef4444;
  }
  .admin-root { background-color: var(--bg); font-family: 'Nunito', sans-serif; color: var(--text-main); margin: 0; display: flex; height: 100vh; overflow: hidden; }
  
  /* --- SIDEBAR --- */
  .admin-sidebar { width: 260px; background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; transition: transform 0.3s ease; z-index: 1000; flex-shrink: 0;}
  .admin-sidebar::-webkit-scrollbar { width: 4px; }
  .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  
  .admin-brand { padding: 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px; position: sticky; top:0; background: var(--sidebar); z-index: 10; display:flex; justify-content: space-between; align-items:center;}
  .admin-brand h2 { margin: 0; font-size: 1.5rem; background: -webkit-linear-gradient(45deg, var(--secondary), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
  
  .nav-btn { background: transparent; color: var(--text-muted); border: none; text-align: left; padding: 12px 25px; font-size: 0.95rem; font-weight: bold; cursor: pointer; transition: 0.2s; border-left: 4px solid transparent; width: 100%; display: flex; align-items: center; gap: 10px; }
  .nav-btn:hover { background: rgba(255,255,255,0.05); color: white; }
  .nav-btn.active { background: rgba(139, 92, 246, 0.1); color: var(--primary); border-left-color: var(--primary); }

  /* --- MAIN LAYOUT & TOP HEADER --- */
  .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;}
  .top-header { background: var(--card-bg); height: 70px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; flex-shrink: 0;}
  
  .header-actions { display: flex; align-items: center; gap: 15px; }
  .site-link { color: var(--secondary); text-decoration: none; font-weight: bold; padding: 8px 12px; border-radius: 8px; background: rgba(6, 182, 212, 0.1); transition: 0.2s; font-size: 0.9rem;}
  .site-link:hover { background: rgba(6, 182, 212, 0.2); }
  
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
  .header-bar { margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;}
  .header-bar h1 { margin: 0 0 5px 0; font-size: 1.5rem; color: white;}
  .header-bar p { margin: 0; color: var(--text-muted); font-size: 0.9rem;}
  
  .tab-content { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  
  /* UI COMPONENTS */
  .admin-card { background: var(--card-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow-x: auto;}
  .admin-card h3 { margin-top: 0; color: white; border-bottom: 1px solid var(--border); padding-bottom: 10px; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center; }
  
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px; }
  .kpi-box { background: linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%); padding: 15px; border-radius: 12px; border: 1px solid var(--border); }
  .kpi-box h4 { margin:0 0 5px 0; color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;}
  .kpi-box .val { font-size:1.5rem; font-weight:900; color:white; }
  
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3col { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

  .form-group { margin-bottom: 15px; }
  .form-label { display: block; font-weight: 700; margin-bottom: 6px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;}
  .form-input, .form-select, .form-textarea { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; color: white; background: #0f172a; box-sizing: border-box; font-family: inherit;}
  .form-input:focus, .form-select:focus { border-color: var(--primary); outline: none; }
  
  .admin-btn { background: linear-gradient(45deg, var(--primary), #a855f7); color: white; border: none; padding: 10px 20px; font-size: 0.95rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s; }
  .admin-btn:hover { opacity: 0.9; transform: translateY(-2px); }
  .admin-btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main); padding: 10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;}
  .admin-btn-outline:hover { border-color: var(--primary); color: var(--primary); }

  .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.85rem; min-width: 600px;}
  .data-table th, .data-table td { padding: 10px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; background: rgba(0,0,0,0.2);}
  .data-table tr:hover { background: rgba(255,255,255,0.02); }

  .admin-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;}
  .badge-warn { background: rgba(245, 158, 11, 0.2); color: var(--warning); border: 1px solid var(--warning);}
  .badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger);}

  .list-item { padding: 12px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center;}
  .list-item:last-child { border: none; }

  /* Profile Accordions */
  .profile-acc { background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 15px; overflow: hidden; }
  .profile-acc summary { padding: 18px 20px; font-weight: 800; font-size: 1.05rem; color: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none; outline: none; background: var(--card-bg); }
  .profile-acc summary::-webkit-details-marker { display: none; }
  .profile-acc summary::after { content: '+'; color: var(--primary); font-size: 1.5rem; transition: 0.3s;}
  .profile-acc[open] summary::after { content: '×'; transform: rotate(45deg); color: var(--danger);}
  .profile-acc[open] summary { border-bottom: 1px solid var(--border); }
  .acc-body { padding: 20px; }

  .entry-block { background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 20px; border-radius: 10px; margin-bottom: 15px; position: relative; }
  .remove-entry-btn { position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: var(--danger); cursor: pointer; font-weight: bold; }
  
  .hobby-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;}
  .hobby-tag { background: rgba(139, 92, 246, 0.2); border: 1px solid var(--primary); color: white; padding: 5px 12px; border-radius: 50px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;}
  .hobby-tag span { cursor: pointer; color: var(--accent); font-weight: bold;}
`;

const NAV_TABS = [
  { id: 'overview', icon: '🏠', label: 'Overview Dashboard' },
  { id: 'institutions', icon: '🏫', label: 'Institution Control' },
  { id: 'students', icon: '🎓', label: 'Student Master' },
  { id: 'analytics', icon: '📊', label: 'Analytics & Intel' },
  { id: 'health', icon: '🔒', label: 'Health & Licensing' },
  { id: 'counselling', icon: '🧠', label: 'Counselling Control' },
  { id: 'settings', icon: '⚙️', label: 'System Settings' },
  { id: 'profile', icon: '👤', label: 'My Profile' },
  { id: 'access', icon: '🔑', label: 'Access Control' },
];

export default function AdminDashboard({ user, onBackToApp }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  
  // Profile State (Matching the HTML form)
  const [profile, setProfile] = useState({
    name: user?.displayName || 'Admin User',
    title: 'Lead Counsellor',
    bio: '',
    phone: '',
    linkedin: '',
    website: '',
    hobbies: [],
    workHistory: [],
    eduHistory: []
  });
  
  const [hobbyInput, setHobbyInput] = useState("");

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(`${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    onBackToApp();
  };

  const addWork = () => {
    setProfile(p => ({
      ...p, 
      workHistory: [...p.workHistory, { id: Date.now(), company: '', role: '', from: '', to: '', current: false, type: 'On site', desc: '' }]
    }));
  };

  const removeWork = (id) => {
    setProfile(p => ({ ...p, workHistory: p.workHistory.filter(w => w.id !== id) }));
  };

  const addEdu = () => {
    setProfile(p => ({
      ...p, 
      eduHistory: [...p.eduHistory, { id: Date.now(), level: 'School', inst: '', from: '', to: '', subjects: '' }]
    }));
  };

  const removeEdu = (id) => {
    setProfile(p => ({ ...p, eduHistory: p.eduHistory.filter(e => e.id !== id) }));
  };

  const addHobby = () => {
    if (hobbyInput.trim() && profile.hobbies.length < 10 && !profile.hobbies.includes(hobbyInput.trim())) {
      setProfile(p => ({ ...p, hobbies: [...p.hobbies, hobbyInput.trim()] }));
      setHobbyInput("");
    }
  };

  const removeHobby = (h) => {
    setProfile(p => ({ ...p, hobbies: p.hobbies.filter(x => x !== h) }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            <div className="header-bar"><h1>Overview Dashboard</h1><p>Real-time snapshot of platform activity and metrics.</p></div>
            <div className="kpi-grid">
              <div className="kpi-box" style={{borderTop: '3px solid var(--primary)'}}><h4>Total Institutions</h4><div className="val">14</div></div>
              <div className="kpi-box" style={{borderTop: '3px solid var(--success)'}}><h4>Active Students</h4><div class="val">1,204</div></div>
              <div className="kpi-box" style={{borderTop: '3px solid var(--secondary)'}}><h4>Assessments Taken</h4><div className="val">982</div></div>
              <div className="kpi-box" style={{borderTop: '3px solid var(--accent)'}}><h4>Active Counsellors</h4><div className="val">8</div></div>
            </div>
            <div className="grid-2col">
              <div className="admin-card" style={{borderTop: '4px solid var(--warning)'}}>
                <h3>Action Queue</h3>
                <div className="list-item"><span>High Risk Interventions</span> <span className="admin-badge badge-danger">12 Students</span></div>
                <div className="list-item"><span>Unassigned Students</span> <span className="admin-badge badge-warn">45 Students</span></div>
                <div className="list-item"><span>Pending Reports</span> <span className="admin-badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)'}}>8 Reports</span></div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="tab-content">
            <div className="header-bar">
              <h1>My Profile Setup</h1>
              <p>Build your professional dossier. This information represents your administrative identity.</p>
            </div>

            <div className="admin-card" style={{display:'flex', alignItems:'center', gap:'20px', borderTop:'4px solid var(--primary)'}}>
              <div style={{width:'100px', height:'100px', borderRadius:'50%', border:'3px solid var(--primary)', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px'}}>👤</div>
              <div style={{flex: 1}}>
                <div className="grid-2col">
                  <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Professional Title</label><input type="text" className="form-input" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Short Bio</label><textarea className="form-textarea" rows="2" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}></textarea></div>
              </div>
            </div>

            <details className="profile-acc" open>
              <summary>Contact Information</summary>
              <div className="acc-body grid-2col">
                <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" disabled style={{opacity:0.7}} value={user?.email || ''} /></div>
                <div className="form-group"><label className="form-label">Phone Number</label><input type="tel" className="form-input" placeholder="+91 " value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">LinkedIn URL</label><input type="url" className="form-input" placeholder="https://linkedin.com/in/..." value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Personal Website</label><input type="url" className="form-input" placeholder="https://..." value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} /></div>
              </div>
            </details>

            <details className="profile-acc">
              <summary>Work Experience</summary>
              <div className="acc-body">
                {profile.workHistory.map((work, idx) => (
                  <div key={work.id} className="entry-block">
                    <button className="remove-entry-btn" onClick={() => removeWork(work.id)}>✕ Remove</button>
                    <div className="grid-2col">
                      <div className="form-group"><label className="form-label">Company / Organization</label><input type="text" className="form-input" placeholder="e.g. Google" /></div>
                      <div className="form-group"><label className="form-label">Position / Role</label><input type="text" className="form-input" placeholder="e.g. Senior Counsellor" /></div>
                      <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" /></div>
                      <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" /></div>
                    </div>
                  </div>
                ))}
                <button className="admin-btn-outline" onClick={addWork}>+ Add Work Experience</button>
              </div>
            </details>

            <details className="profile-acc">
              <summary>Education & Certifications</summary>
              <div className="acc-body">
                {profile.eduHistory.map((edu, idx) => (
                  <div key={edu.id} className="entry-block">
                    <button className="remove-entry-btn" onClick={() => removeEdu(edu.id)}>✕ Remove</button>
                    <div className="grid-2col">
                      <div className="form-group">
                        <label className="form-label">Level</label>
                        <select className="form-select">
                          <option value="School">School (10th)</option>
                          <option value="PUC">PUC / 12th</option>
                          <option value="UG">Undergraduate (UG)</option>
                          <option value="PG">Postgraduate (PG)</option>
                        </select>
                      </div>
                      <div className="form-group"><label className="form-label">Institution Name</label><input type="text" className="form-input" /></div>
                    </div>
                  </div>
                ))}
                <button className="admin-btn-outline" onClick={addEdu}>+ Add Education Record</button>
              </div>
            </details>

            <details className="profile-acc">
              <summary>Hobbies & Interests</summary>
              <div className="acc-body">
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 0}}>Add up to 10 hobbies.</p>
                <div style={{display: 'flex', gap: '10px'}}>
                  <input type="text" className="form-input" placeholder="Type a hobby..." style={{maxWidth: '300px'}} value={hobbyInput} onChange={e => setHobbyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHobby()} />
                  <button className="admin-btn" onClick={addHobby}>Add</button>
                </div>
                <div className="hobby-container">
                  {profile.hobbies.map((h, i) => (
                    <div key={i} className="hobby-tag">{h} <span onClick={() => removeHobby(h)}>&times;</span></div>
                  ))}
                </div>
              </div>
            </details>

            <button className="admin-btn" style={{width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px', background: 'var(--success)'}}>💾 Save Complete Profile</button>
          </div>
        );
      
      default:
        return (
          <div className="tab-content">
            <div className="header-bar">
              <h1>{NAV_TABS.find(t => t.id === activeTab)?.label}</h1>
              <p>Module currently in development / pending Firebase connection.</p>
            </div>
            <div className="admin-card">
              <h3>🚧 Under Construction</h3>
              <p style={{color: 'var(--muted)'}}>This module is part of the next phase of deployment.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-sidebar">
        <div className="admin-brand">
          <h2>Career Intel</h2>
        </div>
        
        {NAV_TABS.map(tab => (
          <button 
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={tab.id === 'access' ? {borderTop: '1px solid #334155', marginTop: '10px'} : {}}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-main">
        <div className="top-header">
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <h2 style={{margin:0, fontSize:'1.1rem', color:'var(--text-muted)'}}>{NAV_TABS.find(t => t.id === activeTab)?.label}</h2>
          </div>
          
          <div className="header-actions">
            <button onClick={onBackToApp} className="site-link" style={{border:'none', cursor:'pointer', fontFamily:'inherit'}}>🌐 Live Site</button>
            <div className="profile-menu">
              <div className="avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <div style={{padding: '15px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)'}}>
                    <strong style={{color:'white', display:'block'}}>{profile.name}</strong>
                    <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{user?.email || 'admin@secretsharz.com'}</span>
                  </div>
                  <button onClick={() => { setActiveTab('profile'); setDropdownOpen(false); }}>👤 My Profile</button>
                  <button style={{color: 'var(--danger)'}} onClick={handleLogout}>🚪 Secure Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="welcome-banner">
          <div>
            <p className="quote-text">
              <strong>Welcome back, {profile.name.split(' ')[0]}.</strong> "Quality is not an act, it is a habit."
            </p>
          </div>
          <div className="clock-container">{timeStr}</div>
        </div>

        <div className="main-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
