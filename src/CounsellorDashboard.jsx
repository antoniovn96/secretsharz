import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase'; // Ensure your firebase import path is correct
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

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
  .site-link { color: var(--secondary); text-decoration: none; font-weight: bold; padding: 8px 15px; border-radius: 8px; background: rgba(6, 182, 212, 0.1); transition: 0.2s;}
  .site-link:hover { background: rgba(6, 182, 212, 0.2); }
  
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
  
  .btn { background: linear-gradient(45deg, var(--primary), #a855f7); color: white; border: none; padding: 12px 25px; font-size: 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s; }
  .btn:hover { opacity: 0.9; transform: translateY(-2px); }
  .btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight:bold;}
  .btn-outline:hover { background: rgba(139, 92, 246, 0.1); }

  .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; }
  .data-table tr:hover { background: rgba(255,255,255,0.02); }

  .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; display:inline-block;}
  .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); border: 1px solid var(--success);}
  .badge-warning { background: rgba(245, 158, 11, 0.2); color: var(--warning); border: 1px solid var(--warning);}
  .badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger);}

  /* CASE LIST STYLING */
  .case-item { display: flex; align-items: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 12px; margin-bottom: 12px; border: 1px solid transparent; transition: 0.2s; }
  .case-item:hover { border-color: var(--primary); transform: translateX(5px); }
  .case-status { width: 12px; height: 12px; border-radius: 50%; margin-right: 15px; flex-shrink: 0;}
  .case-info { flex: 1; }
  .case-time { font-size: 0.8rem; color: var(--secondary); font-weight: bold; }

  /* CHAT STYLES */
  .chat-message { padding: 12px 18px; border-radius: 12px; margin-bottom: 12px; font-size: 0.95rem; max-width: 85%; line-height: 1.5;}
  .msg-me { background: var(--primary); color: white; margin-left: auto; border-bottom-right-radius: 0; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.2);}
  .msg-them { background: rgba(255,255,255,0.05); color: white; margin-right: auto; border-bottom-left-radius: 0; border: 1px solid var(--border);}

  /* MODAL UI */
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 3000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); animation: fadeIn 0.2s ease;}
  .modal-content { background: var(--card-bg); width: 900px; max-width: 95%; max-height: 90vh; overflow-y: auto; padding: 30px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);}
  
  .profile-360-header { display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary); padding-bottom: 15px; margin-bottom: 20px;}
  .readiness-track { display: flex; gap: 5px; margin-top: 10px;}
  .readiness-box { flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative;}
  .readiness-box.active { background: var(--success); box-shadow: 0 0 10px var(--success);}

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// --- MAIN COMPONENT ---
export default function CounsellorDashboard() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertModal, setAlertModal] = useState(null);
  const [studentModal, setStudentModal] = useState(null);
  
  const [students, setStudents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [chatInput, setChatInput] = useState('');
  
  // Filters
  const [clinicalFilter, setClinicalFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Session Logging State
  const [newSession, setNewSession] = useState({
      studentId: '', type: 'Exploration', parentAttended: 'No', note: '', adminNotes: ''
  });

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
        
        // Fetch Students
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
        // Redirect to login if not authenticated
        window.location.href = "/login"; 
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchStudents = async () => {
      try {
          const snap = await getDocs(collection(db, "students"));
          const sList = [];
          snap.forEach(doc => sList.push({ id: doc.id, ...doc.data() }));
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
      try {
          await signOut(auth);
      } catch(e) {
          console.error(e);
      }
  };

  const updateBookingStatus = async (id, status) => {
    try { 
        await updateDoc(doc(db, "bookings", id), { status: status }); 
    } catch (e) { 
        console.error(e); 
        showAlert("Failed to update status.", "Error"); 
    }
  };

  const saveSessionNotes = async () => {
    if(!newSession.studentId || !newSession.note) return showAlert("Please select a student and write a session summary.", "Incomplete Log");

    try {
        await updateDoc(doc(db, "students", newSession.studentId), {
            counsellorNotes: arrayUnion({
                date: new Date().toISOString(), 
                type: newSession.type,
                parentAttended: newSession.parentAttended,
                note: newSession.note, 
                adminEscalation: newSession.adminNotes, 
                counsellorEmail: userProfile.email
            })
        });
        showAlert("Structured clinical notes saved to student dossier.", "Log Saved", false);
        setNewSession({ studentId: '', type: 'Exploration', parentAttended: 'No', note: '', adminNotes: '' });
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
             // Scroll to bottom
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
            text: text,
            senderId: userProfile.email,
            senderType: 'counsellor',
            timestamp: serverTimestamp()
        });
    } catch(e) {
        console.error(e);
        showAlert("Error sending message.", "Network Error");
    }
  };

  // --- DERIVED DATA ---
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;

  const filteredStudents = useMemo(() => {
      return students.filter(s => {
          const matchSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase());
          
          let isHighRisk = s.psychIndex && s.psychIndex.riskCategory === "High";
          
          let matchFilter = true;
          if(clinicalFilter === "RISK") matchFilter = isHighRisk;
          if(clinicalFilter === "LOCKED") matchFilter = s.careerLocked;
          if(clinicalFilter === "PENDING") matchFilter = !s.assessmentCompleted;

          return matchSearch && matchFilter;
      });
  }, [students, searchQuery, clinicalFilter]);

  const riskCount = students.filter(s => s.psychIndex && s.psychIndex.riskCategory === "High").length;

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
                        <div className="kpi-box" style={{borderTop: '3px solid var(--primary)'}}><h4>Assigned Students</h4><div className="val">{students.length}</div></div>
                        <div className="kpi-box" style={{borderTop: '3px solid var(--secondary)'}}><h4>Pending Requests</h4><div className="val">{pendingBookings}</div></div>
                        <div className="kpi-box" style={{borderTop: '3px solid var(--danger)'}}><h4>High Risk Flags</h4><div className="val">{riskCount}</div></div>
                        <div className="kpi-box" style={{borderTop: '3px solid var(--success)'}}><h4>Confirmed Sessions</h4><div className="val">{confirmedBookings}</div></div>
                    </div>

                    <div className="grid-3-1">
                        <div>
                            <div className="card">
                                <h3>Appointment Requests & Queue</h3>
                                <div>
                                    {bookings.length === 0 ? (
                                        <div style={{textAlign:'center', color:'var(--text-muted)', padding: '20px'}}>No appointments booked yet.</div>
                                    ) : (
                                        bookings.map(b => {
                                            let statusColor = b.status === 'Pending' ? 'var(--warning)' : (b.status === 'Confirmed' ? 'var(--success)' : 'var(--danger)');
                                            return (
                                                <div key={b.id} className="case-item">
                                                    <div className="case-status" style={{background: statusColor}}></div>
                                                    <div className="case-info">
                                                        <span className="case-time">{b.date} at {b.time} ({b.medium})</span>
                                                        <div style={{fontWeight:'bold', color:'white', fontSize:'1.1rem', marginTop:'2px'}}>
                                                            {b.studentName} <span className="badge" style={{marginLeft:'10px', background:'rgba(255,255,255,0.1)', color:statusColor, border:`1px solid ${statusColor}`}}>{b.status}</span>
                                                        </div>
                                                        <div style={{fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'4px'}}>
                                                            📞 <a href={`tel:${b.phone}`} style={{color:'var(--secondary)', textDecoration:'none'}}>{b.phone}</a> &nbsp;|&nbsp; 
                                                            ✉️ <a href={`mailto:${b.studentEmail}`} style={{color:'var(--secondary)', textDecoration:'none'}}>{b.studentEmail}</a>
                                                        </div>
                                                    </div>
                                                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                                        {b.status === 'Pending' && (
                                                            <>
                                                                <button className="btn" style={{padding: '6px 12px', fontSize: '0.8rem', background:'var(--success)'}} onClick={() => updateBookingStatus(b.id, 'Confirmed')}>Accept</button>
                                                                <button className="btn btn-outline" style={{padding: '6px 12px', fontSize: '0.8rem', borderColor:'var(--danger)', color:'var(--danger)'}} onClick={() => updateBookingStatus(b.id, 'Cancelled')}>Decline</button>
                                                            </>
                                                        )}
                                                        {b.status === 'Confirmed' && (
                                                            <button className="btn" style={{padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => { setActiveChatStudent({id: b.studentId, name: b.studentName}); setActiveTab('chat'); }}>Message Student</button>
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
                            <div className="card" style={{borderTop: '4px solid var(--danger)'}}>
                                <h3>System Alerts</h3>
                                <div style={{fontSize:'0.9rem', color:'var(--text-muted)', lineHeight: '1.6'}}>
                                    {riskCount > 0 ? (
                                        <p><strong style={{color:'var(--danger)'}}>⚠️ Urgent:</strong> {riskCount} students flagged with High Risk clinical metrics. Review Intervention Panel.</p>
                                    ) : (
                                        <p style={{color:'var(--success)'}}>System clear. No urgent clinical flags detected.</p>
                                    )}
                                </div>
                                
                                {riskCount > 0 && (
                                    <div style={{marginTop:'20px', paddingTop:'15px', borderTop:'1px dashed var(--border)'}}>
                                        <span style={{fontSize:'0.8rem', fontWeight:'bold', color:'var(--primary)', textTransform:'uppercase'}}>🎯 Smart Suggestion</span>
                                        <p style={{margin:'5px 0', color:'white', fontSize:'0.9rem'}}>System detects elevated stress across multiple files. Recommend bulk dispatching 'Parent Alignment Worksheet'.</p>
                                    </div>
                                )}
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
                            <h1>Student Queue</h1>
                            <p>Live database of all students assigned to your roster.</p>
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <select className="form-select" value={clinicalFilter} onChange={(e) => setClinicalFilter(e.target.value)} style={{width:'180px'}}>
                                <option value="ALL">All Students</option>
                                <option value="RISK">High Risk Flags</option>
                                <option value="LOCKED">Career Locked</option>
                                <option value="PENDING">Needs Assessment</option>
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
                                        <th>Email</th>
                                        <th>Grade</th>
                                        <th>Assessment</th>
                                        <th>Primary Flag</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr><td colSpan="6" style={{textAlign:'center'}}>No students found matching filters.</td></tr>
                                    ) : (
                                        filteredStudents.map(student => {
                                            let isHighRisk = student.psychIndex && student.psychIndex.riskCategory === "High";
                                            let riskString = "None";
                                            let riskBadge = <span className="badge badge-success">Stable</span>;

                                            if(isHighRisk) {
                                                if(student.academic && parseFloat(student.academic.overallScore) < 55) riskString = "Academic Mismatch";
                                                else if(student.psychIndex.parentPressure > 70) riskString = "Parent Expectation";
                                                else riskString = "Low Clarity / High Stress";
                                            } else if (!student.assessmentCompleted) {
                                                riskBadge = <span className="badge badge-warning">Needs Assmnt</span>;
                                            }

                                            return (
                                                <tr key={student.id}>
                                                    <td><strong style={{color:'white'}}>{student.name}</strong></td>
                                                    <td style={{color:'var(--text-muted)'}}>{student.email}</td>
                                                    <td>Grade {student.grade || 'N/A'}</td>
                                                    <td>{student.assessmentCompleted ? <span style={{color:'var(--success)'}}>Complete</span> : <span style={{color:'var(--text-muted)'}}>Pending</span>}</td>
                                                    <td>{riskString !== "None" ? <span style={{color:'var(--danger)', fontWeight:'bold', fontSize:'0.85rem'}}>{riskString}</span> : riskBadge}</td>
                                                    <td><button className="btn btn-outline" style={{padding:'6px 12px', fontSize:'0.8rem'}} onClick={() => setStudentModal(student)}>View File</button></td>
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
                    <div className="header-bar"><h1>Session & Case Manager</h1><p>Log structured clinical notes for student files.</p></div>
                    <div className="grid-2col">
                        <div className="card" style={{borderTop: '4px solid var(--primary)'}}>
                            <h3>Log Structured Case Notes</h3>
                            <div className="form-group">
                                <select className="form-select" value={newSession.studentId} onChange={(e) => setNewSession({...newSession, studentId: e.target.value})}>
                                    <option value="">-- Select Student --</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade || 'N/A'})</option>)}
                                </select>
                            </div>
                            
                            <div className="grid-2col" style={{gap:'15px'}}>
                                <div className="form-group">
                                    <label className="form-label">Session Type</label>
                                    <select className="form-select" value={newSession.type} onChange={(e) => setNewSession({...newSession, type: e.target.value})}>
                                        <option value="Exploration">Exploration</option>
                                        <option value="Clarification">Clarification</option>
                                        <option value="Conflict Resolution">Parent Conflict Resolution</option>
                                        <option value="Study Abroad Planning">Study Abroad Planning</option>
                                        <option value="Crisis Intervention">Crisis Intervention</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Parent Attended?</label>
                                    <select className="form-select" value={newSession.parentAttended} onChange={(e) => setNewSession({...newSession, parentAttended: e.target.value})}>
                                        <option value="No">No</option>
                                        <option value="Yes - Supportive">Yes - Supportive</option>
                                        <option value="Yes - High Pressure">Yes - High Pressure</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Session Outcomes & Homework</label>
                                <textarea className="form-textarea" rows="3" placeholder="Notes shared with student/parents..." value={newSession.note} onChange={(e) => setNewSession({...newSession, note: e.target.value})}></textarea>
                            </div>
                            
                            <div className="form-group" style={{padding: '10px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '8px', border: '1px dashed var(--accent)'}}>
                                <label className="form-label" style={{color: 'var(--accent)'}}>Internal Admin Escalation (Hidden from Student)</label>
                                <textarea className="form-textarea" rows="2" placeholder="Private alerts or concerns for Super Admin..." style={{borderColor: 'var(--accent)'}} value={newSession.adminNotes} onChange={(e) => setNewSession({...newSession, adminNotes: e.target.value})}></textarea>
                            </div>

                            <button className="btn btn-outline" onClick={saveSessionNotes} style={{width: '100%'}}>Save to Case File</button>
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
                            <div style={{padding: '20px', borderBottom: '1px solid var(--border)'}}>
                                <h3 style={{border:'none', padding:'0', margin:'0'}}>Chat: <span>{activeChatStudent ? activeChatStudent.name : 'Select a student'}</span></h3>
                            </div>
                            <div style={{flex:'1', padding: '20px', overflowY:'auto', background: '#0f172a'}}>
                                {!activeChatStudent ? (
                                    <div style={{textAlign:'center', color:'var(--text-muted)', marginTop:'20px'}}>Select a student from the panel to view history.</div>
                                ) : (
                                    <>
                                        <div style={{textAlign:'center', color:'var(--text-muted)', marginBottom: '20px', fontSize:'0.85rem'}}>🔒 Secure connection established.</div>
                                        {chatMessages.length === 0 ? (
                                            <div style={{textAlign:'center', color:'var(--text-muted)'}}>No messages yet.</div>
                                        ) : (
                                            chatMessages.map((msg, idx) => {
                                                const isMe = msg.senderId === userProfile?.email;
                                                const timeString = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sending...';
                                                return (
                                                    <div key={idx} className={`chat-message ${isMe ? 'msg-me' : 'msg-them'}`}>
                                                        {msg.text}
                                                        <div style={{fontSize:'0.75rem', opacity:0.7, marginTop:'4px', textAlign: isMe ? 'right' : 'left'}}>{timeString}</div>
                                                    </div>
                                                )
                                            })
                                        )}
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
                                            <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Grade {s.grade || 'N/A'}</span>
                                        </div>
                                        <span style={{color:'var(--primary)'}}>💬</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
            
        case 'profile':
            return (
                <div className="tab-content active">
                     <div className="header-bar">
                        <div><h1>My Counsellor Profile</h1><p>Update your public details and experience.</p></div>
                    </div>
                    <div className="card" style={{borderTop: '4px solid var(--primary)'}}>
                        <p style={{color: 'var(--text-muted)'}}>Your profile functionality is handled via the Super Admin Dashboard component.</p>
                    </div>
                </div>
            )

        default:
            return <div className="tab-content active"><h2>Module Under Construction</h2></div>;
    }
  };

  // --- RENDER MODALS ---
  const renderAlertModal = () => {
      if(!alertModal) return null;
      return (
          <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '400px', textAlign: 'center'}}>
                <h3 style={{color: 'var(--danger)', marginTop: 0, fontSize: '1.5rem'}}>{alertModal.title}</h3>
                <p style={{color: 'var(--text-muted)', marginBottom: '25px', lineHeight: 1.5, fontSize: '1.05rem'}}>{alertModal.message}</p>
                <button className="btn" style={{width: '100%', padding: '14px'}} onClick={() => setAlertModal(null)}>Acknowledge</button>
            </div>
        </div>
      )
  };

  const renderStudentModal = () => {
      if(!studentModal) return null;
      
      let riskReason = "Stable";
      let rClass = "badge-success";
      if(studentModal.psychIndex && studentModal.psychIndex.riskCategory === "High") {
          rClass = "badge-danger";
          if(studentModal.academic && parseFloat(studentModal.academic.overallScore) < 55) riskReason = "Academic Mismatch Risk";
          else if(studentModal.psychIndex.parentPressure > 70) riskReason = "High Parent Expectation";
          else riskReason = "Low Clarity / High Stress";
      }

      let topSub = "--";
      if(studentModal.academic && studentModal.academic.subjects && studentModal.academic.subjects.length > 0) {
          topSub = studentModal.academic.subjects[0].name;
      }

      const lastNote = studentModal.counsellorNotes && studentModal.counsellorNotes.length > 0 
          ? studentModal.counsellorNotes[studentModal.counsellorNotes.length - 1] 
          : null;

      return (
          <div className="modal-overlay" onClick={() => setStudentModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="profile-360-header">
                    <div>
                        <h2 style={{margin: '0 0 5px 0', color: 'white'}}>{studentModal.name}</h2>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{studentModal.email}</span>
                        <div style={{marginTop: '10px', display:'flex', gap:'5px'}}>
                            <span className="badge" style={{background:'rgba(6,182,212,0.2)', color:'var(--secondary)', border:'1px solid var(--secondary)'}}>Grade {studentModal.grade || '--'}</span>
                            <span className={`badge ${studentModal.assessmentCompleted ? 'badge-success' : 'badge-warning'}`}>{studentModal.assessmentCompleted ? 'Assessment Done' : 'Pending Test'}</span>
                            <span className={`badge ${rClass}`}>{riskReason}</span>
                        </div>
                    </div>
                    <button onClick={() => setStudentModal(null)} style={{background:'transparent', border:'none', color:'var(--text-muted)', fontSize:'1.8rem', cursor:'pointer'}}>&times;</button>
                </div>
                
                <div className="grid-2col">
                    <div>
                        <div className="card" style={{marginBottom:'20px', background:'rgba(0,0,0,0.2)'}}>
                            <h3 style={{fontSize:'1rem', borderBottom:'1px dashed var(--border)'}}>📊 Academic & Career Alignment</h3>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Current Stream:</span>
                                <strong style={{color:'white'}}>{studentModal.academic?.stream || "--"}</strong>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Avg Marks:</span>
                                <strong style={{color:'white'}}>{studentModal.academic?.overallScore ? `${studentModal.academic.overallScore}%` : "--"}</strong>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Top Subject:</span>
                                <strong style={{color:'var(--secondary)'}}>{topSub}</strong>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card" style={{marginBottom:'0', background:'rgba(0,0,0,0.2)'}}>
                            <h3 style={{fontSize:'1rem', borderBottom:'1px dashed var(--border)'}}>📋 Clinical Case Summary</h3>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'0.9rem'}}>
                                <span style={{color:'var(--text-muted)'}}>Total Sessions:</span>
                                <strong style={{color:'white'}}>{studentModal.sessionsHad || "0"}</strong>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'0.9rem'}}>
                                <span style={{color:'var(--text-muted)'}}>Parent Involvement:</span>
                                <strong style={{color:'var(--warning)'}}>{lastNote ? lastNote.parentAttended : 'Unknown'}</strong>
                            </div>
                            
                            <div style={{background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', maxHeight: '150px', overflowY:'auto'}}>
                                {lastNote ? (
                                    <>
                                        <span style={{color:'var(--primary)', fontSize:'0.8rem', fontWeight:'bold'}}>{new Date(lastNote.date).toLocaleDateString()} - {lastNote.type}</span><br/>
                                        {lastNote.note}
                                    </>
                                ) : "No previous session notes found."}
                            </div>
                        </div>
                    </div>
                </div>
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
            <button className={`nav-btn ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')}>🎓 Student Queue</button>
            <button className={`nav-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>📅 Session Manager</button>
            <button className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>💬 Direct Chat</button>
            <div style={{borderTop: '1px solid var(--border)', margin: '15px 20px'}}></div>
            <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>⚙️ My Profile</button>
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
                                <div style={{padding: '15px', borderBottom: '1px solid var(--border)', background:'rgba(0,0,0,0.2)'}}>
                                    <strong style={{color:'white', display:'block'}}>{userProfile?.name}</strong>
                                    <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{userProfile?.email}</span>
                                </div>
                                <button onClick={() => {setActiveTab('profile'); setProfileOpen(false);}}>⚙️ My Profile</button>
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

        {renderAlertModal()}
        {renderStudentModal()}
    </div>
  );
}
