import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Body Awareness and Its Role in Mental Health",
  excerpt: "The body and the mind are not two separate systems that occasionally communicate — they are one system, continuously influencing each other. Body awareness is the trained capacity to notice this continuous conversation: the signals your body sends about your emotional state, your stress level, and your genuine needs. Learning to read these signals is one of the most underrated mental health skills available to students.",
  category: "Mental Health",
  date: "09-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/body-awareness-mental-health.jpg",
  tldr: "Body awareness — the capacity to notice and interpret your body's internal signals — is a trainable skill that produces direct mental health benefits: earlier recognition of stress before it escalates, improved emotional regulation, better sleep quality, and a more stable sense of self that is grounded in physical reality rather than abstract thought. This guide covers the science of the mind-body connection, the specific mental health benefits of body awareness, five practical exercises, and an interactive Body Awareness Practice Studio.",
  toc: [
    { id: "mind-body",    title: "1. The Mind-Body Connection — What the Science Shows",              level: 3 },
    { id: "benefits",     title: "2. Emotional Health Benefits of Body Awareness",                    level: 3 },
    { id: "studio",       title: "3. Interactive: The Body Awareness Practice Studio",               level: 3 },
    { id: "exercises",    title: "4. Five Body Awareness Exercises — Step by Step",                  level: 3 },
    { id: "daily",        title: "5. Bringing Body Awareness Into Student Daily Life",               level: 3 },
    { id: "faq",          title: "6. Body Awareness and Mental Health FAQs",                         level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-09T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "body awareness mental health, mind-body connection, body awareness exercises, interoception mental health, body scan benefits, emotional health body awareness, student body awareness",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is body awareness and why does it matter for mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Body awareness is the capacity to notice and interpret the internal signals your body sends — physical sensations, tension patterns, energy levels, and the physiological correlates of emotions. It is processed through interoception, a dedicated sensory system managed by the insula cortex. Research by Antonio Damasio at USC shows that emotional states are fundamentally bodily states — the physical sensations of anxiety, sadness, and excitement are not just accompaniments to emotions but their primary biological expression. Students with stronger interoceptive awareness identify emotional states earlier, regulate them more effectively, make better decisions under stress, and recover faster from setbacks.",
      },
    },
    {
      "@type": "Question",
      "name": "How does body awareness help with stress and anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Body awareness helps with stress and anxiety through earlier detection and more accurate interpretation. Stress and anxiety produce specific physical signals — muscle tension, shallow breathing, digestive changes, postural shifts — before they reach conscious awareness as emotional states. Students with developed body awareness catch these signals earlier, when intervention is easier and less costly. They also interpret ambiguous physiological arousal more accurately — a phenomenon called 'misattribution of arousal' means that unrecognised physical stress symptoms are often interpreted as psychological problems, amplifying anxiety. Body awareness converts this ambiguity into specific, addressable information.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best body awareness exercise for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The body scan meditation is the most extensively researched and most accessible body awareness exercise for students. It involves slowly moving attention through each part of the body, noticing sensations without trying to change them. Research by Kabat-Zinn and colleagues documents significant improvements in stress, anxiety, and physical health symptoms following regular body scan practice. For students with limited time, a three-minute abbreviated version (top of head to feet, slow, non-judgmental) practised daily produces measurable benefits within two weeks. The 'body check-in' — a 60-second version done before each study session — builds body awareness into the study routine without requiring additional time.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const EARTH   = '#6B4F2A';
const EPALE   = '#F7F2EC';
const EBORD   = 'rgba(107,79,42,0.22)';

// ── Practice data ──────────────────────────────────────────────────────────────
const BODY_PRACTICES = [
  {
    id:          'body_scan',
    number:      '01',
    icon:        '🧘',
    name:        'The Full Body Scan',
    subtitle:    'Systematic present-moment awareness from head to feet',
    color:       '#2D6B45',
    bg:          '#E8F4EE',
    duration:    420,
    benefit:     'Stress detection, tension release, emotional grounding',
    best_for:    'Evening wind-down, post-study session, before sleep',
    description: 'The body scan is the foundational body awareness practice — a slow, systematic movement of attention through each part of the body, noticing whatever is present without trying to change it. Unlike relaxation exercises, the body scan is primarily about noticing, not releasing. The awareness itself is the practice; any relaxation is a byproduct.',
    science:     'Research by Kabat-Zinn at UMass Medical School documented significant improvements in pain, stress, and psychological symptoms following body scan practice in MBSR programmes. fMRI studies show body scan practice specifically activates the insula cortex — the brain region responsible for interoception — producing measurable improvements in interoceptive accuracy over 8 weeks.',
    steps: [
      'Lie down or sit with the back supported. Close your eyes. Take three slow breaths.',
      'Begin at the top of the head. Notice any sensations — tingling, pressure, temperature, or nothing. Simply notice.',
      'Move slowly to the forehead, eyes, jaw. These areas commonly hold tension — notice without needing to release it.',
      'Neck and shoulders — some of the most common stress storage areas. What is here?',
      'Chest: notice the rise and fall of breath. Is the breathing deep or shallow? Any tightness?',
      'Arms, hands, fingers — notice the temperature and any tingling sensation.',
      'Belly: is it held tight or relaxed? What sensations are here?',
      'Lower back, hips. Many students carry significant tension here without awareness.',
      'Thighs, knees, calves, feet, toes. Notice the contact of feet with floor or surface.',
      'Take a breath and notice the body as a whole — one integrated system, present right now.',
    ],
    student_note: '"I used to think body scanning was about relaxing. My first session was the most tense I had ever been — because I finally noticed all the tension I was carrying without knowing. That was the beginning of being able to do something about it." — Meera',
  },
  {
    id:          'body_checkin',
    number:      '02',
    icon:        '✋',
    name:        'The 60-Second Body Check-In',
    subtitle:    'Quick emotional weather report before every session',
    color:       EARTH,
    bg:          EPALE,
    duration:    60,
    benefit:     'Emotional awareness, early stress detection, study session quality',
    best_for:    'Before every study session, before entering a stressful situation',
    description: 'The body check-in is the micro version of the body scan — a 60-second sweep of the body that functions as an emotional weather report before beginning any important activity. The premise: the body already knows your emotional state before you do. The check-in gives that knowledge a moment to surface.',
    science:     'Research by Antonio Damasio on somatic markers shows that the body generates physiological signals that precede and inform decision-making and emotional awareness. Students who practise regular brief interoceptive check-ins identify emotional states earlier and more accurately, leading to better self-regulation and decision-making under pressure.',
    steps: [
      'Before sitting down to study, pause for 60 seconds.',
      'Close your eyes or soften your gaze. Take one slow breath.',
      'Ask your body: "How am I actually doing right now?" — not the managed version, the honest one.',
      'Scan from top to bottom in about 30 seconds: head, jaw, shoulders, chest, stomach.',
      'Note one word or phrase for what you find: "tense," "tired," "okay," "anxious," "restless."',
      'This one-word check-in is information — not a problem to solve, just a reading to take.',
      'Begin the study session carrying this awareness rather than pretending the reading is not there.',
    ],
    student_note: '"Doing the check-in before studying meant I stopped being surprised by mid-session crashes. I already knew I was running low going in." — Ishaan',
  },
  {
    id:          'emotion_body_map',
    number:      '03',
    icon:        '🗺️',
    name:        'Emotion-Body Mapping',
    subtitle:    'Locate where emotions live in your body',
    color:       '#8B2635',
    bg:          '#FBF0F1',
    duration:    300,
    benefit:     'Emotional intelligence, self-understanding, regulation',
    best_for:    'After a difficult emotional experience, as a journalling companion',
    description: 'Different emotions consistently produce sensations in specific body locations. Research by Lauri Nummenmaa at Aalto University mapped emotion-body topographies across thousands of participants and found cross-culturally consistent patterns: anxiety tends to activate the chest and upper body, sadness the throat and chest, anger the upper body and arms, shame the face and chest, happiness the entire body. Mapping your own emotion-body relationship builds the specific interoceptive literacy that makes early emotion detection possible.',
    science:     'Nummenmaa et al. (2014) in PNAS documented emotion-body maps using a method where participants coloured body silhouettes to show where they felt activation or deactivation during different emotions. The patterns were remarkably consistent across cultures, suggesting emotion-body topographies are part of the universal biological architecture of emotional experience.',
    steps: [
      'Think of a recent situation that produced a clear emotion — something you can bring to mind clearly.',
      'Close your eyes and recall the situation gently — the memory is enough to produce mild versions of the original feeling.',
      'Ask: "Where in my body do I notice something right now?" Scan slowly.',
      'Note the specific location: is it in the chest? Stomach? Throat? Shoulders? Jaw?',
      'Note the quality: is it tight, warm, hollow, buzzing, heavy?',
      'Do this for 3-5 different emotions over several days. Build your personal emotion-body map.',
      'Keep a brief journal: "When I feel [emotion], I notice [sensation] in my [location]."',
    ],
    student_note: '"I discovered I get a hollow feeling just below my chest whenever I am about to avoid something I need to do. Now I recognise it as a procrastination signal before the behaviour starts." — Priya',
  },
  {
    id:          'grounding_body',
    number:      '04',
    icon:        '🌱',
    name:        'Physical Grounding Practice',
    subtitle:    'Use the body to anchor to the present moment',
    color:       '#1A7272',
    bg:          '#EBF5F5',
    duration:    120,
    benefit:     'Anxiety relief, present-moment anchoring, dissociation reduction',
    best_for:    'Acute anxiety, overthinking spirals, moments of feeling disconnected',
    description: 'Physical grounding uses specific body sensations — the weight and pressure of contact with surfaces, the temperature of objects, the physical sensation of movement — to anchor attention in the present physical moment. The body cannot be in the future or past; it is always here, now. When the mind is in a spiral, the body is the fastest available return route to the present.',
    science:     'Research on interoception and anxiety by Sarah Garfinkel at the Sackler Centre shows that students with stronger interoceptive awareness — better at detecting their own heartbeat, for example — demonstrate better regulation of anxious states than those with weaker interoceptive awareness. Physical grounding directly exercises this interoceptive awareness in conditions where it is most needed.',
    steps: [
      'Stand or sit. Press both feet firmly into the floor.',
      'Notice the exact sensation of pressure between your feet and the surface — the specific weight, the temperature, the contact area.',
      'Feel the weight of your body in the chair or on your legs — the sensation of being supported by something solid.',
      'Place both hands palm-down on a surface (your thighs, a desk). Notice the temperature, the texture, the pressure.',
      'Take one slow breath and notice the physical sensation of breathing — not the idea of it, the actual sensation.',
      'Say quietly: "My body is here. I am here. This moment is real."',
      'Return to the situation or task from this grounded place.',
    ],
    student_note: '"During a difficult conversation with my parents about results, I pressed my feet into the floor and it literally felt like finding ground when I was falling. Tiny thing, huge difference." — Rohan',
  },
  {
    id:          'tension_release',
    number:      '05',
    icon:        '🌊',
    name:        'Progressive Tension and Release',
    subtitle:    'Consciously create and release tension to build body literacy',
    color:       '#2D5A8A',
    bg:          '#EEF3FB',
    duration:    360,
    benefit:     'Physical stress relief, sleep quality, body literacy, chronic tension awareness',
    best_for:    'Evening routine, post-exam decompression, before sleep',
    description: 'Progressive muscle relaxation (PMR) involves deliberately tensing and releasing specific muscle groups — creating contrast between tension and relaxation that makes the relaxed state more identifiable and more accessible. Unlike passive relaxation, PMR actively builds the body literacy to distinguish between held tension (which is often invisible when chronic) and genuine release.',
    science:     'PMR was developed by Edmund Jacobson at the University of Chicago and has over 90 years of research support. Meta-analyses by Manzoni and colleagues (2008) document significant effects on anxiety, stress, and sleep quality. The practice works through two mechanisms: direct muscle relaxation reduces the physiological feedback of tension to the nervous system, and the deliberate awareness of tension-release contrast builds the body literacy that allows earlier tension detection in daily life.',
    steps: [
      'Lie down comfortably. Close your eyes. Take three slow breaths.',
      'Begin with feet: tense the foot muscles firmly for 5 seconds — notice the sensation of tension clearly.',
      'Release completely. Notice the contrast between tension and release — what does genuine relaxation feel like here?',
      'Move to calves: tense for 5 seconds, then release. Notice.',
      'Thighs, stomach, hands (make fists), arms, shoulders (raise toward ears), jaw (clench gently), forehead (scrunch).',
      'At each muscle group: tense 5 seconds, release, notice the contrast.',
      'After completing all groups, scan the whole body — does it feel different from when you started?',
    ],
    student_note: '"I had no idea how tense my jaw was until I deliberately made it tenser and then released it. I had been carrying it that way for months. The release felt almost emotional." — Ananya',
  },
];

// ── Body signals guide ────────────────────────────────────────────────────────
const BODY_SIGNALS = [
  { signal: 'Tight chest or throat', emotion: 'Anxiety, fear, impending stress', action: 'Three physiological sighs. Notice the constriction — it is the body\'s alarm system signalling something needs attention.' },
  { signal: 'Heavy shoulders or bowed posture', emotion: 'Sadness, depression, discouragement', action: 'Gentle shoulder rolls and a moment of self-compassion. The posture both reflects and maintains the emotional state — changing it slightly can shift the state.' },
  { signal: 'Jaw clenching or grinding', emotion: 'Suppressed anger or frustration', action: 'Consciously release the jaw three times. Ask: "What am I not saying or expressing right now?"' },
  { signal: 'Hollow or churning stomach', emotion: 'Anticipatory anxiety, dread, or the urge to avoid something', action: 'Acknowledge the signal: "Something here needs attention." Identify the specific avoided task or situation. Even the identification reduces the signal\'s intensity.' },
  { signal: 'Shallow breathing', emotion: 'Anxiety, stress, overwhelm — often accompanied by cognitive scatter', action: 'One full diaphragmatic breath: belly rises before chest. The depth of the breath directly signals to the nervous system that no immediate threat exists.' },
  { signal: 'Restless legs or inability to sit still', emotion: 'Excitement, anxiety, suppressed energy needing physical outlet', action: 'Give the body what it is asking for: five minutes of physical movement before returning to the task. Sitting on suppressed physical energy reduces cognitive capacity.' },
  { signal: 'Warmth in face and chest', emotion: 'Embarrassment, shame, or strong positive emotion', action: 'Notice and name the sensation specifically. The warmth is the body registering a moment of significant social or emotional significance — it deserves acknowledgment.' },
  { signal: 'Headache or eye tension', emotion: 'Mental fatigue, prolonged concentration, or accumulated stress', action: 'A genuine cognitive break — not a phone break, but eyes closed or physical movement for 10-15 minutes. The body is correctly identifying that the cognitive system needs genuine restoration.' },
];

// ── Practice timer ─────────────────────────────────────────────────────────────
function PracticeTimer({ practice, onClose }) {
  const [phase,    setPhase]    = useState('intro');
  const [timeLeft, setTimeLeft] = useState(practice.duration);
  const [running,  setRunning]  = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(intRef.current); setRunning(false); setPhase('done'); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  const CIRC = 2 * Math.PI * 46;
  const pct  = (practice.duration - timeLeft) / practice.duration;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const currentStepIdx = Math.min(Math.floor(pct * practice.steps.length), practice.steps.length - 1);

  return (
    <div style={{ background: `${practice.color}08`, borderRadius: '14px', overflow: 'hidden', border: `2px solid ${practice.color}30`, fontFamily: font }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', background: `${practice.color}15`, borderBottom: `1px solid ${practice.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '18px', marginRight: '8px' }}>{practice.icon}</span>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: practice.color }}>{practice.name}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>

      <div style={{ padding: '20px' }}>
        {phase === 'intro' && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{practice.description}</p>
            <div style={{ background: practice.bg, borderRadius: '10px', padding: '11px 13px', marginBottom: '12px', border: `1px solid ${practice.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: practice.color, marginBottom: '4px', textTransform: 'uppercase' }}>🔬 Science:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{practice.science}</p>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: practice.color, marginBottom: '7px' }}>Steps:</div>
              {practice.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: i < practice.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: practice.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setPhase('active'); setRunning(true); }} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`,
              color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
              boxShadow: `0 6px 16px ${practice.color}30`,
            }}>▶ Begin Guided Practice</button>
          </>
        )}

        {phase === 'active' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px auto' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="46" fill="none" stroke={`${practice.color}18`} strokeWidth="6" />
                <circle cx="60" cy="60" r="46" fill="none" stroke={practice.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: practice.color, lineHeight: 1 }}>
                  {mins}:{secs.toString().padStart(2, '0')}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>remaining</div>
              </div>
            </div>
            <div style={{ background: practice.bg, borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', border: `1px solid ${practice.color}25`, textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: practice.color, marginBottom: '4px' }}>STEP {currentStepIdx + 1} OF {practice.steps.length}:</div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, fontWeight: '500' }}>{practice.steps[currentStepIdx]}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {running
                ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                : <button onClick={() => setRunning(true)} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
              }
              <button onClick={() => { clearInterval(intRef.current); setTimeLeft(practice.duration); setRunning(false); setPhase('intro'); }} style={{ padding: '10px 18px', borderRadius: '50px', border: `1.5px solid ${practice.color}40`, background: 'transparent', color: practice.color, fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Restart</button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌱</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: practice.color, marginBottom: '8px' }}>Practice Complete</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--ink-soft)' }}>Notice: how does your body feel right now compared to when you started?</p>
            <div style={{ background: practice.bg, borderRadius: '10px', padding: '11px 13px', marginBottom: '14px', textAlign: 'left', border: `1px solid ${practice.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: practice.color, marginBottom: '3px' }}>💬 A STUDENT ON THIS PRACTICE:</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, fontStyle: 'italic' }}>{practice.student_note}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setPhase('intro'); setTimeLeft(practice.duration); setRunning(false); }} style={{ padding: '10px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Practise Again</button>
              <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back to Studio</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Body Awareness Studio ──────────────────────────────────────────────────────
function BodyAwarenessStudio() {
  const [activePract,  setActivePract]  = useState(null);
  const [showSignals,  setShowSignals]  = useState(false);
  const [openSignal,   setOpenSignal]   = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  if (activePract) {
    const practice = BODY_PRACTICES.find(p => p.id === activePract);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <PracticeTimer practice={practice} onClose={() => setActivePract(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        The Body Awareness Practice Studio
      </p>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Five guided body awareness practices with full instructions and timers — from 60 seconds to 7 minutes. Choose the practice that fits this moment.
      </p>

      {/* Practice cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
        {BODY_PRACTICES.map(p => (
          <button key={p.id} onClick={() => setActivePract(p.id)} style={{
            padding: '14px 16px', borderRadius: '12px', border: '2px solid var(--border)',
            background: 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = `${p.color}06`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, border: `1.5px solid ${p.color}25` }}>
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: p.color }}>{p.number}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{p.name}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>{p.subtitle}</div>
              <div style={{ fontSize: '11px', color: p.color, fontWeight: '600' }}>📍 {p.best_for}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: p.color, marginBottom: '3px' }}>
                {p.duration < 60 ? `${p.duration}s` : p.duration < 3600 ? `${Math.ceil(p.duration / 60)} min` : '7 min'}
              </div>
              <div style={{ fontSize: '16px', color: p.color }}>▶</div>
            </div>
          </button>
        ))}
      </div>

      {/* Body signals decoder toggle */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button onClick={() => setShowSignals(s => !s)} style={{
          width: '100%', padding: '13px 16px', borderRadius: '12px', border: `1.5px solid ${EBORD}`,
          background: showSignals ? EPALE : 'white', cursor: 'pointer', fontFamily: font,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s',
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: EARTH }}>🗺️ Body Signals Decoder</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>What is your body telling you right now?</div>
          </div>
          <span style={{ color: EARTH, fontSize: '16px' }}>{showSignals ? '▲' : '▼'}</span>
        </button>
        {showSignals && (
          <div style={{ marginTop: '10px', animation: 'floatUp 0.3s ease' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Common body signals and what they often communicate — tap any to expand.
            </p>
            {BODY_SIGNALS.map((bs, i) => {
              const isOpen = openSignal === i;
              return (
                <div key={i} style={{ background: 'white', borderRadius: '10px', marginBottom: '6px', border: `1.5px solid ${EBORD}`, overflow: 'hidden' }}>
                  <button onClick={() => setOpenSignal(isOpen ? null : i)} style={{
                    width: '100%', padding: '11px 14px', background: 'transparent', border: 'none',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left',
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: EARTH }}>{bs.signal}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>Often signals: {bs.emotion}</div>
                    </div>
                    <span style={{ color: EARTH, fontSize: '13px', flexShrink: 0, marginLeft: '8px' }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: EARTH, marginBottom: '4px', marginTop: '8px', textTransform: 'uppercase' }}>What to do:</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{bs.action}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BodyAwarenessMentalHealth({ navigate, relatedPosts }) {
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
      <p>Most students navigate their emotional lives almost entirely from the neck up — interpreting feelings through thought, managing stress through planning, addressing mental health through changing what they think. The body is largely ignored except when it becomes impossible to ignore: the headache that arrives on the third day of exams, the stomach that churns before a presentation, the jaw that has been clenched for three weeks without anyone noticing.</p>

      <p>This guide is about what happens when you start paying attention to these signals earlier — not as problems to fix but as information to read. <strong>Body awareness</strong> is the trained capacity to notice what your body is telling you before the message has become a symptom. It is one of the most underutilised tools in student mental health, and one of the most accessible.</p>

      <img
        src={meta.imgUrl}
        alt="Body awareness and its role in mental health — mind-body connection, interoception exercises, and emotional health benefits for students"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="mind-body">1. The Mind-Body Connection — What the Science Shows</h3>

      <p><strong>Interoception — the sense you were never taught about.</strong> You probably learned about five senses in school: sight, hearing, smell, taste, and touch. Research in cognitive neuroscience has documented a sixth sense that is arguably the most important for mental health: interoception — the perception of your body's internal state. Managed primarily by the insula cortex and the anterior cingulate cortex, interoception processes signals from the heart, lungs, gut, muscles, and skin, building a continuous real-time model of the body's physiological condition. Research by Hugo Critchley at the University of Sussex and Sarah Garfinkel at the Sackler Centre for Consciousness Science shows that interoceptive accuracy — how well you can detect your own internal signals — is directly correlated with emotional intelligence, anxiety regulation, and decision-making quality.</p>

      <p><strong>Antonio Damasio and the somatic marker hypothesis.</strong> Neuroscientist Antonio Damasio at the University of Southern California developed the somatic marker hypothesis — one of the most influential theories in affective neuroscience. Damasio's research showed that emotional states are fundamentally bodily states: the physiological changes that accompany emotions (changes in heart rate, breathing, muscle tension, gut sensations) are not mere accompaniments to emotional experience but its primary biological substrate. When you feel anxious, the anxiety is not just in your mind — it is in your chest, your stomach, your throat, your shoulders. When you feel defeated, the defeat is not just a thought — it is in your posture, your breathing pattern, your jaw. This means that accessing emotional states through the body is not indirect or metaphorical — it is direct.</p>

      <p><strong>The bidirectional relationship.</strong> The mind-body connection is not one-directional (mind affecting body) but bidirectional. Research by Amy Cuddy at Harvard Business School on power posture, research by Paul Ekman on facial feedback, and research by Peter Strick at the University of Pittsburgh on the cortex-to-immune-system pathway all document measurable pathways through which bodily states influence psychological and neurological function. For students, the practical implication is significant: changing the body state changes the mental state. Adopting an upright posture reduces cortisol. Slowing the breath reduces amygdala activation. Releasing jaw tension reduces the subjective sense of threat. The body is not just responding to the mind — it is shaping it continuously.</p>

      <p><strong>Alexithymia — what happens when body-emotion connection is absent.</strong> Research on alexithymia — a condition characterised by difficulty identifying and describing emotional states — shows that it is associated with significantly higher rates of anxiety, depression, somatic complaints (unexplained physical symptoms), and impaired interpersonal relationships. Alexithymia is not a binary condition; it exists on a spectrum, and many students have subclinical levels that impair their capacity to identify emotional states until they have become overwhelming. Body awareness practices directly develop the interoceptive capacity that alexithymia lacks — building the internal literacy that converts vague unease into specific, nameable, and addressable emotional states.</p>

      <p><strong>The vagus nerve — the physical highway of the mind-body connection.</strong> The vagus nerve is the longest cranial nerve in the body, running from the brainstem through the heart, lungs, and gut. It carries approximately 80% of its information upward — from body to brain — making it primarily an afferent (incoming information) pathway rather than efferent (outgoing commands). Research by Stephen Porges at Indiana University on polyvagal theory shows the vagus nerve is the primary carrier of the body's signals about safety and threat to the brain. Its activity is directly measurable through heart rate variability (HRV), and practices that increase vagal tone — including body awareness practices, slow breathing, and mindful movement — produce measurable improvements in emotional regulation, stress resilience, and social connection capacity.</p>

      {/* ── Section 2 ── */}
      <h3 id="benefits">2. Emotional Health Benefits of Body Awareness</h3>

      <p><strong>Benefit 1: Earlier emotional detection.</strong> Body awareness allows students to identify emotional states at their earliest physiological signals — before they have escalated to the intensity where they impair cognitive function and require significant intervention. The student who notices a slight chest tightening early on a study evening has information that allows a gentle course correction. The student who has not developed this awareness discovers the same process an hour later as a full anxiety spiral. The difference is entirely in the detection latency — body awareness shortens the gap between physiological event and conscious awareness, and this gap is where effective regulation happens.</p>

      <p><strong>Benefit 2: Improved emotion regulation through physiological access.</strong> Research by Lisa Feldman Barrett at Northeastern University on the theory of constructed emotion shows that emotions are not simply states that happen to us — they are constructed by the brain from a combination of physiological input and contextual interpretation. Body awareness gives direct access to the physiological input dimension of this construction — which means it provides a lever for influencing emotional experience that purely cognitive approaches do not. Changing the breathing pattern, releasing the held jaw tension, adjusting the posture — these physiological changes genuinely alter the emotional state, not by suppressing it but by changing the body signals the brain is constructing it from.</p>

      <p><strong>Benefit 3: More accurate self-knowledge.</strong> Students who develop body awareness consistently report a qualitative shift in their self-knowledge — a more accurate, less theoretically constructed sense of what they are actually feeling. Before body awareness practice, many students operate from a theoretical model of their emotional state ("I should be stressed about the exam") rather than an actual perception of it ("I notice I am feeling something closer to resignation than stress right now — this is worth examining"). The actual perception, grounded in body experience, is consistently more accurate and more useful for regulation than the theoretical model.</p>

      <p><strong>Benefit 4: Improved physical health alongside mental health.</strong> The bidirectional nature of the mind-body connection means that developing body awareness also improves physical health outcomes. Research by Kabat-Zinn on Mindfulness-Based Stress Reduction, which incorporates significant body scan practice, documents significant improvements in physical symptoms alongside psychological ones: reduced chronic pain, improved immune function, better sleep quality, and reduced inflammatory markers. For students whose physical health is often the first casualty of exam-season pressure, the physical benefits of body awareness practice provide direct performance-relevant improvements alongside the mental health ones.</p>

      <p><strong>Benefit 5: A stable, grounded sense of self.</strong> Research by Anil Seth at the Sackler Centre at Sussex proposes that the sense of self is fundamentally a prediction about the body — the brain's model of its own physical presence. This means that developing body awareness — a more accurate, more detailed, more continuously updated relationship with physical experience — directly contributes to the stability and groundedness of the sense of self. Students who practise body awareness regularly report feeling more "settled" or "present in themselves" — a quality of being in their body rather than in their thoughts that is both intrinsically valuable and specifically protective against the identity-threatening aspects of academic pressure.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="studio">3. Interactive: The Body Awareness Practice Studio</h3>
      <p>The Studio contains five guided body awareness practices from 60 seconds to 7 minutes — each with full instructions, step-by-step guidance during the timer, and a science note. It also includes a Body Signals Decoder: a reference guide to common physical sensations and what they often communicate emotionally. Use the practices for their specific benefits, and use the decoder to start learning your body's language.</p>

      <BodyAwarenessStudio />

      {/* ── Section 4 ── */}
      <h3 id="exercises">4. Five Body Awareness Exercises — Step by Step</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
        {BODY_PRACTICES.map(p => (
          <div key={p.id} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: '700', color: `${p.color}40`, flexShrink: 0, lineHeight: 1 }}>{p.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                  <span style={{ fontSize: '18px' }}>{p.icon}</span>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: p.color }}>{p.name}</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', background: p.bg, color: p.color, padding: '2px 8px', borderRadius: '20px' }}>
                    {p.duration < 60 ? `${p.duration}s` : `${Math.ceil(p.duration / 60)} min`}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{p.subtitle}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{p.description}</p>
            <div style={{ background: p.bg, borderRadius: '10px', padding: '11px 13px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: p.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Steps:</div>
              <ol style={{ margin: 0, paddingLeft: '18px' }}>
                {p.steps.slice(0, 4).map((s, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '3px' }}>{s}</li>
                ))}
              </ol>
              {p.steps.length > 4 && <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>→ Full steps available in the Practice Studio above</p>}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '12px', color: p.color, fontWeight: '600' }}>✓ {p.benefit}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>📍 Best for: {p.best_for}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 5 ── */}
      <h3 id="daily">5. Bringing Body Awareness Into Student Daily Life</h3>

      <p><strong>The check-in as a study session opener.</strong> The most natural integration point for body awareness in student life is the beginning of each study session. Before opening any material, spend 60 seconds on the body check-in practice — the one-word reading of your current physiological state. "Tired." "Tense." "Restless." "Okay." The reading has two functions: it prevents the student from sitting at the desk in a state that will undermine the session without being aware of it, and it builds the daily interoceptive habit that develops over weeks into genuine body literacy. Students who implement this consistently report fewer mid-session crashes — not because they are studying from peak physiological states but because they are aware of the state they are in and can calibrate accordingly.</p>

      <p><strong>Using physical signals as early warning systems.</strong> The Body Signals Decoder in the Studio above identifies eight common physical signals and their emotional correlates. Developing the habit of noticing these signals — not in a worried or vigilant way but in a curious, informative way — converts the body from a system that fails at inconvenient moments to one that provides continuous advance information. The student who notices shallow breathing during revision and recognises it as an anxiety signal has information that can be acted on: three physiological sighs and a brief grounding practice restore the depth of breathing that both signals and enables more effective cognitive engagement.</p>

      <p><strong>The post-exam physical reset.</strong> Exams produce significant physiological activation — elevated cortisol, muscular tension, sustained attentional effort. Most students transition from an exam directly back to studying for the next one, without any deliberate physiological reset. Research on physiological recovery from acute stress shows this compounds rather than resolves the activation. A deliberate post-exam reset — even ten minutes of progressive muscle relaxation or a slow mindful walk — produces measurably better physiological recovery and better cognitive capacity for the subsequent study session than immediately resuming study. The body needs to be told the acute threat has passed; without the reset signal, it continues operating in the activated state.</p>

      <p><strong>Posture as a continuous body awareness practice.</strong> Research by Erik Peper at San Francisco State University on upright versus slumped posture documented measurably higher levels of self-critical thought, hopelessness, and negative affect in slumped positions compared to upright ones in academic contexts. The posture is not just reflecting the mental state — it is maintaining it. Brief posture awareness checks — straightening the back, releasing the shoulders from the ears, unclenching the jaw — throughout the study day provide a continuous micro-practice of the body-mind feedback loop. Each correction is a moment of body awareness that also produces a genuine, small shift in mental state.</p>

      <p><strong>The physical signs of approaching burnout — read them early.</strong> Academic burnout has specific physical prodromal signs that appear before the psychological collapse: persistent morning fatigue despite adequate sleep (cortisol awakening response disruption), increased frequency of illness (immune suppression), persistent muscular tension that does not resolve with rest (HPA axis dysregulation), and changes in appetite and digestion. Students with developed body awareness notice these signs in their early stages and can respond with the workload reduction and recovery practices that prevent full burnout. Students without body awareness discover the same progression only after it has fully manifested — when the recovery period is significantly longer. Body awareness, in this specific context, is directly protective against one of the most significant wellbeing threats in student life.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Body Awareness and Mental Health FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I am quite disconnected from my body — I almost never notice physical sensations. Is this normal and can it change?</strong><br />
        A: It is common — and it can absolutely change. Many students, particularly those who have been in high-pressure academic environments for years, develop a cognitive-dominant mode in which physical signals are habitually deprioritised or ignored. This is not a fixed trait; it is a trained pattern of attention. Body awareness is built gradually through consistent practice — the same way attentional skills are built in other domains. Beginning with brief, structured practices like the 60-second body check-in and the body scan typically produces the first experiences of noticing internal signals within two to three weeks. Some students find that yoga, martial arts, or other physical disciplines with internal focus components develop body awareness alongside physical fitness simultaneously.</p>

        <p><strong>Q: When I do body awareness practices, I notice a lot of unpleasant physical sensations. Is this a sign I should stop?</strong><br />
        A: Noticing unpleasant sensations in body awareness practice is normal — particularly in the beginning, when chronic tension and physiological stress patterns become visible that were previously below the threshold of awareness. The question is whether the sensations are unpleasant but tolerable (which is normal and produces the awareness that allows intervention) or genuinely distressing and destabilising (which may indicate that trauma-informed support should be part of the approach). For most students, the initial discomfort of increased body awareness is similar to the initial soreness of beginning exercise — the body making itself known after being largely ignored. For students with trauma histories where physical sensations may trigger difficult material, beginning with very brief practices (the 60-second check-in rather than the 7-minute full body scan) and potentially working with a counsellor provides a more supported introduction.</p>

        <p><strong>Q: My anxiety is entirely mental — I do not experience physical symptoms. Do body awareness practices still apply to me?</strong><br />
        A: Research by Lisa Feldman Barrett on constructed emotion shows that all emotional states have physiological components, whether or not they are consciously perceived. The student who reports "entirely mental" anxiety is typically describing an anxiety experience where the physiological component has not yet been brought into conscious awareness — not an experience without one. The body scan practice specifically develops the awareness of physiological components of emotional states that feel purely cognitive. Many students who begin body awareness practice with the belief that their anxiety is entirely in their head discover, within a few weeks, physical correlates they had been carrying without awareness — shallow breathing, jaw tension, held stomach — that were contributing to the anxiety's maintenance without being noticed.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: EARTH, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Your body has been sending you signals about your inner life since before you could think in words. Learning to read them is the oldest and most reliable form of self-knowledge available."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Start with one practice from the Studio above — the 60-second body check-in is the most accessible starting point. Do it before every study session this week. By the end of the week, you will have begun developing the language for a conversation with your body that most students never learn to have — and that conversation will change how you understand and manage your mental health more than almost anything else in this guide.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: EARTH, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${EBORD}` }}
          >
            Explore in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: EARTH, border: `2px solid ${EARTH}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
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
            ['/blog/mindfulness-for-students',         '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/mindfulness-reduce-anxiety',       '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/control-thoughts-emotions',        '→ How to Control Your Thoughts and Emotions Naturally'],
            ['/blog/breathing-exercises-stress',       '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/daily-mindfulness-practice',       '→ How to Practice Mindfulness Daily for Better Mental Health'],
            ['/blog/sleep-academic-performance',       '→ How Sleep Affects Academic Performance and Mental Health'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: EARTH, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
