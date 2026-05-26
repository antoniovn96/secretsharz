import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mindfulness Techniques for Beginners (Student Guide)",
  excerpt: "Starting mindfulness when you have never done it before feels more complicated than it needs to. This guide strips it down to what actually matters: simple exercises you can do in under five minutes, practical daily tips that fit into real student life, and a beginner-friendly starter kit that helps you find your first technique and build your first habit — today.",
  category: "Mental Health",
  date: "06-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mindfulness-techniques-beginners.jpg",
  tldr: "Mindfulness for beginners does not require a course, an app subscription, or 30 minutes of silence. It requires one technique, practised consistently, until it becomes automatic. This guide covers eight beginner techniques — each under 5 minutes — with step-by-step instructions in plain language, practical daily integration tips, common beginner mistakes to avoid, and an interactive Starter Kit that identifies your best first technique and builds your first week's practice plan.",
  toc: [
    { id: "before-start",  title: "1. Before You Start — Three Things Beginners Get Wrong",           level: 3 },
    { id: "techniques",    title: "2. Eight Beginner Mindfulness Techniques — Step by Step",          level: 3 },
    { id: "starter-kit",   title: "3. Interactive: The Beginner Mindfulness Starter Kit",             level: 3 },
    { id: "daily-tips",    title: "4. Practical Daily Tips for Student Life",                         level: 3 },
    { id: "first-week",    title: "5. Your First Week — Day by Day",                                  level: 3 },
    { id: "faq",           title: "6. Beginner Mindfulness FAQs",                                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-06T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mindfulness techniques for beginners, beginner mindfulness exercises, how to start mindfulness, mindfulness for students beginners, simple mindfulness techniques, daily mindfulness tips students, mindfulness starter guide",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the easiest mindfulness technique for beginners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The easiest mindfulness technique for absolute beginners is the three-breath pause: at any point in the day, take three slow, deliberate breaths — inhale fully, exhale slowly and completely. That is it. No posture, no timer, no special setting. Research shows this brief practice produces measurable parasympathetic activation and creates the micro-pause between stimulus and response that is the essence of mindfulness. Once this feels natural (usually 5-7 days of daily use), it can be extended to a five-minute breath awareness session.",
      },
    },
    {
      "@type": "Question",
      "name": "How long should beginners practise mindfulness each day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research by Lazar et al. at Harvard shows that even five minutes of daily mindfulness practice produces measurable neurological benefits over eight weeks — specifically increased grey matter density in attention and emotional regulation regions. For beginners, five minutes daily is the evidence-backed starting point. Consistency matters more than duration: five minutes every day produces significantly better results than 30 minutes twice a week. Begin with five minutes, maintain it for two weeks, then extend by five minutes only if it feels natural rather than effortful.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it normal for the mind to wander during mindfulness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — not only normal but expected and universal. Research by Killingsworth and Gilbert at Harvard found that the human mind is off-task approximately 47% of waking hours. Mind-wandering during mindfulness practice does not decrease significantly with experience; what changes is the speed of noticing the wandering and the gentleness of return. The noticing-and-returning is the practice itself — not a sign of failure. Beginners often mistake frequent mind-wandering as evidence they are doing mindfulness wrong, when it is simply evidence that mindfulness practice is necessary.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const AMBER2  = '#C07030';
const APALE2  = '#FBF4EE';
const ABORD2  = 'rgba(192,112,48,0.22)';

// ── Technique data ─────────────────────────────────────────────────────────────
const BEGINNER_TECHNIQUES = [
  {
    id:          'three_breath',
    number:      '01',
    icon:        '😮‍💨',
    name:        'The Three-Breath Pause',
    difficulty:  'Absolute Beginner',
    time:        '30 seconds',
    color:       '#1A7272',
    bg:          '#EBF5F5',
    tagline:     'The simplest possible mindfulness practice — works anywhere, any time',
    when_to_use: 'Before picking up your phone, before entering a classroom, before starting study, whenever you feel rushed or anxious',
    plain_description: 'You pause what you are doing. You take three slow breaths. You return. That is the complete practice.',
    why_it_works: 'Three slow breaths activates the vagus nerve and parasympathetic nervous system — the biological calm response. It creates a micro-pause between the automatic pilot of anxious daily life and the present moment. Even 30 seconds of this practice, done daily, builds the reflex of pausing before reacting.',
    steps: [
      'Stop what you are doing — even for just a moment',
      'Take one slow breath in through the nose — feel the chest or belly rise',
      'Exhale completely through the mouth — let the body soften slightly on the exhale',
      'Repeat two more times at the same slow pace',
      'Notice how you feel — then continue with what you were doing',
    ],
    beginner_tip: 'Attach this to one daily trigger: "Every time I sit down at my study desk, I take three breaths first." The trigger makes the practice automatic within a week.',
    common_mistake: 'Trying to breathe perfectly or slowly enough. The pace does not matter — the deliberateness does. Any pace, done consciously, counts.',
  },
  {
    id:          'one_minute_anchor',
    number:      '02',
    icon:        '⚓',
    name:        'The One-Minute Body Anchor',
    difficulty:  'Absolute Beginner',
    time:        '1 minute',
    color:       '#2D5A8A',
    bg:          '#EEF3FB',
    tagline:     'Use your body as an anchor to the present moment',
    when_to_use: 'When the mind is racing, between study sessions, during a study break, when feeling detached or scattered',
    plain_description: 'You put attention in your body rather than your thoughts — just for one minute. The body is always in the present; thoughts are not.',
    why_it_works: 'Interoception — the awareness of the body\'s internal sensations — is processed by the insula cortex, which is directly connected to the present-moment awareness networks. Directing attention to physical sensations activates a neural pathway that competes with the default mode network\'s future-past rumination. You cannot fully feel your feet on the floor and catastrophise about tomorrow simultaneously.',
    steps: [
      'Sit or stand comfortably — wherever you are',
      'Press both feet gently into the floor. Feel the pressure and temperature',
      'Notice the weight of your body in the chair or on your legs',
      'Feel your hands — the temperature, any tingling, the sensation of air',
      'Take one slow breath and notice the rise and fall of the chest or belly',
      'One minute is done. You were just fully here',
    ],
    beginner_tip: 'Do this standing in a queue, sitting in a lecture, or in any moment of waiting. The physical anchoring requires no visible behaviour — it is entirely internal.',
    common_mistake: 'Trying to relax the body. The practice is noticing, not changing. Whatever sensations are present — tension, comfort, cold — are the material. Notice them without needing to fix them.',
  },
  {
    id:          'single_sense',
    number:      '03',
    icon:        '👁️',
    name:        'The Single-Sense Focus',
    difficulty:  'Absolute Beginner',
    time:        '2 minutes',
    color:       '#5B3A8B',
    bg:          '#F2EEF9',
    tagline:     'Give your full attention to one sense for two minutes',
    when_to_use: 'During a meal or drink, when walking between classes, when feeling overwhelmed by multiple demands',
    plain_description: 'You choose one sense — sight, sound, taste, touch, or smell — and give your complete attention to what that sense is currently receiving. No multitasking. Just this one sensory channel, for two minutes.',
    why_it_works: 'The single-sense focus is a beginner-accessible version of focused attention meditation. It develops the attentional muscle — the capacity to deliberately select one object of attention and maintain focus on it — without the abstract difficulty of attending to breath or thoughts. Sensory experiences are concrete and immediate, making them easier entry points than abstract mental objects.',
    steps: [
      'Choose one sense: what can you currently see, hear, taste, feel, or smell?',
      'Bring your full attention to that sense alone — block out everything else for a moment',
      'If using sight: look at one object as if you have never seen anything like it before. Notice colour gradients, shadows, textures, edges',
      'If using sound: listen to one sound completely — its volume, pitch, rhythm, the way it begins and ends',
      'If using taste: take one sip or bite and attend entirely to taste, texture, temperature, the changing sensations as you chew or swallow',
      'When attention wanders, gently return to the same sense. Keep going for two minutes',
    ],
    beginner_tip: 'The easiest starting point is one cup of tea or coffee each morning, drunk with full attention to taste and warmth. No phone, no reading. Just the drink. This is a complete mindfulness session.',
    common_mistake: 'Switching between senses. The practice is single-sense — the focus and return to one sense is what builds the attentional capacity. Multi-sensing is ordinary experience; single-sense attention is training.',
  },
  {
    id:          'thought_noticing',
    number:      '04',
    icon:        '🌊',
    name:        'Thought Noticing (3 Minutes)',
    difficulty:  'Beginner',
    time:        '3 minutes',
    color:       '#8B2635',
    bg:          '#FBF0F1',
    tagline:     'Watch your thoughts without being inside them',
    when_to_use: 'When feeling mentally overwhelmed or anxious, before sleep, during a study break, when wanting to understand what the mind is doing',
    plain_description: 'You sit and watch your thoughts as they arrive — without engaging with them. Like watching clouds pass. The thought arrives, you notice it, you watch it leave. You are the observer, not the thought.',
    why_it_works: 'Thought noticing practises metacognition — thinking about thinking — which is the specific cognitive capacity that separates mindfulness from ordinary rumination. Research by Teasdale and colleagues on mindfulness-based cognitive therapy shows that the capacity to observe thoughts as mental events rather than facts (the mindful metacognitive stance) is the primary mechanism by which mindfulness prevents depression relapse and reduces anxiety.',
    steps: [
      'Sit comfortably with eyes closed or softly downcast',
      'Take three slow breaths to settle',
      'Allow thoughts to arise naturally — do not try to produce or prevent them',
      'As each thought arrives, simply note what type it is: "planning," "worrying," "remembering," "judging," "fantasising"',
      'Watch it, name it, and let it pass — do not follow it into the story',
      'When you realise you have been pulled into a thought\'s story, gently note "thinking" and return to watching',
      'Continue for three minutes',
    ],
    beginner_tip: 'The most useful image for beginners: you are sitting at the side of a busy road watching traffic. Each car is a thought. You notice each one — colour, speed, type — without stepping into the road and getting into any of them.',
    common_mistake: 'Trying to stop thoughts from arriving. The practice is observing thoughts, not suppressing them. Trying to stop thoughts is like trying to stop the traffic — and has the same success rate.',
  },
  {
    id:          'mindful_walk',
    number:      '05',
    icon:        '👣',
    name:        'The Mindful Walk',
    difficulty:  'Beginner',
    time:        '5–10 minutes',
    color:       '#2D6B45',
    bg:          '#E8F4EE',
    tagline:     'Turn every walk into a mindfulness practice — no extra time required',
    when_to_use: 'Walking to college, between classes, to the canteen, during a post-study break — any walk already happening',
    plain_description: 'Instead of using walk time for phone scrolling or planning, you use it for attending to the physical sensations of walking: the foot lifting, moving, and landing; the rhythm; the air and light. No new time is required — you were going to walk anyway.',
    why_it_works: 'Walking meditation is one of the oldest mindfulness practices and one of the most well-researched. It combines physical movement (which directly reduces cortisol) with present-moment sensory attention (which reduces rumination). Research on attention restoration theory by Kaplan and Kaplan shows that walking in natural or semi-natural environments specifically restores directed attention capacity — the resource most depleted by sustained study.',
    steps: [
      'Begin walking at your usual pace — or slightly slower if possible',
      'Bring attention to the physical sensations of walking: the foot lifting from the ground, moving through the air, landing',
      'Notice the rhythm — the alternation of left and right',
      'Notice what you can see and hear as you move through the environment',
      'When the mind wanders to planning or worrying (it will), gently note "thinking" and return to the sensation of the foot on the ground',
      'Phone in pocket (or bag) — not in hand. This walk is practice, not transit',
    ],
    beginner_tip: 'Start with just one walk per day — even 5 minutes. The commute to college is the most natural anchor. Instead of putting in earphones, try one commute per week of mindful walking. The contrast with usual commute experience is typically striking.',
    common_mistake: 'Walking mindfully only when in nature or a quiet space. The mindful walk works in any environment — the busy road, the crowded corridor, the noisy canteen walk. The contrast between the active environment and the internal quiet of the practice is part of what makes it useful.',
  },
  {
    id:          'five_four_three',
    number:      '06',
    icon:        '✋',
    name:        '5-4-3-2-1 Grounding',
    difficulty:  'Absolute Beginner',
    time:        '3 minutes',
    color:       AMBER2,
    bg:          APALE2,
    tagline:     'Instant presence — especially good for anxiety spikes',
    when_to_use: 'During acute anxiety, before exams, when feeling disconnected from the present, when overthinking has taken over',
    plain_description: 'You name specific things you can perceive through each sense — five seen, four felt, three heard, two smelled, one tasted. The sensory specificity anchors attention completely in the present room, in the present moment.',
    why_it_works: 'The 5-4-3-2-1 technique interrupts overthinking by redirecting attention from the abstract internal content of the spiral (which exists in an imagined past or future) to specific sensory input that is only available in the present moment. Research on sensory grounding in anxiety management shows it effectively reduces acute physiological arousal, and its structured format makes it accessible even when cognitive capacity is reduced by anxiety.',
    steps: [
      'Take one slow breath. Look around you',
      'Name FIVE things you can see — specific objects, not categories. "The corner of the blue notebook." "A crack in the wall." "My own hand." Speak them quietly',
      'Name FOUR things you can physically feel — temperature, pressure, texture. "The chair fabric on my back." "The floor under my feet." "The air on my wrist."',
      'Name THREE things you can hear — nearby, distant, very faint',
      'Name TWO things you can smell — even very faint. If you cannot smell two, notice that you are not smelling anything particular',
      'Name ONE thing you can taste — even the faint taste of the last thing you drank',
      'Take a slow breath. Notice: you are here, in this room, in this moment',
    ],
    beginner_tip: 'Before entering an exam hall, do this exercise standing outside. The sensory anchoring in the present environment — this specific room, this specific morning — directly counteracts the anticipatory anxiety that pulls attention to imagined failure scenarios.',
    common_mistake: 'Rushing through the numbers. The effectiveness depends on the specificity and the genuine attention to each sense. Naming "five objects" generally is less effective than really attending to each one. Go slowly.',
  },
  {
    id:          'loving_kindness',
    number:      '07',
    icon:        '💛',
    name:        'Loving-Kindness Phrases (Metta)',
    difficulty:  'Beginner',
    time:        '3–5 minutes',
    color:       '#C07800',
    bg:          '#FFF8E1',
    tagline:     'Build self-compassion and ease with a few repeating phrases',
    when_to_use: 'After a disappointing result, when being hard on yourself, when feeling isolated or unsupported, as an evening closing practice',
    plain_description: 'You silently repeat simple phrases of goodwill — first toward yourself, then toward others. The repetition is not magical; it is practice at deliberately cultivating an attitude of care rather than criticism toward your own experience.',
    why_it_works: 'Research by Barbara Fredrickson at UNC on loving-kindness meditation (Metta) shows that even brief loving-kindness practice significantly increases positive emotions, social connection, and self-compassion — and these changes produce measurable wellbeing improvements that persist beyond the practice session. Research by Neff and Vonk shows self-compassion (which loving-kindness directly builds) is more predictive of stable wellbeing than self-esteem and is associated with better academic resilience.',
    steps: [
      'Sit comfortably with eyes closed. Bring to mind an image of yourself — as if seeing yourself from outside',
      'Silently repeat: "May I be well. May I be at peace. May I be free from unnecessary suffering. May I be kind to myself today."',
      'Repeat these four phrases three times, slowly. Let the words land rather than rush through them',
      'Now bring to mind someone you care about. Repeat: "May you be well. May you be at peace. May you be free from unnecessary suffering. May you be happy."',
      'Finally, extend the phrases to "all students everywhere, going through what I am going through." You are not alone in this',
      'Take one breath. Open your eyes slowly',
    ],
    beginner_tip: 'The self-compassion phrase is the most important and typically the hardest. Many students find it easier to direct kindness to others than to themselves. This difficulty is itself useful information — and the practice of directing kindness inward is exactly what the wellbeing research shows is most needed.',
    common_mistake: 'Expecting to feel warmth or love during the practice. The loving-kindness phrases work through repetition rather than through immediate emotional experience — like exercise, the benefits come from the practice over time, not necessarily from each individual session.',
  },
  {
    id:          'mindful_study',
    number:      '08',
    icon:        '📚',
    name:        'Mindful Study Start Ritual',
    difficulty:  'Beginner',
    time:        '2 minutes',
    color:       '#3A4D8A',
    bg:          '#EEF1FB',
    tagline:     'Turn the beginning of each study session into a mindfulness practice',
    when_to_use: 'At the start of every study session — replaces the habitual phone-check or passive settling-in period',
    plain_description: 'Before opening a book or a laptop, you spend two minutes in a specific ritual: three breaths, one intention for the session, one acknowledgment of where you are. The ritual signals to the brain that the session is beginning and activates the focused attention state rather than the anxious scattered state that studying without transition typically starts from.',
    why_it_works: 'Research on implementation intentions and pre-task rituals shows that a consistent preparation sequence before a cognitive task activates the relevant neural networks before the task begins — improving both initial engagement quality and sustained performance. The mindfulness elements specifically address the anxiety and scatter that begin most study sessions without transition: the student who sits down already worried about the exam is immediately studying at reduced cognitive capacity.',
    steps: [
      'Before touching any study material: sit for 30 seconds with hands in lap',
      'Take three slow breaths — in through the nose, out through the mouth',
      'On the third exhale, soften the jaw and shoulders consciously',
      'Write one specific sentence in your study notebook: "This session, I am going to [specific task]." Not a list — one task',
      'Read it once. Say it quietly: "I am here. I am beginning now."',
      'Open your material and begin with the task you wrote. Nothing else is open yet',
    ],
    beginner_tip: 'The ritual works through consistency — the same sequence every session trains the brain to associate the sequence with focused study mode. After two to three weeks of consistent use, the ritual itself begins to produce the focused state rather than requiring effort to reach it.',
    common_mistake: 'Skipping the ritual when already feeling motivated. The ritual is most valuable when motivation is present because it is building the automatic association. Doing it only when struggling means it never becomes automatic.',
  },
];

// ── Starter Kit data ───────────────────────────────────────────────────────────
const SK_LIFESTYLE = [
  { key: 'busy',      icon: '⚡', label: 'Very busy — barely any free time' },
  { key: 'moderate',  icon: '⚖️', label: 'Moderate — some pockets of free time' },
  { key: 'flexible',  icon: '🌿', label: 'Relatively flexible schedule' },
];

const SK_BIGGEST_CHALLENGE = [
  { key: 'anxiety',    icon: '😰', label: 'Anxiety and exam stress' },
  { key: 'focus',      icon: '🎯', label: 'Cannot focus during study' },
  { key: 'overthink',  icon: '🌀', label: 'Overthinking and racing thoughts' },
  { key: 'emotional',  icon: '💔', label: 'Emotional ups and downs' },
  { key: 'sleep',      icon: '😴', label: 'Cannot sleep or wind down' },
];

const SK_PREV_ATTEMPT = [
  { key: 'never',      label: 'I have never tried mindfulness before' },
  { key: 'tried_quit', label: 'I tried but gave up after a few days' },
  { key: 'occasional', label: 'I do it occasionally but not consistently' },
];

const STARTER_RECOMMENDATIONS = {
  anxiety: {
    primary:     'three_breath',
    secondary:   'five_four_three',
    reason:      'Anxiety is most immediately addressed by physiological techniques — breath and sensory grounding directly activate the parasympathetic response that anxiety suppresses. Start with the Three-Breath Pause attached to your most anxious daily trigger (before studying, before exams). Add 5-4-3-2-1 grounding for acute anxiety spikes.',
    week_plan: [
      { day: 'Days 1-3', task: 'Three-Breath Pause — every time you sit at your study desk. No exceptions, no timer needed.' },
      { day: 'Days 4-5', task: 'Add: One-Minute Body Anchor after each study session. Feet on floor, full breath.' },
      { day: 'Days 6-7', task: 'Add: 5-4-3-2-1 grounding — practise it once when NOT anxious, so it is available when you are.' },
    ],
  },
  focus: {
    primary:     'mindful_study',
    secondary:   'single_sense',
    reason:      'Focus issues respond best to practices that train the attentional network directly. The Mindful Study Start Ritual builds the pre-session transition that sets attentional tone. The Single-Sense Focus trains the capacity to sustain attention on one object — the same capacity that focused study requires.',
    week_plan: [
      { day: 'Days 1-3', task: 'Mindful Study Start Ritual — every single study session. Two minutes before opening any material.' },
      { day: 'Days 4-5', task: 'Add: Single-Sense Focus — one cup of tea or coffee per day with complete attention to taste.' },
      { day: 'Days 6-7', task: 'Add: Three-Breath Pause at any moment focus drops during study. Use as a mid-session reset.' },
    ],
  },
  overthink: {
    primary:     'thought_noticing',
    secondary:   'three_breath',
    reason:      'Overthinking responds to the metacognitive stance — the capacity to observe thoughts rather than being inside them. Thought Noticing trains this directly. The Three-Breath Pause provides the immediate interruption tool for active spirals. Build the observation capacity first; the interruption skill naturally follows.',
    week_plan: [
      { day: 'Days 1-3', task: 'Thought Noticing — 3 minutes every evening before bed. Just watch, name, and let pass.' },
      { day: 'Days 4-5', task: 'Add: Three-Breath Pause — every time you notice an overthinking thought beginning.' },
      { day: 'Days 6-7', task: 'Add: Keep a "parking lot" notebook beside study materials. Intrusive thoughts go there, not in your head.' },
    ],
  },
  emotional: {
    primary:     'loving_kindness',
    secondary:   'one_minute_anchor',
    reason:      'Emotional balance is most directly built through the self-compassion and body-awareness practices. Loving-Kindness builds the compassionate relationship with your own experience that emotional regulation requires. The Body Anchor reconnects attention to the present physical experience when emotions pull toward abstraction.',
    week_plan: [
      { day: 'Days 1-3', task: 'Loving-Kindness Phrases — 3 minutes every evening. Start with "May I be well" — even if it feels strange.' },
      { day: 'Days 4-5', task: 'Add: One-Minute Body Anchor — when emotions feel high, attention goes to the feet and the breath.' },
      { day: 'Days 6-7', task: 'Add: After any difficult moment, write one sentence: "What I needed right now was ___." Name your need specifically.' },
    ],
  },
  sleep: {
    primary:     'thought_noticing',
    secondary:   'one_minute_anchor',
    reason:      'Sleep issues are primarily driven by pre-sleep cognitive arousal — the brain remaining in active problem-solving mode when the body is trying to rest. Thought Noticing specifically addresses this by training the capacity to observe without engaging. The Body Anchor provides the transition from thinking to sensing that sleep onset requires.',
    week_plan: [
      { day: 'Days 1-3', task: 'Thought Noticing — 5 minutes lying in bed, lights off, before sleep. Watch, name, let pass.' },
      { day: 'Days 4-5', task: 'Add: Worry Download — 3 minutes of writing before getting into bed. Every unresolved thought on paper.' },
      { day: 'Days 6-7', task: 'Add: Body Anchor lying down — from head to feet, slowly, after the worry download. Let the body be the final focus.' },
    ],
  },
};

const LIFESTYLE_ADJUSTMENTS = {
  busy: 'For your schedule: attach every practice to an existing daily behaviour rather than finding new time. The Three-Breath Pause before opening your phone each morning, the Mindful Walk one day per week instead of listening to something, one mindful tea or coffee. Zero extra time, genuine daily practice.',
  moderate: 'With pockets of time available: use commutes and waiting periods as practice opportunities. One 5-minute session in the morning before phone use, grounding exercises during breaks. Build from two practices per week to daily within two weeks.',
  flexible: 'With a flexible schedule: protect one consistent daily practice slot rather than practising opportunistically. A consistent time anchors the habit better than multiple flexible sessions. Morning is typically most effective for habit formation and sets the day\'s attentional tone.',
};

const PREV_ATTEMPT_ADVICE = {
  never:      'Starting from zero: choose one technique only — not two, not three. One technique, daily, for 14 days. The temptation to try multiple things simultaneously is how practices fail before they begin. After 14 days of one technique, it will feel familiar enough to add a second.',
  tried_quit: 'If you have tried and stopped before: the stopping was almost certainly a design problem rather than a motivation problem. The practice was either too long, too rigid, or not attached to an existing trigger. This time: start with the Three-Breath Pause (30 seconds) attached to one specific daily trigger. Make it impossible to fail.',
  occasional: 'If you practise occasionally: the next step is daily consistency, not longer sessions or more techniques. Identify the specific trigger that will make your chosen practice daily rather than situational. Write it: "I will practise mindfulness [specific technique] immediately after [specific existing daily behaviour]."',
};

// ── Starter Kit Component ──────────────────────────────────────────────────────
function BeginnerStarterKit() {
  const [step,       setStep]       = useState(1);
  const [lifestyle,  setLifestyle]  = useState(null);
  const [challenge,  setChallenge]  = useState(null);
  const [prevAtt,    setPrevAtt]    = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [openDay,    setOpenDay]    = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selRec  = challenge ? STARTER_RECOMMENDATIONS[challenge] : null;
  const primTech = selRec ? BEGINNER_TECHNIQUES.find(t => t.id === selRec.primary)    : null;
  const secTech  = selRec ? BEGINNER_TECHNIQUES.find(t => t.id === selRec.secondary)  : null;
  const lifAdj  = lifestyle ? LIFESTYLE_ADJUSTMENTS[lifestyle] : null;
  const prevAdv  = prevAtt ? PREV_ATTEMPT_ADVICE[prevAtt] : null;

  const handleReset = () => { setStep(1); setLifestyle(null); setChallenge(null); setPrevAtt(null); setRevealed(false); setOpenDay(null); };

  const ChoiceBtn = ({ options, selected, onSelect }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      {options.map(opt => {
        const isSel = selected === opt.key;
        return (
          <button key={opt.key} onClick={() => onSelect(opt.key)} style={{
            padding: '13px 16px', borderRadius: '12px', border: '2px solid',
            borderColor: isSel ? AMBER2 : 'var(--border)', background: isSel ? APALE2 : 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '11px',
            boxShadow: isSel ? `0 0 0 2px ${ABORD2}` : 'none',
          }}>
            {opt.icon && <span style={{ fontSize: '20px', flexShrink: 0 }}>{opt.icon}</span>}
            <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? AMBER2 : 'var(--ink)' }}>{opt.label}</span>
            {isSel && <span style={{ marginLeft: 'auto', color: AMBER2, fontWeight: '700' }}>✓</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? AMBER2 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What is your life like right now?
          </p>
          <ChoiceBtn options={SK_LIFESTYLE} selected={lifestyle} onSelect={setLifestyle} />
          <button onClick={() => { if (lifestyle) setStep(2); }} disabled={!lifestyle} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: lifestyle ? `linear-gradient(135deg, ${AMBER2}, #D4904A)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: lifestyle ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: lifestyle ? `0 6px 18px ${ABORD2}` : 'none',
          }}>Next →</button>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What is your biggest daily challenge right now?
          </p>
          <ChoiceBtn options={SK_BIGGEST_CHALLENGE} selected={challenge} onSelect={setChallenge} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (challenge) setStep(3); }} disabled={!challenge} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: challenge ? `linear-gradient(135deg, ${AMBER2}, #D4904A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: challenge ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Have you tried mindfulness before?
          </p>
          <ChoiceBtn options={SK_PREV_ATTEMPT} selected={prevAtt} onSelect={setPrevAtt} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (prevAtt) { setStep(4); setRevealed(false); } }} disabled={!prevAtt} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: prevAtt ? `linear-gradient(135deg, ${AMBER2}, #D4904A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: prevAtt ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Starter Kit →</button>
          </div>
        </>
      )}

      {step === 4 && selRec && primTech && secTech && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Beginner Mindfulness Starter Kit</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${AMBER2}, #D4904A)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${ABORD2}`,
              }}>🌱 Reveal My Starter Kit</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${AMBER2}, #D4904A)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🌱</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Personal Starter Kit</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>Built for your schedule and your biggest challenge</div>
              </div>

              {/* Primary technique */}
              <div style={{ background: primTech.bg, border: `2px solid ${primTech.color}30`, borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: primTech.color, marginBottom: '6px' }}>⭐ Your Primary Technique</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{primTech.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: primTech.color }}>{primTech.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{primTech.time} · {primTech.difficulty}</div>
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{primTech.plain_description}</p>
                <div style={{ background: 'white', borderRadius: '8px', padding: '9px 12px', border: `1px solid ${primTech.color}25` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: primTech.color, marginBottom: '3px' }}>💡 BEGINNER TIP:</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{primTech.beginner_tip}</p>
                </div>
              </div>

              {/* Secondary technique */}
              <div style={{ background: 'white', border: `1.5px solid ${secTech.color}30`, borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: secTech.color, marginBottom: '5px' }}>📌 Add in Week 2</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{secTech.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: secTech.color }}>{secTech.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{secTech.time} · {secTech.tagline}</div>
                  </div>
                </div>
              </div>

              {/* Why these */}
              <div style={{ background: APALE2, border: `1.5px solid ${ABORD2}`, borderRadius: '12px', padding: '12px 15px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: AMBER2, marginBottom: '4px' }}>🎯 Why These for You</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selRec.reason}</p>
              </div>

              {/* Week plan */}
              <div style={{ background: 'white', border: `1.5px solid ${ABORD2}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ padding: '11px 15px', background: `${AMBER2}12`, borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: '700', color: AMBER2 }}>
                  📅 Your First Week Plan
                </div>
                {selRec.week_plan.map((w, i) => {
                  const isOpen = openDay === i;
                  return (
                    <div key={i} style={{ borderBottom: i < selRec.week_plan.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <button onClick={() => setOpenDay(isOpen ? null : i)} style={{
                        width: '100%', padding: '12px 15px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: AMBER2 }}>{w.day}</div>
                        <span style={{ color: AMBER2, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 15px 12px 15px' }}>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{w.task}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lifestyle + previous attempt notes */}
              {lifAdj && (
                <div style={{ background: APALE2, border: `1.5px solid ${ABORD2}`, borderRadius: '11px', padding: '12px 14px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: AMBER2, marginBottom: '4px' }}>⚡ For Your Schedule</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{lifAdj}</p>
                </div>
              )}
              {prevAdv && (
                <div style={{ background: 'white', border: `1.5px solid ${ABORD2}`, borderRadius: '11px', padding: '12px 14px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: AMBER2, marginBottom: '4px' }}>🔑 Given Your History</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{prevAdv}</p>
                </div>
              )}

              {/* Affirmation */}
              <div style={{ background: APALE2, border: `1.5px dashed ${ABORD2}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: AMBER2, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "One technique. Every day. Fourteen days. After that, you will know for yourself."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${ABORD2}`, color: AMBER2, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different starter kit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulnessTechniquesBeginners({ navigate, relatedPosts }) {
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
      <p>Most guides to <strong>mindfulness techniques for beginners</strong> make beginning sound harder than it is — full of ancient terminology, long practice requirements, and the implication that you need a specific kind of quietness and patience that busy, anxious students simply do not have. This guide is different.</p>

      <p>Everything here is designed for real student life: techniques under five minutes, language that is direct and plain, and a genuine understanding that the person reading this probably has three assignments due, an exam in two weeks, and a notifications badge that has not been cleared since February. You do not need to become a different kind of person to practise mindfulness. You just need to know where to start.</p>

      <img
        src={meta.imgUrl}
        alt="Beginner mindfulness techniques for students — simple exercises under 5 minutes with step-by-step instructions and daily tips"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="before-start">1. Before You Start — Three Things Beginners Get Wrong</h3>

      <p><strong>Mistake 1: Trying to empty the mind.</strong> The most persistent misconception about mindfulness is that the goal is a blank, thought-free mind — and that every thought during practice is a failure. This is not what mindfulness is. The goal is not to stop thoughts from arriving but to change the relationship with them — to observe them rather than being automatically inside them. A session with fifty wandering thoughts that are each noticed and returned from is a successful session. A session where you are surprised that thoughts keep coming is a beginner's accurate experience of how minds work, not evidence of doing it wrong.</p>

      <p><strong>Mistake 2: Starting too ambitiously and abandoning when it is not sustainable.</strong> Research by Phillippa Lally on habit formation shows that the size of the initial practice is less important for long-term consistency than the consistency of the initial practice. A student who commits to five minutes daily and maintains it for six weeks will have a more developed practice than a student who aims for thirty minutes, sustains it for five days, and abandons it. The beginner's temptation is to start with the most impressive version; the effective approach is to start with the smallest version that is genuinely achievable every day without exception.</p>

      <p><strong>Mistake 3: Evaluating the practice by how it feels in the moment.</strong> Mindfulness benefits are largely not experienced during the practice session — they accumulate in the life around it: shorter anxiety spirals, faster sleep onset, better attention recovery during study, more space between a frustrating event and a reactive response. Evaluating a five-minute morning practice by whether the five minutes felt calm is like evaluating a gym session by whether your muscles felt stronger during the exercise. The effects show up later, in different contexts, after consistent practice. Beginners who stop because "nothing happened" in the session are stopping at exactly the wrong moment.</p>

      {/* ── Section 2 ── */}
      <h3 id="techniques">2. Eight Beginner Mindfulness Techniques — Step by Step</h3>

      {BEGINNER_TECHNIQUES.map(t => (
        <div key={t.id} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '18px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${t.color}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: '700', color: `${t.color}40`, flexShrink: 0, lineHeight: 1 }}>{t.number}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                <span style={{ fontSize: '20px' }}>{t.icon}</span>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: t.color }}>{t.name}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', background: t.bg, color: t.color, padding: '2px 8px', borderRadius: '20px' }}>{t.difficulty}</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '600' }}>{t.time}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>{t.tagline}</div>
            </div>
          </div>

          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--ink)', fontWeight: '600', lineHeight: 1.65 }}>
            In plain language: {t.plain_description}
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{t.why_it_works}</p>

          <div style={{ background: t.bg, borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: t.color, marginBottom: '7px' }}>Step by step:</div>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              {t.steps.map((s, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '4px' }}>{s}</li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: 'white', border: `1px solid ${t.color}25`, borderRadius: '8px', padding: '9px 11px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: t.color, marginBottom: '3px' }}>💡 Beginner tip</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{t.beginner_tip}</p>
            </div>
            <div style={{ background: '#FFF8E1', border: '1px solid rgba(192,120,0,0.2)', borderRadius: '8px', padding: '9px 11px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#C07800', marginBottom: '3px' }}>⚠️ Common mistake</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{t.common_mistake}</p>
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)' }}>
            📍 Best used: {t.when_to_use}
          </div>
        </div>
      ))}

      {/* ── Section 3: Interactive ── */}
      <h3 id="starter-kit">3. Interactive: The Beginner Mindfulness Starter Kit</h3>
      <p>The Starter Kit takes three answers — your schedule, your biggest challenge, and your history with mindfulness — and generates a personalised recommendation: your primary technique, a secondary one to add in Week 2, why these techniques fit your situation, a day-by-day first-week plan, and specific guidance based on your lifestyle and history. Use it to find your first technique today.</p>

      <BeginnerStarterKit />

      {/* ── Section 4 ── */}
      <h3 id="daily-tips">4. Practical Daily Tips for Student Life</h3>

      <p><strong>Tip 1: Use transitions, not new time slots.</strong> The most common reason students do not build a mindfulness practice is the belief that it requires finding new time in an already full schedule. It does not. Every transition — waking up, getting dressed, walking to class, eating, the moment between finishing one assignment and starting another — is an existing pocket of time that is currently being used either unconsciously or for phone scrolling. One of these transitions, used for a brief mindfulness practice, requires zero new time and produces genuine daily practice.</p>

      <p><strong>Tip 2: Make one daily activity mindful instead of automatic.</strong> Choose one routine daily activity — tea or coffee in the morning, the shower, brushing teeth, the commute — and make it a deliberate, single-sense attention practice for one week. Attend fully to what you can taste, feel, hear, or see during that activity. No phone, no planning, no multitasking. This "single mindful activity" approach is how mindfulness becomes integrated into student life without requiring additional sessions — the practice is the activity itself, done with full attention.</p>

      <p><strong>Tip 3: The phone-down pause.</strong> Every time you reach for your phone out of habit rather than intention — between tasks, during a break, out of boredom or anxiety — pause for three breaths before acting. The pause itself is a mindfulness practice: it creates the gap between impulse and action that mindfulness specifically trains. After three breaths, either use the phone intentionally (with a specific purpose) or put it back down. Over time, the phone-down pause reduces habitual phone use and builds the capacity for deliberate attention simultaneously.</p>

      <p><strong>Tip 4: End each study session with a 60-second close.</strong> Instead of transitioning immediately from study to phone or entertainment, spend 60 seconds closing the session: what did you actually cover today? Write one sentence. Then close everything deliberately and take three breaths before moving on. The closing practice simultaneously consolidates the day's learning through brief active recall and creates the psychological transition between study mode and rest mode that allows genuine rest to follow.</p>

      <p><strong>Tip 5: Use waiting as practice time.</strong> Queues, loading screens, transportation waits, the two minutes before a lecture begins — all of these are typically filled with phone use. One of these daily waiting periods, used for the One-Minute Body Anchor or Three-Breath Pause, turns dead time into practice time without requiring any additional time commitment. The habit of using waiting for mindfulness rather than scrolling builds across weeks into a significant daily practice — often amounting to ten or more genuine minutes of mindfulness on ordinary days.</p>

      <p><strong>Tip 6: Keep a micro-journal for one week.</strong> For the first week of practice, write one sentence each evening: "Today's practice was ___. The experience was ___." The journalling serves two functions: it makes the practice visible and specific (rather than a vague intention that may or may not have happened) and it provides the two-week data set that allows an honest assessment of whether the practice is producing any of the expected benefits. Most students who journal for two weeks discover benefits they would not have noticed without the comparison point.</p>

      {/* ── Section 5 ── */}
      <h3 id="first-week">5. Your First Week — Day by Day</h3>

      <p>Use this as a fallback if the Starter Kit above feels like too much to begin with. This is the most minimal possible first week — designed to produce daily consistency above all else.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        {[
          { day: 'Day 1 — Monday',   task: 'The Three-Breath Pause before your first study session. Set your study materials out. Sit. Three breaths. Begin. That is it. Nothing else is required today.',                                                                    reflection: 'Notice: was it hard to remember? What made it easy or difficult?' },
          { day: 'Day 2 — Tuesday',  task: 'Three-Breath Pause before study again. Add: one mindful drink (tea, coffee, water) — no phone, full attention to taste and temperature for the duration of the drink.',                                                      reflection: 'Notice: did your attention drift during the mindful drink? How many times? Was it easy to return?' },
          { day: 'Day 3 — Wednesday',task: 'Three-Breath Pause before study. Mindful drink. Add: 5-4-3-2-1 grounding — practise it once in any quiet moment, not during anxiety. Just as practice.',                                                                     reflection: 'Notice: how did the 5-4-3-2-1 feel? Slightly strange? Slightly helpful?' },
          { day: 'Day 4 — Thursday', task: 'All three of the above. Add: on your way somewhere today, try five minutes of mindful walking — no phone, attention on the sensation of each step.',                                                                           reflection: 'Notice: how different did the walk feel from usual?' },
          { day: 'Day 5 — Friday',   task: 'Three-Breath Pause before study, mindful drink, mindful walk. Add: Thought Noticing for three minutes in the evening — sit, watch, name, return.',                                                                           reflection: 'Notice: what types of thought appeared most frequently? Planning? Worrying? Replaying?' },
          { day: 'Day 6 — Saturday', task: 'Choose your two favourite practices from the week. Do both, at their natural times. Add: review your week. Write: what did I notice? What felt useful?',                                                                      reflection: 'Notice: which practice felt most natural? Which produced the most noticeable effect?' },
          { day: 'Day 7 — Sunday',   task: 'One practice of your choice, done slowly and without a timer. Write: "I will practise [chosen technique] at [specific daily trigger] every day next week." Sign it like a contract with yourself.',                           reflection: 'Decision: which one technique will you commit to daily for the coming two weeks? Write it.' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', border: `1.5px solid var(--border)`, borderLeft: `4px solid ${AMBER2}` }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: AMBER2, marginBottom: '6px' }}>{item.day}</div>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7 }}>{item.task}</p>
            <div style={{ background: APALE2, borderRadius: '7px', padding: '8px 10px', border: `1px solid ${ABORD2}` }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: AMBER2 }}>Tonight: </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{item.reflection}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Beginner Mindfulness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I feel nothing when I try mindfulness — no calm, no relaxation, nothing. Is something wrong?</strong><br />
        A: Nothing is wrong. Mindfulness is not a feeling — it is a practice. The calm and relaxation that many people associate with mindfulness are sometimes present, sometimes not, and are not actually the goal. The goal is the deliberate direction of attention to the present moment. Sometimes this feels calming; sometimes it feels ordinary; sometimes it reveals how busy and anxious the mind is. All three are accurate observations and all three are valid experiences of mindfulness practice. The benefits accumulate in your daily life across weeks — not in the five minutes of the session. Keep going for two weeks before assessing.</p>

        <p><strong>Q: Can I practise mindfulness while listening to music?</strong><br />
        A: It depends on the type of mindfulness. For breath awareness and thought noticing, music competes with the internal focus — particularly lyrical music, which engages the language processing system that is also used for inner speech during practice. For body awareness and walking mindfulness, instrumental music at low volume can coexist with practice without significant interference. If you find silence very uncomfortable and it is preventing practice entirely, starting with soft instrumental music and gradually reducing it as the practice becomes more familiar is a reasonable transition approach.</p>

        <p><strong>Q: How is mindfulness different from just relaxing?</strong><br />
        A: Relaxation is a passive physiological state — a reduction in arousal. Mindfulness is an active cognitive practice — the deliberate direction of attention to present-moment experience. Relaxation happens to the body; mindfulness is something the mind does. They often co-occur (mindfulness frequently produces relaxation as a byproduct) but they are distinct: you can be mindfully anxious, mindfully tired, or mindfully alert. The confusion matters practically because expecting relaxation from mindfulness leads to disappointment when the session is agitated rather than calm — whereas the agitation itself, observed mindfully, is a completely valid and valuable practice experience.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: AMBER2, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The best mindfulness technique for a beginner is the one they will actually do. Start there. Everything else follows."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          You have eight techniques here, a personal starter kit, a first-week plan, and daily tips. The only thing you need to do right now is choose one — the smallest, most achievable one — and do it today. Not when you have more time. Not when exams are over. Today. Three breaths before you pick up your phone. That is a complete beginning.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: AMBER2, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${ABORD2}` }}
          >
            Begin Your Practice in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: AMBER2, border: `2px solid ${AMBER2}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your First Technique
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-for-students',       '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/daily-mindfulness-practice',     '→ How to Practice Mindfulness Daily for Better Mental Health'],
            ['/blog/benefits-of-mindfulness',        '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/blog/breathing-exercises-stress',     '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/stay-present-stop-overthinking', '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/quick-stress-relief-students',   '→ 5-Minute Stress Relief Techniques for Students'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: AMBER2, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
