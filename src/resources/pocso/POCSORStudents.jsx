/**
 * POCSO: Know Your Rights — Student Safety Handbook
 * src/resources/pocso/children/POCSORStudents.jsx
 *
 * Covers:
 *  - Primary     (Class 1–5,  ages 6–10)
 *  - Upper Primary (Class 6–8, ages 11–13)
 *  - Secondary   (Class 9–12, ages 14–17)
 *
 * Features:
 *  - Print-to-PDF via browser @media print
 *  - PowerPoint export via pptxgenjs (npm install pptxgenjs)
 *  - Interactive knowledge-check quiz per age group
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import pptxgen from 'pptxgenjs'; // npm install pptxgenjs

// ── CSS ─────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  /* ── Screen Layout ── */
  .pocso-page { min-height: 100vh; background: var(--warm-white, #FDFCFA); padding-bottom: 80px; font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Top Bar ── */
  .pocso-topbar { background: #1E2820; color: white; padding: 0 40px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 200; border-bottom: 3px solid #4A7C59; }
  .pocso-back-btn { display: flex; align-items: center; gap: 6px; color: #6FAA80; font-size: 13px; font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .pocso-back-btn:hover { color: white; }
  .pocso-topbar-title { font-family: 'Fraunces', serif; font-size: 16px; color: white; font-weight: 600; }
  .pocso-topbar-actions { display: flex; gap: 8px; }
  .pocso-action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s; white-space: nowrap; }
  .pocso-print-btn { background: rgba(192,57,43,0.15); color: #E74C3C; border: 1px solid rgba(192,57,43,0.3); }
  .pocso-print-btn:hover { background: #E74C3C; color: white; }
  .pocso-ppt-btn { background: rgba(230,126,34,0.15); color: #E67E22; border: 1px solid rgba(230,126,34,0.3); }
  .pocso-ppt-btn:hover { background: #E67E22; color: white; }
  .pocso-ppt-btn:disabled { opacity: 0.5; cursor: wait; }

  /* ── Hero ── */
  .pocso-hero { background: linear-gradient(135deg, #1E2820 0%, #2D5240 60%, #3D6B54 100%); padding: 56px 48px 48px; color: white; }
  .pocso-hero-inner { max-width: 900px; margin: 0 auto; display: flex; gap: 48px; align-items: flex-start; flex-wrap: wrap; }
  .pocso-hero-icon { font-size: 80px; flex-shrink: 0; line-height: 1; }
  .pocso-hero-text h1 { font-family: 'Fraunces', serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 10px; }
  .pocso-hero-text p { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.75; max-width: 520px; margin-bottom: 24px; }
  .pocso-hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
  .pocso-hero-tag { padding: 6px 14px; border-radius: 50px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); }
  .pocso-legal-note { max-width: 900px; margin: 0 auto; padding: 14px 18px; background: rgba(255,255,255,0.07); border-radius: 10px; border-left: 3px solid rgba(111,170,128,0.6); font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.6; margin-top: 20px; }

  /* ── Age Group Tabs ── */
  .pocso-tabs-wrap { background: white; border-bottom: 2px solid rgba(30,40,32,0.08); padding: 0 48px; position: sticky; top: 56px; z-index: 150; box-shadow: 0 4px 16px rgba(30,40,32,0.06); }
  .pocso-tabs { max-width: 900px; margin: 0 auto; display: flex; gap: 0; }
  .pocso-tab { padding: 18px 28px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; background: none; font-family: inherit; color: #7A8A7D; border-bottom: 3px solid transparent; transition: all 0.2s; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
  .pocso-tab:hover { color: #1E2820; background: rgba(30,40,32,0.02); }
  .pocso-tab.active { color: #2D5240; border-bottom-color: #4A7C59; }
  .pocso-tab-sub { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #7A8A7D; }
  .pocso-tab.active .pocso-tab-sub { color: #4A7C59; }

  /* ── Content Layout ── */
  .pocso-content { max-width: 900px; margin: 0 auto; padding: 40px 48px; }
  .pocso-handbook-intro { background: linear-gradient(135deg, #EBF4EE, #E8F5EE); border-radius: 16px; padding: 24px 28px; margin-bottom: 36px; border: 1px solid rgba(74,124,89,0.2); display: flex; gap: 16px; align-items: flex-start; }
  .pocso-intro-icon { font-size: 32px; flex-shrink: 0; }
  .pocso-intro-text h3 { font-family: 'Fraunces', serif; font-size: 18px; color: #2D5240; margin-bottom: 6px; }
  .pocso-intro-text p { font-size: 14px; color: #3D4A40; line-height: 1.7; margin: 0; }

  /* ── Section Cards ── */
  .pocso-section { background: white; border-radius: 18px; border: 1.5px solid rgba(30,40,32,0.1); margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 12px rgba(30,40,32,0.05); }
  .pocso-section-header { padding: 20px 26px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: background 0.2s; }
  .pocso-section-header:hover { background: rgba(30,40,32,0.02); }
  .pocso-section-icon { font-size: 28px; flex-shrink: 0; }
  .pocso-section-title-block { flex: 1; }
  .pocso-section-num { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #4A7C59; margin-bottom: 2px; }
  .pocso-section-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: #1E2820; }
  .pocso-section-chevron { font-size: 16px; color: #7A8A7D; transition: transform 0.25s; flex-shrink: 0; }
  .pocso-section.open .pocso-section-chevron { transform: rotate(90deg); }
  .pocso-section-body { padding: 0 26px 24px; border-top: 1px solid rgba(30,40,32,0.07); animation: pocsoFadeIn 0.3s ease; }
  @keyframes pocsoFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Content Blocks (used inside sections) ── */
  .pocso-body-text { font-size: 15px; color: #3D4A40; line-height: 1.8; margin: 16px 0 0; }
  .pocso-key-box { background: #EBF4EE; border-radius: 12px; padding: 16px 20px; margin: 16px 0; border-left: 4px solid #4A7C59; }
  .pocso-key-box h4 { font-family: 'Fraunces', serif; font-size: 16px; color: #2D5240; margin: 0 0 8px; }
  .pocso-key-box p, .pocso-key-box li { font-size: 14px; color: #3D4A40; line-height: 1.7; }
  .pocso-key-box ul { padding-left: 18px; margin: 6px 0 0; }
  .pocso-warn-box { background: #FDF0EA; border-radius: 12px; padding: 16px 20px; margin: 16px 0; border-left: 4px solid #E8845A; }
  .pocso-warn-box h4 { font-family: 'Fraunces', serif; font-size: 15px; color: #C0392B; margin: 0 0 6px; }
  .pocso-warn-box p { font-size: 14px; color: #3D4A40; line-height: 1.7; margin: 0; }
  .pocso-info-box { background: #EAF4FA; border-radius: 12px; padding: 16px 20px; margin: 16px 0; border-left: 4px solid #5B9EBF; }
  .pocso-info-box h4 { font-family: 'Fraunces', serif; font-size: 15px; color: #2980B9; margin: 0 0 6px; }
  .pocso-info-box p, .pocso-info-box li { font-size: 14px; color: #3D4A40; line-height: 1.7; margin: 0; }
  .pocso-info-box ul { padding-left: 18px; margin: 6px 0 0; }
  .pocso-steps { counter-reset: step; list-style: none; padding: 0; margin: 14px 0 0; }
  .pocso-steps li { counter-increment: step; display: flex; gap: 14px; align-items: flex-start; padding: 12px 16px; border-radius: 10px; margin-bottom: 8px; background: rgba(30,40,32,0.02); border: 1px solid rgba(30,40,32,0.06); font-size: 14px; color: #3D4A40; line-height: 1.6; }
  .pocso-steps li::before { content: counter(step); width: 26px; height: 26px; border-radius: 50%; background: #4A7C59; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content:: center; flex-shrink: 0; justify-content: center; line-height: 1; margin-top: 1px; }
  .pocso-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0; }
  .pocso-col-good { background: #D1FAE5; border-radius: 12px; padding: 16px; }
  .pocso-col-bad  { background: #FEE2E2; border-radius: 12px; padding: 16px; }
  .pocso-col-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .pocso-col-good .pocso-col-title { color: #065F46; }
  .pocso-col-bad  .pocso-col-title { color: #991B1B; }
  .pocso-col-list { list-style: none; padding: 0; margin: 0; }
  .pocso-col-good .pocso-col-list li { font-size: 13px; color: #1F2937; padding: 4px 0; display: flex; gap: 6px; }
  .pocso-col-bad  .pocso-col-list li { font-size: 13px; color: #1F2937; padding: 4px 0; display: flex; gap: 6px; }
  .pocso-col-good .pocso-col-list li::before { content: '✓'; color: #059669; font-weight: 700; }
  .pocso-col-bad  .pocso-col-list li::before { content: '✗'; color: #DC2626; font-weight: 700; }
  .pocso-myths-table { width: 100%; border-collapse: collapse; margin: 14px 0; border-radius: 10px; overflow: hidden; font-size: 13px; }
  .pocso-myths-table th { background: #2D5240; color: white; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .pocso-myths-table td { padding: 11px 14px; border-bottom: 1px solid rgba(30,40,32,0.07); color: #3D4A40; line-height: 1.55; vertical-align: top; }
  .pocso-myths-table tr:nth-child(even) td { background: rgba(30,40,32,0.02); }
  .pocso-myths-table .myth-label { color: #C0392B; font-weight: 700; font-size: 11px; }
  .pocso-myths-table .fact-label { color: #27AE60; font-weight: 700; font-size: 11px; }
  .pocso-glossary-list { list-style: none; padding: 0; margin: 14px 0 0; }
  .pocso-glossary-list li { padding: 10px 14px; border-radius: 10px; margin-bottom: 7px; background: rgba(30,40,32,0.03); border: 1px solid rgba(30,40,32,0.07); font-size: 14px; color: #3D4A40; line-height: 1.6; }
  .pocso-glossary-list li strong { color: #2D5240; font-weight: 700; }

  /* Safe adults fill-in section */
  .pocso-fill-in { background: #FDF6EC; border: 2px dashed #E8845A; border-radius: 14px; padding: 20px 24px; margin: 16px 0; }
  .pocso-fill-in h4 { font-family: 'Fraunces', serif; font-size: 16px; color: #C0392B; margin: 0 0 14px; }
  .pocso-fill-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #3D4A40; }
  .pocso-fill-num { width: 24px; height: 24px; border-radius: 50%; background: #E8845A; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pocso-fill-line { flex: 1; height: 1px; background: rgba(30,40,32,0.2); border: none; border-bottom: 2px dotted rgba(30,40,32,0.2); }
  .pocso-helpline-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin: 14px 0; }
  .pocso-helpline-card { background: #2D5240; border-radius: 14px; padding: 18px 20px; color: white; }
  .pocso-helpline-card h4 { font-family: 'Fraunces', serif; font-size: 15px; margin: 0 0 4px; }
  .pocso-helpline-card .num { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 700; color: #6FAA80; margin: 8px 0 4px; display: block; }
  .pocso-helpline-card .avail { font-size: 11px; color: rgba(255,255,255,0.6); }
  .pocso-helpline-card.childline { background: linear-gradient(135deg, #C0392B, #922B21); }
  .pocso-helpline-card.childline .num { color: #F9E0E0; }
  .pocso-helpline-emergency { background: #C0392B; border-radius: 14px; padding: 18px 20px; margin-top: 12px; display: flex; align-items: center; gap: 16px; }
  .pocso-helpline-emergency h4 { font-size: 16px; color: white; margin: 0 0 3px; font-family: 'Fraunces', serif; }
  .pocso-helpline-emergency p { font-size: 12px; color: rgba(255,255,255,0.7); margin: 0; }
  .pocso-helpline-emergency .big-num { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 700; color: white; line-height: 1; margin-right: 8px; }

  /* ── Quiz ── */
  .pocso-quiz-wrap { background: white; border-radius: 20px; border: 1.5px solid rgba(30,40,32,0.1); margin-top: 40px; overflow: hidden; box-shadow: 0 3px 14px rgba(30,40,32,0.06); }
  .pocso-quiz-header { background: linear-gradient(135deg, #2D5240, #4A7C59); padding: 24px 28px; color: white; }
  .pocso-quiz-header h3 { font-family: 'Fraunces', serif; font-size: 22px; margin: 0 0 4px; }
  .pocso-quiz-header p { font-size: 13px; color: rgba(255,255,255,0.7); margin: 0; }
  .pocso-quiz-body { padding: 24px 28px; }
  .pocso-quiz-progress { height: 4px; background: rgba(30,40,32,0.08); border-radius: 2px; margin-bottom: 24px; overflow: hidden; }
  .pocso-quiz-progress-fill { height: 100%; background: #4A7C59; border-radius: 2px; transition: width 0.4s ease; }
  .pocso-quiz-q-num { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #4A7C59; margin-bottom: 8px; }
  .pocso-quiz-question { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: #1E2820; line-height: 1.4; margin-bottom: 20px; animation: pocsoFadeIn 0.3s ease; }
  .pocso-quiz-options { display: flex; flex-direction: column; gap: 9px; }
  .pocso-quiz-opt { padding: 13px 16px; border: 2px solid rgba(30,40,32,0.12); border-radius: 12px; background: white; font-size: 14px; font-weight: 600; color: #3D4A40; cursor: pointer; text-align: left; font-family: inherit; transition: all 0.18s; display: flex; align-items: center; gap: 10px; }
  .pocso-quiz-opt:hover:not(:disabled) { border-color: #4A7C59; background: #EBF4EE; color: #2D5240; }
  .pocso-quiz-opt:disabled { cursor: default; }
  .pocso-quiz-opt.correct { border-color: #27AE60; background: #D5F5E3; color: #1E8449; }
  .pocso-quiz-opt.wrong { border-color: #C0392B; background: #FADBD8; color: #922B21; }
  .pocso-quiz-opt.neutral { border-color: #27AE60; background: #D5F5E3; color: #1E8449; opacity: 0.55; }
  .pocso-quiz-opt-icon { font-size: 15px; flex-shrink: 0; }
  .pocso-quiz-reveal { background: #EBF4EE; border-radius: 12px; padding: 14px 18px; margin-top: 14px; animation: pocsoFadeIn 0.3s ease; border-left: 4px solid #4A7C59; font-size: 14px; color: #2D5240; line-height: 1.7; }
  .pocso-quiz-reveal strong { display: block; margin-bottom: 4px; font-family: 'Fraunces', serif; font-size: 16px; }
  .pocso-quiz-next-btn { margin-top: 16px; padding: 12px 28px; background: #4A7C59; color: white; border: none; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .pocso-quiz-next-btn:hover { background: #2D5240; }
  .pocso-quiz-result { text-align: center; padding: 20px 0; animation: pocsoFadeIn 0.4s ease; }
  .pocso-quiz-result-trophy { font-size: 64px; margin-bottom: 12px; }
  .pocso-quiz-result h3 { font-family: 'Fraunces', serif; font-size: 26px; color: #1E2820; margin-bottom: 6px; }
  .pocso-quiz-result .big-score { font-family: 'Fraunces', serif; font-size: 56px; font-weight: 700; color: #4A7C59; line-height: 1; }
  .pocso-quiz-result p { font-size: 15px; color: #7A8A7D; margin: 10px 0 20px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.6; }
  .pocso-quiz-retake { background: white; border: 2px solid #4A7C59; color: #4A7C59; padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; margin-right: 10px; }
  .pocso-quiz-retake:hover { background: #4A7C59; color: white; }

  /* ── Print Styles ── */
  @media print {
    @page { size: A4; margin: 18mm 18mm 22mm 18mm; }
    body { background: white !important; font-family: 'Plus Jakarta Sans', sans-serif; }
    .pocso-topbar, .pocso-tabs-wrap, .pocso-quiz-wrap, .pocso-action-btn, .no-print { display: none !important; }
    .pocso-page { padding: 0; background: white; }
    .pocso-hero { background: #2D5240 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 28px 32px !important; }
    .pocso-content { padding: 20px 0; }
    .pocso-section { break-inside: avoid; border: 1px solid #ccc !important; box-shadow: none !important; margin-bottom: 12px; }
    .pocso-section-body { display: block !important; }
    .pocso-section-chevron { display: none; }
    .pocso-handbook-intro { break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #EBF4EE !important; }
    .pocso-key-box, .pocso-warn-box, .pocso-info-box, .pocso-fill-in { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
    .pocso-helpline-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
    .pocso-two-col { break-inside: avoid; }
    .pocso-myths-table { break-inside: avoid; }
    .print-footer { display: block !important; position: fixed; bottom: 12mm; left: 18mm; right: 18mm; text-align: center; font-size: 9px; color: #888; border-top: 1px solid #ddd; padding-top: 6px; }
    .print-page-note { display: block !important; font-size: 8px; color: #aaa; text-align: right; margin-top: 4px; }
  }
  .print-footer, .print-page-note { display: none; }

  @media(max-width: 768px) {
    .pocso-hero { padding: 40px 20px 32px; }
    .pocso-hero-inner { gap: 20px; }
    .pocso-hero-icon { font-size: 52px; }
    .pocso-tabs-wrap { padding: 0 16px; }
    .pocso-tab { padding: 14px 16px; font-size: 13px; }
    .pocso-content { padding: 24px 20px; }
    .pocso-two-col { grid-template-columns: 1fr; }
    .pocso-helpline-grid { grid-template-columns: 1fr 1fr; }
    .pocso-topbar { padding: 0 16px; }
    .pocso-topbar-title { display: none; }
  }
`;

// ── HANDBOOK CONTENT (All 3 age groups × 8 sections) ─────────────────────────
const HANDBOOK = {

  // ── PRIMARY ─────────────────────────────────────────────────────────────────
  primary: {
    intro: "This handbook is written just for you — a student in Class 1 to 5. Inside, you will find simple, important information about staying safe, understanding your body, and knowing who to talk to if you ever feel unsafe.",
    sections: [
      {
        id: 's1', icon: '⚖️',
        title: 'What is POCSO?',
        render: () => (
          <>
            <p className="pocso-body-text">POCSO is a special rule made by the Government of India. POCSO stands for <strong>Protection of Children from Sexual Offences.</strong> It was made just to keep children like you safe.</p>
            <div className="pocso-key-box">
              <h4>💡 What POCSO Says</h4>
              <ul>
                <li>Every child in India is protected by this law.</li>
                <li>Anyone who hurts a child in a bad way is doing something wrong.</li>
                <li>That person will be in serious trouble with the police.</li>
                <li>Your safety always comes first.</li>
              </ul>
            </div>
            <p className="pocso-body-text">Remember: you are important. You matter. And you deserve to be safe.</p>
          </>
        ),
      },
      {
        id: 's2', icon: '🛑',
        title: 'Good Touch and Bad Touch',
        render: () => (
          <>
            <p className="pocso-body-text">Not all touches are the same. Some touches are safe and loving. Some touches are not safe and make you feel bad inside.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">👍 Good Touch (Safe)</div>
                <ul className="pocso-col-list">
                  <li>A hug from your parent</li>
                  <li>A handshake from a friend</li>
                  <li>A pat on the back from a teacher</li>
                  <li>A doctor checking your health (with a parent present)</li>
                  <li>A high five from a classmate</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">👎 Bad Touch (Unsafe)</div>
                <ul className="pocso-col-list">
                  <li>Any touch on your private parts (not by a doctor)</li>
                  <li>A touch that makes you feel scared or confused</li>
                  <li>A touch someone tells you to keep secret</li>
                  <li>Any touch you do NOT want</li>
                  <li>A touch that hurts you</li>
                </ul>
              </div>
            </div>
            <div className="pocso-key-box">
              <h4>🩱 Your Private Parts</h4>
              <p>The parts of your body covered by your swimwear or underwear are your <strong>private parts</strong>. They belong only to you. No one should touch, look at, or take pictures of your private parts — except a doctor when a parent is in the room.</p>
            </div>
          </>
        ),
      },
      {
        id: 's3', icon: '💛',
        title: 'Your Body Belongs to YOU',
        render: () => (
          <>
            <div className="pocso-key-box">
              <h4>🌟 The Most Important Rule</h4>
              <p>YOUR BODY BELONGS TO YOU. Nobody can touch you without your permission. Not a friend, not a relative, not a teacher, not a stranger — nobody.</p>
            </div>
            <p className="pocso-body-text">You have the right to say <strong>NO</strong> to any touch that makes you feel uncomfortable. Even if it comes from someone you know. Even if they say it's okay. Even if they give you gifts. It is still not okay.</p>
            <div className="pocso-info-box">
              <h4>🔑 Three Words to Remember</h4>
              <ul>
                <li><strong>SAFE</strong> — A good touch always feels safe, not scary.</li>
                <li><strong>PRIVATE</strong> — Your private parts are private for a reason.</li>
                <li><strong>NO</strong> — You always have the right to say No.</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 's4', icon: '🤝',
        title: 'Who Are Your Safe Adults?',
        render: () => (
          <>
            <p className="pocso-body-text">A <strong>safe adult</strong> is a grown-up you trust — someone who listens to you, believes you, and will help you if something goes wrong.</p>
            <div className="pocso-key-box">
              <h4>🧡 Safe Adults could be:</h4>
              <ul>
                <li>Your mother or father</li>
                <li>Your grandparent</li>
                <li>A teacher or school counsellor you trust</li>
                <li>An older sibling or relative you feel safe with</li>
                <li>A friend's parent</li>
              </ul>
            </div>
            <div className="pocso-fill-in">
              <h4>✏️ Write Your Safe Adults Here</h4>
              {[1,2,3].map(n => (
                <div className="pocso-fill-row" key={n}>
                  <span className="pocso-fill-num">{n}</span>
                  <span>Name: </span>
                  <span className="pocso-fill-line" />
                  <span>  Relation: </span>
                  <span className="pocso-fill-line" />
                </div>
              ))}
              <div className="pocso-fill-row" style={{ marginTop: '6px' }}>
                <span className="pocso-fill-num">📞</span>
                <span>Their phone number: </span>
                <span className="pocso-fill-line" />
              </div>
            </div>
          </>
        ),
      },
      {
        id: 's5', icon: '🆘',
        title: 'What to Do If It Happens',
        render: () => (
          <>
            <p className="pocso-body-text">If something bad happens to you or someone you know, here is exactly what to do. These steps will help keep you safe.</p>
            <ol className="pocso-steps">
              <li><strong>Stay calm.</strong> Take a deep breath. What happened was NOT your fault. You are brave for knowing what to do.</li>
              <li><strong>Get to a safe place.</strong> Move away from the person who hurt you. Go somewhere with other people around.</li>
              <li><strong>Tell a safe adult right away.</strong> Tell the grown-up you trust the most. Show them this handbook if it is hard to say the words.</li>
              <li><strong>Say what happened.</strong> Tell them as much as you remember. It is okay if you don't remember everything.</li>
              <li><strong>Keep telling until someone helps.</strong> If one adult doesn't help, tell another. You deserve help.</li>
            </ol>
            <div className="pocso-warn-box">
              <h4>⚠️ Very Important</h4>
              <p>If the bad person tells you to keep it a secret, <strong>do NOT keep that secret.</strong> Secrets about body safety are never okay. A good adult will NEVER ask you to keep this kind of secret.</p>
            </div>
          </>
        ),
      },
      {
        id: 's6', icon: '📞',
        title: 'Helplines — Call for Help',
        render: () => (
          <>
            <p className="pocso-body-text">You can always call for help. These phone numbers are free and available day and night.</p>
            <div className="pocso-helpline-emergency">
              <span className="big-num">1098</span>
              <div>
                <h4>Childline India</h4>
                <p>Free · 24 hours · 7 days · For any child in distress anywhere in India</p>
              </div>
            </div>
            <div className="pocso-helpline-grid" style={{ marginTop: '12px' }}>
              <div className="pocso-helpline-card">
                <h4>Police Emergency</h4>
                <span className="num">100</span>
                <span className="avail">Available 24/7</span>
              </div>
              <div className="pocso-helpline-card">
                <h4>iCall (TISS)</h4>
                <span className="num">9152987821</span>
                <span className="avail">Mon–Sat, 8am–10pm</span>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 's7', icon: '✅',
        title: 'True or False — Let\'s Find Out',
        render: () => (
          <>
            <p className="pocso-body-text">Do you know which of these are true and which are false?</p>
            <table className="pocso-myths-table">
              <thead><tr><th>What Some People Say</th><th>The Truth</th></tr></thead>
              <tbody>
                {[
                  ["It's your fault if a bad touch happens.", "FALSE. It is NEVER a child's fault. The adult who did it is always wrong."],
                  ["You should keep it secret so your family doesn't get upset.", "FALSE. Telling a trusted adult is the right thing to do. A good secret never involves body safety."],
                  ["Only strangers can hurt children.", "FALSE. Sadly, most cases involve people the child already knows. Trust your feelings."],
                  ["If you tell, nobody will believe you.", "FALSE. Childline and the police are trained to listen to and believe children."],
                  ["You have the right to say NO to any touch you don't want.", "TRUE. Your body is yours. You always have this right."],
                ].map(([myth, fact], i) => (
                  <tr key={i}>
                    <td><span className="myth-label">CLAIM</span><br/>{myth}</td>
                    <td><span className="fact-label">TRUTH</span><br/>{fact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: 's8', icon: '📖',
        title: 'Words to Know',
        render: () => (
          <ul className="pocso-glossary-list">
            {[
              ['POCSO', 'A law in India that protects children from harm.'],
              ['Private Parts', 'The parts of your body covered by your swimwear — they are private and belong only to you.'],
              ['Safe Adult', 'A grown-up you trust who will listen to you and help you stay safe.'],
              ['Bad Touch', 'Any touch that feels wrong, scary, or uncomfortable — especially on private parts.'],
              ['Childline', 'A free phone helpline (1098) for children who need help, available 24 hours a day.'],
              ['Secret vs Surprise', 'A surprise (like a birthday party) is shared soon and makes everyone happy. A secret that involves body safety should NEVER be kept.'],
            ].map(([term, def]) => (
              <li key={term}><strong>{term}:</strong> {def}</li>
            ))}
          </ul>
        ),
      },
    ],
  },

  // ── UPPER PRIMARY ────────────────────────────────────────────────────────────
  upperPrimary: {
    intro: "This handbook is for students in Class 6 to 8. It covers the POCSO Act in clear, straightforward language — what your rights are, what counts as abuse, who to tell, and what will happen when you do. You deserve to know this information.",
    sections: [
      {
        id: 's1', icon: '⚖️',
        title: 'What is POCSO and Why Does It Exist?',
        render: () => (
          <>
            <p className="pocso-body-text">POCSO — the <strong>Protection of Children from Sexual Offences Act</strong> — is an Indian law enacted in 2012. It was created because India recognised that children needed specific, strong legal protection against sexual abuse.</p>
            <div className="pocso-key-box">
              <h4>💡 Key facts about POCSO</h4>
              <ul>
                <li>Under POCSO, a <strong>child</strong> is any person below the age of 18.</li>
                <li>It applies to abuse by anyone — relatives, friends, teachers, or strangers.</li>
                <li>It covers both boys and girls.</li>
                <li>Punishment for offenders under POCSO is severe — from 3 years to life imprisonment, depending on the offence.</li>
                <li>The 2019 amendment increased penalties and added the death penalty for the most severe cases.</li>
              </ul>
            </div>
            <p className="pocso-body-text">POCSO also creates a <strong>mandatory reporting</strong> duty — any adult who knows about abuse happening to a child <em>must</em> report it to the police. Not reporting is itself a punishable offence.</p>
          </>
        ),
      },
      {
        id: 's2', icon: '🛑',
        title: 'What Counts as a POCSO Offence?',
        render: () => (
          <>
            <p className="pocso-body-text">POCSO defines several types of offences against children. You don't need to know the legal terms, but you should know what is and is not acceptable.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">✅ Acceptable / Safe</div>
                <ul className="pocso-col-list">
                  <li>Medical examination by a doctor with a parent or guardian present</li>
                  <li>Appropriate physical affection from parents and family</li>
                  <li>Age-appropriate health education in school</li>
                  <li>Any touch you are fully comfortable with</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">🚫 POCSO Offence (Illegal)</div>
                <ul className="pocso-col-list">
                  <li>Any unwanted touch on private parts of the body</li>
                  <li>Showing pornographic content to a child</li>
                  <li>Making sexual comments, gestures, or requests</li>
                  <li>Online grooming — building trust to exploit a child</li>
                  <li>Sending or requesting inappropriate photos</li>
                  <li>Sexual acts that the child did not freely and knowingly agree to</li>
                </ul>
              </div>
            </div>
            <div className="pocso-warn-box">
              <h4>📱 Digital Abuse is also POCSO</h4>
              <p>Receiving or sending sexually explicit messages, images, or videos involving anyone under 18 is a POCSO offence — even if both parties are minors. If an adult asks for photos of your body or private parts online, that is a crime.</p>
            </div>
          </>
        ),
      },
      {
        id: 's3', icon: '💛',
        title: 'Your Body, Your Consent, Your Rights',
        render: () => (
          <>
            <p className="pocso-body-text"><strong>Consent</strong> means you freely, knowingly, and willingly agree to something. It cannot be given when you are scared, pressured, threatened, or manipulated — even if you didn't say the word "no."</p>
            <div className="pocso-key-box">
              <h4>🔑 Your Legal Rights Under POCSO</h4>
              <ul>
                <li>You have the right to say NO to any touch or interaction that makes you uncomfortable.</li>
                <li>You have the right to be heard and believed when you report abuse.</li>
                <li>Your identity is protected — your name cannot be revealed publicly during any case.</li>
                <li>You can be accompanied by a parent, trusted adult, or social worker throughout the legal process.</li>
                <li>The investigation must be conducted by a female police officer in a child-friendly manner.</li>
              </ul>
            </div>
            <p className="pocso-body-text">No relationship — family, friendship, authority — gives anyone the right to violate your body or dignity. Gifts, pressure, or "love" cannot make abuse acceptable.</p>
          </>
        ),
      },
      {
        id: 's4', icon: '🤝',
        title: 'Safe Adults and Your Support Network',
        render: () => (
          <>
            <p className="pocso-body-text">A <strong>safe adult</strong> is someone who will listen without judgement, take you seriously, and help you get the support you need. You should have at least 3 safe adults identified in your life.</p>
            <div className="pocso-key-box">
              <h4>🧡 Who can be a safe adult?</h4>
              <ul>
                <li>A parent or guardian you trust</li>
                <li>A school counsellor</li>
                <li>A trusted teacher (ideally the same gender as you)</li>
                <li>A relative — aunt, uncle, older sibling — who you feel safe with</li>
                <li>A doctor or healthcare worker</li>
                <li>A Childline counsellor (1098)</li>
              </ul>
            </div>
            <div className="pocso-fill-in">
              <h4>✏️ My Safe Adults — Fill This In</h4>
              {[1,2,3].map(n => (
                <div key={n} style={{ marginBottom: '14px' }}>
                  <div className="pocso-fill-row">
                    <span className="pocso-fill-num">{n}</span>
                    <span style={{ fontWeight: 700, minWidth: '60px' }}>Name:</span>
                    <span className="pocso-fill-line" />
                  </div>
                  <div className="pocso-fill-row" style={{ paddingLeft: '36px' }}>
                    <span style={{ minWidth: '80px', fontSize: '13px', color: '#7A8A7D' }}>Relation:</span>
                    <span className="pocso-fill-line" />
                    <span style={{ minWidth: '60px', fontSize: '13px', color: '#7A8A7D' }}>Number:</span>
                    <span className="pocso-fill-line" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        id: 's5', icon: '🆘',
        title: 'What to Do — Step by Step',
        render: () => (
          <>
            <p className="pocso-body-text">If you or someone you know has experienced abuse, here is what to do. These steps are clear, and the system is designed to support you.</p>
            <ol className="pocso-steps">
              <li><strong>Your safety first.</strong> If you are in immediate danger, call 100 (Police) or 1098 (Childline). Get to a safe place with other people around you.</li>
              <li><strong>Do not shower or change clothes</strong> if physical abuse has just occurred. Medical evidence may be important for your case.</li>
              <li><strong>Tell a trusted adult immediately.</strong> If possible, tell your parent or school counsellor. Show them this section of the handbook if it helps.</li>
              <li><strong>File a complaint.</strong> Your trusted adult will help you file an FIR (First Information Report) at the nearest police station. A female officer will record your statement.</li>
              <li><strong>Medical support.</strong> A medical examination will be conducted by a doctor. This is to support the case and to make sure you are physically okay.</li>
              <li><strong>Legal protection begins immediately.</strong> Once reported, you are protected. The accused cannot approach you, and your identity stays confidential.</li>
              <li><strong>Counselling support.</strong> You are entitled to free counselling from a trained professional throughout the process.</li>
            </ol>
            <div className="pocso-warn-box">
              <h4>⚠️ Never your fault</h4>
              <p>Abuse is never the child's fault — regardless of what you were wearing, where you were, who you were with, or what your relationship to the person was. The law is completely on your side.</p>
            </div>
          </>
        ),
      },
      {
        id: 's6', icon: '📞',
        title: 'Helplines — Free, Confidential, 24/7',
        render: () => (
          <>
            <div className="pocso-helpline-emergency">
              <span className="big-num">1098</span>
              <div>
                <h4>Childline India — Your First Call</h4>
                <p>Free · 24 hours a day · 7 days a week · Strictly confidential · Trained counsellors</p>
              </div>
            </div>
            <div className="pocso-helpline-grid" style={{ marginTop: '12px' }}>
              {[
                ['Police Emergency', '100', 'Always available'],
                ['Women & Child Helpline', '1090', '24/7 for safety'],
                ['iCall — TISS Mumbai', '9152987821', 'Mon–Sat 8am–10pm'],
                ['Kiran Mental Health', '1800-599-0019', 'Free, 24/7'],
              ].map(([name, num, avail]) => (
                <div key={name} className="pocso-helpline-card">
                  <h4>{name}</h4>
                  <span className="num">{num}</span>
                  <span className="avail">{avail}</span>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        id: 's7', icon: '✅',
        title: 'Myths vs Facts About POCSO',
        render: () => (
          <table className="pocso-myths-table">
            <thead><tr><th>Myth</th><th>Fact</th></tr></thead>
            <tbody>
              {[
                ["Only girls can be victims of sexual abuse.", "Boys, girls, and children of all genders can experience abuse. POCSO protects all children under 18."],
                ["If I didn't physically fight back, it means I agreed.", "Freezing, going silent, or not fighting back is a normal trauma response. It does not mean consent."],
                ["Reporting will destroy my family.", "Not reporting allows the abuse to continue — possibly affecting other children too. Your wellbeing matters most."],
                ["The police won't believe me.", "Under POCSO, the statement of a child is given significant legal weight. Police are trained to handle these cases."],
                ["Abuse only happens in poor families or certain communities.", "Abuse happens across all communities, income levels, and religions. No community is immune."],
                ["If it happened once and stopped, I don't need to report it.", "Every incident of abuse is a crime. Reporting protects you and prevents the abuser from harming others."],
              ].map(([myth, fact], i) => (
                <tr key={i}>
                  <td><span className="myth-label">MYTH</span><br/>{myth}</td>
                  <td><span className="fact-label">FACT</span><br/>{fact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      {
        id: 's8', icon: '📖',
        title: 'Key Terms to Know',
        render: () => (
          <ul className="pocso-glossary-list">
            {[
              ['POCSO', 'Protection of Children from Sexual Offences Act, 2012. India\'s primary law protecting children from sexual abuse.'],
              ['Sexual Harassment (Section 11)', 'Unwanted sexual comments, gestures, messages, or requests directed at a child.'],
              ['Mandatory Reporting', 'The legal duty of any adult who is aware of child sexual abuse to report it immediately to the police or Child Welfare Committee.'],
              ['FIR (First Information Report)', 'A written document prepared by the police when they receive information about a cognizable offence. Your starting point for legal action.'],
              ['CWC (Child Welfare Committee)', "A government body that protects children's welfare and coordinates care and rehabilitation."],
              ['Grooming', 'When an abuser deliberately builds trust and a relationship with a child (and sometimes the family) to eventually abuse them. Can happen online and offline.'],
              ['Confidentiality', 'Under POCSO, your identity (name, school, photo) cannot be disclosed in any media or public forum at any time.'],
              ['SJPU', 'Special Juvenile Police Unit — a trained unit within the police that handles cases involving children.'],
            ].map(([term, def]) => (
              <li key={term}><strong>{term}:</strong> {def}</li>
            ))}
          </ul>
        ),
      },
    ],
  },

  // ── SECONDARY ────────────────────────────────────────────────────────────────
  secondary: {
    intro: "This handbook is for students in Class 9 to 12. It provides a complete, rights-based understanding of POCSO — the law, the reporting process, digital safety, and how to support a friend. This is information you need, and you have every right to it.",
    sections: [
      {
        id: 's1', icon: '⚖️',
        title: 'POCSO: The Legal Framework',
        render: () => (
          <>
            <p className="pocso-body-text">The <strong>Protection of Children from Sexual Offences (POCSO) Act, 2012</strong> is India's comprehensive legislation protecting persons under 18 from sexual abuse. Amended in 2019, it is gender-neutral, meaning it protects children of all genders.</p>
            <div className="pocso-key-box">
              <h4>⚖️ Key Sections You Should Know</h4>
              <ul>
                <li><strong>Sections 3–6:</strong> Penetrative and aggravated penetrative sexual assault. Punishment: 10 years to life imprisonment; death penalty for some cases post-2019 amendment.</li>
                <li><strong>Sections 7–8:</strong> Sexual assault (non-penetrative abuse of private parts). Punishment: 3–5 years imprisonment.</li>
                <li><strong>Sections 11–12:</strong> Sexual harassment — includes verbal, written, electronic, and gestural conduct of a sexual nature. Punishment: up to 3 years.</li>
                <li><strong>Sections 13–14:</strong> Using a child for pornographic purposes or possessing child sexual abuse material. Severe penalties including imprisonment.</li>
                <li><strong>Section 19:</strong> Mandatory reporting — any person who has knowledge of a POCSO offence is legally required to report it. Failure to report is punishable with 6 months to 1 year imprisonment.</li>
              </ul>
            </div>
            <div className="pocso-info-box">
              <h4>📌 Important: Age of Consent</h4>
              <p>Under POCSO, the age of consent in India is 18. Any sexual act involving a person under 18 — even if "consensual" — is a criminal offence. This applies to all genders. The law does not distinguish between "willing" participation and coercion when a minor is involved.</p>
            </div>
          </>
        ),
      },
      {
        id: 's2', icon: '🛑',
        title: 'Recognising All Forms of Abuse',
        render: () => (
          <>
            <p className="pocso-body-text">Sexual abuse exists on a spectrum and often involves psychological manipulation before physical harm. Recognising the different forms is essential for protecting yourself and others.</p>
            <div className="pocso-key-box">
              <h4>Types of Abuse Under POCSO</h4>
              <ul>
                <li><strong>Physical sexual abuse:</strong> Any unwanted touching of private parts — directly, through clothing, or using an object.</li>
                <li><strong>Non-contact abuse:</strong> Exposing a child to sexual content (pornography), exhibitionism (showing private parts), voyeurism (watching without consent).</li>
                <li><strong>Digital/online abuse:</strong> Soliciting sexual images, online grooming, sending explicit content, "sextortion" (threatening to share images), cyberstalking with sexual intent.</li>
                <li><strong>Grooming:</strong> A process where an offender gradually builds emotional connection and trust — sometimes over months — to isolate, manipulate, and exploit. Gifts, special attention, and secrecy are common tactics.</li>
                <li><strong>Institutional abuse:</strong> Abuse within schools, sports facilities, religious institutions, or other organisations by people in positions of authority.</li>
              </ul>
            </div>
            <div className="pocso-warn-box">
              <h4>🔍 Online Grooming Red Flags</h4>
              <p>Watch out for these signs in online interactions: asking personal questions early on, pushing for secret communication channels, sending gifts or offers of money, asking for photos, isolating you from friends or family, turning conversations sexual, or threatening to share images.</p>
            </div>
          </>
        ),
      },
      {
        id: 's3', icon: '💛',
        title: 'Consent, Dignity, and Your Rights',
        render: () => (
          <>
            <p className="pocso-body-text"><strong>Consent</strong> is free, informed, reversible, enthusiastic, and specific agreement. Under Indian law, no person under 18 can legally consent to sexual activity — regardless of how the interaction was initiated.</p>
            <div className="pocso-key-box">
              <h4>🔑 Your Rights Under POCSO — Complete List</h4>
              <ul>
                <li>Your identity is permanently protected — courts and media cannot disclose your name, school, locality, or any identifying information.</li>
                <li>Your statement can be recorded at home or a place of your choice, not at a police station.</li>
                <li>A female police officer must record the statement of a girl child.</li>
                <li>You may be accompanied by a trusted person throughout the investigation and trial.</li>
                <li>In court, proceedings happen in-camera (private, no public audience), and you face no direct cross-examination by the accused's lawyer.</li>
                <li>You are entitled to free legal aid and counselling support from the state.</li>
                <li>The trial must be completed within one year.</li>
                <li>Bail for the accused is not automatic and is actively resisted by the court.</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 's4', icon: '🤝',
        title: 'Building Your Safety Network',
        render: () => (
          <>
            <p className="pocso-body-text">Research shows that children who have at least one trusted adult in their lives are significantly more likely to report abuse and recover successfully. Don't wait for a crisis to identify your network.</p>
            <div className="pocso-key-box">
              <h4>🧡 Who qualifies as a safe adult?</h4>
              <ul>
                <li>Someone who listens without interrupting or judging you</li>
                <li>Someone who believes you when you share something difficult</li>
                <li>Someone who maintains your confidence (unless your safety requires disclosure)</li>
                <li>A school counsellor, teacher, doctor, or trusted family member</li>
                <li>A Childline counsellor (1098) — always available, trained, and bound to confidentiality</li>
              </ul>
            </div>
            <div className="pocso-fill-in">
              <h4>✏️ My Support Network</h4>
              {[['Personal / Family', 1], ['School / Institution', 2], ['Emergency / Helpline', 3]].map(([type, n]) => (
                <div key={n} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#7A8A7D', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>{type}</div>
                  <div className="pocso-fill-row">
                    <span className="pocso-fill-num">{n}</span>
                    <span style={{ minWidth: '60px', fontSize: '13px' }}>Name:</span>
                    <span className="pocso-fill-line" />
                    <span style={{ minWidth: '70px', fontSize: '13px' }}>Contact:</span>
                    <span className="pocso-fill-line" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        id: 's5', icon: '🆘',
        title: 'The Reporting Process — Step by Step',
        render: () => (
          <>
            <p className="pocso-body-text">Reporting may feel daunting, but the system has strong protections built in for you. Here is exactly what happens at each stage.</p>
            <ol className="pocso-steps">
              <li><strong>Immediate safety.</strong> Call 100 (Police) or 1098 (Childline) if in immediate danger. Move to a safe location. Do not be alone with the accused.</li>
              <li><strong>Preserve evidence if possible.</strong> Do not delete messages or photos that could be evidence. Do not bathe immediately after a physical incident.</li>
              <li><strong>File an FIR.</strong> At any police station. A female officer handles all girl child cases. Your statement is recorded in your own words. You cannot be pressured to change it.</li>
              <li><strong>Medical examination.</strong> Conducted by a registered doctor. Designed to support your case, not to embarrass you. A female guardian or support person can be present.</li>
              <li><strong>SJPU / CWC involvement.</strong> The Special Juvenile Police Unit and Child Welfare Committee are notified. They coordinate your protection and rehabilitation.</li>
              <li><strong>Judicial Magistrate's statement.</strong> Your statement is recorded by a magistrate in a supportive, child-friendly manner within 24 hours of the FIR.</li>
              <li><strong>Trial in Special Court.</strong> Dedicated POCSO courts conduct trials privately and aim to complete within 1 year. You do not face the accused directly.</li>
              <li><strong>Counselling and rehabilitation.</strong> Throughout the entire process, free psychological support is legally mandated for you and your family.</li>
            </ol>
            <div className="pocso-info-box">
              <h4>📌 Supporting a Friend</h4>
              <p>If a friend discloses abuse to you: believe them immediately, don't ask "why didn't you stop it?", keep their confidence but strongly encourage them to tell a trusted adult, don't confront the accused yourself, and accompany them to Childline or a counsellor if they need support doing so.</p>
            </div>
          </>
        ),
      },
      {
        id: 's6', icon: '📞',
        title: 'Helplines and Support Resources',
        render: () => (
          <>
            <div className="pocso-helpline-emergency">
              <span className="big-num">1098</span>
              <div>
                <h4>Childline India — Primary Resource</h4>
                <p>Free · 24/7 · Confidential · Trained crisis counsellors · Can arrange immediate rescue if needed</p>
              </div>
            </div>
            <div className="pocso-helpline-grid" style={{ marginTop: '12px' }}>
              {[
                ['Police Emergency', '100', '24/7'],
                ['Women Helpline', '181', '24/7'],
                ['Women & Child (State)', '1090', 'Most states 24/7'],
                ['iCall (TISS)', '9152987821', 'Mon–Sat 8am–10pm'],
                ['Kiran MH Helpline', '1800-599-0019', 'Free, 24/7'],
                ['POCSO e-Box (NCPCR)', 'pocso-ebox.ncpcr.gov.in', 'Online complaint'],
              ].map(([name, num, avail]) => (
                <div key={name} className="pocso-helpline-card">
                  <h4>{name}</h4>
                  <span className="num" style={{ fontSize: num.length > 12 ? '14px' : '24px' }}>{num}</span>
                  <span className="avail">{avail}</span>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        id: 's7', icon: '✅',
        title: 'Myths, Facts, and Critical Thinking',
        render: () => (
          <table className="pocso-myths-table">
            <thead><tr><th>Myth (What Some People Say)</th><th>Fact (What POCSO and Research Show)</th></tr></thead>
            <tbody>
              {[
                ["If both people are under 18, it's not a POCSO offence.", "POCSO applies regardless of the age of the accused. If any sexual act involves a person under 18, it is an offence. Minors can also be held accountable."],
                ["Reporting will permanently damage my reputation.", "Your identity is protected by law at all times. Your name cannot be mentioned in any public record, media, or document. Confidentiality is absolute."],
                ["If I was in a relationship with the person, it's not abuse.", "Relationships do not create consent for sexual acts involving minors. 'Boyfriend/girlfriend' status has no legal standing under POCSO."],
                ["Police will harass me or my family during investigation.", "POCSO specifically mandates child-friendly procedures. A female officer must handle girl child cases. You have the right to a support person at all times."],
                ["Online abuse isn't real abuse — no physical harm occurred.", "Online sexual abuse causes severe and lasting psychological trauma. Under POCSO, digital abuse is treated with the same legal seriousness as physical abuse."],
                ["Abusers are always identifiable — they seem threatening or strange.", "Research shows most abusers are known to the child — often trusted family members, community leaders, or educators. Charm and authority are frequently used to mask abusive behaviour."],
                ["If you wait too long to report, nothing can be done.", "There is no limitation period for reporting POCSO offences. You can report at any time. Support and action are always available."],
              ].map(([myth, fact], i) => (
                <tr key={i}>
                  <td><span className="myth-label">MYTH</span><br/>{myth}</td>
                  <td><span className="fact-label">FACT</span><br/>{fact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
      {
        id: 's8', icon: '📖',
        title: 'Legal Glossary',
        render: () => (
          <ul className="pocso-glossary-list">
            {[
              ['POCSO Act, 2012', 'Protection of Children from Sexual Offences Act. India\'s primary legislation protecting all persons under 18 from sexual abuse, exploitation, and harassment.'],
              ['FIR (First Information Report)', 'The formal written complaint registered by police upon learning of a cognizable offence. The legal starting point of a criminal case.'],
              ['CWC (Child Welfare Committee)', 'A statutory body under the Juvenile Justice Act, responsible for the care, protection, and rehabilitation of children in need.'],
              ['SJPU (Special Juvenile Police Unit)', 'A specialised, trained police unit within each district that handles offences involving children, ensuring child-friendly investigation procedures.'],
              ['In-camera trial', 'Court proceedings conducted in a closed, private session — no public or media access — to protect the identity and dignity of the child.'],
              ['Section 19 — Mandatory Reporting', 'The legal obligation on any person who has knowledge of a POCSO offence to report it immediately to a police officer or SJPU. Non-reporting is itself a punishable offence.'],
              ['POCSO e-Box', 'An online complaint portal by the National Commission for Protection of Child Rights (NCPCR) at pocso-ebox.ncpcr.gov.in — allows confidential online reporting.'],
              ['Grooming', 'A deliberate process by an abuser to build trust, affection, and dependency in a child (and sometimes their family) to lower inhibitions and facilitate abuse.'],
              ['Sextortion', 'Blackmail using real or threatened sharing of sexual images or content to coerce a child into providing money, more images, or sexual favours. A POCSO offence.'],
              ['In-camera proceedings', 'The trial of a POCSO case is conducted in a closed court setting without any person other than those required for the case, protecting the child from re-traumatisation.'],
            ].map(([term, def]) => (
              <li key={term}><strong>{term}:</strong> {def}</li>
            ))}
          </ul>
        ),
      },
    ],
  },
};

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────
const QUIZ = {
  primary: [
    { q: "POCSO stands for Protection of Children from — what?", opts: ["School Offences","Sexual Offences","Sports Offences","Silly Offences"], correct: 1, explain: "POCSO stands for Protection of Children from Sexual Offences. It is a law that protects every child in India under the age of 18." },
    { q: "The private parts of your body are covered by:", opts: ["Your shoes","Your school bag","Your swimwear or underwear","Your jacket"], correct: 2, explain: "Your private parts are the parts covered by your swimwear or underwear. They belong only to you, and nobody should touch them without a proper medical reason." },
    { q: "If someone touches you in a bad way, whose fault is it?", opts: ["Your fault","The adult's fault — never yours","Both of your faults","Nobody's fault"], correct: 1, explain: "It is ALWAYS the adult or older person's fault — NEVER the child's. You are never to blame for what someone else did to you." },
    { q: "What should you do if a bad touch happens?", opts: ["Keep it a secret","Tell a trusted adult right away","Pretend it didn't happen","Wait and see"], correct: 1, explain: "Always tell a safe adult immediately — a parent, teacher, or school counsellor. If you can't talk, write it down or show them this handbook." },
    { q: "The Childline number for children in distress in India is:", opts: ["100","1098","181","9152987821"], correct: 1, explain: "Childline is 1098. It is free, available 24 hours a day, and you can call from anywhere in India. The counsellors are trained to help children." },
  ],
  upperPrimary: [
    { q: "Under POCSO, a 'child' is defined as anyone below the age of:", opts: ["14","16","18","21"], correct: 2, explain: "POCSO protects all persons below 18 years of age, regardless of gender. This applies to both the victim and, in many cases, the accused." },
    { q: "Is online grooming considered an offence under POCSO?", opts: ["No — it has to be physical","Yes — digital abuse is fully covered","Only if photos are exchanged","Only if the groomer is an adult"], correct: 1, explain: "Yes. POCSO fully covers digital and online forms of abuse including grooming, soliciting images, sending explicit content, and cyber-harassment. Online abuse is treated with the same legal seriousness as physical abuse." },
    { q: "If a friend tells you they are being abused, the first thing you should do is:", opts: ["Tell the whole class","Confront the abuser yourself","Believe them and encourage them to tell a trusted adult","Wait to see if it happens again"], correct: 2, explain: "Believe them immediately and encourage them to tell a trusted adult — a parent, counsellor, or Childline (1098). Never confront the abuser yourself; that can be dangerous. Your role is to support and connect them to help." },
    { q: "Under POCSO, which adults are legally required to report abuse they know about?", opts: ["Only doctors and teachers","Only parents","All adults — mandatory reporting applies to everyone","Only police officers"], correct: 2, explain: "Section 19 of POCSO makes mandatory reporting the duty of ALL adults. Any person who has knowledge of a POCSO offence must report it to the police. Not reporting is itself a punishable offence." },
    { q: "Your identity is protected during a POCSO case. Who can disclose your name?", opts: ["The court judge","The police officer","Your school principal","Nobody — your identity is permanently protected"], correct: 3, explain: "Under POCSO, your name, school, photograph, and any identifying information cannot be disclosed by anyone — not the media, not the court, not the police — at any point during or after the case. This protection is permanent." },
  ],
  secondary: [
    { q: "POCSO was enacted in which year?", opts: ["2005","2009","2012","2018"], correct: 2, explain: "POCSO was enacted in 2012. It was subsequently amended in 2019 to increase penalties and add the death penalty for the most severe cases of aggravated penetrative sexual assault against children below 12." },
    { q: "Which section of POCSO deals with mandatory reporting?", opts: ["Section 3","Section 11","Section 19","Section 7"], correct: 2, explain: "Section 19 of POCSO places a mandatory legal duty on any person who has knowledge of a POCSO offence to report it immediately to the police or Special Juvenile Police Unit (SJPU). Failure to report is itself a punishable offence." },
    { q: "Under POCSO, if two teenagers below 18 engage in consensual sexual activity, what applies?", opts: ["It is not an offence since both agreed","POCSO applies — minors cannot legally consent to sexual activity","Only applies if one is significantly older","It depends on the state law"], correct: 1, explain: "POCSO defines the age of consent as 18. No person under 18 can legally consent to sexual activity under Indian law. POCSO applies regardless of the age of the accused — minors can also be held legally accountable through the Juvenile Justice system." },
    { q: "POCSO trials must be conducted as:", opts: ["Open public trials","In-camera (private, closed) proceedings","Online video trials","At the police station"], correct: 1, explain: "All POCSO trials are conducted in-camera — in a closed, private court setting with no public or media access. This protects the child from re-traumatisation, public scrutiny, and identity disclosure." },
    { q: "Where can a child file an online POCSO complaint without visiting a police station?", opts: ["The local municipality portal","The NCPCR POCSO e-Box at pocso-ebox.ncpcr.gov.in","The school portal","The Supreme Court website"], correct: 1, explain: "The National Commission for Protection of Child Rights (NCPCR) operates the POCSO e-Box at pocso-ebox.ncpcr.gov.in — an online portal for confidential complaints that does not require a police station visit as the first step." },
  ],
};

// ── PPT GENERATOR ─────────────────────────────────────────────────────────────
async function generatePPT(ageGroupKey, ageGroupLabel) {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE'; // 13.3" × 7.5"
  prs.author  = 'SecretSharz — POCSO Resource Library';
  prs.subject = `POCSO Student Handbook — ${ageGroupLabel}`;
  prs.title   = `POCSO: Know Your Rights (${ageGroupLabel})`;

  const C = {
    darkGreen: '1E3D2A',
    forestGreen: '2D5240',
    sage: '4A7C59',
    sageLight: '6FAA80',
    cream: 'F5EDD8',
    sand: 'F7F3ED',
    white: 'FFFFFF',
    text: '1E2820',
    textSoft: '3D4A40',
    muted: '7A8A7D',
    red: 'C0392B',
    orange: 'E8845A',
  };

  const TITLE_OPTS = { fontFace: 'Georgia', fontSize: 36, bold: true, color: C.white, align: 'center' };
  const SECTION_TITLE = { fontFace: 'Georgia', fontSize: 24, bold: true, color: C.white };
  const BODY = { fontFace: 'Calibri', fontSize: 14, color: C.textSoft };
  const BULLET_OPTS = { fontFace: 'Calibri', fontSize: 13, color: C.textSoft };

  const makeShadow = () => ({ type: 'outer', blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.12 });
  const makeAccentBar = (slide, color) => slide.addShape(prs.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color }, line: { type: 'none' } });

  // ─── SLIDE 1: Title ───────────────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.darkGreen };
    s.addShape(prs.shapes.RECTANGLE, { x: 0, y: 0, w: 13.3, h: 2.4, fill: { color: C.forestGreen }, line: { type: 'none' } });
    s.addText('🛡️', { x: 5.4, y: 0.3, w: 2.5, h: 1.6, fontSize: 60, align: 'center', valign: 'middle' });
    s.addText('SecretSharz Resource Library', { x: 0.6, y: 2.6, w: 12, h: 0.5, fontFace: 'Calibri', fontSize: 12, color: C.sageLight, align: 'center', bold: false, italic: true });
    s.addText('POCSO: Know Your Rights', { x: 0.6, y: 3.1, w: 12, h: 1.4, ...TITLE_OPTS, fontSize: 42 });
    s.addText(`Student Handbook — ${ageGroupLabel}`, { x: 0.6, y: 4.5, w: 12, h: 0.8, fontFace: 'Georgia', fontSize: 22, color: C.sageLight, align: 'center', italic: true });
    s.addShape(prs.shapes.RECTANGLE, { x: 3.5, y: 5.5, w: 6.3, h: 0.04, fill: { color: C.sageLight }, line: { type: 'none' } });
    s.addText('Protection of Children from Sexual Offences Act, 2012  |  Free Resource  |  January 2026', { x: 0.6, y: 5.7, w: 12, h: 0.4, fontFace: 'Calibri', fontSize: 11, color: C.muted, align: 'center' });
    s.addNotes('Welcome participants. Introduce yourself and explain that today you will cover POCSO — an Indian law that exists to keep every child safe. Emphasise that this is a safe space and all questions are welcome.');
  }

  // ─── SLIDE 2: Body Belongs to You ────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.sand };
    makeAccentBar(s, C.sage);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.sage }, line: { type: 'none' } });
    s.addText('💛  YOUR BODY BELONGS TO YOU', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 28, margin: 0 });
    s.addText([
      { text: 'YOUR BODY IS YOURS.', options: { bold: true, breakLine: true, fontSize: 20, color: C.forestGreen } },
      { text: ' ', options: { breakLine: true } },
      { text: 'Nobody can touch you without your permission.', options: { breakLine: true } },
      { text: 'Not a friend. Not a relative. Not a teacher. Not a stranger. ', options: { breakLine: true } },
    ], { x: 0.4, y: 1.7, w: 7, h: 2, fontFace: 'Calibri', fontSize: 16, color: C.text });
    s.addShape(prs.shapes.ROUNDED_RECTANGLE, { x: 7.6, y: 1.6, w: 5.3, h: 4, fill: { color: C.forestGreen }, shadow: makeShadow(), rectRadius: 0.15 });
    s.addText([
      { text: 'Three Words to Remember\n', options: { bold: true, fontSize: 16, breakLine: true } },
      { text: '🛡️  SAFE\n', options: { breakLine: true, bullet: true } },
      { text: 'Good touches feel safe, not scary.\n', options: { fontSize: 12, breakLine: true, color: 'D1F5E0' } },
      { text: '🔒  PRIVATE\n', options: { breakLine: true, bullet: true } },
      { text: 'Your private parts are always private.\n', options: { fontSize: 12, breakLine: true, color: 'D1F5E0' } },
      { text: '✋  NO\n', options: { breakLine: true, bullet: true } },
      { text: 'You always have the right to say NO.', options: { fontSize: 12, color: 'D1F5E0' } },
    ], { x: 7.8, y: 1.7, w: 4.9, h: 3.8, fontFace: 'Calibri', fontSize: 15, color: C.white, valign: 'middle' });
    s.addText('You can also say NO to any hug or touch you don\'t want — even from family. Your comfort comes first.', { x: 0.4, y: 4.7, w: 7, h: 0.9, ...BODY, fontSize: 13, italic: true, color: C.muted });
    s.addNotes('Ask students: "Can you think of an example of a good touch?" and "What would you do if a touch felt wrong?" Reassure them that saying NO is not rude — it is brave and correct.');
  }

  // ─── SLIDE 3: Good Touch / Bad Touch ─────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.white };
    makeAccentBar(s, C.orange);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.text }, line: { type: 'none' } });
    s.addText('🛑  GOOD TOUCH vs BAD TOUCH', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 28, margin: 0 });
    s.addShape(prs.shapes.RECTANGLE, { x: 0.4, y: 1.7, w: 5.9, h: 4.8, fill: { color: 'D1FAE5' }, shadow: makeShadow() });
    s.addText('✅  GOOD TOUCH', { x: 0.5, y: 1.8, w: 5.7, h: 0.6, fontFace: 'Georgia', fontSize: 16, bold: true, color: '065F46' });
    s.addText([
      { text: 'A hug from your parent', options: { bullet: true, breakLine: true } },
      { text: 'A handshake or high-five from a friend', options: { bullet: true, breakLine: true } },
      { text: 'A pat on the back from a teacher', options: { bullet: true, breakLine: true } },
      { text: 'A doctor checking your health (parent present)', options: { bullet: true, breakLine: true } },
      { text: 'Any touch that feels safe and comfortable', options: { bullet: true } },
    ], { x: 0.5, y: 2.5, w: 5.7, h: 3.5, ...BULLET_OPTS, color: '1F2937' });
    s.addShape(prs.shapes.RECTANGLE, { x: 6.9, y: 1.7, w: 5.9, h: 4.8, fill: { color: 'FEE2E2' }, shadow: makeShadow() });
    s.addText('🚫  BAD TOUCH', { x: 7.0, y: 1.8, w: 5.7, h: 0.6, fontFace: 'Georgia', fontSize: 16, bold: true, color: '991B1B' });
    s.addText([
      { text: 'Any touch on your private parts (not a doctor)', options: { bullet: true, breakLine: true } },
      { text: 'A touch that makes you feel scared or confused', options: { bullet: true, breakLine: true } },
      { text: 'A touch someone tells you to keep secret', options: { bullet: true, breakLine: true } },
      { text: 'Any touch you have NOT agreed to', options: { bullet: true, breakLine: true } },
      { text: 'A touch on your body through your clothes', options: { bullet: true } },
    ], { x: 7.0, y: 2.5, w: 5.7, h: 3.5, ...BULLET_OPTS, color: '1F2937' });
    s.addNotes('Ask: "Can a bad touch come from someone you know?" (Yes.) "What should you do if someone touches you in a way that feels wrong?" (Tell a trusted adult right away, no matter who did it.) Emphasise: the touch is wrong, not you.');
  }

  // ─── SLIDE 4: What is POCSO? ──────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.sand };
    makeAccentBar(s, C.sage);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.forestGreen }, line: { type: 'none' } });
    s.addText('⚖️  WHAT IS POCSO?', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 28, margin: 0 });
    s.addText('P — Protection', { x: 0.5, y: 1.7, w: 5.5, h: 0.7, fontFace: 'Georgia', fontSize: 22, bold: true, color: C.sage });
    s.addText('O — Of Children', { x: 0.5, y: 2.3, w: 5.5, h: 0.7, fontFace: 'Georgia', fontSize: 22, bold: true, color: C.sage });
    s.addText('C — From Sexual', { x: 0.5, y: 2.9, w: 5.5, h: 0.7, fontFace: 'Georgia', fontSize: 22, bold: true, color: C.sage });
    s.addText('O — Offences', { x: 0.5, y: 3.5, w: 5.5, h: 0.7, fontFace: 'Georgia', fontSize: 22, bold: true, color: C.sage });
    s.addText('(Act, 2012)', { x: 0.5, y: 4.3, w: 5.5, h: 0.5, fontFace: 'Calibri', fontSize: 14, italic: true, color: C.muted });
    s.addShape(prs.shapes.RECTANGLE, { x: 6.5, y: 1.6, w: 6.5, h: 5.2, fill: { color: C.darkGreen }, shadow: makeShadow() });
    s.addText([
      { text: 'What POCSO Means for You\n', options: { bold: true, fontSize: 16, breakLine: true } },
      { text: 'Every child under 18 is protected.', options: { bullet: true, breakLine: true } },
      { text: 'It applies to all genders equally.', options: { bullet: true, breakLine: true } },
      { text: 'The abuser is always responsible — never you.', options: { bullet: true, breakLine: true } },
      { text: 'Punishment is severe — 3 years to life.', options: { bullet: true, breakLine: true } },
      { text: 'Your identity is always protected.', options: { bullet: true, breakLine: true } },
      { text: 'Any adult who knows about abuse MUST report it.', options: { bullet: true } },
    ], { x: 6.7, y: 1.8, w: 6.1, h: 4.8, fontFace: 'Calibri', fontSize: 14, color: C.white, valign: 'top' });
    s.addNotes('Explain that this law was specifically made for children in India. The key message: IF SOMETHING BAD HAPPENS TO YOU, THE LAW IS COMPLETELY ON YOUR SIDE.');
  }

  // ─── SLIDE 5: Safe Adults ────────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.white };
    makeAccentBar(s, C.sage);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.sage }, line: { type: 'none' } });
    s.addText('🤝  YOUR SAFE ADULTS', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 28, margin: 0 });
    s.addText('A Safe Adult is someone who will LISTEN, BELIEVE you, and HELP you.', { x: 0.5, y: 1.7, w: 12, h: 0.7, fontFace: 'Calibri', fontSize: 16, color: C.text, bold: true });
    const safeAdults = [['👨‍👩‍👧', 'Parent or Guardian', 'Your first call'], ['🧑‍🏫', 'Trusted Teacher', 'or Counsellor'], ['🏥', 'Doctor or', 'Healthcare Worker'], ['👴', 'Trusted Relative', 'Grandparent / Sibling']];
    safeAdults.forEach(([emoji, line1, line2], i) => {
      const x = 0.5 + (i * 2.9);
      s.addShape(prs.shapes.ROUNDED_RECTANGLE, { x, y: 2.5, w: 2.6, h: 2.8, fill: { color: C.sand }, shadow: makeShadow(), rectRadius: 0.15 });
      s.addText(emoji, { x, y: 2.6, w: 2.6, h: 1, fontSize: 36, align: 'center' });
      s.addText(line1, { x, y: 3.6, w: 2.6, h: 0.5, fontFace: 'Calibri', fontSize: 13, bold: true, color: C.text, align: 'center' });
      s.addText(line2, { x, y: 4.1, w: 2.6, h: 0.4, fontFace: 'Calibri', fontSize: 11, color: C.muted, align: 'center' });
    });
    s.addShape(prs.shapes.RECTANGLE, { x: 0.5, y: 5.5, w: 12, h: 0.7, fill: { color: C.forestGreen }, shadow: makeShadow() });
    s.addText('📞  CHILDLINE — 1098  |  Free  |  24/7  |  Always confidential', { x: 0.5, y: 5.5, w: 12, h: 0.7, fontFace: 'Calibri', fontSize: 15, bold: true, color: C.white, align: 'center', valign: 'middle' });
    s.addNotes('Activity: Ask students to write down 3 safe adults in their handbook. Emphasise that Childline (1098) is ALWAYS available even if they cannot speak to anyone in person. It is free from any phone in India.');
  }

  // ─── SLIDE 6: What to Do ─────────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.sand };
    makeAccentBar(s, C.red);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.red }, line: { type: 'none' } });
    s.addText('🆘  IF IT HAPPENS — WHAT TO DO', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 26, margin: 0 });
    const steps = [['1', 'Get Safe', 'Move away. Go somewhere with other people.'],['2','Tell Someone','Tell a trusted adult right away.'],['3','Keep Telling','If one person doesn\'t help, tell another.'],['4','Call 1098','Childline is always there. Free. Day or night.'],['5','Remember','It is NEVER your fault. You are brave.']];
    steps.forEach(([num, title, desc], i) => {
      const x = 0.4 + (i * 2.52);
      s.addShape(prs.shapes.RECTANGLE, { x, y: 1.7, w: 2.3, h: 4.5, fill: { color: i % 2 === 0 ? C.forestGreen : C.darkGreen }, shadow: makeShadow() });
      s.addText(num, { x, y: 1.8, w: 2.3, h: 1, fontFace: 'Georgia', fontSize: 48, bold: true, color: C.sageLight, align: 'center' });
      s.addText(title, { x, y: 2.8, w: 2.3, h: 0.7, fontFace: 'Georgia', fontSize: 15, bold: true, color: C.white, align: 'center' });
      s.addText(desc, { x, y: 3.5, w: 2.3, h: 2.4, fontFace: 'Calibri', fontSize: 12, color: 'D0E8DB', align: 'center', valign: 'top' });
    });
    s.addNotes('Emphasise Step 3: "Keep telling until someone helps." Research shows children often tell multiple adults before being believed or helped. They should NOT give up. Childline (1098) will always take action.');
  }

  // ─── SLIDE 7: Myths vs Facts ─────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.white };
    makeAccentBar(s, C.sage);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.text }, line: { type: 'none' } });
    s.addText('✅  MYTHS vs FACTS', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 28, margin: 0 });
    const myths = [['It is the child\'s fault.','FALSE. It is NEVER a child\'s fault. The adult is always responsible.'],["You should keep it secret.", "FALSE. This kind of secret should always be shared with a trusted adult."],["Only strangers do this.","FALSE. Most abuse is by someone the child already knows and trusts."],["Nobody will believe you.","FALSE. Childline (1098) and trained police officers are there to believe you."]];
    myths.forEach(([myth, fact], i) => {
      const y = 1.7 + (i * 1.35);
      s.addShape(prs.shapes.RECTANGLE, { x: 0.4, y, w: 6, h: 1.15, fill: { color: 'FEE2E2' }, shadow: makeShadow() });
      s.addText([{ text: 'MYTH: ', options: { bold: true, color: '991B1B' } }, { text: myth }], { x: 0.5, y: y + 0.1, w: 5.8, h: 0.95, fontFace: 'Calibri', fontSize: 12, color: '1F2937', valign: 'middle' });
      s.addShape(prs.shapes.RECTANGLE, { x: 6.9, y, w: 6, h: 1.15, fill: { color: 'D1FAE5' }, shadow: makeShadow() });
      s.addText([{ text: 'FACT: ', options: { bold: true, color: '065F46' } }, { text: fact }], { x: 7.0, y: y + 0.1, w: 5.8, h: 0.95, fontFace: 'Calibri', fontSize: 12, color: '1F2937', valign: 'middle' });
    });
    s.addNotes('Ask students: "Have you heard any of these myths before?" Allow a brief discussion. Emphasise that these myths are exactly what abusers rely on to keep children silent. Knowing the facts is a form of protection.');
  }

  // ─── SLIDE 8: Helplines ──────────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.darkGreen };
    makeAccentBar(s, C.sageLight);
    s.addText('📞  HELP IS ALWAYS AVAILABLE', { x: 0.3, y: 0.3, w: 12.7, h: 1.0, ...SECTION_TITLE, fontSize: 30, margin: 0 });
    s.addShape(prs.shapes.RECTANGLE, { x: 0.4, y: 1.5, w: 12.5, h: 1.4, fill: { color: C.red }, shadow: makeShadow() });
    s.addText('CHILDLINE  —  1098', { x: 0.5, y: 1.6, w: 12.3, h: 0.7, fontFace: 'Georgia', fontSize: 38, bold: true, color: C.white, align: 'center' });
    s.addText('Free  •  24 Hours  •  Any phone in India  •  Confidential  •  Trained counsellors', { x: 0.5, y: 2.3, w: 12.3, h: 0.5, fontFace: 'Calibri', fontSize: 14, color: 'F9CACA', align: 'center' });
    const lines = [['🚨 Police', '100', '24/7'], ['👩 Women Helpline', '181', '24/7'], ['🧠 Kiran (Mental Health)', '1800-599-0019', 'Free, 24/7'], ['📞 iCall (TISS)', '9152987821', 'Mon–Sat, 8am–10pm']];
    lines.forEach(([name, num, avail], i) => {
      const x = 0.4 + (i * 3.15);
      s.addShape(prs.shapes.RECTANGLE, { x, y: 3.2, w: 2.9, h: 2.2, fill: { color: C.forestGreen }, shadow: makeShadow() });
      s.addText(name, { x, y: 3.3, w: 2.9, h: 0.5, fontFace: 'Calibri', fontSize: 11, bold: true, color: C.sageLight, align: 'center' });
      s.addText(num, { x, y: 3.8, w: 2.9, h: 0.9, fontFace: 'Georgia', fontSize: 22, bold: true, color: C.white, align: 'center' });
      s.addText(avail, { x, y: 4.7, w: 2.9, h: 0.4, fontFace: 'Calibri', fontSize: 10, color: 'AACFB8', align: 'center' });
    });
    s.addNotes('End the session here. Ask every student to write 1098 somewhere they won\'t lose it. Remind them: calling 1098 does not mean you are in trouble. It means you are brave enough to ask for help.');
  }

  // ─── SLIDE 9: Discussion Questions ───────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.sand };
    makeAccentBar(s, C.sage);
    s.addShape(prs.shapes.RECTANGLE, { x: 0.12, y: 0, w: 13.18, h: 1.5, fill: { color: C.sage }, line: { type: 'none' } });
    s.addText('💬  DISCUSSION QUESTIONS', { x: 0.3, y: 0.15, w: 12.7, h: 1.1, ...SECTION_TITLE, fontSize: 28, margin: 0 });
    const qs = ['What is one thing from today\'s session that surprised you or that you didn\'t know before?','If a friend told you that an adult had touched them in a bad way, what would you say to them? What would you do?','Why do you think some children don\'t tell anyone when something bad happens? What can we do to change that?','Who are your three safe adults? Do they know you trust them?'];
    qs.forEach((q, i) => {
      s.addShape(prs.shapes.RECTANGLE, { x: 0.4, y: 1.6 + (i * 1.35), w: 12.4, h: 1.2, fill: { color: C.white }, shadow: makeShadow() });
      s.addText(`Q${i+1}. ${q}`, { x: 0.6, y: 1.65 + (i * 1.35), w: 12, h: 1.1, fontFace: 'Calibri', fontSize: 14, color: C.text, valign: 'middle' });
    });
    s.addNotes('Use these questions as a group activity. Allow 2–3 minutes per question. Do not force any student to answer — participation should be voluntary. Create a safe, judgement-free space for sharing.');
  }

  // ─── SLIDE 10: Thank You ─────────────────────────────────────────────────
  {
    const s = prs.addSlide();
    s.background = { color: C.forestGreen };
    s.addText('🛡️', { x: 0, y: 0.8, w: 13.3, h: 1.5, fontSize: 72, align: 'center' });
    s.addText('You Are Brave. You Are Safe. You Matter.', { x: 0.8, y: 2.4, w: 11.7, h: 1.2, fontFace: 'Georgia', fontSize: 28, bold: true, color: C.white, align: 'center', italic: true });
    s.addText('SecretSharz — POCSO Resource Library', { x: 0.8, y: 3.7, w: 11.7, h: 0.5, fontFace: 'Calibri', fontSize: 14, color: C.sageLight, align: 'center' });
    s.addShape(prs.shapes.RECTANGLE, { x: 2, y: 4.4, w: 9.3, h: 0.9, fill: { color: C.red }, shadow: makeShadow() });
    s.addText('📞  CHILDLINE: 1098  (Free • 24/7 • Confidential)', { x: 2, y: 4.4, w: 9.3, h: 0.9, fontFace: 'Georgia', fontSize: 20, bold: true, color: C.white, align: 'center', valign: 'middle' });
    s.addText(`Handbook for ${ageGroupLabel}  |  January 2026  |  Free to reproduce for educational use`, { x: 0.5, y: 5.9, w: 12.3, h: 0.5, fontFace: 'Calibri', fontSize: 10, color: C.sageLight, align: 'center', italic: true });
    s.addNotes('Close the session. Remind students: this presentation and handbook are always available for them. Encourage them to share the Childline number with a friend. Thank them for their attention and bravery in engaging with this topic.');
  }

  await prs.writeFile({ fileName: `SecretSharz-POCSO-Handbook-${ageGroupLabel.replace(/[^a-zA-Z0-9]/g, '-')}.pptx` });
}

// ── QUIZ COMPONENT ────────────────────────────────────────────────────────────
function KnowledgeCheck({ ageGroupKey }) {
  const questions = QUIZ[ageGroupKey] || [];
  const [qi, setQi]         = useState(0);
  const [selected, setSel]  = useState(null);
  const [score, setScore]   = useState(0);
  const [done, setDone]     = useState(false);

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
  const trophy = pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : '💪';
  const msg = pct >= 80 ? "Excellent! You have a strong understanding of your rights under POCSO." : pct >= 60 ? "Good effort! Review the sections where you were unsure." : "Keep learning — knowing your rights is the first step to staying safe.";

  return (
    <div className="pocso-quiz-wrap no-print">
      <div className="pocso-quiz-header">
        <h3>📝 Knowledge Check</h3>
        <p>Test your understanding. {questions.length} questions — answers explained immediately.</p>
      </div>
      <div className="pocso-quiz-body">
        {!done ? (
          <>
            <div className="pocso-quiz-progress">
              <div className="pocso-quiz-progress-fill" style={{ width: `${((qi + 1) / questions.length) * 100}%` }} />
            </div>
            <div className="pocso-quiz-q-num">Question {qi + 1} of {questions.length} &nbsp;·&nbsp; ✓ {score} correct</div>
            <div className="pocso-quiz-question" key={qi}>{q.q}</div>
            <div className="pocso-quiz-options">
              {q.opts.map((opt, i) => {
                let cls = 'pocso-quiz-opt';
                let icon = '○';
                if (answered) {
                  if (i === q.correct) { cls += ' correct'; icon = '✓'; }
                  else if (i === selected && i !== q.correct) { cls += ' wrong'; icon = '✗'; }
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
                  <strong>{selected === q.correct ? '✅ Correct!' : '❌ Not quite.'}</strong>
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
            <div className="pocso-quiz-result-trophy">{trophy}</div>
            <h3>Quiz Complete!</h3>
            <div className="big-score">{score}/{questions.length}</div>
            <p>{msg}</p>
            <button className="pocso-quiz-retake" onClick={reset}>↺ Retake Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const AGE_GROUPS = [
  { key: 'primary',      label: 'Primary',       sub: 'Class 1–5  •  Ages 6–10' },
  { key: 'upperPrimary', label: 'Upper Primary',  sub: 'Class 6–8  •  Ages 11–13' },
  { key: 'secondary',    label: 'Secondary',      sub: 'Class 9–12  •  Ages 14–17' },
];

export default function POCSORStudents({ navigate, onBack }) {
  const [ageGroup, setAgeGroup] = useState('primary');
  const [openSections, setOpen] = useState({ s1: true });
  const [pptLoading, setPptLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Open all sections on age group change
  useEffect(() => {
    const all = {};
    HANDBOOK[ageGroup].sections.forEach(sec => { all[sec.id] = false; });
    all['s1'] = true;
    setOpen(all);
  }, [ageGroup]);

  const toggleSection = useCallback((id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handlePrint = useCallback(() => {
    // Open all sections before printing
    const all = {};
    HANDBOOK[ageGroup].sections.forEach(sec => { all[sec.id] = true; });
    setOpen(all);
    setTimeout(() => window.print(), 300);
  }, [ageGroup]);

  const handlePPT = useCallback(async () => {
    setPptLoading(true);
    const label = AGE_GROUPS.find(g => g.key === ageGroup)?.label || ageGroup;
    try { await generatePPT(ageGroup, label); }
    catch (e) { console.error('PPT generation failed:', e); alert('PPT generation failed. Please ensure pptxgenjs is installed: npm install pptxgenjs'); }
    finally { setPptLoading(false); }
  }, [ageGroup]);

  const currentGroup = AGE_GROUPS.find(g => g.key === ageGroup);
  const handbook = HANDBOOK[ageGroup];

  return (
    <div className="pocso-page">

      {/* STICKY TOP BAR */}
      <div className="pocso-topbar">
        <button className="pocso-back-btn" onClick={onBack || (() => navigate && navigate('/resources'))}>
          ← Back to Resources
        </button>
        <div className="pocso-topbar-title">POCSO: Know Your Rights</div>
        <div className="pocso-topbar-actions">
          <button className="pocso-action-btn pocso-print-btn no-print" onClick={handlePrint}>
            📄 Print PDF
          </button>
          <button className="pocso-action-btn pocso-ppt-btn no-print" onClick={handlePPT} disabled={pptLoading}>
            {pptLoading ? '⏳ Generating…' : '📊 Download PPT'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="pocso-hero">
        <div className="pocso-hero-inner">
          <div className="pocso-hero-icon">🛡️</div>
          <div className="pocso-hero-text">
            <h1>POCSO: Know Your Rights</h1>
            <p>A complete student safety handbook on the Protection of Children from Sexual Offences Act, 2012 — written in clear, age-appropriate language for every class level. Download the printable PDF or classroom PPT using the buttons above.</p>
            <div className="pocso-hero-tags">
              <span className="pocso-hero-tag">📄 Print-ready PDF</span>
              <span className="pocso-hero-tag">📊 Classroom PPT</span>
              <span className="pocso-hero-tag">🔓 Free to reproduce</span>
              <span className="pocso-hero-tag">🇮🇳 India-specific</span>
            </div>
          </div>
        </div>
        <div className="pocso-legal-note" style={{ maxWidth: '900px', margin: '0 auto' }}>
          ⚖️ <strong>Legal basis:</strong> Protection of Children from Sexual Offences (POCSO) Act, 2012, and POCSO (Amendment) Act, 2019. Content reviewed for accuracy with reference to NCPCR guidelines. For legal advice in a specific case, please contact a qualified advocate or Childline (1098).
        </div>
      </div>

      {/* AGE GROUP TABS */}
      <div className="pocso-tabs-wrap">
        <div className="pocso-tabs">
          {AGE_GROUPS.map(g => (
            <button key={g.key} className={`pocso-tab ${ageGroup === g.key ? 'active' : ''}`} onClick={() => setAgeGroup(g.key)}>
              {g.label}
              <span className="pocso-tab-sub">{g.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* HANDBOOK CONTENT */}
      <div className="pocso-content" ref={contentRef}>

        {/* Handbook intro */}
        <div className="pocso-handbook-intro">
          <div className="pocso-intro-icon">📖</div>
          <div className="pocso-intro-text">
            <h3>About This Handbook — {currentGroup?.label} Version</h3>
            <p>{handbook.intro}</p>
          </div>
        </div>

        {/* Sections */}
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
              <div className="pocso-section-body">
                {sec.render()}
              </div>
            )}
          </div>
        ))}

        {/* KNOWLEDGE CHECK QUIZ */}
        <KnowledgeCheck ageGroupKey={ageGroup} />

        {/* Bottom note */}
        <div style={{ marginTop: '32px', padding: '20px 24px', background: 'rgba(30,40,32,0.04)', borderRadius: '14px', fontSize: '13px', color: '#7A8A7D', lineHeight: '1.7' }} className="no-print">
          <strong style={{ color: '#2D5240' }}>📌 Usage Note:</strong> This handbook and accompanying PowerPoint are free to print, reproduce, and distribute for non-commercial educational purposes. SecretSharz requests attribution when sharing. For bulk printing partnerships or translated versions, contact us through the main site.
        </div>
      </div>

      {/* Print-only footer */}
      <div className="print-footer">
        SecretSharz POCSO Resource Library  •  Free educational material — reproduce freely  •  Childline India: <strong>1098</strong>  (Free · 24/7)  •  secretsharz.com
      </div>
    </div>
  );
}
