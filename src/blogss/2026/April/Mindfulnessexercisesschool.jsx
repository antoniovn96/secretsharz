import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mindfulness Exercises for School and Study Life",
  excerpt: "Mindfulness exercises for students do not require special conditions, extra time, or visible behaviour changes. The most effective ones are invisible, take under five minutes, and slot into the gaps that already exist in the school day. This guide lists twelve exercises — from 30 seconds to 10 minutes — for every situation students face, with a finder tool that matches the right exercise to your exact current moment.",
  category: "Mental Health",
  date: "15-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mindfulness-exercises-school.jpg",
  tldr: "Twelve mindfulness exercises specifically designed for school and study life — arranged by time available, situation, and purpose. Includes classroom-invisible techniques for in-the-moment stress relief, pre-study focus rituals, post-school decompression practices, and sleep-preparation exercises. An interactive Exercise Finder matches the right practice to your exact situation and generates guided instructions with a timer.",
  toc: [
    { id: "why-school",  title: "1. Why Mindfulness Works in School Settings",                        level: 3 },
    { id: "exercises",   title: "2. Twelve Mindfulness Exercises — Complete List",                    level: 3 },
    { id: "finder",      title: "3. Interactive: The School Mindfulness Exercise Finder",             level: 3 },
    { id: "stress",      title: "4. Stress Relief Exercises for Study Life",                          level: 3 },
    { id: "school-day",  title: "5. Building a Mindful School Day",                                   level: 3 },
    { id: "faq",         title: "6. Mindfulness at School FAQs",                                      level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-15T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mindfulness exercises for students, mindfulness at school, classroom mindfulness techniques, student stress relief exercises, mindfulness study life, mindfulness school day, student mindfulness exercises list",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the best mindfulness exercises for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best mindfulness exercises for students are those that match their available time and situation. For acute school stress (in a classroom or corridor): the invisible physiological sigh (30 seconds), the five-second breath hold (15 seconds), and the feet-on-floor grounding practice (60 seconds) — all undetectable in public settings. For study sessions: the pre-study focus ritual (3-5 minutes), breath precision practice (5 minutes), and the noting technique during study (continuous, low-cost). For decompression after school: the mindful walk and the body scan (5-10 minutes). For pre-sleep: the worry download and 4-7-8 breathing (5 minutes). Research by Zylowska and Zeidan shows measurable cognitive benefits from even 5-10 minute daily mindfulness sessions in student populations.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I do mindfulness exercises in class without anyone noticing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Several mindfulness exercises are completely invisible in a classroom setting. The invisible physiological sigh (double inhale through the nose, long exhale through the nose rather than mouth) appears identical to ordinary breathing. The five-second internal breath hold requires no visible change in behaviour. The feet-on-floor grounding practice involves only pressing the feet into the ground while appearing to sit normally. Extended nasal exhale breathing (in for 4, out for 8, all through the nose) is indistinguishable from resting breathing. The noting technique (mentally labelling thoughts) requires no visible action whatsoever. All of these produce measurable parasympathetic activation and attentional improvement without requiring any visible behaviour that would draw attention.",
      },
    },
    {
      "@type": "Question",
      "name": "How often should students practise mindfulness exercises?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research supports daily practice for cumulative neurological benefits, with consistency mattering more than duration. The minimum effective dose documented in research (Zeidan et al., Wake Forest) is 10-15 minutes daily for 4 days, producing measurable cognitive and stress benefits. For students, the most practical structure is: one anchored daily practice of 5 minutes (breath awareness in the morning or before study), plus two to three situational practices per day (the quick invisible techniques used in-the-moment as needed). This structure produces both immediate situational relief and cumulative neurological changes without requiring significant additional time.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const EMERALD  = '#2D7A65';
const EPALE10  = '#EAF5F2';
const EBORD10  = 'rgba(45,122,101,0.22)';

// ── Exercise data ──────────────────────────────────────────────────────────────
const ALL_EXERCISES = [
  {
    id:        'physio_sigh_invisible',
    number:    '01',
    icon:      '😮‍💨',
    name:      'The Invisible Physiological Sigh',
    time:      '30 seconds',
    timeSecs:  30,
    category:  'instant',
    situation: ['classroom', 'exam', 'corridor', 'anywhere'],
    state:     ['anxious', 'panicking', 'overwhelmed', 'stressed'],
    visible:   false,
    color:     '#1A7272',
    bg:        '#EBF5F5',
    tagline:   'Fastest stress reset — fully invisible',
    science:   'The double inhale re-inflates collapsed alveoli, and the extended nasal exhale activates the vagal brake producing parasympathetic activation within 30 seconds (Huberman Lab, Stanford).',
    steps: [
      'Double inhale through the nose — fill, then a small sharp top-up',
      'Hold for half a second',
      'Exhale slowly and completely through the nose (not mouth — stays invisible)',
      'Repeat 1-3 times. Appears completely normal from outside.',
    ],
    when: 'Before entering an exam hall, during a tense classroom moment, at the first sign of acute anxiety.',
  },
  {
    id:        'five_second_hold',
    number:    '02',
    icon:      '⏱️',
    name:      'The Five-Second Internal Hold',
    time:      '15 seconds',
    timeSecs:  15,
    category:  'instant',
    situation: ['classroom', 'exam', 'corridor', 'anywhere'],
    state:     ['emotional', 'angry', 'about-to-cry', 'stressed'],
    visible:   false,
    color:     '#2D5A8A',
    bg:        '#EEF3FB',
    tagline:   'When you need to hold it together — immediately',
    science:   'The brief breath hold activates the mammalian diving reflex, producing direct heart rate reduction within seconds. All-nasal breathing makes it completely invisible.',
    steps: [
      'Breathe in normally through the nose (no dramatic inhale)',
      'Hold the breath internally for 5 seconds — body relaxed, no strain',
      'Exhale slowly through the nose only',
      'Repeat once if needed. Appears as thoughtful sitting.',
    ],
    when: 'When trying not to cry, when feeling angry in class, during any emotionally intense moment in a public setting.',
  },
  {
    id:        'feet_floor',
    number:    '03',
    icon:      '👣',
    name:      'Feet on Floor Grounding',
    time:      '60 seconds',
    timeSecs:  60,
    category:  'grounding',
    situation: ['classroom', 'exam', 'anywhere', 'study'],
    state:     ['anxious', 'dissociated', 'overwhelmed', 'distracted'],
    visible:   false,
    color:     '#2D6B45',
    bg:        '#E8F4EE',
    tagline:   'Anchors you to the present room — completely invisible',
    science:   'Physical grounding activates interoceptive awareness through the insula cortex, competing with the DMN\'s abstract future/past spiral and pulling attention back to present-moment reality (Garfinkel, Sackler Centre).',
    steps: [
      'Press both feet firmly into the floor — feel the exact pressure and temperature',
      'Notice the weight of your body in the chair — the sensation of being supported',
      'Without moving visibly, name two things you can see from where you are sitting',
      'Take one slow nasal breath. You are here, in this room, in this moment.',
    ],
    when: 'When anxiety pulls attention into imagined futures, when feeling disconnected, during a difficult exam moment.',
  },
  {
    id:        'extended_exhale_nasal',
    number:    '04',
    icon:      '🌊',
    name:      'Extended Nasal Exhale (4-8)',
    time:      '90 seconds',
    timeSecs:  90,
    category:  'breathing',
    situation: ['classroom', 'study', 'corridor', 'anywhere'],
    state:     ['stressed', 'anxious', 'distracted', 'overwhelmed'],
    visible:   false,
    color:     EMERALD,
    bg:        EPALE10,
    tagline:   'Continuous calming — invisible in any setting',
    science:   'Any exhale longer than the inhale activates the vagal brake. All-nasal breathing eliminates audible sound, making this undetectable during a lecture, reading period, or exam.',
    steps: [
      'Breathe in through the nose for 4 counts — gentle, not dramatic',
      'Breathe out through the nose for 8 counts — twice as long, slow and complete',
      'Maintain nasal breathing throughout — silent and invisible',
      'Continue for 5-8 breaths (about 90 seconds). Appears as ordinary seated breathing.',
    ],
    when: 'During class when sustained anxiety needs managing, between exam questions, any situation requiring invisible sustained calm.',
  },
  {
    id:        'box_desk',
    number:    '05',
    icon:      '⬜',
    name:      'Box Breathing at the Desk',
    time:      '2 minutes',
    timeSecs:  120,
    category:  'breathing',
    situation: ['exam', 'study', 'corridor'],
    state:     ['anxious', 'stressed', 'scattered', 'overwhelmed'],
    visible:   false,
    color:     '#8B2635',
    bg:        '#FBF0F1',
    tagline:   'Military-grade calm in 2 minutes — looks like focused reading',
    science:   'Box breathing produces HRV improvements through both the hold and extended exhale phases. Research documents significant autonomic balancing within 2-3 minutes. Nasal throughout = invisible.',
    steps: [
      'Appear to be reading or looking at notes — natural desk posture',
      'Inhale through the nose for 4 counts',
      'Hold for 4 counts — body relaxed, no visible strain',
      'Exhale through the nose for 4 counts',
      'Hold the empty breath for 4 counts',
      'Repeat for 4-6 cycles. Indistinguishable from focused reading.',
    ],
    when: 'Before an exam paper begins, during a study period when anxiety is building, any 2-minute window requiring composure.',
  },
  {
    id:        'pre_study_ritual',
    number:    '06',
    icon:      '📚',
    name:      'Pre-Study Focus Ritual',
    time:      '3 minutes',
    timeSecs:  180,
    category:  'focus',
    situation: ['study', 'pre-exam'],
    state:     ['distracted', 'scattered', 'anxious', 'unmotivated'],
    visible:   true,
    color:     '#2D5A8A',
    bg:        '#EEF3FB',
    tagline:   'The 3 minutes that make the next 45 actually work',
    science:   'Pre-task implementation intentions reduce mind-wandering during subsequent tasks (Gollwitzer). Breath focus immediately before study activates the task-positive network before the session begins (Mrazek et al.).',
    steps: [
      'Before any material: sit upright, both feet on the floor, hands in lap',
      'Close your eyes. Three slow breaths — in through the nose, out through the mouth',
      'On the third exhale, consciously soften the jaw and shoulders',
      'Write one specific task for this session: "Today I am going to ___"',
      'Read it. Say it quietly. Open your material and begin.',
    ],
    when: 'The start of every study session — without exception. The two minutes invested produce better session quality than beginning immediately.',
  },
  {
    id:        'noting_technique',
    number:    '07',
    icon:      '📝',
    name:      'The Noting Technique',
    time:      'Continuous (0 min overhead)',
    timeSecs:  0,
    category:  'focus',
    situation: ['study', 'exam'],
    state:     ['distracted', 'anxious', 'scattered', 'overthinking'],
    visible:   true,
    color:     '#5B3A8B',
    bg:        '#F2EEF9',
    tagline:   'Real-time mindfulness during study — no pause needed',
    science:   'Labelling thoughts reduces their attentional pull by activating the prefrontal cortex and reducing limbic activation (Lieberman, UCLA). The noting technique applies this mechanism within the study session itself.',
    steps: [
      'Keep a small notebook beside study materials during every session',
      'When any off-task thought arrives — worry, impulse to check phone, planning — write it in one word: "exam," "phone," "lunch"',
      'Return immediately to the material. The note is acknowledgment and release.',
      'After the session, review the notes: which thought types appeared most? This builds self-knowledge about your specific distraction patterns.',
    ],
    when: 'During every study session — the notebook stays open beside the material at all times.',
  },
  {
    id:        'attention_break',
    number:    '08',
    icon:      '🌿',
    name:      'The Attention Restoration Break',
    time:      '5 minutes',
    timeSecs:  300,
    category:  'restoration',
    situation: ['study', 'home'],
    state:     ['tired', 'unfocused', 'depleted', 'fatigued'],
    visible:   true,
    color:     EMERALD,
    bg:        EPALE10,
    tagline:   'Restores study focus between sessions — not a phone break',
    science:   'Directed attention fatigue accumulates across study sessions. Open awareness practice provides the soft fascination that attention restoration theory (Kaplan) identifies as the specific antidote — restoring what directed study depletes.',
    steps: [
      'At the end of each 45-minute study block: close all materials',
      'Stand up and walk briefly — 10-15 slow steps, or gentle stretching',
      'Sit back down and close your eyes',
      'For 3 minutes: open awareness — sounds near and far, body sensations, nothing to focus on',
      'Two slow breaths. Return to study from a slightly fresher starting point.',
    ],
    when: 'After every 45-60 minutes of study, before beginning the next block. Not negotiable — this maintains session quality better than pushing through.',
  },
  {
    id:        'subject_transition',
    number:    '09',
    icon:      '🔄',
    name:      'Subject Transition Ritual',
    time:      '3 minutes',
    timeSecs:  180,
    category:  'focus',
    situation: ['study', 'home'],
    state:     ['scattered', 'distracted', 'overwhelmed', 'unfocused'],
    visible:   true,
    color:     '#C07800',
    bg:        '#FFF8E1',
    tagline:   'Reduces the 20-minute cognitive switching cost to 3 minutes',
    science:   'Task-switching costs are well-documented (Meyer & Kieras): switching without deliberate transition costs 15-25 minutes of poor-quality engagement. The ritual externalises the closure and opening that the brain needs.',
    steps: [
      'At the end of each subject: close all materials for that subject',
      'Write one sentence: "I covered ___ and my next step is ___." Close the notebook.',
      'Two minutes of breath awareness — letting the previous subject settle and clear',
      'Name the new task aloud or in writing: "Now I am going to [specific next task]"',
      'Open the new material and begin immediately with the named task.',
    ],
    when: 'Between every subject change during a multi-subject study session. Five minutes that save twenty.',
  },
  {
    id:        'mindful_walk',
    number:    '10',
    icon:      '🚶',
    name:      'The Mindful Commute',
    time:      '5-15 minutes',
    timeSecs:  300,
    category:  'restoration',
    situation: ['commute', 'corridor', 'break'],
    state:     ['stressed', 'tired', 'overstimulated', 'depleted'],
    visible:   true,
    color:     '#2D6B45',
    bg:        '#E8F4EE',
    tagline:   'Turns every walk into a mindfulness practice — zero extra time',
    science:   'Walking meditation combines physical movement (cortisol reduction) with present-moment sensory attention (DMN reduction). Attention restoration theory documents improved directed attention capacity following walks in semi-natural or varied environments.',
    steps: [
      'Phone in the bag — not in the hand. This walk is practice, not transit.',
      'Bring attention to the physical sensations of walking: the foot lifting, moving, landing',
      'Notice the rhythm of left-right alternation. Notice what you can see and hear.',
      'When attention drifts to planning or worrying, note "thinking" and return to the foot sensation',
      'Arrive at your destination having practised, not having scrolled.',
    ],
    when: 'Every commute between home and school. One walk per day minimum — used for mindfulness instead of phone time.',
  },
  {
    id:        'five_senses_quick',
    number:    '11',
    icon:      '✋',
    name:      '5-4-3-2-1 Grounding',
    time:      '3 minutes',
    timeSecs:  180,
    category:  'grounding',
    situation: ['exam', 'corridor', 'anywhere', 'study'],
    state:     ['panicking', 'overwhelmed', 'anxious', 'spiralling'],
    visible:   true,
    color:     '#C07030',
    bg:        '#FBF4EE',
    tagline:   'Interrupts any anxiety spiral within 3 minutes',
    science:   'Sensory grounding redirects attention from abstract anxiety content (which exists in imagined future/past) to specific present-moment sensory input. The specificity requirement occupies the cognitive foreground, displacing the spiral (Garfinkel, interoception research).',
    steps: [
      'Name 5 things you can see right now — specific objects, not categories',
      'Name 4 things you can physically feel — temperature, pressure, texture',
      'Name 3 things you can hear — nearby, distant, faint',
      'Name 2 things you can smell — or note the absence of smell',
      'Name 1 thing you can taste. Take a slow breath. You are here, now.',
    ],
    when: 'Before entering an exam hall, during any acute anxiety spike, when an overthinking spiral is gaining momentum.',
  },
  {
    id:        'sleep_prep',
    number:    '12',
    icon:      '🌙',
    name:      'Pre-Sleep Worry Download',
    time:      '5 minutes',
    timeSecs:  300,
    category:  'sleep',
    situation: ['home', 'pre-sleep'],
    state:     ['stressed', 'anxious', 'overthinking', 'tired'],
    visible:   true,
    color:     '#5B3A8B',
    bg:        '#F2EEF9',
    tagline:   'Clears the mental queue before sleep — reduces onset time significantly',
    science:   'Pre-sleep cognitive arousal (unresolved thoughts circulating in working memory) is the primary maintainer of insomnia (Harvey\'s cognitive model). Writing discharges the brain\'s reminder function — the worry has been noted, it no longer needs to keep recurring.',
    steps: [
      '15 minutes before bed: open a notebook. Not a phone.',
      'Write every thought currently in your head — uncensored, in any order, for 3 minutes',
      'For any actionable item, write one specific next step: "tomorrow I will ___"',
      'Write one final sentence: "These thoughts are noted. I can return to them tomorrow."',
      'Close the notebook. Do the 4-7-8 breathing (4 in, 7 hold, 8 out) three times lying down.',
    ],
    when: 'Every night before sleep — especially during exam season. The 5 minutes invested typically halve sleep onset time.',
  },
];

// ── Exercise Finder ────────────────────────────────────────────────────────────
const FINDER_SITUATIONS = [
  { key: 'classroom',  icon: '🏫', label: 'In a classroom right now' },
  { key: 'exam',       icon: '📝', label: 'Before or during an exam' },
  { key: 'corridor',   icon: '🚶', label: 'In a corridor or break space' },
  { key: 'study',      icon: '📚', label: 'At home studying' },
  { key: 'pre-sleep',  icon: '🌙', label: 'About to sleep / lying in bed' },
  { key: 'anywhere',   icon: '🌍', label: 'Anywhere — general need' },
];

const FINDER_STATES = [
  { key: 'anxious',      icon: '😰', label: 'Anxious or stressed' },
  { key: 'distracted',   icon: '🌫️', label: 'Cannot focus / mind wandering' },
  { key: 'overwhelmed',  icon: '🌊', label: 'Overwhelmed by everything' },
  { key: 'tired',        icon: '😴', label: 'Mentally tired / depleted' },
  { key: 'emotional',    icon: '💔', label: 'Emotionally unsettled' },
  { key: 'scattered',    icon: '🔀', label: 'Scattered / switching subjects' },
];

const FINDER_TIME = [
  { key: 15,   label: '< 30 sec',  icon: '⚡' },
  { key: 60,   label: '1-2 min',   icon: '🕐' },
  { key: 180,  label: '3-5 min',   icon: '🕑' },
  { key: 300,  label: '5-10 min',  icon: '🕒' },
];

function scoreExercise(ex, situation, state, timeKey) {
  let score = 0;
  if (ex.situation.includes(situation)) score += 3;
  if (ex.situation.includes('anywhere')) score += 1;
  if (ex.state.includes(state)) score += 3;
  if (timeKey === 15  && ex.timeSecs <= 30)  score += 3;
  if (timeKey === 60  && ex.timeSecs <= 120) score += 2;
  if (timeKey === 180 && ex.timeSecs <= 300) score += 2;
  if (timeKey === 300 && ex.timeSecs >= 180) score += 2;
  // Invisible bonus when in classroom
  if (situation === 'classroom' && !ex.visible) score += 2;
  return score;
}

// ── Timer Component ────────────────────────────────────────────────────────────
function ExerciseTimer({ exercise, onClose }) {
  const [phase,    setPhase]    = useState('intro');
  const [timeLeft, setTimeLeft] = useState(exercise.timeSecs || 60);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const dur = exercise.timeSecs || 60;

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

  const CIRC = 2 * Math.PI * 42;
  const pct  = dur > 0 ? (dur - timeLeft) / dur : 1;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const stepIdx = Math.min(Math.floor(pct * exercise.steps.length), exercise.steps.length - 1);

  return (
    <div style={{ background: `${exercise.color}08`, borderRadius: '14px', overflow: 'hidden', border: `2px solid ${exercise.color}30`, fontFamily: font }}>
      <div style={{ padding: '14px 18px', background: `${exercise.color}15`, borderBottom: `1px solid ${exercise.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{exercise.icon}</span>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: exercise.color }}>{exercise.name}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>

      <div style={{ padding: '18px' }}>
        {phase === 'intro' && (
          <>
            <div style={{ background: exercise.bg, borderRadius: '9px', padding: '10px 12px', marginBottom: '10px', border: `1px solid ${exercise.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: exercise.color, textTransform: 'uppercase', marginBottom: '3px' }}>🔬 WHY IT WORKS:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{exercise.science}</p>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: exercise.color, marginBottom: '6px' }}>Steps:</div>
              {exercise.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < exercise.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: exercise.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            {dur > 0 && (
              <button onClick={() => { setPhase('active'); setRunning(true); }} style={{
                width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`,
                color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
              }}>▶ Start Timer ({exercise.time})</button>
            )}
            {dur === 0 && (
              <div style={{ background: exercise.bg, borderRadius: '9px', padding: '10px 12px', textAlign: 'center', border: `1px solid ${exercise.color}25` }}>
                <p style={{ margin: 0, fontSize: '13px', color: exercise.color, fontWeight: '600' }}>📍 Use during study sessions — the notebook stays open continuously.</p>
              </div>
            )}
          </>
        )}

        {phase === 'active' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 14px auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="42" fill="none" stroke={`${exercise.color}18`} strokeWidth="6" />
                <circle cx="55" cy="55" r="42" fill="none" stroke={exercise.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (timeLeft / dur)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: done ? '20px' : '22px', fontWeight: '700', color: exercise.color, lineHeight: 1 }}>
                  {done ? '✓' : mins > 0 ? `${mins}:${secs.toString().padStart(2,'0')}` : secs}
                </div>
                {!done && <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>{mins > 0 ? 'left' : 'sec'}</div>}
              </div>
            </div>
            {!done && (
              <div style={{ background: exercise.bg, borderRadius: '9px', padding: '10px 12px', marginBottom: '12px', border: `1px solid ${exercise.color}25`, textAlign: 'left', minHeight: '60px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: exercise.color, marginBottom: '3px' }}>STEP {stepIdx + 1}:</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{exercise.steps[stepIdx]}</p>
              </div>
            )}
            {done && (
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--ink-soft)' }}>Take a moment to notice how you feel right now.</p>
            )}
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!done && (
                running
                  ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '9px 20px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                  : <button onClick={() => setRunning(true)} style={{ padding: '9px 20px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
              )}
              {done && <button onClick={() => { setTimeLeft(dur); setDone(false); setRunning(true); }} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>}
              <button onClick={() => { clearInterval(intRef.current); setPhase('intro'); setTimeLeft(dur); setRunning(false); setDone(false); }} style={{ padding: '9px 16px', borderRadius: '50px', border: `1.5px solid ${exercise.color}40`, background: 'transparent', color: exercise.color, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↩ Steps</button>
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Exercise Finder Component ──────────────────────────────────────────────────
function SchoolMindfulnessExerciseFinder() {
  const [situation,  setSituation]  = useState(null);
  const [state,      setState]      = useState(null);
  const [timeKey,    setTimeKey]    = useState(null);
  const [results,    setResults]    = useState([]);
  const [searched,   setSearched]   = useState(false);
  const [activeEx,   setActiveEx]   = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const handleFind = () => {
    if (!situation || !state || !timeKey) return;
    const scored = ALL_EXERCISES
      .map(ex => ({ ...ex, score: scoreExercise(ex, situation, state, timeKey) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setResults(scored);
    setSearched(true);
  };

  const handleReset = () => { setSituation(null); setState(null); setTimeKey(null); setResults([]); setSearched(false); setActiveEx(null); };

  const selSit = FINDER_SITUATIONS.find(s => s.key === situation);

  if (activeEx) {
    const ex = ALL_EXERCISES.find(e => e.id === activeEx);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <ExerciseTimer exercise={ex} onClose={() => setActiveEx(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        The School Mindfulness Exercise Finder
      </p>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Tell the finder where you are, how you are feeling, and how much time you have — it recommends the three best exercises for your exact moment.
      </p>

      {!searched ? (
        <>
          {/* Situation */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>Where are you right now?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {FINDER_SITUATIONS.map(s => {
                const isSel = situation === s.key;
                return (
                  <button key={s.key} onClick={() => setSituation(s.key)} style={{
                    padding: '10px 12px', borderRadius: '10px', border: '2px solid',
                    borderColor: isSel ? EMERALD : 'var(--border)', background: isSel ? EPALE10 : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: isSel ? `0 0 0 2px ${EBORD10}` : 'none',
                  }}>
                    <span style={{ fontSize: '16px' }}>{s.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: isSel ? '700' : '500', color: isSel ? EMERALD : 'var(--ink)' }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>How are you feeling?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {FINDER_STATES.map(s => {
                const isSel = state === s.key;
                return (
                  <button key={s.key} onClick={() => setState(s.key)} style={{
                    padding: '10px 12px', borderRadius: '10px', border: '2px solid',
                    borderColor: isSel ? EMERALD : 'var(--border)', background: isSel ? EPALE10 : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: isSel ? `0 0 0 2px ${EBORD10}` : 'none',
                  }}>
                    <span style={{ fontSize: '16px' }}>{s.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: isSel ? '700' : '500', color: isSel ? EMERALD : 'var(--ink)' }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>How much time do you have?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
              {FINDER_TIME.map(t => {
                const isSel = timeKey === t.key;
                return (
                  <button key={t.key} onClick={() => setTimeKey(t.key)} style={{
                    padding: '10px 6px', borderRadius: '10px', border: '2px solid',
                    borderColor: isSel ? EMERALD : 'var(--border)', background: isSel ? EPALE10 : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s',
                    boxShadow: isSel ? `0 0 0 2px ${EBORD10}` : 'none',
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '2px' }}>{t.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: isSel ? '700' : '500', color: isSel ? EMERALD : 'var(--ink)' }}>{t.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Classroom note */}
          {situation === 'classroom' && (
            <div style={{ background: EPALE10, border: `1px solid ${EBORD10}`, borderRadius: '8px', padding: '9px 12px', marginBottom: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: EMERALD, fontWeight: '600' }}>
                👁️ Classroom mode: only invisible exercises will be recommended — all can be performed without anyone noticing.
              </p>
            </div>
          )}

          <button onClick={handleFind} disabled={!situation || !state || !timeKey} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: (situation && state && timeKey) ? `linear-gradient(135deg, ${EMERALD}, #3D9B82)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: (situation && state && timeKey) ? 'pointer' : 'not-allowed', fontFamily: font,
            boxShadow: (situation && state && timeKey) ? `0 6px 18px ${EBORD10}` : 'none',
          }}>Find My Exercise →</button>
        </>
      ) : (
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          <div style={{ background: `linear-gradient(135deg, ${EMERALD}, #3D9B82)`, borderRadius: '12px', padding: '16px', marginBottom: '14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>
              Best exercises for this moment
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>
              {selSit?.label} · {FINDER_STATES.find(s => s.key === state)?.label} · {FINDER_TIME.find(t => t.key === timeKey)?.label}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {results.map((ex, i) => (
              <div key={ex.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${i === 0 ? ex.color : 'var(--border)'}` }}>
                <div style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {i === 0 && <div style={{ background: ex.color, color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>⭐ BEST MATCH</div>}
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: ex.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{ex.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: ex.color, marginBottom: '1px' }}>{ex.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{ex.time} · {ex.visible === false ? '👁️ Invisible' : 'Visual OK'}</div>
                  </div>
                  <button onClick={() => setActiveEx(ex.id)} style={{
                    padding: '8px 14px', borderRadius: '50px', border: 'none',
                    background: i === 0 ? ex.color : `${ex.color}20`,
                    color: i === 0 ? 'white' : ex.color,
                    fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font, flexShrink: 0,
                  }}>▶ {i === 0 ? 'Start' : 'Try'}</button>
                </div>
                <div style={{ padding: '0 15px 11px 15px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ex.tagline} — {ex.when}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${EBORD10}`, color: EMERALD, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Search again</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulnessExercisesSchool({ navigate, relatedPosts }) {
  const [activeListEx, setActiveListEx] = useState(null);
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
      <p>The gap between knowing that mindfulness is beneficial and actually doing it during a school day is mostly a design problem. Most mindfulness resources present practices that require dedicated time, a quiet space, and visible behaviour — none of which are available in a classroom, a study period, or the corridor between lessons. <strong>Mindfulness exercises for students</strong> need to solve a different problem: they need to work in the actual conditions where stress arrives.</p>

      <p>This guide provides twelve exercises specifically designed for school and study life — organised as a practical list you can scan, select from, and use today. Some are invisible in a classroom. Some are pre-study rituals that take three minutes. Some are restorative breaks. All are evidence-backed and all are practical in the situations where students actually are.</p>

      <img
        src={meta.imgUrl}
        alt="Mindfulness exercises for students at school and during study — classroom-friendly techniques, stress relief, and daily practice tools"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-school">1. Why Mindfulness Works in School Settings</h3>

      <p><strong>The school-specific stress problem.</strong> School stress differs from general life stress in three important ways. First, it arrives in acute spikes — the moment a test paper is handed out, the second a disappointing result is returned, the instant a difficult question is asked in class — that require immediate, in-the-moment responses rather than later processing. Second, it occurs in public settings where visible stress management behaviour is itself stressful, requiring invisible techniques. Third, it is sustained across extended sessions — 45-minute lectures, three-hour study blocks — in ways that deplete attentional resources progressively and require structured restoration rather than just reduction of acute symptoms.</p>

      <p><strong>What mindfulness specifically provides for students.</strong> Research by Zylowska and colleagues (2008) on mindfulness in high-pressure academic contexts and Zeidan and colleagues (2010) at Wake Forest on brief mindfulness training identifies four specific benefits most relevant to school life: reduced mind-wandering during demanding cognitive tasks (meaning less time lost to off-task thinking during class and study); faster attentional recovery after distraction (meaning shorter gaps between losing and regaining focus); reduced exam-period cortisol (meaning less physiological impairment of the cognitive systems needed for performance); and improved working memory capacity (meaning more cognitive resource available for learning and retention, specifically through reduced anxiety occupancy).</p>

      <p><strong>The invisibility requirement — and how it is met.</strong> Every breathing-based mindfulness technique that uses nasal breathing throughout is invisible in a classroom or exam setting. The physiological sigh performed nasally, box breathing performed nasally, the five-second hold, and extended nasal exhale breathing all produce full parasympathetic activation without audible breath sounds or visible behavioural change. The grounding techniques — feet on floor, body scan, the noting technique — require no visible action whatsoever. The exercises in this guide are specifically selected and designed to meet the invisibility requirement where the situation demands it.</p>

      {/* ── Section 2 ── */}
      <h3 id="exercises">2. Twelve Mindfulness Exercises — Complete List</h3>

      {/* Quick reference table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border)', marginBottom: '24px', fontFamily: font }}>
        <div style={{ padding: '12px 16px', background: `${EMERALD}12`, borderBottom: '1px solid var(--border)', display: 'flex', gap: '0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: EMERALD }}>
          <div style={{ width: '36px', flexShrink: 0 }}>#</div>
          <div style={{ flex: 2 }}>Exercise</div>
          <div style={{ flex: 1 }}>Time</div>
          <div style={{ flex: 1 }}>When</div>
          <div style={{ width: '60px', textAlign: 'right', flexShrink: 0 }}>Visible</div>
        </div>
        {ALL_EXERCISES.map((ex, i) => (
          <button key={ex.id} onClick={() => setActiveListEx(activeListEx === ex.id ? null : ex.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0',
            padding: '11px 16px', background: activeListEx === ex.id ? `${ex.color}08` : i % 2 === 0 ? 'white' : 'var(--sand)',
            border: 'none', borderBottom: i < ALL_EXERCISES.length - 1 ? '1px solid var(--border)' : 'none',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
          }}>
            <div style={{ width: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '14px' }}>{ex.icon}</span>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: ex.color }}>{ex.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{ex.tagline}</div>
            </div>
            <div style={{ flex: 1, fontSize: '12px', color: 'var(--muted)' }}>{ex.time}</div>
            <div style={{ flex: 1, fontSize: '11px', color: 'var(--muted)' }}>
              {ex.situation.filter(s => s !== 'anywhere').slice(0, 2).join(', ')}
            </div>
            <div style={{ width: '60px', textAlign: 'right', flexShrink: 0, fontSize: '13px' }}>
              {ex.visible === false ? <span style={{ color: ex.color, fontWeight: '700', fontSize: '11px' }}>👁️ Hidden</span> : <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Visual</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Expanded exercise detail + timer */}
      {activeListEx && (() => {
        const ex = ALL_EXERCISES.find(e => e.id === activeListEx);
        return (
          <div style={{ marginBottom: '24px', animation: 'floatUp 0.3s ease' }}>
            <ExerciseTimer exercise={ex} onClose={() => setActiveListEx(null)} />
          </div>
        );
      })()}

      {/* Full detail cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px', fontFamily: font }}>
        {ALL_EXERCISES.map(ex => (
          <div key={ex.id} style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${ex.color}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: `${ex.color}40`, flexShrink: 0, lineHeight: 1 }}>{ex.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                  <span style={{ fontSize: '18px' }}>{ex.icon}</span>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: ex.color }}>{ex.name}</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', background: ex.bg, color: ex.color, padding: '2px 8px', borderRadius: '20px' }}>{ex.time}</span>
                  {ex.visible === false && <span style={{ fontSize: '10px', fontWeight: '700', background: `${EMERALD}15`, color: EMERALD, padding: '2px 8px', borderRadius: '20px' }}>👁️ Invisible</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{ex.tagline}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{ex.science}</p>
            <div style={{ background: ex.bg, borderRadius: '10px', padding: '10px 13px', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: ex.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Steps:</div>
              <ol style={{ margin: 0, paddingLeft: '18px' }}>
                {ex.steps.map((s, i) => <li key={i} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{s}</li>)}
              </ol>
            </div>
            <div style={{ fontSize: '11px', color: ex.color, fontWeight: '600' }}>📍 Use when: {ex.when}</div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Interactive ── */}
      <h3 id="finder">3. Interactive: The School Mindfulness Exercise Finder</h3>
      <p>Tell the Finder where you are, how you are feeling, and how much time you have — it recommends the three exercises that best match your exact moment, with full instructions and a guided timer for each.</p>

      <SchoolMindfulnessExerciseFinder />

      {/* ── Section 4 ── */}
      <h3 id="stress">4. Stress Relief Exercises for Study Life</h3>

      <p><strong>The highest-impact stress exercises for students — ranked by situation.</strong></p>

      <p><strong>For acute exam stress (under 1 minute available, must be invisible):</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Exercise 01 — Invisible Physiological Sigh:</strong> Three repetitions outside the exam hall. Produces the fastest available cortisol reduction — measurable within 30 seconds.</li>
        <li><strong>Exercise 02 — Five-Second Internal Hold:</strong> For the moment inside the exam when a question triggers acute panic. One repetition restores enough prefrontal function to continue.</li>
        <li><strong>Exercise 03 — Feet on Floor:</strong> For mid-exam catastrophising. Pressing feet into the floor and naming two visible objects interrupts the future-focused anxiety spiral in under 60 seconds.</li>
      </ul>

      <p><strong>For study session anxiety (time available, at home or in a study space):</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Exercise 06 — Pre-Study Focus Ritual:</strong> The most consistently high-impact study exercise. Three minutes before opening any material reduces session anxiety and improves session quality measurably.</li>
        <li><strong>Exercise 07 — Noting Technique:</strong> Continuous, zero overhead. Noting anxiety thoughts in one word on paper removes them from working memory without suppressing them.</li>
        <li><strong>Exercise 12 — Pre-Sleep Worry Download:</strong> Addresses the study anxiety that arrives when trying to sleep. Five minutes of writing clears the mental queue that otherwise disrupts sleep onset.</li>
      </ul>

      <p><strong>For academic pressure accumulation (end of school day, high-stress periods):</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Exercise 10 — Mindful Commute:</strong> The return walk from school used mindfully — phone away, attention on the physical experience of walking — provides genuine attentional restoration and cortisol reduction from the day's accumulation.</li>
        <li><strong>Exercise 08 — Attention Restoration Break:</strong> After every 45 minutes of study. Five minutes of open awareness provides the neural restoration that prevents session quality from progressively deteriorating.</li>
        <li><strong>Exercise 11 — 5-4-3-2-1 Grounding:</strong> For the overwhelm that exam season accumulates. Three minutes of sensory anchoring reliably interrupts the multi-fear spiral that academic pressure produces.</li>
      </ul>

      <p><strong>For emotional distress at school (difficult results, social conflict, teacher interaction):</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Exercise 02 — Five-Second Internal Hold:</strong> For the immediate classroom moment when emotion threatens to overflow publicly. Invisible, immediate, effective.</li>
        <li><strong>Exercise 04 — Extended Nasal Exhale:</strong> For sustained emotional activation during a class or a period that follows a difficult event. Provides continuous parasympathetic support through the duration of the class.</li>
        <li><strong>Exercise 03 — Feet on Floor:</strong> For the dissociation or numbness that sometimes follows emotional shock. The physical anchoring restores the sense of being present rather than floating above the situation.</li>
      </ul>

      {/* ── Section 5 ── */}
      <h3 id="school-day">5. Building a Mindful School Day</h3>

      <p><strong>The three-anchor daily structure.</strong> The most effective daily structure for school mindfulness is three anchors — fixed points in the day where a specific practice occurs automatically, without requiring a daily decision. Three anchors are more sustainable than aspirational "practise whenever needed" intentions because they do not depend on remembering to practise when stress arrives — they are already occurring before the stress, as prevention rather than reaction.</p>

      <ul style={{ paddingLeft: '20px', lineHeight: '2.4' }}>
        <li><strong>Morning anchor (Exercise 01 or breath awareness, 3-5 minutes):</strong> Before any screen use, before leaving for school. Sets the attentional and physiological tone for the morning. The habit of three physiological sighs before picking up the phone — 30 seconds — is the minimum viable morning anchor.</li>
        <li><strong>Transition anchor (Exercise 06 or brief grounding, 2-3 minutes):</strong> At the beginning of each study session. The moment of sitting down at the study desk is the cue; the practice is the three-breath ritual before opening any material. This anchor addresses the most commonly lost study time: the unfocused, anxious first fifteen minutes of sessions that begin without transition.</li>
        <li><strong>Evening anchor (Exercise 12 or breath awareness, 5 minutes):</strong> Before sleeping. The worry download — five minutes of writing everything that is in the head, followed by 4-7-8 breathing — addresses pre-sleep cognitive arousal directly and produces measurable improvements in sleep onset time within one to two weeks.</li>
      </ul>

      <p><strong>The in-the-moment toolkit (memorise three).</strong> Alongside the anchored daily practices, having three specific techniques memorised well enough that they are available during acute stress — without requiring cognitive effort to remember them — is the practical difference between having tools and actually using them when they are needed. The recommended three: Exercise 01 (physiological sigh) for acute stress spikes, Exercise 03 (feet on floor) for anxiety spirals, and Exercise 11 (5-4-3-2-1) for overwhelm. These three cover the full range of acute school stress situations and are all available in under three minutes.</p>

      <p><strong>Making it last — the two-week commitment.</strong> Research on habit formation (Lally et al., UCL) shows that the minimum effective habit formation period is approximately 21 days of consistent daily execution. The most common reason mindfulness practices do not persist past the first week is the evaluation problem: students assess whether the practice is working based on how individual sessions feel, rather than on changes in daily function across two weeks. The two-week commitment — practising all three anchors daily for fourteen days without assessing the outcome — provides the data set needed to evaluate the practice accurately. After fourteen days, ask: "Is my average study session focus different from two weeks ago? Is my sleep onset faster? Am I recovering faster after difficult school moments?" These are the right questions; they yield accurate answers that individual session evaluations cannot.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Mindfulness at School FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: My friends will think I am weird if they see me doing breathing exercises. How do I deal with this?</strong><br />
        A: Every invisible technique in this guide — the physiological sigh performed nasally, the five-second hold, the extended nasal exhale, the feet on floor grounding — is genuinely undetectable. Nobody can tell the difference between nasal extended exhale breathing and ordinary quiet breathing. Nobody can tell whether you are mentally noting thoughts, pressing your feet into the floor, or attending to the physical sensation of sitting. The most effective school mindfulness techniques specifically require no visible behaviour — so the social concern, while completely understandable, is also practically unnecessary for the techniques most relevant to in-school stress management. If you prefer visible practices — for home use or private breaks — the question simply does not arise.</p>

        <p><strong>Q: I tried several exercises from this list and nothing seems to be working for my focus. What else can I do?</strong><br />
        A: A few diagnostic questions: Are you practising the exercises in calm conditions before expecting them to work in stressful ones? Techniques tried for the first time during acute stress are less effective than the same techniques practiced daily in calm conditions until automatic. Have you maintained daily practice for two weeks? The neurological changes that produce lasting focus improvement require consistent daily sessions across at least two to four weeks. Are you evaluating by session quality or by daily life changes? The right measure is whether study sessions, sleep quality, and stress recovery have changed across two weeks — not whether any individual practice session felt calm. If all three conditions are met without improvement, the focus difficulty may have a different primary driver (sleep deprivation, clinical anxiety, ADHD-related attentional differences) that would benefit from assessment and potentially different support.</p>

        <p><strong>Q: Can these exercises help with board exam preparation specifically, not just daily study?</strong><br />
        A: Yes. The exercises most directly relevant to board exam preparation are Exercise 06 (Pre-Study Focus Ritual) — used before every study session to improve session quality across the preparation period; Exercise 01 and 02 — used in the exam hall itself for acute management; Exercise 12 (Pre-Sleep Worry Download) — to protect the sleep quality that consolidates studied material; and Exercise 11 (5-4-3-2-1) — to manage the overwhelm that intensive preparation periods produce. Research by Zylowska and colleagues specifically on mindfulness in high-stakes performance contexts documents improvements in both psychological wellbeing and performance outcomes, with the greatest effects in the acute performance context — the exam itself — when the student has built the practices through consistent prior practice during preparation.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: EMERALD, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The best mindfulness exercise is the one that actually happens — in the corridor, at the desk, in the exam hall. Not the one that requires perfect conditions."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Exercise Finder above to find the right tool for right now. Pick one of the twelve exercises and try it today — not as an experiment, but as the beginning of a habit. The exercises are all here. The conditions are wherever you are.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: EMERALD, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${EBORD10}` }}
          >
            Get More Support in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: EMERALD, border: `2px solid ${EMERALD}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What Works For You
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-techniques-beginners', '→ Mindfulness Techniques for Beginners (Student Guide)'],
            ['/blog/stay-calm-school-stress',          '→ How to Stay Calm in Stressful Situations at School'],
            ['/blog/mindfulness-reduce-anxiety',       '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/mindfulness-focus-concentration',  '→ Why Mindfulness Improves Focus and Concentration'],
            ['/blog/breathing-exercises-stress',       '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/guided-meditation-students',       '→ Guided Meditation for Students: Beginner\'s Guide'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: EMERALD, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
