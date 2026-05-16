import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Manage Multiple Subjects Without Feeling Overwhelmed",
  excerpt: "Managing multiple subjects is not a memory or intelligence problem — it is a systems problem. When you have the right scheduling structure, prioritisation method, and cognitive load management in place, five subjects feel manageable. Without them, two can feel like drowning. Learn the systems, see real student examples, and build your personalised Subject Load Plan.",
  category: "Mental Health",
  date: "17-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/manage-multiple-subjects.jpg",
  tldr: "Students who manage multiple subjects well are not more talented or more disciplined than those who feel overwhelmed — they have better systems. This guide covers the five most effective scheduling techniques for multi-subject study, a practical prioritisation framework, six relatable student examples, and an interactive Subject Load Organiser that builds a personalised weekly plan and rotation schedule for your specific subject combination.",
  toc: [
    { id: "why-overwhelm",  title: "1. Why Multiple Subjects Feel Overwhelming (And Why It Is a Systems Problem)", level: 3 },
    { id: "scheduling",     title: "2. Five Scheduling Techniques for Multi-Subject Management",                   level: 3 },
    { id: "organiser",      title: "3. Interactive: The Subject Load Organiser",                                   level: 3 },
    { id: "prioritisation", title: "4. How to Prioritise When Everything Feels Equally Urgent",                   level: 3 },
    { id: "examples",       title: "5. Six Student Examples — Real Multi-Subject Challenges",                      level: 3 },
    { id: "faq",            title: "6. Managing Multiple Subjects FAQs",                                           level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-17T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "manage multiple subjects, how to study multiple subjects, studying multiple subjects tips, multi subject scheduling, prioritise subjects, manage subjects without overwhelm, student subject management",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do students manage multiple subjects effectively?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Effective multi-subject management requires three things working together: a rotation system that ensures all subjects receive dedicated time without any being neglected for extended periods, a prioritisation method that allocates proportionally more time to subjects with higher exam weight or greater personal difficulty, and interleaving practice that deliberately mixes subjects rather than blocking them — which research shows produces better long-term retention than single-subject marathon sessions.",
      },
    },
    {
      "@type": "Question",
      "name": "How many subjects should a student study per day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research on cognitive load and learning efficiency suggests studying 2-3 subjects per day produces better outcomes than either studying one subject for the entire day (which produces diminishing returns from monotony and massed practice effects) or attempting all subjects each day (which reduces time-per-subject to the point where deep engagement is not possible). The optimal approach is a rotating schedule where each subject appears 3-4 times per week in dedicated blocks, with each block long enough for meaningful engagement.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best way to schedule multiple subjects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective multi-subject scheduling approach for most students combines a priority-weighted allocation (harder or higher-stakes subjects receive more total weekly hours) with subject-specific time-of-day placement (most cognitively demanding subject in the highest-alertness morning window), interleaved practice within sessions (mixing topics prevents the illusion of competence that blocked practice produces), and a weekly review every Sunday to adjust the plan based on actual progress.",
      },
    },
  ],
};

// ── Subject Load Organiser Data ────────────────────────────────────────────────
const TEAL5   = '#1D6B6B';
const TPALE5  = '#EBF5F5';
const TBORD5  = 'rgba(29,107,107,0.22)';

const SUBJECT_COUNTS = [
  { key: 's3', label: '3 subjects', value: 3 },
  { key: 's4', label: '4 subjects', value: 4 },
  { key: 's5', label: '5 subjects', value: 5 },
  { key: 's6', label: '6 subjects', value: 6 },
  { key: 's7', label: '7+ subjects', value: 7 },
];

const STUDY_HOURS = [
  { key: 'h3', label: '3–4 hours/day', value: 3.5 },
  { key: 'h5', label: '5–6 hours/day', value: 5.5 },
  { key: 'h7', label: '7–8 hours/day', value: 7.5 },
  { key: 'h9', label: '9+ hours/day',  value: 9   },
];

const BIGGEST_STRUGGLE = [
  { key: 'neglect',  icon: '😶', label: 'Some subjects always get neglected',       desc: 'I tend to focus on some and forget others entirely' },
  { key: 'shallow',  icon: '🪣', label: 'I cover everything but too shallowly',     desc: 'Each subject gets a little but nothing gets enough' },
  { key: 'switch',   icon: '🔄', label: 'Switching between subjects is draining',   desc: 'Context-switching feels exhausting and inefficient' },
  { key: 'priority', icon: '❓', label: 'Do not know what to prioritise when all seem urgent', desc: 'Everything feels equally important and I cannot rank them' },
  { key: 'momentum', icon: '🛑', label: 'Lose momentum mid-week and fall behind',   desc: 'The plan starts well but collapses after 2-3 days' },
];

const EXAM_PROXIMITY2 = [
  { key: 'months', label: '2+ months away' },
  { key: 'weeks',  label: '2-6 weeks away'  },
  { key: 'week',   label: '1 week away'     },
  { key: 'days',   label: '3 days or fewer' },
];

// Generate a weekly plan based on inputs
function generatePlan(subjectCount, hours, struggle, examProximity) {
  const daysPerWeek = 6; // 6 days + 1 rest
  const totalHours  = hours * daysPerWeek;
  const hoursPerSub = (totalHours / subjectCount).toFixed(1);

  const scheduleByProximity = {
    months: {
      structure: 'Foundation Phase',
      desc: 'Divide your week into learning days and review days. 4 days of new learning (2-3 subjects per day), 1 day of mixed practice, 1 day of revision, 1 day off.',
      daily: [
        { day: 'Monday',    slots: ['Subject A — New material (2h)', 'Subject B — New material (1.5h)', 'Practice: Subject A (30m)'] },
        { day: 'Tuesday',   slots: ['Subject C — New material (2h)', 'Subject D — New material (1.5h)', 'Review: Subject B (30m)'] },
        { day: 'Wednesday', slots: ['Subject E — New material (2h)', 'Subject A — Continue (1.5h)', 'Practice: Subject C (30m)'] },
        { day: 'Thursday',  slots: ['Subject B — Continue (2h)', 'Subject D — Continue (1.5h)', 'Review: Subject E (30m)'] },
        { day: 'Friday',    slots: ['Mixed practice — all subjects (2.5h)', 'Weak topic — targeted (1.5h)'] },
        { day: 'Saturday',  slots: ['Revision: rotate 2 subjects from this week (2h)', 'Plan next week (30m)'] },
        { day: 'Sunday',    slots: ['Complete rest', 'Weekly review (15m only)'] },
      ],
    },
    weeks: {
      structure: 'Consolidation Phase',
      desc: 'Reduce new learning, increase practice and past papers. Each subject gets at least 2 focused sessions per week with practice questions included in every session.',
      daily: [
        { day: 'Monday',    slots: ['Subject A — targeted revision + 3 past questions (2.5h)', 'Subject B — targeted revision (1.5h)'] },
        { day: 'Tuesday',   slots: ['Subject C — revision + practice (2h)', 'Subject D — practice questions only (2h)'] },
        { day: 'Wednesday', slots: ['Weakest subject — deep targeted work (2.5h)', 'Subject E — revision (1.5h)'] },
        { day: 'Thursday',  slots: ['Past paper: 2 subjects mixed (2h)', 'Error review — same day (1.5h)'] },
        { day: 'Friday',    slots: ['Full mock or timed practice — rotate subjects (3h)', 'Review errors (1h)'] },
        { day: 'Saturday',  slots: ['High-yield summary: all subjects (2h)', 'Rest afternoon'] },
        { day: 'Sunday',    slots: ['Complete rest', 'Tomorrow materials prepared'] },
      ],
    },
    week: {
      structure: 'Sprint Phase',
      desc: 'No new material. Targeted revision of high-frequency topics, daily past paper practice, and mandatory sleep protection. One subject morning, one afternoon, evening review.',
      daily: [
        { day: 'Day 1', slots: ['Subject A — high yield (2h)', 'Past questions: Subject A (1.5h)', 'Subject B — key points (1h)'] },
        { day: 'Day 2', slots: ['Subject C — high yield (2h)', 'Past questions: Subject C (1.5h)', 'Subject B — practice (1h)'] },
        { day: 'Day 3', slots: ['Weakest subject — targeted gaps (2h)', 'Mock: mixed subjects (2h)', 'Error review (30m)'] },
        { day: 'Day 4', slots: ['Subject D + E — key formulae/definitions (2h)', 'Practice: Subject D (1.5h)'] },
        { day: 'Day 5', slots: ['Summary review: all subjects (1.5h)', 'Rest + materials ready', 'Shutdown by 9pm'] },
        { day: 'Day 6 (Exam eve)', slots: ['Light revision only (45m)', 'No new material', 'Sleep 8 hours'] },
        { day: 'Exam Day', slots: ['Reference sheet review (20m)', 'Physical movement', 'Calm entry'] },
      ],
    },
    days: {
      structure: 'Triage Phase',
      desc: 'Accept the constraint immediately. Cover only the highest-frequency past-paper topics. One subject morning block, one afternoon, brief evening review. Everything else is cut.',
      daily: [
        { day: 'Today Morning',    slots: ['Identify top 3 topics per subject from past papers (30m)', 'Subject 1 — top topics only (2h)'] },
        { day: 'Today Afternoon',  slots: ['Subject 2 — top topics only (2h)', 'Practice questions both subjects (1h)'] },
        { day: 'Tomorrow Morning', slots: ['Subject 3 — top topics (2h)', 'Review Subject 1 errors (1h)'] },
        { day: 'Tomorrow Afternoon',slots: ['Subject 4+ — top topics only (2h)', 'Mixed practice (1h)'] },
        { day: 'Final Evening',    slots: ['Key formulae summary sheet (30m)', 'Materials ready', 'Sleep — 8 hours minimum'] },
      ],
    },
  };

  const struggleAdvice = {
    neglect:  {
      title: 'For Subject Neglect',
      advice: 'Name the neglected subjects explicitly. Assign them to fixed morning slots — your peak performance window — for the next two weeks. The subjects you avoid are almost always the ones you most need to confront. Morning placement ensures they cannot be pushed out by end-of-day fatigue.',
      hack: 'Traffic light your subjects weekly: Green (adequate time this week), Yellow (needs more), Red (neglected). Red subjects get the first study block each day until they turn Yellow.',
    },
    shallow: {
      title: 'For Surface-Level Coverage',
      advice: 'Reduce the number of subjects per day to two or three, and extend the depth per subject. Shallow coverage of many subjects in one day produces the illusion of progress without the encoding depth that produces actual retention. Rotate deeply rather than covering broadly.',
      hack: 'The "completion unit" rule: define a specific, completable unit for each subject before starting (e.g. "complete Chapter 6 active recall" not "study Chapter 6") and do not move to the next subject until that unit is genuinely done.',
    },
    switch: {
      title: 'For Context-Switching Fatigue',
      advice: 'Group related subjects together in your daily schedule. Pair linguistically similar subjects (two humanities), or two sciences, rather than switching between maximally different domains. Keep switching to a maximum of twice per day — one morning block, one afternoon block, each subject for 90+ minutes.',
      hack: 'A 5-minute "context reset" between subjects: close all materials from the previous subject, take three breaths, write one sentence about what you just covered. This deliberate transition reduces the cognitive cost of switching.',
    },
    priority: {
      title: 'For Prioritisation Paralysis',
      advice: 'Apply the Priority Score formula: Exam Weight × (4 minus your confidence score). Rate each subject 1-3 on confidence. Multiply by its exam contribution percentage. The subject with the highest score gets the most hours. This removes the emotional component of prioritisation.',
      hack: 'Create your priority ranking now, before the overwhelm hits. A pre-made priority list is available when emotion would otherwise prevent clear thinking. Review and adjust it every Sunday.',
    },
    momentum: {
      title: 'For Mid-Week Collapse',
      advice: 'Build your plan around your lowest-energy day, not your highest. If Wednesday is reliably your worst day, plan lighter content or a review session for Wednesday — not your most demanding material. Most plans collapse because they were designed for the best version of the week.',
      hack: 'The Wednesday checkpoint: every Wednesday evening, spend 10 minutes reviewing whether you are on track. If you have fallen behind, adjust the remaining plan rather than abandoning it. A mid-week recalibration prevents the full collapse that an unaddressed drift produces.',
    },
  };

  return { scheduleByProximity: scheduleByProximity[examProximity], hoursPerSub, struggleAdvice: struggleAdvice[struggle] };
}

// ── Subject Load Organiser Component ──────────────────────────────────────────
function SubjectLoadOrganiser() {
  const [step,      setStep]      = useState(1);
  const [subCount,  setSubCount]  = useState(null);
  const [hours,     setHours]     = useState(null);
  const [struggle,  setStruggle]  = useState(null);
  const [examProx,  setExamProx]  = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openDay,   setOpenDay]   = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selSub  = SUBJECT_COUNTS.find(s => s.key === subCount);
  const selHrs  = STUDY_HOURS.find(h => h.key === hours);
  const selStr  = BIGGEST_STRUGGLE.find(s => s.key === struggle);
  const selProx = EXAM_PROXIMITY2.find(p => p.key === examProx);

  const plan = subCount && hours && struggle && examProx
    ? generatePlan(selSub.value, selHrs.value, struggle, examProx)
    : null;

  const handleReset = () => { setStep(1); setSubCount(null); setHours(null); setStruggle(null); setExamProx(null); setRevealed(false); setOpenDay(null); };

  const BtnGrid = ({ options, selected, onSelect, labelKey = 'label', descKey = null }) => (
    <div style={{ display: 'grid', gridTemplateColumns: options.length <= 3 ? '1fr 1fr' : '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
      {options.map(opt => {
        const isSel = selected === opt.key;
        return (
          <button key={opt.key} onClick={() => onSelect(opt.key)} style={{
            padding: '13px 14px', borderRadius: '11px', border: '2px solid',
            borderColor: isSel ? TEAL5 : 'var(--border)', background: isSel ? TPALE5 : 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
            boxShadow: isSel ? `0 0 0 2px ${TBORD5}` : 'none',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? TEAL5 : 'var(--ink)' }}>{opt.icon ? `${opt.icon} ` : ''}{opt[labelKey]}</div>
            {descKey && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.3 }}>{opt[descKey]}</div>}
          </button>
        );
      })}
    </div>
  );

  const NextBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} disabled={!active} style={{
      width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
      background: active ? `linear-gradient(135deg, ${TEAL5}, #2A9B9B)` : 'var(--border)',
      color: 'white', fontWeight: '700', fontSize: '15px',
      cursor: active ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
      boxShadow: active ? `0 6px 18px ${TBORD5}` : 'none',
    }}>{label}</button>
  );

  const BackBtn = ({ onClick }) => (
    <button onClick={onClick} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? TEAL5 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — subject count */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — How many subjects are you managing right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Include all active subjects — exams, internals, assignments, anything competing for your study time.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {SUBJECT_COUNTS.map(sc => {
              const isSel = subCount === sc.key;
              return (
                <button key={sc.key} onClick={() => setSubCount(sc.key)} style={{
                  padding: '14px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSel ? TEAL5 : 'var(--border)', background: isSel ? TPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
                  boxShadow: isSel ? `0 0 0 2px ${TBORD5}` : 'none',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: isSel ? TEAL5 : 'var(--ink)' }}>{sc.label}</div>
                </button>
              );
            })}
          </div>
          <NextBtn active={!!subCount} onClick={() => { if (subCount) setStep(2); }} label="Next →" />
        </>
      )}

      {/* STEP 2 — daily hours */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How many hours can you realistically dedicate to studying per day?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Be realistic, not aspirational — a plan built on actual hours works; one built on hoped-for hours fails on Day 2.</p>
          <BtnGrid options={STUDY_HOURS} selected={hours} onSelect={setHours} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <BackBtn onClick={() => setStep(1)} />
            <button onClick={() => { if (hours) setStep(3); }} disabled={!hours} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: hours ? `linear-gradient(135deg, ${TEAL5}, #2A9B9B)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: hours ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s' }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — biggest struggle */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What is your biggest struggle with multiple subjects?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Choose the most honest answer — your plan will address this specifically.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {BIGGEST_STRUGGLE.map(bs => {
              const isSel = struggle === bs.key;
              return (
                <button key={bs.key} onClick={() => setStruggle(bs.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? TEAL5 : 'var(--border)', background: isSel ? TPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${TBORD5}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{bs.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? TEAL5 : 'var(--ink)', marginBottom: '2px' }}>{bs.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{bs.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <BackBtn onClick={() => setStep(2)} />
            <button onClick={() => { if (struggle) setStep(4); }} disabled={!struggle} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: struggle ? `linear-gradient(135deg, ${TEAL5}, #2A9B9B)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: struggle ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s' }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 4 — exam proximity */}
      {step === 4 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — How far away are your exams?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>The exam proximity determines the phase of your plan — what kind of study is most valuable right now.</p>
          <BtnGrid options={EXAM_PROXIMITY2} selected={examProx} onSelect={setExamProx} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <BackBtn onClick={() => setStep(3)} />
            <button onClick={() => { if (examProx) { setStep(5); setRevealed(false); } }} disabled={!examProx} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: examProx ? `linear-gradient(135deg, ${TEAL5}, #2A9B9B)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: examProx ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s' }}>Build My Subject Plan →</button>
          </div>
        </>
      )}

      {/* STEP 5 — Results */}
      {step === 5 && plan && selSub && selHrs && selStr && selProx && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 5 — Your Subject Load Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${TEAL5}, #2A9B9B)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${TBORD5}`,
              }}>📅 Generate My Subject Plan</button>
              <button onClick={() => setStep(4)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${TEAL5}, #2A9B9B)`, borderRadius: '14px', padding: '22px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📚</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {plan.scheduleByProximity.structure}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                  {selSub.label} · {selHrs.label} · {selProx.label}
                </div>
              </div>

              {/* Time per subject */}
              <div style={{ background: 'white', border: `1.5px solid ${TBORD5}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL5}, #2A9B9B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '22px' }}>⏱️</span>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '3px' }}>Estimated Time Per Subject Per Week</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: TEAL5, fontFamily: 'Fraunces, serif' }}>{plan.hoursPerSub} hours</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>Based on {selHrs.label} × 6 days ÷ {selSub.value} subjects</div>
                </div>
              </div>

              {/* Phase description */}
              <div style={{ background: TPALE5, border: `1.5px solid ${TBORD5}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: TEAL5, marginBottom: '5px' }}>
                  📋 Phase Approach
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{plan.scheduleByProximity.desc}</p>
              </div>

              {/* Weekly timetable — expandable days */}
              <div style={{ background: 'white', border: `1.5px solid ${TBORD5}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: `${TEAL5}10` }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: TEAL5 }}>📅 Sample Weekly Schedule</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Tap any day to see the sessions — use A/B/C as placeholders for your actual subjects.</div>
                </div>
                {plan.scheduleByProximity.daily.map((day, i) => {
                  const isOpen = openDay === i;
                  return (
                    <div key={i} style={{ borderBottom: i < plan.scheduleByProximity.daily.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <button onClick={() => setOpenDay(isOpen ? null : i)} style={{
                        width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        fontFamily: font, textAlign: 'left',
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: TEAL5 }}>{day.day}</span>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{isOpen ? '▲' : `${day.slots.length} session${day.slots.length !== 1 ? 's' : ''} ▼`}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 12px 16px', animation: 'floatUp 0.2s ease' }}>
                          {day.slots.map((slot, j) => (
                            <div key={j} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: j < day.slots.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TEAL5, flexShrink: 0, marginTop: '5px' }} />
                              <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{slot}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Struggle-specific advice */}
              <div style={{ background: TPALE5, border: `2px solid ${TBORD5}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px', borderLeft: `4px solid ${TEAL5}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: TEAL5, marginBottom: '5px' }}>
                  🎯 {plan.struggleAdvice.title}
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{plan.struggleAdvice.advice}</p>
                <div style={{ background: 'white', borderRadius: '9px', padding: '10px 13px', border: `1px solid ${TBORD5}` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: TEAL5, marginBottom: '4px' }}>💡 Pro Hack</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{plan.struggleAdvice.hack}</p>
                </div>
              </div>

              {/* Affirmation */}
              <div style={{ background: 'white', border: `1.5px dashed ${TBORD5}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: TEAL5, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "A system that distributes {selSub.value} subjects clearly is worth more than the best memory in a chaotic schedule."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${TBORD5}`, color: TEAL5, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ManageMultipleSubjects({ navigate, relatedPosts }) {
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
      <p>There is a specific kind of overwhelm that comes not from too much of one thing but from too many things — five subjects, each with their own syllabus, each with deadlines and exams and gaps, each demanding attention that you have only so much of. Trying to <strong>manage multiple subjects</strong> without a structure for doing so is like trying to carry six glasses of water with two hands. It is not a grip-strength problem. It is a systems problem.</p>

      <p>The students who manage multi-subject loads without collapsing are not more disciplined or more talented. They have built a system that decides, in advance, which subject gets what time when — removing the daily decision fatigue of figuring out where to start, and the daily guilt of the subjects that did not get covered. This guide builds that system.</p>

      <img
        src={meta.imgUrl}
        alt="Student managing multiple subjects effectively with scheduling techniques, prioritisation, and an organised study plan"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-overwhelm">1. Why Multiple Subjects Feel Overwhelming (And Why It Is a Systems Problem)</h3>
      <p>The overwhelm of managing multiple subjects has a specific cognitive mechanism: working memory overload. Working memory — the system responsible for holding and manipulating information during active thinking — has a limited capacity. When you sit down to "study for today" with five subjects competing for attention and no pre-made decision about which one, the working memory is immediately burdened not with the content of any subject but with the meta-task of deciding, justifying, and second-guessing the choice of subject. This meta-cognitive load is exhausting before any learning has begun.</p>
      <p>Research by educational psychologist John Sweller on cognitive load theory shows that reducing extraneous cognitive load — effort spent on things unrelated to the learning itself — directly increases the quality and efficiency of learning. A pre-built schedule that decides "Monday morning is Chemistry, Monday afternoon is History" eliminates the daily decision entirely. The student sits down and starts working, because the decision has already been made. This single structural change — removing the daily subject-selection decision — produces measurable improvements in both study quality and the felt experience of managing the load.</p>
      <p>The second mechanism is the visibility problem. Five subjects with no visual management system exist in a mental pile where the whole pile feels like an indivisible weight. The instant you write out the five subjects with their exam dates, their weekly hour allocations, and their specific current gaps, the pile disaggregates into five separate, specific, manageable units. The weight does not change. The experience of it changes completely — because now you are dealing with an organised set of known problems rather than an undifferentiated mass of unchecked anxiety.</p>
      <p>The third mechanism is the neglect spiral. Without a rotation system, students naturally gravitate toward the subjects they are most comfortable with or most interested in. The harder or less interesting subjects get deferred — one day, then two, then a week — until the gap between those subjects and the comfortable ones is so large that catching up feels impossible, which produces more avoidance, which produces a larger gap. The rotation system prevents this by making neglect structurally impossible: every subject appears in the schedule on specific days, and a red flag is raised if any subject has not appeared in the schedule within a defined window.</p>

      {/* ── Section 2 ── */}
      <h3 id="scheduling">2. Five Scheduling Techniques for Multi-Subject Management</h3>

      <p><strong>Technique 1: The Subject Rotation System.</strong> Assign each subject to specific days of the week rather than deciding daily what to study. For five subjects over six study days, each subject appears at least once per week with higher-priority subjects appearing twice. Example rotation for five subjects over six days:</p>
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `linear-gradient(135deg, ${TEAL5}, #2A9B9B)`, color: 'white' }}>
              {['Day', 'Morning', 'Afternoon', 'Evening'].map(h => (
                <th key={h} style={{ padding: '9px 10px', textAlign: 'center', fontWeight: '700', fontSize: '12px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Mon', 'Sub A (hardest)', 'Sub B', 'Sub A — quick review'],
              ['Tue', 'Sub C',           'Sub D', 'Sub B — practice Qs'],
              ['Wed', 'Sub E',           'Sub A', 'Sub C — review'],
              ['Thu', 'Sub B (repeat)', 'Sub E', 'Sub D — practice'],
              ['Fri', 'Sub D (repeat)', 'Sub C', 'Mock/Past paper'],
              ['Sat', 'Weak topic deep', 'Revision — all', 'Plan next week'],
              ['Sun', 'REST',            'REST',  'REST'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : TPALE5 }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid var(--border)', fontWeight: j === 0 ? '700' : '500', fontSize: '12px', color: cell === 'REST' ? '#2D7D46' : 'var(--ink)' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>The hardest or highest-priority subject (Sub A) appears three times per week — in the peak morning window twice and in a secondary slot once. Each other subject appears at least twice. No subject goes unvisited for more than three days.</p>

      <p><strong>Technique 2: The Two-Subject Day Rule.</strong> Instead of attempting all subjects every day (producing shallow coverage), study a maximum of two primary subjects per day and rotate which two appear. This produces deeper engagement per session, less context-switching fatigue, and a natural rotation that ensures all subjects appear across the week. The day feels manageable because you have only two targets. The week covers everything because the rotation is built into the structure.</p>

      <p><strong>Technique 3: Interleaved Practice.</strong> Research by Robert Bjork at UCLA on interleaved vs blocked practice shows that mixing subjects within a study session — studying some Physics, then some Chemistry, then returning to Physics — produces significantly better long-term retention than studying each subject in its own long uninterrupted block (blocked practice). This is counterintuitive because interleaved practice feels harder and less productive — but the difficulty is precisely the mechanism: having to retrieve from a partially processed state produces stronger memory traces. For multi-subject management, this means that dedicated subject blocks should still include practice questions from other subjects, and that brief daily reviews of multiple subjects are more retentive than equivalent long sessions in single subjects.</p>

      <p><strong>Technique 4: The Priority-Weighted Hour Allocation.</strong> Calculate your priority score for each subject: multiply the exam weight percentage by your weakness score (5 = very weak, 1 = very strong). The resulting number is your allocation index. Divide total weekly study hours proportionally by these indices. A subject that is worth 30% of your grade and rates 5 on weakness gets significantly more hours than a subject worth 15% that rates 1 on weakness. This allocation, done once on Sunday, removes daily negotiation about where time goes and ensures the highest-need areas receive the most resource automatically.</p>

      <p><strong>Technique 5: The Sunday Weekly Calibration.</strong> Every Sunday evening, spend fifteen minutes on three questions: Which subjects got enough time this week? Which were neglected and need more next week? Did my actual plan match my written plan, and if not, why? The Sunday calibration is what prevents a plan from becoming increasingly misaligned with reality. Without it, the original plan becomes a source of guilt as it diverges from actual behaviour. With it, the plan remains a living, useful document that self-corrects rather than accumulates failure.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="organiser">3. Interactive: The Subject Load Organiser</h3>
      <p>The Organiser builds a personalised subject management plan in four steps: your subject count, your daily hours, your biggest multi-subject struggle, and your exam proximity. The result is a weekly schedule template, a calculated hours-per-subject allocation, targeted advice for your specific struggle, and a pro hack for implementation. Tap each day in the schedule to see its study sessions.</p>

      <SubjectLoadOrganiser />

      {/* ── Section 4 ── */}
      <h3 id="prioritisation">4. How to Prioritise When Everything Feels Equally Urgent</h3>
      <p>The sensation that all subjects are equally urgent at the same time is almost always a sign that no explicit prioritisation has been done — which means the urgency is being experienced as an undifferentiated mass rather than as a set of specifically different demands. The three prioritisation frameworks below each address a different scenario.</p>

      <p><strong>Framework 1: The Priority Score Formula (for multiple exams of different weights).</strong></p>
      <p>Priority Score = Exam Weight % × Weakness Score (1-5, 5 being most weak)</p>
      <p>Example for five subjects:</p>
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <thead>
            <tr style={{ background: `${TEAL5}20`, color: TEAL5 }}>
              {['Subject', 'Exam Weight', 'Weakness (1-5)', 'Priority Score', 'Weekly Hours (of 30)'].map(h => (
                <th key={h} style={{ padding: '9px 10px', textAlign: 'center', fontWeight: '700', fontSize: '12px', borderBottom: `2px solid ${TEAL5}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Physics',  '25%', '5', '125', '8.0'],
              ['Chemistry','20%', '3', '60',  '3.8'],
              ['Maths',    '25%', '2', '50',  '3.2'],
              ['Biology',  '15%', '4', '60',  '3.8'],
              ['English',  '15%', '1', '15',  '1.0'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : TPALE5 }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid var(--border)', fontWeight: j === 0 ? '700' : '500', fontSize: '12px', color: j === 3 ? TEAL5 : 'var(--ink)' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>In this example, Physics receives significantly more time despite having the same exam weight as Maths — because the student rates themselves as much weaker in Physics. English, despite the same exam weight as Biology, receives minimal time because the student is already confident. The formula replaces subjective urgency with objective, calculated allocation.</p>

      <p><strong>Framework 2: The Deadline Stack (for multiple assignment deadlines competing with exam preparation).</strong> When assignments and exams are both demanding time, use a simple rule: anything due within three days is non-negotiable urgent and gets done before any exam preparation. Anything due within seven days is scheduled in specific time slots that do not displace exam sessions. Anything beyond seven days is deferred to the weekly plan and does not occupy daily working memory. The discipline is resisting the pull of distant deadlines during high-pressure exam windows — doing small amounts on future assignments daily during a fifteen-minute admin session prevents the last-minute crunch that is the primary source of assignment-exam conflict.</p>

      <p><strong>Framework 3: The Energy-Subject Match (for managing motivation alongside priority).</strong> Different types of academic work require different types of cognitive energy. Mathematical problem-solving, technical analysis, and new concept learning require high-focus, high-energy states. Reading and note-reviewing, essay outlining, and flashcard review are manageable in medium-energy states. Administrative tasks, reorganising notes, and light revision work in low-energy states. Map your typical daily energy curve and assign subject types accordingly — put your high-focus subjects in your peak energy window, medium-effort tasks in the mid-energy afternoon, and light review in the low-energy evening. This energy-subject matching produces more total output than any scheduling technique that ignores energy entirely.</p>

      {/* ── Section 5 ── */}
      <h3 id="examples">5. Six Student Examples — Real Multi-Subject Challenges</h3>

      <p><strong>Vikram, Class 12, Science Stream (PCM + English + Physical Education).</strong> Vikram had two hours of free time per weekday and seven subjects. His approach: study Physics and Maths every morning (hardest subjects, peak energy), Chemistry twice weekly in the afternoon, English once weekly (highest confidence, lowest need), and Physical Education revision in fifteen-minute daily slots during breaks. He built a Sunday review into his calendar and flagged any subject that had not appeared in the previous week in red. No subject went unvisited for more than four days across the semester.</p>

      <p><strong>Ananya, BA Honours, Delhi University (four papers + dissertation).</strong> Ananya's challenge was that her four papers had overlapping reading requirements and her dissertation pulled time unpredictably. Her solution: colour-coded weekly blocks, with dissertation work given its own fixed two-hour window three days per week that was treated as non-negotiable regardless of paper pressure. The papers rotated on the other days. The dissertation window did not grow during paper crunch — the constraint protected both simultaneously.</p>

      <p><strong>Rajan, Second Year Engineering (six subjects, lab sessions, projects).</strong> Rajan's problem was that lab sessions and project work were eating his entire weekend, leaving weekday evenings for six subjects. He recategorised his subjects into three tiers: exam-heavy (three subjects that needed deep attention), assignment-heavy (two that needed regular work but less depth), and light-touch (one that was largely conceptual and needed only exam week attention). The tiering allowed him to build a realistic rotation rather than pretending all six needed equal daily attention.</p>

      <p><strong>Meera, Class 11, Commerce Stream (Accountancy, Economics, Business Studies, Maths, English).</strong> Meera's specific problem was Accountancy — she kept postponing it because it was the hardest, which meant arriving at exam week significantly underprepared in her highest-weight subject. The fix was a rule: Accountancy is the first subject every Monday, Wednesday, and Friday — non-negotiable. No negotiation about whether she "felt like it." The pre-commitment removed the daily decision that her avoidance had been winning.</p>

      <p><strong>Ishaan, Final Year BBA (internship + five exams simultaneously).</strong> Ishaan had the specific challenge of a part-time internship consuming three weekday afternoons. His study time was effectively three mornings and two full evenings per week. He mapped exactly what was available, allocated it by priority score, and accepted explicitly that some subjects would receive less time than ideal. The acceptance of the constraint — rather than the pretence that he had equal time for everything — produced a realistic plan that he actually followed rather than an ideal plan he consistently failed to execute.</p>

      <p><strong>Priya, Postgraduate, attempting six modules in two semesters.</strong> Priya's learning was that her overwhelm was not about the number of subjects — it was about the absence of a weekly endpoint. She studied every day without a clear definition of "enough," which meant the feeling of insufficiency was constant regardless of how much she covered. Her intervention: define the week's completion criteria every Sunday before starting. "This week is successful if I complete [specific list of tasks across six subjects]." With a defined endpoint, rest felt legitimate rather than guilty. Her anxiety dropped significantly before her actual study load changed.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Managing Multiple Subjects FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I keep falling behind no matter how much I plan. What am I doing wrong?</strong><br />
        A: The most common cause of persistent falling-behind despite planning is planning for the ideal week rather than the realistic one. Most students build plans that require 100% of available time and leave no buffer for tasks that run over, unexpected demands, low-energy days, or any disruption. The specific fix: reduce your planned daily study time by 20-25% and use the buffer for spillover. A plan that you consistently execute at 80% of capacity produces more output than a plan that you consistently fail at 40% capacity. Build in the buffer deliberately rather than discovering it accidentally through plan collapse.</p>

        <p><strong>Q: Is it better to study one subject deeply per day or spread across multiple?</strong><br />
        A: Both approaches have genuine merits and appropriate contexts. Single-subject days produce deeper engagement per session and are best for genuinely difficult new material that requires extended uninterrupted focus. Multi-subject days produce better long-term retention through interleaving and are better for mixed review sessions. The practical recommendation: use single-subject blocks of 90-120 minutes (not full days), with deliberate switching between two or three subjects per day. Full-day single-subject sessions are appropriate for the final sprint phase before a specific exam, where one paper is imminent and the others are temporarily deprioritised.</p>

        <p><strong>Q: What do I do when a teacher keeps adding new content and I cannot keep up?</strong><br />
        A: First, triage immediately — identify what is genuinely essential for the exam versus what is supplementary. Most curriculum overload is not actually all equally exam-relevant. Second, speak to the teacher or check past papers to understand what percentage of exam questions come from each area — allocate your time proportionally rather than trying to cover the full content equally. Third, accept explicitly that deep coverage of core material is more valuable than shallow coverage of everything. The myth of needing to cover everything is one of the primary drivers of multi-subject overwhelm; accurate prioritisation typically reveals that 60-70% of exam marks come from 30-40% of content.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: TEAL5, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "The system does not study for you. It decides what gets studied when — and that decision, made once, is worth far more than making it anxiously every morning."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          The moment you put your subjects into a rotation, give each a calculated weekly allocation, and commit to a Sunday calibration, the overwhelm changes its quality. It does not disappear — the syllabus is still large and the time is still finite. But it becomes a known, organised problem with a specific structure for addressing it. And that is entirely different from an unmanageable weight.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: TEAL5, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${TBORD5}` }}
          >
            Process Study Stress in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: TEAL5, border: `2px solid ${TEAL5}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Subject Strategy
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More Study and Academic Wellbeing Guides:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/time-management-exams',            '→ Time Management Tips for Students During Exams'],
            ['/blog/study-plan-reduce-stress',         '→ How to Create a Study Plan That Reduces Stress'],
            ['/blog/study-focus-without-distractions', '→ How to Stay Focused While Studying Without Distractions'],
            ['/blog/academic-burnout-signs',           '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/student-stress-management',        '→ Student Stress Management: Practical Techniques That Actually Work'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: TEAL5, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
