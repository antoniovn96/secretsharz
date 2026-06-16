import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stay Mentally Present in School Life",
  excerpt: "Being physically in school while being mentally somewhere else entirely is one of the most common and most costly forms of student experience. The class you sat through but did not register, the study session where the page was turned but nothing was processed, the exam where the preparation dissolved because the mind was in a future failure rather than in the present question — all of these are the specific cost of mental absence. This guide gives you the techniques to return.",
  category: "Mental Health",
  date: "27-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mentally-present-school-life.jpg",
  tldr: "Mental presence in school is the capacity to direct genuine attention to the actual current moment — the lecture, the question, the task, the conversation — rather than the imagined future or replayed past. It is built through specific focus techniques and daily mindfulness practice, and disrupted by digital overload, academic anxiety, and the habitual mind-wandering that school environments sometimes reinforce rather than reduce.",
  toc: [
    { id: "what-present", title: "1. What It Means to Be Mentally Present at School",                 level: 3 },
    { id: "pulls-away",   title: "2. What Pulls Students Away — School-Specific Distractions",       level: 3 },
    { id: "finder",       title: "3. Interactive: The School Presence Finder",                        level: 3 },
    { id: "techniques",   title: "4. Focus Techniques for School Life",                               level: 3 },
    { id: "examples",     title: "5. School Situations — With and Without Presence",                  level: 3 },
    { id: "habits",       title: "6. Daily Presence Habits for Students",                             level: 3 },
    { id: "faq",          title: "7. Stay Mentally Present FAQs",                                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-27T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "stay mentally present, how to be present at school, mental presence school life, focus techniques school, school distractions mindfulness, present moment school, mindfulness student focus",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stay mentally present in class?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Staying mentally present in class requires five specific techniques. First, the arrival practice: before the lecture begins, take three slow breaths and write the subject and one question you genuinely want answered — this primes the attentional networks for relevance-based listening. Second, the note-capture rule: every time attention drifts, write one word about what the teacher just said before re-engaging — the writing act returns attention to the auditory content. Third, genuine questions: one genuine question per class written in the margin engages the evaluative attention that passive reception does not. Fourth, the physiological sigh when drowsiness or distraction is severe — the breath reset restores alertness briefly. Fifth, eliminate the phone from the desk entirely — research documents that the mere presence of a phone reduces cognitive capacity measurably even when it is silent and face-down.",
      },
    },
    {
      "@type": "Question",
      "name": "Why is it so hard to focus in school?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is hard to focus in school for four structural reasons. First, the passive reception format of most classes (listening rather than doing) is specifically the context in which the default mode network activates — the brain generates self-referential content automatically when not required to produce active output. Second, digital devices produce intermittent variable reward patterns that condition habitual checking, which fragments attention even when not actively used. Third, academic anxiety activates the same neural threat systems as physical danger, pulling attention toward threat simulation rather than current content. Fourth, sleep deprivation, common among students, directly impairs the prefrontal attention regulation system. None of these is a character failure — all are structural and addressable.",
      },
    },
    {
      "@type": "Question",
      "name": "What mindfulness techniques help with staying present at school?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Five mindfulness techniques most useful for school presence: the noting technique (labelling off-task thoughts as 'planning,' 'worrying,' or 'daydreaming' without engaging their content — reduces their pull within sessions); the feet-on-floor anchor (pressing feet into the floor during class to provide a present-moment physical anchor whenever attention drifts); the pre-class arrival breath (three slow breaths before each lesson to transition from corridor-scattered to classroom-present); the mindful walk between lessons (phone away, attention on physical walking — five minutes that restore attentional capacity before the next lesson begins); and the end-of-lesson recall question ('What specifically do I remember from this class?' — rehearsal at the lesson boundary is the highest-leverage memory consolidation available).",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const PERI    = '#5A68A8';
const PPALE   = '#EDEFFE';
const PBORD   = 'rgba(90,104,168,0.22)';

// ── School Situations ──────────────────────────────────────────────────────────
const SCHOOL_SITUATIONS = [
  {
    key:    'in_class',
    icon:   '🏫',
    label:  'In a class or lecture',
    desc:   'Sitting in class but the mind keeps drifting away',
    color:  PERI,
    bg:     PPALE,
    challenge: 'Passive reception in a lecture activates the default mode network — the brain\'s self-referential autopilot. Without active output (writing, questioning, responding), the DMN fills the attentional space with planning, worrying, and social cognition automatically. Being physically present but mentally absent is not a character failing; it is what the passive listening format produces in every brain that is not actively fighting it.',
    strategies: [
      { icon: '✍️', title: 'One-question pre-class prime', detail: 'Before the lesson starts: write one genuine question about today\'s topic in your notebook. Research by Roediger on retrieval practice shows that formulating a question before a lecture improves encoding of the lecture material by approximately 30% — the question primes the attentional networks for relevance-based listening.' },
      { icon: '📝', title: 'Note-capture return rule', detail: 'Every time you notice attention has drifted: write the last thing the teacher said (even one word) before re-engaging with the content. The writing act requires auditory attention to capture, pulling the mind back. This note-capture return is more effective than simply deciding to pay attention, which requires no specific action.' },
      { icon: '👣', title: 'Feet-on-floor classroom anchor', detail: 'When attention is drifting, press both feet firmly into the floor for 10 seconds — this is invisible and provides immediate sensory present-moment anchoring that competes with the DMN\'s abstract content generation.' },
      { icon: '❓', title: 'One genuine question per class', detail: 'At any point during the lesson: write one genuine question that the content has triggered. The evaluative questioning mode of attention is specifically incompatible with passive mind-wandering — asking a real question requires full attentional engagement with what is being said.' },
    ],
    example: 'Priya would sit through biology lectures and arrive at the end with four pages of notes but almost no memory of the class — her hand was copying while her mind was elsewhere. She started the one-question pre-class practice: "What specific mechanism does today\'s lecture explain?" The question gave her listening a target, and the class felt entirely different. "I was actually there instead of just physically present."',
    technique: 'feet_breath',
  },
  {
    key:    'self_study',
    icon:   '📚',
    label:  'During self-study at home',
    desc:   'Studying but the mind keeps wandering or returning to the phone',
    color:  '#2D5A8A',
    bg:     '#EEF3FB',
    challenge: 'Self-study produces the highest mind-wandering rates because external regulation (the teacher\'s presence) is absent and the phone is present. Research by Killingsworth and Gilbert documents 47% of waking hours involve mind-wandering — self-study without external accountability represents the most demanding environment for sustained present-moment attention.',
    strategies: [
      { icon: '📵', title: 'Phone in another room — structural', detail: 'Not silenced. Not face-down. Physically absent. This is not a practice — it is a structural change that removes the intermittent reward trigger that digital devices produce and eliminates the anticipatory cognitive load of potential incoming information.' },
      { icon: '📝', title: 'Pre-study brain dump + one task', detail: 'Three minutes of writing everything currently in the head (emptying the queue), then one sentence: "This session is for ___." Opening the right page and beginning immediately from this cleared, intentional position converts scattered self-study into present-moment study.' },
      { icon: '📓', title: 'Parking lot notebook', detail: 'Small notebook beside materials — every off-task thought written in one phrase, returned to task immediately. The parking lot eliminates the need to either hold the thought (depleting working memory) or act on it (abandoning the session).' },
      { icon: '⏱️', title: 'Mindful Pomodoro (25-min + genuine break)', detail: '25 minutes of single-task focus, followed by 5 minutes of genuine open awareness — not phone. The phone break during Pomodoro is the primary reason standard Pomodoro does not work for most students: research shows phone use maintains cognitive arousal rather than restoring it.' },
    ],
    example: '"I used to study with my phone on the desk "just in case." One day I counted: I checked it 23 times in 90 minutes. I started putting it in the kitchen. My study sessions became genuinely shorter because I was actually doing them." — Rohan',
    technique: 'pre_study_anchor',
  },
  {
    key:    'exam',
    icon:   '📝',
    label:  'During an exam or test',
    desc:   'Mind going blank, panic arriving, attention leaving the question on the paper',
    color:  '#8B2635',
    bg:     '#FBF0F1',
    challenge: 'Exam panic is a specific attentional emergency: cortisol spikes sharply in response to the high-stakes performance context, the amygdala pulls attention toward threat simulation (imagined failure) rather than the present task (the current question), and the hippocampal retrieval process is temporarily impaired by the cortisol — producing the classic blank. The blank is physiological, not evidential — it does not prove you do not know the material.',
    strategies: [
      { icon: '😮‍💨', title: 'Pre-exam three sighs — outside the hall', detail: 'Three physiological sighs before entering the exam hall. The cortisol modulation these produce reduces the initial spike severity and restores enough prefrontal function to begin.' },
      { icon: '👣', title: 'Feet on floor when seated', detail: 'When seated: press both feet into the floor, feel the weight of the body in the chair. This physical grounding is the single fastest available technique for pulling attention from the imagined-failure future back to the present exam paper.' },
      { icon: '📝', title: 'Write "HERE" in the margin', detail: 'When the mind panics: write the word "HERE" in the paper margin. The act of writing a present-moment text anchor is both a present-moment action (refocusing through movement) and a cognitive interrupt of the panic spiral.' },
      { icon: '🎯', title: 'Start with a question you know', detail: 'Rather than working in order: find any question where the answer is accessible and begin there. The momentum of successfully answering one question reduces cortisol and restores the retrieval access that the initial panic blocked.' },
    ],
    example: '"My exam strategy was always to start with question one regardless. Then I blanked on question one in every exam and the panic cascaded. I switched to scanning the paper, finding one I could answer, and starting there. The blank became a 2-minute recovery instead of a 20-minute crisis." — Aryan',
    technique: 'exam_presence',
  },
  {
    key:    'social',
    icon:   '👥',
    label:  'In conversations or group work',
    desc:   'Present physically but thinking about what to say next instead of listening',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    challenge: 'Social presence — being genuinely with the other person rather than inside your own head — is disrupted by the listening-to-respond rather than listening-to-understand pattern. When the mind is preparing its next contribution while the other person speaks, it is receiving approximately 30% of the incoming information and constructing responses from incomplete understanding. The resulting conversations feel less connected than either party wants.',
    strategies: [
      { icon: '👂', title: 'Listen for the emotion, not just the content', detail: 'Give the other person your full attention by listening for both what they are saying AND how they are feeling about it. This dual-channel listening requires complete present-moment engagement — there is not enough cognitive capacity for it and simultaneous response planning.' },
      { icon: '🏷️', title: 'Summarise before responding', detail: 'Before contributing your own thought: summarise in one sentence what the other person just said. This forces genuine listening (you cannot summarise what you did not hear), creates a brief pause that often improves response quality, and signals genuine attention to the speaker.' },
      { icon: '📵', title: 'Phone away during all conversations', detail: 'Any phone on the table during a conversation — even silent, even face-down — reduces both parties\' genuine engagement. Physical removal is the only structural solution.' },
      { icon: '✨', title: 'One genuine observation per exchange', detail: 'In any significant conversation: contribute one genuinely specific observation about what the other person has shared — not general agreement, specific engagement with their specific content. This disciplines your attention toward the actual content of their contribution.' },
    ],
    example: '"I used to leave group study sessions feeling like they had happened to me rather than that I had been in them. When I started the summarise-before-responding practice, the sessions became actual exchanges. People also started treating my contributions differently — I think because I was actually responding to them rather than to my idea of what they had said." — Meera',
    technique: 'listening_presence',
  },
  {
    key:    'transition',
    icon:   '🚶',
    label:  'Between classes — corridors and breaks',
    desc:   'Transition time colonised by the phone — no genuine recovery before the next class',
    color:  '#2D6B45',
    bg:     '#E8F4EE',
    challenge: 'The transition between classes is one of the most valuable and most wasted opportunities in the school day. It is the only naturally occurring attentional restoration window — a brief period between two directed attention demands that, used mindfully, genuinely restores the capacity for the next session. Used as a scrolling window, it maintains or increases the cognitive arousal that was already high from the previous session, eliminating the restoration it could have provided.',
    strategies: [
      { icon: '🚶', title: 'Phone-free transition walk', detail: 'Every walk between classrooms or buildings: phone in bag, full attention on the physical experience of walking — foot lifting, moving, landing, rhythm of left-right. Five minutes of this provides the same attentional restoration as meditation, with zero additional time.' },
      { icon: '🌅', title: 'Natural light window', detail: 'During any outdoor transition: look up. Direct visual contact with sky and natural environment for even 30 seconds produces measurable cortisol reduction and attentional restoration through the mechanisms Kaplan\'s attention restoration theory documents.' },
      { icon: '💬', title: 'One genuine in-person exchange', detail: 'One real conversation — face to face, present and listening — during any break period provides ventral vagal social engagement system activation that is unavailable through any solo practice. The calm of being genuinely seen by another person is neurologically irreplaceable.' },
      { icon: '😮‍💨', title: 'Lesson-closing three sighs', detail: 'At the moment each class ends — before packing up — three physiological sighs discharge the cortisol accumulated during the lesson and begin the attentional restoration before the phone gets picked up.' },
    ],
    example: '"I realised I was getting less from the second class than the first, and less from the third than the second. I started walking between classes without the phone and doing three sighs before packing up. The sessions stopped declining across the day." — Vikram',
    technique: 'walking_presence',
  },
];

// ── Focus techniques with timers ──────────────────────────────────────────────
const FOCUS_TECHNIQUES = {
  feet_breath: {
    id: 'feet_breath', icon: '👣', name: 'In-Class Presence Anchor', color: PERI, bg: PPALE,
    time: '60 seconds', secs: 60,
    desc: 'The invisible in-class return-to-presence technique — works in any public setting.',
    phases: [
      { name: 'Feet',    secs: 15, note: 'Press both feet firmly into the floor. Feel the exact weight, pressure, and temperature of contact. The floor is solid. You are physically here.' },
      { name: 'Body',    secs: 15, note: 'Feel the weight of the body in the chair. Shoulders settling. Hands in lap or on the desk. This specific physical reality is present-moment.' },
      { name: 'Hear',    secs: 15, note: 'Listen for the sound of the teacher\'s voice — not the meaning yet, just the physical sound of it. This sensory channel pulls attention back to the room.' },
      { name: 'Return',  secs: 15, note: 'Take one quiet nasal breath. Write the last word spoken. You are back in the room — from the word forward, genuinely present.' },
    ],
    cycles: 1,
    tip: 'Practised at home until automatic, this sequence becomes available in class when needed — taking under 60 seconds invisibly.',
  },
  pre_study_anchor: {
    id: 'pre_study_anchor', icon: '📚', name: 'Pre-Study Presence Ritual', color: '#2D5A8A', bg: '#EEF3FB',
    time: '3 minutes', secs: 180,
    phases: [
      { name: 'Brain dump', secs: 90, note: 'Write everything currently in the head — every concern, task, thought — uncensored for 90 seconds. You are clearing the queue before beginning.' },
      { name: 'Three sighs', secs: 20, note: 'Three physiological sighs: double inhale through nose, long exhale through mouth. The physical session transition.' },
      { name: 'Set the task', secs: 30, note: 'Write one sentence: "This session is for ___." Read it. Say it quietly. This is the cognitive transition.' },
      { name: 'Begin',       secs: 40, note: 'Open the material to exactly the right page. Begin with the first word. You are now present in this session.' },
    ],
    cycles: 1,
    desc: 'Converts the scattered pre-study state into genuine focused presence in three minutes.',
    tip: 'The brain dump alone — three minutes of writing everything in the head before opening materials — produces the most significant single improvement in study session quality available.',
  },
  exam_presence: {
    id: 'exam_presence', icon: '📝', name: 'Exam Presence Recovery', color: '#8B2635', bg: '#FBF0F1',
    time: '2 minutes', secs: 120,
    phases: [
      { name: 'Three sighs',     secs: 20, note: 'Three physiological sighs — double inhale, long exhale. Cortisol begins reducing within 30 seconds.' },
      { name: 'Feet on floor',   secs: 15, note: 'Press both feet into the floor. Feel the weight of the body in the exam chair. You are physically here.' },
      { name: 'Write HERE',      secs: 10, note: 'In the paper margin: write the word "HERE." This is a present-moment text anchor — you have just done something in the present moment.' },
      { name: 'Scan for known',  secs: 30, note: 'Scan the paper quickly for any question where the answer feels accessible. Do not start with question one if it is blank — start with any question you can answer.' },
      { name: 'Begin',           secs: 45, note: 'Write the first sentence of your answer to the accessible question. The momentum of beginning is the cortisol reduction. You are in the exam now, doing it.' },
    ],
    cycles: 1,
    desc: 'The acute exam presence recovery sequence — from panic to functional within 2 minutes.',
    tip: 'This sequence works best when practised before exams so it is automatic during them. Practise it before study sessions, not just in actual exams.',
  },
  listening_presence: {
    id: 'listening_presence', icon: '👂', name: 'Genuine Listening Practice', color: '#5B3A8B', bg: '#F2EEF9',
    time: '5 minutes', secs: 300,
    phases: [
      { name: 'Settle', secs: 30, note: 'Close your eyes. Three breaths. Set the intention: "I am going to give the next person I talk to my complete present-moment attention."' },
      { name: 'Listen first', secs: 90, note: 'In your next conversation: do not plan your response while the other person speaks. Attend to both what they say AND how they seem to feel about it. Two channels, full attention.' },
      { name: 'Summarise', secs: 60, note: 'Before responding: "So what I am hearing is ___." One sentence of genuine summary. Not agreement, not challenge — genuine reflection of what you heard.' },
      { name: 'Respond', secs: 90, note: 'Now respond — from having genuinely heard, not from having pre-planned. Notice: does the quality of the exchange feel different?' },
      { name: 'Reflect', secs: 30, note: 'After: what specifically do you remember from what they said? The specificity of what you can recall is the measure of how present you actually were.' },
    ],
    cycles: 1,
    desc: 'A structured practice for building genuine social presence — the quality most lacking in digitally distracted social environments.',
    tip: 'Social presence produces the most surprising wellbeing benefits of any presence practice — because genuine connection is the most underused wellbeing resource in most students\' lives.',
  },
  walking_presence: {
    id: 'walking_presence', icon: '🚶', name: 'Mindful School Walk', color: '#2D6B45', bg: '#E8F4EE',
    time: '5 minutes', secs: 300,
    phases: [
      { name: 'Phone away', secs: 15, note: 'Phone into the bag. It will still be there in five minutes. These five minutes belong to you.' },
      { name: 'Feet',       secs: 60, note: 'Bring attention to the physical sensation of walking: the foot lifting off the ground, moving through the air, landing. The rhythm of left-right-left.' },
      { name: 'Environment', secs: 120, note: 'Expand attention to the environment: what can you see as you move? What sounds are present? Any smell in the air? You are moving through a specific physical reality.' },
      { name: 'Return',     secs: 75, note: 'When the mind goes to planning or reviewing: "thinking." Return to the foot sensation and the rhythm. Each return is a presence repetition.' },
      { name: 'Arrive',     secs: 30, note: 'Step into your next class or destination from this slightly more present, slightly calmer place. Notice whether the quality of arrival feels different.' },
    ],
    cycles: 1,
    desc: 'Converts the transition walk from cognitive depletion to genuine attentional restoration.',
    tip: 'The mindful walk between classes is the most time-efficient presence practice available — it produces attentional restoration during time that was already passing.',
  },
};

// ── School Presence Finder ─────────────────────────────────────────────────────
function SchoolPresenceFinder() {
  const [situation,  setSituation]  = useState(null);
  const [mode,       setMode]       = useState('select'); // select | guide | practice
  const [activeTech, setActiveTech] = useState(null);
  const [phIdx,      setPhIdx]      = useState(0);
  const [tLeft,      setTLeft]      = useState(0);
  const [running,    setRunning]    = useState(false);
  const [done,       setDone]       = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selSit  = SCHOOL_SITUATIONS.find(s => s.key === situation);
  const tech    = activeTech ? FOCUS_TECHNIQUES[activeTech] : null;
  const phases  = tech?.phases || [];
  const curPh   = phases[phIdx];

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTLeft(p => {
        if (p <= 1) {
          clearInterval(intRef.current); setRunning(false);
          const next = phIdx + 1;
          if (next >= phases.length) { setDone(true); return 0; }
          setPhIdx(next); setTLeft(phases[next].secs); setRunning(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phIdx, phases]);

  const startTech = (id) => {
    clearInterval(intRef.current);
    setActiveTech(id); setPhIdx(0); setTLeft(FOCUS_TECHNIQUES[id].phases[0].secs);
    setRunning(true); setDone(false); setMode('practice');
  };

  const handleReset = () => { clearInterval(intRef.current); setSituation(null); setMode('select'); setActiveTech(null); setPhIdx(0); setTLeft(0); setRunning(false); setDone(false); };

  const CIRC = 2 * Math.PI * 42;
  const mins = Math.floor(tLeft / 60);
  const secs = tLeft % 60;

  // Practice mode
  if (mode === 'practice' && tech) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ background: `${tech.color}15`, borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: tech.color }}>{tech.icon} {tech.name}</span>
          <button onClick={() => { clearInterval(intRef.current); setMode('guide'); setActiveTech(null); setRunning(false); setDone(false); setPhIdx(0); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
        </div>

        {!done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 12px auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="42" fill="none" stroke={`${tech.color}18`} strokeWidth="6" />
                <circle cx="55" cy="55" r="42" fill="none" stroke={tech.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (tLeft / (curPh?.secs || 1))}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: mins > 0 ? '18px' : '24px', fontWeight: '700', color: tech.color }}>
                  {mins > 0 ? `${mins}:${secs.toString().padStart(2,'0')}` : secs}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: tech.color, marginBottom: '4px' }}>{curPh?.name}</div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '8px' }}>
              {phases.map((_, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i < phIdx ? tech.color : i === phIdx ? `${tech.color}60` : 'var(--border)' }} />)}
            </div>
            <div style={{ background: tech.bg, borderRadius: '10px', padding: '12px 14px', marginBottom: '12px', textAlign: 'left', minHeight: '70px', border: `1px solid ${tech.color}20` }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75 }}>{curPh?.note}</p>
            </div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {running ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸</button>
                        : <button onClick={() => setRunning(true)} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${tech.color}, ${tech.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶</button>}
              <button onClick={() => { clearInterval(intRef.current); setPhIdx(0); setTLeft(phases[0].secs); setRunning(true); setDone(false); }} style={{ padding: '10px 14px', borderRadius: '50px', border: `1.5px solid ${tech.color}40`, background: 'transparent', color: tech.color, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺</button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: tech.color, marginBottom: '8px' }}>Present</div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{tech.tip}</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => startTech(tech.id)} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${tech.color}, ${tech.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={() => { clearInterval(intRef.current); setMode('guide'); setActiveTech(null); setDone(false); setPhIdx(0); }} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Guide mode
  if (mode === 'guide' && selSit) {
    const primaryTech = FOCUS_TECHNIQUES[selSit.technique];
    const altTechs    = Object.values(FOCUS_TECHNIQUES).filter(t => t.id !== selSit.technique).slice(0, 2);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ background: `linear-gradient(135deg, ${selSit.color}, ${selSit.color}BB)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selSit.icon}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>Presence Guide</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selSit.label}</div>
        </div>

        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>🧠 Why This Situation Produces Absence</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selSit.challenge}</p>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: PERI, marginBottom: '7px', letterSpacing: '1.2px' }}>🎯 FOUR PRESENCE STRATEGIES</div>
          {selSit.strategies.map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', marginBottom: '6px', border: `1.5px solid ${selSit.color}20`, borderLeft: `3px solid ${selSit.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>{s.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: selSit.color }}>{s.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{s.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ background: selSit.bg, border: `1.5px solid ${selSit.color}25`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selSit.color, marginBottom: '4px' }}>👤 Student Example</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selSit.example}</p>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: PERI, marginBottom: '7px', letterSpacing: '1.2px' }}>🕐 GUIDED PRACTICE</div>
          <div style={{ background: primaryTech.bg, border: `2px solid ${primaryTech.color}30`, borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '22px' }}>{primaryTech.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: primaryTech.color }}>{primaryTech.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{primaryTech.time}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{primaryTech.desc}</p>
            <button onClick={() => startTech(primaryTech.id)} style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${primaryTech.color}, ${primaryTech.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin Guided Practice</button>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: PERI, marginBottom: '7px', letterSpacing: '1.2px' }}>🔄 TRY THESE TOO</div>
          <div style={{ display: 'flex', gap: '7px' }}>
            {altTechs.map(t => (
              <button key={t.id} onClick={() => startTech(t.id)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `1.5px solid ${t.color}30`, background: t.bg, cursor: 'pointer', fontFamily: font, textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{t.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: t.color, marginBottom: '2px' }}>{t.name.split(' ')[0]}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{t.time}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${PBORD}`, color: PERI, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Try a different situation</button>
      </div>
    );
  }

  // Select mode
  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        The School Presence Finder
      </p>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Choose your school situation — the Finder gives you a complete presence guide with the specific challenge, four strategies, a student example, and a guided practice with timer.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {SCHOOL_SITUATIONS.map(s => (
          <button key={s.key} onClick={() => { setSituation(s.key); setMode('guide'); }} style={{
            padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--border)',
            background: 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left',
            transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = s.bg; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}>
            <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginBottom: '2px' }}>{s.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{s.desc}</div>
            </div>
            <span style={{ fontSize: '16px', color: 'var(--muted)', flexShrink: 0, marginTop: '3px' }}>→</span>
          </button>
        ))}
      </div>
      <div style={{ background: PPALE, border: `1.5px solid ${PBORD}`, borderRadius: '11px', padding: '11px 14px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: PERI, marginBottom: '6px', textTransform: 'uppercase' }}>Or try a focus practice directly:</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.values(FOCUS_TECHNIQUES).map(t => (
            <button key={t.id} onClick={() => startTech(t.id)} style={{ padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${t.color}40`, background: `${t.color}12`, color: t.color, fontWeight: '700', fontSize: '11px', cursor: 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{t.icon}</span><span>{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MentallyPresentSchoolLife({ navigate, relatedPosts }) {
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
      <p>You can spend six hours in school and genuinely experience very little of it. The body sits, the hand writes, the eyes track across pages — and all of it happens while the mind is in tomorrow's exam, in the morning's difficult conversation, in the social comparison that scrolling through the group chat produced, in the worry about a future that has not happened. Physical presence in school and mental presence are not the same thing, and the difference between them determines almost everything about what school actually produces.</p>

      <p>Learning to <strong>stay mentally present</strong> in school is not about forcing concentration through willpower — it is about understanding why the mind leaves and applying the specific techniques that bring it back. This guide covers every school situation where presence slips, why it slips in each one, and exactly what to do about it.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to stay mentally present in school life — focus techniques, managing distractions, and presence practices for class, study, and exams"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-present">1. What It Means to Be Mentally Present at School</h3>

      <p><strong>The difference between physical and mental presence.</strong> Physical presence is the body being in the room. Mental presence is the attention being in the current moment — on the teacher's current sentence, the specific question being answered, the specific person speaking. The two can be completely uncoupled: the body sits in the examination hall while the mind simulates failure scenarios; the body walks to the next class while the mind replays an embarrassing moment from two days ago; the body reads a page of chemistry while the mind plans the weekend. When this uncoupling is chronic, the physical time in school produces significantly less than its potential in learning, connection, and wellbeing.</p>

      <p><strong>What mental presence feels like — the experiential markers.</strong> Mental presence in school has a specific quality that students describe in consistent ways: "things stick better," "the lesson doesn't drag," "I notice what the teacher is actually saying rather than just registering sound," "I leave school feeling like I was actually there rather than watching myself go through the motions." These are not poetic metaphors — they are descriptions of the neurological difference between engaged attention (task-positive network active) and mind-wandering (default mode network dominant). The subjective experience of genuine present-moment engagement is reliably more satisfying than the same duration of physical-only presence, regardless of the content.</p>

      <p><strong>What mental presence is not.</strong> Mental presence is not tense, forced concentration — the white-knuckled "must focus" mode that produces fatigue and anxiety rather than genuine engagement. It is not the elimination of all distracting thoughts (which is neither achievable nor the goal). It is not performing attentiveness to satisfy the teacher. It is the gentle, reliable, practised return of attention to the current moment when it has wandered — not preventing the wandering but shortening the absence. The frequency with which attention wanders does not measure the quality of presence; the speed and ease with which it returns does.</p>

      {/* ── Section 2 ── */}
      <h3 id="pulls-away">2. What Pulls Students Away — School-Specific Distractions</h3>

      <p><strong>Distraction Type 1: Academic anxiety pulling attention to imagined futures.</strong> The most pervasive school-specific distraction is not the phone — it is the anxiety about academic performance that pulls attention forward into simulated failure scenarios. The student sitting an exam is not simply present in the exam; they are simultaneously in the exam and in the imagined result, the imagined parental reaction, the imagined career consequence. This forward time-travel is automatic and produces the cortisol activation that impairs the very performance being imagined as failing. Research by Beilock at Chicago on choking under pressure shows this mechanism precisely: the anxiety-driven simulation consumes the working memory needed for the exam itself.</p>

      <p><strong>Distraction Type 2: The phone — even when not in use.</strong> Research by Ward and colleagues at UT Austin delivers one of the clearest findings in attention science: the mere presence of a smartphone on the desk — silent, face-down, unused — reduces available cognitive capacity by an amount equivalent to two standard deviations on working memory tests. The anticipatory cognitive load of a potential notification, the conditioned checking reflex that smartphones produce, and the intermittent variable reward patterns of social platforms together produce a background cognitive occupation that runs continuously whether or not the phone is actively used. The phone is not neutral when not in use — it is actively reducing the quality of presence in the room it occupies.</p>

      <p><strong>Distraction Type 3: Social comparison and status monitoring.</strong> School environments are high-density social evaluation contexts — grades are shared, achievements are visible, social hierarchies are constantly negotiated. The human brain's threat detection system evolved to monitor social status continuously because social exclusion in ancestral environments was life-threatening. This system activates automatically in high-density social evaluation environments, pulling a significant portion of attentional resources toward social monitoring even when academic content is theoretically the focus. The student aware of this automatic pull can redirect; the student unaware experiences the academic content as less engaging than it might actually be, because their attention is partly elsewhere for evolutionary reasons.</p>

      <p><strong>Distraction Type 4: The passive reception format.</strong> The lecture or teacher-led class format specifically activates the default mode network — the brain's self-referential autopilot. Research by Killingsworth and Gilbert at Harvard documents that the DMN activates whenever directed attention is not actively demanded, generating the self-referential content (planning, worrying, daydreaming, social cognition) that constitutes mind-wandering. Passive listening without an active output requirement — note-taking that is merely transcription, no questions to generate, no predictions to make — is precisely the cognitive condition that releases the DMN's generative activity. This is not a moral failing; it is the default mode doing exactly what it was designed to do in the absence of active cognitive demands.</p>

      <p><strong>Distraction Type 5: Sleep deprivation — the presence reducer.</strong> Research by Walker at UC Berkeley documents that even one night of sleep below seven hours produces measurable impairments in prefrontal attentional function — the exact system responsible for maintaining present-moment focus, returning from mind-wandering, and suppressing the DMN's automatic generation. For students whose chronic sleep debt is significant, the attention difficulties in school are not primarily willpower failures — they are the neurological consequences of insufficient restoration of the attentional system that presence requires. Addressing sleep is the most effective single available presence intervention for chronically sleep-deprived students.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="finder">3. Interactive: The School Presence Finder</h3>
      <p>Choose your school situation — the Finder gives you the specific reason presence slips in that context, four targeted strategies, a student example, and a guided practice with timer. You can also try any focus technique directly using the quick-access buttons.</p>

      <SchoolPresenceFinder />

      {/* ── Section 4 ── */}
      <h3 id="techniques">4. Focus Techniques for School Life</h3>

      <p><strong>Technique 1: The arrival practice — presence before entry.</strong> The quality of attention during a lesson is significantly determined by the quality of the transition into it. The student who arrives rushing from the corridor, checking messages, still in the emotional residue of the previous period, enters with attention already fragmented. A simple arrival practice — three slow breaths before entering, one genuine intention for what to get from this lesson, feet on floor when seated — converts the physiological and attentional state from scattered-in-transit to deliberately-present. After two to three weeks of consistent use, the arrival practice becomes automatic enough to occur even on difficult days.</p>

      <p><strong>Technique 2: Active note-taking as presence maintenance.</strong> Note-taking of the right kind is not just a memory aid — it is a presence technology. The key distinction is between transcription (writing what was said, which can be done automatically without genuine comprehension) and active note-taking (summarising the point in your own words, generating a question about each idea, drawing the concept rather than just writing it). Research by Mueller and Oppenheimer at Princeton on laptop vs. handwritten notes shows that handwritten notes, which require summarisation rather than transcription, produce better conceptual understanding and better retention — not because of the writing medium but because they require present-moment cognitive engagement with the content rather than automatic copying.</p>

      <p><strong>Technique 3: The noting practice during lessons.</strong> The meditation noting technique (labelling off-task thoughts as "planning," "worrying," or "daydreaming" without engaging their content) transfers to classroom use after two to three weeks of daily meditation practice. In class: when attention drifts, note the type of drift in the margin — "P" for planning, "W" for worrying, "D" for daydreaming — and return to the lesson content. The labelling reduces the drift's cognitive pull (Lieberman, UCLA) and the note provides a running record of distraction patterns across the week — which is itself valuable self-knowledge.</p>

      <p><strong>Technique 4: The end-of-lesson recall.</strong> Research by Roediger on the testing effect shows that retrieval practice — attempting to recall content without looking at notes — is the highest-leverage available memory consolidation technique. A simple end-of-lesson application: in the final two minutes of a class, close the notes and write three things you can recall from the lesson. The attempt to retrieve — regardless of success — produces stronger long-term retention than reviewing notes during the same two minutes. This works as a presence technique as well: knowing that an end-of-lesson recall is coming produces slightly higher attentional engagement during the lesson, because the retrieval attempt is anticipated.</p>

      <p><strong>Technique 5: The mindful transition between subjects.</strong> The cognitive switching cost between academic subjects is measurable: research by Meyer and Kieras documents that task switching costs up to 15-25 minutes of impaired cognitive performance as the previous task's representations gradually clear from working memory. The mindful transition — closing all materials for the previous subject, three physiological sighs, opening materials for the new subject to the exact right location, writing the specific task — reduces this switching cost by providing a deliberate cognitive "closing" of the previous frame and a deliberate "opening" of the new one.</p>

      {/* ── Section 5 ── */}
      <h3 id="examples">5. School Situations — With and Without Presence</h3>

      {SCHOOL_SITUATIONS.map(sit => (
        <div key={sit.key} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '16px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${sit.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>{sit.icon}</span>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: sit.color }}>{sit.label}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#FBF5F5', borderRadius: '9px', padding: '10px 12px', border: '1px solid rgba(139,38,53,0.15)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#8B2635', marginBottom: '4px', textTransform: 'uppercase' }}>😶 Without presence:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{sit.challenge.split('. ')[0]}.</p>
            </div>
            <div style={{ background: sit.bg, borderRadius: '9px', padding: '10px 12px', border: `1px solid ${sit.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: sit.color, marginBottom: '4px', textTransform: 'uppercase' }}>🎯 With presence:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{sit.strategies[0].detail.split('.')[0]}.</p>
            </div>
          </div>
          <div style={{ background: PPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${PBORD}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: PERI, marginBottom: '3px' }}>👤 STUDENT EXAMPLE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>{sit.example}</p>
          </div>
        </div>
      ))}

      {/* ── Section 6 ── */}
      <h3 id="habits">6. Daily Presence Habits for Students</h3>

      <p><strong>Habit 1: Morning intention before school — 60 seconds.</strong> Before leaving home each morning: write one sentence about what you want to be present for today. Not "pay attention in all classes" (unachievable abstraction) but "I want to genuinely understand the mechanics problem in today's physics class" or "I want to be actually in the conversation at lunch rather than on the phone." The specific intention primes the attentional networks for relevance-based presence at the named target. Research on implementation intentions shows that a specific "when-then" structure ("when I am in physics today, then I will genuinely attend to the mechanics problem") produces significantly better follow-through than general intentions.</p>

      <p><strong>Habit 2: Phone in the bag at all lesson entry points.</strong> The phone in the pocket is technically inaccessible but cognitively accessible — the checking reflex remains active. The phone in the bag is physically less accessible and produces significantly fewer involuntary checking episodes. Building the automatic habit of bagging the phone at every classroom threshold — not deciding each time, but having it as an automatic arrival behaviour — eliminates one of the primary classroom presence disruptors without requiring per-lesson willpower.</p>

      <p><strong>Habit 3: The mindful transition walk — every day.</strong> At least one walk between school locations per day without the phone — attending to the physical experience of walking. This provides the attentional restoration (Kaplan, attention restoration theory) that makes the next session better quality than the session before it. The phone-free transition walk is the zero-extra-time presence investment with the highest per-minute return.</p>

      <p><strong>Habit 4: End-of-school three things.</strong> At the end of each school day, before picking up the phone: write three things you specifically remember from the day's lessons. The retrieval attempt consolidates the day's learning and provides honest data about presence quality: if three things from six hours of school cannot be recalled, the presence quality needs investigation. Over time, the anticipated end-of-day recall produces slightly higher attentional engagement across the day — the retrieval habit creates a daily feedback loop that presence habits rarely have.</p>

      <p><strong>Habit 5: Daily noting practice — five minutes every morning.</strong> Five minutes of formal noting practice (labelling thought types without engaging their content) every morning, before school, transfers the noting reflex to classroom use across two to three weeks. The formal practice is the investment; the benefit is the automatic availability of the noting reflex during lessons, reducing the duration of each mind-wandering episode and shortening the return time. Students who practise noting consistently describe the subjective classroom experience changing: not fewer distracting thoughts but a different relationship to them — they arrive and pass rather than arriving and taking over.</p>

      {/* ── Section 7: FAQs ── */}
      <h3 id="faq">7. Stay Mentally Present FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I am genuinely interested in the subject but still cannot stay present. Why does this happen?</strong><br />
        A: Interest is necessary but not sufficient for sustained present-moment attention. Even genuinely interesting content produces mind-wandering when the passive reception format releases the DMN, when sleep deprivation has impaired prefrontal regulation, or when anxiety is occupying a significant portion of attentional resources with threat simulation. The techniques that address these specific causes are more relevant for the genuinely interested but persistently distracted student than generic "try to focus" advice. Most specifically: if you are genuinely interested but still drifting, the most likely cause is anxiety (pulling attention to future performance evaluation rather than current content) or sleep deprivation (impairing the prefrontal regulation needed to maintain interest-based attention). Addressing the cause is more effective than increasing effort against it.</p>

        <p><strong>Q: My school has a policy requiring phones to be on the desk. I cannot remove the phone from the desk even though I know it reduces my focus. What can I do?</strong><br />
        A: Physical presence without anticipatory cognitive load requires the phone to be out of field of view and reach. Within the constraint of a desk phone policy, the highest-impact adaptation is placement: the phone face-down at the furthest edge of the desk (maximising the effort required to check it), notifications completely off (eliminating the trigger), and the noting practice actively applied — when the urge to check arrives, note it ("checking urge") and return. The noting practice specifically reduces the checking urge's frequency over two to three weeks, making the desk policy constraint progressively less disruptive as the conditioned checking reflex weakens.</p>

        <p><strong>Q: How do I stay present during subjects I genuinely find boring or irrelevant?</strong><br />
        A: The most honest answer is that genuine interest is the most reliable presence generator and its absence is a real obstacle. The available tools for boring content: the one-question prime (finding the specific most interesting aspect of today's lesson before it begins), the active note-taking mode (converting passive transcription into active questioning, which is more engaging regardless of content), and the contribution challenge (finding at least one specific idea from each class that connects to something genuinely interesting to you — even if tangentially). None of these produces the presence that genuine interest produces. But they produce better presence than passive unengaged attendance, and they produce the retrieval data that makes the content more available during exams than passive attendance provides — which is the pragmatic argument for them even in the absence of intrinsic motivation.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: PERI, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "You are always somewhere — but you can choose whether that somewhere is here. The school years pass. Whether you were genuinely present in them is the part you get to decide."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Finder to find the technique for your specific situation. Practise the feet-on-floor anchor at home today — so it is automatic in tomorrow's classroom. The practice in calm is what creates the presence in the storm.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: PERI, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${PBORD}` }}
          >
            Practise Presence in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: PERI, border: `2px solid ${PERI}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your School Presence Tip
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-exercises-school',   '→ Mindfulness Exercises for School and Study Life'],
            ['/blog/stay-present-stop-overthinking', '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/mindfulness-focus-concentration','→ Why Mindfulness Improves Focus and Concentration'],
            ['/blog/reduce-mental-noise',            '→ How to Reduce Mental Noise and Distractions Naturally'],
            ['/blog/stay-calm-school-stress',        '→ How to Stay Calm in Stressful Situations at School'],
            ['/blog/mental-clarity-mindfulness',     '→ How to Build Mental Clarity Through Mindfulness'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: PERI, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
