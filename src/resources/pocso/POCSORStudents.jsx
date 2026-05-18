/**
 * POCSO: Rights, Responsibilities, and Legal Framework — Comprehensive Edition
 * src/resources/pocso/POCSORStudents.jsx
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import pptxgen from 'pptxgenjs';

// ── CSS ─────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --forest: #1E3D2A; --deep: #2D5240; --sage: #4A7C59; --sage-light: #6FAA80;
    --sage-pale: #EBF4EE; --sand: #F7F3ED; --warm-white: #FDFCFA;
    --ink: #1E2820; --ink-soft: #3D4A40; --muted: #7A8A7D;
    --red: #C0392B; --orange: #E8845A; --sky: #2980B9; --gold: #C8982A;
    --border: rgba(30,40,32,0.10);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pocso-page { min-height: 100vh; background: var(--warm-white); padding-bottom: 80px; font-family: 'DM Sans', sans-serif; }

  /* ── TOPBAR ── */
  .pocso-topbar { background: var(--forest); color: white; padding: 0 40px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; border-bottom: 3px solid var(--sage); }
  .pocso-back-btn { display: flex; align-items: center; gap: 6px; color: var(--sage-light); font-size: 13px; font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .pocso-back-btn:hover { color: white; }
  .pocso-topbar-title { font-family: 'Fraunces', serif; font-size: 16px; color: white; }
  .pocso-topbar-actions { display: flex; gap: 8px; }
  .pocso-action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s; white-space: nowrap; text-decoration: none; }
  .pocso-print-btn { background: rgba(192,57,43,0.15); color: #E74C3C; border: 1px solid rgba(192,57,43,0.3); }
  .pocso-print-btn:hover { background: #E74C3C; color: white; }
  .pocso-pdf-btn { background: rgba(41,128,185,0.15); color: var(--sky); border: 1px solid rgba(41,128,185,0.3); }
  .pocso-pdf-btn:hover { background: var(--sky); color: white; }
  .pocso-ppt-btn { background: rgba(230,126,34,0.15); color: #E67E22; border: 1px solid rgba(230,126,34,0.3); }
  .pocso-ppt-btn:hover { background: #E67E22; color: white; }
  .pocso-ppt-btn:disabled { opacity: 0.5; cursor: wait; }

  /* ── HERO ── */
  .pocso-hero { background: linear-gradient(135deg, var(--forest) 0%, var(--deep) 55%, #3D6B54 100%); padding: 64px 48px 56px; color: white; position: relative; overflow: hidden; }
  .pocso-hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(111,170,128,0.08), transparent 70%); border-radius: 50%; pointer-events: none; }
  .pocso-hero-inner { max-width: 900px; margin: 0 auto; display: flex; gap: 48px; align-items: flex-start; flex-wrap: wrap; position: relative; z-index: 1; }
  .pocso-hero-shield { width: 80px; height: 80px; background: rgba(255,255,255,0.08); border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0; font-size: 36px; }
  .pocso-hero-text { flex: 1; }
  .pocso-hero-text h1 { font-family: 'Fraunces', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 700; line-height: 1.15; margin-bottom: 12px; }
  .pocso-hero-text p { font-size: 16px; color: rgba(255,255,255,0.72); line-height: 1.75; max-width: 560px; margin-bottom: 24px; }
  .pocso-hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
  .pocso-hero-tag { padding: 6px 14px; border-radius: 50px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); }
  .pocso-hero-tag.red { background: rgba(192,57,43,0.3); border-color: rgba(192,57,43,0.4); color: #F5A9A0; }
  .pocso-legal-note { max-width: 900px; margin: 24px auto 0; padding: 14px 20px; background: rgba(255,255,255,0.06); border-radius: 10px; border-left: 3px solid rgba(111,170,128,0.5); font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.65; position: relative; z-index: 1; }

  /* ── DOWNLOAD RESOURCES STRIP ── */
  .pocso-resources-strip { background: var(--forest); border-top: 1px solid rgba(111,170,128,0.2); padding: 20px 48px; }
  .pocso-resources-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .pocso-resources-label { font-size: 12px; font-weight: 700; color: var(--sage-light); text-transform: uppercase; letter-spacing: 1.5px; margin-right: 8px; white-space: nowrap; }
  .pocso-dl-card { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 10px 18px; text-decoration: none; color: white; transition: all 0.2s; }
  .pocso-dl-card:hover { background: rgba(255,255,255,0.15); border-color: rgba(111,170,128,0.5); }
  .pocso-dl-icon { font-size: 22px; }
  .pocso-dl-text { font-size: 13px; font-weight: 600; }
  .pocso-dl-sub { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 1px; }

  /* ── TABS ── */
  .pocso-tabs-wrap { background: white; border-bottom: 2px solid rgba(30,40,32,0.08); padding: 0 48px; position: sticky; top: 56px; z-index: 150; box-shadow: 0 4px 16px rgba(30,40,32,0.06); }
  .pocso-tabs { max-width: 900px; margin: 0 auto; display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; }
  .pocso-tabs::-webkit-scrollbar { display: none; }
  .pocso-tab { padding: 16px 22px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: none; font-family: inherit; color: var(--muted); border-bottom: 3px solid transparent; transition: all 0.2s; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; white-space: nowrap; }
  .pocso-tab:hover { color: var(--ink); background: rgba(30,40,32,0.02); }
  .pocso-tab.active { color: var(--deep); border-bottom-color: var(--sage); }
  .pocso-tab-sub { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
  .pocso-tab.active .pocso-tab-sub { color: var(--sage); }

  /* ── CONTENT ── */
  .pocso-content { max-width: 900px; margin: 0 auto; padding: 40px 48px; }
  .pocso-handbook-intro { background: linear-gradient(135deg, var(--sage-pale), #E8F5EE); border-radius: 16px; padding: 24px 28px; margin-bottom: 36px; border: 1px solid rgba(74,124,89,0.2); display: flex; gap: 16px; align-items: flex-start; }
  .pocso-intro-icon { width: 34px; height: 34px; flex-shrink: 0; background: var(--deep); color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 800; font-size: 14px; }
  .pocso-intro-text h3 { font-family: 'Fraunces', serif; font-size: 19px; color: var(--deep); margin-bottom: 6px; }
  .pocso-intro-text p { font-size: 14px; color: var(--ink-soft); line-height: 1.75; margin: 0; }

  /* ── SECTION ACCORDION ── */
  .pocso-section { background: white; border-radius: 18px; border: 1.5px solid var(--border); margin-bottom: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(30,40,32,0.04); transition: box-shadow 0.2s; }
  .pocso-section:hover { box-shadow: 0 4px 20px rgba(30,40,32,0.08); }
  .pocso-section-header { padding: 20px 26px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: background 0.2s; }
  .pocso-section-header:hover { background: rgba(30,40,32,0.015); }
  .pocso-section-icon { font-size: 13px; font-weight: 800; color: var(--sage); flex-shrink: 0; width: 38px; height: 38px; background: var(--sage-pale); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .pocso-section-title-block { flex: 1; }
  .pocso-section-num { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--sage); margin-bottom: 2px; }
  .pocso-section-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--ink); }
  .pocso-section-chevron { font-size: 13px; color: var(--muted); transition: transform 0.25s; flex-shrink: 0; }
  .pocso-section.open .pocso-section-chevron { transform: rotate(90deg); }
  .pocso-section-body { padding: 4px 26px 28px; border-top: 1px solid rgba(30,40,32,0.07); animation: pocsoFadeIn 0.3s ease; }
  @keyframes pocsoFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── CONTENT ATOMS ── */
  .pocso-body-text { font-size: 15px; color: var(--ink-soft); line-height: 1.85; margin: 16px 0 0; }
  .pocso-body-text + .pocso-body-text { margin-top: 12px; }
  .pocso-h4 { font-family: 'Fraunces', serif; font-size: 17px; color: var(--ink); margin: 20px 0 8px; }

  .pocso-key-box { background: var(--sage-pale); border-radius: 12px; padding: 18px 22px; margin: 16px 0; border-left: 4px solid var(--sage); }
  .pocso-key-box h4 { font-family: 'Fraunces', serif; font-size: 16px; color: var(--deep); margin: 0 0 10px; }
  .pocso-key-box p, .pocso-key-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
  .pocso-key-box ul, .pocso-key-box ol { padding-left: 18px; margin: 8px 0 0; }
  .pocso-key-box li { margin-bottom: 6px; }

  .pocso-warn-box { background: #FDF0EA; border-radius: 12px; padding: 18px 22px; margin: 16px 0; border-left: 4px solid var(--orange); }
  .pocso-warn-box h4 { font-family: 'Fraunces', serif; font-size: 16px; color: var(--red); margin: 0 0 8px; }
  .pocso-warn-box p, .pocso-warn-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
  .pocso-warn-box ul { padding-left: 18px; margin: 8px 0 0; }

  .pocso-info-box { background: #EAF4FA; border-radius: 12px; padding: 18px 22px; margin: 16px 0; border-left: 4px solid var(--sky); }
  .pocso-info-box h4 { font-family: 'Fraunces', serif; font-size: 16px; color: var(--sky); margin: 0 0 8px; }
  .pocso-info-box p, .pocso-info-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
  .pocso-info-box ul { padding-left: 18px; margin: 8px 0 0; }
  .pocso-info-box li { margin-bottom: 6px; }

  .pocso-gold-box { background: #FFF8E6; border-radius: 12px; padding: 18px 22px; margin: 16px 0; border-left: 4px solid var(--gold); }
  .pocso-gold-box h4 { font-family: 'Fraunces', serif; font-size: 16px; color: #7A5C00; margin: 0 0 8px; }
  .pocso-gold-box p, .pocso-gold-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
  .pocso-gold-box ul { padding-left: 18px; margin: 8px 0 0; }
  .pocso-gold-box li { margin-bottom: 6px; }

  .pocso-dark-box { background: var(--forest); border-radius: 12px; padding: 20px 24px; margin: 16px 0; }
  .pocso-dark-box h4 { font-family: 'Fraunces', serif; font-size: 17px; color: var(--sage-light); margin: 0 0 10px; }
  .pocso-dark-box p, .pocso-dark-box li { font-size: 14px; color: rgba(255,255,255,0.72); line-height: 1.75; }
  .pocso-dark-box ul { padding-left: 18px; margin: 8px 0 0; }
  .pocso-dark-box li { margin-bottom: 6px; }

  /* ── TIMELINE ── */
  .pocso-timeline { position: relative; padding: 20px 0 0 28px; margin: 16px 0; }
  .pocso-timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--sage), var(--sage-light)); border-radius: 1px; }
  .pocso-timeline-item { position: relative; margin-bottom: 28px; }
  .pocso-timeline-item::before { content: ''; position: absolute; left: -34px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--sage); border: 2px solid white; box-shadow: 0 0 0 2px var(--sage); }
  .pocso-tl-year { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--sage); margin-bottom: 4px; }
  .pocso-tl-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .pocso-tl-desc { font-size: 14px; color: var(--ink-soft); line-height: 1.7; }
  .pocso-tl-badge { display: inline-block; padding: 2px 10px; border-radius: 50px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .pocso-tl-badge.enact { background: var(--sage-pale); color: var(--deep); }
  .pocso-tl-badge.amend { background: #FFF8E6; color: #7A5C00; }
  .pocso-tl-badge.case { background: #EAF4FA; color: var(--sky); }
  .pocso-tl-badge.rule { background: #F5F0FF; color: #6C3483; }

  /* ── SECTION COMPARISON TABLE ── */
  .pocso-section-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border-radius: 12px; overflow: hidden; }
  .pocso-section-table th { background: var(--deep); color: white; padding: 11px 16px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .pocso-section-table td { padding: 12px 16px; border-bottom: 1px solid rgba(30,40,32,0.07); color: var(--ink-soft); line-height: 1.6; vertical-align: top; }
  .pocso-section-table tr:nth-child(even) td { background: rgba(30,40,32,0.02); }
  .pocso-section-table tr:last-child td { border-bottom: none; }
  .pocso-section-table .sec-num { font-weight: 800; color: var(--deep); white-space: nowrap; }
  .pocso-section-table .penalty { font-weight: 700; color: var(--red); white-space: nowrap; }
  .pocso-section-table .category { display: inline-block; padding: 2px 8px; border-radius: 50px; font-size: 10px; font-weight: 700; background: var(--sage-pale); color: var(--deep); }

  /* ── TWO-COL ── */
  .pocso-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0; }
  .pocso-col-good { background: #D1FAE5; border-radius: 12px; padding: 18px; }
  .pocso-col-bad  { background: #FEE2E2; border-radius: 12px; padding: 18px; }
  .pocso-col-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .pocso-col-good .pocso-col-title { color: #065F46; }
  .pocso-col-bad  .pocso-col-title { color: #991B1B; }
  .pocso-col-list { list-style: none; padding: 0; margin: 0; }
  .pocso-col-list li { font-size: 13px; color: #1F2937; padding: 5px 0; display: flex; gap: 8px; line-height: 1.5; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .pocso-col-list li:last-child { border-bottom: none; }

  /* ── STEPS ── */
  .pocso-steps { counter-reset: step; list-style: none; padding: 0; margin: 16px 0 0; }
  .pocso-steps li { counter-increment: step; display: flex; gap: 14px; align-items: flex-start; padding: 14px 16px; border-radius: 10px; margin-bottom: 10px; background: rgba(30,40,32,0.025); border: 1px solid rgba(30,40,32,0.07); font-size: 14px; color: var(--ink-soft); line-height: 1.65; }
  .pocso-steps li::before { content: counter(step); width: 28px; height: 28px; border-radius: 50%; background: var(--sage); color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }

  /* ── MYTHS TABLE ── */
  .pocso-myths-table { width: 100%; border-collapse: collapse; margin: 16px 0; border-radius: 12px; overflow: hidden; font-size: 13px; }
  .pocso-myths-table th { background: var(--deep); color: white; padding: 11px 14px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .pocso-myths-table td { padding: 12px 14px; border-bottom: 1px solid rgba(30,40,32,0.07); color: var(--ink-soft); line-height: 1.6; vertical-align: top; }
  .pocso-myths-table tr:nth-child(even) td { background: rgba(30,40,32,0.02); }
  .myth-label { color: var(--red); font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  .fact-label { color: #27AE60; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── FILL-IN WORKSHEET ── */
  .pocso-fill-in { background: #FDF6EC; border: 2px dashed var(--orange); border-radius: 14px; padding: 22px 26px; margin: 16px 0; }
  .pocso-fill-in h4 { font-family: 'Fraunces', serif; font-size: 17px; color: var(--red); margin: 0 0 16px; }
  .pocso-fill-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 14px; color: var(--ink-soft); }
  .pocso-fill-num { width: 26px; height: 26px; border-radius: 50%; background: var(--orange); color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pocso-fill-line { flex: 1; border: none; border-bottom: 2px dotted rgba(30,40,32,0.25); background: transparent; }

  /* ── CASE LAW CARDS ── */
  .pocso-caselaw-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin: 16px 0; }
  .pocso-case-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 20px 22px; border-left: 5px solid var(--sage); }
  .pocso-case-name { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: var(--deep); margin-bottom: 4px; }
  .pocso-case-meta { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 10px; }
  .pocso-case-holding { font-size: 13px; color: var(--ink-soft); line-height: 1.7; }
  .pocso-case-significance { background: var(--sage-pale); border-radius: 8px; padding: 10px 14px; margin-top: 12px; font-size: 12px; color: var(--deep); font-weight: 600; line-height: 1.6; }

  /* ── COMPARISON: 2012 vs 2019 ── */
  .pocso-compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
  .pocso-compare-card { border-radius: 14px; padding: 20px; }
  .pocso-compare-card.old { background: #F5F0FF; border: 1px solid rgba(108,52,131,0.2); }
  .pocso-compare-card.new { background: var(--sage-pale); border: 1px solid rgba(74,124,89,0.3); }
  .pocso-compare-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .pocso-compare-card.old .pocso-compare-label { color: #6C3483; }
  .pocso-compare-card.new .pocso-compare-label { color: var(--deep); }
  .pocso-compare-title { font-family: 'Fraunces', serif; font-size: 16px; margin-bottom: 12px; }
  .pocso-compare-card.old .pocso-compare-title { color: #6C3483; }
  .pocso-compare-card.new .pocso-compare-title { color: var(--deep); }
  .pocso-compare-list { list-style: none; padding: 0; margin: 0; }
  .pocso-compare-list li { font-size: 13px; color: var(--ink-soft); padding: 5px 0; border-bottom: 1px solid rgba(0,0,0,0.06); line-height: 1.55; display: flex; gap: 6px; }
  .pocso-compare-list li:last-child { border-bottom: none; }

  /* ── HELPLINES ── */
  .pocso-helpline-emergency { background: var(--red); border-radius: 14px; padding: 20px 24px; margin: 0 0 14px; display: flex; align-items: center; gap: 20px; }
  .pocso-helpline-emergency h4 { font-size: 16px; color: white; margin: 0 0 3px; font-family: 'Fraunces', serif; }
  .pocso-helpline-emergency p { font-size: 12px; color: rgba(255,255,255,0.7); margin: 0; }
  .pocso-helpline-emergency .big-num { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 700; color: white; line-height: 1; flex-shrink: 0; }
  .pocso-helpline-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; margin: 12px 0; }
  .pocso-helpline-card { background: var(--deep); border-radius: 14px; padding: 18px 20px; color: white; }
  .pocso-helpline-card h4 { font-family: 'Fraunces', serif; font-size: 14px; margin: 0 0 4px; }
  .pocso-helpline-card .num { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--sage-light); margin: 8px 0 4px; display: block; }
  .pocso-helpline-card .num.small { font-size: 14px; word-break: break-all; }
  .pocso-helpline-card .avail { font-size: 11px; color: rgba(255,255,255,0.55); }

  /* ── GLOSSARY ── */
  .pocso-glossary-list { list-style: none; padding: 0; margin: 14px 0 0; }
  .pocso-glossary-list li { padding: 12px 16px; border-radius: 10px; margin-bottom: 8px; background: rgba(30,40,32,0.03); border: 1px solid rgba(30,40,32,0.07); font-size: 14px; color: var(--ink-soft); line-height: 1.65; }
  .pocso-glossary-list li strong { color: var(--deep); font-weight: 700; }

  /* ── QUIZ ── */
  .pocso-quiz-wrap { background: white; border-radius: 20px; border: 1.5px solid var(--border); margin-top: 44px; overflow: hidden; box-shadow: 0 3px 16px rgba(30,40,32,0.07); }
  .pocso-quiz-header { background: linear-gradient(135deg, var(--deep), var(--sage)); padding: 26px 30px; color: white; }
  .pocso-quiz-header h3 { font-family: 'Fraunces', serif; font-size: 23px; margin: 0 0 4px; }
  .pocso-quiz-header p { font-size: 13px; color: rgba(255,255,255,0.7); margin: 0; }
  .pocso-quiz-body { padding: 26px 30px; }
  .pocso-quiz-progress { height: 5px; background: rgba(30,40,32,0.08); border-radius: 3px; margin-bottom: 24px; overflow: hidden; }
  .pocso-quiz-progress-fill { height: 100%; background: var(--sage); border-radius: 3px; transition: width 0.4s ease; }
  .pocso-quiz-q-num { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--sage); margin-bottom: 8px; }
  .pocso-quiz-question { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: var(--ink); line-height: 1.4; margin-bottom: 20px; animation: pocsoFadeIn 0.3s ease; }
  .pocso-quiz-options { display: flex; flex-direction: column; gap: 10px; }
  .pocso-quiz-opt { padding: 14px 18px; border: 2px solid rgba(30,40,32,0.10); border-radius: 12px; background: white; font-size: 14px; font-weight: 600; color: var(--ink-soft); cursor: pointer; text-align: left; font-family: inherit; transition: all 0.18s; display: flex; align-items: center; gap: 12px; }
  .pocso-quiz-opt:hover:not(:disabled) { border-color: var(--sage); background: var(--sage-pale); color: var(--deep); }
  .pocso-quiz-opt:disabled { cursor: default; }
  .pocso-quiz-opt.correct { border-color: #27AE60; background: #D5F5E3; color: #1E8449; }
  .pocso-quiz-opt.wrong { border-color: var(--red); background: #FADBD8; color: #922B21; }
  .pocso-quiz-opt.neutral { border-color: #27AE60; background: #D5F5E3; color: #1E8449; opacity: 0.5; }
  .pocso-quiz-opt-icon { font-size: 16px; flex-shrink: 0; }
  .pocso-quiz-reveal { background: var(--sage-pale); border-radius: 12px; padding: 16px 20px; margin-top: 16px; animation: pocsoFadeIn 0.3s ease; border-left: 4px solid var(--sage); font-size: 14px; color: var(--deep); line-height: 1.75; }
  .pocso-quiz-reveal strong { display: block; margin-bottom: 4px; font-family: 'Fraunces', serif; font-size: 17px; }
  .pocso-quiz-next-btn { margin-top: 16px; padding: 12px 28px; background: var(--sage); color: white; border: none; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .pocso-quiz-next-btn:hover { background: var(--deep); }
  .pocso-quiz-result { text-align: center; padding: 20px 0; animation: pocsoFadeIn 0.4s ease; }
  .pocso-quiz-result h3 { font-family: 'Fraunces', serif; font-size: 28px; color: var(--ink); margin-bottom: 6px; }
  .pocso-quiz-result .big-score { font-family: 'Fraunces', serif; font-size: 60px; font-weight: 700; color: var(--sage); line-height: 1; }
  .pocso-quiz-result p { font-size: 15px; color: var(--muted); margin: 12px 0 24px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.65; }
  .pocso-quiz-retake { background: white; border: 2px solid var(--sage); color: var(--sage); padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .pocso-quiz-retake:hover { background: var(--sage); color: white; }

  /* ── PRINT ── */
  @media print {
    @page { size: A4; margin: 18mm 18mm 22mm 18mm; }
    .pocso-topbar, .pocso-tabs-wrap, .pocso-quiz-wrap, .pocso-action-btn, .no-print, .pocso-resources-strip { display: none !important; }
    .pocso-page { padding: 0; background: white; }
    .pocso-hero { background: var(--deep) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 28px 32px !important; }
    .pocso-content { padding: 20px 0; }
    .pocso-section { break-inside: avoid; border: 1px solid #ccc !important; box-shadow: none !important; margin-bottom: 12px; }
    .pocso-section-body { display: block !important; }
    .pocso-section-chevron { display: none; }
    .pocso-key-box, .pocso-warn-box, .pocso-info-box, .pocso-gold-box, .pocso-dark-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
    .pocso-two-col, .pocso-compare-grid { break-inside: avoid; }
    .pocso-timeline-item { break-inside: avoid; }
    .pocso-case-card { break-inside: avoid; }
  }

  @media(max-width: 768px) {
    .pocso-hero { padding: 40px 20px 32px; }
    .pocso-hero-inner { gap: 20px; }
    .pocso-hero-shield { display: none; }
    .pocso-tabs-wrap { padding: 0 16px; }
    .pocso-content { padding: 24px 20px; }
    .pocso-two-col, .pocso-compare-grid { grid-template-columns: 1fr; }
    .pocso-helpline-grid { grid-template-columns: 1fr 1fr; }
    .pocso-topbar { padding: 0 16px; }
    .pocso-topbar-title { display: none; }
    .pocso-resources-strip { padding: 16px 20px; }
    .pocso-section-table { font-size: 12px; }
    .pocso-section-table th, .pocso-section-table td { padding: 8px 10px; }
  }
`;

// ── TIMELINE DATA ─────────────────────────────────────────────────────────────
const HISTORY_TIMELINE = [
  {
    year: "Pre-1990s",
    badge: "rule",
    title: "The Legal Vacuum",
    desc: "Prior to dedicated child protection laws, sexual offences against children were prosecuted under the Indian Penal Code (IPC), 1860 — particularly Sections 375 (rape) and 354 (outraging modesty). These provisions were grossly inadequate: they applied primarily to female victims, failed to address male child victims, excluded non-penetrative sexual acts, and had no provisions for child-specific court procedures.",
  },
  {
    year: "1990",
    badge: "rule",
    title: "Committee on Amendments to Criminal Laws",
    desc: "The Law Commission of India, in its 172nd Report (2000), and several expert committees highlighted critical gaps in child protection law. Reports documented rising cases of child abuse but noted that the criminal justice system was re-traumatising survivors through adversarial cross-examination and public trials.",
  },
  {
    year: "2007",
    badge: "rule",
    title: "National Study on Child Abuse (MWCD)",
    desc: "The Ministry of Women and Child Development released India's first systematic national study on child abuse. The study found that 53.22% of children surveyed had experienced one or more forms of sexual abuse. This landmark study created the political urgency for a comprehensive legislative response.",
  },
  {
    year: "2010–2011",
    badge: "rule",
    title: "Draft Bill and Parliamentary Deliberation",
    desc: "The Protection of Children from Sexual Offences Bill was introduced in the Rajya Sabha in 2011. The Bill drew upon international frameworks including the UN Convention on the Rights of the Child (UNCRC, ratified by India in 1992) and the Optional Protocol on Sale of Children, Child Prostitution and Child Pornography.",
  },
  {
    year: "2012",
    badge: "enact",
    title: "POCSO Act Enacted — 19 June 2012",
    desc: "The Protection of Children from Sexual Offences Act, 2012 received Presidential assent and was notified in the Gazette of India on 20 June 2012. It came into force on 14 November 2012 (Children's Day). India became one of the first countries in Asia with a dedicated, comprehensive child sexual abuse legislation. The Act established Special Courts, mandatory reporting, child-friendly procedures, and strict punishment structures.",
  },
  {
    year: "2012",
    badge: "rule",
    title: "POCSO Rules, 2012 Notified",
    desc: "The Ministry of Women and Child Development notified the POCSO Rules, 2012 under Section 45 of the Act, outlining detailed procedures for police officers, medical personnel, and support persons, as well as compensation guidelines.",
  },
  {
    year: "2013",
    badge: "amend",
    title: "Criminal Law (Amendment) Act, 2013",
    desc: "In the aftermath of the December 2012 Delhi gang rape case, Parliament passed sweeping amendments to IPC, CrPC, and Evidence Act. While not a POCSO amendment per se, the Criminal Law Amendment Act 2013 strengthened the broader sexual offences framework that operates alongside POCSO.",
  },
  {
    year: "2015",
    badge: "case",
    title: "Bachpan Bachao Andolan v. Union of India (SC)",
    desc: "The Supreme Court issued comprehensive directions on child trafficking, pornography, and missing children. The Court directed states to establish Special Courts under POCSO and ordered the NCPCR to set up the POCSO e-Box for online complaint registration. This case was instrumental in the operationalisation of POCSO's infrastructure.",
  },
  {
    year: "2017",
    badge: "case",
    title: "POCSO e-Box Launch",
    desc: "The National Commission for Protection of Child Rights (NCPCR) launched the POCSO e-Box (pocso-ebox.ncpcr.gov.in) — an online portal enabling children to directly file complaints about sexual abuse without having to approach a police station. A critical access improvement for urban and rural children alike.",
  },
  {
    year: "2018",
    badge: "rule",
    title: "J.S. Verma Committee Recommendations Incorporated",
    desc: "Following reviews of POCSO's implementation, the Law Commission's 283rd Report (2018) recommended enhanced penalties, addressing the 'skin-to-skin' ambiguity in sexual assault definitions, and strengthening the definition of aggravated penetrative sexual assault to include positions of trust.",
  },
  {
    year: "2019",
    badge: "amend",
    title: "POCSO (Amendment) Act, 2019 — 5 August 2019",
    desc: "Parliament passed the most significant amendment to the POCSO Act, receiving Presidential assent on 5 August 2019. Key changes: (1) Death penalty introduced for aggravated penetrative sexual assault. (2) Child pornography provisions dramatically strengthened — mere possession of CSAM without deleting or reporting is now a criminal offence. (3) Penalties under Sections 4, 6, 8, and 10 significantly enhanced. (4) New provisions on 'use of child for pornographic purposes with intent.' (5) Attempt punishable under Section 9.",
  },
  {
    year: "2019",
    badge: "rule",
    title: "POCSO Rules (Amendment), 2020",
    desc: "The Ministry of Women and Child Development revised the POCSO Rules, 2012 with new provisions for: (1) Designated courts for child-friendly environments. (2) Detailed compensation framework for victims. (3) Training mandates for designated authorities. (4) Interim compensation provisions pending trial conclusion.",
  },
  {
    year: "2020",
    badge: "case",
    title: "Attorney General of India v. Satish (Bombay HC 'Skin-to-Skin' Case)",
    desc: "The Bombay High Court controversially held that 'skin-to-skin' contact was required for an act to constitute sexual assault under Section 7. This created a public outcry and was immediately challenged. The Supreme Court stayed the ruling within days.",
  },
  {
    year: "2021",
    badge: "case",
    title: "Attorney General of India v. Satish — Supreme Court Overrules",
    desc: "A 3-judge Supreme Court bench unanimously overruled the Bombay High Court's 'skin-to-skin' interpretation. The Court held that physical contact 'with sexual intent' is the essential ingredient, not whether skin directly touched skin. This landmark ruling restored the protective breadth of Section 7.",
  },
  {
    year: "2022–2024",
    badge: "case",
    title: "Ongoing Implementation Monitoring",
    desc: "The Supreme Court and various High Courts continue to issue directions on fast-tracking POCSO cases, reducing pendency in Special Courts, ensuring child-friendly court infrastructure, and improving victim compensation implementation. As of 2024, there remain approximately 2.4 lakh pending POCSO cases across India — a significant implementation challenge.",
  },
];

// ── FULL SECTIONS CONTENT ─────────────────────────────────────────────────────
const POCSO_ALL_SECTIONS = () => (
  <>
    <table className="pocso-section-table">
      <thead>
        <tr>
          <th>Section(s)</th><th>Offence</th><th>Punishment</th><th>Category</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["3–4","Penetrative Sexual Assault","Minimum 10 yrs, maximum life + fine","Severe"],
          ["5–6","Aggravated Penetrative Sexual Assault (by authority figure, armed forces, etc.)","Minimum 20 yrs, maximum life or death + fine","Most Severe"],
          ["7–8","Sexual Assault (non-penetrative, sexual intent)","3–5 years + fine","Severe"],
          ["9–10","Aggravated Sexual Assault (by authority, repeat offence, etc.)","5–7 years + fine","Severe"],
          ["11–12","Sexual Harassment (verbal, written, electronic, gestures)","Up to 3 years + fine","Moderate"],
          ["13–14","Use of child for pornographic purposes","5–7 years + fine (first offence); 7–10 years (repeat)","Severe"],
          ["15","Storage/possession of child pornographic material","Up to 3 years, or fine, or both","Moderate"],
          ["17","Abetment of offences under POCSO","Punished as if principal offender","Variable"],
          ["18","Attempt to commit offences","Punished for the full offence","Variable"],
          ["19","Mandatory reporting (failure = Section 21 offence)","Duty — not a punishment section","Procedural"],
          ["21","Failure to report / failure of media obligations","Up to 6 months + fine; Up to 1 year for institutions","Criminal"],
          ["23","Media prohibition on disclosure of child's identity","Up to 1 year + fine","Procedural"],
          ["29","Presumption of guilt in penetrative assault cases","Shifts burden of proof to accused","Evidentiary"],
          ["33","Special Court procedures; in-camera trial","Procedural safeguard","Court"],
          ["36","Child not to be exposed to accused in court","Procedural safeguard","Court"],
          ["42A","Act to override IPC where conflict exists","Overriding provision","Interpretation"],
        ].map(([sec, off, pun, cat]) => (
          <tr key={sec}>
            <td><span className="sec-num">S. {sec}</span></td>
            <td>{off}</td>
            <td><span className="penalty">{pun}</span></td>
            <td><span className="category">{cat}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

// ── HANDBOOK DATA ─────────────────────────────────────────────────────────────
const HANDBOOK = {

  history: {
    intro: "A deep dive into the legislative journey of the POCSO Act — from the legal vacuum of the 1990s, through the 2012 enactment, the landmark 2019 Amendment, pivotal Supreme Court cases, and the current implementation landscape. Understanding why this law was created is as important as knowing what it says.",
    sections: [
      {
        id: 'h1', icon: '01',
        title: 'The Legal Vacuum Before POCSO',
        render: () => (
          <>
            <p className="pocso-body-text">Before 2012, India had no dedicated legislation protecting children from sexual offences. Child sexual abuse was prosecuted under laws that were over 150 years old and fundamentally inadequate for modern reality.</p>
            <div className="pocso-warn-box">
              <h4>Critical Failures of Pre-POCSO Law</h4>
              <ul>
                <li><strong>IPC Section 375 (Rape):</strong> Applied only to female victims. Male and transgender children had no legal recourse for penetrative sexual assault.</li>
                <li><strong>IPC Section 354 (Outraging Modesty):</strong> Vague and poorly defined. Required proof of "outraging modesty of a woman" — not applicable to all children.</li>
                <li><strong>No Minimum Sentences:</strong> Judges had wide discretion, often resulting in shockingly lenient sentences for child sexual abuse.</li>
                <li><strong>Adversarial Court Procedures:</strong> Children were subjected to public cross-examination by defence lawyers, re-traumatising survivors in open court.</li>
                <li><strong>No Mandatory Reporting:</strong> Adults who knew about child abuse had no legal obligation to report it.</li>
                <li><strong>No Child Pornography Law:</strong> Possession and production of child sexual abuse material was not specifically criminalised.</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>The 2007 National Study Catalyst</h4>
              <p>The Ministry of Women and Child Development's 2007 National Study on Child Abuse surveyed 12,447 children, 2,324 young adults, and 2,449 stakeholders across 13 states. Its findings were explosive:</p>
              <ul>
                <li>53.22% of children surveyed reported being subjected to one or more forms of sexual abuse.</li>
                <li>52.94% of those abused were boys — shattering the myth that child sexual abuse primarily affects girls.</li>
                <li>50% of abusers were known to the child and trusted figures.</li>
                <li>Most children never reported the abuse due to shame, fear, and lack of faith in the system.</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'h2', icon: '02',
        title: 'Enactment: POCSO Act, 2012',
        render: () => (
          <>
            <p className="pocso-body-text">The Protection of Children from Sexual Offences Act, 2012 was a watershed moment in Indian child rights law. It was drafted with direct reference to India's obligations under international human rights treaties.</p>
            <div className="pocso-info-box">
              <h4>International Framework: India's Treaty Obligations</h4>
              <ul>
                <li><strong>UNCRC (1989):</strong> India ratified the UN Convention on the Rights of the Child in 1992. Articles 34 and 35 specifically require states to protect children from all forms of sexual exploitation.</li>
                <li><strong>Optional Protocol on Sale of Children (2002):</strong> India ratified this in 2005, obligating criminalisation of child pornography and child trafficking for sexual purposes.</li>
                <li><strong>Stockholm Declaration (1996):</strong> India was a signatory to the First World Congress against Commercial Sexual Exploitation of Children.</li>
              </ul>
            </div>
            <p className="pocso-body-text">The POCSO Act 2012 introduced five transformative principles that did not exist in Indian law before:</p>
            <div className="pocso-key-box">
              <h4>Five Revolutionary Principles of the 2012 Act</h4>
              <ul>
                <li><strong>1. Gender Neutrality:</strong> For the first time, the law explicitly protected children of all genders — boys, girls, and transgender children — equally.</li>
                <li><strong>2. Child-Friendly Justice:</strong> Created an entirely separate procedure for child victims: no police stations, in-camera trials, no direct cross-examination by the accused.</li>
                <li><strong>3. Mandatory Reporting:</strong> Section 19 imposed a legal duty on ALL adults to report known or suspected child sexual abuse — no exceptions based on profession or relationship.</li>
                <li><strong>4. Reversed Burden of Proof:</strong> Section 29 presumed the accused guilty in penetrative assault cases, shifting the burden to the accused to prove innocence.</li>
                <li><strong>5. Special Courts:</strong> Dedicated POCSO courts to ensure fast, child-sensitive trials, separate from regular criminal courts.</li>
              </ul>
            </div>
            <div className="pocso-gold-box">
              <h4>Key Dates in the 2012 Enactment</h4>
              <ul>
                <li><strong>28 May 2012:</strong> Bill introduced in Rajya Sabha</li>
                <li><strong>10 May 2012:</strong> Passed by Rajya Sabha</li>
                <li><strong>22 May 2012:</strong> Passed by Lok Sabha</li>
                <li><strong>19 June 2012:</strong> Presidential Assent received</li>
                <li><strong>14 November 2012:</strong> Act came into force (Children's Day)</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'h3', icon: '03',
        title: 'The 2019 Amendment: Strengthening the Act',
        render: () => (
          <>
            <p className="pocso-body-text">Seven years of implementation revealed gaps and emerging threats — particularly the explosive growth of child online sexual abuse material (CSAM) and concerns about inadequate sentencing. The 2019 Amendment addressed both with significant force.</p>
            <div className="pocso-compare-grid">
              <div className="pocso-compare-card old">
                <div className="pocso-compare-label">POCSO 2012 — Original</div>
                <div className="pocso-compare-title">Before the Amendment</div>
                <ul className="pocso-compare-list">
                  <li>Maximum penalty for aggravated penetrative assault: life imprisonment</li>
                  <li>No specific provision for child pornography storage</li>
                  <li>No death penalty provision</li>
                  <li>No provision for attempt liability (Section 9)</li>
                  <li>No definition of "child pornography" in the Act</li>
                  <li>No mandatory reporting for child pornography</li>
                </ul>
              </div>
              <div className="pocso-compare-card new">
                <div className="pocso-compare-label">POCSO 2019 — Amended</div>
                <div className="pocso-compare-title">After the Amendment</div>
                <ul className="pocso-compare-list">
                  <li>Death penalty added for aggravated penetrative assault (new Section 4)</li>
                  <li>Section 15: Specific offence for possession / storage / transmission of CSAM</li>
                  <li>Death penalty explicitly incorporated (contested but enacted)</li>
                  <li>Section 9(n): Attempt to commit sexual assault now separately punishable</li>
                  <li>Formal definition of "child pornography" added in Section 2(da)</li>
                  <li>Failing to delete/report CSAM is now a criminal offence</li>
                </ul>
              </div>
            </div>
            <div className="pocso-warn-box">
              <h4>Death Penalty Controversy</h4>
              <p>The introduction of the death penalty for aggravated penetrative sexual assault was debated extensively. Opponents argue that empirical evidence shows death penalties do not deter crime and may make offenders more likely to kill victims to eliminate witnesses. Proponents argue it reflects the severity of harm to children. The provision remains in force as of 2024.</p>
            </div>
            <div className="pocso-key-box">
              <h4>Section 15 (New): Child Pornography — A Three-Tier Offence</h4>
              <ul>
                <li><strong>Tier 1:</strong> Failure to delete / destroy CSAM AND failure to report it — Fine only.</li>
                <li><strong>Tier 2:</strong> Transmitting, distributing, displaying, or sharing CSAM without deletion/reporting — Up to 3 years + fine, or both.</li>
                <li><strong>Tier 3:</strong> Facilitating, using, or possessing CSAM for commercial purposes — Up to 5 years + fine (first offence); up to 7 years (second offence).</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'h4', icon: '04',
        title: 'Landmark Supreme Court Cases',
        render: () => (
          <>
            <p className="pocso-body-text">The courts have been active in interpreting and expanding the POCSO Act's protective framework. These cases have shaped how the law is applied in India.</p>
            <div className="pocso-caselaw-grid">
              {[
                {
                  name: "Bachpan Bachao Andolan v. Union of India",
                  meta: "Supreme Court of India | Writ Petition (Civil) No. 75/2012",
                  holding: "The Supreme Court issued sweeping directions requiring states to establish POCSO Special Courts in each district, mandating the NCPCR to create an online complaint mechanism (POCSO e-Box), and directing comprehensive data collection on pending POCSO cases. The Court invoked its parens patriae jurisdiction to protect children as a constitutional duty.",
                  significance: "Operationalised POCSO's infrastructure. Led directly to the creation of the POCSO e-Box portal."
                },
                {
                  name: "Attorney General of India v. Satish & Anr. (The 'Skin-to-Skin' Case)",
                  meta: "Supreme Court of India | Crl. Appeal No. 1410/2021 | 2021 SCC OnLine SC 1009",
                  holding: "The Supreme Court unanimously overruled the Nagpur Bench of the Bombay High Court's deeply controversial ruling that held 'skin-to-skin' physical contact was required to constitute sexual assault under Section 7. The Supreme Court held that 'physical contact' includes any touch 'with sexual intent' — the essence of the offence is the sexual intent, not the specific mechanics of skin contact.",
                  significance: "Restored the full protective scope of Section 7. Confirmed that pressing body parts over clothing with sexual intent constitutes sexual assault under POCSO."
                },
                {
                  name: "X v. Principal Secretary, Health and Family Welfare (Delhi)",
                  meta: "Supreme Court of India | 2022 | Abortion Rights of POCSO Victim",
                  holding: "The Supreme Court, dealing with a POCSO victim's right to abortion, affirmed that all survivors of rape and sexual assault (including POCSO victims) are entitled to safe abortion services. The Court emphasised the intersection of reproductive rights and child protection.",
                  significance: "Important for understanding the healthcare rights of POCSO survivors and the state's duty to provide medical support without further victimisation."
                },
                {
                  name: "Dhruv Rathi v. State (Delhi High Court)",
                  meta: "Delhi High Court | 2022",
                  holding: "The Delhi High Court held that in cases where the accused is a minor committing offences against another minor, POCSO applies alongside the Juvenile Justice Act. The JJ Act governs the procedure and reformation focus, while POCSO provisions determine the categorisation of the offence for the purpose of the JJB's assessment.",
                  significance: "Clarified the important intersection between POCSO and the Juvenile Justice (Care and Protection of Children) Act, 2015."
                },
                {
                  name: "State of Kerala v. Rasheed",
                  meta: "Supreme Court of India | 2019",
                  holding: "The Supreme Court clarified that the mandatory reporting obligation under Section 19 creates an absolute duty — not a discretionary one. The Court held that cultural or social contexts cannot exempt any adult from the legal duty to report abuse, and imposed costs on authorities who had failed to act on reports promptly.",
                  significance: "Strengthened the mandatory reporting framework and made clear that no cultural, familial, or institutional context can override Section 19's absolute obligation."
                },
                {
                  name: "Nipun Saxena v. Union of India",
                  meta: "Supreme Court of India | (2019) 2 SCC 703",
                  holding: "In this watershed ruling, the Supreme Court issued comprehensive guidelines on protecting the identity and privacy of victims of sexual offences, including POCSO victims. The Court prohibited media from disclosing any information that could identify the victim (name, address, school, photograph, employment) — at any stage including post-acquittal or death.",
                  significance: "Comprehensive privacy and identity protection for child victims. Established enforceable guidelines binding on all media and authorities."
                },
              ].map((c, i) => (
                <div className="pocso-case-card" key={i}>
                  <div className="pocso-case-name">{c.name}</div>
                  <div className="pocso-case-meta">{c.meta}</div>
                  <div className="pocso-case-holding">{c.holding}</div>
                  <div className="pocso-case-significance">⚖️ Significance: {c.significance}</div>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        id: 'h5', icon: '05',
        title: 'Complete Legislative Timeline',
        render: () => (
          <>
            <p className="pocso-body-text">The evolution of the POCSO Act from legal vacuum to comprehensive child protection framework, mapped chronologically.</p>
            <div className="pocso-timeline">
              {HISTORY_TIMELINE.map((item, i) => (
                <div className="pocso-timeline-item" key={i}>
                  <div className={`pocso-tl-badge ${item.badge}`}>{item.badge === 'enact' ? 'Enacted' : item.badge === 'amend' ? 'Amendment' : item.badge === 'case' ? 'Case Law' : 'Development'}</div>
                  <div className="pocso-tl-year">{item.year}</div>
                  <div className="pocso-tl-title">{item.title}</div>
                  <div className="pocso-tl-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        id: 'h6', icon: '06',
        title: 'Current Implementation: Challenges and Progress',
        render: () => (
          <>
            <div className="pocso-info-box">
              <h4>Implementation Progress (As of 2024)</h4>
              <ul>
                <li><strong>Special Courts:</strong> 1,023 dedicated POCSO courts established across India, with 28 states having at least one POCSO-only Fast Track Special Court (FTSC).</li>
                <li><strong>POCSO e-Box:</strong> Operational for online complaints; children can report without going to a police station.</li>
                <li><strong>NCPCR Oversight:</strong> National Commission for Protection of Child Rights actively monitors implementation and publishes annual compliance reports.</li>
                <li><strong>One Stop Centres (Sakhi):</strong> 733 centres across India providing integrated support (medical, legal, police) to women and child victims of violence.</li>
              </ul>
            </div>
            <div className="pocso-warn-box">
              <h4>Persistent Challenges</h4>
              <ul>
                <li><strong>Case Pendency:</strong> Approximately 2.4 lakh POCSO cases pending as of 2024. The average trial time remains 3–4 years, far from the Act's vision of one-year completion.</li>
                <li><strong>Conviction Rates:</strong> National conviction rate in POCSO cases is approximately 32–38%, with significant variation across states.</li>
                <li><strong>Mandatory Reporting Compliance:</strong> Widespread under-reporting by schools and institutions due to reputational fears, lack of awareness, and inadequate training.</li>
                <li><strong>Online Abuse Surge:</strong> CSAM cases and online grooming have grown exponentially; enforcement infrastructure lags significantly.</li>
                <li><strong>Victim Support Gaps:</strong> Compensation disbursement remains slow, and psychological rehabilitation services are unavailable in most districts outside major cities.</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>Comparison with Global Frameworks</h4>
              <ul>
                <li><strong>UK (Sexual Offences Act 2003):</strong> Similar structure; POCSO is broader in its mandatory reporting provisions. UK has a stronger digital enforcement infrastructure.</li>
                <li><strong>USA (PROTECT Act, 2003; CIPA, 2000):</strong> USA has age of consent variation by state; POCSO is uniform at 18. USA's child pornography laws have stronger enforcement mechanisms.</li>
                <li><strong>Australia (Criminal Code Act 1995):</strong> Australia's federal framework is similar but has more robust online investigation tools.</li>
                <li><strong>POCSO Advantage:</strong> The reversed burden of proof (Section 29) in penetrative assault cases is more progressive than most global equivalents.</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'h7', icon: '07',
        title: 'Myths vs. Facts: POCSO Edition',
        render: () => (
          <>
            <p className="pocso-body-text">Dangerous misconceptions about POCSO prevent justice and protect perpetrators. These are the most common — and most damaging — myths.</p>
            <table className="pocso-myths-table">
              <thead>
                <tr><th>Myth</th><th>Legal Fact</th></tr>
              </thead>
              <tbody>
                {[
                  ["Only girls can be victims under POCSO.", "POCSO is gender-neutral. It explicitly protects all persons under 18, regardless of gender."],
                  ["A minor who 'consented' cannot report under POCSO.", "Indian law sets the age of consent at 18. Any sexual act involving a person under 18 is a POCSO offence regardless of 'consent.' A child cannot legally consent to sexual activity."],
                  ["POCSO only applies to strangers, not family members.", "Statistically, over 50% of POCSO offenders are known to the child. The law explicitly includes family members, teachers, caregivers, and authority figures under aggravated offences."],
                  ["Filing an FIR requires a lawyer or guardian.", "Any child can report directly to a police officer or call 1098 (Childline). A lawyer is not required to file an FIR. A Support Person will be assigned by the court free of charge."],
                  ["POCSO requires a medical examination to prove abuse.", "Medical evidence is supportive but not required. Courts can and do convict solely on the child's testimony if it is consistent and credible. Absence of physical injury does not mean absence of abuse."],
                  ["Schools that report abuse will face defamation suits.", "Section 42 explicitly protects good-faith reporters. An educator who reports an apprehension of abuse cannot face civil or criminal liability for doing so."],
                  ["Watching or receiving child pornography is not a crime if you don't produce it.", "Under the amended Section 15, failing to report or delete CSAM is a criminal offence. Distributing, sharing, or possessing CSAM for any purpose is punishable by imprisonment."],
                  ["POCSO complaints can be 'settled' or 'withdrawn' outside court.", "POCSO offences are non-compoundable. Once reported, they cannot be 'settled,' 'withdrawn,' or 'compromised' between parties. The state prosecutes regardless of the victim's later wishes."],
                  ["Online abuse is not covered under POCSO.", "Section 11 explicitly covers electronic communication. POCSO covers online grooming, sexting with a minor, and using electronic media for sexual harassment."],
                ].map(([myth, fact], i) => (
                  <tr key={i}>
                    <td><span className="myth-label">✗ Myth</span><br/>{myth}</td>
                    <td><span className="fact-label">✓ Fact</span><br/>{fact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: 'h8', icon: '08',
        title: 'Legal Glossary',
        render: () => (
          <>
            <ul className="pocso-glossary-list">
              {[
                ["POCSO", "Protection of Children from Sexual Offences Act, 2012. India's comprehensive legislation for the protection of persons under 18 from sexual offences."],
                ["NCPCR", "National Commission for Protection of Child Rights. The statutory body overseeing POCSO implementation, operating the POCSO e-Box, and monitoring state compliance."],
                ["SJPU", "Special Juvenile Police Unit. A dedicated unit in every district police station trained to handle cases involving children. POCSO cases are handled by the SJPU."],
                ["CSAM", "Child Sexual Abuse Material. Legally criminalised under amended Section 15 of POCSO. Previously called 'child pornography' — the term CSAM is preferred as 'pornography' implies consent, which minors cannot give."],
                ["In-Camera Trial", "A trial conducted in private, with no members of the public or media present. Mandatory for all POCSO cases under Section 33 to protect the child's privacy."],
                ["Special Court", "A designated court for POCSO cases. Unlike regular criminal courts, Special Courts follow child-friendly procedures, have dedicated POCSO judges, and are required to complete trials within one year."],
                ["Support Person", "A designated individual (social worker or NGO representative) assigned to assist the child during police investigation and court proceedings under Rule 4 of the POCSO Rules."],
                ["FIR", "First Information Report. The formal complaint registered at a police station. Under POCSO, any information about an offence must be reduced to writing as an FIR, and a copy must be given to the informant."],
                ["Aggravated Offence", "A category of POCSO offence carrying higher penalties due to the relationship between the offender and victim, or circumstances of abuse. Examples: abuse by a parent, teacher, police officer, or during communal violence."],
                ["Section 29 Presumption", "The legal provision in POCSO that presumptively holds the accused guilty in penetrative and aggravated assault cases. The accused must prove their innocence rather than the prosecution proving guilt."],
                ["POCSO e-Box", "An online portal (pocso-ebox.ncpcr.gov.in) enabling children to file POCSO complaints directly from any internet-connected device, without going to a police station."],
                ["Age of Consent", "Under POCSO and Indian law, 18 years. Any sexual activity involving a person under 18 is illegal regardless of apparent agreement or 'willingness.'"],
              ].map(([term, def]) => (
                <li key={term}><strong>{term}:</strong> {def}</li>
              ))}
            </ul>
          </>
        ),
      },
    ],
  },

  children: {
    intro: "This section provides a complete, rights-based understanding of POCSO — the law in plain language, the reporting process, digital safety, body autonomy, and how to support a friend. This information belongs to you, and you have every right to it.",
    sections: [
      {
        id: 's1', icon: '01',
        title: 'POCSO: The Law in Plain Language',
        render: () => (
          <>
            <p className="pocso-body-text">The <strong>Protection of Children from Sexual Offences (POCSO) Act, 2012</strong> is a law that belongs to you. It was made specifically to protect people under 18 — from any kind of sexual harm, from any person, in any situation.</p>
            <div className="pocso-key-box">
              <h4>What POCSO Does in Simple Terms</h4>
              <ul>
                <li>It says clearly: No adult can touch a child's private parts, or ask a child to touch theirs, for any reason (except medically necessary ones).</li>
                <li>It says: You cannot be shown sexual images or videos. An adult asking you for such content is committing a crime.</li>
                <li>It says: Online abuse is the same as physical abuse — Section 11 covers messages, calls, and images.</li>
                <li>It says: If abuse happens, it is <strong>NEVER</strong> the child's fault — legally or morally.</li>
                <li>It says: Everyone who learns about child abuse must report it. Silence is illegal for adults.</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>The Key Sections You Should Know</h4>
              <ul>
                <li><strong>Sections 3–6:</strong> Penetrative sexual assault. Punishment 10 years to life or death.</li>
                <li><strong>Sections 7–8:</strong> Any sexual touching or contact with sexual intent. 3–5 years.</li>
                <li><strong>Sections 11–12:</strong> Sexual harassment — verbal comments, showing images, online messages. Up to 3 years.</li>
                <li><strong>Section 19:</strong> Every adult who knows about abuse MUST report it to police.</li>
                <li><strong>Section 23:</strong> No one — not newspapers, TV, or social media — can say your name or show your face.</li>
              </ul>
            </div>
            <div className="pocso-info-box">
              <h4>Age of Consent is 18</h4>
              <p>Under Indian law, no person under 18 can legally agree to sexual activity. Even if you feel you said "yes," the law says no adult or older teen can take that as valid consent. This protects you — not restricts you.</p>
            </div>
          </>
        ),
      },
      {
        id: 's2', icon: '02',
        title: 'Your Body, Your Rights: Consent and Boundaries',
        render: () => (
          <>
            <p className="pocso-body-text">Consent is a concept that every young person deserves to understand clearly. It is the foundation of safe relationships and the basis of the POCSO Act.</p>
            <div className="pocso-dark-box">
              <h4>What Real Consent Looks Like (FRIES)</h4>
              <ul>
                <li><strong>F — Freely Given:</strong> Not under pressure, fear, or alcohol/drugs. A "yes" given because you're scared is not consent.</li>
                <li><strong>R — Reversible:</strong> You can change your mind at any time. Even if you said yes before, you can say no now.</li>
                <li><strong>I — Informed:</strong> You know exactly what you're agreeing to.</li>
                <li><strong>E — Enthusiastic:</strong> Not reluctant. Not "I guess so." Genuine willingness.</li>
                <li><strong>S — Specific:</strong> Agreeing to one thing doesn't mean agreeing to everything.</li>
              </ul>
            </div>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">✅ Safe and Appropriate</div>
                <ul className="pocso-col-list">
                  <li>Medical examination with a parent/guardian present and your knowledge</li>
                  <li>Age-appropriate health education at school</li>
                  <li>A hug or touch you fully want and can say No to</li>
                  <li>A doctor examining you for a specific medical reason</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🚨 POCSO Offence (Illegal)</div>
                <ul className="pocso-col-list">
                  <li>Any adult touching your private parts without medical reason</li>
                  <li>Being shown pornographic images or videos</li>
                  <li>Sexual comments, texts, or requests from any adult</li>
                  <li>An adult asking for photos of your body online or offline</li>
                  <li>Being asked to keep any "special secret" with an adult involving your body</li>
                </ul>
              </div>
            </div>
            <div className="pocso-warn-box">
              <h4>Online = Real: Digital Abuse Is a POCSO Crime</h4>
              <p>If an adult or older person sends you sexual images, asks for nude/semi-nude photos, sends you sexual messages, or asks you to appear on camera — that is a POCSO offence under Section 11. It does not matter if they are in another city or country. The law applies fully online.</p>
            </div>
          </>
        ),
      },
      {
        id: 's3', icon: '03',
        title: 'What Grooming Looks Like (And How to Spot It)',
        render: () => (
          <>
            <p className="pocso-body-text"><strong>Grooming</strong> is a process where an adult builds trust with a child to gain access and create situations where abuse can happen. It often doesn't feel threatening at first — that's precisely what makes it dangerous.</p>
            <div className="pocso-key-box">
              <h4>The 6 Stages of Grooming</h4>
              <ol style={{paddingLeft:'18px',margin:'8px 0 0'}}>
                <li style={{marginBottom:'8px',fontSize:'14px',lineHeight:'1.7',color:'var(--ink-soft)'}}><strong>Target Selection:</strong> Seeking out a vulnerable child — one who is lonely, has family problems, or wants validation.</li>
                <li style={{marginBottom:'8px',fontSize:'14px',lineHeight:'1.7',color:'var(--ink-soft)'}}><strong>Trust Building:</strong> Showing extreme interest, giving gifts, being the "cool" adult who understands you.</li>
                <li style={{marginBottom:'8px',fontSize:'14px',lineHeight:'1.7',color:'var(--ink-soft)'}}><strong>Filling Needs:</strong> Providing emotional support, money, attention — creating dependency.</li>
                <li style={{marginBottom:'8px',fontSize:'14px',lineHeight:'1.7',color:'var(--ink-soft)'}}><strong>Isolation:</strong> Creating secrets, saying "your parents won't understand us," separating you from friends and family.</li>
                <li style={{marginBottom:'8px',fontSize:'14px',lineHeight:'1.7',color:'var(--ink-soft)'}}><strong>Desensitisation:</strong> Gradually introducing sexual topics, jokes, or physical contact to normalise it.</li>
                <li style={{marginBottom:'8px',fontSize:'14px',lineHeight:'1.7',color:'var(--ink-soft)'}}><strong>Maintaining Control:</strong> Using shame, threats, or the established relationship to prevent disclosure.</li>
              </ol>
            </div>
            <div className="pocso-warn-box">
              <h4>Red Flags: Trust Your Instincts</h4>
              <ul>
                <li>An adult who insists on private, one-on-one time with you</li>
                <li>An adult who wants to keep your friendship "secret"</li>
                <li>Someone who gives you unusual gifts, money, or special privileges</li>
                <li>An adult who makes sexual jokes or touches you "accidentally"</li>
                <li>Online contacts who quickly become very close and want to video call privately</li>
                <li>Anyone who says "you're so mature for your age" or treats you like an adult</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 's4', icon: '04',
        title: 'The Reporting Process — Step by Step',
        render: () => (
          <>
            <p className="pocso-body-text">Reporting abuse is one of the bravest things you can do. The law has built strong protections for you at every step of this process.</p>
            <ol className="pocso-steps">
              <li><strong>Your immediate safety first.</strong> Call 1098 (Childline) or 100 (Police) if you are in immediate danger. Move to a safe place. You can call from any phone, even without credit.</li>
              <li><strong>Tell a trusted adult.</strong> A parent, teacher, school counsellor, or relative. If the abuser is a family member, tell a teacher or school counsellor first.</li>
              <li><strong>Preserve any evidence.</strong> If you have messages or images, do not delete them. Take a screenshot and save it somewhere the abuser cannot access.</li>
              <li><strong>FIR Registration.</strong> The trusted adult takes you to a police station where an FIR (complaint) is registered. You can request a female police officer. Your statement is written in YOUR words.</li>
              <li><strong>Medical examination (only if needed).</strong> A doctor examines you — this is to support your case. A parent or Support Person will be with you the whole time.</li>
              <li><strong>Magistrate's statement.</strong> Your statement is recorded by a judge in a friendly setting, not a courtroom. This happens within 24 hours of the FIR.</li>
              <li><strong>Court proceedings.</strong> The trial happens in a private court (in-camera). You do not face the accused. Questions are put through the judge.</li>
            </ol>
            <div className="pocso-info-box">
              <h4>Your Rights During the Process</h4>
              <ul>
                <li>Your name, school, address, and face can NEVER be published or broadcast.</li>
                <li>You can have a Support Person (social worker) with you at all times.</li>
                <li>You can give your statement at home, not at a police station.</li>
                <li>You are NEVER required to repeat the story to multiple people.</li>
                <li>You can apply for compensation for trauma and medical costs.</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 's5', icon: '05',
        title: 'Supporting a Friend Who Discloses Abuse',
        render: () => (
          <>
            <p className="pocso-body-text">If a friend tells you they are being abused, what you do in the next few minutes matters enormously. Here is exactly what to do and say.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">✅ Say and Do This</div>
                <ul className="pocso-col-list">
                  <li>"I believe you. Thank you for trusting me."</li>
                  <li>"This is not your fault."</li>
                  <li>"You are brave for telling me."</li>
                  <li>Stay calm even if you feel shocked</li>
                  <li>Encourage them to tell a trusted adult together</li>
                  <li>Offer to be with them when they report</li>
                  <li>Keep checking in on them in the days after</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🚫 Never Say This</div>
                <ul className="pocso-col-list">
                  <li>"Are you sure? Maybe you misunderstood?"</li>
                  <li>"Why didn't you stop them?"</li>
                  <li>"What were you wearing / doing?"</li>
                  <li>"Let's keep this between us for now"</li>
                  <li>Confront the abuser yourself</li>
                  <li>Post about it on social media</li>
                  <li>"Maybe it wasn't that serious?"</li>
                </ul>
              </div>
            </div>
            <div className="pocso-gold-box">
              <h4>You Cannot Be Forced to Keep a Secret</h4>
              <p>Under Section 19, any adult who hears about abuse must report it. As a child, you are not legally bound by this — but you have the moral right to tell a trusted adult even if your friend asks you not to. Keeping the secret does not protect your friend. Getting help does.</p>
            </div>
          </>
        ),
      },
      {
        id: 's6', icon: '06',
        title: 'Helplines and Immediate Support',
        render: () => (
          <>
            <div className="pocso-helpline-emergency">
              <span className="big-num">1098</span>
              <div>
                <h4>Childline India — Your First Call</h4>
                <p>Free · 24/7 · Confidential · Available in all states · Trained crisis counsellors · Can arrange immediate rescue · No charges from any phone</p>
              </div>
            </div>
            <div className="pocso-helpline-grid">
              {[
                ['Police Emergency', '100 / 112', '24/7'],
                ['Women Helpline', '181', '24/7'],
                ['POCSO e-Box', 'pocso-ebox.ncpcr.gov.in', 'Online complaint'],
                ['iCall (TISS)', '9152987821', 'Mon–Sat 8am–10pm'],
                ['Kiran (Mental Health)', '1800-599-0019', 'Free, 24/7'],
                ['Vandrevala Foundation', '9999-666-555', '24/7'],
                ['Women & Child (State)', '1090', 'Most states 24/7'],
                ['Sakhi One Stop Centre', '181', 'Near district hospital'],
              ].map(([name, num, avail]) => (
                <div key={name} className="pocso-helpline-card">
                  <h4>{name}</h4>
                  <span className={`num ${num.length > 13 ? 'small' : ''}`}>{num}</span>
                  <span className="avail">{avail}</span>
                </div>
              ))}
            </div>
            <div className="pocso-fill-in">
              <h4>My Personal Safety Network</h4>
              {[['Safe Adult at Home', 1], ['Safe Adult at School', 2], ['Safe Friend or Relative', 3]].map(([type, n]) => (
                <div key={n} style={{marginBottom:'14px'}}>
                  <div style={{fontSize:'12px',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>{type}</div>
                  <div className="pocso-fill-row">
                    <span className="pocso-fill-num">{n}</span>
                    <span style={{minWidth:'60px',fontSize:'13px'}}>Name:</span>
                    <span className="pocso-fill-line"/>
                    <span style={{minWidth:'70px',fontSize:'13px',marginLeft:'10px'}}>Contact:</span>
                    <span className="pocso-fill-line"/>
                  </div>
                </div>
              ))}
            </div>
          </>
        ),
      },
    ],
  },

  parents: {
    intro: "Your role as a parent is irreplaceable in both preventing abuse and ensuring that if it occurs, your child receives swift, compassionate justice. This section details your legal rights, how to recognise warning signs, how to respond to a disclosure, and how the POCSO Act's legal procedures protect your child.",
    sections: [
      {
        id: 'p1', icon: '01',
        title: 'Understanding Your Child\'s Legal Rights',
        render: () => (
          <>
            <p className="pocso-body-text">The POCSO Act is designed around a fundamental principle: the justice system must adapt to the child, not the other way around. These are the enforceable rights your child has during the investigation and trial.</p>
            <div className="pocso-key-box">
              <h4>Rights During Police Investigation</h4>
              <ul>
                <li><strong>Section 24(1):</strong> No child can be detained at a police station overnight for any reason. Interviews must happen at the child's residence or a place of choice.</li>
                <li><strong>Section 24(2):</strong> The police officer recording the statement shall not be in police uniform.</li>
                <li><strong>Section 24(3):</strong> A parent, guardian, or trusted person must be present during the statement recording.</li>
                <li><strong>Female Officer:</strong> The statement of a girl child must be recorded by a female police officer.</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>Rights During Trial</h4>
              <ul>
                <li><strong>Section 33 (In-Camera Trial):</strong> Proceedings are strictly private. No public audience. The courtroom environment must be child-friendly.</li>
                <li><strong>Section 36:</strong> The child shall not be exposed to the accused in any manner during testimony. Screens or video conferencing can be used.</li>
                <li><strong>No Direct Cross-Examination:</strong> The accused's counsel cannot directly question the child. Questions are submitted to the Special Court Judge, who puts them to the child in a sensitive manner.</li>
                <li><strong>Section 33(6):</strong> No character evidence of the child victim shall be used in defence. The victim's past conduct or morality cannot be raised.</li>
              </ul>
            </div>
            <div className="pocso-info-box">
              <h4>Compensation: Section 33(8) and POCSO Rules 9 & 7</h4>
              <ul>
                <li>The Special Court can direct the State Government to pay compensation for physical or mental trauma.</li>
                <li>Compensation can cover medical expenses, rehabilitation, and educational support.</li>
                <li>Interim compensation can be paid during the trial pending the final order.</li>
                <li>Application through the District Legal Services Authority (DLSA) at no cost.</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'p2', icon: '02',
        title: 'Recognising Signs of Abuse',
        render: () => (
          <>
            <p className="pocso-body-text">Children rarely disclose abuse directly. Studies show most children delay disclosure for months or years, or never disclose at all. Parents must be vigilant for indirect signs.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🔴 Behavioural Indicators</div>
                <ul className="pocso-col-list">
                  <li>Sudden, unexplained fear of a specific person, place, or object</li>
                  <li>Regression — bed-wetting, thumb-sucking, baby talk in older children</li>
                  <li>Drastic changes in school performance, attendance, or social behaviour</li>
                  <li>Inappropriate sexual knowledge, language, or drawings for their age</li>
                  <li>Extreme secrecy about phone use; panic if phone is checked</li>
                  <li>Self-harm, withdrawal, depression, or sudden aggression</li>
                  <li>Reluctance to change clothes or undress for PE</li>
                  <li>Nightmares, sleep disturbances, or fear of sleeping alone</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🔴 Physical Indicators</div>
                <ul className="pocso-col-list">
                  <li>Unexplained bruises, bleeding, or soreness in genital areas</li>
                  <li>Difficulty walking, sitting, or using the toilet</li>
                  <li>Frequent stomach aches or headaches without medical cause</li>
                  <li>Torn, stained, or bloody underwear</li>
                  <li>Unexplained STIs or urinary infections in a child</li>
                  <li>Pregnancy in an adolescent</li>
                </ul>
              </div>
            </div>
            <div className="pocso-gold-box">
              <h4>Digital Warning Signs (Online Abuse)</h4>
              <ul>
                <li>Unexplained new devices, accounts, money, gifts from "online friends"</li>
                <li>Switching screens or hiding phone when you approach</li>
                <li>Spending unusual amounts of time online, particularly at night</li>
                <li>Becoming withdrawn after online activity</li>
                <li>References to people you don't know from "online"</li>
                <li>Receiving messages from adults you don't recognise</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'p3', icon: '03',
        title: 'Responding to a Disclosure: Do\'s and Don\'ts',
        render: () => (
          <>
            <p className="pocso-body-text">The moment your child discloses abuse is one of the most critical moments in their recovery and the integrity of any future legal case. Your response in the next few minutes matters enormously.</p>
            <div className="pocso-dark-box">
              <h4>What to Say When Your Child Discloses</h4>
              <ul>
                <li>"I believe you. Thank you for telling me."</li>
                <li>"This is NOT your fault. Not in any way."</li>
                <li>"You are safe now. I am going to make sure you are protected."</li>
                <li>"You did the right thing by telling me."</li>
                <li>"I am not angry with you. I am very glad you told me."</li>
              </ul>
            </div>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">✅ DO</div>
                <ul className="pocso-col-list">
                  <li>Stay calm — manage your shock away from the child</li>
                  <li>Believe them unconditionally, immediately</li>
                  <li>Use their exact words when reporting — do not "correct" terminology</li>
                  <li>Ensure their immediate physical safety</li>
                  <li>Contact Childline (1098) or police promptly</li>
                  <li>Document what they said as precisely as possible</li>
                  <li>Seek trauma-informed counselling for the child</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🚫 DO NOT</div>
                <ul className="pocso-col-list">
                  <li>Ask leading questions ("Did they do X?") — let them speak freely</li>
                  <li>Interrogate them for details — that is for professionals</li>
                  <li>Confront the accused — this can destroy evidence and endanger the child</li>
                  <li>Blame or question the child in any way</li>
                  <li>Force them to repeat the story to family members</li>
                  <li>Try to "resolve" it privately within the family</li>
                  <li>Post about it on social media under any circumstances</li>
                </ul>
              </div>
            </div>
            <div className="pocso-warn-box">
              <h4>If the Accused is a Family Member</h4>
              <p>This is devastating, but the law is clear: the child's safety is paramount. Do NOT confront the accused. Do NOT try to handle it "within the family." Contact Childline (1098) first — they can advise you on safe removal and legal options. Children are statistically most at risk from known and trusted adults, including family members.</p>
            </div>
          </>
        ),
      },
      {
        id: 'p4', icon: '04',
        title: 'The Legal Process: What to Expect',
        render: () => (
          <>
            <p className="pocso-body-text">Many parents fear the legal process will further traumatise their child. Understanding the process removes that fear. POCSO is designed to minimise trauma at every step.</p>
            <ol className="pocso-steps">
              <li><strong>FIR Registration.</strong> Go to any police station. Request the officer not be in uniform. Your child's statement is recorded in their own words. The child must not be kept at the police station beyond the time needed for the statement.</li>
              <li><strong>Support Person Assignment.</strong> A social worker or NGO representative (Support Person) is assigned to your family under Rule 4. They accompany your child throughout the process at no charge.</li>
              <li><strong>Medical Examination.</strong> Conducted at a government hospital by a qualified doctor. A parent or trusted adult is always present. The examination is supportive, not required for prosecution.</li>
              <li><strong>Magistrate's Statement.</strong> Recorded within 24 hours. In a private, child-friendly setting. The magistrate ensures the child is comfortable and not under stress.</li>
              <li><strong>Charge Sheet.</strong> Police submit a charge sheet to the Special POCSO Court within 60 days for accused in custody or 90 days otherwise.</li>
              <li><strong>Special Court Trial.</strong> In-camera. No accused face-to-face contact. Questions through the judge. Maximum 1 year timeline mandated. Victim cannot be asked about character or prior behaviour.</li>
              <li><strong>Compensation Application.</strong> File through DLSA at any stage. Interim compensation can be accessed before the trial concludes.</li>
            </ol>
            <div className="pocso-info-box">
              <h4>Section 29: Presumption of Guilt</h4>
              <p>In cases of penetrative and aggravated sexual assault, the Special Court presumes the accused committed the offence. The accused must prove their innocence. You do not need to prove the abuse happened beyond a reasonable doubt — the law is on your child's side.</p>
            </div>
          </>
        ),
      },
      {
        id: 'p5', icon: '05',
        title: 'Child-Proofing Digital Life',
        render: () => (
          <>
            <p className="pocso-body-text">Online sexual exploitation of children has increased dramatically. Here is a practical framework for keeping your child safe in digital spaces.</p>
            <div className="pocso-key-box">
              <h4>Age-Appropriate Digital Safety Framework</h4>
              <ul>
                <li><strong>Ages 6–10:</strong> Supervised device use only. Parental controls on all devices. Regular conversations about "safe secrets" vs "unsafe secrets."</li>
                <li><strong>Ages 11–13:</strong> Introduce concepts of online privacy, digital consent, and the permanence of images. Discuss sexting laws explicitly. Agree on no-password-secret devices.</li>
                <li><strong>Ages 14–17:</strong> Frank conversations about online relationships, grooming patterns, and the legal consequences of CSAM. Maintain open communication, not surveillance.</li>
              </ul>
            </div>
            <div className="pocso-gold-box">
              <h4>The Conversation You Must Have</h4>
              <p>Children who can speak openly to their parents about bodies, boundaries, and safety are significantly more likely to disclose abuse quickly. Use anatomically correct terms for body parts from an early age. This normalises the conversation and makes it easier for a child to report abuse using clear language.</p>
            </div>
          </>
        ),
      },
    ],
  },

  educators: {
    intro: "Schools are the front line of child protection. Educators are among the most likely adults to receive a disclosure, observe warning signs, and have the legal authority to act. This section outlines your mandatory legal obligations, institutional policies, and best practices for creating a genuinely safe school environment.",
    sections: [
      {
        id: 'e1', icon: '01',
        title: 'Mandatory Reporting: Your Legal Obligation',
        render: () => (
          <>
            <p className="pocso-body-text">Mandatory reporting under POCSO is absolute. There is no professional discretion, no institutional permission required, and no waiting for "certainty." The law imposes a duty the moment you have knowledge or reasonable apprehension of abuse.</p>
            <div className="pocso-warn-box">
              <h4>Section 19: The Absolute Duty</h4>
              <p>Every person who has apprehension that an offence under POCSO is about to occur or has reason to believe or knowledge that an offence has been committed <strong>shall</strong> provide information to the SJPU or local police. The word "shall" in law means this is mandatory and non-discretionary.</p>
            </div>
            <div className="pocso-warn-box">
              <h4>Section 21: Criminal Penalty for Failure</h4>
              <p>Any person required to report under Section 19 who fails to do so shall be punished with imprisonment of up to <strong>6 months</strong>, or a fine, or both. If the failure is by a person in charge of an institution (a principal), the penalty is <strong>up to 1 year</strong> of imprisonment.</p>
            </div>
            <div className="pocso-key-box">
              <h4>Critical: Internal Policies Do NOT Override Section 19</h4>
              <ul>
                <li>If your school policy says "report to the Principal first," that is for internal purposes only.</li>
                <li>If the Principal refuses to report to police, YOUR individual legal obligation under Section 19 is NOT discharged.</li>
                <li>You must still report to the SJPU or local police directly.</li>
                <li>Keeping the information within the school's "internal process" while not reporting to police is a criminal failure under Section 21.</li>
              </ul>
            </div>
            <div className="pocso-info-box">
              <h4>Section 42: Protection for Good-Faith Reporters</h4>
              <p>If you report an apprehension of abuse based on reasonable indicators and it later turns out to be incorrect, you cannot be sued for defamation or face civil/criminal liability, provided the report was made in good faith and not maliciously. Report first — verify later.</p>
            </div>
          </>
        ),
      },
      {
        id: 'e2', icon: '02',
        title: 'Institutional Liability and Safeguarding Policy',
        render: () => (
          <>
            <p className="pocso-body-text">Educational institutions have proactive obligations that go well beyond responding to incidents. Prevention requires institutional infrastructure.</p>
            <div className="pocso-key-box">
              <h4>Mandatory Institutional Requirements</h4>
              <ul>
                <li><strong>Background Checks:</strong> Police verification and background checks for ALL staff — teaching, non-teaching, administrative, bus drivers, canteen staff, and contracted workers.</li>
                <li><strong>Designated Safeguarding Lead (DSL):</strong> Every school should designate a trained staff member responsible for POCSO-related disclosures and reporting.</li>
                <li><strong>CCTV Coverage:</strong> Corridors, entry/exit points, playgrounds, and common areas (not restrooms or changing rooms).</li>
                <li><strong>No-Isolation Policy:</strong> Staff members must not be alone with a single child in a closed, unobservable space.</li>
                <li><strong>Student Training:</strong> Age-appropriate body safety education is not optional. POCSO expects children to know their rights.</li>
                <li><strong>Complaint Mechanism:</strong> An accessible, anonymous way for students to report concerns about adults in the school.</li>
              </ul>
            </div>
            <div className="pocso-gold-box">
              <h4>School POCSO Policy: Essential Components</h4>
              <ul>
                <li>Clear procedures for receiving and documenting a disclosure</li>
                <li>Reporting flowchart visible to all staff</li>
                <li>Designated points of contact for students (not just management)</li>
                <li>Annual POCSO training for all staff (teaching and non-teaching)</li>
                <li>Annual body safety curriculum for students across all grade levels</li>
                <li>Clear policy on staff-student digital communication boundaries</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'e3', icon: '03',
        title: 'Handling a Disclosure at School',
        render: () => (
          <>
            <p className="pocso-body-text">A student's disclosure to a teacher is often the first time they have spoken about abuse. How you respond determines whether justice is possible.</p>
            <ol className="pocso-steps">
              <li><strong>Listen, don't interrogate.</strong> Say "I hear you. I believe you. This is not your fault." Do not ask "How?" "Why?" or "Are you sure?" — these are investigative questions that are the police's job.</li>
              <li><strong>Document exactly.</strong> Write down the student's exact words, the date, time, and location of the disclosure immediately. Do not translate or paraphrase their language. A 9-year-old's vocabulary is valid in court.</li>
              <li><strong>Absolute confidentiality.</strong> Do NOT discuss in the staffroom. Do not tell other teachers unless they are the DSL. Do not tell the student's friends or relatives without professional guidance.</li>
              <li><strong>If the suspected abuser is a family member:</strong> Do NOT contact the parents first. Contact Childline (1098) for immediate guidance. Contacting a suspected abuser-parent can place the child in grave danger.</li>
              <li><strong>Report to SJPU/Police.</strong> This must happen promptly — same day if possible. Report to the Designated Safeguarding Lead AND to the police. Do not wait for "certainty."</li>
              <li><strong>Do NOT conduct an internal investigation.</strong> Schools have no legal authority to investigate POCSO offences. An internal "inquiry" can contaminate evidence, tip off the accused, and constitute interference in a criminal matter.</li>
              <li><strong>Ensure ongoing support.</strong> Assign the Support Person, connect with mental health resources, maintain normalcy in the child's school routine as far as possible.</li>
            </ol>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">✅ Say to the Student</div>
                <ul className="pocso-col-list">
                  <li>"I believe you."</li>
                  <li>"This is not your fault."</li>
                  <li>"You were right to tell me."</li>
                  <li>"I will help you."</li>
                  <li>"I need to tell some people who can help — is that okay?"</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🚫 Never Say to the Student</div>
                <ul className="pocso-col-list">
                  <li>"Are you sure this really happened?"</li>
                  <li>"Why didn't you tell someone sooner?"</li>
                  <li>"Let's keep this between us for now."</li>
                  <li>"Have you told your parents?"</li>
                  <li>"I need to ask you exactly what happened."</li>
                </ul>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'e4', icon: '04',
        title: 'Delivering POCSO Education: Curriculum Guide',
        render: () => (
          <>
            <p className="pocso-body-text">Every school is expected to deliver age-appropriate body safety education. Here is a framework organised by developmental stage.</p>
            <div className="pocso-key-box">
              <h4>Grade 1–3 (Ages 6–8): Body Safety Basics</h4>
              <ul>
                <li>Names for all body parts using correct anatomical terminology</li>
                <li>"Private parts" concept — covered by swimwear</li>
                <li>Concept of safe touch vs. unsafe touch</li>
                <li>"My body belongs to me" — body autonomy</li>
                <li>Safe and unsafe secrets — no adult should ask for secrets about bodies</li>
                <li>Three trusted adults to tell if something happens</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>Grade 4–6 (Ages 9–11): Rights and Recognition</h4>
              <ul>
                <li>POCSO Act explained in age-appropriate terms — "It is a law that protects you"</li>
                <li>Consent — the right to say no to any touch</li>
                <li>Grooming — what it looks like, why it's confusing</li>
                <li>Online safety — what is appropriate contact with adults online</li>
                <li>How to report — Childline 1098, trusted adults, school process</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>Grade 7–9 (Ages 12–14): Legal Framework and Digital Safety</h4>
              <ul>
                <li>Full explanation of POCSO sections in accessible language</li>
                <li>Age of consent — 18 in India and its legal implications</li>
                <li>Digital abuse — sexting, CSAM laws, online grooming</li>
                <li>Supporting a friend who discloses abuse</li>
                <li>Consent in relationships — FRIES framework</li>
                <li>Report mechanisms: POCSO e-Box, Childline, Safe School mechanism</li>
              </ul>
            </div>
            <div className="pocso-key-box">
              <h4>Grade 10–12 (Ages 15–17): Deep Dive and Leadership</h4>
              <ul>
                <li>Full POCSO Act — legislative history, key sections, 2019 Amendment</li>
                <li>Intersection of POCSO with Juvenile Justice Act</li>
                <li>Bystander intervention — how to respond when you witness abuse</li>
                <li>Power and coercion in relationships</li>
                <li>Gender, power, and the social context of abuse</li>
                <li>Mental health and trauma — long-term impacts and support</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'e5', icon: '05',
        title: 'Staff Training Requirements',
        render: () => (
          <>
            <p className="pocso-body-text">POCSO compliance is not a one-time event. Regular, high-quality training is the cornerstone of institutional safeguarding.</p>
            <div className="pocso-info-box">
              <h4>Minimum Annual Training Requirements for All Staff</h4>
              <ul>
                <li><strong>Module 1 (All Staff):</strong> POCSO Act overview — what it covers, what their obligations are, what the penalties for non-compliance are.</li>
                <li><strong>Module 2 (All Staff):</strong> Signs of abuse recognition — behavioural and physical indicators.</li>
                <li><strong>Module 3 (All Teaching Staff):</strong> Receiving a disclosure — what to say, what not to say, documentation protocol.</li>
                <li><strong>Module 4 (DSL/Management):</strong> Reporting procedures, working with SJPU, court procedures, institutional liability.</li>
                <li><strong>Module 5 (Senior Teachers):</strong> Digital safety and online abuse — identifying grooming, CSAM laws.</li>
              </ul>
            </div>
            <div className="pocso-gold-box">
              <h4>Documentation: What to Keep on File</h4>
              <ul>
                <li>Record of all POCSO training sessions (dates, attendees, content)</li>
                <li>Copies of all disclosures received and reporting actions taken</li>
                <li>Background check documentation for all staff</li>
                <li>Minutes of any safeguarding policy reviews</li>
                <li>Evidence of student body safety education (lesson plans, attendance)</li>
                <li>These documents protect the institution if questions arise later</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 'e6', icon: '06',
        title: 'Helplines and Institutional Resources',
        render: () => (
          <>
            <div className="pocso-helpline-emergency">
              <span className="big-num">1098</span>
              <div>
                <h4>Childline India — Schools' Primary Contact</h4>
                <p>Free · 24/7 · Can advise schools on immediate procedures · Connects to SJPU · Safe home placement if needed</p>
              </div>
            </div>
            <div className="pocso-helpline-grid">
              {[
                ['SJPU / Local Police', '100 / 112', '24/7 Emergency'],
                ['NCPCR', '1800-121-2830', 'National Commission'],
                ['POCSO e-Box', 'ncpcr.gov.in/pocso', 'Online reporting'],
                ['District CWC', 'Via District Magistrate', 'Child Welfare Committee'],
                ['DLSA', 'Via District Court', 'Free legal services'],
                ['State SCPCR', 'State-specific', 'State Commission'],
                ['Women & Child Dept.', '1090', 'State helpline'],
                ['Sakhi One Stop', '181', 'District hospitals'],
              ].map(([name, num, avail]) => (
                <div key={name} className="pocso-helpline-card">
                  <h4>{name}</h4>
                  <span className={`num ${num.length > 13 ? 'small' : ''}`}>{num}</span>
                  <span className="avail">{avail}</span>
                </div>
              ))}
            </div>
          </>
        ),
      },
    ],
  },
};

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────
const QUIZ = {
  history: [
    { q: "In which year did the POCSO Act come into force?", opts: ["2007","2010","2012","2015"], correct: 2, explain: "The POCSO Act, 2012 came into force on 14 November 2012 — Children's Day. It received Presidential assent on 19 June 2012." },
    { q: "The 2007 National Study on Child Abuse found that what percentage of children surveyed had experienced sexual abuse?", opts: ["12%","28%","53%","71%"], correct: 2, explain: "The MoWCD 2007 National Study found 53.22% of children surveyed had been subjected to one or more forms of sexual abuse — shocking data that catalysed the POCSO legislation." },
    { q: "The 2019 POCSO Amendment introduced which new provision that was not in the original Act?", opts: ["Mandatory reporting","In-camera trials","Death penalty for aggravated assault","Special courts"], correct: 2, explain: "The POCSO (Amendment) Act, 2019 introduced the death penalty for aggravated penetrative sexual assault. Mandatory reporting, in-camera trials, and Special Courts were all in the original 2012 Act." },
    { q: "What did the Supreme Court rule in the 'skin-to-skin' POCSO case (2021)?", opts: ["Skin-to-skin contact is required for sexual assault","Sexual intent — not skin contact — is the essential ingredient","Medical evidence is required for conviction","Children must testify in open court"], correct: 1, explain: "The Supreme Court unanimously held that 'physical contact with sexual intent' is the essence of Section 7. Skin-to-skin contact is NOT required. The Bombay HC ruling to the contrary was overruled." },
    { q: "Under which year's amendment to POCSO was possession of child sexual abuse material (CSAM) made a specific criminal offence?", opts: ["2012","2013","2019","2021"], correct: 2, explain: "The amended Section 15, introduced by the POCSO (Amendment) Act, 2019, created the specific offence of possession/storage/transmission of CSAM." },
  ],
  children: [
    { q: "POCSO stands for Protection of Children from — what?", opts: ["School Offences","Sexual Offences","Sports Offences","Silly Offences"], correct: 1, explain: "POCSO stands for Protection of Children from Sexual Offences. It protects every child in India under 18." },
    { q: "If someone touches you in a bad way, whose fault is it?", opts: ["Your fault","The adult's fault — never yours","Both of your faults","Nobody's fault"], correct: 1, explain: "It is ALWAYS the adult's or older person's fault — NEVER the child's. The law is absolutely clear on this." },
    { q: "What is the age of consent under Indian law?", opts: ["16","17","18","21"], correct: 2, explain: "The age of consent in India under POCSO is 18. Any sexual activity involving a person under 18 is illegal regardless of apparent agreement." },
    { q: "Online abuse (sexual messages, asking for photos) is covered under POCSO?", opts: ["No, only physical abuse counts","Yes — Section 11 covers electronic communication","Only if both are in the same city","Only for ages 10 and above"], correct: 1, explain: "Section 11 of POCSO explicitly covers verbal, written, and electronic communication — online abuse is fully criminalised." },
    { q: "The Childline number for children in distress is:", opts: ["100","181","1098","9152987821"], correct: 2, explain: "Childline is 1098. It is free, available 24/7, from any phone in India." },
  ],
  parents: [
    { q: "Under Section 29, who bears the burden of proof in penetrative sexual assault cases?", opts: ["The Child","The Parents","The State (prosecution)","The Accused"], correct: 3, explain: "Section 29 shifts the burden of proof to the accused in penetrative and aggravated assault cases. The accused must prove their innocence." },
    { q: "Can the accused's lawyer directly cross-examine your child in a POCSO trial?", opts: ["Yes, standard procedure","No, questions must go through the Special Court Judge","Yes, but only with your consent","Only if the child is over 16"], correct: 1, explain: "Section 36 prevents the accused's counsel from directly questioning the child. Questions are put through the Judge to protect the child from intimidation." },
    { q: "If you suspect the abuser is a family member, what should you do first?", opts: ["Confront the family member","Tell other family members first","Contact Childline (1098) or police first","Wait and observe further"], correct: 2, explain: "Contact Childline (1098) or police first. Confronting a suspected abuser-family member can endanger the child and destroy evidence." },
    { q: "Can the media publish your child's name or school in a POCSO case?", opts: ["Yes, if the case is concluded","No — identity is permanently protected","Only with your written permission","Only if the child is over 16"], correct: 1, explain: "Section 23 and the Nipun Saxena SC guidelines permanently prohibit disclosure of a POCSO victim's identity at any stage — including after acquittal." },
  ],
  educators: [
    { q: "Under Section 19, you must report abuse to:", opts: ["The School Principal only","The Parents only","The Police or SJPU","The School Board"], correct: 2, explain: "Section 19 mandates reporting to the local police or SJPU. Informing school management does NOT satisfy your legal obligation — you must reach the police." },
    { q: "What is the penalty for failing to report a POCSO offence under Section 21?", opts: ["A written warning","Termination only","Up to 6 months imprisonment and/or fine","Mandatory sensitivity retraining"], correct: 2, explain: "Section 21 makes failure to report a criminal offence punishable by up to 6 months imprisonment and/or fine. For institution heads, the penalty is up to 1 year." },
    { q: "Under Section 42, if you report in good faith and it turns out to be false, can you be sued?", opts: ["Yes, absolutely","No — good faith reporting is protected","Only if the parents sue within 6 months","Yes, by the school"], correct: 1, explain: "Section 42 protects individuals from civil and criminal liability for reporting abuse in good faith, even if it later proves incorrect." },
    { q: "Should a school conduct its own internal investigation before calling the police?", opts: ["Yes, to be absolutely sure first","Yes, if a staff member is accused","No — schools have no authority to investigate POCSO offences","Only if the accused is non-teaching staff"], correct: 2, explain: "Schools must NOT conduct parallel investigations. Doing so can contaminate evidence, tip off the accused, and constitutes illegal interference in a criminal matter." },
  ],
};

// ── PPT GENERATOR ─────────────────────────────────────────────────────────────
async function generatePPT(ageGroupKey, ageGroupLabel) {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE';
  prs.author = 'SecretSharz — POCSO Resource Library';
  prs.subject = `POCSO Handbook — ${ageGroupLabel}`;
  prs.title = `POCSO: Legal & Safety Framework (${ageGroupLabel})`;

  const C = { forest:'1E3D2A', deep:'2D5240', sage:'4A7C59', sageLight:'6FAA80', sand:'F7F3ED', white:'FFFFFF', ink:'1E2820', muted:'7A8A7D', red:'C0392B', sky:'2980B9' };

  // TITLE SLIDE
  const s1 = prs.addSlide();
  s1.background = { color: C.forest };
  s1.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: C.sage } });
  s1.addText('POCSO Act', { x: 0.8, y: 1.4, w: 11.7, h: 1.0, fontFace: 'Georgia', fontSize: 48, bold: true, color: C.white, align: 'center' });
  s1.addText('Protection of Children from Sexual Offences', { x: 0.8, y: 2.6, w: 11.7, h: 0.6, fontFace: 'Calibri', fontSize: 20, color: C.sageLight, align: 'center' });
  s1.addText(`Module: ${ageGroupLabel}`, { x: 0.8, y: 3.4, w: 11.7, h: 0.5, fontFace: 'Georgia', fontSize: 22, color: C.white, align: 'center', italic: true });
  s1.addText('SecretSharz | secretsharz.com', { x: 0.8, y: 6.7, w: 11.7, h: 0.3, fontFace: 'Calibri', fontSize: 11, color: C.muted, align: 'center' });

  const handbook = HANDBOOK[ageGroupKey];
  if (handbook) {
    handbook.sections.forEach((sec, i) => {
      const sl = prs.addSlide();
      sl.background = { color: C.white };
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: C.sage } });
      sl.addText(`Section ${i + 1}`, { x: 0.5, y: 0.3, w: 12, h: 0.3, fontFace: 'Calibri', fontSize: 11, color: C.sage, bold: true });
      sl.addText(sec.title, { x: 0.5, y: 0.7, w: 12, h: 1.0, fontFace: 'Georgia', fontSize: 28, bold: true, color: C.forest });
      sl.addShape(prs.ShapeType.rect, { x: 0.5, y: 1.8, w: 11, h: 0.04, fill: { color: C.sage } });
      sl.addText('See the comprehensive online handbook at secretsharz.com for full section details, interactive exercises, and downloadable resources.', { x: 0.5, y: 2.1, w: 11.5, h: 1.0, fontFace: 'Calibri', fontSize: 15, color: C.muted, align: 'left', wrap: true });
    });
  }

  // HELPLINES SLIDE
  const hs = prs.addSlide();
  hs.background = { color: C.deep };
  hs.addText('Emergency Helplines', { x: 0.6, y: 0.5, w: 12, h: 0.8, fontFace: 'Georgia', fontSize: 32, bold: true, color: C.white });
  const lines = [['Childline India','1098','Free, 24/7'],['Police Emergency','100 / 112','24/7'],['Women Helpline','181','24/7'],['POCSO e-Box','ncpcr.gov.in/pocso','Online'],['iCall (TISS)','9152987821','Mon–Sat 8am–10pm']];
  lines.forEach(([n, num, av], i) => {
    const y = 1.6 + i * 0.9;
    hs.addShape(prs.ShapeType.rect, { x: 0.5, y, w: 12, h: 0.75, fill: { color: 'FFFFFF', transparency: 85 }, line: { color: C.sageLight, width: 1 } });
    hs.addText(n, { x: 0.7, y: y + 0.1, w: 5, h: 0.5, fontFace: 'Calibri', fontSize: 14, color: C.white, bold: true });
    hs.addText(num, { x: 5.8, y: y + 0.08, w: 4, h: 0.55, fontFace: 'Georgia', fontSize: 22, color: C.sageLight, bold: true });
    hs.addText(av, { x: 10, y: y + 0.15, w: 2.5, h: 0.4, fontFace: 'Calibri', fontSize: 11, color: C.muted });
  });

  await prs.writeFile({ fileName: `SecretSharz-POCSO-${ageGroupKey}.pptx` });
}

// ── QUIZ COMPONENT ────────────────────────────────────────────────────────────
function KnowledgeCheck({ ageGroupKey }) {
  const questions = QUIZ[ageGroupKey] || [];
  const [qi, setQi] = useState(0);
  const [selected, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => { setQi(0); setSel(null); setScore(0); setDone(false); };
  const q = questions[qi];
  const answered = selected !== null;

  const handleSelect = (i) => {
    if (answered) return;
    setSel(i);
    if (i === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qi < questions.length - 1) { setQi(i => i + 1); setSel(null); }
    else setDone(true);
  };

  const pct = Math.round((score / questions.length) * 100);
  const msg = pct >= 80 ? "Excellent — you have a strong understanding of the POCSO legal framework." : pct >= 60 ? "Good effort. Review the highlighted sections closely to strengthen your knowledge." : "Please review the handbook sections carefully — this knowledge directly impacts child safety.";

  return (
    <div className="pocso-quiz-wrap no-print">
      <div className="pocso-quiz-header">
        <h3>Knowledge Check</h3>
        <p>Test your understanding of this section's legal and safety content.</p>
      </div>
      <div className="pocso-quiz-body">
        {!done ? (
          <>
            <div className="pocso-quiz-progress">
              <div className="pocso-quiz-progress-fill" style={{ width: `${((qi + 1) / questions.length) * 100}%` }} />
            </div>
            <div className="pocso-quiz-q-num">Question {qi + 1} of {questions.length}</div>
            <div className="pocso-quiz-question" key={qi}>{q.q}</div>
            <div className="pocso-quiz-options">
              {q.opts.map((opt, i) => {
                let cls = 'pocso-quiz-opt';
                let icon = '○';
                if (answered) {
                  if (i === q.correct) { cls += ' correct'; icon = '✓'; }
                  else if (i === selected && i !== q.correct) { cls += ' wrong'; icon = '×'; }
                  else { cls += ' neutral'; icon = ' '; }
                }
                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
                    <span className="pocso-quiz-opt-icon">{icon}</span>{opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <>
                <div className="pocso-quiz-reveal">
                  <strong>{selected === q.correct ? '✅ Correct!' : '❌ Incorrect.'}</strong>
                  {q.explain}
                </div>
                <button className="pocso-quiz-next-btn" onClick={handleNext}>
                  {qi < questions.length - 1 ? 'Next Question →' : 'See My Results →'}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="pocso-quiz-result">
            <h3>Quiz Complete</h3>
            <div className="big-score">{score}/{questions.length}</div>
            <p>{msg}</p>
            <button className="pocso-quiz-retake" onClick={reset}>Retake Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TARGET GROUPS ─────────────────────────────────────────────────────────────
const TARGET_GROUPS = [
  { key: 'history', label: 'Legislative History', sub: 'Origins & Case Law', icon: '📜' },
  { key: 'children', label: 'For Children', sub: 'Rights & Safety', icon: '🛡️', pdf: '/resources/pocso/POCSO Guidelines-flat.pdf' },
  { key: 'parents', label: 'For Parents', sub: 'Recognise & Protect', icon: '👨‍👩‍👧', pdf: '/resources/pocso/POCSO Guidelines-flat.pdf' },
  { key: 'educators', label: 'For Educators', sub: 'Mandates & Policy', icon: '🏫', pdf: '/resources/pocso/POCSO for Teachers A Protective Guide.pdf' },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function POCSORStudents({ navigate, onBack }) {
  const [ageGroup, setAgeGroup] = useState('history');
  const [openSections, setOpen] = useState({});
  const [pptLoading, setPptLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    const all = {};
    const handbook = HANDBOOK[ageGroup];
    if (handbook) {
      handbook.sections.forEach(sec => { all[sec.id] = false; });
      if (handbook.sections.length > 0) all[handbook.sections[0].id] = true;
    }
    setOpen(all);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ageGroup]);

  const toggleSection = useCallback((id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handlePrint = useCallback(() => {
    const handbook = HANDBOOK[ageGroup];
    if (!handbook) return;
    const all = {};
    handbook.sections.forEach(sec => { all[sec.id] = true; });
    setOpen(all);
    setTimeout(() => window.print(), 350);
  }, [ageGroup]);

  const handlePPT = useCallback(async () => {
    setPptLoading(true);
    const group = TARGET_GROUPS.find(g => g.key === ageGroup);
    try { await generatePPT(ageGroup, group?.label || ageGroup); }
    catch (e) { console.error('PPT error:', e); alert('PPT generation failed. Ensure pptxgenjs is installed: npm install pptxgenjs'); }
    finally { setPptLoading(false); }
  }, [ageGroup]);

  const currentGroup = TARGET_GROUPS.find(g => g.key === ageGroup);
  const handbook = HANDBOOK[ageGroup];

  return (
    <div className="pocso-page">

      {/* STICKY TOP BAR */}
      <div className="pocso-topbar">
        <button className="pocso-back-btn" onClick={onBack || (() => navigate && navigate('/resources'))}>
          ← Back to Resources
        </button>
        <div className="pocso-topbar-title">POCSO: Legal & Safety Framework</div>
        <div className="pocso-topbar-actions">
          {currentGroup?.pdf && (
            <a href={currentGroup.pdf} download target="_blank" rel="noreferrer" className="pocso-action-btn pocso-pdf-btn no-print">
              📥 Download PDF
            </a>
          )}
          {ageGroup === 'educators' && (
            <a href="/resources/pocso/POCSO for Teachers A Protective Guide.pdf" target="_blank" rel="noreferrer" className="pocso-action-btn pocso-pdf-btn no-print" style={{marginLeft:'0'}}>
              📋 Teacher PPT/Guide
            </a>
          )}
          <button className="pocso-action-btn pocso-print-btn no-print" onClick={handlePrint}>
            🖨️ Print PDF
          </button>
          <button className="pocso-action-btn pocso-ppt-btn no-print" onClick={handlePPT} disabled={pptLoading}>
            {pptLoading ? 'Generating…' : '📊 Download PPT'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="pocso-hero">
        <div className="pocso-hero-inner">
          <div className="pocso-hero-shield">🛡️</div>
          <div className="pocso-hero-text">
            <h1>POCSO: Complete Legal &amp; Safety Framework</h1>
            <p>A comprehensive resource on the Protection of Children from Sexual Offences Act, 2012 — covering the full legislative history, all legal sections, landmark court cases, the 2019 Amendment, and structured guides for Children, Parents, and Educators across India.</p>
            <div className="pocso-hero-tags">
              <span className="pocso-hero-tag">Legal Framework</span>
              <span className="pocso-hero-tag">Legislative History</span>
              <span className="pocso-hero-tag">Mandatory Reporting</span>
              <span className="pocso-hero-tag">Child Rights</span>
              <span className="pocso-hero-tag">2019 Amendment</span>
              <span className="pocso-hero-tag red">Case Law</span>
            </div>
          </div>
        </div>
        <div className="pocso-legal-note">
          <strong>Legal Disclaimer:</strong> Based on the Protection of Children from Sexual Offences (POCSO) Act, 2012 and POCSO (Amendment) Act, 2019. All case citations are for educational purposes. This resource does not constitute legal advice. For specific case guidance, consult a qualified advocate or contact Childline (1098). If a child is in immediate danger, call 100 or 1098 immediately.
        </div>
      </div>

      {/* DOWNLOAD RESOURCES STRIP */}
      <div className="pocso-resources-strip">
        <div className="pocso-resources-inner">
          <span className="pocso-resources-label">📥 Downloads</span>
          <a href="/resources/pocso/POCSO for Teachers A Protective Guide.pdf" download target="_blank" rel="noreferrer" className="pocso-dl-card">
            <span className="pocso-dl-icon">📋</span>
            <div>
              <div className="pocso-dl-text">Teacher's Protective Guide</div>
              <div className="pocso-dl-sub">PDF · For school staff</div>
            </div>
          </a>
          <a href="/resources/pocso/POCSO Guidelines-flat.pdf" download target="_blank" rel="noreferrer" className="pocso-dl-card">
            <span className="pocso-dl-icon">📄</span>
            <div>
              <div className="pocso-dl-text">Student Guidelines Handout</div>
              <div className="pocso-dl-sub">PDF · Printable flat sheet</div>
            </div>
          </a>
          <a href="https://pocso-ebox.ncpcr.gov.in" target="_blank" rel="noreferrer" className="pocso-dl-card">
            <span className="pocso-dl-icon">🌐</span>
            <div>
              <div className="pocso-dl-text">POCSO e-Box</div>
              <div className="pocso-dl-sub">Online complaint portal · NCPCR</div>
            </div>
          </a>
          <a href="https://www.indiacode.nic.in/handle/123456789/2079" target="_blank" rel="noreferrer" className="pocso-dl-card">
            <span className="pocso-dl-icon">⚖️</span>
            <div>
              <div className="pocso-dl-text">Full Act Text</div>
              <div className="pocso-dl-sub">Official · Legislative.gov.in</div>
            </div>
          </a>
        </div>
      </div>

      {/* TARGET GROUP TABS */}
      <div className="pocso-tabs-wrap">
        <div className="pocso-tabs">
          {TARGET_GROUPS.map(g => (
            <button key={g.key} className={`pocso-tab ${ageGroup === g.key ? 'active' : ''}`} onClick={() => setAgeGroup(g.key)}>
              {g.icon} {g.label}
              <span className="pocso-tab-sub">{g.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      {handbook && (
        <div className="pocso-content" ref={contentRef}>
          <div className="pocso-handbook-intro">
            <div className="pocso-intro-icon">i</div>
            <div className="pocso-intro-text">
              <h3>Module Overview — {currentGroup?.label}</h3>
              <p>{handbook.intro}</p>
            </div>
          </div>

          {ageGroup === 'history' && (
            <div className="pocso-key-box" style={{marginBottom:'28px'}}>
              <h4>Complete POCSO Act — Section Reference</h4>
              <p style={{fontSize:'14px',color:'var(--ink-soft)',lineHeight:'1.7',marginBottom:'12px'}}>Every section of the POCSO Act 2012 (as amended in 2019), its offence category, and punishment:</p>
              <POCSO_ALL_SECTIONS />
            </div>
          )}

          {handbook.sections.map((sec, i) => (
            <div key={sec.id} className={`pocso-section ${openSections[sec.id] ? 'open' : ''}`}>
              <div className="pocso-section-header" onClick={() => toggleSection(sec.id)}>
                <div className="pocso-section-icon">{sec.icon}</div>
                <div className="pocso-section-title-block">
                  <div className="pocso-section-num">Section {i + 1} of {handbook.sections.length}</div>
                  <div className="pocso-section-title">{sec.title}</div>
                </div>
                <div className="pocso-section-chevron">▶</div>
              </div>
              {openSections[sec.id] && (
                <div className="pocso-section-body">{sec.render()}</div>
              )}
            </div>
          ))}

          <KnowledgeCheck ageGroupKey={ageGroup} />

          <div style={{ marginTop: '32px', padding: '20px 24px', background: 'rgba(30,40,32,0.035)', borderRadius: '14px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.75' }} className="no-print">
            <strong style={{ color: 'var(--deep)' }}>Usage Note:</strong> All content is free to distribute for institutional compliance and non-commercial educational use. SecretSharz requests attribution when incorporating these guidelines into official school policies or training programmes. For bespoke training workshops, contact us at secretsharz.com.
          </div>
        </div>
      )}
    </div>
  );
}
