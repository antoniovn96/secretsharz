import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Become More Emotionally Aware Every Day",
  excerpt: "Emotional awareness — the capacity to notice, name, and understand your own emotional states accurately — is not a personality trait some people have and others do not. It is a trainable skill, built through consistent self-reflection and mindfulness, that produces measurable improvements in decision-making, relationships, stress resilience, and academic wellbeing. This guide shows you how to build it into every day.",
  category: "Mental Health",
  date: "20-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/emotional-awareness-daily.jpg",
  tldr: "Emotional awareness develops through three parallel practices: emotional literacy (building a precise vocabulary for internal states), self-reflection (dedicated daily windows for honest emotional inquiry), and mindfulness (the present-moment observation that catches emotions before they have escalated). This guide covers the science, six self-reflection practices, the mindfulness-emotional awareness connection, relatable student situations, and an interactive Daily Practice Builder.",
  toc: [
    { id: "what-is",     title: "1. What Emotional Awareness Actually Is — and Why It Matters",       level: 3 },
    { id: "science",     title: "2. The Science — What Emotional Awareness Builds in the Brain",      level: 3 },
    { id: "builder",     title: "3. Interactive: The Emotional Awareness Daily Practice Builder",     level: 3 },
    { id: "reflection",  title: "4. Six Self-Reflection Practices That Build Emotional Awareness",    level: 3 },
    { id: "mindfulness", title: "5. The Mindfulness Connection — Awareness in Real Time",             level: 3 },
    { id: "situations",  title: "6. Relatable Situations — What Emotional Awareness Changes",         level: 3 },
    { id: "faq",         title: "7. Emotional Awareness FAQs",                                        level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-20T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "emotional awareness, how to become emotionally aware, emotional awareness daily practice, self-reflection emotional awareness, mindfulness emotional awareness, emotional intelligence students, emotional awareness exercises",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I become more emotionally aware?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Becoming more emotionally aware requires three consistent practices. First, build emotional vocabulary: challenge yourself to name emotions more specifically than 'good' or 'bad.' Research by Lisa Feldman Barrett shows that emotional granularity — the precision of emotional labelling — directly predicts regulation capacity and wellbeing. Second, create daily self-reflection windows: a brief evening journal with three specific questions (what did I feel most strongly today? what triggered it? what did this tell me about what I need?) builds the reflective habit that awareness requires. Third, practise mindful emotional observation: instead of being inside each emotion, practise noticing it from a slight distance — 'I notice I am feeling anxious' rather than 'I am anxious.' This decentred stance is the core of mindful emotional awareness.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between emotional awareness and emotional intelligence?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Emotional awareness is the foundational component of emotional intelligence — it is specifically the capacity to notice and accurately identify emotional states in oneself and others. Emotional intelligence (EQ), as defined by Goleman and Mayer-Salovey-Caruso, is a broader construct that includes emotional awareness plus emotional regulation (managing what is felt), social awareness (recognising emotions in others), and relationship management (using emotional understanding to navigate interactions effectively). Emotional awareness is the prerequisite for all other EQ dimensions: you cannot regulate an emotion you have not noticed, cannot understand others' emotions you have not identified, and cannot navigate relationships with emotional skill from a position of emotional blindness.",
      },
    },
    {
      "@type": "Question",
      "name": "Why do students struggle with emotional awareness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Students struggle with emotional awareness for three structurally predictable reasons. First, academic culture implicitly deprioritises emotional experience in favour of cognitive performance — the emotion that arrives with a disappointing result is treated as an obstacle to the next preparation session rather than information worth attending to. Second, chronic digital stimulation reduces the quiet reflection time in which emotional states become visible — emotions that are not noticed and named remain vague, unprocessed, and more likely to drive automatic behaviour. Third, limited emotional vocabulary — the average person uses approximately six emotion words in daily life (happy, sad, angry, scared, surprised, disgusted) — makes precise self-labelling impossible and accurate awareness inaccessible. All three are addressable through deliberate practice.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const MAUVE   = '#A05070';
const MPALE11 = '#F9EFF3';
const MBORD11 = 'rgba(160,80,112,0.22)';

// ── Emotional awareness levels ─────────────────────────────────────────────────
const AWARENESS_LEVELS = [
  {
    key:    'beginning',
    icon:   '🌱',
    label:  'Beginning — I rarely notice my emotions until they are overwhelming',
    desc:   'Emotions arrive in waves that seem to come from nowhere; I often react before I know what I am feeling',
    color:  '#2D6B45',
    bg:     '#E8F4EE',
    what:   'At this starting point, emotions are most often noticed when they have already become intense — the anxiety spike, the anger outburst, the sudden crash of motivation. The first goal is building the awareness habit: creating the daily self-reflection windows and the emotional vocabulary that make earlier detection possible. The practices at this level focus on the basics: noticing, naming, and not immediately reacting.',
    core_practice: 'Daily emotion naming: once per day, at a consistent time (evening works best), write one sentence: "Today I felt [specific emotion] when [specific situation]." Nothing more. This single-sentence practice, maintained consistently for two weeks, produces the first measurable improvements in emotional awareness.',
    first_step: 'Download or create a simple emotion wheel — a visual list of emotions from basic to specific. Keep it visible. Once per day, look at the list and identify the most accurate label for how you currently feel.',
    week_plan: [
      { day: 'Days 1-3', task: 'Once each evening: one sentence. "Today I felt ___ when ___." Use the emotion wheel. Specificity matters more than accuracy.' },
      { day: 'Days 4-5', task: 'Add: the morning check-in. Before any screen: "How am I actually feeling right now?" One word or phrase, said quietly or written.' },
      { day: 'Days 6-7', task: 'Add: the body signal notice. Once during the day, check in with the body: jaw, shoulders, chest, stomach. Note what you find without needing to change it.' },
    ],
  },
  {
    key:    'developing',
    icon:   '🌿',
    label:  'Developing — I notice emotions but struggle to name them precisely',
    desc:   'I can tell something is happening emotionally but often cannot find the right word or understand what it means',
    color:  '#2D5A8A',
    bg:     '#EEF3FB',
    what:   'At this level, the basic noticing capacity is present — emotions are being registered — but the labelling precision is limited. The common experience is knowing you feel "off" or "not good" without being able to be more specific. The practices at this level develop emotional granularity: the precision of emotional labelling that research by Lisa Feldman Barrett identifies as the direct predictor of regulation capacity.',
    core_practice: 'The precision challenge: whenever you notice an emotion, challenge yourself to name it more specifically than the generic label. "Stressed" becomes "anxious about a specific uncertain outcome." "Upset" becomes "embarrassed about what happened in that conversation." "Fine" becomes "mildly restless and slightly disconnected." The vocabulary expands through daily use.',
    first_step: 'Identify your five most common emotional experiences in the last week. For each one, find three more specific words that might be more accurate. The search is the practice.',
    week_plan: [
      { day: 'Days 1-3', task: 'The precision challenge: every emotion noticed today, challenge to name more specifically. No judgment if the word is not perfect — the search is the training.' },
      { day: 'Days 4-5', task: 'Add: the secondary emotion question. When you notice a strong emotion, ask: "What might be underneath this?" Anger → hurt or fear. Dismissiveness → disappointment. The deeper layer is always more informative.' },
      { day: 'Days 6-7', task: 'Add: the situation-emotion link. In the evening journal, write one situation from today and the specific emotional arc it produced: "When X happened, I initially felt [emotion], then [emotion], and by the end [emotion]." The arc reveals the process.' },
    ],
  },
  {
    key:    'building',
    icon:   '🌳',
    label:  'Building — I notice and name emotions but struggle to understand them',
    desc:   'I can identify what I am feeling but often do not know why, or what the emotion needs from me',
    color:  MAUVE,
    bg:     MPALE11,
    what:   'At this level, the first two skills (noticing and naming) are established. The next layer is interpretation: understanding what each emotional state is telling you, what need it reflects, and what response it genuinely requires versus what it automatically produces. This is where emotional awareness begins to directly improve decision-making and relationships.',
    core_practice: 'The emotional inquiry practice: when a significant emotion is present, sit with three questions in order. "What am I feeling?" (naming). "What triggered this specifically?" (situational understanding). "What does this emotion need?" (need identification). The third question is the most transformative — emotions always contain information about unmet needs, and naming the need converts the emotion from an overwhelming experience into actionable information.',
    first_step: 'For the next three significant emotional moments: pause before reacting and ask "what do I need right now?" Write the answer. Even one word: space, reassurance, action, rest. The need recognition is the beginning of meeting it.',
    week_plan: [
      { day: 'Days 1-3', task: 'The three-question inquiry for one significant emotion per day: what am I feeling? What specifically triggered it? What does this emotion need from me?' },
      { day: 'Days 4-5', task: 'Add: the pattern recognition practice. Review the previous week\'s emotional journal. What situations consistently produce the same emotions? What does the pattern tell you about your specific sensitivities and needs?' },
      { day: 'Days 6-7', task: 'Add: the values connection. When an emotion is particularly strong, ask: "What value is being honoured or violated here?" Strong emotions almost always connect to core values — the emotion is the value speaking.' },
    ],
  },
  {
    key:    'refining',
    icon:   '✨',
    label:  'Refining — I am fairly emotionally aware but want to deepen the practice',
    desc:   'I have some self-awareness but patterns are still not fully visible, or I want more consistency',
    color:  '#C07800',
    bg:     '#FFF8E1',
    what:   'At this level, the foundational awareness is present — emotions are noticed, named, and partially understood. The refinement layer addresses the subtleties: the emotions that are partially masked (the secondary emotions protecting the primary ones), the chronic background states that are so familiar they have become invisible, and the relational dimensions of emotional awareness (how accurately you read your impact on others).',
    core_practice: 'The emotional autobiography: once per week, write a brief account of the week\'s emotional life — not the events, the emotional texture. What was the dominant mood? When was the most genuine joy? When was the most significant difficulty? What surprised you about your own reactions? This weekly narrative builds the meta-level awareness of emotional patterns across time that daily practices cannot produce.',
    first_step: 'Identify one emotion you almost never allow yourself to feel or express — one that you consistently manage, deflect, or minimise. Write honestly about why this particular emotion is most difficult to acknowledge. The answer is usually the most important self-knowledge available.',
    week_plan: [
      { day: 'Days 1-3', task: 'The hidden emotion practice: once daily, ask "Is there an emotion I have been avoiding or minimising today?" The avoidance pattern reveals more than the emotion itself.' },
      { day: 'Days 4-5', task: 'Add: the external reflection. Ask one trusted person: "Have you noticed a consistent emotional pattern in me that I might not see in myself?" Receive the answer without defending against it.' },
      { day: 'Days 6-7', task: 'Add: the weekly emotional autobiography. Five minutes of honest writing: what was the emotional character of this week? What surprised you? What do you want to notice more carefully next week?' },
    ],
  },
];

const RELATABLE_SITUATIONS = [
  {
    key:    'exam_result',
    icon:   '📊',
    label:  'Receiving an unexpected exam result',
    desc:   'The paper is handed back and the score is not what you expected — better or worse',
    color:  '#8B2635',
    bg:     '#FBF0F1',
    typical_response: 'Most students react automatically: immediate comparison to others, rapid self-assessment ("I am good/bad at this"), and either celebration or self-criticism — all within seconds of seeing the number. The emotional content is rarely examined.',
    with_awareness: 'With emotional awareness, the first step is pause: "I notice I am feeling [specific emotion]. Let me identify this before I react." The specific emotion matters: disappointment in your own preparation approach is different from shame about your fundamental capability, which is different from anxiety about consequences, which is different from relief that it is over. Each requires a different response.',
    awareness_shifts: [
      'The automatic "I am stupid" becomes "I feel disappointed in how I prepared for this specific section"',
      'The immediate comparison to peers is noticed as comparison before it has produced the spiral',
      'The shame response — wanting to hide the result — is identified as shame rather than being acted on automatically',
      'The genuine need (to understand what the result means and what to do next) is accessed rather than the reactive behaviour (withdrawal or self-criticism)',
    ],
    practice: 'For the next assessment result: before sharing it with anyone or comparing with peers, give yourself five private minutes. Write: "I feel [emotion] about this result because [why]. What this emotion is telling me I need is [need]." Then decide your response from this more aware position.',
    student_voice: '"When I failed a unit test last semester, I went straight into shutdown — stopped going to class, stopped studying. I didn\'t even know I was feeling ashamed until my counsellor helped me name it. Once I could call it shame — not stupidity, shame — I could actually do something about it. The emotion had been running my behaviour completely without me knowing what it was." — Aryan',
  },
  {
    key:    'family_pressure',
    icon:   '🏠',
    label:  'Parent pressure about academic performance',
    desc:   'A conversation about results, future plans, or academic direction that produces a strong emotional response',
    color:  '#2D6B45',
    bg:     '#E8F4EE',
    typical_response: 'Withdrawal, shutdown, defensive reactions, or saying what the parent wants to hear — all of which preserve the interaction\'s surface but leave the actual emotional experience unexpressed, unexamined, and unresolved.',
    with_awareness: 'Emotional awareness in this situation produces three shifts: identifying what is actually being felt (often a complex mixture of love, pressure, fear, and the specific pain of feeling misunderstood by someone who matters), recognising the automatic patterns being activated (the learned responses from years of similar conversations), and separating the genuine needs present (to be seen, to have the effort acknowledged, to maintain relationship) from the automatic reactions that usually attend them.',
    awareness_shifts: [
      'The defensive "you don\'t understand me" becomes "I feel unseen in this conversation and that is genuinely painful"',
      'The shutdown is recognised as a protection mechanism — and the thing being protected (the fear of not being enough) is identified',
      'The people-pleasing agreement is noticed as a performance rather than a genuine response',
      'The genuine need — for acknowledgment of effort rather than demands for better outcomes — becomes nameable and potentially expressible',
    ],
    practice: 'Before the next difficult family conversation: take three breaths and ask "What am I actually feeling going into this, and what do I genuinely need from it?" Write both. The answers, even if not spoken, change how you show up.',
    student_voice: '"I used to cry every time my parents asked about marks — and I didn\'t know why exactly, it was just overwhelming. When I started tracking my emotions in a journal, I realised the crying was grief: I was grieving the version of myself I felt like I was supposed to be and couldn\'t be. That wasn\'t something I could have known without the practice." — Priya',
  },
  {
    key:    'social_conflict',
    icon:   '👥',
    label:  'A falling-out with a close friend',
    desc:   'A conflict, misunderstanding, or period of social distance with someone who matters',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    typical_response: 'Either emotional flooding (intense hurt, anger, and the impulse to end the friendship) or emotional suppression (pretending it is fine, returning to normal without processing what happened, allowing the unresolved content to reactivate in the next conflict).',
    with_awareness: 'Emotional awareness in social conflict produces the capacity to separate the situation (what actually happened) from the emotional amplification (what the mind is adding to it), to identify the specific hurt rather than the global "I am upset," and to notice whether the intensity of the current reaction is being amplified by older, similar hurts from other relationships.',
    awareness_shifts: [
      'The global "they don\'t care about me" becomes "I feel hurt by this specific thing that happened because it matters to me that I feel prioritised by people I value"',
      'The impulse to immediately confront or immediately distance is recognised as an impulse rather than automatically acted on',
      'The amplification of current hurt by older patterns is noticed: "This reminds me of how I felt when [earlier situation]" — which separates the present from the past',
      'The genuine need (to feel that the friendship matters to both parties) becomes speakable rather than only expressible through conflict behaviour',
    ],
    practice: 'For any current social difficulty: write three columns. "What factually happened." "What I am adding to it." "What I genuinely need from this relationship." The three-column exercise separates fact from interpretation and identifies need from reaction.',
    student_voice: '"My best friend became distant during exam season and I took it as rejection — I was hurt and angry for two weeks before I journalled about it. When I wrote it out, I could see that what I was actually feeling was scared: scared that the friendship wasn\'t as solid as I thought. That was very different from rejection. And when I approached her from that more honest place, the conversation was completely different." — Meera',
  },
  {
    key:    'comparison',
    icon:   '📱',
    label:  'Social media comparison spiral',
    desc:   'Scrolling and feeling increasingly inadequate compared to peers\' achievements, experiences, or presentations',
    color:  '#1A7272',
    bg:     '#EBF5F5',
    typical_response: 'Continued scrolling (the comparison activates the urge to seek more data), or abrupt closure of the app followed by a vague sense of inadequacy that persists without being examined. The emotion is experienced but not understood.',
    with_awareness: 'Emotional awareness in the comparison spiral produces the capacity to catch the spiral early (before it has built momentum), identify the specific emotion being generated (envy? inadequacy? FOMO? something more specific?), and recognise the specific narrative being constructed about what the comparison means.',
    awareness_shifts: [
      'The vague "I feel bad after social media" becomes "I feel envious of [specific person\'s specific achievement] which makes me feel inadequate about [specific aspect of my own life]"',
      'The automatic continued scrolling is noticed as an impulse rather than a necessity',
      'The narrative "everyone is doing better than me" is identified as a story constructed from incomplete and curated information',
      'The specific underlying need — for evidence of one\'s own competence and progress — is identified and can be addressed through more reliable evidence than social media comparison',
    ],
    practice: 'For one week: every time you close a social media app feeling worse than when you opened it, write one sentence: "I was comparing myself to [who/what] and it made me feel [specific emotion] because I believe [the specific belief the comparison activated]." The belief exposed is the most important data.',
    student_voice: '"I started writing the belief every time comparison got to me: \'I believe that if people are achieving more than me I am fundamentally less worthy.\' Seeing that belief written out — specifically — was the beginning of being able to question it. Before the awareness practice, I was living inside the belief without even knowing it was there." — Vikram',
  },
  {
    key:    'unmotivated',
    icon:   '😔',
    label:  'Unexplained low mood or loss of motivation',
    desc:   'Feeling flat, unmotivated, or empty — without a clear identifiable cause',
    color:  '#C07800',
    bg:     '#FFF8E1',
    typical_response: 'Either pushing through the flatness (studying despite the depleted state without acknowledging it, which reduces session quality without addressing the cause) or surrendering to it completely (doing nothing for extended periods, which amplifies the low mood through inaction and lack of restoration).',
    with_awareness: 'Emotional awareness in low mood or motivational depletion produces the capacity to investigate rather than simply endure or avoid. The "flat" or "empty" experience almost always contains more specific emotional content when examined — grief about something lost, accumulated exhaustion from sustained pressure without adequate recovery, specific anxiety about the future that has been suppressed, or genuine needs (for rest, connection, creative expression) that have gone unmet long enough to produce motivational collapse.',
    awareness_shifts: [
      'The generic "I just feel low" becomes "I feel exhausted and specifically sad about [something that matters]"',
      'The pushing-through response is recognised as avoidance of the emotional content rather than resilience',
      'The inaction period is identified as self-protective rather than lazy — and can be used for genuine restorative activity rather than passive consumption',
      'The specific unmet need that the low mood is expressing (rest, acknowledgment, joy, connection) is identified and becomes addressable',
    ],
    practice: 'When low mood or low motivation arrives: instead of immediately trying to fix it or push through it, give it five minutes of honest inquiry. "What specifically am I feeling? When did this begin? What happened in the days before it began? What am I actually needing that I have not given myself recently?" The inquiry is not the same as wallowing — it is diagnostic.',
    student_voice: '"I had a period in February where I couldn\'t study, couldn\'t enjoy anything, couldn\'t connect with anyone — I called it laziness for three weeks before I journalled about it. What came out was grief — real grief about not getting into the programme I had wanted since Class 9. I had never let myself feel that grief. It had been driving the flatness from underneath the whole time." — Ishaan',
  },
];

const REFLECTION_GOAL = [
  { key: 'daily_habit',   icon: '📅', label: 'I want a consistent daily habit — simple and sustainable' },
  { key: 'deeper_understanding', icon: '🔍', label: 'I want to understand my emotional patterns more deeply' },
  { key: 'regulate_better',     icon: '🌿', label: 'I want to regulate my emotions more effectively' },
  { key: 'relationships',        icon: '👥', label: 'I want to improve my emotional impact on relationships' },
];

const REFLECTION_PRACTICES_BY_GOAL = {
  daily_habit: {
    title: 'The Daily Awareness Anchor',
    practices: [
      { icon: '🌅', name: 'Morning emotion check-in (60 seconds)', desc: 'Before any screen: close your eyes, take one breath, and ask "How am I actually feeling right now?" Name one specific word. This one-word morning reading, done daily, builds the habit of self-checking that all further emotional awareness depends on.' },
      { icon: '📝', name: 'Evening one-sentence journal (2 minutes)', desc: '"Today I felt [specific emotion] when [specific situation]." One sentence, every evening, in the same notebook. The consistency is the practice — the accumulation of sentences across weeks becomes the data that reveals patterns.' },
      { icon: '😮‍💨', name: 'The breath-and-notice pause (30 seconds, as needed)', desc: 'At any moment of strong emotional activation during the day: one physiological sigh, then one question — "What specifically is happening emotionally right now?" The 30-second pause converts automatic reaction into observed experience.' },
    ],
    note: 'The daily habit version prioritises consistency over depth. Three small practices done every day produce more emotional awareness in a month than three elaborate practices done occasionally.',
  },
  deeper_understanding: {
    title: 'The Emotional Pattern Investigation',
    practices: [
      { icon: '🔍', name: 'The three-question inquiry (5 minutes daily)', desc: 'For any significant emotion of the day: What am I feeling? (specific label). What specifically triggered it? (situational detail). What does this tell me about what I value or need? (the meaning layer). The third question is where understanding lives.' },
      { icon: '📊', name: 'Weekly emotion mapping (10 minutes, once weekly)', desc: 'At week\'s end: review the week\'s emotional content. What was the dominant emotional theme? What situations produced the strongest reactions? What patterns are emerging across the weeks? The pattern is the most important unit of emotional data — not any single event.' },
      { icon: '🪞', name: 'The secondary emotion question (as needed)', desc: 'When a strong emotion appears: ask "What would I be feeling if this emotion were gone?" The secondary emotion (the one visible) often protects a primary one (the more vulnerable one underneath). Anger protects hurt. Dismissiveness protects disappointment. Knowing the primary is essential for understanding what is actually happening.' },
    ],
    note: 'Understanding your emotional patterns requires enough distance from individual emotional events to see their recurring structure. Weekly reflection is the minimum time window for pattern recognition.',
  },
  regulate_better: {
    title: 'The Awareness-to-Regulation Bridge',
    practices: [
      { icon: '⏸️', name: 'The STOP-and-name practice (2 minutes, acute moments)', desc: 'When emotion is strong: Stop what you are doing. Take one physiological sigh. Observe — "I notice I am feeling [specific emotion] in response to [specific trigger]." Proceed from this observed position rather than the automatic one. The naming alone reduces amygdala activation measurably (Lieberman, UCLA).' },
      { icon: '📋', name: 'The needs identification practice (3 minutes, daily)', desc: 'Once per day: identify one emotion that was present today and ask "What need was this emotion expressing?" Then: "Did I meet this need? If not, can I meet it now or tomorrow?" The needs awareness converts emotional experience from mere feeling into information that can be acted on.' },
      { icon: '🌊', name: 'The urge awareness practice (ongoing)', desc: 'When any strong emotion produces an impulse (to send a message, to withdraw, to confront): notice the urge specifically. "I notice an urge to [specific behaviour]." Wait 90 seconds — the urge peak is brief. From the reduced-intensity moment after the peak, choose deliberately. Most emotional regulation failures occur in the 90 seconds between urge and action.' },
    ],
    note: 'Emotional regulation is only available to emotions that have been noticed and named. The awareness practices and the regulation practices are the same practice — awareness is already the beginning of regulation.',
  },
  relationships: {
    title: 'The Relational Emotional Awareness Practice',
    practices: [
      { icon: '💬', name: 'Post-interaction emotional audit (3 minutes after significant conversations)', desc: 'After any significant conversation: "What did I feel during this interaction? What did I notice about the other person\'s emotional state? What did I communicate about my own emotional state — intentionally or unintentionally?" The audit builds both self-awareness and other-awareness simultaneously.' },
      { icon: '🔍', name: 'The impact inquiry (weekly)', desc: '"How did my emotional state affect the people around me this week?" This question specifically builds external emotional awareness — the understanding of one\'s emotional impact — which most people access only after someone has told them, rather than through self-reflection. The habitual inquiry prevents the accumulated impact damage that emotional unawareness produces.' },
      { icon: '💛', name: 'The empathy practice (daily)', desc: 'For one person in your life each day: "What might they be feeling right now, given what I know about their situation?" Then: "How did I show up for this person today emotionally — did I make space for their experience alongside my own?" The daily empathy attention builds the other-awareness dimension of emotional intelligence that self-reflection alone cannot develop.' },
    ],
    note: 'Relational emotional awareness requires both self-knowledge (what am I feeling and what is driving my behaviour?) and other-awareness (what is this person experiencing and how am I contributing to it?). Both are built through consistent reflective practice.',
  },
};

// ── Builder Component ──────────────────────────────────────────────────────────
function EmotionalAwarenessPracticeBuilder() {
  const [step,       setStep]       = useState(1);
  const [level,      setLevel]      = useState(null);
  const [situation,  setSituation]  = useState(null);
  const [goal,       setGoal]       = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [openPrac,   setOpenPrac]   = useState(null);
  const [openDay,    setOpenDay]    = useState(null);
  const [showVoice,  setShowVoice]  = useState(false);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selLevel = AWARENESS_LEVELS.find(l => l.key === level);
  const selSit   = RELATABLE_SITUATIONS.find(s => s.key === situation);
  const selGoal  = REFLECTION_GOAL.find(g => g.key === goal);
  const practices= goal ? REFLECTION_PRACTICES_BY_GOAL[goal] : null;

  const handleReset = () => {
    setStep(1); setLevel(null); setSituation(null); setGoal(null);
    setRevealed(false); setOpenPrac(null); setOpenDay(null); setShowVoice(false);
  };

  const ChoiceBtn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{
        padding: '12px 14px', borderRadius: '11px', border: '2px solid',
        borderColor: isSel ? MAUVE : 'var(--border)', background: isSel ? MPALE11 : 'white',
        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        width: '100%', marginBottom: '7px',
        boxShadow: isSel ? `0 0 0 2px ${MBORD11}` : 'none',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? MAUVE : 'var(--ink)', marginBottom: opt.desc ? '2px' : 0 }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: MAUVE, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  const NavRow = ({ backFn, nextFn, nextActive, nextLabel }) => (
    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
      <button onClick={backFn} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
      <button onClick={() => { if (nextActive) nextFn(); }} disabled={!nextActive} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: nextActive ? `linear-gradient(135deg, ${MAUVE}, #C06888)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: nextActive ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: nextActive ? `0 6px 18px ${MBORD11}` : 'none' }}>{nextLabel}</button>
    </div>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? MAUVE : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Where is your emotional awareness right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Be honest rather than aspirational — your plan is only useful if it starts from where you actually are.
          </p>
          {AWARENESS_LEVELS.map(l => <ChoiceBtn key={l.key} opt={l} selected={level} onSelect={setLevel} />)}
          <button onClick={() => { if (level) setStep(2); }} disabled={!level} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: level ? `linear-gradient(135deg, ${MAUVE}, #C06888)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: level ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: level ? `0 6px 18px ${MBORD11}` : 'none' }}>Next →</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — Which situation most challenges your emotional awareness?
          </p>
          {RELATABLE_SITUATIONS.map(s => <ChoiceBtn key={s.key} opt={s} selected={situation} onSelect={setSituation} />)}
          <NavRow backFn={() => setStep(1)} nextFn={() => setStep(3)} nextActive={!!situation} nextLabel="Next →" />
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What do you most want from building emotional awareness?
          </p>
          {REFLECTION_GOAL.map(g => <ChoiceBtn key={g.key} opt={g} selected={goal} onSelect={setGoal} />)}
          <NavRow backFn={() => setStep(2)} nextFn={() => { setStep(4); setRevealed(false); }} nextActive={!!goal} nextLabel="Build My Practice →" />
        </>
      )}

      {/* STEP 4 — Results */}
      {step === 4 && selLevel && selSit && selGoal && practices && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Emotional Awareness Practice Plan</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${MAUVE}, #C06888)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${MBORD11}` }}>💛 Reveal My Practice Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${MAUVE}, #C06888)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '5px' }}>{selLevel.icon} {selSit.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Your Emotional Awareness Plan</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>{selLevel.label.split('—')[0].trim()} · {selGoal.label.split(' ').slice(0, 5).join(' ')}…</div>
              </div>

              {/* Level context */}
              <div style={{ background: selLevel.bg, border: `1.5px solid ${selLevel.color}30`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selLevel.color, marginBottom: '5px', letterSpacing: '1.2px' }}>{selLevel.icon} Your Starting Point</div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selLevel.what}</p>
                <div style={{ background: 'white', borderRadius: '8px', padding: '9px 11px', border: `1px solid ${selLevel.color}20` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: selLevel.color, marginBottom: '3px' }}>🎯 CORE PRACTICE AT YOUR LEVEL:</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{selLevel.core_practice}</p>
                </div>
              </div>

              {/* Situation awareness */}
              <div style={{ background: 'white', border: `1.5px solid ${selSit.color}30`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', borderLeft: `3px solid ${selSit.color}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selSit.color, marginBottom: '5px', letterSpacing: '1.2px' }}>{selSit.icon} For This Specific Situation</div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{selSit.with_awareness}</p>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: selSit.color, marginBottom: '5px' }}>WHAT AWARENESS CHANGES:</div>
                  {selSit.awareness_shifts.map((shift, i) => (
                    <div key={i} style={{ display: 'flex', gap: '7px', padding: '3px 0', borderBottom: i < selSit.awareness_shifts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ color: selSit.color, fontWeight: '700', flexShrink: 0 }}>→</span>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.55 }}>{shift}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: selSit.bg, borderRadius: '8px', padding: '9px 11px', border: `1px solid ${selSit.color}20` }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: selSit.color, marginBottom: '3px' }}>💡 PRACTICE FOR THIS SITUATION:</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{selSit.practice}</p>
                </div>
              </div>

              {/* Three practices */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: MAUVE, marginBottom: '8px' }}>🛠️ {practices.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{practices.note}</div>
                {practices.practices.map((p, i) => {
                  const isOpen = openPrac === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${MBORD11}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenPrac(isOpen ? null : i)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left' }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{p.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: MAUVE, flex: 1 }}>{p.name}</span>
                        <span style={{ color: MAUVE, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{p.desc}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Week plan */}
              <div style={{ background: 'white', border: `1.5px solid ${MBORD11}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '10px 14px', background: `${MAUVE}12`, borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: '700', color: MAUVE }}>
                  📅 Your First Week — Day by Day
                </div>
                {selLevel.week_plan.map((w, i) => {
                  const isOpen = openDay === i;
                  return (
                    <div key={i} style={{ borderBottom: i < selLevel.week_plan.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <button onClick={() => setOpenDay(isOpen ? null : i)} style={{ width: '100%', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: MAUVE }}>{w.day}</span>
                        <span style={{ color: MAUVE, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && <div style={{ padding: '0 14px 10px 14px', borderTop: '1px solid var(--border)' }}><p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{w.task}</p></div>}
                    </div>
                  );
                })}
              </div>

              {/* First step + student voice */}
              <div style={{ background: MPALE11, border: `2px solid ${MAUVE}30`, borderRadius: '12px', padding: '13px 15px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: MAUVE, marginBottom: '4px' }}>🎯 DO THIS TODAY</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '600' }}>{selLevel.first_step}</p>
              </div>

              <div style={{ background: 'white', border: `1.5px solid ${MBORD11}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <button onClick={() => setShowVoice(v => !v)} style={{ width: '100%', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: MAUVE }}>👤 A student on this situation</span>
                  <span style={{ color: MAUVE, fontSize: '13px' }}>{showVoice ? '▲' : '▼'}</span>
                </button>
                {showVoice && <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}><p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selSit.student_voice}</p></div>}
              </div>

              {/* Affirmation */}
              <div style={{ background: MPALE11, border: `1.5px dashed ${MBORD11}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: MAUVE, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "Every emotion you name accurately is one emotion that no longer needs to run your behaviour unconsciously."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${MBORD11}`, color: MAUVE, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different practice plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function EmotionalAwarenessDaily({ navigate, relatedPosts }) {
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
      <p>There is a version of your day that is being driven by emotions you have not noticed yet. The irritability that produces the short reply to a friend who did not deserve it. The anxiety that makes the study session ineffective without knowing why. The low mood that sends you to the phone for an hour when what you actually needed was ten minutes of genuine rest. <strong>Emotional awareness</strong> is the skill that interrupts this pattern — not by eliminating the emotions but by bringing them into conscious contact where they can inform rather than just drive.</p>

      <p>Most students operate with remarkably limited emotional vocabulary — research shows the average person uses approximately six emotion words in daily life. Everything is either good, bad, stressed, fine, anxious, or happy. With this vocabulary, the actual texture of daily emotional experience remains largely invisible and therefore unaddressable. This guide is about expanding that vocabulary, building the reflection habits that make the expansion practical, and connecting it to mindfulness so the awareness is available in real time rather than only in retrospect.</p>

      <img
        src={meta.imgUrl}
        alt="Student developing emotional awareness every day — self-reflection practices, mindfulness connection, and relatable emotional situations"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-is">1. What Emotional Awareness Actually Is — and Why It Matters</h3>

      <p><strong>The three layers of emotional awareness.</strong> Research by psychologists Marc Brackett at Yale and Lisa Feldman Barrett at Northeastern identifies emotional awareness as operating across three distinct layers. The first layer is recognition: noticing that an emotional state is present. This sounds simple but for many people — especially those who have spent years in environments that deprioritise emotional experience — even this first layer is not reliable. Strong emotions arrive and drive behaviour before they have been consciously registered. The second layer is identification: naming the specific emotion with precision. This is where emotional granularity becomes critical — the ability to distinguish between being disappointed, ashamed, embarrassed, or humiliated rather than simply "feeling bad" determines what response is appropriate and available. The third layer is interpretation: understanding what the emotion means — what triggered it, what it reveals about values and needs, what it is asking for. Each layer builds on the one before.</p>

      <p><strong>Emotional granularity — the specific skill that matters most.</strong> Research by Lisa Feldman Barrett documents that people differ substantially in emotional granularity — the precision with which they can differentiate between distinct emotional states — and that this variation directly predicts both psychological wellbeing and physical health outcomes. High-granularity individuals (those who can distinguish between thirty or forty specific emotional states rather than collapsing them into a few broad categories) show better regulation capacity, lower cortisol, fewer sick days, less alcohol use as a coping strategy, and greater resilience after difficulty. Low-granularity individuals (who experience everything as some variation of "good" or "bad") lack the specific information their emotional states are trying to provide, leaving those states to be managed only through behavioural reactions rather than through informed response. The good news: granularity is trainable through deliberate vocabulary expansion and consistent self-reflection practice.</p>

      <p><strong>Why emotional awareness specifically matters for students.</strong> Academic environments create a specific emotional awareness challenge. They are simultaneously high-stakes (producing genuine emotional responses to results, comparisons, and uncertain futures) and emotion-deprioritising (the message is consistently that what matters is the result, not how you feel about it). This combination produces students who have intense emotional lives that they largely ignore or suppress — until those emotions produce crisis-level responses that can no longer be ignored. The student who has been suppressing anxiety about preparation quality for three weeks does not notice the anxiety reducing steadily until the night before the exam when it becomes panic. Emotional awareness catches the anxiety three weeks earlier — at a level where it is genuinely informative and addressable rather than overwhelming.</p>

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Science — What Emotional Awareness Builds in the Brain</h3>

      <p><strong>The insula cortex — the brain's interoception centre.</strong> The primary neural substrate of emotional awareness is the insula cortex — a region of the brain responsible for interoception (the processing of the body's internal signals) and for integrating bodily sensations with emotional experience. Research by Antonio Damasio at the University of Southern California shows that emotions are fundamentally bodily events — they produce specific physiological signatures that the insula cortex translates into emotional experience. Students with higher insula activity and greater interoceptive accuracy (the ability to accurately perceive their own internal body signals) show better emotional regulation, more stable decision-making, and stronger social functioning. Importantly, interoceptive awareness — and therefore emotional awareness — is directly trainable through practices that direct attention to internal body experience: the body check-in, the body scan, and mindfulness practices that include body awareness components.</p>

      <p><strong>The anterior cingulate cortex — the conflict monitor.</strong> The anterior cingulate cortex (ACC) plays a key role in emotional awareness by monitoring conflicts between current emotional experience and behavioural response — signalling when automatic reactions are inconsistent with the person's values or genuine needs. Research by Matthew Lieberman at UCLA documents that emotional labelling activates the right ventrolateral prefrontal cortex while simultaneously reducing amygdala activation — the "name it to tame it" mechanism. The ACC is what creates the gap between the emotional event and the labelling — the brief moment of recognition in which "I notice I am angry" is possible before the anger has driven a reactive behaviour. Mindfulness practice specifically strengthens ACC function, increasing the frequency and speed of this recognition gap.</p>

      <p><strong>The prefrontal cortex — awareness enabling choice.</strong> Research by Richard Davidson at the University of Wisconsin on affective neuroscience shows that the left prefrontal cortex is specifically associated with approach-oriented emotional processing — the capacity to move toward difficult emotional experience with curiosity rather than away from it with avoidance. Higher left prefrontal activity is associated with greater emotional resilience, faster recovery from negative emotional events, and stronger capacity for emotional approach coping. Mindfulness practice — which trains the specific orientation of non-judgmental, curious attention toward present-moment experience — directly builds this prefrontal approach capacity, producing the neurological infrastructure for emotional awareness as a stable trait rather than an occasional experience.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Emotional Awareness Daily Practice Builder</h3>
      <p>The Builder creates a personalised emotional awareness practice based on your current starting point, the situation that most challenges your awareness, and what you most want to develop. It includes a level-specific core practice, situation-specific awareness tools, three daily practices tailored to your goal, and a first-week day-by-day plan.</p>

      <EmotionalAwarenessPracticeBuilder />

      {/* ── Section 4 ── */}
      <h3 id="reflection">4. Six Self-Reflection Practices That Build Emotional Awareness</h3>

      <p><strong>Practice 1: The Emotion Naming Daily Log.</strong> The most fundamental and most effective daily awareness builder. Once per evening — in the same physical notebook, at the same time — write one sentence: "Today I felt [specific emotion] when [specific situation]." The specificity requirement is the training: forcing a more precise label than "stressed" or "bad" expands the emotional vocabulary through daily use. After two weeks of consistent entries, patterns in the emotional content begin to emerge — particular situations consistently producing particular states — that are invisible without the written record. Review the previous seven days once per week to access the pattern level of emotional information that individual entries cannot provide.</p>

      <p><strong>Practice 2: The Body Signal Check-In.</strong> Research by Sarah Garfinkel at the Sackler Centre shows that interoceptive awareness — the accuracy of body signal detection — directly predicts emotional regulation capacity. The body check-in practice builds this capacity through daily attention: once per day (morning works best), spend 60 seconds scanning slowly from head to feet. At each area — jaw, shoulders, chest, stomach — simply notice: tight, relaxed, uncomfortable, neutral. The jaw clenching, the chest tightness, the hollow stomach — these physical signals are emotional information arriving before conscious awareness catches up. The check-in gives the body signal a moment to surface before the day's demands have crowded it out.</p>

      <p><strong>Practice 3: The Secondary Emotion Question.</strong> Many of the emotions students experience most intensely are secondary — high-energy, visible states that protect against a more vulnerable primary emotion underneath. Anger protects against hurt or fear. Dismissiveness protects against disappointment. Cheerfulness sometimes protects against grief. The secondary emotion is the one visible in behaviour; the primary emotion is the one that contains the most accurate information about what is genuinely happening. The practice: when any strong emotion is present, ask "What would I be feeling if this emotion were gone?" The answer is almost always more vulnerable, more specific, and more informative than the secondary emotion that was initially visible.</p>

      <p><strong>Practice 4: The Emotional Need Identification.</strong> Every emotion contains information about an unmet or threatened need. Anxiety signals a need for safety or certainty. Anger signals a need for respect or fairness. Sadness signals a need for acknowledgment of loss. Shame signals a need for acceptance. The practice: when any significant emotion is present, ask "What need is this emotion expressing?" Then: "Is there a specific action available that would address this need?" The needs identification practice converts emotional experience from an overwhelming state to actionable information — producing the sense of agency within emotional experience that emotional flooding removes.</p>

      <p><strong>Practice 5: The Reaction Audit.</strong> Emotional awareness is often most easily developed in retrospect — examining the emotional dimensions of reactions after they have occurred. Once per day, choose one reaction from the day that seems disproportionate or confusing. Write: "The trigger was [situation]. My immediate reaction was [behaviour]. The emotion driving the reaction was [emotion]. The underlying need was [need]. The more aware response would have been [alternative]." The retrospective audit builds the awareness that, with practice, becomes available prospectively — before the automatic reaction has completed.</p>

      <p><strong>Practice 6: The Emotion-to-Values Connector.</strong> Strong emotions almost always connect directly to core values — the things that matter most deeply. The specific emotions that activate most intensely reveal the values being honoured or violated. Research by Kelly Wilson on ACT (Acceptance and Commitment Therapy) shows that emotional intensity is a reliable compass for values — the areas of life that produce the most intense emotional responses are almost always the areas where the most important values live. The practice: for any emotion that was particularly intense this week, ask "What does the intensity of this emotion tell me about what genuinely matters to me?" The answer is a direct route to values clarity.</p>

      {/* ── Section 5 ── */}
      <h3 id="mindfulness">5. The Mindfulness Connection — Awareness in Real Time</h3>

      <p><strong>Why mindfulness produces emotional awareness.</strong> Mindfulness and emotional awareness share the same core mechanism: present-moment, non-judgmental attention to what is actually happening. The distinction is in the object of attention: mindfulness practice typically directs attention to the breath, the body, or sensory experience; emotional awareness directs it specifically to the internal emotional landscape. The practices reinforce each other — mindfulness builds the attention quality and present-moment orientation that makes emotional noticing possible in real time, rather than only in retrospect through journalling.</p>

      <p><strong>The mindful emotion check-in.</strong> The most direct integration of mindfulness and emotional awareness is the mindful emotion check-in: a brief, deliberate practice of turning mindful attention specifically to the emotional dimension of present experience. Three times per day — morning, midday, and evening — close the eyes for 30 seconds and ask: "What is the emotional texture of this moment?" Not analysing, not solving — simply noticing. The 30-second notice, practised three times daily, builds the real-time emotional awareness that retrospective journalling cannot fully provide.</p>

      <p><strong>The decentred observation stance.</strong> Research on mindfulness-based cognitive therapy (Teasdale, Williams, Segal) identifies the decentred stance — observing thoughts and emotions from a slight distance rather than being completely inside them — as the primary mechanism of mindfulness-based wellbeing improvement. For emotional awareness, the decentred stance converts "I am anxious" (fusion: the self is identified with the emotion) into "I notice I am experiencing anxiety" (decentering: the self observes the emotion from outside). This linguistic shift, practised consistently in mindfulness sessions and then transferred to daily emotional experience, produces the awareness gap that makes emotional choice rather than emotional reaction possible.</p>

      <p><strong>Mindful attention to the body as emotional early warning.</strong> The body signals emotional states before cognitive awareness catches up. Research on somatic markers shows that the specific physiological patterns of different emotions are consistent and detectable — shallow breathing accompanies anxiety, muscular tension accompanies frustration, chest heaviness accompanies sadness. Developing mindful attention to these body signals through body scan practice and body-aware mindfulness provides the earliest possible detection of emotional states — catching the subtle physical signs before the emotion has escalated to the intensity where it disrupts functioning.</p>

      <p><strong>Practising with mild emotions to build capacity for intense ones.</strong> The most common mistake in building mindful emotional awareness is waiting until emotional intensity is high before applying the practices. Intense emotional states reduce prefrontal capacity — the very resource needed for mindful awareness — making the practices hardest to access exactly when they are most needed. The solution is to practise the mindful check-in and the decentred observation deliberately during mild and moderate emotional states throughout the day. The student who practises "I notice I am feeling slightly bored in this class" is building the awareness capacity that will be available when the emotion is "I notice I am in acute exam panic." The capacity transfers from mild to intense through consistent low-intensity practice.</p>

      {/* ── Section 6 ── */}
      <h3 id="situations">6. Relatable Situations — What Emotional Awareness Changes</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
        {RELATABLE_SITUATIONS.map(sit => (
          <div key={sit.key} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${sit.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '22px' }}>{sit.icon}</span>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: sit.color }}>{sit.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{sit.desc}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: '#FBF5F5', borderRadius: '9px', padding: '10px 12px', border: '1px solid rgba(139,38,53,0.15)' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#8B2635', marginBottom: '4px', textTransform: 'uppercase' }}>Without awareness:</div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{sit.typical_response}</p>
              </div>
              <div style={{ background: sit.bg, borderRadius: '9px', padding: '10px 12px', border: `1px solid ${sit.color}20` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: sit.color, marginBottom: '4px', textTransform: 'uppercase' }}>With awareness:</div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{sit.with_awareness}</p>
              </div>
            </div>
            <div style={{ background: MPALE11, borderRadius: '9px', padding: '9px 12px', border: `1px solid ${MBORD11}`, marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: MAUVE, marginBottom: '3px' }}>💡 PRACTICE FOR THIS SITUATION:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{sit.practice}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '8px', padding: '9px 11px', border: `1px solid var(--border)` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', marginBottom: '3px' }}>👤 STUDENT VOICE:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{sit.student_voice}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 7: FAQs ── */}
      <h3 id="faq">7. Emotional Awareness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I feel like I am too emotional — will building more awareness make this worse?</strong><br />
        A: The concern that emotional awareness amplifies emotional experience is understandable but reversed by research. The students who describe themselves as "too emotional" are almost always students who are experiencing emotions that have not been noticed and named — the emotions are running at full intensity without the awareness and labelling that would reduce their intensity. Research by Lieberman confirms that naming emotions reduces amygdala activation; research by Barrett on emotional granularity shows that more precise emotional labelling is associated with greater regulation capacity, not less. Being emotionally aware and being emotionally overwhelmed are not the same thing — in fact, improved awareness is one of the most reliable paths out of overwhelm. The emotion you can name specifically is an emotion you can begin to work with; the emotion you can only describe as "everything is too much" has no entry point for regulation.</p>

        <p><strong>Q: I have tried journalling but find it difficult to actually feel emotions rather than just intellectualise them when I write. What should I do?</strong><br />
        A: The intellectualisation of emotional experience during journalling — analysing rather than feeling — is one of the most common barriers to journalling-based emotional development. It is not a character failure; it is a learned defence against the discomfort of emotional experience that has been practised long enough to become automatic. Three adjustments that access feeling rather than analysis: write the body experience first (before any emotional labelling — "there is tension in my chest and my stomach is hollow"), write quickly without editing (the editing mode is the analytical mode; speed writing bypasses it), and use sentence completions rather than open-ended exploration ("When this happened, I felt ___. My body responded by ___. What I actually needed was ___"). The completion format prevents the pivot to analysis and keeps the writing in emotional territory.</p>

        <p><strong>Q: How do I build emotional awareness without becoming self-absorbed or over-focused on my own inner life?</strong><br />
        A: This is an important and honest concern. The distinction is between necessary self-awareness (the brief, purposeful check-in with internal experience that informs better behaviour) and unhealthy self-absorption (the extended, ruminative focus on internal experience that loops without producing useful information or movement). The practices in this guide are designed around the first — brief, purposeful, question-directed attention to internal experience followed by outward re-engagement. The goal is not to spend more time thinking about your feelings but to have more useful information available when interacting with the world. The test: does the practice produce information that changes how I show up for others? If yes — this is healthy awareness. If the practice becomes an extended private self-focus that reduces outward engagement — that is the line into self-absorption.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: MAUVE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The emotion you cannot name is the emotion that runs your behaviour unconsciously. Every name you find is a degree of freedom returned to you."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Practice Builder above to find your starting point and your first three practices. Begin tonight with one sentence: "Today I felt ___ when ___." That sentence, repeated daily, is the beginning of knowing yourself in a way that changes everything else.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: MAUVE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${MBORD11}` }}
          >
            Explore Your Emotions in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: MAUVE, border: `2px solid ${MAUVE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What You Are Feeling
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/manage-emotions-mindfulness',     '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/blog/control-thoughts-emotions',       '→ How to Control Your Thoughts and Emotions Naturally'],
            ['/blog/build-self-awareness',            '→ How to Build Self-Awareness in Daily Life'],
            ['/blog/body-awareness-mental-health',    '→ Body Awareness and Its Role in Mental Health'],
            ['/blog/mindful-gratitude-practice',      '→ How to Practice Gratitude Mindfully Every Day'],
            ['/blog/daily-mindfulness-routine',       '→ Daily Mindfulness Routine for Students and Young Adults'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: MAUVE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
