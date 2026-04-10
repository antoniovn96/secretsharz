import React, { useState, useEffect, useRef } from 'react';

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .mh-page { min-height: 100vh; background: var(--warm-white, #FDFCFA); font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 120px; position: relative; }
  
  /* ── TOPBAR & STREAK ── */
  .mh-topbar { background: var(--ink, #1E2820); color: white; height: 56px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 300; border-bottom: 3px solid var(--lavender, #7C6FA0); }
  .mh-back { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .mh-back:hover { color: white; }
  .mh-topbar-title { font-family: 'Fraunces', serif; font-size: 16px; color: white; }
  
  .mh-streak-banner { background: var(--lavender, #7C6FA0); color: white; text-align: center; padding: 10px 20px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; z-index: 290; }

  /* ── HERO & MEMORY ── */
  .mh-hero { background: linear-gradient(135deg, var(--ink, #1E2820) 0%, #2A2438 100%); padding: 80px 48px 100px; position: relative; overflow: hidden; text-align: center; color: white; }
  .mh-hero::before { content: ''; position: absolute; top: -50px; left: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(124,111,160,0.15), transparent 70%); border-radius: 50%; }
  .mh-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  
  .mh-memory-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; margin-bottom: 24px; cursor: pointer; transition: 0.2s; color: #B3A4D6; }
  .mh-memory-badge:hover { background: rgba(255,255,255,0.2); color: white; }

  .mh-eyebrow { display: inline-block; background: rgba(124,111,160,0.2); border: 1px solid rgba(124,111,160,0.4); color: #B3A4D6; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
  .mh-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 48px); font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
  .mh-h1 em { font-style: italic; color: #B3A4D6; }
  .mh-sub { font-size: 18px; color: rgba(255,255,255,0.8); line-height: 1.6; font-weight: 400; max-width: 600px; margin: 0 auto; }

  /* ── SPLIT START BOX ── */
  .mh-start-container { max-width: 700px; margin: -50px auto 40px; position: relative; z-index: 20; padding: 0 24px; }
  .mh-start-box { background: white; border-radius: 24px; padding: 32px; text-align: center; box-shadow: 0 16px 40px rgba(0,0,0,0.12); border: 3px solid var(--lavender, #7C6FA0); }
  .mh-start-box h3 { font-family: 'Fraunces', serif; font-size: 24px; margin: 0 0 8px; color: var(--ink); }
  .mh-start-box p { color: var(--ink-soft); margin: 0 0 24px; font-size: 15px; }
  .mh-start-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .mh-start-actions button { flex: 1; min-width: 250px; padding: 16px; font-size: 15px; }

  /* ── QUICK CALM INLINE ── */
  .quick-calm-inline { background: #EAF4FA; border: 1px solid rgba(41,128,185,0.2); border-radius: 24px; padding: 32px; max-width: 700px; margin: 0 auto 40px; text-align: center; display: none; }
  .quick-calm-inline.active { display: block; animation: fadeIn 0.4s ease; }
  .breathing-circle { width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #5B9EBF, #A89DD0); margin: 24px auto; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-family: 'Fraunces', serif; font-size: 24px; box-shadow: 0 8px 32px rgba(91,158,191,0.3); transition: all 0.5s ease; }
  
  @keyframes breatheCycle {
    0% { transform: scale(1); } /* Start */
    21% { transform: scale(1.5); } /* Inhale 4s (4/19 = 21%) */
    58% { transform: scale(1.5); } /* Hold 7s (11/19 = 58%) */
    100% { transform: scale(1); } /* Exhale 8s (19/19 = 100%) */
  }
  .breathing-circle.animating { animation: breatheCycle 19s infinite linear; }

  /* ── VALIDATION & HUMAN TOUCH ── */
  .mh-validation { text-align: center; max-width: 600px; margin: 0 auto 48px; padding: 0 24px; color: var(--ink-soft); font-size: 16px; line-height: 1.6; }
  .mh-validation strong { color: var(--ink); font-family: 'Fraunces', serif; font-size: 20px; display: block; margin: 8px 0; }
  .mh-human-touch { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: var(--muted); margin-top: 16px; font-weight: 600; }

  /* ── ROULETTE (SLOT MACHINE) ── */
  .roulette-card { background: white; border-radius: 20px; border: 2px dashed var(--lavender); padding: 32px; text-align: center; margin: 0 auto 48px; max-width: 700px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
  .roulette-window { height: 80px; overflow: hidden; position: relative; background: var(--sand); border-radius: 16px; margin: 24px auto; width: 80%; border: 1px solid var(--border); box-shadow: inset 0 4px 12px rgba(0,0,0,0.05); }
  .roulette-track { display: flex; flex-direction: column; transition: transform cubic-bezier(0.15, 0.85, 0.25, 1); }
  .roulette-item { height: 80px; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; }
  .roulette-item.bad { color: var(--ink-soft); opacity: 0.5; }
  .roulette-item.good { color: var(--lavender); }
  .roulette-msg { background: #F7F3ED; padding: 16px; border-radius: 12px; color: var(--ink); font-weight: 600; font-size: 15px; margin-top: 24px; animation: floatUp 0.4s ease; border-left: 4px solid var(--lavender); }

  /* ── GRID & CARDS ── */
  .mh-container { max-width: 1100px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 10; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
  
  .mh-card { background: white; border-radius: 20px; border: 1px solid var(--border, rgba(74,124,89,0.15)); box-shadow: 0 8px 24px rgba(0,0,0,0.04); padding: 32px; transition: all 0.3s; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .mh-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: var(--lavender, #7C6FA0); }
  .mh-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; }
  
  /* Danger/Crisis Overrides */
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

  /* ── RETURN HOOK & EXIT SAFETY ── */
  .mh-return-hook { max-width: 800px; margin: 80px auto 0; padding: 48px; border-top: 1px solid var(--border); text-align: center; }
  .mh-return-hook h3 { font-family: 'Fraunces', serif; font-size: 24px; color: var(--ink); margin-bottom: 24px; }
  .mh-hook-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
  .mh-hook-link { background: white; border: 1px solid var(--border); padding: 12px 24px; border-radius: 50px; color: var(--ink); font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; }
  .mh-hook-link:hover { border-color: var(--lavender); color: var(--lavender); transform: translateY(-2px); }
  
  .mh-exit-safety { text-align: center; padding: 40px 24px; color: var(--muted); font-size: 15px; }

  /* ── TOAST FEEDBACK ── */
  .mh-toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--ink); color: white; padding: 16px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; z-index: 2000; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 12px 24px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 12px; }
  .mh-toast.visible { transform: translateX(-50%) translateY(0); opacity: 1; }

  /* ── STICKY MOBILE CTA ── */
  .sticky-mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 16px 24px; box-shadow: 0 -4px 24px rgba(0,0,0,0.1); z-index: 1000; border-top: 1px solid var(--border); }
  .sticky-mobile-cta .mh-btn { width: 100%; padding: 16px; font-size: 16px; }

  /* ── MODALS & WHEEL RE-USED CSS ── */
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

  /* Crisis Items */
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

// ==========================================
// DATA: ROULETTE (30 EMOTIONS)
// ==========================================
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

// Build a long track to simulate spinning
const SPIN_MULTIPLIER = 4; 
const TRACK_ITEMS = Array(SPIN_MULTIPLIER).fill(ROULETTE_DATA).flat();

// ==========================================
// EMOTION WHEEL DATA (Standard)
// ==========================================
const EMOTION_DATA = {
  Anger: { color: '#E8845A', children: { Frustrated: ["Irritated", "Annoyed"], Mad: ["Furious", "Resentful"], Bitter: ["Indignant", "Violated"] } },
  Fear: { color: '#7C6FA0', children: { Anxious: ["Overwhelmed", "Stressed"], Insecure: ["Inferior", "Worthless"], Scared: ["Helpless", "Panicked"] } },
  Surprise: { color: '#5B9EBF', children: { Excited: ["Energetic", "Thrilled"], Amazed: ["Astonished", "Awe"], Confused: ["Perplexed", "Dismayed"] } },
  Happy: { color: '#E1B846', children: { Playful: ["Aroused", "Free"], Content: ["Joyful", "Peaceful"], Proud: ["Confident", "Respected"] } },
  Sad: { color: '#4A6984', children: { Lonely: ["Isolated", "Empty"], Vulnerable: ["Fragile", "Powerless"], Despair: ["Grief", "Hopeless"] } },
  Disgust: { color: '#4A7C59', children: { Disapproving: ["Judgmental", "Condemning"], Disappointed: ["Appalled", "Nauseated"], Awful: ["Detestable", "Repugnant"] } }
};

// ==========================================
// ROULETTE COMPONENT
// ==========================================
function EmotionRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);

  const ITEM_HEIGHT = 80; // matches CSS

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultMsg(null);

    // Find all 'good' emotions in the final block of our multiplied track
    const finalBlockStart = (SPIN_MULTIPLIER - 1) * ROULETTE_DATA.length;
    const goodIndices = [];
    for (let i = finalBlockStart; i < TRACK_ITEMS.length; i++) {
      if (TRACK_ITEMS[i].isGood) goodIndices.push(i);
    }

    // Pick a random good index
    const targetIndex = goodIndices[Math.floor(Math.random() * goodIndices.length)];
    const targetOffset = -(targetIndex * ITEM_HEIGHT);

    // Reset to top instantly before spinning (if spun previously)
    setOffset(0);
    if(trackRef.current) trackRef.current.style.transition = 'none';

    setTimeout(() => {
      // Start spin animation
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

// ==========================================
// INTERACTIVE EMOTION WHEEL COMPONENT
// ==========================================
function InteractiveEmotionWheel({ onCalmClick, onLogTool }) {
  const [core, setCore] = useState(null);
  const [middle, setMiddle] = useState(null);
  const [outer, setOuter] = useState(null);
  const [feedbackView, setFeedbackView] = useState(false);

  const resetAll = () => { setCore(null); setMiddle(null); setOuter(null); setFeedbackView(false); };
  const selectCore = (key) => { setCore(key); setMiddle(null); setOuter(null); onLogTool('Emotion Wheel: ' + key); };
  const selectMiddle = (key) => { setMiddle(key); setOuter(null); };

  const handleCalmTrigger = () => {
    onCalmClick();
    setFeedbackView(true);
  };

  // View: Feedback Loop (Triggered after calming)
  if (feedbackView) {
    return (
      <div className="ew-container" style={{ textAlign: 'center', padding: '24px 0' }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)', marginBottom: '16px' }}>How do you feel now?</h3>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '32px' }}>Checking in after that exercise...</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="mh-btn mh-btn-outline" onClick={resetAll}>🙂 Better</button>
          <button className="mh-btn mh-btn-outline" onClick={resetAll}>😐 Same</button>
          <button className="mh-btn mh-btn-outline" onClick={resetAll}>😞 Worse</button>
        </div>
      </div>
    );
  }

  if (!core) {
    return (
      <div className="ew-container">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '18px', color: 'var(--ink)' }}>Where are you starting from?</h4>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>Select a core feeling below to dig deeper.</p>
        </div>
        <div className="ew-core-grid">
          {Object.entries(EMOTION_DATA).map(([key, data]) => (
            <button key={key} className="ew-core-card" style={{ background: data.color }} onClick={() => selectCore(key)}>
              <div className="ew-core-title">{key}</div>
              <div className="ew-core-sub">{Object.keys(data.children).length} middle states</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const coreData = EMOTION_DATA[core];
  const middleKeys = Object.keys(coreData.children);

  return (
    <div className="ew-container">
      <div className="ew-nav">
        <button className="ew-back-btn" onClick={resetAll}>← View Full Wheel</button>
      </div>

      <div className="ew-breadcrumbs">
        <div className="ew-bc-item">
          <span className={`ew-bc-text ${!middle ? 'active' : ''}`} style={{ cursor: 'pointer', color: !middle ? coreData.color : 'inherit' }} onClick={() => { setMiddle(null); setOuter(null); }}>
            {core}
          </span>
        </div>
        {middle && (
          <div className="ew-bc-item">
            <span className="ew-bc-arrow">›</span>
            <span className={`ew-bc-text ${!outer ? 'active' : ''}`} style={{ cursor: 'pointer', color: !outer ? coreData.color : 'inherit' }} onClick={() => setOuter(null)}>
              {middle}
            </span>
          </div>
        )}
        {outer && (
          <div className="ew-bc-item">
            <span className="ew-bc-arrow">›</span>
            <span className="ew-bc-text active" style={{ color: coreData.color }}>{outer}</span>
          </div>
        )}
      </div>

      {!middle && (
        <div className="ew-selection-view">
          <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '16px' }}>What kind of {core}?</h4>
          <div className="ew-chip-grid">
            {middleKeys.map(mKey => (
              <button key={mKey} className="ew-chip" style={{ background: '#F7F3ED', color: 'var(--ink)' }} onClick={() => selectMiddle(mKey)}>{mKey}</button>
            ))}
          </div>
        </div>
      )}

      {middle && !outer && (
        <div className="ew-selection-view">
          <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '16px' }}>Let's get even more specific:</h4>
          <div className="ew-chip-grid">
            {coreData.children[middle].map(oKey => (
              <button key={oKey} className="ew-chip" style={{ background: 'white', color: coreData.color, borderColor: coreData.color }} onClick={() => setOuter(oKey)}>{oKey}</button>
            ))}
          </div>
        </div>
      )}

      {outer && (
        <div className="ew-result-box" style={{ borderColor: coreData.color }}>
          <div className="ew-result-title" style={{ color: coreData.color }}>You are feeling {outer}.</div>
          <p className="ew-result-desc">
            Naming your exact emotion immediately decreases its power in your amygdala. 
            It is completely valid to feel {outer.toLowerCase()} right now. 
            Take a deep breath and acknowledge it.
          </p>
          
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #EAE5DE' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>What to do next?</p>
            <button className="mh-btn mh-btn-primary" onClick={handleCalmTrigger} style={{ width: '100%', padding: '16px' }}>
              Help me calm this feeling →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function MentalHealthFirstAid({ navigate, onBack }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isQuickCalmActive, setQuickCalmActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale (4s)");
  
  // Fake Dynamic Systems
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
    
    // Simulate fetching memory from localStorage
    const saved = localStorage.getItem('mh-last-used');
    if (saved) setLastUsedTool(saved);

    return () => document.head.removeChild(s);
  }, []);

  // Breathing logic for inline calm
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
    setQuickCalmActive(true);
    logTool('Quick Calm Breathing');
    // Scroll a bit down to focus on it
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
        {/* Dynamic Streak Banner */}
        <div className="mh-streak-banner">
          {streakMessages[streakDay]}
        </div>

        <div className="mh-topbar">
          <button className="mh-back" onClick={onBack || (() => navigate && navigate("/resources"))}>← Back to Resources</button>
          <div className="mh-topbar-title">Secret Sharz</div>
          <div />
        </div>

        <section className="mh-hero">
          <div className="mh-hero-inner">
            
            {/* Last Used Memory */}
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

        {/* ── SPLIT START PATH ── */}
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

        {/* ── INLINE QUICK CALM (NO MODAL) ── */}
        <div className={`quick-calm-inline ${isQuickCalmActive ? 'active' : ''}`}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)' }}>4-7-8 Breathing</h3>
          <p style={{ color: 'var(--ink-soft)' }}>Follow the expanding circle.</p>
          <div className={`breathing-circle ${isQuickCalmActive ? 'animating' : ''}`}>
            {breathingPhase}
          </div>
          <button className="mh-btn mh-btn-outline" onClick={() => setQuickCalmActive(false)}>Close Breathing</button>
        </div>

        {/* ── VALIDATION & IDENTITY SHIFT ── */}
        <div className="mh-validation">
          Thousands of students feel like this every day.
          <strong>You're someone who is trying.</strong>
          And that matters more than you think.
          <div className="mh-human-touch">
            <span>💚</span> Built with counsellors who understand what this feels like.
          </div>
        </div>

        {/* ── NEW FEATURE: ROULETTE ── */}
        <EmotionRoulette />

        {/* ── RESOURCE GRID ── */}
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

        {/* ── RETURN HOOK ── */}
        <div className="mh-return-hook">
          <h3>Want to go deeper?</h3>
          <div className="mh-hook-links">
             <button className="mh-hook-link" onClick={() => triggerToast("Navigating to sharing portal...")}>→ Share anonymously</button>
             <button className="mh-hook-link" onClick={() => triggerToast("Navigating to emotion tracker...")}>→ Track your emotions</button>
             <button className="mh-hook-link" onClick={() => triggerToast("Navigating to career path...")}>→ Discover your career path</button>
          </div>
        </div>

        {/* ── EXIT SAFETY NET ── */}
        <div className="mh-exit-safety">
          Before you go: Take one deep breath with me. <br/>You are going to be okay.
        </div>
      </div>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="sticky-mobile-cta">
        <button className="mh-btn mh-btn-primary" onClick={startQuickCalm}>
          Need help right now? → Calm me
        </button>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      <div className={`mh-toast ${toastMessage ? 'visible' : ''}`}>
        <span>💚</span> {toastMessage}
      </div>

      {/* ── MODALS ── */}
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
                    <p>Psychosocial support. Mon—Sat, 8:00 AM to 10:00 PM.</p>
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

              <div style={{ background: 'var(--sand)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Download the full 3-page PDF guide for more tactical strategies.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'wheel' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()}>
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
