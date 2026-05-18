/**
 * Soft Skills Hub — SecretSharz Resources
 * A comprehensive soft skills training page for students and young professionals
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import pptxgen from 'pptxgenjs';

// ─── STYLES ──────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --obsidian: #0F1117;
    --charcoal: #1A1D27;
    --slate: #252836;
    --warm-cream: #FAF7F2;
    --parchment: #F2EDE4;
    --gold: #D4A843;
    --gold-light: #E8C97A;
    --gold-pale: #FDF5E0;
    --coral: #E8705A;
    --coral-pale: #FDF0EE;
    --teal: #3AAFA9;
    --teal-pale: #E6F7F6;
    --violet: #7C6FA0;
    --violet-pale: #F3F0FA;
    --sage: #5A8A6A;
    --sage-pale: #EBF4EE;
    --sky: #4A90C4;
    --sky-pale: #EAF3FA;
    --ink: #1A1D27;
    --ink-soft: #3D4052;
    --muted: #7A7D8A;
    --border: rgba(26,29,39,0.10);
    --shadow-card: 0 4px 24px rgba(26,29,39,0.08);
    --shadow-hover: 0 12px 40px rgba(26,29,39,0.16);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ss-page {
    min-height: 100vh;
    background: var(--warm-cream);
    font-family: 'Syne', sans-serif;
    padding-bottom: 100px;
  }

  /* ── TOPBAR ── */
  .ss-topbar {
    background: var(--obsidian);
    height: 56px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 300;
    border-bottom: 2px solid var(--gold);
  }
  .ss-back {
    display: flex; align-items: center; gap: 7px;
    color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 600;
    background: none; border: none; cursor: pointer; font-family: inherit; padding: 0;
    transition: color 0.2s;
  }
  .ss-back:hover { color: var(--gold); }
  .ss-topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px; color: white; letter-spacing: 0.3px;
  }
  .ss-topbar-actions { display: flex; gap: 8px; }
  .ss-topbar-btn {
    padding: 7px 16px; border-radius: 50px; font-size: 12px; font-weight: 700;
    cursor: pointer; border: none; font-family: inherit; transition: all 0.2s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
  }
  .ss-topbar-btn.gold { background: var(--gold); color: var(--obsidian); }
  .ss-topbar-btn.gold:hover { background: var(--gold-light); }
  .ss-topbar-btn.ghost { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); }
  .ss-topbar-btn.ghost:hover { background: rgba(255,255,255,0.15); color: white; }

  /* ── HERO ── */
  .ss-hero {
    background: var(--obsidian);
    padding: 80px 48px 100px;
    position: relative;
    overflow: hidden;
    color: white;
  }
  .ss-hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(212,168,67,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(212,168,67,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .ss-hero-glow {
    position: absolute; top: -100px; right: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(212,168,67,0.08), transparent 65%);
    border-radius: 50%; pointer-events: none;
  }
  .ss-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
  .ss-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(212,168,67,0.12); border: 1px solid rgba(212,168,67,0.3);
    color: var(--gold); padding: 6px 16px; border-radius: 50px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px;
    margin-bottom: 24px;
  }
  .ss-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 700; line-height: 1.1;
    margin-bottom: 20px;
  }
  .ss-hero h1 em { font-style: italic; color: var(--gold); }
  .ss-hero-sub {
    font-family: 'Lora', serif;
    font-size: 18px; color: rgba(255,255,255,0.65);
    line-height: 1.75; max-width: 600px; margin-bottom: 40px;
    font-style: italic;
  }
  .ss-hero-stats {
    display: flex; gap: 40px; flex-wrap: wrap;
  }
  .ss-hero-stat { }
  .ss-hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700; color: var(--gold); line-height: 1;
  }
  .ss-hero-stat-label {
    font-size: 12px; color: rgba(255,255,255,0.45);
    font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;
  }

  /* ── NAV TABS ── */
  .ss-nav {
    background: white;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 56px; z-index: 200;
    box-shadow: 0 4px 20px rgba(26,29,39,0.06);
  }
  .ss-nav-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 48px;
    display: flex; overflow-x: auto; scrollbar-width: none;
  }
  .ss-nav-inner::-webkit-scrollbar { display: none; }
  .ss-nav-tab {
    padding: 16px 20px; font-size: 13px; font-weight: 700;
    cursor: pointer; border: none; background: none;
    font-family: inherit; color: var(--muted);
    border-bottom: 3px solid transparent;
    transition: all 0.2s; white-space: nowrap;
    display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
  }
  .ss-nav-tab:hover { color: var(--ink); }
  .ss-nav-tab.active { color: var(--gold); border-bottom-color: var(--gold); }
  .ss-nav-tab-sub { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted); }
  .ss-nav-tab.active .ss-nav-tab-sub { color: var(--gold); }

  /* ── MAIN LAYOUT ── */
  .ss-main { max-width: 1100px; margin: 0 auto; padding: 48px 48px 0; }

  /* ── SECTION HEADERS ── */
  .ss-section-header { margin-bottom: 32px; }
  .ss-section-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2.5px; color: var(--gold); margin-bottom: 6px;
  }
  .ss-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 700; color: var(--ink); line-height: 1.2;
  }
  .ss-section-desc {
    font-family: 'Lora', serif;
    font-size: 15px; color: var(--muted); line-height: 1.7;
    margin-top: 8px; max-width: 620px; font-style: italic;
  }

  /* ── MODULE CARDS ── */
  .ss-modules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px; margin-bottom: 56px;
  }
  .ss-module-card {
    background: white; border-radius: 20px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-card);
    overflow: hidden; transition: all 0.3s;
    display: flex; flex-direction: column;
    cursor: pointer; position: relative;
  }
  .ss-module-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-hover);
  }
  .ss-module-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
  }
  .ss-module-card.gold::before { background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .ss-module-card.coral::before { background: linear-gradient(90deg, var(--coral), #F0A090); }
  .ss-module-card.teal::before { background: linear-gradient(90deg, var(--teal), #6DD5D0); }
  .ss-module-card.violet::before { background: linear-gradient(90deg, var(--violet), #A89DD0); }
  .ss-module-card.sage::before { background: linear-gradient(90deg, var(--sage), #87C097); }
  .ss-module-card.sky::before { background: linear-gradient(90deg, var(--sky), #7AB5DC); }
  .ss-module-header { padding: 28px 28px 16px; }
  .ss-module-icon { font-size: 40px; margin-bottom: 14px; }
  .ss-module-tag {
    display: inline-block; padding: 3px 10px; border-radius: 50px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 10px;
  }
  .ss-module-tag.gold { background: var(--gold-pale); color: #8A6A00; }
  .ss-module-tag.coral { background: var(--coral-pale); color: #A04030; }
  .ss-module-tag.teal { background: var(--teal-pale); color: #1A7A78; }
  .ss-module-tag.violet { background: var(--violet-pale); color: #5A4A80; }
  .ss-module-tag.sage { background: var(--sage-pale); color: #2D5A40; }
  .ss-module-tag.sky { background: var(--sky-pale); color: #2A608A; }
  .ss-module-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700; color: var(--ink);
    margin-bottom: 8px; line-height: 1.3;
  }
  .ss-module-desc {
    font-size: 14px; color: var(--muted); line-height: 1.65;
  }
  .ss-module-footer {
    padding: 16px 28px 24px;
    border-top: 1px solid var(--border);
    margin-top: auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .ss-module-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .ss-module-badge {
    padding: 3px 10px; border-radius: 50px;
    font-size: 10px; font-weight: 700;
    background: var(--parchment); color: var(--muted);
  }
  .ss-module-badge.time { background: #EAF3FA; color: var(--sky); }
  .ss-module-actions { display: flex; gap: 8px; }
  .ss-btn {
    padding: 9px 18px; border-radius: 50px;
    font-size: 12px; font-weight: 700; cursor: pointer; border: none;
    transition: all 0.2s; text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    font-family: inherit;
  }
  .ss-btn-gold { background: var(--gold); color: var(--obsidian); }
  .ss-btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
  .ss-btn-ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--border); }
  .ss-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

  /* ── MODULE DETAIL PANEL ── */
  .ss-detail-overlay {
    position: fixed; inset: 0;
    background: rgba(15,17,23,0.75); backdrop-filter: blur(6px);
    z-index: 1000; display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: ssFadeIn 0.25s ease;
  }
  .ss-detail-panel {
    background: var(--warm-cream); border-radius: 24px;
    width: 100%; max-width: 820px; max-height: 90vh;
    overflow-y: auto; position: relative;
    box-shadow: 0 32px 64px rgba(0,0,0,0.3);
    animation: ssSlideUp 0.3s ease;
  }
  .ss-detail-header {
    padding: 36px 40px 28px;
    background: var(--obsidian); color: white; border-radius: 24px 24px 0 0;
    position: sticky; top: 0; z-index: 10;
    display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;
  }
  .ss-detail-close {
    background: rgba(255,255,255,0.1); border: none;
    width: 36px; height: 36px; border-radius: 50%;
    color: white; font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s; flex-shrink: 0;
  }
  .ss-detail-close:hover { background: rgba(255,255,255,0.2); }
  .ss-detail-body { padding: 36px 40px; }

  /* ── CONTENT ATOMS ── */
  .ss-body-text { font-size: 15px; color: var(--ink-soft); line-height: 1.85; margin: 14px 0; font-family: 'Lora', serif; }
  .ss-h3 { font-family: 'Playfair Display', serif; font-size: 21px; color: var(--ink); margin: 24px 0 10px; }
  .ss-h4 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--ink); margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }

  .ss-gold-box {
    background: var(--gold-pale); border-radius: 14px; padding: 20px 24px;
    margin: 16px 0; border-left: 4px solid var(--gold);
  }
  .ss-gold-box h4 { font-family: 'Playfair Display', serif; font-size: 16px; color: #7A5800; margin: 0 0 10px; }
  .ss-gold-box p, .ss-gold-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; font-family: 'Lora', serif; }
  .ss-gold-box ul, .ss-gold-box ol { padding-left: 18px; margin: 8px 0 0; }
  .ss-gold-box li { margin-bottom: 6px; }

  .ss-dark-box {
    background: var(--obsidian); border-radius: 14px; padding: 20px 24px; margin: 16px 0;
  }
  .ss-dark-box h4 { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--gold); margin: 0 0 10px; }
  .ss-dark-box p, .ss-dark-box li { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.75; }
  .ss-dark-box ul { padding-left: 18px; margin: 8px 0 0; }
  .ss-dark-box li { margin-bottom: 6px; }

  .ss-info-box {
    background: var(--teal-pale); border-radius: 14px; padding: 20px 24px;
    margin: 16px 0; border-left: 4px solid var(--teal);
  }
  .ss-info-box h4 { font-family: 'Playfair Display', serif; font-size: 16px; color: #1A7A78; margin: 0 0 10px; }
  .ss-info-box p, .ss-info-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
  .ss-info-box ul { padding-left: 18px; margin: 8px 0 0; }
  .ss-info-box li { margin-bottom: 6px; }

  .ss-warn-box {
    background: var(--coral-pale); border-radius: 14px; padding: 20px 24px;
    margin: 16px 0; border-left: 4px solid var(--coral);
  }
  .ss-warn-box h4 { font-family: 'Playfair Display', serif; font-size: 16px; color: #A04030; margin: 0 0 10px; }
  .ss-warn-box p, .ss-warn-box li { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
  .ss-warn-box ul { padding-left: 18px; margin: 8px 0 0; }

  /* ── TWO-COL ── */
  .ss-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0; }
  .ss-col { border-radius: 14px; padding: 18px; }
  .ss-col.green { background: #D1FAE5; }
  .ss-col.red { background: #FEE2E2; }
  .ss-col.gold { background: var(--gold-pale); }
  .ss-col.blue { background: var(--sky-pale); }
  .ss-col-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .ss-col.green .ss-col-title { color: #065F46; }
  .ss-col.red .ss-col-title { color: #991B1B; }
  .ss-col.gold .ss-col-title { color: #7A5800; }
  .ss-col.blue .ss-col-title { color: #2A608A; }
  .ss-col-list { list-style: none; padding: 0; }
  .ss-col-list li { font-size: 13px; color: #1F2937; padding: 5px 0; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; gap: 7px; line-height: 1.55; }
  .ss-col-list li:last-child { border-bottom: none; }

  /* ── STEPS ── */
  .ss-steps { counter-reset: step; list-style: none; padding: 0; margin: 14px 0; }
  .ss-steps li { counter-increment: step; display: flex; gap: 14px; align-items: flex-start; padding: 14px 16px; border-radius: 12px; margin-bottom: 10px; background: white; border: 1px solid var(--border); font-size: 14px; color: var(--ink-soft); line-height: 1.65; }
  .ss-steps li::before { content: counter(step); width: 28px; height: 28px; border-radius: 50%; background: var(--gold); color: var(--obsidian); font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }

  /* ── WORKSHEET ── */
  .ss-worksheet {
    background: white; border-radius: 18px;
    border: 2px dashed var(--gold);
    padding: 28px 32px; margin: 20px 0;
  }
  .ss-worksheet-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px; padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
  }
  .ss-worksheet-icon { font-size: 28px; }
  .ss-worksheet-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink); }
  .ss-worksheet-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .ss-ws-field { margin-bottom: 20px; }
  .ss-ws-label { font-size: 12px; font-weight: 700; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .ss-ws-line { width: 100%; height: 1px; background: transparent; border: none; border-bottom: 1.5px solid rgba(26,29,39,0.2); margin-bottom: 8px; }
  .ss-ws-box { min-height: 60px; border: 1.5px dashed rgba(26,29,39,0.2); border-radius: 8px; padding: 10px; width: 100%; resize: none; font-family: 'Lora', serif; font-size: 14px; color: var(--ink); outline: none; transition: border-color 0.2s; background: var(--parchment); }
  .ss-ws-box:focus { border-color: var(--gold); }
  .ss-ws-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ss-ws-rating { display: flex; gap: 6px; margin-top: 4px; }
  .ss-ws-rating-btn { width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--border); background: white; cursor: pointer; font-size: 13px; font-weight: 700; color: var(--muted); transition: all 0.2s; font-family: inherit; display: flex; align-items: center; justify-content: center; }
  .ss-ws-rating-btn.selected { background: var(--gold); border-color: var(--gold); color: var(--obsidian); }
  .ss-ws-rating-btn:hover { border-color: var(--gold); }

  /* ── ACTIVITY TABS within module ── */
  .ss-module-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 24px; overflow-x: auto; }
  .ss-module-tab { padding: 12px 18px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: none; font-family: inherit; color: var(--muted); border-bottom: 2.5px solid transparent; transition: all 0.2s; white-space: nowrap; }
  .ss-module-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* ── SCENARIO CARDS ── */
  .ss-scenario { background: var(--parchment); border-radius: 14px; padding: 20px; margin-bottom: 12px; border: 1px solid var(--border); transition: all 0.2s; cursor: pointer; }
  .ss-scenario:hover { border-color: var(--gold); background: var(--gold-pale); }
  .ss-scenario-num { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--gold); margin-bottom: 6px; }
  .ss-scenario-text { font-size: 14px; color: var(--ink-soft); line-height: 1.65; font-family: 'Lora', serif; font-style: italic; }
  .ss-scenario-prompt { font-size: 13px; font-weight: 700; color: var(--ink); margin-top: 10px; }

  /* ── REFLECTION QUIZ ── */
  .ss-quiz { background: white; border-radius: 20px; border: 1px solid var(--border); margin-top: 40px; overflow: hidden; box-shadow: var(--shadow-card); }
  .ss-quiz-header { background: linear-gradient(135deg, var(--obsidian), var(--charcoal)); padding: 26px 30px; color: white; }
  .ss-quiz-header h3 { font-family: 'Playfair Display', serif; font-size: 22px; margin: 0 0 4px; }
  .ss-quiz-header p { font-size: 13px; color: rgba(255,255,255,0.6); margin: 0; }
  .ss-quiz-body { padding: 28px 30px; }
  .ss-quiz-progress { height: 4px; background: rgba(26,29,39,0.08); border-radius: 2px; margin-bottom: 24px; overflow: hidden; }
  .ss-quiz-bar { height: 100%; background: var(--gold); border-radius: 2px; transition: width 0.4s ease; }
  .ss-quiz-q { font-family: 'Playfair Display', serif; font-size: 19px; color: var(--ink); margin-bottom: 20px; line-height: 1.4; animation: ssFadeIn 0.3s ease; }
  .ss-quiz-opts { display: flex; flex-direction: column; gap: 10px; }
  .ss-quiz-opt { padding: 14px 18px; border: 2px solid var(--border); border-radius: 12px; background: white; font-size: 14px; font-weight: 600; color: var(--ink-soft); cursor: pointer; text-align: left; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
  .ss-quiz-opt:hover:not(:disabled) { border-color: var(--gold); background: var(--gold-pale); color: var(--ink); }
  .ss-quiz-opt.correct { border-color: #27AE60; background: #D5F5E3; color: #1E8449; }
  .ss-quiz-opt.wrong { border-color: var(--coral); background: #FADBD8; color: #922B21; }
  .ss-quiz-opt.neutral { border-color: #27AE60; background: #D5F5E3; color: #1E8449; opacity: 0.5; }
  .ss-quiz-reveal { background: var(--gold-pale); border-radius: 12px; padding: 16px 20px; margin-top: 14px; border-left: 4px solid var(--gold); font-size: 14px; color: var(--ink); line-height: 1.75; animation: ssFadeIn 0.3s ease; }
  .ss-quiz-reveal strong { display: block; margin-bottom: 4px; font-family: 'Playfair Display', serif; font-size: 17px; }
  .ss-quiz-next { margin-top: 16px; padding: 12px 28px; background: var(--gold); color: var(--obsidian); border: none; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .ss-quiz-next:hover { background: var(--gold-light); }
  .ss-quiz-result { text-align: center; padding: 20px 0; animation: ssFadeIn 0.4s ease; }
  .ss-quiz-result h3 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--ink); margin-bottom: 6px; }
  .ss-quiz-score { font-family: 'Playfair Display', serif; font-size: 64px; font-weight: 700; color: var(--gold); line-height: 1; }
  .ss-quiz-retake { background: white; border: 2px solid var(--gold); color: var(--gold); padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; margin-top: 16px; }
  .ss-quiz-retake:hover { background: var(--gold); color: var(--obsidian); }

  /* ── RESOURCE DOWNLOADS ── */
  .ss-downloads-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; margin-bottom: 48px; }
  .ss-dl-card {
    background: white; border-radius: 16px; padding: 24px;
    border: 1px solid var(--border); transition: all 0.25s;
    display: flex; flex-direction: column; gap: 12px;
    box-shadow: var(--shadow-card);
  }
  .ss-dl-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--gold); }
  .ss-dl-icon-wrap {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
  }
  .ss-dl-title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--ink); line-height: 1.3; }
  .ss-dl-desc { font-size: 13px; color: var(--muted); line-height: 1.55; font-family: 'Lora', serif; flex: 1; }
  .ss-dl-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .ss-dl-tag { padding: 3px 10px; border-radius: 50px; font-size: 10px; font-weight: 700; background: var(--parchment); color: var(--muted); }
  .ss-dl-actions { display: flex; gap: 8px; margin-top: 4px; }

  /* ── FACILITATOR GUIDE ── */
  .ss-facilitator-section { background: var(--obsidian); border-radius: 24px; padding: 40px; margin: 48px 0; color: white; position: relative; overflow: hidden; }
  .ss-facilitator-section::before { content: ''; position: absolute; top: -80px; right: -60px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,168,67,0.08), transparent 65%); border-radius: 50%; }
  .ss-facilitator-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-top: 28px; }
  .ss-facilitator-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px; }
  .ss-facilitator-card h4 { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--gold); margin: 0 0 10px; }
  .ss-facilitator-card p { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.65; }

  /* ── FRAMEWORK VISUAL ── */
  .ss-framework { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; }
  .ss-framework-item { background: white; border-radius: 14px; padding: 20px; border: 1px solid var(--border); text-align: center; transition: all 0.2s; }
  .ss-framework-item:hover { border-color: var(--gold); box-shadow: var(--shadow-card); }
  .ss-framework-num { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
  .ss-framework-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .ss-framework-desc { font-size: 12px; color: var(--muted); line-height: 1.55; font-family: 'Lora', serif; }

  /* ── SELF-ASSESSMENT ── */
  .ss-assessment { background: white; border-radius: 20px; padding: 32px; border: 1px solid var(--border); margin: 24px 0; box-shadow: var(--shadow-card); }
  .ss-assessment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 20px; }
  .ss-skill-item { background: var(--parchment); border-radius: 12px; padding: 16px; }
  .ss-skill-name { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 12px; }
  .ss-skill-bar-bg { height: 8px; background: rgba(26,29,39,0.1); border-radius: 4px; overflow: hidden; }
  .ss-skill-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .ss-skill-levels { display: flex; gap: 6px; margin-top: 10px; }
  .ss-skill-level-btn { flex: 1; padding: 5px 0; border-radius: 6px; border: 1.5px solid var(--border); background: white; font-size: 10px; font-weight: 700; cursor: pointer; font-family: inherit; color: var(--muted); transition: all 0.2s; text-align: center; }
  .ss-skill-level-btn.sel { background: var(--gold); border-color: var(--gold); color: var(--obsidian); }

  /* ── ANIMATIONS ── */
  @keyframes ssFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ssSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  /* ── TOAST ── */
  .ss-toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--obsidian); color: white; padding: 14px 24px; border-radius: 50px; font-weight: 700; font-size: 13px; z-index: 9999; opacity: 0; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); border: 1px solid var(--gold); display: flex; align-items: center; gap: 10px; white-space: nowrap; }
  .ss-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

  /* ── PRINT ── */
  @media print {
    .ss-topbar, .ss-nav, .ss-topbar-btn, .no-print { display: none !important; }
    .ss-page { background: white; padding: 0; }
    .ss-hero { background: #1A1D27 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .ss-module-card, .ss-dl-card { break-inside: avoid; box-shadow: none; }
    .ss-main { padding: 20px; }
  }

  @media(max-width: 768px) {
    .ss-hero { padding: 56px 24px 72px; }
    .ss-main { padding: 32px 20px 0; }
    .ss-nav-inner { padding: 0 16px; }
    .ss-modules-grid { grid-template-columns: 1fr; }
    .ss-two-col { grid-template-columns: 1fr; }
    .ss-ws-grid { grid-template-columns: 1fr; }
    .ss-topbar { padding: 0 16px; }
    .ss-topbar-title { display: none; }
    .ss-detail-header, .ss-detail-body { padding: 24px; }
    .ss-facilitator-grid { grid-template-columns: 1fr; }
    .ss-downloads-grid { grid-template-columns: 1fr; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: 'communication',
    color: 'gold',
    icon: '🗣️',
    title: 'Effective Communication',
    tag: 'Foundation Skill',
    tagColor: 'gold',
    desc: 'Master verbal, non-verbal, and written communication. Build clarity, confidence, and connection in every conversation.',
    duration: '90 min',
    activity: 'Role-play',
    level: 'Foundation',
    outcomes: ['Understand 7-38-55 communication model', 'Practice active listening techniques', 'Deliver clear and concise messages', 'Navigate difficult conversations'],
  },
  {
    id: 'emotional',
    color: 'coral',
    icon: '💛',
    title: 'Emotional Intelligence',
    tag: 'Core Skill',
    tagColor: 'coral',
    desc: 'Develop self-awareness, empathy, and emotional regulation. Learn to read the room and lead with compassion.',
    duration: '120 min',
    activity: 'Self-assessment',
    level: 'Intermediate',
    outcomes: ['Identify your EQ profile using Goleman\'s model', 'Practice emotional regulation techniques', 'Build empathy in relationships', 'Apply EQ in conflict scenarios'],
  },
  {
    id: 'leadership',
    color: 'teal',
    icon: '🧭',
    title: 'Leadership & Influence',
    tag: 'Advanced Skill',
    tagColor: 'teal',
    desc: 'Discover your leadership style, build trust, and inspire others. Move from managing to genuinely leading.',
    duration: '120 min',
    activity: 'Case study',
    level: 'Advanced',
    outcomes: ['Map your leadership style (situational model)', 'Practice motivational communication', 'Understand power vs. influence', 'Build psychological safety in teams'],
  },
  {
    id: 'conflict',
    color: 'violet',
    icon: '🤝',
    title: 'Conflict Resolution',
    tag: 'Applied Skill',
    tagColor: 'violet',
    desc: 'Transform conflict from threat to opportunity. Learn negotiation, mediation, and win-win problem solving.',
    duration: '90 min',
    activity: 'Simulation',
    level: 'Intermediate',
    outcomes: ['Identify conflict styles (Thomas-Kilmann)', 'Use the 5-step conflict resolution model', 'Practice interest-based negotiation', 'De-escalate charged conversations'],
  },
  {
    id: 'teamwork',
    color: 'sage',
    icon: '⚙️',
    title: 'Teamwork & Collaboration',
    tag: 'Foundation Skill',
    tagColor: 'sage',
    desc: 'Build trust, define roles, and create psychological safety. High-performing teams are built, not born.',
    duration: '90 min',
    activity: 'Group activity',
    level: 'Foundation',
    outcomes: ['Understand Tuckman\'s stages of team development', 'Recognise your team role (Belbin)', 'Build psychological safety', 'Give and receive feedback effectively'],
  },
  {
    id: 'critical',
    color: 'sky',
    icon: '🔍',
    title: 'Critical Thinking & Problem Solving',
    tag: 'Cognitive Skill',
    tagColor: 'sky',
    desc: 'Think clearly under pressure. Move from reactive to strategic with structured problem-solving frameworks.',
    duration: '90 min',
    activity: 'Case study',
    level: 'Intermediate',
    outcomes: ['Apply Design Thinking principles', 'Use the 5 Whys root cause analysis', 'Overcome cognitive biases', 'Make decisions under uncertainty'],
  },
  {
    id: 'resilience',
    color: 'gold',
    icon: '🌱',
    title: 'Resilience & Stress Management',
    tag: 'Wellbeing Skill',
    tagColor: 'gold',
    desc: 'Build psychological resilience, manage pressure, and recover from setbacks with a stronger mindset.',
    duration: '90 min',
    activity: 'Reflection',
    level: 'Foundation',
    outcomes: ['Understand the stress-performance curve', 'Build a personal resilience toolkit', 'Practice evidence-based stress regulation', 'Develop a growth mindset'],
  },
  {
    id: 'presentation',
    color: 'coral',
    icon: '🎤',
    title: 'Presentation & Public Speaking',
    tag: 'Applied Skill',
    tagColor: 'coral',
    desc: 'Command any room with structure, stories, and presence. Turn anxiety into authentic, compelling communication.',
    duration: '120 min',
    activity: 'Live practice',
    level: 'Intermediate',
    outcomes: ['Structure presentations using Monroe\'s Sequence', 'Use the STAR method for storytelling', 'Manage presentation anxiety', 'Master vocal variety and body language'],
  },
  {
    id: 'time',
    color: 'teal',
    icon: '⏱️',
    title: 'Time Management & Productivity',
    tag: 'Foundation Skill',
    tagColor: 'teal',
    desc: 'Stop managing time and start managing energy. Build systems that make focus and output inevitable.',
    duration: '75 min',
    activity: 'Worksheet',
    level: 'Foundation',
    outcomes: ['Audit your time using time-tracking', 'Apply the Eisenhower Matrix', 'Build a personal productivity system', 'Overcome procrastination using psychology'],
  },
  {
    id: 'networking',
    color: 'violet',
    icon: '🌐',
    title: 'Networking & Relationship Building',
    tag: 'Applied Skill',
    tagColor: 'violet',
    desc: 'Build genuine, mutually valuable connections. Learn the art of authentic networking that doesn\'t feel transactional.',
    duration: '75 min',
    activity: 'Practice',
    level: 'Intermediate',
    outcomes: ['Understand give-first networking', 'Craft a compelling personal introduction', 'Maintain relationships over time', 'Navigate professional social situations'],
  },
  {
    id: 'adaptability',
    color: 'sage',
    icon: '🔄',
    title: 'Adaptability & Change Management',
    tag: 'Advanced Skill',
    tagColor: 'sage',
    desc: 'Thrive in ambiguity. Learn to navigate change, pivot gracefully, and lead others through uncertainty.',
    duration: '90 min',
    activity: 'Scenario analysis',
    level: 'Advanced',
    outcomes: ['Understand Kübler-Ross change curve', 'Build a flexible mindset', 'Lead others through transitions', 'Develop comfort with ambiguity'],
  },
  {
    id: 'mindfulness',
    color: 'sky',
    icon: '🧘',
    title: 'Mindfulness at Work',
    tag: 'Wellbeing Skill',
    tagColor: 'sky',
    desc: 'Bring focused attention, clarity, and compassion to your work and relationships. Presence is a professional skill.',
    duration: '60 min',
    activity: 'Practice',
    level: 'Foundation',
    outcomes: ['Understand the neuroscience of attention', 'Practice workplace mindfulness techniques', 'Reduce reactivity in pressure situations', 'Build a sustainable focus practice'],
  },
];

// ─── DETAILED MODULE CONTENT ──────────────────────────────────────────────────
const MODULE_CONTENT = {
  communication: {
    overview: "Communication is the foundation of every professional relationship. Research shows that 70% of workplace problems stem from poor communication. This module builds both the theory and practice you need to communicate with clarity, confidence, and impact.",
    framework: [
      { num: '7%', title: 'Words', desc: 'The actual content of what you say' },
      { num: '38%', title: 'Tone', desc: 'How you sound — pace, pitch, volume' },
      { num: '55%', title: 'Body', desc: 'Non-verbal cues and physical presence' },
      { num: '5', title: 'Active Listening', desc: 'Levels from ignoring to empathic listening' },
    ],
    keyLearnings: [
      "The Ladder of Inference — why we jump to conclusions and how to stop",
      "Non-violent communication (NVC): Observations, Feelings, Needs, Requests",
      "The PREP method for structuring any spoken response",
      "Active listening: paraphrasing, clarifying, summarising without interrupting",
      "Delivering feedback using the SBI model (Situation-Behaviour-Impact)",
      "Digital communication: email, WhatsApp, and tone management",
    ],
    scenarios: [
      { text: "Your classmate interrupts you every time you speak in group discussions. You need to address it without creating conflict.", prompt: "How do you communicate your boundary clearly but without hostility?" },
      { text: "You have to deliver bad news to your team — a project deadline has moved earlier and the plan must change.", prompt: "How do you frame this message to minimise panic and maintain trust?" },
      { text: "During a meeting, your idea is dismissed without being heard fully. You feel frustrated.", prompt: "What do you say and how do you say it?" },
    ],
    worksheet: {
      title: 'Active Listening Self-Audit',
      fields: [
        { label: 'In conversations today, what were you doing while the other person was speaking?', type: 'textarea' },
        { label: 'One habit that stops you from listening fully:', type: 'textarea' },
        { label: 'Rate your current listening level (1 = distracted, 5 = fully present)', type: 'rating', max: 5 },
        { label: 'One specific thing you will change in your next conversation:', type: 'textarea' },
      ],
    },
    quiz: [
      { q: "According to Mehrabian's research, what percentage of communication impact comes from the actual words spoken?", opts: ["55%","38%","7%","15%"], correct: 2, explain: "Only 7% of communication impact comes from words themselves. 38% comes from vocal tone and 55% from body language. This is why 'how you say it' matters more than 'what you say.'" },
      { q: "In Non-Violent Communication (NVC), what are the four components in order?", opts: ["Feelings, Needs, Requests, Actions","Observations, Feelings, Needs, Requests","Facts, Opinions, Feelings, Solutions","Situation, Behaviour, Impact, Next steps"], correct: 1, explain: "The NVC model (Marshall Rosenberg) follows: Observations (what you objectively see), Feelings (your emotional response), Needs (the underlying need), and Requests (a specific, actionable ask)." },
      { q: "The 'Ladder of Inference' describes:", opts: ["A promotion pathway","How we move from facts to assumptions to actions","The hierarchy of communication needs","Levels of assertiveness"], correct: 1, explain: "The Ladder of Inference (Argyris) shows how we select data, add meaning, make assumptions, draw conclusions, and act — often without realising we've climbed several rungs from reality." },
    ],
  },
  emotional: {
    overview: "Emotional Intelligence (EQ) predicts career success more accurately than IQ in most professional roles. Studies show EQ accounts for 58% of performance across all job types (TalentSmart). This module gives you the tools to understand, manage, and leverage emotions at work.",
    framework: [
      { num: '1', title: 'Self-Awareness', desc: 'Knowing your emotions in real time' },
      { num: '2', title: 'Self-Regulation', desc: 'Managing your emotional responses' },
      { num: '3', title: 'Motivation', desc: 'Internal drive beyond external reward' },
      { num: '4', title: 'Empathy', desc: 'Understanding others\' emotional states' },
      { num: '5', title: 'Social Skills', desc: 'Managing relationships effectively' },
    ],
    keyLearnings: [
      "Goleman's Five Domains of Emotional Intelligence",
      "The amygdala hijack — why we 'lose it' and how to recover faster",
      "The HALT check: Hungry, Angry, Lonely, Tired — and decision-making",
      "Empathy vs sympathy: what survivors and colleagues actually need",
      "Building your personal EQ development plan",
      "EQ in conflict: staying regulated when others aren't",
    ],
    scenarios: [
      { text: "A colleague publicly criticises your work in a team meeting. You feel humiliated and angry.", prompt: "What is your first response? What should it be?" },
      { text: "A friend comes to you visibly upset. They say 'I just need someone to listen, not advice.'", prompt: "How does empathic listening differ from sympathy? What do you actually say?" },
      { text: "You're about to enter a high-stakes presentation and your anxiety is spiking.", prompt: "What EQ techniques can you apply in the next 3 minutes?" },
    ],
    worksheet: {
      title: 'My EQ Profile',
      fields: [
        { label: 'My strongest emotional intelligence domain:', type: 'textarea' },
        { label: 'My biggest EQ growth area this month:', type: 'textarea' },
        { label: 'The emotion I find hardest to regulate:', type: 'textarea' },
        { label: 'Rate your current EQ across Goleman\'s five domains (1–5 each)', type: 'rating', max: 5 },
        { label: 'One specific EQ practice I will commit to this week:', type: 'textarea' },
      ],
    },
    quiz: [
      { q: "According to Daniel Goleman, which component of EQ is considered the foundation that all others build upon?", opts: ["Empathy","Social Skills","Self-Awareness","Motivation"], correct: 2, explain: "Self-awareness is the cornerstone of Goleman's EQ model. You cannot regulate what you cannot first recognise. Without accurate self-perception, the other four domains are severely limited." },
      { q: "An 'amygdala hijack' occurs when:", opts: ["You feel extremely happy","The rational brain overrides emotions","The emotional brain overrides the thinking brain","You enter a flow state"], correct: 2, explain: "The amygdala hijack (Goleman, 1995) occurs when the amygdala triggers a fight-flight-freeze response, temporarily bypassing the prefrontal cortex — our rational decision-making centre. Recovery takes 20–90 minutes." },
      { q: "The HALT check is used to:", opts: ["Pause before making a decision to check if you are Hungry, Angry, Lonely, or Tired","A crisis de-escalation technique","A checklist for presentations","A mindfulness breathing technique"], correct: 0, explain: "HALT is a self-check tool. Making important decisions or having difficult conversations while Hungry, Angry, Lonely, or Tired significantly increases the risk of poor emotional regulation." },
    ],
  },
  leadership: {
    overview: "Leadership isn't a title — it's a choice you make every day. This module explores multiple leadership frameworks, helps you identify your natural style, and gives you practical tools to influence, inspire, and build trust across any team.",
    framework: [
      { num: 'S1', title: 'Directing', desc: 'High task, low relationship (new team)' },
      { num: 'S2', title: 'Coaching', desc: 'High task, high relationship (developing)' },
      { num: 'S3', title: 'Supporting', desc: 'Low task, high relationship (capable)' },
      { num: 'S4', title: 'Delegating', desc: 'Low task, low relationship (expert)' },
    ],
    keyLearnings: [
      "Hersey & Blanchard's Situational Leadership Model",
      "Transactional vs Transformational leadership",
      "Building trust: The BRAVING framework (Brené Brown)",
      "Psychological safety: Amy Edmondson's research and why it matters",
      "The leader as coach: asking vs telling",
      "Power, authority, and influence — and when to use each",
    ],
    scenarios: [
      { text: "A new team member is highly motivated but makes repeated mistakes in their work. They need direction but are resistant to correction.", prompt: "Which leadership style should you use? How do you balance correction with encouragement?" },
      { text: "Your team is experiencing low morale after a project failure. As the leader, you need to restore confidence.", prompt: "What do you say and do in your first team meeting after the failure?" },
      { text: "A high-performer on your team tells you they're planning to leave. They feel unchallenged.", prompt: "How does a good leader respond? What could have been done differently?" },
    ],
    worksheet: {
      title: 'My Leadership Style Audit',
      fields: [
        { label: 'My natural leadership style tends to be (Directing/Coaching/Supporting/Delegating):', type: 'textarea' },
        { label: 'A situation where I led well — what I did:', type: 'textarea' },
        { label: 'A situation where I could have led better — what I would do differently:', type: 'textarea' },
        { label: 'One person I want to develop and my plan to support them:', type: 'textarea' },
      ],
    },
    quiz: [
      { q: "In Situational Leadership, the appropriate style for a team member who is highly competent but low in confidence is:", opts: ["S1 Directing","S2 Coaching","S3 Supporting","S4 Delegating"], correct: 2, explain: "S3 Supporting is the right approach for a person with high competence but variable motivation/confidence. The leader reduces task direction and focuses on emotional support and encouragement." },
      { q: "Psychological Safety in a team means:", opts: ["Everyone feels happy all the time","Team members feel safe to speak up, take risks, and admit mistakes without fear of punishment","The workplace is physically safe","There are no conflicts in the team"], correct: 1, explain: "Amy Edmondson's research defines psychological safety as the shared belief that the team is safe for interpersonal risk-taking. It is the single strongest predictor of team performance at Google (Project Aristotle)." },
      { q: "Transformational leadership differs from transactional leadership because it:", opts: ["Focuses on rewards and punishments","Inspires through vision, values, and intrinsic motivation","Is more effective in crisis situations only","Delegates all decision-making"], correct: 1, explain: "Transformational leaders inspire by articulating a compelling vision, appealing to followers' values and identity, and fostering intrinsic motivation. Transactional leaders focus on exchange — reward for compliance." },
    ],
  },
  conflict: {
    overview: "Conflict is inevitable in every team, relationship, and workplace. The question isn't whether conflict will happen — it's whether you have the skills to navigate it productively. This module transforms conflict from a threat into a tool for clarity and growth.",
    framework: [
      { num: 'C1', title: 'Competing', desc: 'High assertiveness, low cooperation' },
      { num: 'C2', title: 'Collaborating', desc: 'High assertiveness, high cooperation' },
      { num: 'C3', title: 'Compromising', desc: 'Medium on both dimensions' },
      { num: 'C4', title: 'Avoiding', desc: 'Low assertiveness, low cooperation' },
      { num: 'C5', title: 'Accommodating', desc: 'Low assertiveness, high cooperation' },
    ],
    keyLearnings: [
      "Thomas-Kilmann Conflict Mode Instrument (TKI) — your conflict style profile",
      "Positions vs Interests: the heart of principled negotiation (Fisher & Ury)",
      "The BATNA (Best Alternative To a Negotiated Agreement) concept",
      "De-escalation language: what to say when emotions are high",
      "Moving from adversarial to collaborative problem-solving",
      "When to involve a mediator and how mediation works",
    ],
    scenarios: [
      { text: "Two team members are in an ongoing conflict that's affecting group productivity. Both approach you (as a peer) for support.", prompt: "How do you help without taking sides? What's your facilitation role?" },
      { text: "You disagree strongly with a decision made by someone senior to you. You believe it will lead to failure.", prompt: "How do you raise this respectfully and effectively?" },
      { text: "A friend owes you money and keeps avoiding the subject. You need the money but don't want to damage the relationship.", prompt: "How do you approach this conversation using interest-based thinking?" },
    ],
    worksheet: {
      title: 'Conflict Style Self-Assessment',
      fields: [
        { label: 'My dominant conflict style (TKI):', type: 'textarea' },
        { label: 'A recent conflict I handled well — what I did:', type: 'textarea' },
        { label: 'A recent conflict I regret — what I would do differently:', type: 'textarea' },
        { label: 'The positions in a current conflict vs. the underlying interests:', type: 'textarea' },
      ],
    },
    quiz: [
      { q: "In the Thomas-Kilmann model, which conflict style is considered most effective for important, complex issues?", opts: ["Competing","Avoiding","Collaborating","Accommodating"], correct: 2, explain: "Collaborating (win-win) is the most effective style for important, complex issues where both relationship and outcome matter. It requires time and trust but produces sustainable, high-quality solutions." },
      { q: "The concept of 'BATNA' in negotiation stands for:", opts: ["Best Agreement Toward Neutral Action","Best Alternative To a Negotiated Agreement","Balanced Approach To Negotiation Advantages","Build Agreement Through Negotiated Actions"], correct: 1, explain: "BATNA (Fisher & Ury, Getting to Yes) is your Best Alternative To a Negotiated Agreement — what you will do if no deal is reached. Knowing your BATNA prevents accepting bad deals and strengthens your negotiating position." },
      { q: "Interest-based negotiation focuses on:", opts: ["What each party demands","Why each party wants what they want — underlying needs and concerns","The legal rights of each party","The power differential between parties"], correct: 1, explain: "Interest-based negotiation (principled negotiation) separates positions (what people say they want) from interests (why they want it). Finding compatible interests enables creative solutions that positional bargaining never achieves." },
    ],
  },
  resilience: {
    overview: "Resilience is not about being tough or never breaking down. It's about how quickly you recover, what you learn, and how you grow. This module builds a science-backed resilience toolkit specifically designed for students and young professionals under real pressure.",
    framework: [
      { num: '①', title: 'Self-Awareness', desc: 'Knowing your stress triggers and patterns' },
      { num: '②', title: 'Regulation', desc: 'Tools to manage the stress response' },
      { num: '③', title: 'Connection', desc: 'Social support as resilience infrastructure' },
      { num: '④', title: 'Meaning', desc: 'Purpose that sustains you through difficulty' },
      { num: '⑤', title: 'Growth', desc: 'Post-traumatic growth and learning' },
    ],
    keyLearnings: [
      "The Yerkes-Dodson curve: optimal stress vs. distress",
      "Cognitive reframing: challenging catastrophic thinking",
      "The 3 P's that sabotage resilience: Personalisation, Pervasiveness, Permanence",
      "Building a personal support architecture",
      "Post-Traumatic Growth (PTG): why some people emerge stronger",
      "Physical resilience: sleep, movement, and cognitive performance",
    ],
    scenarios: [
      { text: "You fail an important exam despite putting in weeks of preparation. You feel like giving up entirely.", prompt: "Which of the 3 P's are you experiencing? How do you reframe this?" },
      { text: "You're juggling four deadlines, have no energy, and feel like you're failing at everything.", prompt: "What does a regulated stress response look like here? What's one step?" },
      { text: "A friend tells you 'you're so resilient, you can handle anything' after something difficult happened.", prompt: "Is this helpful? What does actual support look like?" },
    ],
    worksheet: {
      title: 'My Resilience Audit',
      fields: [
        { label: 'Three things that drain my energy most in a typical week:', type: 'textarea' },
        { label: 'Three things that reliably restore my energy:', type: 'textarea' },
        { label: 'Rate your current resilience (1 = depleted, 5 = strong)', type: 'rating', max: 5 },
        { label: 'My support network — who I can call when things are difficult:', type: 'textarea' },
        { label: 'One resilience habit I will build this month:', type: 'textarea' },
      ],
    },
    quiz: [
      { q: "The Yerkes-Dodson curve shows that peak performance occurs when:", opts: ["Stress is zero","Stress is at a moderate, optimal level","Stress is at maximum","There is no pressure at all"], correct: 1, explain: "The Yerkes-Dodson curve shows an inverted U — performance improves with arousal up to an optimal point, after which additional stress causes performance to decline. The goal is finding your optimal zone." },
      { q: "Seligman's '3 P's' that block resilience are:", opts: ["Power, Politics, Pressure","Personalisation, Pervasiveness, Permanence","Pessimism, Passivity, Procrastination","Perfectionism, People-pleasing, Paralysis"], correct: 1, explain: "Martin Seligman identified three thinking patterns that destroy resilience: Personalisation (it's my fault), Pervasiveness (this ruins everything), and Permanence (it will always be like this). Resilient people challenge all three." },
      { q: "Post-Traumatic Growth refers to:", opts: ["Recovering to your previous baseline","Positive psychological change that emerges from struggling with highly challenging life circumstances","Avoiding trauma through preparation","Counselling after traumatic events"], correct: 1, explain: "PTG (Tedeschi & Calhoun) describes positive psychological transformation that can emerge from the struggle with major life challenges — not despite adversity, but through the process of grappling with it." },
    ],
  },
};

// ─── QUIZ COMPONENT ───────────────────────────────────────────────────────────
function QuizComponent({ questions, moduleId }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => { setQi(0); setSel(null); setScore(0); setDone(false); };
  if (!questions || !questions.length) return null;
  const q = questions[qi];
  const answered = sel !== null;

  const handleSel = (i) => {
    if (answered) return;
    setSel(i);
    if (i === q.correct) setScore(s => s + 1);
  };
  const handleNext = () => {
    if (qi < questions.length - 1) { setQi(i => i + 1); setSel(null); }
    else setDone(true);
  };
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="ss-quiz no-print">
      <div className="ss-quiz-header">
        <h3>Knowledge Check</h3>
        <p>Test your understanding before moving to practice.</p>
      </div>
      <div className="ss-quiz-body">
        {!done ? (
          <>
            <div className="ss-quiz-progress">
              <div className="ss-quiz-bar" style={{ width: `${((qi+1)/questions.length)*100}%` }}/>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              Question {qi + 1} of {questions.length}
            </div>
            <div className="ss-quiz-q" key={qi}>{q.q}</div>
            <div className="ss-quiz-opts">
              {q.opts.map((opt, i) => {
                let cls = 'ss-quiz-opt';
                let icon = '○';
                if (answered) {
                  if (i === q.correct) { cls += ' correct'; icon = '✓'; }
                  else if (i === sel) { cls += ' wrong'; icon = '×'; }
                  else { cls += ' neutral'; icon = ' '; }
                }
                return (
                  <button key={i} className={cls} onClick={() => handleSel(i)} disabled={answered}>
                    <span style={{ flexShrink: 0, fontSize: '15px' }}>{icon}</span>{opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <>
                <div className="ss-quiz-reveal">
                  <strong>{sel === q.correct ? '✅ Correct!' : '❌ Incorrect.'}</strong>
                  {q.explain}
                </div>
                <button className="ss-quiz-next" onClick={handleNext}>
                  {qi < questions.length - 1 ? 'Next Question →' : 'See Results →'}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="ss-quiz-result">
            <h3>Quiz Complete</h3>
            <div className="ss-quiz-score">{score}/{questions.length}</div>
            <p style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '12px', lineHeight: '1.65', fontFamily: "'Lora', serif" }}>
              {pct >= 80 ? 'Outstanding. Your theoretical foundation is strong — now focus on application.' : pct >= 60 ? 'Good work. Review the explanations for any missed questions before the practice activity.' : 'Revisit the module content before the practical exercises for best results.'}
            </p>
            <button className="ss-quiz-retake" onClick={reset}>Retake Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WORKSHEET COMPONENT ──────────────────────────────────────────────────────
function WorksheetComponent({ worksheet, moduleTitle }) {
  const [answers, setAnswers] = useState({});
  const [ratings, setRatings] = useState({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!worksheet) return null;

  return (
    <div className="ss-worksheet">
      <div className="ss-worksheet-header">
        <span className="ss-worksheet-icon">📝</span>
        <div>
          <div className="ss-worksheet-title">{worksheet.title}</div>
          <div className="ss-worksheet-sub">{moduleTitle} · Reflection Worksheet</div>
        </div>
      </div>
      {worksheet.fields.map((field, i) => (
        <div className="ss-ws-field" key={i}>
          <div className="ss-ws-label">{i + 1}. {field.label}</div>
          {field.type === 'textarea' ? (
            <textarea className="ss-ws-box" rows={3} value={answers[i] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
              placeholder="Write your reflection here..."/>
          ) : field.type === 'rating' ? (
            <div className="ss-ws-rating">
              {Array.from({ length: field.max }, (_, j) => (
                <button key={j} className={`ss-ws-rating-btn ${ratings[i] === j + 1 ? 'selected' : ''}`}
                  onClick={() => setRatings(prev => ({ ...prev, [i]: j + 1 }))}>
                  {j + 1}
                </button>
              ))}
              {ratings[i] && (
                <span style={{ fontSize: '12px', color: 'var(--muted)', alignSelf: 'center', marginLeft: '8px' }}>
                  {ratings[i] <= 2 ? '— Needs attention' : ratings[i] <= 3 ? '— Developing' : ratings[i] <= 4 ? '— Good' : '— Strong'}
                </span>
              )}
            </div>
          ) : null}
        </div>
      ))}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button className="ss-btn ss-btn-gold" onClick={handleSave}>
          {saved ? '✓ Saved!' : '💾 Save Reflection'}
        </button>
        <button className="ss-btn ss-btn-ghost" onClick={() => { setAnswers({}); setRatings({}); }}>Clear</button>
      </div>
    </div>
  );
}

// ─── MODULE DETAIL MODAL ──────────────────────────────────────────────────────
function ModuleDetail({ module, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const content = MODULE_CONTENT[module.id];
  const tabs = ['Overview', 'Framework', 'Key Learning', 'Scenarios', 'Worksheet', 'Quiz'];

  return (
    <div className="ss-detail-overlay" onClick={onClose}>
      <div className="ss-detail-panel" onClick={e => e.stopPropagation()}>
        <div className="ss-detail-header">
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)', marginBottom: '6px' }}>
              Training Module
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', margin: '0 0 6px' }}>
              {module.icon} {module.title}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: 0, fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
              {module.duration} · {module.activity} · {module.level}
            </p>
          </div>
          <button className="ss-detail-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '0 40px', background: 'white', borderBottom: '1px solid var(--border)' }}>
          <div className="ss-module-tabs">
            {tabs.map(tab => (
              <button key={tab} className={`ss-module-tab ${activeTab === tab.toLowerCase().replace(' ', '') ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="ss-detail-body">
          {activeTab === 'overview' && (
            <>
              <p className="ss-body-text">{content?.overview || module.desc}</p>
              <div className="ss-gold-box">
                <h4>Learning Outcomes</h4>
                <ul>
                  {module.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>
              <div className="ss-info-box">
                <h4>Session Structure</h4>
                <ul>
                  <li><strong>Opening (10 min):</strong> Check-in, context-setting, learning objectives</li>
                  <li><strong>Theory (20–25 min):</strong> Core concepts, frameworks, research evidence</li>
                  <li><strong>Reflection (10 min):</strong> Self-assessment and personal connection to the topic</li>
                  <li><strong>Practice (25–30 min):</strong> Scenarios, role-play, or group activities</li>
                  <li><strong>Integration (10 min):</strong> Personal commitments, action planning</li>
                  <li><strong>Close (5 min):</strong> Summary, Q&A, follow-up resources</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'framework' && (
            <>
              <p className="ss-body-text">The core conceptual model underpinning this module:</p>
              <div className="ss-framework">
                {(content?.framework || []).map((item, i) => (
                  <div className="ss-framework-item" key={i}>
                    <div className="ss-framework-num">{item.num}</div>
                    <div className="ss-framework-title">{item.title}</div>
                    <div className="ss-framework-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="ss-dark-box">
                <h4>Research Foundation</h4>
                <p>All frameworks in this module are grounded in peer-reviewed research and widely adopted professional development models. Facilitators should present the research basis alongside practical application to build both competence and conviction.</p>
              </div>
            </>
          )}

          {activeTab === 'keylearning' && (
            <>
              <p className="ss-body-text">Core concepts covered in this module — for both participants and facilitators:</p>
              <ol className="ss-steps">
                {(content?.keyLearnings || module.outcomes).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
              <div className="ss-two-col">
                <div className="ss-col green">
                  <div className="ss-col-title">✅ Participants Will Be Able To</div>
                  <ul className="ss-col-list">
                    {module.outcomes.slice(0, 3).map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div className="ss-col blue">
                  <div className="ss-col-title">🎯 Facilitator Objectives</div>
                  <ul className="ss-col-list">
                    <li>Create psychological safety for honest reflection</li>
                    <li>Model the skills you are teaching</li>
                    <li>Draw out lived experience from the group</li>
                    <li>Anchor theory in practical, real scenarios</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'scenarios' && (
            <>
              <p className="ss-body-text">Use these scenarios for role-play, discussion, or written reflection. Each one is designed to surface real dilemmas with no "easy" answer.</p>
              {(content?.scenarios || []).map((s, i) => (
                <div className="ss-scenario" key={i}>
                  <div className="ss-scenario-num">Scenario {i + 1}</div>
                  <div className="ss-scenario-text">"{s.text}"</div>
                  <div className="ss-scenario-prompt">💬 Discussion prompt: {s.prompt}</div>
                </div>
              ))}
              <div className="ss-warn-box">
                <h4>Facilitation Note</h4>
                <p>These scenarios are intentionally ambiguous. There is no single "correct" answer. The value is in the discussion, the reasoning, and uncovering different perspectives. Allow at least 8–10 minutes per scenario in group settings.</p>
              </div>
            </>
          )}

          {activeTab === 'worksheet' && (
            <WorksheetComponent worksheet={content?.worksheet} moduleTitle={module.title}/>
          )}

          {activeTab === 'quiz' && (
            <QuizComponent questions={content?.quiz} moduleId={module.id}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SELF-ASSESSMENT ──────────────────────────────────────────────────────────
const ASSESSMENT_SKILLS = [
  { name: 'Verbal Communication', key: 'verbal' },
  { name: 'Active Listening', key: 'listen' },
  { name: 'Emotional Regulation', key: 'emotion' },
  { name: 'Empathy', key: 'empathy' },
  { name: 'Leadership Presence', key: 'lead' },
  { name: 'Conflict Navigation', key: 'conflict' },
  { name: 'Teamwork', key: 'team' },
  { name: 'Public Speaking', key: 'speak' },
  { name: 'Time Management', key: 'time' },
  { name: 'Problem Solving', key: 'solve' },
  { name: 'Resilience', key: 'resilience' },
  { name: 'Adaptability', key: 'adapt' },
];
const LEVELS = ['Developing', 'Building', 'Capable', 'Confident', 'Expert'];

function SelfAssessment() {
  const [scores, setScores] = useState({});
  const [saved, setSaved] = useState(false);

  const setScore = (key, lvl) => setScores(prev => ({ ...prev, [key]: lvl }));
  const avgScore = Object.values(scores).length ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : 0;
  const filled = Object.keys(scores).length;

  return (
    <div className="ss-assessment">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
        <div>
          <div className="ss-section-label">Diagnostic Tool</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--ink)' }}>Soft Skills Self-Assessment</h3>
          <p style={{ fontFamily: "'Lora', serif", fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', marginTop: '6px' }}>Rate yourself honestly across 12 core soft skills to identify your development priorities.</p>
        </div>
        {filled > 0 && (
          <div style={{ textAlign: 'center', background: 'var(--gold-pale)', padding: '16px 24px', borderRadius: '14px', border: '1px solid rgba(212,168,67,0.3)' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{filled}/12</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Assessed</div>
          </div>
        )}
      </div>
      <div className="ss-assessment-grid">
        {ASSESSMENT_SKILLS.map(skill => {
          const val = scores[skill.key] || 0;
          return (
            <div className="ss-skill-item" key={skill.key}>
              <div className="ss-skill-name">{skill.name}</div>
              <div className="ss-skill-bar-bg">
                <div className="ss-skill-bar-fill" style={{ width: `${val * 20}%` }}/>
              </div>
              <div className="ss-skill-levels">
                {LEVELS.map((lvl, i) => (
                  <button key={lvl} className={`ss-skill-level-btn ${val === i + 1 ? 'sel' : ''}`}
                    onClick={() => setScore(skill.key, i + 1)} title={lvl}>
                    {i + 1}
                  </button>
                ))}
              </div>
              {val > 0 && <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>{LEVELS[val - 1]}</div>}
            </div>
          );
        })}
      </div>
      {filled >= 6 && (
        <div style={{ marginTop: '24px', padding: '20px', background: 'var(--gold-pale)', borderRadius: '14px', borderLeft: '4px solid var(--gold)' }}>
          <p style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 700, marginBottom: '6px' }}>
            📊 Your Priority Development Areas:
          </p>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.65', fontFamily: "'Lora', serif" }}>
            Based on your ratings, focus first on the skills rated 1–2 (Developing/Building). Start with the foundational modules (Communication, Resilience, Teamwork) before advancing to Applied skills. Revisit this assessment after completing 3 modules.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── PPT GENERATOR ─────────────────────────────────────────────────────────────
async function generatePPT(moduleId) {
  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return;
  const content = MODULE_CONTENT[moduleId];

  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE';
  prs.author = 'SecretSharz — Soft Skills Hub';
  prs.title = `Soft Skills: ${mod.title}`;

  const C = { dark: '0F1117', charcoal: '1A1D27', gold: 'D4A843', goldLight: 'E8C97A', white: 'FFFFFF', muted: '7A7D8A', cream: 'FAF7F2' };

  // TITLE SLIDE
  const s1 = prs.addSlide();
  s1.background = { color: C.dark };
  s1.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: C.gold } });
  s1.addShape(prs.ShapeType.rect, { x: 0, y: 7.38, w: 13.33, h: 0.12, fill: { color: C.gold } });
  s1.addText(mod.icon, { x: 5.5, y: 0.8, w: 2.3, h: 1.2, fontSize: 56, align: 'center' });
  s1.addText(mod.title, { x: 0.8, y: 2.2, w: 11.7, h: 1.2, fontFace: 'Georgia', fontSize: 40, bold: true, color: C.white, align: 'center' });
  s1.addText('Soft Skills Training Module', { x: 0.8, y: 3.5, w: 11.7, h: 0.5, fontFace: 'Calibri', fontSize: 18, color: C.gold, align: 'center', italic: true });
  s1.addText(`${mod.duration} · ${mod.level} · ${mod.activity}`, { x: 0.8, y: 4.2, w: 11.7, h: 0.4, fontFace: 'Calibri', fontSize: 14, color: C.muted, align: 'center' });
  s1.addText('SecretSharz | secretsharz.com', { x: 0.8, y: 6.9, w: 11.7, h: 0.3, fontFace: 'Calibri', fontSize: 11, color: C.muted, align: 'center' });

  // OUTCOMES SLIDE
  const s2 = prs.addSlide();
  s2.background = { color: C.charcoal };
  s2.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: 7.5, fill: { color: C.gold } });
  s2.addText('Learning Outcomes', { x: 0.4, y: 0.5, w: 12, h: 0.8, fontFace: 'Georgia', fontSize: 30, bold: true, color: C.white });
  s2.addText('By the end of this session, you will be able to:', { x: 0.4, y: 1.4, w: 12, h: 0.4, fontFace: 'Calibri', fontSize: 14, color: C.muted, italic: true });
  mod.outcomes.forEach((o, i) => {
    s2.addShape(prs.ShapeType.rect, { x: 0.4, y: 2.0 + i * 0.75, w: 11.8, h: 0.62, fill: { color: 'FFFFFF', transparency: 88 }, line: { color: C.gold, width: 0.5 } });
    s2.addText(`${i + 1}.  ${o}`, { x: 0.6, y: 2.05 + i * 0.75, w: 11.4, h: 0.52, fontFace: 'Calibri', fontSize: 14, color: C.white });
  });

  // FRAMEWORK SLIDE
  if (content?.framework) {
    const s3 = prs.addSlide();
    s3.background = { color: C.cream };
    s3.addText('Core Framework', { x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: 'Georgia', fontSize: 28, bold: true, color: C.dark });
    const cols = content.framework.length;
    const w = Math.min(2.4, 12 / cols);
    content.framework.forEach((f, i) => {
      const x = 0.6 + i * (w + 0.3);
      s3.addShape(prs.ShapeType.rect, { x, y: 1.5, w, h: 4, fill: { color: C.dark }, line: { color: C.gold, width: 2 } });
      s3.addText(f.num, { x, y: 1.7, w, h: 1.0, fontFace: 'Georgia', fontSize: 28, bold: true, color: C.gold, align: 'center' });
      s3.addText(f.title, { x, y: 2.8, w, h: 0.5, fontFace: 'Calibri', fontSize: 13, bold: true, color: C.white, align: 'center' });
      s3.addText(f.desc, { x: x + 0.1, y: 3.4, w: w - 0.2, h: 1.8, fontFace: 'Calibri', fontSize: 10, color: C.muted, align: 'center', wrap: true });
    });
  }

  // KEY LEARNINGS SLIDE
  if (content?.keyLearnings) {
    const s4 = prs.addSlide();
    s4.background = { color: C.cream };
    s4.addText('Key Concepts', { x: 0.6, y: 0.4, w: 12, h: 0.7, fontFace: 'Georgia', fontSize: 28, bold: true, color: C.dark });
    const half = Math.ceil(content.keyLearnings.length / 2);
    content.keyLearnings.forEach((kl, i) => {
      const col = i < half ? 0 : 1;
      const row = i < half ? i : i - half;
      s4.addShape(prs.ShapeType.ellipse, { x: 0.5 + col * 6.5, y: 1.3 + row * 0.95, w: 0.3, h: 0.3, fill: { color: C.gold } });
      s4.addText(kl, { x: 0.95 + col * 6.5, y: 1.2 + row * 0.95, w: 5.8, h: 0.7, fontFace: 'Calibri', fontSize: 12, color: C.dark, wrap: true });
    });
  }

  // SCENARIOS SLIDE
  if (content?.scenarios) {
    content.scenarios.forEach((scene, i) => {
      const ss = prs.addSlide();
      ss.background = { color: C.dark };
      ss.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: C.gold } });
      ss.addText(`Scenario ${i + 1}`, { x: 0.6, y: 0.4, w: 12, h: 0.4, fontFace: 'Calibri', fontSize: 12, color: C.gold, bold: true });
      ss.addShape(prs.ShapeType.rect, { x: 0.6, y: 1.0, w: 12, h: 3.5, fill: { color: 'FFFFFF', transparency: 88 }, line: { color: C.gold, width: 1 } });
      ss.addText(`"${scene.text}"`, { x: 0.8, y: 1.2, w: 11.6, h: 3.0, fontFace: 'Georgia', fontSize: 16, color: C.white, italic: true, align: 'center', wrap: true });
      ss.addShape(prs.ShapeType.rect, { x: 0.6, y: 4.8, w: 12, h: 1.5, fill: { color: C.gold, transparency: 20 } });
      ss.addText(`💬  ${scene.prompt}`, { x: 0.8, y: 4.9, w: 11.6, h: 1.2, fontFace: 'Calibri', fontSize: 14, color: C.dark, bold: true, wrap: true });
    });
  }

  // CLOSING SLIDE
  const sc = prs.addSlide();
  sc.background = { color: C.dark };
  sc.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: C.gold } });
  sc.addText('Take Action', { x: 0.8, y: 1.5, w: 11.7, h: 1.0, fontFace: 'Georgia', fontSize: 38, bold: true, color: C.white, align: 'center' });
  sc.addText('One thing I will do differently in the next 48 hours:', { x: 0.8, y: 2.8, w: 11.7, h: 0.5, fontFace: 'Calibri', fontSize: 16, color: C.gold, align: 'center', italic: true });
  sc.addShape(prs.ShapeType.rect, { x: 1.5, y: 3.6, w: 10, h: 1.8, fill: { color: 'FFFFFF', transparency: 92 }, line: { color: C.gold, width: 1, dashType: 'dash' } });
  sc.addText('secretsharz.com  |  Soft Skills Hub  |  Your development, your pace.', { x: 0.8, y: 6.8, w: 11.7, h: 0.4, fontFace: 'Calibri', fontSize: 11, color: C.muted, align: 'center' });

  await prs.writeFile({ fileName: `SecretSharz-SoftSkills-${mod.title.replace(/\s+/g, '-')}.pptx` });
}

// ─── DOWNLOADS DATA ────────────────────────────────────────────────────────────
const DOWNLOADS = [
  { title: 'Soft Skills 101 — Student Handout', desc: 'A beautifully designed 2-page overview of all 12 soft skill domains with self-assessment grid.', icon: '📄', bg: 'var(--gold-pale)', tags: ['PDF', 'Printable', 'Student'], file: '/resources/soft-skills/SS-Student-Handout.pdf' },
  { title: 'Facilitator\'s Complete Guide', desc: 'Session plans, facilitation tips, timing guidelines, and debrief questions for all 12 modules.', icon: '📋', bg: 'var(--teal-pale)', tags: ['PDF', 'Facilitator', '48 pages'], file: '/resources/soft-skills/SS-Facilitator-Guide.pdf' },
  { title: 'Communication Skills Worksheet Pack', desc: '5 printable worksheets covering active listening, feedback, NVC practice, and written clarity.', icon: '✏️', bg: 'var(--violet-pale)', tags: ['PDF', '5 worksheets', 'Printable'], file: '/resources/soft-skills/SS-Communication-Worksheets.pdf' },
  { title: 'EQ Self-Assessment Tool', desc: 'A 40-question Emotional Intelligence profile tool using Goleman\'s five-domain framework.', icon: '💛', bg: 'var(--coral-pale)', tags: ['PDF', 'Assessment', 'Self-guided'], file: '/resources/soft-skills/SS-EQ-Assessment.pdf' },
  { title: 'Leadership Styles Inventory', desc: 'Identify your natural leadership style using the Situational Leadership Model with scoring guide.', icon: '🧭', bg: 'var(--teal-pale)', tags: ['PDF', 'Inventory', 'Printable'], file: '/resources/soft-skills/SS-Leadership-Inventory.pdf' },
  { title: 'Conflict Resolution Workbook', desc: 'A step-by-step workbook with TKI conflict style assessment, real scenarios, and negotiation scripts.', icon: '🤝', bg: 'var(--violet-pale)', tags: ['PDF', 'Workbook', '12 pages'], file: '/resources/soft-skills/SS-Conflict-Workbook.pdf' },
  { title: 'Time & Energy Audit Sheet', desc: 'A weekly time-tracking and energy mapping tool to identify your productivity patterns.', icon: '⏱️', bg: 'var(--gold-pale)', tags: ['PDF', 'Weekly tool', 'Printable'], file: '/resources/soft-skills/SS-Time-Audit.pdf' },
  { title: 'Resilience Toolkit Handout', desc: 'Evidence-based strategies for stress regulation, cognitive reframing, and building your support architecture.', icon: '🌱', bg: 'var(--sage-pale)', tags: ['PDF', 'Toolkit', 'Student'], file: '/resources/soft-skills/SS-Resilience-Toolkit.pdf' },
  { title: 'Group Activity Pack (12 Activities)', desc: 'Facilitated group exercises for each soft skill — ice-breakers, warm-ups, and deeper practice games.', icon: '🎯', bg: 'var(--coral-pale)', tags: ['PDF', 'Group activities', 'Facilitator'], file: '/resources/soft-skills/SS-Activity-Pack.pdf' },
  { title: 'Presentation Skills Quick Reference', desc: 'A laminated-ready card with Monroe\'s Sequence, STAR storytelling, and anxiety management tips.', icon: '🎤', bg: 'var(--sky-pale)', tags: ['PDF', 'Reference card', 'A5 size'], file: '/resources/soft-skills/SS-Presentation-Card.pdf' },
  { title: 'Soft Skills 12-Week Development Plan', desc: 'A structured 12-week personal development tracker — one module per week with goals and check-ins.', icon: '📅', bg: 'var(--gold-pale)', tags: ['PDF', '12-week plan', 'Self-paced'], file: '/resources/soft-skills/SS-12-Week-Plan.pdf' },
  { title: 'Scenario Discussion Cards (48 Cards)', desc: 'Print-and-cut scenario cards for group discussions. One set per skill module, 4 scenarios each.', icon: '🃏', bg: 'var(--teal-pale)', tags: ['PDF', 'Print & cut', 'Group use'], file: '/resources/soft-skills/SS-Scenario-Cards.pdf' },
];

// ─── TABS DATA ────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'modules', label: 'All Modules', sub: '12 training sessions' },
  { key: 'foundation', label: 'Foundation', sub: 'Core skills' },
  { key: 'applied', label: 'Applied', sub: 'Practice skills' },
  { key: 'advanced', label: 'Advanced', sub: 'Leadership skills' },
  { key: 'wellbeing', label: 'Wellbeing', sub: 'Mental health link' },
  { key: 'assess', label: 'Self-Assessment', sub: 'Diagnostic tool' },
  { key: 'resources', label: 'Downloads', sub: 'PDFs & worksheets' },
  { key: 'facilitator', label: 'Facilitator Guide', sub: 'For trainers' },
];

const CATEGORY_MAP = {
  modules: () => true,
  foundation: m => m.tag.includes('Foundation'),
  applied: m => m.tag.includes('Applied'),
  advanced: m => m.tag.includes('Advanced'),
  wellbeing: m => m.tag.includes('Wellbeing') || m.tag.includes('Cognitive'),
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function SoftSkillsHub({ navigate, onBack }) {
  const [activeTab, setActiveTab] = useState('modules');
  const [activeModule, setActiveModule] = useState(null);
  const [pptLoading, setPptLoading] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);

  const handlePPT = useCallback(async (moduleId, e) => {
    e.stopPropagation();
    setPptLoading(moduleId);
    try {
      await generatePPT(moduleId);
      showToast('✨ PPT downloaded successfully!');
    } catch (err) {
      showToast('PPT generation failed. Install pptxgenjs.');
    } finally {
      setPptLoading(null);
    }
  }, [showToast]);

  const visibleModules = CATEGORY_MAP[activeTab] ? MODULES.filter(CATEGORY_MAP[activeTab]) : MODULES;

  return (
    <>
      <div className="ss-page">
        {/* TOPBAR */}
        <div className="ss-topbar">
          <button className="ss-back" onClick={onBack || (() => navigate && navigate('/resources'))}>
            ← Back to Resources
          </button>
          <div className="ss-topbar-title">Soft Skills Hub</div>
          <div className="ss-topbar-actions">
            <button className="ss-topbar-btn ghost" onClick={() => window.print()}>🖨️ Print</button>
            <button className="ss-topbar-btn gold" onClick={() => setActiveTab('assess')}>📊 Take Assessment</button>
          </div>
        </div>

        {/* HERO */}
        <section className="ss-hero">
          <div className="ss-hero-grid"/>
          <div className="ss-hero-glow"/>
          <div className="ss-hero-inner">
            <div className="ss-hero-eyebrow">
              <span>✦</span> SecretSharz Resource Hub
            </div>
            <h1>
              Soft Skills are<br/><em>Human Skills.</em>
            </h1>
            <p className="ss-hero-sub">
              "The most in-demand skills of the next decade won't be found in textbooks. They'll come from understanding yourself, connecting with others, and navigating the complexity of being human."
            </p>
            <div className="ss-hero-stats">
              <div className="ss-hero-stat">
                <div className="ss-hero-stat-num">12</div>
                <div className="ss-hero-stat-label">Training Modules</div>
              </div>
              <div className="ss-hero-stat">
                <div className="ss-hero-stat-num">12+</div>
                <div className="ss-hero-stat-label">Downloadable Resources</div>
              </div>
              <div className="ss-hero-stat">
                <div className="ss-hero-stat-num">92%</div>
                <div className="ss-hero-stat-label">Employers rank EQ above IQ</div>
              </div>
              <div className="ss-hero-stat">
                <div className="ss-hero-stat-num">58%</div>
                <div className="ss-hero-stat-label">Of job performance driven by EQ</div>
              </div>
            </div>
          </div>
        </section>

        {/* NAV */}
        <div className="ss-nav">
          <div className="ss-nav-inner">
            {TABS.map(tab => (
              <button key={tab.key} className={`ss-nav-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}>
                {tab.label}
                <span className="ss-nav-tab-sub">{tab.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="ss-main">

          {/* MODULES VIEW */}
          {['modules','foundation','applied','advanced','wellbeing'].includes(activeTab) && (
            <>
              <div className="ss-section-header">
                <div className="ss-section-label">
                  {activeTab === 'modules' ? 'All 12 Training Sessions' :
                   activeTab === 'foundation' ? 'Foundation Skills' :
                   activeTab === 'applied' ? 'Applied Skills' :
                   activeTab === 'advanced' ? 'Advanced Skills' : 'Wellbeing Skills'}
                </div>
                <h2 className="ss-section-title">
                  {activeTab === 'modules' ? 'Your Complete Soft Skills Curriculum' :
                   activeTab === 'foundation' ? 'Build the Essentials First' :
                   activeTab === 'applied' ? 'Put Theory into Practice' :
                   activeTab === 'advanced' ? 'Lead, Influence, and Inspire' : 'Wellbeing as a Professional Skill'}
                </h2>
                <p className="ss-section-desc">
                  {activeTab === 'modules' ? 'Each module includes theory, frameworks, reflective exercises, real-world scenarios, worksheets, and a quiz.' :
                   activeTab === 'foundation' ? 'Start here. These skills underpin everything else. Rushing to advanced topics without foundations is like building on sand.' :
                   activeTab === 'applied' ? 'Skills that require real practice and feedback to develop. Push yourself into the uncomfortable zone.' :
                   activeTab === 'advanced' ? 'Leadership and complex adaptive skills. These emerge from sustained experience and intentional reflection.' :
                   'Skills that sustain your performance over time. Without wellbeing, no other skill develops reliably.'}
                </p>
              </div>
              <div className="ss-modules-grid">
                {visibleModules.map(mod => (
                  <div key={mod.id} className={`ss-module-card ${mod.color}`} onClick={() => setActiveModule(mod)}>
                    <div className="ss-module-header">
                      <div className="ss-module-icon">{mod.icon}</div>
                      <span className={`ss-module-tag ${mod.tagColor}`}>{mod.tag}</span>
                      <h3 className="ss-module-title">{mod.title}</h3>
                      <p className="ss-module-desc">{mod.desc}</p>
                    </div>
                    <div className="ss-module-footer">
                      <div className="ss-module-meta">
                        <span className="ss-module-badge time">⏱ {mod.duration}</span>
                        <span className="ss-module-badge">{mod.level}</span>
                        <span className="ss-module-badge">{mod.activity}</span>
                      </div>
                      <div className="ss-module-actions" onClick={e => e.stopPropagation()}>
                        <button className="ss-btn ss-btn-ghost"
                          onClick={e => handlePPT(mod.id, e)}
                          disabled={pptLoading === mod.id}>
                          {pptLoading === mod.id ? '⏳' : '📊'} PPT
                        </button>
                        <button className="ss-btn ss-btn-gold" onClick={e => { e.stopPropagation(); setActiveModule(mod); }}>
                          Open →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ASSESSMENT */}
          {activeTab === 'assess' && (
            <>
              <SelfAssessment/>
              <div style={{ marginTop: '40px' }}>
                <div className="ss-section-header">
                  <div className="ss-section-label">After Your Assessment</div>
                  <h2 className="ss-section-title">Recommended Learning Path</h2>
                  <p className="ss-section-desc">Start with the Foundation modules regardless of your self-assessment scores. Skills build on each other.</p>
                </div>
                <div className="ss-modules-grid">
                  {MODULES.filter(m => m.tag.includes('Foundation')).map(mod => (
                    <div key={mod.id} className={`ss-module-card ${mod.color}`} onClick={() => setActiveModule(mod)}>
                      <div className="ss-module-header">
                        <div className="ss-module-icon">{mod.icon}</div>
                        <span className={`ss-module-tag ${mod.tagColor}`}>Start Here</span>
                        <h3 className="ss-module-title">{mod.title}</h3>
                        <p className="ss-module-desc">{mod.desc}</p>
                      </div>
                      <div className="ss-module-footer">
                        <div className="ss-module-meta">
                          <span className="ss-module-badge time">⏱ {mod.duration}</span>
                        </div>
                        <button className="ss-btn ss-btn-gold" onClick={e => { e.stopPropagation(); setActiveModule(mod); }}>
                          Begin →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* DOWNLOADS */}
          {activeTab === 'resources' && (
            <>
              <div className="ss-section-header">
                <div className="ss-section-label">Free Resources</div>
                <h2 className="ss-section-title">Worksheets, Handouts & PPTs</h2>
                <p className="ss-section-desc">All resources are free to download, print, and use for educational and institutional purposes. Attribution appreciated.</p>
              </div>
              <div className="ss-downloads-grid">
                {DOWNLOADS.map((dl, i) => (
                  <div className="ss-dl-card" key={i}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div className="ss-dl-icon-wrap" style={{ background: dl.bg }}>{dl.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div className="ss-dl-title">{dl.title}</div>
                      </div>
                    </div>
                    <div className="ss-dl-desc">{dl.desc}</div>
                    <div className="ss-dl-meta">
                      {dl.tags.map(t => <span key={t} className="ss-dl-tag">{t}</span>)}
                    </div>
                    <div className="ss-dl-actions">
                      <a href={dl.file} download target="_blank" rel="noreferrer" className="ss-btn ss-btn-gold"
                        onClick={() => showToast('Downloading resource...')}>
                        📥 Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* PPT DOWNLOAD SECTION */}
              <div style={{ marginTop: '48px' }}>
                <div className="ss-section-header">
                  <div className="ss-section-label">PowerPoint Presentations</div>
                  <h2 className="ss-section-title">Generate Module PPTs</h2>
                  <p className="ss-section-desc">Click any module below to generate and download a professionally designed PowerPoint presentation ready for your training sessions.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '16px' }}>
                  {MODULES.map(mod => (
                    <button key={mod.id} className="ss-dl-card"
                      style={{ cursor: 'pointer', border: 'none', textAlign: 'left', background: 'white' }}
                      onClick={e => handlePPT(mod.id, e)}
                      disabled={pptLoading === mod.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '28px' }}>{mod.icon}</span>
                        <div>
                          <div className="ss-dl-title" style={{ fontSize: '15px' }}>{mod.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{mod.duration} · {mod.level}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '10px 14px', background: 'var(--gold)', borderRadius: '50px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--obsidian)', fontFamily: 'Syne' }}>
                          {pptLoading === mod.id ? '⏳ Generating...' : '📊 Download PPT'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FACILITATOR GUIDE */}
          {activeTab === 'facilitator' && (
            <>
              <div className="ss-section-header">
                <div className="ss-section-label">For Trainers & Educators</div>
                <h2 className="ss-section-title">Facilitator's Complete Guide</h2>
                <p className="ss-section-desc">Everything you need to deliver transformative soft skills training — from your first session to building a full programme.</p>
              </div>

              <div className="ss-facilitator-section">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)', marginBottom: '8px' }}>Facilitator Principles</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'white', marginBottom: '8px' }}>The 5 Principles of Effective Soft Skills Training</h3>
                  <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                    "Tell me and I forget. Show me and I remember. Involve me and I understand." — Confucius
                  </p>
                </div>
                <div className="ss-facilitator-grid" style={{ position: 'relative', zIndex: 1 }}>
                  {[
                    { title: '1. Safety First', desc: 'Establish psychological safety before any meaningful learning can happen. Name norms explicitly. Model vulnerability first.' },
                    { title: '2. Experience Over Theory', desc: 'Soft skills are caught, not taught. 70% of session time should be practice, scenario, or reflection — not lecture.' },
                    { title: '3. Personalise Everything', desc: 'Generic examples don\'t land. Adapt every scenario to the group\'s actual context, language, and challenges.' },
                    { title: '4. The Debrief is the Session', desc: 'What happens after the activity matters more than the activity itself. Slow down the debrief. Ask deeper questions.' },
                    { title: '5. Transfer is the Goal', desc: 'Learning that stays in the room is wasted. Every session must end with a specific, concrete commitment to real action.' },
                  ].map((p, i) => (
                    <div className="ss-facilitator-card" key={i}>
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SESSION STRUCTURE */}
              <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                <h3 className="ss-h3">Universal Session Structure</h3>
                <ol className="ss-steps">
                  <li><strong>Welcome & Check-In (5–10 min):</strong> A brief question that gets people present and connected. Examples: "Share a one-word feeling." "What's one win from this week?" Never skip this — it sets the tone.</li>
                  <li><strong>Context Setting (5 min):</strong> Why does this skill matter? Share a relevant statistic, story, or real-world consequence. Make the case before teaching the content.</li>
                  <li><strong>Core Theory (15–20 min):</strong> The essential framework — no more. Use the PPT, a visual model, or the whiteboard. Stop at 20 minutes regardless. Attention is finite.</li>
                  <li><strong>Self-Reflection (10 min):</strong> Individual worksheet or silent reflection. Before practising with others, participants need to connect the content to their own experience.</li>
                  <li><strong>Practice Activity (20–30 min):</strong> Role-play, scenario discussion, group simulation, or pair work. The facilitator circulates, listens, and resists the urge to intervene too quickly.</li>
                  <li><strong>Group Debrief (10–15 min):</strong> The most important part. Ask: What happened? What did you notice? What was difficult? What surprised you? What will you do differently?</li>
                  <li><strong>Commitment & Close (5 min):</strong> Each participant writes one specific action they will take in the next 48 hours. Share in pairs. The public commitment increases follow-through by 65%.</li>
                </ol>
              </div>

              {/* DEBRIEF QUESTIONS */}
              <div className="ss-gold-box">
                <h4>Master Debrief Question Bank</h4>
                <ul>
                  <li><strong>Opening:</strong> "What did you notice about yourself in that activity?"</li>
                  <li><strong>Deepening:</strong> "What made that harder than you expected?"</li>
                  <li><strong>Challenge:</strong> "Can anyone offer a different perspective on that?"</li>
                  <li><strong>Application:</strong> "When in the last week could you have used this skill?"</li>
                  <li><strong>Transfer:</strong> "What's one specific situation this week where you'll practise this?"</li>
                  <li><strong>Closing:</strong> "What's the one thing from today you don't want to forget?"</li>
                </ul>
              </div>

              {/* COMMON FACILITATION CHALLENGES */}
              <div style={{ marginTop: '32px' }}>
                <h3 className="ss-h3">Handling Difficult Facilitation Moments</h3>
                <div className="ss-two-col">
                  <div className="ss-col red">
                    <div className="ss-col-title">🚨 The Challenge</div>
                    <ul className="ss-col-list">
                      <li>One person dominates all discussion</li>
                      <li>The group goes silent during activity</li>
                      <li>Someone shares something emotionally heavy</li>
                      <li>Participants challenge the theory aggressively</li>
                      <li>Time runs out before the debrief</li>
                      <li>Participants already "know" the content</li>
                    </ul>
                  </div>
                  <div className="ss-col green">
                    <div className="ss-col-title">✅ The Response</div>
                    <ul className="ss-col-list">
                      <li>"Let's hear from someone we haven't heard from yet."</li>
                      <li>Give 60 seconds of silence before you intervene. They just need time.</li>
                      <li>Acknowledge, don't analyse. Say "That took courage to share." Then refer to support resources.</li>
                      <li>"That's a fair challenge. Let's test it: what does your experience tell you?"</li>
                      <li>Cut the activity short. Never skip the debrief — it IS the learning.</li>
                      <li>"Knowing something and doing it are different. Let's find the gap."</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CREATING SAFE SPACE */}
              <div className="ss-dark-box" style={{ marginTop: '32px' }}>
                <h4>Creating Psychological Safety: The First 5 Minutes</h4>
                <ul>
                  <li><strong>Be explicit:</strong> "In this space, there are no right answers. There is only honest reflection."</li>
                  <li><strong>Be first:</strong> Share your own story or struggle with the skill before asking participants to share theirs.</li>
                  <li><strong>Honour resistance:</strong> "If this doesn't resonate with your experience, please say so. We want the real conversation."</li>
                  <li><strong>Name the norms:</strong> Confidentiality, non-judgement, listening to understand rather than respond.</li>
                  <li><strong>Acknowledge difference:</strong> People come to these skills from very different backgrounds, cultures, and starting points.</li>
                </ul>
              </div>

              {/* CONNECTION TO MENTAL HEALTH */}
              <div className="ss-info-box" style={{ marginTop: '24px' }}>
                <h4>💚 Connection to Mental Health: The SecretSharz Context</h4>
                <p>Soft skills and mental health are inseparable. Emotional regulation IS an EQ skill. Resilience IS a soft skill. Boundary-setting IS a communication skill. When facilitating in a mental health context, be especially attentive to participants who may be triggered by conflict scenarios, leadership discussions around authority, or vulnerability exercises. Always have the MindSpace and crisis helpline resources readily available. Facilitation is a form of care.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODULE DETAIL OVERLAY */}
      {activeModule && <ModuleDetail module={activeModule} onClose={() => setActiveModule(null)}/>}

      {/* TOAST */}
      <div className={`ss-toast ${toast ? 'show' : ''}`}>
        <span>✨</span> {toast}
      </div>
    </>
  );
}
