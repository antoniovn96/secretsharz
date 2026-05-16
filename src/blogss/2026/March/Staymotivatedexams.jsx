import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stay Motivated During Exam Season",
  excerpt: "Exam season motivation does not come from waiting to feel inspired — it comes from the deliberate construction of habits, goals, and systems that keep you moving even when the initial enthusiasm has faded. Learn the science of sustainable motivation, build your personalised Motivation Engine, and get specific habit-building and goal-setting strategies that work under real exam pressure.",
  category: "Mental Health",
  date: "15-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/stay-motivated-exams.jpg",
  tldr: "Exam motivation tips that work are not about hype or inspiration — they are about understanding how motivation actually functions neurologically, building the environmental and habit structures that sustain it, setting goals that are specific enough to drive action, and managing the motivation dips that are a normal part of any sustained effort. This guide covers the science, twelve realistic strategies, goal-setting frameworks, habit-building methods, and an interactive Motivation Engine to build your personalised exam season motivation system.",
  toc: [
    { id: "science",    title: "1. The Science of Exam Season Motivation",                          level: 3 },
    { id: "twelve",     title: "2. Twelve Realistic Exam Motivation Strategies",                    level: 3 },
    { id: "engine",     title: "3. Interactive: The Motivation Engine",                             level: 3 },
    { id: "goals",      title: "4. Goal-Setting That Actually Drives Exam Motivation",              level: 3 },
    { id: "habits",     title: "5. Habit-Building Methods for Sustained Study Motivation",          level: 3 },
    { id: "faq",        title: "6. Exam Motivation FAQs",                                           level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-15T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "exam motivation tips, how to stay motivated during exams, exam season motivation, study motivation strategies, habit building exams, goal setting students, motivation for studying, keep motivated exam",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stay motivated during exam season?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Staying motivated during exam season requires three parallel systems: a meaningful goal structure (specific, personally significant goals that connect daily study to a genuine future you care about), consistent habits (small daily practices that activate automatically without requiring motivation), and a recovery system (deliberate practices for the low-motivation days that are an inevitable part of any sustained effort). The most common motivation failure is waiting to feel motivated before starting — motivation follows action more reliably than it precedes it.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best motivation technique for studying?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research by Edward Deci and Richard Ryan on self-determination theory identifies three conditions that produce the most durable intrinsic motivation: autonomy (feeling that you are studying by genuine choice rather than pure compulsion), competence (regularly experiencing the progress and skill growth that study produces), and connection (feeling that the work connects to something or someone meaningful). The practical implication is that motivation is more sustainable when it comes from genuine interest in the subject or genuine connection to the future goal than when it comes purely from external pressure or fear of failure.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it normal to lose motivation during exam season?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — motivation dips during sustained effort are not only normal but neurologically predictable. Dopamine — the neurotransmitter most associated with motivation — is most strongly activated by novelty and by approaching (rather than achieving) goals. As exam preparation extends over weeks, the novelty fades and the goal feels further away rather than closer, producing natural motivation dips. Understanding this as a predictable feature of sustained effort rather than a signal that you have lost your drive allows students to implement maintenance strategies without catastrophising the low periods.",
      },
    },
  ],
};

// ── Motivation Engine Data ─────────────────────────────────────────────────────
const AMBER   = '#B07A20';
const APALE   = '#FBF6EC';
const ABORD   = 'rgba(176,122,32,0.22)';

const MOTIVATION_TYPES = [
  {
    key:     'purpose',
    icon:    '🎯',
    label:   'Purpose-Driven',
    desc:    'I do best when I have a clear "why" — when the work connects to something I genuinely care about',
    profile: 'Your motivation runs deepest when you can see the line between today\'s study session and a future you actually want. Without that line, even adequate preparation feels hollow. The engine below focuses on reconnecting the immediate work to your genuine purpose.',
    strategies: [
      { title: 'Write your "why" chain', text: 'Start with today\'s specific subject. Write: "I am studying [subject] so that I can [immediate outcome]. That matters because [deeper reason]. Which matters because [deepest personal reason]." The chain from today\'s work to your genuine motivation anchors each session in something real.' },
      { title: 'Vision statement for exam season', text: 'Write one paragraph describing who you will be and what you will be doing in five years — in as much specific detail as you can genuinely believe. Read it before each week\'s first study session. This is not wishful thinking; it is the motivational activation of your most meaningful goal.' },
      { title: 'Find the interesting thread', text: 'In each subject, identify the one question or concept that actually interests you — however narrow. Build sessions partly around that thread. Intrinsic interest is the most durable motivation source, and even a small pocket of genuine interest in an otherwise difficult subject significantly sustains engagement.' },
    ],
    habit: 'The weekly "why" check-in: every Sunday, spend three minutes reconnecting to your purpose before planning the week. Write one sentence of the answer to "why does this week\'s study matter?" Read it again on Wednesday if motivation drops.',
    goal_tip: 'For purpose-driven students, the most powerful goal is a "dream goal" plus a "floor goal": the dream goal is what you are reaching for; the floor goal is what you will be satisfied with. Having both prevents the demotivation of apparent distance from the dream when it is not achieved immediately.',
    mantra: '"Today\'s hour is a brick in something I am building. The building takes time."',
  },
  {
    key:     'progress',
    icon:    '📈',
    label:   'Progress-Driven',
    desc:    'I do best when I can see that I am improving — when the effort visibly moves something forward',
    profile: 'Your motivation is most vulnerable when progress is invisible — when you have been studying consistently but cannot see the movement. The engine below focuses on making progress measurably visible and celebrating forward movement rather than only final outcomes.',
    strategies: [
      { title: 'The done list', text: 'Alongside your to-do list, maintain a daily "done" list — everything you completed, including small things. The brain\'s negativity bias makes remaining tasks feel overwhelming while completed tasks feel invisible. The done list counteracts this by making accumulation concrete and visible.' },
      { title: 'Weekly knowledge test', text: 'Every Friday, test yourself on the week\'s material with no notes. Score it (roughly — not precisely). The following Friday, retest the same material. The score improvement is tangible evidence of progress that sustains motivation more effectively than any amount of studying without testing.' },
      { title: 'Skill tracking chart', text: 'For each major subject skill (e.g., "solve quadratic equations in under 90 seconds"), track your performance weekly on a simple graph. The visible upward trend — even when gradual — is a powerful intrinsic reward that drives continued effort.' },
    ],
    habit: 'The two-minute weekly review: every Sunday, write three specific things you understood better at the end of the week than you did at the start. Specific — not "I studied chemistry" but "I can now explain why electrons occupy shells without looking at my notes." The specificity makes the progress real.',
    goal_tip: 'For progress-driven students, break every large exam goal into sub-goals visible at the weekly level. "Pass board exams" is too distant. "Master chapter 4 of chemistry this week and confirm it with active recall" is actionable and visible. The weekly sub-goal is where your motivation lives.',
    mantra: '"Every session moves the line. I can see where I started from."',
  },
  {
    key:     'social',
    icon:    '🤝',
    label:   'Connection-Driven',
    desc:    'I do best when I feel supported — when others are involved in my study journey',
    profile: 'Your motivation is most resilient when you feel connected rather than isolated in the effort. Exam season can isolate students in individual study bubbles that drain the very motivation that connection sustains. The engine below focuses on strategic social structures that fuel rather than distract from study.',
    strategies: [
      { title: 'Accountability partnership', text: 'Find one person — a classmate, sibling, or friend — and commit to a weekly check-in: each of you shares what you planned to do, what you actually did, and what the next week\'s commitment is. The accountability is not pressure — it is the felt presence of someone who knows what you are working toward.' },
      { title: 'Study with intention, rest with people', text: 'The most effective social structure for connection-driven students is: study alone (where the actual cognitive work happens without distraction), and then genuinely connect with people during rest time. This gives you both the cognitive conditions for effective study and the social connection that your motivation requires.' },
      { title: 'Teaching as study', text: 'Explain what you studied today to someone — a family member, a friend, anyone who will listen. The explaining consolidates your own understanding and produces the social engagement that connection-driven students find motivating. Teaching is simultaneously the most social and the most effective study method available.' },
    ],
    habit: 'The daily check-in message: send one brief message to one person each day during exam season — not about study stress, about your day or theirs. One minute of genuine connection is enough to buffer the isolation that drains connection-driven motivation.',
    goal_tip: 'For connection-driven students, share your exam season goals with at least one person who cares about you — not to create pressure, but to create the felt sense of shared investment. Goals that others know about are more motivationally live than private goals because the social awareness sustains commitment across the low-motivation days.',
    mantra: '"I am not doing this alone. The people I care about are with me in this."',
  },
  {
    key:     'reward',
    icon:    '⭐',
    label:   'Reward-Driven',
    desc:    'I do best when effort is linked to specific rewards — when completion has a payoff',
    profile: 'Your motivation responds most strongly to the anticipation of a defined reward — a specific payoff that makes the effort feel worth it in the immediate term, not only in the distant future. The engine below focuses on building a reward structure that activates consistently without undermining the intrinsic elements of study motivation.',
    strategies: [
      { title: 'If-then reward contracts', text: 'Before each study session, write an if-then contract: "If I complete [specific task] in this session, then I will [specific reward]." The reward must be: specific (not "rest" but "watch one episode of [specific show]"), immediate (within minutes of completing the task), and proportional (small reward for small task, larger for significant effort).' },
      { title: 'The reward menu', text: 'Build a tiered reward menu before exam season starts — rewards for completing a daily study session, rewards for completing a week\'s plan, and one significant reward for reaching exam day having followed through on your preparation. Having the menu pre-built prevents the decision fatigue of choosing rewards in the moment and makes the reward system systematic rather than arbitrary.' },
      { title: 'The progress token system', text: 'Give yourself a physical token (a marble, a coin, a sticker) for every completed Pomodoro or study session. When you reach ten tokens, exchange them for a meaningful reward. The physical accumulation is surprisingly motivating — you can see and feel the evidence of your effort building.' },
    ],
    habit: 'The non-negotiable daily reward: one small, specific pleasure that happens every evening regardless of how the day went — a specific drink, a walk, a brief creative activity. This is not a reward for good performance; it is a scheduled recovery and wellbeing investment that keeps the overall system sustainable. The reward for performance is on top of this.',
    goal_tip: 'For reward-driven students, set a specific, meaningful personal reward for exam season completion — not a grade, something tangible and enjoyable that you genuinely want and that you commit to providing yourself if you follow through on your preparation plan. Make it real before the season starts.',
    mantra: '"The work earns the reward. Both are real and both matter."',
  },
  {
    key:     'structure',
    icon:    '📋',
    label:   'Structure-Driven',
    desc:    'I do best when I have a clear plan and schedule — routine removes the need for daily motivation decisions',
    profile: 'Your motivation is most reliable when the structure of the day does the decision-making for you — when "what should I do now" is already answered by the schedule. Without structure, you can spend significant cognitive energy managing the gap between intention and action. The engine below focuses on building a system that removes daily motivation decisions.',
    strategies: [
      { title: 'The non-negotiable daily minimum', text: 'Define a specific daily study minimum — a concrete, achievable amount that you commit to regardless of mood, energy, or motivation level. Not your ideal — your floor. On good days you exceed it. On bad days you hit it and stop. The consistency of hitting the minimum across all days is more valuable than occasional excellent days separated by no-study days.' },
      { title: 'Pre-committed weekly architecture', text: 'Every Sunday evening, fill in the coming week\'s schedule with specific study blocks — subject, method, and output for each session. This takes fifteen minutes and eliminates the daily "what should I study" decision that structure-driven students find particularly draining.' },
      { title: 'The habit stack', text: 'Attach your study sessions to existing daily anchors: immediately after breakfast, immediately after school arrival, immediately after dinner. Existing habits are the most reliable cues for new ones — the anchor habit triggers the study habit automatically without requiring motivational activation each time.' },
    ],
    habit: 'The Sunday plan: every Sunday, spend fifteen minutes completing a weekly study schedule — specific sessions, specific subjects, specific methods. Then on each study day, the only question is "am I following the plan?" not "what should I do?" This single habit eliminates the primary friction point for structure-driven students.',
    goal_tip: 'For structure-driven students, the most useful goals are process goals rather than outcome goals: "I will complete 25 Pomodoro sessions this week" rather than "I will understand all of chapter 7." Process goals are entirely within your control and build the momentum that eventually produces the outcomes you are aiming for.',
    mantra: '"The plan is the decision. I follow the plan today."',
  },
];

const MOTIVATION_DIPS = [
  { key: 'too_far',   icon: '🔭', label: 'The goal feels impossibly far away' },
  { key: 'no_point',  icon: '💭', label: 'I cannot see the point of what I am studying' },
  { key: 'exhausted', icon: '🪫', label: 'I am too tired to feel motivated' },
  { key: 'failed',    icon: '📉', label: 'A recent bad result knocked my motivation' },
  { key: 'pressure',  icon: '⚖️', label: 'External pressure has turned study into something I resent' },
];

const DIP_RESPONSES = {
  too_far: {
    title: 'When the goal feels too far',
    response: 'The goal is not too far — it is too unbroken. A single large goal viewed from the start of exam season feels impossibly distant because the brain has no intermediate waypoints to generate the dopamine that sustains momentum. Break it into the smallest unit of visible progress: not "pass board exams" but "understand and recall this specific chapter by Friday." The nearness of the small goal is what generates the motivation the large goal cannot.',
    immediate_action: 'Write one specific, achievable sub-goal for this week. Not the exam — this week. What specific capability will you have on Friday that you do not have now? That is your motivation target.',
  },
  no_point: {
    title: 'When nothing feels meaningful',
    response: 'Loss of meaning during sustained effort is often a cognitive narrowing rather than a genuine conclusion. When you are deep in exam preparation, the daily grind can make it genuinely difficult to access the sense of purpose that motivated the effort initially. This is the right moment to return to your "why" — not the external one (grades, family) but the internal one (what do you genuinely want for your own life?).',
    immediate_action: 'Write one paragraph about what you hope your life looks like in five years. Be specific. Then write one sentence connecting this week\'s study to that picture. Even a tenuous connection is more motivationally live than no connection.',
  },
  exhausted: {
    title: 'When you are too tired to motivate',
    response: 'Exhaustion is not a motivation problem — it is a recovery problem. You cannot motivate yourself past genuine physiological depletion. The honest response to exhaustion is not a motivational speech but a rest decision. One day or half-day of genuine recovery — proper sleep, movement, good food, non-academic activity — produces more total study output over the following three days than the same period spent forcing exhausted study through.',
    immediate_action: 'Give yourself permission to stop studying for the rest of today. Schedule a recovery activity that genuinely restores you. Plan tomorrow\'s first specific study task before you stop — so you do not lose momentum, just today\'s session.',
  },
  failed: {
    title: 'When a bad result knocked you',
    response: 'A poor result is information about one performance on one day — it is not a verdict on your capability or your trajectory. The most useful question is not "what does this say about me?" but "what does this tell me about what to focus on?" The students who recover fastest from bad results are the ones who convert the emotional response into a specific, actionable study adjustment within 24-48 hours rather than letting the demoralisation sit and grow.',
    immediate_action: 'Write: "This result tells me I need to work on [specific area]." Then write: "My first action toward that this week will be [specific task]." The specificity converts the emotional blow into a study plan, which is where the recovery of motivation actually happens.',
  },
  pressure: {
    title: 'When external pressure turns study to resentment',
    response: 'When study becomes something you do to satisfy external demands rather than because it connects to your genuine goals, motivation collapses because it is no longer yours. The pressure is real and may be unchangeable — but your relationship to the study can be. The reframe is not denying the pressure but reclaiming one genuine reason the work matters to you, independent of what others want from it. Even one genuine internal reason sustains motivation in a way that external pressure never can.',
    immediate_action: 'Write: "If the pressure and expectations did not exist, I would still want to [genuine reason to study]." Find the genuine internal element — however small — and study from that today, not from the pressure.',
  },
};

// ── Motivation Engine Component ────────────────────────────────────────────────
function MotivationEngine() {
  const [step,     setStep]     = useState(1);
  const [motType,  setMotType]  = useState(null);
  const [dipType,  setDipType]  = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [openStrat,setOpenStrat]= useState(null);
  const [showDip,  setShowDip]  = useState(false);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selMot  = MOTIVATION_TYPES.find(m => m.key === motType);
  const selDip  = MOTIVATION_DIPS.find(d => d.key === dipType);
  const dipResp = dipType ? DIP_RESPONSES[dipType] : null;

  const handleReset = () => { setStep(1); setMotType(null); setDipType(null); setRevealed(false); setOpenStrat(null); setShowDip(false); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? AMBER : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — motivation type */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Which motivation type fits you best?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the one that resonates most honestly — what actually drives you when it works, not what you think should drive you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {MOTIVATION_TYPES.map(mt => {
              const isSel = motType === mt.key;
              return (
                <button key={mt.key} onClick={() => setMotType(mt.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? AMBER : 'var(--border)', background: isSel ? APALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${ABORD}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{mt.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? AMBER : 'var(--ink)', marginBottom: '2px' }}>{mt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{mt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (motType) setStep(2); }} disabled={!motType} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: motType ? `linear-gradient(135deg, ${AMBER}, #D4A030)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: motType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: motType ? `0 6px 18px ${ABORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — dip type */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What kind of motivation dip affects you most?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            This will generate a specific recovery plan for your low-motivation moments.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {MOTIVATION_DIPS.map(md => {
              const isSel = dipType === md.key;
              return (
                <button key={md.key} onClick={() => setDipType(md.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? AMBER : 'var(--border)', background: isSel ? APALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${ABORD}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{md.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? AMBER : 'var(--ink)' }}>{md.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (dipType) { setStep(3); setRevealed(false); } }} disabled={!dipType} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: dipType ? `linear-gradient(135deg, ${AMBER}, #D4A030)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: dipType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Motivation Engine →</button>
          </div>
        </>
      )}

      {/* STEP 3 — results */}
      {step === 3 && selMot && selDip && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Your Motivation Engine
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${AMBER}, #D4A030)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${ABORD}`,
              }}>⚡ Start My Engine</button>
              <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${AMBER}, #D4A030)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>{selMot.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {selMot.label} Motivation System
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>Personalised for your drive type and your dip pattern</div>
              </div>

              {/* Profile */}
              <div style={{ background: 'white', border: `1.5px solid ${ABORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '6px' }}>💡 Your Motivation Profile</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{selMot.profile}</p>
              </div>

              {/* Three strategies */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '9px' }}>
                  🎯 Three Strategies for Your Motivation Type
                </div>
                {selMot.strategies.map((s, i) => {
                  const isOpen = openStrat === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${ABORD}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStrat(isOpen ? null : i)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: `linear-gradient(135deg, ${AMBER}, #D4A030)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: AMBER, flex: 1 }}>{s.title}</span>
                        <span style={{ color: AMBER, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{s.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Daily habit */}
              <div style={{ background: APALE, border: `1.5px solid ${ABORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '6px' }}>🌱 Your Keystone Habit</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selMot.habit}</p>
              </div>

              {/* Goal tip */}
              <div style={{ background: 'white', border: `1.5px solid ${ABORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '6px' }}>🎯 Goal-Setting Tip for Your Type</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{selMot.goal_tip}</p>
              </div>

              {/* Dip recovery */}
              <div style={{ background: APALE, border: `2px solid ${ABORD}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <button onClick={() => setShowDip(d => !d)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: AMBER }}>⚡ {dipResp?.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Your personalised dip recovery plan</div>
                  </div>
                  <span style={{ color: AMBER, fontSize: '14px' }}>{showDip ? '▲' : '▼'}</span>
                </button>
                {showDip && dipResp && (
                  <div style={{ padding: '0 16px 16px 16px', borderTop: `1px solid ${ABORD}`, animation: 'floatUp 0.25s ease' }}>
                    <p style={{ margin: '12px 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{dipResp.response}</p>
                    <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: `1px solid ${ABORD}` }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '5px' }}>⚡ Immediate Action</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{dipResp.immediate_action}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mantra */}
              <div style={{ background: 'white', border: `1.5px dashed ${ABORD}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: AMBER, marginBottom: '7px' }}>✨ Your Exam Season Mantra</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: AMBER, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {selMot.mantra}
                </p>
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: `1.5px solid ${ABORD}`, color: AMBER,
                padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Build a different engine</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StayMotivatedExams({ navigate, relatedPosts }) {
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
      <p>Motivation during exam season is not a steady flame — it is more like a signal that flickers. There are days when the sense of purpose is clear and the study flows easily. There are days when everything feels pointless, the goal seems impossibly far away, and the notebook might as well be written in a foreign language. Both kinds of days are completely normal, and the students who perform best across exam season are not the ones who feel motivated every day. They are the ones who have built systems that keep them moving on the days they do not.</p>

      <p>These <strong>exam motivation tips</strong> are not about generating enthusiasm from thin air. They are about understanding how motivation actually works neurologically, building the habits and structures that sustain it across a long preparation season, setting goals that are specific enough to drive daily action, and having a ready response for the inevitable motivation dips before they arrive.</p>

      <img
        src={meta.imgUrl}
        alt="Student staying motivated during exam season using habit-building methods, goal-setting strategies, and realistic motivation techniques"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="science">1. The Science of Exam Season Motivation</h3>
      <p>Motivation is not a personality trait. It is a neurological state produced by specific conditions — and understanding those conditions is what makes it possible to manage motivation rather than simply hoping it arrives.</p>
      <p><strong>Dopamine and the approaching goal.</strong> The neurotransmitter most associated with motivation is dopamine — but its function is frequently misunderstood. Dopamine is not primarily released when a goal is achieved; it is released in anticipation of approaching a goal. Research by neuroscientist Wolfram Schultz shows that dopamine neurons fire most strongly when a reward is expected and being approached. This is why motivation tends to surge at the beginning of exam preparation (the goal is new and approaching) and again in the final days before the exam (proximity reactivates the approach signal). The dip in the middle of exam season — the "why bother" period — is the predictable consequence of neither novelty nor proximity being available to sustain the dopamine activation.</p>
      <p><strong>Self-determination theory and intrinsic motivation.</strong> Edward Deci and Richard Ryan's self-determination theory, developed over four decades at the University of Rochester, identifies three psychological needs whose satisfaction produces durable intrinsic motivation: autonomy (feeling that you are pursuing goals by genuine choice), competence (experiencing the growth and efficacy that comes from skill development), and relatedness (feeling connected to people and purposes that matter to you). When exam preparation satisfies these needs — when students study because they genuinely care about the subject or their future, when they experience regular evidence of learning, and when they feel supported rather than alone — motivation is significantly more sustainable than when exam preparation is purely externally pressured.</p>
      <p><strong>Implementation intentions and the action gap.</strong> Research by Peter Gollwitzer at New York University on implementation intentions — specific if-then plans that link situational cues to intended actions — shows that people who form specific plans of the form "When X happens, I will do Y" are significantly more likely to follow through on intentions than those who simply intend to do something. Applied to exam motivation: "I will study chemistry for 90 minutes every day after breakfast" is three times more likely to be followed than "I should study more chemistry." The specificity creates a trigger-response link that bypasses the moment-to-moment motivational decision that is vulnerable to low motivation states.</p>
      <p><strong>Motivation follows action more reliably than it precedes it.</strong> This is perhaps the most practically important finding in motivation science. Research by behaviourist B.J. Fogg and motivation researchers alike consistently shows that the feeling of motivation is more reliably produced by starting the action than by waiting until motivation arrives before starting. The student who waits to feel motivated before opening their books will wait far longer than the student who opens the books first and finds the motivation arriving within five to ten minutes of engaged work. Building habits that initiate the action without waiting for motivation produces more study hours across exam season than any motivational technique that operates on the pre-action feeling.</p>

      {/* ── Section 2 ── */}
      <h3 id="twelve">2. Twelve Realistic Exam Motivation Strategies</h3>

      <p><strong>1. Build the smallest possible daily study habit.</strong> A two-minute daily study habit — opening your notes, reading one page, completing one flashcard — sustained consistently across exam season produces more total output than sporadic large sessions. The habit is the anchor; the full session grows from it. The commitment is always only to the two minutes; the rest is momentum.</p>

      <p><strong>2. Connect today's study to a specific future you actually want.</strong> Not a vague better future — a specific one. What do you genuinely want to be doing in five years? Name it with detail. Write one sentence connecting today's study session to that specific picture. The connection does not need to be linear; it needs to be real. "Understanding this chemistry chapter is part of becoming someone who understands how things work at a molecular level" is a connection. "I am studying because I have to" is not.</p>

      <p><strong>3. Make your study environment do motivation work.</strong> Remove the phone from the room. Put your study materials out the night before. Sit in the same chair at the same time. Your environment can make starting easy or hard — and the ease or difficulty of starting is the primary variable in how much you study across a season. Design the environment for automatic starting rather than relying on daily motivational activation.</p>

      <p><strong>4. Track visible progress weekly.</strong> Make your preparation measurable enough to see movement. Not "I studied for six hours" — "I can now solve equilibrium problems I could not solve last week." The specific growth is what activates the competence-need that self-determination theory identifies as essential for intrinsic motivation. Vague studying produces vague evidence of progress; specific practice produces specific evidence of growth.</p>

      <p><strong>5. Plan for the bad days in advance.</strong> Decide now what your study minimum looks like on a difficult day — a day when motivation has collapsed, energy is low, or something has gone wrong. Ten minutes of flashcard review. Reading one page of notes. One practice question. Have the minimum defined before the bad day arrives, because deciding under low motivation produces either over-ambitious plans (that fail) or complete abandonment (that creates a guilt spiral). The pre-decided minimum is what keeps the habit alive through the difficult days without requiring motivation to choose it.</p>

      <p><strong>6. Celebrate small completions — genuinely.</strong> The neurological reward system responds to acknowledgment. When you complete your study session, mark it as done — physically, with a tick, a note, a small ritual. The brain's reward response to visible completion sustains motivation better than completing the same work without acknowledgment. This is not self-congratulation — it is the deliberate use of the brain's own reward mechanism.</p>

      <p><strong>7. Find the one interesting thread in every subject.</strong> In even the most difficult or uninspiring subject, there is a question or concept that is genuinely interesting. Find it, even if it is narrow. Begin sessions from that thread. Genuine interest, even in a small pocket of the material, sustains engagement through the less interesting material around it in a way that pure duty never can.</p>

      <p><strong>8. Use the identity shift.</strong> Research by BJ Fogg and James Clear (Atomic Habits) shows that behaviour change is most durable when it is connected to an identity rather than a goal. "I am trying to study more" is motivationally weaker than "I am a person who studies consistently every morning." The identity statement shifts the reference point from a desired behaviour to a known self — which is maintained not by motivation but by the desire for consistency with the self-concept.</p>

      <p><strong>9. Create a study-start ritual.</strong> A consistent two-minute ritual before each study session — the same music, the same drink preparation, the same desk arrangement — trains the brain to associate the ritual with the cognitive state of studying. After three weeks of consistent association, the ritual activates focus semi-automatically, significantly reducing the motivational friction of starting. The ritual is not the study — it is the reliable bridge to the study.</p>

      <p><strong>10. Practise what James Clear calls "never miss twice."</strong> Missing one study day is normal and recoverable. Missing two in a row begins to erode the habit architecture that makes study happen without daily motivation decisions. The "never miss twice" rule accepts that one miss is part of being human, while preventing the two-miss gap that typically becomes a longer absence. If you miss a day, the only commitment is: I will do something tomorrow, however small.</p>

      <p><strong>11. Share your preparation milestones with one trusted person.</strong> Public commitment — even to just one person — significantly increases follow-through. Tell someone: "This week I am planning to complete Chapter 4 and attempt ten past questions on it." Not as pressure — as a motivational structure. The knowledge that someone knows about your commitment is enough to provide the accountability that many students find more sustaining than self-commitment alone.</p>

      <p><strong>12. End each study day with tomorrow's first action written down.</strong> The motivational cost of not knowing where to start is high — it produces the decision paralysis that often leads to no starting at all. Writing tomorrow's specific first action tonight ("Tomorrow I will open my chemistry notes to Chapter 5 and do five minutes of active recall") eliminates this cost entirely. You wake up with a specific instruction rather than a blank decision space, and the specificity makes starting significantly more likely.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="engine">3. Interactive: The Motivation Engine</h3>
      <p>The Motivation Engine identifies your motivation type — what actually drives you when it works — and your most challenging motivation dip, then generates a personalised system: three strategies tailored to your drive type, a keystone daily habit, a goal-setting tip that matches how your motivation works, a dip recovery plan for your specific low-motivation pattern, and a mantra worth keeping for the whole exam season.</p>

      <MotivationEngine />

      {/* ── Section 4 ── */}
      <h3 id="goals">4. Goal-Setting That Actually Drives Exam Motivation</h3>
      <p>Goal-setting is one of the most researched areas of motivational psychology, and the findings on what distinguishes motivating goals from demotivating ones are clear and consistent. The most commonly used student goal — "do well in my exams" — violates almost every criterion for an effective motivational goal.</p>
      <p><strong>The WOOP framework.</strong> Research by psychologist Gabriele Oettingen at NYU identifies the WOOP framework (Wish, Outcome, Obstacle, Plan) as significantly more effective than positive visualisation alone. The steps: (1) Wish — name the specific goal you want to achieve; (2) Outcome — imagine the best possible outcome of achieving it in vivid, sensory detail; (3) Obstacle — identify the main internal obstacle that is most likely to prevent it (not an external obstacle — an internal one, like procrastination or anxiety); (4) Plan — form a specific if-then implementation intention for when the obstacle arises. Research shows that WOOP produces significantly better goal achievement than either positive thinking or obstacle-only thinking, because it combines motivational activation with realistic planning.</p>
      <p><strong>Process goals over outcome goals.</strong> For exam preparation specifically, process goals — "I will complete 30 Pomodoro sessions this week" or "I will do active recall on each chapter before moving to the next" — outperform outcome goals — "I will get 85% in my chemistry paper" — as motivational drivers for two reasons. Process goals are entirely within your control (you can always do the Pomodoros regardless of how hard the chapter is), and they provide daily completion points that activate the approach-dopamine rather than leaving it dormant until the distant exam result arrives.</p>
      <p><strong>Weekly micro-goals as the operational level.</strong> Monthly exam goals provide direction. Daily session plans provide immediate structure. The weekly micro-goal is the missing operational layer that most students lack: a specific, achievable capability target for the current week that connects the daily session to the monthly direction. "By Friday I will be able to explain the nitrogen cycle from memory and solve three related past questions correctly" is a weekly micro-goal. It is ambitious enough to drive effort and specific enough to allow completion.</p>
      <p><strong>Review and adjust goals — they are not commitments, they are estimates.</strong> One of the most demotivating experiences in exam preparation is falling behind a rigid goal and then spending energy feeling guilty about the gap rather than adjusting the goal. Goals made at the start of exam season are based on estimates that will turn out to be wrong. Building a weekly goal review — where the goal is adjusted based on what was actually accomplished — transforms goals from sources of guilt into navigational tools. The adjusted goal is not a failure; it is accurate planning.</p>

      {/* ── Section 5 ── */}
      <h3 id="habits">5. Habit-Building Methods for Sustained Study Motivation</h3>
      <p>Motivation is finite and variable. Habits are relatively automatic and consistent. The most sustainable exam preparation systems rely on habits to maintain study behaviour across low-motivation periods, reserving motivational energy for the moments when genuine decision-making is required. The following methods, drawn from BJ Fogg's Tiny Habits research and James Clear's Atomic Habits framework, are specifically applicable to exam season study habits.</p>
      <p><strong>The anchor habit.</strong> Every habit needs a cue — something that triggers the behaviour automatically. The most reliable cues are existing habits that already happen consistently. Attach your study session to an existing anchor: immediately after breakfast, immediately after arriving at your study space, immediately after a particular time signal. The formula is: "After I [existing anchor habit], I will [study habit start action]." The anchor does not have to be motivationally connected to study — it just needs to be reliable.</p>
      <p><strong>Start incredibly small.</strong> BJ Fogg's Tiny Habits research at Stanford shows that new habits are most durably formed when the initial version is too small to resist — a two-minute minimum rather than a two-hour session. The purpose is to make the habit automatic before making it large. Once the triggering, starting, and completing of a study session is habitual, the duration can be extended gradually. Trying to build a four-hour study habit from scratch fails because the motivational cost of starting is too high. Building a two-minute habit first, then extending it, works because the start becomes automatic before the duration is challenged.</p>
      <p><strong>The habit stack for exam preparation.</strong> Chain habits together in a specific sequence that builds the full study session automatically. An example stack: (1) Make tea — this is the physical anchor trigger; (2) Sit at the study desk — this is the environmental cue; (3) Open the notes to the pre-decided chapter — this is the minimal starting action; (4) Set a Pomodoro timer — this is the structure that contains the session. Each step triggers the next without requiring a motivational decision. By the time the timer starts, the study has begun automatically.</p>
      <p><strong>Reward immediately and specifically.</strong> Research on habit formation shows that the most effective rewards are immediate (within seconds of completing the target behaviour) and specific (a defined pleasure, not a vague intention to rest). Building in a specific, immediate reward for each study session completion — a particular drink, a specific activity, brief social contact — reinforces the habit loop more effectively than relying on the distant reward of exam results.</p>
      <p><strong>Track the streak visibly.</strong> A habit tracker — even just a simple calendar where you mark each day's study completion — provides a visual record of the building streak that becomes its own motivational input. Research on streaks shows that once a streak reaches seven or more days, the motivation not to break it becomes significant. "I have studied every day for twelve days" is a motivationally live consideration in a way that "I should study today" is not.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Exam Motivation FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I start motivated but always lose steam halfway through exam season. What specifically helps?</strong><br />
        A: The mid-season dip you are describing is the predictable dopamine-motivation pattern — novelty has faded and proximity has not yet arrived. The most effective specific interventions are: introducing variety in study method or environment (novelty is a direct dopamine activator), deliberately bringing the goal closer by focusing on a specific exam that is approaching rather than the full season, and increasing the frequency of visible progress markers (weekly testing rather than monthly). The key is not summoning motivation from nothing — it is providing the conditions (novelty, proximity, progress) that dopamine requires to maintain activation.</p>

        <p><strong>Q: My motivation is completely dependent on results — a good mark energises me but a bad one destroys my momentum for days. How do I stabilise this?</strong><br />
        A: This is the result-dependent motivation pattern, and it is very common and very fragile — because results are variable and often delayed. The structural fix is shifting your primary motivation anchor from results (which you do not control and receive infrequently) to process (which you control daily). Build a system where the satisfaction of completing your daily study plan is itself the primary motivational reward — the result is the long-term consequence, not the daily fuel. This shift does not happen instantly — it requires deliberately practising noticing and rewarding process completion while treating results as information rather than verdicts.</p>

        <p><strong>Q: My parents think I am lazy when I take breaks. How do I explain that rest is part of staying motivated?</strong><br />
        A: The framing that usually lands most effectively with parents who equate rest with laziness is cognitive science rather than wellbeing: the brain's memory consolidation and motivation-sustaining mechanisms require genuine rest to function. A student who rests adequately produces more learning output per total hour of study time than one who studies continuously at diminishing intensity. The argument is not "I need rest for my happiness" — it is "I study more effectively across the week when I include recovery time." If possible, point to the research on attention, cortisol, and working memory restoration — the case is empirically strong and does not rely on the rest being pleasant, only on it being functionally necessary.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: AMBER, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You will not feel motivated every day of exam season. The students who succeed are not the ones who do — they are the ones who kept going on the days they did not."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Motivation is weather — it changes. Systems, habits, and goals are infrastructure — they remain. Build the infrastructure before the exam season begins, maintain it when the weather is good, and rely on it when the weather is not. That is the whole practice of exam season motivation. Not inspiration. Infrastructure.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: AMBER, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${ABORD}` }}
          >
            Use Mind Space to Stay on Track →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: AMBER, border: `2px solid ${AMBER}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What Keeps You Going
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More Exam Season Support:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/study-smart-techniques',          '→ Study Smart: Techniques to Reduce Academic Stress'],
            ['/blog/stay-calm-during-exams',          '→ How to Stay Calm and Confident During Exams'],
            ['/blog/academic-burnout-signs',          '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/balance-studies-mental-health',   '→ How to Balance Studies and Mental Health Effectively'],
            ['/blog/study-plan-reduce-stress',        '→ How to Create a Study Plan That Reduces Stress'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
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
