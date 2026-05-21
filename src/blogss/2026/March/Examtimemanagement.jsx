import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Manage Time Effectively for Exams",
  excerpt: "Exam time management is not about studying more hours — it is about ensuring the right subjects get the right hours at the right time in the right sequence. Learn the planner techniques and scheduling methods that transform an overwhelming exam period into a structured, manageable plan, and use our Exam Planner Builder to create yours.",
  category: "Mental Health",
  date: "28-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/exam-time-management.jpg",
  tldr: "Effective exam time management starts with a clear picture of what needs to be done, honest assessment of how much time is available, and a prioritisation system that allocates time where it produces the most marks — not where it feels most comfortable. This guide covers five planner techniques, three scheduling methods, a complete weekly exam schedule structure, and an interactive Exam Planner Builder that generates a personalised revision schedule for your specific situation.",
  toc: [
    { id: "why-fails",   title: "1. Why Exam Time Management Fails for Most Students",              level: 3 },
    { id: "planner",     title: "2. Five Planner Techniques That Structure Exam Preparation",       level: 3 },
    { id: "builder",     title: "3. Interactive: The Exam Planner Builder",                         level: 3 },
    { id: "scheduling",  title: "4. Three Scheduling Methods That Match Different Exam Contexts",   level: 3 },
    { id: "weekly",      title: "5. The Complete Weekly Exam Schedule — Step by Step",              level: 3 },
    { id: "faq",         title: "6. Exam Time Management FAQs",                                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-28T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "exam time management, how to manage time for exams, exam revision planner, exam schedule, exam time management tips, study planner exams, revision timetable",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I manage my time effectively during exam preparation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Effective exam time management requires four steps done in sequence: first, map all exam dates and subjects to understand the full scope; second, assess your current knowledge level in each subject to identify where preparation gaps are largest; third, allocate available study hours proportionally based on subject difficulty and exam weight rather than personal preference; and fourth, create a weekly schedule that protects peak-performance morning blocks for the hardest material, includes regular practice sessions alongside revision, and is reviewed and adjusted every Sunday. The most common mistake is skipping the gap assessment and allocating time by comfort level rather than need.",
      },
    },
    {
      "@type": "Question",
      "name": "How many hours should I study per day for exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research on cognitive performance and exam preparation suggests that 4-6 hours of genuinely focused, active study per day produces better outcomes than 8-10 hours of passive, distracted study. Diminishing returns on cognitive performance begin after approximately 90 minutes of focused work without a genuine break. The more important variable is the quality of the study method (active recall and practice beats re-reading significantly) rather than the total hours. Students who study 4 hours using active recall consistently outperform students who study 8 hours using passive review.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best way to make an exam revision timetable?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective exam revision timetable is built in five steps: list all subjects with their exam dates and weight; rate your current confidence in each (1-3); calculate a priority score (exam weight × weakness score); allocate weekly hours proportionally by priority score; and build the timetable with hardest subjects in morning peak windows. Review the timetable every Sunday and adjust based on actual progress. A timetable built on realistic hours (not aspirational) and actual knowledge gaps (not comfort) consistently outperforms one built on how much the student wants to study each subject.",
      },
    },
  ],
};

// ── Exam Planner Builder Data ──────────────────────────────────────────────────
const UMBER   = '#7B4F2A';
const UPALE   = '#F7F1EB';
const UBORD   = 'rgba(123,79,42,0.22)';

const EXAM_WINDOWS = [
  { key: 'w4plus',  icon: '📅', label: '4+ weeks away',          desc: 'Foundation and systematic coverage phase' },
  { key: 'w2to4',   icon: '🗓️', label: '2–4 weeks away',         desc: 'Consolidation and practice phase' },
  { key: 'w1to2',   icon: '⏳', label: '1–2 weeks away',          desc: 'Intensive practice and gap-filling phase' },
  { key: 'w3to7',   icon: '⚡', label: '3–7 days away',           desc: 'Sprint and final consolidation phase' },
  { key: 'w1to2d',  icon: '🔴', label: '1–2 days away',           desc: 'Final review and exam-eve preparation' },
];

const SUBJECTS_LOAD = [
  { key: 's2', label: '2–3 subjects', value: 2 },
  { key: 's4', label: '4–5 subjects', value: 4 },
  { key: 's6', label: '6–7 subjects', value: 6 },
  { key: 's8', label: '8+ subjects',  value: 8 },
];

const HOURS_AVAILABLE = [
  { key: 'h3',  label: '3–4 hours/day',  value: 3.5,  sessions: 2 },
  { key: 'h5',  label: '5–6 hours/day',  value: 5.5,  sessions: 3 },
  { key: 'h7',  label: '7–8 hours/day',  value: 7.5,  sessions: 4 },
  { key: 'h9',  label: '9+ hours/day',   value: 9.0,  sessions: 5 },
];

const PLANNING_CHALLENGE = [
  { key: 'start',     icon: '🚀', label: 'Cannot get started — overwhelmed before beginning' },
  { key: 'stick',     icon: '📅', label: 'Plan collapses after 2–3 days' },
  { key: 'balance',   icon: '⚖️', label: 'Cannot balance subjects — some always get neglected' },
  { key: 'practice',  icon: '⚡', label: 'Too much revision, not enough practice' },
  { key: 'realistic', icon: '🎯', label: 'Plans are too ambitious — always fall behind' },
];

const PHASE_PLANS = {
  w4plus: {
    phase: 'Foundation Phase',
    headline: 'With 4+ weeks, you have time to build genuine understanding — not just cover the syllabus.',
    week_structure: [
      { label: 'Days 1–5', focus: 'New learning', description: 'Cover all high-priority topics once — aim for genuine understanding, not memorisation. Use active recall at the end of each session to check what has been retained.', ratio: '70% learning · 30% practice' },
      { label: 'Days 6–7', focus: 'Review + plan', description: 'One day of spaced review of the week\'s material. One day of rest and next-week planning. Sunday evening: write next week\'s specific daily plan.', ratio: '50% review · 50% rest/plan' },
    ],
    daily_blocks: [
      { time: 'Morning peak (7–9:30am)', activity: 'Hardest subject — new material', type: 'primary' },
      { time: 'Mid-morning (9:30–11am)', activity: 'Second priority subject — new material', type: 'primary' },
      { time: 'Break + movement', activity: 'Genuine physical break', type: 'break' },
      { time: 'Afternoon (12–2pm)', activity: 'Practice questions from morning topics', type: 'practice' },
      { time: 'After rest (3–5pm)', activity: 'Third subject or continued practice', type: 'primary' },
      { time: 'Evening (6–7:30pm)', activity: 'Active recall review of day\'s content', type: 'review' },
    ],
    key_rules: [
      'Every topic gets active recall the same day it is first studied',
      'Schedule spaced review: revisit each topic 1 day, 3 days, and 7 days after first study',
      'Past paper questions weekly from Week 2 onward — not only in the final phase',
      'Sunday review: compare planned vs completed; adjust next week accordingly',
    ],
  },
  w2to4: {
    phase: 'Consolidation Phase',
    headline: 'With 2–4 weeks, the balance shifts from learning to practice — your ratio should be 50/50 or higher on practice.',
    week_structure: [
      { label: 'Days 1–4', focus: 'Targeted gap-filling', description: 'Use practice papers to identify specific gaps, then study those gaps directly. No comprehensive re-reading of covered material — only targeted work on identified weaknesses.', ratio: '40% learning · 60% practice' },
      { label: 'Days 5–6', focus: 'Mock + review', description: 'Full past paper under timed exam conditions. Thorough same-day review of every error. Error review is the most valuable learning available at this stage.', ratio: '30% learning · 70% practice' },
      { label: 'Day 7', focus: 'Rest + plan', description: 'Genuine rest. Brief Sunday planning (20 minutes). Adequate sleep.', ratio: 'Rest' },
    ],
    daily_blocks: [
      { time: 'Morning peak (7–9:30am)', activity: 'Weakest subject — targeted gap revision', type: 'primary' },
      { time: 'Mid-morning (10–11:30am)', activity: 'Past questions on morning topic', type: 'practice' },
      { time: 'Break + movement', activity: 'Physical break — mandatory', type: 'break' },
      { time: 'Afternoon (1–3pm)', activity: 'Second subject — practice + targeted study', type: 'practice' },
      { time: 'Late afternoon (3:30–5pm)', activity: 'Error review from today\'s practice', type: 'review' },
      { time: 'Evening (6–7:30pm)', activity: 'Third subject — key topics revision', type: 'primary' },
    ],
    key_rules: [
      'Every error made in practice must be reviewed the same day — not the next day',
      'No re-reading topics you already know — use practice to surface actual gaps',
      'At least one full timed past paper per week under exam conditions',
      'Stop studying at a defined cutoff (9pm) — the final hour before sleep should be wind-down, not cramming',
    ],
  },
  w1to2: {
    phase: 'Intensive Practice Phase',
    headline: 'With 1–2 weeks, practice is the primary activity. Revision supports practice — not the other way around.',
    week_structure: [
      { label: 'Days 1–3', focus: 'Targeted sprint', description: 'Identify the highest-frequency exam topics from past papers. Cover each one once with active recall, then immediately practise questions. No new material beyond high-frequency topics.', ratio: '25% revision · 75% practice' },
      { label: 'Days 4–5', focus: 'Mock conditions', description: 'Full past papers under timed exam conditions each day. Full error review immediately after each paper. High-yield flashcard review in the evenings.', ratio: '20% revision · 80% practice' },
      { label: 'Days 6–7', focus: 'Final consolidation', description: 'Key points summary review. No new material. Adequate sleep. Exam logistics prepared.', ratio: 'Consolidation + rest' },
    ],
    daily_blocks: [
      { time: 'Morning (7–9:30am)', activity: 'Past paper or timed practice — exam conditions', type: 'practice' },
      { time: 'Mid-morning (9:30–11am)', activity: 'Immediate error review from morning paper', type: 'review' },
      { time: 'Break + movement', activity: 'Physical break', type: 'break' },
      { time: 'Afternoon (12–2pm)', activity: 'Targeted revision on identified weak topics', type: 'primary' },
      { time: 'Late afternoon (3–4:30pm)', activity: 'Second subject — practice questions', type: 'practice' },
      { time: 'Evening (5:30–7pm)', activity: 'Flashcard review — key definitions and formulae', type: 'review' },
    ],
    key_rules: [
      'Past paper practice takes priority over revision every day at this stage',
      'Error review the same day — this is the highest-value learning available now',
      'No new topics introduced that are not high-frequency past paper topics',
      'Sleep 8 hours every night — the consolidation is as important as the practice',
    ],
  },
  w3to7: {
    phase: 'Sprint Phase',
    headline: 'With 3–7 days, you are consolidating — not learning new material. Everything is targeted, timed, and practised.',
    week_structure: [
      { label: 'Each day', focus: 'Triage and practice', description: 'Identify the two or three highest-yield topics per subject (from past paper frequency analysis). For each: one active recall session, then practice questions. No comprehensive coverage — only high-yield targeted work.', ratio: '20% revision · 80% practice' },
      { label: 'Two days before each exam', focus: 'Final review', description: 'High-yield summary review only. No new material. Full practice paper if available. Sleep 8 hours. Materials organised.', ratio: 'Review + rest' },
    ],
    daily_blocks: [
      { time: 'Morning (7–9am)', activity: 'Subject A — high-yield topics active recall', type: 'primary' },
      { time: '9–10:30am', activity: 'Subject A — past questions on those topics', type: 'practice' },
      { time: 'Break + food', activity: 'Proper meal and physical break', type: 'break' },
      { time: '11:30am–1pm', activity: 'Subject B — high-yield topics active recall', type: 'primary' },
      { time: '1:30–3pm', activity: 'Subject B — practice questions + error review', type: 'practice' },
      { time: '3–3:30pm', activity: 'Break + movement', type: 'break' },
      { time: '3:30–5pm', activity: 'Subject C or weakest remaining area', type: 'primary' },
      { time: '5pm onwards', activity: 'Flashcard review only — no new material', type: 'review' },
    ],
    key_rules: [
      'No new topics — high-yield only, targeted, timed',
      'Every error reviewed the same day',
      'Hard study cutoff at 9pm — sleep is now the primary performance strategy',
      'All exam logistics confirmed: venue, time, materials, ID',
    ],
  },
  w1to2d: {
    phase: 'Final Review Phase',
    headline: 'With 1–2 days left, the preparation window is closed. This is consolidation and self-care — not new learning.',
    week_structure: [
      { label: 'Day before', focus: 'Light review + preparation', description: 'Brief review of high-yield summary notes (maximum 2 hours, morning only). All materials and logistics prepared. Proper meal. Physical movement. Early bed — 8 hours minimum.', ratio: 'Light review + rest' },
      { label: 'Morning of exam', focus: 'Activation only', description: 'Brief (20-minute) review of key formulae or definitions from summary notes. Physical movement. Proper breakfast. No cramming.', ratio: 'Activation + wellbeing' },
    ],
    daily_blocks: [
      { time: 'Morning (8–10am)', activity: 'High-yield summary notes — light review only', type: 'review' },
      { time: '10am–12pm', activity: 'Rest + personal time (non-academic)', type: 'break' },
      { time: '12–1pm', activity: 'Lunch — proper meal, away from desk', type: 'break' },
      { time: '1–2pm', activity: 'Flashcards — key definitions only (no new material)', type: 'review' },
      { time: '2–4pm', activity: 'Rest, walk, or genuinely enjoyable non-academic activity', type: 'break' },
      { time: '4–6pm', activity: 'All exam materials organised and ready', type: 'break' },
      { time: '8pm onwards', activity: 'Wind-down. No academic content. Sleep by 10pm.', type: 'break' },
    ],
    key_rules: [
      'No new material today — consolidate what you have, trust what you know',
      'Sleep 8 hours — this is the most important revision decision remaining',
      'Materials ready tonight: ID, stationery, water, route to exam venue confirmed',
      'The preparation is done. Your job now is to be rested and regulated for tomorrow.',
    ],
  },
};

const CHALLENGE_FIXES = {
  start: {
    technique: 'The Minimum Viable Plan',
    description: 'When the full scope of exam preparation feels paralyzing, reduce the planning task to its minimum viable version: write tomorrow\'s two most important study tasks only. Not the whole timetable — tomorrow\'s two tasks. This gets you started without the overwhelm of planning everything at once. The full plan is built one day at a time, each evening.',
    steps: [
      'Tonight: write exactly two study tasks for tomorrow (specific, completable, defined)',
      'Tomorrow evening: review what you did, then write two tasks for the day after',
      'By Day 5: you have enough data about your actual pace to build a realistic weekly plan',
      'Sunday: use five sessions\' worth of actual pace data to plan the full coming week',
    ],
  },
  stick: {
    technique: 'The Contingency Plan + Sunday Reset',
    description: 'Plans collapse because they have no mechanism for recovering from missed days — a missed day creates a gap that grows until the plan is abandoned. The contingency plan solves this: for every planned day, designate one item as the "non-negotiable minimum" that counts as success even when everything else falls apart.',
    steps: [
      'For each study day, mark one item as the minimum: "if nothing else happens, I do this"',
      'When a day is disrupted, the minimum keeps the habit alive even when the full plan fails',
      'Every Sunday: 15-minute plan review — acknowledge what was missed, adjust next week\'s plan',
      'The reset is the mechanism that prevents one bad day from becoming a plan-abandon',
    ],
  },
  balance: {
    technique: 'The Priority Score Allocation',
    description: 'Subject neglect happens when time is allocated by comfort rather than by need. The priority score forces allocation by actual need: exam weight × weakness rating = priority score. Subjects with the highest priority score get the most hours — not the most enjoyable or most familiar.',
    steps: [
      'List every subject with its approximate exam weight percentage',
      'Rate your current confidence in each: 1 (very confident) to 5 (very weak)',
      'Priority Score = Exam Weight × Confidence Score',
      'Allocate weekly study hours proportionally by priority score',
    ],
  },
  practice: {
    technique: 'The Practice-First Session Rule',
    description: 'Too much revision and not enough practice is the most common and most costly exam preparation mistake. The practice-first rule corrects this: every study session begins with a practice attempt before any revision. The attempt reveals what you actually know and cannot know — making the subsequent revision targeted rather than comprehensive.',
    steps: [
      'Begin every session by attempting 2–3 past questions on the topic, without notes',
      'After the attempt: identify specifically what you could not do',
      'Revise only the specific gaps the practice attempt revealed',
      'Return to another practice attempt — this is the check that revision worked',
    ],
  },
  realistic: {
    technique: 'The 70% Rule + Buffer Days',
    description: 'Ambitious plans fail because they assume every day will go as planned. The 70% rule: plan only 70% of the available study time. The remaining 30% is built-in buffer for tasks that run long, low-energy days, and unexpected demands. A plan executed at 70% capacity consistently outperforms an ambitious plan executed at 40% capacity.',
    steps: [
      'Calculate your realistic daily available study hours and multiply by 0.7',
      'Plan only the 70% — leave the remaining 30% as intentional buffer',
      'If the buffer is not needed, use it for additional practice or rest',
      'If it is needed, the plan does not collapse — it uses the buffer as intended',
    ],
  },
};

// ── Planner Builder Component ──────────────────────────────────────────────────
function ExamPlannerBuilder() {
  const [step,      setStep]      = useState(1);
  const [window,    setWindow]    = useState(null);
  const [subjects,  setSubjects]  = useState(null);
  const [hours,     setHours]     = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openBlock, setOpenBlock] = useState(null);
  const [openRule,  setOpenRule]  = useState(false);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selWin  = EXAM_WINDOWS.find(w => w.key === window);
  const selSub  = SUBJECTS_LOAD.find(s => s.key === subjects);
  const selHrs  = HOURS_AVAILABLE.find(h => h.key === hours);
  const selChal = PLANNING_CHALLENGE.find(c => c.key === challenge);
  const phasePlan = window ? PHASE_PLANS[window] : null;
  const chalFix   = challenge ? CHALLENGE_FIXES[challenge] : null;

  const handleReset = () => { setStep(1); setWindow(null); setSubjects(null); setHours(null); setChallenge(null); setRevealed(false); setOpenBlock(null); setOpenRule(false); };

  const TYPE_COLOR = { primary: UMBER, practice: '#2D7D46', review: '#3B4B8A', break: '#B5543A' };
  const TYPE_LABEL = { primary: '📘 Study', practice: '⚡ Practice', review: '🔄 Review', break: '🌿 Break' };

  const GridBtn = ({ options, selected, onSelect, cols = 2 }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '8px', marginBottom: '16px' }}>
      {options.map(opt => {
        const isSel = selected === opt.key;
        return (
          <button key={opt.key} onClick={() => onSelect(opt.key)} style={{
            padding: '13px 14px', borderRadius: '11px', border: '2px solid',
            borderColor: isSel ? UMBER : 'var(--border)', background: isSel ? UPALE : 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
            boxShadow: isSel ? `0 0 0 2px ${UBORD}` : 'none',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? UMBER : 'var(--ink)' }}>{opt.label}</div>
            {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', lineHeight: 1.3 }}>{opt.desc}</div>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? UMBER : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — time window */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — How long until your exams?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            The time window determines your study phase — what kind of preparation is most valuable right now.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {EXAM_WINDOWS.map(ew => {
              const isSel = window === ew.key;
              return (
                <button key={ew.key} onClick={() => setWindow(ew.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? UMBER : 'var(--border)', background: isSel ? UPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${UBORD}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{ew.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? UMBER : 'var(--ink)' }}>{ew.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{ew.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (window) setStep(2); }} disabled={!window} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: window ? `linear-gradient(135deg, ${UMBER}, #A06535)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: window ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: window ? `0 6px 18px ${UBORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — subjects */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How many subjects are you preparing for?
          </p>
          <GridBtn options={SUBJECTS_LOAD} selected={subjects} onSelect={setSubjects} cols={2} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (subjects) setStep(3); }} disabled={!subjects} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: subjects ? `linear-gradient(135deg, ${UMBER}, #A06535)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: subjects ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — hours */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — How many hours can you realistically study each day?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest — a realistic plan you follow beats an ambitious plan that collapses.
          </p>
          <GridBtn options={HOURS_AVAILABLE} selected={hours} onSelect={setHours} cols={2} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (hours) setStep(4); }} disabled={!hours} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: hours ? `linear-gradient(135deg, ${UMBER}, #A06535)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: hours ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 4 — planning challenge */}
      {step === 4 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — What is your biggest time management challenge?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {PLANNING_CHALLENGE.map(pc => {
              const isSel = challenge === pc.key;
              return (
                <button key={pc.key} onClick={() => setChallenge(pc.key)} style={{
                  padding: '12px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? UMBER : 'var(--border)', background: isSel ? UPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${UBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{pc.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? UMBER : 'var(--ink)' }}>{pc.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(3)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (challenge) { setStep(5); setRevealed(false); } }} disabled={!challenge} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: challenge ? `linear-gradient(135deg, ${UMBER}, #A06535)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: challenge ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Exam Plan →</button>
          </div>
        </>
      )}

      {/* STEP 5 — Results */}
      {step === 5 && phasePlan && chalFix && selWin && selSub && selHrs && selChal && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Your Personalised Exam Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${UMBER}, #A06535)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${UBORD}`,
              }}>📋 Generate My Exam Plan</button>
              <button onClick={() => setStep(4)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${UMBER}, #A06535)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selWin.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {phasePlan.phase}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                  {selWin.label} · {selSub.label} · {selHrs.label}
                </div>
              </div>

              {/* Phase headline */}
              <div style={{ background: UPALE, border: `1.5px solid ${UBORD}`, borderRadius: '12px', padding: '13px 16px', marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: UMBER, lineHeight: 1.65 }}>{phasePlan.headline}</p>
              </div>

              {/* Calculated allocation */}
              <div style={{ background: 'white', border: `1.5px solid ${UBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: UMBER, marginBottom: '10px' }}>⏱️ Your Time Allocation</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Hours/day', value: `${selHrs.value}h`, icon: '⏰' },
                    { label: 'Sessions/day', value: selHrs.sessions, icon: '📚' },
                    { label: 'Hrs/subject/week', value: `${((selHrs.value * 6) / selSub.value).toFixed(1)}h`, icon: '📊' },
                  ].map(item => (
                    <div key={item.label} style={{ background: UPALE, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: UMBER }}>{item.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Week structure */}
              <div style={{ background: 'white', border: `1.5px solid ${UBORD}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', background: `${UMBER}10`, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: UMBER }}>📅 Weekly Structure for Your Phase</div>
                </div>
                {phasePlan.week_structure.map((ws, i) => (
                  <div key={i} style={{ padding: '12px 16px', borderBottom: i < phasePlan.week_structure.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'white' : UPALE }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: UMBER }}>{ws.label}: {ws.focus}</div>
                      <div style={{ fontSize: '10px', fontWeight: '700', background: `${UMBER}15`, color: UMBER, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>{ws.ratio}</div>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ws.description}</p>
                  </div>
                ))}
              </div>

              {/* Daily blocks — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: UMBER, marginBottom: '9px' }}>
                  📅 Sample Daily Block Schedule — Tap to Expand
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {Object.entries(TYPE_LABEL).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: TYPE_COLOR[k] }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLOR[k] }} />
                      {v}
                    </div>
                  ))}
                </div>
                {phasePlan.daily_blocks.map((block, i) => {
                  const isOpen = openBlock === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '10px', marginBottom: '6px', overflow: 'hidden', border: `1.5px solid ${UBORD}` }}>
                      <button onClick={() => setOpenBlock(isOpen ? null : i)} style={{
                        width: '100%', padding: '11px 14px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: TYPE_COLOR[block.type], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: TYPE_COLOR[block.type], marginBottom: '1px' }}>{block.time}</div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>{block.activity}</div>
                        </div>
                        <span style={{ color: UMBER, fontSize: '12px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 14px 10px 14px', borderTop: '1px solid var(--border)' }}>
                          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
                            {TYPE_LABEL[block.type]} block — {block.activity}. During your {phasePlan.phase}, this slot is optimised for {block.type === 'primary' ? 'new learning or targeted revision' : block.type === 'practice' ? 'active practice and past questions' : block.type === 'review' ? 'error review and spaced repetition' : 'genuine cognitive recovery'}.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Non-negotiable rules */}
              <div style={{ background: UPALE, border: `2px solid ${UBORD}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <button onClick={() => setOpenRule(o => !o)} style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: UMBER }}>📌 Non-Negotiable Rules for Your Phase</div>
                  <span style={{ color: UMBER, fontSize: '14px' }}>{openRule ? '▲' : '▼'}</span>
                </button>
                {openRule && (
                  <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)' }}>
                    {phasePlan.key_rules.map((rule, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', padding: '7px 0', borderBottom: i < phasePlan.key_rules.length - 1 ? `1px solid ${UBORD}` : 'none' }}>
                        <span style={{ color: UMBER, fontWeight: '700', flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{rule}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Challenge fix */}
              <div style={{ background: 'white', border: `2px solid ${UBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', borderLeft: `4px solid ${UMBER}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: UMBER, marginBottom: '5px' }}>
                  🎯 {selChal.icon} Your Planning Technique: {chalFix.technique}
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{chalFix.description}</p>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: UMBER, marginBottom: '7px' }}>Steps:</div>
                {chalFix.steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '9px', padding: '5px 0', borderBottom: i < chalFix.steps.length - 1 ? `1px solid ${UBORD}` : 'none' }}>
                    <div style={{ width: '21px', height: '21px', borderRadius: '50%', background: `linear-gradient(135deg, ${UMBER}, #A06535)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>

              {/* Affirmation */}
              <div style={{ background: UPALE, border: `1.5px dashed ${UBORD}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: UMBER, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "The plan that runs at 70% consistency delivers more than the perfect plan abandoned on Day 3."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${UBORD}`, color: UMBER, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ExamTimeManagement({ navigate, relatedPosts }) {
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
      <p><strong>Exam time management</strong> is the skill that most students most consistently underestimate. They spend enormous energy on which subjects to study and how to study them — and almost none on the meta-level question of whether the available time is being allocated in the way that produces the best possible outcome across all subjects.</p>

      <p>The result is predictable: students who prepared diligently arrive at exam week with several subjects thoroughly covered and one or two significantly underprepared — because the allocation was driven by comfort and habit rather than by a deliberate system. A good time management plan would have caught the imbalance three weeks earlier. This guide builds that plan.</p>

      <img
        src={meta.imgUrl}
        alt="Student managing exam time effectively with structured planner techniques, scheduling methods, and prioritised revision timetables"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-fails">1. Why Exam Time Management Fails for Most Students</h3>

      <p><strong>Failure mode 1: Planning by preference, not by need.</strong> The most common and most costly time management failure is allocating study time to subjects the student enjoys or feels confident in — rather than to the subjects where the preparation gap is largest and the exam weight is highest. Students are not consciously choosing comfort over need; they are following the path of least resistance, which naturally leads away from difficult, anxiety-producing material toward familiar, rewarding territory. Without a deliberate allocation system that overrides this natural drift, study time consistently flows in the wrong direction.</p>

      <p><strong>Failure mode 2: Revision over practice — and discovering gaps too late.</strong> Most students spend the majority of their exam preparation time revising (re-reading, summarising, reviewing notes) rather than practising (attempting past questions, self-testing, doing problems). Revision creates the comfortable feeling of familiarity; practice reveals the gaps that familiarity conceals. The specific catastrophe this produces: students discover their major knowledge gaps in the exam hall — the only place where it is genuinely too late to address them. A time management plan that builds practice into every week from the beginning eliminates this disaster.</p>

      <p><strong>Failure mode 3: Plans that were never realistic.</strong> Most student exam timetables are aspirational documents — the schedule a student hopes to follow rather than the schedule they are realistically able to follow. When the plan is built on twelve ideal study hours per day and the reality is six or seven, the plan fails on Day 2 and is abandoned. The gap between planned and actual is not a motivational failure — it is a planning failure. Realistic plans built on honest assessment of available hours are executable; aspirational ones are not.</p>

      <p><strong>Failure mode 4: No mechanism for adjustment.</strong> Even a well-built initial plan becomes inaccurate over time as some subjects take longer than expected, some shorter, and unpredicted events disrupt specific days. Without a regular review mechanism (a Sunday calibration session), the plan becomes increasingly misaligned with reality while the student continues following it — or abandons it when the gap becomes visible. The Sunday review is the single most important mechanism for keeping a time management plan functional across a full exam period.</p>

      {/* ── Section 2 ── */}
      <h3 id="planner">2. Five Planner Techniques That Structure Exam Preparation</h3>

      <p><strong>Technique 1: The Master Exam Map.</strong> Before creating any schedule, map the complete picture on a single page: every exam with its date, its weight or marks allocation, and your current honest confidence rating (1-3). This master map is the strategic document that all subsequent planning references. It reveals the total scope, identifies the highest-priority gaps (high weight × low confidence), and shows the exact sequence of exams that determines which subjects need to peak when. Creating the master map is the single most valuable 30 minutes of pre-preparation planning available. Without it, every subsequent decision is made without the information it requires.</p>

      <p><strong>Technique 2: The Priority Score System.</strong> From the master map, calculate a priority score for each subject: Exam Weight (%) × Weakness Score (5 = very weak, 1 = very strong). A subject worth 25% of your total grade where you rate yourself 5/5 on weakness scores 125. A subject worth 10% where you rate yourself 1/5 scores 10. The ratio is 12.5:1 — meaning the first subject should receive twelve and a half times more study hours than the second. Most students' actual allocations are roughly equal across subjects. This system corrects that distortion systematically.</p>

      <p><strong>Technique 3: The Weekly Block Plan.</strong> Armed with priority scores and available hours, build a weekly block plan that assigns subjects to specific days and times rather than leaving daily decisions to be made under the pressures of the morning. The block plan has four components: morning peak blocks (for the hardest or highest-priority material, when cognitive performance is highest), practice blocks (for past questions and self-testing, which should occur daily from the second week), review blocks (for spaced revision of previously covered material), and recovery blocks (genuine breaks and rest that are scheduled, not earned through completing more work).</p>

      <p><strong>Technique 4: The Completion Unit Method.</strong> Each planned study block specifies not a subject but a specific completion unit: not "Chemistry" but "Complete active recall on Chapter 6 reactions + attempt 5 past questions on equilibrium." The completion unit has a defined endpoint — it is done when the specific task is finished, not when a time period has elapsed. This approach produces two important effects: it creates genuine daily completion (the session is done when the unit is done, making rest feel legitimate rather than guilty) and it provides the data for realistic planning (knowing how long specific completion units take allows subsequent plans to be built on actual rather than assumed durations).</p>

      <p><strong>Technique 5: The Sunday Calibration.</strong> Every Sunday evening, fifteen minutes of structured review: What did I actually cover versus what I planned? Which subjects are ahead of schedule and which are behind? What specifically was the cause of any significant deviation from plan? What one adjustment to next week's plan does this information require? The Sunday calibration is not a self-criticism session — it is an information-gathering and plan-adjustment session. It is the mechanism that makes the plan a living document rather than an increasingly irrelevant aspirational artefact.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Exam Planner Builder</h3>
      <p>The Builder generates a personalised exam preparation plan calibrated to your time window, subject load, available daily hours, and biggest planning challenge. The result includes your preparation phase name and headline principle, a weekly structure with revision-to-practice ratios, a sample daily block schedule, your phase-specific non-negotiable rules, and a specific planning technique for your stated challenge — with step-by-step implementation.</p>

      <ExamPlannerBuilder />

      {/* ── Section 4 ── */}
      <h3 id="scheduling">4. Three Scheduling Methods That Match Different Exam Contexts</h3>

      <p><strong>Method 1: The Subject Rotation Schedule (for multiple exams across 3+ weeks).</strong> Assign each subject to specific days of the week, rotating so that each subject appears a minimum of twice per week and higher-priority subjects appear three to four times. The rotation removes the daily decision about what to study (which is where procrastination lives) and ensures no subject goes unvisited for more than three days — the maximum gap before meaningful forgetting begins to undermine the previous session's work.</p>

      <p>Example rotation for five subjects over six study days (Sunday = rest and plan):</p>
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${UMBER}, #A06535)`, color: 'white' }}>
              {['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(h => (
                <th key={h} style={{ padding: '9px 8px', textAlign: 'center', fontWeight: '700', fontSize: '11px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Morning',   'Sub A', 'Sub C', 'Sub B', 'Sub D', 'Sub A', 'Sub E',     'REST'],
              ['Afternoon', 'Sub B', 'Sub D', 'Sub A', 'Sub E', 'Sub C', 'Sub B+D',   'REST'],
              ['Practice',  'A Qs',  'C Qs',  'B Qs',  'D Qs',  'A+B Qs','Past Paper','PLAN'],
              ['Evening',   'Review','Review','Review','Review','Review','Free',        'PLAN'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : UPALE }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px', textAlign: 'center', border: '1px solid var(--border)', fontWeight: j === 0 ? '700' : '500', fontSize: '12px', color: cell === 'REST' ? '#2D7D46' : cell === 'PLAN' ? UMBER : cell.includes('Qs') || cell === 'Past Paper' ? '#3B4B8A' : 'var(--ink)' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p><strong>Method 2: The Exam-Sequence Schedule (for exams occurring in close sequence).</strong> When exams are clustered across 7-10 days, the schedule is built backwards from each exam date. The subject whose exam comes first gets intensive preparation in the 3 days before its exam, with other subjects maintained but not expanded. After each exam, the preparation focus rotates to the next exam. This method prevents the specific disaster of over-preparing for the first exam at the expense of the last.</p>

      <p><strong>Method 3: The Sprint-and-Recover Schedule (for the final 7-10 days).</strong> In the final week of exam preparation, the scheduling method changes from balanced rotation to sprint-and-recover: two intense study days focused on the next exam's subject, one lighter day for maintaining other subjects, then two intense days for the following exam's subject, and so on. The lighter days are not rest days — they are maintenance days that keep non-immediate subjects from deteriorating while allowing focused intensive preparation for the imminent exam.</p>

      {/* ── Section 5 ── */}
      <h3 id="weekly">5. The Complete Weekly Exam Schedule — Step by Step</h3>

      <p><strong>Step 1: Audit your starting position (Sunday, Week 1).</strong> List every exam, its date, its weight, and your current honest confidence rating (1-3). Calculate priority scores. Calculate total available study hours across the remaining weeks. Divide priority-weighted hours across subjects. This audit takes 45 minutes and produces the only accurate picture of your actual situation that all subsequent planning can be built on.</p>

      <p><strong>Step 2: Build the week's block plan (Sunday evening, 15 minutes).</strong> Using the priority allocation, assign subjects to morning blocks. Assign practice sessions to afternoon blocks. The rule: every subject that receives a morning study block also receives a practice block within the same or the following day — never study without same-day or next-day practice. Write specific completion units (not subjects) for every planned block.</p>

      <p><strong>Step 3: Protect the morning peak window.</strong> The two hours after you are fully awake and before the cognitive energy of the morning diminishes are the highest-performance window available. Every morning peak block should contain the highest-priority or most cognitively demanding material of the day. Do not use this window for email, administrative tasks, or easy review — it is reserved for the hardest work, because that is where it produces the most return.</p>

      <p><strong>Step 4: Schedule practice daily from the second week onward.</strong> Past questions and self-testing should appear in the schedule every single day from two weeks before the first exam — not only in the final sprint. Daily practice reveals daily gaps while there is still time to address them. The student who begins regular past paper practice in Week 3 of 4 discovers their major gaps in Week 3; the student who begins in Week 1 discovers them in Week 1 and has three additional weeks to address them.</p>

      <p><strong>Step 5: Build in the Sunday rest and calibration cycle.</strong> A full rest day on Sunday, followed by fifteen minutes of calibration and planning at Sunday evening, is the single most important structural element of a sustainable exam schedule. The rest day restores the cognitive and physical resources that the week's intense study depletes. The calibration ensures the following week's plan is built on the reality of what the previous week revealed — not on the optimistic assumptions of the original plan.</p>

      <p><strong>Step 6: Define the shutdown time and protect it.</strong> Write the daily study cutoff time before the day begins — not during the day when the temptation to extend is present. Protect the cutoff the same way you would protect an exam appointment. The hours after the cutoff are not "wasted study time" — they are the recovery window that maintains the cognitive quality of the following morning's peak study session. Trading them for additional study produces lower total output across the week, not higher.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Exam Time Management FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I know I need to manage my time better but every plan I make falls apart. What is the deeper problem?</strong><br />
        A: Plan collapse usually has one of three root causes: the plan was unrealistic (too many hours assumed, not enough buffer for tasks that run long), there was no recovery mechanism (one missed day cascades into plan abandonment because there is no defined way to reset), or the plan did not specify what to do rather than how long to do it (time-based planning without completion units means sessions can run indefinitely or end at arbitrary points). Addressing each: build the plan on 70% of available hours; designate a minimum viable task for each day that counts as success even when the full plan is not achieved; and write specific completion units rather than subjects. These three changes produce the most dramatic improvement in plan adherence.</p>

        <p><strong>Q: How do I handle it when an exam I prepared least for is the first one scheduled?</strong><br />
        A: Accept the constraint immediately and explicitly — the preparation is uneven and the schedule cannot be changed. Triage the underrepared exam: identify the three highest-frequency topics from its past papers and spend the available days covering those deeply rather than trying to cover the full syllabus shallowly. Deep coverage of high-frequency topics produces better marks than shallow coverage of everything. After that exam, redistribute the saved time to subsequent exams. The specific mistake to avoid: spending the days before the first exam trying to match the preparation level of the other exams, at the cost of the first exam's achievable preparation.</p>

        <p><strong>Q: Should I study on the day before each exam?</strong><br />
        A: Light review only on the day before any exam — maximum two hours in the morning, covering high-yield summary points and key formulae. No new material, no new topics, no comprehensive re-reading. The day before an exam is not a preparation day — it is a consolidation and recovery day. The sleep that night is the most important remaining preparation activity: eight hours of sleep enables the hippocampal memory consolidation that converts the preparation into accessible exam-day retrieval. Studying through the night before an exam consistently produces worse exam performance than equivalent rest would have provided.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: UMBER, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "A plan built on honest assessment of where your time is most needed — and reviewed every week against reality — is worth more than twice the hours of unplanned effort."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Exam time management is not a productivity trick. It is the fundamental question of whether the limited and irreplaceable time between now and the exam is being used where it produces the most marks. That question has a specific, data-driven answer — and the planner techniques in this guide exist to find it. Build the plan. Review it weekly. Trust the system over the anxiety.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: UMBER, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${UBORD}` }}
          >
            Manage Exam Stress in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: UMBER, border: `2px solid ${UMBER}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Exam Plan Strategy
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Complete Your Exam Preparation Toolkit:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/time-management-exams',            '→ Time Management Tips for Students During Exams'],
            ['/blog/memory-retention-study',           '→ How to Improve Memory Retention While Studying'],
            ['/blog/study-without-distractions',       '→ How to Study Without Distractions in a Digital World'],
            ['/blog/manage-multiple-subjects',         '→ How to Manage Multiple Subjects Without Feeling Overwhelmed'],
            ['/blog/avoid-exam-panic',                 '→ How to Avoid Last-Minute Exam Anxiety and Panic'],
            ['/blog/stay-calm-during-exams',           '→ How to Stay Calm and Confident During Exams'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: UMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
