import React, { useState, useEffect, useRef, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { useDashboard } from './context/DashboardContext';

const COLLECTIONS = {
  USERS: 'users',
  INSTITUTIONS: 'institutions',
  SETTINGS: 'system_settings',
  STAFF: 'staff'
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg: #F0F4F8;
    --sidebar-bg: #1A1F36;
    --sidebar-active: #2D3561;
    --card-bg: #FFFFFF;
    --primary: #5B6EF5;
    --primary-light: #EEF0FE;
    --secondary: #0EA5E9;
    --accent: #F43F5E;
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

  .admin-root {
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--text-main);
    margin: 0;
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .admin-sidebar {
    width: 260px;
    background: var(--sidebar-bg);
    border-right: none;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 1000;
    flex-shrink: 0;
    box-shadow: 4px 0 24px rgba(0,0,0,0.15);
  }
  .admin-sidebar::-webkit-scrollbar { width: 4px; }
  .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

  .admin-brand {
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .admin-brand:hover { opacity: 0.85; }
  .admin-brand h2 {
    margin: 0 0 4px 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: white;
    letter-spacing: -0.5px;
  }
  .admin-brand-sub {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .nav-section-label {
    padding: 16px 24px 6px;
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.25);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .nav-btn {
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
    border-radius: 0;
    margin: 1px 0;
  }
  .nav-btn:hover {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.85);
  }
  .nav-btn.active {
    background: rgba(91,110,245,0.2);
    color: white;
    border-left-color: var(--primary);
    font-weight: 600;
  }
  .nav-btn-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

  /* Portal Switcher */
  .portal-switcher {
    margin: 12px 16px;
    padding: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--r-md);
  }
  .portal-switcher-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
    padding: 0 4px;
  }
  .portal-btn {
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
  .portal-btn:hover { background: rgba(255,255,255,0.07); color: white; }
  .portal-btn.current { background: rgba(91,110,245,0.25); color: white; font-weight: 600; }
  .portal-btn-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── MAIN LAYOUT ── */
  .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .top-header {
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
  .top-header-left { display: flex; align-items: center; gap: 12px; }
  .header-actions { display: flex; align-items: center; gap: 12px; }

  .site-link {
    color: var(--secondary);
    text-decoration: none;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: var(--r-sm);
    background: rgba(14,165,233,0.08);
    transition: 0.2s;
    font-size: 0.85rem;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }
  .site-link:hover { background: rgba(14,165,233,0.15); }

  .notify-bell {
    position: relative;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--r-sm);
    transition: 0.2s;
  }
  .notify-bell:hover { background: var(--bg); color: var(--text-main); }
  .notify-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: var(--accent);
    color: white;
    font-size: 0.6rem;
    font-weight: 700;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropdown-content {
    position: absolute;
    right: 0;
    background: var(--card-bg);
    min-width: 220px;
    box-shadow: var(--shadow-lg);
    z-index: 100;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    overflow: hidden;
    margin-top: 8px;
  }
  .dropdown-content button, .dropdown-content .notify-item {
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
  .dropdown-content button:last-child, .dropdown-content .notify-item:last-child { border-bottom: none; }
  .dropdown-content button:hover, .dropdown-content .notify-item:hover {
    background: var(--bg);
    color: var(--primary);
  }
  .avatar-btn {
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
  .avatar-btn:hover { background: var(--primary); color: white; }

  /* ── CONTENT AREA ── */
  .main-content { flex: 1; padding: 28px 32px; overflow-y: auto; }
  .header-bar {
    margin-bottom: 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header-bar h1 { margin: 0 0 4px 0; font-size: 1.5rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.5px; }
  .header-bar p { margin: 0; color: var(--text-muted); font-size: 0.875rem; }

  /* ── CARDS ── */
  .admin-card {
    background: var(--card-bg);
    padding: 24px;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
    overflow-x: auto;
    transition: box-shadow 0.2s;
  }
  .admin-card:hover { box-shadow: var(--shadow-md); }
  .admin-card h3 {
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

  /* ── KPI GRID ── */
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .kpi-box {
    background: var(--card-bg);
    padding: 20px;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
  }
  .kpi-box:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary); }
  .kpi-box h4 { margin: 0 0 8px 0; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  .kpi-box .val { font-size: 1.75rem; font-weight: 800; color: var(--text-main); letter-spacing: -1px; }
  .kpi-box .val-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; font-weight: 500; }

  /* ── GRIDS ── */
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3col { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

  /* ── FORMS ── */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input, .form-select, .form-textarea {
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
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--primary);
    outline: none;
    background: white;
  }

  /* ── BUTTONS ── */
  .admin-btn {
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
    box-shadow: 0 2px 8px rgba(91,110,245,0.3);
  }
  .admin-btn:hover { background: #4A5CE0; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(91,110,245,0.4); }
  .admin-btn-outline {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text-main);
    padding: 9px 18px;
    border-radius: var(--r-sm);
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    transition: 0.2s;
  }
  .admin-btn-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
  .admin-btn-danger {
    background: rgba(239,68,68,0.08);
    color: var(--danger);
    border: 1.5px solid rgba(239,68,68,0.2);
    padding: 7px 12px;
    border-radius: var(--r-sm);
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    transition: 0.2s;
  }
  .admin-btn-danger:hover { background: var(--danger); color: white; }
  .admin-btn-sm {
    background: var(--primary);
    color: white;
    border: none;
    padding: 7px 14px;
    font-size: 0.78rem;
    font-weight: 600;
    border-radius: var(--r-sm);
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }
  .admin-btn-sm:hover { background: #4A5CE0; }
  .admin-btn-sm-outline {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text-muted);
    padding: 6px 12px;
    border-radius: var(--r-sm);
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Inter', sans-serif;
    transition: 0.2s;
    white-space: nowrap;
  }
  .admin-btn-sm-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

  /* ── TABLE ── */
  .data-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.85rem; min-width: 600px; }
  .data-table th, .data-table td { padding: 13px 12px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { color: var(--text-muted); text-transform: uppercase; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; background: var(--bg); }
  .data-table tr.clickable:hover { background: var(--primary-light); cursor: pointer; }

  /* ── BADGES ── */
  .admin-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; letter-spacing: 0.3px; }
  .badge-primary { background: var(--primary-light); color: var(--primary); }
  .badge-warn { background: rgba(245,158,11,0.1); color: var(--warning); border: 1px solid rgba(245,158,11,0.2); }
  .badge-success { background: rgba(16,185,129,0.1); color: var(--success); border: 1px solid rgba(16,185,129,0.2); }
  .badge-danger { background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
  .badge-neutral { background: var(--bg); color: var(--text-muted); border: 1px solid var(--border); }

  /* ── MODALS ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,31,54,0.6);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .modal-content {
    background: var(--card-bg);
    width: 100%;
    max-width: 720px;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
  .modal-header {
    padding: 24px 24px 0;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: relative;
  }
  .modal-tabs { display: flex; gap: 4px; margin-top: 16px; }
  .modal-tab {
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
    border-radius: var(--r-sm) var(--r-sm) 0 0;
  }
  .modal-tab:hover { color: var(--text-main); background: rgba(0,0,0,0.03); }
  .modal-tab.active { color: var(--primary); border-bottom-color: var(--primary); background: white; }
  .close-btn {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
  }
  .close-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }
  .modal-body { padding: 24px; overflow-y: auto; flex: 1; }

  /* ── TIMELINE ── */
  .timeline { border-left: 2px solid var(--border); margin-left: 10px; padding-left: 20px; }
  .timeline-item { margin-bottom: 20px; position: relative; }
  .timeline-dot { position: absolute; left: -27px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid white; box-shadow: 0 0 0 2px var(--primary); }
  .timeline-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }

  /* ── FUNNEL ── */
  .funnel-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg);
    padding: 24px;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    gap: 8px;
  }
  .funnel-step { text-align: center; flex: 1; position: relative; }
  .funnel-step:not(:last-child)::after { content: '→'; position: absolute; right: -12px; top: 30%; color: var(--border); font-size: 1.2rem; }
  .funnel-val { font-size: 2rem; font-weight: 800; color: var(--text-main); letter-spacing: -1px; }
  .funnel-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-top: 4px; }

  /* ── EMPTY STATE ── */
  .empty-state { text-align: center; padding: 48px 20px; color: var(--text-muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.4; }

  /* ── ARRAY ITEMS ── */
  .array-item-card {
    background: var(--bg);
    padding: 16px;
    border-radius: var(--r-sm);
    border: 1px solid var(--border);
    margin-bottom: 12px;
    position: relative;
    transition: border-color 0.2s;
  }
  .array-item-card:hover { border-color: var(--primary); }
  .remove-item-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(239,68,68,0.08);
    border: none;
    color: var(--danger);
    cursor: pointer;
    font-size: 1rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
  }
  .remove-item-btn:hover { background: var(--danger); color: white; }

  /* ── TOAST ── */
  .admin-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 14px 20px;
    border-radius: var(--r-md);
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 9999;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Inter', sans-serif;
  }
  .admin-toast.success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
  .admin-toast.error { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }

  /* ── STUDENT ROSTER CARDS ── */
  .student-roster-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
    margin-top: 4px;
  }
  .student-roster-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 20px;
    box-shadow: var(--shadow-sm);
    transition: all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
  }
  .student-roster-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--primary);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .student-roster-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: rgba(91,110,245,0.25);
  }
  .student-roster-card:hover::before { opacity: 1; }

  .src-top {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 16px;
  }
  .src-avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 800;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1.5px solid rgba(91,110,245,0.2);
  }
  .src-info { flex: 1; min-width: 0; }
  .src-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text-main);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .src-email {
    font-size: 0.78rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .src-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .src-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 14px;
  }
  .src-assign-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .src-assign-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .src-assign-select {
    flex: 1;
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: var(--r-sm);
    font-size: 0.82rem;
    color: var(--text-main);
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s;
    cursor: pointer;
    min-width: 0;
  }
  .src-assign-select:focus {
    border-color: var(--primary);
    outline: none;
    background: white;
  }
  .src-assign-select.assigned {
    border-color: rgba(16,185,129,0.4);
    background: rgba(16,185,129,0.04);
    color: var(--success);
    font-weight: 600;
  }
  .src-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  /* ── COUNSELLOR CHIP ── */
  .counsellor-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px 4px 6px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--success);
  }
  .counsellor-chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
    flex-shrink: 0;
  }
  .unassigned-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px 4px 6px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--danger);
  }

  /* ── COUNSELLOR PANEL ── */
  .counsellor-panel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 4px;
  }
  .counsellor-panel-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 20px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
  }
  .counsellor-panel-card:hover { box-shadow: var(--shadow-md); border-color: rgba(91,110,245,0.2); }
  .cpc-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .cpc-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #7C6EF5);
    color: white; font-weight: 800; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cpc-name { font-weight: 700; font-size: 0.95rem; color: var(--text-main); margin-bottom: 2px; }
  .cpc-title { font-size: 0.78rem; color: var(--text-muted); }
  .cpc-stats { display: flex; gap: 12px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
  .cpc-stat { text-align: center; flex: 1; }
  .cpc-stat-val { font-size: 1.2rem; font-weight: 800; color: var(--text-main); }
  .cpc-stat-label { font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-top: 2px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─────────────────────────────────────────────────────────────────────────────
// INSTITUTIONS TAB — Self-contained component to avoid closure issues
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_INST_FORM = {
  schoolName: '', officialEmail: '', phone: '', address: '',
  maxEducationLevel: '', totalStaff: '', totalStudents: '',
  contact1Name: '', contact1Phone: '',
  contact2Name: '', contact2Phone: '',
  contact3Name: '', contact3Phone: '',
  counsellorName: '', counsellorPhone: '', counsellorEmail: '',
};

function InstitutionsTab({ ctxInstitutions, registerInstitution, setToast }) {
  const [form, setForm] = useState(EMPTY_INST_FORM);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.schoolName.trim()) {
      setToast({ type: 'error', message: 'School Name is required.' });
      return;
    }
    if (!form.totalStudents || isNaN(Number(form.totalStudents))) {
      setToast({ type: 'error', message: 'Total Students must be a valid number.' });
      return;
    }
    setSubmitting(true);
    try {
      registerInstitution(form);
      setForm(EMPTY_INST_FORM);
      setToast({ type: 'success', message: '🏫 Institution registered successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to register institution.' });
    } finally {
      setSubmitting(false);
    }
  };

  const allInstitutions = Array.isArray(ctxInstitutions) ? ctxInstitutions : [];

  return (
    <div className="admin-root">

                  {/* ── SIDEBAR ── */}
                  <div className="admin-sidebar">
                    <div className="admin-brand" onClick={() => setActiveTab('overview')}>
                      <h2>Secret Sharz</h2>
                      <div className="admin-brand-sub">Admin Portal</div>
                    </div>

                    <div className="nav-section-label">Navigation</div>
                    {allowedTabs.map(tab => (
                      <button
                        key={tab.id}
                        className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="nav-btn-icon">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}

                    {/* Portal Switcher */}
                    <div style={{ flex: 1 }} />
                    <div className="portal-switcher">
                      <div className="portal-switcher-label">Switch Portal</div>
                      <button className="portal-btn current">
                        <span className="portal-btn-dot" style={{ background: '#5B6EF5' }} />
                        Admin Portal
                      </button>
                      {navigate && (
                        <button className="portal-btn" onClick={() => navigate('/counsellor')}>
                          <span className="portal-btn-dot" style={{ background: '#10B981' }} />
                          Counsellor Portal
                        </button>
                      )}
                      {navigate && (
                        <button className="portal-btn" onClick={() => navigate('/dashboard')}>
                          <span className="portal-btn-dot" style={{ background: '#F59E0B' }} />
                          Student Portal
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── MAIN ── */}
                  <div className="admin-main">
                    {/* Top Header */}
                    <div className="top-header">
                      <div className="top-header-left">
                        <span className={`admin-badge ${isCounsellor ? 'badge-primary' : 'badge-success'}`}>
                          {profile.role?.replace('_', ' ').toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                          {profile.name || user?.email}
                        </span>
                      </div>

                      <div className="header-actions">
                        {/* Download Button */}
                        <button
                          onClick={downloadStudentData}
                          className="admin-btn-outline"
                          style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                        >
                          📥 Export CSV
                        </button>

                        {/* Notifications */}
                        <div style={{ position: 'relative' }}>
                          <button className="notify-bell" onClick={() => setNotifyOpen(!notifyOpen)}>
                            🔔
                            {notifications.length > 0 && <div className="notify-badge">{notifications.length}</div>}
                          </button>
                          {notifyOpen && (
                            <div className="dropdown-content" style={{ width: '300px' }}>
                              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                Notifications
                              </div>
                              {notifications.length === 0 ? (
                                <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No new alerts</div>
                              ) : (
                                notifications.map(n => (
                                  <button key={n.id} className="notify-item" style={{ color: n.type === 'warning' ? 'var(--warning)' : 'var(--success)' }}>
                                    {n.type === 'warning' ? '⚠️' : '✅'} {n.text}
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>

                        <button onClick={onBackToApp} className="site-link">🌐 Live Site</button>

                        <div style={{ position: 'relative' }}>
                          <div className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                            {(profile.name || 'A').charAt(0).toUpperCase()}
                          </div>
                          {profileOpen && (
                            <div className="dropdown-content">
                              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>{profile.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</div>
                              </div>
                              <button onClick={() => { setProfileOpen(false); setActiveTab('profile'); }}>👤 My Profile</button>
                              <button style={{ color: 'var(--danger)' }} onClick={handleLogout}>🚪 Sign Out</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="main-content">
                      {renderTabContent()}
                    </div>
                  </div>

        {/* ── TOAST NOTIFICATIONS ── */}
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}

        {/* ── STUDENT DETAIL MODAL ── */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '40px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {selectedStudent.name || 'Unknown Student'}
                      {selectedStudent.hasAcceptedTerms ? (
                        <span style={{ background: '#4CAF50', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>✓ Consent Granted</span>
                      ) : (
                        <span style={{ background: '#f44336', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Pending Consent</span>
                      )}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{selectedStudent.email}</p>
                  </div>
                  <span className="admin-badge badge-primary" style={{ fontSize: '1.2rem', padding: '6px 12px' }}>{selectedStudent.riasecCode || 'N/A'}</span>
                </div>
                <div className="modal-tabs">
                  <button className={`modal-tab ${modalTab === 'overview' ? 'active' : ''}`} onClick={() => setModalTab('overview')}>Overview</button>
                  <button className={`modal-tab ${modalTab === 'counselling' ? 'active' : ''}`} onClick={() => setModalTab('counselling')}>Counselling</button>
                </div>
              </div>
              
              <div className="modal-body">
                {modalTab === 'overview' && (
                  <div>
                    <div className="admin-card" style={{ marginBottom: '20px', borderTop: '3px solid var(--primary)' }}>
                      <h3>Personal Information</h3>
                      <p style={{ marginBottom: '15px' }}><strong>Bio:</strong> {selectedStudent.bio || 'No bio provided'}</p>
                      <div className="grid-2col" style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                        <div><strong>Father:</strong> {selectedStudent.fatherName || '—'} <br/><span style={{ color: 'var(--text-muted)' }}>{selectedStudent.fatherPhone || '—'}</span></div>
                        <div><strong>Mother:</strong> {selectedStudent.motherName || '—'} <br/><span style={{ color: 'var(--text-muted)' }}>{selectedStudent.motherPhone || '—'}</span></div>
                        <div><strong>Location:</strong> {selectedStudent.location || '—'}</div>
                        <div><strong>Hometown:</strong> {selectedStudent.hometown || '—'}</div>
                      </div>
                    </div>
                    
                    <div className="admin-card" style={{ borderTop: '3px solid var(--warning)' }}>
                      <h3>Hobbies & Interests</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                          { label: '🎨 Hobbies', data: selectedStudent.hobbies },
                          { label: '🎵 Music', data: selectedStudent.music },
                          { label: '📺 TV Shows', data: selectedStudent.tvShows },
                          { label: '🎬 Movies', data: selectedStudent.movies },
                          { label: '🎮 Games', data: selectedStudent.games },
                          { label: '⚽ Sports', data: selectedStudent.sports },
                          { label: '🏅 Athletes', data: selectedStudent.athletes }
                        ].map((cat, idx) => (
                          <div key={idx}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '5px' }}>{cat.label}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {Array.isArray(cat.data) && cat.data.length > 0 ? (
                                cat.data.map((item, i) => (
                                  <span key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{item}</span>
                                ))
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>None listed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="admin-card" style={{ borderTop: '3px solid var(--secondary)', marginTop: '20px' }}>
                      <h3>🕸️ Life Skills Matrix</h3>
                      {selectedStudent.lifeSkills ? (
                        <div className="grid-2col" style={{ alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['communication', 'resilience', 'criticalThinking', 'empathy', 'leadership'].map(skill => (
                              <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                <span style={{ textTransform: 'capitalize' }}>{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span style={{ color: 'var(--primary)' }}>{selectedStudent.lifeSkills[skill] || 0} / 100</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <SkillRadarChart skills={selectedStudent.lifeSkills} />
                          </div>
                        </div>
                      ) : (
                        <div className="empty-state" style={{ padding: '20px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>Student has not completed the Life Skills Matrix yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {modalTab === 'counselling' && (
                  <>
                    <div className="admin-card" style={{ borderTop: '3px solid var(--success)' }}>
                      <h3>Counselling Notes</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Session logging interface goes here.</p>
                    </div>

                    <div className="admin-card" style={{ borderTop: '3px solid var(--primary)', marginTop: '20px' }}>
                      <h3>📓 Student's Clarity Journal</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Private entries logged by the student for counselor review.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {selectedStudent.journalEntries && selectedStudent.journalEntries.length > 0 ? (
                          selectedStudent.journalEntries.map((entry, idx) => (
                            <div key={idx} style={{ background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '8px' }}>
                                {new Date(entry.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{entry.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state" style={{ padding: '20px' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>No journal entries logged yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="admin-card" style={{ borderTop: '3px solid var(--secondary)', marginTop: '20px' }}>
                      <h3>🗺️ Student's Career Roadmap</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Read-only view of the student's execution plan and progress.</p>
                      
                      {selectedStudent.roadmapTasks && selectedStudent.roadmapTasks.length > 0 ? (
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                          {['todo', 'doing', 'done'].map(column => (
                            <div key={column} style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
                              <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                                {column === 'todo' ? '📝 To Do' : column === 'doing' ? '⏳ Doing' : '✅ Done'}
                                <span style={{ float: 'right', background: 'var(--bg)', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' }}>
                                  {selectedStudent.roadmapTasks.filter(t => t.status === column).length}
                                </span>
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedStudent.roadmapTasks.filter(t => t.status === column).map(task => (
                                  <div key={task.id} style={{ background: 'var(--bg)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    {task.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state" style={{ padding: '20px' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>Student has not added any tasks to their roadmap yet.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

// ── STUDENT DETAIL MODAL + TOAST are inside the return above ──
// (moved inside the social-dark-theme wrapper)

