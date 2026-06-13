import React, { useState, useEffect, useRef } from "react";
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import CareerAssessment from "./CareerAssessment";
import ProfileEditor from "./ProfileEditor";
import CareerDashboardView from "./components/CareerDashboardView";
import ChatWidget from "./components/ChatWidget";
import { useDashboard } from "./context/DashboardContext";
import XpChecklistModal from "./components/XpChecklistModal";
import CareerMatchesModal from "./components/CareerMatchesModal";
import { SCHOOLS, COLLEGES, INTERESTS, HOBBIES, TV_SHOWS, MOVIES, GAMES, SPORTS } from "./data/platformData";
import * as platformData from './data/platformData';
import ClinicalIntakeModal from "./components/ClinicalIntakeModal";
import CareerMatches from "./components/vidyavantage/CareerMatches";
import CareerRoadmap from "./components/vidyavantage/CareerRoadmap";
import CollegeShortlist from "./components/vidyavantage/CollegeShortlist";
import CollegeExplorer from "./components/vidyavantage/CollegeExplorer";
import StudentProfileView from "./components/vidyavantage/StudentProfileView";
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
  --transition-base: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── SOCIAL LAYOUT ROOT ── */
.db-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #F0F4F8; min-height: 100vh; color: var(--ink); overflow-x: hidden; }

/* ── TOP NAV BAR ── */
.db-topnav { background: var(--ink); height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 200; box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
.db-topnav-logo { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: white; letter-spacing: -0.5px; transition: opacity 0.2s; }
.db-topnav-logo:hover { opacity: 0.85; }
.db-topnav-logo span { color: var(--gold); font-style: italic; }

/* ── FLOATING PILL NAV ── */
.db-topnav-tabs {
  display: flex; align-items: center; gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 50px;
  padding: 4px 6px;
  border: 1px solid rgba(255,255,255,0.1);
}
.db-topnav-tab {
  background: transparent; border: none;
  color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 600;
  padding: 7px 14px; border-radius: 50px;
  cursor: pointer; font-family: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
}
.db-topnav-tab:hover {
  background: #F3F4F6;
  color: var(--ink);
  transform: translateY(-2px);
}
.db-topnav-tab.active {
  background: linear-gradient(135deg, #111827, #374151);
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.db-topnav-badge { background: var(--saffron); color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 8px; }
.db-topnav-right { display: flex; align-items: center; gap: 10px; }

/* ── THREE-COLUMN SOCIAL LAYOUT ── */
.db-social-layout { display: grid; grid-template-columns: 280px 1fr 300px; gap: 20px; width: 100%; max-width: 1600px; margin: 0 auto; padding: 24px 32px; align-items: start; }

/* ── LEFT SIDEBAR — PROFILE CARD ── */
.db-profile-card { background: white; border-radius: var(--r-xl); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; position: sticky; top: 80px; }
.db-profile-banner { height: 80px; background: linear-gradient(135deg, var(--ink) 0%, #1C2850 100%); position: relative; }
.db-profile-avatar-wrap { position: absolute; bottom: -28px; left: 20px; }
.db-profile-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--gold)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: white; border: 3px solid white; text-transform: uppercase; overflow: hidden; }
.db-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.db-profile-body { padding: 36px 20px 20px; }
.db-profile-name { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.db-profile-sub { font-size: 12px; color: var(--muted); font-weight: 500; margin-bottom: 14px; }
.db-profile-riasec { display: inline-block; background: rgba(240,165,0,0.12); border: 1px solid rgba(240,165,0,0.3); color: #92400E; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; letter-spacing: 1.5px; margin-bottom: 16px; }

/* ── EX POINTS BLOCK ── */
.db-xp-block { background: linear-gradient(135deg, #FFFBEB, #FEF3C7); border: 1.5px solid #FDE68A; border-radius: var(--r-md); padding: 14px 16px; margin-bottom: 14px; }
.db-xp-label { font-size: 10px; font-weight: 800; color: #92400E; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
.db-xp-score { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 900; color: #92400E; line-height: 1; margin-bottom: 8px; }
.db-xp-score span { font-size: 14px; font-weight: 600; color: #B45309; }
.db-xp-bar-wrap { height: 6px; background: rgba(146,64,14,0.15); border-radius: 6px; overflow: hidden; }
.db-xp-bar-fill { height: 100%; background: linear-gradient(90deg, var(--saffron), var(--gold)); border-radius: 6px; transition: width 1s ease; }
.db-xp-level { display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: #B45309; font-weight: 600; }

.db-edit-profile-btn { width: 100%; padding: 10px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; border: none; border-radius: var(--r-sm); font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 12px; }
.db-edit-profile-btn:hover { opacity: 0.9; transform: translateY(-1px); }

.db-profile-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.db-profile-stat { background: var(--surface); border-radius: var(--r-sm); padding: 10px; text-align: center; border: 1px solid var(--border); }
.db-profile-stat-val { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--ink); }
.db-profile-stat-lbl { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

/* ── PARENT MODE TOGGLE ── */
.db-parent-toggle { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1.5px solid var(--border); padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; cursor: pointer; color: var(--muted); transition: all 0.2s; font-family: inherit; }
.db-parent-toggle.active { background: #E0E7FF; border-color: #93C5FD; color: #1E40AF; }
.db-parent-toggle-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); }
.db-parent-toggle.active .db-parent-toggle-dot { background: #2563EB; }

/* ── CENTER FEED ── */
.db-feed { display: flex; flex-direction: column; gap: 16px; }

/* ── WELCOME BANNER ── */
.db-welcome { background: linear-gradient(135deg, var(--ink) 0%, #1C2850 100%); border-radius: var(--r-xl); padding: 28px 32px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.db-welcome-text { position: relative; z-index: 1; }
.db-welcome-eyebrow { font-size: 10px; font-weight: 700; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.db-welcome-h1 { font-family: 'Fraunces', serif; font-size: clamp(20px, 2.5vw, 28px); font-weight: 700; color: white; line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 8px; }
.db-welcome-h1 em { font-style: italic; color: var(--gold); }
.db-welcome-p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 400px; }
.db-welcome-action { position: relative; z-index: 1; flex-shrink: 0; }

/* ── BUTTONS ── */
.db-welcome-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 12px 24px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 6px 20px rgba(232,101,10,0.35); transition: all 0.2s; white-space: nowrap; }
.db-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 10px 20px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 4px 14px rgba(232,101,10,0.3); transition: all 0.2s; }
.db-btn-outline { background: white; color: var(--saffron); border: 1.5px solid var(--saffron); padding: 9px 18px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.db-btn-ghost { background: transparent; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.15); padding: 9px 18px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }

/* ── SOCIAL FEED POST CARD ── */
.db-post-card { background: white; border-radius: var(--r-lg); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; transition: var(--transition-base); }
.db-post-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: rgba(14,165,233,0.2); }
.db-post-header { padding: 16px 20px 12px; display: flex; align-items: center; gap: 12px; }
.db-post-author-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.db-post-author-info { flex: 1; }
.db-post-author-name { font-size: 14px; font-weight: 700; color: var(--ink); }
.db-post-timestamp { font-size: 11px; color: var(--muted); font-weight: 500; margin-top: 1px; }
.db-post-type-badge { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; flex-shrink: 0; }
.db-post-body { padding: 0 20px 16px; }
.db-post-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 8px; line-height: 1.3; }
.db-post-text { font-size: 13px; color: var(--muted); line-height: 1.7; }
.db-post-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.db-post-tag { font-size: 11px; font-weight: 600; color: var(--sky); background: #E0F2FE; padding: 3px 10px; border-radius: 20px; }
.db-post-footer { padding: 12px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.db-post-meta { display: flex; align-items: center; gap: 16px; }
.db-post-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); font-weight: 600; }

/* ── CAREER INTELLIGENCE CARD (in feed) ── */
.db-intel-card { background: linear-gradient(135deg, #0D1117 0%, #1C2850 60%, #0A3D2E 100%); border-radius: var(--r-xl); padding: 28px 32px; position: relative; overflow: hidden; border: 1.5px solid rgba(240,165,0,0.2); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
.db-intel-eyebrow { font-size: 10px; font-weight: 800; color: var(--gold); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
.db-intel-title { font-family: 'Fraunces', serif; font-size: clamp(18px, 2vw, 24px); font-weight: 700; color: white; line-height: 1.2; }
.db-intel-code { font-family: 'Fraunces', serif; font-size: 44px; font-weight: 900; color: var(--gold); line-height: 1; letter-spacing: 4px; }
.db-intel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 20px; }
.db-intel-col { background: rgba(255,255,255,0.05); border-radius: var(--r-md); padding: 14px; border: 1px solid rgba(255,255,255,0.08); }
.db-intel-col-label { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
.db-intel-col-value { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: white; line-height: 1.3; }
.db-intel-mini-bar { height: 3px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-top: 8px; }
.db-intel-mini-fill { height: 100%; border-radius: 3px; }
.db-intel-summary { margin-top: 16px; padding: 14px 16px; background: rgba(255,255,255,0.04); border-radius: var(--r-md); border: 1px solid rgba(255,255,255,0.07); font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.7; }
.db-intel-actions { display: flex; gap: 10px; margin-top: 16px; }

/* ── STATS STRIP ── */
.db-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.db-stat-mini { background: white; border-radius: var(--r-md); padding: 16px; border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); text-align: center; transition: var(--transition-base); }
.db-stat-mini:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: rgba(232,101,10,0.25); }
.db-stat-mini-icon { font-size: 22px; margin-bottom: 8px; display: block; }
.db-stat-mini-val { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); line-height: 1; }
.db-stat-mini-lbl { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

/* ── RIGHT SIDEBAR ── */
.db-right-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
.db-sidebar-widget { background: white; border-radius: var(--r-lg); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; }
.db-widget-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.db-widget-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 7px; }
.db-widget-action { font-size: 11px; font-weight: 700; color: var(--sky); cursor: pointer; background: none; border: none; font-family: inherit; }
.db-widget-body { padding: 14px 18px; }

/* ── NOTIFICATION ITEMS ── */
.db-notif-item { padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; gap: 10px; align-items: flex-start; }
.db-notif-item:last-child { border-bottom: none; padding-bottom: 0; }
.db-notif-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.db-notif-content { flex: 1; }
.db-notif-title { font-size: 12px; font-weight: 700; color: var(--ink); line-height: 1.4; margin-bottom: 2px; }
.db-notif-msg { font-size: 11px; color: var(--muted); line-height: 1.5; }
.db-notif-time { font-size: 10px; color: var(--muted); font-weight: 600; margin-top: 3px; }

/* ── CAREER CARDS (careers tab) ── */
.db-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
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
.db-explain-box { background: var(--surface); border-radius: var(--r-sm); padding: 12px; margin-top: auto; }
.db-explain-item { font-size: 12px; font-weight: 600; margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px; }
.db-explain-icon { flex-shrink: 0; }
.db-parent-metric { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 8px 0; font-size: 13px; }
.db-parent-metric:last-child { border-bottom: none; padding-bottom: 0; }

/* ── COMPARE GRID ── */
.db-compare-grid { display: grid; grid-template-columns: 200px 1fr 1fr 1fr; gap: 0; background: white; border-radius: var(--r-md); border: 1.5px solid var(--border); overflow: hidden; }
.db-compare-header { background: var(--surface); font-weight: 700; padding: 16px; font-size: 14px; border-bottom: 1.5px solid var(--border); border-right: 1px solid var(--border); }
.db-compare-cell { padding: 16px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--ink); }

/* ── COLLEGES ── */
.db-college-ext { background: white; border: 1.5px solid var(--border); border-radius: var(--r-md); padding: 20px; display: flex; gap: 16px; margin-bottom: 16px; }
.db-college-ext-main { flex: 1; }
.db-college-stats { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
.db-college-stat-pill { background: var(--surface); padding: 5px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--ink-soft); }
.db-avatar-sm { width: 44px; height: 44px; border-radius: 10px; background: var(--surface); color: var(--ink); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }

/* ── GROWTH ── */
.db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.db-card { background: white; border-radius: var(--r-lg); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }
.db-card-header { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.db-card-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 8px; }
.db-card-body { padding: 22px; }
.db-skill-row { margin-bottom: 12px; }
.db-video-ph { background: var(--ink); border-radius: var(--r-md); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; position: relative; overflow: hidden; }
.db-video-play { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; backdrop-filter: blur(4px); }

/* ── STREAM BOX ── */
.db-stream-box { background: #F0FDF4; border: 1px solid #A7F3D0; border-radius: var(--r-md); padding: 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }

/* ── CONFUSION BANNER ── */
.db-confusion-banner { background: #EEF2FF; border: 1px dashed #A5B4FC; border-radius: var(--r-md); padding: 20px; text-align: center; margin-top: 20px; }

/* ── EMPTY STATE ── */
.db-empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: var(--r-lg); border: 1.5px dashed var(--border); }
.db-pill { display: inline-block; padding: 5px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; }

/* ── PROFILE FORM MODAL ── */
.db-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.db-modal-box { background: white; border-radius: var(--r-xl); max-width: 600px; width: 100%; max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); }

/* ── TOAST ── */
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.db-tab { animation: fadeSlideUp 0.4s ease both; }
.db-toast { position: fixed; bottom: 24px; right: 24px; background: var(--ink); color: white; padding: 12px 24px; border-radius: var(--r-md); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; box-shadow: var(--shadow-lg); z-index: 9999; animation: fadeSlideUp 0.3s ease forwards; }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .db-social-layout { grid-template-columns: 240px 1fr 260px; }
}
@media (max-width: 900px) {
  .db-social-layout { grid-template-columns: 1fr; }
  .db-profile-card, .db-right-sidebar { position: static; }
  .db-topnav-tabs { display: none; }
  .db-intel-grid { grid-template-columns: 1fr; }
  .db-three-col { grid-template-columns: 1fr; }
  .db-stats-strip { grid-template-columns: 1fr 1fr; }
}
`;

const ADVISORY_MESSAGES = [
  "Answer with full concentration; your first instinct is usually the most accurate.",
  "Please find a quiet space. Deep focus yields the most accurate career map.",
  "Don't overthink! Answer honestly based on who you are, not who others want you to be.",
  "This is not a test to pass or fail. It's a mirror reflecting your true potential.",
  "Changing your answers to 'game the system' will only result in a mismatched career report."
];

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "careers", icon: "🎯", label: "Careers" },
  { id: "compare", icon: "⚖️", label: "Compare", badge: "Hot" },
  { id: "colleges", icon: "🏫", label: "Colleges" },
  { id: "growth", icon: "📈", label: "Growth" },
  { id: "report", icon: "📄", label: "Report" },
  { id: "counsellor", icon: "📅", label: "Book Expert" },
];

// Helper: format relative time
function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Helper: post type styling
function getPostStyle(type) {
  switch (type) {
    case 'platform_update': return { bg: '#EEF2FF', color: '#4F46E5', label: 'Platform Update', avatarBg: '#4F46E5', avatarEmoji: '🚀' };
    case 'blog_post': return { bg: '#F0FDF4', color: '#059669', label: 'Blog Post', avatarBg: '#059669', avatarEmoji: '📚' };
    case 'announcement': return { bg: '#FFF7ED', color: '#EA580C', label: 'Announcement', avatarBg: '#EA580C', avatarEmoji: '📢' };
    default: return { bg: '#F6F8FA', color: '#6B7280', label: 'Post', avatarBg: '#6B7280', avatarEmoji: '📌' };
  }
}

// Helper: notification priority color
function getNotifColor(priority, isRead) {
  if (isRead) return '#D1D5DB';
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    default: return '#10B981';
  }
}

const SkillRadarChart = ({ skills }) => {
  const max = 100; const size = 240; const center = size / 2; const radius = size / 2 - 30;
  const categories = ['communication', 'resilience', 'criticalThinking', 'empathy', 'leadership'];
  const labels = ['Communication', 'Resilience', 'Critical Thinking', 'Empathy', 'Leadership'];
  const angleStep = (Math.PI * 2) / categories.length;
  const getPoint = (value, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (value / max) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };
  const points = categories.map((cat, i) => getPoint(skills[cat] || 0, i)).join(' ');
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {[20, 40, 60, 80, 100].map(level => (
        <polygon key={level} points={categories.map((_, i) => getPoint(level, i)).join(' ')} fill="none" stroke="rgba(255,255,255,0.05)" />
      ))}
      {categories.map((cat, i) => {
        const end = getPoint(100, i);
        const labelPoint = getPoint(120, i);
        return (
          <g key={cat}>
            <line x1={center} y1={center} x2={end.split(',')[0]} y2={end.split(',')[1]} stroke="rgba(255,255,255,0.1)" />
            <text x={labelPoint.split(',')[0]} y={labelPoint.split(',')[1]} fill="var(--text-muted)" fontSize="10" textAnchor="middle" alignmentBaseline="middle">{labels[i]}</text>
          </g>
        );
      })}
      <polygon points={points} fill="rgba(91,110,245,0.3)" stroke="var(--primary)" strokeWidth="2" />
      {categories.map((cat, i) => {
        const pt = getPoint(skills[cat] || 0, i);
        return <circle key={`c-${cat}`} cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="4" fill="var(--primary)" />;
      })}
    </svg>
  );
};

export default function StudentDashboard({ user, userData, initialTab = "home", onBack, onLogout }) {
  const { userProfile, socialFeed, notifications, markNotificationRead, markAllNotificationsRead, incrementSessions, submitBooking, updateUserProfile } = useDashboard();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [userTrack, setUserTrack] = useState('hybrid');
  const [showClinicalIntake, setShowClinicalIntake] = useState(false);

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (userTrack === 'counselling' && ['careers', 'compare', 'colleges', 'growth', 'report'].includes(item.id)) return false;
    if (userTrack === 'career' && item.id === 'counsellor') return false;
    return true;
  });
  const [isParentMode, setIsParentMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [advisoryMsg, setAdvisoryMsg] = useState("");
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [localUserData, setLocalUserData] = useState(userData || {});
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // ── Photo edit popup state ──
  const [photoPopup, setPhotoPopup] = useState(null); // 'cover' | 'avatar' | null
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const coverPhotoInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const photoPopupRef = useRef(null);
  const [profileData, setProfileData] = useState({
    age: '', gender: '', schoolName: '', gradeLevel: '',
    marks10th: '', marks11th: '', stream1112: '', marks12th: '',
    ugCourse: '', ugCGPA: '', pgCourse: '', pgCGPA: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [lifeSkills, setLifeSkills] = useState({ communication: 0, resilience: 0, criticalThinking: 0, empathy: 0, leadership: 0 });
  // ── Modal state for XP Checklist and Career Matches ──
  const [showXpModal, setShowXpModal] = useState(false);
  const [showCareerMatchesModal, setShowCareerMatchesModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [journalEntries, setJournalEntries] = useState([]);
  const [newJournalEntry, setNewJournalEntry] = useState('');
  const [roadmapTasks, setRoadmapTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  const addRoadmapTask = (e) => {
    if (e.key === 'Enter' && newTaskText.trim() !== '') {
      e.preventDefault();
      setRoadmapTasks([...roadmapTasks, { id: Date.now().toString(), text: newTaskText.trim(), status: 'todo' }]);
      setNewTaskText('');
    }
  };
  const handleDragStart = (e, taskId) => { e.dataTransfer.setData('taskId', taskId); };
  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    setRoadmapTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };
  const removeTask = (taskId) => {
    setRoadmapTasks(prev => prev.filter(t => t.id !== taskId));
  };
  const [activeChat, setActiveChat] = useState(null);
  const [internships, setInternships] = useState([]);
  const [voluntaryExp, setVoluntaryExp] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);

  // Projects form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Internships form state
  const [internCompany, setInternCompany] = useState('');
  const [internRole, setInternRole] = useState('');
  const [internFrom, setInternFrom] = useState('');
  const [internTo, setInternTo] = useState('');
  const [internCurrent, setInternCurrent] = useState(false);
  const [internCity, setInternCity] = useState('');
  const [internDuties, setInternDuties] = useState('');
  const [internResponsibilities, setInternResponsibilities] = useState('');

  // Voluntary experience form state
  const [volunteerOrg, setVolunteerOrg] = useState('');
  const [volunteerRole, setVolunteerRole] = useState('');
  const [volunteerFrom, setVolunteerFrom] = useState('');
  const [volunteerTo, setVolunteerTo] = useState('');
  const [volunteerCurrent, setVolunteerCurrent] = useState(false);
  const [volunteerCity, setVolunteerCity] = useState('');
  const [volunteerDuties, setVolunteerDuties] = useState('');
  const [volunteerResponsibilities, setVolunteerResponsibilities] = useState('');

  // Work experience form state
  const [workCompany, setWorkCompany] = useState('');
  const [workRole, setWorkRole] = useState('');
  const [workFrom, setWorkFrom] = useState('');
  const [workTo, setWorkTo] = useState('');
  const [workCurrent, setWorkCurrent] = useState(false);
  const [workCity, setWorkCity] = useState('');
  const [workDuties, setWorkDuties] = useState('');
  const [workResponsibilities, setWorkResponsibilities] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isEditingTab, setIsEditingTab] = useState(false);
  const [eduType, setEduType] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [music, setMusic] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [games, setGames] = useState([]);
  const [sports, setSports] = useState([]);
  const [athletes, setAthletes] = useState([]);

  const [autocomplete, setAutocomplete] = useState({ category: '', text: '', suggestions: [] });

  const handleAutocompleteChange = (e, categoryName) => {
    const val = e.target.value;
    let filteredArray = [];
    if (val.length >= 3) {
      let sourceArray = [];
      const dataObj = platformData || {};
      let key = categoryName.toUpperCase();
      if (categoryName === 'tvShows' || categoryName === 'tvshows') {
        key = 'TV_SHOWS';
      }
      
      if (Array.isArray(dataObj[key])) {
        sourceArray = dataObj[key];
      } else if (Array.isArray(dataObj[categoryName])) {
        sourceArray = dataObj[categoryName];
      } else if (dataObj.default && Array.isArray(dataObj.default[key])) {
        sourceArray = dataObj.default[key];
      } else if (dataObj.default && Array.isArray(dataObj.default[categoryName])) {
        sourceArray = dataObj.default[categoryName];
      } else {
        if (key === 'HOBBIES' && typeof HOBBIES !== 'undefined') sourceArray = HOBBIES;
        else if (key === 'TV_SHOWS' && typeof TV_SHOWS !== 'undefined') sourceArray = TV_SHOWS;
        else if (key === 'MOVIES' && typeof MOVIES !== 'undefined') sourceArray = MOVIES;
        else if (key === 'GAMES' && typeof GAMES !== 'undefined') sourceArray = GAMES;
        else if (key === 'SPORTS' && typeof SPORTS !== 'undefined') sourceArray = SPORTS;
      }

      filteredArray = sourceArray.filter(item =>
        item.toLowerCase().includes(val.toLowerCase())
      );
    }
    setAutocomplete({ category: categoryName, text: val, suggestions: val.length >= 3 ? filteredArray.slice(0, 5) : [] });
  };

  const handleSuggestionClick = (suggestion, stateArray, setStateFunction) => {
    setStateFunction([...stateArray, suggestion]);
    setAutocomplete({ category: '', text: '', suggestions: [] });
  };

  // ── Personal Info state ──
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [fatherEmail, setFatherEmail] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [motherEmail, setMotherEmail] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [hometown, setHometown] = useState('');

  // ── Education state ──
  const [schoolName, setSchoolName] = useState('');
  const [schoolBoard, setSchoolBoard] = useState('');
  const [schoolFrom, setSchoolFrom] = useState('');
  const [schoolTo, setSchoolTo] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [marks10th, setMarks10th] = useState('');
  const [marks12th, setMarks12th] = useState('');
  const [stream1112, setStream1112] = useState('');
  const [ugInstitution, setUgInstitution] = useState('');
  const [ugCourse, setUgCourse] = useState('');
  const [ugCGPA, setUgCGPA] = useState('');
  const [ugFrom, setUgFrom] = useState('');
  const [ugTo, setUgTo] = useState('');
  const [pgInstitution, setPgInstitution] = useState('');
  const [pgCourse, setPgCourse] = useState('');
  const [pgCGPA, setPgCGPA] = useState('');

  const handleAddTag = (e, stateArray, setStateFunction) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      setStateFunction([...stateArray, e.target.value.trim()]);
      e.target.value = '';
      setAutocomplete({ category: '', text: '', suggestions: [] });
    }
  };
  const handleRemoveTag = (indexToRemove, stateArray, setStateFunction) => {
    setStateFunction(stateArray.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", "mock-student-id"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.track) { setUserTrack(data.track); } else { setUserTrack('hybrid'); }
          if ((data.track === 'counselling' || data.track === 'hybrid') && !data.hasCompletedClinicalIntake) {
            setShowClinicalIntake(true);
          }
          if (!data.hasAcceptedTerms) { setShowTermsModal(true); }
          setLocalUserData(prev => ({ ...prev, ...data }));
          if (data.journalEntries) setJournalEntries(data.journalEntries);
          if (data.roadmapTasks) setRoadmapTasks(data.roadmapTasks);
          if (Array.isArray(data.internships)) setInternships(data.internships);
          if (Array.isArray(data.voluntaryExp)) setVoluntaryExp(data.voluntaryExp);
          if (Array.isArray(data.workExperience)) setWorkExperience(data.workExperience);
          if (Array.isArray(data.projects)) setProjects(data.projects);
          // ── Personal Info ──
          if (data.fatherName)  setFatherName(data.fatherName);
          if (data.fatherPhone) setFatherPhone(data.fatherPhone);
          if (data.fatherEmail) setFatherEmail(data.fatherEmail);
          if (data.motherName)  setMotherName(data.motherName);
          if (data.motherPhone) setMotherPhone(data.motherPhone);
          if (data.motherEmail) setMotherEmail(data.motherEmail);
          if (data.guardianName)  setGuardianName(data.guardianName);
          if (data.guardianPhone) setGuardianPhone(data.guardianPhone);
          if (data.guardianEmail) setGuardianEmail(data.guardianEmail);
          if (data.location)  setCurrentLocation(data.location);
          if (data.hometown)  setHometown(data.hometown);
          // ── Education ──
          if (data.schoolName)    setSchoolName(data.schoolName);
          if (data.schoolBoard)   setSchoolBoard(data.schoolBoard);
          if (data.schoolFrom)    setSchoolFrom(data.schoolFrom);
          if (data.schoolTo)      setSchoolTo(data.schoolTo);
          if (data.schoolCity)    setSchoolCity(data.schoolCity);
          if (data.marks10th)     setMarks10th(data.marks10th);
          if (data.marks12th)     setMarks12th(data.marks12th);
          if (data.stream1112)    setStream1112(data.stream1112);
          if (data.ugInstitution) setUgInstitution(data.ugInstitution);
          if (data.ugCourse)      setUgCourse(data.ugCourse);
          if (data.ugCGPA)        setUgCGPA(data.ugCGPA);
          if (data.ugFrom)        setUgFrom(data.ugFrom);
          if (data.ugTo)          setUgTo(data.ugTo);
          if (data.pgInstitution) setPgInstitution(data.pgInstitution);
          if (data.pgCourse)      setPgCourse(data.pgCourse);
          if (data.pgCGPA)        setPgCGPA(data.pgCGPA);
          // ── Hobbies (tag arrays) ──
          if (Array.isArray(data.hobbies))  setHobbies(data.hobbies);
          if (Array.isArray(data.music))    setMusic(data.music);
          if (Array.isArray(data.tvShows))  setTvShows(data.tvShows);
          if (Array.isArray(data.movies))   setMovies(data.movies);
          if (Array.isArray(data.games))    setGames(data.games);
          if (Array.isArray(data.sports))   setSports(data.sports);
          if (Array.isArray(data.athletes)) setAthletes(data.athletes);
          if (data.lifeSkills) setLifeSkills(data.lifeSkills);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => { if (userData) setLocalUserData(userData); }, [userData]);

  useEffect(() => {
    if (!auth?.currentUser) {
      setIsLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'students', auth.currentUser.uid), (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        const mappedData = {
          ...data,
          name: data.profile?.name || '',
          riasecCode: data.careerDNA?.riasec || null,
          activeDivisions: data.activeDivisions || []
        };
        
        if (mappedData.activeDivisions.includes('clinical') && !data.hasCompletedClinicalIntake) {
          setShowClinicalIntake(true);
        }
        
        setLocalUserData(mappedData);
        
        if (data.profile) {
          setProfileData(prev => ({
            ...prev,
            age: data.profile.age || '', gender: data.profile.gender || '',
            schoolName: data.profile.schoolName || '', gradeLevel: data.profile.gradeLevel || '',
            marks10th: data.profile.marks10th || '', marks11th: data.profile.marks11th || '',
            stream1112: data.profile.stream1112 || '', marks12th: data.profile.marks12th || '',
            ugCourse: data.profile.ugCourse || '', ugCGPA: data.profile.ugCGPA || '',
            pgCourse: data.profile.pgCourse || '', pgCGPA: data.profile.pgCGPA || ''
          }));
        }
      }
      setIsLoading(false);
    }, (e) => { 
      console.error('Error listening to user data:', e); 
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);

  useEffect(() => {
    window.setActiveAboutTabGlobal = setActiveView;
    const pending = sessionStorage.getItem('pendingAboutTab');
    if (pending) {
      setActiveView(pending);
      sessionStorage.removeItem('pendingAboutTab');
    }
    return () => {
      delete window.setActiveAboutTabGlobal;
    };
  }, [setActiveView]);
  useEffect(() => { setAdvisoryMsg(ADVISORY_MESSAGES[Math.floor(Math.random() * ADVISORY_MESSAGES.length)]); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { ...localUserData, ...profileData, internships, voluntaryExp, workExperience, projects, profileComplete: true, profileCompletedAt: new Date().toISOString() }, { merge: true });
      setLocalUserData(prev => ({ ...prev, ...profileData, profileComplete: true }));
      setShowProfileForm(false);
      showToast('✅ Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('❌ Failed to save profile. Please try again.');
    } finally { setSavingProfile(false); }
  };

  const renderAcademicFields = () => {
    const grade = profileData.gradeLevel.toLowerCase();
    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>10th Grade Marks (%)</label>
          <input type="number" value={profileData.marks10th} onChange={(e) => setProfileData({ ...profileData, marks10th: e.target.value })} placeholder="e.g., 85" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} />
        </div>
        {(grade.includes('11') || grade.includes('12') || grade.includes('puc') || grade.includes('ug') || grade.includes('pg') || grade.includes('postgraduate')) && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>11th/12th Stream *</label>
              <select value={profileData.stream1112} onChange={(e) => setProfileData({ ...profileData, stream1112: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} required>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>12th Grade Marks (%) *</label>
                <input type="number" value={profileData.marks12th} onChange={(e) => setProfileData({ ...profileData, marks12th: e.target.value })} placeholder="e.g., 88" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} required />
              </div>
            )}
          </>
        )}
        {(grade.includes('ug') || grade.includes('undergraduate') || grade.includes('pg') || grade.includes('postgraduate')) && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>Current/Completed UG Course *</label>
              <input type="text" value={profileData.ugCourse} onChange={(e) => setProfileData({ ...profileData, ugCourse: e.target.value })} placeholder="e.g., B.Tech Computer Science" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>UG CGPA (out of 10) *</label>
              <input type="number" step="0.01" value={profileData.ugCGPA} onChange={(e) => setProfileData({ ...profileData, ugCGPA: e.target.value })} placeholder="e.g., 8.5" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} required />
            </div>
          </>
        )}
        {(grade.includes('pg') || grade.includes('postgraduate')) && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>Current PG Course *</label>
              <input type="text" value={profileData.pgCourse} onChange={(e) => setProfileData({ ...profileData, pgCourse: e.target.value })} placeholder="e.g., MBA Marketing" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>PG CGPA (out of 10) *</label>
              <input type="number" step="0.01" value={profileData.pgCGPA} onChange={(e) => setProfileData({ ...profileData, pgCGPA: e.target.value })} placeholder="e.g., 9.0" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }} required />
            </div>
          </>
        )}
      </>
    );
  };

  // ── DATA EXTRACTION ──
  const bio = localUserData?.bio || userProfile?.bio || '';
  const location = localUserData?.location || userProfile?.location || '';
  const coverPhoto = localUserData?.coverPhoto || userProfile?.coverPhoto || null;
  const profilePicture = localUserData?.profilePicture || userProfile?.profilePicture || null;
  const studentName = localUserData?.name || userProfile?.name || user?.displayName || "Student";
  const firstName = studentName.split(" ")[0];
  const hasAssessment = !!localUserData?.riasecCode;
  const exPoints = Number(userProfile.exPoints || 0);
  const maxXp = 300;
  const xpPct = Math.min(100, Math.round((exPoints / maxXp) * 100));
  const xpLevel = exPoints < 100 ? 1 : exPoints < 200 ? 2 : exPoints < 300 ? 3 : 4;

  const bestCareer = localUserData?.bestCareer || (hasAssessment ? { title: "Software Engineer", subtitle: "Tech & Innovation", matchPercent: 94, pros: ["High starting salary", "Global opportunities"], cons: ["Sedentary lifestyle", "Continuous learning required"], parentMetrics: { stability: "High", demand: "Very High", safety: "High" } } : null);
  const recommendedCareer = localUserData?.recommendedCareer || (hasAssessment ? { title: "Data Analyst", subtitle: "Research & Logic", matchPercent: 88, pros: ["Growing field", "Remote work options"], cons: ["Repetitive tasks", "Screen fatigue"], parentMetrics: { stability: "High", demand: "High", safety: "High" } } : null);
  const leastCareer = localUserData?.leastCareer || (hasAssessment ? { title: "Event Manager", subtitle: "Social & Enterprising", matchPercent: 42, pros: ["Creative freedom", "Networking"], cons: ["High stress", "Irregular hours"], parentMetrics: { stability: "Low", demand: "Medium", safety: "Moderate" } } : null);
  const streamRec = localUserData?.streamRec || (hasAssessment ? { name: "Science (PCM)", match: 92, reasons: ["Strong analytical thinking", "Interest in technology", "Matches Investigative profile"] } : null);
  const collegesExt = (localUserData?.collegesExt && localUserData.collegesExt.length > 0) ? localUserData.collegesExt : (hasAssessment ? [
    { name: "Indian Institute of Technology (IIT)", loc: "Various", cutoffs: "Top 2%", fees: "₹1-2L/yr", placement: "95%+" },
    { name: "National Institute of Technology (NIT)", loc: "Various", cutoffs: "Top 5%", fees: "₹1L/yr", placement: "90%+" },
    { name: "BITS Pilani", loc: "Pilani", cutoffs: "Top 8%", fees: "₹1.5L/yr", placement: "92%+" }
  ] : []);
  const compareStats = (localUserData?.compareStats && localUserData.compareStats.length > 0) ? localUserData.compareStats : (hasAssessment ? [
    { title: bestCareer?.title || "Path 1", salary: "₹12-25L", years: "4 Years", difficulty: "High", wlb: "Moderate" },
    { title: recommendedCareer?.title || "Path 2", salary: "₹8-15L", years: "3-4 Years", difficulty: "Medium", wlb: "Good" },
    { title: leastCareer?.title || "Path 3", salary: "₹5-10L", years: "3 Years", difficulty: "Low", wlb: "Poor" }
  ] : []);
  const skillGaps = (localUserData?.skillGaps && localUserData.skillGaps.length > 0) ? localUserData.skillGaps : (hasAssessment ? [
    { skill: "Analytical Thinking", status: "On Track", student: 8 },
    { skill: "Public Speaking", status: "Needs Work", student: 4 },
    { skill: "Time Management", status: "On Track", student: 7 }
  ] : []);
  const executionPlan = (localUserData?.executionPlan && localUserData.executionPlan.length > 0)
    ? localUserData.executionPlan
    : (localUserData?.nextSteps ? localUserData.nextSteps.map((step, i) => ({ title: `Action Step ${i + 1}`, action: step }))
    : (hasAssessment ? [
      { title: "Skill Up", action: "Complete a basic Python course this month." },
      { title: "Research", action: "Look up admission criteria for top 3 target colleges." }
    ] : []));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderLockedState = (icon, title, desc = "") => (
    <div className="db-empty-state">
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: "700", color: "var(--ink)", marginBottom: "12px" }}>{title}</div>
      {desc && <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>{desc}</div>}
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: "16px 24px", borderRadius: "12px", margin: "0 auto 24px", maxWidth: "500px", color: "#92400E", fontSize: "14px", lineHeight: "1.6", textAlign: "left" }}>
        <strong>💡 Assessment Rule:</strong><br />
        <span style={{ color: "#B45309" }}>{advisoryMsg}</span>
      </div>
      <button className="db-btn" onClick={() => setShowAssessment(true)} style={{ fontSize: "16px", padding: "14px 32px" }}>Start Assessment 🚀</button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="db-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid #F3F4F6', borderTop: '4px solid var(--saffron)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ color: 'var(--muted)', fontWeight: '600' }}>Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (showAssessment) {
    return (
      <CareerAssessment
        onBack={() => setShowAssessment(false)}
        onSaveResults={(results) => {
          setLocalUserData({
            ...localUserData,
            name: results.studentInfo?.name || localUserData.name,
            classLevel: results.studentInfo?.class || localUserData.classLevel,
            riasecCode: results.riasec?.code,
            riasecSummary: results.riasecSummary,
            bestCareer: results.bestCareer,
            recommendedCareer: results.recommendedCareer,
            leastCareer: results.leastCareer,
            nextSteps: results.nextSteps
          });
          setShowAssessment(false);
          setActiveTab("careers");
          showToast("Assessment Complete! Your roadmap is unlocked.");
        }}
      />
    );
  }

  // ── LEFT SIDEBAR: Profile Card ──
  const LeftProfileCard = () => (
    <div className="db-profile-card">
      <div className="db-profile-banner">
        {coverPhoto && <img src={coverPhoto} alt="Cover" className="w-full h-48 md:h-64 object-cover rounded-t-2xl" />}
        <div className="db-profile-avatar-wrap">
          <div className="db-profile-avatar">
            {profilePicture
              ? <img src={profilePicture} alt="avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md relative -mt-16 ml-6" />
              : studentName.charAt(0)
            }
          </div>
        </div>
      </div>
      <div className="db-profile-body">
        <div className="db-profile-name">{studentName}</div>
        <div className="db-profile-sub">{localUserData?.classLevel || "Student"}</div>
        {hasAssessment && (
          <div className="db-profile-riasec">{String(localUserData.riasecCode)}</div>
        )}

        {/* EX Points Block */}
        {exPoints === 0 ? (
          /* ── XP EMPTY STATE ── */
          <div className="db-xp-block" style={{ textAlign: 'center', padding: '16px' }}>
            <div className="db-xp-label">⚡ EX Points</div>
            <div style={{ fontSize: '36px', margin: '8px 0 6px' }}>🌟</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: '700', color: '#92400E', marginBottom: '6px', lineHeight: '1.4' }}>
              Welcome to Secret Sharz!
            </div>
            <div style={{ fontSize: '11px', color: '#B45309', lineHeight: '1.5', marginBottom: '12px' }}>
              Complete your profile to earn your first 50 XP.
            </div>
            <button
              onClick={() => setShowProfileEditor(true)}
              style={{
                width: '100%', padding: '8px 12px',
                background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
                color: 'white', border: 'none', borderRadius: 'var(--r-sm)',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 3px 10px rgba(232,101,10,0.3)',
                transition: 'all 0.2s',
              }}
            >
              Complete Profile ✨
            </button>
          </div>
        ) : (
          <div 
            className="db-xp-block" 
            style={{ cursor: 'pointer' }} 
            onClick={() => setShowProfileEditor(true)}
            title="Click to earn more EX Points"
          >
            <div className="db-xp-label">⚡ EX Points</div>
            <div className="db-xp-score">{exPoints} <span>/ {maxXp}</span></div>
            <div className="db-xp-bar-wrap">
              <div className="db-xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <div className="db-xp-level">
              <span>Level {xpLevel}</span>
              <span>{xpPct}% to next</span>
            </div>
          </div>
        )}

        {/* Edit Profile Button */}
        <button className="db-edit-profile-btn" onClick={() => setShowProfileEditor(true)}>
          ✏️ Edit Profile
        </button>

        {/* Quick Stats */}
        {userTrack !== 'counselling' && (
          <div className="db-profile-stats">
            <div className="db-profile-stat">
              <div className="db-profile-stat-val">{hasAssessment ? "8" : "0"}</div>
              <div className="db-profile-stat-lbl">Clarity</div>
            </div>
            <div className="db-profile-stat">
              <div className="db-profile-stat-val">{hasAssessment ? "✓" : "—"}</div>
              <div className="db-profile-stat-lbl">Assessed</div>
            </div>
          </div>
        )}

        {/* Parent Mode Toggle */}
        <div style={{ marginTop: '12px' }}>
          <button className={`db-parent-toggle ${isParentMode ? 'active' : ''}`} onClick={() => setIsParentMode(!isParentMode)}>
            <div className="db-parent-toggle-dot" /> 👨‍👩‍👧 Parent View
          </button>
        </div>

        {/* Back / Logout */}
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {onBack && (
            <button onClick={onBack} style={{ width: '100%', padding: '9px', background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Back to Secret Sharz
            </button>
          )}
          {onLogout && (
            <button onClick={onLogout} style={{ width: '100%', padding: '9px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── RIGHT SIDEBAR: Notifications + Career Intelligence ──
  const RightSidebar = () => (
    <div className="db-right-sidebar">
      {/* Notifications Widget */}
      <div className="db-sidebar-widget">
        <div className="db-widget-header">
          <div className="db-widget-title">
            🔔 Alerts
            {unreadCount > 0 && (
              <span style={{ background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px' }}>{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="db-widget-action" onClick={() => markAllNotificationsRead()}>Mark all read</button>
          )}
        </div>
        <div className="db-widget-body">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="db-notif-item"
              style={{ cursor: 'pointer', opacity: notif.isRead ? 0.6 : 1, transition: 'opacity 0.2s' }}
              onClick={() => {
                if (!notif.isRead) markNotificationRead(notif.id);
                // Special handling: XP alert opens the XP checklist modal
                if (notif.id === 'notif-001' || notif.title?.toLowerCase().includes('xp')) {
                  setShowXpModal(true);
                } else {
                  setShowProfileEditor(true);
                }
              }}
            >
              {/* Unread dot — hidden when read */}
              <div className="db-notif-dot" style={{ background: notif.isRead ? 'transparent' : getNotifColor(notif.priority, notif.isRead) }} />
              <div className="db-notif-content">
                <div className="db-notif-title">{String(notif.title)}</div>
                <div className="db-notif-msg">{String(notif.message).substring(0, 80)}{notif.message.length > 80 ? '…' : ''}</div>
                <div className="db-notif-time">{relativeTime(notif.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Intelligence (compact) — shown if assessment done, empty state if not */}
      <div className="db-sidebar-widget">
        <div className="db-widget-header">
          <div className="db-widget-title">🧠 Career Intel</div>
          {hasAssessment && (
            <button className="db-widget-action" onClick={() => setActiveTab("report")}>Full Report →</button>
          )}
        </div>
        <div className="db-widget-body">
          {hasAssessment ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Holland Code</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '900', color: 'var(--ink)', letterSpacing: '3px' }}>{String(localUserData?.riasecCode || '')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Top Match</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>
                    {String(
                      (localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 0)
                        ? localUserData.topCareerMatches[0].name
                        : (localUserData?.bestCareer?.title || 'Pending')
                    )}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--success)' }}>
                    {localUserData?.topCareerMatches?.[0]?.matchScore
                      ? `${Number(localUserData.topCareerMatches[0].matchScore)}%`
                      : `${Number(localUserData?.bestCareer?.matchPercent || 0)}%`} fit
                  </div>
                </div>
              </div>
              {/* Career Matches Empty State — assessment done but no topCareerMatches */}
              {(!localUserData?.topCareerMatches || localUserData.topCareerMatches.length === 0) && !localUserData?.bestCareer ? (
                <div style={{ textAlign: 'center', padding: '16px 8px', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: 'var(--r-md)', border: '1px dashed #93C5FD', marginBottom: '12px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔭</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: '13px', fontWeight: '700', color: '#1E40AF', marginBottom: '6px', lineHeight: '1.4' }}>
                    Your future is waiting!
                  </div>
                  <div style={{ fontSize: '11px', color: '#3B82F6', lineHeight: '1.5', marginBottom: '12px' }}>
                    Take the RIASEC assessment to unlock your top career matches.
                  </div>
                  <button
                    onClick={() => setShowAssessment(true)}
                    style={{
                      width: '100%', padding: '9px 12px',
                      background: '#2563EB',
                      color: 'white', border: 'none', borderRadius: 'var(--r-sm)',
                      fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                      fontFamily: 'inherit', boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    Take the Assessment 🚀
                  </button>
                </div>
              ) : (
                <>
                  {localUserData?.riasecSummary && (
                    <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: '1.6', background: 'var(--surface)', padding: '10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                      {String(localUserData.riasecSummary).substring(0, 120)}…
                    </div>
                  )}
                  <button className="db-btn" onClick={() => setShowCareerMatchesModal(true)} style={{ width: '100%', marginTop: '12px', fontSize: '12px', padding: '9px 16px' }}>
                    🎯 View Career Matches
                  </button>
                </>
              )}
            </>
          ) : (
            /* ── CAREER MATCHES EMPTY STATE (no assessment at all) ── */
            <div style={{ textAlign: 'center', padding: '20px 8px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔭</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginBottom: '8px', lineHeight: '1.4' }}>
                Your future is waiting!
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '14px' }}>
                Take the RIASEC assessment to unlock your top career matches.
              </div>
              <button
                onClick={() => setShowAssessment(true)}
                style={{
                  width: '100%', padding: '10px 14px',
                  background: '#2563EB',
                  color: 'white', border: 'none', borderRadius: 'var(--r-sm)',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  transition: 'all 0.2s',
                }}
              >
                Take the Assessment 🚀
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="db-sidebar-widget">
        <div className="db-widget-header">
          <div className="db-widget-title">⚡ Quick Actions</div>
        </div>
        <div className="db-widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: '🎯', label: 'Career Matches', tab: 'careers' },
            { icon: '🏫', label: 'College Explorer', tab: 'colleges' },
            { icon: '📈', label: 'Growth Plan', tab: 'growth' },
            { icon: '📅', label: 'Book Expert', tab: 'counsellor' },
          ].filter(item => {
            if (userTrack === 'counselling' && ['careers', 'compare', 'colleges', 'growth', 'report'].includes(item.tab)) return false;
            if (userTrack === 'career' && item.tab === 'counsellor') return false;
            return true;
          }).map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: activeTab === item.tab ? '#EEF2FF' : 'var(--surface)', border: `1px solid ${activeTab === item.tab ? '#C7D2FE' : 'var(--border)'}`, borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', color: activeTab === item.tab ? '#4F46E5' : 'var(--ink)', transition: 'all 0.15s', textAlign: 'left' }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── CENTER FEED: Home Tab ──
  const renderHomeFeed = () => {
    if (userTrack === 'career') {
      return <CareerDashboardView collegesExt={collegesExt} localUserData={localUserData} />;
    }
    return (
    <div className="db-feed db-tab">
      {/* Profile Completion Banner */}
      {!localUserData?.profileComplete && (
        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '2px solid #F59E0B', borderRadius: 'var(--r-lg)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#92400E', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span> Complete Your Academic Profile
            </div>
            <div style={{ fontSize: '13px', color: '#B45309', lineHeight: '1.5' }}>
              For the most accurate career and college recommendations, please complete your academic profile.
            </div>
          </div>
          <button className="db-btn" style={{ background: '#F59E0B', whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => setShowProfileForm(true)}>
            Complete Profile →
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="db-welcome">
        <div className="db-welcome-text">
          <div className="db-welcome-eyebrow">Welcome Back</div>
          <h1 className="db-welcome-h1">Hey {firstName},<br /><em>own your future.</em></h1>
          <p className="db-welcome-p">
            {hasAssessment
              ? `Your RIASEC code is ${String(localUserData.riasecCode)}. Your best path is ${String(bestCareer?.title || '')}.`
              : "Take our free AI assessment to unlock your career roadmap."}
          </p>
        </div>
        <div className="db-welcome-action">
          {!hasAssessment && <button className="db-welcome-btn" onClick={() => setShowAssessment(true)}>Take Assessment 🚀</button>}
          {hasAssessment && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="db-welcome-btn" onClick={() => setActiveTab("report")}>📄 View Full Report</button>
              <button className="db-btn-ghost" onClick={() => setShowAssessment(true)}>🔄 Take Retest</button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="db-stats-strip">
        <div className="db-stat-mini">
          <span className="db-stat-mini-icon">🎯</span>
          <div className="db-stat-mini-val">{hasAssessment ? "8" : "0"}</div>
          <div className="db-stat-mini-lbl">Clarity Index</div>
        </div>
        <div className="db-stat-mini" style={{ cursor: 'pointer' }} onClick={() => setActiveTab("careers")}>
          <span className="db-stat-mini-icon">🧠</span>
          <div className="db-stat-mini-val" style={{ fontSize: hasAssessment ? "18px" : "20px" }}>{hasAssessment ? "Done" : "Pending"}</div>
          <div className="db-stat-mini-lbl">Assessment</div>
        </div>
        <div className="db-stat-mini" style={{ cursor: 'pointer' }} onClick={() => setActiveTab("growth")}>
          <span className="db-stat-mini-icon">📈</span>
          <div className="db-stat-mini-val" style={{ fontSize: "18px" }}>View</div>
          <div className="db-stat-mini-lbl">Growth Plan</div>
        </div>
        <div className="db-stat-mini" style={{ cursor: 'pointer' }} onClick={() => setActiveTab("counsellor")}>
          <span className="db-stat-mini-icon">📅</span>
          <div className="db-stat-mini-val" style={{ fontSize: "18px" }}>Book</div>
          <div className="db-stat-mini-lbl">Expert</div>
        </div>
      </div>

      {localUserData?.careerDNA?.riasec?.code && (
        <>
          <CareerMatches riasecCode={localUserData.careerDNA.riasec.code} />
          <div className="mt-8 mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Custom Career Roadmap</h3>
            <CareerRoadmap />
          </div>
          <div className="mt-8 mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your College Shortlist</h3>
            <CollegeShortlist collegeShortlist={localUserData?.collegeShortlist || { dream: [], target: [], safe: [] }} />
          </div>
        </>
      )}

      {/* Career Intelligence Report Card */}
      {hasAssessment && userTrack !== 'counselling' ? (
        <div className="db-intel-card">
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
            <div>
              <div className="db-intel-eyebrow">🧠 Career Intelligence Report</div>
              <div className="db-intel-title">Your RIASEC Profile</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="db-intel-code">{String(localUserData?.riasecCode || '')}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: '4px' }}>Holland Code</div>
            </div>
          </div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '20px', position: 'relative', zIndex: 1 }} />
          <div className="db-intel-grid" style={{ position: 'relative', zIndex: 1 }}>
            <div className="db-intel-col">
              <div className="db-intel-col-label" style={{ color: 'var(--teal-light)' }}>📚 Recommended Stream</div>
              <div className="db-intel-col-value">{String(localUserData?.recommendedStream || localUserData?.streamRec?.name || 'Pending')}</div>
              {(localUserData?.streamRec?.match || localUserData?.maturityPct) && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Match</span>
                    <span style={{ fontSize: '11px', color: 'var(--teal-light)', fontWeight: '800' }}>
                      {localUserData?.streamRec?.match ? `${Number(localUserData.streamRec.match)}%` : `${Number(localUserData?.maturityPct || 0)}%`}
                    </span>
                  </div>
                  <div className="db-intel-mini-bar">
                    <div className="db-intel-mini-fill" style={{ width: `${localUserData?.streamRec?.match || localUserData?.maturityPct || 0}%`, background: 'linear-gradient(90deg, var(--teal), var(--teal-light))' }} />
                  </div>
                </>
              )}
            </div>
            <div className="db-intel-col">
              <div className="db-intel-col-label" style={{ color: 'var(--gold)' }}>🏆 Top Career Match</div>
              <div className="db-intel-col-value">
                {String(
                  (localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 0)
                    ? localUserData.topCareerMatches[0].name
                    : (localUserData?.bestCareer?.title || 'Pending')
                )}
              </div>
              {(localUserData?.topCareerMatches?.[0]?.matchScore || localUserData?.bestCareer?.matchPercent) && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Fit Score</span>
                    <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '800' }}>
                      {localUserData?.topCareerMatches?.[0]?.matchScore
                        ? `${Number(localUserData.topCareerMatches[0].matchScore)}%`
                        : `${Number(localUserData?.bestCareer?.matchPercent || 0)}%`}
                    </span>
                  </div>
                  <div className="db-intel-mini-bar">
                    <div className="db-intel-mini-fill" style={{ width: `${localUserData?.topCareerMatches?.[0]?.matchScore || localUserData?.bestCareer?.matchPercent || 0}%`, background: 'linear-gradient(90deg, var(--saffron), var(--gold))' }} />
                  </div>
                </>
              )}
            </div>
            <div className="db-intel-col">
              <div className="db-intel-col-label" style={{ color: 'var(--lav-light)' }}>🎯 More Matches</div>
              {(localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 1)
                ? localUserData.topCareerMatches.slice(1, 4).map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', flex: 1, marginRight: '6px' }}>{String(c.name || '')}</span>
                      <span style={{ fontSize: '10px', color: 'var(--lav-light)', fontWeight: '800', flexShrink: 0 }}>{Number(c.matchScore || 0)}%</span>
                    </div>
                  ))
                : [localUserData?.recommendedCareer, localUserData?.leastCareer].filter(Boolean).map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', flex: 1, marginRight: '6px' }}>{String(c.title || '')}</span>
                      <span style={{ fontSize: '10px', color: 'var(--lav-light)', fontWeight: '800', flexShrink: 0 }}>{Number(c.matchPercent || 0)}%</span>
                    </div>
                  ))
              }
            </div>
          </div>
          {localUserData?.riasecSummary && (
            <div className="db-intel-summary" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>Profile Summary</div>
              {String(localUserData.riasecSummary)}
            </div>
          )}
          <div className="db-intel-actions" style={{ position: 'relative', zIndex: 1 }}>
            <button className="db-btn" onClick={() => setActiveTab("careers")} style={{ fontSize: '12px', padding: '9px 18px' }}>🎯 Career Matches</button>
            <button className="db-btn-ghost" onClick={() => setActiveTab("report")} style={{ fontSize: '12px', padding: '9px 18px' }}>📄 Full Report</button>
          </div>
        </div>
      ) : userTrack !== 'counselling' ? (
        <div style={{ background: 'white', borderRadius: 'var(--r-xl)', padding: '32px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>🧠</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--lavender)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Career Intelligence Report</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>Unlock Your RIASEC Profile</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', maxWidth: '400px' }}>
              Take the free 15-minute VidyaVantage assessment to discover your Holland Code, recommended stream, and top career matches.
            </div>
          </div>
          <button className="db-btn" onClick={() => setShowAssessment(true)} style={{ flexShrink: 0, fontSize: '14px', padding: '12px 24px', background: 'linear-gradient(135deg, var(--lavender), var(--lav-light))' }}>
            Take Assessment 🚀
          </button>
        </div>
      ) : null}

      {/* Stream Recommendation */}
      {hasAssessment && streamRec && userTrack !== 'counselling' && (
        <div className="db-stream-box">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>🎯 Stream Recommendation</div>
            <div style={{ fontFamily: "Fraunces", fontSize: '22px', fontWeight: '700', color: 'var(--ink)', margin: '4px 0' }}>
              {String(streamRec.name)} <span style={{ color: 'var(--success)', fontSize: '16px' }}>({Number(streamRec.match)}% Match)</span>
            </div>
            <ul style={{ margin: '6px 0 0 18px', fontSize: '12px', color: 'var(--ink-soft)', fontWeight: '500' }}>
              {(streamRec.reasons || []).map((r, i) => <li key={i}>{String(r)}</li>)}
            </ul>
          </div>
          <button className="db-btn" onClick={() => setActiveTab("colleges")}>Explore Colleges</button>
        </div>
      )}

      {/* Social Feed Posts */}
      <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px', marginTop: '4px' }}>
        📰 Latest from Secret Sharz
      </div>
      {socialFeed.map((post) => {
        const style = getPostStyle(post.type);
        return (
          <div key={post.id} className="db-post-card">
            <div className="db-post-header">
              <div className="db-post-author-avatar" style={{ background: style.avatarBg, color: 'white' }}>
                {style.avatarEmoji}
              </div>
              <div className="db-post-author-info">
                <div className="db-post-author-name">{String(post.author)}</div>
                <div className="db-post-timestamp">{relativeTime(post.timestamp)}</div>
              </div>
              <div className="db-post-type-badge" style={{ background: style.bg, color: style.color }}>
                {style.label}
              </div>
            </div>
            <div className="db-post-body">
              <div className="db-post-title">{String(post.title)}</div>
              <div className="db-post-text">{String(post.body)}</div>
              {post.tags && post.tags.length > 0 && (
                <div className="db-post-tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="db-post-tag">#{String(tag)}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="db-post-footer">
              <div className="db-post-meta">
                <div className="db-post-meta-item">❤️ <span>{Number(post.likes || 0)}</span></div>
                <div className="db-post-meta-item">💬 <span>{Number(post.comments || 0)}</span></div>
              </div>
              {post.readUrl && (
                <button
                  onClick={() => showToast('Opening article...')}
                  style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Read More →
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
    );
  };

  // ── CAREERS TAB ──
  const renderCareersTab = () => (
    <div className="db-tab">
      {!hasAssessment ? renderLockedState("🎯", "Unlock Career Matches", "Complete your assessment to see your personalized career matches.") : (
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
                  <div className="db-career-name">{String(career.data.title)}</div>
                  <div className="db-career-sub">{String(career.data.subtitle)}</div>
                  <div className="db-match-bar-wrap">
                    <div className="db-match-row">
                      <span className="db-match-label">Profile Match</span>
                      <span className="db-match-pct" style={{ color: career.rank === 'best' ? '#059669' : career.rank === 'good' ? '#D97706' : '#E11D48' }}>{Number(career.data.matchPercent)}%</span>
                    </div>
                    <div className="db-match-bg">
                      <div style={{ height: '100%', width: `${Number(career.data.matchPercent)}%`, background: career.rank === 'best' ? '#34D399' : career.rank === 'good' ? '#FCD34D' : '#FB7185' }} />
                    </div>
                  </div>
                  {isParentMode ? (
                    <div className="db-explain-box" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "#4F46E5", marginBottom: "8px", textTransform: "uppercase" }}>👪 Parent Metrics</div>
                      <div className="db-parent-metric"><span>Stability</span><strong>{String(pMetrics.stability)}</strong></div>
                      <div className="db-parent-metric"><span>Demand</span><strong>{String(pMetrics.demand)}</strong></div>
                      <div className="db-parent-metric"><span>Safety</span><strong>{String(pMetrics.safety)}</strong></div>
                    </div>
                  ) : (
                    <div className="db-explain-box">
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink)", marginBottom: "6px" }}>Why it fits you:</div>
                      {pros.map((p, j) => <div key={j} className="db-explain-item"><span className="db-explain-icon" style={{ color: "var(--success)" }}>✔</span> {String(p)}</div>)}
                      <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />
                      {cons.map((c, j) => <div key={j} className="db-explain-item"><span className="db-explain-icon" style={{ color: "var(--warn)" }}>⚠</span> {String(c)}</div>)}
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
  );

  // ── COMPARE TAB ──
  const renderCompareTab = () => (
    <div className="db-tab">
      {!hasAssessment ? renderLockedState("⚖️", "Compare Tool Locked") : compareStats.length === 0 ? (
        <div className="db-empty-state"><div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div><div style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '700', color: 'var(--ink)' }}>Comparison Data Pending</div></div>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "Fraunces", fontSize: "24px", color: "var(--ink)" }}>Decision Simulator</h2>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>Compare your top matched careers across real-world metrics.</p>
          </div>
          <div className="db-compare-grid">
            <div className="db-compare-header" style={{ background: "white" }}>Metrics</div>
            {compareStats.map((c, i) => <div key={i} className="db-compare-header">{String(c.title)}</div>)}
            <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Average Salary</div>
            {compareStats.map((c, i) => <div key={i} className="db-compare-cell" style={{ color: "var(--success)" }}>{String(c.salary)}</div>)}
            <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Years of Study</div>
            {compareStats.map((c, i) => <div key={i} className="db-compare-cell">{String(c.years)}</div>)}
            <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Difficulty (Entry)</div>
            {compareStats.map((c, i) => <div key={i} className="db-compare-cell" style={{ color: String(c.difficulty).includes("High") ? "var(--rose)" : "var(--warn)" }}>{String(c.difficulty)}</div>)}
            <div className="db-compare-cell" style={{ color: "var(--muted)" }}>Work-Life Balance</div>
            {compareStats.map((c, i) => <div key={i} className="db-compare-cell" style={{ color: "var(--teal)" }}>{String(c.wlb)}</div>)}
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button className="db-btn" onClick={() => setActiveTab("counsellor")}>Discuss with an Expert →</button>
          </div>
        </>
      )}
    </div>
  );

  // ── COLLEGES TAB ──
  const renderCollegesTab = () => (
    <div className="db-tab">
      {!hasAssessment ? renderLockedState("🏫", "College Explorer Locked") : (
        <>
          <div className="mb-6">
            <CollegeShortlist collegeShortlist={localUserData?.collegeShortlist || { dream: [], target: [], safe: [] }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CollegeExplorer />
          </div>
        </>
      )}
    </div>
  );

  // ── GROWTH TAB ──
  const renderGrowthTab = () => (
    <div className="db-tab">
      {!hasAssessment ? renderLockedState("📈", "Growth Plan Locked") : (
        <div className="db-two-col">
          <div className="db-card">
            <div className="db-card-header"><div className="db-card-title">🧠 Skill Gap Analysis</div></div>
            <div className="db-card-body">
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>You vs. Ideal {String(bestCareer?.title || "Professional")}</p>
              {skillGaps.length === 0 ? (
                <div style={{ fontSize: "13px", color: "var(--muted)", textAlign: "center", padding: "20px 0" }}>Pending skill gap analysis from AI.</div>
              ) : (
                skillGaps.map((s, i) => (
                  <div key={i} className="db-skill-row">
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                      <span>{String(s.skill)}</span>
                      <span style={{ color: s.status === "Needs Work" ? "var(--rose)" : "var(--success)" }}>{String(s.status)}</span>
                    </div>
                    <div style={{ height: "6px", background: "var(--surface)", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{ width: `${(Number(s.student) / 10) * 100}%`, height: '100%', background: "var(--teal)", borderRadius: "6px" }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-header"><div className="db-card-title">🎥 Career Reality</div></div>
            <div className="db-card-body">
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>Day in the Life of a {String(bestCareer?.title || "Professional")}</p>
              <div className="db-video-ph" onClick={() => showToast("YouTube embed coming soon!")}>
                <div className="db-video-play">▶</div>
              </div>
            </div>
          </div>
          <div className="db-card" style={{ gridColumn: "1 / -1" }}>
            <div className="db-card-header"><div className="db-card-title">🚀 Your Execution Plan</div></div>
            <div className="db-card-body" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {executionPlan.length === 0 ? (
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>Complete profile to unlock your personalized execution plan.</div>
              ) : (
                executionPlan.map((plan, i) => (
                  <div key={i} style={{ flex: 1, minWidth: "200px", padding: "16px", background: "var(--surface)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>{String(plan.title)}</div>
                    <div style={{ fontSize: "13px", color: "var(--muted)" }}>Action: {String(plan.action)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── COUNSELLOR TAB ──
  const sessionsBooked = Number(userProfile.sessionsBooked || 0);
  const BookingEngine = () => {
    const SESSION_PRICE = sessionsBooked === 0 ? 0 : 700;
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedSlot, setSelectedSlot] = React.useState('');
    const [selectedCounsellor, setSelectedCounsellor] = React.useState('');
    const [transactionId, setTransactionId] = React.useState('');
    const [bookingSuccess, setBookingSuccess] = React.useState(false);
    const [bookingError, setBookingError] = React.useState('');

    const TIME_SLOTS = [
      '09:00 AM – 09:45 AM',
      '10:00 AM – 10:45 AM',
      '11:00 AM – 11:45 AM',
      '12:00 PM – 12:45 PM',
      '02:00 PM – 02:45 PM',
      '03:00 PM – 03:45 PM',
      '04:00 PM – 04:45 PM',
      '05:00 PM – 05:45 PM',
    ];

    const COUNSELLORS = [
      { id: 'dr-meera', name: 'Dr. Meera Nair', spec: 'Clinical Psych', emoji: '👩‍⚕️' },
      { id: 'prof-arjun', name: 'Prof. Arjun Kapoor', spec: 'Career Coach', emoji: '👨‍🏫' },
    ];

    const handleSubmit = () => {
      if (!selectedDate) { setBookingError('Please select a date.'); return; }
      if (!selectedSlot) { setBookingError('Please select a time slot.'); return; }
      if (!selectedCounsellor) { setBookingError('Please select a counsellor.'); return; }
      if (SESSION_PRICE > 0 && transactionId.trim().length !== 12) {
        setBookingError('Please enter a valid 12-digit UPI Transaction ID.');
        return;
      }
      setBookingError('');
      const counsellorObj = COUNSELLORS.find(c => c.id === selectedCounsellor);
      submitBooking(studentName, {
        date: selectedDate,
        timeSlot: selectedSlot,
        amount: SESSION_PRICE,
        transactionId: SESSION_PRICE === 0 ? 'FREE_SESSION' : transactionId.trim(),
        counsellorName: counsellorObj ? counsellorObj.name : selectedCounsellor,
      });
      setBookingSuccess(true);
      showToast('🎉 Booking submitted! We will confirm within 24 hours.');
    };

    if (bookingSuccess) {
      return (
        <div style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', border: '2px solid #6EE7B7', borderRadius: 'var(--r-lg)', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '700', color: '#065F46', marginBottom: '8px' }}>Booking Confirmed!</div>
          <div style={{ fontSize: '14px', color: '#047857', lineHeight: '1.7', marginBottom: '20px' }}>
            Your session with <strong>{COUNSELLORS.find(c => c.id === selectedCounsellor)?.name || 'your counsellor'}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has been submitted.
            {SESSION_PRICE > 0 && (
              <span> Transaction ID <strong>{transactionId}</strong> received. Our team will verify your payment within 24 hours.</span>
            )}
          </div>
          <button className="db-btn" onClick={() => { setBookingSuccess(false); setSelectedDate(''); setSelectedSlot(''); setSelectedCounsellor(''); setTransactionId(''); }}>
            Book Another Session
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Pricing Banner */}
        <div style={{
          background: SESSION_PRICE === 0 ? 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' : 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          border: SESSION_PRICE === 0 ? '1.5px solid #6EE7B7' : '1.5px solid #FCD34D',
          borderRadius: 'var(--r-md)', padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: SESSION_PRICE === 0 ? '#065F46' : '#92400E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>
              {SESSION_PRICE === 0 ? '🎁 Special Offer' : '💳 Session Pricing'}
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '900', color: SESSION_PRICE === 0 ? '#059669' : '#B45309' }}>
              {SESSION_PRICE === 0 ? '1st Session FREE!' : '₹700 per session'}
            </div>
            <div style={{ fontSize: '12px', color: SESSION_PRICE === 0 ? '#065F46' : '#92400E', marginTop: '2px', fontWeight: '500' }}>
              {SESSION_PRICE === 0 ? 'No credit card required. Book your free intro session now.' : `You have booked ${sessionsBooked} session${sessionsBooked > 1 ? 's' : ''} so far.`}
            </div>
          </div>
          <div style={{ fontSize: '32px', flexShrink: 0 }}>{SESSION_PRICE === 0 ? '🎉' : '📅'}</div>
        </div>

        {/* Step 1: Select Counsellor */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '10px' }}>Step 1 — Choose Your Expert</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {COUNSELLORS.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCounsellor(c.id)}
                style={{
                  padding: '14px 16px', background: selectedCounsellor === c.id ? '#EEF2FF' : 'var(--surface)',
                  border: `1.5px solid ${selectedCounsellor === c.id ? '#6366F1' : 'var(--border)'}`,
                  borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{c.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.spec}</div>
                </div>
                {selectedCounsellor === c.id && <div style={{ color: '#6366F1', fontWeight: '800', fontSize: '18px' }}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Date Picker */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '8px' }}>Step 2 — Pick a Date</div>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--ink)', background: 'white' }}
          />
        </div>

        {/* Step 3: Time Slot */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '8px' }}>Step 3 — Select a Time Slot</div>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--ink)', background: 'white' }}
          >
            <option value="">-- Select a time slot --</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* Step 4: Payment (only if paid session) */}
        {SESSION_PRICE > 0 && (
          <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '14px' }}>Step 4 — Complete Payment via UPI</div>

            {/* QR Code */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', fontWeight: '600' }}>Scan the QR code below to pay ₹{SESSION_PRICE}</div>
              <img
                src="/upi/SecretSharz/credupi.jpeg"
                alt="Scan to Pay"
                style={{ width: '192px', height: '192px', margin: '0 auto', display: 'block', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              />
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--muted)' }}>UPI ID: <strong style={{ color: 'var(--ink)' }}>secretsharz@upi</strong></div>
            </div>

            {/* Transaction ID Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', marginBottom: '6px' }}>
                Enter 12-Digit UPI Transaction ID *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="e.g., 123456789012"
                maxLength={12}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: `1.5px solid ${transactionId.length === 12 ? '#10B981' : 'var(--border)'}`,
                  borderRadius: 'var(--r-sm)', fontSize: '14px', fontFamily: 'inherit',
                  letterSpacing: '2px', color: 'var(--ink)',
                }}
              />
              <div style={{ fontSize: '11px', color: transactionId.length === 12 ? '#059669' : 'var(--muted)', marginTop: '4px', fontWeight: '600' }}>
                {transactionId.length}/12 digits {transactionId.length === 12 ? '✓ Valid' : ''}
              </div>
            </div>

            {/* Help Section */}
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 'var(--r-sm)', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0369A1', marginBottom: '8px' }}>📖 How to find your Transaction ID</div>
              <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '12px', color: '#0C4A6E', lineHeight: '1.8' }}>
                <li><strong>PhonePe:</strong> Open app → History → Tap the payment → Copy Transaction ID</li>
                <li><strong>Google Pay:</strong> Open app → Transactions → Tap payment → Scroll to Transaction ID</li>
                <li><strong>CRED:</strong> Open app → Pay → History → Tap payment → View Details → UPI Ref No.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Error Message */}
        {bookingError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--r-sm)', padding: '12px 16px', fontSize: '13px', color: '#DC2626', fontWeight: '600' }}>
            ⚠️ {bookingError}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
            color: 'white', border: 'none', borderRadius: 'var(--r-md)',
            fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 6px 20px rgba(232,101,10,0.35)', transition: 'all 0.2s',
          }}
        >
          ✅ Confirm &amp; Submit Booking
        </button>
      </div>
    );
  };

  const renderCounsellorTab = () => (
    <div className="db-tab">
      <div className="db-card" style={{ marginBottom: 0 }}>
        <div className="db-card-header"><div className="db-card-title">📅 Book Expert Session</div></div>
        <div className="db-card-body">
          <BookingEngine />
        </div>
      </div>
    </div>
  );

  // ── REPORT TAB ──
  const renderReportTab = () => (
    <div className="db-tab">
      {!hasAssessment ? renderLockedState("📄", "Full Report Locked") : (
        <>
          {/* ── RIASEC Results Hero Banner ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0D1117 0%, #1C2850 60%, #0A3D2E 100%)',
            borderRadius: 'var(--r-xl)',
            padding: '32px',
            marginBottom: '20px',
            border: '1.5px solid rgba(240,165,0,0.25)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative glow blobs */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,165,0,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--gold)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    🧠 RIASEC Career Intelligence Report
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: '700', color: 'white', lineHeight: '1.2', marginBottom: '4px' }}>
                    {String(studentName)}&apos;s Career Profile
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>
                    Generated by VidyaVantage AI Assessment Engine
                  </div>
                </div>
                {/* Holland Code badge */}
                <div style={{ textAlign: 'center', background: 'rgba(240,165,0,0.12)', border: '1.5px solid rgba(240,165,0,0.3)', borderRadius: 'var(--r-lg)', padding: '16px 24px', flexShrink: 0 }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Holland Code</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: '52px', fontWeight: '900', color: 'var(--gold)', lineHeight: '1', letterSpacing: '6px' }}>
                    {String(localUserData?.riasecCode || '—')}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

              {/* RIASEC Summary */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-md)', padding: '18px 20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Personality & Career Summary
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.8' }}>
                  {String(localUserData?.riasecSummary || 'Your detailed AI-generated psychological and career summary is being finalized based on your latest assessment.')}
                </div>
              </div>

              {/* Top career matches row */}
              {bestCareer && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { career: bestCareer, label: '🏆 Best Match', color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
                    { career: recommendedCareer, label: '✅ Recommended', color: '#FCD34D', bg: 'rgba(252,211,77,0.1)', border: 'rgba(252,211,77,0.2)' },
                    { career: leastCareer, label: '⚠️ Least Suited', color: '#FB7185', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.2)' },
                  ].filter(item => item.career).map((item, i) => (
                    <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 'var(--r-md)', padding: '14px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: item.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{String(item.career.title)}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{String(item.career.subtitle)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${Number(item.career.matchPercent || 0)}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: item.color, flexShrink: 0 }}>{Number(item.career.matchPercent || 0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Download Full Report CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                  💡 Save this report as a PDF to share with parents or counsellors.
                </div>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
                    color: 'white', border: 'none',
                    padding: '13px 28px', borderRadius: '50px',
                    fontSize: '14px', fontWeight: '800',
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 6px 24px rgba(232,101,10,0.45)',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>⬇</span> Download Full Report (PDF)
                </button>
              </div>
            </div>
          </div>

          {/* ── Detailed Report Card ── */}
          <div className="db-card">
            <div className="db-card-header">
              <div className="db-card-title">📄 Detailed Career Report</div>
              <button className="db-btn" onClick={() => window.print()} style={{ fontSize: '12px', padding: '8px 16px' }}>
                🖨️ Print / Save PDF
              </button>
            </div>
            <div className="db-card-body">
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>
                Your full report includes your RIASEC breakdown, stream recommendation, top career matches, skill gap analysis, and a personalised execution plan. Use the <strong>Download Full Report</strong> button above to save it as a PDF.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home': return renderHomeFeed();
      case 'careers': return renderCareersTab();
      case 'compare': return renderCompareTab();
      case 'colleges': return renderCollegesTab();
      case 'growth': return renderGrowthTab();
      case 'counsellor': return renderCounsellorTab();
      case 'report': return renderReportTab();
      default: return renderHomeFeed();
    }
  };

  // ── Image Compression Helper ──
  const compressImage = (file, maxWidth) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ── Photo upload handler (Firestore base64, no Storage) ──
  const handlePhotoUpload = async (file, type) => {
    if (!file || !auth?.currentUser) return;
    setUploadingPhoto(true);
    setPhotoPopup(null);
    try {
      const maxWidth = type === 'cover' ? 500 : 200;
      const base64 = await compressImage(file, maxWidth);
      if (type === 'cover') {
        await updateUserProfile({ coverPhoto: base64 });
      } else {
        await updateUserProfile({ profilePicture: base64 });
      }
      showToast(`✅ ${type === 'cover' ? 'Cover photo' : 'Profile picture'} updated!`);
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast('❌ Upload failed. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoRemove = async (type) => {
    if (!auth?.currentUser) return;
    setPhotoPopup(null);
    try {
      if (type === 'cover') {
        await updateUserProfile({ coverPhoto: null });
      } else {
        await updateUserProfile({ profilePicture: null });
      }
      showToast(`✅ ${type === 'cover' ? 'Cover photo' : 'Profile picture'} removed.`);
    } catch (err) {
      console.error('Photo remove error:', err);
      showToast('❌ Remove failed. Please try again.');
    }
  };

  const handleAcceptTerms = async () => {
    await setDoc(doc(db, "users", "mock-student-id"), { hasAcceptedTerms: true, termsAcceptedAt: new Date().toISOString() }, { merge: true });
    setShowTermsModal(false);
  };

  const handleSaveJournalEntry = async (e) => {
    if (e) e.preventDefault();
    if (!newJournalEntry.trim()) return;
    const entry = { id: Date.now(), text: newJournalEntry, date: new Date().toISOString() };
    const updatedEntries = [entry, ...journalEntries];
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), { journalEntries: updatedEntries }, { merge: true });
      setJournalEntries(updatedEntries);
      setNewJournalEntry('');
      showToast('📓 Journal entry saved successfully!');
    } catch (error) {
      console.error("Error saving journal entry:", error);
      showToast('❌ Failed to save journal entry.');
    }
  };

  // ── Save Profile Handler (Firestore only) ──
  const handleSaveProfile = async () => {
    try {
      // ── Photos: base64 strings from userProfile context ──
      const coverPhotoBase64      = userProfile?.coverPhoto || null;
      const profilePictureBase64  = userProfile?.profilePicture || null;

      const dataToSave = {
        ...localUserData,
        ...profileData,
        internships,
        voluntaryExp,
        workExperience,
        projects,
        lifeSkills,
        roadmapTasks: roadmapTasks,
        // Personal Info
        fatherName, fatherPhone, fatherEmail,
        motherName, motherPhone, motherEmail,
        guardianName, guardianPhone, guardianEmail,
        location: currentLocation,
        hometown,
        // Education
        schoolName, schoolBoard, schoolFrom, schoolTo, schoolCity,
        marks10th, marks12th, stream1112,
        ugInstitution, ugCourse, ugCGPA, ugFrom, ugTo,
        pgInstitution, pgCourse, pgCGPA,
        // Bio
        bio: bio,
        // Hobbies & Interests (tag arrays)
        hobbies:  hobbies,
        music:    music,
        tvShows:  tvShows,
        movies:   movies,
        games:    games,
        sports:   sports,
        athletes: athletes,
        // Photos
        coverPhoto:      coverPhotoBase64,
        profilePicture:  profilePictureBase64,
        savedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', 'mock-student-id'), dataToSave, { merge: true });
      alert('Profile Saved Successfully!');
      showToast('✅ Profile Saved Successfully!');
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="!min-h-screen !bg-[#F4F7FE] !font-sans !text-gray-900">
      {/* Hidden file inputs */}
      <input
        ref={coverPhotoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) handlePhotoUpload(e.target.files[0], 'cover'); e.target.value = ''; }}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) handlePhotoUpload(e.target.files[0], 'avatar'); e.target.value = ''; }}
      />

      <div className="!max-w-7xl !mx-auto !px-4 !py-8 !flex !flex-col lg:!flex-row !gap-8 !w-full">
        <input
          type="file"
          id="coverPhotoUpload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              const base64 = await compressImage(file, 500);
              await updateUserProfile({ coverPhoto: base64 });
              showToast('✅ Cover photo updated!');
            }
            e.target.value = '';
          }}
        />
        <input
          type="file"
          id="profilePicUpload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              const base64 = await compressImage(file, 200);
              await updateUserProfile({ profilePicture: base64 });
              showToast('✅ Profile picture updated!');
            }
            e.target.value = '';
          }}
        />
        <aside className="!w-full lg:!w-[320px] !flex-shrink-0 !flex !flex-col !gap-6">
          <div className="profile-hero-container">
            <div className="profile-cover-photo" style={{ backgroundImage: userProfile?.coverPhoto ? `url(${userProfile.coverPhoto})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {/* Cover photo edit button */}
              <button
                className="edit-cover-btn"
                onClick={() => document.getElementById('coverPhotoUpload').click()}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? '⏳' : '📷'} {uploadingPhoto ? 'Uploading…' : 'Edit Cover Photo'}
              </button>

              {/* Cover photo popup */}
              {photoPopup === 'cover' && (
                <div
                  ref={photoPopupRef}
                  style={{
                    position: 'absolute', bottom: '56px', right: '16px',
                    background: '#1E293B', border: '1px solid #334155',
                    borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    zIndex: 500, overflow: 'hidden', minWidth: '200px',
                    animation: 'alertsSlideDown 0.18s ease',
                  }}
                >
                  <button
                    onClick={() => coverPhotoInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#E4E6EB', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    📤 Upload Photo
                  </button>
                  {userProfile?.coverPhoto && (
                    <button
                      onClick={() => handlePhotoRemove('cover')}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', borderTop: '1px solid #334155' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      🗑️ Remove Photo
                    </button>
                  )}
                  <button
                    onClick={() => setPhotoPopup(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', borderTop: '1px solid #334155' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}

              {/* Avatar wrapper with camera overlay */}
              <div
                className="profile-avatar-wrapper"
                onClick={() => document.getElementById('profilePicUpload').click()}
                style={{ cursor: 'pointer' }}
              >
                {userProfile?.profilePicture
                  ? <img src={userProfile.profilePicture} alt="avatar" className="object-cover w-full h-48" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className="profile-avatar-fallback">{userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}</span>
                }
                <div className="avatar-camera-overlay">
                  <span>📷</span>
                  <p>Change<br/>Photo</p>
                </div>

                {/* Avatar popup */}
                {photoPopup === 'avatar' && (
                  <div
                    style={{
                      position: 'absolute', top: '100%', left: '0',
                      background: '#1E293B', border: '1px solid #334155',
                      borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                      zIndex: 500, overflow: 'hidden', minWidth: '200px',
                      marginTop: '8px',
                      animation: 'alertsSlideDown 0.18s ease',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#E4E6EB', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      📤 Upload Photo
                    </button>
                    {userProfile?.profilePicture && (
                      <button
                        onClick={() => handlePhotoRemove('avatar')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', borderTop: '1px solid #334155' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        🗑️ Remove Photo
                      </button>
                    )}
                    <button
                      onClick={() => setPhotoPopup(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', borderTop: '1px solid #334155' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="profile-identity-row">
              <div className="profile-name-section">
                <h1>{studentName}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editingItem === 'bio' ? (
                    <input className="form-input" style={{ margin: 0, width: '300px' }} defaultValue={bio || '🚀 Ready to build my future • Passionate about Learning'} onBlur={() => setEditingItem(null)} autoFocus />
                  ) : (
                    <>
                      <p style={{ color: '#B0B3B8', margin: '5px 0' }}>{bio || '🚀 Ready to build my future • Passionate about Learning'}</p>
                      <span style={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => setEditingItem('bio')}>✏️</span>
                    </>
                  )}
                </div>
                <div className="profile-pinned-details">
                  {/* ── PINNED DETAILS FALLBACK ── */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📍{' '}
                    {userProfile?.location && userProfile.location.trim() !== ''
                      ? userProfile.location
                      : <span style={{ color: '#6B7280', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Update your location
                          <button
                            onClick={() => setShowProfileEditor(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '13px', color: '#9CA3AF' }}
                            title="Edit location"
                          >✏️</button>
                        </span>
                    }
                  </span>
                  <span>🎓 Secret Sharz</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    💡{' '}
                    {userProfile?.interests && userProfile.interests.length > 0
                      ? userProfile.interests[0]
                      : <span style={{ color: '#6B7280', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Add your interests
                          <button
                            onClick={() => setShowProfileEditor(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '13px', color: '#9CA3AF' }}
                            title="Add interests"
                          >✏️</button>
                        </span>
                    }
                  </span>
                  <span>🔑 RIASEC: {userProfile?.riasecCode || 'Pending'}</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-primary-social" onClick={() => { setActiveView('career-report'); document.querySelector('.about-container')?.scrollIntoView({ behavior: 'smooth' }); }}>📘 Full Report</button>
                <button className="btn-secondary-social" onClick={() => { setActiveView('personal-info'); document.querySelector('.about-container').scrollIntoView({ behavior: 'smooth' }); }}>✏️ Edit</button>
                <button className="btn-primary-social" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }} onClick={handleSaveProfile}>💾 Save Profile</button>
              </div>
            </div>
          </div>
          {/* NESTED ABOUT SECTION */}
            <div className="about-sidebar" style={{marginTop: '20px'}}>
              <h3>About</h3>
              <div className={`about-nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>Overview</div>
              <div className={`about-nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>My Profile</div>
              <div className={`about-nav-item ${activeView === 'personal-info' ? 'active' : ''}`} onClick={() => setActiveView('personal-info')}>Personal Information</div>
              <div className={`about-nav-item ${activeView === 'education' ? 'active' : ''}`} onClick={() => setActiveView('education')}>Education</div>
              <div className={`about-nav-item ${activeView === 'work-experience' ? 'active' : ''}`} onClick={() => setActiveView('work-experience')}>Work Experience</div>
              <div className={`about-nav-item ${activeView === 'links' ? 'active' : ''}`} onClick={() => setActiveView('links')}>Project Links</div>
              <div className={`about-nav-item ${activeView === 'hobbies' ? 'active' : ''}`} onClick={() => setActiveView('hobbies')}>Hobbies & Interests</div>
              {userTrack !== 'career' && (
                <>
                  <div className={`about-nav-item ${activeView === 'journal' ? 'active' : ''}`} onClick={() => setActiveView('journal')}>📓 Clarity Journal</div>
                  <div className={`about-nav-item ${activeView === 'life-skills' ? 'active' : ''}`} onClick={() => setActiveView('life-skills')}>🕸️ Life Skills Matrix</div>
                </>
              )}
              {userTrack !== 'counselling' && (
                <>
                  <div className={`about-nav-item ${activeView === 'career-report' ? 'active' : ''}`} onClick={() => setActiveView('career-report')}>Career Report</div>
                  <div className={`about-nav-item ${activeView === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveView('roadmap')}>🗺️ Career Roadmap</div>
                </>
              )}
              <div className={`about-nav-item ${activeView === 'messages' ? 'active' : ''}`} onClick={() => setActiveView('messages')}>💬 Messages {unreadCount > 0 && <span style={{background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', marginLeft: '5px'}}>{unreadCount}</span>}</div>
            </div>
          </aside>

          <main className="!flex-1 !flex !flex-col !gap-6 !min-w-0">
            <div className="about-content">
              {activeView === 'profile' && (
                <StudentProfileView studentDoc={localUserData} />
              )}
              {activeView === 'overview' && (
                <div>
                  <div className="about-content-header">Dashboard Overview</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* ── Welcome Back Banner ── */}
                    <div style={{ background: 'linear-gradient(135deg, #1C2333 0%, #1C2850 100%)', borderRadius: '12px', padding: '20px 24px', border: '1px solid #3A3B3C', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#F0A500', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Welcome Back</div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '700', color: '#E4E6EB', lineHeight: '1.2', marginBottom: '6px' }}>
                          Hey {firstName}, <em style={{ fontStyle: 'italic', color: '#F0A500' }}>own your future.</em>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(228,230,235,0.55)', lineHeight: '1.6' }}>
                          {hasAssessment
                            ? `Your RIASEC code is ${String(localUserData.riasecCode)}. Your best path is ${String(bestCareer?.title || '')}.`
                            : 'Take our free AI assessment to unlock your career roadmap.'}
                        </div>
                      </div>
                      {!hasAssessment && (
                        <button
                          onClick={() => setShowAssessment(true)}
                          style={{ background: 'linear-gradient(135deg, #E8650A, #F0A500)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          Take Assessment 🚀
                        </button>
                      )}
                    </div>

                    {/* ── Clarity Index Stats ── */}
                    <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                      <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', marginBottom: '6px' }}>🎯</div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '700', color: '#E4E6EB', lineHeight: '1' }}>{hasAssessment ? '8' : '0'}</div>
                        <div style={{ fontSize: '10px', color: '#B0B3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Clarity Index</div>
                      </div>
                      <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowProfileEditor(true)}>
                        <div style={{ fontSize: '22px', marginBottom: '6px' }}>⚡</div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '700', color: '#F0A500', lineHeight: '1' }}>{exPoints}</div>
                        <div style={{ fontSize: '10px', color: '#B0B3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>EX Points</div>
                      </div>
                    </div>

                    {/* ── EX Points Progress Bar ── */}
                    <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '16px', cursor: 'pointer' }} onClick={() => setShowProfileEditor(true)} title="Click to earn more EX Points">
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#B0B3B8', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>⚡ EX Points Progress</div>
                      {exPoints === 0 ? (
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                          <div style={{ fontSize: '28px', margin: '4px 0' }}>🌟</div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#E4E6EB', lineHeight: '1.4' }}>Complete your profile to earn your first 50 XP.</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '900', color: '#F0A500', lineHeight: '1', marginBottom: '8px' }}>{exPoints} <span style={{ fontSize: '14px', fontWeight: '600', color: '#B0B3B8' }}>/ {maxXp}</span></div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${xpPct}%`, background: 'linear-gradient(90deg, #E8650A, #F0A500)', borderRadius: '6px', transition: 'width 1s ease' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#B0B3B8', fontWeight: '600' }}>
                            <span>Level {xpLevel}</span><span>{xpPct}% to next</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* ── Your RIASEC Profile Card ── */}
                    {hasAssessment && (
                      <div style={{ background: 'linear-gradient(135deg, #0D1117 0%, #1C2850 60%, #0A3D2E 100%)', border: '1px solid rgba(240,165,0,0.2)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '800', color: '#F0A500', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>🧠 Your RIASEC Profile</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '36px', fontWeight: '900', color: '#F0A500', letterSpacing: '4px' }}>{String(localUserData?.riasecCode || '')}</div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: 'rgba(228,230,235,0.4)', fontWeight: '600', marginBottom: '2px' }}>Top Match</div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#E4E6EB' }}>
                              {String(
                                (localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 0)
                                  ? localUserData.topCareerMatches[0].name
                                  : (localUserData?.bestCareer?.title || 'Pending')
                              )}
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#34D399' }}>
                              {localUserData?.topCareerMatches?.[0]?.matchScore
                                ? `${Number(localUserData.topCareerMatches[0].matchScore)}%`
                                : `${Number(localUserData?.bestCareer?.matchPercent || 0)}%`} fit
                            </div>
                          </div>
                        </div>
                        {localUserData?.riasecSummary && (
                          <div style={{ fontSize: '12px', color: 'rgba(228,230,235,0.6)', lineHeight: '1.7', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '12px' }}>
                            {String(localUserData.riasecSummary).substring(0, 150)}…
                          </div>
                        )}
                        <button
                          onClick={() => setShowCareerMatchesModal(true)}
                          style={{ width: '100%', padding: '9px', background: '#2D88FF', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          🎯 View Career Matches
                        </button>
                      </div>
                    )}

                    {/* ── Stream Recommendation ── */}
                    {hasAssessment && streamRec && (
                      <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '10px', color: '#34D399', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>🎯 Stream Recommendation</div>
                          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: '700', color: '#E4E6EB', marginBottom: '4px' }}>
                            {String(streamRec.name)} <span style={{ color: '#34D399', fontSize: '14px' }}>({Number(streamRec.match)}% Match)</span>
                          </div>
                          <ul style={{ margin: '4px 0 0 16px', fontSize: '12px', color: '#B0B3B8', fontWeight: '500' }}>
                            {(streamRec.reasons || []).map((r, i) => <li key={i}>{String(r)}</li>)}
                          </ul>
                        </div>
                        <button
                          onClick={() => window.location.href = '/colleges'}
                          style={{ background: 'linear-gradient(135deg, #E8650A, #F0A500)', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          Explore Colleges
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* ── PERSONAL INFORMATION TAB ── */}
              {activeView === 'personal-info' && (
                <div>
                  <div className="about-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Personal Information</span>
                    {!isEditingTab && (
                      <button onClick={() => setIsEditingTab(true)} className="btn-secondary-social" style={{ padding: '6px 12px', fontSize: '12px' }}>✏️ Edit Information</button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!isEditingTab ? (
                      <>
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>👨 Father</div>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Name:</strong> {fatherName || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Phone:</strong> {fatherPhone || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Email:</strong> {fatherEmail || 'Not added yet'}</p>
                        </div>
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>👩 Mother</div>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Name:</strong> {motherName || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Phone:</strong> {motherPhone || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Email:</strong> {motherEmail || 'Not added yet'}</p>
                        </div>
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🧑 Guardian</div>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Name:</strong> {guardianName || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Phone:</strong> {guardianPhone || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Email:</strong> {guardianEmail || 'Not added yet'}</p>
                        </div>
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>📍 Location Details</div>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Current Location:</strong> {currentLocation || 'Not added yet'}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#E4E6EB' }}><strong>Hometown:</strong> {hometown || 'Not added yet'}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Father */}
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>👨 Father</div>
                          <input className="form-input" type="text" placeholder="Father's Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                          <input className="form-input" type="tel" placeholder="Father's Phone Number" value={fatherPhone} onChange={(e) => setFatherPhone(e.target.value)} />
                          <input className="form-input" type="email" placeholder="Father's Email ID" value={fatherEmail} onChange={(e) => setFatherEmail(e.target.value)} />
                        </div>
                        {/* Mother */}
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>👩 Mother</div>
                          <input className="form-input" type="text" placeholder="Mother's Name" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                          <input className="form-input" type="tel" placeholder="Mother's Phone Number" value={motherPhone} onChange={(e) => setMotherPhone(e.target.value)} />
                          <input className="form-input" type="email" placeholder="Mother's Email ID" value={motherEmail} onChange={(e) => setMotherEmail(e.target.value)} />
                        </div>
                        {/* Guardian */}
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🧑 Guardian</div>
                          <input className="form-input" type="text" placeholder="Guardian's Name" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
                          <input className="form-input" type="tel" placeholder="Guardian's Phone Number" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
                          <input className="form-input" type="email" placeholder="Guardian's Email ID" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} />
                        </div>
                        {/* Location */}
                        <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>📍 Location Details</div>
                          <input className="form-input" type="text" placeholder="Current Location" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} />
                          <input className="form-input" type="text" placeholder="Home Town" value={hometown} onChange={(e) => setHometown(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <button onClick={() => setIsEditingTab(false)} className="btn-secondary-social">Cancel</button>
                          <button onClick={async () => { await handleSaveProfile(); setIsEditingTab(false); }} className="btn-primary-social">Save Changes</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ── EDUCATION TAB ── */}
              {activeView === 'education' && (
                <div>
                  <div className="about-content-header">
                    <span>Education</span>
                    <span className="timeline-action" title="Add Education" onClick={() => { setEditingItem('new-edu'); setEduType(''); }}>➕</span>
                  </div>

                  {/* CONDITIONAL RENDER: FORM vs DISPLAY */}
                  {editingItem === 'edu-1' || editingItem === 'new-edu' ? (
                    <div className="inline-form">
                      {/* Type Dropdown */}
                      <select className="form-input" value={eduType} onChange={(e) => setEduType(e.target.value)}>
                        <option value="">Select Type</option>
                        <option value="School">School</option>
                        <option value="University">University</option>
                      </select>

                      <input className="form-input" list="institution-list" placeholder="Start typing your institution..." defaultValue={editingItem === 'edu-1' ? "St Aloysius College - Autonomous" : ""} />
                      <datalist id="institution-list">
                        {eduType === 'School'
                          ? SCHOOLS.map(item => <option key={item} value={item} />)
                          : eduType === 'University'
                          ? COLLEGES.map(item => <option key={item} value={item} />)
                          : [...SCHOOLS, ...COLLEGES].map(item => <option key={item} value={item} />)
                        }
                      </datalist>

                      {/* Conditional: hide Degree/Stream for School, show Board instead */}
                      {eduType === 'School' ? (
                        <select className="form-input">
                          <option value="">Select Board</option>
                          <option value="ICSE">ICSE</option>
                          <option value="CBSE">CBSE</option>
                          <option value="State">State</option>
                          <option value="IB">IB</option>
                        </select>
                      ) : (
                        <input className="form-input" type="text" placeholder="Degree / Stream" defaultValue={editingItem === 'edu-1' ? "Student" : ""} />
                      )}

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#E4E6EB', marginBottom: '6px' }}>Date of Completion / Expected Completion</label>
                        <select className="form-input" style={{ width: '100%', marginBottom: 0 }}>
                          <option>Select Year</option>
                          <option>Present</option>
                          {Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i).map(year => (<option key={year} value={year}>{year}</option>))}
                        </select>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E4E6EB', marginBottom: '15px', fontSize: '14px' }}>
                        <input type="checkbox" defaultChecked /> I currently study here
                      </label>

                      <input className="form-input" type="text" placeholder="City/Town" defaultValue={editingItem === 'edu-1' ? "Mangaluru" : ""} />
                      <textarea className="form-input" placeholder="Description" rows="3"></textarea>

                      <div className="form-actions">
                        {editingItem !== 'new-edu' && (
                          <button style={{ marginRight: 'auto', background: 'transparent', color: '#B0B3B8', border: 'none', cursor: 'pointer', padding: '8px 16px' }}>🗑️ Remove</button>
                        )}
                        <button className="btn-secondary-social" onClick={() => { setEditingItem(null); setEduType(''); }}>Cancel</button>
                        <button className="btn-primary-social" onClick={() => { setEditingItem(null); setEduType(''); }}>Save</button>
                      </div>
                    </div>
                  ) : (
                    <div className="timeline-item">
                      <div className="timeline-icon">🎓</div>
                      <div className="timeline-details">
                        <div className="timeline-title">St Aloysius College - Autonomous</div>
                        <div className="timeline-subtitle">Student • Mangaluru</div>
                      </div>
                      <div className="timeline-action" onClick={() => { setEditingItem('edu-1'); setEduType('University'); }}>✏️</div>
                    </div>
                  )}
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveProfile} className="btn-save btn-primary-social">Save Changes</button>
                  </div>
                </div>
              )}

              {/* ── WORK EXPERIENCE TAB ── */}
              {activeView === 'work-experience' && (
                <div>
                  {/* Sub-section 1: Internships */}
                  <div style={{ borderBottom: '1px solid #3A3B3C', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div className="about-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Internships</span>
                      <span className="timeline-action" title="Add Internship" onClick={() => {
                        setInternCompany('');
                        setInternRole('');
                        setInternFrom('');
                        setInternTo('');
                        setInternCurrent(false);
                        setInternCity('');
                        setInternDuties('');
                        setInternResponsibilities('');
                        setEditingItem('new-intern');
                      }}>➕</span>
                    </div>

                    {editingItem === 'new-intern' || editingItem?.startsWith('intern-') ? (
                      <div className="inline-form">
                        <input className="form-input" type="text" placeholder="Company / Organization" value={internCompany} onChange={(e) => setInternCompany(e.target.value)} />
                        <input className="form-input" type="text" placeholder="Role / Position" value={internRole} onChange={(e) => setInternRole(e.target.value)} />

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#B0B3B8', marginBottom: '4px' }}>From Date</label>
                            <input type="date" className="form-input" value={internFrom} onChange={(e) => setInternFrom(e.target.value)} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#B0B3B8', marginBottom: '4px' }}>To Date</label>
                            <input type="date" className="form-input" value={internTo} onChange={(e) => setInternTo(e.target.value)} disabled={internCurrent} />
                          </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E4E6EB', marginBottom: '15px', fontSize: '14px' }}>
                          <input type="checkbox" checked={internCurrent} onChange={(e) => setInternCurrent(e.target.checked)} /> I currently intern here
                        </label>

                        <input className="form-input" type="text" placeholder="City/Town" value={internCity} onChange={(e) => setInternCity(e.target.value)} />
                        <textarea className="form-input" placeholder="Duties" rows="2" value={internDuties} onChange={(e) => setInternDuties(e.target.value)}></textarea>
                        <textarea className="form-input" placeholder="Responsibilities" rows="2" value={internResponsibilities} onChange={(e) => setInternResponsibilities(e.target.value)}></textarea>

                        <div className="form-actions">
                          {editingItem !== 'new-intern' && (
                            <button 
                              type="button"
                              onClick={() => {
                                const idx = parseInt(editingItem.split('-')[1]);
                                setInternships(internships.filter((_, i) => i !== idx));
                                setEditingItem(null);
                              }}
                              style={{ marginRight: 'auto', background: 'transparent', color: '#B0B3B8', border: 'none', cursor: 'pointer', padding: '8px 16px' }}
                            >
                              🗑️ Remove
                            </button>
                          )}
                          <button className="btn-secondary-social" onClick={() => setEditingItem(null)}>Cancel</button>
                          <button 
                            className="btn-primary-social" 
                            onClick={() => {
                              const itemPayload = {
                                company: internCompany,
                                role: internRole,
                                from: internFrom,
                                to: internCurrent ? 'Present' : internTo,
                                current: internCurrent,
                                city: internCity,
                                duties: internDuties,
                                responsibilities: internResponsibilities
                              };
                              if (editingItem === 'new-intern') {
                                setInternships([...internships, itemPayload]);
                              } else {
                                const idx = parseInt(editingItem.split('-')[1]);
                                const updated = [...internships];
                                updated[idx] = itemPayload;
                                setInternships(updated);
                              }
                              setEditingItem(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {internships.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {internships.map((item, idx) => (
                              <div key={idx} className="timeline-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18191A', padding: '16px', borderRadius: '10px', border: '1px solid #3A3B3C' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <div style={{ fontSize: '24px' }}>💼</div>
                                  <div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#E4E6EB' }}>{item.role} @ {item.company}</div>
                                    <div style={{ fontSize: '13px', color: '#B0B3B8' }}>{item.from} – {item.to} &nbsp;|&nbsp; {item.city}</div>
                                    {item.duties && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '6px' }}><strong>Duties:</strong> {item.duties}</div>}
                                    {item.responsibilities && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '4px' }}><strong>Responsibilities:</strong> {item.responsibilities}</div>}
                                  </div>
                                </div>
                                <div 
                                  style={{ cursor: 'pointer', fontSize: '14px' }} 
                                  onClick={() => {
                                    setInternCompany(item.company || '');
                                    setInternRole(item.role || '');
                                    setInternFrom(item.from || '');
                                    setInternTo(item.to === 'Present' ? '' : item.to || '');
                                    setInternCurrent(item.to === 'Present' || !!item.current);
                                    setInternCity(item.city || '');
                                    setInternDuties(item.duties || '');
                                    setInternResponsibilities(item.responsibilities || '');
                                    setEditingItem(`intern-${idx}`);
                                  }}
                                >
                                  ✏️
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px', color: '#B0B3B8', fontSize: '14px' }}>
                            No internships added yet. Click ➕ above to add one.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub-section 2: Voluntary Experience */}
                  <div style={{ borderBottom: '1px solid #3A3B3C', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div className="about-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Voluntary Experience</span>
                      <span className="timeline-action" title="Add Voluntary Experience" onClick={() => {
                        setVolunteerOrg('');
                        setVolunteerRole('');
                        setVolunteerFrom('');
                        setVolunteerTo('');
                        setVolunteerCurrent(false);
                        setVolunteerCity('');
                        setVolunteerDuties('');
                        setVolunteerResponsibilities('');
                        setEditingItem('new-voluntary');
                      }}>➕</span>
                    </div>

                    {editingItem === 'new-voluntary' || editingItem?.startsWith('voluntary-') ? (
                      <div className="inline-form">
                        <input className="form-input" type="text" placeholder="Organization / Cause" value={volunteerOrg} onChange={(e) => setVolunteerOrg(e.target.value)} />
                        <input className="form-input" type="text" placeholder="Role / Title" value={volunteerRole} onChange={(e) => setVolunteerRole(e.target.value)} />

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#B0B3B8', marginBottom: '4px' }}>From Date</label>
                            <input type="date" className="form-input" value={volunteerFrom} onChange={(e) => setVolunteerFrom(e.target.value)} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#B0B3B8', marginBottom: '4px' }}>To Date</label>
                            <input type="date" className="form-input" value={volunteerTo} onChange={(e) => setVolunteerTo(e.target.value)} disabled={volunteerCurrent} />
                          </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E4E6EB', marginBottom: '15px', fontSize: '14px' }}>
                          <input type="checkbox" checked={volunteerCurrent} onChange={(e) => setVolunteerCurrent(e.target.checked)} /> I currently volunteer here
                        </label>

                        <input className="form-input" type="text" placeholder="City/Town" value={volunteerCity} onChange={(e) => setVolunteerCity(e.target.value)} />
                        <textarea className="form-input" placeholder="Duties" rows="2" value={volunteerDuties} onChange={(e) => setVolunteerDuties(e.target.value)}></textarea>
                        <textarea className="form-input" placeholder="Responsibilities" rows="2" value={volunteerResponsibilities} onChange={(e) => setVolunteerResponsibilities(e.target.value)}></textarea>

                        <div className="form-actions">
                          {editingItem !== 'new-voluntary' && (
                            <button 
                              type="button"
                              onClick={() => {
                                const idx = parseInt(editingItem.split('-')[1]);
                                setVoluntaryExp(voluntaryExp.filter((_, i) => i !== idx));
                                setEditingItem(null);
                              }}
                              style={{ marginRight: 'auto', background: 'transparent', color: '#B0B3B8', border: 'none', cursor: 'pointer', padding: '8px 16px' }}
                            >
                              🗑️ Remove
                            </button>
                          )}
                          <button className="btn-secondary-social" onClick={() => setEditingItem(null)}>Cancel</button>
                          <button 
                            className="btn-primary-social" 
                            onClick={() => {
                              const itemPayload = {
                                org: volunteerOrg,
                                role: volunteerRole,
                                from: volunteerFrom,
                                to: volunteerCurrent ? 'Present' : volunteerTo,
                                current: volunteerCurrent,
                                city: volunteerCity,
                                duties: volunteerDuties,
                                responsibilities: volunteerResponsibilities
                              };
                              if (editingItem === 'new-voluntary') {
                                setVoluntaryExp([...voluntaryExp, itemPayload]);
                              } else {
                                const idx = parseInt(editingItem.split('-')[1]);
                                const updated = [...voluntaryExp];
                                updated[idx] = itemPayload;
                                setVoluntaryExp(updated);
                              }
                              setEditingItem(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {voluntaryExp.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {voluntaryExp.map((item, idx) => (
                              <div key={idx} className="timeline-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18191A', padding: '16px', borderRadius: '10px', border: '1px solid #3A3B3C' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <div style={{ fontSize: '24px' }}>🤝</div>
                                  <div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#E4E6EB' }}>{item.role} @ {item.org}</div>
                                    <div style={{ fontSize: '13px', color: '#B0B3B8' }}>{item.from} – {item.to} &nbsp;|&nbsp; {item.city}</div>
                                    {item.duties && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '6px' }}><strong>Duties:</strong> {item.duties}</div>}
                                    {item.responsibilities && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '4px' }}><strong>Responsibilities:</strong> {item.responsibilities}</div>}
                                  </div>
                                </div>
                                <div 
                                  style={{ cursor: 'pointer', fontSize: '14px' }} 
                                  onClick={() => {
                                    setVolunteerOrg(item.org || '');
                                    setVolunteerRole(item.role || '');
                                    setVolunteerFrom(item.from || '');
                                    setVolunteerTo(item.to === 'Present' ? '' : item.to || '');
                                    setVolunteerCurrent(item.to === 'Present' || !!item.current);
                                    setVolunteerCity(item.city || '');
                                    setVolunteerDuties(item.duties || '');
                                    setVolunteerResponsibilities(item.responsibilities || '');
                                    setEditingItem(`voluntary-${idx}`);
                                  }}
                                >
                                  ✏️
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px', color: '#B0B3B8', fontSize: '14px' }}>
                            No voluntary experience added yet. Click ➕ above to add one.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub-section 3: Work Experience */}
                  <div style={{ paddingBottom: '12px' }}>
                    <div className="about-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Work Experience</span>
                      <span className="timeline-action" title="Add Work Experience" onClick={() => {
                        setWorkCompany('');
                        setWorkRole('');
                        setWorkFrom('');
                        setWorkTo('');
                        setWorkCurrent(false);
                        setWorkCity('');
                        setWorkDuties('');
                        setWorkResponsibilities('');
                        setEditingItem('new-work');
                      }}>➕</span>
                    </div>

                    {editingItem === 'new-work' || editingItem?.startsWith('work-') ? (
                      <div className="inline-form">
                        <input className="form-input" type="text" placeholder="Company / Organization" value={workCompany} onChange={(e) => setWorkCompany(e.target.value)} />
                        <input className="form-input" type="text" placeholder="Role / Position" value={workRole} onChange={(e) => setWorkRole(e.target.value)} />

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#B0B3B8', marginBottom: '4px' }}>From Date</label>
                            <input type="date" className="form-input" value={workFrom} onChange={(e) => setWorkFrom(e.target.value)} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#B0B3B8', marginBottom: '4px' }}>To Date</label>
                            <input type="date" className="form-input" value={workTo} onChange={(e) => setWorkTo(e.target.value)} disabled={workCurrent} />
                          </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E4E6EB', marginBottom: '15px', fontSize: '14px' }}>
                          <input type="checkbox" checked={workCurrent} onChange={(e) => setWorkCurrent(e.target.checked)} /> I currently work here
                        </label>

                        <input className="form-input" type="text" placeholder="City/Town" value={workCity} onChange={(e) => setWorkCity(e.target.value)} />
                        <textarea className="form-input" placeholder="Duties" rows="2" value={workDuties} onChange={(e) => setWorkDuties(e.target.value)}></textarea>
                        <textarea className="form-input" placeholder="Responsibilities" rows="2" value={workResponsibilities} onChange={(e) => setWorkResponsibilities(e.target.value)}></textarea>

                        <div className="form-actions">
                          {editingItem !== 'new-work' && (
                            <button 
                              type="button"
                              onClick={() => {
                                const idx = parseInt(editingItem.split('-')[1]);
                                setWorkExperience(workExperience.filter((_, i) => i !== idx));
                                setEditingItem(null);
                              }}
                              style={{ marginRight: 'auto', background: 'transparent', color: '#B0B3B8', border: 'none', cursor: 'pointer', padding: '8px 16px' }}
                            >
                              🗑️ Remove
                            </button>
                          )}
                          <button className="btn-secondary-social" onClick={() => setEditingItem(null)}>Cancel</button>
                          <button 
                            className="btn-primary-social" 
                            onClick={() => {
                              const itemPayload = {
                                company: workCompany,
                                role: workRole,
                                from: workFrom,
                                to: workCurrent ? 'Present' : workTo,
                                current: workCurrent,
                                city: workCity,
                                duties: workDuties,
                                responsibilities: workResponsibilities
                              };
                              if (editingItem === 'new-work') {
                                setWorkExperience([...workExperience, itemPayload]);
                              } else {
                                const idx = parseInt(editingItem.split('-')[1]);
                                const updated = [...workExperience];
                                updated[idx] = itemPayload;
                                setWorkExperience(updated);
                              }
                              setEditingItem(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {workExperience.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {workExperience.map((item, idx) => (
                              <div key={idx} className="timeline-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18191A', padding: '16px', borderRadius: '10px', border: '1px solid #3A3B3C' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <div style={{ fontSize: '24px' }}>💼</div>
                                  <div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#E4E6EB' }}>{item.role} @ {item.company}</div>
                                    <div style={{ fontSize: '13px', color: '#B0B3B8' }}>{item.from} – {item.to} &nbsp;|&nbsp; {item.city}</div>
                                    {item.duties && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '6px' }}><strong>Duties:</strong> {item.duties}</div>}
                                    {item.responsibilities && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '4px' }}><strong>Responsibilities:</strong> {item.responsibilities}</div>}
                                  </div>
                                </div>
                                <div 
                                  style={{ cursor: 'pointer', fontSize: '14px' }} 
                                  onClick={() => {
                                    setWorkCompany(item.company || '');
                                    setWorkRole(item.role || '');
                                    setWorkFrom(item.from || '');
                                    setWorkTo(item.to === 'Present' ? '' : item.to || '');
                                    setWorkCurrent(item.to === 'Present' || !!item.current);
                                    setWorkCity(item.city || '');
                                    setWorkDuties(item.duties || '');
                                    setWorkResponsibilities(item.responsibilities || '');
                                    setEditingItem(`work-${idx}`);
                                  }}
                                >
                                  ✏️
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px', color: '#B0B3B8', fontSize: '14px' }}>
                            No work experience added yet. Click ➕ above to add one.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveProfile} className="btn-save btn-primary-social">Save Changes</button>
                  </div>
                </div>
              )}

              {/* ── PROJECT LINKS TAB ── */}
              {activeView === 'links' && (
                <div>
                  <div className="about-content-header">
                    <span>Project Links</span>
                    <span className="timeline-action" title="Add Project Link" onClick={() => {
                      setProjectTitle('');
                      setProjectUrl('');
                      setProjectDescription('');
                      setEditingItem('new-link');
                    }}>➕</span>
                  </div>

                  {editingItem === 'new-link' || editingItem?.startsWith('link-') ? (
                    <div className="inline-form">
                      <input 
                        className="form-input" 
                        type="text" 
                        placeholder="Project Title" 
                        value={projectTitle} 
                        onChange={(e) => setProjectTitle(e.target.value)} 
                      />
                      <input 
                        className="form-input" 
                        type="url" 
                        placeholder="URL (e.g., GitHub, Drive link)" 
                        value={projectUrl} 
                        onChange={(e) => setProjectUrl(e.target.value)} 
                      />
                      <textarea 
                        className="form-input" 
                        placeholder="Description" 
                        rows="3" 
                        value={projectDescription} 
                        onChange={(e) => setProjectDescription(e.target.value)} 
                      />

                      <div className="form-actions">
                        {editingItem !== 'new-link' && (
                          <button 
                            type="button"
                            onClick={() => {
                              const idx = parseInt(editingItem.split('-')[1]);
                              setProjects(projects.filter((_, i) => i !== idx));
                              setEditingItem(null);
                            }}
                            style={{ marginRight: 'auto', background: 'transparent', color: '#B0B3B8', border: 'none', cursor: 'pointer', padding: '8px 16px' }}
                          >
                            🗑️ Remove
                          </button>
                        )}
                        <button className="btn-secondary-social" onClick={() => setEditingItem(null)}>Cancel</button>
                        <button 
                          className="btn-primary-social" 
                          onClick={() => {
                            if (editingItem === 'new-link') {
                              setProjects([...projects, { title: projectTitle, url: projectUrl, description: projectDescription }]);
                            } else {
                              const idx = parseInt(editingItem.split('-')[1]);
                              const updated = [...projects];
                              updated[idx] = { title: projectTitle, url: projectUrl, description: projectDescription };
                              setProjects(updated);
                            }
                            setEditingItem(null);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {projects.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                          {projects.map((proj, idx) => (
                            <div key={idx} className="timeline-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18191A', padding: '16px', borderRadius: '10px', border: '1px solid #3A3B3C' }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ fontSize: '24px' }}>🔗</div>
                                <div>
                                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#E4E6EB' }}>{proj.title}</div>
                                  <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#2D88FF', textDecoration: 'none' }}>{proj.url}</a>
                                  {proj.description && <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '6px' }}>{proj.description}</div>}
                                </div>
                              </div>
                              <div 
                                style={{ cursor: 'pointer', fontSize: '14px' }} 
                                onClick={() => {
                                  setProjectTitle(proj.title || '');
                                  setProjectUrl(proj.url || '');
                                  setProjectDescription(proj.description || '');
                                  setEditingItem(`link-${idx}`);
                                }}
                              >
                                ✏️
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔗</div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: '#E4E6EB', marginBottom: '6px' }}>Project Links</div>
                        <div style={{ fontSize: '13px', color: '#B0B3B8', marginBottom: '16px' }}>Share your GitHub repos, portfolio, or Drive links.</div>
                        <button 
                          className="btn-primary-social" 
                          onClick={() => {
                            setProjectTitle('');
                            setProjectUrl('');
                            setProjectDescription('');
                            setEditingItem('new-link');
                          }}
                        >
                          ➕ Add Project Link
                        </button>
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveProfile} className="btn-save btn-primary-social">Save Changes</button>
                  </div>
                </div>
              )}

              {/* ── CAREER REPORT TAB ── */}
              {activeView === 'career-report' && (
                <div>
                  <div className="about-content-header">
                    <span>📄 Career Report</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Info Banner */}
                    <div style={{ background: 'linear-gradient(135deg, #1C2333 0%, #1C2850 100%)', border: '1px solid rgba(240,165,0,0.25)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ fontSize: '28px', flexShrink: 0 }}>🧑‍💼</div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Counsellor Section</div>
                        <div style={{ fontSize: '13px', color: 'rgba(228,230,235,0.7)', lineHeight: '1.6' }}>
                          This section will be updated by your assigned counsellor after your session. The report below is a placeholder until your counsellor fills in your personalised career analysis.
                        </div>
                      </div>
                    </div>

                    {/* Section 1: RIASEC Assessment Summary */}
                    <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: '#E4E6EB', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🧠 RIASEC Assessment Summary
                      </h3>
                      <div style={{ fontSize: '13px', color: '#B0B3B8', lineHeight: '1.8' }}>
                        {localUserData?.riasecSummary
                          ? String(localUserData.riasecSummary)
                          : (
                            <span style={{ color: '#6B7280', fontStyle: 'italic' }}>
                              Your RIASEC personality summary will appear here once you complete the VidyaVantage assessment. Your counsellor will add detailed notes after your session.
                            </span>
                          )
                        }
                      </div>
                      {localUserData?.riasecCode && (
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#B0B3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Holland Code:</span>
                          <span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '900', color: '#F0A500', letterSpacing: '3px' }}>{String(localUserData.riasecCode)}</span>
                        </div>
                      )}
                    </div>

                    {/* Section 2: Top 3 Matched Courses */}
                    <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: '#E4E6EB', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🎓 Top 3 Matched Courses
                      </h3>
                      {[
                        { title: localUserData?.bestCareer?.title || 'Course 1', match: localUserData?.bestCareer?.matchPercent || null, color: '#34D399' },
                        { title: localUserData?.recommendedCareer?.title || 'Course 2', match: localUserData?.recommendedCareer?.matchPercent || null, color: '#FCD34D' },
                        { title: localUserData?.leastCareer?.title || 'Course 3', match: localUserData?.leastCareer?.matchPercent || null, color: '#FB7185' },
                      ].map((course, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #2A2B2C' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '16px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#E4E6EB' }}>
                              {course.title !== 'Course 1' && course.title !== 'Course 2' && course.title !== 'Course 3'
                                ? course.title
                                : <span style={{ color: '#6B7280', fontStyle: 'italic' }}>Pending counsellor update</span>
                              }
                            </span>
                          </div>
                          {course.match && (
                            <span style={{ fontSize: '13px', fontWeight: '800', color: course.color }}>{Number(course.match)}% match</span>
                          )}
                        </div>
                      ))}
                      <div style={{ marginTop: '14px', fontSize: '12px', color: '#6B7280', fontStyle: 'italic', lineHeight: '1.6' }}>
                        Your counsellor will refine these recommendations based on your academic background and personal goals during your session.
                      </div>
                    </div>

                    {/* Section 3: Recommended Colleges */}
                    <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: '#E4E6EB', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🏫 Recommended Colleges
                      </h3>
                      {collegesExt.length > 0 ? (
                        collegesExt.slice(0, 3).map((c, i) => (
                          <div
                            key={i}
                            onClick={() => window.location.href = '/colleges'}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '10px 12px', margin: '0 -12px',
                              borderBottom: i < Math.min(collegesExt.length, 3) - 1 ? '1px solid #2A2B2C' : 'none',
                              cursor: 'pointer', borderRadius: '8px',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ fontSize: '20px' }}>🏫</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#E4E6EB' }}>{String(c.name)}</div>
                              <div style={{ fontSize: '12px', color: '#B0B3B8', marginTop: '2px' }}>📍 {String(c.loc)} &nbsp;|&nbsp; 💰 {String(c.fees)} &nbsp;|&nbsp; 📈 {String(c.placement)}</div>
                            </div>
                            <span style={{ fontSize: '12px', color: '#6B7280', flexShrink: 0 }}>→</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic', lineHeight: '1.7' }}>
                          College recommendations will be added here by your counsellor after reviewing your academic profile, RIASEC results, and career goals. Complete your assessment to unlock AI-generated suggestions.
                        </div>
                      )}
                      <div style={{ marginTop: '14px', padding: '12px 14px', background: 'rgba(240,165,0,0.06)', border: '1px solid rgba(240,165,0,0.15)', borderRadius: '8px', fontSize: '12px', color: '#B0B3B8', lineHeight: '1.6' }}>
                        💡 <strong style={{ color: '#F0A500' }}>Counsellor Note:</strong> This section will be updated with personalised college shortlists, cutoff analysis, and application timelines after your counselling session.
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ── HOBBIES & INTERESTS TAB ── */}
              {activeView === 'hobbies' && (
                <div>
                  <div className="about-content-header">
                    <span>Hobbies &amp; Interests</span>
                    <span className="timeline-action" title="Edit Interests" onClick={() => setEditingItem('hobbies-edit')}>✏️</span>
                  </div>

                  {editingItem === 'hobbies-edit' ? (
                    <div className="inline-form">
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#F0A500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #3A3B3C' }}>
                        Edit Your Interests
                      </div>

                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#B0B3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎨 Hobbies (e.g., Painting, Reading)</label>
                      <input className="form-input" list="hobbies-list" placeholder="Start typing a hobby..." />
                      <datalist id="hobbies-list">
                        {HOBBIES.map(item => <option key={item} value={item} />)}
                      </datalist>

                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#B0B3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎵 Music</label>
                      <input className="form-input" list="music-list" placeholder="Start typing a genre or artist..." />
                      <datalist id="music-list">
                        {TV_SHOWS.map(item => <option key={item} value={item} />)}
                      </datalist>

                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#B0B3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📺 TV Shows &amp; Movies</label>
                      <input className="form-input" list="tvshows-list" placeholder="Start typing a show or movie..." />
                      <datalist id="tvshows-list">
                        {[...TV_SHOWS, ...MOVIES].map(item => <option key={item} value={item} />)}
                      </datalist>

                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#B0B3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎮 Games</label>
                      <input className="form-input" list="games-list" placeholder="Start typing a game..." />
                      <datalist id="games-list">
                        {GAMES.map(item => <option key={item} value={item} />)}
                      </datalist>

                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#B0B3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚽ Sports Teams &amp; Athletes</label>
                      <input className="form-input" list="sports-list" placeholder="Start typing a sport..." />
                      <datalist id="sports-list">
                        {SPORTS.map(item => <option key={item} value={item} />)}
                      </datalist>

                      <div className="form-actions">
                        <button className="btn-secondary-social" onClick={() => setEditingItem(null)}>Cancel</button>
                        <button className="btn-primary-social" onClick={() => setEditingItem(null)}>Save</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                      {/* 🎨 Hobbies */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>🎨 Hobbies</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {hobbies.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, hobbies, setHobbies)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type a hobby and press Enter..." value={autocomplete.category === 'hobbies' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'hobbies')} onKeyDown={(e) => handleAddTag(e, hobbies, setHobbies)} />
                          {autocomplete.category === 'hobbies' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, hobbies, setHobbies)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* 🎵 Music */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>🎵 Music</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {music.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, music, setMusic)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type a genre or artist and press Enter..." value={autocomplete.category === 'music' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'music')} onKeyDown={(e) => handleAddTag(e, music, setMusic)} />
                          {autocomplete.category === 'music' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, music, setMusic)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* 📺 TV Shows */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>📺 TV Shows</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {tvShows.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, tvShows, setTvShows)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type a TV show and press Enter..." value={autocomplete.category === 'tvShows' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'tvShows')} onKeyDown={(e) => handleAddTag(e, tvShows, setTvShows)} />
                          {autocomplete.category === 'tvShows' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, tvShows, setTvShows)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* 🎬 Movies */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>🎬 Movies</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {movies.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, movies, setMovies)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type a movie and press Enter..." value={autocomplete.category === 'movies' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'movies')} onKeyDown={(e) => handleAddTag(e, movies, setMovies)} />
                          {autocomplete.category === 'movies' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, movies, setMovies)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* 🎮 Games */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>🎮 Games</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {games.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, games, setGames)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type a game and press Enter..." value={autocomplete.category === 'games' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'games')} onKeyDown={(e) => handleAddTag(e, games, setGames)} />
                          {autocomplete.category === 'games' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, games, setGames)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* ⚽ Sports */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>⚽ Sports</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {sports.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, sports, setSports)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type a sport or team and press Enter..." value={autocomplete.category === 'sports' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'sports')} onKeyDown={(e) => handleAddTag(e, sports, setSports)} />
                          {autocomplete.category === 'sports' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, sports, setSports)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* 🏅 Athletes */}
                      <div className="hobby-category" style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '10px', padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: '#E4E6EB' }}>🏅 Athletes</h4>
                        <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {athletes.map((tag, index) => (
                            <span key={index} className="tag-chip" style={{ background: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#E4E6EB' }}>
                              {tag} <button onClick={() => handleRemoveTag(index, athletes, setAthletes)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="form-input" placeholder="Type an athlete name and press Enter..." value={autocomplete.category === 'athletes' ? autocomplete.text : ''} onChange={(e) => handleAutocompleteChange(e, 'athletes')} onKeyDown={(e) => handleAddTag(e, athletes, setAthletes)} />
                          {autocomplete.category === 'athletes' && autocomplete.suggestions.length > 0 && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface, #fff)', border: '1px solid var(--border)', zIndex: 50, listStyle: 'none', padding: 0, margin: 0, borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                              {autocomplete.suggestions.map((s, i) => <li key={i} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#000' }} onClick={() => handleSuggestionClick(s, athletes, setAthletes)}>{s}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveProfile} className="btn-save btn-primary-social">Save Changes</button>
                  </div>
                </div>
              )}
              {activeView === 'journal' && (
                <div className="db-tab">
                  <h3>📓 My Clarity Journal</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                    A secure space to log your thoughts, goals, and anxieties. Only your assigned counselor can read this.
                  </p>
                  
                  {/* Input area */}
                  <div style={{ background: '#18191A', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                    <textarea
                      value={newJournalEntry}
                      onChange={(e) => setNewJournalEntry(e.target.value)}
                      placeholder="Write your thoughts here..."
                      style={{
                        width: '100%',
                        height: '120px',
                        background: '#242526',
                        color: 'white',
                        border: '1px solid #3A3B3C',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        marginBottom: '12px'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={handleSaveJournalEntry} className="btn-primary-social" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        💾 Save Entry
                      </button>
                    </div>
                  </div>

                  {/* Timeline area */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {journalEntries.length === 0 ? (
                      <div className="db-empty-state" style={{ background: '#18191A', border: '1px dashed #3A3B3C' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                        <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>No journal entries yet</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Start writing to log your very first thought!</p>
                      </div>
                    ) : (
                      journalEntries.map((entry) => (
                        <div key={entry.id} style={{ background: 'var(--bg, #18191A)', border: '1px solid #3A3B3C', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted, #B0B3B8)', fontWeight: '600' }}>
                            <span>📅 {new Date(entry.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <span style={{ fontSize: '11px', background: '#242526', padding: '2px 8px', borderRadius: '12px' }}>{relativeTime(entry.date)}</span>
                          </div>
                          <div style={{ color: '#E4E6EB', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{entry.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {activeView === 'life-skills' && (
                <div>
                  <div className="admin-card" style={{ borderTop: '3px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ margin: 0, border: 'none', padding: 0 }}>🕸️ Life Skills Matrix</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '5px' }}>Self-assess your core psychological and social competencies.</p>
                      </div>
                      <button className="admin-btn" onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? '⏳ Saving...' : '💾 Save Matrix'}</button>
                    </div>
                    
                    <div className="grid-2col" style={{ alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {Object.keys(lifeSkills).map(skill => (
                          <div key={skill}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                              <span>{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span style={{ color: 'var(--primary)' }}>{lifeSkills[skill]} / 100</span>
                            </div>
                            <input type="range" min="0" max="100" value={lifeSkills[skill]} onChange={(e) => setLifeSkills({ ...lifeSkills, [skill]: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', minHeight: '300px' }}>
                        <SkillRadarChart skills={lifeSkills} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeView === 'roadmap' && (
                <div>
                  <div className="admin-card" style={{ borderTop: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: 0, border: 'none', padding: 0 }}>🗺️ Career Roadmap</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '5px' }}>Drag and drop your execution steps. Press Enter below to add a new task.</p>
                      </div>
                      <button className="admin-btn" onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? '⏳ Saving...' : '💾 Save Roadmap'}</button>
                    </div>
                    
                    <input type="text" className="form-input" placeholder="Add a new action step and press Enter..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={addRoadmapTask} style={{ width: '100%' }} />
                    
                    <div style={{ display: 'flex', gap: '15px', minHeight: '400px', overflowX: 'auto' }}>
                      {['todo', 'doing', 'done'].map(column => (
                        <div key={column} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, column)} style={{ flex: 1, minWidth: '250px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', padding: '15px', border: '1px solid var(--border)' }}>
                          <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                            {column === 'todo' ? '📝 To Do' : column === 'doing' ? '⏳ Doing' : '✅ Done'}
                            <span style={{ float: 'right', background: 'var(--bg)', padding: '2px 8px', borderRadius: '12px' }}>{roadmapTasks.filter(t => t.status === column).length}</span>
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {roadmapTasks.filter(t => t.status === column).map(task => (
                              <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} style={{ background: 'var(--card-bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{task.text}</span>
                                <button onClick={() => removeTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.5 }}>✕</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeView === 'messages' && <ChatWidget activeChat={activeChat} setActiveChat={setActiveChat} />}
            </div>
          </main>

          {/* ── PROFILE FORM MODAL ── */}
          {showCareerMatchesModal && (
            <CareerMatchesModal localUserData={localUserData} onClose={() => setShowCareerMatchesModal(false)} />
          )}

          {toast && <div className="db-toast"><span>🔔</span><span>{toast}</span></div>}
          <ChatWidget />
          {showTermsModal && ( <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'var(--bg-surface, #1e1e1e)', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%', border: '1px solid var(--border)' }}> <h2 style={{ color: '#fff', marginBottom: '15px' }}>Terms & Conditions</h2> <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}> By accessing the Secret Sharz dashboard, you consent that all personal, academic, and psychological information provided on this platform will be strictly utilized for Career Guidance and professional Counseling purposes. Your data is securely managed and will only be accessible to your assigned counselors and platform administrators. </p> <div style={{ display: 'flex', justifyContent: 'flex-end' }}> <button onClick={handleAcceptTerms} style={{ background: 'var(--primary-blue, #0066ff)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}> I Agree & Continue </button> </div> </div> </div> )}
          {showClinicalIntake && <ClinicalIntakeModal onComplete={() => setShowClinicalIntake(false)} />}
      </div>
    </div>
  );
}
