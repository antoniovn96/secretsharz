import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Simple Breathing Exercises to Reduce Stress Instantly",
  excerpt: "Breathing is the only autonomic nervous system function you can consciously control — which makes it the fastest, most accessible tool for immediate stress reduction available to every student in every situation. No equipment, no space, no preparation. Just breath, deliberately used. Here are eight techniques that work, with the science behind each.",
  category: "Mental Health",
  date: "04-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/breathing-exercises-stress.jpg",
  tldr: "Deliberate breathing works for stress reduction because it directly activates the vagus nerve and the parasympathetic nervous system — the biological antidote to the cortisol-driven stress response. Eight specific techniques are covered here, from the fastest (physiological sigh, 30 seconds) to the deepest (4-7-8, 5 minutes), each with the science, the calming benefits, and an interactive timer so you can practise right now.",
  toc: [
    { id: "why-breath",  title: "1. Why Breathing Works — The Neuroscience",                        level: 3 },
    { id: "techniques",  title: "2. Eight Breathing Techniques — Numbered and Actionable",          level: 3 },
    { id: "exercises",   title: "3. Interactive: The Breathing Exercise Studio",                    level: 3 },
    { id: "when-to-use", title: "4. When to Use Which Technique",                                  level: 3 },
    { id: "habits",      title: "5. Building Breathing Into Your Daily Routine",                    level: 3 },
    { id: "faq",         title: "6. Breathing Exercises FAQs",                                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-04T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "breathing exercises for stress, breathing techniques stress relief, 4-7-8 breathing, box breathing, physiological sigh, breathing exercises students, how to calm down quickly breathing",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which breathing exercise reduces stress fastest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The physiological sigh — a double inhale through the nose followed by a long exhale — is the fastest available breathing-based stress reduction technique. Research by Andrew Huberman's lab at Stanford shows it produces the most rapid decrease in physiological arousal of any voluntary breathing pattern, working within 30 seconds. This is because the double inhale fully inflates the alveoli in the lungs, maximising the surface area for gas exchange, and the extended exhale activates the vagal brake — the parasympathetic deceleration mechanism.",
      },
    },
    {
      "@type": "Question",
      "name": "Does 4-7-8 breathing actually work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The 4-7-8 technique (inhale for 4, hold for 7, exhale for 8) produces measurable parasympathetic activation through the extended exhale mechanism and the breath hold's effect on carbon dioxide balance. Research on extended exhale breathing consistently shows significant reductions in heart rate variability markers of stress. The breath hold component specifically activates the diving reflex — a mammalian evolutionary response that directly lowers heart rate. It is particularly effective for pre-sleep anxiety and acute panic management.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does breathing exercise take to reduce stress?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Different techniques produce effects at different timescales. The physiological sigh produces measurable reduction in arousal within 30 seconds (1-3 repetitions). Box breathing (4-4-4-4) produces significant calm within 2-3 minutes. 4-7-8 breathing produces deep relaxation within 4-5 minutes. Alternate nostril breathing typically requires 5-10 minutes for full effect. For acute stress relief, the physiological sigh or 3 rounds of box breathing are most practical; for deeper calm and sleep onset, the 4-7-8 technique is most effective.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const SKY    = '#1F5C8A';
const SPALE5 = '#EBF3FB';
const SBORD5 = 'rgba(31,92,138,0.22)';

// ── Breathing techniques data ──────────────────────────────────────────────────
const TECHNIQUES = [
  {
    id:       'physio_sigh',
    number:   '01',
    name:     'The Physiological Sigh',
    tagline:  'Fastest stress reset available — 30 seconds',
    color:    '#1A7272',
    bg:       '#EBF5F5',
    icon:     '😮‍💨',
    difficulty:'Beginner',
    duration:  30,
    best_for: ['Acute panic or spike anxiety', 'Before entering an exam hall', 'After receiving stressful news', 'Mid-session focus reset'],
    science:  'Pioneered in research by Andrew Huberman\'s lab at Stanford, the physiological sigh is the brain\'s own built-in stress relief mechanism — it occurs naturally during sleep when CO₂ levels rise. The double inhale fully re-inflates collapsed alveoli (the tiny air sacs in the lungs), maximising oxygen-CO₂ exchange. The extended exhale activates the vagal brake — the parasympathetic deceleration mechanism that directly reduces heart rate within seconds.',
    benefits: ['Fastest cortisol reduction of any breathing technique', 'Reduces heart rate within 30 seconds', 'Invisible — can be done in any public situation', 'No setup or learning curve required'],
    steps: [
      'Inhale through the nose until your lungs feel about 80% full',
      'Without exhaling, take a short second inhale through the nose — "top up" the breath as much as possible',
      'Now exhale slowly and completely through the mouth — as long as possible, until the lungs feel empty',
      'Repeat 1-3 times. That is the complete technique',
    ],
    pattern:  { type: 'sigh', inhale1: 2, inhale2: 1, exhale: 6 },
    cue:      'One physiological sigh is enough for immediate effect. Three produces the deepest available acute stress reduction.',
  },
  {
    id:       'box',
    number:   '02',
    name:     'Box Breathing (4-4-4-4)',
    tagline:  'Military-grade calm — used by Navy SEALs',
    color:    '#2D5A8A',
    bg:       '#EEF3FB',
    icon:     '⬜',
    difficulty:'Beginner',
    duration:  180,
    best_for: ['Pre-exam stress management', 'Focus reset between study sessions', 'Sustained anxiety reduction', 'Any high-pressure situation requiring composure'],
    science:  'Box breathing — equal parts inhale, hold, exhale, hold — produces parasympathetic activation through two mechanisms: the extended exhale and the breath retention phases both increase vagal tone (the activity of the vagus nerve that governs the parasympathetic response). Research on heart rate variability (HRV) shows box breathing produces significant improvements in HRV markers of stress resilience, and it is used in clinical PTSD treatment protocols for exactly this reason.',
    benefits: ['Balances the autonomic nervous system', 'Measurable HRV improvement within 3 minutes', 'Improves focus alongside reducing anxiety', 'Used by military, athletes, and first responders'],
    steps: [
      'Inhale through the nose for 4 counts — feel the chest and belly expand',
      'Hold the breath for 4 counts — keep the body relaxed, do not strain',
      'Exhale slowly through the nose or mouth for 4 counts — feel the body release',
      'Hold the empty breath for 4 counts before the next inhale',
      'This is one box. Repeat for 4-6 rounds (2-3 minutes)',
    ],
    pattern:  { type: 'box', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    cue:      'If 4-count holds feel uncomfortable initially, reduce to 3-3-3-3 and build up. The technique works at any count — the equal ratio is what matters.',
  },
  {
    id:       'four_seven_eight',
    number:   '03',
    name:     '4-7-8 Breathing',
    tagline:  'Deepest relaxation — powerful for sleep and panic',
    color:    '#5B3A8B',
    bg:       '#F2EEF9',
    icon:     '🌙',
    difficulty:'Beginner',
    duration:  240,
    best_for: ['Pre-sleep anxiety', 'Acute panic management', 'Result anxiety peak moments', 'Deep post-exam decompression'],
    science:  'Developed by Dr. Andrew Weil at the University of Arizona, 4-7-8 breathing combines two potent mechanisms: the breath hold activates the mammalian diving reflex — an evolutionary response that directly lowers heart rate — and the 8-count exhale is double the length of the inhale, maximally activating the vagal brake. Research on extended exhale breathing shows that any exhale longer than the inhale produces parasympathetic activation; doubling the exhale produces the strongest effect available through breath alone.',
    benefits: ['Most powerful available natural sleep onset technique', 'Reduces acute panic significantly within 4 minutes', 'Lowers blood pressure measurably', 'Activates the diving reflex for direct heart rate reduction'],
    steps: [
      'Sit or lie comfortably. Place the tip of your tongue against the ridge just behind your upper front teeth and keep it there throughout',
      'Exhale completely through your mouth, making a whoosh sound',
      'Close your mouth. Inhale quietly through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale completely through your mouth (whoosh sound) for 8 counts',
      'This is one breath cycle. Repeat for 4 cycles minimum',
    ],
    pattern:  { type: 'four_seven_eight', inhale: 4, hold: 7, exhale: 8 },
    cue:      'Do not do more than 4 cycles in the first month of practice — the deep parasympathetic activation can cause lightheadedness until the body adapts. Practise lying down to begin.',
  },
  {
    id:       'resonance',
    number:   '04',
    name:     'Resonance Breathing (5-5)',
    tagline:  'Heart rate coherence — the most researched calming breath',
    color:    '#8B2635',
    bg:       '#FBF0F1',
    icon:     '💓',
    difficulty:'Beginner',
    duration:  300,
    best_for: ['Sustained stress reduction over a study session', 'Improving heart rate variability', 'General daily stress management', 'Long-term resilience building'],
    science:  'Breathing at approximately 6 breaths per minute (5 seconds in, 5 seconds out) brings the cardiovascular system into resonance — the natural oscillating frequency of heart rate variability. Research by Richard Gevirtz at Alliant International University and Paul Lehrer at Rutgers shows this breathing rate produces the largest possible heart rate variability improvements, directly strengthening the autonomic nervous system\'s stress regulation capacity. Ten minutes of resonance breathing produces effects comparable to 30 minutes of other relaxation techniques in research comparisons.',
    benefits: ['Produces largest possible HRV improvement', 'Builds long-term stress resilience with daily practice', 'Reduces hypertension measurably', 'Used in clinical anxiety treatment protocols'],
    steps: [
      'Sit comfortably with the back supported',
      'Inhale slowly through the nose for exactly 5 counts — expand the belly, not just the chest',
      'Exhale slowly through the nose or mouth for exactly 5 counts — let the belly fall',
      'The transition between inhale and exhale should be smooth, not abrupt',
      'Continue for 5-10 minutes at this even 5-5 rhythm',
      'If 5 counts feels too long, start with 4-4 and gradually extend',
    ],
    pattern:  { type: 'resonance', inhale: 5, exhale: 5 },
    cue:      '10 minutes of resonance breathing is the most evidence-backed available dose for cardiovascular stress reduction. Start with 5 minutes and build up.',
  },
  {
    id:       'diaphragmatic',
    number:   '05',
    name:     'Diaphragmatic (Belly) Breathing',
    tagline:  'Correct breathing technique — the foundation',
    color:    '#2D6B45',
    bg:       '#E8F4EE',
    icon:     '🫁',
    difficulty:'Beginner',
    duration:  180,
    best_for: ['Chronic shallow breathing from anxiety', 'Building the foundation for all other techniques', 'During study sessions for sustained calm', 'Reducing baseline anxiety over weeks'],
    science:  'Most people under chronic stress breathe shallowly from the chest, activating the sympathetic nervous system continuously. Diaphragmatic breathing — expanding the belly on inhale — activates the diaphragm\'s full range, which stimulates the vagus nerve (which runs alongside the diaphragm) with every breath. Research by Evgenia Nosova and colleagues shows that diaphragmatic breathing produces consistent reductions in cortisol and significant improvements in sustained attention when practised during study tasks.',
    benefits: ['Reduces baseline anxiety with regular practice', 'Directly stimulates the vagus nerve on every breath', 'Improves oxygenation of the prefrontal cortex', 'Corrects the shallow breathing pattern that maintains chronic stress'],
    steps: [
      'Place one hand on your chest and one hand on your belly',
      'Inhale slowly through the nose — the hand on your belly should rise while the hand on your chest remains relatively still',
      'This belly-rise confirms diaphragmatic engagement. If your chest is rising first, the breathing is shallow',
      'Exhale slowly — feel the belly fall',
      'Practice for 2-3 minutes, focusing entirely on the belly movement',
      'Over time, this becomes your natural breathing pattern — reducing baseline anxiety continuously',
    ],
    pattern:  { type: 'diaphragmatic', inhale: 4, exhale: 6 },
    cue:      'The belly should move more than the chest. If this feels unnatural, it is because anxiety has trained shallow chest breathing as the default. It corrects with practice.',
  },
  {
    id:       'alternate_nostril',
    number:   '06',
    name:     'Alternate Nostril Breathing (Nadi Shodhana)',
    tagline:  'Balances the nervous system hemispheres — from ancient yoga',
    color:    '#C07800',
    bg:       '#FFF8E1',
    icon:     '🌀',
    difficulty:'Intermediate',
    duration:  300,
    best_for: ['Pre-exam anxiety with scattered thoughts', 'Mental balancing when feeling overwhelmed', 'Combining mindfulness with breath practice', 'Midday stress reset when feeling split between tasks'],
    science:  'Nadi Shodhana is one of the most researched yogic breathing techniques. Research by Telles and colleagues at the Indian Council of Medical Research found that alternate nostril breathing — specifically — produces greater improvements in spatial memory and spatial processing accuracy than other breathing techniques. The left-right alternation is hypothesised to stimulate the left and right cerebral hemispheres alternately via the nasal-brain connection (the olfactory bulbs have direct connections to frontal lobe structures). Clinically, it consistently reduces anxiety and improves cognitive performance measures.',
    benefits: ['Improves spatial memory and processing', 'Reduces pre-exam scattered thinking', 'Promotes sense of hemispheric balance', 'Significant anxiety reduction with 5-10 minutes practice'],
    steps: [
      'Sit comfortably. With your right hand, fold the index and middle fingers toward the palm. Your thumb will close the right nostril; your ring finger will close the left',
      'Close the right nostril with the thumb. Inhale slowly through the left nostril for 4 counts',
      'Close both nostrils. Hold for 2 counts (or 4 if comfortable)',
      'Release the right nostril. Exhale slowly through the right nostril for 4 counts',
      'Now inhale through the right nostril for 4 counts',
      'Close both nostrils. Hold for 2 counts',
      'Release the left nostril. Exhale through the left for 4 counts',
      'This completes one round. Continue for 5-10 rounds (5 minutes)',
    ],
    pattern:  { type: 'alternate', inhale: 4, hold: 2, exhale: 4 },
    cue:      'Keep the face, jaw, and shoulders relaxed throughout. The technique should feel smooth and even — if it feels effortful, reduce the count ratios.',
  },
  {
    id:       'extended_exhale',
    number:   '07',
    name:     'Extended Exhale (4-8)',
    tagline:  'Simple, powerful, evidence-backed — anywhere, anytime',
    color:    '#1F5C8A',
    bg:       '#EBF3FB',
    icon:     '🌊',
    difficulty:'Beginner',
    duration:  180,
    best_for: ['Quick stress relief in any setting', 'Simple technique to teach others', 'Mid-conversation anxiety management', 'Driving, commuting, or any eyes-open situation'],
    science:  'The scientific principle underlying multiple breathing techniques — including 4-7-8 and resonance breathing — is the extended exhale effect. Inhalation slightly accelerates the heart rate (by reducing vagal tone); exhalation slows it (by increasing vagal tone). Any exhale longer than the inhale therefore produces net parasympathetic activation. The 4-8 ratio is the simplest expression of this principle — doubling the exhale relative to the inhale with no breath holds, making it the most accessible technique for any setting.',
    benefits: ['Works in any setting — eyes open, standing, in public', 'Direct parasympathetic activation with each breath', 'Builds intuitive understanding of breath-body connection', 'Effective within 2-3 breaths for acute relief'],
    steps: [
      'Inhale through the nose for 4 counts — any comfortable speed',
      'Exhale through the nose or mouth for 8 counts — twice as long as the inhale',
      'There are no holds and no special positions required',
      'Continue for 5-10 breaths, keeping the exhale consistently double the inhale length',
      'The technique can be done with eyes open and is invisible in public settings',
    ],
    pattern:  { type: 'extended_exhale', inhale: 4, exhale: 8 },
    cue:      'If 4-8 feels too long initially, try 3-6 or 2-4. The ratio is what matters, not the absolute counts. Any breath where the exhale is at least 1.5× the inhale produces parasympathetic activation.',
  },
  {
    id:       'breath_count',
    number:   '08',
    name:     'Mindful Breath Counting',
    tagline:  'Combines breath and attention training',
    color:    '#3A4D8A',
    bg:       '#EEF1FB',
    icon:     '🔢',
    difficulty:'Beginner',
    duration:  180,
    best_for: ['When the mind is too active for other techniques', 'Combining stress relief with focus training', 'Transition from distracted to focused study mode', 'When anxiety is producing racing thoughts'],
    science:  'Breath counting — counting each exhale from 1 to 10, then returning to 1 — is one of the oldest recorded meditation techniques and one of the most studied. It combines the parasympathetic activation of controlled breathing with the attentional training of mindfulness practice. Research by Zylowska and colleagues shows breath counting produces specific improvements in attentional stability and the capacity to notice mind-wandering — the exact cognitive skills that studying requires. When the count is lost and restarted without self-criticism, the restart itself is the practice of non-judgmental attention.',
    benefits: ['Simultaneously calms and sharpens attention', 'Interrupts racing thought cycles effectively', 'Builds both stress resilience and focus capacity', 'The simplest gateway into combined breath and mindfulness practice'],
    steps: [
      'Sit or lie comfortably with eyes closed or softly downcast',
      'Take a few natural breaths to settle',
      'On the next exhale, silently count "one"',
      'On the following exhale: "two". Continue to "ten"',
      'After "ten", return to "one" and begin again',
      'When you lose the count (it will happen) — note it without self-criticism and return to "one"',
      'Continue for 3-5 minutes',
    ],
    pattern:  { type: 'count', inhale: 4, exhale: 6 },
    cue:      'Losing the count is not failure — it is the moment the practice is most active. The noticing of loss and the gentle return to "one" is the exact cognitive training that reduces mind-wandering during study.',
  },
];

// ── Animated Breathing Guide ───────────────────────────────────────────────────
function BreathingGuide({ technique, onClose }) {
  const [phase,     setPhase]     = useState('ready');
  const [count,     setCount]     = useState(0);
  const [cycle,     setCycle]     = useState(0);
  const [running,   setRunning]   = useState(false);
  const [done,      setDone]      = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const TOTAL_CYCLES = Math.max(3, Math.ceil(technique.duration / 20));

  // Build phase sequence for this technique
  const getPhases = (p) => {
    switch (p.type) {
      case 'sigh':            return [
        { name: 'Inhale (1st)', duration: p.inhale1, instruction: 'Inhale through nose until 80% full', color: '#2D9E6B' },
        { name: 'Top-up inhale', duration: p.inhale2, instruction: 'One sharp top-up inhale through nose', color: '#1A7272' },
        { name: 'Long exhale', duration: p.exhale, instruction: 'Exhale completely through mouth', color: '#2D5A8A' },
      ];
      case 'box':             return [
        { name: 'Inhale', duration: p.inhale, instruction: 'Inhale through nose', color: '#2D9E6B' },
        { name: 'Hold',   duration: p.hold1,  instruction: 'Hold — keep the body relaxed', color: '#C07800' },
        { name: 'Exhale', duration: p.exhale, instruction: 'Exhale slowly', color: '#2D5A8A' },
        { name: 'Hold',   duration: p.hold2,  instruction: 'Hold the empty breath', color: '#8B2635' },
      ];
      case 'four_seven_eight':return [
        { name: 'Inhale', duration: p.inhale, instruction: 'Inhale quietly through nose', color: '#2D9E6B' },
        { name: 'Hold',   duration: p.hold,   instruction: 'Hold breath — body relaxed', color: '#C07800' },
        { name: 'Exhale', duration: p.exhale, instruction: 'Exhale fully through mouth (whoosh)', color: '#5B3A8B' },
      ];
      case 'resonance':       return [
        { name: 'Inhale', duration: p.inhale, instruction: 'Inhale — expand the belly', color: '#2D9E6B' },
        { name: 'Exhale', duration: p.exhale, instruction: 'Exhale — let the belly fall', color: '#2D5A8A' },
      ];
      case 'diaphragmatic':   return [
        { name: 'Belly Inhale', duration: p.inhale, instruction: 'Inhale — feel the belly rise', color: '#2D9E6B' },
        { name: 'Belly Exhale', duration: p.exhale, instruction: 'Exhale — feel the belly fall', color: '#2D6B45' },
      ];
      case 'alternate':       return [
        { name: 'Left inhale',  duration: p.inhale, instruction: 'Inhale through left nostril', color: '#2D9E6B' },
        { name: 'Both hold',    duration: p.hold,   instruction: 'Hold — both closed', color: '#C07800' },
        { name: 'Right exhale', duration: p.exhale, instruction: 'Exhale through right nostril', color: '#C07800' },
        { name: 'Right inhale', duration: p.inhale, instruction: 'Inhale through right nostril', color: '#2D9E6B' },
        { name: 'Both hold',    duration: p.hold,   instruction: 'Hold — both closed', color: '#C07800' },
        { name: 'Left exhale',  duration: p.exhale, instruction: 'Exhale through left nostril', color: '#5B3A8B' },
      ];
      case 'extended_exhale': return [
        { name: 'Inhale', duration: p.inhale, instruction: 'Inhale through nose', color: '#2D9E6B' },
        { name: 'Exhale', duration: p.exhale, instruction: 'Exhale slowly — twice as long', color: '#1F5C8A' },
      ];
      case 'count':           return [
        { name: 'Inhale', duration: p.inhale, instruction: 'Inhale naturally', color: '#2D9E6B' },
        { name: 'Exhale + count', duration: p.exhale, instruction: `Exhale and count silently`, color: '#3A4D8A' },
      ];
      default: return [];
    }
  };

  const phases = getPhases(technique.pattern);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const currentPhase = phases[phaseIdx] || phases[0];

  useEffect(() => {
    if (!running) return;
    if (done) return;
    intRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intRef.current);
          // Move to next phase or cycle
          const nextPhaseIdx = (phaseIdx + 1) % phases.length;
          if (nextPhaseIdx === 0) {
            const newCycle = cycle + 1;
            if (newCycle >= TOTAL_CYCLES) {
              setRunning(false);
              setDone(true);
              return 0;
            }
            setCycle(newCycle);
          }
          setPhaseIdx(nextPhaseIdx);
          const nextDur = phases[nextPhaseIdx === 0 ? (phaseIdx + 1) % phases.length : nextPhaseIdx].duration;
          return nextDur;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phaseIdx, cycle, done]);

  const startExercise = () => {
    setPhase('active');
    setCount(phases[0].duration);
    setPhaseIdx(0);
    setCycle(0);
    setRunning(true);
    setDone(false);
  };

  const pauseResume = () => {
    if (running) { clearInterval(intRef.current); setRunning(false); }
    else { setRunning(true); }
  };

  const restart = () => {
    clearInterval(intRef.current);
    setRunning(false); setDone(false); setCycle(0);
    setPhaseIdx(0); setCount(0); setPhase('ready');
  };

  // Circle animation
  const RADIUS = 52;
  const CIRC   = 2 * Math.PI * RADIUS;
  const totalPhaseDur = currentPhase?.duration || 1;
  const progress = running ? ((totalPhaseDur - count) / totalPhaseDur) : 0;
  const isInhale = currentPhase?.name?.toLowerCase().includes('inhale') || currentPhase?.name?.toLowerCase().includes('top-up');
  const circleScale = isInhale ? 1 + 0.15 * progress : 1 + 0.15 * (1 - progress);

  return (
    <div style={{ background: `${technique.color}08`, borderRadius: '16px', overflow: 'hidden', border: `2px solid ${technique.color}30`, fontFamily: font }}>
      {/* Header */}
      <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${technique.color}20` }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: technique.color }}>{technique.number}. {technique.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{technique.tagline}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px', padding: '0 4px' }}>×</button>
      </div>

      <div style={{ padding: '20px' }}>
        {phase === 'ready' && (
          <>
            {/* Steps */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: technique.color, marginBottom: '8px' }}>How to do it:</div>
              {technique.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '9px', padding: '5px 0', borderBottom: i < technique.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: technique.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            {/* Benefits */}
            <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', border: `1px solid ${technique.color}25` }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: technique.color, marginBottom: '6px' }}>Benefits:</div>
              {technique.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', padding: '3px 0' }}>
                  <span style={{ color: technique.color, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{b}</span>
                </div>
              ))}
            </div>
            <button onClick={startExercise} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${technique.color}, ${technique.color}BB)`,
              color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
              boxShadow: `0 6px 18px ${technique.color}30`,
            }}>▶ Begin Guided Practice ({TOTAL_CYCLES} cycles)</button>
          </>
        )}

        {phase === 'active' && (
          <div style={{ textAlign: 'center' }}>
            {/* Animated circle */}
            <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px auto' }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: `translate(-50%, -50%) scale(${running ? circleScale : 1})`,
                width: '100px', height: '100px', borderRadius: '50%',
                background: `radial-gradient(circle, ${currentPhase?.color || technique.color}40, ${currentPhase?.color || technique.color}15)`,
                border: `3px solid ${currentPhase?.color || technique.color}`,
                transition: 'transform 0.9s ease-in-out, background 0.5s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: '700', color: currentPhase?.color || technique.color, lineHeight: 1 }}>
                  {done ? '✓' : count}
                </div>
                {!done && <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>sec</div>}
              </div>
              {/* Outer ring */}
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r={RADIUS} fill="none" stroke={`${technique.color}20`} strokeWidth="5" />
                <circle cx="70" cy="70" r={RADIUS} fill="none" stroke={technique.color} strokeWidth="5"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - (cycle / TOTAL_CYCLES))}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
              </svg>
            </div>

            {/* Phase label */}
            {!done && (
              <>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: currentPhase?.color || technique.color, marginBottom: '4px' }}>
                  {currentPhase?.name || ''}
                </div>
                <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--ink-soft)' }}>{currentPhase?.instruction || ''}</p>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
                  {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < cycle ? technique.color : i === cycle ? `${technique.color}60` : 'var(--border)', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Cycle {cycle + 1} of {TOTAL_CYCLES}</div>
              </>
            )}
            {done && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: technique.color, marginBottom: '4px' }}>Complete ✓</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)' }}>Take a moment to notice how you feel.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!done && (
                <button onClick={pauseResume} style={{ padding: '11px 22px', borderRadius: '50px', border: 'none', background: running ? '#C07800' : `linear-gradient(135deg, ${technique.color}, ${technique.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
                  {running ? '⏸ Pause' : '▶ Resume'}
                </button>
              )}
              <button onClick={restart} style={{ padding: '11px 18px', borderRadius: '50px', border: `1.5px solid ${technique.color}50`, background: 'transparent', color: technique.color, fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
                ↺ Restart
              </button>
              <button onClick={onClose} style={{ padding: '11px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Studio Component ───────────────────────────────────────────────────────────
function BreathingStudio() {
  const [selected,  setSelected]  = useState(null);
  const [filter,    setFilter]    = useState('all');
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const filters = [
    { key: 'all',          label: 'All' },
    { key: 'Beginner',     label: 'Beginner' },
    { key: 'quick',        label: 'Quick (≤3 min)' },
    { key: 'sleep',        label: 'Sleep & Panic' },
  ];

  const filtered = TECHNIQUES.filter(t => {
    if (filter === 'all')       return true;
    if (filter === 'Beginner')  return t.difficulty === 'Beginner';
    if (filter === 'quick')     return t.duration <= 180;
    if (filter === 'sleep')     return t.best_for.some(b => b.toLowerCase().includes('sleep') || b.toLowerCase().includes('panic'));
    return true;
  });

  if (selected) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <BreathingGuide technique={selected} onClose={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        The Breathing Exercise Studio
      </p>
      <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Eight techniques with animated guidance. Tap any to read the instructions and begin a timed practice.
      </p>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
            borderColor: filter === f.key ? SKY : 'var(--border)',
            background: filter === f.key ? SPALE5 : 'white',
            color: filter === f.key ? SKY : 'var(--muted)',
            fontWeight: filter === f.key ? '700' : '500', fontSize: '12px',
            cursor: 'pointer', fontFamily: font, transition: 'all 0.15s',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Technique cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(t => (
          <button key={t.id} onClick={() => setSelected(t)} style={{
            padding: '14px 16px', borderRadius: '12px', border: '2px solid',
            borderColor: 'var(--border)', background: 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '14px',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = `${t.color}08`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, border: `1.5px solid ${t.color}30` }}>
              {t.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: t.color }}>{t.number}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{t.name}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.tagline}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '10px', fontWeight: '700', background: t.bg, color: t.color, padding: '2px 8px', borderRadius: '20px', marginBottom: '3px' }}>{t.difficulty}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{Math.ceil(t.duration / 60)} min</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BreathingExercisesStress({ navigate, relatedPosts }) {
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
      <p>Every student knows the specific sensation of stress arriving all at once — the tightening in the chest before an exam, the racing thoughts at 11pm when the study session has gone wrong, the shallow breathing of the corridor before results are announced. What very few students know is that the breath in that moment is not just a symptom of the stress response. It is also the fastest available mechanism to change it.</p>

      <p>Breathing is the only function of the autonomic nervous system — the system that governs the stress response — that can be consciously controlled. Every other automatic process (heart rate, cortisol release, blood pressure) can only be influenced indirectly. The breath can be changed directly, deliberately, and immediately. And because the cardiovascular and nervous systems are directly responsive to breathing patterns, deliberate breathing is not a placebo: it is a genuine physiological intervention.</p>

      <img
        src={meta.imgUrl}
        alt="Simple breathing exercises to reduce stress instantly — eight techniques with scientific backing for students and young adults"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-breath">1. Why Breathing Works — The Neuroscience</h3>

      <p><strong>The vagus nerve — the physiology of calm.</strong> The vagus nerve is the longest cranial nerve in the body, running from the brainstem through the heart, lungs, and abdomen. It is the primary conduit of the parasympathetic nervous system — the "rest and digest" counterpart to the "fight or flight" sympathetic activation of stress. Deliberately slowing and deepening the breath — particularly extending the exhale — directly stimulates the vagus nerve, producing parasympathetic activation that reduces heart rate, lowers blood pressure, and suppresses cortisol release. This is not a metaphor; it is measurable cardiovascular physiology that occurs within seconds of changing the breathing pattern.</p>

      <p><strong>The exhale is where the calm lives.</strong> During inhalation, the diaphragm descends and the lungs expand. To accommodate the increased lung volume, the heart has to temporarily accommodate more blood, causing a slight increase in heart rate. During exhalation, the opposite occurs — the diaphragm ascends, the heart has more space, and heart rate slows. This means that any breathing pattern that extends the exhale relative to the inhale produces net heart rate deceleration. The longer and slower the exhale relative to the inhale, the greater the parasympathetic activation. This is the principle behind 4-8 breathing, 4-7-8 breathing, and every other technique with an extended exhale.</p>

      <p><strong>CO₂ and the balance of arousal.</strong> Many students believe that the breathlessness of acute anxiety comes from insufficient oxygen. Research shows the opposite: anxiety-driven hyperventilation (rapid, shallow breathing) produces excessive CO₂ loss, which paradoxically produces the sensations of tightness, dizziness, and urgency associated with panic. Slow, deliberate breathing restores the CO₂ balance that hyperventilation disrupts, directly reducing the physiological arousal that maintains the anxiety spiral. The physiological sigh — two quick inhales followed by a long exhale — is specifically effective because it rapidly addresses this CO₂ imbalance while maximising the exhale's vagal activation.</p>

      <p><strong>Heart rate variability — the measurable marker of resilience.</strong> Heart rate variability (HRV) — the natural variation in time between heartbeats — is one of the most sensitive available measures of autonomic nervous system health and stress resilience. Higher HRV indicates a flexible, responsive nervous system that can switch efficiently between activation and recovery. Research consistently shows that deliberate breathing practices, particularly resonance breathing (6 breaths per minute), produce significant increases in HRV that persist beyond the practice session — meaning regular breathing practice genuinely builds stress resilience rather than just temporarily relieving acute stress.</p>

      {/* ── Section 2 ── */}
      <h3 id="techniques">2. Eight Breathing Techniques — Numbered and Actionable</h3>

      {TECHNIQUES.map(t => (
        <div key={t.id} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '18px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${t.color}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: '700', color: `${t.color}40`, flexShrink: 0, lineHeight: 1 }}>{t.number}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                <span style={{ fontSize: '20px' }}>{t.icon}</span>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: t.color }}>{t.name}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', background: t.bg, color: t.color, padding: '2px 8px', borderRadius: '20px' }}>{t.difficulty}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>{t.tagline}</div>
            </div>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{t.science}</p>

          <div style={{ background: t.bg, borderRadius: '10px', padding: '11px 14px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: t.color, marginBottom: '6px' }}>Quick steps:</div>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              {t.steps.slice(0, 3).map((s, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '3px' }}>{s}</li>
              ))}
            </ol>
            {t.steps.length > 3 && <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>→ Full steps available in the Breathing Studio below</p>}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: t.color }}>Best for: </div>
            {t.best_for.slice(0, 2).map((b, i) => (
              <span key={i} style={{ fontSize: '11px', background: `${t.color}12`, color: t.color, padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>{b}</span>
            ))}
          </div>
        </div>
      ))}

      {/* ── Section 3: Interactive ── */}
      <h3 id="exercises">3. Interactive: The Breathing Exercise Studio</h3>
      <p>The Studio lets you practise any of the eight techniques with a full animated timer guide. Select a technique, read the steps, and tap Begin — the guide counts you through each phase of the breath pattern for the recommended number of cycles. Filter by difficulty, duration, or use case to find the right technique for this moment.</p>

      <BreathingStudio />

      {/* ── Section 4 ── */}
      <h3 id="when-to-use">4. When to Use Which Technique</h3>

      <p><strong>For immediate acute stress relief (under 1 minute available):</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Technique 01 — The Physiological Sigh.</strong> Three repetitions. Works in 30 seconds. Invisible in any setting — can be done before entering an exam hall, mid-conversation, or walking between classes.</li>
      </ul>

      <p><strong>For pre-exam anxiety management (2-5 minutes available):</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Technique 02 — Box Breathing.</strong> 4-6 rounds (2-3 minutes). Balances the nervous system and improves composure. Used by athletes, military personnel, and surgeons before high-pressure performance contexts for exactly this reason.</li>
        <li><strong>Technique 07 — Extended Exhale (4-8).</strong> Simple, invisible, immediately effective. Particularly useful during an exam when anxiety spikes mid-paper — a few rounds while continuing to read normalises arousal without disrupting cognitive function.</li>
      </ul>

      <p><strong>For pre-sleep anxiety and result-night stress:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Technique 03 — 4-7-8 Breathing.</strong> The most effective available natural sleep onset technique. Four cycles lying in the dark, with no screens. The diving reflex activation typically produces drowsiness within the first two cycles.</li>
        <li><strong>Technique 04 — Resonance Breathing (5-5).</strong> Ten minutes of 6-breaths-per-minute breathing produces the deepest available HRV improvement and is particularly effective for the anxious restlessness that prevents sleep after a difficult day.</li>
      </ul>

      <p><strong>For sustained stress management during exam season:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Technique 05 — Diaphragmatic Breathing.</strong> The correction of chronic shallow breathing. With daily practice, this becomes the default resting breathing pattern — producing continuous, passive parasympathetic activation rather than requiring deliberate practice for each stress reduction.</li>
        <li><strong>Technique 04 — Resonance Breathing.</strong> Ten minutes daily produces measurable HRV improvement over two weeks — building the baseline stress resilience that makes acute techniques less frequently needed.</li>
      </ul>

      <p><strong>For scattered, unfocused mental states:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Technique 06 — Alternate Nostril Breathing.</strong> Specifically documented to improve spatial processing and reduce mental scatter. Five minutes before a study session replaces the diffuse, anxious state that undermines early session focus.</li>
        <li><strong>Technique 08 — Mindful Breath Counting.</strong> The dual action of breath regulation and attention training makes this ideal for transitioning from a distracted state to a focused one. Five minutes of counting resets both the stress system and the attention system simultaneously.</li>
      </ul>

      {/* ── Section 5 ── */}
      <h3 id="habits">5. Building Breathing Into Your Daily Routine</h3>

      <p><strong>The anchor habit approach.</strong> The most effective way to make breathing practices a reliable daily habit is to attach them to existing behaviours — so they occur automatically rather than requiring a separate daily decision. Three natural anchors for students:</p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Morning anchor:</strong> Three physiological sighs before picking up your phone each morning. This costs zero extra time and prevents the anxiety activation of immediate phone use from setting the nervous system tone for the morning.</li>
        <li><strong>Study session anchor:</strong> Three rounds of box breathing before each study session begins. The 2-minute pre-session breathing practice produces better focus quality across the session than the same 2 minutes spent reviewing notes.</li>
        <li><strong>Pre-sleep anchor:</strong> 4-7-8 breathing after lying down, before sleep. No timer needed — continue until sleep arrives. Replaces the pre-sleep phone use that delays sleep onset and reduces sleep quality.</li>
      </ul>

      <p><strong>The one-breath emergency technique.</strong> For moments when full technique practice is genuinely impossible — mid-exam, in a crowded room, in the middle of a conversation — one extended exhale (slow, complete, slightly longer than the inhale) produces measurable parasympathetic activation. This is the minimum viable stress reduction technique: one breath, deliberately exhaled, in any situation. It is not as effective as a full practice session; it is consistently more effective than no intervention.</p>

      <p><strong>Tracking the physiological effects.</strong> Students who track one simple measure — morning resting heart rate — typically see measurable reductions over two to three weeks of daily breathing practice. A lower resting heart rate indicates improved parasympathetic tone and reduced baseline cortisol activation. The measurement provides evidence that the practice is producing real physiological change — which is often the most motivating element of building the habit.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Breathing Exercises FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I tried box breathing during an exam and felt more anxious, not less. What went wrong?</strong><br />
        A: This is a common experience and has a specific cause: attempting a new breathing technique for the first time in a high-anxiety situation is counterproductive — the cognitive demand of learning and executing the technique adds to rather than reduces the cognitive load of the anxiety. Breathing techniques need to be practised in calm conditions until they are automatic before they are effective in acute stress situations. Practise your chosen technique daily for two weeks before expecting it to work under exam conditions. The technique that feels effortless in practice is the one that works when you most need it.</p>

        <p><strong>Q: Can breathing exercises replace anxiety medication or therapy?</strong><br />
        A: Breathing exercises are evidence-backed tools for stress and anxiety management and are used as components of clinical treatments including CBT and MBSR. They are not replacements for medication or therapy when these are clinically indicated. For situational exam anxiety and general academic stress, breathing practices produce significant measurable benefits and are appropriate as primary interventions. For anxiety that is significantly impairing daily function, persistent despite lifestyle and breathing practice, or accompanied by depression or other symptoms, professional support is appropriate and breathing practices complement rather than replace it.</p>

        <p><strong>Q: How do I know which technique is right for me?</strong><br />
        A: The best technique is the one you will actually practise consistently. Start with the physiological sigh (the simplest and fastest) and box breathing (the most versatile) — these two techniques address the widest range of student stress situations. Add the 4-7-8 technique if sleep is a primary concern. Add resonance breathing if you want to build baseline stress resilience over weeks. The hierarchy is: simple and consistent beats complex and occasional, every time.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SKY, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The breath is always available. It is the one tool that is never out of reach, never requires charging, and never costs anything — and it works."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Try one technique from the Studio above right now — before the next study session, before sleep tonight, or in the next moment of feeling the stress arrive. The three minutes you spend are not taken from anything useful. They are the investment in the cognitive and emotional capacity that makes everything else more effective.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SKY, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD5}` }}
          >
            Continue in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SKY, border: `2px solid ${SKY}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Technique
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-for-students',     '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/daily-mindfulness-practice',   '→ How to Practice Mindfulness Daily for Better Mental Health'],
            ['/blog/benefits-of-mindfulness',      '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/blog/stay-calm-during-exams',       '→ How to Stay Calm and Confident During Exams'],
            ['/blog/quick-stress-relief-students', '→ 5-Minute Stress Relief Techniques for Students'],
            ['/blog/sleep-academic-performance',   '→ How Sleep Affects Academic Performance and Mental Health'],
            ['/safe',                              '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SKY, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
