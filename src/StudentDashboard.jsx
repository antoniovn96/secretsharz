import React, { useState, useEffect } from "react";

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
.db-nav-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }

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
.db-xp-chip { display: flex; align-items: center; gap: 6px; background: #FFFBEB; border: 1.5px solid #FDE68A; color: #92400E; padding: 6px 14px; border-radius: 30px; font-size: 13px; font-weight: 700; }

.db-content { padding: 40px; flex: 1; overflow-y: auto; }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.db-tab { animation: fadeSlideUp 0.4s ease both; }

/* ── WELCOME BANNER ── */
.db-welcome { background: linear-gradient(135deg, var(--ink) 0%, #1C2850 100%); border-radius: var(--r-xl); padding: 36px 40px; margin-bottom: 28px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.db-welcome::before { content: ''; position: absolute; top: -40px; right: -40px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(232,101,10,0.15), transparent 70%); }
.db-welcome::after { content: ''; position: absolute; bottom: -30px; left: 30%; width: 160px; height: 160px; background: radial-gradient(circle, rgba(10,124,110,0.12), transparent 70%); }
.db-welcome-text { position: relative; z-index: 1; }
.db-welcome-eyebrow { font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
.db-welcome-h1 { font-family: 'Fraunces', serif; font-size: clamp(24px, 3vw, 36px); font-weight: 700; color: white; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 10px; }
.db-welcome-h1 em { font-style: italic; color: var(--gold); }
.db-welcome-p { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 480px; font-weight: 400; }
.db-welcome-action { position: relative; z-index: 1; flex-shrink: 0; }

/* ── BUTTONS ── */
.db-welcome-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 14px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 8px 24px rgba(232,101,10,0.35); transition: all 0.2s; white-space: nowrap; }
.db-welcome-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(232,101,10,0.45); }
.db-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 4px 16px rgba(232,101,10,0.3); transition: all 0.2s; }
.db-btn:hover { transform: translateY(-1px); }
.db-btn-outline { background: white; color: var(--saffron); border: 1.5px solid var(--saffron); padding: 10px 20px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.db-btn-outline:hover { background: var(--saffron); color: white; }

/* ── STAT CARDS ── */
.db-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.db-stat-card { background: white; border-radius: var(--r-lg); padding: 24px; border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); transition: all 0.25s; position: relative; overflow: hidden; }
.db-stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.db-stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.db-stat-card.saffron::before { background: linear-gradient(90deg, var(--saffron), var(--gold)); }
.db-stat-card.teal::before { background: linear-gradient(90deg, var(--teal), var(--teal-light)); }
.db-stat-card.lavender::before { background: linear-gradient(90deg, var(--lavender), var(--lav-light)); }
.db-stat-card.sage::before { background: linear-gradient(90deg, var(--sage), #6FAA80); }
.db-stat-icon { font-size: 28px; margin-bottom: 14px; display: block; }
.db-stat-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
.db-stat-value { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1; }
.db-stat-sub { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 500; }

/* ── GRIDS & CARDS ── */
.db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.db-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.db-card { background: white; border-radius: var(--r-lg); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }
.db-card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.db-card-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--ink); }
.db-card-body { padding: 24px; }

/* ── CAREER MATCH CARDS ── */
.db-career-card { background: white; border-radius: var(--r-md); border: 1.5px solid var(--border); padding: 20px; transition: all 0.25s; position: relative; overflow: hidden; }
.db-career-rank { position: absolute; top: 14px; right: 14px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.db-career-rank.best { background: #D1FAE5; color: #065F46; }
.db-career-rank.good { background: #FEF3C7; color: #92400E; }
.db-career-rank.low { background: #FEE2E2; color: #991B1B; }
.db-career-name { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 4px; padding-right: 60px; }
.db-career-sub { font-size: 12px; color: var(--muted); margin-bottom: 16px; font-weight: 500; }
.db-match-bar-wrap { margin-bottom: 14px; }
.db-match-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.db-match-label { font-size: 12px; color: var(--muted); font-weight: 600; }
.db-match-pct { font-size: 13px; font-weight: 800; }
.db-match-bg { height: 6px; background: var(--surface); border-radius: 6px; overflow: hidden; }
.db-match-fill { height: 100%; border-radius: 6px; }
.db-career-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.db-career-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; background: var(--surface); color: var(--muted); border: 1px solid var(--border); }

/* ── RIASEC CHART ── */
.db-riasec-chart { display: flex; flex-direction: column; gap: 10px; }
.db-riasec-row { display: flex; align-items: center; gap: 12px; }
.db-riasec-code { font-size: 11px; font-weight: 800; width: 24px; text-align: center; color: var(--ink); }
.db-riasec-label { font-size: 12px; font-weight: 600; color: var(--muted); width: 100px; }
.db-riasec-bar-bg { flex: 1; height: 8px; background: var(--surface); border-radius: 8px; overflow: hidden; }
.db-riasec-bar-fill { height: 100%; border-radius: 8px; transition: width 1s ease; }
.db-riasec-score { font-size: 12px; font-weight: 700; color: var(--ink); width: 32px; text-align: right; }

/* ── TIMELINE ── */
.db-timeline { display: flex; flex-direction: column; gap: 0; }
.db-timeline-item { display: flex; gap: 16px; position: relative; padding-bottom: 20px; }
.db-timeline-item:last-child { padding-bottom: 0; }
.db-timeline-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.db-timeline-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.db-timeline-dot.done { background: #D1FAE5; }
.db-timeline-dot.active { background: #FEF3C7; }
.db-timeline-dot.locked { background: var(--surface); border: 2px dashed var(--border); }
.db-timeline-line { flex: 1; width: 2px; background: var(--border); margin: 4px 0; }
.db-timeline-content { padding-top: 4px; }
.db-timeline-title { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
.db-timeline-desc { font-size: 12px; color: var(--muted); font-weight: 500; }

/* ── EMPTY STATE ── */
.db-empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: var(--r-lg); border: 1.5px dashed var(--border); }
.db-empty-icon { font-size: 48px; margin-bottom: 16px; }
.db-empty-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.db-empty-desc { font-size: 15px; color: var(--muted); max-width: 400px; margin: 0 auto 24px; line-height: 1.6; }

/* ── PROFILE SECTION ── */
.db-profile-field { margin-bottom: 20px; }
.db-profile-label { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.db-profile-value { font-size: 15px; font-weight: 600; color: var(--ink); padding: 12px 16px; background: var(--surface); border-radius: var(--r-sm); border: 1.5px solid var(--border); }

/* ── PILL TAG ── */
.db-pill { display: inline-block; padding: 5px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; }
.db-pill-green { background: #D1FAE5; color: #065F46; }
.db-pill-amber { background: #FEF3C7; color: #92400E; }
.db-pill-blue { background: #DBEAFE; color: #1E40AF; }
.db-pill-purple { background: #EDE9FE; color: #5B21B6; }

/* ── TOAST ── */
.db-toast { position: fixed; bottom: 24px; right: 24px; background: var(--ink); color: white; padding: 14px 20px; border-radius: var(--r-md); font-size: 14px; font-weight: 600; box-shadow: var(--shadow-lg); z-index: 9999; animation: slideInRight 0.3s ease; display: flex; align-items: center; gap: 10px; max-width: 320px; }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── MOBILE ── */
@media (max-width: 900px) {
  .db-sidebar { display: none; }
  .db-content { padding: 20px; }
  .db-topbar { padding: 0 20px; }
  .db-stats-grid { grid-template-columns: 1fr 1fr; }
  .db-two-col, .db-three-col { grid-template-columns: 1fr; }
  .db-welcome { flex-direction: column; text-align: center; }
  .db-welcome-action { width: 100%; }
  .db-welcome-btn { width: 100%; }
}
`;

const RIASEC_COLORS = {
  R: "#E65100", I: "#1565C0", A: "#6A1B9A",
  S: "#2E7D32", E: "#F57F17", C: "#00695C",
};

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Dashboard" },
  { id: "careers", icon: "🎯", label: "Career Matches" },
  { id: "profile", icon: "👤", label: "My Profile" },
  { id: "report", icon: "📄", label: "Full Report" },
];

export default function StudentDashboard({ user, userData, onStartAssessment, onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Safe defaults derived from Firebase data
  const studentName = userData?.name || user?.displayName || "Student";
  const firstName = studentName.split(" ")[0];
  const hasAssessment = !!userData?.riasecCode;
  
  const xp = userData?.xp || 10;
  const level = userData?.level || "Level 1 - Explorer";
  const profileStrength = hasAssessment ? 100 : 50;

  // Extract careers safely if they exist in Firebase
  const bestCareer = userData?.bestCareer || null;
  const recommendedCareer = userData?.recommendedCareer || null;
  const leastCareer = userData?.leastCareer || null;
  const topColleges = bestCareer?.colleges || [];

  const tabTitle = NAV_ITEMS.find((n) => n.id === activeTab)?.label || "Dashboard";

  return (
    <div className="db-root">
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-brand">
          <div className="db-sidebar-logo">Vidya<span>Vantage</span></div>
          <div className="db-sidebar-sub">Student Portal</div>
        </div>

        <div className="db-student-info">
          <div className="db-avatar">{studentName.charAt(0)}</div>
          <div className="db-student-name">{studentName}</div>
          <div className="db-student-class">{userData?.classLevel || "Class Not Set"}</div>
          {hasAssessment && (
            <div className="db-riasec-badge">RIASEC: {userData.riasecCode}</div>
          )}
        </div>

        <div className="db-progress-wrap" onClick={() => !hasAssessment && showToast("Take the assessment to reach 100%!")}>
          <div className="db-progress-label">
            <span className="db-progress-text">Profile Strength</span>
            <span className="db-progress-pct">{profileStrength}%</span>
          </div>
          <div className="db-progress-bar">
            <div className="db-progress-fill" style={{ width: `${profileStrength}%` }} />
          </div>
        </div>

        <nav className="db-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`db-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="db-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          {onBack && (
            <button className="db-back-btn" onClick={onBack}>← Back to Secret Sharz</button>
          )}
          {onLogout && (
            <button className="db-logout-btn" onClick={onLogout}>Sign Out</button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="db-main">
        {/* Top Bar */}
        <div className="db-topbar">
          <div className="db-topbar-title">{tabTitle}</div>
          <div className="db-topbar-right">
            <div className="db-xp-chip">⚡ {xp} XP · {level}</div>
            <div className="db-notif-btn" onClick={() => showToast("No new notifications")}>🔔</div>
          </div>
        </div>

        {/* Content */}
        <div className="db-content">

          {/* ── HOME TAB ── */}
          {activeTab === "home" && (
            <div className="db-tab">
              
              {/* Conditional Welcome Banner */}
              <div className="db-welcome">
                <div className="db-welcome-text">
                  <div className="db-welcome-eyebrow">Welcome Back</div>
                  <h1 className="db-welcome-h1">
                    Hey {firstName},<br />
                    {hasAssessment ? "your future is " : "ready to discover " }
                    <em>{hasAssessment ? "taking shape" : "your path?"}</em>
                  </h1>
                  <p className="db-welcome-p">
                    {hasAssessment 
                      ? `Your RIASEC code is ${userData.riasecCode}. ${bestCareer?.title || "Your best match"} is waiting for you.`
                      : "Take our free AI-powered career assessment to unlock your RIASEC personality code, best career matches, and top Indian colleges."
                    }
                  </p>
                </div>
                <div className="db-welcome-action">
                  {!hasAssessment && (
                    <button className="db-welcome-btn" onClick={onStartAssessment}>
                      Take Free Assessment 🚀
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="db-stats-grid">
                <div className="db-stat-card saffron">
                  <span className="db-stat-icon">🎯</span>
                  <div className="db-stat-label">Clarity Score</div>
                  <div className="db-stat-value">{hasAssessment ? "8" : "0"}</div>
                  <div className="db-stat-sub">out of 10</div>
                </div>
                <div className="db-stat-card teal">
                  <span className="db-stat-icon">🧠</span>
                  <div className="db-stat-label">Assessment</div>
                  <div className="db-stat-value" style={{ fontSize: hasAssessment ? "24px" : "20px" }}>
                    {hasAssessment ? "Done" : "Pending"}
                  </div>
                  <div className="db-stat-sub">{hasAssessment ? `Code: ${userData.riasecCode}` : "Unlock your profile"}</div>
                </div>
                <div className="db-stat-card lavender">
                  <span className="db-stat-icon">⚡</span>
                  <div className="db-stat-label">Your XP</div>
                  <div className="db-stat-value">{xp}</div>
                  <div className="db-stat-sub">{level}</div>
                </div>
                <div className="db-stat-card sage" onClick={() => showToast("Counsellor booking coming soon!")} style={{ cursor: "pointer" }}>
                  <span className="db-stat-icon">📅</span>
                  <div className="db-stat-label">Next Step</div>
                  <div className="db-stat-value" style={{ fontSize: "20px" }}>Book Expert</div>
                  <div className="db-stat-sub">1-on-1 Guidance</div>
                </div>
              </div>

              <div className="db-two-col">
                {/* Journey Timeline */}
                <div className="db-card">
                  <div className="db-card-header">
                    <div className="db-card-title">🗺️ Your Journey</div>
                    <span className="db-pill db-pill-blue">{hasAssessment ? "2" : "1"} of 4 done</span>
                  </div>
                  <div className="db-card-body">
                    <div className="db-timeline">
                      <div className="db-timeline-item">
                        <div className="db-timeline-left">
                          <div className="db-timeline-dot done">✅</div>
                          <div className="db-timeline-line" />
                        </div>
                        <div className="db-timeline-content">
                          <div className="db-timeline-title">Profile Created</div>
                          <div className="db-timeline-desc">Basic info saved</div>
                        </div>
                      </div>
                      
                      <div className="db-timeline-item">
                        <div className="db-timeline-left">
                          <div className={`db-timeline-dot ${hasAssessment ? "done" : "active"}`}>
                            {hasAssessment ? "✅" : "⏳"}
                          </div>
                          <div className="db-timeline-line" />
                        </div>
                        <div className="db-timeline-content">
                          <div className="db-timeline-title" style={{ color: !hasAssessment ? "var(--warn)" : "inherit" }}>
                            Career Assessment
                          </div>
                          <div className="db-timeline-desc">
                            {hasAssessment ? `Completed. Code: ${userData.riasecCode}` : "Required to unlock matches"}
                          </div>
                        </div>
                      </div>

                      <div className="db-timeline-item">
                        <div className="db-timeline-left">
                          <div className="db-timeline-dot locked">🔒</div>
                        </div>
                        <div className="db-timeline-content">
                          <div className="db-timeline-title" style={{ color: "var(--muted)" }}>Lock Final Career Path</div>
                          <div className="db-timeline-desc">Commit to your chosen direction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIASEC Profile */}
                <div className="db-card">
                  <div className="db-card-header">
                    <div className="db-card-title">🧠 RIASEC Profile</div>
                    {hasAssessment && <span className="db-pill db-pill-purple">Code: {userData.riasecCode}</span>}
                  </div>
                  <div className="db-card-body">
                    {!hasAssessment ? (
                      <div className="db-empty-state" style={{ padding: "30px 20px" }}>
                        <div className="db-empty-icon">🔒</div>
                        <div className="db-empty-title" style={{ fontSize: "18px" }}>Profile Locked</div>
                        <div className="db-empty-desc" style={{ fontSize: "13px" }}>Take the assessment to reveal your psychological career traits.</div>
                        <button className="db-btn" onClick={onStartAssessment}>Start Assessment</button>
                      </div>
                    ) : (
                      <>
                        <div className="db-riasec-chart">
                          {userData.riasecScores && Object.entries(userData.riasecScores).map(([code, score]) => {
                            const labels = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
                            return (
                              <div key={code} className="db-riasec-row">
                                <div className="db-riasec-code" style={{ color: RIASEC_COLORS[code] }}>{code}</div>
                                <div className="db-riasec-label">{labels[code]}</div>
                                <div className="db-riasec-bar-bg">
                                  <div className="db-riasec-bar-fill" style={{ width: `${score * 10}%`, background: RIASEC_COLORS[code] + "99" }} />
                                </div>
                                <div className="db-riasec-score">{score}/10</div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ marginTop: "20px", padding: "14px 16px", background: "var(--surface)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
                          <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>AI Summary</div>
                          <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: "500", lineHeight: "1.6" }}>
                            {userData.riasecSummary || "Your personality profile is ready for review."}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CAREERS TAB ── */}
          {activeTab === "careers" && (
            <div className="db-tab">
              {!hasAssessment ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon">🎯</div>
                  <div className="db-empty-title">Unlock Your Career Matches</div>
                  <div className="db-empty-desc">We need to map your personality before we can recommend your best career paths.</div>
                  <button className="db-btn" onClick={onStartAssessment}>Take Assessment</button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>
                      Based on your RIASEC code <strong style={{ color: "var(--ink)" }}>{userData.riasecCode}</strong>
                    </div>
                  </div>
                  <div className="db-three-col">
                    {[
                      { data: bestCareer, rank: "best", label: "🏆 Best Match", matchClass: "high" },
                      { data: recommendedCareer, rank: "good", label: "✅ Recommended", matchClass: "mid" },
                      { data: leastCareer, rank: "low", label: "⚠️ Least Suited", matchClass: "low" }
                    ].map((career, i) => {
                      if (!career.data) return null;
                      return (
                        <div key={i} className="db-career-card">
                          <span className={`db-career-rank ${career.rank}`}>{career.label}</span>
                          <div className="db-career-name">{career.data.title}</div>
                          <div className="db-career-sub">{career.data.subtitle}</div>

                          <div className="db-match-bar-wrap">
                            <div className="db-match-row">
                              <span className="db-match-label">Profile Match</span>
                              <span className={`db-match-pct ${career.matchClass}`}>{career.data.matchPercent}%</span>
                            </div>
                            <div className="db-match-bg">
                              <div className={`db-match-fill ${career.matchClass}`} 
                                style={{ 
                                  width: `${career.data.matchPercent}%`, 
                                  background: career.rank === 'best' ? 'linear-gradient(90deg, #059669, #34D399)' : career.rank === 'good' ? 'linear-gradient(90deg, #D97706, #FCD34D)' : 'linear-gradient(90deg, #E11D48, #FB7185)' 
                                }} 
                              />
                            </div>
                          </div>

                          <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6", marginBottom: "12px", fontWeight: "500" }}>
                            {career.data.analysis}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="db-tab">
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">👤 Academic Profile</div>
                </div>
                <div className="db-card-body">
                  <div className="db-profile-grid">
                    {[
                      { label: "Full Name", val: studentName },
                      { label: "Email Address", val: userData?.email || user?.email },
                      { label: "Class / Level", val: userData?.classLevel || "Not provided" },
                      { label: "State", val: userData?.state || "Not provided" },
                      { label: "Stream", val: userData?.stream || "Not provided" },
                      { label: "Gender", val: userData?.gender || "Not provided" },
                    ].map((f, i) => (
                      <div key={i} className="db-profile-field">
                        <div className="db-profile-label">{f.label}</div>
                        <div className="db-profile-value">{f.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="db-profile-field">
                    <div className="db-profile-label">Career Aspiration</div>
                    <div className="db-profile-value" style={{ color: "var(--saffron)", fontStyle: "italic" }}>
                      {userData?.aspiration || "None provided during registration."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORT TAB ── */}
          {activeTab === "report" && (
            <div className="db-tab">
              {!hasAssessment ? (
                <div className="db-empty-state">
                  <div className="db-empty-icon">📄</div>
                  <div className="db-empty-title">Report Unavailable</div>
                  <div className="db-empty-desc">Your full PDF report is generated instantly after completing the assessment.</div>
                  <button className="db-btn" onClick={onStartAssessment}>Start Assessment</button>
                </div>
              ) : (
                <div className="db-card">
                  <div className="db-card-header">
                    <div className="db-card-title">📄 Full Career Report</div>
                    <button className="db-btn" onClick={() => showToast("PDF export coming soon!")}>Export PDF</button>
                  </div>
                  <div className="db-card-body">
                    <div style={{ background: "linear-gradient(135deg, var(--ink), #1C2850)", borderRadius: "var(--r-lg)", padding: "32px", marginBottom: "24px", color: "white" }}>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                        RIASEC Career Report — {studentName}
                      </div>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: "700", color: "var(--gold)", marginBottom: "8px" }}>
                        {userData.riasecCode}
                      </div>
                      <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", maxWidth: "600px" }}>
                        {userData.riasecSummary}
                      </div>
                    </div>

                    <div className="db-two-col">
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)", marginBottom: "12px" }}>✅ Top College Matches</div>
                        {topColleges.length > 0 ? topColleges.map((c, i) => (
                          <div key={i} style={{ padding: "10px 14px", background: "#D1FAE5", borderRadius: "var(--r-sm)", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#065F46" }}>
                            → {c}
                          </div>
                        )) : (
                          <div style={{ fontSize: "13px", color: "var(--muted)" }}>No specific colleges listed for this path.</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)", marginBottom: "12px" }}>🎯 Your Next Steps</div>
                        {userData?.nextSteps ? userData.nextSteps.map((c, i) => (
                          <div key={i} style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>
                            • {c}
                          </div>
                        )) : (
                          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Take the assessment to unlock steps.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="db-toast">
          <span>🔔</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
