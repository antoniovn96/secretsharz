import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stay Calm and Confident During Exams",
  excerpt: "Exam confidence is not a personality trait reserved for naturally relaxed students — it is a practised skill built through specific mindset strategies, physical regulation techniques, and the deliberate construction of pre-exam rituals that signal safety to your nervous system. Learn exactly how, and build your personalised Exam Confidence Plan.",
  category: "Mental Health",
  date: "12-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/stay-calm-during-exams.jpg",
  tldr: "Staying calm and confident during exams is not about eliminating anxiety — it is about building the internal and external systems that keep you functional when anxiety rises. This guide covers the mindset science behind exam confidence, seven practical strategies to build it, a timed breathing toolkit, and an interactive Exam Confidence Builder that constructs a personalised pre-exam confidence plan for your specific challenge.",
  toc: [
    { id: "what-confidence", title: "1. What Exam Confidence Actually Is (And Isn't)",                   level: 3 },
    { id: "mindset",         title: "2. Seven Mindset Strategies for Exam Calm and Confidence",           level: 3 },
    { id: "builder",         title: "3. Interactive: The Exam Confidence Builder",                        level: 3 },
    { id: "breathing",       title: "4. Breathing Techniques to Stay Calm in the Exam Hall",              level: 3 },
    { id: "morning",         title: "5. Your Confidence Morning Routine — Step by Step",                  level: 3 },
    { id: "faq",             title: "6. Exam Confidence FAQs",                                             level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-12T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "exam confidence tips, how to stay calm during exams, exam confidence strategies, stay calm exams, exam mindset, confidence before exam, breathing techniques exams, exam morning routine",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I build confidence before an exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exam confidence is built through three parallel practices: preparation-based confidence (having done enough meaningful practice — especially past papers — that your brain has evidence of capability), physiological regulation (breathing exercises, physical movement, and sleep that keep the nervous system out of panic mode), and cognitive reframing (treating pre-exam arousal as readiness rather than threat, using a specific personal mantra, and practising competence recall to access evidence of ability when anxiety distorts perception). Pre-built rituals are more effective than improvised strategies because they activate an established neural association rather than requiring focused attention to implement under pressure.",
      },
    },
    {
      "@type": "Question",
      "name": "Why do I lose confidence during exams even when I have studied?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Confidence drops during exams primarily because acute stress activates the amygdala threat response, which suppresses prefrontal cortex function. The prefrontal cortex is responsible for both accessing stored information and for maintaining a stable self-perception — including the felt sense of competence. When it goes offline under acute stress, students lose access not just to studied content but to their own evidence of capability. This creates the paradox of feeling incompetent in the exam hall despite genuinely knowing the material. The solution is physiological regulation techniques that reduce amygdala activation and restore prefrontal function before attempting recall.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the best techniques to stay calm in an exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most evidence-backed techniques for staying calm during an exam are: the physiological sigh (double inhale through the nose, long exhale — lowers cortisol within 30 seconds), box breathing (4-4-4-4 count — activates parasympathetic nervous system within 2-3 minutes), the 5-4-3-2-1 grounding exercise (multi-sensory present-moment anchoring that interrupts catastrophic thinking), affect labelling (naming the anxiety specifically, which reduces amygdala activation), and a competence recall anchor (a specific pre-remembered example of past performance that provides evidence of capability when anxiety claims there is none).",
      },
    },
  ],
};

// ── Confidence Builder Data ────────────────────────────────────────────────────
const FOREST  = '#1F7060';
const FPALE   = '#EBF5F2';
const FBORD   = 'rgba(31,112,96,0.22)';

const CONFIDENCE_CHALLENGES = [
  {
    key:     'self_doubt',
    icon:    '🪞',
    label:   'Self-doubt — "I am not smart enough for this"',
    desc:    'The feeling that others are naturally more capable and you are always catching up',
    reframe: 'Capability is not a fixed trait — it is a product of preparation and practice. Research by Carol Dweck at Stanford on growth mindset shows that the belief that intelligence is fixed is itself one of the strongest predictors of underperformance, because it causes people to interpret difficulty as evidence of inadequacy rather than as the normal experience of learning. Every student sitting this exam has gaps. You have prepared. The evidence of capability is in your preparation history, not in how you feel about yourself right now.',
    affirmation: '"I have done the work. The work is in me. I can access it."',
    strategy: [
      'Write three specific things you know about topics in this exam — not general subject knowledge, specific facts, methods, or concepts. Read them before entering the hall.',
      'Replace "I am not smart enough" with "I have not fully understood this yet" — the shift from fixed to growth language is documented to improve performance under difficulty.',
      'Recall one specific moment of academic success — any exam, any assignment, any moment you understood something difficult. Hold that memory as your evidence base when self-doubt speaks.',
    ],
    ritual: 'The Competence Recall: 60 seconds before the exam, mentally replay your most competent academic moment in detail — what you did, how it felt, what the outcome was. This activates the neural evidence of your capability before the paper begins.',
  },
  {
    key:     'blank_fear',
    icon:    '🌫️',
    label:   'Fear of going blank in the hall',
    desc:    'Terrified that the material will disappear the moment you see the paper',
    reframe: 'Blanking is caused by cortisol suppressing hippocampal retrieval pathways — it is not evidence that you do not know the material. The information is in long-term memory. The access pathway is temporarily blocked by the stress response. The techniques below restore the pathway by lowering cortisol first. Critically, blanking is almost never total — there is almost always something accessible, and starting to write on anything begins to restore access to the rest.',
    affirmation: '"The information is there. My job is to create calm enough to reach it."',
    strategy: [
      'When you blank: put the pen down. Do not try to force recall while the stress response is still active — forcing increases cortisol further. Regulate first: three physiological sighs, then 5-4-3-2-1 grounding, then read the paper again slowly.',
      'Before the exam, practise intentionally blanking on a practice topic and then using these techniques to restore access. Knowing from experience that the blank resolves reduces the fear of it.',
      'On the paper: scan all questions first. Even recognising that you can answer Question 3 and 7 reduces the threat signal enough to begin restoring access to other material.',
    ],
    ritual: 'The Paper Scan: the moment you receive the paper, read all questions without writing a single word. Mark any you can immediately answer. This gives your brain a complete map and the relief of seeing what is accessible — before the pressure of starting builds.',
  },
  {
    key:     'comparison',
    icon:    '👥',
    label:   'Comparison anxiety — everyone else seems more prepared',
    desc:    'Watching others and concluding they are better prepared, calmer, or more capable',
    reframe: 'You are comparing your complete, unfiltered internal experience — including your doubts, gaps, and anxiety — to others\' external presentation. The student next to you who looks perfectly calm is almost certainly managing their own version of pre-exam anxiety. Their facial expression and writing speed tell you nothing about their internal state or the quality of what they are producing. The comparison is structurally unfair and structurally uninformative.',
    affirmation: '"My paper is mine. Their paper is theirs. I run my own race."',
    strategy: [
      'Narrow your physical field of attention. Before entering the hall: headphones in, eyes on your materials. Once seated: eyes on your desk. The less you observe of others, the less comparison data your anxious brain can distort.',
      'Write your personal success metric on the inside of your notebook before the exam: "Success for me today means giving honest effort on everything I know." Not a rank, not a comparison — a personal standard.',
      'When comparison thoughts arise: notice them, label them ("there is a comparison thought"), and redirect with: "What is the next action I can take on my own paper?"',
    ],
    ritual: 'The Personal Anchor: a physical object (a specific pen, a coloured dot on your hand, a small item in your pocket) that you touch when comparison thoughts arise. The physical touch redirects attention to your own body — your own experience — rather than your interpretation of others\'.',
  },
  {
    key:     'pressure',
    icon:    '⚖️',
    label:   'External pressure — family expectations feel overwhelming',
    desc:    'The weight of what others want from this exam makes it feel impossibly high-stakes',
    reframe: 'The pressure you feel from others\' expectations is real and is a genuine additional stressor beyond the academic one. But there is a distinction worth making: the exam is assessing what you know, not whether you are worthy of love or belonging. The family expectations — even when communicated in ways that make it feel otherwise — are almost always about care, not conditional acceptance. Your result does not determine your worth as a person or your prospects as a human being, even when the people around you are behaving as though it does.',
    affirmation: '"This exam is one moment. I am more than one moment."',
    strategy: [
      'Before the exam, deliberately separate the external expectation from your own internal motivation. Write: "I am sitting this exam because [honest internal reason]." Not what your parents want — what you want. Anchor to that reason.',
      'In the hall: the only people in the room are you and the examiner. The expectations of people outside do not change what the paper asks or what you know. Focus contracts to the task in front of you.',
      'After the exam, regardless of how it went: you showed up. That is not nothing. The showing up is yours, regardless of result.',
    ],
    ritual: 'The Internal Permission Statement: write this on a card and read it the night before and morning of: "I am giving this exam my genuine effort. That is what I can control and it is enough." Repeat it as a mantra if the external pressure thoughts arise.',
  },
  {
    key:     'overwhelm',
    icon:    '🌊',
    label:   'Feeling overwhelmed the moment the paper arrives',
    desc:    'The first sight of the question paper triggers panic before you have even read it properly',
    reframe: 'The overwhelm response to a new exam paper is almost always a response to the paper as a whole — the total scope — rather than to any individual question. The question in front of you is one question. It does not require you to answer all the others simultaneously. The overwhelm is a failure of scope focus — too much visible at once. The technique is narrowing: one question, one part, one sentence at a time.',
    affirmation: '"One question. One step. That is all."',
    strategy: [
      'The moment the paper arrives and overwhelm rises: put your hand flat on the desk and take three slow breaths before reading anything. This five-second pause breaks the automatic overwhelm cascade.',
      'Read the entire paper slowly before reacting to any of it. The overwhelm is strongest when the full paper is encountered all at once. A deliberate, calm first reading transforms it from an overwhelming mass into a set of individual tasks.',
      'Begin writing on anything — even a partial answer to an easy question. The act of producing written output shifts the brain from passive overwhelm to active engagement within minutes.',
    ],
    ritual: 'The Three-Breath Pause: before reading any question, place your pen down and take exactly three slow breaths. Practise this every time you sit a practice paper or quiz, so it becomes an automatic pre-exam behaviour rather than a technique you try to remember under pressure.',
  },
];

const EXAM_PROXIMITY = [
  { key: 'days', icon: '📅', label: '2+ days away', desc: 'Time to prepare and build the ritual' },
  { key: 'eve',  icon: '🌙', label: 'Night before',  desc: 'Eve preparation and calming' },
  { key: 'morn', icon: '☀️', label: 'Morning of',    desc: 'Pre-exam morning activation' },
  { key: 'now',  icon: '⚡', label: 'Right now — exam is imminent', desc: 'Immediate calm needed' },
];

const PROXIMITY_CONTEXT = {
  days: {
    focus: 'Building a Pre-Exam Confidence System',
    msg: 'You have time to practise the techniques below until they are automatic. Use this window to run through the breathing exercises daily, build your competence recall list, and write your personal exam mantra. The ritual becomes effective through repetition — every practice now is an investment in the exam hall.',
    priority_actions: [
      'Practise one breathing technique today in a low-stakes situation (not when anxious — so it is available when you are)',
      'Write your three-item competence evidence list and pin it somewhere visible',
      'Set a specific preparation cutoff for exam eve (9pm) and decide now what your morning routine will include',
      'Write your personal exam mantra — one sentence that is specifically true and specifically yours',
    ],
  },
  eve: {
    focus: 'The Exam Eve Confidence Protocol',
    msg: 'Tonight is not for learning new material — it is for consolidating your confidence. Everything you will remember tomorrow is already in your memory. Tonight\'s job is to protect it through sleep, reduce the anxiety that would impair access, and set up tomorrow morning for a calm, confident start.',
    priority_actions: [
      'Hard stop on studying by 9pm — close the books deliberately, with a shutdown ritual',
      'Lay out everything you need for tomorrow (ID, stationery, route plan, departure time written down)',
      'Do 5 rounds of 4-7-8 breathing (in 4, hold 7, out 8) before bed',
      'Read your competence evidence list and your personal mantra. Then sleep. The sleep is the preparation.',
    ],
  },
  morn: {
    focus: 'The Confidence Morning Activation',
    msg: 'The anxiety you feel this morning is not a bad sign. It is your body preparing for something that matters. Your job right now is to use that energy rather than fight it — move physically, eat something, and activate your pre-built confidence system before entering the hall.',
    priority_actions: [
      'Eat something — protein if possible, even if nausea makes it difficult',
      '5 minutes of brisk physical movement before leaving home — the adrenaline is fuel, use it physically',
      'Read your competence evidence list and mantra one final time before leaving',
      'In the corridor before the hall: headphones in, eyes forward, three physiological sighs',
    ],
  },
  now: {
    focus: 'Immediate Calm — Right Now',
    msg: 'You have prepared. What you know is in there. Right now your only job is to reduce the noise enough to access it. Follow the steps below in order. Do not skip the physical steps — they work faster than thinking your way to calm.',
    priority_actions: [
      'Double inhale through the nose (fill lungs completely, then one more sharp inhale), then one long slow exhale. Do this three times. Now.',
      'Feel both feet flat on the floor. Press them down. Name five things you can see right now.',
      'Unclench your jaw. Drop your shoulders. Open your hands flat, then gently close them.',
      'Say your mantra once: "[Your name], you have prepared. The information is there. Breathe, read, start."',
    ],
  },
};

// ── Breathing Timer ────────────────────────────────────────────────────────────
function BreathingExercise({ name, phases, rounds, why, onClose }) {
  const [phaseIdx,  setPhaseIdx]  = useState(0);
  const [secLeft,   setSecLeft]   = useState(phases[0].count);
  const [roundsDone,setRoundsDone]= useState(0);
  const [running,   setRunning]   = useState(false);
  const [complete,  setComplete]  = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setSecLeft(prev => {
        if (prev <= 1) {
          const next = (phaseIdx + 1) % phases.length;
          if (next === 0) {
            const nr = roundsDone + 1;
            if (nr >= rounds) { clearInterval(intRef.current); setRunning(false); setComplete(true); return 0; }
            setRoundsDone(nr);
          }
          setPhaseIdx(next);
          return phases[(phaseIdx + 1) % phases.length].count;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phaseIdx, roundsDone]);

  const ph = phases[phaseIdx];
  const circ = 2 * Math.PI * 44;
  const dashOff = circ * (secLeft / ph.count);

  return (
    <div style={{ background: FPALE, borderRadius: '14px', padding: '20px', border: `2px solid ${FBORD}`, fontFamily: font, marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: FOREST }}>{name}</div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{rounds} rounds · {phases.map(p => `${p.label} ${p.count}s`).join(' → ')}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke={`${FOREST}18`} strokeWidth="8" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={ph.color || FOREST} strokeWidth="8"
              strokeDasharray={circ} strokeDashoffset={running || complete ? dashOff : circ}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: complete ? '26px' : '22px', fontWeight: '700', color: ph.color || FOREST, fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
              {complete ? '✓' : secLeft}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {complete ? 'Done' : ph.label}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: rounds }).map((_, i) => (
            <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: i < roundsDone ? FOREST : i === roundsDone && running ? `${FOREST}50` : 'var(--border)', transition: 'all 0.3s' }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '7px' }}>
          {!running && !complete ? (
            <button onClick={() => setRunning(true)} style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Start</button>
          ) : running ? (
            <button onClick={() => { setRunning(false); clearInterval(intRef.current); }} style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
          ) : complete ? (
            <button onClick={() => { setPhaseIdx(0); setSecLeft(phases[0].count); setRoundsDone(0); setComplete(false); }} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
          ) : (
            <button onClick={() => setRunning(true)} style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
          )}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '10px', padding: '11px 14px', border: `1px solid ${FBORD}` }}>
        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: FOREST, marginBottom: '4px' }}>🔬 Why This Works</div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{why}</p>
      </div>
    </div>
  );
}

const BREATHING_LIBRARY = [
  {
    id:     'sigh',
    name:   '😮‍💨 Physiological Sigh',
    best:   'Fastest available — 30 seconds',
    phases: [
      { label: 'Inhale 1', count: 2, color: '#2D7D46' },
      { label: 'Inhale 2', count: 1, color: '#4CAF50' },
      { label: 'Long Exhale', count: 6, color: FOREST },
    ],
    rounds: 3,
    why: 'Double inhale re-inflates collapsed alveoli and the long exhale produces the largest single-breath CO2 removal available. Stanford research shows measurable cortisol reduction within 30 seconds — the fastest breathing technique that exists.',
  },
  {
    id:     'box',
    name:   '📦 Box Breathing',
    best:   'Balanced reset — 90 seconds',
    phases: [
      { label: 'Inhale',  count: 4, color: '#2D7D46' },
      { label: 'Hold',    count: 4, color: '#C07800' },
      { label: 'Exhale',  count: 4, color: FOREST },
      { label: 'Hold',    count: 4, color: '#7B2D5E' },
    ],
    rounds: 4,
    why: 'Equal-ratio breathing activates the parasympathetic nervous system while maintaining alertness — ideal for the exam hall. Used by Navy SEALs and surgeons for high-performance, high-stress contexts.',
  },
  {
    id:     'extended',
    name:   '🌊 Extended Exhale',
    best:   'Fastest cortisol drop — 2 minutes',
    phases: [
      { label: 'Inhale', count: 4, color: '#2D7D46' },
      { label: 'Exhale', count: 8, color: FOREST },
    ],
    rounds: 5,
    why: 'The doubled exhale-to-inhale ratio maximally activates the vagus nerve, directly lowering heart rate and cortisol. Huberman Lab research identifies this as the most efficient breathing pattern for cortisol reduction per unit of time.',
  },
  {
    id:     'four78',
    name:   '✨ 4-7-8 Breathing',
    best:   'Deep calm before sleep',
    phases: [
      { label: 'Inhale', count: 4, color: '#2D7D46' },
      { label: 'Hold',   count: 7, color: '#C07800' },
      { label: 'Exhale', count: 8, color: FOREST },
    ],
    rounds: 4,
    why: 'The long hold saturates blood with oxygen and produces a powerful sedative effect — best used the night before or when severe anxiety needs to be fully settled rather than just managed. Less suitable mid-exam due to the sedative intensity.',
  },
];

// ── Confidence Builder Component ───────────────────────────────────────────────
function ExamConfidenceBuilder() {
  const [step,       setStep]       = useState(1);
  const [challenge,  setChallenge]  = useState(null);
  const [proximity,  setProximity]  = useState(null);
  const [mantra,     setMantra]     = useState('');
  const [evidence,   setEvidence]   = useState(['', '', '']);
  const [revealed,   setRevealed]   = useState(false);
  const [activeBreath, setActiveBreath] = useState(null);
  const [openStrat,  setOpenStrat]  = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selChall = CONFIDENCE_CHALLENGES.find(c => c.key === challenge);
  const selProx  = EXAM_PROXIMITY.find(p => p.key === proximity);
  const proxCtx  = proximity ? PROXIMITY_CONTEXT[proximity] : null;

  const evidenceFilled = evidence.filter(e => e.trim().length > 0).length;
  const canProceed = challenge && proximity;

  const handleReset = () => { setStep(1); setChallenge(null); setProximity(null); setMantra(''); setEvidence(['', '', '']); setRevealed(false); setActiveBreath(null); setOpenStrat(null); };

  const updateEvidence = (i, val) => setEvidence(prev => { const n = [...prev]; n[i] = val; return n; });

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? FOREST : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What is your biggest exam confidence challenge?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the one that hits hardest — the pattern that most consistently undermines your confidence.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {CONFIDENCE_CHALLENGES.map(ch => {
              const isSel = challenge === ch.key;
              return (
                <button key={ch.key} onClick={() => setChallenge(ch.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? FOREST : 'var(--border)', background: isSel ? FPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${FBORD}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{ch.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? FOREST : 'var(--ink)', marginBottom: '2px' }}>{ch.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{ch.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (challenge) setStep(2); }} disabled={!challenge} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: challenge ? `linear-gradient(135deg, ${FOREST}, #2A9B84)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: challenge ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: challenge ? `0 6px 18px ${FBORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How close is your exam?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {EXAM_PROXIMITY.map(p => {
              const isSel = proximity === p.key;
              return (
                <button key={p.key} onClick={() => setProximity(p.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? FOREST : 'var(--border)', background: isSel ? FPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${FBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '600', color: isSel ? FOREST : 'var(--ink)' }}>{p.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (proximity) setStep(3); }} disabled={!proximity} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: proximity ? `linear-gradient(135deg, ${FOREST}, #2A9B84)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: proximity ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — mantra + evidence */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Build Your Confidence Anchors
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            These will appear in your final plan. Be specific — generic feels hollow, specific feels true.
          </p>

          {/* Mantra */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', marginBottom: '12px', border: `1.5px solid ${FBORD}` }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: FOREST, marginBottom: '6px' }}>✨ Your Personal Exam Mantra</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>One sentence that is specifically true and specifically yours. Not "I am great" — something honest and grounded. Examples: "I have put in the work and it is there." / "I can handle whatever this paper asks." / "One question at a time."</div>
            <input
              value={mantra}
              onChange={e => setMantra(e.target.value)}
              placeholder='Write your mantra here...'
              maxLength={120}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1.5px solid ${mantra ? FOREST : 'var(--border)'}`, fontFamily: font, fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: 'var(--ink)', transition: 'border-color 0.2s' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '5px', textAlign: 'right' }}>{mantra.length}/120</div>
          </div>

          {/* Evidence */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', marginBottom: '16px', border: `1.5px solid ${FBORD}` }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: FOREST, marginBottom: '5px' }}>📋 Three Things You Actually Know (Evidence of Capability)</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Not general knowledge — three specific things: a fact, a formula, a method, a concept you are confident in for this exam. These are your evidence against self-doubt.</div>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                value={evidence[i]}
                onChange={e => updateEvidence(i, e.target.value)}
                placeholder={`Evidence ${i + 1}: e.g. "I can solve quadratic equations using the formula"`}
                style={{ width: '100%', padding: '9px 14px', borderRadius: '8px', border: `1.5px solid ${evidence[i] ? FOREST : 'var(--border)'}`, fontFamily: font, fontSize: '13px', marginBottom: '8px', outline: 'none', boxSizing: 'border-box', color: 'var(--ink)', transition: 'border-color 0.2s' }}
              />
            ))}
            <div style={{ fontSize: '12px', color: FOREST, fontWeight: '600' }}>{evidenceFilled}/3 evidence items added</div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (canProceed) { setStep(4); setRevealed(false); } }} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`,
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: 'pointer', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Confidence Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — results */}
      {step === 4 && selChall && selProx && proxCtx && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — Your Exam Confidence Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${FBORD}`,
              }}>💚 Reveal My Confidence Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>{selChall.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  Your Confidence Plan
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                  {selChall.label.split(' — ')[0]} · {selProx.label}
                </div>
              </div>

              {/* Time context */}
              <div style={{ background: 'white', border: `1.5px solid ${FBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: FOREST, marginBottom: '5px' }}>
                  {selProx.icon} {proxCtx.focus}
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{proxCtx.msg}</p>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: FOREST, marginBottom: '8px' }}>Priority Actions Right Now:</div>
                {proxCtx.priority_actions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '5px 0', borderBottom: i < proxCtx.priority_actions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{a}</p>
                  </div>
                ))}
              </div>

              {/* Challenge reframe */}
              <div style={{ background: FPALE, border: `1.5px solid ${FBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: FOREST, marginBottom: '7px' }}>
                  🔭 A Different Way to See This
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{selChall.reframe}</p>
              </div>

              {/* Three strategies — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: FOREST, marginBottom: '9px' }}>
                  🎯 Your Three Confidence Strategies
                </div>
                {selChall.strategy.map((s, i) => {
                  const isOpen = openStrat === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${FBORD}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStrat(isOpen ? null : i)} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg, ${FOREST}, #2A9B84)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: FOREST, flex: 1 }}>{s.split(' ').slice(0, 5).join(' ')}…</span>
                        <span style={{ color: FOREST, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{s}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pre-exam ritual */}
              <div style={{ background: FPALE, border: `1.5px solid ${FBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: FOREST, marginBottom: '6px' }}>
                  ⚡ Your Pre-Exam Confidence Ritual
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selChall.ritual}</p>
              </div>

              {/* User's mantra + evidence */}
              <div style={{ background: 'white', border: `2px solid ${FBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: FOREST, marginBottom: '8px' }}>📋 Your Confidence Anchors — Read These Before the Exam</div>
                <div style={{ background: FPALE, borderRadius: '9px', padding: '12px 14px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: FOREST, marginBottom: '4px', textTransform: 'uppercase' }}>Your Mantra:</div>
                  {mantra ? (
                    <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: FOREST, fontStyle: 'italic', lineHeight: 1.5 }}>"{mantra}"</p>
                  ) : (
                    <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: FOREST, fontStyle: 'italic', lineHeight: 1.5 }}>"{selChall.affirmation.replace(/"/g, '')}"</p>
                  )}
                </div>
                {evidenceFilled > 0 && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: FOREST, marginBottom: '6px', textTransform: 'uppercase' }}>Your Evidence of Capability:</div>
                    {evidence.filter(e => e.trim()).map((ev, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0' }}>
                        <span style={{ color: FOREST, fontWeight: '700', flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{ev}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Breathing exercises */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: FOREST, marginBottom: '9px' }}>
                  💨 Breathing Toolkit — Use Any Now
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
                  {BREATHING_LIBRARY.map(b => {
                    const isActive = activeBreath === b.id;
                    return (
                      <button key={b.id} onClick={() => setActiveBreath(isActive ? null : b.id)} style={{
                        padding: '10px 12px', borderRadius: '10px', border: '1.5px solid',
                        borderColor: isActive ? FOREST : 'var(--border)', background: isActive ? FPALE : 'white',
                        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: isActive ? FOREST : 'var(--ink)', marginBottom: '2px' }}>{b.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{b.best}</div>
                      </button>
                    );
                  })}
                </div>
                {activeBreath && (() => {
                  const br = BREATHING_LIBRARY.find(b => b.id === activeBreath);
                  return br ? <BreathingExercise {...br} onClose={() => setActiveBreath(null)} /> : null;
                })()}
              </div>

              {/* Final affirmation */}
              <div style={{ background: 'white', border: `1.5px dashed ${FBORD}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: FOREST, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "{selChall.affirmation.replace(/"/g, '')}"
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${FBORD}`, color: FOREST, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StayCalmDuringExams({ navigate, relatedPosts }) {
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
      <p>There is a student in every exam hall who looks completely calm. They sit down, read through the paper, and begin writing with a kind of settled focus that looks, to everyone around them, like natural confidence. Occasionally this person is genuinely untroubled. More often, they have built something — a set of mindset tools, physical practices, and pre-exam rituals that allow them to function well even when their nervous system is doing exactly what yours is.</p>

      <p><strong>Exam confidence tips</strong> are not about eliminating anxiety. Some anxiety improves performance — you know this. They are about ensuring the anxiety stays within the range where it sharpens focus rather than tipping into the range where it blocks access. That range is wider than most students believe, and reaching it is more learnable than it appears from the outside.</p>

      <img
        src={meta.imgUrl}
        alt="Student staying calm and confident during exams — using mindset strategies, breathing techniques, and a pre-exam confidence routine"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-confidence">1. What Exam Confidence Actually Is (And Isn't)</h3>
      <p>The most persistent misconception about exam confidence is that it is a stable personality trait — something some students have and others do not, based on temperament or natural ability. This is not what the research shows. Exam confidence is a state, not a trait, and it is produced by a specific set of conditions: adequate preparation, physiological regulation, accurate self-perception of capability, and a pre-built response system for the moments when anxiety rises.</p>
      <p>Psychologist Albert Bandura's concept of self-efficacy — the belief in one's ability to execute a specific task in a specific situation — is the most directly applicable construct. Self-efficacy for exams is not self-esteem (general positive regard for oneself) and it is not optimism (expecting good outcomes). It is the specific, evidence-based belief that you can perform this task, built from: past performance (what have you actually done before?), vicarious experience (watching people like you succeed), verbal encouragement, and physiological state (which is why a student in physical panic has lower self-efficacy for the same exam than a regulated, calm student with identical preparation).</p>
      <p>What exam confidence is not: the absence of anxiety, the certainty of a good result, or a fixed quantity that you either possess or do not. It is a dynamic state that can be reduced by poor sleep, negative self-talk, and social comparison, and increased by adequate preparation, physical regulation, competence recall, and a pre-built response to moments of difficulty. Every one of those inputs is within your influence.</p>
      <p>The practical implication is significant: exam confidence is not something you hope to feel on exam day. It is something you build across the days before and activate deliberately through specific practices on the day itself. The student who walks into the hall with a pre-built confidence system is categorically different from the student who hopes to feel okay when they get there.</p>

      {/* ── Section 2 ── */}
      <h3 id="mindset">2. Seven Mindset Strategies for Exam Calm and Confidence</h3>

      <p><strong>1. Reframe anxiety as readiness — not threat.</strong> Research by Alison Wood Brooks at Harvard Business School demonstrated that students who told themselves "I am excited" before a high-stakes performance — rather than trying to calm down — performed significantly better. The physiological state of anxiety and the physiological state of excited readiness are nearly identical: elevated heart rate, increased adrenaline, heightened sensory alertness. The difference is the cognitive label applied. Treating pre-exam activation as "my body preparing for something it knows matters" rather than "I am failing at being calm" is not denial — it is an accurate reframing of a physical state that is genuinely useful in moderate doses.</p>

      <p><strong>2. Build a pre-exam competence recall.</strong> Anxiety distorts memory in a specific direction — it makes evidence of capability hard to access while making evidence of failure readily available. This is not character weakness; it is the negativity bias operating under cortisol. The solution is pre-building an evidence list before anxiety arrives. Write three to five specific things you know for this exam — specific facts, formulas, methods, or concepts you are genuinely confident in — and read this list immediately before entering the hall. The specificity of the recall provides concrete evidence of capability that the anxious brain cannot easily dismiss.</p>

      <p><strong>3. Create a personal exam mantra.</strong> A mantra is not a positive affirmation disconnected from reality. It is a short, honest, specific statement that you can genuinely believe that anchors you to your actual situation rather than your anxious interpretation of it. "I have prepared. The information is there. One question at a time." is more effective than "I am going to be brilliant" because it is believable and specific. Repeat it before the exam, in the hall if needed, and whenever the internal narrative starts spiralling.</p>

      <p><strong>4. Separate your identity from the result.</strong> Much of exam anxiety is about what the result will mean — about whether a particular score confirms or challenges your sense of worth, capability, and belonging. This weight is understandable and genuinely felt, but it is also categorically disproportionate to what an exam can actually reveal about a person. An exam result is one data point about your performance on specific questions on a specific day. It is not a verdict on your intelligence, your character, your future, or your value as a person. Holding this distinction explicitly — not just intellectually but emotionally — is the mindset shift that removes the most significant source of exam-elevating pressure.</p>

      <p><strong>5. Practise confidence in low-stakes conditions.</strong> Confidence under pressure is built through the accumulation of handled difficulty in practice. Every timed practice paper you completed under realistic conditions, every moment you experienced anxiety during preparation and kept working anyway, every hard question you attempted rather than skipped — these are the practice reps of confidence. Seek them out deliberately during preparation, not because they feel good (they often do not) but because each one expands the body of evidence that you can function under exam-like conditions. Confidence is not summoned on exam day. It is the residue of practice.</p>

      <p><strong>6. Use the growth mindset response to difficult questions.</strong> Carol Dweck's research at Stanford on growth mindset shows that the critical decision point is not how difficult the material is — it is how a student interprets encountering difficulty. A fixed mindset student encountering a hard question concludes: "I cannot do this — I am not capable." A growth mindset student encountering the same question concludes: "This is difficult — what do I know that is relevant here, and what can I attempt?" The shift from "I cannot" to "what can I try?" does not require confidence as a prerequisite — it is itself the practice of confidence under pressure.</p>

      <p><strong>7. Pre-commit to your response to difficulty.</strong> The moment of exam difficulty — a question you did not expect, a section that seems harder than you prepared for — is not the moment to decide how to respond. Pre-decide: "If I encounter a question I cannot immediately answer, I will mark it, write one sentence of anything I know, move to the next question, and return." Having a pre-committed response to difficulty removes the decision-making that would otherwise happen under peak stress, and prevents the panic spiral that blank questions can produce when no response plan exists.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Exam Confidence Builder</h3>
      <p>The Confidence Builder creates a personalised plan for your specific confidence challenge and your current time window. You will write your own exam mantra and evidence of capability — these will appear in your plan. The result includes a contextual strategy, your three tailored confidence techniques, a pre-exam ritual, and a full breathing toolkit with timed exercises you can use right now.</p>

      <ExamConfidenceBuilder />

      {/* ── Section 4 ── */}
      <h3 id="breathing">4. Breathing Techniques to Stay Calm in the Exam Hall</h3>
      <p>The four breathing exercises in the Confidence Builder above can also be accessed here with fuller context on when and how to use each one. They are not alternatives to each other — they are tools for different moments and different levels of activation.</p>
      <p><strong>The Physiological Sigh (immediate crisis — 30 seconds).</strong> Double inhale through the nose (full breath, then a second sharp top-up to fully inflate the lungs), followed by one long slow exhale through the mouth. Three repetitions. This is the body's own built-in emergency reset, and Stanford neuroscientist Andrew Huberman's research identifies it as the single fastest breath manipulation for lowering subjective anxiety. It re-inflates collapsed alveoli that shallow stress-breathing produces and provides the largest available CO2 removal per breath. Invisible when done seated in an exam hall. Use at the first sign of panic onset.</p>
      <p><strong>Box Breathing (sustained calm — 2 minutes).</strong> In for 4 counts, hold for 4, out for 4, hold for 4. Four complete rounds. This equal-ratio technique activates the parasympathetic nervous system while preserving alertness — making it uniquely suitable for exam conditions where you need calm without drowsiness. Used as a standard practice by military personnel in high-performance, high-stress operational contexts. Best practised in advance so the pattern is automatic in the hall.</p>
      <p><strong>Extended Exhale (fast cortisol reduction — 2 minutes).</strong> In for 4 counts, out for 8 counts. Five rounds. The doubled exhale-to-inhale ratio maximises vagal nerve activation, which directly signals the heart to slow and the cortisol response to begin down-regulating. Best for the 10-15 minutes before entering the hall, or during the first moments of the exam while reading through the paper.</p>
      <p><strong>4-7-8 Breathing (deep calm — for the night before).</strong> In for 4, hold for 7, out for 8. The strongest sedative breath technique available without medication. Best reserved for the night before the exam when sleep is elusive — the intensity of the sedation makes it less suitable for mid-exam use, but it is highly effective for the pre-sleep anxiety that exam night produces.</p>

      {/* ── Section 5 ── */}
      <h3 id="morning">5. Your Confidence Morning Routine — Step by Step</h3>
      <p>The morning of an exam is not the time to discover that you do not have a routine. The routine needs to be built before the day, decided in advance, and followed without modification on exam morning — because the familiarity and structure of a consistent routine is itself a signal to the nervous system that this moment is manageable and known.</p>
      <p><strong>Step 1 (7:00am) — No phone for the first 20 minutes.</strong> The first input you give your brain sets the cognitive and emotional tone for the hour that follows. Starting with a social media feed or a group chat full of pre-exam anxiety is one of the most reliable ways to spike morning cortisol. For twenty minutes after waking, engage only with the physical environment: light, water, gentle movement.</p>
      <p><strong>Step 2 (7:20am) — Eat something real.</strong> Nausea is a normal pre-exam symptom and does not mean the stomach needs to remain empty. Something small and protein-containing — yoghurt, eggs, toast with nut butter — within the first hour of waking stabilises blood sugar for the next three to four hours and prevents the glucose crash that amplifies anxiety symptoms and degrades cognitive performance. Students who skip breakfast for exams consistently report feeling worse, not better, in the first hour of the paper.</p>
      <p><strong>Step 3 (7:45am) — Read your confidence anchors.</strong> Your mantra once, spoken out loud if possible. Your evidence list — three specific things you know — read slowly and believed, not scanned. This deliberate pre-activation of your competence evidence base takes less than two minutes and produces a measurably different internal state for the exam than beginning with nothing.</p>
      <p><strong>Step 4 (8:00am) — Five minutes of physical movement.</strong> A brisk walk, stair climbing, or anything vigorous before leaving home. The adrenaline produced overnight by anticipatory anxiety is physiologically designed to fuel physical action. Using it for five minutes of movement dissipates it faster than any sitting-based regulation technique and arrives at the exam centre with a lower residual cortisol level than the student who sat anxiously at home for the same five minutes.</p>
      <p><strong>Step 5 (Travelling) — Headphones in, specific playlist.</strong> A playlist associated specifically with focus and calm — not one that amplifies emotion, whether excited or anxious. The audio environment during travel to an exam is one of the most underrated confidence variables. It determines whether the final twenty minutes before entering the hall are spent in your own mental space or in the ambient anxiety of public transport.</p>
      <p><strong>Step 6 (Outside the hall) — Three physiological sighs.</strong> Before entering — in the corridor or outside the building — double inhale through the nose, long exhale through the mouth. Three times. This takes thirty seconds and produces a measurable physiological reset before the paper is even in your hands. Then enter, find your seat, arrange your materials, and settle before the invigilator speaks.</p>
      <p><strong>Step 7 (At the desk) — Micro-release and read everything first.</strong> Unclench your jaw. Drop your shoulders. Feel both feet on the floor. When the paper arrives, read everything — all questions — before writing a single word. This two-minute investment gives you a complete map, reduces the shock of difficult questions encountered mid-flow, enables strategic time allocation, and provides the cognitive relief of recognising what you can answer before the time pressure has begun.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Exam Confidence FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I feel confident before the exam but lose it the moment I see the paper. What is happening?</strong><br />
        A: The transition from pre-exam environment to exam hall is one of the highest cortisol spikes in the entire exam process — the moment of receiving the paper is where the abstract anticipation becomes concrete reality. Students who feel confident before this moment often experience a sharp activation of the threat response at the exact moment the paper lands. The solution is to have a pre-committed first response to the paper: put it face down for five seconds, take one physiological sigh, then turn it over and read everything before reacting. This five-second pause breaks the automatic panic cascade and allows the initial cortisol spike to begin subsiding before you engage with the content.</p>

        <p><strong>Q: How do I stop the spiral of "I cannot do this" once it starts in the exam?</strong><br />
        A: The spiral is maintained by the cognitive content (the thought itself) and by the physical activation it produces (rapid breathing, racing heart, muscle tension). Address both simultaneously. Physically: three box breaths and a body scan release (jaw, shoulders, hands). Cognitively: name the spiral out loud or in your head — "I am in a spiral right now" — then write on paper: "One thing I know about this topic is [anything at all]." The labelling of the spiral activates the prefrontal cortex (which reduces amygdala activation) and the act of writing — on anything, however partial — shifts the brain from passive anxious observing to active doing, which is itself regulating.</p>

        <p><strong>Q: My confidence is genuinely low because my preparation is genuinely insufficient. What then?</strong><br />
        A: Honest acknowledgment of genuine under-preparation is more useful than false confidence. The practical question shifts from "how do I feel confident" to "how do I perform as well as possible given where I am." The triage approach from the time management guide applies: identify the highest-frequency exam topics, attempt to score the available marks on those rather than attempting comprehensive coverage of everything, and go into the exam with the specific, honest intention of maximising the marks available for what you do know rather than being paralysed by what you do not. Partial marks on partial knowledge score better than zero marks from paralysis. Something rather than nothing is always the better exam strategy.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: FOREST, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Confidence is not the absence of fear. It is the decision to proceed with what you have prepared — including a plan for when it gets hard."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          You will feel anxious. That is not evidence that something has gone wrong — it is evidence that you care about something real. The students who perform best under exam pressure are not the ones who feel least anxious. They are the ones with a system ready to activate when the anxiety rises, so that the anxiety becomes energy rather than obstacle. Build the system now. Trust it when you need it.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: FOREST, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${FBORD}` }}
          >
            Build Confidence in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: FOREST, border: `2px solid ${FOREST}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Confidence Strategy
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Complete Your Exam Preparation:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-anxiety-help',            '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/exam-stress-management',       '→ How to Handle Exam Stress Without Panic (Student Guide)'],
            ['/blog/avoid-exam-panic',             '→ How to Avoid Last-Minute Exam Anxiety and Panic'],
            ['/blog/quick-stress-relief-students', '→ 5-Minute Stress Relief Techniques for Busy Students'],
            ['/blog/sleep-academic-performance',   '→ How Sleep Affects Academic Performance and Mental Health'],
            ['/safe',                              '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: FOREST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
