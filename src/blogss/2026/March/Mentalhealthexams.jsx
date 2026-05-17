import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mental Health Tips for Students During Exams",
  excerpt: "Exam season does not have to mean mental health season. The students who get through exam periods with the least damage to their wellbeing are not the ones who care less — they are the ones with deliberate daily habits that protect their mental health while their academic demands are highest. Learn the habits, understand the science, and build your personalised Exam Week Wellness Plan.",
  category: "Mental Health",
  date: "18-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/mental-health-exams.jpg",
  tldr: "Mental health during exams is not a secondary concern to academic performance — it is the foundation that makes academic performance possible. Students who protect their wellbeing during exam season through specific daily habits consistently outperform those who sacrifice wellbeing for study hours. This guide covers the science, twelve actionable stress reduction habits, five emotional wellness strategies, and an interactive Exam Week Wellness Builder that creates a personalised daily mental health routine for your specific exam situation.",
  toc: [
    { id: "why-mental",    title: "1. Why Mental Health and Exam Performance Are the Same Problem",       level: 3 },
    { id: "habits",        title: "2. Twelve Daily Habits That Protect Mental Health During Exams",       level: 3 },
    { id: "builder",       title: "3. Interactive: The Exam Week Wellness Builder",                       level: 3 },
    { id: "emotional",     title: "4. Five Emotional Wellness Strategies for Exam Season",                level: 3 },
    { id: "warning-signs", title: "5. Warning Signs That Exam Stress Has Become a Mental Health Crisis", level: 3 },
    { id: "faq",           title: "6. Mental Health During Exams FAQs",                                   level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-18T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mental health during exams, mental health tips students exams, exam stress mental health, student mental health exam period, emotional wellness exams, stress reduction exams, exam season wellbeing",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you maintain mental health during exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Maintaining mental health during exams requires four parallel practices: physical foundation habits (consistent sleep, regular meals, and daily movement that keep the body's stress response from becoming chronically activated), cognitive protection habits (structured study with defined endpoints, regular breaks, and an anxiety management technique practised before it is needed), emotional processing habits (daily brief reflection, connection with supportive people, and a shutdown ritual that prevents study anxiety bleeding into all available time), and recovery activities (at least one genuinely restorative non-academic activity per day that is protected and non-negotiable).",
      },
    },
    {
      "@type": "Question",
      "name": "Why does exam season affect mental health so much?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exam season concentrates multiple mental health risk factors simultaneously: elevated chronic stress (which depletes emotional regulation capacity), sleep restriction (which impairs the prefrontal cortex's ability to manage anxiety and emotional reactivity), social isolation (as social activities are cut to create study time, removing the primary stress buffer that connection provides), reduced physical activity (which removes the most effective cortisol reduction mechanism available), and the specific psychological weight of high-stakes assessments where results carry significant implications for self-worth, family relationships, and future prospects.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the best stress reduction habits for students during exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most evidence-backed daily stress reduction habits for students during exams are: protecting 7-8 hours of sleep (the highest-return single mental health intervention available), including 20-30 minutes of physical movement (the most effective cortisol reduction tool without prescription), maintaining at least one genuine social connection per day (the strongest environmental buffer against stress), implementing a hard study cutoff each evening (preventing the chronic cognitive activation that undermines recovery), using a structured breathing technique at the first sign of anxiety onset (before it escalates), and keeping at least one recovery activity per day that has nothing to do with academic performance.",
      },
    },
  ],
};

// ── Wellness Builder Data ──────────────────────────────────────────────────────
const AMBER   = '#C07844';
const APALE   = '#FBF5EE';
const ABORD   = 'rgba(192,120,68,0.22)';

const CURRENT_STATE = [
  {
    key:    'managing',
    icon:   '🟡',
    label:  'Stressed but managing',
    desc:   'Anxious and tired but still functioning — needs strengthening',
  },
  {
    key:    'struggling',
    icon:   '🟠',
    label:  'Struggling significantly',
    desc:   'Sleep, mood, and focus are all affected — needs deliberate support',
  },
  {
    key:    'crisis',
    icon:   '🔴',
    label:  'Overwhelmed — close to breaking point',
    desc:   'Difficult to function — needs urgent attention and possible professional support',
  },
  {
    key:    'okay',
    icon:   '🟢',
    label:  'Doing okay — want to stay this way',
    desc:   'Relatively stable — wants a protective maintenance plan',
  },
];

const BIGGEST_DRAIN = [
  { key: 'sleep',      icon: '😴', label: 'Sleep — lying awake or waking anxious' },
  { key: 'isolation',  icon: '🚪', label: 'Isolation — cut off from people' },
  { key: 'guilt',      icon: '🔄', label: 'Guilt — cannot rest without anxiety' },
  { key: 'overthink',  icon: '🌀', label: 'Overthinking — thoughts spiral constantly' },
  { key: 'physical',   icon: '💗', label: 'Physical — headaches, tension, stomach issues' },
  { key: 'mood',       icon: '😶', label: 'Mood — low, flat, or irritable most of the time' },
];

const AVAILABLE_TIME = [
  { key: 'minimal', label: '5-10 min/day for wellness', value: 7 },
  { key: 'some',    label: '15-20 min/day',              value: 17 },
  { key: 'decent',  label: '30 min/day',                 value: 30 },
  { key: 'plenty',  label: '45+ min/day',                value: 45 },
];

// Wellness routine blocks
const WELLNESS_BLOCKS = {
  morning: {
    icon: '🌅',
    label: 'Morning Foundation (5-10 min)',
    habits: {
      managing: [
        '☀️ No phone for the first 10 minutes — start with light and water instead',
        '😮‍💨 Three physiological sighs before checking anything academic',
        '📋 Write today\'s two most important tasks and one non-academic thing you will do today',
      ],
      struggling: [
        '☀️ No phone for 15 minutes — the first input of the day sets the emotional tone for the hour',
        '🤸 Five minutes of physical movement before sitting down — even stretching counts',
        '📝 Write one honest sentence about how you are feeling. Name it. Then set it down.',
        '📋 Two tasks for today — no more than two. Everything else is bonus.',
      ],
      crisis: [
        '☀️ No academic content before eating and drinking something — minimum 20 minutes',
        '🤸 Walk to the kitchen, make something warm to drink, stand outside for two minutes if possible',
        '📝 Write what you are feeling — fully, for five minutes. Do not study before you have done this.',
        '💬 Text one person before you start studying — even just "good morning"',
      ],
      okay: [
        '☀️ Brief morning phone-free window — 10 minutes — before checking anything',
        '😮‍💨 One round of box breathing (4-4-4-4 × 4) as a gentle daily activation',
        '📋 Daily intention: write one academic goal and one wellness goal for today',
      ],
    },
  },
  study: {
    icon: '📚',
    label: 'During Study — Built-in Wellness',
    habits: {
      managing: [
        '⏱️ Study in bounded sessions (45-90 min) — use a timer, do not study open-endedly',
        '🏃 Physical break between sessions — stand, move, get away from the desk',
        '🅿️ Parking lot notebook — write distracting thoughts, do not suppress them',
      ],
      struggling: [
        '⏱️ Reduce session length to 25-30 minutes — below your current tolerance threshold',
        '🏃 Every break is physical — walking, stretching, anything that uses your body',
        '🛑 One firm "no studying" period mid-afternoon — even 30 minutes of genuine rest',
        '🅿️ Worry parking lot — when anxiety thoughts arise, write them in one sentence and return',
      ],
      crisis: [
        '⏱️ 20-minute maximum sessions today — anything longer is counterproductive right now',
        '🛑 Stop studying at a specific time (write it down now). After that time, no more studying today.',
        '🏃 Every break must include physical movement — your nervous system needs to discharge',
        '🧘 Between every session: three physiological sighs and five seconds of feet-on-floor grounding',
      ],
      okay: [
        '⏱️ Structured sessions with defined endpoints — protect your productivity windows',
        '🏃 Physical movement between major sessions — maintains cognitive performance',
        '🅿️ Keep a simple daily log — one emotion, one progress note — takes 2 minutes',
      ],
    },
  },
  midday: {
    icon: '🌤️',
    label: 'Midday Reset (10-15 min)',
    habits: {
      managing: [
        '🍽️ Proper lunch — sit down, away from the desk, without academic content',
        '☀️ Five minutes outside or at a window — natural light resets the cortisol rhythm',
        '💬 Brief genuine connection — a message, a short call, lunch with someone',
      ],
      struggling: [
        '🍽️ Proper meal — not a snack at the desk — sitting down, no studying',
        '🚶 10-minute walk after lunch — even a slow one. This is non-negotiable today.',
        '📵 Social media off during lunch — use the break for actual rest, not comparison',
        '💬 Reach out to one person — even briefly. Isolation amplifies everything.',
      ],
      crisis: [
        '🍽️ Full meal — today you eat properly, sitting down, not at the desk. This is first priority.',
        '🚶 Walk for 15 minutes after eating. No headphones. No planning. Just walk.',
        '💬 Tell one person how you are actually doing — not the polished version, the honest one',
        '🛑 If you have been crying, panicking, or feeling hopeless — this is the moment to reach out',
      ],
      okay: [
        '🍽️ Proper lunch away from the desk — recovery needs proper fuel',
        '☀️ Brief outdoor exposure — light and air reset the midday energy dip',
        '💬 One genuine social check-in — connection is a daily mental health requirement',
      ],
    },
  },
  evening: {
    icon: '🌙',
    label: 'Evening Wind-Down (15-20 min)',
    habits: {
      managing: [
        '🛑 Hard study cutoff — choose a time and write it in your notebook now',
        '✍️ Two-minute end-of-day note: one thing that went okay, one emotion to release',
        '📵 Phone to another room 30 minutes before bed — start the melatonin window',
        '😴 Same sleep time every night — the anchor is more important than the total hours',
      ],
      struggling: [
        '🛑 Hard study cutoff — write the time here: _____. After this, no academic content.',
        '✍️ Evening brain dump — write everything still in your head in 5 minutes. Then close it.',
        '💆 Progressive muscle relaxation before bed — tense and release from feet to face',
        '😴 4-7-8 breathing lying in the dark (in 4, hold 7, out 8) × 5 rounds before sleep',
        '📵 No screens after your cutoff — the anxiety will still be there tomorrow, sleep will help',
      ],
      crisis: [
        '🛑 Stop studying at your written time — no exceptions, no "just five more minutes"',
        '💬 Tell someone how your day was — genuinely, not a summary. Connection is medicine.',
        '✍️ Write three things that existed today beyond the exam pressure — anything real',
        '💆 Full progressive muscle relaxation before bed — the physical tension is real and releasable',
        '📞 If you are feeling hopeless or unable to cope — please reach out tonight, not tomorrow',
      ],
      okay: [
        '🛑 Study cutoff at a reasonable time — protecting tomorrow\'s capacity starts tonight',
        '✍️ Brief daily reflection — one good thing, one challenge, one intention for tomorrow',
        '📵 30-minute screen-free buffer before bed — protect your melatonin and sleep quality',
        '😴 Consistent sleep schedule — the same wake time is the most powerful sleep anchor',
      ],
    },
  },
  recovery: {
    icon: '🌿',
    label: 'Daily Recovery Activity (10-30 min)',
    habits: {
      managing: [
        '🎯 One activity per day that is purely for you — not productivity, not performance',
        '🎵 Music, creative activity, walking, cooking, reading something non-academic',
        '🚫 No guilt during this time — it is on the schedule. You are following the plan.',
      ],
      struggling: [
        '🎯 One activity per day that has zero to do with exams — protect it like a study session',
        '🌿 It can be tiny: a shower you actually enjoy, five minutes of music, a meal you cooked',
        '🚫 This activity cannot be traded for more study time — that is the whole point of it',
        '❤️ Choose something that made you feel more like yourself — that is your recovery compass',
      ],
      crisis: [
        '🎯 Your recovery activity today is the most important item in your schedule',
        '🌿 What made you feel like yourself before exams consumed everything? Do that for 20 minutes.',
        '🚫 This is not a luxury. This is neurological recovery. Without it, tomorrow will be harder.',
        '💛 If nothing feels possible, choose the smallest version: sit in the sun for five minutes',
      ],
      okay: [
        '🎯 Protect your daily recovery activity from academic pressure especially during peak weeks',
        '🌿 The habit of doing something restorative every day is what prevents okay from becoming struggling',
        '🎵 Let it be genuinely enjoyable — not aspirationally healthy, actually enjoyable',
      ],
    },
  },
};

const DRAIN_HABITS = {
  sleep: {
    title: 'For Sleep Disruption',
    habits: [
      'No academic content in the 60 minutes before bed — the brain needs time to stop processing exam material before sleep',
      '4-7-8 breathing lying down (in 4, hold 7, out 8) × 5 rounds — the strongest single technique for lowering pre-sleep nervous system activation',
      'Write a parking lot of tomorrow\'s worries before bed — externalising them removes the brain\'s need to hold them active overnight',
    ],
  },
  isolation: {
    title: 'For Isolation',
    habits: [
      'Schedule one genuine social interaction per day — even a 10-minute real conversation. Put it in your timetable.',
      'Eat at least one meal per day with another person or while actually talking to someone rather than studying',
      'Tell one person honestly how exam season is going — not the managing-fine version, the honest one',
    ],
  },
  guilt: {
    title: 'For Rest Guilt',
    habits: [
      'Make rest scheduled and written — a rest period on the timetable is not lazy, it is following the plan',
      'Write a daily "done" list alongside the to-do list — seeing what has been completed makes rest feel earned rather than stolen',
      'Set a hard study cutoff time and write it down before each day begins. Stopping at that time is honouring the plan.',
    ],
  },
  overthink: {
    title: 'For Overthinking and Thought Spirals',
    habits: [
      'The worry window: 15 minutes per day of designated worry time. Outside that window, write any worry in one sentence and defer it.',
      '5-4-3-2-1 grounding when spirals start — name sensory anchors in the present moment to interrupt future-projected catastrophising',
      'Physical movement as a thought-interrupter — a 10-minute walk interrupts a spiral more effectively than trying to think your way out of it',
    ],
  },
  physical: {
    title: 'For Physical Stress Symptoms',
    habits: [
      'Daily progressive muscle relaxation (tense and release each muscle group from feet to face) — specifically addresses the chronic tension that exam stress accumulates',
      'Cold water on face and wrists when symptoms spike — activates the diving reflex, directly lowering heart rate within seconds',
      'Eat three proper meals — low blood sugar amplifies every physical anxiety symptom. This is not a nice-to-have.',
    ],
  },
  mood: {
    title: 'For Low Mood During Exams',
    habits: [
      'Daily three-item gratitude or progress note — not aspirationally positive, genuinely specific. One thing that was okay today.',
      'Protect at least one activity per day that you genuinely enjoy — mood follows behaviour; waiting to feel better before doing enjoyable things is the wrong order',
      'If low mood has been persistent for more than two weeks: please talk to someone — a counsellor, a trusted adult, or a professional. This level warrants more than self-help strategies.',
    ],
  },
};

// ── Wellness Builder Component ─────────────────────────────────────────────────
function ExamWellnessBuilder() {
  const [step,       setStep]       = useState(1);
  const [stateKey,   setStateKey]   = useState(null);
  const [drainKey,   setDrainKey]   = useState(null);
  const [timeKey,    setTimeKey]    = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [openBlock,  setOpenBlock]  = useState(null);

  const font      = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selState  = CURRENT_STATE.find(s => s.key === stateKey);
  const selDrain  = BIGGEST_DRAIN.find(d => d.key === drainKey);
  const selTime   = AVAILABLE_TIME.find(t => t.key === timeKey);

  const handleReset = () => { setStep(1); setStateKey(null); setDrainKey(null); setTimeKey(null); setRevealed(false); setOpenBlock(null); };

  const blockKeys = Object.keys(WELLNESS_BLOCKS);

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? AMBER : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — current state */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — How are you doing right now, honestly?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the description that best fits your actual current state — not how you think you should be doing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {CURRENT_STATE.map(s => {
              const isSel = stateKey === s.key;
              return (
                <button key={s.key} onClick={() => setStateKey(s.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? AMBER : 'var(--border)', background: isSel ? APALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${ABORD}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? AMBER : 'var(--ink)', marginBottom: '2px' }}>{s.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (stateKey) setStep(2); }} disabled={!stateKey} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: stateKey ? `linear-gradient(135deg, ${AMBER}, #D4955C)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: stateKey ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: stateKey ? `0 6px 18px ${ABORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — biggest drain */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What is draining your mental health most?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose your primary drain — the one that is costing you the most right now.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {BIGGEST_DRAIN.map(d => {
              const isSel = drainKey === d.key;
              return (
                <button key={d.key} onClick={() => setDrainKey(d.key)} style={{
                  padding: '12px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? AMBER : 'var(--border)', background: isSel ? APALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${ABORD}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{d.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? AMBER : 'var(--ink)' }}>{d.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (drainKey) setStep(3); }} disabled={!drainKey} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: drainKey ? `linear-gradient(135deg, ${AMBER}, #D4955C)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: drainKey ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — available time */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — How much time can you realistically give to wellness habits daily?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest — a five-minute habit you actually do beats a 45-minute plan you do not.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {AVAILABLE_TIME.map(t => {
              const isSel = timeKey === t.key;
              return (
                <button key={t.key} onClick={() => setTimeKey(t.key)} style={{
                  padding: '14px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSel ? AMBER : 'var(--border)', background: isSel ? APALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
                  boxShadow: isSel ? `0 0 0 2px ${ABORD}` : 'none',
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? AMBER : 'var(--ink)' }}>{t.label}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (timeKey) { setStep(4); setRevealed(false); } }} disabled={!timeKey} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: timeKey ? `linear-gradient(135deg, ${AMBER}, #D4955C)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: timeKey ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Wellness Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — Results */}
      {step === 4 && selState && selDrain && selTime && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — Your Exam Week Wellness Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${AMBER}, #D4955C)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${ABORD}`,
              }}>💛 Generate My Wellness Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${AMBER}, #D4955C)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>💛</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  Your Exam Week Wellness Plan
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {selState.label} · Primary drain: {selDrain.label.toLowerCase()} · {selTime.label}
                </div>
              </div>

              {/* State-specific context */}
              {stateKey === 'crisis' && (
                <div style={{ background: '#FEF3C7', border: '2px solid rgba(192,120,0,0.35)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309', marginBottom: '6px' }}>⚠️ A Direct Note</div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400E', lineHeight: 1.7 }}>
                    You are describing a level of overwhelm that is significant. These habits will help — and at this level, please also reach out to someone today. A counsellor, a trusted adult, or a support service. The habits below are important starting points, not complete solutions.
                  </p>
                  <button onClick={() => navigate?.('/safe')} style={{ background: '#B45309', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: font }}>Visit Our Safe Corner →</button>
                </div>
              )}

              {/* Daily routine blocks — expandable */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '9px' }}>
                  📅 Your Daily Wellness Routine — Calibrated to Your State
                </div>
                {blockKeys.map(bk => {
                  const block = WELLNESS_BLOCKS[bk];
                  const isOpen = openBlock === bk;
                  const blockHabits = block.habits[stateKey] || block.habits.managing;
                  return (
                    <div key={bk} style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', overflow: 'hidden', border: `1.5px solid ${ABORD}` }}>
                      <button onClick={() => setOpenBlock(isOpen ? null : bk)} style={{
                        width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left',
                      }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>{block.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: AMBER }}>{block.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{blockHabits.length} habits for your state</div>
                        </div>
                        <span style={{ color: AMBER, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                          {blockHabits.map((habit, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: i < blockHabits.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>{habit.slice(0, 2)}</span>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{habit.slice(2)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Targeted drain habits */}
              <div style={{ background: APALE, border: `2px solid ${ABORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px', borderLeft: `4px solid ${AMBER}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '5px' }}>
                  🎯 {DRAIN_HABITS[drainKey]?.title} — Priority Habits
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--muted)' }}>
                  These three habits specifically address your main mental health drain:
                </p>
                {DRAIN_HABITS[drainKey]?.habits.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '7px 0', borderBottom: i < 2 ? '1px solid rgba(192,120,68,0.15)' : 'none' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `linear-gradient(135deg, ${AMBER}, #D4955C)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{h}</p>
                  </div>
                ))}
              </div>

              {/* Time-calibrated non-negotiables */}
              <div style={{ background: 'white', border: `1.5px solid ${ABORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '7px' }}>
                  ⏱️ With {selTime.label} — Your Three Non-Negotiables
                </div>
                {selTime.value <= 10 ? (
                  <>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--muted)' }}>With minimal time, these three micro-habits produce the highest mental health return per minute:</p>
                    {['😮‍💨 Three physiological sighs when anxiety starts to rise (30 seconds)', '📝 Two-sentence end-of-day note: one thing that went okay, one emotion to name (2 min)', '🛑 One hard cutoff — decide the time now, write it, honour it (0 minutes of extra time, endless extra recovery)'].map((h, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                        <span style={{ fontSize: '14px', flexShrink: 0 }}>{h.slice(0, 2)}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{h.slice(2)}</span>
                      </div>
                    ))}
                  </>
                ) : selTime.value <= 20 ? (
                  <>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--muted)' }}>With 15-20 minutes, you can build the foundation that makes everything else more sustainable:</p>
                    {['🏃 10-minute daily walk — the highest-return physical investment available (10 min)', '✍️ Morning three-sentence entry: feeling, two tasks, one non-academic intention (3 min)', '😴 30-minute screen-free buffer before bed — the melatonin window that protects your sleep (0 study cost)'].map((h, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                        <span style={{ fontSize: '14px', flexShrink: 0 }}>{h.slice(0, 2)}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{h.slice(2)}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--muted)' }}>With 30+ minutes, you can build a complete daily wellness practice:</p>
                    {['🏃 20-30 minute daily movement — the most comprehensive single wellbeing investment', '📝 Morning intention + evening reflection — 5 minutes each for cognitive processing', '💆 Progressive muscle relaxation before bed — 10 minutes of physical tension release', '💬 One genuine social connection per day — scheduled and protected, not ad hoc'].map((h, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                        <span style={{ fontSize: '14px', flexShrink: 0 }}>{h.slice(0, 2)}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{h.slice(2)}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Affirmation */}
              <div style={{ background: APALE, border: `1.5px dashed ${ABORD}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: AMBER, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {stateKey === 'okay'       && '"You are doing well. Protect it deliberately — wellbeing is easier to maintain than to rebuild."'}
                  {stateKey === 'managing'   && '"You are carrying a lot and still moving. These small daily habits are not additions to your load — they are what makes the load sustainable."'}
                  {stateKey === 'struggling' && '"The fact that you are reading this and building a plan means something real. You have not given up on yourself. That matters."'}
                  {stateKey === 'crisis'     && '"Right now is hard. One small thing from this list today is enough. Then tomorrow, one more. You do not have to solve it all tonight."'}
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${ABORD}`, color: AMBER, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MentalHealthExams({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description"        content={meta.excerpt} />
        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image"       content={meta.imgUrl} />
        <meta property="og:type"        content="article" />
        <meta property="twitter:card"   content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      {/* ── Introduction ── */}
      <p>Somewhere in the middle of exam season, many students make an implicit decision: mental health can wait until this is over. The sleep becomes shorter, the breaks become guilty, the social connections become thin, the one enjoyable activity per day gets cancelled first, and the anxiety level that was manageable at the start of the week is acute by Thursday. By exam day, the student is not better prepared than they were at the start of the week. They are significantly more depleted.</p>

      <p><strong>Mental health during exams</strong> is not a secondary concern alongside academic performance. It is the physiological and psychological foundation on which academic performance either stands or collapses. The habits that protect mental health during exam season are not in competition with studying effectively — they are what make studying effective, what make recall accessible in the hall, and what make the month survivable in a way that leaves you functional on the other side.</p>

      <img
        src={meta.imgUrl}
        alt="Student maintaining mental health during exams through daily wellness habits, stress reduction, and emotional wellbeing practices"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-mental">1. Why Mental Health and Exam Performance Are the Same Problem</h3>
      <p>The conventional framing of exam season presents mental health and academic performance as separate concerns that compete for time: time spent on wellbeing is time not spent studying, and the trade-off is in favour of studying until the exams are done. This framing is not only compassionately wrong — it is empirically wrong. The mechanisms through which mental health affects academic performance are direct, documented, and significant.</p>
      <p><strong>Cortisol and memory.</strong> Chronic elevated cortisol — the primary biological marker of sustained psychological stress — directly suppresses hippocampal function. The hippocampus is responsible for both encoding new learning and retrieving stored information during exams. A student who maintains chronically elevated stress across the exam period is studying with reduced encoding capacity and will retrieve with reduced access — both the input and output ends of the learning-to-exam pipeline are impaired simultaneously by the same cortisol elevation that the "grind through it" approach produces.</p>
      <p><strong>Sleep and consolidation.</strong> Every night of inadequate sleep fails to complete the hippocampal memory consolidation that transfers the day's learning into long-term storage. Research by Matthew Walker at UC Berkeley shows a 40% reduction in memory encoding capacity after a single night of poor sleep. Students who sacrifice sleep to study more are not gaining additional study value — they are reducing both the effectiveness of their preparation and the consolidation of everything they have previously studied.</p>
      <p><strong>Anxiety and retrieval.</strong> Exam anxiety — which is significantly worsened by chronically poor mental health practices — produces the specific experience of blanking on known material because acute cortisol suppresses prefrontal retrieval function. The student who sacrifices mental health for study may arrive in the hall knowing 80% of the material but accessing 50% of it through an anxiety-impaired retrieval system — while the student who protected their mental health arrives knowing 70% and accessing 65%.</p>
      <p><strong>Emotional regulation and sustained effort.</strong> The prefrontal cortex is responsible for both complex cognitive tasks (what exams test) and emotional regulation (what exam anxiety requires). Under chronic stress and sleep deprivation, prefrontal capacity is distributed across both demands, with less available for the actual cognitive tasks the exam requires. Emotional regulation practices that reduce the demand on the prefrontal cortex — breathing exercises, physical movement, adequate sleep — free up cognitive capacity for the academic work itself.</p>

      {/* ── Section 2 ── */}
      <h3 id="habits">2. Twelve Daily Habits That Protect Mental Health During Exams</h3>

      <p><strong>1. Sleep is not a reward — it is the foundation.</strong> Eight hours of sleep during exam season is not luxury time. It is the period during which the prefrontal cortex is restored, memory is consolidated, cortisol is regulated, and the emotional processing that prevents mood crashes occurs. This is the single highest-return mental health habit during exam season and the one most commonly sacrificed. Protect it with a hard bedtime that you treat with the same seriousness as an exam itself.</p>

      <p><strong>2. Eat three real meals every day.</strong> Exam season nutrition frequently collapses into caffeine, snacks, and skipped meals — all of which amplify anxiety symptoms, disrupt sleep, and impair cognitive performance. Low blood sugar is a physiological anxiety amplifier: it elevates adrenaline (the body's response to energy shortage) and cortisol, worsening every other exam-season stress symptom. Three regular meals with adequate protein and complex carbohydrates stabilise the blood sugar that stabilises the anxiety.</p>

      <p><strong>3. Move your body every day — even briefly.</strong> Twenty to thirty minutes of physical activity — a brisk walk, any exercise — produces measurable reductions in cortisol, significant increases in mood-regulating neurotransmitters (serotonin, dopamine, endorphins), and elevated BDNF (brain-derived neurotrophic factor) which directly improves learning capacity. This is the most comprehensively evidence-supported mental health intervention available without a prescription. It does not need to be a gym session. It needs to be daily.</p>

      <p><strong>4. Set a hard study cutoff every evening.</strong> Define the time each day — before the day begins — at which studying ends. This single habit has multiple mental health benefits: it creates a legitimate permission structure for rest, prevents the chronic cognitive activation that makes recovery impossible, and trains the brain that the state of "academic emergency" has a defined endpoint rather than running perpetually. Write the time in your planner. Honour it the same way you honour an exam time.</p>

      <p><strong>5. Maintain at least one genuine social connection per day.</strong> Research by John Cacioppo at the University of Chicago shows that loneliness activates the same cortisol pathways as physical threat, and that social connection is the strongest environmental buffer against stress. One real conversation per day — not a group chat update, a genuine exchange with a person who knows you — is not a distraction from exam preparation. It is the stress regulation that makes exam preparation sustainable.</p>

      <p><strong>6. Keep one non-academic activity per day.</strong> Protecting one daily activity that has nothing to do with academic performance — a walk, music, cooking, anything genuinely enjoyable — does two things simultaneously: it provides genuine cognitive rest (which improves subsequent study quality) and it maintains the connection to intrinsic enjoyment and personal identity that chronic academic pressure gradually erodes. This activity is not earned through completing study. It is non-negotiable and scheduled regardless of what has or has not been covered.</p>

      <p><strong>7. Practise a breathing technique before you need it.</strong> The physiological sigh (double inhale, long exhale), box breathing (4-4-4-4), and extended exhale (4 in, 8 out) are all directly evidence-backed for lowering cortisol and restoring prefrontal function. But they are most effective when practised in low-stakes conditions — not just deployed in crisis. Daily practice of one breathing technique during exam season produces better availability under pressure than any technique read about and attempted for the first time in the exam hall.</p>

      <p><strong>8. Use a parking lot notebook for anxiety thoughts.</strong> Keep a small notebook beside your study materials. When an anxiety thought, worry, or intrusive task arises during study, write it in one sentence and return to the work. The act of writing transfers the thought from active working memory (where it competes with studying) to external holding (where it can wait). This reduces the cognitive cost of anxiety intrusion without suppressing the thoughts — which consistently worsens rather than improves intrusive thinking.</p>

      <p><strong>9. Do a two-minute daily reflection each evening.</strong> Before the shutdown ritual: write one thing that went okay today (however small) and one emotion you are carrying from today (named specifically). This two-minute practice does three things: it processes the day's emotional content through affect labelling (which reduces overnight emotional processing demands and improves sleep), it counteracts the negativity bias that makes difficult exam weeks feel entirely without positive moments, and it creates a brief but regular relationship with your own inner state that prevents the accumulation of unnoticed emotional weight.</p>

      <p><strong>10. Limit caffeine strategically.</strong> Caffeine raises baseline cortisol and extends the duration of the stress response — the opposite of what an already-stressed exam student needs more of. If caffeine is part of your routine, avoid increasing consumption during exam season (a common response to fatigue that produces a counterproductive cortisol cycle) and avoid consuming it after 2pm (caffeine's half-life means afternoon consumption is active at bedtime).</p>

      <p><strong>11. Use sunlight as a daily anchor.</strong> Natural light exposure within the first hour of waking resets the circadian rhythm, lowers overnight melatonin, and sets the morning cortisol peak at the appropriate time — which is important for both daytime alertness and evening wind-down. Exam students who study in artificially lit indoor environments from morning to night consistently report worse mood and sleep quality than those who include even brief natural light exposure. Open a window, step outside briefly, or position your study space near natural light.</p>

      <p><strong>12. Build a consistent shutdown ritual.</strong> A specific sequence of actions that signals the end of the academic day — closing the notebook, making a drink, writing tomorrow's two tasks, then physically leaving the study space — trains the nervous system that the state of "academic threat" has a defined endpoint. Without this signal, the exam anxiety state continues indefinitely, even during ostensible rest. The ritual is the permission slip for genuine recovery.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Exam Week Wellness Builder</h3>
      <p>The Wellness Builder creates a personalised daily mental health routine based on how you are actually doing right now, what is most draining your wellbeing, and how much time you can realistically give to wellness habits. The result is a complete five-part daily routine (morning, study, midday, evening, recovery) calibrated to your current state, plus three targeted habits for your specific mental health drain, and your non-negotiable micro-habits for the time you have available.</p>

      <ExamWellnessBuilder />

      {/* ── Section 4 ── */}
      <h3 id="emotional">4. Five Emotional Wellness Strategies for Exam Season</h3>
      <p><strong>1. Name the emotion rather than managing around it.</strong> The most reliable way to prevent an emotion from escalating is to name it specifically. Research by Ethan Kross at the University of Michigan on affect labelling — the practice of naming emotional states in language — shows that this simple act reduces amygdala activation and shifts cognitive processing from the reactive emotional system to the more regulated prefrontal system. "I am afraid that this result will prove I am not capable" is more cognitively manageable than the undifferentiated weight of unnamed exam dread. Name what you are actually feeling. The specificity is the intervention.</p>

      <p><strong>2. Practise self-compassion after setbacks, not self-criticism.</strong> Research by Kristin Neff at the University of Texas on self-compassion in academic contexts shows consistently that students who respond to poor results with self-compassion — acknowledging the difficulty, treating themselves with the kindness they would offer a friend, and recognising the experience as part of a shared human reality rather than unique personal failure — show better subsequent performance, greater motivation, and more resilience than those who respond with self-criticism. The self-critical response feels more serious. The self-compassionate response is more effective. After any setback during exam season, the first question is not "what did I do wrong?" It is "what would I say to someone I love in this exact situation?"</p>

      <p><strong>3. Separate the result from the person.</strong> The most emotionally costly feature of exam season in student life is the conflation of academic results with personal worth — the implicit equation that a good result means you are enough and a bad one means you are not. This equation is both factually incorrect and psychologically devastating. A result measures what you could demonstrate under specific conditions on a specific day. It measures nothing about your worth as a person, your potential for growth, the quality of your relationships, or the validity of your future aspirations. Making this separation explicitly — writing it down, saying it out loud, returning to it whenever the conflation arises — is not toxic positivity. It is an accurate relationship with what results can and cannot tell you.</p>

      <p><strong>4. Use the next-action technique for overwhelm.</strong> When exam-season overwhelm produces the specific paralysis of "there is too much and I cannot start anything," the cognitive response is to try to organise everything — which adds planning load to the already overwhelmed system. The more effective response is the smallest next action: not "plan my revision for three subjects" but "open my chemistry notebook to today's topic." Not the whole mountain — the next step. Action from a place of overwhelm requires commitment to a tiny, specific, time-bounded next step. Everything beyond that can wait until the next tiny step is done.</p>

      <p><strong>5. Schedule worry, do not suppress it.</strong> Attempting to suppress or avoid exam-related worry thoughts — to not think about them — is one of the most consistently counterproductive anxiety management strategies. Research on thought suppression by Daniel Wegner at Harvard (the "white bear" experiments) shows that deliberately trying not to think about something produces paradoxical increases in the frequency of that thought. The effective alternative is structured worry: designate a specific fifteen-minute window each day as the "exam worry time" where all concerns are written out and considered fully. Outside that window, when exam worries arise, note them briefly and defer them to the window. This contains the worry without suppressing it, which makes everything outside the window genuinely more focused.</p>

      {/* ── Section 5 ── */}
      <h3 id="warning-signs">5. Warning Signs That Exam Stress Has Become a Mental Health Crisis</h3>
      <p>Exam stress is normal. Exam distress is common and manageable. But there are specific signs that what a student is experiencing has crossed from manageable stress into a mental health crisis that requires professional support rather than self-management strategies alone. Knowing these signs — in yourself and in people around you — is important.</p>
      <p><strong>Signs that require reaching out today:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.1' }}>
        <li><strong>Hopelessness that persists beyond the immediate exam context</strong> — a general sense that things will not improve, that the future is dark, or that there is no point</li>
        <li><strong>Inability to perform basic self-care</strong> — not eating, not sleeping (not just disrupted sleep but complete inability to sleep), inability to leave the bed or the room</li>
        <li><strong>Persistent crying or emotional numbness</strong> that does not respond to comfort or time and is not specifically linked to a particular academic event</li>
        <li><strong>Thoughts of self-harm or suicide</strong> — please reach out immediately if this is present. You do not have to be "sure" or "serious enough" to deserve support. Reach out now.</li>
        <li><strong>Complete social withdrawal</strong> over multiple days combined with significant functional impairment</li>
        <li><strong>Panic attacks</strong> that are increasing in frequency or severity and not responding to self-management techniques</li>
      </ul>
      <p>If you are experiencing any of these, please reach out to a counsellor, your college's student welfare office, a trusted adult, or a crisis support service. You do not need to justify the severity of your experience before accessing support. Showing up and saying "I am struggling and I need help" is the only threshold.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Mental Health During Exams FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How do I explain to my family that I need mental health support during exams without them thinking I am making excuses?</strong><br />
        A: The most effective framing is functional rather than emotional — not "I am struggling emotionally" (which may be received as weakness or avoiding responsibility) but "I have identified that specific things are making me significantly less effective, and I need support to address them." Be specific about what support you are asking for: "I need one hour per day that is genuinely pressure-free," or "I need the comparison conversations to stop because they are increasing my anxiety to the point where I cannot study effectively." Connecting the request to academic outcomes — "this will help me perform better" — is more likely to produce a supportive response than connecting it only to emotional discomfort.</p>

        <p><strong>Q: I know what I should be doing for my mental health but I cannot make myself do it. What is happening?</strong><br />
        A: The gap between knowing the right habits and doing them under exam pressure is one of the most common and most frustrating experiences in student mental health. It is almost always a motivational state problem rather than a knowledge problem — the habits feel too costly in a state of depletion, and depletion prevents the implementation of the habits that would address the depletion. The way out is the smallest possible version: not "I will do a 30-minute workout" but "I will stand up and walk to the kitchen and back." Not "I will do a proper reflection" but "I will write one sentence about how I feel." The micro-version of each habit builds momentum that gradually makes the fuller version accessible again.</p>

        <p><strong>Q: What should I do if a friend seems to be significantly struggling during exam season?</strong><br />
        A: Ask directly and stay. "I have noticed you seem really overwhelmed — are you okay?" followed by actually listening to the answer rather than immediately offering solutions. The most helpful thing you can offer someone who is struggling is genuine, non-judgemental presence. If they share something concerning — thoughts of self-harm, significant inability to function — encourage them warmly and specifically to access support: "I think talking to someone would really help — would you like me to go with you to the counselling centre?" Do not make the conversation about whether it is serious enough. If it is serious enough for them to share it, it is serious enough to take seriously.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: AMBER, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Caring for yourself during exams is not separate from doing well in them. It is the mechanism by which doing well becomes possible."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Exam season asks a lot. It asks for sustained cognitive effort over a prolonged period under conditions of uncertainty and high stakes. That is a genuinely difficult ask. The students who meet it best are not the ones who demand the most of themselves without limit — they are the ones who build the daily infrastructure that keeps them functional, regulated, and capable of learning right up to the day of the exam. Start with one habit from this guide. Add another next week. The cumulative effect of small consistent investments in your wellbeing is what makes the difference.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: AMBER, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${ABORD}` }}
          >
            Get Support in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: AMBER, border: `2px solid ${AMBER}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access Our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Complete Your Exam Wellbeing Toolkit:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-anxiety-help',            '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/exam-stress-management',       '→ How to Handle Exam Stress Without Panic (Student Guide)'],
            ['/blog/stay-calm-during-exams',       '→ How to Stay Calm and Confident During Exams'],
            ['/blog/quick-stress-relief-students', '→ 5-Minute Stress Relief Techniques for Busy Students'],
            ['/blog/sleep-academic-performance',   '→ How Sleep Affects Academic Performance and Mental Health'],
            ['/blog/academic-burnout-signs',       '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/safe',                              '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
