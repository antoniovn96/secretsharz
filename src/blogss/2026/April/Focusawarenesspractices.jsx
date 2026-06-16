import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Improve Focus Through Awareness Practices",
  excerpt: "Focus is not the absence of distracting thoughts — it is the practised ability to notice when attention has wandered and return it quickly and calmly to the intended task. This returning is trainable. Awareness practices build the metacognitive muscle that catches the drift before it becomes a twenty-minute detour, the physiological regulation that reduces the anxiety-driven distraction, and the attention stability that makes deep work not just possible but natural.",
  category: "Mental Health",
  date: "28-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/focus-awareness-practices.jpg",
  tldr: "Improving focus naturally requires three parallel skills: the awareness to notice when attention has wandered (metacognitive noticing), the regulation to reduce the anxiety and physiological noise that keep attention from landing (breath-based parasympathetic activation), and the environment to allow sustained engagement (structural digital management). Six awareness exercises and four productivity methods are covered, with an interactive Practice Builder that generates a personalised daily focus plan.",
  toc: [
    { id: "science",     title: "1. The Science of Focus — What Awareness Changes",                   level: 3 },
    { id: "why-aware",   title: "2. Why Awareness Practices Improve Focus",                           level: 3 },
    { id: "builder",     title: "3. Interactive: The Focus Awareness Practice Builder",               level: 3 },
    { id: "exercises",   title: "4. Six Awareness Exercises for Deep Focus",                          level: 3 },
    { id: "productivity",title: "5. Productivity Methods That Work With Awareness",                   level: 3 },
    { id: "examples",    title: "6. Practical Examples — Focus Before and After Awareness Practice", level: 3 },
    { id: "faq",         title: "7. Improve Focus Naturally FAQs",                                   level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-28T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "improve focus naturally, awareness exercises focus, focus awareness practices, how to improve concentration naturally, mindfulness focus productivity, awareness practices study focus, focus building techniques students",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I improve focus naturally without medication?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Improving focus naturally works through four approaches that address the most common structural causes of poor focus. First, daily awareness practice (5-10 minutes of breath awareness meditation) builds the metacognitive noticing that catches attention drift early. Research by Mrazek shows two weeks of daily practice significantly reduces mind-wandering. Second, physiological regulation (morning physiological sighs, box breathing before study sessions) reduces the cortisol and anxiety that are the primary focus disruptors for most students. Third, structural environment changes (phone in another room, notifications off, single-surface study space) remove the external triggers that produce habitual attention fragmentation. Fourth, the single-task commitment (25-45 minutes of one task only) trains the sustained attention capacity that media consumption patterns have trained in the opposite direction.",
      },
    },
    {
      "@type": "Question",
      "name": "What awareness exercises improve focus?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Six awareness exercises most directly build the focus capacity: breath awareness practice (5-10 minutes daily — training the noticing-and-returning cycle that focus requires); the noting technique (labelling distraction types during formal practice — transfers to study sessions); single-object focus (giving complete attention to one specific object for 90 seconds — the simplest available attention training exercise); the body scan (releasing physical tension that maintains the cognitive arousal disrupting focus); open awareness restoration (5 minutes of undirected awareness after study blocks — restores directed attention capacity); and the pre-task intention ritual (3 minutes before any study session — brain dump, three breaths, one written task — sets attentional direction before the session begins).",
      },
    },
    {
      "@type": "Question",
      "name": "How long does it take to improve focus with awareness practices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research documents improvements at different timescales. Immediate (within session): the pre-task ritual and physiological sigh improve session quality from the first use. Short-term (1-2 weeks): daily breath awareness practice produces measurably reduced mind-wandering during subsequent tasks (Mrazek et al., UCSB). Medium-term (4-6 weeks): improved attention stability — the ability to maintain focus for longer uninterrupted periods before drift. Long-term (8+ weeks): structural brain changes in the anterior cingulate cortex (the awareness signal) and the prefrontal networks supporting attentional control (Hölzel et al., Harvard). The most reliable predictor of outcome is daily consistency rather than session duration — 5 minutes every day produces better neurological returns than 30 minutes twice a week.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const FOCUS  = '#3858A8';
const FPALE  = '#EBF0FA';
const FBORD  = 'rgba(56,88,168,0.22)';

// ── Focus Challenges ───────────────────────────────────────────────────────────
const FOCUS_CHALLENGES = [
  {
    key:    'mind_wander',
    icon:   '🌫️',
    label:  'Mind keeps wandering during study',
    desc:   'Start reading but find I\'ve been thinking about something else entirely',
    color:  FOCUS,
    bg:     FPALE,
    what:   'Mind-wandering is the default mode network activating when directed attention weakens — the brain fills attentional space with self-referential content automatically. Research by Killingsworth and Gilbert at Harvard documents 47% of waking hours involve mind-wandering. For study, this means significant time physically studying but cognitively absent.',
    primary_exercise: 'noting',
    primary_method:   'pomodoro_mindful',
    strategies: [
      'The noting technique practised daily for 2 weeks transfers the labelling reflex to study sessions',
      'Parking lot notebook eliminates the need to hold off-task thoughts — releases them without losing them',
      'Pre-study brain dump clears the queue before opening materials',
      'End-of-session recall challenge raises attentional stakes mid-session',
    ],
    example: 'Ishaan started each study session by writing "I notice I am studying [subject]" at the top of the page. This small act of naming the present moment was his cue for genuine engagement rather than physical presence. When he drifted, writing the last word heard or read was his return mechanism.',
  },
  {
    key:    'digital',
    icon:   '📱',
    label:  'Phone and digital distractions',
    desc:   'Keep reaching for the phone — notifications, habitual checking, social pull',
    color:  '#8B2635',
    bg:     '#FBF0F1',
    what:   'Digital distraction is a conditioned response pattern — the intermittent variable reward of notifications and social feeds produces the same neural reinforcement as slot machines. The checking reflex runs automatically, often before the decision to check has been consciously made. Research by Ward shows the mere presence of a phone on the desk reduces cognitive capacity regardless of whether it is used.',
    primary_exercise: 'single_object',
    primary_method:   'deep_work_block',
    strategies: [
      'Phone in another room — the only structural solution to anticipatory cognitive load',
      'Three-breath pause before every phone pickup converts automatic checking to deliberate access',
      'Designated check-in windows (3 × 15 minutes daily) replace continuous availability',
      'Single-task block with physical phone separation eliminates switching costs',
    ],
    example: '"I counted how many times I checked my phone during a 90-minute study session: 23 times. I moved the phone to the kitchen. Next session, same duration: I checked it 0 times because it wasn\'t there. The content of the session was completely different." — Rohan',
  },
  {
    key:    'anxiety_block',
    icon:   '😰',
    label:  'Anxiety preventing focus',
    desc:   'Too worried about results, pressure, or the future to engage with current material',
    color:  '#2D5A8A',
    bg:     '#EEF3FB',
    what:   'Academic anxiety is the most prevalent focus disruptor in student populations. It works through two mechanisms: cortisol impairment of prefrontal function (the anxiety reduces the very system needed for sustained focus), and working memory occupation by threat simulations (the worry about future performance consumes the cognitive resource needed for present learning). Research by Beilock shows this specifically: anxiety does not just feel bad, it measurably reduces working memory capacity.',
    primary_exercise: 'breath_anchor',
    primary_method:   'pre_task_ritual',
    strategies: [
      'Pre-study physiological sigh sequence reduces cortisol before the session begins',
      'Worry download externalises the anxious content from working memory to paper',
      'The "next 25 minutes only" reframe reduces the scope from overwhelming to manageable',
      'Body scan before long study sessions releases the physical tension that maintains anxiety',
    ],
    example: 'Ananya would open her textbook and immediately feel the weight of everything she still needed to learn. She started the 3-minute pre-study ritual: write every anxiety in the notebook, close it, three sighs, write the specific task for this session. "The 3 minutes are an investment that changes the quality of the next 45."',
  },
  {
    key:    'overload',
    icon:   '🧠',
    label:  'Cognitive overload — too much at once',
    desc:   'So many subjects and tasks that I cannot settle into any one thing',
    color:  '#C07800',
    bg:     '#FFF8E1',
    what:   'Cognitive overload produces a specific focus disruption: the mind cannot commit resources fully to one task because it is simultaneously holding multiple active task threads. Research by Sweller on cognitive load theory identifies working memory capacity as the key limiting factor — when the mental task list exceeds roughly seven items, items compete for cognitive space and all of them are processed less effectively than any single one would be.',
    primary_exercise: 'single_task_formal',
    primary_method:   'time_blocking',
    strategies: [
      'Weekly review (30 min): empty everything into written form, clarify next actions — prevents accumulation',
      'Brain dump before every session: get everything out, circle ONE task',
      'Context separation: one subject per session with physical materials closed for others',
      'The two-minute rule: if it takes less than two minutes, do it now — removes the holding cost',
    ],
    example: 'Vikram would open five tabs — Physics, Chemistry, English, Maths, and the school website — and bounce between them achieving nothing in any. He started the "one tab" rule: only the current subject open. The session quality immediately improved.',
  },
  {
    key:    'starting',
    icon:   '⏸️',
    label:  'Difficulty starting — procrastination',
    desc:   'Know what to do but cannot begin — putting off, delaying, distracting',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    what:   'Procrastination is not laziness — it is emotion regulation. Research by Fuschia Sirois at Sheffield Hallam identifies procrastination as the prioritisation of immediate mood improvement over long-term goal progress. The avoided task has an emotional component — anxiety, boredom, self-doubt, fear of failure — that is being avoided, not the task itself. Awareness practices address procrastination by making the emotional content visible and manageable rather than automatically avoided.',
    primary_exercise: 'body_scan_focus',
    primary_method:   'two_minute_rule',
    strategies: [
      'Name the emotion that is making starting difficult: "I am avoiding this because I feel ___"',
      'Reduce the task to its smallest possible first step — "open the notebook" not "do the essay"',
      'The pre-task ritual: brain dump + sighs + single task written creates the beginning-momentum',
      'Commit to two minutes only — the ending-resistance (fear of the whole task) is what procrastination avoids',
    ],
    example: '"My therapist told me I procrastinate because starting the assignment feels like proving whether I\'m smart enough. Awareness practice helped me notice that thought arriving. Once I could name it — "I notice I\'m afraid of finding out I can\'t do this" — I could respond to it instead of just acting it out by scrolling for two hours." — Meera',
  },
];

const PRODUCTIVITY_METHODS = [
  { key: 'pomodoro_mindful', icon: '⏱️', name: 'Mindful Pomodoro', label: 'Work in focused 25-min blocks with genuine breaks' },
  { key: 'deep_work_block',  icon: '🎯', name: 'Deep Work Block',  label: 'Extended 90-min single-task blocks for complex subjects' },
  { key: 'pre_task_ritual',  icon: '🌅', name: 'Pre-Task Ritual',  label: 'A structured 3-min start that sets focus before any session' },
  { key: 'time_blocking',    icon: '📅', name: 'Time Blocking',    label: 'Calendar-based planning to reduce daily decision load' },
  { key: 'two_minute_rule',  icon: '⚡', name: 'Two-Minute Starter',label: 'Begin any task with a 2-minute commitment to reduce starting resistance' },
];

const DAILY_TIME = [
  { key: '5min',  icon: '⚡', label: '5 minutes', desc: 'Minimum viable — daily sigh + pre-task ritual only' },
  { key: '10min', icon: '🌿', label: '10-15 minutes', desc: 'Evidence-backed effective daily investment' },
  { key: '20min', icon: '🌳', label: '20+ minutes', desc: 'Deep practice for significant focus improvement' },
];

const METHOD_DETAILS = {
  pomodoro_mindful: {
    name: 'Mindful Pomodoro',
    steps: [
      'Brain dump 90 seconds + three sighs + write one task before opening materials',
      'Work session: 25 minutes of one task only — phone absent, one tab, parking lot open',
      'When distraction arrives: write it in the parking lot (one phrase), return immediately',
      'Timer sounds: close materials deliberately. Write one sentence about what was accomplished.',
      '5-minute genuine break: open awareness or brief walk — NOT the phone',
      'Repeat 3-4 cycles, then a 20-30 minute longer break',
    ],
    why: 'The standard Pomodoro fails when the break is spent on the phone — research shows phone use maintains cognitive arousal rather than restoring it. The mindful Pomodoro addresses this by requiring genuine attentional restoration during breaks.',
    time: '25+5 min cycles',
  },
  deep_work_block: {
    name: 'Deep Work Block',
    steps: [
      'Designate one 90-minute block per day as the deep work block — same time, same location',
      'The week before: identify the specific subject or project that most needs depth',
      'Block set-up: phone in another room, one material open, notifications disabled on computer',
      'Full brain dump + 5-minute breath awareness before beginning',
      'Work for 90 minutes on one subject — no switching, no checking',
      'End with 10 minutes of open awareness restoration, then the end-of-session recall',
    ],
    why: 'Research by Cal Newport on deep work documents that cognitively demanding subjects require sustained uninterrupted blocks to produce genuine understanding — the shallow fragmented study most students do does not produce this depth regardless of total time.',
    time: '90-120 min block',
  },
  pre_task_ritual: {
    name: 'Pre-Task Ritual',
    steps: [
      'Before every study session, test, or important task: stop all current activity',
      '90-second brain dump: write every thought in the head uncensored',
      'Three physiological sighs: double inhale, long exhale, three times',
      'Write one sentence: "This session is for ___." Read it. Say it quietly.',
      'Open the material to the exact right section',
      'Begin from this cleared, intentional position — not from the scattered default',
    ],
    why: 'Research by Gollwitzer on implementation intentions documents that specific pre-task rituals significantly improve performance by activating relevant cognitive schemas before the task begins and by eliminating the 10-15 minute scattered warm-up period that most sessions begin with.',
    time: '3 min before each session',
  },
  time_blocking: {
    name: 'Time Blocking',
    steps: [
      'Once weekly (Sunday evening works best): open the calendar for the coming week',
      'Block study time first — specific subjects at specific times, 60-90 minute blocks',
      'Assign subjects to blocks based on energy: hardest subject when energy is highest',
      'Include transition time and genuine restoration blocks — not filler',
      'During blocks: that subject only, phone absent',
      'At week\'s end: review — what worked? What disrupted? Adjust next week\'s blocks.',
    ],
    why: 'Time blocking eliminates the daily micro-decisions about when to study what, reducing the decision fatigue that competes with focus. Each session begins from a pre-decided structure rather than requiring fresh negotiation with motivation.',
    time: '30 min weekly + daily execution',
  },
  two_minute_rule: {
    name: 'Two-Minute Starter',
    steps: [
      'When facing a task that is being avoided: reduce it to its smallest possible first step',
      'Commit to only two minutes: "I will work on this for exactly two minutes, then decide whether to continue"',
      'Pre-task ritual: one sigh, write "Two minutes of [task]", open the material',
      'Work for two minutes without stopping — the commitment is only to begin, not to complete',
      'After two minutes: almost always, continue — the resistance was to starting, not to doing',
      'If not continuing: what specifically made starting difficult? Write it. That is the data.',
    ],
    why: 'Zeigarnik effect: unfinished tasks create cognitive tension that drives completion. The two-minute starter creates the first engagement with the task, which activates the completion drive. Research by Sirois on procrastination shows starting resistance, not execution resistance, as the primary barrier.',
    time: '2 min to start — then as long as needed',
  },
};

const AWARENESS_EXERCISES = {
  noting: {
    id: 'noting', icon: '📌', name: 'The Noting Practice', color: FOCUS, bg: FPALE, time: '5 min', secs: 300,
    desc: 'Label each off-task thought by type without engaging its content.',
    science: 'The noting technique activates the prefrontal labelling network (Lieberman, UCLA) which modulates the DMN\'s automatic thought generation. After 2-3 weeks of daily practice, the noting reflex transfers to study sessions — thoughts arrive, are labelled, and pass without becoming extended detours.',
    steps: ['Sit upright. Close your eyes. Three breaths to settle.', 'Allow thoughts to arise naturally. Do not try to clear the mind.', 'When any thought appears: label it with one word — "planning," "worrying," "judging," "remembering"', 'After labelling, return attention to the breath without engaging the thought\'s content', 'Every labelling-and-return is one successful repetition'],
    phases: [
      { name: 'Settle',  secs: 30, note: 'Close your eyes. Three slow breaths. Let the body arrive here. Nothing to do.' },
      { name: 'Observe', secs: 210, note: 'Allow thoughts to arise. Each time one appears: label it with one word ("planning" / "worrying" / "comparing" / "remembering"). Then return to the breath. No judgment for drifting — only return.' },
      { name: 'Close',   secs: 60, note: 'Notice: the thoughts are still there, but they feel smaller. The labelling takes their urgency away. Open your eyes gently.' },
    ], cycles: 1,
    tip: 'After two weeks of daily noting practice, study sessions produce a different experience: thoughts arrive, are labelled, and pass rather than arriving and expanding into twenty-minute detours.',
  },
  breath_anchor: {
    id: 'breath_anchor', icon: '⚓', name: 'Breath Anchor', color: '#2D5A8A', bg: '#EEF3FB', time: '5 min', secs: 300,
    desc: 'Follow each breath with precise attention to build the sustained focus muscle.',
    science: 'Research by Mrazek at UCSB shows two weeks of daily breath awareness significantly reduces mind-wandering during subsequent tasks and improves working memory through the reduction of ruminative content that was occupying it.',
    steps: ['Sit upright — alert but not tense. Close your eyes.', 'Bring attention to the physical sensation of breathing at the nostrils', 'Follow one complete breath from its very start to its very end', 'When attention drifts: note "thinking" and return to the breath', 'Every return is a successful repetition — frequency of drifting is irrelevant'],
    phases: [
      { name: 'Arrive',  secs: 30, note: 'Sit upright. Close eyes. Feel the body settle. Natural breathing for 30 seconds — no control needed yet.' },
      { name: 'Follow',  secs: 210, note: 'Attend to the nostrils — the slight coolness of the inhale, the warmth of the exhale. Follow each complete breath. When thinking arises: "thinking." Return. Each return trains the returning.' },
      { name: 'Expand',  secs: 60, note: 'Broaden awareness to the whole body breathing. Feel the full rhythm. Gently open your eyes.' },
    ], cycles: 1,
    tip: 'The specific instruction to follow each breath "from its very start to its very end" trains the sustained focus capacity — the return from distraction is the direct exercise of the focus muscle.',
  },
  single_object: {
    id: 'single_object', icon: '👁️', name: 'Single-Object Focus', color: '#8B2635', bg: '#FBF0F1', time: '90 sec', secs: 90,
    desc: 'Give one object your complete attention for 90 seconds — the simplest focus training exercise.',
    science: 'Single-object focus trains the sustained attentional engagement that study requires. The 90-second duration specifically corresponds to the window within which the DMN\'s automatic generation can be displaced by directed present-moment sensory attention.',
    steps: ['Choose one object near you — a pen, a plant, a cup', 'Give it complete visual attention for 90 seconds as if you have never seen anything like it', 'Notice its colours (every gradient), its texture, its shadows, its edges, any imperfections', 'When attention drifts to other thoughts: return to the object', 'The specificity of what you notice is the measure of genuine attentional engagement'],
    phases: [
      { name: 'Choose',  secs: 10, note: 'Select one specific object in front of you. Bring it into the centre of your visual field.' },
      { name: 'Attend',  secs: 70, note: 'Give it your complete visual attention: every colour gradient, the texture, the shadows, the edges, any wear or imperfection. When thinking pulls: return to the object.' },
      { name: 'Recall',  secs: 10, note: 'Close your eyes for 10 seconds. Can you reconstruct the object\'s specific details? The recall tests the genuineness of the attention.' },
    ], cycles: 1,
    tip: 'The single-object focus is the most immediately accessible focus exercise — it requires nothing except whatever is already in front of you and can be practised anywhere, anytime.',
  },
  body_scan_focus: {
    id: 'body_scan_focus', icon: '🧘', name: 'Focus-Ready Body Scan', color: '#C07800', bg: '#FFF8E1', time: '5 min', secs: 300,
    desc: 'Release the physical tension that maintains cognitive arousal and blocks deep focus.',
    science: 'Unnoticed physical tension — jaw clenching, shoulder raising, shallow breathing — maintains sympathetic activation that directly competes with the focused parasympathetic state. Releasing it through body scan restores the physiological conditions in which sustained focus becomes natural.',
    steps: ['Sit in your study position. Close your eyes.', 'Scan from head to feet: forehead, jaw, neck, shoulders, chest, belly, hands', 'At each area with tension: breathe toward it on the inhale, invite release on the exhale', 'Specific attention to the jaw (clenching), shoulders (raised), and hands (gripped)', 'Open your eyes. You are physically ready to focus.'],
    phases: [
      { name: 'Head & jaw',    secs: 60, note: 'Forehead — tense? Jaw — teeth touching? Neck — held? Breathe toward each area. On the exhale, invite softening. Not forcing — inviting.' },
      { name: 'Shoulders & chest', secs: 75, note: 'Shoulders — raised or forward? Chest — breathing shallow? Give these areas full attention. Breathe into the chest. Let the shoulders settle.' },
      { name: 'Belly & hands', secs: 75, note: 'Belly — held tight? Hands — gripped? Open the hands deliberately. Let the belly soften. These hold the procrastination tension.' },
      { name: 'Whole body',    secs: 90, note: 'Feel the whole body in the study position. Three slow breaths. Notice: the body is more ready to focus than when you began. Open your eyes.' },
    ], cycles: 1,
    tip: 'Students who do this scan before study sessions consistently report that the first 10 minutes of the session feel qualitatively different — the physical readiness is a focus precondition.',
  },
  open_awareness: {
    id: 'open_awareness', icon: '🌿', name: 'Open Awareness Restoration', color: '#2D6B45', bg: '#E8F4EE', time: '5 min', secs: 300,
    desc: 'Restore the directed attention capacity that focused work depletes — the specific antidote to study fatigue.',
    science: 'Kaplan\'s attention restoration theory identifies open, undirected awareness as the specific antidote to directed attention fatigue. The soft fascination of undemanded awareness restores the attentional resources that sustained focus consumes — this is why nature walks improve cognition.',
    steps: ['After any study block: close all materials and devices', 'Sit or stand comfortably. Close or soften your eyes.', 'Expand awareness to everything: sounds near and far, body sensations, temperature, light', 'Nothing to focus on — just receive whatever is present', 'After 5 minutes: return to study from a fresher baseline'],
    phases: [
      { name: 'Expand',  secs: 90, note: 'Let awareness widen to everything present. Sounds near, sounds far. Body weight. Temperature of air. Light quality. Nothing to find.' },
      { name: 'Receive', secs: 150, note: 'Stay in open receiving. Near sounds, far sounds. Sensations in the body. The quality of this moment. When thinking arrives: note it and open again.' },
      { name: 'Return',  secs: 60, note: 'Two slow breaths. Feel the gentle return of directed attention. Open your eyes. The next study block begins from here — fresher than before.' },
    ], cycles: 1,
    tip: 'Open awareness is NOT the same as passive phone scrolling. Scrolling maintains cognitive arousal; open awareness specifically reduces it. The break must be genuinely device-free to produce restoration.',
  },
  single_task_formal: {
    id: 'single_task_formal', icon: '🎯', name: 'Single-Task Focus Session', color: '#5B3A8B', bg: '#F2EEF9', time: '25 min', secs: 1500,
    desc: 'A complete mindfulness-enhanced Pomodoro — single task, full attention, genuine break.',
    science: 'Research by Meyer and Kieras on task switching shows multitasking costs up to 40% of productive time through switching costs. Single-task practice eliminates these costs while simultaneously training the sustained attention that awareness practices build.',
    steps: ['Brain dump 90 seconds + three sighs + write one task on paper', 'Phone in another room. One tab open. Parking lot notebook beside materials.', '25-minute timer set. One task only — nothing else opens, nothing else checks.', 'Every distraction: write it in the parking lot in one phrase. Return immediately.', 'Timer sounds: stop deliberately. Write what was accomplished. Take a genuine 5-minute break.'],
    phases: [
      { name: 'Ritual',   secs: 180, note: 'Brain dump (90 sec). Three physiological sighs. Write your task: "This 25 minutes is for ___." Open only the relevant material. Begin.' },
      { name: 'Session',  secs: 1200, note: 'Work on your one task. When distraction arrives: one phrase in the parking lot, return immediately. You are training the returning, not preventing drifting.' },
      { name: 'Close',    secs: 120, note: 'Session complete. Close materials. Three breaths. Write: "I accomplished ___." This deliberate close is as important as the session. Then your genuine break.' },
    ], cycles: 1,
    tip: 'The parking lot notebook transforms the Pomodoro: instead of fighting distractions, you have a place for them. The resistance to writing distractions down reveals how habitual the checking was — most distractions are habitual, not urgent.',
  },
};

// ── Practice Timer ─────────────────────────────────────────────────────────────
function FocusTimer({ exercise, onClose }) {
  const [phase,  setPhase]  = useState('intro');
  const [phIdx,  setPhIdx]  = useState(0);
  const [tLeft,  setTLeft]  = useState(0);
  const [run,    setRun]    = useState(false);
  const [done,   setDone]   = useState(false);
  const intRef = useRef(null);
  const phases = exercise.phases;
  const curPh  = phases[phIdx];
  const font   = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!run) return;
    intRef.current = setInterval(() => {
      setTLeft(p => {
        if (p <= 1) {
          clearInterval(intRef.current); setRun(false);
          const next = phIdx + 1;
          if (next >= phases.length) { setDone(true); return 0; }
          setPhIdx(next); setTLeft(phases[next].secs); setRun(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [run, phIdx, phases]);

  const CIRC = 2 * Math.PI * 42;
  const mins = Math.floor(tLeft / 60);
  const secs = tLeft % 60;

  return (
    <div style={{ background: `${exercise.color}07`, borderRadius: '14px', border: `2px solid ${exercise.color}28`, overflow: 'hidden', fontFamily: font }}>
      <div style={{ padding: '12px 16px', background: `${exercise.color}15`, borderBottom: `1px solid ${exercise.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: exercise.color }}>{exercise.icon} {exercise.name}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>
      <div style={{ padding: '18px' }}>
        {phase === 'intro' && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{exercise.desc}</p>
            <div style={{ background: exercise.bg, borderRadius: '9px', padding: '9px 12px', marginBottom: '10px', border: `1px solid ${exercise.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: exercise.color, textTransform: 'uppercase', marginBottom: '4px' }}>🔬 Science:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{exercise.science}</p>
            </div>
            <div style={{ marginBottom: '14px' }}>
              {exercise.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: i < exercise.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: exercise.color, color: 'white', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setPhase('active'); setPhIdx(0); setTLeft(phases[0].secs); setRun(true); }} style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin {exercise.time}</button>
          </>
        )}
        {phase === 'active' && !done && curPh && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 12px auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="42" fill="none" stroke={`${exercise.color}18`} strokeWidth="6" />
                <circle cx="55" cy="55" r="42" fill="none" stroke={exercise.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (tLeft / curPh.secs)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: mins > 0 ? '18px' : '24px', fontWeight: '700', color: exercise.color }}>
                  {mins > 0 ? `${mins}:${secs.toString().padStart(2,'0')}` : secs}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: exercise.color, marginBottom: '4px' }}>{curPh.name}</div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '8px' }}>
              {phases.map((_, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i < phIdx ? exercise.color : i === phIdx ? `${exercise.color}60` : 'var(--border)' }} />)}
            </div>
            <div style={{ background: exercise.bg, borderRadius: '9px', padding: '10px 12px', marginBottom: '12px', textAlign: 'left', minHeight: '65px', border: `1px solid ${exercise.color}20` }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{curPh.note}</p>
            </div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {run ? <button onClick={() => { clearInterval(intRef.current); setRun(false); }} style={{ padding: '9px 20px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸</button>
                   : <button onClick={() => setRun(true)} style={{ padding: '9px 20px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶</button>}
              <button onClick={() => { clearInterval(intRef.current); setPhIdx(0); setTLeft(phases[0].secs); setRun(true); setDone(false); }} style={{ padding: '9px 14px', borderRadius: '50px', border: `1.5px solid ${exercise.color}40`, background: 'transparent', color: exercise.color, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺</button>
            </div>
          </div>
        )}
        {done && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: exercise.color, marginBottom: '8px' }}>Complete</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{exercise.tip}</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setPhase('active'); setPhIdx(0); setTLeft(phases[0].secs); setRun(true); setDone(false); }} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Focus Awareness Builder ───────────────────────────────────────────────────
function FocusAwarenessPracticeBuilder() {
  const [step,      setStep]      = useState(1);
  const [challenge, setChallenge] = useState(null);
  const [method,    setMethod]    = useState(null);
  const [timeKey,   setTimeKey]   = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openS,     setOpenS]     = useState(null);
  const [activeEx,  setActiveEx]  = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selChal = FOCUS_CHALLENGES.find(c => c.key === challenge);
  const selMeth = PRODUCTIVITY_METHODS.find(m => m.key === method);
  const selTime = DAILY_TIME.find(t => t.key === timeKey);
  const methodDetail = method ? METHOD_DETAILS[method] : null;
  const primaryEx = selChal ? AWARENESS_EXERCISES[selChal.primary_exercise] : null;

  const handleReset = () => { setStep(1); setChallenge(null); setMethod(null); setTimeKey(null); setRevealed(false); setOpenS(null); setActiveEx(null); };

  const Btn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{ padding: '12px 14px', borderRadius: '11px', border: '2px solid', borderColor: isSel ? FOCUS : 'var(--border)', background: isSel ? FPALE : 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%', marginBottom: '7px', boxShadow: isSel ? `0 0 0 2px ${FBORD}` : 'none' }}>
      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? FOCUS : 'var(--ink)', marginBottom: opt.desc ? '1px' : 0 }}>{opt.label}</div>
        {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
      </div>
      {isSel && <span style={{ marginLeft: 'auto', color: FOCUS, fontWeight: '700', flexShrink: 0 }}>✓</span>}
    </button>
    );
  };

  if (activeEx) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <FocusTimer exercise={AWARENESS_EXERCISES[activeEx]} onClose={() => setActiveEx(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? FOCUS : 'var(--border)', transition: 'background 0.3s' }} />)}
      </div>

      {step === 1 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — What is your main focus challenge?</p>
        {FOCUS_CHALLENGES.map(c => <Btn key={c.key} opt={c} selected={challenge} onSelect={setChallenge} />)}
        <button onClick={() => { if (challenge) setStep(2); }} disabled={!challenge} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: challenge ? `linear-gradient(135deg, ${FOCUS}, #5878C8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: challenge ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: challenge ? `0 6px 18px ${FBORD}` : 'none' }}>Next →</button>
      </>)}

      {step === 2 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — Which productivity method appeals to you?</p>
        {PRODUCTIVITY_METHODS.map(m => <Btn key={m.key} opt={{ ...m, label: m.name, desc: m.label }} selected={method} onSelect={setMethod} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (method) setStep(3); }} disabled={!method} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: method ? `linear-gradient(135deg, ${FOCUS}, #5878C8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: method ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
        </div>
      </>)}

      {step === 3 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — How much daily awareness practice time can you commit?</p>
        {DAILY_TIME.map(t => <Btn key={t.key} opt={t} selected={timeKey} onSelect={setTimeKey} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (timeKey) { setStep(4); setRevealed(false); } }} disabled={!timeKey} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: timeKey ? `linear-gradient(135deg, ${FOCUS}, #5878C8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: timeKey ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Focus Plan →</button>
        </div>
      </>)}

      {step === 4 && selChal && methodDetail && primaryEx && (<>
        <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Focus Awareness Plan</p>
        {!revealed ? (
          <>
            <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${FOCUS}, #5878C8)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${FBORD}` }}>🎯 Build My Focus Plan</button>
            <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
          </>
        ) : (
          <div style={{ animation: 'floatUp 0.4s ease' }}>
            <div style={{ background: `linear-gradient(135deg, ${selChal.color}, ${selChal.color}BB)`, borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selChal.icon} {selMeth?.icon}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>Your Focus Plan</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selChal.label} · {selMeth?.name} · {selTime?.label}/day</div>
            </div>

            <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>🧠 Why This Is Your Challenge</div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{selChal.what}</p>
              <div style={{ background: selChal.bg, borderRadius: '8px', padding: '8px 10px', border: `1px solid ${selChal.color}20` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: selChal.color, marginBottom: '3px' }}>👤 PRACTICAL EXAMPLE:</div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.6 }}>{selChal.example}</p>
              </div>
            </div>

            <div style={{ background: FPALE, border: `1.5px solid ${FBORD}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: FOCUS, marginBottom: '5px', letterSpacing: '1.2px' }}>🛠️ FOUR STRATEGIES FOR YOUR PATTERN</div>
              {selChal.strategies.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < selChal.strategies.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: FOCUS, fontWeight: '700', flexShrink: 0 }}>→</span>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>

            <div style={{ background: primaryEx.bg, border: `2px solid ${primaryEx.color}30`, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: primaryEx.color, marginBottom: '6px', letterSpacing: '1.2px' }}>🧘 AWARENESS EXERCISE FOR YOUR PATTERN</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
                <span style={{ fontSize: '20px' }}>{primaryEx.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: primaryEx.color }}>{primaryEx.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{primaryEx.time} · Daily</div>
                </div>
              </div>
              <button onClick={() => setActiveEx(primaryEx.id)} style={{ width: '100%', padding: '11px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${primaryEx.color}, ${primaryEx.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin Practice Now</button>
            </div>

            <div style={{ background: 'white', border: `1.5px solid ${selMeth?.color || FOCUS}25`, borderRadius: '12px', padding: '13px 15px', marginBottom: '10px', borderLeft: `3px solid ${FOCUS}` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: FOCUS, marginBottom: '5px' }}>📋 PRODUCTIVITY METHOD: {methodDetail.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{methodDetail.time} · {methodDetail.why.split('.')[0]}.</div>
              {methodDetail.steps.map((s, i) => {
                const isOpen = openS === i;
                return (
                  <div key={i} style={{ borderBottom: i < methodDetail.steps.length - 1 ? '1px solid var(--border)' : 'none', padding: '6px 0' }}>
                    <button onClick={() => setOpenS(isOpen ? null : i)} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: font, textAlign: 'left', padding: '2px 0' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${FOCUS}15`, color: FOCUS, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ background: FPALE, border: `1.5px dashed ${FBORD}`, borderRadius: '12px', padding: '12px 17px', marginBottom: '14px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '600', color: FOCUS, fontStyle: 'italic', lineHeight: 1.55 }}>
                "Focus is not what you force. It is what you build — one returning, one session, one day at a time."
              </p>
            </div>

            <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${FBORD}`, color: FOCUS, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build plan for different challenge</button>
          </div>
        )}
      </>)}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FocusAwarenessPractices({ navigate, relatedPosts }) {
  const [activeTimer, setActiveTimer] = useState(null);
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

      {/* ── Introduction ── */}
      <p>Poor focus is not a character flaw. It is not the result of insufficient willpower or not caring enough. It is the predictable consequence of a cognitive system that was never designed for sustained digital stimulation, operating in an environment specifically engineered to fragment attention, without the specific training that sustained focus requires. The good news is that the training is accessible, evidence-backed, and produces measurable results within two weeks.</p>

      <p>Awareness practices <strong>improve focus naturally</strong> by building the specific neural capacity that focus requires — not the capacity to prevent attention from wandering (this is not trainable and not the goal) but the metacognitive awareness that notices when attention has wandered and the attentional stability to return it quickly and without drama. This guide covers the science, the exercises, and the productivity methods that make it work in practice.</p>

      <img
        src={meta.imgUrl}
        alt="Student improving focus naturally through awareness practices — attention exercises, productivity methods, and practical focus-building techniques"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="science">1. The Science of Focus — What Awareness Changes</h3>

      <p><strong>The attentional control network and the default mode network.</strong> Focus is a function of the competition between two brain systems: the task-positive network (TPN), which includes the dorsolateral prefrontal cortex and the parietal attention regions, and the default mode network (DMN), which includes the medial prefrontal cortex, the posterior cingulate cortex, and the angular gyrus. The TPN activates during directed, goal-oriented tasks; the DMN activates during rest, self-referential thought, and mind-wandering. Research by Raichle at Washington University documents that these two networks mutually suppress each other — when one is active, the other is less so. Mind-wandering is not a malfunction; it is the DMN winning the competition when TPN activation weakens.</p>

      <p><strong>The metacognitive awareness signal — the anterior cingulate cortex.</strong> The anterior cingulate cortex (ACC) is the brain's conflict monitor — it signals when what is currently happening (mind-wandering) conflicts with what was intended (focusing on the task). Without a strong ACC signal, mind-wandering continues unnoticed for extended periods. With a strong ACC signal, wandering is caught early — often within seconds rather than minutes. Research by Posner and Petersen identifies the ACC as the neural substrate of the "noticing" that awareness practices build: every time a meditator notices their mind has wandered and returns attention to the breath, they are exercising the ACC. Over weeks of daily practice, ACC function measurably improves, and the awareness it provides becomes available during study sessions as well as formal meditation.</p>

      <p><strong>Attention as a trainable capacity — not a fixed trait.</strong> Research by Tang and colleagues at the University of Oregon documents that 11 hours of awareness practice across 17 days produces measurable changes in white matter connectivity in the ACC — structural brain changes associated with improved attentional control, reduced self-reported confusion and tension, and lower cortisol. The capacity for sustained focus is not a fixed inherited trait — it is built through specific practice, in specific ways, over specific durations. The awareness exercises in this guide are the specific practice; the consistent daily use is the duration that produces the structural changes.</p>

      {/* ── Section 2 ── */}
      <h3 id="why-aware">2. Why Awareness Practices Improve Focus</h3>

      <p><strong>The noticing-returning cycle — what focus training actually trains.</strong> The common misconception about focus training is that the goal is to prevent attention from wandering. This is neither achievable nor what research shows produces improvement. What improves with training is the speed and ease of noticing that wandering has occurred and the quality of the return — how quickly, calmly, and without self-criticism attention is redirected. Research by Jha and colleagues at the University of Miami documents that the specific improvement following mindfulness training is faster detection of mind-wandering and more effective reorientation — not reduced frequency of wandering. Each meditation session's moments of noticing-and-returning are individual repetitions of the focus muscle, equivalent to individual repetitions in physical training. The accumulated effect across weeks is a muscle that catches drifts earlier and returns from them more smoothly.</p>

      <p><strong>Cortisol reduction restoring focus capacity.</strong> Academic anxiety is the most prevalent focus disruptor among students — but its mechanism is often misunderstood. Anxiety does not just feel bad while studying; it measurably reduces the prefrontal cortical function that focus requires through cortisol's downregulatory effect on the DLPFC. Research by Arnsten at Yale documents this specifically: even moderate stress produces DLPFC impairment that reduces working memory, attentional control, and the ability to filter irrelevant information — all direct components of focus. Awareness practices that reduce cortisol (breath awareness, physiological sigh, body scan) directly restore the prefrontal function that focus requires, producing focus improvements not through "concentrating harder" but through removing the physiological barrier to concentration.</p>

      <p><strong>DMN suppression — quieter background noise.</strong> Research by Brewer at Brown documents that mindfulness practitioners show significantly reduced posterior cingulate cortex (PCC) activity — the DMN hub most associated with the "sticky," craving quality of ruminative thought. This reduction means the background noise of self-referential thinking is lower — fewer spontaneous worry thoughts demanding attentional resources, less planning content competing with present-moment engagement. Students who practise consistently describe this as the mind feeling "quieter" or "less cluttered" during study — which is the subjective experience of reduced PCC/DMN activation improving the signal-to-noise ratio of their cognitive environment.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Focus Awareness Practice Builder</h3>
      <p>The Builder generates a personalised focus plan based on your specific focus challenge, your preferred productivity method, and how much daily awareness practice time you can commit. It includes the challenge explanation, four strategies, a primary awareness exercise with guided timer, and the productivity method steps.</p>

      <FocusAwarenessPracticeBuilder />

      {/* ── Section 4 ── */}
      <h3 id="exercises">4. Six Awareness Exercises for Deep Focus</h3>

      {activeTimer ? (
        <div style={{ marginBottom: '24px' }}>
          <FocusTimer exercise={AWARENESS_EXERCISES[activeTimer]} onClose={() => setActiveTimer(null)} />
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', fontFamily: font }}>
        {Object.values(AWARENESS_EXERCISES).map(ex => (
          <div key={ex.id} style={{ background: 'white', borderRadius: '13px', padding: '17px 20px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${ex.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{ex.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: ex.color }}>{ex.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{ex.time}</div>
              </div>
              <button onClick={() => setActiveTimer(activeTimer === ex.id ? null : ex.id)} style={{ padding: '8px 14px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${ex.color}, ${ex.color}BB)`, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font, flexShrink: 0 }}>▶ Try It</button>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{ex.desc}</p>
            <div style={{ background: FPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${FBORD}`, marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: FOCUS, marginBottom: '3px' }}>🔬 SCIENCE:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ex.science}</p>
            </div>
            <div style={{ background: ex.bg, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${ex.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: ex.color, marginBottom: '3px' }}>💡 TIP:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ex.tip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 5 ── */}
      <h3 id="productivity">5. Productivity Methods That Work With Awareness</h3>

      <p><strong>Why productivity methods alone fail without awareness.</strong> Standard productivity techniques — the Pomodoro technique, time blocking, the Getting Things Done system — are designed for environments where the practitioner has reliable access to their own attention. For students whose attention is fragmented by anxiety, digital conditioning, or cognitive overload, the productivity system cannot function at its designed capacity because the attention it requires is not fully available. Awareness practices restore the attentional capacity that makes the productivity methods work — they are the foundation on which the methods rest, not alternatives to them.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', fontFamily: font }}>
        {Object.entries(METHOD_DETAILS).map(([key, m]) => (
          <div key={key} style={{ background: 'white', borderRadius: '13px', padding: '18px 20px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${FOCUS}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: FOCUS }}>{m.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{m.time}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{m.why}</p>
            <div style={{ background: FPALE, borderRadius: '9px', padding: '10px 13px', border: `1px solid ${FBORD}` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: FOCUS, marginBottom: '5px', textTransform: 'uppercase' }}>Steps:</div>
              <ol style={{ margin: 0, paddingLeft: '16px' }}>
                {m.steps.map((s, i) => <li key={i} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{s}</li>)}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 6 ── */}
      <h3 id="examples">6. Practical Examples — Focus Before and After Awareness Practice</h3>

      {FOCUS_CHALLENGES.map(c => (
        <div key={c.key} style={{ background: 'white', borderRadius: '13px', padding: '18px 20px', marginBottom: '14px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${c.color}`, fontFamily: font }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '20px' }}>{c.icon}</span>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: c.color }}>{c.label}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#FBF5F5', borderRadius: '9px', padding: '10px 12px', border: '1px solid rgba(139,38,53,0.15)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#8B2635', marginBottom: '4px', textTransform: 'uppercase' }}>📉 Before practice:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{c.what.split('.')[0]}.</p>
            </div>
            <div style={{ background: c.bg, borderRadius: '9px', padding: '10px 12px', border: `1px solid ${c.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: c.color, marginBottom: '4px', textTransform: 'uppercase' }}>📈 After practice:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{c.strategies[0]}</p>
            </div>
          </div>
          <div style={{ background: FPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${FBORD}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: FOCUS, marginBottom: '3px' }}>👤 PRACTICAL EXAMPLE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>{c.example}</p>
          </div>
        </div>
      ))}

      {/* ── Section 7: FAQs ── */}
      <h3 id="faq">7. Improve Focus Naturally FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have been practising awareness for a week and my focus does not feel noticeably better. Should I give up?</strong><br />
        A: One week is not the adequate assessment window for awareness-based focus improvements. The research timeline is: immediate session-specific benefits (from first use of the physiological sigh and pre-task ritual), measurable reductions in mind-wandering frequency after two weeks of daily practice (Mrazek et al.), improved attention stability after four to six weeks, and structural brain changes supporting durable focus improvement after eight or more weeks. The most common assessment error is evaluating awareness practice by the quality of individual sessions rather than by changes in daily study function across weeks. The right questions after one week: "Is my study session quality measurably different today from a week ago?" For most students who practise consistently, the answer after two weeks is yes; after one week, the changes are often real but subtle. Daily consistency without outcome evaluation for fourteen days, followed by genuine assessment — this is the protocol that produces accurate data.</p>

        <p><strong>Q: My problem is not that I cannot focus at all — it is that I can focus intensely but only on interesting things, and I lose focus completely on things I find boring or anxiety-inducing. Is this different?</strong><br />
        A: Yes, and the distinction matters for which practices are most relevant. The capacity to focus intensely on interesting material shows the attentional system is functional — the issue is the motivation-attention interaction and the anxiety-attention interaction, not attention capacity per se. For boring content: the single-task formal session and the one-question prime (finding the most interesting aspect of the topic before beginning) produce the best results — they create or import a motivational hook where one does not naturally exist. For anxiety-inducing content: the pre-task physiological sigh sequence and the body scan before the session address the anxiety-cortisol mechanism that specifically impairs focus on evaluative material. The noting practice is additionally valuable for catching the specific thought pattern ("I might not understand this" / "this is too hard") that the anxiety-inducing material activates.</p>

        <p><strong>Q: Can these awareness exercises help with screen addiction and constant phone checking?</strong><br />
        A: Yes — but the awareness practices work on different aspects of phone-checking from the structural solutions. Structural solutions (phone in another room, notifications off, designated check-in windows) address the environmental trigger and the accessibility that makes checking automatic. Awareness practices address the internal trigger — the urge, the anxiety, the craving for stimulation that the phone resolves. The noting practice specifically trains the capacity to notice "there is an urge to check the phone" without automatically acting on it — creating the gap between urge and action that willpower alone cannot reliably maintain. Combined, the structural solution eliminates the environmental accessibility and the awareness practice reduces the urge frequency and intensity over weeks. Neither alone is as effective as both together.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: FOCUS, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Focus does not arrive when you try harder. It arrives when you build the awareness that notices when it has left — and the practice of returning becomes second nature."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Builder to find your challenge and practice. Begin with five minutes of noting or breath awareness today — before the next study session. That five minutes is the foundation. The focus improves from the foundation up.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: FOCUS, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${FBORD}` }}
          >
            Build Your Focus in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: FOCUS, border: `2px solid ${FOCUS}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Focus Practice
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-focus-concentration', '→ Why Mindfulness Improves Focus and Concentration'],
            ['/blog/mental-clarity-mindfulness',      '→ How to Build Mental Clarity Through Mindfulness'],
            ['/blog/reduce-mental-noise',             '→ How to Reduce Mental Noise and Distractions Naturally'],
            ['/blog/observe-thoughts-mindfully',      '→ How to Observe Your Thoughts Without Judging Them'],
            ['/blog/mentally-present-school-life',    '→ How to Stay Mentally Present in School Life'],
            ['/blog/daily-mindfulness-routine',       '→ Daily Mindfulness Routine for Students and Young Adults'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: FOCUS, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
