import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mid-Month Reset: Are You Treating Yourself with Kindness?",
  excerpt: "Halfway through the month is the perfect moment to pause and ask an honest question: have you been as kind to yourself as you have been to everyone else? A self-kindness check-in, the science of self-talk, and a personalised reset plan for the second half of February.",
  category: "Mental Health",
  date: "15-02-2026",
  readTime: "6 min read",
  wordCount: 1000,
  imgUrl: "/blogss/2026/February/self-kindness-check.jpg",
  tldr: "Most people track their productivity, their diet, and their finances — but almost nobody audits how they have been speaking to themselves. This mid-month reset asks you to pause, check six key areas of self-kindness, and walk away with a concrete plan for the fourteen days ahead.",
  toc: [
    { id: "what-is-kindness",   title: "1. What Self-Kindness Actually Looks Like in Practice",         level: 3 },
    { id: "self-talk",          title: "2. The Self-Talk Problem: What You Say When Nobody Hears",       level: 3 },
    { id: "kindness-audit",     title: "3. Interactive: The Self-Kindness Audit",                        level: 3 },
    { id: "behaviour-check",    title: "4. The Behaviour Check: Six Ways We Are Unkind Without Knowing", level: 3 },
    { id: "reset-ritual",       title: "5. Building a Simple Mid-Month Reset Ritual",                    level: 3 },
    { id: "faq",                title: "6. Self-Kindness FAQs",                                          level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-15T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "self-kindness, mid-month reset, self-talk awareness, self-compassion check-in, being kind to yourself, self-care behaviour check",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does self-kindness mean in everyday life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Self-kindness in everyday life looks like catching yourself before a spiral of self-criticism and choosing a gentler inner voice instead. It looks like resting when you are tired without guilt, setting limits with people who drain you, eating in a way that feels nourishing rather than punishing, and forgiving yourself for mistakes with the same speed you would forgive someone you love. It is not about being easy on yourself — it is about being fair.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I know if my inner self-talk is unkind?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest diagnostic is the best-friend test: would you say the things you say to yourself, to someone you love? If a close friend made the same mistake you just made, would you call them stupid? Would you tell them they are not enough? If the answer is no — and it almost always is — then the voice in your head is operating on a double standard. That double standard is the defining feature of unkind self-talk.",
      },
    },
    {
      "@type": "Question",
      "name": "Why is it so hard to be kind to myself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most people, harsh self-talk developed as a strategy — often in childhood or adolescence — to motivate performance or avoid the pain of external criticism. If you criticise yourself first, no one else's criticism can add new information. The harshness felt functional. The problem is that it continues long after the original threat has passed, and research consistently shows it actually reduces performance and increases anxiety rather than improving either.",
      },
    },
  ],
};

// ── Audit data ─────────────────────────────────────────────────────────────────
const TEAL   = '#1E7B7B';
const PALE   = '#EDF6F6';
const BORDER = 'rgba(30,123,123,0.22)';

const DIMENSIONS = [
  {
    id:    'talk',
    icon:  '💬',
    label: 'Self-Talk',
    desc:  'The voice inside your head when things go wrong',
    questions: [
      'When I make a mistake, my first internal response is compassionate rather than critical.',
      'I speak to myself with roughly the same patience I would show a close friend.',
      'I do not replay my embarrassing or failed moments on loop for hours or days.',
    ],
    lowNote:  'Your inner critic is working overtime. The voice you hear most often shapes how you show up — it is worth paying attention to what it is actually saying.',
    practice: 'Tonight, write down one harsh thing you said to yourself this week. Below it, write the version you would say to your best friend in the same situation. Read that second version out loud once.',
    icon_practice: '✍️',
  },
  {
    id:    'rest',
    icon:  '🌙',
    label: 'Rest & Recovery',
    desc:  'How you allow yourself to slow down and recharge',
    questions: [
      'I allow myself to rest when I am tired without calling it laziness or guilt.',
      'I have had at least one period of genuine unstructured time in the past two weeks.',
      'I am not consistently sacrificing sleep to be more productive or to please others.',
    ],
    lowNote:  'You may be running on empty and calling it discipline. Rest is not a reward for completing enough tasks — it is what makes the next tasks possible.',
    practice: 'Schedule one hour this week that has no agenda, no productivity, and no screen time. Write it in your calendar the same way you would a meeting. Protect it.',
    icon_practice: '📅',
  },
  {
    id:    'body',
    icon:  '🌿',
    label: 'Body & Physical Care',
    desc:  'How you treat the body you live in day to day',
    questions: [
      'I have been feeding myself regularly and in a way that feels nourishing rather than punishing.',
      'I move my body in ways that feel good, not just ways that feel obligatory or guilty.',
      'I am not currently using physical discomfort — skipping meals, poor sleep, overtraining — as self-punishment.',
    ],
    lowNote:  'Your relationship with your body deserves the same kindness as your relationship with anyone else. How you treat it physically is a direct reflection of how you feel about yourself.',
    practice: 'Cook or order one meal this week that is genuinely your favourite — with no calorie calculations and no guilt. Eat it slowly, on purpose, just because you wanted it.',
    icon_practice: '🍽️',
  },
  {
    id:    'social',
    icon:  '🤝',
    label: 'Social Energy',
    desc:  'How you protect and spend your emotional bandwidth',
    questions: [
      'I have said no to at least one thing this month that I genuinely did not want to do.',
      'I am not currently carrying significant resentment from things I agreed to but did not want.',
      'I have spent time this week with at least one person who genuinely energises me.',
    ],
    lowNote:  'Your social energy is a finite resource. Spending it exclusively on obligation rather than genuine connection leaves nothing for yourself or for the relationships that actually nourish you.',
    practice: 'Identify one recurring obligation this week that drains you. Decide whether to decline it, delegate it, or at least shorten it. Take one concrete step in that direction.',
    icon_practice: '🚪',
  },
  {
    id:    'forgiveness',
    icon:  '🕊️',
    label: 'Self-Forgiveness',
    desc:  'How you handle your own mistakes and regrets',
    questions: [
      'I am not currently holding something against myself that I would have forgiven someone else for by now.',
      'When I do something I regret, I take accountability and then genuinely move on — without extended self-punishment.',
      'I do not define myself primarily by my worst moments or biggest failures.',
    ],
    lowNote:  'Self-punishment and self-improvement are not the same thing. Holding yourself in prolonged guilt does not make you more accountable — it just makes you more exhausted.',
    practice: 'Write down one thing you are still holding against yourself. Below it, write: "I made a mistake. I took it seriously. I am choosing to move forward now." Then close the notebook.',
    icon_practice: '📝',
  },
  {
    id:    'aspiration',
    icon:  '🌱',
    label: 'Honest Expectations',
    desc:  'Whether you are holding yourself to fair, realistic standards',
    questions: [
      'The standards I am currently holding myself to are ones I would consider fair if applied to someone I love.',
      'I acknowledge my own progress, not just the gap between where I am and where I want to be.',
      'I am not comparing my daily reality to other people\'s curated highlights and finding myself lacking.',
    ],
    lowNote:  'The bar you hold yourself to matters as much as the effort you put in. An impossible standard does not produce exceptional results — it produces chronic inadequacy and eventual burnout.',
    practice: 'Write down three specific ways you have grown or improved in the last three months — not big achievements, small genuine shifts. Read them as evidence, not as "not enough yet."',
    icon_practice: '📊',
  },
];

const FREQ_OPTIONS = [
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Almost Always', value: 4 },
];

function getScore(answers, dim) {
  const vals = dim.questions.map((_, qi) => answers[`${dim.id}_${qi}`] || 0);
  if (vals.some(v => v === 0)) return null;
  return vals.reduce((a, b) => a + b, 0);
}

function getTier(score) {
  if (score >= 10) return { label: 'Thriving',       color: '#2D7D46', bg: '#E8F5EE', icon: '💚' };
  if (score >= 7)  return { label: 'Holding Steady', color: '#C07800', bg: '#FFF8E1', icon: '🌤️' };
  if (score >= 4)  return { label: 'Needs Attention', color: '#B54708', bg: '#FEF3C7', icon: '🟠' };
  return              { label: 'Priority Area',    color: '#C0392B', bg: '#FDECEA', icon: '🔴' };
}

// ── Audit Component ────────────────────────────────────────────────────────────
function SelfKindnessAudit() {
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openDim,   setOpenDim]   = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const totalAnswered = DIMENSIONS.reduce((t, dim) =>
    t + dim.questions.filter((_, qi) => answers[`${dim.id}_${qi}`]).length, 0);
  const totalQs = DIMENSIONS.reduce((t, d) => t + d.questions.length, 0);
  const allDone = totalAnswered === totalQs;

  const scores = DIMENSIONS.map(dim => ({ dim, score: getScore(answers, dim) }));
  const completedDims = scores.filter(s => s.score !== null);
  const sortedByScore = [...completedDims].sort((a, b) => a.score - b.score);
  const priorityAreas = sortedByScore.slice(0, 2); // lowest 2

  const handleSubmit = () => { if (allDone) setSubmitted(true); };
  const handleReset  = () => { setAnswers({}); setSubmitted(false); setOpenDim(null); };

  // Overall score
  const totalScore   = completedDims.reduce((t, s) => t + s.score, 0);
  const maxPossible  = totalQs * 4;
  const overallPct   = Math.round((totalScore / maxPossible) * 100);
  const overallTier  = submitted ? (overallPct >= 75 ? { label: 'You are genuinely kind to yourself in most areas', icon: '💚', color: '#2D7D46' } : overallPct >= 50 ? { label: 'You are kind in some areas but have clear blind spots', icon: '🌤️', color: '#C07800' } : { label: 'You have been harder on yourself than you probably realise', icon: '🧡', color: TEAL }) : null;

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {!submitted ? (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Rate how true each statement has been for you in the past two weeks.
          </p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest rather than aspirational — you are auditing your actual behaviour, not your intentions.
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>{totalAnswered} of {totalQs} answered</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: TEAL }}>{Math.round((totalAnswered / totalQs) * 100)}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(30,123,123,0.15)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(totalAnswered / totalQs) * 100}%`, background: `linear-gradient(90deg, ${TEAL}, #2AABAB)`, borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Dimension cards */}
          {DIMENSIONS.map((dim) => (
            <div key={dim.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '12px', border: '2px solid', borderColor: dim.questions.every((_, qi) => answers[`${dim.id}_${qi}`]) ? TEAL : 'var(--border)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              {/* Header */}
              <button
                onClick={() => setOpenDim(openDim === dim.id ? null : dim.id)}
                style={{ width: '100%', padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{dim.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{dim.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{dim.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {dim.questions.every((_, qi) => answers[`${dim.id}_${qi}`]) && (
                    <span style={{ background: TEAL, color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</span>
                  )}
                  <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{openDim === dim.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Questions */}
              {openDim === dim.id && (
                <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)' }}>
                  {dim.questions.map((q, qi) => {
                    const key = `${dim.id}_${qi}`;
                    return (
                      <div key={qi} style={{ paddingTop: '16px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '500', color: 'var(--ink)', lineHeight: 1.55 }}>{q}</p>
                        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                          {FREQ_OPTIONS.map(opt => {
                            const isSelected = answers[key] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setAnswers(prev => ({ ...prev, [key]: opt.value }))}
                                style={{
                                  padding: '7px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600',
                                  border: '2px solid', fontFamily: font, cursor: 'pointer', transition: 'all 0.15s',
                                  borderColor: isSelected ? TEAL : 'var(--border)',
                                  background: isSelected ? TEAL : 'white',
                                  color: isSelected ? 'white' : 'var(--ink-soft)',
                                }}
                              >{opt.label}</button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={!allDone}
            style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
              background: allDone ? `linear-gradient(135deg, ${TEAL}, #2AABAB)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: font,
              cursor: allDone ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              boxShadow: allDone ? `0 6px 20px ${BORDER}` : 'none',
            }}
          >
            {allDone ? 'See My Self-Kindness Report →' : `Open each section and answer all ${totalQs - totalAnswered} remaining statements`}
          </button>
        </>
      ) : (
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Overall result */}
          <div style={{ background: `linear-gradient(135deg, ${TEAL}, #2AABAB)`, borderRadius: '14px', padding: '24px', marginBottom: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '34px', marginBottom: '8px' }}>{overallTier.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              Self-Kindness Score: {overallPct}%
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>{overallTier.label}</div>
          </div>

          {/* Per-dimension results */}
          <div style={{ marginBottom: '18px' }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
              Your Results Across All Six Areas
            </p>
            {scores.map(({ dim, score }) => {
              const tier = getTier(score);
              const pct  = Math.round((score / (dim.questions.length * 4)) * 100);
              return (
                <div key={dim.id} style={{ background: 'white', borderRadius: '11px', padding: '14px 16px', marginBottom: '8px', border: `1.5px solid ${tier.bg === '#E8F5EE' ? 'rgba(45,125,70,0.2)' : tier.bg === '#FFF8E1' ? 'rgba(192,120,0,0.2)' : tier.bg === '#FEF3C7' ? 'rgba(181,71,8,0.2)' : 'rgba(192,57,43,0.2)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{dim.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{dim.label}</div>
                      <div style={{ fontSize: '11px', color: tier.color, fontWeight: '700', marginTop: '1px' }}>{tier.icon} {tier.label}</div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: tier.color }}>{pct}%</div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: tier.color, borderRadius: '6px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Priority reset plan — bottom 2 areas */}
          <div style={{ background: PALE, border: `2px solid ${BORDER}`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: TEAL }}>
              🌱 Your Mid-Month Reset Plan — Priority Areas
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Based on your audit, these are the two areas where you have been hardest on yourself. Each comes with one concrete practice for the next fourteen days.
            </p>
            {priorityAreas.map(({ dim }) => {
              const tier = getTier(getScore(answers, dim));
              return (
                <div key={dim.id} style={{ background: 'white', borderRadius: '11px', padding: '16px 18px', marginBottom: '10px', borderLeft: `4px solid ${TEAL}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{dim.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: TEAL }}>{dim.label} — Focus Area</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{tier.icon} {tier.label}</div>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>{dim.lowNote}</p>
                  <div style={{ background: PALE, borderRadius: '9px', padding: '12px 14px', border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: TEAL, marginBottom: '6px' }}>
                      {dim.icon_practice} This Week's Practice
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{dim.practice}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Closing note */}
          <div style={{ background: 'white', borderRadius: '11px', padding: '16px 18px', marginBottom: '16px', border: `1.5px solid ${BORDER}` }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              You do not need to fix everything at once. Two practices, done consistently for two weeks, will do more than seven practices attempted once and abandoned. Choose the ones that stung a little when you read them — those are the ones that matter.
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${BORDER}`, color: TEAL,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retake the Audit</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SelfKindnessCheck({ navigate, relatedPosts }) {
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
      <p>We are halfway through February. Fifteen days in. If this were a project, you would check the dashboard. If it were a budget, you would review the spending. But almost nobody pauses at the midpoint of a month to ask the most important question of all: <em>have I been treating myself with kindness?</em></p>

      <p>Not productivity. Not efficiency. Not self-improvement. <strong>Kindness.</strong> The same basic courtesy and compassion you extend, almost automatically, to everyone around you — have you been extending it to yourself? For most people, the honest answer is complicated. And complicated is worth examining.</p>

      <img
        src={meta.imgUrl}
        alt="Person pausing for a mid-month self-kindness reset — journalling and reflecting on how they have been treating themselves"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-is-kindness">1. What Self-Kindness Actually Looks Like in Practice</h3>
      <p>Self-kindness is one of those phrases that sounds immediately clear and turns out, on closer inspection, to be genuinely difficult to define. It is not the same as self-indulgence — choosing comfort over growth, or excusing behaviour that actually needs accountability. It is not the same as self-esteem — the sense that you are doing well and performing adequately. And it is certainly not the same as toxic positivity — forcing yourself to feel good about things that are genuinely hard.</p>
      <p>Dr Kristin Neff, whose research on self-compassion at the University of Texas is the most cited in this field, defines self-kindness as <em>treating yourself with the same warmth, patience, and understanding you would show a good friend who was struggling.</em> Not a perfect friend. Not a productive friend. A struggling one.</p>
      <p>In practice, this looks like specific, daily behaviours: resting when you are tired without labelling yourself lazy, speaking to yourself after a mistake in the same tone you would use with someone you love, allowing your emotions to exist rather than suppressing them for efficiency, giving yourself credit for effort rather than only for outcomes. Small things. Repeated things. Things that most of us do for others without thinking, and struggle to do for ourselves at all.</p>
      <p>The research on why this matters is not soft. Self-compassionate people — those who score high on measures of self-kindness — show measurably lower levels of anxiety and depression, greater motivation after failure, stronger immune function, and more satisfying relationships. The kindness is not indulgence. It is maintenance.</p>

      {/* ── Section 2 ── */}
      <h3 id="self-talk">2. The Self-Talk Problem: What You Say When Nobody Hears</h3>
      <p>The average person has somewhere between 6,000 and 60,000 thoughts per day, depending on which research you read. The majority of those thoughts are not neutral. They are evaluative — they are assessing, judging, comparing, and narrating the self. And for most people, a significant proportion of that narration is unkind in a way that would be immediately recognisable as unacceptable if it were spoken aloud to another person.</p>
      <p><em>You were so stupid in that meeting.</em> <em>Why can you never get this right.</em> <em>Everyone else seems to have this figured out.</em> <em>You have wasted so much time.</em> These are not rare thoughts. They are the background music of many people's inner lives — so familiar they have stopped being noticed as unkind and started being experienced as simply true.</p>
      <p>The psychologist Ethan Kross, whose research at the University of Michigan focuses on inner voice and self-talk, has demonstrated that the tone of your internal dialogue has measurable physiological effects. Harsh self-talk activates the brain's threat response — the same cortisol-producing, amygdala-activating system that fires when you are in physical danger. You are, quite literally, stressing your own nervous system with the way you speak to yourself inside your head.</p>
      <p>The antidote is not positive affirmations — research consistently shows these backfire for people with low self-regard because the brain rejects statements it does not believe. The antidote is <strong>self-compassionate reframing</strong> — not replacing "I am terrible" with "I am amazing," but replacing it with "I made a mistake and that is something I can learn from," which is both more accurate and infinitely more kind.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="kindness-audit">3. Interactive: The Self-Kindness Audit</h3>
      <p>This is not a quiz with a personality type at the end. It is a genuine behavioural audit — six dimensions of self-kindness, each with three specific statements about real behaviour in the last two weeks. Rate each statement honestly. At the end, you will get a full breakdown of where you are thriving and where you have been harder on yourself than you probably realise, along with a concrete two-week reset plan for your priority areas.</p>

      <SelfKindnessAudit />

      {/* ── Section 4 ── */}
      <h3 id="behaviour-check">4. The Behaviour Check: Six Ways We Are Unkind Without Knowing</h3>
      <p><strong>Saying yes when you mean no — repeatedly.</strong> Every time you agree to something you do not want to do out of guilt, obligation, or fear of being disliked, you are sending yourself a message: your preferences are less important than other people's comfort. Do this enough times and it stops feeling like a choice and starts feeling like a fact.</p>
      <p><strong>Comparing your internal reality to other people's external presentation.</strong> You have complete access to your own anxiety, insecurity, exhaustion, and doubt. You have access only to the curated, composed, best-version presentation of everyone else. Comparing these two things is not a fair contest — it is one designed to make you feel like you are failing a race everyone else seems to be running effortlessly.</p>
      <p><strong>Skipping recovery as a form of work ethic.</strong> Chronic busyness, voluntary sleep deprivation, and productivity guilt are often framed as discipline. Psychologically, they are more often forms of self-neglect with a socially acceptable justification. Rest is not the absence of work — it is what makes sustained work possible. Treating recovery as laziness is an unkind mischaracterisation of a biological necessity.</p>
      <p><strong>Holding onto mistakes long after they have been addressed.</strong> There is a difference between processing an error — acknowledging it, understanding it, correcting what can be corrected — and punishing yourself for it indefinitely. Accountability ends. Self-punishment does not. The latter is not conscientiousness. It is cruelty applied inward.</p>
      <p><strong>Dismissing your own needs as "too much."</strong> Telling yourself that needing support, rest, reassurance, or time is somehow excessive or burdensome is a particularly insidious form of self-unkindness because it wears the mask of consideration for others. You are allowed to need things. All people need things. The problem is not having needs — it is having learned somewhere that yours are less legitimate than everyone else's.</p>
      <p><strong>Moving the goalposts the moment you reach them.</strong> Achieving a goal and immediately replacing it with a bigger one — without acknowledgment, celebration, or pause — is the self-kindness equivalent of never feeding yourself because there will be another meal tomorrow. Progress deserves to be received. You are allowed to feel good about what you have done before immediately demanding more of yourself.</p>

      {/* ── Section 5 ── */}
      <h3 id="reset-ritual">5. Building a Simple Mid-Month Reset Ritual</h3>
      <p>A reset ritual does not need to be elaborate to be effective. It needs to be honest, intentional, and brief enough that you will actually do it. The following structure takes about twenty minutes and can be done with just a notebook and a quiet space.</p>
      <p><strong>The audit question (5 minutes).</strong> Ask yourself one question: in the past two weeks, what is the harshest thing I said to myself that I would never say to someone I love? Write it down. Seeing it in writing, outside of your head, is often enough to interrupt the pattern — because written down, it usually looks objectively unfair in a way it did not when it was just background noise.</p>
      <p><strong>The evidence question (5 minutes).</strong> Ask: what have I actually done well in the past two weeks? Not what have I achieved — what have I done with genuine care, effort, or courage? Write at least five things. This is not vanity. It is calibration. The brain's negativity bias means your failures are automatically more salient than your efforts. This exercise rebalances the ledger deliberately.</p>
      <p><strong>The one thing question (5 minutes).</strong> Ask: what is one specific thing I can do differently in the next fourteen days that would represent being meaningfully kinder to myself? Not a personality overhaul. One behaviour. As specific as possible. Then write it as a commitment: "In the next two weeks, I will [specific action] because I deserve [specific benefit]."</p>
      <p><strong>The permission question (5 minutes).</strong> Ask: what do I need to give myself permission for right now? Rest? Imperfection? Wanting something different? Letting go of something I have been holding? Write a one-sentence permission slip. Sign it. It is a small gesture with a disproportionately large psychological effect — because putting something in writing makes the commitment real in a way that a mental note does not.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Self-Kindness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is self-kindness the same as letting yourself off the hook?</strong><br />
        A: No — and this is the most important distinction in the entire field. Self-kindness does not mean excusing poor behaviour or avoiding accountability. It means responding to your own failures with the same balanced, honest, forward-looking perspective you would apply to a friend. "That was a mistake, I understand why it happened, I can do better" is both fully accountable and genuinely kind. "I am the worst, I always ruin everything, I am fundamentally not enough" is neither accountable nor useful — it is just painful.</p>

        <p><strong>Q: I feel like if I am kind to myself, I will stop working hard.</strong><br />
        A: This fear is extremely common and contradicted consistently by research. Studies by Dr Neff and colleagues show that self-compassionate people are actually more motivated after failure, not less. They bounce back faster and try again more readily because they are not spending their cognitive and emotional resources on self-punishment. The harshness does not drive performance. It exhausts the person who is trying to perform.</p>

        <p><strong>Q: How do I start being kinder to myself when the habit is deeply ingrained?</strong><br />
        A: Start with noticing rather than changing. Before you can shift the pattern of harsh self-talk, you need to be able to hear it — to catch it in the act rather than only recognising it after the fact. Spend one week simply observing your inner voice without attempting to change it. Notice when it fires, what triggers it, and what it says. That observation alone creates a small but significant distance between you and the voice, and distance is the beginning of choice.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: TEAL, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Talk to yourself like you would to someone you love."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Brené Brown</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          You have fourteen days left in February. They will not be perfect. Some will be difficult, some will be mundane, and some will surprise you. The question is not whether they will be hard — it is whether you will be on your own side when they are.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: TEAL, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${BORDER}` }}
          >
            Continue Your Reset in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: TEAL, border: `2px solid ${TEAL}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring Self-Kindness:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/psychology-self-love')} style={{ background: 'none', border: 'none', color: TEAL, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → The Psychology Behind Self-Love and Emotional Wellbeing
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/negative-self-talk')} style={{ background: 'none', border: 'none', color: TEAL, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Breaking the Cycle of Negative Self-Talk
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/valentines-self-love')} style={{ background: 'none', border: 'none', color: TEAL, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Valentine's Day Self-Love Guide: Love Yourself First
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: TEAL, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
