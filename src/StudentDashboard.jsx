import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import CareerAssessment from "./CareerAssessment"; // 🔗 Linked the Assessment Component

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`;

const CSS = `
:root {
  --ink: #0D1117; --ink-soft: #1C2333; --surface: #F6F8FA;
  --card: #FFFFFF; --border: #E1E7EF; --muted: #6B7280;
  --saffron: #E8650A; --gold: #F0A500; --teal: #0A7C6E;
  --teal-light: #14B8A6; --sage: #4A7C59; --lavender: #7C3AED;
  --lav-light: #A78BFA; --rose: #E11D48; --sky: #0EA5E9;
  --success: #059669; --warn: #D97706;
  --r-sm: 12px; --r-md: 18px; --r-lg: 24px; --r-xl: 32px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.10);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.db-root { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--surface); min-height: 100vh; color: var(--ink); display: flex; overflow-x: hidden; }

/* ── SIDEBAR ── */
.db-sidebar { width: 260px; flex-shrink: 0; background: var(--ink); min-height: 100vh; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.db-sidebar-brand { padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.db-sidebar-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: white; letter-spacing: -0.5px; }
.db-sidebar-logo span { color: var(--gold); font-style: italic; }
.db-sidebar-sub { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
.db-student-info { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.db-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--gold)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: white; margin-bottom: 10px; text-transform: uppercase; }
.db-student-name { font-size: 15px; font-weight: 700; color: white; margin-bottom: 2px; }
.db-student-class { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; }
.db-riasec-badge { display: inline-block; margin-top: 10px; background: rgba(240,165,0,0.15); border: 1px solid rgba(240,165,0,0.25); color: var(--gold); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 30px; letter-spacing: 1px; }

.db-progress-wrap { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer; }
.db-progress-label { display: flex; justify-content: space-between; margin-bottom: 6px; }
.db-progress-text { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.db-progress-pct { font-size: 11px; color: var(--teal-light); font-weight: 700; }
.db-progress-bar { height: 4px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
.db-progress-fill { height: 100%; background: linear-gradient(90deg, var(--teal), var(--teal-light)); border-radius: 4px; transition: width 1s ease; }

.db-nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.db-nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: var(--r-sm); font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; border: none; background: transparent; width: 100%; text-align: left; font-family: inherit; }
.db-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
.db-nav-item.active { background: rgba(232,101,10,0.15); color: white; }
.db-nav-icon { font-size: 16px; width: 20px; text-align: center; }
.db-nav-badge { margin-left: auto; background: var(--saffron); color: white; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; }

.db-sidebar-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 8px; }
.db-back-btn { width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-sm); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.db-back-btn:hover { background: rgba(255,255,255,0.08); color: white; }
.db-logout-btn { width: 100%; padding: 10px; background: transparent; border: none; color: #F87171; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.db-logout-btn:hover { color: #EF4444; background: rgba(239, 68, 68, 0.1); border-radius: var(--r-sm); }

/* ── MAIN ── */
.db-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.db-topbar { background: white; border-bottom: 1px solid var(--border); padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
.db-topbar-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--ink); }
.db-topbar-right { display: flex; align-items: center; gap: 12px; }

/* ── PARENT TOGGLE ── */
.db-parent-toggle { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1.5px solid var(--border); padding: 6px 14px; border-radius: 30px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.db-parent-toggle.active { background: #E0E7FF; border-color: #93C5FD; color: #1E40AF; }
.db-parent-toggle-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
.db-parent-toggle.active .db-parent-toggle-dot { background: #2563EB; }

.db-xp-chip { display: flex; align-items: center; gap: 6px; background: #FFFBEB; border: 1.5px solid #FDE68A; color: #92400E; padding: 6px 14px; border-radius: 30px; font-size: 13px; font-weight: 700; }

.db-content { padding: 40px; flex: 1; overflow-y: auto; }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.db-tab { animation: fadeSlideUp 0.4s ease both; }

/* ── WELCOME BANNER ── */
.db-welcome { background: linear-gradient(135deg, var(--ink) 0%, #1C2850 100%); border-radius: var(--r-xl); padding: 36px 40px; margin-bottom: 28px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.db-welcome-text { position: relative; z-index: 1; }
.db-welcome-eyebrow { font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
.db-welcome-h1 { font-family: 'Fraunces', serif; font-size: clamp(24px, 3vw, 36px); font-weight: 700; color: white; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 10px; }
.db-welcome-h1 em { font-style: italic; color: var(--gold); }
.db-welcome-p { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 480px; font-weight: 400; }
.db-welcome-action { position: relative; z-index: 1; flex-shrink: 0; }

/* ── BUTTONS ── */
.db-welcome-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 14px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 8px 24px rgba(232,101,10,0.35); transition: all 0.2s; white-space: nowrap; }
.db-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 4px 16px rgba(232,101,10,0.3); transition: all 0.2s; }
.db-btn-outline { background: white; color: var(--saffron); border: 1.5px solid var(--saffron); padding: 10px 20px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }

/* ── STAT CARDS ── */
.db-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.db-stat-card { background: white; border-radius: var(--r-lg); padding: 24px; border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
.db-stat-icon { font-size: 28px; margin-bottom: 14px; display: block; }
.db-stat-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
.db-stat-value { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1; }
.db-stat-sub { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 500; }

/* ── GRIDS & CARDS ── */
.db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.db-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.db-card { background: white; border-radius: var(--r-lg); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }
.db-card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.db-card-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 8px; }
.db-card-body { padding: 24px; }

/* ── STREAM & CAREER CARDS ── */
.db-stream-box { background: #F0FDF4; border: 1px solid #A7F3D0; border-radius: var(--r-md); padding: 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.db-career-card { background: white; border-radius: var(--r-md); border: 1.5px solid var(--border); padding: 20px; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.db-career-rank { position: absolute; top: 14px; right: 14px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.db-career-rank.best { background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }
.db-career-rank.good { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
.db-career-rank.low { background: #FFE4E6; color: #BE123C; border: 1px solid #FECDD3; }

.db-career-name { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 4px; padding-right: 60px; }
.db-career-sub { font-size: 12px; color: var(--muted); margin-bottom: 16px; font-weight: 500; }
.db-match-bar-wrap { margin-bottom: 14px; }
.db-match-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.db-match-label { font-size: 12px; color: var(--muted); font-weight: 600; }
.db-match-pct { font-size: 13px; font-weight: 800; }
.db-match-bg { height: 6px; background: var(--surface); border-radius: 6px; overflow: hidden; }

/* ── EXPLAINABILITY / PARENT MODE ── */
.db-explain-box { background: var(--surface); border-radius: var(--r-sm); padding: 12px; margin-top: auto; }
.db-explain-item { font-size: 12px; font-weight: 600; margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px; }
.db-explain-icon { flex-shrink: 0; }
.db-parent-metric { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 8px 0; font-size: 13px; }
.db-parent-metric:last-child { border-bottom: none; padding-bottom: 0; }

/* ── DECISION SIMULATOR (COMPARE) ── */
.db-compare-grid { display: grid; grid-template-columns: 200px 1fr 1fr 1fr; gap: 0; background: white; border-radius: var(--r-md); border: 1.5px solid var(--border); overflow: hidden; }
.db-compare-header { background: var(--surface); font-weight: 700; padding: 16px; font-size: 14px; border-bottom: 1.5px solid var(--border); border-right: 1px solid var(--border); }
.db-compare-cell { padding: 16px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--ink); }
.db-compare-row:last-child .db-compare-cell { border-bottom: none; }

/* ── COLLEGES & GROWTH ── */
.db-college-ext { background: white; border: 1.5px solid var(--border); border-radius: var(--r-md); padding: 20px; display: flex; gap: 16px; margin-bottom: 16px; }
.db-college-ext-main { flex: 1; }
.db-college-stats { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
.db-college-stat-pill { background: var(--surface); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--ink-soft); }

.db-skill-row { margin-bottom: 12px; }
.db-video-ph { background: var(--ink); border-radius: var(--r-md); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; position: relative; overflow: hidden; }
.db-video-play { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; backdrop-filter: blur(4px); }

/* ── CONFUSION STATE ── */
.db-confusion-banner { background: #EEF2FF; border: 1px dashed #A5B4FC; border-radius: var(--r-md); padding: 20px; text-align: center; margin-top: 24px; }

/* ── MISC ── */
.db-empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: var(--r-lg); border: 1.5px dashed var(--border); }
.db-pill { display: inline-block; padding: 5px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; }

/* ── TOAST NOTIFICATION FIX ── */
.db-toast { position: fixed; bottom: 24px; right: 24px; background: var(--ink); color: white; padding: 12px 24px; border-radius: var(--r-md); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; box-shadow: var(--shadow-lg); z-index: 9999; animation: fadeSlideUp 0.3s ease forwards; }
`;

// 🔥 Randomized Advisory Messages
const ADVISORY_MESSAGES = [
  "Answer with full concentration; your first instinct is usually the most accurate.",
  "Please find a quiet space. Deep focus yields the most accurate career map.",
  "Don't overthink! Answer honestly based on who you are, not who others want you to be.",
  "This is not a test to pass or fail. It's a mirror reflecting your true potential.",
  "Changing your answers to 'game the system' will only result in a mismatched career report."
];

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Dashboard" },
  { id: "careers", icon: "🎯", label: "Career Matches" },
  { id: "compare", icon: "⚖️", label: "Compare Paths", badge: "Hot" },
  { id: "colleges", icon: "🏫", label: "College Explorer" },
  { id: "growth", icon: "📈", label: "Growth & Reality" },
  { id: "report", icon: "📄", label: "Full Report" },
  { id: "counsellor", icon: "📅", label: "Book Expert" },
];

export default function StudentDashboard({ user, userData, initialTab = "home", onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isParentMode, setIsParentMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [advisoryMsg, setAdvisoryMsg] = useState("");

  // 🔗 Connection State
  const [showAssessment, setShowAssessment] = useState(false);
  const [localUserData, setLocalUserData] = useState(userData || {});
  
  // Profile completion state
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '',
    schoolName: '',
    gradeLevel: '',
    marks10th: '',
    marks11th: '',
    stream1112: '',
    marks12th: '',
    ugCourse: '',
    ugCGPA: '',
    pgCourse: '',
    pgCGPA: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Keep localUserData in sync if external userData updates
  useEffect(() => {
    if (userData) setLocalUserData(userData);
  }, [userData]);
  
  // Fetch fresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth?.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setLocalUserData(data);
            
            // Pre-fill profile form if data exists
            if (data.profileComplete) {
              setProfileData({
                age: data.age || '',
                gender: data.gender || '',
                schoolName: data.schoolName || '',
                gradeLevel: data.gradeLevel || '',
                marks10th: data.marks10th || '',
                marks11th: data.marks11th || '',
                stream1112: data.stream1112 || '',
                marks12th: data.marks12th || '',
                ugCourse: data.ugCourse || '',
                ugCGPA: data.ugCGPA || '',
                pgCourse: data.pgCourse || '',
                pgCGPA: data.pgCGPA || ''
              });
            }
          }
        } catch (e) {
          console.error('Error fetching user data:', e);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if(initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setAdvisoryMsg(ADVISORY_MESSAGES[Math.floor(Math.random() * ADVISORY_MESSAGES.length)]);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        ...localUserData,
        ...profileData,
        profileComplete: true,
        profileCompletedAt: new Date().toISOString()
      }, { merge: true });
      
      setLocalUserData(prev => ({ ...prev, ...profileData, profileComplete: true }));
      setShowProfileForm(false);
      showToast('✅ Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('❌ Failed to save profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };
  
  const renderAcademicFields = () => {
    const grade = profileData.gradeLevel.toLowerCase();
    
    return (
      <>
        {/* Always show 10th marks field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
            10th Grade Marks (%) {grade.includes('8') || grade.includes('9') || grade.includes('10') ? '(Expected/Actual)' : '*'}
          </label>
          <input
            type="number"
            value={profileData.marks10th}
            onChange={(e) => setProfileData({ ...profileData, marks10th: e.target.value })}
            placeholder="e.g., 85"
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
            required={!grade.includes('8') && !grade.includes('9') && !grade.includes('10')}
          />
        </div>
        
        {/* Show 11th/12th fields for Grade 11-12 and above */}
        {(grade.includes('11') || grade.includes('12') || grade.includes('puc') || grade.includes('ug') || grade.includes('pg') || grade.includes('postgraduate')) && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                11th/12th Stream *
              </label>
              <select
                value={profileData.stream1112}
                onChange={(e) => setProfileData({ ...profileData, stream1112: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                required
              >
                <option value="">Select Stream</option>
                <option value="Science (PCM)">Science (PCM)</option>
                <option value="Science (PCB)">Science (PCB)</option>
                <option value="Science (PCMB)">Science (PCMB)</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts/Humanities">Arts/Humanities</option>
              </select>
            </div>
            
            {(grade.includes('12') || grade.includes('ug') || grade.includes('pg') || grade.includes('postgraduate')) && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                  12th Grade Marks (%) *
                </label>
                <input
                  type="number"
                  value={profileData.marks12th}
                  onChange={(e) => setProfileData({ ...profileData, marks12th: e.target.value })}
                  placeholder="e.g., 88"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                  required
                />
              </div>
            )}
          </>
        )}
        
        {/* Show UG fields for UG and PG students */}
        {(grade.includes('ug') || grade.includes('undergraduate') || grade.includes('pg') || grade.includes('postgraduate')) && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                Current/Completed UG Course *
              </label>
              <input
                type="text"
                value={profileData.ugCourse}
                onChange={(e) => setProfileData({ ...profileData, ugCourse: e.target.value })}
                placeholder="e.g., B.Tech Computer Science"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                UG CGPA (out of 10) *
              </label>
              <input
                type="number"
                step="0.01"
                value={profileData.ugCGPA}
                onChange={(e) => setProfileData({ ...profileData, ugCGPA: e.target.value })}
                placeholder="e.g., 8.5"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                required
              />
            </div>
          </>
        )}
        
        {/* Show PG fields for PG students */}
        {(grade.includes('pg') || grade.includes('postgraduate')) && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                Current PG Course *
              </label>
              <input
                type="text"
                value={profileData.pgCourse}
                onChange={(e) => setProfileData({ ...profileData, pgCourse: e.target.value })}
                placeholder="e.g., MBA Marketing"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                PG CGPA (out of 10) *
              </label>
              <input
                type="number"
                step="0.01"
                value={profileData.pgCGPA}
                onChange={(e) => setProfileData({ ...profileData, pgCGPA: e.target.value })}
                placeholder="e.g., 9.0"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                required
              />
            </div>
          </>
        )}
      </>
    );
  };

  // ── DATA EXTRACTION & FALLBACKS (Using linked localUserData) ──
  const studentName = localUserData?.name || user?.displayName || "Student";
  const firstName = studentName.split(" ")[0];
  const hasAssessment = !!localUserData?.riasecCode;
  
  const xp = localUserData?.xp || 10;
  
  const bestCareer = localUserData?.bestCareer || (hasAssessment ? {
    title: "Software Engineer", subtitle: "Tech & Innovation", matchPercent: 94,
    pros: ["High starting salary", "Global opportunities"], cons: ["Sedentary lifestyle", "Continuous learning required"],
    parentMetrics: { stability: "High", demand: "Very High", safety: "High" }
  } : null);

  const recommendedCareer = localUserData?.recommendedCareer || (hasAssessment ? {
    title: "Data Analyst", subtitle: "Research & Logic", matchPercent: 88,
    pros: ["Growing field", "Remote work options"], cons: ["Repetitive tasks", "Screen fatigue"],
    parentMetrics: { stability: "High", demand: "High", safety: "High" }
  } : null);

  const leastCareer = localUserData?.leastCareer || (hasAssessment ? {
    title: "Event Manager", subtitle: "Social & Enterprising", matchPercent: 42,
    pros: ["Creative freedom", "Networking"], cons: ["High stress", "Irregular hours"],
    parentMetrics: { stability: "Low", demand: "Medium", safety: "Moderate" }
  } : null);

  const streamRec = localUserData?.streamRec || (hasAssessment ? {
    name: "Science (PCM)", match: 92,
    reasons: ["Strong analytical thinking", "Interest in technology", "Matches Investigative profile"]
  } : null);

  const collegesExt = localUserData?.collegesExt && localUserData.collegesExt.length > 0 ? localUserData.collegesExt : (hasAssessment ? [
    { name: "Indian Institute of Technology (IIT)", loc: "Various", cutoffs: "Top 2%", fees: "₹1-2L/yr", placement: "95%+" },
    { name: "National Institute of Technology (NIT)", loc: "Various", cutoffs: "Top 5%", fees: "₹1L/yr", placement: "90%+" },
    { name: "BITS Pilani", loc: "Pilani", cutoffs: "Top 8%", fees: "₹1.5L/yr", placement: "92%+" }
  ] : []);

  const compareStats = localUserData?.compareStats && localUserData.compareStats.length > 0 ? localUserData.compareStats : (hasAssessment ? [
    { title: bestCareer?.title || "Path 1", salary: "₹12-25L", years: "4 Years", difficulty: "High", wlb: "Moderate" },
    { title: recommendedCareer?.title || "Path 2", salary: "₹8-15L", years: "3-4 Years", difficulty: "Medium", wlb: "Good" },
    { title: leastCareer?.title || "Path 3", salary: "₹5-10L", years: "3 Years", difficulty: "Low", wlb: "Poor" }
  ] : []);

  const skillGaps = localUserData?.skillGaps && localUserData.skillGaps.length > 0 ? localUserData.skillGaps : (hasAssessment ? [
    { skill: "Analytical Thinking", status: "On Track", student: 8 },
    { skill: "Public Speaking", status: "Needs Work", student: 4 },
    { skill: "Time Management", status: "On Track", student: 7 }
  ] : []);

  // Map AI next steps to the execution plan if present
  const executionPlan = localUserData?.executionPlan && localUserData.executionPlan.length > 0 
    ? localUserData.executionPlan 
    : (localUserData?.nextSteps ? localUserData.nextSteps.map((step, i) => ({ title: `Action Step ${i + 1}`, action: step })) 
    : (hasAssessment ? [
      { title: "Skill Up", action: "Complete a basic Python course this month." },
      { title: "Research", action: "Look up admission criteria for top 3 target colleges." }
    ] : []));

  const renderLockedState = (icon, title, desc = "") => (
    <div className="db-empty-state">
      <div style={{fontSize: "48px", marginBottom: "16px"}}>{icon}</div>
      <div style={{fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: "700", color: "var(--ink)", marginBottom: "12px"}}>{title}</div>
      {desc && <div style={{color: "var(--muted)", fontSize: "14px", marginBottom: "20px"}}>{desc}</div>}
      
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: "16px 24px", borderRadius: "12px", margin: "0 auto 24px", maxWidth: "500px", color: "#92400E", fontSize: "14px", lineHeight: "1.6", textAlign: "left" }}>
        <strong>💡 Assessment Rule:</strong><br/>
        <span style={{color: "#B45309"}}>{advisoryMsg}</span>
      </div>
      
      {/* 🔗 This now triggers the Assessment view */}
      <button className="db-btn" onClick={() => setShowAssessment(true)} style={{fontSize: "16px", padding: "14px 32px"}}>Start Assessment 🚀</button>
    </div>
  );

  // 🔗 If the user clicks "Start Assessment", we render the CareerAssessment component
  if (showAssessment) {
    return (
      <CareerAssessment
        onBack={() => setShowAssessment(false)}
        onSaveResults={(results) => {
          // Immediately save the AI results into our local dashboard state
          setLocalUserData({
            ...localUserData,
            name: results.studentInfo?.name || localUserData.name,
            classLevel: results.studentInfo?.class || localUserData.classLevel,
            riasecCode: results.riasec?.code,
            riasecSummary: results.riasecSummary,
            bestCareer: results.bestCareer,
            recommendedCareer: results.recommendedCareer,
            leastCareer: results.leastCareer,
            nextSteps: results.nextSteps // we map this to execution plan
          });
          setShowAssessment(false);
          setActiveTab("careers"); // Move them straight to their matches
          showToast("Assessment Complete! Your roadmap is unlocked.");
        }}
      />
    );
  }

  return (
    <div className="db-root">
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-brand">
          <div className="db-sidebar-logo">Vidya<span>Vantage</span></div>
          <div className="db-sidebar-sub">Decision Engine</div>
        </div>

        <div className="db-student-info">
          <div className="db-avatar">{studentName.charAt(0)}</div>
          <div className="db-student-name">{studentName}</div>
          <div className="db-student-class">{localUserData?.classLevel || "Class Not Set"}</div>
        </div>

        <nav className="db-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} className={`db-nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
              <span className="db-nav-icon">{item.icon}</span> {item.label}
              {item.badge && <span className="db-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          {onBack && <button className="db-back-btn" onClick={onBack}>← Back to Secret Sharz</button>}
          {onLogout && <button className="db-logout-btn" onClick={onLogout}>Sign Out</button>}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="db-main">
        {/* Top Bar */}
        <div className="db-topbar">
          <div className="db-topbar-title">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</div>
          <div className="db-topbar-right">
            <button className={`db-parent-toggle ${isParentMode ? 'active' : ''}`} onClick={() => setIsParentMode(!isParentMode)}>
              <div className="db-parent-toggle-dot" /> 👨‍👩‍👧 Parent View
            </button>
            <div className="db-xp-chip">⚡ {xp} XP</div>
          </div>
        </div>

        {/* Content */}
        <div className="db-content">

          {/* ── HOME TAB ── */}
          {activeTab === "home" && (
            <div className="db-tab">
              {/* Profile Completion Banner */}
              {!localUserData?.profileComplete && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', 
                  border: '2px solid #F59E0B', 
                  borderRadius: 'var(--r-lg)', 
                  padding: '24px 32px', 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px' }}>⚠️</span> Complete Your Academic Profile
                    </div>
                    <div style={{ fontSize: '14px', color: '#B45309', lineHeight: '1.6' }}>
                      For the most accurate career and college recommendations, please complete your academic profile below.
                    </div>
                  </div>
                  <button 
                    className="db-btn" 
                    style={{ background: '#F59E0B', whiteSpace: 'nowrap' }}
                    onClick={() => setShowProfileForm(true)}
                  >
                    Complete Profile →
                  </button>
                </div>
              )}
              
              {/* Profile Form Modal */}
              {showProfileForm && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: 'var(--r-xl)',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <div style={{ 
                      padding: '24px 32px', 
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h2 style={{ fontFamily: 'Fraunces', fontSize: '24px', color: 'var(--ink)', marginBottom: '4px' }}>
                          Complete Your Profile
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                          This helps us provide personalized recommendations
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowProfileForm(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: 'var(--muted)',
                          padding: '4px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <form onSubmit={handleProfileSubmit} style={{ padding: '32px' }}>
                      {/* Basic Info */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                          Age *
                        </label>
                        <input
                          type="number"
                          value={profileData.age}
                          onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                          placeholder="e.g., 16"
                          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                          required
                        />
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                          Gender *
                        </label>
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                          School/College Name *
                        </label>
                        <input
                          type="text"
                          value={profileData.schoolName}
                          onChange={(e) => setProfileData({ ...profileData, schoolName: e.target.value })}
                          placeholder="e.g., Delhi Public School"
                          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                          required
                        />
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                          Current Grade Level *
                        </label>
                        <select
                          value={profileData.gradeLevel}
                          onChange={(e) => setProfileData({ ...profileData, gradeLevel: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                          required
                        >
                          <option value="">Select Grade Level</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                          <option value="1st Year UG">1st Year UG</option>
                          <option value="2nd Year UG">2nd Year UG</option>
                          <option value="3rd Year UG">3rd Year UG</option>
                          <option value="4th Year UG">4th Year UG</option>
                          <option value="Postgraduate">Postgraduate</option>
                        </select>
                      </div>
                      
                      {/* Dynamic Academic Fields */}
                      {profileData.gradeLevel && (
                        <div style={{ 
                          background: 'var(--surface)', 
                          padding: '20px', 
                          borderRadius: 'var(--r-md)', 
                          marginBottom: '24px',
                          border: '1px solid var(--border)'
                        }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginBottom: '16px' }}>
                            📚 Academic History
                          </div>
                          {renderAcademicFields()}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setShowProfileForm(false)}
                          className="db-btn-outline"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="db-btn"
                          disabled={savingProfile}
                        >
                          {savingProfile ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              <div className="db-welcome">
                <div className="db-welcome-text">
                  <div className="db-welcome-eyebrow">Welcome Back</div>
                  <h1 className="db-welcome-h1">Hey {firstName},<br /><em>own your future.</em></h1>
                  <p className="db-welcome-p">
                    {hasAssessment ? `Your RIASEC code is ${localUserData.riasecCode}. Your best path is ${bestCareer?.title}.` : "Take our free AI assessment to unlock your career roadmap."}
                  </p>
                </div>
                <div className="db-welcome-action">
                  {!hasAssessment && <button className="db-welcome-btn" onClick={() => setShowAssessment(true)}>Take Assessment 🚀</button>}
                  {hasAssessment && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button className="db-welcome-btn" onClick={() => setActiveTab("report")}>
                        📄 View Full Report
                      </button>
                      <button 
                        className="db-btn-outline" 
                        style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}
                        onClick={() => setShowAssessment(true)}
                      >
                        🔄 Take Retest
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="db-stats-grid">
                <div className="db-stat-card saffron">
                  <span className="db-stat-icon">🎯</span>
                  <div className="db-stat-label">Career Clarity Index</div>
                  <div className="db-stat-value">{hasAssessment ? "8" : "0"}</div>
                  <div className="db-stat-sub">out of 10</div>
                </div>
                <div className="db-stat-card teal">
                  <span className="db-stat-icon">🧠</span>
                  <div className="db-stat-label">Assessment</div>
                  <div className="db-stat-value" style={{ fontSize: hasAssessment ? "24px" : "20px" }}>{hasAssessment ? "Done" : "Pending"}</div>
                </div>
                <div className="db-stat-card lavender" style={{ cursor: "pointer" }} onClick={() => setActiveTab("growth")}>
                  <span className="db-stat-icon">📈</span>
                  <div className="db-stat-label">Growth Plan</div>
                  <div className="db-stat-value" style={{ fontSize: "20px" }}>View Path</div>
                </div>
                <div className="db-stat-card sage" style={{ cursor: "pointer" }} onClick={() => setActiveTab("counsellor")}>
                  <span className="db-stat-icon">📅</span>
                  <div className="db-stat-label">Next Action</div>
                  <div className="db-stat-value" style={{ fontSize: "20px" }}>Book Expert</div>
                </div>
              </div>

              {/* ── CAREER INTELLIGENCE REPORT CARD ── */}
              {hasAssessment ? (
                <div style={{
                  background: 'linear-gradient(135deg, #0D1117 0%, #1C2850 60%, #0A3D2E 100%)',
                  borderRadius: 'var(--r-xl)',
                  padding: '32px 36px',
                  marginBottom: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(240,165,0,0.2)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.18)'
                }}>
                  {/* Decorative glow */}
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--gold)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        🧠 Career Intelligence Report
                      </div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: '700', color: 'white', lineHeight: '1.2' }}>
                        Your RIASEC Profile
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '48px', fontWeight: '900', color: 'var(--gold)', lineHeight: '1', letterSpacing: '4px' }}>
                        {String(localUserData?.riasecCode || '')}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: '4px' }}>Holland Code</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px', position: 'relative', zIndex: 1 }} />

                  {/* Three columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', position: 'relative', zIndex: 1 }}>

                    {/* Recommended Stream */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', padding: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--teal-light)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        📚 Recommended Stream
                      </div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>
                        {String(localUserData?.recommendedStream || localUserData?.streamRec?.name || 'Pending')}
                      </div>
                      {(localUserData?.streamRec?.match || localUserData?.maturityPct) && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Match</span>
                            <span style={{ fontSize: '12px', color: 'var(--teal-light)', fontWeight: '800' }}>
                              {localUserData?.streamRec?.match ? `${localUserData.streamRec.match}%` : `${localUserData?.maturityPct || 0}%`}
                            </span>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${localUserData?.streamRec?.match || localUserData?.maturityPct || 0}%`, background: 'linear-gradient(90deg, var(--teal), var(--teal-light))', borderRadius: '4px' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Top Career Match */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', padding: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        🏆 Top Career Match
                      </div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>
                        {String(
                          (localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 0)
                            ? localUserData.topCareerMatches[0].name
                            : (localUserData?.bestCareer?.title || 'Pending')
                        )}
                      </div>
                      {(localUserData?.topCareerMatches?.[0]?.matchScore || localUserData?.bestCareer?.matchPercent) && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Fit Score</span>
                            <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '800' }}>
                              {localUserData?.topCareerMatches?.[0]?.matchScore
                                ? `${localUserData.topCareerMatches[0].matchScore}%`
                                : `${localUserData?.bestCareer?.matchPercent || 0}%`}
                            </span>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${localUserData?.topCareerMatches?.[0]?.matchScore || localUserData?.bestCareer?.matchPercent || 0}%`, background: 'linear-gradient(90deg, var(--saffron), var(--gold))', borderRadius: '4px' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* More Career Matches */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', padding: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--lav-light)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        🎯 More Matches
                      </div>
                      {(localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 1)
                        ? localUserData.topCareerMatches.slice(1, 4).map((c, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', flex: 1, marginRight: '8px' }}>{String(c.name || '')}</span>
                              <span style={{ fontSize: '11px', color: 'var(--lav-light)', fontWeight: '800', flexShrink: 0 }}>{Number(c.matchScore || 0)}%</span>
                            </div>
                          ))
                        : [localUserData?.recommendedCareer, localUserData?.leastCareer].filter(Boolean).map((c, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', flex: 1, marginRight: '8px' }}>{String(c.title || '')}</span>
                              <span style={{ fontSize: '11px', color: 'var(--lav-light)', fontWeight: '800', flexShrink: 0 }}>{Number(c.matchPercent || 0)}%</span>
                            </div>
                          ))
                      }
                    </div>
                  </div>

                  {/* RIASEC Summary */}
                  {(localUserData?.riasecSummary) && (
                    <div style={{ marginTop: '20px', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Profile Summary</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', fontWeight: '400' }}>
                        {String(localUserData.riasecSummary)}
                      </div>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px', position: 'relative', zIndex: 1 }}>
                    <button className="db-btn" onClick={() => setActiveTab("careers")} style={{ fontSize: '13px', padding: '10px 20px' }}>
                      🎯 View Career Matches
                    </button>
                    <button className="db-btn-outline" onClick={() => setActiveTab("report")} style={{ fontSize: '13px', padding: '10px 20px', background: 'transparent', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
                      📄 Full Report
                    </button>
                  </div>
                </div>
              ) : (
                /* ── NO ASSESSMENT YET — CTA PLACEHOLDER ── */
                <div style={{
                  background: 'white',
                  borderRadius: 'var(--r-xl)',
                  padding: '40px 36px',
                  marginBottom: '28px',
                  border: '2px dashed var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px'
                }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>
                    🧠
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--lavender)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Career Intelligence Report</div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '700', color: 'var(--ink)', marginBottom: '8px' }}>Unlock Your RIASEC Profile</div>
                    <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.6', maxWidth: '480px' }}>
                      Take the free 15-minute VidyaVantage assessment to discover your Holland Code, recommended stream, and top career matches — personalised just for you.
                    </div>
                  </div>
                  <button
                    className="db-btn"
                    onClick={() => setShowAssessment(true)}
                    style={{ flexShrink: 0, fontSize: '15px', padding: '14px 28px', background: 'linear-gradient(135deg, var(--lavender), var(--lav-light))' }}
                  >
                    Take Assessment 🚀
                  </button>
                </div>
              )}

              {hasAssessment && streamRec && (
                <div className="db-stream-box">
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--success)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>🎯 Stream Recommendation</div>
                    <div style={{ fontFamily: "Fraunces", fontSize: "24px", fontWeight: "700", color: "var(--ink)", margin: "4px 0" }}>
                      {streamRec.name} <span style={{ color: "var(--success)", fontSize: "18px" }}>({streamRec.match}% Match)</span>
                    </div>
                    <ul style={{ margin: "8px 0 0 20px", fontSize: "13px", color: "var(--ink-soft)", fontWeight: "500" }}>
                      {(streamRec.reasons || []).map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <button className="db-btn" onClick={() => setActiveTab("colleges")}>Explore Colleges</button>
                </div>
              )}
            </div>
          )}

          {/* ── CAREERS TAB ── */}
          {activeTab === "careers" && (
            <div className="db-tab">
              {!hasAssessment ? (
                renderLockedState("🎯", "Unlock Career Matches", "You need to complete your profile before we can generate your career matches.")
              ) : (
                <>
                  <div className="db-three-col">
                    {[
                      { data: bestCareer, rank: "best", label: "🏆 Best Match" },
                      { data: recommendedCareer, rank: "good", label: "✅ Recommended" },
                      { data: leastCareer, rank: "low", label: "⚠️ Least Suited" }
                    ].map((career, i) => {
                      if (!career.data) return null;
                      
                      const pros = career.data.pros || ["Pending AI analysis"];
                      const cons = career.data.cons || ["Pending AI analysis"];
                      const pMetrics = career.data.parentMetrics || { stability: "Pending", demand: "Pending", safety: "Pending" };
                      
                      return (
                        <div key={i} className="db-career-card">
                          <span className={`db-career-rank ${career.rank}`}>{career.label}</span>
                          <div className="db-career-name">{career.data.title}</div>
                          <div className="db-career-sub">{career.data.subtitle}</div>

                          <div className="db-match-bar-wrap">
                            <div className="db-match-row">
                              <span className="db-match-label">Profile Match</span>
                              <span className={`db-match-pct`} style={{ color: career.rank === 'best'?'#059669':career.rank==='good'?'#D97706':'#E11D48' }}>{career.data.matchPercent}%</span>
                            </div>
                            <div className="db-match-bg">
                              <div style={{ height:'100%', width: `${career.data.matchPercent}%`, background: career.rank === 'best' ? '#34D399' : career.rank === 'good' ? '#FCD34D' : '#FB7185' }} />
                            </div>
                          </div>

                          {isParentMode ? (
                            <div className="db-explain-box" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                              <div style={{ fontSize: "11px", fontWeight: "800", color: "#4F46E5", marginBottom: "8px", textTransform: "uppercase" }}>👪 Parent Metrics</div>
                              <div className="db-parent-metric"><span>Stability</span><strong>{pMetrics.stability}</strong></div>
                              <div className="db-parent-metric"><span>Demand</span><strong>{pMetrics.demand}</strong></div>
                              <div className="db-parent-metric"><span>Safety</span><strong>{pMetrics.safety}</strong></div>
                            </div>
                          ) : (
                            <div className="db-explain-box">
                              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink)", marginBottom: "6px" }}>Why it fits you:</div>
                              {pros.map((p, j) => <div key={j} className="db-explain-item"><span className="db-explain-icon" style={{color:"var(--success)"}}>✔</span> {p}</div>)}
                              <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }}/>
                              {cons.map((c, j) => <div key={j} className="db-explain-item"><span className="db-explain-icon" style={{color:"var(--warn)"}}>⚠</span> {c}</div>)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="db-confusion-banner">
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#3730A3", marginBottom: "8px" }}>Not sure which path to choose?</div>
                    <div style={{ fontSize: "14px", color: "#4338CA", marginBottom: "16px" }}>Compare salaries, study years, and work-life balance side-by-side.</div>
                    <button className="db-btn" style={{ background: "#4F46E5" }} onClick={() => setActiveTab("compare")}>⚖️ Compare Careers Now</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── COMPARE TAB (DECISION SIMULATOR) ── */}
          {activeTab === "compare" && (
            <div className="db-tab">
              {!hasAssessment ? (
                renderLockedState("⚖️", "Compare Tool Locked")
              ) : compareStats.length === 0 ? (
                 <div className="db-empty-state"><div className="db-empty-icon">⏳</div><div className="db-empty-title">Comparison Data Pending</div><div className="db-empty-desc">Your AI engine is still fetching salary and study data for these paths.</div></div>
              ) : (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontFamily: "Fraunces", fontSize: "24px", color: "var(--ink)" }}>Decision Simulator</h2>
                    <p style={{ color: "var(--muted)", fontSize: "14px" }}>Compare your top matched careers across real-world metrics.</p>
                  </div>
                  <div className="db-compare-grid">
                    <div className="db-compare-header" style={{ background: "white" }}>Metrics</div>
                    {compareStats.map((c, i) => <div key={i} className="db-compare-header">{c.title}</div>)}
                    
                    <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Average Salary</div>
                    {compareStats.map((c, i) => <div key={i} className="db-compare-cell" style={{ color: "var(--success)" }}>{c.salary}</div>)}

                    <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Years of Study</div>
                    {compareStats.map((c, i) => <div key={i} className="db-compare-cell">{c.years}</div>)}

                    <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Difficulty (Entry)</div>
                    {compareStats.map((c, i) => <div key={i} className="db-compare-cell" style={{ color: c.difficulty?.includes("High") ? "var(--rose)" : "var(--warn)" }}>{c.difficulty}</div>)}

                    <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Work-Life Balance</div>
                    {compareStats.map((c, i) => <div key={i} className="db-compare-cell" style={{ color: "var(--teal)" }}>{c.wlb}</div>)}
                  </div>
                  <div style={{ textAlign: "center", marginTop: "32px" }}>
                    <button className="db-btn" onClick={() => setActiveTab("counsellor")}>Discuss with an Expert →</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── COLLEGES TAB ── */}
          {activeTab === "colleges" && (
            <div className="db-tab">
              {!hasAssessment ? (
                renderLockedState("🏫", "College Explorer Locked")
              ) : collegesExt.length === 0 ? (
                <div className="db-empty-state"><div className="db-empty-icon">⏳</div><div className="db-empty-title">Fetching Colleges</div><div className="db-empty-desc">College cutoff and fee data is being populated.</div></div>
              ) : (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontFamily: "Fraunces", fontSize: "24px", color: "var(--ink)" }}>Target Colleges</h2>
                    <p style={{ color: "var(--muted)", fontSize: "14px" }}>Based on your {localUserData?.riasecCode || "profile"} and Stream.</p>
                  </div>
                  {collegesExt.map((c, i) => (
                    <div key={i} className="db-college-ext">
                      <div className="db-avatar" style={{ borderRadius: "12px", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border)" }}>🏫</div>
                      <div className="db-college-ext-main">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{c.name}</div>
                          <span className="db-pill" style={{background: "#D1FAE5", color: "#065F46"}}>Top Match</span>
                        </div>
                        <div className="db-college-stats">
                          <div className="db-college-stat-pill">📍 {c.loc}</div>
                          <div className="db-college-stat-pill">🎯 {c.cutoffs}</div>
                          <div className="db-college-stat-pill">💰 {c.fees}</div>
                          <div className="db-college-stat-pill">📈 {c.placement}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── GROWTH & REALITY TAB ── */}
          {activeTab === "growth" && (
            <div className="db-tab">
              {!hasAssessment ? (
                renderLockedState("📈", "Growth Plan Locked")
              ) : (
                <div className="db-two-col">
                  {/* Skill Gap */}
                  <div className="db-card">
                    <div className="db-card-header"><div className="db-card-title">🧠 Skill Gap Analysis</div></div>
                    <div className="db-card-body">
                      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>You vs. Ideal {bestCareer?.title || "Professional"}</p>
                      
                      {skillGaps.length === 0 ? (
                        <div style={{ fontSize: "13px", color: "var(--muted)", textAlign: "center", padding: "20px 0" }}>Pending skill gap analysis from AI.</div>
                      ) : (
                        skillGaps.map((s, i) => (
                          <div key={i} className="db-skill-row">
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                              <span>{s.skill}</span>
                              <span style={{ color: s.status === "Needs Work" ? "var(--rose)" : "var(--success)" }}>{s.status}</span>
                            </div>
                            <div style={{ height: "6px", background: "var(--surface)", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
                              <div style={{ width: `${(s.student/10)*100}%`, background: "var(--teal)", borderRadius: "6px" }} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Career Reality */}
                  <div className="db-card">
                    <div className="db-card-header"><div className="db-card-title">🎥 Career Reality</div></div>
                    <div className="db-card-body">
                      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>Day in the Life of a {bestCareer?.title || "Professional"}</p>
                      <div className="db-video-ph" onClick={() => showToast("YouTube embed coming soon!")}>
                        <div className="db-video-play">▶</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="db-card" style={{ gridColumn: "1 / -1" }}>
                    <div className="db-card-header"><div className="db-card-title">🚀 Your Execution Plan</div></div>
                    <div className="db-card-body" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      {executionPlan.length === 0 ? (
                         <div style={{ fontSize: "13px", color: "var(--muted)" }}>Complete profile to unlock your personalized execution plan.</div>
                      ) : (
                        executionPlan.map((plan, i) => (
                          <div key={i} style={{ flex: 1, minWidth: "200px", padding: "16px", background: "var(--surface)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>{plan.title}</div>
                            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Action: {plan.action}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── COUNSELLOR TAB ── */}
          {activeTab === "counsellor" && (
            <div className="db-tab">
              <div className="db-two-col">
                <div className="db-card" style={{ marginBottom: 0 }}>
                  <div className="db-card-header"><div className="db-card-title">📅 Book Expert Session</div></div>
                  <div className="db-card-body">
                    <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                      {["Today", "Tomorrow", "Thu 26", "Fri 27"].map((d, i) => (
                        <div key={i} style={{ padding: "10px 16px", border: i===0?"1.5px solid var(--saffron)":"1px solid var(--border)", borderRadius: "var(--r-sm)", background: i===0?"#FFFBEB":"white", textAlign: "center", cursor: "pointer", minWidth: "80px" }}>
                          <div style={{ fontSize: "12px", color: i===0?"var(--saffron)":"var(--muted)", fontWeight: "600" }}>{d}</div>
                        </div>
                      ))}
                    </div>

                    {[
                      { name: "Dr. Meera", spec: "Clinical Psych", type: "Free 15-min Video Call" },
                      { name: "Prof. Arjun", spec: "Career Coach", type: "Paid 1-hr Deep Dive" }
                    ].map((c, i) => (
                      <div key={i} style={{ padding: "16px", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", marginBottom: "12px", display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--teal)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👩‍⚕️</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>{c.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>{c.spec}</div>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--saffron)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>🎥 {c.type}</div>
                        </div>
                        <button className="db-btn-outline" onClick={() => showToast("Booking portal loading...")}>Select Time</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORT TAB ── */}
          {activeTab === "report" && (
            <div className="db-tab">
              {!hasAssessment ? (
                renderLockedState("📄", "Full Report Locked")
              ) : (
                <div className="db-card">
                  <div className="db-card-header">
                    <div className="db-card-title">📄 Instant Career Report</div>
                    <button className="db-btn" onClick={() => showToast("Downloading PDF...")}>⬇ Download PDF</button>
                  </div>
                  <div className="db-card-body">
                    <div style={{ background: "linear-gradient(135deg, var(--ink), #1C2850)", borderRadius: "var(--r-lg)", padding: "32px", marginBottom: "24px", color: "white" }}>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>RIASEC Career Report — {studentName}</div>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: "700", color: "var(--gold)", marginBottom: "8px" }}>{localUserData?.riasecCode || "Pending"}</div>
                      <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", maxWidth: "600px" }}>
                        {localUserData?.riasecSummary || "Your detailed AI-generated psychological and career summary is being finalized based on your latest assessment."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {toast && <div className="db-toast"><span>🔔</span><span>{toast}</span></div>}
    </div>
  );
}
