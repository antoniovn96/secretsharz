import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Overcome Fear of Failure in Studies",
  excerpt: "Fear of failure in students is not a character flaw — it is a learned response to environments that taught you that your worth is conditional on your results. Learn the psychology behind academic fear of failure, discover growth mindset strategies that actually shift the pattern, and use our Failure Fear Decoder to understand your specific fear and get a personalised coping plan.",
  category: "Mental Health",
  date: "13-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/fear-of-failure-studies.jpg",
  tldr: "Fear of failure in studies affects a significant proportion of students and is one of the primary drivers of procrastination, perfectionism, self-sabotage, and the paradox of studying hard but performing below capability. This guide covers the specific psychology of academic failure fear, Carol Dweck's growth mindset research and how to practically apply it, five relatable student examples, emotional coping strategies, and an interactive Failure Fear Decoder that identifies your specific fear pattern and generates a personalised reframe and coping plan.",
  toc: [
    { id: "psychology",   title: "1. The Psychology of Fear of Failure in Students",             level: 3 },
    { id: "examples",     title: "2. Five Relatable Student Examples — Do You Recognise Yourself?", level: 3 },
    { id: "decoder",      title: "3. Interactive: The Failure Fear Decoder",                     level: 3 },
    { id: "growth",       title: "4. Growth Mindset Strategies That Actually Shift the Pattern",  level: 3 },
    { id: "coping",       title: "5. Emotional Coping Strategies for Academic Fear of Failure",   level: 3 },
    { id: "faq",          title: "6. Fear of Failure in Studies FAQs",                            level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-13T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "fear of failure students, how to overcome fear of failure in studies, academic fear of failure, growth mindset students, failure anxiety students, fear of failure coping strategies, overcome exam failure fear",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why do students fear failure in studies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Students fear academic failure primarily because they have learned — through family messages, competitive educational environments, and repeated social comparison — to equate academic performance with personal worth. When a result means more than information about a specific performance on a specific day, and instead represents a verdict on intelligence, belonging, or future prospects, every academic assessment becomes existentially threatening. Research by Carol Dweck at Stanford identifies this as a fixed mindset belief system: the implicit assumption that intelligence and capability are fixed traits that results either confirm or expose as insufficient.",
      },
    },
    {
      "@type": "Question",
      "name": "How does fear of failure affect academic performance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fear of failure affects academic performance through several documented mechanisms: procrastination (avoiding starting tasks because not starting protects against the evidence of failure that starting might produce), perfectionism-driven paralysis (spending so long on each task trying to make it perfect that overall output declines), self-handicapping (creating conditions that explain away potential failure before it occurs), and performance anxiety that directly impairs memory retrieval and cognitive function during exams. Research by Andrew Elliot at the University of Rochester shows that performance-avoidance goals — studying to avoid failure rather than to learn — are associated with significantly worse academic outcomes than mastery goals.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I stop being scared of failing exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reducing fear of exam failure requires addressing both the cognitive pattern (the belief that failure represents a permanent verdict on capability or worth) and the physiological response (the anxiety activation that impairs performance). Practical steps include: separating your self-worth from your results deliberately and repeatedly, building mastery goals (studying to understand) rather than performance goals (studying to not fail), using the 'next action' technique to interrupt catastrophic future-thinking with present-focused doing, practising self-compassion after setbacks rather than self-criticism, and accessing the physical regulation techniques (breathing exercises, movement) that lower cortisol enough to restore the cognitive function that fear impairs.",
      },
    },
  ],
};

// ── Decoder Data ───────────────────────────────────────────────────────────────
const MAROON  = '#8B2635';
const MPALE   = '#FBF0F1';
const MBORD   = 'rgba(139,38,53,0.22)';

const FEAR_TYPES = [
  {
    key:     'worth',
    icon:    '🪞',
    label:   'Failure = I am not smart enough',
    desc:    'Believing that a bad result proves something permanently true about your intelligence or capability',
    is_root: 'This is the most common and most damaging form of academic failure fear. It converts every assessment from an information-gathering exercise (what do I know, what do I need to work on?) into a verdict (am I enough?). When performance is identity, every test is a referendum on your worth as a person.',
    reframe: 'A result tells you what you could recall and demonstrate under specific conditions on a specific day. That is genuinely useful information. It tells you nothing about your potential, nothing about your worth, and nothing that is fixed. Research by psychologist Kyla Haimovitz shows that students who receive feedback framed as information about strategy and effort show measurable performance improvement; those who receive the same feedback framed as information about ability show performance decline. The failure is about the approach, not the person.',
    growth_shift: 'Practise the language shift: not "I am bad at maths" but "I have not understood this method yet." Not "I failed" but "that approach didn\'t work and I now have specific information about what to try next." The "yet" is the most powerful word in academic growth mindset practice — it converts a fixed verdict into an active process.',
    coping: [
      'Write the result you fear — the specific bad grade or failure — on paper. Below it, write: "This would mean [X about me] — is that actually true, and is it permanent?" Most honest answers to that question reveal that the feared outcome is neither as revealing as feared nor as permanent.',
      'Identify one person you respect who has failed at something significant and come back from it. Their failure is not what defines them. Yours will not define you either.',
      'Recall one time you found something difficult and eventually understood it. The process of "struggling then getting it" is evidence that difficulty is not permanent incapability.',
    ],
    example: 'Aryan got 52% in his first college mid-sem and spent two weeks convinced he had chosen the wrong degree. He had not — he had studied inefficiently for the first time in a system that required different strategies. The 52% was information. His response to it (self-doubt that prevented studying for the next paper) was the actual problem.',
  },
  {
    key:     'disappointment',
    icon:    '💔',
    label:   'Fear of disappointing parents or teachers',
    desc:    'The terror of what others will think, feel, or say if you do not perform to expectation',
    is_root: 'The fear of others\' disappointment is one of the most specific and culturally potent drivers of academic anxiety in Indian student contexts. It conflates academic performance with the maintenance of belonging — the implicit sense that love, acceptance, and family harmony are contingent on results. This is not always an explicit message. Often it is absorbed from the emotional atmosphere around results: the visible pride in good outcomes, the visible distress in poor ones.',
    reframe: 'The people whose opinion you most fear losing access to if you fail are almost certainly not offering you conditional care — they are expressing their anxiety about your future through pressure that feels like conditional acceptance but is almost never actually that. Most parents who seem to tie their care to results are acting from love expressed poorly, not from genuine conditional regard. And the result: even if the disappointment is real and expressed, you will survive it. The relationship has survived things before.',
    growth_shift: 'Separate your internal performance motivation from the external approval motivation. Ask: "If nobody knew the result — not my parents, not my teachers, not my peers — would I still care about doing well?" If yes, that is your actual motivation and it is healthy. Build from there. If only the external validation matters, that is the work.',
    coping: [
      'Have the pre-emptive conversation once: "I am working hard and I am also anxious about this exam. I need support more than pressure right now." Most parents, when given a specific and honest request, respond to it.',
      'Identify what you would tell a close friend who was in your position — terrified of disappointing people they love. Apply that same perspective to yourself.',
      'Write down the worst realistic outcome of the feared disappointment. Then write what you would do next. Having a plan for the feared outcome reduces its power significantly.',
    ],
    example: 'Priya had a 95% average through Class 12 and spent so much energy managing the anxiety of maintaining it that she could not sleep two weeks before boards. Her preparation was thorough. Her terror was about what her parents\' faces would look like if she did not repeat the previous year\'s rank — a fear that had nothing to do with the exam and everything to do with a family culture where academic excellence had become the primary love language.',
  },
  {
    key:     'future',
    icon:    '🔮',
    label:   'One bad result will ruin my future',
    desc:    'Believing that a failure now closes all meaningful paths permanently',
    is_root: 'The catastrophic future-failure belief is particularly common in high-stakes exam cultures where specific thresholds (JEE cutoffs, board percentages, university entry requirements) are framed as singular decision points. When one exam is experienced as the single determinant of the entire life trajectory, the stakes become impossible to bear — and the preparation and performance are both impaired by the weight of what has been placed on the outcome.',
    reframe: 'Almost no single academic result, at any level, permanently forecloses all meaningful paths. This is not wishful thinking — it is structural reality. Alternative pathways exist for almost every outcome, most successful people\'s trajectories included substantial academic setbacks, and the personal qualities that produce long-term achievement (persistence, self-knowledge, adaptability, genuine engagement with learning) are not credentials-dependent. The result matters. It is rarely as permanently decisive as the fear insists.',
    growth_shift: 'Research by Carol Dweck on the long-term outcomes of students with fixed vs growth mindsets shows consistently that growth mindset students — who interpret setbacks as information rather than verdicts — show better long-term trajectories than fixed mindset students with higher initial ability scores. The ability to recover from failure is a more durable predictor of long-term success than the ability to avoid it.',
    coping: [
      'Write your feared outcome specifically: "If I get [X result], then [specific consequence] will happen, and then [next consequence]..." Follow the chain of causation honestly all the way. At some point the chain breaks — the catastrophe requires assumptions that are not necessarily true.',
      'Research one person in your intended field whose path included a significant academic setback. They exist in every field. Their story is not the exception.',
      'Ask: "In ten years, will this specific result be the primary determinant of where I am?" Honest, specific reflection on this question almost always reveals that the answer is no.',
    ],
    example: 'Rohan did not clear JEE in his first attempt. He spent six months believing his engineering aspirations were finished. He then discovered private engineering colleges, state entrance exams, and ultimately a career path he found more interesting than the IIT trajectory he had been pointed at. The exam failure was genuinely painful and genuinely consequential. It was not the end of anything except one specific path.',
  },
  {
    key:     'perfectionism',
    icon:    '🎯',
    label:   'Anything less than excellent is failure',
    desc:    'Setting standards so high that any imperfection registers as complete failure',
    is_root: 'Perfectionism is the fear of failure wearing the clothes of high standards. It presents as ambition and discipline but operates as anxiety: the standard is set at a level that makes failure near-inevitable, which means the entire academic experience is lived in the shadow of anticipated inadequacy. Perfectionist students often perform well by external measures while experiencing their performance as continuous failure — because the internal standard is calibrated to be unreachable.',
    reframe: 'Perfectionism is not the pursuit of excellence — it is the avoidance of the emotional experience of imperfection. Research by Brené Brown on perfectionism shows that it is associated with increased depression, anxiety, and addiction rates, and paradoxically lower actual achievement — because the fear of imperfect output produces avoidance, procrastination, and paralysis that reduce total output below what more realistic standards would allow.',
    growth_shift: 'The shift from perfectionism to high standards (which is different) requires the explicit acceptance that good work exists on a spectrum and that producing work at 80% quality consistently is more valuable than producing work at 100% quality occasionally. The Pareto principle applies to learning: 20% of extra effort produces 80% of the result. The remaining 20% of the result costs 80% more effort — and for perfectionist students, that cost is almost always paid in anxiety, avoidance, and exhaustion rather than actual improvement.',
    coping: [
      'Introduce a deliberate "good enough to submit" rule for a specific low-stakes assignment this week. Submit it. Notice that the sky does not fall.',
      'Write the standard you are holding yourself to for a current assignment. Then write the standard you would hold a peer to for the same work. Notice the gap. Apply the peer standard to yourself.',
      'Track the actual quality difference between your "perfected" submissions and your "good enough" submissions. Most students find the quality difference is minimal — the effort difference is enormous.',
    ],
    example: 'Sneha spent five hours on an essay that was supposed to take ninety minutes, trying to make every sentence perfect, and submitted it twenty minutes before the deadline in a state of exhausted panic. Her grade: 76%. The previous week, she had submitted a slightly rushed essay she felt embarrassed about. That grade: 73%. The three-point difference cost her four hours and significant distress. The perfection was not producing proportional results.',
  },
  {
    key:     'comparison',
    icon:    '📊',
    label:   'Fear of being seen as less capable than peers',
    desc:    'Terrified of being publicly outperformed, compared, or found lacking relative to classmates',
    is_root: 'Social comparison fear is specifically acute in academic environments because performance is made visible through grades, rankings, and the casual group conversation in which people share results. The fear is not simply of a bad result privately — it is of public evidence of relative inadequacy. This fear drives the specific misery of the rank list, the WhatsApp marks comparison, and the devastating feeling of being seen to do less well than peers whose apparent effort level seemed no greater than yours.',
    reframe: 'Social comparison in academic contexts uses systematically distorted data. You see others\' results without seeing their preparation conditions, their support systems, their mental health during the exam period, the specific material they happened to have covered, or the luck of topic selection. You are comparing your comprehensive, context-inclusive experience to a data point stripped of all context. The comparison is informationally worthless — and emotionally expensive.',
    growth_shift: 'The shift is from a social reference frame (how am I doing compared to others?) to a personal reference frame (how am I doing compared to where I was, and am I moving forward?). Research consistently shows that personal reference frame students improve more consistently over time and experience their academic journey with significantly less distress. Your most meaningful competition is yesterday\'s version of yourself.',
    coping: [
      'After the next results release, give yourself a thirty-minute window before looking at or engaging with any comparison — social media, group chats, or direct comparison conversations. Use that thirty minutes to assess your own result first, in context.',
      'Write three things about your result that are specifically yours — what you did well, what you can improve, what you will do next. This is the only analysis that produces actionable information.',
      'Find one specific area where your preparation this time was better than last time. This personal improvement is the actual data point for your trajectory.',
    ],
    example: 'Meera got 81% in her economics exam and felt devastated because two classmates got 88% and 92%. She had improved by 9 points from her previous exam. The 9-point improvement disappeared entirely under the weight of the comparison. She spent the rest of the week feeling like she had failed, when the evidence — her own evidence — said the opposite.',
  },
];

const INTENSITY_LEVELS = [
  { key: 'mild',   icon: '🟢', label: 'Mild — it is present but I can usually manage it' },
  { key: 'medium', icon: '🟡', label: 'Moderate — it consistently affects my preparation and performance' },
  { key: 'severe', icon: '🔴', label: 'Severe — it significantly disrupts my studying and wellbeing' },
];

const INTENSITY_ADDENDUM = {
  mild: 'At this level, the fear is present but workable. The strategies below will help you keep it that way and prevent escalation during high-pressure periods.',
  medium: 'At this level, the fear is actively limiting your potential. The strategies below address both the cognitive pattern and the emotional response — both are necessary for meaningful change.',
  severe: 'At this level, the fear is significantly impairing both your academic life and your wellbeing. The strategies below are important starting points, and we also want to name clearly: professional support — a counsellor or psychologist — is appropriate at this level and will produce faster, deeper change than self-help strategies alone.',
};

// ── Decoder Component ──────────────────────────────────────────────────────────
function FailureFearDecoder() {
  const [step,      setStep]      = useState(1);
  const [fearType,  setFearType]  = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openCope,  setOpenCope]  = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selFear = FEAR_TYPES.find(f => f.key === fearType);
  const selInt  = INTENSITY_LEVELS.find(i => i.key === intensity);

  const handleReset = () => { setStep(1); setFearType(null); setIntensity(null); setRevealed(false); setOpenCope(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? MAROON : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Which failure fear resonates most with you?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the one that hits closest to home — the version of the fear that feels most personally true.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {FEAR_TYPES.map(f => {
              const isSel = fearType === f.key;
              return (
                <button key={f.key} onClick={() => setFearType(f.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? MAROON : 'var(--border)', background: isSel ? MPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${MBORD}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? MAROON : 'var(--ink)', marginBottom: '2px' }}>{f.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (fearType) setStep(2); }} disabled={!fearType} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: fearType ? `linear-gradient(135deg, ${MAROON}, #B53A4E)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: fearType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: fearType ? `0 6px 18px ${MBORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How intensely does this fear affect you?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest — the plan you receive will be calibrated to your actual level.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {INTENSITY_LEVELS.map(il => {
              const isSel = intensity === il.key;
              return (
                <button key={il.key} onClick={() => setIntensity(il.key)} style={{
                  padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? MAROON : 'var(--border)', background: isSel ? MPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${MBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{il.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? MAROON : 'var(--ink)' }}>{il.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (intensity) { setStep(3); setRevealed(false); } }} disabled={!intensity} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: intensity ? `linear-gradient(135deg, ${MAROON}, #B53A4E)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: intensity ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Decode My Fear →</button>
          </div>
        </>
      )}

      {/* STEP 3 — Results */}
      {step === 3 && selFear && selInt && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Your Failure Fear Decoded
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${MAROON}, #B53A4E)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${MBORD}`,
              }}>🔓 Reveal My Coping Plan</button>
              <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${MAROON}, #B53A4E)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>{selFear.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {selFear.label.split(' — ')[0]}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', borderRadius: '20px', padding: '4px 12px', marginTop: '4px' }}>
                  <span>{selInt.icon}</span>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '700' }}>{selInt.label.split(' — ')[0]}</span>
                </div>
              </div>

              {/* Intensity context */}
              <div style={{ background: MPALE, border: `2px solid ${MBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAROON, marginBottom: '6px' }}>
                  📍 At Your Intensity Level
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{INTENSITY_ADDENDUM[intensity]}</p>
              </div>

              {/* Root cause */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '7px' }}>
                  🔬 Why This Fear Takes Root
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selFear.is_root}</p>
              </div>

              {/* Reframe */}
              <div style={{ background: MPALE, border: `1.5px solid ${MBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAROON, marginBottom: '7px' }}>
                  🔭 The Reframe
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{selFear.reframe}</p>
              </div>

              {/* Growth shift */}
              <div style={{ background: 'white', border: `1.5px solid ${MBORD}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAROON, marginBottom: '7px' }}>
                  🌱 Your Growth Mindset Shift
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selFear.growth_shift}</p>
              </div>

              {/* Three coping strategies — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAROON, marginBottom: '9px' }}>
                  🛠️ Three Coping Strategies for This Fear
                </div>
                {selFear.coping.map((c, i) => {
                  const isOpen = openCope === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${MBORD}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenCope(isOpen ? null : i)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg, ${MAROON}, #B53A4E)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: MAROON, flex: 1 }}>
                          {c.split(' ').slice(0, 6).join(' ')}…
                        </span>
                        <span style={{ color: MAROON, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{c}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Relatable example */}
              <div style={{ background: MPALE, border: `1.5px solid ${MBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAROON, marginBottom: '6px' }}>
                  👤 A Student Who Felt This
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selFear.example}</p>
              </div>

              {/* Affirmation */}
              <div style={{ background: 'white', border: `1.5px dashed ${MBORD}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAROON, marginBottom: '7px' }}>✨ Something Worth Holding</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: MAROON, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {selFear.key === 'worth'         && '"Your results describe a performance. They do not describe you."'}
                  {selFear.key === 'disappointment'&& '"You can survive disappointing people who love you. The love does not leave with the result."'}
                  {selFear.key === 'future'        && '"One result is one data point. Your trajectory is the whole graph."'}
                  {selFear.key === 'perfectionism' && '"Good enough and submitted beats perfect and not started every single time."'}
                  {selFear.key === 'comparison'    && '"Your only honest competition is who you were yesterday."'}
                </p>
              </div>

              {intensity === 'severe' && (
                <div style={{ background: '#FEF3C7', border: '2px solid rgba(192,120,0,0.35)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309', marginBottom: '6px' }}>⚠️ A Direct Note</div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400E', lineHeight: 1.7 }}>
                    At severe intensity, this fear is affecting your wellbeing beyond what self-help strategies alone can address. A counsellor or therapist who works with students can help you work through the root patterns more completely. Seeking support is not a sign of additional failure — it is accurate self-assessment.
                  </p>
                </div>
              )}

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${MBORD}`, color: MAROON, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Decode a different fear</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FearOfFailureStudies({ navigate, relatedPosts }) {
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
      <p>There is a particular kind of student who is simultaneously one of the most hardworking and one of the most suffering people in any classroom. They study more than most, sleep less than they should, and feel, almost continuously, that it is never enough. They are not lazy. They are not uninterested. They are afraid — of what a bad result would mean, of what people would think, of the version of the future that a failure might foreclose.</p>

      <p><strong>Fear of failure in students</strong> is one of the most common and least-discussed forces in academic life. It is rarely named directly — it presents as procrastination, as perfectionism, as the inability to start things or the inability to submit them, as the student who knows the material but goes blank in the hall. Understanding it is not weakness. It is the beginning of changing it.</p>

      <img
        src={meta.imgUrl}
        alt="Student overcoming fear of failure in studies — growth mindset strategies, emotional coping, and academic resilience"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="psychology">1. The Psychology of Fear of Failure in Students</h3>
      <p>The psychological study of failure fear has a specific and well-developed research lineage. Psychologist David McClelland, who first formalised achievement motivation theory in the 1950s, distinguished between two fundamentally different motivational orientations: approach motivation (pursuing success, doing things because they are intrinsically rewarding or because the outcome is genuinely desired) and avoidance motivation (working to not fail, to not be exposed, to not disappoint — driven by fear of the negative outcome rather than desire for the positive one).</p>
      <p>Andrew Elliot at the University of Rochester extended this framework into academic settings, identifying what he called "performance-avoidance goals" — studying not to learn or to achieve but specifically to avoid demonstrating incompetence. His research shows consistently and substantially that performance-avoidance goals produce worse academic outcomes than mastery goals (studying to understand and grow), even when the initial ability levels of the two groups are matched. The fear-based motivational orientation is not just emotionally miserable — it is functionally less effective than the engagement-based alternative.</p>
      <p>The mechanism is specific: fear-of-failure motivation increases cognitive load during performance situations (because attention is split between the task and monitoring for signs of failure), directly impairs working memory (because anxiety occupies the same cognitive resources as complex reasoning), and produces the specific exam-hall experience of accessing studied material less efficiently than preparation would predict. Students who study from fear have lower recall under pressure than students who study from curiosity or mastery orientation — not because they studied less, but because the emotional state in which they studied and the emotional state in which they are being assessed both impair the encoding and retrieval of information.</p>
      <p>Carol Dweck's foundational research on fixed vs growth mindsets provides the other essential framework. A fixed mindset — the implicit belief that intelligence and ability are innate, fixed traits that results either confirm or expose — makes every academic assessment existentially threatening. If your ability is fixed and a result reveals it to be insufficient, there is nothing to do about it. This is the specific cognitive structure that produces the most paralysing form of failure fear: the conviction that trying and failing would be worse than not trying, because at least not trying preserves the possibility that you could have succeeded.</p>
      <p>The cultural amplifiers in Indian academic contexts add specific additional weight. Competitive examination culture, where narrow scoring windows determine access to specific career pathways, makes individual results genuinely high-stakes in ways that western academic psychology research often underestimates. Family investment in academic success — financial, emotional, and relational — adds a relational dimension to academic failure that purely individual frameworks miss. These are real pressures. They do not require minimisation to be workable. But they do require contextualisation: the exam matters and it is not the totality of your worth or your future, simultaneously.</p>

      {/* ── Section 2 ── */}
      <h3 id="examples">2. Five Relatable Student Examples — Do You Recognise Yourself?</h3>

      <p><strong>Aryan — The Avoider.</strong> Aryan is smart, genuinely interested in his subject, and three weeks behind on revision. Not because he is lazy — he thinks about the exam constantly. But every time he sits down to study, he finds himself scrolling, reorganising his notes, or suddenly needing to do something else. His avoidance is perfectly logical from a fear-of-failure perspective: as long as he has not studied enough to know what he knows and does not know, the failure remains hypothetical. Starting would make it real. Not starting is a preservation of ambiguity that, for now, feels safer than the clarity that studying might produce. The procrastination is the fear in disguise.</p>

      <p><strong>Priya — The Perfectionist.</strong> Priya's assignments are usually excellent. They are also usually late, because she cannot submit them until every sentence is right. She has rewritten her essay introduction eleven times this week. She is falling behind on three other subjects while she perfects one. The perfectionism is not ambition — it is fear. The standard she is holding herself to is specifically calibrated to make failure impossible: if the work is perfect, it cannot be criticised. But the cost of this protection is the depletion and the falling behind and the 2am panic submission that is barely better than the third draft she finished last Tuesday.</p>

      <p><strong>Rohan — The Self-Handicapper.</strong> Rohan consistently underperforms relative to his preparation. He studies, but he also tells everyone (including himself) that he "barely studied" before every exam. He gets sick strategically — never on the days before easy exams, reliably before the high-stakes ones. He leaves revision to the last minute, giving himself a narrative reason for any disappointing result that is not about capability. This is self-handicapping: the unconscious creation of conditions that provide an external explanation for failure, protecting the self-concept from the threat of a result that might otherwise be attributed to insufficient ability.</p>

      <p><strong>Meera — The Comparer.</strong> Meera is not specifically afraid of her own performance — she is afraid of her relative performance. She is fine until the WhatsApp group starts sharing marks. She knows, objectively, that her 79% represented improvement from her last paper. But three people got above 85%, and that is the only number she can hold. She studies to not be last, not to understand. She experiences results on a curve that is always weighted toward the people who did better rather than the personal trajectory that would actually tell her something useful about her own progress.</p>

      <p><strong>Ishaan — The Ghost Student.</strong> Ishaan stopped participating in class six months ago. He knows answers — his private notes are impressive — but the thought of saying something wrong publicly is more activating than any exam anxiety. He does not raise his hand. He does not email teachers with questions. He processes everything alone and privately, because public engagement creates public evidence of his capability level, which the failure fear says must be protected from exposure. He is gradually shrinking his academic world to the dimensions where failure cannot be witnessed.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="decoder">3. Interactive: The Failure Fear Decoder</h3>
      <p>The Decoder identifies which of the five fear patterns most resonates with your experience, assesses how intensely it is currently affecting you, and generates a personalised coping plan: the psychology of your specific fear, a reframe that addresses its root assumption, a growth mindset shift tailored to your pattern, three concrete coping strategies, and a relatable student example. Be honest — the plan is calibrated to your actual experience, not an aspirational version of it.</p>

      <FailureFearDecoder />

      {/* ── Section 4 ── */}
      <h3 id="growth">4. Growth Mindset Strategies That Actually Shift the Pattern</h3>
      <p>Carol Dweck's growth mindset research is widely cited and frequently misapplied — reduced to a motivational slogan ("just believe you can grow!") that makes the genuine cognitive and behavioural shift it describes sound easier than it is. The actual growth mindset shift is a specific, practised reorientation of how you interpret difficulty, effort, and outcome. Here is what that looks like in practice for students dealing with failure fear:</p>
      <p><strong>Replace performance goals with mastery goals, specifically and repeatedly.</strong> A performance goal is: "I need to score above 80% in this exam." A mastery goal is: "I want to understand the mechanism of organic reactions well enough to solve novel problems I haven't seen before." The performance goal makes every study session a preparation for judgement. The mastery goal makes every study session an act of genuine learning. Research by Elliot shows that mastery-oriented students not only perform better but experience significantly less performance anxiety — because the exam is no longer the point, it is a measurement of a process that already has intrinsic value.</p>
      <p><strong>Treat difficulty as information, not verdict.</strong> The specific cognitive habit that characterises growth mindset is the interpretation of difficulty. Fixed mindset: "I cannot do this problem — I am not a maths person." Growth mindset: "I cannot do this problem yet — what specifically is the gap between what I know and what this problem requires?" The difference is not optimism. It is an accurate, methodical response to difficulty that extracts useful information rather than a global verdict. Practise this specific substitution every time you encounter something you cannot immediately do.</p>
      <p><strong>Use the "not yet" language deliberately.</strong> Dweck's research shows that the addition of "yet" to failure statements produces measurable changes in subsequent engagement and performance. "I failed this exam" vs "I have not passed this exam yet." "I cannot do this" vs "I cannot do this yet." The "yet" is not denial — it is the honest acknowledgment that your current performance is a snapshot, not a diagnosis. It keeps the future open in a way that fixed failure statements do not.</p>
      <p><strong>Normalise failure as part of the learning process, not an exception to it.</strong> Every field has extensive failure as its foundation. The medical researcher who found the treatment ran hundreds of failed experiments first. The top engineering student in your cohort has almost certainly failed more practice problems than you have, not fewer — because they attempted more. Building a realistic relationship with failure as an expected, useful, and manageable part of the learning process rather than an aberration to be avoided at all costs is one of the most durable protections against failure fear.</p>
      <p><strong>Review your failures analytically rather than emotionally.</strong> After a disappointing result, sit with the specific paper or feedback and ask: "What specifically did I not know, and why?" Not "why am I like this" — "what was the gap, and what would close it?" The analytical response to failure is the growth mindset in action. The emotional spiral response — the self-criticism, the catastrophising, the extended self-punishment — is the fixed mindset maintaining itself through misery. You are allowed to feel disappointed. That is human and appropriate. You do not have to stay in the punishment loop that the disappointment opens into.</p>

      {/* ── Section 5 ── */}
      <h3 id="coping">5. Emotional Coping Strategies for Academic Fear of Failure</h3>
      <p><strong>Name it specifically rather than carrying it generally.</strong> There is a significant difference between "I am anxious about exams" (vague, all-encompassing, hard to address) and "I am afraid that this specific result will confirm that I am not capable of this subject, and that will mean I chose the wrong path" (specific, addressable, falsifiable). The specificity of naming the fear is itself partially therapeutic — it activates the prefrontal cortex (naming activates cognitive processing), reduces amygdala activation (the threat is smaller when defined), and creates something concrete enough to challenge.</p>
      <p><strong>Practise self-compassion after setbacks — not self-criticism.</strong> Research by Kristin Neff at the University of Texas on self-compassion in academic contexts consistently shows that students who respond to academic setbacks with self-compassion (acknowledging the difficulty, treating themselves with the same kindness they would offer a friend, and recognising the setback as part of a shared human experience rather than a unique personal failure) show better academic performance, greater motivation, and more resilience than students who respond with self-criticism — counterintuitively, even though self-criticism feels more "serious" about the problem. Self-criticism does not produce better subsequent performance. It produces avoidance, reduced motivation, and worse performance on the next attempt.</p>
      <p><strong>The failure autopsy — what happened, what can I learn, what comes next.</strong> After any significant disappointing result: sit with three questions. What specifically went wrong (not who to blame, what specifically happened)? What specific information does this give me about what to do differently? What is the single next concrete action I can take? This three-question structure converts a failure from a source of shame into a source of information. It cannot answer itself in a spiral of self-punishment. It requires the specific, forward-oriented engagement that is the emotional opposite of failure fear's paralysis.</p>
      <p><strong>Build a failure-resilience record.</strong> Create a private list of every significant difficulty you have faced in your academic life and come back from — every exam you struggled with and recovered from, every topic that seemed impossible and eventually clicked, every moment you felt like giving up and continued anyway. This list is your evidence base against the fixed-mindset narrative that this failure is permanent and final. Most students do not track their recovery from difficulty — only the difficulty itself. The record corrects this imbalance.</p>
      <p><strong>Use physical regulation before academic panic decisions.</strong> The worst responses to failure fear — the avoidance, the self-handicapping, the 2am crisis studying, the decision to drop a subject — happen almost exclusively in states of acute anxiety when the prefrontal cortex is offline and the amygdala is driving. Before making any significant academic decision in a state of failure panic, regulate physiologically first: three physiological sighs, five minutes of physical movement, or a ten-minute break. Then reassess. The decision made in a regulated state is almost always better than the one made in a spiral.</p>
      <p><strong>Seek connection rather than isolation after failure.</strong> The failure fear's most effective strategy for self-perpetuation is isolation — the shame that makes the failure feel too exposing to share keeps the student alone with it, where it grows rather than diminishes. Telling one trusted person — "I got a disappointing result and I am struggling with it" — is not vulnerability that exposes inadequacy. It is the specific act that interrupts the shame spiral most reliably. The told failure is never quite as overwhelming as the hidden one.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Fear of Failure in Studies FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is it possible to completely eliminate the fear of failure?</strong><br />
        A: The goal is not elimination — some performance anxiety is both normal and useful. The goal is reaching a place where the fear is proportionate to the actual stakes, where it motivates preparation rather than paralysing it, and where a disappointing result produces a specific, solvable problem rather than a global verdict on your worth or future. Most students who work on this do not stop feeling anxious about exams. They stop being controlled by the anxiety. The shift is from fear as the primary driver of their academic decisions to engagement as the primary driver, with fear as an occasional and manageable signal rather than the constant governing force.</p>

        <p><strong>Q: My fear of failure is tied to very real consequences — losing a scholarship, family financial pressure, or a specific career pathway. How is this different from just being appropriately scared?</strong><br />
        A: Real stakes are real, and the fear response is proportionate to them. The distinction is between appropriate, action-producing concern (which motivates specific preparation, allows rest and recovery, and focuses energy productively) and paralysing, performance-impairing fear (which prevents adequate preparation, destroys sleep, and undermines the exam performance it is ostensibly worried about). If the stakes are genuinely high, the most important thing you can do is not manage the fear by making it smaller but manage it by ensuring it produces useful action rather than avoidance. High-stakes contexts require the best version of your cognitive function — which means the fear management techniques described here are not about dismissing the seriousness of your situation but about ensuring the seriousness produces preparation rather than paralysis.</p>

        <p><strong>Q: How do I talk to my parents about the pressure they are putting on me being making my fear of failure worse?</strong><br />
        A: The most effective conversation is specific, honest, and forward-directed rather than accusatory. Not "you are making me anxious" (which activates defensiveness) but "I want to tell you something honestly about what I need from you right now." Then specifically: "When [specific behaviour — e.g. asking about results before I have had a chance to process them / comparing me to classmates / expressing disappointment in front of others] happens, it increases my anxiety in a way that actually makes me study less effectively. What I need is [specific alternative behaviour]." Most parents who are contributing to academic pressure are doing so from care, not indifference — they respond to specific requests better than general complaints. Having this conversation once, specifically and calmly, produces more change than many indirect signals that the pressure is affecting you.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: MAROON, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You are allowed to care about your results without letting your results decide who you are."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          The fear of failure is almost always a signal about something true and important — that you care, that the stakes are real, that this matters to you. That caring is worth something. What it does not need to do is convince you that a bad result makes you less. You are more than any single result, any single exam, any single year of academic performance. That is not comfortable reassurance. It is structural reality. Hold it deliberately on the days when the fear says otherwise.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: MAROON, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${MBORD}` }}
          >
            Process This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: MAROON, border: `2px solid ${MAROON}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Get Support in our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Related Mental Health and Academic Guides:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/stay-calm-during-exams',       '→ How to Stay Calm and Confident During Exams'],
            ['/blog/exam-anxiety-help',             '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/self-acceptance-confidence',    '→ How to Build Confidence Through Self-Acceptance'],
            ['/blog/negative-self-talk',            '→ Breaking the Cycle of Negative Self-Talk'],
            ['/blog/academic-burnout-signs',        '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/relationship-with-yourself',    '→ How to Build a Strong Relationship with Yourself'],
            ['/safe',                               '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: MAROON, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
