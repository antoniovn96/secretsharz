/**
 * Life Skills Trainer — School Counsellor Activity Bank
 * src/resources/lifeskills/LifeSkillsTrainer.jsx
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
.lst-print-btn { display:flex; align-items:center; gap:5px; padding:7px 13px; border-radius:50px; font-size:11px; font-weight:700; cursor:pointer; border:none; font-family:inherit; transition:all .2s; white-space:nowrap; }
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
// Each activity has: metadata + facilitation phases + debrief + watchOutFor + variations + worksheet
// facilitation phases: array of { time, phase, steps: [{type:'say'|'do'|'tip'|'pause', text}] }

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
objective: "Students will distinguish between surface emotions (what others see) and underlying feelings (what's really happening inside), and begin to map their own emotional landscape beneath the waterline.",    materials: ['Whiteboard & marker', 'Iceberg worksheet (one per student)', 'Coloured pencils or pens (optional)', 'Small slips of paper for the "parking lot"'],
    phases: [
      {
        time: '0–5 min', phase: 'Hook',
        steps: [
          { type: 'do', text: 'Ask students to close their eyes briefly.' },
          { type: 'say', text: '"Think about the last time you got really angry — at a friend, a sibling, anyone. Picture it. Now: what did the other person actually SEE? What did your anger look like from the outside?"' },
          { type: 'do', text: 'Take 3–4 answers. Write them on the board: "went quiet", "shouted", "face went red", "slammed door".' },{ type: 'say', text: '"Interesting. Now here\'s my question — was anger the ONLY thing you were feeling? Or was something else going on underneath?"' },
          { type: 'tip', text: 'Keep this light and curious. Don\'t push for specific answers yet — just plant the question.' },
        ]
      },
      {
        time: '5–12 min', phase: 'Concept Introduction',
        steps: [{ type: 'do', text: 'Draw a simple iceberg on the board: a small tip above a wavy blue line, a large mass below. Label the tip "What people SEE" and below the line "What\'s REALLY happening."' }
          { type: 'say', text: '"An iceberg has a tiny visible tip — maybe 10% — and a massive hidden section below the waterline. Our emotions work exactly the same way."' },
          { type: 'say', text: '"What might be hiding under anger?" Build a word cloud below the waterline as students call out: fear, embarrassment, loneliness, feeling unheard, jealousy, hurt, disappointment, feeling unsafe.' },
          { type: 'say', text: '"What about sadness? What could be under that?" Add more. Under silence? Under nervous laughter?' },
          { type: 'tip', text: 'Model your own iceberg briefly if the group is hesitant: "Sometimes when I\'m quiet in a meeting, I\'m actually feeling nervous about saying something wrong." This normalises vulnerability.' },
        ]
      },
      {
        time: '12–22 min', phase: 'Individual Reflection',
        steps: [
          { type: 'do', text: 'Distribute iceberg worksheets. Ask students to draw their own if no worksheet is available.' },
          { type: 'say', text: '"Think of one recent moment where you felt a strong emotion — this week, or something recent. Write what you SHOWED in the tip. Then go below the waterline and write what was ACTUALLY happening inside. Be honest — this is just for you."' },
          { type: 'do', text: 'Play soft instrumental music if available. Circulate the room quietly. Prompt students privately: "Was there any fear underneath?" "Did you feel like nobody was listening?"' },
          { type: 'tip', text: 'Some students may go to very heavy places (grief, abuse, family crisis). Have a "parking lot" — a jar or envelope where they can write privately and pass to you. Acknowledge it aloud: "If something comes up that feels too big for today, write it down and give it to me privately — I will make time."' },
          { type: 'pause', text: 'Check: are most students writing? If hands are still, offer prompts on the board: "a time I got angry", "a time I went quiet", "a time I cried or nearly cried".' },
        ]
      },
      {
        time: '22–30 min', phase: 'Pair Activity — Iceberg Guessing',
        steps: [
          { type: 'say', text: '"Now I want you to pair up. Share ONLY your above-waterline with your partner — just tell them the situation and what you showed. Don\'t tell them what\'s below the line yet."' },
          { type: 'say', text: '"Your partner\'s job is to GUESS what might be below your waterline. Then you tell them how close they were."' },
          { type: 'do', text: 'Give pairs 5 minutes. Each person shares once. Encourage them to notice how it feels when someone guesses correctly.' },
          { type: 'tip', text: 'This exercise builds empathy naturally. The student guessing has to take a perspective — the student sharing experiences being "seen." Both are powerful.' },
        ]
      },
      {
        time: '30–35 min', phase: 'Full Class Debrief',
        steps: [
          { type: 'say', text: '"Let\'s come back together. I have a few questions for the whole group."' },
          { type: 'do', text: 'Use the debrief questions below. Aim for at least 3 of the 5.' },
        ]
      },
    ],
    debrief: [
      { q: '"Was it easy or difficult to look below your waterline? What made it difficult?"', note: 'Listen for: "I didn\'t know what the feeling was", "I was embarrassed", "I didn\'t want to feel it." Validate all of these.' },
      { q: '"Has someone ever responded to just your tip — your anger, your silence — and completely missed what was really going on? How did that feel?"', note: 'This is usually the question that creates the most resonance. Students often have strong answers. Don\'t rush it.' },
      { q: '"When your partner guessed your below-waterline feeling correctly, what happened inside you?"', note: 'Listen for: "I felt understood", "surprised", "relieved". Connect this to empathy.' },
      { q: '"How might knowing about icebergs change the way YOU respond to someone who\'s angry or quiet or difficult?"', note: 'This is the transfer question. The goal is for students to say something like: "Ask what\'s really going on" or "don\'t take it personally."' },
      { q: '"Is there someone in your life whose iceberg you\'d like to understand better?"', note: 'Keep this private — don\'t ask them to name the person. Just let them hold the thought.' },
    ],
    watchOutFor: [
      'A student who discloses something serious during the "below waterline" writing — abuse, family crisis, self-harm ideation. Have your referral process ready. Don\'t probe in class; follow up immediately after.',
      'Students who write nothing. Don\'t force participation. Let them observe. Check in privately after class.',
      'A student sharing another person\'s iceberg publicly in a way that names or embarrasses them. Redirect: "We\'re only mapping our own icebergs today — let\'s keep others\' stories private."',
      'Students who write only surface emotions below the waterline too. Prompt quietly: "Go deeper — what\'s the feeling underneath the feeling?"',
    ],
    variations: [
      { tag: 'Grade 5', text: 'Use a provided emotion word bank (20–25 words) rather than asking students to generate. Focus on 3 emotions maximum and keep the discussion concrete.' },
      { tag: 'Grade 7', text: 'Add a second iceberg for a character from a film, book, or real situation they know. Ask: "Map their iceberg based on their behaviour."' },
      { tag: 'Large class (30+)', text: 'Skip pair sharing entirely. Go straight from individual to class debrief. Ask for 3–4 volunteers to share their above-waterline story.' },
      { tag: 'Short session (25 min)', text: 'Remove the pair guessing activity. Do individual reflection for 12 min, then debrief for 8 min. Hit questions 1, 2, and 4.' },
    ],
    worksheet: {
      title: 'The Feelings Iceberg',
      intro: 'Our emotions are like icebergs — a small visible tip and a huge hidden part below the waterline. Today, map your own.',
      sections: [
        {
          title: '🧊 My Iceberg',
          prompts: [
            { label: 'The situation I\'m thinking of:', lines: 2 },
            { label: 'ABOVE THE WATERLINE — What people saw / my behaviour:', lines: 2 },
            { label: 'BELOW THE WATERLINE — What I was really feeling inside:', lines: 4, note: 'This is just for you. Go as deep as you can.' },
          ]
        },
        {
          title: '🤔 Reflection Questions',
          prompts: [
            { label: 'Was it easy or hard to look below the waterline? What made it difficult?', lines: 3 },
            { label: 'Think of a time when someone responded to just your "tip" and missed what was really going on. What did you wish they had seen?', lines: 3 },
            { label: 'Whose iceberg would you like to understand better, and why? (You don\'t need to name them.)', lines: 2 },
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
    objective: 'Students will experience how messages distort through communication chains, identify WHY distortion happens, and practise two concrete strategies for clearer communication.',
    materials: ['3 pre-written message cards (see below)', 'Observation checklist for non-playing students', 'Whiteboard to record Original vs Final messages'],
    phases: [
      {
        time: '0–5 min', phase: 'Setup & First Round (No Rules)',
        steps: [
          { type: 'do', text: 'Ask 8 students to form a line facing sideways (so the class can observe). Give the first student Message Card 1 (see worksheet). Tell them: "Whisper this once only. No repeats."' },
          { type: 'do', text: 'While the line plays, give remaining students the Observation Checklist: "Watch and note: where does the message start to change? What do you notice?"' },
          { type: 'do', text: 'Once the message reaches the end, ask the last student to say it aloud. Write it on the board. Then reveal the original. Let the class react.' },
          { type: 'tip', text: 'Choose a message that will distort in interesting ways. Example: "Priya told Rohan that the school play is on Thursday at 6pm but only if it doesn\'t rain." Complex, with conditions — it will fall apart quickly.' },
        ]
      },
      {
        time: '5–10 min', phase: 'Second Round (With Listening Rules)',
        steps: [
          { type: 'say', text: '"Let\'s try again with Message Card 2 — but this time, we\'re going to add three rules: 1. You may ask ONE clarifying question before passing it on. 2. Before passing, repeat back what you heard so the sender can confirm. 3. If you\'re unsure, say so — don\'t fill in the blanks."' },
          { type: 'do', text: 'Run the second round. Observe how the message changes (or doesn\'t). Write the final message on the board next to the original.' },
          { type: 'pause', text: 'Ask observers: "Where did you notice the rules making a difference?"' },
        ]
      },
      {
        time: '10–18 min', phase: 'Analysis — Why Messages Break Down',
        steps: [
          { type: 'say', text: '"Let\'s figure out WHY messages change. What were people doing — or NOT doing — that caused the distortion?"' },
          { type: 'do', text: 'Take answers and write them in two columns on the board: "What broke it" and "What fixed it."' },
          { type: 'say', text: '"We found things like: not listening fully, filling in gaps with our own assumptions, hearing what we EXPECTED not what was SAID. In real life — with parents, friends, teachers — this happens constantly."' },
          { type: 'say', text: '"The three rules we used in Round 2 have real names: Clarifying Questions, Reflecting Back, and Flagging Uncertainty. These are actual communication skills. Let\'s practise them."' },
        ]
      },
      {
        time: '18–26 min', phase: 'Pair Practice',
        steps: [
          { type: 'do', text: 'Pair students. Student A reads a scenario card (see worksheet) aloud once. Student B must: (1) ask one clarifying question, (2) reflect back what they heard, (3) respond.' },
          { type: 'do', text: 'Swap roles. Run twice each.' },
          { type: 'tip', text: 'Circulate and gently correct: "You jumped to a response — did you reflect back first?" The goal is building the HABIT of pausing before responding.' },
        ]
      },
      {
        time: '26–30 min', phase: 'Debrief',
        steps: [
          { type: 'say', text: '"Let\'s talk about what you noticed."' },
          { type: 'do', text: 'Use the debrief questions. Focus especially on question 3 — the real-life application.' },
        ]
      },
    ],
    debrief: [
      { q: '"Where exactly in the line did the message change most? What was happening at that point?"', note: 'Students usually identify: a long/complex part of the message, a moment where the listener was distracted, or a gap that someone filled with their own assumption.' },
      { q: '"What did it FEEL like to receive a message that had already changed by the time it got to you?"', note: 'This introduces the emotional impact of miscommunication — frustration, feeling like you were set up to fail.' },
      { q: '"Can you think of a real situation — at home, with friends, in a group chat — where this telephone breakdown happened? What was the impact?"', note: 'This is the key transfer question. Give students 30 seconds to think before taking answers. Fights between friends over "He said she said" are common examples.' },
      { q: '"Of the three skills — clarifying, reflecting back, flagging uncertainty — which do you find hardest to do in real life? Why?"', note: 'Most students say "reflecting back" — it feels slow and awkward. Validate this and say that awkward is the feeling of learning a new skill.' },
      { q: '"How might using these skills change a conversation with someone you\'re having trouble communicating with right now?"', note: 'Keep private. Just plant the thought.' },
    ],
    watchOutFor: [
      'Students intentionally corrupting the message for laughs. Redirect warmly: "The game works best when everyone tries — the funny part comes naturally, we don\'t need to add to it."',
      'The message NOT changing much in Round 1. Have a backup: immediately do Round 1 with a longer, more complex message.',
      'Pairs who just chat instead of following the structured practice. Be explicit: "I need you to follow the three steps — clarify, reflect, then respond."',
    ],
    variations: [
      { tag: 'Grade 5', text: 'Use very short, simple messages in Round 1. Add pictures to the message cards for lower literacy students.' },
      { tag: 'Grade 7', text: 'In Round 2, add the rule: "You may not repeat their exact words — you must paraphrase." This deepens the active listening skill significantly.' },
      { tag: 'Large class', text: 'Run two parallel lines of 8 simultaneously. The rest observe. Compare how the two lines distorted the same message differently.' },
      { tag: 'Short session (25 min)', text: 'Cut the pair practice entirely. Run both rounds, then debrief for 10 min. Focus on questions 1, 3, and 4.' },
    ],
    worksheet: {
      title: 'The Telephone Breakdown',
      intro: 'Today we discovered how messages change as they travel — and learned three skills to stop the breakdown.',
      sections: [
        {
          title: '👁️ Observer Checklist (During the Game)',
          twoCol: true,
          colTitles: ['Round 1 — What I noticed', 'Round 2 — What changed'],
          prompts: [
            { label: 'Where did the message change most?', lines: 2 },
            { label: 'What caused the change?', lines: 2 },
          ]
        },
        {
          title: '📋 The Three Communication Skills',
          prompts: [
            { label: '1. Clarifying Question — What it is and an example I could use:', lines: 2 },
            { label: '2. Reflecting Back — What it sounds like in real conversation:', lines: 2 },
            { label: '3. Flagging Uncertainty — When would I use this?', lines: 2 },
          ]
        },
        {
          title: '💬 My Commitment',
          prompts: [
            { label: 'One communication situation in my life where a telephone breakdown has happened:', lines: 2 },
            { label: 'Which of the three skills would help most in that situation, and why?', lines: 2 },
            { label: 'I will try to use _________________ this week in a conversation with _________________.' , lines: 1 },
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
    objective: 'Students will practise inhabiting a perspective genuinely different from their own, articulate what that person might feel and need, and identify one bias or assumption they held before the activity.',
    materials: ['Persona Cards (printed, one set of 10)', 'Dilemma prompt on back of each card', 'Worksheet — 5 reflection questions'],
    phases: [
      {
        time: '0–5 min', phase: 'Set Up',
        steps: [
          { type: 'say', text: '"There\'s a saying: \'You can\'t understand someone until you\'ve walked a mile in their shoes.\' Today we\'re going to try. You\'ll each get a persona — a real type of student somewhere in India. For the next 20 minutes, you are that person."' },
          { type: 'say', text: '"This isn\'t about acting or performing. It\'s about genuinely trying to understand what life looks and feels like from a perspective that isn\'t yours."' },
          { type: 'do', text: 'Shuffle and distribute Persona Cards face down. Students flip on your signal.' },
          { type: 'tip', text: 'Persona cards should cover diverse experiences: a student with dyslexia, a first-generation learner, a student who just moved cities, a student dealing with a parent\'s illness, an only child vs. one of 5 siblings, a student in a single-parent home, a student who doesn\'t speak Hindi well, one who\'s excelling and one who\'s struggling academically.' },
        ]
      },
      {
        time: '5–8 min', phase: 'Reading and In-Role Thinking',
        steps: [
          { type: 'do', text: 'Students read their persona card silently. Give them 3 minutes.' },
          { type: 'say', text: '"Now answer the 5 questions on the back of the card AS that person. Not what YOU would do — what THEY would do, feel, think, given who they are."' },
          { type: 'tip', text: 'Some students may get a card that feels uncomfortably similar to their own life. Watch for this — it can be powerful or it can be distressing. Check in quietly.' },
        ]
      },
      {
        time: '8–22 min', phase: 'Individual In-Role Reflection',
        steps: [
          { type: 'do', text: 'Students answer the 5 in-role questions on their worksheet: (1) What does a typical school day feel like for me? (2) What do I worry about most? (3) What do people around me misunderstand about me? (4) What do I wish someone would just ask me? (5) What does "a good day" look like for me?' },
          { type: 'do', text: 'Circulate. Prompt with: "Go deeper — not just the situation, but what\'s the emotional experience?" and "What assumption might your classmates make about you that isn\'t true?"' },
          { type: 'pause', text: 'At the 15-minute mark, give a 1-minute warning to finish up.' },
        ]
      },
      {
        time: '22–33 min', phase: 'Paired Conversation In-Role',
        steps: [
          { type: 'do', text: 'Pair students whose personas are different from each other.' },
          { type: 'say', text: '"You are going to have a 5-minute conversation — in role. The topic: your school is planning a new policy. Tell each other what that policy should be and why — from your persona\'s perspective."' },
          { type: 'say', text: '"You can disagree — in fact, try to. But really listen to what the other person needs and why. You\'re practising empathy, not debate."' },
          { type: 'do', text: 'After 5 minutes, stop the in-role conversation. Give 3 minutes for each student to write: "What surprised me about my partner\'s perspective? What assumption of mine did it challenge?"' },
        ]
      },
      {
        time: '33–40 min', phase: 'Full Class Debrief — Out of Role',
        steps: [
          { type: 'say', text: '"Come out of role now. You are yourselves again. Let\'s talk about what just happened."' },
          { type: 'do', text: 'Use the debrief questions. The goal: students name at least one specific bias or assumption they held that the activity challenged.' },
        ]
      },
    ],
    debrief: [
      { q: '"What was the hardest part of staying in your persona\'s perspective — rather than slipping back into your own?"', note: 'This is usually: "I kept thinking what I\'d do" or "I couldn\'t imagine that being my life." Both are honest and useful starting points.' },
      { q: '"What did you discover about your persona that you wouldn\'t have guessed just looking at them from the outside?"', note: 'Listen for the insight that people\'s internal experience is far richer and more complicated than their surface presentation.' },
      { q: '"Did your conversation change your view on what your school should prioritise? How?"', note: 'The policy conversation is a proxy for real conflict resolution. What matters is whether students can articulate a position that isn\'t just their own.' },
      { q: '"What\'s one assumption you realise you\'ve been making about a group of people — in this school, in your neighbourhood — that today challenged?"', note: 'This is a vulnerable question. Create safety: "You don\'t have to say what the assumption WAS — just that you noticed one."' },
      { q: '"What does it actually mean to listen with empathy, rather than just waiting for your turn to speak? What\'s the difference in your body?"', note: 'End here. This question moves the learning from intellectual to somatic — students start to feel the difference, not just understand it.' },
    ],
    watchOutFor: [
      'A student who gets a persona very similar to their own difficult situation (e.g. a student whose parent is actually ill). Watch for discomfort. Offer to swap cards privately.',
      'Students who "play" the persona superficially or with mockery. Redirect: "We\'re trying to genuinely understand, not perform. What would this person actually feel?"',
      'Pairs who get stuck in debate rather than empathy. Remind: "Your job isn\'t to win — it\'s to make the other person feel heard."',
    ],
    variations: [
      { tag: 'Grade 6', text: 'Reduce the in-role questions to 3. Skip the paired in-role conversation; instead, each student shares one discovery from their persona with the class.' },
      { tag: 'Grade 8', text: 'After the activity, ask students to write a one-paragraph letter from their persona to someone at school who "doesn\'t see them." This deepens the perspective-taking significantly.' },
      { tag: 'Sensitive class', text: 'Review persona cards before the session and remove any that might re-traumatise a specific student you know is dealing with that situation.' },
      { tag: 'Short session (30 min)', text: 'Skip the paired conversation. Go from individual reflection to group debrief. Use only 3 debrief questions.' },
    ],
    worksheet: {
      title: 'Walk a Mile — Persona Reflection',
      intro: 'Answer questions 1–5 IN ROLE (as your persona). Answer questions 6–8 as yourself.',
      sections: [
        {
          title: '👟 In Role (Answer as your persona)',
          prompts: [
            { label: '1. What does a typical school day feel like for you?', lines: 3 },
            { label: '2. What do you worry about most that your classmates probably don\'t think about?', lines: 3 },
            { label: '3. What do people misunderstand about you — what do they assume that isn\'t true?', lines: 3 },
            { label: '4. What do you wish someone would just ask you?', lines: 2 },
            { label: '5. What does a "good day" look like for you?', lines: 2 },
          ]
        },
        {
          title: '🪞 As Yourself — After the Activity',
          prompts: [
            { label: '6. What surprised me most about my persona\'s inner experience?', lines: 3 },
            { label: '7. One assumption I had before this activity that I want to question:', lines: 2 },
            { label: '8. Is there someone in MY actual life whose perspective I\'ve been missing? What might be in their iceberg?', lines: 3 },
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
    objective: 'Students will map their own personal stress cycle — triggers, build-up signs, explosion patterns, and release valves — and identify at least two healthy release strategies they will commit to using.',
    materials: ['One plastic bottle with cap (filled with water + a fizzing tablet or just shaken up)', 'Pressure Bottle worksheet', 'Whiteboard', 'Optional: stress balls or fidget items for the activity'],
    phases: [
      {
        time: '0–5 min', phase: 'The Demonstration',
        steps: [
          { type: 'do', text: 'Before the session, secretly shake the bottle vigorously. Hold it behind your back or under the desk.' },
          { type: 'say', text: '"I want to start today by showing you something. This bottle has been through a lot this morning."' },
          { type: 'do', text: 'Begin to slowly open the cap. The pressure releases gradually — controlled. Nothing spills. Set it on the desk.' },
          { type: 'say', text: '"That was a controlled release. Now — what would have happened if I\'d opened it all at once, suddenly, without warning?" (Take answers.) Correct: explosion. Mess. Stuff everywhere that\'s hard to clean up.' },
          { type: 'say', text: '"Our stress and anger work exactly the same way. The question isn\'t whether the pressure builds — it always does. The question is whether we release it slowly and intentionally, or suddenly all at once."' },
          { type: 'tip', text: 'If you have access to a carbonated drink bottle, this demo is even more dramatic. A slow open = controlled hiss. A sudden full open = spray everywhere.' },
        ]
      },
      {
        time: '5–13 min', phase: 'Mapping the Stress Cycle',
        steps: [
          { type: 'do', text: 'Draw a simple diagram on the board: A bottle. Label the bottom "Low pressure" and the top "Near explosion." Draw an arrow going up.' },
          { type: 'say', text: '"Let\'s think about what fills up our bottle. What are the things that SHAKE us — that build the pressure?" Take answers: exam pressure, parent arguments, social rejection, comparison, sleep deprivation, missing meals, noise, being misunderstood.' },
          { type: 'say', text: '"Now — what are the WARNING SIGNS that your bottle is getting full? Not the explosion — the signs BEFORE it. What do you notice in your body?" Write answers: tight chest, grinding teeth, can\'t concentrate, snapping at people, crying suddenly, going very quiet, heart racing.' },
          { type: 'say', text: '"And what does YOUR explosion look like? What happens when the cap blows?" Take answers without judgement: shouting, slamming, crying, saying things I regret, shutting everyone out, eating too much/too little.' },
          { type: 'tip', text: 'Normalise all of this heavily. "These are all completely human responses to pressure. The goal isn\'t to never feel pressure — it\'s to get better at managing the release."' },
        ]
      },
      {
        time: '13–23 min', phase: 'Individual Mapping — My Pressure Bottle',
        steps: [
          { type: 'do', text: 'Distribute the worksheet. Students map their own pressure bottle: shakers (stressors), warning signs, explosion patterns, and release valves.' },
          { type: 'say', text: '"The bottom section — release valves — is the most important one. Write down things that actually help YOU let off pressure gradually. Not what you SHOULD do — what ACTUALLY works for you, even a little."' },
          { type: 'do', text: 'Give 8 minutes for this. Circulate. Help students who write only "nothing helps" by asking: "Is there anything — even tiny — that makes it feel 1% better? A walk? A playlist? Writing?" Add those.' },
          { type: 'tip', text: 'Common release valves for this age group: music, physical movement, journaling, talking to one specific person, sleeping, drawing, gaming (in moderation), cooking. All are valid. Validate whatever they find.' },
        ]
      },
      {
        time: '23–30 min', phase: 'Pair Share — Early Warning System',
        steps: [
          { type: 'say', text: '"Now I want you to pair up with someone you trust a little. Share ONE of your warning signs — just one — and ONE of your release valves. Tell each other: what should I look for in you, and what can I do that actually helps?"' },
          { type: 'say', text: '"This is about building a support system. If your partner knows your warning signs, they can help you release the valve before the explosion."' },
          { type: 'do', text: 'Give 5 minutes. Each person shares once.' },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'say', text: '"Let\'s bring it back together for a few minutes."' },
          { type: 'do', text: 'Use debrief questions. End with question 5 — the commitment.' },
        ]
      },
    ],
    debrief: [
      { q: '"Which part of your bottle was easiest to identify — the shakers, the warning signs, or the release valves? Which was hardest, and why?"', note: 'Most students find release valves hardest — because they haven\'t been taught them. This is the gap the activity addresses.' },
      { q: '"Have you ever had an explosion that damaged something — a relationship, your own wellbeing — that a slow release earlier might have prevented?"', note: 'Keep private. Students just hold the memory. Don\'t ask them to share.' },
      { q: '"What makes it hard to use your release valves when you\'re actually in the high-pressure moment?"', note: 'Listen for: "I forget", "I feel too wound up to do anything calm", "It feels fake". Validate. Explain that this is why we practise — so the release valve becomes automatic.' },
      { q: '"What did you discover about your partner\'s warning signs and release valves? Was anything surprising?"', note: 'Creates awareness that everyone\'s system is different — which builds empathy.' },
      { q: '"I want everyone to close their eyes. Think of the most likely high-pressure moment coming up in the next 2 weeks. Picture it. Now — which release valve will you use BEFORE the explosion?"', note: 'End here. This guided visualisation turns learning into intention.' },
    ],
    watchOutFor: [
      'A student whose "explosion" pattern involves self-harm. If they disclose this, acknowledge privately and trigger your referral process immediately after class.',
      'Students who say nothing is a stressor — they may be performing stoicism. Probe gently: "What about exams? Home? Social situations?" Even a small crack in the "everything\'s fine" front is worth noting.',
      'The demonstration going wrong — bottle exploding everywhere. Have a cloth ready. It actually makes the metaphor stronger: "See how hard that was to clean up? Same with emotional explosions."',
    ],
    variations: [
      { tag: 'Grade 7', text: 'Focus on physical release valves only: breathing, movement, shaking hands out. Do a 2-minute box breathing exercise as a class right after mapping.' },
      { tag: 'Grade 9', text: 'Add a section: "What I do that gives OTHERS pressure" — helping students see their own role in escalating situations.' },
      { tag: 'No materials', text: 'Skip the bottle demo. Instead, tell the story verbally: "Imagine a bottle being shaken..." The metaphor still lands without props.' },
      { tag: 'Short session (25 min)', text: 'Cut the pair share. Go from individual mapping (10 min) straight to debrief (10 min). Hit all 5 debrief questions briskly.' },
    ],
    worksheet: {
      title: 'My Pressure Bottle',
      intro: 'Map your own stress cycle below. Be honest — this is a tool for YOU.',
      sections: [
        {
          title: '🔧 My Shakers (What fills my bottle)',
          prompts: [{ label: 'Write the things that shake your bottle — that build pressure for you:', lines: 4 }]
        },
        {
          title: '⚠️ My Warning Signs (How I know pressure is building)',
          twoCol: true,
          colTitles: ['In my BODY I notice:', 'In my BEHAVIOUR I notice:'],
          prompts: []
        },
        {
          title: '💥 My Explosion Pattern (What it looks like when the cap blows)',
          prompts: [{ label: 'When I\'ve hit my limit, I tend to:', lines: 2 }]
        },
        {
          title: '🌿 My Release Valves (What helps me let off pressure slowly)',
          prompts: [
            { label: 'Things that help me release pressure BEFORE the explosion (list as many as possible):', lines: 4 },
            { label: 'The release valve I will commit to using this week:', lines: 1 },
            { label: 'My warning sign that tells me it\'s time to use a release valve:', lines: 1 },
          ]
        }
      ]
    }
  },

  // ── 5. The Choice Crossroads ────────────────────────────────────────────
  {
    id: 'crossroads', number: 5, icon: '🔀',
    title: 'The Choice Crossroads',
    theme: 'Decision Making & Critical Thinking',
    themeShort: 'Decision Making',
    grade: '8–10', gradeKey: 'middle',
    duration: '40 min',
    formats: ['Physical movement', 'Pairs', 'Full class'],
    color: '#2980B9', colorPale: '#EBF5FB',
    objective: 'Students will practise structured decision-making — identifying the values, consequences, and stakeholders behind a choice — and articulate a position THEN argue the opposite, building cognitive flexibility.',
    materials: ['4 corner labels: A, B, C, D (printed or written on paper)', 'Scenario Cards (4–6 scenarios, see below)', 'Worksheet — decision framework'],
    phases: [
      {
        time: '0–5 min', phase: 'Setup',
        steps: [
          { type: 'do', text: 'Place A/B/C/D labels in the four corners of the room.' },
          { type: 'say', text: '"Today we\'re going to make some difficult decisions — the kind that don\'t have a single right answer. Your job is not to find the \'correct\' choice, but to understand WHY you\'re choosing it and what it costs."' },
          { type: 'say', text: '"We\'ll use scenarios that are relevant to your lives. When I read a scenario, you move to the corner that matches your choice and stay there to argue your position."' },
          { type: 'tip', text: 'Scenarios should be genuinely relevant and difficult: choosing between Science and Commerce when family expects Science; whether to tell a teacher your friend has been copying; whether to confront someone spreading a rumour about you online; whether to take up a hobby you love that your parents see as "wasteful".' },
        ]
      },
      {
        time: '5–20 min', phase: 'Rounds 1 & 2 — Choose and Argue Your Position',
        steps: [
          { type: 'say', text: '"Scenario 1." Read the first scenario. Give 30 seconds of silent thinking time. "Move to your corner."' },
          { type: 'do', text: 'Once students are in corners, give each corner 60 seconds to discuss among themselves: "Why did you choose this? What are the strongest 2 reasons?"' },
          { type: 'do', text: 'Ask one spokesperson per corner to give 1 reason. Other corners may NOT respond yet — just listen.' },
          { type: 'say', text: '"Now — switch. I want you to move to the corner that is the OPPOSITE of what you just argued. You have 90 seconds to prepare arguments for this opposite position."' },
          { type: 'say', text: '"This is the hardest part. You\'re not trying to convince yourself — you\'re trying to genuinely understand why someone would make that choice."' },
          { type: 'do', text: 'Run Scenario 2 with the same format. Run a 3rd scenario if time allows.' },
          { type: 'tip', text: 'Watch for students who refuse to move corners or argue weakly for the opposite. Gently push: "What\'s the BEST version of this argument? What would someone who deeply believes this say?"' },
        ]
      },
      {
        time: '20–30 min', phase: 'Values Mapping — Individual Worksheet',
        steps: [
          { type: 'say', text: '"Let\'s slow down and look underneath our choices. Every decision reflects a value — something we believe matters."' },
          { type: 'do', text: 'Students pick ONE scenario from the session and complete the Decision Framework on their worksheet: (1) My initial choice, (2) The values driving it, (3) Who else is affected, (4) The strongest argument against my choice, (5) My final decision and what changed (if anything).' },
          { type: 'tip', text: 'Some students will change their mind during the framework — that\'s the goal. Celebrate it: "Changing your mind with new information isn\'t weakness — it\'s intelligence."' },
        ]
      },
      {
        time: '30–40 min', phase: 'Debrief',
        steps: [
          { type: 'say', text: '"Let\'s come back together for the most important part of today."' },
          { type: 'do', text: 'Use debrief questions. Aim for 4 of the 5.' },
        ]
      },
    ],
    debrief: [
      { q: '"What was it like to have to argue for the OPPOSITE of what you actually believe? What did you learn from it?"', note: 'This is the cognitive flexibility question. The goal: students realise that strong positions can be held by reasonable people, and understanding those positions makes their OWN choices stronger.' },
      { q: '"Did arguing the opposite position ever make you want to change your own choice? If so, why? If not, why not?"', note: 'Both answers are valid. Students who changed their mind demonstrate intellectual openness. Students who didn\'t but can articulate why demonstrate conviction.' },
      { q: '"What VALUES showed up in your corner most often? What does that tell you about yourself?"', note: 'This is a self-awareness moment embedded in a decision-making activity. Look for: safety vs. risk, loyalty vs. honesty, individual vs. family.' },
      { q: '"Who WASN\'T in the room that should have been considered in these decisions — who else gets affected by choices like these?"', note: 'This introduces stakeholder thinking. Students often forget the "silent" affected parties.' },
      { q: '"Think of a real decision you\'re currently facing. Which of the five framework steps have you been skipping? What would happen if you used the whole framework?"', note: 'End here. This is the bridge from classroom to real life.' },
    ],
    watchOutFor: [
      'Students clustering — everyone going to the same corner because friends are there. Separate friend groups before the session begins, or make mixing a requirement.',
      'Scenarios feeling too easy or too abstract. Have backup scenarios ready that are more personally relevant to YOUR school\'s context.',
      'A student who is clearly facing the real version of a scenario you\'ve chosen. Watch for distress. Offer a private follow-up.',
    ],
    variations: [
      { tag: 'Grade 8', text: 'Use simpler, more personal scenarios. Avoid high-stakes academic scenarios for younger students — focus on friendship and social choices.' },
      { tag: 'Grade 10', text: 'Add a "consequence timeline" — students map the 1 month, 1 year, and 5 year consequences of each choice. This deepens the decision framework significantly.' },
      { tag: 'Large class', text: 'Instead of 4 corners, use a line across the room: strongly agree to strongly disagree. Students stand anywhere on the spectrum, not just 4 fixed points.' },
      { tag: 'Short session (30 min)', text: 'Run only one scenario with the switch. Skip the individual worksheet. Go directly to debrief. Use 3 questions maximum.' },
    ],
    worksheet: {
      title: 'The Choice Crossroads — Decision Framework',
      intro: 'Use this framework to slow down and really examine ONE decision from today\'s activity.',
      sections: [
        {
          title: '🔀 My Decision Framework',
          prompts: [
            { label: 'The scenario I\'m working with:', lines: 2 },
            { label: '1. My initial, instinctive choice was:', lines: 1 },
            { label: '2. The values driving that choice (what matters to me here):', lines: 2 },
            { label: '3. Who else is affected by this decision — and how?', lines: 3 },
            { label: '4. The strongest argument AGAINST my choice (argue it honestly):', lines: 3 },
            { label: '5. After thinking it through: my final decision, and what — if anything — changed:', lines: 3 },
          ]
        },
        {
          title: '🪞 Reflection',
          prompts: [
            { label: 'A real decision I\'m currently facing where I could use this framework:', lines: 2 },
            { label: 'The step in the framework I most often SKIP in real life:', lines: 1 },
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
    objective: 'Students will physically and verbally experience the three responses to peer pressure (give in, push back, step aside), identify which they default to, and practise two verbal boundary-setting scripts.',
    materials: ['Open floor space', 'Scenario Cards (verbal peer pressure situations)', 'Worksheet with script-building template'],
    phases: [
      {
        time: '0–5 min', phase: 'Physical Warm-Up — The Push',
        steps: [
          { type: 'say', text: '"Stand up and find a partner. Face each other. Put your palms up, touching your partner\'s palms. When I say go — push gently. Try to move your partner without hurting them."' },
          { type: 'do', text: 'Run for 30 seconds. Then: "Stop. Now — don\'t push back. Just stand completely still and let the push happen." (30 sec.) Then: "Now step to the side when they push — don\'t resist, don\'t match it. Just move out of the way." (30 sec.)' },
          { type: 'say', text: '"You just experienced three responses to pressure: push back, give in, and step aside. Notice: one response was about force, one was surrender, one was deflection. All three have a time and place — but we often have only ONE that we default to."' },
          { type: 'tip', text: 'This physical metaphor makes the psychological lesson concrete and memorable. Students will remember it.' },
        ]
      },
      {
        time: '5–12 min', phase: 'Concept: The Three Responses',
        steps: [
          { type: 'do', text: 'Draw a 3-column table on the board: GIVE IN | PUSH BACK | STEP ASIDE' },
          { type: 'say', text: '"When someone pressures you — a friend, a group — to do something you\'re not comfortable with, you have the same three options. Let\'s make them real."' },
          { type: 'say', text: '"GIVE IN: You say yes when you mean no. Short-term: peace. Long-term: resentment, loss of self-respect, harder to say no next time."' },
          { type: 'say', text: '"PUSH BACK: You directly refuse and stand your ground. Short-term: confrontation. Long-term: clarity, self-respect, sometimes damaged friendship if done harshly."' },
          { type: 'say', text: '"STEP ASIDE: You redirect without direct conflict. You change the subject, make a joke, suggest something else, leave. This isn\'t dishonesty — it\'s strategy."' },
          { type: 'tip', text: 'Emphasise: none of these is always right. The skill is knowing WHEN to use each and being able to choose consciously rather than defaulting automatically.' },
        ]
      },
      {
        time: '12–22 min', phase: 'Verbal Practice — Script Building',
        steps: [
          { type: 'say', text: '"Now we\'re going to do the verbal version. I\'ll read a peer pressure scenario. In pairs, one of you plays the person applying pressure — really commit to it. The other practises all three responses."' },
          { type: 'do', text: 'Scenario examples: "Come on, just have a look at the paper — nobody will know." / "If you don\'t come to the party, we\'re not friends anymore." / "Share that person\'s photo, everyone else has." / "Just try it once, it\'s fine." / "Don\'t be such a baby about it."' },
          { type: 'say', text: '"Try Response 1 first (give in). Notice how it feels in your body. Then Response 2 (push back). Then Response 3 (step aside). I\'ll call out which to switch to."' },
          { type: 'do', text: 'Run 3 scenarios. After each, ask: "Which response felt most natural? Which felt most powerful? Which felt most awkward?"' },
          { type: 'tip', text: 'The "push back" response often feels too aggressive or rude to students. Coach: "You can be completely clear AND completely respectful. Those aren\'t opposites."' },
        ]
      },
      {
        time: '22–30 min', phase: 'Script Building — Individual',
        steps: [
          { type: 'say', text: '"Let\'s personalise this. Think of a real peer pressure situation you face — or have faced — at school. You don\'t need to share what it is."' },
          { type: 'do', text: 'Students complete the worksheet: writing their own Push Back and Step Aside scripts for that situation. Circulate and help craft specific, realistic language.' },
          { type: 'tip', text: 'Good push back scripts use "I" language: "I\'m not comfortable with that." "That\'s not something I do." "I\'m going to pass on this one." Avoid "I can\'t" — "I won\'t" is more powerful and honest.' },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: 'Use debrief questions. Keep it honest and grounded.' },
        ]
      },
    ],
    debrief: [
      { q: '"Which of the three responses — give in, push back, step aside — is your default? When did you develop that pattern?"', note: 'Students often trace defaults back to family dynamics or early social experiences. Don\'t push — just create awareness.' },
      { q: '"Was there a scenario today where the \'give in\' response actually seemed reasonable? When MIGHT it be the right choice?"', note: 'This prevents the lesson from becoming moralistic. Sometimes giving in is a strategic or kind choice. The goal is conscious choice, not a rigid rule.' },
      { q: '"What made it difficult to use the \'push back\' response in the role-play? What would make it easier in real life?"', note: 'Common answers: "I was scared of what they\'d think", "It felt rude", "I don\'t want to lose the friend." All valid — engage with them genuinely.' },
      { q: '"Who in your life makes you most likely to give in when you don\'t want to? Why do you think that is?"', note: 'Keep this private — don\'t ask for names. Just let students hold the awareness.' },
      { q: '"If a close friend came to you and said they were being pressured into something they didn\'t want to do — what would you tell them to say?"', note: 'This is often easier for students to answer for a friend than for themselves. Use it as a mirror: "That advice applies to you too."' },
    ],
    watchOutFor: [
      'The physical push activity getting too rough. Set a firm tone before: "Gentle. This is about awareness, not strength." If any pair escalates, stop the physical activity immediately.',
      'A student disclosing that they\'re currently in a serious peer pressure situation (drugs, sexual coercion, dangerous activities). Have your referral pathway ready.',
      'Students who refuse to play the "pressure" role because they don\'t want to seem like a bully. Reframe: "Playing this role helps you understand how pressure works — it doesn\'t make you a bad person."',
    ],
    variations: [
      { tag: 'Grade 8', text: 'Focus only on social peer pressure (friendship-based). Avoid adding substance use scenarios for younger students — keep it about belonging and fitting in.' },
      { tag: 'Grade 10', text: 'Add a digital dimension: one set of scenarios involves texts and group chats rather than face-to-face situations. "Screenshot and send it. Everyone else has."' },
      { tag: 'All-girls class', text: 'Include scenarios around appearance pressure, sharing personal information, and social exclusion — common peer pressure forms in female peer groups.' },
      { tag: 'Short session (25 min)', text: 'Run only the physical warm-up (5 min) and 2 verbal scenarios (10 min), then debrief (10 min). Skip individual script building — give worksheet to take home.' },
    ],
    worksheet: {
      title: 'The Push & Stand — My Boundary Scripts',
      intro: 'Having a script ready makes it much easier to use it in the moment. Write yours here.',
      sections: [
        {
          title: '🧱 The Three Responses',
          prompts: [
            { label: 'My DEFAULT response to peer pressure is usually: (circle) Give In  /  Push Back  /  Step Aside', lines: 0 },
            { label: 'A situation where I typically give in when I don\'t want to:', lines: 2 },
          ]
        },
        {
          title: '📝 My Scripts (for a real situation I face)',
          prompts: [
            { label: 'The situation (you don\'t need to be specific):', lines: 1 },
            { label: 'My PUSH BACK script — direct, respectful, and clear:', lines: 3, note: 'Use "I" language. "I\'m not comfortable with that." "I\'m going to pass on this one."' },
            { label: 'My STEP ASIDE script — redirect without confrontation:', lines: 3, note: 'Change topic, suggest something else, make a light exit.' },
            { label: 'The response I think will actually be hardest to use and why:', lines: 2 },
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
    objective: 'Students will distinguish between positions ("what I say I want") and interests ("what I actually need"), demonstrate interest-based negotiation in a simulated conflict, and articulate one real conflict where this skill would change the outcome.',
    materials: ['Conflict scenario cards', 'Two-Story House worksheet (Positions vs Interests mapping)', 'Optional: a simple arbitration checklist for the observer role'],
    phases: [
      {
        time: '0–5 min', phase: 'The Metaphor',
        steps: [
          { type: 'say', text: '"Imagine a house with two floors. Two people live there. From the first floor, you see the street one way. From the second floor, you see it completely differently. Same street. Same events. Two completely different views."' },
          { type: 'say', text: '"Conflict works like this. Two people look at the same situation from different floors and see completely different things. And here\'s the tricky part: they\'re both right about what they see. The problem isn\'t that one of them is wrong — it\'s that they\'re describing two different views of the same reality."' },
          { type: 'say', text: '"Today we\'re going to learn a skill that almost nobody teaches you: the difference between your POSITION and your INTEREST. Understanding that difference is how most conflicts actually get resolved."' },
        ]
      },
      {
        time: '5–12 min', phase: 'Positions vs Interests — The Core Concept',
        steps: [
          { type: 'do', text: 'Draw a 2-column table: POSITION | INTEREST. Underneath: "What I SAY I want" | "What I ACTUALLY need."' },
          { type: 'say', text: '"Example: Two siblings are fighting over the last orange. Both say: \'I want the orange.\' That\'s their POSITION. But if you ask WHY — one wants the juice to drink. The other wants the peel to bake. Their INTERESTS are completely different. The conflict? It was never really about the orange."' },
          { type: 'say', text: '"Most conflict is like this. We argue about positions — what we say we want — and never get to interests — what we actually need. The moment you understand the other person\'s interest, the conflict usually finds a path."' },
          { type: 'do', text: 'Run 2 quick examples from real school life: "I want you to leave me alone" (position) → "I need space to process something difficult" (interest). "I want you to stop talking to her" → "I\'m scared of losing our friendship." Have students generate their own real examples.' },
        ]
      },
      {
        time: '12–28 min', phase: 'The Two-Story House Exercise',
        steps: [
          { type: 'do', text: 'Form trios. Assign roles: Person A, Person B, Observer. Give each trio a conflict scenario card.' },
          { type: 'say', text: '"Person A and B: you each read your side of the scenario separately. Do NOT share your card with the other person. Person A starts by stating their position. Person B responds with theirs. Then — and this is the key — each of you must ask the other person ONE question that starts with: \'WHY is that important to you?\'"' },
          { type: 'say', text: '"The Observer\'s job is to listen for the moment when interests surface — when you can hear what each person ACTUALLY needs underneath their position. Write it down when you notice it."' },
          { type: 'do', text: 'Give pairs 8 minutes to work through the scenario. Then 3 minutes for the Observer to feed back: "Here\'s what I heard as your actual interests..."' },
          { type: 'do', text: 'If time allows, give trios 3 minutes to find a solution that addresses BOTH interests (not positions). This is the negotiation phase.' },
          { type: 'tip', text: 'Good scenario examples for this age group: project partner who keeps missing deadlines (their interest: overwhelmed, doesn\'t want to admit it). A teacher whose class feels unfair (interest: maintaining standards under class management pressure). A parent who won\'t allow something (interest: safety, not control).' },
        ]
      },
      {
        time: '28–35 min', phase: 'Individual Reflection — My Real Conflict',
        steps: [
          { type: 'say', text: '"Now think of a real conflict in your life — big or small. Use the worksheet to map the positions AND interests: yours and the other person\'s."' },
          { type: 'do', text: 'Students complete the Two-Story House worksheet for a personal conflict. Give 6 minutes.' },
          { type: 'tip', text: 'Some students won\'t know the other person\'s interest. That\'s fine — have them GUESS based on what they know about that person. The act of guessing builds empathy.' },
        ]
      },
      {
        time: '35–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: 'Use 3 debrief questions. Keep it grounded and real.' },
        ]
      },
    ],
    debrief: [
      { q: '"Has your experience of the simulated conflict changed after you heard the other person\'s interest — not just their position? What shifted?"', note: 'This is the empathy moment. Students often say "oh — they weren\'t trying to be difficult, they just needed something different."' },
      { q: '"Think of a conflict in your own life where you\'ve been arguing positions for a long time without getting anywhere. What might the other person\'s INTEREST actually be?"', note: 'This is the transfer question. Don\'t force sharing — just let them hold it.' },
      { q: '"Why do you think most people never ask \'why is that important to you?\' in a conflict? What makes it hard to say?"', note: 'Common answers: ego, feeling like asking is giving in, not knowing the language. This reveals the gap between knowing the skill and using it.' },
      { q: '"If you could design ONE rule for how conflicts get handled at this school, what would it be, based on what you learned today?"', note: 'This builds school citizenship and ownership. Collect these responses — they\'re often genuinely insightful.' },
      { q: '"When IS it appropriate to hold your position and NOT try to find a compromise?"', note: 'This prevents the lesson from becoming "always compromise." Values-based non-negotiables are legitimate. The skill is knowing the difference.' },
    ],
    watchOutFor: [
      'Students who use the exercise to reopen a real conflict between them and another student in the class. Redirect firmly: "We\'re using scenario cards today — real conflicts between people in this room are not for today\'s exercise."',
      'An Observer who gives feedback that is harsh or takes sides. Brief Observers before the exercise: "Your job is to notice — not to judge either person."',
      'Students who can\'t identify the other person\'s interest because they genuinely haven\'t considered it. This is the lesson — normalise it: "Not knowing is where we start. Guessing is a skill."',
    ],
    variations: [
      { tag: 'Grade 9', text: 'Use only interpersonal scenarios (friends, family). Avoid workplace or complex institutional scenarios.' },
      { tag: 'Grade 11', text: 'Extend the negotiation phase to 10 minutes. Ask trios to produce a written agreement: "Both parties agree to X in exchange for Y."' },
      { tag: 'Pairs only', text: 'Remove the Observer role. Each person maps their own interests privately on the worksheet, then shares only their interests (not their position) first — and sees if a solution emerges.' },
      { tag: 'Short session (30 min)', text: 'Skip the personal conflict worksheet. Do the exercise, debrief with 3 questions, end there. Give worksheet as homework.' },
    ],
    worksheet: {
      title: 'The Two-Story House — Mapping Positions & Interests',
      intro: 'In every conflict, people argue their POSITIONS. But underneath every position is an INTEREST — something they actually need. Finding the interests is how conflicts get resolved.',
      sections: [
        {
          title: '🏠 My Scenario or Real Conflict',
          twoCol: true,
          colTitles: ['MY FLOOR (First Person)', 'THEIR FLOOR (Second Person)'],
          prompts: [
            { label: 'My POSITION — what I say I want:', lines: 2 },
            { label: 'Their POSITION — what they say they want:', lines: 2 },
            { label: 'My INTEREST — what I actually need underneath:', lines: 2 },
            { label: 'Their INTEREST — what they might actually need (guess if needed):', lines: 2 },
          ]
        },
        {
          title: '🤝 Finding the Path Forward',
          prompts: [
            { label: 'A solution that addresses BOTH interests (not just positions):', lines: 3 },
            { label: 'What would I need to let go of to make that solution possible?', lines: 2 },
            { label: 'The question I could ask to find out more about their interest:', lines: 1 },
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
    objective: 'Students will apply backward planning to one meaningful personal or academic goal — identifying the final milestone and working backward to tomorrow\'s single first step — and understand WHY most goals fail (starting too late, no milestones, no accountability).',
    materials: ['Blank Reverse Calendar template (one per student)', 'Coloured pens (3 colours if possible)', 'Whiteboard'],
    phases: [
      {
        time: '0–5 min', phase: 'Opening — Why Goals Fail',
        steps: [
          { type: 'say', text: '"Raise your hand if you\'ve ever set a goal at the start of the year and abandoned it within 2 months." (Pause.) "Now keep it up if you know exactly WHY you gave up." Most hands go down.' },
          { type: 'say', text: '"Here\'s what research consistently shows about why goals fail. Not willpower. Not motivation. Three things: starting too late, no milestones, and no accountability. Today we\'re going to fix all three — for one real goal of yours."' },
          { type: 'do', text: 'Write on the board: "Start at the END."' },
          { type: 'say', text: '"Most people plan goals forward: I\'ll start today, and somehow I\'ll get there. But the most effective planners work backwards: they start at the end date and ask: what needs to be true the day before? And the week before? All the way back to today."' },
        ]
      },
      {
        time: '5–10 min', phase: 'Demo — The Class Goal',
        steps: [
          { type: 'say', text: '"Let me show you. Let\'s take a goal everyone here has: performing well in the board exams."' },
          { type: 'do', text: 'Draw a simple reverse calendar on the board: Exam Date → 1 month before → 2 months before → 3 months before → TODAY.' },
          { type: 'say', text: '"What needs to be true 1 month before the exam?" Students: "Revision done. All topics covered. Mock tests started." Write it.' },
          { type: 'say', text: '"What needs to be true 2 months before THAT?" Students: "First full pass of all topics complete." Write it.' },
          { type: 'say', text: '"3 months before?" "Chapter-by-chapter notes done." And finally: "Tomorrow?" "Open one textbook and read for 20 minutes." Write THAT.' },
          { type: 'say', text: '"That last one — tomorrow\'s first step — is the most important. A 10 kg goal starts with a 10 gram first step. The step is never the problem. The planning is."' },
        ]
      },
      {
        time: '10–25 min', phase: 'Individual — My Reverse Calendar',
        steps: [
          { type: 'say', text: '"Now you\'re doing this for a REAL goal. It can be academic, personal, a skill, a relationship you want to build — anything that matters to you. The only rule: it has to be specific and it has to have a deadline."' },
          { type: 'do', text: 'Distribute Reverse Calendar worksheets. Students write their goal, their end date, then work BACKWARDS: month-by-month milestones, then weekly markers for the first month, then tomorrow\'s first step.' },
          { type: 'say', text: '"Use 3 colours if you have them: one for the big milestones, one for the weekly steps, one for tomorrow. This makes it visual and memorable."' },
          { type: 'do', text: 'Give 12 minutes. Circulate actively. The most common problem: goals that are too vague ("do better at maths"). Push: "How will you KNOW you\'ve done better? What\'s the measurable outcome?"' },
          { type: 'tip', text: 'Other common issues: no deadline set (coach: "Pick a date — even an approximate one"), milestones that are too large and vague, or a first step that\'s still a week-long commitment (push it down to one action tomorrow).' },
        ]
      },
      {
        time: '25–30 min', phase: 'Accountability Pair',
        steps: [
          { type: 'say', text: '"Find a partner. Share: (1) your goal, (2) your first step for tomorrow, and (3) your first major milestone. Your partner\'s job is to QUESTION: Is that milestone specific enough? Is the first step small enough to actually do tomorrow?"' },
          { type: 'do', text: 'Give 4 minutes. Each person shares. Partner asks one clarifying question.' },
          { type: 'say', text: '"Before you sit down: exchange contact details or agree to check in with each other after one week. Accountability is the third thing that makes goals work."' },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: 'Use the debrief questions. Focus especially on questions 2 and 4.' },
        ]
      },
    ],
    debrief: [
      { q: '"What was different about starting at the END and working backwards versus the way you usually set goals?"', note: 'Common insight: "I could actually see the whole path", "It felt less overwhelming", "I realised how far away things actually are — I need to start sooner."' },
      { q: '"What did you have to be honest with yourself about while building your calendar?"', note: 'This is where students confront procrastination, overconfidence, or the gap between aspiration and reality. Normalise: "This honesty is the actual skill."' },
      { q: '"What\'s the difference between a goal and a wish? What makes one become the other?"', note: 'Classic answer: a plan, a deadline, and action. But push for: specificity, measurability, someone who knows about it.' },
      { q: '"Look at your first step for tomorrow. Is it ACTUALLY doable in 15 minutes or less? If not, what would a smaller version look like?"', note: 'This is the most practical intervention. Most students over-plan their first step. Getting it down to 15 minutes creates momentum without overwhelm.' },
      { q: '"What is most likely to derail your plan between now and your first milestone? What\'s your plan for when that happens?"', note: 'Introducing "if-then" planning: if X happens, I will do Y. This pre-commitment dramatically increases follow-through.' },
    ],
    watchOutFor: [
      'Students who choose a goal they think they SHOULD have rather than one they actually care about. The reverse calendar only works for motivated goals. Ask: "Why does this goal matter to YOU personally?"',
      'Students who get anxious seeing how much work is required when they map backwards. Normalise: "It looks like a lot because it IS — but you have time. That\'s the point of planning."',
      'Accountability pairs who give empty validation. Coach: "Your job is to make their goal BETTER, not to make them feel good about it. Ask hard questions."',
    ],
    variations: [
      { tag: 'Grade 9', text: 'Focus entirely on academic goals for the first session. Personal goals can be added in a follow-up session once students understand the format.' },
      { tag: 'Grade 11', text: 'Extend the timeline to one year (applicable to entrance exam preparation). Add a "What I\'ll sacrifice" row — what I\'ll do LESS of to protect this goal.' },
      { tag: 'Follow-up session', text: 'Run a 15-minute check-in session 3 weeks later. Students report back to their accountability partner: what happened, what changed, what milestone they hit or missed.' },
      { tag: 'Short session (25 min)', text: 'Skip the class demo entirely. Go straight to individual planning (15 min), then accountability pairs (5 min), then 5 min debrief with just questions 1 and 4.' },
    ],
    worksheet: {
      title: 'The Reverse Calendar — My Goal Roadmap',
      intro: 'Start at the END. Work backwards to tomorrow\'s first step.',
      sections: [
        {
          title: '🎯 My Goal',
          prompts: [
            { label: 'My goal (specific and measurable):', lines: 2 },
            { label: 'Why this goal matters to ME personally:', lines: 2 },
            { label: 'My END DATE (deadline):', lines: 1 },
          ]
        },
        {
          title: '📅 Working Backwards from the End',
          prompts: [
            { label: 'What must be true 1 MONTH before my end date?', lines: 2 },
            { label: 'What must be true 2 MONTHS before?', lines: 2 },
            { label: 'What must be true 3 MONTHS before?', lines: 2 },
            { label: 'What must I complete THIS WEEK to stay on track?', lines: 2 },
            { label: '⭐ TOMORROW — my first step (must take 15 minutes or less):', lines: 1 },
          ]
        },
        {
          title: '🤝 Accountability',
          prompts: [
            { label: 'My accountability partner:', lines: 1 },
            { label: 'What I\'m asking them to check on:', lines: 1 },
            { label: 'If my plan gets derailed, I will:', lines: 2 },
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
    objective: 'Students will concretely experience how digital content persists and is reinterpreted over time, articulate the gap between intent and impact in online behaviour, and define three specific personal digital standards they will hold themselves to.',
    materials: ['Role cards: Prosecutor, Defence, 3 Witnesses, 2 Jury members (one card per student)', 'Evidence Packet (printed: 3 screenshot scenarios of online posts)', '"Verdict" slips for jury', 'Worksheet'],
    phases: [
      {
        time: '0–5 min', phase: 'Setup and Roles',
        steps: [
          { type: 'say', text: '"Today we\'re running a trial. The case: something a student posted online 3 years ago — when they were 14 — has just resurfaced. The post wasn\'t illegal. But it\'s being reviewed by a college admissions panel, a future employer, and their school community. The question isn\'t: was it wrong? The question is: what does it mean NOW?"' },
          { type: 'do', text: 'Distribute role cards. Briefly explain each role: Prosecutor (argues the post reveals character), Defence (argues the post was youthful, out of context, and unfair to judge now), Witnesses (college officer, past friend, current teacher), Jury (decides the impact on the student\'s future).' },
          { type: 'do', text: 'Distribute the Evidence Packet: a screenshot of the post, a screenshot of the comment thread, a screenshot of the person\'s current profile. Give students 2 minutes to read.' },
          { type: 'tip', text: 'The evidence should be ambiguous — not obviously terrible, not obviously fine. Something like a group chat screenshot with an insensitive joke, or a post mocking someone\'s appearance without naming them. The ambiguity is what generates the best discussion.' },
        ]
      },
      {
        time: '5–20 min', phase: 'The Trial',
        steps: [
          { type: 'say', text: '"The trial will run for 12 minutes. Prosecution speaks for 2 minutes. Defence responds for 2 minutes. Each witness gives a 90-second statement. Defence and Prosecution each have 1 minute for closing. Then jury deliberates for 3 minutes."' },
          { type: 'do', text: 'Run the trial. Act as the judge — keep time, call on speakers, intervene if someone goes off track.' },
          { type: 'do', text: 'While the trial runs, non-speaking students (audience) complete the observation section of their worksheet: What arguments are being made? What am I noticing? Who do I agree with and why?' },
          { type: 'do', text: 'Jury delivers their verdict at the end: (1) does the post damage the student\'s college application? (2) should it affect their school disciplinary record? (3) has their character been fairly represented?' },
          { type: 'tip', text: 'The most important thing is to create genuine tension. Push students out of surface answers: "What\'s the strongest version of the argument you DISAGREE with?"' },
        ]
      },
      {
        time: '20–30 min', phase: 'Step Out of Role — Real Discussion',
        steps: [
          { type: 'say', text: '"Step out of role. You are yourselves again. Let\'s have an honest conversation — not about the fictional student, but about what you actually think."' },
          { type: 'say', text: '"This trial was based on something real. Studies show that 70% of admissions officers and 60% of employers in India have begun checking social media. Not to find excellence — to find reasons to disqualify."' },
          { type: 'say', text: '"The question isn\'t: does that seem fair? It probably doesn\'t. The question is: given that this is the reality, what does it mean for how you operate online?"' },
          { type: 'do', text: 'Give students 5 minutes to complete the "My Digital Standards" section of the worksheet individually.' },
        ]
      },
      {
        time: '30–40 min', phase: 'Debrief',
        steps: [
          { type: 'do', text: 'Use the debrief questions. This group can handle depth — go there.' },
        ]
      },
    ],
    debrief: [
      { q: '"Was the trial fair? Should something you posted at 14 define you at 17 or 21?"', note: 'Both answers are valid. Listen for: "It\'s not fair but it\'s reality" — that\'s the sophisticated answer you want to draw out.' },
      { q: '"The post wasn\'t illegal and the person wasn\'t trying to hurt anyone. But it did cause harm. Where\'s the line between intention and impact online?"', note: 'This is the core digital citizenship question. "I didn\'t mean it that way" is not a sufficient defence when the impact was real. Guide them there.' },
      { q: '"Is there anything on YOUR digital profile right now that you\'d be uncomfortable with a stranger seeing in 5 years?"', note: 'Keep private. Just let them sit with the question. You might add: "Not to make you anxious — just to make you intentional."' },
      { q: '"What would a POSITIVE digital footprint look like? What would someone who\'s impressed by it see?"', note: 'Reframe from defensive to active. Digital presence can be an asset, not just a liability. Students often haven\'t considered this.' },
      { q: '"If you had one minute to advise a 13-year-old about to get their first smartphone, what would you say — based on what you know now?"', note: 'This consolidates their learning into advice — a form of teaching themselves. It\'s also a powerful empathy exercise.' },
    ],
    watchOutFor: [
      'Students who take the trial too personally — either defending positions very aggressively or seeming distressed by arguments that mirror their own situation. Watch carefully.',
      'The prosecution who creates a genuinely unfair pile-on. Intervene as "judge": "Prosecution, you\'ve established your point. Let\'s hear the defence."',
      'Students who check their own social media during the session — common in this age group. Address the irony gently: "Perfect timing for that."',
    ],
    variations: [
      { tag: 'Grade 10', text: 'Simplify the trial: Prosecution vs Defence only, no witness roles. 5-minute arguments each, then class votes on impact.' },
      { tag: 'Grade 12', text: 'Add a fourth "witness": a future version of the student (played by a classmate) who describes how this post affected their life. Powerful.' },
      { tag: 'Limited time', text: 'Skip the trial entirely. Just present the Evidence Packet, discuss the 5 debrief questions as a class. 20-minute version is still impactful.' },
      { tag: 'Tech-forward class', text: 'Show a real (anonymised) example of a public figure whose early social media posts resurfaced. Multiple examples are easily findable with a basic search.' },
    ],
    worksheet: {
      title: 'The Online Footprint Trial — Observation & Reflection',
      intro: 'Complete Part 1 during the trial, Part 2 after stepping out of role.',
      sections: [
        {
          title: '⚖️ Part 1 — During the Trial (Observer Notes)',
          prompts: [
            { label: 'The strongest argument I heard from the Prosecution:', lines: 2 },
            { label: 'The strongest argument I heard from the Defence:', lines: 2 },
            { label: 'Which side do I personally agree with more, and why?', lines: 2 },
          ]
        },
        {
          title: '🌐 Part 2 — My Digital Standards (as Yourself)',
          prompts: [
            { label: 'Something I currently do online that I would be uncomfortable explaining in 5 years:', lines: 2 },
            { label: 'What a POSITIVE digital presence that I\'m proud of would look like:', lines: 2 },
          ]
        },
        {
          title: '📋 Three Digital Rules I\'m Setting for Myself',
          prompts: [
            { label: '1.', lines: 1 },
            { label: '2.', lines: 1 },
            { label: '3.', lines: 1 },
            { label: 'What I\'d tell a younger student getting their first phone:', lines: 3 },
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
    objective: 'Students will experience the challenges of leadership under information asymmetry, identify what makes verbal communication effective under pressure, and articulate the difference between two leadership styles: directive and facilitative.',
    materials: ['Pre-built simple structure (built from paper, blocks, or stacked items — hidden in a box/bag)', 'Identical materials for each team to build with (paper, tape, scissors, small blocks)', 'A screen or cloth to hide the original', 'Worksheet'],
    phases: [
      {
        time: '0–5 min', phase: 'Setup',
        steps: [
          { type: 'do', text: 'Before class: build a structure 15–20 cm tall using simple materials (paper folded into shapes, blocks, etc.). Place it in a box that only the "Architect" in each team can see.' },
          { type: 'say', text: '"Today\'s activity is about communication, leadership, and what happens when one person knows something the rest of the team doesn\'t. This is called information asymmetry — and it\'s one of the most common leadership challenges in real organisations."' },
          { type: 'do', text: 'Form teams of 4–5. In each team, assign one Architect (the only person who can see the original structure) and 3–4 Builders (who cannot see it).' },
          { type: 'say', text: '"Rules: The Architect may NOT touch the building materials. The Architect may NOT draw anything. The Architect may ONLY use words. Builders may ask questions. You have 10 minutes."' },
        ]
      },
      {
        time: '5–15 min', phase: 'Building Round 1 — Directive Leadership',
        steps: [
          { type: 'say', text: '"For Round 1: Architect, you will TELL the builders exactly what to do. Step by step. Directive instructions only — you decide, they execute."' },
          { type: 'do', text: 'Set a 10-minute timer. Run the round. Circulate and observe — focus on: how does the Architect handle confusion? How do Builders respond to unclear instructions? What breaks down first?' },
          { type: 'pause', text: 'At the end of 10 minutes, stop the build. Have teams briefly reveal the original and compare. Note the gap — but don\'t debrief yet.' },
        ]
      },
      {
        time: '15–25 min', phase: 'Building Round 2 — Facilitative Leadership',
        steps: [
          { type: 'say', text: '"Now we try again with a different structure — and a different leadership style. This time: the Architect must INVITE ideas. Instead of telling, the Architect asks: \'What do you think would work here?\' \'Does that feel stable to you?\' The team is the expert. The Architect is the guide."' },
          { type: 'do', text: 'Give each team a new, different structure to recreate. Run 8 minutes.' },
          { type: 'pause', text: 'Compare results. Do teams produce a more accurate replica? Does the team feel different?' },
          { type: 'tip', text: 'Most teams produce a MORE accurate result in Round 2 — but not always. What always changes is the team experience: Builders feel more invested, less frustrated, more creative.' },
        ]
      },
      {
        time: '25–30 min', phase: 'Individual Reflection',
        steps: [
          { type: 'do', text: 'Students complete the worksheet independently for 5 minutes: documenting what worked, what failed, and their own leadership style observations.' },
        ]
      },
      {
        time: '30–35 min', phase: 'Debrief',
        steps: [
          { type: 'say', text: '"Let\'s talk about what just happened — but we\'re going to connect it to leadership beyond this room."' },
          { type: 'do', text: 'Use the debrief questions. Take 5 minutes. Don\'t rush this.' },
        ]
      },
    ],
    debrief: [
      { q: '"Architects: what was the hardest part of describing the structure using only words? What did you learn about your own communication?"', note: 'Common insights: "I assumed they\'d understand what I meant", "I forgot they couldn\'t see what I see", "When they asked questions I realised I\'d been unclear."' },
      { q: '"Builders: what did it feel like in Round 1 (directive) versus Round 2 (facilitative)? What was different in your engagement?"', note: 'Almost universally: Round 2 feels better. More autonomy, more investment, more enjoyment. Connect to: how do YOU want to be led?' },
      { q: '"Which leadership style produced a BETTER result in your team — directive or facilitative? Was that what you expected?"', note: 'The answer varies. This is the complexity: facilitative leadership is generally better for engagement, but directive can be faster in emergencies. Both have their place.' },
      { q: '"In your own life — at home, in group projects, in sports — are you more often directive or facilitative? Which do you PREFER to be led by?"', note: 'This personal reflection bridges the activity to identity. Most students say they prefer to be led facilitatively but default to directive when they\'re in charge.' },
      { q: '"What\'s one thing you\'ll do differently in the next group project you lead, based on today?"', note: 'End with a concrete commitment. Students should be able to name one specific behaviour change.' },
    ],
    watchOutFor: [
      'An Architect who gives up and lets the team figure it out entirely — disengaged from the challenge. Prompt: "How would you describe this piece if I couldn\'t see it at all?"',
      'Builders who stop trying because the instructions are unclear. Encourage: "You can ask questions — what do you need to know?"',
      'Teams where one Builder takes over and begins directing everyone else — a secondary leadership dynamic. Note it and bring it into the debrief: "Did anyone notice a second leader emerging among the Builders? What did that look like?"',
      'Structures that are too complex for 10 minutes. Pre-test your structure. Aim for something replicable in 8–10 minutes with clear instructions.',
    ],
    variations: [
      { tag: 'Grade 10', text: 'Use simpler structures (3–5 pieces). Focus the debrief on communication rather than leadership theory.' },
      { tag: 'Grade 12', text: 'Add a third round: Architect may ONLY answer yes/no questions from builders. Produces frustrating but powerful learning about communication constraints.' },
      { tag: 'Large class', text: 'Have half the class be Observers with a specific observation task: "Watch the Architect. Write down every moment the communication breaks down and why."' },
      { tag: 'No materials', text: 'Replace the structure build with a verbal map-drawing task: Architect describes a simple diagram; Builders reproduce it on paper from verbal description only.' },
    ],
    worksheet: {
      title: 'The Blind Architect — Leadership Reflection',
      intro: 'Reflect on both rounds. Be honest about what you noticed in yourself.',
      sections: [
        {
          title: '🏗️ Round 1 — Directive Leadership',
          twoCol: true,
          colTitles: ['What WORKED', 'What BROKE DOWN'],
          prompts: [
            { label: 'As Architect, the hardest thing about giving instructions was:', lines: 2 },
            { label: 'As Builder, the moment I felt most frustrated was:', lines: 2 },
          ]
        },
        {
          title: '🤝 Round 2 — Facilitative Leadership',
          prompts: [
            { label: 'What changed in the team\'s energy and engagement in Round 2?', lines: 2 },
            { label: 'Which round produced better results for your team — and why?', lines: 2 },
          ]
        },
        {
          title: '🪞 My Leadership Reflection',
          prompts: [
            { label: 'My natural default when I\'m leading is: (circle)  Directive  /  Facilitative  /  I avoid leading', lines: 0 },
            { label: 'A situation where directive leadership is the right choice:', lines: 1 },
            { label: 'A situation where facilitative leadership is the right choice:', lines: 1 },
            { label: 'One specific thing I will do differently in my next group project:', lines: 2 },
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
        <div className="lst-card-print-btns no-print" onClick={e => e.stopPropagation()}>
          <button className="lst-print-btn guide" onClick={() => onPrint(activity, 'guide')}>📄 Facilitator PDF</button>
          <button className="lst-print-btn ws" onClick={() => onPrint(activity, 'worksheet')}>📝 Student Worksheet</button>
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
              <p style={{ fontSize: '13px', color: 'var(--ls-muted)', marginBottom: '16px', lineHeight: 1.6 }}>Preview of the student worksheet. Click "Student Worksheet" above to download the print-ready version.</p>
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
              <p className="lst-hero-sub">10 fully elaborated, classroom-ready life skills activities for school counsellors — each with a step-by-step facilitation script, debrief guide, and printable student worksheet. Designed for 30–40 minute class periods, Grade 5 to Grade 12.</p>
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
