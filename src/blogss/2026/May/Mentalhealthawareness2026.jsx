import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Why Mental Health Awareness Matters More Than Ever in 2026",
  excerpt: "Mental health awareness is not a trend — it is a response to a documented, growing, and deeply underserved need. In 2026, the combination of post-pandemic psychological aftermath, academic pressure intensification, digital environment effects on developing brains, and persistent cultural stigma around seeking help has produced a student mental health landscape that is more challenging than at any previous measured point. Understanding why awareness matters is the first step toward changing what can be changed.",
  category: "Mental Health",
  date: "01-05-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/May/mental-health-awareness-2026.jpg",
  tldr: "May is Mental Health Awareness Month — and in 2026, the statistics documenting student mental health challenges globally and in India are more urgent than at any previous measured point. This blog explains the current landscape, the specific challenges of 2026, why awareness campaigns matter, and what students can do — and includes an interactive Myths vs. Facts awareness check.",
  toc: [
    { id: "landscape",   title: "1. The 2026 Student Mental Health Landscape",                        level: 3 },
    { id: "stats",       title: "2. The Statistics — What the Data Shows",                            level: 3 },
    { id: "quiz",        title: "3. Interactive: The Mental Health Awareness Check",                  level: 3 },
    { id: "challenges",  title: "4. The Specific Challenges Students Face in 2026",                   level: 3 },
    { id: "campaigns",   title: "5. Why Awareness Campaigns Matter",                                  level: 3 },
    { id: "action",      title: "6. What Students Can Do — Right Now",                               level: 3 },
    { id: "faq",         title: "7. Mental Health Awareness 2026 FAQs",                              level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-05-01T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mental health awareness 2026, student mental health statistics, mental health India students, mental health awareness month May, youth mental health crisis, mental health stigma India, student mental health challenges 2026",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is mental health awareness important for students in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mental health awareness is especially critical for students in 2026 for four specific reasons. First, the statistical need: research and surveys document that approximately 1 in 5 young people globally experiences a mental health condition in any given year, with anxiety and depression being the most prevalent. Second, the treatment gap: globally, and particularly in India, the majority of young people with mental health conditions do not receive any treatment — awareness is the first step in closing this gap. Third, the 2026 context: students are navigating a more complex landscape than any previous generation — prolonged social media exposure, post-pandemic social reintegration challenges, intensified academic competition, and persistent stigma around seeking help. Fourth, the stigma barrier: cultural and social stigma remains the primary reason young people do not seek help when they need it — awareness campaigns specifically address this barrier by normalising conversations about mental health.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the most common mental health challenges for Indian students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research on Indian student mental health identifies the most prevalent challenges as: academic performance anxiety (the pressure associated with board examinations, competitive entrance tests, and family expectations around academic achievement); social comparison and status anxiety (intensified by social media and the visibility of peers' achievements); career and future uncertainty (particularly for students navigating the gap between traditional family career expectations and evolving economic realities); isolation and loneliness (documented as increasing particularly among urban students despite high social media use); and the specific psychological effects of examination culture — particularly the identity-level threat that disappointing results can produce when academic performance and self-worth have become conflated. The treatment gap for these conditions in India remains significant: estimates suggest fewer than 20% of young people with mental health conditions in India receive any professional support.",
      },
    },
    {
      "@type": "Question",
      "name": "How can I support mental health awareness as a student?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Students can support mental health awareness through five practical actions. First, have honest conversations: talking openly about mental health — your own experiences, your struggles, what helps — directly reduces the stigma that prevents others from seeking help. Second, check in on peers: a simple genuine 'how are you actually doing?' creates the opening for honest conversation that may be the first step someone else needed. Third, share reliable resources: SecretSharz, iCall, Vandrevala Foundation, and other evidence-based resources help when the person needs to reach further than a friend conversation. Fourth, challenge stigma when it appears: gently correcting mental health myths, pushing back on dismissive language ('just cheer up,' 'you're overreacting'), and not participating in stigmatising humour all reduce the cultural barrier to help-seeking. Fifth, take care of your own mental health: the person who has practised their own mental health maintenance is better equipped to support others than the person who has not.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const AWARE   = '#2A8A60';
const APALE   = '#E8F6F1';
const ABORD   = 'rgba(42,138,96,0.22)';

// ── Statistics ─────────────────────────────────────────────────────────────────
const STATS = [
  { stat: '1 in 5',    context: 'young people globally experience a mental health condition each year', source: 'WHO, 2024', color: '#8B2635', bg: '#FBF0F1', icon: '🌍' },
  { stat: '~75%',      context: 'of mental health conditions begin before the age of 25', source: 'WHO / Lancet Psychiatry', color: '#2D5A8A', bg: '#EEF3FB', icon: '⏰' },
  { stat: '<20%',      context: 'of young people with mental health conditions in India receive professional support', source: 'NIMHANS National Survey', color: AWARE, bg: APALE, icon: '🇮🇳' },
  { stat: '56%',       context: 'increase in reported anxiety among Indian college students since 2020', source: 'IIT/IIM collaborative studies, 2024', color: '#C07800', bg: '#FFF8E1', icon: '📈' },
  { stat: '3.5 hrs',   context: 'average daily social media use among Indian teenagers in 2025', source: 'TRAI / Statista India', color: '#5B3A8B', bg: '#F2EEF9', icon: '📱' },
  { stat: '1 in 3',    context: 'Indian students report significant academic performance anxiety affecting daily functioning', source: 'ASSOCHAM Education Survey, 2024', color: '#B54F20', bg: '#FBF2EE', icon: '📚' },
];

// ── Quiz Questions ─────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Mental health conditions are rare — most people will never experience one.',
    isMyth: true,
    fact: 'MYTH. The WHO documents that approximately 1 in 5 people worldwide experience a mental health condition in any given year. Across a lifetime, nearly 50% of people will meet criteria for a mental health condition. Mental health conditions are among the most common health challenges globally.',
    stat: '1 in 5 people globally experience a mental health condition each year.',
    color: '#8B2635',
  },
  {
    id: 2,
    question: 'Mental health conditions are a sign of personal weakness or lack of willpower.',
    isMyth: true,
    fact: 'MYTH. Mental health conditions are medical conditions with documented biological, psychological, and social causes — they involve measurable changes in brain function, neurochemistry, and neural architecture. Willpower does not determine whether someone develops diabetes or asthma; the same is true of depression, anxiety, or any other mental health condition. This myth is among the most damaging because it prevents people from seeking the help they deserve.',
    stat: 'Mental health conditions have measurable neurobiological bases — they are medical, not moral, conditions.',
    color: '#5B3A8B',
  },
  {
    id: 3,
    question: 'Most young people with mental health conditions in India never receive professional help.',
    isMyth: false,
    fact: 'FACT. Research estimates that fewer than 20% of young people with mental health conditions in India receive any professional support. The gap between need and treatment is among the largest in the world — driven by stigma, limited mental health infrastructure (India has approximately 0.3 psychiatrists per 100,000 people, compared to a WHO recommendation of 3), financial barriers, and cultural factors that frame psychological distress as spiritual or family failure.',
    stat: 'Less than 20% of young people with mental health conditions in India receive professional support.',
    color: AWARE,
  },
  {
    id: 4,
    question: 'Talking about suicide with someone who is struggling puts the idea in their head.',
    isMyth: true,
    fact: 'MYTH. This fear is one of the most common and most harmful misconceptions in mental health awareness. Research consistently shows the opposite: asking someone directly about suicidal thoughts reduces risk rather than increasing it. Direct, compassionate conversation about suicidal ideation allows the person to be heard, validates their experience, and opens the door to connecting them with help. Avoiding the topic does not protect them — it leaves them more alone with their experience.',
    stat: 'Asking about suicidal thoughts reduces risk — it does not increase it.',
    color: '#8B2635',
  },
  {
    id: 5,
    question: 'Academic pressure and exam stress can cause clinical anxiety and depression.',
    isMyth: false,
    fact: 'FACT. Research documents that sustained academic pressure produces measurable changes in cortisol regulation, sleep quality, immune function, and neurological development. Acute and chronic examination stress are documented precursors to clinical anxiety and depressive episodes in student populations. The competitive examination culture in India — particularly the high-stakes of board examinations and JEE/NEET preparation — has been specifically associated with elevated mental health risk, including suicidality, in published research.',
    stat: 'Sustained academic pressure is a documented risk factor for clinical anxiety and depression in students.',
    color: '#2D5A8A',
  },
  {
    id: 6,
    question: 'If you seek professional mental health support, it means you cannot handle your problems.',
    isMyth: true,
    fact: 'MYTH. Seeking professional support for mental health is the same as seeking professional support for any other medical condition — it is an appropriate response to a genuine need, not evidence of inadequacy. A student who sees a doctor for a broken leg is not demonstrating that they cannot "handle" physical health. Applying a different standard to mental health is stigma, not truth. Research consistently shows that early professional support for mental health conditions improves outcomes significantly compared to delayed or no support.',
    stat: 'Seeking mental health support is a healthy, appropriate response to genuine need — not weakness.',
    color: '#C07800',
  },
  {
    id: 7,
    question: 'Social media use has a documented negative effect on the mental health of young people.',
    isMyth: false,
    fact: 'FACT — with important nuance. Research by Jean Twenge, Amy Orben, and the Oxford Internet Institute documents associations between heavy social media use and increased depression, anxiety, and loneliness in adolescents — particularly for girls. The specific mechanisms include social comparison activation, disruption of sleep through evening use, and replacement of in-person social connection with less satisfying digital alternatives. However, correlation does not equal causation — some research shows active, purposeful social media use is less harmful than passive scrolling. The quality and type of use matters significantly.',
    stat: 'Heavy social media use is associated with increased depression and anxiety in adolescents.',
    color: '#B54F20',
  },
  {
    id: 8,
    question: 'Mental health conditions are permanent — once you have one, you will always have it.',
    isMyth: true,
    fact: 'MYTH. Many mental health conditions are highly treatable — research documents full recovery or significant symptom reduction for the majority of people who receive appropriate support. Recovery trajectories vary significantly by condition, severity, and intervention: some conditions resolve completely, others are managed effectively over the long term with appropriate tools and support, and some require ongoing treatment — just as many physical health conditions do. The belief that mental health conditions are permanent is a significant barrier to seeking help and to recovery itself.',
    stat: 'The majority of mental health conditions are treatable, with significant recovery possible with appropriate support.',
    color: AWARE,
  },
];

// ── Awareness Quiz Component ───────────────────────────────────────────────────
function MentalHealthAwarenessQuiz() {
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [revealed, setRevealed] = useState({});
  const [done,     setDone]     = useState(false);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const q       = QUIZ_QUESTIONS[current];
  const total   = QUIZ_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const correct = QUIZ_QUESTIONS.filter(q => {
    const ans = answers[q.id];
    return ans !== undefined && ((ans === 'myth') === q.isMyth);
  }).length;

  const handleAnswer = (choice) => {
    if (answers[q.id] !== undefined) return;
    setAnswers(prev => ({ ...prev, [q.id]: choice }));
    setRevealed(prev => ({ ...prev, [q.id]: true }));
  };

  const userAns    = answers[q.id];
  const isCorrect  = userAns !== undefined && ((userAns === 'myth') === q.isMyth);
  const isRevealed = revealed[q.id];

  const getResultMsg = () => {
    if (correct === total) return { label: 'Perfect Awareness! 🌟', msg: 'You scored perfectly — your mental health literacy is excellent. You are well-positioned to both support your own mental health and effectively help others who need it.', color: AWARE };
    if (correct >= 6) return { label: 'Strong Awareness 💚', msg: 'You have a solid understanding of mental health realities. A few gaps remain — revisit the questions you got wrong and share what you learned.', color: '#2D7A65' };
    if (correct >= 4) return { label: 'Growing Awareness 🌱', msg: 'You have a good foundation and room to deepen your understanding. Mental health literacy develops through continued learning — May\'s content will help build on what you have.', color: '#C07800' };
    return { label: 'Awareness Beginning 🔍', msg: 'May\'s mental health awareness content is exactly the right starting point for you. Every myth you can now replace with fact is a barrier to help-seeking removed — for yourself and for others.', color: '#2D5A8A' };
  };

  if (done) {
    const result = getResultMsg();
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font, textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>💚</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: result.color, marginBottom: '5px' }}>{result.label}</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', fontWeight: '700', color: result.color, marginBottom: '10px' }}>{correct}/{total}</div>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>{result.msg}</p>
        <div style={{ background: APALE, border: `1.5px solid ${ABORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: AWARE, marginBottom: '8px', letterSpacing: '1px' }}>📋 QUICK REVIEW:</div>
          {QUIZ_QUESTIONS.map(q => {
            const ans = answers[q.id];
            const correct = ans !== undefined && ((ans === 'myth') === q.isMyth);
            return (
              <div key={q.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{correct ? '✅' : '❌'}</span>
                <span style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.5 }}>{q.question.substring(0, 60)}... → <strong>{q.isMyth ? 'MYTH' : 'FACT'}</strong></span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setCurrent(0); setAnswers({}); setRevealed({}); setDone(false); }} style={{ padding: '11px 22px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${AWARE}, #3AAA78)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: AWARE, textTransform: 'uppercase', letterSpacing: '1px' }}>MYTH OR FACT?</span>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Question {current + 1} of {total}</span>
      </div>
      <div style={{ width: '100%', height: '5px', borderRadius: '3px', background: 'var(--border)', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg, ${AWARE}, #3AAA78)`, width: `${((current + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Question */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '20px', marginBottom: '16px', border: '1.5px solid var(--border)', minHeight: '100px', display: 'flex', alignItems: 'center' }}>
        <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '600', color: 'var(--ink)', lineHeight: 1.55, textAlign: 'center', width: '100%' }}>
          "{q.question}"
        </p>
      </div>

      {/* Buttons */}
      {!isRevealed && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <button onClick={() => handleAnswer('myth')} style={{ padding: '16px', borderRadius: '12px', border: '2px solid #8B2635', background: '#FBF0F1', cursor: 'pointer', fontFamily: font, fontSize: '16px', fontWeight: '700', color: '#8B2635', transition: 'all 0.15s' }}>
            🚫 MYTH
          </button>
          <button onClick={() => handleAnswer('fact')} style={{ padding: '16px', borderRadius: '12px', border: `2px solid ${AWARE}`, background: APALE, cursor: 'pointer', fontFamily: font, fontSize: '16px', fontWeight: '700', color: AWARE, transition: 'all 0.15s' }}>
            ✅ FACT
          </button>
        </div>
      )}

      {/* Revealed answer */}
      {isRevealed && (
        <div style={{ animation: 'floatUp 0.3s ease', marginBottom: '14px' }}>
          <div style={{ background: isCorrect ? APALE : '#FBF0F1', border: `2px solid ${isCorrect ? AWARE : '#8B2635'}`, borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{isCorrect ? '✅' : '❌'}</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: isCorrect ? AWARE : '#8B2635' }}>
                {isCorrect ? 'Correct!' : 'Not quite.'} This is a <strong>{q.isMyth ? 'MYTH' : 'FACT'}</strong>.
              </span>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75 }}>{q.fact}</p>
            <div style={{ background: 'white', borderRadius: '8px', padding: '8px 11px', border: `1px solid ${q.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: q.color, marginBottom: '3px', textTransform: 'uppercase' }}>📊 The data:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.6 }}>{q.stat}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {current < total - 1 ? (
              <button onClick={() => setCurrent(c => c + 1)} style={{ padding: '12px 28px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${AWARE}, #3AAA78)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 18px ${ABORD}` }}>
                Next Question →
              </button>
            ) : (
              <button onClick={() => setDone(true)} style={{ padding: '12px 28px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${AWARE}, #3AAA78)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 18px ${ABORD}` }}>
                See My Results 🌟
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
        {answered} answered · {total - answered} remaining
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MentalHealthAwareness2026({ navigate, relatedPosts }) {
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

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

      {/* ── Welcome to May ── */}
      <div style={{ background: `linear-gradient(135deg, ${AWARE}, #3AAA78)`, borderRadius: '14px', padding: '22px', marginBottom: '24px', textAlign: 'center', fontFamily: font }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>💚</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>Welcome to May — Mental Health Awareness Month</div>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.90)', lineHeight: 1.65 }}>
          Every May, the world pauses to acknowledge something that exists in every community, every family, every classroom — and is still, in 2026, dramatically underserved. This month, Secret Sharz dedicates its content to mental health awareness in depth.
        </p>
      </div>

      {/* ── Introduction ── */}
      <p>There is a version of this blog that would begin with statistics and remain there — numbers about prevalence rates, treatment gaps, and demographic trends. Those numbers matter, and this guide covers them. But they are not where mental health awareness actually begins. It begins with a much simpler recognition: that the person sitting next to you in class, the friend you see every day, the student in the mirror — is carrying something. Something that may or may not have a clinical name, that may or may not be visible, but that is real and that deserves acknowledgment.</p>

      <p><strong>Mental health awareness 2026</strong> is not simply the continuation of a global conversation that began years ago — it is an urgent response to a documented intensification of need. The students who are now in school and college are navigating a more complex psychological landscape than any previous generation has faced in the measured record: post-pandemic social reintegration, digital environments designed to maximise engagement at the expense of wellbeing, intensified academic competition, economic uncertainty, and a cultural context that still too often treats mental health difficulty as weakness rather than need.</p>

      <img
        src={meta.imgUrl}
        alt="Mental health awareness 2026 — why student mental health matters more than ever, statistics, awareness campaigns, and what students can do"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="landscape">1. The 2026 Student Mental Health Landscape</h3>

      <p><strong>The post-pandemic psychological legacy.</strong> The COVID-19 pandemic produced one of the largest documented mass psychological events in recorded history — and its effects on young people in particular are still unfolding in 2026. Research published in the Lancet Psychiatry, JAMA Psychiatry, and Nature Medicine consistently documents elevated rates of anxiety, depression, social anxiety, and post-traumatic symptoms among young people who experienced critical developmental periods during lockdown and social restriction. In India specifically, the disruption to educational trajectories, the elimination of peer social environments during formative years, and the transition to online learning with its attendant isolation and screen intensification produced a generation of students who arrived back in physical classrooms carrying psychological effects that the educational system was largely unprepared to address.</p>

      <p><strong>The digital environment as a 2026-specific factor.</strong> Every generation of students has faced academic pressure and social stress — these are not new. What is genuinely new in 2026 is the specific psychological environment that sustained immersion in algorithmically optimised digital platforms produces. Research by Jonathan Haidt at NYU, Jean Twenge at SDSU, and the Oxford Internet Institute documents associations between heavy social media use in adolescence and increased rates of anxiety, depression, loneliness, and sleep disruption — with effects measurable at the population level through the same period that smartphone adoption became near-universal. The students in school and college today have grown up in this environment from a significantly younger age than any previous generation, producing effects on brain development, social development, and wellbeing that we are only beginning to document fully.</p>

      <p><strong>The academic pressure intensification — specific to India.</strong> India's competitive examination culture has always produced significant academic pressure. In 2026, this pressure has intensified further: greater numbers of students competing for stable professional paths, the digitisation of comparison (real-time visibility of peers' preparation and results through social platforms), and the deepening identity-performance fusion that occurs when academic results are treated — by families, institutions, and the students themselves — as comprehensive measures of personal worth. Research published by the National Institute of Mental Health and Neurosciences (NIMHANS) documents a direct correlation between competitive examination culture intensity and mental health outcomes in student populations.</p>

      {/* ── Section 2 ── */}
      <h3 id="stats">2. The Statistics — What the Data Shows</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px', fontFamily: font }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '13px', padding: '16px', border: `1.5px solid ${s.color}25`, borderTop: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '28px', marginBottom: '5px', textAlign: 'center' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: s.color, textAlign: 'center', marginBottom: '4px' }}>{s.stat}</div>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.55, textAlign: 'center' }}>{s.context}</p>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic' }}>{s.source}</div>
          </div>
        ))}
      </div>

      <p><strong>What the statistics mean for the student reading this.</strong> These are not abstract numbers about other people's experiences. They describe the statistical reality of classrooms, hostels, study groups, and family homes across India. One in five people in any given year — which means in a class of forty students, approximately eight are experiencing a mental health condition right now. Fewer than one in five of those eight will receive professional support — meaning that the six or seven who do not receive help are managing it alone, or not managing it, or eventually reaching a crisis point that would have been preventable with earlier intervention. The purpose of awareness is to change these numbers — by reducing the stigma that keeps people from seeking help, by building the knowledge that allows people to recognise need in themselves and others, and by ensuring that when help is sought, it is found.</p>

      <p><strong>The India-specific treatment gap.</strong> India faces one of the world's largest mental health treatment gaps — the gap between the number of people who need mental health support and the number who receive it. The challenges are systemic: India has approximately 0.3 psychiatrists and 0.07 psychologists per 100,000 people, compared to WHO recommendations of 3 psychiatrists and 3 psychologists per 100,000. This infrastructure gap is compounded by the cultural and social stigma that makes seeking help — even when services are available — feel like an admission of weakness or a source of shame. Mental health awareness addresses this second barrier directly: it cannot build infrastructure, but it can challenge the stigma that prevents people from using what infrastructure exists.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="quiz">3. Interactive: The Mental Health Awareness Check</h3>
      <p>Eight questions — each one either a myth about mental health or a documented fact. Your score tells you where your awareness is and what understanding still needs building. Mental health literacy — the accurate knowledge that replaces myths — is one of the most effective tools available for reducing stigma and improving help-seeking.</p>

      <MentalHealthAwarenessQuiz />

      {/* ── Section 4 ── */}
      <h3 id="challenges">4. The Specific Challenges Students Face in 2026</h3>

      <p><strong>Challenge 1: The identity-performance fusion.</strong> In contexts where academic results are used to evaluate overall personal worth — by families, institutions, and by students themselves — disappointing results produce identity-level threats rather than task-level feedback. The experience is not "I did not prepare adequately for this specific examination" but "I am fundamentally inadequate." This cognitive fusion between performance and identity is among the most damaging specific mechanisms operating in student mental health. Research documents it as a primary driver of examination-related anxiety, post-result depression, and in the most severe cases, suicidality. Addressing it requires explicit decoupling of results from worth — a cultural shift that awareness campaigns specifically target.</p>

      <p><strong>Challenge 2: The loneliness paradox — more connected, more alone.</strong> Research by Vivek Murthy, former US Surgeon General, documents an epidemic of loneliness among young people despite unprecedented technological connectivity. In India, urban students particularly experience a paradox: surrounded by peers, digitally connected to hundreds, and reporting levels of genuine social isolation and loneliness at the highest measured levels. The mechanisms: digital social interaction does not produce the ventral vagal social engagement system activation that in-person connection does (Porges); social comparison on digital platforms produces social threat activation rather than social connection; and the competitive academic environment reduces the safety of authentic vulnerability that genuine friendship requires.</p>

      <p><strong>Challenge 3: The help-seeking stigma barrier.</strong> Despite decades of awareness efforts, stigma around mental health help-seeking remains the primary barrier between students who need support and students who receive it. Research on Indian student populations documents the specific stigma mechanisms: fear of being labelled as "mad" or "weak," concern about parental discovery and the family shame this might produce, belief that mental health difficulties should be manageable through "willpower" or religious practice, and concern about the permanence of a mental health diagnosis. Each of these stigma mechanisms can be directly addressed through accurate information — which is why literacy matters as much as accessibility.</p>

      <p><strong>Challenge 4: Sleep deprivation as a mental health risk factor.</strong> Research by Matthew Walker at UC Berkeley documents that chronic sleep deprivation is among the most significant and most underrecognised mental health risk factors — producing depression symptoms, anxiety amplification, emotional dysregulation, and impaired stress recovery. Indian student culture, particularly during examination preparation periods, normalises severe sleep restriction as evidence of dedication — producing the specific cognitive and emotional impairments that the restricted sleep was supposed to prevent. The "staying up all night to study" pattern produces measurably worse academic performance and measurably worse mental health outcomes than adequate sleep with proportionally less study time.</p>

      <p><strong>Challenge 5: Substance use as unrecognised mental health management.</strong> Research documents that a significant proportion of substance use among young people represents unrecognised self-management of mental health conditions — anxiety managed through alcohol, low mood managed through cannabis, social anxiety managed through stimulants. When mental health conditions are unrecognised or untreated, they are often managed through available alternatives — which carry their own risks while leaving the underlying condition unaddressed. Awareness that recognises substance use as a potential signal of underlying mental health need rather than purely a moral failure opens the door to more effective and more compassionate responses.</p>

      {/* ── Section 5 ── */}
      <h3 id="campaigns">5. Why Awareness Campaigns Matter</h3>

      <p><strong>Awareness changes what people do when they struggle.</strong> The primary measurable effect of mental health awareness campaigns — when well-designed — is increased help-seeking. Research on the effects of campaigns including Mind Over Matter (UK), Beyond Blue (Australia), and NIMHANS initiatives in India documents measurable increases in mental health service contacts, reduced self-reported stigma, and earlier intervention following campaigns targeting young people specifically. The mechanism: accurate information replaces the myths that prevent help-seeking (weakness, permanence, rarity), and normalised conversation reduces the shame that makes asking for help feel impossible.</p>

      <p><strong>Awareness builds social support — the most powerful wellbeing buffer available.</strong> Social support — the genuine, available, caring support of other people — is the single most consistently documented protective factor against mental health difficulties in research. It is more protective than any individual psychological intervention. When awareness campaigns produce communities in which mental health conversation is normalised, genuine support is enabled: the person struggling knows they can say something, the person watching knows they can ask, and the connection that research identifies as the most powerful protective factor becomes genuinely available. Awareness is not just about getting individuals to seek help — it is about building the social environments in which mental health difficulties can be acknowledged and genuinely supported.</p>

      <p><strong>Awareness shifts the cultural narrative around mental health.</strong> Culture shapes what is normal, what is shameful, what is treated as illness and what is treated as weakness. The cultural narrative around mental health in India — in 2026 still significantly influenced by frameworks that pathologise help-seeking, minimise psychological suffering, or frame mental distress as spiritual failing — is itself a public health risk factor. Awareness campaigns contribute to the gradual shift of this cultural narrative: each honest public conversation, each prominent figure who speaks openly about mental health experience, each institutional policy that treats mental health support as normal rather than exceptional moves the cultural baseline in a direction that saves lives.</p>

      <p><strong>Awareness matters particularly for the demographic that needs it most.</strong> Research consistently documents that the people who most need mental health support are the least likely to seek it — for reasons that include stigma, lack of awareness that they qualify for help, and the specific presentations of mental health conditions that reduce insight and motivation. Young people — who have the highest prevalence of onset for many conditions, the least established help-seeking patterns, and the most to gain from early intervention — are specifically the demographic that awareness campaigns most need to reach, and the demographic most receptive to peer-based and digital awareness approaches when these are done well.</p>

      {/* ── Section 6 ── */}
      <h3 id="action">6. What Students Can Do — Right Now</h3>

      <p><strong>Action 1: Have one honest conversation this month.</strong> The single highest-impact available awareness action is talking openly about mental health in real conversation — not performing wellness, not reciting statistics, but talking honestly about your own experience. "I have been more anxious than usual lately" or "I struggled a lot during exam season last year" or "I have been using mindfulness this month and it has actually helped" — any honest, specific, personal disclosure normalises mental health conversation for everyone in earshot. Research on stigma reduction consistently identifies peer disclosure as the most effective available mechanism. One honest conversation has effects that no amount of passive awareness content can produce.</p>

      <p><strong>Action 2: Learn the signs — for yourself and for others.</strong> Mental health literacy — knowing what the signs of common conditions look like, knowing the difference between ordinary distress and conditions that benefit from support, knowing what to say to someone who appears to be struggling — is itself a form of awareness action. The resource section at the end of this blog provides links to reliable information about specific conditions. The most important knowledge for most students: what depression actually looks like (often not the stereotyped dramatic sadness but low energy, reduced engagement, persistent emptiness, and withdrawal), what anxiety actually looks like (often not visible panic but chronic worry, avoidance, and physical tension), and what to say when a friend seems to be struggling (ask directly, listen fully, offer to help connect with support — do not give advice or minimise).</p>

      <p><strong>Action 3: Know the resources — and share them.</strong> SecretSharz provides peer support, professional resources, and mental health content. Beyond SecretSharz: iCall (a counselling service provided by the Tata Institute of Social Sciences, 9152987821), the Vandrevala Foundation helpline (1860-2662-345, available 24/7), and iDare (National Institute of Mental Health and Neurosciences awareness initiative). Knowing these resources before you need them — and having them available to share when someone around you needs them — is one of the most concrete awareness actions available.</p>

      <p><strong>Action 4: Challenge one mental health myth this month.</strong> When you hear one of the myths tested in the awareness quiz above — "people with depression just need to snap out of it," "anxiety is just worry, everyone has it," "getting therapy means you're crazy" — gently and factually correct it. Not to win an argument but to place one accurate piece of information where a harmful myth was. Each correction is a small contribution to the cultural shift that makes help-seeking less costly and support more available.</p>

      <p><strong>Action 5: Take care of your own mental health.</strong> The most important awareness action is the internal one: genuinely attending to your own mental health as the serious, real, and important dimension of wellbeing it is. Using the April mindfulness practices. Getting enough sleep. Maintaining genuine social connection. Recognising when you are struggling and doing something about it rather than pushing through. The student who takes their own mental health seriously is the student who can most genuinely support others — and the student who most embodies the cultural shift that May's awareness work is trying to produce.</p>

      {/* ── Section 7: FAQs ── */}
      <h3 id="faq">7. Mental Health Awareness 2026 FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What specifically makes mental health challenges worse for students now compared to, say, ten years ago?</strong><br />
        A: Research identifies four specific factors that distinguish the 2026 student experience from a decade earlier. First, the smartphone and social media environment: a decade ago, social comparison was bounded by physical proximity; now it is continuous, unbounded, and algorithmically intensified. Second, the post-pandemic social development gap: students who experienced critical social developmental periods during lockdown (2020-2022) are navigating social environments with skills and confidence that would normally have developed in those years. Third, the economic uncertainty intensification: the professional futures available to Indian students are more uncertain and more competitive than at any previous measured point. Fourth, the information environment: the continuous availability of information about threats (climate, economic, political) without the coping frameworks to process this information produces a specific chronic low-grade anxiety that research documents in post-pandemic young adults.</p>

        <p><strong>Q: Is talking about mental health online actually helpful, or does it just create more anxiety?</strong><br />
        A: This depends significantly on the type of online mental health content and how it is engaged with. Research by Fardouly and colleagues distinguishes between awareness content (factual information about mental health conditions, normalisation of help-seeking, genuine personal disclosure) and content that amplifies distress (detailed symptom catalogues that encourage self-diagnosis, content that glamorises mental health conditions, communities that reinforce and intensify distress rather than supporting improvement). The former is documented to improve help-seeking and reduce stigma; the latter is documented to amplify distress. SecretSharz specifically targets the former: evidence-based awareness, genuine practical tools, and connection to professional resources — not content that reinforces the experience of suffering.</p>

        <p><strong>Q: What if I am worried about a friend but do not know what to say?</strong><br />
        A: The most important research finding on this question is also the simplest: say something. The fear of saying the wrong thing is the primary barrier that prevents people from checking in on struggling friends, and it is largely unfounded — research documents that genuine caring inquiry ("I have noticed you seem to be struggling lately — how are you actually doing?") is almost always experienced as supportive, regardless of how imperfect the phrasing feels. The specific words matter far less than the genuine attention and care behind them. If you notice someone withdrawing, seeming persistently low, or expressing hopelessness, ask directly and listen fully — without minimising, without advice-giving before they ask for it, and without immediately trying to fix. Presence and genuine attention are the core of the support that research identifies as most helpful in the initial contact.</p>
      </div>

      {/* ── Resources Box ── */}
      <div style={{ background: APALE, border: `2px solid ${ABORD}`, borderRadius: '16px', padding: '22px', marginBottom: '30px', fontFamily: font }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: AWARE, marginBottom: '12px', textAlign: 'center' }}>💚 Mental Health Resources — India</div>
        {[
          { name: 'iCall (TISS)', contact: '9152987821', desc: 'Free counselling — Mon-Sat, 8am-10pm', color: AWARE },
          { name: 'Vandrevala Foundation', contact: '1860-2662-345', desc: '24/7 free crisis and counselling helpline', color: '#2D5A8A' },
          { name: 'iDare (NIMHANS)', contact: 'nimhans.ac.in/idare', desc: 'National mental health awareness initiative', color: '#5B3A8B' },
          { name: 'Secret Sharz Safe Corner', contact: '/safe', desc: '24/7 peer support and professional connection', color: '#8B2635' },
        ].map(r => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: r.color }}>{r.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{r.desc}</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: r.color }}>{r.contact}</div>
          </div>
        ))}
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>A Note on Why This Month Exists</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: AWARE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Mental health awareness exists because silence costs lives. Every honest conversation, every accurate fact replacing a harmful myth, every person who reaches for help because they knew it was there — this is what May is for."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Welcome to May. All month, Secret Sharz will publish content on mental health — understanding it, managing it, supporting others through it, and knowing when and how to seek help. We are glad you are here for this.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: `linear-gradient(135deg, ${AWARE}, #3AAA78)`, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${ABORD}` }}
          >
            Access Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: AWARE, border: `2px solid ${AWARE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Visit Our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>From April's Mindfulness Series:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-reduce-anxiety',      '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/manage-emotions-mindfulness',     '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/blog/mindfulness-emotional-balance',   '→ Mindfulness and Emotional Balance Explained Simply'],
            ['/blog/daily-mindfulness-routine',       '→ Daily Mindfulness Routine for Students and Young Adults'],
            ['/blog/connect-with-yourself-mindfulness','→ How to Connect with Yourself Through Mindfulness'],
            ['/blog/mindfulness-journey-reflection',  '→ End-of-Month Reflection: Your Mindfulness Journey'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: AWARE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
