import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { useDashboard } from './context/DashboardContext';
import {
  demographicQuestions,
  realisticQuestions,
  investigativeQuestions,
  artisticQuestions,
  socialQuestions,
  enterprisingQuestions,
  conventionalQuestions,
  extracurricularQuestions,
  sectionMeta as SECTION_META,
} from './data/assessmentQuestions';

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');`;

const STYLES = `
  :root {
    --saffron:#E8650A;--gold:#F0A500;--teal:#0A5C63;--teal-light:#0E7F89;
    --cream:#FDF6EC;--parchment:#F5EDD8;--dark:#1C1208;--brown:#3D2205;
    --muted:#7A6248;--white:#FFFFFF;--success:#2D7D46;--warn:#B85C00;
    --danger:#8B1A1A;--shadow:0 8px 32px rgba(28,18,8,0.12);--radius:16px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  .ca-root{font-family:'DM Sans',sans-serif;min-height:100vh;background:var(--cream);color:var(--dark);background-image:radial-gradient(ellipse at 10% 20%,rgba(232,101,10,0.06) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(10,92,99,0.06) 0%,transparent 50%);}

  /* HEADER */
  .ca-header{background:var(--dark);padding:18px 40px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;border-bottom:3px solid var(--saffron);}
  .ca-logo{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--white);letter-spacing:-0.5px;cursor:pointer;}
  .ca-logo span{color:var(--gold);}
  .ca-badge{background:var(--saffron);color:white;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;}

  /* PROGRESS BAR */
  .ca-progress-wrap{background:var(--dark);padding:14px 40px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,0.06);}
  .ca-step-pills{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;flex:1;}
  .ca-step-pills::-webkit-scrollbar{display:none;}
  .ca-step-pill{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;white-space:nowrap;border:1px solid;transition:all .2s;cursor:default;}
  .ca-step-pill.done{background:rgba(45,125,70,.25);color:#4ABA78;border-color:rgba(45,125,70,.4);}
  .ca-step-pill.active{background:rgba(232,101,10,.25);color:var(--gold);border-color:rgba(232,101,10,.5);}
  .ca-step-pill.todo{background:rgba(255,255,255,.05);color:rgba(255,255,255,.3);border-color:rgba(255,255,255,.1);}
  .ca-progress-right{display:flex;align-items:center;gap:12px;flex-shrink:0;}
  .ca-progress-bar-bg{width:120px;height:5px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;}
  .ca-progress-fill{height:100%;background:linear-gradient(90deg,var(--saffron),var(--gold));border-radius:10px;transition:width 0.5s ease;}
  .ca-progress-pct{color:var(--gold);font-size:12px;font-weight:700;white-space:nowrap;}

  /* FORM CARD */
  .ca-form-card{max-width:820px;margin:40px auto;padding:0 20px 80px;}
  .ca-section-header{text-align:center;margin-bottom:36px;}
  .ca-section-badge{display:inline-block;background:rgba(232,101,10,.12);color:var(--saffron);padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;}
  .ca-section-header h2{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:var(--dark);margin-bottom:8px;}
  .ca-section-header p{color:var(--muted);font-size:15px;line-height:1.6;max-width:580px;margin:0 auto;}
  .ca-section-icon{font-size:40px;margin-bottom:10px;display:block;}

  /* FIELDS */
  .ca-field{margin-bottom:22px;}
  .ca-field label{display:block;font-size:14px;font-weight:600;color:var(--brown);margin-bottom:8px;}
  .ca-field input,.ca-field select,.ca-field textarea{width:100%;padding:14px 18px;border:2px solid rgba(61,34,5,0.15);border-radius:12px;font-size:15px;font-family:'DM Sans',sans-serif;background:white;color:var(--dark);transition:border-color 0.2s;outline:none;resize:vertical;}
  .ca-field input:focus,.ca-field select:focus,.ca-field textarea:focus{border-color:var(--saffron);}
  .ca-two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .ca-autofill-box{padding:14px 18px;background:#f8fafc;border-radius:12px;border:2px solid rgba(45,125,70,0.2);color:var(--dark);font-weight:600;font-size:15px;display:flex;justify-content:space-between;align-items:center;}
  .ca-autofill-tag{color:var(--success);font-size:12px;font-weight:700;}

  /* MULTI-SELECT CHIPS */
  .ca-chips-wrap{display:flex;flex-wrap:wrap;gap:10px;}
  .ca-chip{padding:10px 16px;border:2px solid rgba(61,34,5,0.12);border-radius:30px;background:white;font-size:13px;font-weight:500;color:var(--brown);cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;}
  .ca-chip:hover{border-color:var(--teal);color:var(--teal);}
  .ca-chip.selected{background:linear-gradient(135deg,var(--teal),var(--teal-light));border-color:transparent;color:white;box-shadow:0 3px 10px rgba(10,92,99,0.25);}

  /* QUESTION CARDS */
  .q-card{background:white;border-radius:var(--radius);padding:24px 28px;margin-bottom:18px;border:2px solid transparent;box-shadow:0 2px 12px rgba(28,18,8,0.06);transition:border-color 0.2s;}
  .q-card.answered{border-color:rgba(45,125,70,.2);}
  .q-card:hover{border-color:rgba(232,101,10,0.15);}
  .q-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px;}
  .q-number{font-size:11px;font-weight:700;color:var(--saffron);letter-spacing:1.5px;text-transform:uppercase;}
  .q-check{width:20px;height:20px;border-radius:50%;background:rgba(45,125,70,.1);border:2px solid rgba(45,125,70,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;color:var(--success);transition:all .2s;}
  .q-card.answered .q-check{background:var(--success);border-color:var(--success);color:white;}
  .q-text{font-size:15px;font-weight:500;color:var(--dark);line-height:1.6;margin-bottom:18px;}

  /* LIKERT SCALE */
  .q-scale-wrap{display:flex;flex-direction:column;gap:10px;}
  .q-scale-labels{display:flex;justify-content:space-between;}
  .q-scale-label{font-size:11px;color:var(--muted);font-weight:600;max-width:140px;}
  .q-scale-label.right{text-align:right;}
  .q-scale{display:flex;gap:8px;}
  .scale-btn{flex:1;padding:12px 4px;border:2px solid rgba(61,34,5,0.12);border-radius:10px;background:white;font-size:14px;font-weight:700;color:var(--muted);cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px;}
  .scale-btn .scale-label-text{font-size:9px;font-weight:600;letter-spacing:0.3px;line-height:1.2;text-align:center;}
  .scale-btn:hover{border-color:var(--saffron);color:var(--saffron);}
  .scale-btn.selected{background:linear-gradient(135deg,var(--saffron),var(--gold));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(232,101,10,0.3);transform:scale(1.06);}

  /* CHOICE GRID */
  .choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .choice-grid.single-col{grid-template-columns:1fr;}
  .choice-btn{padding:13px 16px;border:2px solid rgba(61,34,5,0.12);border-radius:12px;background:white;font-size:14px;font-weight:500;color:var(--brown);cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;text-align:left;line-height:1.4;display:flex;align-items:flex-start;gap:9px;}
  .choice-btn .cb-icon{font-size:16px;flex-shrink:0;margin-top:1px;}
  .choice-btn:hover{border-color:var(--teal);background:rgba(10,92,99,0.04);color:var(--teal);}
  .choice-btn.selected{background:linear-gradient(135deg,var(--teal),var(--teal-light));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(10,92,99,0.25);}

  /* RANKING */
  .ranking-list{display:flex;flex-direction:column;gap:8px;}
  .ranking-item{display:flex;align-items:center;gap:12px;padding:12px 16px;background:white;border:2px solid rgba(61,34,5,0.1);border-radius:12px;cursor:grab;user-select:none;transition:all 0.2s;}
  .ranking-item:hover{border-color:var(--saffron);box-shadow:0 2px 8px rgba(232,101,10,0.1);}
  .ranking-item.dragging{opacity:0.5;border-color:var(--saffron);}
  .rank-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--saffron),var(--gold));color:white;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .rank-text{font-size:14px;font-weight:500;color:var(--brown);flex:1;}
  .rank-handle{color:var(--muted);font-size:16px;}
  .rank-arrows{display:flex;flex-direction:column;gap:2px;}
  .rank-arrow{background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;padding:2px 4px;line-height:1;transition:color 0.15s;}
  .rank-arrow:hover{color:var(--saffron);}

  /* SCALE 1-10 */
  .scale10-wrap{display:flex;flex-direction:column;gap:10px;}
  .scale10-row{display:flex;gap:6px;flex-wrap:wrap;}
  .scale10-btn{width:52px;height:52px;border:2px solid rgba(61,34,5,0.12);border-radius:10px;background:white;font-size:16px;font-weight:700;color:var(--muted);cursor:pointer;transition:all 0.18px;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;}
  .scale10-btn:hover{border-color:var(--saffron);color:var(--saffron);}
  .scale10-btn.selected{background:linear-gradient(135deg,var(--saffron),var(--gold));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(232,101,10,0.3);transform:scale(1.08);}
  .scale10-labels{display:flex;justify-content:space-between;}
  .scale10-label{font-size:11px;color:var(--muted);font-weight:600;max-width:180px;line-height:1.3;}
  .scale10-label.right{text-align:right;}

  /* NAV */
  .ca-nav{display:flex;justify-content:space-between;align-items:center;margin-top:36px;padding-top:24px;border-top:1px solid rgba(61,34,5,0.1);}
  .btn-back{padding:12px 28px;border:2px solid rgba(61,34,5,0.2);border-radius:50px;background:transparent;font-size:15px;font-weight:600;color:var(--brown);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-back:hover{border-color:var(--brown);background:rgba(61,34,5,0.04);}
  .btn-next{padding:14px 36px;border:none;border-radius:50px;background:linear-gradient(135deg,var(--saffron),var(--gold));font-size:15px;font-weight:600;color:white;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 6px 20px rgba(232,101,10,0.3);transition:all 0.25s;}
  .btn-next:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(232,101,10,0.4);}
  .btn-next:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none;}
  .btn-calculate{padding:16px 40px;border:none;border-radius:50px;background:linear-gradient(135deg,#2D7D46,#3DAA5E);font-size:16px;font-weight:700;color:white;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 6px 20px rgba(45,125,70,0.35);transition:all 0.25s;}
  .btn-calculate:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(45,125,70,0.45);}
  .btn-calculate:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none;}
  .ca-progress-note{font-size:12px;color:var(--muted);font-weight:600;}

  /* ERROR */
  .error-box{background:rgba(139,26,26,0.07);border:1px solid rgba(139,26,26,0.25);color:var(--danger);padding:16px 20px;border-radius:12px;margin-bottom:24px;font-weight:600;font-size:14px;line-height:1.5;}

  /* INFO CARD */
  .ca-info-card{background:white;border-radius:var(--radius);padding:28px;margin-bottom:20px;box-shadow:0 2px 12px rgba(28,18,8,0.06);border:1px solid rgba(61,34,5,0.08);}
  .ca-info-card h4{font-family:'Playfair Display',serif;font-size:18px;color:var(--dark);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid rgba(61,34,5,0.08);}

  /* SECTION DIVIDER */
  .ca-section-divider{display:flex;align-items:center;gap:12px;margin:28px 0 20px;}
  .ca-section-divider-line{flex:1;height:1px;background:rgba(61,34,5,0.1);}
  .ca-section-divider-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;}

  /* MATURITY SCENARIO */
  .maturity-card{background:white;border-radius:var(--radius);padding:24px 28px;margin-bottom:18px;border:2px solid transparent;box-shadow:0 2px 12px rgba(28,18,8,0.06);transition:border-color 0.2s;}
  .maturity-card.answered{border-color:rgba(45,125,70,.2);}
  .maturity-scenario{background:var(--parchment);border-radius:10px;padding:14px 18px;margin-bottom:16px;font-size:14px;color:var(--brown);line-height:1.65;font-style:italic;border-left:3px solid var(--saffron);}

  /* ── RESULTS UI ─────────────────────────────────────────────────────────── */
  .res-root{max-width:900px;margin:0 auto;padding:40px 20px 100px;}

  /* Hero */
  .res-hero{background:linear-gradient(135deg,var(--dark) 0%,#2C1A0A 100%);border-radius:24px;padding:48px 40px;text-align:center;margin-bottom:32px;position:relative;overflow:hidden;}
  .res-hero::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(232,101,10,0.08);pointer-events:none;}
  .res-hero::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;border-radius:50%;background:rgba(10,92,99,0.1);pointer-events:none;}
  .res-hero-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;}
  .res-hero-name{font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:white;margin-bottom:6px;}
  .res-hero-sub{font-size:15px;color:rgba(255,255,255,0.55);margin-bottom:28px;}
  .res-holland-code{display:inline-flex;gap:10px;margin-bottom:20px;}
  .res-holland-letter{width:72px;height:72px;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:white;position:relative;box-shadow:0 8px 24px rgba(0,0,0,0.3);}
  .res-holland-letter .hl-rank{position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:var(--gold);color:var(--dark);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;}
  .res-holland-label{font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;}
  .res-hero-tagline{font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:rgba(255,255,255,0.75);max-width:520px;margin:0 auto;}

  /* Section cards */
  .res-card{background:white;border-radius:20px;padding:32px;margin-bottom:24px;box-shadow:0 4px 20px rgba(28,18,8,0.07);border:1px solid rgba(61,34,5,0.07);}
  .res-card-header{display:flex;align-items:center;gap:14px;margin-bottom:24px;}
  .res-card-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
  .res-card-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--dark);}
  .res-card-subtitle{font-size:13px;color:var(--muted);margin-top:2px;}

  /* RIASEC breakdown bars */
  .riasec-bars{display:flex;flex-direction:column;gap:14px;}
  .riasec-bar-row{display:flex;align-items:center;gap:14px;}
  .riasec-bar-key{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:white;flex-shrink:0;}
  .riasec-bar-info{flex:1;}
  .riasec-bar-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;}
  .riasec-bar-name{font-size:13px;font-weight:600;color:var(--dark);}
  .riasec-bar-pct{font-size:12px;font-weight:700;color:var(--muted);}
  .riasec-bar-track{height:8px;background:rgba(61,34,5,0.07);border-radius:10px;overflow:hidden;}
  .riasec-bar-fill{height:100%;border-radius:10px;transition:width 1s ease;}
  .riasec-bar-desc{font-size:11px;color:var(--muted);margin-top:3px;}

  /* Trait breakdown */
  .trait-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
  .trait-card{border-radius:16px;padding:20px;text-align:center;}
  .trait-card-letter{font-family:'Playfair Display',serif;font-size:40px;font-weight:700;margin-bottom:4px;}
  .trait-card-name{font-size:13px;font-weight:700;margin-bottom:6px;}
  .trait-card-archetype{font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;opacity:0.7;margin-bottom:10px;}
  .trait-card-desc{font-size:12px;line-height:1.6;opacity:0.85;}

  /* Stream recommendation */
  .stream-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px;}
  .stream-card{border-radius:16px;padding:20px 16px;text-align:center;border:2px solid transparent;transition:all 0.2s;cursor:default;}
  .stream-card.recommended{border-color:var(--saffron);box-shadow:0 6px 20px rgba(232,101,10,0.15);}
  .stream-card.secondary{opacity:0.7;}
  .stream-card.not-recommended{opacity:0.4;}
  .stream-emoji{font-size:32px;margin-bottom:8px;}
  .stream-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:4px;}
  .stream-tag{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;display:inline-block;margin-bottom:8px;}
  .stream-tag.best{background:rgba(232,101,10,0.12);color:var(--saffron);}
  .stream-tag.good{background:rgba(10,92,99,0.1);color:var(--teal);}
  .stream-tag.possible{background:rgba(61,34,5,0.07);color:var(--muted);}
  .stream-subjects{font-size:11px;color:var(--muted);line-height:1.6;}
  .stream-reason{background:rgba(232,101,10,0.05);border:1px solid rgba(232,101,10,0.15);border-radius:12px;padding:14px 18px;font-size:14px;color:var(--brown);line-height:1.65;}

  /* Career matches */
  .career-list{display:flex;flex-direction:column;gap:16px;}
  .career-item{border-radius:16px;padding:22px 24px;border:1px solid rgba(61,34,5,0.08);background:white;box-shadow:0 2px 10px rgba(28,18,8,0.05);transition:box-shadow 0.2s;}
  .career-item:hover{box-shadow:0 6px 20px rgba(28,18,8,0.1);}
  .career-item-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;}
  .career-rank-badge{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--saffron),var(--gold));color:white;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .career-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--dark);flex:1;}
  .career-match-pct{font-size:13px;font-weight:700;color:var(--success);background:rgba(45,125,70,0.08);padding:4px 12px;border-radius:20px;white-space:nowrap;}
  .career-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}
  .career-tag{font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;background:rgba(10,92,99,0.08);color:var(--teal);}
  .career-desc{font-size:14px;color:var(--muted);line-height:1.65;margin-bottom:10px;}
  .career-why{background:var(--parchment);border-radius:10px;padding:12px 16px;font-size:13px;color:var(--brown);line-height:1.6;border-left:3px solid var(--gold);}
  .career-why-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--saffron);margin-bottom:4px;}

  /* Maturity indicator */
  .maturity-gauge-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:24px;}
  .maturity-gauge-arc{position:relative;width:180px;height:90px;overflow:hidden;}
  .maturity-gauge-bg{width:180px;height:180px;border-radius:50%;border:16px solid rgba(61,34,5,0.08);position:absolute;top:0;left:0;clip-path:polygon(0 50%,100% 50%,100% 100%,0 100%);}
  .maturity-gauge-fill{width:180px;height:180px;border-radius:50%;border:16px solid transparent;position:absolute;top:0;left:0;clip-path:polygon(0 50%,100% 50%,100% 100%,0 100%);}
  .maturity-score-num{font-family:'Playfair Display',serif;font-size:42px;font-weight:700;color:var(--dark);text-align:center;}
  .maturity-score-label{font-size:13px;color:var(--muted);font-weight:600;text-align:center;}
  .maturity-level-badge{padding:6px 18px;border-radius:20px;font-size:13px;font-weight:700;display:inline-block;margin-bottom:16px;}
  .maturity-traits{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .maturity-trait-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(61,34,5,0.03);border-radius:10px;}
  .maturity-trait-icon{font-size:18px;flex-shrink:0;}
  .maturity-trait-info{flex:1;}
  .maturity-trait-name{font-size:12px;font-weight:700;color:var(--dark);}
  .maturity-trait-val{font-size:11px;color:var(--muted);}

  /* Why these match */
  .why-match-list{display:flex;flex-direction:column;gap:12px;}
  .why-match-item{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:rgba(10,92,99,0.04);border-radius:12px;border:1px solid rgba(10,92,99,0.1);}
  .why-match-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);flex-shrink:0;margin-top:6px;}
  .why-match-text{font-size:14px;color:var(--brown);line-height:1.6;}

  /* CTA */
  .res-cta{background:linear-gradient(135deg,var(--teal),var(--teal-light));border-radius:20px;padding:36px;text-align:center;margin-top:32px;}
  .res-cta h3{font-family:'Playfair Display',serif;font-size:24px;color:white;margin-bottom:8px;}
  .res-cta p{font-size:15px;color:rgba(255,255,255,0.8);margin-bottom:24px;}
  .res-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
  .btn-cta-primary{padding:14px 32px;border:none;border-radius:50px;background:white;color:var(--teal);font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-cta-primary:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.15);}
  .btn-cta-secondary{padding:14px 32px;border:2px solid rgba(255,255,255,0.4);border-radius:50px;background:transparent;color:white;font-size:15px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-cta-secondary:hover{background:rgba(255,255,255,0.1);}

  @media(max-width:900px){
    .ca-two-col{grid-template-columns:1fr;}
    .choice-grid{grid-template-columns:1fr;}
    .ca-header{padding:14px 20px;}
    .ca-progress-wrap{padding:12px 20px;}
    .ca-progress-bar-bg{width:80px;}
    .scale10-row{gap:4px;}
    .scale10-btn{width:44px;height:44px;font-size:14px;}
    .trait-grid{grid-template-columns:1fr;}
    .stream-grid{grid-template-columns:1fr;}
    .maturity-traits{grid-template-columns:1fr;}
    .res-hero{padding:32px 20px;}
    .res-hero-name{font-size:26px;}
    .res-card{padding:22px 18px;}
  }
  @media(max-width:480px){
    .q-scale{gap:4px;}
    .scale-btn{padding:10px 2px;font-size:13px;}
    .scale10-btn{width:36px;height:36px;font-size:13px;}
    .res-holland-letter{width:58px;height:58px;font-size:24px;}
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const LIKERT_LABELS = {
  1: 'Strongly\nDisagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly\nAgree',
};

const RIASEC_COLORS = {
  R: { bg:'#FFF3E0', color:'#E65100', bar:'#E65100', label:'Realistic',     desc:'The Doer' },
  I: { bg:'#E3F2FD', color:'#1565C0', bar:'#1565C0', label:'Investigative', desc:'The Thinker' },
  A: { bg:'#F3E5F5', color:'#6A1B9A', bar:'#6A1B9A', label:'Artistic',      desc:'The Creator' },
  S: { bg:'#E8F5E9', color:'#2E7D32', bar:'#2E7D32', label:'Social',        desc:'The Helper' },
  E: { bg:'#FFF8E1', color:'#F57F17', bar:'#F57F17', label:'Enterprising',  desc:'The Persuader' },
  C: { bg:'#E0F2F1', color:'#00695C', bar:'#00695C', label:'Conventional',  desc:'The Organiser' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

// Maps marks band → numeric weight multiplier
const MARKS_WEIGHT = {
  'Below 50%':    0.6,
  '50% – 59%':   0.7,
  '60% – 69%':   0.8,
  '70% – 79%':   0.9,
  '80% – 89%':   1.0,
  '90% and above': 1.1,
};

// Subject → RIASEC affinity boosts
const SUBJECT_RIASEC_BOOST = {
  'Mathematics':                    { I: 8, C: 6 },
  'Physics':                        { R: 6, I: 8 },
  'Chemistry':                      { I: 8, R: 4 },
  'Biology / Life Sciences':        { I: 7, S: 5 },
  'Computer Science / IT':          { I: 8, R: 6, C: 4 },
  'History / Political Science':    { S: 5, E: 6, A: 4 },
  'Geography / Environmental Studies': { R: 5, I: 5 },
  'Economics / Business Studies':   { E: 8, C: 6, I: 4 },
  'Accountancy / Commerce':         { C: 9, E: 5 },
  'English / Literature':           { A: 8, S: 4 },
  'Hindi / Regional Language':      { A: 6, S: 4 },
  'Fine Arts / Music / Drama':      { A: 10 },
  'Physical Education / Sports':    { R: 8, S: 4 },
  'Psychology / Sociology':         { S: 8, I: 5 },
  'Philosophy / Ethics':            { I: 6, A: 5, S: 4 },
};

// Hobby → RIASEC affinity boosts
const HOBBY_RIASEC_BOOST = {
  'Sports / Athletics':                    { R: 8, S: 3 },
  'Music (instrument, singing, composing)':{ A: 10 },
  'Visual Arts (drawing, painting, sculpture)': { A: 10 },
  'Drama / Theatre / Dance':               { A: 9, S: 4 },
  'Coding / App / Game Development':       { I: 8, R: 5, C: 4 },
  'Robotics / Science Olympiad':           { R: 7, I: 8 },
  'Debate / MUN / Public Speaking':        { E: 9, S: 5 },
  'Writing / Journalism / Blogging':       { A: 8, I: 4 },
  'Photography / Videography / Filmmaking':{ A: 9, R: 3 },
  'Community Service / NGO Work':          { S: 9, E: 4 },
  'Student Government / Leadership Roles': { E: 9, S: 5 },
  'Cooking / Culinary Arts':               { R: 6, A: 5 },
  'Gaming (competitive or casual)':        { I: 5, R: 3 },
  'Reading / Book Clubs':                  { I: 7, A: 5 },
  'Fitness / Yoga / Martial Arts':         { R: 7 },
  'Travel / Adventure / Trekking':         { R: 6, E: 4 },
};

// RIASEC question banks keyed by letter
const RIASEC_QUESTION_BANKS = {
  R: realisticQuestions,
  I: investigativeQuestions,
  A: artisticQuestions,
  S: socialQuestions,
  E: enterprisingQuestions,
  C: conventionalQuestions,
};

// Single-question "correct" option index per RIASEC key (index 0 = most aligned)
const SINGLE_Q_RIASEC_OPTION_IDX = {
  R: 0, // "Assembling a complex piece of furniture" / "Outdoors / Field-based"
  I: 0, // "Designing a controlled experiment"
  A: 0, // "Sketch, paint, or work on a creative project"
  S: 0, // "Immediately introduce yourself"
  E: 0, // "Lead the entire event"
  C: 0, // "Systematically go through each entry"
};

function computeRiasecScores(profile) {
  const raw = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const maxPossible = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.entries(RIASEC_QUESTION_BANKS).forEach(([key, questions]) => {
    questions.forEach(q => {
      const w = q.weight || 1;
      if (q.type === 'scale') {
        const val = profile[q.id];
        const scaleMax = q.scaleMax || 5;
        maxPossible[key] += (scaleMax - 1) * w;
        if (val !== undefined && val !== null) {
          raw[key] += (Number(val) - 1) * w;
        }
      } else if (q.type === 'single') {
        maxPossible[key] += w * 4;
        const val = profile[q.id];
        if (val !== undefined && val !== null) {
          const idx = (q.options || []).indexOf(val);
          if (idx === SINGLE_Q_RIASEC_OPTION_IDX[key]) {
            raw[key] += w * 4;
          } else if (idx === 1) {
            raw[key] += w * 2;
          }
        }
      }
    });
  });

  // Normalise to 0–100
  const normalised = {};
  Object.keys(raw).forEach(k => {
    normalised[k] = maxPossible[k] > 0
      ? Math.round((raw[k] / maxPossible[k]) * 100)
      : 0;
  });

  return normalised;
}

function applySubjectBoosts(scores, subjects) {
  if (!Array.isArray(subjects)) return scores;
  const boosted = { ...scores };
  subjects.forEach(subj => {
    const boosts = SUBJECT_RIASEC_BOOST[subj];
    if (boosts) {
      Object.entries(boosts).forEach(([k, v]) => {
        boosted[k] = Math.min(100, (boosted[k] || 0) + v);
      });
    }
  });
  return boosted;
}

function applyHobbyBoosts(scores, hobbies) {
  if (!Array.isArray(hobbies)) return scores;
  const boosted = { ...scores };
  hobbies.forEach(h => {
    const boosts = HOBBY_RIASEC_BOOST[h];
    if (boosts) {
      Object.entries(boosts).forEach(([k, v]) => {
        boosted[k] = Math.min(100, (boosted[k] || 0) + v * 0.5);
      });
    }
  });
  return boosted;
}

function getTop3(scores) {
  return Object.entries(scores)
    // Sort by score descending. If tied, sort alphabetically to prevent random shuffling!
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([k]) => k);
}

// ── Maturity scoring ──────────────────────────────────────────────────────────
const MATURITY_SCORE_MAP = {
  dem_05: {
    'Take charge immediately — divide tasks, set mini-deadlines, and track progress': 5,
    'Suggest a quick meeting to align everyone before starting': 4,
    'Focus on your own portion and trust others to manage theirs': 3,
    'Ask the teacher/supervisor for an extension': 2,
    'Feel overwhelmed but push through on your own': 1,
  },
  dem_06: {
    'Firmly decline and explain why it is wrong': 5,
    'Decline but offer to help them study instead': 5,
    'Feel conflicted but ultimately refuse': 3,
    'Help them because friendship matters more': 1,
    'Ignore the request and hope they figure it out': 2,
  },
  dem_07: {
    'Intervene directly and stand up for the classmate': 5,
    'Report it to a teacher or authority figure': 4,
    'Comfort the classmate privately after the incident': 3,
    'Stay silent to avoid conflict': 2,
    'Join others in ignoring it': 1,
  },
  dem_08: {
    'Create a detailed schedule with milestones from day one': 5,
    'Work steadily but without a strict plan': 4,
    'Start early but lose momentum midway': 3,
    'Work intensively only near the deadline': 2,
    'Struggle to start without external pressure': 1,
  },
  dem_09: {
    'Analyse what went wrong and immediately plan a correction': 5,
    'Feel bad briefly, then move on and learn from it': 4,
    'Seek advice from someone more experienced': 3,
    'Dwell on it for a while before recovering': 2,
    'Blame external circumstances': 1,
  },
};

function computeMaturityScore(profile) {
  let total = 0;
  let maxTotal = 0;

  // Scenario questions dem_05–dem_09
  Object.entries(MATURITY_SCORE_MAP).forEach(([qid, map]) => {
    maxTotal += 5;
    const val = profile[qid];
    if (val && map[val] !== undefined) {
      total += map[val];
    }
  });

  // dem_10: self-discipline scale (1–10)
  const selfDisc = Number(profile['dem_10'] || 0);
  maxTotal += 10;
  total += selfDisc;

  const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  return pct;
}

function getMaturityLevel(pct) {
  if (pct >= 85) return { label: 'Highly Mature', color: '#2D7D46', bg: 'rgba(45,125,70,0.1)', emoji: '🌟' };
  if (pct >= 70) return { label: 'Mature & Reflective', color: '#0A5C63', bg: 'rgba(10,92,99,0.1)', emoji: '✨' };
  if (pct >= 55) return { label: 'Developing Maturity', color: '#E8650A', bg: 'rgba(232,101,10,0.1)', emoji: '🌱' };
  if (pct >= 40) return { label: 'Early Stage', color: '#B85C00', bg: 'rgba(184,92,0,0.1)', emoji: '🔆' };
  return { label: 'Needs Guidance', color: '#8B1A1A', bg: 'rgba(139,26,26,0.1)', emoji: '💡' };
}

// ── Stream recommendation ─────────────────────────────────────────────────────
function recommendStream(hollandCode, marks, subjects) {
  const marksNum = {
    'Below 50%': 1, '50% – 59%': 2, '60% – 69%': 3,
    '70% – 79%': 4, '80% – 89%': 5, '90% and above': 6,
  }[marks] || 3;

  const scienceSubjects = ['Mathematics','Physics','Chemistry','Biology / Life Sciences','Computer Science / IT'];
  const commerceSubjects = ['Economics / Business Studies','Accountancy / Commerce','Mathematics'];
  const artsSubjects = ['History / Political Science','Geography / Environmental Studies','English / Literature','Hindi / Regional Language','Fine Arts / Music / Drama','Psychology / Sociology','Philosophy / Ethics'];

  const subjectArr = Array.isArray(subjects) ? subjects : [];
  const scienceCount = subjectArr.filter(s => scienceSubjects.includes(s)).length;
  const commerceCount = subjectArr.filter(s => commerceSubjects.includes(s)).length;
  const artsCount = subjectArr.filter(s => artsSubjects.includes(s)).length;

  const scienceRiasec = hollandCode.filter(k => ['R','I'].includes(k)).length;
  const commerceRiasec = hollandCode.filter(k => ['E','C'].includes(k)).length;
  const artsRiasec = hollandCode.filter(k => ['A','S'].includes(k)).length;

  const scienceScore = scienceRiasec * 3 + scienceCount * 2 + (marksNum >= 4 ? 2 : 0);
  const commerceScore = commerceRiasec * 3 + commerceCount * 2 + (marksNum >= 3 ? 1 : 0);
  const artsScore = artsRiasec * 3 + artsCount * 2 + 1;

  const streams = [
    { id: 'Science', score: scienceScore, emoji: '🔬', subjects: 'Physics, Chemistry, Maths, Biology, CS' },
    { id: 'Commerce', score: commerceScore, emoji: '📈', subjects: 'Accountancy, Economics, Business Studies, Maths' },
    { id: 'Arts / Humanities', score: artsScore, emoji: '🎭', subjects: 'History, Geography, English, Psychology, Fine Arts' },
  ].sort((a, b) => b.score - a.score);

  return streams;
}

// ── Career database ───────────────────────────────────────────────────────────
const CAREER_DATABASE = [
  // Science / R+I
  {
    name: 'Software Engineer / Developer',
    riasec: ['I','R','C'],
    stream: 'Science',
    subjects: ['Mathematics','Computer Science / IT','Physics'],
    hobbies: ['Coding / App / Game Development','Robotics / Science Olympiad'],
    tags: ['Tech','High Growth','Remote-Friendly'],
    desc: 'Design, build, and maintain software systems — from mobile apps to enterprise platforms. One of the highest-demand careers globally.',
    whyTemplate: 'Your strong Investigative and Realistic traits show you love solving complex problems with precision. Your interest in {subjects} and {hobbies} directly maps to the core skills of software development.',
  },
  {
    name: 'Medical Doctor / Physician',
    riasec: ['I','S','R'],
    stream: 'Science',
    subjects: ['Biology / Life Sciences','Chemistry','Physics'],
    hobbies: ['Community Service / NGO Work','Reading / Book Clubs'],
    tags: ['Healthcare','High Impact','Prestigious'],
    desc: 'Diagnose and treat illnesses, combining deep scientific knowledge with compassionate patient care. A highly respected and impactful profession.',
    whyTemplate: 'Your Investigative curiosity and Social empathy are the twin pillars of medicine. Your aptitude in {subjects} and your drive to help others make this a natural fit.',
  },
  {
    name: 'Data Scientist / AI Engineer',
    riasec: ['I','C','R'],
    stream: 'Science',
    subjects: ['Mathematics','Computer Science / IT','Physics'],
    hobbies: ['Coding / App / Game Development','Reading / Book Clubs'],
    tags: ['AI/ML','Future-Proof','Analytical'],
    desc: 'Extract insights from massive datasets using statistics, machine learning, and programming. One of the most sought-after roles in the 21st century.',
    whyTemplate: 'Your top Investigative score signals a mind that thrives on patterns and evidence. Combined with your strength in {subjects}, you are built for the data-driven world.',
  },
  {
    name: 'Civil / Mechanical Engineer',
    riasec: ['R','I','C'],
    stream: 'Science',
    subjects: ['Mathematics','Physics','Computer Science / IT'],
    hobbies: ['Robotics / Science Olympiad','Coding / App / Game Development'],
    tags: ['Infrastructure','Hands-On','Stable'],
    desc: 'Design and build the physical world — bridges, buildings, machines, and systems that society depends on.',
    whyTemplate: 'Your Realistic and Investigative combination is the classic engineering profile. Your love for {subjects} and hands-on activities like {hobbies} confirm this path.',
  },
  {
    name: 'Research Scientist',
    riasec: ['I','R','A'],
    stream: 'Science',
    subjects: ['Biology / Life Sciences','Chemistry','Physics','Mathematics'],
    hobbies: ['Reading / Book Clubs','Robotics / Science Olympiad'],
    tags: ['Academia','Discovery','Intellectual'],
    desc: 'Push the boundaries of human knowledge through rigorous experimentation and analysis in fields like biology, chemistry, physics, or neuroscience.',
    whyTemplate: 'Your deep Investigative drive and comfort with independent intellectual work are hallmarks of a researcher. Your passion for {subjects} fuels the curiosity that science demands.',
  },
  // Commerce / E+C
  {
    name: 'Chartered Accountant (CA) / Finance Professional',
    riasec: ['C','E','I'],
    stream: 'Commerce',
    subjects: ['Accountancy / Commerce','Mathematics','Economics / Business Studies'],
    hobbies: ['Student Government / Leadership Roles','Reading / Book Clubs'],
    tags: ['Finance','High Earning','Structured'],
    desc: 'Manage financial records, audits, taxation, and strategic financial planning for organisations. One of India\'s most prestigious professional qualifications.',
    whyTemplate: 'Your Conventional precision and Enterprising ambition are the perfect CA combination. Your strength in {subjects} gives you the analytical foundation this career demands.',
  },
  {
    name: 'Entrepreneur / Business Founder',
    riasec: ['E','I','R'],
    stream: 'Commerce',
    subjects: ['Economics / Business Studies','Mathematics','Computer Science / IT'],
    hobbies: ['Student Government / Leadership Roles','Debate / MUN / Public Speaking'],
    tags: ['High Risk/Reward','Leadership','Creative Freedom'],
    desc: 'Build and scale your own venture — identifying market gaps, assembling teams, and creating value from scratch.',
    whyTemplate: 'Your dominant Enterprising trait, combined with your leadership activities like {hobbies}, signals an entrepreneurial spirit. Your interest in {subjects} gives you the business acumen to execute.',
  },
  {
    name: 'Marketing & Brand Manager',
    riasec: ['E','A','S'],
    stream: 'Commerce',
    subjects: ['Economics / Business Studies','English / Literature','Psychology / Sociology'],
    hobbies: ['Debate / MUN / Public Speaking','Photography / Videography / Filmmaking','Writing / Journalism / Blogging'],
    tags: ['Creative','People-Facing','Dynamic'],
    desc: 'Craft compelling brand stories, run campaigns, and connect products with the right audiences across digital and traditional channels.',
    whyTemplate: 'Your Enterprising persuasion and Artistic creativity are the twin engines of great marketing. Your engagement with {hobbies} shows you already think like a storyteller.',
  },
  {
    name: 'Investment Banker / Financial Analyst',
    riasec: ['E','C','I'],
    stream: 'Commerce',
    subjects: ['Economics / Business Studies','Accountancy / Commerce','Mathematics'],
    hobbies: ['Debate / MUN / Public Speaking','Reading / Book Clubs'],
    tags: ['High Earning','Competitive','Analytical'],
    desc: 'Advise corporations on mergers, acquisitions, and capital raising. Analyse markets and financial data to drive billion-dollar decisions.',
    whyTemplate: 'Your Enterprising ambition and Conventional precision are exactly what investment banking demands. Your aptitude in {subjects} provides the quantitative edge needed.',
  },
  // Arts / A+S
  {
    name: 'Graphic Designer / UX Designer',
    riasec: ['A','I','R'],
    stream: 'Arts / Humanities',
    subjects: ['Fine Arts / Music / Drama','Computer Science / IT','English / Literature'],
    hobbies: ['Visual Arts (drawing, painting, sculpture)','Photography / Videography / Filmmaking','Coding / App / Game Development'],
    tags: ['Creative','Digital','Portfolio-Based'],
    desc: 'Create visual identities, user interfaces, and digital experiences that are both beautiful and functional.',
    whyTemplate: 'Your Artistic score is a clear signal — you see the world in shapes, colours, and compositions. Your involvement in {hobbies} is already building your design portfolio.',
  },
  {
    name: 'Psychologist / Counsellor',
    riasec: ['S','I','A'],
    stream: 'Arts / Humanities',
    subjects: ['Psychology / Sociology','Biology / Life Sciences','English / Literature'],
    hobbies: ['Community Service / NGO Work','Reading / Book Clubs','Drama / Theatre / Dance'],
    tags: ['High Impact','Empathy-Driven','Growing Field'],
    desc: 'Help individuals navigate mental health challenges, trauma, and personal growth through evidence-based therapeutic approaches.',
    whyTemplate: 'Your Social empathy and Investigative curiosity about human behaviour are the core of psychology. Your interest in {subjects} and {hobbies} shows you already engage deeply with people.',
  },
  {
    name: 'Journalist / Content Creator',
    riasec: ['A','E','S'],
    stream: 'Arts / Humanities',
    subjects: ['English / Literature','History / Political Science','Psychology / Sociology'],
    hobbies: ['Writing / Journalism / Blogging','Photography / Videography / Filmmaking','Debate / MUN / Public Speaking'],
    tags: ['Creative','Impactful','Flexible'],
    desc: 'Investigate, write, and broadcast stories that inform and shape public opinion — across print, digital, video, and social media.',
    whyTemplate: 'Your Artistic expression and Social awareness make you a natural storyteller. Your participation in {hobbies} shows you are already practising the craft.',
  },
  {
    name: 'Teacher / Educator / Academic',
    riasec: ['S','I','A'],
    stream: 'Arts / Humanities',
    subjects: ['English / Literature','History / Political Science','Psychology / Sociology','Mathematics'],
    hobbies: ['Community Service / NGO Work','Reading / Book Clubs','Debate / MUN / Public Speaking'],
    tags: ['High Impact','Stable','Meaningful'],
    desc: 'Shape the next generation through inspiring teaching, curriculum design, and academic research.',
    whyTemplate: 'Your Social drive to help others and Investigative love of knowledge are the hallmarks of a great educator. Your strength in {subjects} gives you deep subject expertise.',
  },
  {
    name: 'Lawyer / Legal Professional',
    riasec: ['E','I','S'],
    stream: 'Arts / Humanities',
    subjects: ['History / Political Science','English / Literature','Economics / Business Studies'],
    hobbies: ['Debate / MUN / Public Speaking','Reading / Book Clubs','Student Government / Leadership Roles'],
    tags: ['Prestigious','Analytical','Advocacy'],
    desc: 'Argue cases, draft legislation, advise clients, and uphold justice across criminal, civil, corporate, or constitutional law.',
    whyTemplate: 'Your Enterprising persuasion and Investigative analytical mind are the foundation of legal excellence. Your debate and MUN experience in {hobbies} is direct preparation.',
  },
  // Cross-stream
  {
    name: 'Architect',
    riasec: ['A','R','I'],
    stream: 'Science',
    subjects: ['Mathematics','Physics','Fine Arts / Music / Drama'],
    hobbies: ['Visual Arts (drawing, painting, sculpture)','Photography / Videography / Filmmaking'],
    tags: ['Creative','Technical','Prestigious'],
    desc: 'Design buildings and spaces that are structurally sound, aesthetically compelling, and functionally excellent.',
    whyTemplate: 'Architecture is the perfect marriage of your Artistic vision and Realistic technical skill. Your interest in {subjects} and creative hobbies like {hobbies} are exactly the right foundation.',
  },
  {
    name: 'Sports Professional / Coach',
    riasec: ['R','S','E'],
    stream: 'Arts / Humanities',
    subjects: ['Physical Education / Sports','Biology / Life Sciences'],
    hobbies: ['Sports / Athletics','Fitness / Yoga / Martial Arts'],
    tags: ['Passion-Driven','Active','Growing Industry'],
    desc: 'Compete at the highest level or coach others to peak performance — in cricket, football, athletics, or any sport you love.',
    whyTemplate: 'Your Realistic physicality and Social leadership are the core of sports excellence. Your dedication to {hobbies} shows this is not just a hobby — it is a calling.',
  },
  {
    name: 'Film Director / Creative Director',
    riasec: ['A','E','S'],
    stream: 'Arts / Humanities',
    subjects: ['Fine Arts / Music / Drama','English / Literature','History / Political Science'],
    hobbies: ['Drama / Theatre / Dance','Photography / Videography / Filmmaking','Writing / Journalism / Blogging'],
    tags: ['Creative','Visionary','High Visibility'],
    desc: 'Lead the creative vision of films, advertisements, or brand campaigns — translating ideas into powerful visual narratives.',
    whyTemplate: 'Your Artistic imagination and Enterprising leadership are the director\'s toolkit. Your involvement in {hobbies} shows you are already telling stories and leading creative teams.',
  },
];

function scoreCareerMatch(career, hollandCode, subjects, hobbies, marks) {
  const subjectArr = Array.isArray(subjects) ? subjects : [];
  const hobbyArr = Array.isArray(hobbies) ? hobbies : [];
  const marksW = MARKS_WEIGHT[marks] || 0.85;

  // RIASEC overlap (Max possible = 55 points)
  let riasecScore = 0;
  hollandCode.forEach((k, rank) => {
    const idx = career.riasec.indexOf(k);
    if (idx === 0) riasecScore += (3 - rank) * 12;      // 1st letter match
    else if (idx === 1) riasecScore += (3 - rank) * 6;  // 2nd letter match
    else if (idx === 2) riasecScore += (3 - rank) * 3;  // 3rd letter match
  });

  // Subject overlap (Max possible = 25 points)
  const subjectOverlap = subjectArr.filter(s => career.subjects.includes(s)).length;
  const subjectScore = Math.min(subjectOverlap * 12.5, 25); 

  // Hobby overlap (Max possible = 20 points)
  const hobbyOverlap = hobbyArr.filter(h => career.hobbies.includes(h)).length;
  const hobbyScore = Math.min(hobbyOverlap * 10, 20); 

  // Total possible raw = 100.
  const raw = (riasecScore + subjectScore + hobbyScore) * marksW;
  
  // Cap at 98% because no career is mathematically perfect in reality
  return Math.min(Math.round(raw), 98);
}

function buildWhyText(career, subjects, hobbies) {
  const subjectArr = Array.isArray(subjects) ? subjects : [];
  const hobbyArr = Array.isArray(hobbies) ? hobbies : [];

  const matchedSubjects = subjectArr.filter(s => career.subjects.includes(s));
  const matchedHobbies = hobbyArr.filter(h => career.hobbies.includes(h));

  const subjectStr = matchedSubjects.length > 0
    ? matchedSubjects.slice(0, 2).join(' & ')
    : 'your academic subjects';
  const hobbyStr = matchedHobbies.length > 0
    ? matchedHobbies.slice(0, 2).join(' & ')
    : 'your extracurricular interests';

  return career.whyTemplate
    .replace('{subjects}', subjectStr)
    .replace('{hobbies}', hobbyStr);
}

function getTop5Careers(hollandCode, subjects, hobbies, marks) {
  return CAREER_DATABASE
    .map(c => ({
      ...c,
      matchScore: scoreCareerMatch(c, hollandCode, subjects, hobbies, marks),
      whyText: buildWhyText(c, subjects, hobbies),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

// ── Psychological breakdown per RIASEC letter ─────────────────────────────────
const RIASEC_PSYCHOLOGY = {
  R: {
    archetype: 'The Doer',
    core: 'You are grounded in the physical world. You think with your hands, trust tangible results, and find deep satisfaction in making things work.',
    strengths: ['Practical problem-solving', 'Technical aptitude', 'Physical coordination', 'Reliability under pressure'],
    growthAreas: ['Abstract thinking', 'Emotional expression', 'Navigating ambiguity'],
    famousPeople: 'Elon Musk (engineering), Sachin Tendulkar (sports mastery)',
  },
  I: {
    archetype: 'The Thinker',
    core: 'You are driven by curiosity and the need to understand. You ask "why" before "how", and you are most alive when solving a problem no one else has cracked.',
    strengths: ['Deep analytical thinking', 'Research & synthesis', 'Independent focus', 'Pattern recognition'],
    growthAreas: ['Social engagement', 'Practical execution', 'Tolerating ambiguity without data'],
    famousPeople: 'APJ Abdul Kalam (science), Marie Curie (research)',
  },
  A: {
    archetype: 'The Creator',
    core: 'You experience the world through aesthetics, emotion, and imagination. You need creative freedom to thrive and feel stifled by rigid structures.',
    strengths: ['Original thinking', 'Aesthetic sensitivity', 'Emotional intelligence', 'Storytelling'],
    growthAreas: ['Structure and routine', 'Financial planning', 'Accepting constructive criticism'],
    famousPeople: 'A.R. Rahman (music), Satyajit Ray (film)',
  },
  S: {
    archetype: 'The Helper',
    core: 'You are energised by human connection. You listen deeply, empathise naturally, and find your greatest purpose in making a positive difference in others\' lives.',
    strengths: ['Empathy & emotional intelligence', 'Communication', 'Conflict resolution', 'Team collaboration'],
    growthAreas: ['Setting personal boundaries', 'Assertiveness', 'Data-driven decision making'],
    famousPeople: 'Mother Teresa (service), Kiran Bedi (social leadership)',
  },
  E: {
    archetype: 'The Persuader',
    core: 'You are a natural leader and influencer. You think big, move fast, and have an innate ability to inspire others to follow your vision.',
    strengths: ['Leadership & vision', 'Persuasion & negotiation', 'Risk tolerance', 'Strategic thinking'],
    growthAreas: ['Patience with detail', 'Listening before acting', 'Emotional regulation under pressure'],
    famousPeople: 'Ratan Tata (business), Indra Nooyi (corporate leadership)',
  },
  C: {
    archetype: 'The Organiser',
    core: 'You bring order to chaos. You are the person who makes systems work, catches errors others miss, and ensures everything runs with precision.',
    strengths: ['Attention to detail', 'Systematic thinking', 'Reliability', 'Data management'],
    growthAreas: ['Embracing change', 'Creative risk-taking', 'Big-picture thinking'],
    famousPeople: 'N.R. Narayana Murthy (systems & process), Warren Buffett (financial discipline)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD STEP DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'intake',
    label: 'Profile',
    emoji: '👤',
    badge: 'Step 1 of 9 — Initial Intake',
    title: 'Tell Us About Yourself',
    desc: 'A few quick details so we can personalise your assessment and results.',
  },
  {
    id: 'maturity',
    label: 'Maturity',
    emoji: '🧠',
    badge: 'Step 2 of 9 — Cognitive & Maturity',
    title: 'Cognitive & Maturity Assessment',
    desc: 'These scenario-based questions help us understand how you think, plan, and handle real-world challenges.',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    emoji: '🔧',
    badge: 'Step 3 of 9 — RIASEC: Realistic',
    title: 'Realistic — The Doer',
    desc: 'Rate how strongly you agree or disagree with each statement. Be honest — there are no right or wrong answers.',
    riasecKey: 'R',
  },
  {
    id: 'investigative',
    label: 'Investigative',
    emoji: '🔬',
    badge: 'Step 4 of 9 — RIASEC: Investigative',
    title: 'Investigative — The Thinker',
    desc: 'Rate how strongly you agree or disagree with each statement.',
    riasecKey: 'I',
  },
  {
    id: 'artistic',
    label: 'Artistic',
    emoji: '🎨',
    badge: 'Step 5 of 9 — RIASEC: Artistic',
    title: 'Artistic — The Creator',
    desc: 'Rate how strongly you agree or disagree with each statement.',
    riasecKey: 'A',
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '🤝',
    badge: 'Step 6 of 9 — RIASEC: Social',
    title: 'Social — The Helper',
    desc: 'Rate how strongly you agree or disagree with each statement.',
    riasecKey: 'S',
  },
  {
    id: 'enterprising',
    label: 'Enterprising',
    emoji: '🚀',
    badge: 'Step 7 of 9 — RIASEC: Enterprising',
    title: 'Enterprising — The Persuader',
    desc: 'Rate how strongly you agree or disagree with each statement.',
    riasecKey: 'E',
  },
  {
    id: 'conventional',
    label: 'Conventional',
    emoji: '📊',
    badge: 'Step 8 of 9 — RIASEC: Conventional',
    title: 'Conventional — The Organiser',
    desc: 'Rate how strongly you agree or disagree with each statement.',
    riasecKey: 'C',
  },
  {
    id: 'values',
    label: 'Values',
    emoji: '🌟',
    badge: 'Step 9 of 9 — Work Values & Environment',
    title: 'Interests, Values & Work Environment',
    desc: 'Tell us about your hobbies, what you value in a career, and how you handle stress. This rounds out your full profile.',
  },
];

// Questions per step
const STEP_QUESTIONS = {
  intake:        demographicQuestions.slice(0, 4),
  maturity:      demographicQuestions.slice(4),
  realistic:     realisticQuestions,
  investigative: investigativeQuestions,
  artistic:      artisticQuestions,
  social:        socialQuestions,
  enterprising:  enterprisingQuestions,
  conventional:  conventionalQuestions,
  values:        extracurricularQuestions,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: count answered questions for a step
// ─────────────────────────────────────────────────────────────────────────────
function countAnswered(questions, profile) {
  return questions.filter(q => {
    const v = profile[q.id];
    if (q.type === 'multiple') return Array.isArray(v) && v.length > 0;
    if (q.type === 'ranking')  return Array.isArray(v) && v.length === q.options.length;
    return v !== undefined && v !== '' && v !== null;
  }).length;
}

function isStepComplete(stepId, profile) {
  if (stepId === 'intake') {
    return (
      profile['dem_01'] &&
      profile['dem_02'] &&
      profile['dem_03'] &&
      Array.isArray(profile['dem_04']) && profile['dem_04'].length > 0
    );
  }
  const qs = STEP_QUESTIONS[stepId] || [];
  return qs.every(q => {
    const v = profile[q.id];
    if (q.type === 'multiple') return Array.isArray(v) && v.length > 0;
    if (q.type === 'ranking')  return Array.isArray(v) && v.length === q.options.length;
    if (q.type === 'text')     return true;
    return v !== undefined && v !== '' && v !== null;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ResultsScreen({ results, onBack, onExplore }) {
  const { hollandCode, riasecScores, streams, top5Careers, maturityPct, profile } = results;

  const name = String(profile['_name'] || profile['_autofill_name'] || 'Your');
  const marks = String(profile['dem_03'] || '');
  const subjects = Array.isArray(profile['dem_04']) ? profile['dem_04'] : [];
  const hobbies = Array.isArray(profile['ext_01']) ? profile['ext_01'] : [];
  const maturityLevel = getMaturityLevel(maturityPct);

  const codeStr = hollandCode.join('');

  // Build tagline from top 2 traits
  const trait1 = RIASEC_COLORS[hollandCode[0]];
  const trait2 = RIASEC_COLORS[hollandCode[1]];
  const tagline = trait1 && trait2
    ? `${String(trait1.desc)} meets ${String(trait2.desc)} — a rare and powerful combination.`
    : 'A unique and powerful personality profile.';

  const recommendedStream = streams[0] || { id: '', emoji: '', subjects: '' };
  const secondStream = streams[1] || { id: '', emoji: '', subjects: '' };
  const thirdStream = streams[2] || { id: '', emoji: '', subjects: '' };

  // Build "why these match" bullets from profile
  const whyMatchPoints = [];
  if (subjects.length > 0) {
    whyMatchPoints.push(`Your strongest subjects — ${subjects.slice(0, 3).join(', ')} — directly align with the academic requirements of your top career matches.`);
  }
  if (hobbies.length > 0) {
    const filteredHobbies = hobbies.filter(h => h !== 'None of the above');
    if (filteredHobbies.length > 0) {
      whyMatchPoints.push(`Your extracurricular activities (${filteredHobbies.slice(0, 2).join(', ')}) demonstrate real-world engagement with skills your top careers demand.`);
    }
  }
  if (marks) {
    whyMatchPoints.push(`Your academic performance (${marks}) has been factored in to ensure these recommendations are realistic and achievable for you.`);
  }
  whyMatchPoints.push(`Your Holland Code ${codeStr} places you in a distinct personality cluster — the careers above are statistically the strongest matches for this profile.`);
  if (maturityPct >= 70) {
    whyMatchPoints.push(`Your high maturity score (${maturityPct}%) indicates you are ready to pursue demanding, high-growth career paths that require self-direction and resilience.`);
  }

  // Maturity trait breakdown
  const maturityTraits = [
    {
      icon: '🎯',
      name: 'Leadership & Initiative',
      val: profile['dem_05']
        ? (profile['dem_05'].includes('Take charge') ? 'Strong' : profile['dem_05'].includes('Suggest') ? 'Good' : 'Developing')
        : 'N/A',
    },
    {
      icon: '⚖️',
      name: 'Ethical Reasoning',
      val: profile['dem_06']
        ? (profile['dem_06'].includes('Firmly decline') || profile['dem_06'].includes('Decline but offer') ? 'Strong' : 'Developing')
        : 'N/A',
    },
    {
      icon: '🛡️',
      name: 'Moral Courage',
      val: profile['dem_07']
        ? (profile['dem_07'].includes('Intervene') ? 'Strong' : profile['dem_07'].includes('Report') ? 'Good' : 'Developing')
        : 'N/A',
    },
    {
      icon: '📅',
      name: 'Self-Management',
      val: profile['dem_08']
        ? (profile['dem_08'].includes('detailed schedule') ? 'Strong' : profile['dem_08'].includes('steadily') ? 'Good' : 'Developing')
        : 'N/A',
    },
    {
      icon: '🔄',
      name: 'Resilience & Growth',
      val: profile['dem_09']
        ? (profile['dem_09'].includes('Analyse') ? 'Strong' : profile['dem_09'].includes('Feel bad briefly') ? 'Good' : 'Developing')
        : 'N/A',
    },
    {
      icon: '💪',
      name: 'Self-Discipline',
      val: profile['dem_10']
        ? (Number(profile['dem_10']) >= 8 ? 'Strong' : Number(profile['dem_10']) >= 5 ? 'Good' : 'Developing')
        : 'N/A',
    },
  ];

  return (
    <div className="res-root">
      {/* ── HERO ── */}
      <div className="res-hero">
        <div className="res-hero-eyebrow">🎉 Your Career Assessment Results</div>
        <div className="res-hero-name">
          {name !== 'Your' ? `${name}'s Profile` : 'Your Profile'}
        </div>
        <div className="res-hero-sub">Holland Code · RIASEC Psychometric Assessment</div>

        <div className="res-holland-code">
          {hollandCode.map((letter, idx) => {
            const meta = RIASEC_COLORS[letter];
            if (!meta) return null;
            return (
              <div
                key={String(letter)}
                className="res-holland-letter"
                style={{ background: String(meta.bar) }}
              >
                <span className="hl-rank">{idx + 1}</span>
                {String(letter)}
                <div style={{ fontSize: '9px', fontWeight: 600, opacity: 0.85, marginTop: '2px', fontFamily: "'DM Sans', sans-serif" }}>
                  {String(meta.label)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="res-holland-label" style={{ marginBottom: '16px' }}>
          Your 3-Letter Holland Code: <strong style={{ color: 'var(--gold)', fontSize: '18px' }}>{codeStr}</strong>
        </div>
        <div className="res-hero-tagline">{tagline}</div>
      </div>

      {/* ── RIASEC SCORES ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-icon" style={{ background: 'rgba(232,101,10,0.1)' }}>📊</div>
          <div>
            <div className="res-card-title">Your RIASEC Score Breakdown</div>
            <div className="res-card-subtitle">How strongly each Holland dimension resonates with you</div>
          </div>
        </div>
        <div className="riasec-bars">
          {Object.entries(riasecScores)
            .sort((a, b) => b[1] - a[1])
            .map(([key, pct]) => {
              const meta = RIASEC_COLORS[key];
              if (!meta) return null;
              return (
                <div key={String(key)} className="riasec-bar-row">
                  <div className="riasec-bar-key" style={{ background: String(meta.bar) }}>
                    {String(key)}
                  </div>
                  <div className="riasec-bar-info">
                    <div className="riasec-bar-top">
                      <span className="riasec-bar-name">{String(meta.label)} — {String(meta.desc)}</span>
                      <span className="riasec-bar-pct">{Number(pct)}%</span>
                    </div>
                    <div className="riasec-bar-track">
                      <div
                        className="riasec-bar-fill"
                        style={{ width: `${Number(pct)}%`, background: String(meta.bar) }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ── PSYCHOLOGICAL BREAKDOWN ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-icon" style={{ background: 'rgba(106,27,154,0.1)' }}>🧬</div>
          <div>
            <div className="res-card-title">Your Psychological Profile — Code {codeStr}</div>
            <div className="res-card-subtitle">A deep dive into what your top 3 traits mean about you</div>
          </div>
        </div>
        <div className="trait-grid">
          {hollandCode.map((letter, idx) => {
            const meta = RIASEC_COLORS[letter];
            const psych = RIASEC_PSYCHOLOGY[letter];
            if (!meta || !psych) return null;
            return (
              <div
                key={String(letter)}
                className="trait-card"
                style={{ background: String(meta.bg), border: `1px solid ${String(meta.color)}22` }}
              >
                <div className="trait-card-letter" style={{ color: String(meta.color) }}>
                  {String(letter)}
                </div>
                <div className="trait-card-name" style={{ color: String(meta.color) }}>
                  {String(meta.label)}
                </div>
                <div className="trait-card-archetype" style={{ color: String(meta.color) }}>
                  #{idx + 1} · {String(psych.archetype)}
                </div>
                <div className="trait-card-desc" style={{ color: String(meta.color) }}>
                  {String(psych.core)}
                </div>
                <div style={{ marginTop: '12px', textAlign: 'left' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: String(meta.color), letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Key Strengths
                  </div>
                  {psych.strengths.map((s, i) => (
                    <div key={i} style={{ fontSize: '11px', color: String(meta.color), opacity: 0.85, marginBottom: '3px', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                      <span>✓</span><span>{String(s)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '10px', textAlign: 'left' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: String(meta.color), letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.7 }}>
                    Inspired by
                  </div>
                  <div style={{ fontSize: '11px', color: String(meta.color), opacity: 0.75, fontStyle: 'italic' }}>
                    {String(psych.famousPeople)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STREAM RECOMMENDATION ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-icon" style={{ background: 'rgba(10,92,99,0.1)' }}>🎓</div>
          <div>
            <div className="res-card-title">Ideal Stream Recommendation</div>
            <div className="res-card-subtitle">Based on your Holland Code + Academic Marks + Best Subjects</div>
          </div>
        </div>
        <div className="stream-grid">
          {[
            { stream: recommendedStream, tier: 'recommended', tagLabel: '⭐ Best Fit', tagClass: 'best' },
            { stream: secondStream, tier: 'secondary', tagLabel: '✓ Good Fit', tagClass: 'good' },
            { stream: thirdStream, tier: 'not-recommended', tagLabel: 'Possible', tagClass: 'possible' },
          ].map(({ stream, tier, tagLabel, tagClass }) => (
            <div key={String(stream.id)} className={`stream-card ${tier}`} style={{
              background: tier === 'recommended' ? 'linear-gradient(135deg,rgba(232,101,10,0.06),rgba(240,165,0,0.06))' : 'rgba(61,34,5,0.03)',
            }}>
              <div className="stream-emoji">{String(stream.emoji)}</div>
              <div className="stream-name">{String(stream.id)}</div>
              <div className={`stream-tag ${tagClass}`}>{tagLabel}</div>
              <div className="stream-subjects">{String(stream.subjects)}</div>
            </div>
          ))}
        </div>
        <div className="stream-reason">
          <strong>Why {String(recommendedStream.id)}?</strong> Your Holland Code <strong>{codeStr}</strong> combined with your
          {subjects.length > 0 ? ` strength in ${subjects.slice(0, 2).join(' & ')}` : ' academic profile'}
          {marks ? ` and ${marks} marks` : ''} makes <strong>{String(recommendedStream.id)}</strong> the stream where you are most likely to excel and find fulfilment.
          {String(recommendedStream.id) === 'Science' && ' Science opens doors to engineering, medicine, research, and technology — all fields that reward your analytical and practical strengths.'}
          {String(recommendedStream.id) === 'Commerce' && ' Commerce equips you with the business, financial, and leadership skills that your Enterprising and Conventional traits are built for.'}
          {String(recommendedStream.id) === 'Arts / Humanities' && ' Arts & Humanities gives your creative, social, and expressive strengths the academic framework to flourish into a meaningful career.'}
        </div>
      </div>

      {/* ── TOP 5 CAREERS ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-icon" style={{ background: 'rgba(45,125,70,0.1)' }}>🚀</div>
          <div>
            <div className="res-card-title">Your Top 5 Career Matches</div>
            <div className="res-card-subtitle">Ranked by compatibility with your RIASEC profile, subjects, and interests</div>
          </div>
        </div>
        <div className="career-list">
          {top5Careers.map((career, idx) => (
            <div key={String(career.name)} className="career-item">
              <div className="career-item-top">
                <div className="career-rank-badge">#{idx + 1}</div>
                <div className="career-name">{String(career.name)}</div>
                <div className="career-match-pct">{Number(career.matchScore)}% match</div>
              </div>
              <div className="career-tags">
                {career.tags.map(tag => (
                  <span key={String(tag)} className="career-tag">{String(tag)}</span>
                ))}
                <span className="career-tag" style={{ background: 'rgba(232,101,10,0.08)', color: 'var(--saffron)' }}>
                  {career.riasec.join('')}
                </span>
              </div>
              <div className="career-desc">{String(career.desc)}</div>
              <div className="career-why">
                <div className="career-why-label">✨ Why this matches you</div>
                {String(career.whyText)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY THESE MATCH ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-icon" style={{ background: 'rgba(240,165,0,0.12)' }}>🔗</div>
          <div>
            <div className="res-card-title">Why These Careers Match You</div>
            <div className="res-card-subtitle">The specific connections between your profile and your results</div>
          </div>
        </div>
        <div className="why-match-list">
          {whyMatchPoints.map((point, i) => (
            <div key={i} className="why-match-item">
              <div className="why-match-dot" />
              <div className="why-match-text">{String(point)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MATURITY INDICATOR ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-icon" style={{ background: 'rgba(28,18,8,0.06)' }}>🧠</div>
          <div>
            <div className="res-card-title">Maturity & Readiness Indicator</div>
            <div className="res-card-subtitle">Based on your cognitive scenario responses and self-discipline rating</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '120px', height: '120px', borderRadius: '50%',
            background: `conic-gradient(${String(maturityLevel.color)} ${maturityPct * 3.6}deg, rgba(61,34,5,0.08) 0deg)`,
            marginBottom: '12px',
          }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', background: 'white',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: String(maturityLevel.color), lineHeight: 1 }}>
                {maturityPct}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>/ 100</div>
            </div>
          </div>
          <div>
            <span
              className="maturity-level-badge"
              style={{ background: String(maturityLevel.bg), color: String(maturityLevel.color) }}
            >
              {String(maturityLevel.emoji)} {String(maturityLevel.label)}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
            {maturityPct >= 85 && 'You demonstrate exceptional self-awareness, ethical reasoning, and self-direction. You are ready to pursue ambitious, high-responsibility career paths.'}
            {maturityPct >= 70 && maturityPct < 85 && 'You show strong maturity and reflective thinking. With continued self-development, you are well-positioned for demanding careers.'}
            {maturityPct >= 55 && maturityPct < 70 && 'You are developing well. Focus on building self-discipline and proactive decision-making to unlock your full potential.'}
            {maturityPct >= 40 && maturityPct < 55 && 'You are in an early stage of maturity development. Seek mentorship and challenge yourself with leadership opportunities.'}
            {maturityPct < 40 && 'This is a great starting point. Focus on self-awareness, responsibility, and resilience — these are learnable skills that will transform your career prospects.'}
          </div>
        </div>
        <div className="maturity-traits">
          {maturityTraits.map((trait, i) => (
            <div key={i} className="maturity-trait-row">
              <div className="maturity-trait-icon">{String(trait.icon)}</div>
              <div className="maturity-trait-info">
                <div className="maturity-trait-name">{String(trait.name)}</div>
                <div className="maturity-trait-val" style={{
                  color: trait.val === 'Strong' ? 'var(--success)' : trait.val === 'Good' ? 'var(--teal)' : 'var(--muted)',
                  fontWeight: 600,
                }}>
                  {String(trait.val)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="res-cta">
        <h3>Ready to Take the Next Step?</h3>
        <p>Explore detailed career paths, college options, and resources tailored to your Holland Code.</p>
        <div className="res-cta-btns">
          {onExplore && (
            <button className="btn-cta-primary" onClick={onExplore}>
              🔎 Explore Career Paths
            </button>
          )}
          <button className="btn-cta-secondary" onClick={onBack}>
            ← Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CareerAssessment({ onBack, onExplore, savedResults, onSaveResults }) {
  const [step, setStep]               = useState(0);
  const [studentProfile, setStudentProfile] = useState({});
  const [error, setError]             = useState(null);
  const [results, setResults]         = useState(null);
  const topRef = useRef(null);

  // Pull saveAssessmentResults from the dashboard context.
  // useDashboard() throws if there is no provider, so we guard with a try/catch
  // to keep CareerAssessment usable even when rendered outside a DashboardProvider.
  let saveAssessmentResults = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({ saveAssessmentResults } = useDashboard());
  } catch (_) {
    // No DashboardProvider in tree — saving will be skipped
  }

  // Inject styles
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = GOOGLE_FONTS + STYLES;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, results]);

  // Auto-fill name from Firebase auth
  useEffect(() => {
    const fetchUser = async () => {
      if (auth?.currentUser) {
        const updates = {};
        if (auth.currentUser.displayName) {
          updates['_name'] = auth.currentUser.displayName;
        }
        try {
          const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (snap.exists()) {
            const d = snap.data();
            if (d.grade || d.class) updates['_class'] = d.grade || d.class;
            if (d.city)             updates['_city']  = d.city;
          }
        } catch (e) {
          // silently ignore
        }
        if (Object.keys(updates).length) {
          setStudentProfile(prev => ({ ...prev, ...updates }));
        }
      }
    };
    fetchUser();
  }, []);

  // ── Profile setter ──────────────────────────────────────────────────────────
  const setField = (id, value) =>
    setStudentProfile(prev => ({ ...prev, [id]: value }));

  const toggleMulti = (id, option) => {
    setStudentProfile(prev => {
      const current = Array.isArray(prev[id]) ? prev[id] : [];
      const next = current.includes(option)
        ? current.filter(x => x !== option)
        : [...current, option];
      return { ...prev, [id]: next };
    });
  };

  const moveRankItem = (id, options, fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= options.length) return;
    const current = Array.isArray(studentProfile[id])
      ? [...studentProfile[id]]
      : [...options];
    const [moved] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, moved);
    setField(id, current);
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const currentStep = STEPS[step];
  const isFirst     = step === 0;
  const isLast      = step === STEPS.length - 1;
  const stepDone    = isStepComplete(currentStep.id, studentProfile);

  const goNext = () => {
    setError(null);
    if (!stepDone) {
      setError('Please answer all required questions before continuing.');
      return;
    }
    setStep(s => s + 1);
  };

  const goBack = () => {
    setError(null);
    setStep(s => Math.max(0, s - 1));
  };

  // ── CALCULATE RESULTS ───────────────────────────────────────────────────────
  const handleCalculate = async () => {
    setError(null);
    if (!stepDone) {
      setError('Please answer all required questions before calculating your results.');
      return;
    }

    const profile = studentProfile;
    const marks    = String(profile['dem_03'] || '');
    const subjects = Array.isArray(profile['dem_04']) ? profile['dem_04'] : [];
    const hobbies  = Array.isArray(profile['ext_01']) ? profile['ext_01'] : [];

    // 1. Compute raw RIASEC scores (0–100 normalised)
    let riasecScores = computeRiasecScores(profile);

    // 2. Apply subject boosts (weighted by marks)
    const marksW = MARKS_WEIGHT[marks] || 0.85;
    const boostedBySubjects = applySubjectBoosts(riasecScores, subjects);
    // Blend: 70% raw + 30% subject-boosted, scaled by marks weight
    const blended = {};
    Object.keys(riasecScores).forEach(k => {
      blended[k] = Math.min(100, Math.round(
        (riasecScores[k] * 0.7 + boostedBySubjects[k] * 0.3) * marksW
      ));
    });

    // 3. Apply hobby boosts (lighter weight)
    const finalScores = applyHobbyBoosts(blended, hobbies);

    // 4. Get top 3 → Holland Code
    const hollandCode = getTop3(finalScores);

    // 5. Stream recommendation
    const streams = recommendStream(hollandCode, marks, subjects);

    // 6. Top 5 careers
    const top5Careers = getTop5Careers(hollandCode, subjects, hobbies, marks);

    // 7. Maturity score
    const maturityPct = computeMaturityScore(profile);

    const computedResults = {
      hollandCode,
      riasecScores: finalScores,
      streams,
      top5Careers,
      maturityPct,
      profile,
    };

    setResults(computedResults);

    // ── Persist results to the dashboard context + Firebase ──────────────────
    // Use the authenticated user's UID as the student ID when available,
    // otherwise fall back to a stable anonymous key so the data is still saved.
    const studentId = auth?.currentUser?.uid || '_anonymous';

    // Save to Firestore using dot notation
    if (auth?.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const caseFileRef = doc(db, 'caseFiles', auth.currentUser.uid);
        
        // 1. Save the RIASEC data to the Student Master Record using setDoc with merge: true
        await setDoc(userRef, {
          riasecScores: finalScores,
          riasecCode: hollandCode.join(''),
          careerDNA: {
            riasec: {
              scores: finalScores,
              code: hollandCode.join('')
            }
          }
        }, { merge: true });
        
        // 2. Log the event in the Case File history timeline
        await updateDoc(caseFileRef, {
          history: arrayUnion({
            type: 'assessment_completion',
            title: 'Completed RIASEC Career Assessment',
            timestamp: new Date().toISOString()
          })
        }).catch(() => {
           // Ignore if caseFile doesn't exist yet
        });
      } catch (err) {
        console.error('Error updating Firebase:', err);
      }
    }

    if (saveAssessmentResults) {
      saveAssessmentResults(studentId, computedResults);
    }

    // Also call the legacy prop callback if the parent still uses it
    if (onSaveResults) onSaveResults(computedResults);
  };

  // ── Progress ────────────────────────────────────────────────────────────────
  const totalAnswerable = Object.values(STEP_QUESTIONS)
    .flat()
    .filter(q => q.type !== 'text').length;
  const totalAnswered = Object.values(STEP_QUESTIONS)
    .flat()
    .filter(q => q.type !== 'text')
    .filter(q => {
      const v = studentProfile[q.id];
      if (q.type === 'multiple') return Array.isArray(v) && v.length > 0;
      if (q.type === 'ranking')  return Array.isArray(v) && v.length === q.options.length;
      return v !== undefined && v !== '' && v !== null;
    }).length;
  const progressPct = Math.round((totalAnswered / totalAnswerable) * 100);

  // ── Render helpers ──────────────────────────────────────────────────────────

  const renderScaleQuestion = (q, idx, total) => {
    const answered = studentProfile[q.id] !== undefined;
    const isScale10 = q.scaleMax === 10;

    return (
      <div key={q.id} className={`q-card ${answered ? 'answered' : ''}`}>
        <div className="q-card-top">
          <div className="q-number">Q{idx + 1} of {total}</div>
          <div className="q-check">{answered ? '✓' : ''}</div>
        </div>
        <div className="q-text">{q.question}</div>

        {isScale10 ? (
          <div className="scale10-wrap">
            <div className="scale10-row">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                <button
                  key={v}
                  className={`scale10-btn ${studentProfile[q.id] === v ? 'selected' : ''}`}
                  onClick={() => setField(q.id, v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="scale10-labels">
              <span className="scale10-label">{q.scaleLabels?.min}</span>
              <span className="scale10-label right">{q.scaleLabels?.max}</span>
            </div>
          </div>
        ) : (
          <div className="q-scale-wrap">
            <div className="q-scale">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  className={`scale-btn ${studentProfile[q.id] === v ? 'selected' : ''}`}
                  onClick={() => setField(q.id, v)}
                >
                  {v}
                  <span className="scale-label-text">{LIKERT_LABELS[v]}</span>
                </button>
              ))}
            </div>
            <div className="q-scale-labels">
              <span className="q-scale-label">{q.scaleLabels?.min || 'Strongly Disagree'}</span>
              <span className="q-scale-label right">{q.scaleLabels?.max || 'Strongly Agree'}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSingleQuestion = (q, idx, total) => {
    const answered = studentProfile[q.id] !== undefined;
    return (
      <div key={q.id} className={`q-card ${answered ? 'answered' : ''}`}>
        <div className="q-card-top">
          <div className="q-number">Q{idx + 1} of {total}</div>
          <div className="q-check">{answered ? '✓' : ''}</div>
        </div>
        <div className="q-text">{q.question}</div>
        <div className={`choice-grid ${(q.options || []).length <= 4 ? 'single-col' : ''}`}>
          {(q.options || []).map((opt, i) => (
            <button
              key={i}
              className={`choice-btn ${studentProfile[q.id] === opt ? 'selected' : ''}`}
              onClick={() => setField(q.id, opt)}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMultipleQuestion = (q, idx, total) => {
    const selected = Array.isArray(studentProfile[q.id]) ? studentProfile[q.id] : [];
    const answered = selected.length > 0;
    return (
      <div key={q.id} className={`q-card ${answered ? 'answered' : ''}`}>
        <div className="q-card-top">
          <div className="q-number">Q{idx + 1} of {total}</div>
          <div className="q-check">{answered ? '✓' : ''}</div>
        </div>
        <div className="q-text">{q.question}</div>
        <div className="ca-chips-wrap">
          {(q.options || []).map((opt, i) => (
            <button
              key={i}
              className={`ca-chip ${selected.includes(opt) ? 'selected' : ''}`}
              onClick={() => toggleMulti(q.id, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
            ✓ {selected.length} selected
          </div>
        )}
      </div>
    );
  };

  const renderRankingQuestion = (q, idx, total) => {
    const currentOrder = Array.isArray(studentProfile[q.id])
      ? studentProfile[q.id]
      : q.options;
    const answered = Array.isArray(studentProfile[q.id]) && studentProfile[q.id].length === q.options.length;

    return (
      <div key={q.id} className={`q-card ${answered ? 'answered' : ''}`}>
        <div className="q-card-top">
          <div className="q-number">Q{idx + 1} of {total}</div>
          <div className="q-check">{answered ? '✓' : ''}</div>
        </div>
        <div className="q-text">{q.question}</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', fontWeight: 600 }}>
          Use the arrows to reorder — #1 is most important to you.
        </div>
        <div className="ranking-list">
          {currentOrder.map((item, i) => (
            <div key={String(item)} className="ranking-item">
              <div className="rank-num">{i + 1}</div>
              <div className="rank-text">{String(item)}</div>
              <div className="rank-arrows">
                <button
                  className="rank-arrow"
                  onClick={() => moveRankItem(q.id, currentOrder, i, i - 1)}
                  disabled={i === 0}
                  title="Move up"
                >▲</button>
                <button
                  className="rank-arrow"
                  onClick={() => moveRankItem(q.id, currentOrder, i, i + 1)}
                  disabled={i === currentOrder.length - 1}
                  title="Move down"
                >▼</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuestion = (q, idx, total) => {
    switch (q.type) {
      case 'scale':    return renderScaleQuestion(q, idx, total);
      case 'single':   return renderSingleQuestion(q, idx, total);
      case 'multiple': return renderMultipleQuestion(q, idx, total);
      case 'ranking':  return renderRankingQuestion(q, idx, total);
      default:         return null;
    }
  };

  // ── STEP CONTENT ────────────────────────────────────────────────────────────

  const renderIntakeStep = () => {
    const ageQ      = demographicQuestions[0];
    const levelQ    = demographicQuestions[1];
    const marksQ    = demographicQuestions[2];
    const subjectsQ = demographicQuestions[3];

    const selectedSubjects = Array.isArray(studentProfile['dem_04']) ? studentProfile['dem_04'] : [];

    return (
      <div>
        <div className="ca-info-card">
          <h4>📅 Age & Education Level</h4>
          <div className="ca-two-col">
            <div className="ca-field">
              <label>{ageQ.question} *</label>
              <select
                value={studentProfile['dem_01'] || ''}
                onChange={e => setField('dem_01', e.target.value)}
              >
                <option value="">Select your age range</option>
                {ageQ.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="ca-field">
              <label>{levelQ.question} *</label>
              <select
                value={studentProfile['dem_02'] || ''}
                onChange={e => setField('dem_02', e.target.value)}
              >
                <option value="">Select your level</option>
                {levelQ.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="ca-info-card">
          <h4>📊 Academic Performance</h4>
          <div className="ca-field">
            <label>{marksQ.question} *</label>
            <div className="choice-grid">
              {marksQ.options.map(opt => (
                <button
                  key={opt}
                  className={`choice-btn ${studentProfile['dem_03'] === opt ? 'selected' : ''}`}
                  onClick={() => setField('dem_03', opt)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ca-info-card">
          <h4>📚 Best Subjects & Interests</h4>
          <div className="ca-field">
            <label>{subjectsQ.question} *</label>
            <div className="ca-chips-wrap">
              {subjectsQ.options.map(opt => (
                <button
                  key={opt}
                  className={`ca-chip ${selectedSubjects.includes(opt) ? 'selected' : ''}`}
                  onClick={() => toggleMulti('dem_04', opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selectedSubjects.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                ✓ {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>

        <div className="ca-info-card">
          <h4>✨ A Little More About You (Optional)</h4>
          <div className="ca-two-col">
            <div className="ca-field">
              <label>Your Name</label>
              {auth?.currentUser?.displayName ? (
                <div className="ca-autofill-box">
                  {studentProfile['_name'] || auth.currentUser.displayName}
                  <span className="ca-autofill-tag">✓ Auto-filled</span>
                </div>
              ) : (
                <input
                  value={studentProfile['_name'] || ''}
                  onChange={e => setField('_name', e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                />
              )}
            </div>
            <div className="ca-field">
              <label>City &amp; State</label>
              <input
                value={studentProfile['_city'] || ''}
                onChange={e => setField('_city', e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
              />
            </div>
          </div>
          <div className="ca-field">
            <label>Any career dream or aspiration you already have?</label>
            <input
              value={studentProfile['_aspiration'] || ''}
              onChange={e => setField('_aspiration', e.target.value)}
              placeholder="e.g. I want to work in AI, or I'm considering medicine"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMaturityStep = () => {
    const qs = STEP_QUESTIONS['maturity'];
    return (
      <div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(232,101,10,0.06), rgba(10,92,99,0.06))',
          border: '1px solid rgba(232,101,10,0.15)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          fontSize: '14px',
          color: 'var(--brown)',
          lineHeight: 1.65,
        }}>
          <strong>💡 How to answer:</strong> These are scenario-based questions. Choose the response that most honestly reflects how you would actually behave — not the "ideal" answer.
        </div>
        {qs.map((q, idx) => {
          const answered = studentProfile[q.id] !== undefined && studentProfile[q.id] !== '';
          if (q.type === 'scale') {
            return renderScaleQuestion(q, idx, qs.length);
          }
          return (
            <div key={q.id} className={`maturity-card ${answered ? 'answered' : ''}`}>
              <div className="q-card-top">
                <div className="q-number">Scenario {idx + 1} of {qs.length}</div>
                <div className="q-check">{answered ? '✓' : ''}</div>
              </div>
              <div className="maturity-scenario">{q.question}</div>
              <div className="choice-grid single-col">
                {(q.options || []).map((opt, i) => (
                  <button
                    key={i}
                    className={`choice-btn ${studentProfile[q.id] === opt ? 'selected' : ''}`}
                    onClick={() => setField(q.id, opt)}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRiasecStep = (stepId) => {
    const qs = STEP_QUESTIONS[stepId];
    const riasecKey = currentStep.riasecKey;
    const meta = RIASEC_COLORS[riasecKey];

    const scaleQs  = qs.filter(q => q.type === 'scale');
    const singleQs = qs.filter(q => q.type === 'single');

    const answeredScale  = scaleQs.filter(q => studentProfile[q.id] !== undefined).length;
    const answeredSingle = singleQs.filter(q => studentProfile[q.id] !== undefined).length;

    return (
      <div>
        <div style={{
          background: meta.bg,
          border: `2px solid ${meta.color}22`,
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: meta.color, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: '700',
            fontFamily: "'Playfair Display', serif",
            flexShrink: 0,
          }}>
            {riasecKey}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: meta.color, fontFamily: "'Playfair Display', serif" }}>
              {meta.label} — {meta.desc}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>
              {SECTION_META[stepId]?.description}
            </div>
          </div>
        </div>

        {scaleQs.length > 0 && (
          <>
            <div className="ca-section-divider">
              <div className="ca-section-divider-line" />
              <div className="ca-section-divider-label">
                Likert Scale — {answeredScale}/{scaleQs.length} answered
              </div>
              <div className="ca-section-divider-line" />
            </div>
            {scaleQs.map((q, idx) => renderScaleQuestion(q, idx, scaleQs.length))}
          </>
        )}

        {singleQs.length > 0 && (
          <>
            <div className="ca-section-divider">
              <div className="ca-section-divider-line" />
              <div className="ca-section-divider-label">
                Scenario Question — {answeredSingle}/{singleQs.length} answered
              </div>
              <div className="ca-section-divider-line" />
            </div>
            {singleQs.map((q, idx) => renderSingleQuestion(q, idx, singleQs.length))}
          </>
        )}
      </div>
    );
  };

  const renderValuesStep = () => {
    const qs = STEP_QUESTIONS['values'];

    const hobbiesQs  = qs.filter(q => ['ext_01','ext_02','ext_03'].includes(q.id));
    const envQs      = qs.filter(q => ['ext_04','ext_05','ext_06','ext_07','ext_08','ext_09','ext_10'].includes(q.id));
    const stressQs   = qs.filter(q => ['ext_11','ext_12','ext_13','ext_14','ext_15','ext_16','ext_17','ext_18'].includes(q.id));

    const renderGroup = (groupQs, startIdx) =>
      groupQs.map((q, i) => renderQuestion(q, startIdx + i, qs.length));

    return (
      <div>
        <div className="ca-section-divider">
          <div className="ca-section-divider-line" />
          <div className="ca-section-divider-label">🎯 Hobbies & Extracurriculars</div>
          <div className="ca-section-divider-line" />
        </div>
        {renderGroup(hobbiesQs, 0)}

        <div className="ca-section-divider">
          <div className="ca-section-divider-line" />
          <div className="ca-section-divider-label">🏢 Work Environment & Values</div>
          <div className="ca-section-divider-line" />
        </div>
        {renderGroup(envQs, hobbiesQs.length)}

        <div className="ca-section-divider">
          <div className="ca-section-divider-line" />
          <div className="ca-section-divider-label">💪 Stress Tolerance & Resilience</div>
          <div className="ca-section-divider-line" />
        </div>
        {renderGroup(stressQs, hobbiesQs.length + envQs.length)}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'intake':        return renderIntakeStep();
      case 'maturity':      return renderMaturityStep();
      case 'realistic':
      case 'investigative':
      case 'artistic':
      case 'social':
      case 'enterprising':
      case 'conventional':  return renderRiasecStep(currentStep.id);
      case 'values':        return renderValuesStep();
      default:              return null;
    }
  };

  // ── ANSWERED COUNT for current step ────────────────────────────────────────
  const currentStepQs = STEP_QUESTIONS[currentStep.id] || [];
  const currentAnswered = countAnswered(currentStepQs, studentProfile);

  // ── RENDER ──────────────────────────────────────────────────────────────────

  // If results are computed, show results screen
  if (results) {
    return (
      <div className="ca-root">
        <header className="ca-header">
          <div className="ca-logo" onClick={onBack}>Vidya<span>Vantage</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onExplore && (
              <button
                onClick={onExplore}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)', padding: '8px 18px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                🔎 Explore Careers
              </button>
            )}
            <div className="ca-badge">Results Ready ✓</div>
          </div>
        </header>
        <div ref={topRef} />
        <ResultsScreen
          results={results}
          onBack={() => { setResults(null); setStep(0); setStudentProfile({}); }}
          onExplore={onExplore}
        />
      </div>
    );
  }

  return (
    <div className="ca-root">
      {/* Header */}
      <header className="ca-header">
        <div className="ca-logo" onClick={onBack}>Vidya<span>Vantage</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onExplore && (
            <button
              onClick={onExplore}
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)', padding: '8px 18px', borderRadius: '20px',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              🔎 Explore Careers
            </button>
          )}
          <div className="ca-badge">Step {step + 1} of {STEPS.length}</div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="ca-progress-wrap">
        <div className="ca-step-pills">
          {STEPS.map((s, i) => {
            const status = i < step ? 'done' : i === step ? 'active' : 'todo';
            return (
              <div key={s.id} className={`ca-step-pill ${status}`}>
                {status === 'done' ? '✓' : s.emoji} {s.label}
              </div>
            );
          })}
        </div>
        <div className="ca-progress-right">
          <div className="ca-progress-bar-bg">
            <div className="ca-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="ca-progress-pct">{progressPct}%</span>
        </div>
      </div>

      {/* Form */}
      <div className="ca-form-card" ref={topRef}>
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* Section header */}
        <div className="ca-section-header">
          <div className="ca-section-badge">{currentStep.badge}</div>
          <span className="ca-section-icon">{currentStep.emoji}</span>
          <h2>{currentStep.title}</h2>
          <p>{currentStep.desc}</p>
        </div>

        {/* Step content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="ca-nav">
          <button
            className="btn-back"
            onClick={goBack}
            style={{ visibility: isFirst ? 'hidden' : 'visible' }}
          >
            ← Back
          </button>

          {currentStepQs.length > 0 && (
            <span className="ca-progress-note">
              {currentAnswered} / {currentStepQs.length} answered
            </span>
          )}

          {isLast ? (
            <button
              className="btn-calculate"
              onClick={handleCalculate}
              disabled={!stepDone}
            >
              🚀 Calculate My Results
            </button>
          ) : (
            <button
              className="btn-next"
              onClick={goNext}
              disabled={!stepDone}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
