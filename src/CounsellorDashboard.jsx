import React, { useState, useEffect, useRef, useMemo } from 'react';
import "./StudentDashboard.css";
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, arrayUnion, collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useDashboard } from './context/DashboardContext';
import ProfileEditor from './ProfileEditor';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900&display=swap');

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
    --gold: #F0A500;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
    --r-sm: 10px;
    --r-md: 16px;
    --r-lg: 20px;
    --r-xl: 28px;
  }

  /* ── ROOT ── */
  .c-root {
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--text-main);
    margin: 0;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── TOP NAV ── */
  .c-topnav {
    background: var(--sidebar-bg);
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 200;
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }
  .c-topnav-brand { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: white; letter-spacing: -0.5px; }
  .c-topnav-brand span { color: var(--gold); font-style: italic; }
  .c-topnav-tabs { display: flex; align-items: center; gap: 4px; }
  .c-topnav-tab {
    background: transparent; border: none; color: rgba(255,255,255,0.5);
    font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 8px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .c-topnav-tab:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); }
  .c-topnav-tab.active { background: rgba(14,165,233,0.25); color: white; }
  .c-topnav-right { display: flex; align-items: center; gap: 10px; }

  /* ── THREE-COLUMN SOCIAL LAYOUT ── */
  .c-social-layout {
    display: grid;
    grid-template-columns: 280px 1fr 300px;
    gap: 20px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px 20px;
    align-items: start;
  }

  /* ── LEFT SIDEBAR — COUNSELLOR PROFILE CARD ── */
  .c-profile-card {
    background: var(--card-bg);
    border-radius: var(--r-xl);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    position: sticky;
    top: 80px;
  }
  .c-profile-banner {
    height: 80px;
    background: linear-gradient(135deg, #0F2027 0%, #1a3a5c 100%);
    position: relative;
  }
  .c-profile-avatar-wrap { position: absolute; bottom: -28px; left: 20px; }
  .c-profile-avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 22px; color: white;
    border: 3px solid white; overflow: hidden;
  }
  .c-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .c-profile-body { padding: 36px 20px 20px; }
  .c-profile-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
  .c-profile-sub { font-size: 12px; color: var(--text-muted); font-weight: 500; margin-bottom: 14px; }

  /* ── EX POINTS BLOCK (Counsellor) ── */
  .c-xp-block {
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    border: 1.5px solid #BFDBFE;
    border-radius: var(--r-md);
    padding: 14px 16px;
    margin-bottom: 14px;
  }
  .c-xp-label { font-size: 10px; font-weight: 800; color: #1E40AF; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
  .c-xp-score { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 900; color: #1E40AF; line-height: 1; margin-bottom: 8px; }
  .c-xp-score span { font-size: 13px; font-weight: 600; color: #3B82F6; }
  .c-xp-bar-wrap { height: 5px; background: rgba(30,64,175,0.12); border-radius: 5px; overflow: hidden; }
  .c-xp-bar-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 5px; transition: width 1s ease; }

  .c-edit-profile-btn {
    width: 100%; padding: 10px;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    color: white; border: none; border-radius: var(--r-sm);
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-bottom: 12px;
  }
  .c-edit-profile-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .c-profile-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .c-profile-kpi { background: var(--bg); border-radius: var(--r-sm); padding: 10px; text-align: center; border: 1px solid var(--border); }
  .c-profile-kpi-val { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--text-main); }
  .c-profile-kpi-lbl { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

  /* ── CENTER FEED ── */
  .c-feed { display: flex; flex-direction: column; gap: 16px; }

  /* ── SOCIAL FEED POST CARD ── */
  .c-post-card {
    background: var(--card-bg); border-radius: var(--r-lg);
    border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);
    overflow: hidden; transition: box-shadow 0.2s;
  }
  .c-post-card:hover { box-shadow: var(--shadow-md); }
  .c-post-header { padding: 16px 20px 12px; display: flex; align-items: center; gap: 12px; }
  .c-post-author-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .c-post-author-name { font-size: 14px; font-weight: 700; color: var(--text-main); }
  .c-post-timestamp { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 1px; }
  .c-post-type-badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; flex-shrink: 0; }
  .c-post-body { padding: 0 20px 16px; }
  .c-post-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; line-height: 1.3; }
  .c-post-text { font-size: 13px; color: var(--text-muted); line-height: 1.7; }
  .c-post-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .c-post-tag { font-size: 11px; font-weight: 600; color: var(--primary); background: var(--primary-light); padding: 3px 10px; border-radius: 20px; }
  .c-post-footer { padding: 12px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .c-post-meta { display: flex; align-items: center; gap: 16px; }
  .c-post-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-muted); font-weight: 600; }

  /* ── RIGHT SIDEBAR ── */
  .c-right-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
  .c-sidebar-widget { background: var(--card-bg); border-radius: var(--r-lg); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; }
  .c-widget-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .c-widget-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 7px; }
  .c-widget-action { font-size: 11px; font-weight: 700; color: var(--primary); cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; }
  .c-widget-body { padding: 14px 18px; }

  /* ── NOTIFICATION ITEMS ── */
  .c-notif-item { padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; gap: 10px; align-items: flex-start; }
  .c-notif-item:last-child { border-bottom: none; padding-bottom: 0; }
  .c-notif-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .c-notif-content { flex: 1; }
  .c-notif-title { font-size: 12px; font-weight: 700; color: var(--text-main); line-height: 1.4; margin-bottom: 2px; }
  .c-notif-msg { font-size: 11px; color: var(--text-muted); line-height: 1.5; }
  .c-notif-time { font-size: 10px; color: var(--text-muted); font-weight: 600; margin-top: 3px; }

  /* ── KPI STRIP ── */
  .c-kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .c-kpi-mini { background: var(--card-bg); border-radius: var(--r-md); padding: 16px; border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); text-align: center; }
  .c-kpi-mini-icon { font-size: 22px; margin-bottom: 8px; display: block; }
  .c-kpi-mini-val { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--text-main); line-height: 1; }
  .c-kpi-mini-lbl { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

  /* ── CARDS ── */
  .c-card {
    background: var(--card-bg); padding: 24px; border-radius: var(--r-lg);
    border: 1px solid var(--border); margin-bottom: 20px;
    box-shadow: var(--shadow-sm); transition: box-shadow 0.2s;
  }
  .c-card:hover { box-shadow: var(--shadow-md); }
  .c-card h3 {
    margin-top: 0; color: var(--text-main); border-bottom: 1px solid var(--border);
    padding-bottom: 12px; font-size: 1rem; font-weight: 700;
    display: flex; justify-content: space-between; align-items: center;
  }

  /* ── GRIDS ── */
  .c-grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
  .c-grid-equal { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* ── FORMS ── */
  .c-form-group { margin-bottom: 16px; }
  .c-form-label { display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .c-form-input, .c-form-select, .c-form-textarea {
    width: 100%; padding: 10px 14px; border: 1.5px solid var(--border);
    border-radius: var(--r-sm); font-size: 0.9rem; color: var(--text-main);
    background: var(--bg); box-sizing: border-box; font-family: 'Inter', sans-serif;
    transition: border-color 0.2s;
  }
  .c-form-input:focus, .c-form-select:focus, .c-form-textarea:focus {
    border-color: var(--primary); outline: none; background: white;
  }

  /* ── BUTTONS ── */
  .c-btn {
    background: var(--primary); color: white; border: none;
    padding: 10px 20px; font-size: 0.875rem; font-weight: 600;
    border-radius: var(--r-sm); cursor: pointer; transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Inter', sans-serif; box-shadow: 0 2px 8px rgba(14,165,233,0.3);
  }
  .c-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .c-btn-outline {
    background: transparent; border: 1.5px solid var(--border);
    color: var(--text-main); padding: 8px 16px; border-radius: var(--r-sm);
    cursor: pointer; font-weight: 600; font-family: 'Inter', sans-serif;
    font-size: 0.875rem; transition: 0.2s;
  }
  .c-btn-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

  /* ── CASE ITEMS ── */
  .c-case-item {
    display: flex; align-items: center; padding: 14px 16px;
    background: var(--bg); border-radius: var(--r-md); margin-bottom: 10px;
    border: 1px solid var(--border); transition: all 0.2s; gap: 12px;
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
    position: fixed; inset: 0; background: rgba(26,31,54,0.6);
    backdrop-filter: blur(6px); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: c-fadeIn 0.2s ease;
  }
  .c-modal {
    background: var(--card-bg); width: 100%; max-width: 800px;
    border-radius: var(--r-lg); border: 1px solid var(--border);
    box-shadow: var(--shadow-lg); overflow: hidden;
    display: flex; flex-direction: column; max-height: 90vh;
  }
  .c-modal-header { padding: 24px 24px 0; background: var(--bg); border-bottom: 1px solid var(--border); position: relative; }
  .c-modal-tabs { display: flex; gap: 4px; margin-top: 16px; }
  .c-modal-tab {
    background: none; border: none; color: var(--text-muted); font-weight: 600;
    padding: 10px 16px; cursor: pointer; border-bottom: 3px solid transparent;
    transition: 0.2s; font-family: 'Inter', sans-serif; font-size: 0.875rem;
  }
  .c-modal-tab:hover { color: var(--text-main); }
  .c-modal-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
  .c-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
  .c-close-btn {
    position: absolute; right: 20px; top: 20px; background: var(--bg);
    border: 1px solid var(--border); color: var(--text-muted);
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1rem; transition: 0.2s;
  }
  .c-close-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* ── EMPTY STATES ── */
  .c-empty { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .c-empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4; }
  .c-empty-premium {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 40px; text-align: center;
  }
  .c-empty-premium-glow {
    width: 96px; height: 96px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-light) 0%, rgba(99,102,241,0.12) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; margin-bottom: 28px;
    box-shadow: 0 0 0 16px rgba(14,165,233,0.06), 0 0 0 32px rgba(14,165,233,0.03);
  }
  .c-empty-premium h2 { font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0 0 10px 0; letter-spacing: -0.3px; }
  .c-empty-premium p { font-size: 0.9rem; color: var(--text-muted); max-width: 380px; line-height: 1.7; margin: 0 0 28px 0; }
  .c-empty-premium-hint {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--bg); border: 1.5px dashed var(--border);
    border-radius: var(--r-md); padding: 12px 20px;
    font-size: 0.8rem; color: var(--text-muted); font-weight: 600;
  }

  /* ── ALERT MODAL ── */
  .c-alert-modal {
    background: var(--card-bg); max-width: 400px; width: 100%;
    border-radius: var(--r-lg); padding: 32px; text-align: center;
    box-shadow: var(--shadow-lg); border: 1px solid var(--border);
  }

  /* ── PORTAL SWITCHER ── */
  .c-portal-switcher { margin: 12px 0; padding: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-md); }
  .c-portal-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; padding: 0 4px; }
  .c-portal-btn {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; background: transparent; border: none;
    border-radius: var(--r-sm); color: rgba(255,255,255,0.5);
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;
    font-family: 'Inter', sans-serif; text-align: left;
  }
  .c-portal-btn:hover { background: rgba(255,255,255,0.07); color: white; }
  .c-portal-btn.current { background: rgba(14,165,233,0.25); color: white; font-weight: 600; }
  .c-portal-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── HEADER BAR ── */
  .c-header-bar { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
  .c-header-bar h1 { margin: 0 0 4px 0; font-size: 1.4rem; font-weight: 700; letter-spacing: -0.5px; }
  .c-header-bar p { margin: 0; color: var(--text-muted); font-size: 0.875rem; }

  @keyframes c-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes c-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .c-tab { animation: c-slideUp 0.35s ease both; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .c-social-layout { grid-template-columns: 240px 1fr 260px; }
  }
  @media (max-width: 900px) {
    .c-social-layout { grid-template-columns: 1fr; }
    .c-profile-card, .c-right-sidebar { position: static; }
    .c-topnav-tabs { display: none; }
    .c-kpi-strip { grid-template-columns: 1fr 1fr; }
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getPostStyle(type) {
  switch (type) {
    case 'platform_update': return { bg: '#EEF2FF', color: '#4F46E5', label: 'Platform Update', avatarBg: '#4F46E5', avatarEmoji: '🚀' };
    case 'blog_post': return { bg: '#F0FDF4', color: '#059669', label: 'Blog Post', avatarBg: '#059669', avatarEmoji: '📚' };
    case 'announcement': return { bg: '#FFF7ED', color: '#EA580C', label: 'Announcement', avatarBg: '#EA580C', avatarEmoji: '📢' };
    default: return { bg: '#F6F8FA', color: '#6B7280', label: 'Post', avatarBg: '#6B7280', avatarEmoji: '📌' };
  }
}

function getNotifColor(priority, isRead) {
  if (isRead) return '#D1D5DB';
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    default: return '#10B981';
  }
}

export default function CounsellorDashboard({ navigate }) {
  // ── Shared context ──────────────────────────────────────────────────────────
  const {
    getStudentsForCounsellor,
    updateStudent,
    addSessionToStudent,
    counsellors,
    userProfile,
    socialFeed,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useDashboard();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [counsellorProfile, setCounsellorProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertModal, setAlertModal] = useState(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [toast, setToast] = useState(null);

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
    studentId: '', type: 'Exploration', note: '',
    nextActionDate: '', homeworkTask: '', counsellingStage: 'Exploration'
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

  // ── Restore session draft ───────────────────────────────────────────────────
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
        setCounsellorProfile({ uid: user.uid, email: user.email, name, photo: user.photoURL });

        const matched = counsellors.find(c => c.email.toLowerCase() === user.email.toLowerCase());
        setMyCounsellorId(matched ? matched.id : user.uid);

        const qBookings = query(collection(db, 'bookings'), where('counsellorId', '==', user.email));
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
  }, [counsellors]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const showAlert = (message, title = 'Notice') => setAlertModal({ title, message });
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

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
    updateStudent(studentId, { priority: newPriority });
    updateDoc(doc(db, 'students', studentId), { priority: newPriority }).catch(console.error);
  };

  const saveSessionNotes = async () => {
    if (!newSession.studentId || !newSession.note) {
      return showAlert('Please select a student and write a session summary.', 'Incomplete Log');
    }
    try {
      const sessionPayload = {
        date: new Date().toISOString(), type: newSession.type, note: newSession.note,
        nextActionDate: newSession.nextActionDate, homeworkTask: newSession.homeworkTask,
        counsellorEmail: counsellorProfile.email
      };
      addSessionToStudent(newSession.studentId, { ...sessionPayload, counsellingStage: newSession.counsellingStage });
      updateStudent(newSession.studentId, { counsellingStage: newSession.counsellingStage });
      await updateDoc(doc(db, 'students', newSession.studentId), {
        counsellingStage: newSession.counsellingStage,
        counsellorNotes: arrayUnion({ id: Date.now(), ...sessionPayload })
      });
      showAlert('Session notes and next actions saved successfully.', 'Log Saved');
      setNewSession({ studentId: '', type: 'Exploration', note: '', nextActionDate: '', homeworkTask: '', counsellingStage: 'Exploration' });
      localStorage.removeItem('sessionDraft');
    } catch (e) {
      console.error(e);
      showAlert('Failed to save notes. Check your permissions.', 'Save Error');
    }
  };

  // ── Chat listener ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeChatStudent && counsellorProfile) {
      const chatId = `${activeChatStudent.id}_${counsellorProfile.email}`;
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
  }, [activeChatStudent, counsellorProfile]);

  const sendChatMessage = async () => {
    if (!activeChatStudent) return showAlert('Select a student to chat with first.', 'Chat Error');
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    try {
      const chatId = `${activeChatStudent.id}_${counsellorProfile.email}`;
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text, senderId: counsellorProfile.email, senderType: 'counsellor', timestamp: serverTimestamp()
      });
    } catch (e) { showAlert('Error sending message.', 'Network Error'); }
  };

  const convertChatToNote = () => {
    if (chatMessages.length === 0) return;
    const summary = chatMessages.map(m => `${m.senderType === 'counsellor' ? 'Me' : 'Student'}: ${String(m.text)}`).join('\n');
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

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // EX Points for counsellor
  const exPoints = Number(userProfile.exPoints || 0);
  const maxXp = 300;
  const xpPct = Math.min(100, Math.round((exPoints / maxXp) * 100));

  // ── Premium empty state ───────────────────────────────────────────────────────
  const PremiumEmptyState = () => (
    <div className="c-empty-premium">
      <div className="c-empty-premium-glow">🎓</div>
      <h2>No Students Assigned Yet</h2>
      <p>You don't have any students assigned to your caseload right now. Once an admin assigns students to you, they'll appear here.</p>
      <div className="c-empty-premium-hint"><span>💡</span>Ask your admin to assign students from the Admin Portal</div>
    </div>
  );

  // ── LEFT SIDEBAR: Counsellor Profile Card ──
  const LeftProfileCard = () => (
    <div className="c-profile-card">
      <div className="c-profile-banner">
        <div className="c-profile-avatar-wrap">
          <div className="c-profile-avatar">
            {userProfile.profilePicture
              ? <img src={userProfile.profilePicture} alt="avatar" />
              : (counsellorProfile?.name ? counsellorProfile.name.charAt(0).toUpperCase() : 'C')
            }
          </div>
        </div>
      </div>
      <div className="c-profile-body">
        <div className="c-profile-name">{counsellorProfile?.name || 'Counsellor'}</div>
        <div className="c-profile-sub">{counsellorProfile?.email || 'Career Counsellor'}</div>

        {/* EX Points Block */}
        <div className="c-xp-block">
          <div className="c-xp-label">⚡ EX Points</div>
          <div className="c-xp-score">{exPoints} <span>/ {maxXp}</span></div>
          <div className="c-xp-bar-wrap">
            <div className="c-xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className="c-edit-profile-btn" onClick={() => setShowProfileEditor(true)}>
          ✏️ Edit Profile
        </button>

        {/* KPIs */}
        <div className="c-profile-kpis">
          <div className="c-profile-kpi">
            <div className="c-profile-kpi-val">{students.length}</div>
            <div className="c-profile-kpi-lbl">Students</div>
          </div>
          <div className="c-profile-kpi">
            <div className="c-profile-kpi-val">{totalSessionsLogged}</div>
            <div className="c-profile-kpi-lbl">Sessions</div>
          </div>
          <div className="c-profile-kpi">
            <div className="c-profile-kpi-val" style={{ color: highPriorityCount > 0 ? '#EF4444' : 'var(--text-main)' }}>{highPriorityCount}</div>
            <div className="c-profile-kpi-lbl">High Priority</div>
          </div>
          <div className="c-profile-kpi">
            <div className="c-profile-kpi-val" style={{ color: '#10B981' }}>{studentsClosed}</div>
            <div className="c-profile-kpi-lbl">Closed</div>
          </div>
        </div>

        {/* Portal Switcher */}
        <div className="c-portal-switcher">
          <div className="c-portal-label">Switch Portal</div>
          {navigate && (
            <button className="c-portal-btn" onClick={() => navigate('/admin')}>
              <span className="c-portal-dot" style={{ background: '#5B6EF5' }} />Admin Portal
            </button>
          )}
          <button className="c-portal-btn current">
            <span className="c-portal-dot" style={{ background: '#0EA5E9' }} />Counsellor Portal
          </button>
          {navigate && (
            <button className="c-portal-btn" onClick={() => navigate('/dashboard')}>
              <span className="c-portal-dot" style={{ background: '#F59E0B' }} />Student Portal
            </button>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{ width: '100%', padding: '9px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
          🚪 Secure Logout
        </button>
      </div>
    </div>
  );

  // ── RIGHT SIDEBAR: Notifications + Quick Actions ──
  const RightSidebar = () => (
    <div className="c-right-sidebar">
      {/* Notifications Widget */}
      <div className="c-sidebar-widget">
        <div className="c-widget-header">
          <div className="c-widget-title">
            🔔 Alerts
            {unreadCount > 0 && (
              <span style={{ background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px' }}>{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="c-widget-action" onClick={() => markAllNotificationsRead()}>Mark all read</button>
          )}
        </div>
        <div className="c-widget-body">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="c-notif-item"
              style={{ cursor: !notif.isRead ? 'pointer' : 'default', opacity: notif.isRead ? 0.65 : 1 }}
              onClick={() => !notif.isRead && markNotificationRead(notif.id)}
            >
              <div className="c-notif-dot" style={{ background: getNotifColor(notif.priority, notif.isRead) }} />
              <div className="c-notif-content">
                <div className="c-notif-title">{String(notif.title)}</div>
                <div className="c-notif-msg">{String(notif.message).substring(0, 80)}{notif.message.length > 80 ? '…' : ''}</div>
                <div className="c-notif-time">{relativeTime(notif.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-Up Alerts Widget */}
      {needsFollowUp.length > 0 && (
        <div className="c-sidebar-widget">
          <div className="c-widget-header">
            <div className="c-widget-title">⚡ Follow-Ups</div>
            <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px' }}>{needsFollowUp.length}</span>
          </div>
          <div className="c-widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {needsFollowUp.slice(0, 4).map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(245,158,11,0.06)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.15)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '12px', color: 'var(--text-main)' }}>{String(s.name || '')}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>14+ days no contact</div>
                </div>
                <button className="c-btn-outline" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => setStudentModal(s)}>View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="c-sidebar-widget">
        <div className="c-widget-header">
          <div className="c-widget-title">⚡ Quick Actions</div>
        </div>
        <div className="c-widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: '🏠', label: 'Overview', tab: 'overview' },
            { icon: '🧠', label: 'Career Intelligence', tab: 'intelligence' },
            { icon: '🎓', label: 'Roster & Priority', tab: 'queue' },
            { icon: '📅', label: 'Session Logger', tab: 'sessions' },
            { icon: '💬', label: 'Messages', tab: 'chat' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: activeTab === item.tab ? '#EFF6FF' : 'var(--bg)', border: `1px solid ${activeTab === item.tab ? '#BFDBFE' : 'var(--border)'}`, borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', color: activeTab === item.tab ? '#1E40AF' : 'var(--text-main)', transition: 'all 0.15s', textAlign: 'left' }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── OVERVIEW TAB ──
  const renderOverview = () => (
    <div className="c-tab">
      <div className="c-header-bar">
        <div>
          <h1>Counsellor Command Centre</h1>
          <p>{currentDate}</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="c-card"><PremiumEmptyState /></div>
      ) : (
        <>
          {/* KPI Strip */}
          <div className="c-kpi-strip" style={{ marginBottom: '20px' }}>
            <div className="c-kpi-mini" style={{ borderTop: '3px solid var(--primary)' }}>
              <span className="c-kpi-mini-icon">🎓</span>
              <div className="c-kpi-mini-val">{students.length}</div>
              <div className="c-kpi-mini-lbl">My Students</div>
            </div>
            <div className="c-kpi-mini" style={{ borderTop: '3px solid var(--danger)' }}>
              <span className="c-kpi-mini-icon">🔴</span>
              <div className="c-kpi-mini-val" style={{ color: highPriorityCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{highPriorityCount}</div>
              <div className="c-kpi-mini-lbl">High Priority</div>
            </div>
            <div className="c-kpi-mini" style={{ borderTop: '3px solid var(--warning)' }}>
              <span className="c-kpi-mini-icon">⚡</span>
              <div className="c-kpi-mini-val" style={{ color: needsFollowUp.length > 0 ? 'var(--warning)' : 'var(--text-main)' }}>{needsFollowUp.length}</div>
              <div className="c-kpi-mini-lbl">Follow-Ups</div>
            </div>
            <div className="c-kpi-mini" style={{ borderTop: '3px solid var(--success)' }}>
              <span className="c-kpi-mini-icon">📋</span>
              <div className="c-kpi-mini-val">{totalSessionsLogged}</div>
              <div className="c-kpi-mini-lbl">Sessions Logged</div>
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
                          <div className="c-case-time">{String(b.date || '')} at {String(b.time || '')}</div>
                          <div className="c-case-name">{String(b.studentName || '')}</div>
                        </div>
                        <span className="c-badge" style={{ background: 'rgba(0,0,0,0.04)', color: statusColor, border: `1px solid ${statusColor}` }}>{String(b.status || '')}</span>
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
              <div className="c-card" style={{ borderTop: '3px solid var(--secondary)' }}>
                <h3>📊 My Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Cases Closed', value: `${studentsClosed} / ${students.length}` },
                    { label: 'Avg Sessions / Student', value: students.length ? (totalSessionsLogged / students.length).toFixed(1) : '0' },
                    { label: 'Pending Bookings', value: pendingBookings, color: pendingBookings > 0 ? 'var(--warning)' : 'var(--success)' },
                  ].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{String(stat.label)}</span>
                      <span style={{ fontWeight: '700', color: stat.color || 'var(--text-main)' }}>{String(stat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Feed Section */}
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', marginTop: '4px' }}>
            📰 Platform Updates
          </div>
          {socialFeed.slice(0, 2).map((post) => {
            const style = getPostStyle(post.type);
            return (
              <div key={post.id} className="c-post-card">
                <div className="c-post-header">
                  <div className="c-post-author-avatar" style={{ background: style.avatarBg, color: 'white' }}>
                    {style.avatarEmoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="c-post-author-name">{String(post.author)}</div>
                    <div className="c-post-timestamp">{relativeTime(post.timestamp)}</div>
                  </div>
                  <div className="c-post-type-badge" style={{ background: style.bg, color: style.color }}>
                    {style.label}
                  </div>
                </div>
                <div className="c-post-body">
                  <div className="c-post-title">{String(post.title)}</div>
                  <div className="c-post-text">{String(post.body)}</div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="c-post-tags">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="c-post-tag">#{String(tag)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="c-post-footer">
                  <div className="c-post-meta">
                    <div className="c-post-meta-item">❤️ <span>{Number(post.likes || 0)}</span></div>
                    <div className="c-post-meta-item">💬 <span>{Number(post.comments || 0)}</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );

  // ── INTELLIGENCE TAB ──
  const renderIntelligence = () => (
    <div className="c-tab">
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
                background: hasAssessment ? 'linear-gradient(135deg, #0F2027 0%, #1a2f4a 60%, #0a2e22 100%)' : 'var(--card-bg)',
                borderRadius: 'var(--r-lg)',
                border: hasAssessment ? '1.5px solid rgba(14,165,233,0.25)' : '1.5px dashed var(--border)',
                padding: '24px 28px', position: 'relative', overflow: 'hidden',
                boxShadow: hasAssessment ? '0 8px 32px rgba(0,0,0,0.15)' : 'var(--shadow-sm)'
              }}>
                {hasAssessment && (
                  <>
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  </>
                )}

                {/* Student header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasAssessment ? '20px' : '0', position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: hasAssessment ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg)', border: hasAssessment ? 'none' : '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', color: hasAssessment ? 'white' : 'var(--text-muted)' }}>
                      {String(student.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: hasAssessment ? 'white' : 'var(--text-main)' }}>{String(student.name || 'Unknown Student')}</div>
                      <div style={{ fontSize: '0.75rem', color: hasAssessment ? 'rgba(255,255,255,0.45)' : 'var(--text-muted)', marginTop: '2px' }}>
                        {String(student.gradeLevel || '')} {student.stream1112 ? `• ${String(student.stream1112)}` : ''}
                      </div>
                    </div>
                  </div>
                  {hasAssessment ? (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Inter', fontSize: '32px', fontWeight: '900', color: '#0EA5E9', lineHeight: '1', letterSpacing: '3px' }}>{String(student.riasecCode || '')}</div>
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
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: '#14B8A6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>📚 Recommended Stream</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', lineHeight: '1.3' }}>
                          {String(student.recommendedStream || student.streamRec?.name || student.stream1112 || 'Pending')}
                        </div>
                        {(student.maturityPct || student.streamRec?.match) && (
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>Match</span>
                              <span style={{ fontSize: '11px', color: '#14B8A6', fontWeight: '800' }}>
                                {student.streamRec?.match ? `${Number(student.streamRec.match)}%` : `${Number(student.maturityPct || 0)}%`}
                              </span>
                            </div>
                            <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${student.streamRec?.match || student.maturityPct || 0}%`, background: 'linear-gradient(90deg, #0A7C6E, #14B8A6)', borderRadius: '3px' }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: '#F59E0B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>🏆 Top Career Match</div>
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

                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: '#A78BFA', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>🎯 More Matches</div>
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

                    {student.riasecSummary && (
                      <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>Profile Summary</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.65' }}>{String(student.riasecSummary)}</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', position: 'relative', zIndex: 1 }}>
                      <button className="c-btn" style={{ padding: '7px 16px', fontSize: '0.8rem' }} onClick={() => setStudentModal(student)}>Open Full File</button>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ✅ Assessed {student.assessmentCompletedAt ? new Date(student.assessmentCompletedAt).toLocaleDateString('en-GB') : ''}
                      </div>
                    </div>
                  </>
                )}

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

  // ── QUEUE TAB ──
  const renderQueue = () => (
    <div className="c-tab">
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
                          <strong style={{ color: 'var(--text-main)' }}>{String(student.name || '')}</strong>
                        </div>
                      </td>
                      <td><span className="c-badge c-badge-neutral">{String(student.counsellingStage || 'Assessment')}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {lastNote?.nextActionDate ? `📅 ${String(lastNote.nextActionDate)}` : 'No plan set'}
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

  // ── SESSIONS TAB ──
  const renderSessions = () => (
    <div className="c-tab">
      <div className="c-header-bar">
        <div>
          <h1>Session Logger</h1>
          <p>Draft notes auto-save locally to protect against accidental page closure.</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="c-card"><PremiumEmptyState /></div>
      ) : (
        <div className="c-grid-equal">
          <div className="c-card" style={{ borderTop: '3px solid var(--primary)' }}>
            <h3>Log Session & Next Steps</h3>
            <div className="c-form-group">
              <label className="c-form-label">Select Student</label>
              <select className="c-form-select" value={newSession.studentId} onChange={(e) => handleSessionChange('studentId', e.target.value)}>
                <option value="">— Select Student —</option>
                {students.map(s => <option key={s.id} value={s.id}>{String(s.name || '')}</option>)}
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
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No sessions logged yet.</p>
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
                      <div className="c-timeline-date">{new Date(note.date).toLocaleDateString('en-GB')} • {String(note.studentName || '')} • {String(note.type || '')}</div>
                      <div className="c-timeline-content">{String(note.note || '')}</div>
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

  // ── CHAT TAB ──
  const renderChat = () => (
    <div className="c-tab">
      <div className="c-header-bar">
        <div>
          <h1>Direct Student Chat</h1>
          <p>Secure two-way communication channel.</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="c-card"><PremiumEmptyState /></div>
      ) : (
        <div className="c-grid-2">
          <div className="c-card" style={{ borderTop: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', height: '60vh', padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                {activeChatStudent ? String(activeChatStudent.name) : 'Select a student →'}
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
                    const isMe = msg.senderId === counsellorProfile?.email;
                    const timeString = msg.timestamp
                      ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '...';
                    return (
                      <div key={idx} className={`c-chat-msg ${isMe ? 'c-msg-me' : 'c-msg-them'}`}>
                        {String(msg.text || '')}
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
                type="text" className="c-form-input" placeholder="Type a message..."
                style={{ margin: 0 }} value={chatInput}
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
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.875rem' }}>{String(s.name || '')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{String(s.counsellingStage || 'Assessment')}</div>
                </div>
                <span style={{ color: activeChatStudent?.id === s.id ? 'var(--primary)' : 'var(--text-muted)', fontSize: '1.1rem' }}>💬</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'intelligence': return renderIntelligence();
      case 'queue': return renderQueue();
      case 'sessions': return renderSessions();
      case 'chat': return renderChat();
      default: return renderOverview();
    }
  };

  // ── Student detail modal ──────────────────────────────────────────────────────
  const renderStudentModal = () => {
    if (!studentModal) return null;
    const stages = ['Assessment', 'Exploration', 'Decision', 'Finalisation'];
    const currentStageIdx = stages.indexOf(studentModal.counsellingStage || 'Assessment');

    // ── Education tier helper ──
    const edu = studentModal.education || {};
    const eduTiers = [
      { key: 'tenth', label: '10th Grade', icon: '🏫' },
      { key: 'twelfth', label: '12th / PUC', icon: '📚' },
      { key: 'graduate', label: 'Graduate', icon: '🎓' },
      { key: 'postGraduate', label: 'Post Graduate', icon: '🏛️' },
    ];

    const renderEduTier = (tierKey, label, icon) => {
      const tier = edu[tierKey];
      if (!tier || (!tier.schoolName && !tier.marksValue && !tier.marksObtained && !(Array.isArray(tier.subjects) && tier.subjects.length > 0))) return null;
      const marksDisplay = (() => {
        if (!tier.marksType || tier.marksType === 'percentage') return tier.marksValue ? `${String(tier.marksValue)}%` : null;
        if (tier.marksType === 'cgpa') return tier.marksValue ? `${String(tier.marksValue)} CGPA` : null;
        if (tier.marksType === 'raw') return (tier.marksObtained && tier.marksMax) ? `${String(tier.marksObtained)} / ${String(tier.marksMax)}` : null;
        return null;
      })();
      const subjectsDisplay = Array.isArray(tier.subjects) && tier.subjects.length > 0
        ? tier.subjects.map(String).join(', ')
        : null;
      return (
        <div key={tierKey} style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '12px 14px', border: '1px solid var(--border)', marginBottom: '8px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{icon}</span> {label}
          </div>
          {tier.schoolName && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '3px' }}>{String(tier.schoolName)}</div>
          )}
          {marksDisplay && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '3px' }}>📊 {marksDisplay}</div>
          )}
          {subjectsDisplay && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📖 {subjectsDisplay}</div>
          )}
        </div>
      );
    };

    const hasAnyEduTier = eduTiers.some(({ key }) => {
      const tier = edu[key];
      return tier && (tier.schoolName || tier.marksValue || tier.marksObtained || (Array.isArray(tier.subjects) && tier.subjects.length > 0));
    });

    // Legacy flat education fields (for students who haven't used the new editor)
    const legacySchool = !hasAnyEduTier && (studentModal.schoolName || edu.schoolName);

    return (
      <div className="c-modal-overlay" onClick={() => setStudentModal(null)}>
        <div className="c-modal" onClick={e => e.stopPropagation()}>
          <div className="c-modal-header">
            <button className="c-close-btn" onClick={() => setStudentModal(null)}>✕</button>

            {/* ── Profile Picture + Name ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '1.3rem', color: 'white',
                border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                overflow: 'hidden',
              }}>
                {studentModal.profilePicture
                  ? <img src={String(studentModal.profilePicture)} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : String(studentModal.name || '?').charAt(0).toUpperCase()
                }
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '700' }}>{String(studentModal.name || '')}</h2>
                <span className={`c-badge ${studentModal.priority === 'high' ? 'c-badge-danger' : studentModal.priority === 'medium' ? 'c-badge-warn' : 'c-badge-success'}`}>
                  {String(studentModal.priority || 'low')} priority
                </span>
              </div>
            </div>

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
              <button className={`c-modal-tab ${studentModalTab === 'profile' ? 'active' : ''}`} onClick={() => setStudentModalTab('profile')}>Student Profile</button>
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
                        <div className="c-timeline-date">{new Date(note.date).toLocaleDateString('en-GB')} • {String(note.type || '')}</div>
                        <div className="c-timeline-content">
                          <p style={{ margin: '0 0 10px 0' }}>{String(note.note || '')}</p>
                          {(note.nextActionDate || note.homeworkTask) && (
                            <div style={{ background: 'rgba(14,165,233,0.06)', padding: '10px', borderRadius: 'var(--r-sm)', borderLeft: '3px solid var(--primary)', fontSize: '0.8rem' }}>
                              <strong style={{ color: 'var(--primary)' }}>Next Steps:</strong><br />
                              {note.nextActionDate && <span>📅 Follow up: {String(note.nextActionDate)}<br /></span>}
                              {note.homeworkTask && <span>📝 Task: {String(note.homeworkTask)}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {studentModalTab === 'profile' && (
              <div>
                {/* Basic Info */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                    📋 Basic Information
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { label: 'Email', value: studentModal.email },
                      { label: 'Grade Level', value: studentModal.gradeLevel },
                      { label: 'Stream', value: studentModal.stream1112 },
                      { label: 'RIASEC Code', value: studentModal.riasecCode },
                    ].map(({ label, value }) => value ? (
                      <div key={label} style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '10px 12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>{String(value)}</div>
                      </div>
                    ) : null)}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                    🎓 Education
                  </div>
                  {edu.highestLevel && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>
                      Highest Level: {String(edu.highestLevel)}
                    </div>
                  )}
                  {hasAnyEduTier
                    ? eduTiers.map(({ key, label, icon }) => renderEduTier(key, label, icon))
                    : legacySchool
                      ? (
                        <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '12px 14px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: '600' }}>{String(legacySchool)}</div>
                          {studentModal.marks10th && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>10th: {String(studentModal.marks10th)}%</div>}
                          {studentModal.marks12th && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>12th: {String(studentModal.marks12th)}%</div>}
                        </div>
                      )
                      : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>No education details provided yet.</div>
                      )
                  }
                </div>

                {/* Interests & Hobbies */}
                {(Array.isArray(studentModal.interests) && studentModal.interests.length > 0) && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      ✨ Interests
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {studentModal.interests.map((interest, i) => (
                        <span key={i} style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                          {String(interest)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(Array.isArray(studentModal.hobbies) && studentModal.hobbies.length > 0) && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      🎯 Hobbies
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {studentModal.hobbies.map((hobby, i) => (
                        <span key={i} style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                          {String(hobby)}
                        </span>
                      ))}
                    </div>
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
    <div className="social-dark-theme">
      <div className="social-dashboard-layout">
        <aside className="social-sidebar">
          <h2 style={{color: '#E4E6EB', fontSize: '24px', marginBottom: '20px'}}>VidyaVantage</h2>
          <ul style={{listStyle: 'none', padding: 0, color: '#E4E6EB', lineHeight: '2.5', fontWeight: 'bold'}}>
            <li style={{ cursor: 'pointer' }}>👥 My Students</li>
            <li style={{ cursor: 'pointer' }}>📅 Schedule</li>
            <li style={{ cursor: 'pointer' }}>📝 Session Notes</li>
          </ul>
        </aside>
        <main className="social-main-content">
          {/* ── HERO HEADER ── */}
          <div className="profile-hero-container">
            <div className="profile-cover-photo">
              <div className="profile-avatar-wrapper">
                <span className="profile-avatar-fallback">
                  C
                </span>
              </div>
            </div>
            <div className="profile-identity-row">
              <div className="profile-name-section">
                <h1>Expert Portal</h1>
                <div className="profile-bio">
                  Guiding students towards their perfect career path.
                </div>
                <div className="profile-pinned-details">
                  <span>📍 Secret Sharz HQ</span>
                  <span>💼 Verified Expert</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-primary-social">📅 View Calendar</button>
              </div>
            </div>
          </div>

          {/* ── EXISTING DASHBOARD CONTENT ── */}
          <div className="c-root">
            {/* ── TOP NAV BAR ── */}
            <nav className="c-topnav">
        <div className="c-topnav-brand">Secret <span>Sharz</span></div>
        <div className="c-topnav-tabs">
          {[
            { id: 'overview', icon: '🏠', label: 'Overview' },
            { id: 'intelligence', icon: '🧠', label: 'Career Intel' },
            { id: 'queue', icon: '🎓', label: 'Roster' },
            { id: 'sessions', icon: '📅', label: 'Sessions' },
            { id: 'chat', icon: '💬', label: 'Messages' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`c-topnav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="c-topnav-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#0EA5E9', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            ⚡ {exPoints} EX
          </div>
          {unreadCount > 0 && (
            <div style={{ background: '#EF4444', color: 'white', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px' }}>
              🔔 {unreadCount}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #0EA5E9', cursor: 'pointer', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', fontWeight: '700', fontSize: '0.9rem' }}
            >
              {counsellorProfile?.name ? counsellorProfile.name.charAt(0).toUpperCase() : 'C'}
            </div>
            {profileOpen && (
              <div style={{ position: 'absolute', right: 0, background: 'white', minWidth: '200px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 100, borderRadius: '16px', border: '1px solid #E4E9F2', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #E4E9F2' }}>
                  <div style={{ fontWeight: '700', color: '#1A1F36', fontSize: '0.9rem' }}>{String(counsellorProfile?.name || '')}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7A99', marginTop: '2px' }}>{String(counsellorProfile?.email || '')}</div>
                </div>
                <button style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', color: '#EF4444', padding: '12px 16px', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' }} onClick={handleLogout}>🚪 Secure Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── THREE-COLUMN SOCIAL LAYOUT ── */}
      <div className="c-social-layout">
        {/* Left: Profile Card */}
        <LeftProfileCard />

        {/* Center: Tab Content */}
        <main>
          {renderActiveTab()}
        </main>

        {/* Right: Intelligence Sidebar */}
        <RightSidebar />
      </div>

      {/* ── ALERT MODAL ── */}
      {alertModal && (
        <div className="c-modal-overlay">
          <div className="c-alert-modal">
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ color: 'var(--danger)', marginTop: 0, marginBottom: '8px' }}>{String(alertModal.title)}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem', lineHeight: '1.6' }}>{String(alertModal.message)}</p>
            <button className="c-btn" style={{ width: '100%' }} onClick={() => setAlertModal(null)}>Acknowledge</button>
          </div>
        </div>
      )}

      {/* ── PROFILE EDITOR MODAL ── */}
      {showProfileEditor && (
        <ProfileEditor
          onClose={() => {
            setShowProfileEditor(false);
            showToast('✅ Profile updated! EX Points recalculated.');
          }}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0F2027', color: 'white', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 9999, animation: 'c-slideUp 0.3s ease forwards' }}>
          🔔 {String(toast)}
        </div>
      )}

      {renderStudentModal()}
          </div>
          {/* ── END EXISTING DASHBOARD CONTENT ── */}
        </main>
      </div>
    </div>
  );
}
