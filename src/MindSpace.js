import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── STYLES ────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --ink: #1E2820; --ink-soft: #3D4A40; --muted: #7A8A7D;
    --sage: #4A7C59; --lavender: #7C6FA0; --sky: #5B9EBF;
    --peach: #E8845A; --warm-white: #FDFCFA; --sand: #F7F3ED;
    --border: rgba(74,124,89,0.15); --gold: #C8982A;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .mh-page { min-height: 100vh; background: var(--warm-white); font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 120px; }

  /* TOPBAR */
  .mh-topbar { background: var(--ink); color: white; height: 56px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 300; border-bottom: 3px solid var(--lavender); }
  .mh-back { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .mh-back:hover { color: white; }
  .mh-topbar-title { font-family: 'Fraunces', serif; font-size: 16px; color: white; }
  .mh-streak-banner { background: var(--lavender); color: white; text-align: center; padding: 10px 20px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }

  /* HERO */
  .mh-hero { background: linear-gradient(135deg, var(--ink) 0%, #2A2438 100%); padding: 80px 48px 110px; text-align: center; color: white; position: relative; overflow: hidden; }
  .mh-hero::before { content: ''; position: absolute; top: -60px; left: -60px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(124,111,160,0.12), transparent 70%); border-radius: 50%; pointer-events: none; }
  .mh-hero::after { content: ''; position: absolute; bottom: -80px; right: -40px; width: 350px; height: 350px; background: radial-gradient(circle, rgba(91,158,191,0.1), transparent 70%); border-radius: 50%; pointer-events: none; }
  .mh-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  .mh-memory-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; margin-bottom: 24px; cursor: pointer; transition: 0.2s; color: #B3A4D6; }
  .mh-memory-badge:hover { background: rgba(255,255,255,0.2); color: white; }
  .mh-eyebrow { display: inline-block; background: rgba(124,111,160,0.2); border: 1px solid rgba(124,111,160,0.4); color: #B3A4D6; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
  .mh-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
  .mh-h1 em { font-style: italic; color: #B3A4D6; }
  .mh-sub { font-size: 18px; color: rgba(255,255,255,0.8); line-height: 1.6; font-weight: 400; max-width: 600px; margin: 0 auto; }

  /* QUICK START */
  .mh-start-container { max-width: 700px; margin: -55px auto 40px; position: relative; z-index: 20; padding: 0 24px; }
  .mh-start-box { background: white; border-radius: 24px; padding: 32px; text-align: center; box-shadow: 0 16px 48px rgba(0,0,0,0.14); border: 3px solid var(--lavender); }
  .mh-start-box h3 { font-family: 'Fraunces', serif; font-size: 24px; margin: 0 0 8px; color: var(--ink); }
  .mh-start-box p { color: var(--muted); margin: 0 0 24px; font-size: 15px; }
  .mh-start-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .mh-start-actions button { flex: 1; min-width: 220px; padding: 16px; font-size: 15px; }

  /* BREATHING */
  .quick-calm-inline { background: #EAF4FA; border: 1px solid rgba(41,128,185,0.2); border-radius: 24px; padding: 36px; max-width: 700px; margin: 0 auto 40px; text-align: center; display: none; }
  .quick-calm-inline.active { display: block; animation: fadeIn 0.4s ease; }
  .breathing-circle { width: 160px; height: 160px; border-radius: 50%; background: linear-gradient(135deg, #5B9EBF, #A89DD0); margin: 24px auto; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-family: 'Fraunces', serif; font-size: 22px; box-shadow: 0 8px 32px rgba(91,158,191,0.3); transition: all 0.5s ease; }
  @keyframes breatheCycle { 0%{transform:scale(1)} 21%{transform:scale(1.5)} 58%{transform:scale(1.5)} 100%{transform:scale(1)} }
  .breathing-circle.animating { animation: breatheCycle 19s infinite linear; }

  /* VALIDATION */
  .mh-validation { text-align: center; max-width: 600px; margin: 0 auto 56px; padding: 0 24px; color: var(--ink-soft); font-size: 16px; line-height: 1.6; }
  .mh-validation strong { color: var(--ink); font-family: 'Fraunces', serif; font-size: 22px; display: block; margin: 10px 0; }
  .mh-human-touch { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: var(--muted); margin-top: 16px; font-weight: 600; }

  /* SECTION HEADERS */
  .mh-section-header { max-width: 1100px; margin: 0 auto 28px; padding: 0 48px; }
  .mh-section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px; color: var(--muted); margin-bottom: 6px; }
  .mh-section-title { font-family: 'Fraunces', serif; font-size: 28px; color: var(--ink); font-weight: 700; }

  /* EMOTION ROULETTE */
  .roulette-card { background: white; border-radius: 20px; border: 2px dashed var(--lavender); padding: 32px; text-align: center; margin: 0 auto 40px; max-width: 700px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
  .roulette-window { height: 80px; overflow: hidden; position: relative; background: var(--sand); border-radius: 16px; margin: 24px auto; width: 80%; border: 1px solid var(--border); box-shadow: inset 0 4px 12px rgba(0,0,0,0.05); }
  .roulette-track { display: flex; flex-direction: column; }
  .roulette-item { height: 80px; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; }
  .roulette-item.bad { color: var(--ink-soft); opacity: 0.5; }
  .roulette-item.good { color: var(--lavender); }
  .roulette-msg { background: #F7F3ED; padding: 16px; border-radius: 12px; color: var(--ink); font-weight: 600; font-size: 15px; margin-top: 24px; animation: floatUp 0.4s ease; border-left: 4px solid var(--lavender); }

  /* MAIN RESOURCE CARDS */
  .mh-container { max-width: 1100px; margin: 0 auto; padding: 0 48px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
  .mh-card { background: white; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0,0,0,0.04); padding: 32px; transition: all 0.3s; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .mh-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); border-color: var(--lavender); }
  .mh-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; }
  @keyframes pulseRed { 0%{box-shadow:0 0 0 0 rgba(192,57,43,0.4)} 70%{box-shadow:0 0 0 15px rgba(192,57,43,0)} 100%{box-shadow:0 0 0 0 rgba(192,57,43,0)} }
  .mh-card.crisis { border: 2px solid #C0392B; background: #FFFDFD; animation: pulseRed 2.5s infinite; grid-column: 1 / -1; }
  .mh-card.crisis::before { background: linear-gradient(90deg, #C0392B, #E74C3C); }
  .mh-card.toolkit::before { background: linear-gradient(90deg, var(--sage), #87D09E); }
  .mh-card.wheel::before { background: linear-gradient(90deg, var(--lavender), #A89DD0); }
  .mh-card.control::before { background: linear-gradient(90deg, var(--sky), #89C4E0); }
  .mh-card.anxiety::before { background: linear-gradient(90deg, var(--peach), #F0A97A); }
  .mh-card.journal::before { background: linear-gradient(90deg, #C8982A, #E6B84A); }
  .mh-card.sleep::before { background: linear-gradient(90deg, #8B63C7, #B49AE8); }
  .mh-card.social::before { background: linear-gradient(90deg, #2E86C1, #5DADE2); }
  .mh-card.body::before { background: linear-gradient(90deg, #1E8449, #52BE80); }
  .mh-card.cognitive::before { background: linear-gradient(90deg, #6C3483, #9B59B6); }
  .mh-icon { font-size: 40px; margin-bottom: 16px; }
  .mh-crisis-label { color: #C0392B; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
  .mh-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 12px; line-height: 1.2; }
  .mh-desc { font-size: 15px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 24px; flex: 1; }
  .mh-meta { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .mh-badge { padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: var(--sand); color: var(--muted); }
  .mh-badge.time { background: #EAF4FA; color: #2980B9; border: 1px solid rgba(41,128,185,0.2); }
  .mh-badge.new { background: #E8F5E9; color: #2E7D32; border: 1px solid rgba(46,125,50,0.3); }
  .mh-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .mh-btn { padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-family: inherit; }
  .mh-btn-primary { background: var(--lavender); color: white; }
  .mh-btn-primary:hover { background: #655985; transform: translateY(-2px); }
  .mh-btn-outline { background: transparent; color: var(--ink); border: 2px solid var(--border); }
  .mh-btn-outline:hover { border-color: var(--lavender); color: var(--lavender); }
  .mh-btn-danger { background: #C0392B; color: white; }
  .mh-btn-danger:hover { background: #A93226; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(192,57,43,0.3); }

  /* STATS STRIP */
  .mh-stats { background: linear-gradient(135deg, #2A2438 0%, var(--ink) 100%); padding: 56px 48px; margin: 56px 0; }
  .mh-stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center; }
  .mh-stat-number { font-family: 'Fraunces', serif; font-size: 48px; font-weight: 700; color: #B3A4D6; line-height: 1; }
  .mh-stat-label { color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px; font-weight: 600; }
  .mh-stat-sub { color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 4px; }

  /* MODALS */
  .mh-modal-overlay { position: fixed; inset: 0; background: rgba(30,40,32,0.75); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .mh-modal { background: white; border-radius: 24px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 24px 56px rgba(0,0,0,0.25); animation: floatUp 0.3s ease; }
  .mh-modal-header { padding: 32px 32px 24px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: white; z-index: 10; display: flex; justify-content: space-between; align-items: flex-start; }
  .mh-modal-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 700; color: var(--ink); margin: 0; }
  .mh-modal-close { background: var(--sand); border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 16px; cursor: pointer; color: var(--muted); display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
  .mh-modal-close:hover { background: #EAE5DE; color: var(--ink); }
  .mh-modal-body { padding: 32px; }

  /* CRISIS MODAL */
  .crisis-search { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); font-family: inherit; font-size: 15px; margin-bottom: 20px; outline: none; }
  .crisis-search:focus { border-color: var(--lavender); box-shadow: 0 0 0 3px rgba(124,111,160,0.15); }
  .crisis-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
  .crisis-tab { padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; border: 2px solid var(--border); background: transparent; font-family: inherit; color: var(--ink-soft); transition: all 0.2s; }
  .crisis-tab.active { background: var(--lavender); color: white; border-color: var(--lavender); }
  .crisis-list { display: flex; flex-direction: column; gap: 12px; }
  .crisis-item { background: #FFF8F8; border: 1px solid rgba(192,57,43,0.15); padding: 20px; border-radius: 16px; }
  .crisis-item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
  .crisis-item h4 { margin: 0 0 4px 0; font-size: 17px; color: #C0392B; font-family: 'Fraunces', serif; }
  .crisis-item p { margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.5; }
  .crisis-tag { padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(192,57,43,0.1); color: #C0392B; white-space: nowrap; }
  .crisis-numbers { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .crisis-call-btn { background: #C0392B; color: white; text-decoration: none; padding: 9px 16px; border-radius: 50px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; transition: 0.2s; }
  .crisis-call-btn:hover { background: #A93226; }
  .crisis-whatsapp-btn { background: #25D366; color: white; text-decoration: none; padding: 9px 16px; border-radius: 50px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; transition: 0.2s; }
  .district-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
  .district-card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
  .district-card h5 { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .district-number { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .district-number:last-child { border-bottom: none; }

  /* JOURNAL MODAL */
  .journal-prompt { background: var(--sand); border-radius: 16px; padding: 20px; margin-bottom: 20px; font-size: 16px; font-style: italic; color: var(--ink); line-height: 1.7; border-left: 4px solid var(--gold); }
  .journal-textarea { width: 100%; min-height: 200px; padding: 16px; border-radius: 12px; border: 1px solid var(--border); font-family: inherit; font-size: 15px; line-height: 1.7; color: var(--ink); resize: vertical; outline: none; }
  .journal-textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(200,152,42,0.15); }
  .journal-prompts-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .journal-prompt-chip { padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); background: white; font-family: inherit; font-size: 13px; cursor: pointer; text-align: left; color: var(--ink-soft); transition: all 0.2s; line-height: 1.4; }
  .journal-prompt-chip:hover { border-color: var(--gold); color: var(--ink); background: #FFFDF5; }
  .journal-prompt-chip.selected { border-color: var(--gold); background: #FFF9E6; color: var(--ink); font-weight: 600; }
  .journal-moods { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
  .mood-btn { padding: 8px 16px; border-radius: 50px; border: 2px solid var(--border); background: white; cursor: pointer; font-family: inherit; font-size: 22px; transition: all 0.2s; }
  .mood-btn:hover { transform: scale(1.15); }
  .mood-btn.selected { border-color: var(--gold); background: #FFF9E6; transform: scale(1.15); }
  .journal-entries { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
  .journal-entry { background: var(--sand); border-radius: 12px; padding: 16px; font-size: 14px; color: var(--ink-soft); line-height: 1.6; position: relative; }
  .journal-entry-date { font-size: 11px; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }

  /* SLEEP MODAL */
  .sleep-section { margin-bottom: 32px; }
  .sleep-section h4 { font-family: 'Fraunces', serif; font-size: 20px; color: var(--ink); margin-bottom: 12px; }
  .sleep-tip { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: var(--sand); border-radius: 12px; margin-bottom: 10px; }
  .sleep-tip-icon { font-size: 24px; flex-shrink: 0; }
  .sleep-tip-text { font-size: 14px; color: var(--ink-soft); line-height: 1.6; }
  .sleep-tip-text strong { color: var(--ink); display: block; margin-bottom: 4px; }
  .sleep-tracker { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-top: 16px; }
  .sleep-day { background: var(--sand); border-radius: 8px; padding: 8px 4px; text-align: center; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
  .sleep-day:hover { border-color: #8B63C7; }
  .sleep-day.good { background: #E8F5E9; border-color: #4CAF50; }
  .sleep-day.ok { background: #FFF9E6; border-color: var(--gold); }
  .sleep-day.bad { background: #FEECEC; border-color: #E74C3C; }
  .sleep-day-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; }
  .sleep-day-icon { font-size: 18px; margin-top: 4px; }

  /* CBT MODAL */
  .cbt-step { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .cbt-step-num { width: 32px; height: 32px; border-radius: 50%; background: var(--lavender); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
  .cbt-step h4 { font-family: 'Fraunces', serif; font-size: 18px; color: var(--ink); margin-bottom: 8px; }
  .cbt-step p { font-size: 14px; color: var(--ink-soft); line-height: 1.6; }
  .cbt-textarea { width: 100%; min-height: 80px; padding: 12px; border-radius: 10px; border: 1px solid var(--border); font-family: inherit; font-size: 14px; resize: vertical; outline: none; margin-top: 12px; color: var(--ink); }
  .cbt-textarea:focus { border-color: var(--lavender); box-shadow: 0 0 0 3px rgba(124,111,160,0.15); }
  .cbt-distortions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .distortion-chip { padding: 6px 14px; border-radius: 50px; border: 1px solid var(--border); background: white; font-size: 12px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .distortion-chip:hover, .distortion-chip.sel { background: #F0ECF8; border-color: var(--lavender); color: var(--lavender); font-weight: 600; }

  /* GROUNDING / 54321 */
  .ground-step { padding: 24px; border-radius: 20px; border: 2px solid; margin-bottom: 16px; text-align: center; transition: all 0.3s; }
  .ground-num { font-family: 'Fraunces', serif; font-size: 60px; font-weight: 700; line-height: 1; margin-bottom: 8px; }
  .ground-label { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .ground-desc { font-size: 15px; opacity: 0.8; line-height: 1.5; }
  .ground-input { width: 100%; padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.2); font-family: inherit; font-size: 14px; color: white; margin-top: 12px; outline: none; }
  .ground-input::placeholder { color: rgba(255,255,255,0.6); }

  /* PROGRESSIVE MUSCLE RELAXATION */
  .pmr-step { padding: 20px 24px; border-radius: 16px; background: var(--sand); margin-bottom: 12px; display: flex; align-items: center; gap: 16px; }
  .pmr-icon { font-size: 32px; flex-shrink: 0; }
  .pmr-info h4 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .pmr-info p { font-size: 13px; color: var(--ink-soft); }
  .pmr-timer { background: var(--lavender); color: white; padding: 8px 16px; border-radius: 50px; font-weight: 700; font-size: 14px; cursor: pointer; border: none; font-family: inherit; flex-shrink: 0; }

  /* SOCIAL */
  .social-card { background: var(--sand); border-radius: 16px; padding: 20px; margin-bottom: 12px; }
  .social-card h4 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; font-family: 'Fraunces', serif; }
  .social-card p { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 12px; }
  .conversation-starter { padding: 10px 16px; background: white; border-radius: 10px; border: 1px solid var(--border); font-size: 14px; color: var(--ink); margin-bottom: 8px; font-style: italic; }
  
  /* AFFIRMATIONS */
  .affirmation-card { background: linear-gradient(135deg, #2A2438, var(--ink)); border-radius: 24px; padding: 48px 32px; text-align: center; margin-bottom: 24px; color: white; }
  .affirmation-text { font-family: 'Fraunces', serif; font-size: 28px; font-style: italic; line-height: 1.5; color: #E8E0F0; margin-bottom: 24px; }
  .affirmation-category { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #B3A4D6; margin-bottom: 16px; }

  /* MOOD TRACKER (inline) */
  .mood-tracker-inline { max-width: 700px; margin: 0 auto 48px; background: white; border-radius: 20px; padding: 32px; border: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
  .mood-scale { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 20px 0; }
  .mood-option { padding: 12px 16px; border-radius: 12px; border: 2px solid var(--border); background: white; cursor: pointer; font-family: inherit; font-size: 28px; transition: all 0.2s; text-align: center; }
  .mood-option:hover { transform: scale(1.15); }
  .mood-option.selected { transform: scale(1.2); border-color: var(--lavender); background: #F5F3FB; }
  .mood-word { font-size: 10px; font-weight: 700; color: var(--muted); display: block; margin-top: 4px; text-transform: uppercase; }
  .mood-history { display: flex; gap: 6px; margin-top: 16px; align-items: flex-end; height: 60px; }
  .mood-bar { flex: 1; border-radius: 4px 4px 0 0; transition: all 0.5s; min-height: 8px; }

  /* RETURN HOOK */
  .mh-return-hook { max-width: 800px; margin: 80px auto 0; padding: 48px; border-top: 1px solid var(--border); text-align: center; }
  .mh-return-hook h3 { font-family: 'Fraunces', serif; font-size: 28px; color: var(--ink); margin-bottom: 24px; }
  .mh-hook-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
  .mh-hook-link { background: white; border: 1px solid var(--border); padding: 12px 24px; border-radius: 50px; color: var(--ink); font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; }
  .mh-hook-link:hover { border-color: var(--lavender); color: var(--lavender); transform: translateY(-2px); }

  /* TOAST */
  .mh-toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--ink); color: white; padding: 16px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; z-index: 2000; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 12px 24px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 12px; }
  .mh-toast.visible { transform: translateX(-50%) translateY(0); opacity: 1; }
  .sticky-mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 16px 24px; box-shadow: 0 -4px 24px rgba(0,0,0,0.1); z-index: 1000; border-top: 1px solid var(--border); }
  .sticky-mobile-cta .mh-btn { width: 100%; padding: 16px; font-size: 16px; }
  
  /* WHEEL RELATED */
  .ew-container { display: flex; flex-direction: column; gap: 24px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes floatUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  @media(max-width: 768px) {
    .mh-hero { padding: 60px 24px 110px; }
    .mh-h1 { font-size: 30px; }
    .mh-container { padding: 0 20px; grid-template-columns: 1fr; }
    .mh-section-header { padding: 0 20px; }
    .mh-start-container { margin-top: -65px; }
    .mh-actions { flex-direction: column; width: 100%; }
    .mh-actions .mh-btn { width: 100%; }
    .mh-modal-header, .mh-modal-body { padding: 20px; }
    .mh-stats { padding: 40px 24px; }
    .sticky-mobile-cta { display: block; }
    .district-grid { grid-template-columns: 1fr; }
    .journal-prompts-list { grid-template-columns: 1fr; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NATIONAL_HELPLINES = [
  { name: "iCall (TISS)", desc: "Psychosocial support by trained counsellors. Free, confidential.", numbers: ["9152987821"], hours: "Mon–Sat, 8am–10pm", type: "General" },
  { name: "Kiran Helpline (Govt. of India)", desc: "24/7 free mental health rehabilitation helpline in 13 languages.", numbers: ["1800-599-0019"], hours: "24/7", type: "General", isTollfree: true },
  { name: "Vandrevala Foundation", desc: "Free 24/7 psychological counselling and emotional support.", numbers: ["9999-666-555"], hours: "24/7", type: "General" },
  { name: "Snehi", desc: "Suicide prevention and emotional support. Compassionate listening.", numbers: ["044-24640050", "044-24640060"], hours: "24/7", type: "Suicide Prevention" },
  { name: "Aasra", desc: "Crisis intervention and suicide prevention for those in distress.", numbers: ["9820466627", "9704030567"], hours: "24/7", type: "Suicide Prevention" },
  { name: "Parivarthan", desc: "Counselling, training & research on mental health (Bengaluru).", numbers: ["7676602602"], hours: "Mon–Sat, 8am–10pm", type: "Counselling" },
  { name: "iHelp", desc: "Online and phone mental health support platform.", numbers: ["9152987821"], hours: "Mon–Sat, 8am–10pm", type: "Counselling" },
  { name: "Sumaitri", desc: "Emotional support for those feeling low, depressed or suicidal.", numbers: ["011-23389090", "45450066"], hours: "Mon–Fri, 2pm–10pm", type: "Suicide Prevention" },
  { name: "Connecting Trust (Pune)", desc: "Emotional support and suicide prevention helpline.", numbers: ["9922001122"], hours: "Daily, 12pm–8pm", type: "Suicide Prevention" },
  { name: "Fortis StressHelpline", desc: "Mental health support from Fortis Healthcare.", numbers: ["8376804102"], hours: "Mon–Sat, 8am–8pm", type: "Counselling" },
  { name: "NIMHANS Bengaluru", desc: "National mental health institute — outpatient consultations.", numbers: ["080-46110007"], hours: "Mon–Sat, 9am–5pm", type: "Clinical" },
  { name: "National Emergency (Police)", desc: "Immediate police assistance and emergency response.", numbers: ["100", "112"], hours: "24/7", type: "Emergency", isTollfree: true },
];

const DISTRICT_HELPLINES = [
  { state: "Karnataka", districts: [
    { name: "Bengaluru Urban", numbers: [{ label: "Mental Health (NIMHANS)", num: "080-46110007" }, { label: "Police Control", num: "100 / 112" }, { label: "Samaritans Bangalore", num: "080-25497777" }] },
    { name: "Mysuru", numbers: [{ label: "District Hospital", num: "0821-2524265" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0821-2561121" }] },
    { name: "Mangaluru", numbers: [{ label: "Wenlock Hospital", num: "0824-2407000" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0824-2220016" }] },
    { name: "Hubli-Dharwad", numbers: [{ label: "KIMS Hospital", num: "0836-2370155" }, { label: "Police Control", num: "100" }, { label: "District Hospital", num: "0836-2366063" }] },
    { name: "Belagavi", numbers: [{ label: "District Hospital", num: "0831-2407000" }, { label: "Police Control", num: "100" }, { label: "BIMS Hospital", num: "0831-2491133" }] },
    { name: "Shivamogga", numbers: [{ label: "McGann Hospital", num: "08182-224430" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "08182-222022" }] },
  ]},
  { state: "Maharashtra", districts: [
    { name: "Mumbai", numbers: [{ label: "iCall Mumbai", num: "9152987821" }, { label: "Vandrevala Foundation", num: "9999-666-555" }, { label: "Police Control", num: "100" }] },
    { name: "Pune", numbers: [{ label: "Connecting Trust", num: "9922001122" }, { label: "Symbiosis Hospital", num: "020-67804444" }, { label: "Police Control", num: "100" }] },
    { name: "Nagpur", numbers: [{ label: "GMCH Mental Health", num: "0712-2702491" }, { label: "Police Control", num: "100" }, { label: "District Hospital", num: "0712-2520311" }] },
    { name: "Nashik", numbers: [{ label: "Mental Health Unit", num: "0253-2576777" }, { label: "Police Control", num: "100" }, { label: "District Hospital", num: "0253-2316666" }] },
    { name: "Aurangabad", numbers: [{ label: "Govt Medical College", num: "0240-2400816" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0240-2361000" }] },
    { name: "Thane", numbers: [{ label: "Regional Mental Hospital", num: "022-25380005" }, { label: "Police Control", num: "100" }, { label: "iCall", num: "9152987821" }] },
  ]},
  { state: "Tamil Nadu", districts: [
    { name: "Chennai", numbers: [{ label: "SNEHI Chennai", num: "044-24640050" }, { label: "SCARF", num: "044-26175072" }, { label: "Police Control", num: "100" }] },
    { name: "Coimbatore", numbers: [{ label: "PSG Hospital", num: "0422-4345678" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0422-2300551" }] },
    { name: "Madurai", numbers: [{ label: "Govt Rajaji Hospital", num: "0452-2532535" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0452-2535101" }] },
    { name: "Tiruchirappalli", numbers: [{ label: "MGMGH Hospital", num: "0431-2415000" }, { label: "Police Control", num: "100" }, { label: "District Hospital", num: "0431-2713022" }] },
    { name: "Salem", numbers: [{ label: "Govt Hospital Salem", num: "0427-2414404" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0427-2200000" }] },
    { name: "Tirunelveli", numbers: [{ label: "District HQ Hospital", num: "0462-2572031" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0462-2578800" }] },
  ]},
  { state: "Delhi NCR", districts: [
    { name: "New Delhi Central", numbers: [{ label: "Sumaitri", num: "011-23389090" }, { label: "iCall", num: "9152987821" }, { label: "Police Control", num: "100" }] },
    { name: "South Delhi", numbers: [{ label: "AIIMS Psychiatry", num: "011-26588500" }, { label: "Police South", num: "100" }, { label: "Fortis Stress Help", num: "8376804102" }] },
    { name: "North Delhi", numbers: [{ label: "GTB Hospital", num: "011-22588900" }, { label: "Police North", num: "100" }, { label: "District Mental Health", num: "011-22590956" }] },
    { name: "Noida (UP)", numbers: [{ label: "Kailash Hospital", num: "0120-4455555" }, { label: "Police Control", num: "112" }, { label: "District Hospital", num: "0120-2440700" }] },
    { name: "Gurugram (Haryana)", numbers: [{ label: "Civil Hospital", num: "0124-2321234" }, { label: "Police Control", num: "112" }, { label: "District Mental Health", num: "0124-2321456" }] },
    { name: "Faridabad (Haryana)", numbers: [{ label: "BK Hospital", num: "0129-2424323" }, { label: "Police Control", num: "112" }, { label: "District Hospital", num: "0129-2415555" }] },
  ]},
  { state: "West Bengal", districts: [
    { name: "Kolkata", numbers: [{ label: "Vandrevala Foundation", num: "9999-666-555" }, { label: "Lifeline Foundation", num: "033-24637401" }, { label: "Police Control", num: "100" }] },
    { name: "Howrah", numbers: [{ label: "District Hospital", num: "033-26386012" }, { label: "Police Control", num: "100" }, { label: "Mental Health Unit", num: "033-26389000" }] },
    { name: "North 24 Parganas", numbers: [{ label: "District Hospital", num: "033-25571040" }, { label: "Police Control", num: "100" }, { label: "Mental Health Support", num: "9999-666-555" }] },
    { name: "Burdwan", numbers: [{ label: "BMCH Hospital", num: "0342-2665002" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0342-2560011" }] },
  ]},
  { state: "Telangana & AP", districts: [
    { name: "Hyderabad", numbers: [{ label: "Vandrevala Foundation", num: "9999-666-555" }, { label: "NIMHANS Hyd", num: "040-23268014" }, { label: "Police Control", num: "100" }] },
    { name: "Cyberabad", numbers: [{ label: "Aware Global Hospital", num: "040-66300700" }, { label: "Police Control", num: "100" }, { label: "Cyberabad Mental Health", num: "040-27853035" }] },
    { name: "Visakhapatnam", numbers: [{ label: "KGH Hospital", num: "0891-2564888" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0891-2563000" }] },
    { name: "Vijayawada", numbers: [{ label: "GGH Hospital", num: "0866-2427540" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0866-2431200" }] },
  ]},
  { state: "Gujarat", districts: [
    { name: "Ahmedabad", numbers: [{ label: "iCall Gujarat", num: "9152987821" }, { label: "Civil Hospital", num: "079-22680000" }, { label: "Police Control", num: "100" }] },
    { name: "Surat", numbers: [{ label: "SMIMER Hospital", num: "0261-2244000" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0261-2421500" }] },
    { name: "Vadodara", numbers: [{ label: "SSG Hospital", num: "0265-2225454" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0265-2223040" }] },
    { name: "Rajkot", numbers: [{ label: "PDU Hospital", num: "0281-2444444" }, { label: "Police Control", num: "100" }, { label: "District Mental Health", num: "0281-2220300" }] },
  ]},
];

const ROULETTE_DATA = [
  { text: "Anxious", isGood: false }, { text: "Joyful", isGood: true, msg: "Your capacity for joy is beautiful. Savor this moment." },
  { text: "Overwhelmed", isGood: false }, { text: "Peaceful", isGood: true, msg: "Take a deep breath. Anchor into this peace." },
  { text: "Stressed", isGood: false }, { text: "Capable", isGood: true, msg: "You have survived 100% of your hard days. You've got this." },
  { text: "Insecure", isGood: false }, { text: "Loved", isGood: true, msg: "You are worthy of love and belonging, exactly as you are." },
  { text: "Frustrated", isGood: false }, { text: "Brave", isGood: true, msg: "Facing your feelings takes real courage. You are brave." },
  { text: "Hopeless", isGood: false }, { text: "Resilient", isGood: true, msg: "You bend, but you do not break. That is strength." },
  { text: "Lonely", isGood: false }, { text: "Connected", isGood: true, msg: "You are not alone. There are people who understand and care." },
  { text: "Empty", isGood: false }, { text: "Enough", isGood: true, msg: "You don't need to prove anything. You are enough." },
  { text: "Lost", isGood: false }, { text: "Grounded", isGood: true, msg: "Feel the earth beneath you. You are held and secure." },
];
const SPIN_MULTIPLIER = 4;
const TRACK_ITEMS = Array(SPIN_MULTIPLIER).fill(ROULETTE_DATA).flat();

const SECTORS = [
  { n:'ANGER', a0:240,a1:300, c:['#C02828','#D85555','#EDAAAA'], tc:'#7A1010', mtc:'#fff',
    m:[{n:'MAD',o:['FURIOUS','ENRAGED']},{n:'AGGRESSIVE',o:['PROVOKED','HOSTILE']},{n:'FRUSTRATED',o:['INFURIATED','IRRITATED']},{n:'DISTANT',o:['WITHDRAWN','SUSPICIOUS']},{n:'CRITICAL',o:['RESENTFUL','VIOLATED']},{n:'HATEFUL',o:['JEALOUS','INSECURE']},{n:'HURT',o:['THREATENED','HUMILIATED']}]},
  { n:'DISGUST', a0:300,a1:360, c:['#5830A0','#7D58C0','#B898DC'], tc:'#2C1268', mtc:'#fff',
    m:[{n:'DISAPPROVAL',o:['JUDGMENTAL','SARCASTIC']},{n:'DISAPPOINTED',o:['REPUGNANT','REVOLTED']},{n:'AWFUL',o:['DETESTABLE','REVULSION']},{n:'AVOIDANCE',o:['AVERSION','HESITANT']}]},
  { n:'SAD', a0:0,a1:60, c:['#2448A0','#4A70C0','#8AAADA'], tc:'#102460', mtc:'#fff',
    m:[{n:'GUILTY',o:['REMORSEFUL','ASHAMED']},{n:'ABANDONED',o:['IGNORED','VICTIMIZED']},{n:'DESPAIR',o:['POWERLESS','VULNERABLE']},{n:'DEPRESSED',o:['INFERIOR','EMPTY']},{n:'LONELY',o:['ISOLATED','APATHETIC']},{n:'BORED',o:['INDIFFERENT','LIFELESS']}]},
  { n:'HAPPY', a0:60,a1:120, c:['#8C7808','#B09820','#DCC850'], tc:'#3C3200', mtc:'#1A1200',
    m:[{n:'JOYFUL',o:['ECSTATIC','LIBERATED']},{n:'INTERESTED',o:['INQUISITIVE','AMUSED']},{n:'PROUD',o:['CONFIDENT','IMPORTANT']},{n:'ACCEPTED',o:['RESPECTED','FULFILLED']},{n:'POWERFUL',o:['COURAGEOUS','PROVOCATIVE']},{n:'PEACEFUL',o:['LOVING','HOPEFUL']},{n:'INTIMATE',o:['SENSITIVE','PLAYFUL']}]},
  { n:'SURPRISE', a0:120,a1:180, c:['#0A7C6C','#289888','#68C8C0'], tc:'#043C34', mtc:'#fff',
    m:[{n:'STARTLED',o:['SHOCKED','DISMAYED']},{n:'CONFUSED',o:['DISILLUSIONED','PERPLEXED']},{n:'AMAZED',o:['ASTONISHED','AWE']},{n:'EXCITED',o:['EAGER','ENERGETIC']}]},
  { n:'FEAR', a0:180,a1:240, c:['#185A24','#348444','#78B080'], tc:'#082E10', mtc:'#fff',
    m:[{n:'SCARED',o:['TERRIFIED','FRIGHTENED']},{n:'ANXIOUS',o:['OVERWHELMED','WORRIED']},{n:'INSECURE',o:['INADEQUATE','INFERIOR']},{n:'SUBMISSIVE',o:['WORTHLESS','INSIGNIFICANT']},{n:'REJECTED',o:['ALIENATED','DISRESPECTED']},{n:'HUMILIATED',o:['RIDICULED','EMBARRASSED']},{n:'THREATENED',o:['DEVASTATED','HELPLESS']}]},
];
const CX=255,CY=255,R1=72,R2=182,R3=252;
const rad = d => (d*Math.PI)/180;
function arcPath(r1,r2,a0,a1){
  const s=rad(a0),e=rad(a1),lg=a1-a0>180?1:0;
  const p=(rr,a)=>[CX+rr*Math.cos(a),CY+rr*Math.sin(a)];
  const[x1,y1]=p(r1,s),[x2,y2]=p(r2,s),[x3,y3]=p(r2,e),[x4,y4]=p(r1,e);
  const f=n=>n.toFixed(2);
  if(r1<1)return`M${CX},${CY}L${f(x2)},${f(y2)}A${r2},${r2},0,${lg},1,${f(x3)},${f(y3)}Z`;
  return`M${f(x1)},${f(y1)}L${f(x2)},${f(y2)}A${r2},${r2},0,${lg},1,${f(x3)},${f(y3)}L${f(x4)},${f(y4)}A${r1},${r1},0,${lg},0,${f(x1)},${f(y1)}Z`;
}
function textProps(r,midAngle,fontSize,fill,fw){
  const a=rad(midAngle),x=CX+r*Math.cos(a),y=CY+r*Math.sin(a);
  let rot=((midAngle%360)+360)%360;
  if(rot>90&&rot<270)rot-=180;
  return{x:x.toFixed(2),y:y.toFixed(2),fontSize,fill,fontWeight:fw,rot:rot.toFixed(1)};
}

const JOURNAL_PROMPTS = [
  "What made me feel anxious today, and what did I do about it?",
  "Three things I'm grateful for right now, however small.",
  "What would I tell a friend who was feeling the way I do?",
  "What does my body feel like right now? Where do I feel tension?",
  "What is one small step I can take tomorrow to feel better?",
  "Who in my life makes me feel safe, and why?",
  "What am I afraid of, and is that fear based in reality?",
  "If this moment were a weather pattern, what would it be?",
  "What have I survived that I'm proud of overcoming?",
  "What boundaries do I need to protect my energy right now?",
  "Write about a moment this week when you felt like yourself.",
  "What does 'enough' mean to me today?",
];

const AFFIRMATIONS = [
  { text: "I am allowed to take up space. My feelings are valid and deserve to be heard.", category: "Self-Worth" },
  { text: "I don't need to have everything figured out today. Uncertainty is not failure.", category: "Anxiety" },
  { text: "My worth is not measured by my marks, my productivity, or others' opinions of me.", category: "Academic Pressure" },
  { text: "I am more than my worst days. I am also my kindness, my curiosity, my courage.", category: "Self-Compassion" },
  { text: "It's okay to rest. Resting is how I recover. Recovery is how I grow.", category: "Burnout" },
  { text: "I am allowed to ask for help. Reaching out is strength, not weakness.", category: "Isolation" },
  { text: "This feeling will not last forever. I have felt this before and I came through.", category: "Overwhelm" },
  { text: "I am learning. Every mistake is data, not a verdict on my character.", category: "Growth" },
  { text: "I choose to be gentle with myself today, the same way I would be with someone I love.", category: "Self-Compassion" },
  { text: "The pressure I feel is real, but it does not define what I am capable of.", category: "Academic Pressure" },
];

const SLEEP_TIPS = [
  { icon: "📱", title: "Phone away 60 min before bed", desc: "Blue light suppresses melatonin. Switch to a physical book, light stretching, or journaling in the last hour." },
  { icon: "🧠", title: "Do a Brain Dump", desc: "Write every worry and to-do on paper before sleeping. This offloads the mental RAM that keeps you awake at night." },
  { icon: "🌡️", title: "Cool your room to 18–19°C", desc: "Your core body temperature needs to drop 1–2°C to fall asleep. A cooler room accelerates this." },
  { icon: "☕", title: "No caffeine after 2pm", desc: "Caffeine has a 5–6 hour half-life. Coffee at 3pm = half a cup of coffee at 9pm when you're trying to sleep." },
  { icon: "⏰", title: "Consistent wake time is #1", desc: "Going to sleep at the same time matters less than waking up at the same time. This sets your circadian clock." },
  { icon: "😮‍💨", title: "4-7-8 breathing to sleep faster", desc: "Inhale 4 seconds, hold 7 seconds, exhale 8 seconds. Activates the parasympathetic system and slows heart rate." },
  { icon: "📖", title: "Wind-down routine = sleep trigger", desc: "Reading, a warm shower, or 5 minutes of light stretching before bed signals to your brain that sleep is coming." },
];

const CBT_DISTORTIONS = [
  "All-or-Nothing Thinking", "Catastrophizing", "Mind Reading", "Fortune Telling",
  "Emotional Reasoning", "Should Statements", "Labelling", "Overgeneralisation",
  "Mental Filter", "Personalisation", "Magnification", "Discounting the Positive",
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function EmotionRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);
  const ITEM_HEIGHT = 80;

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true); setResultMsg(null);
    const finalBlockStart = (SPIN_MULTIPLIER-1)*ROULETTE_DATA.length;
    const goodIndices = [];
    for(let i=finalBlockStart;i<TRACK_ITEMS.length;i++) if(TRACK_ITEMS[i].isGood) goodIndices.push(i);
    const targetIndex = goodIndices[Math.floor(Math.random()*goodIndices.length)];
    const targetOffset = -(targetIndex*ITEM_HEIGHT);
    setOffset(0);
    if(trackRef.current) trackRef.current.style.transition='none';
    setTimeout(()=>{
      if(trackRef.current) trackRef.current.style.transition='transform 3.5s cubic-bezier(0.15,0.85,0.25,1)';
      setOffset(targetOffset);
      setTimeout(()=>{ setIsSpinning(false); setResultMsg(TRACK_ITEMS[targetIndex].msg); },3600);
    },50);
  };

  return (
    <div className="roulette-card">
      <h3 style={{fontFamily:"'Fraunces',serif",fontSize:'24px',color:'var(--ink)',marginBottom:'8px'}}>The Emotion Spinner</h3>
      <p style={{color:'var(--ink-soft)',fontSize:'15px'}}>Take a chance. See where you land.</p>
      <div className="roulette-window">
        <div className="roulette-track" ref={trackRef} style={{transform:`translateY(${offset}px)`}}>
          {TRACK_ITEMS.map((item,i)=>(
            <div key={i} className={`roulette-item ${item.isGood?'good':'bad'}`}>{item.text}</div>
          ))}
        </div>
      </div>
      <button className="mh-btn mh-btn-primary" onClick={spin} disabled={isSpinning} style={{padding:'14px 40px',fontSize:'16px'}}>
        {isSpinning?'Spinning...':'Spin the Wheel 🎯'}
      </button>
      {resultMsg && <div className="roulette-msg">✨ {resultMsg}</div>}
    </div>
  );
}

function Wheel({ selection, onSelect }) {
  const svgRef = useRef(null);
  const segments=[], labels=[];
  SECTORS.forEach((sec,si)=>{
    const mc=sec.m.length,ms=(sec.a1-sec.a0)/mc,os=ms/2,cMid=(sec.a0+sec.a1)/2;
    const isDimC=selection&&!(selection.si===si);
    segments.push(<path key={`c-${si}`} d={arcPath(0,R1,sec.a0,sec.a1)} fill={sec.c[0]} stroke="white" strokeWidth="2"
      style={{opacity:isDimC?0.12:1,cursor:'pointer',transition:'opacity .18s'}} onClick={()=>onSelect({si,type:'c'})}/>);
    const tp=textProps(R1*0.54,cMid,'11.5','white','700');
    labels.push(<text key={`ct-${si}`} x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
      fontSize={tp.fontSize} fontWeight={tp.fontWeight} fill={tp.fill}
      fontFamily="system-ui,sans-serif" pointerEvents="none"
      transform={`rotate(${tp.rot},${tp.x},${tp.y})`}>{sec.n}</text>);
    sec.m.forEach((m,mi)=>{
      const mS=sec.a0+mi*ms,mE=mS+ms,mMid=(mS+mE)/2;
      const isDimM=selection&&!(selection.si===si&&(selection.type==='c'||selection.mi===mi));
      segments.push(<path key={`m-${si}-${mi}`} d={arcPath(R1,R2,mS,mE)} fill={sec.c[1]} stroke="white" strokeWidth="1"
        style={{opacity:isDimM?0.1:1,cursor:'pointer',transition:'opacity .18s'}} onClick={()=>onSelect({si,type:'m',mi})}/>);
      const tp2=textProps((R1+R2)/2,mMid,'7.5',sec.mtc,'600');
      labels.push(<text key={`mt-${si}-${mi}`} x={tp2.x} y={tp2.y} textAnchor="middle" dominantBaseline="middle"
        fontSize={tp2.fontSize} fontWeight={tp2.fontWeight} fill={tp2.fill}
        fontFamily="system-ui,sans-serif" pointerEvents="none"
        transform={`rotate(${tp2.rot},${tp2.x},${tp2.y})`}>{m.n}</text>);
      m.o.forEach((o,oi)=>{
        const oS=mS+oi*os,oE=oS+os,oMid=(oS+oE)/2;
        const isDimO=selection&&!(selection.si===si&&selection.type==='c'||selection.si===si&&selection.mi===mi&&(selection.type==='m'||selection.oi===oi));
        segments.push(<path key={`o-${si}-${mi}-${oi}`} d={arcPath(R2,R3,oS,oE)} fill={sec.c[2]} stroke="white" strokeWidth="0.75"
          style={{opacity:isDimO?0.1:1,cursor:'pointer',transition:'opacity .18s'}} onClick={()=>onSelect({si,type:'o',mi,oi})}/>);
        const tp3=textProps((R2+R3)/2,oMid,'6.2',sec.tc,'500');
        labels.push(<text key={`ot-${si}-${mi}-${oi}`} x={tp3.x} y={tp3.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={tp3.fontSize} fontWeight={tp3.fontWeight} fill={tp3.fill}
          fontFamily="system-ui,sans-serif" pointerEvents="none"
          transform={`rotate(${tp3.rot},${tp3.x},${tp3.y})`}>{o}</text>);
      });
    });
  });
  return (
    <div style={{position:'relative',flexShrink:0}}>
      <svg ref={svgRef} viewBox="0 0 510 510"
        style={{width:'min(510px,100%)',height:'auto',display:'block',cursor:'pointer'}}
        onClick={e=>{if(!e.target.closest('path'))onSelect(null);}}>
        {segments}{labels}
        <circle cx="255" cy="255" r="8" fill="white" pointerEvents="none"/>
      </svg>
    </div>
  );
}

function InfoPanel({ selection, onSelect, onCalmClick }) {
  if(!selection) return (
    <div style={{textAlign:'center',padding:'20px 8px',color:'var(--muted)',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <div style={{fontSize:'36px',marginBottom:'14px'}}>🌀</div>
      <div style={{fontSize:'17px',fontWeight:'600',color:'var(--ink)',marginBottom:'10px'}}>Wheel of Emotions</div>
      <div style={{fontSize:'14px',lineHeight:'1.7',maxWidth:'220px',margin:'0 auto'}}>Click any segment to identify and explore what you are feeling</div>
      <div style={{fontSize:'12px',marginTop:'16px',color:'var(--muted)',lineHeight:'1.6',maxWidth:'220px',margin:'16px auto 0'}}>Start at the centre with a core emotion, then move outward for specificity</div>
    </div>
  );
  const {si,type,mi,oi}=selection, sec=SECTORS[si];
  const getName=()=>{if(type==='c')return sec.n;if(type==='m')return sec.m[mi].n;return sec.m[mi].o[oi];};
  const Chip=({label,color,text,onClick})=>(
    <button onClick={onClick} style={{padding:'5px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'600',background:color,color:text,border:'none',cursor:'pointer',fontFamily:'inherit',lineHeight:'1.4'}}>{label}</button>
  );
  const Bc=({label,color,onClick})=>(
    <span onClick={onClick} style={{color,fontWeight:'600',cursor:'pointer'}}>{label}</span>
  );
  const Sep=()=><span style={{opacity:.4,margin:'0 5px'}}>›</span>;
  const renderBreadcrumb=()=>{
    if(type==='c')return<Bc label={sec.n} color={sec.c[0]} onClick={()=>onSelect({si,type:'c'})}/>;
    if(type==='m')return<><Bc label={sec.n} color={sec.c[0]} onClick={()=>onSelect({si,type:'c'})}/><Sep/><span style={{fontWeight:'600',color:'var(--ink)'}}>{sec.m[mi].n}</span></>;
    return<><Bc label={sec.n} color={sec.c[0]} onClick={()=>onSelect({si,type:'c'})}/><Sep/><Bc label={sec.m[mi].n} color='var(--ink-soft)' onClick={()=>onSelect({si,type:'m',mi})}/><Sep/><span style={{fontWeight:'600',color:'var(--ink)'}}>{sec.m[mi].o[oi]}</span></>;
  };
  const renderRelated=()=>{
    if(type==='c')return(<><div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'.1em',color:'var(--muted)',marginBottom:'8px',fontWeight:'700'}}>Includes</div><div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{sec.m.map((m,i)=><Chip key={i} label={m.n} color={sec.c[1]+'28'} text={sec.c[0]} onClick={()=>onSelect({si,type:'m',mi:i})}/>)}</div></>);
    if(type==='m')return(<><div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'.1em',color:'var(--muted)',marginBottom:'8px',fontWeight:'700'}}>More specific</div><div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{sec.m[mi].o.map((o,i)=><Chip key={i} label={o} color={sec.c[2]} text={sec.tc} onClick={()=>onSelect({si,type:'o',mi,oi:i})}/>)}</div></>);
    const siblings=sec.m[mi].o.filter((_,i)=>i!==oi);
    if(!siblings.length)return null;
    return(<><div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'.1em',color:'var(--muted)',marginBottom:'8px',fontWeight:'700'}}>Also in this family</div><div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{siblings.map((o,i)=><Chip key={i} label={o} color={sec.c[2]} text={sec.tc} onClick={()=>{const newOi=sec.m[mi].o.indexOf(o);onSelect({si,type:'o',mi,oi:newOi});}}/>)}</div></>);
  };
  return (
    <div style={{background:'var(--warm-white)',border:`1.5px solid var(--border)`,borderLeft:`5px solid ${sec.c[0]}`,borderRadius:'16px',padding:'22px 20px',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <div style={{fontSize:'11px',lineHeight:'2',marginBottom:'10px'}}>{renderBreadcrumb()}</div>
      <div style={{fontSize:'30px',fontWeight:'700',color:'var(--ink)',marginBottom:'18px',fontFamily:"'Fraunces',serif"}}>{getName()}</div>
      {renderRelated()}
      {type==='o'&&onCalmClick&&(
        <button onClick={onCalmClick} style={{width:'100%',marginTop:'24px',padding:'14px',borderRadius:'8px',border:'none',background:'var(--lavender)',color:'white',cursor:'pointer',fontSize:'14px',fontWeight:'700',fontFamily:'inherit'}}>Help me calm this feeling →</button>
      )}
      <button onClick={()=>onSelect(null)} style={{width:'100%',marginTop:'8px',padding:'9px',borderRadius:'8px',border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontSize:'12px',fontFamily:'inherit'}}>← View full wheel</button>
    </div>
  );
}

function InteractiveEmotionWheel({ onCalmClick, onLogTool }) {
  const [selection, setSelection] = useState(null);
  const handleSelect = s => { setSelection(s); if(s&&s.type==='o') onLogTool('Emotion Wheel: '+SECTORS[s.si].m[s.mi].o[s.oi]); };
  return (
    <div style={{display:'flex',gap:'24px',flexWrap:'wrap',alignItems:'flex-start',padding:'8px 0'}}>
      <Wheel selection={selection} onSelect={handleSelect}/>
      <div style={{flex:1,minWidth:'280px'}}><InfoPanel selection={selection} onSelect={handleSelect} onCalmClick={onCalmClick}/></div>
    </div>
  );
}

// ─── CRISIS MODAL ─────────────────────────────────────────────────────────────
function CrisisModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('national');
  const [searchQ, setSearchQ] = useState('');
  const [activeState, setActiveState] = useState(DISTRICT_HELPLINES[0].state);

  const filteredNational = NATIONAL_HELPLINES.filter(h =>
    h.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    h.type.toLowerCase().includes(searchQ.toLowerCase()) ||
    h.numbers.some(n => n.includes(searchQ))
  );

  const currentStateData = DISTRICT_HELPLINES.find(d => d.state === activeState);

  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'760px'}}>
        <div className="mh-modal-header" style={{borderBottomColor:'rgba(192,57,43,0.2)'}}>
          <div>
            <h3 className="mh-modal-title" style={{color:'#C0392B'}}>🆘 National Crisis Directory</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>Free, verified, confidential helplines across India. You don't have to carry this alone.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          <div style={{background:'#FFF0F0',border:'1px solid rgba(192,57,43,0.2)',borderRadius:'12px',padding:'16px',marginBottom:'24px',fontSize:'14px',color:'#C0392B',lineHeight:'1.6',fontWeight:'600'}}>
            ⚠️ If you or someone you know is in immediate danger — call 112 (National Emergency) right now.
          </div>

          <input className="crisis-search" placeholder="Search by name, type, or number..."
            value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>

          <div className="crisis-tabs">
            {['national','district','online'].map(tab=>(
              <button key={tab} className={`crisis-tab ${activeTab===tab?'active':''}`} onClick={()=>setActiveTab(tab)}>
                {tab==='national'?'📞 National Helplines':tab==='district'?'📍 District-wise Contacts':'💬 Online Support'}
              </button>
            ))}
          </div>

          {activeTab === 'national' && (
            <div className="crisis-list">
              {filteredNational.map((h, i) => (
                <div className="crisis-item" key={i}>
                  <div className="crisis-item-header">
                    <div>
                      <h4>{h.name}</h4>
                      <p>{h.desc}</p>
                      <p style={{marginTop:'6px',fontSize:'12px',color:'var(--muted)',fontWeight:'600'}}>⏰ {h.hours}</p>
                    </div>
                    <span className="crisis-tag">{h.type}</span>
                  </div>
                  <div className="crisis-numbers">
                    {h.numbers.map((num,j)=>(
                      <a key={j} href={`tel:${num.replace(/[^0-9]/g,'')}`} className="crisis-call-btn">📞 {num}{h.isTollfree?' (Free)':''}</a>
                    ))}
                  </div>
                </div>
              ))}
              {filteredNational.length === 0 && (
                <p style={{textAlign:'center',color:'var(--muted)',padding:'24px'}}>No results for "{searchQ}". Try a different search term.</p>
              )}
            </div>
          )}

          {activeTab === 'district' && (
            <div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'20px'}}>
                {DISTRICT_HELPLINES.map(d=>(
                  <button key={d.state} onClick={()=>setActiveState(d.state)}
                    style={{padding:'8px 16px',borderRadius:'50px',fontFamily:'inherit',fontSize:'13px',fontWeight:'700',cursor:'pointer',border:'2px solid',
                      borderColor:activeState===d.state?'var(--lavender)':'var(--border)',
                      background:activeState===d.state?'var(--lavender)':'transparent',
                      color:activeState===d.state?'white':'var(--ink-soft)',transition:'all 0.2s'}}>
                    {d.state}
                  </button>
                ))}
              </div>
              <div className="district-grid">
                {currentStateData?.districts.map((district, i) => (
                  <div className="district-card" key={i}>
                    <h5>📍 {district.name}</h5>
                    {district.numbers.map((n, j) => (
                      <div className="district-number" key={j}>
                        <span style={{color:'var(--ink-soft)',fontSize:'12px'}}>{n.label}</span>
                        <a href={`tel:${n.num.replace(/[^0-9]/g,'')}`} style={{color:'#C0392B',fontWeight:'700',fontSize:'13px',textDecoration:'none'}}>{n.num}</a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p style={{marginTop:'20px',fontSize:'12px',color:'var(--muted)',lineHeight:'1.6',textAlign:'center'}}>
                Numbers verified to the best of our ability. If a number is unreachable, please call the national Kiran Helpline: 1800-599-0019 (free, 24/7).
              </p>
            </div>
          )}

          {activeTab === 'online' && (
            <div className="crisis-list">
              <div className="crisis-item">
                <div className="crisis-item-header">
                  <div><h4>iCall Email & Chat</h4><p>Reach trained counsellors via email for non-urgent support and therapy referrals.</p></div>
                  <span className="crisis-tag">Email</span>
                </div>
                <div className="crisis-numbers">
                  <a href="mailto:icall@tiss.edu" className="crisis-call-btn">✉️ icall@tiss.edu</a>
                </div>
              </div>
              <div className="crisis-item">
                <div className="crisis-item-header">
                  <div><h4>Vandrevala Foundation WhatsApp</h4><p>Text-based support available 24/7 via WhatsApp in multiple languages.</p></div>
                  <span className="crisis-tag">WhatsApp</span>
                </div>
                <div className="crisis-numbers">
                  <a href="https://wa.me/919999666555" className="crisis-whatsapp-btn" target="_blank" rel="noreferrer">💬 WhatsApp Chat</a>
                </div>
              </div>
              <div className="crisis-item">
                <div className="crisis-item-header">
                  <div><h4>YourDost (Online)</h4><p>Online counselling platform connecting you with professional counsellors, life coaches, and psychologists.</p></div>
                  <span className="crisis-tag">Platform</span>
                </div>
                <div className="crisis-numbers">
                  <a href="https://yourdost.com" className="crisis-call-btn" target="_blank" rel="noreferrer">🌐 yourdost.com</a>
                </div>
              </div>
              <div className="crisis-item">
                <div className="crisis-item-header">
                  <div><h4>Wysa (AI + Human Therapy)</h4><p>AI-assisted emotional wellbeing app with access to licensed therapists. Free tier available.</p></div>
                  <span className="crisis-tag">App</span>
                </div>
                <div className="crisis-numbers">
                  <a href="https://wysa.io" className="crisis-call-btn" target="_blank" rel="noreferrer">🌐 wysa.io</a>
                </div>
              </div>
            </div>
          )}

          <p style={{marginTop:'28px',fontSize:'13px',color:'var(--muted)',textAlign:'center',lineHeight:1.7,borderTop:'1px solid var(--border)',paddingTop:'20px'}}>
            Reaching out is one of the bravest things you can do. These professionals are trained to listen without judgment. You deserve support.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── JOURNAL MODAL ─────────────────────────────────────────────────────────────
function JournalModal({ onClose }) {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState(null);
  const [saved, setSaved] = useState([]);
  const [affirmIdx, setAffirmIdx] = useState(0);

  const MOODS = [
    {emoji:'😤',label:'Angry'},{emoji:'😢',label:'Sad'},{emoji:'😰',label:'Anxious'},
    {emoji:'😶',label:'Numb'},{emoji:'😐',label:'Okay'},{emoji:'🙂',label:'Good'},{emoji:'😄',label:'Great'},
  ];

  const saveEntry = () => {
    if(!entry.trim()) return;
    const newEntry = {
      text: entry, mood: mood || '📝', prompt: selectedPrompt,
      date: new Date().toLocaleDateString('en-IN', { day:'numeric',month:'short',year:'numeric' })
    };
    setSaved(prev => [newEntry, ...prev.slice(0,4)]);
    setEntry(''); setMood(null); setSelectedPrompt(null);
  };

  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'640px'}}>
        <div className="mh-modal-header">
          <div>
            <h3 className="mh-modal-title">📓 Guided Journal</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>Writing is thinking. Thinking is healing.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          {/* AFFIRMATION OF THE DAY */}
          <div className="affirmation-card">
            <div className="affirmation-category">{AFFIRMATIONS[affirmIdx].category}</div>
            <div className="affirmation-text">"{AFFIRMATIONS[affirmIdx].text}"</div>
            <button onClick={()=>setAffirmIdx(i=>(i+1)%AFFIRMATIONS.length)}
              style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'white',padding:'8px 20px',borderRadius:'50px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'13px'}}>
              Next Affirmation →
            </button>
          </div>

          {/* MOOD CHECK */}
          <p style={{fontWeight:'700',color:'var(--ink)',marginBottom:'12px',fontSize:'15px'}}>How are you feeling right now?</p>
          <div className="journal-moods">
            {MOODS.map((m,i)=>(
              <button key={i} className={`mood-btn ${mood===m.emoji?'selected':''}`} onClick={()=>setMood(m.emoji)} title={m.label}>{m.emoji}</button>
            ))}
          </div>

          {/* PROMPTS */}
          <p style={{fontWeight:'700',color:'var(--ink)',marginBottom:'12px',fontSize:'15px',marginTop:'8px'}}>Choose a writing prompt (optional):</p>
          <div className="journal-prompts-list">
            {JOURNAL_PROMPTS.slice(0,8).map((p,i)=>(
              <button key={i} className={`journal-prompt-chip ${selectedPrompt===p?'selected':''}`} onClick={()=>setSelectedPrompt(selectedPrompt===p?null:p)}>
                {p}
              </button>
            ))}
          </div>

          {/* WRITING AREA */}
          {selectedPrompt && <div className="journal-prompt">{selectedPrompt}</div>}
          <textarea className="journal-textarea" value={entry} onChange={e=>setEntry(e.target.value)}
            placeholder={selectedPrompt?"Write freely here — no right or wrong answers...":"Start writing anything that's on your mind..."}/>

          <div style={{display:'flex',gap:'12px',marginTop:'16px',flexWrap:'wrap'}}>
            <button className="mh-btn mh-btn-primary" onClick={saveEntry} style={{flex:1}}>Save Entry 💾</button>
            <button className="mh-btn mh-btn-outline" onClick={()=>{setEntry('');setMood(null);setSelectedPrompt(null);}}>Clear</button>
          </div>

          {/* SAVED ENTRIES */}
          {saved.length > 0 && (
            <div className="journal-entries">
              <p style={{fontWeight:'700',color:'var(--ink)',fontSize:'15px',marginBottom:'12px'}}>Recent Entries</p>
              {saved.map((e,i)=>(
                <div className="journal-entry" key={i}>
                  <div className="journal-entry-date">{e.mood} {e.date}</div>
                  {e.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SLEEP MODAL ─────────────────────────────────────────────────────────────
function SleepModal({ onClose }) {
  const DAYS = ['M','T','W','T','F','S','S'];
  const [sleepData, setSleepData] = useState(['','','','','','','']);
  const toggleSleep = (i, quality) => {
    setSleepData(prev => { const n=[...prev]; n[i]=n[i]===quality?'':quality; return n; });
  };
  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()}>
        <div className="mh-modal-header">
          <div>
            <h3 className="mh-modal-title">🌙 Sleep Hygiene Guide</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>Sleep is the foundation of all mental health.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          <div className="sleep-section">
            <h4>Weekly Sleep Tracker</h4>
            <p style={{color:'var(--ink-soft)',fontSize:'14px',marginBottom:'16px'}}>Tap each day to log your sleep quality this week.</p>
            <div className="sleep-tracker">
              {DAYS.map((d,i)=>(
                <div key={i}>
                  <div className={`sleep-day ${sleepData[i]}`} onClick={()=>toggleSleep(i,sleepData[i]==='good'?'ok':sleepData[i]==='ok'?'bad':'good')}>
                    <div className="sleep-day-label">{d}</div>
                    <div className="sleep-day-icon">{sleepData[i]==='good'?'😴':sleepData[i]==='ok'?'😐':sleepData[i]==='bad'?'😩':'⬜'}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{fontSize:'12px',color:'var(--muted)',marginTop:'8px',textAlign:'center'}}>Tap to cycle: Good → Okay → Poor. Tracking helps spot patterns.</p>
          </div>

          <div className="sleep-section">
            <h4>Evidence-Based Sleep Tips</h4>
            {SLEEP_TIPS.map((tip,i)=>(
              <div className="sleep-tip" key={i}>
                <div className="sleep-tip-icon">{tip.icon}</div>
                <div className="sleep-tip-text"><strong>{tip.title}</strong>{tip.desc}</div>
              </div>
            ))}
          </div>

          <div style={{background:'#EEF0F8',borderRadius:'16px',padding:'24px',textAlign:'center'}}>
            <h4 style={{fontFamily:"'Fraunces',serif",fontSize:'20px',color:'var(--ink)',marginBottom:'12px'}}>The Student Sleep Formula</h4>
            <p style={{color:'var(--ink-soft)',fontSize:'14px',lineHeight:'1.7'}}>
              <strong>Aim for 7–9 hours.</strong> Chronic sleep deprivation (less than 6 hours) reduces your ability to retain information by up to <strong>40%</strong>. Studying till 2am before an exam is almost always counterproductive. Sleep is when your brain consolidates memories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CBT MODAL ─────────────────────────────────────────────────────────────
function CBTModal({ onClose }) {
  const [thoughts, setThoughts] = useState(['','','']);
  const [selectedDistortions, setSelectedDistortions] = useState([]);
  const toggleDistortion = d => setSelectedDistortions(prev => prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);

  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'680px'}}>
        <div className="mh-modal-header">
          <div>
            <h3 className="mh-modal-title">🧠 Thought Record (CBT)</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>Cognitive Behavioural Therapy — change how you think, change how you feel.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          <div style={{background:'var(--sand)',borderRadius:'16px',padding:'20px',marginBottom:'28px'}}>
            <p style={{fontSize:'14px',color:'var(--ink-soft)',lineHeight:'1.7',margin:0}}>
              <strong style={{color:'var(--ink)'}}>How this works:</strong> Our automatic thoughts are often distorted — especially under stress. By writing them down, identifying the distortion, and challenging them, we can break the cycle of anxiety and hopelessness.
            </p>
          </div>

          <div className="cbt-step">
            <div className="cbt-step-num">1</div>
            <h4>The Situation</h4>
            <p>Describe what happened — just the facts, not your interpretation. Where were you? Who was there? What occurred?</p>
            <textarea className="cbt-textarea" value={thoughts[0]} onChange={e=>{const t=[...thoughts];t[0]=e.target.value;setThoughts(t);}} placeholder="e.g. I failed the mock test and my teacher commented on it in class..."/>
          </div>

          <div className="cbt-step">
            <div className="cbt-step-num">2</div>
            <h4>Your Automatic Thought</h4>
            <p>What is the exact thought running in your head? Write it exactly as you'd hear it — including the worst-case version.</p>
            <textarea className="cbt-textarea" value={thoughts[1]} onChange={e=>{const t=[...thoughts];t[1]=e.target.value;setThoughts(t);}} placeholder="e.g. I'm so stupid. Everyone thinks I'm a failure. I'll never pass my exams..."/>
          </div>

          <div className="cbt-step">
            <div className="cbt-step-num">3</div>
            <h4>Identify the Thinking Trap</h4>
            <p>Which of these cognitive distortions apply? (select all that fit)</p>
            <div className="cbt-distortions">
              {CBT_DISTORTIONS.map((d,i)=>(
                <button key={i} className={`distortion-chip ${selectedDistortions.includes(d)?'sel':''}`} onClick={()=>toggleDistortion(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="cbt-step">
            <div className="cbt-step-num">4</div>
            <h4>The Balanced Thought</h4>
            <p>If your best friend told you that thought, what would you say to them? Write a kinder, more realistic alternative.</p>
            <textarea className="cbt-textarea" value={thoughts[2]} onChange={e=>{const t=[...thoughts];t[2]=e.target.value;setThoughts(t);}} placeholder="e.g. I didn't do well on this one test. That's disappointing, but one test doesn't define my intelligence or my future..."/>
          </div>

          {thoughts[2].length > 20 && (
            <div style={{background:'#E8F5E9',borderRadius:'16px',padding:'24px',borderLeft:'4px solid #4CAF50',animation:'fadeIn 0.4s ease'}}>
              <p style={{margin:0,fontWeight:'700',color:'#2E7D32',fontSize:'16px'}}>✅ Well done.</p>
              <p style={{margin:'8px 0 0',color:'var(--ink-soft)',fontSize:'14px',lineHeight:'1.7'}}>You just completed a full CBT thought record. Do this regularly — ideally daily — and you'll start to notice the patterns in your thinking. The distortions become easier to spot and challenge over time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GROUNDING MODAL ─────────────────────────────────────────────────────────
function GroundingModal({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [inputs, setInputs] = useState(['','','','','']);
  const STEPS = [
    {num:5,sense:'See',color:'#5B9EBF',bg:'#EAF4FA',border:'#5B9EBF',desc:'Look around. Name 5 things you can see right now.',placeholder:'e.g. the ceiling fan, a blue notebook...'},
    {num:4,sense:'Touch',color:'#7C6FA0',bg:'#F5F0FF',border:'#7C6FA0',desc:'Focus on touch. Name 4 things you can physically feel.',placeholder:'e.g. the floor under my feet, the fabric of my shirt...'},
    {num:3,sense:'Hear',color:'#4A7C59',bg:'#E8F5E9',border:'#4A7C59',desc:'Listen carefully. Name 3 sounds you can hear.',placeholder:'e.g. traffic outside, a fan humming...'},
    {num:2,sense:'Smell',color:'#C8982A',bg:'#FFF9E6',border:'#C8982A',desc:'Take a deep breath. Name 2 things you can smell.',placeholder:'e.g. coffee, fresh air...'},
    {num:1,sense:'Taste',color:'#E8845A',bg:'#FFF5EF',border:'#E8845A',desc:'Notice your mouth. Name 1 thing you can taste.',placeholder:'e.g. toothpaste, water...'},
  ];
  const s = STEPS[activeStep];
  const allFilled = inputs.slice(0,s.num).every(v=>v.trim().length>0);
  const updateInput=(i,val)=>{ const arr=[...inputs]; arr[i]=val; setInputs(arr); };

  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()}>
        <div className="mh-modal-header">
          <div>
            <h3 className="mh-modal-title">🌱 5-4-3-2-1 Grounding</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>This technique interrupts anxiety by anchoring you to the present moment.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          {/* PROGRESS */}
          <div style={{display:'flex',gap:'8px',marginBottom:'28px'}}>
            {STEPS.map((step,i)=>(
              <div key={i} onClick={()=>setActiveStep(i)} style={{flex:1,height:'6px',borderRadius:'3px',cursor:'pointer',transition:'all 0.3s',
                background:i<activeStep?'#4CAF50':i===activeStep?s.color:'var(--border)'}}/>
            ))}
          </div>

          <div className="ground-step" style={{borderColor:s.border,background:s.bg}}>
            <div className="ground-num" style={{color:s.color}}>{s.num}</div>
            <div className="ground-label" style={{color:s.color}}>Things you can {s.sense.toLowerCase()}</div>
            <div className="ground-desc" style={{color:'var(--ink-soft)'}}>{s.desc}</div>
            {Array.from({length:s.num}).map((_,i)=>(
              <input key={i} className="ground-input" value={inputs[i]} onChange={e=>updateInput(i,e.target.value)}
                placeholder={i===0?s.placeholder:`${s.sense} #${i+1}...`}
                style={{background:'rgba(255,255,255,0.6)',color:'var(--ink)',borderColor:'rgba(0,0,0,0.1)',marginTop:'10px',borderRadius:'10px',width:'100%',padding:'10px 16px',fontFamily:'inherit',fontSize:'14px',outline:'none'}}/>
            ))}
          </div>

          <div style={{display:'flex',gap:'12px',marginTop:'20px'}}>
            {activeStep>0 && <button className="mh-btn mh-btn-outline" onClick={()=>setActiveStep(i=>i-1)}>← Back</button>}
            {activeStep<STEPS.length-1 && (
              <button className="mh-btn mh-btn-primary" onClick={()=>{setActiveStep(i=>i+1);setInputs(['','','','','']);}} style={{flex:1}}>
                Next: {s.num-1} things you can {STEPS[activeStep+1].sense.toLowerCase()} →
              </button>
            )}
            {activeStep===STEPS.length-1 && (
              <div style={{flex:1,background:'#E8F5E9',borderRadius:'16px',padding:'20px',textAlign:'center'}}>
                <p style={{fontWeight:'700',color:'#2E7D32',fontSize:'16px',margin:'0 0 8px'}}>✅ Grounding complete.</p>
                <p style={{color:'var(--ink-soft)',fontSize:'14px',margin:0}}>You just brought your nervous system back to the present moment. Take one more slow breath.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AFFIRMATIONS MODAL ─────────────────────────────────────────────────────
function AffirmationsModal({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liked, setLiked] = useState([]);
  const [filterCat, setFilterCat] = useState('All');
  const cats = ['All', ...new Set(AFFIRMATIONS.map(a=>a.category))];
  const filtered = filterCat==='All' ? AFFIRMATIONS : AFFIRMATIONS.filter(a=>a.category===filterCat);
  const current = filtered[currentIdx % filtered.length];

  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()}>
        <div className="mh-modal-header">
          <div>
            <h3 className="mh-modal-title">💜 Daily Affirmations</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>Words that remind you of who you actually are.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'24px'}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>{setFilterCat(c);setCurrentIdx(0);}}
                style={{padding:'6px 14px',borderRadius:'50px',fontFamily:'inherit',fontSize:'13px',fontWeight:'700',cursor:'pointer',border:'2px solid',transition:'all 0.2s',
                  borderColor:filterCat===c?'var(--lavender)':'var(--border)',
                  background:filterCat===c?'var(--lavender)':'transparent',
                  color:filterCat===c?'white':'var(--ink-soft)'}}>
                {c}
              </button>
            ))}
          </div>

          <div className="affirmation-card" style={{padding:'48px 32px 40px',position:'relative'}}>
            <div className="affirmation-category">{current.category}</div>
            <div className="affirmation-text" style={{fontSize:'clamp(20px,3vw,26px)'}}>"<br/>{current.text}<br/>"</div>
            <button onClick={()=>setLiked(l=>l.includes(currentIdx)?l.filter(x=>x!==currentIdx):[...l,currentIdx])}
              style={{position:'absolute',top:'20px',right:'20px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'50%',width:'36px',height:'36px',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {liked.includes(currentIdx)?'❤️':'🤍'}
            </button>
          </div>

          <div style={{display:'flex',gap:'12px',justifyContent:'center',marginTop:'20px'}}>
            <button className="mh-btn mh-btn-outline" onClick={()=>setCurrentIdx(i=>(i-1+filtered.length)%filtered.length)}>← Previous</button>
            <button className="mh-btn mh-btn-primary" onClick={()=>setCurrentIdx(i=>(i+1)%filtered.length)}>Next Affirmation →</button>
          </div>

          <div style={{marginTop:'28px',padding:'20px',background:'var(--sand)',borderRadius:'16px'}}>
            <p style={{fontWeight:'700',color:'var(--ink)',marginBottom:'8px',fontSize:'15px'}}>How to use affirmations effectively:</p>
            <ul style={{color:'var(--ink-soft)',fontSize:'14px',lineHeight:'2',paddingLeft:'20px'}}>
              <li>Say them out loud — the act of hearing your own voice matters</li>
              <li>Don't try to believe them immediately; just read them daily</li>
              <li>Pick one that resonates and write it somewhere visible</li>
              <li>Pair them with a calming ritual (morning coffee, before bed)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PMR MODAL ─────────────────────────────────────────────────────────────
function PMRModal({ onClose }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const PMR_STEPS = [
    { icon:'🤜', group:'Hands & Forearms', tense:'Clench both fists as tight as you can', release:'Now release completely. Feel the warmth and heaviness.', seconds:7 },
    { icon:'💪', group:'Biceps', tense:'Tense your biceps by flexing hard, arms at sides', release:'Let them fall loose. Notice the difference.', seconds:7 },
    { icon:'👤', group:'Shoulders & Neck', tense:'Shrug your shoulders up to your ears as hard as you can', release:'Drop them completely. Roll neck gently.', seconds:7 },
    { icon:'😬', group:'Face', tense:'Scrunch your entire face — forehead, eyes, cheeks, jaw', release:'Let it all go. Feel the smoothness.', seconds:7 },
    { icon:'🫁', group:'Chest', tense:'Take a deep breath and hold it while tensing chest', release:'Exhale slowly. Let chest soften.', seconds:7 },
    { icon:'🤸', group:'Abdomen', tense:'Pull your stomach in as tight as possible', release:'Release and breathe naturally.', seconds:7 },
    { icon:'🦵', group:'Thighs', tense:'Tense both thigh muscles hard, pressing legs together', release:'Let them go soft and heavy.', seconds:7 },
    { icon:'🦶', group:'Calves & Feet', tense:'Flex feet toward you, tense calves hard', release:'Release. Let feet fall naturally.', seconds:7 },
  ];

  const startTimer = (i) => {
    setActiveStep(i);
    setTimeLeft(PMR_STEPS[i].seconds);
    if(timer) clearInterval(timer);
    const t = setInterval(()=>{
      setTimeLeft(prev=>{
        if(prev<=1) { clearInterval(t); setTimer(null); return 0; }
        return prev-1;
      });
    },1000);
    setTimer(t);
  };

  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()}>
        <div className="mh-modal-header">
          <div>
            <h3 className="mh-modal-title">💆 Progressive Muscle Relaxation</h3>
            <p style={{margin:'8px 0 0',fontSize:'14px',color:'var(--muted)'}}>Systematically release tension stored in your body. Total time: ~10 minutes.</p>
          </div>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body">
          <div style={{background:'var(--sand)',borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
            <p style={{fontSize:'14px',color:'var(--ink-soft)',lineHeight:'1.7',margin:0}}>
              <strong style={{color:'var(--ink)'}}>How to do it:</strong> For each muscle group, tense as hard as you can for 7 seconds, then release completely for 30 seconds. Pay attention to the contrast between tension and relaxation.
            </p>
          </div>
          {PMR_STEPS.map((step,i)=>(
            <div className="pmr-step" key={i} style={{background:activeStep===i?'#F0ECF8':'var(--sand)',borderLeft:activeStep===i?'4px solid var(--lavender)':'4px solid transparent'}}>
              <div className="pmr-icon">{step.icon}</div>
              <div className="pmr-info" style={{flex:1}}>
                <h4>{step.group}</h4>
                <p style={{marginBottom:'4px'}}><strong>Tense:</strong> {step.tense}</p>
                {activeStep===i && timeLeft===0 && <p style={{color:'#4CAF50',fontWeight:'700'}}>Release: {step.release}</p>}
                {activeStep===i && timeLeft>0 && <p style={{color:'var(--lavender)',fontWeight:'700'}}>Hold for {timeLeft}s...</p>}
              </div>
              <button className="pmr-timer" onClick={()=>startTimer(i)}>
                {activeStep===i&&timeLeft>0?`${timeLeft}s`:'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EXAM MODAL ─────────────────────────────────────────────────────────────
function ExamModal({ onClose }) {
  return (
    <div className="mh-modal-overlay" onClick={onClose}>
      <div className="mh-modal" onClick={e=>e.stopPropagation()}>
        <div className="mh-modal-header">
          <h3 className="mh-modal-title">⚡ Exam Survival Guide</h3>
          <button className="mh-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mh-modal-body" style={{color:'var(--ink-soft)',lineHeight:1.7,fontSize:'15px'}}>
          {[
            {title:"The Night Before: Brain Dump", content:"Stop studying 60 minutes before bed. Write every formula, fear, and worry on blank paper. This offloads cognitive load so you can actually sleep. Put the paper face-down. It'll be there in the morning."},
            {title:"Morning of the Exam: Regulate, Don't Cram", content:"Eating a real breakfast matters — glucose is fuel for your prefrontal cortex. A 10-minute walk before the exam increases blood flow to the brain by up to 20%. Don't look at new material. Trust what you've already learned."},
            {title:"In the Exam: The 30-Second Reset", content:"If you freeze, flip the paper face-down. Do 5-4-3-2-1 grounding (name 5 things you can see). Breathe: 4 counts in, hold 4, exhale 6. You have the time. Regulate your nervous system first, then turn the paper back over."},
            {title:"If You Go Blank: The Body-Scan Technique", content:"Unclench your jaw. Drop your shoulders. Relax your hands. Our bodies hold exam panic in muscle tension, which reduces blood flow to the brain. A physical release can help mental clarity return."},
            {title:"The Truth About Marks and Self-Worth", content:"An exam measures how well you retained specific information on a specific day, under specific conditions. It does not measure your intelligence, your capability to succeed in life, or your worth as a human being. This result is data — not an identity."},
            {title:"After the Exam: Don't Post-Mortem", content:"Reviewing every answer you got wrong immediately after an exam is harmful, not productive. The exam is done. The results will come. What you need now is rest, nourishment, and compassion — not an autopsy."},
          ].map((section,i)=>(
            <div key={i} style={{marginBottom:'28px'}}>
              <h4 style={{fontFamily:"'Fraunces',serif",fontSize:'20px',color:'var(--ink)',marginBottom:'10px'}}>{i+1}. {section.title}</h4>
              <p style={{margin:0}}>{section.content}</p>
            </div>
          ))}
          <div style={{background:'var(--sand)',padding:'20px',borderRadius:'12px',textAlign:'center',borderLeft:'4px solid var(--peach)'}}>
            <p style={{margin:0,fontWeight:700,color:'var(--ink)',fontSize:'16px'}}>Download the full 3-page PDF guide with printable worksheets and study schedules.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INLINE MOOD TRACKER ─────────────────────────────────────────────────────
function InlineMoodTracker() {
  const MOODS = [
    {emoji:'😤',label:'Angry',color:'#E74C3C',val:1},
    {emoji:'😢',label:'Sad',color:'#3498DB',val:2},
    {emoji:'😰',label:'Anxious',color:'#9B59B6',val:3},
    {emoji:'😐',label:'Meh',color:'#95A5A6',val:4},
    {emoji:'🙂',label:'Okay',color:'#F39C12',val:5},
    {emoji:'😊',label:'Good',color:'#2ECC71',val:6},
    {emoji:'😄',label:'Great',color:'#1ABC9C',val:7},
  ];
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([5,4,6,3,5,7,4]);

  const handleSelect = (m) => {
    setSelected(m);
    setHistory(prev=>[...prev.slice(1), m.val]);
  };

  return (
    <div className="mood-tracker-inline">
      <h3 style={{fontFamily:"'Fraunces',serif",fontSize:'24px',color:'var(--ink)',marginBottom:'8px',textAlign:'center'}}>Daily Mood Check-In</h3>
      <p style={{color:'var(--muted)',textAlign:'center',fontSize:'15px',marginBottom:'4px'}}>How are you feeling right now? (No wrong answers.)</p>
      <div className="mood-scale">
        {MOODS.map((m,i)=>(
          <button key={i} className={`mood-option ${selected?.label===m.label?'selected':''}`} onClick={()=>handleSelect(m)}>
            {m.emoji}
            <span className="mood-word">{m.label}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{textAlign:'center',padding:'16px',background:'var(--sand)',borderRadius:'12px',marginBottom:'16px',animation:'fadeIn 0.3s ease'}}>
          <p style={{margin:0,fontWeight:'600',color:'var(--ink)',fontSize:'15px'}}>
            {selected.val <= 2 ? "Thank you for checking in. Things feel hard right now — that's okay. Try the Quick Calm above." :
             selected.val <= 4 ? "You're getting through it. That matters. Maybe try the journal or emotion wheel today." :
             "You're doing well today! Keep noticing these moments — they're worth remembering."}
          </p>
        </div>
      )}
      {/* Mini mood history bar */}
      <div>
        <p style={{fontSize:'12px',color:'var(--muted)',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>Your 7-day mood pattern</p>
        <div className="mood-history">
          {history.map((v,i)=>{
            const m = MOODS.find(x=>x.val===v)||MOODS[4];
            return <div key={i} className="mood-bar" style={{background:m.color,height:`${(v/7)*56}px`,opacity:i===history.length-1?1:0.5}} title={m.label}/>;
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MindSpace({ navigate, onBack }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isQuickCalmActive, setQuickCalmActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale (4s)");
  const [lastUsedTool, setLastUsedTool] = useState(null);

  const streakMessages = [
    "Day 1: You showed up. That's already something.",
    "Day 2: You're building a habit of self-care.",
    "Day 3: You're taking control of your mental health. Keep going.",
    "Day 5: One week streak! Your brain notices consistency. 🌿",
  ];
  const [streakDay] = useState(Math.floor(Math.random() * 4));

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    const saved = localStorage.getItem('mh-last-used');
    if(saved) setLastUsedTool(saved);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(()=>{ window.scrollTo(0,0); },[]);

  useEffect(()=>{
    let interval;
    if(isQuickCalmActive) {
      const cycle=()=>{
        setBreathingPhase("Inhale (4s)");
        setTimeout(()=>setBreathingPhase("Hold (7s)"),4000);
        setTimeout(()=>setBreathingPhase("Exhale (8s)"),11000);
      };
      cycle(); interval=setInterval(cycle,19000);
    }
    return ()=>clearInterval(interval);
  },[isQuickCalmActive]);

  const logTool = useCallback((toolName) => {
    localStorage.setItem('mh-last-used', toolName);
    setLastUsedTool(toolName);
  }, []);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(()=>setToastMessage(""),4500);
  }, []);

  const openModal = useCallback((id, toolName) => {
    if(toolName) logTool(toolName);
    setActiveModal(id);
  }, [logTool]);

  const closeModal = useCallback(()=>setActiveModal(null), []);

  const startQuickCalm = useCallback(()=>{
    closeModal();
    setQuickCalmActive(true);
    logTool('Quick Calm Breathing');
    triggerToast("Focus on the circle. Breathe with it.");
    setTimeout(()=>window.scrollBy({top:300,behavior:'smooth'}),100);
  },[closeModal,logTool,triggerToast]);

  const RESOURCES = [
    {
      id:"crisis", title:"I need help right now", cls:"crisis", icon:"🆘",
      badges:["Emergency","24/7 Support","District Numbers"], timeBadge:"⏱ Immediate",
      desc:"Verified Indian mental health helplines including district-wise emergency contacts across Karnataka, Maharashtra, Tamil Nadu, Delhi, West Bengal, Telangana and Gujarat. Online support options included.",
      action1:{ text:"View All Helplines", isDanger:true, onClick:()=>openModal('crisis','Crisis Helplines') },
      isUrgent:true
    },
    {
      id:"grounding", title:"I feel anxious and overwhelmed", cls:"toolkit", icon:"🧘🏽",
      badges:["Interactive","5-4-3-2-1 Technique"], timeBadge:"⏱ 3 min",
      desc:"An interactive step-by-step guided grounding exercise. The 5-4-3-2-1 technique anchors you back into the present moment using all five senses — clinically proven for panic and anxiety.",
      action1:{ text:"Start Guided Exercise", onClick:()=>openModal('grounding','5-4-3-2-1 Grounding') },
      action2:{ text:"Download Toolkit PDF", link:"/resources/mh/Grounding_Toolkit.pdf" },
    },
    {
      id:"emotion-wheel", title:"I don't know what I'm feeling", cls:"wheel", icon:"🎯",
      badges:["Interactive","Emotion Vocabulary"], timeBadge:"⏱ 5 min",
      desc:"Stop saying 'I feel bad.' Use this interactive wheel to find the specific word — overwhelmed, insecure, burnt out, disconnected. Naming it is the first step to changing it.",
      action1:{ text:"Open Emotion Wheel", onClick:()=>openModal('wheel','Emotion Wheel') },
      action2:{ text:"Download PDF", link:"/resources/mh/Emotion_Wheel.pdf" },
    },
    {
      id:"journal", title:"I need to process my thoughts", cls:"journal", icon:"📓",
      badges:["Interactive","CBT-Inspired","NEW"], timeBadge:"⏱ 10 min", isNew:true,
      desc:"A guided digital journal with 12 therapeutic prompts, a mood tracker, daily affirmations, and saved entries. Writing your thoughts externalises them — making them smaller and more manageable.",
      action1:{ text:"Open Journal", onClick:()=>openModal('journal','Guided Journal') },
    },
    {
      id:"cbt", title:"I'm stuck in negative thought loops", cls:"cognitive", icon:"🧠",
      badges:["CBT Tool","Interactive","NEW"], timeBadge:"⏱ 10 min", isNew:true,
      desc:"A step-by-step Cognitive Behavioural Therapy thought record. Identify the situation, catch the automatic thought, spot the cognitive distortion, and rewrite a balanced alternative.",
      action1:{ text:"Start Thought Record", onClick:()=>openModal('cbt','CBT Thought Record') },
      action2:{ text:"Download Worksheet", link:"/resources/mh/CBT_Worksheet.pdf" },
    },
    {
      id:"control", title:"I feel out of control", cls:"control", icon:"⭕",
      badges:["Worksheet","Circle of Control"], timeBadge:"⏱ 10 min",
      desc:"A tactical worksheet to map anxieties into what you can and cannot control. Physically letting go of things outside your control — like exam difficulty or others' opinions — creates immediate relief.",
      action1:{ text:"Download Worksheet", link:"/resources/mh/Control_Worksheet.pdf" },
    },
    {
      id:"sleep", title:"I can't sleep / I'm always exhausted", cls:"sleep", icon:"🌙",
      badges:["Sleep Guide","Weekly Tracker","NEW"], timeBadge:"⏱ 7 min", isNew:true,
      desc:"7 evidence-based sleep hygiene tips with a weekly sleep quality tracker. Chronic sleep deprivation reduces memory retention by up to 40%. Fixing sleep fixes nearly everything else.",
      action1:{ text:"Open Sleep Guide", onClick:()=>openModal('sleep','Sleep Hygiene Guide') },
    },
    {
      id:"pmr", title:"My body feels tense and wound up", cls:"body", icon:"💆",
      badges:["Body-Based","Timed Exercise","NEW"], timeBadge:"⏱ 10 min", isNew:true,
      desc:"Progressive Muscle Relaxation: systematically tense and release 8 muscle groups to break the physical cycle of anxiety. With built-in timers for each muscle group.",
      action1:{ text:"Start PMR Session", onClick:()=>openModal('pmr','Progressive Muscle Relaxation') },
    },
    {
      id:"exam-survival", title:"I'm panicking about my exams", cls:"anxiety", icon:"⚡",
      badges:["3-Page Guide","Student-Specific"], timeBadge:"⏱ 5 min",
      desc:"How to handle a panic attack during a test, how to actually sleep the night before, and how to separate your self-worth from your marks. Built for Indian students under real academic pressure.",
      action1:{ text:"Read Survival Guide", onClick:()=>openModal('exam','Exam Survival Guide') },
      action2:{ text:"Download PDF", link:"/resources/mh/Exam_Survival.pdf" },
    },
    {
      id:"affirmations", title:"I need to hear something kind", cls:"social", icon:"💜",
      badges:["Affirmations","Daily Practice","NEW"], timeBadge:"⏱ 2 min", isNew:true,
      desc:"10 clinically-grounded affirmations organised by theme — anxiety, self-worth, academic pressure, burnout. Learn how to use them in a way that actually works (not toxic positivity).",
      action1:{ text:"Open Affirmations", onClick:()=>openModal('affirmations','Daily Affirmations') },
    },
  ];

  return (
    <>
      <div className="mh-page">
        <div className="mh-streak-banner">{streakMessages[streakDay]}</div>

        <div className="mh-topbar">
          <button className="mh-back" onClick={onBack||(() => navigate&&navigate("/dashboard"))}>← Back to Dashboard</button>
          <div className="mh-topbar-title">Mind Space</div>
          <div/>
        </div>

        {/* HERO */}
        <section className="mh-hero">
          <div className="mh-hero-inner">
            {lastUsedTool && (
              <div className="mh-memory-badge" onClick={()=>triggerToast(`Picking up where you left off: ${lastUsedTool}`)}>
                <span>↺</span> Welcome back. Continue: {lastUsedTool}?
              </div>
            )}
            <div className="mh-eyebrow">Emotional First Aid for Students</div>
            <h1 className="mh-h1">Feeling overwhelmed right now?<br/><em>Let's slow it down together.</em></h1>
            <p className="mh-sub">You don't need to fix everything today. Just get through the next few minutes. We'll do it together.</p>
          </div>
        </section>

        {/* QUICK START */}
        <div className="mh-start-container">
          <div className="mh-start-box">
            <h3>Not sure where to start?</h3>
            <p>If you're overwhelmed right now, choose a path below.</p>
            <div className="mh-start-actions">
              <button className="mh-btn mh-btn-primary" onClick={startQuickCalm}>⚡ Calm me now (30 sec)</button>
              <button className="mh-btn mh-btn-outline" onClick={()=>openModal('wheel','Emotion Wheel')}>🧠 Help me understand what I feel</button>
            </div>
          </div>
        </div>

        {/* BREATHING */}
        <div className={`quick-calm-inline ${isQuickCalmActive?'active':''}`} style={{padding:'36px',maxWidth:'700px',margin:'0 auto 40px'}}>
          <h3 style={{fontFamily:"'Fraunces',serif",fontSize:'24px',color:'var(--ink)'}}>4-7-8 Breathing</h3>
          <p style={{color:'var(--ink-soft)',marginBottom:'8px'}}>Follow the expanding circle. Let your breath guide you back.</p>
          <div className={`breathing-circle ${isQuickCalmActive?'animating':''}`}>{breathingPhase}</div>
          <p style={{color:'var(--ink-soft)',fontSize:'14px',marginBottom:'20px'}}>This activates your parasympathetic nervous system — your body's built-in calm switch.</p>
          <button className="mh-btn mh-btn-outline" onClick={()=>setQuickCalmActive(false)}>Close Breathing</button>
        </div>

        {/* VALIDATION */}
        <div className="mh-validation">
          About 1 in 5 students in India experience significant mental health challenges.
          <strong>You are not alone, and this is not weakness.</strong>
          Coming here and trying — that's the hardest step. You've already done it.
          <div className="mh-human-touch">
            <span>💚</span> Built with counsellors and researchers who understand what this feels like.
          </div>
        </div>

        {/* MOOD TRACKER */}
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 48px'}}>
          <div className="mh-section-header" style={{padding:'0 0 28px'}}>
            <div className="mh-section-label">Check In</div>
            <div className="mh-section-title">How are you feeling today?</div>
          </div>
          <InlineMoodTracker/>
        </div>

        {/* STATS */}
        <div className="mh-stats">
          <div className="mh-stats-inner">
            <div><div className="mh-stat-number">1 in 5</div><div className="mh-stat-label">Students experience significant anxiety</div><div className="mh-stat-sub">NIMHANS National Survey, 2023</div></div>
            <div><div className="mh-stat-number">76%</div><div className="mh-stat-label">Don't seek help due to stigma</div><div className="mh-stat-sub">WHO India Mental Health Report</div></div>
            <div><div className="mh-stat-number">7 min</div><div className="mh-stat-label">Average time to access most tools here</div><div className="mh-stat-sub">Designed for busy students</div></div>
            <div><div className="mh-stat-number">100%</div><div className="mh-stat-label">Free, anonymous, no signup needed</div><div className="mh-stat-sub">Secretsharz.com commitment</div></div>
          </div>
        </div>

        {/* EMOTION ROULETTE */}
        <div style={{maxWidth:'1100px',margin:'0 auto 16px',padding:'0 48px'}}>
          <div className="mh-section-header" style={{padding:'0 0 28px'}}>
            <div className="mh-section-label">Quick Tool</div>
            <div className="mh-section-title">The Emotion Spinner</div>
          </div>
        </div>
        <div style={{padding:'0 48px'}}>
          <EmotionRoulette/>
        </div>

        {/* MAIN TOOLS */}
        <div style={{maxWidth:'1100px',margin:'48px auto 0',padding:'0 48px'}}>
          <div className="mh-section-header" style={{padding:'0 0 28px'}}>
            <div className="mh-section-label">10 Evidence-Based Tools</div>
            <div className="mh-section-title">Your Mental Health First Aid Kit</div>
          </div>
        </div>

        <section className="mh-container">
          {RESOURCES.map(res=>(
            <div key={res.id} className={`mh-card ${res.cls}`}>
              {res.isUrgent&&<span className="mh-crisis-label">⚠️ Need Immediate Help?</span>}
              <div className="mh-icon">{res.icon}</div>
              <h3 className="mh-title">{res.title}</h3>
              <div className="mh-meta">
                <span className="mh-badge time">{res.timeBadge}</span>
                {res.badges.map(b=><span key={b} className={`mh-badge ${b==='NEW'?'new':''}`}>{b}</span>)}
              </div>
              <p className="mh-desc">{res.desc}</p>
              <div className="mh-actions">
                {res.action1.link ? (
                  <a href={res.action1.link} download className={`mh-btn ${res.action1.isDanger?'mh-btn-danger':'mh-btn-primary'}`} target="_blank" rel="noreferrer" onClick={()=>{triggerToast("You're doing the right thing.");logTool(res.title);}}>
                    {res.action1.text}
                  </a>
                ) : (
                  <button onClick={()=>{res.action1.onClick();}} className={`mh-btn ${res.action1.isDanger?'mh-btn-danger':'mh-btn-primary'}`}>
                    {res.action1.text}
                  </button>
                )}
                {res.action2&&(
                  <a href={res.action2.link} download className="mh-btn mh-btn-outline" target="_blank" rel="noreferrer">{res.action2.text}</a>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* EDUCATIONAL SECTION */}
        <div style={{maxWidth:'1100px',margin:'80px auto 0',padding:'0 48px'}}>
          <div className="mh-section-header" style={{padding:'0 0 28px'}}>
            <div className="mh-section-label">Know the Signs</div>
            <div className="mh-section-title">Understanding what you're going through</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'20px'}}>
            {[
              {title:"What is Anxiety?",icon:"😰",points:["Racing thoughts or constant worry","Physical symptoms: racing heart, sweating, tight chest","Avoidance of situations that trigger fear","Difficulty concentrating or sleeping","Feeling on edge or irritable most days"]},
              {title:"What is Burnout?",icon:"🔋",points:["Emotional and physical exhaustion","Cynicism or detachment from things you used to care about","Reduced effectiveness even when trying hard","Feeling like nothing you do matters","Loss of motivation and sense of purpose"]},
              {title:"What is Depression?",icon:"🌧️",points:["Persistent low mood lasting more than 2 weeks","Loss of interest in activities you enjoyed","Changes in sleep — too much or too little","Feeling worthless or hopeless","Difficulty with concentration and decision-making"]},
              {title:"What is a Panic Attack?",icon:"⚡",points:["Sudden intense fear or discomfort","Heart pounding, shortness of breath","Dizziness, trembling, sweating","Fear of losing control or dying","Usually peaks within 10 minutes — it will pass"]},
            ].map((card,i)=>(
              <div key={i} style={{background:'white',borderRadius:'20px',padding:'28px',border:'1px solid var(--border)'}}>
                <div style={{fontSize:'32px',marginBottom:'12px'}}>{card.icon}</div>
                <h3 style={{fontFamily:"'Fraunces',serif",fontSize:'20px',color:'var(--ink)',marginBottom:'16px'}}>{card.title}</h3>
                <ul style={{paddingLeft:'20px',listStyle:'disc'}}>
                  {card.points.map((p,j)=><li key={j} style={{color:'var(--ink-soft)',fontSize:'14px',lineHeight:'1.8',marginBottom:'4px'}}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{background:'var(--sand)',borderRadius:'20px',padding:'32px',marginTop:'24px',borderLeft:'4px solid var(--lavender)'}}>
            <h3 style={{fontFamily:"'Fraunces',serif",fontSize:'22px',color:'var(--ink)',marginBottom:'12px'}}>⚠️ When to See a Professional</h3>
            <p style={{color:'var(--ink-soft)',fontSize:'15px',lineHeight:'1.8',margin:0}}>
              The tools on this page are designed for <strong>self-help support</strong>. They are not a replacement for professional care. Please consider speaking to a counsellor, psychologist, or psychiatrist if: your symptoms have lasted more than 2 weeks, they're significantly affecting your studies, relationships, or daily functioning, you're having thoughts of harming yourself or others, or you feel like nothing is helping. <strong>Seeking help is not giving up — it's the most strategic thing you can do for yourself.</strong>
            </p>
          </div>
        </div>

        {/* RETURN HOOK */}
        <div className="mh-return-hook">
          <h3>Want to go deeper?</h3>
          <div className="mh-hook-links">
            <button className="mh-hook-link" onClick={()=>navigate&&navigate('/wall')}>→ Share anonymously</button>
            <button className="mh-hook-link" onClick={()=>navigate&&navigate('/dashboard')}>→ Track your emotions</button>
            <button className="mh-hook-link" onClick={()=>navigate&&navigate('/vidyavantage')}>→ Discover your career path</button>
            <button className="mh-hook-link" onClick={()=>openModal('journal','Guided Journal')}>→ Write in your journal</button>
            <button className="mh-hook-link" onClick={()=>openModal('crisis','Crisis Helplines')}>→ Find a counsellor near you</button>
          </div>
        </div>

        <div style={{textAlign:'center',padding:'48px 24px',color:'var(--muted)',fontSize:'15px',lineHeight:'2'}}>
          Before you go — take one deep breath with me.<br/>
          <strong style={{color:'var(--ink)'}}>You are going to be okay.</strong><br/>
          <span style={{fontSize:'13px'}}>secretsharz.com · Mind Space · Built with care for Indian students</span>
        </div>
      </div>

      {/* STICKY CTA */}
      <div className="sticky-mobile-cta">
        <button className="mh-btn mh-btn-primary" onClick={startQuickCalm}>Need help right now? → Calm me</button>
      </div>

      {/* TOAST */}
      <div className={`mh-toast ${toastMessage?'visible':''}`}>
        <span>💚</span> {toastMessage}
      </div>

      {/* MODALS */}
      {activeModal==='crisis'&&<CrisisModal onClose={closeModal}/>}
      {activeModal==='journal'&&<JournalModal onClose={closeModal}/>}
      {activeModal==='sleep'&&<SleepModal onClose={closeModal}/>}
      {activeModal==='cbt'&&<CBTModal onClose={closeModal}/>}
      {activeModal==='grounding'&&<GroundingModal onClose={closeModal}/>}
      {activeModal==='affirmations'&&<AffirmationsModal onClose={closeModal}/>}
      {activeModal==='pmr'&&<PMRModal onClose={closeModal}/>}
      {activeModal==='exam'&&<ExamModal onClose={closeModal}/>}
      {activeModal==='wheel'&&(
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:'850px'}}>
            <div className="mh-modal-header">
              <h3 className="mh-modal-title">The Emotion Wheel</h3>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body">
              <InteractiveEmotionWheel onCalmClick={startQuickCalm} onLogTool={logTool}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
