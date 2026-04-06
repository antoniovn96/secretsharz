/**
 * POSH Resource Hub
 * src/resources/posh/POSHResource.jsx
 *
 * One page. Two tabs.
 *
 * Tab 1 — Women's Rights:
 *   What POSH is · What counts as harassment · Your 8 legal rights ·
 *   How to file a complaint · Investigation process · Remedies ·
 *   ICC vs LCC · District-wise LCC directory (real contacts) ·
 *   State Women's Commissions · 24/7 Helplines · Myths vs Facts ·
 *   Legal Glossary · Scenario Recogniser interactive quiz (8 scenarios)
 *
 * Tab 2 — Organisations & Compliance:
 *   Who must comply · ICC formation rules · Policy requirements ·
 *   Training obligations · Inquiry process · Annual reporting ·
 *   Penalties table · 10 Employer duties ·
 *   Live 30-point Compliance Audit Checklist with auto-scoring
 *
 * Print: Each tab produces a clean A4 handbook via browser print
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --p-navy:#1A2340; --p-navy-mid:#243058; --p-navy-soft:#2E3D6E;
  --p-rose:#C0734A; --p-rose-light:#D4896A; --p-rose-pale:#FDF0EA;
  --p-teal:#0D6E72; --p-teal-light:#0F8A8F; --p-teal-pale:#E0F2F3;
  --p-gold:#B8860B; --p-gold-pale:#FBF5E0;
  --p-cream:#FDFBF8; --p-sand:#F5F0E8; --p-border:rgba(26,35,64,.1);
  --p-ink:#1A2340; --p-ink-soft:#3A4560; --p-muted:#7A8099;
  --p-success:#2D7D46; --p-danger:#8B1A1A; --p-warn:#B85C00;
  --p-shadow-sm:0 2px 12px rgba(26,35,64,.07);
  --p-shadow-md:0 8px 32px rgba(26,35,64,.12);
  --p-r:18px;
}

/* ── Shell ── */
.p-page { min-height:100vh; background:var(--p-cream); padding-bottom:80px; font-family:'Plus Jakarta Sans',sans-serif; }

/* ── Top Bar ── */
.p-topbar { background:var(--p-navy); height:56px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:300; border-bottom:3px solid var(--p-rose); }
.p-back { color:rgba(255,255,255,.65); font-size:13px; font-weight:700; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; transition:color .2s; }
.p-back:hover { color:white; }
.p-topbar-center { font-family:'Fraunces',serif; font-size:15px; color:white; }
.p-print-btn { display:flex; align-items:center; gap:5px; padding:8px 16px; border-radius:50px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:all .2s; border:1px solid rgba(192,115,74,.35); background:rgba(192,115,74,.15); color:var(--p-rose-light); }
.p-print-btn:hover { background:var(--p-rose); color:white; border-color:var(--p-rose); }

/* ── Hero ── */
.p-hero { background:linear-gradient(135deg,var(--p-navy) 0%,var(--p-navy-mid) 55%,#1B1535 100%); padding:56px 48px 44px; position:relative; overflow:hidden; }
.p-hero-blob-1 { position:absolute; width:480px; height:480px; background:radial-gradient(circle,rgba(192,115,74,.14),transparent 70%); top:-150px; right:-80px; pointer-events:none; border-radius:50%; }
.p-hero-blob-2 { position:absolute; width:300px; height:300px; background:radial-gradient(circle,rgba(13,110,114,.1),transparent 70%); bottom:-80px; left:200px; pointer-events:none; border-radius:50%; }
.p-hero-inner { max-width:980px; margin:0 auto; position:relative; z-index:1; }
.p-hero-eyebrow { display:inline-flex; align-items:center; gap:8px; background:rgba(192,115,74,.18); border:1px solid rgba(192,115,74,.35); color:var(--p-rose-light); padding:7px 16px; border-radius:50px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:18px; }
.p-hero-h1 { font-family:'Fraunces',serif; font-size:clamp(30px,4.5vw,48px); font-weight:700; color:white; line-height:1.1; letter-spacing:-1px; margin-bottom:14px; }
.p-hero-h1 em { font-style:italic; color:var(--p-rose-light); }
.p-hero-sub { font-size:16px; color:rgba(255,255,255,.62); line-height:1.75; max-width:620px; margin-bottom:22px; font-weight:300; }
.p-sos-row { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:18px; }
.p-sos-pill { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); border-radius:50px; padding:8px 18px; display:flex; align-items:center; gap:10px; }
.p-sos-pill .num { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:white; line-height:1; }
.p-sos-pill .lbl { font-size:12px; color:rgba(255,255,255,.75); font-weight:600; }
.p-sos-pill .sub { font-size:10px; color:rgba(255,255,255,.45); }
.p-hero-note { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:11px 16px; font-size:12px; color:rgba(255,255,255,.48); line-height:1.65; border-left:3px solid rgba(192,115,74,.45); max-width:700px; }

/* ── Main Tabs (Women / Organisations) ── */
.p-main-tabs { background:white; border-bottom:2px solid var(--p-border); position:sticky; top:56px; z-index:200; box-shadow:var(--p-shadow-sm); }
.p-main-tabs-inner { max-width:980px; margin:0 auto; display:flex; padding:0 48px; }
.p-main-tab { padding:16px 28px; font-size:15px; font-weight:700; cursor:pointer; border:none; background:none; font-family:'Fraunces',serif; color:var(--p-muted); border-bottom:3px solid transparent; transition:all .2s; display:flex; align-items:center; gap:8px; white-space:nowrap; }
.p-main-tab:hover { color:var(--p-ink); }
.p-main-tab.women.active { color:var(--p-rose); border-bottom-color:var(--p-rose); }
.p-main-tab.orgs.active  { color:var(--p-teal); border-bottom-color:var(--p-teal); }

/* ── Sub-nav (section scroll links) ── */
.p-subnav { background:var(--p-sand); border-bottom:1px solid var(--p-border); overflow-x:auto; scrollbar-width:none; }
.p-subnav::-webkit-scrollbar { display:none; }
.p-subnav-inner { max-width:980px; margin:0 auto; display:flex; padding:0 48px; min-width:max-content; }
.p-subnav-btn { padding:10px 14px; font-size:12px; font-weight:600; cursor:pointer; border:none; background:none; font-family:inherit; color:var(--p-muted); border-bottom:2px solid transparent; transition:all .2s; white-space:nowrap; }
.p-subnav-btn:hover { color:var(--p-ink); }
.p-subnav-btn.women-active { color:var(--p-rose); border-bottom-color:var(--p-rose); }
.p-subnav-btn.orgs-active  { color:var(--p-teal); border-bottom-color:var(--p-teal); }

/* ── Content Shell ── */
.p-content { max-width:980px; margin:0 auto; padding:36px 48px; }

/* ── Section Accordion ── */
.p-sec { background:white; border-radius:var(--p-r); border:1.5px solid var(--p-border); margin-bottom:18px; overflow:hidden; box-shadow:var(--p-shadow-sm); transition:box-shadow .25s; }
.p-sec:hover { box-shadow:var(--p-shadow-md); }
.p-sec-hdr { padding:20px 26px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:background .2s; }
.p-sec-hdr:hover { background:rgba(26,35,64,.02); }
.p-sec-icon { font-size:24px; flex-shrink:0; }
.p-sec-meta { flex:1; }
.p-sec-num  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:2px; }
.p-sec-num.women { color:var(--p-rose); }
.p-sec-num.orgs  { color:var(--p-teal); }
.p-sec-title { font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:var(--p-ink); }
.p-chevron { font-size:14px; color:var(--p-muted); transition:transform .25s; flex-shrink:0; }
.p-sec.open .p-chevron { transform:rotate(90deg); }
.p-sec-body { border-top:1px solid var(--p-border); padding:22px 26px; animation:pFade .3s ease; }
@keyframes pFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── Content blocks (shared) ── */
.p-body  { font-size:15px; color:var(--p-ink-soft); line-height:1.8; margin-bottom:14px; }
.p-women-box { background:linear-gradient(135deg,#F0EDF8,#FDF0EA); border-radius:12px; padding:16px 20px; margin:14px 0; border-left:4px solid var(--p-rose); }
.p-women-box h4 { font-family:'Fraunces',serif; font-size:14px; color:var(--p-rose); margin:0 0 6px; }
.p-women-box ul,.p-women-box p { font-size:13px; color:var(--p-ink-soft); line-height:1.7; margin:0; padding-left:14px; }
.p-teal-box { background:var(--p-teal-pale); border-radius:12px; padding:16px 20px; margin:14px 0; border-left:4px solid var(--p-teal); }
.p-teal-box h4 { font-family:'Fraunces',serif; font-size:14px; color:var(--p-teal); margin:0 0 6px; }
.p-teal-box ul,.p-teal-box p { font-size:13px; color:var(--p-ink-soft); line-height:1.7; margin:0; padding-left:14px; }
.p-key-box { background:linear-gradient(135deg,#EEF0FA,#E8F5EE); border-radius:12px; padding:16px 20px; margin:14px 0; border-left:4px solid var(--p-navy-soft); }
.p-key-box h4 { font-family:'Fraunces',serif; font-size:14px; color:var(--p-navy); margin:0 0 6px; }
.p-key-box ul,.p-key-box ol { padding-left:18px; margin:0; font-size:14px; color:var(--p-ink-soft); line-height:1.75; }
.p-key-box li { margin-bottom:4px; }
.p-danger-box { background:#FEE2E2; border-radius:12px; padding:16px 20px; margin:14px 0; border-left:4px solid var(--p-danger); }
.p-danger-box h4 { font-family:'Fraunces',serif; font-size:14px; color:var(--p-danger); margin:0 0 6px; }
.p-danger-box p,.p-danger-box ul { font-size:13px; color:var(--p-ink-soft); line-height:1.65; margin:0; padding-left:14px; }
.p-info-box { background:#EEF0FA; border-radius:12px; padding:16px 20px; margin:14px 0; border-left:4px solid var(--p-navy-soft); }
.p-info-box h4 { font-family:'Fraunces',serif; font-size:14px; color:var(--p-navy); margin:0 0 6px; }
.p-info-box p { font-size:13px; color:var(--p-ink-soft); line-height:1.65; margin:0; }
.p-steps { list-style:none; padding:0; margin:14px 0; counter-reset:pstep; }
.p-steps li { counter-increment:pstep; display:flex; gap:14px; padding:12px 16px; border-radius:12px; margin-bottom:8px; background:var(--p-sand); border:1px solid var(--p-border); font-size:14px; color:var(--p-ink-soft); line-height:1.65; }
.p-steps li::before { content:counter(pstep); width:26px; height:26px; border-radius:50%; background:var(--p-navy); color:white; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
.p-two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:14px 0; }
.p-col { border-radius:12px; padding:16px 18px; }
.p-col-green { background:#E8F5EE; }
.p-col-red   { background:#FEE2E2; }
.p-col-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
.p-col-green .p-col-title { color:#065F46; }
.p-col-red   .p-col-title { color:#991B1B; }
.p-col-list { list-style:none; padding:0; margin:0; }
.p-col-list li { font-size:13px; color:#1F2937; padding:4px 0; display:flex; gap:6px; line-height:1.5; }
.p-col-green .p-col-list li::before { content:'✓'; color:#059669; font-weight:700; flex-shrink:0; }
.p-col-red   .p-col-list li::before { content:'✗'; color:#DC2626; font-weight:700; flex-shrink:0; }
.p-timeline { margin:14px 0; }
.p-tl-item { display:flex; gap:16px; margin-bottom:12px; }
.p-tl-dots { display:flex; flex-direction:column; align-items:center; }
.p-tl-dot { width:13px; height:13px; border-radius:50%; background:var(--p-rose); flex-shrink:0; margin-top:3px; }
.p-tl-dot.teal { background:var(--p-teal); }
.p-tl-line { width:2px; background:rgba(192,115,74,.2); flex:1; margin:4px 0; min-height:18px; }
.p-tl-body { flex:1; padding-bottom:4px; }
.p-tl-time  { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--p-rose); margin-bottom:3px; }
.p-tl-time.teal { color:var(--p-teal); }
.p-tl-title { font-weight:700; color:var(--p-ink); font-size:14px; margin-bottom:3px; }
.p-tl-desc  { font-size:13px; color:var(--p-muted); line-height:1.6; }
.p-myths-table { width:100%; border-collapse:collapse; margin:14px 0; border-radius:10px; overflow:hidden; font-size:13px; }
.p-myths-table th { background:var(--p-navy); color:white; padding:10px 14px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
.p-myths-table td { padding:11px 14px; border-bottom:1px solid var(--p-border); color:var(--p-ink-soft); line-height:1.55; vertical-align:top; }
.p-myths-table tr:nth-child(even) td { background:rgba(26,35,64,.02); }
.p-myth-lbl { color:#C0392B; font-weight:700; font-size:10px; text-transform:uppercase; display:block; margin-bottom:3px; }
.p-fact-lbl  { color:#27AE60; font-weight:700; font-size:10px; text-transform:uppercase; display:block; margin-bottom:3px; }
.p-glossary { list-style:none; padding:0; margin:14px 0; }
.p-glossary li { padding:10px 14px; border-radius:10px; margin-bottom:7px; background:var(--p-sand); border:1px solid var(--p-border); font-size:14px; color:var(--p-ink-soft); line-height:1.6; }
.p-glossary li strong { color:var(--p-navy); font-weight:700; }
.p-rights-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:14px 0; }
.p-right-card { background:var(--p-sand); border-radius:14px; padding:16px 18px; border:1px solid var(--p-border); }
.p-right-num   { font-family:'Fraunces',serif; font-size:26px; font-weight:700; color:var(--p-rose); line-height:1; margin-bottom:5px; }
.p-right-title { font-weight:700; color:var(--p-ink); font-size:14px; margin-bottom:3px; }
.p-right-desc  { font-size:12px; color:var(--p-muted); line-height:1.6; }
.p-right-law   { font-size:11px; font-weight:700; color:var(--p-navy-soft); margin-top:4px; }

/* ── Helplines ── */
.p-sos-banner { background:linear-gradient(135deg,#8B1A1A,#A0291E); border-radius:14px; padding:18px 22px; margin-bottom:14px; display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
.p-sos-banner .big-num { font-family:'Fraunces',serif; font-size:44px; font-weight:700; color:white; line-height:1; }
.p-sos-banner h4 { font-family:'Fraunces',serif; font-size:17px; color:white; margin:0 0 3px; }
.p-sos-banner p  { font-size:13px; color:rgba(255,255,255,.75); margin:0; }
.p-helplines { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:10px; margin:14px 0; }
.p-hcard { background:var(--p-navy); border-radius:12px; padding:16px 18px; }
.p-hcard h4   { font-family:'Fraunces',serif; font-size:13px; color:white; margin:0 0 4px; }
.p-hcard .num { font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--p-rose-light); margin:3px 0; display:block; }
.p-hcard .avl { font-size:11px; color:rgba(255,255,255,.45); }
.p-hcard .eml { font-size:10px; color:rgba(255,255,255,.45); margin-top:3px; word-break:break-all; }

/* ── LCC Directory ── */
.p-lcc-search { width:100%; padding:11px 16px; border:2px solid var(--p-border); border-radius:50px; font-size:14px; font-family:inherit; outline:none; transition:border .2s; margin-bottom:14px; box-sizing:border-box; }
.p-lcc-search:focus { border-color:var(--p-rose); }
.p-state-hdr { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--p-navy); margin:18px 0 10px; display:flex; align-items:center; gap:10px; }
.p-state-hdr::after { content:''; flex:1; height:1px; background:var(--p-border); }
.p-lcc-card { background:var(--p-sand); border-radius:12px; padding:14px 16px; margin-bottom:8px; border:1px solid var(--p-border); }
.p-lcc-district { font-weight:700; color:var(--p-ink); font-size:13px; margin-bottom:6px; }
.p-lcc-members { font-size:12px; color:var(--p-muted); line-height:1.65; margin-bottom:7px; }
.p-lcc-contacts { display:flex; gap:7px; flex-wrap:wrap; }
.p-cpill { display:inline-flex; align-items:center; gap:4px; padding:3px 11px; border-radius:20px; font-size:11px; font-weight:600; text-decoration:none; transition:opacity .2s; }
.p-cpill:hover { opacity:.8; }
.p-cpill.phone { background:var(--p-rose-pale); border:1px solid rgba(192,115,74,.3); color:var(--p-rose); }
.p-cpill.email { background:#EEF0FA; border:1px solid rgba(46,61,110,.2); color:var(--p-navy-soft); }
.p-no-lcc { background:rgba(192,115,74,.07); border:1px dashed rgba(192,115,74,.3); border-radius:10px; padding:14px 16px; font-size:13px; color:var(--p-rose); line-height:1.6; }

/* ── SWC ── */
.p-swc-card { background:white; border-radius:10px; border:1.5px solid var(--p-border); padding:12px 16px; margin-bottom:8px; display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap; }
.p-swc-state { font-weight:700; color:var(--p-ink); font-size:13px; min-width:180px; }

/* ── Online Banner ── */
.p-online-banner { background:linear-gradient(135deg,var(--p-navy),var(--p-navy-soft)); border-radius:14px; padding:20px 24px; margin:14px 0; display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
.p-online-banner h4 { font-family:'Fraunces',serif; font-size:16px; color:white; margin:0 0 3px; }
.p-online-banner p  { font-size:13px; color:rgba(255,255,255,.68); margin:0; }
.p-online-banner a  { display:inline-block; margin-top:9px; background:var(--p-rose); color:white; padding:8px 18px; border-radius:50px; font-size:13px; font-weight:700; text-decoration:none; }

/* ── ICC Grid (Orgs) ── */
.p-icc-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px; margin:14px 0; }
.p-icc-card { border-radius:13px; padding:16px 18px; border:1px solid var(--p-border); }
.p-icc-card h4 { font-family:'Fraunces',serif; font-size:14px; font-weight:700; margin:0 0 5px; }
.p-icc-card p  { font-size:12px; line-height:1.6; margin:0; }
.p-icc-presiding { background:linear-gradient(135deg,var(--p-navy),var(--p-navy-soft)); }
.p-icc-presiding h4 { color:white; }
.p-icc-presiding p  { color:rgba(255,255,255,.6); }
.p-icc-member   { background:var(--p-teal-pale); }
.p-icc-member h4 { color:var(--p-teal); }
.p-icc-member p  { color:var(--p-muted); }
.p-icc-external { background:var(--p-gold-pale); }
.p-icc-external h4 { color:var(--p-gold); }
.p-icc-external p  { color:var(--p-muted); }
.p-icc-rule { background:var(--p-sand); border-radius:9px; padding:9px 13px; margin-top:10px; font-size:12px; color:var(--p-muted); font-weight:600; }

/* ── Penalty Table ── */
.p-penalty-table { width:100%; border-collapse:collapse; margin:14px 0; border-radius:10px; overflow:hidden; font-size:13px; }
.p-penalty-table th { background:var(--p-navy); color:white; padding:9px 13px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
.p-penalty-table td { padding:10px 13px; border-bottom:1px solid var(--p-border); color:var(--p-ink-soft); line-height:1.55; vertical-align:top; }
.p-penalty-table tr:nth-child(even) td { background:rgba(26,35,64,.02); }
.p-pbadge { padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; }
.p-pbadge.high { background:#FEE2E2; color:var(--p-danger); }
.p-pbadge.mid  { background:#FDF0EA; color:var(--p-warn); }

/* ── Compliance Audit ── */
.p-audit { background:white; border-radius:var(--p-r); border:1.5px solid var(--p-border); margin-top:36px; overflow:hidden; box-shadow:var(--p-shadow-md); }
.p-audit-hdr { background:linear-gradient(135deg,var(--p-teal),var(--p-teal-light)); padding:26px 30px; }
.p-audit-hdr h3 { font-family:'Fraunces',serif; font-size:21px; color:white; margin:0 0 5px; }
.p-audit-hdr p  { font-size:13px; color:rgba(255,255,255,.72); margin:0; line-height:1.55; }
.p-audit-score-strip { display:flex; align-items:center; gap:18px; background:rgba(255,255,255,.12); border-radius:12px; padding:13px 18px; margin-top:16px; flex-wrap:wrap; }
.p-audit-num { font-family:'Fraunces',serif; font-size:40px; font-weight:700; color:white; line-height:1; }
.p-audit-lbl { font-size:12px; color:rgba(255,255,255,.65); font-weight:600; }
.p-audit-bar-wrap { flex:1; min-width:180px; }
.p-audit-bar-bg   { height:9px; background:rgba(255,255,255,.2); border-radius:5px; overflow:hidden; }
.p-audit-bar-fill { height:100%; border-radius:5px; transition:width .6s ease,background .4s; }
.p-audit-status { padding:4px 13px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
.p-audit-status.compliant    { background:rgba(45,125,70,.25); color:#A7E3BE; }
.p-audit-status.partial      { background:rgba(184,92,0,.25);  color:#FFD090; }
.p-audit-status.noncompliant { background:rgba(139,26,26,.3);  color:#FFAAAA; }
.p-audit-body { padding:22px 30px 30px; }
.p-audit-cat { margin-bottom:26px; }
.p-audit-cat-title { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--p-ink); margin-bottom:10px; display:flex; align-items:center; gap:9px; }
.p-audit-cat-score { font-size:12px; font-weight:700; color:var(--p-teal); background:var(--p-teal-pale); padding:2px 9px; border-radius:20px; }
.p-audit-item { display:flex; align-items:flex-start; gap:11px; padding:11px 14px; border-radius:10px; margin-bottom:6px; border:1.5px solid var(--p-border); cursor:pointer; transition:all .18s; background:white; }
.p-audit-item:hover { border-color:var(--p-teal); background:var(--p-teal-pale); }
.p-audit-item.checked { border-color:var(--p-success); background:#E8F5EE; }
.p-audit-item.mandatory { border-left-width:4px; border-left-color:var(--p-teal); }
.p-audit-item.mandatory.checked { border-left-color:var(--p-success); }
.p-audit-cb { width:21px; height:21px; border-radius:6px; border:2px solid var(--p-border); display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; margin-top:1px; transition:all .18s; }
.p-audit-item.checked .p-audit-cb { background:var(--p-success); border-color:var(--p-success); color:white; }
.p-audit-item-text { font-size:14px; font-weight:600; color:var(--p-ink); line-height:1.4; margin-bottom:3px; }
.p-audit-item.checked .p-audit-item-text { color:var(--p-success); }
.p-audit-item-sub  { font-size:12px; color:var(--p-muted); line-height:1.5; }
.p-audit-item-tags { display:flex; gap:5px; margin-top:3px; flex-wrap:wrap; }
.p-atag { padding:2px 7px; border-radius:20px; font-size:10px; font-weight:700; }
.p-atag.mandatory { background:rgba(13,110,114,.1); color:var(--p-teal); }
.p-atag.legal     { background:#EEF0FA; color:var(--p-navy-soft); }
.p-atag.annual    { background:var(--p-gold-pale); color:var(--p-gold); }
.p-audit-gaps { background:var(--p-sand); border-radius:12px; padding:16px 20px; margin-bottom:20px; }
.p-audit-gaps-title { font-family:'Fraunces',serif; font-size:15px; font-weight:700; color:var(--p-ink); margin-bottom:8px; }
.p-audit-gap-list { list-style:none; padding:0; margin:0; }
.p-audit-gap-list li { display:flex; gap:7px; font-size:13px; color:var(--p-danger); padding:4px 0; border-bottom:1px solid rgba(0,0,0,.05); line-height:1.5; }
.p-audit-gap-list li::before { content:'⚠'; flex-shrink:0; }
.p-audit-btns { display:flex; gap:8px; flex-wrap:wrap; padding-top:14px; border-top:1px solid var(--p-border); }
.p-audit-btn { padding:10px 22px; border-radius:50px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:all .2s; }
.p-audit-btn.reset { background:white; border:2px solid var(--p-teal); color:var(--p-teal); }
.p-audit-btn.reset:hover { background:var(--p-teal); color:white; }
.p-audit-btn.print { background:var(--p-navy); border:none; color:white; }
.p-audit-btn.print:hover { background:var(--p-navy-soft); }
.p-audit-legend { margin-top:12px; font-size:11px; color:var(--p-muted); line-height:1.65; }

/* ── Scenario Quiz ── */
.p-quiz { background:white; border-radius:var(--p-r); border:1.5px solid var(--p-border); margin-top:36px; overflow:hidden; box-shadow:var(--p-shadow-md); }
.p-quiz-hdr { background:linear-gradient(135deg,var(--p-navy),var(--p-navy-mid)); padding:26px 30px; }
.p-quiz-hdr h3 { font-family:'Fraunces',serif; font-size:21px; color:white; margin:0 0 5px; }
.p-quiz-hdr p  { font-size:13px; color:rgba(255,255,255,.62); margin:0; line-height:1.55; }
.p-quiz-prog-wrap { height:4px; background:rgba(255,255,255,.12); margin-top:16px; border-radius:2px; overflow:hidden; }
.p-quiz-prog-fill { height:100%; background:var(--p-rose-light); border-radius:2px; transition:width .4s ease; }
.p-quiz-body { padding:26px 30px; }
.p-quiz-meta { display:flex; align-items:center; gap:9px; margin-bottom:13px; flex-wrap:wrap; }
.p-quiz-label { background:var(--p-sand); border:1px solid var(--p-border); padding:3px 11px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--p-muted); }
.p-quiz-score { background:var(--p-rose-pale); color:var(--p-rose); padding:3px 11px; border-radius:20px; font-size:12px; font-weight:700; }
.p-quiz-q { font-family:'Fraunces',serif; font-size:18px; font-weight:600; color:var(--p-ink); line-height:1.45; margin-bottom:18px; animation:pFade .3s ease; }
.p-quiz-opts { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.p-quiz-opt { padding:13px 15px; border:2px solid var(--p-border); border-radius:12px; background:white; font-size:13px; font-weight:600; color:var(--p-ink-soft); cursor:pointer; text-align:left; font-family:inherit; transition:all .18s; line-height:1.4; }
.p-quiz-opt:hover:not(:disabled) { border-color:var(--p-rose); background:var(--p-rose-pale); }
.p-quiz-opt:disabled { cursor:default; }
.p-quiz-opt.correct { border-color:var(--p-success); background:#E8F5EE; color:var(--p-success); }
.p-quiz-opt.wrong   { border-color:var(--p-danger);  background:#FEE2E2; color:var(--p-danger); }
.p-quiz-opt.missed  { border-color:var(--p-success); background:#E8F5EE; color:var(--p-success); opacity:.5; }
.p-quiz-reveal { background:var(--p-sand); border-radius:12px; padding:16px 18px; margin-top:14px; animation:pFade .3s ease; border-left:4px solid var(--p-rose); }
.p-quiz-verdict { display:inline-flex; align-items:center; gap:5px; padding:3px 11px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
.p-quiz-verdict.yes { background:rgba(139,26,26,.1); color:var(--p-danger); }
.p-quiz-verdict.no  { background:#E8F5EE; color:var(--p-success); }
.p-quiz-type    { font-size:12px; font-weight:700; color:var(--p-rose); margin-bottom:5px; }
.p-quiz-explain { font-size:14px; color:var(--p-ink-soft); line-height:1.72; }
.p-quiz-legal   { font-size:11px; color:var(--p-navy-soft); margin-top:7px; font-weight:600; background:#EEF0FA; border-radius:7px; padding:7px 11px; }
.p-quiz-next-btn { margin-top:14px; padding:11px 26px; background:var(--p-navy); color:white; border:none; border-radius:50px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:all .2s; }
.p-quiz-next-btn:hover { background:var(--p-navy-soft); }
.p-quiz-result { text-align:center; padding:22px 0; animation:pFade .4s ease; }
.p-quiz-result-icon { font-size:56px; margin-bottom:10px; }
.p-quiz-result h3 { font-family:'Fraunces',serif; font-size:24px; color:var(--p-ink); margin-bottom:5px; }
.p-big-score { font-family:'Fraunces',serif; font-size:50px; font-weight:700; color:var(--p-navy); line-height:1; }
.p-quiz-result p { font-size:14px; color:var(--p-muted); margin:8px auto 18px; max-width:460px; line-height:1.6; }
.p-quiz-retake { background:white; border:2px solid var(--p-navy); color:var(--p-navy); padding:11px 26px; border-radius:50px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:all .2s; }
.p-quiz-retake:hover { background:var(--p-navy); color:white; }

/* ── Print ── */
@media print {
  @page { size:A4; margin:18mm 18mm 22mm; }
  .p-topbar,.p-main-tabs,.p-subnav,.p-quiz,.p-audit,.p-print-btn,.no-print { display:none !important; }
  .p-page { background:white; padding:0; }
  .p-hero { background:var(--p-navy) !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; padding:28px 32px !important; }
  .p-content { padding:20px 0; }
  .p-sec-body { display:block !important; }
  .p-chevron { display:none; }
  .p-sec { break-inside:avoid; border:1px solid #ccc !important; box-shadow:none !important; }
  .p-key-box,.p-women-box,.p-teal-box,.p-danger-box,.p-info-box,.p-rights-grid,.p-steps,.p-timeline,.p-two-col,.p-myths-table,.p-helplines,.p-hcard,.p-lcc-card,.p-swc-card,.p-icc-card,.p-penalty-table { -webkit-print-color-adjust:exact; print-color-adjust:exact; break-inside:avoid; }
  .p-sos-banner,.p-online-banner { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .print-footer { display:block !important; position:fixed; bottom:12mm; left:18mm; right:18mm; text-align:center; font-size:9px; color:#888; border-top:1px solid #ddd; padding-top:6px; }
}
.print-footer { display:none; }

@media(max-width:768px) {
  .p-hero { padding:44px 20px 36px; }
  .p-content { padding:24px 16px; }
  .p-rights-grid,.p-two-col,.p-quiz-opts,.p-icc-grid { grid-template-columns:1fr; }
  .p-topbar,.p-main-tabs-inner,.p-subnav-inner { padding-left:16px; padding-right:16px; }
  .p-topbar-center { display:none; }
  .p-helplines { grid-template-columns:1fr 1fr; }
}
`;

// ─── DATA: LCC DIRECTORY ─────────────────────────────────────────────────────
// Source: poshatwork.com/local-committee-list & district govt sites, Jan 2026
const LCC_DATA = [
  { state:'Arunachal Pradesh', districts:[
    { name:'Anjaw', members:'Smti Guilalu Mitti (Chair), Smti Chenumlu Khamblai, Smti Beauty Pul, Shri Barum Massong, Smti S.C. Meyor', phones:['9485293937','9402629511','9436235118','9436813743'], emails:[] },
  ]},
  { state:'Assam', districts:[
    { name:'Kamrup', members:'Dr. Kasturi Gakul (Chair), Sri Rubul Sharma (DSWO), Ms Remsiami Naiding, Ms. Anita Rana, Shabnam Begum, Ms. Nikita Barooah', phones:['9707457352','8474078435','8794306271','6001734025','9864126020'], emails:['dc-kamrup@nic.in'] },
  ]},
  { state:'Delhi', districts:[
    { name:'New Delhi', members:'Ms. Noopur Singhal (Chair/Advocate), Ms. Amrita Sharma (Advocate), District Officer WCD, Ms. Sonia Rani — Prerna NGO, Ms. Savita Chauhan', phones:['9312765888'], emails:['dcnd@nic.in'] },
  ]},
  { state:'Goa', districts:[
    { name:'South Goa', members:'Adv. Reshma Prabhu (Chair), Smt Ramola Almeida, Smt Ana Audria Fernandes, Ms Areela Haji, Smt Rukmi Dangui, District Welfare Officer WCD (Member Secretary)', phones:['0832-2794810'], emails:['magbr-cols.goa@nic.in'] },
    { name:'North Goa', members:'Dr. Meenacshi Martins (Chair), Mamlatdar (Member Secretary), WCD District Officer (Ex-officio), Adv. Prerna Matkar, Smt. Nirmala Andrade', phones:['9158604999'], emails:[] },
  ]},
  { state:'Jammu & Kashmir', districts:[
    { name:'Kupwara', members:'Mrs Farhat Sadiq (Chair), Miss Shameema Akhter, Rubeena Rashid', phones:['7006924679','7889886540','7780978474'], emails:['padckupwara@gmail.com'] },
  ]},
  { state:'Kerala', districts:[
    { name:'Malappuram', members:'Sri PK Sainaba (Chair), Sri VT Safiya, Sri Soumya P, Adv Bincy Bhaskar, District Welfare Officer WCD (Member Secretary)', phones:['9485293937','9656629351','9946530261','9446147499'], emails:[] },
  ]},
  { state:'Mizoram', districts:[
    { name:'Mamit', members:'Pi Vanlalhruaii (Chair), Pi Lalthanpuii, Pi R.L. Zampuii, Pi Lalhriatpuii Hauhnar, Pi V.L. Remruati Hmar', phones:['0389-2565220'], emails:['dcmamit1998@gmail.com'] },
  ]},
  { state:'Odisha', districts:[
    { name:'Cuttack', members:'Smt. Mrunalini Padhy (Chair), Smt Anita Patra, Giridhari Nayak, Ashok Kumar Dalai, Smt Babita Samantaray', phones:['9338111242','9437354155','9438703254','9437195504'], emails:['dm-cuttack@nic.in'] },
    { name:'Jharsuguda', members:'Anandini Padhi (Chair), Mitali Rana, Jane Merry Pious, Kalyani Pattnaik, Brundabati Panda (Ex-officio)', phones:['9437347467','8895047113','7978894344','8763147222'], emails:['dm-jharsuguda@nic.in'] },
  ]},
  { state:'Puducherry', districts:[
    { name:'Puducherry', members:'Tmt. Vidya Ramkumar (Presiding Officer)', phones:['4132299502'], emails:['dcrev.pon@nic.in'] },
  ]},
  { state:'Telangana', districts:[
    { name:'Adilabad',       members:'Smt. Sarita (Chair), Kum. Sravani, Smt. Manjulatha, Smt. Sumitra, Smt. Milkah (Ex-officio)',                                phones:['9440060606'],                        emails:['collector_adbd@telangana.gov.in'] },
    { name:'Hyderabad',      members:'Dr. Himabindu (Chair), Smt. Venkata Naramsamma, Smt. C. Sunitha, Jameela Nishath',                                           phones:['9849024007','9573175940'],            emails:['collector_hyd@telangana.gov.in'] },
    { name:'Jagtial',        members:'Smt. J. Aruna Sri (Chair), Smt. L. Srilatha, Smt. Umbadevi, Smt. M Jaysri, Smt. G Rajitha',                                 phones:['7995084601'],                        emails:['collector-jgtl@telangana.gov.in'] },
    { name:'Jangaon',        members:'Smt. J. Adilaxmi (Chair), Smt. B. Padmaja, Smt. Sunitha, Smt. Rukhmini Devi, Smt. G Ramadevi',                              phones:['9550798666'],                        emails:['collector-jgn@telangana.gov.in'] },
    { name:'Gadwal',         members:'Smt. Jayabharati (Chair), Smt. T. Padma, Smt. Vinoda, Smt. K Shobharani',                                                    phones:['9440454853','9951314358'],            emails:['collector-gdwl@telangana.gov.in'] },
    { name:'Karimnagar',     members:'Smt. Padmavati (Chair), Smt. Ch Shailasri Mallika, Smt Jayasri, Smt. K Thirupathamma, Smt. M Sharada (Ex-officio)',          phones:['8782240749'],                        emails:['collector_krmn@telangana.gov.in'] },
    { name:'Khammam',        members:'Smt. M Kumudini (Chair), Smt. Sreelakshmi, Smt. Sandhya Rani, Smt Vijaya Nirmala, Adv. Nasreen',                            phones:['8106633018'],                        emails:['collector_kmm@telangana.gov.in'] },
    { name:'Kammareddy',     members:'Smt. Vijayalaxmi (Chair), Smt. Shylaja, Smt. B Sharada Devi, Smt Indrani Devi, Smt. M Radhamma (Ex-officio)',                phones:['8331028986'],                        emails:['collector-kmr@telangana.gov.in'] },
    { name:'Mahabubnagar',   members:'Smt. Subhashi (Chair), Smt. Nagamallika, Smt. Usha Rani, Smt. P Aruna (Legal Coordinator), Smt. N.K Swaroopa (Convenor)',   phones:['2442210'],                           emails:['collector_mbnr@telangana.gov.in'] },
    { name:'Macherial',      members:'Smt. Shyamala Devi (Chair), Smt. Hema Satya, Smt. Chidananda Kumari, Smt. Dr. Anitha, Oggylamma ASI',                       phones:['8790738727','9491051704','9849993682'], emails:['dmwomanmancherial@gmail.com','kvchidananda@gmail.com'] },
    { name:'Nalgonda',       members:'Smt V.K. Pavani (Chair), Smt. T Nirmala CDPO, Smt. S Sandhya Rani Advocate, Smt. L Manmada Gender Activist',                phones:['9985915000'],                        emails:['collector_nlgd@telangana.gov.in'] },
    { name:'Nagarkurnool',   members:'Smt. Bhagyamma (Chair), Smt. G Govardini, Smt. Ch. Venkataramana, Smt. Bhavani',                                            phones:['7702417766','9885013699','9491051720'], emails:['collector-wnp@telangana.gov.in'] },
    { name:'Nirmal',         members:'Smt. N. Prasunamba (Chair), Smt. D.E Manjula Rani, Smt. Dr K. Rajini, Smt. Ch Archana, Smt. A Vijayalaxmi (Convenor)',      phones:['9493400011'],                        emails:['collector_nzbd@telangana.gov.in'] },
    { name:'Nizamabad',      members:'Dr. Smt. S Kavitha Reddy (Chair), Smt. Rekha, Smt. S Jyoti, Smt. M Neerja Reddy, Project Director (Ex-officio)',            phones:['8462221966'],                        emails:['collector_nzbd@telangana.gov.in'] },
    { name:'Peddapalli',     members:'Smt K Jyothi (Chair), Smt. G Swaroopa, Smt. K Kavitha, Smt. Madasi Padma, Smt. Dasari Bhavani, Sri E. Kameshwar Rao (Ex-officio)', phones:['7997725054','9491051719','8341996666'], emails:['Hselo.peddapalli@gmail.com','bhavanidaarielagandula@gmail.com'] },
    { name:'Rajanna Sircilla', members:'Smt. M Jhansi Laxmi (Chair), Smt Rajeshwari, Smt. E Jyoti, Smt. Ch. Aruna, Smt. M Saraswati (Ex-officio)',               phones:['8723232344'],                        emails:['collector-rsl@telangana.gov.in'] },
    { name:'Rangareddy',     members:'J.L.B Hari Priya (Chair), Smt. K Padmaja Rani, Smt. Rama Devi, Dr. N Sunanda, Smt. G Rama, G. Subba Laxmi, Smt. K Satyavathi, Smt. N Mothi (Ex-officio)', phones:['7675918781','9490957029','7702466616','8885552280'], emails:['collector_rr@telangana.gov.in'] },
    { name:'Sangareddy',     members:'Smt. C Sailaja (Chair), Smt. B Geetha, Smt. Shiva Kumari, Smt. K Chandrakala, Smt. N Mothi',                               phones:['9440696193','9000962314','9490129740'], emails:['collector-srd@telangana.gov.in'] },
    { name:'Sidipet',        members:'Smt. K Rama Lakshmi (Chair), Smt. G Saroja, Smt. K Shiva Kumari, Smt. Swaroopa, Smt. Zarina Begum, Smt. G.K Santhoshi Bai', phones:['8790738727','9491051704'],          emails:[] },
    { name:'Suryapet',       members:'Smt. L Vijaya Lakshmi CEO ZP (Chair), Smt. Dayananda Rani, Smt. T Vijaya Lakshmi CDPO, Smt. G Rama Devi, Smt. Vanaja (Social Worker)', phones:['9493721230'], emails:['collector-srpt@telangana.gov.in'] },
    { name:'Vikarabad',      members:'Smt. S Indira (Chair), Smt. K Sanjamma, Dandae Shobha Rani, Smt. Padmalatha Reddy, Smt. G.S Jyotsana (Ex-officio)',         phones:['9703933251','9550828810','9652807354'], emails:['collector-vkb@telangana.gov.in'] },
    { name:'Warangal Rural', members:'Smt. H Haritha (Chair), Smt. M Sabitha (Ex-officio), Smt. Usha Dayal, Smt. T Nirmala, Smt. A Mamatha Raghuveer',           phones:['8702540022'],                        emails:['collector-wglr@telangana.gov.in'] },
    { name:'Warangal Urban', members:'Smt D Usha (Chair), Smt M Sharda (Ex-officio), Sri M Vasu Chandra, Smt. Krishnaveni, Sri Parushuramulu, Smt. Hymavathi, Smt. Indira', phones:['7288894705','9440814433','9704550803'], emails:['cp@wrlc.tspolice.gov.in'] },
    { name:'Wanaparthy',     members:'Smt. Chinnama Thomas (Chair), Smt. Yamuna, Smt. Kalpana (Ex-officio)',                                                        phones:['9100904739'],                        emails:['collector-wnp@telangana.gov.in'] },
  ]},
  { state:'West Bengal', districts:[
    { name:'Howrah',         members:'Smt. Amrita Ghosh (Chair), Sri Jagabandhu Pal (DSWO), Smt. Saswati Das, Smt. Suparna Chakrabarty, Smt. Nupur Mukherjee, Smt. Rahima Khatun', phones:['9434734119'], emails:['dswohowrah@gmail.com'] },
    { name:'Jalpaiguri',     members:'Dr. Uma Maji (Chair), Sri Dinabandhu Saha (DSWO), Smt. Rosy Lama Tamang, Smt. Sumitra Roy, Smt. Shikha Mitra Majumdar',     phones:['7797861700'],                        emails:['dsdwojalpaiguri@yahoo.com'] },
    { name:'Uttar Dinajpur', members:'Smt. Kalpana Roy (Chair), Smt. Swati Roy Dutta (DSWO), Smt Pemdiki Sherpa, Smt Sumita Pal, Smt Jaba Bhattacharya',          phones:['9875692207'],                        emails:['dswoud@gmail.com'] },
  ]},
];

// ─── DATA: State Women's Commissions (NCW, Jan 2026) ─────────────────────────
const SWC_DATA = [
  { state:'Andhra Pradesh', phone:'+91-9009991911', email:'apwomenscommission@gmail.com' },
  { state:'Arunachal Pradesh', phone:'0360-2290549', email:'apscwitanagar@gmail.com' },
  { state:'Assam', phone:'0361-2220013', email:'ascwguwahatia@gmail.com' },
  { state:'Bihar', phone:'0612-2507800', email:'biharswc@gmail.com' },
  { state:'Chhattisgarh', phone:'0771-2433488', email:'cgmahilaayog@gmail.com' },
  { state:'Goa', phone:'0832-2421080', email:'goawomenscommission@gmail.com' },
  { state:'Gujarat', phone:'079-23251613', email:'' },
  { state:'Himachal Pradesh', phone:'0177-2621394', email:'hpscw@nic.in' },
  { state:'Jharkhand', phone:'0651-2210103', email:'mahilaayog@jharkhand.gov.in' },
  { state:'Karnataka', phone:'080-22202364', email:'kswc@nic.in' },
  { state:'Kerala', phone:'0471-2322590', email:'wckerala@gmail.com' },
  { state:'Madhya Pradesh', phone:'0755-2767566', email:'mpswc@nic.in' },
  { state:'Maharashtra', phone:'022-26592707', email:'mscw@nic.in' },
  { state:'Manipur', phone:'0385-2224031', email:'' },
  { state:'Odisha', phone:'0674-2390052', email:'scwodisha@gmail.com' },
  { state:'Punjab', phone:'0172-2740420', email:'pswc2011@gmail.com' },
  { state:'Rajasthan', phone:'0141-2779001', email:'rscw@nic.in' },
  { state:'Tamil Nadu', phone:'044-28592750', email:'tnwc@nic.in' },
  { state:'Telangana', phone:'040-23390538', email:'tswc@telangana.gov.in' },
  { state:'Uttar Pradesh', phone:'0522-2305978', email:'mhm-up@nic.in' },
  { state:'Uttarakhand', phone:'0135-2719001', email:'ukswc@nic.in' },
  { state:'West Bengal', phone:'033-22485880', email:'wbwc@nic.in' },
  { state:'Delhi — DCW', phone:'011-23379181', email:'dcw.delhi@nic.in' },
];

// ─── DATA: Scenarios (8 workplace situations) ─────────────────────────────────
const SCENARIOS = [
  { id:1, label:'Scenario A', sit:'Your male senior makes repeated weekly comments in team meetings: "You look so pretty today" and "You should wear this colour more often." Colleagues laugh. This has gone on for months.', opts:['Not harassment — it\'s a compliment','Sexual harassment — hostile work environment','Only harassment if he touches you','Depends on seniority'], correct:1, isHarass:true, type:'Hostile Work Environment (Section 2(n))', explain:'Unwelcome sexually coloured remarks — even framed as compliments — constitute harassment. Your discomfort, not his intention, is the legal standard. Repetition and public humiliation establish a hostile environment.', legal:'Section 2(n) POSH: "unwelcome act of a sexual nature" includes "sexually coloured remarks." Intent is legally irrelevant.' },
  { id:2, label:'Scenario B', sit:'Your manager says he will recommend your promotion only if you "have dinner with him sometime." He winks. He has not touched you or followed through.', opts:['Sexual harassment — Quid Pro Quo','Not harassment — just dinner','Only harassment if he follows through','Not harassment — his call to promote'], correct:0, isHarass:true, type:'Quid Pro Quo Harassment', explain:'Tying a professional benefit (promotion) to a sexual implication is Quid Pro Quo. You need not comply, be touched, or face the consequence — the moment the condition is stated, the offence is complete.', legal:'Section 2(n)(ii) + Section 3(2)(ii) POSH: "demand for sexual favours" or "promise of preferential treatment" constitute harassment.' },
  { id:3, label:'Scenario C', sit:'A colleague sends sexually explicit WhatsApp messages from their personal phone at 11pm. When you don\'t reply, three more arrive over the next week — progressively more explicit.', opts:['Not harassment — outside the workplace','Sexual harassment — digital contact is covered','Only if sent during work hours','Only if sent from a work phone'], correct:1, isHarass:true, type:'Digital / Online Harassment (Section 2(o))', explain:'POSH fully covers digital communications between colleagues regardless of device or time of day. The workplace definition under Section 2(o) extends to all communication arising from the employment relationship.', legal:'Section 2(o) POSH defines "workplace" broadly. Supreme Court has affirmed digital harassment is fully covered under the Act.' },
  { id:4, label:'Scenario D', sit:'A colleague from another team asks you on a date. You decline politely. He accepts graciously and never raises it again.', opts:['Sexual harassment — he should not have asked','Not harassment — a respectful declined invitation','Harassment — you felt uncomfortable momentarily','Depends on his position level'], correct:1, isHarass:false, type:'Not Harassment — Respectful Single Inquiry', explain:'A single invitation, immediately and graciously accepted upon refusal, is NOT harassment. POSH requires conduct to be unwelcome AND persistent or hostile. A single respectful request that is dropped does not cross this threshold.', legal:'The legal threshold requires "unwelcome" conduct PLUS persistence or hostile environment. A single respectful request does not satisfy this.' },
  { id:5, label:'Scenario E', sit:'On a company offsite trip, a senior leader attempts to kiss you without consent after dinner. He apologises the next morning saying he "doesn\'t remember." The trip was on a Saturday, away from the office.', opts:['Not harassment — off-duty and he apologised','Sexual harassment — company trips are covered workplaces','Borderline — apology changes things','Only if it happened at the office'], correct:1, isHarass:true, type:'Physical Harassment at Extended Workplace', explain:'Company trips, offsites, and work dinners are covered "workplaces" under POSH. An apology has no legal standing as a defence. Physical contact without consent is among the most serious POSH offences.', legal:'Section 2(o): workplace includes "any place visited by the employee arising out of or during the course of employment." IPC Sections 354 and 354A may also apply simultaneously.' },
  { id:6, label:'Scenario F', sit:'You are an unpaid intern. Your manager makes repeated inappropriate remarks. You wonder: does POSH even cover interns?', opts:['POSH covers only permanent employees','POSH covers interns fully — you have all rights','Only if you are paid','Only HR can file on your behalf'], correct:1, isHarass:true, type:'Coverage: Interns and All Workers', explain:'POSH covers ALL women at a workplace — permanent, contractual, temporary, interns, volunteers, trainees, domestic workers. There is no distinction based on employment type or payment. You have full rights to file with the ICC or LCC.', legal:'Section 2(a) POSH: "aggrieved woman" means any woman employed "on a regular, temporary, ad hoc or daily wage basis." Interns are explicitly included.' },
  { id:7, label:'Scenario G', sit:'A vendor visiting your office makes a sexually charged comment about your appearance. He is not your company\'s employee — he works for a supplier.', opts:['Not covered — only employees can be respondents','POSH covers vendors and clients fully','Only HR can handle this','Not harassment unless he returns'], correct:1, isHarass:true, type:'Third-Party Harassment — Vendor / Client', explain:'POSH covers harassment by any person, not just employees. Clients, vendors, contractors, and third parties can be respondents under the Act. Your employer has a statutory duty under Section 19(h) to take action.', legal:'Section 19(h): employers must "take preemptive action against third-party harassment." Section 2(m): "respondent" means any individual.' },
  { id:8, label:'Scenario H', sit:'After filing a POSH complaint, your manager moves you to a less visible project and removes your travel privileges with no explanation. The investigation is still ongoing.', opts:['Legal — management can reassign anytime','Retaliation — prohibited under POSH','Only if explicitly linked to your complaint','Not illegal if salary is unchanged'], correct:1, isHarass:true, type:'Retaliation After Complaint', explain:'Any adverse employment action against a complainant during or after a POSH complaint — reassignment, demotion, isolation, benefit removal — is retaliation: an independently punishable offence. You can simultaneously request interim ICC protection.', legal:'Section 12: ICC can recommend interim transfer or paid leave. Section 17: any retaliatory treatment is independently punishable under Section 26 POSH.' },
];

// ─── DATA: Audit checklist ────────────────────────────────────────────────────
const AUDIT_CATS = [
  { id:'icc', title:'🏛️ ICC Formation & Structure', items:[
    { id:'icc1', text:'ICC formally constituted with a written notification signed by the employer',                     sub:'A written order must be issued — verbal constitution does not count', tags:['mandatory','legal'] },
    { id:'icc2', text:'Presiding Officer is a senior woman employee',                                                  sub:'If unavailable internally, nominate from another office or unit', tags:['mandatory','legal'] },
    { id:'icc3', text:'ICC has at least 4 members (Presiding Officer + min. 2 employees + 1 external member)',          sub:'Minimum statutory composition — not a guideline', tags:['mandatory','legal'] },
    { id:'icc4', text:'At least 50% of all ICC members are women',                                                     sub:'Counts all members including the external member', tags:['mandatory','legal'] },
    { id:'icc5', text:'External member is from an NGO, legal background, or familiar with workplace harassment',       sub:'Must have NO employment relationship with the organisation', tags:['mandatory','legal'] },
    { id:'icc6', text:'Member terms documented — 3-year tenure, formal appointment letters issued',                    sub:'Members cannot be removed without cause during their term', tags:['legal'] },
    { id:'icc7', text:'ICC contact details visibly displayed at all office/branch locations',                          sub:'Name, phone, and email of Presiding Officer must be posted conspicuously', tags:['mandatory','legal'] },
  ]},
  { id:'policy', title:'📄 Policy & Documentation', items:[
    { id:'pol1', text:'Written POSH Policy exists and has been formally adopted',                                       sub:'Must define harassment, complaint procedure, and disciplinary consequences', tags:['mandatory','legal'] },
    { id:'pol2', text:'Policy shared with all employees at onboarding with signed acknowledgement',                     sub:'Signed copy kept in employee\'s personnel file', tags:['mandatory'] },
    { id:'pol3', text:'Policy available in a language all employees understand',                                       sub:'Translated versions required for non-English-speaking workforce', tags:['mandatory'] },
    { id:'pol4', text:'Policy includes step-by-step complaint procedure with ICC contacts and 3-month deadline',        sub:'Specific steps — generic "contact HR" is legally insufficient', tags:['mandatory','legal'] },
    { id:'pol5', text:'Policy explicitly covers digital and online harassment',                                        sub:'WhatsApp, email, social media, and all digital communications', tags:['legal'] },
    { id:'pol6', text:'Policy includes confidentiality and non-retaliation protections for complainants',               sub:'Sections 16–17 mandates — must be written in the policy', tags:['mandatory','legal'] },
    { id:'pol7', text:'Policy reviewed and updated at least every 2 years (or after any complaint)',                   sub:'Review date and approving authority must be documented', tags:['annual'] },
  ]},
  { id:'training', title:'🎓 Training & Awareness', items:[
    { id:'tr1', text:'All employees received POSH awareness training covering definitions, rights, complaint process', sub:'At least once at joining; annual refresher recommended — documentation mandatory', tags:['mandatory'] },
    { id:'tr2', text:'ICC members trained on inquiry procedure, natural justice, and evidence assessment',              sub:'ICC members conducting inquiries without training risk legal challenge to findings', tags:['mandatory'] },
    { id:'tr3', text:'Managers and senior leadership received separate, specific POSH training',                       sub:'Managers who suppress or mishandle complaints face personal liability', tags:['mandatory'] },
    { id:'tr4', text:'Training records maintained — attendance, dates, content, and acknowledgements',                sub:'Required during any government inspection or inquiry', tags:['mandatory','legal'] },
    { id:'tr5', text:'POSH awareness is part of the annual organisational calendar',                                   sub:'Section 19(c): "at regular intervals" is the statutory standard, not a one-time event', tags:['annual'] },
  ]},
  { id:'complaint', title:'📋 Complaint Handling', items:[
    { id:'comp1', text:'Clear documented procedure for receiving complaints — written and verbally assisted options',   sub:'ICC must assist complainants who cannot write independently', tags:['mandatory','legal'] },
    { id:'comp2', text:'ICC acknowledges complaints in writing within 7 days',                                         sub:'Verbal acknowledgement does not satisfy Section 9 requirements', tags:['mandatory','legal'] },
    { id:'comp3', text:'Investigations completed within 60 days of complaint receipt',                                 sub:'The 60-day statutory limit — exceeding it is itself a POSH violation', tags:['mandatory','legal'] },
    { id:'comp4', text:'Interim relief options (transfer, leave) made available and communicated',                     sub:'Section 12: both parties\' transfer options must be actively considered', tags:['mandatory','legal'] },
    { id:'comp5', text:'Complainants protected from retaliation — monitored during and after inquiry',                 sub:'Any retaliatory action is an independently punishable offence under Section 17', tags:['mandatory','legal'] },
    { id:'comp6', text:'Complainant receives a copy of the ICC inquiry report',                                        sub:'Section 13(2): mandatory — not optional or at management discretion', tags:['mandatory','legal'] },
    { id:'comp7', text:'Employer implements ICC recommendations within 60 days of receiving report',                   sub:'Non-implementation is a separate POSH violation with penalties', tags:['mandatory','legal'] },
  ]},
  { id:'reporting', title:'📊 Annual Report & Records', items:[
    { id:'rep1', text:'ICC submits Annual Report to employer each calendar year (Section 21)',                          sub:'Must include: complaints received, disposed, pending, training conducted, action taken', tags:['mandatory','legal','annual'] },
    { id:'rep2', text:'Annual Report submitted to District Officer',                                                   sub:'Section 21(2): statutory submission — not just internal record keeping', tags:['mandatory','legal','annual'] },
    { id:'rep3', text:'Complaint records maintained confidentially and securely for minimum 5 years',                  sub:'Names, proceedings, outcomes documented — no public disclosure at any time', tags:['mandatory','legal'] },
    { id:'rep4', text:'POSH compliance status included in Board/Annual Report (listed and large companies)',           sub:'Companies Act 2013, Section 134: listed companies must disclose to shareholders', tags:['legal','annual'] },
  ]},
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// LCC Directory with live search
function LCCDirectory() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q.trim()) return LCC_DATA;
    const qL = q.toLowerCase();
    return LCC_DATA.map(s => ({
      ...s,
      districts: s.districts.filter(d =>
        d.name.toLowerCase().includes(qL) ||
        s.state.toLowerCase().includes(qL) ||
        d.members.toLowerCase().includes(qL)
      )
    })).filter(s => s.districts.length > 0);
  }, [q]);

  return (
    <>
      <p className="p-body">
        District-wise LCC contacts verified from <strong>poshatwork.com</strong> and official district government websites, January 2026. These are the actual committees that handle POSH complaints for small organisations and unorganised sector workers.
      </p>
      <div className="p-info-box">
        <h4>📌 Your district not listed here?</h4>
        <p>Not all states publish LCC details online — this is a known gap across India. If your district is missing: (1) Call <strong>181</strong> (Women Helpline) — they will direct you to your local LCC. (2) Visit or call your District Collector's / DM's office and ask for the POSH LCC contact. (3) File online at <strong>shebox.nic.in</strong> — no office visit required. (4) Call NCW at <strong>7217735372</strong> for guidance.</p>
      </div>
      <input
        className="p-lcc-search"
        type="text"
        placeholder="Search by state, district, or member name…"
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      {filtered.length === 0 && (
        <div className="p-no-lcc">No results for "{q}". Try the state name, or use the national helplines (181 / 7217735372) to locate your local LCC.</div>
      )}
      {filtered.map(state => (
        <div key={state.state}>
          <div className="p-state-hdr">📍 {state.state}</div>
          {state.districts.map(d => (
            <div key={d.name} className="p-lcc-card">
              <div className="p-lcc-district">🏛️ {d.name} District — Local Complaints Committee (LCC)</div>
              <div className="p-lcc-members">{d.members}</div>
              <div className="p-lcc-contacts">
                {d.phones.map((p, i) => <a key={i} href={`tel:${p}`} className="p-cpill phone">📞 {p}</a>)}
                {d.emails.map((e, i) => <a key={i} href={`mailto:${e}`} className="p-cpill email">✉️ {e}</a>)}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ marginTop:'14px', padding:'12px 15px', background:'rgba(192,115,74,.07)', borderRadius:'10px', fontSize:'12px', color:'var(--p-rose)', lineHeight:1.65, border:'1px dashed rgba(192,115,74,.3)' }}>
        💡 LCC details are published only for districts that have proactively shared them. Contacts may change as members rotate every 3 years. Always follow up via 181 (Women Helpline) or your District Collector's office if you cannot reach an LCC listed here.
      </div>
    </>
  );
}

// Scenario Recogniser Quiz
function ScenarioQuiz() {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = SCENARIOS[qi];
  const handle = (i) => { if (sel !== null) return; setSel(i); if (i === q.correct) setScore(s => s + 1); };
  const next = () => { if (qi < SCENARIOS.length - 1) { setQi(i => i + 1); setSel(null); } else setDone(true); };
  const reset = () => { setQi(0); setSel(null); setScore(0); setDone(false); };
  const pct = Math.round((score / SCENARIOS.length) * 100);

  return (
    <div className="p-quiz no-print">
      <div className="p-quiz-hdr">
        <h3>⚖️ Scenario Recogniser — Is This Harassment?</h3>
        <p>8 real-world workplace situations. Identify whether each constitutes sexual harassment under POSH, and which type. Every answer includes the exact legal provision.</p>
        <div className="p-quiz-prog-wrap"><div className="p-quiz-prog-fill" style={{ width:`${((qi+1)/SCENARIOS.length)*100}%` }} /></div>
      </div>
      <div className="p-quiz-body">
        {!done ? (
          <>
            <div className="p-quiz-meta">
              <span className="p-quiz-label">{q.label} — {qi+1} of {SCENARIOS.length}</span>
              <span className="p-quiz-score">✓ {score} correct</span>
            </div>
            <div className="p-quiz-q" key={qi}>{q.sit}</div>
            <div className="p-quiz-opts">
              {q.opts.map((opt, i) => {
                let cls = 'p-quiz-opt';
                if (sel !== null) {
                  if (i === q.correct) cls += ' correct';
                  else if (i === sel) cls += ' wrong';
                  else cls += ' missed';
                }
                return <button key={i} className={cls} onClick={() => handle(i)} disabled={sel !== null}>{opt}</button>;
              })}
            </div>
            {sel !== null && (
              <>
                <div className="p-quiz-reveal">
                  <div className={`p-quiz-verdict ${q.isHarass ? 'yes' : 'no'}`}>
                    {q.isHarass ? '⚠️ This IS Sexual Harassment under POSH' : '✅ This does NOT constitute Harassment under POSH'}
                  </div>
                  <div className="p-quiz-type">{q.type}</div>
                  <div className="p-quiz-explain">{q.explain}</div>
                  <div className="p-quiz-legal">📌 Legal basis: {q.legal}</div>
                </div>
                <button className="p-quiz-next-btn" onClick={next}>
                  {qi < SCENARIOS.length - 1 ? 'Next Scenario →' : 'See My Results →'}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="p-quiz-result">
            <div className="p-quiz-result-icon">{pct >= 75 ? '⚖️' : pct >= 50 ? '📚' : '💪'}</div>
            <h3>All 8 Scenarios Complete</h3>
            <div className="p-big-score">{score}/{SCENARIOS.length}</div>
            <p>{pct >= 75 ? 'Strong awareness — you understand your rights clearly under the POSH Act.' : pct >= 50 ? 'Good foundation. Review the scenarios you missed — the legal distinctions matter in practice.' : 'These cover complex legal nuances. Review each explanation and keep this handbook accessible.'}</p>
            <button className="p-quiz-retake" onClick={reset}>↺ Retake Recogniser</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Compliance Audit Checklist
function ComplianceAudit() {
  const [checked, setChecked] = useState({});
  const allItems = AUDIT_CATS.flatMap(c => c.items);
  const total = allItems.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  const barColor = pct >= 80 ? '#2D7D46' : pct >= 50 ? '#B85C00' : '#8B1A1A';
  const statusKey = pct >= 80 ? 'compliant' : pct >= 50 ? 'partial' : 'noncompliant';
  const statusLabel = pct >= 80 ? '✅ Largely Compliant' : pct >= 50 ? '⚠️ Partially Compliant' : '🔴 Non-Compliant';
  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const reset = () => setChecked({});
  const uncheckedMandatory = allItems.filter(i => !checked[i.id] && i.tags?.includes('mandatory'));
  const catScore = (cat) => { const t = cat.items.length; const d = cat.items.filter(i => checked[i.id]).length; return { d, t, pct: Math.round((d/t)*100) }; };

  return (
    <div className="p-audit no-print">
      <div className="p-audit-hdr">
        <h3>✅ POSH Compliance Audit Checklist</h3>
        <p>Tick off each item your organisation currently has in place. The checklist auto-scores your compliance level and highlights critical mandatory gaps in real time.</p>
        <div className="p-audit-score-strip">
          <div>
            <div className="p-audit-num">{pct}%</div>
            <div className="p-audit-lbl">{done} of {total} items</div>
          </div>
          <div className="p-audit-bar-wrap">
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(255,255,255,.6)', marginBottom:'6px', fontWeight:700 }}>
              <span>Compliance Score</span>
              <span className={`p-audit-status ${statusKey}`}>{statusLabel}</span>
            </div>
            <div className="p-audit-bar-bg"><div className="p-audit-bar-fill" style={{ width:`${pct}%`, background:barColor }} /></div>
          </div>
        </div>
      </div>
      <div className="p-audit-body">
        {uncheckedMandatory.length > 0 && (
          <div className="p-audit-gaps">
            <div className="p-audit-gaps-title">⚠️ Critical Mandatory Gaps — {uncheckedMandatory.length} item{uncheckedMandatory.length !== 1 ? 's' : ''} outstanding</div>
            <ul className="p-audit-gap-list">
              {uncheckedMandatory.slice(0, 8).map(i => <li key={i.id}>{i.text}</li>)}
              {uncheckedMandatory.length > 8 && <li style={{ color:'var(--p-muted)' }}>…and {uncheckedMandatory.length - 8} more. Tick items above to track progress.</li>}
            </ul>
          </div>
        )}
        {pct === 100 && (
          <div style={{ background:'#E8F5EE', border:'1.5px solid var(--p-success)', borderRadius:'12px', padding:'14px 18px', marginBottom:'18px', fontSize:'14px', color:'var(--p-success)', fontWeight:600 }}>
            ✅ All {total} items checked. We recommend verifying documentation exists for each item and scheduling an external POSH audit to formally confirm compliance before any regulatory inspection.
          </div>
        )}
        {AUDIT_CATS.map(cat => {
          const { d, t, pct: cp } = catScore(cat);
          return (
            <div key={cat.id} className="p-audit-cat">
              <div className="p-audit-cat-title">{cat.title}<span className="p-audit-cat-score">{d}/{t} · {cp}%</span></div>
              {cat.items.map(item => (
                <div key={item.id}
                  className={`p-audit-item ${checked[item.id] ? 'checked' : ''} ${item.tags?.includes('mandatory') ? 'mandatory' : ''}`}
                  onClick={() => toggle(item.id)}>
                  <div className="p-audit-cb">{checked[item.id] ? '✓' : ''}</div>
                  <div style={{ flex:1 }}>
                    <div className="p-audit-item-text">{item.text}</div>
                    <div className="p-audit-item-sub">{item.sub}</div>
                    <div className="p-audit-item-tags">
                      {item.tags?.map(tag => (
                        <span key={tag} className={`p-atag ${tag}`}>
                          {tag === 'mandatory' ? '⚠ Mandatory' : tag === 'legal' ? '⚖ Legal Ref' : '📅 Annual'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        <div className="p-audit-btns">
          <button className="p-audit-btn reset" onClick={reset}>↺ Reset Checklist</button>
          <button className="p-audit-btn print" onClick={() => window.print()}>🖨️ Print Audit</button>
        </div>
        <div className="p-audit-legend">
          <strong style={{ color:'var(--p-teal)' }}>⚠ Mandatory</strong> — legally required; non-compliance may result in a ₹50,000 fine or licence cancellation. &nbsp;
          <strong style={{ color:'var(--p-navy-soft)' }}>⚖ Legal Ref</strong> — has a specific statutory provision you should read. &nbsp;
          <strong style={{ color:'var(--p-gold)' }}>📅 Annual</strong> — must be repeated or submitted every year.
        </div>
      </div>
    </div>
  );
}

// ─── WOMEN SECTIONS content renderers ────────────────────────────────────────
const WOMEN_SECTIONS = [
  { id:'w1', icon:'⚖️', title:'What is the POSH Act?', render:() => (
    <>
      <p className="p-body">The <strong>Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013</strong> is India's primary law protecting women from sexual harassment at work. It came into force on 9 December 2013 following the Supreme Court's Vishaka Guidelines (1997).</p>
      <div className="p-key-box"><h4>📌 What POSH does</h4><ul>
        <li>Defines sexual harassment comprehensively — verbal, non-verbal, physical, and digital</li>
        <li>Mandates every employer with 10+ employees to form an Internal Complaints Committee (ICC)</li>
        <li>Protects complainants from retaliation and prescribes penalties for non-compliant employers</li>
        <li>Applies to ALL women — permanent, contractual, interns, trainees, volunteers, domestic workers</li>
      </ul></div>
      <div className="p-info-box"><h4>📍 Where does it apply?</h4>
        <p>Any office, factory, hospital, school, college, sports facility, entertainment venue, employer-arranged transport, company trips, client meetings, and ALL digital communications between colleagues — regardless of device, time, or location.</p>
      </div>
    </>
  )},
  { id:'w2', icon:'🚫', title:'What Counts as Sexual Harassment?', render:() => (
    <>
      <p className="p-body">Section 2(n) defines sexual harassment as any <strong>unwelcome act or behaviour of a sexual nature</strong>. Your discomfort — not the perpetrator's intention — is the legal standard.</p>
      <div className="p-women-box"><h4>Conduct covered under POSH Section 2(n)</h4>
        <ul>
          <li>Physical contact or advances of a sexual nature</li>
          <li>Demand or request for sexual favours — explicit or implied</li>
          <li>Sexually coloured remarks — verbal, written, or electronic</li>
          <li>Showing pornography, explicit images, or obscene content</li>
          <li>Leering, staring, or offensive gestures of a sexual nature</li>
          <li>Sexually explicit messages, emails, WhatsApp, or social media content</li>
          <li>Online grooming, soliciting intimate images, sextortion</li>
        </ul>
      </div>
      <div className="p-two-col">
        <div className="p-col p-col-green"><div className="p-col-title">⚡ Quid Pro Quo type</div>
          <ul className="p-col-list"><li>Promotion tied to sexual favour</li><li>Salary increase made conditional</li><li>Job security threatened for refusal</li></ul>
        </div>
        <div className="p-col p-col-red"><div className="p-col-title">🌐 Hostile Environment type</div>
          <ul className="p-col-list"><li>Repeated sexual jokes or comments</li><li>Persistent unwanted attention</li><li>Displaying explicit content at work</li></ul>
        </div>
      </div>
      <div className="p-women-box"><h4>⚠️ Digital harassment is fully covered</h4>
        <p>WhatsApp, email, Instagram DMs, any digital communication between colleagues — covered regardless of device, time, or whether it happened "outside the office." The test: did it arise from the employment relationship?</p>
      </div>
    </>
  )},
  { id:'w3', icon:'🛡️', title:'Your 8 Legal Rights Under POSH', render:() => (
    <>
      <p className="p-body">These are legally enforceable rights — not optional policies. Every woman at an Indian workplace is entitled to all eight.</p>
      <div className="p-rights-grid">
        {[
          { n:'01', t:'Safe Workplace', d:'Your employer is legally obligated to provide a harassment-free environment. This duty cannot be waived or contracted away.', l:'Section 19(a)' },
          { n:'02', t:'Right to File a Complaint', d:'File with the ICC within 3 months of the incident — extendable by 3 months. You may also file on behalf of a colleague unable to do so.', l:'Section 9' },
          { n:'03', t:'Absolute Confidentiality', d:'Your identity, complaint, proceedings, and findings are strictly confidential at all times — even years after the case closes. Media cannot name you.', l:'Sections 16–17' },
          { n:'04', t:'Interim Protection', d:'Request ICC to recommend your transfer, grant paid leave up to 3 months, or instruct the respondent not to contact you — while the inquiry is ongoing.', l:'Section 12' },
          { n:'05', t:'No Retaliation', d:'Any adverse employment action for filing — reassignment, demotion, isolation, benefit removal — is a separate POSH violation with independent penalties.', l:'Section 17' },
          { n:'06', t:'Fair Inquiry', d:'You present your case, submit evidence, name witnesses. You will never be directly cross-examined by the respondent or their representative.', l:'Sections 11–13' },
          { n:'07', t:'Compensation', d:'If upheld, you receive monetary compensation for mental trauma, career loss, and medical expenses — recommended by ICC, paid by employer or deducted from respondent.', l:'Section 15' },
          { n:'08', t:'Parallel Criminal Action', d:'A POSH complaint does not prevent you from simultaneously filing under IPC Sections 354, 354A, or 509. Both processes run in parallel.', l:'IPC + POSH Act' },
        ].map(r => (
          <div key={r.n} className="p-right-card">
            <div className="p-right-num">{r.n}</div>
            <div className="p-right-title">{r.t}</div>
            <div className="p-right-desc">{r.d}</div>
            <div className="p-right-law">📌 {r.l}</div>
          </div>
        ))}
      </div>
    </>
  )},
  { id:'w4', icon:'📋', title:'How to File a Complaint — Step by Step', render:() => (
    <>
      <p className="p-body">You do not need a lawyer to file. The process is designed so any woman can navigate it independently, with strong protections at every stage.</p>
      <ol className="p-steps">
        <li><strong>Document everything immediately.</strong> Write down dates, times, exact words used, witnesses present, and your emotional response. Screenshot and save all messages and emails before they can be deleted.</li>
        <li><strong>Identify your ICC or LCC.</strong> If your employer has 10+ employees, ask HR for the ICC Presiding Officer's name and contact. ICC details must be displayed at the workplace. If no ICC or fewer than 10 employees, use the LCC (see Section 8).</li>
        <li><strong>Write your complaint.</strong> Address it to the ICC Presiding Officer. Include: what happened, when and where, who did it, witnesses, and the impact on you. Attach evidence. A support person may help you draft it.</li>
        <li><strong>Submit within 3 months.</strong> 3 months from the most recent incident. ICC can extend by another 3 months for genuine reasons — document those reasons when you file.</li>
        <li><strong>Receive written acknowledgement.</strong> ICC must acknowledge within 7 days. Keep this — it is proof your complaint was received and the inquiry has begun.</li>
        <li><strong>Request interim measures simultaneously.</strong> Ask ICC to transfer you or the respondent, grant paid leave, or prohibit the respondent from contacting you.</li>
        <li><strong>Attend inquiry proceedings.</strong> Present your case, submit additional evidence, name witnesses. No direct cross-examination by the respondent.</li>
        <li><strong>Receive the report.</strong> ICC must conclude within 60 days. You receive a copy of the report and recommendations.</li>
        <li><strong>Follow up on employer action.</strong> Employer must implement recommendations within 60 days. Non-implementation is itself a POSH violation — report to the District Officer.</li>
        <li><strong>Appeal if dissatisfied.</strong> File an appeal with the employer or a court petition within 90 days of receiving the report.</li>
      </ol>
      <div className="p-online-banner">
        <div>
          <h4>📱 File Online — No Office Visit Needed</h4>
          <p>SHe-Box covers both government and private sector employees. Your identity is fully protected.</p>
          <a href="https://shebox.nic.in" target="_blank" rel="noopener noreferrer">Open SHe-Box Portal →</a>
        </div>
      </div>
      <div className="p-women-box"><h4>⚠️ No ICC at your organisation?</h4>
        <p>Non-formation of ICC is punishable by a ₹50,000 fine. Report the employer's non-compliance to the District Officer AND file your complaint directly with the LCC or via SHe-Box online.</p>
      </div>
    </>
  )},
  { id:'w5', icon:'🔍', title:'The Investigation Process', render:() => (
    <>
      <p className="p-body">Once your complaint is received, a legally mandated inquiry process begins with strict timelines. The entire system is designed to protect you at every stage.</p>
      <div className="p-timeline">
        {[
          { t:'Within 7 days', ti:'Acknowledgement + Notice to Respondent', d:'ICC acknowledges your complaint. A copy is sent to the respondent, giving them 10 working days to file their written reply.' },
          { t:'Optional only', ti:'Conciliation — Only If You Request It', d:'ICC may attempt settlement only if YOU request it. You cannot be forced into conciliation. If it fails, inquiry proceeds.' },
          { t:'Days 10–60', ti:'Inquiry Proceedings', d:'ICC examines both parties separately. You submit evidence and name witnesses. No direct cross-examination by the respondent.' },
          { t:'Within 60 days', ti:'ICC Report Submitted', d:'ICC submits findings and recommendations to the employer and District Officer. You receive a copy.' },
          { t:'60 days from report', ti:'Employer Implements', d:'Employer must act on ICC recommendations. Non-implementation is a separate POSH violation. Both parties may appeal within 90 days.' },
        ].map((item, i) => (
          <div key={i} className="p-tl-item">
            <div className="p-tl-dots"><div className="p-tl-dot" />{i < 4 && <div className="p-tl-line" />}</div>
            <div className="p-tl-body">
              <div className="p-tl-time">{item.t}</div>
              <div className="p-tl-title">{item.ti}</div>
              <div className="p-tl-desc">{item.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-key-box"><h4>🔒 Your protections throughout</h4><ul>
        <li>Your identity and all proceedings are strictly confidential at all times</li>
        <li>Respondent cannot contact, intimidate, or retaliate against you during inquiry</li>
        <li>You may bring a support person of your choice to all proceedings</li>
        <li>ICC proceedings are quasi-judicial — employer cannot pressure or interfere</li>
      </ul></div>
    </>
  )},
  { id:'w6', icon:'💰', title:'Remedies & Compensation', render:() => (
    <>
      <div className="p-key-box"><h4>⚖️ Action against the respondent (Section 13)</h4><ul>
        <li>Written apology on official record</li>
        <li>Warning, reprimand, or censure</li>
        <li>Withholding of promotion or pay rise</li>
        <li>Termination of employment</li>
        <li>Compulsory counselling or community service</li>
      </ul></div>
      <div className="p-key-box"><h4>💰 Compensation for you (Section 15)</h4><ul>
        <li><strong>Mental trauma, pain, and emotional distress</strong> — assessed by ICC based on severity</li>
        <li>Career opportunity loss caused by the harassment</li>
        <li>Medical expenses for physical or psychiatric treatment</li>
        <li>Respondent's income and financial status considered when determining amount</li>
        <li>If respondent cannot pay, employer pays and deducts from respondent's salary</li>
      </ul></div>
      <div className="p-info-box"><h4>📌 Section 14 — False complaints</h4>
        <p>Action for false complaints requires ICC to find the complaint was made <em>knowingly</em> with <em>malicious intent</em>. An unproven complaint is NOT automatically false. You cannot be penalised for filing in good faith even if your complaint is not upheld. This protection is absolute.</p>
      </div>
    </>
  )},
  { id:'w7', icon:'🏛️', title:'ICC vs LCC — Which to Approach', render:() => (
    <>
      <div className="p-two-col">
        <div style={{ background:'#EEF0FA', borderRadius:'14px', padding:'18px' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'16px', fontWeight:700, color:'var(--p-navy)', marginBottom:'9px' }}>🏢 ICC — Internal Complaints Committee</div>
          <div style={{ fontSize:'13px', color:'var(--p-ink-soft)', lineHeight:1.7 }}>
            <strong>When:</strong> Your employer has 10 or more employees<br/><br/>
            <strong>Composition:</strong> Min. 4 members — senior woman Presiding Officer, min. 2 employees, 1 external member. ≥50% women.<br/><br/>
            <strong>Contact:</strong> Ask HR. ICC details must be displayed at the workplace.
          </div>
        </div>
        <div style={{ background:'var(--p-rose-pale)', borderRadius:'14px', padding:'18px' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'16px', fontWeight:700, color:'var(--p-rose)', marginBottom:'9px' }}>🏛️ LCC — Local Complaints Committee</div>
          <div style={{ fontSize:'13px', color:'var(--p-ink-soft)', lineHeight:1.7 }}>
            <strong>When:</strong> Fewer than 10 employees, no ICC, or complaint is against the employer<br/><br/>
            <strong>Composition:</strong> Eminent woman Chairperson, ≥2 women members, 1 NGO/legal member, WCD Officer (ex-officio).<br/><br/>
            <strong>Contact:</strong> District Collector's office. See Section 8 for district contacts.
          </div>
        </div>
      </div>
      <div className="p-key-box" style={{ marginTop:'12px' }}><h4>📌 If neither is functioning</h4><ul>
        <li>File online at <strong>shebox.nic.in</strong></li>
        <li>Call NCW: <strong>7217735372</strong> (Mon–Fri, office hours)</li>
        <li>Contact your State Women's Commission (see Section 9)</li>
        <li>File a writ petition before the High Court if the state has failed to constitute an LCC</li>
      </ul></div>
    </>
  )},
  { id:'w8', icon:'📍', title:'District-wise LCC Directory', render:() => <LCCDirectory /> },
  { id:'w9', icon:'🗺️', title:'State Women\'s Commissions', render:() => (
    <>
      <p className="p-body">State Women's Commissions can receive POSH complaints, conduct inquiries, and provide referrals to legal aid. Contact your state commission when the ICC or LCC is unreachable or non-functional.</p>
      <p style={{ fontSize:'12px', color:'var(--p-muted)', marginBottom:'14px', fontStyle:'italic' }}>Source: NCW (ncw.gov.in), updated January 2026. Verify on your State Women's Commission website if there is no response.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        {SWC_DATA.map(s => (
          <div key={s.state} className="p-swc-card">
            <div className="p-swc-state">{s.state}</div>
            <div style={{ display:'flex', gap:'7px', flexWrap:'wrap', alignItems:'center' }}>
              {s.phone && <a href={`tel:${s.phone}`} className="p-cpill phone">📞 {s.phone}</a>}
              {s.email && <a href={`mailto:${s.email}`} className="p-cpill email">✉️ {s.email}</a>}
            </div>
          </div>
        ))}
      </div>
      <div className="p-online-banner" style={{ marginTop:'14px' }}>
        <div>
          <h4>🌐 NCW Online Complaint Portal</h4>
          <p>File a complaint with the National Commission for Women — for all states, free, no office visit required.</p>
          <a href="https://ncwapps.nic.in/onlinecomplaintsv2/" target="_blank" rel="noopener noreferrer">File NCW Complaint →</a>
        </div>
      </div>
    </>
  )},
  { id:'w10', icon:'📞', title:'24/7 Helplines — Contact for Help Now', render:() => (
    <>
      <div className="p-sos-banner">
        <div className="big-num">181</div>
        <div><h4>Women Helpline — Government of India</h4>
          <p>Free · 24 hours · 7 days · All states · Trained counsellors · Connects to police, shelter homes, legal aid, and local LCC contacts</p>
        </div>
      </div>
      <div className="p-helplines">
        {[
          { name:'Police Emergency', num:'100', avail:'24/7', eml:'' },
          { name:'National Commission for Women', num:'7217735372', avail:'Mon–Fri, Office hours', eml:'ncw@nic.in' },
          { name:'SHe-Box POSH Portal', num:'shebox.nic.in', avail:'Online — 24/7', eml:'' },
          { name:'iCall — Mental Health (TISS)', num:'9152987821', avail:'Mon–Sat, 8am–10pm', eml:'icall@tiss.edu' },
          { name:'NALSA — Free Legal Aid', num:'15100', avail:'Legal helpline', eml:'' },
          { name:'Kiran — Mental Health', num:'1800-599-0019', avail:'Free · 24/7', eml:'' },
          { name:'NCW Online Complaint', num:'ncwapps.nic.in', avail:'Online — 24/7', eml:'' },
          { name:'Childline (if under 18)', num:'1098', avail:'Free · 24/7', eml:'' },
        ].map((h, i) => (
          <div key={i} className="p-hcard">
            <h4>{h.name}</h4>
            <span className="num" style={{ fontSize:h.num.length > 12 ? '12px' : '20px' }}>{h.num}</span>
            <span className="avl">{h.avail}</span>
            {h.eml && <div className="eml">{h.eml}</div>}
          </div>
        ))}
      </div>
      <div className="p-key-box"><h4>📍 State helplines (key states)</h4><ul>
        <li><strong>Andhra Pradesh:</strong> apwomenscommission@gmail.com · +91-9009991911</li>
        <li><strong>Karnataka:</strong> kswc@nic.in · 080-22202364</li>
        <li><strong>Maharashtra:</strong> mscw@nic.in · 022-26592707</li>
        <li><strong>Tamil Nadu:</strong> tnwc@nic.in · 044-28592750</li>
        <li><strong>Telangana:</strong> tswc@telangana.gov.in · 040-23390538</li>
        <li><strong>Delhi:</strong> dcw.delhi@nic.in · 011-23379181</li>
        <li><strong>West Bengal:</strong> wbwc@nic.in · 033-22485880</li>
      </ul></div>
    </>
  )},
  { id:'w11', icon:'✅', title:'Myths vs Facts About POSH', render:() => (
    <table className="p-myths-table">
      <thead><tr><th>Myth</th><th>Fact — POSH Act, 2013</th></tr></thead>
      <tbody>
        {[
          ['Sexual harassment means only physical contact.','POSH covers verbal, non-verbal, physical, and digital conduct. No physical touch is needed for a POSH offence.'],
          ['If I can\'t prove it, filing is pointless.','ICC applies civil standard — balance of probabilities, not criminal "beyond reasonable doubt." Your statement is evidence.'],
          ['Company under 10 employees — POSH doesn\'t apply.','POSH applies to all workplaces. Smaller organisations use the LCC. No size exemption exists.'],
          ['He meant it as a compliment — so it\'s not harassment.','The test is unwelcomeness TO YOU. Intention has no legal relevance under POSH.'],
          ['Only permanent employees can file.','Interns, trainees, volunteers, and contractual workers all have full POSH rights.'],
          ['Filing will end my career here.','Retaliation is an independently punishable POSH offence. Your identity is protected throughout.'],
          ['The ICC will side with management.','ICC must include an external NGO or legal member. Biased findings can be appealed to the employer, then court.'],
          ['I waited too long — I can\'t file.','3 months from the most recent incident, extendable to 6 months. Historical pattern evidence remains valid.'],
          ['It only counts if it happened at the office.','POSH covers company trips, client meetings, virtual communications, and all digital contact between colleagues.'],
        ].map(([myth, fact], i) => (
          <tr key={i}>
            <td><span className="p-myth-lbl">Myth</span>{myth}</td>
            <td><span className="p-fact-lbl">Fact</span>{fact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )},
  { id:'w12', icon:'📖', title:'Legal Glossary', render:() => (
    <ul className="p-glossary">
      {[
        ['POSH Act, 2013','Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act. India\'s primary law protecting women from workplace sexual harassment.'],
        ['Aggrieved Woman','Any woman of any age employed at a workplace — directly, contractually, or through an agent — including interns, volunteers, trainees, and domestic workers.'],
        ['ICC','Internal Complaints Committee — mandatory for every employer with 10+ employees. Must include a senior woman Presiding Officer and an external NGO/legal member.'],
        ['LCC','Local Complaints Committee — District-level body for organisations with fewer than 10 employees, or when the complaint is against the employer. Formed by the District Collector.'],
        ['Quid Pro Quo','Latin: "this for that." Harassment where professional benefits are tied to sexual favours, explicitly or by implication.'],
        ['Hostile Work Environment','Workplace made intimidating or humiliating by repeated sexual conduct or remarks — even without a specific threat or offer.'],
        ['Respondent','The person against whom a POSH complaint is filed. Can be any individual — not only a company employee.'],
        ['Conciliation','Optional settlement offered by ICC only if the complainant requests it. Cannot include monetary payment.'],
        ['SHe-Box','Sexual Harassment electronic Box — Government of India online complaint portal at shebox.nic.in.'],
        ['Section 354A IPC','Criminal provision for sexual harassment. Can be filed simultaneously alongside a POSH complaint — both run in parallel.'],
        ['Mandatory Reporting','Any person with knowledge of sexual harassment has a legal obligation to report it. Not reporting is a punishable offence.'],
        ['In-camera Proceedings','Trial conducted privately without public or media access — protecting the complainant\'s identity throughout.'],
      ].map(([term, def]) => <li key={term}><strong>{term}:</strong> {def}</li>)}
    </ul>
  )},
];

// ─── ORGS SECTIONS content renderers ─────────────────────────────────────────
const ORGS_SECTIONS = [
  { id:'o1', icon:'⚖️', title:'Who Must Comply with POSH?', render:() => (
    <>
      <p className="p-body">The POSH Act applies to <strong>every workplace in India</strong> — private companies, government bodies, NGOs, schools, colleges, hospitals, sports bodies, entertainment industry, and domestic work arrangements. There is no exemption for industry type or size.</p>
      <div className="p-two-col">
        <div style={{ background:'var(--p-teal-pale)', borderRadius:'14px', padding:'18px' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'15px', fontWeight:700, color:'var(--p-teal)', marginBottom:'8px' }}>🏢 10+ Employees</div>
          <div style={{ fontSize:'13px', color:'var(--p-ink-soft)', lineHeight:1.7 }}>You must form an <strong>ICC</strong> at every office location with 10 or more employees. This is mandatory — not optional.</div>
        </div>
        <div style={{ background:'#EEF0FA', borderRadius:'14px', padding:'18px' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'15px', fontWeight:700, color:'var(--p-navy)', marginBottom:'8px' }}>🏛️ Fewer than 10</div>
          <div style={{ fontSize:'13px', color:'var(--p-ink-soft)', lineHeight:1.7 }}>Complaints go to the <strong>LCC</strong> at the District Collector's office. But POSH awareness, policy display, and non-retaliation protections still apply to you.</div>
        </div>
      </div>
      <div className="p-teal-box"><h4>📌 "Employee" includes</h4>
        <ul>
          <li>Regular, contractual, temporary, ad hoc, and daily wage staff</li>
          <li>Interns, trainees, apprentices, consultants, and volunteers</li>
          <li>Domestic workers placed through an agency</li>
          <li>Third-party vendor staff deployed at your location</li>
        </ul>
      </div>
      <div className="p-danger-box"><h4>🚨 Employer includes government bodies</h4>
        <p>Government departments, statutory bodies, armed forces, local authorities, universities, hospitals — all have identical POSH obligations to private companies. No exemption exists for public sector undertakings.</p>
      </div>
    </>
  )},
  { id:'o2', icon:'🏛️', title:'Forming the ICC — Composition & Rules', render:() => (
    <>
      <p className="p-body">Section 4 of POSH mandates ICC formation for every employer with 10+ employees. The composition, qualifications, and tenure of members are legally prescribed — not discretionary.</p>
      <div className="p-icc-grid">
        <div className="p-icc-card p-icc-presiding">
          <h4>👩 Presiding Officer</h4>
          <p>Must be a woman employed at a senior level. If no senior woman employee is available, nominate from another office or administrative unit.</p>
        </div>
        <div className="p-icc-card p-icc-member">
          <h4>👥 Employee Members (min. 2)</h4>
          <p>Preferably employees committed to women's rights, or those with legal knowledge and social work experience.</p>
        </div>
        <div className="p-icc-card p-icc-external">
          <h4>🌐 External Member (1)</h4>
          <p>Must be from an NGO, association committed to women's rights, or a person familiar with sexual harassment issues. No employment relationship with the organisation.</p>
        </div>
      </div>
      <div className="p-icc-rule">⚖️ <strong>Critical rule:</strong> At least 50% of total ICC members must be women — counting the Presiding Officer, employee members, and external member together.</div>
      <div className="p-teal-box" style={{ marginTop:'14px' }}><h4>📋 Tenure and procedural requirements</h4><ul>
        <li>Each member's term: <strong>3 years</strong> (renewable)</li>
        <li>Inquiry must be completed within <strong>60 days</strong> of receiving a complaint</li>
        <li>Quorum: minimum 3 members (including Presiding Officer) at all proceedings</li>
        <li>Members cannot be removed without cause during their term — formal process required</li>
      </ul></div>
      <div className="p-danger-box"><h4>🚨 Improperly constituted ICC</h4>
        <p>An inquiry report from a non-compliant ICC — e.g., no external member, less than 50% women — may be legally challenged and set aside by courts. The employer may face both the non-formation penalty AND a re-inquiry requirement.</p>
      </div>
    </>
  )},
  { id:'o3', icon:'📄', title:'Your POSH Policy — What It Must Contain', render:() => (
    <>
      <p className="p-body">A generic or vague policy does not constitute compliance. Section 19 and Rule 13 specify mandatory contents that must be addressed.</p>
      <div className="p-teal-box"><h4>📋 Mandatory policy contents</h4><ul>
        <li>A clear, Act-aligned definition of sexual harassment covering all forms — verbal, non-verbal, physical, digital</li>
        <li>Explicit statement that sexual harassment is prohibited and is a disciplinary offence</li>
        <li>Full ICC contact details — name, designation, phone, and email of Presiding Officer</li>
        <li>Step-by-step complaint filing procedure including the 3-month deadline</li>
        <li>Commitments to confidentiality and non-retaliation for complainants</li>
        <li>Range of disciplinary actions available against the respondent</li>
        <li>Information about LCC and SHe-Box for complaints not suitable for ICC</li>
      </ul></div>
      <div className="p-info-box"><h4>📌 Display obligations (Section 19(b))</h4>
        <p>The penal consequences of sexual harassment and the ICC constitution order must be displayed conspicuously at every office location. Sending an email is insufficient — physical display is mandatory.</p>
      </div>
      <div className="p-danger-box"><h4>🚨 Penalty</h4>
        <p>No POSH Policy or no ICC display = up to ₹50,000 fine. Repeat violation = double the penalty + possible cancellation of business licence, shop establishment registration, or sector-specific approvals.</p>
      </div>
    </>
  )},
  { id:'o4', icon:'🎓', title:'Training Obligations', render:() => (
    <>
      <p className="p-body">Section 19(c) requires employers to organise workshops and awareness programmes at regular intervals. Courts consistently hold that annual training is the minimum expected standard.</p>
      <div className="p-teal-box"><h4>Who must be trained and on what</h4><ul>
        <li><strong>All employees:</strong> Definition of harassment, rights, complaint process, ICC contacts</li>
        <li><strong>ICC members:</strong> Inquiry procedure, natural justice, evidence assessment, report writing, confidentiality duties</li>
        <li><strong>Managers and team leaders:</strong> Recognition, escalation duties, non-retaliation obligations — managers have personal liability</li>
        <li><strong>HR team:</strong> Policy administration, supporting complainants, interim measures, record keeping</li>
      </ul></div>
      <div className="p-info-box"><h4>📌 Documentation you must maintain</h4>
        <p>For every session: attendance register, date, facilitator name, content covered, and signed acknowledgement forms. Required during inspection — "we did it" without documentation is insufficient.</p>
      </div>
      <div className="p-teal-box"><h4>Induction / onboarding requirement</h4>
        <ul>
          <li>POSH awareness must be included in every new employee's induction programme</li>
          <li>Signed acknowledgement that the employee has received and understood the policy goes in their joining file</li>
          <li>This applies to interns, trainees, and contractual workers equally</li>
        </ul>
      </div>
    </>
  )},
  { id:'o5', icon:'🔍', title:'The Inquiry Process — Employer Duties', render:() => (
    <>
      <p className="p-body">Once a complaint is received, employers must ensure the ICC has the authority, resources, and independence to complete the inquiry without interference. The inquiry is a quasi-judicial process.</p>
      <div className="p-timeline">
        {[
          { t:'Day 0', ti:'Complaint Received', d:'ICC receives the written complaint. If complainant cannot write, Presiding Officer must provide assistance. Complaint must include supporting documents and witness details.' },
          { t:'Within 7 days', ti:'Acknowledgement + Respondent Notice', d:'ICC acknowledges receipt in writing. Sends a copy to the respondent with a 10 working-day window to file their written reply.' },
          { t:'Optional', ti:'Conciliation — Only If Complainant Requests', d:'ICC may attempt settlement if the complainant requests it. Cannot be forced. Cannot include monetary payment. If it fails or is not sought, inquiry proceeds.' },
          { t:'Days 10–60', ti:'Inquiry Proceedings', d:'ICC examines parties separately; both may submit evidence and witnesses. Natural justice principles apply throughout. Employer must NOT interfere.' },
          { t:'Within 60 days', ti:'Report to Employer + District Officer', d:'ICC submits findings and recommendations. Complainant receives a copy. Report must be actionable — not advisory.' },
          { t:'Within 60 days of report', ti:'Employer Implements Recommendations', d:'Employer must act within 60 days. Both parties may appeal within 90 days. Non-implementation is a separate penalty.' },
        ].map((item, i) => (
          <div key={i} className="p-tl-item">
            <div className="p-tl-dots"><div className="p-tl-dot teal" />{i < 5 && <div className="p-tl-line" />}</div>
            <div className="p-tl-body">
              <div className="p-tl-time teal">{item.t}</div>
              <div className="p-tl-title">{item.ti}</div>
              <div className="p-tl-desc">{item.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-danger-box"><h4>🚨 Employers must NOT interfere with the inquiry</h4>
        <ul>
          <li>Management cannot pressure the ICC toward a particular outcome</li>
          <li>Influencing an ICC member is contempt of the proceedings</li>
          <li>Suppressing evidence or discouraging witnesses is a criminal offence</li>
          <li>Retaliating against a complainant during inquiry is an independently punishable POSH violation</li>
        </ul>
      </div>
    </>
  )},
  { id:'o6', icon:'📊', title:'Annual Report Requirements', render:() => (
    <>
      <p className="p-body">Section 21 mandates that the ICC submit an Annual Report to the employer and the District Officer at the end of each calendar year. This is a statutory requirement — not optional.</p>
      <div className="p-teal-box"><h4>📋 Mandatory Annual Report contents</h4><ul>
        <li>Number of complaints received during the year</li>
        <li>Number of complaints disposed of (resolved/closed)</li>
        <li>Number of complaints pending more than 60 days</li>
        <li>Number of workshops and awareness programmes held</li>
        <li>Nature of action taken on each upheld complaint</li>
      </ul></div>
      <div className="p-info-box"><h4>📌 Companies Act linkage</h4>
        <p>For listed companies and large organisations, the Companies Act 2013 (Section 134) requires disclosure of POSH compliance status in the Board's Report to shareholders. POSH compliance is increasingly a corporate governance matter — auditors are beginning to check for it.</p>
      </div>
      <div className="p-danger-box"><h4>🚨 Confidentiality in the Annual Report</h4>
        <p>The Annual Report must NOT identify any complainant, respondent, or witness by name. Data is aggregated and anonymised. Disclosing identities in the annual report is itself a POSH violation with penalties including loss of service.</p>
      </div>
    </>
  )},
  { id:'o7', icon:'💰', title:'Penalties for Non-Compliance', render:() => (
    <>
      <p className="p-body">The POSH Act carries significant penalties. Courts have become increasingly willing to enforce them — non-compliance is not a minor administrative lapse.</p>
      <table className="p-penalty-table">
        <thead><tr><th>Violation</th><th>Penalty</th><th>Level</th></tr></thead>
        <tbody>
          {[
            ['Failure to constitute an ICC (10+ employees)','Fine up to ₹50,000','high'],
            ['Second or subsequent violation after a previous conviction','Double the penalty + possible cancellation/non-renewal of business licence','high'],
            ['Failure to display ICC details and penal consequences at the workplace','Covered under general employer obligations — ₹50,000 fine applicable','high'],
            ['Disclosure of complainant\'s identity by any person','Fine up to ₹5,000 and service consequences for the disclosing person','mid'],
            ['Failure to submit Annual Report to District Officer','Section 26 — same fine structure applies','mid'],
            ['Employer fails to implement ICC recommendations within 60 days','Separate violation from the original harassment complaint — fine + licence implications','high'],
            ['Providing false information during inquiry or obstructing ICC','Criminal consequences under IPC + POSH penalties simultaneously','high'],
            ['Retaliation against complainant during or after proceedings','Employer liable even if an individual manager carried it out','high'],
          ].map(([v, p, sev], i) => (
            <tr key={i}>
              <td>{v}</td>
              <td>{p}</td>
              <td><span className={`p-pbadge ${sev}`}>{sev === 'high' ? '🔴 High' : '🟡 Medium'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-danger-box"><h4>🚨 Business licence cancellation — a real risk</h4>
        <p>Section 26(2) POSH provides for cancellation or non-renewal of any licence, registration, or approval needed to carry on business — for repeated or aggravated violations. This applies to business licences, factory licences, shop establishment registrations, and sector-specific approvals.</p>
      </div>
    </>
  )},
  { id:'o8', icon:'📋', title:'Employer\'s 10 Statutory Duties', render:() => (
    <>
      <p className="p-body">Section 19 of POSH lists specific, individually enforceable duties of every employer. These are legal obligations — not recommendations.</p>
      <ol className="p-steps">
        <li><strong>Provide a safe working environment.</strong> Take all reasonably practicable measures to prevent sexual harassment. This is a continuing duty, not a one-time action.</li>
        <li><strong>Display ICC order and penal consequences</strong> at every office, branch, and unit — conspicuously visible to all employees. Digital-only notice is insufficient.</li>
        <li><strong>Organise workshops and awareness programmes</strong> at regular intervals for sensitising employees on their rights and obligations under POSH.</li>
        <li><strong>Provide necessary facilities to the ICC</strong> — meeting space, administrative support, and reasonable working time for ICC members to conduct inquiries.</li>
        <li><strong>Assist in securing attendance</strong> of respondents and witnesses before the ICC when required during inquiry proceedings.</li>
        <li><strong>Make POSH compliance information available</strong> to the District Officer when required for audit or inspection.</li>
        <li><strong>Treat sexual harassment as misconduct</strong> under service rules and act on ICC findings within 60 days of receiving the report.</li>
        <li><strong>Monitor timely submission of ICC Annual Reports</strong> to both the employer and the District Officer.</li>
        <li><strong>Include POSH compliance status</strong> in the Annual Report to shareholders (listed and large companies — Companies Act requirement).</li>
        <li><strong>Take action against third-party harassment.</strong> When a client, vendor, or visitor harasses an employee, take appropriate protective action and notify their organisation if applicable.</li>
      </ol>
      <div className="p-teal-box"><h4>📌 Schools, colleges, and educational institutions</h4>
        <ul>
          <li>Educational institutions are explicitly covered by POSH</li>
          <li>Students, researchers, and faculty are all protected</li>
          <li>Hostels and residential facilities are part of the "workplace"</li>
          <li>The Principal, Rector, or governing body is the employer for ICC purposes</li>
        </ul>
      </div>
    </>
  )},
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function POSHResource({ navigate, onBack }) {
  const [activeTab, setActiveTab] = useState('women'); // 'women' | 'orgs'
  const [openW, setOpenW] = useState({ w1: true });
  const [openO, setOpenO] = useState({ o1: true });
  const [activeNav, setActiveNav] = useState('w1');

  // Inject CSS
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const toggleW = useCallback((id) => setOpenW(p => ({ ...p, [id]: !p[id] })), []);
  const toggleO = useCallback((id) => setOpenO(p => ({ ...p, [id]: !p[id] })), []);

  const openAllW = useCallback(() => {
    const a = {}; WOMEN_SECTIONS.forEach(s => { a[s.id] = true; }); setOpenW(a);
  }, []);
  const openAllO = useCallback(() => {
    const a = {}; ORGS_SECTIONS.forEach(s => { a[s.id] = true; }); setOpenO(a);
  }, []);

  const scrollTo = useCallback((id, tab) => {
    if (tab) setActiveTab(tab);
    setActiveNav(id);
    if (tab === 'women') setOpenW(p => ({ ...p, [id]: true }));
    if (tab === 'orgs')  setOpenO(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      const el = document.getElementById(`p-sec-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, []);

  const handlePrint = useCallback(() => {
    if (activeTab === 'women') openAllW();
    else openAllO();
    setTimeout(() => window.print(), 400);
  }, [activeTab, openAllW, openAllO]);

  const currentSections = activeTab === 'women' ? WOMEN_SECTIONS : ORGS_SECTIONS;
  const open = activeTab === 'women' ? openW : openO;
  const toggleFn = activeTab === 'women' ? toggleW : toggleO;

  return (
    <div className="p-page">

      {/* ── TOP BAR ── */}
      <div className="p-topbar">
        <button className="p-back" onClick={onBack || (() => navigate && navigate('/resources'))}>← Resources</button>
        <div className="p-topbar-center">POSH Act, 2013 — Complete Resource Hub</div>
        <button className="p-print-btn no-print" onClick={handlePrint}>📄 Print This Tab</button>
      </div>

      {/* ── HERO ── */}
      <div className="p-hero">
        <div className="p-hero-blob-1" /><div className="p-hero-blob-2" />
        <div className="p-hero-inner">
          <div className="p-hero-eyebrow">⚖️ POSH Act, 2013 — Sexual Harassment of Women at Workplace</div>
          <h1 className="p-hero-h1">India's Complete POSH<br /><em>Resource Hub</em></h1>
          <p className="p-hero-sub">Two sections in one place — a full rights handbook for women, and a complete compliance guide for organisations. Real district-wise LCC contacts, State Women's Commissions, an 8-scenario interactive quiz, and a live 30-point compliance audit.</p>
          <div className="p-sos-row">
            <div className="p-sos-pill">
              <div><div className="num">181</div><div className="lbl">Women Helpline</div><div className="sub">Free · 24/7 · All states</div></div>
            </div>
            <div className="p-sos-pill">
              <div><div className="num">1098</div><div className="lbl">Childline (under 18)</div><div className="sub">Free · 24/7</div></div>
            </div>
            <div className="p-sos-pill">
              <div><div style={{ fontFamily:"'Fraunces',serif", fontSize:'18px', fontWeight:700, color:'white' }}>shebox.nic.in</div><div className="lbl">Online POSH Complaint</div><div className="sub">No office visit required</div></div>
            </div>
            <div className="p-sos-pill">
              <div><div style={{ fontFamily:"'Fraunces',serif", fontSize:'18px', fontWeight:700, color:'white' }}>7217735372</div><div className="lbl">National Commission for Women</div><div className="sub">Mon–Fri, office hours</div></div>
            </div>
          </div>
          <div className="p-hero-note">
            ⚖️ Based on the POSH Act, 2013 and subsequent amendments. LCC contacts sourced from poshatwork.com and district government websites (January 2026). For situation-specific legal advice, consult a qualified advocate, call iCall (9152987821), or the NCW (ncw@nic.in).
          </div>
        </div>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="p-main-tabs">
        <div className="p-main-tabs-inner">
          <button
            className={`p-main-tab women ${activeTab === 'women' ? 'active' : ''}`}
            onClick={() => { setActiveTab('women'); setActiveNav('w1'); }}>
            👩 For Women — Know Your Rights
          </button>
          <button
            className={`p-main-tab orgs ${activeTab === 'orgs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orgs'); setActiveNav('o1'); }}>
            🏢 For Organisations — Compliance Guide
          </button>
        </div>
      </div>

      {/* ── SUB-NAV ── */}
      <div className="p-subnav">
        <div className="p-subnav-inner">
          {currentSections.map(s => (
            <button
              key={s.id}
              className={`p-subnav-btn ${activeNav === s.id ? (activeTab === 'women' ? 'women-active' : 'orgs-active') : ''}`}
              onClick={() => scrollTo(s.id, activeTab)}>
              {s.icon} {s.title.split('—')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-content">

        {/* Tab banner */}
        <div style={{
          background: activeTab === 'women'
            ? 'linear-gradient(135deg,var(--p-rose-pale),#F5EEF8)'
            : 'linear-gradient(135deg,var(--p-teal-pale),#EEF0FA)',
          borderRadius:'14px', padding:'16px 22px', marginBottom:'24px',
          borderLeft: `4px solid ${activeTab === 'women' ? 'var(--p-rose)' : 'var(--p-teal)'}`,
          display:'flex', alignItems:'center', gap:'14px',
        }}>
          <span style={{ fontSize:'28px' }}>{activeTab === 'women' ? '👩' : '🏢'}</span>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:'17px', fontWeight:700, color:activeTab === 'women' ? 'var(--p-rose)' : 'var(--p-teal)', marginBottom:'3px' }}>
              {activeTab === 'women' ? 'Women\'s Rights Handbook' : 'Organisation Compliance Guide'}
            </div>
            <div style={{ fontSize:'13px', color:'var(--p-muted)' }}>
              {activeTab === 'women'
                ? `${WOMEN_SECTIONS.length} sections · District LCC directory · State Commissions · Scenario quiz · Printable handbook`
                : `${ORGS_SECTIONS.length} sections · ICC formation rules · Policy requirements · 30-point live audit checklist`}
            </div>
          </div>
        </div>

        {/* Sections */}
        {currentSections.map((sec, i) => (
          <div key={sec.id} id={`p-sec-${sec.id}`} className={`p-sec ${open[sec.id] ? 'open' : ''}`}>
            <div className="p-sec-hdr" onClick={() => toggleFn(sec.id)}>
              <div className="p-sec-icon">{sec.icon}</div>
              <div className="p-sec-meta">
                <div className={`p-sec-num ${activeTab}`}>Section {i+1} of {currentSections.length}</div>
                <div className="p-sec-title">{sec.title}</div>
              </div>
              <div className="p-chevron">▶</div>
            </div>
            {open[sec.id] && <div className="p-sec-body">{sec.render()}</div>}
          </div>
        ))}

        {/* Interactive extras */}
        {activeTab === 'women' && <ScenarioQuiz />}
        {activeTab === 'orgs'  && <ComplianceAudit />}

        {/* Footer note */}
        <div style={{ marginTop:'24px', padding:'14px 18px', background:'rgba(26,35,64,.04)', borderRadius:'12px', fontSize:'12px', color:'var(--p-muted)', lineHeight:1.7 }} className="no-print">
          <strong style={{ color:'var(--p-navy)' }}>📌 Usage:</strong> Free to print and distribute for awareness. SecretSharz requests attribution when sharing publicly. For specific legal advice, always consult a qualified POSH advocate. Contact SecretSharz via the Resources page to request additional handbooks or translations.
        </div>
      </div>

      {/* Print-only footer */}
      <div className="print-footer">
        SecretSharz POSH Resource Hub · {activeTab === 'women' ? 'Women\'s Rights Handbook' : 'Employer Compliance Guide'} · POSH Act 2013 · Women's Helpline: 181 · SHe-Box: shebox.nic.in · NCW: 7217735372 · secretsharz.com
      </div>
    </div>
  );
}
