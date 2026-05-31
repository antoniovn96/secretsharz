import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Practice Gratitude Mindfully Every Day",
  excerpt: "Mindful gratitude practice is not a positivity exercise — it is a specific cognitive training that changes the brain's default attention patterns, measurably improving emotional wellbeing, stress resilience, and even sleep quality. This guide explains the science, gives you seven practical exercises, and includes an interactive practice builder to help you build the habit that actually stays.",
  category: "Mental Health",
  date: "14-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mindful-gratitude-practice.jpg",
  tldr: "Mindful gratitude practice produces measurable improvements in emotional wellbeing through a specific neurological mechanism: it deliberately trains attentional patterns away from the negativity bias that the human brain defaults to, building a more balanced and accurate relationship with one's own experience. Research by Emmons, Fredrickson, and Lyubomirsky documents consistent benefits including reduced depression symptoms, improved sleep quality, stronger relationships, and greater academic resilience — all from practices requiring as little as five minutes daily.",
  toc: [
    { id: "science",    title: "1. The Science of Gratitude — Why It Changes the Brain",              level: 3 },
    { id: "exercises",  title: "2. Seven Mindful Gratitude Exercises — Step by Step",               level: 3 },
    { id: "builder",    title: "3. Interactive: The Daily Gratitude Practice Builder",              level: 3 },
    { id: "benefits",   title: "4. Emotional Wellbeing Benefits — What the Research Shows",         level: 3 },
    { id: "habits",     title: "5. Habit-Building Tips That Make Gratitude Stick",                  level: 3 },
    { id: "faq",        title: "6. Mindful Gratitude Practice FAQs",                               level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-14T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mindful gratitude practice, daily gratitude exercises, gratitude mental health benefits, gratitude habit building, gratitude practice students, emotional wellbeing gratitude, how to practise gratitude mindfully",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is mindful gratitude practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mindful gratitude practice is the deliberate, present-moment appreciation of specific aspects of one's experience — combining the attentional quality of mindfulness (full, non-judgemental present-moment awareness) with the intentional orientation of gratitude (recognising and appreciating what is genuinely positive). The key distinction from ordinary gratitude is specificity and genuine attention: 'I am grateful for the interesting idea in this lecture I just heard and the way it connected to something I already knew' produces stronger wellbeing benefits than 'I am grateful for school.' Research by Lyubomirsky shows that the frequency and thoughtfulness of gratitude expressions, not their volume, determines their psychological benefit.",
      },
    },
    {
      "@type": "Question",
      "name": "How does gratitude improve mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gratitude improves mental health through several mechanisms: it reduces the negativity bias by training attention toward positive aspects of experience that the brain would otherwise filter out; it activates prosocial neural circuits associated with social bonding and positive affect; it increases serotonin and dopamine production (the neurotransmitters associated with mood and motivation); and it improves sleep quality by reducing pre-sleep cognitive arousal — specifically the ruminative worry that keeps the nervous system activated. Research by Emmons and McCullough found that participants who kept weekly gratitude journals reported higher levels of wellbeing and physical health than those who listed problems or neutral events.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does it take for gratitude practice to work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research documents different timescales for different benefits. Sleep quality improvements from pre-sleep gratitude journalling are often reported within 1-2 weeks. Mood improvements from daily gratitude exercises are measurable after 2-4 weeks of consistent practice. Reductions in depression and anxiety symptoms require longer consistent practice — typically 6-8 weeks before statistically significant changes appear in clinical measures. The key factor across all timescales is consistency and genuine specificity: rushed, generic gratitude listings produce fewer benefits than slower, more specific appreciations.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const GOLD9   = '#9B6B2A';
const GPALE9  = '#FBF5EC';
const GBORD9  = 'rgba(155,107,42,0.22)';

// ── Practice Builder Data ──────────────────────────────────────────────────────
const GRATITUDE_STYLES = [
  {
    key:     'writing',
    icon:    '✍️',
    label:   'Writing — journalling and lists',
    desc:    'I prefer processing things through writing; notebooks or journals feel natural',
    color:   '#2D6B45',
    bg:      '#E8F4EE',
  },
  {
    key:     'speaking',
    icon:    '🗣️',
    label:   'Speaking — saying it aloud or sharing with others',
    desc:    'I find verbal expression easier; saying things out loud or to someone feels more real',
    color:   '#2D5A8A',
    bg:      '#EEF3FB',
  },
  {
    key:     'sensing',
    icon:    '👁️',
    label:   'Sensing — noticing beauty, savouring experiences',
    desc:    'I connect with gratitude through physical experience and present-moment sensory awareness',
    color:   '#5B3A8B',
    bg:      '#F2EEF9',
  },
  {
    key:     'reflecting',
    icon:    '🪞',
    label:   'Reflecting — mentally reviewing and contemplating',
    desc:    'I prefer sitting quietly with gratitude, turning it over in my mind rather than writing or speaking',
    color:   GOLD9,
    bg:      GPALE9,
  },
];

const PREFERRED_MOMENT = [
  { key: 'waking',   icon: '🌅', label: 'First thing on waking',   when: 'Before any screen or device' },
  { key: 'meal',     icon: '🍽️', label: 'During or after a meal', when: 'One mindful meal per day' },
  { key: 'pre_study',icon: '📚', label: 'Before studying',         when: 'To transition into focus mode' },
  { key: 'evening',  icon: '🌙', label: 'Before sleeping',          when: 'To close the day mindfully' },
  { key: 'flexible', icon: '🔄', label: 'Flexible — whenever',      when: 'Whenever feels right each day' },
];

const CURRENT_MOOD = [
  { key: 'thriving',  icon: '🌟', label: 'Doing well — I want to deepen the practice' },
  { key: 'neutral',   icon: '😐', label: 'Neutral — I want to feel more positive' },
  { key: 'difficult', icon: '💔', label: 'Going through difficulty — I need genuine support' },
  { key: 'pressure',  icon: '⚡', label: 'Under intense pressure — exams or deadlines' },
];

const PRACTICE_PLANS = {
  writing: {
    waking: {
      title: 'The Morning Gratitude Log',
      duration: '5 minutes',
      steps: [
        { icon: '📓', text: 'Before picking up your phone: open a dedicated notebook. Date the page.' },
        { icon: '✍️', text: 'Write three specific things you are genuinely grateful for from yesterday — not today yet, yesterday. Be as specific as possible: not "my family" but "the conversation at dinner last night when my sister made everyone laugh."' },
        { icon: '🔍', text: 'For one of the three, write one additional sentence: "What this made possible was ___." The extension deepens the appreciation beyond the surface observation.' },
        { icon: '💫', text: 'Write one thing you are looking forward to today — however small. Close the notebook before opening your phone.' },
      ],
    },
    evening: {
      title: 'The Three Good Things Evening Journal',
      duration: '5-7 minutes',
      steps: [
        { icon: '📓', text: 'Fifteen minutes before sleeping: open the gratitude notebook.' },
        { icon: '✍️', text: 'Write three specific good things that happened today. Research by Seligman shows the specificity matters: "I figured out the maths problem I had been stuck on" produces more benefit than "studying went okay."' },
        { icon: '🔍', text: 'For each, write one brief sentence about what caused it or made it possible: "This happened because I decided to try a different approach." Connecting positive events to causes — including your own actions — builds efficacy alongside gratitude.' },
        { icon: '🌙', text: 'Close with one sentence about what you are releasing from today: "I am setting down ___." Then close the notebook.' },
      ],
    },
    pre_study: {
      title: 'The Study-Opening Gratitude Note',
      duration: '3 minutes',
      steps: [
        { icon: '📝', text: 'Before opening any study material: write one genuine thing about this subject or today\'s session that you appreciate — however small. "I am grateful that this topic is genuinely interesting even when it\'s hard" or "I appreciate that I have time today to go slowly."' },
        { icon: '✍️', text: 'Write one person who has helped your learning — in this subject, this year, ever. One sentence about what they contributed.' },
        { icon: '💡', text: 'Write the specific thing you hope to understand better by the end of this session. This bridges gratitude into intention — both activate the engagement network.' },
      ],
    },
    meal: {
      title: 'The Mindful Meal Gratitude Practice',
      duration: '5 minutes',
      steps: [
        { icon: '🍽️', text: 'Before eating: put the phone away. For one meal per day, the meal itself is the practice.' },
        { icon: '✍️', text: 'In a small notebook: write one sentence about where this meal came from — the people, the processes, the effort involved in bringing this food to your plate.' },
        { icon: '👁️', text: 'Before the first bite, notice the appearance, smell, and texture of the food deliberately. This is sensory mindfulness combined with appreciation — a fuller form of gratitude than conceptual recognition alone.' },
        { icon: '😊', text: 'Eat the meal slowly, without screens. This is the practice in action.' },
      ],
    },
    flexible: {
      title: 'The Gratitude Pocket Journal',
      duration: '2-3 minutes whenever',
      steps: [
        { icon: '📓', text: 'Keep a small notebook with you. Once per day, in any moment you notice a genuine feeling of appreciation — however fleeting — write it in one sentence.' },
        { icon: '✍️', text: 'The writing does not need to be beautiful or complete. A single honest sentence is the entire practice.' },
        { icon: '🔍', text: 'At week\'s end, read the week\'s entries. The accumulation reveals patterns: what kinds of things you are most genuinely grateful for, what you notice, what brings you back to appreciation.' },
      ],
    },
  },
  speaking: {
    waking: {
      title: 'The Morning Gratitude Declaration',
      duration: '3 minutes',
      steps: [
        { icon: '🗣️', text: 'Before any screen: stand up. Say aloud three specific things you are grateful for from yesterday. Say them to the room, or to yourself in the mirror.' },
        { icon: '💬', text: 'After each one, pause for a breath and let it land. The pause is what makes it mindful rather than performative — the difference between reciting a list and genuinely feeling appreciation.' },
        { icon: '🌅', text: 'Say one intention for the day: "Today I want to notice ___." This is verbal gratitude-in-advance — orienting the day\'s attention toward what matters.' },
      ],
    },
    evening: {
      title: 'The Gratitude Conversation',
      duration: '5-10 minutes',
      steps: [
        { icon: '👥', text: 'Find one person — a family member, a friend, a roommate — and ask them: "What was one good thing about your day?" Then share yours.' },
        { icon: '🗣️', text: 'The exchange is the practice. Social gratitude — sharing appreciation with another person — activates the prosocial bonding circuits in both people simultaneously, producing stronger wellbeing benefits than solo practice.' },
        { icon: '💬', text: 'If no one is physically available: a brief voice note to yourself. Saying it aloud to a recording activates the same verbal expression benefits as saying it to another person.' },
      ],
    },
    pre_study: {
      title: 'The Spoken Study Intention',
      duration: '2 minutes',
      steps: [
        { icon: '🗣️', text: 'Before studying: say aloud what you appreciate about having access to this education — this specific subject, these resources, this opportunity. Even if the appreciation is small or complicated.' },
        { icon: '💬', text: 'Say the specific task for this session aloud: "Right now I am going to [task]." Speaking activates different neural consolidation pathways than thinking — the spoken intention is more cognitively present.' },
        { icon: '✊', text: 'End with one sentence of genuine appreciation for your own effort: "I showed up today and that is real." This self-directed gratitude builds the motivational foundation that external pressure cannot sustain.' },
      ],
    },
    meal: {
      title: 'The Gratitude Blessing Practice',
      duration: '2 minutes',
      steps: [
        { icon: '🙏', text: 'Before eating: pause and say something genuine about this meal. It does not have to be formal or traditional. "Someone made this" or "this tastes like it was grown somewhere specific" — any genuinely attentive acknowledgment.' },
        { icon: '🗣️', text: 'If eating with others: say one thing you appreciate about the shared meal or the people present. The spoken social gratitude is more powerful than the internal version.' },
      ],
    },
    flexible: {
      title: 'The Gratitude Voice Note',
      duration: '1-2 minutes',
      steps: [
        { icon: '🎙️', text: 'Once per day: record a 60-90 second voice note of specific things you are grateful for. Say them as if explaining them to someone who cannot see your life.' },
        { icon: '🗣️', text: 'The specificity requirement of explaining to an imagined listener forces the depth of attention that generic gratitude lists avoid.' },
        { icon: '🔁', text: 'Occasionally play back previous voice notes. Hearing your own voice expressing genuine appreciation from a past difficult period is one of the most powerful resilience-building experiences available.' },
      ],
    },
  },
  sensing: {
    waking: {
      title: 'The Sensory Morning Appreciation',
      duration: '3 minutes',
      steps: [
        { icon: '☀️', text: 'Before any device: sit at a window or step outside for two minutes. Deliberately notice the quality of the morning light — its colour, its direction, the way it falls.' },
        { icon: '👁️', text: 'Choose one specific sensory detail of this morning that is genuinely pleasing or interesting: the temperature of the air, a particular sound, the way the light is moving. Give it your full attention for 30 seconds.' },
        { icon: '💛', text: 'Say or think: "This specific thing is present and available to me right now." This is sensory gratitude — appreciation grounded in direct sensory experience rather than cognitive evaluation.' },
      ],
    },
    evening: {
      title: 'The Evening Savouring Practice',
      duration: '5 minutes',
      steps: [
        { icon: '🌙', text: 'Before sleep: lie down and mentally revisit one genuinely pleasant experience from today — however small. The conversation that made you laugh. The moment a concept clicked. The taste of something you enjoyed.' },
        { icon: '👁️', text: 'Reconstruct the experience in sensory detail: what did it look like, feel like, sound like? The sensory reconstruction activates the neural networks of the positive experience, producing the wellbeing benefits of the event a second time.' },
        { icon: '💛', text: 'Research by Fred Bryant at Loyola University on savouring shows that mentally extending a positive experience through sensory reconstruction produces greater and more lasting wellbeing improvements than noting the positive experience without the sensory detail.' },
        { icon: '😌', text: 'Let the reconstructed experience be the last conscious content before sleep.' },
      ],
    },
    pre_study: {
      title: 'The Pre-Study Sensory Anchor',
      duration: '2 minutes',
      steps: [
        { icon: '☕', text: 'Before studying: make or hold something warm — tea, coffee, warm water. Hold it with both hands and attend fully to the warmth and weight for 30 seconds.' },
        { icon: '👁️', text: 'Take one deliberate look around your study space and notice one thing in it that you appreciate — the quality of the light, a specific object, the arrangement of the space.' },
        { icon: '💛', text: 'This brief sensory appreciation activates the parasympathetic nervous system slightly, transitioning from anxious pre-study activation to calmer focused readiness.' },
      ],
    },
    meal: {
      title: 'The Mindful Eating Gratitude Practice',
      duration: '5-10 minutes',
      steps: [
        { icon: '🍽️', text: 'Before eating: hold the food or drink for a moment. Notice its appearance specifically — colours, textures, the visual evidence of ingredients.' },
        { icon: '👃', text: 'Notice the smell before tasting. The olfactory system is the most directly connected sense to memory and emotion — the smell of food often activates more genuine appreciation than the taste alone.' },
        { icon: '👁️', text: 'Take the first bite slowly. Attend to the specific flavours, the temperature, the texture. This is not a performance — it is a genuine shift from consumption to appreciation.' },
        { icon: '💛', text: 'Eat the rest of the meal at whatever pace feels natural, but without screens. The practice is the deliberate beginning — the attention quality that follows is what it cultivated.' },
      ],
    },
    flexible: {
      title: 'The Gratitude Pause',
      duration: '60 seconds',
      steps: [
        { icon: '👁️', text: 'Once per day: stop in the middle of an ordinary activity and give it 60 seconds of complete attention. The walk to class. The hand on the doorknob. The ordinary moment that would usually be invisible.' },
        { icon: '💛', text: 'The 60-second pause converts invisible ordinary experience into appreciated present-moment experience — which is the essential movement of mindful gratitude.' },
        { icon: '🌱', text: 'Over a week, the capacity to find genuine appreciation in ordinary sensory experience grows. This is the developing habit of noticing — which is what mindful gratitude actually trains.' },
      ],
    },
  },
  reflecting: {
    waking: {
      title: 'The Morning Contemplation',
      duration: '5 minutes',
      steps: [
        { icon: '🧘', text: 'Sit comfortably before any other activity. Close your eyes. Take three slow breaths.' },
        { icon: '🪞', text: 'Allow your attention to rest on one aspect of your current life that you genuinely appreciate — not aspirationally, actually. Let it be present without analysing it.' },
        { icon: '💛', text: 'For two to three minutes, hold this appreciation in your attention the way you would hold something warm and real — not labelling or justifying it, just being with it.' },
        { icon: '🌅', text: 'Before opening your eyes: set one quiet intention for the day. Open your eyes slowly and begin.' },
      ],
    },
    evening: {
      title: 'The Gratitude Review Meditation',
      duration: '7-10 minutes',
      steps: [
        { icon: '🧘', text: 'Before sleep: sit or lie comfortably. Close your eyes. Take five slow breaths.' },
        { icon: '🪞', text: 'Let the day pass through awareness — not analysing it, just watching it like a slow film. Notice the moments that were, in any small way, good, kind, interesting, or meaningful.' },
        { icon: '💛', text: 'Allow each positive moment to linger for two or three breaths before moving on. Do not rush to the next — let each one be held fully before releasing.' },
        { icon: '🌙', text: 'End with one person who made a positive difference in your day — however small. Hold them briefly in awareness with genuine appreciation. This prosocial gratitude specifically activates the social bonding networks associated with deep wellbeing.' },
      ],
    },
    pre_study: {
      title: 'The Gratitude-to-Purpose Bridge',
      duration: '3 minutes',
      steps: [
        { icon: '🧘', text: 'Before studying: close your eyes for 90 seconds. Let your attention rest on the honest answer to: "What is genuinely good about the fact that I am about to do this?"' },
        { icon: '🪞', text: 'Even a difficult or unwanted task often has something genuinely appreciable: the opportunity to understand something, the evidence that you are capable of difficulty, the fact that the effort will produce something real.' },
        { icon: '💡', text: 'Let this genuine appreciation — however small — be the cognitive context in which the session begins. This is the gratitude-motivation bridge: appreciation for something real, connected to the upcoming effort.' },
      ],
    },
    meal: {
      title: 'The Contemplative Meal Pause',
      duration: '2 minutes',
      steps: [
        { icon: '🧘', text: 'Before eating: close your eyes for 60 seconds. Let your attention rest briefly on the people, conditions, and efforts that made this specific meal possible.' },
        { icon: '🪞', text: 'Not abstractly — specifically. Who grew the ingredients? Who prepared this? What conditions made this available to you? Let the web of contribution be briefly present in awareness.' },
        { icon: '💛', text: 'Open your eyes and eat the meal with a slightly more aware quality of attention — not performance, just slightly more present than usual.' },
      ],
    },
    flexible: {
      title: 'The Midday Gratitude Check-In',
      duration: '2 minutes',
      steps: [
        { icon: '🧘', text: 'Once per day — midday tends to work well — pause for two minutes.' },
        { icon: '🪞', text: 'Let your attention rest on one thing in your current life that, if it were gone, you would miss. This "prospective gratitude" or "gratitude by contrast" is often the most genuine form — what we take for granted becomes visible when we imagine its absence.' },
        { icon: '💛', text: 'Hold it in attention for a few breaths. Nothing to write or say — just to feel, briefly and honestly, the genuine value of what is present.' },
      ],
    },
  },
};

const MOOD_ADAPTATIONS = {
  thriving: {
    note: 'From a place of thriving, gratitude practice deepens rather than lifts. The growth edge is specificity and genuine attention — moving beyond the comfortable gratitude phrases toward the genuinely specific, unexpected, or surprising sources of appreciation in your life right now.',
    practice_add: 'Add: the gratitude letter. Once this week, write a full letter to someone who has made a significant positive difference in your life — and if possible, deliver or read it to them. Research by Seligman on gratitude visits shows this produces the largest available single-session wellbeing boost in positive psychology research.',
  },
  neutral: {
    note: 'From a neutral starting point, consistent daily gratitude practice produces the most measurable wellbeing improvements across two to four weeks. The key is specificity over volume — three genuinely specific appreciations produce more benefit than ten generic ones.',
    practice_add: 'Add: the subtle gratitude practice. Each day this week, look for one genuinely positive thing you would normally overlook — something so ordinary it is usually invisible. A comfortable chair, adequate light, a moment without noise. The capacity to notice these is precisely what develops with practice.',
  },
  difficult: {
    note: 'Gratitude during genuinely difficult times requires honesty rather than forced positivity. The research supports "gratitude despite" rather than "gratitude instead of" — acknowledging the difficulty fully while also genuinely noticing what small or large things remain. Forced positivity in difficulty is counterproductive; authentic appreciation of what is genuinely present is both honest and beneficial.',
    practice_add: 'Add: the both/and practice. Write two sentences daily: "Today was hard because ___ " AND "Today also had ___." The both/and format makes space for the difficulty without using it to erase the genuine appreciation. This is mindful gratitude — present with the whole of experience, not only the comfortable parts.',
  },
  pressure: {
    note: 'Under intense pressure, gratitude practice is most effective as a brief, physiological reset — not an extended reflective exercise. The research benefit is in the parasympathetic activation of the appreciation state, which directly counteracts the sympathetic activation of the pressure response. Even 90 seconds of genuine gratitude attention produces measurable cortisol reduction.',
    practice_add: 'Add: the pressure-specific gratitude anchor. When study pressure feels highest, pause for 90 seconds and name one specific thing — however small — that is genuinely present and appreciated. Not to dismiss the pressure, but to create a brief window of calm alongside it. "The pressure is real. And also: this cup of tea is genuinely good right now." Both things are true.',
  },
};

// ── Practice Builder Component ─────────────────────────────────────────────────
function DailyGratitudePracticeBuilder() {
  const [step,     setStep]     = useState(1);
  const [style,    setStyle]    = useState(null);
  const [moment,   setMoment]   = useState(null);
  const [mood,     setMood]     = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [openStep, setOpenStep] = useState(null);
  const [gratText, setGratText] = useState('');
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selStyle  = GRATITUDE_STYLES.find(s => s.key === style);
  const selMoment = PREFERRED_MOMENT.find(m => m.key === moment);
  const selMood   = CURRENT_MOOD.find(m => m.key === mood);
  const plan      = style && moment ? (PRACTICE_PLANS[style]?.[moment] || PRACTICE_PLANS[style]?.flexible) : null;
  const moodAdapt = mood ? MOOD_ADAPTATIONS[mood] : null;

  const handleReset = () => { setStep(1); setStyle(null); setMoment(null); setMood(null); setRevealed(false); setOpenStep(null); setGratText(''); };

  const ChoiceGrid = ({ options, selected, onSelect, cols = 1 }) => (
    <div style={{ display: 'grid', gridTemplateColumns: cols === 2 ? '1fr 1fr' : '1fr', gap: '8px', marginBottom: '16px' }}>
      {options.map(opt => {
        const isSel = selected === opt.key;
        return (
          <button key={opt.key} onClick={() => onSelect(opt.key)} style={{
            padding: '12px 14px', borderRadius: '11px', border: '2px solid',
            borderColor: isSel ? GOLD9 : 'var(--border)', background: isSel ? GPALE9 : 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            boxShadow: isSel ? `0 0 0 2px ${GBORD9}` : 'none',
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{opt.icon}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? GOLD9 : 'var(--ink)', marginBottom: opt.desc ? '2px' : 0 }}>{opt.label}</div>
              {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
              {opt.when && <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{opt.when}</div>}
            </div>
            {isSel && <span style={{ marginLeft: 'auto', color: GOLD9, fontWeight: '700', flexShrink: 0 }}>✓</span>}
          </button>
        );
      })}
    </div>
  );

  const NextBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} disabled={!active} style={{
      width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
      background: active ? `linear-gradient(135deg, ${GOLD9}, #C49035)` : 'var(--border)',
      color: 'white', fontWeight: '700', fontSize: '15px',
      cursor: active ? 'pointer' : 'not-allowed', fontFamily: font,
      boxShadow: active ? `0 6px 18px ${GBORD9}` : 'none',
    }}>{label}</button>
  );

  const BackBtn = () => (
    <button onClick={() => setStep(s => s - 1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? GOLD9 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — How do you naturally express or process appreciation?
          </p>
          <ChoiceGrid options={GRATITUDE_STYLES} selected={style} onSelect={setStyle} />
          <NextBtn active={!!style} onClick={() => { if (style) setStep(2); }} label="Next →" />
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — When in the day do you want to practise?
          </p>
          <ChoiceGrid options={PREFERRED_MOMENT} selected={moment} onSelect={setMoment} />
          <div style={{ display: 'flex', gap: '10px' }}><BackBtn /><button onClick={() => { if (moment) setStep(3); }} disabled={!moment} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: moment ? `linear-gradient(135deg, ${GOLD9}, #C49035)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: moment ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button></div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — How are you doing right now?
          </p>
          <ChoiceGrid options={CURRENT_MOOD} selected={mood} onSelect={setMood} />
          <div style={{ display: 'flex', gap: '10px' }}><BackBtn /><button onClick={() => { if (mood) { setStep(4); setRevealed(false); } }} disabled={!mood} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: mood ? `linear-gradient(135deg, ${GOLD9}, #C49035)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: mood ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Gratitude Practice →</button></div>
        </>
      )}

      {step === 4 && plan && moodAdapt && selStyle && selMoment && selMood && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Daily Gratitude Practice</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${GOLD9}, #C49035)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${GBORD9}` }}>🌟 Reveal My Gratitude Practice</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${GOLD9}, #C49035)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{selStyle.icon} {selMoment.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{plan.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>{plan.duration} · {selStyle.label} · {selMoment.label}</div>
              </div>

              {/* Steps */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: GOLD9, marginBottom: '8px' }}>✨ Your Daily Steps</div>
                {plan.steps.map((s, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '6px', border: `1.5px solid ${GBORD9}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{ width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px', fontFamily: font, textAlign: 'left' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD9}, #C49035)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{s.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: GOLD9, flex: 1 }}>Step {i + 1}</span>
                        <span style={{ color: GOLD9, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && <div style={{ padding: '0 15px 12px 15px', borderTop: '1px solid var(--border)' }}><p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{s.text}</p></div>}
                    </div>
                  );
                })}
              </div>

              {/* Mood adaptation */}
              <div style={{ background: GPALE9, border: `2px solid ${GBORD9}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px', borderLeft: `4px solid ${GOLD9}` }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: GOLD9, marginBottom: '5px' }}>{selMood.icon} Given Your Current Mood</div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{moodAdapt.note}</p>
                <div style={{ background: 'white', borderRadius: '8px', padding: '9px 12px', border: `1px solid ${GBORD9}` }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: GOLD9, marginBottom: '3px' }}>⭐ Additional Practice:</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{moodAdapt.practice_add}</p>
                </div>
              </div>

              {/* Try it now */}
              <div style={{ background: 'white', border: `1.5px solid ${GBORD9}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: GOLD9, marginBottom: '7px' }}>🌟 Try It Right Now — One Sentence</div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Write one specific thing you are genuinely grateful for right now — in this moment. Be as specific as possible.</p>
                <textarea
                  value={gratText}
                  onChange={e => setGratText(e.target.value)}
                  placeholder="Right now I am genuinely grateful for..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 13px', borderRadius: '8px', border: `1.5px solid ${gratText ? GOLD9 : 'var(--border)'}`, fontFamily: font, fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.65, background: gratText ? `${GOLD9}06` : 'var(--sand)', transition: 'all 0.2s' }}
                />
                {gratText.trim().length > 10 && (
                  <div style={{ marginTop: '8px', background: GPALE9, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${GBORD9}` }}>
                    <p style={{ margin: 0, fontSize: '13px', color: GOLD9, fontWeight: '600', lineHeight: 1.5 }}>
                      ✓ You just completed one gratitude practice. That is the whole thing — one specific, honest appreciation. Repeat tomorrow.
                    </p>
                  </div>
                )}
              </div>

              {/* Affirmation */}
              <div style={{ background: GPALE9, border: `1.5px dashed ${GBORD9}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: GOLD9, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "Gratitude is not a performance of happiness. It is the honest noticing of what is genuinely present and valuable — even alongside difficulty."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${GBORD9}`, color: GOLD9, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different practice</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulGratitudePractice({ navigate, relatedPosts }) {
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
      <p>Gratitude is one of the most misunderstood concepts in student mental health. It is frequently presented as a positivity tool — a way to look on the bright side, count your blessings, and feel better about difficult circumstances. This framing is both reductive and counterproductive: it implies that gratitude requires denying difficulty, which makes it unusable precisely when it would be most valuable.</p>

      <p><strong>Mindful gratitude practice</strong> is something more specific and more useful. It is the deliberate, present-moment attention to what is genuinely positive in one's experience — not to the exclusion of difficulty but alongside it. The research on gratitude is extensive, the neurological mechanisms are documented, and the benefits are measurable. The practices are accessible in five minutes. This guide covers all of it.</p>

      <img
        src={meta.imgUrl}
        alt="Student practising mindful gratitude daily — emotional wellbeing benefits, gratitude exercises, and habit-building strategies"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="science">1. The Science of Gratitude — Why It Changes the Brain</h3>

      <p><strong>The negativity bias and why it needs active correction.</strong> The human brain is evolutionarily calibrated to attend to negative information more readily and more persistently than positive information — a bias documented extensively by researchers including Roy Baumeister at FSU, whose review of the literature identified the principle that "bad is stronger than good" across virtually every psychological domain. This negativity bias is adaptive in genuinely dangerous environments: it keeps the organism vigilant and alive. In modern academic environments — where the primary threats are social, performance-based, and future-oriented — it produces a systematic distortion: the negative aspects of experience are over-represented in awareness and the positive aspects are filtered out, producing a chronic mismatch between actual experience and internal representation of experience. Gratitude practice directly addresses this distortion by deliberately redirecting attention toward positive aspects of experience that the negativity bias would otherwise filter.</p>

      <p><strong>The neurochemistry of appreciation.</strong> Research by Glenn Fox and colleagues at the University of Southern California used fMRI to document the neural correlates of grateful experience, finding activation in the medial prefrontal cortex (associated with social bonding and moral cognition), the anterior cingulate cortex (emotional regulation), and the caudate nucleus (part of the reward system associated with dopamine release). The prosocial nature of many gratitude experiences — appreciating what others have done — specifically activates the social bonding neural circuits that produce both immediate positive affect and longer-term wellbeing through strengthened social connections. Research by Martin Seligman at the University of Pennsylvania on gratitude visits documents this social dimension: expressing gratitude to another person face-to-face produces larger and more lasting wellbeing improvements than any solo gratitude practice.</p>

      <p><strong>The sleep quality mechanism.</strong> Research by Nancy Wood and colleagues on gratitude and sleep found that the primary mechanism linking gratitude practice to sleep quality improvement is the reduction of pre-sleep cognitive arousal — specifically the ruminative worry that keeps the nervous system in an activated state beyond its appropriate circadian winding-down. Gratitude journalling before bed reduces cognitive arousal by directing attention toward positive content that does not activate the sympathetic threat response. The effect is not trivial: Wood et al. found that higher trait gratitude was associated with falling asleep more quickly, sleeping longer, and having higher sleep quality — all measures directly relevant to student academic performance.</p>

      <p><strong>The broaden-and-build theory.</strong> Research by Barbara Fredrickson at the University of North Carolina on positive emotions documents the "broaden-and-build" theory: positive emotional states broaden the cognitive scope of attention (producing more creative and flexible thinking) and build durable psychological and social resources that persist beyond the momentary positive state. Gratitude is among the positive emotions Fredrickson studied, and her longitudinal research documents that regular positive emotional experience — including gratitude — builds the psychological resilience, social connections, and cognitive flexibility that help people navigate future difficulties more effectively. For students, this means regular gratitude practice is not just producing immediate wellbeing improvements — it is building the psychological infrastructure that makes future challenges more survivable.</p>

      {/* ── Section 2 ── */}
      <h3 id="exercises">2. Seven Mindful Gratitude Exercises — Step by Step</h3>

      {[
        {
          num: '01', icon: '📓', name: 'The Specific Three',
          color: '#2D6B45', bg: '#E8F4EE',
          desc: 'The most extensively researched gratitude exercise: three specific things you are grateful for, daily',
          why: 'Research by Emmons and McCullough found that participants who wrote three things they were grateful for weekly reported higher levels of wellbeing and physical health than those who listed daily problems or neutral events. The specificity is the active ingredient — generic gratitude lists ("family, health, food") produce fewer benefits than genuinely specific appreciations that engage actual memories and sensory details.',
          steps: ['Each morning or evening: write three specific things you are genuinely grateful for from the past 24 hours', 'For each one, write one additional sentence about why this specific thing matters to you', 'The why sentence is the mindfulness component — it requires genuine attention to the specific value of this specific thing', 'Read all three before sleeping if practising in the morning, or immediately before sleep if practising in the evening'],
          example: '"I am grateful for the chai I made this morning — specifically the way the ginger smelled when it was steeping, which made the whole kitchen feel different for a few minutes." This level of specificity is what produces the neurological benefits.',
        },
        {
          num: '02', icon: '💌', name: 'The Gratitude Letter',
          color: '#2D5A8A', bg: '#EEF3FB',
          desc: 'Writing a full, detailed letter of appreciation to someone who has made a meaningful difference',
          why: 'Research by Seligman and colleagues in the Journal of Positive Psychology documents the "gratitude visit" as producing the largest available single-session wellbeing boost in positive psychology research — larger than any other positive psychology intervention. The effect persists for weeks after the visit. Written expression of gratitude to specific people activates the same prosocial neural circuits as face-to-face expression.',
          steps: ['Choose someone who has made a significant positive difference in your life — a teacher, a family member, a friend — whom you have never properly thanked', 'Write a letter of 300-500 words describing specifically what they did, why it mattered, and how your life is different because of it', 'If possible: arrange to read the letter to them in person (or send it, or share it verbally). The expression is the highest-value component', 'If the person is unavailable or the expression feels too vulnerable: keeping the letter and reading it periodically still produces meaningful benefits'],
          example: '"The year I failed my boards, my tutor spent two extra hours every Saturday showing me the foundational concepts I had been too embarrassed to ask about in class. That patience is the reason I am in a degree programme now." Written with genuine detail, this gratitude is a healing act for the writer as well as the recipient.',
        },
        {
          num: '03', icon: '✋', name: 'The Subtraction Exercise',
          color: '#5B3A8B', bg: '#F2EEF9',
          desc: 'Imagining the absence of good things to reveal their genuine value',
          why: 'Research by Koo and colleagues on mental subtraction shows that imagining the absence of positive events — rather than simply reviewing their presence — produces stronger gratitude and wellbeing responses. The contrast between presence and imagined absence reveals the genuine value of what exists, which ordinary forward-looking appreciation often misses.',
          steps: ['Choose something genuinely valuable in your current life — a relationship, an opportunity, an ability', 'Spend three minutes genuinely imagining that this thing had never existed or had never happened. Be specific about what would be different.', 'Return to the reality of its presence. Notice how the appreciation changes when viewed through the contrast.', 'Write one sentence about what you are grateful for about this specific thing that you did not notice before the subtraction exercise'],
          example: 'Imagining a world in which your best friend had gone to a different school — specifically what conversations would not have happened, what support would not have existed — reveals the genuine value of the friendship that its daily presence makes invisible. The subtraction exercise restores visibility to what familiarity has made invisible.',
        },
        {
          num: '04', icon: '🌅', name: 'The Savouring Practice',
          color: GOLD9, bg: GPALE9,
          desc: 'Deliberately extending and deepening the experience of a positive moment',
          why: 'Research by Fred Bryant at Loyola University on savouring — the deliberate mental engagement with positive experiences — shows that people who savour actively report significantly higher life satisfaction and wellbeing than those who have equal positive experiences without active savouring. The mechanism: savouring extends the duration of positive emotional experience by keeping the neural networks of the positive state active longer.',
          steps: ['During any genuinely pleasant experience — a meal, a moment of nature, a conversation, a piece of music — choose to slow down and pay deliberate attention to it', 'Notice as many sensory details as possible: taste, sound, light, texture, temperature', 'Say to yourself or note briefly: "This is genuinely good. I am appreciating this specifically."', 'After the experience: reconstruct it briefly in memory, attending to the sensory details again. This second encounter with the experience through memory produces a second activation of its positive neural signature'],
          example: 'Drinking a cup of tea while paying complete attention to its temperature, taste, smell, and the warmth of the cup — rather than while scrolling or studying — transforms an ordinary five minutes into a genuine experience of sensory pleasure and appreciation. This is the most accessible form of mindful gratitude available.',
        },
        {
          num: '05', icon: '👥', name: 'The Gratitude Expression',
          color: '#1A7272', bg: '#EBF5F5',
          desc: 'Directly expressing appreciation to someone who has helped or supported you',
          why: 'The social dimension of gratitude is the most powerful predictor of its wellbeing benefits. Research by Sara Algoe at UNC shows that gratitude expression produces benefits not only for the expresser but for the recipient — and that the expression strengthens the relationship between them by activating the "find, remind, and bind" mechanism: it finds something genuinely positive in the relationship, reminds both parties of it, and binds them more closely through the shared positive experience.',
          steps: ['Once per week: identify one specific person who has done something — however small — that you genuinely appreciate', 'Express it specifically and directly: "I wanted to tell you that [specific thing you did] [specifically mattered to me] because [why it mattered]"', 'The expression does not need to be formal or dramatic. A brief message, a sentence in conversation, or a written note all produce the benefits', 'Allow yourself to receive their response — the discomfort many people feel receiving appreciation is itself useful self-awareness about their relationship with genuine connection'],
          example: '"Your explanation of the derivative in Tuesday\'s class was the first time that concept made sense to me in three years of trying. I wanted to tell you that." Sent to a teacher. Brief, specific, honest — and producing wellbeing benefits for both sender and recipient.',
        },
        {
          num: '06', icon: '🌿', name: 'The Difficulty-Inclusive Gratitude',
          color: '#8B2635', bg: '#FBF0F1',
          desc: 'Finding genuine appreciation in the presence of difficulty — not instead of it, but alongside it',
          why: 'Research by Robert Emmons on "gratitude despite adversity" shows that the capacity to notice genuine positive aspects of experience during genuinely difficult periods is both possible and particularly powerful. This is not toxic positivity (pretending difficulty is not real) — it is the both/and practice: acknowledging difficulty fully while genuinely appreciating what is also present. The capacity to hold both simultaneously is what research identifies as a marker of genuine resilience.',
          steps: ['When facing genuine difficulty: begin by fully acknowledging it. Write or say: "This is genuinely hard."', 'Then, without dismissing the difficulty, ask honestly: "What is also present that I genuinely appreciate, even in this difficulty?"', 'The "even in this" is important — it does not require the positive to offset the negative. They coexist.', 'Write the both/and: "This is genuinely hard because ___. And I also genuinely appreciate ___ right now."'],
          example: 'During exam season: "This week is genuinely exhausting and I am running close to my limit. And I also genuinely appreciate that my study group checked in on me yesterday and that I actually understood today\'s revision session." The difficulty is not minimised. The appreciation is genuinely felt. Both are accurate.',
        },
        {
          num: '07', icon: '🔭', name: 'The Prospective Gratitude Practice',
          color: '#C07800', bg: '#FFF8E1',
          desc: 'Appreciating things through imagining their absence — what you would miss if it were gone',
          why: 'Prospective gratitude — noticing what you genuinely value before it is lost — is one of the most practically available but least commonly practised gratitude forms. It requires no special event or achievement: only the deliberate attention to what is ordinarily present and ordinarily invisible. Research on hedonic adaptation shows that humans rapidly habituate to positive circumstances, producing the experience that "normal" conditions have no genuine value. Prospective gratitude interrupts this habituation by making the normally invisible visible.',
          steps: ['Once per week: choose one aspect of your current life that you take completely for granted', 'Spend two minutes genuinely imagining that it is no longer there: the person is no longer available, the opportunity is closed, the health that allows you to study is impaired', 'Return to its current reality. Write one honest sentence about what you appreciate about it that the imagined absence revealed', 'This is the most reliable method for recovering genuine appreciation for circumstances that habit has made invisible'],
          example: '"I genuinely take for granted that I can read for hours without physical difficulty. Imagining chronic eye pain or persistent headache that prevented sustained reading revealed a genuine appreciation for something I have never once thought to be grateful for." The simplest, most ordinary capabilities become genuinely appreciable when their absence is briefly imagined.',
        },
      ].map(ex => (
        <div key={ex.num} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '18px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${ex.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: `${ex.color}40` }}>{ex.num}</span>
            <span style={{ fontSize: '20px' }}>{ex.icon}</span>
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: ex.color }}>{ex.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{ex.desc}</div>
            </div>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{ex.why}</p>
          <div style={{ background: ex.bg, borderRadius: '10px', padding: '11px 13px', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: ex.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Steps:</div>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              {ex.steps.map((s, i) => <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '4px' }}>{s}</li>)}
            </ol>
          </div>
          <div style={{ background: GPALE9, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${GBORD9}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: GOLD9, marginBottom: '3px' }}>💡 EXAMPLE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>{ex.example}</p>
          </div>
        </div>
      ))}

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Daily Gratitude Practice Builder</h3>
      <p>The Builder designs a personalised daily gratitude practice based on how you naturally express appreciation, when you prefer to practise, and how you are doing right now. The result includes a named practice with step-by-step guidance, a mood-adapted note with an additional practice, and a space to write your first gratitude entry right now.</p>

      <DailyGratitudePracticeBuilder />

      {/* ── Section 4 ── */}
      <h3 id="benefits">4. Emotional Wellbeing Benefits — What the Research Shows</h3>

      <p><strong>Reduced depression and anxiety symptoms.</strong> A meta-analysis by Wood and colleagues (2010) examining 26 studies across different gratitude measures and wellbeing outcomes found significant negative correlations between gratitude and depression, anxiety, and loneliness across all measures. Research by Toepfer and colleagues found that gratitude letters produced significant reductions in depression symptoms compared to control conditions, with effects persisting at 4-week follow-up. For students whose depression and anxiety risk is heightened by academic pressure and social comparison, these findings establish gratitude practice as a meaningful protective factor with demonstrated clinical relevance.</p>

      <p><strong>Improved sleep quality and duration.</strong> Wood et al. (2009) found that higher trait gratitude was associated with pre-sleep positive cognitions (thinking grateful thoughts before sleeping), which in turn predicted better sleep quality and duration. The mechanism: pre-sleep gratitude journalling reduces cognitive arousal by providing a positive attentional focus that competes with the anxious rumination that delays sleep onset. Research by Digdon and Koble confirmed that sleep quality improvements from gratitude practice were specifically mediated through reduced dysfunctional thoughts at bedtime. For students whose sleep is chronically disrupted by pre-sleep academic anxiety, this mechanism is directly relevant and practically applicable.</p>

      <p><strong>Increased resilience and post-difficulty recovery.</strong> Research by Fredrickson and colleagues on the role of positive emotions in adversity recovery found that people who experienced more positive emotions — including gratitude — during and after difficult events showed faster cardiovascular recovery and reported less depression at follow-up. Emmons' research on gratitude in adversity specifically found that people who maintained gratitude practices during genuine difficulties reported higher levels of positive affect without lower levels of negative affect — supporting the both/and model rather than the false dichotomy between gratitude and genuine difficulty acknowledgment.</p>

      <p><strong>Stronger relationships and social connection.</strong> Research by Algoe and colleagues on gratitude in close relationships documents the "find-remind-bind" mechanism: expressions of gratitude find something genuinely positive about another person, remind both parties of the value of the relationship, and bind them more closely through the shared positive experience. Longitudinal studies show that relationship quality improvements produced by gratitude expression persist over time and produce the social support buffers that research consistently identifies as among the strongest available protectors against psychological distress under pressure.</p>

      <p><strong>Academic benefits — motivation and learning.</strong> Research by Froh and colleagues on gratitude in educational settings found that students who practised gratitude journalling showed increased positive affect, decreased negative affect, and greater satisfaction with school experience — all of which are associated with better engagement, greater persistence under difficulty, and improved learning outcomes. The broaden-and-build mechanism specifically relevant to academic learning: gratitude's broadening of cognitive scope produces more flexible, creative, and connected thinking — the cognitive mode that produces insight and deep learning, as opposed to the narrow, threat-focused cognitive mode that anxiety and pressure produce.</p>

      {/* ── Section 5 ── */}
      <h3 id="habits">5. Habit-Building Tips That Make Gratitude Stick</h3>

      <p><strong>Tip 1: Anchor to an existing behaviour — not a new time slot.</strong> The most common reason gratitude practices do not persist is the same as for any new habit: they require a new time slot that must be actively protected against the competing demands of daily life. Anchoring the practice to an existing behaviour — waking up (before phone), a daily meal, the transition to study, or lying down to sleep — removes this protection requirement. The existing behaviour acts as the automatic cue; the practice becomes its follow-up within two to three weeks of consistent pairing.</p>

      <p><strong>Tip 2: Specificity over volume — three genuine beats ten generic.</strong> Research by Lyubomirsky and colleagues on optimal gratitude frequency found that the benefits of gratitude journalling are determined by the thoughtfulness of the entries, not their volume. Three genuinely specific, mindfully attended appreciations produce more measurable wellbeing benefit than ten generic items completed quickly. The temptation to build a long list — particularly when the practice is going well and items feel easy to generate — often produces less genuine engagement than a shorter, slower, more deliberate practice. Three well-attended appreciations per session is the evidence-backed optimal starting structure.</p>

      <p><strong>Tip 3: Vary the practice to prevent adaptation.</strong> Research by Lyubomirsky and colleagues found that gratitude journalling produced diminishing returns when practised with identical format at identical frequency over extended periods — but not when varied. The same psychological mechanism (hedonic adaptation) that reduces the perceived value of positive circumstances also reduces the benefit of identical positive practices. Varying the exercise type (the specific three one day, the subtraction exercise another, a gratitude letter once a week), the objects of appreciation (people, experiences, capabilities, circumstances, small sensory pleasures), and the format (writing, speaking, reflecting, sensing) maintains the genuine attentional engagement that adaptation would otherwise reduce.</p>

      <p><strong>Tip 4: Protect from forced positivity contamination.</strong> The most significant threat to a genuine gratitude practice is the performance anxiety that "I should be feeling grateful" produces. This anxiety converts the practice from genuine appreciation to social performance of positivity — which produces none of the benefits of genuine gratitude and adds the psychological cost of inauthenticity. Protecting the practice from this requires a clear internal contract: this practice is for honest noticing of what is genuinely appreciable, nothing more. On days when nothing feels genuinely appreciable, writing "today I am grateful that this day is over and tomorrow is new" is more honest and more beneficial than manufacturing positive feelings that are not present.</p>

      <p><strong>Tip 5: Track the practice, not the feelings.</strong> Evaluating gratitude practice by whether any single session produces positive feelings is both inaccurate (benefits accumulate across sessions, not within them) and counterproductive (it introduces performance pressure that undermines genuine appreciation). The habit tracking that is most useful is behavioural: "Did I practise today? Yes or no." A simple tick-box for daily practice, maintained consistently for two weeks, provides the completion-streak data that motivates consistency more reliably than quality assessments. After two weeks, assess the practice by looking at daily life changes — stress response, sleep quality, relationship warmth — not by evaluating the quality of individual sessions.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Mindful Gratitude Practice FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I feel fake or performative when I try gratitude practice. How do I make it genuine?</strong><br />
        A: The fakeness feeling typically comes from one of two sources: either the practice is being performed for an imagined audience (even writing in a private journal can feel performative if the underlying orientation is "showing I am doing this correctly"), or the objects of gratitude are too abstract or too large to produce genuine feeling. The remedies: write as if no one will ever read it — use different language if the usual language feels performative, use less complete sentences, be more specific about what you actually feel. And go smaller: genuine appreciation for something specific and small — "the way the fan sounds right now, which is for some reason exactly the right sound for this moment" — produces more genuine feeling than "I am grateful for my health and education." The smaller and more specific, the more genuine.</p>

        <p><strong>Q: Can gratitude practice genuinely help during genuinely terrible periods — not just ordinary difficulty?</strong><br />
        A: Research by Emmons on gratitude in adversity specifically addresses this, and the answer is yes — with important qualification. During genuinely terrible periods, the gratitude practice that is most beneficial is not the standard "three good things" format but the more honest difficulty-inclusive or prospective format: acknowledging the full weight of the difficulty explicitly while genuinely noticing what is also present. Forced positive reframing during genuine distress is counterproductive and emotionally dishonest. Genuine appreciation of small, specific things coexisting with genuine distress is both honest and measurably beneficial. If you are in genuine crisis, gratitude practice is a support tool, not a primary treatment — and it works best alongside, not instead of, genuine support from other people or professionals.</p>

        <p><strong>Q: My life genuinely does not have much to be grateful for right now. Is gratitude practice still valid?</strong><br />
        A: Yes — and the research on gratitude in genuinely difficult circumstances is some of the most compelling in the field. People who practise gratitude during objectively difficult periods show better recovery, not because gratitude denies the difficulty but because it maintains the attentional flexibility that difficulty narrows. Even in genuinely limited circumstances, the subtraction exercise (imagining the absence of what is present) and the sensory noticing practice (attending fully to small sensory pleasures that would otherwise be invisible) produce genuine appreciation without requiring circumstances to be other than they are. The practice is not "my life is good." It is "this specific small thing is genuinely present and genuinely appreciated right now." That is achievable in almost any circumstances.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: GOLD9, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Gratitude is not the pretence that everything is fine. It is the honest noticing that even alongside what is hard, something is genuinely good."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Practice Builder above to find your practice. Write your first specific appreciation in the text box it provides. That one sentence, written honestly, is a complete gratitude practice. Repeat it tomorrow — and the day after. The change that researchers document is real, and it is available to you, beginning now.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: GOLD9, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${GBORD9}` }}
          >
            Continue in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: GOLD9, border: `2px solid ${GOLD9}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What You Are Grateful For
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/daily-mindfulness-practice',     '→ How to Practice Mindfulness Daily for Better Mental Health'],
            ['/blog/build-self-awareness',           '→ How to Build Self-Awareness in Daily Life'],
            ['/blog/mindfulness-reduce-anxiety',     '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/benefits-of-mindfulness',        '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/blog/self-acceptance-confidence',     '→ How to Build Confidence Through Self-Acceptance'],
            ['/blog/stay-positive-academics',        '→ How to Stay Positive During Academic Challenges'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: GOLD9, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
