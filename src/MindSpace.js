import React, { useState, useEffect, useRef } from 'react';

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .mh-page { min-height: 100vh; background: var(--warm-white, #FDFCFA); font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 120px; position: relative; }
  
  .mh-topbar { background: var(--ink, #1E2820); color: white; height: 56px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 300; border-bottom: 3px solid var(--lavender, #7C6FA0); }
  .mh-back { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .mh-back:hover { color: white; }
  .mh-topbar-title { font-family: 'Fraunces', serif; font-size: 16px; color: white; }
  
  .mh-streak-banner { background: var(--lavender, #7C6FA0); color: white; text-align: center; padding: 10px 20px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; z-index: 290; }

  .mh-hero { background: linear-gradient(135deg, var(--ink, #1E2820) 0%, #2A2438 100%); padding: 80px 48px 100px; position: relative; overflow: hidden; text-align: center; color: white; }
  .mh-hero::before { content: ''; position: absolute; top: -50px; left: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(124,111,160,0.15), transparent 70%); border-radius: 50%; }
  .mh-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  
  .mh-memory-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; margin-bottom: 24px; cursor: pointer; transition: 0.2s; color: #B3A4D6; }
  .mh-memory-badge:hover { background: rgba(255,255,255,0.2); color: white; }

  .mh-eyebrow { display: inline-block; background: rgba(124,111,160,0.2); border: 1px solid rgba(124,111,160,0.4); color: #B3A4D6; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
  .mh-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 48px); font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
  .mh-h1 em { font-style: italic; color: #B3A4D6; }
  .mh-sub { font-size: 18px; color: rgba(255,255,255,0.8); line-height: 1.6; font-weight: 400; max-width: 600px; margin: 0 auto; }

  .mh-start-container { max-width: 700px; margin: -50px auto 40px; position: relative; z-index: 20; padding: 0 24px; }
  .mh-start-box { background: white; border-radius: 24px; padding: 32px; text-align: center; box-shadow: 0 16px 40px rgba(0,0,0,0.12); border: 3px solid var(--lavender, #7C6FA0); }
  .mh-start-box h3 { font-family: 'Fraunces', serif; font-size: 24px; margin: 0 0 8px; color: var(--ink); }
  .mh-start-box p { color: var(--ink-soft); margin: 0 0 24px; font-size: 15px; }
  .mh-start-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .mh-start-actions button { flex: 1; min-width: 250px; padding: 16px; font-size: 15px; }

  .quick-calm-inline { background: #EAF4FA; border: 1px solid rgba(41,128,185,0.2); border-radius: 24px; padding: 32px; max-width: 700px; margin: 0 auto 40px; text-align: center; display: none; }
  .quick-calm-inline.active { display: block; animation: fadeIn 0.4s ease; }
  .breathing-circle { width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #5B9EBF, #A89DD0); margin: 24px auto; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-family: 'Fraunces', serif; font-size: 24px; box-shadow: 0 8px 32px rgba(91,158,191,0.3); transition: all 0.5s ease; }
  
  @keyframes breatheCycle {
    0% { transform: scale(1); }
    21% { transform: scale(1.5); }
    58% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  .breathing-circle.animating { animation: breatheCycle 19s infinite linear; }

  .mh-validation { text-align: center; max-width: 600px; margin: 0 auto 48px; padding: 0 24px; color: var(--ink-soft); font-size: 16px; line-height: 1.6; }
  .mh-validation strong { color: var(--ink); font-family: 'Fraunces', serif; font-size: 20px; display: block; margin: 8px 0; }
  .mh-human-touch { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: var(--muted); margin-top: 16px; font-weight: 600; }

  .roulette-card { background: white; border-radius: 20px; border: 2px dashed var(--lavender); padding: 32px; text-align: center; margin: 0 auto 48px; max-width: 700px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
  .roulette-window { height: 80px; overflow: hidden; position: relative; background: var(--sand); border-radius: 16px; margin: 24px auto; width: 80%; border: 1px solid var(--border); box-shadow: inset 0 4px 12px rgba(0,0,0,0.05); }
  .roulette-track { display: flex; flex-direction: column; transition: transform cubic-bezier(0.15, 0.85, 0.25, 1); }
  .roulette-item { height: 80px; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; }
  .roulette-item.bad { color: var(--ink-soft); opacity: 0.5; }
  .roulette-item.good { color: var(--lavender); }
  .roulette-msg { background: #F7F3ED; padding: 16px; border-radius: 12px; color: var(--ink); font-weight: 600; font-size: 15px; margin-top: 24px; animation: floatUp 0.4s ease; border-left: 4px solid var(--lavender); }

  .mh-container { max-width: 1100px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 10; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
  .mh-card { background: white; border-radius: 20px; border: 1px solid var(--border, rgba(74,124,89,0.15)); box-shadow: 0 8px 24px rgba(0,0,0,0.04); padding: 32px; transition: all 0.3s; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .mh-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: var(--lavender, #7C6FA0); }
  .mh-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; }
  
  @keyframes pulseRed {
    0% { box-shadow: 0 0 0 0 rgba(192,57,43,0.4); }
    70% { box-shadow: 0 0 0 15px rgba(192,57,43,0); }
    100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); }
  }
  .mh-card.crisis { border: 2px solid #C0392B; background: #FFFDFD; animation: pulseRed 2.5s infinite; grid-column: 1 / -1; }
  .mh-card.crisis::before { background: linear-gradient(90deg, #C0392B, #E74C3C); }
  .mh-card.toolkit::before { background: linear-gradient(90deg, var(--sage, #4A7C59), #87D09E); }
  .mh-card.wheel::before { background: linear-gradient(90deg, var(--lavender, #7C6FA0), #A89DD0); }
  .mh-card.control::before { background: linear-gradient(90deg, var(--sky, #5B9EBF), #89C4E0); }
  .mh-card.anxiety::before { background: linear-gradient(90deg, var(--peach, #E8845A), #F0A97A); }

  .mh-icon { font-size: 40px; margin-bottom: 16px; }
  .mh-crisis-label { color: #C0392B; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
  .mh-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink, #1E2820); margin-bottom: 12px; line-height: 1.2; }
  .mh-desc { font-size: 15px; color: var(--ink-soft, #3D4A40); line-height: 1.6; margin-bottom: 24px; flex: 1; }
  .mh-meta { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .mh-badge { padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: var(--sand, #F7F3ED); color: var(--muted, #7A8A7D); }
  .mh-badge.time { background: #EAF4FA; color: #2980B9; border: 1px solid rgba(41,128,185,0.2); }
  
  .mh-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .mh-btn { padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-family: inherit; }
  .mh-btn-primary { background: var(--lavender, #7C6FA0); color: white; }
  .mh-btn-primary:hover { background: #655985; transform: translateY(-2px); }
  .mh-btn-outline { background: transparent; color: var(--ink, #1E2820); border: 2px solid var(--border, rgba(74,124,89,0.15)); }
  .mh-btn-outline:hover { border-color: var(--lavender, #7C6FA0); color: var(--lavender, #7C6FA0); }
  .mh-btn-danger { background: #C0392B; color: white; }
  .mh-btn-danger:hover { background: #A93226; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(192,57,43,0.3); }

  .mh-return-hook { max-width: 800px; margin: 80px auto 0; padding: 48px; border-top: 1px solid var(--border); text-align: center; }
  .mh-return-hook h3 { font-family: 'Fraunces', serif; font-size: 24px; color: var(--ink); margin-bottom: 24px; }
  .mh-hook-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
  .mh-hook-link { background: white; border: 1px solid var(--border); padding: 12px 24px; border-radius: 50px; color: var(--ink); font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; }
  .mh-hook-link:hover { border-color: var(--lavender); color: var(--lavender); transform: translateY(-2px); }
  
  .mh-exit-safety { text-align: center; padding: 40px 24px; color: var(--muted); font-size: 15px; }

  .mh-toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--ink); color: white; padding: 16px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; z-index: 2000; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 12px 24px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 12px; }
  .mh-toast.visible { transform: translateX(-50%) translateY(0); opacity: 1; }

  .sticky-mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 16px 24px; box-shadow: 0 -4px 24px rgba(0,0,0,0.1); z-index: 1000; border-top: 1px solid var(--border); }
  .sticky-mobile-cta .mh-btn { width: 100%; padding: 16px; font-size: 16px; }

  .mh-modal-overlay { position: fixed; inset: 0; background: rgba(30,40,32,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .mh-modal { background: white; border-radius: 24px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 24px 48px rgba(0,0,0,0.2); animation: floatUp 0.3s ease; }
  .mh-modal-header { padding: 32px 32px 24px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: white; z-index: 10; display: flex; justify-content: space-between; align-items: flex-start; }
  .mh-modal-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--ink); margin: 0; }
  .mh-modal-close { background: var(--sand); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; color: var(--muted); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .mh-modal-close:hover { background: #EAE5DE; color: var(--ink); }
  .mh-modal-body { padding: 32px; }

  .ew-container { display: flex; flex-direction: column; gap: 24px; }
  .ew-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .ew-back-btn { background: none; border: none; font-size: 14px; font-weight: 600; color: var(--lavender); cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0; transition: 0.2s; }
  .ew-core-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .ew-core-card { padding: 24px; border-radius: 16px; color: white; cursor: pointer; text-align: center; transition: 0.3s; border: none; font-family: inherit; }
  .ew-chip-grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .ew-chip { padding: 12px 20px; border-radius: 50px; font-size: 15px; font-weight: 600; cursor: pointer; border: 2px solid transparent; transition: 0.2s; font-family: inherit; }
  .ew-breadcrumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--muted); background: var(--sand); padding: 12px 20px; border-radius: 12px; margin-bottom: 24px; }
  .ew-result-box { background: white; border: 2px solid; padding: 24px; border-radius: 16px; margin-top: 16px; animation: fadeIn 0.3s ease; }

  .crisis-list { display: flex; flex-direction: column; gap: 16px; }
  .crisis-item { background: #FFF0F0; border: 1px solid rgba(192,57,43,0.2); padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .crisis-info h4 { margin: 0 0 4px 0; font-size: 18px; color: #C0392B; }
  .crisis-info p { margin: 0; font-size: 13px; color: var(--ink-soft); }
  .crisis-call-btn { background: #C0392B; color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes floatUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  @media(max-width: 768px) {
    .mh-hero { padding: 60px 24px 100px; }
    .mh-h1 { font-size: 32px; }
    .mh-container { padding: 0 24px; grid-template-columns: 1fr; gap: 32px; }
    .mh-modal-header, .mh-modal-body { padding: 24px; }
    .crisis-item { flex-direction: column; align-items: flex-start; }
    .ew-core-grid { grid-template-columns: 1fr; }
    .mh-start-container { margin-top: -60px; }
    .mh-actions { flex-direction: column; width: 100%; }
    .mh-actions .mh-btn { width: 100%; }
    .sticky-mobile-cta { display: block; }
  }
`;

const ROULETTE_DATA = [
  { text: "Anxious", isGood: false }, { text: "Joyful", isGood: true, msg: "Your capacity for joy is beautiful. Savor it." },
  { text: "Overwhelmed", isGood: false }, { text: "Peaceful", isGood: true, msg: "Take a deep breath and anchor yourself into this peace." },
  { text: "Stressed", isGood: false }, { text: "Capable", isGood: true, msg: "You have survived 100% of your bad days. You've got this." },
  { text: "Insecure", isGood: false }, { text: "Loved", isGood: true, msg: "You are worthy of love and belonging, exactly as you are." },
  { text: "Frustrated", isGood: false }, { text: "Brave", isGood: true, msg: "Facing your feelings takes courage. You are truly brave." },
  { text: "Irritated", isGood: false }, { text: "Resilient", isGood: true, msg: "You bend, but you do not break. Your strength is inspiring." },
  { text: "Mad", isGood: false }, { text: "Hopeful", isGood: true, msg: "There is always a way forward. Keep holding on to hope." },
  { text: "Isolated", isGood: false }, { text: "Connected", isGood: true, msg: "You are not alone. There are people who understand and care." },
  { text: "Empty", isGood: false }, { text: "Strong", isGood: true, msg: "You are stronger than the things that make you feel weak." },
  { text: "Powerless", isGood: false }, { text: "Enough", isGood: true, msg: "You don't need to prove anything. You are enough." },
  { text: "Hopeless", isGood: false }, { text: "Present", isGood: true, msg: "It is safe to be here, in this moment, exactly as you are." },
  { text: "Disappointed", isGood: false }, { text: "Resting", isGood: true, msg: "It's okay to rest. You are allowed to take a break." },
  { text: "Numb", isGood: false }, { text: "Grounded", isGood: true, msg: "Feel the earth beneath you. You are held and secure." },
  { text: "Judged", isGood: false }, { text: "Guided", isGood: true, msg: "Trust your inner compass. You will find your way." },
  { text: "Lost", isGood: false }, { text: "Worthy", isGood: true, msg: "Shame does not define you. Your worth is inherent." }
];

const SPIN_MULTIPLIER = 4; 
const TRACK_ITEMS = Array(SPIN_MULTIPLIER).fill(ROULETTE_DATA).flat();

const EMOTION_DATA = {
  Anger: { color: '#E8845A', children: { Frustrated: ["Irritated", "Annoyed"], Mad: ["Furious", "Resentful"], Bitter: ["Indignant", "Violated"] } },
  Fear: { color: '#7C6FA0', children: { Anxious: ["Overwhelmed", "Stressed"], Insecure: ["Inferior", "Worthless"], Scared: ["Helpless", "Panicked"] } },
  Surprise: { color: '#5B9EBF', children: { Excited: ["Energetic", "Thrilled"], Amazed: ["Astonished", "Awe"], Confused: ["Perplexed", "Dismayed"] } },
  Happy: { color: '#E1B846', children: { Playful: ["Aroused", "Free"], Content: ["Joyful", "Peaceful"], Proud: ["Confident", "Respected"] } },
  Sad: { color: '#4A6984', children: { Lonely: ["Isolated", "Empty"], Vulnerable: ["Fragile", "Powerless"], Despair: ["Grief", "Hopeless"] } },
  Disgust: { color: '#4A7C59', children: { Disapproving: ["Judgmental", "Condemning"], Disappointed: ["Appalled", "Nauseated"], Awful: ["Detestable", "Repugnant"] } }
};

const SECTORS = [
  { n: 'ANGER', a0: 240, a1: 300, c: ['#C02828', '#D85555', '#EDAAAA'], tc: '#7A1010', mtc: '#fff',
    m: [ { n: 'MAD', o: ['FURIOUS', 'ENRAGED'] }, { n: 'AGGRESSIVE', o: ['PROVOKED', 'HOSTILE'] }, { n: 'FRUSTRATED', o: ['INFURIATED', 'IRRITATED'] }, { n: 'DISTANT', o: ['WITHDRAWN', 'SUSPICIOUS'] }, { n: 'CRITICAL', o: ['RESENTFUL', 'VIOLATED'] }, { n: 'HATEFUL', o: ['JEALOUS', 'INSECURE'] }, { n: 'HURT', o: ['THREATENED', 'HUMILIATED'] } ]
  },
  { n: 'DISGUST', a0: 300, a1: 360, c: ['#5830A0', '#7D58C0', '#B898DC'], tc: '#2C1268', mtc: '#fff',
    m: [ { n: 'DISAPPROVAL', o: ['JUDGMENTAL', 'SARCASTIC'] }, { n: 'DISAPPOINTED', o: ['REPUGNANT', 'REVOLTED'] }, { n: 'AWFUL', o: ['DETESTABLE', 'REVULSION'] }, { n: 'AVOIDANCE', o: ['AVERSION', 'HESITANT'] } ]
  },
  { n: 'SAD', a0: 0, a1: 60, c: ['#2448A0', '#4A70C0', '#8AAADA'], tc: '#102460', mtc: '#fff',
    m: [ { n: 'GUILTY', o: ['REMORSEFUL', 'ASHAMED'] }, { n: 'ABANDONED', o: ['IGNORED', 'VICTIMIZED'] }, { n: 'DESPAIR', o: ['POWERLESS', 'VULNERABLE'] }, { n: 'DEPRESSED', o: ['INFERIOR', 'EMPTY'] }, { n: 'LONELY', o: ['ISOLATED', 'APATHETIC'] }, { n: 'BORED', o: ['INDIFFERENT', 'LIFELESS'] } ]
  },
  { n: 'HAPPY', a0: 60, a1: 120, c: ['#8C7808', '#B09820', '#DCC850'], tc: '#3C3200', mtc: '#1A1200',
    m: [ { n: 'JOYFUL', o: ['ECSTATIC', 'LIBERATED'] }, { n: 'INTERESTED', o: ['INQUISITIVE', 'AMUSED'] }, { n: 'PROUD', o: ['CONFIDENT', 'IMPORTANT'] }, { n: 'ACCEPTED', o: ['RESPECTED', 'FULFILLED'] }, { n: 'POWERFUL', o: ['COURAGEOUS', 'PROVOCATIVE'] }, { n: 'PEACEFUL', o: ['LOVING', 'HOPEFUL'] }, { n: 'INTIMATE', o: ['SENSITIVE', 'PLAYFUL'] } ]
  },
  { n: 'SURPRISE', a0: 120, a1: 180, c: ['#0A7C6C', '#289888', '#68C8C0'], tc: '#043C34', mtc: '#fff',
    m: [ { n: 'STARTLED', o: ['SHOCKED', 'DISMAYED'] }, { n: 'CONFUSED', o: ['DISILLUSIONED', 'PERPLEXED'] }, { n: 'AMAZED', o: ['ASTONISHED', 'AWE'] }, { n: 'EXCITED', o: ['EAGER', 'ENERGETIC'] } ]
  },
  { n: 'FEAR', a0: 180, a1: 240, c: ['#185A24', '#348444', '#78B080'], tc: '#082E10', mtc: '#fff',
    m: [ { n: 'SCARED', o: ['TERRIFIED', 'FRIGHTENED'] }, { n: 'ANXIOUS', o: ['OVERWHELMED', 'WORRIED'] }, { n: 'INSECURE', o: ['INADEQUATE', 'INFERIOR'] }, { n: 'SUBMISSIVE', o: ['WORTHLESS', 'INSIGNIFICANT'] }, { n: 'REJECTED', o: ['ALIENATED', 'DISRESPECTED'] }, { n: 'HUMILIATED', o: ['RIDICULED', 'EMBARRASSED'] }, { n: 'THREATENED', o: ['DEVASTATED', 'HELPLESS'] } ]
  },
];

const CX = 255, CY = 255, R1 = 72, R2 = 182, R3 = 252;
const rad = (d) => (d * Math.PI) / 180;

function arcPath(r1, r2, a0, a1) {
  const s = rad(a0), e = rad(a1), lg = a1 - a0 > 180 ? 1 : 0;
  const p = (rr, a) => [CX + rr * Math.cos(a), CY + rr * Math.sin(a)];
  const [x1, y1] = p(r1, s), [x2, y2] = p(r2, s);
  const [x3, y3] = p(r2, e), [x4, y4] = p(r1, e);
  const f = (n) => n.toFixed(2);
  if (r1 < 1) return `M${CX},${CY}L${f(x2)},${f(y2)}A${r2},${r2},0,${lg},1,${f(x3)},${f(y3)}Z`;
  return `M${f(x1)},${f(y1)}L${f(x2)},${f(y2)}A${r2},${r2},0,${lg},1,${f(x3)},${f(y3)}L${f(x4)},${f(y4)}A${r1},${r1},0,${lg},0,${f(x1)},${f(y1)}Z`;
}

function textProps(r, midAngle, fontSize, fill, fw) {
  const a = rad(midAngle);
  const x = CX + r * Math.cos(a);
  const y = CY + r * Math.sin(a);
  let rot = ((midAngle % 360) + 360) % 360;
  if (rot > 90 && rot < 270) rot -= 180;
  return { x: x.toFixed(2), y: y.toFixed(2), fontSize, fill, fontWeight: fw, rot: rot.toFixed(1) };
}

function EmotionRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);

  const ITEM_HEIGHT = 80; 

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultMsg(null);

    const finalBlockStart = (SPIN_MULTIPLIER - 1) * ROULETTE_DATA.length;
    const goodIndices = [];
    for (let i = finalBlockStart; i < TRACK_ITEMS.length; i++) {
      if (TRACK_ITEMS[i].isGood) goodIndices.push(i);
    }

    const targetIndex = goodIndices[Math.floor(Math.random() * goodIndices.length)];
    const targetOffset = -(targetIndex * ITEM_HEIGHT);

    setOffset(0);
    if(trackRef.current) trackRef.current.style.transition = 'none';

    setTimeout(() => {
      if(trackRef.current) trackRef.current.style.transition = 'transform 3.5s cubic-bezier(0.15, 0.85, 0.25, 1)';
      setOffset(targetOffset);
      
      setTimeout(() => {
        setIsSpinning(false);
        setResultMsg(TRACK_ITEMS[targetIndex].msg);
      }, 3600);
    }, 50);
  };

  return (
    <div className="roulette-card">
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)', marginBottom: '8px' }}>The Emotion Spinner</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>Take a chance. See where you land.</p>
      
      <div className="roulette-window">
        <div className="roulette-track" ref={trackRef} style={{ transform: `translateY(${offset}px)` }}>
          {TRACK_ITEMS.map((item, i) => (
            <div key={i} className={`roulette-item ${item.isGood ? 'good' : 'bad'}`}>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <button className="mh-btn mh-btn-primary" onClick={spin} disabled={isSpinning} style={{ padding: '14px 40px', fontSize: '16px' }}>
        {isSpinning ? 'Spinning...' : 'Spin the Wheel 🎯'}
      </button>

      {resultMsg && (
        <div className="roulette-msg">
          ✨ {resultMsg}
        </div>
      )}
    </div>
  );
}

function Wheel({ selection, onSelect }) {
  const svgRef = useRef(null);
  const ttRef  = useRef(null);

  const segments  = [];
  const labels    = [];

  SECTORS.forEach((sec, si) => {
    const mc = sec.m.length;
    const ms = (sec.a1 - sec.a0) / mc;
    const os = ms / 2;
    const cMid = (sec.a0 + sec.a1) / 2;

    const isDimC = selection && !(selection.si === si);
    segments.push(
      <path key={`c-${si}`} d={arcPath(0, R1, sec.a0, sec.a1)}
        fill={sec.c[0]} stroke="white" strokeWidth="2"
        style={{ opacity: isDimC ? 0.12 : 1, cursor: 'pointer', transition: 'opacity .18s,filter .15s' }}
        onClick={() => onSelect({ si, type: 'c' })}
      />
    );
    const tp = textProps(R1 * 0.54, cMid, '11.5', 'white', '700');
    labels.push(
      <text key={`ct-${si}`} x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
        fontSize={tp.fontSize} fontWeight={tp.fontWeight} fill={tp.fill}
        fontFamily="system-ui,-apple-system,sans-serif" pointerEvents="none"
        transform={`rotate(${tp.rot},${tp.x},${tp.y})`}>{sec.n}</text>
    );

    sec.m.forEach((m, mi) => {
      const mS = sec.a0 + mi * ms, mE = mS + ms, mMid = (mS + mE) / 2;
      const isDimM = selection && !(selection.si === si && (selection.type === 'c' || selection.mi === mi));
      segments.push(
        <path key={`m-${si}-${mi}`} d={arcPath(R1, R2, mS, mE)}
          fill={sec.c[1]} stroke="white" strokeWidth="1"
          style={{ opacity: isDimM ? 0.1 : 1, cursor: 'pointer', transition: 'opacity .18s,filter .15s' }}
          onClick={() => onSelect({ si, type: 'm', mi })}
        />
      );
      const tp2 = textProps((R1 + R2) / 2, mMid, '7.5', sec.mtc, '600');
      labels.push(
        <text key={`mt-${si}-${mi}`} x={tp2.x} y={tp2.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={tp2.fontSize} fontWeight={tp2.fontWeight} fill={tp2.fill}
          fontFamily="system-ui,-apple-system,sans-serif" pointerEvents="none"
          transform={`rotate(${tp2.rot},${tp2.x},${tp2.y})`}>{m.n}</text>
      );

      m.o.forEach((o, oi) => {
        const oS = mS + oi * os, oE = oS + os, oMid = (oS + oE) / 2;
        const isDimO = selection && !(selection.si === si && selection.type === 'c'
          || selection.si === si && selection.mi === mi && (selection.type === 'm' || selection.oi === oi));
        segments.push(
          <path key={`o-${si}-${mi}-${oi}`} d={arcPath(R2, R3, oS, oE)}
            fill={sec.c[2]} stroke="white" strokeWidth="0.75"
            style={{ opacity: isDimO ? 0.1 : 1, cursor: 'pointer', transition: 'opacity .18s' }}
            onClick={() => onSelect({ si, type: 'o', mi, oi })}
          />
        );
        const tp3 = textProps((R2 + R3) / 2, oMid, '6.2', sec.tc, '500');
        labels.push(
          <text key={`ot-${si}-${mi}-${oi}`} x={tp3.x} y={tp3.y} textAnchor="middle" dominantBaseline="middle"
            fontSize={tp3.fontSize} fontWeight={tp3.fontWeight} fill={tp3.fill}
            fontFamily="system-ui,-apple-system,sans-serif" pointerEvents="none"
            transform={`rotate(${tp3.rot},${tp3.x},${tp3.y})`}>{o}</text>
        );
      });
    });
  });

  const handleMouseMove = (e) => {
    if (!ttRef.current) return;
    const t = e.target.closest('[data-tip]');
    if (!t) { ttRef.current.style.display = 'none'; return; }
    const b = svgRef.current.parentElement.getBoundingClientRect();
    const lx = e.clientX - b.left, ly = e.clientY - b.top;
    ttRef.current.style.display = 'block';
    ttRef.current.style.left = (lx < b.width - 140 ? lx + 14 : lx - 120) + 'px';
    ttRef.current.style.top  = Math.max(0, ly - 36) + 'px';
    ttRef.current.textContent = t.dataset.tip;
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <svg ref={svgRef} viewBox="0 0 510 510"
        style={{ width: 'min(510px,100%)', height: 'auto', display: 'block', cursor: 'pointer' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { if (ttRef.current) ttRef.current.style.display = 'none'; }}
        onClick={(e) => { if (!e.target.closest('path')) onSelect(null); }}
      >
        {segments}
        {labels}
        <circle cx="255" cy="255" r="8" fill="white" pointerEvents="none" />
      </svg>
      <div ref={ttRef} style={{
        position: 'absolute', display: 'none', pointerEvents: 'none',
        background: 'rgba(10,10,10,.82)', color: '#fff', padding: '5px 10px',
        borderRadius: '6px', fontSize: '12px', fontWeight: '600',
        whiteSpace: 'nowrap', zIndex: 10, fontFamily: 'system-ui,-apple-system,sans-serif',
      }} />
    </div>
  );
}

function InfoPanel({ selection, onSelect, onCalmClick }) {
  if (!selection) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 8px', color: 'var(--muted,#7A8A7D)', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
        <div style={{ fontSize: '36px', marginBottom: '14px' }}>🌀</div>
        <div style={{ fontSize: '17px', fontWeight: '600', color: 'var(--ink,#1E2820)', marginBottom: '10px' }}>Wheel of Emotions</div>
        <div style={{ fontSize: '14px', lineHeight: '1.7', maxWidth: '220px', margin: '0 auto' }}>
          Click any segment to identify and explore what you are feeling
        </div>
        <div style={{ fontSize: '12px', marginTop: '16px', color: 'var(--muted,#7A8A7D)', lineHeight: '1.6', maxWidth: '220px', margin: '16px auto 0' }}>
          Start at the centre with a core emotion, then move outward to find more specific words
        </div>
      </div>
    );
  }

  const { si, type, mi, oi } = selection;
  const sec  = SECTORS[si];
  const font = "'Plus Jakarta Sans',system-ui,sans-serif";

  const getName = () => {
    if (type === 'c') return sec.n;
    if (type === 'm') return sec.m[mi].n;
    return sec.m[mi].o[oi];
  };

  const Chip = ({ label, color, text, onClick }) => (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      background: color, color: text, border: 'none', cursor: 'pointer',
      fontFamily: font, transition: 'filter .12s', lineHeight: '1.4',
    }}
      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(.88)'}
      onMouseLeave={e => e.currentTarget.style.filter = 'none'}
    >{label}</button>
  );

  const Bc = ({ label, color, onClick }) => (
    <span onClick={onClick} style={{ color, fontWeight: '600', cursor: 'pointer', transition: 'opacity .12s' }}
      onMouseEnter={e => e.currentTarget.style.opacity = '.6'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >{label}</span>
  );

  const Sep = () => <span style={{ opacity: .4, margin: '0 5px' }}>›</span>;

  const renderBreadcrumb = () => {
    if (type === 'c') return <Bc label={sec.n} color={sec.c[0]} onClick={() => onSelect({ si, type: 'c' })} />;
    if (type === 'm') return <><Bc label={sec.n} color={sec.c[0]} onClick={() => onSelect({ si, type: 'c' })} /><Sep /><span style={{ fontWeight: '600', color: 'var(--ink,#1E2820)' }}>{sec.m[mi].n}</span></>;
    return <><Bc label={sec.n} color={sec.c[0]} onClick={() => onSelect({ si, type: 'c' })} /><Sep />
      <Bc label={sec.m[mi].n} color='var(--ink-soft,#3D4A40)' onClick={() => onSelect({ si, type: 'm', mi })} />
      <Sep /><span style={{ fontWeight: '600', color: 'var(--ink,#1E2820)' }}>{sec.m[mi].o[oi]}</span></>;
  };

  const renderRelated = () => {
    if (type === 'c') return (
      <>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted,#7A8A7D)', marginBottom: '8px', fontWeight: '700' }}>Includes</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {sec.m.map((m, i) => (
            <Chip key={i} label={m.n} color={sec.c[1] + '28'} text={sec.c[0]} onClick={() => onSelect({ si, type: 'm', mi: i })} />
          ))}
        </div>
      </>
    );
    if (type === 'm') return (
      <>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted,#7A8A7D)', marginBottom: '8px', fontWeight: '700' }}>More specific</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {sec.m[mi].o.map((o, i) => (
            <Chip key={i} label={o} color={sec.c[2]} text={sec.tc} onClick={() => onSelect({ si, type: 'o', mi, oi: i })} />
          ))}
        </div>
      </>
    );
    const siblings = sec.m[mi].o.filter((_, i) => i !== oi);
    if (!siblings.length) return null;
    return (
      <>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted,#7A8A7D)', marginBottom: '8px', fontWeight: '700' }}>Also in this family</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {siblings.map((o, i) => (
            <Chip key={i} label={o} color={sec.c[2]} text={sec.tc} onClick={() => {
              const newOi = sec.m[mi].o.indexOf(o);
              onSelect({ si, type: 'o', mi, oi: newOi });
            }} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div style={{
      background: 'var(--warm-white,#FDFCFA)',
      border: `1.5px solid var(--border,rgba(74,124,89,0.15))`,
      borderLeft: `5px solid ${sec.c[0]}`,
      borderRadius: '16px',
      padding: '22px 20px',
      fontFamily: font,
    }}>
      <div style={{ fontSize: '11px', lineHeight: '2', marginBottom: '10px' }}>
        {renderBreadcrumb()}
      </div>
      <div style={{ fontSize: '30px', fontWeight: '700', color: 'var(--ink,#1E2820)', marginBottom: '18px', letterSpacing: '-0.5px', fontFamily: "'Fraunces',serif" }}>
        {getName()}
      </div>
      {renderRelated()}

      {type === 'o' && onCalmClick && (
        <button onClick={onCalmClick} style={{
          width: '100%', marginTop: '24px', padding: '14px',
          borderRadius: '8px', border: 'none',
          background: 'var(--lavender, #7C6FA0)', color: 'white',
          cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: font,
          transition: 'background .15s',
        }}>
          Help me calm this feeling →
        </button>
      )}

      <button onClick={() => onSelect(null)} style={{
        width: '100%', marginTop: type === 'o' ? '8px' : '16px', padding: '9px',
        borderRadius: '8px', border: '1px solid var(--border,rgba(74,124,89,0.15))',
        background: 'transparent', color: 'var(--muted,#7A8A7D)',
        cursor: 'pointer', fontSize: '12px', fontFamily: font,
        transition: 'background .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--sand,#F7F3ED)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >← View full wheel</button>
    </div>
  );
}

function InteractiveEmotionWheel({ onCalmClick, onLogTool }) {
  const [selection, setSelection] = useState(null);
  const [feedbackView, setFeedbackView] = useState(false);

  const handleSelect = (s) => {
    setSelection(s);
    if(s && s.type === 'o') {
       onLogTool('Emotion Wheel: ' + SECTORS[s.si].m[s.mi].o[s.oi]);
    }
  };

  const handleCalmTrigger = () => {
    onCalmClick();
    setFeedbackView(true);
  };

  if (feedbackView) {
    return (
      <div className="ew-container" style={{ textAlign: 'center', padding: '24px 0' }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)', marginBottom: '16px' }}>How do you feel now?</h3>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '32px' }}>Checking in after that breathing exercise...</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="mh-btn mh-btn-outline" onClick={() => {setFeedbackView(false); setSelection(null);}}>🙂 Better</button>
          <button className="mh-btn mh-btn-outline" onClick={() => {setFeedbackView(false); setSelection(null);}}>😐 Same</button>
          <button className="mh-btn mh-btn-outline" onClick={() => {setFeedbackView(false); setSelection(null);}}>😞 Worse</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start', padding: '8px 0', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <Wheel selection={selection} onSelect={handleSelect} />
      <div style={{ flex: 1, minWidth: '280px' }}>
        <InfoPanel selection={selection} onSelect={handleSelect} onCalmClick={handleCalmTrigger} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MindSpace({ navigate, onBack }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isQuickCalmActive, setQuickCalmActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale (4s)");
  
  const streakMessages = [
    "Day 1: You showed up. That matters.",
    "Day 2: You're building a habit of care.",
    "Day 3: You're taking control of your state."
  ];
  const [streakDay] = useState(Math.floor(Math.random() * 3));
  const [lastUsedTool, setLastUsedTool] = useState(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    
    const saved = localStorage.getItem('mh-last-used');
    if (saved) setLastUsedTool(saved);

    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    let interval;
    if(isQuickCalmActive) {
      const cycle = () => {
        setBreathingPhase("Inhale (4s)");
        setTimeout(() => setBreathingPhase("Hold (7s)"), 4000);
        setTimeout(() => setBreathingPhase("Exhale (8s)"), 11000);
      };
      cycle();
      interval = setInterval(cycle, 19000);
    }
    return () => clearInterval(interval);
  }, [isQuickCalmActive]);

  const logTool = (toolName) => {
    localStorage.setItem('mh-last-used', toolName);
    setLastUsedTool(toolName);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  const openModal = (id, toolName) => {
    if(toolName) logTool(toolName);
    setActiveModal(id);
    triggerToast("You're doing the right thing. Take this one step at a time.");
  };
  
  const closeModal = () => setActiveModal(null);

  const startQuickCalm = () => {
    closeModal();
    setQuickCalmActive(true);
    logTool('Quick Calm Breathing');
    window.scrollBy({ top: 300, behavior: 'smooth' });
  };

  const RESOURCES = [
    {
      id: "crisis",
      title: "National Crisis Directory",
      cls: "crisis",
      icon: "🆘",
      badges: ["Emergency", "24/7 Support"],
      timeBadge: "⏱ Immediate",
      desc: "A permanently updated, accessible list of verified Indian helplines for severe distress. If things feel too heavy, reach out immediately.",
      action1: { text: "View Helplines", isDanger: true, onClick: () => openModal('crisis', 'Crisis Helplines') },
      isUrgent: true
    },
    {
      id: "grounding",
      title: "I feel anxious and overwhelmed",
      cls: "toolkit",
      icon: "🧘🏽",
      badges: ["Printable 1-Pager"],
      timeBadge: "⏱ 2 min relief",
      desc: "A beautifully designed, printable guide featuring the 5-4-3-2-1 technique, Box Breathing, and the 4-7-8 method. Perfect for sticking above a study desk.",
      action1: { text: "Download Toolkit", link: "/resources/mh/Grounding_Toolkit.pdf" },
    },
    {
      id: "emotion-wheel",
      title: "I don't understand what I'm feeling",
      cls: "wheel",
      icon: "🎯",
      badges: ["Interactive Tool"],
      timeBadge: "⏱ 5 min relief",
      desc: "Expand your emotional vocabulary. Stop saying 'I feel bad' and figure out if you're actually feeling overwhelmed, insecure, burnt out, or disconnected.",
      action1: { text: "Start Interactive Wheel", onClick: () => openModal('wheel', 'Emotion Wheel') },
      action2: { text: "Download PDF", link: "/resources/mh/Emotion_Wheel.pdf" },
    },
    {
      id: "control",
      title: "I feel out of control",
      cls: "control",
      icon: "⭕",
      badges: ["Worksheet"],
      timeBadge: "⏱ 10 min relief",
      desc: "A tactical worksheet to map out your anxieties and physically let go of things you cannot change (like exam difficulty or other people's opinions).",
      action1: { text: "Download Worksheet", link: "/resources/mh/Control_Worksheet.pdf" },
    },
    {
      id: "exam-survival",
      title: "I'm panicking about my exams",
      cls: "anxiety",
      icon: "⚡",
      badges: ["3-Page Guide"],
      timeBadge: "⏱ 3 min relief",
      desc: "How to handle a panic attack during a test, how to actually sleep the night before, and how to separate your self-worth from your marks.",
      action1: { text: "Read Survival Guide", onClick: () => openModal('exam', 'Exam Survival Guide') },
      action2: { text: "Download PDF", link: "/resources/mh/Exam_Survival.pdf" },
    }
  ];

  return (
    <>
      <div className="mh-page">
        <div className="mh-streak-banner">
          {streakMessages[streakDay]}
        </div>

        <div className="mh-topbar">
          <button className="mh-back" onClick={onBack || (() => navigate && navigate("/dashboard"))}>← Back to Dashboard</button>
          <div className="mh-topbar-title">Mind Space</div>
          <div />
        </div>

        <section className="mh-hero">
          <div className="mh-hero-inner">
            
            {lastUsedTool && (
              <div className="mh-memory-badge" onClick={() => triggerToast(`Resuming ${lastUsedTool}...`)}>
                <span>↺</span> Welcome back. Continue with {lastUsedTool}?
              </div>
            )}

            <div className="mh-eyebrow">Emotional First Aid</div>
            <h1 className="mh-h1">Feeling overwhelmed right now?<br/><em>Let’s slow it down together.</em></h1>
            <p className="mh-sub">You don't need to fix everything. Just focus on getting through the next few minutes.</p>
          </div>
        </section>

        <div className="mh-start-container">
          <div className="mh-start-box">
            <h3>Not sure where to start?</h3>
            <p>If you're overwhelmed right now, choose a path below.</p>
            <div className="mh-start-actions">
              <button className="mh-btn mh-btn-primary" onClick={startQuickCalm}>⚡ Calm me now (30 sec)</button>
              <button className="mh-btn mh-btn-outline" onClick={() => openModal('wheel', 'Emotion Wheel')}>🧠 Help me understand what I feel</button>
            </div>
          </div>
        </div>

        <div className={`quick-calm-inline ${isQuickCalmActive ? 'active' : ''}`}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)' }}>4-7-8 Breathing</h3>
          <p style={{ color: 'var(--ink-soft)' }}>Follow the expanding circle.</p>
          <div className={`breathing-circle ${isQuickCalmActive ? 'animating' : ''}`}>
            {breathingPhase}
          </div>
          <button className="mh-btn mh-btn-outline" onClick={() => setQuickCalmActive(false)}>Close Breathing</button>
        </div>

        <div className="mh-validation">
          Thousands of students feel like this every day.
          <strong>You're someone who is trying.</strong>
          And that matters more than you think.
          <div className="mh-human-touch">
            <span>💚</span> Built with counsellors who understand what this feels like.
          </div>
        </div>

        <EmotionRoulette />

        <section className="mh-container">
          {RESOURCES.map((res) => (
            <div key={res.id} className={`mh-card ${res.cls}`}>
              {res.isUrgent && <span className="mh-crisis-label">⚠️ Need Immediate Help?</span>}
              <div className="mh-icon">{res.icon}</div>
              <h3 className="mh-title">{res.title}</h3>
              
              <div className="mh-meta">
                <span className="mh-badge time">{res.timeBadge}</span>
                {res.badges.map(b => <span key={b} className="mh-badge">{b}</span>)}
              </div>
              
              <p className="mh-desc">{res.desc}</p>
              
              <div className="mh-actions">
                {res.action1.link ? (
                  <a href={res.action1.link} download className={`mh-btn ${res.action1.isDanger ? 'mh-btn-danger' : 'mh-btn-primary'}`} target="_blank" rel="noreferrer" onClick={() => { triggerToast("You're doing the right thing."); logTool(res.title); }}>
                    {res.action1.text}
                  </a>
                ) : (
                  <button onClick={res.action1.onClick} className={`mh-btn ${res.action1.isDanger ? 'mh-btn-danger' : 'mh-btn-primary'}`}>
                    {res.action1.text}
                  </button>
                )}

                {res.action2 && (
                  <a href={res.action2.link} download className="mh-btn mh-btn-outline" target="_blank" rel="noreferrer">
                    {res.action2.text}
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>

        <div className="mh-return-hook">
          <h3>Want to go deeper?</h3>
          <div className="mh-hook-links">
             <button className="mh-hook-link" onClick={() => navigate && navigate('/wall')}>→ Share anonymously</button>
             <button className="mh-hook-link" onClick={() => navigate && navigate('/dashboard')}>→ Track your emotions</button>
             <button className="mh-hook-link" onClick={() => navigate && navigate('/vidyavantage')}>→ Discover your career path</button>
          </div>
        </div>

        <div className="mh-exit-safety">
          Before you go: Take one deep breath with me. <br/>You are going to be okay.
        </div>
      </div>

      <div className="sticky-mobile-cta">
        <button className="mh-btn mh-btn-primary" onClick={startQuickCalm}>
          Need help right now? → Calm me
        </button>
      </div>

      <div className={`mh-toast ${toastMessage ? 'visible' : ''}`}>
        <span>💚</span> {toastMessage}
      </div>

      {/* MODALS */}
      {activeModal === 'crisis' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()}>
            <div className="mh-modal-header" style={{ borderBottomColor: 'rgba(192,57,43,0.2)' }}>
              <div>
                <h3 className="mh-modal-title" style={{ color: '#C0392B' }}>National Crisis Directory</h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--muted)' }}>Free, verified, and confidential helplines in India.</p>
              </div>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body">
              <div className="crisis-list">
                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>Kiran Helpline (Govt. of India)</h4>
                    <p>24/7 National Mental Health Rehabilitation Helpline.</p>
                  </div>
                  <a href="tel:18005990019" className="crisis-call-btn">📞 1800-599-0019</a>
                </div>
                
                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>iCall (by TISS)</h4>
                    <p>Psychosocial support. Monday—Saturday, 8:00 AM to 10:00 PM.</p>
                  </div>
                  <a href="tel:9152987821" className="crisis-call-btn">📞 9152987821</a>
                </div>

                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>Vandrevala Foundation</h4>
                    <p>24/7 free psychological counselling for anyone in distress.</p>
                  </div>
                  <a href="tel:9999666555" className="crisis-call-btn">📞 9999-666-555</a>
                </div>

                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>Snehi</h4>
                    <p>24/7 suicide prevention and emotional support.</p>
                  </div>
                  <a href="tel:04424640050" className="crisis-call-btn">📞 044-24640050</a>
                </div>
              </div>
              
              <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Reaching out is the bravest thing you can do. You don't have to carry the weight alone. These professionals are trained to listen without judgment.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'exam' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()}>
            <div className="mh-modal-header">
              <h3 className="mh-modal-title">Exam Anxiety Survival Guide</h3>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '15px' }}>
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>1. The Night Before: The "Brain Dump"</h4>
              <p style={{ marginBottom: '24px' }}>Stop studying 60 minutes before bed. Take a blank piece of paper and write down every single formula, fear, and worry in your head. Getting it out of your brain and onto paper reduces cognitive load so you can actually sleep.</p>
              
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>2. During the Exam: The 30-Second Reset</h4>
              <p style={{ marginBottom: '24px' }}>If you look at the paper and freeze, flip it over. Do not look at the questions. Do the 5-4-3-2-1 grounding technique. Look for 5 blue things in the room. Feel 4 textures. Take 3 deep breaths. You have the time. Regulate your nervous system first, then turn the paper back over.</p>

              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>3. The Truth About Self-Worth</h4>
              <p style={{ marginBottom: '24px' }}>An exam measures how well you retained specific information on a specific day. It does not measure your intelligence, your capability to succeed in life, or your worth as a human being. The result of this test is data, not an identity.</p>

              <div style={{ background: 'var(--sand)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Download the full 3-page PDF guide for more tactical strategies.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'wheel' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px' }}>
            <div className="mh-modal-header">
              <h3 className="mh-modal-title">The Emotion Wheel</h3>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body">
              <InteractiveEmotionWheel onCalmClick={startQuickCalm} onLogTool={logTool} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
