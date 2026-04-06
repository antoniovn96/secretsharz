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
  // 20 NEW LOWER SECONDARY ACTIVITIES (WHO Life Skills)
  // ============================================================================
  
  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "l_sa_1", title: "My Strengths Shield", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Individual art activity", "Pairs"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Students will identify their core character strengths and create a visual shield to build self-esteem.", materials: ["Blank shield templates", "Coloured markers", "List of strengths on the board"],
    phases: [
      { time: "0–10 min", phase: "What is a Strength?", steps: [ { type: "say", text: "Character strengths are who you ARE, not just what you DO." }, { type: "do", text: "Write examples: Kindness, Bravery, Humor, Curiosity." } ] },
      { time: "10–25 min", phase: "Designing the Shield", steps: [ { type: "do", text: "Hand out templates." }, { type: "say", text: "Draw your greatest strength, a strength others see, a time you used it, and one to grow." } ] },
      { time: "25–35 min", phase: "Shield Sharing", steps: [ { type: "do", text: "In pairs, share shields." }, { type: "say", text: "Partners, say: 'I can see that strength in you because...'" } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how strengths protect us." } ] }
    ],
    debrief: [ { q: "Was it hard to choose a strength for yourself?", note: "Normalise focusing on weaknesses." }, { q: "How can you use your strength this week?", note: "Connect abstract strengths to practical challenges." } ],
    watchOutFor: [ "Students who say they have no strengths. Offer gentle observations." ],
    variations: [ { tag: "Art-focused", text: "Provide magazines for a collage." } ],
    worksheet: { title: "My Strengths Shield", intro: "Design your personal crest.", sections: [ { title: "Shield Planning", prompts: [ { label: "My greatest strength is:", lines: 1 }, { label: "A strength others see in me:", lines: 1 }, { label: "A strength I want to grow:", lines: 1 } ] } ] }
  },
  {
    id: "l_sa_2", title: "The Mirror Game", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs", "Full class"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Recognize how physical posture reflects and influences internal emotional states.", materials: ["Open floor space"],
    phases: [
      { time: "0–15 min", phase: "The Setup", steps: [ { type: "do", text: "Pairs face each other and mirror physical movements silently." } ] },
      { time: "15–25 min", phase: "Emotional Mirror", steps: [ { type: "say", text: "Now mirror an emotion without words. Let the partner guess the emotion." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "What did you notice about your own face when mirroring anger?" } ] }
    ],
    debrief: [ { q: "How did your body feel mirroring a sad posture?", note: "Connecting physical to emotional." } ],
    watchOutFor: [ "Silly behavior. Remind them to be precise." ],
    variations: [ { tag: "Full class", text: "Have one leader mirror for the whole room." } ],
    worksheet: { title: "Body and Mind", intro: "Your body talks to your brain.", sections: [ { title: "Reflection", prompts: [ { label: "When I stand tall, my brain feels:", lines: 2 }, { label: "When I slump, my energy feels:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "l_em_1", title: "The Empathy Glasses", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice viewing a common school conflict from multiple perspectives to build empathy.", materials: ["Scenario cards", "Prop glasses (optional)"],
    phases: [
      { time: "0–10 min", phase: "The Concept", steps: [ { type: "say", text: "When we are upset, we only see through our own glasses. Empathy means borrowing someone else's glasses." } ] },
      { time: "10–25 min", phase: "Scenario Practice", steps: [ { type: "do", text: "Read a scenario: Two friends fight over a seat. Have groups explain what Friend A sees, then what Friend B sees." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Are both people right in their own minds?" } ] }
    ],
    debrief: [ { q: "Is it possible for two people to have totally different views of the same event?", note: "Yes. Perception is reality to them." } ],
    watchOutFor: [ "Students refusing to see the 'wrong' person's side." ],
    variations: [ { tag: "Acting", text: "Have them act out the two perspectives." } ],
    worksheet: { title: "Borrowing Glasses", intro: "See it their way.", sections: [ { title: "Perspective Check", prompts: [ { label: "A time I disagreed with a friend:", lines: 2 }, { label: "How it looked through their glasses:", lines: 2 } ] } ] }
  },
  {
    id: "l_em_2", title: "The Kindness Boomerang", themeShort: ["Empathy", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Demonstrate how empathy creates a ripple effect in a community.", materials: ["A soft ball or yarn"],
    phases: [
      { time: "0–10 min", phase: "The Web", steps: [ { type: "do", text: "Stand in a circle." }, { type: "say", text: "Throw the ball to someone and share one kind thing they did, or one thing you appreciate about them." } ] },
      { time: "10–20 min", phase: "The Drop", steps: [ { type: "say", text: "Notice how we are all connected. What happens if one person drops the string?" }, { type: "do", text: "Have one person drop it to show the tension slacken." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how small actions impact everyone." } ] }
    ],
    debrief: [ { q: "How did it feel to receive a compliment?", note: "Validates positive reinforcement." }, { q: "How does one negative action affect the whole group?", note: "Connect to the dropped string." } ],
    watchOutFor: [ "Ensure every student receives the ball at least once." ],
    variations: [ { tag: "Grade 5", text: "Use pre-written compliment cards if they are shy." } ],
    worksheet: { title: "The Kindness Boomerang", intro: "Reflect on connection.", sections: [ { title: "My Impact", prompts: [ { label: "One kind thing someone did for me:", lines: 2 }, { label: "One kind thing I can do tomorrow:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "l_ct_1", title: "Fact vs. Fiction Relay", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Teams"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Rapidly distinguish between verifiable facts and subjective opinions.", materials: ["Whiteboard", "Pre-written statements"],
    phases: [
      { time: "0–5 min", phase: "Definitions", steps: [ { type: "say", text: "A fact can be proven with evidence. An opinion is how someone feels about it." } ] },
      { time: "5–20 min", phase: "The Relay", steps: [ { type: "do", text: "Read a statement (e.g., 'Pizza is the best food' vs 'Pizza contains cheese'). Teams race to hold up a 'FACT' or 'OPINION' card." } ] },
      { time: "20–35 min", phase: "Tricky Ones", steps: [ { type: "do", text: "Introduce manipulative facts (e.g., '9 out of 10 people say...')." } ] }
    ],
    debrief: [ { q: "Why is it dangerous to mistake an opinion for a fact?", note: "It leads to spreading misinformation." } ],
    watchOutFor: [ "Statements that are controversial. Keep them light." ],
    variations: [ { tag: "Digital", text: "Use YouTube video titles." } ],
    worksheet: { title: "Fact or Opinion?", intro: "Test your brain.", sections: [ { title: "My Audit", prompts: [ { label: "Write a fact about your school:", lines: 1 }, { label: "Write an opinion about your school:", lines: 1 } ] } ] }
  },
  {
    id: "l_ct_2", title: "The 'Why' Chain", themeShort: ["Critical thinking", "Problem solving"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Ask 'why' repeatedly to find the root cause of a surface-level problem.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Toddler Strategy", steps: [ { type: "say", text: "Have you ever met a toddler who keeps asking 'why'? They are actually great problem solvers." }, { type: "do", text: "Model on the board: 'I got a bad grade.' Why? 'I didn't study.' Why? 'I was distracted.' Why? 'My phone was buzzing.'" } ] },
      { time: "10–20 min", phase: "Pair Practice", steps: [ { type: "do", text: "Give pairs a problem (e.g., 'I am always late to school'). One person asks 'Why?' 5 times." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Did asking why change the problem?" } ] }
    ],
    debrief: [ { q: "How does finding the root cause change the solution?", note: "From 'set an alarm' to 'plug phone in another room'." } ],
    watchOutFor: [ "Students getting annoyed by the 'why'. Tell them to treat it like a detective game." ],
    variations: [ { tag: "Grade 7", text: "Apply it to a school-wide issue like cafeteria crowding." } ],
    worksheet: { title: "The 5 Whys", intro: "Dig down to the root cause.", sections: [ { title: "My Chain", prompts: [ { label: "The Problem:", lines: 1 }, { label: "Why? 1:", lines: 1 }, { label: "Why? 2:", lines: 1 }, { label: "The Real Root Cause:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 4: Creative Thinking ──
  {
    id: "l_crt_1", title: "The Squiggle Challenge", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Overcome the fear of a blank page and practice rapid creative generation.", materials: ["Paper with random squiggles drawn on them", "Pens"],
    phases: [
      { time: "0–5 min", phase: "The Blank Page Fear", steps: [ { type: "say", text: "Perfectionism stops creativity. Today we are making art out of scribbles." } ] },
      { time: "5–15 min", phase: "The Transformation", steps: [ { type: "do", text: "Give students 3 minutes to turn a random squiggle on their page into a recognizable drawing (a bird, a car, a face)." } ] },
      { time: "15–25 min", phase: "Gallery", steps: [ { type: "do", text: "Share how the exact same squiggle became 30 different drawings." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Creativity is just connecting things that already exist." } ] }
    ],
    debrief: [ { q: "Was it easier to draw starting with a squiggle or a blank page?", note: "Constraints actually help creativity." } ],
    watchOutFor: [ "Students saying 'I can't draw'. Assure them stick figures are perfect." ],
    variations: [ { tag: "Pairs", text: "One person draws the squiggle, the other turns it into art." } ],
    worksheet: { title: "Squiggle Art", intro: "Turn mistakes into masterpieces.", sections: [ { title: "Reflection", prompts: [ { label: "How does this apply to making mistakes in life?", lines: 2 } ] } ] }
  },
  {
    id: "l_crt_2", title: "Brainstorming Bonanza", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Teach the core rule of brainstorming: separate idea generation from idea evaluation.", materials: ["Sticky notes", "Chart paper"],
    phases: [
      { time: "0–10 min", phase: "The Rule", steps: [ { type: "say", text: "The biggest killer of creativity is judging an idea too early. Today, every idea is a good idea." } ] },
      { time: "10–20 min", phase: "The Storm", steps: [ { type: "do", text: "Prompt: 'Design a new school uniform that solves 3 problems.' Students write one idea per sticky note for 5 minutes in silence." } ] },
      { time: "20–30 min", phase: "The Sort", steps: [ { type: "do", text: "Now they evaluate. Group the stickies by theme and pick the best one." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the relief of not being judged." } ] }
    ],
    debrief: [ { q: "Did waiting to judge make it easier to share?", note: "Usually yes, reduces fear of failure." } ],
    watchOutFor: [ "Students laughing at 'dumb' ideas. Intervene immediately to protect the rule." ],
    variations: [ { tag: "Fun twist", text: "Prompt: 'Invent a new school subject that doesn't exist yet.'" } ],
    worksheet: { title: "Brainstorming Rules", intro: "Separate generation from evaluation.", sections: [ { title: "My Best Idea", prompts: [ { label: "The wild idea I came up with:", lines: 2 }, { label: "How we could actually make it work:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "l_dm_1", title: "Stop, Think, Go", themeShort: ["Decision making"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class", "Role-play"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Implement a simple cognitive pause (traffic light model) to prevent impulsive decision-making.", materials: ["Red, Yellow, Green paper circles"],
    phases: [
      { time: "0–10 min", phase: "Traffic Light", steps: [ { type: "say", text: "Impulsive decisions happen when we go straight from feeling to acting. We need a traffic light." }, { type: "do", text: "Red = Stop and breathe. Yellow = Think of two options. Green = Choose the best one." } ] },
      { time: "10–20 min", phase: "Role-Play", steps: [ { type: "do", text: "Read a scenario: 'Someone bumps you and your books fall.' Hold up Red. 'What do you do?' (Breathe). Hold up Yellow. 'What are two options?' Hold up Green. 'Which do you choose?'" } ] },
      { time: "20–30 min", phase: "Practice", steps: [ { type: "do", text: "Run 3 more scenarios." } ] }
    ],
    debrief: [ { q: "Why is the Yellow step the most important?", note: "It creates the pause where logic catches up to emotion." } ],
    watchOutFor: [ "Students choosing aggressive 'Green' actions. Guide them back to the consequences." ],
    variations: [ { tag: "Active", text: "Have students physically take a step forward for each light." } ],
    worksheet: { title: "Stop, Think, Go", intro: "Slow down your choices.", sections: [ { title: "My Traffic Light", prompts: [ { label: "A time I acted impulsively:", lines: 2 }, { label: "What I should have thought at the Yellow light:", lines: 2 } ] } ] }
  },
  {
    id: "l_dm_2", title: "The Choice Scale", themeShort: ["Decision making", "Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs", "Full class"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Weigh the pros and cons of everyday decisions to understand that every choice has a trade-off.", materials: ["Whiteboard", "Worksheets"],
    phases: [
      { time: "0–10 min", phase: "The Scale", steps: [ { type: "say", text: "Every choice has a cost. If you choose to play games, the cost is your study time. If you study, the cost is your game time." } ] },
      { time: "10–25 min", phase: "Weighing It Out", steps: [ { type: "do", text: "Give a scenario: 'Staying up late to watch a movie.' Ask students to list 3 pros and 3 cons on their worksheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Does having more 'pros' automatically make it the right choice?" } ] }
    ],
    debrief: [ { q: "Can one big 'con' outweigh three small 'pros'?", note: "Yes. Weight matters more than numbers." } ],
    watchOutFor: [ "Students thinking 'fun' is always the right answer. Guide them to long-term impact." ],
    variations: [ { tag: "Physical", text: "Use a real balancing scale with blocks to represent pros/cons." } ],
    worksheet: { title: "The Choice Scale", intro: "Weigh it out.", sections: [ { title: "My Decision", prompts: [ { label: "The Choice:", lines: 1 }, { label: "The Biggest Pro:", lines: 1 }, { label: "The Biggest Con:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 6: Problem Solving ──
  {
    id: "l_ps_1", title: "The Human Knot", themeShort: ["Problem solving", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Physically collaborate to solve a complex spatial problem, identifying the importance of clear communication.", materials: ["Open space"],
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "do", text: "Divide into groups of 6-8." }, { type: "say", text: "Stand in a circle. Grab the hand of someone NOT next to you. Do the same with the other hand to a different person." } ] },
      { time: "5–20 min", phase: "Challenge", steps: [ { type: "say", text: "Untangle into a circle WITHOUT letting go." }, { type: "do", text: "Let them struggle. Do not intervene unless unsafe." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Let us talk about what just happened." } ] }
    ],
    debrief: [ { q: "Who stepped up as a leader? Did they boss or guide?", note: "Highlight facilitative leadership." } ],
    watchOutFor: [ "Physical safety. Ensure careful stepping over arms." ],
    variations: [ { tag: "Grade 7", text: "Run a second round in complete silence." } ],
    worksheet: { title: "Knot Reflection", intro: "Think about how your group handled the problem.", sections: [ { title: "Team Dynamics", prompts: [ { label: "When we got stuck, what helped most was:", lines: 2 }, { label: "One thing I did to help the team was:", lines: 2 } ] } ] }
  },
  {
    id: "l_ps_2", title: "Puzzle Solvers", themeShort: ["Problem solving", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Solve a puzzle with unequal information to highlight the necessity of pooling resources.", materials: ["A simple printed puzzle cut in half"],
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "say", text: "You have half the clues, your partner has the other half. You cannot show your paper." } ] },
      { time: "5–25 min", phase: "The Solve", steps: [ { type: "do", text: "Pairs talk it out to solve the logic grid." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "You could only win if you listened." } ] }
    ],
    debrief: [ { q: "What happens if one person dominates the conversation?", note: "You miss half the clues." } ],
    watchOutFor: [ "Students showing their papers. Enforce the verbal-only rule." ],
    variations: [ { tag: "Easy", text: "Use a simple riddle instead of a logic grid." } ],
    worksheet: { title: "Pooling Resources", intro: "We solve better together.", sections: [ { title: "Reflection", prompts: [ { label: "What was hard about not seeing the whole picture?", lines: 2 } ] } ] }
  },

  // ── WHO Skill 7: Effective Communication ──
  {
    id: "l_ec_1", title: "The 'I' Message Maker", themeShort: ["Effective communication"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Convert 'You' statements into 'I' statements to express feelings without causing defensiveness.", materials: ["Whiteboard", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "You vs I", steps: [ { type: "say", text: "When we are mad, we say: 'You always ignore me!' How does the other person react? They fight back." }, { type: "say", text: "An 'I' message works like this: I feel [emotion] when [behavior] happens." } ] },
      { time: "10–25 min", phase: "Translation", steps: [ { type: "do", text: "Translate 'You stole my seat!' into an 'I' message on your worksheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Why do 'I' messages feel less attacking?" } ] }
    ],
    debrief: [ { q: "Why is it harder to use 'I' messages?", note: "Requires vulnerability." } ],
    watchOutFor: [ "Fake 'I' messages: 'I feel that YOU are a jerk.' Correct this gently." ],
    variations: [ { tag: "Role-play", text: "Act out the 'You' vs 'I' versions." } ],
    worksheet: { title: "The I Message Maker", intro: "Change the way you complain.", sections: [ { title: "Translation", prompts: [ { label: "Translate: 'You never listen to me!'", lines: 2 } ] } ] }
  },
  {
    id: "l_ec_2", title: "Back-to-Back Drawing", themeShort: ["Effective communication"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Demonstrate the importance of clear, precise verbal instructions.", materials: ["Paper", "Pens", "Simple printed shapes"],
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "do", text: "Pairs sit back-to-back. One gets a drawing, the other gets blank paper." } ] },
      { time: "5–15 min", phase: "The Draw", steps: [ { type: "say", text: "Describe the drawing using ONLY geometric terms. 'Draw a triangle in the top left.' The drawer cannot speak." } ] },
      { time: "15–25 min", phase: "The Reveal", steps: [ { type: "do", text: "Compare the drawings. They will be vastly different." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Why is giving instructions so hard?" } ] }
    ],
    debrief: [ { q: "What happens when we assume someone knows what we mean?", note: "Miscommunication." } ],
    watchOutFor: [ "Peeking. Ensure they stay back-to-back." ],
    variations: [ { tag: "Two-way", text: "Let the drawer ask yes/no questions." } ],
    worksheet: { title: "Clear Communication", intro: "Words matter.", sections: [ { title: "Reflection", prompts: [ { label: "Why did the drawing come out wrong?", lines: 2 }, { label: "How does this apply to texting?", lines: 2 } ] } ] }
  },

  // ── WHO Skill 8: Interpersonal Relationships ──
  {
    id: "l_ir_1", title: "The Apology Anatomy", themeShort: ["Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Full class", "Pairs"], color: "#E67E22", colorPale: "#FDEDEC", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice the four steps of a genuine apology to repair relationships.", materials: ["Whiteboard", "Apology Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Fake Apology", steps: [ { type: "say", text: "Fake apologies sound like 'I am sorry you feel that way'. How do those make you feel?" } ] },
      { time: "10–20 min", phase: "Four Steps", steps: [ { type: "do", text: "Write: 1. I am sorry for... 2. It was wrong because... 3. Next time I will... 4. Will you forgive me?" } ] },
      { time: "20–30 min", phase: "Fix It", steps: [ { type: "do", text: "Rewrite fake apologies on the worksheet." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "say", text: "Which step is the hardest to say out loud?" } ] }
    ],
    debrief: [ { q: "Why do people give fake apologies?", note: "Pride, fear." } ],
    watchOutFor: [ "Students mocking each other. Keep it structured." ],
    variations: [ { tag: "Grade 5", text: "Focus heavily on Step 3 to make it actionable." } ],
    worksheet: { title: "The Apology Anatomy", intro: "Turn fake apologies into real ones.", sections: [ { title: "Fix It", prompts: [ { label: "Fake: 'I am sorry if you got mad.' Write the REAL apology:", lines: 4 } ] } ] }
  },
  {
    id: "l_ir_2", title: "Friendship Fences", themeShort: ["Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual", "Full class"], color: "#E67E22", colorPale: "#FDEDEC", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Define healthy vs unhealthy friendship behaviors and boundaries.", materials: ["Red and Green cards"],
    phases: [
      { time: "0–10 min", phase: "Red Flag/Green Flag", steps: [ { type: "do", text: "Hold up Green if healthy, Red if crossing a boundary." }, { type: "say", text: "They make fun of you but say it is a joke. Red or Green?" } ] },
      { time: "10–25 min", phase: "Defining Fences", steps: [ { type: "say", text: "A boundary is a fence. What are your friendship fences?" }, { type: "do", text: "Students write 3 dealbreakers on their sheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss enforcing boundaries." } ] }
    ],
    debrief: [ { q: "Is a 'joke' still a joke if it hurts your feelings?", note: "Impact matters more than intent." } ],
    watchOutFor: [ "Students pointing fingers at specific classmates." ],
    variations: [ { tag: "Active", text: "Have them physically move to sides of the room for red/green." } ],
    worksheet: { title: "My Friendship Fences", intro: "What is allowed in your yard?", sections: [ { title: "My Rules", prompts: [ { label: "I feel safe with a friend when they:", lines: 2 }, { label: "A dealbreaker for me is if a friend:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 9: Coping with Stress ──
  {
    id: "l_cs_1", title: "The Priority Jar", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Demonstration", "Individual"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Categorise tasks into Rocks, Pebbles, and Sand to understand prioritisation and reduce overwhelm.", materials: ["A clear jar, rocks, pebbles, sand (or drawn)", "Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Visual Demo", steps: [ { type: "say", text: "If we fill time with small stuff first, there is no room for big things." }, { type: "do", text: "Show how Rocks first makes everything fit." } ] },
      { time: "10–20 min", phase: "Defining Rocks", steps: [ { type: "say", text: "Rocks = non-negotiables. Sand = filler." } ] },
      { time: "20–30 min", phase: "Sorting", steps: [ { type: "do", text: "Students list tasks and sort them into the jars on paper." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the emotional impact of doing Rocks first." } ] }
    ],
    debrief: [ { q: "What happens when you put Sand in first?", note: "Panic, staying up late." } ],
    watchOutFor: [ "Students arguing that gaming is a Rock. Clarify priorities." ],
    variations: [ { tag: "No props", text: "Draw the jar on the board instead." } ],
    worksheet: { title: "The Priority Jar", intro: "Sort your time.", sections: [ { title: "My Jars", prompts: [ { label: "My Rocks (Must Do):", lines: 2 }, { label: "My Sand (Distractions):", lines: 2 } ] } ] }
  },
  {
    id: "l_cs_2", title: "The Worry Box", themeShort: ["Coping with stress"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Externalize anxieties by categorizing them as 'Actionable' or 'Let Go'.", materials: ["A physical cardboard box", "Small slips of paper"],
    phases: [
      { time: "0–10 min", phase: "Externalizing", steps: [ { type: "say", text: "When worries stay in our head, they grow. Write them down." }, { type: "do", text: "Write 3 worries on 3 slips of paper." } ] },
      { time: "10–20 min", phase: "Action vs Let Go", steps: [ { type: "say", text: "Put an 'A' for Action if you can fix it today. Put an 'L' for Let Go if you cannot control it." } ] },
      { time: "20–30 min", phase: "The Box", steps: [ { type: "do", text: "Physically put 'L' slips into a sealed Worry Box at the front." } ] }
    ],
    debrief: [ { q: "Did it feel different to put the paper in the box?", note: "Physical action helps mental release." } ],
    watchOutFor: [ "Students wanting to read others' slips. Keep it strictly private." ],
    variations: [ { tag: "Shredder", text: "Let them rip up the 'Let Go' slips." } ],
    worksheet: { title: "Action vs Let Go", intro: "Sort your worries.", sections: [ { title: "My List", prompts: [ { label: "One worry I can take Action on today:", lines: 2 }, { label: "One worry I need to Let Go of into the box:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 10: Coping with Emotions ──
  {
    id: "l_ce_1", title: "The Emotion Thermometer", themeShort: ["Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual", "Full class"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Map the intensity of emotions from 1 to 10 and identify coping strategies.", materials: ["Thermometer Worksheets", "Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "Mapping", steps: [ { type: "do", text: "Draw thermometer 1 to 10." }, { type: "say", text: "We feel 'annoyed' (2) or 'furious' (9)." } ] },
      { time: "10–25 min", phase: "Personalizing", steps: [ { type: "do", text: "Fill in warning signs for levels 3, 6, and 9." } ] },
      { time: "25–35 min", phase: "Cooling Down", steps: [ { type: "say", text: "Write one thing to cool down when you hit a 6." } ] }
    ],
    debrief: [ { q: "Why notice when you are at a 6?", note: "Easier to cool down before an explosion." } ],
    watchOutFor: [ "Students struggling to identify physical symptoms. Offer examples." ],
    variations: [ { tag: "Short session", text: "Focus only on anger." } ],
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
    id: 'iceberg',
    title: 'The Feelings Iceberg',
    themeShort: ['Self-awareness', 'Coping with emotions'],
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Individual', 'Pairs', 'Full class'],
    color: '#7C6FA0', colorPale: '#F0EDF8',
    imagePath: '/resources/lifeskills/thefeelingsiceberg/iceberg-diagram.jpg',
    guidePdf: '/resources/lifeskills/thefeelingsiceberg/THE FEELINGS ICEBERG_ Exploring Our Emotions (Grade 5–7).pdf',
    worksheetPdf: '/resources/lifeskills/thefeelingsiceberg/The Feelings Iceberg Worksheet.pdf',
    objective: "Students will distinguish between surface emotions and underlying feelings, and begin to map their own emotional landscape beneath the waterline.",
    materials: ["Whiteboard", "Iceberg worksheet", "Coloured pencils"],
    phases: [
      {
        time: '0–5 min', phase: 'Hook',
        steps: [
          { type: 'say', text: "Think about the last time you got really angry. What did the other person actually SEE?" },
          { type: 'do', text: "Write answers on the board: went quiet, shouted, slammed door." },
          { type: 'say', text: "Now here is my question — was anger the ONLY thing you were feeling? Or was something else going on underneath?" },
        ]
      },
      {
        time: '5–12 min', phase: 'Concept Introduction',
        steps: [
          { type: 'do', text: "Draw an iceberg on the board. Label the tip 'What people SEE' and below the line 'What is REALLY happening.'" },
          { type: 'say', text: "An iceberg has a tiny visible tip and a massive hidden section. Our emotions work exactly the same way." },
          { type: 'say', text: "What might be hiding under anger? Fear, embarrassment, loneliness, feeling unheard." },
        ]
      },
      {
        time: '12–22 min', phase: 'Individual Reflection',
        steps: [
          { type: 'do', text: "Distribute iceberg worksheets." },
          { type: 'say', text: "Think of one recent moment where you felt a strong emotion. Write what you SHOWED in the tip. Then go below the waterline and write what was ACTUALLY happening inside." },
        ]
      },
      {
        time: '22–30 min', phase: 'Pair Activity — Iceberg Guessing',
        steps: [
          { type: 'say', text: "Pair up. Share ONLY your above-waterline with your partner. Do not tell them what is below the line." },
          { type: 'say', text: "Your partner's job is to GUESS what might be below your waterline." },
        ]
      },
      {
        time: '30–35 min', phase: 'Full Class Debrief',
        steps: [
          { type: 'do', text: "Use the debrief questions below." },
        ]
      },
    ],
    debrief: [
      { q: "Was it easy or difficult to look below your waterline? What made it difficult?", note: "Listen for: 'I didn't know what the feeling was'. Validate this." },
      { q: "Has someone ever responded to just your tip and completely missed what was really going on?", note: "This is usually the question that creates the most resonance." },
    ],
    watchOutFor: [
      "A student who discloses something serious during the below waterline writing. Have your referral process ready.",
    ],
    variations: [
      { tag: 'Grade 5', text: "Use a provided emotion word bank rather than asking students to generate." },
    ],
    worksheet: {
      title: 'The Feelings Iceberg',
      intro: 'Our emotions are like icebergs — a small visible tip and a huge hidden part. Map your own.',
      sections: [
        {
          title: 'My Iceberg',
          prompts: [
            { label: 'The situation I am thinking of:', lines: 2 },
            { label: 'ABOVE THE WATERLINE — What people saw:', lines: 2 },
            { label: 'BELOW THE WATERLINE — What I was really feeling inside:', lines: 4 },
          ]
        },
      ]
    }
  },
  {
    id: 'telephone',
    title: 'The Telephone Breakdown',
    themeShort: ['Effective communication'],
    grade: '5–7', gradeKey: 'lower',
    duration: '30 min',
    formats: ['Full class game', 'Pairs'],
    color: '#5B9EBF', colorPale: '#EAF4FA',
    objective: "Students will experience how messages distort through communication chains and practise strategies for clearer communication.",
    materials: ["3 pre-written message cards", "Observation checklist"],
    phases: [
      {
        time: '0–5 min', phase: 'First Round (No Rules)',
        steps: [
          { type: 'do', text: "Ask 8 students to form a line. Give the first student Message Card 1. Tell them: 'Whisper this once only. No repeats.'" },
          { type: 'do', text: "Once the message reaches the end, ask the last student to say it aloud. Write it on the board." },
        ]
      },
      {
        time: '5–10 min', phase: 'Second Round (With Listening Rules)',
        steps: [
          { type: 'say', text: "Let us try again with Message Card 2 — but this time, we add three rules: 1. Ask ONE clarifying question. 2. Repeat back what you heard. 3. Flag if you are unsure." },
          { type: 'do', text: "Run the second round. Observe how the message changes." },
        ]
      },
      {
        time: '10–18 min', phase: 'Analysis',
        steps: [
          { type: 'say', text: "Let us figure out WHY messages change. What were people doing or NOT doing that caused the distortion?" },
        ]
      },
      {
        time: '18–26 min', phase: 'Pair Practice',
        steps: [
          { type: 'do', text: "Pair students. Student A reads a scenario card aloud once. Student B must: clarify, reflect back, then respond." },
        ]
      },
      {
        time: '26–30 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss real world applications of these rules." },
        ]
      },
    ],
    debrief: [
      { q: "Where exactly in the line did the message change most?", note: "Students usually identify a long complex part, or a gap filled with assumption." },
      { q: "Can you think of a real situation where this breakdown happened?", note: "Fights between friends over 'He said she said' are common examples." },
    ],
    watchOutFor: [
      "Students intentionally corrupting the message for laughs. Redirect warmly.",
    ],
    variations: [
      { tag: 'Grade 5', text: "Use very short, simple messages in Round 1." },
    ],
    worksheet: {
      title: 'The Telephone Breakdown',
      intro: 'Today we discovered how messages change as they travel.',
      sections: [
        {
          title: 'Observer Checklist',
          twoCol: true,
          colTitles: ['Round 1', 'Round 2'],
          prompts: [
            { label: 'Where did the message change most?', lines: 2 },
          ]
        },
        {
          title: 'My Commitment',
          prompts: [
            { label: 'One communication situation where a telephone breakdown has happened:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'persona',
    title: 'Walk a Mile — Persona Cards',
    themeShort: ['Empathy'],
    grade: '5–7', gradeKey: 'lower',
    duration: '40 min',
    formats: ['Individual reflection', 'Pairs'],
    color: '#E8845A', colorPale: '#FDF0EA',
    objective: "Students will practise inhabiting a perspective genuinely different from their own to build empathy.",
    materials: ["Persona Cards", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'Set Up',
        steps: [
          { type: 'say', text: "Today we are going to try to walk a mile in someone else's shoes. You will each get a persona. For 20 minutes, you are that person." },
          { type: 'do', text: "Distribute Persona Cards face down. Students flip on your signal." },
        ]
      },
      {
        time: '5–8 min', phase: 'In-Role Thinking',
        steps: [
          { type: 'do', text: "Students read their persona card silently." },
          { type: 'say', text: "Answer the questions on the worksheet AS that person. Not what YOU would do — what THEY would do." },
        ]
      },
      {
        time: '8–22 min', phase: 'Individual Reflection',
        steps: [
          { type: 'do', text: "Students answer the in-role questions on their worksheet." },
        ]
      },
      {
        time: '22–33 min', phase: 'Paired Conversation',
        steps: [
          { type: 'do', text: "Pair students whose personas are different from each other." },
          { type: 'say', text: "Have a 5-minute conversation in role. The topic: your school is planning a new policy. Tell each other what that policy should be." },
        ]
      },
      {
        time: '33–40 min', phase: 'Debrief',
        steps: [
          { type: 'say', text: "Come out of role now. Let us talk about what just happened." },
          { type: 'do', text: "Use the debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "What was the hardest part of staying in your persona's perspective?", note: "This is usually: 'I kept thinking what I would do'." },
      { q: "What did you discover about your persona that you would not have guessed just looking at them?", note: "Listen for the insight that internal experience is rich and complicated." },
    ],
    watchOutFor: [
      "A student who gets a persona very similar to their own difficult situation.",
    ],
    variations: [
      { tag: 'Short session', text: "Skip the paired conversation. Go from individual reflection to group debrief." },
    ],
    worksheet: {
      title: 'Persona Reflection',
      intro: 'Answer questions 1–2 IN ROLE. Answer questions 3–4 as yourself.',
      sections: [
        {
          title: 'In Role',
          prompts: [
            { label: '1. What does a typical school day feel like for you?', lines: 3 },
            { label: '2. What do you worry about most?', lines: 3 },
          ]
        },
        {
          title: 'As Yourself',
          prompts: [
            { label: '3. What surprised me most about my persona internal experience?', lines: 3 },
            { label: '4. One assumption I had before this activity that I want to question:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'rumour',
    title: 'The Rumour Filter',
    themeShort: ['Critical thinking', 'Empathy'],
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Small groups', 'Full class'],
    color: '#3498DB', colorPale: '#EBF5FB',
    objective: "Students will apply the THINK filter to gossip to understand the harm caused by spreading unverified information.",
    materials: ["Whiteboard", "THINK Filter handouts", "A tube of toothpaste"],
    phases: [
      {
        time: '0–10 min', phase: 'The Toothpaste Demo',
        steps: [
          { type: 'do', text: "Squeeze all the toothpaste onto a plate." },
          { type: 'say', text: "Can I have a volunteer put this toothpaste back in the tube? (They cannot)." },
          { type: 'say', text: "Rumours are exactly like this. Once the words are out, you can never take them back, and they leave a mess." },
        ]
      },
      {
        time: '10–20 min', phase: 'The THINK Filter',
        steps: [
          { type: 'do', text: "Write THINK on the board. T=True? H=Helpful? I=Inspiring? N=Necessary? K=Kind?" },
          { type: 'say', text: "Before you repeat something you heard, run it through this filter. If it fails, the rumour stops with you." },
        ]
      },
      {
        time: '20–30 min', phase: 'Group Scenarios',
        steps: [
          { type: 'do', text: "Give groups scenario cards with common school rumours." },
          { type: 'say', text: "Your group must decide: Does this pass the THINK filter? If not, what is the script you will use to stop the rumour?" },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss the difficulty of standing up to gossip in real life." },
        ]
      }
    ],
    debrief: [
      { q: "Why is it so tempting to pass on a rumour?", note: "Listen for: wanting to fit in, wanting attention." },
      { q: "What is a brave phrase you can use to stop a rumour?", note: "Examples: 'I do not really care about that', or 'Let us not talk about them when they aren't here.'" }
    ],
    watchOutFor: [
      "Students using real current school gossip during the exercise. Shut it down immediately."
    ],
    variations: [
      { tag: 'Grade 7', text: "Apply the THINK filter specifically to WhatsApp forwards and social media comments." }
    ],
    worksheet: {
      title: 'The Rumour Filter',
      intro: 'Before you speak or type, run it through the filter.',
      sections: [
        {
          title: 'The Filter',
          prompts: [
            { label: 'T - Is it True? (Do I have proof?)', lines: 1 },
            { label: 'H - Is it Helpful?', lines: 1 },
            { label: 'K - Is it Kind?', lines: 1 }
          ]
        },
        {
          title: 'My Script',
          prompts: [
            { label: 'When someone tries to tell me gossip, I will say:', lines: 2 }
          ]
        }
      ]
    }
  },
  {
    id: 'shield',
    title: 'My Strengths Shield',
    themeShort: ['Self-awareness'],
    grade: '5–7', gradeKey: 'lower',
    duration: '40 min',
    formats: ['Individual art activity', 'Pairs'],
    color: '#F1C40F', colorPale: '#FEF9E7',
    objective: "Students will identify their core character strengths and create a visual shield to build self-esteem and resilience.",
    materials: ["Blank shield templates", "Coloured markers/crayons", "List of character strengths on the board"],
    phases: [
      {
        time: '0–10 min', phase: 'What is a Strength?',
        steps: [
          { type: 'say', text: "When we talk about strengths, we often think of being good at math or fast at running. But character strengths are different. They are who you ARE, not just what you DO." },
          { type: 'do', text: "Write examples on the board: Kindness, Bravery, Humor, Curiosity, Honesty, Teamwork, Perseverance." },
          { type: 'say', text: "Every single person in this room has at least three of these super powers." }
        ]
      },
      {
        time: '10–25 min', phase: 'Designing the Shield',
        steps: [
          { type: 'do', text: "Hand out the shield templates divided into 4 quadrants." },
          { type: 'say', text: "Quadrant 1: Draw your greatest strength. Quadrant 2: A strength someone else sees in you. Quadrant 3: A time you used a strength to help. Quadrant 4: A strength you want to grow." },
        ]
      },
      {
        time: '25–35 min', phase: 'Shield Sharing',
        steps: [
          { type: 'do', text: "In pairs, students share their shields." },
          { type: 'say', text: "Partners, your job is to listen and say: 'I can definitely see that strength in you because...'" }
        ]
      },
      {
        time: '35–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Conclude by discussing how knowing our strengths acts as a shield against hard days." }
        ]
      }
    ],
    debrief: [
      { q: "Was it hard to choose a strength for yourself?", note: "Normalise that human brains are wired to see the negative." },
      { q: "How can you use your strength to help you get through a difficult exam week?", note: "Connect abstract strengths to practical school challenges." }
    ],
    watchOutFor: [
      "Students who say 'I do not have any strengths'. Sit with them and offer observations: 'I noticed you helped Maya yesterday. That shows kindness.'"
    ],
    variations: [
      { tag: 'Art-focused class', text: "Provide magazines for a collage-style shield instead of drawing." }
    ],
    worksheet: {
      title: 'My Strengths Shield',
      intro: 'Design your personal crest based on who you are inside.',
      sections: [
        {
          title: 'Shield Planning',
          prompts: [
            { label: 'My greatest strength is:', lines: 1 },
            { label: 'A strength others see in me:', lines: 1 },
            { label: 'A time I used my strength to help:', lines: 2 },
            { label: 'A strength I want to grow this year:', lines: 1 }
          ]
        }
      ]
    }
  },
  {
    id: 'humanknot',
    title: 'The Human Knot',
    themeShort: ['Problem solving', 'Interpersonal relationships'],
    grade: '5–7', gradeKey: 'lower',
    duration: '30 min',
    formats: ['Small groups'],
    color: '#8E44AD', colorPale: '#F5EEF8',
    objective: "Students will physically collaborate to solve a complex spatial problem, identifying the importance of clear communication and emotional regulation under frustration.",
    materials: ["Open floor space"],
    phases: [
      {
        time: '0–5 min', phase: 'The Setup',
        steps: [
          { type: 'do', text: "Divide the class into groups of 6-8 students." },
          { type: 'say', text: "Stand in a tight circle. Reach across and grab the hand of someone who is NOT standing right next to you. Now do the same with your other hand to a different person." },
        ]
      },
      {
        time: '5–20 min', phase: 'The Challenge',
        steps: [
          { type: 'say', text: "You are now a human knot. Your goal is to untangle yourselves into a perfect circle WITHOUT letting go of anyone's hands." },
          { type: 'do', text: "Let them struggle. Do not intervene unless safety is a concern. Observe who takes charge and who gets frustrated." },
        ]
      },
      {
        time: '20–30 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Once groups finish (or the time runs out), sit everyone down." },
          { type: 'say', text: "Let us talk about what just happened." },
        ]
      }
    ],
    debrief: [
      { q: "What was the most frustrating part of the challenge?", note: "Often it is when people pull in different directions or do not listen." },
      { q: "Who stepped up as a leader? Did they tell people what to do, or did they ask for ideas?", note: "Highlight the difference between bossing and guiding." },
    ],
    watchOutFor: [
      "Physical safety. Ensure students step over or duck under arms carefully."
    ],
    variations: [
      { tag: 'Grade 7', text: "Run a second round in complete silence to force non-verbal problem solving." }
    ],
    worksheet: {
      title: 'Problem Solving Reflection',
      intro: 'Think about how your group handled the Human Knot.',
      sections: [
        {
          title: 'Team Dynamics',
          prompts: [
            { label: 'When we got stuck, the thing that helped us most was:', lines: 2 },
            { label: 'One thing I did to help the team was:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'thermometer',
    title: 'The Emotion Thermometer',
    themeShort: ['Coping with emotions'],
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Individual', 'Full class'],
    color: '#E74C3C', colorPale: '#FDEDEC',
    objective: "Students will map the intensity of their emotions from 1 to 10 and identify specific coping strategies for when the temperature gets too high.",
    materials: ["Emotion Thermometer Worksheets", "Whiteboard"],
    phases: [
      {
        time: '0–10 min', phase: 'Mapping Intensity',
        steps: [
          { type: 'do', text: "Draw a large thermometer on the board, numbered 1 to 10." },
          { type: 'say', text: "We do not just feel 'angry'. We feel 'annoyed' (a 2), 'frustrated' (a 5), or 'furious' (a 9). Today we are going to map our own emotional temperature." },
        ]
      },
      {
        time: '10–25 min', phase: 'Personal Thermometers',
        steps: [
          { type: 'do', text: "Distribute worksheets. Students fill in their own warning signs for levels 3, 6, and 9." },
          { type: 'say', text: "What does your body feel like at a 3? What does it do at a 9? Write it down." },
        ]
      },
      {
        time: '25–35 min', phase: 'Cooling Down',
        steps: [
          { type: 'say', text: "Now, write one specific thing you can do to cool down when you hit a 6, before you reach a 9." },
          { type: 'do', text: "Share strategies as a class." },
        ]
      }
    ],
    debrief: [
      { q: "Why is it important to notice when you are at a 6 instead of waiting until you are a 9?", note: "It is easier to cool down before a full explosion." },
      { q: "What is one physical warning sign your body gives you when your temperature is rising?", note: "Clenched fists, hot face, breathing fast." },
    ],
    watchOutFor: [
      "Students struggling to identify physical symptoms. Offer examples."
    ],
    variations: [
      { tag: 'Short session', text: "Focus only on anger, rather than all emotions." }
    ],
    worksheet: {
      title: 'My Emotion Thermometer',
      intro: 'Map your warning signs and your cool-down strategies.',
      sections: [
        {
          title: 'Temperature Check',
          prompts: [
            { label: 'At a 3 (Mild), I notice my body:', lines: 2 },
            { label: 'At a 6 (Medium), I start to:', lines: 2 },
            { label: 'At a 9 (High), I usually:', lines: 2 },
          ]
        },
        {
          title: 'Cool Down Plan',
          prompts: [
            { label: 'When I hit a 6, I will cool down by:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'whatifmap',
    title: 'The What-If Map',
    themeShort: ['Decision making', 'Creative thinking'],
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Small groups'],
    color: '#F39C12', colorPale: '#FEF9E7',
    objective: "Students will practice tracing the short and long-term consequences of a single decision using a branching mind map.",
    materials: ["Large chart paper", "Markers", "Scenario Cards"],
    phases: [
      {
        time: '0–10 min', phase: 'The Ripple Effect',
        steps: [
          { type: 'say', text: "Every decision is like dropping a stone in a pond. It creates ripples. Today we are going to draw the ripples." },
          { type: 'do', text: "Demonstrate on the board with a simple choice: 'I decide not to study for the math test.' Draw branches for what happens the next day, the next week, and the next month." },
        ]
      },
      {
        time: '10–25 min', phase: 'Group Mapping',
        steps: [
          { type: 'do', text: "Give groups a scenario card (e.g., 'You find a lost phone in the cafeteria')." },
          { type: 'say', text: "Draw the What-If map. If you keep it, what happens? If you turn it in, what happens? Trace each path out to at least three consequences." },
        ]
      },
      {
        time: '25–35 min', phase: 'Gallery Walk',
        steps: [
          { type: 'do', text: "Groups present their maps to the class." },
        ]
      }
    ],
    debrief: [
      { q: "Did tracing the 'What-Ifs' make the right choice clearer?", note: "Visualizing consequences often removes impulsivity." },
    ],
    watchOutFor: [
      "Groups getting stuck on unrealistic extreme consequences. Keep them grounded."
    ],
    variations: [
      { tag: 'Grade 5', text: "Do the mapping as a full class activity on the main whiteboard." }
    ],
    worksheet: {
      title: 'The What-If Map',
      intro: 'Trace the ripples of your choices.',
      sections: [
        {
          title: 'My Map',
          prompts: [
            { label: 'The Decision:', lines: 2 },
            { label: 'Path A leads to:', lines: 2 },
            { label: 'Path B leads to:', lines: 2 },
          ]
        }
      ]
    }
  },

  // ──────────────────────── MIDDLE SECONDARY (Grade 8-10) ────────────────────────
  // ============================================================================
  // 20 NEW MIDDLE SECONDARY ACTIVITIES (WHO Life Skills)
  // ============================================================================

  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "m_sa_1", title: "The Personality Paradox", themeShort: ["Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual", "Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Students will explore how their behavior changes across different social contexts (home, school, friends) to identify their core values.", materials: ["Context Circle worksheet", "Pens"],
    phases: [
      { time: "0–10 min", phase: "The Chameleon Effect", steps: [ { type: "say", text: "We all act differently depending on who we are with. This is not being fake; it is social adaptation. But who are you when you are alone?" } ] },
      { time: "10–25 min", phase: "Context Mapping", steps: [ { type: "do", text: "Students map their traits in three overlapping circles: Home, School, Friends. Identify which traits appear in all three (Core Self)." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "say", text: "Does your core self align with the person you want to be?" } ] }
    ],
    debrief: [ { q: "Which version of you feels the most 'real'?", note: "Helps identify where they feel safest." } ],
    worksheet: { title: "Context Mapping", intro: "Analyze your social roles.", sections: [ { title: "The Circles", prompts: [ { label: "Traits I show only with friends:", lines: 2 }, { label: "Traits that never change (My Core):", lines: 2 } ] } ] }
  },
  {
    id: "m_sa_2", title: "The Wheel of Life Audit", themeShort: ["Self-awareness", "Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Assess current life balance across 8 domains to identify areas needing attention and self-care.", materials: ["Wheel diagram", "Markers"],
    phases: [
      { time: "0–10 min", phase: "The 8 Spokes", steps: [ { type: "say", text: "A wheel only rolls if it is balanced. Your life has 8 spokes: Studies, Family, Friends, Health, Hobbies, Rest, Mindset, and Contribution." } ] },
      { time: "10–25 min", phase: "The Audit", steps: [ { type: "do", text: "Students rate their satisfaction in each area from 1 to 10 and shade the wheel." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "say", text: "Look at your wheel. Would it be a bumpy ride?" } ] }
    ],
    debrief: [ { q: "Which spoke is currently taking up too much space?", note: "Usually 'Studies' for this age group." } ],
    worksheet: { title: "Life Balance Audit", intro: "Check your balance.", sections: [ { title: "Action Plan", prompts: [ { label: "The spoke I will focus on improving this month:", lines: 1 }, { label: "One small action to improve it:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "m_em_1", title: "The Silent Interviewer", themeShort: ["Empathy", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Build empathy by focusing exclusively on non-verbal cues and emotional subtext.", materials: ["None"],
    phases: [
      { time: "0–5 min", phase: "Non-Verbal Impact", steps: [ { type: "say", text: "Over 70% of communication is non-verbal. If you only listen to words, you miss the person." } ] },
      { time: "5–20 min", phase: "The Interview", steps: [ { type: "do", text: "Student A tells a story for 3 minutes. Student B may not speak but must show they are listening using only body language." } ] },
      { time: "20–35 min", phase: "Feedback", steps: [ { type: "say", text: "Listener, tell the speaker what emotions you saw in their face, even if they didn't say the words." } ] }
    ],
    debrief: [ { q: "Was it harder to speak without feedback or listen without speaking?", note: "Highlights our need for active validation." } ],
    worksheet: { title: "Non-Verbal Notes", intro: "Watch the face, not just the mouth.", sections: [ { title: "Observation", prompts: [ { label: "Cues that showed my partner was listening:", lines: 2 } ] } ] }
  },
  {
    id: "m_em_2", title: "The Unheard Voice", themeShort: ["Empathy"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Investigate marginalized perspectives within a local or school-based news event.", materials: ["Recent news clippings or school issues"],
    phases: [
      { time: "0–10 min", phase: "Who is Missing?", steps: [ { type: "say", text: "In every story, there are people we don't hear from. Empathy means seeking them out." } ] },
      { time: "10–25 min", phase: "The Investigation", steps: [ { type: "do", text: "Groups read a school issue (e.g., 'New library rules'). They must identify 3 stakeholders whose voices were not in the announcement." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "say", text: "How would the decision change if those voices were heard?" } ] }
    ],
    debrief: [ { q: "Why do we tend to ignore the voices of people unlike us?", note: "Discusses proximity bias." } ],
    worksheet: { title: "Voice Search", intro: "Find the missing perspective.", sections: [ { title: "Stakeholder Map", prompts: [ { label: "The group we ignored:", lines: 1 }, { label: "What they might be feeling about this decision:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "m_ct_1", title: "The Correlation Trap", themeShort: ["Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Small groups"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Understand the difference between correlation and causation to avoid faulty conclusions.", materials: ["Silly correlation graphs (e.g., Ice cream sales vs Shark attacks)"],
    phases: [
      { time: "0–10 min", phase: "The False Link", steps: [ { type: "say", text: "Just because two things happen at the same time does not mean one caused the other." } ] },
      { time: "10–25 min", phase: "The Graph Hunt", steps: [ { type: "do", text: "Groups look at graphs showing high correlation. They must find the 'hidden third factor' (e.g., Summer heat)." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Apply this to 'Luck' or school rumors." } ] }
    ],
    debrief: [ { q: "How do rumors use the correlation trap to spread?", note: "Connects logic to social awareness." } ],
    worksheet: { title: "Logic Check", intro: "Correlation is not causation.", sections: [ { title: "Analysis", prompts: [ { label: "Scenario: 'I wore my lucky socks and won the game.' What was the real cause?", lines: 2 } ] } ] }
  },
  {
    id: "m_ct_2", title: "The Socratic Seminar", themeShort: ["Critical thinking", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "45 min", formats: ["Full class circle"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice asking open-ended questions to explore the depth of an idea rather than just winning an argument.", materials: ["A short, provocative text or quote"],
    phases: [
      { time: "0–5 min", phase: "The Rules", steps: [ { type: "say", text: "In this circle, we don't raise hands. We don't argue to win. We ask questions to understand." } ] },
      { time: "5–35 min", phase: "The Seminar", steps: [ { type: "do", text: "The teacher acts only as a facilitator. Students discuss a prompt like: 'Is technology making us more or less connected?'" } ] },
      { time: "35–45 min", phase: "Debrief", steps: [ { type: "say", text: "What did you learn from someone you disagreed with?" } ] }
    ],
    debrief: [ { q: "How does it feel to discuss without a 'winner'?", note: "Highlights collaborative thinking." } ],
    worksheet: { title: "Seminar Reflection", intro: "Reflect on the dialogue.", sections: [ { title: "Insights", prompts: [ { label: "One question someone asked that made me think differently:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 4: Creative Thinking ──
  {
    id: "m_crt_1", title: "SCAMPER for School", themeShort: ["Creative thinking", "Problem solving"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#D35400", colorPale: "#FDEBD0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Apply the SCAMPER method to redesign a familiar school system.", materials: ["SCAMPER guide sheet", "Chart paper"],
    phases: [
      { time: "0–10 min", phase: "The Tool", steps: [ { type: "say", text: "SCAMPER: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse." } ] },
      { time: "10–30 min", phase: "The Redesign", steps: [ { type: "do", text: "Groups apply SCAMPER to the 'School Assembly' or 'Lunch Break'. (e.g., Reverse: Students teach teachers)." } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "do", text: "Present the most innovative redesign." } ] }
    ],
    debrief: [ { q: "Which SCAMPER letter was the most helpful?", note: "Usually 'Combine' or 'Reverse' produce the best ideas." } ],
    worksheet: { title: "SCAMPER Redesign", intro: "Innovate the familiar.", sections: [ { title: "My Ideas", prompts: [ { label: "What we Substituted:", lines: 1 }, { label: "What we Reversed:", lines: 1 } ] } ] }
  },
  {
    id: "m_crt_2", title: "The Metaphor Maker", themeShort: ["Creative thinking", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Pairs"], color: "#D35400", colorPale: "#FDEBD0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Explain a complex or 'boring' concept using a creative analogy or metaphor.", materials: ["Concept cards (e.g., Photosynthesis, Democracy, Gravity)"],
    phases: [
      { time: "0–5 min", phase: "Power of Metaphor", steps: [ { type: "say", text: "A metaphor is a bridge between the unknown and the known." } ] },
      { time: "5–20 min", phase: "The Bridge", steps: [ { type: "do", text: "Pairs get a card. They must explain it as if it were a sport, a kitchen, or a video game." } ] },
      { time: "20–35 min", phase: "Presentation", steps: [ { type: "do", text: "Present the metaphor to the class without naming the concept. The class must guess." } ] }
    ],
    debrief: [ { q: "Why does a metaphor make things easier to remember?", note: "It attaches new info to old memories." } ],
    worksheet: { title: "Metaphor Lab", intro: "Build a bridge.", sections: [ { title: "The Concept", prompts: [ { label: "Concept: Democracy. Metaphor: It is like a...", lines: 3 } ] } ] }
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "m_dm_1", title: "The Pre-decisional Balance Sheet", themeShort: ["Decision making"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Systematically weigh logical pros/cons against personal values to make a high-stakes choice.", materials: ["Balance Sheet worksheet"],
    phases: [
      { time: "0–10 min", phase: "Logic vs Feeling", steps: [ { type: "say", text: "Sometimes a choice looks good on paper but feels wrong in your gut. We need to check both." } ] },
      { time: "10–25 min", phase: "The Sheet", steps: [ { type: "do", text: "Students pick a real choice (e.g., joining a team vs focusing on grades). List logical gains/losses AND emotional gains/losses." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss which column usually wins." } ] }
    ],
    debrief: [ { q: "What happens when your logic and your values disagree?", note: "This is where the most difficult decisions live." } ],
    worksheet: { title: "The Decision Balance", intro: "Check your logic and your gut.", sections: [ { title: "Logic vs Values", prompts: [ { label: "Logical Pros:", lines: 2 }, { label: "How it aligns with my values:", lines: 2 } ] } ] }
  },
  {
    id: "m_dm_2", title: "The Decision Tree", themeShort: ["Decision making", "Problem solving"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual", "Pairs"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Map out the branching consequences of academic and social choices.", materials: ["Large paper"],
    phases: [
      { time: "0–10 min", phase: "The Branches", steps: [ { type: "say", text: "A decision tree shows you the path. If I choose X, it leads to Y or Z. If I choose Y..." } ] },
      { time: "10–30 min", phase: "Mapping", steps: [ { type: "do", text: "Students map out their stream choice (Science/Commerce/Arts) and the possible careers/lives branching from each." } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "say", text: "Did any branch lead to a dead end?" } ] }
    ],
    debrief: [ { q: "Is any decision truly permanent?", note: "Remind them that trees can be pruned and grow new branches." } ],
    worksheet: { title: "My Decision Tree", intro: "See the forest.", sections: [ { title: "The Map", prompts: [ { label: "My main choice:", lines: 1 }, { label: "Three possible outcomes:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 6: Problem Solving ──
  {
    id: "m_ps_1", title: "The Design Thinking Sprint", themeShort: ["Problem solving", "Creative thinking"], grade: "8–10", gradeKey: "middle", duration: "45 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Apply the first 3 stages of Design Thinking (Empathize, Define, Ideate) to a campus issue.", materials: ["Post-its", "Markers"],
    phases: [
      { time: "0–10 min", phase: "Empathize", steps: [ { type: "do", text: "Groups interview 'users' (other students) about a problem (e.g., 'The lunch rush')." } ] },
      { time: "10–20 min", phase: "Define", steps: [ { type: "say", text: "Now write a single problem statement: 'How might we make lunch less stressful for freshmen?'" } ] },
      { time: "20–35 min", phase: "Ideate", steps: [ { type: "do", text: "Generate 50 ideas in 10 minutes. No judging." } ] },
      { time: "35–45 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how starting with empathy changed the solution." } ] }
    ],
    debrief: [ { q: "Was your final idea different from your first guess?", note: "Highlights the danger of assuming solutions." } ],
    worksheet: { title: "Design Sprint", intro: "User-centered solving.", sections: [ { title: "The Problem", prompts: [ { label: "Our 'How Might We' statement:", lines: 2 } ] } ] }
  },
  {
    id: "m_ps_2", title: "The Logic Bridge", themeShort: ["Problem solving", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Solve lateral thinking riddles to practice non-linear problem solving.", materials: ["Lateral thinking cards"],
    phases: [
      { time: "0–5 min", phase: "Linear vs Lateral", steps: [ { type: "say", text: "Linear thinking is a straight line. Lateral thinking is jumping over the fence." } ] },
      { time: "5–25 min", phase: "The Solve", steps: [ { type: "do", text: "Provide a riddle. Groups can only ask yes/no questions to solve it." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "What assumptions did you have to drop to find the answer?" } ] }
    ],
    debrief: [ { q: "Why is our first assumption often wrong?", note: "Brains use shortcuts that mask the truth." } ],
    worksheet: { title: "Lateral Thinking", intro: "Think around the corner.", sections: [ { title: "My Riddle", prompts: [ { label: "The assumption that blocked us:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 7: Effective Communication ──
  {
    id: "m_ec_1", title: "The NVC Script", themeShort: ["Effective communication", "Interpersonal relationships"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Pairs", "Role-play"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Master the Non-Violent Communication framework to handle high-stakes interpersonal conflict.", materials: ["NVC Template"],
    phases: [
      { time: "0–10 min", phase: "Observation vs Judgment", steps: [ { type: "say", text: "NVC has 4 steps: Observation (Fact), Feeling, Need, and Request. Most people start with Judgment." } ] },
      { time: "10–25 min", phase: "Scripting", steps: [ { type: "do", text: "Pairs draft a script for a real issue: 'You left me out of the group chat.' Fact: I saw the chat. Feeling: Lonely. Need: Inclusion. Request: Add me." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "do", text: "Practice delivering the script with a neutral tone." } ] }
    ],
    debrief: [ { q: "Why is 'I feel...' safer than 'You are...'?", note: "No one can argue with your feelings." } ],
    worksheet: { title: "NVC Scripting", intro: "Communicate without attacking.", sections: [ { title: "The Script", prompts: [ { label: "When I see/hear [Fact]:", lines: 1 }, { label: "I feel [Emotion]:", lines: 1 }, { label: "Would you be willing to [Request]:", lines: 1 } ] } ] }
  },
  {
    id: "m_ec_2", title: "The Digital Etiquette Lab", themeShort: ["Effective communication", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Small groups"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Analyze the tone and impact of digital messages to prevent online misunderstanding.", materials: ["Printed text thread examples"],
    phases: [
      { time: "0–10 min", phase: "The Tone Gap", steps: [ { type: "say", text: "Texts have no voice and no face. Our brains often fill in a negative tone when none was intended." } ] },
      { time: "10–25 min", phase: "The Lab", steps: [ { type: "do", text: "Groups read ambiguous texts. They must rewrite them 3 ways: Aggressive, Sarcastic, and Clear/Neutral." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "What is the 'Golden Rule' of texting?" } ] }
    ],
    debrief: [ { q: "Should you ever resolve a big conflict over text?", note: "No. Emphasize face-to-face for high emotion." } ],
    worksheet: { title: "Digital Lab", intro: "Check your tone.", sections: [ { title: "Rewrite", prompts: [ { label: "Ambiguous: 'K. Fine.' Rewrite to be Clear:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 8: Interpersonal Relationships ──
  {
    id: "m_ir_1", title: "The Trust Battery", themeShort: ["Interpersonal relationships"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Visualize how trust is built and broken in small increments over time.", materials: ["Battery diagram"],
    phases: [
      { time: "0–10 min", phase: "Small Acts", steps: [ { type: "say", text: "Trust isn't a light switch. It is a battery. It charges with small promises kept and drains with small promises broken." } ] },
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Students identify 3 'charging' behaviors (e.g., keeping a secret) and 3 'draining' behaviors (e.g., being late)." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Can you charge a battery instantly after it hits 0%?" } ] }
    ],
    debrief: [ { q: "Why is trust so much harder to rebuild than to build?", note: "Discusses the weight of betrayal." } ],
    worksheet: { title: "Trust Audit", intro: "Check your connections.", sections: [ { title: "Charging/Draining", prompts: [ { label: "One thing I do to charge my friends' batteries:", lines: 2 } ] } ] }
  },
  {
    id: "m_ir_2", title: "Conflict Styles Inventory", themeShort: ["Interpersonal relationships", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Identify personal conflict defaults: Avoiding, Competing, Accommodating, Compromising, or Collaborating.", materials: ["Conflict Style Quiz"],
    phases: [
      { time: "0–15 min", phase: "The Animal Metaphors", steps: [ { type: "do", text: "Introduce the 5 styles: Turtle (Avoid), Shark (Compete), Teddy Bear (Accommodate), Fox (Compromise), Owl (Collaborate)." } ] },
      { time: "15–30 min", phase: "Role-Play", steps: [ { type: "do", text: "Pairs act out a scenario (e.g., 'Choosing a project topic') twice: once as Sharks, once as Owls." } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "say", text: "Which style is most exhausting? Which is most productive?" } ] }
    ],
    debrief: [ { q: "Is it ever okay to be a Turtle?", note: "Yes, if the issue is minor or safety is at risk." } ],
    worksheet: { title: "My Conflict Style", intro: "Identify your default.", sections: [ { title: "Audit", prompts: [ { label: "My default animal is:", lines: 1 }, { label: "When I should have been an Owl instead:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 9: Coping with Stress ──
  {
    id: "m_cs_1", title: "The ABC Model", themeShort: ["Coping with stress", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual", "Pairs"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Apply Albert Ellis's ABC model to identify the irrational beliefs that turn events into stressors.", materials: ["ABC Template"],
    phases: [
      { time: "0–10 min", phase: "Beliefs Matter", steps: [ { type: "say", text: "A = Activating Event. B = Belief. C = Consequence. Most people think A causes C. But it is actually B." } ] },
      { time: "10–25 min", phase: "The Drill", steps: [ { type: "do", text: "Event: Friend doesn't text back. Belief: They hate me. Consequence: Anxiety. New Belief: They are busy. New Consequence: Calm." } ] },
      { time: "25–40 min", phase: "Debrief", steps: [ { type: "do", text: "Share 'New Beliefs' for common school stressors." } ] }
    ],
    debrief: [ { q: "Can you control the Activating Event?", note: "No. But you can control the Belief." } ],
    worksheet: { title: "ABC Mapping", intro: "Challenge your thoughts.", sections: [ { title: "The Flip", prompts: [ { label: "Stressful Event (A):", lines: 1 }, { label: "Irrational Belief (B):", lines: 1 }, { label: "Helpful New Belief:", lines: 2 } ] } ] }
  },
  {
    id: "m_cs_2", title: "Progressive Relaxation", themeShort: ["Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Full class"], color: "#27AE60", colorPale: "#E9F7EF", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Practice PMR to physically release stored stress and improve sleep hygiene.", materials: ["Calm music"],
    phases: [
      { time: "0–5 min", phase: "Body Stress", steps: [ { type: "say", text: "We carry stress in our jaw, shoulders, and hands without knowing it." } ] },
      { time: "5–25 min", phase: "The Practice", steps: [ { type: "do", text: "Guide students through tensing and releasing every muscle group, from toes to face, for 5 seconds each." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "How light does your body feel now?" } ] }
    ],
    debrief: [ { q: "Where were you holding the most tension?", note: "Helps students become aware of their physical stress markers." } ],
    worksheet: { title: "Physical Check-in", intro: "Listen to your muscles.", sections: [ { title: "Audit", prompts: [ { label: "My body carries stress in my:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 10: Coping with Emotions ──
  {
    id: "m_ce_1", title: "The Anger Map", themeShort: ["Coping with emotions", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Identify where anger sits in the body to catch 'emotional hijacking' early.", materials: ["Body outline worksheets"],
    phases: [
      { time: "0–10 min", phase: "The Hijack", steps: [ { type: "say", text: "When you are angry, your logical brain shuts off. Your body knows you are mad before you do." } ] },
      { time: "10–25 min", phase: "Body Scan", steps: [ { type: "do", text: "Students color the body outline where they feel anger: Hot face? Tight chest? Shaking hands?" } ] },
      { time: "25–35 min", phase: "The Early Warning", steps: [ { type: "say", text: "The next time your face feels hot, that is your signal to use a release valve." } ] }
    ],
    debrief: [ { q: "Did everyone's map look the same?", note: "Highlights individual differences in emotion." } ],
    worksheet: { title: "The Anger Map", intro: "Color where it hurts.", sections: [ { title: "Reflection", prompts: [ { label: "My first physical sign of anger is:", lines: 1 } ] } ] }
  },
  {
    id: "m_ce_2", title: "Grief and Loss Timeline", themeShort: ["Coping with emotions"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    objective: "Broaden the definition of loss to normalize feelings of sadness during life transitions.", materials: ["Timeline template"],
    phases: [
      { time: "0–10 min", phase: "Loss is Not Just Death", steps: [ { type: "say", text: "We feel grief when a friend moves, when a pet dies, or when we leave a school we loved." } ] },
      { time: "10–30 min", phase: "My Timeline", steps: [ { type: "do", text: "Students map 'Ending Points' in their life. For each, they write one thing they miss and one thing they gained." } ] },
      { time: "30–40 min", phase: "Debrief", steps: [ { type: "say", text: "Sadness is the price we pay for caring about something. It is a sign of a good heart." } ] }
    ],
    debrief: [ { q: "Why do we feel embarrassed to be sad about 'small' things like a lost item or a move?", note: "Challenge the idea of comparative suffering." } ],
    worksheet: { title: "Endings and Beginnings", intro: "Honoring changes.", sections: [ { title: "The Timeline", prompts: [ { label: "A transition that was hard for me:", lines: 2 }, { label: "One thing I learned from that change:", lines: 2 } ] } ] }
  },
  {
    id: 'pressure',
    title: 'The Pressure Bottle',
    themeShort: ['Coping with stress', 'Coping with emotions'],
    grade: '8–10', gradeKey: 'middle',
    duration: '35 min',
    formats: ['Demonstration', 'Individual'],
    color: '#C0392B', colorPale: '#FADBD8',
    objective: "Students will map their own personal stress cycle — triggers, build-up signs, explosion patterns, and release valves.",
    materials: ["One plastic bottle with cap (shaken up)", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'The Demonstration',
        steps: [
          { type: 'do', text: "Secretly shake the bottle vigorously. Hold it behind your back." },
          { type: 'do', text: "Begin to slowly open the cap. The pressure releases gradually. Nothing spills." },
          { type: 'say', text: "Our stress works exactly the same way. The question is not whether the pressure builds — it always does. The question is whether we release it slowly, or suddenly all at once." },
        ]
      },
      {
        time: '5–15 min', phase: 'Mapping the Stress Cycle',
        steps: [
          { type: 'do', text: "Draw a simple diagram on the board: A bottle." },
          { type: 'say', text: "Let's think about what fills up our bottle. What are the WARNING SIGNS that your bottle is getting full?" },
          { type: 'say', text: "And what does YOUR explosion look like? What happens when the cap blows?" },
        ]
      },
      {
        time: '15–25 min', phase: 'Individual Mapping',
        steps: [
          { type: 'do', text: "Distribute the worksheet. Students map their own pressure bottle." },
          { type: 'say', text: "The bottom section — release valves — is the most important one. Write down things that actually help YOU let off pressure gradually." },
        ]
      },
      {
        time: '25–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use debrief questions. End with the commitment." },
        ]
      },
    ],
    debrief: [
      { q: "Which part of your bottle was easiest to identify? Which was hardest, and why?", note: "Most students find release valves hardest — because they haven't been taught them." },
      { q: "What makes it hard to use your release valves when you are actually in the high-pressure moment?", note: "Listen for: 'I forget', 'It feels fake'. Validate this." },
    ],
    watchOutFor: [
      "A student whose explosion pattern involves self-harm. Follow up privately.",
    ],
    variations: [
      { tag: 'Grade 8', text: "Focus on physical release valves only: breathing, movement." },
    ],
    worksheet: {
      title: 'My Pressure Bottle',
      intro: 'Map your own stress cycle below. Be honest — this is a tool for YOU.',
      sections: [
        {
          title: 'My Shakers',
          prompts: [{ label: 'Write the things that build pressure for you:', lines: 3 }]
        },
        {
          title: 'My Warning Signs',
          twoCol: true,
          colTitles: ['In my BODY', 'In my BEHAVIOUR'],
          prompts: []
        },
        {
          title: 'My Release Valves',
          prompts: [
            { label: 'Things that help me release pressure BEFORE the explosion:', lines: 3 },
          ]
        }
      ]
    }
  },
  {
    id: 'crossroads',
    title: 'The Choice Crossroads',
    themeShort: ['Decision making', 'Critical thinking'],
    grade: '8–10', gradeKey: 'middle',
    duration: '40 min',
    formats: ['Physical movement', 'Pairs', 'Full class'],
    color: '#2980B9', colorPale: '#EBF5FB',
    objective: "Students will practise structured decision-making — identifying the values, consequences, and stakeholders behind a choice.",
    materials: ["4 corner labels: A, B, C, D", "Scenario Cards", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'Setup',
        steps: [
          { type: 'do', text: "Place A/B/C/D labels in the four corners of the room." },
          { type: 'say', text: "Today we are going to make some difficult decisions. When I read a scenario, you move to the corner that matches your choice." },
        ]
      },
      {
        time: '5–20 min', phase: 'Rounds 1 & 2',
        steps: [
          { type: 'say', text: "Scenario 1. Read scenario. Move to your corner." },
          { type: 'do', text: "Give corners 60 seconds to discuss: 'Why did you choose this?'" },
          { type: 'say', text: "Now — switch. Move to the corner that is the OPPOSITE of what you just argued. Prepare arguments for this position." },
        ]
      },
      {
        time: '20–30 min', phase: 'Values Mapping',
        steps: [
          { type: 'say', text: "Let us slow down and look underneath our choices." },
          { type: 'do', text: "Students pick ONE scenario and complete the Decision Framework worksheet." },
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
      { q: "What was it like to have to argue for the OPPOSITE of what you actually believe?", note: "This builds cognitive flexibility." },
      { q: "Think of a real decision you are currently facing. Which framework step do you skip?", note: "Bridge from classroom to real life." },
    ],
    watchOutFor: [
      "Students clustering because friends are there.",
    ],
    variations: [
      { tag: 'Short session', text: "Run only one scenario with the switch." },
    ],
    worksheet: {
      title: 'The Choice Crossroads',
      intro: 'Use this framework to slow down and really examine ONE decision.',
      sections: [
        {
          title: 'My Decision Framework',
          prompts: [
            { label: 'The scenario I am working with:', lines: 2 },
            { label: 'The values driving my choice:', lines: 2 },
            { label: 'The strongest argument AGAINST my choice:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'pushstand',
    title: 'The Push & Stand',
    themeShort: ['Effective communication', 'Interpersonal relationships'],
    grade: '8–10', gradeKey: 'middle',
    duration: '35 min',
    formats: ['Physical pairs activity', 'Role-play'],
    color: '#8E44AD', colorPale: '#F5EEF8',
    objective: "Students will physically and verbally experience the three responses to peer pressure.",
    materials: ["Open floor space", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'Physical Warm-Up',
        steps: [
          { type: 'say', text: "Stand up and find a partner. Push gently. Now stop and let the push happen. Now step to the side when they push." },
          { type: 'say', text: "You just experienced three responses: push back, give in, step aside." },
        ]
      },
      {
        time: '5–12 min', phase: 'Concept',
        steps: [
          { type: 'do', text: "Draw a table: GIVE IN | PUSH BACK | STEP ASIDE" },
          { type: 'say', text: "GIVE IN: peace now, resentment later. PUSH BACK: confrontation now, clarity later. STEP ASIDE: redirect without conflict." },
        ]
      },
      {
        time: '12–22 min', phase: 'Verbal Practice',
        steps: [
          { type: 'do', text: "Pairs practice all three verbal responses to a read scenario." },
        ]
      },
      {
        time: '22–30 min', phase: 'Script Building',
        steps: [
          { type: 'do', text: "Students write their own Push Back and Step Aside scripts on the worksheet." },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "Which response is your default?", note: "Create awareness." },
      { q: "Was there a scenario today where the 'give in' response actually seemed reasonable?", note: "Sometimes giving in is a strategic or kind choice." },
    ],
    watchOutFor: [
      "Physical activity getting too rough.",
    ],
    variations: [
      { tag: 'Grade 8', text: "Focus only on social peer pressure." },
    ],
    worksheet: {
      title: 'My Boundary Scripts',
      intro: 'Write your scripts here.',
      sections: [
        {
          title: 'My Scripts',
          prompts: [
            { label: 'My PUSH BACK script:', lines: 2 },
            { label: 'My STEP ASIDE script:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'twohouse',
    title: 'The Two-Story House',
    themeShort: ['Interpersonal relationships', 'Problem solving'],
    grade: '8–10', gradeKey: 'middle',
    duration: '40 min',
    formats: ['Pairs', 'Trio (with observer)'],
    color: '#16A085', colorPale: '#D5F5F0',
    objective: "Students will distinguish between positions and interests in negotiation.",
    materials: ["Conflict scenario cards", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'The Metaphor',
        steps: [
          { type: 'say', text: "Imagine a house with two floors. Conflict works like this. Two people look at the same situation and see different things." },
        ]
      },
      {
        time: '5–12 min', phase: 'Positions vs Interests',
        steps: [
          { type: 'say', text: "POSITION is what I SAY I want. INTEREST is what I ACTUALLY need." },
        ]
      },
      {
        time: '12–28 min', phase: 'The Exercise',
        steps: [
          { type: 'do', text: "Trios role-play. Person A and B argue. Observer listens for underlying interests." },
        ]
      },
      {
        time: '28–35 min', phase: 'Reflection',
        steps: [
          { type: 'do', text: "Students map a real personal conflict on the worksheet." },
        ]
      },
      {
        time: '35–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "Has your experience changed after hearing the other person's interest?", note: "Empathy moment." },
    ],
    watchOutFor: [
      "Reopening real conflicts in class.",
    ],
    variations: [
      { tag: 'Pairs only', text: "Remove the Observer role." },
    ],
    worksheet: {
      title: 'Mapping Positions & Interests',
      intro: 'Underneath every position is an INTEREST.',
      sections: [
        {
          title: 'My Conflict',
          twoCol: true,
          colTitles: ['MY FLOOR', 'THEIR FLOOR'],
          prompts: [
            { label: 'My POSITION vs Their POSITION:', lines: 2 },
            { label: 'My INTEREST vs Their INTEREST:', lines: 2 },
          ]
        }
      ]
    }
  },
  {
    id: 'calendar',
    title: 'The Reverse Calendar',
    themeShort: ['Problem solving', 'Decision making'],
    grade: '8–10', gradeKey: 'middle',
    duration: '35 min',
    formats: ['Individual', 'Pairs'],
    color: '#27AE60', colorPale: '#D5F5E3',
    objective: "Students will apply backward planning to one goal.",
    materials: ["Blank Reverse Calendar template", "Coloured pens", "Whiteboard"],
    phases: [
      {
        time: '0–5 min', phase: 'Why Goals Fail',
        steps: [
          { type: 'say', text: "Most people plan forward. The most effective planners work backwards." },
        ]
      },
      {
        time: '5–10 min', phase: 'Demo',
        steps: [
          { type: 'do', text: "Draw reverse calendar on board: Exam Date → 1 month before → 2 months before → TODAY." },
        ]
      },
      {
        time: '10–25 min', phase: 'Individual Mapping',
        steps: [
          { type: 'do', text: "Students write their goal, end date, and work backwards to tomorrow's step." },
        ]
      },
      {
        time: '25–30 min', phase: 'Accountability',
        steps: [
          { type: 'do', text: "Pairs share goals and question if the first step is actually doable." },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "Look at your first step for tomorrow. Is it ACTUALLY doable in 15 minutes?", note: "Practical intervention." },
    ],
    watchOutFor: [
      "Goals that are too vague.",
    ],
    variations: [
      { tag: 'Grade 10', text: "Extend to one year timeline." },
    ],
    worksheet: {
      title: 'My Reverse Calendar',
      intro: 'Start at the END.',
      sections: [
        {
          title: 'Working Backwards',
          prompts: [
            { label: 'End Date:', lines: 1 },
            { label: 'TOMORROW — my first step:', lines: 1 },
          ]
        }
      ]
    }
  },
  {
    id: 'innovationpitch',
    title: 'The Innovation Pitch',
    themeShort: ['Creative thinking', 'Problem solving'],
    grade: '8–10', gradeKey: 'middle',
    duration: '40 min',
    formats: ['Small groups'],
    color: '#D35400', colorPale: '#FDEBD0',
    objective: "Students will identify a common school problem and collaboratively design a creative solution, practicing ideation and presentation skills.",
    materials: ["Large chart paper", "Markers"],
    phases: [
      {
        time: '0–5 min', phase: 'Identifying the Problem',
        steps: [
          { type: 'say', text: "Think of one thing about our school day that is annoying, inefficient, or stressful. It could be the cafeteria line, carrying heavy bags, or studying for finals." },
        ]
      },
      {
        time: '5–15 min', phase: 'Brainstorming Solutions',
        steps: [
          { type: 'do', text: "In groups of 4, students pick ONE problem and brainstorm the wildest, most creative solutions possible without judging them yet." },
        ]
      },
      {
        time: '15–25 min', phase: 'Refining the Pitch',
        steps: [
          { type: 'say', text: "Now pick your best idea. You have 10 minutes to design a 'Pitch' to sell this idea to the Principal. Create a poster showing how it works." },
        ]
      },
      {
        time: '25–35 min', phase: 'The Pitches',
        steps: [
          { type: 'do', text: "Groups present their 2-minute pitches to the class." },
        ]
      },
      {
        time: '35–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss the creative process." }
        ]
      }
    ],
    debrief: [
      { q: "Was it hard to stop judging your ideas during the brainstorm phase?", note: "Creativity requires turning off the inner critic." },
    ],
    watchOutFor: [
      "Groups focusing entirely on complaints rather than solutions. Redirect them to the 'fix'."
    ],
    variations: [
      { tag: 'Grade 8', text: "Provide a list of 3 pre-selected problems to choose from." }
    ],
    worksheet: {
      title: 'The Innovation Pitch',
      intro: 'Turn complaints into creative solutions.',
      sections: [
        {
          title: 'The Plan',
          prompts: [
            { label: 'The Problem we chose:', lines: 2 },
            { label: 'Our wildest idea:', lines: 2 },
            { label: 'Our final solution:', lines: 3 },
          ]
        }
      ]
    }
  },
  {
    id: 'emotionlog',
    title: 'The Emotion Log',
    themeShort: ['Coping with emotions', 'Self-awareness'],
    grade: '8–10', gradeKey: 'middle',
    duration: '35 min',
    formats: ['Individual'],
    color: '#8E44AD', colorPale: '#F5EEF8',
    objective: "Students will track their emotional state over a week to identify patterns, triggers, and the impermanence of feelings.",
    materials: ["Emotion Log templates"],
    phases: [
      {
        time: '0–10 min', phase: 'The Myth of Permanence',
        steps: [
          { type: 'say', text: "When we are very sad or angry, our brain tricks us into believing we will feel that way forever. But emotions are like weather. They always change." },
        ]
      },
      {
        time: '10–20 min', phase: 'Setting up the Log',
        steps: [
          { type: 'do', text: "Distribute the logs. Explain how to track morning, afternoon, and evening emotions using simple words or colours." },
        ]
      },
      {
        time: '20–30 min', phase: 'Reflecting on the Past',
        steps: [
          { type: 'say', text: "Think about yesterday. Fill out the log retrospectively. Did your emotion stay the exact same all day?" },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Commit to filling it out for the next 5 days." }
        ]
      }
    ],
    debrief: [
      { q: "Why is it helpful to realize that an emotion will not last forever?", note: "It creates hope and endurance." },
    ],
    watchOutFor: [
      "Students finding the task tedious. Keep the log very simple (e.g., just coloring a box)."
    ],
    variations: [
      { tag: 'Grade 10', text: "Add a 'trigger' column to identify what caused the emotion shift." }
    ],
    worksheet: {
      title: 'My Emotion Log',
      intro: 'Emotions are weather. Track the changes.',
      sections: [
        {
          title: 'Daily Tracking',
          prompts: [
            { label: 'Morning feeling:', lines: 1 },
            { label: 'Afternoon feeling:', lines: 1 },
            { label: 'Evening feeling:', lines: 1 },
          ]
        }
      ]
    }
  },
  {
    id: 'factchecker',
    title: 'The Fact-Checker',
    themeShort: ['Critical thinking'],
    grade: '8–10', gradeKey: 'middle',
    duration: '40 min',
    formats: ['Small groups'],
    color: '#2C3E50', colorPale: '#EAF0FB',
    objective: "Students will analyze a piece of media to differentiate between objective facts, subjective opinions, and manipulative language.",
    materials: ["Printed short articles or advertisements", "Highlighters"],
    phases: [
      {
        time: '0–10 min', phase: 'Fact vs Opinion',
        steps: [
          { type: 'say', text: "A fact can be proven. An opinion is a belief. Manipulative language is an opinion disguised as a fact." },
          { type: 'do', text: "Give quick examples on the board." },
        ]
      },
      {
        time: '10–25 min', phase: 'The Audit',
        steps: [
          { type: 'do', text: "Give groups the printed articles. Ask them to highlight facts in yellow, opinions in pink, and manipulative words in green." },
        ]
      },
      {
        time: '25–35 min', phase: 'Presenting Findings',
        steps: [
          { type: 'do', text: "Groups share the most manipulative sentence they found." },
        ]
      },
      {
        time: '35–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss how this applies to social media." }
        ]
      }
    ],
    debrief: [
      { q: "How often do you read an opinion online and accept it as a fact?", note: "Encourage self-reflection on media consumption." },
    ],
    watchOutFor: [
      "Choosing highly controversial political articles. Keep the articles focused on benign but persuasive topics (like advertising)."
    ],
    variations: [
      { tag: 'Grade 10', text: "Use real social media influencer posts promoting a product." }
    ],
    worksheet: {
      title: 'The Fact-Checker Audit',
      intro: 'Don\'t believe everything you read. Highlight the truth.',
      sections: [
        {
          title: 'Article Analysis',
          prompts: [
            { label: 'One proven fact I found:', lines: 2 },
            { label: 'One opinion disguised as a fact:', lines: 2 },
          ]
        }
      ]
    }
  },

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
