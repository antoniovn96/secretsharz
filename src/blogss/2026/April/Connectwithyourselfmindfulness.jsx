import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Connect with Yourself Through Mindfulness",
  excerpt: "Most students are strangers to themselves — not through any failure of character but through the structural conditions of student life: constant external demands, chronic digital stimulation, academic performance pressure, and the absence of genuine quiet in which the inner life can become visible. Connecting with yourself through mindfulness is the practice of turning toward that inner life with curiosity and kindness — learning who you actually are beneath the roles you perform.",
  category: "Mental Health",
  date: "29-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/connect-with-yourself-mindfulness.jpg",
  tldr: "Connecting with yourself is the practice of developing genuine familiarity with your own emotional life, values, needs, and inner experience — not through introspective performance but through consistent, patient, non-judgmental attention. Mindfulness provides the attentional quality that makes this possible; journaling provides the reflective structure; and emotional connection practices build the specific intimacy with one's own inner life that student life typically starves. This guide covers all three.",
  toc: [
    { id: "what-connect", title: "1. What Connecting with Yourself Actually Means",                     level: 3 },
    { id: "disconnect",   title: "2. Why Students Often Feel Disconnected from Themselves",            level: 3 },
    { id: "builder",      title: "3. Interactive: The Self-Connection Practice Builder",               level: 3 },
    { id: "reflection",   title: "4. Self-Reflection Tips That Build Inner Connection",                level: 3 },
    { id: "journaling",   title: "5. Mindfulness Journaling — How to Write Your Way Inward",          level: 3 },
    { id: "emotional",    title: "6. Emotional Connection Practices",                                  level: 3 },
    { id: "faq",          title: "7. Connect with Yourself Through Mindfulness FAQs",                  level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-29T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "connect with yourself, connect with yourself mindfulness, self-connection mindfulness, mindfulness journaling, self-reflection mindfulness, emotional connection mindfulness, inner connection practices students",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I connect with myself through mindfulness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Connecting with yourself through mindfulness happens through three parallel practices. First, create daily quiet time: even five minutes of genuine screen-free quiet — a morning body check-in, a walk without the phone — provides the attentional space in which the inner life becomes visible. Second, mindfulness journaling: writing about your actual emotional experience (not your performance of it), using specific prompts that direct attention inward — 'what did I genuinely feel most strongly today and why?' Third, non-judgmental observation of your own emotional states: practising the noting technique with emotions ('I notice I am feeling shame right now') creates the observing distance that makes genuine self-knowledge possible. The connection develops through consistent, patient practice rather than single intense sessions.",
      },
    },
    {
      "@type": "Question",
      "name": "What is mindfulness journaling and how does it help self-connection?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mindfulness journaling is the combination of present-moment attentional awareness with reflective writing — writing about your actual inner experience rather than your external circumstances, from a position of curious, non-judgmental observation rather than analysis or self-criticism. It differs from ordinary journaling in its emphasis on the felt sense of experience (what do you notice in the body? what is the emotional texture right now?) rather than event narration. Research by Pennebaker at UT Austin documents that expressive writing specifically about emotional experience produces significant wellbeing improvements across two to four weeks — not because writing fixes problems but because it converts vague, unprocessed emotional content into specific, articulable, workable knowledge about the self.",
      },
    },
    {
      "@type": "Question",
      "name": "Why do I feel disconnected from myself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Feeling disconnected from yourself has four common structural causes in student life. Digital overstimulation: continuous media input reduces the quiet in which the inner life can be heard. Academic identity pressure: when self-worth is entirely tied to academic performance, the authentic self (interests, values, genuine reactions) is subordinated to the performing self. Chronic busyness: when every available moment is occupied by tasks or entertainment, there is no space for the reflection that self-knowledge requires. Emotional suppression: when difficult emotions are habitually pushed down to stay functional, the connection to the inner life that emotions provide is severed. All four are reversible through the specific practices in this guide.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const WINE   = '#7A3858';
const WPALE  = '#F8EEF3';
const WBORD  = 'rgba(122,56,88,0.22)';

// ── Connection starting points ─────────────────────────────────────────────────
const CONNECTION_LEVELS = [
  {
    key:   'disconnected',
    icon:  '🌫️',
    label: 'Disconnected — I often don\'t know what I\'m feeling',
    desc:  'Emotions feel vague or absent; I go through the motions without much inner contact',
    color: '#5B3A8B', bg: '#F2EEF9',
    what: 'Emotional disconnection at this level is usually the result of sustained suppression — emotions have been pushed down for so long that access to them has become genuinely difficult rather than just uncomfortable. The inner life is present but quiet. The practices here begin with gentle physical awareness: emotions always have a body component, and body awareness is often more accessible than direct emotional access when verbal emotional experience has become blocked.',
    path: 'Begin with the body — before any emotional labelling or journaling, spend five minutes daily attending to physical sensations (the body scan). The body holds emotions that the cognitive mind has lost access to. Physical awareness opens the door.',
    journal_prompts: [
      'Where in my body do I feel something right now? What is the quality of that sensation?',
      'If my body could speak, what would it say it needs today?',
      'When was the last time I felt genuinely like myself? What was happening?',
      'What am I most often pretending is fine when it is not?',
    ],
    first_step: 'Tonight, before sleeping, spend two minutes with eyes closed and ask: "Where is there tension in my body right now?" No need to name an emotion — just locate the physical sensation. Write one sentence about what you found.',
  },
  {
    key:   'going_through_motions',
    icon:  '🤖',
    label: 'Going through motions — functioning but not really present',
    desc:  'Completing tasks and obligations but feeling like I\'m watching myself from outside',
    color: '#2D5A8A', bg: '#EEF3FB',
    what: 'Depersonalisation or functional disconnection at this level typically reflects the depletion pattern of chronic overload — the self has retreated into automaticity as a protection against the demands that genuine presence makes overwhelming. The inner life exists but has become inaccessible because presence itself feels unsafe or too demanding.',
    path: 'Micro-presence practices — brief but genuine moments of full attentional contact with the present experience. Not extended meditation but 30-second full-presence windows built into existing activities (one full breath, full attention to the taste of a meal, full sensory attention during one walk).',
    journal_prompts: [
      'When today did I feel most real — even briefly?',
      'What am I genuinely enjoying right now — not performing, genuinely enjoying?',
      'What needs are going unmet that might explain the going-through-the-motions feeling?',
      'If I were fully present in my own life, what would I notice that I\'m currently missing?',
    ],
    first_step: 'For the next five days: choose one daily activity (a cup of tea, a shower, a walk) and give it your complete attention for its full duration. Nothing else. Notice what this quality of presence feels like compared to automatic.',
  },
  {
    key:   'exploring',
    icon:  '🔍',
    label: 'Exploring — I want to understand myself better',
    desc:  'Some self-awareness exists but the picture feels incomplete or confusing',
    color: WINE, bg: WPALE,
    what: 'This is the natural starting position for genuine self-connection work — enough awareness to know that there is more to know, enough curiosity to want to find it. The practices here move from surface awareness toward the deeper layers: the patterns, the values beneath the reactions, the needs that the emotions are expressing.',
    path: 'The self-reflection practices and mindfulness journaling are the primary path at this level — they build on the existing awareness by directing it more specifically toward the emotional, values, and needs dimensions that form the deeper layers of self-knowledge.',
    journal_prompts: [
      'What consistently produces my strongest emotional reactions — and what does that tell me about what I value?',
      'What do I pretend to want that I don\'t actually want? What do I actually want that I\'m afraid to admit?',
      'Which version of myself do I show to different people? Which version is most genuinely me?',
      'What specific things make me feel most alive and most flat — and what is the difference between them?',
    ],
    first_step: 'Start the daily emotion log tonight: one sentence — "Today I felt [specific emotion] when [specific situation], which tells me that I value/need [insight]." The third clause (the insight) is where self-connection lives.',
  },
  {
    key:   'deepening',
    icon:  '🌊',
    label: 'Deepening — I have some self-awareness and want to go further',
    desc:  'A reasonably good relationship with myself but wanting more depth and consistency',
    color: '#2D6B45', bg: '#E8F4EE',
    what: 'At this level, the self-connection foundation is established. The deepening practices address the subtler layers: the unconscious patterns that remain invisible because they have been present so long, the gap between values and behaviour, and the relational dimensions of self-connection (how the inner relationship with the self shapes the outer relationship with others).',
    path: 'The weekly emotional autobiography and the values-emotion connector provide the depth practices at this level. Combined with the loving-kindness meditation and the shadow journaling (exploring what has been disowned or avoided), this deepening period produces the most significant and most lasting self-knowledge available.',
    journal_prompts: [
      'What am I most afraid others would discover about me — and how much of that is actually disowning a part of myself?',
      'What patterns keep repeating in my life — relationships, situations, emotional responses — and what might I be contributing to the pattern?',
      'When am I most genuinely myself? What conditions or people allow that version to exist?',
      'What does the inner critic most frequently say? Is that critic\'s voice mine, or did it belong to someone else first?',
    ],
    first_step: 'Once this week: write for ten minutes without stopping about something you have never written about — a feeling you have been avoiding, a part of yourself you find difficult. The avoidance is often where the most important self-knowledge lives.',
  },
];

const CONNECTION_BARRIERS = [
  { key: 'too_busy', icon: '⏰', label: 'Too busy — no time for inner reflection' },
  { key: 'numbing',  icon: '📱', label: 'Numbing — using screens to avoid quietness' },
  { key: 'critic',   icon: '😔', label: 'Inner critic — self-reflection feels like self-attack' },
  { key: 'unsure',   icon: '❓', label: 'Unsure what "connecting with myself" means in practice' },
];

const DAILY_PRACTICE_TIME = [
  { key: '5min',  icon: '⚡', label: '5 minutes', desc: 'Minimum viable — body check-in + one journal sentence' },
  { key: '10min', icon: '🌿', label: '10-15 minutes', desc: 'Effective starting point for meaningful practice' },
  { key: '20min', icon: '🌳', label: '20+ minutes', desc: 'Full practice for significant self-connection development' },
];

const BARRIER_NOTES = {
  too_busy: {
    note: 'Self-connection does not require extra time — it requires repurposing time that already exists. The walk to class (currently on the phone) becomes mindful self-contact. One meal (currently scrolling) becomes genuine sensory presence. The five minutes before sleep (currently screen) becomes a body check-in and one journal sentence. None of these are additions — they are substitutions within the existing day.',
    practice_mod: 'Anchor all self-connection practices to existing habits rather than creating new time slots. The morning phone pickup becomes the morning check-in before the phone. The shower becomes a body-presence practice. The commute becomes a self-reflection walk.',
  },
  numbing: {
    note: 'Digital numbing is the most common barrier to self-connection in the current generation — and it is not weakness. The discomfort of quiet is real; the inner life that becomes audible in quiet can initially feel overwhelming when access has been absent. The approach is gradual reduction of numbing with simultaneous support for what the quiet reveals — journaling and the emotion-naming practices prevent the quiet from being merely uncomfortable.',
    practice_mod: 'Begin with five minutes of screen-free quiet per day — no longer at first. During that five minutes: body scan only, no pressure to feel or understand anything. The quiet becomes more tolerable and then genuinely valuable across two to three weeks of daily practice.',
  },
  critic: {
    note: 'When self-reflection consistently produces self-attack rather than self-knowledge, the self-compassion practice must precede the reflection practice. The inner critic is a learned voice — often originally external (a parent\'s standard, an academic culture\'s judgement) that has been internalised. Self-connection with an active inner critic is not possible because the critic converts every honest self-observation into evidence against the self. The loving-kindness practice specifically addresses this.',
    practice_mod: 'Begin each journaling session with the self-compassion phrase: "I am engaging with my inner life from curiosity, not judgment. What I find here is information, not verdict." This framing prevents the critic from converting the self-reflection into self-attack.',
  },
  unsure: {
    note: 'Connecting with yourself means developing genuine familiarity with your own inner life — not as an abstract concept but as a practical, daily relationship. You know you are connecting with yourself when you can say "I feel [specific emotion] because [specific reason] and I need [specific thing]" with genuine accuracy rather than approximate guessing. The practices build toward this specificity gradually.',
    practice_mod: 'Begin with the most concrete, least abstract practice: the body check-in. Three times per day, ask: "What is happening in my body right now?" The body is the most accessible entry point to the inner life, and body awareness builds the foundation for the more complex emotional and values awareness that follows.',
  },
};

// ── Journal prompts by theme ───────────────────────────────────────────────────
const JOURNAL_THEMES = [
  {
    id:     'emotions',
    icon:   '💛',
    title:  'Emotional Life Prompts',
    color:  WINE,
    bg:     WPALE,
    desc:   'For building emotional self-knowledge and connection',
    prompts: [
      'What emotion have I been carrying most this week — and have I given it any genuine acknowledgment?',
      'What did I feel today that surprised me? What does that surprise reveal?',
      'When was the last time I cried, felt genuine joy, or felt deeply content? What was happening?',
      'What emotion do I find most difficult to acknowledge? What would happen if I let myself feel it fully?',
      'Name one emotion I regularly suppress. What am I protecting myself from by suppressing it?',
    ],
  },
  {
    id:     'values',
    icon:   '🧭',
    title:  'Values and Identity Prompts',
    color:  '#2D5A8A',
    bg:     '#EEF3FB',
    desc:   'For discovering what genuinely matters and who you actually are',
    prompts: [
      'If no one would ever know, what would I do differently today?',
      'What do I do that I genuinely love — not for any outcome, just for the doing?',
      'Whose approval do I seek most actively? Is that approval something I actually want, or is it a habit?',
      'What would I regret not having done or tried if I looked back in ten years?',
      'Which of my beliefs about myself are actually mine — and which did I inherit from others?',
    ],
  },
  {
    id:     'needs',
    icon:   '🌱',
    title:  'Needs and Boundaries Prompts',
    color:  '#2D6B45',
    bg:     '#E8F4EE',
    desc:   'For understanding what you genuinely need and where your limits are',
    prompts: [
      'What am I saying yes to that I genuinely want to say no to?',
      'What do I need more of in my life right now — specific things, not abstract concepts?',
      'When do I feel most drained? When do I feel most restored? What is the pattern?',
      'What need is most consistently going unmet in my current life?',
      'What would self-care actually look like for me — specifically, not generally?',
    ],
  },
  {
    id:     'growth',
    icon:   '✨',
    title:  'Growth and Pattern Prompts',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    desc:   'For seeing the patterns and understanding the growth edges',
    prompts: [
      'What specific thing am I most afraid of discovering about myself?',
      'What pattern keeps repeating in my life — and what might my role in it be?',
      'What am I outgrowing that I have not yet let go of?',
      'Where in my life am I most dishonest — with myself or others?',
      'Who am I becoming? Is that who I want to be?',
    ],
  },
  {
    id:     'present',
    icon:   '🌸',
    title:  'Present-Moment Connection Prompts',
    color:  '#C07800',
    bg:     '#FFF8E1',
    desc:   'For grounding in genuine present-moment self-awareness',
    prompts: [
      'Describe this exact moment in precise sensory detail — what do you see, feel, hear right now?',
      'What does your body need right now that your mind has been ignoring?',
      'What are you genuinely grateful for right now — specific, not generic?',
      'If you allowed yourself to fully arrive in this exact moment, what would you notice?',
      'What is one thing that is genuinely good and genuinely present in your life right now?',
    ],
  },
];

// ── Builder Component ──────────────────────────────────────────────────────────
function SelfConnectionPracticeBuilder() {
  const [step,      setStep]      = useState(1);
  const [level,     setLevel]     = useState(null);
  const [barrier,   setBarrier]   = useState(null);
  const [timeKey,   setTimeKey]   = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openP,     setOpenP]     = useState(null);
  const [activeJTheme, setActiveJTheme] = useState(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selLevel   = CONNECTION_LEVELS.find(l => l.key === level);
  const selBarrier = CONNECTION_BARRIERS.find(b => b.key === barrier);
  const selTime    = DAILY_PRACTICE_TIME.find(t => t.key === timeKey);
  const barrierData = barrier ? BARRIER_NOTES[barrier] : null;

  const handleReset = () => { setStep(1); setLevel(null); setBarrier(null); setTimeKey(null); setRevealed(false); setOpenP(null); setActiveJTheme(null); setJournalEntry(''); setSelectedPrompt(null); };

  const Btn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{ padding: '12px 14px', borderRadius: '11px', border: '2px solid', borderColor: isSel ? WINE : 'var(--border)', background: isSel ? WPALE : 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%', marginBottom: '7px', boxShadow: isSel ? `0 0 0 2px ${WBORD}` : 'none' }}>
      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? WINE : 'var(--ink)', marginBottom: opt.desc ? '1px' : 0 }}>{opt.label}</div>
        {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
      </div>
      {isSel && <span style={{ marginLeft: 'auto', color: WINE, fontWeight: '700', flexShrink: 0 }}>✓</span>}
    </button>
    );
  };

  // Journal section
  if (activeJTheme) {
    const theme = JOURNAL_THEMES.find(t => t.id === activeJTheme);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ background: `${theme.color}15`, borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: theme.color }}>{theme.icon} {theme.title}</span>
          <button onClick={() => { setActiveJTheme(null); setJournalEntry(''); setSelectedPrompt(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
        </div>
        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{theme.desc}</p>

        {!selectedPrompt ? (
          <>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: theme.color, marginBottom: '8px', letterSpacing: '1px' }}>Choose a prompt to write from:</div>
            {theme.prompts.map((p, i) => (
              <button key={i} onClick={() => setSelectedPrompt(p)} style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1.5px solid ${theme.color}25`, background: theme.bg, cursor: 'pointer', fontFamily: font, textAlign: 'left', marginBottom: '7px', fontSize: '13px', color: theme.color, fontWeight: '500', lineHeight: 1.5, transition: 'all 0.15s' }}>
                "{p}"
              </button>
            ))}
          </>
        ) : (
          <>
            <div style={{ background: theme.bg, borderRadius: '10px', padding: '12px 14px', marginBottom: '12px', border: `1.5px solid ${theme.color}30` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: theme.color, marginBottom: '5px', textTransform: 'uppercase' }}>Today's Prompt:</div>
              <p style={{ margin: 0, fontSize: '14px', color: theme.color, fontWeight: '600', fontStyle: 'italic', lineHeight: 1.55 }}>"{selectedPrompt}"</p>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Write freely — no editing, no judgment. This is for you alone.</div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="Write here — as honest, as raw, and as specific as you can manage today..."
              rows={8}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${journalEntry.length > 30 ? theme.color : 'var(--border)'}`, fontFamily: font, fontSize: '14px', lineHeight: 1.75, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: journalEntry.length > 30 ? `${theme.color}04` : 'white', transition: 'all 0.2s' }}
            />
            {journalEntry.length > 50 && (
              <div style={{ background: WPALE, border: `1px solid ${WBORD}`, borderRadius: '9px', padding: '10px 13px', marginTop: '10px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: WINE, fontWeight: '600', lineHeight: 1.55 }}>✓ You are writing. The writing is the connection. This specific honest sentence is worth more than any amount of abstract reflection.</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => { setSelectedPrompt(null); setJournalEntry(''); }} style={{ padding: '9px 16px', borderRadius: '50px', border: `1.5px solid ${theme.color}40`, background: 'transparent', color: theme.color, fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>← Other prompts</button>
              <button onClick={() => { setActiveJTheme(null); setJournalEntry(''); setSelectedPrompt(null); }} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>← Back to plan</button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? WINE : 'var(--border)', transition: 'background 0.3s' }} />)}
      </div>

      {step === 1 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — Where is your self-connection right now?</p>
        <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Be honest rather than aspirational — the plan is only useful if it starts from where you actually are.</p>
        {CONNECTION_LEVELS.map(l => <Btn key={l.key} opt={l} selected={level} onSelect={setLevel} />)}
        <button onClick={() => { if (level) setStep(2); }} disabled={!level} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: level ? `linear-gradient(135deg, ${WINE}, #9A4878)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: level ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: level ? `0 6px 18px ${WBORD}` : 'none' }}>Next →</button>
      </>)}

      {step === 2 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — What is your main barrier to self-connection?</p>
        {CONNECTION_BARRIERS.map(b => <Btn key={b.key} opt={b} selected={barrier} onSelect={setBarrier} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (barrier) setStep(3); }} disabled={!barrier} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: barrier ? `linear-gradient(135deg, ${WINE}, #9A4878)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: barrier ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
        </div>
      </>)}

      {step === 3 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — How much time can you give daily?</p>
        {DAILY_PRACTICE_TIME.map(t => <Btn key={t.key} opt={t} selected={timeKey} onSelect={setTimeKey} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (timeKey) { setStep(4); setRevealed(false); } }} disabled={!timeKey} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: timeKey ? `linear-gradient(135deg, ${WINE}, #9A4878)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: timeKey ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Self-Connection Practice →</button>
        </div>
      </>)}

      {step === 4 && selLevel && barrierData && (<>
        <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Self-Connection Practice</p>
        {!revealed ? (
          <>
            <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${WINE}, #9A4878)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${WBORD}` }}>💛 Reveal My Practice</button>
            <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
          </>
        ) : (
          <div style={{ animation: 'floatUp 0.4s ease' }}>
            <div style={{ background: `linear-gradient(135deg, ${selLevel.color}, ${selLevel.color}BB)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>{selLevel.icon} {selBarrier?.icon}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Self-Connection Path</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>{selLevel.label.split('—')[0].trim()} · {selTime?.label}/day</div>
            </div>

            {/* Level context */}
            <div style={{ background: selLevel.bg, border: `1.5px solid ${selLevel.color}30`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selLevel.color, marginBottom: '4px', letterSpacing: '1.2px' }}>{selLevel.icon} Your Starting Place</div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{selLevel.what}</p>
              <div style={{ background: 'white', borderRadius: '8px', padding: '9px 12px', border: `1px solid ${selLevel.color}20` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: selLevel.color, marginBottom: '3px' }}>🛤️ YOUR PATH:</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{selLevel.path}</p>
              </div>
            </div>

            {/* Barrier note */}
            <div style={{ background: WPALE, border: `1.5px solid ${WBORD}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: WINE, marginBottom: '4px', letterSpacing: '1.2px' }}>{selBarrier?.icon} Addressing Your Barrier</div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{barrierData.note}</p>
              <div style={{ background: 'white', borderRadius: '8px', padding: '8px 11px', border: `1px solid ${WBORD}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: WINE, marginBottom: '3px' }}>💡 PRACTICE MODIFICATION:</div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{barrierData.practice_mod}</p>
              </div>
            </div>

            {/* Journal prompts */}
            <div style={{ background: 'white', border: `1.5px solid ${WBORD}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: WINE, marginBottom: '7px', letterSpacing: '1.2px' }}>📖 YOUR JOURNALING PROMPTS</div>
              {selLevel.journal_prompts.map((p, i) => {
                const isOpen = openP === i;
                return (
                  <div key={i} style={{ borderBottom: i < selLevel.journal_prompts.length - 1 ? '1px solid var(--border)' : 'none', padding: '6px 0' }}>
                    <button onClick={() => setOpenP(isOpen ? null : i)} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: font, textAlign: 'left', fontSize: '13px', color: WINE, fontWeight: '500', fontStyle: 'italic', lineHeight: 1.5, padding: '2px 0' }}>
                      "{p}" {isOpen ? '▲' : '▼'}
                    </button>
                    {isOpen && (
                      <div style={{ marginTop: '6px' }}>
                        <textarea
                          placeholder="Write here — honest, specific, uncensored..."
                          rows={4}
                          style={{ width: '100%', padding: '10px 13px', borderRadius: '8px', border: `1.5px solid ${WBORD}`, fontFamily: font, fontSize: '13px', lineHeight: 1.65, resize: 'none', outline: 'none', boxSizing: 'border-box', background: 'var(--sand)' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* First step */}
            <div style={{ background: `${selLevel.color}12`, border: `2px solid ${selLevel.color}25`, borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selLevel.color, marginBottom: '4px' }}>⚡ YOUR FIRST STEP — DO THIS TODAY</div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '600' }}>{selLevel.first_step}</p>
            </div>

            {/* Journal themes */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: WINE, marginBottom: '8px', letterSpacing: '1.2px' }}>📚 JOURNAL THEME LIBRARY — WRITE NOW</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
                {JOURNAL_THEMES.map(t => (
                  <button key={t.id} onClick={() => setActiveJTheme(t.id)} style={{ padding: '11px 12px', borderRadius: '10px', border: `1.5px solid ${t.color}30`, background: t.bg, cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{t.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: t.color }}>{t.title.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Affirmation */}
            <div style={{ background: WPALE, border: `1.5px dashed ${WBORD}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: WINE, fontStyle: 'italic', lineHeight: 1.55 }}>
                "The relationship with yourself is the only relationship that lasts your entire lifetime. It deserves the same care you give the ones you love most."
              </p>
            </div>

            <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${WBORD}`, color: WINE, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Explore a different path</button>
          </div>
        )}
      </>)}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ConnectWithYourselfMindfulness({ navigate, relatedPosts }) {
  const [activeJournalTheme, setActiveJournalTheme] = useState(null);
  const [journalPrompt, setJournalPrompt] = useState(null);
  const [journalText, setJournalText] = useState('');
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
      <p>There is a paradox at the centre of student life: you spend years learning about the world — its sciences, histories, languages, and arts — while spending almost no structured time learning about yourself. The result is students who can explain photosynthesis and cannot name what they were genuinely feeling last Thursday. Who can analyse a character's motivations in a novel and cannot identify what drives their own avoidance patterns. The gap between knowledge of the world and knowledge of the self is one of the most common and least-discussed sources of student wellbeing difficulty.</p>

      <p>Learning to <strong>connect with yourself through mindfulness</strong> addresses this gap — not through additional academic study but through the specific practices of turning inward with curiosity rather than judgment, attending to the inner life with the same quality of genuine interest that good learning brings to the outer world, and building the relationship with yourself that makes everything else — relationships, decisions, resilience — more stable and more genuine.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to connect with themselves through mindfulness — self-reflection practices, mindfulness journaling, and emotional connection exercises"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-connect">1. What Connecting with Yourself Actually Means</h3>

      <p><strong>The three dimensions of self-connection.</strong> Connecting with yourself is not one thing but a relationship with three distinct and interconnected dimensions. The first is emotional knowing — genuine familiarity with your own emotional life: what you feel, what produces those feelings, what the feelings are trying to communicate about your needs and values. Research by Lisa Feldman Barrett on emotional granularity documents that people who can name their emotional states precisely — distinguishing between thirty distinct emotional states rather than collapsing them into "good" and "bad" — have significantly better wellbeing, better regulation, and better relationships. This precision is built through consistent attention to the inner emotional life.</p>

      <p>The second dimension is values clarity — knowing what genuinely matters to you independent of what others expect, what culture rewards, or what you perform as important. For students whose identities have been shaped primarily by academic performance expectations, values clarity is often underdeveloped: they can say what grade they are targeting but not what kind of person they want to be. Mindfulness supports values clarity by creating the observational distance from automatic behaviour to see what choices are actually being made — and whether those choices reflect genuine values or habitual performance.</p>

      <p>The third dimension is bodily presence — inhabiting the body as a source of information rather than an obstacle to be managed. Research by Antonio Damasio on somatic markers shows that the body generates emotional information that precedes cognitive awareness — physical signals of resonance, dissonance, tension, and ease that constitute the earliest available wisdom about whether a situation, relationship, or choice is genuinely good for you. Students who have learned to override or ignore body signals in the service of productivity lose access to this earliest and most reliable layer of self-knowledge.</p>

      <p><strong>What self-connection feels like — the practical markers.</strong> Students who are developing genuine self-connection describe the experience in consistent ways: "I know what I need — not always what to do about it, but what I need." "I notice my reactions before they take over." "I feel like I know who I am, not just what I am supposed to be." "I can be honest with myself even when what I find is uncomfortable." None of these require certainty, perfection, or complete self-understanding — they require the ongoing practice of turning toward the inner life with genuine, patient, non-judgmental attention.</p>

      {/* ── Section 2 ── */}
      <h3 id="disconnect">2. Why Students Often Feel Disconnected from Themselves</h3>

      <p><strong>Digital overstimulation — no quiet in which the inner life becomes audible.</strong> The inner life requires quiet to become visible. Emotions that have not been named, needs that have not been acknowledged, values that have not been examined — all of these become accessible only in the moments when external stimulation has sufficiently reduced for the inner signal to be heard over the external noise. Research on the psychological effects of continuous digital stimulation documents that the constant availability of external content prevents the natural processing and self-reflection that quiet periods historically provided. The student who moves from school to commute-with-headphones to study with music to evening scrolling to falling asleep to a screen has eliminated every available window in which the inner life could surface — and then wonders why they feel disconnected from themselves.</p>

      <p><strong>Academic identity and the performing self.</strong> When self-worth is significantly tied to academic performance — as it is for many students — a split develops between the performing self (the student who achieves, prepares, and presents competence) and the authentic self (the person who has doubts, genuine interests, complex emotions, and values that may or may not align with the performance). Research by Carol Dweck on identity and achievement shows that students with strongly performance-based identities experience threat responses to any information that challenges academic competence — including honest self-reflection, which might reveal uncertainty or inadequacy. The result is that self-reflection becomes avoidance territory, and the performing self becomes the only self the student has reliable access to.</p>

      <p><strong>The suppression habit — learning not to feel.</strong> Student environments often explicitly or implicitly reward emotional suppression — the student who can function through disappointment without losing academic stride, who can maintain composure through difficulty, who does not let emotions disrupt the production of required work. This capacity for functional suppression is valuable in the short term. In the long term, it produces the disconnection that clinical psychologists recognise as alexithymia: difficulty identifying and describing emotions, with resulting impacts on relationships, decision-making, and wellbeing. Reconnection requires a deliberate reversal of the suppression habit — creating the specific conditions (quiet, privacy, non-judgment) in which the suppressed content can gradually surface and be integrated.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Self-Connection Practice Builder</h3>
      <p>The Builder creates a personalised self-connection path based on your current relationship with yourself, your main barrier to connection, and how much time you can give daily. The result includes your specific starting place and path, a barrier-specific practice modification, four personalised journaling prompts with write-in space, a first step to try today, and access to the full journaling theme library — where you can choose a prompt and write right now.</p>

      <SelfConnectionPracticeBuilder />

      {/* ── Section 4 ── */}
      <h3 id="reflection">4. Self-Reflection Tips That Build Inner Connection</h3>

      <p><strong>Tip 1: The morning check-in — before any external input.</strong> The five minutes before picking up the phone in the morning is the most valuable and most underused self-connection window in the student day. During this window, before any external stimulation has activated the performing self, the authentic self is briefly more accessible. A simple morning check-in: close the eyes, attend to the body from head to feet, ask "How am I actually feeling right now?" and name one specific word. This practice, consistent across weeks, builds the daily habit of self-orientation that continuous external orientation has replaced. Research by Richard Davidson on affective forecasting shows that people who regularly check in with their actual emotional state are significantly more accurate in their emotional self-reports — and more effective at addressing their genuine needs.</p>

      <p><strong>Tip 2: The curiosity stance — self-reflection as discovery, not verdict.</strong> The most common reason self-reflection is painful and avoided is that it has become self-evaluation — finding evidence for or against the self's adequacy rather than discovering what is genuinely there. The curiosity stance — approaching the inner life as a scientist might approach an interesting phenomenon, with genuine interest and suspension of judgment — produces different and more valuable self-knowledge than the evaluative stance. Practically: when anything uncomfortable is discovered through self-reflection, the response is "interesting — what is this telling me?" rather than "this proves I am ___." The curiosity converts what might be self-critical data into genuinely informative self-knowledge.</p>

      <p><strong>Tip 3: The three-question daily practice.</strong> Research on self-reflection by Tasha Eurich at Harvard on self-awareness documents that the most self-reflective people are not those who spend the most time thinking about themselves — they are those who ask better questions. The three questions that produce the most self-knowledge: "What did I feel most strongly today, and what does that tell me about what I genuinely value?" (emotion → values), "What situation today did I handle in a way that felt most like myself — and what made that possible?" (competence and authenticity), and "What do I need tomorrow that I did not give myself today?" (unmet needs). These three, written in a journal for two minutes each evening, produce more genuine self-connection across a month than hours of undirected self-reflection.</p>

      <p><strong>Tip 4: The body as the primary data source.</strong> The body knows things the mind has not yet processed. The sudden tightening of the stomach in certain conversations, the specific quality of tiredness that follows social interactions that were not genuine, the opening and lightening of the chest when a decision is right — these physical signals are the body's emotional data, often available before cognitive awareness has caught up. Building the habit of consulting the body — "what is happening in my body right now, and what might it be responding to?" — provides access to the earliest and often most honest layer of self-knowledge available. The body scan, practised daily, builds this interoceptive awareness specifically: the more precisely you can attend to body sensations, the more information you have access to about your genuine emotional and needs states.</p>

      <p><strong>Tip 5: The non-judgment commitment.</strong> Self-connection cannot develop under conditions of continuous self-judgment — because the judgment converts honest self-observation into evidence against the self, making honesty too threatening to sustain. Research by Kristin Neff on self-compassion documents that self-compassion (treating the self with the same kindness extended to a struggling friend) produces stronger psychological wellbeing, greater emotional resilience, and — crucially — more accurate self-knowledge than self-criticism, because it creates the safety in which honest self-observation can occur. A practical implementation: before any self-reflection session, say or write: "I am looking at myself with curiosity and kindness. What I find is information, not verdict. I am doing this to understand, not to evaluate."</p>

      {/* ── Section 5 ── */}
      <h3 id="journaling">5. Mindfulness Journaling — How to Write Your Way Inward</h3>

      <p><strong>What makes journaling mindfulness journaling.</strong> Ordinary journaling often becomes event narration: "Today I went to school, had a test in Chemistry, and spoke to Priya about the project." Mindfulness journaling is different in its object and quality of attention: the object is the inner experience rather than the external event, and the quality of attention is present-moment, non-judgmental, and curious. Mindfulness journaling asks: "Not what happened — what did I feel, think, and notice inside while it was happening? What did my body do? What specific thought arrived? What did I want to do that I didn't, or what did I do that I regretted?" This specific redirection of attention inward is what produces self-knowledge rather than event documentation.</p>

      <p><strong>The five journaling principles for self-connection.</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Write honestly, not prettily:</strong> The journal is not a performance. The quality of the writing is entirely irrelevant — the quality of the honesty is everything. Incomplete sentences, crossed-out thoughts, and grammatically imperfect confessions are more valuable than polished entries that reflect the performing self rather than the authentic one.</li>
        <li><strong>Write specifically, not generally:</strong> "I felt sad" is less useful than "I felt specifically that hollow sadness that comes when I realise I have been trying to earn something that should not need to be earned." Specificity requires genuine attention and produces genuine self-knowledge; generality is comfortable and produces almost nothing.</li>
        <li><strong>Write toward the uncomfortable:</strong> The areas of greatest journaling resistance are almost always the areas of greatest self-knowledge opportunity. When a topic feels too difficult or too private to write about, that is significant data — the avoidance protects something important. Writing toward it, even partially, produces genuine inner connection in a way that writing only comfortable content cannot.</li>
        <li><strong>Write without editing while writing:</strong> The editing mode produces the performing self's version rather than the authentic self's version. Speed writing — writing without stopping, without re-reading until the entry is complete — bypasses the editorial censorship and allows more honest content to surface.</li>
        <li><strong>Review periodically:</strong> Reading previous entries across weeks reveals the patterns that any single entry cannot provide: the recurring emotions, the consistent themes, the needs that keep appearing in different forms. The accumulated journal is a portrait of the inner life across time — more honest and more revealing than any single session's content.</li>
      </ul>

      {/* Journal themes */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: WINE, marginBottom: '12px', fontFamily: font, textTransform: 'uppercase', letterSpacing: '1px' }}>📚 Five Journal Theme Libraries — Choose and Write Now:</div>
        {!activeJournalTheme ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontFamily: font }}>
            {JOURNAL_THEMES.map(t => (
              <button key={t.id} onClick={() => { setActiveJournalTheme(t.id); setJournalPrompt(null); setJournalText(''); }} style={{ padding: '16px 14px', borderRadius: '12px', border: `2px solid ${t.color}30`, background: t.bg, cursor: 'pointer', fontFamily: font, textAlign: 'center', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '22px', marginBottom: '5px' }}>{t.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: t.color, marginBottom: '3px' }}>{t.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: font }}>
            {(() => {
              const theme = JOURNAL_THEMES.find(t => t.id === activeJournalTheme);
              return (
                <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: `2px solid ${theme.color}25` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: theme.color }}>{theme.icon} {theme.title}</div>
                    <button onClick={() => { setActiveJournalTheme(null); setJournalPrompt(null); setJournalText(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>×</button>
                  </div>
                  {!journalPrompt ? (
                    <>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--muted)' }}>Choose a prompt:</p>
                      {theme.prompts.map((p, i) => (
                        <button key={i} onClick={() => setJournalPrompt(p)} style={{ width: '100%', padding: '11px 13px', borderRadius: '9px', border: `1.5px solid ${theme.color}25`, background: theme.bg, cursor: 'pointer', fontFamily: font, textAlign: 'left', marginBottom: '7px', fontSize: '13px', color: theme.color, fontStyle: 'italic', lineHeight: 1.5 }}>
                          "{p}"
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <div style={{ background: theme.bg, borderRadius: '9px', padding: '11px 13px', marginBottom: '10px', border: `1.5px solid ${theme.color}30` }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: theme.color, marginBottom: '4px', textTransform: 'uppercase' }}>Today's Prompt:</div>
                        <p style={{ margin: 0, fontSize: '14px', color: theme.color, fontWeight: '600', fontStyle: 'italic', lineHeight: 1.55 }}>"{journalPrompt}"</p>
                      </div>
                      <textarea value={journalText} onChange={e => setJournalText(e.target.value)}
                        placeholder="Write here — as honest, as raw, and as specific as you can manage today. This is for you alone."
                        rows={7}
                        style={{ width: '100%', padding: '13px', borderRadius: '9px', border: `2px solid ${journalText.length > 30 ? theme.color : 'var(--border)'}`, fontFamily: font, fontSize: '14px', lineHeight: 1.75, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: journalText.length > 30 ? `${theme.color}04` : 'white', transition: 'all 0.2s' }}
                      />
                      {journalText.length > 60 && (
                        <div style={{ marginTop: '8px', background: WPALE, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${WBORD}` }}>
                          <p style={{ margin: 0, fontSize: '13px', color: WINE, fontWeight: '600' }}>✓ You are connecting. This specific honest writing is the practice — nothing else is needed.</p>
                        </div>
                      )}
                      <button onClick={() => { setJournalPrompt(null); setJournalText(''); }} style={{ marginTop: '10px', padding: '8px 14px', borderRadius: '50px', border: `1.5px solid ${theme.color}40`, background: 'transparent', color: theme.color, fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>← Other prompts</button>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── Section 6 ── */}
      <h3 id="emotional">6. Emotional Connection Practices</h3>

      <p><strong>Practice 1: The daily emotion naming ritual.</strong> Once per day — morning or evening, consistently the same time — close the eyes, take one breath, and name the specific emotion most present right now. Not the situation ("I am stressed about exams") but the emotion ("I feel specifically anxious, which beneath the anxiety feels like I am scared of being inadequate"). The precision requirement is the practice: forcing the language from vague to specific builds the emotional vocabulary and emotional attentional access that self-connection requires. Research by Barrett on emotional granularity documents that people who practise emotional precision consistently develop not just better vocabulary but genuinely different neural processing of emotional experience — more nuanced, more regulated, and more informative.</p>

      <p><strong>Practice 2: The emotion-body connection scan.</strong> Before naming an emotion verbally, scan the body for its physical correlate: "Where in my body is this emotion held? What is the quality of the sensation? Is it heavy or light, sharp or diffuse, moving or still?" Research by Damasio on somatic markers shows that attending to the physical dimension of emotion — rather than moving directly to verbal labelling — accesses a different and often more accurate layer of emotional information. The physical scan before the verbal label produces more precise and more honest emotional names because it grounds the naming in genuine felt experience rather than cognitive categorisation.</p>

      <p><strong>Practice 3: Loving-kindness toward the difficult parts.</strong> Most students have aspects of themselves they find difficult to accept — the anxiety, the self-doubt, the specific character traits they judge as inadequate. Self-connection requires including these aspects rather than excluding them — because the excluded parts of the self do not disappear, they drive behaviour from below awareness. The loving-kindness practice specifically applied to difficult self-aspects: "May this part of me — the part that worries about not being enough — be met with kindness rather than criticism. It is trying to protect me, even when its methods are not working." Research by Gilbert on self-compassion shows this specific application produces measurable improvements in psychological wellbeing and self-acceptance.</p>

      <p><strong>Practice 4: The values-emotion connector.</strong> When any emotion is particularly strong — whether positive or negative — ask: "What does the intensity of this emotion reveal about what I genuinely value?" Strong emotions are reliable pointers to core values: the intense disappointment at a certain result reveals how much that area matters; the specific joy at a particular activity reveals what genuinely brings you alive; the specific anger at a certain type of situation reveals what fairness, respect, or care looks like to you. Recording these connectors in the journal across weeks reveals the values map that would otherwise remain invisible — the authentic map of what actually matters, as opposed to the performed map of what should matter.</p>

      <p><strong>Practice 5: The permission practice.</strong> Many students have learned to not need things — to not need rest when rest is needed, to not need acknowledgment when acknowledgment would help, to not need space when space would restore them. The permission practice is the direct reversal: once per day, ask "What do I need right now that I have been telling myself I should not need?" and give yourself permission — not always the thing itself (which may not be available) but the acknowledgment that the need is real and legitimate. The permission itself, even without the thing, reduces the self-denial layer that compounds genuine unmet needs into distress about needing.</p>

      {/* ── Section 7: FAQs ── */}
      <h3 id="faq">7. Connect with Yourself Through Mindfulness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I find self-reflection painful — every time I try to look inward I end up feeling worse. Is there something wrong with me?</strong><br />
        A: No — and this experience is both common and informative. When self-reflection consistently produces distress, it is usually because it has become self-evaluation rather than self-discovery, or because it is accessing genuine emotional content that has been suppressed long enough to have built significant pressure. Two approaches help. First, the framing shift: "I am looking at myself with curiosity and kindness" rather than "I am evaluating whether I am acceptable." The framing genuinely changes the experience because it changes the relationship between the observer and the observed. Second, the gradual approach: begin with the body (least threatening), then move to present-moment observations (current sensations and perceptions), then to emotions (what is present right now), before attempting the deeper historical or pattern-based reflection that most quickly produces distress. If the practice continues to produce significant distress after these adjustments, speaking with a counsellor or therapist who can support the self-exploration process in a safe relational context is the appropriate next step — not evidence of failure.</p>

        <p><strong>Q: I try journaling but always feel like I am performing for an imagined audience. How do I make it genuine?</strong><br />
        A: The performed quality of journaling is the performing self protecting itself — the same mechanism that makes authentic self-expression difficult in any observed context. Three adjustments that genuinely help. First, use different language: write in the specific voice you use only when completely alone — fragments, expletives if natural, incomplete thoughts. The departure from the "proper" voice is itself a signal that the performing self's standards are being suspended. Second, write faster: speed writing bypasses the editorial censorship. Set a timer for three minutes and do not stop writing until it sounds. Third, try writing in a different medium occasionally: voice recording (speaking to yourself alone), drawing, or physical movement as expression. The performance anxiety is specific to the imagined reader; different media access different aspects of the authentic self.</p>

        <p><strong>Q: Is it possible to become too self-focused through these practices — to become excessively inward or self-absorbed?</strong><br />
        A: This is a legitimate and important question, and the distinction matters. Healthy self-connection produces outward benefit: people who know themselves well make better decisions, form more genuine relationships, contribute more authentically, and need less from others to feel secure. Unhealthy self-absorption produces inward spiralling: ruminative self-focus that generates more distress, reduces engagement with the world, and increases dependence on the self-focus as a coping mechanism. The distinguishing characteristic is the direction of the practice's effect. Mindfulness-based self-connection — with its emphasis on non-judgmental observation, openness, and the connection between inner knowledge and outward action — produces the first kind. The test after any self-reflection practice: do I feel more open to the world and more available to others, or less? If more — this is healthy self-connection. If consistently less — the practice may be becoming ruminative and worth examining with someone who can help calibrate it.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: WINE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "You have been living with yourself for every moment of your life. The practice of connecting with yourself is simply beginning to pay genuine attention to what has been there all along."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Practice Builder to find your starting path. Choose one journal theme and write for five minutes today — honest, specific, uncensored. That five minutes, repeated daily, is the beginning of the most important relationship you will ever build.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: WINE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${WBORD}` }}
          >
            Continue Your Journey in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: WINE, border: `2px solid ${WINE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access Our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/emotional-awareness-daily',       '→ How to Become More Emotionally Aware Every Day'],
            ['/blog/build-self-awareness',            '→ How to Build Self-Awareness in Daily Life'],
            ['/blog/mindfulness-emotional-balance',   '→ Mindfulness and Emotional Balance Explained Simply'],
            ['/blog/develop-inner-peace',             '→ How to Develop Inner Peace in a Busy Life'],
            ['/blog/mindful-gratitude-practice',      '→ How to Practice Gratitude Mindfully Every Day'],
            ['/blog/observe-thoughts-mindfully',      '→ How to Observe Your Thoughts Without Judging Them'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: WINE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
