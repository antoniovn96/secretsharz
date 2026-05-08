import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Emotional Boundaries: What They Are and How to Set Them",
  excerpt: "Emotional boundaries are not walls — they are the honest signals you send about where your feelings end and someone else's begin. Learn the psychology behind why boundaries feel so difficult, understand the six types every student needs, and use our Boundary Builder to get a personalised script for the boundary you have been putting off.",
  category: "Mental Health",
  date: "24-02-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/February/emotional-boundaries.jpg",
  tldr: "Emotional boundaries are one of the most important and least taught mental health skills in student life. Most people either have no boundaries (and feel chronically drained) or walls (and feel chronically isolated). This guide defines the six types of emotional boundaries, explains why they are so difficult to set, gives practical steps for each type, and includes an interactive Boundary Builder that generates a real script for the specific boundary situation you are facing.",
  toc: [
    { id: "what-they-are", title: "1. What Emotional Boundaries Actually Are — and Are Not",        level: 3 },
    { id: "six-types",     title: "2. The Six Types of Emotional Boundaries Students Need",          level: 3 },
    { id: "builder",       title: "3. Interactive: The Boundary Builder",                            level: 3 },
    { id: "why-hard",      title: "4. Why Setting Boundaries Feels So Hard (The Psychology)",        level: 3 },
    { id: "steps",         title: "5. Practical Steps to Set and Maintain Emotional Boundaries",     level: 3 },
    { id: "faq",           title: "6. Emotional Boundaries FAQs",                                    level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-24T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "emotional boundaries, how to set emotional boundaries, types of emotional boundaries, emotional boundaries in relationships, setting boundaries students, what are emotional boundaries, boundary setting tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are emotional boundaries and why do they matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Emotional boundaries are the internal and expressed limits you maintain around your emotional life — what you take on, what you allow, and how you let others' feelings and behaviour affect you. They matter because without them, you become responsible for managing everyone else's emotions while neglecting your own, leading to chronic depletion, resentment, anxiety, and the gradual erosion of your sense of self.",
      },
    },
    {
      "@type": "Question",
      "name": "How do you set emotional boundaries with someone you love?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Setting emotional boundaries with people you love requires separating your care for the person from your willingness to accept any specific behaviour or dynamic. The most effective approach uses: a specific observation rather than a character judgement, an honest impact statement, and a clear request. The boundary is about the behaviour, not the person — which makes it possible to hold both the love and the limit simultaneously.",
      },
    },
    {
      "@type": "Question",
      "name": "Is setting boundaries selfish?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Selfishness is caring only for yourself at the expense of others. Boundaries define what you will and will not participate in without requiring others to neglect themselves. Research consistently shows that people with healthy boundaries are actually more generous and sustainably caring toward others than those without them, precisely because they are not operating from chronic depletion.",
      },
    },
  ],
};

const WINE    = '#7B2D5E';
const WPALE   = '#F7EFF4';
const WBORDER = 'rgba(123,45,94,0.22)';

const BOUNDARY_TYPES = [
  {
    key:   'emotional_labour',
    icon:  '🫂',
    label: 'Emotional Labour Boundary',
    desc:  'Being expected to manage, absorb, or fix other people\'s emotions consistently',
    why_it_matters: 'Without this boundary, you become a free emotional regulation service — available on demand, expected to absorb and neutralise others\' distress at the cost of your own stability. Over time this produces what psychologists call compassion fatigue: the depletion of empathic capacity through sustained, one-directional emotional giving.',
    scripts: {
      friend:    '"I care about you and I am not in a place to hold this right now. Can we talk tomorrow when I have more space?"',
      family:    '"I hear that you\'re upset and I\'m not able to take this on right now. I need some time before we continue this conversation."',
      romantic:  '"I want to support you and I also have a limit tonight. Give me an hour to reset and then I\'m here."',
      classmate: '"I\'m not the right person to help with this today — I genuinely don\'t have the bandwidth. Is there someone else who might?"',
      online:    '"I\'m going to step away from this conversation for today — it\'s affecting me more than I can manage right now."',
    },
    steps: [
      'Identify the specific pattern — not "they are too much" but "they call me after midnight with crises three times a week and I feel responsible for resolving them."',
      'Set the boundary at the behaviour level, not the relationship level. You are limiting a specific dynamic, not the whole connection.',
      'Use the structure: "I care about you AND I cannot [specific behaviour]. What I can offer is [specific alternative]."',
    ],
  },
  {
    key:   'mental_space',
    icon:  '🧠',
    label: 'Mental Space Boundary',
    desc:  'Protecting your cognitive and psychological space from others\' constant demands',
    why_it_matters: 'Cognitive resources are finite. When your mental space is consistently occupied by other people\'s problems and demands, there is measurably less capacity left for your own thinking, learning, and decision-making. Research on cognitive load shows that even the anticipation of interruption reduces focused work quality by up to 40%.',
    scripts: {
      friend:    '"I am in study mode until 7pm. I will respond after that — not ignoring you, just protecting this time."',
      family:    '"I need two hours of uninterrupted time right now. I\'ll be available properly after that."',
      romantic:  '"I need some quiet mental space tonight — no big conversations. I\'m not pulling away, I just need to decompress."',
      classmate: '"I keep this time as focus time — I\'ll engage with group messages in the evening, not during the day."',
      online:    '"I have notifications off during study hours — this is a boundary I keep for my own functioning."',
    },
    steps: [
      'Define your protected times specifically — not "I need quiet sometimes" but "9am to 1pm on weekdays is focus time."',
      'Communicate them proactively rather than reactively. Setting the expectation before a violation prevents the friction of correcting one.',
      'Honour them yourself first. Mental space boundaries fail when you are the one who breaks them — checking messages during focus time undermines the whole structure.',
    ],
  },
  {
    key:   'emotional_disclosure',
    icon:  '🔒',
    label: 'Emotional Disclosure Boundary',
    desc:  'Managing what you share about your inner life, with whom, and when',
    why_it_matters: 'Psychological safety — the felt sense that your vulnerability will not be weaponised or dismissed — is the prerequisite for genuine emotional disclosure. Sharing your inner life with people who have not demonstrated they can hold it safely does not produce intimacy. It produces exposure and eventual withdrawal.',
    scripts: {
      friend:    '"I\'m not ready to talk about this yet — I\'ll share when I have processed it more."',
      family:    '"That\'s something I\'m keeping private for now. I\'ll let you know if that changes."',
      romantic:  '"I need more time before I can share this honestly — give me space to find the right words."',
      classmate: '"That\'s personal — I\'m going to keep it to myself."',
      online:    '"I don\'t share that publicly — it\'s a private thing for me."',
    },
    steps: [
      'Distinguish between people who have earned access to your vulnerability and those who are simply asking for it. Access is earned through demonstrated trustworthiness, not through persistence or proximity.',
      'Practise the short, complete response: "I\'m keeping that private." No elaboration required. The urge to justify is the people-pleasing impulse — not an obligation.',
      'Review who currently has full access to your emotional life. If the answer produces discomfort, that is information about where disclosure boundaries need strengthening.',
    ],
  },
  {
    key:   'responsibility',
    icon:  '⚖️',
    label: 'Emotional Responsibility Boundary',
    desc:  'Being clear about which feelings are yours to manage and which belong to others',
    why_it_matters: 'You are responsible for your own emotional responses. You are not responsible for other people\'s. Conflating these two — a pattern psychologists call emotional enmeshment — produces chronic guilt, hypervigilance about others\' emotional states, and the complete subordination of your own needs to the management of theirs.',
    scripts: {
      friend:    '"I hear that you\'re upset. I\'ve looked at my role and I don\'t think this one is mine to apologise for."',
      family:    '"I understand this is painful for you. Your feelings are real, and I am not the cause of them in the way you are describing."',
      romantic:  '"I care about your feelings. This is something I need to stand by — and I\'m sorry it hurts, but I can\'t take responsibility for a decision that was right for me."',
      classmate: '"I\'m not going to take responsibility for the group\'s dynamic — that\'s a shared thing, not mine alone to fix."',
      online:    '"Your reaction is yours to manage. I said what I said and I stand by it."',
    },
    steps: [
      'When you feel guilt, run the simple test: "Did I actually do something that violated my values or caused genuine harm?" If yes — apologise. If no — the guilt is someone else\'s emotion absorbed as though it were your own.',
      'Stop apologising as social lubricant. "Sorry" used to smooth friction rather than acknowledge genuine wrongdoing trains everyone that your feelings yield to others\' comfort by default.',
      'Name the distinction explicitly: "Your being upset is real and it is not evidence that I did something wrong."',
    ],
  },
  {
    key:   'time_energy',
    icon:  '⏰',
    label: 'Time and Energy Boundary',
    desc:  'Protecting your time and emotional energy from being claimed without your genuine consent',
    why_it_matters: 'Time and energy are genuinely finite. Every commitment you make is made at the expense of something else — including recovery, self-directed activity, and genuine rest. Research on decision fatigue shows that emotional regulation and relational presence all degrade as available energy depletes. Protecting your energy is resource management.',
    scripts: {
      friend:    '"I\'m not available this week — I have been over-committed and I need this time for recovery."',
      family:    '"I can give you an hour on Saturday. After that I need the rest of the day for myself."',
      romantic:  '"I need tonight to myself — I haven\'t had unstructured time in two weeks and I can feel the depletion. I\'ll be more present tomorrow because of it."',
      classmate: '"I\'m at capacity for extra commitments right now — ask me again in two weeks."',
      online:    '"I don\'t have the bandwidth to engage with this right now — I\'ll come back to it when I do."',
    },
    steps: [
      'Track where your time and energy actually go for one week — not where you intend them to go. The gap between intended and actual reveals the boundaries that need to be set.',
      'Identify your two highest-priority non-negotiable time blocks for this week and protect them before anything else is scheduled.',
      'Say no to the next request that does not align with your actual capacity — before you have time to talk yourself into saying yes.',
    ],
  },
  {
    key:   'conversation',
    icon:  '💬',
    label: 'Conversational Boundary',
    desc:  'Limiting the topics, tone, and dynamics you will engage with in conversations',
    why_it_matters: 'Conversations are not neutral — they shape mood, drain energy, and over time influence how you think. Conversations that are consistently contemptuous, invasive, or designed to manipulate your self-perception are a genuine cognitive and emotional cost. You have the right to decline or redirect them.',
    scripts: {
      friend:    '"I\'m not going to keep going in circles on this — I\'ve said what I think. Let\'s talk about something else."',
      family:    '"I\'m not going to discuss that today. I\'m happy to talk about anything else."',
      romantic:  '"This conversation is going somewhere that\'s not useful for either of us. I need to stop here — can we revisit it tomorrow when we\'re calmer?"',
      classmate: '"I\'m not going to participate in this conversation about someone who isn\'t here to speak for themselves."',
      online:    '"I\'m not engaging with this thread — it\'s not a productive space for me."',
    },
    steps: [
      'Identify the three conversations or topics that most reliably drain or distress you. These are your primary conversational boundary areas.',
      'Develop a redirect phrase for each: "I\'m not going there today" / "Let\'s change the subject" / "I\'m going to step out of this one." Short, complete, non-negotiating.',
      'Exit consistently. The first few times you redirect or step out, there will be friction. Consistency is what turns the boundary from a one-time statement into a known and respected dynamic.',
    ],
  },
];

const RELATIONSHIP_TYPES = [
  { key: 'friend',    icon: '🤝', label: 'A close friend' },
  { key: 'family',    icon: '🏠', label: 'A family member' },
  { key: 'romantic',  icon: '💑', label: 'Romantic partner' },
  { key: 'classmate', icon: '📚', label: 'A classmate or peer' },
  { key: 'online',    icon: '📱', label: 'Online or social media' },
];

const CURRENT_STATE = [
  { key: 'nonexistent', icon: '🔴', label: 'It does not exist at all — I have never asserted it' },
  { key: 'broken',      icon: '🟠', label: 'I have tried to set it but it keeps getting crossed' },
  { key: 'partial',     icon: '🟡', label: 'I maintain it sometimes but cave under pressure' },
  { key: 'unclear',     icon: '🔵', label: 'I am not sure what the boundary should even look like yet' },
];

const STATE_CONTEXT = {
  nonexistent: 'You are starting from scratch — which means the first step is not a script but permission: you are allowed to have this boundary. It does not need to be earned or justified.',
  broken:      'This boundary keeps being crossed because it has not yet been communicated clearly enough, consistently enough, or with sufficient follow-through. The script below is the starting point — but it must be followed by consistent maintenance, not repeated re-stating.',
  partial:     'You know how to set this boundary but cave under pressure. The issue is not knowledge — it is discomfort tolerance when the guilt or friction arrives. The script and steps below address that specifically.',
  unclear:     'You sense something needs to change but have not yet named it precisely. The boundary type you chose gives you the framework. The script is a starting place you can adapt as you get clearer.',
};

function BoundaryBuilder() {
  const [step,       setStep]      = useState(1);
  const [boundType,  setBoundType] = useState(null);
  const [relType,    setRelType]   = useState(null);
  const [stateKey,   setStateKey]  = useState(null);
  const [revealed,   setRevealed]  = useState(false);
  const [openSteps,  setOpenSteps] = useState(false);

  const font  = "'Plus Jakarta Sans', system-ui, sans-serif";
  const bType = BOUNDARY_TYPES.find(b => b.key === boundType);
  const rType = RELATIONSHIP_TYPES.find(r => r.key === relType);
  const state = CURRENT_STATE.find(s => s.key === stateKey);
  const script = bType && relType ? bType.scripts[relType] : null;

  const handleReset = () => { setStep(1); setBoundType(null); setRelType(null); setStateKey(null); setRevealed(false); setOpenSteps(false); };

  const Opt = ({ selected, onClick, icon, label, sublabel }) => (
    <button onClick={onClick} style={{
      padding: '13px 16px', borderRadius: '12px', border: '2px solid',
      borderColor: selected ? WINE : 'var(--border)', background: selected ? WPALE : 'white',
      cursor: 'pointer', fontFamily: font, transition: 'all 0.15s', textAlign: 'left',
      display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%',
      boxShadow: selected ? `0 0 0 3px ${WBORDER}` : 'var(--shadow-sm)', marginBottom: '7px',
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '14px', fontWeight: selected ? '700' : '500', color: selected ? WINE : 'var(--ink)', lineHeight: 1.35 }}>{label}</div>
        {sublabel && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.4 }}>{sublabel}</div>}
      </div>
    </button>
  );

  const NextBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} disabled={!active} style={{
      width: '100%', padding: '14px', borderRadius: '10px', border: 'none', marginTop: '4px',
      background: active ? `linear-gradient(135deg, ${WINE}, #A03D7A)` : 'var(--border)',
      color: 'white', fontWeight: '700', fontSize: '15px',
      cursor: active ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
      boxShadow: active ? `0 6px 18px ${WBORDER}` : 'none',
    }}>{label}</button>
  );

  const BackBtn = ({ onClick }) => (
    <button onClick={onClick} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? WINE : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — Which type of boundary do you most need right now?</p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Choose the one with the most charge — the situation that has been making you feel drained or resentful.</p>
          {BOUNDARY_TYPES.map(bt => <Opt key={bt.key} icon={bt.icon} label={bt.label} sublabel={bt.desc} selected={boundType === bt.key} onClick={() => setBoundType(bt.key)} />)}
          <NextBtn active={!!boundType} onClick={() => { if (boundType) setStep(2); }} label="Next →" />
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — Who is this boundary with?</p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Choose the relationship context where this boundary is most needed.</p>
          {RELATIONSHIP_TYPES.map(rt => <Opt key={rt.key} icon={rt.icon} label={rt.label} selected={relType === rt.key} onClick={() => setRelType(rt.key)} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <BackBtn onClick={() => setStep(1)} />
            <button onClick={() => { if (relType) setStep(3); }} disabled={!relType} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: relType ? `linear-gradient(135deg, ${WINE}, #A03D7A)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: relType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s' }}>Next →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — What is the current state of this boundary?</p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Be honest — the plan you receive will be more useful if it is calibrated to where you actually are.</p>
          {CURRENT_STATE.map(s => <Opt key={s.key} icon={s.icon} label={s.label} selected={stateKey === s.key} onClick={() => setStateKey(s.key)} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <BackBtn onClick={() => setStep(2)} />
            <button onClick={() => { if (stateKey) { setStep(4); setRevealed(false); } }} disabled={!stateKey} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: stateKey ? `linear-gradient(135deg, ${WINE}, #A03D7A)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: stateKey ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s' }}>Build My Boundary Plan →</button>
          </div>
        </>
      )}

      {step === 4 && bType && rType && state && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 4 — Your Boundary Plan</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${WINE}, #A03D7A)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${WBORDER}`, transition: 'all 0.2s' }}>🔓 Reveal My Boundary Plan</button>
              <BackBtn onClick={() => setStep(3)} />
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {[bType.label, rType.label, state.label.slice(0, 38) + '…'].map((chip, i) => (
                  <span key={i} style={{ fontSize: '11px', fontWeight: '700', background: WPALE, color: WINE, padding: '4px 10px', borderRadius: '20px', border: `1px solid ${WBORDER}` }}>{chip}</span>
                ))}
              </div>

              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '16px 18px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '7px' }}>🔬 Why This Boundary Matters</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{bType.why_it_matters}</p>
              </div>

              <div style={{ background: WPALE, border: `2px solid ${WBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: WINE, marginBottom: '7px' }}>{state.icon} Where You Are Starting From</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{STATE_CONTEXT[stateKey]}</p>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${WINE}12, ${WINE}06)`, border: `2px solid ${WBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: WINE, marginBottom: '9px' }}>🎯 Your Ready-to-Use Script — with {rType.label}</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: WINE, fontStyle: 'italic', lineHeight: 1.7 }}>{script}</p>
              </div>

              <div style={{ background: 'white', border: `1.5px solid ${WBORDER}`, borderRadius: '12px', marginBottom: '10px', overflow: 'hidden' }}>
                <button onClick={() => setOpenSteps(o => !o)} style={{ width: '100%', padding: '15px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: WINE }}>🌱 Your Three-Step Boundary Plan</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Specific actions to set and maintain this boundary</div>
                  </div>
                  <span style={{ color: WINE, fontSize: '14px', flexShrink: 0, marginLeft: '10px' }}>{openSteps ? '▲' : '▼'}</span>
                </button>
                {openSteps && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                    {bType.steps.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', padding: '13px 0', borderBottom: i < bType.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `linear-gradient(135deg, ${WINE}, #A03D7A)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{s}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: WPALE, border: `1.5px dashed ${WBORDER}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: WINE, marginBottom: '7px' }}>✨ Your Boundary Reminder</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: WINE, fontStyle: 'italic', lineHeight: 1.5 }}>"A boundary is not a wall. It is an honest signal about where your care begins and where it ends."</p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${WBORDER}`, color: WINE, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different boundary</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EmotionalBoundaries({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={meta.imgUrl} />
        <meta property="og:type" content="article" />
        <meta property="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>Most people learn about emotional boundaries the hard way — by spending years without them and discovering, through exhaustion, resentment, and the gradual erosion of their own sense of self, exactly what they were missing. The concept arrives late, usually accompanied by the realisation that a significant portion of their energy has been quietly spent managing other people's emotional worlds at the expense of their own.</p>

      <p><strong>Emotional boundaries</strong> are not about becoming cold, distant, or difficult to reach. They are about knowing — precisely and honestly — where your emotional responsibility ends and someone else's begins. They are the difference between genuine care and compulsive caretaking. Between empathy and emotional merger. Between a relationship and an arrangement where one person quietly disappears into the other's needs.</p>

      <img src={meta.imgUrl} alt="Student learning how to set emotional boundaries — understanding the six types and how to protect mental health in relationships" style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} />

      <h3 id="what-they-are">1. What Emotional Boundaries Actually Are — and Are Not</h3>
      <p>The most persistent misconception about emotional boundaries is that they are walls — barriers between you and other people designed to keep intimacy at a safe distance. This misconception is both common and exactly backwards. Walls are what people build when they have been so repeatedly hurt by the absence of boundaries that withdrawal becomes the only available protection. Boundaries are what make walls unnecessary.</p>
      <p>An emotional boundary is, at its core, an honest signal about what you will and will not engage with — a clear communication, to yourself and when necessary to others, about the conditions under which you can be genuinely present in a relationship. Psychologist Anne Katherine, in her foundational work on boundaries, defines them as "the point at which I end and you begin." They are not about what other people are allowed to do — you cannot control that. They are about what you will participate in, take responsibility for, and allow to affect you.</p>
      <p>Emotional boundaries are not selfish — though the guilt that follows setting them can convincingly mimic evidence of selfishness. They are not aggressive — though the discomfort they produce in people who have benefited from their absence is sometimes expressed as accusation. And they are not permanent rigid rules — they are living, contextual, and ideally communicated rather than silently enforced.</p>
      <p>What emotional boundaries actually are is more prosaic and more important: they are the practice of treating your own emotional life with the same seriousness and respect you would bring to anyone else's. The same way you would not expect a friend to absorb your distress at 2am without limit, you are entitled to the same consideration. Emotional boundaries are the equalisation of that standard — applied inward.</p>

      <h3 id="six-types">2. The Six Types of Emotional Boundaries Students Need</h3>
      <p><strong>Emotional labour boundaries</strong> define how much of your emotional capacity you make available for managing, absorbing, or resolving other people's feelings. Without them, you become the designated emotional processing unit for everyone in your life — permanently available, perpetually responsible, chronically depleted.</p>
      <p><strong>Mental space boundaries</strong> protect your cognitive and psychological capacity from constant external occupation. The right to uninterrupted thought, focused work time, and conversations that end when the conversation is over rather than continuing as a thread of worry in your head — these are mental space boundaries, and they are among the most routinely violated in student life.</p>
      <p><strong>Emotional disclosure boundaries</strong> govern what you share about your inner life, with whom, and under what conditions. Not everyone who asks deserves access to your vulnerability. Not every relationship that offers warmth has demonstrated the trustworthiness that genuine disclosure requires. The boundary here is not secrecy — it is appropriate calibration of openness to safety.</p>
      <p><strong>Emotional responsibility boundaries</strong> are perhaps the most important and least understood type. They draw the line between what you are genuinely responsible for — your own emotional responses and behaviour — and what you are not responsible for: other people's emotions, reactions, and wellbeing. The most common boundary violation in student relationships is responsibility enmeshment — taking on guilt, anxiety, or responsibility for emotional states that belong entirely to someone else.</p>
      <p><strong>Time and energy boundaries</strong> recognise that emotional availability is a finite resource. Your presence, attention, and emotional engagement are valuable and limited. Setting time and energy boundaries means being honest about what you actually have to give rather than over-committing and under-delivering — or giving everything and having nothing left for yourself.</p>
      <p><strong>Conversational boundaries</strong> limit the topics, dynamics, and tones you will engage with. You are allowed to decline circular arguments, invasive questioning, persistent negativity, and conversations designed to manipulate your self-perception. The right to exit a conversation that is not productive or respectful is one of the most basic emotional boundaries — and one of the most consistently overlooked.</p>

      <h3 id="builder">3. Interactive: The Boundary Builder</h3>
      <p>Understanding the types of emotional boundaries is the first step. Knowing exactly what to say in the specific situation you are facing is what actually changes anything. The Boundary Builder takes you through four steps: the type of boundary you need, who you need it with, the current state of that boundary, and your starting conditions. The result is a ready-to-use script, the psychology behind why this boundary matters, and a three-step practical plan for setting and maintaining it.</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '4px' }}>Choose the boundary situation that has the most charge for you right now — the one you have been putting off, or the one where you feel most consistently drained.</p>

      <BoundaryBuilder />

      <h3 id="why-hard">4. Why Setting Boundaries Feels So Hard (The Psychology)</h3>
      <p><strong>Boundaries require tolerating others' disappointment.</strong> The most immediate obstacle to setting an emotional boundary is not knowing what the boundary should be — it is the anticipatory discomfort of the other person's reaction. Most people have been implicitly or explicitly taught that causing someone else's disappointment is a moral failure. Setting a boundary inherently causes disappointment — at minimum the disappointment of a request being declined. Until you can tolerate that disappointment without treating it as evidence that you have done something wrong, every boundary will feel like a choice between integrity and belonging.</p>
      <p><strong>In Indian family and social culture, boundaries are rarely modelled.</strong> Collectivist cultural frameworks — which describe much of Indian family and social life — prioritise group harmony and collective obligation over individual need. This produces environments where the expression of individual emotional limits is read as disloyalty, selfishness, or ingratitude. Young people who grow up in these environments internalise the message that their needs are subordinate to the group's, which makes boundary-setting feel not just uncomfortable but actively wrong. Unlearning this is possible, and it requires a reframe: not "is this allowed in our culture?" but "what does genuine care for both myself and my relationships actually require?"</p>
      <p><strong>Guilt is the boundary's most effective enforcement mechanism — but it is running the wrong programme.</strong> The guilt that arrives within minutes of setting a boundary is almost always a conditioned response — the nervous system's learned association between asserting a need and the threat of social disapproval. This guilt is real and uncomfortable and is not evidence of wrongdoing. It is the old programme running in a new situation. Each time you feel the guilt and hold the boundary anyway, you re-train the association slightly. The work is not to eliminate the discomfort. It is to stop letting it reverse decisions you made for the right reasons.</p>
      <p><strong>The fear that boundaries will damage the relationship.</strong> Research on relationship quality consistently shows the opposite: relationships where both people have and maintain healthy emotional boundaries are more satisfying, more durable, and more genuinely intimate than relationships where one or both people have none. The absence of boundaries does not produce closeness — it produces enmeshment, resentment, and the slow withdrawal of the depleted person. A boundary clearly communicated, calmly held, and consistently maintained is one of the most honest signals of care you can offer a relationship.</p>

      <h3 id="steps">5. Practical Steps to Set and Maintain Emotional Boundaries</h3>
      <p><strong>Step one: Identify the depletion signal before identifying the boundary.</strong> Boundaries are most accurately set by working backwards from the experience of depletion — the persistent tiredness, resentment, anxiety, or avoidance behaviour that signals that something is costing more than it should. Ask: "Where am I consistently feeling drained, guilty, or resentful in my relationships?" The answer identifies the area. The specific behaviour that produces that feeling identifies the boundary.</p>
      <p><strong>Step two: Name the boundary to yourself before naming it to anyone else.</strong> Clarity about your own position makes the communication significantly more confident — because you are not working it out in the conversation, you are reporting a decision already made. The clearer the internal articulation, the cleaner the external expression.</p>
      <p><strong>Step three: Use the structure observation — impact — need.</strong> The most effective boundary communication is not a demand, a rule, or an accusation. It is a clear three-part statement: "When [specific observable behaviour], I feel [honest impact]. I need [specific change or limit]." This structure separates the person from the behaviour (making it less defensive), communicates genuine impact (making it more real than a preference), and names a specific actionable request.</p>
      <p><strong>Step four: State it once, clearly, and then maintain it through behaviour rather than repetition.</strong> Repeating a boundary that has been ignored demonstrates that repeated violation does not produce consequences. State the boundary once, clearly. After that, maintain it through action: end the call, leave the room, do not respond to the message, follow through on what you said you would do. The boundary becomes real through consistent behaviour, not through escalating the verbal statement.</p>
      <p><strong>Step five: Expect discomfort and plan for it specifically.</strong> Decide in advance — before you set the boundary — what you will do when the guilt arrives, when the other person pushes back, or when the boundary is crossed again. Having a pre-decided response is the difference between a boundary that holds and one that dissolves under the first pressure. The discomfort is not a surprise. Plan your response to it the same way you planned the script.</p>

      <h3 id="faq">6. Emotional Boundaries FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How do I set boundaries with someone who does not respect them?</strong><br />A: A boundary that is not maintained produces the same outcome as a boundary that was never set. When someone crosses a boundary you have communicated clearly, the next step is not to communicate it more loudly — it is to follow through on a consequence. "I said I would not continue this conversation if it became disrespectful. It has. I am stepping away now." And then actually stepping away. Consistently. Every time. People who genuinely do not respect boundaries after they are clearly communicated and consistently maintained are giving you important information about the relationship.</p>

        <p><strong>Q: What is the difference between a boundary and an ultimatum?</strong><br />A: An ultimatum is a threat with a demand: "Do this or else." A boundary is a statement about what you will and will not do, regardless of what the other person does: "If this keeps happening, I will [specific action I take about my own participation]." The boundary is entirely self-referential — it is about your behaviour, not a condition placed on theirs. This changes the dynamic entirely: an ultimatum creates a power struggle; a boundary creates information.</p>

        <p><strong>Q: How do I know if a boundary I am setting is healthy or just avoidance?</strong><br />A: The key distinction is whether the limit is protecting your genuine wellbeing or protecting you from all discomfort including necessary growth. Healthy boundaries protect you from chronic depletion, from behaviour that violates your values, and from dynamics that consistently damage your self-worth or safety. Avoidance disguised as a boundary protects you from any emotional challenge and from the vulnerability that genuine intimacy requires. The honest question: "Am I setting this to protect something real, or to avoid feeling uncomfortable?"</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: WINE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Daring to set boundaries is about having the courage to love ourselves, even when we risk disappointing others."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Brené Brown</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          The boundary you have been putting off is not protecting the relationship. The relationship is surviving on the credit you extend every time you override your own limits to preserve someone else's comfort. That credit has a cost. And the relationship built on genuine mutual respect — where both people have and honour limits — is a stronger, more honest, more durable version of the one you have been managing without them.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/mindspace')} style={{ background: WINE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${WBORDER}` }}>Work Through This in Mind Space →</button>
          <button onClick={() => navigate('/wall')} style={{ background: 'white', color: WINE, border: `2px solid ${WINE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>Share Anonymously on the Wall</button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Deepen Your Boundaries Practice:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/saying-no-mental-health',     '→ Why Saying No is Important for Mental Health'],
            ['/blog/self-kindness-check',         '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/blog/self-care-relationships',     '→ The Role of Self-Care in Building Healthy Relationships'],
            ['/blog/relationships-mental-health', '→ How Relationships Affect Your Mental Health (Positive & Negative)'],
            ['/safe',                             '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: WINE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>{label}</button>
            </li>
          ))}
        </ul>
      </div>
    </BlogPostTemplate>
  );
}
