import React, { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`;

const CSS = `
:root {
  --ink: #0D1117;
  --ink-soft: #1C2333;
  --surface: #F6F8FA;
  --card: #FFFFFF;
  --border: #E1E7EF;
  --muted: #6B7280;
  --saffron: #E8650A;
  --gold: #F0A500;
  --teal: #0A7C6E;
  --teal-light: #14B8A6;
  --sage: #4A7C59;
  --lavender: #7C3AED;
  --lav-light: #A78BFA;
  --rose: #E11D48;
  --sky: #0EA5E9;
  --success: #059669;
  --warn: #D97706;
  --r-sm: 12px;
  --r-md: 18px;
  --r-lg: 24px;
  --r-xl: 32px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.10);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.db-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--surface);
  min-height: 100vh;
  color: var(--ink);
  display: flex;
  overflow-x: hidden;
}

/* ── SIDEBAR ── */
.db-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.db-sidebar-brand {
  padding: 28px 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.db-sidebar-logo {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}
.db-sidebar-logo span { color: var(--gold); font-style: italic; }
.db-sidebar-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 4px;
}

.db-student-info {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.db-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--saffron), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fraunces', serif;
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
}
.db-student-name {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}
.db-student-class {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
}
.db-riasec-badge {
  display: inline-block;
  margin-top: 10px;
  background: rgba(240,165,0,0.15);
  border: 1px solid rgba(240,165,0,0.25);
  color: var(--gold);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 30px;
  letter-spacing: 1px;
}

.db-progress-wrap {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
}
.db-progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.db-progress-text {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.db-progress-pct {
  font-size: 11px;
  color: var(--teal-light);
  font-weight: 700;
}
.db-progress-bar {
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
}
.db-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--teal), var(--teal-light));
  border-radius: 4px;
  transition: width 1s ease;
}

.db-nav {
  padding: 16px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.db-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--r-sm);
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.db-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
.db-nav-item.active { background: rgba(232,101,10,0.15); color: white; }
.db-nav-icon { font-size: 16px; width: 20px; text-align: center; }
.db-nav-badge {
  margin-left: auto;
  background: var(--saffron);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
}

.db-nav-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 8px 0;
}

.db-sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.db-back-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--r-sm);
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s;
}
.db-back-btn:hover { background: rgba(255,255,255,0.08); color: white; }

/* ── MAIN ── */
.db-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.db-topbar {
  background: white;
  border-bottom: 1px solid var(--border);
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.db-topbar-title {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
}
.db-topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.db-xp-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #FFFBEB;
  border: 1.5px solid #FDE68A;
  color: #92400E;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
}
.db-notif-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface);
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.db-notif-btn:hover { background: var(--ink); }

/* ── CONTENT ── */
.db-content {
  padding: 40px;
  flex: 1;
  overflow-y: auto;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.db-tab { animation: fadeSlideUp 0.4s ease both; }

/* ── WELCOME BANNER ── */
.db-welcome {
  background: linear-gradient(135deg, var(--ink) 0%, #1C2850 100%);
  border-radius: var(--r-xl);
  padding: 36px 40px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.db-welcome::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(232,101,10,0.15), transparent 70%);
}
.db-welcome::after {
  content: '';
  position: absolute;
  bottom: -30px; left: 30%;
  width: 160px; height: 160px;
  background: radial-gradient(circle, rgba(10,124,110,0.12), transparent 70%);
}
.db-welcome-text { position: relative; z-index: 1; }
.db-welcome-eyebrow {
  font-size: 11px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.db-welcome-h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
}
.db-welcome-h1 em { font-style: italic; color: var(--gold); }
.db-welcome-p {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  max-width: 480px;
  font-weight: 400;
}
.db-welcome-action {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.db-welcome-btn {
  background: linear-gradient(135deg, var(--saffron), var(--gold));
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 8px 24px rgba(232,101,10,0.35);
  transition: all 0.2s;
  white-space: nowrap;
}
.db-welcome-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(232,101,10,0.45); }

/* ── STAT CARDS ── */
.db-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.db-stat-card {
  background: white;
  border-radius: var(--r-lg);
  padding: 24px;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.db-stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.db-stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.db-stat-card.saffron::before { background: linear-gradient(90deg, var(--saffron), var(--gold)); }
.db-stat-card.teal::before { background: linear-gradient(90deg, var(--teal), var(--teal-light)); }
.db-stat-card.lavender::before { background: linear-gradient(90deg, var(--lavender), var(--lav-light)); }
.db-stat-card.sage::before { background: linear-gradient(90deg, var(--sage), #6FAA80); }
.db-stat-icon {
  font-size: 28px;
  margin-bottom: 14px;
  display: block;
}
.db-stat-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 4px;
}
.db-stat-value {
  font-family: 'Fraunces', serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}
.db-stat-sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  font-weight: 500;
}

/* ── TWO COLUMN GRID ── */
.db-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.db-three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ── CARDS ── */
.db-card {
  background: white;
  border-radius: var(--r-lg);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 20px;
}
.db-card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.db-card-title {
  font-family: 'Fraunces', serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}
.db-card-body { padding: 24px; }

/* ── CAREER MATCH CARDS ── */
.db-career-card {
  background: white;
  border-radius: var(--r-md);
  border: 1.5px solid var(--border);
  padding: 20px;
  transition: all 0.25s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.db-career-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--saffron); }
.db-career-rank {
  position: absolute;
  top: 14px; right: 14px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.db-career-rank.best { background: #D1FAE5; color: #065F46; }
.db-career-rank.good { background: #FEF3C7; color: #92400E; }
.db-career-rank.low { background: #FEE2E2; color: #991B1B; }
.db-career-name {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
  padding-right: 60px;
}
.db-career-sub {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 16px;
  font-weight: 500;
}
.db-match-bar-wrap { margin-bottom: 14px; }
.db-match-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.db-match-label { font-size: 12px; color: var(--muted); font-weight: 600; }
.db-match-pct { font-size: 13px; font-weight: 800; }
.db-match-pct.high { color: var(--success); }
.db-match-pct.mid { color: var(--warn); }
.db-match-pct.low { color: var(--rose); }
.db-match-bg {
  height: 6px;
  background: var(--surface);
  border-radius: 6px;
  overflow: hidden;
}
.db-match-fill {
  height: 100%;
  border-radius: 6px;
}
.db-match-fill.high { background: linear-gradient(90deg, var(--success), #34D399); }
.db-match-fill.mid { background: linear-gradient(90deg, var(--warn), #FCD34D); }
.db-match-fill.low { background: linear-gradient(90deg, var(--rose), #FB7185); }
.db-career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.db-career-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--surface);
  color: var(--muted);
  border: 1px solid var(--border);
}

/* ── RIASEC CHART ── */
.db-riasec-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.db-riasec-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.db-riasec-code {
  font-size: 11px;
  font-weight: 800;
  width: 24px;
  text-align: center;
  color: var(--ink);
}
.db-riasec-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  width: 100px;
}
.db-riasec-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--surface);
  border-radius: 8px;
  overflow: hidden;
}
.db-riasec-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 1s ease;
}
.db-riasec-score {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  width: 32px;
  text-align: right;
}

/* ── TIMELINE ── */
.db-timeline { display: flex; flex-direction: column; gap: 0; }
.db-timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
  padding-bottom: 20px;
}
.db-timeline-item:last-child { padding-bottom: 0; }
.db-timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.db-timeline-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.db-timeline-dot.done { background: #D1FAE5; }
.db-timeline-dot.active { background: #FEF3C7; }
.db-timeline-dot.locked { background: var(--surface); border: 2px dashed var(--border); }
.db-timeline-line {
  flex: 1;
  width: 2px;
  background: var(--border);
  margin: 4px 0;
}
.db-timeline-content { padding-top: 4px; }
.db-timeline-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 2px;
}
.db-timeline-desc { font-size: 12px; color: var(--muted); font-weight: 500; }

/* ── COLLEGE CHIPS ── */
.db-college-list { display: flex; flex-direction: column; gap: 8px; }
.db-college-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--surface);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  transition: all 0.2s;
  cursor: pointer;
}
.db-college-item:hover { border-color: var(--saffron); background: #FFFBEB; }
.db-college-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--saffron), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.db-college-name { font-size: 13px; font-weight: 700; color: var(--ink); }
.db-college-sub { font-size: 11px; color: var(--muted); font-weight: 500; }
.db-college-match {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: var(--success);
  background: #D1FAE5;
  padding: 3px 10px;
  border-radius: 20px;
}

/* ── NEXT STEPS ── */
.db-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.db-step-card {
  background: var(--surface);
  border-radius: var(--r-md);
  padding: 20px;
  border: 1.5px solid var(--border);
  text-align: center;
  transition: all 0.2s;
}
.db-step-card:hover { border-color: var(--saffron); background: #FFFBEB; }
.db-step-num {
  font-family: 'Fraunces', serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 6px;
}
.db-step-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.db-step-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

/* ── PROFILE SECTION ── */
.db-profile-field {
  margin-bottom: 20px;
}
.db-profile-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.db-profile-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  padding: 12px 16px;
  background: var(--surface);
  border-radius: var(--r-sm);
  border: 1.5px solid var(--border);
}
.db-profile-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--r-sm);
  border: 1.5px solid var(--border);
  font-size: 15px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink);
  background: white;
  outline: none;
  transition: border-color 0.2s;
}
.db-profile-input:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(232,101,10,0.08); }
.db-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* ── PILL TAG ── */
.db-pill {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
}
.db-pill-green { background: #D1FAE5; color: #065F46; }
.db-pill-amber { background: #FEF3C7; color: #92400E; }
.db-pill-blue { background: #DBEAFE; color: #1E40AF; }
.db-pill-purple { background: #EDE9FE; color: #5B21B6; }

/* ── BUTTONS ── */
.db-btn {
  background: linear-gradient(135deg, var(--saffron), var(--gold));
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 16px rgba(232,101,10,0.3);
  transition: all 0.2s;
}
.db-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232,101,10,0.4); }
.db-btn-outline {
  background: white;
  color: var(--saffron);
  border: 1.5px solid var(--saffron);
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s;
}
.db-btn-outline:hover { background: var(--saffron); color: white; }
.db-btn-teal {
  background: linear-gradient(135deg, var(--teal), var(--teal-light));
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 16px rgba(10,124,110,0.25);
  transition: all 0.2s;
}
.db-btn-teal:hover { transform: translateY(-1px); }

/* ── TOAST ── */
.db-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--ink);
  color: white;
  padding: 14px 20px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  animation: slideInRight 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 320px;
}
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ── MOBILE ── */
@media (max-width: 900px) {
  .db-sidebar { display: none; }
  .db-content { padding: 20px; }
  .db-topbar { padding: 0 20px; }
  .db-stats-grid { grid-template-columns: 1fr 1fr; }
  .db-two-col { grid-template-columns: 1fr; }
  .db-three-col { grid-template-columns: 1fr; }
  .db-steps-grid { grid-template-columns: 1fr; }
  .db-profile-grid { grid-template-columns: 1fr; }
  .db-welcome { flex-direction: column; }
  .db-welcome-action { width: 100%; }
  .db-welcome-btn { width: 100%; }
}
`;

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_STUDENT = {
  name: "Priya Sharma",
  class: "Class 12 (Science)",
  city: "Bengaluru, Karnataka",
  riasecCode: "ISA",
  riasecScores: { R: 4, I: 9, A: 7, S: 8, E: 5, C: 6 },
  profileComplete: 65,
  xp: 340,
  level: "Level 3",
  assessmentDone: true,
  sessionBooked: false,
  careerLocked: false,
  stream: "Science (PCBP)",
  strongSubject: "Biology",
  weakSubject: "Mathematics",
  studyStyle: "Visual",
  aspiration: "I want to be a Clinical Psychologist",
};

const CAREER_MATCHES = [
  {
    title: "Clinical Psychology",
    subtitle: "Therapist · Counsellor · Researcher",
    match: 94,
    rank: "best",
    tags: ["ISA Profile", "High Growth", "Impactful"],
    colleges: ["NIMHANS Bengaluru", "TISS Mumbai", "Christ University"],
    analysis: "Your ISA profile with strong Investigative and Social scores makes Clinical Psychology a natural fit. Your empathetic nature and analytical curiosity are exactly what this field needs.",
  },
  {
    title: "Behavioural Sciences",
    subtitle: "Researcher · Policy Analyst · Educator",
    match: 78,
    rank: "good",
    tags: ["Research-Heavy", "Academia", "Social Impact"],
    colleges: ["Delhi University", "JNU New Delhi", "Hyderabad University"],
    analysis: "A strong secondary match. Your investigative traits will serve well in research environments.",
  },
  {
    title: "Mechanical Engineering",
    subtitle: "Design Engineer · Manufacturing",
    match: 18,
    rank: "low",
    tags: ["Mismatch", "Low R Score", "Avoid"],
    colleges: [],
    analysis: "With a low Realistic score and preference for social and investigative work, this field would likely feel draining and misaligned with your natural strengths.",
  },
];

const RIASEC_COLORS = {
  R: "#E65100", I: "#1565C0", A: "#6A1B9A",
  S: "#2E7D32", E: "#F57F17", C: "#00695C",
};

const TIMELINE_STEPS = [
  { icon: "✅", status: "done", title: "Profile Created", desc: "Basic info & stream added" },
  { icon: "✅", status: "done", title: "Assessment Completed", desc: "RIASEC code: ISA generated" },
  { icon: "⏳", status: "active", title: "Book Expert Session", desc: "Talk to a career counsellor" },
  { icon: "🔒", status: "locked", title: "Lock Final Career Path", desc: "Commit to your chosen direction" },
];

const TOP_COLLEGES = [
  { name: "NIMHANS Bengaluru", sub: "Clinical Psychology · Government", match: "94%" },
  { name: "TISS Mumbai", sub: "Social Work & Psychology · Deemed", match: "89%" },
  { name: "Christ University", sub: "BSc Psychology · Private", match: "82%" },
  { name: "Presidency College Chennai", sub: "Psychology Honours · Government", match: "77%" },
];

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Dashboard" },
  { id: "careers", icon: "🎯", label: "Career Matches" },
  { id: "colleges", icon: "🏫", label: "College Finder" },
  { id: "profile", icon: "👤", label: "My Profile" },
  { id: "report", icon: "📄", label: "Full Report" },
  { id: "counsellor", icon: "📅", label: "Book Expert", badge: "New" },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function StudentDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const student = MOCK_STUDENT;

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
          <div className="db-avatar">{student.name.charAt(0)}</div>
          <div className="db-student-name">{student.name}</div>
          <div className="db-student-class">{student.class} · {student.city}</div>
          <div className="db-riasec-badge">RIASEC: {student.riasecCode}</div>
        </div>

        <div className="db-progress-wrap" onClick={() => showToast("Complete your profile to reach 100%!")}>
          <div className="db-progress-label">
            <span className="db-progress-text">Profile Strength</span>
            <span className="db-progress-pct">{student.profileComplete}%</span>
          </div>
          <div className="db-progress-bar">
            <div className="db-progress-fill" style={{ width: `${student.profileComplete}%` }} />
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

          <div className="db-nav-divider" />
          <button className="db-nav-item" onClick={() => showToast("Settings coming soon!")}>
            <span className="db-nav-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="db-sidebar-footer">
          {onBack && (
            <button className="db-back-btn" onClick={onBack}>
              ← Back to Secret Sharz
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="db-main">
        {/* Top Bar */}
        <div className="db-topbar">
          <div className="db-topbar-title">{tabTitle}</div>
          <div className="db-topbar-right">
            <div className="db-xp-chip">
              ⚡ {student.xp} XP · {student.level}
            </div>
            <div className="db-notif-btn" onClick={() => showToast("No new notifications")}>🔔</div>
          </div>
        </div>

        {/* Content */}
        <div className="db-content">

          {/* ── HOME TAB ── */}
          {activeTab === "home" && (
            <div className="db-tab">
              <div className="db-welcome">
                <div className="db-welcome-text">
                  <div className="db-welcome-eyebrow">Welcome Back</div>
                  <h1 className="db-welcome-h1">
                    Hey {student.name.split(" ")[0]},<br />
                    your future is <em>taking shape</em>
                  </h1>
                  <p className="db-welcome-p">
                    Your RIASEC code is <strong style={{color:"var(--gold)"}}>{student.riasecCode}</strong>. Clinical Psychology is your 94% match. One expert session away from locking your path.
                  </p>
                </div>
                <div className="db-welcome-action">
                  <button className="db-welcome-btn" onClick={() => setActiveTab("counsellor")}>
                    Book Expert Session →
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="db-stats-grid">
                {[
                  { color: "saffron", icon: "🎯", label: "Clarity Score", value: "7", sub: "out of 10" },
                  { color: "teal", icon: "🧠", label: "Assessment", value: "Done", sub: "RIASEC: ISA" },
                  { color: "lavender", icon: "⚡", label: "Your XP", value: student.xp, sub: student.level },
                  { color: "sage", icon: "📅", label: "Next Session", value: "Book Now", sub: "1-on-1 Expert" },
                ].map((s, i) => (
                  <div key={i} className={`db-stat-card ${s.color}`} onClick={() => s.label === "Next Session" && setActiveTab("counsellor")}>
                    <span className="db-stat-icon">{s.icon}</span>
                    <div className="db-stat-label">{s.label}</div>
                    <div className="db-stat-value">{s.value}</div>
                    <div className="db-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="db-two-col">
                {/* Journey Timeline */}
                <div className="db-card">
                  <div className="db-card-header">
                    <div className="db-card-title">🗺️ Your Journey</div>
                    <span className="db-pill db-pill-blue">2 of 4 done</span>
                  </div>
                  <div className="db-card-body">
                    <div className="db-timeline">
                      {TIMELINE_STEPS.map((step, i) => (
                        <div key={i} className="db-timeline-item">
                          <div className="db-timeline-left">
                            <div className={`db-timeline-dot ${step.status}`}>{step.icon}</div>
                            {i < TIMELINE_STEPS.length - 1 && <div className="db-timeline-line" />}
                          </div>
                          <div className="db-timeline-content">
                            <div className="db-timeline-title" style={{ color: step.status === "locked" ? "var(--muted)" : "var(--ink)" }}>
                              {step.title}
                            </div>
                            <div className="db-timeline-desc">{step.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIASEC Profile */}
                <div className="db-card">
                  <div className="db-card-header">
                    <div className="db-card-title">🧠 RIASEC Profile</div>
                    <span className="db-pill db-pill-purple">Code: {student.riasecCode}</span>
                  </div>
                  <div className="db-card-body">
                    <div className="db-riasec-chart">
                      {Object.entries(student.riasecScores).map(([code, score]) => {
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
                      <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>Your Profile Summary</div>
                      <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: "600", lineHeight: "1.6" }}>
                        You are deeply <strong>Investigative</strong> and <strong>Social</strong> with strong <strong>Artistic</strong> tendencies — the ideal combination for psychology, research, and social sciences.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Colleges */}
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">🏫 Top College Matches</div>
                  <button className="db-btn-outline" onClick={() => setActiveTab("colleges")}>View All →</button>
                </div>
                <div className="db-card-body">
                  <div className="db-college-list">
                    {TOP_COLLEGES.map((c, i) => (
                      <div key={i} className="db-college-item" onClick={() => showToast(`${c.name} — Viewing detailed profile`)}>
                        <div className="db-college-icon">🎓</div>
                        <div>
                          <div className="db-college-name">{c.name}</div>
                          <div className="db-college-sub">{c.sub}</div>
                        </div>
                        <div className="db-college-match">{c.match}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">⚡ Your Next Steps</div>
                </div>
                <div className="db-card-body">
                  <div className="db-steps-grid">
                    {[
                      { num: "01", title: "Book Expert Session", desc: "Schedule a 1-on-1 with a certified career counsellor" },
                      { num: "02", title: "Research NIMHANS", desc: "Explore entrance requirements, curriculum, and placements" },
                      { num: "03", title: "Lock Your Path", desc: "Commit to Clinical Psychology and start your execution plan" },
                    ].map((s, i) => (
                      <div key={i} className="db-step-card">
                        <div className="db-step-num">{s.num}</div>
                        <div className="db-step-title">{s.title}</div>
                        <div className="db-step-desc">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CAREERS TAB ── */}
          {activeTab === "careers" && (
            <div className="db-tab">
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>
                  Based on your RIASEC code <strong style={{ color: "var(--ink)" }}>{student.riasecCode}</strong> and your stated aspiration: <em>"{student.aspiration}"</em>
                </div>
              </div>
              <div className="db-three-col">
                {CAREER_MATCHES.map((career, i) => {
                  const matchClass = career.rank === "best" ? "high" : career.rank === "good" ? "mid" : "low";
                  return (
                    <div key={i} className="db-career-card" onClick={() => showToast(`${career.title} — Detailed view coming soon!`)}>
                      <span className={`db-career-rank ${career.rank}`}>
                        {career.rank === "best" ? "🏆 Best Match" : career.rank === "good" ? "✅ Recommended" : "⚠️ Least Suited"}
                      </span>
                      <div className="db-career-name">{career.title}</div>
                      <div className="db-career-sub">{career.subtitle}</div>

                      <div className="db-match-bar-wrap">
                        <div className="db-match-row">
                          <span className="db-match-label">Profile Match</span>
                          <span className={`db-match-pct ${matchClass}`}>{career.match}%</span>
                        </div>
                        <div className="db-match-bg">
                          <div className={`db-match-fill ${matchClass}`} style={{ width: `${career.match}%` }} />
                        </div>
                      </div>

                      <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6", marginBottom: "12px", fontWeight: "500" }}>
                        {career.analysis}
                      </div>

                      {career.colleges.length > 0 && (
                        <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600", marginBottom: "6px" }}>TOP COLLEGES</div>
                      )}
                      {career.colleges.map((c, j) => (
                        <div key={j} style={{ fontSize: "12px", padding: "4px 0", color: "var(--ink)", fontWeight: "600" }}>→ {c}</div>
                      ))}

                      <div className="db-career-tags">
                        {career.tags.map((t, j) => <span key={j} className="db-career-tag">{t}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── COLLEGES TAB ── */}
          {activeTab === "colleges" && (
            <div className="db-tab">
              <div style={{ marginBottom: "20px", fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>
                Showing colleges matched to your ISA profile and Clinical Psychology path
              </div>
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">🏫 Matched Colleges</div>
                  <span className="db-pill db-pill-green">4 Strong Matches</span>
                </div>
                <div className="db-card-body">
                  <div className="db-college-list">
                    {[
                      { name: "NIMHANS Bengaluru", sub: "Clinical Psychology · Government · NAAC A++", match: "94%", desc: "Premier institute for mental health sciences in India. Highly competitive entrance." },
                      { name: "TISS Mumbai", sub: "Applied Psychology & Social Work · Deemed", match: "89%", desc: "One of India's most prestigious social science institutions. Strong research focus." },
                      { name: "Christ University Bengaluru", sub: "BSc Psychology · Private · NAAC A+", match: "82%", desc: "Excellent campus life, strong placement record, good for local students." },
                      { name: "Presidency College Chennai", sub: "Psychology Honours · Government · NAAC A", match: "77%", desc: "Affordable government institution with a strong legacy in psychology." },
                    ].map((c, i) => (
                      <div key={i} className="db-college-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }} onClick={() => showToast(`${c.name} — Full profile coming soon!`)}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                          <div className="db-college-icon">🎓</div>
                          <div style={{ flex: 1 }}>
                            <div className="db-college-name">{c.name}</div>
                            <div className="db-college-sub">{c.sub}</div>
                          </div>
                          <div className="db-college-match">{c.match}</div>
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "500", paddingLeft: "48px" }}>{c.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="db-tab">
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">👤 Academic Profile</div>
                  <button className="db-btn-outline" onClick={() => setEditingProfile(!editingProfile)}>
                    {editingProfile ? "✕ Cancel" : "✏️ Edit"}
                  </button>
                </div>
                <div className="db-card-body">
                  {editingProfile ? (
                    <div>
                      <div className="db-profile-grid">
                        {[
                          { label: "Full Name", val: student.name },
                          { label: "Class / Level", val: student.class },
                          { label: "City", val: student.city },
                          { label: "Stream", val: student.stream },
                          { label: "Strongest Subject", val: student.strongSubject },
                          { label: "Weakest Subject", val: student.weakSubject },
                        ].map((f, i) => (
                          <div key={i} className="db-profile-field">
                            <div className="db-profile-label">{f.label}</div>
                            <input className="db-profile-input" defaultValue={f.val} />
                          </div>
                        ))}
                      </div>
                      <div className="db-profile-field">
                        <div className="db-profile-label">Career Aspiration</div>
                        <input className="db-profile-input" defaultValue={student.aspiration} style={{ width: "100%" }} />
                      </div>
                      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                        <button className="db-btn" onClick={() => { setEditingProfile(false); showToast("✅ Profile saved successfully!"); }}>
                          💾 Save Changes
                        </button>
                        <button className="db-btn-outline" onClick={() => setEditingProfile(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="db-profile-grid">
                        {[
                          { label: "Full Name", val: student.name },
                          { label: "Class / Level", val: student.class },
                          { label: "City", val: student.city },
                          { label: "Stream", val: student.stream },
                          { label: "Strongest Subject", val: student.strongSubject },
                          { label: "Study Style", val: student.studyStyle },
                        ].map((f, i) => (
                          <div key={i} className="db-profile-field">
                            <div className="db-profile-label">{f.label}</div>
                            <div className="db-profile-value">{f.val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="db-profile-field">
                        <div className="db-profile-label">Career Aspiration</div>
                        <div className="db-profile-value" style={{ color: "var(--saffron)", fontStyle: "italic" }}>{student.aspiration}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">🏅 Achievements & XP</div>
                  <span className="db-pill db-pill-amber">⚡ {student.xp} XP Total</span>
                </div>
                <div className="db-card-body">
                  <div className="db-three-col">
                    {[
                      { icon: "🌱", title: "Profile Created", xp: "+10 XP", done: true },
                      { icon: "🧠", title: "Assessment Done", xp: "+50 XP", done: true },
                      { icon: "📅", title: "Session Booked", xp: "+50 XP", done: false },
                      { icon: "🎓", title: "College Explored", xp: "+20 XP", done: true },
                      { icon: "📝", title: "Full Profile", xp: "+30 XP", done: true },
                      { icon: "🔒", title: "Path Locked", xp: "+100 XP", done: false },
                    ].map((a, i) => (
                      <div key={i} className="db-step-card" style={{ opacity: a.done ? 1 : 0.5 }}>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>{a.icon}</div>
                        <div className="db-step-title">{a.title}</div>
                        <div style={{ color: a.done ? "var(--success)" : "var(--muted)", fontWeight: "700", fontSize: "13px", marginTop: "4px" }}>{a.xp}</div>
                        <div style={{ fontSize: "11px", color: a.done ? "var(--success)" : "var(--muted)", marginTop: "2px" }}>
                          {a.done ? "✅ Earned" : "🔒 Locked"}
                        </div>
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
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title">📄 Full Career Report</div>
                  <button className="db-btn" onClick={() => showToast("📄 PDF export coming soon!")}>Export PDF</button>
                </div>
                <div className="db-card-body">
                  <div style={{ background: "linear-gradient(135deg, var(--ink), #1C2850)", borderRadius: "var(--r-lg)", padding: "32px", marginBottom: "24px", color: "white" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                      RIASEC Career Report — {student.name}
                    </div>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "36px", fontWeight: "700", color: "var(--gold)", marginBottom: "8px" }}>
                      {student.riasecCode}
                    </div>
                    <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", maxWidth: "600px" }}>
                      You are an <strong style={{ color: "white" }}>Investigative Social Artist</strong> — a rare personality combination that thrives in intellectually stimulating environments that allow creative expression and deep human connection. Clinical Psychology, Counselling, and Social Research are your natural domains.
                    </div>
                  </div>

                  <div className="db-two-col">
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)", marginBottom: "12px" }}>✅ Recommended Paths</div>
                      {["Clinical Psychology", "Behavioural Sciences", "Social Work & Counselling", "Educational Psychology"].map((c, i) => (
                        <div key={i} style={{ padding: "10px 14px", background: "#D1FAE5", borderRadius: "var(--r-sm)", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#065F46" }}>
                          → {c}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--ink)", marginBottom: "12px" }}>⚠️ Avoid These Fields</div>
                      {["Mechanical Engineering", "Manufacturing & Operations", "Banking & Finance", "Military Services"].map((c, i) => (
                        <div key={i} style={{ padding: "10px 14px", background: "#FEE2E2", borderRadius: "var(--r-sm)", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#991B1B" }}>
                          ✗ {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: "24px", padding: "24px", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--ink)", marginBottom: "16px" }}>📅 12-Month Execution Plan</div>
                    <div className="db-two-col">
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Recommended Courses</div>
                        {["Introduction to Psychology (Coursera)", "CBT Fundamentals (Online)", "Research Methods & Statistics", "Child Development Studies"].map((c, i) => (
                          <div key={i} style={{ fontSize: "13px", color: "var(--ink)", fontWeight: "600", padding: "4px 0" }}>📚 {c}</div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Entrance Exams to Target</div>
                        {["NIMHANS Entrance Exam", "TISS NET", "CUCET (Psychology)", "Delhi University Entrance Test"].map((e, i) => (
                          <div key={i} style={{ fontSize: "13px", color: "var(--ink)", fontWeight: "600", padding: "4px 0" }}>🎯 {e}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COUNSELLOR TAB ── */}
          {activeTab === "counsellor" && (
            <div className="db-tab">
              <div className="db-two-col">
                <div className="db-card" style={{ marginBottom: 0 }}>
                  <div className="db-card-header">
                    <div className="db-card-title">📅 Book a Session</div>
                  </div>
                  <div className="db-card-body">
                    {[
                      { name: "Dr. Meera Krishnan", spec: "Clinical Psychology · 12 yrs exp", rating: "4.9 ⭐", avail: "Available Today" },
                      { name: "Prof. Arjun Nair", spec: "Career Counselling · 8 yrs exp", rating: "4.8 ⭐", avail: "Tomorrow" },
                      { name: "Ms. Divya Sharma", spec: "Educational Psychology · 6 yrs exp", rating: "4.7 ⭐", avail: "This Week" },
                    ].map((c, i) => (
                      <div key={i} style={{ padding: "16px", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", marginBottom: "12px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--saffron)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                        onClick={() => showToast(`Booking with ${c.name} — Coming soon!`)}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-light))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>👩‍⚕️</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>{c.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>{c.spec}</div>
                          <div style={{ fontSize: "12px", color: "var(--success)", fontWeight: "700", marginTop: "2px" }}>{c.avail} · {c.rating}</div>
                        </div>
                        <button className="db-btn-teal" style={{ padding: "8px 16px", fontSize: "12px" }}>Book</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="db-card" style={{ marginBottom: "20px" }}>
                    <div className="db-card-header">
                      <div className="db-card-title">💡 Why Book a Session?</div>
                    </div>
                    <div className="db-card-body">
                      {["Get personalised advice beyond AI analysis", "Understand which colleges to apply to first", "Get help with entrance exam strategy", "Resolve family pressure & career conflicts", "Lock your final career path with confidence"].map((b, i) => (
                        <div key={i} style={{ fontSize: "13px", color: "var(--ink)", fontWeight: "600", padding: "6px 0", display: "flex", gap: "10px" }}>
                          <span style={{ color: "var(--success)" }}>✓</span> {b}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="db-card">
                    <div className="db-card-header">
                      <div className="db-card-title">🆘 Crisis Support</div>
                    </div>
                    <div className="db-card-body">
                      <div style={{ background: "#FEE2E2", border: "1px solid #FECDD3", borderRadius: "var(--r-sm)", padding: "16px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#991B1B", marginBottom: "6px" }}>Need urgent help?</div>
                        <div style={{ fontSize: "13px", color: "#991B1B", fontWeight: "600" }}>iCall helpline: 9152987821</div>
                        <div style={{ fontSize: "12px", color: "#991B1B", marginTop: "4px" }}>Available 24/7 · Free · Confidential</div>
                      </div>
                      <button className="db-btn" style={{ width: "100%", marginTop: "14px" }} onClick={() => showToast("Connecting to Secret Sharz support...")}>
                        💬 Talk to Someone Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
