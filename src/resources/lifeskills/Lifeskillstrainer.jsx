/**
 * Life Skills Trainer — School Counsellor Activity Bank
 * src/resources/lifeskills/Lifeskillstrainer.jsx
 *
 * 10 classroom-ready activities for Grade 5–12 life skills sessions.
 * Each activity includes: objective, materials, full facilitation script,
 * debrief questions, watch-out notes, variations, and a printable
 * student worksheet.
 *
 * Print: Facilitator Guide OR Student Worksheet — browser-native PDF via @media print
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

/* ── Shell ── */
.lst-page { min-height:100vh; background:var(--ls-cream); padding-bottom:100px; font-family:'Plus Jakarta Sans',sans-serif; }

/* ── Top Bar ── */
.lst-topbar { background:var(--ls-ink); color:white; height:56px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:300; border-bottom:3px solid var(--ls-amber); }
.lst-back { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.7); font-size:13px; font-weight:700; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; transition:color .2s; }
.lst-back:hover { color:white; }
.lst-topbar-title { font-family:'Fraunces',serif; font-size:16px; color:white; }
.lst-topbar-right { display:flex; align-items:center; gap:8px; font-size:12px; color:rgba(255,255,255,.45); font-weight:600; }

/* ── Hero ── */
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

/* ── Grade Band Tabs ── */
.lst-tabs-wrap { background:white; border-bottom:2px solid var(--ls-border); position:sticky; top:56px; z-index:200; box-shadow:var(--ls-shadow-sm); }
.lst-tabs { max-width:1100px; margin:0 auto; padding:0 48px; display:flex; }
.lst-tab { padding:18px 28px; font-size:14px; font-weight:700; cursor:pointer; border:none; background:none; font-family:inherit; color:var(--ls-muted); border-bottom:3px solid transparent; transition:all .2s; display:flex; flex-direction:column; align-items:flex-start; gap:2px; white-space:nowrap; }
.lst-tab:hover { color:var(--ls-ink); background:rgba(30,40,32,.02); }
.lst-tab.active { color:var(--ls-amber); border-bottom-color:var(--ls-amber); }
.lst-tab-sub { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); }
.lst-tab.active .lst-tab-sub { color:var(--ls-amber); }

/* ── Filter Chips ── */
.lst-filter-wrap { max-width:1100px; margin:28px auto 0; padding:0 48px; }
.lst-filter-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.lst-filter-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); margin-right:4px; }
.lst-chip { padding:7px 15px; border:1.5px solid var(--ls-border); border-radius:50px; font-size:12px; font-weight:700; cursor:pointer; background:white; color:var(--ls-ink-soft); font-family:inherit; transition:all .2s; white-space:nowrap; }
.lst-chip:hover { border-color:var(--ls-amber); color:var(--ls-amber); }
.lst-chip.active { background:var(--ls-amber); border-color:var(--ls-amber); color:white; }
.lst-result-meta { font-size:12px; color:var(--ls-muted); margin-left:auto; font-weight:600; }

/* ── Activity Cards Grid ── */
.lst-grid { max-width:1100px; margin:24px auto 0; padding:0 48px 40px; display:flex; flex-direction:column; gap:20px; }

/* ── Activity Card ── */
.lst-card { background:white; border-radius:var(--ls-r); border:1.5px solid var(--ls-border); box-shadow:var(--ls-shadow-sm); overflow:hidden; transition:box-shadow .25s,border-color .25s; }
.lst-card:hover { box-shadow:var(--ls-shadow-md); }
.lst-card.expanded { border-color:var(--ls-amber); box-shadow:var(--ls-shadow-md); }
.lst-card-accent { height:5px; }

.lst-card-header { padding:22px 26px; display:flex; align-items:flex-start; gap:16px; cursor:pointer; user-select:none; }
.lst-card-header:hover { background:rgba(30,40,32,.015); }
.lst-card-num { width:42px; height:42px; border-radius:12px; background:var(--ls-sand); display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:var(--ls-amber); flex-shrink:0; border:1px solid var(--ls-border); }
.lst-card-icon { font-size:22px; flex-shrink:0; margin-top:1px; }
.lst-card-meta-block { flex:1; }
.lst-card-title { font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--ls-ink); margin-bottom:5px; line-height:1.25; }
.lst-card-badges { display:flex; gap:7px; flex-wrap:wrap; align-items:center; }
.lst-badge { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
.lst-badge-theme { background:var(--ls-amber-pale); color:var(--ls-amber); }
.lst-badge-grade { background:var(--ls-sage-pale); color:var(--ls-forest); }
.lst-badge-time { background:rgba(30,40,32,.05); color:var(--ls-muted); }
.lst-badge-format { background:#EAF4FA; color:#2980B9; }
.lst-card-obj { font-size:13px; color:var(--ls-muted); margin-top:7px; line-height:1.6; max-width:640px; }
.lst-card-chevron { font-size:14px; color:var(--ls-muted); transition:transform .25s; flex-shrink:0; margin-top:3px; }
.lst-card.expanded .lst-card-chevron { transform:rotate(90deg); }
.lst-card-print-btns { display:flex; gap:6px; align-items:center; flex-shrink:0; }
.lst-print-btn { display:flex; align-items:center; gap:5px; padding:7px 13px; border-radius:50px; font-size:11px; font-weight:700; cursor:pointer; border:none; font-family:inherit; transition:all .2s; white-space:nowrap; text-decoration:none; }
.lst-print-btn.guide { background:rgba(192,57,43,.08); color:#C0392B; border:1px solid rgba(192,57,43,.2); }
.lst-print-btn.guide:hover { background:#C0392B; color:white; }
.lst-print-btn.ws { background:rgba(41,128,185,.08); color:#2980B9; border:1px solid rgba(41,128,185,.2); }
.lst-print-btn.ws:hover { background:#2980B9; color:white; }

/* ── Expanded Body ── */
.lst-card-body { border-top:1px solid var(--ls-border); padding:28px 30px 32px; animation:lstFadeIn .3s ease; }
@keyframes lstFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* Section tabs inside card */
.lst-inner-tabs { display:flex; gap:0; border-bottom:1px solid var(--ls-border); margin-bottom:24px; overflow-x:auto; scrollbar-width:none; }
.lst-inner-tabs::-webkit-scrollbar { display:none; }
.lst-inner-tab { padding:10px 18px; font-size:13px; font-weight:700; cursor:pointer; border:none; background:none; font-family:inherit; color:var(--ls-muted); border-bottom:2px solid transparent; transition:all .18s; white-space:nowrap; }
.lst-inner-tab:hover { color:var(--ls-ink); }
.lst-inner-tab.active { color:var(--ls-amber); border-bottom-color:var(--ls-amber); }

/* Materials */
.lst-materials { display:flex; flex-wrap:wrap; gap:8px; }
.lst-material-tag { background:var(--ls-sand); border:1px solid var(--ls-border); padding:6px 13px; border-radius:20px; font-size:13px; color:var(--ls-ink-soft); font-weight:500; display:flex; align-items:center; gap:5px; }

/* Facilitation Steps */
.lst-phase { margin-bottom:22px; }
.lst-phase-header { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.lst-phase-time { background:var(--ls-amber); color:white; padding:3px 11px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
.lst-phase-name { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--ls-ink); }
.lst-step { display:flex; gap:10px; padding:10px 13px; border-radius:10px; margin-bottom:7px; font-size:14px; line-height:1.65; }
.lst-step.say { background:#EAF4FA; border-left:3px solid #5B9EBF; }
.lst-step.do  { background:var(--ls-sand); border-left:3px solid var(--ls-muted); }
.lst-step.tip { background:var(--ls-amber-pale); border-left:3px solid var(--ls-amber); }
.lst-step.pause { background:var(--ls-sage-pale); border-left:3px solid var(--ls-sage); }
.lst-step-icon { font-size:15px; flex-shrink:0; margin-top:1px; }
.lst-step-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; width:38px; flex-shrink:0; margin-top:3px; }
.lst-step.say .lst-step-label  { color:#2980B9; }
.lst-step.do  .lst-step-label  { color:var(--ls-muted); }
.lst-step.tip .lst-step-label  { color:var(--ls-amber); }
.lst-step.pause .lst-step-label{ color:var(--ls-sage); }
.lst-step-text { flex:1; color:var(--ls-ink-soft); }
.lst-step.say .lst-step-text { font-style:italic; color:var(--ls-ink); }

/* Debrief */
.lst-debrief-item { border:1px solid var(--ls-border); border-radius:12px; padding:16px 18px; margin-bottom:10px; }
.lst-debrief-q { font-size:15px; font-weight:700; color:var(--ls-ink); margin-bottom:6px; }
.lst-debrief-note { font-size:13px; color:var(--ls-muted); line-height:1.65; display:flex; gap:8px; }
.lst-debrief-note::before { content:'💡'; flex-shrink:0; }

/* Watch out for */
.lst-watch-item { display:flex; gap:12px; padding:13px 16px; background:#FDF0EA; border-radius:10px; margin-bottom:8px; font-size:14px; color:var(--ls-ink-soft); line-height:1.6; border-left:3px solid #E8845A; }
.lst-watch-item::before { content:'⚠️'; flex-shrink:0; }

/* Variations */
.lst-variation-item { display:flex; gap:12px; padding:12px 15px; background:var(--ls-sage-pale); border-radius:10px; margin-bottom:7px; font-size:14px; color:var(--ls-ink-soft); line-height:1.6; }
.lst-variation-tag { font-size:11px; font-weight:700; color:var(--ls-forest); text-transform:uppercase; letter-spacing:.8px; white-space:nowrap; margin-top:2px; }

/* Worksheet (screen preview) */
.lst-ws-preview { background:var(--ls-sand); border-radius:14px; padding:28px; }
.lst-ws-section { background:white; border-radius:12px; padding:20px 22px; margin-bottom:14px; border:1px solid var(--ls-border); }
.lst-ws-section-title { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--ls-ink); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.lst-ws-prompt { font-size:14px; color:var(--ls-ink-soft); margin-bottom:8px; line-height:1.65; }
.lst-ws-lines { border-bottom:1.5px dotted rgba(30,40,32,.2); height:28px; margin-bottom:6px; width:100%; }
.lst-ws-box { border:1.5px dotted rgba(30,40,32,.2); border-radius:8px; min-height:70px; width:100%; margin-bottom:8px; }

/* ── PRINT OVERLAY ── */
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

/* FACILITATOR GUIDE print doc styles */
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
.lstp-step-lbl { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; width:34px; flex-shrink:0; margin-top:3px; }
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

/* STUDENT WORKSHEET print doc styles */
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

/* ── @media print ── */
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

// ─── ACTIVITY DATA ────────────────────────────────────────────────────────────

const ACTIVITIES = [

  // ── 1. The Feelings Iceberg ──────────────────────────────────────────────
  {
    id: 'iceberg', number: 1, icon: '🧊',
    title: 'The Feelings Iceberg',
    theme: 'Self-Awareness & Emotional Intelligence',
    themeShort: 'Self-Awareness',
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Individual', 'Pairs', 'Full class'],
    color: '#7C6FA0', colorPale: '#F0EDF8',
    guidePdf: '/resources/lifeskills/thefeelingsiceberg/THE FEELINGS ICEBERG_ Exploring Our Emotions (Grade 5–7).pdf',
    worksheetPdf: '/resources/lifeskills/thefeelingsiceberg/The Feelings Iceberg Worksheet.pdf',
    objective: "Students will distinguish between surface emotions (what others see) and underlying feelings (what's really happening inside), and begin to map their own emotional landscape beneath the waterline.",
    materials: ["Whiteboard & marker", "Iceberg worksheet (one per student)", "Coloured pencils or pens", "Small slips of paper"],
    phases: [
      {
        time: '0–5 min', phase: 'Hook',
        steps: [
          { type: 'do', text: "Ask students to close their eyes briefly." },
          { type: 'say', text: "\"Think about the last time you got really angry — at a friend, a sibling, anyone. Picture it. Now: what did the other person actually SEE? What did your anger look like from the outside?\"" },
          { type: 'do', text: "Take 3–4 answers. Write them on the board: went quiet, shouted, face went red, slammed door." },
          { type: 'say', text: "\"Interesting. Now here is my question — was anger the ONLY thing you were feeling? Or was something else going on underneath?\"" },
          { type: 'tip', text: "Keep this light and curious. Do not push for specific answers yet — just plant the question." },
        ]
      },
      {
        time: '5–12 min', phase: 'Concept Introduction',
        steps: [
          { type: 'do', text: "Draw a simple iceberg on the board: a small tip above a wavy blue line, a large mass below. Label the tip 'What people SEE' and below the line 'What is REALLY happening.'" },
          { type: 'say', text: "\"An iceberg has a tiny visible tip — maybe 10% — and a massive hidden section below the waterline. Our emotions work exactly the same way.\"" },
          { type: 'say', text: "\"What might be hiding under anger?\" Build a word cloud below the waterline as students call out: fear, embarrassment, loneliness, feeling unheard, jealousy, hurt." },
          { type: 'say', text: "\"What about sadness? What could be under that?\" Add more. Under silence? Under nervous laughter?" },
        ]
      },
      {
        time: '12–22 min', phase: 'Individual Reflection',
        steps: [
          { type: 'do', text: "Distribute iceberg worksheets. Ask students to draw their own if no worksheet is available." },
          { type: 'say', text: "\"Think of one recent moment where you felt a strong emotion. Write what you SHOWED in the tip. Then go below the waterline and write what was ACTUALLY happening inside. Be honest — this is just for you.\"" },
          { type: 'tip', text: "Have a parking lot — a jar or envelope where they can write privately and pass to you. Acknowledge it aloud: 'If something comes up that feels too big for today, write it down and give it to me privately.'" },
        ]
      },
      {
        time: '22–30 min', phase: 'Pair Activity — Iceberg Guessing',
        steps: [
          { type: 'say', text: "\"Now I want you to pair up. Share ONLY your above-waterline with your partner — just tell them the situation and what you showed. Do not tell them what is below the line yet.\"" },
          { type: 'say', text: "\"Your partner's job is to GUESS what might be below your waterline. Then you tell them how close they were.\"" },
          { type: 'do', text: "Give pairs 5 minutes. Each person shares once." },
        ]
      },
      {
        time: '30–35 min', phase: 'Full Class Debrief',
        steps: [
          { type: 'say', text: "\"Let's come back together. I have a few questions for the whole group.\"" },
          { type: 'do', text: "Use the debrief questions below. Aim for at least 3 of the 5." },
        ]
      },
    ],
    debrief: [
      { q: "\"Was it easy or difficult to look below your waterline? What made it difficult?\"", note: "Listen for: 'I didn't know what the feeling was', 'I was embarrassed'. Validate all of these." },
      { q: "\"Has someone ever responded to just your tip and completely missed what was really going on? How did that feel?\"", note: "This is usually the question that creates the most resonance." },
      { q: "\"When your partner guessed your below-waterline feeling correctly, what happened inside you?\"", note: "Listen for: 'I felt understood', 'surprised', 'relieved'. Connect this to empathy." },
    ],
    watchOutFor: [
      "A student who discloses something serious during the below waterline writing — abuse, family crisis, self-harm ideation. Have your referral process ready.",
      "Students who write nothing. Do not force participation. Let them observe.",
    ],
    variations: [
      { tag: 'Grade 5', text: "Use a provided emotion word bank (20–25 words) rather than asking students to generate." },
      { tag: 'Grade 7', text: "Add a second iceberg for a character from a film, book, or real situation they know." },
    ],
    worksheet: {
      title: 'The Feelings Iceberg',
      intro: 'Our emotions are like icebergs — a small visible tip and a huge hidden part below the waterline. Today, map your own.',
      sections: [
        {
          title: '🧊 My Iceberg',
          prompts: [
            { label: 'The situation I am thinking of:', lines: 2 },
            { label: 'ABOVE THE WATERLINE — What people saw:', lines: 2 },
            { label: 'BELOW THE WATERLINE — What I was really feeling inside:', lines: 4, note: 'This is just for you. Go as deep as you can.' },
          ]
        },
        {
          title: '🤔 Reflection Questions',
          prompts: [
            { label: 'Was it easy or hard to look below the waterline? What made it difficult?', lines: 3 },
            { label: 'One thing I want others to understand about my below-waterline feelings:', lines: 2 },
          ]
        }
      ]
    }
  },

  // ── 2. The Telephone Breakdown ──────────────────────────────────────────
  {
    id: 'telephone', number: 2, icon: '📞',
    title: 'The Telephone Breakdown',
    theme: 'Communication & Active Listening',
    themeShort: 'Communication',
    grade: '5–7', gradeKey: 'lower',
    duration: '30 min',
    formats: ['Full class game', 'Small groups', 'Pairs'],
    color: '#5B9EBF', colorPale: '#EAF4FA',
    objective: "Students will experience how messages distort through communication chains, identify WHY distortion happens, and practise two concrete strategies for clearer communication.",
    materials: ["3 pre-written message cards", "Observation checklist", "Whiteboard to record Original vs Final messages"],
    phases: [
      {
        time: '0–5 min', phase: 'Setup & First Round (No Rules)',
        steps: [
          { type: 'do', text: "Ask 8 students to form a line facing sideways. Give the first student Message Card 1. Tell them: 'Whisper this once only. No repeats.'" },
          { type: 'do', text: "While the line plays, give remaining students the Observation Checklist." },
          { type: 'do', text: "Once the message reaches the end, ask the last student to say it aloud. Write it on the board." },
        ]
      },
      {
        time: '5–10 min', phase: 'Second Round (With Listening Rules)',
        steps: [
          { type: 'say', text: "\"Let's try again with Message Card 2 — but this time, we add three rules: 1. Ask ONE clarifying question. 2. Repeat back what you heard. 3. Flag if you are unsure.\"" },
          { type: 'do', text: "Run the second round. Observe how the message changes. Write the final message on the board." },
        ]
      },
      {
        time: '10–18 min', phase: 'Analysis',
        steps: [
          { type: 'say', text: "\"Let's figure out WHY messages change. What were people doing — or NOT doing — that caused the distortion?\"" },
          { type: 'do', text: "Take answers and write them in two columns: What broke it and What fixed it." },
        ]
      },
      {
        time: '18–26 min', phase: 'Pair Practice',
        steps: [
          { type: 'do', text: "Pair students. Student A reads a scenario card aloud once. Student B must: clarify, reflect back, then respond." },
          { type: 'do', text: "Swap roles. Run twice each." },
        ]
      },
      {
        time: '26–30 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use the debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "\"Where exactly in the line did the message change most? What was happening at that point?\"", note: "Students usually identify: a long complex part, or a gap filled with assumption." },
      { q: "\"Can you think of a real situation — at home or with friends — where this breakdown happened?\"", note: "Fights between friends over 'He said she said' are common examples." },
    ],
    watchOutFor: [
      "Students intentionally corrupting the message for laughs. Redirect warmly.",
      "Pairs who just chat instead of following the structured practice.",
    ],
    variations: [
      { tag: 'Grade 5', text: "Use very short, simple messages in Round 1." },
      { tag: 'Large class', text: "Run two parallel lines of 8 simultaneously. The rest observe." },
    ],
    worksheet: {
      title: 'The Telephone Breakdown',
      intro: 'Today we discovered how messages change as they travel.',
      sections: [
        {
          title: '👁️ Observer Checklist',
          twoCol: true,
          colTitles: ['Round 1 — What I noticed', 'Round 2 — What changed'],
          prompts: [
            { label: 'Where did the message change most?', lines: 2 },
          ]
        },
        {
          title: '💬 My Commitment',
          prompts: [
            { label: 'One communication situation in my life where a telephone breakdown has happened:', lines: 2 },
            { label: 'Which of the three skills would help most in that situation, and why?', lines: 2 },
          ]
        }
      ]
    }
  },

  // ── 3. Walk a Mile — Persona Cards ──────────────────────────────────────
  {
    id: 'persona', number: 3, icon: '👟',
    title: 'Walk a Mile — Persona Cards',
    theme: 'Empathy & Perspective Taking',
    themeShort: 'Empathy',
    grade: '6–8', gradeKey: 'lower',
    duration: '40 min',
    formats: ['Individual reflection', 'Pairs', 'Full class'],
    color: '#E8845A', colorPale: '#FDF0EA',
    objective: "Students will practise inhabiting a perspective genuinely different from their own, articulate what that person might feel and need, and identify one bias or assumption they held.",
    materials: ["Persona Cards", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'Set Up',
        steps: [
          { type: 'say', text: "\"Today we are going to try to walk a mile in someone else's shoes. You will each get a persona — a real type of student. For 20 minutes, you are that person.\"" },
          { type: 'do', text: "Shuffle and distribute Persona Cards face down. Students flip on your signal." },
        ]
      },
      {
        time: '5–8 min', phase: 'Reading and In-Role Thinking',
        steps: [
          { type: 'do', text: "Students read their persona card silently. Give them 3 minutes." },
          { type: 'say', text: "\"Now answer the questions on the back of the card AS that person. Not what YOU would do — what THEY would do.\"" },
        ]
      },
      {
        time: '8–22 min', phase: 'Individual In-Role Reflection',
        steps: [
          { type: 'do', text: "Students answer the in-role questions on their worksheet." },
          { type: 'do', text: "Circulate. Prompt with: 'Go deeper — what is the emotional experience?'" },
        ]
      },
      {
        time: '22–33 min', phase: 'Paired Conversation In-Role',
        steps: [
          { type: 'do', text: "Pair students whose personas are different from each other." },
          { type: 'say', text: "\"You are going to have a 5-minute conversation in role. The topic: your school is planning a new policy. Tell each other what that policy should be.\"" },
        ]
      },
      {
        time: '33–40 min', phase: 'Full Class Debrief — Out of Role',
        steps: [
          { type: 'say', text: "\"Come out of role now. You are yourselves again. Let's talk about what just happened.\"" },
          { type: 'do', text: "Use the debrief questions." },
        ]
      },
    ],
    debrief: [
      { q: "\"What was the hardest part of staying in your persona's perspective?\"", note: "This is usually: 'I kept thinking what I would do'." },
      { q: "\"What did you discover about your persona that you would not have guessed just looking at them from the outside?\"", note: "Listen for the insight that internal experience is rich and complicated." },
    ],
    watchOutFor: [
      "A student who gets a persona very similar to their own difficult situation.",
      "Students who play the persona superficially or with mockery. Redirect: 'We are trying to genuinely understand, not perform.'",
    ],
    variations: [
      { tag: 'Grade 6', text: "Reduce the in-role questions to 3. Skip the paired in-role conversation." },
      { tag: 'Short session (30 min)', text: "Skip the paired conversation. Go from individual reflection to group debrief." },
    ],
    worksheet: {
      title: 'Walk a Mile — Persona Reflection',
      intro: 'Answer questions 1–5 IN ROLE. Answer questions 6–8 as yourself.',
      sections: [
        {
          title: '👟 In Role',
          prompts: [
            { label: '1. What does a typical school day feel like for you?', lines: 3 },
            { label: '2. What do you worry about most?', lines: 3 },
          ]
        },
        {
          title: '🪞 As Yourself',
          prompts: [
            { label: '3. What surprised me most about my persona\'s inner experience?', lines: 3 },
            { label: '4. One assumption I had before this activity that I want to question:', lines: 2 },
          ]
        }
      ]
    }
  },

  // ── 4. The Pressure Bottle ───────────────────────────────────────────────
  {
    id: 'pressure', number: 4, icon: '🧴',
    title: 'The Pressure Bottle',
    theme: 'Stress & Anger Management',
    themeShort: 'Stress & Anger',
    grade: '7–9', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Demonstration', 'Individual', 'Pairs'],
    color: '#C0392B', colorPale: '#FADBD8',
    objective: "Students will map their own personal stress cycle — triggers, build-up signs, explosion patterns, and release valves.",
    materials: ["One plastic bottle with cap (shaken up)", "Worksheet", "Whiteboard"],
    phases: [
      {
        time: '0–5 min', phase: 'The Demonstration',
        steps: [
          { type: 'do', text: "Secretly shake the bottle vigorously. Hold it behind your back." },
          { type: 'do', text: "Begin to slowly open the cap. The pressure releases gradually. Nothing spills." },
          { type: 'say', text: "\"Our stress works exactly the same way. The question isn't whether the pressure builds — it always does. The question is whether we release it slowly, or suddenly all at once.\"" },
        ]
      },
      {
        time: '5–13 min', phase: 'Mapping the Stress Cycle',
        steps: [
          { type: 'do', text: "Draw a simple diagram on the board: A bottle." },
          { type: 'say', text: "\"Let's think about what fills up our bottle. What are the WARNING SIGNS that your bottle is getting full?\"" },
          { type: 'say', text: "\"And what does YOUR explosion look like? What happens when the cap blows?\"" },
        ]
      },
      {
        time: '13–23 min', phase: 'Individual Mapping',
        steps: [
          { type: 'do', text: "Distribute the worksheet. Students map their own pressure bottle." },
          { type: 'say', text: "\"The bottom section — release valves — is the most important one. Write down things that actually help YOU let off pressure gradually.\"" },
        ]
      },
      {
        time: '23–30 min', phase: 'Pair Share',
        steps: [
          { type: 'say', text: "\"Pair up. Share ONE of your warning signs and ONE of your release valves.\"" },
          { type: 'do', text: "Give 5 minutes. Each person shares once." },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use debrief questions. End with the commitment." },
        ]
      },
    ],
    debrief: [
      { q: "\"Which part of your bottle was easiest to identify? Which was hardest, and why?\"", note: "Most students find release valves hardest — because they haven't been taught them." },
      { q: "\"What makes it hard to use your release valves when you are actually in the high-pressure moment?\"", note: "Listen for: 'I forget', 'It feels fake'. Validate this." },
    ],
    watchOutFor: [
      "A student whose explosion pattern involves self-harm. Follow up privately.",
      "Students who say nothing is a stressor — they may be performing stoicism.",
    ],
    variations: [
      { tag: 'Grade 7', text: "Focus on physical release valves only: breathing, movement." },
      { tag: 'Short session', text: "Cut the pair share. Go from individual mapping straight to debrief." },
    ],
    worksheet: {
      title: 'My Pressure Bottle',
      intro: 'Map your own stress cycle below. Be honest — this is a tool for YOU.',
      sections: [
        {
          title: '🔧 My Shakers (What fills my bottle)',
          prompts: [{ label: 'Write the things that build pressure for you:', lines: 3 }]
        },
        {
          title: '⚠️ My Warning Signs',
          twoCol: true,
          colTitles: ['In my BODY I notice:', 'In my BEHAVIOUR I notice:'],
          prompts: []
        },
        {
          title: '🌿 My Release Valves',
          prompts: [
            { label: 'Things that help me release pressure BEFORE the explosion:', lines: 3 },
            { label: 'The release valve I will commit to using this week:', lines: 1 },
          ]
        }
      ]
    }
  },

  // ── 11. The Apology Anatomy ─────────────────────────────────────────────
  {
    id: 'apology', number: 11, icon: '🩹',
    title: 'The Apology Anatomy',
    theme: 'Relationship Skills & Empathy',
    themeShort: 'Relationship Skills',
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Full class', 'Pairs'],
    color: '#E67E22', colorPale: '#FDEDEC',
    objective: "Students will identify the difference between a fake apology and a real apology, and practice the four steps of a genuine apology to repair relationships.",
    materials: ["Whiteboard", "Apology Anatomy worksheets"],
    phases: [
      {
        time: '0–5 min', phase: 'The Fake Apology',
        steps: [
          { type: 'say', text: "\"We have all heard fake apologies. Things like 'I am sorry you feel that way' or 'I am sorry, but you started it'. How do those make you feel?\"" },
          { type: 'do', text: "Collect answers on the board: angry, ignored, frustrated." },
          { type: 'say', text: "\"A real apology is hard. It takes courage. Today we will learn the 4 parts of a real apology that actually fixes a broken relationship.\"" }
        ]
      },
      {
        time: '5–15 min', phase: 'The Four Steps',
        steps: [
          { type: 'do', text: "Write the 4 steps on the board: 1. I am sorry for... 2. It was wrong because... 3. Next time I will... 4. Will you forgive me?" },
          { type: 'say', text: "\"Step 2 is the magic step. If you can explain WHY it was wrong, the other person knows you actually understand the harm you caused.\"" },
          { type: 'do', text: "Give an example: 'I am sorry for breaking your pen. It was wrong because I was careless with your things. Next time I will ask before borrowing. Will you forgive me?'" }
        ]
      },
      {
        time: '15–25 min', phase: 'Pair Practice',
        steps: [
          { type: 'do', text: "Distribute worksheets. Have students work in pairs to rewrite the 'Fake Apologies' on the sheet into 'Real Apologies' using the 4 steps." },
          { type: 'tip', text: "Walk around and help pairs struggling with Step 2 (the 'Why')." }
        ]
      },
      {
        time: '25–35 min', phase: 'Debrief',
        steps: [
          { type: 'say', text: "\"Which of the 4 steps is the hardest to say out loud?\"" },
          { type: 'say', text: "\"Does saying 'Will you forgive me' mean the person HAS to forgive you right away?\" (No, forgiveness takes time)." }
        ]
      }
    ],
    debrief: [
      { q: "\"Why do you think people give fake apologies instead of real ones?\"", note: "Listen for: pride, fear of getting in trouble, not wanting to admit fault." },
      { q: "\"How does it feel when someone gives you a full, real 4-step apology?\"", note: "Listen for: respected, valued, ready to move on." }
    ],
    watchOutFor: [
      "Students using the pair practice to mock each other. Ensure the scenarios are fictional and structured."
    ],
    variations: [
      { tag: 'Grade 5', text: "Focus heavily on Step 3 (Next time I will...) to make it actionable for younger kids." },
    ],
    worksheet: {
      title: 'The Apology Anatomy',
      intro: 'A real apology has four parts. Practice turning fake apologies into real ones.',
      sections: [
        {
          title: '🩹 The 4 Steps',
          prompts: [
            { label: '1. I am sorry for...', lines: 0 },
            { label: '2. It was wrong because...', lines: 0 },
            { label: '3. Next time I will...', lines: 0 },
            { label: '4. Will you forgive me?', lines: 0 }
          ]
        },
        {
          title: '🛠️ Fix the Fake Apology',
          prompts: [
            { label: 'Fake: "I am sorry if you got mad when I laughed at you."', lines: 0 },
            { label: 'Write the REAL apology:', lines: 4 }
          ]
        }
      ]
    }
  },

  // ── 12. Circle of Control ───────────────────────────────────────────────
  {
    id: 'control', number: 12, icon: '⭕',
    title: 'Circle of Control',
    theme: 'Anxiety Management',
    themeShort: 'Anxiety',
    grade: '6–8', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Individual', 'Full class'],
    color: '#9B59B6', colorPale: '#F4ECF7',
    objective: "Students will map their worries into 'Control', 'Influence', and 'Concern' categories to reduce feelings of overwhelm and anxiety.",
    materials: ["Whiteboard", "Circle of Control Worksheets", "Sticky notes"],
    phases: [
      {
        time: '0–10 min', phase: 'The Worry Brain Dump',
        steps: [
          { type: 'do', text: "Hand out sticky notes. Ask students to write down 3 things they are currently worried or stressed about (one per note)." },
          { type: 'say', text: "\"Anxiety happens when our brain tries to control things it actually cannot control. Today, we are going to sort our worries to calm our brains down.\"" }
        ]
      },
      {
        time: '10–20 min', phase: 'Drawing the Circles',
        steps: [
          { type: 'do', text: "Draw three concentric circles on the board. Inner = Control. Middle = Influence. Outer = Concern (Cannot Control)." },
          { type: 'say', text: "\"Inner circle: What I can 100% control (my words, my effort). Middle: What I can influence but not control (my grades, my friendships). Outer: What I cannot control at all (the weather, what other people think of me).\"" },
          { type: 'do', text: "Take a few anonymous sticky notes and ask the class where to place them on the board." }
        ]
      },
      {
        time: '20–30 min', phase: 'Personal Mapping',
        steps: [
          { type: 'do', text: "Students use their worksheets to map their own sticky notes into their personal circles." },
          { type: 'say', text: "\"Look at the worries in your outer circle. Your job is to practice letting those go, because worrying about them will not change them.\"" }
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Use the debrief questions to close the session." }
        ]
      }
    ],
    debrief: [
      { q: "\"Which circle had the most items in it for you?\"", note: "Often students find most of their worries are in the outer circle." },
      { q: "\"How does it feel to physically move a worry into the 'Cannot Control' circle?\"", note: "Many report a sense of relief or release." }
    ],
    watchOutFor: [
      "Students confusing 'Influence' with 'Control'. Remind them that if it involves another person's reaction, it is only Influence."
    ],
    variations: [
      { tag: 'High Anxiety Groups', text: "Do a deep breathing exercise immediately after the mapping to physically release the outer circle worries." }
    ],
    worksheet: {
      title: 'My Circle of Control',
      intro: 'Sort your worries to help your brain focus on what actually matters.',
      sections: [
        {
          title: '⭕ My Circles',
          prompts: [
            { label: 'What I CAN Control (Inner Circle):', lines: 3 },
            { label: 'What I can INFLUENCE (Middle Circle):', lines: 3 },
            { label: 'What I CANNOT Control (Outer Circle - Let it go):', lines: 3 }
          ]
        }
      ]
    }
  },

  // ── 13. The Rumour Filter ───────────────────────────────────────────────
  {
    id: 'rumour', number: 13, icon: '🗣️',
    title: 'The Rumour Filter',
    theme: 'Social Awareness & Empathy',
    themeShort: 'Social Awareness',
    grade: '5–7', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Small groups', 'Full class'],
    color: '#3498DB', colorPale: '#EBF5FB',
    objective: "Students will apply the 'THINK' filter to gossip and rumours to understand the harm caused by spreading unverified information.",
    materials: ["Whiteboard", "THINK Filter handouts"],
    phases: [
      {
        time: '0–10 min', phase: 'The Toothpaste Demo',
        steps: [
          { type: 'do', text: "Bring a tube of toothpaste and a paper plate. Squeeze all the toothpaste onto the plate." },
          { type: 'say', text: "\"Can I have a volunteer put this toothpaste back in the tube?\" (They cannot)." },
          { type: 'say', text: "\"Rumours are exactly like this. Once the words are out, you can never take them back, and they leave a mess. Today we learn how to stop the squeeze.\"" }
        ]
      },
      {
        time: '10–20 min', phase: 'The THINK Filter',
        steps: [
          { type: 'do', text: "Write THINK on the board. T=True? H=Helpful? I=Inspiring? N=Necessary? K=Kind?" },
          { type: 'say', text: "\"Before you repeat something you heard, run it through this filter. If it fails the filter, the rumour stops with you.\"" },
          { type: 'do', text: "Read a scenario: 'You heard Maya failed her math test because she was crying in the bathroom.' Run it through THINK." }
        ]
      },
      {
        time: '20–30 min', phase: 'Group Scenarios',
        steps: [
          { type: 'do', text: "Put students in groups of 4. Give them scenario cards with common school rumours." },
          { type: 'say', text: "\"Your group must decide: Does this pass the THINK filter? If not, what is the exact script you will use to stop the rumour when someone tells you?\"" }
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss the difficulty of standing up to gossip in real life." }
        ]
      }
    ],
    debrief: [
      { q: "\"Why is it so tempting to pass on a rumour?\"", note: "Listen for: wanting to fit in, wanting attention, it feels exciting." },
      { q: "\"What is a brave, simple phrase you can use to stop a rumour without sounding like a teacher?\"", note: "Examples: 'I don't really care about that', or 'Let's not talk about them when they aren't here.'" }
    ],
    watchOutFor: [
      "Students using real current school gossip during the exercise. Shut it down immediately."
    ],
    variations: [
      { tag: 'Grade 7', text: "Apply the THINK filter specifically to WhatsApp forwards and social media comments." }
    ],
    worksheet: {
      title: 'The Rumour Filter (THINK)',
      intro: 'Before you speak or type, run it through the filter.',
      sections: [
        {
          title: '🔍 The Filter',
          prompts: [
            { label: 'T - Is it True? (Do I have proof?)', lines: 1 },
            { label: 'H - Is it Helpful?', lines: 1 },
            { label: 'I - Is it Inspiring?', lines: 1 },
            { label: 'N - Is it Necessary?', lines: 1 },
            { label: 'K - Is it Kind?', lines: 1 }
          ]
        },
        {
          title: '🛡️ My Script',
          prompts: [
            { label: 'When someone tries to tell me gossip, I will say:', lines: 2 }
          ]
        }
      ]
    }
  },

  // ── 14. My Strengths Shield ───────────────────────────────────────────────
  {
    id: 'shield', number: 14, icon: '🛡️',
    title: 'My Strengths Shield',
    theme: 'Self-Awareness & Confidence',
    themeShort: 'Self-Awareness',
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
          { type: 'say', text: "\"When we talk about strengths, we often think of being good at math or fast at running. But character strengths are different. They are who you ARE, not just what you DO.\"" },
          { type: 'do', text: "Write examples on the board: Kindness, Bravery, Humor, Curiosity, Honesty, Teamwork, Perseverance." },
          { type: 'say', text: "\"Every single person in this room has at least three of these super powers.\"" }
        ]
      },
      {
        time: '10–25 min', phase: 'Designing the Shield',
        steps: [
          { type: 'do', text: "Hand out the shield templates divided into 4 quadrants." },
          { type: 'say', text: "\"Quadrant 1: Draw or write your greatest character strength. Quadrant 2: A strength someone else sees in you. Quadrant 3: A time you used a strength to help someone. Quadrant 4: A strength you want to grow.\"" },
          { type: 'do', text: "Play music and give them time to draw and write." }
        ]
      },
      {
        time: '25–35 min', phase: 'Shield Sharing',
        steps: [
          { type: 'do', text: "In pairs, students share their shields." },
          { type: 'say', text: "\"Partners, your job is to listen and say: 'I can definitely see that strength in you because...'\"" }
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
      { q: "\"Was it hard to choose a strength for yourself? Why do we focus more on our weaknesses?\"", note: "Normalise that human brains are wired to see the negative." },
      { q: "\"How can you use the strength in Quadrant 1 to help you get through a difficult exam week?\"", note: "Connect abstract strengths to practical school challenges." }
    ],
    watchOutFor: [
      "Students who say 'I don't have any strengths'. Sit with them and offer observations: 'I noticed you helped Maya yesterday. That shows kindness.'"
    ],
    variations: [
      { tag: 'Art-focused class', text: "Provide magazines for a collage-style shield instead of drawing." }
    ],
    worksheet: {
      title: 'My Strengths Shield',
      intro: 'Design your personal crest based on who you are inside.',
      sections: [
        {
          title: '🛡️ Shield Planning',
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

  // ── 15. The Priority Jar ───────────────────────────────────────────────
  {
    id: 'priority', number: 15, icon: '⏳',
    title: 'The Priority Jar',
    theme: 'Time Management',
    themeShort: 'Time Management',
    grade: '6–8', gradeKey: 'lower',
    duration: '35 min',
    formats: ['Demonstration', 'Individual'],
    color: '#27AE60', colorPale: '#E9F7EF',
    objective: "Students will categorise their daily tasks into Rocks, Pebbles, and Sand to understand prioritisation and reduce feeling overwhelmed.",
    materials: ["A clear jar, big rocks, small pebbles, sand (or a video of the experiment)", "Priority Jar Worksheets"],
    phases: [
      {
        time: '0–10 min', phase: 'The Visual Demo',
        steps: [
          { type: 'do', text: "If you have the physical items, try to fill the jar with sand first, then pebbles, then rocks. The rocks won't fit." },
          { type: 'say', text: "\"If we fill our time with the small stuff first, there is no room for the big, important things.\"" },
          { type: 'do', text: "Empty the jar. Put the Rocks in first, then Pebbles, then pour the Sand. It all fits." },
          { type: 'say', text: "\"When we put the big things first, the small things naturally fit around them.\"" }
        ]
      },
      {
        time: '10–20 min', phase: 'Defining Our Rocks',
        steps: [
          { type: 'say', text: "\"Rocks are your non-negotiables: sleep, family, major assignments, health. Pebbles are important but flexible: hobbies, seeing friends. Sand is the filler: scrolling social media, watching TV.\"" },
          { type: 'do', text: "Ask students to call out daily activities and categorize them as a class." }
        ]
      },
      {
        time: '20–30 min', phase: 'Personal Sorting',
        steps: [
          { type: 'do', text: "Distribute worksheets. Students list everything they do in a week, then sort them into Rocks, Pebbles, and Sand." },
          { type: 'say', text: "\"Be honest. If you are currently putting 4 hours of Sand in your jar before doing 1 hour of Rocks, write that down.\"" }
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: "Discuss the emotional impact of doing Rocks first." }
        ]
      }
    ],
    debrief: [
      { q: "\"What happens to your stress levels when you put Sand in the jar first?\"", note: "Listen for: panic, staying up late, feeling guilty." },
      { q: "\"What is one 'Rock' you have been treating like 'Sand' lately?\"", note: "Often sleep or studying." }
    ],
    watchOutFor: [
      "Students arguing that gaming is a Rock. Validate that relaxation is important, but a Rock is something essential for long-term growth and health."
    ],
    variations: [
      { tag: 'Grade 8', text: "Add an 'Energy' component. Some tasks are Rocks but drain energy; some are Pebbles but give energy." }
    ],
    worksheet: {
      title: 'The Priority Jar',
      intro: 'Sort your time so the important things fit.',
      sections: [
        {
          title: '🪨 Rocks (Must Do / Essential)',
          prompts: [
            { label: 'List 3 Rocks for this week:', lines: 3 }
          ]
        },
        {
          title: '🪨 Pebbles (Important but Flexible)',
          prompts: [
            { label: 'List 3 Pebbles:', lines: 3 }
          ]
        },
        {
          title: '⏳ Sand (Filler / Distractions)',
          prompts: [
            { label: 'My biggest Sand traps are:', lines: 2 }
          ]
        }
      ]
    }
  },

  // ── 5. The Choice Crossroads ────────────────────────────────────────────
  // (Remaining activities kept safely identical as requested)
  {
    id: 'crossroads', number: 5, icon: '🔀',
    title: 'The Choice Crossroads',
    theme: 'Decision Making & Critical Thinking',
    themeShort: 'Decision Making',
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
          { type: 'say', text: "\"Today we're going to make some difficult decisions. When I read a scenario, you move to the corner that matches your choice.\"" },
        ]
      },
      {
        time: '5–20 min', phase: 'Rounds 1 & 2',
        steps: [
          { type: 'say', text: "\"Scenario 1.\" Read scenario. \"Move to your corner.\"" },
          { type: 'do', text: "Give corners 60 seconds to discuss: 'Why did you choose this?'" },
          { type: 'say', text: "\"Now — switch. Move to the corner that is the OPPOSITE of what you just argued. Prepare arguments for this position.\"" },
        ]
      },
      {
        time: '20–30 min', phase: 'Values Mapping',
        steps: [
          { type: 'say', text: "\"Let's slow down and look underneath our choices.\"" },
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
      { q: "\"What was it like to have to argue for the OPPOSITE of what you actually believe?\"", note: "This builds cognitive flexibility." },
      { q: "\"Think of a real decision you're currently facing. Which framework step do you skip?\"", note: "Bridge from classroom to real life." },
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
          title: '🔀 My Decision Framework',
          prompts: [
            { label: 'The scenario I am working with:', lines: 2 },
            { label: 'The values driving my choice:', lines: 2 },
          ]
        }
      ]
    }
  },

  // ── 6. The Push & Stand ──────────────────────────────────────────────────
  {
    id: 'pushstand', number: 6, icon: '🧱',
    title: 'The Push & Stand',
    theme: 'Peer Pressure & Boundary Setting',
    themeShort: 'Peer Pressure',
    grade: '8–10', gradeKey: 'middle',
    duration: '35 min',
    formats: ['Physical pairs activity', 'Role-play', 'Full class'],
    color: '#8E44AD', colorPale: '#F5EEF8',
    objective: "Students will physically and verbally experience the three responses to peer pressure.",
    materials: ["Open floor space", "Scenario Cards", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'Physical Warm-Up',
        steps: [
          { type: 'say', text: "\"Stand up and find a partner. Push gently. Now stop and let the push happen. Now step to the side when they push.\"" },
          { type: 'say', text: "\"You just experienced three responses: push back, give in, step aside.\"" },
        ]
      },
      {
        time: '5–12 min', phase: 'Concept',
        steps: [
          { type: 'do', text: "Draw a table: GIVE IN | PUSH BACK | STEP ASIDE" },
          { type: 'say', text: "\"GIVE IN: peace now, resentment later. PUSH BACK: confrontation now, clarity later. STEP ASIDE: redirect without conflict.\"" },
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
      { q: "\"Which response is your default?\"", note: "Create awareness." },
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
          title: '📝 My Scripts',
          prompts: [
            { label: 'My PUSH BACK script:', lines: 2 },
            { label: 'My STEP ASIDE script:', lines: 2 },
          ]
        }
      ]
    }
  },

  // ── 7. The Two-Story House ───────────────────────────────────────────────
  {
    id: 'twohouse', number: 7, icon: '🏠',
    title: 'The Two-Story House',
    theme: 'Conflict Resolution',
    themeShort: 'Conflict Resolution',
    grade: '9–11', gradeKey: 'middle',
    duration: '40 min',
    formats: ['Pairs', 'Trio (with observer)', 'Full class'],
    color: '#16A085', colorPale: '#D5F5F0',
    objective: "Students will distinguish between positions and interests in negotiation.",
    materials: ["Conflict scenario cards", "Worksheet"],
    phases: [
      {
        time: '0–5 min', phase: 'The Metaphor',
        steps: [
          { type: 'say', text: "\"Imagine a house with two floors. Conflict works like this. Two people look at the same situation and see different things.\"" },
        ]
      },
      {
        time: '5–12 min', phase: 'Positions vs Interests',
        steps: [
          { type: 'say', text: "\"POSITION is what I SAY I want. INTEREST is what I ACTUALLY need.\"" },
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
      { q: "\"Has your experience changed after hearing the other person's interest?\"", note: "Empathy moment." },
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
          title: '🏠 My Conflict',
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

  // ── 8. The Reverse Calendar ──────────────────────────────────────────────
  {
    id: 'calendar', number: 8, icon: '📅',
    title: 'The Reverse Calendar',
    theme: 'Goal Setting & Time Management',
    themeShort: 'Goal Setting',
    grade: '9–11', gradeKey: 'middle',
    duration: '35 min',
    formats: ['Individual', 'Pairs', 'Full class'],
    color: '#27AE60', colorPale: '#D5F5E3',
    objective: "Students will apply backward planning to one goal.",
    materials: ["Blank Reverse Calendar template", "Coloured pens", "Whiteboard"],
    phases: [
      {
        time: '0–5 min', phase: 'Why Goals Fail',
        steps: [
          { type: 'say', text: "\"Most people plan forward. The most effective planners work backwards.\"" },
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
      { q: "\"Look at your first step for tomorrow. Is it ACTUALLY doable in 15 minutes?\"", note: "Practical intervention." },
    ],
    watchOutFor: [
      "Goals that are too vague.",
    ],
    variations: [
      { tag: 'Grade 11', text: "Extend to one year timeline." },
    ],
    worksheet: {
      title: 'My Reverse Calendar',
      intro: 'Start at the END.',
      sections: [
        {
          title: '📅 Working Backwards',
          prompts: [
            { label: 'End Date:', lines: 1 },
            { label: 'TOMORROW — my first step:', lines: 1 },
          ]
        }
      ]
    }
  },

  // ── 9. The Online Footprint Trial ────────────────────────────────────────
  {
    id: 'footprint', number: 9, icon: '🌐',
    title: 'The Online Footprint Trial',
    theme: 'Digital Citizenship & Online Safety',
    themeShort: 'Digital Citizenship',
    grade: '10–12', gradeKey: 'upper',
    duration: '40 min',
    formats: ['Mock trial simulation', 'Small groups', 'Full class'],
    color: '#2C3E50', colorPale: '#EAF0FB',
    objective: "Students will experience how digital content persists and affects futures.",
    materials: ["Role cards", "Evidence Packet", "Verdict slips"],
    phases: [
      {
        time: '0–5 min', phase: 'Setup',
        steps: [
          { type: 'say', text: "\"Today we are running a trial. A 14-year-old's post has resurfaced at age 17.\"" },
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
          { type: 'say', text: "\"Step out of role. What does this mean for how YOU operate online?\"" },
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
      { q: "\"Was the trial fair?\"", note: "Listen for: 'It is not fair but it is reality'." },
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
          title: '📋 Three Digital Rules',
          prompts: [
            { label: '1.', lines: 1 },
            { label: '2.', lines: 1 },
          ]
        }
      ]
    }
  },

  // ── 10. The Blind Architect ──────────────────────────────────────────────
  {
    id: 'architect', number: 10, icon: '🏗️',
    title: 'The Blind Architect',
    theme: 'Leadership & Teamwork',
    themeShort: 'Leadership',
    grade: '10–12', gradeKey: 'upper',
    duration: '35 min',
    formats: ['Teams of 4–5', 'Observation pairs', 'Full class'],
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
          { type: 'say', text: "\"Round 1: Architect TELLS builders exactly what to do.\"" },
          { type: 'do', text: "Run 10 mins. Compare results." },
        ]
      },
      {
        time: '15–25 min', phase: 'Facilitative Leadership',
        steps: [
          { type: 'say', text: "\"Round 2: Architect INVITES ideas with a new structure.\"" },
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
      { q: "\"Which leadership style produced a BETTER result?\"", note: "Answers vary. Both have a place." },
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
          title: '🪞 Reflection',
          prompts: [
            { label: 'My default leadership style is:', lines: 1 },
          ]
        }
      ]
    }
  },
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function Step({ s }) {
  const icons = { say: '💬', do: '✅', tip: '💡', pause: '⏸️' };
  const labels = { say: 'Say', do: 'Do', tip: 'Tip', pause: 'Pause' };
  return (
    <div className={`lst-step ${s.type}`}>
      <span className="lst-step-icon">{icons[s.type]}</span>
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
        <h3>📄 Facilitator Guide — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstp-header">
          <h1>{activity.icon} {activity.title}</h1>
          <div className="lstp-header-meta">
            <span>📚 {activity.theme}</span>
            <span>🎓 Grade {activity.grade}</span>
            <span>⏱ {activity.duration}</span>
            <span>👥 {activity.formats.join(' · ')}</span>
          </div>
        </div>

        <div className="lstp-section-h">🎯 Learning Objective</div>
        <div className="lstp-objective-box">{activity.objective}</div>

        <div className="lstp-section-h">🛒 Materials Needed</div>
        <div className="lstp-materials-list">
          {activity.materials.map((m, i) => <span key={i} className="lstp-material">• {m}</span>)}
        </div>

        <div className="lstp-section-h">📋 Facilitation Guide (Step by Step)</div>
        {activity.phases.map((phase, pi) => (
          <div key={pi} className="lstp-phase-block">
            <div className="lstp-phase-title">
              <span className="lstp-phase-time">{phase.time}</span>
              <span className="lstp-phase-name">{phase.phase}</span>
            </div>
            {phase.steps.map((s, si) => <PrintStep key={si} s={s} />)}
          </div>
        ))}

        <div className="lstp-section-h">💬 Debrief Questions</div>
        {activity.debrief.map((d, i) => (
          <div key={i} className="lstp-debrief-item">
            <div className="lstp-debrief-q">Q{i + 1}: {d.q}</div>
            <div className="lstp-debrief-note">Facilitator Note: {d.note}</div>
          </div>
        ))}

        <div className="lstp-section-h">⚠️ Watch Out For</div>
        {activity.watchOutFor.map((w, i) => <div key={i} className="lstp-watch">{w}</div>)}

        <div className="lstp-section-h">🔄 Variations</div>
        {activity.variations.map((v, i) => (
          <div key={i} className="lstp-variation">
            <span className="lstp-var-tag">{v.tag}</span>
            <span>{v.text}</span>
          </div>
        ))}

        <div className="lstp-footer">
          SecretSharz Life Skills Resource Library · Grade {activity.grade} · Free to reproduce for educational use · secretsharz.com
        </div>
      </div>
    </div>
  );

  if (mode === 'worksheet') return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>📝 Student Worksheet — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstw-header">
          <h1>{activity.icon} {activity.worksheet.title}</h1>
          <p>Life Skills Worksheet · Grade {activity.grade} · {activity.theme}</p>
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
          SecretSharz Life Skills Resource Library · {activity.theme} · Grade {activity.grade} · secretsharz.com
        </div>
      </div>
    </div>
  );

  return null;
}

// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
function ActivityCard({ activity, isExpanded, onToggle, onPrint }) {
  const [innerTab, setInnerTab] = useState('guide');

  const innerTabs = [
    { id: 'guide',    label: '📋 Facilitation Guide' },
    { id: 'debrief',  label: '💬 Debrief' },
    { id: 'watch',    label: '⚠️ Watch Out For' },
    { id: 'vars',     label: '🔄 Variations' },
    { id: 'worksheet', label: '📝 Worksheet Preview' },
  ];

  return (
    <div className={`lst-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="lst-card-accent" style={{ background: `linear-gradient(90deg,${activity.color},${activity.color}88)` }} />

      <div className="lst-card-header" onClick={onToggle}>
        <div className="lst-card-num">{activity.number}</div>
        <div className="lst-card-icon">{activity.icon}</div>
        <div className="lst-card-meta-block">
          <div className="lst-card-title">{activity.title}</div>
          <div className="lst-card-badges">
            <span className="lst-badge lst-badge-theme" style={{ background: `${activity.color}18`, color: activity.color }}>{activity.themeShort}</span>
            <span className="lst-badge lst-badge-grade">Grade {activity.grade}</span>
            <span className="lst-badge lst-badge-time">⏱ {activity.duration}</span>
            {activity.formats.map(f => <span key={f} className="lst-badge lst-badge-format">{f}</span>)}
          </div>
          <div className="lst-card-obj">{activity.objective}</div>
        </div>
        
        {/* Print Buttons logic — Direct Links if provided, otherwise Overlay */}
        <div className="lst-card-print-btns no-print" onClick={e => e.stopPropagation()}>
          {activity.guidePdf ? (
            <a href={activity.guidePdf} download target="_blank" rel="noreferrer" className="lst-print-btn guide" style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
              📄 Facilitator PDF
            </a>
          ) : (
            <button className="lst-print-btn guide" onClick={() => onPrint(activity, 'guide')}>
              📄 Facilitator PDF
            </button>
          )}

          {activity.worksheetPdf ? (
            <a href={activity.worksheetPdf} download target="_blank" rel="noreferrer" className="lst-print-btn ws" style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
              📝 Student Worksheet
            </a>
          ) : (
            <button className="lst-print-btn ws" onClick={() => onPrint(activity, 'worksheet')}>
              📝 Student Worksheet
            </button>
          )}
        </div>
        
        <div className="lst-card-chevron">▶</div>
      </div>

      {isExpanded && (
        <div className="lst-card-body">
          {/* Materials always visible */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ls-muted)', marginBottom: '10px' }}>🛒 Materials</div>
            <div className="lst-materials">
              {activity.materials.map((m, i) => <span key={i} className="lst-material-tag">📌 {m}</span>)}
            </div>
          </div>

          {/* Inner tabs */}
          <div className="lst-inner-tabs">
            {innerTabs.map(t => (
              <button key={t.id} className={`lst-inner-tab ${innerTab === t.id ? 'active' : ''}`} onClick={() => setInnerTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* Guide */}
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

          {/* Debrief */}
          {innerTab === 'debrief' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '16px', lineHeight: 1.6 }}>Use at least 3 of these questions. Start with #1 (surface) and work toward the deeper ones. Don't rush.</p>
              {activity.debrief.map((d, i) => (
                <div key={i} className="lst-debrief-item">
                  <div className="lst-debrief-q">Q{i + 1}: {d.q}</div>
                  <div className="lst-debrief-note">{d.note}</div>
                </div>
              ))}
            </div>
          )}

          {/* Watch out for */}
          {innerTab === 'watch' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '14px', lineHeight: 1.6 }}>These are common issues that arise with this activity. Knowing them in advance helps you facilitate with confidence.</p>
              {activity.watchOutFor.map((w, i) => <div key={i} className="lst-watch-item">{w}</div>)}
            </div>
          )}

          {/* Variations */}
          {innerTab === 'vars' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '14px', lineHeight: 1.6 }}>Adapt the activity to your specific group. Each variation is designed to fit a different context without losing the core learning.</p>
              {activity.variations.map((v, i) => (
                <div key={i} className="lst-variation-item">
                  <span className="lst-variation-tag">{v.tag}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ls-ink-soft)' }}>{v.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Worksheet preview */}
          {innerTab === 'worksheet' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '16px', lineHeight: 1.6 }}>Preview of the student worksheet. Click "Student Worksheet" above to download or print.</p>
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
  { key: 'lower',  label: 'Lower Secondary', sub: 'Grade 5–7',  emoji: '🌱' },
  { key: 'middle', label: 'Middle Secondary', sub: 'Grade 8–10', emoji: '🌿' },
  { key: 'upper',  label: 'Senior Secondary', sub: 'Grade 11–12',emoji: '🌳' },
];

const ALL_THEMES = ['All', ...Array.from(new Set(ACTIVITIES.map(a => a.themeShort)))];

export default function LifeSkillsTrainer({ navigate, onBack }) {
  const [activeTab,    setActiveTab]    = useState('lower');
  const [themeFilter,  setThemeFilter]  = useState('All');
  const [expandedId,   setExpandedId]   = useState(null);
  const [printData,    setPrintData]    = useState(null); // { activity, mode }

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
    const matchTheme = themeFilter === 'All' || a.themeShort === themeFilter;
    return matchTab && matchTheme;
  });

  const currentTabInfo = GRADE_TABS.find(t => t.key === activeTab);

  return (
    <>
      {/* Print overlay (outside main page so print media query works cleanly) */}
      {printData && (
        <PrintView activity={printData.activity} mode={printData.mode} onClose={closePrint} />
      )}

      <div className="lst-page">
        {/* TOP BAR */}
        <div className="lst-topbar">
          <button className="lst-back" onClick={onBack || (() => navigate && navigate('/resources'))}>← Back to Resources</button>
          <div className="lst-topbar-title">Life Skills Trainer — Activity Bank</div>
          <div className="lst-topbar-right">10 Activities · Grade 5–12</div>
        </div>

        {/* HERO */}
        <div className="lst-hero">
          <div className="lst-hero-blob lst-hero-blob-1" />
          <div className="lst-hero-blob lst-hero-blob-2" />
          <div className="lst-hero-inner">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className="lst-hero-eyebrow">🧑‍🏫 School Counsellor Resource</div>
              <h1 className="lst-hero-h1">Life Skills Trainer<br /><em>Activity Bank</em></h1>
              <p className="lst-hero-sub">Fully elaborated, classroom-ready life skills activities for school counsellors — each with a step-by-step facilitation script, debrief guide, and printable student worksheet. Designed for 30–40 minute class periods, Grade 5 to Grade 12.</p>
              <div className="lst-hero-tags">
                <span className="lst-hero-tag">📄 Print Facilitator Guide</span>
                <span className="lst-hero-tag">📝 Print Student Worksheet</span>
                <span className="lst-hero-tag">🔓 Free to reproduce</span>
                <span className="lst-hero-tag">🇮🇳 India-relevant scenarios</span>
              </div>
            </div>
            <div className="lst-hero-right">
              <div className="lst-stat-card">
                <div className="lst-stat-num">10</div>
                <div className="lst-stat-label">Activities</div>
              </div>
              <div className="lst-stat-card">
                <div className="lst-stat-num">10</div>
                <div className="lst-stat-label">Life Skill Themes</div>
              </div>
              <div className="lst-stat-card">
                <div className="lst-stat-num">30–40</div>
                <div className="lst-stat-label">Minutes Per Session</div>
              </div>
            </div>
          </div>
        </div>

        {/* GRADE BAND TABS */}
        <div className="lst-tabs-wrap">
          <div className="lst-tabs">
            {GRADE_TABS.map(t => (
              <button key={t.key} className={`lst-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => { setActiveTab(t.key); setExpandedId(null); setThemeFilter('All'); }}>
                {t.emoji} {t.label}
                <span className="lst-tab-sub">{t.sub} · {ACTIVITIES.filter(a => a.gradeKey === t.key).length} activities</span>
              </button>
            ))}
          </div>
        </div>

        {/* FILTER CHIPS */}
        <div className="lst-filter-wrap">
          <div className="lst-filter-row">
            <span className="lst-filter-label">Theme</span>
            {ALL_THEMES.filter(t => t === 'All' || ACTIVITIES.some(a => a.gradeKey === activeTab && a.themeShort === t)).map(t => (
              <button key={t} className={`lst-chip ${themeFilter === t ? 'active' : ''}`} onClick={() => setThemeFilter(t)}>{t}</button>
            ))}
            <span className="lst-result-meta">{filtered.length} activit{filtered.length !== 1 ? 'ies' : 'y'} for {currentTabInfo?.sub}</span>
          </div>
        </div>

        {/* ACTIVITY CARDS */}
        <div className="lst-grid">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ls-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>🌱</div>
              <p style={{ fontSize: '16px', fontWeight: 600 }}>No activities match this filter. Try another theme.</p>
            </div>
          ) : (
            filtered.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isExpanded={expandedId === activity.id}
                onToggle={() => handleToggle(activity.id)}
                onPrint={handlePrint}
              />
            ))
          )}

          {/* How to use this resource */}
          <div style={{ background: 'linear-gradient(135deg,#1E2820,#2D3A24)', borderRadius: '18px', padding: '32px 36px', color: 'white', marginTop: '8px' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', marginBottom: '12px' }}>📌 How to Use This Resource</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {[
                { n: '1', title: 'Choose your grade band', desc: 'Use the tabs above to find activities designed for your class level. Each activity is calibrated for the cognitive and social development of that grade range.' },
                { n: '2', title: 'Read before class', desc: 'Open the activity card and review the full facilitation guide. Read through the SAY prompts — these are not scripts you must follow exactly, but anchors for the session.' },
                { n: '3', title: 'Print what you need', desc: 'Click "Facilitator PDF" for your session notes and "Student Worksheet" for handouts. Both are print-optimised for A4 paper.' },
                { n: '4', title: 'Follow up', desc: 'Each activity ends with a commitment or reflection. Check in with students a week later — even 5 minutes builds continuity and shows the work matters.' },
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
