import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build a Strong Relationship with Yourself",
  excerpt: "The relationship you have with yourself is the longest, most consequential relationship of your life — and for most people, it is also the most neglected. Learn what a genuine relationship with yourself actually requires, the daily habits that build it, and use our Self-Relationship Portrait to discover exactly where yours needs the most attention.",
  category: "Mental Health",
  date: "25-02-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/February/relationship-with-yourself.jpg",
  tldr: "A strong relationship with yourself is not a feeling — it is a practice. It is built through the same qualities that build any healthy relationship: honesty, consistency, care, and repair. This guide covers the four pillars of a healthy self-relationship, the science behind why it matters, five daily habits that build it from scratch, and includes a Self-Relationship Portrait — an interactive reflection tool that shows you exactly where your relationship with yourself is thriving and where it needs repair.",
  toc: [
    { id: "what-it-means",  title: "1. What a Relationship with Yourself Actually Means",               level: 3 },
    { id: "science",        title: "2. The Science: Why This Relationship Determines Everything Else",   level: 3 },
    { id: "portrait",       title: "3. Interactive: Your Self-Relationship Portrait",                    level: 3 },
    { id: "habits",         title: "4. Five Daily Habits That Build a Stronger Self-Relationship",       level: 3 },
    { id: "reflection",     title: "5. Reflection Exercises: Going Deeper With Yourself",               level: 3 },
    { id: "faq",            title: "6. Relationship with Yourself FAQs",                                level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-25T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "relationship with yourself, how to build a relationship with yourself, self-relationship, knowing yourself, self-connection, self-awareness habits, relationship with yourself tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you build a better relationship with yourself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Building a better relationship with yourself requires the same elements as building any healthy relationship: honesty (seeing yourself clearly without distortion in either direction), consistency (showing up for yourself in small repeated ways rather than occasional grand gestures), care (meeting your own needs with the same attentiveness you would give someone you love), and repair (addressing the moments when you fail yourself — through harsh self-talk, broken self-commitments, or self-neglect — and choosing differently). The starting point is not dramatic change. It is noticing, with genuine curiosity rather than judgement, who you actually are right now.",
      },
    },
    {
      "@type": "Question",
      "name": "What does it mean to have a relationship with yourself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Having a relationship with yourself means treating your inner life — your emotions, your needs, your values, your aspirations — as real and worth attending to, rather than as background noise to be managed around your external responsibilities. It means knowing your own preferences well enough to act on them, trusting your own perceptions rather than perpetually deferring to others', speaking to yourself with a tone that reflects care rather than contempt, and developing enough self-knowledge that you are not surprised by your own patterns.",
      },
    },
    {
      "@type": "Question",
      "name": "Why is the relationship with yourself so important?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The relationship you have with yourself sets the template for every other relationship in your life. Research by psychologist John Cacioppo shows that people who have a secure, honest, caring relationship with themselves are significantly more capable of genuine intimacy with others — because they do not need relationships to fill voids they have not addressed internally. They choose connections from a place of fullness rather than scarcity. They are less dependent on external validation, more resilient after rejection, and more able to hold their own perspective in the presence of others' strong feelings.",
      },
    },
  ],
};

// ── Self-Relationship Portrait Data ───────────────────────────────────────────
const OCEAN   = '#2D6A8F';
const OPALE   = '#EEF5FA';
const OBORDER = 'rgba(45,106,143,0.22)';

const PORTRAIT_DIMENSIONS = [
  {
    id:    'self_knowledge',
    icon:  '🔭',
    label: 'Self-Knowledge',
    desc:  'How well you actually know yourself — your values, patterns, needs, and triggers',
    questions: [
      'I know what I genuinely value — not what I think I should value, but what actually guides my decisions.',
      'I can identify my emotional triggers accurately and understand why they affect me the way they do.',
      'I know my recurring patterns well enough to anticipate when they are likely to show up.',
    ],
    low_note: 'Low self-knowledge means you are frequently surprised by your own reactions, unsure of what you actually want, and vulnerable to being shaped by others\' expectations because you have not yet formed a clear picture of your own. Self-knowledge is not navel-gazing — it is the foundation of every other skill.',
    reflection: 'Write for ten minutes on this prompt without editing yourself: "The person I am when nobody is watching, when there is no performance required and no expectations to meet, is someone who ___." Let the answer be specific and honest.',
    habit: 'Keep a brief daily log — just two sentences — noting one emotion you felt today and what you think produced it. After two weeks, read it back. Patterns you could not see day-to-day will become visible across the log.',
    icon_h: '📓',
  },
  {
    id:    'self_trust',
    icon:  '🤝',
    label: 'Self-Trust',
    desc:  'Whether you reliably follow through on commitments to yourself and trust your own perceptions',
    questions: [
      'When I tell myself I will do something, I generally follow through — even when no one else will know if I do not.',
      'I trust my own perceptions and instincts rather than automatically deferring to what others think about my experience.',
      'I keep the small self-commitments — the ones that nobody else tracks — as seriously as I keep commitments to others.',
    ],
    low_note: 'Self-trust is built through one thing: doing what you said you would do, for yourself, when nobody is watching. Every broken self-commitment — however small — sends the message that you cannot rely on yourself. And an internal relationship with someone you cannot rely on produces chronic anxiety, not security.',
    reflection: 'Write down three commitments you have made to yourself in the last month that you did not keep. For each one, write one sentence about why it did not happen. Then write what one small version of that commitment would look like — one small enough that you cannot reasonably fail it. Make that your commitment for this week.',
    habit: 'Choose one micro-commitment for this week — something that takes less than five minutes, that you will do every day, and that belongs entirely to you. Not for productivity. Not for anyone else. Just to accumulate evidence that you show up for yourself.',
    icon_h: '⚡',
  },
  {
    id:    'self_talk',
    icon:  '💬',
    label: 'Inner Voice Quality',
    desc:  'The tone and content of how you speak to yourself — especially when things go wrong',
    questions: [
      'My inner voice is generally as patient and kind as the voice I use with people I genuinely care about.',
      'When I make a mistake, my first internal response helps me understand and improve rather than punish.',
      'I am able to notice harsh self-talk when it happens and consciously choose a different response.',
    ],
    low_note: 'The quality of your inner voice is arguably the most important single dimension of your self-relationship. Research by Ethan Kross at Michigan shows that the inner voice activates the brain\'s threat response when harsh — producing the same physiological stress as external danger. You are, quite literally, stressing your own nervous system with the way you speak to yourself.',
    reflection: 'For one day, track every self-critical thought you have by writing it down as it occurs. At the end of the day, read the list. Most people are genuinely shocked by the volume and harshness of their inner commentary. Now write the compassionate version of each thought — what you would say to a close friend who had done or experienced the same thing.',
    habit: 'The name-switch exercise: when you catch yourself in harsh self-talk, try replacing "I" with your own name — "Priya is struggling with this" instead of "I am such an idiot." Research by Kross shows this shift from first person to third produces measurable reduction in emotional reactivity and enables more self-compassionate responses.',
    icon_h: '🗣️',
  },
  {
    id:    'self_care',
    icon:  '🌿',
    label: 'Self-Care Consistency',
    desc:  'How reliably you meet your own basic physical and emotional needs',
    questions: [
      'I meet my own physical needs — sleep, food, rest, movement — with genuine consistency rather than chronic neglect.',
      'I have at least one regular practice that is purely for my own replenishment, not for productivity or social benefit.',
      'I allow myself genuine rest without guilt — not just exhaustion so severe that rest becomes unavoidable.',
    ],
    low_note: 'Chronic self-neglect is not discipline — it is the accumulated cost of treating your own needs as the last item on a list that never gets short enough to reach them. The relationship you have with your own physical and emotional maintenance communicates, continuously, how much you believe you matter. Neglect communicates one thing. Consistent care communicates another.',
    reflection: 'Write your ideal day — not the most productive version, but the one that would leave you feeling genuinely good. Now write your actual typical day. The gap between the two is not evidence of failure — it is a map of where your self-care relationship needs the most attention. Choose one element from the ideal version and add it to this week.',
    habit: 'Build one "anchor habit" — a small, non-negotiable daily act of self-care that takes less than ten minutes. Not a morning routine. One thing. Done every day, as a signal to yourself that you are worth a consistent, small investment of your own time and attention.',
    icon_h: '🌙',
  },
  {
    id:    'self_forgiveness',
    icon:  '🕊️',
    label: 'Self-Forgiveness',
    desc:  'Your ability to take accountability for mistakes without extended self-punishment',
    questions: [
      'When I do something I regret, I process it, take responsibility, and genuinely move forward — without replaying it for weeks.',
      'I do not define myself primarily through my worst moments or biggest failures.',
      'I am able to distinguish between taking something seriously and punishing myself for it — and I choose the former.',
    ],
    low_note: 'Prolonged self-punishment is not conscientiousness — it is the cost of an inner critic that has not learned the difference between accountability and cruelty. You cannot simultaneously punish yourself and build something better. Self-forgiveness is not excusing poor behaviour. It is the release of the punishing chapter once accountability has been genuinely done.',
    reflection: 'Write a letter of forgiveness to yourself — addressed to you, from you — for one thing you have been holding against yourself for longer than it deserved. Not to excuse it. To formally close the prosecution. Write what you learned, what you have changed, and what you are choosing to release. Seal it. Read it once.',
    habit: 'The "prosecutor\'s case" test: when you notice extended self-punishment about something, ask: "Have I acknowledged what happened, understood why, and changed what I can change?" If yes — the case is closed. The ongoing suffering is not adding information or preventing recurrence. It is serving no one.',
    icon_h: '✍️',
  },
];

const DEPTH_LEVELS = [
  { key: 'stranger',  icon: '🌫️', label: 'Like a stranger — I barely know myself honestly' },
  { key: 'acquaint',  icon: '🤝', label: 'Like an acquaintance — surface-level, polite, no depth' },
  { key: 'friend',    icon: '💛', label: 'Like a friend — genuine care but still significant blind spots' },
  { key: 'close',     icon: '💚', label: 'Like a close friend — honest, caring, mostly secure' },
];

const DEPTH_BRIDGE = {
  stranger:  'You are at the beginning — which is a more courageous place to start than you might realise. Acknowledging that you do not know yourself well is itself a form of self-honesty. The portrait below is designed exactly for this starting point.',
  acquaint:  'You have some self-awareness but the relationship is still somewhat managed — kept at a distance where it stays comfortable. The portrait will show you where to go deeper, specifically.',
  friend:    'You have a real relationship here, with genuine warmth and care. The blind spots that remain are worth examining not because they undermine what exists, but because addressing them will significantly strengthen what is already good.',
  close:     'You are operating from a relatively secure self-relationship. The growth at this stage is usually about depth and specificity — going further in the areas where you are already present, rather than building from scratch.',
};

const RATING_OPTS = [
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
  if (pct >= 0.75) return { label: 'Flourishing',   color: '#2D7D46', bg: '#E8F5EE', icon: '💚' };
  if (pct >= 0.5)  return { label: 'Developing',    color: '#C07800', bg: '#FFF8E1', icon: '🌤️' };
  return              { label: 'Needs Attention', color: '#C0392B', bg: '#FDECEA', icon: '🔴' };
}

// ── Portrait Component ─────────────────────────────────────────────────────────
function SelfRelationshipPortrait() {
  const [step,       setStep]       = useState(1);
  const [depthKey,   setDepthKey]   = useState(null);
  const [answers,    setAnswers]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [openDim,    setOpenDim]    = useState(null);
  const [openPlan,   setOpenPlan]   = useState(null);
  const [openReflect, setOpenReflect] = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const totalQ   = PORTRAIT_DIMENSIONS.reduce((t, d) => t + d.questions.length, 0);
  const answered = PORTRAIT_DIMENSIONS.reduce((t, d) =>
    t + d.questions.filter((_, qi) => answers[`${d.id}_${qi}`]).length, 0);
  const allDone  = answered === totalQ && !!depthKey;
  const progress = Math.round((answered / totalQ) * 100);

  const scores   = PORTRAIT_DIMENSIONS.map(d => ({ dim: d, score: getDimScore(answers, d) }));
  const sorted   = [...scores.filter(s => s.score !== null)].sort((a, b) => a.score - b.score);
  const totalScore   = scores.reduce((t, s) => t + (s.score || 0), 0);
  const maxPossible  = totalQ * 4;
  const overallPct   = submitted ? Math.round((totalScore / maxPossible) * 100) : 0;

  const handleReset = () => { setStep(1); setDepthKey(null); setAnswers({}); setSubmitted(false); setOpenDim(null); setOpenPlan(null); setOpenReflect(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? OCEAN : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — depth level + dimension ratings */}
      {!submitted && (
        <>
          {/* Depth question */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
              To start — how would you describe your current relationship with yourself?
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Be honest rather than aspirational — there is no wrong answer and it will shape your portrait.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {DEPTH_LEVELS.map(d => {
                const isSel = depthKey === d.key;
                return (
                  <button key={d.key} onClick={() => setDepthKey(d.key)} style={{
                    padding: '12px 16px', borderRadius: '11px', border: '2px solid',
                    borderColor: isSel ? OCEAN : 'var(--border)', background: isSel ? OPALE : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: isSel ? `0 0 0 2px ${OBORDER}` : 'none',
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{d.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? OCEAN : 'var(--ink)' }}>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
                Now rate yourself across five dimensions
              </p>
              <span style={{ fontSize: '12px', fontWeight: '700', color: OCEAN }}>{progress}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(45,106,143,0.12)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${OCEAN}, #4A8FB5)`, borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>Rate each statement — Rarely / Sometimes / Often / Almost Always — based on the past two weeks.</p>
          </div>

          {PORTRAIT_DIMENSIONS.map(dim => {
            const dimDone = dim.questions.every((_, qi) => answers[`${dim.id}_${qi}`]);
            const isOpen  = openDim === dim.id;
            return (
              <div key={dim.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '10px', border: '2px solid', borderColor: dimDone ? OCEAN : 'var(--border)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setOpenDim(isOpen ? null : dim.id)} style={{ width: '100%', padding: '15px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{dim.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{dim.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{dim.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {dimDone && <span style={{ background: OCEAN, color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</span>}
                    <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)' }}>
                    {dim.questions.map((q, qi) => {
                      const key = `${dim.id}_${qi}`;
                      return (
                        <div key={qi} style={{ paddingTop: '16px' }}>
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '500', color: 'var(--ink)', lineHeight: 1.55 }}>{q}</p>
                          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                            {RATING_OPTS.map(opt => {
                              const isSel = answers[key] === opt.value;
                              return (
                                <button key={opt.value} onClick={() => setAnswers(p => ({ ...p, [key]: opt.value }))} style={{
                                  padding: '7px 13px', borderRadius: '50px', fontSize: '13px', fontWeight: '600',
                                  border: '2px solid', fontFamily: font, cursor: 'pointer', transition: 'all 0.15s',
                                  borderColor: isSel ? OCEAN : 'var(--border)',
                                  background: isSel ? OCEAN : 'white',
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

          <button onClick={() => { if (allDone) { setStep(2); setSubmitted(true); } }} disabled={!allDone} style={{
            width: '100%', padding: '15px', borderRadius: '10px', border: 'none', marginTop: '6px',
            background: allDone ? `linear-gradient(135deg, ${OCEAN}, #4A8FB5)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: font,
            cursor: allDone ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
            boxShadow: allDone ? `0 6px 20px ${OBORDER}` : 'none',
          }}>
            {!depthKey ? 'Choose your depth level above to continue' : !allDone ? `Open each dimension and answer all ${totalQ - answered} remaining statements` : 'Reveal My Self-Relationship Portrait →'}
          </button>
        </>
      )}

      {/* STEP 2 — results portrait */}
      {submitted && (
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Overall */}
          <div style={{ background: `linear-gradient(135deg, ${OCEAN}, #4A8FB5)`, borderRadius: '14px', padding: '26px 22px', marginBottom: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {overallPct >= 75 ? '🌳' : overallPct >= 50 ? '🌱' : '🪴'}
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              Self-Relationship Portrait: {overallPct}%
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
              {overallPct >= 75 ? 'Your self-relationship is well-developed. The work now is deepening and maintaining what you have built.' : overallPct >= 50 ? 'You have real strengths here alongside clear gaps. The gaps are not failures — they are the most useful next steps.' : 'Your relationship with yourself is at an early stage. This is not a problem — it is a starting point. And starting points are where the most meaningful growth begins.'}
            </div>
          </div>

          {/* Starting depth context */}
          {depthKey && (
            <div style={{ background: 'white', border: `1.5px solid ${OBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: OCEAN, marginBottom: '7px' }}>
                {DEPTH_LEVELS.find(d => d.key === depthKey)?.icon} You Described This Relationship As
              </div>
              <p style={{ margin: '0 0 7px 0', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>
                {DEPTH_LEVELS.find(d => d.key === depthKey)?.label}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{DEPTH_BRIDGE[depthKey]}</p>
            </div>
          )}

          {/* Dimension bars */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${OBORDER}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
              Your Portrait Across Five Dimensions
            </div>
            {scores.map(({ dim, score }) => {
              if (score === null) return null;
              const tier = getDimTier(score, dim.questions.length * 4);
              const pct  = Math.round((score / (dim.questions.length * 4)) * 100);
              return (
                <div key={dim.id} style={{ marginBottom: '13px' }}>
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

          {/* Priority areas — bottom 2, expandable */}
          <div style={{ background: OPALE, border: `2px solid ${OBORDER}`, borderRadius: '14px', padding: '18px 20px', marginBottom: '14px' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: OCEAN }}>
              🌱 Your Priority Self-Relationship Areas
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              These two dimensions scored lowest and will produce the greatest return if you focus your attention here over the next month.
            </p>
            {sorted.slice(0, 2).map(({ dim }) => {
              const score   = getDimScore(answers, dim);
              const tier    = getDimTier(score, dim.questions.length * 4);
              const isPlanOpen = openPlan === dim.id;
              const isRefOpen  = openReflect === dim.id;
              return (
                <div key={dim.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '10px', overflow: 'hidden', border: `1.5px solid ${OBORDER}`, borderLeft: `4px solid ${OCEAN}` }}>
                  <div style={{ padding: '14px 16px 10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '20px' }}>{dim.icon}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: OCEAN }}>{dim.label}</div>
                        <div style={{ fontSize: '11px', color: tier.color, fontWeight: '700' }}>{tier.icon} {tier.label}</div>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>{dim.low_note}</p>

                    {/* Habit accordion */}
                    <button onClick={() => setOpenPlan(isPlanOpen ? null : dim.id)} style={{ width: '100%', padding: '10px 14px', background: OPALE, border: `1px solid ${OBORDER}`, borderRadius: '9px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, marginBottom: '7px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: OCEAN }}>{dim.icon_h} Daily Habit for This Dimension</span>
                      <span style={{ color: OCEAN, fontSize: '13px' }}>{isPlanOpen ? '▲' : '▼'}</span>
                    </button>
                    {isPlanOpen && (
                      <div style={{ padding: '12px 14px', background: OPALE, borderRadius: '9px', marginBottom: '7px', border: `1px solid ${OBORDER}`, animation: 'floatUp 0.25s ease' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{dim.habit}</p>
                      </div>
                    )}

                    {/* Reflection accordion */}
                    <button onClick={() => setOpenReflect(isRefOpen ? null : dim.id)} style={{ width: '100%', padding: '10px 14px', background: 'white', border: `1px solid ${OBORDER}`, borderRadius: '9px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: OCEAN }}>🪞 Reflection Exercise</span>
                      <span style={{ color: OCEAN, fontSize: '13px' }}>{isRefOpen ? '▲' : '▼'}</span>
                    </button>
                    {isRefOpen && (
                      <div style={{ padding: '12px 14px', background: 'white', borderRadius: '9px', border: `1px solid ${OBORDER}`, animation: 'floatUp 0.25s ease', marginTop: '7px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{dim.reflection}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Portrait statement */}
          <div style={{ background: 'white', border: `1.5px dashed ${OBORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: OCEAN, marginBottom: '8px' }}>
              ✨ Your Portrait Statement
            </div>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: OCEAN, fontStyle: 'italic', lineHeight: 1.6 }}>
              {overallPct >= 75
                ? '"You know yourself with enough depth and honesty that you can show up fully — in your own life and in the lives of others."'
                : overallPct >= 50
                ? '"You are becoming yourself — genuinely, imperfectly, with real progress visible in the specifics. The gaps are not failures. They are the next chapter."'
                : '"The relationship with yourself is the most worthwhile one you will ever build. You are at the beginning of something that will change everything else."'}
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${OBORDER}`, color: OCEAN,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retake the Portrait</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RelationshipWithYourself({ navigate, relatedPosts }) {
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
      <p>Of all the relationships in your life — with family, with friends, with romantic partners, with classmates — the longest, most consequential, most consistently influential one is the one you have with yourself. It is also, for most people, the one that receives the least deliberate attention.</p>

      <p>The idea of building a <strong>relationship with yourself</strong> is sometimes dismissed as self-indulgent — a luxury concern for people who have resolved everything more important. But the psychological evidence says exactly the opposite: the quality of your self-relationship is the upstream variable that determines the quality of everything downstream, including your ability to study effectively, to form genuine connections, to navigate difficulty without collapsing, and to build a life that feels coherently yours rather than assembled from other people's expectations.</p>

      <img
        src={meta.imgUrl}
        alt="Student building a stronger relationship with themselves through self-awareness, daily habits, and honest self-reflection"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-it-means">1. What a Relationship with Yourself Actually Means</h3>
      <p>When psychologists and therapists use the phrase "relationship with yourself," they are pointing to something specific and measurable — not a vague aspiration toward self-love, but a set of actual, observable qualities in how you relate to your own inner life. Think about what makes any relationship healthy: honesty, consistency, care, and repair. The relationship with yourself requires every one of these — applied inward.</p>
      <p><strong>Honesty with yourself</strong> means seeing yourself clearly — neither through the distorting lens of self-criticism (which makes you smaller and worse than you are) nor through the distorting lens of self-protection (which makes you better and safer than you are). It means being able to acknowledge your actual motivations, your real needs, your genuine reactions, and your honest assessment of how you are doing — without the assessment becoming either an indictment or a performance.</p>
      <p><strong>Consistency with yourself</strong> means showing up for your own wellbeing with the same reliability you bring to your external commitments. Most people are far more consistent in keeping promises to others than promises to themselves. They would not cancel a commitment to a friend the way they cancel a commitment to exercise, or rest, or creative practice. This asymmetry — treating external obligations as non-negotiable and internal ones as optional — is one of the clearest indicators of a self-relationship that has been deprioritised.</p>
      <p><strong>Care for yourself</strong> means meeting your own needs — physical, emotional, intellectual, creative — with genuine attentiveness rather than minimal compliance. It means asking "what do I actually need right now?" with the same curiosity and investment you would bring to asking it about someone you love, and then taking the answer seriously enough to act on it.</p>
      <p><strong>Repair with yourself</strong> is perhaps the least discussed and most important element. Every relationship has ruptures — moments of failure, disappointment, or harm. In a relationship with another person, repair requires acknowledgment, accountability, and recommitment. In the relationship with yourself, repair looks like noticing when you have broken faith with yourself — through harsh self-talk, through abandoning your own needs, through betraying your values — and choosing deliberately to respond differently, rather than adding punishment to the original failure.</p>

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Science: Why This Relationship Determines Everything Else</h3>
      <p>The psychological case for investing in the self-relationship is not philosophical — it is empirical and quite strong. Research across multiple disciplines converges on the same finding: the quality of your internal self-relationship is the strongest single predictor of your external relationship quality, your emotional resilience, and your capacity for sustained wellbeing.</p>
      <p>Attachment theory — which describes how the quality of early relational experiences shapes adult relationship patterns — identifies something called the "internal working model": the implicit mental template a person carries about whether they are worthy of love, whether others are reliable, and whether relationships are safe. This internal working model is not fixed in childhood. Research by Mary Main at Berkeley demonstrated that adults can develop what she called "earned secure attachment" — a revised internal working model built through reflection, therapy, and the deliberate cultivation of self-awareness. In other words, the relationship you build with yourself can update the template that shapes all your other relationships.</p>
      <p>Neuroscientist Antonio Damasio's research on the relationship between self-awareness and decision-making adds another dimension: people with clearer, more developed self-knowledge make better decisions — not because they are smarter, but because they have access to more accurate information about their own values, needs, and likely responses. Self-knowledge is not self-indulgence. It is the intelligence that informs every other kind of intelligence you bring to your life.</p>
      <p>Psychologist Tasha Eurich's research at the intersection of self-awareness and leadership is particularly striking: only 10-15% of people who believe they are self-aware actually meet the external criteria for genuine self-awareness — accurate, honest, non-defensive perception of one's own values, patterns, reactions, and impact on others. This gap between perceived and actual self-knowledge is not a character failing. It is the predictable consequence of a culture that does not prioritise the relationship with oneself as a serious, ongoing practice.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="portrait">3. Interactive: Your Self-Relationship Portrait</h3>
      <p>A portrait is an honest representation — not idealised, not harshly critical, but accurate. Your Self-Relationship Portrait assesses five dimensions of the self-relationship that research identifies as most predictive of overall psychological wellbeing: self-knowledge, self-trust, inner voice quality, self-care consistency, and self-forgiveness. Rate each dimension honestly, and you will receive a full portrait of where your relationship with yourself is flourishing and where it needs the most attention — with personalised daily habits and reflection exercises for your priority areas.</p>

      <SelfRelationshipPortrait />

      {/* ── Section 4 ── */}
      <h3 id="habits">4. Five Daily Habits That Build a Stronger Self-Relationship</h3>
      <p><strong>1. The daily two-sentence emotion log.</strong> Each evening — not in the morning, when you are oriented outward, but in the evening, when you can reflect — write two sentences: one emotion you felt today, and what you think produced it. Not a journal. Not a detailed processing session. Two sentences. The purpose is not catharsis but calibration — gradually building the habit of noticing your own emotional life with enough regularity that you stop being surprised by it. After two weeks of consistent logging, read back through the entries. Patterns that were invisible day-to-day become obvious across the span of a fortnight.</p>
      <p><strong>2. The micro-commitment practice.</strong> Choose one small commitment — not to productivity, not to achievement, but to yourself — and keep it every day for thirty days. It should take under ten minutes, it should be genuinely yours (not something you think you should want), and it should have no external accountability attached. The practice is not about the specific habit. It is about the accumulation of evidence that you show up for yourself — which is what self-trust is built from, one kept commitment at a time.</p>
      <p><strong>3. The morning check-in before the world checks in.</strong> Before you open your phone, before you engage with any external demand, spend three minutes — literally three — asking yourself three questions: How do I actually feel right now? What do I most need today? What is one thing I can do today that is genuinely for me? The answers do not need to be profound. The practice is in the asking — in making contact with your own inner state before it is overwritten by everyone else's agenda for the day.</p>
      <p><strong>4. The "best friend filter" for self-talk.</strong> When you notice your inner voice being harsh — a self-critical thought, an unkind assessment, a catastrophic prediction about yourself — run it through the best friend filter: "Would I say this to someone I love in this situation?" Almost always the answer is no. The follow-up is not to replace the harsh thought with a falsely positive one but to rephrase it as you would for that friend: accurate, honest, and kind. This practice does not silence the inner critic. It gradually recalibrates its tone from contemptuous to useful.</p>
      <p><strong>5. The weekly "what did I actually want?" review.</strong> Once a week — Sunday evening works well for most people — spend five minutes reviewing your week not for what you achieved but for what you genuinely wanted and whether you gave yourself any of it. Not wants filtered through what is reasonable or what others would approve — actual preferences, desires, and needs. The question is not "did I perform well this week?" It is "did I live in a way that reflected, even partially, what I actually value?" The gap between these two questions is often where the self-relationship's most important work lives.</p>

      {/* ── Section 5 ── */}
      <h3 id="reflection">5. Reflection Exercises: Going Deeper With Yourself</h3>
      <p>Habits build the daily infrastructure of a self-relationship. Reflection exercises go deeper — they address the things that do not surface in two-sentence logs or three-minute morning check-ins. These five exercises are designed for uninterrupted time alone, a notebook, and genuine willingness to encounter something honest.</p>
      <p><strong>The values archaeology exercise.</strong> Write down the ten things you spend the most time and energy on in a typical week. Then separately write down the ten things you would say matter most to you. Compare the two lists. The gap between them — between what you are actually living for and what you say you care about — is your values archaeology: the excavation of the values that are actually governing your life versus the ones you aspire to. The exercise does not require dramatic change. It requires honest seeing.</p>
      <p><strong>The inner child letter.</strong> Write a letter from your current self to the version of you at ten years old. What do you want them to know? What do you wish someone had told you then? What patterns that are still showing up in your life began in that period? This exercise is not therapy — and if significant trauma is present, it should be done with therapeutic support. For most people, it is a remarkably direct route to understanding the origins of patterns that feel inexplicable in the present.</p>
      <p><strong>The regret inventory.</strong> Write down your five most persistent regrets — not the small ones, the ones that still have emotional charge when you encounter them. For each one, write: what you were genuinely afraid of at the time, what you actually lost, and what you learned that you could not have learned any other way. The purpose of the regret inventory is not to wallow — it is to complete the processing of experiences that remain unfinished, because unfinished experiences continue to occupy cognitive and emotional resources indefinitely.</p>
      <p><strong>The "what am I avoiding?" exercise.</strong> Without judgement, make a list of the things you have been consistently avoiding — in your work, your relationships, your inner life, your body. Avoidance is always the most informative data point about where your deepest fears and most significant unmet needs live. The list is not an indictment. It is a map.</p>
      <p><strong>The future self conversation.</strong> Write a letter from your future self — ten years from now — to the version of you reading this today. What do you know in that future that you cannot see now? What are you glad you chose to do? What do you wish you had been kinder to yourself about? What would you have started earlier? This exercise consistently produces remarkable clarity about what matters — because the future self has access to the long view that the present self, embedded in immediate anxiety and daily noise, cannot always reach.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Relationship with Yourself FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I do not know where to start — what is the single most important first step?</strong><br />
        A: The most important first step is not a practice or a habit — it is a decision about how you are going to speak to yourself. Everything else is downstream of the inner voice. If you change nothing else, begin applying the best friend filter to your self-talk: before any self-critical thought is allowed to stand unchallenged, ask whether you would say it to someone you genuinely love. If the answer is no — and it almost always is — rephrase it. This single practice, done consistently, shifts the foundational tone of the self-relationship from which all other practices become possible.</p>

        <p><strong>Q: Is it possible to have a strong relationship with yourself and still struggle with loneliness or wanting more connection?</strong><br />
        A: Yes, completely. A strong self-relationship does not replace the need for external connection — it changes the quality and the motivation of the connection you seek. People with well-developed self-relationships are typically lonelier in groups that do not allow them to be genuine, and less lonely in solitude, because solitude is a different quality of experience when the company of yourself is not something to be endured. The longing for connection is human and legitimate. A strong self-relationship means you seek connection from fullness rather than desperation — which produces genuinely better connections.</p>

        <p><strong>Q: How do I build a relationship with myself when I genuinely do not like who I am?</strong><br />
        A: This is the most important version of the question — and the one most people with the most pressing need to ask it are most afraid to. The answer is that self-acceptance is not the starting point. It is the destination. The starting point is honest curiosity rather than harsh judgement: "Who am I actually, and how did I come to be this way?" approached with the same non-judgemental interest you would bring to understanding any complicated person you were trying to genuinely know. The relationship with yourself, like any relationship, begins with genuine interest — not approval, not affection, just the decision to actually pay attention.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: OCEAN, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "To know yourself is the beginning of all wisdom."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Aristotle</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          The relationship you build with yourself is not a side project alongside the real work of your life. It is the real work. Everything you hope to become, every connection you want to build, every version of your future you are working toward — it runs through the quality of the attention, honesty, and care you are willing to bring to the person who will be there for all of it. Start there. The rest follows.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: OCEAN, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${OBORDER}` }}
          >
            Start Your Journey in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: OCEAN, border: `2px solid ${OCEAN}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Continue Your Self-Discovery:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/self-kindness-check',         '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/blog/self-acceptance-confidence',  '→ How to Build Confidence Through Self-Acceptance'],
            ['/blog/self-respect-vs-ego',         '→ Self-Respect vs Ego: Understanding the Real Difference'],
            ['/blog/emotional-boundaries',        '→ Emotional Boundaries: What They Are and How to Set Them'],
            ['/blog/valentines-self-love',        '→ Valentine\'s Day Self-Love Guide: Love Yourself First'],
            ['/safe',                             '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: OCEAN, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>{label}</button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
