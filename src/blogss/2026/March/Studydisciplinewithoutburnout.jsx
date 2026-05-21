import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build Study Discipline Without Burnout",
  excerpt: "Study discipline is not about grinding through exhaustion or forcing yourself to work when everything in you is saying stop. It is about building habits so consistent and systems so well-designed that the right action becomes easier than the wrong one — and protecting recovery so deliberately that the discipline is sustainable for months, not days.",
  category: "Mental Health",
  date: "29-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/study-discipline-without-burnout.jpg",
  tldr: "Study discipline without burnout requires three things working together: habits built gradually enough to become automatic, routines realistic enough to be followed on your worst day (not just your best), and recovery protected deliberately enough that the system remains sustainable across an entire academic year. This guide covers the neuroscience of habit formation, six discipline strategies that do not produce burnout, a realistic routine framework, and an interactive Discipline Builder that assesses your current balance and generates a personalised sustainability plan.",
  toc: [
    { id: "discipline-vs",  title: "1. The Difference Between Discipline and Willpower",                level: 3 },
    { id: "habits",         title: "2. Six Habit-Building Strategies That Create Lasting Study Discipline", level: 3 },
    { id: "builder",        title: "3. Interactive: The Discipline Builder",                            level: 3 },
    { id: "routines",       title: "4. Realistic Study Routines That Actually Hold",                    level: 3 },
    { id: "balance",        title: "5. The Balance Framework — Study, Recovery, and Everything Else",  level: 3 },
    { id: "faq",            title: "6. Study Discipline FAQs",                                          level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-29T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "study discipline tips, how to build study discipline, study habits without burnout, sustainable study routine, study discipline and balance, habit building studying, study consistency tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I build study discipline without burning out?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Building study discipline without burnout requires treating recovery as a structural component of the system, not as a reward earned through sufficient study. Specifically: study in bounded sessions with defined endpoints and genuine physical breaks; protect at least one full rest day per week as non-negotiable; build habits gradually (one new habit at a time, for four weeks each before adding the next); and define 'enough' before each study session rather than studying until you cannot continue. The students who sustain discipline longest are those whose routines are built on their lowest-energy days, not their highest.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the best habits for building study discipline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most evidence-backed habits for building sustained study discipline are: a consistent study time anchored to an existing daily behaviour (immediately after a specific meal or activity), a defined completion unit for each session (specific task, not time-based), a hard daily cutoff time that is treated with the same firmness as an exam appointment, a weekly Sunday review and plan session, daily physical movement that prevents the physical depletion that undermines motivation, and one protected daily non-academic activity that maintains the self-identity beyond studying that prevents burnout. Research on habit formation by Phillippa Lally suggests building one habit at a time, allowing four to six weeks per habit before adding the next.",
      },
    },
    {
      "@type": "Question",
      "name": "How many hours should I study per day without burning out?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research on cognitive performance and sustainable learning suggests that 4-6 hours of genuinely focused, active study produces better long-term outcomes than 8-10 hours of distracted or depleted study — both in terms of retention and in terms of psychological sustainability across an academic year. The key variable is quality (active methods, genuine focus, defined tasks) rather than duration. Students who study 5 focused hours with genuine recovery consistently outperform and outlast those who study 9 hours with insufficient recovery across a semester.",
      },
    },
  ],
};

// ── Discipline Builder Data ────────────────────────────────────────────────────
const SLATE3   = '#334F6E';
const SPALE5   = '#EEF3F8';
const SBORD5   = 'rgba(51,79,110,0.22)';

const DISCIPLINE_BLOCKERS = [
  {
    key:     'inconsistency',
    icon:    '🔄',
    label:   'Inconsistency — I start strong then fade',
    desc:    'Good days followed by complete stops, cycles of effort and abandonment',
    root:    'Inconsistency is almost always a habit structure problem, not a motivation or character problem. The behaviour that feels like discipline failure is actually the predictable result of building habits too ambitiously too quickly. Research by Phillippa Lally at University College London on habit formation shows that the average time for a new behaviour to become automatic is 66 days — with a range from 18 to 254 days depending on complexity. Habits attempted at high complexity before simpler versions are automatic consistently collapse under the natural motivation decline that follows initial enthusiasm.',
    habit_strategy: 'The Minimum Habit Rule: reduce each new study habit to its smallest possible version before attempting the full version. Not "study for 2 hours every morning" — "open the study notebook every morning." The minimal version becomes automatic first; the full version is added only after the minimal version requires no effort.',
    routine_fix: 'Attach the study habit to an existing anchor: a specific time immediately after an activity that already happens reliably (breakfast, commute home, a specific daily event). The existing behaviour becomes the trigger that activates study automatically — removing the daily motivational decision that inconsistency lives in.',
    balance_note: 'Inconsistency is often the body\'s circuit-breaker responding to unsustainable intensity. If the "fade" consistently follows periods of very high output, the habit may need less daily ambition and more recovery protection.',
    habit_build: 'This week: choose one study habit and reduce it to its minimum viable version. Practise only that version for two weeks before adding complexity.',
    example: 'Ishaan tried to study 4 hours every evening after college. He lasted 6 days before the routine collapsed. He rebuilt with: "I open my notes for 20 minutes after dinner, no exceptions." After three weeks, 20 minutes was automatic and comfortable. He then extended to 45 minutes. Then 90. The final habit was stronger than the original attempt because it was built from an automatic foundation.',
  },
  {
    key:     'perfectionism_d',
    icon:    '🎯',
    label:   'Perfectionism — if I cannot do it perfectly I do not do it at all',
    desc:    'Skipping study sessions because the conditions are not ideal or the time is insufficient',
    root:    'The perfectionism-discipline trap works like this: the student sets a high standard for what counts as a valid study session (the right amount of time, the right environment, full concentration). Any session that does not meet the standard is experienced as a failure. Rather than risk failure, the student avoids attempting sessions that might not meet the standard. The result is that perfectly achievable partial sessions are skipped in favour of the full session that rarely materialises.',
    habit_strategy: 'The "Something Always Beats Nothing" Rule: define a minimum valid session that is so small it can be completed in almost any circumstances — 15 minutes of active recall, 5 flashcards reviewed, one practice problem attempted. This minimum session counts fully. The existence of a minimum eliminates the "not enough time/conditions to study today" decision that perfectionism exploits.',
    routine_fix: 'Create a bad-day version of every routine. The good-day routine is ideal. The bad-day routine is the non-negotiable minimum that happens regardless. Knowing in advance what a bad-day session looks like prevents the "nothing" decision that perfectionism otherwise forces.',
    balance_note: 'Perfectionism is often an anxiety response — the standard is set high enough that failure can be attributed to impossible conditions rather than insufficient ability. Reducing the standard is not lowering the aspiration; it is removing the avoidance mechanism that perfectionism uses.',
    habit_build: 'Tonight: define your minimum valid study session — the smallest version that counts as showing up. Write it down. For the next two weeks, every day this minimum session happens is a successful day.',
    example: 'Priya would not start a study session unless she had at least 2 hours, a clean desk, and the right playlist. If any condition was absent, she studied nothing. She began requiring only this: "I sit at my desk and attempt one flashcard." Once sitting, she almost always continued. The one-flashcard minimum defeated the all-or-nothing pattern.',
  },
  {
    key:     'no_recovery',
    icon:    '🪫',
    label:   'No recovery — I push until I break then cannot function',
    desc:    'Intense periods followed by complete crashes where even basic tasks feel impossible',
    root:    'The push-until-break cycle is the primary mechanism of academic burnout. It occurs when recovery is treated as a reward for completing sufficient work rather than as a structural component of the work system itself. Without scheduled, non-negotiable recovery, the cognitive and emotional depletion accumulates invisibly — until the break point arrives and the student cannot function for days or weeks. Research by Arie Hobfoll on Conservation of Resources theory shows that resource depletion past a threshold produces disproportionately large impairment — the final 10% of depletion costs as much as the first 90% combined.',
    habit_strategy: 'The Scheduled Recovery Protocol: treat recovery periods with the same non-negotiability as study sessions. This means: a hard daily study cutoff (write the time before the day begins), at least one full rest day per week that is protected regardless of how behind you feel, and one non-academic activity per day that is scheduled (not earned) and protected.',
    routine_fix: 'Build your routine around your lowest-energy day, not your highest. If Tuesday is reliably difficult, plan minimal study on Tuesday — light review, admin, rest. A routine that survives Tuesday will survive most weeks. A routine that requires your best Tuesday every week will fail half the time.',
    balance_note: 'Physical movement, adequate sleep, and social connection are not rewards for completing study — they are maintenance activities that make sustained study possible. Remove any of them from the schedule and the remaining study quality declines.',
    habit_build: 'This week: identify your one full rest day and make it non-negotiable. No studying, no catching up, no guilt about not studying. Just rest. This is the single most important change available to prevent the push-until-break cycle.',
    example: 'Aryan studied 10-12 hours every day during exam month. He was incredibly productive in the first two weeks. By Week 3 he could not concentrate for more than 20 minutes. He spent the final week barely functional and performed well below his preparation level in the exams. The productivity of Weeks 1-2 was real — and it was made unsustainable by the absence of recovery.',
  },
  {
    key:     'no_purpose',
    icon:    '🌫️',
    label:   'Lack of purpose — studying feels mechanical and meaningless',
    desc:    'Going through the motions without any genuine engagement or felt sense of why it matters',
    root:    'Purposeless studying occurs when the intrinsic motivation that makes sustained effort feel worthwhile has been eroded by extended periods of purely compliance-driven work — studying to avoid failure, to satisfy others, or to meet a deadline rather than to learn, grow, or achieve something genuinely desired. Research by Edward Deci and Richard Ryan on self-determination theory shows that sustained motivation requires three elements: autonomy (a sense of choice), competence (progress and growing ability), and relatedness (connection to something meaningful). When all three are absent, studying becomes maintenance of an obligation rather than pursuit of a goal.',
    habit_strategy: 'The Purpose Anchor: write a brief (three-sentence) statement of why your studies matter to you — specifically, in your own terms, not what is expected of you. Read it before each study session. The anchor is not motivational performance — it is a genuine reconnection to the reason the discipline exists.',
    routine_fix: 'Include one element of genuine interest in each study session — a question you actually want answered, an application of the material you find interesting, a connection to something you care about. The interest dimension does not replace the comprehensive coverage; it provides the motivational fuel that makes covering everything else sustainable.',
    balance_note: 'Purposeless studying is often a sign that the balance between academic obligation and personal identity has tilted too far toward the former. Protecting time for activities and relationships that affirm who you are beyond a student restores the sense of personal investment that makes academic engagement feel worthwhile.',
    habit_build: 'Tonight: write your three-sentence purpose statement for your current studies. Keep it somewhere visible. Read it tomorrow before opening a book.',
    example: 'Meera was studying Commerce and finding it increasingly hollow. She started following a personal finance blog — not for study, just because she found it interesting. The real-world applications she discovered there made her textbook material feel connected to something real. Her engagement in class improved significantly — not because the course changed, but because she found a thread of genuine interest to follow through it.',
  },
  {
    key:     'distracted_sessions',
    icon:    '📱',
    label:   'Distracted sessions — long hours, minimal output',
    desc:    'Sitting at the desk for many hours but achieving little because attention keeps fragmenting',
    root:    'Distracted study is the most efficiency-destroying pattern in academic life — not because the student is not working, but because the psychological experience of studying (which is real and exhausting) is generating much less learning than the time invested suggests. The specific cognitive mechanism is attentional fragmentation: repeated context-switching between study material and distractions depletes the prefrontal executive function that both studying and distraction-resistance require, producing sessions where effort is high and output is low.',
    habit_strategy: 'Quality over quantity: reduce daily study time by 25% and remove all distraction sources (phone to another room, single open tab, notifications off). A shorter session of genuine focus produces more learning than a longer session of fragmented attention. Track output (completion units, questions attempted) rather than time to make the quality difference visible.',
    routine_fix: 'Build the environmental design into the pre-session ritual: phone to a different room, all non-study browser tabs closed, headphones on — before sitting down. Once seated, the environment is already set for focus. Waiting until you are seated to make these decisions means they compete with the pull to start working immediately.',
    balance_note: 'Distracted sessions are disproportionately exhausting — the student experiences all the effort of studying without the reward of clear progress. This exhaustion is often mistaken for burnout when it is actually the cost of inefficient session structure. Improving session quality reduces the felt cost of study significantly.',
    habit_build: 'Next session: reduce the planned study time by 30 minutes and remove the phone from the room. Compare the quality of output to your previous sessions. The likely result will confirm that less time with more focus produces more.',
    example: 'Vikram studied from 7pm to midnight every evening. He was frequently on his phone, switching between social media and notes every few minutes. He audited one week: he calculated approximately 90 minutes of genuine focused work per 5-hour session. He switched to two 75-minute focused sessions with the phone in a different room. His real output doubled in half the time.',
  },
];

const CURRENT_DISCIPLINE_LEVEL = [
  { key: 'building',  icon: '🌱', label: 'Building from scratch — no consistent routine yet' },
  { key: 'patchy',    icon: '🔶', label: 'Patchy — some habits exist but inconsistently' },
  { key: 'moderate',  icon: '🟡', label: 'Moderate — a routine exists but feels fragile' },
  { key: 'strong',    icon: '💚', label: 'Strong — but I am worried about sustainability and burnout' },
];

const RECOVERY_STATUS = [
  { key: 'none',     icon: '🔴', label: 'No deliberate recovery — I study until I stop', note: 'This is the highest burnout risk — addressed directly in your plan.' },
  { key: 'some',     icon: '🟡', label: 'Some recovery — breaks happen but inconsistently', note: 'Inconsistent recovery is better than none — your plan will help structure it.' },
  { key: 'adequate', icon: '🟢', label: 'Adequate recovery — genuine rest is built into my schedule', note: 'Your recovery foundation is good — protect it through high-pressure periods.' },
];

const DISCIPLINE_LEVEL_CONTEXT = {
  building: {
    strategy: 'Start with one habit only',
    guidance: 'The biggest mistake when building from scratch is attempting a complete routine immediately. One habit, consistently practised for 4 weeks, produces a more durable foundation than six habits attempted simultaneously and abandoned within 10 days. Choose the single highest-impact habit and build only that until it is genuinely automatic.',
    first_habit: 'A consistent daily study time anchored to an existing activity (immediately after a specific meal). Duration: 30-45 minutes. Method: active recall on the most important current topic. Everything else comes later.',
  },
  patchy: {
    strategy: 'Identify and protect what is already working',
    guidance: 'Patchy discipline means some habits exist and some do not. The intervention is not to start over but to identify which habits are already semi-automatic and protect them, then add one new habit at a time. A patchy routine that is improved gradually is more sustainable than abandoning the existing one for an ambitious new plan.',
    first_habit: 'Audit this week: which study habits happened every day? Which ones were skipped? Protect the consistent ones (they are the foundation) and add one new consistent habit based on what is missing most.',
  },
  moderate: {
    strategy: 'Strengthen the existing routine\'s recovery infrastructure',
    guidance: 'A moderate routine that feels fragile is almost always fragile because recovery is insufficient — the routine is taxing the same resources it is not replenishing. The priority is not adding more study habits but protecting the recovery practices that make the existing habits sustainable: a defined daily cutoff, one rest day per week, and one daily non-academic activity.',
    first_habit: 'This week: add exactly one recovery element (the one from the list you are most consistently skipping) to the routine. Protect it with the same firmness as the study sessions.',
  },
  strong: {
    strategy: 'Burnout prevention as active maintenance',
    guidance: 'Strong discipline with burnout risk means the routine is working but not sustainable at its current intensity. The prevention is structural: audit the weekly schedule for where recovery is being compressed, identify the pressure periods where the routine historically breaks down, and build in specific protection mechanisms before those periods arrive rather than after burnout hits.',
    first_habit: 'This week: identify your highest-pressure upcoming period (exam, deadline, intense week). Build the recovery plan for that period now — specifically what you will protect and what you will accept reducing. Pre-building the plan prevents the heat-of-the-moment tradeoff of recovery for study.',
  },
};

// ── Builder Component ──────────────────────────────────────────────────────────
function DisciplineBuilder() {
  const [step,      setStep]      = useState(1);
  const [blocker,   setBlocker]   = useState(null);
  const [level,     setLevel]     = useState(null);
  const [recovery,  setRecovery]  = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openSec,   setOpenSec]   = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selBlk  = DISCIPLINE_BLOCKERS.find(b => b.key === blocker);
  const selLvl  = CURRENT_DISCIPLINE_LEVEL.find(l => l.key === level);
  const selRec  = RECOVERY_STATUS.find(r => r.key === recovery);
  const lvlCtx  = level ? DISCIPLINE_LEVEL_CONTEXT[level] : null;

  const handleReset = () => { setStep(1); setBlocker(null); setLevel(null); setRecovery(null); setRevealed(false); setOpenSec(null); };

  const sections = selBlk ? [
    {
      id: 'root', icon: '🔬', title: 'Why This Pattern Occurs',
      content: selBlk.root,
    },
    {
      id: 'habit', icon: '🌱', title: 'Habit Strategy for This Blocker',
      content: selBlk.habit_strategy,
    },
    {
      id: 'routine', icon: '📅', title: 'Routine Fix',
      content: selBlk.routine_fix,
    },
    {
      id: 'balance', icon: '⚖️', title: 'Balance Note',
      content: selBlk.balance_note,
    },
  ] : [];

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SLATE3 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — blocker */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What is your biggest discipline blocker?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the pattern that most honestly describes what gets in the way of your study consistency.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {DISCIPLINE_BLOCKERS.map(db => {
              const isSel = blocker === db.key;
              return (
                <button key={db.key} onClick={() => setBlocker(db.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE3 : 'var(--border)', background: isSel ? SPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${SBORD5}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{db.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? SLATE3 : 'var(--ink)', marginBottom: '2px' }}>{db.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{db.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (blocker) setStep(2); }} disabled={!blocker} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: blocker ? `linear-gradient(135deg, ${SLATE3}, #4A6E96)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: blocker ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: blocker ? `0 6px 18px ${SBORD5}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — discipline level */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What is your current study discipline level?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {CURRENT_DISCIPLINE_LEVEL.map(cdl => {
              const isSel = level === cdl.key;
              return (
                <button key={cdl.key} onClick={() => setLevel(cdl.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE3 : 'var(--border)', background: isSel ? SPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${SBORD5}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{cdl.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? SLATE3 : 'var(--ink)' }}>{cdl.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (level) setStep(3); }} disabled={!level} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: level ? `linear-gradient(135deg, ${SLATE3}, #4A6E96)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: level ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — recovery */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — How deliberately do you protect recovery right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Recovery is the mechanism that makes discipline sustainable — not an optional reward for completion.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {RECOVERY_STATUS.map(rs => {
              const isSel = recovery === rs.key;
              return (
                <button key={rs.key} onClick={() => setRecovery(rs.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE3 : 'var(--border)', background: isSel ? SPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${SBORD5}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }}>{rs.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? SLATE3 : 'var(--ink)', marginBottom: '2px' }}>{rs.label}</div>
                    <div style={{ fontSize: '11px', color: isSel ? SLATE3 : 'var(--muted)' }}>{rs.note}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (recovery) { setStep(4); setRevealed(false); } }} disabled={!recovery} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: recovery ? `linear-gradient(135deg, ${SLATE3}, #4A6E96)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: recovery ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Discipline Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — Results */}
      {step === 4 && selBlk && selLvl && selRec && lvlCtx && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Your Sustainable Discipline Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${SLATE3}, #4A6E96)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${SBORD5}`,
              }}>🧱 Generate My Discipline Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${SLATE3}, #4A6E96)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selBlk.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  Your Sustainable Discipline Plan
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                  {selBlk.label} · {selLvl.label}
                </div>
              </div>

              {/* Level strategy */}
              <div style={{ background: SPALE5, border: `2px solid ${SBORD5}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE3, marginBottom: '5px' }}>
                  📍 Your Current Level Strategy: {lvlCtx.strategy}
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{lvlCtx.guidance}</p>
                <div style={{ background: 'white', borderRadius: '9px', padding: '10px 12px', border: `1px solid ${SBORD5}` }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: SLATE3, marginBottom: '4px' }}>⚡ Your First Habit:</div>
                  <p style={{ margin: 0, fontSize: '13px', color: SLATE3, fontWeight: '600', lineHeight: 1.6 }}>{lvlCtx.first_habit}</p>
                </div>
              </div>

              {/* Four expandable sections */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE3, marginBottom: '9px' }}>
                  📋 Your Blocker-Specific Plan
                </div>
                {sections.map((sec, i) => {
                  const isOpen = openSec === sec.id;
                  return (
                    <div key={sec.id} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', overflow: 'hidden', border: `1.5px solid ${SBORD5}` }}>
                      <button onClick={() => setOpenSec(isOpen ? null : sec.id)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${SLATE3}, #4A6E96)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{sec.icon}</div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: SLATE3, flex: 1 }}>{sec.title}</span>
                        <span style={{ color: SLATE3, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{sec.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Recovery-specific addition */}
              <div style={{ background: SPALE5, border: `1.5px solid ${SBORD5}`, borderRadius: '12px', padding: '13px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE3, marginBottom: '5px' }}>
                  {selRec.icon} Recovery Status: {selRec.label.split(' — ')[0]}
                </div>
                {recovery === 'none' && (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
                    No deliberate recovery is the primary burnout risk in your current plan. The single most important addition: <strong>a hard daily study cutoff written before the day begins</strong>, and one full rest day per week protected as non-negotiable. These two changes do not reduce total study output — they protect the cognitive quality that makes study hours valuable.
                  </p>
                )}
                {recovery === 'some' && (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
                    Inconsistent recovery is a vulnerability — it works on easy weeks and fails on hard ones. Upgrade your recovery from ad hoc to scheduled: write the daily cutoff time before each day begins and name the rest day explicitly in your weekly plan. The scheduling converts recovery from something that happens when you remember to something that happens by design.
                  </p>
                )}
                {recovery === 'adequate' && (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
                    Your recovery foundation is a significant asset — protect it especially during exam season and high-pressure periods, when the temptation to trade recovery for study time is strongest. The evidence is consistent: recovery protection during peak pressure periods produces better performance than equivalent study hours purchased at the cost of rest.
                  </p>
                )}
              </div>

              {/* Student example */}
              <div style={{ background: 'white', border: `1.5px solid ${SBORD5}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '5px' }}>👤 A Student Who Worked Through This</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selBlk.example}</p>
              </div>

              {/* Today's action */}
              <div style={{ background: SPALE5, border: `2px dashed ${SBORD5}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE3, marginBottom: '5px' }}>⚡ Start Today</div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: SLATE3, lineHeight: 1.65 }}>{selBlk.habit_build}</p>
              </div>

              {/* Affirmation */}
              <div style={{ background: 'white', border: `1.5px dashed ${SBORD5}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: SLATE3, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "The most sustainable discipline is the one that requires the least effort to maintain — because the habit is automatic and the recovery is protected."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${SBORD5}`, color: SLATE3, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a plan for a different blocker</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudyDisciplineWithoutBurnout({ navigate, relatedPosts }) {
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
      <p>There is a version of <strong>study discipline</strong> that most students have tried: the heroic version, where willpower is summoned each morning, the schedule is ambitious, the days are long, and the approach is sustained until it is not — until exhaustion, illness, or a breaking point forces a stop that lasts far longer than a rest day.</p>

      <p>That version of discipline is not actually discipline. It is unsustainable intensity wearing discipline's clothes. Genuine study discipline — the kind that carries you through an entire semester or academic year without producing burnout — looks different. It is quieter, more consistent, and less impressive on any given day. And it produces dramatically better outcomes across time.</p>

      <img
        src={meta.imgUrl}
        alt="Student building sustainable study discipline without burnout — realistic routines, habit building, and academic balance"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="discipline-vs">1. The Difference Between Discipline and Willpower</h3>
      <p>The most important conceptual shift in understanding sustainable study discipline is the distinction between willpower and habit. These are not synonyms, and confusing them produces the specific kind of failure that most students have experienced: the ambitious plan that runs well while motivation is high and collapses when it is not.</p>
      <p><strong>Willpower</strong> is the active, effortful override of competing impulses — the deliberate choice to study when the phone is more appealing, the desk is less comfortable than the bed, and the material is less rewarding than any available alternative. Research by Roy Baumeister at Florida State University demonstrates that willpower is a depletable resource: each exercise of self-control in any domain draws from the same finite pool, and the pool's depletion produces poorer self-control in all subsequent decisions for the remainder of the day. A discipline system built on willpower is therefore structurally unreliable — it works best when most needed least (in the morning, before depletion) and worst when most needed most (in the evening, after a full day of decision-making and self-regulation).</p>
      <p><strong>Habits</strong> are behaviours that have been repeated in consistent contexts until they are triggered automatically by environmental or temporal cues — without requiring a decision, a motivational state, or a willpower expenditure. A student who has practised sitting down to study at 7pm every day for six months does not need to decide to study at 7pm — the habit is activated by the time and by the associated environmental cues (the desk, the notebook arrangement, the playlist). Research by Wendy Wood at the University of Southern California shows that approximately 43% of daily behaviour is habitual — not decided, simply executed. Disciplined students have simply built more academic behaviours into that 43%.</p>
      <p><strong>The practical difference.</strong> A willpower-based study system asks: "How do I make myself study today?" — a question that requires a motivational answer and fails on low-motivation days. A habit-based study system asks: "What cues trigger the study behaviour automatically?" — a question with an environmental answer that does not depend on motivation. Building discipline means building habits, not strengthening willpower. And habits are built through repetition, consistency, and gradual complexity — not through heroic effort.</p>
      <p><strong>Why burnout is a systems failure, not a personal failure.</strong> Burnout occurs not because a student is insufficiently committed or resilient, but because the demands placed on their cognitive, emotional, and physical resources consistently exceed the recovery that the system provides. It is not a character verdict — it is a workload-recovery imbalance that would produce the same outcome in any student given the same conditions. Preventing burnout therefore requires not more commitment but better system design: specifically, the deliberate, structural protection of recovery as a non-negotiable component of the study plan rather than an optional reward for completing sufficient work.</p>

      {/* ── Section 2 ── */}
      <h3 id="habits">2. Six Habit-Building Strategies That Create Lasting Study Discipline</h3>

      <p><strong>1. One habit at a time — always.</strong> The most consistent predictor of new habit failure is attempting multiple new behaviours simultaneously. Research by Lally and colleagues at University College London on habit formation shows that the automaticity of a new behaviour develops over a range of 18 to 254 days (average 66 days) — and that this development is disrupted when cognitive resources are divided across multiple new habit attempts. Successful habit-builders consistently introduce one new behaviour, wait until it is genuinely automatic (requiring no conscious effort), and then add the next. This sequence is slower and less exciting than a complete routine overhaul — and it produces habits that are still present six months later, where the complete overhaul has typically been abandoned in two weeks.</p>

      <p><strong>2. Anchor the habit to an existing behaviour — not a time.</strong> Habits anchored to other habits (immediately after breakfast, as soon as I get home) are more durable than habits anchored to clock times (at 6:30pm every day), because the existing behaviour is a reliable cue that does not depend on remembering the scheduled time or maintaining a motivation to begin at the right moment. The cue does the activation work that motivation otherwise handles — which means the habit works even on days when motivation is low. Identify the most reliable, consistent existing behaviour in your daily life and attach the new study habit to it with the specific formulation "immediately after [existing behaviour], I will [new study habit]."</p>

      <p><strong>3. Define the minimum habit before the ideal habit.</strong> For every study habit, define both its ideal version and its minimum version. The ideal version happens on good days — adequate time, good energy, full session. The minimum version happens on any day, regardless of conditions — and is specifically designed to be small enough that there is never a legitimate reason to skip it. The minimum version might be: "open the study notebook and review yesterday's active recall notes." This takes less than five minutes. When the minimum version is completed on bad days, the habit chain remains unbroken — and unbroken chains are the mechanism through which habits become automatic.</p>

      <p><strong>4. Track the streak visibly.</strong> A physical habit tracker — a paper grid with each day marked when the habit occurs — produces measurably better habit consistency than memory or digital tracking. Research on commitment devices by psychologist Richard Thaler shows that visible progress records activate the loss-aversion system: the psychological cost of breaking a streak becomes increasingly large as the streak grows, providing an increasingly strong motivation to maintain it. The tracker is not for self-surveillance — it is for making the accumulated progress visible in a way that makes continuing feel worthwhile and breaking feel costly.</p>

      <p><strong>5. Never miss twice — the recovery rule.</strong> Every consistent habit encounters disruption. The critical decision is not whether disruption occurs but what happens immediately after. Research on habit formation consistently shows that single missed days have negligible effects on long-term habit strength; multiple consecutive missed days have significant effects. The rule "never miss twice" — treat one missed day as a normal disruption to be absorbed, and make every possible effort to return to the habit the following day — prevents the cascade from one missed day to abandoned habit that most students have experienced.</p>

      <p><strong>6. Celebrate completions — specifically and immediately.</strong> The dopamine system that produces habit formation is activated by the completion of the habit, not by the distant outcome the habit is working toward. This means that a brief, specific, immediate celebration when a study habit is completed — saying "done" out loud, making a tick mark on the tracker, taking a deliberate breath of acknowledgment — produces more dopamine than the abstract knowledge that the studying will help in exams. Immediate reward activation is more powerful than delayed consequence in shaping neural habit pathways. Design brief celebrations for every completion.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Discipline Builder</h3>
      <p>The Builder identifies your primary discipline blocker, your current discipline level, and how deliberately you protect recovery — and generates a personalised sustainability plan: the root cause of your blocker, four specific strategies for addressing it, your level-appropriate first habit, and a concrete action for today. The plan is calibrated to where you actually are, not where you wish you were.</p>

      <DisciplineBuilder />

      {/* ── Section 4 ── */}
      <h3 id="routines">4. Realistic Study Routines That Actually Hold</h3>
      <p>The difference between a routine that holds and one that collapses is usually not the quality of its design — it is whether it was designed for the realistic week or the aspirational week. Most students design routines for the week where everything goes as planned, they have maximum energy, no unexpected demands arrive, and they wake up motivated every morning. These conditions describe perhaps one week in five. The other four weeks, the routine collapses because it was not designed for them.</p>
      <p><strong>Build the routine for Tuesday.</strong> Most students have a most difficult day of the week — a day when energy is characteristically low, demands are typically higher, and motivation is most elusive. Identify that day. Design the routine so that the minimum version of it is achievable on that day. If the Tuesday version of the routine is achievable, the routine survives the week. If it is not, the week ends in partial collapse and the resulting guilt undermines the following week's start.</p>
      <p><strong>The three-block daily structure.</strong> Rather than time-based planning (6:30-8am study, 8:30-10am study), structure the day in three functional blocks: a peak block (the highest-alertness period, for the most demanding material), a secondary block (moderate energy, for practice and review), and a recovery block (protected rest, no academic content). The structure is consistent; the specific times flex with each day's actual constraints. A student with a variable schedule maintains the three-block structure across varying daily timings — maintaining the habit structure even when the exact hours shift.</p>
      <p><strong>The non-negotiable minimum for every day.</strong> Every routine needs a defined daily non-negotiable — the single study action that happens regardless of how disrupted the day is, how low the energy is, or how many unexpected demands arrived. This might be fifteen minutes of active recall, three flashcards reviewed, or re-reading one page of notes. The non-negotiable is not the ideal; it is the floor below which the routine does not fall. Its purpose is keeping the habit alive on the worst days of the month — because those days exist and the routine needs to survive them.</p>
      <p><strong>The weekly reset mechanism.</strong> Every sustainable routine has a reset point — a scheduled time (Sunday evening is the most common) when the previous week is reviewed, what was and was not completed is honestly assessed, and the next week's specific plan is built based on that reality. The reset prevents the gradual drift from planned to actual that, without correction, converts a working routine into an aspirational document over four to six weeks. Fifteen minutes every Sunday on these three questions: What did I complete? What do I need to carry forward? What is one adjustment to next week's plan?</p>

      {/* ── Section 5 ── */}
      <h3 id="balance">5. The Balance Framework — Study, Recovery, and Everything Else</h3>
      <p>Balance in academic life is not an equal allocation of time to competing demands — it is the deliberate design of a schedule that protects both the study time that produces academic progress and the recovery time that makes study time cognitively possible. Without the second, the first degrades rapidly. Without the first, the second feels guilty and incomplete. The framework below structures both.</p>
      <p><strong>The non-academic foundation.</strong> Every sustainable academic schedule is built on a foundation of three non-negotiable non-academic activities: adequate sleep (7-8 hours, consistently scheduled), daily physical movement (20-30 minutes minimum, any form), and at least one daily social connection (a genuine exchange with another person, not a group chat update). These are not rewards for completing sufficient study — they are maintenance activities that make cognitive performance possible. Removing any of them from the schedule in favour of additional study hours produces lower total output across the week, not higher, because the study hours become progressively less cognitively efficient.</p>
      <p><strong>The protected weekly rest day.</strong> One full day per week — not a lighter study day, a genuinely non-academic day — is the most important single structural element of a burnout-prevention plan. Research on weekly rest consistently shows that students who protect a full rest day maintain higher academic performance across an entire semester than those who study seven days at declining intensity. The rest day is not laziness — it is the neurological recovery that allows the other six days to be of full quality. Protect it as firmly as you would protect a scheduled exam.</p>
      <p><strong>The daily shutdown ritual.</strong> A specific, consistent sequence of actions that signals the end of the study day — closing materials deliberately, writing tomorrow's two tasks, a brief reflection, physically leaving the study space — trains the brain that the academic period has a defined endpoint. Without this boundary, academic anxiety is a continuous ambient state rather than a bounded, manageable experience. The ritual creates the permission structure for genuine rest to be restorative rather than guilty.</p>
      <p><strong>The genuine daily enjoyment requirement.</strong> One activity per day that is purely for you — not productive, not health-optimising, not academically related, not Instagram-worthy — is not a luxury addition to a discipline plan. It is the maintenance of the part of your identity that exists beyond being a student. When this component disappears from the schedule (as it commonly does during exam season), what remains is an academic performance machine that is efficiently depleting its own motivational fuel supply. Students who maintain one genuinely enjoyable daily activity through exam season consistently report lower burnout and better exam performance than those who eliminate all non-academic pleasure during high-pressure periods.</p>
      <p><strong>Recognising the imbalance signals.</strong> Before burnout fully arrives, it sends specific signals: Sunday dread (a persistent anxiety or despair specifically associated with the approaching week), studying without absorbing (long sessions that produce no retained learning), emotional flatness (inability to feel satisfaction at genuine accomplishments), irritability disproportionate to triggers, and the specific experience of never feeling done even when objectively ahead. Each of these is a signal worth responding to — not by reducing academic ambition but by examining the recovery structure and identifying what has been compressed or eliminated. The response to imbalance signals is never to push through — it is to investigate and restore.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Study Discipline FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried building routines before and they always fail by Day 5. How is this approach different?</strong><br />
        A: The Day 5 collapse almost always has the same cause: the routine was too complex and too ambitious for the habit formation process to support. Each new habit requires its own automaticity development period — approximately 4-8 weeks for simple habits, longer for complex ones. A routine with six new habits attempted simultaneously puts six habits in competition for the same limited habit formation resources. The approach in this guide is different in one specific structural way: start with one habit only, let it become genuinely automatic (meaning it requires no conscious decision or motivational effort), and then add the next. This is slower in the first month and dramatically more durable thereafter. The routines that hold across six months are almost always the ones that were built gradually.</p>

        <p><strong>Q: Every time I take a rest day I feel guilty and the guilt ruins the rest. How do I fix this?</strong><br />
        A: Rest guilt is produced by the implicit belief that rest is earned through sufficient study completion rather than scheduled as a structural necessity. Fixing it requires a cognitive reframe: the rest day is in the schedule as a component of the academic system — not as a reward, not as laziness, not as time stolen from study. It is scheduled because the evidence for its performance benefits is robust and specific. Treating it as a medical appointment that you cannot cancel without consequence — not emotionally, but structurally — is the most effective reframe. Additionally: define "enough" before each week begins. "This week is successful if I complete [specific list of completion units]." When those units are completed, the rest day is earned not as a reward but as the confirmation that the week's work is done. The list, completed, gives the rest genuine permission that open-ended "is there always more I could study?" prevents.</p>

        <p><strong>Q: How do I build study discipline when I have a genuinely demanding schedule — college, family responsibilities, part-time work?</strong><br />
        A: A demanding external schedule changes the amount of available study time but does not change the principles of building discipline within that time. The specific adjustments: map your actual available time before planning anything (a study plan built on hoped-for time rather than audited time fails immediately); reduce the ambition of the plan to fit the actual hours rather than building the plan and hoping the hours materialise; identify the two or three most cognitively productive windows in your week and protect them as the primary study blocks; and build the minimum valid session around the constraints of your actual life (15 focused minutes in a transit window counts; 3 hours you do not have does not). Discipline under constraint looks different from discipline in ideally available time — but the habits that produce it are built the same way.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SLATE3, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "True discipline is not the loudest or the longest. It is the one that is still running in November."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          The discipline that produces the best academic outcomes is not the kind that impresses people in the first week of term. It is the kind that is still functional in the final weeks before exams — when intensity is highest, energy is depleted, and the students whose routines were built on willpower have collapsed. Build habits gradually. Protect recovery structurally. Design for the bad day, not the good one. The consistency is the whole point.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SLATE3, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD5}` }}
          >
            Build Better Habits in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SLATE3, border: `2px solid ${SLATE3}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Discipline Strategy
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Related Study and Wellbeing Guides:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/productive-study-routine',         '→ How to Build a Productive Study Routine That Works'],
            ['/blog/academic-burnout-signs',           '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/mental-exhaustion-studying',       '→ Why You Feel Mentally Exhausted While Studying'],
            ['/blog/balance-studies-mental-health',    '→ How to Balance Studies and Mental Health Effectively'],
            ['/blog/exam-time-management',             '→ How to Manage Time Effectively for Exams'],
            ['/blog/study-without-distractions',       '→ How to Study Without Distractions in a Digital World'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SLATE3, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
