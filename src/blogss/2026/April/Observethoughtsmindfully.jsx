import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Observe Your Thoughts Without Judging Them",
  excerpt: "Most people are not having their thoughts — their thoughts are having them. The difference between being inside a thought and observing it from outside is the difference between being carried away by a river and watching it flow past from the bank. This guide teaches you to find the bank — through mindfulness, through specific thought-observation techniques, and through the calming exercises that make the shift from fusion to observation practically achievable.",
  category: "Mental Health",
  date: "21-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/observe-thoughts-mindfully.jpg",
  tldr: "Observing thoughts without judging them is a learnable skill built on three foundations: understanding that thoughts are mental events, not facts; developing the metacognitive stance that watches thinking rather than being inside it; and practising specific mindfulness-based observation techniques until the watching becomes accessible in daily life. This guide covers all three with the science, practical examples, four observation metaphors, calming exercises, and an interactive Thought Observer Studio.",
  toc: [
    { id: "fusion",    title: "1. Fusion vs Observation — What Changes When You Watch Your Thoughts",  level: 3 },
    { id: "science",   title: "2. The Neuroscience of Thought Observation",                            level: 3 },
    { id: "studio",    title: "3. Interactive: The Thought Observer Studio",                           level: 3 },
    { id: "metaphors", title: "4. Four Observation Metaphors That Actually Work",                      level: 3 },
    { id: "exercises", title: "5. Calming Exercises for Non-Judgmental Thought Observation",           level: 3 },
    { id: "faq",       title: "6. Observing Thoughts Mindfully FAQs",                                  level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-21T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "observe thoughts mindfully, thought awareness mindfulness, non-judgmental thought observation, watch thoughts without judgment, mindfulness thought observation, defusion mindfulness, mindful thinking",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I observe my thoughts without judging them?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Observing thoughts without judging them requires the decentred perspective — watching thoughts as mental events rather than being inside them. Three specific practices build this: defusion (prefacing any thought with 'I notice I am having the thought that...' which creates cognitive distance), thought labelling (noting the type of thought — 'planning,' 'worrying,' 'judging' — without engaging its content), and metaphor-based observation (imagining thoughts as clouds, leaves on a river, or passing trains, and watching rather than following them). The non-judgmental quality comes from noticing when judgment of a thought has arrived — 'I notice I am judging this thought as bad' — and returning to observation. The observing position is not permanently held; the practice is returning to it every time it is lost.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between thinking and observing thoughts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Thinking is the automatic, immersive process in which thoughts generate other thoughts in chains of association — you are inside the thinking, carried along by it. Observing thoughts is the metacognitive process in which awareness steps back from the automatic chain to notice that thinking is happening — watching the process from outside rather than participating in it. Research by Teasdale and colleagues on metacognitive awareness documents this distinction neurologically: ordinary thinking involves activation of the default mode network; metacognitive observation involves the anterior cingulate and prefrontal networks that modulate the DMN's activity. The key characteristic: in observation mode, a thought can arise, be noticed, and be allowed to pass without generating the next thought in its chain.",
      },
    },
    {
      "@type": "Question",
      "name": "Why is it important to observe thoughts without judgment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Observing thoughts without judgment is important for three specific reasons. First, the non-judgment removes the secondary layer of distress that judgment adds: judging a thought as bad produces anxiety about having the thought on top of any anxiety the thought itself produced. Research on metacognitive beliefs by Adrian Wells at Manchester shows that 'my thoughts are dangerous/controllable' beliefs are the primary driver of clinical-level rumination — the judgment is more harmful than the thought. Second, non-judgmental observation allows genuine evaluation: you cannot accurately assess a thought's validity while inside it; observing it allows a more accurate appraisal. Third, the practice reduces the frequency and intensity of unwanted thoughts — paradoxically, trying to suppress thoughts increases them (Wegner's white bear effect), while observing them without resistance reduces their occurrence and impact.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const COBALT  = '#2A5F9A';
const CPALE12 = '#EBF2FA';
const CBORD12 = 'rgba(42,95,154,0.22)';

// ── Thought types ──────────────────────────────────────────────────────────────
const THOUGHT_TYPES = [
  {
    key:        'worry',
    icon:       '😰',
    label:      'Worry thoughts',
    desc:       'About exams, results, future outcomes — "what if" chains',
    color:      '#8B2635',
    bg:         '#FBF0F1',
    nature:     'Worry thoughts are future-oriented threat simulations — the brain running "what if it goes wrong" scenarios in an attempt to prepare for or prevent feared outcomes. They are self-perpetuating: each scenario reveals another uncertainty, which generates another simulation. They feel urgent because they mimic real threat signals.',
    observation_tip: 'Worry thoughts specifically benefit from the "is this happening right now?" check. When you observe a worry thought, ask: is this actually occurring in the present moment? Almost always: no. The thought is about a future that has not happened. Naming this — "I notice I am having a thought about a future that does not exist yet" — reduces the urgency that makes worry thoughts feel like emergency signals.',
    judge_pattern: 'Most common judgment: "I should not be worrying about this" or "this worry means something terrible is going to happen." Both add distress to the worry without changing its content.',
    best_metaphor: 'clouds',
    calming_exercise: 'physio_sigh',
  },
  {
    key:        'self_critical',
    icon:       '😔',
    label:      'Self-critical thoughts',
    desc:       'Judgments about your own ability, worth, or behaviour',
    color:      '#5B3A8B',
    bg:         '#F2EEF9',
    nature:     'Self-critical thoughts often feel more authoritative than other thought types because they arrive in the first person and use the language of self-knowledge. "I am not good enough" feels like a fact about the self rather than a thought about the self. Research by Paul Gilbert on self-criticism documents that the threat system activates in response to self-directed criticism in the same way it activates in response to external threat — the brain cannot fully distinguish between being attacked by another and attacking oneself.',
    observation_tip: 'Self-critical thoughts specifically benefit from the perspective shift: "Would I say this to someone I genuinely care about?" When observing a self-critical thought, note: "I am applying a standard to myself that I would not apply to anyone else I value." The observation does not eliminate the thought — but it reveals its double standard.',
    judge_pattern: 'Most common judgment: "This self-critical thought is true — I really am [the thing the thought claims]." The belief that the thought must be accurate is itself a thought — and can itself be observed.',
    best_metaphor: 'sky',
    calming_exercise: 'loving_kindness',
  },
  {
    key:        'rumination',
    icon:       '🔄',
    label:      'Rumination — replaying past events',
    desc:       'Going over conversations, results, or situations repeatedly',
    color:      '#2D5A8A',
    bg:         '#EEF3FB',
    nature:     'Rumination is cyclical retrospective processing — the mind returns to the same past event or experience repeatedly, reconstructing it in detail without producing new information or changed outcomes. Research by Susan Nolen-Hoeksema at Yale identifies rumination as the primary cognitive maintaining factor for depression. Its specific quality: it masquerades as productive reflection ("I need to understand what happened") while producing no actual understanding — just repeated emotional activation.',
    observation_tip: 'Ruminative thoughts specifically benefit from the "is there new information here?" check. When observing a ruminative thought, ask: "Have I had this thought before? Did it produce any new understanding last time?" Almost always: yes, and no. "I notice I am returning to this event for the [estimated number]th time today. The event happened. No new information is available from returning to it."',
    judge_pattern: 'Most common judgment: "I should be over this by now" or "thinking about this means I am weak/dwelling." The judgment adds shame to the rumination and increases both.',
    best_metaphor: 'river',
    calming_exercise: 'box_breathing',
  },
  {
    key:        'random',
    icon:       '💭',
    label:      'Random / intrusive thoughts',
    desc:       'Thoughts that seem to appear from nowhere, sometimes disturbing',
    color:      '#2D6B45',
    bg:         '#E8F4EE',
    nature:     'Random and intrusive thoughts — including the kind that arrive at inconvenient moments with disturbing content — are a universal human experience. Research by Stanley Rachman and Paul Salkovskis on intrusive thoughts documents that 90%+ of people report having intrusive thoughts with disturbing content; the thoughts themselves are not what causes problems. What determines their impact is the response: engaging with them, trying to suppress them, or treating them as significant signals all increase their frequency and distress. Non-judgmental observation is the most effective response available.',
    observation_tip: 'Random and intrusive thoughts specifically benefit from the neutralisation of their special status: "Just another thought." When a disturbing intrusive thought arrives, the observation is: "I notice a disturbing thought has appeared. It arrived uninvited. Its arrival does not mean anything about me. It is just another thought passing through."',
    judge_pattern: 'Most common judgment: "The fact that this thought arrived means something is wrong with me / means I am a bad person / means I secretly want what the thought described." None of these are accurate — thought arrival says nothing about character or desire.',
    best_metaphor: 'train',
    calming_exercise: 'breath_count',
  },
  {
    key:        'planning',
    icon:       '📋',
    label:      'Planning / racing thoughts',
    desc:       'Mind going at speed — to-do lists, multiple things simultaneously',
    color:      COBALT,
    bg:         CPALE12,
    nature:     'Planning and racing thoughts represent the prefrontal cortex\'s executive function running at high load — simultaneously maintaining multiple tasks, deadlines, and concerns in working memory. This mode is adaptive during genuine planning tasks and maladaptive when it cannot be switched off — particularly during rest or sleep periods when the planning continues without any of the actual planning work being done.',
    observation_tip: 'Planning thoughts specifically benefit from the "parking lot" observation: when you notice a planning thought during a non-planning period (during rest, during mindfulness practice, at bedtime), observe it: "I notice a planning thought about [topic]. I will give this its proper time at [specific time]." The promise of a dedicated planning time signals to the planning system that the thought has been heard and does not need to keep recurring.',
    judge_pattern: 'Most common judgment: "I should be relaxing right now, not thinking about this" or "I have so much to do I cannot possibly relax." The judgment about the planning produces meta-anxiety that adds to the cognitive load.',
    best_metaphor: 'train',
    calming_exercise: 'box_breathing',
  },
];

const OBSERVATION_METAPHORS = {
  sky: {
    id:     'sky',
    name:   'You are the Sky — Thoughts are Weather',
    icon:   '🌤️',
    color:  '#1A7272',
    bg:     '#EBF5F5',
    description: 'You are the sky — vast, open, unchanging. Your thoughts are weather: clouds of different densities, storms that pass, patches of blue that follow. The weather happens in you, not to you. No matter how intense the storm, the sky itself is never destroyed.',
    how_to: 'Close your eyes. Take three slow breaths. Feel the open, spacious quality of awareness itself — the capacity to be aware of anything. That capacity is the sky. Now let thoughts arrive. Watch each one as you would watch a cloud: notice its shape and density, watch it drift across the sky, do not try to make it stay or go. You are not the cloud. You are the sky in which it moves.',
    example: 'The anxious thought "I am going to fail" arrives like a dark cloud moving quickly. Sky-observation: notice the cloud, its colour and density, watch it move across the sky. Does the sky become anxious about the cloud? No. The cloud passes. Another arrives. The sky remains.',
    difficulty: 'Beginner',
    best_for: ['self_critical', 'random', 'worry'],
  },
  river: {
    id:     'river',
    name:   'You are the Bank — Thoughts are the River',
    icon:   '🌊',
    color:  '#2D5A8A',
    bg:     '#EEF3FB',
    description: 'You are standing on the bank of a river. Your thoughts are the water — constantly moving, sometimes fast and turbulent, sometimes slow and quiet. You can see what passes in the river. You do not have to get in.',
    how_to: 'Sit comfortably. Close your eyes. Visualise yourself sitting at the edge of a gently moving river. As each thought arises, imagine placing it on the surface of the water — on a leaf, a log, a passing boat. Watch it float downstream. You remain on the bank — present, aware, unmoved.',
    example: 'The ruminative thought "why did I say that in the presentation?" arrives. River-observation: place it on a leaf, watch the leaf float downstream. It passes a bend in the river and is gone from view. Another thought arrives. It too is placed on a leaf. The bank remains.',
    difficulty: 'Beginner',
    best_for: ['rumination', 'worry', 'random'],
  },
  train: {
    id:     'train',
    name:   'You are on the Platform — Thoughts are Trains',
    icon:   '🚉',
    color:  COBALT,
    bg:     CPALE12,
    description: 'You are standing on a train platform. Trains arrive and depart — some fast, some slow, some carrying familiar destinations, some going somewhere unknown. You do not have to board every train that arrives.',
    how_to: 'Close your eyes. Visualise yourself on a calm, spacious train platform. As each thought arrives, imagine it as a train pulling in. Read the destination sign — "Exam worry," "Past replay," "What if?" — and choose: step back and let it depart, or notice if you have already boarded. If you have boarded, simply step off the train and return to the platform.',
    example: 'The racing thought "I need to finish the assignment and then study for the test and then reply to those messages" arrives as a high-speed train. Platform-observation: read the destination sign — "To-do list." Notice the urge to board. Step back. Let the train depart. Return to the platform, which is always just here.',
    difficulty: 'Intermediate',
    best_for: ['planning', 'rumination', 'random'],
  },
  movie: {
    id:     'movie',
    name:   'You are the Audience — Thoughts are on Screen',
    icon:   '🎬',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    description: 'You are sitting in a cinema watching a film. The film is your thoughts — vivid, sometimes intense, sometimes mundane. You are in the audience seat, not in the film itself. You can watch without being the character.',
    how_to: 'Close your eyes. Imagine sitting comfortably in a cinema. The screen in front of you begins to show your thoughts — whatever is present right now. Watch the screen. Note what appears: images, words, fragments of conversation, scenarios. You are a curious, attentive audience member. When you find yourself absorbed in the film — thinking you are in the scene — notice: "I have stepped into the screen." Step back into the audience seat.',
    example: 'The self-critical thought "you are not good enough for this" appears on the screen as words. Cinema-observation: watch the words on the screen from the audience seat. Notice the urge to agree or argue. Neither agreement nor argument is required — you are watching a film. The credits for this scene will roll.',
    difficulty: 'Intermediate',
    best_for: ['self_critical', 'worry', 'rumination'],
  },
};

const CALMING_EXERCISES = {
  physio_sigh: {
    id:    'physio_sigh',
    name:  'Physiological Sigh',
    icon:  '😮‍💨',
    color: '#1A7272',
    time:  '45 seconds',
    duration: 45,
    phases: [
      { name: 'First inhale', secs: 2, note: 'Fill the lungs 80% through the nose' },
      { name: 'Top-up inhale', secs: 1, note: 'One sharp extra inhale — fill completely' },
      { name: 'Long exhale', secs: 6, note: 'Exhale completely through the mouth' },
    ],
    cycles: 3,
    why: 'The fastest available cortisol reset — reduces the physiological activation that makes thoughts feel urgent and overwhelming.',
  },
  loving_kindness: {
    id:    'loving_kindness',
    name:  'Self-Compassion Phrase',
    icon:  '💛',
    color: '#C07800',
    time:  '2 minutes',
    duration: 120,
    phases: [
      { name: 'Settle', secs: 20, note: 'Close your eyes. Three slow breaths. Let the body soften.' },
      { name: 'Acknowledge', secs: 25, note: 'Bring the self-critical thought to mind briefly. "This is a moment of difficulty."' },
      { name: 'Common humanity', secs: 25, note: '"Every person who tries what I am trying has felt something like this."' },
      { name: 'Kindness phrase', secs: 30, note: '"May I be kind to myself right now. May I give myself what I need."' },
      { name: 'Rest', secs: 20, note: 'Breathe. Notice any small shift. Open your eyes gently.' },
    ],
    cycles: 1,
    why: 'Self-compassion specifically interrupts the judgment that amplifies self-critical thoughts — treating the thought and the thinker with kindness rather than criticism.',
  },
  box_breathing: {
    id:    'box_breathing',
    name:  'Box Breathing (4-4-4-4)',
    icon:  '⬜',
    color: COBALT,
    time:  '2 minutes',
    duration: 120,
    phases: [
      { name: 'Inhale', secs: 4, note: 'Breathe in slowly through the nose' },
      { name: 'Hold', secs: 4, note: 'Hold — body completely relaxed' },
      { name: 'Exhale', secs: 4, note: 'Exhale slowly through the nose or mouth' },
      { name: 'Hold', secs: 4, note: 'Hold the empty breath' },
    ],
    cycles: 4,
    why: 'Balances the autonomic nervous system through the equal-ratio pattern, providing the calm attentional foundation that thought observation requires.',
  },
  breath_count: {
    id:    'breath_count',
    name:  'Mindful Breath Counting',
    icon:  '🔢',
    color: '#2D6B45',
    time:  '3 minutes',
    duration: 180,
    phases: [
      { name: 'Settle', secs: 20, note: 'Close your eyes. Natural breathing. Let the body arrive here.' },
      { name: 'Begin counting', secs: 140, note: 'Count each exhale: "one"... "two"... up to ten. Then return to "one." When you lose count, gently return to "one" without self-criticism.' },
      { name: 'Close', secs: 20, note: 'Take a deeper breath. Notice: the mind is slightly quieter. Open your eyes.' },
    ],
    cycles: 1,
    why: 'Breath counting simultaneously calms (through regulated breathing) and trains attentional stability. The return to "one" after losing the count is the direct practice of non-judgmental awareness — noticing without criticising.',
  },
};

// ── Thought Observer Studio ────────────────────────────────────────────────────
function ThoughtObserverStudio() {
  const [step,       setStep]       = useState(1);
  const [thoughtType,setThoughtType]= useState(null);
  const [metaphor,   setMetaphor]   = useState(null);
  const [mode,       setMode]       = useState('select'); // select | guide | exercise
  const [exPhase,    setExPhase]    = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(0);
  const [running,    setRunning]    = useState(false);
  const [exDone,     setExDone]     = useState(false);
  const [exCycle,    setExCycle]    = useState(0);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selType = THOUGHT_TYPES.find(t => t.key === thoughtType);
  const selMeta = metaphor ? OBSERVATION_METAPHORS[metaphor] : null;
  const exercise = selType ? CALMING_EXERCISES[selType.calming_exercise] : null;
  const phases   = exercise?.phases || [];
  const TOTAL_CYCLES = exercise?.cycles || 1;
  const curPhase = phases[exPhase];

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intRef.current);
          setRunning(false);
          const nextIdx = (exPhase + 1) % phases.length;
          if (nextIdx === 0) {
            const newCycle = exCycle + 1;
            setExCycle(newCycle);
            if (newCycle >= TOTAL_CYCLES) { setExDone(true); return 0; }
          }
          setExPhase(nextIdx);
          setTimeLeft(phases[nextIdx].secs);
          setRunning(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, exPhase, exCycle, phases, TOTAL_CYCLES]);

  const startExercise = () => {
    setExPhase(0); setExCycle(0); setExDone(false);
    setTimeLeft(phases[0].secs); setRunning(true);
    setMode('exercise');
  };

  const handleReset = () => {
    clearInterval(intRef.current);
    setStep(1); setThoughtType(null); setMetaphor(null); setMode('select');
    setExPhase(0); setTimeLeft(0); setRunning(false); setExDone(false); setExCycle(0);
  };

  const CIRC = 2 * Math.PI * 44;
  const pct  = curPhase ? (curPhase.secs - timeLeft) / curPhase.secs : 0;

  // ── EXERCISE MODE ──────────────────────────────────────────────────────────
  if (mode === 'exercise' && exercise) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ background: `${exercise.color}12`, borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: exercise.color }}>{exercise.icon} {exercise.name}</div>
          <button onClick={() => { clearInterval(intRef.current); setMode('guide'); setExPhase(0); setRunning(false); setExDone(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>×</button>
        </div>

        {!running && !exDone && exCycle === 0 && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{exercise.why}</p>
            <button onClick={startExercise} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font }}>▶ Begin {exercise.time} Practice</button>
          </>
        )}

        {(running || (exCycle > 0 && !exDone)) && curPhase && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 14px auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="44" fill="none" stroke={`${exercise.color}18`} strokeWidth="6" />
                <circle cx="55" cy="55" r="44" fill="none" stroke={exercise.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (timeLeft / curPhase.secs)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: exercise.color, lineHeight: 1 }}>{timeLeft}</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>sec</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: exercise.color, marginBottom: '3px' }}>{curPhase.name}</div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>{curPhase.note}</p>
            {TOTAL_CYCLES > 1 && (
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '8px' }}>
                {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                  <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: i < exCycle ? exercise.color : i === exCycle ? `${exercise.color}60` : 'var(--border)' }} />
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {running
                ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                : <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
              }
            </div>
          </div>
        )}

        {exDone && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: exercise.color, marginBottom: '8px' }}>Complete</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>Notice how you feel now compared to when you started. Even a small shift is real.</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={startExercise} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={() => { clearInterval(intRef.current); setMode('guide'); setExDone(false); setExPhase(0); setExCycle(0); }} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back to Guide</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── GUIDE MODE ─────────────────────────────────────────────────────────────
  if (mode === 'guide' && selType && selMeta && exercise) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${selType.color}, ${selType.color}BB)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '5px' }}>{selType.icon} {selMeta.icon}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>Your Observation Guide</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selType.label} · {selMeta.name}</div>
        </div>

        {/* Thought nature */}
        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>🧠 Why This Thought Type Feels the Way It Does</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selType.nature}</p>
        </div>

        {/* Metaphor guide */}
        <div style={{ background: selMeta.bg, border: `2px solid ${selMeta.color}30`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selMeta.color, marginBottom: '5px', letterSpacing: '1.2px' }}>{selMeta.icon} Your Observation Metaphor</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: selMeta.color, marginBottom: '8px' }}>{selMeta.name}</div>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{selMeta.description}</p>
          <div style={{ background: 'white', borderRadius: '9px', padding: '10px 13px', marginBottom: '8px', border: `1px solid ${selMeta.color}20` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: selMeta.color, marginBottom: '4px' }}>HOW TO PRACTISE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65 }}>{selMeta.how_to}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '9px', padding: '9px 13px', border: `1px solid ${selMeta.color}20` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: selMeta.color, marginBottom: '3px' }}>💡 EXAMPLE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>{selMeta.example}</p>
          </div>
        </div>

        {/* Observation tip */}
        <div style={{ background: CPALE12, border: `1.5px solid ${CBORD12}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: COBALT, marginBottom: '4px' }}>🔍 Specific Observation Tip for Your Thought Type</div>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selType.observation_tip}</p>
          <div style={{ background: 'white', borderRadius: '8px', padding: '8px 11px', border: `1px solid ${CBORD12}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: COBALT, marginBottom: '3px' }}>⚠️ THE JUDGMENT TO WATCH FOR:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{selType.judge_pattern}</p>
          </div>
        </div>

        {/* Calming exercise */}
        <div style={{ background: `${exercise.color}10`, border: `1.5px solid ${exercise.color}30`, borderRadius: '12px', padding: '13px 15px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: exercise.color, marginBottom: '5px' }}>🧘 Calming Exercise for This Thought Type</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>{exercise.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: exercise.color }}>{exercise.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{exercise.time} · {exercise.why.split('.')[0]}.</div>
            </div>
          </div>
          <button onClick={() => setMode('exercise')} style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin {exercise.name}</button>
        </div>

        {/* Affirmation */}
        <div style={{ background: CPALE12, border: `1.5px dashed ${CBORD12}`, borderRadius: '12px', padding: '12px 17px', marginBottom: '14px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '600', color: COBALT, fontStyle: 'italic', lineHeight: 1.55 }}>
            "The thought arrived without your permission. Its arrival says nothing about you. Your relationship to it — observation rather than fusion — is where practice lives."
          </p>
        </div>

        <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${CBORD12}`, color: COBALT, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Try a different thought type</button>
      </div>
    );
  }

  // ── SELECT MODE ────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? COBALT : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What type of thoughts are most present right now?
          </p>
          {THOUGHT_TYPES.map(t => {
            const isSel = thoughtType === t.key;
            return (
              <button key={t.key} onClick={() => setThoughtType(t.key)} style={{
                padding: '12px 14px', borderRadius: '11px', border: '2px solid',
                borderColor: isSel ? t.color : 'var(--border)', background: isSel ? t.bg : 'white',
                cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                display: 'flex', alignItems: 'flex-start', gap: '11px',
                width: '100%', marginBottom: '7px',
                boxShadow: isSel ? `0 0 0 2px ${t.color}25` : 'none',
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? t.color : 'var(--ink)', marginBottom: '1px' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{t.desc}</div>
                </div>
              </button>
            );
          })}
          <button onClick={() => { if (thoughtType) setStep(2); }} disabled={!thoughtType} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: thoughtType ? `linear-gradient(135deg, ${COBALT}, #4580C8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: thoughtType ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: thoughtType ? `0 6px 18px ${CBORD12}` : 'none' }}>Next →</button>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — Choose your observation metaphor
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Different metaphors work better for different people. Choose the one that resonates most, or the one you have not tried before.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            {Object.values(OBSERVATION_METAPHORS).map(m => {
              const isSel = metaphor === m.id;
              const isRecommended = selType?.best_metaphor === m.id;
              return (
                <button key={m.id} onClick={() => setMetaphor(m.id)} style={{
                  padding: '13px 12px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSel ? m.color : 'var(--border)', background: isSel ? m.bg : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
                  boxShadow: isSel ? `0 0 0 2px ${m.color}25` : 'none',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{m.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: isSel ? m.color : 'var(--ink)', marginBottom: '2px' }}>{m.name.split(' —')[0]}</div>
                  {isRecommended && <div style={{ fontSize: '10px', fontWeight: '700', color: m.color, background: `${m.color}15`, padding: '1px 6px', borderRadius: '20px', display: 'inline-block' }}>Recommended ✓</div>}
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>{m.difficulty}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (metaphor) setMode('guide'); }} disabled={!metaphor} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: metaphor ? `linear-gradient(135deg, ${COBALT}, #4580C8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: metaphor ? 'pointer' : 'not-allowed', fontFamily: font }}>Open My Observation Guide →</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ObserveThoughtsMindfully({ navigate, relatedPosts }) {
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
      <p>The thought "I am going to fail this exam" feels fundamentally different from the thought "the sky is blue." The first feels true, feels urgent, feels like it is about you. The second is just a description. But from a cognitive standpoint, both are mental events — patterns of neural activation that arise and pass. The difference in how they feel is not because one is more real; it is because you are inside one of them.</p>

      <p>Learning to <strong>observe thoughts mindfully</strong> — to watch them rather than inhabit them — is not about becoming detached from your experience or pretending difficult thoughts do not exist. It is about building the metacognitive distance that allows you to see a thought clearly enough to respond to it deliberately rather than automatically. This guide shows you exactly how.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to observe thoughts mindfully without judgment — thought awareness, defusion techniques, and calming mindfulness exercises"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="fusion">1. Fusion vs Observation — What Changes When You Watch Your Thoughts</h3>

      <p><strong>Cognitive fusion — the default mode.</strong> Cognitive fusion is the term used in Acceptance and Commitment Therapy (Steven Hayes, University of Nevada) for the ordinary experience of being completely inside a thought — taking it to be reality, being controlled by it, identifying with it. In fusion, the thought "I am not smart enough" is not experienced as a thought about intelligence; it is experienced as a fact about intelligence. The thought "everything is going to go wrong" is not experienced as a prediction; it is experienced as foreknowledge. In fusion, there is no gap between the thought and the person having it. The thought is the person having it.</p>

      <p><strong>Cognitive defusion — what observation produces.</strong> Defusion is the complementary process — the creation of cognitive distance between the observer and the thought. In defusion, the thought "I am not smart enough" is experienced as: "I notice I am having the thought that I am not smart enough." It is still present. It still might be uncomfortable. But it has moved from being a fact about reality to being an event in awareness — something that is happening rather than something that is true. Research by Hayes and colleagues on ACT (Acceptance and Commitment Therapy) documents that defusion reduces the emotional impact and behavioural influence of difficult thoughts without requiring their content to change or their frequency to reduce.</p>

      <p><strong>The judgement layer — what makes thoughts worse than they need to be.</strong> Most difficult thoughts come accompanied by a second layer: the judgement about the thought. "I am not good enough" arrives, and immediately: "I should not be thinking this / this thought means something terrible / I am weak for having this thought." Research by Adrian Wells at the University of Manchester on metacognitive therapy identifies metacognitive beliefs — particularly beliefs about the significance and uncontrollability of thoughts — as the primary driver of clinical-level rumination and anxiety. The secondary judgment ("this thought is dangerous" or "having this thought means something bad about me") is more harmful than the primary thought in most cases. Non-judgmental observation removes the secondary layer while the primary thought is acknowledged.</p>

      <p><strong>What changes in daily life when observation replaces fusion.</strong> When thought observation becomes a developed capacity, three specific changes become visible in daily life:</p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li>The time between an upsetting thought arriving and the reactive behaviour it would automatically produce lengthens — creating the space in which a chosen response becomes possible</li>
        <li>Difficult thoughts are less disruptive to ongoing activities because they can be noted and returned from rather than requiring complete engagement</li>
        <li>The subjective "stickiness" of repetitive thoughts decreases — thoughts that previously could occupy the mind for hours become observable and passable rather than compulsive</li>
      </ul>

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Neuroscience of Thought Observation</h3>

      <p><strong>The default mode network and self-referential thinking.</strong> The default mode network (DMN) — including the medial prefrontal cortex, posterior cingulate cortex, and angular gyrus — is the primary neural system responsible for self-referential thought, future simulation, and the retrospective processing that constitutes most of what people call "thinking." In ordinary unmindful experience, the DMN runs continuously whenever the mind is not engaged in directed external tasks, generating the automatic chains of self-referential thought that cognitive fusion produces. Research by Brewer and colleagues at Yale and Brown documents that mindfulness practice specifically reduces posterior cingulate cortex (PCC) activity — a key DMN hub associated with the "stickiness" or craving quality of ruminative thought. This reduction is what makes thoughts passable rather than compulsive.</p>

      <p><strong>The anterior cingulate cortex — the awareness signal.</strong> The anterior cingulate cortex (ACC) is the brain region responsible for conflict monitoring and the metacognitive awareness of "I am thinking" rather than simply thinking. Research by Posner and Petersen identifies the ACC as central to attentional control — particularly the noticing of when attention has been captured by a thought or emotion. Mindfulness practice specifically strengthens ACC function through the repeated noticing-and-returning cycle: each time awareness notices that it has been captured by a thought and gently returns to the present moment, the ACC has been exercised. Over weeks of practice, this produces faster and more reliable noticing — the thought observation capacity develops from the increased ACC function that the practice builds.</p>

      <p><strong>The prefrontal cortex and the observing self.</strong> The observing position — the capacity to step back and watch thinking rather than being inside it — is associated with increased lateral prefrontal cortex activity, particularly the right ventrolateral prefrontal cortex (RVLPFC) that Lieberman's research documents as the neural correlate of affect labelling and cognitive distancing. When we name a thought or observe it from outside, the RVLPFC activates and directly inhibits amygdala activity — reducing the emotional intensity of the thought's content. This is the neurological explanation for why labelling a thought ("I notice I am having the thought that I am going to fail") immediately reduces its emotional impact: the labelling activates the observation network that modulates the threat response the thought was producing.</p>

      <p><strong>Thought-action fusion — and why it matters to interrupt.</strong> Research by Rachman and Shafran on thought-action fusion (TAF) documents a specific cognitive bias that makes non-judgmental observation particularly important: the implicit belief that having a thought increases the probability of the event occurring (likelihood TAF) or that having a thought is morally equivalent to acting on it (morality TAF). Both beliefs are false and both are very common among people who struggle with intrusive thoughts. The non-judgmental observation practice directly interrupts TAF by demonstrating, through repeated experience, that thoughts can be observed without consequence — their arrival is not prediction, and their content is not character.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="studio">3. Interactive: The Thought Observer Studio</h3>
      <p>The Studio generates a personalised observation guide for your specific thought type. Choose the type of thoughts most present for you right now, select an observation metaphor (or use the recommended one for your thought type), and access a complete guide including the thought's nature, how to observe it, your specific observation tip, the most common judgment to watch for, and a calming exercise with a guided timer.</p>

      <ThoughtObserverStudio />

      {/* ── Section 4 ── */}
      <h3 id="metaphors">4. Four Observation Metaphors That Actually Work</h3>

      <p>Metaphors are not decoration — they are cognitive tools that reorganise the relationship between the observer and the observed. The right metaphor makes the abstract ("observe your thoughts") practically achievable by giving the observing position a concrete imaginal location to occupy. Different metaphors work better for different people and different thought types.</p>

      {Object.values(OBSERVATION_METAPHORS).map(m => (
        <div key={m.id} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '16px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${m.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>{m.icon}</span>
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: m.color }}>{m.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Difficulty: {m.difficulty} · Best for: {m.best_for.map(k => THOUGHT_TYPES.find(t => t.key === k)?.label.split(' ')[0]).join(', ')} thoughts</div>
            </div>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500', fontStyle: 'italic' }}>{m.description}</p>
          <div style={{ background: m.bg, borderRadius: '10px', padding: '11px 13px', marginBottom: '8px', border: `1px solid ${m.color}20` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: m.color, textTransform: 'uppercase', marginBottom: '5px' }}>How to practise:</div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{m.how_to}</p>
          </div>
          <div style={{ background: CPALE12, borderRadius: '9px', padding: '9px 12px', border: `1px solid ${CBORD12}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: COBALT, marginBottom: '3px' }}>💡 EXAMPLE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{m.example}</p>
          </div>
        </div>
      ))}

      <p><strong>How to choose between metaphors.</strong> The sky/clouds metaphor works best for thoughts that feel overwhelming or all-encompassing — the spacious sky provides the most striking contrast with the contained thought. The river/bank metaphor works best for repetitive, flowing thoughts that keep passing through — the constant movement of the river matches the repetitive quality. The train station metaphor works best for urgent, action-demanding thoughts — the platform provides the specific practice of not boarding. The cinema metaphor works best for thoughts with vivid narrative content — the screen and audience seat provide the most explicit separation between the observer and the story.</p>

      {/* ── Section 5 ── */}
      <h3 id="exercises">5. Calming Exercises for Non-Judgmental Thought Observation</h3>

      <p><strong>Why calming exercises support thought observation.</strong> Thought observation is a prefrontal-cortex function — it requires the capacity to take the metacognitive perspective that the reasoning and awareness centres provide. When the amygdala is highly activated (by anxiety, anger, or distress), the prefrontal cortex is partially downregulated and the observation function is less available. The calming exercises serve as physiological preparation: reducing the amygdala activation enough that the observation function can re-engage. The sequence — calm the body first, then observe — is almost always more effective than attempting to observe while in high physiological activation.</p>

      <p><strong>Exercise 1: The Physiological Sigh — for urgent or panic-inducing thoughts.</strong> Three repetitions of the physiological sigh (double inhale through the nose, long exhale through the mouth) reduce cortisol measurably within 30 seconds, restoring enough prefrontal function for the observation position to become accessible. This exercise is the entry point when any thought type has produced high physiological activation. The observation attempt after three sighs works significantly better than the observation attempt before them.</p>

      <p><strong>Exercise 2: The Loving-Kindness Phrase — for self-critical thoughts.</strong> Self-critical thoughts specifically activate the threat system in the same way external threat does (Gilbert's research). The loving-kindness phrase — "May I be kind to myself right now" — activates the caregiving system, which directly counteracts the threat activation of self-criticism. The phrase is not asking the self-critical thought to stop; it is providing a different relational stance toward the self having the thought. After the phrase, the observation of the self-critical thought has a different quality: the thought is still there, but the person observing it is no longer attacking themselves for having it.</p>

      <p><strong>Exercise 3: Box Breathing — for ruminative and racing thoughts.</strong> Box breathing (four counts in, four hold, four out, four hold) produces the attentional grounding and autonomic balance that ruminative and racing thoughts disrupt. The even four-count rhythm provides an attentional anchor that competes with the ruminative chain's pull, while the breath hold phases produce the parasympathetic activation that reduces the urgency quality of racing thought content. After four cycles, the observation position is significantly more accessible than before.</p>

      <p><strong>Exercise 4: Mindful Breath Counting — for random and intrusive thoughts.</strong> Breath counting (counting exhales from one to ten, returning to one when the count is lost) combines respiratory calming with the specific attentional training that intrusive thought management requires. The count provides a concrete present-moment focus that gives intrusive thoughts less cognitive space to occupy. Crucially, the return to one when the count is lost — without self-criticism — is the direct practice of non-judgmental awareness: noticing the thought that disrupted the count, noting it without judgment, and returning. The practice is the exercise for the exact skill intrusive thoughts require.</p>

      <p><strong>Exercise 5: The Five-Sense Grounding — for dissociating or overwhelming thought patterns.</strong> When thought patterns are so dense or intense that the observation position is completely unavailable — the sky cannot be found because the mind is entirely in the cloud — five-sense grounding (naming five seen, four felt, three heard, two smelled, one tasted) pulls attention completely into present-moment sensory experience. This is not observation of thoughts; it is deliberate redirection away from thoughts into sensory reality. After 2-3 minutes of genuine sensory anchoring, enough physiological and attentional calm is typically restored for the observation techniques to then become available.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Observing Thoughts Mindfully FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I try to observe my thoughts but I keep getting pulled back into them. Does this mean I am failing?</strong><br />
        A: No — getting pulled into thoughts and losing the observation position is exactly what happens in this practice, at every level of experience. The practice is not maintaining the observation position continuously; it is returning to it when you notice you have lost it. Research by Hasenkamp and colleagues at the University of Virginia on attentional cycles in meditation shows that this noticing-and-returning cycle occurs even in very experienced practitioners — the difference is in the speed of noticing (experienced practitioners notice faster) and the quality of return (gentler, less self-critical, more immediate). The moments you get pulled in are not failures; they are the moments you return from — and the returning is the training. The student who gets pulled in thirty times in a five-minute session and returns thirty times has completed thirty successful practice repetitions.</p>

        <p><strong>Q: Some of my thoughts seem so true — they are not distortions, they are accurate observations. How do I observe them without dismissing them?</strong><br />
        A: This is an important distinction. Non-judgmental observation does not mean treating all thoughts as equally invalid or untrue. It means creating the distance to evaluate thoughts accurately rather than accepting them automatically. An accurate observation — "I am behind on my preparation" — benefits from observation just as much as a distortion does, because the observation prevents the automatic escalation: "I am behind on preparation" → "I am going to fail" → "my entire future is compromised." The observation stance notices the first thought, evaluates its accuracy, and then considers the appropriate response — rather than following the automatic chain. The goal is not to deny accurate thoughts but to choose which ones to engage with and how to respond, rather than being driven automatically by every thought that arrives, accurate or not.</p>

        <p><strong>Q: I have been told to "just not think negative thoughts" — is this the same thing?</strong><br />
        A: No — and the advice to "just not think negative thoughts" is counterproductive by the research. Daniel Wegner's white bear experiments at Harvard document that attempting not to think about something reliably increases the frequency of that thought. Thought suppression is the opposite of thought observation: it requires monitoring for the unwanted thought (to ensure it is being suppressed), which activates the thought repeatedly in the monitoring process. Non-judgmental observation is the evidence-based alternative: instead of trying to prevent thoughts from arriving, allow them to arrive and pass without resistance, without engagement, and without judgment. The approach that feels more passive — observation rather than suppression — is the approach that produces the most effective reduction in unwanted thought frequency and impact.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: COBALT, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "You are not the river. You are not the clouds. You are not the trains. You are the one who watches — and the watching is always available."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Studio above to find the metaphor and calming exercise that fits your current thought type. Try the observation practice today — not when thoughts are most intense, but when they are mild, to build the capacity that is then available in the difficult moments. The bank of the river is always there; the practice is learning to find it.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: COBALT, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${CBORD12}` }}
          >
            Practise in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: COBALT, border: `2px solid ${COBALT}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Experience
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-stop-overthinking',  '→ How to Stop Overthinking with Simple Mindfulness Techniques'],
            ['/blog/stay-present-stop-overthinking', '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/manage-emotions-mindfulness',    '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/blog/emotional-awareness-daily',      '→ How to Become More Emotionally Aware Every Day'],
            ['/blog/mindfulness-techniques-beginners','→ Mindfulness Techniques for Beginners (Student Guide)'],
            ['/blog/guided-meditation-students',     '→ Guided Meditation for Students: Beginner\'s Guide'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: COBALT, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
