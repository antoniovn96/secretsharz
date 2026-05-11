import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Create a Study Plan That Reduces Stress and Improves Focus",
  excerpt: "A good study plan does not just organise your time — it eliminates the daily cognitive drain of deciding what to study, protects your recovery time, and removes the low-grade anxiety of not knowing whether you are doing enough. Learn how to build one that actually works, see a sample timetable, and use our Study Plan Builder to create yours.",
  category: "Mental Health",
  date: "04-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/study-plan-reduce-stress.jpg",
  tldr: "A study plan for students is one of the highest-return investments in academic wellbeing — not because it forces more studying, but because it replaces the chronic low-grade anxiety of unstructured preparation with the clarity of knowing exactly what you are doing, when you are doing it, and when you are genuinely done for the day. This guide covers the science of effective planning, a real sample timetable, twelve productivity tips, and an interactive Study Plan Builder to generate your personalised weekly schedule.",
  toc: [
    { id: "why-plans",    title: "1. Why a Study Plan Reduces Stress (Not Just Improves Grades)",      level: 3 },
    { id: "principles",   title: "2. Five Principles of a Study Plan That Actually Works",              level: 3 },
    { id: "builder",      title: "3. Interactive: The Study Plan Builder",                              level: 3 },
    { id: "sample",       title: "4. Sample Study Timetable: A Week That Works",                        level: 3 },
    { id: "productivity", title: "5. Twelve Productivity Tips to Make Your Plan Stick",                 level: 3 },
    { id: "faq",          title: "6. Study Plan FAQs",                                                  level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-04T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "study plan for students, how to make a study plan, study timetable, study schedule, reduce study stress, student productivity tips, effective study plan, study plan for exams",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I make an effective study plan for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An effective study plan for students starts with honest assessment of available time (accounting for sleep, meals, travel, and genuine commitments), prioritises subjects by difficulty and exam weight rather than personal preference, builds in spaced repetition (revisiting material at increasing intervals rather than massing study into single long sessions), protects genuine recovery time as non-negotiable, and remains flexible enough to adapt when a topic takes longer than expected without cascading into anxiety. The most common mistake is creating an ideal schedule that leaves no buffer — the first time it breaks, the student abandons the whole plan.",
      },
    },
    {
      "@type": "Question",
      "name": "How many hours should a student study per day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research on deliberate practice by psychologist K. Anders Ericsson shows that focused, high-quality study sessions of 4-6 hours per day represent approximately the upper limit of what the brain can sustain without diminishing returns. Beyond this, cognitive performance degrades significantly and study becomes low-quality time that produces false reassurance rather than real learning. Students who study 4-5 focused hours with genuine breaks typically outperform those who study 8-10 hours at low intensity with chronic distraction.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best study timetable structure for board exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For board exams, a structured timetable typically includes: morning sessions for the most cognitively demanding subject (typically 90-120 minutes with a 15-minute break), an afternoon session for a second subject or revision of the morning's material (60-90 minutes), and an evening session for lighter review, practice questions, or a third subject if needed (60 minutes). Each day should include at least 8 hours of sleep, meals, and a genuine recovery period with no study-related activity.",
      },
    },
  ],
};

// ── Study Plan Builder Data ────────────────────────────────────────────────────
const INDIGO2  = '#3B4F8A';
const IPALE2   = '#EEF1FA';
const IBORD2   = 'rgba(59,79,138,0.22)';

const CONTEXTS = [
  { key: 'board_12',   icon: '📋', label: 'Class 12 Board Exams',          desc: 'CBSE, ICSE, or State Board preparation' },
  { key: 'board_10',   icon: '📚', label: 'Class 10 Board Exams',          desc: 'Foundation boards — balanced approach' },
  { key: 'jee_neet',   icon: '🎯', label: 'JEE / NEET Preparation',        desc: 'Competitive entrance — high intensity planning' },
  { key: 'college',    icon: '🎓', label: 'College Semester Exams',         desc: 'University internals and end-sems' },
  { key: 'general',    icon: '📖', label: 'General Study / Self-Learning',  desc: 'Not exam-specific — skills, certifications, or ongoing learning' },
];

const HOURS_OPTIONS = [
  { key: 'h2', label: '2–3 hours', value: 2.5 },
  { key: 'h4', label: '4–5 hours', value: 4.5 },
  { key: 'h6', label: '6–7 hours', value: 6.5 },
  { key: 'h8', label: '8+ hours',  value: 8   },
];

const CHALLENGE_AREAS = [
  { key: 'starting',     icon: '🚀', label: 'Getting started — I procrastinate', },
  { key: 'distraction',  icon: '📱', label: 'Staying focused — phone and distractions', },
  { key: 'overwhelm',    icon: '🗂️', label: 'Feeling overwhelmed by the volume', },
  { key: 'consistency',  icon: '🔄', label: 'Maintaining consistency across weeks', },
  { key: 'recall',       icon: '🧠', label: 'Remembering what I study', },
  { key: 'balance',      icon: '⚖️', label: 'Study-life balance — guilt when not studying', },
];

const CONTEXT_PLANS = {
  board_12: {
    structure: [
      { time: '6:30 – 7:00 AM',  activity: 'Wake up + light movement',         type: 'recovery', note: 'No phone for first 30 minutes' },
      { time: '7:00 – 9:00 AM',  activity: 'Subject 1 — Hardest of the day',   type: 'study',    note: 'When cortisol is naturally highest — best for complex material' },
      { time: '9:00 – 9:30 AM',  activity: 'Breakfast + genuine break',         type: 'recovery', note: 'Step away from all study materials' },
      { time: '9:30 – 11:00 AM', activity: 'Subject 2 — Second priority',       type: 'study',    note: '90-minute focused block' },
      { time: '11:00 – 11:15 AM',activity: 'Short break',                       type: 'recovery', note: 'Physical movement — walk, stretch' },
      { time: '11:15 – 12:30 PM',activity: 'Subject 1 revision / practice Qs', type: 'study',    note: 'Active recall — not re-reading' },
      { time: '12:30 – 2:00 PM', activity: 'Lunch + rest',                      type: 'recovery', note: 'Full break — nap if needed' },
      { time: '2:00 – 3:30 PM',  activity: 'Subject 3 — New material',         type: 'study',    note: 'Post-lunch — lighter new material works better here' },
      { time: '3:30 – 3:45 PM',  activity: 'Break',                             type: 'recovery', note: '' },
      { time: '3:45 – 5:00 PM',  activity: 'Practice papers / past questions',  type: 'study',    note: 'Timed practice builds exam condition familiarity' },
      { time: '5:00 – 6:30 PM',  activity: 'Personal time — non-study',        type: 'free',     note: 'Protected. Not negotiable.' },
      { time: '6:30 – 7:30 PM',  activity: 'Subject 2 revision',               type: 'study',    note: 'Light review of today\'s material' },
      { time: '7:30 – 9:00 PM',  activity: 'Dinner + family time',             type: 'recovery', note: '' },
      { time: '9:00 – 10:00 PM', activity: 'Tomorrow\'s prep + brain dump',    type: 'study',    note: 'Write tomorrow\'s two most important tasks. Close the notebook at 10pm.' },
      { time: '10:00 – 10:30 PM',activity: 'Wind-down ritual',                  type: 'recovery', note: 'No screens — reading, journalling, or breathing' },
      { time: '10:30 PM',        activity: 'Sleep',                             type: 'recovery', note: '8 hours minimum — non-negotiable' },
    ],
    tips: [
      'Rotate your three hardest subjects — never study the same subject twice in a row',
      'Every Sunday: review the week\'s material in one light revision session (30 mins per subject)',
      'If a topic takes longer than planned, extend it — never skip it and move on',
    ],
  },
  board_10: {
    structure: [
      { time: '6:30 – 7:00 AM',  activity: 'Morning routine — no study yet',   type: 'recovery', note: 'Let the brain wake up naturally first' },
      { time: '7:00 – 8:30 AM',  activity: 'Subject 1 — Strongest focus block', type: 'study',   note: 'Maths, Science, or whichever is hardest' },
      { time: '8:30 – 9:15 AM',  activity: 'School preparation + breakfast',    type: 'recovery', note: '' },
      { time: '3:30 – 4:00 PM',  activity: 'Short rest after school',           type: 'recovery', note: 'School depletes cognitive resources too' },
      { time: '4:00 – 5:30 PM',  activity: 'Subject 2 + homework',             type: 'study',    note: '90-minute block — most urgent school work first' },
      { time: '5:30 – 6:00 PM',  activity: 'Break + snack',                    type: 'recovery', note: 'Away from desk' },
      { time: '6:00 – 7:00 PM',  activity: 'Subject 3 or revision',            type: 'study',    note: 'Lighter review only — no new heavy concepts' },
      { time: '7:00 – 8:30 PM',  activity: 'Dinner + personal time',           type: 'free',     note: 'Protected — not study time' },
      { time: '8:30 – 9:15 PM',  activity: 'Light revision + tomorrow prep',   type: 'study',    note: 'Max 45 minutes. Write two tasks for tomorrow.' },
      { time: '9:30 PM',         activity: 'Wind down + sleep',                 type: 'recovery', note: '9 hours for Class 10 students' },
    ],
    tips: [
      'After-school study is harder than morning study — plan lighter subjects in the afternoon',
      'Weekends: one subject deep-dive per day, not all subjects at low intensity',
      'Write tomorrow\'s plan the evening before — never start a study day without a plan',
    ],
  },
  jee_neet: {
    structure: [
      { time: '5:30 – 6:00 AM',  activity: 'Wake up + physical movement',       type: 'recovery', note: 'Physical exercise is not optional for JEE/NEET prep — it directly improves focus and retention' },
      { time: '6:00 – 8:30 AM',  activity: 'Physics / Biology — Peak block',    type: 'study',    note: '2.5 hours — hardest conceptual work of the day' },
      { time: '8:30 – 9:00 AM',  activity: 'Breakfast',                         type: 'recovery', note: '' },
      { time: '9:00 – 11:30 AM', activity: 'Chemistry / Maths — Second block',  type: 'study',    note: '2.5 hours focused' },
      { time: '11:30 – 12:00 PM',activity: 'Break',                             type: 'recovery', note: '' },
      { time: '12:00 – 1:30 PM', activity: 'Practice questions — Morning topics',type: 'study',   note: 'Active recall consolidates the morning session' },
      { time: '1:30 – 3:00 PM',  activity: 'Lunch + rest',                      type: 'recovery', note: 'Full break — rest or nap' },
      { time: '3:00 – 5:00 PM',  activity: 'Weak topic — targeted work',        type: 'study',    note: 'Identify your weakest chapter each week and dedicate 2 hours' },
      { time: '5:00 – 5:30 PM',  activity: 'Break',                             type: 'recovery', note: '' },
      { time: '5:30 – 7:30 PM',  activity: 'Full mock test or timed practice',  type: 'study',    note: 'At least 2-3 times per week — test conditions' },
      { time: '7:30 – 8:30 PM',  activity: 'Mock test review + dinner',         type: 'study',    note: 'Review wrong answers immediately — do not leave errors unaddressed' },
      { time: '8:30 – 9:00 PM',  activity: 'Personal time',                     type: 'free',     note: 'Absolutely protected — burnout prevention' },
      { time: '9:00 – 10:00 PM', activity: 'Light revision + next day planning', type: 'study',   note: 'No new concepts after 9pm' },
      { time: '10:00 PM',        activity: 'Sleep — 7 hours minimum',           type: 'recovery', note: 'JEE/NEET toppers consistently prioritise sleep. It is not weakness.' },
    ],
    tips: [
      'Track your mock test scores on a graph — data beats intuition about where to focus',
      'Every week, identify your three most-missed question types and drill them specifically',
      'One full day off per week — not half a day, a full day. Sustainable preparation requires genuine recovery.',
    ],
  },
  college: {
    structure: [
      { time: '8:00 – 8:30 AM',  activity: 'Morning routine',                  type: 'recovery', note: '' },
      { time: '8:30 – 10:30 AM', activity: 'Priority subject — new material',  type: 'study',    note: 'Before college attendance when possible' },
      { time: '10:30 AM – 4:00 PM', activity: 'College / Classes',             type: 'study',    note: 'Active attendance — ask questions, take notes properly' },
      { time: '4:00 – 5:00 PM',  activity: 'Decompression — non-study',        type: 'recovery', note: 'Transition time between college and evening study' },
      { time: '5:00 – 7:00 PM',  activity: 'Review today\'s lecture notes',    type: 'study',    note: 'The 24-hour review rule: review within 24 hours to retain 70% more' },
      { time: '7:00 – 8:00 PM',  activity: 'Dinner + break',                   type: 'recovery', note: '' },
      { time: '8:00 – 9:30 PM',  activity: 'Assignments or second subject',    type: 'study',    note: 'Complete assignments before they accumulate' },
      { time: '9:30 – 10:00 PM', activity: 'Next day planning',                type: 'study',    note: 'What are the two most important things for tomorrow?' },
      { time: '10:00 – 11:00 PM',activity: 'Personal / social time',           type: 'free',     note: 'Protected. College is more than academics.' },
      { time: '11:00 PM',        activity: 'Sleep',                             type: 'recovery', note: '7-8 hours' },
    ],
    tips: [
      'Semester planning: map every assignment deadline on day one and work backwards to set daily targets',
      'The 24-hour review rule: review lecture notes within 24 hours of the class — retention doubles',
      'Do not let assignments accumulate — small daily progress beats weekend cramming',
    ],
  },
  general: {
    structure: [
      { time: 'Block 1 (Morning)', activity: 'New learning — hardest material first', type: 'study',    note: 'Work in 45-minute focused sessions with 10-minute breaks' },
      { time: 'Break',             activity: 'Genuine break — move physically',       type: 'recovery', note: 'Not phone scrolling' },
      { time: 'Block 2 (Mid-morning)', activity: 'Practice and application',         type: 'study',    note: 'Apply what you learned in Block 1' },
      { time: 'Midday',            activity: 'Lunch + full rest',                     type: 'recovery', note: 'Minimum 30-minute genuine break' },
      { time: 'Block 3 (Afternoon)', activity: 'Review and consolidation',           type: 'study',    note: 'Revisit material from yesterday using active recall' },
      { time: 'Break',             activity: 'Walk or movement',                      type: 'recovery', note: '' },
      { time: 'Block 4 (Optional)', activity: 'Light reading or passive review',     type: 'study',    note: 'Only if genuinely energised — not from guilt' },
      { time: 'Evening',           activity: 'Personal time — fully protected',       type: 'free',     note: 'Non-negotiable recovery' },
      { time: 'Before bed',        activity: 'Tomorrow\'s two tasks — write them',   type: 'study',    note: 'Close the study day intentionally' },
    ],
    tips: [
      'Learn in sessions, not in marathons — 4 focused hours beats 8 unfocused ones',
      'Weekly review: every Sunday, revisit the week\'s key material in 30 minutes',
      'Track what you have learned, not just what you have covered — test yourself',
    ],
  },
};

const CHALLENGE_ADVICE = {
  starting: {
    title: 'For procrastination',
    tip: 'The two-minute rule: commit to studying for exactly two minutes. Set a timer. Almost always, starting is the hardest part — once you are in motion, the session continues naturally. If it does not, two minutes was still better than zero. Additionally, make the start as frictionless as possible: have your materials out the night before so there is no setup barrier in the morning.',
  },
  distraction: {
    title: 'For focus and distractions',
    tip: 'Environment beats willpower every time. Move your phone to a different room before starting — not to silent, to another room. Use a dedicated study location that is used only for study (the brain learns to associate the space with focused work). For digital distractions, use a site blocker (Cold Turkey or Freedom) during study sessions — do not rely on deciding not to check.',
  },
  overwhelm: {
    title: 'For feeling overwhelmed',
    tip: 'The overwhelm is a map problem — you are trying to hold everything in your head simultaneously. Start with a brain dump: write every task, topic, and deadline in one place. Then assign each item to a specific day and time slot. Once it is on the calendar, your brain no longer needs to hold it in active memory and the overwhelm immediately reduces.',
  },
  consistency: {
    title: 'For maintaining consistency',
    tip: 'Consistency is built through habits, not through motivation. Motivation fluctuates. Habits do not require motivation to activate — they activate on environmental cues. Build a consistent cue-routine-reward loop: the same time, the same place, the same brief preparation ritual before each study session. After three weeks, the session begins to activate almost automatically.',
  },
  recall: {
    title: 'For improving retention',
    tip: 'The most important and most underused study technique is active recall — testing yourself on material rather than re-reading it. After each study session, close the book and write down everything you remember from the session. The effort of retrieval is what builds the memory trace. Re-reading feels productive and produces minimal retention. Testing feels harder and produces significant retention.',
  },
  balance: {
    title: 'For study-life balance guilt',
    tip: 'The guilt of not studying during recovery time is not a study problem — it is a permission problem. Your timetable is the permission. When rest time is scheduled and honoured the same way study time is, the rest becomes legitimate rather than guilty. Build your rest into the plan explicitly, and when you are in rest time, you are honouring the plan — not shirking it.',
  },
};

// ── Study Plan Builder Component ───────────────────────────────────────────────
function StudyPlanBuilder() {
  const [step,       setStep]       = useState(1);
  const [context,    setContext]    = useState(null);
  const [hours,      setHours]      = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [revealed,   setRevealed]   = useState(false);
  const [openRow,    setOpenRow]    = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selCtx  = CONTEXTS.find(c => c.key === context);
  const selHrs  = HOURS_OPTIONS.find(h => h.key === hours);
  const plan    = context ? CONTEXT_PLANS[context] : null;

  const toggleChallenge = (key) => {
    setChallenges(prev => prev.includes(key) ? prev.filter(k => k !== key) : prev.length < 3 ? [...prev, key] : prev);
  };

  const handleReset = () => { setStep(1); setContext(null); setHours(null); setChallenges([]); setRevealed(false); setOpenRow(null); };

  const TYPE_COLORS = {
    study:    { bg: '#EEF1FA', border: 'rgba(59,79,138,0.25)', dot: INDIGO2 },
    recovery: { bg: '#E8F5EE', border: 'rgba(45,125,70,0.25)',  dot: '#2D7D46' },
    free:     { bg: '#FFF8E1', border: 'rgba(192,120,0,0.25)',  dot: '#C07800' },
  };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? INDIGO2 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — context */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What are you studying for?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Your context determines the structure — intensity, session lengths, and priorities differ significantly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {CONTEXTS.map(c => {
              const isSel = context === c.key;
              return (
                <button key={c.key} onClick={() => setContext(c.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? INDIGO2 : 'var(--border)', background: isSel ? IPALE2 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${IBORD2}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '600', color: isSel ? INDIGO2 : 'var(--ink)', marginBottom: '2px' }}>{c.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (context) setStep(2); }} disabled={!context} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: context ? `linear-gradient(135deg, ${INDIGO2}, #5568B0)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: context ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: context ? `0 6px 18px ${IBORD2}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — hours */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How many hours of dedicated study time do you realistically have per day?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest — not aspirational. A realistic 4 hours planned is more useful than an aspirational 8 hours that never happens.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {HOURS_OPTIONS.map(h => {
              const isSel = hours === h.key;
              return (
                <button key={h.key} onClick={() => setHours(h.key)} style={{
                  padding: '16px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSel ? INDIGO2 : 'var(--border)', background: isSel ? IPALE2 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
                  boxShadow: isSel ? `0 0 0 2px ${IBORD2}` : 'none',
                }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: isSel ? INDIGO2 : 'var(--ink)', marginBottom: '2px' }}>{h.label}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (hours) setStep(3); }} disabled={!hours} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: hours ? `linear-gradient(135deg, ${INDIGO2}, #5568B0)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: hours ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — challenges */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What are your biggest study challenges? (Select up to 3)
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Your plan will include targeted advice for each challenge you select.
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '700', color: INDIGO2 }}>
            {challenges.length}/3 selected
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {CHALLENGE_AREAS.map(ch => {
              const isSel = challenges.includes(ch.key);
              const isMax = challenges.length >= 3 && !isSel;
              return (
                <button key={ch.key} onClick={() => !isMax && toggleChallenge(ch.key)} style={{
                  padding: '12px 16px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSel ? INDIGO2 : 'var(--border)', background: isSel ? IPALE2 : 'white',
                  cursor: isMax ? 'not-allowed' : 'pointer', fontFamily: font, textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s',
                  opacity: isMax ? 0.5 : 1,
                  boxShadow: isSel ? `0 0 0 2px ${IBORD2}` : 'none',
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{ch.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? INDIGO2 : 'var(--ink)' }}>{ch.label}</span>
                  {isSel && <span style={{ marginLeft: 'auto', color: INDIGO2, fontSize: '16px' }}>✓</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (challenges.length > 0) { setStep(4); setRevealed(false); } }} disabled={challenges.length === 0} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: challenges.length > 0 ? `linear-gradient(135deg, ${INDIGO2}, #5568B0)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: challenges.length > 0 ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Study Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — results */}
      {step === 4 && plan && selCtx && selHrs && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — Your Personalised Study Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${INDIGO2}, #5568B0)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${IBORD2}`,
              }}>📋 Generate My Study Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${INDIGO2}, #5568B0)`, borderRadius: '14px', padding: '22px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selCtx.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                  {selCtx.label}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)' }}>
                  {selHrs.label} of study per day · Personalised for your challenges
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[['study', '📘 Study'], ['recovery', '🌿 Recovery'], ['free', '⭐ Free Time']].map(([type, label]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: TYPE_COLORS[type].dot }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: TYPE_COLORS[type].dot }} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Timetable */}
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: `1.5px solid ${IBORD2}`, marginBottom: '14px' }}>
                {plan.structure.map((row, i) => {
                  const tc     = TYPE_COLORS[row.type] || TYPE_COLORS.study;
                  const isOpen = openRow === i;
                  return (
                    <div key={i} style={{ borderBottom: i < plan.structure.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <button onClick={() => row.note ? setOpenRow(isOpen ? null : i) : null} style={{
                        width: '100%', padding: '11px 14px', background: 'transparent', border: 'none',
                        cursor: row.note ? 'pointer' : 'default', fontFamily: font, textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tc.dot, flexShrink: 0 }} />
                        <div style={{ width: '130px', fontSize: '12px', fontWeight: '700', color: 'var(--muted)', flexShrink: 0, lineHeight: 1.3 }}>{row.time}</div>
                        <div style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: 'var(--ink)', lineHeight: 1.4 }}>{row.activity}</div>
                        {row.note && <span style={{ color: 'var(--muted)', fontSize: '13px', flexShrink: 0 }}>{isOpen ? '▲' : 'ℹ'}</span>}
                      </button>
                      {isOpen && row.note && (
                        <div style={{ padding: '0 14px 11px 38px', animation: 'floatUp 0.2s ease' }}>
                          <div style={{ background: tc.bg, border: `1px solid ${tc.border}`, borderRadius: '8px', padding: '9px 12px', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                            {row.note}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Plan tips */}
              <div style={{ background: IPALE2, border: `1.5px solid ${IBORD2}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO2, marginBottom: '10px' }}>
                  📌 Key Rules for This Plan
                </div>
                {plan.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: i < plan.tips.length - 1 ? '1px solid rgba(59,79,138,0.12)' : 'none' }}>
                    <span style={{ color: INDIGO2, flexShrink: 0, marginTop: '2px', fontSize: '13px' }}>→</span>
                    <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>

              {/* Challenge advice */}
              {challenges.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO2, marginBottom: '10px' }}>
                    🎯 Targeted Advice for Your Challenges
                  </div>
                  {challenges.map(ck => {
                    const adv = CHALLENGE_ADVICE[ck];
                    const ch  = CHALLENGE_AREAS.find(c => c.key === ck);
                    return adv ? (
                      <div key={ck} style={{ background: 'white', border: `1.5px solid ${IBORD2}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '8px', borderLeft: `4px solid ${INDIGO2}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{ch?.icon}</span>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: INDIGO2 }}>{adv.title}</div>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{adv.tip}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Affirmation */}
              <div style={{ background: IPALE2, border: `1.5px dashed ${IBORD2}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: INDIGO2, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "A plan you follow imperfectly is infinitely more valuable than a perfect plan you never start."
                </p>
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: `1.5px solid ${IBORD2}`, color: INDIGO2,
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
export default function StudyPlanReduceStress({ navigate, relatedPosts }) {
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
      <p>Most students experience a specific, exhausting kind of stress that has nothing to do with not knowing the material. It is the stress of not knowing where to start. Which subject first. Whether they are doing enough. Whether the time they are spending is being spent on the right things. This low-grade, directionless anxiety accumulates across every unplanned study day, compounds across weeks, and arrives at exam season as a genuine crisis.</p>

      <p>A good <strong>study plan for students</strong> is the solution to all of these at once — not because it is a rigid schedule to be followed perfectly, but because it replaces the daily cognitive drain of deciding with the clarity of already knowing. When you have a plan, the anxiety about whether you are doing enough dissolves into a clear, simple check: am I following the plan today?</p>

      <img
        src={meta.imgUrl}
        alt="Student creating a structured study plan and timetable that reduces stress and improves academic focus"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-plans">1. Why a Study Plan Reduces Stress (Not Just Improves Grades)</h3>
      <p>The primary psychological benefit of a study plan is not what it does for academic performance — though that is real and documented. It is what it does for cognitive load. The human brain has a finite capacity for active information holding in working memory. When you are studying without a plan, a significant portion of that capacity is perpetually occupied by planning — what to study next, whether you are spending enough time on each subject, whether you will cover everything in time. These are not trivial concerns. They are genuine cognitive tasks that compete directly with the learning tasks for working memory resources.</p>
      <p>A plan moves those planning tasks out of active cognitive holding and into external structure. Once the plan is made, the brain no longer needs to hold "what should I do next" as an active question. The question has been answered. What remains is simply the task. Research on cognitive load theory by educational psychologist John Sweller consistently shows that reducing extraneous cognitive load — the mental effort spent on things unrelated to the learning itself — directly increases the quality of learning that occurs. A study plan is essentially a cognitive load reduction tool.</p>
      <p>There is a second stress-reduction mechanism, equally important: the plan makes recovery time legitimate. Without a plan, rest feels guilty because you are never quite sure you have done enough to earn it. With a plan that includes defined rest periods, the rest is honoured as part of the structure — not a deviation from it. This distinction between guilty half-rest (which restores nothing) and legitimate scheduled rest (which genuinely restores) is one of the most practically important outcomes of having a study plan.</p>

      {/* ── Section 2 ── */}
      <h3 id="principles">2. Five Principles of a Study Plan That Actually Works</h3>
      <p><strong>Principle 1: Realistic before aspirational.</strong> The most common study plan failure mode is the plan that is designed for an ideal version of the student's day rather than the actual one. A plan that requires six hours of focused study when the student's genuine available time — accounting for school, travel, meals, sleep, and commitments — is closer to three hours will fail within the first week. Start with an honest audit of actual available time. Build the plan from that reality, not from a hope about what the day could look like.</p>
      <p><strong>Principle 2: Hardest subject first, always.</strong> Cognitive performance follows a predictable arc throughout the day — highest in the late morning for most people, declining through the afternoon and recovering slightly in the early evening. Your most difficult or most important subject should occupy your highest-performance window. This principle, from research on chronobiology and circadian performance rhythms, is violated by almost every student who "saves" the hard subject for when they feel ready — which usually means when they are most depleted.</p>
      <p><strong>Principle 3: Spaced repetition, not massed repetition.</strong> Research by Hermann Ebbinghaus on the "forgetting curve" — confirmed repeatedly in the 150 years since — shows that information studied once and then reviewed at increasing intervals (tomorrow, then in three days, then in a week) is retained significantly better than information studied for long sessions without subsequent review. Your plan should include review sessions, not just first-exposure sessions. Spending thirty minutes reviewing yesterday's material before starting today's new content produces substantially better long-term retention.</p>
      <p><strong>Principle 4: Rest as a non-negotiable, not a reward.</strong> Rest that has to be earned through completing everything on the list will almost never occur — because on any real study day, there is always something else to do. Build rest into the plan as a fixed commitment the same way you build study blocks in. The evening recovery period, the lunch break, the weekend afternoon — these are in the schedule. They happen regardless of whether everything else was completed. The discipline is protecting them, not just the study sessions.</p>
      <p><strong>Principle 5: Review and adapt weekly.</strong> The plan is not a contract. It is a living document that gets reviewed every Sunday and adjusted based on what actually happened versus what was planned. Which subjects are taking longer than expected? Which blocks are consistently being skipped and why? The weekly review is not a punishment for not following the plan — it is the mechanism by which the plan becomes progressively more realistic and therefore more sustainable.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Study Plan Builder</h3>
      <p>The builder generates a personalised sample timetable based on your academic context, your realistic daily study hours, and your specific challenges. Every timetable entry has a rationale — tap the ℹ icon on any row to see why that element is placed there. Your challenges will generate targeted advice alongside the timetable.</p>

      <StudyPlanBuilder />

      {/* ── Section 4 ── */}
      <h3 id="sample">4. Sample Study Timetable: A Week That Works</h3>
      <p>Below is a generic weekly structure that can be adapted across most student contexts. The specific subjects and times will change — the principles embedded in the structure should not.</p>

      {/* Weekly grid */}
      <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${INDIGO2}, #5568B0)`, color: 'white' }}>
              {['Time Slot', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(h => (
                <th key={h} style={{ padding: '10px 8px', textAlign: 'center', fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['6:30–9:00 AM',  'Subject A',   'Subject B',   'Subject C',   'Subject A',   'Subject B',   'Deep dive A', 'Rest'],
              ['9:00–11:30 AM', 'Subject B',   'Subject C',   'Subject A',   'Subject B',   'Subject C',   'Deep dive B', 'Rest'],
              ['11:30–1:00 PM', 'Practice Qs', 'Practice Qs', 'Practice Qs', 'Practice Qs', 'Mock test',   'Practice Qs', 'Weekly review'],
              ['1:00–3:00 PM',  'Rest',        'Rest',        'Rest',        'Rest',        'Rest',        'Rest',        'Rest'],
              ['3:00–5:00 PM',  'Subject C',   'Subject A',   'Subject B',   'Subject C',   'Weak topic',  'Weak topic',  'Free'],
              ['5:00–7:00 PM',  'Free',        'Free',        'Free',        'Free',        'Free',        'Free',        'Free'],
              ['7:00–9:00 PM',  'Revision',    'Revision',    'Revision',    'Revision',    'Review week', 'Free',        'Tomorrow plan'],
              ['9:00 PM+',      'Sleep',       'Sleep',       'Sleep',       'Sleep',       'Sleep',       'Sleep',       'Sleep'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8F9FE' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '9px 8px', textAlign: 'center', border: '1px solid var(--border)',
                    fontWeight: j === 0 ? '700' : '500',
                    color: cell === 'Rest' || cell === 'Free' || cell === 'Sleep' ? '#2D7D46' :
                           cell === 'Mock test' || cell === 'Weekly review' || cell === 'Tomorrow plan' ? INDIGO2 :
                           'var(--ink)',
                    fontSize: j === 0 ? '12px' : '12px',
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>This timetable encodes several principles simultaneously: each subject appears in the morning high-performance window at least twice per week; no subject is studied for more than two and a half hours without a break; the afternoon slot is reserved for either a weak topic requiring fresh attention or a second-priority subject; evenings are reserved for revision of that day's material (not new content); and every day ends with a defined shutdown rather than trailing off into unstructured anxiety.</p>

      {/* ── Section 5 ── */}
      <h3 id="productivity">5. Twelve Productivity Tips to Make Your Plan Stick</h3>
      <p><strong>1. Plan the week on Sunday evening, not Monday morning.</strong> Monday morning planning costs Monday morning study time and happens when you are already in the week's momentum. Sunday evening planning happens in a liminal moment that is still separate enough from the week to be strategic.</p>
      <p><strong>2. Write tomorrow's two most important tasks before you go to sleep.</strong> This single habit significantly reduces morning decision fatigue and the procrastination it produces. You wake up knowing exactly where to start.</p>
      <p><strong>3. Time-block, do not to-do.</strong> "Study maths" on a to-do list has no boundary. "Maths — 9:00 to 10:30am" does. Time-blocking makes study plans real rather than aspirational because the block has a start, an end, and a specific location in the day.</p>
      <p><strong>4. Use the 50-10 rule.</strong> Fifty minutes of focused study, ten minutes of genuine physical break. Not phone scrolling — standing up, moving, getting away from the desk. After four cycles, take a longer break of thirty minutes. This structure is more effective than either continuous study or arbitrary pausing.</p>
      <p><strong>5. Study the same subjects at the same times each day.</strong> Context-dependent memory — the brain's tendency to encode memories partly in the context where learning occurred — means that studying the same subject in the same time slot on the same days of the week improves recall during exams, which also tend to be at fixed times.</p>
      <p><strong>6. Active recall over passive re-reading.</strong> After each study block, close the book and write down everything you remember from the session. The struggle to retrieve is what builds the memory. Re-reading feels productive and is almost entirely passive. Active recall is uncomfortable and is significantly more effective.</p>
      <p><strong>7. Phone in another room, not on silent.</strong> Research by University of Texas psychologists shows that the mere presence of a smartphone on a desk — even face down and on silent — measurably reduces available working memory capacity. In another room, the cognitive effect disappears.</p>
      <p><strong>8. Build a pre-study ritual.</strong> A consistent two-minute ritual before each session (the same music, the same preparation sequence, the same brief breathing exercise) trains the brain to associate the ritual with focused study, reducing the time required to reach concentration. Over weeks, the ritual becomes the cue that initiates focus automatically.</p>
      <p><strong>9. Use the Pomodoro technique for tasks you are avoiding.</strong> Set a twenty-five minute timer and commit to working on one specific task — only that task — until the timer rings. The boundedness of the commitment makes starting feel manageable. For non-procrastinated tasks, longer blocks are more efficient; for avoided tasks, the Pomodoro's brevity is its utility.</p>
      <p><strong>10. Weekly subject rotation — never study the same subject two days in a row.</strong> Interleaved practice — studying multiple subjects in rotation rather than massing all sessions for one subject before moving to the next — produces better long-term retention and reduces the cognitive fatigue of over-concentrating on one area.</p>
      <p><strong>11. Track what you have covered, not just what you have left.</strong> The to-do list only shows the gap. A parallel "done" list shows the progress. The human brain has a negativity bias that makes remaining work feel overwhelming while completed work feels invisible. The done list counteracts this by making progress visible.</p>
      <p><strong>12. Build one full rest day per week.</strong> Not a half-day. Not "I'll rest after I finish this section." A complete, pre-planned, guilt-free day where no study occurs. This is not laziness — it is the recovery that makes the other six days sustainable. Students who build genuine weekly rest into their schedule consistently outperform those who study seven days at reducing intensity.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Study Plan FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What should I do when I fall behind my study plan?</strong><br />
        A: Never try to "make up" missed sessions by compressing them — this creates an unsustainable spike of overwork and usually produces more falling-behind rather than less. Instead, do your Sunday weekly review, identify what genuinely needs to be covered before the next exam, and redistribute it across the coming week's actual available time. The plan absorbs disruption by adapting, not by accumulating debt.</p>

        <p><strong>Q: How far in advance should I plan — daily, weekly, or monthly?</strong><br />
        A: The optimal planning horizon uses three levels: a monthly overview (which topics need to be covered before which exams, with rough weekly targets), a weekly plan (which subjects on which days, built on Sunday), and a daily plan (the specific two most important tasks for today, written the night before). Monthly gives direction. Weekly gives structure. Daily gives focus. All three together produce the most effective planning system — each level informs the next without requiring constant re-planning.</p>

        <p><strong>Q: I have tried study plans before and always abandon them by week two. What am I doing wrong?</strong><br />
        A: Almost always one of three things: the plan is too ambitious (no buffer time, no realistic accounting of how long things actually take), the plan is too rigid (no mechanism for adapting when a topic takes longer or life intervenes), or the plan has no review cycle (the Sunday review is what turns a plan into a living system rather than a document you make once and then fail to follow). Build in a 20% time buffer for every estimate, include a weekly Sunday review as a non-negotiable part of the plan itself, and reduce the plan's intensity until it is achievable before trying to increase it.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: INDIGO2, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "A plan imperfectly followed beats a perfect plan never started — every single time."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Start with something realistic. Review it. Adjust it. Follow it imperfectly. The value of a study plan is not in the perfection of its execution — it is in the clarity it creates about what you are doing, when you are doing it, and crucially, when you are genuinely done for the day and allowed to rest.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: INDIGO2, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${IBORD2}` }}
          >
            Manage Study Stress in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: INDIGO2, border: `2px solid ${INDIGO2}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Study Strategy Anonymously
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More for Student Academic Wellbeing:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-stress-management',    '→ How to Handle Exam Stress Without Panic'],
            ['/blog/exam-anxiety-help',         '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/student-stress-management', '→ Student Stress Management: Practical Techniques That Actually Work'],
            ['/blog/self-kindness-check',       '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/safe',                           '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: INDIGO2, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
