/**
 * Life Skills Trainer — School Counsellor Activity Bank
 * src/resources/lifeskills/Lifeskillstrainer.jsx
 *
 * 30 classroom-ready activities for Grade 5–12 life skills sessions.
 * Mapped to the 10 WHO Life Skills.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── CSS ─────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --ls-amber:#C8860A; --ls-amber-pale:#FFF8E8; --ls-amber-mid:#FFEDBE;
  --ls-forest:#2D5240; --ls-sage:#4A7C59; --ls-sage-pale:#EBF4EE;
  --ls-cream:#FFFBF5; --ls-sand:#F7F3ED; --ls-ink:#1E2820;
  --ls-ink-soft:#3D4A40; --ls-muted:#7A8A7D; --ls-border:rgba(30,40,32,0.1);
  --ls-shadow-sm:0 2px 12px rgba(30,40,32,0.07);
  --ls-shadow-md:0 8px 32px rgba(30,40,32,0.11);
  --ls-r:18px;
}

.lst-page { min-height:100vh; background:var(--ls-cream); padding-bottom:100px; font-family:'Plus Jakarta Sans',sans-serif; }

.lst-topbar { background:var(--ls-ink); color:white; height:56px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:300; border-bottom:3px solid var(--ls-amber); }
.lst-back { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.7); font-size:13px; font-weight:700; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; transition:color .2s; }
.lst-back:hover { color:white; }
.lst-topbar-title { font-family:'Fraunces',serif; font-size:16px; color:white; }
.lst-topbar-right { display:flex; align-items:center; gap:8px; font-size:12px; color:rgba(255,255,255,.45); font-weight:600; }

.lst-hero { background:linear-gradient(135deg,var(--ls-ink) 0%,#2C1F05 55%,#3D2D0A 100%); padding:64px 48px 56px; position:relative; overflow:hidden; }
.lst-hero-blob { position:absolute; pointer-events:none; border-radius:50%; }
.lst-hero-blob-1 { width:480px; height:480px; background:radial-gradient(circle,rgba(200,134,10,.14),transparent 70%); top:-160px; right:-80px; }
.lst-hero-blob-2 { width:300px; height:300px; background:radial-gradient(circle,rgba(74,124,89,.1),transparent 70%); bottom:-80px; left:240px; }
.lst-hero-inner { max-width:1100px; margin:0 auto; display:flex; gap:56px; align-items:flex-start; flex-wrap:wrap; position:relative; z-index:1; }
.lst-hero-eyebrow { display:inline-flex; align-items:center; gap:8px; background:rgba(200,134,10,.18); border:1px solid rgba(200,134,10,.35); color:#FFCE6B; padding:7px 16px; border-radius:50px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:18px; }
.lst-hero-h1 { font-family:'Fraunces',serif; font-size:clamp(30px,4.5vw,48px); font-weight:700; color:white; line-height:1.1; letter-spacing:-1px; margin-bottom:16px; }
.lst-hero-h1 em { font-style:italic; color:#FFCE6B; }
.lst-hero-sub { font-size:16px; color:rgba(255,255,255,.65); line-height:1.75; max-width:500px; margin-bottom:28px; font-weight:300; }
.lst-hero-tags { display:flex; gap:10px; flex-wrap:wrap; }
.lst-hero-tag { padding:6px 14px; border-radius:50px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); font-size:12px; color:rgba(255,255,255,.8); font-weight:600; }
.lst-hero-right { flex-shrink:0; display:flex; flex-direction:column; gap:12px; }
.lst-stat-card { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); border-radius:16px; padding:18px 24px; text-align:center; min-width:150px; }
.lst-stat-num { font-family:'Fraunces',serif; font-size:36px; font-weight:700; color:#FFCE6B; line-height:1; }
.lst-stat-label { font-size:11px; color:rgba(255,255,255,.45); font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }

.lst-tabs-wrap { background:white; border-bottom:2px solid var(--ls-border); position:sticky; top:56px; z-index:200; box-shadow:var(--ls-shadow-sm); }
.lst-tabs { max-width:1100px; margin:0 auto; padding:0 48px; display:flex; }
.lst-tab { padding:18px 28px; font-size:14px; font-weight:700; cursor:pointer; border:none; background:none; font-family:inherit; color:var(--ls-muted); border-bottom:3px solid transparent; transition:all .2s; display:flex; flex-direction:column; align-items:flex-start; gap:2px; white-space:nowrap; }
.lst-tab:hover { color:var(--ls-ink); background:rgba(30,40,32,.02); }
.lst-tab.active { color:var(--ls-amber); border-bottom-color:var(--ls-amber); }
.lst-tab-sub { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); }
.lst-tab.active .lst-tab-sub { color:var(--ls-amber); }

.lst-filter-wrap { max-width:1100px; margin:28px auto 0; padding:0 48px; }
.lst-filter-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.lst-filter-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); margin-right:4px; }
.lst-chip { padding:7px 15px; border:1.5px solid var(--ls-border); border-radius:50px; font-size:12px; font-weight:700; cursor:pointer; background:white; color:var(--ls-ink-soft); font-family:inherit; transition:all .2s; white-space:nowrap; }
.lst-chip:hover { border-color:var(--ls-amber); color:var(--ls-amber); }
.lst-chip.active { background:var(--ls-amber); border-color:var(--ls-amber); color:white; }
.lst-result-meta { font-size:12px; color:var(--ls-muted); margin-left:auto; font-weight:600; }

.lst-grid { max-width:1100px; margin:24px auto 0; padding:0 48px 40px; display:flex; flex-direction:column; gap:20px; }

.lst-card { background:white; border-radius:var(--ls-r); border:1.5px solid var(--ls-border); box-shadow:var(--ls-shadow-sm); overflow:hidden; transition:box-shadow .25s,border-color .25s; }
.lst-card:hover { box-shadow:var(--ls-shadow-md); }
.lst-card.expanded { border-color:var(--ls-amber); box-shadow:var(--ls-shadow-md); }
.lst-card-accent { height:5px; width: 100%; }

.lst-card-header { padding:22px 26px; display:flex; align-items:flex-start; gap:16px; cursor:pointer; user-select:none; }
.lst-card-header:hover { background:rgba(30,40,32,.015); }
.lst-card-num { width:42px; height:42px; border-radius:12px; background:var(--ls-sand); display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:var(--ls-amber); flex-shrink:0; border:1px solid var(--ls-border); }
.lst-card-meta-block { flex:1; }
.lst-card-title { font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--ls-ink); margin-bottom:5px; line-height:1.25; }
.lst-card-badges { display:flex; gap:7px; flex-wrap:wrap; align-items:center; }
.lst-badge { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
.lst-badge-theme { background:var(--ls-amber-pale); color:var(--ls-amber); }
.lst-badge-grade { background:var(--ls-sage-pale); color:var(--ls-forest); }
.lst-badge-time { background:rgba(30,40,32,.05); color:var(--ls-muted); }
.lst-badge-format { background:#EAF4FA; color:#2980B9; }
.lst-card-obj { font-size:13px; color:var(--ls-muted); margin-top:7px; line-height:1.6; max-width:640px; }
.lst-card-chevron { font-size:14px; color:var(--ls-muted); transition:transform .25s; flex-shrink:0; margin-top:3px; font-weight: bold; }
.lst-card.expanded .lst-card-chevron { transform:rotate(90deg); }
.lst-card-print-btns { display:flex; gap:6px; align-items:center; flex-shrink:0; }
.lst-print-btn { display:flex; align-items:center; gap:5px; padding:7px 13px; border-radius:50px; font-size:11px; font-weight:700; cursor:pointer; border:none; font-family:inherit; transition:all .2s; white-space:nowrap; text-decoration:none; }
.lst-print-btn.guide { background:rgba(192,57,43,.08); color:#C0392B; border:1px solid rgba(192,57,43,.2); }
.lst-print-btn.guide:hover { background:#C0392B; color:white; }
.lst-print-btn.ws { background:rgba(41,128,185,.08); color:#2980B9; border:1px solid rgba(41,128,185,.2); }
.lst-print-btn.ws:hover { background:#2980B9; color:white; }

.lst-card-body { border-top:1px solid var(--ls-border); padding:28px 30px 32px; animation:lstFadeIn .3s ease; }
@keyframes lstFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

.lst-inner-tabs { display:flex; gap:0; border-bottom:1px solid var(--ls-border); margin-bottom:24px; overflow-x:auto; scrollbar-width:none; }
.lst-inner-tabs::-webkit-scrollbar { display:none; }
.lst-inner-tab { padding:10px 18px; font-size:13px; font-weight:700; cursor:pointer; border:none; background:none; font-family:inherit; color:var(--ls-muted); border-bottom:2px solid transparent; transition:all .18s; white-space:nowrap; }
.lst-inner-tab:hover { color:var(--ls-ink); }
.lst-inner-tab.active { color:var(--ls-amber); border-bottom-color:var(--ls-amber); }

.lst-materials { display:flex; flex-wrap:wrap; gap:8px; }
.lst-material-tag { background:var(--ls-sand); border:1px solid var(--ls-border); padding:6px 13px; border-radius:20px; font-size:13px; color:var(--ls-ink-soft); font-weight:500; display:flex; align-items:center; gap:5px; }

.lst-image-wrapper { margin: 24px 0; text-align: center; background: #F8F9FA; padding: 16px; border-radius: 12px; border: 1px solid #E5E7EB; }
.lst-content-img { max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto; max-height: 400px; object-fit: contain; }

.lst-phase { margin-bottom:22px; }
.lst-phase-header { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.lst-phase-time { background:var(--ls-amber); color:white; padding:3px 11px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
.lst-phase-name { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--ls-ink); }
.lst-step { display:flex; gap:10px; padding:10px 13px; border-radius:10px; margin-bottom:7px; font-size:14px; line-height:1.65; }
.lst-step.say { background:#EAF4FA; border-left:3px solid #5B9EBF; }
.lst-step.do  { background:var(--ls-sand); border-left:3px solid var(--ls-muted); }
.lst-step.tip { background:var(--ls-amber-pale); border-left:3px solid var(--ls-amber); }
.lst-step.pause { background:var(--ls-sage-pale); border-left:3px solid var(--ls-sage); }
.lst-step-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; width:45px; flex-shrink:0; margin-top:3px; }
.lst-step.say .lst-step-label  { color:#2980B9; }
.lst-step.do  .lst-step-label  { color:var(--ls-muted); }
.lst-step.tip .lst-step-label  { color:var(--ls-amber); }
.lst-step.pause .lst-step-label{ color:var(--ls-sage); }
.lst-step-text { flex:1; color:var(--ls-ink-soft); }
.lst-step.say .lst-step-text { font-style:italic; color:var(--ls-ink); }

.lst-debrief-item { border:1px solid var(--ls-border); border-radius:12px; padding:16px 18px; margin-bottom:10px; }
.lst-debrief-q { font-size:15px; font-weight:700; color:var(--ls-ink); margin-bottom:6px; }
.lst-debrief-note { font-size:13px; color:var(--ls-muted); line-height:1.65; display:flex; gap:8px; }

.lst-watch-item { display:flex; gap:12px; padding:13px 16px; background:#FDF0EA; border-radius:10px; margin-bottom:8px; font-size:14px; color:var(--ls-ink-soft); line-height:1.6; border-left:3px solid #E8845A; }
.lst-variation-item { display:flex; gap:12px; padding:12px 15px; background:var(--ls-sage-pale); border-radius:10px; margin-bottom:7px; font-size:14px; color:var(--ls-ink-soft); line-height:1.6; }
.lst-variation-tag { font-size:11px; font-weight:700; color:var(--ls-forest); text-transform:uppercase; letter-spacing:.8px; white-space:nowrap; margin-top:2px; }

.lst-ws-preview { background:var(--ls-sand); border-radius:14px; padding:28px; }
.lst-ws-section { background:white; border-radius:12px; padding:20px 22px; margin-bottom:14px; border:1px solid var(--ls-border); }
.lst-ws-section-title { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--ls-ink); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.lst-ws-prompt { font-size:14px; color:var(--ls-ink-soft); margin-bottom:8px; line-height:1.65; }
.lst-ws-lines { border-bottom:1.5px dotted rgba(30,40,32,.2); height:28px; margin-bottom:6px; width:100%; }
.lst-ws-box { border:1.5px dotted rgba(30,40,32,.2); border-radius:8px; min-height:70px; width:100%; margin-bottom:8px; }

.lst-print-overlay { position:fixed; inset:0; background:white; z-index:9999; overflow-y:auto; padding:0; display:none; }
.lst-print-overlay.visible { display:block; }
.lst-print-overlay-topbar { background:var(--ls-ink); padding:14px 32px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; }
.lst-print-overlay-topbar h3 { font-family:'Fraunces',serif; font-size:18px; color:white; margin:0; }
.lst-print-overlay-actions { display:flex; gap:8px; }
.lst-po-btn { padding:9px 20px; border-radius:50px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:inherit; transition:all .2s; }
.lst-po-btn.print { background:var(--ls-amber); color:white; }
.lst-po-btn.close { background:rgba(255,255,255,.12); color:white; }
.lst-po-btn:hover { opacity:.88; }
.lst-print-doc { max-width:760px; margin:32px auto; padding:0 32px 60px; font-family:'Plus Jakarta Sans',sans-serif; }

.lstp-header { border-bottom:4px solid var(--ls-amber); padding-bottom:20px; margin-bottom:28px; }
.lstp-header h1 { font-family:'Fraunces',serif; font-size:28px; color:var(--ls-ink); margin:0 0 6px; }
.lstp-header-meta { display:flex; gap:16px; flex-wrap:wrap; font-size:13px; color:var(--ls-muted); font-weight:600; }
.lstp-section-h { font-family:'Fraunces',serif; font-size:17px; font-weight:700; color:var(--ls-forest); margin:24px 0 10px; padding-bottom:5px; border-bottom:1px solid var(--ls-border); }
.lstp-objective-box { background:var(--ls-amber-pale); border-radius:10px; padding:14px 18px; font-size:14px; color:var(--ls-ink-soft); line-height:1.7; margin-bottom:16px; border-left:4px solid var(--ls-amber); }
.lstp-materials-list { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
.lstp-material { background:var(--ls-sand); border:1px solid var(--ls-border); padding:5px 12px; border-radius:20px; font-size:13px; color:var(--ls-ink-soft); }
.lstp-phase-block { margin-bottom:18px; }
.lstp-phase-title { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.lstp-phase-time { background:var(--ls-amber); color:white; padding:2px 10px; border-radius:20px; font-size:11px; font-weight:700; }
.lstp-phase-name { font-size:15px; font-weight:700; color:var(--ls-ink); }
.lstp-step { display:flex; gap:8px; padding:8px 12px; border-radius:8px; margin-bottom:6px; font-size:13px; line-height:1.6; }
.lstp-step.say { background:#EAF4FA; }
.lstp-step.do  { background:var(--ls-sand); }
.lstp-step.tip { background:var(--ls-amber-pale); }
.lstp-step.pause { background:var(--ls-sage-pale); }
.lstp-step-lbl { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; width:45px; flex-shrink:0; margin-top:3px; }
.lstp-step.say .lstp-step-lbl { color:#2980B9; }
.lstp-step.do  .lstp-step-lbl { color:var(--ls-muted); }
.lstp-step.tip .lstp-step-lbl { color:var(--ls-amber); }
.lstp-step.pause .lstp-step-lbl{ color:var(--ls-sage); }
.lstp-step.say p { font-style:italic; color:var(--ls-ink); }
.lstp-step p { margin:0; flex:1; color:var(--ls-ink-soft); }
.lstp-debrief-item { border:1px solid var(--ls-border); border-radius:10px; padding:12px 15px; margin-bottom:8px; }
.lstp-debrief-q { font-size:14px; font-weight:700; color:var(--ls-ink); margin-bottom:4px; }
.lstp-debrief-note { font-size:12px; color:var(--ls-muted); line-height:1.6; }
.lstp-watch { background:#FDF0EA; border-radius:8px; padding:10px 14px; margin-bottom:7px; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; border-left:3px solid #E8845A; }
.lstp-variation { background:var(--ls-sage-pale); border-radius:8px; padding:10px 14px; margin-bottom:7px; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; display:flex; gap:10px; }
.lstp-var-tag { font-size:10px; font-weight:700; color:var(--ls-forest); text-transform:uppercase; white-space:nowrap; margin-top:2px; }
.lstp-footer { margin-top:40px; border-top:1px solid var(--ls-border); padding-top:16px; font-size:11px; color:var(--ls-muted); text-align:center; }

.lstw-header { text-align:center; border-bottom:3px solid var(--ls-amber); padding-bottom:18px; margin-bottom:24px; }
.lstw-header h1 { font-family:'Fraunces',serif; font-size:24px; color:var(--ls-ink); margin-bottom:4px; }
.lstw-header p { font-size:13px; color:var(--ls-muted); margin:0; }
.lstw-name-row { display:flex; gap:24px; margin-bottom:24px; }
.lstw-name-field { flex:1; border-bottom:1.5px solid rgba(30,40,32,.25); padding-bottom:4px; font-size:13px; color:var(--ls-muted); }
.lstw-section { margin-bottom:20px; }
.lstw-section-title { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--ls-forest); margin-bottom:10px; }
.lstw-prompt { font-size:14px; color:var(--ls-ink-soft); margin-bottom:6px; line-height:1.6; }
.lstw-line { border:none; border-bottom:1.5px dotted rgba(30,40,32,.2); width:100%; height:26px; margin-bottom:4px; display:block; }
.lstw-box { border:1.5px dotted rgba(30,40,32,.2); border-radius:8px; min-height:65px; width:100%; margin-bottom:10px; }
.lstw-two-col { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.lstw-col-box { border:1.5px solid var(--ls-border); border-radius:10px; padding:12px; min-height:100px; }
.lstw-col-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); margin-bottom:8px; }
.lstw-footer { margin-top:32px; border-top:1px solid var(--ls-border); padding-top:14px; font-size:11px; color:var(--ls-muted); text-align:center; }

@media print {
  @page { size:A4; margin:18mm 18mm 22mm; }
  body { background:white !important; }
  .lst-page, .lst-topbar, .lst-hero, .lst-tabs-wrap, .lst-filter-wrap,
  .lst-grid, .lst-print-overlay-topbar, .no-print { display:none !important; }
  .lst-print-overlay { display:block !important; position:static !important; }
  .lst-print-overlay-topbar { display:none !important; }
  .lst-print-doc { max-width:100%; margin:0; padding:0; }
  .lstp-step, .lstp-debrief-item, .lstp-watch, .lstp-variation { -webkit-print-color-adjust:exact; print-color-adjust:exact; break-inside:avoid; }
  .lstp-phase-block { break-inside:avoid; }
  .lstw-box, .lstw-col-box { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
}

@media(max-width:900px) {
  .lst-hero { padding:44px 20px 36px; }
  .lst-hero-right { display:none; }
  .lst-tabs { padding:0 16px; }
  .lst-filter-wrap, .lst-grid { padding-left:16px; padding-right:16px; }
  .lst-card-header { flex-wrap:wrap; gap:10px; }
  .lst-card-print-btns { order:3; width:100%; }
  .lst-topbar { padding:0 16px; }
  .lst-topbar-title { display:none; }
}
`;

// ─── 10 WHO LIFE SKILLS ───────────────────────────────────────────────────────
const ALL_THEMES = [
  'All',
  'Self-awareness',
  'Empathy',
  'Critical thinking',
  'Creative thinking',
  'Decision making',
  'Problem solving',
  'Effective communication',
  'Interpersonal relationships',
  'Coping with stress',
  'Coping with emotions'
];

// ─── ACTIVITY DATA ────────────────────────────────────────────────────────────

const ACTIVITIES = [

// ──────────────────────── LOWER SECONDARY (Grade 5-7) ────────────────────────
  // ============================================================================
  // LOWER SECONDARY ACTIVITIES (WHO Life Skills) - Expanded & Enhanced
  // ============================================================================
  
  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "l_sa_1", title: "My Strengths Shield", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Individual art activity", "Pairs"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Students will identify their core character strengths and create a visual shield to build self-esteem.", materials: ["Blank shield templates", "Coloured markers", "List of strengths on the board"],
    phases: [
      { time: "0–10 min", phase: "What is a Strength?", steps: [ { type: "say", text: "Character strengths are who you ARE, not just what you DO. For example, playing basketball well is a skill, but being a supportive teammate is a character strength." }, { type: "do", text: "Write examples on the board: Kindness, Bravery, Humor, Curiosity, Honesty, Perseverance. Ask students to shout out times they have seen these strengths in action." } ] },
      { time: "10–25 min", phase: "Designing the Shield", steps: [ { type: "do", text: "Hand out the blank shield templates. Explain that a shield represents what protects and empowers them." }, { type: "say", text: "In the four sections, you will draw or write: 1. Your greatest strength, 2. A strength others see in you, 3. A time you used a strength to help someone, 4. A strength you want to grow." } ] },
      { time: "25–35 min", phase: "Shield Sharing", steps: [ { type: "do", text: "Have students pair up. Give them 5 minutes to explain their shields to each other." }, { type: "say", text: "Partners, your job is to listen carefully and respond by saying: 'I can see that strength in you because...'" } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Bring the class back together and discuss how knowing our internal strengths acts as a protective shield during difficult days." } ] }
    ],
    debrief: [ { q: "Was it hard to choose a strength for yourself?", note: "Normalise focusing on weaknesses; humans are wired to notice negatives." }, { q: "How can you use your strength this week?", note: "Connect abstract strengths to practical school challenges." } ],
    watchOutFor: [ "Students who say they have no strengths. Offer gentle observations like, 'I noticed you helped Maya yesterday, that is a big strength.'" ],
    variations: [ { tag: "Art-focused", text: "Provide magazines and glue for a collage-style shield instead of drawing." } ],
    worksheet: { title: "My Strengths Shield", intro: "Design your personal crest.", sections: [ { title: "Shield Planning", prompts: [ { label: "My greatest strength is:", lines: 1 }, { label: "A strength others see in me:", lines: 1 }, { label: "A strength I want to grow:", lines: 1 } ] } ] }
  },
  {
    id: "l_sa_2", title: "The Mirror Game", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs", "Full class"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Recognize how physical posture reflects and influences internal emotional states.", materials: ["Open floor space"],
    phases: [
      { time: "0–15 min", phase: "The Setup", steps: [ { type: "do", text: "Ask students to stand and face their partner. One is the leader, one is the mirror. The mirror must perfectly match the leader's physical movements in complete silence." }, { type: "say", text: "Move slowly and fluidly. Switch roles after 2 minutes so everyone gets a turn leading." } ] },
      { time: "15–25 min", phase: "Emotional Mirror", steps: [ { type: "say", text: "Now we take it a step further. Leaders, mirror an emotion without using any words. Let your partner guess the emotion based entirely on your posture and facial expression." }, { type: "do", text: "Call out emotions for them to act out: Sadness, Excitement, Nervousness, Pride." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "What did you notice about your own face and breathing when you were mirroring an angry posture? Did you actually start to feel a little tense?" } ] }
    ],
    debrief: [ { q: "How did your body feel mirroring a sad posture?", note: "Help them connect physical slumping to low emotional energy." }, { q: "Can changing your posture change your mood?", note: "Introduce the idea that standing tall can trick the brain into feeling confident." } ],
    watchOutFor: [ "Silly behavior. Remind them to be precise and take the mirroring seriously for it to work." ],
    variations: [ { tag: "Full class", text: "Have one leader mirror for the whole room to practice collective focus." } ],
    worksheet: { title: "Body and Mind", intro: "Your body talks to your brain.", sections: [ { title: "Reflection", prompts: [ { label: "When I stand tall, my brain feels:", lines: 2 }, { label: "When I slump, my energy feels:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "l_em_1", title: "The Empathy Glasses", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice viewing a common school conflict from multiple perspectives to build empathy.", materials: ["Scenario cards", "Prop glasses (optional)"],
    phases: [
      { time: "0–10 min", phase: "The Concept", steps: [ { type: "say", text: "When we are upset, we only see the world through our own glasses. Our view feels like the only truth. Empathy means intentionally taking off our glasses and borrowing someone else's." }, { type: "do", text: "Pass around a pair of prop glasses if available to anchor the metaphor." } ] },
      { time: "10–25 min", phase: "Scenario Practice", steps: [ { type: "do", text: "Read a scenario aloud: Two friends, Kabir and Rohan, fight over a seat in the cafeteria. Kabir feels excluded. Rohan feels smothered." }, { type: "say", text: "In your groups, explain the exact situation through Kabir's glasses, and then re-tell the entire story exclusively through Rohan's glasses." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Are both people right in their own minds? Does someone have to be the 'villain' for a conflict to happen?" } ] }
    ],
    debrief: [ { q: "Is it possible for two people to have totally different views of the exact same event?", note: "Yes. Perception is reality to the person experiencing it." } ],
    watchOutFor: [ "Students refusing to see the 'wrong' person's side. Push them to find the logic in the opposing view." ],
    variations: [ { tag: "Acting", text: "Have students physically swap chairs when arguing the two different perspectives." } ],
    worksheet: { title: "Borrowing Glasses", intro: "See it their way.", sections: [ { title: "Perspective Check", prompts: [ { label: "A time I disagreed with a friend:", lines: 2 }, { label: "How the argument looked through their glasses:", lines: 2 } ] } ] }
  },
  {
    id: "l_em_2", title: "The Kindness Boomerang", themeShort: ["Empathy", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Demonstrate how empathy creates a ripple effect in a community.", materials: ["A soft ball or a ball of yarn"],
    phases: [
      { time: "0–10 min", phase: "The Web", steps: [ { type: "do", text: "Have all students stand in a large circle." }, { type: "say", text: "Hold onto the string and throw the ball of yarn to someone across the circle. When you throw it, share one kind thing they did for you recently, or one character trait you appreciate about them." } ] },
      { time: "10–20 min", phase: "The Drop", steps: [ { type: "say", text: "Look at the web we just created. Notice how every single person is connected. What happens to the web if one person drops their string?" }, { type: "do", text: "Have one person drop their string to show how the tension slackens and affects everyone else's grip." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "do", text: "Return to seats and discuss how small, seemingly isolated actions of kindness or cruelty inevitably impact the entire classroom environment." } ] }
    ],
    debrief: [ { q: "How did it feel to receive a public compliment?", note: "Validates positive reinforcement and builds self-worth." }, { q: "How does one negative action affect the whole group?", note: "Connect this back to the dropped string." } ],
    watchOutFor: [ "Ensure every single student receives the ball at least once so no one feels excluded." ],
    variations: [ { tag: "Grade 5", text: "Use pre-written compliment cards if students are too shy to generate their own on the spot." } ],
    worksheet: { title: "The Kindness Boomerang", intro: "Reflect on connection.", sections: [ { title: "My Impact", prompts: [ { label: "One kind thing someone did for me this week:", lines: 2 }, { label: "One kind action I commit to doing tomorrow:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "l_ct_1", title: "Fact vs. Fiction Relay", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Teams"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Rapidly distinguish between verifiable facts and subjective opinions.", materials: ["Whiteboard", "Pre-written statements"],
    phases: [
      { time: "0–5 min", phase: "Definitions", steps: [ { type: "say", text: "A fact is a statement that can be proven true or false with evidence. An opinion is how someone feels or what they believe about a fact." } ] },
      { time: "5–20 min", phase: "The Relay", steps: [ { type: "do", text: "Divide into teams. Read a statement aloud. (e.g., 'Pizza is the best food' vs 'Pizza contains cheese'). Teams race to the board to slap a 'FACT' or 'OPINION' sign." }, { type: "do", text: "Award points for correct answers and briefly explain why." } ] },
      { time: "20–35 min", phase: "Tricky Ones", steps: [ { type: "do", text: "Introduce manipulative or mixed statements. (e.g., '9 out of 10 people say this movie is terrible'). Have teams debate why this is tricky." } ] }
    ],
    debrief: [ { q: "Why is it dangerous to mistake an opinion for a fact?", note: "Discuss how this leads to spreading rumors and misinformation." } ],
    watchOutFor: [ "Statements that touch on sensitive religious or political topics. Keep them strictly light and school-focused." ],
    variations: [ { tag: "Digital", text: "Use real YouTube video titles and have them spot the exaggeration." } ],
    worksheet: { title: "Fact or Opinion?", intro: "Test your brain.", sections: [ { title: "My Audit", prompts: [ { label: "Write a verifiable fact about your school:", lines: 1 }, { label: "Write an opinion about your school:", lines: 1 } ] } ] }
  },
  {
    id: "l_ct_2", title: "The 'Why' Chain", themeShort: ["Critical thinking", "Problem solving"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Ask 'why' repeatedly to strip away surface issues and find the root cause of a problem.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Toddler Strategy", steps: [ { type: "say", text: "Have you ever met a toddler who keeps asking 'why'? It can be annoying, but they are actually great problem solvers." }, { type: "do", text: "Model on the board: 'I got a bad grade.' Why? 'I didn't study.' Why? 'I was distracted.' Why? 'My phone was buzzing.' Why? 'I did not turn off notifications.'" } ] },
      { time: "10–20 min", phase: "Pair Practice", steps: [ { type: "do", text: "Give pairs a starting problem (e.g., 'I am always late to school'). One person plays the toddler and asks 'Why?' 5 consecutive times to reach the root cause." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Did asking 'why' change what you thought the original problem was?" } ] }
    ],
    debrief: [ { q: "How does finding the root cause change the solution?", note: "It shifts the solution from treating symptoms (setting a louder alarm) to fixing roots (charging the phone in another room)." } ],
    watchOutFor: [ "Students getting frustrated by the repetitive 'why'. Remind them to treat it like a detective game." ],
    variations: [ { tag: "Grade 7", text: "Apply this framework to a systemic school-wide issue, like cafeteria crowding." } ],
    worksheet: { title: "The 5 Whys", intro: "Dig down to the root cause.", sections: [ { title: "My Chain", prompts: [ { label: "The Surface Problem:", lines: 1 }, { label: "Why? 1:", lines: 1 }, { label: "Why? 2:", lines: 1 }, { label: "The Real Root Cause:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 4: Creative Thinking ──
  {
    id: "l_crt_1", title: "The Squiggle Challenge", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Overcome the fear of a blank page and practice rapid creative generation through constraints.", materials: ["Paper with identical random squiggles drawn on them", "Pens"],
    phases: [
      { time: "0–5 min", phase: "The Blank Page Fear", steps: [ { type: "say", text: "Perfectionism is the enemy of creativity. When we stare at a blank page, we freeze. Today we are making art out of pre-made scribbles." } ] },
      { time: "5–15 min", phase: "The Transformation", steps: [ { type: "do", text: "Hand out the squiggle papers. Give students exactly 3 minutes to turn the random squiggle into a recognizable drawing (a bird, a car, a face)." } ] },
      { time: "15–25 min", phase: "Gallery", steps: [ { type: "do", text: "Have students walk around the room to look at the drawings. Point out how the exact same squiggle became 30 completely different pieces of art." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Creativity is not about pulling genius out of thin air. It is just about connecting things that already exist." } ] }
    ],
    debrief: [ { q: "Was it easier to draw starting with a squiggle or a blank page?", note: "Constraints actually help eliminate choice paralysis and boost creativity." } ],
    watchOutFor: [ "Students saying 'I cannot draw'. Assure them stick figures and messy lines are perfect for this." ],
    variations: [ { tag: "Pairs", text: "One person draws the initial squiggle, the other turns it into art." } ],
    worksheet: { title: "Squiggle Art", intro: "Turn mistakes into masterpieces.", sections: [ { title: "Reflection", prompts: [ { label: "How does transforming a squiggle apply to making mistakes in real life?", lines: 2 } ] } ] }
  },
  {
    id: "l_crt_2", title: "Brainstorming Bonanza", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Teach the core rule of brainstorming: completely separate idea generation from idea evaluation.", materials: ["Sticky notes", "Chart paper"],
    phases: [
      { time: "0–10 min", phase: "The Rule", steps: [ { type: "say", text: "The biggest killer of creativity is judging an idea before it is fully formed. Today, for the first ten minutes, every single idea is a good idea. No judgment allowed." } ] },
      { time: "10–20 min", phase: "The Storm", steps: [ { type: "do", text: "Give a prompt: 'Design a new school uniform that solves 3 problems.' Students write one wild idea per sticky note for 5 minutes in total silence." } ] },
      { time: "20–30 min", phase: "The Sort", steps: [ { type: "do", text: "Now the evaluation phase begins. Have groups sort the stickies by theme, combine the good parts, and pick the best overall solution." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the psychological relief of generating ideas without being judged." } ] }
    ],
    debrief: [ { q: "Did waiting to judge the ideas make it easier to share them?", note: "Usually yes, it significantly reduces the fear of failure." } ],
    watchOutFor: [ "Students laughing at 'dumb' ideas during the silent phase. Intervene immediately to protect the rule." ],
    variations: [ { tag: "Fun twist", text: "Prompt: 'Invent a new school subject that does not exist yet.'" } ],
    worksheet: { title: "Brainstorming Rules", intro: "Separate generation from evaluation.", sections: [ { title: "My Best Idea", prompts: [ { label: "The wild idea I came up with:", lines: 2 }, { label: "How we could actually make it work:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "l_dm_1", title: "Stop, Think, Go", themeShort: ["Decision making", "Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class", "Role-play"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Implement a simple cognitive pause (traffic light model) to prevent impulsive and emotional decision-making.", materials: ["Red, Yellow, Green paper circles"],
    phases: [
      { time: "0–10 min", phase: "Traffic Light", steps: [ { type: "say", text: "Impulsive decisions happen when we go straight from feeling an emotion to acting on it. We need to build a mental traffic light." }, { type: "do", text: "Explain: Red = Stop and breathe. Yellow = Think of two possible options. Green = Choose the best one and go." } ] },
      { time: "10–20 min", phase: "Role-Play", steps: [ { type: "do", text: "Read a scenario: 'Someone bumps you in the hall and your books fall.' Hold up the Red circle. 'What do you do right now?' (Breathe). Hold up Yellow. 'What are two options?' Hold up Green. 'Which do you choose?'" } ] },
      { time: "20–30 min", phase: "Practice", steps: [ { type: "do", text: "Run 3 more scenarios, letting the students call out the steps and act them out." } ] }
    ],
    debrief: [ { q: "Why is the Yellow step the most important one?", note: "It creates the necessary neurological pause where logic catches up to the emotional reaction." } ],
    watchOutFor: [ "Students choosing aggressive 'Green' actions for a laugh. Guide them back to evaluating the consequences of those choices." ],
    variations: [ { tag: "Active", text: "Have students physically take a step forward in the room for each light phase." } ],
    worksheet: { title: "Stop, Think, Go", intro: "Slow down your choices.", sections: [ { title: "My Traffic Light", prompts: [ { label: "A time I acted impulsively:", lines: 2 }, { label: "What I should have thought at the Yellow light:", lines: 2 } ] } ] }
  },
  {
    id: "l_dm_2", title: "The Choice Scale", themeShort: ["Decision making", "Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs", "Full class"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Weigh the pros and cons of everyday decisions to understand that every choice has a trade-off.", materials: ["Whiteboard", "Worksheets"],
    phases: [
      { time: "0–10 min", phase: "The Scale", steps: [ { type: "say", text: "Every choice has a cost. If you choose to play video games, the cost is your study time. If you study, the cost is your game time. Nothing is free." } ] },
      { time: "10–25 min", phase: "Weighing It Out", steps: [ { type: "do", text: "Give a common scenario: 'Staying up late to watch a movie on a school night.' Ask students to list 3 specific pros and 3 specific cons on their worksheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Does having a higher number of 'pros' automatically make it the right choice?" } ] }
    ],
    debrief: [ { q: "Can one massive 'con' outweigh three small 'pros'?", note: "Yes. Teach them that the weight of the consequence matters more than the quantity." } ],
    watchOutFor: [ "Students arguing that 'fun' is always the right answer. Guide them to consider the long-term impact." ],
    variations: [ { tag: "Physical", text: "Use a real balancing scale with physical blocks to represent the weight of pros/cons." } ],
    worksheet: { title: "The Choice Scale", intro: "Weigh it out.", sections: [ { title: "My Decision", prompts: [ { label: "The Choice:", lines: 1 }, { label: "The Heaviest Pro:", lines: 1 }, { label: "The Heaviest Con:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 6: Problem Solving ──
  {
    id: "l_ps_1", title: "The Human Knot", themeShort: ["Problem solving", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Physically collaborate to solve a complex spatial problem, identifying the importance of clear communication and emotional regulation.", materials: ["Open space"],
    phases: [
      { time: "0–5 min", phase: "The Setup", steps: [ { type: "do", text: "Divide the class into groups of 6-8 students." }, { type: "say", text: "Stand in a tight circle. Reach across and grab the hand of someone who is NOT standing right next to you. Now do the same with your other hand." } ] },
      { time: "5–20 min", phase: "The Challenge", steps: [ { type: "say", text: "You are now a human knot. Your goal is to untangle yourselves into a perfect circle WITHOUT letting go of anyone's hands." }, { type: "do", text: "Let them struggle. Do not intervene unless safety is a concern. Observe who takes charge." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Let us return to our seats and break down what just happened." } ] }
    ],
    debrief: [ { q: "Who stepped up as a leader? Did they boss people around, or did they guide them?", note: "Highlight the difference between directive and facilitative leadership." } ],
    watchOutFor: [ "Physical safety. Ensure students step over or duck under arms very carefully." ],
    variations: [ { tag: "Grade 7", text: "Run a second round in complete silence to force intense non-verbal problem solving." } ],
    worksheet: { title: "Knot Reflection", intro: "Think about how your group handled the frustration.", sections: [ { title: "Team Dynamics", prompts: [ { label: "When we got stuck, what helped most was:", lines: 2 }, { label: "One thing I did to help the team was:", lines: 2 } ] } ] }
  },
  {
    id: "l_ps_2", title: "Puzzle Solvers", themeShort: ["Problem solving", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Solve a puzzle with unequal information to highlight the absolute necessity of pooling resources.", materials: ["A simple printed logic puzzle cut in half"],
    phases: [
      { time: "0–5 min", phase: "The Setup", steps: [ { type: "do", text: "Give Student A clues 1-3. Give Student B clues 4-6." }, { type: "say", text: "You have half the clues, your partner has the other half. You cannot show your paper to your partner under any circumstances." } ] },
      { time: "5–25 min", phase: "The Solve", steps: [ { type: "do", text: "Pairs must talk it out to solve the logic grid." }, { type: "tip", text: "Circulate to ensure they are communicating verbally and not just peeking at the papers." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "You could only win if you actively listened to what the other person possessed." } ] }
    ],
    debrief: [ { q: "What happens to the solution if one person dominates the conversation?", note: "You miss half the necessary clues to solve the problem." } ],
    watchOutFor: [ "Students cheating and showing their papers. Enforce the verbal-only rule strictly." ],
    variations: [ { tag: "Easy", text: "Use a simple word riddle instead of a complex logic grid." } ],
    worksheet: { title: "Pooling Resources", intro: "We solve better together.", sections: [ { title: "Reflection", prompts: [ { label: "What was hard about not seeing the whole picture?", lines: 2 } ] } ] }
  },

  // ── WHO Skill 7: Effective Communication ──
  {
    id: "l_ec_1", title: "The 'I' Message Maker", themeShort: ["Effective communication"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Convert 'You' statements into 'I' statements to express feelings without causing defensiveness.", materials: ["Whiteboard", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "You vs I", steps: [ { type: "say", text: "When we are mad, we usually say: 'You always ignore me!' How does the other person react? They fight back." }, { type: "say", text: "An 'I' message diffuses anger. It works like this: I feel [emotion] when [behavior] happens." } ] },
      { time: "10–25 min", phase: "Translation", steps: [ { type: "do", text: "Write 'You stole my seat!' on the board. Have students translate it into a calm 'I' message on their worksheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Why do 'I' messages feel less attacking to the person hearing them?" } ] }
    ],
    debrief: [ { q: "Why is it harder to use 'I' messages in the heat of the moment?", note: "It requires vulnerability instead of anger." } ],
    watchOutFor: [ "Fake 'I' messages: 'I feel that YOU are a jerk.' Correct this gently to focus on the behavior, not the person." ],
    variations: [ { tag: "Role-play", text: "Have pairs act out the 'You' vs 'I' versions to hear the difference in tone." } ],
    worksheet: { title: "The I Message Maker", intro: "Change the way you complain.", sections: [ { title: "Translation", prompts: [ { label: "Translate: 'You never listen to me!'", lines: 2 } ] } ] }
  },
  {
    id: "l_ec_2", title: "Back-to-Back Drawing", themeShort: ["Effective communication"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Demonstrate the vital importance of clear, precise verbal instructions and active listening.", materials: ["Paper", "Pens", "Simple printed shapes"],
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "do", text: "Have pairs sit back-to-back on the floor. One student gets a printed drawing, the other gets a blank piece of paper." } ] },
      { time: "5–15 min", phase: "The Draw", steps: [ { type: "say", text: "Describe the drawing using ONLY geometric terms. For example: 'Draw a triangle in the top left.' The person drawing cannot speak." } ] },
      { time: "15–25 min", phase: "The Reveal", steps: [ { type: "do", text: "Have them turn around and compare the drawings. They will usually be vastly, hilariously different." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Why is giving clear instructions so incredibly difficult?" } ] }
    ],
    debrief: [ { q: "What happens when we assume someone knows exactly what we mean?", note: "It leads to total miscommunication." } ],
    watchOutFor: [ "Peeking. Ensure they stay strictly back-to-back." ],
    variations: [ { tag: "Two-way", text: "Run a second round where the drawer is allowed to ask yes/no clarifying questions." } ],
    worksheet: { title: "Clear Communication", intro: "Words matter.", sections: [ { title: "Reflection", prompts: [ { label: "Why did the drawing come out wrong?", lines: 2 }, { label: "How does this lesson apply to texting?", lines: 2 } ] } ] }
  },

  // ── WHO Skill 8: Interpersonal Relationships ──
  {
    id: "l_ir_1", title: "The Apology Anatomy", themeShort: ["Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Full class", "Pairs"], color: "#E67E22", colorPale: "#FDEDEC", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice the four structural steps of a genuine apology to effectively repair damaged relationships.", materials: ["Whiteboard", "Apology Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Fake Apology", steps: [ { type: "say", text: "We have all heard fake apologies. They sound like 'I am sorry you feel that way' or 'I am sorry, but...'. How do those make you feel?" } ] },
      { time: "10–20 min", phase: "Four Steps", steps: [ { type: "do", text: "Write the 4 steps on the board: 1. I am sorry for... 2. It was wrong because... 3. Next time I will... 4. Will you forgive me?" } ] },
      { time: "20–30 min", phase: "Fix It", steps: [ { type: "do", text: "Have pairs work together to rewrite the 'Fake Apologies' on the worksheet into 'Real Apologies'." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "say", text: "Which of the 4 steps is the hardest to say out loud?" } ] }
    ],
    debrief: [ { q: "Why do people give fake apologies?", note: "Usually out of pride, or fear of getting in trouble." } ],
    watchOutFor: [ "Students using the practice time to mock each other. Keep the scenarios fictional." ],
    variations: [ { tag: "Grade 5", text: "Focus heavily on Step 3 ('Next time I will...') to make the apology actionable." } ],
    worksheet: { title: "The Apology Anatomy", intro: "Turn fake apologies into real ones.", sections: [ { title: "Fix It", prompts: [ { label: "Fake: 'I am sorry if you got mad.' Write the REAL apology:", lines: 4 } ] } ] }
  },
  {
    id: "l_ir_2", title: "Friendship Fences", themeShort: ["Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual", "Full class"], color: "#E67E22", colorPale: "#FDEDEC", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Define healthy vs unhealthy friendship behaviors and establish personal boundaries.", materials: ["Red and Green construction paper cards"],
    phases: [
      { time: "0–10 min", phase: "Red Flag/Green Flag", steps: [ { type: "do", text: "Distribute the cards. Hold up Green if the behavior is healthy, Red if it crosses a boundary." }, { type: "say", text: "Scenario: They make fun of you in front of others but say it is just a joke. Red or Green?" } ] },
      { time: "10–25 min", phase: "Defining Fences", steps: [ { type: "say", text: "A boundary is like a fence. What are your friendship fences?" }, { type: "do", text: "Have students silently write down 3 absolute dealbreakers on their sheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the difficulty of enforcing a boundary with someone you like." } ] }
    ],
    debrief: [ { q: "Is a 'joke' still a joke if it consistently hurts your feelings?", note: "Impact matters significantly more than intent." } ],
    watchOutFor: [ "Students pointing fingers at specific classmates. Keep the discussion general." ],
    variations: [ { tag: "Active", text: "Have them physically move to opposite sides of the room for red/green instead of holding cards." } ],
    worksheet: { title: "My Friendship Fences", intro: "What is allowed in your yard?", sections: [ { title: "My Rules", prompts: [ { label: "I feel safe with a friend when they:", lines: 2 }, { label: "A dealbreaker for me is if a friend:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 9: Coping with Stress ──
  {
    id: "l_cs_1", title: "The Priority Jar", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Demonstration", "Individual"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Categorise tasks into Rocks, Pebbles, and Sand to understand prioritisation and reduce feeling overwhelmed.", materials: ["A clear jar, big rocks, small pebbles, sand", "Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Visual Demo", steps: [ { type: "say", text: "If we fill our time with the small stuff first, there is no room for the big things." }, { type: "do", text: "Show how putting the Rocks in first allows the sand to fill the gaps perfectly." } ] },
      { time: "10–20 min", phase: "Defining Rocks", steps: [ { type: "say", text: "Rocks are your non-negotiables (sleep, big assignments). Sand is filler (social media scrolling)." } ] },
      { time: "20–30 min", phase: "Sorting", steps: [ { type: "do", text: "Students list their weekly tasks and sort them into the jars on paper." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the emotional impact of getting the 'Rocks' done first." } ] }
    ],
    debrief: [ { q: "What happens to your stress levels when you put Sand in first?", note: "Leads to panic and staying up late." } ],
    watchOutFor: [ "Students arguing that gaming is a Rock. Validate relaxation, but clarify essential priorities." ],
    variations: [ { tag: "No props", text: "Draw the jar and rocks on the whiteboard instead of using physical items." } ],
    worksheet: { title: "The Priority Jar", intro: "Sort your time.", sections: [ { title: "My Jars", prompts: [ { label: "My Rocks (Must Do):", lines: 2 }, { label: "My Sand (Distractions):", lines: 2 } ] } ] }
  },
  {
    id: "l_cs_2", title: "The Worry Box", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Externalize anxieties by categorizing them as 'Actionable' or 'Let Go'.", materials: ["A physical cardboard box", "Small slips of paper"],
    phases: [
      { time: "0–10 min", phase: "Externalizing", steps: [ { type: "say", text: "When worries stay in our head, they grow. When we put them on paper, they shrink." }, { type: "do", text: "Have students write 3 worries on 3 slips of paper." } ] },
      { time: "10–20 min", phase: "Action vs Let Go", steps: [ { type: "say", text: "Look at your slips. Put an 'A' for Action if you can fix it today. Put an 'L' for Let Go if you cannot control it." } ] },
      { time: "20–30 min", phase: "The Box", steps: [ { type: "do", text: "Have students physically walk up and drop their 'L' slips into a sealed Worry Box at the front of the room." } ] }
    ],
    debrief: [ { q: "Did it feel different to put the paper in the box?", note: "Physical action helps mental release." } ],
    watchOutFor: [ "Students wanting to read others' slips. Keep the box strictly private." ],
    variations: [ { tag: "Shredder", text: "Let them rip up the 'Let Go' slips into a bin." } ],
    worksheet: { title: "Action vs Let Go", intro: "Sort your worries.", sections: [ { title: "My List", prompts: [ { label: "One worry I can take Action on today:", lines: 2 }, { label: "One worry I need to Let Go of into the box:", lines: 2 } ] } ] }
  },
  {
    id: "l_cs_3", title: "The Stress Balloon", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Demonstration", "Individual"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Visualize how stress accumulates and practice controlled release.", materials: ["Balloons"],
    phases: [
      { time: "0–10 min", phase: "The Build Up", steps: [ { type: "say", text: "Every time something stressful happens, air goes into the balloon." }, { type: "do", text: "Blow a small breath into a balloon for various common stressors (homework, fight with friend)." } ] },
      { time: "10–20 min", phase: "The Pop vs The Release", steps: [ { type: "say", text: "If we don't let it out, what happens? It pops." }, { type: "do", text: "Demonstrate letting air out slowly by stretching the neck of the balloon." } ] },
      { time: "20–30 min", phase: "Mapping", steps: [ { type: "do", text: "Students write down what fills their balloon, and what helps them let the air out slowly." } ] }
    ],
    debrief: [ { q: "What does 'popping' look like for you?", note: "Yelling, crying, shutting down." } ],
    watchOutFor: [ "Students popping balloons loudly. Maintain control of the physical props." ],
    variations: [ { tag: "Drawing", text: "Draw the balloon on the board if physical balloons are unavailable." } ],
    worksheet: { title: "My Stress Balloon", intro: "Let the air out slowly.", sections: [ { title: "My Triggers", prompts: [ { label: "What fills my balloon:", lines: 2 }, { label: "My controlled release valve:", lines: 2 } ] } ] }
  },
  {
    id: "l_cs_4", title: "5-4-3-2-1 Grounding", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class practice"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Learn a sensory grounding technique to interrupt anxiety spirals.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Spiral", steps: [ { type: "say", text: "When we panic, our brain lives in the future. We need to pull it back to the present." } ] },
      { time: "10–20 min", phase: "The Senses", steps: [ { type: "do", text: "Guide them: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste." } ] },
      { time: "20–30 min", phase: "Practice", steps: [ { type: "do", text: "Run the exercise in complete silence. Have them write their sensory observations." } ] }
    ],
    debrief: [ { q: "Did your heart rate change after doing this?", note: "Usually slows down." } ],
    watchOutFor: [ "Students rushing through it. Force them to take 30 seconds for each sense." ],
    variations: [ { tag: "Nature", text: "Do this outside in the schoolyard." } ],
    worksheet: { title: "Grounding", intro: "Come back to the present.", sections: [ { title: "My Senses", prompts: [ { label: "5 things I see right now:", lines: 2 }, { label: "4 things I can physically feel:", lines: 2 } ] } ] }
  },
  {
    id: "l_cs_5", title: "Muscle Squeeze and Release", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class practice"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice Progressive Muscle Relaxation to relieve physical tension caused by stress.", materials: ["Calm music"],
    phases: [
      { time: "0–5 min", phase: "Body Check", steps: [ { type: "say", text: "We hold stress in our muscles without realizing it." } ] },
      { time: "5–20 min", phase: "The Squeeze", steps: [ { type: "do", text: "Guide students to squeeze their toes tightly for 5 seconds, then release. Move up the legs, stomach, fists, shoulders, and face." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the difference between how their shoulders felt at the start versus the end." } ] }
    ],
    debrief: [ { q: "Where were you holding the most tension?", note: "Jaw and shoulders are most common." } ],
    watchOutFor: [ "Giggling during the face-scrunching phase. Keep the tone relaxed." ],
    variations: [ { tag: "Quick version", text: "Just do the fists and shoulders before a test." } ],
    worksheet: { title: "Tension Check", intro: "Release the pressure.", sections: [ { title: "My Body", prompts: [ { label: "I hold my stress in my:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 10: Coping with Emotions ──
  {
    id: "l_ce_1", title: "The Emotion Thermometer", themeShort: ["Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual", "Full class"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Map the intensity of emotions from 1 to 10 and identify specific coping strategies for when the temperature gets too high.", materials: ["Thermometer Worksheets", "Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "Mapping", steps: [ { type: "do", text: "Draw a large thermometer on the board." }, { type: "say", text: "We do not just feel 'angry'. We feel 'annoyed' (2), 'frustrated' (5), or 'furious' (9)." } ] },
      { time: "10–25 min", phase: "Personalizing", steps: [ { type: "do", text: "Fill in warning signs for levels 3, 6, and 9 on the worksheet." } ] },
      { time: "25–35 min", phase: "Cooling Down", steps: [ { type: "say", text: "Write one thing to cool down when you hit a 6, before you reach a 9." } ] }
    ],
    debrief: [ { q: "Why notice when you are at a 6?", note: "Easier to cool down before an explosion." } ],
    watchOutFor: [ "Students struggling to identify physical symptoms. Offer examples." ],
    variations: [ { tag: "Short session", text: "Focus only on anger, rather than all emotions." } ],
    worksheet: { title: "My Emotion Thermometer", intro: "Map your warning signs.", sections: [ { title: "Temperature Check", prompts: [ { label: "At a 3 (Mild), I notice my body:", lines: 2 }, { label: "At a 9 (High), I usually:", lines: 2 }, { label: "To cool down from a 6, I will:", lines: 2 } ] } ] }
  },
  {
    id: "l_ce_2", title: "Belly Breathing Buddies", themeShort: ["Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "25 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Learn diaphragmatic breathing to regulate the nervous system during emotional spikes.", materials: ["A small, light object for each student (eraser, folded paper)"],
    phases: [
      { time: "0–5 min", phase: "Science of Panic", steps: [ { type: "say", text: "When we panic, we breathe from our chest. To calm down, we must breathe from our belly." } ] },
      { time: "5–15 min", phase: "The Exercise", steps: [ { type: "do", text: "Lean back. Place the 'buddy' (eraser) on the stomach." }, { type: "say", text: "Breathe in for 4 seconds. Make the buddy go UP. Breathe out for 6 seconds. Make the buddy go DOWN." } ] },
      { time: "15–25 min", phase: "Debrief", steps: [ { type: "say", text: "Notice how your shoulders dropped. You just hacked your own nervous system." } ] }
    ],
    debrief: [ { q: "When is a time at school you could use this?", note: "Before a test, after an argument." } ],
    watchOutFor: [ "Giggling. Keep your voice low and calm to set the tone." ],
    variations: [ { tag: "Box Breathing", text: "In for 4, hold for 4, out for 4, hold for 4." } ],
    worksheet: { title: "Belly Breathing", intro: "Hack your nervous system.", sections: [ { title: "My Plan", prompts: [ { label: "I will use belly breathing when I feel:", lines: 2 } ] } ] }
  },
  {
    id: "l_ce_3", title: "The Emotion Log", themeShort: ["Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Track emotional states to identify triggers and realize the impermanence of feelings.", materials: ["Emotion Log templates"],
    phases: [
      { time: "0–10 min", phase: "Myth of Permanence", steps: [ { type: "say", text: "When we are sad, our brain says 'I will feel this forever'. Tracking proves the brain wrong." } ] },
      { time: "10–20 min", phase: "Setting up the Log", steps: [ { type: "do", text: "Explain how to track morning, afternoon, and evening emotions using simple colours." } ] },
      { time: "20–30 min", phase: "Reflection", steps: [ { type: "say", text: "Fill out yesterday retrospectively. Did your emotion stay the exact same all day?" } ] }
    ],
    debrief: [ { q: "Why is it helpful to know emotions change?", note: "It creates hope and endurance." } ],
    watchOutFor: [ "Making it feel like homework. Make it a 2-minute daily class ritual instead." ],
    variations: [ { tag: "Grade 7", text: "Add a 'trigger' column to identify causes." } ],
    worksheet: { title: "Emotion Log", intro: "Emotions are weather. Track the changes.", sections: [ { title: "Tracking", prompts: [ { label: "My biggest shift yesterday was:", lines: 2 } ] } ] }
  },
  {
    id: "l_ce_4", title: "Name It to Tame It", themeShort: ["Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Use precise emotional vocabulary to down-regulate the amygdala during high stress.", materials: ["Emotion Wheel handouts"],
    phases: [
      { time: "0–10 min", phase: "The Neuroscience", steps: [ { type: "say", text: "Brain scans show that putting a precise name to an emotion turns down the alarm center in your brain." } ] },
      { time: "10–20 min", phase: "The Wheel", steps: [ { type: "do", text: "Hand out Emotion Wheels. Have students trace 'Angry' out to 'Betrayed' or 'Disrespected'." } ] },
      { time: "20–30 min", phase: "Practice", steps: [ { type: "do", text: "Read scenarios. Have pairs find the hyper-specific emotion word for it." } ] }
    ],
    debrief: [ { q: "Did finding the exact word make you feel more in control?", note: "Shifts brain activity to the prefrontal cortex." } ],
    watchOutFor: [ "Students feeling overwhelmed by the number of words." ],
    variations: [ { tag: "Journaling", text: "Have them write a paragraph using 3 specific wheel words." } ],
    worksheet: { title: "Name It To Tame It", intro: "Precision brings calm.", sections: [ { title: "My Vocabulary", prompts: [ { label: "Instead of 'Mad', I am actually feeling:", lines: 1 } ] } ] }
  },
  {
    id: "l_ce_5", title: "The Calm Down Toolkit", themeShort: ["Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Create a personalized menu of healthy coping mechanisms to use during emotional distress.", materials: ["Worksheet", "Markers"],
    phases: [
      { time: "0–10 min", phase: "One Size Doesn't Fit All", steps: [ { type: "say", text: "What calms me down might stress you out. You need your own toolkit." } ] },
      { time: "10–25 min", phase: "Building the Kit", steps: [ { type: "do", text: "Students write down 5 things they can realistically do at school or home when overwhelmed (e.g., drink cold water, draw, listen to a specific song)." } ] },
      { time: "25–35 min", phase: "Sharing", steps: [ { type: "do", text: "Share toolkits in small groups to gather new ideas." } ] }
    ],
    debrief: [ { q: "Why do we need more than one tool in the kit?", note: "Because you can't always listen to music during class." } ],
    watchOutFor: [ "Unhealthy coping mechanisms like 'punch a wall'. Guide them to safe alternatives." ],
    variations: [ { tag: "Physical Kit", text: "Have them actually build a small box with physical items (stress ball, mints)." } ],
    worksheet: { title: "My Toolkit", intro: "Your personal menu.", sections: [ { title: "My Tools", prompts: [ { label: "Tool 1 (At School):", lines: 1 }, { label: "Tool 2 (At Home):", lines: 1 } ] } ] }
  },

// ──────────────────────── MIDDLE SECONDARY (Grade 8-10) ────────────────────────
  // ============================================================================
  // MIDDLE SECONDARY ACTIVITIES (WHO Life Skills) - Expanded & Enhanced
  // ============================================================================
  
  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "m_sa_1", title: "The Core Values Audit", themeShort: ["Self-awareness", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual", "Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Students will narrow down a list of values to their top 3 core values, and use them to evaluate a recent decision.", materials: ["List of 50 Values", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "The 50 to 5 Challenge", steps: [ { type: "do", text: "Hand out the list of 50 values (e.g., Wealth, Family, Honesty, Freedom, Adventure, Security, Loyalty)." }, { type: "say", text: "Take a marker and circle your top 10 values. These are the things you care about most. Now, make it harder: cross out 5 of them. You can only keep 5." } ] },
      { time: "10–20 min", phase: "The Final 3", steps: [ { type: "say", text: "Now cross out 2 more. You are left with your top 3 Core Values. These are the foundation of who you are and the things that should drive your biggest decisions." }, { type: "do", text: "Give them time to struggle. Choosing between two good things (like 'Success' and 'Family') should be hard." } ] },
      { time: "20–35 min", phase: "Value Alignment", steps: [ { type: "say", text: "Think of a recent decision you made that felt wrong, stressful, or left you feeling guilty. Look at your 3 values. Did that decision violate one of your core values? Write it down privately." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how knowing our values acts as a compass when we are lost or confused about what to do." } ] }
    ],
    debrief: [ { q: "Was it hard to eliminate 'Success' to keep 'Integrity' or 'Family'?", note: "Forces them to define what success actually means to them personally." } ],
    watchOutFor: [ "Students picking values they think sound 'good' to teachers or parents. Encourage brutal, private honesty." ],
    variations: [ { tag: "Grade 10", text: "Apply their top 3 values to their upcoming subject or college stream choices." } ],
    worksheet: { title: "My Core Values", intro: "Your values are your compass.", sections: [ { title: "The Final 3", prompts: [ { label: "Value 1, 2, 3:", lines: 2 }, { label: "A decision that conflicted with my values:", lines: 2 } ] } ] }
  },
  {
    id: "m_sa_2", title: "The Identity Mask", themeShort: ["Self-awareness", "Coping with emotions"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual art activity"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Explore how students present themselves vs how they feel inside to understand the burden of emotional masking.", materials: ["Paper mask templates", "Markers"],
    phases: [
      { time: "0–10 min", phase: "The Concept", steps: [ { type: "say", text: "We all wear masks at school. Sometimes we wear the 'tough' mask, the 'always joking' mask, or the 'I do not care' mask. We do this to fit in or to protect ourselves." } ] },
      { time: "10–25 min", phase: "Front and Back", steps: [ { type: "do", text: "On the front of the mask, have students draw or write how they act at school (e.g., 'loud', 'confident', 'sarcastic')." }, { type: "say", text: "On the inside of the mask, write what you actually feel but hide from people (e.g., 'stressed', 'lonely', 'worried about my grades')." } ] },
      { time: "25–35 min", phase: "Reflection", steps: [ { type: "say", text: "Look at the gap between the inside and outside. Is wearing that front mask exhausting? How much energy does it take to hide the inside?" } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Reassure them that having a private self is normal and safe, but hiding completely from everyone can lead to burnout." } ] }
    ],
    debrief: [ { q: "Who is one person in your life you can take the mask off around?", note: "Helps identify safe, authentic support systems." } ],
    watchOutFor: [ "Do not force students to share the inside of their masks. Collect them face down if you collect them at all." ],
    variations: [ { tag: "Digital", text: "Compare their Instagram profile (the front) to their real life (the inside)." } ],
    worksheet: { title: "The Identity Mask", intro: "Front vs Back.", sections: [ { title: "Reflection", prompts: [ { label: "Why do I wear the mask I wear?", lines: 2 }, { label: "One person who sees the real me:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "m_em_1", title: "The Echo Chamber", themeShort: ["Empathy", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Understand algorithms and practice finding empathy for opposing views through 'steel-manning'.", materials: ["Whiteboard", "Controversial school/lifestyle topics"],
    phases: [
      { time: "0–10 min", phase: "Algorithm", steps: [ { type: "say", text: "Social media shows you what you already agree with. This is an echo chamber. It makes us think people who disagree with us are crazy or evil because we never actually hear their side fairly." } ] },
      { time: "10–25 min", phase: "Steel-manning", steps: [ { type: "say", text: "Today we will 'steel-man' an argument. That means you must make the strongest, most logical possible argument for the OTHER side." }, { type: "do", text: "Give a topic like 'School uniforms should be banned.' If a group agrees with banning them, they MUST spend 10 minutes arguing why uniforms are essential and good." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how understanding the logic of the other side reduces our anger towards them, even if we still disagree." } ] }
    ],
    debrief: [ { q: "Does understanding an argument mean you agree with it?", note: "No. Empathy does not equal agreement. It just equals understanding." } ],
    watchOutFor: [ "Keep topics to school/lifestyle issues. Avoid highly polarized or traumatic political fights for this age group." ],
    variations: [ { tag: "Grade 10", text: "Use real opinion articles from opposing news sources." } ],
    worksheet: { title: "Steel-Manning", intro: "Make the strongest argument for the side you disagree with.", sections: [ { title: "The Other Side", prompts: [ { label: "The issue:", lines: 1 }, { label: "My actual view:", lines: 1 }, { label: "The absolute best argument for the OPPOSITE view is:", lines: 3 } ] } ] }
  },
  {
    id: "m_em_2", title: "The Step Forward", themeShort: ["Empathy", "Interpersonal relationships"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Physical movement", "Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Visualize hidden advantages and disadvantages to build empathy for peers with different life circumstances.", materials: ["Open floor space", "List of carefully chosen statements"],
    phases: [
      { time: "0–5 min", phase: "Line Up", steps: [ { type: "do", text: "Have all students stand in a single, straight line across the back of the room, holding hands if they are comfortable doing so." } ] },
      { time: "5–20 min", phase: "Statements", steps: [ { type: "say", text: "I will read a statement. Take a step forward if it applies to you. Take a step back if the opposite applies. Do this silently." }, { type: "do", text: "Read statements: 'Step forward if you have your own bedroom.' 'Step back if you worry about your parents paying school fees.' 'Step forward if you feel completely safe walking home.' 'Step back if you have ever been mocked for your accent or language.'" } ] },
      { time: "20–35 min", phase: "Look Around", steps: [ { type: "say", text: "Stop. Let go of hands. Look where you are compared to where you started. Look at who is in front and who is in back." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Have them sit exactly where they ended up and debrief the emotional experience of the gap." } ] }
    ],
    debrief: [ { q: "How did it feel when you had to let go of someone's hand because the gap between you grew too wide?", note: "A powerful physical metaphor for social division and privilege." } ],
    watchOutFor: [ "Do NOT use statements that expose deeply traumatic secrets or target specific, visible minorities in a way that causes shame." ],
    variations: [ { tag: "Closed eyes", text: "Have them keep their eyes closed until the very end so they don't compare themselves during the walk." } ],
    worksheet: { title: "The Step Forward", intro: "Reflect on where we stand.", sections: [ { title: "My Position", prompts: [ { label: "One advantage I have that I rarely think about:", lines: 2 }, { label: "How can I use my position to support someone further back?", lines: 2 } ] } ] }
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "m_ct_1", title: "Media Manipulation Detective", themeShort: ["Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Identify common logical fallacies and manipulation tactics in media and advertising.", materials: ["Printed examples of clickbait/ads", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Tactics", steps: [ { type: "do", text: "Introduce three common media tactics on the board: Fear-mongering (making you scared), Bandwagon ('everyone is doing it'), and False Urgency ('buy now before it is gone forever')." } ] },
      { time: "10–25 min", phase: "Investigation", steps: [ { type: "do", text: "Have pairs review the printed ads or clickbait headlines and label which of the three tactics is being used to manipulate the reader." } ] },
      { time: "25–35 min", phase: "Creation", steps: [ { type: "say", text: "Now it is your turn. Create a highly manipulative advertisement for a completely boring object, like a standard yellow pencil, using all three tactics." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how recognizing the psychological trick removes its power over you." } ] }
    ],
    debrief: [ { q: "Why do these tactics work so well on our brains?", note: "They bypass logic and trigger our emotional survival centers (fear, belonging)." } ],
    watchOutFor: [ "Ensure the ad examples are age-appropriate and not promoting harmful products." ],
    variations: [ { tag: "Tech-enabled", text: "Have them find live examples on their own Instagram or YouTube feeds." } ],
    worksheet: { title: "Media Detective", intro: "Spot the trick.", sections: [ { title: "Tactics", prompts: [ { label: "An example of False Urgency I found:", lines: 2 }, { label: "How I will question this online in the future:", lines: 2 } ] } ] }
  },
  {
    id: "m_ct_2", title: "The Fact-Checker", themeShort: ["Critical thinking", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Differentiate between objective facts, subjective opinions, and manipulative language in news articles.", materials: ["Printed articles", "Yellow and Pink Highlighters"],
    phases: [
      { time: "0–10 min", phase: "Fact vs Opinion", steps: [ { type: "say", text: "A fact can be proven with data. An opinion is a belief. An opinion disguised as a fact is manipulative and dangerous." } ] },
      { time: "10–25 min", phase: "Audit", steps: [ { type: "do", text: "Give groups the articles. Have them highlight verifiable facts in yellow, and subjective opinions in pink." } ] },
      { time: "25–35 min", phase: "Presenting", steps: [ { type: "do", text: "Have groups share the most manipulative or cleverly disguised sentence they found where an opinion was presented as a hard fact." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how to apply this 'highlighter' mindset to reading social media feeds." } ] }
    ],
    debrief: [ { q: "How often do you read an opinion online and automatically accept it as a fact?", note: "Encourage honest self-reflection." } ],
    watchOutFor: [ "Using highly controversial political articles. Use local issues or op-eds about technology/school to keep the focus on logic, not politics." ],
    variations: [ { tag: "Grade 10", text: "Use real social media influencer posts promoting a lifestyle or product." } ],
    worksheet: { title: "Fact-Checker Audit", intro: "Highlight the truth.", sections: [ { title: "Analysis", prompts: [ { label: "One opinion disguised as a fact that I found:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 4: Creative Thinking ──
  {
    id: "m_crt_1", title: "Design a Utopia", themeShort: ["Creative thinking", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Collaboratively design a perfect society to understand the necessary trade-offs in governance and community living.", materials: ["Chart paper", "Markers"],
    phases: [
      { time: "0–10 min", phase: "Blank Slate", steps: [ { type: "say", text: "You are designing a brand new society on Mars. You make the rules from scratch. Write down your 5 core laws." } ] },
      { time: "10–20 min", phase: "Trade-offs", steps: [ { type: "do", text: "Ask groups to decide their main goal. Is it Happiness? Technological Progress? Absolute Equality? They must pick one primary value." } ] },
      { time: "20–30 min", phase: "The Curveball", steps: [ { type: "say", text: "A crisis hits: a severe food shortage. Do your original rules still work? How does your Utopia survive this without changing its core values?" } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the trade-offs they had to make. Did equality sacrifice progress? Did security sacrifice freedom?" } ] }
    ],
    debrief: [ { q: "Did you prioritize freedom or security when the crisis hit?", note: "A classic sociological and political trade-off." } ],
    watchOutFor: [ "Groups making violent or 'Purge' style rules. Keep the exercise constructive and focused on civic duty." ],
    variations: [ { tag: "Quick", text: "Design a perfect school instead of an entire planet." } ],
    worksheet: { title: "Utopia Design", intro: "You make the rules.", sections: [ { title: "The Foundation", prompts: [ { label: "The hardest trade-off we made in our laws was:", lines: 2 } ] } ] }
  },
  {
    id: "m_crt_2", title: "The Worst Idea First", themeShort: ["Creative thinking", "Problem solving"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Lower the barrier to brainstorming by explicitly asking for terrible ideas, then reverse-engineering them into brilliant solutions.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "Anti-Brainstorm", steps: [ { type: "say", text: "We have a problem: the cafeteria line is too long. Give me the absolute WORST, most disastrous ideas to solve this issue." }, { type: "do", text: "Write them on the board. Enjoy the ridiculousness (e.g., 'throw the food at the students')." } ] },
      { time: "10–20 min", phase: "The Flip", steps: [ { type: "say", text: "Now, pick one terrible idea. How could we tweak it to make it brilliant? Or what is the exact opposite of that idea?" } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss why starting with bad ideas unlocks creativity by removing the pressure to be 'smart'." } ] }
    ],
    debrief: [ { q: "Why was it easier to come up with bad ideas than good ones?", note: "No fear of judgment." } ],
    watchOutFor: [ "Inappropriate or harmful ideas during the bad idea phase. Set clear boundaries." ],
    variations: [ { tag: "Pairs", text: "Do this to solve personal problems or study habits." } ],
    worksheet: { title: "The Worst Idea First", intro: "Bad ideas are bridges.", sections: [ { title: "The Flip", prompts: [ { label: "The terrible idea:", lines: 1 }, { label: "The flipped, brilliant version:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "m_dm_1", title: "The 10-10-10 Rule", themeShort: ["Decision making", "Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Apply a time-travel framework to gain long-term perspective on decisions and reduce immediate anxiety.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Framework", steps: [ { type: "say", text: "When we are stressed, a decision feels like life or death. Ask yourself: How will I feel about this choice in 10 minutes? In 10 months? In 10 years?" } ] },
      { time: "10–20 min", phase: "Application", steps: [ { type: "do", text: "Have students pick a current stressor (e.g., quitting a club, confronting a friend) and run it through the 3 timeframes on paper." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Notice how the 10-year box usually completely shifts your perspective on the problem." } ] }
    ],
    debrief: [ { q: "Did your stress shrink when you looked at the 10-month mark?", note: "Perspective shifts reality." } ],
    watchOutFor: [ "Dismissing valid current feelings. Acknowledge that the 10-minute pain is still very real." ],
    variations: [ { tag: "Grade 8", text: "Use 10 minutes, 10 days, 10 weeks for younger students." } ],
    worksheet: { title: "The 10-10-10 Rule", intro: "Zoom out.", sections: [ { title: "Time Travel", prompts: [ { label: "The Choice:", lines: 1 }, { label: "In 10 years, I will feel:", lines: 2 } ] } ] }
  },
  {
    id: "m_dm_2", title: "The Choice Crossroads", themeShort: ["Decision making", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Physical movement", "Pairs", "Full class"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practise structured decision-making by arguing for your choice, and then arguing the exact opposite side.", materials: ["4 corner labels: A, B, C, D", "Scenario Cards", "Worksheet"],
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "do", text: "Place A/B/C/D labels in the four corners of the room." }, { type: "say", text: "When I read a scenario, physically move to the corner that matches your decision." } ] },
      { time: "5–20 min", phase: "Rounds 1 & 2", steps: [ { type: "say", text: "Scenario 1. Move to your corner." }, { type: "do", text: "Give corners 60 seconds to discuss: 'Why did you choose this?' and present to the class." }, { type: "say", text: "Now — switch. Move to the corner that is the OPPOSITE of what you just argued. Prepare the best possible arguments for this new position." } ] },
      { time: "20–30 min", phase: "Values Mapping", steps: [ { type: "say", text: "Let us slow down and look underneath our choices." }, { type: "do", text: "Students pick ONE scenario and complete the Decision Framework worksheet to map the values driving the choice." } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "do", text: "Use debrief questions to close." } ] }
    ],
    debrief: [ { q: "What was it like to have to argue for the OPPOSITE of what you actually believe?", note: "This builds profound cognitive flexibility." }, { q: "Think of a real decision you are currently facing. Which framework step do you usually skip?", note: "Bridge from the classroom exercise to real life." } ],
    watchOutFor: [ "Students clustering in one corner just because their friends are there. Enforce independent choices." ],
    variations: [ { tag: "Short session", text: "Run only one scenario with the switch to save time." } ],
    worksheet: { title: "The Choice Crossroads", intro: "Use this framework to slow down and really examine ONE decision.", sections: [ { title: "My Decision Framework", prompts: [ { label: "The scenario I am working with:", lines: 2 }, { label: "The values driving my choice:", lines: 2 }, { label: "The strongest argument AGAINST my choice:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 6: Problem Solving ──
  {
    id: "m_ps_1", title: "The Escape Room Logic", themeShort: ["Problem solving", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Solve sequential logic puzzles emphasizing role division and collaboration under time pressure.", materials: ["Printed puzzle packets (3 sequential puzzles)"],
    phases: [
      { time: "0–5 min", phase: "The Brief", steps: [ { type: "say", text: "You have exactly 25 minutes. Puzzle 1 gives the password to open Puzzle 2. You must work together to escape." } ] },
      { time: "5–30 min", phase: "Escape", steps: [ { type: "do", text: "Groups work frantically. Observe their time management, who reads instructions, and who panics." } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "say", text: "When you got stuck, did your group get louder and more chaotic, or quieter and more focused?" } ] }
    ],
    debrief: [ { q: "Did you divide roles or did everyone try to do the exact same thing at once?", note: "Division of labor is key to advanced problem solving." } ],
    watchOutFor: [ "One highly dominant student doing the entire puzzle while others watch. Require taking turns." ],
    variations: [ { tag: "Tech-enabled", text: "Use Google Forms with password-protected sections to automate the 'escape'." } ],
    worksheet: { title: "Escape Reflection", intro: "How did you handle the pressure?", sections: [ { title: "Teamwork", prompts: [ { label: "My specific role in the group was:", lines: 1 }, { label: "When we were stuck, I reacted by:", lines: 2 } ] } ] }
  },
  {
    id: "m_ps_2", title: "The Community Fix", themeShort: ["Problem solving", "Interpersonal relationships"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Design a zero-budget intervention to solve a school social issue using psychology and nudges.", materials: ["Whiteboard", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Constraint", steps: [ { type: "say", text: "You have to fix the school's littering problem. But you have zero money and you cannot use any punishments or detentions." } ] },
      { time: "10–25 min", phase: "Design", steps: [ { type: "do", text: "Have groups use behavioral nudges to design a solution (e.g., painting footprints to the bin, or turning the bin into a basketball hoop)." } ] },
      { time: "25–35 min", phase: "Pitch", steps: [ { type: "do", text: "Have groups present their zero-budget psychological fixes to the class." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how strict constraints force better, more creative problem solving." } ] }
    ],
    debrief: [ { q: "Why is a psychological nudge often better than a punishment?", note: "It changes internal motivation, not just behavior based on fear." } ],
    watchOutFor: [ "Ideas that secretly require money (like 'buy a giant TV'). Force them to stick to the zero-budget constraint." ],
    variations: [ { tag: "Real Action", text: "Actually implement the winning idea in the school hallways for a week." } ],
    worksheet: { title: "Zero Budget Fix", intro: "Solve problems with psychology.", sections: [ { title: "The Plan", prompts: [ { label: "The Problem:", lines: 1 }, { label: "Our behavioral nudge solution:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 7: Effective Communication ──
  {
    id: "m_ec_1", title: "The Push & Stand", themeShort: ["Effective communication", "Interpersonal relationships"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Physical pairs activity", "Role-play"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Physically and verbally experience the three responses to peer pressure: give in, push back, step aside.", materials: ["Open space", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Physical Push", steps: [ { type: "do", text: "Have pairs push palms gently against each other. Then stand perfectly still while being pushed. Then fluidly step aside." }, { type: "say", text: "This represents Force, Surrender, and Deflection." } ] },
      { time: "10–20 min", phase: "Verbal Practice", steps: [ { type: "do", text: "Practice the 3 verbal responses (Push Back, Give In, Step Aside) to a scenario: 'Skip class with us.'" } ] },
      { time: "20–30 min", phase: "Scripting", steps: [ { type: "do", text: "Students write their own personalized boundary scripts on the worksheet." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss default responses and why 'Push Back' feels so difficult." } ] }
    ],
    debrief: [ { q: "Which response is your default in real life?", note: "Create self-awareness of their habits." } ],
    watchOutFor: [ "Physical activity getting too rough. Stop it immediately if it escalates." ],
    variations: [ { tag: "Grade 8", text: "Focus strictly on social peer pressure (gossip, exclusion) rather than serious risk behaviors." } ],
    worksheet: { title: "My Boundary Scripts", intro: "Have a script ready.", sections: [ { title: "My Scripts", prompts: [ { label: "My Push Back script:", lines: 2 }, { label: "My Step Aside script:", lines: 2 } ] } ] }
  },
  {
    id: "m_ec_2", title: "Debate vs Dialogue", themeShort: ["Effective communication", "Empathy"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Experience the profound difference between listening to win and listening to understand.", materials: ["Controversial prompts"],
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "say", text: "In a debate, you listen for flaws so you can attack. In dialogue, you listen for truth so you can connect." } ] },
      { time: "5–15 min", phase: "Debate", steps: [ { type: "do", text: "Give pairs a topic. Have them argue to WIN for 3 intense minutes." } ] },
      { time: "15–25 min", phase: "Dialogue", steps: [ { type: "say", text: "Same topic. Now you must summarize what the other person said, to their total satisfaction, before you are allowed to speak your point." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "do", text: "Compare the physical and emotional feeling in your body between the two rounds." } ] }
    ],
    debrief: [ { q: "How did your body feel in Round 1 vs Round 2?", note: "Usually Tense vs Relaxed." } ],
    watchOutFor: [ "Round 1 getting too heated. Keep the topics light (e.g., Marvel vs DC, Dogs vs Cats)." ],
    variations: [ { tag: "Grade 10", text: "Use real, relevant school issues (e.g., uniform rules) for the topics." } ],
    worksheet: { title: "Dialogue Rules", intro: "Listen to understand.", sections: [ { title: "Reflection", prompts: [ { label: "Why is dialogue so much harder than debate?", lines: 2 } ] } ] }
  },

  // ── WHO Skill 8: Interpersonal Relationships ──
  {
    id: "m_ir_1", title: "The Two-Story House", themeShort: ["Interpersonal relationships", "Problem solving"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Pairs", "Trio (with observer)"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Distinguish between positions (what I want) and interests (what I need) in conflict negotiation.", materials: ["Conflict scenario cards", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Metaphor", steps: [ { type: "say", text: "Positions are what we SAY. Interests are WHY we say it. E.g., 'I want the orange' is a position. 'I need the juice' is an interest." } ] },
      { time: "10–25 min", phase: "Trio Practice", steps: [ { type: "do", text: "Person A and B argue a scenario. The Observer listens solely to identify the underlying interest behind the shouting." } ] },
      { time: "25–35 min", phase: "Mapping", steps: [ { type: "do", text: "Students privately map a real personal conflict on the worksheet, guessing the other person's 'interest'." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how knowing the interest creates empathy." } ] }
    ],
    debrief: [ { q: "Did hearing their interest change your anger towards them?", note: "It humanizes the opponent." } ],
    watchOutFor: [ "Students reopening real conflicts with each other in class." ],
    variations: [ { tag: "Pairs only", text: "Remove the Observer role for smaller classes." } ],
    worksheet: { title: "Positions & Interests", intro: "Look underneath.", sections: [ { title: "My Conflict", prompts: [ { label: "My Position vs Their Position:", lines: 2 }, { label: "My Interest vs Their Interest:", lines: 2 } ] } ] }
  },
  {
    id: "m_ir_2", title: "Toxic vs Healthy Tracker", themeShort: ["Interpersonal relationships", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Audit relationships to identify energy drains and establish healthy boundaries.", materials: ["Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Battery Metaphor", steps: [ { type: "say", text: "Some relationships charge your battery. Some constantly drain it. If you only have drains, you burn out." } ] },
      { time: "10–20 min", phase: "Audit", steps: [ { type: "do", text: "Have students privately rate 5 close people as chargers, neutral, or drains." } ] },
      { time: "20–30 min", phase: "Boundaries", steps: [ { type: "say", text: "For one 'drain', write one specific boundary you will set this week." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the profound guilt associated with setting boundaries." } ] }
    ],
    debrief: [ { q: "Why do we feel so guilty setting boundaries with friends?", note: "Fear of being perceived as mean or losing the friendship." } ],
    watchOutFor: [ "Privacy is critical. Ensure no one sees anyone else's audit." ],
    variations: [ { tag: "Anonymous", text: "Collect examples of 'drains' on folded paper to discuss generally." } ],
    worksheet: { title: "The Battery Audit", intro: "Protect your energy.", sections: [ { title: "Action Plan", prompts: [ { label: "One boundary I need to set:", lines: 2 }, { label: "Exactly what I will say to set it:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 9: Coping with Stress ──
  // Note: 5 robust Coping with Stress activities for Middle Secondary.
  {
    id: "m_cs_1", title: "The Reverse Calendar", themeShort: ["Coping with stress", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual", "Pairs"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Apply backward planning to a major goal to significantly reduce deadline-induced panic.", materials: ["Blank Calendar Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Why Goals Fail", steps: [ { type: "say", text: "We plan forward, get overwhelmed, and quit. Professional planners work backwards from the deadline." } ] },
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Students pick a big project or exam. Write the end date. Map back to 1 month before, 1 week before, and tomorrow." } ] },
      { time: "25–30 min", phase: "Accountability", steps: [ { type: "do", text: "Share 'Tomorrow's step' with a partner to make it real." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the psychological relief of seeing the steps clearly laid out." } ] }
    ],
    debrief: [ { q: "Is your first step ACTUALLY doable in 15 minutes?", note: "Force them to make the first step smaller if it is too big." } ],
    watchOutFor: [ "Vague goals like 'Study harder'. Force specificity." ],
    variations: [ { tag: "Grade 10", text: "Extend to a one year timeline for board exams." } ],
    worksheet: { title: "Reverse Calendar", intro: "Start at the end.", sections: [ { title: "The Plan", prompts: [ { label: "End Date:", lines: 1 }, { label: "TOMORROW's 15-minute step:", lines: 1 } ] } ] }
  },
  {
    id: "m_cs_2", title: "The Stress Mindset Reframe", themeShort: ["Coping with stress", "Coping with emotions"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Full class"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Shift from viewing stress as a threat to viewing it as a biological performance enhancer.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Science", steps: [ { type: "say", text: "When your heart races before a test, it is not panic. It is your body pumping oxygen to your brain so you perform better. Stress is biological preparation." } ] },
      { time: "10–20 min", phase: "Reframe", steps: [ { type: "do", text: "Flip the script. 'I am stressed' becomes 'My body is preparing me for a challenge.'" } ] },
      { time: "20–30 min", phase: "Application", steps: [ { type: "do", text: "Apply this reframe to their biggest current academic stressor." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "say", text: "How does changing the story change the physical feeling in your chest?" } ] }
    ],
    debrief: [ { q: "Can stress ever be a good thing?", note: "Yes, it creates focus and drive if channelled correctly." } ],
    watchOutFor: [ "Invalidating chronic, toxic stress (like abuse). Acknowledge the difference between acute challenge stress and chronic trauma." ],
    variations: [ { tag: "Athletics", text: "Apply this specifically to sports performance anxiety." } ],
    worksheet: { title: "Stress Reframing", intro: "Change the story.", sections: [ { title: "The Flip", prompts: [ { label: "My stressful thought:", lines: 2 }, { label: "The performance reframe:", lines: 2 } ] } ] }
  },
  {
    id: "m_cs_3", title: "The Brain Dump", themeShort: ["Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Individual"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Use cognitive offloading to reduce mental clutter and acute stress.", materials: ["Blank paper"],
    phases: [
      { time: "0–5 min", phase: "Cognitive Load", steps: [ { type: "say", text: "Your brain is for processing, not for storing. When you try to remember everything you have to do, you get stressed." } ] },
      { time: "5–15 min", phase: "The Dump", steps: [ { type: "do", text: "Give students 5 minutes to write down literally everything in their head. Homework, chores, texts to send, worries. Do not organize it, just dump it." } ] },
      { time: "15–25 min", phase: "The Sort", steps: [ { type: "say", text: "Now, highlight the top 3 things you MUST do today. Cross out 3 things that do not actually matter." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Does your head feel lighter?" } ] }
    ],
    debrief: [ { q: "Why does writing things down make them feel less scary?", note: "It turns an abstract fear into a concrete list." } ],
    watchOutFor: [ "Students getting more stressed by seeing the list. Reassure them that seeing it is the first step to conquering it." ],
    variations: [ { tag: "Exam Prep", text: "Do a brain dump of all exam topics, then sort by difficulty." } ],
    worksheet: { title: "The Brain Dump", intro: "Empty your mind.", sections: [ { title: "The List", prompts: [ { label: "My Top 3 Must-Dos today:", lines: 3 } ] } ] }
  },
  {
    id: "m_cs_4", title: "Box Breathing Practice", themeShort: ["Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "25 min", formats: ["Full class practice"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Master a tactical breathing technique used by first responders to immediately lower heart rate.", materials: ["A visual timer or metronome on screen"],
    phases: [
      { time: "0–5 min", phase: "The Tactic", steps: [ { type: "say", text: "Box breathing is used by Navy SEALs and paramedics to stop panic. It forces your autonomic nervous system to reset." } ] },
      { time: "5–15 min", phase: "The Practice", steps: [ { type: "do", text: "Guide them: Breathe in for 4 seconds, hold for 4, exhale for 4, hold empty for 4. Repeat for 3 minutes." } ] },
      { time: "15–25 min", phase: "Debrief", steps: [ { type: "say", text: "Notice the shift in the room's energy. You controlled that." } ] }
    ],
    debrief: [ { q: "Which part of the 'box' was hardest—the inhale, exhale, or the holds?", note: "Holding empty is usually the most challenging and requires the most focus." } ],
    watchOutFor: [ "Students holding their breath too hard and getting dizzy. Tell them to keep it gentle." ],
    variations: [ { tag: "Quick Reset", text: "Do this for exactly 60 seconds before any high-stakes moment." } ],
    worksheet: { title: "Box Breathing", intro: "Tactical calm.", sections: [ { title: "My Toolkit", prompts: [ { label: "When will I use this technique?", lines: 2 } ] } ] }
  },
  {
    id: "m_cs_5", title: "The Gratitude Jar", themeShort: ["Coping with stress", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual", "Full class"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Implement a daily gratitude practice to shift the brain from a deficit focus to an abundance focus, reducing chronic stress.", materials: ["Slips of paper", "A class jar or box"],
    phases: [
      { time: "0–10 min", phase: "The Negativity Bias", steps: [ { type: "say", text: "Our brains are velcro for negative experiences and Teflon for positive ones. We hold onto the bad stuff to survive. But gratitude forces the brain to see the good." } ] },
      { time: "10–20 min", phase: "The Practice", steps: [ { type: "do", text: "Students write down 3 hyper-specific things they are grateful for today on slips of paper. Not 'my family', but 'the way my mom made my tea this morning'." } ] },
      { time: "20–30 min", phase: "Sharing", steps: [ { type: "say", text: "Read some anonymous examples from the jar to the class to change the mood." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the feeling of abundance." } ] }
    ],
    debrief: [ { q: "Why is a specific gratitude better than a general one?", note: "It forces actual memory recall rather than a cliche." } ],
    watchOutFor: [ "Toxic positivity. Do not tell a student in crisis to 'just be grateful'." ],
    variations: [ { tag: "Daily Habit", text: "Do this for 3 minutes at the start of homeroom every day." } ],
    worksheet: { title: "Specific Gratitude", intro: "Rewire your brain.", sections: [ { title: "Today's List", prompts: [ { label: "One very specific good thing that happened today:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 10: Coping with Emotions ──
  {
    id: "m_ce_1", title: "The Pressure Bottle", themeShort: ["Coping with emotions", "Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Demonstration", "Individual"], color: "#C0392B", colorPale: "#FADBD8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Map your personal stress cycle and release valves to prevent emotional explosions.", materials: ["One plastic bottle with cap (shaken up)", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Demo", steps: [ { type: "say", text: "If we open a shaken bottle suddenly, it explodes. We need a slow release." } ] },
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Map Warning Signs and Release Valves on the worksheet." } ] },
      { time: "25–35 min", phase: "Pair Share", steps: [ { type: "say", text: "Share ONE warning sign so your partner can look out for you." } ] }
    ],
    debrief: [ { q: "Which part of your bottle was hardest to identify?", note: "Usually release valves." } ],
    watchOutFor: [ "A student whose explosion pattern involves self-harm. Follow up privately." ],
    variations: [ { tag: "Grade 8", text: "Focus on physical release valves only." } ],
    worksheet: { title: "My Pressure Bottle", intro: "Map your own stress cycle.", sections: [ { title: "My Release Valves", prompts: [ { label: "Things that help me release pressure BEFORE explosion:", lines: 3 } ] } ] }
  },
  {
    id: "m_ce_2", title: "Name It to Tame It", themeShort: ["Coping with emotions", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Pairs"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Use precise emotional vocabulary to down-regulate the amygdala during highly emotional moments.", materials: ["Emotion Wheel handouts"],
    phases: [
      { time: "0–10 min", phase: "Neuroscience", steps: [ { type: "say", text: "Putting a precise name to an emotion turns down the alarm center in the brain." } ] },
      { time: "10–20 min", phase: "The Wheel", steps: [ { type: "do", text: "Use the Emotion Wheel to trace 'Angry' to 'Betrayed' or 'Disrespected'." } ] },
      { time: "20–30 min", phase: "Practice", steps: [ { type: "do", text: "Read scenarios and find the hyper-specific emotion word for them." } ] }
    ],
    debrief: [ { q: "Did finding the exact word make you feel more in control?", note: "Shifts brain to prefrontal cortex." } ],
    watchOutFor: [ "Students feeling overwhelmed by the number of words on the wheel." ],
    variations: [ { tag: "Journaling", text: "Have them write a paragraph using 3 specific wheel words." } ],
    worksheet: { title: "Name It To Tame It", intro: "Precision brings calm.", sections: [ { title: "My Vocabulary", prompts: [ { label: "Instead of 'Mad', I am actually feeling:", lines: 1 } ] } ] }
  }
];
  // ──────────────────────── SENIOR SECONDARY (Grade 11-12) ────────────────────────
  // ============================================================================
  // 20 NEW SENIOR SECONDARY ACTIVITIES (WHO Life Skills)
  // ============================================================================

  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "s_sa_1", title: "The Future Self Letter", themeShort: ["Self-awareness", "Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Engage in temporal distancing by writing a letter from future self to present self to reduce immediate academic anxiety.", materials: ["Lined paper", "Envelopes"],
    phases: [
      { time: "0–10 min", phase: "Temporal Distancing", steps: [ { type: "say", text: "Think back to a massive stress you had in 8th grade. Does it matter now? Probably not. Zooming out changes the weight of a problem." } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "say", text: "Imagine you are 25. You survived the boards and college. Write a letter back to your 17-year-old self giving them advice and reassurance." } ] },
      { time: "25–35 min", phase: "Sealing", steps: [ { type: "do", text: "Seal the letters. Have students write 'Open on the day before final exams' on the front." } ] }
    ],
    debrief: [ { q: "What was the most compassionate thing your future self told you?", note: "Self-compassion is a key clinical stress reducer." } ],
    worksheet: { title: "Letter from the Future", intro: "Advice from your 25-year-old self.", sections: [ { title: "The Letter", prompts: [ { label: "Dear 17-year-old me, here is what you need to know:", lines: 6 } ] } ] }
  },
  {
    id: "s_sa_2", title: "The Ikigai Map", themeShort: ["Self-awareness", "Decision making"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Individual"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Map the intersection of passion, skill, societal need, and livelihood to clarify post-school direction.", materials: ["Ikigai Diagram worksheets"],
    phases: [
      { time: "0–10 min", phase: "The Concept", steps: [ { type: "say", text: "Ikigai is the intersection of: What you love, what you are good at, what the world needs, and what you can be paid for." } ] },
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Students fill out the 4 circles. It is okay if the center (the Ikigai) is blank for now." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "say", text: "Are you aiming for a career path that misses one of these circles entirely? Which one?" } ] }
    ],
    debrief: [ { q: "Which circle was the hardest to fill out?", note: "Usually 'What the world needs' for this age group." } ],
    worksheet: { title: "My Ikigai", intro: "Find your intersection.", sections: [ { title: "The 4 Circles", prompts: [ { label: "What I am good at:", lines: 1 }, { label: "What the world needs:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "s_em_1", title: "The Perspective Flip", themeShort: ["Empathy", "Effective communication"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Force deep perspective-taking by making students argue a controversial position they personally oppose.", materials: ["Controversial prompts"],
    phases: [
      { time: "0–10 min", phase: "Assignment", steps: [ { type: "say", text: "Pick a topic you feel strongly about. You must argue the OPPOSITE side with total sincerity." } ] },
      { time: "10–25 min", phase: "The Debate", steps: [ { type: "do", text: "Pairs debate. You only 'win' if you can make the other person say: 'Yes, that is a logical point.'" } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "say", text: "Did your own view soften after finding logic in the 'enemy' argument?" } ] }
    ],
    debrief: [ { q: "Did you find any logic in the opposing side?", note: "Breaks black-and-white thinking styles." } ],
    worksheet: { title: "The Flip", intro: "Argue the other side.", sections: [ { title: "Reflection", prompts: [ { label: "The strongest point the other side actually has:", lines: 2 } ] } ] }
  },
  {
    id: "s_em_2", title: "Active Listening Triad", themeShort: ["Empathy", "Interpersonal relationships"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Trios"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice completely silent, non-interruptive active listening.", materials: ["None"],
    phases: [
      { time: "0–5 min", phase: "The Rule", steps: [ { type: "say", text: "We usually listen to reply, not to understand. Today, you are forbidden from replying." } ] },
      { time: "5–20 min", phase: "The Triad", steps: [ { type: "do", text: "Speaker talks for 3 minutes. Listener is silent. Observer watches for non-verbal cues." } ] },
      { time: "20–35 min", phase: "Debrief", steps: [ { type: "say", text: "Speaker: How did it feel to not be interrupted for three whole minutes?" } ] }
    ],
    debrief: [ { q: "Why do we feel the need to jump in with advice so quickly?", note: "It is often about the listener's comfort, not the speaker's needs." } ],
    worksheet: { title: "Silence and Support", intro: "Practice the pause.", sections: [ { title: "Observation", prompts: [ { label: "What I noticed when I had to stay silent:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "s_ct_1", title: "The Online Footprint Trial", themeShort: ["Critical thinking", "Decision making"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Mock trial"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Experience how digital content persists and is reinterpreted by future stakeholders.", materials: ["Role cards", "Evidence Packet"],
    phases: [
      { time: "0–10 min", phase: "Setup", steps: [ { type: "say", text: "A student's post from 3 years ago has resurfaced. You are the college admissions trial." } ] },
      { time: "10–25 min", phase: "The Trial", steps: [ { type: "do", text: "Prosecution and Defence argue. Jury decides if the post reflects current character." } ] },
      { time: "25–40 min", phase: "Real Talk", steps: [ { type: "say", text: "Admissions officers check socials. What are your personal standards for posting now?" } ] }
    ],
    debrief: [ { q: "Where is the line between intent and impact online?", note: "Intention does not matter if the impact is harmful." } ],
    worksheet: { title: "Digital Standards", intro: "Curate your future.", sections: [ { title: "My Rules", prompts: [ { label: "My 3 rules for posting online:", lines: 3 } ] } ] }
  },
  {
    id: "s_ct_2", title: "The Logical Fallacy Hunt", themeShort: ["Critical thinking"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Identify Ad Hominem, Straw Man, and Slippery Slope fallacies in media.", materials: ["Fallacy cheat sheet", "Articles"],
    phases: [
      { time: "0–10 min", phase: "The Fallacies", steps: [ { type: "do", text: "Explain the 3 main fallacies with real-world examples." } ] },
      { time: "10–25 min", phase: "The Hunt", steps: [ { type: "do", text: "Pairs read articles and highlight the logical errors." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "say", text: "How can you use these to win an argument fairly?" } ] }
    ],
    debrief: [ { q: "Why are Straw Man arguments so common in online debates?", note: "Easier to defeat a fake argument than a complex real one." } ],
    worksheet: { title: "Fallacy Hunt", intro: "Spot the error.", sections: [ { title: "Findings", prompts: [ { label: "The clearest fallacy I found was:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 4: Creative Thinking ──
  {
    id: "s_crt_1", title: "The Worst Idea First", themeShort: ["Creative thinking", "Problem solving"], grade: "11–12", gradeKey: "upper", duration: "30 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Lower the barrier to entry for brainstorming by reverse-engineering terrible ideas.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "Anti-Brainstorm", steps: [ { type: "say", text: "Give me the absolute WORST, most disastrous ideas to solve the school's parking problem." } ] },
      { time: "10–20 min", phase: "The Flip", steps: [ { type: "say", text: "Now, how could we tweak that terrible idea to make it actually work brilliantly?" } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss why bad ideas unlock the brain's creative 'safe' mode." } ] }
    ],
    debrief: [ { q: "Why was it easier to come up with bad ideas?", note: "Zero fear of judgment allows for divergent thinking." } ],
    worksheet: { title: "The Flip", intro: "Bad ideas are bridges.", sections: [ { title: "Reverse Engineering", prompts: [ { label: "The terrible idea:", lines: 1 }, { label: "The flipped, brilliant version:", lines: 2 } ] } ] }
  },
  {
    id: "s_crt_2", title: "Paradigm Shift", themeShort: ["Creative thinking"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Solve a problem by explicitly changing the underlying assumptions.", materials: ["Scenario cards"],
    phases: [
      { time: "0–10 min", phase: "Assumption Check", steps: [ { type: "say", text: "If you assume school must happen in a building, you design one way. If you drop that, you design another." } ] },
      { time: "10–25 min", phase: "The Shift", steps: [ { type: "do", text: "Give a problem: 'Improve student attendance'. Group 1 must assume school has no set hours. Group 2 assumes school is a game." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "What 'rules' of life are just assumptions?" } ] }
    ],
    debrief: [ { q: "What is one rule in your life you've never questioned until today?", note: "Encourages challenging the status quo." } ],
    worksheet: { title: "Assumption Check", intro: "Drop the rules.", sections: [ { title: "Reflection", prompts: [ { label: "One assumption I make about my future career:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "s_dm_1", title: "The Ethical Dilemma", themeShort: ["Decision making", "Critical thinking"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Small groups", "Debate"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Analyze a complex moral scenario, separate emotion from logic.", materials: ["Dilemma Case Studies"],
    phases: [
      { time: "0–10 min", phase: "The Scenario", steps: [ { type: "do", text: "Read a dilemma where a friend cheats to keep a scholarship. No easy answer." } ] },
      { time: "10–25 min", phase: "Deliberation", steps: [ { type: "say", text: "Your group must reach a consensus. No one can stay neutral." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "do", text: "Groups present their logic. Discuss easy vs right." } ] }
    ],
    debrief: [ { q: "What argument almost changed your mind?", note: "Builds respect for nuance." } ],
    worksheet: { title: "Moral Logic", intro: "Break down the hard choices.", sections: [ { title: "Analysis", prompts: [ { label: "My final decision and why:", lines: 3 } ] } ] }
  },
  {
    id: "s_dm_2", title: "Regret Minimization", themeShort: ["Decision making"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Make a high-stakes choice by projecting forward to age 80.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Projecting Forward", steps: [ { type: "say", text: "At 80, will you regret NOT trying this? Or will you regret that you did?" } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "do", text: "Students pick a current choice (e.g., college path) and write the 80-year-old perspective." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "We regret the things we did NOT try more than the things we failed at." } ] }
    ],
    debrief: [ { q: "Did this shift your leaning toward the braver choice?", note: "Reduces fear of short-term failure." } ],
    worksheet: { title: "The 80-Year-Old Check", intro: "Look back from the future.", sections: [ { title: "The Choice", prompts: [ { label: "At 80, I will be most proud that I chose to:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 6: Problem Solving ──
  {
    id: "s_ps_1", title: "Root Cause Analysis (5 Whys)", themeShort: ["Problem solving"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Apply a business framework to find the root cause of a personal failure.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Logic", steps: [ { type: "say", text: "Asking Why 5 times finds the bad motor, not just the broken belt." } ] },
      { time: "10–25 min", phase: "Deep Dive", steps: [ { type: "do", text: "Pairs take an academic problem. Ask Why 5 times down to the emotional root." } ] },
      { time: "25–35 min", phase: "The Fix", steps: [ { type: "do", text: "Design a solution for the actual root." } ] }
    ],
    debrief: [ { q: "How painful was it to reach the 5th Why?", note: "Usually hits a vulnerable truth." } ],
    worksheet: { title: "Root Cause", intro: "Dig deep.", sections: [ { title: "The 5 Whys", prompts: [ { label: "The Root Cause I found:", lines: 2 } ] } ] }
  },
  {
    id: "s_ps_2", title: "The Pre-Mortem", themeShort: ["Problem solving", "Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Anticipate failure before it happens to build robust contingency plans.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Assume Failure", steps: [ { type: "say", text: "Assume it is May. You failed your goal completely. Write down exactly what went wrong." } ] },
      { time: "10–25 min", phase: "Safety Nets", steps: [ { type: "do", text: "Now build plans to stop those specific failures from happening today." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Does having a plan reduce the fear of failing?" } ] }
    ],
    debrief: [ { q: "Did visualizing failure make you more or less stressed?", note: "Usually less, because uncertainty is removed." } ],
    worksheet: { title: "The Pre-Mortem", intro: "Predict the failure to prevent it.", sections: [ { title: "Fixes", prompts: [ { label: "The safety net I am building today:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 7: Effective Communication ──
  {
    id: "s_ec_1", title: "The Blind Architect", themeShort: ["Effective communication"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Teams"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Experience information asymmetry and practice leadership communication.", materials: ["Building materials", "Screens"],
    phases: [
      { time: "0–15 min", phase: "Directive", steps: [ { type: "say", text: "Round 1: Architect TELLS builders exactly what to do. No questions." } ] },
      { time: "15–30 min", phase: "Facilitative", steps: [ { type: "say", text: "Round 2: Architect INVITES ideas. 'What do you think goes next?'" } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "do", text: "Compare results and team energy between rounds." } ] }
    ],
    debrief: [ { q: "Which style produced a BETTER result?", note: "Answers vary. Both have a place." } ],
    worksheet: { title: "Leadership Style", intro: "Check your default.", sections: [ { title: "My Style", prompts: [ { label: "My default leadership style is:", lines: 1 } ] } ] }
  },
  {
    id: "s_ec_2", title: "STATE Difficult Conversations", themeShort: ["Effective communication"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Use the STATE framework to handle high-emotion confrontations.", materials: ["STATE cheat sheet"],
    phases: [
      { time: "0–10 min", phase: "Facts vs Story", steps: [ { type: "say", text: "Share facts. Tell your story. Ask for their path. Talk tentatively. Encourage testing." } ] },
      { time: "10–25 min", phase: "Scripting", steps: [ { type: "do", text: "Pairs draft a script for confronting a friend who lied." } ] },
      { time: "25–40 min", phase: "Role-Play", steps: [ { type: "do", text: "Deliver scripts. Partner responds defensively. Practice staying calm." } ] }
    ],
    debrief: [ { q: "Why is it hard to stay on the facts?", note: "Brains assign motive instantly." } ],
    worksheet: { title: "STATE Framework", intro: "Facts first.", sections: [ { title: "The Script", prompts: [ { label: "The Facts (What a camera saw):", lines: 2 } ] } ] }
  },

  // ── WHO Skill 8: Interpersonal Relationships ──
  {
    id: "s_ir_1", title: "Attachment Styles", themeShort: ["Interpersonal relationships"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Individual"], color: "#E67E22", colorPale: "#FDEDEC", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Understand relational triggers based on basic attachment theory.", materials: ["Profile sheets"],
    phases: [
      { time: "0–15 min", phase: "Theory", steps: [ { type: "say", text: "Under stress, some people cling (Anxious), some run (Avoidant). Secure types communicate." } ] },
      { time: "15–30 min", phase: "Diagnosis", steps: [ { type: "do", text: "Students circle traits they identify with in the profiles." } ] },
      { time: "30–40 min", phase: "The Fix", steps: [ { type: "say", text: "If you run, practice staying. If you cling, practice self-soothing." } ] }
    ],
    debrief: [ { q: "Does knowing this make you more empathetic to a friend?", note: "Builds immense relational empathy." } ],
    worksheet: { title: "Relational Style", intro: "Stress in relationships.", sections: [ { title: "Awareness", prompts: [ { label: "Under stress, my instinct is to:", lines: 2 } ] } ] }
  },
  {
    id: "s_ir_2", title: "Boundaries 101", themeShort: ["Interpersonal relationships"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Pairs"], color: "#E67E22", colorPale: "#FDEDEC", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Articulate healthy boundaries in high school dating and friendships.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Fences", steps: [ { type: "say", text: "Porous = no fence. Rigid = wall. Healthy = gate you control." } ] },
      { time: "10–25 min", phase: "Scenarios", steps: [ { type: "do", text: "Write the Porous, Rigid, and Healthy response to: 'Partner demands phone password'." } ] },
      { time: "25–35 min", phase: "Role-Play", steps: [ { type: "do", text: "Practice delivering the Healthy boundary verbally." } ] }
    ],
    debrief: [ { q: "Why is 'no' a complete sentence?", note: "You don't always owe an explanation." } ],
    worksheet: { title: "Boundaries", intro: "Build the gate.", sections: [ { title: "My Rules", prompts: [ { label: "One porous boundary I need to fix:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 9: Coping with Stress ──
  {
    id: "s_cs_1", title: "The Burnout Audit", themeShort: ["Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Identify symptoms of burnout versus acute stress.", materials: ["Audit worksheet"],
    phases: [
      { time: "0–10 min", phase: "Stress vs Burnout", steps: [ { type: "say", text: "Stress is caring too much. Burnout is not having enough energy to care at all." } ] },
      { time: "10–25 min", phase: "Ledger Mapping", steps: [ { type: "do", text: "Mark daily activities with '+' for energy gained, '-' for energy drained." } ] },
      { time: "25–35 min", phase: "Recovery", steps: [ { type: "say", text: "If negative, write in two non-negotiable '+' activities for this weekend." } ] }
    ],
    debrief: [ { q: "Is scrolling on your phone a + or - for energy?", note: "Usually a '-' in disguise." } ],
    worksheet: { title: "Energy Audit", intro: "Check your nervous system.", sections: [ { title: "Audit", prompts: [ { label: "My biggest energy drain (-):", lines: 1 } ] } ] }
  },
  {
    id: "s_cs_2", title: "The Stress Mindset", themeShort: ["Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Full class"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Shift from viewing stress as a threat to viewing it as a biological advantage.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Biology", steps: [ { type: "say", text: "Heart racing = oxygen for the brain. Reframe stress as preparation for challenge." } ] },
      { time: "10–20 min", phase: "The Flip", steps: [ { type: "do", text: "Flip 'I am stressed' to 'My body is preparing me to perform'." } ] },
      { time: "20–35 min", phase: "Application", steps: [ { type: "do", text: "Apply reframe to upcoming board exams." } ] }
    ],
    debrief: [ { q: "How does the story change the physical feeling?", note: "Shifts fear to focus." } ],
    worksheet: { title: "Mindset Flip", intro: "Use the adrenaline.", sections: [ { title: "Reframe", prompts: [ { label: "The performance reframe I will use:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 10: Coping with Emotions ──
  {
    id: "s_ce_1", title: "Cognitive Distortion Trap", themeShort: ["Coping with emotions"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Pairs"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Identify catastrophizing and all-or-nothing thinking.", materials: ["Distortion cheat sheets"],
    phases: [
      { time: "0–10 min", phase: "The Traps", steps: [ { type: "say", text: "Your brain lies. 'If I fail, my life is ruined' is Catastrophizing." } ] },
      { time: "10–25 min", phase: "Labeling", steps: [ { type: "do", text: "Pairs identify distortions in example statements." } ] },
      { time: "25–40 min", phase: "The Dispute", steps: [ { type: "say", text: "Write your most common negative thought. Label it. Write the factual dispute." } ] }
    ],
    debrief: [ { q: "Why is it powerful to just give the thought a label?", note: "Creates distance from the emotion." } ],
    worksheet: { title: "Catch the Lie", intro: "Fact-check your thoughts.", sections: [ { title: "Dispute", prompts: [ { label: "The factual truth to dispute my thought:", lines: 2 } ] } ] }
  },
  {
    id: "s_ce_2", title: "Radical Acceptance", themeShort: ["Coping with emotions"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice dropping suffering by accepting unchangeable reality.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Acceptance", steps: [ { type: "say", text: "Pain is inevitable. Suffering is optional. Acceptance stops the suffering." } ] },
      { time: "10–25 min", phase: "Turning Point", steps: [ { type: "do", text: "Write a disappointment. Write: 'It is what it is, and I accept this reality.'" } ] },
      { time: "25–35 min", phase: "Next Steps", steps: [ { type: "say", text: "What is your next constructive step now that you accept the past?" } ] }
    ],
    debrief: [ { q: "Does accepting reality mean giving up?", note: "No, it is the starting point for progress." } ],
    worksheet: { title: "Radical Acceptance", intro: "Accept the past to build the future.", sections: [ { title: "Step 1", prompts: [ { label: "My next constructive step:", lines: 2 } ] } ] }
  },
  {
    id: 'footprint',
    title: 'The Online Footprint Trial',
    themeShort: ['Critical thinking', 'Decision making'],
    grade: '11–12', gradeKey: 'upper',
    duration: '40 min',
    formats: ['Mock trial simulation', 'Full class'],
    color: '#2C3E50', colorPale: '#EAF0FB',
    objective: "Students will experience how digital content persists and affects futures.",
    materials: ["Role cards", "Evidence Packet", "Verdict slips"],
    phases: [
      {
        time: '0–5 min', phase: 'Setup',
        steps: [
          { type: 'say', text: "Today we are running a trial. A 14-year-old's post has resurfaced at age 17." },
          { type: 'do', text: "Distribute roles and evidence." },
        ]
      },
      {
        time: '5–20 min', phase: 'The Trial',
        steps: [
          { type: 'do', text: "Run the trial. Jury delivers verdict." },
        ]
      },
      {
        time: '20–30 min', phase: 'Real Discussion',
        steps: [
          { type: 'say', text: "Step out of role. What does this mean for how YOU operate online?" },
          { type: 'do', text: "Students complete Digital Standards worksheet." },
        ]
      },
      {
        time: '30–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "Was the trial fair?", note: "Listen for: 'It is not fair but it is reality'." },
    ],
    watchOutFor: [
      "Students taking arguments too personally.",
    ],
    variations: [
      { tag: 'Limited time', text: "Skip trial, just discuss the evidence." },
    ],
    worksheet: {
      title: 'My Digital Standards',
      intro: 'Set rules for your digital life.',
      sections: [
        {
          title: 'Three Digital Rules',
          prompts: [
            { label: '1.', lines: 1 },
            { label: '2.', lines: 1 },
          ]
        }
      ]
    }
  },
  {
    id: 'architect',
    title: 'The Blind Architect',
    themeShort: ['Effective communication', 'Interpersonal relationships'],
    grade: '11–12', gradeKey: 'upper',
    duration: '35 min',
    formats: ['Teams of 4–5', 'Observation pairs'],
    color: '#C8860A', colorPale: '#FFF8E8',
    objective: "Students will articulate the difference between directive and facilitative leadership.",
    materials: ["Pre-built structure", "Identical materials for teams", "Screen"],
    phases: [
      {
        time: '0–5 min', phase: 'Setup',
        steps: [
          { type: 'do', text: "Assign Architect and Builders in teams. Architect can see structure but cannot touch materials." },
        ]
      },
      {
        time: '5–15 min', phase: 'Directive Leadership',
        steps: [
          { type: 'say', text: "Round 1: Architect TELLS builders exactly what to do." },
          { type: 'do', text: "Run 10 mins. Compare results." },
        ]
      },
      {
        time: '15–25 min', phase: 'Facilitative Leadership',
        steps: [
          { type: 'say', text: "Round 2: Architect INVITES ideas with a new structure." },
          { type: 'do', text: "Run 8 mins. Compare results and team feeling." },
        ]
      },
      {
        time: '25–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Individual reflection, then class debrief." },
        ]
      },
    ],
    debrief: [
      { q: "Which leadership style produced a BETTER result?", note: "Answers vary. Both have a place." },
    ],
    watchOutFor: [
      "Architects giving up.",
    ],
    variations: [
      { tag: 'No materials', text: "Replace build with drawing a diagram from description." },
    ],
    worksheet: {
      title: 'Leadership Reflection',
      intro: 'Reflect on both rounds.',
      sections: [
        {
          title: 'Reflection',
          prompts: [
            { label: 'My default leadership style is:', lines: 1 },
          ]
        }
      ]
    }
  },
  {
    id: 'corevalues',
    title: 'The Core Values Audit',
    themeShort: ['Self-awareness', 'Decision making'],
    grade: '11–12', gradeKey: 'upper',
    duration: '40 min',
    formats: ['Individual', 'Pairs'],
    color: '#16A085', colorPale: '#D5F5F0',
    objective: "Students will narrow down a broad list of values to their top 3 core values, and use them to evaluate a recent difficult decision.",
    materials: ["List of 50 Values", "Worksheet"],
    phases: [
      {
        time: '0–10 min', phase: 'The 50 to 5 Challenge',
        steps: [
          { type: 'do', text: "Hand out the list of 50 values (e.g., Wealth, Family, Honesty, Freedom, Adventure, Security)." },
          { type: 'say', text: "Circle your top 10. Then cross out 5. You can only have 5." },
        ]
      },
      {
        time: '10–20 min', phase: 'The Final 3',
        steps: [
          { type: 'say', text: "Now cross out 2 more. You are left with your top 3 Core Values. These are the things that drive your biggest decisions." },
          { type: 'do', text: "Give them time to struggle with this. It should be hard." },
        ]
      },
      {
        time: '20–30 min', phase: 'Value Alignment',
        steps: [
          { type: 'say', text: "Think of a recent decision that felt wrong or stressful. Did it violate one of your top 3 values? Write it down." },
        ]
      },
      {
        time: '30–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss how knowing our values acts as a compass for life after school." },
        ]
      }
    ],
    debrief: [
      { q: "Was it hard to eliminate values like 'Success' or 'Wealth' to keep things like 'Family' or 'Integrity'?", note: "Forces them to define what success actually means to them." },
    ],
    watchOutFor: [
      "Students picking values they think sound 'good' to the teacher. Encourage brutal honesty."
    ],
    variations: [
      { tag: 'Grade 12', text: "Apply the top 3 values to their upcoming college or career choices." }
    ],
    worksheet: {
      title: 'My Core Values',
      intro: 'Your values are your compass.',
      sections: [
        {
          title: 'The Final 3',
          prompts: [
            { label: 'Value 1:', lines: 1 },
            { label: 'Value 2:', lines: 1 },
            { label: 'Value 3:', lines: 1 },
          ]
        },
        {
          title: 'Alignment Check',
          prompts: [
            { label: 'A recent decision that conflicted with my values:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'ethicaldilemma',
    title: 'The Ethical Dilemma',
    themeShort: ['Critical thinking', 'Decision making'],
    grade: '11–12', gradeKey: 'upper',
    duration: '40 min',
    formats: ['Small groups', 'Full class debate'],
    color: '#D35400', colorPale: '#FDEBD0',
    objective: "Students will analyze a complex moral scenario, separate emotion from logic, and articulate a defensible decision.",
    materials: ["Dilemma Case Studies"],
    phases: [
      {
        time: '0–10 min', phase: 'The Scenario',
        steps: [
          { type: 'do', text: "Read the dilemma: 'You discover your best friend cheated on the final exam to keep their scholarship. If you tell, they lose everything. If you do not, the grading curve penalizes honest students.'" },
        ]
      },
      {
        time: '10–25 min', phase: 'Group Deliberation',
        steps: [
          { type: 'say', text: "In your groups, you must reach a consensus. You cannot 'abstain'. You must decide what to do." },
          { type: 'do', text: "Groups debate." },
        ]
      },
      {
        time: '25–35 min', phase: 'The Justification',
        steps: [
          { type: 'do', text: "Each group presents their decision and the exact logic behind it." },
        ]
      },
      {
        time: '35–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss the difference between doing what is 'easy' and what is 'right'." },
        ]
      }
    ],
    debrief: [
      { q: "What was the most compelling argument that almost changed your mind?", note: "Builds respect for opposing viewpoints." },
    ],
    watchOutFor: [
      "Groups completely disregarding the rules of the dilemma to find a 'loophole'. Force them to make the hard choice."
    ],
    variations: [
      { tag: 'Grade 12', text: "Use workplace ethics scenarios instead of school-based ones." }
    ],
    worksheet: {
      title: 'Ethical Reasoning',
      intro: 'Break down the hard choices.',
      sections: [
        {
          title: 'The Analysis',
          prompts: [
            { label: 'Who gets hurt if I take Action A?', lines: 2 },
            { label: 'Who gets hurt if I take Action B?', lines: 2 },
            { label: 'My final decision and why:', lines: 3 },
          ]
        }
      ]
    }
  },
  {
    id: 'futureself',
    title: 'The Future Self Letter',
    themeShort: ['Coping with emotions', 'Self-awareness'],
    grade: '11–12', gradeKey: 'upper',
    duration: '35 min',
    formats: ['Individual reflection'],
    color: '#8E44AD', colorPale: '#F5EEF8',
    objective: "Students will engage in temporal distancing by writing a letter from their future self to their present self, reducing immediate academic anxiety.",
    materials: ["Lined paper", "Envelopes"],
    phases: [
      {
        time: '0–10 min', phase: 'Temporal Distancing',
        steps: [
          { type: 'say', text: "When we are stressed about exams or college, our brain thinks the danger is right now. But think back to a massive stress you had in 8th grade. Does it matter now?" },
        ]
      },
      {
        time: '10–25 min', phase: 'Writing the Letter',
        steps: [
          { type: 'say', text: "Imagine you are 25 years old. You survived the board exams, college admissions, and all the current drama. Write a letter back to your 17-year-old self giving them advice and reassurance." },
          { type: 'do', text: "Play calming music while they write." },
        ]
      },
      {
        time: '25–35 min', phase: 'Sealing the Letter',
        steps: [
          { type: 'do', text: "Have them seal it in an envelope and write 'Open on the day before board exams' on the front." },
        ]
      }
    ],
    debrief: [
      { q: "Did writing from the perspective of an older you make your current problems feel smaller?", note: "This technique is proven to reduce cortisol levels." },
    ],
    watchOutFor: [
      "Students writing joke letters. Encourage sincerity by keeping the environment extremely quiet and focused."
    ],
    variations: [
      { tag: 'End of Year', text: "Actually collect the envelopes and mail them to the students right before their final exams." }
    ],
    worksheet: {
      title: 'Letter from the Future',
      intro: 'Write to yourself from 10 years in the future.',
      sections: [
        {
          title: 'The Letter',
          prompts: [
            { label: 'Dear 17-year-old me, here is what you need to know:', lines: 6 },
          ]
        }
      ]
    }
  },
  {
    id: 'altuses',
    title: 'The Alternate Uses Test',
    themeShort: ['Creative thinking', 'Problem solving'],
    grade: '11–12', gradeKey: 'upper',
    duration: '30 min',
    formats: ['Small groups', 'Competition'],
    color: '#F1C40F', colorPale: '#FEF9E7',
    objective: "Students will practice divergent thinking to break functional fixedness and generate rapid, innovative ideas.",
    materials: ["A simple object (e.g., a paperclip, a brick, a hanger)", "Whiteboard"],
    phases: [
      {
        time: '0–5 min', phase: 'Functional Fixedness',
        steps: [
          { type: 'say', text: "Our brains are lazy. When we see a paperclip, we only think of it holding paper. That is functional fixedness. Today we break it." },
        ]
      },
      {
        time: '5–15 min', phase: 'The Sprint',
        steps: [
          { type: 'do', text: "Hold up the object (e.g., a brick). Give groups exactly 3 minutes to list as many non-traditional uses for a brick as possible." },
          { type: 'say', text: "Quantity over quality. Go!" },
        ]
      },
      {
        time: '15–25 min', phase: 'The Evaluation',
        steps: [
          { type: 'do', text: "Have groups share their lists. Award points for the most unique, viable ideas." },
        ]
      },
      {
        time: '25–30 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Connect this to solving life problems when resources are limited." },
        ]
      }
    ],
    debrief: [
      { q: "Why do we struggle to see new uses for common things?", note: "Habit and cognitive shortcuts." },
      { q: "How does this apply to career paths?", note: "A degree in one thing can be used for many unconventional careers." }
    ],
    watchOutFor: [
      "Students self-censoring during the sprint. Remind them that bad ideas lead to good ones."
    ],
    variations: [
      { tag: 'Grade 12', text: "Do it with a 'failed' exam or 'rejected' application — list alternate uses for that failure." }
    ],
    worksheet: {
      title: 'Divergent Thinking',
      intro: 'Break the rules of what things are supposed to be.',
      sections: [
        {
          title: 'The Sprint',
          prompts: [
            { label: 'List as many uses as possible:', lines: 6 },
          ]
        }
      ]
    }
  }
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function Step({ s }) {
  const labels = { say: 'Say', do: 'Do', tip: 'Tip', pause: 'Pause' };
  return (
    <div className={`lst-step ${s.type}`}>
      <span className="lst-step-label">{labels[s.type]}</span>
      <span className="lst-step-text">{s.text}</span>
    </div>
  );
}

function PrintStep({ s }) {
  const labels = { say: 'SAY', do: 'DO', tip: 'TIP', pause: 'PAUSE' };
  return (
    <div className={`lstp-step ${s.type}`}>
      <span className="lstp-step-lbl">{labels[s.type]}</span>
      <p>{s.text}</p>
    </div>
  );
}

// ─── PRINT VIEW (Facilitator Guide + Worksheet) ───────────────────────────────
function PrintView({ activity, mode, onClose }) {
  useEffect(() => { if (activity) setTimeout(() => window.print(), 400); }, [activity]);

  if (!activity) return null;

  if (mode === 'guide') return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>Facilitator Guide — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstp-header">
          <h1>{activity.title}</h1>
          <div className="lstp-header-meta">
            <span>{activity.themeShort.join(' & ')}</span>
            <span>Grade {activity.grade}</span>
            <span>{activity.duration}</span>
            <span>{activity.formats.join(' | ')}</span>
          </div>
        </div>

        <div className="lstp-section-h">Learning Objective</div>
        <div className="lstp-objective-box">{activity.objective}</div>

        <div className="lstp-section-h">Materials Needed</div>
        <div className="lstp-materials-list">
          {activity.materials.map((m, i) => <span key={i} className="lstp-material">{m}</span>)}
        </div>

        <div className="lstp-section-h">Facilitation Guide</div>
        {activity.phases.map((phase, pi) => (
          <div key={pi} className="lstp-phase-block">
            <div className="lstp-phase-title">
              <span className="lstp-phase-time">{phase.time}</span>
              <span className="lstp-phase-name">{phase.phase}</span>
            </div>
            {phase.steps.map((s, si) => <PrintStep key={si} s={s} />)}
          </div>
        ))}

        <div className="lstp-section-h">Debrief Questions</div>
        {activity.debrief.map((d, i) => (
          <div key={i} className="lstp-debrief-item">
            <div className="lstp-debrief-q">Q{i + 1}: {d.q}</div>
            <div className="lstp-debrief-note">Facilitator Note: {d.note}</div>
          </div>
        ))}

        <div className="lstp-section-h">Watch Out For</div>
        {activity.watchOutFor.map((w, i) => <div key={i} className="lstp-watch">{w}</div>)}

        <div className="lstp-section-h">Variations</div>
        {activity.variations.map((v, i) => (
          <div key={i} className="lstp-variation">
            <span className="lstp-var-tag">{v.tag}</span>
            <span>{v.text}</span>
          </div>
        ))}

        <div className="lstp-footer">
          SecretSharz Life Skills Resource Library · Grade {activity.grade} · Free to reproduce for educational use
        </div>
      </div>
    </div>
  );

  if (mode === 'worksheet') return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>Student Worksheet — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstw-header">
          <h1>{activity.worksheet.title}</h1>
          <p>Life Skills Worksheet · Grade {activity.grade} · {activity.themeShort.join(' & ')}</p>
        </div>
        <div className="lstw-name-row">
          <div className="lstw-name-field">Name: _____________________________</div>
          <div className="lstw-name-field">Class: __________</div>
          <div className="lstw-name-field">Date: __________</div>
        </div>
        <p style={{ fontSize: '13px', color: '#7A8A7D', marginBottom: '20px', fontStyle: 'italic' }}>{activity.worksheet.intro}</p>

        {activity.worksheet.sections.map((sec, si) => (
          <div key={si} className="lstw-section">
            <div className="lstw-section-title">{sec.title}</div>
            {sec.twoCol && (
              <div className="lstw-two-col">
                {sec.colTitles.map((ct, ci) => (
                  <div key={ci} className="lstw-col-box">
                    <div className="lstw-col-title">{ct}</div>
                    <div className="lstw-box" style={{ minHeight: '80px' }} />
                  </div>
                ))}
              </div>
            )}
            {sec.prompts.map((p, pi) => (
              <div key={pi} className="lstw-prompt-block" style={{ marginBottom: '12px' }}>
                {p.label && <div className="lstw-prompt">{p.label}</div>}
                {p.note && <div style={{ fontSize: '11px', color: '#7A8A7D', marginBottom: '4px', fontStyle: 'italic' }}>{p.note}</div>}
                {p.lines > 0 && Array.from({ length: p.lines }).map((_, li) => (
                  <div key={li} className="lstw-line" />
                ))}
                {p.lines === 0 && <div style={{ height: '10px' }} />}
              </div>
            ))}
          </div>
        ))}
        <div className="lstw-footer">
          SecretSharz Life Skills Resource Library
        </div>
      </div>
    </div>
  );

  return null;
}

// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
function ActivityCard({ activity, displayNumber, isExpanded, onToggle, onPrint }) {
  const [innerTab, setInnerTab] = useState('guide');

  const innerTabs = [
    { id: 'guide',    label: 'Facilitation Guide' },
    { id: 'debrief',  label: 'Debrief' },
    { id: 'watch',    label: 'Watch Out For' },
    { id: 'vars',     label: 'Variations' },
    { id: 'worksheet', label: 'Worksheet Preview' },
  ];

  return (
    <div className={`lst-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="lst-card-accent" style={{ background: `linear-gradient(90deg,${activity.color},${activity.color}88)` }} />

      <div className="lst-card-header" onClick={onToggle}>
        <div className="lst-card-num">{displayNumber}</div>
        <div className="lst-card-meta-block">
          <div className="lst-card-title">{activity.title}</div>
          <div className="lst-card-badges">
            {activity.themeShort.map(t => (
               <span key={t} className="lst-badge lst-badge-theme" style={{ background: `${activity.color}18`, color: activity.color }}>{t}</span>
            ))}
            <span className="lst-badge lst-badge-grade">Grade {activity.grade}</span>
            <span className="lst-badge lst-badge-time">{activity.duration}</span>
          </div>
          <div className="lst-card-obj">{activity.objective}</div>
        </div>
        
        {/* Print Buttons logic — Direct Links if provided, otherwise Overlay */}
        <div className="lst-card-print-btns no-print" onClick={e => e.stopPropagation()}>
          {activity.guidePdf ? (
            <a href={activity.guidePdf} download target="_blank" rel="noreferrer" className="lst-print-btn guide" style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
              Facilitator PDF
            </a>
          ) : (
            <button className="lst-print-btn guide" onClick={() => onPrint(activity, 'guide')}>
              Facilitator PDF
            </button>
          )}

          {activity.worksheetPdf ? (
            <a href={activity.worksheetPdf} download target="_blank" rel="noreferrer" className="lst-print-btn ws" style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
              Student Worksheet
            </a>
          ) : (
            <button className="lst-print-btn ws" onClick={() => onPrint(activity, 'worksheet')}>
              Student Worksheet
            </button>
          )}
        </div>
        
        <div className="lst-card-chevron">▶</div>
      </div>

      {isExpanded && (
        <div className="lst-card-body">

          {/* Picture rendering if the activity has one */}
          {activity.imagePath && (
             <div className="lst-image-wrapper">
               <img src={activity.imagePath} alt={activity.title} className="lst-content-img" />
             </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ls-muted)', marginBottom: '10px' }}>Materials</div>
            <div className="lst-materials">
              {activity.materials.map((m, i) => <span key={i} className="lst-material-tag">{m}</span>)}
            </div>
          </div>

          <div className="lst-inner-tabs">
            {innerTabs.map(t => (
              <button key={t.id} className={`lst-inner-tab ${innerTab === t.id ? 'active' : ''}`} onClick={() => setInnerTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {innerTab === 'guide' && (
            <div>
              {activity.phases.map((phase, pi) => (
                <div key={pi} className="lst-phase">
                  <div className="lst-phase-header">
                    <span className="lst-phase-time">{phase.time}</span>
                    <span className="lst-phase-name">{phase.phase}</span>
                  </div>
                  {phase.steps.map((s, si) => <Step key={si} s={s} />)}
                </div>
              ))}
            </div>
          )}

          {innerTab === 'debrief' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '16px', lineHeight: 1.6 }}>Use at least 3 of these questions. Start with the surface questions and work toward the deeper ones.</p>
              {activity.debrief.map((d, i) => (
                <div key={i} className="lst-debrief-item">
                  <div className="lst-debrief-q">Q{i + 1}: {d.q}</div>
                  <div className="lst-debrief-note">Facilitator Note: {d.note}</div>
                </div>
              ))}
            </div>
          )}

          {innerTab === 'watch' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '14px', lineHeight: 1.6 }}>These are common issues that arise with this activity.</p>
              {activity.watchOutFor.map((w, i) => <div key={i} className="lst-watch-item">{w}</div>)}
            </div>
          )}

          {innerTab === 'vars' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '14px', lineHeight: 1.6 }}>Adapt the activity to your specific group.</p>
              {activity.variations.map((v, i) => (
                <div key={i} className="lst-variation-item">
                  <span className="lst-variation-tag">{v.tag}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ls-ink-soft)' }}>{v.text}</span>
                </div>
              ))}
            </div>
          )}

          {innerTab === 'worksheet' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '16px', lineHeight: 1.6 }}>Preview of the student worksheet.</p>
              <div className="lst-ws-preview">
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 700, color: 'var(--ls-ink)', marginBottom: '4px' }}>{activity.worksheet.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--ls-muted)', fontStyle: 'italic', marginBottom: '20px' }}>{activity.worksheet.intro}</div>
                {activity.worksheet.sections.map((sec, si) => (
                  <div key={si} className="lst-ws-section">
                    <div className="lst-ws-section-title">{sec.title}</div>
                    {sec.twoCol && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        {sec.colTitles.map((ct, ci) => (
                          <div key={ci} style={{ background: 'rgba(30,40,32,.03)', borderRadius: '8px', padding: '10px 12px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ls-muted)', marginBottom: '6px' }}>{ct}</div>
                            <div className="lst-ws-box" style={{ minHeight: '50px' }} />
                          </div>
                        ))}
                      </div>
                    )}
                    {sec.prompts.map((p, pi) => (
                      <div key={pi} style={{ marginBottom: '10px' }}>
                        {p.label && <div className="lst-ws-prompt">{p.label}</div>}
                        {p.note && <div style={{ fontSize: '11px', color: 'var(--ls-muted)', marginBottom: '4px', fontStyle: 'italic' }}>{p.note}</div>}
                        {p.lines > 0 && Array.from({ length: Math.min(p.lines, 2) }).map((_, li) => <div key={li} className="lst-ws-lines" />)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const GRADE_TABS = [
  { key: 'lower',  label: 'Lower Secondary', sub: 'Grade 5–7' },
  { key: 'middle', label: 'Middle Secondary', sub: 'Grade 8–10' },
  { key: 'upper',  label: 'Senior Secondary', sub: 'Grade 11–12' },
];

export default function LifeSkillsTrainer({ navigate, onBack }) {
  const [activeTab,    setActiveTab]    = useState('lower');
  const [themeFilter,  setThemeFilter]  = useState('All');
  const [expandedId,   setExpandedId]   = useState(null);
  const [printData,    setPrintData]    = useState(null); 

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handlePrint = useCallback((activity, mode) => {
    setPrintData({ activity, mode });
  }, []);

  const closePrint = useCallback(() => {
    setPrintData(null);
  }, []);

  const handleToggle = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const filtered = ACTIVITIES.filter(a => {
    const matchTab   = a.gradeKey === activeTab;
    const matchTheme = themeFilter === 'All' || a.themeShort.includes(themeFilter);
    return matchTab && matchTheme;
  });

  const currentTabInfo = GRADE_TABS.find(t => t.key === activeTab);

  return (
    <>
      {printData && (
        <PrintView activity={printData.activity} mode={printData.mode} onClose={closePrint} />
      )}

      <div className="lst-page">
        <div className="lst-topbar">
          <button className="lst-back" onClick={onBack || (() => navigate && navigate('/resources'))}>← Back to Resources</button>
          <div className="lst-topbar-title">Life Skills Trainer — Activity Bank</div>
          <div className="lst-topbar-right">30 Activities · Grade 5–12</div>
        </div>

        <div className="lst-hero">
          <div className="lst-hero-blob lst-hero-blob-1" />
          <div className="lst-hero-blob lst-hero-blob-2" />
          <div className="lst-hero-inner">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className="lst-hero-eyebrow">School Counsellor Resource</div>
              <h1 className="lst-hero-h1">Life Skills Trainer<br /><em>Activity Bank</em></h1>
              <p className="lst-hero-sub">30 fully elaborated, classroom-ready life skills activities mapped to the WHO 10 Core Life Skills. Each includes a facilitation script, debrief guide, and printable student worksheet.</p>
              <div className="lst-hero-tags">
                <span className="lst-hero-tag">Print Facilitator Guide</span>
                <span className="lst-hero-tag">Print Student Worksheet</span>
                <span className="lst-hero-tag">Free to reproduce</span>
              </div>
            </div>
            <div className="lst-hero-right">
              <div className="lst-stat-card">
                <div className="lst-stat-num">30</div>
                <div className="lst-stat-label">Activities</div>
              </div>
              <div className="lst-stat-card">
                <div className="lst-stat-num">10</div>
                <div className="lst-stat-label">WHO Life Skills</div>
              </div>
              <div className="lst-stat-card">
                <div className="lst-stat-num">30–40</div>
                <div className="lst-stat-label">Minutes Per Session</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lst-tabs-wrap">
          <div className="lst-tabs">
            {GRADE_TABS.map(t => (
              <button key={t.key} className={`lst-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => { setActiveTab(t.key); setExpandedId(null); setThemeFilter('All'); }}>
                {t.label}
                <span className="lst-tab-sub">{t.sub} · {ACTIVITIES.filter(a => a.gradeKey === t.key).length} activities</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lst-filter-wrap">
          <div className="lst-filter-row">
            <span className="lst-filter-label">Filter by WHO Skill:</span>
            {ALL_THEMES.map(t => (
              <button key={t} className={`lst-chip ${themeFilter === t ? 'active' : ''}`} onClick={() => setThemeFilter(t)}>{t}</button>
            ))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--ls-muted)', fontWeight: 600 }}>
             Showing {filtered.length} activit{filtered.length !== 1 ? 'ies' : 'y'}
          </div>
        </div>

        <div className="lst-grid">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ls-muted)' }}>
              <p style={{ fontSize: '16px', fontWeight: 600 }}>No activities match this filter. Try another theme.</p>
            </div>
          ) : (
            filtered.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                displayNumber={index + 1}
                isExpanded={expandedId === activity.id}
                onToggle={() => handleToggle(activity.id)}
                onPrint={handlePrint}
              />
            ))
          )}

          <div style={{ background: 'linear-gradient(135deg,#1E2820,#2D3A24)', borderRadius: '18px', padding: '32px 36px', color: 'white', marginTop: '8px' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', marginBottom: '12px' }}>How to Use This Resource</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {[
                { n: '1', title: 'Choose your grade band', desc: 'Use the tabs above to find activities calibrated for the cognitive and social development of that age group.' },
                { n: '2', title: 'Read before class', desc: 'Open the activity card and review the full facilitation guide. The SAY prompts are anchors for the session.' },
                { n: '3', title: 'Print what you need', desc: 'Click "Facilitator PDF" for your session notes and "Student Worksheet" for handouts.' },
                { n: '4', title: 'Follow up', desc: 'Each activity ends with a commitment. Check in with students a week later to build continuity.' },
              ].map(item => (
                <div key={item.n} style={{ background: 'rgba(255,255,255,.06)', borderRadius: '12px', padding: '18px 20px' }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', color: '#FFCE6B', lineHeight: 1, marginBottom: '8px' }}>{item.n}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '5px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
