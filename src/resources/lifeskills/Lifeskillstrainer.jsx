/**
 * Life Skills Trainer — School Counsellor Activity Bank
 * src/resources/lifeskills/Lifeskillstrainer.jsx
 *
 * 60 classroom-ready activities for Grade 5–12 life skills sessions.
 * Upgraded to a Full Counsellor Productivity Tool.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── CSS ─────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --ls-amber:#C8860A; --ls-amber-pale:#FFF8E8; --ls-amber-mid:#FFEDBE;
  --ls-forest:#2D5240; --ls-sage:#4A7C59; --ls-sage-pale:#EBF4EE;
  --ls-cream:#FFFBF5; --ls-sand:#F7F3ED; --ls-ink:#1E2820;
  --ls-ink-soft:#3D4A40; --ls-muted:#7A8A7D; --ls-border:rgba(30,40,32,0.1);
  --ls-shadow-sm:0 4px 16px rgba(30,40,32,0.06);
  --ls-shadow-md:0 12px 40px rgba(30,40,32,0.12);
  --ls-r:20px;
}

* { box-sizing: border-box; }

.lst-page { min-height:100vh; background:var(--ls-cream); padding-bottom:100px; font-family:'Plus Jakarta Sans',sans-serif; }

/* Topbar & Hero remain similar but refined */
.lst-topbar { background:var(--ls-ink); color:white; height:56px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:300; border-bottom:3px solid var(--ls-amber); }
.lst-back { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.7); font-size:13px; font-weight:700; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; transition:color .2s; }
.lst-back:hover { color:white; }
.lst-topbar-title { font-family:'Fraunces',serif; font-size:16px; color:white; }

.lst-hero { background:linear-gradient(135deg,var(--ls-ink) 0%,#2C1F05 55%,#3D2D0A 100%); padding:64px 48px 56px; position:relative; overflow:hidden; }
.lst-hero-blob { position:absolute; pointer-events:none; border-radius:50%; }
.lst-hero-blob-1 { width:480px; height:480px; background:radial-gradient(circle,rgba(200,134,10,.14),transparent 70%); top:-160px; right:-80px; }
.lst-hero-inner { max-width:1200px; margin:0 auto; display:flex; gap:56px; align-items:flex-start; flex-wrap:wrap; position:relative; z-index:1; }
.lst-hero-h1 { font-family:'Fraunces',serif; font-size:clamp(30px,4.5vw,48px); font-weight:700; color:white; line-height:1.1; letter-spacing:-1px; margin-bottom:16px; }
.lst-hero-sub { font-size:16px; color:rgba(255,255,255,.65); line-height:1.75; max-width:550px; margin-bottom:28px; font-weight:300; }

/* ─── NEW SMART DISCOVERABILITY CONTROLS ─── */
.lst-toolbar { background:white; border-bottom:1px solid var(--ls-border); position:sticky; top:56px; z-index:200; box-shadow:var(--ls-shadow-sm); padding:16px 48px; display:flex; flex-direction:column; gap:16px; align-items:center; }
.lst-toolbar-inner { max-width:1200px; width:100%; margin:0 auto; display:flex; gap:20px; align-items:center; flex-wrap:wrap; }
.lst-search-wrap { flex:1; min-width:280px; position:relative; }
.lst-search-input { width:100%; padding:12px 20px 12px 44px; border-radius:50px; border:2px solid var(--ls-border); font-size:14px; font-family:inherit; transition:border-color .2s; outline:none; }
.lst-search-input:focus { border-color:var(--ls-amber); }
.lst-search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--ls-muted); font-size:16px; }
.lst-quick-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.lst-qf-btn { padding:8px 16px; border-radius:50px; background:var(--ls-sand); border:1px solid var(--ls-border); font-size:12px; font-weight:700; color:var(--ls-ink-soft); cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px; }
.lst-qf-btn:hover { background:var(--ls-amber-pale); border-color:var(--ls-amber); color:var(--ls-amber); }
.lst-qf-btn.active { background:var(--ls-amber); border-color:var(--ls-amber); color:white; }

/* ─── NEW CARD UI ─── */
.lst-grid { max-width:1200px; margin:32px auto 0; padding:0 48px 60px; display:flex; flex-direction:column; gap:24px; }
.lst-card { background:white; border-radius:var(--ls-r); border:1px solid var(--ls-border); box-shadow:var(--ls-shadow-sm); overflow:hidden; transition:all .3s cubic-bezier(0.25, 0.8, 0.25, 1); position:relative; }
.lst-card:hover { box-shadow:var(--ls-shadow-md); transform:translateY(-4px); }
.lst-card.expanded { border-color:var(--ls-amber); box-shadow:var(--ls-shadow-md); transform:translateY(0); }
.lst-card-accent { height:6px; width:100%; }

.lst-card-header { padding:24px 32px; display:flex; align-items:flex-start; gap:20px; cursor:pointer; user-select:none; }
.lst-card-num { width:48px; height:48px; border-radius:14px; background:var(--ls-sand); display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--ls-amber); flex-shrink:0; border:1px solid var(--ls-border); }
.lst-card-meta-block { flex:1; }
.lst-card-title { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--ls-ink); margin-bottom:8px; line-height:1.2; display:flex; align-items:center; gap:12px; }

/* New Bookmarking / Favorite System */
.lst-bookmark-btn { background:none; border:none; font-size:22px; cursor:pointer; color:var(--ls-border); transition:color .2s; margin-top:-4px; }
.lst-bookmark-btn.saved { color:#E74C3C; }
.lst-bookmark-btn:hover { transform:scale(1.1); }

/* New Analytics Badges */
.lst-analytics-row { display:flex; gap:16px; align-items:center; margin-bottom:12px; font-size:12px; color:var(--ls-muted); font-weight:600; }
.lst-stat-item { display:flex; align-items:center; gap:4px; }
.lst-stat-star { color:#F1C40F; }

.lst-card-badges { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
.lst-badge { padding:5px 12px; border-radius:50px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
.lst-badge-theme { background:var(--ls-amber-pale); color:var(--ls-amber); }
.lst-badge-energy { background:#FDF0EA; color:#E8845A; border:1px solid rgba(232,132,90,0.3); }
.lst-badge-complex { background:#EBF5FB; color:#2980B9; border:1px solid rgba(41,128,185,0.3); }
.lst-card-obj { font-size:14px; color:var(--ls-ink-soft); line-height:1.6; max-width:800px; }

.lst-card-body { border-top:1px solid var(--ls-border); padding:32px; animation:lstFadeIn .3s ease; background:var(--ls-cream); }

/* Grid Layout for Expanded Card */
.lst-expanded-grid { display:grid; grid-template-columns:2fr 1fr; gap:32px; }

/* Right Sidebar in Card (Context & Tools) */
.lst-sidebar-box { background:white; border:1px solid var(--ls-border); border-radius:16px; padding:20px; margin-bottom:16px; }
.lst-sb-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); margin-bottom:12px; display:flex; align-items:center; gap:6px; }
.lst-sb-text { font-size:13px; color:var(--ls-ink-soft); line-height:1.6; }
.lst-outcome-list { padding-left:16px; margin:0; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; }
.lst-outcome-list li { margin-bottom:6px; }

.lst-protip { background:#FFFBEA; border-left:4px solid #F1C40F; padding:12px 16px; border-radius:0 8px 8px 0; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; margin-top:16px; }

/* Interactive Phase Steps */
.lst-phase { background:white; border:1px solid var(--ls-border); border-radius:12px; padding:20px; margin-bottom:16px; }
.lst-phase-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; border-bottom:1px solid var(--ls-border); padding-bottom:12px; }
.lst-phase-time { background:var(--ls-amber); color:white; padding:4px 12px; border-radius:50px; font-size:12px; font-weight:700; }
.lst-phase-name { font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:var(--ls-ink); }
.lst-step { display:flex; gap:12px; padding:12px 16px; border-radius:10px; margin-bottom:8px; font-size:14px; line-height:1.65; }
.lst-step.say { background:#EAF4FA; border-left:4px solid #5B9EBF; }
.lst-step.do  { background:var(--ls-sand); border-left:4px solid var(--ls-muted); }
.lst-step-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; width:50px; flex-shrink:0; margin-top:4px; }
.lst-step.say .lst-step-label  { color:#2980B9; }
.lst-step-text { flex:1; color:var(--ls-ink-soft); }
.lst-step.say .lst-step-text { font-weight:600; color:var(--ls-ink); }

/* Smart Suggestions */
.lst-suggestions { margin-top:32px; border-top:1px solid var(--ls-border); padding-top:24px; }
.lst-sugg-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; }
.lst-sugg-card { padding:16px; border:1px solid var(--ls-border); border-radius:12px; background:white; cursor:pointer; transition:border-color .2s; }
.lst-sugg-card:hover { border-color:var(--ls-amber); }
.lst-sugg-title { font-weight:700; font-size:14px; color:var(--ls-ink); }

/* Action Footer */
.lst-card-actions { display:flex; gap:12px; margin-top:24px; padding-top:24px; border-top:1px dashed var(--ls-border); }
.lst-action-btn { padding:12px 24px; border-radius:50px; font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .2s; display:flex; align-items:center; gap:8px; }
.lst-action-btn.primary { background:var(--ls-forest); color:white; }
.lst-action-btn.primary:hover { background:var(--ls-ink); }
.lst-action-btn.secondary { background:white; border:1px solid var(--ls-border); color:var(--ls-ink); }
.lst-action-btn.secondary:hover { border-color:var(--ls-amber); color:var(--ls-amber); }

/* Modals */
.lst-modal-overlay { position:fixed; inset:0; background:rgba(30,40,32,0.6); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; }
.lst-modal { background:white; width:100%; max-width:500px; border-radius:24px; padding:32px; box-shadow:var(--ls-shadow-md); animation:lstSlideUp .3s ease; }
@keyframes lstSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.lst-modal h2 { font-family:'Fraunces',serif; margin:0 0 8px; font-size:24px; }
.lst-modal p { color:var(--ls-muted); font-size:14px; margin-bottom:24px; }
.lst-rating-group { display:flex; gap:12px; margin-bottom:24px; }
.lst-rate-btn { flex:1; padding:12px; border:1px solid var(--ls-border); border-radius:12px; background:white; cursor:pointer; font-weight:700; color:var(--ls-muted); transition:all .2s; }
.lst-rate-btn:hover { border-color:var(--ls-amber); }
.lst-rate-btn.active { background:var(--ls-amber-pale); border-color:var(--ls-amber); color:var(--ls-amber); }
textarea.lst-input { width:100%; padding:16px; border:1px solid var(--ls-border); border-radius:12px; font-family:inherit; min-height:120px; margin-bottom:24px; resize:vertical; }
`;

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function Step({ s }) {
  const labels = { say: "Say", do: "Do", tip: "Tip", pause: "Pause" };
  return (
    <div className={`lst-step ${s.type}`}>
      <span className="lst-step-label">{labels[s.type] || "Step"}</span>
      <span className="lst-step-text">{s.text}</span>
    </div>
  );
}

function SessionLoggerModal({ activity, onClose, onSave }) {
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState('');

  return (
    <div className="lst-modal-overlay" onClick={onClose}>
      <div className="lst-modal" onClick={e => e.stopPropagation()}>
        <h2>Log Session: {activity.title}</h2>
        <p>Record how this activity landed with your students to improve future sessions.</p>
        
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Class Engagement Level</div>
        <div className="lst-rating-group">
          {['Low', 'Medium', 'High'].map(r => (
            <button key={r} className={`lst-rate-btn ${rating === r ? 'active' : ''}`} onClick={() => setRating(r)}>
              {r === 'Low' ? '📉' : r === 'Medium' ? '⚖️' : '🔥'} {r}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Counsellor Notes & Tweaks</div>
        <textarea 
          className="lst-input" 
          placeholder="e.g., The students struggled with the second prompt. Next time, I will provide an example first..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="lst-action-btn secondary" onClick={onClose}>Cancel</button>
          <button className="lst-action-btn primary" onClick={() => { onSave(activity.id, {rating, notes}); onClose(); }}>Save Log</button>
        </div>
      </div>
    </div>
  );
}

// ─── ACTIVITY DATA BATCH 1 (Lower Secondary: Grades 5-7) ──────────────────────
// Completely expanded with New Productivity Metadata
const ACTIVITIES = [
  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "l_sa_1", title: "The Feelings Iceberg", themeShort: ["Self-awareness", "Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual", "Pairs", "Full class"], color: "#7C6FA0", colorPale: "#F0EDF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.8, usedBy: 342,
    bestUsedWhen: "Students are exhibiting unexplained anger or classroom conflicts are rising over 'small' things.",
    studentOutcomes: ["Identify the physiological markers of primary emotions.", "Distinguish between reactive anger and vulnerable sadness.", "Articulate hidden feelings safely to a peer."],
    proTip: "If students write 'nothing' below the waterline, do not force them. Suggest they draw a question mark. It takes time to build the vocabulary.",
    objective: "Students will distinguish between surface emotions (what others see) and underlying feelings (what's really happening inside), mapping their own emotional landscape.", materials: ["Whiteboard & marker", "Iceberg worksheet", "Coloured pencils"],
    phases: [
      { time: "0–5 min", phase: "Hook", steps: [ { type: "say", text: "Think about the last time you got really angry. Picture it. What did the other person actually SEE? What did your anger look like from the outside?" }, { type: "do", text: "Take 3-4 answers. Write them on the board: went quiet, shouted, face went red, slammed door." }, { type: "say", text: "Interesting. Now here is my question: was anger the ONLY thing you were feeling? Or was something else going on underneath?" }, { type: "tip", text: "Keep this light and curious. Do not push for specific answers yet—just plant the question." } ] },
      { time: "5–12 min", phase: "Concept Introduction", steps: [ { type: "do", text: "Draw a simple iceberg on the board: a small tip above a wavy line, a large mass below. Label the tip 'What people SEE' and below the line 'What is REALLY happening.'" }, { type: "say", text: "An iceberg has a tiny visible tip and a massive hidden section. Our emotions work exactly the same way." }, { type: "say", text: "What might be hiding under anger? Build a word cloud below the waterline as students call out: fear, embarrassment, loneliness, feeling unheard." } ] },
      { time: "12–22 min", phase: "Individual Reflection", steps: [ { type: "do", text: "Distribute iceberg worksheets." }, { type: "say", text: "Think of one recent moment where you felt a strong emotion. Write what you SHOWED in the tip. Then go below the waterline and write what was ACTUALLY happening inside. Be honest—this is just for you." } ] },
      { time: "22–30 min", phase: "Pair Activity", steps: [ { type: "say", text: "Pair up. Share ONLY your above-waterline with your partner. Do not tell them what is below the line yet." }, { type: "say", text: "Your partner's job is to GUESS what might be below your waterline. Then tell them how close they were." }, { type: "do", text: "Give pairs 5 minutes. Each person shares once." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "say", text: "Let us come back together. I have a few questions for the whole group." } ] }
    ],
    debrief: [ { q: "Was it easy or difficult to look below your waterline? What made it difficult?", note: "Listen for: 'I didn't know what the feeling was'. Validate this." }, { q: "Has someone ever responded to just your tip and completely missed what was really going on?", note: "This is usually the question that creates the most resonance." } ],
    watchOutFor: [ "A student who discloses something serious during the writing. Have your referral process ready." ],
    variations: [ { tag: "Grade 5", text: "Use a provided emotion word bank rather than asking students to generate words." } ]
  },
  {
    id: "l_sa_2", title: "My Strengths Shield", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Art activity", "Pairs"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.6, usedBy: 289,
    bestUsedWhen: "Post-exams or during periods of low class morale and high self-criticism.",
    studentOutcomes: ["Differentiate between 'skills' (doing) and 'character strengths' (being).", "Accept a compliment from a peer gracefully.", "Identify one personal area for growth without shame."],
    proTip: "Play upbeat, lyric-free music during the drawing phase to reduce chatter and increase creative focus.",
    objective: "Students will identify their core character strengths and create a visual shield to build self-esteem.", materials: ["Blank shield templates", "Coloured markers", "List of strengths on board"],
    phases: [
      { time: "0–10 min", phase: "What is a Strength?", steps: [ { type: "say", text: "Character strengths are who you ARE, not just what you DO. For example, playing basketball well is a skill, but being a supportive teammate is a character strength." }, { type: "do", text: "Write examples on the board: Kindness, Bravery, Humor, Curiosity, Honesty, Perseverance. Ask students to shout out times they have seen these strengths in action." } ] },
      { time: "10–25 min", phase: "Designing the Shield", steps: [ { type: "do", text: "Hand out the blank shield templates. Explain that a shield represents what protects and empowers them." }, { type: "say", text: "In the four sections, you will draw or write: 1. Your greatest strength, 2. A strength others see in you, 3. A time you used a strength to help someone, 4. A strength you want to grow." } ] },
      { time: "25–35 min", phase: "Shield Sharing", steps: [ { type: "do", text: "Have students pair up. Give them 5 minutes to explain their shields to each other." }, { type: "say", text: "Partners, your job is to listen carefully and respond by saying: 'I can see that strength in you because...'" } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Bring the class back together and discuss how knowing our internal strengths acts as a protective shield during difficult days." } ] }
    ],
    debrief: [ { q: "Was it hard to choose a strength for yourself?", note: "Normalise focusing on weaknesses; humans are wired to notice negatives." }, { q: "How can you use your strength this week?", note: "Connect abstract strengths to practical school challenges." } ],
    watchOutFor: [ "Students who say they have no strengths. Offer gentle observations like, 'I noticed you helped Maya yesterday, that is a big strength.'" ],
    variations: [ { tag: "Art-focused", text: "Provide magazines and glue for a collage-style shield instead of drawing." } ]
  },
  {
    id: "l_sa_3", title: "The Mirror Game", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs", "Physical"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.9, usedBy: 412,
    bestUsedWhen: "Students are sluggish (e.g., first period or directly after lunch) and need a physical reset.",
    studentOutcomes: ["Recognize the brain-body connection.", "Sustain non-verbal focus for extended periods.", "Identify how posture dictates mood."],
    proTip: "If a pair is giggling uncontrollably, stand near them and model the seriousness of the exercise. Do not scold, just project calm focus.",
    objective: "Recognize how physical posture reflects and influences internal emotional states.", materials: ["Open floor space"],
    phases: [
      { time: "0–15 min", phase: "The Setup", steps: [ { type: "do", text: "Ask students to stand and face their partner. One is the leader, one is the mirror. The mirror must perfectly match the leader's physical movements in complete silence." }, { type: "say", text: "Move slowly and fluidly. Switch roles after 2 minutes so everyone gets a turn leading." } ] },
      { time: "15–25 min", phase: "Emotional Mirror", steps: [ { type: "say", text: "Now we take it a step further. Leaders, mirror an emotion without using any words. Let your partner guess the emotion based entirely on your posture and facial expression." }, { type: "do", text: "Call out emotions for them to act out: Sadness, Excitement, Nervousness, Pride." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "What did you notice about your own face and breathing when you were mirroring an angry posture? Did you actually start to feel a little tense?" } ] }
    ],
    debrief: [ { q: "How did your body feel mirroring a sad posture?", note: "Help them connect physical slumping to low emotional energy." }, { q: "Can changing your posture change your mood?", note: "Introduce the idea that standing tall can trick the brain into feeling confident." } ],
    watchOutFor: [ "Silly behavior. Remind them to be precise and take the mirroring seriously for it to work." ],
    variations: [ { tag: "Full class", text: "Have one leader mirror for the whole room to practice collective focus." } ]
  },
  {
    id: "l_sa_4", title: "The Values Auction", themeShort: ["Self-awareness", "Decision making"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Full class game"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.7, usedBy: 215,
    bestUsedWhen: "Starting a new term, to help students set intentions and understand their underlying motivations.",
    studentOutcomes: ["Prioritize abstract values under simulated pressure.", "Defend personal choices against peer influence.", "Recognize the difference between what they say they value and how they 'spend'."],
    proTip: "Act like a real, fast-talking auctioneer. The manufactured pressure forces them to make instinctual, honest choices.",
    objective: "Students will identify their personal values by deciding how to 'spend' limited resources in a simulated auction.", materials: ["List of 'Items' on board", "Fake money or token system"],
    phases: [
      { time: "0–10 min", phase: "The Bank", steps: [ { type: "say", text: "Everyone has $1000 in their bank. I am going to auction off some items. You can bid on anything, but once your money is gone, it is gone." }, { type: "do", text: "Write the items on the board: Perfect Grades, Best Athlete, A True Best Friend, Unlimited Money, World Peace, Video Game Champion." } ] },
      { time: "10–25 min", phase: "The Auction", steps: [ { type: "do", text: "Run the auction. Be a lively auctioneer. Track who wins what." } ] },
      { time: "25–35 min", phase: "The Reflection", steps: [ { type: "say", text: "Look at what you bought, or what you saved all your money trying to buy. That item represents what you value most right now." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how we spend our real time based on what we value." } ] }
    ],
    debrief: [ { q: "Did anyone spend all their money on one thing? Why?", note: "Highlights singular focus vs balanced values." }, { q: "Did you get caught up in bidding just to beat someone else?", note: "Great self-awareness moment about competitiveness." } ],
    watchOutFor: [ "Students getting too loud or competitive. Keep strict control of the bidding process." ],
    variations: [ { tag: "Grade 7", text: "Use more abstract values like 'Integrity', 'Adventure', or 'Security'." } ]
  },
  {
    id: "l_sa_5", title: "The 'I Am' Poem", themeShort: ["Self-awareness", "Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.5, usedBy: 180,
    bestUsedWhen: "Students are struggling with identity or self-worth, needing a quiet, introspective session.",
    studentOutcomes: ["Articulate complex internal realities using structured prompts.", "Build comfort with self-expression.", "Identify commonalities with peers."],
    proTip: "Share your own completed poem first. Your vulnerability gives them permission to be honest.",
    objective: "Use a structured poetic template to explore hidden traits, fears, and hopes without the pressure of a blank page.", materials: ["Poem templates", "Pens"],
    phases: [
      { time: "0–10 min", phase: "The Template", steps: [ { type: "say", text: "Sometimes it's hard to talk about ourselves. Today we let a template do the heavy lifting." }, { type: "do", text: "Write the structure on the board: I am... I wonder... I hear... I see... I want... I pretend... I feel... I cry... I dream..." } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "do", text: "Give them 15 minutes of absolute silence to fill in the blanks. Emphasize there are no wrong answers." } ] },
      { time: "25–35 min", phase: "Optional Sharing", steps: [ { type: "say", text: "If anyone wants to share just ONE line from their poem, they can." } ] }
    ],
    debrief: [ { q: "Which line was the easiest to write? Which was the hardest?", note: "Usually 'I pretend' or 'I cry' is the hardest." } ],
    watchOutFor: [ "Do not force anyone to read their poem. Collect them only if they give explicit permission." ],
    variations: [ { tag: "Anonymity", text: "Have them fold the papers, scramble them in a basket, and read them anonymously." } ]
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "l_em_1", title: "The Empathy Glasses", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.9, usedBy: 512,
    bestUsedWhen: "There is ongoing, petty conflict or cliques forming in the classroom.",
    studentOutcomes: ["Detach from personal perspective.", "Argue a side they do not inherently agree with.", "Recognize that 'truth' is often subjective in conflicts."],
    proTip: "Physically bring in cheap, oversized glasses. Having a tangible prop drastically improves the role-play element for 5th and 6th graders.",
    objective: "Practice viewing a common school conflict from multiple perspectives to build empathy.", materials: ["Scenario cards", "Prop glasses"],
    phases: [
      { time: "0–10 min", phase: "The Concept", steps: [ { type: "say", text: "When we are upset, we only see the world through our own glasses. Our view feels like the only truth. Empathy means intentionally taking off our glasses and borrowing someone else's." }, { type: "do", text: "Pass around the prop glasses to anchor the metaphor." } ] },
      { time: "10–25 min", phase: "Scenario Practice", steps: [ { type: "do", text: "Read a scenario aloud: Two friends, Kabir and Rohan, fight over a seat in the cafeteria. Kabir feels excluded. Rohan feels smothered." }, { type: "say", text: "In your groups, explain the exact situation through Kabir's glasses, and then re-tell the entire story exclusively through Rohan's glasses." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Are both people right in their own minds? Does someone have to be the 'villain' for a conflict to happen?" } ] }
    ],
    debrief: [ { q: "Is it possible for two people to have totally different views of the exact same event?", note: "Yes. Perception is reality to the person experiencing it." } ],
    watchOutFor: [ "Students refusing to see the 'wrong' person's side. Push them to find the logic in the opposing view." ],
    variations: [ { tag: "Acting", text: "Have students physically swap chairs when arguing the two different perspectives." } ]
  },
  {
    id: "l_em_2", title: "Walk a Mile — Persona Cards", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Individual", "Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.7, usedBy: 290,
    bestUsedWhen: "Teaching diversity, inclusion, or trying to break down social bubbles.",
    studentOutcomes: ["Inhabit a marginalized or different identity.", "Predict emotional reactions of others.", "Identify personal biases and assumptions."],
    proTip: "Make sure the personas represent a wide variety of lived experiences (e.g., a student with ADHD, a student who just moved cities, a gifted student feeling pressure).",
    objective: "Students will practise inhabiting a perspective genuinely different from their own to build deep empathy.", materials: ["Persona Cards", "Worksheets"],
    phases: [
      { time: "0–5 min", phase: "Set Up", steps: [ { type: "say", text: "Today we are going to try to walk a mile in someone else's shoes. You will each get a persona. For 20 minutes, you are that person." }, { type: "do", text: "Distribute Persona Cards face down. Students flip on your signal." } ] },
      { time: "5–8 min", phase: "In-Role Thinking", steps: [ { type: "do", text: "Students read their persona card silently." }, { type: "say", text: "Answer the questions on the worksheet AS that person. Not what YOU would do — what THEY would do." } ] },
      { time: "8–22 min", phase: "Individual Reflection", steps: [ { type: "do", text: "Students answer the in-role questions on their worksheet." } ] },
      { time: "22–33 min", phase: "Paired Conversation", steps: [ { type: "do", text: "Pair students whose personas are extremely different from each other." }, { type: "say", text: "Have a 5-minute conversation in role about a school policy." } ] },
      { time: "33–40 min", phase: "Debrief", steps: [ { type: "say", text: "Come out of role now. Let us talk about what just happened." } ] }
    ],
    debrief: [ { q: "What was the hardest part of staying in your persona's perspective?", note: "Usually slipping back to own self." } ],
    watchOutFor: [ "A student who gets a persona very similar to their own difficult real-life situation. Check in on them." ],
    variations: [ { tag: "Short session", text: "Skip the paired conversation and go straight from individual reflection to debrief." } ]
  },
  {
    id: "l_em_3", title: "The Kindness Boomerang", themeShort: ["Empathy", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.8, usedBy: 605,
    bestUsedWhen: "The classroom feels disconnected, cynical, or after a period of intense academic competition.",
    studentOutcomes: ["Visually map community connection.", "Offer and receive genuine public praise.", "Understand the butterfly effect of behavior."],
    proTip: "If a student drops the yarn by accident, use it! 'Look, even an accidental drop affects the tension for everyone.'",
    objective: "Demonstrate how empathy creates a ripple effect in a community.", materials: ["A large ball of yarn"],
    phases: [
      { time: "0–10 min", phase: "The Web", steps: [ { type: "do", text: "Have all students stand in a large circle." }, { type: "say", text: "Hold onto the string and throw the ball of yarn to someone across the circle. When you throw it, share one kind thing they did for you recently, or one character trait you appreciate about them." } ] },
      { time: "10–20 min", phase: "The Drop", steps: [ { type: "say", text: "Look at the web we just created. Notice how every single person is connected. What happens to the web if one person drops their string?" }, { type: "do", text: "Have one person drop their string to show how the tension slackens and affects everyone else's grip." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "do", text: "Return to seats and discuss how small, seemingly isolated actions inevitably impact the entire room." } ] }
    ],
    debrief: [ { q: "How does one negative action affect the whole group?", note: "Connect this back to the dropped string." } ],
    watchOutFor: [ "Ensure every single student receives the ball at least once so no one feels excluded." ],
    variations: [ { tag: "Grade 5", text: "Use pre-written compliment cards if students are too shy to generate their own on the spot." } ]
  },
  {
    id: "l_em_4", title: "The Silent Interviewer", themeShort: ["Empathy", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.4, usedBy: 180,
    bestUsedWhen: "Students are struggling to listen to each other during group work.",
    studentOutcomes: ["Demonstrate active listening using only body language.", "Read non-verbal emotional cues.", "Resist the urge to interrupt."],
    proTip: "Remind listeners that blinking, nodding, and mirroring facial expressions are their only tools.",
    objective: "Build empathy by focusing exclusively on non-verbal emotional cues.", materials: ["None"],
    phases: [
      { time: "0–5 min", phase: "The Rule", steps: [ { type: "say", text: "Today you will interview your partner, but the interviewer is not allowed to speak a single word." } ] },
      { time: "5–15 min", phase: "The Interview", steps: [ { type: "do", text: "Student A tells a story about a time they felt proud. Student B must show they are listening using only eye contact and facial expressions." } ] },
      { time: "15–25 min", phase: "Switch", steps: [ { type: "do", text: "Switch roles." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "How did you know your partner was listening if they couldn't speak?" } ] }
    ],
    debrief: [ { q: "Is it possible to ignore someone without saying a word?", note: "Yes, body language speaks volumes." } ],
    watchOutFor: [ "Students making funny faces to distract their partner. Enforce a serious tone." ],
    variations: [ { tag: "Quick version", text: "Do this for only 1 minute per partner." } ]
  },
  {
    id: "l_em_5", title: "The Assumptions Game", themeShort: ["Empathy", "Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 210,
    bestUsedWhen: "Addressing gossip, stereotypes, or snap judgments in the classroom.",
    studentOutcomes: ["Identify how quickly the brain makes assumptions.", "Differentiate between a fact and a guess.", "Withhold judgment until evidence is presented."],
    proTip: "Use pictures of adults, not students, to prevent accidental bullying or targeting.",
    objective: "Recognize how quickly we make assumptions about people based on single data points.", materials: ["Projector", "Photos of strangers"],
    phases: [
      { time: "0–10 min", phase: "The Snap Judgment", steps: [ { type: "do", text: "Show a photo of a person (e.g., a man covered in tattoos). Ask students to shout out what his job is, what music he likes, etc." } ] },
      { time: "10–20 min", phase: "The Reveal", steps: [ { type: "do", text: "Reveal the truth (e.g., he is a pediatric surgeon who loves classical music). Show 3 more photos and repeat the process." } ] },
      { time: "20–35 min", phase: "Debrief", steps: [ { type: "say", text: "Why did our brains immediately guess the wrong thing? How often do we do this to the people sitting in this room?" } ] }
    ],
    debrief: [ { q: "What is the danger of believing your brain's first assumption?", note: "We treat people based on who we think they are, not who they actually are." } ],
    watchOutFor: [ "Students making offensive comments during the guessing phase. Use it as a teachable moment about stereotypes." ],
    variations: [ { tag: "Story mode", text: "Use short text descriptions of a person's behavior instead of photos." } ]
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "l_ct_1", title: "Fact vs. Fiction Relay", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Teams"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.8, usedBy: 390,
    bestUsedWhen: "Introducing digital literacy or right after a major school rumor has spread.",
    studentOutcomes: ["Rapidly distinguish between verifiable facts and subjective opinions.", "Identify manipulative language.", "Work under pressure."],
    proTip: "Keep the score tight to maintain high energy, but always pause to explain WHY a tricky statement is an opinion.",
    objective: "Rapidly distinguish between verifiable facts and subjective opinions under pressure.", materials: ["Whiteboard", "Pre-written statements"],
    phases: [
      { time: "0–5 min", phase: "Definitions", steps: [ { type: "say", text: "A fact is a statement that can be proven true or false with evidence. An opinion is how someone feels or what they believe about a fact." } ] },
      { time: "5–20 min", phase: "The Relay", steps: [ { type: "do", text: "Divide into teams. Read a statement aloud. Teams race to the board to slap a 'FACT' or 'OPINION' sign." }, { type: "do", text: "Award points for correct answers and briefly explain why." } ] },
      { time: "20–35 min", phase: "Tricky Ones", steps: [ { type: "do", text: "Introduce manipulative or mixed statements. (e.g., '9 out of 10 people say this movie is terrible'). Have teams debate why this is tricky." } ] }
    ],
    debrief: [ { q: "Why is it dangerous to mistake an opinion for a fact?", note: "Discuss how this leads to spreading rumors and misinformation." } ],
    watchOutFor: [ "Statements that touch on sensitive religious or political topics. Keep them strictly light and school-focused." ],
    variations: [ { tag: "Digital", text: "Use real YouTube video titles and have them spot the exaggeration." } ]
  },
  {
    id: "l_ct_2", title: "The 'Why' Chain", themeShort: ["Critical thinking", "Problem solving"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.5, usedBy: 250,
    bestUsedWhen: "Students are complaining about surface-level symptoms (e.g., 'I never have enough time') without looking deeper.",
    studentOutcomes: ["Execute a root-cause analysis.", "Differentiate between a symptom and a cause.", "Ask probing questions without being aggressive."],
    proTip: "If students get stuck on 'I don't know why', prompt them with 'If you had to guess, what would the reason be?'",
    objective: "Ask 'why' repeatedly to strip away surface issues and find the root cause of a problem.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Toddler Strategy", steps: [ { type: "say", text: "Have you ever met a toddler who keeps asking 'why'? It can be annoying, but they are actually great problem solvers." }, { type: "do", text: "Model on the board: 'I got a bad grade.' Why? 'I didn't study.' Why? 'I was distracted.' Why? 'My phone was buzzing.' Why? 'I did not turn off notifications.'" } ] },
      { time: "10–20 min", phase: "Pair Practice", steps: [ { type: "do", text: "Give pairs a starting problem (e.g., 'I am always late to school'). One person plays the toddler and asks 'Why?' 5 consecutive times to reach the root cause." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Did asking 'why' change what you thought the original problem was?" } ] }
    ],
    debrief: [ { q: "How does finding the root cause change the solution?", note: "It shifts the solution from treating symptoms to fixing roots." } ],
    watchOutFor: [ "Students getting frustrated by the repetitive 'why'. Remind them to treat it like a detective game." ],
    variations: [ { tag: "Grade 7", text: "Apply this framework to a systemic school-wide issue, like cafeteria crowding." } ]
  },
  {
    id: "l_ct_3", title: "The Fact-Checker", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.6, usedBy: 210,
    bestUsedWhen: "Teaching media literacy or preparing students for research projects.",
    studentOutcomes: ["Isolate facts from persuasive language.", "Identify marketing manipulation.", "Read text with a critical eye."],
    proTip: "Use incredibly obvious ads first (e.g., 'The greatest toy in the universe!') to build confidence before moving to subtle ones.",
    objective: "Identify manipulative language in simple advertising and media.", materials: ["Printed advertisements", "Highlighters"],
    phases: [
      { time: "0–10 min", phase: "The Setup", steps: [ { type: "say", text: "Advertisers use specific words to make you feel like you NEED something. This is manipulative language." } ] },
      { time: "10–25 min", phase: "The Audit", steps: [ { type: "do", text: "Give groups printed ads. Have them highlight facts in yellow and manipulative/exaggerated words in pink." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "What happens if you take all the pink words out of the ad? Does it still sound exciting?" } ] }
    ],
    debrief: [ { q: "How do these tricks apply to YouTube thumbnails?", note: "Connects print concepts to their digital reality." } ],
    watchOutFor: [ "Ads that are too complex. Keep it to simple things like toys or fast food." ],
    variations: [ { tag: "Full class", text: "Analyze a short TV commercial on the projector." } ]
  },
  {
    id: "l_ct_4", title: "Would You Rather? (Logic Edition)", themeShort: ["Critical thinking", "Decision making"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class movement"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.8, usedBy: 315,
    bestUsedWhen: "Students need a brain-break that still involves cognitive lifting.",
    studentOutcomes: ["Defend a position using logic, not emotion.", "Evaluate competing trade-offs.", "Speak publicly with confidence."],
    proTip: "If a student gives a weak 'just because' reason, ask the class: 'Who can help them build a logical bridge for that answer?'",
    objective: "Defend a choice using logical reasons rather than 'just because'.", materials: ["None"],
    phases: [
      { time: "0–5 min", phase: "The Rule", steps: [ { type: "say", text: "You must choose a side, but you can only stay there if you can provide a logical reason. 'Because it is cool' is not allowed." } ] },
      { time: "5–20 min", phase: "The Movement", steps: [ { type: "do", text: "Ask: 'Would you rather have the ability to fly or be invisible?' Have them move to sides of the room." } ] },
      { time: "20–30 min", phase: "The Defense", steps: [ { type: "do", text: "Ask students to state their logical defense. If it is purely emotional, make them try again." } ] }
    ],
    debrief: [ { q: "Was it hard to separate your feelings from your logic?", note: "Yes, this is the core of critical thinking." } ],
    watchOutFor: [ "Arguments getting too heated over silly topics." ],
    variations: [ { tag: "Pairs", text: "Have them play in pairs with a list of prompts." } ]
  },
  {
    id: "l_ct_5", title: "The Alien Anthropologist", themeShort: ["Critical thinking", "Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.5, usedBy: 160,
    bestUsedWhen: "Challenging 'this is just the way things are' thinking.",
    studentOutcomes: ["Deconstruct everyday routines.", "Identify the underlying purpose of social norms.", "Question the status quo objectively."],
    proTip: "The more mundane the object or routine, the better the exercise works (e.g., brushing teeth, raising hands in class).",
    objective: "Deconstruct everyday social norms by explaining them to an 'alien' who has no context for human behavior.", materials: ["Common objects (e.g., shoe, pen, clock)"],
    phases: [
      { time: "0–10 min", phase: "The Persona", steps: [ { type: "say", text: "Imagine you are an alien who just landed. You do not understand any human rules." } ] },
      { time: "10–25 min", phase: "The Explanation", steps: [ { type: "do", text: "Give pairs a topic (e.g., 'Homework'). One is the human, one is the alien. The human must logically explain to the alien WHY we do this, without saying 'because we have to'." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "How many things do we do just because someone told us to, without knowing the logic behind it?" } ] }
    ],
    debrief: [ { q: "Did explaining the logic make the rule seem smarter or sillier?", note: "Often reveals that some rules are just outdated habits." } ],
    watchOutFor: [ "Students getting bogged down in silly sci-fi alien voices. Keep them focused on the logic." ],
    variations: [ { tag: "Objects", text: "Explain a common object (like a tie) instead of a routine." } ]
  },

  // ── WHO Skill 4: Creative Thinking ──
  {
    id: "l_crt_1", title: "The Squiggle Challenge", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.8, usedBy: 450,
    bestUsedWhen: "Warming up for a writing or art project, or breaking through perfectionism.",
    studentOutcomes: ["Overcome the 'blank page' freeze.", "Use constraints to boost creativity.", "Reframe 'mistakes' as starting points."],
    proTip: "Draw the worst, ugliest squiggle on the board yourself and turn it into something funny to lower the stakes for everyone.",
    objective: "Overcome the fear of a blank page and practice rapid creative generation through constraints.", materials: ["Paper with identical random squiggles drawn on them", "Pens"],
    phases: [
      { time: "0–5 min", phase: "The Blank Page Fear", steps: [ { type: "say", text: "Perfectionism is the enemy of creativity. When we stare at a blank page, we freeze. Today we are making art out of pre-made scribbles." } ] },
      { time: "5–15 min", phase: "The Transformation", steps: [ { type: "do", text: "Hand out the squiggle papers. Give students exactly 3 minutes to turn the random squiggle into a recognizable drawing (a bird, a car, a face)." } ] },
      { time: "15–25 min", phase: "Gallery", steps: [ { type: "do", text: "Have students walk around the room to look at the drawings. Point out how the exact same squiggle became 30 completely different pieces of art." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Creativity is not about pulling genius out of thin air. It is just about connecting things that already exist." } ] }
    ],
    debrief: [ { q: "Was it easier to draw starting with a squiggle or a blank page?", note: "Constraints actually help eliminate choice paralysis and boost creativity." } ],
    watchOutFor: [ "Students saying 'I cannot draw'. Assure them stick figures and messy lines are perfect for this." ],
    variations: [ { tag: "Pairs", text: "One person draws the initial squiggle, the other turns it into art." } ]
  },
  {
    id: "l_crt_2", title: "Brainstorming Bonanza", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.6, usedBy: 310,
    bestUsedWhen: "The class needs to solve a real logistical problem (like a messy classroom or a boring assembly).",
    studentOutcomes: ["Separate idea generation from judgment.", "Produce high-volume ideas rapidly.", "Synthesize multiple concepts into one solution."],
    proTip: "If someone says 'that's a bad idea' during the 5-minute silent phase, pause the timer and remind them of the cardinal rule. Enforce the silence.",
    objective: "Teach the core rule of brainstorming: completely separate idea generation from idea evaluation.", materials: ["Sticky notes", "Chart paper"],
    phases: [
      { time: "0–10 min", phase: "The Rule", steps: [ { type: "say", text: "The biggest killer of creativity is judging an idea before it is fully formed. Today, for the first ten minutes, every single idea is a good idea. No judgment allowed." } ] },
      { time: "10–20 min", phase: "The Storm", steps: [ { type: "do", text: "Give a prompt: 'Design a new school uniform that solves 3 problems.' Students write one wild idea per sticky note for 5 minutes in total silence." } ] },
      { time: "20–30 min", phase: "The Sort", steps: [ { type: "do", text: "Now the evaluation phase begins. Have groups sort the stickies by theme, combine the good parts, and pick the best overall solution." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the psychological relief of generating ideas without being judged." } ] }
    ],
    debrief: [ { q: "Did waiting to judge the ideas make it easier to share them?", note: "Usually yes, it significantly reduces the fear of failure." } ],
    watchOutFor: [ "Students laughing at 'dumb' ideas during the silent phase. Intervene immediately to protect the rule." ],
    variations: [ { tag: "Fun twist", text: "Prompt: 'Invent a new school subject that does not exist yet.'" } ]
  },
  {
    id: "l_crt_3", title: "The Alternate Uses Test", themeShort: ["Creative thinking", "Problem solving"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.4, usedBy: 220,
    bestUsedWhen: "Training students for out-of-the-box thinking before a STEM or design challenge.",
    studentOutcomes: ["Break functional fixedness.", "Engage in rapid divergent thinking.", "Value quantity of ideas over initial quality."],
    proTip: "Hold the physical object in your hand while they brainstorm. It grounds the abstract exercise in reality.",
    objective: "Practice divergent thinking to break functional fixedness.", materials: ["A simple object like a paperclip"],
    phases: [
      { time: "0–5 min", phase: "Functional Fixedness", steps: [ { type: "say", text: "When we see a paperclip, we only think of it holding paper. That is functional fixedness. Let's break it." } ] },
      { time: "5–15 min", phase: "The Sprint", steps: [ { type: "do", text: "Give groups 3 minutes to list as many non-traditional uses for a paperclip as possible." } ] },
      { time: "15–25 min", phase: "Evaluation", steps: [ { type: "do", text: "Share lists. Award points for unique ideas." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Why do we struggle to see new uses for common things?" } ] }
    ],
    debrief: [ { q: "How does this apply to solving problems when you don't have the right tools?", note: "Resourcefulness." } ],
    watchOutFor: [ "Students saying 'I can't think of anything'. Tell them to think of ridiculous ideas first." ],
    variations: [ { tag: "Grade 7", text: "Use a more abstract object like a brick." } ]
  },
  {
    id: "l_crt_4", title: "The Finish the Story Game", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class circle"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.7, usedBy: 340,
    bestUsedWhen: "Building classroom cohesion and breaking the ice early in the year.",
    studentOutcomes: ["Practice spontaneous ideation.", "Build upon the ideas of others (Yes, and...).", "Adapt to unexpected changes in narrative."],
    proTip: "If a student freezes, give them a lifeline: 'Does something jump out, or does someone say something?'",
    objective: "Practice spontaneous creativity and collaborative storytelling.", materials: ["None"],
    phases: [
      { time: "0–5 min", phase: "The Setup", steps: [ { type: "say", text: "We are going to tell a story, but you only get to add one sentence at a time." } ] },
      { time: "5–20 min", phase: "The Story", steps: [ { type: "do", text: "Start with a prompt: 'The door was locked, but then...'. Go around the circle." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "Did the story go where you expected it to?" } ] }
    ],
    debrief: [ { q: "What happens when someone adds an unexpected twist?", note: "Forces the next person to adapt creatively." } ],
    watchOutFor: [ "Students adding inappropriate twists. Keep it school-appropriate." ],
    variations: [ { tag: "One word", text: "Harder mode: Add only one word at a time." } ]
  },
  {
    id: "l_crt_5", title: "The 'Bad' Invention Pitch", themeShort: ["Creative thinking", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.9, usedBy: 280,
    bestUsedWhen: "Teaching persuasive communication and resilience to 'silly' ideas.",
    studentOutcomes: ["Practice persuasive pitching.", "Find value in fundamentally flawed concepts.", "Present confidently to a group."],
    proTip: "Act like a 'Shark Tank' investor when they pitch to you. Ask them tough, funny questions about their terrible product.",
    objective: "Find creative ways to market and sell an objectively terrible invention.", materials: ["Whiteboard", "Markers"],
    phases: [
      { time: "0–10 min", phase: "The Bad Ideas", steps: [ { type: "do", text: "Assign each group a terrible invention (e.g., A waterproof teabag, a glass hammer, a submarine with screen doors)." } ] },
      { time: "10–25 min", phase: "The Pitch", steps: [ { type: "say", text: "You have 15 minutes to figure out how to sell this to me. Who is the target market? Why is this flaw actually a brilliant feature?" } ] },
      { time: "25–35 min", phase: "Presentations", steps: [ { type: "do", text: "Have groups deliver their 2-minute pitches." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "say", text: "How much of 'success' is just how you frame and present an idea?" } ] }
    ],
    debrief: [ { q: "Did you actually start believing your own pitch by the end?", note: "Highlights the power of framing." } ],
    watchOutFor: [ "Groups getting stuck because the item is 'useless'. Remind them it is a comedy exercise." ],
    variations: [ { tag: "Props", text: "Have them draw a logo and tagline for the bad invention." } ]
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "l_dm_1", title: "Stop, Think, Go", themeShort: ["Decision making", "Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class", "Role-play"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.8, usedBy: 610,
    bestUsedWhen: "Students are exhibiting reactive, impulsive behavior in the classroom or playground.",
    studentOutcomes: ["Internalize a cognitive pause mechanism.", "Generate alternative choices under pressure.", "Evaluate consequences before action."],
    proTip: "Physically make them put their hands up like a stop sign for 'Red'. Physicalizing the metaphor makes it stick.",
    objective: "Implement a simple cognitive pause (traffic light model) to prevent impulsive and emotional decision-making.", materials: ["Red, Yellow, Green paper circles"],
    phases: [
      { time: "0–10 min", phase: "Traffic Light", steps: [ { type: "say", text: "Impulsive decisions happen when we go straight from feeling an emotion to acting on it. We need to build a mental traffic light." }, { type: "do", text: "Explain: Red = Stop and breathe. Yellow = Think of two possible options. Green = Choose the best one and go." } ] },
      { time: "10–20 min", phase: "Role-Play", steps: [ { type: "do", text: "Read a scenario: 'Someone bumps you in the hall and your books fall.' Hold up the Red circle. 'What do you do right now?' (Breathe). Hold up Yellow. 'What are two options?' Hold up Green. 'Which do you choose?'" } ] },
      { time: "20–30 min", phase: "Practice", steps: [ { type: "do", text: "Run 3 more scenarios, letting the students call out the steps and act them out." } ] }
    ],
    debrief: [ { q: "Why is the Yellow step the most important one?", note: "It creates the necessary neurological pause where logic catches up to the emotional reaction." } ],
    watchOutFor: [ "Students choosing aggressive 'Green' actions for a laugh. Guide them back to evaluating the consequences of those choices." ],
    variations: [ { tag: "Active", text: "Have students physically take a step forward in the room for each light phase." } ]
  },
  {
    id: "l_dm_2", title: "The Choice Scale", themeShort: ["Decision making", "Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs", "Full class"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.6, usedBy: 340,
    bestUsedWhen: "Teaching time management, homework prioritization, or goal setting.",
    studentOutcomes: ["Weigh pros and cons logically.", "Understand opportunity cost.", "Assign 'weight' to different outcomes."],
    proTip: "Draw a literal scale on the board and draw different sized boxes to show that one heavy 'Con' outweighs three tiny 'Pros'.",
    objective: "Weigh the pros and cons of everyday decisions to understand that every choice has a trade-off.", materials: ["Whiteboard", "Worksheets"],
    phases: [
      { time: "0–10 min", phase: "The Scale", steps: [ { type: "say", text: "Every choice has a cost. If you choose to play video games, the cost is your study time. If you study, the cost is your game time. Nothing is free." } ] },
      { time: "10–25 min", phase: "Weighing It Out", steps: [ { type: "do", text: "Give a common scenario: 'Staying up late to watch a movie on a school night.' Ask students to list 3 specific pros and 3 specific cons on their worksheet." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "Does having a higher number of 'pros' automatically make it the right choice?" } ] }
    ],
    debrief: [ { q: "Can one massive 'con' outweigh three small 'pros'?", note: "Yes. Teach them that the weight of the consequence matters more than the quantity." } ],
    watchOutFor: [ "Students arguing that 'fun' is always the right answer. Guide them to consider the long-term impact." ],
    variations: [ { tag: "Physical", text: "Use a real balancing scale with physical blocks to represent the weight of pros/cons." } ]
  },
  {
    id: "l_dm_3", title: "The What-If Map", themeShort: ["Decision making", "Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.7, usedBy: 420,
    bestUsedWhen: "Addressing cheating, lying, or other behavioral issues with cascading consequences.",
    studentOutcomes: ["Trace secondary consequences.", "Visualize the butterfly effect of decisions.", "Collaborate to predict outcomes."],
    proTip: "Force them to trace out at least 3 levels deep (e.g., Decision -> Consequence -> Reaction -> Final Result).",
    objective: "Practice tracing the short and long-term consequences of a single decision using a branching mind map.", materials: ["Large chart paper", "Markers", "Scenario Cards"],
    phases: [
      { time: "0–10 min", phase: "The Ripple Effect", steps: [ { type: "say", text: "Every decision is like dropping a stone in a pond. It creates ripples. Today we are going to draw the ripples." }, { type: "do", text: "Demonstrate on the board with a simple choice: 'I decide not to study for the math test.' Draw branches for what happens the next day, the next week, and the next month." } ] },
      { time: "10–25 min", phase: "Group Mapping", steps: [ { type: "do", text: "Give groups a scenario card (e.g., 'You find a lost phone in the cafeteria')." }, { type: "say", text: "Draw the What-If map. If you keep it, what happens? If you turn it in, what happens? Trace each path out to at least three consequences." } ] },
      { time: "25–35 min", phase: "Gallery Walk", steps: [ { type: "do", text: "Groups present their maps to the class." } ] }
    ],
    debrief: [ { q: "Did tracing the 'What-Ifs' make the right choice clearer?", note: "Visualizing consequences often removes impulsivity." } ],
    watchOutFor: [ "Groups getting stuck on unrealistic extreme consequences (e.g., 'I go to jail for stealing a pencil'). Keep them grounded." ],
    variations: [ { tag: "Grade 5", text: "Do the mapping as a full class activity on the main whiteboard." } ]
  },
  {
    id: "l_dm_4", title: "Gut Check", themeShort: ["Decision making", "Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.5, usedBy: 190,
    bestUsedWhen: "Teaching personal safety, boundaries, and intuition.",
    studentOutcomes: ["Identify physiological warning signs.", "Trust internal intuition.", "Differentiate between fear and intuition."],
    proTip: "Share a small, safe story about a time you ignored your own gut feeling and regretted it.",
    objective: "Learn to recognize physiological signals as an intuitive decision-making tool.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "The Gut Feeling", steps: [ { type: "say", text: "Sometimes your stomach knows a decision is bad before your brain does. That is your gut feeling." } ] },
      { time: "10–20 min", phase: "Memory Mapping", steps: [ { type: "do", text: "Have students write about a time they ignored a bad gut feeling. What happened?" } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "How can we pause to listen to our gut?" } ] }
    ],
    debrief: [ { q: "What does a 'bad idea' feel like in your body?", note: "Tight chest, butterflies, heavy stomach." } ],
    watchOutFor: [ "Confusing gut feelings with general anxiety. Clarify the difference (anxiety is loud and panicky; intuition is quiet and firm)." ],
    variations: [ { tag: "Quick version", text: "Do a verbal share instead of writing." } ]
  },
  {
    id: "l_dm_5", title: "The Reversal Rule", themeShort: ["Decision making", "Empathy"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 210,
    bestUsedWhen: "Students are stuck in a dilemma involving other people's feelings.",
    studentOutcomes: ["Apply the golden rule practically.", "Decenter their own desires.", "Evaluate the fairness of a choice."],
    proTip: "If they say 'I wouldn't care if they did that to me', press them: 'Really? Are you sure, or are you just saying that to win the argument?'",
    objective: "Use role-reversal to test the fairness and emotional impact of a difficult decision.", materials: ["Scenario cards"],
    phases: [
      { time: "0–5 min", phase: "The Rule", steps: [ { type: "say", text: "If you aren't sure if a decision is right, reverse the roles. Would you be okay if someone made this exact decision about YOU?" } ] },
      { time: "5–20 min", phase: "Role-Play", steps: [ { type: "do", text: "Give a scenario (e.g., 'Canceling plans with a friend to go to a cooler party'). Have Student A justify it. Then instantly make them play the canceled-on friend." } ] },
      { time: "20–30 min", phase: "Debrief", steps: [ { type: "say", text: "How quickly did your opinion change when you were on the receiving end?" } ] }
    ],
    debrief: [ { q: "Does the 'Reversal Rule' make decision making harder or easier?", note: "Harder in the short term, but much clearer in the long term." } ],
    watchOutFor: [ "Students lacking the empathy to truly inhabit the reversed role. Guide them through the feelings." ],
    variations: [ { tag: "Writing", text: "Have them write a letter to themselves from the perspective of the person affected by their choice." } ]
  }
];
// ──────────────────────── MIDDLE SECONDARY (Grade 8-10) ────────────────────────
  
  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "m_sa_1", title: "The Core Values Audit", themeShort: ["Self-awareness", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual", "Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.8, usedBy: 842,
    bestUsedWhen: "Students are facing major choices (like picking academic streams) and feeling lost.",
    studentOutcomes: ["Distinguish inherited values from personal values.", "Use a value-framework to make a tough choice.", "Articulate what success means to them personally."],
    proTip: "If students rush through crossing out values, slow them down. Say, 'You are permanently deleting this from your life. Are you sure?'",
    objective: "Students will narrow down a list of values to their top 3 core values, and use them to evaluate a recent decision.", materials: ["List of 50 Values", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "The 50 to 5 Challenge", steps: [ { type: "do", text: "Hand out the list of 50 values (e.g., Wealth, Family, Honesty, Freedom)." }, { type: "say", text: "Circle your top 10 values. Now, make it harder: cross out 5 of them. You can only keep 5." } ] },
      { time: "10–20 min", phase: "The Final 3", steps: [ { type: "say", text: "Now cross out 2 more. You are left with your top 3 Core Values. These are the foundation of who you are." } ] },
      { time: "20–35 min", phase: "Value Alignment", steps: [ { type: "say", text: "Think of a recent decision you made that felt wrong. Look at your 3 values. Did that decision violate one of your core values?" } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how knowing our values acts as a compass." } ] }
    ],
    debrief: [ { q: "Was it hard to eliminate 'Success' to keep 'Integrity'?", note: "Forces them to define what success actually means to them." } ],
    watchOutFor: [ "Students picking values they think sound 'good' to teachers. Encourage brutal, private honesty." ],
    variations: [ { tag: "Grade 10", text: "Apply top 3 values to their upcoming stream choices." } ],
    worksheet: { title: "My Core Values", intro: "Your values are your compass.", sections: [ { title: "The Final 3", prompts: [ { label: "Value 1, 2, 3:", lines: 2 }, { label: "A decision that conflicted with my values:", lines: 2 } ] } ] }
  },
  {
    id: "m_sa_2", title: "The Identity Mask", themeShort: ["Self-awareness", "Coping with emotions"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual art activity"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Advanced", rating: 4.9, usedBy: 620,
    bestUsedWhen: "Addressing peer pressure, bullying, or collective burnout in a cohort.",
    studentOutcomes: ["Acknowledge the gap between public persona and private reality.", "Identify safe spaces to drop the mask.", "Reduce the cognitive load of pretending."],
    proTip: "Do not collect these at the end unless students explicitly offer them. The privacy of the 'inside' mask is crucial for honesty.",
    objective: "Explore how students present themselves vs how they feel inside to understand the burden of emotional masking.", materials: ["Paper mask templates", "Markers"],
    phases: [
      { time: "0–10 min", phase: "The Concept", steps: [ { type: "say", text: "We all wear masks at school. Sometimes we wear the 'tough' mask or the 'always joking' mask. We do this to protect ourselves." } ] },
      { time: "10–25 min", phase: "Front and Back", steps: [ { type: "do", text: "On the front of the mask, draw or write how you act at school. On the inside, write what you actually feel but hide." } ] },
      { time: "25–35 min", phase: "Reflection", steps: [ { type: "say", text: "Look at the gap between the inside and outside. Is wearing that front mask exhausting?" } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Reassure them that having a private self is normal, but hiding completely leads to burnout." } ] }
    ],
    debrief: [ { q: "Who is one person in your life you can take the mask off around?", note: "Identifies safe support systems." } ],
    watchOutFor: [ "Do not force students to share the inside of their masks. It is highly private." ],
    variations: [ { tag: "Digital", text: "Compare their Instagram profile (front) to real life (inside)." } ],
    worksheet: { title: "The Identity Mask", intro: "Front vs Back.", sections: [ { title: "Reflection", prompts: [ { label: "Why do I wear the mask I wear?", lines: 2 }, { label: "One person who sees the real me:", lines: 1 } ] } ] }
  },

  // ── WHO Skill 2: Empathy ──
  {
    id: "m_em_1", title: "The Echo Chamber", themeShort: ["Empathy", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.7, usedBy: 512,
    bestUsedWhen: "The class is highly polarized over a social issue, or to teach digital literacy.",
    studentOutcomes: ["Understand algorithmic bias.", "Steel-man an opposing argument.", "Decouple empathy from agreement."],
    proTip: "If students use 'straw-man' arguments (making the other side sound stupid), interrupt them and force them to rebuild the argument respectfully.",
    objective: "Understand algorithms and practice finding empathy for opposing views through 'steel-manning'.", materials: ["Whiteboard", "Controversial topics"],
    phases: [
      { time: "0–10 min", phase: "Algorithm", steps: [ { type: "say", text: "Social media shows you what you already agree with. This is an echo chamber. It makes us think people who disagree with us are crazy." } ] },
      { time: "10–25 min", phase: "Steel-manning", steps: [ { type: "say", text: "Today we will 'steel-man' an argument. You must make the strongest, most logical possible argument for the OTHER side." }, { type: "do", text: "Give a topic. If a group agrees with it, they MUST spend 10 minutes arguing against it." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how understanding the logic of the other side reduces our anger towards them." } ] }
    ],
    debrief: [ { q: "Does understanding an argument mean you have to agree with it?", note: "No. Empathy does not equal agreement. It equals understanding." } ],
    watchOutFor: [ "Keep topics to school/lifestyle issues. Avoid highly polarized political fights." ],
    variations: [ { tag: "Grade 10", text: "Use real opinion articles from opposing news sources." } ],
    worksheet: { title: "Steel-Manning", intro: "Make the strongest argument.", sections: [ { title: "The Other Side", prompts: [ { label: "The issue:", lines: 1 }, { label: "The absolute best argument for the OPPOSITE view is:", lines: 3 } ] } ] }
  },

  // ── WHO Skill 3: Critical Thinking ──
  {
    id: "m_ct_1", title: "Media Manipulation Detective", themeShort: ["Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 390,
    bestUsedWhen: "Students are exhibiting high anxiety caused by social media or news trends.",
    studentOutcomes: ["Identify logical fallacies.", "Spot false urgency and fear-mongering.", "Create a manipulative ad to reverse-engineer the process."],
    proTip: "Bring in real screenshots of clickbait thumbnails from YouTube for them to analyze. Real-world relevance is key here.",
    objective: "Identify common logical fallacies and manipulation tactics in media and advertising.", materials: ["Printed examples of clickbait/ads", "Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Tactics", steps: [ { type: "do", text: "Introduce three common media tactics: Fear-mongering, Bandwagon ('everyone is doing it'), and False Urgency ('buy now before it is gone')." } ] },
      { time: "10–25 min", phase: "Investigation", steps: [ { type: "do", text: "Have pairs review the printed ads and label which of the three tactics is being used." } ] },
      { time: "25–35 min", phase: "Creation", steps: [ { type: "say", text: "Now create a highly manipulative advertisement for a boring object, like a yellow pencil, using all three tactics." } ] },
      { time: "35–40 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss how recognizing the psychological trick removes its power over you." } ] }
    ],
    debrief: [ { q: "Why do these tactics work so well on our brains?", note: "They bypass logic and trigger our emotional survival centers." } ],
    watchOutFor: [ "Ensure the ad examples are age-appropriate." ],
    variations: [ { tag: "Tech-enabled", text: "Have them find live examples on their own Instagram or YouTube feeds." } ],
    worksheet: { title: "Media Detective", intro: "Spot the trick.", sections: [ { title: "Tactics", prompts: [ { label: "An example of False Urgency I found:", lines: 2 }, { label: "How I will question this online in the future:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 9: Coping with Stress ──
  {
    id: "m_cs_1", title: "The Reverse Calendar", themeShort: ["Coping with stress", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual", "Pairs"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.8, usedBy: 950,
    bestUsedWhen: "3-4 weeks before final exams, when overwhelm starts to peak.",
    studentOutcomes: ["Execute backward planning.", "Reduce task-initiation anxiety.", "Break macro goals into micro habits."],
    proTip: "Do not let them leave without answering 'What is tomorrow's 15-minute step?' If they don't know, they won't start.",
    objective: "Apply backward planning to a major goal to significantly reduce deadline-induced panic.", materials: ["Blank Calendar Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Why Goals Fail", steps: [ { type: "say", text: "We plan forward, get overwhelmed, and quit. Professional planners work backwards from the deadline." } ] },
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Students pick a big project or exam. Write the end date. Map back to 1 month before, 1 week before, and tomorrow." } ] },
      { time: "25–30 min", phase: "Accountability", steps: [ { type: "do", text: "Share 'Tomorrow's step' with a partner to make it real." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "do", text: "Discuss the psychological relief of seeing the steps clearly laid out." } ] }
    ],
    debrief: [ { q: "Is your first step ACTUALLY doable in 15 minutes?", note: "Force them to make the first step smaller if it is too big." } ],
    watchOutFor: [ "Vague goals like 'Study harder'. Force specificity." ],
    variations: [ { tag: "Grade 10", text: "Extend to a one year timeline for board exams." } ],
    worksheet: { title: "Reverse Calendar", intro: "Start at the end.", sections: [ { title: "The Plan", prompts: [ { label: "End Date:", lines: 1 }, { label: "TOMORROW's 15-minute step:", lines: 1 } ] } ] }
  },

  // ──────────────────────── SENIOR SECONDARY (Grade 11-12) ────────────────────────
  
  // ── WHO Skill 1: Self-Awareness ──
  {
    id: "s_sa_1", title: "The Future Self Letter", themeShort: ["Self-awareness", "Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.9, usedBy: 1120,
    bestUsedWhen: "Mid-way through Grade 12 when college application stress is destroying mental health.",
    studentOutcomes: ["Practice temporal distancing.", "Exercise self-compassion.", "De-escalate immediate academic panic."],
    proTip: "The success of this relies entirely on the environment. Dim the lights, play lo-fi beats, and enforce strict silence.",
    objective: "Engage in temporal distancing by writing a letter from future self to present self to reduce immediate academic anxiety.", materials: ["Lined paper", "Envelopes"],
    phases: [
      { time: "0–10 min", phase: "Temporal Distancing", steps: [ { type: "say", text: "Think back to a massive stress you had in 8th grade. Does it matter now? Probably not. Zooming out changes the weight of a problem." } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "say", text: "Imagine you are 25. You survived the board exams and college admissions. You are okay. Write a letter back to your 17-year-old self giving them advice and reassurance." }, { type: "do", text: "Play calming instrumental music while they write." } ] },
      { time: "25–35 min", phase: "Sealing", steps: [ { type: "do", text: "Have students seal the letters and write 'Open on the day before final exams' on the front." } ] }
    ],
    debrief: [ { q: "What was the most compassionate thing your future self told you?", note: "Self-compassion is a key clinical stress reducer." } ],
    watchOutFor: [ "Joke letters. Maintain a very quiet, serious environment to encourage vulnerability." ],
    variations: [ { tag: "Delivery", text: "Collect the envelopes and actually hand them back right before their final exams." } ],
    worksheet: { title: "Letter from the Future", intro: "Advice from your 25-year-old self.", sections: [ { title: "Reflection", prompts: [ { label: "One thing I realized while writing this:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 5: Decision Making ──
  {
    id: "s_dm_1", title: "Regret Minimization Framework", themeShort: ["Decision making"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.8, usedBy: 870,
    bestUsedWhen: "Students are stuck between two major life choices (e.g., a 'safe' degree vs a 'passion' path).",
    studentOutcomes: ["Project long-term outcomes of decisions.", "De-risk short-term failure.", "Clarify deeply held personal values over societal expectations."],
    proTip: "Remind them that at 80, nobody cares about a failed midterm. They care about risks not taken.",
    objective: "Make a high-stakes choice by projecting forward to age 80 to gain ultimate perspective.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Projecting Forward", steps: [ { type: "say", text: "When facing a big choice, ask: 'At age 80, will I regret NOT doing this?'" } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "do", text: "Students pick a real upcoming choice (e.g., college path) and write the 80-year-old perspective." } ] },
      { time: "25–35 min", phase: "Debrief", steps: [ { type: "say", text: "We consistently regret the things we did NOT try more than the things we tried and failed at." } ] }
    ],
    debrief: [ { q: "Did this shift your leaning toward the braver choice?", note: "Reduces the immediate fear of short-term failure." } ],
    watchOutFor: [ "Applying this to reckless or dangerous decisions. Clarify it is for calculated life paths." ],
    variations: [ { tag: "Pairs", text: "Interview each other pretending to be 80-year-olds." } ],
    worksheet: { title: "The 80-Year-Old Check", intro: "Look back from the future.", sections: [ { title: "The Choice", prompts: [ { label: "At 80, I will be most proud that I chose to:", lines: 2 } ] } ] }
  },

  // ── WHO Skill 10: Coping with Emotions ──
  {
    id: "s_ce_1", title: "Cognitive Distortion Trap", themeShort: ["Coping with emotions", "Critical thinking"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Pairs"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.9, usedBy: 1040,
    bestUsedWhen: "Students are demonstrating 'all-or-nothing' thinking regarding their academic futures.",
    studentOutcomes: ["Identify clinical cognitive distortions.", "Apply cognitive restructuring to negative self-talk.", "Separate identity from academic performance."],
    proTip: "Give a deeply personal example: 'I used to think if one student disliked my class, I was a terrible teacher. That is Catastrophizing.'",
    objective: "Identify catastrophizing and all-or-nothing thinking to dispute negative self-talk.", materials: ["Distortion cheat sheets"],
    phases: [
      { time: "0–10 min", phase: "The Traps", steps: [ { type: "say", text: "Your brain lies. 'If I fail, my life is ruined' is Catastrophizing." } ] },
      { time: "10–25 min", phase: "Labeling", steps: [ { type: "do", text: "Pairs identify distortions in example statements." } ] },
      { time: "25–40 min", phase: "The Dispute", steps: [ { type: "say", text: "Write your most common negative thought. Label it. Write the factual dispute." } ] }
    ],
    debrief: [ { q: "Why is it powerful to just give the thought a label?", note: "Creates distance from the emotion." } ],
    watchOutFor: [ "Students feeling attacked if their genuine fears are labeled 'distortions'. Be gentle." ],
    variations: [ { tag: "CBT focus", text: "Turn it into a deeper journaling exercise." } ],
    worksheet: { title: "Catch the Lie", intro: "Fact-check your thoughts.", sections: [ { title: "Dispute", prompts: [ { label: "My negative thought:", lines: 1 }, { label: "The factual truth to dispute it:", lines: 2 } ] } ] }
  }
];

// ─── PRINT VIEW (Facilitator Guide + Worksheet) ───────────────────────────────
function PrintView({ activity, mode, onClose }) {
  useEffect(() => { if (activity) setTimeout(() => window.print(), 400); }, [activity]);

  if (!activity) return null;

  if (mode === "guide") return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>Facilitator Guide — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstp-header">
          <h1>{activity.title}</h1>
          <div className="lstp-header-meta">
            <span>{activity.themeShort.join(" & ")}</span>
            <span>Grade {activity.grade}</span>
            <span>{activity.duration}</span>
            <span>{activity.formats.join(" | ")}</span>
          </div>
        </div>

        <div className="lstp-section-h">Learning Objective</div>
        <div className="lstp-objective-box">{activity.objective}</div>

        {activity.proTip && (
          <div className="lstp-objective-box" style={{background:'#FFFBEA', borderLeftColor:'#F1C40F'}}>
            <strong>💡 Pro Tip:</strong> {activity.proTip}
          </div>
        )}

        <div className="lstp-section-h">Materials Needed</div>
        <div className="lstp-materials-list">
          {activity.materials.map((m, i) => <span key={i} className="lstp-material">{m}</span>)}
        </div>

        <div className="lstp-section-h">Facilitation Guide</div>
        {activity.phases.map((phase, pi) => (
          <div key={pi} className="lstp-phase-block">
            <div className="lstp-phase-title">
              <span className="lstp-phase-time">{phase.time}</span>
              <span className="lstp-phase-name">{phase.phase}</span>
            </div>
            {phase.steps.map((s, si) => <PrintStep key={si} s={s} />)}
          </div>
        ))}

        <div className="lstp-section-h">Debrief Questions</div>
        {activity.debrief.map((d, i) => (
          <div key={i} className="lstp-debrief-item">
            <div className="lstp-debrief-q">Q{i + 1}: {d.q}</div>
            <div className="lstp-debrief-note">Facilitator Note: {d.note}</div>
          </div>
        ))}

        <div className="lstp-section-h">Watch Out For</div>
        {activity.watchOutFor && activity.watchOutFor.map((w, i) => <div key={i} className="lstp-watch">{w}</div>)}

        <div className="lstp-footer">
          SecretSharz Life Skills Resource Library · Grade {activity.grade}
        </div>
      </div>
    </div>
  );

  if (mode === "worksheet") return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>Student Worksheet — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstw-header">
          <h1>{activity.worksheet.title}</h1>
          <p>Life Skills Worksheet · Grade {activity.grade} · {activity.themeShort.join(" & ")}</p>
        </div>
        <div className="lstw-name-row">
          <div className="lstw-name-field">Name: _____________________________</div>
          <div className="lstw-name-field">Class: __________</div>
          <div className="lstw-name-field">Date: __________</div>
        </div>
        <p style={{ fontSize: "13px", color: "#7A8A7D", marginBottom: "20px", fontStyle: "italic" }}>{activity.worksheet.intro}</p>

        {activity.worksheet.sections.map((sec, si) => (
          <div key={si} className="lstw-section">
            <div className="lstw-section-title">{sec.title}</div>
            {sec.prompts.map((p, pi) => (
              <div key={pi} className="lstw-prompt-block" style={{ marginBottom: "12px" }}>
                {p.label && <div className="lstw-prompt">{p.label}</div>}
                {p.lines > 0 && Array.from({ length: p.lines }).map((_, li) => <div key={li} className="lstw-line" />)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

// ─── ACTIVITY CARD (Upgraded UI) ───────────────────────────────────────────────
function ActivityCard({ activity, displayNumber, isExpanded, onToggle, onPrint, onLogSession }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className={`lst-card ${isExpanded ? "expanded" : ""}`}>
      <div className="lst-card-accent" style={{ background: `linear-gradient(90deg,${activity.color},${activity.color}88)` }} />

      <div className="lst-card-header" onClick={onToggle}>
        <div className="lst-card-num">{displayNumber}</div>
        <div className="lst-card-meta-block">
          <div className="lst-card-title">
            {activity.title}
            <button 
              className={`lst-bookmark-btn ${isSaved ? 'saved' : ''} no-print`} 
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              title={isSaved ? "Remove Bookmark" : "Save Activity"}
            >
              {isSaved ? '★' : '☆'}
            </button>
          </div>

          <div className="lst-analytics-row no-print">
            {activity.rating && (
              <span className="lst-stat-item"><span className="lst-stat-star">★</span> {activity.rating}</span>
            )}
            {activity.usedBy && (
              <span className="lst-stat-item">👥 Used {activity.usedBy} times</span>
            )}
          </div>

          <div className="lst-card-badges">
            {activity.themeShort.map(t => (
               <span key={t} className="lst-badge lst-badge-theme" style={{ background: `${activity.color}18`, color: activity.color }}>{t}</span>
            ))}
            <span className="lst-badge lst-badge-grade">Grade {activity.grade}</span>
            <span className="lst-badge lst-badge-time">{activity.duration}</span>
            {activity.energyLevel && <span className="lst-badge lst-badge-energy">⚡ {activity.energyLevel} Energy</span>}
            {activity.complexity && <span className="lst-badge lst-badge-complex">🧩 {activity.complexity}</span>}
          </div>
          
          <div className="lst-card-obj">{activity.objective}</div>
        </div>
        
        <div className="lst-card-chevron">▶</div>
      </div>

      {isExpanded && (
        <div className="lst-card-body">
          <div className="lst-expanded-grid">
            
            {/* LEFT COLUMN: Core Content */}
            <div className="lst-card-main-content">
              {activity.phases.map((phase, pi) => (
                <div key={pi} className="lst-phase">
                  <div className="lst-phase-header">
                    <span className="lst-phase-name">{phase.phase}</span>
                    <span className="lst-phase-time">{phase.time}</span>
                  </div>
                  {phase.steps.map((s, si) => <Step key={si} s={s} />)}
                </div>
              ))}

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontFamily: "'Fraunces', serif", marginBottom: '12px' }}>Debrief Questions</h4>
                {activity.debrief.map((d, i) => (
                  <div key={i} className="lst-debrief-item">
                    <div className="lst-debrief-q">Q{i + 1}: {d.q}</div>
                    <div className="lst-debrief-note">Facilitator Note: {d.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar Tools */}
            <div className="lst-card-sidebar no-print">
              
              <div className="lst-sidebar-box">
                <div className="lst-sb-title">🎯 Student Outcomes</div>
                {activity.studentOutcomes ? (
                  <ul className="lst-outcome-list">
                    {activity.studentOutcomes.map((out, i) => <li key={i}>{out}</li>)}
                  </ul>
                ) : (
                  <div className="lst-sb-text">Builds core competencies in {activity.themeShort.join(' and ')}.</div>
                )}
              </div>

              <div className="lst-sidebar-box">
                <div className="lst-sb-title">📌 Best Used When</div>
                <div className="lst-sb-text">{activity.bestUsedWhen || "Ideal for standard classroom life skills integration."}</div>
              </div>

              <div className="lst-sidebar-box">
                <div className="lst-sb-title">🛠️ Materials Needed</div>
                <div className="lst-materials" style={{ marginTop: '8px' }}>
                  {activity.materials.map((m, i) => <span key={i} className="lst-material-tag">{m}</span>)}
                </div>
              </div>

              {activity.proTip && (
                <div className="lst-protip">
                  <strong>💡 Pro Tip:</strong><br/>
                  {activity.proTip}
                </div>
              )}

              {activity.watchOutFor && (
                 <div style={{ marginTop: '20px' }}>
                   <div className="lst-sb-title">⚠️ Watch Out For</div>
                   {activity.watchOutFor.map((w, i) => <div key={i} className="lst-watch-item">{w}</div>)}
                 </div>
              )}
            </div>
          </div>

          {/* ACTION FOOTER */}
          <div className="lst-card-actions no-print">
            <button className="lst-action-btn primary" onClick={() => onLogSession(activity)}>
              📝 Log Session Notes
            </button>
            
            {activity.guidePdf ? (
              <a href={activity.guidePdf} download target="_blank" rel="noreferrer" className="lst-action-btn secondary" style={{ textDecoration: "none" }}>
                📄 Download Facilitator Guide
              </a>
            ) : (
              <button className="lst-action-btn secondary" onClick={() => onPrint(activity, "guide")}>
                📄 Print Facilitator Guide
              </button>
            )}

            {activity.worksheetPdf ? (
              <a href={activity.worksheetPdf} download target="_blank" rel="noreferrer" className="lst-action-btn secondary" style={{ textDecoration: "none" }}>
                🖨️ Download Student Handout
              </a>
            ) : (
              <button className="lst-action-btn secondary" onClick={() => onPrint(activity, "worksheet")}>
                🖨️ Print Student Handout
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const GRADE_TABS = [
  { key: "lower",  label: "Lower Secondary", sub: "Grade 5–7" },
  { key: "middle", label: "Middle Secondary", sub: "Grade 8–10" },
  { key: "upper",  label: "Senior Secondary", sub: "Grade 11–12" },
];

export default function LifeSkillsTrainer({ navigate, onBack }) {
  const [activeTab,    setActiveTab]    = useState("lower");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [themeFilter,  setThemeFilter]  = useState("All");
  const [quickFilter,  setQuickFilter]  = useState("All");
  const [expandedId,   setExpandedId]   = useState(null);
  const [printData,    setPrintData]    = useState(null); 
  const [loggingActivity, setLoggingActivity] = useState(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const handlePrint = useCallback((activity, mode) => { setPrintData({ activity, mode }); }, []);
  const closePrint = useCallback(() => { setPrintData(null); }, []);
  const handleToggle = useCallback((id) => { setExpandedId(prev => prev === id ? null : id); }, []);

  // Complex Filtering Logic
  const filtered = useMemo(() => {
    return ACTIVITIES.filter(a => {
      const matchTab = a.gradeKey === activeTab;
      const matchTheme = themeFilter === "All" || a.themeShort.includes(themeFilter);
      
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        a.title.toLowerCase().includes(q) || 
        a.objective.toLowerCase().includes(q) ||
        (a.bestUsedWhen && a.bestUsedWhen.toLowerCase().includes(q));

      let matchQuick = true;
      if (quickFilter === "High Energy") matchQuick = a.energyLevel === "High";
      if (quickFilter === "Low Prep") matchQuick = a.materials.length <= 1;

      return matchTab && matchTheme && matchSearch && matchQuick;
    });
  }, [activeTab, themeFilter, searchQuery, quickFilter]);

  const handleSaveLog = (activityId, logData) => {
    console.log("Saved log for:", activityId, logData);
    // In a real app, this would post to a backend.
  };

  return (
    <>
      {printData && (
        <PrintView activity={printData.activity} mode={printData.mode} onClose={closePrint} />
      )}

      {loggingActivity && (
        <SessionLoggerModal 
          activity={loggingActivity} 
          onClose={() => setLoggingActivity(null)} 
          onSave={handleSaveLog} 
        />
      )}

      <div className="lst-page">
        <div className="lst-topbar">
          <button className="lst-back" onClick={onBack || (() => navigate && navigate("/resources"))}>← Back to Resources</button>
          <div className="lst-topbar-title">Life Skills Trainer — Activity Bank</div>
          <div className="lst-topbar-right">Counsellor Tool</div>
        </div>

        <div className="lst-hero">
          <div className="lst-hero-blob lst-hero-blob-1" />
          <div className="lst-hero-blob lst-hero-blob-2" />
          <div className="lst-hero-inner">
            <div style={{ flex: 1, minWidth: "300px" }}>
              <div className="lst-hero-eyebrow">Counsellor Productivity Suite</div>
              <h1 className="lst-hero-h1">Life Skills Trainer<br /><em>Activity Bank</em></h1>
              <p className="lst-hero-sub">The definitive curriculum for building resilience, emotional intelligence, and critical thinking. Mapped to WHO Core Life Skills. Find the right activity, print the guides, and log your session outcomes.</p>
              <div className="lst-hero-tags">
                <span className="lst-hero-tag">Smart Discoverability</span>
                <span className="lst-hero-tag">Session Logging</span>
                <span className="lst-hero-tag">Printable Handouts</span>
              </div>
            </div>
            <div className="lst-hero-right">
              <div className="lst-stat-card">
                <div className="lst-stat-num">50</div>
                <div className="lst-stat-label">Activities</div>
              </div>
              <div className="lst-stat-card">
                <div className="lst-stat-num">10</div>
                <div className="lst-stat-label">WHO Life Skills</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lst-tabs-wrap">
          <div className="lst-tabs">
            {GRADE_TABS.map(t => (
              <button key={t.key} className={`lst-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => { setActiveTab(t.key); setExpandedId(null); setThemeFilter("All"); setQuickFilter("All"); setSearchQuery(""); }}>
                {t.label}
                <span className="lst-tab-sub">{t.sub} · {ACTIVITIES.filter(a => a.gradeKey === t.key).length} activities</span>
              </button>
            ))}
          </div>
        </div>

        {/* SMART TOOLBAR */}
        <div className="lst-toolbar">
          <div className="lst-toolbar-inner">
            <div className="lst-search-wrap">
              <span className="lst-search-icon">🔍</span>
              <input 
                type="text" 
                className="lst-search-input" 
                placeholder="Search by topic, conflict, or keyword (e.g., anger)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="lst-quick-filters">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ls-muted)', marginRight: '8px', textTransform: 'uppercase' }}>Quick Sort:</span>
              {["All", "High Energy", "Low Prep"].map(qf => (
                <button 
                  key={qf} 
                  className={`lst-qf-btn ${quickFilter === qf ? 'active' : ''}`}
                  onClick={() => setQuickFilter(qf)}
                >
                  {qf === "High Energy" ? "⚡ " : qf === "Low Prep" ? "⏱️ " : ""}{qf}
                </button>
              ))}
            </div>
          </div>

          <div className="lst-toolbar-inner" style={{ paddingTop: '12px', borderTop: '1px dashed var(--ls-border)' }}>
             <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ls-muted)', marginRight: '8px', textTransform: 'uppercase' }}>WHO Skill:</span>
             <div className="lst-filter-row" style={{ flex: 1, overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {ALL_THEMES.map(t => (
                <button key={t} className={`lst-chip ${themeFilter === t ? "active" : ""}`} onClick={() => setThemeFilter(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lst-grid">

          {/* SUGGESTED FLOW BANNER (Decision Support) */}
          {!searchQuery && themeFilter === "All" && activeTab === 'lower' && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--ls-border)', borderLeft: '6px solid var(--ls-amber)', boxShadow: 'var(--ls-shadow-sm)', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ls-amber)', marginBottom: '8px' }}>✨ Suggested Session Flow</div>
              <div style={{ fontSize: '18px', fontFamily: "'Fraunces', serif", fontWeight: 700, color: 'var(--ls-ink)' }}>The "Emotional Reset" Module</div>
              <p style={{ fontSize: '14px', color: 'var(--ls-ink-soft)', marginTop: '8px', maxWidth: '800px' }}>Having trouble with classroom friction? Run this 3-part sequence over three sessions to build emotional vocabulary and empathy.</p>
              <div className="lst-sugg-grid">
                <div className="lst-sugg-card" onClick={() => setExpandedId("l_ce_1")}>
                  <div style={{ fontSize: '11px', color: 'var(--ls-muted)', fontWeight: 700, marginBottom: '4px' }}>Session 1: Baseline</div>
                  <div className="lst-sugg-title">1. The Emotion Thermometer</div>
                </div>
                <div className="lst-sugg-card" onClick={() => setExpandedId("l_sa_1")}>
                  <div style={{ fontSize: '11px', color: 'var(--ls-muted)', fontWeight: 700, marginBottom: '4px' }}>Session 2: Deep Dive</div>
                  <div className="lst-sugg-title">2. The Feelings Iceberg</div>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--ls-muted)" }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: "18px", fontWeight: 700, color: 'var(--ls-ink)' }}>No activities found.</p>
              <p style={{ fontSize: "14px", marginTop: '8px' }}>Try adjusting your search or clearing the filters.</p>
              <button className="lst-action-btn secondary" style={{ margin: '24px auto 0' }} onClick={() => {setSearchQuery(''); setThemeFilter('All'); setQuickFilter('All');}}>Clear Filters</button>
            </div>
          ) : (
            filtered.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                displayNumber={index + 1}
                isExpanded={expandedId === activity.id}
                onToggle={() => handleToggle(activity.id)}
                onPrint={handlePrint}
                onLogSession={setLoggingActivity}
              />
            ))
          )}

        </div>
      </div>
    </>
  );
}
// Combine the rest of the array in Part 2! 
// Export default logic is also in Part 2.
