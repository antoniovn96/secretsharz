import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stay Calm in Stressful Situations at School",
  excerpt: "School stress is not one thing — it is five or six very specific things, each with its own texture and its own best response. The student frozen before an oral presentation needs something different from the student overwhelmed by an unexpected result. This guide covers the specific situations, the breathing techniques that work in each, and the coping methods that are genuinely practical in a school environment.",
  category: "Mental Health",
  date: "10-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/stay-calm-school-stress.jpg",
  tldr: "Staying calm at school requires situation-specific tools — not generic advice. This guide maps the most common school stressors to their most effective calming responses: breathing techniques for acute moments, mindfulness methods for sustained pressure, coping strategies for emotional overwhelm, and an interactive School Stress Response Builder that generates a personalised response plan for any school situation you are facing right now.",
  toc: [
    { id: "why-calm",    title: "1. What Happens in the Brain During School Stress",                  level: 3 },
    { id: "situations",  title: "2. Six Common School Situations — and What to Do in Each",          level: 3 },
    { id: "builder",     title: "3. Interactive: The School Stress Response Builder",                level: 3 },
    { id: "breathing",   title: "4. Breathing Techniques That Work in a School Environment",         level: 3 },
    { id: "coping",      title: "5. Practical Coping Methods for Daily School Stress",               level: 3 },
    { id: "faq",         title: "6. Staying Calm at School FAQs",                                    level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-10T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "stay calm at school, how to stay calm in school, school stress coping, calm during exams school, breathing techniques school stress, student stress school, school anxiety coping methods",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stay calm during school stress?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Staying calm during school stress requires matching the technique to the situation. For acute spikes (before a presentation, during a difficult exam moment): the physiological sigh — double inhale through nose, long exhale through mouth — reduces cortisol measurably within 30 seconds and is invisible in any school setting. For sustained background stress during exam season: daily breath awareness practice (5 minutes morning) and the body check-in before study sessions prevent the accumulation that produces acute crises. For emotional overwhelm after difficult interactions or disappointing results: the 5-4-3-2-1 sensory grounding technique anchors attention in the present environment and interrupts the spiral within 2-3 minutes.",
      },
    },
    {
      "@type": "Question",
      "name": "What do I do when I panic before an exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Immediately before an exam: three physiological sighs (double inhale through nose, long complete exhale through mouth), then press both feet into the floor and name three things you can see from where you are standing. This two-minute sequence interrupts the acute panic response physiologically and grounds attention in the present environment rather than the feared future scenario. Inside the exam, if anxiety spikes mid-paper: one extended exhale breath (in for 4, out for 8) while continuing to read. Write 'I am here now' in the paper margin if needed as a present-moment anchor. Begin with the question you know best to generate initial momentum.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I calm down quickly in class?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In a classroom, where external calming behaviours need to be invisible: the most effective techniques are physiological sigh (one slow, complete breath with extended exhale is invisible), feet-on-floor grounding (pressing feet into the floor and noticing the sensation requires no visible behaviour), and the five-second breath hold (inhale, hold 5 seconds, slow exhale) which activates the parasympathetic response without drawing attention. The key principle: all truly effective calming techniques work through physiological changes that can be performed invisibly — there is no need to leave the classroom or make anything visible.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const RUST    = '#B54F20';
const RPALE3  = '#FBF2EE';
const RBORD3  = 'rgba(181,79,32,0.22)';

// ── Situation data ─────────────────────────────────────────────────────────────
const SCHOOL_SITUATIONS = [
  {
    key:       'before_exam',
    icon:      '📝',
    label:     'Before an exam or test',
    desc:      'The waiting outside, the corridor before the hall, the five minutes before the paper begins',
    color:     '#8B2635',
    bg:        '#FBF0F1',
    what_happens: 'Pre-exam anxiety is anticipatory — the brain simulating a feared future while the actual exam has not yet begun. The amygdala activates in response to the anticipated threat, cortisol rises, the prefrontal cortex is partially downregulated, and working memory capacity shrinks. The specific experience: thoughts are racing about what might go wrong, the body feels tight, and the material you revised feels suddenly less accessible.',
    immediate_technique: 'Three physiological sighs outside the exam hall. Invisible, immediate, effective.',
    steps: [
      'Stop walking or stand still for 30 seconds',
      'Double inhale through the nose — fill completely, then top-up',
      'Long complete exhale through the mouth — empty fully',
      'Repeat twice more',
      'Press both feet into the floor and name two things you can see',
      'Say quietly: "The material I prepared is available. I am ready to begin."',
    ],
    calming_thought: '"The anxiety means I care about this. That is not a problem. I can be anxious and still answer questions well."',
    student_story: 'Aryan always felt like his mind went blank outside exam halls. He started doing the physiological sigh sequence in the corridor before entering — three times, looking at the ground, quiet and invisible. He described the difference not as becoming calm but as "going from frozen to mobile." The anxiety was still there. The paralysis was not.',
    coping_method: 'Reduce the scope: "I do not need to get everything right. I need to attempt everything I can and handle what I cannot handle calmly. That is achievable."',
  },
  {
    key:       'in_exam_blank',
    icon:      '😶',
    label:     'Blanking during an exam',
    desc:      'The mid-exam moment when a question you prepared for suddenly feels inaccessible',
    color:     '#2D5A8A',
    bg:        '#EEF3FB',
    what_happens: 'Blanking is a cortisol-mediated event — not a failure of memory but a temporary access failure produced by acute cortisol. Research on stress and memory retrieval shows that high cortisol specifically impairs the hippocampal retrieval process, making information that is stored appear temporarily inaccessible. The information is still there; the retrieval pathway is temporarily overwhelmed.',
    immediate_technique: 'The one-breath cortisol reset followed by a context cue retrieval attempt.',
    steps: [
      'When you notice the blank: do not panic — this is temporary and physiological',
      'Take one very slow breath: in through the nose for 4 counts, out through the mouth for 8',
      'Move to the next question — come back to the difficult one later',
      'On the blank question: write whatever partial knowledge you have, even one word or a related concept',
      'The partial writing activates the surrounding memory network, often releasing the block',
      'Do not stare at the blank — move, write something, move back',
    ],
    calming_thought: '"This is cortisol temporarily blocking retrieval. The information is stored. Moving on and returning often breaks the block."',
    student_story: 'Priya used to stare at blank answers until panic set in. Her teacher taught her to write "I am approaching this differently" on the paper and come back — even this physical action of writing something interrupted the freeze. She started doing this and found that by the time she returned, the answers were often accessible.',
    coping_method: 'The partial answer strategy: write any related fact, formula, or concept that is adjacent to the blank. Memory is associative — the adjacent content often triggers the blocked content.',
  },
  {
    key:       'teacher_conflict',
    icon:      '👩‍🏫',
    label:     'Difficult interaction with a teacher',
    desc:      'Being called out, receiving criticism, a tense interaction in class or after',
    color:     '#5B3A8B',
    bg:        '#F2EEF9',
    what_happens: 'Criticism from an authority figure activates the same neural systems as social threat — the brain processes it through similar pathways to physical danger. The fight-flight response may produce defensiveness, shutdown, or tearfulness. In a classroom, where both the emotion and the situation are public, the specific challenge is managing the physiological response without any visible breakdown.',
    immediate_technique: 'The invisible five-second hold — inhale, hold 5 seconds without visible breath-holding behaviour, slow exhale. Repeat once.',
    steps: [
      'The moment you feel the stress response rising: pause before speaking or reacting',
      'Inhale normally (no dramatic breathing)',
      'Hold the breath internally for 5 seconds — this is invisible from outside',
      'Exhale slowly through the nose',
      'This process activates the parasympathetic response and creates a gap between stimulus and response',
      'From this gap, choose your response rather than automatically reacting',
    ],
    calming_thought: '"I do not have to respond to every criticism immediately. Taking a moment is not weakness — it is the most effective response available."',
    student_story: 'Meera used to immediately tear up when receiving sharp criticism in class — not from sadness, from the physiological stress response. She practised the invisible hold at home until it was automatic. The first time she used it in class, she felt the emotion arrive and stay contained — "like holding it in a jar rather than letting it flood the room."',
    coping_method: 'After the interaction: find a private moment to feel the emotion fully. The classroom is not the place to process it, but the suppression is only temporary — the processing needs to happen elsewhere within the day.',
  },
  {
    key:       'peer_pressure',
    icon:      '👥',
    label:     'Peer pressure or social conflict',
    desc:      'Being excluded, pressured, or in the middle of a friendship conflict during the school day',
    color:     '#2D6B45',
    bg:        '#E8F4EE',
    what_happens: 'Social conflict produces genuine pain — research by Naomi Eisenberger at UCLA shows social rejection activates the same neural regions as physical pain. For students, navigating a peer conflict or exclusion while simultaneously required to concentrate on academic work is a significant cognitive and emotional double demand. The social pain occupies working memory and emotional regulation resources needed for class.',
    immediate_technique: 'The single-sense focus during class — giving complete attention to one aspect of the lesson as a way of managing the two-demand situation without pretending the social pain is not there.',
    steps: [
      'Acknowledge honestly to yourself: "This hurts and that is appropriate."',
      'Do not try to resolve the situation mid-class — give it a specific time later',
      'In class: choose one aspect of the lesson to attend to completely — one sentence being spoken, one diagram being drawn',
      'The single focus is not suppression — it is triage: the social pain gets a later time slot',
      'Write in your notebook: "Address [situation] at [specific later time]." The written commitment signals to the brain that it has not been abandoned',
      'After class: process with one trusted person, or write it out privately',
    ],
    calming_thought: '"I am separating this difficult situation from right now. It gets its proper time and attention — just not in this classroom, at this moment."',
    student_story: 'Rohan spent a full Chemistry lesson unable to absorb anything after a conflict with his closest friend in the corridor. He started writing "this gets time at 4pm" in his notebook when social conflicts happened during school hours. The specific time commitment reduced the urgency the social pain was creating, and his in-class concentration improved significantly.',
    coping_method: 'The 4pm rule — give every interpersonal difficulty its own dedicated processing time at a defined later point rather than having it infiltrate every academic period.',
  },
  {
    key:       'overwhelm_workload',
    icon:      '📚',
    label:     'Overwhelming workload hitting all at once',
    desc:      'Multiple deadlines, assignments, and exam preparation converging in the same week',
    color:     RUST,
    bg:        RPALE3,
    what_happens: 'Workload overwhelm is a scope problem — the prefrontal cortex is unable to simultaneously plan, prioritise, and begin when the total scope of demand is too large to hold. The specific physiological experience is a paralysis that feels like laziness but is actually the prefrontal\'s appropriate response to an impossible planning demand: it cannot produce a coherent action plan from an undifferentiated pile of everything, so it produces no action plan at all.',
    immediate_technique: 'The five-minute paper triage — externalise everything, then choose the one next action.',
    steps: [
      'Stop trying to mentally hold everything — open a notebook',
      'Write every academic demand in a list — 5 minutes maximum, uncensored',
      'Looking at the complete list: circle the one most urgent item',
      'Write the one specific task for the next 30 minutes only',
      'Ignore everything else on the list — it is acknowledged and stored',
      'Do the one task. Come back to the list for the next one after.',
    ],
    calming_thought: '"I do not have to do all of this right now. I only need to do the next thing. The next thing is manageable."',
    student_story: 'Ananya used to freeze completely when multiple deadlines arrived in the same week — "I would spend the whole evening doing nothing because I couldn\'t decide where to start." She started doing the five-minute triage as soon as the overwhelm began. "Writing it all out always made it look smaller than it felt. And circling one thing made starting possible."',
    coping_method: 'The two-task day: on overwhelming days, decide that two specific completed tasks constitute a successful day, regardless of the total list length. The completion restores the sense of agency that overwhelm removes.',
  },
  {
    key:       'bad_result',
    icon:      '📉',
    label:     'Receiving a disappointing result in school',
    desc:      'A test paper returned with a lower mark than expected, in front of peers',
    color:     '#C07800',
    bg:        '#FFF8E1',
    what_happens: 'Receiving a disappointing result in a social context — in class, visible to peers — combines the emotional impact of the result itself with the social evaluation dimension of others potentially seeing or knowing the result. The immediate response is often shame-adjacent (wanting to hide or minimise) rather than pure disappointment, which is appropriate to the private experience of the result.',
    immediate_technique: 'The private acknowledgment — a quiet internal moment of "this is disappointing and that is real" before any external behaviour.',
    steps: [
      'Do not immediately show the paper to anyone or compare scores',
      'Allow yourself one private breath: "This is not what I hoped for. That matters."',
      'Do not tell yourself you should feel differently — the disappointment is appropriate',
      'Focus on the specific marks: what did I get wrong? This is information, not a verdict',
      'Wait until after class to process the emotional content fully',
      'Tell one person honestly how you feel — not the managed version',
    ],
    calming_thought: '"This result is information about this preparation approach on this day. It is not a verdict on my capability or my future."',
    student_story: 'Ishaan used to immediately look at everyone else\'s marks whenever papers were returned, which always made the result feel worse. He made one rule: look at his own paper for five minutes before looking at anyone else\'s, and note one specific thing the paper tells him about what to study next. This five-minute private assessment window changed his relationship with returned papers entirely.',
    coping_method: 'The specific feedback extraction: within 48 hours, identify one actionable lesson from the result. Not a global judgment about ability — one specific preparation change for next time. The extraction converts the result from a source of shame into a source of information.',
  },
];

// ── Stress intensity & time available for response builder ─────────────────────
const INTENSITY_OPTIONS = [
  { key: 'mild',         icon: '🟡', label: 'Mild — I can still function, just uncomfortable' },
  { key: 'moderate',     icon: '🟠', label: 'Moderate — significantly affecting me right now' },
  { key: 'acute',        icon: '🔴', label: 'Acute — I am in the middle of it right now' },
];

const ENVIRONMENT_OPTIONS = [
  { key: 'classroom',   icon: '🏫', label: 'In a classroom or public school space' },
  { key: 'corridor',    icon: '🚶', label: 'Corridor, bathroom, or brief private space' },
  { key: 'home',        icon: '🏠', label: 'At home studying for school' },
];

const INTENSITY_NOTES = {
  mild:     'At mild intensity, the preventive techniques below are most relevant — build habits now to reduce future acute spikes.',
  moderate: 'At moderate intensity, combine an immediate regulation technique with a specific coping method for the situation.',
  acute:    'At acute intensity: physiological regulation first, everything else second. The body needs to calm before the mind can plan.',
};

const ENV_NOTES = {
  classroom: 'In a classroom, all techniques must be invisible. Every effective technique in this guide can be performed without anyone noticing. Visible emotion management — leaving the room, dramatic breathing — is not required.',
  corridor:  'In a corridor or brief private space, you have slightly more freedom. A quick physical movement (five brisk steps, shaking out the hands) combined with the physiological sigh uses the space well.',
  home:      'At home, you have access to the full toolkit. Physical movement, writing, speaking out loud, progressive muscle relaxation — all available. Use the wider range.',
};

// ── Breathing techniques for school ────────────────────────────────────────────
const SCHOOL_BREATHING = [
  {
    id:        'invisible_sigh',
    name:      'The Invisible Physiological Sigh',
    icon:      '😮‍💨',
    color:     '#1A7272',
    time:      '30 sec',
    visible:   false,
    when:      'Before entering an exam, in a tense class moment, when anxiety spikes suddenly',
    steps:     ['Double inhale through the nose — two distinct intakes', 'Hold for half a second', 'Long complete exhale through the mouth, slowly', 'Repeat up to 3 times'],
    why:       'The fastest available natural cortisol reduction — produces parasympathetic activation within 30 seconds. The double inhale can be small enough that it is completely invisible to anyone nearby.',
  },
  {
    id:        'five_hold',
    name:      'The Five-Second Hold',
    icon:      '⏱️',
    color:     '#2D5A8A',
    time:      '15 sec',
    visible:   false,
    when:      'When trying not to cry, when angry, in any emotionally intense classroom moment',
    steps:     ['Breathe in normally (no dramatic inhale)', 'Hold the breath internally for 5 seconds', 'Exhale slowly through the nose (not mouth)', 'Repeat once if needed'],
    why:       'The brief breath hold activates the diving reflex and directly lowers heart rate within seconds. Done through the nose throughout, it is completely invisible.',
  },
  {
    id:        'extended_exhale_quiet',
    name:      'Extended Exhale (Quiet Version)',
    icon:      '🌊',
    color:     '#2D6B45',
    time:      '1 min',
    visible:   false,
    when:      'During a class, reading period, or study hall when sustained anxiety needs managing',
    steps:     ['Breathe in through the nose for 3-4 counts', 'Breathe out through the nose for 6-8 counts — twice as long', 'Keep all breathing nasal — silent and invisible', 'Continue for 5-6 breaths (about 1 minute)'],
    why:       'Any exhale longer than the inhale activates the vagal brake — the parasympathetic deceleration mechanism. Nasal breathing makes it completely undetectable in a class setting.',
  },
  {
    id:        'box_desk',
    name:      'Box Breathing at the Desk',
    icon:      '⬜',
    color:     RUST,
    time:      '2 min',
    visible:   false,
    when:      'Before an exam paper begins, during a study period, in the minutes before a presentation',
    steps:     ['Appear to be reading or looking at notes — your face shows concentration, nothing else', 'Inhale through nose for 4 counts', 'Hold for 4 counts', 'Exhale through nose for 4 counts', 'Hold empty for 4 counts', 'Repeat for 4-6 cycles'],
    why:       'Box breathing produces the most balanced autonomic regulation of any brief breathing technique. Done with nasal breathing and natural posture, it is indistinguishable from focused reading.',
  },
];

// ── Response Builder ───────────────────────────────────────────────────────────
function SchoolStressResponseBuilder() {
  const [step,      setStep]      = useState(1);
  const [situation, setSituation] = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [env,       setEnv]       = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openStep,  setOpenStep]  = useState(null);
  const [showStory, setShowStory] = useState(false);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selSit  = SCHOOL_SITUATIONS.find(s => s.key === situation);
  const selInt  = INTENSITY_OPTIONS.find(i => i.key === intensity);
  const selEnv  = ENVIRONMENT_OPTIONS.find(e => e.key === env);

  const handleReset = () => { setStep(1); setSituation(null); setIntensity(null); setEnv(null); setRevealed(false); setOpenStep(null); setShowStory(false); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? RUST : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What situation are you in right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the school situation that best matches what you are experiencing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {SCHOOL_SITUATIONS.map(ss => {
              const isSel = situation === ss.key;
              return (
                <button key={ss.key} onClick={() => setSituation(ss.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? ss.color : 'var(--border)', background: isSel ? ss.bg : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${ss.color}30` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{ss.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? ss.color : 'var(--ink)', marginBottom: '2px' }}>{ss.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{ss.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (situation) setStep(2); }} disabled={!situation} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: situation ? `linear-gradient(135deg, ${RUST}, #D4693A)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: situation ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: situation ? `0 6px 18px ${RBORD3}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How intense is the stress right now?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {INTENSITY_OPTIONS.map(io => {
              const isSel = intensity === io.key;
              return (
                <button key={io.key} onClick={() => setIntensity(io.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? RUST : 'var(--border)', background: isSel ? RPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${RBORD3}` : 'none',
                }}>
                  <span style={{ fontSize: '22px' }}>{io.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? RUST : 'var(--ink)' }}>{io.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (intensity) setStep(3); }} disabled={!intensity} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: intensity ? `linear-gradient(135deg, ${RUST}, #D4693A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: intensity ? 'pointer' : 'not-allowed', fontFamily: font,
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Where are you right now?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {ENVIRONMENT_OPTIONS.map(eo => {
              const isSel = env === eo.key;
              return (
                <button key={eo.key} onClick={() => setEnv(eo.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? RUST : 'var(--border)', background: isSel ? RPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${RBORD3}` : 'none',
                }}>
                  <span style={{ fontSize: '22px' }}>{eo.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? RUST : 'var(--ink)' }}>{eo.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (env) { setStep(4); setRevealed(false); } }} disabled={!env} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: env ? `linear-gradient(135deg, ${RUST}, #D4693A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: env ? 'pointer' : 'not-allowed', fontFamily: font,
            }}>Build My Response Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — Results */}
      {step === 4 && selSit && selInt && selEnv && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your School Stress Response Plan</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${RUST}, #D4693A)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${RBORD3}`,
              }}>🧘 Generate My Response Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${selSit.color}, ${selSit.color}BB)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{selSit.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Response Plan</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>{selSit.label} · {selInt.label} · {selEnv.label}</div>
              </div>

              {/* Intensity note */}
              <div style={{ background: RPALE3, border: `1.5px solid ${RBORD3}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: RUST, marginBottom: '4px' }}>📍 At Your Intensity</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{INTENSITY_NOTES[intensity]}</p>
              </div>

              {/* Environment note */}
              <div style={{ background: 'white', border: `1.5px solid ${RBORD3}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: RUST, marginBottom: '4px' }}>{selEnv.icon} In Your Environment</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{ENV_NOTES[env]}</p>
              </div>

              {/* What's happening */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px' }}>🔬 What Is Happening</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selSit.what_happens}</p>
              </div>

              {/* Immediate technique */}
              <div style={{ background: selSit.bg, border: `2px solid ${selSit.color}30`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: selSit.color, marginBottom: '5px' }}>⚡ Immediate Technique</div>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, fontWeight: '600' }}>{selSit.immediate_technique}</p>
                <div style={{ fontSize: '11px', fontWeight: '700', color: selSit.color, marginBottom: '7px', textTransform: 'uppercase' }}>Steps:</div>
                {selSit.steps.map((s, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '9px', marginBottom: '5px', overflow: 'hidden', border: `1px solid ${selSit.color}25` }}>
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{
                        width: '100%', padding: '10px 12px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '9px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: selSit.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: selSit.color, flex: 1 }}>{s.split(' ').slice(0, 5).join(' ')}…</span>
                        <span style={{ color: selSit.color, fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 12px 9px 12px', borderTop: '1px solid var(--border)' }}>
                          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{s}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calming thought */}
              <div style={{ background: RPALE3, border: `1.5px solid ${RBORD3}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: RUST, marginBottom: '4px' }}>💭 Calming Thought</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, fontStyle: 'italic' }}>{selSit.calming_thought}</p>
              </div>

              {/* Coping method */}
              <div style={{ background: 'white', border: `1.5px solid ${RBORD3}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: RUST, marginBottom: '4px' }}>🛠️ Coping Method</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{selSit.coping_method}</p>
              </div>

              {/* Student story toggle */}
              <div style={{ background: 'white', border: `1.5px solid ${RBORD3}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <button onClick={() => setShowStory(s => !s)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: RUST }}>👤 How a student handled this</div>
                  <span style={{ color: RUST, fontSize: '14px' }}>{showStory ? '▲' : '▼'}</span>
                </button>
                {showStory && (
                  <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selSit.student_story}</p>
                  </div>
                )}
              </div>

              {/* Affirmation */}
              <div style={{ background: RPALE3, border: `1.5px dashed ${RBORD3}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: RUST, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "You cannot control what happens in school today. You can control how you respond to it."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${RBORD3}`, color: RUST, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a plan for a different situation</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Breathing timer ────────────────────────────────────────────────────────────
function SchoolBreathTimer({ tech, onClose }) {
  const [running, setRunning] = useState(false);
  const [count,   setCount]   = useState(0);
  const [phase,   setPhase]   = useState(0);
  const [reps,    setReps]    = useState(0);
  const [done,    setDone]    = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const MAX_REPS = 4;

  const PHASES = tech.id === 'invisible_sigh'
    ? [{ name: 'First inhale', dur: 2 }, { name: 'Top-up inhale', dur: 1 }, { name: 'Long exhale', dur: 6 }]
    : tech.id === 'five_hold'
    ? [{ name: 'Inhale', dur: 3 }, { name: 'Hold', dur: 5 }, { name: 'Exhale', dur: 5 }]
    : tech.id === 'extended_exhale_quiet'
    ? [{ name: 'Inhale', dur: 4 }, { name: 'Exhale (2x longer)', dur: 8 }]
    : [{ name: 'Inhale', dur: 4 }, { name: 'Hold', dur: 4 }, { name: 'Exhale', dur: 4 }, { name: 'Hold', dur: 4 }];

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intRef.current);
          setPhase(p => {
            const nextP = (p + 1) % PHASES.length;
            if (nextP === 0) {
              const newReps = reps + 1;
              setReps(newReps);
              if (newReps >= MAX_REPS) { setRunning(false); setDone(true); return p; }
            }
            const dur = PHASES[nextP].duration || PHASES[nextP].dur;
            setCount(dur);
            setRunning(true);
            return nextP;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phase, reps]);

  const start = () => { setPhase(0); setCount(PHASES[0].dur); setReps(0); setDone(false); setRunning(true); };
  const curPhase = PHASES[phase];
  const PHASE_COLORS = { 'Inhale': '#2D7D46', 'First inhale': '#2D7D46', 'Top-up inhale': '#1A7272', 'Hold': '#C07800', 'Exhale': '#2D5A8A', 'Long exhale': '#5B3A8B', 'Exhale (2x longer)': '#5B3A8B' };
  const phaseColor = PHASE_COLORS[curPhase?.name] || tech.color;

  return (
    <div style={{ background: `${tech.color}08`, borderRadius: '12px', border: `2px solid ${tech.color}30`, overflow: 'hidden', fontFamily: font }}>
      <div style={{ padding: '12px 16px', background: `${tech.color}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: tech.color }}>{tech.icon} {tech.name}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>×</button>
      </div>
      <div style={{ padding: '16px', textAlign: 'center' }}>
        {!running && !done && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65, textAlign: 'left' }}>{tech.why}</p>
            <div style={{ background: 'white', borderRadius: '9px', padding: '9px 12px', marginBottom: '12px', textAlign: 'left', border: `1px solid ${tech.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: tech.color, marginBottom: '4px' }}>
                {tech.visible === false ? '👁️ INVISIBLE IN CLASS' : ''}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{tech.when}</p>
            </div>
            <button onClick={start} style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${tech.color}, ${tech.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
              ▶ Begin ({MAX_REPS} rounds)
            </button>
          </>
        )}
        {running && (
          <>
            <div style={{ fontSize: '40px', marginBottom: '4px' }}>
              {curPhase?.name?.includes('Hold') ? '⏸' : curPhase?.name?.includes('xhale') ? '💨' : '🫁'}
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: '700', color: phaseColor, marginBottom: '2px' }}>{count}</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: phaseColor, marginBottom: '6px' }}>{curPhase?.name}</div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '10px' }}>
              {Array.from({ length: MAX_REPS }).map((_, i) => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < reps ? tech.color : 'var(--border)' }} />
              ))}
            </div>
            <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '8px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
          </>
        )}
        {done && (
          <>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: tech.color, marginBottom: '10px' }}>Complete</div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={start} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${tech.color}, ${tech.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StayCalmSchoolStress({ navigate, relatedPosts }) {
  const [activeBreathe, setActiveBreathe] = useState(null);
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
      <p>School stress is not abstract. It is the specific physical sensation in your chest outside the exam hall. It is staring at a question you revised yesterday and finding it completely inaccessible. It is sitting in a class after a difficult corridor interaction, physically present but mentally somewhere else entirely. It is watching the stack of deadlines converge in one impossible week.</p>

      <p>Generic advice about <strong>staying calm at school</strong> — "just breathe" or "don't stress" — fails because it addresses none of these situations specifically. What works is situation-specific: knowing what is happening in your brain in each situation, having the exact right technique for each context, and practising these tools enough that they are available when the stress arrives rather than remembered vaguely later.</p>

      <img
        src={meta.imgUrl}
        alt="Student staying calm in stressful school situations — breathing techniques, practical coping methods, and mindfulness strategies for school stress"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-calm">1. What Happens in the Brain During School Stress</h3>

      <p><strong>The stress response — helpful until it is not.</strong> The brain's stress response — activation of the amygdala, release of cortisol and adrenaline, partial downregulation of the prefrontal cortex — evolved to handle physical threats. In a genuinely dangerous situation, this response is exactly right: it sharpens physical reactivity, narrows attention to the immediate threat, and prepares the body for rapid action. The problem is that the same system activates during academic threats — exam anxiety, social conflict, unexpected results — which require the opposite of rapid physical action. They require the prefrontal cortex's reasoning, memory retrieval, and emotional regulation capacities — the exact systems that the stress response partially disables.</p>

      <p><strong>Cortisol and cognitive function — the specific academic cost.</strong> Research by Sonia Lupien at the Montreal Neurological Institute documents the specific cognitive costs of elevated cortisol: impaired working memory (less capacity to hold and manipulate information), reduced attentional control (more distraction, harder to maintain focus), degraded memory retrieval (information that is stored becomes temporarily harder to access), and impaired decision-making quality. These are precisely the capacities that academic performance requires. Understanding that exam anxiety is not a character failure but a cortisol-mediated cognitive impairment changes both the self-blame attached to it and the appropriate response to it.</p>

      <p><strong>The two-stage stress response and its implications for calming techniques.</strong> Research distinguishes between the initial fast threat response (amygdala-driven, near-instantaneous) and the sustained stress response (HPA axis-driven, cortisol-mediated). Calming techniques work differently on each: breathing techniques specifically address the sustained cortisol response by activating the parasympathetic nervous system; grounding techniques interrupt the amygdala's threat-simulation by redirecting attention to present sensory reality. Both stages require different tools — which is why a single technique rarely addresses all dimensions of school stress, and why knowing the right tool for the right moment is the practical skill this guide builds.</p>

      {/* ── Section 2 ── */}
      <h3 id="situations">2. Six Common School Situations — and What to Do in Each</h3>

      {SCHOOL_SITUATIONS.map(ss => (
        <div key={ss.key} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '18px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${ss.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '22px' }}>{ss.icon}</span>
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: ss.color }}>{ss.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{ss.desc}</div>
            </div>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{ss.what_happens}</p>
          <div style={{ background: ss.bg, borderRadius: '10px', padding: '11px 13px', marginBottom: '10px', border: `1px solid ${ss.color}25` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: ss.color, textTransform: 'uppercase', marginBottom: '4px' }}>⚡ Immediate technique: {ss.immediate_technique}</div>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              {ss.steps.slice(0, 3).map((s, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{s}</li>
              ))}
            </ol>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: RPALE3, borderRadius: '8px', padding: '9px 11px', border: `1px solid ${RBORD3}` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: RUST, marginBottom: '3px' }}>💭 Calming thought</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.55, fontStyle: 'italic' }}>{ss.calming_thought}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '8px', padding: '9px 11px', border: `1px solid var(--border)` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: ss.color, marginBottom: '3px' }}>🛠️ Coping method</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{ss.coping_method.split(' ').slice(0, 12).join(' ')}…</p>
            </div>
          </div>
        </div>
      ))}

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The School Stress Response Builder</h3>
      <p>The Builder generates a complete response plan for your specific school situation, stress intensity, and current environment. Choose your situation, rate the intensity, and indicate where you are — the plan includes what is happening in your brain, the right immediate technique for your context, a calming thought, a coping method, and a student story showing how someone else handled the same thing.</p>

      <SchoolStressResponseBuilder />

      {/* ── Section 4 ── */}
      <h3 id="breathing">4. Breathing Techniques That Work in a School Environment</h3>
      <p>The most important practical criterion for school breathing techniques is that they must be invisible. Leaving the room or performing visible breathing exercises is not necessary — every effective calming technique can be performed indistinguishably from normal breathing or normal studying posture. The four techniques below are specifically selected for school invisibility. Tap any to practise with a guided timer.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', fontFamily: font }}>
        {SCHOOL_BREATHING.map(t => {
          const isActive = activeBreathe === t.id;
          return (
            <div key={t.id}>
              <button onClick={() => setActiveBreathe(isActive ? null : t.id)} style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                borderColor: isActive ? t.color : 'var(--border)', background: isActive ? `${t.color}08` : 'white',
                cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: isActive ? t.color : 'var(--ink)' }}>{t.name}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', background: `${t.color}15`, color: t.color, padding: '1px 7px', borderRadius: '20px' }}>
                      {t.visible === false ? '👁️ Invisible in class' : 'Visible OK'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.when.split(',')[0]}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: t.color, textAlign: 'right' }}>{t.time}</div>
                  <div style={{ fontSize: '16px', color: t.color, textAlign: 'right' }}>{isActive ? '▲' : '▶'}</div>
                </div>
              </button>
              {isActive && (
                <div style={{ marginTop: '8px', animation: 'floatUp 0.3s ease' }}>
                  <SchoolBreathTimer tech={t} onClose={() => setActiveBreathe(null)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 5 ── */}
      <h3 id="coping">5. Practical Coping Methods for Daily School Stress</h3>

      <p><strong>1. The five-minute morning check-in — set the day's baseline.</strong> Before leaving for school, spend five minutes on a brief body check-in and a simple intention: "Today's most important thing is [one specific task or quality]." The morning check-in builds awareness of your actual physiological and emotional starting state — tired, anxious, okay — which prevents the surprise crash of discovering mid-morning that you were running on empty. The one intention provides a single point of focus when the day becomes overwhelming, replacing the paralysis of "everything is important" with the traction of "this one thing is what today is about."</p>

      <p><strong>2. The transition practice — brief resets between classes.</strong> The corridor between classes is a natural transition point that most students use for social media or social comparison. A two-minute transition practice — walking slowly and deliberately, attending to the physical sensation of movement, not checking the phone — produces a cognitive and physiological reset between the demands of successive periods. Research by Marc Berman on attention restoration shows that even brief breaks from directed cognitive effort, when used for undirected sensory experience rather than additional demands (social media), restore directed attention capacity measurably.</p>

      <p><strong>3. The reframing question — converting threat to challenge.</strong> Research by Alia Crum at Stanford on stress mindset shows that people who view stress as a performance-enhancing challenge ("this stress is activating me to perform well") show better outcomes than those who view it as a performance-undermining threat ("this stress is impairing my ability to perform"). The reframing question converts the school stress experience from threat to challenge: "What is this stress activating me to do?" Even a partial reframe — not forced positivity, but a genuine alternative interpretation — produces measurably better cognitive and physiological outcomes than the threat interpretation alone.</p>

      <p><strong>4. The post-school decompression ritual — close the day deliberately.</strong> The transition from school to home is one of the least deliberately managed transitions in most students' days. Without a deliberate closure, the school day's stress, unresolved conflicts, and accumulated cortisol travel directly into the home environment and the evening study session. A fifteen-minute post-school decompression ritual — physical movement, five minutes outdoors, a change of clothes, a brief written or mental summary of "what I am leaving at school today" — physically and psychologically closes the school chapter and opens the home chapter. Students who implement this report better quality evening study and significantly better sleep.</p>

      <p><strong>5. The supportive conversation — stress shared is stress halved.</strong> Research by James Pennebaker at the University of Texas on social disclosure shows that expressing a stressful experience to a supportive listener reduces its physiological cost — cortisol, heart rate, and reported distress all reduce following social disclosure. For students, one honest conversation per day with a friend or family member about the actual experience of the school day — not the managed version, the honest one — provides the social regulation of stress that the nervous system evolved to receive and that chronic isolation from genuine expression denies it.</p>

      <p><strong>6. The evening pre-study reset — close school, open study.</strong> For students who study at home after school, the quality of the study session is largely determined by the quality of the transition into it. A four-step pre-study reset: five minutes of physical movement, a brief body check-in, three slow breaths, and writing one specific task for the session. This sequence addresses the physiological, the interoceptive, the respiratory, and the attentional dimensions of the transition simultaneously — taking approximately eight minutes and producing a measurably better study session quality than sitting down immediately after arriving home.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Staying Calm at School FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What do I do if I start crying in class and cannot stop?</strong><br />
        A: The physiological response of tearfulness — once the threshold is crossed — has its own momentum and cannot always be stopped mid-stream. The most effective approach is to allow it to complete without amplifying it through shame: "This is my body responding to something genuinely difficult. It will pass." Practical interventions that can reduce the peak: looking up (literally tilting the head back slightly — this engages the muscles that counteract tearfulness), drinking cold water if available, and pressing the tongue firmly to the roof of the mouth. These are delay tactics rather than stops. After the immediate moment: a brief private space to allow the emotion to complete naturally is significantly more efficient than sustained suppression, which extends the duration without reducing the total emotional content that needs to pass.</p>

        <p><strong>Q: My school stress is affecting my performance significantly and nothing seems to help. What should I do?</strong><br />
        A: If school stress is persistently and significantly impairing academic performance, sleep, relationships, or daily functioning despite self-management attempts, the appropriate next step is professional support — a school counsellor, a therapist, or a doctor. The techniques in this guide are evidence-backed self-management tools for the range of stress that most students experience. For stress that has crossed into genuine clinical anxiety, academic avoidance, or significant functional impairment, professional support produces better outcomes than extended self-management without results. Seeking help is not a sign of inadequacy; it is the accurate recognition that the situation requires more than self-help tools alone.</p>

        <p><strong>Q: I know what to do but in the moment I forget everything. How do I make these tools actually available when I need them?</strong><br />
        A: The tools need to be practised in calm conditions before they are expected to work in stressful ones. A technique tried for the first time outside an exam hall, under acute stress, is unlikely to work — the cognitive resources required to execute an unfamiliar technique are not fully available during acute cortisol activation. The solution: practise the physiological sigh every morning this week — regardless of stress level — until the sequence is automatic. Practise 5-4-3-2-1 grounding in a calm moment. Once automatic, these techniques work in acute situations because they do not require significant cognitive resources to execute; they are already familiar pathways. The practice in calm is what makes the tool available in the storm.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: RUST, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The school day will have difficult moments. You do not have to face them without a plan."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Choose one technique from this guide and practise it today — not when you next need it, but now, in a calm moment, until it becomes automatic. The physiological sigh takes 30 seconds. Box breathing takes 2 minutes. Either one, practised daily for two weeks, becomes the tool you can actually reach for when the exam hall door opens and the cortisol arrives. The preparation is the calmness.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: RUST, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${RBORD3}` }}
          >
            Get Support in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: RUST, border: `2px solid ${RUST}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What Helps You
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-reduce-anxiety',       '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/breathing-exercises-stress',       '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/stay-present-stop-overthinking',   '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/mindfulness-techniques-beginners', '→ Mindfulness Techniques for Beginners (Student Guide)'],
            ['/blog/stay-calm-during-exams',           '→ How to Stay Calm and Confident During Exams'],
            ['/blog/exam-results-stress',              '→ How to Handle Exam Results Stress and Anxiety'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: RUST, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
