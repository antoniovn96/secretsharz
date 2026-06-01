import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stop Overthinking with Simple Mindfulness Techniques",
  excerpt: "Overthinking is not a personality flaw or a sign of weakness — it is a cognitive habit the brain learns and practises until it runs automatically. The good news is that habits can change. This guide uses simple mindfulness techniques — grounding exercises, breathing practices, and thought awareness tools — to interrupt overthinking at any stage and return attention to the present moment where life is actually happening.",
  category: "Mental Health",
  date: "17-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mindfulness-stop-overthinking.jpg",
  tldr: "Stopping overthinking naturally requires three parallel skills: noticing when the spiral has begun (thought awareness), interrupting the physiological activation it produces (breathing), and anchoring attention in the present moment (grounding). This guide covers all three with practical tools for each, real-life examples, and an interactive Overthinking Interrupt Station that generates a personalised technique for your exact spiral type and duration.",
  toc: [
    { id: "why-overthink",  title: "1. The Psychology of Overthinking — Why the Brain Does It",         level: 3 },
    { id: "awareness",      title: "2. Thought Awareness — Catching the Spiral Early",                  level: 3 },
    { id: "interrupt",      title: "3. Interactive: The Overthinking Interrupt Station",                level: 3 },
    { id: "breathing",      title: "4. Breathing Exercises That Stop Overthinking",                     level: 3 },
    { id: "grounding",      title: "5. Grounding Exercises for Present-Moment Anchoring",              level: 3 },
    { id: "faq",            title: "6. Stop Overthinking Naturally FAQs",                              level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-17T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "stop overthinking naturally, how to stop overthinking mindfulness, overthinking grounding exercises, mindfulness overthinking techniques, stop overthinking breathing, thought awareness mindfulness, overthinking student tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stop overthinking naturally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Stopping overthinking naturally works through three sequential steps. First, notice the spiral: catch the moment overthinking has begun — often signalled by a physical sensation (chest tightness, shallow breathing) or a cognitive sign (the same thought appearing for the third time). Second, interrupt physiologically: the physiological sigh (double inhale, long exhale) or box breathing reduces the cortisol activation that feeds overthinking. Third, anchor in the present: the 5-4-3-2-1 grounding exercise redirects attention from the abstract internal content of the spiral to specific present-moment sensory input, which the brain cannot simultaneously process alongside abstract future/past rumination. Daily mindfulness practice builds the noticing capacity that makes all three steps more reliable over weeks.",
      },
    },
    {
      "@type": "Question",
      "name": "Why does mindfulness help with overthinking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mindfulness helps with overthinking through two specific mechanisms. First, it reduces default mode network (DMN) activity — the brain network responsible for the self-referential, future-simulating, past-reviewing thought that constitutes overthinking. Research by Brewer and colleagues at Yale and Brown documents significantly reduced DMN activation in mindfulness practitioners, particularly in the posterior cingulate cortex (a key DMN hub). Second, mindfulness builds metacognitive awareness — the capacity to observe thoughts from outside rather than being inside them. This metacognitive stance converts overthinking from an automatic, immersive experience to an observable mental event, reducing its behavioural and emotional impact.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the fastest way to stop an overthinking spiral?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fastest available overthinking interruption is the physiological sigh (double inhale through the nose, long complete exhale through the mouth) combined with immediate sensory grounding (naming three specific things you can see right now). The combination works in under 60 seconds: the physiological sigh reduces the cortisol activation that feeds the spiral within 30 seconds, and the naming of three visual objects redirects attention from the abstract internal content of the overthinking to specific present-moment sensory input that the DMN's simulation activity cannot continue alongside. Practised in calm conditions until automatic, this combination is available even during acute overthinking.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const SLATE   = '#3D7080';
const SPALE10 = '#EBF4F6';
const SBORD10 = 'rgba(61,112,128,0.22)';

// ── Overthinking types ─────────────────────────────────────────────────────────
const OVERTHINK_TYPES = [
  {
    key:     'catastrophise',
    icon:    '📉',
    label:   'Catastrophising about a future outcome',
    desc:    'Imagining worst-case scenarios before they exist — exam results, career paths, relationships',
    color:   '#8B2635',
    bg:      '#FBF0F1',
    what:    'Catastrophising is anticipatory rumination — the brain simulating the feared future scenario in enough detail that the physiological stress response activates as if the event has already occurred. Research by Alia Crum at Stanford shows that uncertainty activates stronger and more sustained stress responses than even known negative outcomes, because simulation of possible bad outcomes runs continuously without the resolution that actual information would provide.',
    awareness_tip: 'Catch phrase: "What if it goes terribly wrong?" — when this phrase arrives for the third time, the spiral has begun.',
    breathing: 'box',
    grounding: 'five_senses',
    thought_tool: 'parking_lot',
    practical_advice: 'Ask: "Is there any action available right now that addresses this concern?" If yes, take it. If no, write the fear in one sentence in your notebook — the parking lot — and say: "This has been noted. The thinking cannot improve on the situation any further right now." Return to the present task.',
    example: 'Aryan would spend hours the night before results imagining specific failure scenarios in vivid detail. He started catching the third repetition of the thought — "what if I fail" appearing for the third time was his signal. At that moment, he wrote it in the parking lot notebook, set it deliberately aside, and did three rounds of box breathing. The spiral did not end completely, but it lost its grip on the evening.',
  },
  {
    key:     'past_replay',
    icon:    '🔄',
    label:   'Replaying a past event repeatedly',
    desc:    'Going over a conversation, mistake, or outcome again and again — changing nothing',
    color:   '#2D5A8A',
    bg:      '#EEF3FB',
    what:    'Post-event rumination — replaying what happened, what was said, what could have been done differently — serves a legitimate function for approximately 20 minutes after an event (extracting lessons). Beyond that window, research by Susan Nolen-Hoeksema at Yale identifies it as ruminative processing: repetitive, emotionally costly mental replay that produces no new information, no changed outcomes, and only continued distress.',
    awareness_tip: 'Catch sign: when you have reconstructed the same scene more than twice with identical content, the lesson has already been extracted. Further replay is rumination.',
    breathing: 'extended_exhale',
    grounding: 'feet_floor',
    thought_tool: 'lesson_extraction',
    practical_advice: 'Set a 20-minute "processing window" — genuinely engage with the event, extract the specific lesson, write it in one sentence. Then formally close the window: "I have processed this. The lesson is [written sentence]. Further replay adds nothing." When replay restarts, say the closing phrase and redirect to the present.',
    example: 'Meera replayed a presentation that had gone badly for three days, reconstructing moments in detail. When she started the lesson extraction practice — spending 20 minutes genuinely extracting everything useful from the event, writing it down, and then formally closing — the replay began arriving less frequently. "There was nothing more to find," she said. "I had already gotten everything from it."',
  },
  {
    key:     'comparison',
    icon:    '👥',
    label:   'Social comparison spiral',
    desc:    'Measuring yourself against others and consistently finding yourself inadequate',
    color:   '#5B3A8B',
    bg:      '#F2EEF9',
    what:    'Social comparison is a normal cognitive process. It becomes overthinking when it is constant, unidirectional (always upward, always unfavourable), and informationally invalid — comparing your complete internal experience (including all doubts and anxieties) to others\' curated external presentations, which necessarily exclude their internal experience. Research by Leon Festinger on social comparison theory shows sustained upward comparison produces anxiety and reduced self-efficacy far more reliably than motivation.',
    awareness_tip: 'Catch sign: "They are so much better than me / more prepared / more capable" — noticed more than twice in a session. The comparison is running automatically.',
    breathing: 'physio_sigh',
    grounding: 'body_anchor',
    thought_tool: 'name_and_release',
    practical_advice: 'Name the comparison explicitly: "I am comparing my internal experience to their external presentation. These are not comparable things." Redirect to personal trajectory: "How am I doing compared to last week?" is a comparable and meaningful standard. "How am I doing compared to someone else\' visible output?" is informationally worthless.',
    example: 'Priya would check the class group chat after every test and feel worse regardless of her score — better than some triggered guilt, worse than others triggered shame. She started a simple practice: look at her own paper and write one specific lesson before checking any peers\' scores. The 5-minute private assessment window changed her relationship with results by making her own experience the primary reference point.',
  },
  {
    key:     'what_if',
    icon:    '❓',
    label:   '"What if" spiral chains',
    desc:    'Chains of hypothetical worries that compound — each "what if" generating another, escalating to catastrophe',
    color:   SLATE,
    bg:      SPALE10,
    what:    'What-if thinking exploits the mind\'s capacity for hypothetical reasoning. Each "what if" generates a new uncertainty, which generates another "what if," which escalates to existential conclusions. Research by Michel Dugas at Concordia on intolerance of uncertainty identifies this as the primary overthinking pattern: each simulation attempts to achieve certainty through thinking, which always fails because certainty is not available through additional worrying — producing an escalating spiral rather than resolution.',
    awareness_tip: 'Catch sign: the first "what if" in a chain. Catching it at the first link — before the chain extends — is the most effective interruption point.',
    breathing: 'four_seven_eight',
    grounding: 'five_senses',
    thought_tool: 'useful_test',
    practical_advice: 'Apply the useful test to the first "what if": "Is there any specific action I can take right now that addresses this concern?" If yes — take it; the what-if has done its job. If no — it is an unproductive simulation. Write it in the parking lot. Return to the present action. The chain cannot extend if the first link is caught and addressed immediately.',
    example: 'Rohan\'s what-if chains began with "what if I don\'t understand integration?" and, unchecked, arrived at "what if I end up with no career?" within ten minutes. He started catching the first link — "what if I don\'t understand integration?" — and applying the useful test immediately. The answer was almost always yes, there is a useful action: open the integration chapter and do three problems. The chain never extended beyond its first link once a concrete action replaced the spiral.',
  },
  {
    key:     'people_overthink',
    icon:    '💬',
    label:   'Overthinking people and relationships',
    desc:    'Replaying conversations, worrying about others\' thoughts, analysing messages and tone',
    color:   '#2D6B45',
    bg:      '#E8F4EE',
    what:    'Social rumination activates the same neural threat systems as direct social rejection — research by Naomi Eisenberger at UCLA shows the brain processes social rejection through the same pathways as physical pain. The specific cognitive error: constructing detailed narratives about what others think, feel, or mean — from incomplete information — and treating the constructed narrative as fact. The narrative is always speculation; the brain treats it as knowledge.',
    awareness_tip: 'Catch sign: the phrase "they probably think/meant/feel ___" — this is the construction signal. You do not have access to what others think. The moment you notice construction, the spiral has begun.',
    breathing: 'extended_exhale',
    grounding: 'cold_water',
    thought_tool: 'fact_interpretation',
    practical_advice: 'Separate fact from interpretation explicitly and in writing: "The observable fact: [what actually happened]. My interpretation: [what I am constructing from it]." Stay with the fact only. Then: "Is there a direct action available that would provide actual information rather than speculation?" If yes, take it. If no — you cannot know right now; the speculation adds only distress.',
    example: 'Ananya would spend hours after family conversations replaying tone of voice and word choice, constructing interpretations. She started the fact/interpretation split on paper: "What was actually said" on one side, "What I am adding" on the other. She found the "what was actually said" column was always much shorter than the "what I am adding" column — and began noticing that the distress came almost entirely from the additions, not the facts.',
  },
];

const DURATION_OPTIONS = [
  { key: 'just_started', icon: '🟡', label: 'Just started — under 10 minutes' },
  { key: 'moderate',     icon: '🟠', label: 'Been going a while — 30+ minutes' },
  { key: 'all_day',      icon: '🔴', label: 'Most of today or longer' },
];

const BREATHING_TECHNIQUES = {
  box: {
    id: 'box', name: 'Box Breathing (4-4-4-4)', icon: '⬜', color: '#2D5A8A', bg: '#EEF3FB',
    duration: 180,
    why: 'Box breathing balances the autonomic nervous system through equal inhale, hold, exhale, hold ratios — producing the attentional grounding that overthinking disrupts.',
    phases: [
      { name: 'Inhale', secs: 4, instruction: 'Inhale slowly through the nose for 4 counts' },
      { name: 'Hold', secs: 4, instruction: 'Hold — body relaxed, no strain' },
      { name: 'Exhale', secs: 4, instruction: 'Exhale slowly through the nose or mouth for 4 counts' },
      { name: 'Hold', secs: 4, instruction: 'Hold the empty breath for 4 counts' },
    ],
    cycles: 5,
  },
  extended_exhale: {
    id: 'extended_exhale', name: 'Extended Exhale (4-8)', icon: '🌊', color: '#1A7272', bg: '#EBF5F5',
    duration: 120,
    why: 'Any exhale longer than the inhale activates the vagal brake — the parasympathetic deceleration that reverses the cortisol activation of overthinking. Simple, quiet, effective in any setting.',
    phases: [
      { name: 'Inhale', secs: 4, instruction: 'Breathe in through the nose for 4 counts' },
      { name: 'Exhale', secs: 8, instruction: 'Breathe out slowly for 8 counts — twice as long' },
    ],
    cycles: 6,
  },
  physio_sigh: {
    id: 'physio_sigh', name: 'Physiological Sigh', icon: '😮‍💨', color: SLATE, bg: SPALE10,
    duration: 45,
    why: 'The fastest available cortisol reset — research by Huberman Lab shows the double inhale plus extended exhale produces measurable parasympathetic activation within 30 seconds. Three repetitions stops the early spiral physiologically.',
    phases: [
      { name: 'First inhale', secs: 2, instruction: 'Inhale through the nose until 80% full' },
      { name: 'Top-up', secs: 1, instruction: 'One sharp additional inhale — fill completely' },
      { name: 'Long exhale', secs: 6, instruction: 'Exhale completely through the mouth — slow, total' },
    ],
    cycles: 3,
  },
  four_seven_eight: {
    id: 'four_seven_eight', name: '4-7-8 Breathing', icon: '🌙', color: '#5B3A8B', bg: '#F2EEF9',
    duration: 240,
    why: 'The extended exhale plus breath hold activates the diving reflex and produces the deepest available short-session parasympathetic activation — effective for the what-if spiral\'s high physiological arousal.',
    phases: [
      { name: 'Inhale', secs: 4, instruction: 'Inhale quietly through the nose for 4 counts' },
      { name: 'Hold', secs: 7, instruction: 'Hold the breath for 7 counts — body relaxed' },
      { name: 'Exhale', secs: 8, instruction: 'Exhale completely through the mouth for 8 counts' },
    ],
    cycles: 4,
  },
};

const GROUNDING_TECHNIQUES = {
  five_senses: {
    id: 'five_senses', name: '5-4-3-2-1 Sensory Grounding', icon: '✋', color: '#C07030', bg: '#FBF4EE',
    duration: 180,
    why: 'Redirects attention from abstract internal spiral content to specific present-moment sensory experience — the two cannot fully coexist. Specificity is essential: the more precise the sensory observation, the more thoroughly it occupies the attention the spiral was using.',
    steps: [
      'Name 5 things you can see right now — specific objects, not categories',
      'Name 4 things you can physically feel — temperature, pressure, texture, contact',
      'Name 3 things you can hear — near sounds, distant sounds, very faint',
      'Name 2 things you can smell — even very faint, or note the absence',
      'Name 1 thing you can taste. Take one slow breath. You are here, in this room, now.',
    ],
  },
  feet_floor: {
    id: 'feet_floor', name: 'Feet on Floor Anchoring', icon: '👣', color: '#2D6B45', bg: '#E8F4EE',
    duration: 60,
    why: 'The body is always in the present — overthinking is not. Directing attention to specific physical sensations anchors it to where the body actually is, pulling it out of the mental time travel of past or future spirals.',
    steps: [
      'Press both feet firmly into the floor — feel the exact pressure, temperature, contact area',
      'Feel the weight of your body in the chair or wherever you are sitting',
      'Place both hands palms-down on your thighs — notice the warmth and pressure',
      'Take one slow breath and notice the physical sensation of the chest rising',
      'Say quietly: "I am here, in this body, in this room, right now."',
    ],
  },
  body_anchor: {
    id: 'body_anchor', name: 'Body Sensation Anchor', icon: '🧘', color: '#5B3A8B', bg: '#F2EEF9',
    duration: 90,
    why: 'The social comparison spiral operates in abstract cognitive space. Redirecting attention to concrete physical sensation — the body\'s present-moment reality — directly competes with the abstract comparative mental content and pulls attention into the present.',
    steps: [
      'Close your eyes. Take one breath.',
      'Slowly clench both hands into fists — feel the tension and the pressure',
      'Release completely — notice the wave of sensation as the tension leaves',
      'Attend fully to the sensations in your hands for 30 seconds: temperature, tingling, weight',
      'Expand awareness to the whole body: "This is my body, present, right now."',
    ],
  },
  cold_water: {
    id: 'cold_water', name: 'Cold Water Reset', icon: '💧', color: '#2D5A8A', bg: '#EEF3FB',
    duration: 30,
    why: 'Cold water on the face and wrists activates the mammalian diving reflex — a direct physiological heart rate reduction. Particularly effective for social rumination, which activates the same threat systems as physical pain.',
    steps: [
      'Go to the sink. Run cold water.',
      'Splash cold water on your face — especially the forehead and temples',
      'Hold both wrists under the cold water for 20-30 seconds',
      'Notice the specific physical sensation of cold — temperature, the sound of water',
      'Dry your hands. Take a slow breath. The physiological reset is complete.',
    ],
  },
};

const THOUGHT_TOOLS = {
  parking_lot: {
    name: 'The Parking Lot', icon: '📝',
    desc: 'Externalise the thought to remove it from active mental holding.',
    steps: ['Open a dedicated notebook — your parking lot', 'Write the specific thought in one sentence only', 'Close the notebook', '"This thought is acknowledged and parked. It cannot be improved by further thinking right now."', 'Return to what you were doing before the spiral began'],
  },
  lesson_extraction: {
    name: 'Lesson Extraction + Formal Close', icon: '🎓',
    desc: 'Extract everything useful from the replayed event, then formally close the processing window.',
    steps: ['Set a 20-minute timer', 'Write everything genuinely useful that can be extracted from this event', 'Write the one-sentence lesson: "Next time I will ___"', 'Write: "Processing complete. Lesson noted. Further replay adds nothing new."', 'Close the notebook and return to the present'],
  },
  name_and_release: {
    name: 'Name, Correct, Release', icon: '🏷️',
    desc: 'Identify the comparison, correct the information error, release.',
    steps: ['Name the comparison explicitly: "I am comparing my [internal experience] to their [external presentation]"', 'Note the information error: "I do not have access to their internal experience"', 'Redirect: "My meaningful standard is my own trajectory — how am I doing compared to last week?"', 'Release: "This comparison is informationally invalid and I am releasing it"', 'Return to the present task'],
  },
  useful_test: {
    name: 'The Useful Test', icon: '🔦',
    desc: 'Apply a binary test to each what-if thought before the chain extends.',
    steps: ['At the first "what if": pause', 'Ask: "Is there a specific action available right now that addresses this concern?"', 'If YES: do it. The what-if has served its purpose.', 'If NO: write it in the parking lot. "This cannot be resolved by more thinking right now."', 'Return to the present. The chain cannot extend if the first link is caught.'],
  },
  fact_interpretation: {
    name: 'Fact vs Interpretation Split', icon: '🔬',
    desc: 'Separate what actually happened from what you are adding to it.',
    steps: ['Draw a line down the centre of a page', 'Left side: FACT — what actually, observably happened', 'Right side: INTERPRETATION — what you are adding, constructing, inferring', 'Stay with the left side only', 'Ask: "Is there a direct action that would provide actual information rather than requiring more speculation?"'],
  },
};

const DURATION_NOTES = {
  just_started: 'This is the ideal interruption moment — the spiral has not built momentum yet. The first intervention has the highest success rate here. Use the breathing technique first (30 seconds), then the grounding exercise.',
  moderate: 'The spiral has momentum now. Physiology first — the breathing technique reduces the cortisol that is feeding the spiral. Then grounding to anchor in the present. Then the thought tool to address the content.',
  all_day: 'Extended overthinking depletes physiological and cognitive resources. The priority is physical restoration: the breathing technique plus movement (a 5-minute walk before the other tools). Do not try to think your way out of an all-day spiral — reset the body first.',
};

// ── Interrupt Station Component ────────────────────────────────────────────────
function OverthinkingInterruptStation() {
  const [step,     setStep]     = useState(1);
  const [otType,   setOtType]   = useState(null);
  const [duration, setDuration] = useState(null);
  const [mode,     setMode]     = useState('select'); // select | plan | practice
  const [tool,     setTool]     = useState(null); // 'breathing' | 'grounding' | 'thought'
  const [phase,    setPhase]    = useState('intro'); // intro | active | done
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running,  setRunning]  = useState(false);
  const [cycle,    setCycle]    = useState(0);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selType  = OVERTHINK_TYPES.find(t => t.key === otType);
  const selDur   = DURATION_OPTIONS.find(d => d.key === duration);
  const breathT  = selType ? BREATHING_TECHNIQUES[selType.breathing] : null;
  const groundT  = selType ? GROUNDING_TECHNIQUES[selType.grounding] : null;
  const thoughtT = selType ? THOUGHT_TOOLS[selType.thought_tool] : null;

  // Get the active practice tech
  const activeTech = tool === 'breathing' ? breathT : tool === 'grounding' ? groundT : null;
  const phases = activeTech?.phases || [];
  const TOTAL_CYCLES = activeTech?.cycles || 3;
  const curPhase = phases[phaseIdx];

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intRef.current);
          setRunning(false);
          const nextPhaseIdx = (phaseIdx + 1) % phases.length;
          if (nextPhaseIdx === 0) {
            const newCycle = cycle + 1;
            setCycle(newCycle);
            if (newCycle >= TOTAL_CYCLES) { setPhase('done'); return 0; }
          }
          setPhaseIdx(nextPhaseIdx);
          const next = phases[nextPhaseIdx];
          setTimeLeft(next.secs);
          setRunning(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phaseIdx, cycle, phases, TOTAL_CYCLES]);

  const startPractice = () => {
    setPhaseIdx(0); setCycle(0); setPhase('active');
    setTimeLeft(phases[0].secs); setRunning(true);
  };

  const handleReset = () => {
    clearInterval(intRef.current);
    setStep(1); setOtType(null); setDuration(null); setMode('select');
    setTool(null); setPhase('intro'); setPhaseIdx(0); setTimeLeft(0);
    setRunning(false); setCycle(0);
  };

  const ChoiceBtn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{
        padding: '12px 14px', borderRadius: '11px', border: '2px solid', width: '100%', marginBottom: '7px',
        borderColor: isSel ? SLATE : 'var(--border)', background: isSel ? SPALE10 : 'white',
        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        boxShadow: isSel ? `0 0 0 2px ${SBORD10}` : 'none',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? SLATE : 'var(--ink)', marginBottom: '1px' }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: SLATE, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  // ── ACTIVE BREATHING PRACTICE ──────────────────────────────────────────────
  if (mode === 'practice' && tool === 'breathing' && breathT) {
    const CIRC = 2 * Math.PI * 42;
    const pct  = curPhase ? (curPhase.secs - timeLeft) / curPhase.secs : 0;
    const phaseColors = { 'Inhale': '#2D7D46', 'First inhale': '#2D7D46', 'Top-up': '#1A7272', 'Hold': '#C07800', 'Exhale': '#2D5A8A', 'Long exhale': '#5B3A8B' };
    const phaseColor = phaseColors[curPhase?.name] || breathT.color;

    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        {/* Header */}
        <div style={{ background: `${breathT.color}12`, borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: breathT.color }}>{breathT.icon} {breathT.name}</div>
          <button onClick={() => { clearInterval(intRef.current); setMode('plan'); setPhase('intro'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>×</button>
        </div>

        {phase === 'intro' && (
          <>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{breathT.why}</p>
            <div style={{ background: breathT.bg, borderRadius: '9px', padding: '10px 13px', marginBottom: '14px', border: `1px solid ${breathT.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: breathT.color, marginBottom: '5px', textTransform: 'uppercase' }}>Pattern: {breathT.cycles} cycles</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {breathT.phases.map((p, i) => (
                  <span key={i} style={{ fontSize: '11px', background: 'white', color: breathT.color, padding: '3px 9px', borderRadius: '20px', fontWeight: '600', border: `1px solid ${breathT.color}25` }}>{p.name} {p.secs}s</span>
                ))}
              </div>
            </div>
            <button onClick={startPractice} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${breathT.color}, ${breathT.color}BB)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font }}>▶ Begin {breathT.cycles} Cycles</button>
          </>
        )}

        {phase === 'active' && curPhase && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 14px auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="42" fill="none" stroke={`${breathT.color}18`} strokeWidth="6" />
                <circle cx="55" cy="55" r="42" fill="none" stroke={breathT.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (timeLeft / curPhase.secs)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: '700', color: breathT.color, lineHeight: 1 }}>{timeLeft}</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>sec</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: phaseColor, marginBottom: '3px' }}>{curPhase.name}</div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>{curPhase.instruction}</p>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '10px' }}>
              {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: i < cycle ? breathT.color : i === cycle ? `${breathT.color}60` : 'var(--border)', transition: 'all 0.3s' }} />
              ))}
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--muted)' }}>Cycle {cycle + 1} of {TOTAL_CYCLES}</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {running
                ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                : <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${breathT.color}, ${breathT.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
              }
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: breathT.color, marginBottom: '8px' }}>Breathing Complete</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>Now try the grounding exercise to anchor in the present.</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setMode('plan'); setTool('grounding'); setPhase('intro'); }} style={{ padding: '10px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${SLATE}, #5090A8)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>Next: Grounding →</button>
              <button onClick={() => { setMode('plan'); setPhase('intro'); }} style={{ padding: '10px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── PLAN VIEW ──────────────────────────────────────────────────────────────
  if (mode === 'plan' && selType && breathT && groundT && thoughtT) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${selType.color}, ${selType.color}BB)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selType.icon}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Interrupt Plan</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selType.label} · {selDur?.label}</div>
        </div>

        {/* Duration note */}
        <div style={{ background: SPALE10, border: `1.5px solid ${SBORD10}`, borderRadius: '11px', padding: '11px 14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: SLATE, textTransform: 'uppercase', marginBottom: '4px' }}>📍 At Your Duration</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{DURATION_NOTES[duration]}</p>
        </div>

        {/* What is happening */}
        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '11px', padding: '12px 14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>🧠 What Is Happening</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{selType.what}</p>
        </div>

        {/* Three-tool sequence */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: SLATE, marginBottom: '8px', letterSpacing: '1.2px' }}>🛠️ Your Three-Step Interrupt Sequence</div>

          {/* Step 1: Breathing */}
          <div style={{ background: breathT.bg, border: `2px solid ${breathT.color}30`, borderRadius: '11px', padding: '13px 14px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{breathT.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: breathT.color, textTransform: 'uppercase' }}>Step 1 — Breathing</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>{breathT.name}</div>
                </div>
              </div>
              <button onClick={() => { setTool('breathing'); setMode('practice'); setPhase('intro'); }} style={{ padding: '7px 14px', borderRadius: '50px', border: 'none', background: breathT.color, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>▶ Start</button>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{breathT.why}</p>
          </div>

          {/* Step 2: Grounding */}
          <div style={{ background: groundT.bg, border: `2px solid ${groundT.color}30`, borderRadius: '11px', padding: '13px 14px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{groundT.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: groundT.color, textTransform: 'uppercase' }}>Step 2 — Grounding</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>{groundT.name}</div>
                </div>
              </div>
              <button onClick={() => { setTool('grounding'); setMode('practice'); setPhase('intro'); }} style={{ padding: '7px 14px', borderRadius: '50px', border: 'none', background: groundT.color, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>▶ Start</button>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{groundT.why}</p>
          </div>

          {/* Step 3: Thought tool */}
          <div style={{ background: SPALE10, border: `2px solid ${SBORD10}`, borderRadius: '11px', padding: '13px 14px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px' }}>{thoughtT.icon}</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: SLATE, textTransform: 'uppercase' }}>Step 3 — Thought Tool</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>{thoughtT.name}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{thoughtT.desc}</p>
            <ol style={{ margin: 0, paddingLeft: '16px' }}>
              {thoughtT.steps.map((s, i) => <li key={i} style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '3px' }}>{s}</li>)}
            </ol>
          </div>
        </div>

        {/* Practical advice */}
        <div style={{ background: 'white', border: `1.5px solid ${selType.color}25`, borderRadius: '11px', padding: '12px 14px', marginBottom: '12px', borderLeft: `3px solid ${selType.color}` }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: selType.color, textTransform: 'uppercase', marginBottom: '4px' }}>💡 Practical Advice for This Pattern</div>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{selType.practical_advice}</p>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px' }}>
            👤 {selType.example}
          </div>
        </div>

        {/* Awareness tip */}
        <div style={{ background: SPALE10, border: `1.5px dashed ${SBORD10}`, borderRadius: '11px', padding: '11px 14px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: SLATE, textTransform: 'uppercase', marginBottom: '3px' }}>🔍 Awareness Tip — Catch It Earlier Next Time</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, fontWeight: '500' }}>{selType.awareness_tip}</p>
        </div>

        <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${SBORD10}`, color: SLATE, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Try a different spiral type</button>
      </div>
    );
  }

  // ── SELECT VIEW ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SLATE : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What type of overthinking is happening?
          </p>
          {OVERTHINK_TYPES.map(t => <ChoiceBtn key={t.key} opt={t} selected={otType} onSelect={setOtType} />)}
          <button onClick={() => { if (otType) setStep(2); }} disabled={!otType} style={{
            width: '100%', marginTop: '6px', padding: '14px', borderRadius: '10px', border: 'none',
            background: otType ? `linear-gradient(135deg, ${SLATE}, #5090A8)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: otType ? 'pointer' : 'not-allowed', fontFamily: font,
            boxShadow: otType ? `0 6px 18px ${SBORD10}` : 'none',
          }}>Next →</button>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How long has the spiral been going?
          </p>
          {DURATION_OPTIONS.map(d => <ChoiceBtn key={d.key} opt={d} selected={duration} onSelect={setDuration} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (duration) setMode('plan'); }} disabled={!duration} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: duration ? `linear-gradient(135deg, ${SLATE}, #5090A8)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: duration ? 'pointer' : 'not-allowed', fontFamily: font,
            }}>Build My Interrupt Plan →</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulnessStopOverthinking({ navigate, relatedPosts }) {
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
      <p>The human mind is extraordinarily capable of mental time travel — of visiting futures that have not happened and pasts that cannot be changed — with enough detail and enough physiological realism that the stress response activates as if the events are present. This capacity is not malfunction. It is the same mechanism that allows planning, preparation, and learning from experience. Overthinking is what happens when this mechanism runs without an off switch.</p>

      <p>Learning to <strong>stop overthinking naturally</strong> does not mean suppressing the mechanism or forcing the mind to be quiet. It means developing three specific skills: noticing when the spiral has begun (thought awareness), interrupting the physiological activation that feeds it (breathing exercises), and returning attention to the present moment where actual life is happening (grounding exercises). These three skills, practised together, produce the sustainable overthinking reduction that willpower-based approaches cannot.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to stop overthinking naturally with mindfulness techniques — grounding, breathing, and thought awareness tools"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-overthink">1. The Psychology of Overthinking — Why the Brain Does It</h3>

      <p><strong>The default mode network and its evolutionary purpose.</strong> The default mode network (DMN) — a set of brain regions including the medial prefrontal cortex, posterior cingulate cortex, and angular gyrus — activates whenever the brain is not engaged in a directed external task. Its primary functions are self-referential thinking, mental time travel (simulating past and future), and social cognition (modelling other people's minds). In evolutionary terms, these functions were valuable: reviewing past social interactions for learning, simulating possible future scenarios for preparation, and modelling others' intentions for social navigation. The problem is that in modern student life, the DMN activates the same survival-relevant simulations in response to exam results, social evaluations, and uncertain futures — generating physiologically real stress responses about cognitively imagined scenarios.</p>

      <p><strong>The uncertainty-overthinking link.</strong> Research by Michel Dugas at Concordia University on intolerance of uncertainty identifies a direct relationship: people with lower tolerance for uncertainty are significantly more likely to engage in sustained overthinking, because the overthinking represents an attempt to achieve certainty through simulation. Each simulated scenario temporarily reduces the subjective sense of uncertainty — until the simulation reveals another uncertainty, generating another simulation, producing the characteristic escalating chain. The insight: overthinking is not random; it is goal-directed. The goal is certainty. The method always fails because thinking cannot produce certainty about genuinely uncertain outcomes.</p>

      <p><strong>How overthinking maintains itself — the physiology of the spiral.</strong> Overthinking does not sustain itself only through cognitive content. The physiological activation it produces — cortisol release, amygdala activation, shallow breathing — creates a stress state that itself generates further threat-oriented thinking. Research documents this bidirectional cycle: anxious thoughts produce physiological activation; physiological activation produces more anxious thoughts. This cycle explains why cognitive strategies alone ("just stop thinking about it") rarely work for established spirals — the physiology is maintaining the cognition as much as the cognition is maintaining the physiology. Effective interruption addresses both simultaneously.</p>

      <p><strong>Why mindfulness specifically works for overthinking.</strong> Research by Judson Brewer and colleagues at Yale and Brown documented using fMRI that mindfulness practitioners show significantly reduced activity in the posterior cingulate cortex (a key DMN hub) during both meditation and resting state. Crucially, this reduction is associated with reduced "craving" — the psychological term for the urge to pursue the next thought in a spiral. Mindfulness practice builds the metacognitive capacity to observe the DMN's output from outside — to see a thought arising without following it into the spiral it would otherwise generate. This is the capacity to stop overthinking naturally: not through suppression but through the non-reactive observation that allows the thought to arise and pass without feeding it.</p>

      {/* ── Section 2 ── */}
      <h3 id="awareness">2. Thought Awareness — Catching the Spiral Early</h3>

      <p><strong>Why early detection is the most powerful intervention.</strong> An overthinking spiral's momentum increases with duration. The first moment of the spiral — the first "what if," the first replay of the event — has the least momentum and requires the least intervention to interrupt. After thirty minutes, the spiral has built physiological activation, emotional amplification, and cognitive reinforcement that require significantly more effortful intervention. The most valuable overthinking skill is therefore not any specific technique but the general capacity to notice the spiral at its beginning rather than its peak. Research on mindfulness and metacognition documents this noticing capacity as specifically developable through daily practice.</p>

      <p><strong>Catch signals for different spiral types.</strong> Different types of overthinking have characteristic early signals:</p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Catastrophising:</strong> The phrase "what if it goes terribly wrong?" arriving for the third time. The first two may be functional consideration; the third is rumination.</li>
        <li><strong>Past replay:</strong> The reconstruction of the same event with identical content for the second or third time. After the first pass, the lesson has been extracted; further replay is ruminative.</li>
        <li><strong>Comparison spiral:</strong> The thought "they are so much better than / more prepared than me" noticed in the space of a single study session.</li>
        <li><strong>What-if chains:</strong> The first "what if" in a chain. Catching the first link before the chain extends is the most efficient interruption point.</li>
        <li><strong>People overthinking:</strong> The phrase "they probably think/meant ___" — the construction signal. You are now adding interpretation to fact.</li>
      </ul>

      <p><strong>The body as the earliest signal.</strong> The body often registers the beginning of an overthinking spiral before the mind has conscious access to its content: a subtle tightening in the chest, a slight change in breathing (shallower, more rapid), a tension in the jaw or shoulders. Research on somatic awareness in anxiety shows that interoceptive awareness — the capacity to notice internal body signals — directly predicts the speed of emotional and cognitive state detection. Students who practise body awareness have earlier access to the "overthinking has begun" signal than those who operate entirely cognitively. A brief body scan at the start of each study session — 60 seconds, top to bottom, noting any obvious tension or shallowness of breathing — builds this early detection capacity over weeks.</p>

      <p><strong>The naming technique as the first interruption.</strong> Research by Lieberman at UCLA documents that verbally labelling a mental state — even in the simple form "I am overthinking right now" — activates the prefrontal cortex and reduces the activation of the regions driving the overthinking. The naming is not suppression (it does not prevent the thoughts from existing) and it is not cognitive restructuring (it does not argue with the content of the thoughts). It is observation: converting the automatic, immersive experience of being inside the spiral into the deliberate, external experience of watching it. "I notice I am catastrophising about the exam result" creates a small but genuine cognitive distance. That distance is where the interruption tools become available.</p>

      <p><strong>The "third time" rule.</strong> A practical thought awareness heuristic: when you notice the same thought has arrived for the third time in the same session, the spiral has begun. Not the first time — that may be relevant consideration. Not the second — it may be working through a genuine concern. The third time is the signal that the thinking has become repetitive and is no longer extracting new information. Write the thought in the parking lot and apply the breathing interruption. The third-time rule is simple enough to apply automatically and specific enough to distinguish genuine productive thought from ruminative cycling.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="interrupt">3. Interactive: The Overthinking Interrupt Station</h3>
      <p>The Interrupt Station generates a personalised three-step plan for your specific spiral type and duration: a targeted breathing exercise to interrupt the physiology, a grounding exercise to anchor in the present, and a thought tool specific to your pattern. It also includes a guided timer for the breathing and grounding practices. Select your spiral type and how long it has been running.</p>

      <OverthinkingInterruptStation />

      {/* ── Section 4 ── */}
      <h3 id="breathing">4. Breathing Exercises That Stop Overthinking</h3>

      <p><strong>Why breathing specifically interrupts overthinking.</strong> The physiological dimension of an overthinking spiral — cortisol elevation, shallow breathing, amygdala activation — is maintained in part by the breathing pattern itself: shallow chest breathing signals the nervous system that a threat is present, which maintains the cortisol and the anxious thought generation. Deliberate breathing produces the opposite signal. The parasympathetic activation of extended exhale breathing directly reduces cortisol and amygdala activation, restoring prefrontal capacity for the thought awareness and grounding tools that cognitive techniques require.</p>

      <p><strong>The physiological sigh — fastest interruption (30 seconds).</strong> For acute spiral moments when a brief, invisible intervention is needed: double inhale through the nose (fill completely, then a sharp top-up inhale), followed by a long, complete exhale through the mouth. Three repetitions. Research by Huberman Lab at Stanford documents this as the fastest available voluntary cortisol reduction, producing measurable parasympathetic activation within 30 seconds. The double inhale re-inflates collapsed alveoli; the extended exhale maximally activates the vagal brake. Three physiological sighs before applying any cognitive tool significantly improves the cognitive tool's effectiveness.</p>

      <p><strong>Box breathing — sustained calm (2-3 minutes).</strong> For spirals with more time available: four counts in, four counts hold, four counts out, four counts hold. Repeat four to six cycles. Box breathing produces heart rate variability improvements through the hold phases and the balanced exhale, providing the attentional grounding and autonomic balance that overthinking disrupts. Used by military, athletes, and first responders for composure in high-pressure situations — the same physiological state that overthinking disrupts in students.</p>

      <p><strong>Extended exhale (4-8) — quiet and continuous (90 seconds).</strong> For situations requiring invisible continuous calming — during class, between exam questions, in any public setting: inhale through the nose for four counts, exhale through the nose for eight counts. All-nasal breathing is silent and undetectable. Any exhale longer than the inhale activates the vagal brake continuously. This technique can be maintained throughout a class period when sustained anxiety is feeding the overthinking cycle without a break available for more deliberate practice.</p>

      <p><strong>4-7-8 breathing — for entrenched what-if chains (4 minutes).</strong> For the what-if chain's high physiological arousal and for any overthinking that has persisted for more than 30 minutes: four counts in, seven hold, eight out. The extended hold activates the diving reflex (direct heart rate reduction) and the eight-count exhale is the strongest available exhale-to-inhale ratio in common practice. The depth of parasympathetic activation produced by this technique is particularly effective for high-arousal overthinking states where the standard extended exhale is not producing sufficient calm.</p>

      {/* ── Section 5 ── */}
      <h3 id="grounding">5. Grounding Exercises for Present-Moment Anchoring</h3>

      <p><strong>Why grounding works on overthinking.</strong> Overthinking exists in abstract cognitive space — the imagined future of catastrophising, the reconstructed past of replay, the hypothetical scenarios of what-if chains. None of these exist in the present sensory moment. The body, and specific sensory experience, are always in the present. Grounding techniques redirect attention from abstract internal content to concrete present-moment sensory experience — and the two cannot fully coexist. The more specific and detailed the sensory attention, the more thoroughly it occupies the cognitive foreground that the overthinking was using.</p>

      <p><strong>5-4-3-2-1 sensory grounding — universal interruption (3 minutes).</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li>Name <strong>five things you can see</strong> right now — specific objects, not categories ("the blue spine of the Chemistry textbook," not "books")</li>
        <li>Name <strong>four things you can physically feel</strong> — the temperature of the air, the pressure of the chair against your back, the fabric of your clothes, the floor under your feet</li>
        <li>Name <strong>three things you can hear</strong> — nearby sounds, distant sounds, and a very faint sound</li>
        <li>Name <strong>two things you can smell</strong> — even very faint, or note the relative absence</li>
        <li>Name <strong>one thing you can taste</strong></li>
        <li>Take one slow breath. Say quietly: "I am here. This is now. The spiral was somewhere else."</li>
      </ul>

      <p><strong>Feet on floor — quickest anchoring (60 seconds).</strong> Press both feet firmly into the floor and attend specifically to the sensation: the exact pressure, the temperature, the contact area. Feel the weight of the body in the chair. Place both hands palms-down on the thighs and notice the warmth and pressure. One slow breath noticing the physical sensation of the chest rising. The body is always present; redirecting attention to it pulls it out of the mental time travel of the spiral. This technique is invisible and requires no preparation — it can be applied in a classroom, an exam hall, or anywhere.</p>

      <p><strong>Cold water reset — for social and emotional spirals.</strong> For social rumination and social comparison spirals that have the same neural activation as physical pain: running cold water over the face and wrists activates the mammalian diving reflex, producing direct heart rate reduction and a physical sensation specific and intense enough to redirect attention from the spiral's abstract content. The cold water is an immediate physical present-moment experience — specific, undeniable, and incompatible with simultaneous elaborate social speculation.</p>

      <p><strong>The mindful object focus — for study-environment use.</strong> Choose one object in your study space — a pen, a plant, a specific book, anything with visual texture or detail. For 90 seconds, give the object your complete visual attention as if you have never seen anything like it before: its colours, the gradients in the colour, the texture, any irregularities. The deliberate engagement of the visual attentional system with a specific present object is a grounding technique that requires nothing except the object — and the specificity of the visual engagement effectively crowds out the abstract internal content of the spiral.</p>

      <p><strong>The "what is actually true right now?" anchor.</strong> In any overthinking spiral — particularly catastrophising and what-if chains — pause and ask: "What is actually, factually true right now, in this present moment?" Not what might be true, not what could be true, not what was or might become true. What is true right now. "Right now I am sitting at this desk. Right now the exam has not happened yet. Right now I am studying for it." The present-tense factual description is always less threatening than the simulated future the spiral is generating — and returning to it repeatedly builds the habit of present-moment orientation that makes grounding techniques more immediately effective over weeks of daily practice.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Stop Overthinking Naturally FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried grounding exercises and the thoughts just come back immediately. Does this mean they are not working?</strong><br />
        A: The thoughts returning after a grounding exercise is expected and completely normal — it does not mean the exercise failed. The exercise was never intended to permanently eliminate the thought; it was intended to interrupt the spiral's momentum and return attention to the present for one cycle. The next cycle of the spiral beginning is not failure — it is the signal to apply the grounding again. The relevant measure is not whether the thought has stopped entirely but whether the spiral has lost intensity or duration through the intervention. Most people who practise grounding consistently notice, across two to four weeks, that the spirals are shorter, the returns to the spiral are less urgent, and the grounding techniques become effective more quickly as they become more familiar.</p>

        <p><strong>Q: My overthinking is so automatic I do not even realise it is happening until I am deep inside it. How can I catch it earlier?</strong><br />
        A: The awareness capacity that allows early detection of spirals is itself built through daily mindfulness practice — it is not a skill that either exists fully or does not. Two practices specifically build the early detection capacity: the daily body scan (60 seconds each morning, noticing the physical signals of early activation — shallow breathing, jaw tension, chest tightening) and the daily thought noticing practice (three to five minutes of sitting and watching thoughts without following them, which builds the metacognitive "noticing from outside" capacity over weeks). Both practices develop the background awareness that makes the "overthinking has begun" signal available earlier. In the meantime, the third-time rule — applying the interrupt sequence at the third repetition of any thought — provides a behavioural trigger that does not require prior noticing.</p>

        <p><strong>Q: Is there a difference between helpful planning/reflection and unhelpful overthinking?</strong><br />
        A: Yes, and the distinction is practically important. The key markers of productive thinking: it is moving (producing new information, decisions, or plans with each cycle), it has an endpoint (when the useful output is produced, the thinking stops), and it produces some form of resolution (a decision, a plan, a written lesson). The key markers of overthinking: it is cycling (the same content appearing repeatedly without new information), it has no natural endpoint (it could continue indefinitely), and it produces only more anxiety rather than resolution. The practical test: "Am I learning something new or deciding something right now?" If yes — this is productive thinking, even if uncomfortable. If no — this is overthinking, and the interrupt tools are appropriate.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SLATE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The present moment is the only place where anything useful can happen. The spiral is always somewhere else — in a future that has not happened or a past that cannot change. Come back here."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Interrupt Station above to find your specific tools. Try the physiological sigh and one grounding exercise today — in a moment of ordinary mild anxiety, not a crisis — so they are automatic when the spiral arrives at its worst. The practice in calm is what makes the tool available in the storm.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SLATE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD10}` }}
          >
            Return to the Present in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SLATE, border: `2px solid ${SLATE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
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
            ['/blog/stay-present-stop-overthinking',  '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/manage-emotions-mindfulness',     '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/blog/breathing-exercises-stress',      '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/body-awareness-mental-health',    '→ Body Awareness and Its Role in Mental Health'],
            ['/blog/mindfulness-reduce-anxiety',      '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/mindfulness-exercises-school',    '→ Mindfulness Exercises for School and Study Life'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SLATE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
