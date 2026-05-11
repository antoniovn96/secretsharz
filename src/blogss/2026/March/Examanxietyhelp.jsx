import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Why Exams Cause Anxiety and How to Overcome It Naturally",
  excerpt: "Exam anxiety is not weakness — it is your brain's threat system misfiring in a high-stakes context. Learn the exact psychology of why exams trigger anxiety, what separates healthy nerves from performance-blocking anxiety, and use our Anxiety Calm-Down Lab to walk through breathing exercises and coping strategies in real time.",
  category: "Mental Health",
  date: "03-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/exam-anxiety-help.jpg",
  tldr: "Exam anxiety affects an estimated 25-40% of students and is driven by a specific neurological pattern — the amygdala threat response overriding prefrontal access to memory and reasoning. This guide explains the psychology clearly, separates productive from problematic anxiety, gives you four evidence-based breathing exercises with timed guides, covers seven natural coping strategies, and includes an interactive Anxiety Calm-Down Lab you can use before, during, and after exams.",
  toc: [
    { id: "psychology",  title: "1. The Psychology of Exam Anxiety — Why Your Brain Does This",        level: 3 },
    { id: "two-types",   title: "2. Productive Nerves vs Problematic Anxiety: How to Tell the Difference", level: 3 },
    { id: "calm-lab",    title: "3. Interactive: The Anxiety Calm-Down Lab",                           level: 3 },
    { id: "breathing",   title: "4. Four Breathing Exercises That Calm Exam Anxiety Naturally",        level: 3 },
    { id: "coping",      title: "5. Seven Natural Coping Strategies for Exam Anxiety",                 level: 3 },
    { id: "faq",         title: "6. Exam Anxiety FAQs",                                                level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-03T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "exam anxiety, exam anxiety help, how to overcome exam anxiety, exam anxiety psychology, breathing exercises exam anxiety, natural coping strategies exam anxiety, student exam anxiety, test anxiety",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What causes exam anxiety in students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exam anxiety is caused by the brain's amygdala misclassifying the exam as a genuine threat and triggering the fight-or-flight stress response. This produces cortisol and adrenaline, which suppress prefrontal cortex activity — the area responsible for memory retrieval, complex reasoning, and focused attention — creating the specific experience of blanking, struggling to concentrate, and being unable to access studied material. Underlying drivers include fear of failure, perfectionism, social comparison, and accumulated academic pressure from family or competitive environments.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I calm exam anxiety naturally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Natural exam anxiety management combines physiological techniques (controlled breathing, physical movement, adequate sleep) with cognitive approaches (reframing anxiety as readiness, challenging catastrophic thoughts, grounding in the present moment) and behavioural strategies (consistent study habits that reduce last-minute pressure, preparation rituals that signal safety, and avoiding excessive comparison). The most consistently evidence-supported single technique is controlled breathing with an extended exhale, which directly activates the parasympathetic nervous system and lowers cortisol within minutes.",
      },
    },
    {
      "@type": "Question",
      "name": "Is exam anxiety normal for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — research suggests 25-40% of students experience significant exam anxiety, making it one of the most prevalent mental health challenges in academic settings. Mild to moderate anxiety before high-stakes exams is not only normal but physiologically useful — it signals that the situation matters and activates arousal that, at moderate levels, improves performance. Anxiety becomes problematic when it is disproportionate to the actual stakes, when it prevents adequate preparation through avoidance, or when it consistently impairs performance below the level of the student's actual preparation and capability.",
      },
    },
  ],
};

// ── Calm-Down Lab Data ─────────────────────────────────────────────────────────
const TERR    = '#B85C38';
const TPALE4  = '#FBF2EE';
const TBORD4  = 'rgba(184,92,56,0.22)';

const ANXIETY_MOMENTS = [
  { key: 'night_before', icon: '🌙', label: 'Night before the exam — can\'t sleep, mind racing' },
  { key: 'morning',      icon: '☀️', label: 'Morning of the exam — nauseous, heart pounding' },
  { key: 'in_hall',      icon: '📝', label: 'In the exam hall — freezing up or blanking' },
  { key: 'mid_exam',     icon: '⏱️', label: 'Mid-exam panic — one question threw me off completely' },
  { key: 'after_exam',   icon: '🔄', label: 'After the exam — cannot stop replaying and catastrophising' },
];

const ANXIETY_INTENSITIES = [
  { key: 'mild',   icon: '🟢', label: 'Mild — manageable nervousness' },
  { key: 'medium', icon: '🟡', label: 'Moderate — significantly affecting my focus' },
  { key: 'high',   icon: '🔴', label: 'High — panic, physical symptoms, or total freeze' },
];

const BREATHING_EXERCISES = [
  {
    key:    'box',
    name:   '📦 Box Breathing',
    tagline:'The reset breath — used by Navy SEALs and surgeons',
    phases: [
      { label: 'Inhale', count: 4, color: '#2D7D46' },
      { label: 'Hold',   count: 4, color: TERR },
      { label: 'Exhale', count: 4, color: '#1565C0' },
      { label: 'Hold',   count: 4, color: '#7B2D5E' },
    ],
    rounds: 4,
    why: 'Box breathing activates the parasympathetic nervous system through equal-ratio breath control. The two hold phases give the body time to integrate the oxygen shift and reduce the CO2-driven panic signal that shallow breathing amplifies.',
    best_for: ['In the exam hall', 'Before entering any high-stress situation', 'When you feel a panic onset beginning'],
  },
  {
    key:    'extended_exhale',
    name:   '🌊 Extended Exhale',
    tagline:'The fastest cortisol reduction technique available',
    phases: [
      { label: 'Inhale', count: 4, color: '#2D7D46' },
      { label: 'Exhale', count: 8, color: '#1565C0' },
    ],
    rounds: 5,
    why: 'The extended exhale (longer out than in) directly activates the vagus nerve and parasympathetic nervous system. Research by Andrew Huberman at Stanford shows that a doubled exhale-to-inhale ratio is the single fastest breathing technique for lowering heart rate and cortisol. Start with 4:6 if 4:8 is too long.',
    best_for: ['Acute panic moments', 'When you need relief in under 2 minutes', 'Night before exam — racing thoughts'],
  },
  {
    key:    '478',
    name:   '✨ 4-7-8 Breathing',
    tagline:'Deep nervous system reset for severe anxiety',
    phases: [
      { label: 'Inhale', count: 4, color: '#2D7D46' },
      { label: 'Hold',   count: 7, color: TERR },
      { label: 'Exhale', count: 8, color: '#1565C0' },
    ],
    rounds: 4,
    why: 'Developed by Dr Andrew Weil and based on pranayama breathing traditions, the 4-7-8 technique produces a strong sedative effect by dramatically increasing parasympathetic tone. The long hold saturates the blood with oxygen, while the long exhale fully activates vagal braking of the heart rate.',
    best_for: ['Severe anxiety the night before', 'Inability to sleep due to exam worry', 'Panic attacks or near-panic states'],
  },
  {
    key:    'physiological_sigh',
    name:   '😮‍💨 Physiological Sigh',
    tagline:'The body\'s own fastest emergency reset — done in 30 seconds',
    phases: [
      { label: 'Inhale 1', count: 2, color: '#2D7D46' },
      { label: 'Inhale 2', count: 1, color: '#4CAF50' },
      { label: 'Long Exhale', count: 6, color: '#1565C0' },
    ],
    rounds: 3,
    why: 'The physiological sigh (a double inhale followed by a long exhale) is the fastest breath reset the body can execute. It re-inflates alveoli that collapse under stress and provides the largest single-breath CO2 removal possible. Stanford research shows it reduces subjective anxiety within 30 seconds — faster than any other technique.',
    best_for: ['Sudden panic onset', 'Immediate in-exam crisis', 'When you have less than 1 minute to reset'],
  },
];

const MOMENT_PLANS = {
  night_before: {
    primary_breath: 'extended_exhale',
    coping: [
      { title: 'Brain dump before bed', text: 'Spend 10 minutes writing every worry, task, and thought floating in your head. Once it is on paper, your brain no longer needs to hold it in active memory. Close the notebook. The worries can wait until morning — they are written, not lost.' },
      { title: 'The preparation inventory', text: 'Write a list of everything you actually know — not what you don\'t know, what you do. Even if the list feels incomplete, it counteracts the catastrophic narrative that you know nothing.' },
      { title: 'The shutdown ritual', text: 'Choose a specific time (e.g., 10pm) as your exam-thought shutdown. Before that time, you can think about the exam. After it, you redirect every exam thought to: "That can wait until morning. Right now I am resting." Practice this redirect every time a thought intrudes.' },
    ],
    reminder: 'Sleep is more valuable than any revision you can do in the next hour. A well-rested brain performs significantly better than a tired one with marginally more information.',
  },
  morning: {
    primary_breath: 'box',
    coping: [
      { title: 'The acceptance reframe', text: 'Say out loud: "I am anxious because this matters to me. That is not a problem — it means I care." Labelling the anxiety as appropriate rather than dangerous measurably reduces its intensity.' },
      { title: 'Eat something small', text: 'Even if nausea makes eating feel impossible, low blood sugar dramatically amplifies anxiety symptoms. Something small and protein-based before leaving the house.' },
      { title: 'Physical movement', text: 'Five minutes of brisk walking uses the adrenaline your body has produced for the intended purpose (physical action) rather than leaving it internally amplifying. Walk to the exam centre if possible.' },
    ],
    reminder: 'The anxiety you feel this morning is not a prediction of how the exam will go. It is your body preparing. Use it.',
  },
  in_hall: {
    primary_breath: 'physiological_sigh',
    coping: [
      { title: 'Read everything first', text: 'Two minutes scanning all questions before writing anything. This gives your brain a complete map of the task, reduces the shock of difficult questions, and allows strategic time allocation.' },
      { title: '5-4-3-2-1 grounding', text: 'Name 5 things you see, 4 you can feel, 3 you hear, 2 you smell, 1 you taste. This multi-sensory present-moment anchor interrupts catastrophic future-projection and brings the prefrontal cortex back online.' },
      { title: 'Start with what you know', text: 'Begin with a question you can answer — not necessarily the first one. Writing activates the brain\'s retrieval network and begins dissolving the blank. Once you are writing, it becomes easier to access other material.' },
    ],
    reminder: 'You have studied. The information is there. Right now your job is to reduce the noise enough to reach it.',
  },
  mid_exam: {
    primary_breath: 'physiological_sigh',
    coping: [
      { title: 'Mark and move', text: 'If one question has sent you into panic, mark it, write one sentence you do know, and physically move to the next question. Momentum elsewhere reliably restores access to blocked material later.' },
      { title: 'Lower your shoulders', text: 'Check your posture right now. Shoulders up, jaw clenched, and shallow breathing are physical anxiety feeders. Consciously drop your shoulders, release your jaw, and take one long breath.' },
      { title: 'The reality check', text: 'Silently say: "One hard question does not define this paper. I am still in this exam. I still have time. What can I write right now?" Answer that last question, even partially.' },
    ],
    reminder: 'Partial answers score points. A panicked skip scores zero. Write something — anything you know — and move.',
  },
  after_exam: {
    primary_breath: 'extended_exhale',
    coping: [
      { title: 'Hard close the exam', text: 'The moment you exit: "That paper is closed. Nothing I think about now can change what I wrote." Say it once, firmly. This is the declaration that ends the exam for your nervous system, not just the clock.' },
      { title: 'No post-mortem rule', text: 'Agree with yourself (and ideally your friends) to a no-detailed-answer-comparison rule for at least two hours after. Post-mortems reliably increase anxiety without providing useful information.' },
      { title: 'Do one recovery thing', text: 'Plan, in advance, one specific recovery activity for the two hours after the exam. Not study. Not social media. One thing that you know genuinely restores you — a walk, a specific meal, calling one specific person.' },
    ],
    reminder: 'The exam is over. Worrying now is all cost and no benefit. Your job right now is recovery.',
  },
};

// ── Timed Breathing Animation Component ────────────────────────────────────────
function BreathingTimer({ exercise, onClose }) {
  const [isRunning,    setIsRunning]    = useState(false);
  const [phaseIndex,   setPhaseIndex]   = useState(0);
  const [secondsLeft,  setSecondsLeft]  = useState(exercise.phases[0].count);
  const [roundsDone,   setRoundsDone]   = useState(0);
  const [isComplete,   setIsComplete]   = useState(false);
  const intervalRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const totalPhases = exercise.phases.length;
  const currentPhase = exercise.phases[phaseIndex];
  const totalRounds  = exercise.rounds;
  const progress     = (roundsDone / totalRounds) * 100;

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Advance phase or round
          const nextPhase = (phaseIndex + 1) % totalPhases;
          if (nextPhase === 0) {
            const newRound = roundsDone + 1;
            if (newRound >= totalRounds) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setIsComplete(true);
              return 0;
            }
            setRoundsDone(newRound);
          }
          setPhaseIndex(nextPhase);
          return exercise.phases[(phaseIndex + 1) % totalPhases].count;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, phaseIndex, roundsDone, totalPhases, totalRounds, exercise.phases]);

  const handleStart = () => { setIsRunning(true); setIsComplete(false); setPhaseIndex(0); setSecondsLeft(exercise.phases[0].count); setRoundsDone(0); };
  const handlePause = () => { setIsRunning(false); clearInterval(intervalRef.current); };
  const handleReset = () => { setIsRunning(false); clearInterval(intervalRef.current); setPhaseIndex(0); setSecondsLeft(exercise.phases[0].count); setRoundsDone(0); setIsComplete(false); };

  const circleSize = 140;
  const circumference = 2 * Math.PI * 55;
  const maxCount = currentPhase.count;
  const elapsed  = maxCount - secondsLeft;
  const dashOffset = circumference * (1 - elapsed / maxCount);

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: `2px solid ${TBORD4}`, fontFamily: font }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: TERR }}>{exercise.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{exercise.tagline}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px', padding: '0 4px', lineHeight: 1 }}>×</button>
      </div>

      {/* Circular timer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <div style={{ position: 'relative', width: circleSize, height: circleSize }}>
          <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={circleSize / 2} cy={circleSize / 2} r={55} fill="none" stroke="rgba(184,92,56,0.12)" strokeWidth={10} />
            <circle cx={circleSize / 2} cy={circleSize / 2} r={55} fill="none" stroke={currentPhase.color} strokeWidth={10}
              strokeDasharray={circumference} strokeDashoffset={isRunning || roundsDone > 0 ? dashOffset : circumference}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: currentPhase.color, fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
              {isComplete ? '✓' : secondsLeft}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
              {isComplete ? 'Done' : currentPhase.label}
            </div>
          </div>
        </div>

        {/* Round indicator */}
        <div style={{ display: 'flex', gap: '7px' }}>
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < roundsDone ? TERR : i === roundsDone && isRunning ? `${TERR}60` : 'var(--border)', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* Phase labels */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {exercise.phases.map((ph, i) => (
            <div key={i} style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
              background: i === phaseIndex && isRunning ? ph.color : 'var(--border)',
              color: i === phaseIndex && isRunning ? 'white' : 'var(--muted)',
              transition: 'all 0.3s',
            }}>
              {ph.label} {ph.count}s
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {!isRunning && !isComplete ? (
          <button onClick={handleStart} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${TERR}, #D4784A)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
            {roundsDone > 0 ? '▶ Continue' : '▶ Start Breathing'}
          </button>
        ) : isRunning ? (
          <button onClick={handlePause} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
        ) : (
          <button onClick={handleReset} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#2D7D46', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>✓ Complete — Reset</button>
        )}
        {(roundsDone > 0 || isComplete) && (
          <button onClick={handleReset} style={{ padding: '12px 16px', borderRadius: '10px', border: `1.5px solid ${TBORD4}`, background: 'transparent', color: TERR, fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺</button>
        )}
      </div>

      {/* Why it works */}
      <div style={{ background: TPALE4, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${TBORD4}` }}>
        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: TERR, marginBottom: '5px' }}>🔬 Why This Works</div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{exercise.why}</p>
      </div>
    </div>
  );
}

// ── Calm-Down Lab Component ────────────────────────────────────────────────────
function AnxietyCalmDownLab() {
  const [step,         setStep]         = useState(1);
  const [moment,       setMoment]       = useState(null);
  const [intensity,    setIntensity]    = useState(null);
  const [revealed,     setRevealed]     = useState(false);
  const [activeBreath, setActiveBreath] = useState(null);
  const [openCoping,   setOpenCoping]   = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selMoment    = ANXIETY_MOMENTS.find(m => m.key === moment);
  const selIntensity = ANXIETY_INTENSITIES.find(i => i.key === intensity);
  const plan         = moment ? MOMENT_PLANS[moment] : null;
  const primaryBreath = plan ? BREATHING_EXERCISES.find(b => b.key === plan.primary_breath) : null;

  const handleReset = () => { setStep(1); setMoment(null); setIntensity(null); setRevealed(false); setActiveBreath(null); setOpenCoping(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? TERR : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — When is the anxiety hitting you?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the moment that matches where you are right now — or where you most need help.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {ANXIETY_MOMENTS.map(m => {
              const isSel = moment === m.key;
              return (
                <button key={m.key} onClick={() => setMoment(m.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? TERR : 'var(--border)', background: isSel ? TPALE4 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 3px ${TBORD4}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{m.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? TERR : 'var(--ink)' }}>{m.label}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (moment) setStep(2); }} disabled={!moment} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: moment ? `linear-gradient(135deg, ${TERR}, #D4784A)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: moment ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: moment ? `0 6px 18px ${TBORD4}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How intense is the anxiety right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest — the plan adjusts to your actual level.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {ANXIETY_INTENSITIES.map(ai => {
              const isSel = intensity === ai.key;
              return (
                <button key={ai.key} onClick={() => setIntensity(ai.key)} style={{
                  padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? TERR : 'var(--border)', background: isSel ? TPALE4 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${TBORD4}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{ai.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? TERR : 'var(--ink)' }}>{ai.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (intensity) { setStep(3); setRevealed(false); } }} disabled={!intensity} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: intensity ? `linear-gradient(135deg, ${TERR}, #D4784A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: intensity ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Calm Plan →</button>
          </div>
        </>
      )}

      {/* STEP 3 — Results */}
      {step === 3 && plan && selMoment && selIntensity && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Your Anxiety Calm-Down Plan
          </p>

          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${TERR}, #D4784A)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${TBORD4}`,
              }}>🧘 Reveal My Calm-Down Plan</button>
              <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${TERR}, #D4784A)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selMoment.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {selMoment.label}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', borderRadius: '20px', padding: '4px 12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '14px' }}>{selIntensity.icon}</span>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '700' }}>{selIntensity.label}</span>
                </div>
              </div>

              {/* Priority breathing */}
              {primaryBreath && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: TERR, marginBottom: '9px' }}>
                    💨 Your Priority Breathing Exercise
                  </div>
                  {activeBreath === primaryBreath.key ? (
                    <BreathingTimer exercise={primaryBreath} onClose={() => setActiveBreath(null)} />
                  ) : (
                    <button onClick={() => setActiveBreath(primaryBreath.key)} style={{
                      width: '100%', padding: '16px 18px', borderRadius: '12px', border: `2px solid ${TBORD4}`,
                      background: 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.15s',
                    }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${TERR}, #D4784A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '20px' }}>▶</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: TERR }}>{primaryBreath.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{primaryBreath.tagline}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{primaryBreath.rounds} rounds · {primaryBreath.phases.map(p => `${p.label} ${p.count}s`).join(' · ')}</div>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Coping strategies */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: TERR, marginBottom: '9px' }}>
                  🛠️ Three Coping Steps for This Moment
                </div>
                {plan.coping.map((cop, i) => {
                  const isOpen = openCoping === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${TBORD4}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenCoping(isOpen ? null : i)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg, ${TERR}, #D4784A)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: TERR }}>{cop.title}</span>
                        </div>
                        <span style={{ color: TERR, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{cop.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reminder */}
              <div style={{ background: TPALE4, border: `1.5px dashed ${TBORD4}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: TERR, marginBottom: '7px' }}>✨ Remember</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: TERR, fontStyle: 'italic', lineHeight: 1.55 }}>"{plan.reminder}"</p>
              </div>

              {/* All breathing exercises */}
              <div style={{ background: 'white', border: `1.5px solid ${TBORD4}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: TERR, marginBottom: '10px' }}>
                  💨 All Four Breathing Exercises — Try Any
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
                  {BREATHING_EXERCISES.map(ex => {
                    const isActive = activeBreath === ex.key;
                    return (
                      <button key={ex.key} onClick={() => setActiveBreath(isActive ? null : ex.key)} style={{
                        padding: '10px 12px', borderRadius: '10px', border: '1.5px solid',
                        borderColor: isActive ? TERR : 'var(--border)', background: isActive ? TPALE4 : '#fafafa',
                        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: isActive ? TERR : 'var(--ink)', marginBottom: '2px' }}>{ex.name.split(' ').slice(0, 2).join(' ')}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>{ex.phases.map(p => p.count).join('-')} counts</div>
                      </button>
                    );
                  })}
                </div>
                {activeBreath && activeBreath !== primaryBreath?.key && (
                  <div style={{ marginTop: '12px' }}>
                    <BreathingTimer exercise={BREATHING_EXERCISES.find(b => b.key === activeBreath)} onClose={() => setActiveBreath(null)} />
                  </div>
                )}
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: `1.5px solid ${TBORD4}`, color: TERR,
                padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Try a different moment</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ExamAnxietyHelp({ navigate, relatedPosts }) {
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
      <p>You have studied. You know the material. And yet, sitting in the exam hall — or the night before, or the morning of — something in your body goes wrong. Heart rate climbs. Breathing becomes shallow. The answers that were clearly in your memory an hour ago seem entirely unreachable. This is not failure. This is not weakness. This is <strong>exam anxiety</strong> — and it has a specific, well-understood neurological explanation.</p>

      <p>More importantly, it has specific, evidence-backed solutions. The anxiety is real. Its effect on performance is real. And the techniques that interrupt it — when practised before you need them, not learned for the first time in the hall — are also real.</p>

      <img
        src={meta.imgUrl}
        alt="Student using natural breathing and coping techniques to overcome exam anxiety — a guide to managing test anxiety"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="psychology">1. The Psychology of Exam Anxiety — Why Your Brain Does This</h3>
      <p>Exam anxiety follows a specific and well-mapped neurological sequence. It begins with an appraisal — "this exam matters enormously and I might fail it" — that the brain's amygdala interprets as a threat signal. The amygdala does not distinguish between threat types. It does not care whether you are being chased or sitting a chemistry paper. When it detects a threat, it activates the hypothalamic-pituitary-adrenal (HPA) axis, which floods the body with cortisol and adrenaline.</p>
      <p>These stress hormones are genuinely useful in the right dose. At moderate levels, cortisol sharpens attention, adrenaline improves reaction speed, and the overall arousal state improves performance — this is the Yerkes-Dodson principle of optimal arousal. The problem is when the stress response overshoots. At high levels of cortisol, the prefrontal cortex — the brain region responsible for working memory, complex reasoning, language retrieval, and focused attention — is significantly downregulated. The amygdala literally suppresses the area of the brain you most need to do well in an exam.</p>
      <p>This is why students blank on material they genuinely know. The information is stored in long-term memory, which is intact. The retrieval pathway — which runs through the prefrontal cortex — is temporarily blocked by the stress response. The material is there. The anxiety is preventing access.</p>
      <p>Research by psychologist Elizabeth Phelps at New York University has documented this mechanism precisely: stress impairs explicit, effortful memory retrieval (the kind exams require) more than implicit, automatic recall. The more conscious effort required to retrieve information, the more vulnerable it is to cortisol-induced suppression. This explains why the answers sometimes come flooding back the moment you leave the hall and the cortisol drops — your prefrontal cortex comes back online and the retrieval pathway reopens.</p>
      <p>Additional drivers of exam anxiety include: perfectionism (the belief that anything below a specific result constitutes failure), social comparison (awareness of peers' performance and perceived relative standing), catastrophic thinking (predicting the worst-case outcome and treating it as certain), and accumulated familial or institutional pressure that has conditioned the exam to carry an existential emotional weight it cannot realistically sustain.</p>

      {/* ── Section 2 ── */}
      <h3 id="two-types">2. Productive Nerves vs Problematic Anxiety: How to Tell the Difference</h3>
      <p>Not all pre-exam activation is anxiety. Some of it is readiness — the body preparing appropriately for a demanding task. Understanding the difference between productive nervousness and problematic anxiety is important, because the treatment for each is different and the conflation of the two can lead students to either suppress normal adaptive responses or normalise genuinely problematic ones.</p>
      <p><strong>Productive exam nerves</strong> present as heightened alertness, mild physical arousal (slightly elevated heart rate, butterflies), increased focus on the upcoming task, and motivation to prepare. They are proportionate to the actual stakes of the exam, they diminish reasonably as the exam date approaches and preparation is complete, and they do not prevent adequate preparation or sleep in the period before. During the exam, productive nerves keep you alert and engaged rather than distracted and frozen.</p>
      <p><strong>Problematic exam anxiety</strong> presents as physical symptoms disproportionate to the stakes (racing heart, nausea, trembling, difficulty breathing, headaches), cognitive intrusion (racing thoughts, catastrophic predictions, inability to concentrate on preparation or on the paper itself), behavioural avoidance (delaying or avoiding study because thinking about the exam produces too much distress), and performance that is consistently below the level of preparation — where you know more than the exam result reflects because anxiety prevented access.</p>
      <p>The critical diagnostic question is: <em>is the anxiety proportionate to the actual stakes, and is it impacting your preparation or performance?</em> If you experience anxiety but prepare adequately and perform reasonably in line with your preparation, the anxiety may be uncomfortable but is not clinically significant. If the anxiety prevents adequate preparation through avoidance, produces physical symptoms that are themselves distressing, or consistently results in performance significantly below your actual capability — these are signs that the anxiety has moved beyond the normal range and deserves targeted attention.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="calm-lab">3. Interactive: The Anxiety Calm-Down Lab</h3>
      <p>The Calm-Down Lab is designed to be used before, during, and after exams. Tell it where you are — which exam moment is most challenging for you — and how intense the anxiety is right now. It will give you a targeted breathing exercise with a real-time guided timer, three specific coping steps for your moment, and access to all four evidence-based breathing techniques to try.</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '4px' }}>Practise the breathing exercises now — before you are in a high-anxiety state. The technique you have used twenty times is the one that will be available when you need it most.</p>

      <AnxietyCalmDownLab />

      {/* ── Section 4 ── */}
      <h3 id="breathing">4. Four Breathing Exercises That Calm Exam Anxiety Naturally</h3>
      <p>Controlled breathing is the most direct, fastest, and most accessible intervention for acute anxiety that exists — and it requires no equipment, no prescription, and no special circumstances to deploy. The mechanism is direct: the respiratory system is the only autonomic system you can consciously control, and controlling it — particularly the exhale — directly activates the vagus nerve and parasympathetic nervous system, which are the body's calming mechanisms.</p>
      <p><strong>Box Breathing (4-4-4-4).</strong> Four counts in, four counts hold, four counts out, four counts hold. This equal-ratio technique produces a balanced physiological reset — it neither over-stimulates nor over-relaxes, making it ideal for the exam hall where you need to remain alert. Used by military personnel in combat situations, it is specifically designed for high-stress, high-performance contexts where you cannot fully relax but must prevent panic. Four rounds takes approximately one minute.</p>
      <p><strong>Extended Exhale (4-8).</strong> Four counts in, eight counts out — no holds. The doubled exhale-to-inhale ratio maximises vagal activation and produces the fastest single-technique cortisol reduction available. If 4:8 is too long, start with 4:6. Research by Andrew Huberman at Stanford identifies the extended exhale as the single most effective breath manipulation for acute anxiety reduction. Best for the night before when you cannot sleep, or at the first sign of in-hall panic.</p>
      <p><strong>4-7-8 Breathing.</strong> Four in, hold for seven, eight out. The long hold saturates the blood with oxygen and produces a significant sedative effect — stronger than box breathing, best reserved for severe anxiety or pre-sleep use. Not ideal mid-exam (the strong sedation may reduce alertness) but excellent for the night before or after a difficult exam when you need to fully settle the nervous system.</p>
      <p><strong>Physiological Sigh.</strong> Two short inhales through the nose (a full inhale, then a second quick inhale to fully inflate the lungs), followed by one long exhale through the mouth. This is the body's own built-in emergency reset — you do it involuntarily when you have been crying or experiencing acute distress. Done deliberately, it re-inflates collapsed alveoli in the lungs, removes the CO2 buildup that drives the panic signal, and produces measurable anxiety reduction in under thirty seconds. Best for immediate crisis moments.</p>

      {/* ── Section 5 ── */}
      <h3 id="coping">5. Seven Natural Coping Strategies for Exam Anxiety</h3>
      <p><strong>1. Reframe anxiety as readiness.</strong> Research by Alison Wood Brooks at Harvard Business School showed that students who said "I am excited" rather than "I am calm" before a high-stakes performance scored significantly higher — not because excitement is better than calm, but because reframing anxiety as an energising signal rather than a threatening one changes the cognitive appraisal that determines whether the stress response tips into panic. Your body cannot distinguish between fear and excitement physiologically — only the label you apply determines which one it becomes. Practice saying: "I am ready. My body is preparing me."</p>
      <p><strong>2. Write the fear before the exam.</strong> Psychologist Sian Beilock at the University of Chicago ran a landmark study showing that students who spent ten minutes writing about their exam worries before sitting the test scored significantly higher than those who did not. The mechanism: externalising the worry frees up working memory that was being occupied by suppressing or managing the anxious thoughts, making more cognitive resources available for the actual exam. Try this the night before or morning of each significant exam.</p>
      <p><strong>3. Prepare a consistent pre-exam routine.</strong> The nervous system responds to routines as safety signals — a consistent sequence of behaviours before an exam trains the brain to associate that sequence with manageable challenge rather than threat. It does not matter what the routine contains. It matters that it is consistent. The same playlist, the same breakfast, the same walk to the exam centre, the same few minutes of breathing — each element signals "I have done this before, I know what happens next, this is manageable."</p>
      <p><strong>4. Limit caffeine on exam days.</strong> Caffeine is a direct cortisol amplifier — it increases cortisol production and extends the duration of the stress response. For students who already have elevated baseline cortisol from anxiety, caffeine on exam day significantly amplifies anxiety symptoms. If you regularly consume caffeine, do not eliminate it suddenly (withdrawal headaches are counterproductive) — simply do not increase your intake beyond your regular amount on exam days.</p>
      <p><strong>5. Sleep the night before regardless of preparation level.</strong> The most valuable thing you can do in the final twelve hours before a significant exam is sleep adequately. Sleep consolidates the memories formed during study, restores the prefrontal cortex's capacity for retrieval and reasoning, and lowers the baseline cortisol level from which the exam's additional stress is added. The student who has studied for eight hours and then slept for seven will almost always outperform the student who studied for twelve hours and slept for three.</p>
      <p><strong>6. Do not discuss the exam with anxious peers immediately beforehand.</strong> The anxiety states of people around you are literally contagious — a phenomenon called "emotional contagion," documented extensively by psychologist Elaine Hatfield. Sitting in a group of anxious classmates comparing last-minute notes and catastrophising together measurably elevates your own cortisol before you enter the hall. If you are prone to exam anxiety, the fifteen minutes before the exam are better spent alone or with genuinely calm company than in the typical pre-exam group stress amplification loop.</p>
      <p><strong>7. Build self-compassion into your post-exam recovery.</strong> How you treat yourself after an exam — particularly one that did not go as hoped — directly affects your anxiety level before the next one. The harshest internal critics are often the most anxious exam-sitters, not because the self-criticism improves future performance (it does not — research by Kristin Neff consistently shows that self-compassion produces better academic outcomes than self-criticism) but because the anticipated self-punishment if things go wrong escalates the threat signal before they have even started. Practise the same standard you would apply to a struggling friend: acknowledge the difficulty, take whatever learning is available, and move forward without extended self-punishment.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Exam Anxiety FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried breathing exercises before but they don't work for me. Why?</strong><br />
        A: The most common reason breathing exercises fail is that they are attempted for the first time during the acute anxiety state they are supposed to address. The neural pathway for using a technique needs to be established in a low-stress state before it becomes available under high stress. Practise the 4-4-4-4 box breath or the physiological sigh every day for two weeks — not when anxious, as a daily practice. After this period, the technique becomes automatic enough to deploy in the hall. A technique practised for the first time in a panic rarely works. A technique practised fifty times becomes a reliable tool.</p>

        <p><strong>Q: My parents compare me to siblings or cousins who do better. How does this affect exam anxiety and what can I do?</strong><br />
        A: Sibling and peer comparison from family members is one of the most specific and least discussed drivers of exam anxiety in Indian student contexts. It activates what psychologists call "social evaluation threat" — the threat not just of failing the exam but of failing in comparison to a specific person in the eyes of people whose approval is deeply important. This adds a relational layer of threat to the already-present academic one, significantly amplifying the stress response. One direct conversation with the relevant family member — "comparisons to others make my anxiety significantly worse and my performance worse — I need you to stop" — is worth having. If that is not safe or possible, the coping work is internal: actively separating your self-assessment from their comparison framework by anchoring your worth to your own effort and trajectory rather than your relative ranking.</p>

        <p><strong>Q: Should I see a professional for exam anxiety?</strong><br />
        A: Professional support for exam anxiety is appropriate when: the anxiety consistently produces performance significantly below your actual preparation level, physical symptoms are severe or persistent, the anxiety generalises beyond exams to affect your daily functioning throughout the academic year, or when self-management techniques provide insufficient relief. Cognitive Behavioural Therapy (CBT) for performance anxiety has very strong evidence and is specifically effective for exam anxiety. Exposure therapy — gradually and systematically reducing the threat response to exam-like conditions — is also highly effective. Your school or college counsellor is the starting point. This is not a sign of weakness or failure — it is accurate recognition that the anxiety has reached a level where professional tools are the appropriate resource.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: TERR, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Anxiety is not the enemy. Panic is. And panic is a signal you can learn to answer differently."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Every technique in this guide works — when practised before you need it. The student who manages exam anxiety best is not the one who never feels it. It is the one who has built enough of a toolkit that when the anxiety rises, there is somewhere reliable to go. Build that toolkit now, in the ordinary days, so it is waiting for you when the extraordinary days come.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: TERR, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${TBORD4}` }}
          >
            Use Mind Space to Process Anxiety →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: TERR, border: `2px solid ${TERR}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Get Support in Our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More Tools for Academic Wellbeing:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-stress-management',    '→ How to Handle Exam Stress Without Panic (Student Guide)'],
            ['/blog/student-stress-management', '→ Student Stress Management: Practical Techniques That Actually Work'],
            ['/blog/self-kindness-check',       '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/blog/negative-self-talk',        '→ Breaking the Cycle of Negative Self-Talk'],
            ['/safe',                           '→ Access 24/7 Professional Support in Our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: TERR, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
