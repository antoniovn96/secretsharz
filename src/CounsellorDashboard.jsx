import React, { useState, useEffect, useRef, useMemo } from 'react';
import { auth, db } from './firebase'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// --- STYLES ---
const STYLES = `
  :root {
    --bg: #0f172a; --sidebar: #1e1b4b; --card-bg: #1e293b; 
    --primary: #8b5cf6; --secondary: #06b6d4; --accent: #f43f5e;
    --text-main: #f8fafc; --text-muted: #94a3b8; --border: #334155;
    --success: #10b981; --warning: #f59e0b; --danger: #ef4444;
  }
  .dashboard-root { background-color: var(--bg); font-family: 'Nunito', sans-serif; color: var(--text-main); margin: 0; display: flex; height: 100vh; width: 100vw; overflow: hidden; }
  
  /* --- SIDEBAR --- */
  .sidebar { width: 280px; background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding-top: 20px; overflow-y: auto; flex-shrink: 0;}
  .brand { padding: 0 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
  .brand h2 { margin: 0; font-size: 1.5rem; background: -webkit-linear-gradient(45deg, var(--secondary), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
  
  .nav-btn { background: transparent; color: var(--text-muted); border: none; text-align: left; padding: 15px 25px; font-size: 0.95rem; font-weight: bold; cursor: pointer; transition: 0.2s; border-left: 4px solid transparent; width: 100%; display: flex; align-items: center; gap: 10px; }
  .nav-btn:hover { background: rgba(255,255,255,0.05); color: white; }
  .nav-btn.active { background: rgba(139, 92, 246, 0.1); color: var(--primary); border-left-color: var(--primary); }

  /* --- MAIN LAYOUT & TOP HEADER --- */
  .main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  
  .top-header { background: var(--card-bg); height: 70px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; padding: 0 40px; flex-shrink: 0;}
  .header-actions { display: flex; align-items: center; gap: 20px; }
  
  /* User Profile Dropdown */
  .profile-menu { position: relative; display: inline-block; }
  .avatar-btn { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--primary); cursor: pointer; object-fit: cover; background: #000; display:flex; align-items:center; justify-content:center; font-weight:bold; color:white;}
  .dropdown-content { position: absolute; right: 0; background-color: var(--card-bg); min-width: 200px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5); z-index: 100; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; margin-top: 10px;}
  .dropdown-content button { background:transparent; border:none; width:100%; text-align:left; color: var(--text-main); padding: 12px 16px; display: block; font-size: 0.9rem; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); cursor:pointer;}
  .dropdown-content button:hover { background-color: rgba(255,255,255,0.05); color: var(--primary); }

  /* --- CONTENT AREA --- */
  .main-content { flex: 1; padding: 30px 40px; overflow-y: auto; position: relative;}
  
  .header-bar { margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;}
  .header-bar h1 { margin: 0 0 5px 0; font-size: 1.8rem; }
  .header-bar p { margin: 0; color: var(--text-muted); }

  /* UI COMPONENTS */
  .card { background: var(--card-bg); padding: 25px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  .card h3 { margin-top: 0; color: white; border-bottom: 1px solid var(--border); padding-bottom: 10px; font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; }
  
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px; }
  .kpi-box { background: linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%); padding: 20px; border-radius: 12px; border: 1px solid var(--border); }
  .kpi-box h4 { margin:0 0 10px 0; color:var(--text-muted); font-size:0.85rem; text-transform:uppercase;}
  .kpi-box .val { font-size:2rem; font-weight:900; color:white; }
  
  .grid-3-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }

  .form-group { margin-bottom: 15px; }
  .form-label { display: block; font-weight: 700; margin-bottom: 6px; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;}
  .form-input, .form-select, .form-textarea { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; color: white; background: #0f172a; box-sizing: border-box; font-family: inherit;}
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--primary); outline: none; }
  
  .btn { background: linear-gradient(45deg, var(--primary), #a855f7); color: white; border: none; padding: 10px 20px; font-size: 0.95rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;}
  .btn:hover { opacity: 0.9; transform: translateY(-2px); }
  .btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); }
  .btn-outline:hover { background: rgba(139, 92, 246, 0.1); }
  .btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid var(--danger);}
  .btn-danger:hover { background: var(--danger); color: white; }

  .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; }
  .data-table tr:hover { background: rgba(255,255,255,0.02); }

  .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; display:inline-block;}
  .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); border: 1px solid var(--success);}
  .badge-warning { background: rgba(245, 158, 11, 0.2); color: var(--warning); border: 1px solid var(--warning);}
  .badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger);}
  .badge-neutral { background: rgba(148, 163, 184, 0.2); color: var(--text-muted); border: 1px solid var(--text-muted);}

  /* PRIORITY TAGS */
  .priority-high { border-left: 4px solid var(--danger) !important; }
  .priority-medium { border-left: 4px solid var(--warning) !important; }
  .priority-low { border-left: 4px solid var(--success) !important; }

  /* CASE LIST STYLING */
  .case-item { display: flex; align-items: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 12px; margin-bottom: 12px; border: 1px solid transparent; transition: 0.2s; border-left: 4px solid transparent;}
  .case-item:hover { border-color: var(--primary); transform: translateX(5px); }
  .case-info { flex: 1; margin-left: 10px;}
  .case-time { font-size: 0.8rem; color: var(--secondary); font-weight: bold; }

  /* TIMELINE */
  .timeline { border-left: 2px solid var(--border); margin-left: 10px; padding-left: 20px; position: relative; }
  .timeline-item { margin-bottom: 20px; position: relative; }
  .timeline-dot { position: absolute; left: -27px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid var(--card-bg); }
  .timeline-date { font-size: 0.75rem; color: var(--text-muted); font-weight: bold; margin-bottom: 5px;}
  .timeline-content { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px solid var(--border); }

  /* CHAT STYLES */
  .chat-message { padding: 12px 18px; border-radius: 12px; margin-bottom: 12px; font-size: 0.95rem; max-width: 85%; line-height: 1.5;}
  .msg-me { background: var(--primary); color: white; margin-left: auto; border-bottom-right-radius: 0; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.2);}
  .msg-them { background: rgba(255,255,255,0.05); color: white; margin-right: auto; border-bottom-left-radius: 0; border: 1px solid var(--border);}

  /* MODAL UI */
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 3000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); animation: fadeIn 0.2s ease;}
  .modal-content { background: var(--card-bg); width: 900px; max-width: 95%; max-height: 90vh; overflow-y: auto; padding: 30px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);}
  .modal-header-nav { display: flex; gap: 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; padding-bottom: 10px;}
  .modal-nav-tab { background: transparent; border: none; color: var(--text-muted); font-weight: bold; font-size: 1rem; cursor: pointer; padding-bottom: 10px; border-bottom: 3px solid transparent;}
  .modal-nav-tab.active { color: white; border-bottom-color: var(--primary);}
  
  .profile-360-header { display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary); padding-bottom: 15px; margin-bottom: 20px;}
  
  /* JOURNEY TRACKER */
  .journey-track { display: flex; justify-content: space-between; margin: 20px 0; position: relative;}
  .journey-track::before { content: ''; position: absolute; top: 15px; left: 0; width: 100%; height: 2px; background: var(--border); z-index: 1;}
  .journey-step { position: relative; z-index: 2; text-align: center; flex: 1;}
  .step-dot { width: 30px; height: 30px; border-radius: 50%; background: var(--card-bg); border: 2px solid var(--border); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;}
  .step-dot.active { border-color: var(--primary); background: var(--primary); color: white;}
  .step-label { font-size: 0.75rem; color: var(--text-muted); font-weight: bold; text-transform: uppercase;}

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// --- MAIN COMPONENT ---
export default function CounsellorDashboard() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertModal, setAlertModal] = useState(null);
  
  // Data State
  const [students, setStudents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  
  // Interaction State
  const [studentModal, setStudentModal] = useState(null);
  const [studentModalTab, setStudentModalTab] = useState('timeline');
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [chatInput, setChatInput] = useState('');
  
  // Filters & Search
  const [clinicalFilter, setClinicalFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 🚀 Session Logging State (UPGRADED)
  const [newSession, setNewSession] = useState({
      studentId: '', 
      type: 'Exploration', 
      note: '', 
      nextActionDate: '',
      homeworkTask: '',
      counsellingStage: 'Exploration'
  });

  // Draft saving mechanism (Offline/Refresh protection)
  useEffect(() => {
      const savedDraft = localStorage.getItem('sessionDraft');
      if (savedDraft) {
          setNewSession(JSON.parse(savedDraft));
      }
  }, []);

  const handleSessionChange = (field, value) => {
      const updated = { ...newSession, [field]: value };
      setNewSession(updated);
      localStorage.setItem('sessionDraft', JSON.stringify(updated));
  };

  const chatEndRef = useRef(null);

  // --- INITIALIZATION & STYLES ---
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // --- AUTH & DATA FETCHING ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserProfile({
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photo: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=8b5cf6&color=fff`
        });
        
        fetchStudents();
        
        // Subscribe to Bookings
        const qBookings = query(collection(db, "bookings"), where("counsellorId", "==", user.email));
        const unsubBookings = onSnapshot(qBookings, (snapshot) => {
            const b = [];
            snapshot.forEach(doc => b.push({ id: doc.id, ...doc.data() }));
            b.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
            setBookings(b);
        });

        return () => unsubBookings();
      } else {
        window.location.href = "/login"; 
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchStudents = async () => {
      try {
          const snap = await getDocs(collection(db, "students"));
          const sList = [];
          snap.forEach(doc => {
              const data = doc.data();
              // Mock adding a priority if it doesn't exist
              const priority = data.priority || (data.psychIndex?.riskCategory === 'High' ? 'high' : 'low');
              sList.push({ id: doc.id, ...data, priority });
          });
          setStudents(sList);
      } catch(e) {
          console.error("Error fetching students:", e);
          showAlert("Failed to load student database.", "Database Error");
      }
  };

  // --- ACTIONS ---
  const showAlert = (message, title = "Notice") => {
      setAlertModal({ title, message });
  };

  const handleLogout = async () => {
      try { await signOut(auth); } catch(e) { console.error(e); }
  };

  const updateBookingStatus = async (id, status) => {
    try { await updateDoc(doc(db, "bookings", id), { status: status }); } 
    catch (e) { console.error(e); showAlert("Failed to update status.", "Error"); }
  };

  const updateStudentPriority = async (studentId, newPriority) => {
      try {
          await updateDoc(doc(db, "students", studentId), { priority: newPriority });
          fetchStudents(); // Refresh to show new color
      } catch (e) { console.error(e); }
  }

  // 🚀 UPGRADED SESSION SAVING
  const saveSessionNotes = async () => {
    if(!newSession.studentId || !newSession.note) return showAlert("Please select a student and write a session summary.", "Incomplete Log");

    try {
        const sessionPayload = {
            id: Date.now(),
            date: new Date().toISOString(), 
            type: newSession.type,
            note: newSession.note, 
            nextActionDate: newSession.nextActionDate,
            homeworkTask: newSession.homeworkTask,
            counsellorEmail: userProfile.email
        };

        await updateDoc(doc(db, "students", newSession.studentId), {
            counsellingStage: newSession.counsellingStage, // Update journey stage
            counsellorNotes: arrayUnion(sessionPayload)
        });
        
        showAlert("Structured clinical notes and next actions saved.", "Log Saved", false);
        
        // Clear Drafts
        setNewSession({ studentId: '', type: 'Exploration', note: '', nextActionDate: '', homeworkTask: '', counsellingStage: 'Exploration' });
        localStorage.removeItem('sessionDraft');
        
        fetchStudents(); 
    } catch (e) {
        console.error(e); 
        showAlert("Failed to save notes. Ensure you have the correct permissions.", "Save Error");
    }
  };

  // --- CHAT LOGIC ---
  useEffect(() => {
      if(activeChatStudent && userProfile) {
          const chatId = `${activeChatStudent.id}_${userProfile.email}`;
          const q = query(collection(db, "chats", chatId, "messages"));
          const unsubChat = onSnapshot(q, (snapshot) => {
             const msgs = [];
             snapshot.forEach(doc => msgs.push(doc.data()));
             msgs.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
             setChatMessages(msgs);
             setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          });
          return () => unsubChat();
      }
  }, [activeChatStudent, userProfile]);

  const sendChatMessage = async () => {
    if(!activeChatStudent) return showAlert("Select a student to chat with first.", "Chat Error");
    if(!chatInput.trim()) return;

    const text = chatInput.trim();
    setChatInput('');
    
    try {
        const chatId = `${activeChatStudent.id}_${userProfile.email}`;
        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: text, senderId: userProfile.email, senderType: 'counsellor', timestamp: serverTimestamp()
        });
    } catch(e) {
        console.error(e);
        showAlert("Error sending message.", "Network Error");
    }
  };

  // Chat to Session Converter
  const convertChatToNote = () => {
      if(chatMessages.length === 0) return;
      const summary = chatMessages.map(m => `${m.senderType === 'counsellor' ? 'Me' : 'Student'}: ${m.text}`).join('\n');
      setActiveTab('sessions');
      handleSessionChange('studentId', activeChatStudent.id);
      handleSessionChange('note', `Chat Transcript Logged:\n\n${summary}`);
  };


  // --- DERIVED DATA & PERFORMANCE METRICS ---
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  
  // Performance Calculations
  const totalSessionsLogged = students.reduce((acc, curr) => acc + (curr.counsellorNotes?.length || 0), 0);
  const studentsClosed = students.filter(s => s.counsellingStage === 'Finalisation').length;

  const filteredStudents = useMemo(() => {
      return students.filter(s => {
          const matchSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase());
          let matchFilter = true;
          if(clinicalFilter === "HIGH") matchFilter = s.priority === 'high';
          if(clinicalFilter === "MEDIUM") matchFilter = s.priority === 'medium';
          if(clinicalFilter === "LOCKED") matchFilter = s.counsellingStage === 'Finalisation';
          return matchSearch && matchFilter;
      });
  }, [students, searchQuery, clinicalFilter]);

  const highPriorityCount = students.filter(s => s.priority === 'high').length;

  // Follow-up Scanner (Students without notes in 14 days)
  const needsFollowUp = students.filter(s => {
      if(!s.counsellorNotes || s.counsellorNotes.length === 0) return true;
      const lastNoteDate = new Date(s.counsellorNotes[s.counsellorNotes.length-1].date);
      const daysSince = (new Date() - lastNoteDate) / (1000 * 60 * 60 * 24);
      return daysSince > 14 && s.counsellingStage !== 'Finalisation';
  });

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  // --- TABS RENDERER ---
  const renderTab = () => {
    switch(activeTab) {
        case 'overview':
            return (
                <div className="tab-content active">
                    <div className="header-bar">
                        <div>
                            <h1>Counselor Command Center</h1>
                            <p>{currentDate}</p>
                        </div>
                    </div>

                    <div className="kpi-grid">
                        <div className="kpi-box" style={{borderTop: '3px solid var(--primary)'}}><h4>Total Students</h4><div className="val">{students.length}</div></div>
                        <div className="kpi-box" style={{borderTop: '3px solid var(--danger)'}}><h4>High Priority</h4><div className="val">{highPriorityCount}</div></div>
                        <div className="kpi-box" style={{borderTop: '3px solid var(--warning)'}}><h4>Needs Follow-up</h4><div className="val">{needsFollowUp.length}</div></div>
                        <div className="kpi-box" style={{borderTop: '3px solid var(--success)'}}><h4>Sessions Logged</h4><div className="val">{totalSessionsLogged}</div></div>
                    </div>

                    <div className="grid-3-1">
                        <div>
                            <div className="card">
                                <h3>Weekly Calendar & Queue</h3>
                                <div>
                                    {bookings.length === 0 ? (
                                        <div style={{textAlign:'center', color:'var(--text-muted)', padding: '20px'}}>No upcoming appointments.</div>
                                    ) : (
                                        bookings.map(b => {
                                            let statusColor = b.status === 'Pending' ? 'var(--warning)' : (b.status === 'Confirmed' ? 'var(--success)' : 'var(--danger)');
                                            return (
                                                <div key={b.id} className="case-item">
                                                    <div className="case-status" style={{background: statusColor}}></div>
                                                    <div className="case-info">
                                                        <span className="case-time">{b.date} at {b.time}</span>
                                                        <div style={{fontWeight:'bold', color:'white', fontSize:'1.1rem', marginTop:'2px'}}>
                                                            {b.studentName} <span className="badge" style={{marginLeft:'10px', background:'rgba(255,255,255,0.1)', color:statusColor, border:`1px solid ${statusColor}`}}>{b.status}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{display:'flex', gap:'8px'}}>
                                                        {b.status === 'Pending' && (
                                                            <>
                                                                <button className="btn" style={{padding: '6px 12px', fontSize: '0.8rem', background:'var(--success)'}} onClick={() => updateBookingStatus(b.id, 'Confirmed')}>Accept</button>
                                                                <button className="btn btn-outline" style={{padding: '6px 12px', fontSize: '0.8rem', borderColor:'var(--danger)', color:'var(--danger)'}} onClick={() => updateBookingStatus(b.id, 'Cancelled')}>Decline</button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="card" style={{borderTop: '4px solid var(--warning)'}}>
                                <h3>Smart Follow-Ups</h3>
                                <div style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>
                                    {needsFollowUp.length > 0 ? (
                                        <ul style={{paddingLeft: '20px', margin: 0}}>
                                            {needsFollowUp.slice(0, 5).map(s => (
                                                <li key={s.id} style={{marginBottom: '10px'}}>
                                                    <strong style={{color:'white'}}>{s.name}</strong> has had no logged contact in >14 days. 
                                                    <a href="#" style={{color:'var(--secondary)', marginLeft:'5px'}} onClick={(e) => {e.preventDefault(); setStudentModal(s);}}>View File</a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{color:'var(--success)'}}>All students have recent contact logs.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="card" style={{borderTop: '4px solid var(--secondary)'}}>
                                <h3>My Performance</h3>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                    <span style={{color:'var(--text-muted)'}}>Cases Closed:</span>
                                    <strong style={{color:'white'}}>{studentsClosed} / {students.length}</strong>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <span style={{color:'var(--text-muted)'}}>Avg Sessions/Student:</span>
                                    <strong style={{color:'white'}}>{students.length ? (totalSessionsLogged / students.length).toFixed(1) : 0}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'queue':
            return (
                <div className="tab-content active">
                    <div className="header-bar">
                        <div>
                            <h1>Student Queue & Priority</h1>
                            <p>Manage your roster. Tag students based on urgency.</p>
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <select className="form-select" value={clinicalFilter} onChange={(e) => setClinicalFilter(e.target.value)} style={{width:'180px'}}>
                                <option value="ALL">All Students</option>
                                <option value="HIGH">High Priority 🔴</option>
                                <option value="MEDIUM">Medium Priority 🟡</option>
                                <option value="LOCKED">Cases Closed 🟢</option>
                            </select>
                            <input type="text" className="form-input" placeholder="Search name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{width: '200px'}} />
                        </div>
                    </div>

                    <div className="card">
                        <div style={{overflowX: 'auto'}}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Stage</th>
                                        <th>Next Action</th>
                                        <th>Priority</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr><td colSpan="5" style={{textAlign:'center'}}>No students found.</td></tr>
                                    ) : (
                                        filteredStudents.map(student => {
                                            const pClass = `priority-${student.priority || 'low'}`;
                                            const lastNote = student.counsellorNotes?.[student.counsellorNotes.length - 1];
                                            
                                            return (
                                                <tr key={student.id}>
                                                    <td className={pClass} style={{paddingLeft: '15px'}}><strong style={{color:'white'}}>{student.name}</strong></td>
                                                    <td><span className="badge badge-neutral">{student.counsellingStage || 'Assessment'}</span></td>
                                                    <td style={{color:'var(--text-muted)', maxWidth: '200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                                        {lastNote?.nextActionDate ? `📅 ${lastNote.nextActionDate}` : 'No plan set'}
                                                    </td>
                                                    <td>
                                                        <select className="form-select" style={{padding:'4px 8px', fontSize:'0.8rem', width:'120px'}} value={student.priority || 'low'} onChange={(e) => updateStudentPriority(student.id, e.target.value)}>
                                                            <option value="high">High 🔴</option>
                                                            <option value="medium">Medium 🟡</option>
                                                            <option value="low">Low 🟢</option>
                                                        </select>
                                                    </td>
                                                    <td><button className="btn btn-outline" style={{padding:'6px 12px', fontSize:'0.8rem'}} onClick={() => setStudentModal(student)}>Open File</button></td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );

        case 'sessions':
            return (
                <div className="tab-content active">
                    <div className="header-bar"><h1>Session Logger</h1><p>Draft notes automatically save if you accidentally close the page.</p></div>
                    <div className="grid-2col">
                        <div className="card" style={{borderTop: '4px solid var(--primary)'}}>
                            <h3>Log Session & Next Steps</h3>
                            <div className="form-group">
                                <select className="form-select" value={newSession.studentId} onChange={(e) => handleSessionChange('studentId', e.target.value)}>
                                    <option value="">-- Select Student --</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            
                            <div className="grid-2col" style={{gap:'15px'}}>
                                <div className="form-group">
                                    <label className="form-label">Session Type</label>
                                    <select className="form-select" value={newSession.type} onChange={(e) => handleSessionChange('type', e.target.value)}>
                                        <option value="Exploration">Exploration</option>
                                        <option value="Parent Meeting">Parent Meeting</option>
                                        <option value="Report Review">Report Review</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Update Journey Stage</label>
                                    <select className="form-select" value={newSession.counsellingStage} onChange={(e) => handleSessionChange('counsellingStage', e.target.value)}>
                                        <option value="Assessment">Assessment</option>
                                        <option value="Exploration">Exploration</option>
                                        <option value="Decision">Decision Making</option>
                                        <option value="Finalisation">Finalisation (Closed)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Session Summary</label>
                                <textarea className="form-textarea" rows="4" placeholder="Key topics discussed..." value={newSession.note} onChange={(e) => handleSessionChange('note', e.target.value)}></textarea>
                            </div>
                            
                            <div style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '15px'}}>
                                <h4 style={{margin: '0 0 10px 0', color: 'var(--secondary)'}}>Actionable Next Steps</h4>
                                <div className="grid-2col" style={{gap: '15px'}}>
                                    <div className="form-group">
                                        <label className="form-label">Next Meeting Date</label>
                                        <input type="date" className="form-input" value={newSession.nextActionDate} onChange={(e) => handleSessionChange('nextActionDate', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Homework / Task assigned</label>
                                        <input type="text" className="form-input" placeholder="e.g. Research 3 colleges" value={newSession.homeworkTask} onChange={(e) => handleSessionChange('homeworkTask', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <button className="btn" onClick={saveSessionNotes} style={{width: '100%'}}>💾 Commit to Timleine</button>
                        </div>
                    </div>
                </div>
            );

        case 'chat':
            return (
                <div className="tab-content active">
                    <div className="header-bar"><h1>Direct Student Chat</h1><p>Secure two-way communication channel.</p></div>
                    <div className="grid-3-1">
                        <div className="card" style={{borderTop: '4px solid var(--secondary)', display:'flex', flexDirection:'column', height: '60vh', padding: '0'}}>
                            <div style={{padding: '20px', borderBottom: '1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <h3 style={{border:'none', padding:'0', margin:'0'}}>Chat: <span>{activeChatStudent ? activeChatStudent.name : 'Select a student'}</span></h3>
                                {activeChatStudent && <button className="btn-outline" style={{padding:'4px 8px', fontSize:'0.8rem'}} onClick={convertChatToNote}>Convert to Note</button>}
                            </div>
                            <div style={{flex:'1', padding: '20px', overflowY:'auto', background: '#0f172a'}}>
                                {!activeChatStudent ? (
                                    <div style={{textAlign:'center', color:'var(--text-muted)', marginTop:'20px'}}>Select a student from the panel to view history.</div>
                                ) : (
                                    <>
                                        {chatMessages.map((msg, idx) => {
                                            const isMe = msg.senderId === userProfile?.email;
                                            const timeString = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sending...';
                                            return (
                                                <div key={idx} className={`chat-message ${isMe ? 'msg-me' : 'msg-them'}`}>
                                                    {msg.text}
                                                    <div style={{fontSize:'0.75rem', opacity:0.7, marginTop:'4px', textAlign: isMe ? 'right' : 'left'}}>{timeString}</div>
                                                </div>
                                            )
                                        })}
                                        <div ref={chatEndRef} />
                                    </>
                                )}
                            </div>
                            <div style={{padding: '20px', borderTop: '1px solid var(--border)', display:'flex', gap:'10px'}}>
                                <input type="text" className="form-input" placeholder="Type a message..." style={{margin:'0'}} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} disabled={!activeChatStudent} />
                                <button className="btn" onClick={sendChatMessage} disabled={!activeChatStudent}>Send</button>
                            </div>
                        </div>
                        <div className="card" style={{padding:'0', overflowY:'auto', height: '60vh'}}>
                            <h3 style={{padding: '20px', margin:'0', borderBottom: '1px solid var(--border)'}}>Active Roster</h3>
                            <div>
                                {students.map(s => (
                                    <div key={s.id} onClick={() => setActiveChatStudent({id: s.id, name: s.name})} style={{padding: '15px 20px', cursor:'pointer', background: activeChatStudent?.id === s.id ? 'rgba(255,255,255,0.05)' : 'transparent', display:'flex', justifyContent:'space-between'}}>
                                        <div>
                                            <strong style={{color:'white', display:'block'}}>{s.name}</strong>
                                        </div>
                                        <span style={{color:'var(--primary)'}}>💬</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );

        default:
            return <div className="tab-content active"><h2>Module Under Construction</h2></div>;
    }
  };

  // --- RENDER MODALS ---
  const renderStudentModal = () => {
      if(!studentModal) return null;
      
      // Calculate Journey Stage
      const stages = ['Assessment', 'Exploration', 'Decision', 'Finalisation'];
      const currentStageIdx = stages.indexOf(studentModal.counsellingStage || 'Assessment');

      return (
          <div className="modal-overlay" onClick={() => setStudentModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="profile-360-header">
                    <div>
                        <h2 style={{margin: '0 0 5px 0', color: 'white'}}>{studentModal.name}</h2>
                        <span className={`badge priority-${studentModal.priority || 'low'}`}>{studentModal.priority || 'low'} priority</span>
                    </div>
                    <button onClick={() => setStudentModal(null)} style={{background:'transparent', border:'none', color:'var(--text-muted)', fontSize:'1.8rem', cursor:'pointer'}}>&times;</button>
                </div>
                
                {/* 🚀 JOURNEY TRACKER */}
                <div className="journey-track">
                    {stages.map((stage, idx) => (
                        <div key={stage} className="journey-step">
                            <div className={`step-dot ${idx <= currentStageIdx ? 'active' : ''}`}>{idx < currentStageIdx ? '✓' : idx + 1}</div>
                            <div className="step-label" style={{color: idx <= currentStageIdx ? 'var(--primary)' : 'var(--text-muted)'}}>{stage}</div>
                        </div>
                    ))}
                </div>

                <div className="modal-header-nav">
                    <button className={`modal-nav-tab ${studentModalTab === 'timeline' ? 'active' : ''}`} onClick={() => setStudentModalTab('timeline')}>Session Timeline</button>
                    <button className={`modal-nav-tab ${studentModalTab === 'documents' ? 'active' : ''}`} onClick={() => setStudentModalTab('documents')}>Documents & Reports</button>
                </div>
                
                {/* 🚀 FULL SESSION TIMELINE */}
                {studentModalTab === 'timeline' && (
                    <div style={{animation: 'fadeIn 0.2s ease'}}>
                        {!studentModal.counsellorNotes || studentModal.counsellorNotes.length === 0 ? (
                            <div style={{textAlign:'center', color:'var(--text-muted)', padding:'20px'}}>No sessions logged yet.</div>
                        ) : (
                            <div className="timeline">
                                {studentModal.counsellorNotes.slice().reverse().map((note, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-date">{new Date(note.date).toLocaleDateString('en-GB')} • {note.type}</div>
                                        <div className="timeline-content">
                                            <p style={{margin: '0 0 10px 0', lineHeight: 1.5}}>{note.note}</p>
                                            {(note.nextActionDate || note.homeworkTask) && (
                                                <div style={{background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--secondary)', fontSize: '0.85rem'}}>
                                                    <strong style={{color:'var(--secondary)'}}>Next Steps:</strong><br/>
                                                    {note.nextActionDate && <span>📅 Follow up on: {note.nextActionDate}<br/></span>}
                                                    {note.homeworkTask && <span>📝 Task: {note.homeworkTask}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 🚀 DOCUMENT SYSTEM */}
                {studentModalTab === 'documents' && (
                    <div style={{animation: 'fadeIn 0.2s ease'}}>
                        <div className="card" style={{borderStyle: 'dashed'}}>
                            <h3 style={{borderBottom: 'none', marginBottom: 0}}>Upload Report / File</h3>
                            <input type="file" className="form-input" style={{marginBottom: '10px'}} />
                            <button className="btn">Upload to Vault</button>
                        </div>
                        <p style={{color:'var(--text-muted)', textAlign:'center'}}>No documents uploaded yet.</p>
                    </div>
                )}

            </div>
        </div>
      )
  };

  return (
    <div className="dashboard-root">
        {/* SIDEBAR */}
        <div className="sidebar">
            <div className="brand">
                <h2>Career Intel</h2>
                <span style={{color:'var(--text-muted)', paddingLeft:'20px', fontSize:'0.75rem', letterSpacing: '1px'}}>CLINICAL PANEL</span>
            </div>
            <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>🏠 Overview</button>
            <button className={`nav-btn ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')}>🎓 Roster & Priority</button>
            <button className={`nav-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>📅 Session Logger</button>
            <button className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>💬 Messages</button>
        </div>

        {/* MAIN WRAPPER */}
        <div className="main-wrapper">
            <div className="top-header">
                <h2 style={{margin:0, fontSize:'1.1rem', color:'var(--text-muted)'}}>Counselor Dashboard</h2>
                <div className="header-actions">
                    <div className="profile-menu">
                        <div className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        {profileOpen && (
                            <div className="dropdown-content">
                                <button style={{color:'var(--danger)'}} onClick={handleLogout}>🚪 Secure Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="main-content">
                {renderTab()}
            </div>
        </div>

        {alertModal && (
            <div className="modal-overlay">
                <div className="modal-content" style={{maxWidth: '400px', textAlign: 'center'}}>
                    <h3 style={{color: 'var(--danger)', marginTop: 0}}>{alertModal.title}</h3>
                    <p style={{color: 'var(--text-muted)', marginBottom: '25px'}}>{alertModal.message}</p>
                    <button className="btn" style={{width: '100%'}} onClick={() => setAlertModal(null)}>Acknowledge</button>
                </div>
            </div>
        )}
        
        {renderStudentModal()}
    </div>
  );
}
