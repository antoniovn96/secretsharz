import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Practice Mindfulness Daily for Better Mental Health",
  excerpt: "A daily mindfulness practice does not require an hour of silence or a special space. It requires three things: a consistent time, a simple method, and the willingness to begin with five minutes. This guide gives you the morning and evening routines, the beginner exercises, and the step-by-step structure to build a practice that actually stays.",
  category: "Mental Health",
  date: "02-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/daily-mindfulness-practice.jpg",
  tldr: "Building a daily mindfulness practice is less about finding the perfect technique and more about building the consistent habit of returning to the present moment — briefly, regularly, and without judgment. This guide covers the science of habit formation for mindfulness, morning and evening routine structures, seven beginner-friendly exercises with step-by-step instructions, and an interactive Mindfulness Routine Builder that generates your personalised daily practice plan.",
  toc: [
    { id: "why-daily",    title: "1. Why Daily Practice Matters More Than Perfect Practice",          level: 3 },
    { id: "morning",      title: "2. The Morning Mindfulness Routine — Step by Step",                 level: 3 },
    { id: "builder",      title: "3. Interactive: The Mindfulness Routine Builder",                   level: 3 },
    { id: "exercises",    title: "4. Seven Beginner-Friendly Mindfulness Exercises",                  level: 3 },
    { id: "evening",      title: "5. The Evening Mindfulness Routine — Step by Step",                level: 3 },
    { id: "faq",          title: "6. Daily Mindfulness Practice FAQs",                               level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-02T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "daily mindfulness practice, how to practice mindfulness daily, mindfulness routine, morning mindfulness routine, evening mindfulness routine, beginner mindfulness exercises, mindfulness mental health",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I start a daily mindfulness practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with the smallest version possible: one five-minute session at a consistent time each day, attached to an existing daily behaviour (immediately after waking, immediately after breakfast, or just before bed). The anchor habit is more important than the duration — consistency at five minutes produces better neurological benefits than irregular practice at thirty minutes. Choose one simple technique (breath awareness is the most reliable starting point), commit to it daily for two weeks before adding any complexity, and treat missed days as data rather than failure.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best time of day to practise mindfulness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best time is the time you will actually consistently do it. Research shows that morning practice (before the cognitive demands of the day begin) tends to produce better consistency and sets a calmer tone for the hours that follow. Evening practice produces better sleep quality and emotional processing of the day's events. Both have distinct benefits. For beginners, choosing one time and protecting it for three weeks before considering a second session produces better long-term practice establishment than trying to practise at multiple times simultaneously.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the easiest mindfulness exercises for beginners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The five most accessible mindfulness exercises for beginners are: breath awareness (following the physical sensation of breathing for 3-5 minutes), 5-4-3-2-1 sensory grounding (naming five things seen, four felt, three heard, two smelled, one tasted), mindful walking (paying deliberate attention to the physical sensations of each step), body scan (moving attention slowly through each part of the body), and mindful eating (one meal or snack per day eaten without screens or other activities). All five can be done in under five minutes and require no equipment.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const INDIGO4  = '#3A4D8A';
const IPALE4   = '#EEF1FB';
const IBORD4   = 'rgba(58,77,138,0.22)';

// ── Routine Builder Data ───────────────────────────────────────────────────────
const AVAILABLE_TIME = [
  { key: 't5',   label: '5 minutes/day',        value: 5,  sessions: 1 },
  { key: 't10',  label: '10 minutes/day',        value: 10, sessions: 1 },
  { key: 't15',  label: '15–20 minutes/day',     value: 17, sessions: 2 },
  { key: 't30',  label: '30+ minutes/day',       value: 30, sessions: 2 },
];

const PREFERRED_TIME = [
  { key: 'morning',  icon: '🌅', label: 'Morning — before the day starts',     desc: 'Builds a calm foundation for the day' },
  { key: 'midday',   icon: '☀️', label: 'Midday — as a reset between sessions',desc: 'Breaks the stress accumulation cycle' },
  { key: 'evening',  icon: '🌙', label: 'Evening — to wind down',              desc: 'Improves sleep and processes the day' },
  { key: 'flexible', icon: '🔄', label: 'Flexible — whenever I can',           desc: 'Adapt to each day' },
];

const MAIN_GOAL = [
  { key: 'anxiety',   icon: '💚', label: 'Reduce anxiety and exam stress' },
  { key: 'focus',     icon: '🎯', label: 'Improve focus and concentration' },
  { key: 'sleep',     icon: '😴', label: 'Better sleep and evening wind-down' },
  { key: 'emotions',  icon: '💛', label: 'Emotional regulation and balance' },
  { key: 'general',   icon: '🌱', label: 'General wellbeing and presence' },
];

const BIGGEST_BARRIER = [
  { key: 'time',       label: '"I do not have time"' },
  { key: 'restless',   label: '"I cannot sit still or quiet my mind"' },
  { key: 'forget',     label: '"I forget to do it"' },
  { key: 'unsure',     label: '"I do not know if I am doing it right"' },
  { key: 'boring',     label: '"I find it boring or nothing seems to happen"' },
];

const ROUTINE_PLANS = {
  morning: {
    anxiety: {
      routine: [
        { step: '1', icon: '💧', title: 'Wake without phone (2 min)', text: 'Before touching your phone, take three slow breaths. Notice the quality of the morning light, the temperature of the air, the sounds nearby. Give yourself these two minutes entirely in the present moment before the day\'s demands begin.' },
        { step: '2', icon: '🧘', title: 'Seated breath awareness (3–5 min)', text: 'Sit upright — on a chair, on your bed, anywhere comfortable. Follow your breath for 3–5 minutes. When anxiety thoughts arrive, note them as "planning" or "worrying" and return your attention to the breath. Each return is the practice.' },
        { step: '3', icon: '✍️', title: 'One grounding intention (1 min)', text: 'Write one sentence: "Today I want to bring my attention to ___." This is not a task — it is a quality of presence you intend to carry. Examples: "noticing when I am tense." "Being present in conversations." "Pausing before reacting."' },
      ],
      barrier_note: 'For anxiety: the morning practice specifically addresses anticipatory anxiety — the worry about the day before it has happened. Each morning breath practice creates a window between waking and worry-activation that, over weeks, gradually expands.',
    },
    focus: {
      routine: [
        { step: '1', icon: '💧', title: 'Phone-free first 10 minutes (2 min)', text: 'The first input of the day sets the cognitive tone for the following hour. Begin with sensory awareness rather than information: light, sound, physical sensation. The brain\'s default mode network is most active in the first minutes after waking — give it something present to attend to.' },
        { step: '2', icon: '🔦', title: 'Single-focus breath with object (5 min)', text: 'Choose one physical object in your environment. For five minutes, alternate: 30 seconds of focused breath awareness, then 30 seconds of focused observation of the object. The alternation trains attentional flexibility — the capacity to direct focus deliberately rather than having it captured automatically.' },
        { step: '3', icon: '📋', title: 'Mindful task setting (2 min)', text: 'Write today\'s one most important task. Hold it in mind for 30 seconds. Notice how it feels in the body — the slight energising or slight resistance it produces. This mindful engagement with the day\'s priority builds the intentional relationship with tasks that sustained focus requires.' },
      ],
      barrier_note: 'For focus: mindfulness specifically trains the attentional recovery network — the capacity to notice distraction and return to the task. The morning practice builds the version of this capacity that study sessions then use.',
    },
    sleep: {
      routine: [
        { step: '1', icon: '☀️', title: 'Morning light and movement (3 min)', text: 'Step outside or stand by a window in natural light for two to three minutes. The morning cortisol peak combined with natural light exposure sets the circadian rhythm that governs your sleep-wake cycle. This is both a mindfulness practice (sensory present-moment awareness) and a direct sleep quality intervention.' },
        { step: '2', icon: '🧘', title: 'Body check-in (3 min)', text: 'Before studying or eating: slowly scan from head to feet, noticing how each area of your body feels. Not to change anything — just to notice. Students who do this practice develop better awareness of fatigue and tension accumulation, allowing earlier intervention before exhaustion or burnout.' },
        { step: '3', icon: '📝', title: 'Yesterday release (2 min)', text: 'Write one sentence about anything from yesterday that is still "open" in your mind — unresolved, replayed, or carrying weight. Then write: "I notice I am still holding this. I can let it be for now." The externalisation begins the processing that sleep will complete.' },
      ],
      barrier_note: 'For sleep: the morning practice improves sleep quality indirectly — by establishing the circadian anchor (light, movement) and beginning the daily cycle of emotional processing that reduces the cognitive load carried into the night.',
    },
    emotions: {
      routine: [
        { step: '1', icon: '💛', title: 'Morning emotion check (2 min)', text: 'Before any other activity, ask: "What am I feeling right now?" Not what you think you should feel — what is actually present. Name it specifically. "Anxious about the presentation." "Slightly flat." "Surprisingly calm." The naming is the first act of emotional regulation.' },
        { step: '2', icon: '🌊', title: 'Allow without fixing (3 min)', text: 'With the named emotion in mind, spend three minutes simply letting it be present without trying to change, explain, or fix it. Breathe slowly. This is the practice of non-reactivity — the ability to experience an emotion without immediately acting on it or suppressing it.' },
        { step: '3', icon: '🌱', title: 'Self-compassion phrase (1 min)', text: 'Say or write: "This is a moment of difficulty. Difficulty is part of every student\'s life. May I be kind to myself in this moment." This three-part self-compassion practice (acknowledge the difficulty, recognise shared humanity, offer kindness) takes sixty seconds and directly reduces cortisol activation.' },
      ],
      barrier_note: 'For emotional regulation: the morning emotional check is the most direct available intervention for emotional reactivity — not because it solves the difficulty but because naming it and allowing it prevents the accumulation that produces the disproportionate emotional responses of high-pressure periods.',
    },
    general: {
      routine: [
        { step: '1', icon: '💧', title: 'Three conscious breaths (1 min)', text: 'Before anything else: three slow, deliberate breaths. In for four counts, out for six. This is the minimum viable morning mindfulness practice. Even when time is genuinely limited, these three breaths done every morning produce measurable benefits over four weeks.' },
        { step: '2', icon: '🌅', title: 'One-minute sensory arrival (1 min)', text: 'Name five things you can see from where you are. Feel the ground under your feet. Notice the temperature. Hear the sounds of your environment. You are here — this is the whole practice, briefly.' },
        { step: '3', icon: '✨', title: 'One intention for today (1 min)', text: 'Set one quality you want to bring to the day: "presence," "patience," "genuine attention to what matters." Not a to-do list — a way of being. Return to it once during the day, briefly, to notice whether it is present.' },
      ],
      barrier_note: 'For general wellbeing: even three minutes done consistently produces more benefit than thirty minutes done irregularly. Start here. Add more when this feels natural rather than forced.',
    },
  },
  evening: {
    anxiety: {
      routine: [
        { step: '1', icon: '📝', title: 'Worry download (3 min)', text: 'Write every worry and unresolved concern from the day in one paragraph — quickly, uncensored, everything. Then close the notebook. The worries have been acknowledged and stored externally; the brain can release the active holding that would otherwise continue through the night.' },
        { step: '2', icon: '🌊', title: '4-7-8 breathing (3 min)', text: 'In for 4 counts, hold for 7, out for 8. Four rounds. This pattern maximally activates the vagus nerve and produces the deepest available breath-based cortisol reduction. Done lying down in the dark, it is the most effective natural pre-sleep anxiety management practice available.' },
        { step: '3', icon: '💛', title: 'Three things that were okay (2 min)', text: 'Write three specific things that were okay today — not aspirationally positive, genuinely okay. "The lecture was interesting." "I got outside for 10 minutes." "The chai was good." The specificity matters — it trains the brain to attend to positive evidence with the same precision it naturally attends to negative.' },
      ],
      barrier_note: 'The worry download is the single most evidence-backed pre-sleep anxiety intervention — externalising the content removes the brain\'s need to hold it actively. Do this one thing if nothing else.',
    },
    focus: {
      routine: [
        { step: '1', icon: '📋', title: 'Study session closure (2 min)', text: 'Write: what did I actually cover today? What specifically did I understand that I did not before? What will I begin with tomorrow? This review simultaneously consolidates today\'s learning through active recall and pre-loads tomorrow\'s focus so morning decisions are already made.' },
        { step: '2', icon: '📵', title: 'Phone-free wind-down (15 min minimum)', text: 'The 60 minutes before bed are the most important window for melatonin production. All screens off — or at minimum, all notifications. Replace with any low-demand, non-digital activity: reading on paper, gentle movement, conversation. The focus capacity of the following morning is partly determined by this window.' },
        { step: '3', icon: '😮‍💨', title: 'Body tension release (3 min)', text: 'Progressive muscle relaxation from feet to face — tense each group for five seconds, release fully. Extended study sessions accumulate muscular tension that persists into sleep. The physical release is simultaneously a signal to the nervous system that the study day has ended.' },
      ],
      barrier_note: 'The pre-sleep routine directly determines tomorrow morning\'s focus quality. The most effective investment in tomorrow\'s productivity is tonight\'s wind-down.',
    },
    sleep: {
      routine: [
        { step: '1', icon: '🛏️', title: 'Consistent wind-down sequence (5 min)', text: 'A consistent pre-sleep sequence trains the brain to associate the sequence with sleep onset. Choose three activities you will always do in the same order: for example, shower, dim lights, read paper. The consistency is more important than the specific activities.' },
        { step: '2', icon: '💆', title: 'Full body scan (5 min)', text: 'Lying in bed, slowly move attention from the top of your head to the tips of your toes. At each area, notice what is present — tension, warmth, discomfort — and consciously soften it. This is the most effective available non-pharmaceutical sleep onset practice, consistently outperforming passive rest in controlled trials.' },
        { step: '3', icon: '😴', title: '4-7-8 breathing until sleep (as needed)', text: 'In for 4, hold for 7, out for 8. Repeat until sleep arrives. If thoughts intrude, return to the pattern without judgment. The pattern occupies the mind with enough cognitive demand to prevent worry thought while being gentle enough not to increase arousal.' },
      ],
      barrier_note: 'Sleep mindfulness practice is the highest-return single daily investment for student wellbeing — it directly improves next-day cognitive performance, emotional regulation, and physical health simultaneously.',
    },
    emotions: {
      routine: [
        { step: '1', icon: '🪞', title: 'Day review with compassion (3 min)', text: 'Review the day from beginning to end — not to evaluate performance but to acknowledge the full emotional experience. Where was it hard? Where was it surprisingly okay? Where did you respond in a way you are proud of, and where would you do something differently? The review without verdict is the practice.' },
        { step: '2', icon: '💬', title: 'One appreciation (1 min)', text: 'Name one person, moment, or aspect of today that you genuinely appreciate. Not to manufacture positivity — to attend accurately to what was present and good alongside what was difficult. Both were real; the negativity bias makes the good harder to access without deliberate attention.' },
        { step: '3', icon: '🌊', title: 'Release phrase (1 min)', text: 'Say or write: "I did what I could with what I had today. That is enough." Then close the day. The deliberate closure — the permission to stop processing — is what allows the nervous system to shift from active daytime mode to the restorative mode that sleep requires.' },
      ],
      barrier_note: 'Evening emotional practice is specifically for preventing the emotional accumulation that produces the exhausted irritability and tearfulness of sustained academic pressure. Five minutes of processing prevents five hours of overflow.',
    },
    general: {
      routine: [
        { step: '1', icon: '🌙', title: 'Gratitude note (2 min)', text: 'Write three specific things from today. Not aspirationally positive — genuinely specific. Research by Emmons and McCullough at UC Davis shows this simple practice produces significant wellbeing improvements after two weeks of consistent daily implementation.' },
        { step: '2', icon: '😮‍💨', title: 'Three slow breaths (1 min)', text: 'Extended exhale: in for 4, out for 8. Three times. The parasympathetic activation of the extended exhale is the quickest available transition from daytime activation to sleep-ready calm.' },
        { step: '3', icon: '📵', title: 'Phone away by 9:30pm (0 min practice)', text: 'The most impactful evening mindfulness habit for most students is also the simplest: phone in a different room before 10pm. This single structural change improves melatonin production, sleep quality, and morning mood more than any five-minute practice can fully compensate for.' },
      ],
      barrier_note: 'If you can only do one thing from any evening routine: phone in a different room at a consistent time. Everything else is valuable; this is the foundation.',
    },
  },
  midday: {
    anxiety: {
      routine: [
        { step: '1', icon: '😮‍💨', title: 'Three physiological sighs (30 sec)', text: 'Double inhale through the nose, long exhale through the mouth. Three times. The fastest available cortisol reset — works within 30 seconds and is invisible in a study hall or classroom.' },
        { step: '2', icon: '👣', title: '5-minute mindful walk (5 min)', text: 'Walk slowly, attending to the physical sensation of each step — the foot lifting, moving, landing. When the mind returns to academic anxiety (it will), gently note "thinking" and return to the sensation of walking. This is walking meditation — and the nature exposure bonus (if outdoors) adds attentional restoration.' },
        { step: '3', icon: '🍽️', title: 'Mindful eating (one meal or snack)', text: 'Eat without screens for one meal or snack. Attend to taste, texture, temperature, and the physical sensation of hunger and satiety. This single daily practice, consistently implemented, is measurably restorative for both stress levels and the sense of genuine presence in daily life.' },
      ],
      barrier_note: 'Midday anxiety management is most effective as interruption of the accumulation cycle — before the afternoon peak rather than after.',
    },
    focus: {
      routine: [
        { step: '1', icon: '⏱️', title: 'Focus reset between sessions (3 min)', text: 'Between study sessions: stand, stretch, walk briefly. Then sit and take three slow breaths before the next session begins. The physical movement clears the adenosine accumulation from the previous session; the three breaths reset attentional tone. This transition ritual maintains the quality of successive sessions.' },
        { step: '2', icon: '🔦', title: 'Single-task check (1 min)', text: 'Before starting the new session, close all unnecessary tabs and write the single task for this session on a sticky note. The physical act of writing and the visible task specification maintain single-task focus through the session.' },
        { step: '3', icon: '💧', title: 'Hydration and sensory reset (1 min)', text: 'Drink water mindfully — attending to the physical sensation of drinking, the temperature, the relief if you were thirsty. Even 60 seconds of genuine sensory attention during the transition resets the diffuse, unfocused cognitive state that emerges between sessions.' },
      ],
      barrier_note: 'The between-session reset is more important than the within-session practice — it maintains the quality of each successive session rather than managing a declining quality curve.',
    },
    sleep: {
      routine: [
        { step: '1', icon: '🌤️', title: 'Post-lunch walk (10 min)', text: 'A 10-minute walk after lunch serves double duty: the physical movement prevents the post-lunch cognitive dip (which disrupts afternoon study quality) and the natural light exposure advances the circadian signal that improves evening sleep onset. This is the highest-return midday investment for sleep quality.' },
        { step: '2', icon: '⏱️', title: 'Strategic nap if genuinely needed (20 min max)', text: 'If genuine daytime fatigue is present, a 20-minute nap before 2pm restores alertness more effectively than caffeine. Set a timer — naps beyond 20 minutes enter deeper sleep stages, producing grogginess and disrupting evening sleep quality.' },
      ],
      barrier_note: 'The midday walk is the single most impactful daytime habit for improving nighttime sleep quality — more than any evening supplement or technique.',
    },
    emotions: {
      routine: [
        { step: '1', icon: '🪟', title: 'Midday emotional check-in (2 min)', text: 'Pause and ask: "What am I feeling right now?" Name it. Notice where it lives in the body. This midday check prevents the emotional accumulation that produces the afternoon exhaustion many students experience — not from cognitive work but from hours of unprocessed emotional content.' },
        { step: '2', icon: '💬', title: 'One genuine connection (5 min)', text: 'A brief, genuine conversation with one person — about anything except academic performance. The social connection buffer against stress hormones is the most potent natural cortisol-reduction mechanism available, and it works in as little as five minutes of genuine exchange.' },
      ],
      barrier_note: 'The midday connection practice is not a distraction from study — it is the cortisol reduction that makes the afternoon study session neurochemically possible.',
    },
    general: {
      routine: [
        { step: '1', icon: '😮‍💨', title: 'Mindful minute (1 min)', text: 'Set a phone timer for one minute. Follow your breath. When the mind wanders, return. This is the complete practice, briefly. One minute of genuine present-moment attention in the middle of the day interrupts the accumulation of stress that otherwise builds continuously from morning to evening.' },
        { step: '2', icon: '🌤️', title: 'Brief outdoor exposure (5 min)', text: 'Step outside for five minutes — no phone, no planning. Notice what the outside world looks, sounds, and feels like. Nature exposure specifically restores directed attention capacity (Berman et al., Michigan). Five minutes is enough to produce measurable restoration.' },
      ],
      barrier_note: 'If only one midday practice: the mindful minute. Every day. It takes 60 seconds, requires no space or equipment, and directly interrupts the stress accumulation cycle at its midpoint.',
    },
    flexible: {
      anxiety: { routine: [], barrier_note: '' },
      focus:   { routine: [], barrier_note: '' },
      sleep:   { routine: [], barrier_note: '' },
      emotions:{ routine: [], barrier_note: '' },
      general: { routine: [], barrier_note: '' },
    },
  },
};

// Fill flexible with morning versions as default
Object.keys(ROUTINE_PLANS.morning).forEach(goal => {
  ROUTINE_PLANS.flexible = ROUTINE_PLANS.flexible || {};
  ROUTINE_PLANS.flexible[goal] = {
    routine: [
      { step: '1', icon: '😮‍💨', title: 'Three conscious breaths (1 min)', text: 'Wherever you are, pause and take three slow deliberate breaths — in for four, out for six. This is your anchor practice for any moment in the day. It works immediately, requires no preparation, and produces direct cortisol reduction regardless of context.' },
      { step: '2', icon: '👁️', title: 'Sensory grounding — 5 things (2 min)', text: 'Name five things you can see, four you can feel, three you can hear. This brings attention fully into the present moment and interrupts the rumination or anxiety that may have been building. Use it before any high-stakes interaction, at any point during a study session, or whenever the mind is pulling strongly toward worry.' },
      { step: '3', icon: '✍️', title: 'One honest check-in (1 min)', text: 'Write one sentence: "Right now I feel ___." Name the emotion specifically. This 60-second practice is the minimal viable emotional mindfulness intervention — and research shows it directly reduces amygdala activation within the act of labelling itself.' },
    ],
    barrier_note: 'For a flexible practice, the anchor is the three-breath technique — practised in any moment, any context, without preparation. Build this one habit and everything else becomes easier to add.',
  };
});

const BARRIER_RESPONSES = {
  time:      { title: '"I do not have time"', response: 'The minimum viable daily practice is three breaths — 30 seconds. Everything in this guide can be done in 5 minutes. The question is not whether there are five minutes available; it is whether five minutes is enough to justify the effort of starting. The research answer is yes — measurably, consistently yes. Start with three breaths. Do it for two weeks. Then assess whether the time investment is worth the return.' },
  restless:  { title: '"I cannot sit still or quiet my mind"', response: 'The goal of mindfulness is not a quiet mind — it is the practice of noticing what is in your mind and returning attention to the present when it has wandered. A busy, restless mind is not a sign that mindfulness is not working; it is the condition that makes the practice necessary. Walking mindfulness (attending to the physical sensations of walking) is specifically suited to restless minds — the movement satisfies the physical restlessness while the attention practice continues.' },
  forget:    { title: '"I forget to do it"', response: 'Forgetting is a habit design problem, not a motivation problem. Attach the practice to an existing daily behaviour that happens without decision: immediately after brushing teeth in the morning, immediately after eating lunch, immediately when you sit at your study desk. The existing behaviour is the cue that triggers the practice automatically. A physical reminder (a specific object on the desk, a phone notification that says "three breaths") supports the habit until it becomes automatic.' },
  unsure:    { title: '"I do not know if I am doing it right"', response: 'There is almost no way to do mindfulness wrong. If you are noticing what is in your present-moment experience — however briefly, however imperfectly — you are practising mindfulness. The mind will wander. That is expected. You will feel nothing special. That is normal. The practice is the noticing and returning, not the achievement of a particular state. The question "am I doing this right?" is itself a thought you can notice and gently set aside.' },
  boring:    { title: '"I find it boring or nothing seems to happen"', response: 'Boredom during mindfulness practice is itself an interesting observation — "I notice I am feeling bored right now" is the practice in action. The expectation that something should happen is one of the most common barriers to practice: mindfulness produces effects gradually and across time, not in any single session. The effects — improved focus, reduced anxiety, better sleep — are visible in your daily life over two to four weeks of practice, not in the five minutes of the practice itself.' },
};

// ── Timed Exercise Component ───────────────────────────────────────────────────
function TimedExercise({ title, duration, instruction, color, onClose }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(intRef.current); setRunning(false); setDone(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  const circ = 2 * Math.PI * 38;
  const pct  = ((duration - timeLeft) / duration) * 100;

  return (
    <div style={{ background: `${color}08`, borderRadius: '12px', padding: '16px', border: `1.5px solid ${color}30`, fontFamily: font }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color }}>{title}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>×</button>
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{instruction}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
          <svg width="84" height="84" viewBox="0 0 84 84" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="42" cy="42" r="38" fill="none" stroke={`${color}20`} strokeWidth="6" />
            <circle cx="42" cy="42" r="38" fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={running || done ? circ * (timeLeft / duration) : circ}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            {done
              ? <div style={{ fontSize: '22px' }}>✓</div>
              : <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color, lineHeight: 1 }}>{timeLeft}</div>
            }
          </div>
        </div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {!running && !done && <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: color, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Start</button>}
          {running && <button onClick={() => { setRunning(false); clearInterval(intRef.current); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>}
          {!running && timeLeft < duration && !done && <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: color, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>}
          {done && <button onClick={() => { setTimeLeft(duration); setDone(false); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#2D7D46', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Repeat</button>}
        </div>
      </div>
    </div>
  );
}

// ── Routine Builder ────────────────────────────────────────────────────────────
function MindfulnessRoutineBuilder() {
  const [step,      setStep]      = useState(1);
  const [timeKey,   setTimeKey]   = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [goal,      setGoal]      = useState(null);
  const [barrier,   setBarrier]   = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openStep,  setOpenStep]  = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selTime  = AVAILABLE_TIME.find(t => t.key === timeKey);
  const selTod   = PREFERRED_TIME.find(t => t.key === timeOfDay);
  const selGoal  = MAIN_GOAL.find(g => g.key === goal);
  const selBarr  = BIGGEST_BARRIER.find(b => b.key === barrier);

  const getRoutine = () => {
    if (!timeOfDay || !goal) return null;
    const tod = timeOfDay === 'flexible' ? 'flexible' : timeOfDay;
    return ROUTINE_PLANS[tod]?.[goal] || ROUTINE_PLANS.morning.general;
  };

  const routinePlan = getRoutine();
  const barrierResp = barrier ? BARRIER_RESPONSES[barrier] : null;

  const handleReset = () => { setStep(1); setTimeKey(null); setTimeOfDay(null); setGoal(null); setBarrier(null); setRevealed(false); setOpenStep(null); };

  const ChoiceBtn = ({ options, selected, onSelect, stacked = true }) => (
    <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', gap: '8px', marginBottom: '16px', flexWrap: stacked ? 'nowrap' : 'wrap' }}>
      {options.map(opt => {
        const isSel = selected === opt.key;
        return (
          <button key={opt.key} onClick={() => onSelect(opt.key)} style={{
            padding: '12px 16px', borderRadius: '11px', border: '2px solid',
            borderColor: isSel ? INDIGO4 : 'var(--border)', background: isSel ? IPALE4 : 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', flex: stacked ? 'none' : '1',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            boxShadow: isSel ? `0 0 0 2px ${IBORD4}` : 'none',
          }}>
            {opt.icon && <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{opt.icon}</span>}
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? INDIGO4 : 'var(--ink)', marginBottom: opt.desc ? '2px' : 0 }}>{opt.label}</div>
              {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );

  const NextBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} disabled={!active} style={{
      width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
      background: active ? `linear-gradient(135deg, ${INDIGO4}, #5068C0)` : 'var(--border)',
      color: 'white', fontWeight: '700', fontSize: '15px',
      cursor: active ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
      boxShadow: active ? `0 6px 18px ${IBORD4}` : 'none',
    }}>{label}</button>
  );

  const BackBtn = ({ onClick }) => (
    <button onClick={onClick} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? INDIGO4 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — How much time can you realistically give to mindfulness each day?</p>
          <ChoiceBtn options={AVAILABLE_TIME} selected={timeKey} onSelect={setTimeKey} />
          <NextBtn active={!!timeKey} onClick={() => { if (timeKey) setStep(2); }} label="Next →" />
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — When would you like to practise?</p>
          <ChoiceBtn options={PREFERRED_TIME} selected={timeOfDay} onSelect={setTimeOfDay} />
          <div style={{ display: 'flex', gap: '10px' }}><BackBtn onClick={() => setStep(1)} /><button onClick={() => { if (timeOfDay) setStep(3); }} disabled={!timeOfDay} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: timeOfDay ? `linear-gradient(135deg, ${INDIGO4}, #5068C0)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: timeOfDay ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button></div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — What is your main goal for practising mindfulness?</p>
          <ChoiceBtn options={MAIN_GOAL} selected={goal} onSelect={setGoal} />
          <div style={{ display: 'flex', gap: '10px' }}><BackBtn onClick={() => setStep(2)} /><button onClick={() => { if (goal) setStep(4); }} disabled={!goal} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: goal ? `linear-gradient(135deg, ${INDIGO4}, #5068C0)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: goal ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button></div>
        </>
      )}

      {step === 4 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 4 — What has stopped you from practising before?</p>
          <ChoiceBtn options={BIGGEST_BARRIER} selected={barrier} onSelect={setBarrier} />
          <div style={{ display: 'flex', gap: '10px' }}><BackBtn onClick={() => setStep(3)} /><button onClick={() => { if (barrier) { setStep(5); setRevealed(false); } }} disabled={!barrier} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: barrier ? `linear-gradient(135deg, ${INDIGO4}, #5068C0)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: barrier ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Routine →</button></div>
        </>
      )}

      {step === 5 && routinePlan && selGoal && selTod && selTime && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Daily Mindfulness Routine</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${INDIGO4}, #5068C0)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${IBORD4}` }}>🧘 Generate My Routine</button>
              <button onClick={() => setStep(4)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${INDIGO4}, #5068C0)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{selTod.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your {selTod.label.split(' — ')[0]} Practice</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{selTime.label} · Goal: {selGoal.label}</div>
              </div>

              {/* Routine steps */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: INDIGO4, marginBottom: '9px' }}>🧘 Your Daily Steps</div>
                {(routinePlan.routine || []).map((s, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${IBORD4}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${INDIGO4}, #5068C0)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: INDIGO4 }}>{s.title}</div>
                        </div>
                        <span style={{ color: INDIGO4, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{s.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Barrier response */}
              {barrierResp && (
                <div style={{ background: IPALE4, border: `2px solid ${IBORD4}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', borderLeft: `4px solid ${INDIGO4}` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: INDIGO4, marginBottom: '5px' }}>🔑 Your Barrier: {barrierResp.title}</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{barrierResp.response}</p>
                </div>
              )}

              {/* Barrier note */}
              {routinePlan.barrier_note && (
                <div style={{ background: 'white', border: `1.5px solid ${IBORD4}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: INDIGO4, marginBottom: '4px' }}>💡 For Your Goal</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{routinePlan.barrier_note}</p>
                </div>
              )}

              {/* Affirmation */}
              <div style={{ background: IPALE4, border: `1.5px dashed ${IBORD4}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: INDIGO4, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "Five minutes daily for two weeks. After that, you will not need to be convinced — you will know."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${IBORD4}`, color: INDIGO4, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different routine</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Seven exercises data ───────────────────────────────────────────────────────
const EXERCISES = [
  { id: 'breath',   icon: '💨', title: 'Breath Awareness',        color: '#1A7272', seconds: 180, instruction: 'Sit comfortably. Follow the physical sensation of your breath — the air at the nostrils, the rise and fall of the chest or belly. When attention wanders, gently return it. No judgment. This is the foundational mindfulness practice.' },
  { id: 'senses',   icon: '👁️', title: '5-4-3-2-1 Grounding',     color: '#2D5A8A', seconds: 120, instruction: 'Name five things you can see. Four you can physically feel. Three sounds. Two things you can smell. One thing you can taste. Speak each one quietly — the naming anchors you in the sensory present moment.' },
  { id: 'body',     icon: '🧘', title: 'Body Scan',                color: '#5B3A8B', seconds: 300, instruction: 'Starting at the crown of your head, slowly move attention downward through your body. At each area, simply notice what is present — tension, warmth, sensation or numbness — without trying to change it. Arrive at the feet. You have arrived in your body.' },
  { id: 'walking',  icon: '👣', title: 'Mindful Walking',          color: '#2D6B45', seconds: 120, instruction: 'Walk slowly, attending to the physical sensation of each step — foot lifting, moving, landing. When the mind wanders to planning or worry, gently return to the sensation of the next step. The destination is not the point.' },
  { id: 'eating',   icon: '🍵', title: 'Mindful Eating / Drinking', color: '#8B2635', seconds: 180, instruction: 'Take one bite or sip. Before swallowing, attend fully to taste, texture, temperature, and the sensation in your mouth. Chew slowly. Notice hunger and satiety. One meal without screens — this is a complete mindfulness practice.' },
  { id: 'loving',   icon: '💛', title: 'Loving-Kindness Phrase',   color: '#C07800', seconds: 120, instruction: 'Silently repeat: "May I be well. May I be at peace. May I be kind to myself today." Then extend to someone you care for: "May you be well. May you be at peace." Then to all students everywhere. The phrases activate the prosocial neural circuits that reduce threat activation.' },
  { id: 'observe',  icon: '🌊', title: 'Thought Observation',      color: '#3A4D8A', seconds: 180, instruction: 'Sit and allow thoughts to arise naturally. Rather than engaging with each thought, imagine sitting beside a river watching leaves (thoughts) float past. Name each as it appears: "planning," "worrying," "remembering." You are the one watching — not the thought.' },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DailyMindfulnessPractice({ navigate, relatedPosts }) {
  const [activeExercise, setActiveExercise] = useState(null);
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
      <p>The gap between knowing about mindfulness and actually practising it daily is one of the most common ones in student mental health. The research is persuasive. The concept makes sense. And then life gets busy, the study pressure builds, and the practice — which requires the specific protected space and the deliberate daily commitment — quietly disappears.</p>

      <p>Building a <strong>daily mindfulness practice</strong> that actually stays is not about having more willpower or more time. It is about designing the practice to fit the life you actually have rather than the life you think you should have. This guide is that design process — step by step, for morning, for evening, and for the moments in between.</p>

      <img
        src={meta.imgUrl}
        alt="Student building a daily mindfulness practice — morning and evening routines, beginner exercises, and consistent daily habits for mental health"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-daily">1. Why Daily Practice Matters More Than Perfect Practice</h3>
      <p>Research by Phillippa Lally at University College London on habit formation shows that the consistency of a behaviour — its daily repetition in a consistent context — is the primary variable in building automaticity. The behaviour does not have to be perfect, long, or deeply effective in any given session; it has to happen reliably enough for the neural pathway to become strengthened through repetition.</p>
      <p>Applied to mindfulness: five minutes of breath awareness every morning for six weeks produces more measurable neurological benefit than two 45-minute sessions per week over the same period — not because five minutes is more effective per session, but because the daily repetition creates the structural neural changes (increased grey matter density, improved amygdala-prefrontal connectivity) that longer but irregular sessions do not consistently produce. The neuroscience of habit formation and the neuroscience of mindfulness effects point to the same conclusion: daily consistency is the mechanism, not duration.</p>
      <p>The practical implication: build the smallest possible daily practice first. Three conscious breaths every morning before picking up your phone. A two-minute body check-in at the beginning of each study session. One mindful meal per day. These micro-practices, consistently repeated, produce the foundational neural changes on which more substantial practice can later be built — and they are executable regardless of how busy, anxious, or sleep-deprived the day is.</p>

      {/* ── Section 2 ── */}
      <h3 id="morning">2. The Morning Mindfulness Routine — Step by Step</h3>
      <p><strong>Why morning matters.</strong> The first 30 minutes after waking set the cognitive and emotional tone for the following two to three hours. The default modern morning begins with immediate phone use — which activates the comparison, news, and notification systems before any internal orientation has occurred, producing an anxious, reactive state that takes most of the morning to moderate. A brief morning mindfulness practice replaces this automatic anxiety-activation with a deliberate present-moment orientation, producing a measurably calmer and more focused entry to the day's work.</p>

      <p><strong>The complete 10-minute morning routine:</strong></p>
      <p><strong>Step 1 — No phone for 10 minutes (0 minutes of practice time).</strong> The first instruction of the morning routine costs no extra time — it is about what you do not do rather than what you do. Give yourself the first ten minutes of the day without any external information input: no news, no messages, no social media. In those ten minutes, your mind is at its most receptive to the quality of its own experience; external information immediately redirects that attention outward before any internal orientation is possible.</p>
      <p><strong>Step 2 — Three conscious breaths (1 minute).</strong> Before leaving bed or immediately on sitting up: in for four counts, out for six. Three times. This is the minimum viable morning mindfulness practice. If everything else in this routine is skipped, these three breaths done daily produce measurable benefits. They are the anchor — the non-negotiable that keeps the practice alive when time is genuinely limited.</p>
      <p><strong>Step 3 — Sensory arrival (2 minutes).</strong> Before engaging with any task: name what you can see, hear, and feel in this specific moment and place. The quality of the light, the temperature of the air, the sounds of your immediate environment. You are in this specific room, on this specific morning, and nowhere else — this brief sensory inventory confirms that and gently challenges the mind's default tendency to already be in the future.</p>
      <p><strong>Step 4 — Seated breath awareness (5 minutes).</strong> Sit upright — not rigidly, comfortably. Set a timer for five minutes. Follow the physical sensation of breathing. When the mind wanders (it will, repeatedly, especially in the morning when the day's concerns are most immediately present), gently return attention to the breath without self-criticism. Each return is a repetition of the practice — the wandering is expected and is the condition that makes the return possible.</p>
      <p><strong>Step 5 — One intention (2 minutes).</strong> Write or say one quality you want to bring to today: "I will notice when I am tense and breathe." "I will be genuinely present in at least one conversation." "I will take one genuine break between study sessions." This is not a to-do list item — it is a quality of attention or presence you are committing to carry through the day.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Mindfulness Routine Builder</h3>
      <p>The Builder generates a personalised daily mindfulness routine based on how much time you have, when you prefer to practise, what your main goal is, and what has stopped you from maintaining a practice before. The result includes your daily steps with full explanations, a specific response to your barrier, and a goal-calibrated practice note. Use it to build the routine you will actually follow.</p>

      <MindfulnessRoutineBuilder />

      {/* ── Section 4 ── */}
      <h3 id="exercises">4. Seven Beginner-Friendly Mindfulness Exercises</h3>
      <p>Each exercise below has a timed practice button. Choose one, read the instruction, and tap Start. You do not need to have done any mindfulness before. The exercises are ordered from simplest to slightly more advanced — beginners should start with the first two or three before adding others.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', fontFamily: font }}>
        {EXERCISES.map(ex => {
          const isActive = activeExercise === ex.id;
          const minutes  = Math.floor(ex.seconds / 60);
          return (
            <div key={ex.id}>
              <button onClick={() => setActiveExercise(isActive ? null : ex.id)} style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                borderColor: isActive ? ex.color : 'var(--border)', background: isActive ? `${ex.color}10` : 'white',
                cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{ex.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? ex.color : 'var(--ink)' }}>{ex.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{minutes} minute{minutes !== 1 ? 's' : ''} · Beginner-friendly</div>
                </div>
                <span style={{ color: isActive ? ex.color : 'var(--muted)', fontSize: '16px', flexShrink: 0 }}>{isActive ? '▲' : '▶'}</span>
              </button>
              {isActive && (
                <div style={{ marginTop: '8px', animation: 'floatUp 0.3s ease' }}>
                  <TimedExercise
                    title={ex.title}
                    duration={ex.seconds}
                    instruction={ex.instruction}
                    color={ex.color}
                    onClose={() => setActiveExercise(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 5 ── */}
      <h3 id="evening">5. The Evening Mindfulness Routine — Step by Step</h3>
      <p><strong>Why evening matters.</strong> The transition from the active demands of the day to genuine rest is one that most students never deliberately make — the day's cognitive and emotional content simply continues running until sleep interrupts it, producing the fragmented, anxiety-coloured sleep that makes the following day harder. The evening mindfulness routine creates this transition deliberately, processing the day's content, releasing the body's accumulated tension, and setting the conditions for genuinely restorative sleep.</p>

      <p><strong>The complete 15-minute evening routine:</strong></p>
      <p><strong>Step 1 — Hard study cutoff and physical transition (0 extra minutes).</strong> The evening routine begins with a structural decision made earlier: a specific time at which studying ends and the evening begins. Write this time in your planner before the day starts. When the time arrives, close all materials deliberately — this physical act of closure is the first step of the evening practice. The deliberateness signals to the nervous system that the study day has ended.</p>
      <p><strong>Step 2 — The worry download (3 minutes).</strong> Before any other wind-down activity: open a notebook and write every unresolved concern, outstanding task, and anxious thought that is present. Do not try to solve them — just transfer them from internal holding to external paper. The brain uses active working memory to hold unresolved items; the writing discharges this holding, freeing the evening's cognitive resources for genuine rest rather than ongoing worry management.</p>
      <p><strong>Step 3 — Physical tension release (5 minutes).</strong> Progressive muscle relaxation: starting at the feet, tense each muscle group for five seconds, then release completely. Move slowly upward through calves, thighs, abdomen, hands, arms, shoulders, face. This systematic release addresses the chronic muscular tension that study sessions accumulate — tension that persists into sleep and reduces its restorative quality when not deliberately addressed.</p>
      <p><strong>Step 4 — Three things that were genuinely okay (2 minutes).</strong> Write three specific things from today — not forced positivity, genuinely specific. "The explanation in the lecture finally clicked." "I managed to eat a proper lunch." "The walk home was nice." Research by Emmons and McCullough at UC Davis shows this practice, consistently maintained for two weeks, produces significant wellbeing improvements. The specificity is what makes it effective — it trains the brain to attend to positive evidence with the same precision it naturally attends to negative.</p>
      <p><strong>Step 5 — Pre-sleep breath practice (5 minutes).</strong> Lying in bed: 4-7-8 breathing (in for 4, hold for 7, out for 8) or extended exhale breathing (in for 4, out for 8). Five minutes of this, in the dark, without screens, is the most effective available natural transition to sleep onset. If the mind is still active, the body scan (slowly moving attention from head to feet, noticing and softening each area) provides an additional layer of gentle focus that typically produces sleep within minutes.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Daily Mindfulness Practice FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried mindfulness before and gave up after a week. What will be different this time?</strong><br />
        A: The most common reason mindfulness practices do not survive the first two weeks is that they were built on aspirational rather than realistic foundations: too long (an hour a day for someone who has never practised), too rigid (requiring specific conditions that daily life disrupts), or without a habit anchor (depending on motivation rather than automatic cue). Build the smallest possible version anchored to an existing daily behaviour. Three breaths after waking — that is the whole practice to begin. The two-week consistency point is where the practice begins to produce noticeable effects; most dropouts happen before that threshold.</p>

        <p><strong>Q: My mind is so busy during mindfulness that I think I am doing it wrong.</strong><br />
        A: A busy mind during mindfulness practice is not a sign of doing it wrong. It is the most common experience among both beginners and experienced practitioners — the research consistently shows that mind-wandering rates during mindfulness practice do not significantly change between beginners and experienced meditators; what changes is the speed of noticing and the gentleness of return. The practice is not producing a quiet mind. It is practising the act of noticing and returning. A busy mind gives you more opportunities to practise this — which makes the same session more training-dense, not less effective.</p>

        <p><strong>Q: How do I know if the mindfulness is helping?</strong><br />
        A: The effects of consistent daily mindfulness practice are most visible in daily life rather than in the practice itself: a slightly longer gap between a frustrating event and a reactive response; moments of noticing that you are catastrophising rather than being fully captured by the catastrophe; slightly better sleep quality; a mild reduction in the constant background hum of academic anxiety. These effects typically become noticeable after 10-14 days of daily practice and become more pronounced across 4-8 weeks. Track one specific target — "I want to notice when I start catastrophising" — and observe whether the noticing becomes more frequent over two weeks. That observation is the evidence.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: INDIGO4, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Begin with three breaths. Tomorrow, three more. After two weeks, you will know for yourself whether it is worth continuing — and the answer will almost certainly be yes."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          The most important single action from this guide is the one you take today. Not tomorrow, not when the exams are over, not when you have found the perfect routine. Three breaths, right now, with genuine attention. That is the beginning of a daily mindfulness practice.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: INDIGO4, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${IBORD4}` }}
          >
            Continue in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: INDIGO4, border: `2px solid ${INDIGO4}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Practice
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-for-students',     '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/quick-stress-relief-students', '→ 5-Minute Stress Relief Techniques for Students'],
            ['/blog/sleep-academic-performance',   '→ How Sleep Affects Academic Performance and Mental Health'],
            ['/blog/improve-focus-naturally',      '→ How to Improve Concentration and Focus Naturally'],
            ['/blog/mental-health-exams',          '→ Mental Health Tips for Students During Exams'],
            ['/safe',                              '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: INDIGO4, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
