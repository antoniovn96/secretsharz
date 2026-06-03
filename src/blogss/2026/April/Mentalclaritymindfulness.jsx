import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build Mental Clarity Through Mindfulness",
  excerpt: "Mental clarity is not the absence of thoughts — it is the absence of unnecessary mental clutter that was never doing useful work. The cluttered mind is slower, less decisive, less creative, and less able to engage deeply with what matters. Mindfulness is the most effective available tool for clearing that clutter — not by silencing the mind but by training it to hold only what is relevant right now.",
  category: "Mental Health",
  date: "22-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mental-clarity-mindfulness.jpg",
  tldr: "Mental clarity is a functional state — the cognitive capacity to think clearly, focus sustained attention, make decisions with confidence, and engage deeply with one task at a time. Mindfulness builds this state by training the prefrontal cortex to manage information load, reduce the default mode network's noise, and restore the attentional capacity that mental clutter depletes. This guide covers the neuroscience, six decluttering techniques, five focus practices, and a productivity-focused Mental Clarity Planner.",
  toc: [
    { id: "what-clarity", title: "1. What Mental Clarity Is — and What Steals It",                     level: 3 },
    { id: "science",      title: "2. The Neuroscience of a Clear Mind",                               level: 3 },
    { id: "planner",      title: "3. Interactive: The Mental Clarity Productivity Planner",           level: 3 },
    { id: "declutter",    title: "4. Six Mental Decluttering Techniques",                              level: 3 },
    { id: "focus",        title: "5. Five Focus Practices for Sustainable Clarity",                   level: 3 },
    { id: "faq",          title: "6. Mental Clarity Mindfulness FAQs",                                level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-22T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mental clarity mindfulness, how to get mental clarity, mental clarity focus, mindfulness mental clarity, declutter mind mindfulness, focus practices mental clarity, mental clarity productivity students",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does mindfulness improve mental clarity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mindfulness improves mental clarity through three specific mechanisms. First, it trains the prefrontal cortex's executive function — the brain's mental editor — to filter irrelevant information more efficiently, reducing the cognitive load that creates mental fog. Second, it reduces default mode network activity, which is responsible for the background noise of self-referential thought, future worry, and past replay that competes with present-moment clarity. Third, it improves working memory capacity by reducing the anxiety and rumination that occupy working memory resources. Research by Mrazek et al. at UCSB documents significant working memory improvements and mind-wandering reductions after two weeks of daily mindfulness practice — both direct contributors to the functional clarity that productive thinking requires.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the fastest way to get mental clarity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest available mental clarity techniques are: the brain dump (writing every thought currently in the head — 3-5 minutes of uncensored writing externalises the mental clutter and immediately reduces cognitive load), the physiological sigh × 3 (30 seconds of deliberate breathing that reduces cortisol and restores prefrontal function), and the single-task declaration (closing every open tab and writing one specific task to begin with). Together these three take under ten minutes and consistently produce a measurable improvement in subjective clarity and focus quality. The brain dump is the highest-leverage single technique — research on expressive writing by Pennebaker shows that externalising mental content from internal holding to external storage immediately frees cognitive resources.",
      },
    },
    {
      "@type": "Question",
      "name": "Can mindfulness help with decision fatigue and unclear thinking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Decision fatigue — the declining quality of decisions following a long sequence of decision-making — is driven by the depletion of prefrontal cortical resources. Mindfulness practice specifically restores prefrontal function through the parasympathetic activation of breath-based practices, and through the reduction of the background cognitive load (worry, rumination, planning thoughts running continuously) that was consuming prefrontal resources. Research by Kaplan on attention restoration shows that even brief periods of open, undirected awareness in natural environments restores directed attention capacity — the same resource decision fatigue depletes. Mindfulness practice provides this restorative capacity within any environment, making it accessible during the school or study day without requiring a nature setting.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const CLEAR   = '#3A7A5A';
const CLPALE  = '#EBF5EF';
const CLBORD  = 'rgba(58,122,90,0.22)';

// ── Clutter Sources ────────────────────────────────────────────────────────────
const CLUTTER_SOURCES = [
  {
    key:    'too_many_tasks',
    icon:   '📋',
    label:  'Too many tasks competing simultaneously',
    desc:   'Holding everything on the mental list at once — assignments, exams, social tasks, errands',
    color:  '#8B2635',
    bg:     '#FBF0F1',
    what:   'Task overload clutter is produced by attempting to hold multiple active task threads in working memory simultaneously. Research on cognitive load theory (Sweller) shows working memory has a strict capacity limit — approximately 7 items (±2). When the mental task list exceeds this, items compete for working memory space, producing the specific fuzzy, scattered feeling of cognitive overload. None of the tasks is being processed well because all of them are partially held.',
    declutter_method: 'The full externalisation: write every task, concern, and obligation out of the head and onto paper — not a structured to-do list, an uncensored dump. Once external, the working memory is freed from holding. Then identify the single next action. The clarity that follows externalisation is immediate and consistent.',
    clarity_technique: 'brain_dump',
    focus_practice: 'single_task',
    productivity_tip: 'The Weekly Review (David Allen, GTD): once per week, empty the head completely into written form, clarify what each item requires, and identify next actions. This prevents the task overload from accumulating to cognitive fog levels before it is addressed.',
  },
  {
    key:    'emotional_noise',
    icon:   '💔',
    label:  'Emotional noise — unprocessed feelings',
    desc:   'Difficult emotions, relationships, or conflicts occupying background cognitive bandwidth',
    color:  CLEAR,
    bg:     CLPALE,
    what:   'Emotional noise clutter is produced by unprocessed emotional content running as background process — the difficult conversation that has not been resolved, the relationship tension that has not been addressed, the emotion from a disappointing result that has not been felt and processed. Research on emotional processing and working memory (Jha et al.) shows that unresolved emotional material occupies the same working memory resources as active task processing — competing directly with the clear thinking that academic work requires.',
    declutter_method: 'The emotional download: five minutes of uncensored writing about whatever is emotionally present. Not to solve it — to acknowledge and externalise it. Research by Pennebaker shows this specifically reduces the working memory occupancy of unprocessed emotional content, freeing cognitive capacity for the tasks that require it.',
    clarity_technique: 'emotional_download',
    focus_practice: 'breath_awareness',
    productivity_tip: 'Schedule dedicated emotional processing time — 10 minutes of journalling at the end of the day specifically for emotional content. This prevents emotional material from accumulating into the following day\'s cognitive bandwidth.',
  },
  {
    key:    'digital_overload',
    icon:   '📱',
    label:  'Digital overload — too many inputs',
    desc:   'Notifications, open tabs, social media, news — continuous input that fragments thinking',
    color:  '#2D5A8A',
    bg:     '#EEF3FB',
    what:   'Digital clutter produces a specific type of cognitive fog: the perpetual partial-attention state in which no single input receives full processing because the next one has already arrived. Research by Ward et al. at UT Austin shows that the mere presence of a smartphone on a desk reduces cognitive capacity measurably — even when face-down and silent. The mental fog of digital overload is not produced only by active use; it is maintained by the continuous anticipation of potential incoming information.',
    declutter_method: 'The digital clear: close all non-essential tabs, notifications off, phone in another room. Then: one complete breath, look at the cleared screen, and name the one task that occupies the now-clear cognitive space. The physical clearing of digital space produces immediate cognitive space.',
    clarity_technique: 'digital_clear',
    focus_practice: 'pomodoro_mindful',
    productivity_tip: 'The information diet: designate three specific daily windows for email, social media, and news — each 15 minutes. Everything outside these windows is inaccessible. The structure eliminates the continuous partial-attention state without requiring complete digital abstinence.',
  },
  {
    key:    'decision_fatigue',
    icon:   '⚡',
    label:  'Decision fatigue — too many choices',
    desc:   'Depleted from constant micro-decisions — what to study, when, how, in what order',
    color:  '#C07800',
    bg:     '#FFF8E1',
    what:   'Decision fatigue (Baumeister et al.) documents that the quality of decisions declines with the number of preceding decisions. For students, the micro-decision load is enormous: which subject to study, in which order, for how long, with which method, at which priority. Each micro-decision consumes the same prefrontal resources as major decisions. The cognitive fog that follows a day of study is often not intellectual fatigue from the content but decision fatigue from the continuous meta-decisions about the studying itself.',
    declutter_method: 'Decision batch processing: make all study decisions for the next session in one batch at the end of the current one. "Tomorrow morning I will study [subject A] for 45 minutes, then [subject B] for 45 minutes." Pre-deciding eliminates the micro-decision load from the session itself, making the cognitive resources fully available for the content.',
    clarity_technique: 'decision_batching',
    focus_practice: 'pre_study_ritual',
    productivity_tip: 'Standardise the routine: the more elements of the study day that are on automatic (same desk, same start time, same session structure), the fewer decisions each session requires and the more cognitive capacity remains for the actual study content.',
  },
  {
    key:    'future_planning',
    icon:   '🔮',
    label:  'Future planning threads — always running',
    desc:   'Mind constantly in planning mode — what needs to happen, when, in what sequence',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    what:   'Continuous planning clutter is the specific cognitive state in which the planning function of the prefrontal cortex runs without being switched off — always calculating the sequence of future tasks even during present activities. Neurologically, this is the dorsal prefrontal cortex maintaining active planning representations while the ventral attention network is attempting to sustain present-moment focus. The two systems compete, producing the characteristic divided-attention quality of planning-cluttered cognition.',
    declutter_method: 'The parking lot practice: a dedicated physical notebook for any planning thought that arrives during a non-planning period. Writing the thought externalises it, discharges the brain\'s reminder function that was keeping it active, and provides the commitment to return to it that allows the planning system to release it.',
    clarity_technique: 'parking_lot',
    focus_practice: 'single_task',
    productivity_tip: 'The dedicated planning session: one 20-minute block per day (morning works best) for all planning. Outside this window, planning thoughts are parked. The structure trains the brain that planning has its proper time and does not need to run continuously.',
  },
];

const CLARITY_GOALS = [
  { key: 'study_focus',   icon: '📚', label: 'Better focus during study sessions' },
  { key: 'productivity',  icon: '⚡', label: 'More productive use of study time' },
  { key: 'calm_mind',     icon: '🌿', label: 'A calmer, less reactive mind overall' },
  { key: 'decisions',     icon: '🎯', label: 'Clearer decision-making under pressure' },
];

const CLARITY_MOMENT = [
  { key: 'morning',   icon: '🌅', label: 'First thing in the morning before study' },
  { key: 'pre_study', icon: '📖', label: 'Right before each study session' },
  { key: 'overwhelm', icon: '🌊', label: 'When I feel overwhelmed and cannot think' },
  { key: 'evening',   icon: '🌙', label: 'Evening to clear the day before sleep' },
];

const CLARITY_TECHNIQUES = {
  brain_dump: {
    name: 'The Brain Dump', icon: '🧠', color: '#8B2635', time: '5 min',
    steps: [
      'Open a blank page in a physical notebook',
      'Set a timer for 3-5 minutes',
      'Write everything currently in your head — every task, worry, plan, concern, idea — without editing, organising, or censoring',
      'When the timer ends: read the list once',
      'Circle the one most important or most urgent item',
      'Write that item at the top of a fresh page as your current task',
    ],
    why: 'The brain dump externalises working memory from internal holding to external storage — immediately freeing the cognitive resources that were being used to maintain the list. Research by Baumeister on the Zeigarnik effect shows uncompleted tasks occupy active cognitive processing until they are "parked" externally.',
  },
  emotional_download: {
    name: 'The Emotional Download', icon: '📝', color: CLEAR, time: '5 min',
    steps: [
      'Open the journal or a blank page',
      'Write: "What is emotionally present for me right now?"',
      'Write for 3-5 minutes without stopping — whatever is there, uncensored',
      'Do not try to solve, analyse, or reframe while writing — just externalise',
      'Write the closing sentence: "This has been acknowledged. I can return to it if needed."',
      'Close the notebook and return to the task with the emotional space partially cleared',
    ],
    why: 'Unprocessed emotional content occupies the same working memory resources as active task processing. Externalisation through writing transfers it from internal holding to external storage, restoring the cognitive capacity it was consuming.',
  },
  digital_clear: {
    name: 'The Digital Clear', icon: '📵', color: '#2D5A8A', time: '2 min',
    steps: [
      'Close every browser tab except the one specifically needed for the current task',
      'Phone to another room — not just silenced, physically absent',
      'Notifications off on any remaining devices',
      'Close any non-essential applications on the computer',
      'Take one slow breath and look at the cleared screen',
      'Name the single task that will occupy this space: "This session is for ___."',
    ],
    why: 'Digital clutter produces cognitive load through two mechanisms: active processing of incoming information and background anticipation of potential incoming information. Physical removal of devices addresses the anticipation mechanism that digital silencing alone cannot.',
  },
  decision_batching: {
    name: 'Decision Batch Processing', icon: '📋', color: '#C07800', time: '3 min',
    steps: [
      'At the end of each study session or the evening before: open the planning notebook',
      'Write the complete plan for the next session in advance: subject, duration, specific task',
      'Include all micro-decisions: "I will study [subject] from [time] to [time] using [method]"',
      'Read the plan once. It is now decided.',
      'Begin tomorrow\'s session by reading this plan — no morning decisions required',
      'If interruptions occur during the session, note them for the next planning window rather than addressing mid-session',
    ],
    why: 'Pre-deciding eliminates the micro-decision load from the session itself, making the prefrontal resources fully available for content processing rather than meta-cognitive session management.',
  },
  parking_lot: {
    name: 'The Planning Parking Lot', icon: '🅿️', color: '#5B3A8B', time: 'Ongoing',
    steps: [
      'Keep a small dedicated notebook beside study materials at all times',
      'When any planning or task thought arrives during a study session: write it in one phrase — do not engage with it',
      'Return immediately to the current task',
      'At the end of the session: review the parking lot — what needs action?',
      'Assign each parked item to a specific future time slot or the next planning session',
      'The notebook stays open and accessible; the mind stays with the current task',
    ],
    why: 'The brain keeps planning thoughts active because it has no guarantee they will be remembered otherwise. The parking lot provides that guarantee — discharging the reminder function and allowing the planning system to release the thought.',
  },
};

const FOCUS_PRACTICES = {
  single_task: {
    id: 'single_task', name: 'Single-Task Focus Practice', icon: '🎯', color: '#2D5A8A', duration: 180,
    desc: 'The deliberate practice of engaging with exactly one task — nothing else open, nothing else mentally held — for a defined session.',
    steps: [
      'Close everything except the single task',
      'Write the specific task in one sentence on paper: "Right now I am ___"',
      'Set a timer: 25-45 minutes',
      'For the duration: one task only. When anything else arrives, note it in the parking lot and return.',
      'When the timer sounds: stop. Assess. Note what was accomplished.',
    ],
    science: 'Research by Meyer and Kieras documents that task switching costs up to 40% of productive time. Single-tasking eliminates these costs entirely while deepening the quality of engagement with each task.',
  },
  breath_awareness: {
    id: 'breath_awareness', name: 'Three-Breath Mental Reset', icon: '😮‍💨', color: '#1A7272', duration: 60,
    desc: 'A rapid cognitive reset that can be used between tasks, during transitions, or whenever mental fog arrives.',
    steps: [
      'Stop what you are doing completely',
      'Take one physiological sigh: double inhale through nose, long exhale through mouth',
      'Take a second breath more slowly, attending to the physical sensation',
      'Take a third breath and on the exhale, consciously release the mental content of the previous task',
      'Open your eyes (or re-engage) from this slightly refreshed position',
    ],
    science: 'Three deliberate breaths activate the vagus nerve and produce immediate parasympathetic activation — directly restoring the prefrontal function that mental fog reflects a temporary depletion of.',
  },
  pomodoro_mindful: {
    id: 'pomodoro_mindful', name: 'The Mindful Pomodoro', icon: '⏱️', color: CLEAR, duration: 300,
    desc: 'The Pomodoro technique (25-minute focused blocks) enhanced with mindfulness transitions that provide genuine restoration between blocks.',
    steps: [
      'Work session: 25 minutes of single-task focus (phone away, notifications off)',
      'Transition signal: when the timer sounds, close all materials deliberately',
      'Mindful break (5 minutes): NOT a phone break — open awareness or brief walk',
      '30 seconds of breath awareness before starting the next block',
      'Write the next task in one sentence before opening materials',
    ],
    science: 'The standard Pomodoro provides the work blocks; the mindfulness transitions provide the genuine attentional restoration between them. The phone break that most students use for Pomodoro rests is not restorative — research shows screen use maintains, not reduces, cognitive arousal.',
  },
  pre_study_ritual: {
    id: 'pre_study_ritual', name: 'The Pre-Study Clarity Ritual', icon: '🌅', color: '#C07800', duration: 180,
    desc: 'A three-minute transition practice that converts scattered, fragmented attention into genuine focused readiness before any study session.',
    steps: [
      'Before opening any material: close all devices except the study resource',
      'Three slow breaths with eyes closed — the breath is the transition signal',
      'Quick brain dump: write anything in your head in 60 seconds — clear the queue',
      'Write one sentence: "This session is for [specific task]"',
      'Open the material to exactly the right page/section',
      'Begin from this deliberate position rather than the habitual scattered one',
    ],
    science: 'Research on implementation intentions (Gollwitzer) shows that a specific pre-task ritual significantly improves follow-through and initial engagement quality. The ritual also builds the automatic association between the sequence and the focused state — after 2-3 weeks, the ritual itself produces the clarity.',
  },
  open_awareness: {
    id: 'open_awareness', name: 'Open Awareness Restoration', icon: '🌿', color: '#5B3A8B', duration: 300,
    desc: 'A five-minute practice of undirected, undemanding awareness that specifically restores the directed attention capacity that studying depletes.',
    steps: [
      'Close all study materials and devices',
      'Sit or stand comfortably. Close your eyes or soften your gaze',
      'Allow awareness to expand to everything — sounds near and far, body sensations, the quality of the air, the room',
      'Do not focus on any single thing. Just receive what is here',
      'When directed thoughts arise (planning, worrying, reviewing), gently let them pass without following',
      'After five minutes: return to study with a measurably fresher attentional baseline',
    ],
    science: 'Kaplan\'s attention restoration theory identifies "soft fascination" — gentle, undirected engagement with an interesting environment — as the specific antidote to directed attention fatigue. Open awareness practice delivers this without requiring access to natural environments.',
  },
};

// ── Guided Practice Timer ──────────────────────────────────────────────────────
function PracticeTimer({ practice, onClose }) {
  const [phase, setPhase] = useState('intro');
  const [timeLeft, setTimeLeft] = useState(practice.duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const secPerStep = Math.floor(practice.duration / practice.steps.length);

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(p => {
        const newTime = p - 1;
        const elapsed = practice.duration - newTime;
        const newStepIdx = Math.min(Math.floor(elapsed / secPerStep), practice.steps.length - 1);
        setStepIdx(newStepIdx);
        if (newTime <= 0) { clearInterval(intRef.current); setRunning(false); setDone(true); return 0; }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  const CIRC = 2 * Math.PI * 42;
  const pct = (practice.duration - timeLeft) / practice.duration;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div style={{ background: `${practice.color}08`, borderRadius: '14px', overflow: 'hidden', border: `2px solid ${practice.color}30`, fontFamily: font }}>
      <div style={{ padding: '13px 17px', background: `${practice.color}15`, borderBottom: `1px solid ${practice.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: practice.color }}>{practice.icon} {practice.name}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>
      <div style={{ padding: '18px' }}>
        {phase === 'intro' && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{practice.desc}</p>
            <div style={{ background: `${practice.color}10`, borderRadius: '9px', padding: '10px 13px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: practice.color, textTransform: 'uppercase', marginBottom: '4px' }}>🔬 Science:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{practice.science}</p>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: practice.color, textTransform: 'uppercase', marginBottom: '6px' }}>Steps:</div>
              {practice.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < practice.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: practice.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setPhase('active'); setRunning(true); }} style={{ width: '100%', padding: '13px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin ({Math.ceil(practice.duration / 60)} min)</button>
          </>
        )}
        {phase === 'active' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px auto' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke={`${practice.color}18`} strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={practice.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: mins > 0 ? '18px' : '22px', fontWeight: '700', color: practice.color, lineHeight: 1 }}>
                  {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs}
                </div>
              </div>
            </div>
            <div style={{ background: `${practice.color}10`, borderRadius: '9px', padding: '10px 12px', marginBottom: '12px', textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: practice.color, marginBottom: '3px' }}>STEP {stepIdx + 1}/{practice.steps.length}:</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{practice.steps[stepIdx]}</p>
            </div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {running
                ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸</button>
                : <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶</button>
              }
              <button onClick={() => { clearInterval(intRef.current); setTimeLeft(practice.duration); setStepIdx(0); setRunning(false); setDone(false); setPhase('intro'); }} style={{ padding: '9px 14px', borderRadius: '50px', border: `1.5px solid ${practice.color}40`, background: 'transparent', color: practice.color, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺</button>
            </div>
          </div>
        )}
        {done && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: practice.color, marginBottom: '8px' }}>Complete</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>Notice: how clear does your mind feel compared to when you started?</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setTimeLeft(practice.duration); setStepIdx(0); setRunning(true); setDone(false); setPhase('active'); }} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mental Clarity Planner ─────────────────────────────────────────────────────
function MentalClarityProductivityPlanner() {
  const [step,     setStep]     = useState(1);
  const [clutter,  setClutter]  = useState(null);
  const [goal,     setGoal]     = useState(null);
  const [moment,   setMoment]   = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [openItem, setOpenItem] = useState(null);
  const [activePractice, setActivePractice] = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selClutter = CLUTTER_SOURCES.find(c => c.key === clutter);
  const selGoal    = CLARITY_GOALS.find(g => g.key === goal);
  const selMoment  = CLARITY_MOMENT.find(m => m.key === moment);

  const clarityTech = selClutter ? CLARITY_TECHNIQUES[selClutter.clarity_technique] : null;
  const focusPrac   = selClutter ? FOCUS_PRACTICES[selClutter.focus_practice] : null;

  const handleReset = () => {
    setStep(1); setClutter(null); setGoal(null); setMoment(null);
    setRevealed(false); setOpenItem(null); setActivePractice(null);
  };

  if (activePractice) {
    const prac = FOCUS_PRACTICES[activePractice];
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <PracticeTimer practice={prac} onClose={() => setActivePractice(null)} />
      </div>
    );
  }

  const ChoiceBtn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{
        padding: '12px 14px', borderRadius: '11px', border: '2px solid',
        borderColor: isSel ? CLEAR : 'var(--border)', background: isSel ? CLPALE : 'white',
        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        width: '100%', marginBottom: '7px',
        boxShadow: isSel ? `0 0 0 2px ${CLBORD}` : 'none',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? CLEAR : 'var(--ink)', marginBottom: '1px' }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: CLEAR, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? CLEAR : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What is cluttering your mind most right now?
          </p>
          {CLUTTER_SOURCES.map(c => <ChoiceBtn key={c.key} opt={c} selected={clutter} onSelect={setClutter} />)}
          <button onClick={() => { if (clutter) setStep(2); }} disabled={!clutter} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: clutter ? `linear-gradient(135deg, ${CLEAR}, #5A9A7A)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: clutter ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: clutter ? `0 6px 18px ${CLBORD}` : 'none' }}>Next →</button>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What is your clarity goal?
          </p>
          {CLARITY_GOALS.map(g => <ChoiceBtn key={g.key} opt={g} selected={goal} onSelect={setGoal} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (goal) setStep(3); }} disabled={!goal} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: goal ? `linear-gradient(135deg, ${CLEAR}, #5A9A7A)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: goal ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — When do you most need mental clarity?
          </p>
          {CLARITY_MOMENT.map(m => <ChoiceBtn key={m.key} opt={m} selected={moment} onSelect={setMoment} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (moment) { setStep(4); setRevealed(false); } }} disabled={!moment} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: moment ? `linear-gradient(135deg, ${CLEAR}, #5A9A7A)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: moment ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Clarity Plan →</button>
          </div>
        </>
      )}

      {step === 4 && selClutter && clarityTech && focusPrac && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Mental Clarity Plan</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${CLEAR}, #5A9A7A)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${CLBORD}` }}>🧠 Generate My Clarity Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${CLEAR}, #5A9A7A)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '5px' }}>{selClutter.icon} {selGoal?.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Mental Clarity Plan</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selClutter.label} · Goal: {selGoal?.label}</div>
              </div>

              {/* Clutter explanation */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>🧠 Why This Clutter Feels the Way It Does</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selClutter.what}</p>
              </div>

              {/* Declutter technique */}
              <div style={{ background: CLPALE, border: `2px solid ${CLBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: CLEAR, marginBottom: '5px', letterSpacing: '1.2px' }}>🗑️ Declutter First: {clarityTech.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{clarityTech.time} · Use immediately when mental fog arrives</div>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{clarityTech.why}</p>
                <div style={{ background: 'white', borderRadius: '9px', padding: '10px 12px', border: `1px solid ${CLBORD}` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: CLEAR, marginBottom: '5px', textTransform: 'uppercase' }}>Steps:</div>
                  <ol style={{ margin: 0, paddingLeft: '16px' }}>
                    {clarityTech.steps.map((s, i) => <li key={i} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{s}</li>)}
                  </ol>
                </div>
              </div>

              {/* Focus practice */}
              <div style={{ background: 'white', border: `1.5px solid ${focusPrac.color}30`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', borderLeft: `3px solid ${focusPrac.color}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: focusPrac.color, marginBottom: '5px', letterSpacing: '1.2px' }}>🎯 Then Focus: {focusPrac.name}</div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{focusPrac.science}</p>
                <button onClick={() => setActivePractice(focusPrac.id)} style={{ width: '100%', padding: '11px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${focusPrac.color}, ${focusPrac.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin {focusPrac.name} ({Math.ceil(focusPrac.duration / 60)} min)</button>
              </div>

              {/* Productivity tip */}
              <div style={{ background: CLPALE, border: `1.5px solid ${CLBORD}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: CLEAR, marginBottom: '4px' }}>⚡ Productivity Tip for This Pattern</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selClutter.productivity_tip}</p>
              </div>

              {/* When to use */}
              <div style={{ background: 'white', border: `1.5px solid ${CLBORD}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: CLEAR, marginBottom: '4px' }}>📍 For Your Specific Moment</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
                  {selMoment?.key === 'morning' && 'Morning: Run the declutter technique first (before screens), then the focus practice to set a clear attentional baseline for the day.'}
                  {selMoment?.key === 'pre_study' && 'Pre-study: The declutter technique clears the queue; the focus practice activates the study-ready state. The complete sequence takes under 8 minutes and produces a measurably better session.'}
                  {selMoment?.key === 'overwhelm' && 'When overwhelmed: Declutter technique first — get everything out of the head. Then three slow breaths. Then focus practice. The sequence takes 10 minutes and consistently produces a shift from scattered to functional.'}
                  {selMoment?.key === 'evening' && 'Evening: The declutter technique transfers the day\'s mental content from active holding to external storage — freeing the pre-sleep period from cognitive processing. Follow with the focus practice to close the day deliberately.'}
                </p>
              </div>

              {/* Affirmation */}
              <div style={{ background: CLPALE, border: `1.5px dashed ${CLBORD}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: CLEAR, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "Mental clarity is not the absence of thoughts. It is the absence of thoughts that were never doing useful work — and that difference is entirely accessible right now."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${CLBORD}`, color: CLEAR, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different clarity plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MentalClarityMindfulness({ navigate, relatedPosts }) {
  const [activeFocusPrac, setActiveFocusPrac] = useState(null);
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
      <p>Mental clarity is the state in which thinking is sharp, decisions are accessible, focus lands and stays, and the quality of work reflects the actual capability of the person doing it — rather than being degraded by the fog of cognitive overload, unprocessed emotions, scattered attention, and digital noise that most students carry as a permanent background condition.</p>

      <p>The productivity angle of <strong>mental clarity through mindfulness</strong> is specific and measurable: a student with a clear mind studies more effectively in 90 minutes than a student with a cluttered one in three hours. The research on cognitive load, working memory, and attentional quality consistently shows that the mental environment in which work occurs determines its quality as much as the effort applied to it. This guide shows you how to clear that environment.</p>

      <img
        src={meta.imgUrl}
        alt="Student building mental clarity through mindfulness — decluttering techniques, focus practices, and productivity strategies"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-clarity">1. What Mental Clarity Is — and What Steals It</h3>

      <p><strong>Defining mental clarity functionally.</strong> Mental clarity is not a mystical state of enlightenment — it is a functional cognitive condition defined by three specific qualities: attentional coherence (the ability to direct attention to a chosen object and sustain it there without fragmentation), working memory availability (enough cognitive space to hold and manipulate the information the current task requires), and decision accessibility (the capacity to make choices without the paralysis of decision fatigue or competing demands). All three are measurable, all three vary throughout the day, and all three are directly influenced by the practices in this guide.</p>

      <p><strong>The five primary mental clutter sources for students.</strong> Mental clutter is not random — it has specific sources that each produce distinct types of cognitive fog. Research on cognitive load theory (Sweller), working memory (Baddeley), and decision fatigue (Baumeister) identifies the primary culprits: task overload (holding too many active task threads simultaneously), emotional noise (unprocessed emotional content running as background process), digital fragmentation (continuous partial attention from digital inputs), decision fatigue (prefrontal depletion from the volume of micro-decisions in a student's day), and planning clutter (the executive function's tendency to run continuous planning threads even during present-moment tasks). Each requires a specific intervention — generic "be more focused" advice fails because it does not address the specific clutter type.</p>

      <p><strong>The productivity cost of mental clutter — specific and measurable.</strong> Research on cognitive performance under high versus low cognitive load documents the specific productivity cost of mental clutter: reduced accuracy on complex reasoning tasks (Sweller), reduced creative problem-solving capacity (Russ), slower information processing speed (Jensen), and significantly impaired decision quality (Baumeister's ego depletion research). For students, these translate directly into study sessions that take twice as long to produce half the learning, exam performance that does not reflect preparation quality, and the characteristic end-of-day exhaustion that comes from maintaining cognitive overload rather than from genuine intellectual work. The investment in mental clarity practices is not a wellbeing luxury — it is a direct academic performance investment.</p>

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Neuroscience of a Clear Mind</h3>

      <p><strong>The prefrontal cortex as the mind's editor.</strong> The lateral prefrontal cortex — particularly the dorsolateral prefrontal cortex (DLPFC) — functions as the brain's mental editor: selecting relevant information for processing, suppressing irrelevant content, and maintaining the goal representations that keep thinking on task. When this system is functioning well, cognitive clarity is possible; when it is depleted, overloaded, or distracted, the editing function fails and mental clutter accumulates. Research by Arnsten at Yale documents that the DLPFC is highly sensitive to stress: even mild, sustained stress (the kind that characterises most students' daily experience) significantly impairs prefrontal function through the mechanism of cortisol and norepinephrine dysregulation. Mindfulness practice restores prefrontal function by reducing the cortisol that was impairing it.</p>

      <p><strong>Default mode network suppression and signal-to-noise ratio.</strong> The default mode network (DMN) — particularly the posterior cingulate cortex and medial prefrontal cortex — generates the background noise of self-referential thought, future worry, and past replay that competes with present-moment clarity. Research by Raichle at Washington University documents that the DMN and the task-positive network (TPN) mutually suppress each other — when one is active, the other is less active. Mental clutter is the condition in which the DMN is insufficiently suppressed, competing with the TPN during tasks that require directed attention. Mindfulness practice directly reduces DMN activity, documented in multiple fMRI studies, effectively improving the signal-to-noise ratio of cognitive processing — more signal from the task, less noise from the default mode.</p>

      <p><strong>Working memory capacity and the clutter connection.</strong> Working memory — the cognitive system that holds and manipulates information during active thinking — is the direct limiting factor of mental clarity. Research by Jha and colleagues at the University of Miami documents that anxiety, rumination, and unresolved cognitive content occupy working memory resources through what researchers call "cognitive capture" — involuntary attention to internal content that consumes working memory independently of whether it is actively being processed. Mindfulness practice reduces cognitive capture by training the attentional regulation that prevents involuntary occupation of working memory, effectively expanding the available working memory for the intended task without changing its structural capacity.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="planner">3. Interactive: The Mental Clarity Productivity Planner</h3>
      <p>The Planner identifies your primary clutter source and generates a personalised two-step plan: a targeted decluttering technique for immediate fog reduction, followed by a focus practice with a guided timer. It also provides a productivity tip specific to your clutter pattern and a timing guide for your chosen clarity moment.</p>

      <MentalClarityProductivityPlanner />

      {/* ── Section 4 ── */}
      <h3 id="declutter">4. Six Mental Decluttering Techniques</h3>

      <p><strong>Technique 1: The Brain Dump — for task overload.</strong> Open a blank page and write every thought, task, concern, plan, and idea currently in the head — uncensored, unorganised, for three to five minutes. Not a structured to-do list: a genuine uncensored externalisation. The brain dump works through the Zeigarnik effect (Baumeister): uncompleted tasks maintain active cognitive representations that consume working memory until they are "completed" by being externally recorded. Writing them out completes the recording function and frees working memory from the holding task. After the dump: circle the single most important item and begin with that.</p>

      <p><strong>Technique 2: The Emotional Download — for emotional noise.</strong> Five minutes of uncensored writing about whatever is emotionally present — not to solve or analyse, to acknowledge and externalise. Research by Pennebaker at UT Austin on expressive writing documents that the act of putting emotional experience into words significantly reduces its working memory occupancy — the content is transferred from internal cognitive holding to external storage, freeing the resources it was consuming. The closing sentence — "This has been acknowledged. I can return to it if needed." — provides the release signal that the brain needs to stop maintaining the emotional content as an active thread.</p>

      <p><strong>Technique 3: The Digital Clear — for digital fragmentation.</strong> Close every non-essential tab, browser window, and application. Phone to another room. Notifications off. Then: one complete breath, look at the cleared screen, and name the single task that will occupy it. The physical closure of digital inputs addresses the specific cognitive mechanism that maintains digital clutter: the background anticipation of potential incoming information. Research by Ward et al. documents that this anticipation — not just active processing — is what reduces cognitive capacity. Removing the device removes the anticipation.</p>

      <p><strong>Technique 4: Decision Batch Processing — for decision fatigue.</strong> Make all micro-decisions for the next study session in a single three-minute planning block at the end of the current session: which subject, in what order, for how long, with what method, at which priority. Pre-deciding eliminates the micro-decision load from the session itself. Research by Baumeister on ego depletion documents that decision quality deteriorates with each successive decision regardless of the decision's content. Batching decisions into a single dedicated window preserves the executive function for the work that follows.</p>

      <p><strong>Technique 5: The Planning Parking Lot — for planning clutter.</strong> Keep a small notebook beside study materials. When any planning thought arrives during a study session — "I need to message [person]," "I should review [topic] tomorrow," "I need to check [thing]" — write it in one phrase and return immediately to the task. The parking lot discharges the brain's reminder function by providing external storage for the planning content, allowing the planning system to release the thought rather than keeping it active as a reminder. Review and act on parked items only during designated planning time, not during the study session itself.</p>

      <p><strong>Technique 6: The Single-Subject Immersion — for focus fragmentation.</strong> For any study session requiring deep understanding — not review or practice, genuine new learning — commit to a complete single-subject session with physical closure of all other subjects' materials. The visual presence of other subjects' materials activates competing task representations that fragment the processing quality available for the current subject. Physical removal of non-current materials provides the environmental clarity that cognitive single-tasking requires but cannot produce alone.</p>

      {/* ── Section 5 ── */}
      <h3 id="focus">5. Five Focus Practices for Sustainable Clarity</h3>

      {activeFocusPrac ? (
        <div style={{ marginBottom: '24px', fontFamily: font }}>
          <PracticeTimer practice={FOCUS_PRACTICES[activeFocusPrac]} onClose={() => setActiveFocusPrac(null)} />
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', fontFamily: font }}>
        {Object.values(FOCUS_PRACTICES).map(p => (
          <div key={p.id} style={{ background: 'white', borderRadius: '13px', padding: '18px 20px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: p.color }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{Math.ceil(p.duration / 60)} minutes</div>
              </div>
              <button onClick={() => setActiveFocusPrac(activeFocusPrac === p.id ? null : p.id)} style={{ padding: '8px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${p.color}, ${p.color}BB)`, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font, flexShrink: 0 }}>▶ Try It</button>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{p.desc}</p>
            <div style={{ background: CLPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${CLBORD}` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: CLEAR, marginBottom: '3px' }}>🔬 SCIENCE:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{p.science}</p>
            </div>
          </div>
        ))}
      </div>

      <p><strong>The clarity stack — how focus practices work together for maximum productivity.</strong> The highest-impact daily clarity sequence combines the practices in this guide as a stack: brain dump (clears the queue) → three-breath reset (restores prefrontal baseline) → pre-study ritual (activates study-ready state) → mindful Pomodoro blocks (maintains clarity during the session) → open awareness breaks (restores what the session depletes). This complete stack takes approximately 15 additional minutes per study day and produces significantly better session quality than the equivalent time added to studying. The productivity return is not additive — it is multiplicative: clearing and restoring attentional capacity changes the quality of every minute that follows.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Mental Clarity Mindfulness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried decluttering techniques but the mental fog returns quickly — sometimes within minutes. Is this normal?</strong><br />
        A: Yes — the return of mental fog after a decluttering technique is expected if the underlying clutter source has not been addressed. The brain dump clears the queue, but if new tasks are arriving continuously (notifications, messages, additional demands), the queue refills. The decluttering technique is an acute intervention; the structural changes (notification management, phone boundaries, scheduled decision batching) are what prevent the rapid refilling. For sustainable clarity, both are needed: the acute technique for immediate fog and the structural change for preventing its return. If fog returns within minutes even without new inputs, this typically indicates that the anxiety or emotional content that was generating the fog was not fully externalised — a longer emotional download or more complete brain dump may be needed.</p>

        <p><strong>Q: Can mental clarity practices improve exam performance, or only wellbeing?</strong><br />
        A: Both — and the mechanism is direct. Exam performance is primarily limited by working memory capacity during the exam itself. Research by Beilock at the University of Chicago on choking under pressure documents that exam anxiety specifically consumes the working memory that exam performance requires — and that cognitive load reduction interventions (including brief expressive writing before exams) significantly improve exam scores. Research by Mrazek at UCSB documents that two weeks of mindfulness training improves GRE reading comprehension scores through the mechanism of reduced mind-wandering. The mental clarity practices in this guide improve both subjective wellbeing and objective academic performance through the same mechanism: restoring the cognitive capacity that anxiety and clutter were consuming.</p>

        <p><strong>Q: How is mental clarity different from just being stress-free?</strong><br />
        A: They are related but distinct. Stress-free means low arousal — which is not actually optimal for performance; research on the Yerkes-Dodson curve documents that moderate arousal improves performance compared to low arousal. Mental clarity is a specific cognitive quality that can coexist with appropriate levels of stress — it is the condition in which the cognitive resources are efficiently directed to the task at hand, regardless of the emotional state accompanying it. A student can be appropriately motivated about an exam (moderate arousal), aware that the stakes are high (appropriate concern), and simultaneously mentally clear (capable of focused, directed, high-quality thinking). The goal of clarity practices is not the elimination of stress but the optimisation of the cognitive environment in which work occurs — ensuring that the arousal energy of exam motivation is directed by a clear, functional mind rather than fragmented by cognitive clutter.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: CLEAR, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "A clear mind is not an empty mind. It is a mind in which the right things are active and the unnecessary things have been set down."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Planner to find your decluttering technique and focus practice. Try the brain dump before your next study session — five minutes before opening any material. Notice the difference in the quality of the first fifteen minutes that follow. That difference is what the practices in this guide produce, consistently, every day.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: CLEAR, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${CLBORD}` }}
          >
            Clear Your Mind in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: CLEAR, border: `2px solid ${CLEAR}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What Clears Your Mind
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-focus-concentration',  '→ Why Mindfulness Improves Focus and Concentration'],
            ['/blog/daily-mindfulness-routine',        '→ Daily Mindfulness Routine for Students and Young Adults'],
            ['/blog/observe-thoughts-mindfully',       '→ How to Observe Your Thoughts Without Judging Them'],
            ['/blog/mindfulness-stop-overthinking',    '→ How to Stop Overthinking with Simple Mindfulness Techniques'],
            ['/blog/develop-inner-peace',              '→ How to Develop Inner Peace in a Busy Life'],
            ['/blog/benefits-of-mindfulness',          '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: CLEAR, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
