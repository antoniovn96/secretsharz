import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stay Present and Avoid Overthinking Daily",
  excerpt: "Overthinking is not a personality flaw — it is a cognitive habit that the brain learns under sustained pressure and practises until it becomes automatic. The good news is that habits can be changed. This guide covers the psychology of overthinking, practical mindfulness methods for returning to the present, grounding exercises for acute spirals, and relatable student situations where these tools make the most difference.",
  category: "Mental Health",
  date: "05-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/stay-present-stop-overthinking.jpg",
  tldr: "Overthinking keeps you mentally living in the future (worry) or the past (rumination) rather than the present — which is the only place where useful action is possible. Stopping it does not require silencing the mind; it requires building the specific skills to notice when the spiral has begun, interrupt it with a grounded present-moment intervention, and redirect attention to something actionable. This guide provides those skills with six mindfulness methods, five grounding exercises, relatable student scenarios, and an interactive Overthinking Response Builder.",
  toc: [
    { id: "why-overthink",  title: "1. Why Students Overthink — The Psychology",                         level: 3 },
    { id: "methods",        title: "2. Six Mindfulness Methods for Returning to the Present",            level: 3 },
    { id: "builder",        title: "3. Interactive: The Overthinking Response Builder",                  level: 3 },
    { id: "grounding",      title: "4. Five Grounding Exercises for Acute Overthinking",                 level: 3 },
    { id: "situations",     title: "5. Relatable Situations — What to Do in Each One",                  level: 3 },
    { id: "faq",            title: "6. Overthinking FAQs",                                              level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-05T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "how to stop overthinking, stay present mindfulness, grounding exercises overthinking, overthinking students, how to stop overthinking daily, mindfulness overthinking, present moment awareness",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stop overthinking everything?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Stopping overthinking entirely is not the goal — a complete absence of future-oriented or past-oriented thought would impair planning and learning. The goal is to notice when thinking has crossed from useful into cyclical and unproductive, and to have reliable tools for interrupting the spiral and returning to the present. The most effective tools are: the name-it technique (labelling the thought type reduces its intensity immediately), grounding exercises (5-4-3-2-1 sensory anchoring), and the 'useful or not?' question (converting an anxious thought into a specific action if possible, or setting it aside if not). Daily mindfulness practice builds the noticing capacity that makes all three tools more available.",
      },
    },
    {
      "@type": "Question",
      "name": "Why do students overthink so much?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Students overthink for structurally predictable reasons: high-stakes academic environments create genuine uncertainty (will I pass? will the result close this pathway?) that activates the brain's threat detection system. The brain responds to uncertainty by running simulations of possible futures — which is biologically adaptive but becomes maladaptive when the simulations are repetitive, unconstrained by evidence, and produce anxiety without producing useful action. Additionally, academic culture often implicitly rewards anxious vigilance (the student who worries about exams is the one who prepares) in ways that strengthen the overthinking habit even as it undermines the wellbeing that good performance requires.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best grounding exercise for overthinking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 5-4-3-2-1 sensory grounding exercise is the most widely researched and most versatile grounding technique for overthinking. It works by redirecting attention from the internal mental content (the overthinking) to specific sensory experiences in the present environment — naming 5 things seen, 4 felt, 3 heard, 2 smelled, 1 tasted. The specificity and the sensory focus are what make it effective: the brain cannot simultaneously process specific sensory input and run the abstract future/past simulations that overthinking requires. It can be done anywhere, in any situation, and typically interrupts an acute overthinking spiral within 2-3 minutes.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const MOSS    = '#3D6B4F';
const MPALE   = '#EDF5F0';
const MBORD   = 'rgba(61,107,79,0.22)';

// ── Overthinking types & response data ────────────────────────────────────────
const OVERTHINK_TYPES = [
  {
    key:     'result_fear',
    icon:    '📉',
    label:   'Catastrophising about results',
    desc:    'Imagining the worst possible outcome from an exam or assessment before it exists',
    color:   '#8B2635',
    bg:      '#FBF0F1',
    what_happening: 'The brain is running threat simulations — mentally rehearsing the feared outcome in detail as if repeated rehearsal could prevent it. This is a cognitive response to uncertainty, not evidence about the actual outcome. Research by psychologist Susan Nolen-Hoeksema at Yale identifies this as anticipatory rumination: dwelling on feared future outcomes. It produces anxiety without producing useful preparation action.',
    mindful_interruption: 'The catastrophe has not happened. Right now, in this moment, the result does not exist yet. The only thing that exists is this moment and what is possible in it.',
    action_steps: [
      'Name the thought specifically: "I am catastrophising about [specific feared outcome]." The naming creates cognitive distance.',
      'Ask: is there a useful action available right now? If yes — do it. If no — the thinking is not serving preparation.',
      'Use the parking lot: write the fear in one sentence, close the notebook, and physically return to what you were doing.',
      'Redirect to the next specific study action: open the material to the next topic and complete five minutes of active recall.',
    ],
    grounding: '5-4-3-2-1 sensory grounding — bring attention fully into the room and away from the imagined future.',
    student_example: 'Aryan would spend the hour before sleeping imagining failing his boards so specifically that by 11pm he had mentally constructed a complete disaster narrative. When he learned to catch the spiral at its first sentence — "I notice I am catastrophising right now" — and write the fear in his notebook before closing it, the spiral had a container. It still happened, but it no longer colonised the whole evening.',
  },
  {
    key:     'past_replay',
    icon:    '🔄',
    label:   'Replaying past mistakes',
    desc:    'Going over a conversation, exam response, or decision repeatedly — changing nothing',
    color:   '#2D5A8A',
    bg:      '#EEF3FB',
    what_happening: 'Post-event processing — mentally reviewing what was said or done — serves a legitimate function for a short time immediately after an event (extracting lessons). When it continues beyond the point of useful information extraction, it becomes rumination: repetitive, emotionally costly mental replay that changes nothing about the past and produces only continued distress in the present.',
    mindful_interruption: 'That moment has already happened and is permanently fixed. The only place where anything can change is now. What is one thing I can do in this present moment with the information from that experience?',
    action_steps: [
      'Set a defined "processing window" — 20 minutes of honest reflection on what happened and what you would do differently — then deliberately close it.',
      'Extract the single most useful lesson: "What specifically will I do differently next time?" Write it in one sentence.',
      'Once written, the lesson is available for future reference. Additional replaying of the event adds no new information.',
      'When the replay restarts after the window, say quietly: "I already processed this. The lesson is noted. Back to the present."',
    ],
    grounding: 'Physical sensation anchoring — press both feet firmly into the floor and attend to the sensation for 30 seconds, returning attention to the body in the present room.',
    student_example: 'Priya would replay her Class 12 chemistry paper for weeks after — every question she had answered differently than she should have, constructed in perfect imaginary detail. When she started writing the one specific lesson from each exam ("I need to read the full question before starting") and marking the replay window as closed, the replays began arriving less often. The lesson was extracted; there was nothing more to find.',
  },
  {
    key:     'comparison_spiral',
    icon:    '👥',
    label:   'Comparison spiral',
    desc:    'Constantly measuring yourself against others and finding yourself inadequate',
    color:   '#5B3A8B',
    bg:      '#F2EEF9',
    what_happening: 'Social comparison is a normal cognitive process — it provides information about social norms and relative position. It becomes overthinking when it is constant, one-directional (always upward comparison, always unfavourable), and based on incomplete information (comparing your internal experience — including your doubts and failures — to others\' external presentation, which excludes their internal experience entirely). Research by Leon Festinger on social comparison theory shows upward comparison produces motivation only briefly; sustained upward comparison consistently produces anxiety and reduced self-efficacy.',
    mindful_interruption: 'I am comparing my full, known, internal reality to someone else\'s visible surface. These are not comparable things. My standard is my own growth, not anyone else\'s presentation.',
    action_steps: [
      'Name it specifically: "I am comparing myself to [person] and using incomplete information."',
      'Ask: what do I know about their actual preparation conditions, anxiety level, or support? Almost nothing. The comparison is informationally worthless.',
      'Redirect to your own trajectory: "How am I doing compared to last month?" This is a comparable and meaningful standard.',
      'Reduce comparison inputs: mute group chats or results discussions that consistently trigger the spiral for the next 48 hours.',
    ],
    grounding: 'Proprioceptive grounding — slowly squeeze and release your hands five times, attending to the physical sensation. Brings attention back to the body rather than the social comparison mental space.',
    student_example: 'Meera checked the class group chat after every assignment and always felt worse regardless of her result. She ran a simple experiment: for three weeks, she assessed her own performance before checking anyone else\'s. Her grades did not change. Her anxiety did — it dropped significantly, because she discovered she was spending enormous mental energy managing a comparison that contained no useful information.',
  },
  {
    key:     'what_if',
    icon:    '❓',
    label:   '"What if" spirals',
    desc:    'Chains of increasingly unlikely hypothetical worries that compound into catastrophe',
    color:   '#C07800',
    bg:      '#FFF8E1',
    what_happening: 'What-if thinking is the specific overthinking pattern that exploits the mind\'s capacity for hypothetical reasoning. Each "what if" generates a new uncertainty, which generates another "what if," which generates another — until the original concern (what if I don\'t understand this topic?) has escalated to existential conclusions (what if I never succeed at anything?). Research by Michel Dugas at Concordia identifies intolerance of uncertainty as the primary driver of this pattern: each "what if" is an attempt to achieve certainty through simulation, which always fails because certainty is not achievable through additional worrying.',
    mindful_interruption: 'What-if chains produce no information about actual outcomes — only an ever-expanding map of hypothetical fears. The present moment contains none of these scenarios. What is actually true right now?',
    action_steps: [
      'Catch the first "what if" — before the chain extends. Name it: "I notice a what-if chain starting."',
      'Apply the useful/not useful test: can I do anything about this specific "what if" right now? If yes, do it. If no, write it in the parking lot and return to the present.',
      'Follow the chain honestly to its end once — "if that happened, then what would actually happen?" Following the realistic chain to its conclusion almost always reveals more survivability than the spiral implies.',
      'Decide: I have examined this. Additional what-ifs add no new information. Back to the task.',
    ],
    grounding: '5-4-3-2-1 grounding, specifically naming each item out loud if possible. The verbal articulation of present-moment sensory input is particularly effective at interrupting the abstract cognitive content of what-if chains.',
    student_example: 'Rohan\'s what-if chains typically began with "what if I don\'t understand integration?" and, within ten minutes, had arrived at "what if I end up with no career and disappoint everyone?" He started catching the first link — "what if I don\'t understand integration?" — and asking: is there anything useful I can do about this right now? Yes: open the integration chapter and do three practice problems. The chain never had to extend beyond its first link once a specific action replaced the spiral.',
  },
  {
    key:     'overthink_people',
    icon:    '💬',
    label:   'Overthinking conversations and relationships',
    desc:    'Replaying things said to you or by you, worrying about what others think of you',
    color:   '#1A7272',
    bg:      '#EBF5F5',
    what_happening: 'Social rumination — replaying interactions, worrying about others\' perceptions, imagining what was meant by a tone of voice or a short reply — activates the same neural networks as direct social threat. The brain cannot fully distinguish between imagined social rejection and actual social rejection; both activate the same threat and pain circuitry. For students whose sense of belonging or approval is connected to academic performance or social standing, social rumination is both exhausting and very difficult to simply "stop thinking about."',
    mindful_interruption: 'I do not have access to what that person is actually thinking. I am constructing a narrative from incomplete information and treating the construction as fact. What I know is what actually happened. Everything else is interpretation.',
    action_steps: [
      'Separate the observable fact from the interpretation: "She replied with just \'ok\'" (fact) versus "She is angry with me" (interpretation). Stay with the fact only.',
      'Ask: is there a direct, simple action available — a message, a question, a clarification — that would provide actual information rather than speculation? If yes, take it.',
      'If no action is available: "I cannot know what she is thinking right now. I will find out when I see her. Until then, speculating is not useful."',
      'Practise the empathy pause: briefly consider that the other person may also be busy, anxious, or distracted — their behaviour may have nothing to do with you.',
    ],
    grounding: 'Cold water on the face or wrists — the mammalian diving reflex activation is particularly effective for the physiological arousal of social anxiety and rumination.',
    student_example: 'Ananya would replay conversations with her parents for hours after any discussion about results — reconstructing tone of voice, revisiting whether something she said had disappointed them, imagining extended consequences. She started catching the moment she was constructing rather than remembering: "Right now I am inventing a version of what they meant, not remembering what they actually said." That distinction — between the real conversation and her construction of it — was the beginning of being able to set the replay down.',
  },
];

const INTENSITY_LEVELS = [
  { key: 'mild',         icon: '🟡', label: 'Mild — intrusive but manageable' },
  { key: 'moderate',     icon: '🟠', label: 'Moderate — affecting study and mood significantly' },
  { key: 'overwhelming', icon: '🔴', label: 'Overwhelming — cannot think about anything else' },
];

const TIME_AVAILABLE = [
  { key: 'immediate',  label: 'Right now — under 2 minutes' },
  { key: 'short',      label: '5-10 minutes available' },
  { key: 'full',       label: '20+ minutes — I want to work through this properly' },
];

const RESPONSE_BY_TIME = {
  immediate: {
    title: 'Immediate Response (under 2 minutes)',
    actions: [
      { icon: '🏷️', text: 'Name it in one sentence: "I am [overthinking type] about [specific content]." Say it quietly — the naming creates cognitive distance immediately.' },
      { icon: '😮‍💨', text: 'One physiological sigh: double inhale through the nose, long complete exhale through the mouth. This is your 30-second nervous system reset.' },
      { icon: '👣', text: 'Feel both feet on the floor. Press down. Name three things you can see. You are here, now — the spiral is not.' },
    ],
  },
  short: {
    title: '5-Minute Response',
    actions: [
      { icon: '📝', text: 'Write the overthinking content in full — one paragraph, uncensored. The externalisation discharges the urgency that makes it feel uncontainable.' },
      { icon: '🔦', text: 'Apply the useful/not-useful test: is there one specific action available right now that addresses the concern? If yes, do it. If no, write "no useful action now" and close the notebook.' },
      { icon: '👁️', text: 'Complete 5-4-3-2-1 grounding: 5 things seen, 4 felt, 3 heard, 2 smelled, 1 tasted. Full attention to each one.' },
      { icon: '🎯', text: 'Choose the next specific, small task — something achievable in 10-15 minutes — and begin it. The engagement of beginning interrupts the loop more reliably than any cognitive strategy alone.' },
    ],
  },
  full: {
    title: 'Full Processing (20+ minutes)',
    actions: [
      { icon: '📓', text: 'Open the journal and write the full overthinking content — everything. Let it be honest and messy. Do not edit or reframe while writing — just externalise completely.' },
      { icon: '🔬', text: 'Examine the evidence: write "Evidence that supports this worry" and "Evidence that contradicts or complicates it." Almost every overthought concern has more contradicting evidence than it initially seems to.' },
      { icon: '🌿', text: 'Write the realistic outcome chain — not the catastrophic fantasy, the actual most likely sequence of events. Follow it to its conclusion. Note where it becomes survivable (it almost always does).' },
      { icon: '✍️', text: 'Write the one useful lesson or action this concern contains. Extract it, write it where you will find it, and consider the concern fully processed.' },
      { icon: '🧘', text: 'Close with 5 minutes of breath awareness. The thinking has been done; the breath is the signal that the processing period has ended and the present has resumed.' },
    ],
  },
};

const INTENSITY_NOTES = {
  mild:         'At mild intensity, the interruption techniques below work quickly. The naming and one-breath reset is often sufficient. Your overthinking has not yet built momentum — catch it early.',
  moderate:     'At moderate intensity, the 5-minute response is more appropriate than the immediate one. The spiral has momentum and needs more than a single breath to interrupt. Write it out first — externalising the content is the most effective moderate-intensity intervention.',
  overwhelming: 'At overwhelming intensity, the thinking has taken over the cognitive foreground entirely. Start with physical grounding rather than cognitive work — the body-based techniques (cold water, physiological sigh, feet on floor) restore enough prefrontal function for the cognitive tools to then work. Do not try to think your way out of an overwhelm spiral while it is peak intensity.',
};

// ── Response Builder ───────────────────────────────────────────────────────────
function OverthinkingResponseBuilder() {
  const [step,      setStep]      = useState(1);
  const [otType,    setOtType]    = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [timeAvail, setTimeAvail] = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openAct,   setOpenAct]   = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selType = OVERTHINK_TYPES.find(t => t.key === otType);
  const selInt  = INTENSITY_LEVELS.find(i => i.key === intensity);
  const selTime = TIME_AVAILABLE.find(t => t.key === timeAvail);
  const respPlan= timeAvail ? RESPONSE_BY_TIME[timeAvail] : null;

  const handleReset = () => { setStep(1); setOtType(null); setIntensity(null); setTimeAvail(null); setRevealed(false); setOpenAct(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? MOSS : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What type of overthinking is happening right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the pattern that is most active — the dominant flavour of the spiral.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {OVERTHINK_TYPES.map(t => {
              const isSel = otType === t.key;
              return (
                <button key={t.key} onClick={() => setOtType(t.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? t.color : 'var(--border)', background: isSel ? t.bg : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${t.color}30` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? t.color : 'var(--ink)', marginBottom: '2px' }}>{t.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (otType) setStep(2); }} disabled={!otType} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: otType ? `linear-gradient(135deg, ${MOSS}, #5A9E72)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: otType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: otType ? `0 6px 18px ${MBORD}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How intense is the overthinking right now?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {INTENSITY_LEVELS.map(il => {
              const isSel = intensity === il.key;
              return (
                <button key={il.key} onClick={() => setIntensity(il.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? MOSS : 'var(--border)', background: isSel ? MPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${MBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '22px' }}>{il.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? MOSS : 'var(--ink)' }}>{il.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (intensity) setStep(3); }} disabled={!intensity} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: intensity ? `linear-gradient(135deg, ${MOSS}, #5A9E72)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: intensity ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — How much time do you have right now?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {TIME_AVAILABLE.map(ta => {
              const isSel = timeAvail === ta.key;
              return (
                <button key={ta.key} onClick={() => setTimeAvail(ta.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? MOSS : 'var(--border)', background: isSel ? MPALE : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  boxShadow: isSel ? `0 0 0 2px ${MBORD}` : 'none',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? MOSS : 'var(--ink)' }}>{ta.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (timeAvail) { setStep(4); setRevealed(false); } }} disabled={!timeAvail} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: timeAvail ? `linear-gradient(135deg, ${MOSS}, #5A9E72)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: timeAvail ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Response Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — Results */}
      {step === 4 && selType && selInt && selTime && respPlan && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Overthinking Response Plan</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${MOSS}, #5A9E72)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${MBORD}`,
              }}>🌿 Generate My Response Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${MOSS}, #5A9E72)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{selType.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Response Plan</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{selType.label} · {selInt.label}</div>
              </div>

              {/* Intensity note */}
              <div style={{ background: MPALE, border: `1.5px solid ${MBORD}`, borderRadius: '12px', padding: '12px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MOSS, marginBottom: '4px' }}>📍 At Your Intensity Level</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{INTENSITY_NOTES[intensity]}</p>
              </div>

              {/* What is happening */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '5px' }}>🔬 What Is Happening</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selType.what_happening}</p>
              </div>

              {/* Mindful interruption */}
              <div style={{ background: MPALE, border: `1.5px solid ${MBORD}`, borderRadius: '12px', padding: '12px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MOSS, marginBottom: '5px' }}>🧘 Mindful Interruption</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500', fontStyle: 'italic' }}>"{selType.mindful_interruption}"</p>
              </div>

              {/* Response plan steps — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MOSS, marginBottom: '8px' }}>
                  🎯 {respPlan.title}
                </div>
                {respPlan.actions.map((a, i) => {
                  const isOpen = openAct === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '6px', border: `1.5px solid ${MBORD}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenAct(isOpen ? null : i)} style={{
                        width: '100%', padding: '12px 15px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${MOSS}, #5A9E72)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{a.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: MOSS, flex: 1 }}>Action {i + 1}</span>
                        <span style={{ color: MOSS, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 15px 12px 15px', borderTop: '1px solid var(--border)' }}>
                          <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{a.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Type-specific actions */}
              <div style={{ background: 'white', border: `1.5px solid ${MBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MOSS, marginBottom: '7px' }}>🛠️ For This Specific Pattern</div>
                {selType.action_steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '9px', padding: '5px 0', borderBottom: i < selType.action_steps.length - 1 ? `1px solid ${MBORD}` : 'none' }}>
                    <span style={{ color: MOSS, fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>→</span>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{s}</p>
                  </div>
                ))}
              </div>

              {/* Grounding + example */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div style={{ background: MPALE, border: `1.5px solid ${MBORD}`, borderRadius: '11px', padding: '12px 13px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: MOSS, marginBottom: '4px' }}>⚓ Best Grounding</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{selType.grounding}</p>
                </div>
                <div style={{ background: 'white', border: `1.5px solid ${MBORD}`, borderRadius: '11px', padding: '12px 13px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: MOSS, marginBottom: '4px' }}>👤 Student Example</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>"{selType.student_example.split('.')[0]}."</p>
                </div>
              </div>

              {/* Affirmation */}
              <div style={{ background: MPALE, border: `1.5px dashed ${MBORD}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: MOSS, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "The present moment is the only place where anything useful can happen. The spiral is always somewhere else. Come back here."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${MBORD}`, color: MOSS, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a plan for a different spiral</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Grounding timer ────────────────────────────────────────────────────────────
function GroundingTimer({ label, seconds, color, instruction, onClose }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(intRef.current); setRunning(false); setDone(true); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  return (
    <div style={{ background: `${color}10`, borderRadius: '12px', padding: '16px', border: `1.5px solid ${color}30`, fontFamily: font }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color }}>{label}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>×</button>
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{instruction}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', fontWeight: '700', color: done ? '#2D7D46' : color, width: '70px', textAlign: 'center' }}>
          {done ? '✓' : timeLeft}
        </div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {!running && !done && <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: color, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Start</button>}
          {running && <button onClick={() => { setRunning(false); clearInterval(intRef.current); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>}
          {!running && timeLeft < seconds && !done && <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: color, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>}
          {done && <button onClick={() => { setTimeLeft(seconds); setDone(false); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#2D7D46', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Repeat</button>}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StayPresentStopOverthinking({ navigate, relatedPosts }) {
  const [activeGrounding, setActiveGrounding] = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const GROUNDING_EXERCISES = [
    {
      id: 'five_senses', icon: '👁️', label: '5-4-3-2-1 Sensory Grounding',
      color: '#1A7272', seconds: 180,
      instruction: 'Name five things you can see right now — slowly, one at a time. Then four things you can physically feel. Three sounds. Two things you can smell. One taste. Speak each one quietly. Full attention on the naming — not the spiral.',
      when: 'Any overthinking type — universally effective for interrupting the spiral.',
    },
    {
      id: 'cold_water', icon: '💧', label: 'Cold Water Reset',
      color: '#2D5A8A', seconds: 30,
      instruction: 'Run cold water over your face and wrists for 30 seconds. This activates the mammalian diving reflex — a direct physiological reduction in heart rate and stress response. It works fastest for emotional overwhelm and comparison spirals.',
      when: 'Emotional overwhelm, social rumination, overwhelming intensity.',
    },
    {
      id: 'feet_floor', icon: '👣', label: 'Feet on Floor',
      color: '#2D6B45', seconds: 60,
      instruction: 'Press both feet firmly into the floor. Feel the weight of your body in the chair. Attend to the physical sensation of being supported by the surface under you — the pressure, the temperature, the solidity. You are here, in this room, in this body.',
      when: 'What-if spirals, catastrophising — when attention is pulled far into imagined futures.',
    },
    {
      id: 'breath_anchor', icon: '😮‍💨', label: 'Three Physiological Sighs',
      color: MOSS, seconds: 45,
      instruction: 'Double inhale through the nose (fill completely, then top-up), then one long, complete exhale through the mouth. Three times. This is the fastest available cortisol reset — works within 30 seconds. Do it now, before any other technique.',
      when: 'Any overthinking, any intensity — always first.',
    },
    {
      id: 'body_scan_quick', icon: '🧘', label: '2-Minute Body Scan',
      color: '#5B3A8B', seconds: 120,
      instruction: 'Starting at the top of your head, slowly move attention downward — scalp, forehead, jaw, neck, shoulders, chest, belly, hands. At each area, simply notice what is there and soften it slightly. The spiral lives in the mind; the body is always in the present.',
      when: 'Moderate and overwhelming intensity — when the whole body is carrying the spiral.',
    },
  ];

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
      <p>The mind that is always somewhere else — planning next week's exam while eating today's lunch, replaying yesterday's result while trying to study today, imagining every possible version of a future that has not happened yet — is not a focused mind. It is an anxious one. And most students have it constantly, at low levels, as a kind of background noise so familiar they have stopped noticing it is there.</p>

      <p>Learning <strong>how to stop overthinking</strong> is not about achieving a permanently calm, thought-free mind. That is not available and would not be useful if it were. It is about building the specific capacity to notice when thinking has crossed from useful into cyclical, to interrupt the spiral before it has consumed the hour, and to return to the present moment — where studying is possible, where rest is possible, where genuine life is actually happening.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to stay present and stop overthinking — mindfulness methods, grounding exercises, and practical daily tools"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-overthink">1. Why Students Overthink — The Psychology</h3>

      <p><strong>The default mode network — the brain's overthinking engine.</strong> When the brain is not engaged in a specific directed task, it activates the default mode network (DMN) — a set of brain regions (medial prefrontal cortex, posterior cingulate cortex, angular gyrus) associated with self-referential thinking, future simulation, and past review. The DMN is not malfunctioning when it produces overthinking; it is doing exactly what it evolved to do — reviewing the past for lessons and simulating the future for preparation. The problem arises when the DMN activates disproportionately, runs without useful output, and cannot be voluntarily deactivated in favour of the task-positive network that directed study requires. Research by Marcus Raichle at Washington University in St. Louis, who identified the DMN in 2001, shows that the DMN and the task-positive network suppress each other — which is why overthinking and focused studying cannot easily coexist.</p>

      <p><strong>Uncertainty as the trigger.</strong> Research by Michel Dugas at Concordia University identifies intolerance of uncertainty as the primary cognitive driver of overthinking. The brain treats uncertainty as a form of threat, and its response to threat is to run simulations — possible scenarios of how the uncertainty might resolve — in an attempt to achieve the certainty that would deactivate the threat response. This strategy fails for uncertain outcomes (exam results, what others think, whether a decision was correct) because certainty is not achievable through additional thinking. The result is an escalating spiral: more simulation produces more uncertainty-related distress, which triggers more simulation.</p>

      <p><strong>The high-stakes academic context as a perfect overthinking environment.</strong> Academic life provides exactly the conditions that maximise overthinking: genuine high-stakes outcomes that are partially outside the student's control, extended periods between effort and feedback (studying for weeks before exam results), social comparison contexts that continuously produce uncertainty about relative standing, and the cultural message that anxious vigilance about academic outcomes is both appropriate and productive. Students who overthink about exams are not irrationally worried about trivial things — they are applying an evolved threat-response mechanism to genuine uncertainties in a context that specifically amplifies the mechanism.</p>

      <p><strong>Rumination versus reflection — the useful line.</strong> Not all extended thinking about the past or future is overthinking. Reflection — reviewing what happened with the goal of extracting a specific lesson for use in future behaviour — is valuable and productive. Rumination — replaying the same content repeatedly without extracting new information or changing any behaviour — is the maladaptive version. Research by Susan Nolen-Hoeksema at Yale identifies the distinguishing feature: reflection produces movement (toward a decision, a lesson, a different approach); rumination produces the same circuit indefinitely without movement. The question "what am I learning from thinking about this right now?" identifies whether the thinking is reflection or rumination.</p>

      {/* ── Section 2 ── */}
      <h3 id="methods">2. Six Mindfulness Methods for Returning to the Present</h3>

      <p><strong>Method 1 — The naming technique (affect labelling).</strong> Research by Ethan Kross at the University of Michigan on affect labelling shows that specifically naming a mental state — "I notice I am catastrophising about the exam result" — reduces the amygdala activation associated with that state within seconds. The naming creates a small but significant cognitive distance between the observer and the thought — converting the thought from something you are in to something you are observing. This distance is the first and most essential step of any mindfulness-based overthinking interruption. The more specific the label, the more effective: "I am thinking about what might happen if I fail" is more effective than "I am anxious."</p>

      <p><strong>Method 2 — The useful/not-useful question.</strong> For any thought that is consuming attention, ask: "Is there a specific, useful action I can take right now in response to this?" If yes — take it, and the thought has served its purpose. If no — write the thought in the parking lot notebook and return to the task. This binary question converts overthinking from an infinite loop into a finite decision: either actionable or deferrable. Research on implementation intentions by Peter Gollwitzer shows that pre-deciding the response to a specific type of intrusive thought ("when I notice a what-if thought, I will write it and return to work") significantly reduces the thought's intrusive frequency over time.</p>

      <p><strong>Method 3 — The parking lot technique.</strong> Keep a small notebook beside study materials. When an intrusive thought arrives, write it in one sentence — not to solve it, to acknowledge it — and return to work. The brain holds unresolved items in active working memory as a reminder mechanism; writing them discharges this holding, freeing the cognitive capacity that active holding was consuming. The parking lot works best when it is a physical notebook rather than a phone (opening a phone to write a thought introduces the phone's distraction environment into the study session).</p>

      <p><strong>Method 4 — The breath anchor.</strong> The simplest and fastest return to the present: one deliberate breath. Inhale through the nose for four counts; exhale slowly for six. The extended exhale activates the vagus nerve and parasympathetic response. The deliberateness of the breath — the conscious direction of attention to the physical sensation of breathing — interrupts the automatic continuation of the overthinking cycle by occupying the attentional focus that the cycle was running on. This technique requires no preparation, no special conditions, and no time — it can be used in any situation in which overthinking arises.</p>

      <p><strong>Method 5 — The present-tense observation practice.</strong> When noticing overthinking, deliberately redirect attention to one specific present-moment observation: "Right now, I am sitting at this desk. The light is warm. My hands are on the keyboard. I can hear traffic outside." This is not denial of the worry — it is the deliberate exercise of the attentional redirection that mindfulness builds. The practice of returning attention to the present repeatedly is the same practice as returning attention to the breath in formal meditation: each return is a repetition of the skill.</p>

      <p><strong>Method 6 — The evidence examination (for persistent thoughts).</strong> For overthinking that returns repeatedly despite naming and grounding, the evidence examination provides a deeper interruption. Write the specific overthought belief: "I am going to fail this exam." Then write two columns: "Evidence that supports this" and "Evidence that contradicts or does not support this." Research on cognitive restructuring by Aaron Beck shows that examining the actual evidence for an anxious thought reduces its emotional impact not by forcing positive thinking but by correcting the selective evidence-gathering that makes it feel more certain than it is. Almost every catastrophising thought has significantly more contradicting evidence than it initially seems to.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Overthinking Response Builder</h3>
      <p>The Builder generates a personalised response plan for your specific overthinking type, intensity level, and available time. It includes what is actually happening psychologically, a mindful interruption phrase, time-calibrated actions, specific steps for your pattern type, and your best grounding technique.</p>

      <OverthinkingResponseBuilder />

      {/* ── Section 4 ── */}
      <h3 id="grounding">4. Five Grounding Exercises for Acute Overthinking</h3>
      <p>Grounding exercises work by redirecting attention from the abstract content of the overthinking spiral to the specific, sensory present moment. The brain cannot simultaneously process detailed sensory input and run the abstract cognitive simulations of overthinking — grounding interrupts the spiral by occupying the attention with something real and present. Tap any exercise to practise it with a timer.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', fontFamily: font }}>
        {GROUNDING_EXERCISES.map(ex => {
          const isActive = activeGrounding === ex.id;
          return (
            <div key={ex.id}>
              <button onClick={() => setActiveGrounding(isActive ? null : ex.id)} style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                borderColor: isActive ? ex.color : 'var(--border)',
                background: isActive ? `${ex.color}10` : 'white',
                cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{ex.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? ex.color : 'var(--ink)', marginBottom: '1px' }}>{ex.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{ex.when}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: isActive ? ex.color : 'var(--muted)', fontWeight: '600' }}>{Math.ceil(ex.seconds / 60)} min</span>
                  <span style={{ color: isActive ? ex.color : 'var(--muted)', fontSize: '16px' }}>{isActive ? '▲' : '▶'}</span>
                </div>
              </button>
              {isActive && (
                <div style={{ marginTop: '8px', animation: 'floatUp 0.3s ease' }}>
                  <GroundingTimer
                    label={ex.label} seconds={ex.seconds} color={ex.color}
                    instruction={ex.instruction} onClose={() => setActiveGrounding(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 5 ── */}
      <h3 id="situations">5. Relatable Situations — What to Do in Each One</h3>

      <p><strong>Situation 1: Lying awake at 11pm catastrophising about tomorrow's exam.</strong><br />
      What is happening: anticipatory rumination — the brain simulating tomorrow's feared outcomes as an unsuccessful attempt to achieve certainty and reduce threat activation. The simulation is unsuccessful because the exam has not happened and certainty is not available through additional thinking.<br />
      What to do: write everything on your mind in three minutes (worry download — transfers the content from active holding to paper, discharging the brain's reminder function). Then close the notebook. Then 4-7-8 breathing lying down until sleep arrives. The preparation is done; the thinking cannot improve it further.</p>

      <p><strong>Situation 2: In the exam hall, blanking and spiralling into panic.</strong><br />
      What is happening: acute cortisol spike activating the amygdala and downregulating the prefrontal cortex — the exact cognitive system needed for exam performance. The spiral is both caused by and amplifying the performance impairment.<br />
      What to do: one physiological sigh (double inhale, long exhale). Press both feet into the floor for ten seconds. Name what you can see from where you are — three items. Write "I am here now" in the margin of the paper. Then start with the question you most know how to answer — any question — to generate the initial momentum that interrupts the blank.</p>

      <p><strong>Situation 3: Reading the same paragraph six times without it going in.</strong><br />
      What is happening: the default mode network is competing with the task-positive network for attentional resources — and winning. The overthinking content is occupying the cognitive foreground; the text is in the background.<br />
      What to do: park whatever is on your mind (one sentence in the notebook). Stand up, stretch, take three physiological sighs. Return to the desk and do active recall on what you read before the distraction — write it from memory. The active recall interrupts the passive re-reading loop and re-engages the task-positive network.</p>

      <p><strong>Situation 4: Scrolling social media and comparing yourself to high-achieving peers.</strong><br />
      What is happening: upward social comparison activating a sense of relative inadequacy — which triggers further scrolling in search of more comparison data, which produces more inadequacy, in a cycle maintained by the variable reward of occasionally finding a post that is less threatening.<br />
      What to do: close the app deliberately. Say quietly: "I was comparing my internal experience to someone else's external presentation." Write one specific thing you accomplished today — not compared to anyone else, just yours. Do three extended exhale breaths (in for 4, out for 8). Then return to the task you left.</p>

      <p><strong>Situation 5: After a difficult conversation with a parent about results.</strong><br />
      What is happening: social rumination — replaying the conversation's tone, words, and your responses, constructing interpretations of what was meant, imagining extended consequences of the family dynamic.<br />
      What to do: set a 20-minute processing window. Write the conversation from memory and what you genuinely felt. Extract one useful thing: "What, if anything, do I want to do differently in the next conversation?" Then write: "I have processed this. What is unresolved will unfold as it unfolds. I cannot resolve it by replaying it further." Close the notebook. Return to something genuinely absorbing — not studying if possible, something that fully occupies attention for 30 minutes.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Overthinking FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have tried mindfulness techniques but my mind just keeps going back to the worry. Does this mean they are not working?</strong><br />
        A: The mind returning to the worry is expected — it is the brain doing its threat-monitoring job, not evidence that the techniques have failed. The technique is not supposed to permanently eliminate the thought on first application; it is supposed to create one instance of returning to the present. Each time the thought returns and you apply the technique again, you are practising the skill of return — which gets easier and faster with repetition over days and weeks. The goal is not a worry-free mind; it is a mind that can notice the worry and return to the present with decreasing effort and delay. That improvement is gradual and measurable across two to four weeks of consistent practice.</p>

        <p><strong>Q: My overthinking feels like it serves a purpose — it feels like preparing. If I stop, won't I be less prepared?</strong><br />
        A: This is the most important and most common misconception about overthinking. Useful preparation is specific, actionable, and produces a concrete output — a study plan, a revised approach, a question answered. Overthinking feels like preparation but produces no output; it is the feeling of being engaged with the concern without the actual productive engagement. Research by Nolen-Hoeksema consistently shows that ruminators do not solve their problems more effectively than non-ruminators — they take longer and experience more distress. The preparation work is the active recall, the practice problem, the review session. The overthinking is the anxiety that shadows it and produces nothing.</p>

        <p><strong>Q: Is there a point at which overthinking requires professional help rather than self-management?</strong><br />
        A: Yes. Indicators that professional support is appropriate: overthinking that is significantly and persistently disrupting daily functioning (sleep, eating, study, relationships) for more than two to three weeks; overthinking accompanied by persistent hopelessness, inability to feel positive emotions, or thoughts of self-harm; overthinking that escalates despite consistent application of self-management tools rather than diminishing; or a history of anxiety or OCD that the current tools are not adequately managing. The techniques in this guide are evidence-backed self-management tools for the range of overthinking that most students experience. For clinical-level anxiety, these tools complement professional treatment; they do not replace it.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: MOSS, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The spiral is always somewhere else — in a future that has not happened or a past that is fixed. The present is here, and it is where you actually live."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Overthinking will not stop immediately or completely. But with each naming, each grounding exercise, each deliberate return to the present, the spiral has a slightly shorter runway — and the present becomes a slightly more familiar and accessible place. That is the practice. That is the whole of it.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: MOSS, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${MBORD}` }}
          >
            Practise Presence in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: MOSS, border: `2px solid ${MOSS}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
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
            ['/blog/mindfulness-for-students',         '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/daily-mindfulness-practice',       '→ How to Practice Mindfulness Daily for Better Mental Health'],
            ['/blog/breathing-exercises-stress',       '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/benefits-of-mindfulness',          '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/blog/exam-results-stress',              '→ How to Handle Exam Results Stress and Anxiety'],
            ['/blog/fear-of-failure-studies',          '→ How to Overcome Fear of Failure in Studies'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: MOSS, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
