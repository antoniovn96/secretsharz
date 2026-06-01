import React, { useState, useEffect, useRef, useMemo } from 'react';
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, arrayUnion, collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useDashboard } from './context/DashboardContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg: #F0F4F8;
    --sidebar-bg: #0F2027;
    --card-bg: #FFFFFF;
    --primary: #0EA5E9;
    --primary-light: #E0F2FE;
    --secondary: #6366F1;
    --accent: #10B981;
    --text-main: #1A1F36;
    --text-muted: #6B7A99;
    --border: #E4E9F2;
    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
    --r-sm: 10px;
    --r-md: 16px;
    --r-lg: 20px;
  }

  .c-root {
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--text-main);
    margin: 0;
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .c-sidebar {
    width: 260px;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-shrink: 0;
    box-shadow: 4px 0 24px rgba(0,0,0,0.2);
  }
  .c-sidebar::-webkit-scrollbar { width: 4px; }
  .c-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

  .c-brand {
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 8px;
  }
  .c-brand h2 {
    margin: 0 0 4px 0;
    font-size: 1.2rem;
    font-weight: 800;
    color: white;
    letter-spacing: -0.5px;
  }
  .c-brand-sub {
    font-size: 10px;
    color: rgba(255,255,255,0.3);
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .c-nav-label {
    padding: 16px 24px 6px;
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.25);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .c-nav-btn {
    background: transparent;
    color: rgba(255,255,255,0.5);
    border: none;
    text-align: left;
    padding: 11px 20px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Inter', sans-serif;
    margin: 1px 0;
  }
  .c-nav-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
  .c-nav-btn.active { background: rgba(14,165,233,0.2); color: white; border-left-color: var(--primary); font-weight: 600; }

  /* Portal Switcher */
  .c-portal-switcher {
    margin: 12px 16px;
    padding: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--r-md);
  }
  .c-portal-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
    padding: 0 4px;
  }
  .c-portal-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    background: transparent;
    border: none;
    border-radius: var(--r-sm);
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    text-align: left;
  }
  .c-portal-btn:hover { background: rgba(255,255,255,0.07); color: white; }
  .c-portal-btn.current { background: rgba(14,165,233,0.25); color: white; font-weight: 600; }
  .c-portal-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── MAIN ── */
  .c-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .c-top-header {
    background: var(--card-bg);
    height: 68px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }
  .c-header-title { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
  .c-header-actions { display: flex; align-items: center; gap: 12px; }

  .c-avatar-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid var(--primary);
    cursor: pointer;
    background: var(--primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-weight: 700;
    font-size: 0.9rem;
    transition: 0.2s;
  }
  .c-avatar-btn:hover { background: var(--primary); color: white; }

  .c-dropdown {
    position: absolute;
    right: 0;
    background: var(--card-bg);
    min-width: 200px;
    box-shadow: var(--shadow-lg);
    z-index: 100;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    overflow: hidden;
    margin-top: 8px;
  }
  .c-dropdown button {
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    color: var(--text-main);
    padding: 12px 16px;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    transition: 0.15s;
  }
  .c-dropdown button:last-child { border-bottom: none; }
  .c-dropdown button:hover { background: var(--bg); color: var(--primary); }

  /* ── CONTENT ── */
  .c-content { flex: 1; padding: 28px 32px; overflow-y: auto; }
  .c-header-bar { margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
  .c-header-bar h1 { margin: 0 0 4px 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }
  .c-header-bar p { margin: 0; color: var(--text-muted); font-size: 0.875rem; }

  /* ── CARDS ── */
  .c-card {
    background: var(--card-bg);
    padding: 24px;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s;
  }
  .c-card:hover { box-shadow: var(--shadow-md); }
  .c-card h3 {
    margin-top: 0;
    color: var(--text-main);
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
    font-size: 1rem;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* ── KPI ── */
  .c-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .c-kpi-box {
    background: var(--card-bg);
    padding: 20px;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
  }
  .c-kpi-box:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .c-kpi-box h4 { margin: 0 0 8px 0; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  .c-kpi-box .c-val { font-size: 1.75rem; font-weight: 800; color: var(--text-main); letter-spacing: -1px; }

  /* ── GRIDS ── */
  .c-grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
  .c-grid-equal { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* ── FORMS ── */
  .c-form-group { margin-bottom: 16px; }
  .c-form-label { display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .c-form-input, .c-form-select, .c-form-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--r-sm);
    font-size: 0.9rem;
    color: var(--text-main);
    background: var(--bg);
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s;
  }
  .c-form-input:focus, .c-form-select:focus, .c-form-textarea:focus {
    border-color: var(--primary);
    outline: none;
    background: white;
  }

  /* ── BUTTONS ── */
  .c-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--r-sm);
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 8px rgba(14,165,233,0.3);
  }
  .c-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .c-btn-outline {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text-main);
    padding: 8px 16px;
    border-radius: var(--r-sm);
    cursor: pointer;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    transition: 0.2s;
  }
  .c-btn-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

  /* ── CASE ITEMS ── */
  .c-case-item {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    background: var(--bg);
    border-radius: var(--r-md);
    margin-bottom: 10px;
    border: 1px solid var(--border);
    transition: all 0.2s;
    gap: 12px;
  }
  .c-case-item:hover { border-color: var(--primary); transform: translateX(4px); box-shadow: var(--shadow-sm); }
  .c-case-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .c-case-info { flex: 1; }
  .c-case-time { font-size: 0.75rem; color: var(--primary); font-weight: 700; margin-bottom: 2px; }
  .c-case-name { font-weight: 700; color: var(--text-main); font-size: 0.95rem; }

  /* ── BADGES ── */
  .c-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
  .c-badge-success { background: rgba(16,185,129,0.1); color: var(--success); border: 1px solid rgba(16,185,129,0.2); }
  .c-badge-warn { background: rgba(245,158,11,0.1); color: var(--warning); border: 1px solid rgba(245,158,11,0.2); }
  .c-badge-danger { background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
  .c-badge-neutral { background: var(--bg); color: var(--text-muted); border: 1px solid var(--border); }
  .c-badge-primary { background: var(--primary-light); color: var(--primary); }

  /* ── TABLE ── */
  .c-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .c-table th, .c-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
  .c-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; background: var(--bg); }
  .c-table tr:hover { background: var(--primary-light); }

  /* ── TIMELINE ── */
  .c-timeline { border-left: 2px solid var(--border); margin-left: 10px; padding-left: 20px; }
  .c-timeline-item { margin-bottom: 20px; position: relative; }
  .c-timeline-dot { position: absolute; left: -27px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid white; box-shadow: 0 0 0 2px var(--primary); }
  .c-timeline-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
  .c-timeline-content { background: var(--bg); padding: 14px; border-radius: var(--r-sm); border: 1px solid var(--border); font-size: 0.875rem; line-height: 1.6; }

  /* ── JOURNEY TRACKER ── */
  .c-journey { display: flex; justify-content: space-between; margin: 20px 0; position: relative; }
  .c-journey::before { content: ''; position: absolute; top: 15px; left: 0; width: 100%; height: 2px; background: var(--border); z-index: 1; }
  .c-journey-step { position: relative; z-index: 2; text-align: center; flex: 1; }
  .c-step-dot { width: 30px; height: 30px; border-radius: 50%; background: var(--card-bg); border: 2px solid var(--border); margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
  .c-step-dot.done { border-color: var(--primary); background: var(--primary); color: white; }
  .c-step-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── CHAT ── */
  .c-chat-msg { padding: 12px 16px; border-radius: var(--r-md); margin-bottom: 10px; font-size: 0.9rem; max-width: 80%; line-height: 1.5; }
  .c-msg-me { background: var(--primary); color: white; margin-left: auto; border-bottom-right-radius: 4px; box-shadow: 0 2px 8px rgba(14,165,233,0.25); }
  .c-msg-them { background: var(--bg); color: var(--text-main); margin-right: auto; border-bottom-left-radius: 4px; border: 1px solid var(--border); }

  /* ── MODAL ── */
  .c-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,31,54,0.6);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: c-fadeIn 0.2s ease;
  }
  .c-modal {
    background: var(--card-bg);
    width: 100%;
    max-width: 800px;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
  .c-modal-header { padding: 24px 24px 0; background: var(--bg); border-bottom: 1px solid var(--border); position: relative; }
  .c-modal-tabs { display: flex; gap: 4px; margin-top: 16px; }
  .c-modal-tab {
    background: none;
    border: none;
    color: var(--text-muted);
    font-weight: 600;
    padding: 10px 16px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: 0.2s;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
  }
  .c-modal-tab:hover { color: var(--text-main); }
  .c-modal-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
  .c-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
  .c-close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.2s;
  }
  .c-close-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* ── EMPTY STATE (standard) ── */
  .c-empty { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .c-empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4; }

  /* ── PREMIUM EMPTY STATE ── */
  .c-empty-premium {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 72px 40px;
    text-align: center;
  }
  .c-empty-premium-glow {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-light) 0%, rgba(99,102,241,0.12) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin-bottom: 28px;
    box-shadow: 0 0 0 16px rgba(14,165,233,0.06), 0 0 0 32px rgba(14,165,233,0.03);
  }
  .c-empty-premium h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 10px 0;
    letter-spacing: -0.3px;
  }
  .c-empty-premium p {
    font-size: 0.9rem;
    color: var(--text-muted);
    max-width: 380px;
    line-height: 1.7;
    margin: 0 0 28px 0;
  }
  .c-empty-premium-hint {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--bg);
    border: 1.5px dashed var(--border);
    border-radius: var(--r-md);
    padding: 12px 20px;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  /* ── ALERT MODAL ── */
  .c-alert-modal {
    background: var(--card-bg);
    max-width: 400px;
    width: 100%;
    border-radius: var(--r-lg);
    padding: 32px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
  }

  @keyframes c-fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default function CounsellorDashboard({ navigate }) {
  // ── Shared context ──────────────────────────────────────────────────────────
  const {
    getStudentsForCounsellor,
    updateStudent,
    addSessionToStudent,
    counsellors,
  } = useDashboard();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertModal, setAlertModal] = useState(null);

  // Students come exclusively from context, filtered to this counsellor
  const [myCounsellorId, setMyCounsellorId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const [studentModal, setStudentModal] = useState(null);
  const [studentModalTab, setStudentModalTab] = useState('timeline');
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [chatInput, setChatInput] = useState('');

  const [clinicalFilter, setClinicalFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [newSession, setNewSession] = useState({
    studentId: '',
    type: 'Exploration',
    note: '',
    nextActionDate: '',
    homeworkTask: '',
    counsellingStage: 'Exploration'
  });

  const chatEndRef = useRef(null);

  // ── Derive this counsellor's students from context ──────────────────────────
  const students = useMemo(() => {
    if (!myCounsellorId) return [];
    return getStudentsForCounsellor(myCounsellorId);
  }, [myCounsellorId, getStudentsForCounsellor]);

  // ── Inject styles ───────────────────────────────────────────────────────────
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ── Restore session draft from localStorage ─────────────────────────────────
  useEffect(() => {
    const savedDraft = localStorage.getItem('sessionDraft');
    if (savedDraft) {
      try { setNewSession(JSON.parse(savedDraft)); } catch (e) { /* ignore */ }
    }
  }, []);

  // ── Auth listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const name = user.displayName || user.email.split('@')[0];
        setUserProfile({
          uid: user.uid,
          email: user.email,
          name,
          photo: user.photoURL
        });

        // Match the logged-in user to a counsellor record in context
        const matched = counsellors.find(
          c => c.email.toLowerCase() === user.email.toLowerCase()
        );
        setMyCounsellorId(matched ? matched.id : user.uid);

        // Live bookings for this counsellor
        const qBookings = query(
          collection(db, 'bookings'),
          where('counsellorId', '==', user.email)
        );
        const unsubBookings = onSnapshot(qBookings, (snapshot) => {
          const b = [];
          snapshot.forEach(d => b.push({ id: d.id, ...d.data() }));
          b.sort((a, bk) => (bk.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
          setBookings(b);
        });

        return () => unsubBookings();
      } else {
        if (navigate) navigate('/auth');
        else window.location.href = '/auth';
      }
    });
    return () => unsubscribe();
  }, [counsellors]); // re-run if counsellors list changes

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const showAlert = (message, title = 'Notice') => setAlertModal({ title, message });

  const handleSessionChange = (field, value) => {
    const updated = { ...newSession, [field]: value };
    setNewSession(updated);
    localStorage.setItem('sessionDraft', JSON.stringify(updated));
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  const updateBookingStatus = async (id, status) => {
    try { await updateDoc(doc(db, 'bookings', id), { status }); }
    catch (e) { showAlert('Failed to update status.', 'Error'); }
  };

  const updateStudentPriority = (studentId, newPriority) => {
    // Update context (in-memory) and Firestore
    updateStudent(studentId, { priority: newPriority });
    updateDoc(doc(db, 'students', studentId), { priority: newPriority }).catch(console.error);
  };

  const saveSessionNotes = async () => {
    if (!newSession.studentId || !newSession.note) {
      return showAlert('Please select a student and write a session summary.', 'Incomplete Log');
    }
    try {
      const sessionPayload = {
        date: new Date().toISOString(),
        type: newSession.type,
        note: newSession.note,
        nextActionDate: newSession.nextActionDate,
        homeworkTask: newSession.homeworkTask,
        counsellorEmail: userProfile.email
      };

      // Update context
      addSessionToStudent(newSession.studentId, {
        ...sessionPayload,
        counsellingStage: newSession.counsellingStage
      });
      updateStudent(newSession.studentId, { counsellingStage: newSession.counsellingStage });

      // Persist to Firestore
      await updateDoc(doc(db, 'students', newSession.studentId), {
        counsellingStage: newSession.counsellingStage,
        counsellorNotes: arrayUnion({ id: Date.now(), ...sessionPayload })
      });

      showAlert('Session notes and next actions saved successfully.', 'Log Saved');
      setNewSession({
        studentId: '', type: 'Exploration', note: '',
        nextActionDate: '', homeworkTask: '', counsellingStage: 'Exploration'
      });
      localStorage.removeItem('sessionDraft');
    } catch (e) {
      console.error(e);
      showAlert('Failed to save notes. Check your permissions.', 'Save Error');
    }
  };

  // ── Chat listener ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeChatStudent && userProfile) {
      const chatId = `${activeChatStudent.id}_${userProfile.email}`;
      const q = query(collection(db, 'chats', chatId, 'messages'));
      const unsubChat = onSnapshot(q, (snapshot) => {
        const msgs = [];
        snapshot.forEach(d => msgs.push(d.data()));
        msgs.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
        setChatMessages(msgs);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
      return () => unsubChat();
    }
  }, [activeChatStudent, userProfile]);

  const sendChatMessage = async () => {
    if (!activeChatStudent) return showAlert('Select a student to chat with first.', 'Chat Error');
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    try {
      const chatId = `${activeChatStudent.id}_${userProfile.email}`;
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text, senderId: userProfile.email, senderType: 'counsellor', timestamp: serverTimestamp()
      });
    } catch (e) {
      showAlert('Error sending message.', 'Network Error');
    }
  };

  const convertChatToNote = () => {
    if (chatMessages.length === 0) return;
    const summary = chatMessages
      .map(m => `${m.senderType === 'counsellor' ? 'Me' : 'Student'}: ${m.text}`)
      .join('\n');
    setActiveTab('sessions');
    handleSessionChange('studentId', activeChatStudent.id);
    handleSessionChange('note', `Chat Transcript:\n\n${summary}`);
  };

  // ── Derived KPIs ─────────────────────────────────────────────────────────────
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const totalSessionsLogged = students.reduce((acc, s) => acc + (s.counsellorNotes?.length || 0), 0);
  const studentsClosed = students.filter(s => s.counsellingStage === 'Finalisation').length;
  const highPriorityCount = students.filter(s => s.priority === 'high').length;

  const needsFollowUp = students.filter(s => {
    if (!s.counsellorNotes || s.counsellorNotes.length === 0) return true;
    const lastNoteDate = new Date(s.counsellorNotes[s.counsellorNotes.length - 1].date);
    const daysSince = (new Date() - lastNoteDate) / (1000 * 60 * 60 * 24);
    return daysSince > 14 && s.counsellingStage !== 'Finalisation';
  });

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      let matchFilter = true;
      if (clinicalFilter === 'HIGH') matchFilter = s.priority === 'high';
      if (clinicalFilter === 'MEDIUM') matchFilter = s.priority === 'medium';
      if (clinicalFilter === 'LOCKED') matchFilter = s.counsellingStage === 'Finalisation';
      return matchSearch && matchFilter;
    });
  }, [students, searchQuery, clinicalFilter]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
  });

  // ── Premium empty state for "no students assigned" ───────────────────────────
  const PremiumEmptyState = () => (
    <div className="c-empty-premium">
      <div className="c-empty-premium-glow">🎓</div>
      <h2>No Students Assigned Yet</h2>
      <p>
        You don't have any students assigned to your caseload right now.
        Once an admin assigns students to you, they'll appear here — ready for you to guide.
      </p>
      <div className="c-empty-premium-hint">
        <span>💡</span>
        Ask your admin to assign students from the Admin Portal
      </div>
    </div>
  );

  // ── Tab renderers ─────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="c-header-bar">
              <div>
                <h1>Counsellor Command Centre</h1>
                <p>{currentDate}</p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="c-card">
                <PremiumEmptyState />
              </div>
            ) : (
              <>
                <div className="c-kpi-grid">
                  <div className="c-kpi-box" style={{ borderTop: '3px solid var(--primary)' }}>
                    <h4>My Students</h4>
                    <div className="c-val">{students.length}</div>
                  </div>
                  <div className="c-kpi-box" style={{ borderTop: '3px solid var(--danger)' }}>
                    <h4>High Priority</h4>
                    <div className="c-val" style={{ color: highPriorityCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{highPriorityCount}</div>
                  </div>
                  <div className="c-kpi-box" style={{ borderTop: '3px solid var(--warning)' }}>
                    <h4>Needs Follow-up</h4>
                    <div className="c-val" style={{ color: needsFollowUp.length > 0 ? 'var(--warning)' : 'var(--text-main)' }}>{needsFollowUp.length}</div>
                  </div>
                  <div className="c-kpi-box" style={{ borderTop: '3px solid var(--success)' }}>
                    <h4>Sessions Logged</h4>
                    <div className="c-val">{totalSessionsLogged}</div>
                  </div>
                </div>

                <div className="c-grid-2">
                  <div>
                    <div className="c-card">
                      <h3>📅 Upcoming Appointments</h3>
                      {bookings.length === 0 ? (
                        <div className="c-empty">
                          <div className="c-empty-icon">📭</div>
                          <p style={{ margin: 0, fontSize: '0.875rem' }}>No upcoming appointments scheduled.</p>
                        </div>
                      ) : (
                        bookings.map(b => {
                          const statusColor = b.status === 'Pending' ? 'var(--warning)' : (b.status === 'Confirmed' ? 'var(--success)' : 'var(--danger)');
                          return (
                            <div key={b.id} className="c-case-item">
                              <div className="c-case-dot" style={{ background: statusColor }} />
                              <div className="c-case-info">
                                <div className="c-case-time">{b.date} at {b.time}</div>
                                <div className="c-case-name">{b.studentName}</div>
                              </div>
                              <span className="c-badge" style={{ background: 'rgba(0,0,0,0.04)', color: statusColor, border: `1px solid ${statusColor}` }}>{b.status}</span>
                              {b.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button className="c-btn" style={{ padding: '5px 10px', fontSize: '0.75rem', background: 'var(--success)', boxShadow: 'none' }} onClick={() => updateBookingStatus(b.id, 'Confirmed')}>Accept</button>
                                  <button className="c-btn-outline" style={{ padding: '5px 10px', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => updateBookingStatus(b.id, 'Cancelled')}>Decline</button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="c-card" style={{ borderTop: '3px solid var(--warning)' }}>
                      <h3>⚡ Smart Follow-Ups</h3>
                      {needsFollowUp.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {needsFollowUp.slice(0, 5).map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(245,158,11,0.05)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(245,158,11,0.15)' }}>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-main)' }}>{s.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No contact in 14+ days</div>
                              </div>
                              <button className="c-btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setStudentModal(s)}>View</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="c-empty" style={{ padding: '20px' }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✅</div>
                          <p style={{ margin: 0, fontWeight: '600', color: 'var(--success)', fontSize: '0.875rem' }}>All students have recent contact logs.</p>
                        </div>
                      )}
                    </div>

                    <div className="c-card" style={{ borderTop: '3px solid var(--secondary)' }}>
                      <h3>📊 My Performance</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { label: 'Cases Closed', value: `${studentsClosed} / ${students.length}` },
                          { label: 'Avg Sessions / Student', value: students.length ? (totalSessionsLogged / students.length).toFixed(1) : '0' },
                          { label: 'Pending Bookings', value: pendingBookings, color: pendingBookings > 0 ? 'var(--warning)' : 'var(--success)' },
                        ].map((stat, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</span>
                            <span style={{ fontWeight: '700', color: stat.color || 'var(--text-main)' }}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'intelligence':
        return (
          <div>
            <div className="c-header-bar">
              <div>
                <h1>Career Intelligence Reports</h1>
                <p>RIASEC assessment results for all assigned students.</p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="c-card"><PremiumEmptyState /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {students.map(student => {
                  const hasAssessment = !!student.riasecCode;
                  return (
                    <div key={student.id} style={{
                      background: hasAssessment
                        ? 'linear-gradient(135deg, #0F2027 0%, #1a2f4a 60%, #0a2e22 100%)'
                        : 'var(--card-bg)',
                      borderRadius: 'var(--r-lg)',
                      border: hasAssessment ? '1.5px solid rgba(14,165,233,0.25)' : '1.5px dashed var(--border)',
                      padding: '24px 28px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: hasAssessment ? '0 8px 32px rgba(0,0,0,0.15)' : 'var(--shadow-sm)'
                    }}>
                      {hasAssessment && (
                        <>
                          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                          <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        </>
                      )}

                      {/* Student header row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasAssessment ? '20px' : '0', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: hasAssessment ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg)',
                            border: hasAssessment ? 'none' : '1.5px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '800', fontSize: '1rem',
                            color: hasAssessment ? 'white' : 'var(--text-muted)'
                          }}>
                            {String(student.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '1rem', color: hasAssessment ? 'white' : 'var(--text-main)' }}>
                              {String(student.name || 'Unknown Student')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: hasAssessment ? 'rgba(255,255,255,0.45)' : 'var(--text-muted)', marginTop: '2px' }}>
                              {String(student.gradeLevel || '')} {student.stream1112 ? `• ${String(student.stream1112)}` : ''}
                            </div>
                          </div>
                        </div>

                        {hasAssessment ? (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontFamily: 'Inter', fontSize: '32px', fontWeight: '900', color: '#0EA5E9', lineHeight: '1', letterSpacing: '3px' }}>
                              {String(student.riasecCode || '')}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600', marginTop: '3px', letterSpacing: '1px', textTransform: 'uppercase' }}>Holland Code</div>
                          </div>
                        ) : (
                          <span className="c-badge c-badge-warn">No Assessment</span>
                        )}
                      </div>

                      {/* Assessment data */}
                      {hasAssessment && (
                        <>
                          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px', position: 'relative', zIndex: 1 }} />

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', position: 'relative', zIndex: 1 }}>

                            {/* Recommended Stream */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                              <div style={{ fontSize: '9px', fontWeight: '700', color: '#14B8A6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                📚 Recommended Stream
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>
                                {String(student.recommendedStream || student.streamRec?.name || student.stream1112 || 'Pending')}
                              </div>
                              {(student.maturityPct || student.streamRec?.match) && (
                                <div style={{ marginTop: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>Match</span>
                                    <span style={{ fontSize: '11px', color: '#14B8A6', fontWeight: '800' }}>
                                      {student.streamRec?.match ? `${student.streamRec.match}%` : `${Number(student.maturityPct || 0)}%`}
                                    </span>
                                  </div>
                                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${student.streamRec?.match || student.maturityPct || 0}%`, background: 'linear-gradient(90deg, #0A7C6E, #14B8A6)', borderRadius: '3px' }} />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Top Career Match */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                              <div style={{ fontSize: '9px', fontWeight: '700', color: '#F59E0B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                🏆 Top Career Match
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>
                                {String(
                                  (student.topCareerMatches && student.topCareerMatches.length > 0)
                                    ? student.topCareerMatches[0].name
                                    : (student.bestCareer?.title || 'Pending')
                                )}
                              </div>
                              {(student.topCareerMatches?.[0]?.matchScore || student.bestCareer?.matchPercent) && (
                                <div style={{ marginTop: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>Fit</span>
                                    <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '800' }}>
                                      {student.topCareerMatches?.[0]?.matchScore
                                        ? `${Number(student.topCareerMatches[0].matchScore)}%`
                                        : `${Number(student.bestCareer?.matchPercent || 0)}%`}
                                    </span>
                                  </div>
                                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${student.topCareerMatches?.[0]?.matchScore || student.bestCareer?.matchPercent || 0}%`, background: 'linear-gradient(90deg, #D97706, #F59E0B)', borderRadius: '3px' }} />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* More Matches */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                              <div style={{ fontSize: '9px', fontWeight: '700', color: '#A78BFA', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                🎯 More Matches
                              </div>
                              {(student.topCareerMatches && student.topCareerMatches.length > 1)
                                ? student.topCareerMatches.slice(1, 4).map((c, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '600', flex: 1, marginRight: '6px' }}>{String(c.name || '')}</span>
                                      <span style={{ fontSize: '10px', color: '#A78BFA', fontWeight: '800', flexShrink: 0 }}>{Number(c.matchScore || 0)}%</span>
                                    </div>
                                  ))
                                : [student.recommendedCareer, student.leastCareer].filter(Boolean).map((c, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '600', flex: 1, marginRight: '6px' }}>{String(c.title || '')}</span>
                                      <span style={{ fontSize: '10px', color: '#A78BFA', fontWeight: '800', flexShrink: 0 }}>{Number(c.matchPercent || 0)}%</span>
                                    </div>
                                  ))
                              }
                            </div>
                          </div>

                          {/* RIASEC Summary */}
                          {student.riasecSummary && (
                            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
                              <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>Profile Summary</div>
                              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.65' }}>
                                {String(student.riasecSummary)}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', position: 'relative', zIndex: 1 }}>
                            <button className="c-btn" style={{ padding: '7px 16px', fontSize: '0.8rem' }} onClick={() => setStudentModal(student)}>
                              Open Full File
                            </button>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              ✅ Assessed {student.assessmentCompletedAt ? new Date(student.assessmentCompletedAt).toLocaleDateString('en-GB') : ''}
                            </div>
                          </div>
                        </>
                      )}

                      {/* No assessment placeholder */}
                      {!hasAssessment && (
                        <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>⏳</span>
                          <span>This student has not completed the RIASEC assessment yet. Direct them to <strong>/vidyavantage</strong> to get started.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'queue':
        return (
          <div>
            <div className="c-header-bar">
              <div>
                <h1>Student Roster & Priority</h1>
                <p>Manage your caseload. Tag students based on urgency.</p>
              </div>
              {students.length > 0 && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select className="c-form-select" value={clinicalFilter} onChange={(e) => setClinicalFilter(e.target.value)} style={{ width: '180px' }}>
                    <option value="ALL">All Students</option>
                    <option value="HIGH">High Priority 🔴</option>
                    <option value="MEDIUM">Medium Priority 🟡</option>
                    <option value="LOCKED">Cases Closed 🟢</option>
                  </select>
                  <input type="text" className="c-form-input" placeholder="Search name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '200px' }} />
                </div>
              )}
            </div>

            <div className="c-card">
              {students.length === 0 ? (
                <PremiumEmptyState />
              ) : filteredStudents.length === 0 ? (
                <div className="c-empty">
                  <div className="c-empty-icon">🔍</div>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>No students match your current filters.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="c-table">
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
                      {filteredStudents.map(student => {
                        const lastNote = student.counsellorNotes?.[student.counsellorNotes.length - 1];
                        const priorityColor = student.priority === 'high' ? 'var(--danger)' : student.priority === 'medium' ? 'var(--warning)' : 'var(--success)';
                        return (
                          <tr key={student.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: priorityColor, flexShrink: 0 }} />
                                <strong style={{ color: 'var(--text-main)' }}>{student.name}</strong>
                              </div>
                            </td>
                            <td><span className="c-badge c-badge-neutral">{student.counsellingStage || 'Assessment'}</span></td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {lastNote?.nextActionDate ? `📅 ${lastNote.nextActionDate}` : 'No plan set'}
                            </td>
                            <td>
                              <select className="c-form-select" style={{ padding: '4px 8px', fontSize: '0.8rem', width: '120px' }} value={student.priority || 'low'} onChange={(e) => updateStudentPriority(student.id, e.target.value)}>
                                <option value="high">High 🔴</option>
                                <option value="medium">Medium 🟡</option>
                                <option value="low">Low 🟢</option>
                              </select>
                            </td>
                            <td>
                              <button className="c-btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => setStudentModal(student)}>Open File</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div>
            <div className="c-header-bar">
              <div>
                <h1>Session Logger</h1>
                <p>Draft notes auto-save locally to protect against accidental page closure.</p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="c-card">
                <PremiumEmptyState />
              </div>
            ) : (
              <div className="c-grid-equal">
                <div className="c-card" style={{ borderTop: '3px solid var(--primary)' }}>
                  <h3>Log Session & Next Steps</h3>
                  <div className="c-form-group">
                    <label className="c-form-label">Select Student</label>
                    <select className="c-form-select" value={newSession.studentId} onChange={(e) => handleSessionChange('studentId', e.target.value)}>
                      <option value="">— Select Student —</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="c-grid-equal" style={{ gap: '12px' }}>
                    <div className="c-form-group">
                      <label className="c-form-label">Session Type</label>
                      <select className="c-form-select" value={newSession.type} onChange={(e) => handleSessionChange('type', e.target.value)}>
                        <option value="Exploration">Exploration</option>
                        <option value="Parent Meeting">Parent Meeting</option>
                        <option value="Report Review">Report Review</option>
                        <option value="Crisis Support">Crisis Support</option>
                      </select>
                    </div>
                    <div className="c-form-group">
                      <label className="c-form-label">Update Journey Stage</label>
                      <select className="c-form-select" value={newSession.counsellingStage} onChange={(e) => handleSessionChange('counsellingStage', e.target.value)}>
                        <option value="Assessment">Assessment</option>
                        <option value="Exploration">Exploration</option>
                        <option value="Decision">Decision Making</option>
                        <option value="Finalisation">Finalisation (Closed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="c-form-group">
                    <label className="c-form-label">Session Summary</label>
                    <textarea className="c-form-textarea" rows="4" placeholder="Key topics discussed, student's emotional state, insights..." value={newSession.note} onChange={(e) => handleSessionChange('note', e.target.value)}></textarea>
                  </div>

                  <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.875rem', marginBottom: '12px' }}>📌 Actionable Next Steps</div>
                    <div className="c-grid-equal" style={{ gap: '12px' }}>
                      <div className="c-form-group">
                        <label className="c-form-label">Next Meeting Date</label>
                        <input type="date" className="c-form-input" value={newSession.nextActionDate} onChange={(e) => handleSessionChange('nextActionDate', e.target.value)} />
                      </div>
                      <div className="c-form-group">
                        <label className="c-form-label">Homework / Task Assigned</label>
                        <input type="text" className="c-form-input" placeholder="e.g. Research 3 colleges" value={newSession.homeworkTask} onChange={(e) => handleSessionChange('homeworkTask', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <button className="c-btn" onClick={saveSessionNotes} style={{ width: '100%' }}>💾 Commit to Timeline</button>
                </div>

                <div className="c-card" style={{ borderTop: '3px solid var(--secondary)' }}>
                  <h3>📋 Recent Activity</h3>
                  {students.filter(s => s.counsellorNotes?.length > 0).length === 0 ? (
                    <div className="c-empty">
                      <div className="c-empty-icon">📋</div>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>No sessions logged yet. Use the form to log your first session.</p>
                    </div>
                  ) : (
                    <div className="c-timeline">
                      {students
                        .filter(s => s.counsellorNotes?.length > 0)
                        .flatMap(s => s.counsellorNotes.map(n => ({ ...n, studentName: s.name })))
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5)
                        .map((note, idx) => (
                          <div key={idx} className="c-timeline-item">
                            <div className="c-timeline-dot" />
                            <div className="c-timeline-date">{new Date(note.date).toLocaleDateString('en-GB')} • {note.studentName} • {note.type}</div>
                            <div className="c-timeline-content">{note.note}</div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'chat':
        return (
          <div>
            <div className="c-header-bar">
              <div>
                <h1>Direct Student Chat</h1>
                <p>Secure two-way communication channel.</p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="c-card">
                <PremiumEmptyState />
              </div>
            ) : (
              <div className="c-grid-2">
                <div className="c-card" style={{ borderTop: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', height: '60vh', padding: 0 }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                      {activeChatStudent ? activeChatStudent.name : 'Select a student →'}
                    </div>
                    {activeChatStudent && (
                      <button className="c-btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={convertChatToNote}>Convert to Note</button>
                    )}
                  </div>
                  <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'var(--bg)' }}>
                    {!activeChatStudent ? (
                      <div className="c-empty">
                        <div className="c-empty-icon">💬</div>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>Select a student from the panel to view chat history.</p>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="c-empty">
                        <div className="c-empty-icon">💬</div>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>No messages yet. Start the conversation.</p>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((msg, idx) => {
                          const isMe = msg.senderId === userProfile?.email;
                          const timeString = msg.timestamp
                            ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '...';
                          return (
                            <div key={idx} className={`c-chat-msg ${isMe ? 'c-msg-me' : 'c-msg-them'}`}>
                              {msg.text}
                              <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>{timeString}</div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      className="c-form-input"
                      placeholder="Type a message..."
                      style={{ margin: 0 }}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      disabled={!activeChatStudent}
                    />
                    <button className="c-btn" onClick={sendChatMessage} disabled={!activeChatStudent}>Send</button>
                  </div>
                </div>

                <div className="c-card" style={{ padding: 0, overflowY: 'auto', height: '60vh' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.9rem' }}>Active Roster</div>
                  {students.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setActiveChatStudent({ id: s.id, name: s.name })}
                      style={{ padding: '14px 20px', cursor: 'pointer', background: activeChatStudent?.id === s.id ? 'var(--primary-light)' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', transition: '0.15s' }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.875rem' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.counsellingStage || 'Assessment'}</div>
                      </div>
                      <span style={{ color: activeChatStudent?.id === s.id ? 'var(--primary)' : 'var(--text-muted)', fontSize: '1.1rem' }}>💬</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="c-empty">
            <div className="c-empty-icon">🚧</div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Module Under Construction</h3>
            <p>This section is being built. Check back soon.</p>
          </div>
        );
    }
  };

  // ── Student detail modal ──────────────────────────────────────────────────────
  const renderStudentModal = () => {
    if (!studentModal) return null;
    const stages = ['Assessment', 'Exploration', 'Decision', 'Finalisation'];
    const currentStageIdx = stages.indexOf(studentModal.counsellingStage || 'Assessment');

    return (
      <div className="c-modal-overlay" onClick={() => setStudentModal(null)}>
        <div className="c-modal" onClick={e => e.stopPropagation()}>
          <div className="c-modal-header">
            <button className="c-close-btn" onClick={() => setStudentModal(null)}>✕</button>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '700' }}>{studentModal.name}</h2>
            <span className={`c-badge ${studentModal.priority === 'high' ? 'c-badge-danger' : studentModal.priority === 'medium' ? 'c-badge-warn' : 'c-badge-success'}`}>
              {studentModal.priority || 'low'} priority
            </span>

            <div className="c-journey" style={{ marginTop: '20px' }}>
              {stages.map((stage, idx) => (
                <div key={stage} className="c-journey-step">
                  <div className={`c-step-dot ${idx <= currentStageIdx ? 'done' : ''}`}>
                    {idx < currentStageIdx ? '✓' : idx + 1}
                  </div>
                  <div className="c-step-label" style={{ color: idx <= currentStageIdx ? 'var(--primary)' : 'var(--text-muted)' }}>{stage}</div>
                </div>
              ))}
            </div>

            <div className="c-modal-tabs">
              <button className={`c-modal-tab ${studentModalTab === 'timeline' ? 'active' : ''}`} onClick={() => setStudentModalTab('timeline')}>Session Timeline</button>
              <button className={`c-modal-tab ${studentModalTab === 'documents' ? 'active' : ''}`} onClick={() => setStudentModalTab('documents')}>Documents</button>
            </div>
          </div>

          <div className="c-modal-body">
            {studentModalTab === 'timeline' && (
              <div>
                {!studentModal.counsellorNotes || studentModal.counsellorNotes.length === 0 ? (
                  <div className="c-empty">
                    <div className="c-empty-icon">📋</div>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>No sessions logged yet for this student.</p>
                  </div>
                ) : (
                  <div className="c-timeline">
                    {studentModal.counsellorNotes.slice().reverse().map((note, idx) => (
                      <div key={idx} className="c-timeline-item">
                        <div className="c-timeline-dot" />
                        <div className="c-timeline-date">{new Date(note.date).toLocaleDateString('en-GB')} • {note.type}</div>
                        <div className="c-timeline-content">
                          <p style={{ margin: '0 0 10px 0' }}>{note.note}</p>
                          {(note.nextActionDate || note.homeworkTask) && (
                            <div style={{ background: 'rgba(14,165,233,0.06)', padding: '10px', borderRadius: 'var(--r-sm)', borderLeft: '3px solid var(--primary)', fontSize: '0.8rem' }}>
                              <strong style={{ color: 'var(--primary)' }}>Next Steps:</strong><br />
                              {note.nextActionDate && <span>📅 Follow up: {note.nextActionDate}<br /></span>}
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

            {studentModalTab === 'documents' && (
              <div className="c-empty">
                <div className="c-empty-icon">📄</div>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Document Vault</h3>
                <p style={{ marginBottom: '20px' }}>Upload psychometric reports and consent forms here.</p>
                <button className="c-btn-outline" disabled>Cloud Storage — Coming Soon</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Root render ───────────────────────────────────────────────────────────────
  return (
    <div className="c-root">
      {/* ── SIDEBAR ── */}
      <div className="c-sidebar">
        <div className="c-brand">
          <h2>Secret Sharz</h2>
          <div className="c-brand-sub">Counsellor Portal</div>
        </div>

        <div className="c-nav-label">Navigation</div>
        {[
          { id: 'overview',      icon: '🏠', label: 'Overview' },
          { id: 'intelligence',  icon: '🧠', label: 'Career Intelligence' },
          { id: 'queue',         icon: '🎓', label: 'Roster & Priority' },
          { id: 'sessions',      icon: '📅', label: 'Session Logger' },
          { id: 'chat',          icon: '💬', label: 'Messages' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`c-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Portal Switcher */}
        <div className="c-portal-switcher">
          <div className="c-portal-label">Switch Portal</div>
          {navigate && (
            <button className="c-portal-btn" onClick={() => navigate('/admin')}>
              <span className="c-portal-dot" style={{ background: '#5B6EF5' }} />
              Admin Portal
            </button>
          )}
          <button className="c-portal-btn current">
            <span className="c-portal-dot" style={{ background: '#0EA5E9' }} />
            Counsellor Portal
          </button>
          {navigate && (
            <button className="c-portal-btn" onClick={() => navigate('/dashboard')}>
              <span className="c-portal-dot" style={{ background: '#F59E0B' }} />
              Student Portal
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="c-main">
        <div className="c-top-header">
          <div className="c-header-title">Counsellor Dashboard</div>
          <div className="c-header-actions">
            <div style={{ position: 'relative' }}>
              <div className="c-avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'C'}
              </div>
              {profileOpen && (
                <div className="c-dropdown">
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>{userProfile?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{userProfile?.email}</div>
                  </div>
                  <button style={{ color: 'var(--danger)' }} onClick={handleLogout}>🚪 Secure Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="c-content">
          {renderTab()}
        </div>
      </div>

      {/* ── ALERT MODAL ── */}
      {alertModal && (
        <div className="c-modal-overlay">
          <div className="c-alert-modal">
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ color: 'var(--danger)', marginTop: 0, marginBottom: '8px' }}>{alertModal.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem', lineHeight: '1.6' }}>{alertModal.message}</p>
            <button className="c-btn" style={{ width: '100%' }} onClick={() => setAlertModal(null)}>Acknowledge</button>
          </div>
        </div>
      )}

      {renderStudentModal()}
    </div>
  );
}
