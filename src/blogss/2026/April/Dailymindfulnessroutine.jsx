import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Daily Mindfulness Routine for Students and Young Adults",
  excerpt: "A daily mindfulness routine does not require a complete life restructure. It requires five minutes in the morning, a few deliberate practices scattered through the day, and a ten-minute wind-down before sleep. Done consistently, this structure produces measurable improvements in focus, stress resilience, and sleep quality within two weeks. This guide gives you the exact routine — step by step — and a personalised planner to build yours.",
  category: "Mental Health",
  date: "19-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/daily-mindfulness-routine.jpg",
  tldr: "A complete daily mindfulness routine for students: a five-step morning practice (5-20 minutes), three midday micro-practices requiring no extra time, and a five-step evening wind-down (10-15 minutes). Each step is explained with its purpose, specific instructions, and what to expect. An interactive Daily Routine Planner builds a personalised version based on your wake time, available time, and primary wellbeing goal.",
  toc: [
    { id: "why-routine",   title: "1. Why a Daily Routine Works Better Than Occasional Practice",       level: 3 },
    { id: "morning",       title: "2. The Morning Mindfulness Routine — Step by Step",                  level: 3 },
    { id: "planner",       title: "3. Interactive: The Daily Routine Planner",                         level: 3 },
    { id: "midday",        title: "4. Midday Micro-Practices — No Extra Time Required",                level: 3 },
    { id: "evening",       title: "5. The Evening Wind-Down Routine — Step by Step",                   level: 3 },
    { id: "faq",           title: "6. Daily Mindfulness Routine FAQs",                                 level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-19T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "daily mindfulness routine, mindfulness routine students, morning mindfulness routine, evening mindfulness routine, daily mindfulness practice, mindfulness routine young adults, step by step mindfulness",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What should a daily mindfulness routine include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A complete daily mindfulness routine for students should include three components. Morning (5-20 minutes): breath awareness to set the day's attentional baseline, a brief body check-in, and one written intention. Midday micro-practices (no extra time): a phone-free transition, mindful lunch, and a brief breath reset between activities. Evening (10-15 minutes): a worry download to clear pre-sleep cognitive arousal, a brief body scan, a gratitude entry, and pre-sleep breathing. Research by Zeidan et al. at Wake Forest shows that even 10 minutes of daily mindfulness practice produces measurable cognitive and stress benefits after four days — making the minimum viable routine one morning practice and one evening practice consistently applied.",
      },
    },
    {
      "@type": "Question",
      "name": "How long should a daily mindfulness routine be?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research supports starting with the minimum viable routine: 5 minutes in the morning and 10 minutes in the evening. This 15-minute daily investment produces measurable neurological changes after two weeks. After two weeks of consistent 15-minute practice, the routine typically feels natural enough to extend. The most important variable is daily consistency rather than session duration — 5 minutes every day for 30 days produces significantly better neurological benefits than 30 minutes twice a week. Begin with the smallest version that is genuinely achievable every day without exception.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best morning mindfulness routine for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective morning mindfulness routine for students follows five steps: (1) Wake without immediately checking the phone — the first 5 minutes are for yourself. (2) Three physiological sighs: double inhale through the nose, long complete exhale. This resets the cortisol awakening response before any external demands activate it. (3) Five minutes of breath awareness sitting upright — following each complete breath with precise attention. (4) A 60-second body scan — head to toe, noting any obvious tension or how you are actually feeling. (5) One written intention for the day — not a to-do list, one specific thing that matters today. This five-step sequence takes 8-12 minutes and produces the attentional and physiological baseline that determines the quality of the rest of the morning.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const VIOLET  = '#5A4A7A';
const VPALE   = '#F2EFF8';
const VBORD   = 'rgba(90,74,122,0.22)';

// ── Full Routine Steps ─────────────────────────────────────────────────────────
const MORNING_STEPS = [
  {
    step:    1,
    icon:    '📵',
    name:    'Phone-Free Awakening',
    time:    '1-2 minutes',
    color:   '#1A7272',
    bg:      '#EBF5F5',
    why:     'The first interaction of the day shapes the nervous system tone for the next two to three hours. Opening the phone immediately subjects the highest-cortisol morning window to comparison, news anxiety, and reactive notification mode. Research by Jessica Duke at the University of British Columbia shows that even brief morning social media use significantly elevates anxiety for the subsequent morning period.',
    instructions: [
      'When the alarm sounds: reach to turn it off, then put the phone face-down or in another room',
      'Sit up in bed or swing your legs over the side. Do not lie back down.',
      'Feel the room temperature, the morning light, the sounds present. Simply notice.',
      'Take three natural breaths. You are beginning the day on your own terms.',
    ],
    expectation: 'The first few mornings may feel like you are missing something. This is the habitual pull of the phone. It reduces within a week as the morning becomes genuinely your own.',
    duration_map: { '5min': true, '10min': true, '20min': true },
  },
  {
    step:    2,
    icon:    '😮‍💨',
    name:    'Three Physiological Sighs',
    time:    '30-45 seconds',
    color:   '#2D5A8A',
    bg:      '#EEF3FB',
    why:     'The cortisol awakening response (CAR) produces a natural morning cortisol spike in the first 30 minutes after waking. The physiological sigh is the fastest available mechanism to modulate this spike — reducing the activation before it sets the day\'s baseline. Research by Huberman Lab at Stanford shows measurable parasympathetic activation within 30 seconds of the physiological sigh.',
    instructions: [
      'Sitting upright: take one full inhale through the nose until the lungs feel 80% full',
      'Without exhaling, take a sharp top-up inhale — fill completely',
      'Exhale slowly and completely through the mouth — as long as possible, until the lungs feel empty',
      'Repeat twice more. Three sighs total.',
      'Notice: the body is now slightly calmer than it was 45 seconds ago.',
    ],
    expectation: 'Immediate mild relaxation. The physiological sigh works on first use — no practice required. The morning cortisol spike is modulated before the day\'s demands have activated it.',
    duration_map: { '5min': true, '10min': true, '20min': true },
  },
  {
    step:    3,
    icon:    '🧘',
    name:    'Breath Awareness Practice',
    time:    '3 minutes (or 10 minutes if time allows)',
    color:   VIOLET,
    bg:      VPALE,
    why:     'Five to ten minutes of morning breath awareness is the most consistently high-impact daily mindfulness practice documented in research. Research by Mrazek et al. shows this practice specifically reduces mind-wandering during subsequent tasks — the primary mechanism linking morning mindfulness to improved study focus. It builds the prefrontal attentional networks through the repeated noticing-and-returning that is the core training mechanism.',
    instructions: [
      'Sit upright — in bed, on a chair, or on the floor. The posture should keep you alert.',
      'Close your eyes. Bring attention to the physical sensation of breathing — at the nostrils (the slight coolness of the inhale, the warmth of the exhale), or the rise and fall of the chest or belly.',
      'Follow one complete breath from beginning to end: the very start of the inhale, its peak, the beginning of the exhale, all the way to empty.',
      'When attention moves to a thought — it will, immediately and repeatedly — note briefly: "thinking." Return to the breath.',
      'Continue for the full time. Every return of attention is a successful repetition.',
    ],
    expectation: 'The mind will wander frequently, especially at first. This is completely normal and does not mean you are doing it wrong. After two weeks of daily practice, the session quality noticeably improves and the between-session focus benefits become visible.',
    duration_map: { '5min': true, '10min': true, '20min': true },
  },
  {
    step:    4,
    icon:    '✋',
    name:    'The 60-Second Body Check-In',
    time:    '60 seconds',
    color:   '#2D6B45',
    bg:      '#E8F4EE',
    why:     'The body check-in provides the emotional weather report that prevents the day from beginning with an unacknowledged internal state. Research by Antonio Damasio on somatic markers shows the body\'s signals precede cognitive emotional awareness — the check-in gives this body knowledge a moment to surface before external demands begin.',
    instructions: [
      'After the breath practice: close your eyes for 60 seconds',
      'Scan slowly from the top of your head downward: forehead, jaw, neck, shoulders, chest, stomach',
      'At each area, simply notice: tight, relaxed, uncomfortable, neutral. Do not try to change anything.',
      'Name one word for how you are actually feeling right now: "anxious," "tired," "okay," "restless," "calm"',
      'This is your morning reading — information, not a verdict.',
    ],
    expectation: 'Students who practise the morning check-in consistently report fewer mid-session crashes during studying, because they already knew how they were starting and could calibrate accordingly.',
    duration_map: { '5min': false, '10min': true, '20min': true },
  },
  {
    step:    5,
    icon:    '✍️',
    name:    'The One-Intention Write',
    time:    '1-2 minutes',
    color:   '#C07800',
    bg:      '#FFF8E1',
    why:     'Research by Peter Gollwitzer on implementation intentions shows that forming a specific intention ("today I will specifically do [X]") significantly improves follow-through compared to general intentions ("today I will study"). The one-intention write sets a deliberate cognitive direction for the day rather than leaving the day\'s agenda entirely to external demands.',
    instructions: [
      'Open a physical notebook — not a phone or app',
      'Write today\'s date at the top',
      'Write one sentence: "Today I want to ___." Not a to-do list — one specific thing that genuinely matters for today.',
      'Read it once. Say it quietly.',
      'Close the notebook and begin your day.',
    ],
    expectation: 'The one-intention is the cognitive anchor that remains available when the day becomes scattered or overwhelming — a reminder of what today was actually for, independent of everything that competes for attention.',
    duration_map: { '5min': false, '10min': true, '20min': true },
  },
  {
    step:    6,
    icon:    '🌅',
    name:    'Morning Movement (Optional Extension)',
    time:    '5-10 minutes',
    color:   '#8B2635',
    bg:      '#FBF0F1',
    why:     'Research by John Ratey at Harvard on exercise and the brain shows that even brief morning movement produces BDNF (brain-derived neurotrophic factor) release and cortisol modulation that lasts for two to three hours after the movement ends. A ten-minute morning walk produces measurably better morning cognition and mood than the same time spent lying in bed.',
    instructions: [
      'Step outside or open a window',
      'Walk, stretch, or do any gentle movement for 5-10 minutes',
      'Attend to the physical experience of movement — no phone, no music required',
      'If walking: feet sensation, rhythm, what you can see and hear',
      'Return home having moved the body and taken in natural light before screens',
    ],
    expectation: 'Morning movement is optional in the minimum viable routine and essential in the optimal one. Students who consistently add this step report the most significant improvements in morning focus quality and mood stability.',
    duration_map: { '5min': false, '10min': false, '20min': true },
  },
];

const MIDDAY_STEPS = [
  {
    step:    1,
    icon:    '🚶',
    name:    'The Mindful Walk Transition',
    time:    '5 minutes (zero extra time)',
    color:   '#2D6B45',
    bg:      '#E8F4EE',
    when:    'Every time you walk between locations during the day — to class, to the canteen, between buildings',
    why:     'The walking commute or transition is typically colonised by phone scrolling. Reclaiming it as mindful walking provides genuine attentional restoration and cortisol reduction without requiring any additional time.',
    instructions: [
      'Phone into the bag or pocket — not in the hand',
      'Bring attention to the physical sensation of walking: the foot lifting, moving through the air, landing',
      'Notice the rhythm of left-right alternation',
      'Notice what you can see and hear as you move',
      'When the mind goes to planning or worrying: "thinking" — and return to the foot',
    ],
  },
  {
    step:    2,
    icon:    '🍽️',
    name:    'The Phone-Free Lunch',
    time:    '10-20 minutes (zero extra time)',
    color:   '#1A7272',
    bg:      '#EBF5F5',
    when:    'One meal per day — consistently the same meal creates the automatic habit faster',
    why:     'A genuine screen-free meal produces full parasympathetic activation through the sensory presence it enables. Research on mindful eating shows it also improves digestion, increases meal satisfaction, and reduces post-meal energy crashes from rushed eating.',
    instructions: [
      'Phone in the bag or face-down — completely ignored for the meal duration',
      'Before eating: one breath and one moment of noticing the appearance and smell of the food',
      'Eat at a pace that allows genuine taste experience — slower than the default',
      'Notice: temperature, texture, flavour. This is sensory mindfulness embedded in an existing activity.',
      'If eating alone: let the meal be genuinely quiet. If with others: let the conversation be genuinely present.',
    ],
  },
  {
    step:    3,
    icon:    '😮‍💨',
    name:    'The Between-Session Reset',
    time:    '30 seconds (zero extra time)',
    color:   VIOLET,
    bg:      VPALE,
    when:    'At the end of each study session or class period, before beginning the next activity',
    why:     'Cortisol accumulates across successive demands without deliberate reset points. Three physiological sighs between every significant activity prevents this accumulation — one of the highest-return, lowest-cost practices in this guide.',
    instructions: [
      'At the natural end of each activity: close the materials or the laptop',
      'Three physiological sighs: double inhale, long exhale — three times',
      'Notice: the activity you just completed is complete. The next one has not begun yet.',
      'This 30-second gap is the transition. Honour it before beginning the next thing.',
    ],
  },
];

const EVENING_STEPS = [
  {
    step:    1,
    icon:    '📵',
    name:    'The Digital Sunset',
    time:    '0 minutes (a decision, not an activity)',
    color:   '#8B2635',
    bg:      '#FBF0F1',
    why:     'Evening screen use disrupts melatonin production (blue light suppression) and maintains cognitive arousal past the point where the sleep system is ready to activate. Research by Charles Czeisler at Harvard shows that even 30 minutes of screen reduction before sleep significantly improves sleep onset and sleep quality.',
    instructions: [
      'Set a specific time — 9pm or 30 minutes before your intended sleep time',
      'At that time: close all non-essential apps, place the phone in another room if possible',
      'Dim any screens that remain active',
      'The hour before sleep belongs to you — protect it from devices\' agendas',
    ],
    expectation: 'The first week feels uncomfortable — the evening phone habit is strong. By week two, the analogue hour before sleep typically produces noticeable calm that the prior phone-use evening did not.',
    duration_map: { 'short': true, 'medium': true, 'full': true },
  },
  {
    step:    2,
    icon:    '📓',
    name:    'The Worry Download',
    time:    '3-5 minutes',
    color:   '#2D5A8A',
    bg:      '#EEF3FB',
    why:     'Pre-sleep cognitive arousal — the continuation of daytime anxious thinking into the sleep period — is the primary driver of sleep onset difficulty. Research by Harvey on the cognitive model of insomnia identifies unresolved thoughts circulating in working memory as the specific mechanism. Writing discharges this: the thoughts are acknowledged, externalised, and released from active mental holding.',
    instructions: [
      'Open a physical notebook 15-30 minutes before intended sleep',
      'Write every thought currently in your head — uncensored, in any order, for 3 minutes',
      'For any actionable item: write one specific next step beside it',
      'Write the closing sentence: "These thoughts are noted. I can return to them tomorrow."',
      'Close the notebook. The thoughts are no longer required to keep recurring.',
    ],
    expectation: 'Most students who implement the worry download report reduced sleep onset time within one week. The notebook beside the bed signals to the brain that the thoughts have a safe place — and the brain can let go of the active holding it was using as a reminder function.',
    duration_map: { 'short': false, 'medium': true, 'full': true },
  },
  {
    step:    3,
    icon:    '💛',
    name:    'The Gratitude Entry',
    time:    '2-3 minutes',
    color:   '#C07800',
    bg:      '#FFF8E1',
    why:     'Research by Wood and colleagues on gratitude and sleep quality shows that pre-sleep gratitude practice reduces pre-sleep negative cognitions by providing positive attentional content that competes with the ruminative worry pattern. The result: faster sleep onset, longer sleep duration, and better subjective sleep quality. The mechanism is not positive thinking — it is attentional direction.',
    instructions: [
      'In the same notebook as the worry download: write three specific things from today',
      'Specific means genuinely noticed — not generic. "The conversation with Priya at lunch" rather than "my friends."',
      'For one of the three: write one sentence about why this specific thing mattered',
      'Read the entry back once',
      'Close the notebook',
    ],
    expectation: 'Students often report that the gratitude entry is the step they look forward to most within two weeks — a predictable daily moment of genuine positive attention that the day\'s pressure had not provided.',
    duration_map: { 'short': false, 'medium': true, 'full': true },
  },
  {
    step:    4,
    icon:    '🧘',
    name:    'The Body Scan',
    time:    '5 minutes',
    color:   '#2D6B45',
    bg:      '#E8F4EE',
    why:     'Research by Kabat-Zinn on body scan practice in MBSR shows significant improvements in sleep quality, anxiety, and physical symptoms following regular practice. The body scan specifically addresses the physical tension that studying and daily pressure accumulate — releasing it before the sleep period rather than carrying it into the night.',
    instructions: [
      'Lie in bed in your sleeping position. Close your eyes.',
      'Starting at the crown of the head: move attention slowly downward',
      'At each area — forehead, jaw, neck, shoulders, chest, belly, arms, lower back, legs, feet — notice what is present',
      'At any area of obvious tension: breathe toward it on the inhale, and on the exhale, invite a slight release',
      'You are not forcing relaxation — you are noticing what is there and giving it permission to soften',
      'Complete the scan at the feet. Take three slow breaths.',
    ],
    expectation: 'Students who practise the body scan discover — sometimes with surprise — how much tension they were carrying without awareness. The discovery is the first step; the release follows naturally from the noticing.',
    duration_map: { 'short': true, 'medium': true, 'full': true },
  },
  {
    step:    5,
    icon:    '🌙',
    name:    'Pre-Sleep Breathing',
    time:    '3-5 minutes',
    color:   '#5B3A8B',
    bg:      '#F2EEF9',
    why:     'The 4-7-8 breathing technique, used lying down, is the most effective available natural sleep onset support. The breath hold activates the diving reflex (direct heart rate reduction), and the 8-count exhale produces the deepest available short-session parasympathetic activation. Research by Ong and colleagues on mindfulness-based insomnia treatment documents significant sleep onset improvements following breath-based pre-sleep practice.',
    instructions: [
      'Lying in your sleeping position. Eyes closed.',
      'Inhale quietly through the nose for 4 counts',
      'Hold the breath for 7 counts — body completely relaxed, no strain',
      'Exhale through the mouth for 8 counts — a quiet release',
      'Repeat for 4-8 cycles. You may fall asleep during the practice — that is exactly right.',
    ],
    expectation: 'The 4-7-8 technique typically produces drowsiness within the first two cycles in students who are sleep-ready but cognitively aroused. If sleep does not arrive, continue the pattern without concern — the continued practice itself is restful.',
    duration_map: { 'short': true, 'medium': true, 'full': true },
  },
];

// ── Planner Data ───────────────────────────────────────────────────────────────
const WAKE_TIMES = [
  { key: 'early',  label: '5:00 - 6:30 am', icon: '🌄' },
  { key: 'normal', label: '6:30 - 8:00 am', icon: '🌅' },
  { key: 'late',   label: '8:00 - 9:30 am', icon: '☀️' },
];

const MORNING_TIME = [
  { key: '5min',  label: '5 minutes',    icon: '⚡', desc: 'The absolute minimum — still produces meaningful daily benefit' },
  { key: '10min', label: '10 minutes',   icon: '🌿', desc: 'The evidence-backed starting point for measurable neurological change' },
  { key: '20min', label: '20 minutes',   icon: '🌳', desc: 'The optimal routine for significant weekly lifestyle improvement' },
];

const PRIMARY_GOAL = [
  { key: 'focus',     icon: '🎯', label: 'Better focus and concentration for study' },
  { key: 'stress',    icon: '💚', label: 'Reduce stress and anxiety' },
  { key: 'sleep',     icon: '😴', label: 'Improve sleep quality' },
  { key: 'emotional', icon: '💛', label: 'Emotional balance and resilience' },
];

const EVENING_TIME = [
  { key: 'short',  label: '5-10 minutes', icon: '⚡' },
  { key: 'medium', label: '10-15 minutes', icon: '🌿' },
  { key: 'full',   label: '20+ minutes',  icon: '🌳' },
];

const GOAL_EMPHASIS = {
  focus: {
    morning_note: 'For focus and concentration: the breath awareness practice is the core of your morning — it directly trains the attentional networks that study requires. Keep the phone away from the study desk all day.',
    midday_note: 'Between every study session: three physiological sighs. The attention restoration break (open awareness, 5 minutes) after every 45-minute study block is the highest-focus midday practice.',
    evening_note: 'Your evening practice protects tomorrow\'s focus by protecting tonight\'s sleep. The body scan and pre-sleep breathing are priority.',
    highlight_step: 3,
  },
  stress: {
    morning_note: 'For stress reduction: the three physiological sighs and breath awareness specifically address the cortisol awakening response. A 10-minute morning walk amplifies the cortisol reduction significantly if time allows.',
    midday_note: 'The phone-free lunch produces the most midday parasympathetic restoration. Practice the 5-4-3-2-1 grounding exercise whenever stress spikes during the day.',
    evening_note: 'The worry download is your highest-priority evening step — it directly addresses the pre-sleep cognitive arousal that stress produces. Do not skip it.',
    highlight_step: 2,
  },
  sleep: {
    morning_note: 'For sleep improvement: the morning routine\'s primary role is to begin the day with lower cortisol — which creates the cortisol gradient that allows evening melatonin production at the right time.',
    midday_note: 'Limit caffeine after 2pm. Ensure genuine physical movement at some point in the day — this is the single most powerful sleep quality lever available.',
    evening_note: 'Your evening routine is the priority: digital sunset at 9pm (non-negotiable), worry download, body scan, and 4-7-8 breathing. In that order, without exception.',
    highlight_step: 5,
  },
  emotional: {
    morning_note: 'For emotional balance: the body check-in and the one-intention write are your priority morning steps — they build the self-awareness and self-direction that emotional regulation requires.',
    midday_note: 'Add: the daily emotion naming practice — once at midday, name the specific emotion currently present using the most accurate word available. This affect labelling practice directly improves emotional regulation capacity.',
    evening_note: 'The gratitude entry and the body scan together address both the emotional residue of the day and the self-compassion that emotional resilience requires. Prioritise these.',
    highlight_step: 4,
  },
};

// ── Planner Component ──────────────────────────────────────────────────────────
function DailyRoutinePlanner() {
  const [step,      setStep]      = useState(1);
  const [wakeTime,  setWakeTime]  = useState(null);
  const [mornTime,  setMornTime]  = useState(null);
  const [goal,      setGoal]      = useState(null);
  const [evenTime,  setEvenTime]  = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openStep,  setOpenStep]  = useState(null);
  const [activeTab, setActiveTab] = useState('morning');
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selWake  = WAKE_TIMES.find(w => w.key === wakeTime);
  const selMorn  = MORNING_TIME.find(m => m.key === mornTime);
  const selGoal  = PRIMARY_GOAL.find(g => g.key === goal);
  const selEven  = EVENING_TIME.find(e => e.key === evenTime);
  const goalEmph = goal ? GOAL_EMPHASIS[goal] : null;

  const filteredMorning = MORNING_STEPS.filter(s => mornTime && s.duration_map[mornTime]);
  const filteredEvening = EVENING_STEPS.filter(s => evenTime && s.duration_map[evenTime]);

  const handleReset = () => { setStep(1); setWakeTime(null); setMornTime(null); setGoal(null); setEvenTime(null); setRevealed(false); setOpenStep(null); setActiveTab('morning'); };

  const ChoiceBtn = ({ opt, selected, onSelect, fullWidth = true }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{
        padding: '12px 14px', borderRadius: '11px', border: '2px solid',
        borderColor: isSel ? VIOLET : 'var(--border)', background: isSel ? VPALE : 'white',
        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'flex-start', gap: '10px', width: fullWidth ? '100%' : 'auto',
        marginBottom: '7px', boxShadow: isSel ? `0 0 0 2px ${VBORD}` : 'none',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? VIOLET : 'var(--ink)', marginBottom: '1px' }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: VIOLET, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? VIOLET : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1: Wake time */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — When do you typically wake up?
          </p>
          {WAKE_TIMES.map(w => <ChoiceBtn key={w.key} opt={w} selected={wakeTime} onSelect={setWakeTime} />)}
          <button onClick={() => { if (wakeTime) setStep(2); }} disabled={!wakeTime} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: wakeTime ? `linear-gradient(135deg, ${VIOLET}, #7A6AAA)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: wakeTime ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: wakeTime ? `0 6px 18px ${VBORD}` : 'none' }}>Next →</button>
        </>
      )}

      {/* STEP 2: Morning time */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How much morning time can you realistically give?
          </p>
          {MORNING_TIME.map(m => <ChoiceBtn key={m.key} opt={m} selected={mornTime} onSelect={setMornTime} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (mornTime) setStep(3); }} disabled={!mornTime} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: mornTime ? `linear-gradient(135deg, ${VIOLET}, #7A6AAA)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: mornTime ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3: Goal */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What is your primary wellbeing goal?
          </p>
          {PRIMARY_GOAL.map(g => <ChoiceBtn key={g.key} opt={g} selected={goal} onSelect={setGoal} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (goal) setStep(4); }} disabled={!goal} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: goal ? `linear-gradient(135deg, ${VIOLET}, #7A6AAA)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: goal ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 4: Evening time */}
      {step === 4 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 4 — How much evening time can you give?
          </p>
          {EVENING_TIME.map(e => <ChoiceBtn key={e.key} opt={e} selected={evenTime} onSelect={setEvenTime} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(3)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (evenTime) { setStep(5); setRevealed(false); } }} disabled={!evenTime} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: evenTime ? `linear-gradient(135deg, ${VIOLET}, #7A6AAA)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: evenTime ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Routine →</button>
          </div>
        </>
      )}

      {/* STEP 5: Results */}
      {step === 5 && selWake && selMorn && selGoal && selEven && goalEmph && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Daily Mindfulness Routine</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${VIOLET}, #7A6AAA)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${VBORD}` }}>🌙 Generate My Daily Routine</button>
              <button onClick={() => setStep(4)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${VIOLET}, #7A6AAA)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '5px' }}>{selGoal.icon} {selWake.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Daily Mindfulness Routine</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>
                  Waking {selWake.label} · {selMorn.label} morning · Goal: {selGoal.label.split(' ')[0]}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '14px', background: VPALE, borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
                {[
                  { key: 'morning', label: '🌅 Morning' },
                  { key: 'midday',  label: '☀️ Midday' },
                  { key: 'evening', label: '🌙 Evening' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    flex: 1, padding: '11px 8px', background: 'transparent', border: 'none',
                    borderBottom: activeTab === tab.key ? `3px solid ${VIOLET}` : '3px solid transparent',
                    cursor: 'pointer', fontFamily: font, fontSize: '13px',
                    fontWeight: activeTab === tab.key ? '700' : '500',
                    color: activeTab === tab.key ? VIOLET : 'var(--muted)', transition: 'all 0.15s',
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* Morning Tab */}
              {activeTab === 'morning' && (
                <div>
                  <div style={{ background: VPALE, border: `1.5px solid ${VBORD}`, borderRadius: '10px', padding: '10px 13px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '3px' }}>🎯 FOR YOUR GOAL: {selGoal.label.toUpperCase().split(' ')[0]}</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, fontWeight: '500' }}>{goalEmph.morning_note}</p>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                    {selMorn.label.toUpperCase()} MORNING ROUTINE ({filteredMorning.length} STEPS):
                  </div>
                  {filteredMorning.map((s, i) => {
                    const isOpen = openStep === `m-${i}`;
                    const isHighlight = s.step === goalEmph.highlight_step;
                    return (
                      <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `2px solid ${isHighlight ? s.color : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
                        <button onClick={() => setOpenStep(isOpen ? null : `m-${i}`)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px', fontFamily: font, textAlign: 'left' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.bg, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: s.color }}>{s.name}</div>
                              {isHighlight && <span style={{ fontSize: '9px', fontWeight: '700', background: s.color, color: 'white', padding: '1px 6px', borderRadius: '20px' }}>KEY</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.time}</div>
                          </div>
                          <span style={{ color: s.color, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                            <p style={{ margin: '8px 0 8px 0', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{s.why}</p>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: s.color, textTransform: 'uppercase', marginBottom: '5px' }}>Steps:</div>
                            <ol style={{ margin: 0, paddingLeft: '16px' }}>
                              {s.instructions.map((ins, j) => <li key={j} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{ins}</li>)}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Midday Tab */}
              {activeTab === 'midday' && (
                <div>
                  <div style={{ background: VPALE, border: `1.5px solid ${VBORD}`, borderRadius: '10px', padding: '10px 13px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '3px' }}>☀️ MIDDAY GOAL FOCUS</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, fontWeight: '500' }}>{goalEmph.midday_note}</p>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                    THREE MIDDAY PRACTICES (ZERO EXTRA TIME):
                  </div>
                  {MIDDAY_STEPS.map((s, i) => {
                    const isOpen = openStep === `d-${i}`;
                    return (
                      <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                        <button onClick={() => setOpenStep(isOpen ? null : `d-${i}`)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px', fontFamily: font, textAlign: 'left' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.bg, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: s.color }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.when}</div>
                          </div>
                          <span style={{ color: s.color, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                            <p style={{ margin: '8px 0 8px 0', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{s.why}</p>
                            <ol style={{ margin: 0, paddingLeft: '16px' }}>
                              {s.instructions.map((ins, j) => <li key={j} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{ins}</li>)}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Evening Tab */}
              {activeTab === 'evening' && (
                <div>
                  <div style={{ background: VPALE, border: `1.5px solid ${VBORD}`, borderRadius: '10px', padding: '10px 13px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '3px' }}>🌙 EVENING GOAL FOCUS</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, fontWeight: '500' }}>{goalEmph.evening_note}</p>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                    {selEven.label.toUpperCase()} EVENING ROUTINE ({filteredEvening.length} STEPS):
                  </div>
                  {filteredEvening.map((s, i) => {
                    const isOpen = openStep === `e-${i}`;
                    return (
                      <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                        <button onClick={() => setOpenStep(isOpen ? null : `e-${i}`)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px', fontFamily: font, textAlign: 'left' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.bg, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: s.color }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.time}</div>
                          </div>
                          <span style={{ color: s.color, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                            <p style={{ margin: '8px 0 8px 0', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{s.why}</p>
                            <ol style={{ margin: 0, paddingLeft: '16px' }}>
                              {s.instructions.map((ins, j) => <li key={j} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{ins}</li>)}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Affirmation */}
              <div style={{ background: VPALE, border: `1.5px dashed ${VBORD}`, borderRadius: '12px', padding: '13px 17px', marginTop: '14px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: VIOLET, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "This routine exists in the time your day already has. It only needs to be chosen."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${VBORD}`, color: VIOLET, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different routine</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DailyMindfulnessRoutine({ navigate, relatedPosts }) {
  const [openStep, setOpenStep] = useState(null);
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
      <p>The difference between knowing about mindfulness and actually experiencing its benefits is almost entirely a design problem. Students who practise occasionally — when they remember, when stress becomes acute, when they stumble across a guided session — accumulate almost none of the neurological changes that daily practice produces. The brain changes documented in the research are cumulative and consistency-dependent: two weeks of daily practice produces measurably different brain function from two weeks of zero practice; the same total hours distributed across occasional sessions does not.</p>

      <p>A <strong>daily mindfulness routine</strong> solves the design problem. Instead of requiring a daily decision to practise, a routine attaches practice to existing daily behaviours — waking, transitioning between activities, preparing for sleep — so that the decision is made once and the practice happens automatically. This guide gives you the complete routine, step by step, and a personalised planner to build the version that fits your actual life.</p>

      <img
        src={meta.imgUrl}
        alt="Daily mindfulness routine for students and young adults — morning practices, midday exercises, and evening wind-down steps"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-routine">1. Why a Daily Routine Works Better Than Occasional Practice</h3>

      <p><strong>The consistency principle — what the neuroscience shows.</strong> Research by Hölzel and colleagues at Massachusetts General Hospital documents structural brain changes after 8 weeks of daily mindfulness practice: reduced amygdala grey matter density, increased prefrontal cortical thickness, and improved hippocampal volume. These are architectural changes — not just functional states during practice but durable modifications to the brain regions governing attention, emotional regulation, and stress response. The critical word is "daily": participants in Hölzel's study practised an average of 27 minutes per day. The participants who practised intermittently showed significantly smaller changes. The neurological investment requires regularity — the brain changes through repetition across days, not through the accumulated total of minutes practised.</p>

      <p><strong>The habit formation advantage.</strong> Research by Phillippa Lally at University College London on habit formation shows that consistent behavioural repetition produces automaticity — the state in which the behaviour occurs without requiring deliberate decision or motivation. The average time to automaticity in Lally's study was 66 days, with a range of 18 to 254 depending on behaviour complexity and consistency. For mindfulness, this means: two to six months of daily practice produces a state in which the practice happens because it is part of the day's structure, not because motivation has been successfully generated each time. The routine format is specifically designed to accelerate automaticity by attaching practices to existing cues (waking, transitions, preparing for sleep) rather than requiring new time discovery each day.</p>

      <p><strong>The compounding benefit — what consistent practice produces week by week.</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Days 1-3:</strong> Immediate techniques (physiological sigh, body check-in) produce same-session benefits. The practice feels effortful and unusual.</li>
        <li><strong>Days 4-7:</strong> The morning and evening anchors begin to feel like part of the day rather than additions to it. First signs of slightly faster attentional recovery from distraction during study.</li>
        <li><strong>Week 2:</strong> Measurable reductions in perceived stress and mind-wandering during study sessions (Zeidan et al.). The practice feels more natural; the motivation required to begin it is noticeably less.</li>
        <li><strong>Week 3-4:</strong> Sleep quality improvements become noticeable. The worry download and pre-sleep breathing have shortened sleep onset time consistently. Better emotional recovery speed after difficult events.</li>
        <li><strong>Week 6-8:</strong> Structural brain changes beginning to accumulate. The practice is largely automatic. The benefits are visible in daily life rather than requiring specific measurement.</li>
      </ul>

      <p><strong>The minimum viable routine — what the research requires as a starting point.</strong> Research by Zeidan and colleagues at Wake Forest documents measurable cognitive benefits — improved sustained attention, reduced mind-wandering, reduced anxiety — after just four days of practice at 20 minutes per day. For students with less time: research by Gilmartin and colleagues shows that shorter daily sessions (10 minutes) produce proportional but still significant benefits across the same timeline. The minimum viable daily routine for neurological benefit is one five-minute morning practice plus one ten-minute evening practice, every day without exception. This is achievable by virtually any student — the constraint is not time but habit design.</p>

      {/* ── Section 2 ── */}
      <h3 id="morning">2. The Morning Mindfulness Routine — Step by Step</h3>

      <p>The morning routine sets the nervous system baseline for the day. The cortisol awakening response — a natural 50% cortisol spike in the first 30 minutes after waking — determines the attentional and emotional tone of the subsequent morning period. The morning practice modulates this spike before external demands amplify it.</p>

      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px', fontFamily: font }}>
        <em>Tap any step to expand the full instructions and what to expect.</em>
      </p>

      {MORNING_STEPS.map((s, i) => {
        const isOpen = openStep === `ms-${i}`;
        return (
          <div key={i} style={{ background: 'white', borderRadius: '13px', marginBottom: '9px', border: `1.5px solid ${isOpen ? s.color : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.15s', fontFamily: font }}>
            <button onClick={() => setOpenStep(isOpen ? null : `ms-${i}`)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, border: `1.5px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '1px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: s.color }}>Step {s.step}</span>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: isOpen ? s.color : 'var(--ink)' }}>{s.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.time}</div>
              </div>
              <span style={{ color: s.color, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 16px 14px 16px', borderTop: `1px solid ${s.color}15` }}>
                <p style={{ margin: '10px 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>{s.why}</p>
                <div style={{ background: s.bg, borderRadius: '9px', padding: '11px 13px', marginBottom: '8px', border: `1px solid ${s.color}20` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: s.color, textTransform: 'uppercase', marginBottom: '6px' }}>Instructions:</div>
                  <ol style={{ margin: 0, paddingLeft: '16px' }}>
                    {s.instructions.map((ins, j) => <li key={j} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '4px' }}>{ins}</li>)}
                  </ol>
                </div>
                <div style={{ background: VPALE, border: `1px solid ${VBORD}`, borderRadius: '8px', padding: '8px 11px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: VIOLET, marginBottom: '3px' }}>💡 WHAT TO EXPECT:</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{s.expectation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background: VPALE, border: `1.5px solid ${VBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', fontFamily: font }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>⏱️ TIME GUIDE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { time: '5 min', steps: 'Steps 1-3', desc: 'Minimum viable morning — produces neurological benefit with daily consistency' },
            { time: '10 min', steps: 'Steps 1-5', desc: 'Evidence-backed optimal starting point for full benefit range' },
            { time: '20 min', steps: 'Steps 1-6', desc: 'Optimal full morning routine including movement' },
          ].map(t => (
            <div key={t.time} style={{ background: 'white', borderRadius: '8px', padding: '10px', border: `1px solid ${VBORD}`, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: VIOLET }}>{t.time}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '4px' }}>{t.steps}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Interactive ── */}
      <h3 id="planner">3. Interactive: The Daily Routine Planner</h3>
      <p>The Planner builds a personalised morning-to-evening routine based on when you wake up, how much morning and evening time you have, and what you most want to improve. The result is a tab-organised complete routine with all steps expanded and goal-specific emphasis highlighted.</p>

      <DailyRoutinePlanner />

      {/* ── Section 4 ── */}
      <h3 id="midday">4. Midday Micro-Practices — No Extra Time Required</h3>

      <p>The midday practices require zero additional time. They replace existing habits (phone-in-hand walking, screen-accompanied eating, rushed transitions) with practices that produce genuine nervous system restoration. The key principle: you were already doing these activities; the practice changes how you do them, not whether you do them.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontFamily: font }}>
        {MIDDAY_STEPS.map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '13px', padding: '18px 20px', border: `1.5px solid var(--border)`, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: s.color }}>{s.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.time} · When: {s.when}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{s.why}</p>
            <div style={{ background: s.bg, borderRadius: '9px', padding: '10px 13px', border: `1px solid ${s.color}20` }}>
              <ol style={{ margin: 0, paddingLeft: '16px' }}>
                {s.instructions.map((ins, j) => <li key={j} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{ins}</li>)}
              </ol>
            </div>
          </div>
        ))}
      </div>

      <p><strong>Additional midday micro-practices for specific needs:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>For acute exam anxiety:</strong> 5-4-3-2-1 grounding (3 minutes) — name five things seen, four felt, three heard, two smelled, one tasted. Interrupts any anxiety spiral within 3 minutes.</li>
        <li><strong>For scattered post-lunch focus:</strong> The pre-study ritual (3 minutes) — close everything, three breaths, write one task for the session. Opens the afternoon session from genuine attentional presence rather than accumulated scatter.</li>
        <li><strong>For emotional activation mid-day:</strong> The STOP technique (2 minutes) — stop, take a breath (physiological sigh), observe what is happening, proceed with intention. Converts automatic emotional reaction into chosen response.</li>
        <li><strong>For social comparison activation:</strong> One breath and the name: "I am comparing my internal experience to their external presentation." The naming creates the distance that prevents the spiral from continuing.</li>
      </ul>

      {/* ── Section 5 ── */}
      <h3 id="evening">5. The Evening Wind-Down Routine — Step by Step</h3>

      <p>The evening routine serves three functions: processing the day's emotional and cognitive content before sleep, creating the physiological transition from daytime activation to sleep-ready calm, and protecting the sleep quality that is the most powerful daily restoration available. Each step addresses one of these functions.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px', fontFamily: font }}>
        {EVENING_STEPS.map((s, i) => {
          const isOpen = openStep === `es-${i}`;
          return (
            <div key={i} style={{ background: 'white', borderRadius: '13px', border: `1.5px solid ${isOpen ? s.color : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
              <button onClick={() => setOpenStep(isOpen ? null : `es-${i}`)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, border: `1.5px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: s.color }}>Step {s.step}</span>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: isOpen ? s.color : 'var(--ink)' }}>{s.name}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.time}</div>
                </div>
                <span style={{ color: s.color, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div style={{ padding: '0 16px 14px 16px', borderTop: `1px solid ${s.color}15` }}>
                  <p style={{ margin: '10px 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic' }}>{s.why}</p>
                  <div style={{ background: s.bg, borderRadius: '9px', padding: '11px 13px', marginBottom: '8px', border: `1px solid ${s.color}20` }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: s.color, textTransform: 'uppercase', marginBottom: '6px' }}>Instructions:</div>
                    <ol style={{ margin: 0, paddingLeft: '16px' }}>
                      {s.instructions.map((ins, j) => <li key={j} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '4px' }}>{ins}</li>)}
                    </ol>
                  </div>
                  <div style={{ background: VPALE, border: `1px solid ${VBORD}`, borderRadius: '8px', padding: '8px 11px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: VIOLET, marginBottom: '3px' }}>💡 WHAT TO EXPECT:</div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{s.expectation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: VPALE, border: `1.5px solid ${VBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', fontFamily: font }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: VIOLET, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>⏱️ EVENING TIME GUIDE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { time: '5-10 min', steps: 'Steps 1, 4, 5', desc: 'Digital sunset + body scan + pre-sleep breathing. Minimum viable sleep protection.' },
            { time: '10-15 min', steps: 'Steps 1-5', desc: 'Full routine — all five steps. The evidence-backed complete evening practice.' },
            { time: '20+ min', steps: 'All + journalling', desc: 'Extended reflection, full body scan, and 4-7-8 breathing until sleep arrives.' },
          ].map(t => (
            <div key={t.time} style={{ background: 'white', borderRadius: '8px', padding: '10px', border: `1px solid ${VBORD}`, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: '700', color: VIOLET }}>{t.time}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '4px' }}>{t.steps}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Daily Mindfulness Routine FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What happens if I miss a day of my daily routine?</strong><br />
        A: Missing one day does not reset neurological progress — the brain changes that daily practice produces are durable across occasional gaps. The research risk is not the single missed day but the missed day that becomes two, then five, then a full break — where the habit formation that was producing automaticity is disrupted and the practice requires active motivation to restart. The most effective response to a missed day is the same response to mind-wandering during meditation: no judgment, no self-criticism, just return. Begin the routine the following morning as if the gap did not happen. If gaps are happening frequently, this is a design problem (the routine is too long or too demanding for current circumstances) rather than a motivation problem — simplify to the minimum viable version until consistency is re-established.</p>

        <p><strong>Q: Should I practise in the same order every day, or can I vary the routine?</strong><br />
        A: The same sequence, same timing, same anchoring cues produces automaticity most quickly because consistency of the sequence is what allows the brain to establish the habit efficiently. That said, occasional variation — a different type of morning practice, a longer evening session, an additional midday practice — does not disrupt the habit. The core sequencing (morning before any screen use, evening before sleep) should remain consistent; the specific practices within each period can be varied once the routine is established (typically after 3-4 weeks of daily consistency). In the first two weeks, consistency of sequence is more valuable than variety of practice.</p>

        <p><strong>Q: My schedule varies significantly day to day — how do I maintain consistency?</strong><br />
        A: Variable schedules require anchor-based rather than time-based routine design. Instead of "I practise at 7am," the anchor is "I practise immediately after waking, before any phone use" — which remains consistent regardless of what time waking occurs. The evening anchor is "I practise immediately after changing into sleep clothes" rather than "I practise at 9:30pm." Behaviour-anchored practices survive schedule variation in ways that time-anchored practices do not. The minimum viable routine (three physiological sighs before phone use, body scan and 4-7-8 breathing before sleep) is achievable on any schedule because it requires only the transitions that already occur on every day regardless of the day's structure.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: VIOLET, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "A daily mindfulness routine is not something you add to your life. It is something you design into the structure your life already has."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Planner above to build your personalised version. Start tomorrow morning: phone down, three physiological sighs, five minutes of breath awareness. That is enough to begin. The rest builds from there, one day at a time, until the routine becomes the day.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: VIOLET, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${VBORD}` }}
          >
            Begin Today in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: VIOLET, border: `2px solid ${VIOLET}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Routine
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-techniques-beginners', '→ Mindfulness Techniques for Beginners (Student Guide)'],
            ['/blog/mindfulness-focus-concentration',  '→ Why Mindfulness Improves Focus and Concentration'],
            ['/blog/guided-meditation-students',       '→ Guided Meditation for Students: Beginner\'s Guide'],
            ['/blog/mindfulness-reduce-anxiety',       '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/develop-inner-peace',              '→ How to Develop Inner Peace in a Busy Life'],
            ['/blog/benefits-of-mindfulness',          '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: VIOLET, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
