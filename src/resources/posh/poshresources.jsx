/**
 * Secret Sharz — POSH Resource Page
 * Comprehensive guide covering: History, What is POSH, Sexual Harassment types,
 * Workplace definition, ICC/LCC formation, Compliance, Timeline, Scenarios,
 * Consent & Context, Misuse, Remedies, Helplines, Beyond Compliance
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0F1923;
  --ink-soft: #2C3A4A;
  --muted: #6B7A8D;
  --border: rgba(15,25,35,.1);
  --cream: #F9F6F1;
  --sand: #F0EBE3;
  --white: #FFFFFF;

  --teal: #006D6D;
  --teal-mid: #008080;
  --teal-light: #00A3A3;
  --teal-pale: #E6F4F4;
  --teal-ultra: #F0FAF9;

  --rose: #C0392B;
  --rose-mid: #E74C3C;
  --rose-pale: #FDF1F0;

  --gold: #A0790A;
  --gold-pale: #FDF6E3;

  --navy: #1A2B4A;
  --navy-soft: #243560;

  --success: #1A7A4A;
  --success-pale: #E8F5ED;

  --shadow-sm: 0 2px 12px rgba(15,25,35,.06);
  --shadow-md: 0 8px 32px rgba(15,25,35,.10);
  --shadow-lg: 0 20px 60px rgba(15,25,35,.14);
  --r: 16px;
  --r-sm: 10px;
}

html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }

/* ── NAV ── */
.posh-nav {
  position: sticky; top: 0; z-index: 500;
  background: rgba(249,246,241,.96);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 40px;
  display: flex; align-items: center; gap: 0;
  height: 58px;
  box-shadow: var(--shadow-sm);
}
.posh-nav-brand {
  font-family: 'Playfair Display', serif;
  font-size: 16px; font-weight: 700;
  color: var(--teal); margin-right: 32px;
  flex-shrink: 0; text-decoration: none;
}
.posh-nav-tabs {
  display: flex; align-items: center; gap: 0;
  overflow-x: auto; scrollbar-width: none;
  flex: 1;
}
.posh-nav-tabs::-webkit-scrollbar { display: none; }
.posh-nav-tab {
  padding: 0 16px; height: 58px;
  border: none; background: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  color: var(--muted);
  border-bottom: 3px solid transparent;
  transition: all .2s; white-space: nowrap;
  display: flex; align-items: center; gap: 6px;
}
.posh-nav-tab:hover { color: var(--teal); }
.posh-nav-tab.active { color: var(--teal); border-bottom-color: var(--teal); font-weight: 600; }
.posh-sos-pill {
  background: var(--rose); color: white;
  padding: 7px 16px; border-radius: 50px;
  font-size: 12px; font-weight: 700;
  margin-left: auto; flex-shrink: 0;
  display: flex; align-items: center; gap: 6px;
  text-decoration: none;
  transition: background .2s;
}
.posh-sos-pill:hover { background: var(--rose-mid); }

/* ── HERO ── */
.posh-hero {
  background: var(--navy);
  position: relative; overflow: hidden;
  padding: 70px 48px 60px;
}
.posh-hero-mesh {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,109,109,.25), transparent 60%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,128,128,.15), transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 10%, rgba(26,43,74,.6), transparent 60%);
}
.posh-hero-lines {
  position: absolute; inset: 0; pointer-events: none;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent, transparent 40px,
    rgba(255,255,255,.015) 40px, rgba(255,255,255,.015) 41px
  );
}
.posh-hero-inner { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }
.posh-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,163,163,.18); border: 1px solid rgba(0,163,163,.35);
  color: #5DD5D5; padding: 6px 16px; border-radius: 50px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
  margin-bottom: 22px;
}
.posh-hero-badge::before { content: '⚖'; font-size: 13px; }
.posh-hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 5vw, 62px);
  font-weight: 900; color: white; line-height: 1.08;
  letter-spacing: -1.5px; margin-bottom: 18px;
}
.posh-hero-h1 em { font-style: italic; color: #5DD5D5; }
.posh-hero-sub {
  font-size: 17px; color: rgba(255,255,255,.62);
  line-height: 1.8; max-width: 620px; margin-bottom: 32px;
  font-weight: 300;
}
.posh-hero-sos {
  display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 28px;
}
.posh-hero-sos-card {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 12px; padding: 14px 20px;
  display: flex; flex-direction: column; gap: 2px;
}
.posh-hero-sos-num {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 700; color: white; line-height: 1;
}
.posh-hero-sos-label { font-size: 12px; color: rgba(255,255,255,.7); font-weight: 600; }
.posh-hero-sos-sub { font-size: 10px; color: rgba(255,255,255,.4); }
.posh-hero-note {
  max-width: 700px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.09);
  border-left: 3px solid rgba(0,163,163,.5);
  border-radius: 10px; padding: 12px 18px;
  font-size: 12px; color: rgba(255,255,255,.45); line-height: 1.7;
}
.posh-hero-stats {
  display: flex; gap: 30px; flex-wrap: wrap;
  margin-bottom: 30px;
}
.posh-stat { display: flex; flex-direction: column; gap: 3px; }
.posh-stat-n {
  font-family: 'Playfair Display', serif;
  font-size: 36px; font-weight: 700; color: #5DD5D5; line-height: 1;
}
.posh-stat-l { font-size: 12px; color: rgba(255,255,255,.55); font-weight: 500; }

/* ── LAYOUT ── */
.posh-body { max-width: 1000px; margin: 0 auto; padding: 0 48px 80px; }
.posh-section { padding: 64px 0 0; }
.posh-section-header { margin-bottom: 32px; }
.posh-section-eyebrow {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--teal); margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
.posh-section-eyebrow::before {
  content: ''; width: 24px; height: 2px; background: var(--teal); border-radius: 2px;
}
.posh-section-h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 700; color: var(--ink); line-height: 1.15;
  letter-spacing: -.5px;
}
.posh-section-sub {
  font-size: 16px; color: var(--muted); line-height: 1.7;
  margin-top: 10px; max-width: 680px; font-weight: 300;
}
.posh-body-text {
  font-size: 15px; color: var(--ink-soft); line-height: 1.85;
  margin-bottom: 18px;
}

/* ── CARDS & BOXES ── */
.posh-card {
  background: white; border-radius: var(--r);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-sm); overflow: hidden;
}
.posh-card:hover { box-shadow: var(--shadow-md); }

.posh-box {
  border-radius: var(--r-sm); padding: 18px 22px; margin: 16px 0;
}
.posh-box-teal { background: var(--teal-pale); border-left: 4px solid var(--teal); }
.posh-box-teal h4 { color: var(--teal); }
.posh-box-rose { background: var(--rose-pale); border-left: 4px solid var(--rose); }
.posh-box-rose h4 { color: var(--rose); }
.posh-box-navy { background: #EEF2FA; border-left: 4px solid var(--navy-soft); }
.posh-box-navy h4 { color: var(--navy); }
.posh-box-gold { background: var(--gold-pale); border-left: 4px solid var(--gold); }
.posh-box-gold h4 { color: var(--gold); }
.posh-box-success { background: var(--success-pale); border-left: 4px solid var(--success); }
.posh-box-success h4 { color: var(--success); }
.posh-box h4 {
  font-family: 'Playfair Display', serif; font-size: 14px;
  font-weight: 700; margin-bottom: 8px;
}
.posh-box ul, .posh-box ol { padding-left: 18px; font-size: 14px; color: var(--ink-soft); line-height: 1.8; }
.posh-box p { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
.posh-box li { margin-bottom: 3px; }

/* ── GRID LAYOUTS ── */
.posh-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
.posh-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin: 16px 0; }

/* ── TIMELINE ── */
.posh-timeline { margin: 20px 0; }
.posh-tl-item { display: flex; gap: 18px; margin-bottom: 16px; }
.posh-tl-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.posh-tl-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--teal); border: 3px solid var(--teal-pale);
  margin-top: 3px; flex-shrink: 0;
}
.posh-tl-dot.rose { background: var(--rose); border-color: var(--rose-pale); }
.posh-tl-dot.gold { background: var(--gold); border-color: var(--gold-pale); }
.posh-tl-dot.navy { background: var(--navy); border-color: #EEF2FA; }
.posh-tl-line {
  width: 2px; flex: 1; min-height: 20px;
  background: linear-gradient(var(--teal-pale), transparent);
  margin: 4px 0;
}
.posh-tl-body { flex: 1; padding-bottom: 6px; }
.posh-tl-year {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--teal); margin-bottom: 4px;
}
.posh-tl-year.rose { color: var(--rose); }
.posh-tl-year.gold { color: var(--gold); }
.posh-tl-year.navy { color: var(--navy); }
.posh-tl-title { font-weight: 700; color: var(--ink); font-size: 14px; margin-bottom: 4px; }
.posh-tl-desc { font-size: 13px; color: var(--muted); line-height: 1.65; }

/* ── STEPS ── */
.posh-steps { list-style: none; padding: 0; margin: 16px 0; counter-reset: pstep; }
.posh-steps li {
  counter-increment: pstep;
  display: flex; gap: 14px;
  padding: 14px 18px; border-radius: 12px;
  margin-bottom: 10px;
  background: var(--sand); border: 1px solid var(--border);
  font-size: 14px; color: var(--ink-soft); line-height: 1.7;
}
.posh-steps li::before {
  content: counter(pstep);
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--teal); color: white;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}

/* ── HISTORY BANNER ── */
.posh-history-banner {
  background: linear-gradient(135deg, var(--navy), var(--navy-soft));
  border-radius: var(--r); padding: 36px 40px; margin-bottom: 24px;
  position: relative; overflow: hidden;
}
.posh-history-banner::before {
  content: '"';
  position: absolute; top: -20px; left: 20px;
  font-family: 'Playfair Display', serif;
  font-size: 180px; color: rgba(255,255,255,.04); line-height: 1;
  pointer-events: none;
}
.posh-history-banner h3 {
  font-family: 'Playfair Display', serif;
  font-size: 20px; color: #5DD5D5; margin-bottom: 12px;
}
.posh-history-banner p {
  font-size: 15px; color: rgba(255,255,255,.72);
  line-height: 1.85; font-weight: 300;
}
.posh-history-banner strong { color: white; font-weight: 600; }

/* ── DEFINITION CARD ── */
.posh-def-hero {
  background: linear-gradient(135deg, var(--teal), #004D4D);
  border-radius: var(--r); padding: 36px 40px; margin-bottom: 20px;
  color: white; position: relative; overflow: hidden;
}
.posh-def-hero::after {
  content: '§ 2(n)';
  position: absolute; right: 30px; bottom: 20px;
  font-family: 'Playfair Display', serif;
  font-size: 80px; color: rgba(255,255,255,.07); font-weight: 700;
  line-height: 1; pointer-events: none;
}
.posh-def-hero h3 {
  font-family: 'Playfair Display', serif;
  font-size: 22px; margin-bottom: 12px; color: #A0E8E8;
}
.posh-def-hero p { font-size: 16px; line-height: 1.8; color: rgba(255,255,255,.85); font-weight: 300; }
.posh-def-hero strong { color: white; font-weight: 600; }

/* ── HARASSMENT TYPES ── */
.posh-type-card {
  border-radius: 14px; padding: 22px; border: 1.5px solid var(--border);
  background: white;
}
.posh-type-icon { font-size: 28px; margin-bottom: 10px; }
.posh-type-title {
  font-family: 'Playfair Display', serif; font-size: 16px;
  font-weight: 700; color: var(--ink); margin-bottom: 6px;
}
.posh-type-desc { font-size: 13px; color: var(--muted); line-height: 1.65; margin-bottom: 10px; }
.posh-type-tag {
  display: inline-flex; padding: 3px 10px; border-radius: 20px;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px;
}
.tag-red { background: var(--rose-pale); color: var(--rose); }
.tag-amber { background: #FEF3C7; color: #92400E; }
.tag-teal { background: var(--teal-pale); color: var(--teal); }
.tag-navy { background: #EEF2FA; color: var(--navy); }

/* ── SCENARIO ACCORDION ── */
.posh-scenarios { display: flex; flex-direction: column; gap: 12px; margin: 16px 0; }
.posh-scenario {
  border-radius: 14px; border: 1.5px solid var(--border);
  background: white; overflow: hidden; transition: box-shadow .25s;
}
.posh-scenario:hover { box-shadow: var(--shadow-md); }
.posh-scenario-hdr {
  padding: 18px 22px; cursor: pointer;
  display: flex; align-items: flex-start; gap: 14px;
}
.posh-scenario-num {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--navy); color: white;
  font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.posh-scenario.green .posh-scenario-num { background: var(--teal); }
.posh-scenario-meta { flex: 1; }
.posh-scenario-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--muted); margin-bottom: 4px;
}
.posh-scenario-q {
  font-family: 'Playfair Display', serif; font-size: 15px;
  font-weight: 400; color: var(--ink); line-height: 1.45; font-style: italic;
}
.posh-scenario-chevron {
  font-size: 12px; color: var(--muted);
  transition: transform .25s; flex-shrink: 0; margin-top: 6px;
}
.posh-scenario.open .posh-scenario-chevron { transform: rotate(90deg); }
.posh-scenario-body {
  border-top: 1px solid var(--border); padding: 20px 22px;
  animation: fadeUp .3s ease;
}
@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.posh-scenario-verdict {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .8px; margin-bottom: 10px;
}
.verdict-yes { background: var(--rose-pale); color: var(--rose); }
.verdict-no  { background: var(--success-pale); color: var(--success); }
.posh-scenario-type { font-size: 12px; font-weight: 700; color: var(--teal); margin-bottom: 6px; }
.posh-scenario-explain { font-size: 14px; color: var(--ink-soft); line-height: 1.75; }
.posh-scenario-legal {
  margin-top: 10px; padding: 9px 13px;
  background: #EEF2FA; border-radius: 8px;
  font-size: 12px; color: var(--navy-soft); font-weight: 600;
}

/* ── ICC COMPOSITION ── */
.posh-icc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin: 16px 0; }
.posh-icc-card { border-radius: 14px; padding: 20px; border: 1.5px solid var(--border); }
.posh-icc-card.presiding { background: linear-gradient(135deg, var(--navy), var(--navy-soft)); }
.posh-icc-card.presiding h4 { color: white; }
.posh-icc-card.presiding p  { color: rgba(255,255,255,.62); }
.posh-icc-card.member { background: var(--teal-pale); }
.posh-icc-card.member h4 { color: var(--teal); }
.posh-icc-card.member p  { color: var(--muted); }
.posh-icc-card.external { background: var(--gold-pale); }
.posh-icc-card.external h4 { color: var(--gold); }
.posh-icc-card.external p  { color: var(--muted); }
.posh-icc-card h4 {
  font-family: 'Playfair Display', serif; font-size: 15px;
  font-weight: 700; margin-bottom: 6px;
}
.posh-icc-card p { font-size: 13px; line-height: 1.65; }
.posh-icc-rule {
  background: var(--sand); border-radius: 10px; padding: 12px 16px;
  font-size: 13px; color: var(--muted); font-weight: 500;
  display: flex; align-items: center; gap: 8px;
  margin-top: 12px;
}

/* ── COMPLIANCE CHECKLIST ── */
.posh-checklist { list-style: none; padding: 0; margin: 16px 0; }
.posh-checklist li {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 16px; border-radius: 10px; margin-bottom: 8px;
  background: white; border: 1.5px solid var(--border);
  font-size: 14px; color: var(--ink-soft); line-height: 1.65;
  cursor: pointer; transition: all .18s;
}
.posh-checklist li:hover { border-color: var(--teal); background: var(--teal-ultra); }
.posh-checklist li.done { background: var(--success-pale); border-color: var(--success); }
.posh-checklist li.mandatory { border-left-width: 4px; border-left-color: var(--teal); }
.posh-checklist li.mandatory.done { border-left-color: var(--success); }
.posh-cb {
  width: 22px; height: 22px; border-radius: 6px;
  border: 2px solid var(--border); background: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; flex-shrink: 0; margin-top: 1px;
  transition: all .18s;
}
.posh-checklist li.done .posh-cb { background: var(--success); border-color: var(--success); color: white; }

/* ── SCORE BAR ── */
.posh-score-wrap {
  background: linear-gradient(135deg, var(--teal), #004D4D);
  border-radius: var(--r); padding: 24px 28px; margin-bottom: 16px;
  color: white;
}
.posh-score-top { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
.posh-score-num {
  font-family: 'Playfair Display', serif; font-size: 48px;
  font-weight: 700; color: white; line-height: 1;
}
.posh-score-label { font-size: 13px; color: rgba(255,255,255,.65); font-weight: 600; }
.posh-score-status {
  padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; margin-left: auto;
}
.status-compliant { background: rgba(26,122,74,.3); color: #6DE8A8; }
.status-partial   { background: rgba(160,121,10,.3); color: #FFD080; }
.status-low       { background: rgba(192,57,43,.3);  color: #FFAAAA; }
.posh-bar-bg { height: 8px; background: rgba(255,255,255,.18); border-radius: 4px; overflow: hidden; }
.posh-bar-fill { height: 100%; border-radius: 4px; transition: width .6s ease; }

/* ── PENALTY TABLE ── */
.posh-table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; font-size: 13px; margin: 16px 0; }
.posh-table th { background: var(--navy); color: white; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.posh-table td { padding: 11px 14px; border-bottom: 1px solid var(--border); color: var(--ink-soft); line-height: 1.55; vertical-align: top; }
.posh-table tr:nth-child(even) td { background: rgba(15,25,35,.02); }
.posh-badge { padding: 2px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; }
.badge-high { background: var(--rose-pale); color: var(--rose); }
.badge-mid  { background: var(--gold-pale); color: var(--gold); }

/* ── HELPLINES ── */
.posh-sos-banner {
  background: linear-gradient(135deg, #8B1A1A, #A0291E);
  border-radius: var(--r); padding: 24px 28px; margin-bottom: 16px;
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.posh-sos-big { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 700; color: white; line-height: 1; }
.posh-sos-info h4 { font-family: 'Playfair Display', serif; font-size: 18px; color: white; margin-bottom: 4px; }
.posh-sos-info p  { font-size: 13px; color: rgba(255,255,255,.7); }
.posh-helplines { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px,1fr)); gap: 10px; margin: 16px 0; }
.posh-hcard { background: var(--navy); border-radius: 12px; padding: 16px 18px; }
.posh-hcard h4 { font-family: 'Playfair Display', serif; font-size: 13px; color: white; margin-bottom: 4px; }
.posh-hcard .num { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #5DD5D5; display: block; margin: 4px 0; }
.posh-hcard .avl { font-size: 11px; color: rgba(255,255,255,.45); }
.posh-hcard .eml { font-size: 10px; color: rgba(255,255,255,.4); margin-top: 3px; word-break: break-all; }

/* ── MYTHS TABLE ── */
.posh-myths { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; font-size: 13px; margin: 16px 0; }
.posh-myths th { background: var(--ink); color: white; padding: 10px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.posh-myths td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--ink-soft); line-height: 1.6; vertical-align: top; }
.posh-myths tr:nth-child(even) td { background: rgba(15,25,35,.02); }
.myth-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--rose); display: block; margin-bottom: 4px; }
.fact-lbl  { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--success); display: block; margin-bottom: 4px; }

/* ── GLOSSARY ── */
.posh-glossary { list-style: none; padding: 0; margin: 16px 0; }
.posh-glossary li {
  padding: 12px 16px; border-radius: 10px; margin-bottom: 8px;
  background: var(--sand); border: 1px solid var(--border);
  font-size: 14px; color: var(--ink-soft); line-height: 1.65;
}
.posh-glossary li strong { color: var(--ink); font-weight: 700; }

/* ── RIGHTS GRID ── */
.posh-rights { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0; }
.posh-right-card { background: var(--sand); border-radius: 14px; padding: 18px 20px; border: 1.5px solid var(--border); }
.posh-right-n { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: var(--teal); line-height: 1; margin-bottom: 6px; }
.posh-right-title { font-weight: 700; color: var(--ink); font-size: 14px; margin-bottom: 4px; }
.posh-right-desc { font-size: 12px; color: var(--muted); line-height: 1.65; }
.posh-right-law { font-size: 11px; font-weight: 700; color: var(--navy-soft); margin-top: 6px; }

/* ── BEYOND COMPLIANCE ── */
.posh-beyond {
  background: linear-gradient(135deg, var(--teal), #004D4D);
  border-radius: var(--r); padding: 36px 40px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: center;
}
.posh-beyond-left h3 {
  font-family: 'Playfair Display', serif;
  font-size: 26px; color: white; margin-bottom: 12px; line-height: 1.3;
}
.posh-beyond-left p { font-size: 15px; color: rgba(255,255,255,.72); line-height: 1.75; font-weight: 300; }
.posh-beyond-items { display: flex; flex-direction: column; gap: 10px; }
.posh-beyond-item {
  background: rgba(255,255,255,.1); border-radius: 10px; padding: 13px 16px;
  font-size: 14px; color: rgba(255,255,255,.85); font-weight: 500;
  display: flex; align-items: center; gap: 10px;
}
.posh-beyond-item::before { content: '✓'; color: #5DD5D5; font-weight: 700; flex-shrink: 0; }

/* ── ONLINE PORTAL ── */
.posh-portal {
  background: linear-gradient(135deg, var(--navy), var(--navy-soft));
  border-radius: 14px; padding: 22px 26px; margin: 16px 0;
  display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap;
}
.posh-portal h4 { font-family: 'Playfair Display', serif; font-size: 16px; color: white; margin-bottom: 4px; }
.posh-portal p  { font-size: 13px; color: rgba(255,255,255,.65); }
.posh-portal a {
  display: inline-block; margin-top: 10px;
  background: var(--teal-light); color: white;
  padding: 8px 18px; border-radius: 50px;
  font-size: 13px; font-weight: 700; text-decoration: none;
  transition: background .2s;
}
.posh-portal a:hover { background: var(--teal); }

/* ── DIVIDER ── */
.posh-divider { height: 1px; background: var(--border); margin: 40px 0; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .posh-nav { padding: 0 16px; }
  .posh-hero { padding: 48px 20px 40px; }
  .posh-body { padding: 0 16px 60px; }
  .posh-2col, .posh-3col, .posh-rights, .posh-beyond { grid-template-columns: 1fr; }
  .posh-helplines { grid-template-columns: 1fr 1fr; }
  .posh-hero-h1 { font-size: 32px; }
  .posh-icc-grid { grid-template-columns: 1fr; }
}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 1, label: "Scenario 1 — Compliments or Harassment?",
    q: '"Clients will definitely listen to you when you dress like that." "You look really hot today." — repeated by a colleague in team meetings.',
    isHarass: true,
    type: "Hostile Work Environment — Section 2(n)",
    explain: "These are not compliments — they are sexually coloured remarks, which POSH explicitly lists as harassment. The test is whether the conduct is unwelcome to YOU, not whether the speaker 'meant well.' Repetition in public meetings aggravates the offence.",
    legal: "§2(n) POSH: 'sexually coloured remarks' are sexual harassment. Intent of the speaker has zero legal relevance — unwelcomeness is the standard.",
  },
  {
    id: 2, label: "Scenario 2 — Physical Contact & Proximity",
    q: 'A manager often places his hand on an employee\'s shoulder or back and stands very close while speaking. He says "I\'m just being friendly."',
    isHarass: true,
    type: "Physical Advances — Section 2(n)(i)",
    explain: "Under POSH, IMPACT matters, not intent. The employee's discomfort is the legal standard, not the manager's stated friendliness. Repeated unwelcome physical proximity and touching constitutes 'physical contact or advances' under the Act.",
    legal: "§2(n)(i) POSH: 'physical contact or advances' — includes unwanted touching even if framed as friendly. Complaint can be filed without direct evidence; IC assesses reasonable probability.",
  },
  {
    id: 3, label: "Scenario 3 — Digital Workplace",
    q: "Employees share sexual jokes, memes, or explicit reels in a team WhatsApp group used for work communication. Some employees feel uncomfortable but hesitate to object.",
    isHarass: true,
    type: "Digital Harassment — Extended Workplace",
    explain: "Work messaging groups — WhatsApp, Slack, Teams — ARE the workplace under POSH. Sharing explicit content that makes colleagues uncomfortable is 'showing pornography' or 'sexually coloured' conduct under the Act. Silence from recipients does not constitute consent.",
    legal: "§2(o) POSH defines workplace to include digital/virtual spaces. §2(n)(iv): 'showing pornography' is explicitly listed as harassment.",
  },
  {
    id: 4, label: "Scenario 4 — Quid Pro Quo",
    q: '"If you spend some time with me outside office, I can help you get that promotion."',
    isHarass: true,
    type: "Quid Pro Quo — Abuse of Authority",
    explain: "Tying a professional benefit (promotion) to time/favours of a sexual implication is Quid Pro Quo — one of the most serious forms of POSH violation. Power imbalance makes this particularly egregious. The offence is complete the moment the condition is stated — you need not comply or be harmed.",
    legal: "§2(n)(ii) POSH: 'demand or request for sexual favours.' §3(2)(ii): implied or explicit promise of preferential treatment.",
  },
  {
    id: 5, label: "Scenario 5 — Consensual Relationship",
    q: "Two colleagues are in a consensual relationship. Later, after a disagreement, one person alleges harassment. What makes behaviour harassment vs. mutual interaction?",
    isHarass: false,
    type: "Context & Consent — Not automatically harassment",
    explain: "During an active, mutually consented relationship, interactions are mutual. However, if consent is WITHDRAWN — due to a breakup or clearly communicated boundary — any continued unwelcome advances DO constitute harassment. The IC examines the full context and timeline. Filing a complaint does not guarantee a finding of harassment; the IC must conduct a fair inquiry.",
    legal: "§11 POSH: IC conducts inquiry based on reasonable probability. Consent is dynamic — once withdrawn, continued advances become actionable. §14: knowingly false complaints are separately punishable.",
  },
];

const COMPLIANCE_ITEMS = [
  { id: "c1", text: "POSH Policy formally adopted and signed by employer/management", sub: "Must define harassment, procedure, and disciplinary consequences", mandatory: true },
  { id: "c2", text: "ICC constituted by written notification for all locations with 10+ employees", sub: "Verbal constitution is invalid — a formal order is required", mandatory: true },
  { id: "c3", text: "Presiding Officer is a senior woman employee (or nominated from another office)", sub: "If unavailable internally, must nominate from another administrative unit", mandatory: true },
  { id: "c4", text: "ICC has minimum 4 members; at least 50% are women", sub: "External member must have no employment relationship with the organisation", mandatory: true },
  { id: "c5", text: "ICC contact details visibly displayed at all office and branch locations", sub: "Name, phone, and email of Presiding Officer must be posted conspicuously", mandatory: true },
  { id: "c6", text: "Policy shared at onboarding with signed acknowledgement from every employee", sub: "Covers regular, contractual, intern, trainee, and daily-wage staff equally", mandatory: true },
  { id: "c7", text: "All employees received POSH awareness training (and records maintained)", sub: "Date, content, attendance register, and signed acknowledgements — kept on file", mandatory: true },
  { id: "c8", text: "ICC members trained on inquiry procedure, natural justice, evidence assessment", sub: "Untrained IC members risk legal challenge to findings", mandatory: true },
  { id: "c9", text: "Policy covers digital and online harassment explicitly", sub: "WhatsApp, email, social media, and all digital communications", mandatory: false },
  { id: "c10", text: "Annual POSH Report submitted to employer and District Officer (Jan–Dec cycle)", sub: "Section 21: mandatory submission — includes complaints, resolutions, pending cases, training", mandatory: true },
  { id: "c11", text: "Complaint records maintained confidentially for minimum 5 years", sub: "No disclosure of identity in records or in the Annual Report", mandatory: true },
  { id: "c12", text: "Board Resolution passed to formally constitute IC (if Board exists)", sub: "Vests quasi-judicial powers in the IC", mandatory: false },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function POSHPage() {
  const [openScenarios, setOpenScenarios] = useState({});
  const [checked, setChecked] = useState({});
  const [activeNav, setActiveNav] = useState("intro");
  const sectionRefs = useRef({});

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const toggleScenario = (id) => setOpenScenarios(p => ({ ...p, [id]: !p[id] }));
  const toggleCheck = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const done = Object.values(checked).filter(Boolean).length;
  const total = COMPLIANCE_ITEMS.length;
  const pct = Math.round((done / total) * 100);
  const barColor = pct >= 80 ? "#1A7A4A" : pct >= 50 ? "#A0790A" : "#C0392B";
  const statusKey = pct >= 80 ? "compliant" : pct >= 50 ? "partial" : "low";
  const statusLabel = pct >= 80 ? "✅ Largely Compliant" : pct >= 50 ? "⚠️ Partially Compliant" : "🔴 Non-Compliant";

  const scrollTo = (id) => {
    setActiveNav(id);
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const NAV_ITEMS = [
    { id: "intro", label: "Introduction" },
    { id: "history", label: "History" },
    { id: "definition", label: "What is Harassment?" },
    { id: "workplace", label: "Workplace" },
    { id: "rights", label: "Your Rights" },
    { id: "icc", label: "ICC / LCC" },
    { id: "how", label: "How to File" },
    { id: "timeline", label: "Timeline" },
    { id: "scenarios", label: "Scenarios" },
    { id: "compliance", label: "Compliance" },
    { id: "penalties", label: "Penalties" },
    { id: "beyond", label: "Beyond Compliance" },
    { id: "myths", label: "Myths & Facts" },
    { id: "helplines", label: "Helplines" },
  ];

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav className="posh-nav">
        <span className="posh-nav-brand">Secret Sharz</span>
        <div className="posh-nav-tabs">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`posh-nav-tab ${activeNav === n.id ? "active" : ""}`}
              onClick={() => scrollTo(n.id)}>{n.label}</button>
          ))}
        </div>
        <a href="tel:181" className="posh-sos-pill">🆘 Helpline: 181</a>
      </nav>

      {/* ── HERO ── */}
      <div className="posh-hero">
        <div className="posh-hero-mesh" />
        <div className="posh-hero-lines" />
        <div className="posh-hero-inner">
          <div className="posh-hero-badge">POSH Act, 2013 — Complete Resource</div>
          <h1 className="posh-hero-h1">
            Prevention of<br />Sexual Harassment<br /><em>at the Workplace</em>
          </h1>
          <p className="posh-hero-sub">
            India's most comprehensive POSH resource — covering the full history, legal definitions, ICC formation, compliance obligations, real-world scenarios, your rights as a woman, and how to file a complaint. Designed for employees, employers, HR teams, and POSH trainers.
          </p>
          <div className="posh-hero-stats">
            {[
              { n: "2013", l: "Year enacted" },
              { n: "10+", l: "Employees → ICC mandatory" },
              { n: "90", l: "Days to file complaint" },
              { n: "₹50K", l: "Fine for non-compliance" },
            ].map(s => (
              <div key={s.n} className="posh-stat">
                <div className="posh-stat-n">{s.n}</div>
                <div className="posh-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="posh-hero-sos">
            {[
              { num: "181", label: "Women Helpline", sub: "Free · 24/7 · All states" },
              { num: "7217735372", label: "NCW", sub: "Mon–Fri, office hours" },
              { num: "shebox.nic.in", label: "Online Complaint", sub: "No office visit needed" },
              { num: "1098", label: "Childline (under 18)", sub: "Free · 24/7" },
            ].map(s => (
              <div key={s.num} className="posh-hero-sos-card">
                <div className="posh-hero-sos-num">{s.num}</div>
                <div className="posh-hero-sos-label">{s.label}</div>
                <div className="posh-hero-sos-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="posh-hero-note">
            ⚖️ Based on the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013. For situation-specific legal advice, consult a qualified advocate or call iCall: 9152987821.
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="posh-body">

        {/* ─ INTRODUCTION ─ */}
        <div id="section-intro" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Introduction</div>
            <h2 className="posh-section-h2">What is the POSH Act?</h2>
            <p className="posh-section-sub">India's primary law protecting women from sexual harassment at the workplace, enacted 9 December 2013.</p>
          </div>
          <p className="posh-body-text">
            Every employee has the right to work in an environment where they feel secure and valued. Sexual harassment at the workplace not only affects an individual's dignity and emotional well-being, but can also impact productivity, mental health, and professional growth. Recognising this, the Government of India enacted the <strong>Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013</strong>, commonly known as the <strong>POSH Act</strong>.
          </p>
          <div className="posh-2col">
            <div className="posh-box posh-box-teal">
              <h4>🎯 Objective of the Act</h4>
              <ul>
                <li><strong>Prevent</strong> incidents of sexual harassment</li>
                <li><strong>Prohibit</strong> such behaviour at all workplaces</li>
                <li><strong>Redress</strong> complaints through a fair, time-bound inquiry</li>
                <li>Protect complainants from retaliation and secondary harm</li>
              </ul>
            </div>
            <div className="posh-box posh-box-navy">
              <h4>👥 Who does it protect?</h4>
              <ul>
                <li>All women at a workplace — regardless of role</li>
                <li>Permanent, contractual, temporary, ad hoc, daily wage</li>
                <li>Interns, trainees, apprentices, volunteers</li>
                <li>Domestic workers placed through an agency</li>
              </ul>
            </div>
          </div>
          <div className="posh-box posh-box-gold" style={{ marginTop: 0 }}>
            <h4>⚠️ Who is NOT covered under POSH?</h4>
            <p><strong>Men (above 18):</strong> The POSH Act does not legally cover men as complainants. However, organisations may allow the IC to examine such complaints internally under their internal policy. There is no specific legal framework under POSH for men. <strong>Transgender persons</strong> may approach the IC or file an FIR depending on the nature of the incident and applicable legal provisions.</p>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ HISTORY ─ */}
        <div id="section-history" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">History</div>
            <h2 className="posh-section-h2">The Road to POSH</h2>
            <p className="posh-section-sub">Three decades of legal evolution — from a landmark rape case to India's most comprehensive workplace safety law.</p>
          </div>
          <div className="posh-history-banner">
            <h3>The Bhanwari Devi Case — The Spark</h3>
            <p>
              In <strong>1992</strong>, Bhanwari Devi, a social worker in Rajasthan, was gang-raped by upper-caste men for attempting to prevent a child marriage. The subsequent failure of the justice system brought national attention to the systemic vulnerability of women in their workplaces. Her case became the catalyst for India's first legal framework on workplace sexual harassment.
            </p>
          </div>
          <div className="posh-timeline">
            {[
              { year: "1979", color: "gold", dot: "gold", title: "CEDAW — International Foundation", desc: "The UN Convention on the Elimination of All Forms of Discrimination Against Women (CEDAW) was adopted. India ratified CEDAW in 1993, creating an international obligation to legislate against workplace discrimination." },
              { year: "1992", color: "rose", dot: "rose", title: "Bhanwari Devi Case", desc: "A state government social worker was gang-raped while performing her duties. The case exposed the complete absence of legal protection for women in the workplace and galvanised the women's rights movement in India." },
              { year: "1997", color: "", dot: "", title: "Vishaka Guidelines — Supreme Court", desc: "In Vishaka vs. State of Rajasthan, the Supreme Court issued binding guidelines establishing the first legal framework to address workplace sexual harassment. The Court recognised it as a violation of fundamental rights under Articles 14, 19, and 21 of the Constitution." },
              { year: "2012", color: "rose", dot: "rose", title: "Nirbhaya Case", desc: "The brutal gang rape of a student in Delhi triggered nationwide protests and accelerated legislative action on all forms of violence against women, including at the workplace." },
              { year: "2013", color: "", dot: "", title: "POSH Act Enacted", desc: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act came into force on 9 December 2013 — 16 years after the Vishaka Guidelines. It created mandatory ICCs, defined harassment comprehensively, and established the LCC system for smaller workplaces." },
            ].map((item, i) => (
              <div key={i} className="posh-tl-item">
                <div className="posh-tl-spine">
                  <div className={`posh-tl-dot ${item.dot}`} />
                  {i < 4 && <div className="posh-tl-line" />}
                </div>
                <div className="posh-tl-body">
                  <div className={`posh-tl-year ${item.color}`}>{item.year}</div>
                  <div className="posh-tl-title">{item.title}</div>
                  <div className="posh-tl-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ DEFINITION ─ */}
        <div id="section-definition" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Legal Definition</div>
            <h2 className="posh-section-h2">What is Sexual Harassment?</h2>
            <p className="posh-section-sub">Section 2(n) of POSH — the standard is your discomfort, not the perpetrator's intention.</p>
          </div>
          <div className="posh-def-hero">
            <h3>The Core Principle: Unwelcomeness</h3>
            <p>Sexual harassment includes one or more <strong>unwelcome acts or behaviour</strong> — whether directly or by implication — of a sexual nature. The legal test is whether the conduct was <strong>unwelcome to the recipient</strong>. The intent of the person doing it is legally irrelevant. <em>Impact, not intent, is the standard.</em></p>
          </div>

          <div className="posh-3col">
            {[
              { icon: "🤝", title: "Physical Contact or Advances", desc: "Unwanted touching, brushing against, hugging, or any physical advance of a sexual nature.", tag: "Physical", tagClass: "tag-red" },
              { icon: "💬", title: "Demand for Sexual Favours", desc: "Requests — explicit or implied — for sexual acts, with or without a promise of professional benefit.", tag: "Quid Pro Quo", tagClass: "tag-amber" },
              { icon: "🗣️", title: "Sexually Coloured Remarks", desc: "Comments about appearance, body, or personal life that have a sexual undertone — framed as jokes or compliments.", tag: "Verbal", tagClass: "tag-teal" },
              { icon: "📱", title: "Showing Pornography", desc: "Displaying, sharing, or sending explicit images, videos, GIFs, or links — digitally or physically.", tag: "Visual", tagClass: "tag-navy" },
              { icon: "📩", title: "Digital Harassment", desc: "Sexually explicit messages, emails, WhatsApp, social media DMs, or content in work group chats.", tag: "Digital", tagClass: "tag-teal" },
              { icon: "😶", title: "Non-Verbal Conduct", desc: "Leering, staring, offensive gestures, winking, or expressions of a sexual nature that cause discomfort.", tag: "Non-Verbal", tagClass: "tag-amber" },
            ].map(c => (
              <div key={c.title} className="posh-type-card">
                <div className="posh-type-icon">{c.icon}</div>
                <div className="posh-type-title">{c.title}</div>
                <div className="posh-type-desc">{c.desc}</div>
                <span className={`posh-type-tag ${c.tagClass}`}>{c.tag}</span>
              </div>
            ))}
          </div>

          <div className="posh-2col" style={{ marginTop: 8 }}>
            <div style={{ background: "#EEF2FA", borderRadius: 14, padding: "20px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 10 }}>⚡ Quid Pro Quo</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>Employment benefits — promotion, favourable assignments, salary increases, job security — are made conditional on sexual favours or compliance. This is an <strong>abuse of authority</strong> and is considered one of the gravest forms of harassment.</p>
            </div>
            <div style={{ background: "var(--rose-pale)", borderRadius: 14, padding: "20px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "var(--rose)", marginBottom: 10 }}>🌡️ Hostile Work Environment</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>Repeated sexual conduct — jokes, remarks, staring, content sharing — that creates a work environment that is intimidating, hostile, or offensive. No specific threat or offer need be made.</p>
            </div>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ WORKPLACE ─ */}
        <div id="section-workplace" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Scope</div>
            <h2 className="posh-section-h2">What Counts as a Workplace?</h2>
            <p className="posh-section-sub">Section 2(o) — the definition is deliberately broad, covering far more than just the physical office.</p>
          </div>
          <p className="posh-body-text">The POSH Act applies not only to physical offices but also to virtual and digital workspaces. The Act defines a workplace broadly to include any department, organisation, office, institution, or place visited by an employee in the course of work.</p>
          <div className="posh-3col">
            {[
              { icon: "🏢", title: "Physical Offices", desc: "Your main workplace, branch offices, client offices, factory floors, hospitals, schools, colleges." },
              { icon: "🚗", title: "Employer-Arranged Transport", desc: "Office cabs, buses, flights booked for work travel — all count as extensions of the workplace." },
              { icon: "🏨", title: "Company Trips & Offsites", desc: "Annual offsites, team trips, conferences, and client entertainment — covered regardless of day or time." },
              { icon: "💻", title: "Virtual Meetings", desc: "Zoom, Teams, Google Meet — your digital meeting room is a workplace. POSH applies fully." },
              { icon: "📲", title: "Work Group Chats", desc: "WhatsApp groups, Slack channels, email threads — digital communication between colleagues is covered." },
              { icon: "🍽️", title: "Work Dinners & Events", desc: "Client dinners, office parties, and networking events arising from the employment relationship." },
            ].map(c => (
              <div key={c.title} className="posh-type-card">
                <div className="posh-type-icon">{c.icon}</div>
                <div className="posh-type-title">{c.title}</div>
                <div className="posh-type-desc">{c.desc}</div>
              </div>
            ))}
          </div>
          <div className="posh-box posh-box-teal" style={{ marginTop: 8 }}>
            <h4>📌 The Digital Workplace — Fully Covered</h4>
            <p>This interpretation extends to online meetings, work-related messaging platforms, emails, and other virtual interactions, making POSH applicable in remote and hybrid work environments. Device ownership and time of day are irrelevant — the test is whether the conduct arose from the employment relationship.</p>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ YOUR RIGHTS ─ */}
        <div id="section-rights" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">For Women — Know Your Rights</div>
            <h2 className="posh-section-h2">Your 8 Legal Rights Under POSH</h2>
            <p className="posh-section-sub">These are legally enforceable rights — not optional policies. Every woman at an Indian workplace is entitled to all eight.</p>
          </div>
          <div className="posh-rights">
            {[
              { n: "01", t: "Safe Workplace", d: "Your employer is legally obligated to provide a harassment-free environment. This duty cannot be waived or contracted away.", l: "Section 19(a)" },
              { n: "02", t: "Right to File a Complaint", d: "File with the ICC within 3 months of the incident — extendable by another 3 months. You may also file on behalf of a colleague unable to do so.", l: "Section 9" },
              { n: "03", t: "Absolute Confidentiality", d: "Your identity, complaint, proceedings, and findings are strictly confidential at all times — even after the case closes. Media cannot name you.", l: "Sections 16–17" },
              { n: "04", t: "Interim Protection", d: "Request ICC to recommend your transfer, grant paid leave up to 3 months, or direct the respondent not to contact you — while inquiry is ongoing.", l: "Section 12" },
              { n: "05", t: "No Retaliation", d: "Any adverse employment action for filing — reassignment, demotion, isolation, removal of benefits — is a separate POSH violation with independent penalties.", l: "Section 17" },
              { n: "06", t: "Fair Inquiry", d: "You present your case, submit evidence, and name witnesses. You will never be directly cross-examined by the respondent or their representative.", l: "Sections 11–13" },
              { n: "07", t: "Compensation", d: "If upheld, you receive monetary compensation for mental trauma, career loss, and medical expenses — paid by the employer or deducted from the respondent.", l: "Section 15" },
              { n: "08", t: "Parallel Criminal Action", d: "A POSH complaint does not prevent you from simultaneously filing under IPC Sections 354, 354A, or 509. Both processes run in parallel.", l: "IPC + POSH" },
            ].map(r => (
              <div key={r.n} className="posh-right-card">
                <div className="posh-right-n">{r.n}</div>
                <div className="posh-right-title">{r.t}</div>
                <div className="posh-right-desc">{r.d}</div>
                <div className="posh-right-law">📌 {r.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ ICC / LCC ─ */}
        <div id="section-icc" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Committees</div>
            <h2 className="posh-section-h2">ICC & LCC — Who Handles Your Complaint</h2>
            <p className="posh-section-sub">Two statutory bodies — Internal Complaints Committee and Local Complaints Committee — cover every workplace in India.</p>
          </div>
          <div className="posh-2col">
            <div style={{ background: "#EEF2FA", borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 10 }}>🏢 ICC — Internal Complaints Committee</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 10 }}>Mandatory for every employer with <strong>10 or more employees</strong>. Must be formed at every office location meeting this threshold. Has quasi-judicial powers similar to a civil court during inquiry.</p>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>📌 Ask HR for contact details. Must be displayed at the workplace.</div>
            </div>
            <div style={{ background: "var(--rose-pale)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "var(--rose)", marginBottom: 10 }}>🏛️ LCC — Local Complaints Committee</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 10 }}>For organisations with <strong>fewer than 10 employees</strong>, or when the complaint is against the employer, or when no ICC exists. Formed by the District Collector's office. Also handles complaints for unorganised sector workers.</p>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>📌 Contact: District Collector's / DM's office, or call 181.</div>
            </div>
          </div>

          <div style={{ marginTop: 28, marginBottom: 12 }}>
            <div className="posh-section-eyebrow" style={{ marginBottom: 14 }}>ICC Composition — Section 4</div>
          </div>
          <div className="posh-icc-grid">
            <div className="posh-icc-card presiding">
              <h4>👩 Presiding Officer</h4>
              <p>Must be a senior woman employee. If unavailable internally, nominate from another office or administrative unit. She leads all ICC proceedings.</p>
            </div>
            <div className="posh-icc-card member">
              <h4>👥 Employee Members (min. 2)</h4>
              <p>Preferably employees with commitment to women's rights, or those with legal knowledge and social work experience.</p>
            </div>
            <div className="posh-icc-card external">
              <h4>🌐 External Member (1)</h4>
              <p>From an NGO, association committed to women's rights, or a person familiar with workplace harassment. Must have NO employment relationship with the organisation.</p>
            </div>
          </div>
          <div className="posh-icc-rule">⚖️ <strong>Critical rule:</strong> At least 50% of ALL ICC members must be women — counting the Presiding Officer, employee members, and external member together. Tenure: 3 years per member.</div>
          <div className="posh-icc-rule" style={{ marginTop: 8 }}>🔒 <strong>IC powers:</strong> The IC has powers similar to a civil court — it can summon witnesses, examine documents, and recommend actions with binding effect on the employer.</div>

          <div className="posh-box posh-box-rose" style={{ marginTop: 20 }}>
            <h4>🚨 If Neither ICC nor LCC is Functioning</h4>
            <p>File online at <strong>shebox.nic.in</strong> — no office visit required. Call NCW: <strong>7217735372</strong>. Contact your State Women's Commission. File a writ petition before the High Court if the state has failed to constitute an LCC.</p>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ HOW TO FILE ─ */}
        <div id="section-how" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Complaint Process</div>
            <h2 className="posh-section-h2">How to File a Complaint — Step by Step</h2>
            <p className="posh-section-sub">You do not need a lawyer to file. The process is designed so any woman can navigate it independently.</p>
          </div>
          <div className="posh-box posh-box-teal">
            <h4>📌 Before You File — Key Facts</h4>
            <ul>
              <li>Complaint must be in <strong>writing</strong> — anonymous complaints are generally not accepted</li>
              <li>File within <strong>90 days</strong> of the last incident (extendable by another 90 days with valid reasons)</li>
              <li>If filing on behalf of another, their <strong>written consent</strong> is required (unless they are unable to file themselves)</li>
              <li>You can file with or without direct evidence — IC decides based on reasonable probability</li>
            </ul>
          </div>
          <ol className="posh-steps">
            <li><strong>Document everything immediately.</strong> Write down dates, times, exact words used, location, witnesses present, and your emotional response. Screenshot and save all messages and emails before they can be deleted.</li>
            <li><strong>Identify your ICC or LCC.</strong> If 10+ employees, ask HR for ICC details (must be displayed at your workplace). If no ICC or fewer than 10 employees → contact LCC at the District Collector's office, or use SHe-Box online.</li>
            <li><strong>Write your complaint.</strong> Address to the ICC Presiding Officer. Include: what happened, when and where, who did it, witnesses, and the impact on you. Attach all evidence. A support person may assist you in drafting.</li>
            <li><strong>Submit within the deadline.</strong> 90 days from the most recent incident. If delayed, document the reasons — ICC may extend by another 90 days for valid cause.</li>
            <li><strong>Receive written acknowledgement.</strong> ICC must acknowledge in writing within 7 days. This is your proof the process has begun.</li>
            <li><strong>Request interim measures if needed.</strong> Ask ICC to recommend your transfer, the respondent's transfer, or grant you paid leave while inquiry is ongoing.</li>
            <li><strong>Attend inquiry proceedings.</strong> Present your case, submit additional evidence, name witnesses. You will never be directly cross-examined by the respondent.</li>
            <li><strong>Receive the report.</strong> ICC must conclude within 90 days. You receive a copy of the report and recommendations.</li>
            <li><strong>Follow up on implementation.</strong> Employer must implement ICC recommendations within 60 days. Non-implementation is a separate POSH violation.</li>
            <li><strong>Appeal if dissatisfied.</strong> Either party may file an appeal within 90 days of receiving the ICC decision.</li>
          </ol>
          <div className="posh-portal">
            <div>
              <h4>📱 File Online — SHe-Box Portal</h4>
              <p>Sexual Harassment electronic Box — Ministry of Women & Child Development. Covers both government and private sector employees. Your identity is fully protected.</p>
              <a href="https://shebox.nic.in" target="_blank" rel="noopener noreferrer">Open SHe-Box Portal →</a>
            </div>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ TIMELINE ─ */}
        <div id="section-timeline" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">90–90–90 Rule</div>
            <h2 className="posh-section-h2">Statutory Timeline</h2>
            <p className="posh-section-sub">The Act broadly follows a 90–90–90 framework — every stage has a legally mandated deadline.</p>
          </div>
          <div className="posh-timeline">
            {[
              { year: "Day 0", dot: "", title: "Complaint Received", desc: "ICC receives your written complaint. If you cannot write independently, the Presiding Officer must provide assistance. Include supporting documents and witness details." },
              { year: "Within 7 days", dot: "", title: "Acknowledgement + Notice to Respondent", desc: "ICC acknowledges in writing. A copy is sent to the respondent, who has 10 working days to file their written reply." },
              { year: "Optional only", dot: "gold", title: "Conciliation — Only If You Request", desc: "ICC may attempt settlement ONLY if you request it. You cannot be forced. No monetary payment can be part of any conciliation. If it fails or is not sought, the inquiry proceeds." },
              { year: "Days 10–90", dot: "", title: "Inquiry Proceedings", desc: "IC examines both parties separately. You present your case, submit evidence, and name witnesses. Natural justice principles apply. Employer must NOT interfere with IC proceedings." },
              { year: "Within 90 days", dot: "", title: "Report Submitted", desc: "ICC submits findings and recommendations to employer and District Officer. You receive a copy. Both parties may appeal within 90 days of the verdict." },
              { year: "60 days from report", dot: "navy", title: "Employer Implements", desc: "Employer must act on ICC recommendations within 60 days. Non-implementation is a separate POSH violation with penalties." },
            ].map((item, i) => (
              <div key={i} className="posh-tl-item">
                <div className="posh-tl-spine">
                  <div className={`posh-tl-dot ${item.dot}`} />
                  {i < 5 && <div className="posh-tl-line" />}
                </div>
                <div className="posh-tl-body">
                  <div className={`posh-tl-year ${item.dot}`}>{item.year}</div>
                  <div className="posh-tl-title">{item.title}</div>
                  <div className="posh-tl-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="posh-box posh-box-navy">
            <h4>🔒 Your Protections Throughout</h4>
            <ul>
              <li>Your identity and all proceedings are strictly confidential at all times</li>
              <li>Respondent cannot contact, intimidate, or retaliate against you during inquiry</li>
              <li>You may bring a support person of your choice to all proceedings</li>
              <li>ICC proceedings are quasi-judicial — employer cannot pressure or interfere</li>
            </ul>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ SCENARIOS ─ */}
        <div id="section-scenarios" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Real-World Application</div>
            <h2 className="posh-section-h2">Workplace Scenarios — Is This Harassment?</h2>
            <p className="posh-section-sub">5 real situations with POSH analysis. Use these in training sessions. Click each to reveal the legal answer.</p>
          </div>
          <div className="posh-scenarios">
            {SCENARIOS.map(s => (
              <div key={s.id} className={`posh-scenario ${openScenarios[s.id] ? "open" : ""} ${!s.isHarass ? "green" : ""}`}>
                <div className="posh-scenario-hdr" onClick={() => toggleScenario(s.id)}>
                  <div className="posh-scenario-num">{s.id}</div>
                  <div className="posh-scenario-meta">
                    <div className="posh-scenario-label">{s.label}</div>
                    <div className="posh-scenario-q">"{s.q}"</div>
                  </div>
                  <div className="posh-scenario-chevron">▶</div>
                </div>
                {openScenarios[s.id] && (
                  <div className="posh-scenario-body">
                    <div className={`posh-scenario-verdict ${s.isHarass ? "verdict-yes" : "verdict-no"}`}>
                      {s.isHarass ? "⚠️ This IS Sexual Harassment under POSH" : "✅ Not automatically harassment — context matters"}
                    </div>
                    <div className="posh-scenario-type">{s.type}</div>
                    <div className="posh-scenario-explain">{s.explain}</div>
                    <div className="posh-scenario-legal">📌 Legal basis: {s.legal}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="posh-box posh-box-gold" style={{ marginTop: 8 }}>
            <h4>⚖️ Consent & Context — The Key Distinction</h4>
            <p>In situations where colleagues are in a consensual relationship, interactions are mutual as long as there is clear and voluntary consent from both individuals. However, if the relationship ends or one person withdraws consent, any continued advances, pressure, or unwelcome behaviour may constitute harassment. Consent is dynamic — what was acceptable within a mutual relationship can become harassment once consent is withdrawn.</p>
          </div>
          <div className="posh-box posh-box-navy" style={{ marginTop: 8 }}>
            <h4>📌 On Misuse of POSH</h4>
            <p>Filing a complaint with <em>malicious intent</em> or submitting false or forged evidence is punishable under the Act. If the IC concludes a complaint was knowingly false, it may recommend action under service rules. However — <strong>the inability to prove a complaint does NOT automatically mean it was false or malicious.</strong> Filing in good faith is always protected.</p>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ COMPLIANCE ─ */}
        <div id="section-compliance" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">For Organisations</div>
            <h2 className="posh-section-h2">Compliance Checklist</h2>
            <p className="posh-section-sub">Tick off each item your organisation has in place. Your compliance score updates in real time.</p>
          </div>
          <div className="posh-score-wrap">
            <div className="posh-score-top">
              <div>
                <div className="posh-score-num">{pct}%</div>
                <div className="posh-score-label">{done} of {total} items complete</div>
              </div>
              <span className={`posh-score-status status-${statusKey}`}>{statusLabel}</span>
            </div>
            <div className="posh-bar-bg">
              <div className="posh-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
            </div>
          </div>
          <ul className="posh-checklist">
            {COMPLIANCE_ITEMS.map(item => (
              <li key={item.id}
                className={`${checked[item.id] ? "done" : ""} ${item.mandatory ? "mandatory" : ""}`}
                onClick={() => toggleCheck(item.id)}>
                <div className="posh-cb">{checked[item.id] ? "✓" : ""}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>{item.text}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{item.sub}</div>
                  {item.mandatory && (
                    <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "var(--teal-pale)", color: "var(--teal)" }}>⚠ Mandatory</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="posh-box posh-box-teal">
            <h4>📌 POSH applies even if you have only male employees currently</h4>
            <p>Compliance and awareness obligations do not depend on whether the organisation currently has female employees. As soon as any woman employee joins — in any capacity — these protections are fully operative. The training, policy, and ICC must already be in place.</p>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ PENALTIES ─ */}
        <div id="section-penalties" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Enforcement</div>
            <h2 className="posh-section-h2">Penalties for Non-Compliance</h2>
            <p className="posh-section-sub">Courts are increasingly willing to enforce these penalties. Non-compliance is not a minor administrative lapse.</p>
          </div>
          <table className="posh-table">
            <thead><tr><th>Violation</th><th>Penalty</th><th>Level</th></tr></thead>
            <tbody>
              {[
                ["Failure to constitute ICC (10+ employees)", "Fine up to ₹50,000", "high"],
                ["Second or subsequent violation", "Double penalty + possible cancellation/non-renewal of business licence", "high"],
                ["No POSH policy or failure to display ICC details", "₹50,000 fine — same general employer obligation violation", "high"],
                ["Disclosure of complainant's identity", "Fine up to ₹5,000 + service consequences for disclosing person", "mid"],
                ["Failure to submit Annual Report to District Officer", "Section 26 penalty applies", "mid"],
                ["Employer fails to implement ICC recommendations within 60 days", "Separate violation — fine + licence implications", "high"],
                ["Providing false information or obstructing IC proceedings", "Criminal consequences under IPC + POSH penalties", "high"],
                ["Retaliation against complainant", "Employer liable even if individual manager carried it out", "high"],
              ].map(([v, p, sev], i) => (
                <tr key={i}>
                  <td>{v}</td>
                  <td>{p}</td>
                  <td><span className={`posh-badge badge-${sev === "high" ? "high" : "mid"}`}>{sev === "high" ? "🔴 High" : "🟡 Medium"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="posh-box posh-box-rose">
            <h4>🚨 Business Licence Cancellation — A Real Risk</h4>
            <p>Section 26(2) POSH provides for cancellation or non-renewal of any licence, registration, or approval needed to carry on business — for repeated or aggravated violations. This covers business licences, factory licences, shop establishment registrations, and sector-specific approvals.</p>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ BEYOND COMPLIANCE ─ */}
        <div id="section-beyond" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Organisational Culture</div>
            <h2 className="posh-section-h2">Beyond Compliance</h2>
          </div>
          <div className="posh-beyond">
            <div className="posh-beyond-left">
              <h3>POSH is not just a legal requirement — it is a commitment to a respectful workplace culture.</h3>
              <p>Organisations that treat POSH as a genuine cultural priority — not a checkbox — see measurable improvements in retention, psychological safety, and talent quality. The law sets the floor. Leadership sets the ceiling.</p>
            </div>
            <div className="posh-beyond-items">
              {[
                "Creates a safe and dignified environment for all employees",
                "Builds trust, psychological safety, and open communication",
                "Attracts talent who value ethical, accountable workplaces",
                "Improves employee engagement and retention rates",
                "Encourages accountability and professional boundaries",
                "Reduces legal liability and reputational risk",
                "Contributes to an inclusive and respectful organisational culture",
              ].map(item => (
                <div key={item} className="posh-beyond-item">{item}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="posh-divider" />

        {/* ─ MYTHS ─ */}
        <div id="section-myths" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Awareness</div>
            <h2 className="posh-section-h2">Myths vs. Facts</h2>
            <p className="posh-section-sub">Common misconceptions that prevent women from exercising their rights — and the legal reality.</p>
          </div>
          <table className="posh-myths">
            <thead><tr><th>Myth</th><th>Fact — POSH Act, 2013</th></tr></thead>
            <tbody>
              {[
                ["Sexual harassment means only physical contact.", "POSH covers verbal, non-verbal, physical, and digital conduct. No physical touch is needed for a POSH offence."],
                ["If I can't prove it, filing is pointless.", "IC applies civil standard — balance of probabilities, not criminal 'beyond reasonable doubt.' Your statement is evidence."],
                ["Company under 10 employees — POSH doesn't apply.", "POSH applies to all workplaces. Smaller organisations use the LCC. No size exemption exists."],
                ["He meant it as a compliment — so it's not harassment.", "The test is unwelcomeness TO YOU. Intention has zero legal relevance under POSH."],
                ["Only permanent employees can file.", "Interns, trainees, volunteers, and contractual workers all have full POSH rights."],
                ["Filing will end my career here.", "Retaliation is an independently punishable POSH offence. Your identity is protected throughout."],
                ["The IC will side with management.", "IC must include an external member. Biased findings can be appealed to the employer, then to court."],
                ["I waited too long — I can't file.", "90 days from the most recent incident, extendable by another 90 days. Historical pattern evidence remains valid."],
                ["It only counts if it happened at the office.", "POSH covers company trips, client meetings, virtual calls, and all digital contact between colleagues."],
                ["A false complaint cannot be made — the complainant will be protected regardless.", "Knowingly malicious complaints with forged evidence ARE punishable. But an unproven complaint is NOT automatically malicious."],
              ].map(([myth, fact], i) => (
                <tr key={i}>
                  <td><span className="myth-lbl">Myth</span>{myth}</td>
                  <td><span className="fact-lbl">Fact</span>{fact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="posh-divider" />

        {/* ─ HELPLINES ─ */}
        <div id="section-helplines" className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Support</div>
            <h2 className="posh-section-h2">Helplines & Support — Contact for Help Now</h2>
          </div>
          <div className="posh-sos-banner">
            <div className="posh-sos-big">181</div>
            <div className="posh-sos-info">
              <h4>Women Helpline — Government of India</h4>
              <p>Free · 24 hours · 7 days · All states · Trained counsellors · Connects to police, shelter homes, legal aid, and local LCC contacts</p>
            </div>
          </div>
          <div className="posh-helplines">
            {[
              { name: "Police Emergency", num: "100", avail: "24/7", eml: "" },
              { name: "NCW — National Commission for Women", num: "7217735372", avail: "Mon–Fri, office hours", eml: "ncw@nic.in" },
              { name: "SHe-Box POSH Portal", num: "shebox.nic.in", avail: "Online — 24/7", eml: "" },
              { name: "iCall — Mental Health (TISS)", num: "9152987821", avail: "Mon–Sat, 8am–10pm", eml: "icall@tiss.edu" },
              { name: "NALSA — Free Legal Aid", num: "15100", avail: "Legal helpline", eml: "" },
              { name: "Kiran — Mental Health", num: "1800-599-0019", avail: "Free · 24/7", eml: "" },
              { name: "NCW Online Complaint", num: "ncwapps.nic.in", avail: "Online — 24/7", eml: "" },
              { name: "Childline (under 18)", num: "1098", avail: "Free · 24/7", eml: "" },
            ].map((h, i) => (
              <div key={i} className="posh-hcard">
                <h4>{h.name}</h4>
                <span className="num" style={{ fontSize: h.num.length > 12 ? "12px" : "20px" }}>{h.num}</span>
                <span className="avl">{h.avail}</span>
                {h.eml && <div className="eml">{h.eml}</div>}
              </div>
            ))}
          </div>
          <div className="posh-box posh-box-teal">
            <h4>📍 Key State Helplines</h4>
            <ul>
              <li><strong>Andhra Pradesh:</strong> +91-9009991911 · apwomenscommission@gmail.com</li>
              <li><strong>Karnataka:</strong> 080-22202364 · kswc@nic.in</li>
              <li><strong>Maharashtra:</strong> 022-26592707 · mscw@nic.in</li>
              <li><strong>Tamil Nadu:</strong> 044-28592750 · tnwc@nic.in</li>
              <li><strong>Telangana:</strong> 040-23390538 · tswc@telangana.gov.in</li>
              <li><strong>Delhi (DCW):</strong> 011-23379181 · dcw.delhi@nic.in</li>
              <li><strong>West Bengal:</strong> 033-22485880 · wbwc@nic.in</li>
            </ul>
          </div>
        </div>

        {/* ─ GLOSSARY ─ */}
        <div className="posh-section">
          <div className="posh-section-header">
            <div className="posh-section-eyebrow">Reference</div>
            <h2 className="posh-section-h2">Legal Glossary</h2>
          </div>
          <ul className="posh-glossary">
            {[
              ["POSH Act, 2013", "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act. India's primary law protecting women from workplace sexual harassment, enacted 9 December 2013."],
              ["Aggrieved Woman", "Any woman of any age employed at a workplace — directly, contractually, or through an agent — including interns, volunteers, trainees, and domestic workers."],
              ["ICC", "Internal Complaints Committee — mandatory for every employer with 10+ employees. Must include a senior woman Presiding Officer and an external NGO/legal member."],
              ["LCC", "Local Complaints Committee — district-level body for organisations with fewer than 10 employees, or when the complaint is against the employer."],
              ["Quid Pro Quo", "Latin: 'this for that.' Harassment where professional benefits are tied to sexual favours, explicitly or by implication."],
              ["Hostile Work Environment", "Workplace made intimidating or humiliating by repeated sexual conduct or remarks — even without a specific threat or offer."],
              ["Respondent", "The person against whom a POSH complaint is filed. Can be any individual — not only a company employee."],
              ["Conciliation", "Optional settlement offered by ICC only if the complainant requests it. Cannot include monetary payment. Not compulsory for the complainant."],
              ["SHe-Box", "Sexual Harassment electronic Box — Government of India online POSH complaint portal at shebox.nic.in."],
              ["Vishaka Guidelines", "1997 Supreme Court guidelines in Vishaka vs. State of Rajasthan — the first legal framework on workplace sexual harassment in India, preceding the POSH Act."],
              ["CEDAW", "Convention on the Elimination of All Forms of Discrimination Against Women — UN treaty (1979) ratified by India in 1993, providing the international foundation for POSH."],
              ["Section 354A IPC", "Criminal provision for sexual harassment. Can be filed simultaneously alongside a POSH complaint — both processes run in parallel."],
            ].map(([term, def]) => (
              <li key={term}><strong>{term}:</strong> {def}</li>
            ))}
          </ul>
        </div>

        {/* ─ FOOTER NOTE ─ */}
        <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(15,25,35,.04)", borderRadius: 12, fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--ink)" }}>📌 Disclaimer:</strong> This resource is for awareness and educational purposes. It is based on the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 and Rules. For situation-specific legal advice, consult a qualified advocate or call iCall (9152987821) or the NCW (ncw@nic.in · 7217735372).
        </div>
      </div>
    </div>
  );
}
