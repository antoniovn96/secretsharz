import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "The Role of Self-Care in Building Healthy Relationships",
  excerpt: "You cannot build healthy relationships while running on empty. The quality of every relationship in your life is a direct reflection of the quality of your relationship with yourself. Learn why self-care is not selfish in relationships, how to find the balance between self and others, and get a personalised Self-Care Relationship Audit to find exactly where your balance needs attention.",
  category: "Mental Health",
  date: "22-02-2026",
  readTime: "7 min read",
  wordCount: 1040,
  imgUrl: "/blogss/2026/February/self-care-relationships.jpg",
  tldr: "Self-care is not the opposite of caring for others — it is what makes genuine care for others possible. Research consistently shows that people who neglect self-care in relationships become depleted, resentful, and eventually disconnected. This guide explains the mechanism, covers the balance between self and others, gives you five practical daily habits, and includes an interactive audit to identify exactly where your self-care is affecting your relationships.",
  toc: [
    { id: "connection",   title: "1. The Direct Connection Between Self-Care and Relationship Quality",  level: 3 },
    { id: "depletion",    title: "2. What Happens When You Stop Taking Care of Yourself in Relationships", level: 3 },
    { id: "audit",        title: "3. Interactive: The Self-Care Relationship Audit",                      level: 3 },
    { id: "balance",      title: "4. Finding the Balance: Self vs Others",                               level: 3 },
    { id: "habits",       title: "5. Five Practical Self-Care Habits That Strengthen Relationships",      level: 3 },
    { id: "faq",          title: "6. Self-Care in Relationships FAQs",                                   level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-22T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "self-care relationships, self-care in relationships, self-care and healthy relationships, relationship self-care balance, self-care habits relationships, caring for yourself and others",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is self-care important in relationships?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Self-care is essential in relationships because your emotional, physical, and psychological state directly determines the quality of care, presence, and connection you can offer other people. Research consistently shows that individuals who maintain consistent self-care practices are more emotionally regulated during conflict, more genuinely empathetic, less likely to project unmet needs onto partners, and more capable of honest communication. The relationship between self-care and relationship quality is not philosophical — it is neurological and behavioural.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I balance self-care with caring for others in a relationship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective framework is to treat self-care as a non-negotiable maintenance requirement rather than an occasional reward. This means: scheduling self-care before your calendar fills with others' needs rather than fitting it in whatever is left over, communicating your self-care needs clearly to the people in your life, and releasing the belief that caring for yourself comes at the expense of caring for others. In genuinely healthy relationships, both people's self-care is supported — because both people recognise that the other's wellbeing is the foundation of the relationship's quality.",
      },
    },
    {
      "@type": "Question",
      "name": "Can too much self-care damage a relationship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — though what is usually described as 'too much self-care' is more accurately described as self-absorption or avoidant coping using self-care as a reason to withdraw from relational responsibility. Genuine self-care makes you more available to your relationships, not less. If what you are calling self-care consistently makes you less present, less responsive, or less accountable in your relationships, it is worth examining whether it is self-care or a withdrawal pattern that has adopted the language of self-care.",
      },
    },
  ],
};

// ── Audit Data ─────────────────────────────────────────────────────────────────
const FOREST   = '#2E6B4A';
const FPALE    = '#EDF5F0';
const FBORDER  = 'rgba(46,107,74,0.22)';

const AUDIT_AREAS = [
  {
    id:    'emotional',
    icon:  '💛',
    title: 'Emotional Self-Care',
    desc:  'How well you are tending to your own emotional needs alongside those of others',
    questions: [
      'I process my own emotions — through journalling, reflection, or talking to someone trusted — rather than only absorbing others\'.',
      'I am able to set limits on how much emotional labour I take on without feeling guilty.',
      'After a difficult conversation or emotional interaction, I have practices that help me return to my own baseline.',
    ],
    depleted_note: 'When emotional self-care is neglected, you become what therapists call "emotionally fused" — your moods become disproportionately determined by others\' emotional states, you lose the ability to distinguish between your feelings and theirs, and genuine empathy gradually becomes emotional exhaustion.',
    habit: 'At the end of each day, spend five minutes identifying one emotion you felt today that was genuinely yours — not a reaction to someone else\'s situation. Name it, sit with it briefly, and release it intentionally. This daily practice maintains the distinction between your emotional world and those of the people around you.',
    icon_h: '📓',
  },
  {
    id:    'physical',
    icon:  '🌿',
    title: 'Physical Self-Care',
    desc:  'Whether your body\'s basic needs are being honoured consistently',
    questions: [
      'My sleep is consistent enough that I am not chronically operating in deficit — I can be present in relationships rather than just getting through them.',
      'I eat and move in ways that give me enough energy to genuinely show up for the people I care about.',
      'I have physical space that is genuinely mine — time alone in my body that is not spoken for by anyone else\'s needs.',
    ],
    depleted_note: 'Physical depletion — chronic sleep deficit, irregular eating, no movement, no solitude — produces an irritability and reactivity that has nothing to do with the people you are relating to but affects them profoundly. Research by Matthew Walker on sleep deprivation shows measurable declines in emotional empathy and increases in interpersonal conflict after just one night of poor sleep.',
    habit: 'Choose one physical self-care practice that you will protect as non-negotiable for the next fourteen days — not flexible, not reschedulable, just done. Not because it is selfish but because the version of you that exists after fourteen days of consistent physical maintenance is a meaningfully better relational presence than the depleted version.',
    icon_h: '😴',
  },
  {
    id:    'identity',
    icon:  '🪞',
    title: 'Identity and Individuality',
    desc:  'Whether you maintain a strong sense of self within your relationships',
    questions: [
      'I have interests, opinions, and activities that are genuinely mine — not defined by or in relation to other people in my life.',
      'I can disagree with people I love without it feeling like a threat to the relationship or to my sense of self.',
      'My sense of who I am does not change significantly depending on which relationship context I am in.',
    ],
    depleted_note: 'Loss of individual identity within relationships — sometimes called "enmeshment" in psychology — is one of the most common and least recognised forms of self-care neglect. When your identity becomes so intertwined with a relationship that you lose clear sight of where you end and the other person begins, both the relationship and your mental health suffer. Paradoxically, maintaining your individuality is one of the most protective things you can do for the relationship.',
    habit: 'Spend one hour each week on something that is entirely yours — not shared with anyone in your life, not reported back, not photographed. A practice, an interest, a thought process that belongs completely to you. This hour is maintenance for the self that your relationships depend on.',
    icon_h: '🎨',
  },
  {
    id:    'social',
    icon:  '🤝',
    title: 'Social Reciprocity',
    desc:  'Whether the energy exchange in your key relationships is balanced',
    questions: [
      'The majority of my significant relationships feel genuinely mutual — I am not consistently the one giving more than I receive.',
      'I have at least one relationship in my life where I feel genuinely able to be vulnerable without consequence.',
      'I am honest with myself about the relationships that consistently drain me without restoring anything — and I manage my investment in those accordingly.',
    ],
    depleted_note: 'When social reciprocity is consistently absent — when you are always the listener, the helper, the supporter, the one who shows up — the absence of care flowing back toward you creates a specific form of depletion that no amount of solitary self-care fully addresses. The human nervous system needs relational nourishment, not just management of relational stress.',
    habit: 'This week, identify one relationship where you have been consistently giving and not receiving. Either name it directly with that person — "I need more from us than I am currently getting" — or consciously reduce your investment to match the actual reciprocity level. Both are legitimate responses. What is not sustainable is pretending the imbalance is not there.',
    icon_h: '💬',
  },
  {
    id:    'solitude',
    icon:  '🌙',
    title: 'Solitude and Recovery',
    desc:  'Whether you protect time to be alone with yourself, not just alone from tasks',
    questions: [
      'I have regular periods of genuine solitude — not filled with screens or tasks — where I can hear my own thoughts clearly.',
      'I do not feel guilty about needing time alone from people I love, and I am able to take it without extensive explanation.',
      'After periods of high relational demand, I actively build in recovery time rather than waiting until I am completely depleted.',
    ],
    depleted_note: 'Solitude is not the absence of connection — it is a different kind of connection: with yourself. Psychologist Ester Buchholz argued that the capacity for solitude is as fundamental as the need for attachment, and that people who cannot be alone with themselves are chronically dependent on others to regulate their internal state. That dependency is both a self-care problem and a relationship problem.',
    habit: 'Schedule thirty minutes of intentional solitude — not sleep, not scrolling, just quiet presence with yourself — into each week. Notice what thoughts and feelings arise in the silence. They are your internal landscape, and attending to it consistently keeps you from arriving at relationships already full of unprocessed material that spills into the interaction.',
    icon_h: '🕯️',
  },
];

const RATING_OPTS = [
  { label: 'Rarely',        value: 1 },
  { label: 'Sometimes',     value: 2 },
  { label: 'Often',         value: 3 },
  { label: 'Almost Always', value: 4 },
];

function getAreaScore(answers, area) {
  const vals = area.questions.map((_, qi) => answers[`${area.id}_${qi}`] || 0);
  if (vals.some(v => v === 0)) return null;
  return vals.reduce((a, b) => a + b, 0);
}

function getTier(score, max) {
  const pct = score / max;
  if (pct >= 0.75) return { label: 'Well-tended',   color: '#2D7D46', bg: '#E8F5EE', icon: '💚' };
  if (pct >= 0.5)  return { label: 'Needs attention',color: '#C07800', bg: '#FFF8E1', icon: '🟡' };
  return              { label: 'Depleted',          color: '#C0392B', bg: '#FDECEA', icon: '🔴' };
}

// ── Audit Component ────────────────────────────────────────────────────────────
function SelfCareRelationshipAudit() {
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openArea,  setOpenArea]  = useState(null);
  const [openPlan,  setOpenPlan]  = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const totalQ    = AUDIT_AREAS.reduce((t, a) => t + a.questions.length, 0);
  const answered  = AUDIT_AREAS.reduce((t, a) => t + a.questions.filter((_, qi) => answers[`${a.id}_${qi}`]).length, 0);
  const allDone   = answered === totalQ;
  const progress  = Math.round((answered / totalQ) * 100);

  const scores    = AUDIT_AREAS.map(area => ({ area, score: getAreaScore(answers, area) }));
  const sortedAsc = [...scores.filter(s => s.score !== null)].sort((a, b) => a.score - b.score);
  const totalScore  = scores.reduce((t, s) => t + (s.score || 0), 0);
  const maxPossible = totalQ * 4;
  const overallPct  = submitted ? Math.round((totalScore / maxPossible) * 100) : 0;

  const handleReset = () => { setAnswers({}); setSubmitted(false); setOpenArea(null); setOpenPlan(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {!submitted ? (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Rate how true each statement has been for you over the past two weeks.
          </p>
          <p style={{ margin: '0 0 18px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Think about a specific relationship — the one that has been most on your mind lately — as you answer. The audit is calibrated to how your self-care is showing up in relational contexts, not in isolation.
          </p>

          {/* Progress */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>{answered} of {totalQ} answered</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: FOREST }}>{progress}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(46,107,74,0.12)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${FOREST}, #40A06A)`, borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {AUDIT_AREAS.map(area => {
            const areaDone = area.questions.every((_, qi) => answers[`${area.id}_${qi}`]);
            const isOpen   = openArea === area.id;
            return (
              <div key={area.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '10px', border: '2px solid', borderColor: areaDone ? FOREST : 'var(--border)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button
                  onClick={() => setOpenArea(isOpen ? null : area.id)}
                  style={{ width: '100%', padding: '15px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}
                >
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{area.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{area.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{area.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {areaDone && <span style={{ background: FOREST, color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</span>}
                    <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)' }}>
                    {area.questions.map((q, qi) => {
                      const key = `${area.id}_${qi}`;
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
                                  borderColor: isSel ? FOREST : 'var(--border)',
                                  background: isSel ? FOREST : 'white',
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

          <button
            onClick={() => { if (allDone) setSubmitted(true); }}
            disabled={!allDone}
            style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
              background: allDone ? `linear-gradient(135deg, ${FOREST}, #40A06A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: font,
              cursor: allDone ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              boxShadow: allDone ? `0 6px 20px ${FBORDER}` : 'none', marginTop: '6px',
            }}
          >
            {allDone ? 'See My Self-Care Relationship Report →' : `Open each section and answer all ${totalQ - answered} remaining statements`}
          </button>
        </>
      ) : (
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Overall */}
          <div style={{ background: `linear-gradient(135deg, ${FOREST}, #40A06A)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {overallPct >= 70 ? '🌳' : overallPct >= 45 ? '🌱' : '🪴'}
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              Relational Self-Care Score: {overallPct}%
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
              {overallPct >= 70 ? 'Your self-care is broadly supporting your relationships. The work is maintenance and depth, not urgent repair.' : overallPct >= 45 ? 'You are managing in some areas and depleted in others. The specific gaps are costing your relationships more than you may realise.' : 'You are running a relational deficit. What you are giving others is outpacing what you are giving yourself — and that gap has consequences.'}
            </div>
          </div>

          {/* Area bars */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${FBORDER}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
              Your Self-Care Profile Across Five Dimensions
            </div>
            {scores.map(({ area, score }) => {
              if (score === null) return null;
              const tier = getTier(score, area.questions.length * 4);
              const pct  = Math.round((score / (area.questions.length * 4)) * 100);
              return (
                <div key={area.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {area.icon} {area.title}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: tier.color }}>{tier.icon} {tier.label}</span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--border)', borderRadius: '7px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: tier.color, borderRadius: '7px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Priority areas — lowest 2 */}
          <div style={{ background: FPALE, border: `2px solid ${FBORDER}`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: FOREST }}>
              🌱 Your Priority Self-Care Areas for the Next Two Weeks
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Based on your audit, these are the two areas where self-care depletion is most likely affecting your relationships right now.
            </p>
            {sortedAsc.slice(0, 2).map(({ area }) => {
              const score = getAreaScore(answers, area);
              const tier  = getTier(score, area.questions.length * 4);
              const isOpen = openPlan === area.id;
              return (
                <div key={area.id} style={{ background: 'white', borderRadius: '11px', marginBottom: '10px', overflow: 'hidden', border: `1.5px solid ${FBORDER}`, borderLeft: `4px solid ${FOREST}` }}>
                  <button onClick={() => setOpenPlan(isOpen ? null : area.id)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}>
                    <span style={{ fontSize: '20px' }}>{area.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: FOREST }}>{area.title}</div>
                      <div style={{ fontSize: '11px', color: tier.color, fontWeight: '700', marginTop: '1px' }}>{tier.icon} {tier.label}</div>
                    </div>
                    <span style={{ color: FOREST, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                      <div style={{ background: FPALE, borderRadius: '10px', padding: '13px 15px', marginTop: '14px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: FOREST, marginBottom: '6px' }}>
                          🔬 Why This Affects Your Relationships
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--brown)', lineHeight: 1.7 }}>{area.depleted_note}</p>
                      </div>
                      <div style={{ background: 'white', borderRadius: '10px', padding: '13px 15px', border: `1px solid ${FBORDER}` }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: FOREST, marginBottom: '6px' }}>
                          {area.icon_h} Your Two-Week Practice
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{area.habit}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Closing line */}
          <div style={{ background: 'white', border: `1.5px dashed ${FBORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: FOREST, fontStyle: 'italic', lineHeight: 1.6 }}>
              "The relationship you have with yourself sets the standard for every other relationship in your life."
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${FBORDER}`, color: FOREST,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retake the Audit</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SelfCareRelationships({ navigate, relatedPosts }) {
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
      <p>There is a version of relationship advice that teaches you to give more, show up harder, communicate better, and accommodate further. None of that is wrong. But almost all of it misses the most important variable: the state of the person doing the giving, the showing up, the communicating, and the accommodating.</p>

      <p>You cannot sustain genuine care for other people from a place of genuine depletion. The research is unambiguous on this: the quality of your relationships is a direct downstream consequence of the quality of your <strong>self-care in relationships</strong> — how consistently you tend to your own emotional, physical, and psychological needs while navigating the demands of closeness with others. This is not selfishness. It is the maintenance that makes everything else possible.</p>

      <img
        src={meta.imgUrl}
        alt="Person practising self-care to build healthier relationships — balancing personal wellbeing with genuine care for others"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="connection">1. The Direct Connection Between Self-Care and Relationship Quality</h3>
      <p>Attachment theory — the most extensively researched framework for understanding relationship dynamics — identifies secure attachment as the foundation of healthy adult relationships. Securely attached people can be genuinely close without losing themselves, genuinely independent without disconnecting, and genuinely honest without cruelty. What produces secure attachment in adulthood, research by psychologist Mary Main at Berkeley showed, is not a perfect childhood. It is the development of what she called a "coherent narrative" — a stable, honest, self-aware account of your own experience, including its difficult parts.</p>
      <p>Self-care is, fundamentally, the practice of attending to your own experience with enough regularity and honesty to maintain that coherent narrative. When you do not take care of yourself, the narrative becomes incoherent — you lose track of your own emotional state, you conflate your needs with others', you bring unprocessed material into your relationships that distorts your responses. The technical term in relational psychology is "low differentiation": the inability to maintain a clear sense of self within the emotional field of a relationship. Low differentiation produces either fusion (losing yourself in the relationship) or cutoff (withdrawing to preserve yourself). Neither is what you want. Self-care is what keeps differentiation high — which is what allows for genuine intimacy without losing yourself in it.</p>
      <p>The neuroscience adds another layer. Research on the "social brain" — particularly by Matthew Lieberman at UCLA — shows that the brain's default mode network, which activates during rest and self-reflection, is the same network involved in understanding other people. This means that time spent in genuine self-reflection is not time spent away from relational competence. It is the practice that develops relational competence. Every hour you spend knowing yourself better is an hour that directly improves your capacity to know and connect with other people.</p>

      {/* ── Section 2 ── */}
      <h3 id="depletion">2. What Happens When You Stop Taking Care of Yourself in Relationships</h3>
      <p><strong>You become reactive rather than responsive.</strong> The distinction between reactivity and responsiveness is one of the most useful in all of relational psychology. Reactive behaviour is automatic, triggered, and disproportionate — the response that comes from a nervous system that has been chronically stressed and has no buffer capacity left. Responsive behaviour is considered, calibrated, and appropriate to the actual situation. Self-care builds buffer capacity. Without it, minor relational friction produces major emotional responses — and the other person, who does not have access to your internal state, experiences you as unpredictable and difficult to be close to.</p>
      <p><strong>You begin projecting unmet needs.</strong> When your own needs go consistently unmet — for rest, for recognition, for genuine listening, for solitude — they do not disappear. They go underground and surface in your relationships as projections: excessive expectations, irrational jealousy, disproportionate hurt over small things, anger at people who did not cause the original deprivation. The person in the relationship with you experiences the impact of needs they never agreed to meet because you never acknowledged having them.</p>
      <p><strong>Empathy degrades into emotional exhaustion.</strong> Genuine empathy — the ability to accurately perceive and respond to another person's emotional state without being overwhelmed by it — requires a stable internal base. When that base is depleted, what passes for empathy becomes emotional contagion: you absorb others' states without processing them, their anxiety becomes yours, their distress becomes catastrophic for you. This is not empathy — it is dysregulation. And it benefits no one in the relationship.</p>
      <p><strong>Case example — Riya, 2nd year UG:</strong> Riya was in a close friendship and a new romantic relationship simultaneously while managing a heavy academic semester. She gradually stopped exercising, her sleep deteriorated, and she stopped spending time alone. By month three, she described feeling "hollowed out" in both relationships — present in body, absent in genuine engagement. She was responding to her boyfriend's moods with her own anxiety rather than curiosity. She was listening to her friend's problems with visible impatience she could not fully explain. The relationships had not changed. She had depleted, and the depletion was showing up as relationship difficulty. Three weeks of deliberate sleep restoration and two evenings per week of protected solitude produced a shift that no relational strategy had achieved.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="audit">3. Interactive: The Self-Care Relationship Audit</h3>
      <p>This audit assesses five dimensions of self-care that research identifies as most directly predictive of relationship quality — emotional self-care, physical self-care, identity maintenance, social reciprocity, and solitude. For each dimension, you will rate three specific statements about your actual behaviour over the past two weeks. The result is a personalised profile of where your self-care is supporting your relationships and where its absence is creating costs you may not have fully connected to the source.</p>

      <SelfCareRelationshipAudit />

      {/* ── Section 4 ── */}
      <h3 id="balance">4. Finding the Balance: Self vs Others</h3>
      <p>The fear that self-care competes with caring for others — that time and energy given to yourself is taken from the people in your life — is one of the most persistent and most inaccurate beliefs about relationships. It is understandable: in a world where the demands of closeness are constant and visible, and where the costs of self-neglect are gradual and internal, the trade-off feels real. It is not.</p>
      <p>The more useful framework is to think about self-care not as time subtracted from relationships but as quality multiplied across them. An hour of genuine rest does not take an hour from your relationship — it produces a more present, more emotionally regulated, more genuinely attentive version of you for every subsequent interaction. The math is different from how it appears.</p>
      <p>The balance itself can be understood through what psychologist Murray Bowen called the <strong>I-position</strong>: the capacity to remain connected to other people while maintaining a clear sense of your own values, needs, and perspective. High I-position people are the best partners, friends, and collaborators because they do not need the relationship to regulate their internal state — which means they can be genuinely present in it without being consumed by it. They bring themselves, not their unmet needs, to the relationship. Self-care practices are the daily maintenance of the I-position.</p>
      <p>In practical terms, balance looks like: protecting specific self-care practices as non-negotiable before scheduling relational commitments around them; communicating your self-care needs clearly to the people closest to you rather than secretly managing them in ways that produce resentment; and regularly assessing — honestly — whether your current relational investments are producing enough reciprocal nourishment to sustain the output you are giving. Balance is not a static state. It is an ongoing calibration, revisited whenever the scales tip too far in either direction.</p>

      {/* ── Section 5 ── */}
      <h3 id="habits">5. Five Practical Self-Care Habits That Strengthen Relationships</h3>
      <p><strong>1. The daily emotional check-in — with yourself first.</strong> Before you absorb anyone else's emotional state each day, spend five minutes with your own. What are you actually feeling right now? What do you need today? What emotional material are you carrying from yesterday that has not yet been processed? This practice — brief, consistent, private — maintains the distinction between your emotional world and the emotional field of your relationships. Without it, you arrive at every interaction already full of unprocessed material that spills into the connection.</p>
      <p><strong>2. Protected sleep as a relational commitment.</strong> This is the least glamorous and most impactful single self-care habit for relationship quality. Research by Matthew Walker at UC Berkeley has demonstrated that sleep deprivation measurably reduces the accuracy of emotional face-reading, increases the intensity of threat perception in ambiguous social situations, and decreases activity in the prefrontal cortex — the region responsible for considered rather than reactive responses to social challenge. Every night of adequate sleep is, functionally, an act of care toward everyone you will interact with the following day.</p>
      <p><strong>3. Solitude that is genuinely solitary.</strong> There is a significant difference between being alone in a room and being genuinely alone — present with yourself, unoccupied by screens, tasks, or passive consumption. The latter is what psychologists identify as restorative: it allows the default mode network to process experience, integrate emotion, and restore the sense of coherent selfhood that social engagement gradually depletes. Even twenty minutes of genuine solitude per day — a walk without headphones, a meal eaten without a phone, a brief period of deliberate stillness — produces measurable effects on subsequent relational presence.</p>
      <p><strong>4. Maintaining at least one activity that is entirely your own.</strong> A creative practice, a physical pursuit, an intellectual interest, a craft — something that belongs to you in a way that is not defined by or shared with the relationships in your life. This is identity maintenance: the ongoing investment in the self that exists alongside but distinct from your relational roles. Research on relationship satisfaction consistently finds that partners and friends who maintain their own separate interests and activities produce relationships with higher mutual satisfaction than those where everything is shared. Your individuality is not a threat to closeness. It is one of its most important inputs.</p>
      <p><strong>5. The repair conversation with yourself after difficult relational interactions.</strong> After a significant conflict, a draining interaction, or a difficult conversation, most people either ruminate without resolution or push past it without processing. A third option — a brief, deliberate internal debrief — produces better outcomes for both your wellbeing and your subsequent relational behaviour. The format is simple: what happened, how did I feel, what did I actually need, what would I do differently, and am I carrying anything unresolved into the next interaction? Five minutes, done honestly, closes what would otherwise remain open and corrosive.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Self-Care in Relationships FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How do I practise self-care without my partner or friends feeling pushed away?</strong><br />
        A: Frame self-care in terms of what it gives the relationship rather than what it takes from it. "I am going to spend an hour alone reading tonight because I need to recharge — and I will be better company after" is an explanation that invites understanding rather than insecurity. Most people in genuinely healthy relationships understand that their partner or friend having needs that are not solely about the relationship is not rejection. It is independence, which is one of the qualities that makes the relationship worth being in.</p>

        <p><strong>Q: I feel guilty taking time for myself when the people I love are struggling. How do I manage this?</strong><br />
        A: The guilt is real and worth acknowledging. It is also, in most cases, a conditioned response rather than an accurate ethical signal. The version of you that has slept, processed your own emotions, and maintained your sense of self is genuinely more useful to a struggling person than the depleted version who has sacrificed everything to be present. Self-care during someone else's difficulty is not abandonment — it is the maintenance that makes sustained presence possible.</p>

        <p><strong>Q: What if self-care feels selfish specifically within Indian family culture, where collective wellbeing is prioritised?</strong><br />
        A: The value of collective wellbeing is genuine and not in opposition to individual self-care — but the two require a reframe from either/or to both/and. Self-care that makes you more genuinely present, more emotionally regulated, and more capable of contribution is also collective care. The family member who maintains their own health, processes their own emotions, and does not project unmet needs onto others is actively contributing to the family's collective wellbeing, not defecting from it. The challenge is finding the language that names it in those terms within your specific family context.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: FOREST, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Caring for myself is not self-indulgence. It is self-preservation, and that is an act of political warfare."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Audre Lorde</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          Every relationship in your life will benefit from the decision to take your own wellbeing seriously. Not eventually. Immediately. The most generous thing you can bring to the people you love is a version of yourself that has been tended to — rested, attended to, genuinely known. That is not a luxury. That is the work.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: FOREST, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${FBORDER}` }}
          >
            Start Your Self-Care Practice in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: FOREST, border: `2px solid ${FOREST}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Read More in This Series:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-kindness-check')} style={{ background: 'none', border: 'none', color: FOREST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Mid-Month Reset: Are You Treating Yourself with Kindness?
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-acceptance-confidence')} style={{ background: 'none', border: 'none', color: FOREST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Build Confidence Through Self-Acceptance
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/relationships-mental-health')} style={{ background: 'none', border: 'none', color: FOREST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How Relationships Affect Your Mental Health (Positive &amp; Negative)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/valentines-self-love')} style={{ background: 'none', border: 'none', color: FOREST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Valentine's Day Self-Love Guide: Love Yourself First
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: FOREST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
