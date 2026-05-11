import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "7 Signs of Academic Burnout Every Student Should Know",
  excerpt: "Academic burnout is not laziness and it is not weakness — it is the predictable result of sustained high demand without adequate recovery. Learn the seven warning signs, understand how emotional and physical symptoms compound each other, and use our Burnout Barometer to assess your current state and get a personalised recovery plan.",
  category: "Mental Health",
  date: "05-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/academic-burnout-signs.jpg",
  tldr: "Academic burnout affects a growing proportion of students and is consistently misidentified as laziness, procrastination, or lack of commitment — when it is actually a physiological and psychological state produced by chronic overextension without recovery. This guide covers the seven most important signs, explains the emotional and physical symptoms that distinguish burnout from ordinary tiredness, and includes a Burnout Barometer to assess your current level and generate a personalised recovery plan.",
  toc: [
    { id: "what-is",     title: "1. What Academic Burnout Actually Is (And Is Not)",               level: 3 },
    { id: "seven-signs", title: "2. The 7 Signs of Academic Burnout Every Student Should Know",    level: 3 },
    { id: "barometer",   title: "3. Interactive: The Burnout Barometer",                           level: 3 },
    { id: "emotional",   title: "4. Emotional vs Physical Burnout Symptoms — Why Both Matter",     level: 3 },
    { id: "recovery",    title: "5. Recovery Tips: How to Actually Recover from Academic Burnout", level: 3 },
    { id: "faq",         title: "6. Academic Burnout FAQs",                                        level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-05T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "academic burnout signs, signs of burnout in students, academic burnout symptoms, student burnout, study burnout, burnout recovery students, how to recover from academic burnout",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the signs of academic burnout in students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The seven most significant signs of academic burnout in students are: chronic exhaustion that does not improve with rest, emotional detachment or cynicism toward studies, significantly reduced performance despite continued or increased effort, loss of motivation and sense of purpose, physical symptoms including headaches and disrupted sleep, increased irritability and emotional reactivity, and a growing inability to concentrate or retain information. The critical distinction from ordinary tiredness is that burnout persists through rest periods and is not resolved by a single good night of sleep.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does academic burnout take to recover from?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Recovery from academic burnout depends heavily on how long the burnout state has been active and how comprehensively recovery is approached. Mild burnout — caught early and addressed with deliberate rest and reduced demands — can show meaningful improvement within two to four weeks. Severe burnout that has been developing over months typically requires a longer recovery of one to three months of deliberate, structured recovery that addresses both physiological depletion (sleep, nutrition, physical health) and psychological dimensions (restored sense of meaning, rebuilt boundaries, reduced demands).",
      },
    },
    {
      "@type": "Question",
      "name": "Is academic burnout the same as depression?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Academic burnout and depression share overlapping symptoms — exhaustion, reduced motivation, difficulty concentrating, and negative affect — but they are not the same condition. Burnout is specifically linked to chronic overextension in a specific domain (academics) and typically improves with genuine rest and reduced demands. Depression is a broader clinical condition that persists across contexts regardless of activity level and typically requires professional treatment rather than rest alone. However, sustained burnout can lead to depression, and the two conditions can coexist — which is one reason why seeking professional assessment when symptoms are severe or persistent is important.",
      },
    },
  ],
};

// ── Burnout Barometer Data ─────────────────────────────────────────────────────
const EMBER   = '#9B4E2A';
const EPALE   = '#FBF2ED';
const EBORD   = 'rgba(155,78,42,0.22)';

const BURNOUT_SIGNS = [
  {
    id:     'exhaustion',
    number: '01',
    icon:   '🪫',
    title:  'Chronic Exhaustion That Rest Does Not Fix',
    short:  'Persistent, bone-deep tiredness that a good night\'s sleep does not resolve',
    emotional_q: 'I feel emotionally drained even after sleeping — like I wake up already tired.',
    physical_q:  'My body feels heavy and depleted in a way that feels different from normal tiredness.',
    why: 'Ordinary tiredness is a physiological signal that rest will resolve. Burnout exhaustion is different — it is the result of chronic depletion of both physiological and psychological resources to a point where the normal recovery mechanisms are no longer working efficiently. The adrenal system, responsible for producing cortisol and adrenaline, becomes dysregulated under chronic stress, producing a state where the body cannot reliably restore its own baseline.',
    recovery: 'Prioritise sleep above all other recovery strategies — not better sleep habits alone, but genuinely protected, consistent sleep for a minimum of two weeks before attempting to rebuild study demands. The physiological depletion of burnout exhaustion requires time and patience that most students do not initially want to allocate.',
    severity_note: { mild: 'Normal end-of-term tiredness — monitor and protect your sleep.', moderate: 'Early burnout fatigue — reduce your current load before it deepens.', severe: 'Significant physiological depletion — rest is not optional at this point. Academic performance will not improve without it.' },
  },
  {
    id:     'cynicism',
    number: '02',
    icon:   '😶',
    title:  'Cynicism or Detachment From Studies',
    short:  'Subjects that once interested you now feel meaningless, pointless, or simply impossible to care about',
    emotional_q: 'I feel detached or indifferent about studying — like it no longer matters in a way I can\'t explain.',
    physical_q:  'When I sit down to study, my body almost physically resists — I feel an aversion I cannot override with effort.',
    why: 'The cynicism and detachment of burnout is the psyche\'s protective mechanism — it emotionally distances itself from the source of chronic overwhelm as a way of managing unsustainable demand. Psychologist Christina Maslach, who developed the Maslach Burnout Inventory, identifies depersonalisation or cynicism as one of the three core dimensions of burnout alongside exhaustion and reduced efficacy. It is not a character failing or a sign that you do not care. It is your mind trying to protect itself from continued depletion.',
    recovery: 'Do not try to force re-engagement with academic content before addressing the underlying depletion. Forced engagement with detachment produces further aversion. Instead, spend time with activities that feel inherently meaningful — creative, relational, or physical — to restore the sense of intrinsic motivation before reintroducing academic demands.',
    severity_note: { mild: 'Some loss of interest — reconnect with why this field originally interested you.', moderate: 'Significant emotional detachment — reduce academic pressure and increase meaningful non-academic activity.', severe: 'Profound cynicism — professional support is appropriate if this persists beyond two weeks of reduced load.' },
  },
  {
    id:     'performance',
    number: '03',
    icon:   '📉',
    title:  'Declining Performance Despite Equal or Greater Effort',
    short:  'Working as hard as or harder than before, but producing increasingly poor results',
    emotional_q: 'I feel like no matter how much I put in, the results keep getting worse — and I have stopped trusting my own ability.',
    physical_q:  'My brain feels foggy when I try to study or recall information — like trying to see through clouded glass.',
    why: 'This is one of the most distressing features of burnout and one of the most diagnostic. When a student is simply undertrained or underprepared, increased effort produces improved results. When a student is burned out, increased effort produces worse results — because the effort is being applied through a depleted cognitive system that is no longer capable of its normal efficiency. The prefrontal cortex, responsible for learning, memory consolidation, and complex reasoning, is among the first brain regions to show measurable impairment under chronic stress.',
    recovery: 'Counter-intuitively, the solution to declining performance under burnout is less studying rather than more. Continued high-effort studying through burnout produces further depletion without the cognitive infrastructure to convert effort into learning. Rest, sleep, and reduced demands first — then a gradual, gentle return to study with realistic expectations about pace.',
    severity_note: { mild: 'Minor performance dip — check your sleep and study method quality.', moderate: 'Clear performance-effort mismatch — significant workload reduction is needed.', severe: 'Severe impairment — pushing harder will make this worse. Rest is the highest priority academic strategy available to you right now.' },
  },
  {
    id:     'motivation',
    number: '04',
    icon:   '🔋',
    title:  'Loss of Motivation and Sense of Purpose',
    short:  'The reasons you chose this path no longer feel real, and you cannot remember why any of it matters',
    emotional_q: 'I have lost sight of why I am studying — the purpose behind it feels hollow or impossible to access.',
    physical_q:  'Starting any academic task feels like trying to start a car with an empty tank — the effort is there but nothing fires.',
    why: 'Intrinsic motivation — the internal drive that sustains learning and achievement — is among the first casualties of burnout. Research on self-determination theory by Edward Deci and Richard Ryan shows that intrinsic motivation requires three conditions: a sense of competence, a sense of autonomy, and a sense of connection to something meaningful. Burnout systematically erodes all three: it reduces competence through declining performance, undermines autonomy through the feeling of being trapped in relentless demand, and severs the connection to meaning through cynicism and detachment.',
    recovery: 'Reconnect with the original source of meaning in your studies — not the external validation (grades, parental approval, competitive rank) but the internal pull. What drew you to this subject area before the pressure distorted it? Spend time with that, even informally, outside of any assessment context.',
    severity_note: { mild: 'Motivation temporarily low — reconnect with your "why" and give yourself a genuine break.', moderate: 'Significant loss of purpose — meaningful rest and a conversation with a trusted mentor is warranted.', severe: 'Profound loss of meaning — please reach out to a counsellor. This level of detachment from purpose is significant.' },
  },
  {
    id:     'physical',
    number: '05',
    icon:   '🤕',
    title:  'Physical Symptoms — Headaches, Illness, and Sleep Disruption',
    short:  'Getting sick more often, frequent headaches, disrupted sleep, or a body that feels chronically unwell',
    emotional_q: 'I feel a pervasive physical unease — like my body is carrying a weight that is not just emotional.',
    physical_q:  'I have had noticeably more headaches, illnesses, or sleep problems than usual in the past month.',
    why: 'Burnout is not a purely psychological experience — it is a physiological state with measurable biological markers. Chronic cortisol elevation suppresses immune function (explaining increased illness frequency), disrupts the hypothalamic-pituitary-adrenal (HPA) axis (disrupting sleep-wake cycles and energy regulation), and produces chronic muscle tension that often presents as headache and neck pain. Research by Mary Dallman at UCSF documented the specific immune system changes associated with burnout. The body is not imagining these symptoms. They are real physiological consequences of chronic overextension.',
    recovery: 'Address the physical symptoms as legitimate medical information rather than as inconveniences to be managed around. See a doctor if physical symptoms are significant. Prioritise sleep restoration, nutritional adequacy, and regular physical movement — all of which have direct, documented effects on cortisol regulation and immune function.',
    severity_note: { mild: 'Mild physical stress symptoms — improve sleep and nutrition consistently.', moderate: 'Physical symptoms affecting daily functioning — reduce academic load and see a doctor if symptoms persist.', severe: 'Significant physical impact — medical attention is appropriate. Physical burnout symptoms are real physiological events.' },
  },
  {
    id:     'irritability',
    number: '06',
    icon:   '⚡',
    title:  'Increased Irritability and Emotional Reactivity',
    short:  'Smaller things triggering disproportionate emotional responses — frustration, anger, or tearfulness with no obvious cause',
    emotional_q: 'My emotional responses have become disproportionate — small things feel overwhelming, and I snap at people more than usual.',
    physical_q:  'My body goes from calm to highly activated very quickly — like a short fuse that is getting shorter.',
    why: 'The emotional dysregulation of burnout has a direct neurological explanation. The prefrontal cortex, which regulates emotional responses and maintains the capacity for considered reaction rather than impulsive reaction, is significantly impaired by chronic cortisol elevation. As the prefrontal cortex goes offline, the amygdala — which produces raw, unregulated emotional responses — has less inhibition. The result is exactly what burned-out students describe: smaller triggers, bigger responses, and a felt sense of losing emotional control that is itself distressing.',
    recovery: 'Recognise the irritability as a symptom of depletion rather than a character problem. Apologise where specific behaviour caused harm. But do not add self-criticism to the existing burnout load — the irritability is a diagnostic signal, not a moral failing. Reducing the overall cortisol load through rest, movement, and decreased demands reduces the emotional reactivity directly.',
    severity_note: { mild: 'Slightly shorter fuse than usual — protect your recovery time.', moderate: 'Noticeable emotional dysregulation affecting relationships — significant load reduction needed.', severe: 'Emotional responses significantly impacting relationships and daily life — professional support is appropriate.' },
  },
  {
    id:     'concentration',
    number: '07',
    icon:   '🌫️',
    title:  'Inability to Concentrate or Retain Information',
    short:  'Reading the same paragraph repeatedly without it registering, mind wandering constantly, or studying for hours and retaining almost nothing',
    emotional_q: 'I sit down to study and nothing sticks — I feel mentally absent even when I am physically present at my desk.',
    physical_q:  'My mind feels foggy, unfocused, and scattered — I cannot seem to hold attention on one thing for more than a few minutes.',
    why: 'The cognitive impairment of burnout — often called "brain fog" — is the most academically disruptive symptom and also one of the most demoralising, because it leads students to study more (trying to compensate for low efficiency) which deepens the burnout. Working memory, the cognitive system responsible for holding and manipulating information during learning, is severely impaired by chronic cortisol. Attention regulation — the capacity to maintain focus and suppress distracting information — is similarly impaired. The student is not failing to try. The cognitive infrastructure for effective learning has been temporarily degraded by burnout.',
    recovery: 'Reduce study demands immediately. Low-efficiency studying through burnout produces almost no learning and accelerates depletion. Prioritise sleep (which restores hippocampal function most directly), reduce overall cognitive load, and return to study gradually — in short, bounded sessions — as concentration capacity begins to return.',
    severity_note: { mild: 'Mild concentration difficulties — try the Pomodoro technique and improve sleep.', moderate: 'Significant cognitive impairment — reduce your current study load and prioritise rest.', severe: 'Severe cognitive fog — further study is counterproductive. Rest is the highest-priority academic strategy.' },
  },
];

const RATING_OPTS = [
  { label: 'Not at all', value: 0 },
  { label: 'Occasionally', value: 1 },
  { label: 'Often',        value: 2 },
  { label: 'Almost always', value: 3 },
];

function getSignScore(answers, sign) {
  const eq = answers[`${sign.id}_e`];
  const pq = answers[`${sign.id}_p`];
  if (eq === undefined || pq === undefined) return null;
  return eq + pq;
}

function getSignTier(score) {
  if (score >= 5) return { label: 'Severe',   color: '#C0392B', bg: '#FDECEA', icon: '🔴' };
  if (score >= 3) return { label: 'Moderate', color: '#C07800', bg: '#FFF8E1', icon: '🟠' };
  if (score >= 1) return { label: 'Mild',     color: '#2D7D46', bg: '#E8F5EE', icon: '🟡' };
  return               { label: 'Minimal',   color: '#666',    bg: '#F5F5F5', icon: '🟢' };
}

// ── Barometer Component ────────────────────────────────────────────────────────
function BurnoutBarometer() {
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openSign,  setOpenSign]  = useState(null);
  const [openRec,   setOpenRec]   = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const totalQ    = BURNOUT_SIGNS.length * 2;
  const answered  = BURNOUT_SIGNS.reduce((t, s) =>
    t + (answers[`${s.id}_e`] !== undefined ? 1 : 0) + (answers[`${s.id}_p`] !== undefined ? 1 : 0), 0);
  const allDone   = answered === totalQ;
  const progress  = Math.round((answered / totalQ) * 100);

  const scores    = BURNOUT_SIGNS.map(s => ({ sign: s, score: getSignScore(answers, s) }));
  const totalScore = scores.reduce((t, s) => t + (s.score || 0), 0);
  const maxScore   = BURNOUT_SIGNS.length * 6;
  const overallPct = submitted ? Math.round((totalScore / maxScore) * 100) : 0;

  const sortedByScore = [...scores.filter(s => s.score !== null)].sort((a, b) => b.score - a.score);
  const topSigns = sortedByScore.slice(0, 3);

  const getOverallLevel = () => {
    if (overallPct >= 65) return { label: 'Significant Burnout', icon: '🔴', color: '#C0392B', msg: 'Your scores indicate significant academic burnout across multiple dimensions. This is not a study problem — it is a wellbeing emergency that needs immediate attention. Please reduce your academic load and reach out to a counsellor or trusted adult.' };
    if (overallPct >= 40) return { label: 'Moderate Burnout',    icon: '🟠', color: '#C07800', msg: 'You are showing clear burnout signs in several areas. Without deliberate intervention, this typically worsens. The recovery tips for your top signs are worth taking seriously this week.' };
    if (overallPct >= 20) return { label: 'Early Burnout',       icon: '🟡', color: '#B07B2A', msg: 'You are in the early stages of burnout — the most manageable stage to intervene. Several warning signs are present but have not yet cascaded into severe impairment.' };
    return                  { label: 'Low Burnout Risk',         icon: '🟢', color: '#2D7D46', msg: 'Your burnout indicators are currently low. The awareness from this assessment is itself protective — continue monitoring, especially during high-pressure periods.' };
  };

  const handleReset = () => { setAnswers({}); setSubmitted(false); setOpenSign(null); setOpenRec(null); };
  const setAnswer   = (key, val) => setAnswers(p => ({ ...p, [key]: val }));

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {!submitted ? (
        <>
          <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Rate each statement based on the past 2–4 weeks — not your best or worst day, your typical experience.
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Each sign has an emotional and a physical dimension. Answer both honestly. The barometer is only as useful as your honesty.
          </p>

          {/* Progress */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>{answered} of {totalQ} answered</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: EMBER }}>{progress}%</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(155,78,42,0.12)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${EMBER}, #C4723E)`, borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {BURNOUT_SIGNS.map(sign => {
            const isOpen   = openSign === sign.id;
            const eDone    = answers[`${sign.id}_e`] !== undefined;
            const pDone    = answers[`${sign.id}_p`] !== undefined;
            const bothDone = eDone && pDone;
            return (
              <div key={sign.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '10px', border: '2px solid', borderColor: bothDone ? EMBER : 'var(--border)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setOpenSign(isOpen ? null : sign.id)} style={{ width: '100%', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{sign.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Sign {sign.number}</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{sign.title}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {bothDone && <span style={{ background: EMBER, color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</span>}
                    <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)' }}>
                    {/* Emotional */}
                    <div style={{ paddingTop: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#7B2D5E', marginBottom: '6px' }}>💜 Emotional</div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55 }}>{sign.emotional_q}</p>
                      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                        {RATING_OPTS.map(opt => {
                          const isSel = answers[`${sign.id}_e`] === opt.value;
                          return (
                            <button key={opt.value} onClick={() => setAnswer(`${sign.id}_e`, opt.value)} style={{
                              padding: '6px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '600',
                              border: '2px solid', fontFamily: font, cursor: 'pointer', transition: 'all 0.15s',
                              borderColor: isSel ? EMBER : 'var(--border)',
                              background: isSel ? EMBER : 'white',
                              color: isSel ? 'white' : 'var(--ink-soft)',
                            }}>{opt.label}</button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Physical */}
                    <div style={{ paddingTop: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#2D6A8F', marginBottom: '6px' }}>💙 Physical</div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55 }}>{sign.physical_q}</p>
                      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                        {RATING_OPTS.map(opt => {
                          const isSel = answers[`${sign.id}_p`] === opt.value;
                          return (
                            <button key={opt.value} onClick={() => setAnswer(`${sign.id}_p`, opt.value)} style={{
                              padding: '6px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '600',
                              border: '2px solid', fontFamily: font, cursor: 'pointer', transition: 'all 0.15s',
                              borderColor: isSel ? EMBER : 'var(--border)',
                              background: isSel ? EMBER : 'white',
                              color: isSel ? 'white' : 'var(--ink-soft)',
                            }}>{opt.label}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={() => { if (allDone) setSubmitted(true); }} disabled={!allDone} style={{
            width: '100%', padding: '15px', borderRadius: '10px', border: 'none', marginTop: '8px',
            background: allDone ? `linear-gradient(135deg, ${EMBER}, #C4723E)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: font,
            cursor: allDone ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
            boxShadow: allDone ? `0 6px 20px ${EBORD}` : 'none',
          }}>
            {allDone ? 'See My Burnout Report →' : `Open each sign and answer all ${totalQ - answered} remaining questions`}
          </button>
        </>
      ) : (
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          {(() => {
            const level = getOverallLevel();
            return (
              <>
                {/* Overall */}
                <div style={{ background: `linear-gradient(135deg, ${EMBER}, #C4723E)`, borderRadius: '14px', padding: '26px 22px', marginBottom: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{level.icon}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                    {level.label} — {overallPct}%
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, maxWidth: '440px', margin: '0 auto' }}>{level.msg}</div>
                </div>

                {/* All 7 sign scores */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${EBORD}` }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
                    Your Burnout Profile Across All 7 Signs
                  </div>
                  {scores.map(({ sign, score }) => {
                    if (score === null) return null;
                    const tier = getSignTier(score);
                    const pct  = Math.round((score / 6) * 100);
                    return (
                      <div key={sign.id} style={{ marginBottom: '11px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {sign.icon} {sign.title.split(' ').slice(0, 4).join(' ')}{sign.title.split(' ').length > 4 ? '…' : ''}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: tier.color, flexShrink: 0 }}>{tier.icon} {tier.label}</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: tier.color, borderRadius: '6px', transition: 'width 1.2s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Top 3 priority signs with recovery */}
                <div style={{ background: EPALE, border: `2px solid ${EBORD}`, borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: EMBER }}>
                    🔥 Your Top Burnout Signs — Priority Recovery Areas
                  </p>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                    These are your highest-scoring signs. Expand each one for your personalised recovery tip and what your severity level means.
                  </p>
                  {topSigns.map(({ sign }) => {
                    const score   = getSignScore(answers, sign);
                    const tier    = getSignTier(score);
                    const isOpen  = openRec === sign.id;
                    const sevKey  = tier.label.toLowerCase();
                    return (
                      <div key={sign.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '10px', overflow: 'hidden', border: `1.5px solid ${EBORD}`, borderLeft: `4px solid ${EMBER}` }}>
                        <button onClick={() => setOpenRec(isOpen ? null : sign.id)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font }}>
                          <span style={{ fontSize: '20px' }}>{sign.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: EMBER }}>{sign.title}</div>
                            <div style={{ fontSize: '11px', color: tier.color, fontWeight: '700', marginTop: '1px' }}>{tier.icon} {tier.label} — {Math.round((score / 6) * 100)}%</div>
                          </div>
                          <span style={{ color: EMBER, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                            <div style={{ background: EPALE, borderRadius: '10px', padding: '12px 14px', marginTop: '14px', marginBottom: '10px' }}>
                              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: EMBER, marginBottom: '5px' }}>🔍 What This Means at Your Level</div>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--brown)', lineHeight: 1.7 }}>
                                {sign.severity_note[sevKey === 'minimal' ? 'mild' : sevKey]}
                              </p>
                            </div>
                            <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: `1px solid ${EBORD}` }}>
                              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: EMBER, marginBottom: '5px' }}>🌱 Recovery Tip</div>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{sign.recovery}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Affirmation */}
                <div style={{ background: 'white', border: `1.5px dashed ${EBORD}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: EMBER, fontStyle: 'italic', lineHeight: 1.55 }}>
                    {overallPct >= 65
                      ? '"Recognising burnout is the first and most important step. You are already doing the hardest part."'
                      : overallPct >= 40
                      ? '"Catching burnout early is not a sign of weakness — it is the act of someone who takes their own wellbeing seriously."'
                      : '"Awareness is protection. Keep watching these signs as the term progresses."'}
                  </p>
                </div>

                {overallPct >= 65 && (
                  <div style={{ background: '#FEF3C7', border: '2px solid rgba(192,120,0,0.35)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309', marginBottom: '6px' }}>⚠️ A Direct Note</div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400E', lineHeight: 1.7 }}>
                      At this level of burnout, self-management strategies help — but they are not sufficient on their own. Please speak to a counsellor, your college's student welfare office, or a trusted adult this week.
                    </p>
                  </div>
                )}

                <button onClick={handleReset} style={{
                  background: 'transparent', border: `1.5px solid ${EBORD}`, color: EMBER,
                  padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                  fontWeight: '700', fontFamily: font,
                }}>↺ Retake the Barometer</button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AcademicBurnoutSigns({ navigate, relatedPosts }) {
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
      <p>There is a specific way that academic burnout announces itself — not dramatically, but gradually. First you notice that studying takes more effort than it used to. Then you notice that the effort is producing less. Then the subjects you used to find interesting begin to feel hollow. Then rest stops feeling restful. By the time most students recognise what is happening, the burnout has been building for weeks or months.</p>

      <p>The seven <strong>academic burnout signs</strong> in this guide are not always obvious, because burnout is consistently misidentified — by students, by parents, and sometimes by teachers — as laziness, poor time management, or lack of commitment. It is none of those things. It is the predictable physiological and psychological consequence of sustained high demand without adequate recovery, and it deserves to be taken as seriously as any other health condition.</p>

      <img
        src={meta.imgUrl}
        alt="Student showing signs of academic burnout — understanding the seven warning signs and how to recover naturally"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-is">1. What Academic Burnout Actually Is (And Is Not)</h3>
      <p>The term "burnout" was introduced into psychological literature by Herbert Freudenberger in 1974 and developed into a systematic framework by psychologist Christina Maslach, whose Maslach Burnout Inventory remains the most widely used assessment in research and clinical settings. Maslach defines burnout through three dimensions: emotional exhaustion (the depletion of emotional resources), depersonalisation (the development of cynicism or detachment toward work), and reduced personal accomplishment (the decline in felt competence and productivity).</p>
      <p>In academic contexts, burnout is produced by a specific set of conditions: high, sustained academic demands; inadequate recovery time; lack of genuine autonomy over study choices; minimal positive reinforcement relative to criticism or pressure; and insufficient social support. The Indian student context specifically adds several amplifiers: competitive entrance exam culture that places existential weight on single assessments, family and social pressure that creates additional emotional load alongside academic load, and cultural norms around rest that can frame recovery as laziness or insufficient commitment.</p>
      <p>What burnout is not: it is not lack of intelligence, it is not poor character, it is not evidence that you chose the wrong field, and it is not laziness. It is a medical and psychological state — recognised in the World Health Organisation's International Classification of Diseases since 2019 as an occupational phenomenon — that requires real intervention rather than exhortations to "try harder."</p>

      {/* ── Section 2 ── */}
      <h3 id="seven-signs">2. The 7 Signs of Academic Burnout Every Student Should Know</h3>

      {BURNOUT_SIGNS.map((sign, i) => (
        <div key={sign.id} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '10px' }}>
            <div style={{ minWidth: '52px', height: '52px', borderRadius: '12px', background: `linear-gradient(135deg, ${EMBER}, #C4723E)`, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', opacity: 0.8 }}>{sign.number}</div>
              <div style={{ fontSize: '20px', lineHeight: 1 }}>{sign.icon}</div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>{sign.title}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>{sign.short}</p>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{sign.why}</p>
        </div>
      ))}

      {/* ── Section 3: Interactive ── */}
      <h3 id="barometer">3. Interactive: The Burnout Barometer</h3>
      <p>The Barometer assesses each of the seven signs across both its emotional and physical dimensions. Rate your experience honestly across the past two to four weeks — not on your best day or your worst, but your typical experience. At the end, you will receive a full burnout profile across all seven signs with your severity level for each, your three priority areas, and specific recovery tips calibrated to where you actually are.</p>

      <BurnoutBarometer />

      {/* ── Section 4 ── */}
      <h3 id="emotional">4. Emotional vs Physical Burnout Symptoms — Why Both Matter</h3>
      <p>Most students first notice burnout through its cognitive symptoms — difficulty concentrating, declining performance, inability to retain information. These are the most academically visible signs and the ones most likely to be attributed to study method problems rather than burnout. But burnout operates simultaneously across emotional and physical dimensions, and understanding the full picture is important for both accurate identification and effective recovery.</p>
      <p><strong>The emotional dimension</strong> of academic burnout includes: emotional exhaustion (the depletion of the capacity to feel engaged, enthusiastic, or invested in academic work), cynicism or depersonalisation (emotional detachment from subjects, teachers, and the entire academic project), reduced sense of personal accomplishment (the erosion of the belief that your effort produces worthwhile outcomes), and increased emotional reactivity (smaller triggers producing disproportionate emotional responses — irritability, tearfulness, or a short temper that feels foreign and out of control).</p>
      <p>The emotional dimension is often the last to be treated in recovery — students (and parents, and teachers) tend to prioritise the visible performance dimensions over the emotional ones. But the emotional recovery is frequently what makes the performance recovery possible. A student who has reduced their study load and is sleeping more but is still emotionally detached and cynical toward their studies has not fully recovered. The emotional reconnection — to meaning, to interest, to a genuine sense of personal accomplishment — is the final and sometimes the hardest piece.</p>
      <p><strong>The physical dimension</strong> of academic burnout is perhaps the most surprising to students who have not encountered it before — because burnout is usually conceptualised as a psychological state, and its physical expressions can feel disconnected from an academic cause. Physical burnout symptoms include: persistent fatigue that sleep does not resolve, increased frequency of minor illnesses (because chronic cortisol suppresses immune function), headaches and muscle tension (particularly in the neck, shoulders, and jaw — where anxiety concentrates), disrupted sleep (difficulty falling asleep, staying asleep, or waking too early despite exhaustion), changes in appetite, and gastrointestinal symptoms.</p>
      <p>These physical symptoms are not imaginary or psychosomatic in the dismissive sense. They are direct physiological consequences of chronic HPA axis activation — real biological events produced by sustained stress without adequate recovery. They deserve to be taken seriously as physical health concerns, and in severe cases, medical attention is appropriate alongside mental health support.</p>

      {/* ── Section 5 ── */}
      <h3 id="recovery">5. Recovery Tips: How to Actually Recover from Academic Burnout</h3>
      <p><strong>Step 1: Reduce the demand before trying to restore the capacity.</strong> The single most common and most damaging mistake burned-out students make is trying to study their way out of burnout — pushing harder, extending sessions, adding more mock tests. This accelerates the depletion. The first step in genuine recovery is reducing academic demand — not permanently, and not necessarily dramatically, but genuinely and immediately. This is counterintuitive when exams are approaching, but the cognitive capacity for effective studying does not become available until the system has some genuine recovery time.</p>
      <p><strong>Step 2: Protect sleep above all other recovery strategies.</strong> Sleep is the body's primary mechanism for cortisol regulation, immune restoration, and hippocampal consolidation of learning. Eight hours of sleep produces more cognitive and academic recovery per unit of time than any other intervention. In burnout, most students are simultaneously sleep-deprived and under-studying (spending long hours in a low-efficiency fog) — and prioritising sleep addresses both the depletion and the inefficiency at once.</p>
      <p><strong>Step 3: Restore physiological baseline through movement and nutrition.</strong> Physical exercise is the most comprehensively evidence-supported intervention for cortisol reduction available. Even twenty minutes of walking per day produces measurable reduction in cortisol and measurable improvement in mood and cognitive function. Nutritional adequacy — regular meals with adequate protein and carbohydrates — prevents the blood sugar dysregulation that amplifies all anxiety and burnout symptoms.</p>
      <p><strong>Step 4: Reconnect with meaning before reconnecting with content.</strong> Before returning to studying, spend time with what originally drew you to your field or your ambition — not in an academic context, but in whatever form is most authentic. For a medical aspiration, it might be reading about the history of medicine, or volunteering in a health setting, or simply talking to a doctor you admire. For a technology ambition, it might be working on a personal coding project with no grade attached. The emotional reconnection to intrinsic motivation is what makes the return to academic study sustainable rather than a short-lived burst before the next burnout cycle.</p>
      <p><strong>Step 5: Rebuild demands gradually and with genuine boundaries.</strong> When returning to regular study, build back gradually — shorter sessions at first, with genuine days off, genuine rest periods within study days, and a weekly review structure that allows adaptation rather than accumulation of debt. The return to full study intensity should take weeks rather than days. The student who rushes back to full intensity the moment they feel slightly better typically experiences a second and usually worse burnout episode.</p>
      <p><strong>Step 6: Address the sources, not just the symptoms.</strong> Burnout that is produced by specific structural problems — an unrealistic schedule, a family environment of chronic pressure, a learning context that offers no positive reinforcement, or a competitive peer environment that continuously activates social threat — will recur unless those sources are also addressed. This may require conversations with parents about the pressure they are applying, with teachers about realistic expectations, or with yourself about the standards and timelines you are holding yourself to.</p>
      <p><strong>Step 7: Seek professional support for severe or persistent burnout.</strong> Burnout that has been active for more than a month, that involves significant functional impairment, or that is accompanied by hopelessness, persistent low mood, or thoughts of self-harm is outside the scope of self-management. A counsellor or psychologist who works with students can provide both the therapeutic relationship (itself deeply restorative for someone who has been experiencing chronic depletion in isolation) and the professional tools to address the dimensions of burnout that self-help strategies cannot reach.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Academic Burnout FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Can I study during burnout recovery, or do I need a complete break?</strong><br />
        A: A complete cessation of all study is rarely necessary and often counterproductive if exams are genuinely approaching. What burnout recovery requires is a significant reduction in both the quantity and the intensity of study, combined with genuine rest in the spaces that study no longer occupies. Short, focused, low-pressure study sessions — well below your normal load — are preferable to either complete cessation or continued full-intensity study through burnout. Think of it as healing a physical injury: you reduce the load on the injured area without stopping all movement entirely.</p>

        <p><strong>Q: My parents do not believe in burnout and think I am making excuses. How do I explain it?</strong><br />
        A: The WHO's 2019 recognition of burnout in the International Classification of Diseases may be a useful starting point — it is not a concept invented by students looking for an excuse; it is a recognised occupational phenomenon with a documented physiological basis. Beyond the clinical framing, the most effective approach with parents who are sceptical is to connect burnout's effects to outcomes they care about: declining performance despite equal or greater effort is not the result of insufficient commitment — it is the result of studying through a cognitively impaired state that prevents learning from occurring. The path to better results runs through the recovery, not around it.</p>

        <p><strong>Q: How do I prevent burnout from happening again after I recover?</strong><br />
        A: Prevention is significantly easier than recovery. The three most effective preventive practices are: genuine weekly rest (one full day per week with no academic activity), protected sleep regardless of workload pressure, and regular self-monitoring with something like the Barometer above — used monthly during high-pressure academic periods rather than only after symptoms become severe. The student who checks in with their own burnout indicators regularly and reduces demands when early signs appear will almost never experience severe burnout — because the escalation is interrupted at the earliest and most manageable stage.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: EMBER, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Burning out is not a badge of hard work. It is a signal that something in the system needs to change — and the most important thing in that system is you."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          You cannot study your way out of burnout. You cannot push through it to the other side. The only path through is rest, reduced demands, and the gradual rebuilding of the physiological and psychological resources that sustained overextension has depleted. That path is worth taking — not just for your academic results, but for the person you are trying to become through all of this.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: EMBER, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${EBORD}` }}
          >
            Process This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: EMBER, border: `2px solid ${EMBER}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Get Support in our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Related Student Wellbeing Guides:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/student-stress-management', '→ Student Stress Management: Practical Techniques That Actually Work'],
            ['/blog/exam-stress-management',    '→ How to Handle Exam Stress Without Panic'],
            ['/blog/study-plan-reduce-stress',  '→ How to Create a Study Plan That Reduces Stress and Improves Focus'],
            ['/blog/self-kindness-check',       '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/blog/saying-no-mental-health',   '→ Why Saying No is Important for Mental Health'],
            ['/safe',                           '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: EMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
