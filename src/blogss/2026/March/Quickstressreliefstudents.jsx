import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "5-Minute Stress Relief Techniques for Busy Students",
  excerpt: "You do not need an hour of yoga or a meditation retreat to manage stress. You need five minutes and the right technique. This guide covers ten evidence-backed quick stress relief methods for students — with breathing exercises, grounding tools, and an interactive 5-Minute Relief Station that guides you through a timed routine right now.",
  category: "Mental Health",
  date: "07-03-2026",
  readTime: "6 min read",
  wordCount: 1000,
  imgUrl: "/blogss/2026/March/quick-stress-relief-students.jpg",
  tldr: "Quick stress relief for students does not require large amounts of time — it requires the right technique applied at the right moment. This guide gives you ten scientifically grounded five-minute techniques across breathing, grounding, movement, and cognitive categories, with practical student examples for each, and an interactive 5-Minute Relief Station where you select your stress situation and get a fully guided, timed five-minute routine to do right now.",
  toc: [
    { id: "why-five",     title: "1. Why Five Minutes Is Enough (The Neuroscience)",                  level: 3 },
    { id: "ten-techniques",title: "2. Ten 5-Minute Stress Relief Techniques (Numbered List)",         level: 3 },
    { id: "station",      title: "3. Interactive: The 5-Minute Relief Station",                       level: 3 },
    { id: "when-to-use",  title: "4. When to Use Each Technique — Student Scenarios",                 level: 3 },
    { id: "build-habit",  title: "5. How to Make Quick Relief a Habit, Not Just an Emergency Tool",   level: 3 },
    { id: "faq",          title: "6. Quick Stress Relief FAQs",                                       level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-07T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "quick stress relief for students, 5 minute stress relief, stress relief techniques students, fast stress relief, breathing exercises students, grounding exercises, student stress management quick tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the fastest stress relief techniques for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest evidence-backed stress relief techniques for students include: the physiological sigh (double inhale through the nose followed by a long exhale — effective within 30 seconds), the 5-4-3-2-1 grounding exercise (naming sensory anchors in the present moment — effective within 60-90 seconds), cold water on the face or wrists (activating the diving reflex to lower heart rate within seconds), and box breathing (4-4-4-4 breath ratio — effective within 2-3 minutes). All are deployable without equipment, without privacy, and without prior experience.",
      },
    },
    {
      "@type": "Question",
      "name": "Do quick stress relief techniques actually work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — with an important distinction. Quick techniques provide genuine, measurable relief from acute stress by directly activating the parasympathetic nervous system, lowering cortisol, and restoring prefrontal cortex function. They are not replacements for the structural stress management that prevents chronic stress from accumulating. Think of them as rescue tools rather than prevention tools — most effective when deployed at the earliest sign of stress rather than waited until acute panic.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I use stress relief techniques during an exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — several techniques are specifically designed for in-exam use. The physiological sigh can be done silently and invisibly in any seat. Box breathing requires no visible movement and can be done with eyes open. The 5-4-3-2-1 grounding exercise can be done internally without any external movement. Shoulder drop and jaw release (consciously releasing the two areas where exam tension concentrates) can be done in seconds. The key is practising these techniques outside exam conditions first, so they are available automatically when needed.",
      },
    },
  ],
};

// ── Station Data ────────────────────────────────────────────────────────────────
const ROSE    = '#B54070';
const RPALE   = '#F8EEF3';
const RBORDER = 'rgba(181,64,112,0.22)';

const STRESS_MOMENTS = [
  { key: 'pre_exam',     icon: '📝', label: 'Just before an exam or presentation',        desc: 'Heart pounding, mind racing, body tense' },
  { key: 'overwhelmed',  icon: '🗂️', label: 'Overwhelmed by the amount of work',          desc: 'Everything feels too much, cannot start anything' },
  { key: 'mid_work',     icon: '⏱️', label: 'Stuck mid-study — frustrated and blocked',  desc: 'One topic is not clicking, focus has collapsed' },
  { key: 'social',       icon: '😰', label: 'After a difficult social interaction',       desc: 'Replaying a conversation, feeling judged or anxious' },
  { key: 'night',        icon: '🌙', label: 'Lying awake at night — mind will not stop',  desc: 'Cannot sleep, thoughts spiralling' },
  { key: 'anger',        icon: '🔥', label: 'Angry or frustrated and need to reset',      desc: 'Short fuse activated — need to come down before reacting' },
];

// Each routine has exactly 5 steps that total ~300 seconds (5 minutes)
const ROUTINES = {
  pre_exam: {
    title: 'Pre-Exam Calm',
    intro: 'Five minutes before you go in. You will use every second of this.',
    color: '#C0392B',
    steps: [
      { name: 'Physiological Sigh × 3', seconds: 45,  icon: '😮‍💨', instruction: 'Two sharp inhales through the nose (fill the lungs completely), then one long slow exhale through the mouth. Do this three times. Your heart rate will drop noticeably.' },
      { name: 'Body Scan Release',       seconds: 60,  icon: '💆', instruction: 'Starting from your jaw — unclench. Drop your shoulders. Unclench your hands. Release your stomach. Do this slowly, from head to toe. Tension you did not know you were holding will release.' },
      { name: '5-4-3-2-1 Ground',        seconds: 90,  icon: '👁️', instruction: 'Name 5 things you can see. 4 things you can feel. 3 things you can hear. 2 things you can smell. 1 thing you can taste. Take your time with each — be specific.' },
      { name: 'Competence Recall',        seconds: 45,  icon: '🧠', instruction: 'Think of one specific thing you definitely know for this exam. Not your biggest worry — one solid thing you are confident in. Let that be the last thought before the exam begins.' },
      { name: 'The Readiness Statement', seconds: 60,  icon: '✊', instruction: 'Say silently or quietly: "I have prepared. I am ready. My body is preparing me. This feeling is energy, not fear." Say it three times and mean at least some of it.' },
    ],
  },
  overwhelmed: {
    title: 'Overwhelm Reset',
    intro: 'When everything feels like too much, this brings you back to one thing at a time.',
    color: '#1565C0',
    steps: [
      { name: 'Box Breathing × 4',       seconds: 70,  icon: '📦', instruction: 'In for 4 counts. Hold for 4 counts. Out for 4 counts. Hold for 4 counts. That is one round — do four. This activates your parasympathetic system and pauses the overwhelm spiral.' },
      { name: 'Brain Dump',               seconds: 90,  icon: '📝', instruction: 'Write every task, worry, and thought in your head onto paper — no order, no filtering. Everything out of your head and onto the page. The overwhelm is a working memory problem — this fixes it instantly.' },
      { name: 'The One-Thing Select',     seconds: 45,  icon: '🎯', instruction: 'Look at what you wrote. Circle the single most important task. Just one. Everything else can wait. Your job now is only that circled item.' },
      { name: 'Two-Minute Commitment',    seconds: 30,  icon: '⏰', instruction: 'Say: "I will work on [your circled task] for two minutes only." Not more. Just two minutes. Starting is the hardest part — two minutes defeats the freeze.' },
      { name: 'Reset Breath',             seconds: 65,  icon: '🌬️', instruction: 'Four counts in. Eight counts out. Three times. You are now in a calmer physiological state. Start the two-minute task the moment this step ends.' },
    ],
  },
  mid_work: {
    title: 'Focus Restore',
    intro: 'When your brain stops cooperating mid-session — reset it in five minutes.',
    color: '#2D6A8F',
    steps: [
      { name: 'Stand and Shake',          seconds: 30,  icon: '🤸', instruction: 'Stand up. Shake your hands and arms for 30 seconds — genuinely, like you are trying to shake water off. This physically discharges the tension that builds during stuck studying and resets your nervous system state.' },
      { name: 'Cold Water Reset',         seconds: 30,  icon: '💧', instruction: 'Run cold water over your wrists or splash it on your face. The cold activates the diving reflex — a mammalian survival response that directly lowers heart rate and resets alertness. Dry off and return.' },
      { name: 'Extended Exhale × 5',      seconds: 60,  icon: '🌊', instruction: 'In for 4 counts, out for 8 counts. Five rounds. Your cortisol will drop measurably. By the end, your head will be clearer than it was before the break.' },
      { name: 'The Tiny Step',            seconds: 60,  icon: '🔍', instruction: 'Name the absolute smallest sub-step of what you are stuck on. Not "understand this chapter" — "read the first paragraph of page 47." Just that one thing. Microscopic specificity defeats the block.' },
      { name: 'Two-Minute Write',         seconds: 120, icon: '✍️', instruction: 'Set a timer for 2 minutes and write everything you already know about the stuck topic — without checking notes. Active recall of even partial knowledge rebuilds the neural pathway and makes new learning easier.' },
    ],
  },
  social: {
    title: 'Social Reset',
    intro: 'After a difficult conversation or a moment that is replaying in your head.',
    color: '#6B3D8F',
    steps: [
      { name: 'Name It',                  seconds: 30,  icon: '🏷️', instruction: 'Say the emotion out loud or write it down: "I feel [embarrassed / anxious / hurt / angry]." Naming the emotion directly reduces amygdala activation — this is called "affect labelling" and it is one of the fastest emotional regulation tools available.' },
      { name: 'Breathing Reset',          seconds: 60,  icon: '🌬️', instruction: 'Extended exhale breathing: 4 counts in, 6 counts out. Five rounds. This physiologically interrupts the social anxiety response, which kept you in a mild threat state since the interaction.' },
      { name: 'Reality Check',            seconds: 60,  icon: '🔭', instruction: 'Write: "The story I am telling myself is: [the catastrophic version]." Then write: "What actually happened was: [the factual version]." Most post-social anxiety is about the story, not the event.' },
      { name: 'Perspective Prompt',       seconds: 60,  icon: '⏳', instruction: 'Ask yourself: "Will this matter in one week?" Usually the honest answer is no. If the answer is yes, ask: "What one action could I take that would help?" Write it down. Now it is a plan, not just an anxiety.' },
      { name: 'Return Statement',         seconds: 90,  icon: '🌱', instruction: 'Say or write: "That was uncomfortable. I handled it as best I could. I am choosing to return my attention to the present now." Then do one small action — make a drink, open a book — that physically moves you forward.' },
    ],
  },
  night: {
    title: 'Night Wind-Down',
    intro: 'When the lights are off but the thoughts will not stop.',
    color: '#1D4A7A',
    steps: [
      { name: '4-7-8 Breathing × 4',    seconds: 80,  icon: '✨', instruction: 'In for 4, hold for 7, out for 8. Four rounds. This is the strongest single breath technique for lowering nervous system activation. Do it lying down, in the dark. Your heart rate will drop noticeably.' },
      { name: 'Body Progressively Relax', seconds: 90,  icon: '🌙', instruction: 'Starting from your feet — tense each muscle group for 5 seconds, then release. Feet, calves, thighs, stomach, hands, arms, shoulders, face. The tense-release cycle fully relaxes muscles that stress has kept contracted.' },
      { name: 'The Worry Defer',          seconds: 30,  icon: '📋', instruction: 'If a specific worry is active: mentally say "I acknowledge this worry. It cannot be solved right now. I will deal with it tomorrow at [specific time]." The commitment to address it removes the urgency that keeps it active tonight.' },
      { name: 'Gratitude Anchor',         seconds: 45,  icon: '💛', instruction: 'Name three specific things from today that were okay, good, or even just neutral. Not big things — small genuine ones. A meal you liked. A message that arrived. One question you answered correctly. The specificity is what makes this calming rather than performative.' },
      { name: 'Slow Body Scan',           seconds: 55,  icon: '😴', instruction: 'Close your eyes. Notice the feeling of the mattress under your body. The temperature of the air. The sounds in the room. Stay with each physical sensation for several breaths before moving to the next. You are training your attention to stay in the present physical body rather than the anxious mental future.' },
    ],
  },
  anger: {
    title: 'Anger Release',
    intro: 'When the fuse is lit — before you say or do something you regret.',
    color: '#A62020',
    steps: [
      { name: 'Physical Discharge',      seconds: 45,  icon: '💪', instruction: 'Clench your fists as hard as you can for 10 seconds, then release fully. Do this three times. The anger response produces physical tension — this uses and releases it through the hands rather than through your words or actions.' },
      { name: 'Cooling Breath',          seconds: 60,  icon: '❄️', instruction: 'Breathe in through pursed lips (as if sipping through a straw) for 4 counts — this is the yogic Sitali breath and produces a direct cooling effect physiologically. Out through the nose for 6 counts. Six rounds.' },
      { name: 'Name the Underneath',     seconds: 60,  icon: '🏷️', instruction: 'Anger is almost always a secondary emotion sitting on top of a primary one — hurt, fear, disappointment, or feeling unheard. Write: "Underneath the anger, what I am actually feeling is [honest answer]." The primary emotion is easier to communicate than the anger.' },
      { name: 'The Pause Decision',      seconds: 45,  icon: '⏸️', instruction: 'Ask: "Do I need to respond to this right now?" Almost always the honest answer is no. Decide: "I will respond to this in [specific time — 1 hour, tomorrow morning]." The decision to pause is itself activating and satisfying to the angry mind.' },
      { name: 'Reset Breath',            seconds: 90,  icon: '🌬️', instruction: 'Box breathing: in for 4, hold for 4, out for 4, hold for 4. Six full rounds. By the end, your cortisol and adrenaline will have dropped enough that the response you make will be chosen rather than reactive.' },
    ],
  },
};

// ── Relief Station Component ────────────────────────────────────────────────────
function ReliefStation() {
  const [moment,       setMoment]       = useState(null);
  const [started,      setStarted]      = useState(false);
  const [stepIndex,    setStepIndex]    = useState(0);
  const [secondsLeft,  setSecondsLeft]  = useState(0);
  const [isRunning,    setIsRunning]    = useState(false);
  const [stepDone,     setStepDone]     = useState(false);
  const [routineDone,  setRoutineDone]  = useState(false);
  const intervalRef    = useRef(null);
  const font           = "'Plus Jakarta Sans', system-ui, sans-serif";

  const routine   = moment ? ROUTINES[moment] : null;
  const step      = routine ? routine.steps[stepIndex] : null;
  const totalSteps = routine ? routine.steps.length : 0;
  const totalTime  = routine ? routine.steps.reduce((t, s) => t + s.seconds, 0) : 0;
  const elapsed    = routine ? routine.steps.slice(0, stepIndex).reduce((t, s) => t + s.seconds, 0) + (step ? step.seconds - secondsLeft : 0) : 0;
  const overallPct = totalTime > 0 ? Math.round((elapsed / totalTime) * 100) : 0;

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setStepDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, stepIndex]);

  const startStep = () => {
    if (!step) return;
    setSecondsLeft(step.seconds);
    setStepDone(false);
    setIsRunning(true);
  };

  const pauseStep = () => { setIsRunning(false); clearInterval(intervalRef.current); };
  const resumeStep = () => { setIsRunning(true); };

  const nextStep = () => {
    clearInterval(intervalRef.current);
    const next = stepIndex + 1;
    if (next >= totalSteps) {
      setRoutineDone(true);
      return;
    }
    setStepIndex(next);
    setSecondsLeft(routine.steps[next].seconds);
    setStepDone(false);
    setIsRunning(true);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setMoment(null); setStarted(false); setStepIndex(0);
    setSecondsLeft(0); setIsRunning(false); setStepDone(false); setRoutineDone(false);
  };

  const handleStart = () => {
    setStarted(true); setStepIndex(0);
    setSecondsLeft(routine.steps[0].seconds);
    setStepDone(false); setIsRunning(true); setRoutineDone(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const stepColor  = step && routine ? routine.color : ROSE;

  if (routineDone && routine) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          <div style={{ background: `linear-gradient(135deg, ${routine.color}, ${routine.color}CC)`, borderRadius: '14px', padding: '28px 22px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              5 Minutes Complete
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto' }}>
              You have just activated your parasympathetic nervous system, lowered your cortisol, and restored prefrontal access. You are genuinely calmer than you were five minutes ago.
            </div>
          </div>
          <div style={{ background: 'white', border: `1.5px solid ${RBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: ROSE, fontStyle: 'italic', lineHeight: 1.55 }}>
              "Five minutes taken deliberately is worth more than an hour spent waiting to feel better."
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleReset} style={{ flex: 1, padding: '13px', borderRadius: '10px', border: `1.5px solid ${RBORDER}`, background: 'transparent', color: ROSE, fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Try a different routine</button>
            <button onClick={handleStart} style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${routine.color}, ${routine.color}CC)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Repeat this routine</button>
          </div>
        </div>
      </div>
    );
  }

  if (started && routine && step) {
    const circumference = 2 * Math.PI * 40;
    const dashOffset = circumference * (secondsLeft / step.seconds);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

        {/* Overall progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>{routine.title} — Step {stepIndex + 1} of {totalSteps}</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: stepColor }}>{overallPct}% done</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(181,64,112,0.12)', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${overallPct}%`, background: `linear-gradient(90deg, ${stepColor}, ${stepColor}CC)`, borderRadius: '5px', transition: 'width 0.5s ease' }} />
          </div>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '8px', justifyContent: 'center' }}>
            {routine.steps.map((_, i) => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < stepIndex ? stepColor : i === stepIndex ? `${stepColor}80` : 'var(--border)', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>

        {/* Step card */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '22px', marginBottom: '14px', border: `2px solid ${stepColor}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '28px' }}>{step.icon}</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: stepColor }}>{step.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{formatTime(step.seconds)} total</div>
            </div>
          </div>
          <p style={{ margin: '0 0 18px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75 }}>{step.instruction}</p>

          {/* Circular timer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke={`${stepColor}15`} strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={stepColor} strokeWidth="8"
                  strokeDasharray={circumference} strokeDashoffset={isRunning || stepDone ? dashOffset : 0}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: stepDone ? '28px' : '24px', fontWeight: '700', color: stepColor, fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
                  {stepDone ? '✓' : formatTime(secondsLeft)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isRunning && !stepDone ? (
                <button onClick={resumeStep} style={{ padding: '11px 24px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${stepColor}, ${stepColor}CC)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
              ) : isRunning ? (
                <button onClick={pauseStep} style={{ padding: '11px 24px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
              ) : (
                <button onClick={nextStep} style={{ padding: '11px 28px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${stepColor}, ${stepColor}CC)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
                  {stepIndex + 1 >= totalSteps ? '✓ Finish' : 'Next Step →'}
                </button>
              )}
              <button onClick={handleReset} style={{ padding: '11px 16px', borderRadius: '50px', border: `1.5px solid ${RBORDER}`, background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>✕ Exit</button>
            </div>
          </div>
        </div>

        {/* Upcoming steps */}
        {stepIndex < totalSteps - 1 && (
          <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '11px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>Coming up</div>
            {routine.steps.slice(stepIndex + 1, stepIndex + 3).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', opacity: 0.65 }}>
                <span style={{ fontSize: '16px' }}>{s.icon}</span>
                <span style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>{s.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700' }}>{formatTime(s.seconds)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Selection screen
  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        What is your stress situation right now?
      </p>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Choose your situation and get a fully guided, timed 5-minute routine built specifically for it. Each step has a timer — just follow along.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {STRESS_MOMENTS.map(m => {
          const isSel = moment === m.key;
          return (
            <button key={m.key} onClick={() => setMoment(m.key)} style={{
              padding: '13px 16px', borderRadius: '12px', border: '2px solid',
              borderColor: isSel ? ROSE : 'var(--border)', background: isSel ? RPALE : 'white',
              cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              boxShadow: isSel ? `0 0 0 3px ${RBORDER}` : 'var(--shadow-sm)',
            }}>
              <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '600', color: isSel ? ROSE : 'var(--ink)', marginBottom: '2px' }}>{m.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{m.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
      {moment && routine && (
        <div style={{ background: 'white', border: `2px solid ${routine.color}40`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: routine.color, marginBottom: '6px' }}>{routine.icon || '🧘'} {routine.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{routine.intro}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {routine.steps.map((s, i) => (
              <div key={i} style={{ fontSize: '11px', fontWeight: '700', background: `${routine.color}15`, color: routine.color, padding: '3px 9px', borderRadius: '20px' }}>
                {s.icon} {s.name.split(' ').slice(0, 2).join(' ')} ({formatTime(s.seconds)})
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleStart} disabled={!moment} style={{
        width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
        background: moment ? `linear-gradient(135deg, ${ROSE}, #D4609A)` : 'var(--border)',
        color: 'white', fontWeight: '700', fontSize: '15px',
        cursor: moment ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
        boxShadow: moment ? `0 6px 20px ${RBORDER}` : 'none',
      }}>
        {moment ? `▶ Start My 5-Minute Routine` : 'Choose your situation above to begin'}
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function QuickStressReliefStudents({ navigate, relatedPosts }) {
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
      <p>Most stress management advice sounds like it was written for people with unlimited time and a meditation room. Forty-five minutes of yoga. A long walk in nature. A full mindfulness session before bed. None of this is available to a student sitting in a library five minutes before an exam or lying awake at midnight with tomorrow's assignment unsent.</p>

      <p><strong>Quick stress relief for students</strong> is not a compromise version of the real thing. Five minutes of the right technique, applied at the right moment, produces measurable physiological changes — lower cortisol, reduced heart rate, restored prefrontal access — that make the next hour genuinely more manageable. The key is knowing which technique works for which situation, and having practised it enough that it is actually available when you need it.</p>

      <img
        src={meta.imgUrl}
        alt="Student using quick 5-minute stress relief techniques — breathing exercises, grounding, and calming strategies for busy students"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-five">1. Why Five Minutes Is Enough (The Neuroscience)</h3>
      <p>The stress response is fast — adrenaline and cortisol can be released within seconds of a perceived threat. But the recovery from stress is also faster than most people realise. Research by Andrew Huberman at Stanford on the neuroscience of breathing shows that even a single physiological sigh (double inhale through the nose followed by a long exhale) can lower heart rate within thirty seconds. Box breathing produces measurable parasympathetic activation within two minutes. The 5-4-3-2-1 grounding exercise interrupts a catastrophic thought spiral in under ninety seconds.</p>
      <p>The mechanism in all of these is the same: they directly activate the parasympathetic nervous system (the "rest and digest" system that counteracts fight-or-flight) through one of the few voluntary levers available — breath control, sensory anchoring, or muscle engagement and release. The parasympathetic activation produced by five minutes of deliberate technique is not a faint, temporary effect. Research shows measurable reductions in cortisol that persist for up to thirty minutes after a brief regulation exercise.</p>
      <p>The other mechanism is cortical re-engagement. High stress suppresses the prefrontal cortex — the region responsible for reasoning, memory retrieval, and focused attention. Five minutes of stress regulation activity (breathing, grounding, movement) lowers the cortisol that was suppressing prefrontal function and allows the brain's higher-order capacities to come back online. This is why students who take a five-minute break after blanking on an exam question often find the answer becomes accessible — the break is not wasting time, it is restoring the retrieval capacity the stress had blocked.</p>

      {/* ── Section 2 ── */}
      <h3 id="ten-techniques">2. Ten 5-Minute Stress Relief Techniques (Numbered List)</h3>

      <p><strong>1. The Physiological Sigh.</strong> Double inhale through the nose (a full inhale, then a second short sharp inhale to fully inflate the lungs), followed by one long slow exhale through the mouth. Do this three to five times. This is the body's own built-in emergency reset — it re-inflates alveoli that collapse under stress and produces the largest single-breath CO2 removal possible. Stanford research shows this works within 30 seconds — faster than any other breathing technique. <em>Practical example: Priya uses this while sitting in the exam hall waiting for papers to be distributed. Done with eyes forward, it is completely invisible to everyone around her.</em></p>

      <p><strong>2. Box Breathing (4-4-4-4).</strong> Breathe in for four counts, hold for four, breathe out for four, hold for four. One round takes sixteen seconds. Four rounds produce a full physiological reset. Used by military personnel and surgeons in high-stress situations because it maintains alertness while reducing the threat response. <em>Practical example: Rohan does four rounds of box breathing in the ten minutes before presenting his project. He arrives at the front of the room noticeably calmer than he left his seat.</em></p>

      <p><strong>3. Extended Exhale Breathing (4-8).</strong> Breathe in for four counts, breathe out for eight counts. The doubled exhale-to-inhale ratio is the single most effective breathing manipulation for acute cortisol reduction. It works because the extended exhale maximally activates the vagus nerve, which directly signals the heart rate to slow. <em>Practical example: Ananya does this lying in bed when she cannot sleep before exam day. Five rounds and her heart rate has dropped enough for drowsiness to begin.</em></p>

      <p><strong>4. The 5-4-3-2-1 Grounding Exercise.</strong> Name five things you can see, four things you can physically feel, three things you can hear, two things you can smell, one thing you can taste. This multi-sensory present-moment anchoring floods the prefrontal cortex with current sensory data, interrupting the future-projected catastrophic thinking that sustains anxiety spirals. <em>Practical example: Vikram uses this mid-panic after reading a difficult question on his internal exam. He does it silently and with eyes on the page — from the outside, he just looks like he is thinking.</em></p>

      <p><strong>5. Cold Water Reset.</strong> Run cold water over your wrists or splash it on your face for thirty seconds. The cold activates the mammalian diving reflex — a survival response that automatically and immediately lowers heart rate. No technique required, no concentration needed, just thirty seconds of cold water. <em>Practical example: Sneha goes to the bathroom ten minutes before a college viva, splashes her face with cold water for thirty seconds, dries off, and walks in with a measurably lower heart rate.</em></p>

      <p><strong>6. The Brain Dump.</strong> Open a blank page and write every task, worry, and thought in your head without editing for three to five minutes. No order, no filtering — just everything out of your head and onto paper. This externalises the cognitive load from active working memory (where it produces anxiety) to external storage (where it simply waits). <em>Practical example: Arjun feels paralysed looking at his to-do list. He dumps everything onto paper — twelve things, written in five minutes. The overwhelm dissolves because the tasks are now finite, on paper, not in his head.</em></p>

      <p><strong>7. Stand, Shake, Move.</strong> Stand up, shake your hands and arms vigorously for thirty seconds, then do thirty seconds of rapid walking in place or stair climbing. The stress response produces adrenaline designed to fuel physical action — this technique uses it for its intended biological purpose rather than leaving it internally amplifying. <em>Practical example: Meera is at her desk and can feel the anxiety building. She stands, shakes her arms for thirty seconds in her room (looking slightly ridiculous), walks briskly to the kitchen and back. She returns to her desk with the adrenaline used and the nervous system reset.</em></p>

      <p><strong>8. Progressive Muscle Release.</strong> Tense one muscle group as hard as possible for five seconds, then release fully. Work through: hands, arms, shoulders, face, stomach, legs. The deliberate tense-release cycle fully relaxes muscles that stress keeps in chronic partial contraction, producing physical relaxation that the body then generalises to nervous system relaxation. <em>Practical example: Preethi is in her room the night before a board exam. She does five minutes of progressive muscle release lying on her bed. By the time she reaches her feet, her shoulders have dropped noticeably and she feels heavy rather than wired.</em></p>

      <p><strong>9. The Three-Sentence Journal.</strong> Write three sentences: one thing that happened today, one emotion you are carrying, and one thing that is actually okay right now. Not a full journal entry — three sentences. This brief naming and contextualisation exercise simultaneously processes emotion (reducing its intensity through affect labelling), provides perspective (the "one thing that is okay" counteracts the negativity bias), and creates a sense of closure for the day. <em>Practical example: Rahul does this every evening before closing his books. It takes less than three minutes and consistently leaves him feeling less unresolved than when he started.</em></p>

      <p><strong>10. The Competence Inventory.</strong> Write three things you have done well, learned, or managed today — not big achievements, small genuine ones. This technique counteracts the brain's negativity bias, which automatically attends to failures while discounting progress. Stress is amplified when the brain's evidence of capability is suppressed. A brief competence inventory restores the balance between awareness of difficulty and awareness of capacity. <em>Practical example: Ishaan feels like he has had a terrible study day. He writes three specific things he did manage — one concept he clarified, a practice problem he completed correctly, a break he actually took. The day looks different than it did before he wrote.</em></p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="station">3. Interactive: The 5-Minute Relief Station</h3>
      <p>Reading about techniques builds awareness. Doing them builds the neural pathways that make them available automatically under stress. The Relief Station guides you through a fully timed, step-by-step five-minute routine matched to your current stress situation. Each step has instructions and a countdown timer — just follow along. You can pause, resume, and skip to the next step at any time.</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '4px' }}>Use this now if you are stressed, or practise it in a low-stress state — every time you run through a routine, it becomes more automatically available when you genuinely need it.</p>

      <ReliefStation />

      {/* ── Section 4 ── */}
      <h3 id="when-to-use">4. When to Use Each Technique — Student Scenarios</h3>
      <p><strong>Before an exam or presentation:</strong> Physiological sigh (fastest reset), body scan tension release (removes physical manifestations of anxiety), 5-4-3-2-1 grounding (interrupts catastrophic thinking and anchors to the present). Avoid extended exhale or 4-7-8 breathing immediately before entering — their sedative effect can reduce alertness below the optimal exam state.</p>
      <p><strong>When overwhelmed by workload:</strong> Brain dump (externalises the cognitive overload), the one-thing selection (narrows impossible demand to manageable action), and box breathing (physiological support for the cognitive reset). The brain dump is specifically the most useful technique for overwhelm because it addresses the actual mechanism — working memory overload — rather than just the emotional response to it.</p>
      <p><strong>Mid-study block, when concentration has collapsed:</strong> Stand-and-shake or cold water reset (physical interrupts that restore alertness), extended exhale breathing (lowers cortisol without inducing drowsiness), followed immediately by the two-minute active recall exercise (rebuilds the neural pathway for the stuck topic through retrieval rather than re-reading).</p>
      <p><strong>After a difficult social interaction or confrontation:</strong> Affect labelling — naming the emotion specifically — first (reduces amygdala activation fastest), then cooling breath or box breathing (physiological regulation), then the reality-check journal (separates the factual event from the catastrophic narrative).</p>
      <p><strong>At night when thoughts will not stop:</strong> 4-7-8 breathing (strongest sedative breath technique), progressive muscle release (fully relaxes the physical tension that perpetuates wakefulness), and the worry deferral (removes the urgency of the circling thoughts by committing to address them at a specific time tomorrow).</p>

      {/* ── Section 5 ── */}
      <h3 id="build-habit">5. How to Make Quick Relief a Habit, Not Just an Emergency Tool</h3>
      <p>The most common failure mode of quick stress relief is using it only as an emergency intervention — reaching for it when the stress has already become acute and the technique has never been practised. The physiological sigh that was described in a blog but never practised is far less effective in a real exam hall than the same technique practised daily for two weeks. The neural pathway for a stress regulation response is built through repetition in low-stress conditions, not through reading about it once and deploying it in crisis.</p>
      <p><strong>The daily practitioner model.</strong> Choose one technique from this guide — ideally the one that matches your most common stress situation — and practise it daily for two weeks, at the same time each day, regardless of your current stress level. The goal is not to manage existing stress. It is to install the neural pattern that will fire automatically when stress arrives. After two weeks, most people find the technique activates without significant conscious effort — the practice has made it automatic.</p>
      <p><strong>The transition anchor.</strong> Attach a brief stress regulation practice to an existing transition in your day — the moment you sit down to study, the moment you take a break, or the moment you close your books for the day. Transitions are the most effective habit anchors because they already involve a change of state that the brain is attending to. Adding a thirty-second breathing exercise to an existing transition costs almost no additional time and produces consistent daily practice.</p>
      <p><strong>The pre-committed rescue plan.</strong> Before each high-stakes event (exam, presentation, difficult conversation), decide specifically which technique you will use at the first sign of acute stress — not in the moment, before. Write it down: "If I start to panic in the hall, I will do three physiological sighs, then 5-4-3-2-1." Pre-commitment removes the decision-making that would normally be required in the moment (when cognitive resources are most depleted), making the intervention faster and more reliable.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Quick Stress Relief FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Can I combine techniques, or should I stick to one?</strong><br />
        A: Combining techniques is often more effective than using a single one — particularly for moderate to severe stress. A standard combination is physiological regulation first (breathing or physical movement), followed by cognitive anchoring (grounding or journalling). The physiological technique addresses the body's stress response; the cognitive technique addresses the thought patterns sustaining it. The Relief Station routines are designed with this combination logic built in.</p>

        <p><strong>Q: What if I feel self-conscious doing these in public?</strong><br />
        A: Several techniques are specifically invisible in public settings. The physiological sigh, box breathing, and extended exhale can all be done without any visible difference from normal breathing. The 5-4-3-2-1 grounding exercise can be done entirely internally without moving or writing anything. Shoulder drop and jaw release take two seconds and are invisible from the outside. If you feel self-conscious about being seen doing stress management, start with the invisible techniques and build confidence gradually.</p>

        <p><strong>Q: Why do breathing exercises sometimes make me feel more anxious rather than less?</strong><br />
        A: For some people, particularly those with anxiety disorders or panic tendencies, focusing on breathing can initially amplify awareness of physical sensations and temporarily increase anxiety. If this happens, ground yourself in external sensory experience first — the 5-4-3-2-1 exercise — before attempting breath control techniques. Once the external grounding has slightly lowered the baseline activation, the breathing exercises will be more comfortable and effective.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: ROSE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Five intentional minutes beats fifty anxious ones. Take the five."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Every technique in this guide works — when practised. The student who has done box breathing twenty times is not the same as the student who read about it once. Start today, in the quiet, when you do not need it. That is exactly when the practice does its most important work.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: ROSE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${RBORDER}` }}
          >
            Continue in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: ROSE, border: `2px solid ${ROSE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Go-To Technique
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More Student Stress Resources:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-anxiety-help',          '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/exam-stress-management',     '→ How to Handle Exam Stress Without Panic'],
            ['/blog/student-stress-management',  '→ Student Stress Management: Practical Techniques That Actually Work'],
            ['/blog/balance-studies-mental-health','→ How to Balance Studies and Mental Health Effectively'],
            ['/blog/academic-burnout-signs',     '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/safe',                            '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: ROSE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
