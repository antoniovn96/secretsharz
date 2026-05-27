import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Control Your Thoughts and Emotions Naturally",
  excerpt: "Controlling your thoughts and emotions does not mean suppressing them or forcing yourself to feel differently. It means building the specific skills that allow you to observe what is happening inside you, respond to it with intention rather than automatically reacting, and return to a functional state without the kind of internal war that exhausts you further. This guide shows you how.",
  category: "Mental Health",
  date: "07-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/control-thoughts-emotions.jpg",
  tldr: "Emotional and thought control is not suppression — it is regulation. Research in cognitive neuroscience identifies specific, trainable skills that improve your capacity to observe internal states without being overwhelmed by them, redirect unhelpful thinking patterns, and return to emotional balance after difficulty. This guide covers the science of emotion regulation, six practical strategies, mindfulness-based approaches, real student examples, and an interactive Emotion Regulation Toolkit Builder.",
  toc: [
    { id: "what-control",  title: "1. What 'Controlling' Thoughts and Emotions Actually Means",        level: 3 },
    { id: "science",       title: "2. The Neuroscience of Emotion Regulation",                         level: 3 },
    { id: "toolkit",       title: "3. Interactive: The Emotion Regulation Toolkit Builder",            level: 3 },
    { id: "strategies",    title: "4. Six Natural Emotional Regulation Strategies",                    level: 3 },
    { id: "thoughts",      title: "5. Controlling Thoughts — The Mindfulness Approach",               level: 3 },
    { id: "faq",           title: "6. Thought and Emotion Control FAQs",                               level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-07T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "control thoughts and emotions, emotional regulation tips, how to control emotions naturally, mindfulness emotional control, thought control techniques, emotion regulation students, control negative thoughts",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you control your thoughts and emotions naturally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Natural thought and emotion control works through four sequential steps: awareness (noticing what is happening before reacting), labelling (naming the emotion or thought specifically, which reduces its intensity through affect labelling), evaluation (asking whether this thought or emotion is serving you right now), and response choice (selecting an intentional response rather than an automatic reaction). Daily mindfulness practice builds the awareness and labelling skills. Specific strategies — cognitive reframing, physiological regulation, and behavioural activation — develop the response repertoire. Together, these produce the regulation capacity that feels like 'control' without the suppression that makes things worse.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it bad to suppress emotions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, consistently. Research by James Gross at Stanford on emotion regulation strategies shows that suppression — trying to prevent emotions from being expressed or experienced — produces worse outcomes than reappraisal (changing the interpretation of the situation). Suppression uses significant cognitive resources (reducing working memory capacity for other tasks), increases physiological stress markers even when the emotion is not expressed, and is associated with worse long-term mental health outcomes. Effective emotion 'control' is not suppression — it is the capacity to experience emotions fully while choosing how to respond to them.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the fastest way to control emotions in a stressful moment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest evidence-backed emotional regulation techniques for acute stress are physiological: the physiological sigh (double inhale through the nose, long exhale through the mouth) produces measurable cortisol reduction within 30 seconds. Cold water on the face and wrists activates the mammalian diving reflex, directly lowering heart rate within seconds. Pressing feet firmly into the floor and naming five visible objects (5-4-3-2-1 grounding) interrupts the acute stress spiral within 2-3 minutes. These physiological approaches work faster than cognitive techniques in acute moments because the prefrontal cortex's reasoning capacity is temporarily reduced by acute cortisol — the body-based techniques restore enough prefrontal function for the cognitive tools to then work.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const PLUM    = '#6B3D8A';
const PPALE   = '#F3EEF9';
const PBORD   = 'rgba(107,61,138,0.22)';

// ── Emotion Toolkit Data ───────────────────────────────────────────────────────
const EMOTION_TYPES = [
  {
    key:      'anxiety_fear',
    icon:     '😰',
    label:    'Anxiety or fear',
    desc:     'Racing heart, racing thoughts, dread about something upcoming',
    color:    '#2D5A8A',
    bg:       '#EEF3FB',
    what_happening: 'Anxiety activates the amygdala\'s threat response — cortisol and adrenaline are released, the prefrontal cortex is partially downregulated, and the body prepares for threat. This system evolved to respond to physical danger and is now being activated by academic uncertainty, social evaluation, and performance pressure — all of which are real threats but none of which are resolved by the fight-or-flight response.',
    fastest_reset: 'Physiological sigh — double inhale through the nose, long exhale through the mouth. Three repetitions. This is the fastest available cortisol reset, producing measurable reduction in physiological arousal within 30 seconds.',
    mindfulness_approach: 'Label the anxiety specifically: "I notice I am feeling anxious about [specific thing]." The specificity of the label activates the prefrontal cortex and reduces amygdala activation within seconds (Kross et al., Michigan). Then: "This is anxiety. It is my threat system responding to uncertainty. The threat has not occurred."',
    regulation_strategies: [
      { icon: '😮‍💨', name: 'Physiological sigh', text: 'Double inhale (nose), long exhale (mouth). Three times. Reduces cortisol in 30 seconds — the fastest available natural intervention for acute anxiety.' },
      { icon: '👣', name: '5-4-3-2-1 grounding', text: 'Name 5 things seen, 4 felt, 3 heard, 2 smelled, 1 tasted. Redirects attention from the imagined threat to the present sensory reality. Works in 2-3 minutes.' },
      { icon: '📝', name: 'Write the worry out', text: 'Write the specific fear in one sentence. Then write: "What evidence do I have that this will happen? What evidence suggests it might not?" The evidence examination reduces the anxiety\'s certainty.' },
    ],
    long_term: 'Daily breath awareness practice (5 minutes morning) reduces baseline anxiety over 2-4 weeks by improving prefrontal-amygdala connectivity — the neural infrastructure of emotion regulation.',
    example: 'Priya would arrive at lectures already anxious about the exam in three weeks. She started catching the first physical sign of anxiety (a tightening in her chest) and labelling it: "That\'s anxiety about the exam." The naming alone did not solve anything — but it converted an overwhelming physical experience into a specific, nameable state with a beginning and an end.',
  },
  {
    key:      'anger_frustration',
    icon:     '😤',
    label:    'Anger or frustration',
    desc:     'Irritability, resentment, feeling unfairly treated or blocked',
    color:    '#8B2635',
    bg:       '#FBF0F1',
    what_happening: 'Anger is typically a secondary emotion — a high-energy response that protects against a more vulnerable primary one (usually hurt, fear, or shame). Research by Paul Ekman on emotion identifies anger as the emotion most associated with action readiness: it produces the urge to do something, change something, or express something. This energy is genuinely useful when directed toward addressing the actual situation. It becomes problematic when it is discharged indiscriminately or suppressed entirely.',
    fastest_reset: 'Physical discharge before cognitive work. Vigorous movement (a fast walk, anything physical) uses the adrenaline and cortisol of the anger response, after which the cognitive regulation tools become available. Attempting cognitive reframing while anger is physiologically peak typically fails — the prefrontal is too downregulated.',
    mindfulness_approach: 'Do not try to stop the anger. Instead: "I notice I am feeling angry. This anger is telling me something — what is the actual primary emotion underneath it?" Often the answer is hurt, embarrassment, or fear. Addressing the primary emotion is more effective than managing the anger itself.',
    regulation_strategies: [
      { icon: '🏃', name: 'Physical discharge first', text: 'Walk fast, do anything vigorous for 5-10 minutes. Uses the adrenaline the anger produced. After physical discharge, the cognitive tools become available.' },
      { icon: '✍️', name: 'Write it uncensored', text: 'Write everything you want to say or do — completely uncensored, not for anyone else to read. The writing discharges the anger enough to access the more vulnerable emotion underneath.' },
      { icon: '🔍', name: 'Find the primary emotion', text: 'Ask: "What am I protecting with this anger? What would I be feeling if the anger was gone?" Almost always: hurt, embarrassment, fear, or grief. Address that.' },
    ],
    long_term: 'Loving-kindness practice specifically reduces reactive anger by building the habit of goodwill as a default stance — which does not prevent anger but widens the space between trigger and reaction.',
    example: 'Rohan would get intensely angry when his parents made comments about his marks. In a counselling session, he discovered the anger was protecting a deeper feeling: "I feel like they don\'t trust me." Once he could access that feeling, the anger had a different quality — still real, but with a target that could actually be addressed in a conversation.',
  },
  {
    key:      'sadness_grief',
    icon:     '💔',
    label:    'Sadness or grief',
    desc:     'Heaviness, loss, disappointment, low mood that does not lift easily',
    color:    '#3A4D8A',
    bg:       '#EEF1FB',
    what_happening: 'Sadness is the appropriate emotional response to loss — of a result hoped for, of a relationship, of an expectation, of time. It serves the important function of signalling that something that mattered did not work out as hoped, and it creates the pause that genuine loss requires. The problem is not feeling sad; it is when sadness becomes stuck in rumination rather than moving through processing toward re-engagement.',
    fastest_reset: 'Allow the sadness to exist for a defined window rather than trying to lift it prematurely. Set a 20-minute "feeling window" and genuinely feel the sadness during it — rather than suppressing it and having it arrive more intensely later.',
    mindfulness_approach: 'Mindful sadness is not the same as wallowing. It is: "I notice I am sad about [specific thing]. This sadness is appropriate. I am going to feel it for a defined time and then, gently, redirect." The non-judgemental observation of sadness — without adding "I shouldn\'t be feeling this" or "I need to get over this" — allows it to move through rather than accumulate.',
    regulation_strategies: [
      { icon: '💛', name: 'Self-compassion phrase', text: '"This is a moment of difficulty. Difficulty is part of every student\'s life. May I be kind to myself right now." Repeat three times. Self-compassion specifically preserves the motivation and emotional stability that recovery requires.' },
      { icon: '🌿', name: 'Gentle movement in nature', text: 'A slow walk in any outdoor environment. Research on attention restoration theory shows that nature exposure specifically restores the emotional regulation capacity that sadness depletes, without requiring the active effort that more effortful activities demand.' },
      { icon: '💬', name: 'Tell one person honestly', text: 'Not the "I am fine" version. Tell one trusted person: "I am sad about [specific thing]." Being witnessed in difficulty — even once, briefly — significantly reduces its internal weight.' },
    ],
    long_term: 'Regular journalling (5 minutes of honest expressive writing, 3x per week) processes the emotional content of difficult experiences rather than accumulating it — preventing the emotional build-up that periodic low moods become chronic depression.',
    example: 'Meera received a disappointing result and spent a week telling herself she should not feel so bad — it was just one test, other people had it worse. The self-dismissal made the sadness heavier rather than lighter. When she finally wrote about the specific disappointment honestly — not the result but what she had hoped the result would mean — the weight began to shift.',
  },
  {
    key:      'shame_embarrassment',
    icon:     '😶',
    label:    'Shame or embarrassment',
    desc:     'Wanting to hide, feeling fundamentally inadequate, replaying humiliating moments',
    color:    '#C07800',
    bg:       '#FFF8E1',
    what_happening: 'Research by Brené Brown at the University of Houston distinguishes shame ("I am bad") from guilt ("I did something bad"). Shame is a global negative evaluation of the self — it produces the specific desire to hide, disappear, or avoid the people who witnessed the failure. For students, academic shame is particularly common because academic performance is often tied to identity: a poor result is experienced not as information about a preparation approach but as confirmation of fundamental inadequacy.',
    fastest_reset: 'The fastest shame interruption is the common humanity acknowledgment: "Every student who has ever done this has felt this at some point. This is not unique to me. This is the experience of trying and finding limits." The acknowledgment does not solve the shame but removes the isolation that makes shame most damaging.',
    mindfulness_approach: 'Mindful shame observation: "I notice I am feeling shame about [specific thing]. Shame tells me I am fundamentally deficient. I am going to observe this thought rather than believe it. What is the actual evidence about my fundamental worth?" The distinction between the shame feeling and the shame belief is the key.',
    regulation_strategies: [
      { icon: '🌍', name: 'Common humanity acknowledgment', text: '"Every student who has tried this has felt this. My shame is not evidence of unique inadequacy — it is evidence of a human response to difficulty." Say it, write it, believe even a small part of it.' },
      { icon: '👁️', name: 'Separate the event from the identity', text: '"I made a mistake in this exam" (specific event) vs "I am bad at this" (identity verdict). The first is accurate; the second is a shame story. Stay with the specific event only.' },
      { icon: '💛', name: 'The friend question', text: '"What would I say to a close friend who had just experienced exactly this?" Write the answer. The kindness offered to an imaginary friend is the kindness needed for the self — and it is usually far more accurate and fair than the shame narrative.' },
    ],
    long_term: 'Developing a non-academic self-worth foundation — relationships, values, creative practices, physical skills — reduces the academic performance system\'s power to produce shame. When results are not the only evidence of worth, disappointing results do not produce identity-level shame.',
    example: 'Aryan failed a unit test and felt so ashamed he did not tell his friends for two weeks — constructing a story about the result being different. When he finally told one friend the truth, his friend said: "I failed the same test last year and felt the same way." The shared experience immediately reduced the shame\'s weight. Shame lives in secrecy; being seen in it by someone who responds with care dissolves it.',
  },
  {
    key:      'overwhelm_shutdown',
    icon:    '🌊',
    label:    'Overwhelm or emotional shutdown',
    desc:     'Too much at once — either everything at once or numbness and inability to feel anything',
    color:    '#2D6B45',
    bg:       '#E8F4EE',
    what_happening: 'Overwhelm and shutdown are opposite ends of the same spectrum: both are the nervous system\'s response to demand that exceeds current coping capacity. Overwhelm is the active, flooded end — too much sensation and emotion simultaneously. Shutdown is the passive end — the nervous system\'s protective reduction of responsiveness when overwhelm is sustained. Both are normal, physiological responses to genuinely excessive demand, not character failures.',
    fastest_reset: 'For overwhelm: physiological sigh and immediate scope reduction — identify the single next thing, not the whole situation. For shutdown: gentle sensory stimulation — cold water, physical movement, one genuine social contact — to gradually re-engage the nervous system from its protective numbness.',
    mindfulness_approach: 'For overwhelm: "I notice I am overwhelmed. My nervous system is responding to too much at once. The first step is smaller: what is the one next thing?" For shutdown: "I notice I feel numb. This is a protective response. I am not broken. I will gently reintroduce sensation."',
    regulation_strategies: [
      { icon: '🎯', name: 'Single-item focus', text: 'In overwhelm, the entire situation cannot be addressed simultaneously. Write every demand on paper, then circle one — the most urgent, the most achievable, any one. Address only that. The single focus restores prefrontal function from the paralysis of too many simultaneous demands.' },
      { icon: '💧', name: 'Cold water reactivation (for shutdown)', text: 'Run cold water over face and wrists for 30 seconds. The diving reflex and sensory shock is one of the most reliable re-engagements of the nervous system from shutdown.' },
      { icon: '❤️', name: 'One genuine connection', text: 'Both overwhelm and shutdown are amplified by isolation. One brief, honest interaction with someone who genuinely cares — not a performance of managing fine, the honest experience — reduces both states measurably.' },
    ],
    long_term: 'The prevention of overwhelm and shutdown requires genuine daily recovery — not just absence of academic work, but active restoration: physical movement, adequate sleep, and at least one daily activity that produces genuine enjoyment completely independent of academic performance.',
    example: 'Ananya spent three weeks unable to feel anything about her approaching exams — not anxious, not motivated, just flat. She was in shutdown from months of sustained pressure without genuine recovery. Her counsellor asked her to do one small thing per day that had nothing to do with studying — a walk, a film, a meal cooked properly. By the end of two weeks, the anxiety returned. She was relieved. "I preferred anxious to numb," she said. "At least anxious meant I was still there."',
  },
];

const REGULATION_APPROACH = [
  { key: 'immediate', icon: '⚡', label: 'I need something to use right now — in this moment' },
  { key: 'daily',     icon: '📅', label: 'I want a daily practice I can build over time' },
  { key: 'deep',      icon: '🔬', label: 'I want to understand what\'s happening and address it properly' },
];

const SUPPORT_LEVEL = [
  { key: 'solo',   icon: '🧘', label: 'On my own — self-directed tools' },
  { key: 'social', icon: '👥', label: 'With support from someone I trust' },
  { key: 'both',   icon: '🌿', label: 'Both — some solo and some with others' },
];

// ── Toolkit Builder ────────────────────────────────────────────────────────────
function EmotionRegulationToolkit() {
  const [step,      setStep]      = useState(1);
  const [emotion,   setEmotion]   = useState(null);
  const [approach,  setApproach]  = useState(null);
  const [support,   setSupport]   = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openStrat, setOpenStrat] = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selEmo  = EMOTION_TYPES.find(e => e.key === emotion);
  const selApp  = REGULATION_APPROACH.find(a => a.key === approach);

  const handleReset = () => { setStep(1); setEmotion(null); setApproach(null); setSupport(null); setRevealed(false); setOpenStrat(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? PLUM : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What are you experiencing right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the description that fits most closely — even if it is not a perfect match.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {EMOTION_TYPES.map(et => {
              const isSel = emotion === et.key;
              return (
                <button key={et.key} onClick={() => setEmotion(et.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? et.color : 'var(--border)', background: isSel ? et.bg : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${et.color}30` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }}>{et.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? et.color : 'var(--ink)', marginBottom: '2px' }}>{et.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.35 }}>{et.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (emotion) setStep(2); }} disabled={!emotion} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: emotion ? `linear-gradient(135deg, ${PLUM}, #8B52B8)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: emotion ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: emotion ? `0 6px 18px ${PBORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What kind of support are you looking for right now?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {REGULATION_APPROACH.map(ra => {
              const isSel = approach === ra.key;
              return (
                <button key={ra.key} onClick={() => setApproach(ra.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)', background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${PBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{ra.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? PLUM : 'var(--ink)' }}>{ra.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (approach) setStep(3); }} disabled={!approach} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: approach ? `linear-gradient(135deg, ${PLUM}, #8B52B8)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: approach ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Who do you want to work through this with?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {SUPPORT_LEVEL.map(sl => {
              const isSel = support === sl.key;
              return (
                <button key={sl.key} onClick={() => setSupport(sl.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)', background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${PBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{sl.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? PLUM : 'var(--ink)' }}>{sl.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (support) { setStep(4); setRevealed(false); } }} disabled={!support} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: support ? `linear-gradient(135deg, ${PLUM}, #8B52B8)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: support ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Toolkit →</button>
          </div>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && selEmo && selApp && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Emotion Regulation Toolkit</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${PLUM}, #8B52B8)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${PBORD}`,
              }}>💜 Build My Toolkit</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${selEmo.color}, ${selEmo.color}BB)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '6px' }}>{selEmo.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                  Toolkit: {selEmo.label}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>{selApp.label}</div>
              </div>

              {/* What's happening */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '5px' }}>🔬 What Is Happening</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selEmo.what_happening}</p>
              </div>

              {/* Fastest reset */}
              {approach === 'immediate' && (
                <div style={{ background: selEmo.bg, border: `2px solid ${selEmo.color}30`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: selEmo.color, marginBottom: '5px' }}>⚡ Fastest Reset Right Now</div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '600' }}>{selEmo.fastest_reset}</p>
                </div>
              )}

              {/* Mindfulness approach */}
              <div style={{ background: PPALE, border: `1.5px solid ${PBORD}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '5px' }}>🧘 Mindfulness Approach</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selEmo.mindfulness_approach}</p>
              </div>

              {/* 3 Regulation strategies */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '8px' }}>
                  🛠️ Three Regulation Strategies
                </div>
                {selEmo.regulation_strategies.map((rs, i) => {
                  const isOpen = openStrat === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '6px', border: `1.5px solid ${PBORD}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStrat(isOpen ? null : i)} style={{
                        width: '100%', padding: '12px 15px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${PLUM}, #8B52B8)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{rs.icon}</div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: PLUM, flex: 1 }}>{rs.name}</span>
                        <span style={{ color: PLUM, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 15px 12px 15px', borderTop: '1px solid var(--border)' }}>
                          <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{rs.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Long-term */}
              {(approach === 'daily' || approach === 'deep') && (
                <div style={{ background: 'white', border: `1.5px solid ${PBORD}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '5px' }}>📅 Long-Term Practice</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{selEmo.long_term}</p>
                </div>
              )}

              {/* Social note */}
              {(support === 'social' || support === 'both') && (
                <div style={{ background: PPALE, border: `1.5px solid ${PBORD}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: PLUM, marginBottom: '5px' }}>❤️ Using Your Support</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
                    Tell one trusted person specifically what you are experiencing right now — not a summary, the honest version. Research consistently shows that the act of being genuinely seen in a difficult emotional state, by someone who responds with care rather than judgment, produces faster emotional recovery than any solo strategy. You do not have to work through this alone.
                  </p>
                </div>
              )}

              {/* Student example */}
              <div style={{ background: 'white', border: `1.5px solid ${PBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '5px' }}>👤 How a Student Worked Through This</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selEmo.example}</p>
              </div>

              {/* Affirmation */}
              <div style={{ background: PPALE, border: `1.5px dashed ${PBORD}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: PLUM, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "You do not control emotions by stopping them from existing. You control them by choosing what you do while they exist."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${PBORD}`, color: PLUM, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a toolkit for a different emotion</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ControlThoughtsEmotions({ navigate, relatedPosts }) {
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
      <p>When students say they want to <strong>control their thoughts and emotions</strong>, they usually mean one of two things: they want to stop feeling anxious before exams, or they want to stop spiralling into self-criticism after disappointing results. Both are completely understandable. And both are achievable — but not in the way most people first imagine.</p>

      <p>The path most students try first is suppression: pushing the feeling down, telling themselves not to think about it, forcing a positive attitude over the top of the difficult experience. Research by James Gross at Stanford on emotion regulation strategies shows this approach consistently makes things worse. Suppression requires significant cognitive resources, increases physiological stress markers even when the emotion is not visible, and the suppressed content returns with greater intensity. Control through suppression is not control — it is postponement with interest.</p>

      <p>Real control is different. It is regulation: the trained capacity to observe your internal state, understand what it is telling you, and choose your response rather than reacting automatically. This guide shows you how.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to control thoughts and emotions naturally — emotional regulation tips, mindfulness strategies, and practical daily tools"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-control">1. What 'Controlling' Thoughts and Emotions Actually Means</h3>

      <p><strong>The difference between control and regulation.</strong> Control, in everyday language, implies prevention — stopping something from happening. Emotional regulation, in psychological research, means something different: the ability to influence which emotions occur, when they occur, and how they are expressed or acted upon. This includes increasing desirable emotional states, decreasing unwanted ones, and most importantly, choosing how to respond to emotional states rather than being automatically driven by them. The goal is not a life without anxiety, anger, or sadness — it is a life in which these emotions are not automatically in the driver's seat.</p>

      <p><strong>The thought-emotion-behaviour cycle.</strong> Research by Aaron Beck on cognitive therapy identifies a specific three-way relationship between thoughts, emotions, and behaviour: thoughts produce emotional responses, emotions influence behaviour, and behaviour generates new thoughts that continue the cycle. This cycle operates largely automatically — most people are not aware that a thought is occurring before the emotional response has already begun. Learning to observe this cycle — to notice the thought before it has fully activated the emotional response — is the central skill of both cognitive therapy and mindfulness-based emotion regulation.</p>

      <p><strong>What you can and cannot control.</strong> You cannot fully control which thoughts arrive — the brain generates them automatically based on its learned associations and its current threat-monitoring state. You cannot control the initial emotional response to a thought — the amygdala's first response occurs in milliseconds, before conscious awareness. What you can train is: the speed of noticing (how quickly awareness catches up to the thought or emotion), the quality of observation (whether you observe it or are inside it), and the response choice (whether you act from the emotion automatically or choose your response after observing it). These three trainable capacities are what emotion regulation actually develops.</p>

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Neuroscience of Emotion Regulation</h3>

      <p><strong>The prefrontal-amygdala relationship — the biology of regulation.</strong> Emotion regulation is neurologically a relationship between two brain systems: the amygdala (the threat detection and emotional activation centre) and the prefrontal cortex (the reasoning, planning, and regulation centre). When the amygdala activates strongly — as it does during acute anxiety, anger, or shame — it partially downregulates the prefrontal cortex. This is why it is hard to think clearly when feeling intensely emotional: the thinking system is being partially suppressed by the feeling system. Emotion regulation strategies work by restoring prefrontal function — either directly (through physiological techniques that reduce cortisol and restore prefrontal capacity) or through the prefrontal's own top-down regulation of amygdala activation.</p>

      <p><strong>Affect labelling — the fastest available cognitive intervention.</strong> Research by Matthew Lieberman and colleagues at UCLA on affect labelling shows that putting an emotional experience into words — specifically, naming it — activates the prefrontal cortex and reduces amygdala activation within seconds of the labelling. Brain scans during this process show the classic prefrontal-amygdala regulation pattern: as the verbal label activates the prefrontal language areas, the amygdala's activation measurably reduces. This is why the instruction to "name what you are feeling" appears in almost every therapeutic and mindfulness-based regulation approach: it is not platitude, it is a specific, measurable neurological intervention available to anyone in any situation.</p>

      <p><strong>Cognitive reappraisal — the most effective long-term strategy.</strong> Research by James Gross comparing suppression, distraction, and cognitive reappraisal as emotion regulation strategies consistently identifies reappraisal as the healthiest long-term approach. Reappraisal means changing the interpretation of a situation — not denying the difficulty but finding a different meaning or perspective that changes the emotional significance. "This disappointing result is evidence that my preparation method needs to change" (reappraisal) versus "this result means I am not capable" (the initial automatic interpretation). Reappraisal produces better mood, lower physiological stress, and better long-term psychological outcomes than either suppression or rumination.</p>

      <p><strong>The role of mindfulness — observation before regulation.</strong> Mindfulness research by Sara Lazar at Harvard and Britta Hölzel at MGH shows that mindfulness practice develops the observation capacity that precedes all other regulation strategies. You cannot apply affect labelling if you have not noticed the emotion. You cannot choose a reappraisal if you are already inside the automatic interpretation. You cannot select a regulation strategy if the emotion is running automatically before awareness has caught up. Mindfulness builds the awareness gap — the space between stimulus and response — in which all the other strategies become available. This is why mindfulness is the foundation of natural emotion regulation rather than a tool among many equivalent alternatives.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="toolkit">3. Interactive: The Emotion Regulation Toolkit Builder</h3>
      <p>The Toolkit Builder generates a personalised regulation plan for your current emotional state, what kind of support you are looking for, and whether you want to use it alone or with others. The result includes what is happening psychologically, the fastest available reset for acute states, a mindfulness approach, three specific regulation strategies, and a student example of someone who worked through the same experience.</p>

      <EmotionRegulationToolkit />

      {/* ── Section 4 ── */}
      <h3 id="strategies">4. Six Natural Emotional Regulation Strategies</h3>

      <p><strong>1. Name it to tame it — affect labelling as the first response.</strong> Before any other strategy: name the emotion specifically. Not "I feel bad" — "I feel ashamed about the result I got in Chemistry." Not "I am stressed" — "I feel afraid that this exam might not go well and that will disappoint my parents." The specificity of the label is what activates the prefrontal cortex and begins the regulation. General negative affect ("feeling bad") does not produce the same neural response as specific emotional labelling. This one-sentence labelling practice is the most immediately available regulation tool in any situation and requires no preparation, equipment, or time beyond the moment of noticing.</p>

      <p><strong>2. Cognitive reappraisal — changing the story without denying the difficulty.</strong> Reappraisal is not positive thinking. It is the deliberate consideration of alternative interpretations of the same event that are also accurate. A disappointing exam result has at least three honest interpretations: "I failed" (accurate but global and permanent-feeling), "my preparation method for this subject did not produce the result I hoped for" (accurate, specific, and actionable), and "I have specific information about exactly what to study differently" (accurate, specific, and forward-directed). All three are true. The first produces helplessness; the third produces direction. Choosing the third is not denial — it is a more complete and more useful truth.</p>

      <p><strong>3. Physiological regulation — the body-first approach.</strong> In acute emotional states — particularly anxiety, anger, and overwhelm — the prefrontal cortex's reasoning capacity is genuinely reduced by the cortisol and adrenaline of the emotional activation. Cognitive strategies require prefrontal function; when that function is temporarily reduced, cognitive strategies have limited traction. Physiological regulation (the physiological sigh, cold water, vigorous movement) restores enough prefrontal function for the cognitive tools to then work. The sequence for acute states is always: physiological first, cognitive second.</p>

      <p><strong>4. Behavioural activation — action as an emotional regulation tool.</strong> Research by Peter Lewinsohn at Oregon on behavioural activation shows that engagement in valued activities — things that produce genuine interest, mastery, or pleasure — directly improves mood independent of whether the person feels motivated to engage. For students, this means that waiting to feel better before resuming enjoyable activities is precisely backward: the activities are what produce the feeling better. One daily activity that produces genuine engagement — even for 20 minutes, even when motivation is low — consistently outperforms passive rest for emotional recovery from difficult states.</p>

      <p><strong>5. Expressive writing — processing through language.</strong> Research by James Pennebaker at the University of Texas on expressive writing shows that writing about emotional experiences — specifically, the deepest thoughts and feelings about difficult events — produces significant and lasting improvements in psychological wellbeing over two weeks of consistent practice. The mechanism is the processing of emotional content through language, which activates the same cognitive-emotional integration that talking to a therapist provides. Five minutes of honest, uncensored writing about a current emotional difficulty, three times per week, is an evidence-based self-directed emotion regulation practice available to every student with a notebook.</p>

      <p><strong>6. Social regulation — the shared experience as medicine.</strong> Research by James Coan at the University of Virginia on social regulation of emotion shows that the nervous system is designed to co-regulate with other nervous systems: the presence of a trusted person in a difficult moment produces measurable reductions in physiological stress markers that are not available through self-regulation alone. This is not dependency — it is the accurate recognition that humans are a profoundly social species whose stress management systems evolved in the context of ongoing social support. Telling one trusted person honestly what you are experiencing is not weakness; it is the use of the most potent emotion regulation tool in human evolutionary history.</p>

      {/* ── Section 5 ── */}
      <h3 id="thoughts">5. Controlling Thoughts — The Mindfulness Approach</h3>

      <p><strong>Why you cannot stop thoughts by trying to stop them.</strong> Research by Daniel Wegner at Harvard on thought suppression — the "white bear" experiments — shows that attempting not to think about something reliably increases the frequency of that thought. When you tell yourself "don't think about the exam," the instruction paradoxically requires activating the concept "exam" to monitor whether you are thinking about it, which increases its accessibility. This is the psychological mechanism behind the specific exhaustion of exam-season anxiety: the attempt to suppress exam-related thoughts makes them more present, not less.</p>

      <p><strong>The observation approach instead.</strong> Rather than suppressing or fighting thoughts, the mindfulness approach is to change your relationship to them. Three practices build this:</p>

      <p><strong>Defusion (from Acceptance and Commitment Therapy by Steven Hayes):</strong> Preface every anxious thought with "I notice I am having the thought that..." — converting "I am going to fail" to "I notice I am having the thought that I am going to fail." The phrasing creates cognitive distance between the observer and the thought, making it an object of awareness rather than a truth about reality. Research on defusion consistently shows this simple linguistic shift reduces the emotional impact and behavioural influence of anxious thoughts.</p>

      <p><strong>The parking lot practice:</strong> When intrusive thoughts arrive during study or sleep, write each one in a sentence in a designated notebook. This externalises the thought from internal holding to external storage, discharging the brain's reminder function (which is what makes intrusive thoughts recur — the brain keeps regenerating them to ensure they are not forgotten). The written thought is acknowledged and stored; additional mental rehearsal is no longer required.</p>

      <p><strong>The 'is this useful?' question:</strong> For every recurring thought, ask: "Is thinking about this right now producing anything useful — a decision, a plan, a changed understanding?" If yes, engage with it and act. If no, it is rumination rather than reflection, and the parking lot is its appropriate destination. This simple binary question applied consistently converts the passive experience of being dominated by thoughts into the active practice of choosing which thoughts to engage with.</p>

      <p><strong>Student examples of the thought control shift:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li>Vikram started prefacing his catastrophic exam thoughts with "I notice I am having the thought that..." and found the distance made them feel "like something happening in my head rather than something happening to me." The thought was still there. His relationship to it had changed.</li>
        <li>Priya kept a parking lot notebook by her bed for a week. By the end of the week, she was falling asleep within twenty minutes rather than the usual hour — not because the thoughts stopped but because they had somewhere to go that was not her active working memory.</li>
        <li>Ananya learned to ask "is this useful?" before engaging with a recurring worry. Most of the worries — about results not yet received, about conversations not yet happened — were not useful. Writing "not useful, parking it" in her notebook was enough to reduce the anxiety they were producing.</li>
      </ul>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Thought and Emotion Control FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is it healthy to control emotions, or should I just let myself feel everything?</strong><br />
        A: Both extremes are problematic. Complete emotional suppression — chronically preventing emotions from being experienced or expressed — is associated with worse long-term physical and mental health outcomes. But emotional flooding — being completely at the mercy of every emotional state without any capacity to regulate them — produces impaired decision-making, damaged relationships, and chronic distress. The healthy middle ground is what regulation research describes as emotional flexibility: the ability to experience emotions fully, understand what they are telling you, and choose how to respond rather than reacting automatically. This is not control in the sense of suppression — it is sovereignty over how you act while feeling what you feel.</p>

        <p><strong>Q: My emotions feel completely out of control sometimes. Does this mean something is wrong with me?</strong><br />
        A: No. Research consistently shows that emotion regulation capacity is learned and developed — it is not a fixed trait determined by personality. Students who experience intense emotional states they find difficult to manage have typically been in environments that did not model or teach regulation skills, or are currently in situations of genuinely high stress that temporarily exceed their existing regulation capacity. Both are changeable. The practices in this guide build regulation capacity gradually — not in a single session but over weeks of consistent practice. Students with persistently overwhelming emotional states that significantly impair daily functioning may benefit from working with a counsellor who can provide more targeted, responsive support alongside self-directed practice.</p>

        <p><strong>Q: Can I use these strategies to help a friend who is struggling emotionally?</strong><br />
        A: The most effective thing you can do for a friend in emotional difficulty is not to immediately apply strategies to them. Research on emotional support consistently shows that being heard and acknowledged before being advised or fixed produces better outcomes — and that unsolicited strategy-sharing is frequently experienced as dismissive rather than helpful. The first response to a friend in emotional difficulty is presence and acknowledgment: "That sounds really hard. How are you feeling about it?" The strategies in this guide become relevant later in the conversation, and most effectively when the friend asks for tools rather than when they are offered before the emotional experience has been fully acknowledged.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: PLUM, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "You are not your emotions. You are the one who experiences them — and that distinction is the entire ground of natural regulation."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          The capacity to observe what is happening inside you without being completely at its mercy is a skill. It is not a personality type, a sign of strength, or something only some people have access to. It is trainable, gradually, through daily practice. The exercises in this guide — the naming, the reappraisal, the breath, the writing — each build a small piece of that capacity. Use them consistently and the regulation that feels effortful now becomes the default that takes care of itself later.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: PLUM, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${PBORD}` }}
          >
            Process Your Emotions in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: PLUM, border: `2px solid ${PLUM}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-for-students',       '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/stay-present-stop-overthinking', '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/breathing-exercises-stress',     '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/benefits-of-mindfulness',        '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/blog/emotional-boundaries',           '→ How to Set Emotional Boundaries With People You Love'],
            ['/blog/exam-results-stress',            '→ How to Handle Exam Results Stress and Anxiety'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: PLUM, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
