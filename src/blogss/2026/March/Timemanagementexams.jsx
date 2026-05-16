import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Time Management Tips for Students During Exams",
  excerpt: "Exam time management is not about studying more hours — it is about spending the right hours on the right subjects in the right order. Learn the prioritisation methods that work under exam pressure, see real timetable examples, and use our Exam Time Planner to build a structured revision schedule for your specific situation.",
  category: "Mental Health",
  date: "09-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/time-management-exams.jpg",
  tldr: "Time management for exams fails for most students not because they lack discipline but because they lack a structured prioritisation system. Without one, students naturally gravitate toward subjects they enjoy rather than subjects that need the most work, and toward studying rather than practising, which are entirely different activities with very different outcomes. This guide covers five prioritisation methods, three timetable examples, twelve practical tips, and an interactive Exam Time Planner that builds a personalised revision structure for your exam context.",
  toc: [
    { id: "why-fail",       title: "1. Why Exam Time Management Fails for Most Students",              level: 3 },
    { id: "prioritisation", title: "2. Five Prioritisation Methods That Work Under Exam Pressure",     level: 3 },
    { id: "planner",        title: "3. Interactive: The Exam Time Planner",                            level: 3 },
    { id: "timetables",     title: "4. Three Timetable Examples for Different Exam Contexts",          level: 3 },
    { id: "twelve-tips",    title: "5. Twelve Time Management Tips for Exam Season",                   level: 3 },
    { id: "faq",            title: "6. Exam Time Management FAQs",                                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-09T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "time management for exams, exam time management tips, exam revision timetable, prioritisation methods students, study schedule exams, how to manage time during exams, exam preparation tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do students manage time effectively during exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Effective exam time management requires four elements: an accurate subject priority list (weighted by exam date, mark allocation, and current understanding level — not by personal preference), a structured daily timetable that allocates the most time to the highest-priority subjects, a balance between new learning and active practice (most students under-practise and over-revise), and a weekly review that adjusts the plan based on actual progress rather than assuming the original plan was perfectly calibrated.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I make a revision timetable for exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To make an effective revision timetable: list all your exam dates and subjects, calculate the days available for each subject, rate each subject by difficulty and current confidence level, allocate proportionally more time to weaker and higher-weighted subjects, build in daily practice sessions (not just notes review), include genuine rest days (at least one full day off per week), and review and adjust the timetable every Sunday based on actual progress.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best time management method for exam preparation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective single time management approach for exam preparation combines the Eisenhower Matrix (urgency vs importance) for daily task prioritisation with spaced repetition scheduling (reviewing material at increasing intervals rather than massing it into single sessions). Research consistently shows that students who distribute their revision over multiple shorter sessions with increasing gaps between them retain significantly more than students who study the same material in one or two long sessions.",
      },
    },
  ],
};

// ── Exam Time Planner Data ─────────────────────────────────────────────────────
const PLUM   = '#7B4F9B';
const PPALE  = '#F4EFF9';
const PBORD  = 'rgba(123,79,155,0.22)';

const EXAM_CONTEXTS = [
  { key: 'board_final',  icon: '📋', label: 'Board Exam / Final Year',       desc: 'High-stakes, multiple subjects, long preparation window' },
  { key: 'competitive',  icon: '🎯', label: 'Competitive / Entrance Exam',   desc: 'JEE, NEET, or similar — single exam, all subjects at once' },
  { key: 'college_sem',  icon: '🎓', label: 'College Semester Exams',         desc: 'University internals and end-sems — 5-8 subjects in 2-3 weeks' },
  { key: 'internal',     icon: '📝', label: 'Internal / Unit Tests',          desc: 'Shorter preparation window — one or two subjects at a time' },
];

const DAYS_TO_EXAM = [
  { key: 'd30', label: '30+ days',   value: 30 },
  { key: 'd14', label: '14-29 days', value: 14 },
  { key: 'd7',  label: '7-13 days',  value: 7  },
  { key: 'd3',  label: '3-6 days',   value: 3  },
  { key: 'd1',  label: '1-2 days',   value: 1  },
];

const CURRENT_PREP = [
  { key: 'strong',   icon: '💚', label: 'Strong — I have covered most material' },
  { key: 'moderate', icon: '🟡', label: 'Moderate — some gaps, some solid areas' },
  { key: 'weak',     icon: '🔴', label: 'Weak — significant gaps or just starting' },
];

const BIGGEST_CHALLENGE = [
  { key: 'too_much',     icon: '🗂️', label: 'Too much to cover — do not know what to prioritise' },
  { key: 'procrastinate',icon: '😮‍💨', label: 'Procrastination — starting is the hardest part' },
  { key: 'balance',      icon: '⚖️', label: 'Balancing multiple subjects without neglecting any' },
  { key: 'recall',       icon: '🧠', label: 'Studying but not retaining — low confidence on recall' },
  { key: 'time',         icon: '⏰', label: 'Running out of time — less available than planned' },
];

const CONTEXT_PLANS = {
  board_final: {
    title: 'Board / Final Year Exam Plan',
    phase_system: true,
    phases: [
      {
        name: 'Phase 1 — Foundation (First 60%)',
        color: '#2D7D46',
        daily: [
          { time: '6:30–9:00 AM',   activity: 'Subject A — New material, high difficulty',   type: 'study' },
          { time: '9:00–9:30 AM',   activity: 'Break + movement',                             type: 'break' },
          { time: '9:30–11:30 AM',  activity: 'Subject B — New material',                     type: 'study' },
          { time: '11:30–1:00 PM',  activity: 'Subject A — Practice questions from today',    type: 'practice' },
          { time: '1:00–3:00 PM',   activity: 'Lunch + rest',                                 type: 'break' },
          { time: '3:00–4:30 PM',   activity: 'Subject C — New material',                     type: 'study' },
          { time: '4:30–5:30 PM',   activity: 'Subject B — Practice questions',               type: 'practice' },
          { time: '5:30–6:30 PM',   activity: 'Personal time',                                type: 'free' },
          { time: '6:30–7:30 PM',   activity: 'Subject C — Quick review of today',            type: 'study' },
          { time: '7:30–9:00 PM',   activity: 'Dinner + family',                              type: 'break' },
          { time: '9:00–10:00 PM',  activity: 'Tomorrow planning + shutdown',                  type: 'admin' },
        ],
        focus: 'Cover all topics at least once. Do not re-read — use active recall after each section.',
      },
      {
        name: 'Phase 2 — Consolidation (Next 30%)',
        color: '#C07800',
        daily: [
          { time: '6:30–8:30 AM',   activity: 'Weakest subject — targeted gap filling',       type: 'study' },
          { time: '8:30–9:00 AM',   activity: 'Break',                                        type: 'break' },
          { time: '9:00–11:00 AM',  activity: 'Past papers — timed practice (full questions)', type: 'practice' },
          { time: '11:00–12:00 PM', activity: 'Review wrong answers immediately',              type: 'study' },
          { time: '12:00–2:00 PM',  activity: 'Lunch + rest',                                 type: 'break' },
          { time: '2:00–4:00 PM',   activity: 'Second subject — past papers',                  type: 'practice' },
          { time: '4:00–4:30 PM',   activity: 'Break',                                        type: 'break' },
          { time: '4:30–6:00 PM',   activity: 'Third subject — targeted revision of weak areas',type: 'study' },
          { time: '6:00–7:00 PM',   activity: 'Free time',                                     type: 'free' },
          { time: '7:00–8:30 PM',   activity: 'Flashcard review across all subjects',          type: 'practice' },
          { time: '9:00–9:30 PM',   activity: 'Tomorrow plan + shutdown',                      type: 'admin' },
        ],
        focus: 'Past papers are the primary tool now. Practice > revision. Every wrong answer must be reviewed the same day.',
      },
      {
        name: 'Phase 3 — Final Sprint (Last 10%)',
        color: PLUM,
        daily: [
          { time: '7:00–9:00 AM',   activity: 'High-yield revision — key formulae, definitions, diagrams', type: 'study' },
          { time: '9:00–9:30 AM',   activity: 'Break + light movement',                        type: 'break' },
          { time: '9:30–11:30 AM',  activity: 'Mock test under exam conditions',               type: 'practice' },
          { time: '11:30–12:00 PM', activity: 'Review errors + flag gaps',                     type: 'study' },
          { time: '12:00–1:30 PM',  activity: 'Lunch + rest',                                  type: 'break' },
          { time: '1:30–3:00 PM',   activity: 'Fill flagged gaps from morning mock',           type: 'study' },
          { time: '3:00–3:30 PM',   activity: 'Break',                                         type: 'break' },
          { time: '3:30–5:00 PM',   activity: 'Quick revision — strongest subject (confidence boost)', type: 'study' },
          { time: '5:00 PM+',       activity: 'Rest, walk, personal time — no new learning',   type: 'free' },
          { time: '9:00–9:30 PM',   activity: 'Tomorrow materials prep + shutdown',             type: 'admin' },
        ],
        focus: 'No new material in the final 10%. Consolidate, practise, rest. Sleep is the highest-priority study strategy now.',
      },
    ],
    key_rules: [
      'Allocate time proportional to exam weight × weakness, not personal preference',
      'One subject per morning block — your peak performance window for the hardest content',
      'Past papers weekly from Phase 1 onwards — not only in the final phase',
      'Sunday = review week + plan next week. Never enter a week without a plan.',
      'Sleep 8 hours. This is not negotiable for cognitive performance.',
    ],
  },
  competitive: {
    title: 'Competitive Exam Plan (JEE / NEET)',
    phase_system: false,
    daily: [
      { time: '5:30–6:00 AM',   activity: 'Wake up + 20 min physical exercise',              type: 'break' },
      { time: '6:00–8:30 AM',   activity: 'Subject 1 — Hardest topic / weakest area',        type: 'study' },
      { time: '8:30–9:00 AM',   activity: 'Breakfast + break',                               type: 'break' },
      { time: '9:00–11:30 AM',  activity: 'Subject 2 — New concept + practice problems',     type: 'study' },
      { time: '11:30–1:00 PM',  activity: 'Subject 1 — Practice problems (timed)',           type: 'practice' },
      { time: '1:00–2:30 PM',   activity: 'Lunch + rest (nap if needed)',                    type: 'break' },
      { time: '2:30–4:30 PM',   activity: 'Subject 3 — New concept + problems',              type: 'study' },
      { time: '4:30–5:00 PM',   activity: 'Break',                                           type: 'break' },
      { time: '5:00–7:00 PM',   activity: 'Mock test / Mixed practice (all three subjects)',  type: 'practice' },
      { time: '7:00–7:30 PM',   activity: 'Review errors from mock — essential, same day',   type: 'study' },
      { time: '7:30–9:00 PM',   activity: 'Dinner + personal time',                          type: 'free' },
      { time: '9:00–10:00 PM',  activity: 'Light review / flashcards — no new heavy concepts',type: 'study' },
      { time: '10:00 PM',       activity: 'Shutdown — 7-hour sleep minimum',                 type: 'break' },
    ],
    key_rules: [
      'Track mock test scores weekly on a graph — data beats intuition for where to focus',
      'Every error in practice must be reviewed the same day, not the next day',
      'One full rest day per week — not optional. Sustainable preparation requires genuine recovery.',
      'Physical exercise is not optional — it directly improves focus and retention through BDNF production',
      'Weak topics get morning sessions (peak performance). Strong topics get afternoon.',
    ],
  },
  college_sem: {
    title: 'College Semester Exam Plan',
    phase_system: false,
    daily: [
      { time: '7:00–9:00 AM',   activity: 'Priority subject — highest weight or weakest',    type: 'study' },
      { time: '9:00–9:30 AM',   activity: 'Break + movement',                                type: 'break' },
      { time: '9:30–11:30 AM',  activity: 'Second priority subject',                          type: 'study' },
      { time: '11:30–12:30 PM', activity: 'Practice Qs or past papers — Subject 1',          type: 'practice' },
      { time: '12:30–2:00 PM',  activity: 'Lunch + rest',                                    type: 'break' },
      { time: '2:00–3:30 PM',   activity: 'Third subject — lighter review or new units',     type: 'study' },
      { time: '3:30–4:00 PM',   activity: 'Break',                                           type: 'break' },
      { time: '4:00–5:30 PM',   activity: 'Subject 2 — Practice questions',                  type: 'practice' },
      { time: '5:30–7:00 PM',   activity: 'Personal time — protected',                       type: 'free' },
      { time: '7:00–8:30 PM',   activity: 'Subject rotation — review today\'s content',      type: 'study' },
      { time: '8:30–9:00 PM',   activity: 'Tomorrow plan + all subjects quick summary',       type: 'admin' },
      { time: '10:30 PM',       activity: 'Sleep — 8 hours',                                  type: 'break' },
    ],
    key_rules: [
      'Map all exam dates on Day 1 of prep — the sequence determines the priority order',
      'The exam happening first is not always the highest priority — weight it by difficulty and current gaps',
      'Do not revise all subjects at shallow depth. Rotate deep coverage across subjects by day.',
      'For every subject: one day of new learning, next day of practice on that content.',
      'College exams test specific question patterns — past papers from the same professor/department are gold.',
    ],
  },
  internal: {
    title: 'Internal Test / Unit Test Plan',
    phase_system: false,
    daily: [
      { time: 'Day 1 morning',  activity: 'Full content scan — know what is in scope',       type: 'study' },
      { time: 'Day 1 afternoon', activity: 'Key concepts — active recall, not re-reading',   type: 'study' },
      { time: 'Day 1 evening',  activity: 'Practice questions from this unit',               type: 'practice' },
      { time: 'Day 2 morning',  activity: 'Weak areas from yesterday\'s practice — fill gaps',type: 'study' },
      { time: 'Day 2 afternoon', activity: 'Full mock on this unit (timed)',                  type: 'practice' },
      { time: 'Day 2 evening',  activity: 'Review every wrong answer + high-yield summary',  type: 'study' },
      { time: 'Day 3 morning',  activity: 'Quick revision of key points — nothing new',      type: 'study' },
      { time: 'Day 3 afternoon', activity: 'Rest and preparation — do not cram the night before', type: 'break' },
      { time: 'Day 3 evening',  activity: 'Materials ready, shutdown by 10pm, sleep 8 hours', type: 'break' },
    ],
    key_rules: [
      'With limited time, practice always beats revision — one past paper reveals more gaps than re-reading notes',
      'Day 1: understand the scope. Day 2: practice and correct. Day 3: consolidate and rest.',
      'Do not add new content on Day 3 — consolidate what you have, rest the brain for recall',
      'Wrong answers are your most valuable data — review them the same day',
      'The night before: materials ready by 9pm, sleep by 10:30pm. The brain consolidates during sleep.',
    ],
  },
};

const CHALLENGE_PLANS = {
  too_much: {
    method: 'The Impact-Effort Matrix',
    description: 'When everything feels urgent, use a simple 2×2 grid to sort your topics. High impact (high exam weight or marks) + low effort (topics you partially know) goes first. High impact + high effort goes second. Low impact + low effort goes third. Low impact + high effort is cut or given minimal time. This immediately reveals your real priority order rather than the order in which topics appear in the textbook.',
    steps: [
      'List every topic across all subjects',
      'Rate each: High/Low impact (exam weight), High/Low effort (your current gap)',
      'Study in order: High Impact / Low Effort → High Impact / High Effort → Low Impact / Low Effort',
      'Cut or deprioritise: Low Impact / High Effort',
    ],
  },
  procrastinate: {
    method: 'The Two-Minute Start Protocol',
    description: 'Procrastination during exam season is almost always about the size of the commitment feeling too large. The solution is to make the commitment microscopic until momentum builds. Commit to two minutes on your hardest or most-avoided subject. Not twenty-five — two. Set a physical timer. In almost every case, the momentum of starting carries the session well beyond two minutes. Starting was the barrier, not the task.',
    steps: [
      'Identify your most-avoided subject',
      'Commit to two minutes only — say it out loud: "Two minutes. That\'s all."',
      'Set a physical timer and begin',
      'When the timer rings, decide: continue for another two minutes or stop?',
    ],
  },
  balance: {
    method: 'The Exam-Weighted Rotation System',
    description: 'The most common balance failure is spending equal time on all subjects regardless of their exam date, mark weight, or your current skill gap. The rotation system fixes this by assigning days not equally but proportionally — each subject gets days in the schedule proportional to its exam weight multiplied by your weakness in it.',
    steps: [
      'List all subjects with their exam weight percentage',
      'Rate your current confidence in each (1-3)',
      'Multiply: exam weight × (4 - confidence) to get your allocation number',
      'Divide the coming week\'s study days proportionally by these numbers',
    ],
  },
  recall: {
    method: 'Active Recall + Spaced Repetition',
    description: 'Studying but not retaining is almost universally a study method problem, not a memory problem. Re-reading notes is the least effective study method — it produces familiarity without retrieval strength. Active recall (testing yourself on content without looking at notes) is significantly more effective. Combine it with spaced repetition (reviewing content at increasing intervals) for maximum retention with minimum time.',
    steps: [
      'After each study section, close your notes and write everything you remember',
      'Check against your notes and correct gaps',
      'Flag what you got wrong for review in 1 day, then 3 days, then 7 days',
      'Flashcards, past questions, or the Feynman technique (explain concepts aloud simply) all use active recall',
    ],
  },
  time: {
    method: 'The Triage System',
    description: 'When time is critically short, the worst strategy is spreading thin across all topics. The triage system prioritises ruthlessly: identify the 20% of content that is likely to yield 80% of marks (high-frequency exam topics), and cover those deeply rather than all topics shallowly. This is the only evidence-based approach to genuinely limited time.',
    steps: [
      'Identify topics most frequently tested in past papers for each subject',
      'Focus exclusively on these high-frequency topics first',
      'For each topic: one focused study session + one practice session — then move on',
      'Accept that some topics will not be covered — prioritise the ones worth the most marks',
    ],
  },
};

// ── Exam Time Planner Component ────────────────────────────────────────────────
function ExamTimePlanner() {
  const [step,       setStep]      = useState(1);
  const [context,    setContext]   = useState(null);
  const [days,       setDays]      = useState(null);
  const [prep,       setPrep]      = useState(null);
  const [challenge,  setChallenge] = useState(null);
  const [revealed,   setRevealed]  = useState(false);
  const [activePhase,setActivePhase] = useState(0);
  const [openRow,    setOpenRow]   = useState(null);

  const font      = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selCtx    = EXAM_CONTEXTS.find(c => c.key === context);
  const selDays   = DAYS_TO_EXAM.find(d => d.key === days);
  const selPrep   = CURRENT_PREP.find(p => p.key === prep);
  const selChal   = BIGGEST_CHALLENGE.find(c => c.key === challenge);
  const plan      = context ? CONTEXT_PLANS[context] : null;
  const chalPlan  = challenge ? CHALLENGE_PLANS[challenge] : null;

  const handleReset = () => { setStep(1); setContext(null); setDays(null); setPrep(null); setChallenge(null); setRevealed(false); setActivePhase(0); setOpenRow(null); };

  const TYPE_DOT = { study: PLUM, practice: '#C07800', break: '#2D7D46', free: '#B85C38', admin: '#666' };
  const TYPE_LABEL = { study: '📘 Study', practice: '⚡ Practice', break: '🌿 Break', free: '⭐ Free', admin: '📋 Admin' };

  const timeRows = plan ? (plan.phase_system ? CONTEXT_PLANS[context].phases[activePhase].daily : CONTEXT_PLANS[context].daily) : [];
  const keyRules = plan ? (plan.phase_system ? CONTEXT_PLANS[context].phases[activePhase].focus : null) : null;
  const planRules = plan?.key_rules || [];

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? PLUM : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — exam context */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What are you preparing for?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            The planning structure differs significantly by context — choose the closest match.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {EXAM_CONTEXTS.map(c => {
              const isSel = context === c.key;
              return (
                <button key={c.key} onClick={() => setContext(c.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)', background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${PBORD}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? PLUM : 'var(--ink)', marginBottom: '2px' }}>{c.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (context) setStep(2); }} disabled={!context} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: context ? `linear-gradient(135deg, ${PLUM}, #9B6FC0)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: context ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: context ? `0 6px 18px ${PBORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — days to exam */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How long until your first exam?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Time remaining determines which phase of the plan you should be in.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {DAYS_TO_EXAM.map(d => {
              const isSel = days === d.key;
              return (
                <button key={d.key} onClick={() => setDays(d.key)} style={{
                  padding: '14px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)', background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
                  boxShadow: isSel ? `0 0 0 2px ${PBORD}` : 'none',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: isSel ? PLUM : 'var(--ink)' }}>{d.label}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (days) setStep(3); }} disabled={!days} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: days ? `linear-gradient(135deg, ${PLUM}, #9B6FC0)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: days ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — current prep level */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What is your current preparation level?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest — this shapes how much new learning vs practice time you need.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {CURRENT_PREP.map(p => {
              const isSel = prep === p.key;
              return (
                <button key={p.key} onClick={() => setPrep(p.key)} style={{
                  padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)', background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${PBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{p.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? PLUM : 'var(--ink)' }}>{p.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (prep) setStep(4); }} disabled={!prep} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: prep ? `linear-gradient(135deg, ${PLUM}, #9B6FC0)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: prep ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 4 — biggest challenge */}
      {step === 4 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — What is your biggest time management challenge?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Your plan will include a specific prioritisation method matched to this challenge.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {BIGGEST_CHALLENGE.map(ch => {
              const isSel = challenge === ch.key;
              return (
                <button key={ch.key} onClick={() => setChallenge(ch.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)', background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${PBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{ch.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? PLUM : 'var(--ink)' }}>{ch.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(3)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (challenge) { setStep(5); setRevealed(false); } }} disabled={!challenge} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: challenge ? `linear-gradient(135deg, ${PLUM}, #9B6FC0)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: challenge ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Exam Plan →</button>
          </div>
        </>
      )}

      {/* STEP 5 — results */}
      {step === 5 && plan && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 5 — Your Personalised Exam Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${PLUM}, #9B6FC0)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${PBORD}`,
              }}>📋 Generate My Exam Plan</button>
              <button onClick={() => setStep(4)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${PLUM}, #9B6FC0)`, borderRadius: '14px', padding: '22px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selCtx?.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {plan.title}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
                  {selDays?.label} to exam · {selPrep?.label.split(' — ')[0]} preparation
                </div>
              </div>

              {/* Phase selector (board exams only) */}
              {plan.phase_system && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>
                    Your Preparation Phase — Select to view:
                  </div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                    {plan.phases.map((phase, i) => (
                      <button key={i} onClick={() => { setActivePhase(i); setOpenRow(null); }} style={{
                        padding: '8px 14px', borderRadius: '50px', border: '2px solid',
                        borderColor: activePhase === i ? phase.color : 'var(--border)',
                        background: activePhase === i ? `${phase.color}15` : 'white',
                        color: activePhase === i ? phase.color : 'var(--muted)',
                        fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font, transition: 'all 0.15s',
                      }}>
                        {phase.name.split(' — ')[0]}
                      </button>
                    ))}
                  </div>
                  {plan.phases[activePhase] && (
                    <div style={{ marginTop: '10px', background: `${plan.phases[activePhase].color}12`, border: `1.5px solid ${plan.phases[activePhase].color}30`, borderRadius: '10px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: plan.phases[activePhase].color }}>
                        🎯 Phase focus: {plan.phases[activePhase].focus}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Timetable */}
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: `1.5px solid ${PBORD}`, marginBottom: '14px' }}>
                <div style={{ padding: '12px 16px', background: `${PLUM}10`, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: PLUM }}>📅 Sample Daily Timetable</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {Object.entries(TYPE_LABEL).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: TYPE_DOT[k] }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: TYPE_DOT[k] }} />
                        {v.split(' ')[1]}
                      </div>
                    ))}
                  </div>
                </div>
                {timeRows.map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderBottom: i < timeRows.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'white' : '#FAFBFF' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_DOT[row.type], flexShrink: 0 }} />
                    <div style={{ width: '120px', fontSize: '11px', fontWeight: '700', color: 'var(--muted)', flexShrink: 0 }}>{row.time}</div>
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>{row.activity}</div>
                  </div>
                ))}
              </div>

              {/* Key rules */}
              <div style={{ background: PPALE, border: `1.5px solid ${PBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '10px' }}>
                  📌 Non-Negotiable Rules for This Plan
                </div>
                <ul style={{ margin: 0, padding: '0 0 0 4px', listStyle: 'none' }}>
                  {planRules.map((rule, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: i < planRules.length - 1 ? '1px solid rgba(123,79,155,0.12)' : 'none' }}>
                      <span style={{ color: PLUM, fontWeight: '700', flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenge-specific method */}
              {chalPlan && (
                <div style={{ background: 'white', border: `2px solid ${PBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px', borderLeft: `4px solid ${PLUM}` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '5px' }}>
                    🎯 Your Prioritisation Method — {chalPlan.method}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>Matched to: {selChal?.label}</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{chalPlan.description}</p>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: PLUM, marginBottom: '7px' }}>Steps:</div>
                  {chalPlan.steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '5px 0', borderBottom: i < chalPlan.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `linear-gradient(135deg, ${PLUM}, #9B6FC0)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Urgency-based tip */}
              <div style={{ background: PPALE, border: `1.5px dashed ${PBORD}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '7px' }}>
                  ⏱️ For Your Timeline: {selDays?.label}
                </div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: PLUM, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {selDays?.value >= 14 ? '"With this time, your biggest risk is going shallow on many topics. Go deep on few — practise more than you revise."'
                    : selDays?.value >= 7 ? '"One week is enough to make a real difference if you practise rather than re-read. Past papers every day from today."'
                    : selDays?.value >= 3 ? '"Three to six days: consolidate what you know deeply, practise under time conditions, and sleep every night."'
                    : '"With one to two days: no new topics. Practise past papers, review errors, sleep 8 hours. Rest is now the most important study strategy."'}
                </p>
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: `1.5px solid ${PBORD}`, color: PLUM,
                padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Build a different plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function TimeManagementExams({ navigate, relatedPosts }) {
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
      <p>There is a very specific kind of panic that arrives three days before an exam when you realise you have studied the wrong things. Not too little — the wrong things. You have covered the comfortable subjects and the interesting topics and the areas you already knew, and the genuinely difficult gaps that the exam will probe have been circling at the bottom of the to-do list for two weeks, never quite rising to the top.</p>

      <p>This is not a motivation problem. It is a <strong>time management for exams</strong> problem — specifically, the absence of a prioritisation system that overrides personal preference and comfort with what actually needs to happen. This guide is about building that system.</p>

      <img
        src={meta.imgUrl}
        alt="Student using structured time management techniques during exam preparation — timetables, prioritisation methods, and revision strategies"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-fail">1. Why Exam Time Management Fails for Most Students</h3>
      <p>Most students approach exam preparation with a loose plan — a list of subjects that need covering and a rough sense of how many days they have. In practice, this produces a predictable set of failures: subjects they enjoy get more time than subjects they need to improve, revision (re-reading notes) takes up time that should go to practice (solving problems and past papers), and the final week arrives with several major topics still uncovered because the plan had no enforcement mechanism.</p>

      <p><strong>The three core failures of exam time management are:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
        <li><strong>Preference bias:</strong> Studying subjects you are already good at feels productive and safe. Studying genuinely weak areas feels uncomfortable and threatening. Without a deliberate system that overrides this, study time flows naturally to where it feels least uncomfortable — which is almost never where it is most needed.</li>
        <li><strong>Revision over practice:</strong> Re-reading notes is passive and produces familiarity without retrieval strength. Solving problems and past papers is active and produces genuine learning. Most students significantly over-revise and under-practise, partly because re-reading feels like studying and practice feels like being tested on how little you know.</li>
        <li><strong>No weekly review mechanism:</strong> A plan made on Day 1 of exam prep is based on estimates that will turn out to be wrong — some topics take longer, some days are disrupted, some material is harder than expected. Without a weekly review and adjustment mechanism, the original plan becomes increasingly misaligned with reality while the student continues following it.</li>
      </ul>

      {/* ── Section 2 ── */}
      <h3 id="prioritisation">2. Five Prioritisation Methods That Work Under Exam Pressure</h3>

      <p><strong>1. The Impact-Effort Matrix (for topic overload).</strong> When facing more topics than time allows, draw a simple 2×2 grid with impact (exam weight of the topic) on one axis and effort required (how much you currently need to learn) on the other. Study in this order: High Impact + Low Effort first (topics you partly know that carry high marks — these give the best return), then High Impact + High Effort (critical gaps that need significant work), then Low Impact + Low Effort (minor topics that are quick to cover). Deprioritise or cut: Low Impact + High Effort (topics that cost enormous time for minimal marks). This matrix immediately reveals that the conventional approach of covering the syllabus in order is almost always suboptimal.</p>

      <p><strong>2. The Exam-Weight Allocation System (for multiple subjects).</strong> Assign study days proportionally rather than equally. List each subject with its exam weight percentage (or estimated mark contribution). Rate your current confidence in each subject from 1 (very weak) to 3 (strong). Multiply the exam weight by (4 minus your confidence score). The resulting number is your allocation index — divide your available study days proportionally based on these indices. A subject that carries 30% of marks and in which you score 1 (very weak) should receive three times the study time of a subject carrying 30% of marks in which you score 3 (strong).</p>

      <p><strong>3. The Backward Planning Method (for deadline pressure).</strong> Start from the exam date and work backward... that forward planning hides until it is too late.</p>
      
      <p><strong>4. The MIT (Most Important Task) Daily System (for procrastination).</strong> Each evening, identify the single Most Important Task for the following study day — not the longest or the most comprehensive, but the one that will move your exam preparation forward most significantly if completed. Write it down before you go to sleep and begin with it the following morning, before any other study activity. Research by Cal Newport shows that completing the single highest-priority task first doubles the probability of overall daily plan completion, because it prevents the day from being captured by lower-priority but more comfortable tasks.</p>

      <p><strong>5. The Spaced Repetition Schedule (for retention).</strong> Rather than reviewing material once and moving on, schedule review at increasing intervals: after 1 day, then 3 days, then 7 days, then 14 days. This spaced repetition — backed by over a century of memory research since Hermann Ebbinghaus — produces dramatically better long-term retention with less total review time than massed repetition (covering the same material in one or two long sessions). During exam prep, flag topics as they are covered and build review sessions into your timetable at the intervals above.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="planner">3. Interactive: The Exam Time Planner</h3>
      <p>The Planner generates a personalised exam plan across four inputs: your exam context, your time remaining, your current preparation level, and your biggest time management challenge. The result is a sample daily timetable, a set of non-negotiable planning rules for your context, and a specific prioritisation method matched to your challenge.</p>

      <ExamTimePlanner />

      {/* ── Section 4 ── */}
      <h3 id="timetables">4. Three Timetable Examples for Different Exam Contexts</h3>

      <p><strong>Example 1 — Four weeks to Board Exams (three subjects).</strong></p>
      <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${PLUM}, #9B6FC0)`, color: 'white' }}>
              {['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(h => (
                <th key={h} style={{ padding: '9px 8px', textAlign: 'center', fontWeight: '700', fontSize: '11px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Morning (2.5h)',   'Maths',    'Science',   'Maths',    'Science',   'English',   'Weak Topic', 'REST'],
              ['Mid-morning (2h)', 'Science',  'English',   'Science',  'English',   'Maths',     'Past Papers','REST'],
              ['Practice (1.5h)', 'Maths Qs', 'Science Qs','Maths Qs', 'Science Qs','English Qs','Past Papers','REST'],
              ['Evening (1h)',     'Review',   'Review',    'Review',   'Review',    'Revise all','Free',       'Plan week'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8F4FF' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px', textAlign: 'center', border: '1px solid var(--border)', fontWeight: j === 0 ? '700' : '500', fontSize: '12px',
                    color: cell === 'REST' ? '#2D7D46' : cell === 'Past Papers' ? PLUM : cell === 'Free' ? '#C07800' : 'var(--ink)', }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p><strong>Example 2 — Two weeks to College Semester Exams (five subjects).</strong></p>
      <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, #1A6B6B, #2A9090)`, color: 'white' }}>
              {['Day', 'Morning', 'Afternoon', 'Evening', 'Focus'].map(h => (
                <th key={h} style={{ padding: '9px 8px', textAlign: 'center', fontWeight: '700', fontSize: '11px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Day 1-2',  'Sub A (Priority 1)', 'Past Papers — Sub A', 'Sub B review',     'Weakest subject deep dive'],
              ['Day 3-4',  'Sub B (Priority 2)', 'Past Papers — Sub B', 'Sub C overview',    'Second weakest subject'],
              ['Day 5-6',  'Sub C + D',           'Sub C Past Papers',   'Sub D quick notes', 'Cover remaining subjects'],
              ['Day 7',    'REST',                 'REST',                'Plan week 2',       'Recovery + planning'],
              ['Day 8-10', 'Sub E + mixed review', 'Full mock test',      'Error review',      'Mock tests all subjects'],
              ['Day 11-13','Targeted gap filling', 'Past papers all subs', 'High-yield revision','Final consolidation'],
              ['Day 14',   'Light review only',   'Rest + prepare',      'Sleep by 10pm',     'REST before exam week'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#EDF4F4' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px', textAlign: 'center', border: '1px solid var(--border)', fontWeight: j === 0 ? '700' : '500', fontSize: '12px',
                    color: cell.includes('REST') ? '#2D7D46' : cell.includes('Past') || cell.includes('mock') ? PLUM : 'var(--ink)', }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p><strong>Example 3 — Three days to an Internal / Unit Test.</strong></p>
      <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, #9B4E2A, #C4723E)`, color: 'white' }}>
              {['Time Slot', 'Day 1', 'Day 2', 'Day 3'].map(h => (
                <th key={h} style={{ padding: '9px 8px', textAlign: 'center', fontWeight: '700', fontSize: '11px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Morning',   'Content scan — know the scope',       'Gaps from Day 1 practice — fill them',  'Key points revision — nothing new'],
              ['Mid-morning','Active recall — key concepts',       'Full unit mock test (timed)',             'Formulae + definitions quick review'],
              ['Afternoon', 'Practice questions — all topics',     'Review every wrong answer carefully',    'Rest + confidence review'],
              ['Evening',   'Identify weak areas from practice',   'High-yield summary — write key points',  'Materials ready + sleep by 10:30pm'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#FBF2ED' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px', textAlign: j === 0 ? 'center' : 'left', border: '1px solid var(--border)', fontWeight: j === 0 ? '700' : '500', fontSize: '12px', color: 'var(--ink)' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Section 5 ── */}
      <h3 id="twelve-tips">5. Twelve Time Management Tips for Exam Season</h3>

      <ul style={{ paddingLeft: '20px', lineHeight: '1' }}>
        <li style={{ marginBottom: '14px' }}>
          <strong>Map all exam dates and subjects on Day 1.</strong> Before planning any daily schedule, create a master calendar with all exam dates, mark weights, and your initial confidence rating for each subject. This single act transforms abstract anxiety into concrete, plannable information.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Prioritise by weakness × weight, not by comfort.</strong> The exam-weight allocation method described above prevents the natural drift toward comfortable subjects. Do the calculation once and let the numbers determine the time allocation, overriding personal preference.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Practice beats revision after the first pass.</strong> Once you have covered a topic once, every subsequent hour of re-reading notes returns diminishing value. That time is more efficiently spent on active practice — past questions, problem sets, self-testing. Aim for a 60-40 split of practice to revision in your final preparation phase.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Review wrong answers the same day you make them.</strong> An error reviewed immediately is learned. An error reviewed the next day has significantly lower learning value. Build immediate error review into every practice session — it is not separate from the practice, it is the most important part of it.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Never enter a study day without a plan from the previous evening.</strong> Morning planning costs morning energy and time — and happens when you are already in the momentum of the day. Evening planning happens in a calmer, more strategic headspace and takes five minutes rather than thirty.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Start every study day with your hardest subject.</strong> Cognitive performance is highest in the two to three hours after you are fully awake. Using this window on the material you find easiest or most comfortable is a significant waste of your peak resource.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Define "done" for each study block before starting.</strong> Not "study chemistry" — "complete active recall on Chapter 6 and attempt five past questions on equilibrium." The specific endpoint tells you when you have finished, creates a sense of completion, and prevents the open-ended drift that produces long, unproductive sessions.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Take one full rest day per week even during exam preparation.</strong> The cognitive recovery that a full rest day produces makes the other six days measurably more efficient. Students who take one rest day per week typically outperform students who study seven days at declining intensity.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Stop learning new material three to four days before each exam.</strong> The final three to four days should be devoted entirely to consolidation, practice, and rest. New material introduced in this window competes with the existing material for retrieval access rather than adding to it.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Do a Sunday review of the week's actual progress versus planned.</strong> Compare what you intended to cover with what you actually covered. Adjust next week's plan accordingly. The Sunday review is the mechanism that prevents a plan from becoming increasingly misaligned with reality as the preparation period progresses.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Protect sleep as the highest-priority preparation strategy.</strong> Sleep consolidates the memories formed during study, restores the cognitive infrastructure for learning and recall, and lowers the baseline anxiety that impairs exam performance. Sacrificing sleep to study more hours is almost always a negative return trade — the hours lost from sleep cost more than the hours gained for study.
        </li>
        <li style={{ marginBottom: '14px' }}>
          <strong>Track completed study units, not hours.</strong> "I studied for six hours" is ambiguous. "I completed active recall on three chapters, attempted twelve past questions, and reviewed eight errors" is specific and motivating. Tracking outputs rather than inputs gives a more accurate picture of progress and counteracts the demotivation of feeling that hours are passing without progress.
        </li>
      </ul>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Exam Time Management FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have a timetable but I never stick to it past Day 3. What is going wrong?</strong><br />
        A: The three most common reasons timetables collapse are: too ambitious (the daily plan requires more hours than are genuinely available when meals, breaks, and realistic transitions are factored in), too rigid (no buffer time for topics that take longer than estimated, which creates cascading failure the first time anything runs over), or no review mechanism (the same plan runs unchanged regardless of actual progress, becoming increasingly unrealistic). The fix for all three is to reduce daily planned hours by 20%, add one buffer session per week for overflow, and schedule a Sunday review where the plan is actively adjusted based on the actual week.</p>

        <p><strong>Q: What should I do if I realise I am running out of time before exams?</strong><br />
        A: Switch immediately to the triage system: identify the 20-30% of content most frequently tested in past papers for each subject, and cover those topics deeply rather than all topics shallowly. Accept that some topics will not be covered and make that an intentional decision based on mark weight rather than letting it happen by drift. One focused, targeted session on high-frequency topics produces better exam outcomes than the same time spread thinly across the whole syllabus under time pressure.</p>

        <p><strong>Q: How do I manage time during the actual exam — not just preparation?</strong><br />
        A: Read all questions first (two minutes) and plan your time allocation before writing a single word. Identify the mark weights — the time you spend on each question should be roughly proportional to its marks. Flag questions you cannot immediately answer and return to them — do not let a single difficult question consume disproportionate time while completable questions remain unattempted. Leave five minutes at the end for review. And practise timed questions regularly during preparation so the time pressure of the actual exam is a familiar experience rather than a novel one.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: PLUM, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "It is not the student who studies the most who performs best — it is the student who studies the right things in the right order with enough deliberate practice and enough genuine rest."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          A plan built on honest prioritisation, adjusted weekly, and protected by genuine rest days is worth more than twice the hours of unfocused, preference-biased study. Build the plan. Review it. Trust the system over the anxiety.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: PLUM, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${PBORD}` }}
          >
            Manage Exam Stress in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: PLUM, border: `2px solid ${PLUM}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Exam Strategy Anonymously
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More Exam and Study Resources:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-stress-management',          '→ How to Handle Exam Stress Without Panic (Student Guide)'],
            ['/blog/exam-anxiety-help',               '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/study-plan-reduce-stress',        '→ How to Create a Study Plan That Reduces Stress'],
            ['/blog/study-focus-without-distractions','→ How to Stay Focused While Studying Without Distractions'],
            ['/blog/quick-stress-relief-students',    '→ 5-Minute Stress Relief Techniques for Busy Students'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: PLUM, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
