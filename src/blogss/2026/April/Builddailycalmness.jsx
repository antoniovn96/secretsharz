import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build Calmness in Your Daily Routine",
  excerpt: "Calmness is not a personality type — it is a daily practice. The most consistently calm people are not people whose lives are easy; they are people who have built specific habits into their daily routines that regulate the nervous system before stress accumulates, reduce it when it arrives, and restore it in the evening so that tomorrow starts from a genuine resting point. This guide gives you those habits, the science behind each one, and a personalised routine builder.",
  category: "Mental Health",
  date: "26-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/daily-calmness-routine.jpg",
  tldr: "A daily calmness routine does not require extra time — it requires habits inserted into time that already exists: the morning before screens, the walk between locations, the meal that is currently eaten while scrolling, the twenty minutes before sleep. These five time windows, used with specific practices, produce cumulative nervous system regulation that makes calm the baseline rather than the exception.",
  toc: [
    { id: "what-calm",  title: "1. What Calmness Is — and How It Is Built",                           level: 3 },
    { id: "science",    title: "2. The Science of Daily Calm — Why Habits Work",                      level: 3 },
    { id: "builder",    title: "3. Interactive: The Daily Calmness Habit Builder",                   level: 3 },
    { id: "morning",    title: "4. Morning Calmness Habits",                                          level: 3 },
    { id: "midday",     title: "5. Midday Stress Reduction Techniques",                               level: 3 },
    { id: "evening",    title: "6. Evening Relaxation Practices",                                     level: 3 },
    { id: "tips",       title: "7. Ten Actionable Calmness Tips for Every Day",                      level: 3 },
    { id: "faq",        title: "8. Daily Calmness Routine FAQs",                                      level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-26T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "daily calmness routine, how to be calm every day, calming daily habits, stress reduction routine, relaxing habits students, build daily calmness, calmness practices mindfulness",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I build calmness into my daily routine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Building calmness into a daily routine requires anchoring calm-producing practices to existing daily behaviours rather than creating new time slots. The five highest-impact anchors: waking (phone-free first ten minutes + three physiological sighs, before any external demand activates the stress response); transitions between locations (mindful walking — phone away, attention on the physical experience); any one meal (phone-free, genuinely present with the food); study-to-rest transitions (three breaths + a brief open-awareness break after every 45-minute session); and the pre-sleep window (worry download + body scan, replacing the final thirty minutes of screen use). Together these five anchors require no new time — they replace existing habits at existing moments — and produce cumulative nervous system regulation that makes calm the daily baseline within two to three weeks of consistent practice.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the most relaxing habits for reducing daily stress?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most relaxing habits supported by research are: diaphragmatic breathing (particularly the extended exhale pattern — in for 4, out for 8 — which activates the vagal brake and produces parasympathetic activation within 90 seconds); regular physical movement (30 minutes of walking daily reduces cortisol more reliably than any other available lifestyle intervention, with effects lasting 2-3 hours post-exercise); consistent sleep and wake times (the circadian stability produced by consistent timing reduces daily cortisol variability and emotional reactivity); time in natural environments (even 15 minutes produces measurable cortisol reduction and attention restoration, per Berman's research); and social connection (genuine conversation — not social media — activates the ventral vagal social engagement system, producing the deepest available natural parasympathetic state). Combined consistently, these habits shift the nervous system's default from sympathetic alert to parasympathetic baseline within 3-4 weeks.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a daily calmness routine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research by Lally et al. at UCL shows habit formation takes an average of 66 days, with a range of 18-254 depending on behaviour complexity and consistency. For daily calmness practices: simple, anchored practices (three physiological sighs before picking up the phone every morning) typically become automatic within 2-3 weeks. More complex practices (evening body scan and worry download sequence) take 4-6 weeks to feel fully established. The neurological benefits — measurable reductions in baseline cortisol, improved emotional reactivity, better sleep quality — are documented after 2 weeks for some benefits and 4-8 weeks for the most durable structural changes. The key: start with the minimum viable routine (one morning and one evening practice) and add practices as each becomes established rather than attempting the complete routine from the first day.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const SAGE26  = '#7A9070';
const SPALE26 = '#EEF4EB';
const SBORD26 = 'rgba(122,144,112,0.22)';

// ── Builder Data ───────────────────────────────────────────────────────────────
const STRESS_LEVELS = [
  { key: 'high',     icon: '🔴', label: 'High — stressed most of the time', desc: 'Anxiety, tension, or overwhelm are frequent daily companions', color: '#8B2635', bg: '#FBF0F1' },
  { key: 'moderate', icon: '🟠', label: 'Moderate — some days more stressful than others', desc: 'Manageable but could be better — the stress is present regularly', color: '#C07800', bg: '#FFF8E1' },
  { key: 'mild',     icon: '🟡', label: 'Mild — generally okay, want more consistent calm', desc: 'Functioning well but lacking the stable baseline I would like', color: SAGE26, bg: SPALE26 },
  { key: 'building', icon: '🌱', label: 'Building — starting from scratch', desc: 'No current routine — I want to start simply and build gradually', color: '#2D6B45', bg: '#E8F4EE' },
];

const HARD_TIME = [
  { key: 'morning',   icon: '🌅', label: 'Morning — anxious before the day begins' },
  { key: 'studying',  icon: '📚', label: 'During study — cannot settle to focus' },
  { key: 'afternoon', icon: '☀️', label: 'Afternoon — energy and mood crash' },
  { key: 'evening',   icon: '🌙', label: 'Evening — cannot wind down or switch off' },
  { key: 'always',    icon: '⚡', label: 'All day — no reliable calm window' },
];

const TIME_AVAILABLE = [
  { key: '5min',  icon: '⚡', label: '5 minutes per day', desc: 'The absolute minimum — still produces meaningful results' },
  { key: '10min', icon: '🌿', label: '10-15 minutes', desc: 'The research-backed effective daily investment' },
  { key: '20min', icon: '🌳', label: '20+ minutes', desc: 'Optimal for significant wellbeing change' },
];

// ── Calming Practices (with timers) ───────────────────────────────────────────
const CALM_PRACTICES = {
  physio_sigh: {
    id: 'physio_sigh', icon: '😮‍💨', name: 'Physiological Sigh', color: '#1A7272', time: '45 sec', secs: 45,
    tagline: 'Fastest cortisol reset — 45 seconds',
    steps: ['Inhale slowly through the nose until 80% full', 'One sharp top-up inhale — completely full', 'Exhale fully and slowly through the mouth', 'Repeat three times total'],
    phases: [
      { name: 'First inhale',  secs: 2, note: 'Fill the lungs to about 80% through the nose' },
      { name: 'Top-up inhale', secs: 1, note: 'One sharp additional inhale — completely full' },
      { name: 'Long exhale',   secs: 6, note: 'Release completely through the mouth — slow, total, nothing held back' },
    ],
    cycles: 3,
  },
  box_breathing: {
    id: 'box_breathing', icon: '⬜', name: 'Box Breathing', color: '#2D5A8A', time: '3 min', secs: 180,
    tagline: 'Balanced calm — 3 minutes',
    steps: ['Inhale through the nose — 4 counts', 'Hold — 4 counts, body relaxed', 'Exhale through the nose or mouth — 4 counts', 'Hold empty — 4 counts', 'Repeat 4-5 cycles'],
    phases: [
      { name: 'Inhale', secs: 4, note: 'Breathe in slowly through the nose — 4 counts' },
      { name: 'Hold',   secs: 4, note: 'Hold gently — body completely relaxed' },
      { name: 'Exhale', secs: 4, note: 'Breathe out slowly — 4 counts' },
      { name: 'Hold',   secs: 4, note: 'Hold the empty breath — 4 counts' },
    ],
    cycles: 5,
  },
  open_awareness: {
    id: 'open_awareness', icon: '🌿', name: 'Open Awareness Break', color: SAGE26, time: '5 min', secs: 300,
    tagline: 'Restore directed attention — 5 minutes',
    steps: ['Close all materials and devices', 'Sit or stand comfortably', 'Expand awareness to everything: sounds, sensations, air quality', 'Nothing to focus on — just receive what is here', 'When directed thoughts arise: note "thinking" and open again'],
    phases: [
      { name: 'Expand',  secs: 60,  note: 'Let awareness widen to everything present — sounds near and far, temperature, body weight, light quality. Nothing to find, nothing to solve.' },
      { name: 'Receive', secs: 180, note: 'Stay in open receiving. Sounds. Sensations. The quality of this moment. When thinking pulls: note it and open again. This is the practice.' },
      { name: 'Return',  secs: 60,  note: 'Take two slow breaths. Feel the gentle return of directed attention — fresher than before. Open your eyes slowly.' },
    ],
    cycles: 1,
  },
  body_scan: {
    id: 'body_scan', icon: '🧘', name: 'Calmness Body Scan', color: '#5B3A8B', time: '7 min', secs: 420,
    tagline: 'Release held tension — 7 minutes',
    steps: ['Lie down or sit comfortably. Close your eyes.', 'Breathe naturally. Three slow breaths to settle.', 'Start at the crown of the head — move attention downward slowly', 'At each area: notice what is there. On the exhale, invite softening.', 'Complete at the feet. Notice the whole body breathing.'],
    phases: [
      { name: 'Settle',          secs: 30,  note: 'Close your eyes. Three slow breaths. Let the body arrive here.' },
      { name: 'Head & face',     secs: 60,  note: 'Forehead — any tightness? Jaw — are the teeth touching? Neck — any held tension? Just notice. On the exhale, invite softening.' },
      { name: 'Shoulders & chest',secs: 70, note: 'Shoulders — drawn up or forward? Chest — is the breathing shallow? Attend directly to the chest and invite it to expand more fully.' },
      { name: 'Belly & arms',    secs: 70,  note: 'Belly — held tight or relaxed? Hands — open or closed? Let the hands and belly soften. These areas hold the daily accumulation.' },
      { name: 'Lower body',      secs: 70,  note: 'Lower back, thighs, calves, feet. Attend to each. The release follows the noticing — you do not force it.' },
      { name: 'Whole body',      secs: 60,  note: 'Now feel the whole body breathing as one. Notice: it is slightly more relaxed than when you began. Three final slow breaths. Gently open your eyes.' },
      { name: 'Close',           secs: 60,  note: 'Take a moment before rising. Notice what shifted. This is where you begin tomorrow from — carry this quality forward.' },
    ],
    cycles: 1,
  },
  four_seven_eight: {
    id: 'four_seven_eight', icon: '🌙', name: '4-7-8 Pre-Sleep Breathing', color: '#2D6B45', time: '4 min', secs: 240,
    tagline: 'Deepest natural sleep support — 4 minutes',
    steps: ['Lie in your sleeping position', 'Inhale quietly through the nose — 4 counts', 'Hold the breath — 7 counts, body relaxed', 'Exhale through the mouth — 8 counts', 'Repeat 4-6 cycles — you may fall asleep during'],
    phases: [
      { name: 'Inhale', secs: 4, note: 'Breathe in quietly through the nose — 4 counts. Gentle, not dramatic.' },
      { name: 'Hold',   secs: 7, note: 'Hold comfortably — body relaxed, no strain, jaw soft.' },
      { name: 'Exhale', secs: 8, note: 'Breathe out through the mouth — 8 counts. Complete and slow.' },
    ],
    cycles: 5,
  },
  mindful_walk: {
    id: 'mindful_walk', icon: '🚶', name: 'Mindful Walk Reset', color: '#C07800', time: '5-10 min', secs: 300,
    tagline: 'Cortisol reduction through movement — zero extra time',
    steps: ['Phone in the bag — not in hand', 'Bring attention to the physical sensation of walking', 'Notice the foot lifting, moving, landing — the rhythm', 'Notice what you can see and hear as you move', 'When the mind goes to planning: "thinking" — return to the foot'],
    phases: [
      { name: 'First minute',  secs: 60,  note: 'Phone away. Begin walking. Bring attention to the feet — the physical sensation of each step. Resist the urge to check anything.' },
      { name: 'Middle',        secs: 180, note: 'Notice the rhythm of left-right-left. What can you see? What can you hear? When thinking arrives: "thinking." Return to the foot sensation.' },
      { name: 'Final minute',  secs: 60,  note: 'Notice: the air quality, the light, one specific thing in the environment. Arrive at your destination having practiced, not having scrolled.' },
    ],
    cycles: 1,
  },
};

// ── Routine Plans ──────────────────────────────────────────────────────────────
const buildCalmPlan = (stress, hardTime, timeKey) => {
  const timeSteps = { '5min': 3, '10min': 4, '20min': 5 };
  const stressData = {
    high: {
      priority: 'Your priority is physiological regulation first — the stress baseline needs reducing before habit layers can be added. Start with the one physiological sigh every morning before touching the phone. This single 45-second practice, done every day, is more effective than any elaborate routine done occasionally.',
      morning_habit: { icon: '😮‍💨', name: 'Three physiological sighs — before the phone', detail: 'Before any screen each morning: three double-inhale, long-exhale cycles. This is the highest-leverage single available change for high stress — it intercepts the cortisol spike before external demands amplify it.' },
      midday_habit: { icon: '💧', name: 'Cold water reset when stress spikes', detail: 'Keep this available: when stress spikes sharply during the day, cold water on face and wrists activates the diving reflex — heart rate reduction within seconds, no other technique needed.' },
      evening_habit: { icon: '📝', name: 'Worry download before sleep', detail: 'Five minutes of uncensored writing before bed — every concern, every thought, every unfinished thing. Close with: "Noted. Tomorrow." The writing discharges the brain\'s holding function.' },
      technique: 'physio_sigh',
      immediate: 'Do three physiological sighs right now — before reading further. Establish the feeling. Then do it again tomorrow morning before the phone.',
    },
    moderate: {
      priority: 'With moderate stress, the key is building consistent daily anchors rather than crisis management. Two anchors produce the most impact: the morning physiological sigh sequence and the phone-free walk between at least two locations per day.',
      morning_habit: { icon: '🌅', name: 'Phone-free 10-minute morning window', detail: 'The first ten minutes of every day — no screens. Sit with a warm drink, do three sighs, and write one genuine intention. The morning window sets the day\'s nervous system tone before anything external can.' },
      midday_habit: { icon: '🚶', name: 'One mindful transition walk', detail: 'At least one walk per day entirely without the phone — any walk. The combination of physical movement, natural light, and attentional rest produces the single most reliable midday cortisol reduction available.' },
      evening_habit: { icon: '🧘', name: 'Five-minute body scan before sleep', detail: 'Five minutes of systematic attention from head to feet, releasing tension on each exhale. Begins the physical restoration that moderate stress disrupts.' },
      technique: 'box_breathing',
      immediate: 'For the next five commutes or walks between locations: put the phone completely in the bag and attend to the physical experience of walking. Note the cortisol change.',
    },
    mild: {
      priority: 'With mild stress, the opportunity is deepening rather than crisis management — building the layered practices that create a stable, consistently calm baseline and the resilience that makes difficult periods more manageable.',
      morning_habit: { icon: '🌅', name: 'Structured 10-minute morning practice', detail: 'Physiological sighs, five minutes of breath awareness, and one written intention. At mild stress, this morning practice deepens the pre-existing calm rather than rescuing a disrupted baseline.' },
      midday_habit: { icon: '🌿', name: 'Open awareness restoration break', detail: 'After every 45-minute study block: five minutes of genuine undirected open awareness — not scrolling, not planning, simply receiving. This specifically restores the directed attention that study depletes.' },
      evening_habit: { icon: '💛', name: 'Gratitude + body scan evening close', detail: 'Three specific genuine appreciations from today, followed by the seven-minute body scan. From a mild stress baseline, this combination builds the positive emotional foundation that makes calm self-reinforcing.' },
      technique: 'open_awareness',
      immediate: 'Add one phone-free open awareness break after your next study session. Five minutes of receiving rather than consuming. Note the difference in the quality of the next study block.',
    },
    building: {
      priority: 'Starting from scratch, the approach that works best is the minimum viable routine: one practice in the morning and one in the evening, done every day without exception for two weeks before adding anything else. Consistency of two practices beats variety of ten.',
      morning_habit: { icon: '😮‍💨', name: 'Three physiological sighs — your entire morning practice', detail: 'Before the phone, before leaving bed: three double-inhale, long-exhale cycles. 45 seconds. This is your complete morning practice for the first two weeks. Do not add anything until this is completely automatic.' },
      midday_habit: { icon: '👣', name: 'One mindful walk — once per day', detail: 'Any walk. Phone in bag. Full attention on the physical experience of walking. One walk per day. This is the only additional practice for the first two weeks.' },
      evening_habit: { icon: '🌙', name: '4-7-8 breathing — your entire evening practice', detail: 'Lying in your sleeping position: four in, seven hold, eight out. Repeat until sleep arrives. This is your complete evening practice. Simple, effective, and produces sleep quality improvements within one week.' },
      technique: 'physio_sigh',
      immediate: 'Set an alarm for tomorrow morning labelled "Three sighs before phone." That is the entire first step. One practice, one alarm, tomorrow.',
    },
  };

  const timeData = {
    morning: { focus: 'Your hardest time is the morning. The morning routine is your highest-priority anchor — phone-free first ten minutes plus the three sighs produces the regulated morning baseline that changes the quality of the whole day.' },
    studying: { focus: 'Your hardest time is during study. The most relevant practices are the pre-study ritual (three sighs + one written task before opening materials), the parking lot (note distractions, return immediately), and the open awareness break every 45 minutes.' },
    afternoon: { focus: 'Your hardest time is the afternoon. The afternoon energy crash is partly cortisol depletion and partly the absence of genuine restoration at midday. The phone-free lunch and one mindful walk specifically address the afternoon trough.' },
    evening: { focus: 'Your hardest time is the evening. The evening routine is your priority: worry download + body scan + 4-7-8 breathing. This sequence takes 15-20 minutes and produces the most significant wellbeing return of any available evening investment.' },
    always: { focus: 'Stress is present throughout the day. This requires building all three anchors simultaneously — morning, midday, and evening. The minimum viable version: physiological sigh before each phone pickup, phone-free one meal, 4-7-8 before sleep.' },
  };

  const timeHabitCount = { '5min': 3, '10min': 4, '20min': 5 };

  const stPlan = stressData[stress] || stressData.moderate;
  const hdFocus = timeData[hardTime] || timeData.always;

  const allHabits = [
    stPlan.morning_habit,
    { icon: '📵', name: 'Phone-free one meal per day', detail: 'One genuinely screen-free meal — the sensory presence of eating without input provides genuine parasympathetic activation that is otherwise unavailable in a typical student day.' },
    stPlan.midday_habit,
    { icon: '💧', name: 'Cold water face and wrists when needed', detail: 'The fastest available stress reduction in any environment with a sink — 30 seconds, activates the mammalian diving reflex, direct heart rate reduction.' },
    stPlan.evening_habit,
    { icon: '📝', name: 'Two-minute worry download before sleep', detail: 'Write everything in the head — close with "Tomorrow." The writing completes the brain\'s reminder function, allowing genuine rest.' },
  ];

  const selectedHabits = allHabits.slice(0, timeHabitCount[timeKey] || 3);

  return {
    stressPriority: stPlan.priority,
    timeFocus: hdFocus.focus,
    habits: selectedHabits,
    technique: stPlan.technique,
    immediate: stPlan.immediate,
  };
};

// ── Practice Timer Component ──────────────────────────────────────────────────
function CalmTimer({ practice, onClose }) {
  const [phase,   setPhase]   = useState('intro');
  const [phIdx,   setPhIdx]   = useState(0);
  const [tLeft,   setTLeft]   = useState(0);
  const [running, setRunning] = useState(false);
  const [done,    setDone]    = useState(false);
  const [cycle,   setCycle]   = useState(0);
  const intRef = useRef(null);
  const phases = practice.phases;
  const CYCLES = practice.cycles || 1;
  const curPh  = phases[phIdx];
  const font   = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTLeft(p => {
        if (p <= 1) {
          clearInterval(intRef.current);
          setRunning(false);
          const nextIdx = (phIdx + 1) % phases.length;
          if (nextIdx === 0) {
            const newCycle = cycle + 1;
            setCycle(newCycle);
            if (newCycle >= CYCLES) { setDone(true); return 0; }
          }
          setPhIdx(nextIdx);
          setTLeft(phases[nextIdx].secs);
          setRunning(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phIdx, cycle]);

  const CIRC = 2 * Math.PI * 42;
  const mins = Math.floor(tLeft / 60);
  const secs = tLeft % 60;

  return (
    <div style={{ background: `${practice.color}08`, borderRadius: '14px', border: `2px solid ${practice.color}28`, overflow: 'hidden', fontFamily: font }}>
      <div style={{ padding: '12px 16px', background: `${practice.color}15`, borderBottom: `1px solid ${practice.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: practice.color }}>{practice.icon} {practice.name}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>
      <div style={{ padding: '18px' }}>
        {phase === 'intro' && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{practice.tagline}</p>
            <div style={{ marginBottom: '12px' }}>
              {practice.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: i < practice.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: practice.color, color: 'white', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setPhase('active'); setPhIdx(0); setCycle(0); setTLeft(phases[0].secs); setRunning(true); }} style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin {practice.time}</button>
          </>
        )}
        {phase === 'active' && !done && curPh && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 12px auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="42" fill="none" stroke={`${practice.color}18`} strokeWidth="6" />
                <circle cx="55" cy="55" r="42" fill="none" stroke={practice.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (tLeft / curPh.secs)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: mins > 0 ? '18px' : '24px', fontWeight: '700', color: practice.color }}>
                  {mins > 0 ? `${mins}:${secs.toString().padStart(2,'0')}` : secs}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: practice.color, marginBottom: '4px' }}>{curPh.name}</div>
            {CYCLES > 1 && (
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>
                {Array.from({ length: CYCLES }).map((_, i) => <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: i < cycle ? practice.color : i === cycle ? `${practice.color}60` : 'var(--border)' }} />)}
              </div>
            )}
            <div style={{ background: `${practice.color}10`, borderRadius: '9px', padding: '10px 12px', marginBottom: '12px', textAlign: 'left', minHeight: '65px', border: `1px solid ${practice.color}20` }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{curPh.note}</p>
            </div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {running ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '9px 20px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                        : <button onClick={() => setRunning(true)} style={{ padding: '9px 20px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>}
              <button onClick={() => { clearInterval(intRef.current); setPhIdx(0); setCycle(0); setTLeft(phases[0].secs); setRunning(true); setDone(false); }} style={{ padding: '9px 14px', borderRadius: '50px', border: `1.5px solid ${practice.color}40`, background: 'transparent', color: practice.color, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺</button>
            </div>
          </div>
        )}
        {done && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌿</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: practice.color, marginBottom: '8px' }}>Complete</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>Notice the quality of calm that is now present compared to when you began. That is what daily practice accumulates.</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setPhase('active'); setPhIdx(0); setCycle(0); setTLeft(phases[0].secs); setRunning(true); setDone(false); }} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Daily Calmness Habit Builder ───────────────────────────────────────────────
function DailyCalmHabitBuilder() {
  const [step,     setStep]     = useState(1);
  const [stress,   setStress]   = useState(null);
  const [hardTime, setHardTime] = useState(null);
  const [timeKey,  setTimeKey]  = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [openH,    setOpenH]    = useState(null);
  const [activePrac,setActivePrac]=useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const plan = (stress && hardTime && timeKey) ? buildCalmPlan(stress, hardTime, timeKey) : null;
  const selStress  = STRESS_LEVELS.find(s => s.key === stress);
  const selTime    = HARD_TIME.find(t => t.key === hardTime);
  const selTimeAv  = TIME_AVAILABLE.find(t => t.key === timeKey);

  const handleReset = () => { setStep(1); setStress(null); setHardTime(null); setTimeKey(null); setRevealed(false); setOpenH(null); setActivePrac(null); };

  const Btn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{ padding: '12px 14px', borderRadius: '11px', border: '2px solid', borderColor: isSel ? SAGE26 : 'var(--border)', background: isSel ? SPALE26 : 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%', marginBottom: '7px', boxShadow: isSel ? `0 0 0 2px ${SBORD26}` : 'none' }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? SAGE26 : 'var(--ink)', marginBottom: opt.desc ? '1px' : 0 }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: SAGE26, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  if (activePrac) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <CalmTimer practice={CALM_PRACTICES[activePrac]} onClose={() => setActivePrac(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SAGE26 : 'var(--border)', transition: 'background 0.3s' }} />)}
      </div>

      {step === 1 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — What is your current stress level?</p>
        {STRESS_LEVELS.map(s => <Btn key={s.key} opt={s} selected={stress} onSelect={setStress} />)}
        <button onClick={() => { if (stress) setStep(2); }} disabled={!stress} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: stress ? `linear-gradient(135deg, ${SAGE26}, #9AB090)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: stress ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: stress ? `0 6px 18px ${SBORD26}` : 'none' }}>Next →</button>
      </>)}

      {step === 2 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — When is it hardest to stay calm?</p>
        {HARD_TIME.map(t => <Btn key={t.key} opt={t} selected={hardTime} onSelect={setHardTime} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (hardTime) setStep(3); }} disabled={!hardTime} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: hardTime ? `linear-gradient(135deg, ${SAGE26}, #9AB090)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: hardTime ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
        </div>
      </>)}

      {step === 3 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — How much time can you give daily?</p>
        {TIME_AVAILABLE.map(t => <Btn key={t.key} opt={t} selected={timeKey} onSelect={setTimeKey} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (timeKey) { setStep(4); setRevealed(false); } }} disabled={!timeKey} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: timeKey ? `linear-gradient(135deg, ${SAGE26}, #9AB090)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: timeKey ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Calmness Routine →</button>
        </div>
      </>)}

      {step === 4 && plan && (<>
        <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Daily Calmness Routine</p>
        {!revealed ? (
          <>
            <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${SAGE26}, #9AB090)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${SBORD26}` }}>🌿 Build My Routine</button>
            <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
          </>
        ) : (
          <div style={{ animation: 'floatUp 0.4s ease' }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${selStress?.color}, ${selStress?.color}BB)`, borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selStress?.icon} {selTime?.icon}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>Your Daily Calmness Routine</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selStress?.label} · {selTimeAv?.label}</div>
            </div>

            {/* Priority note */}
            <div style={{ background: SPALE26, border: `1.5px solid ${SBORD26}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: SAGE26, marginBottom: '4px' }}>🎯 YOUR PRIORITY</div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{plan.stressPriority}</p>
              <div style={{ background: 'white', borderRadius: '8px', padding: '8px 10px', border: `1px solid ${SBORD26}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: SAGE26, marginBottom: '2px' }}>⏰ FOR YOUR HARDEST TIME ({selTime?.label?.toUpperCase()}):</div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{plan.timeFocus}</p>
              </div>
            </div>

            {/* Habits */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: SAGE26, marginBottom: '7px', letterSpacing: '1.2px' }}>🌿 YOUR {selTimeAv?.label?.toUpperCase().split(' ')[0]} DAILY HABITS:</div>
              {plan.habits.map((h, i) => {
                const isOpen = openH === i;
                return (
                  <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '6px', border: `1.5px solid ${SBORD26}`, overflow: 'hidden' }}>
                    <button onClick={() => setOpenH(isOpen ? null : i)} style={{ width: '100%', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: SPALE26, border: `1px solid ${SBORD26}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{h.icon}</div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: SAGE26, flex: 1 }}>{h.name}</span>
                      <span style={{ color: SAGE26, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}><p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{h.detail}</p></div>}
                  </div>
                );
              })}
            </div>

            {/* Immediate action */}
            <div style={{ background: `${selStress?.color}12`, border: `2px solid ${selStress?.color}25`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selStress?.color, marginBottom: '4px' }}>⚡ DO THIS TODAY</div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '600' }}>{plan.immediate}</p>
            </div>

            {/* Practice button */}
            <div style={{ background: SPALE26, border: `1.5px solid ${SBORD26}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: SAGE26, marginBottom: '6px' }}>🕐 TRY A PRACTICE NOW</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {Object.values(CALM_PRACTICES).slice(0, 4).map(p => (
                  <button key={p.id} onClick={() => setActivePrac(p.id)} style={{ padding: '7px 12px', borderRadius: '20px', border: `1.5px solid ${p.color}40`, background: `${p.color}12`, color: p.color, fontWeight: '700', fontSize: '11px', cursor: 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{p.icon}</span> <span>{p.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: SPALE26, border: `1.5px dashed ${SBORD26}`, borderRadius: '12px', padding: '12px 17px', marginBottom: '14px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: SAGE26, fontStyle: 'italic', lineHeight: 1.55 }}>
                "Calm is not found in moments of peace. It is built in ordinary moments until peace becomes the ordinary."
              </p>
            </div>

            <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${SBORD26}`, color: SAGE26, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Rebuild for different circumstances</button>
          </div>
        )}
      </>)}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BuildDailyCalmness({ navigate, relatedPosts }) {
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
      <p>There is a version of student life in which the mornings begin calmly, the study sessions are focused without constant anxiety, the evenings genuinely wind down, and sleep arrives without an hour of lying awake rehearsing tomorrow's fears. This version does not require a different life — it requires a different routine within the life that already exists.</p>

      <p>A <strong>daily calmness routine</strong> is not a collection of extra activities requiring extra time. It is a set of habits that occupy moments already in the day — before picking up the phone, during the walk between classes, at one meal, in the twenty minutes before sleep — and convert those ordinary moments from stress amplifiers into calm builders. This guide shows you exactly which habits, exactly how, and gives you a builder to create the version that fits your specific circumstances.</p>

      <img
        src={meta.imgUrl}
        alt="Student building daily calmness routine — relaxing habits, stress reduction techniques, and actionable calm practices for everyday life"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-calm">1. What Calmness Is — and How It Is Built</h3>

      <p><strong>Calmness is a state of the nervous system, not a state of circumstances.</strong> The most consistently calm people in research studies are not people whose lives are easiest or whose problems are smallest — they are people whose nervous systems have lower baseline cortisol, higher vagal tone, and better prefrontal regulation of the amygdala's threat response. These are physiological parameters, not character traits. They are developed through specific daily practices and they can change in measurable ways across weeks of consistent habit.</p>

      <p><strong>The three components of a calm daily baseline.</strong> Research on HPA axis regulation and autonomic nervous system function identifies three building blocks of a calm physiological baseline. First, cortisol management: practices that prevent the cortisol awakening response from being amplified by immediate stressors (phone news, social comparison), and that provide cortisol discharge opportunities across the day through physical movement and breath-based parasympathetic activation. Second, vagal tone: the vagus nerve is the primary carrier of parasympathetic ("rest and digest") signals — practices that activate the vagal brake directly (extended exhale breathing, cold water, physical safety signals) build the tonal strength that makes parasympathetic activation more readily available. Third, DMN suppression: the default mode network's self-referential background activity — the worry, the replay, the planning — is the primary generator of mental noise that disrupts calm. Mindfulness practice and structural environmental changes (phone away, notification off) reduce DMN activation, producing the subjective experience of a quieter, calmer mind.</p>

      <p><strong>How daily habits produce lasting calm — the cumulative mechanism.</strong> Single sessions of calm-producing practices produce immediate benefits that last two to four hours. Daily consistent practice produces cumulative structural changes across weeks: reduced amygdala grey matter density (Hölzel et al.), improved prefrontal-amygdala connectivity (Davidson), and measurably lower baseline cortisol (Carlson et al.). These structural changes are what produce the "calm person" experience — not a single session's benefit but the accumulated neural infrastructure built over months of consistent daily habits. The daily routine is the investment vehicle; the structural brain changes are the return.</p>

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Science of Daily Calm — Why Habits Work</h3>

      <p><strong>The cortisol daily curve — and how habits shape it.</strong> Cortisol follows a natural daily curve: it peaks in the first 30-45 minutes after waking (the cortisol awakening response, or CAR) and gradually declines across the day before reaching its lowest point during sleep. This curve creates specific intervention windows: the morning window (modulating the peak before it is amplified), the midday window (preventing accumulation across demands), and the evening window (ensuring the decline reaches a genuine resting point rather than maintaining residual activation). Each calming habit in this guide is placed to address one of these windows — together they shape the daily cortisol curve toward a flatter, lower profile that produces the sustained calm that any single practice cannot.</p>

      <p><strong>Habit formation and automaticity — why consistency produces calm that effort cannot.</strong> Research by Wendy Wood at USC on habit formation shows that approximately 43% of daily behaviours are performed habitually — automatically, in response to contextual cues, without deliberate decision. Calm-producing behaviours that require daily deliberate effort and motivation (deciding each morning to meditate, deciding each evening to put the phone away) have lower compliance rates than the same behaviours anchored to existing contextual cues (phone is picked up → three sighs happen automatically first; sitting in bed at night → body scan begins automatically). The goal of the daily calmness routine is to reach this automatic stage — where calm practices happen not because they have been actively chosen but because the day's structure reliably produces them.</p>

      <p><strong>The social engagement system — why connection calms.</strong> Research by Porges on polyvagal theory identifies the ventral vagal social engagement system as the highest-order parasympathetic circuit — one that produces the deepest available natural calm through genuine social connection, warmth, and safety. The practical implication: genuine face-to-face or voice conversation with people whose presence feels safe activates the ventral vagal state more effectively than any breathing practice alone. Building daily habits of genuine connection — one real conversation per day, one shared meal per week, one expression of appreciation per day — is both a wellbeing practice and a calmness-building practice that operates through the same neural pathway as mindfulness but through a social rather than individual mechanism.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Daily Calmness Habit Builder</h3>
      <p>The Builder creates a personalised daily calmness routine based on your current stress level, the time of day you find hardest to stay calm, and how much time you can invest daily. It generates specific habits for your circumstances, an immediate action to take today, and quick access to guided calm practices with timers.</p>

      <DailyCalmHabitBuilder />

      {/* ── Section 4 ── */}
      <h3 id="morning">4. Morning Calmness Habits</h3>

      <p>The morning is the highest-leverage window for daily calmness — the CAR produces a natural cortisol spike that, left unmanaged and immediately amplified by phone-based comparison and news consumption, sets an anxious baseline that the rest of the day tries to recover from. The morning habits below specifically intercept this spike before it is amplified.</p>

      <p><strong>Habit 1: Phone-free first ten minutes — non-negotiable.</strong> The first input of the day shapes the cortisol and attentional baseline for the following two to three hours. Opening the phone immediately subjects the highest-cortisol morning window to social comparison, notification anxiety, and reactive information processing — activating the threat response before any regulation has occurred. The phone-free first ten minutes provides the baseline-setting window in which the practices below can land on a relatively unactivated nervous system. No phone does not mean complete silence or emptiness — it means those ten minutes belong to a warm drink, a window, a gentle practice, or simply being awake without external demands. After ten minutes, the phone's agenda no longer has uncontested access to the morning cortisol state.</p>

      <p><strong>Habit 2: Three physiological sighs — every morning.</strong> The double-inhale, long-exhale pattern performed three times produces measurable parasympathetic activation within 30 seconds, modulating the CAR before any external demand amplifies it. This 45-second practice, performed before the phone is picked up, is the single highest-return time investment available for morning calmness. Research by Huberman Lab at Stanford documents its effect as the fastest available voluntary cortisol reduction — and it requires no special setting, no equipment, and no expertise. After two weeks of daily practice, it becomes automatic — the morning reaches for it before the phone.</p>

      <p><strong>Habit 3: Brief body check-in — 60 seconds.</strong> Before leaving the bed or before beginning any morning activity: close the eyes, attend from head to feet, and name one specific word for the emotional and physiological weather today. This one-minute practice provides two benefits: it catches the day's emotional starting point before it silently colours every interaction and decision, and it builds the interoceptive awareness that both mindfulness and emotional regulation depend on. Students who practise the morning check-in consistently report fewer mid-session motivational crashes because they already knew how they were starting and could calibrate accordingly.</p>

      <p><strong>Habit 4: Written day intention — not a to-do list.</strong> Before opening any materials, any tasks, any academic content: write one sentence — "Today I want to ___." Not a task, not a goal, not a performance target. Something genuinely valued for today. The intention is the cognitive anchor that the day can return to when it becomes scattered — a reminder of what today was actually for, independent of everything that competes for attention. Research by Gollwitzer on implementation intentions shows that forming a specific intention produces measurably better follow-through than general planning, and reduces the motivational depletion that comes from a day without clear directional purpose.</p>

      {/* ── Section 5 ── */}
      <h3 id="midday">5. Midday Stress Reduction Techniques</h3>

      <p><strong>The cortisol accumulation problem — and the midday solution.</strong> Cortisol from successive morning demands accumulates across a day without deliberate reset opportunities. The standard student experience is demand to demand without genuine transition: lecture to study to social obligation to study, each carrying the physiological residue of the one before. Without midday discharge opportunities, the afternoon arrives with a cortisol load that impairs both academic performance and emotional regulation — producing the characteristic post-lunch crash, the afternoon irritability, and the evening inability to wind down that affects most high-stress students.</p>

      <p><strong>Technique 1: The between-activity sigh — zero extra time, maximum effect.</strong> Three physiological sighs at the end of every significant activity — before beginning the next one. The activity ends, materials are closed, three sighs, next activity begins. This 45-second discharge prevents cortisol from accumulating from one context to the next. The sigh is the transition — between lecture and study, between subjects, between study and meal, between any two consecutive demands. Students who implement this single practice consistently report measurably lower afternoon cortisol perception and significantly better mid-afternoon study quality.</p>

      <p><strong>Technique 2: One phone-free meal — genuine sensory presence.</strong> One meal per day — consistently the same meal to build the automatic habit faster — eaten without any screen. The phone-free meal provides genuine parasympathetic activation through the full sensory presence it enables: the actual taste of the food (not half-tasted while scrolling), the genuine digestive rest that the parasympathetic state permits, and the brief window of complete attentional freedom from academic and social demands. Research on mindful eating by Kristeller documents significant improvements in mood, stress, and physical wellbeing from this single change — not from any change in the food itself but from the quality of attention brought to it.</p>

      <p><strong>Technique 3: Mindful movement breaks — every 45 minutes.</strong> After every 45-minute study block: a five-minute break that involves genuine physical movement without devices. Walking briefly, stretching, stepping outside. The movement provides cortisol metabolism through physical activity (the primary mechanism by which adrenaline and cortisol are physically discharged from the body) and attentional restoration through the soft fascination of environmental change. Research by Kaplan on attention restoration shows this specific type of break — undirected movement in an environmental context different from the study space — restores directed attention capacity more effectively than any screen-based break.</p>

      <p><strong>Technique 4: The three-breath reset — 30 seconds, anywhere, anytime.</strong> When stress spikes sharply during the midday period — a difficult message, a disappointing result, a tense interaction — three physiological sighs immediately provide the minimum viable acute stress regulation. This is not about eliminating the stress response (which is appropriate to the situation) but about preventing the acute spike from cascading into sustained physiological activation. The three-breath reset is invisible in any setting, takes 45 seconds, and produces measurable cortisol reduction that prevents the sharp spike from permanently elevating the afternoon baseline.</p>

      {/* ── Section 6 ── */}
      <h3 id="evening">6. Evening Relaxation Practices</h3>

      <p><strong>Why the evening routine is the most important routine.</strong> Sleep is the most powerful restorative mechanism available — more effective than any combination of rest, nutrition, and practice at restoring physiological and psychological baseline. Everything that degrades sleep quality degrades tomorrow's calm. The evening routine's primary purpose is protecting the sleep quality that tomorrow depends on: discharging the day's cognitive and emotional accumulation before the sleep period, reducing the physiological arousal that maintains the nervous system's activation past the appropriate winding-down point, and creating the sensory and environmental conditions that support rapid sleep onset and quality sleep maintenance.</p>

      <p><strong>Practice 1: Digital sunset — 30 minutes before intended sleep.</strong> All non-essential screens off 30 minutes before sleep. This is not about the content of what is being viewed — it is about the blue light spectrum (which suppresses melatonin production) and the cognitive arousal that any stimulating content maintains. Research by Czeisler at Harvard documents that even 30 minutes of screen reduction before sleep significantly improves sleep onset time and deep sleep proportion. The phone charged outside the bedroom eliminates both the in-bed phone use and the middle-of-the-night checking that fragments sleep. This single structural change is the evening equivalent of the phone-free morning: protecting the highest-leverage window from the device's agenda.</p>

      <p><strong>Practice 2: The worry download — 5 minutes.</strong> A dedicated notebook beside the bed. Five minutes of writing every thought currently in the head — tasks, worries, plans, unfinished items — completely uncensored. Close with: "These are noted. I can return to them tomorrow." The writing discharges the brain's reminder function: the brain keeps thoughts active because it has no guarantee they will be remembered otherwise. The written record provides that guarantee — and the brain can release the active holding it was using as a reminder. Research by Harvey on the cognitive model of insomnia identifies pre-sleep cognitive arousal as the primary driver of sleep onset difficulty; the worry download specifically reduces this arousal by providing the external storage that replaces internal circulating.</p>

      <p><strong>Practice 3: The calmness body scan — 7 minutes.</strong> Lying in the sleeping position, systematic attention from head to feet, inviting softening on each exhale. The body scan addresses the physical component of the day's accumulated stress: the jaw tension that formed during a difficult conversation, the shoulder tension that developed during an intense study session, the stomach tightness from anxiety that was never fully discharged. Research by Kabat-Zinn on MBSR documents significant improvements in sleep quality following regular body scan practice through this mechanism — the physical tension release reduces the sympathetic activation that maintains wakefulness past the appropriate point.</p>

      <p><strong>Practice 4: 4-7-8 pre-sleep breathing — until sleep arrives.</strong> Four counts in through the nose, seven hold, eight out through the mouth. Lying in the sleeping position, eyes closed. The extended breath hold activates the diving reflex (direct heart rate reduction), and the eight-count exhale is the strongest available natural parasympathetic activator. Students who implement this as their final pre-sleep practice consistently report falling asleep during the practice itself within two to three weeks of daily use — not because it creates sleep pharmacologically but because it reliably produces the physiological state in which the body's natural sleep mechanisms can engage.</p>

      {/* ── Section 7 ── */}
      <h3 id="tips">7. Ten Actionable Calmness Tips for Every Day</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', fontFamily: font }}>
        {[
          { num: 1,  icon: '😮‍💨', color: '#1A7272', tip: 'Three sighs before the phone', detail: 'Every morning, every time you pick up the phone after putting it down for more than an hour. 45 seconds that prevents cortisol accumulation one pickup at a time.' },
          { num: 2,  icon: '📵', color: '#8B2635', tip: 'Phone in another room during every study session', detail: 'Not silenced. Not face-down. In another room. The cognitive load of anticipating incoming information is eliminated only by physical absence — not by proximate availability.' },
          { num: 3,  icon: '🚶', color: SAGE26, tip: 'One mindful walk per day', detail: 'Any walk. Phone in bag. Attention on the physical experience of movement. The combination of cortisol metabolism from movement and attentional restoration from environmental attention is unreplicable by any other five-minute intervention.' },
          { num: 4,  icon: '🍽️', color: '#2D5A8A', tip: 'Phone-free one meal per day', detail: 'One meal — consistently the same meal — eaten with full sensory presence. The genuine pleasure of actually tasting food is both the reward and the practice.' },
          { num: 5,  icon: '⬜', color: '#5B3A8B', tip: 'Box breathing when stressed', detail: 'Four in, four hold, four out, four hold. Five cycles. Anywhere, any time. The equal-ratio pattern produces autonomic balance within two to three minutes.' },
          { num: 6,  icon: '🌿', color: '#2D6B45', tip: 'Open awareness after every study block', detail: 'Five minutes of undirected awareness (not scrolling) after every 45 minutes of study. The specific antidote to directed attention fatigue — nothing else provides genuine attentional restoration.' },
          { num: 7,  icon: '💧', color: '#C07800', tip: 'Cold water for acute stress spikes', detail: 'Cold water on face and wrists — 30 seconds, any sink. The fastest available stress reduction in any setting: direct heart rate reduction through the mammalian diving reflex.' },
          { num: 8,  icon: '📝', color: '#B54F20', tip: 'Worry download before sleep — every night', detail: 'Five minutes, a notebook, every concern externalised. The ritual of writing and the closure sentence ("noted, tomorrow") is the most reliable available pre-sleep cognitive arousal reduction.' },
          { num: 9,  icon: '🌙', color: '#2D5A8A', tip: 'Screens off 30 minutes before sleep', detail: 'The melatonin protection that makes tomorrow\'s regulation possible. Charged outside the bedroom. The single structural change with the longest daily return.' },
          { num: 10, icon: '💬', color: SAGE26, tip: 'One genuine conversation per day', detail: 'Real conversation — voice or in-person, not text. The ventral vagal social engagement system activated by genuine connection produces the deepest available natural calm. Social media does not count.' },
        ].map(t => (
          <div key={t.num} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '12px', borderLeft: `4px solid ${t.color}` }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${t.color}15`, border: `1.5px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{t.icon}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: t.color }}>TIP {t.num}</span>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: t.color }}>{t.tip}</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{t.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick practice access ── */}
      <div style={{ background: SPALE26, border: `1.5px solid ${SBORD26}`, borderRadius: '14px', padding: '18px', marginBottom: '28px', fontFamily: font }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: SAGE26, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>🕐 Practice a calm technique right now:</div>
        {activeTimer ? (
          <CalmTimer practice={CALM_PRACTICES[activeTimer]} onClose={() => setActiveTimer(null)} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.values(CALM_PRACTICES).map(p => (
              <button key={p.id} onClick={() => setActiveTimer(p.id)} style={{ padding: '11px 12px', borderRadius: '10px', border: `1.5px solid ${p.color}30`, background: `${p.color}10`, cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '16px' }}>{p.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: p.color }}>{p.name}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{p.time}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 8: FAQs ── */}
      <h3 id="faq">8. Daily Calmness Routine FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried building a calm routine before and always fail after a few days. What makes this time different?</strong><br />
        A: The most common reason calm routines fail within days is the complexity problem: the routine is designed as an ideal (morning meditation, yoga, journalling, healthy breakfast, all before school) that is sustainable only on perfect days. Perfect days are rare; the routine is abandoned when the first imperfect day arrives. The habit-formation research solution is minimum viable design: begin with the smallest version of the practice that still produces a real benefit, and build only after that version is fully established as automatic. The minimum viable daily calmness routine is: three physiological sighs before the morning phone pickup (45 seconds) and 4-7-8 breathing before sleep (four minutes). Those two practices require no extra time, work on any day regardless of how disrupted it is, and produce measurable benefits within one week. Start there — add nothing for two weeks. Then add one practice when those two are fully automatic.</p>

        <p><strong>Q: Is there a calmness routine specifically for exam season, when everything is already at maximum stress?</strong><br />
        A: Yes — and counterintuitively, the research supports maintaining the routine during exam season rather than abandoning it, because the physiological benefits are most needed at highest stress. The exam-season adapted routine prioritises the three highest-return, lowest-time practices: three physiological sighs before every study session (not just in the morning — before each session, to reset the cortisol each time), the five-minute open awareness break after every 45-minute study block (the attention restoration is more valuable during high-intensity revision than any time), and the worry download before sleep (pre-sleep cognitive arousal from exam content is the primary cause of the poor sleep that compounds exam anxiety). These three together take approximately 15 minutes across the day and maintain the nervous system regulation that makes the studying itself more effective.</p>

        <p><strong>Q: My problem is that I am calm during low-stress periods but lose all my calmness techniques when things become genuinely hard. Is this fixable?</strong><br />
        A: Yes — and the fix is specifically to practise the techniques during the low-stress periods until they are automatic enough to survive the high-stress period's cortisol-reduced prefrontal function. The techniques that are most reliably available during high stress are those that are most automatic — requiring the least deliberate activation. The physiological sigh performed daily for three weeks before stress arrives is available inside the exam hall; the physiological sigh learned about two weeks before exam season and never practised daily is not. The daily routine during calm periods is the investment in the availability of techniques during crises. The specific goal: by the time exam season arrives, the three sighs should be so automatic they happen before you have consciously decided to do them — because the contextual cue (picking up the phone, beginning a study session, lying in bed) triggers the practice automatically. That level of automaticity takes approximately 21-30 days of daily practice to achieve.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SAGE26, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "A calm day does not require a calm world. It requires a routine that brings you back to your own ground, repeatedly, before the world has the chance to move you from it."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Habit Builder to find your starting routine. Do the immediate action today. Set an alarm for tomorrow morning labelled "Three sighs before phone." That one habit, built to automatic in three weeks, is the foundation from which everything else grows.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SAGE26, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD26}` }}
          >
            Build Your Calm in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SAGE26, border: `2px solid ${SAGE26}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Calmness Habit
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/daily-mindfulness-routine',       '→ Daily Mindfulness Routine for Students and Young Adults'],
            ['/blog/mindfulness-emotional-balance',   '→ Mindfulness and Emotional Balance Explained Simply'],
            ['/blog/develop-inner-peace',             '→ How to Develop Inner Peace in a Busy Life'],
            ['/blog/breathing-exercises-stress',      '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/stay-grounded-stress',            '→ How to Stay Grounded During Stressful Moments'],
            ['/blog/mindfulness-techniques-beginners','→ Mindfulness Techniques for Beginners'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SAGE26, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
