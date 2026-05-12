import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Balance Studies and Mental Health Effectively",
  excerpt: "Study-life balance is not about equal hours — it is about sustainable rhythm. Learn why the binary of 'studying' vs 'not studying' is the wrong frame, how to build a routine that protects both your grades and your mental health, and use our Balance Audit to identify exactly where your current routine is working and where it is quietly costing you.",
  category: "Mental Health",
  date: "06-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/balance-studies-mental-health.jpg",
  tldr: "Study-life balance for students is not a time management problem — it is a values and recovery problem. Most students who feel out of balance are not spending too much time studying or too little. They are studying without genuine recovery, carrying academic anxiety into their personal time, and operating without clear structures that make both study and rest feel legitimate. This guide covers the real obstacles, realistic routine frameworks, five student struggle stories, and an interactive Balance Audit to reveal where your specific imbalance is and what to do about it.",
  toc: [
    { id: "real-problem",  title: "1. Why Study-Life Balance Is Harder Than It Looks",               level: 3 },
    { id: "struggles",     title: "2. Five Real Student Struggles — and What They Reveal",            level: 3 },
    { id: "audit",         title: "3. Interactive: The Balance Audit",                                level: 3 },
    { id: "routines",      title: "4. Realistic Routine Frameworks for Different Student Types",      level: 3 },
    { id: "tips",          title: "5. Twelve Practical Tips for Sustainable Study-Life Balance",      level: 3 },
    { id: "faq",           title: "6. Study-Life Balance FAQs",                                       level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-06T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "study life balance, how to balance studies and mental health, student study balance, study mental health tips, routine for students, student wellbeing routine, balance academics and personal life",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do students balance studies and mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Effective study-life balance for students requires four elements: structured study time with clear start and end points (so study does not bleed into all available time), protected recovery activities that are non-negotiable (not traded away when pressure increases), cognitive disengagement skills (the ability to mentally step away from academic content during non-study time), and regular self-monitoring to catch imbalance before it becomes burnout. The most common mistake is attempting to balance through willpower and good intentions rather than through structural change.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it okay to take breaks from studying for mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not only is it okay — it is functionally necessary for effective learning. Research on deliberate practice by K. Anders Ericsson shows that the brain cannot sustain high-quality focused learning for more than 4-6 hours per day, and that attempting to study beyond this threshold produces rapidly diminishing returns. Regular breaks within study sessions (every 45-90 minutes) and genuine daily non-study time are not threats to academic performance — they are what make sustained academic performance possible.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the ideal daily routine for a student's mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A mentally healthy student daily routine typically includes: 7-9 hours of sleep (the single most important variable), a defined study window with clear boundaries (usually 4-6 hours of focused study rather than continuous low-grade effort), at least 30 minutes of physical movement, at least one genuine social interaction, at least one non-academic activity that provides enjoyment or meaning, and a consistent wind-down routine before sleep that does not involve academic work or screens.",
      },
    },
  ],
};

// ── Balance Audit Data ─────────────────────────────────────────────────────────
const SAGE2   = '#3D6B57';
const SPALE2  = '#EDF4F0';
const SBORD2  = 'rgba(61,107,87,0.22)';

const BALANCE_DIMS = [
  {
    id:     'study_quality',
    icon:   '📚',
    label:  'Study Quality',
    desc:   'Whether your study time is genuinely productive rather than just physically present',
    questions: [
      'When I study, I am genuinely focused — not distracted, guilty, or going through the motions.',
      'I leave study sessions feeling that I actually learned something, not just that I spent time at a desk.',
      'I have a clear sense of what I need to study and why — I do not just open a book and hope for the best.',
    ],
    low_insight: 'Low study quality means you are spending time on study without getting the cognitive return. This often leads to studying more hours to compensate — which is both exhausting and ineffective. The fix is not more time but better structure: shorter, focused, well-defined sessions with genuine breaks.',
    habit: 'Introduce the "two-task rule": before each study session, write exactly two specific things you want to be able to do or know by the end of it. This focus doubles retention and dramatically reduces the drift that makes study feel unproductive.',
  },
  {
    id:     'recovery',
    icon:   '🌿',
    label:  'Recovery Quality',
    desc:   'Whether your non-study time genuinely restores you — or just continues the anxiety in a different room',
    questions: [
      'When I am not studying, I can genuinely let go — I am not thinking about assignments, exams, or what I should be doing.',
      'I have at least one activity in my week that I genuinely enjoy and that has nothing to do with academic performance.',
      'My rest actually makes me feel rested — not guilty, not restless, not like I am wasting time.',
    ],
    low_insight: 'Low recovery quality means you are present in rest time but absent from it — the anxiety continues even when the books are closed. This is one of the most exhausting patterns in student life, because it eliminates recovery without eliminating study. The result is continuous depletion without the relief of either.',
    habit: 'Introduce a physical "study shutdown ritual" at the end of each study session — closing the notebook, saying "I am done for now," and doing one brief physical action (washing your hands, making a drink) that signals to your nervous system the transition from study mode to rest mode. The ritual builds the cognitive disengagement that rest requires.',
  },
  {
    id:     'social',
    icon:   '🤝',
    label:  'Social Connection',
    desc:   'Whether you are maintaining genuine human connection alongside academic demands',
    questions: [
      'I have had at least one genuine, non-academic conversation with someone I care about this week.',
      'I do not consistently cancel social plans because of study — or if I do, it is an exception rather than a pattern.',
      'I feel supported — I have people in my life who know how I am actually doing, not just how I am performing.',
    ],
    low_insight: 'Social isolation is both a symptom and a cause of poor study-mental health balance. Loneliness amplifies stress, reduces emotional resilience, and makes every academic setback feel more catastrophic. Students who sacrifice social connection for study almost always find their study quality deteriorates alongside their mood.',
    habit: 'Schedule at least one social interaction per week that is completely study-free — no discussing exams, no comparing grades, no academic anxiety. A meal, a walk, a phone call. Protect it the same way you protect your study sessions.',
  },
  {
    id:     'physical',
    icon:   '🏃',
    label:  'Physical Wellbeing',
    desc:   'Whether your basic physical needs — sleep, movement, nutrition — are being consistently met',
    questions: [
      'I am getting at least 7 hours of sleep on most nights — not as an ideal, as an actual practice.',
      'I move my body in some way most days — a walk, exercise, or any activity that involves physical engagement.',
      'I eat regularly and in a way that feels nourishing rather than neglected — I am not skipping meals to study.',
    ],
    low_insight: 'Physical neglect is the most direct route to both academic underperformance and mental health deterioration. Sleep, movement, and nutrition are not lifestyle extras — they are the physiological foundation on which every other capability rests. Students who compromise these first to gain study time typically find their study efficiency drops faster than the hours increase.',
    habit: 'The "non-negotiable three" — commit to three physical minimums for this week: a specific sleep time, one walk or movement session, and at least two proper meals per day. These become the floor of your routine that cannot be traded away for academic demand.',
  },
  {
    id:     'meaning',
    icon:   '✨',
    label:  'Sense of Meaning and Purpose',
    desc:   'Whether you have a clear and felt sense of why you are doing what you are doing',
    questions: [
      'I have a genuine understanding of why I am studying what I am studying — beyond "because I have to" or "for my parents."',
      'I can connect my current work to something I actually care about — a future, a goal, a version of myself.',
      'Even on hard days, there is some thread of meaning that keeps me going — I am not just enduring study without knowing why.',
    ],
    low_insight: 'Loss of meaning is one of the earliest and most insidious signs that the balance has tipped too far toward demand and too far away from purpose. When study feels purely like compliance — something done because it must be done rather than because it connects to something real — motivation deteriorates, stress increases, and the entire system becomes fragile.',
    habit: 'The "why underneath the why" exercise: write your answer to "why am I studying?" Then ask "why does that matter?" Then ask it again. Keep going until you reach something that feels genuinely true — not the performed answer, the honest one. Revisit it when motivation drops.',
  },
];

const STUDENT_TYPES = [
  {
    key:    'heavy_loader',
    icon:   '🗂️',
    label:  'The Heavy Loader',
    desc:   'Studies a lot but feels perpetually behind and never quite caught up',
  },
  {
    key:    'guilt_cycler',
    icon:   '🔄',
    label:  'The Guilt Cycler',
    desc:   'Cannot rest without feeling guilty but cannot study without dreading it either',
  },
  {
    key:    'avoider',
    icon:   '🙈',
    label:  'The Avoider',
    desc:   'Procrastinates significantly, then crams — cycles of avoidance and panic',
  },
  {
    key:    'social_sacrificer',
    icon:   '🚫',
    label:  'The Social Sacrificer',
    desc:   'Has cut most social and personal activities to study more — and feels increasingly lonely',
  },
  {
    key:    'perfectionist_staller',
    icon:   '⏸️',
    label:  'The Perfectionist Staller',
    desc:   'Spends enormous time on each task, never feels it is good enough, and falls further behind',
  },
];

const TYPE_INSIGHTS = {
  heavy_loader: {
    insight: 'The feeling of perpetual behind-ness in heavy loaders is almost never about insufficient study hours. It is about insufficient structure — specifically, the absence of a clear definition of "done" for each day and each topic. Without a definition of done, study expands to fill all available time without producing the felt sense of completion.',
    routine: [
      { slot: 'Morning (2 hrs)',   activity: 'Focused study — hardest topic, no distractions', note: 'Define the specific outcome before starting' },
      { slot: 'Break (30 min)',    activity: 'Physical movement — walk outside',               note: 'Non-negotiable, not replaceable with scrolling' },
      { slot: 'Mid-morning (90m)',  activity: 'Second subject or practice questions',           note: 'Timed and bounded — set an alarm' },
      { slot: 'Lunch + rest',      activity: 'Full break — 60 minutes minimum',                note: 'Away from the desk entirely' },
      { slot: 'Afternoon (90m)',    activity: 'Third topic or revision',                        note: 'Light review, not new heavy material' },
      { slot: 'Evening',           activity: 'Personal time — protected and guilt-free',        note: 'You have hit the daily limit. Stop.' },
      { slot: 'Before bed',        activity: 'Write tomorrow\'s two tasks. Close the day.',    note: 'Shutdown ritual — no study after this point' },
    ],
    key_rule: 'Define "done" before you start each session. When you reach it, you are done — regardless of how much time has passed. The definition of done is what creates the felt completion the heavy loader is missing.',
  },
  guilt_cycler: {
    insight: 'The guilt cycle — where study feels like a burden and rest feels like a failure — is not a motivation problem. It is a permission problem. The guilt cycler has never given themselves legitimate permission to rest, so every rest period is contaminated by the sense that they should be studying. And every study period is contaminated by the dread of being back at the desk.',
    routine: [
      { slot: 'Morning (90m)',      activity: 'Focused study — specific task defined',       note: 'Short enough to feel manageable, structured enough to feel productive' },
      { slot: 'Break (20 min)',     activity: 'Full break — you have earned this',           note: 'The break is part of the plan, not a deviation from it' },
      { slot: 'Mid-morning (90m)', activity: 'Second task — still morning energy',           note: 'Task defined before starting' },
      { slot: 'Lunch',             activity: 'Full lunch — proper meal, no studying',        note: 'Food is not a study break' },
      { slot: 'Afternoon (60m)',    activity: 'One more focused task',                       note: 'You are done with heavy study after this' },
      { slot: 'Late afternoon',    activity: 'FREE — guilt-free personal time',              note: 'This is scheduled. It is not lazy. It is the plan.' },
      { slot: 'Evening',           activity: 'Light review only (30 min maximum)',           note: 'Not a full session — just a glance at today\'s key points' },
    ],
    key_rule: 'The rest is on the schedule. When you are in the rest period, you are following the plan — not deviating from it. This is the cognitive reframe that breaks the guilt cycle.',
  },
  avoider: {
    insight: 'Procrastination in avoiders is almost never laziness — it is avoidance of anticipated discomfort. The task feels so aversive that starting it produces anxiety, which produces avoidance, which produces more anxiety as the deadline approaches. The solution is not more motivation — it is reducing the size of the first step until it no longer triggers avoidance.',
    routine: [
      { slot: 'Morning startup',   activity: 'Two-minute commitment — just open the book',   note: 'Do not commit to studying. Commit to opening the materials.' },
      { slot: 'First 25 minutes',  activity: 'Pomodoro — one task only',                     note: 'Timer visible. One specific task. When it rings, you\'ve succeeded.' },
      { slot: 'Break (5 min)',      activity: 'Stand up, move, breathe',                     note: 'Not optional — this completes the Pomodoro cycle' },
      { slot: 'Repeat (3-4 cycles)',activity: 'Continue Pomodoro structure',                  note: 'The structure defeats avoidance because the commitment is always small' },
      { slot: 'Long break',        activity: '30 minutes of genuine recovery',               note: 'Reward the work with proper rest' },
      { slot: 'Afternoon',         activity: 'Repeat morning structure if needed',           note: 'Do not attempt continuous study — the Pomodoro structure is your system' },
      { slot: 'Evening',           activity: 'Write tomorrow\'s first specific task',         note: 'The specificity reduces tomorrow morning\'s avoidance trigger' },
    ],
    key_rule: 'Never commit to "studying maths." Commit to "working through problems 4-7 in exercise 3B for 25 minutes." The specificity is what makes starting possible.',
  },
  social_sacrificer: {
    insight: 'The social sacrificer\'s logic seems sound — reduce social time to increase study time. But the reality is that social connection is a direct buffer against academic stress, and its absence makes everything else harder. The lonely student typically studies less effectively, recovers more poorly, and reaches burnout faster than the socially connected one — even if the isolated student has "more hours" technically available.',
    routine: [
      { slot: 'Morning (2 hrs)',    activity: 'Focused study — highest priority subject',    note: 'Best concentration is in the morning — use it for academics' },
      { slot: 'Mid-morning (90m)', activity: 'Second subject or practice',                   note: '' },
      { slot: 'Lunch',             activity: 'WITH someone — eat together, talk',            note: 'Social connection during lunch costs no study time' },
      { slot: 'Afternoon (90m)',    activity: 'Third subject or revision',                   note: '' },
      { slot: 'Break',             activity: 'Walk or call someone briefly',                 note: 'Connection in recovery time, not at the expense of study time' },
      { slot: 'Late afternoon',    activity: 'Social time — at least 3x per week',          note: 'Scheduled, protected, non-negotiable' },
      { slot: 'Evening',           activity: 'Light revision or rest — not heavy study',     note: 'The social time built today funds tomorrow\'s productivity' },
    ],
    key_rule: 'Social time is not stolen from study time. It is the investment that makes study time more efficient. Protect one social activity per day — even brief — as seriously as your most important study block.',
  },
  perfectionist_staller: {
    insight: 'The perfectionist staller spends three hours on an assignment that should take ninety minutes, because nothing feels quite good enough. The tragedy is that the additional time rarely improves quality significantly — it primarily serves to manage the anxiety of releasing imperfect work. The fix is not lowering standards. It is separating the quality of the work from the quality of the person — "this draft is good enough to submit" rather than "I am good enough if this draft is perfect."',
    routine: [
      { slot: 'Morning — setup',   activity: 'Define the 80% standard for today\'s main task', note: '"Good enough to submit" — not "perfect." Write it down.' },
      { slot: 'Study block (90m)',  activity: 'Work to the 80% standard — then stop',         note: 'Timer is non-negotiable. When it rings, evaluate for submission.' },
      { slot: 'Decision point',    activity: 'Is this good enough? Usually yes. Submit.',     note: 'The standard was set before you started — honour it.' },
      { slot: 'Break (20 min)',    activity: 'Full break — the task is done',                 note: '' },
      { slot: 'Second block (90m)', activity: 'Next specific task — same 80% standard',       note: '' },
      { slot: 'Afternoon',         activity: 'Review work — minor polish only, 20 mins max',  note: 'This is the perfecting window. Everything else is done.' },
      { slot: 'Evening',           activity: 'Personal time — tasks are complete',            note: 'The perfectionist needs to experience that submitting good-enough work is survivable.' },
    ],
    key_rule: 'Set the acceptable standard before you start — not after. Perfectionism escalates when evaluated after completion. A pre-set "good enough" benchmark gives you an exit that the post-completion perfectionistic spiral does not.',
  },
};

const RATING_OPTS2 = [
  { label: 'Rarely',        value: 1 },
  { label: 'Sometimes',     value: 2 },
  { label: 'Often',         value: 3 },
  { label: 'Almost Always', value: 4 },
];

function getDimScore(answers, dim) {
  const vals = dim.questions.map((_, qi) => answers[`${dim.id}_${qi}`] || 0);
  if (vals.some(v => v === 0)) return null;
  return vals.reduce((a, b) => a + b, 0);
}

function getDimTier(score, max) {
  const pct = score / max;
  if (pct >= 0.75) return { label: 'Well-balanced',    color: '#2D7D46', bg: '#E8F5EE', icon: '💚' };
  if (pct >= 0.5)  return { label: 'Needs attention',  color: '#C07800', bg: '#FFF8E1', icon: '🟡' };
  return               { label: 'Priority area',     color: '#C0392B', bg: '#FDECEA', icon: '🔴' };
}

// ── Balance Audit Component ────────────────────────────────────────────────────
function BalanceAudit() {
  const [step,        setStep]        = useState(1);
  const [studentType, setStudentType] = useState(null);
  const [answers,     setAnswers]     = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [openDim,     setOpenDim]     = useState(null);
  const [openRec,     setOpenRec]     = useState(null);
  const [showRoutine, setShowRoutine] = useState(false);

  const font      = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selType   = STUDENT_TYPES.find(t => t.key === studentType);
  const typeData  = studentType ? TYPE_INSIGHTS[studentType] : null;

  const totalQ    = BALANCE_DIMS.length * 3;
  const answered  = BALANCE_DIMS.reduce((t, d) =>
    t + d.questions.filter((_, qi) => answers[`${d.id}_${qi}`]).length, 0);
  const allDone   = answered === totalQ && !!studentType;
  const progress  = Math.round((answered / totalQ) * 100);

  const scores    = BALANCE_DIMS.map(d => ({ dim: d, score: getDimScore(answers, d) }));
  const totalScore  = scores.reduce((t, s) => t + (s.score || 0), 0);
  const maxPossible = totalQ * 4;
  const overallPct  = submitted ? Math.round((totalScore / maxPossible) * 100) : 0;

  const sortedAsc = [...scores.filter(s => s.score !== null)].sort((a, b) => a.score - b.score);

  const handleReset = () => { setStep(1); setStudentType(null); setAnswers({}); setSubmitted(false); setOpenDim(null); setOpenRec(null); setShowRoutine(false); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SAGE2 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — student type */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Which student type feels most like you right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the pattern that feels most honest — not the one you think sounds best.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {STUDENT_TYPES.map(t => {
              const isSel = studentType === t.key;
              return (
                <button key={t.key} onClick={() => setStudentType(t.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SAGE2 : 'var(--border)', background: isSel ? SPALE2 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${SBORD2}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? SAGE2 : 'var(--ink)', marginBottom: '2px' }}>{t.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (studentType) setStep(2); }} disabled={!studentType} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: studentType ? `linear-gradient(135deg, ${SAGE2}, #5A9B7A)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: studentType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: studentType ? `0 6px 18px ${SBORD2}` : 'none',
          }}>Next — Rate Your Balance →</button>
        </>
      )}

      {/* STEP 2 — dimension ratings */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — Rate your balance across five dimensions
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Rate based on your actual past two weeks — not your intentions or your best days.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>{answered} of {totalQ} answered</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: SAGE2 }}>{progress}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(61,107,87,0.12)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${SAGE2}, #5A9B7A)`, borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {BALANCE_DIMS.map(dim => {
            const dimDone = dim.questions.every((_, qi) => answers[`${dim.id}_${qi}`]);
            const isOpen  = openDim === dim.id;
            return (
              <div key={dim.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '10px', border: '2px solid', borderColor: dimDone ? SAGE2 : 'var(--border)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setOpenDim(isOpen ? null : dim.id)} style={{ width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{dim.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{dim.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{dim.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {dimDone && <span style={{ background: SAGE2, color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</span>}
                    <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)' }}>
                    {dim.questions.map((q, qi) => {
                      const key = `${dim.id}_${qi}`;
                      return (
                        <div key={qi} style={{ paddingTop: '15px' }}>
                          <p style={{ margin: '0 0 9px 0', fontSize: '14px', fontWeight: '500', color: 'var(--ink)', lineHeight: 1.55 }}>{q}</p>
                          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                            {RATING_OPTS2.map(opt => {
                              const isSel = answers[key] === opt.value;
                              return (
                                <button key={opt.value} onClick={() => setAnswers(p => ({ ...p, [key]: opt.value }))} style={{
                                  padding: '7px 12px', borderRadius: '50px', fontSize: '13px', fontWeight: '600',
                                  border: '2px solid', fontFamily: font, cursor: 'pointer', transition: 'all 0.15s',
                                  borderColor: isSel ? SAGE2 : 'var(--border)',
                                  background: isSel ? SAGE2 : 'white',
                                  color: isSel ? 'white' : 'var(--ink-soft)',
                                }}>{opt.label}</button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (allDone) { setStep(3); setSubmitted(true); } }} disabled={!allDone} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: allDone ? `linear-gradient(135deg, ${SAGE2}, #5A9B7A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: allDone ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>
              {allDone ? 'See My Balance Report →' : `Open each dimension and answer all ${totalQ - answered} remaining statements`}
            </button>
          </div>
        </>
      )}

      {/* STEP 3 — Results */}
      {step === 3 && submitted && typeData && selType && (
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Overall */}
          <div style={{ background: `linear-gradient(135deg, ${SAGE2}, #5A9B7A)`, borderRadius: '14px', padding: '24px', marginBottom: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{selType.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
              {selType.label} — Balance Score: {overallPct}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
              {overallPct >= 70
                ? 'Your balance is broadly healthy — identify and protect the specific areas that are slightly off.'
                : overallPct >= 45
                ? 'Your balance needs deliberate attention across several dimensions. The routine below is a starting point.'
                : 'Your balance is significantly skewed — likely toward study at the expense of recovery and meaning. This needs structural change, not just intent.'}
            </div>
          </div>

          {/* Balance bars */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${SBORD2}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>Your Balance Across Five Dimensions</div>
            {scores.map(({ dim, score }) => {
              if (score === null) return null;
              const tier = getDimTier(score, dim.questions.length * 4);
              const pct  = Math.round((score / (dim.questions.length * 4)) * 100);
              return (
                <div key={dim.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {dim.icon} {dim.label}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: tier.color }}>{tier.icon} {tier.label}</span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--border)', borderRadius: '7px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: tier.color, borderRadius: '7px', transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student type insight */}
          <div style={{ background: SPALE2, border: `2px solid ${SBORD2}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE2, marginBottom: '7px' }}>
              💡 What Your Student Type Reveals
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{typeData.insight}</p>
          </div>

          {/* Priority areas — expandable */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE2, marginBottom: '10px' }}>
              🔍 Your Priority Balance Areas — With Habits
            </div>
            {sortedAsc.slice(0, 2).map(({ dim }) => {
              const score  = getDimScore(answers, dim);
              const tier   = getDimTier(score, dim.questions.length * 4);
              const isOpen = openRec === dim.id;
              return (
                <div key={dim.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', overflow: 'hidden', border: `1.5px solid ${SBORD2}`, borderLeft: `4px solid ${SAGE2}` }}>
                  <button onClick={() => setOpenRec(isOpen ? null : dim.id)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}>
                    <span style={{ fontSize: '20px' }}>{dim.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: SAGE2 }}>{dim.label}</div>
                      <div style={{ fontSize: '11px', color: tier.color, fontWeight: '700', marginTop: '1px' }}>{tier.icon} {tier.label}</div>
                    </div>
                    <span style={{ color: SAGE2, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                      <div style={{ background: SPALE2, borderRadius: '10px', padding: '12px 14px', marginTop: '14px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE2, marginBottom: '5px' }}>What This Means</div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--brown)', lineHeight: 1.7 }}>{dim.low_insight}</p>
                      </div>
                      <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: `1px solid ${SBORD2}` }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE2, marginBottom: '5px' }}>🌱 Your Habit</div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{dim.habit}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Personalised routine */}
          <div style={{ background: 'white', border: `1.5px solid ${SBORD2}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
            <button onClick={() => setShowRoutine(r => !r)} style={{ width: '100%', padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: SAGE2 }}>📅 Your Personalised Daily Routine — {selType.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>A sample day built for your student type — tap to reveal</div>
              </div>
              <span style={{ color: SAGE2, fontSize: '14px', flexShrink: 0, marginLeft: '10px' }}>{showRoutine ? '▲' : '▼'}</span>
            </button>
            {showRoutine && (
              <div style={{ borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                {typeData.routine.map((row, i) => (
                  <div key={i} style={{ padding: '11px 16px', borderBottom: i < typeData.routine.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '120px', flexShrink: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: SAGE2 }}>{row.slot}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', marginBottom: row.note ? '3px' : 0 }}>{row.activity}</div>
                      {row.note && <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, fontStyle: 'italic' }}>{row.note}</div>}
                    </div>
                  </div>
                ))}
                <div style={{ padding: '12px 16px', background: SPALE2, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: SAGE2, marginBottom: '4px' }}>🔑 Key Rule for This Type</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{typeData.key_rule}</p>
                </div>
              </div>
            )}
          </div>

          {/* Affirmation */}
          <div style={{ background: SPALE2, border: `1.5px dashed ${SBORD2}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: SAGE2, fontStyle: 'italic', lineHeight: 1.55 }}>
              {overallPct >= 70
                ? '"You are broadly in balance. Protect what is working as deliberately as you built it."'
                : '"Balance is not a state you arrive at. It is a system you build and maintain. Start with the smallest structural change that is honest rather than the largest aspiration that is not."'}
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${SBORD2}`, color: SAGE2,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retake the Audit</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BalanceStudiesMentalHealth({ navigate, relatedPosts }) {
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
      <p>Ask most students if they have <strong>study-life balance</strong> and they will immediately say no — because balance sounds like a state where academics and personal life receive equal, harmonious time in some perfectly arranged daily schedule. That version of balance exists almost nowhere in actual student life, and setting it as the standard produces a specific kind of despair when reality fails to match it.</p>

      <p>Real study-life balance is not about equal time. It is about sustainable rhythm — a pattern of academic demand and genuine recovery that you can maintain across a semester or a year without either burning out or falling behind. Most students who feel out of balance are not spending too many or too few hours studying. They are studying without genuine recovery, carrying academic anxiety into their rest time, or operating without the structural clarity that makes both study and rest feel legitimate rather than guilty.</p>

      <img
        src={meta.imgUrl}
        alt="Student building a healthy balance between studies and mental health — realistic routines and practical wellbeing strategies"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="real-problem">1. Why Study-Life Balance Is Harder Than It Looks</h3>
      <p>The difficulty of maintaining study-life balance in student life has several specific features that make generic "balance" advice almost useless without adaptation to the actual context.</p>
      <p><strong>The demand is genuinely high and culturally amplified.</strong> The academic pressure most Indian students navigate is not imaginary or exaggerated — it is real, it is sustained, and it is often accompanied by family and social expectations that add emotional weight to the already-substantial cognitive load. Telling a student preparing for JEE, board exams, or university finals to "just find balance" without acknowledging the genuine difficulty of the demand context is both unhelpful and slightly condescending.</p>
      <p><strong>The boundaries between study and not-studying are structurally blurred.</strong> Unlike an adult in a conventional job who leaves the office at the end of the day, students carry their academic content with them in every waking moment — in their bags, on their phones, in the ambient anxiety that the next exam is always somewhere on the horizon. The physical boundary between work and rest that most adults take for granted does not exist naturally for students. It has to be deliberately constructed and actively maintained.</p>
      <p><strong>Rest is not culturally validated.</strong> In contexts where academic performance carries existential social weight — where a grade is experienced as a verdict on worth, not just a measurement of knowledge — rest is easily framed as laziness, indulgence, or insufficient commitment. This cultural framing means that even when students take rest time, they often cannot actually rest in it. They are physically absent from the desk but mentally still at it, which produces the worst of both worlds: neither rest nor study actually happens.</p>
      <p><strong>The tools for managing balance are rarely taught.</strong> Time management advice is widely available. Structural tools for managing the cognitive and emotional aspects of study-life balance — how to actually disengage from academic anxiety during rest, how to define "done" in a way that makes rest feel legitimate, how to maintain genuine human connection during high-pressure periods — are far less commonly taught. This is the gap that most students who feel out of balance are actually experiencing.</p>

      {/* ── Section 2 ── */}
      <h3 id="struggles">2. Five Real Student Struggles — and What They Reveal</h3>

      <p><strong>Ananya, Class 12, Delhi:</strong> "I study from 7am to 11pm and still feel like it is never enough. I have no idea when I am allowed to stop. I do not remember the last time I genuinely relaxed." Ananya's struggle is a definition-of-done problem — she has no clear endpoint to her study days, so study expands to fill all available time. The anxiety of not knowing if she has done enough cannot be resolved by doing more, because "more" has no ceiling. The fix is structural: a defined daily endpoint, written down before the day starts, and honoured regardless of how much remains undone.</p>

      <p><strong>Rajan, 2nd Year Engineering, Bengaluru:</strong> "When I am studying I feel guilty about all the things I am not doing. When I am not studying I feel guilty about not studying. I cannot actually be present in either state." Rajan is in the classic guilt cycle — a pattern where neither study nor rest produces their natural outcomes because both are contaminated by the absence of the other. The fix is permission: rest scheduled and honoured in the plan is not lazy. It is following the plan. But this requires the plan to exist and to be genuinely trusted.</p>

      <p><strong>Priya, Class 11, Chennai:</strong> "I deleted Instagram and stopped going out with friends to study more. Now I study more but I feel more anxious, not less. I thought reducing distractions would help." Priya sacrificed social connection for study time and discovered that social connection was not a distraction from effective studying — it was a buffer against the anxiety that makes studying ineffective. The loneliness amplified her anxiety, which reduced her study quality, which made the additional hours nearly useless. The fix is reconnection, not more isolation.</p>

      <p><strong>Arjun, 3rd Year UG, Mumbai:</strong> "I cannot start anything until I feel ready. And I never feel ready. So I spend most of my study time planning to study. Then I cram at the last minute and do okay but feel terrible the whole time." Arjun's pattern is perfectionist avoidance — the bar for readiness is set so high that starting is always premature, which means starting only happens under the compulsion of deadline panic. The fix is the two-minute commitment: start with the smallest possible action (open the book, write one sentence) and build from there. Readiness is produced by starting, not the other way around.</p>

      <p><strong>Meera, Postgraduate, Pune:</strong> "I technically have free time in my schedule but I cannot actually use it. I sit there trying to relax and I just think about what I should be doing instead. The rest is not actually rest." Meera's struggle is cognitive disengagement — the specific skill of mentally stepping away from academic content during non-study time, which does not happen automatically and has to be practised and structured. The fix is a physical shutdown ritual that signals the end of study mode, and a specific alternative activity to go into rather than an empty "relax" that has no definition.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="audit">3. Interactive: The Balance Audit</h3>
      <p>The Balance Audit identifies your student type, rates you across five dimensions of study-life balance, and generates a personalised report with your balance profile, your two priority areas with specific habits, and a sample daily routine built for your specific student pattern. Work through it honestly — the report is only as useful as the accuracy of your ratings.</p>

      <BalanceAudit />

      {/* ── Section 4 ── */}
      <h3 id="routines">4. Realistic Routine Frameworks for Different Student Types</h3>
      <p>There is no single ideal student routine — because students differ in their academic contexts, their natural chronotype (whether they function best in the morning or evening), the social and family demands on their time, and the specific ways their imbalance presents. What follows are four realistic frameworks, not to be adopted wholesale but to be adapted based on what resonates.</p>

      <p><strong>The Intensive Boundary Model</strong> is for students under genuine high-pressure academic demand (board exams, entrance preparation, approaching semester finals). It involves a defined intensive study period (4-6 focused hours in a specific window), a hard stop time that is honoured daily regardless of what is incomplete, and completely protected non-study time in which no academic activity occurs. The psychological logic is simple: the hard stop makes the rest legitimate, which makes the rest actually restorative, which makes the next day's study more effective than continuous low-grade effort would be.</p>

      <p><strong>The Rhythm Model</strong> is for students in regular semester periods without imminent high-pressure examinations. It involves alternating study and recovery in predictable patterns throughout the day — study blocks of 45-90 minutes followed by genuine 15-30 minute breaks, a midday full stop for lunch and physical movement, and an evening period that begins with a defined transition out of academic mode. The rhythm model works because the brain's capacity for focused learning follows a natural ultradian rhythm (approximately 90 minutes of high performance followed by a natural dip) that structured breaks can synchronise with rather than fight against.</p>

      <p><strong>The Weekly Architecture Model</strong> is for students who struggle to maintain day-to-day balance but can manage week-scale structure. It involves designing the week on Sunday — assigning which subjects go on which days, protecting specific social commitments as non-negotiable, building in a genuine weekly rest day, and reviewing the week each Sunday before planning the next. The weekly scale is useful for students who find daily planning too granular and whose academic demands vary significantly across the week.</p>

      <p><strong>The Recovery-First Model</strong> is specifically for students in early burnout or returning from burnout. It inverts the normal logic — instead of studying first and recovering with whatever is left over, it schedules recovery first (sleep, movement, meals, one meaningful personal activity) and builds study around that baseline. Counter-intuitive during high-pressure periods, it is actually the most productive approach for students whose cognitive capacity has been depleted by overextension without recovery.</p>

      {/* ── Section 5 ── */}
      <h3 id="tips">5. Twelve Practical Tips for Sustainable Study-Life Balance</h3>
      <p><strong>1. Define "done" before you start each study day.</strong> Write the two or three specific things that will make today's study sufficient. When you reach them, you are done — regardless of how much time has passed or how much remains in the broader syllabus. The definition of done is what creates permission to rest.</p>
      <p><strong>2. Treat rest as scheduled, not earned.</strong> Rest that must be earned through completing everything will never arrive — there is always more to do. Build rest into the schedule the same way study is built in. When you are in the rest period, you are following the plan.</p>
      <p><strong>3. Build a physical study shutdown ritual.</strong> A consistent two-minute action at the end of each study day — closing the notebook, making tea, a brief walk — signals to your nervous system that study mode is over. Without this transition, study bleeds into all available time psychologically even when you are not actively studying.</p>
      <p><strong>4. Protect one social connection per day.</strong> A real conversation with a person who knows you — even briefly — has a measurable buffering effect on academic stress. This does not require large amounts of time; it requires genuine presence and genuine conversation.</p>
      <p><strong>5. Move your body every day.</strong> Physical movement is the most comprehensively evidence-supported intervention for both cognitive performance and mental health available without a prescription. Even twenty minutes of walking has measurable effects on cortisol, mood, and subsequent focus. This is not optional for students under sustained academic pressure.</p>
      <p><strong>6. Study in time-bounded sessions, not open-ended effort.</strong> A study session without a defined end time expands to fill all available space and produces chronic anxiety about whether it is ever done. Time-bounded sessions — even generous ones — produce the felt sense of completion that open-ended study never can.</p>
      <p><strong>7. Stop checking academic news during non-study time.</strong> Checking grades, exam results, rank lists, or peer academic performance during rest time keeps your nervous system in the academic threat state even when the books are closed. Batch all academic information-checking into defined windows.</p>
      <p><strong>8. Do not study in bed.</strong> The bedroom needs to remain associated with sleep in your brain's contextual learning — studying in bed degrades both the quality of the study and the quality of the sleep. This is one of the most concrete and most commonly violated sleep hygiene rules for students.</p>
      <p><strong>9. Address academic anxiety as a wellbeing issue, not a study issue.</strong> When anxiety is driving excessive study hours, adding more study time does not address the anxiety — it feeds it. Anxiety that manifests academically often requires non-academic intervention: breathing exercises, physical movement, social support, or professional help. More studying is rarely the answer to the feeling that you have not studied enough.</p>
      <p><strong>10. Take one genuinely study-free day per week.</strong> Not a half-day, not a lighter day — a day where no academic activity occurs. Research on performance and recovery consistently shows that weekly genuine rest produces better outcomes across the week than seven continuous days of lower-intensity effort. The day off is an investment in the week's productivity, not a deduction from it.</p>
      <p><strong>11. Weekly review of balance, not just of content.</strong> At the end of each week, spend five minutes reviewing not what you covered but how the week felt. Was the balance sustainable? What was sacrificed? What needs to change? The review is how balance becomes self-correcting rather than only self-eroding over time.</p>
      <p><strong>12. When the balance breaks, restart small.</strong> Every student's balance breaks sometimes — a deadline pile-up, a family crisis, an illness. The error is not in the breaking but in the response to it. When balance breaks, the worst response is either catastrophising (I am a failure) or overcompensating (I will study eighteen hours a day to catch up). The best response is the smallest genuine step back toward the sustainable rhythm: one normal study session, followed by one genuine break.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Study-Life Balance FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: My parents do not believe in study-life balance — they think study should come first, always. How do I manage this?</strong><br />
        A: The most effective approach with parents who hold this view is reframing balance as a performance strategy rather than a preference. The argument is not "I need balance for my happiness" (which may not resonate) but "I perform better, retain more, and am more consistent when I have defined rest time — here is what the research shows." Present the data: students who sleep adequately outperform sleep-deprived students. Students who exercise regularly retain more. Students who maintain social connection are more resilient under pressure. The frame is not wellbeing vs achievement — it is wellbeing as the mechanism of achievement.</p>

        <p><strong>Q: I have tried balancing before and it always collapses under pressure. What makes this time different?</strong><br />
        A: Balance attempts typically collapse because they are built on intention without structural support. Intending to take breaks is not the same as building breaks into a defined schedule and honouring them. The specific additions that make balance durable under pressure are: a written plan (not a mental one), a defined shutdown ritual that actually happens each day, and one protected non-negotiable recovery activity per day that is not traded away regardless of workload. Without these three structural elements, good intentions about balance reliably collapse under the first significant deadline.</p>

        <p><strong>Q: I feel like I am falling behind everyone else when I take time off. How do I manage the comparison?</strong><br />
        A: The comparison is happening between your complete, unfiltered experience (including your rest time, your doubts, and your difficult moments) and others' visible academic behaviour (the hours they appear to study, the results they post). You cannot see their rest time, their avoidance, their anxiety, or the quality of their study hours. The comparison is structurally unfair. More practically: your most immediate competitor is yesterday's version of you, not your peers. The question that matters is not "are they studying more?" but "am I moving forward at a sustainable rate?" Those are different questions and only one of them has information in it that you can actually act on.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SAGE2, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You cannot pour from an empty vessel — and no amount of academic ambition changes the basic fact that human beings require recovery to function."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Balance is not a luxury for students who have the privilege of lower academic demands. It is the infrastructure that makes sustained high academic demands possible without breaking the person carrying them. Build the infrastructure now. Maintain it consistently. Adjust it when it breaks. That is the whole practice.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SAGE2, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD2}` }}
          >
            Work Through This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SAGE2, border: `2px solid ${SAGE2}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More Student Wellbeing Guides:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/academic-burnout-signs',    '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/student-stress-management', '→ Student Stress Management: Practical Techniques That Actually Work'],
            ['/blog/study-plan-reduce-stress',  '→ How to Create a Study Plan That Reduces Stress'],
            ['/blog/exam-anxiety-help',         '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/self-kindness-check',       '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/safe',                           '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SAGE2, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
