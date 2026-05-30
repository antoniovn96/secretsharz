import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build Self-Awareness in Daily Life",
  excerpt: "Self-awareness is not a personality type or a gift some people have — it is a skill that is built through specific practices applied consistently. Students with stronger self-awareness handle pressure better, make decisions they regret less, understand their own patterns before those patterns have caused significant damage, and have a clearer sense of who they are beyond what they achieve. This guide shows you how to build it.",
  category: "Mental Health",
  date: "12-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/build-self-awareness.jpg",
  tldr: "Self-awareness is the capacity to observe your own thoughts, emotions, behaviours, and patterns accurately and without excessive judgment. Research by Tasha Eurich identifies it as one of the rarest and most impactful psychological skills — and one of the most developable. This guide covers the science, seven self-awareness tips, journalling and reflection practices, emotional awareness exercises, real student examples, and an interactive Self-Awareness Journal Builder.",
  toc: [
    { id: "what-is",     title: "1. What Self-Awareness Actually Is — and Is Not",                   level: 3 },
    { id: "tips",        title: "2. Seven Practical Self-Awareness Tips for Daily Life",              level: 3 },
    { id: "builder",     title: "3. Interactive: The Self-Awareness Journal Builder",               level: 3 },
    { id: "journalling", title: "4. Journalling and Reflection Practices That Actually Work",        level: 3 },
    { id: "emotional",   title: "5. Emotional Awareness Practices",                                  level: 3 },
    { id: "faq",         title: "6. Self-Awareness FAQs",                                            level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-12T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "self-awareness tips, how to build self-awareness, self-awareness daily life, journaling self-awareness, emotional awareness practices, self-awareness students, self-reflection tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I build self-awareness in daily life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Self-awareness is built through three parallel practices: observation (noticing thoughts, emotions, and behaviours without immediate judgment), reflection (making sense of patterns across observations over time), and inquiry (asking honest questions about motivations, values, and patterns). The most accessible daily self-awareness practices are: a brief evening journal (three specific questions about the day), a morning emotion check-in (naming the current emotional state before any external input), and the regular practice of asking 'why' after any significant reaction, decision, or avoidance.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between self-awareness and self-consciousness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Self-consciousness is a form of heightened self-focused attention that is primarily concerned with how one appears to others — it produces anxiety, inhibition, and performance worry. Self-awareness is a broader, more neutral capacity to observe one's own internal states and patterns accurately — it produces insight, better decision-making, and more authentic behaviour. Research by Tasha Eurich identifies self-awareness as having two dimensions: internal self-awareness (accurate knowledge of one's own values, emotions, and patterns) and external self-awareness (accurate understanding of how one is perceived by others). Healthy self-awareness develops both; self-consciousness over-emphasises the external dimension.",
      },
    },
    {
      "@type": "Question",
      "name": "Does journalling really help with self-awareness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — with an important caveat. Research by James Pennebaker at the University of Texas shows that expressive writing about emotional experiences produces significant wellbeing improvements over two weeks of consistent practice. However, Tasha Eurich's research also shows that journalling can reinforce rumination if questions focus on 'why' (which tends toward explanation and justification) rather than 'what' (which produces insight without emotional amplification). Effective self-awareness journalling asks specific 'what' questions: 'What was I feeling when that happened?', 'What pattern does this repeat?', 'What do I need that I am not currently getting?' These produce insight; open-ended 'why did I feel this?' questions can produce circular self-criticism.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const SAGE8   = '#3A6B52';
const SPALE8  = '#EBF5EF';
const SBORD8  = 'rgba(58,107,82,0.22)';

// ── Journal Builder Data ───────────────────────────────────────────────────────
const AWARENESS_AREAS = [
  {
    key:       'patterns',
    icon:      '🔄',
    label:     'My patterns and habits',
    desc:      'Understanding recurring behaviours, responses, and tendencies',
    color:     '#2D6B45',
    bg:        '#E8F4EE',
    what:      'Patterns are the repeated scripts your behaviour follows — the procrastination that activates for specific subjects, the withdrawal that arrives after disappointing results, the self-criticism that runs after social interactions. Most patterns operate below conscious awareness until they are pointed out or until you look for them deliberately. Pattern awareness is the beginning of the capacity to change what needs changing and appreciate what is working.',
    prompts: [
      { q: 'What is one pattern in my behaviour that I have noticed repeatedly over the past month?', placeholder: 'Think about study habits, emotional reactions, relationship patterns, or daily routines...' },
      { q: 'In what situations does this pattern most reliably appear? What triggers it?', placeholder: 'Be specific about the context, the people, the type of demand...' },
      { q: 'What does this pattern give me or protect me from? What is its purpose?', placeholder: 'Most patterns exist for a reason — even unhelpful ones. What need does this serve?' },
      { q: 'What would I do differently if this pattern were not running automatically?', placeholder: 'Imagine the version of you who responds deliberately rather than automatically...' },
    ],
    example: 'Rohan noticed that he always procrastinated on Chemistry specifically but not on History. When he explored why, he found the Chemistry avoidance was protecting him from confronting that he did not understand the foundation concepts — which he had been hoping would resolve on their own. The awareness did not solve the problem but it meant he could address the actual cause rather than trying to force himself to sit with material he did not understand.',
    practice: 'For one week, keep a brief "pattern log" — one sentence each evening about any pattern you noticed that day. Not judged, just noted.',
  },
  {
    key:       'emotions',
    icon:      '💛',
    label:     'My emotional responses',
    desc:      'Understanding what I feel, when, and why — with accuracy',
    color:     '#C07800',
    bg:        '#FFF8E1',
    what:      'Emotional self-awareness is the capacity to accurately identify what you are feeling — specifically and honestly — at the time it is occurring rather than in retrospect. Research by Lisa Feldman Barrett shows that emotional granularity (the precision with which you can differentiate between emotional states) is directly correlated with psychological wellbeing, regulation capacity, and interpersonal effectiveness. Students who can distinguish between "anxious about this specific outcome" and "ashamed about my preparation approach" are able to address the actual experience; students who only have access to "I feel bad" are managing a vague, undifferentiated state.',
    prompts: [
      { q: 'What am I feeling right now, specifically? Try to name it beyond "stressed" or "fine."', placeholder: '"I feel..." — use the most specific emotion word available. Frustrated? Ashamed? Relieved? Hollow? Restless?' },
      { q: 'What happened today that produced the strongest emotional response — and what was the emotion, precisely?', placeholder: 'Be as specific as possible about both the event and the emotional name.' },
      { q: 'Is there an emotion I have been avoiding or pushing away today? What would it be if I let it surface?', placeholder: 'Often the emotion we least want to name is the most informative one.' },
      { q: 'What does this emotion tell me about what I need right now?', placeholder: 'Every emotion contains information about unmet needs. What is this one pointing toward?' },
    ],
    example: 'Ananya always described herself as "stressed" — during exams, after results, before presentations, when talking to her parents. When she started the emotional granularity practice of naming more specifically, she discovered that what she had been calling stress was usually one of three distinct things: anxiety about a specific uncertain outcome, shame about a perceived performance gap, or grief about time spent. The three states required three completely different responses — and the generic "stressed" had been preventing her from knowing which response was needed.',
    practice: 'Once per day, when you notice a strong feeling, write the emotion name as specifically as possible in a sentence: "Right now I feel [specific emotion] because [specific cause]." Build the vocabulary gradually.',
  },
  {
    key:       'values',
    icon:      '🧭',
    label:     'My values and what matters to me',
    desc:      'Clarifying what genuinely guides me versus what I have been told should guide me',
    color:     '#5B3A8B',
    bg:        '#F2EEF9',
    what:      'Values are the principles that make life feel meaningful — the things that, when honoured, produce a sense of integrity, and when violated, produce a specific discomfort. For many students, the stated values (high academic achievement, family approval, career success) are external — absorbed from environment and expectation rather than genuinely chosen. The gap between external and internal values is one of the primary sources of the specific exhaustion that makes students question whether the effort is worth it. Clarity about genuine internal values — what actually matters to you when no one is watching — produces the motivational fuel that external demands cannot sustain.',
    prompts: [
      { q: 'If no one would ever know the result, what would I choose to spend my time and energy on?', placeholder: 'Remove the external audience and see what remains...' },
      { q: 'What have I been pursuing because I genuinely want it — and what have I been pursuing because I feel I should?', placeholder: 'The distinction between want and should is often the most important self-awareness question available.' },
      { q: 'When in the past year have I felt most like myself — most genuine, most energised, most aligned?', placeholder: 'Be specific about the activity, context, and what made it feel genuine.' },
      { q: 'What would I need to change about my current life to bring it more into alignment with what genuinely matters to me?', placeholder: 'Not aspirationally — one specific, realistic thing.' },
    ],
    example: 'Priya had been preparing for medicine since Class 9. When she sat with the values questions honestly, she discovered that what she genuinely loved was the problem-solving dimension of sciences — but that she was studying towards medicine primarily because it was what her family expected and what she had always said publicly. This discovery did not resolve the question immediately, but it meant she could make decisions about her academic path from a place of genuine clarity rather than unexamined assumption.',
    practice: 'Write the answers to the "if no one would ever know" question privately, honestly, and without editing. Re-read what you wrote a week later. Notice what has changed or clarified.',
  },
  {
    key:       'strengths',
    icon:      '💪',
    label:     'My strengths and genuine capabilities',
    desc:      'Seeing what you are actually good at — not just what you achieve, but how you think and operate',
    color:     '#1A7272',
    bg:        '#EBF5F5',
    what:      'Most students have a clearer and more detailed map of their weaknesses than their strengths — a consequence of the academic system\'s emphasis on identifying and correcting deficits. Self-awareness of genuine strengths is not arrogance; it is accurate information about what you bring to situations that is genuinely valuable. Research by Martin Seligman on strengths-based positive psychology shows that identifying and deliberately using signature strengths in daily activities produces measurable wellbeing improvements. For students, strength awareness produces better decisions about how to approach difficult academic tasks, how to contribute in collaborative settings, and what kind of work will sustain genuine engagement over time.',
    prompts: [
      { q: 'What do I find easy that others seem to find genuinely difficult? What comes naturally to me?', placeholder: 'Think about how you think, how you approach problems, how you connect with people...' },
      { q: 'What do people come to me for — what do they trust me with or ask my help with?', placeholder: 'Others\' perceptions of your strengths are often more accurate than your own underestimation.' },
      { q: 'When in academic or personal life do I feel most competent and genuinely capable?', placeholder: 'Not where you perform best under pressure — where you feel genuinely in flow and able.' },
      { q: 'What strength do I have that I rarely acknowledge or give myself credit for?', placeholder: 'The strength you discount most readily is often the one most worth naming.' },
    ],
    example: 'Meera focused exclusively on her weaker subjects during revision and spent no time investing in what she was genuinely good at. Her strengths inventory revealed that she had unusual capacity for explaining complex ideas clearly and for making connections between different subjects. Once she acknowledged these, she started using teaching (explaining topics to herself as if to someone else) as a revision method — playing to the strength she had dismissed. Her retention and exam confidence improved significantly.',
    practice: 'Ask one trusted person: "What do you think I am genuinely good at that I might not fully see in myself?" Write their answer and sit with it without immediately deflecting.',
  },
  {
    key:       'needs',
    icon:      '🌿',
    label:     'My genuine needs',
    desc:      'Understanding what I actually need to function well — physically, emotionally, socially',
    color:     SAGE8,
    bg:        SPALE8,
    what:      'Genuine need awareness is one of the most practically impactful dimensions of self-awareness for students — because the gap between what students actually need to function well and what they give themselves is frequently enormous. Research by Deci and Ryan on self-determination theory identifies three universal psychological needs: autonomy (a sense of agency over one\'s own choices), competence (the experience of genuine growth and capability), and relatedness (authentic connection with others). When these needs are consistently unmet, motivation collapses regardless of how well other external conditions are arranged. Understanding your own specific version of these needs — what autonomy actually looks like for you, what restores your sense of competence, who provides genuine connection — is the beginning of being able to meet them.',
    prompts: [
      { q: 'What does my body need more of right now? (Sleep, movement, food, rest, physical care)', placeholder: 'Be honest rather than aspirational — what is actually missing or depleted?' },
      { q: 'What would restore my sense of agency or autonomy right now? What decision could I make for myself?', placeholder: 'When everything feels externally driven, reclaiming one autonomous choice matters...' },
      { q: 'What kind of connection do I need most right now — someone who listens, someone who challenges me, someone who just keeps me company?', placeholder: 'Social needs are specific. Generic "socialising" rarely meets the specific need present.' },
      { q: 'What have I been needing for a long time that I have not given myself permission to have?', placeholder: 'The need you have been deferring most consistently is often the most important one to name.' },
    ],
    example: 'Vikram ran on four to five hours of sleep during exam season for years, believing this was simply the price of adequate preparation. When he did a genuine needs audit, he discovered that the cognitive impairment from the sleep deficit was costing him more preparation time than the additional waking hours were providing. The need for sleep had been consistently subordinated to the pressure-driven belief that more hours awake meant better preparation. Naming the need and permitting it changed both his health and his academic performance simultaneously.',
    practice: 'Once this week, before making a plan or a decision, write: "What do I actually need right now?" before writing what you think you should do. Notice the gap.',
  },
];

const REFLECTION_DEPTH = [
  { key: 'surface',  icon: '🌊', label: 'Quick — I have 5 minutes' },
  { key: 'medium',   icon: '🌿', label: 'Moderate — I want to go deeper' },
  { key: 'deep',     icon: '🌳', label: 'Deep — I want to really sit with this' },
];

const DEPTH_GUIDANCE = {
  surface: {
    instruction: 'Choose one prompt and write for 3-4 minutes without stopping. Do not edit or reread while writing — just let it come. This is discovery writing, not presentation writing.',
    prompt_count: 1,
    tip: 'The five-minute version is most effective when done daily — the accumulation of brief honest observations across a week produces more self-knowledge than one long session per month.',
  },
  medium: {
    instruction: 'Work through two prompts, taking 5-7 minutes on each. Read what you wrote after the first before starting the second — often the first response reveals the real question.',
    prompt_count: 2,
    tip: 'The medium reflection works best when you pause between prompts and ask: "Is there something in what I just wrote that I want to examine more closely?"',
  },
  deep: {
    instruction: 'Take all four prompts across 20-30 minutes. Write the first answer, then reread it and note what surprised you or what you avoided. Use that as the opening for the next prompt.',
    prompt_count: 4,
    tip: 'Deep reflection is most valuable when done weekly rather than daily. The insights from a thorough once-weekly session often emerge gradually across the following week.',
  },
};

// ── Journal Builder Component ──────────────────────────────────────────────────
function SelfAwarenessJournalBuilder() {
  const [step,      setStep]      = useState(1);
  const [area,      setArea]      = useState(null);
  const [depth,     setDepth]     = useState(null);
  const [answers,   setAnswers]   = useState({});
  const [phase,     setPhase]     = useState('select'); // select | journal | complete
  const [showExamp, setShowExamp] = useState(false);

  const font     = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selArea  = AWARENESS_AREAS.find(a => a.key === area);
  const selDepth = REFLECTION_DEPTH.find(d => d.key === depth);
  const guidance = depth ? DEPTH_GUIDANCE[depth] : null;

  const activePrompts = selArea && guidance
    ? selArea.prompts.slice(0, guidance.prompt_count)
    : [];

  const answered = activePrompts.filter(p => (answers[p.q] || '').trim().length > 0).length;
  const allAnswered = answered === activePrompts.length && activePrompts.length > 0;

  const handleAnswer = (q, val) => setAnswers(prev => ({ ...prev, [q]: val }));
  const handleReset  = () => { setStep(1); setArea(null); setDepth(null); setAnswers({}); setPhase('select'); setShowExamp(false); };

  // ── SELECT PHASE ──────────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SAGE8 : 'var(--border)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
              Step 1 — Which dimension of self-awareness do you want to explore?
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Choose the area where you feel most unclear about yourself right now — or most curious.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {AWARENESS_AREAS.map(aa => {
                const isSel = area === aa.key;
                return (
                  <button key={aa.key} onClick={() => setArea(aa.key)} style={{
                    padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                    borderColor: isSel ? aa.color : 'var(--border)', background: isSel ? aa.bg : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    boxShadow: isSel ? `0 0 0 2px ${aa.color}25` : 'var(--shadow-sm)',
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{aa.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? aa.color : 'var(--ink)', marginBottom: '2px' }}>{aa.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.35 }}>{aa.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => { if (area) setStep(2); }} disabled={!area} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: area ? `linear-gradient(135deg, ${SAGE8}, #52976A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: area ? 'pointer' : 'not-allowed', fontFamily: font,
              boxShadow: area ? `0 6px 18px ${SBORD8}` : 'none',
            }}>Next →</button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
              Step 2 — How deep do you want to go today?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {REFLECTION_DEPTH.map(rd => {
                const isSel = depth === rd.key;
                return (
                  <button key={rd.key} onClick={() => setDepth(rd.key)} style={{
                    padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                    borderColor: isSel ? SAGE8 : 'var(--border)', background: isSel ? SPALE8 : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: isSel ? `0 0 0 2px ${SBORD8}` : 'none',
                  }}>
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{rd.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? SAGE8 : 'var(--ink)' }}>{rd.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
              <button onClick={() => { if (depth) { setStep(3); setAnswers({}); } }} disabled={!depth} style={{
                flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
                background: depth ? `linear-gradient(135deg, ${SAGE8}, #52976A)` : 'var(--border)',
                color: 'white', fontWeight: '700', fontSize: '15px',
                cursor: depth ? 'pointer' : 'not-allowed', fontFamily: font,
              }}>Next →</button>
            </div>
          </>
        )}

        {step === 3 && selArea && guidance && (
          <>
            <div style={{ background: `linear-gradient(135deg, ${selArea.color}, ${selArea.color}BB)`, borderRadius: '12px', padding: '18px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selArea.icon}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>{selArea.label}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{selDepth?.label} · {guidance.prompt_count} prompt{guidance.prompt_count > 1 ? 's' : ''}</div>
            </div>
            <div style={{ background: SPALE8, border: `1.5px solid ${SBORD8}`, borderRadius: '11px', padding: '12px 14px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: SAGE8, textTransform: 'uppercase', marginBottom: '4px' }}>📝 How to use these prompts</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{guidance.instruction}</p>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{selArea.what}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
              <button onClick={() => setPhase('journal')} style={{
                flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${SAGE8}, #52976A)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 18px ${SBORD8}`,
              }}>📓 Open the Journal →</button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── JOURNAL PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'journal' && selArea && guidance) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          {activePrompts.map((_, i) => {
            const isFilled = (answers[activePrompts[i].q] || '').trim().length > 0;
            return <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: isFilled ? selArea.color : 'var(--border)', transition: 'background 0.3s' }} />;
          })}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '22px' }}>{selArea.icon}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: selArea.color }}>{selArea.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{answered} of {activePrompts.length} prompts answered</div>
          </div>
        </div>

        {/* Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          {activePrompts.map((prompt, i) => {
            const val = answers[prompt.q] || '';
            const filled = val.trim().length > 0;
            return (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', border: `2px solid ${filled ? selArea.color : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: filled ? selArea.color : 'var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0, transition: 'background 0.2s' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--ink)', lineHeight: 1.6 }}>{prompt.q}</p>
                </div>
                <textarea
                  value={val}
                  onChange={e => handleAnswer(prompt.q, e.target.value)}
                  placeholder={prompt.placeholder}
                  rows={4}
                  style={{
                    width: '100%', padding: '11px 13px', borderRadius: '8px',
                    border: `1.5px solid ${filled ? selArea.color + '60' : 'var(--border)'}`,
                    fontFamily: font, fontSize: '13px', resize: 'vertical', outline: 'none',
                    background: filled ? `${selArea.color}06` : 'var(--sand)',
                    color: 'var(--ink)', lineHeight: 1.65, boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                />
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', textAlign: 'right' }}>
                  {val.length > 0 ? `${val.split(/\s+/).filter(Boolean).length} words` : 'Write freely — no word count to hit'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div style={{ background: SPALE8, border: `1px solid ${SBORD8}`, borderRadius: '10px', padding: '10px 13px', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: SAGE8 }}>💡 Tip: </span>
          <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{guidance.tip}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setPhase('select')} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (allAnswered) setPhase('complete'); }} disabled={!allAnswered} style={{
            flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
            background: allAnswered ? `linear-gradient(135deg, ${SAGE8}, #52976A)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: allAnswered ? 'pointer' : 'not-allowed', fontFamily: font,
          }}>Complete Reflection →</button>
        </div>
      </div>
    );
  }

  // ── COMPLETE PHASE ────────────────────────────────────────────────────────────
  if (phase === 'complete' && selArea && guidance) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${selArea.color}, ${selArea.color}BB)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            Reflection Complete
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>{selArea.label} · {selDepth?.label}</div>
        </div>

        {/* Answers summary */}
        {activePrompts.map((prompt, i) => {
          const val = answers[prompt.q] || '';
          if (!val.trim()) return null;
          return (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', border: `1.5px solid ${selArea.color}25`, borderLeft: `3px solid ${selArea.color}` }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: selArea.color, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Prompt {i + 1}</div>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{prompt.q}</p>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7 }}>{val}</p>
            </div>
          );
        })}

        {/* Student example toggle */}
        <div style={{ background: selArea.bg, border: `1.5px solid ${selArea.color}25`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
          <button onClick={() => setShowExamp(s => !s)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: selArea.color }}>👤 How a student explored this same dimension</div>
            <span style={{ color: selArea.color, fontSize: '14px' }}>{showExamp ? '▲' : '▼'}</span>
          </button>
          {showExamp && (
            <div style={{ padding: '0 14px 12px 14px', borderTop: `1px solid ${selArea.color}20` }}>
              <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{selArea.example}</p>
            </div>
          )}
        </div>

        {/* Practice */}
        <div style={{ background: SPALE8, border: `1.5px solid ${SBORD8}`, borderRadius: '11px', padding: '12px 14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: SAGE8, textTransform: 'uppercase', marginBottom: '4px' }}>📅 Daily Practice for This Dimension</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{selArea.practice}</p>
        </div>

        {/* Affirmation */}
        <div style={{ background: 'white', border: `1.5px dashed ${SBORD8}`, borderRadius: '12px', padding: '13px 17px', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: SAGE8, fontStyle: 'italic', lineHeight: 1.55 }}>
            "You just gave yourself the attention your patterns, emotions, values, strengths, or needs rarely receive. That is the beginning."
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => { setPhase('journal'); setAnswers({}); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `1.5px solid ${SBORD8}`, background: 'white', color: SAGE8, fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Edit Responses</button>
          <button onClick={handleReset} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${SAGE8}, #52976A)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>Explore a Different Dimension →</button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BuildSelfAwareness({ navigate, relatedPosts }) {
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
      <p>There is a particular kind of student confusion that comes not from not knowing the material but from not knowing themselves — why they procrastinate on one subject and not another, why they shut down after certain results, why certain relationships feel draining and others feel restorative, why the studying that should feel purposeful feels hollow. These are not academic problems. They are self-awareness problems.</p>

      <p><strong>Self-awareness</strong> is the capacity to observe yourself — your thoughts, emotions, patterns, values, and needs — accurately and without excessive distortion in either direction. Research by Tasha Eurich at the Eurich Group, involving over 5,000 participants, found that while 95% of people believe they are self-aware, only 10–15% actually are by measurable criteria. The gap is not a character failing — it is a skill deficit. And skill deficits are addressable.</p>

      <img
        src={meta.imgUrl}
        alt="Student building self-awareness in daily life — journalling, reflection practices, emotional awareness, and self-knowledge tools"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-is">1. What Self-Awareness Actually Is — and Is Not</h3>

      <p><strong>The two dimensions.</strong> Tasha Eurich's research distinguishes between internal self-awareness and external self-awareness. Internal self-awareness is knowing yourself from the inside: your values, emotions, patterns, strengths, limitations, and genuine needs. External self-awareness is knowing how you are perceived from the outside: how others experience your behaviour, communication, and presence. The two are largely independent — some people are high on one and low on the other — and both contribute to the overall self-awareness that improves decision-making, relationship quality, and emotional regulation.</p>

      <p><strong>What it is not.</strong> Self-awareness is not the same as self-consciousness (anxious attention to how you appear to others). It is not the same as self-criticism (judging what you observe). It is not the same as introspection (which Eurich's research shows often produces rationalisations rather than genuine insight, particularly when people ask "why" rather than "what"). And it is not a fixed personality trait that some people have and others do not — it is a capacity that varies across domains (a student might be highly self-aware about their study patterns and completely unaware of their emotional patterns) and that develops through deliberate practice.</p>

      <p><strong>Why it matters for students specifically.</strong> Self-awareness has three direct academic and wellbeing benefits. First, it improves decision-making quality — the student who understands their own procrastination pattern can address its actual cause rather than applying generic study-discipline solutions that do not fit their specific situation. Second, it improves emotional regulation — you cannot regulate emotional states you cannot accurately identify; self-awareness is the prerequisite for regulation. Third, it protects identity under academic pressure — the student who knows who they are beyond their results is less devastated by any particular result. The academic result tells them something; it does not tell them everything.</p>

      {/* ── Section 2 ── */}
      <h3 id="tips">2. Seven Practical Self-Awareness Tips for Daily Life</h3>

      <p><strong>Tip 1: Ask "what" rather than "why."</strong> Tasha Eurich's research identifies a counterintuitive finding about introspection: asking "why do I feel this?" tends to produce post-hoc rationalisations and increased rumination — not genuine insight. Asking "what am I feeling?" produces accurate observation; "what triggered this reaction?" produces useful information about patterns; "what do I need right now?" produces actionable self-knowledge. The shift from "why" to "what" is the single most important self-awareness questioning technique available.</p>

      <p><strong>Tip 2: Build a consistent reflection window.</strong> Self-awareness requires dedicated time for observation — a window each day or week where the primary activity is noticing rather than doing. Most students' days contain no such window; they move from input to output continuously with no space between for the observation that produces self-knowledge. Five minutes of evening reflection — three "what" questions answered honestly — produces more self-awareness across a month than occasional intensive introspection.</p>

      <p><strong>Tip 3: Use contrast as a self-awareness tool.</strong> You often learn most about yourself by noticing differences in your own experience — why you respond differently to two similar situations, why a certain type of person consistently activates a certain reaction, why some kinds of work feel energising and others feel depleting even when both are going well. The contrast — "I respond to this situation this way and that situation that way — what does this tell me about me?" — reveals pattern information that flat observation of a single situation does not.</p>

      <p><strong>Tip 4: Ask for external perspectives carefully.</strong> External self-awareness (how you are perceived by others) is impossible to develop from internal reflection alone. Research by Eurich on seeking feedback shows that the most useful external information comes from people who care about you, know you in multiple contexts, and will tell you genuinely difficult things if needed — not people who only validate. The question to ask: "What is one thing I do consistently that I might not be fully aware of?" is more productive than "what do you think of me?"</p>

      <p><strong>Tip 5: Notice your body as a self-awareness instrument.</strong> Research on somatic markers (Damasio) and interoception (Garfinkel) shows that the body provides continuous, accurate information about emotional states before conscious awareness catches up. Developing the habit of body awareness — noticing where you hold tension, what your breathing is doing, what the gut is signalling — provides an earlier and more accurate read on your emotional state than the cognitive processing that typically follows well after.</p>

      <p><strong>Tip 6: Track patterns across time, not just moments.</strong> Single observations provide limited self-awareness; patterns across observations produce genuine insight. Keeping a brief daily log — not an elaborate journal, a one-sentence observation — and reviewing it weekly reveals the recurrences that single-day reflection misses. The pattern that appears in retrospect across seven days is often invisible within any individual day.</p>

      <p><strong>Tip 7: Test your self-knowledge against your behaviour.</strong> The most common self-awareness illusion is the discrepancy between self-concept and behaviour — believing "I am disciplined" while consistently procrastinating, believing "I am not anxious" while displaying all the physiological signs of chronic anxiety. Testing self-concept against actual, observable behaviour is the most reliable available self-awareness check. Not to produce self-criticism, but to produce accurate information: "My behaviour suggests something different from my self-concept here — which one is more accurate, and what does the gap tell me?"</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Self-Awareness Journal Builder</h3>
      <p>The Journal Builder helps you explore one dimension of self-awareness — patterns, emotions, values, strengths, or needs — at the depth that fits your current time and energy. Choose your area, choose your depth (5 minutes, moderate, or deep), and write honestly through the prompts. Your answers build your reflection; the example shows how a student explored the same territory.</p>

      <SelfAwarenessJournalBuilder />

      {/* ── Section 4 ── */}
      <h3 id="journalling">4. Journalling and Reflection Practices That Actually Work</h3>

      <p><strong>The evening three-question review.</strong> The most consistently effective self-awareness journalling practice is the briefest: three specific questions answered honestly each evening in five minutes or less. These three questions cover the emotional, the observational, and the forward-looking dimensions of daily self-knowledge:</p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>What did I feel most strongly today — and what specifically caused it?</strong> (Builds emotional awareness and pattern recognition)</li>
        <li><strong>What did I do today that felt most like myself — and what felt least like myself?</strong> (Builds values and identity clarity)</li>
        <li><strong>What is one thing I noticed about my own behaviour today that I want to remember?</strong> (Builds pattern awareness)</li>
      </ul>
      <p>These three questions, answered daily for two weeks, produce more genuine self-knowledge than most students have accumulated in years of passive experience.</p>

      <p><strong>The weekly pattern review.</strong> Once per week — Sunday evening works naturally — read the previous seven days of journal entries and write one paragraph answering: "What patterns do I see across this week that I would not have seen on any single day?" The pattern level of observation is where the most significant self-awareness lives, and it is only accessible from a weekly perspective.</p>

      <p><strong>The unsent letter practice.</strong> For difficult emotional experiences — a conflict with a teacher, a disappointing result, a difficult family interaction — write an unsent letter to the person or situation involved. Not to send, to understand. The letter format gives emotional expression enough structure to be coherent without requiring the politeness that prevents honesty. After writing, read the letter and ask: "What does this tell me about what I need or what I value?"</p>

      <p><strong>The "what I am avoiding" prompt.</strong> One of the most revealing self-awareness prompts is also the most uncomfortable: "What am I avoiding right now, and what does the avoidance protect me from?" Avoidance is never random — it is always protecting something (from the fear that confronting a difficult topic might confirm a feared truth, from the discomfort of a difficult conversation, from the anxiety of uncertainty). The thing being avoided almost always contains the most important self-knowledge of the moment.</p>

      <p><strong>The strength evidence log.</strong> Counter-intuitively, students with high self-criticism often have the lowest self-awareness — because the critical lens filters out evidence that contradicts the negative self-concept. Keeping a "strength evidence log" — a running list of specific moments where a genuine capability, quality, or value was demonstrated — builds the accurate, evidence-based self-concept that self-criticism prevents. The practice is not positivity; it is accuracy.</p>

      {/* ── Section 5 ── */}
      <h3 id="emotional">5. Emotional Awareness Practices</h3>

      <p><strong>The emotion naming practice — granularity training.</strong> Research by Lisa Feldman Barrett shows that the precision with which you can name your emotional states (emotional granularity) directly correlates with regulation capacity, wellbeing, and even physical health outcomes. The granularity practice: whenever you notice any emotional state, challenge yourself to name it more specifically than the generic label. "Stressed" becomes "anxious about a specific uncertain outcome." "Upset" becomes "embarrassed about what I said in class." "Fine" becomes "mildly restless and slightly disconnected." The more specific the name, the more addressable the state.</p>

      <p><strong>The emotion-body location practice.</strong> After naming an emotion, locate it in the body: where do you feel this emotion physically? Research by Nummenmaa confirms consistent emotion-body topographies across cultures — anxiety in the chest and upper body, sadness in the throat and chest, anger in the upper body and arms. Building your personal emotion-body map by noting, over a week, where different emotions reliably appear in your body gives you a body-based early warning system that precedes conscious emotional awareness.</p>

      <p><strong>The secondary emotion question.</strong> Many of the emotions we experience most strongly are secondary — high-energy states that protect against a more vulnerable primary one. Anger often protects against hurt or fear. Dismissiveness often protects against disappointment. Cheerfulness sometimes protects against grief. Asking "what would I be feeling if the [secondary emotion] were gone?" reveals the primary emotion underneath — which is almost always the one that contains the most self-knowledge and the most genuine need for attention.</p>

      <p><strong>The end-of-day emotional weather report.</strong> Before sleeping, name the dominant emotional weather of the day in one weather metaphor: "Today was overcast with intermittent brightness." "Today was a full storm that cleared by evening." "Today was unseasonably calm." The metaphor format is both less clinical than naming emotions directly and often more revealing — the weather image captures the overall quality and arc of the emotional day in a way that specific emotion names sometimes miss. Review your weather reports weekly to see seasonal patterns in your emotional life.</p>

      <p><strong>Student examples of emotional awareness building:</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li>Ishaan always said he was "fine" after disappointing results. When he started the granularity practice, he discovered the feeling was actually closer to "the specific shame of not meeting my own standard, underneath which is the fear that the standard might be impossible." The precision changed what he needed: not to be told the result was fine, but for the standard to be examined honestly.</li>
        <li>Meera noticed through the body location practice that she always felt a tightening in her throat before family conversations about academic results. She eventually identified this as suppressed speech — things she genuinely wanted to say that she was swallowing. The body signal was the first honest information she had about what she actually needed from those conversations.</li>
        <li>Priya used the secondary emotion question after noticing she became dismissive and sarcastic when friends talked about struggling with coursework she found easy. Underneath the dismissiveness: the fear that her own struggles were more significant than theirs, and the discomfort of that comparison. The sarcasm had been protecting her from an uncomfortable self-awareness she had not been ready to access directly.</li>
      </ul>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Self-Awareness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Every time I try to be more self-aware I end up being more self-critical. How do I build self-awareness without it becoming self-punishment?</strong><br />
        A: This is the most common barrier to self-awareness development, and it has a specific solution: the stance of observation rather than judgment. The self-awareness observer's task is to notice and describe — "I notice I tend to avoid this subject when I am anxious about my understanding of it" — not to evaluate — "I am weak for avoiding this." The noticing is the self-awareness; the judgment is an addition to it that is both optional and counterproductive. A practical technique: when a self-critical thought arrives during reflection, note it as a thought ("I notice I am being self-critical about this") and return to the observational question. Over time, the habit of observation without judgment develops; it does not arrive automatically but it is trainable.</p>

        <p><strong>Q: I think I know myself pretty well. Is there evidence that most people actually do not know themselves as well as they think?</strong><br />
        A: Yes, substantial evidence. Eurich's research showing that 95% of people believe they are self-aware while only 10-15% are by objective criteria is the headline finding, but there is supporting evidence across multiple domains: research by Timothy Wilson at Virginia on introspective accuracy shows that people's stated reasons for their own behaviour are frequently inaccurate post-hoc rationalisations; research on the Dunning-Kruger effect shows systematic overestimation of competence in domains of limited ability; and research on the fundamental attribution error shows consistent blind spots in understanding one's own situational influences. None of this is cause for existential alarm — it is simply accurate information about a universal human condition. The appropriate response is genuine curiosity rather than defensive certainty.</p>

        <p><strong>Q: How is self-awareness different from overthinking?</strong><br />
        A: They feel similar but produce opposite outcomes. Overthinking is recursive and circular — the same content cycling without new information or movement toward insight. Self-awareness practice is specific and purposeful — a "what" question that produces a specific observation, which produces a specific insight, which produces a specific understanding or action. The test is whether the reflection is moving or cycling: self-awareness produces movement (new understanding, new information, changed perspective); overthinking produces the same content at increasing intensity without movement. If a reflection practice is producing more distress and less insight across sessions, it has shifted from self-awareness into rumination and needs reorientation toward more specific, present-moment observations rather than recursive "why" questions.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SAGE8, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The student who knows themselves is harder to destabilise — by results, by pressure, by comparison — because their sense of who they are is not entirely dependent on any of those things."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Self-awareness is not a destination. It is an ongoing practice of honest observation applied to the ongoing experience of being yourself. The Journal Builder above is one session of that practice. The evening three questions is a daily continuation of it. Begin where you are. There is no other starting point available — and wherever you are is exactly right.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SAGE8, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD8}` }}
          >
            Reflect in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SAGE8, border: `2px solid ${SAGE8}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What You Discovered
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/control-thoughts-emotions',      '→ How to Control Your Thoughts and Emotions Naturally'],
            ['/blog/body-awareness-mental-health',   '→ Body Awareness and Its Role in Mental Health'],
            ['/blog/daily-mindfulness-practice',     '→ How to Practice Mindfulness Daily for Better Mental Health'],
            ['/blog/stay-present-stop-overthinking', '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/relationship-with-yourself',     '→ How to Build a Better Relationship With Yourself'],
            ['/blog/self-acceptance-confidence',     '→ How to Build Confidence Through Self-Acceptance'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SAGE8, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
