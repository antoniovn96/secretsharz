/**
 * POCSO: Rights, Responsibilities, and Legal Framework
 * src/resources/pocso/POCSORStudents.jsx
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import pptxgen from 'pptxgenjs'; 

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
  .pocso-action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s; white-space: nowrap; text-decoration: none; }
  .pocso-print-btn { background: rgba(192,57,43,0.15); color: #E74C3C; border: 1px solid rgba(192,57,43,0.3); }
  .pocso-print-btn:hover { background: #E74C3C; color: white; }
  .pocso-ppt-btn { background: rgba(230,126,34,0.15); color: #E67E22; border: 1px solid rgba(230,126,34,0.3); }
  .pocso-ppt-btn:hover { background: #E67E22; color: white; }
  .pocso-ppt-btn:disabled { opacity: 0.5; cursor: wait; }

  /* ── Hero ── */
  .pocso-hero { background: linear-gradient(135deg, #1E2820 0%, #2D5240 60%, #3D6B54 100%); padding: 56px 48px 48px; color: white; }
  .pocso-hero-inner { max-width: 900px; margin: 0 auto; display: flex; gap: 48px; align-items: flex-start; flex-wrap: wrap; }
  .pocso-hero-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.2); }
  .pocso-hero-icon svg { width: 40px; height: 40px; fill: white; }
  .pocso-hero-text h1 { font-family: 'Fraunces', serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 10px; }
  .pocso-hero-text p { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.75; max-width: 520px; margin-bottom: 24px; }
  .pocso-hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
  .pocso-hero-tag { padding: 6px 14px; border-radius: 50px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); }
  .pocso-legal-note { max-width: 900px; margin: 0 auto; padding: 14px 18px; background: rgba(255,255,255,0.07); border-radius: 10px; border-left: 3px solid rgba(111,170,128,0.6); font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.6; margin-top: 20px; }

  /* ── Target Group Tabs ── */
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
  .pocso-intro-icon { width: 32px; height: 32px; flex-shrink: 0; background: #2D5240; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; }
  .pocso-intro-text h3 { font-family: 'Fraunces', serif; font-size: 18px; color: #2D5240; margin-bottom: 6px; }
  .pocso-intro-text p { font-size: 14px; color: #3D4A40; line-height: 1.7; margin: 0; }

  /* ── Section Cards ── */
  .pocso-section { background: white; border-radius: 18px; border: 1.5px solid rgba(30,40,32,0.1); margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 12px rgba(30,40,32,0.05); }
  .pocso-section-header { padding: 20px 26px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: background 0.2s; }
  .pocso-section-header:hover { background: rgba(30,40,32,0.02); }
  .pocso-section-icon { font-size: 18px; font-weight: 900; color: #4A7C59; flex-shrink: 0; width: 36px; height: 36px; background: #EBF4EE; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .pocso-section-title-block { flex: 1; }
  .pocso-section-num { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #4A7C59; margin-bottom: 2px; }
  .pocso-section-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: #1E2820; }
  .pocso-section-chevron { font-size: 16px; color: #7A8A7D; transition: transform 0.25s; flex-shrink: 0; }
  .pocso-section.open .pocso-section-chevron { transform: rotate(90deg); }
  .pocso-section-body { padding: 0 26px 24px; border-top: 1px solid rgba(30,40,32,0.07); animation: pocsoFadeIn 0.3s ease; }
  @keyframes pocsoFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Content Blocks ── */
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
  
  /* Images */
  .pocso-image-wrapper { margin: 24px 0; text-align: center; background: #F8F9FA; padding: 12px; border-radius: 12px; border: 1px solid #E5E7EB; }
  .pocso-content-img { max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto; }
  .pocso-image-caption { font-size: 12px; color: #6B7280; margin-top: 8px; font-style: italic; }

  .pocso-steps { counter-reset: step; list-style: none; padding: 0; margin: 14px 0 0; }
  .pocso-steps li { counter-increment: step; display: flex; gap: 14px; align-items: flex-start; padding: 12px 16px; border-radius: 10px; margin-bottom: 8px; background: rgba(30,40,32,0.02); border: 1px solid rgba(30,40,32,0.06); font-size: 14px; color: #3D4A40; line-height: 1.6; }
  .pocso-steps li::before { content: counter(step); width: 26px; height: 26px; border-radius: 50%; background: #4A7C59; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; line-height: 1; margin-top: 1px; }
  .pocso-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0; }
  .pocso-col-good { background: #D1FAE5; border-radius: 12px; padding: 16px; }
  .pocso-col-bad  { background: #FEE2E2; border-radius: 12px; padding: 16px; }
  .pocso-col-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .pocso-col-good .pocso-col-title { color: #065F46; }
  .pocso-col-bad  .pocso-col-title { color: #991B1B; }
  .pocso-col-list { list-style: none; padding: 0; margin: 0; }
  .pocso-col-list li { font-size: 13px; color: #1F2937; padding: 4px 0; display: flex; gap: 6px; }
  .pocso-myths-table { width: 100%; border-collapse: collapse; margin: 14px 0; border-radius: 10px; overflow: hidden; font-size: 13px; }
  .pocso-myths-table th { background: #2D5240; color: white; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .pocso-myths-table td { padding: 11px 14px; border-bottom: 1px solid rgba(30,40,32,0.07); color: #3D4A40; line-height: 1.55; vertical-align: top; }
  .pocso-myths-table tr:nth-child(even) td { background: rgba(30,40,32,0.02); }
  .pocso-myths-table .myth-label { color: #C0392B; font-weight: 700; font-size: 11px; }
  .pocso-myths-table .fact-label { color: #27AE60; font-weight: 700; font-size: 11px; }
  .pocso-glossary-list { list-style: none; padding: 0; margin: 14px 0 0; }
  .pocso-glossary-list li { padding: 10px 14px; border-radius: 10px; margin-bottom: 7px; background: rgba(30,40,32,0.03); border: 1px solid rgba(30,40,32,0.07); font-size: 14px; color: #3D4A40; line-height: 1.6; }
  .pocso-glossary-list li strong { color: #2D5240; font-weight: 700; }

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
    .pocso-hero-icon { display: none; }
    .pocso-tabs-wrap { padding: 0 16px; }
    .pocso-tab { padding: 14px 16px; font-size: 13px; }
    .pocso-content { padding: 24px 20px; }
    .pocso-two-col { grid-template-columns: 1fr; }
    .pocso-helpline-grid { grid-template-columns: 1fr 1fr; }
    .pocso-topbar { padding: 0 16px; }
    .pocso-topbar-title { display: none; }
  }
`;

// ── HANDBOOK CONTENT ─────────────────────────────────────────────────────────
const HANDBOOK = {

  // ── CHILDREN ─────────────────────────────────────────────────────────────────
  children: {
    intro: "This section provides a complete, rights-based understanding of POCSO — the law, the reporting process, digital safety, and how to support a friend. This is information you need, and you have every right to it.",
    sections: [
      {
        id: 's1', icon: '01',
        title: 'POCSO: The Legal Framework',
        render: () => (
          <>
            <p className="pocso-body-text">The <strong>Protection of Children from Sexual Offences (POCSO) Act, 2012</strong> is India's comprehensive legislation protecting persons under 18 from sexual abuse. Amended in 2019, it is gender-neutral, meaning it protects children of all genders.</p>
            <div className="pocso-key-box">
              <h4>Key Sections You Should Know</h4>
              <ul>
                <li><strong>Sections 3–6:</strong> Penetrative and aggravated penetrative sexual assault. Punishment: 10 years to life imprisonment.</li>
                <li><strong>Sections 7–8:</strong> Sexual assault (non-penetrative abuse of private parts). Punishment: 3–5 years imprisonment.</li>
                <li><strong>Sections 11–12:</strong> Sexual harassment — includes verbal, written, electronic, and gestural conduct. Punishment: up to 3 years.</li>
                <li><strong>Sections 13–14:</strong> Using a child for pornographic purposes. Severe penalties including imprisonment.</li>
                <li><strong>Section 19:</strong> Mandatory reporting — any adult who has knowledge of a POCSO offence is legally required to report it.</li>
              </ul>
            </div>
            
            <div className="pocso-image-wrapper">
              <img src="/placeholder-legal-scale.jpg" alt="Illustration representing legal justice and rights" className="pocso-content-img" />
              <div className="pocso-image-caption">The law applies equally to all children across India.</div>
            </div>

            <div className="pocso-info-box">
              <h4>Important: Age of Consent</h4>
              <p>Under POCSO, the age of consent in India is 18. Any sexual act involving a person under 18 — even if "consensual" — is a criminal offence. The law does not distinguish between "willing" participation and coercion when a minor is involved.</p>
            </div>
          </>
        ),
      },
      {
        id: 's2', icon: '02',
        title: 'Recognising All Forms of Abuse',
        render: () => (
          <>
            <p className="pocso-body-text">Sexual abuse exists on a spectrum and often involves psychological manipulation before physical harm. Recognising the different forms is essential for protecting yourself and others.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">Safe and Appropriate</div>
                <ul className="pocso-col-list">
                  <li>Medical examination by a doctor with a parent or guardian present</li>
                  <li>Age-appropriate health education in school</li>
                  <li>Any touch you are fully comfortable with and can say 'No' to</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">POCSO Offence (Illegal)</div>
                <ul className="pocso-col-list">
                  <li>Any unwanted touch on private parts of the body</li>
                  <li>Showing pornographic content to a child</li>
                  <li>Making sexual comments, gestures, or requests</li>
                  <li>Online grooming — building trust to exploit</li>
                </ul>
              </div>
            </div>
            <div className="pocso-warn-box">
              <h4>Digital Abuse is also POCSO</h4>
              <p>Receiving or sending sexually explicit messages, images, or videos involving anyone under 18 is a POCSO offence — even if both parties are minors. If an adult asks for photos of your body online, that is a crime.</p>
            </div>
          </>
        ),
      },
      {
        id: 's3', icon: '03',
        title: 'Consent, Dignity, and Your Rights',
        render: () => (
          <>
            <p className="pocso-body-text"><strong>Consent</strong> is free, informed, reversible, enthusiastic, and specific agreement. Under Indian law, no person under 18 can legally consent to sexual activity.</p>
            <div className="pocso-key-box">
              <h4>Your Legal Rights Under POCSO</h4>
              <ul>
                <li>Your identity is permanently protected — courts and media cannot disclose your name, school, locality, or any identifying information.</li>
                <li>Your statement can be recorded at home or a place of your choice, not at a police station.</li>
                <li>A female police officer must record the statement of a girl child.</li>
                <li>You may be accompanied by a trusted person throughout the investigation and trial.</li>
                <li>In court, proceedings happen in-camera (private, no public audience).</li>
              </ul>
            </div>
          </>
        ),
      },
      {
        id: 's4', icon: '04',
        title: 'Building Your Safety Network',
        render: () => (
          <>
            <p className="pocso-body-text">A safe adult is someone who will listen without judgement, take you seriously, and help you get the support you need. You should have at least 3 safe adults identified in your life.</p>
            <div className="pocso-fill-in">
              <h4>My Support Network</h4>
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
        id: 's5', icon: '05',
        title: 'The Reporting Process — Step by Step',
        render: () => (
          <>
            <ol className="pocso-steps">
              <li><strong>Immediate safety.</strong> Call 100 (Police) or 1098 (Childline) if in immediate danger. Move to a safe location. Do not be alone with the accused.</li>
              <li><strong>Preserve evidence if possible.</strong> Do not delete messages or photos that could be evidence. Do not bathe immediately after a physical incident.</li>
              <li><strong>File an FIR.</strong> At any police station. A female officer handles all girl child cases. Your statement is recorded in your own words.</li>
              <li><strong>Medical examination.</strong> Conducted by a registered doctor to support your case, not to embarrass you.</li>
              <li><strong>Judicial Magistrate's statement.</strong> Your statement is recorded by a magistrate in a supportive, child-friendly manner within 24 hours of the FIR.</li>
              <li><strong>Trial in Special Court.</strong> Dedicated POCSO courts conduct trials privately. You do not face the accused directly.</li>
            </ol>
            
            <div className="pocso-image-wrapper">
              <img src="/placeholder-process-flow.jpg" alt="Process flow diagram showing reporting steps" className="pocso-content-img" />
              <div className="pocso-image-caption">The legal process is designed to protect the child at every step.</div>
            </div>
          </>
        ),
      },
      {
        id: 's6', icon: '06',
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
                ['POCSO e-Box', 'pocso-ebox.ncpcr.gov.in', 'Online complaint'],
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
    ],
  },

  // ── PARENTS ─────────────────────────────────────────────────────────────────
  parents: {
    intro: "As a parent, your role is critical in both preventing abuse and responding effectively if it occurs. This section outlines your legal rights, how to recognise signs of abuse, and how the POCSO Act protects your child during the legal process.",
    sections: [
      {
        id: 'p1', icon: '01',
        title: 'Understanding Your Child\'s Legal Rights',
        render: () => (
          <>
            <p className="pocso-body-text">The POCSO Act ensures that the justice system adapts to the child, rather than forcing the child to navigate an adult system.</p>
            <div className="pocso-key-box">
              <h4>Key Protections During Investigation & Trial</h4>
              <ul>
                <li><strong>No Night Detainment:</strong> A child cannot be detained in a police station at night for any reason during the investigation.</li>
                <li><strong>Section 24 (Recording Statement):</strong> The statement must be recorded at the child's residence or a place of their choice, by a police officer not in uniform.</li>
                <li><strong>Section 33 (In-Camera Trial):</strong> Proceedings are strictly private. The courtroom environment must be child-friendly.</li>
                <li><strong>No Direct Cross-Examination:</strong> The accused's counsel cannot ask questions directly to the child. Questions must be routed through the Special Court Judge to prevent intimidation.</li>
                <li><strong>Section 36 (Child Not Required to Testify Repeatedly):</strong> The court ensures the child is not called to testify multiple times, reducing trauma.</li>
              </ul>
            </div>
            <div className="pocso-info-box">
              <h4>Compensation (Section 33(8) & Rule 9)</h4>
              <p>The Special Court has the power to direct the State Government to pay compensation to the child for physical or mental trauma, medical expenses, and rehabilitation. Interim compensation can also be awarded during the trial.</p>
            </div>
          </>
        ),
      },
      {
        id: 'p2', icon: '02',
        title: 'Recognising the Signs of Abuse',
        render: () => (
          <>
            <p className="pocso-body-text">Children rarely disclose abuse directly due to fear, grooming, or threats. Parents must be vigilant for behavioural and physical indicators.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-bad">
                <div className="pocso-col-title">Behavioural Indicators</div>
                <ul className="pocso-col-list">
                  <li>Sudden, unexplained fear of a specific person or place.</li>
                  <li>Regression (bed-wetting, thumb-sucking in older children).</li>
                  <li>Drastic changes in school performance or attendance.</li>
                  <li>Inappropriate sexual knowledge or play for their age.</li>
                  <li>Unexplained secrecy, especially regarding phones or internet use.</li>
                  <li>Self-harm, withdrawal, or sudden aggression.</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">Physical Indicators</div>
                <ul className="pocso-col-list">
                  <li>Unexplained bruises, bleeding, or soreness in genital areas.</li>
                  <li>Difficulty walking or sitting.</li>
                  <li>Frequent, unexplained stomach aches or headaches.</li>
                  <li>Torn, stained, or bloody underwear.</li>
                  <li>Unexplained sexually transmitted infections (STIs).</li>
                </ul>
              </div>
            </div>
            
            <div className="pocso-image-wrapper">
              <img src="/placeholder-parent-signs.jpg" alt="Parent observing behavioral changes in a child" className="pocso-content-img" />
              <div className="pocso-image-caption">Observing changes in baseline behavior is the first step to protection.</div>
            </div>
          </>
        ),
      },
      {
        id: 'p3', icon: '03',
        title: 'How to Handle a Disclosure (Do\'s and Don\'ts)',
        render: () => (
          <>
            <p className="pocso-body-text">The moment a child discloses abuse is critical. Your reaction dictates their psychological recovery and the integrity of the legal case.</p>
            <div className="pocso-two-col">
              <div className="pocso-col-good">
                <div className="pocso-col-title">DO This:</div>
                <ul className="pocso-col-list">
                  <li>Stay calm. Manage your own shock or anger away from the child.</li>
                  <li>Believe them immediately and unconditionally.</li>
                  <li>Tell them explicitly: "It is not your fault. You did the right thing by telling me."</li>
                  <li>Use their exact words when reporting. Do not correct their terminology for body parts.</li>
                  <li>Ensure their immediate physical safety.</li>
                </ul>
              </div>
              <div className="pocso-col-bad">
                <div className="pocso-col-title">DO NOT Do This:</div>
                <ul className="pocso-col-list">
                  <li>Do not ask leading questions ("Did he touch you here?"). Let them speak freely.</li>
                  <li>Do not interrogate them for details. That is the job of trained professionals.</li>
                  <li>Do not confront the accused. This can destroy evidence and put the child in danger.</li>
                  <li>Do not blame the child ("Why were you alone with them?").</li>
                  <li>Do not force them to repeat the story to multiple family members.</li>
                </ul>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'p4', icon: '04',
        title: 'Presumption of Guilt (Section 29)',
        render: () => (
          <>
            <p className="pocso-body-text">One of the most powerful aspects of the POCSO Act is the reversal of the standard burden of proof in specific severe cases.</p>
            <div className="pocso-key-box">
              <h4>Section 29: Presumption of Culpable Mental State</h4>
              <p>In cases of penetrative sexual assault or sexual assault, the Special Court <strong>shall presume</strong> that the accused committed the offence. The burden of proof shifts to the accused to prove their innocence beyond a reasonable doubt, rather than the child having to prove the abuse happened.</p>
            </div>
            <p className="pocso-body-text">This section was designed to counter the historic difficulty of proving child sexual abuse, as these crimes typically occur behind closed doors without witnesses.</p>
          </>
        ),
      },
    ],
  },

  // ── EDUCATORS ───────────────────────────────────────────────────────────────
  educators: {
    intro: "Schools and educational institutions carry a profound legal and moral responsibility under the POCSO Act. This section outlines mandatory reporting requirements, institutional liabilities, and best practices for creating a safe environment.",
    sections: [
      {
        id: 'e1', icon: '01',
        title: 'Mandatory Reporting (Section 19 & 21)',
        render: () => (
          <>
            <p className="pocso-body-text">The POCSO Act removes any discretion from educators regarding reporting abuse. Reporting is not an option; it is a strict legal mandate.</p>
            <div className="pocso-warn-box">
              <h4>Section 19: The Duty to Report</h4>
              <p>Any person (including teachers, principals, and support staff) who has an apprehension or knowledge that an offence under POCSO has been committed <strong>must</strong> report it to the Special Juvenile Police Unit (SJPU) or the local police.</p>
            </div>
            <div className="pocso-warn-box">
              <h4>Section 21: Failure to Report</h4>
              <p>Failure to report is a criminal offence. If an educator fails to report abuse, they can face imprisonment for up to 6 months, a fine, or both. If the failure to report involves an institutional cover-up, the management can face up to 1 year of imprisonment.</p>
            </div>
            <p className="pocso-body-text"><strong>Crucial Note:</strong> Internal school policies (like informing the principal first) do NOT override the legal requirement of Section 19. If the principal refuses to report, the individual teacher who received the disclosure is still legally bound to report it to the police.</p>
          </>
        ),
      },
      {
        id: 'e2', icon: '02',
        title: 'Institutional Liability & Safeguarding',
        render: () => (
          <>
            <p className="pocso-body-text">Institutions are held strictly accountable for the safety of children within their premises or during school-sponsored activities.</p>
            <div className="pocso-key-box">
              <h4>Key Institutional Responsibilities</h4>
              <ul>
                <li><strong>Background Checks:</strong> Mandatory police verification and background checks for all teaching and non-teaching staff (including bus drivers, janitors, and contractors).</li>
                <li><strong>CCTV Surveillance:</strong> Installation of cameras in vulnerable areas (corridors, entry/exit points, playgrounds) while respecting privacy in restrooms.</li>
                <li><strong>No Isolated Contact:</strong> Policies preventing staff from being alone with a single child in closed, unobservable spaces.</li>
                <li><strong>Awareness Programs:</strong> Regular, age-appropriate body safety education for students, and POCSO training for all staff.</li>
              </ul>
            </div>
            
            <div className="pocso-image-wrapper">
              <img src="/placeholder-school-safety.jpg" alt="Diagram showing elements of a safe school environment" className="pocso-content-img" />
              <div className="pocso-image-caption">Comprehensive safeguarding requires policy, infrastructure, and training.</div>
            </div>
          </>
        ),
      },
      {
        id: 'e3', icon: '03',
        title: 'Handling Disclosures in a School Setting',
        render: () => (
          <>
            <p className="pocso-body-text">When a student discloses abuse to an educator, the immediate response is critical for the legal process.</p>
            <ol className="pocso-steps">
              <li><strong>Listen without interrogating:</strong> Hear the child out, assure them they are safe, but do NOT ask investigative or leading questions.</li>
              <li><strong>Document exactly:</strong> Write down the child's exact words, date, time, and location of the disclosure. Do not translate their terms into medical/legal language.</li>
              <li><strong>Maintain absolute confidentiality:</strong> Do not discuss the disclosure in the staff room. Inform only the designated safeguarding lead/Principal and proceed to report to authorities.</li>
              <li><strong>Do NOT contact the parents immediately if they are the accused:</strong> If the abuser is suspected to be a family member, informing the parents can place the child in grave danger. Report to Childline (1098) and Police first.</li>
              <li><strong>Do NOT conduct an internal investigation:</strong> Schools are not legally authorised to investigate POCSO offences. Conducting an internal "probe" can destroy evidence and is illegal.</li>
            </ol>
          </>
        ),
      },
      {
        id: 'e4', icon: '04',
        title: 'Section 42: Protection for Good Faith Reporting',
        render: () => (
          <>
            <p className="pocso-body-text">Educators often fear legal retaliation or defamation suits from parents if an apprehension of abuse turns out to be unfounded.</p>
            <div className="pocso-info-box">
              <h4>Protection Against Prosecution</h4>
              <p>Section 42 of the POCSO Act protects individuals who report abuse in <strong>good faith</strong>. If a teacher suspects abuse and reports it based on reasonable indicators, they cannot face civil or criminal liability (like defamation) if the police later conclude no abuse occurred, provided the report was not made with malicious intent.</p>
            </div>
            <p className="pocso-body-text">It is always better to report a suspicion and be wrong, than to stay silent and leave a child in danger.</p>
          </>
        ),
      },
    ],
  },
};

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────
const QUIZ = {
  children: [
    { q: "POCSO stands for Protection of Children from — what?", opts: ["School Offences","Sexual Offences","Sports Offences","Silly Offences"], correct: 1, explain: "POCSO stands for Protection of Children from Sexual Offences. It protects every child in India under 18." },
    { q: "The private parts of your body are covered by:", opts: ["Your shoes","Your school bag","Your swimwear or underwear","Your jacket"], correct: 2, explain: "Your private parts are the parts covered by your swimwear or underwear. They belong only to you." },
    { q: "If someone touches you in a bad way, whose fault is it?", opts: ["Your fault","The adult's fault — never yours","Both of your faults","Nobody's fault"], correct: 1, explain: "It is ALWAYS the adult or older person's fault — NEVER the child's." },
    { q: "What should you do if a bad touch happens?", opts: ["Keep it a secret","Tell a trusted adult right away","Pretend it didn't happen","Wait and see"], correct: 1, explain: "Always tell a safe adult immediately — a parent, teacher, or school counsellor." },
    { q: "The Childline number for children in distress in India is:", opts: ["100","1098","181","9152987821"], correct: 1, explain: "Childline is 1098. It is free, available 24/7." },
  ],
  parents: [
    { q: "Under Section 29 of POCSO, who has the burden of proof in severe sexual assault cases?", opts: ["The Child","The Parents","The Police","The Accused"], correct: 3, explain: "Section 29 shifts the burden of proof to the accused to prove their innocence, rather than the child having to prove the abuse happened." },
    { q: "Can the accused's lawyer directly cross-examine your child in court?", opts: ["Yes, standard procedure","No, questions must go through the Judge","Yes, but only if the parents agree","Only in the police station"], correct: 1, explain: "To prevent intimidation, the accused's counsel cannot directly question the child. Questions are routed through the Special Court Judge." },
    { q: "If you suspect abuse but have no proof, should you confront the accused?", opts: ["Yes, immediately","No, report it to authorities to prevent evidence destruction","Only if they are family","Yes, to get a confession"], correct: 1, explain: "Confronting the accused can destroy evidence, give them time to flee, or place the child in greater danger. Always involve authorities first." },
    { q: "Can the media publish the name of a child victim under POCSO?", opts: ["Yes, if the case is closed","No, identity is permanently protected","Only with parent's permission","Only if the child is over 16"], correct: 1, explain: "Section 23 strictly prohibits the disclosure of the child's identity at any stage, ensuring permanent confidentiality." },
  ],
  educators: [
    { q: "According to Section 19 of POCSO, mandatory reporting requires you to inform:", opts: ["The School Principal only","The Parents only","The Police or SJPU","The School Board"], correct: 2, explain: "Section 19 mandates reporting to the local police or Special Juvenile Police Unit. Informing internal school management does not satisfy your legal obligation." },
    { q: "What is the penalty under Section 21 for failing to report a POCSO offence?", opts: ["A warning letter","Termination of employment","Up to 6 months imprisonment and/or fine","Mandatory retraining"], correct: 2, explain: "Failure to report is a criminal offence punishable by up to 6 months imprisonment, highlighting the severity of the mandate." },
    { q: "If a teacher reports an apprehension of abuse in good faith, and it turns out to be false, can they be sued for defamation?", opts: ["Yes, absolutely","No, Section 42 protects good faith reporting","Only if the parents sue","Yes, by the school"], correct: 1, explain: "Section 42 protects individuals from civil and criminal liability if they report an apprehension of abuse in good faith." },
    { q: "Should a school conduct its own internal investigation before calling the police?", opts: ["Yes, to be absolutely sure","Yes, if the accused is a staff member","No, schools have no legal authority to investigate POCSO offences","Only if the parents request it"], correct: 2, explain: "Schools must not conduct parallel investigations. Doing so can contaminate evidence, tip off the offender, and constitutes interference in a criminal matter." },
  ],
};

// ── PPT GENERATOR ─────────────────────────────────────────────────────────────
async function generatePPT(ageGroupKey, ageGroupLabel) {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE'; 
  prs.author  = 'SecretSharz — POCSO Resource Library';
  prs.subject = `POCSO Handbook — ${ageGroupLabel}`;
  prs.title   = `POCSO: Legal & Safety Framework (${ageGroupLabel})`;

  const C = {
    darkGreen: '1E3D2A', forestGreen: '2D5240', sage: '4A7C59', sageLight: '6FAA80',
    sand: 'F7F3ED', white: 'FFFFFF', text: '1E2820', textSoft: '3D4A40',
    muted: '7A8A7D', red: 'C0392B', orange: 'E8845A',
  };

  const TITLE_OPTS = { fontFace: 'Georgia', fontSize: 36, bold: true, color: C.white, align: 'center' };
  
  const s = prs.addSlide();
  s.background = { color: C.darkGreen };
  s.addText(`POCSO Act Framework`, { x: 0.6, y: 2.5, w: 12, h: 1.4, ...TITLE_OPTS, fontSize: 42 });
  s.addText(`Module: ${ageGroupLabel}`, { x: 0.6, y: 4.0, w: 12, h: 0.8, fontFace: 'Georgia', fontSize: 22, color: C.sageLight, align: 'center', italic: true });
  s.addText('Generated via SecretSharz Resource Library', { x: 0.6, y: 5.7, w: 12, h: 0.4, fontFace: 'Calibri', fontSize: 11, color: C.muted, align: 'center' });

  await prs.writeFile({ fileName: `SecretSharz-POCSO-${ageGroupKey}.pptx` });
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
  const msg = pct >= 80 ? "Excellent understanding of the POCSO legal framework." : pct >= 60 ? "Good effort. Review the legal responsibilities closely." : "Please review the handbook sections to ensure compliance with the law.";

  return (
    <div className="pocso-quiz-wrap no-print">
      <div className="pocso-quiz-header">
        <h3>Knowledge Check</h3>
        <p>Test your understanding of the legal and safety framework.</p>
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
                  <strong>{selected === q.correct ? 'Correct!' : 'Incorrect.'}</strong>
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

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TARGET_GROUPS = [
  { key: 'children',  label: 'For Children',  sub: 'Rights & Safety', pdf: '/POCSO_Children.pdf' },
  { key: 'parents', label: 'For Parents', sub: 'Recognize & Protect', pdf: '/POCSO_Parents.pdf' },
  { key: 'educators', label: 'For Educators', sub: 'Mandates & Policy', pdf: '/POCSO_Educators.pdf' },
];

export default function POCSORStudents({ navigate, onBack }) {
  const [ageGroup, setAgeGroup] = useState('children');
  const [openSections, setOpen] = useState({ s1: true, p1: true, e1: true });
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
    HANDBOOK[ageGroup].sections.forEach(sec => { all[sec.id] = false; });
    const firstId = HANDBOOK[ageGroup].sections[0].id;
    all[firstId] = true;
    setOpen(all);
  }, [ageGroup]);

  const toggleSection = useCallback((id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handlePrint = useCallback(() => {
    const all = {};
    HANDBOOK[ageGroup].sections.forEach(sec => { all[sec.id] = true; });
    setOpen(all);
    setTimeout(() => window.print(), 300);
  }, [ageGroup]);

  const handlePPT = useCallback(async () => {
    setPptLoading(true);
    const label = TARGET_GROUPS.find(g => g.key === ageGroup)?.label || ageGroup;
    try { await generatePPT(ageGroup, label); }
    catch (e) { console.error('PPT generation failed:', e); alert('PPT generation failed. Ensure pptxgenjs is installed.'); }
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
          {/* Dynamic Download Link based on Active Tab */}
          <a href={currentGroup.pdf} download target="_blank" rel="noreferrer" className="pocso-action-btn pocso-print-btn no-print">
            Download PDF
          </a>
          <button className="pocso-action-btn pocso-ppt-btn no-print" onClick={handlePPT} disabled={pptLoading}>
            {pptLoading ? 'Generating…' : 'Download PPT'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="pocso-hero">
        <div className="pocso-hero-inner">
          <div className="pocso-hero-icon">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
          </div>
          <div className="pocso-hero-text">
            <h1>POCSO: The Complete Framework</h1>
            <p>A comprehensive legal and safety guide on the Protection of Children from Sexual Offences Act, 2012 — structured specifically for Children, Parents, and Educators. Ensure compliance and protect vulnerable populations.</p>
            <div className="pocso-hero-tags">
              <span className="pocso-hero-tag">Legal Framework</span>
              <span className="pocso-hero-tag">Mandatory Reporting</span>
              <span className="pocso-hero-tag">Child Rights</span>
            </div>
          </div>
        </div>
        <div className="pocso-legal-note">
          <strong>Legal Disclaimer:</strong> Based on the Protection of Children from Sexual Offences (POCSO) Act, 2012, and POCSO (Amendment) Act, 2019. This is for educational purposes and does not constitute formal legal counsel. For specific case advice, consult a qualified advocate or contact Childline (1098).
        </div>
      </div>

      {/* TARGET GROUP TABS */}
      <div className="pocso-tabs-wrap">
        <div className="pocso-tabs">
          {TARGET_GROUPS.map(g => (
            <button key={g.key} className={`pocso-tab ${ageGroup === g.key ? 'active' : ''}`} onClick={() => setAgeGroup(g.key)}>
              {g.label}
              <span className="pocso-tab-sub">{g.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* HANDBOOK CONTENT */}
      <div className="pocso-content" ref={contentRef}>
        <div className="pocso-handbook-intro">
          <div className="pocso-intro-icon">i</div>
          <div className="pocso-intro-text">
            <h3>Module Overview — {currentGroup?.label}</h3>
            <p>{handbook.intro}</p>
          </div>
        </div>

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

        <div style={{ marginTop: '32px', padding: '20px 24px', background: 'rgba(30,40,32,0.04)', borderRadius: '14px', fontSize: '13px', color: '#7A8A7D', lineHeight: '1.7' }} className="no-print">
          <strong style={{ color: '#2D5240' }}>Usage Note:</strong> This material is free to distribute for institutional compliance and non-commercial educational purposes. SecretSharz requests attribution when incorporating these guidelines into official school policies.
        </div>
      </div>
    </div>
  );
}
