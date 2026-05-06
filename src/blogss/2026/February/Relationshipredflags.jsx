import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Identify Red Flags in Relationships Early",
  excerpt: "Red flags are rarely dramatic at first — they are small, easy to explain away, and often wrapped in flattery or affection. Learning to spot relationship red flags early, before they become patterns, is one of the most protective skills you can build. This guide covers the psychology, the early warning signs, and gives you a scenario-based Red Flag Radar to sharpen your instincts.",
  category: "Mental Health",
  date: "21-02-2026",
  readTime: "7 min read",
  wordCount: 1040,
  imgUrl: "/blogss/2026/February/relationship-red-flags.jpg",
  tldr: "Relationship red flags are patterns of behaviour that signal potential harm — and they almost always appear early. The problem is not that they are invisible. It is that we are taught to explain them away. This guide defines what makes a behaviour a genuine red flag versus a yellow flag, walks through the eight most common early warning signs in student relationships, and gives you a Red Flag Radar scenario tool to test and sharpen your instincts in real-life situations.",
  toc: [
    { id: "red-vs-yellow",  title: "1. Red Flags vs Yellow Flags: What the Difference Actually Is",    level: 3 },
    { id: "why-miss",       title: "2. Why Smart People Miss Red Flags (The Psychology)",               level: 3 },
    { id: "radar",          title: "3. Interactive: The Red Flag Radar",                               level: 3 },
    { id: "eight-signs",    title: "4. Eight Early Warning Signs in Student Relationships",             level: 3 },
    { id: "prevention",     title: "5. Prevention: What to Do When You Spot a Red Flag",               level: 3 },
    { id: "faq",            title: "6. Relationship Red Flags FAQs",                                    level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-21T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "relationship red flags, red flags in relationships, early warning signs relationships, toxic relationship signs, how to spot red flags, student relationship red flags, healthy relationship warning signs",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the biggest red flags in a relationship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most significant red flags in any relationship — romantic, friendship, or otherwise — include: a pattern of disrespecting your limits after they have been clearly stated, making you feel responsible for their emotional regulation or wellbeing to an unhealthy degree, isolating you from other relationships, inconsistency between words and actions over time, and any behaviour that causes you to doubt your own perception of reality. The key word in all of these is 'pattern' — a single instance is a yellow flag worth watching. A repeated pattern is a red flag worth acting on.",
      },
    },
    {
      "@type": "Question",
      "name": "How do you tell the difference between a red flag and a normal relationship issue?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Normal relationship issues are mutual, situational, and repairable — both people contribute to the friction, it is connected to specific circumstances or stress, and it resolves through honest conversation. Red flags are one-directional, persistent, and do not change when addressed — the same person keeps doing the same thing regardless of how clearly or kindly you have communicated your concern. The repair attempt is the key test: a normal issue improves when named. A red flag either stays the same or escalates when challenged.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it possible to be in a relationship with red flags and still be okay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exposure to red flag behaviour causes real psychological cost regardless of how resilient you are — it activates chronic stress responses, gradually erodes self-trust and self-worth, and narrows your sense of what is normal in relationships. Some people remain in relationships with significant red flags for years and continue to function, but the research on relationship stress is clear: the cost accumulates even when it is not acutely felt. The more important question is not whether you can survive it but whether you should.",
      },
    },
  ],
};

// ── Red Flag Radar Data ────────────────────────────────────────────────────────
const CRIMSON = '#A62020';
const CPALE   = '#FDF0F0';
const CBORDER = 'rgba(166,32,32,0.22)';

const RADAR_SCENARIOS = [
  {
    id:       'r1',
    context:  'Early stages of a new friendship',
    scenario: 'You just met someone at orientation and you have been talking for three days straight. They already call you their "best friend" and say things like "you are the only person here who actually gets me." They get visibly upset when you spend time with anyone else.',
    options: [
      {
        key:    'A',
        label:  'That is so sweet — they are just eager to connect and feel safe with me.',
        verdict: 'yellow',
        explain: 'The warmth and eagerness are real, but the intensity of early attachment combined with visible upset at your independence is a yellow-to-red flag. Called "love bombing" in its more intense forms, premature declarations of uniqueness and special status are sometimes genuine — and are sometimes a setup for later control. The question to watch: does the intensity calm down as real trust builds, or does it escalate?',
      },
      {
        key:    'B',
        label:  'The pace feels intense. Making me their entire support system in day three, and reacting to me having other connections, are patterns worth noticing.',
        verdict: 'correct',
        explain: 'Exactly right. Rapid attachment declarations are sometimes innocent enthusiasm — and sometimes the early stage of a dynamic that will eventually use guilt, emotional dependence, and jealousy as control mechanisms. The specific warning sign here is not the warmth. It is the visible upset at your independence — that is worth tracking.',
      },
      {
        key:    'C',
        label:  'They are clearly just lonely. I should prioritise being there for them and pull back from other friendships for now.',
        verdict: 'red',
        explain: 'This response — prioritising someone else\'s comfort at the cost of your own social network — is exactly the dynamic a controlling friendship gradually builds toward. Loneliness explains the feeling but does not justify the expectation. You are not responsible for solving someone\'s loneliness by shrinking your world.',
      },
    ],
  },
  {
    id:       'r2',
    context:  'Three months into a romantic relationship',
    scenario: 'Your partner reads through your phone "just to check" who you have been talking to. When you say you are not comfortable with this, they say: "If you have nothing to hide, you should not mind. I just love you so much I get worried."',
    options: [
      {
        key:    'A',
        label:  'They are being a bit clingy but it is coming from love. I can understand their insecurity.',
        verdict: 'yellow',
        explain: 'Insecurity is understandable and worth compassion. But accessing someone\'s private communications without consent is a boundary violation regardless of the motive. The framing — "if you have nothing to hide" — is specifically concerning because it reframes your discomfort as evidence of guilt rather than as a legitimate response to a privacy violation. That rhetorical move is a pattern worth recognising.',
      },
      {
        key:    'B',
        label:  'Privacy is a basic right in any relationship. The "nothing to hide" logic flips my reasonable response into evidence of wrongdoing — that is a manipulation tactic.',
        verdict: 'correct',
        explain: 'Precisely. Privacy is not secrecy — it is a fundamental right in any healthy relationship. The "nothing to hide" argument is a classic reversal: it takes your legitimate response to a violation and reframes it as the problem. This is a clear red flag — not because phone-checking indicates abuse, but because the justification for it attempts to override your boundary by making your discomfort seem suspicious.',
      },
      {
        key:    'C',
        label:  'I should show them everything so they feel secure. Their anxiety is the real issue we need to address.',
        verdict: 'red',
        explain: 'Surrendering privacy to manage someone else\'s anxiety sets a damaging precedent. The anxiety does not go away when it is rewarded — it escalates, because the underlying issue is control, not fear. Each time you accommodate the boundary violation to relieve their distress, the implicit agreement becomes: your needs yield to their emotions.',
      },
    ],
  },
  {
    id:       'r3',
    context:  'Long-term friendship — two years',
    scenario: 'Every time you share something good that happened to you — a good grade, a compliment you received, a fun event — your friend either one-ups you, changes the subject to something negative about their own life, or makes a small dismissive remark. When you share something hard, they are warm and fully present.',
    options: [
      {
        key:    'A',
        label:  'They are probably just going through a hard time and I should keep sharing. They will come around.',
        verdict: 'yellow',
        explain: 'A temporary pattern during a specific stressful period is reasonable. But you specified this happens every time you share good news, across two years. That consistency makes it a structural dynamic rather than a temporary stress response. "They will come around" may be true — but after two years, the pattern is worth naming rather than waiting out.',
      },
      {
        key:    'B',
        label:  'A consistent pattern of dismissing my wins while showing up for my struggles is worth naming honestly. A real friendship celebrates both.',
        verdict: 'correct',
        explain: 'Correct. This is one of the most common and least discussed relationship red flags: selective emotional presence — available during your hardship (which feels supportive) and consistently absent during your success (which feels deflating). Over time, this conditions you to downplay your own wins to maintain the relationship\'s emotional balance. That is a real cost worth addressing.',
      },
      {
        key:    'C',
        label:  'Maybe I am sharing too much good news and making them feel bad. I should tone down what I share.',
        verdict: 'red',
        explain: 'Shrinking your positive experiences to protect someone else\'s comfort is a significant self-erasure. You deserve relationships where your good news is genuinely welcomed. The instinct to reduce what you share to manage their reaction is worth examining — it reveals that some part of you already knows this dynamic is not working.',
      },
    ],
  },
  {
    id:       'r4',
    context:  'Family dynamic — parent or older relative',
    scenario: 'You tell a family member something personal and vulnerable. Later, that information is used in an argument: "Remember when you told me you felt like a failure? Well this is exactly why." They also regularly share what you have told them with other family members without your consent.',
    options: [
      {
        key:    'A',
        label:  'They are family — they would not intentionally use this against me. They probably do not realise how it lands.',
        verdict: 'yellow',
        explain: 'The intention is genuinely uncertain — this behaviour can be unconscious in family systems with entrenched communication patterns. But impact matters regardless of intention. Whether or not they realise it, using your vulnerability as ammunition and sharing your private disclosures without consent are both significant boundary violations that erode the psychological safety necessary for an honest relationship.',
      },
      {
        key:    'B',
        label:  'Using my vulnerability as a weapon in arguments, and sharing my private disclosures without consent, are clear violations — regardless of family relationship or intention.',
        verdict: 'correct',
        explain: 'Exactly. The family relationship does not change the nature of the behaviour. Information shared in vulnerability being weaponised in conflict is a significant warning sign — it means that being honest comes with a cost. The predictable consequence of this pattern is that you will stop being honest to protect yourself, which is a rational and healthy adaptation to an unsafe dynamic.',
      },
      {
        key:    'C',
        label:  'I should stop sharing anything personal with them, but otherwise keep the relationship exactly as it is without addressing it.',
        verdict: 'yellow',
        explain: 'Reducing disclosure is a sensible protective adaptation — but "without addressing it" leaves the pattern intact and may mean it escalates or shifts to other areas. There is a difference between strategic discretion (a healthy adaptation) and complete avoidance of the issue (which sometimes produces resentment and leaves the pattern free to continue).',
      },
    ],
  },
  {
    id:       'r5',
    context:  'Romantic relationship — six months in',
    scenario: 'After every argument, your partner never admits any fault. The conversation always ends with you apologising — even when you are not sure what you did wrong. They say things like "you always do this" and "you never listen" but cannot give specific examples when asked.',
    options: [
      {
        key:    'A',
        label:  'Arguments are always two-sided. I probably am doing something wrong even if I cannot see it clearly.',
        verdict: 'yellow',
        explain: 'Self-reflection after conflict is healthy. But "I probably am doing something wrong even if I cannot identify what it is" is the internal narrative that gaslighting produces. The inability to provide specific examples when asked, combined with a consistent pattern of you apologising regardless of what happened, suggests a conflict dynamic that has stopped being about resolution and has become about control.',
      },
      {
        key:    'B',
        label:  'A consistent pattern where I always end up apologising, and where accusations cannot be backed with specifics, is a red flag for gaslighting — not just poor communication.',
        verdict: 'correct',
        explain: 'Correct. The consistency is the signal. Arguments where blame always lands in one direction, where accusations are global ("you always," "you never") and cannot be made specific, and where one person consistently apologises regardless of what happened — these are the mechanics of gaslighting. It does not need to be intentional to be damaging. The outcome — your growing uncertainty about your own perceptions and behaviour — is the cost.',
      },
      {
        key:    'C',
        label:  'I need to get better at communicating so arguments do not happen. The problem is how I am expressing myself.',
        verdict: 'red',
        explain: 'When the solution to a consistently one-sided conflict dynamic is "I need to improve my communication," the problem has been successfully relocated to you. Communication improvement is always worthwhile — but the issue here is not how you are expressing yourself. The issue is that the conflict dynamic is structured so that one person never shares accountability. That is not a communication problem. It is a power dynamic.',
      },
    ],
  },
  {
    id:       'r6',
    context:  'Peer/academic relationship',
    scenario: 'A classmate who leads your study group regularly makes comments about others\' intelligence in front of the group — "Isha never really understands this stuff," "Rohan is always slowing us down." You have noticed they also make subtle remarks about your performance when you make mistakes.',
    options: [
      {
        key:    'A',
        label:  'They are just being direct and honest about group dynamics. It is probably helping us study more efficiently.',
        verdict: 'red',
        explain: 'Publicly diminishing group members by name is not directness or efficiency — it creates psychological unsafe conditions that actually harm performance. Research on psychological safety in groups (Amy Edmondson, Harvard) shows that groups where members fear public humiliation consistently underperform groups where mistakes are treated as learning, even when the "direct" group has individually stronger members.',
      },
      {
        key:    'B',
        label:  'A pattern of publicly diminishing specific people — including subtle remarks about me — is a red flag for controlling group dynamics and potentially targeted undermining.',
        verdict: 'correct',
        explain: 'Precisely. Public diminishment of named individuals in a group setting is a clear red flag — it establishes a power hierarchy through humiliation. The fact that it extends to subtle remarks about you specifically suggests you are not observing this from a safe distance. You are also in the dynamic.',
      },
      {
        key:    'C',
        label:  'I should try to defend the people being targeted without saying anything about the pattern directly — I do not want to make it awkward.',
        verdict: 'yellow',
        explain: 'Defending targeted individuals is good. But consistently addressing symptoms without naming the pattern leaves the dynamic intact. "I do not want to make it awkward" is worth examining — in a group where one person is routinely humiliating others, the awkwardness is already present. Naming it is not creating the problem. It is just making an existing problem visible.',
      },
    ],
  },
];

const VERDICT_META = {
  correct: { label: 'Accurate Read',      color: '#2D7D46', bg: '#E8F5EE', icon: '✅' },
  yellow:  { label: 'Partially Accurate', color: '#C07800', bg: '#FFF8E1', icon: '🟡' },
  red:     { label: 'Missed the Flag',    color: '#C0392B', bg: '#FDECEA', icon: '🔴' },
};

// ── Radar Component ────────────────────────────────────────────────────────────
function RedFlagRadar() {
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [done,     setDone]     = useState(false);

  const font     = "'Plus Jakarta Sans', system-ui, sans-serif";
  const scenario = RADAR_SCENARIOS[current];
  const isLast   = current === RADAR_SCENARIOS.length - 1;

  const handleSelect = (key) => { if (!revealed) setSelected(key); };

  const handleReveal = () => {
    if (!selected) return;
    setRevealed(true);
    setAnswers(prev => ({ ...prev, [scenario.id]: selected }));
  };

  const handleNext = () => {
    if (isLast) { setDone(true); return; }
    setSelected(null);
    setRevealed(false);
    setCurrent(c => c + 1);
  };

  const handleReset = () => { setCurrent(0); setAnswers({}); setSelected(null); setRevealed(false); setDone(false); };

  // Tally
  const tally = { correct: 0, yellow: 0, red: 0 };
  Object.entries(answers).forEach(([sid, key]) => {
    const sc  = RADAR_SCENARIOS.find(s => s.id === sid);
    const opt = sc?.options.find(o => o.key === key);
    if (opt) tally[opt.verdict]++;
  });

  const chosenOption = scenario?.options.find(o => o.key === selected);

  if (done) {
    const accuracy = Math.round(((tally.correct + tally.yellow * 0.5) / RADAR_SCENARIOS.length) * 100);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          {/* Score */}
          <div style={{ background: `linear-gradient(135deg, ${CRIMSON}, #C04040)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              Red Flag Radar: {accuracy}% Accuracy
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>
              {accuracy >= 80 ? 'Strong instincts — you are reading relational dynamics clearly.' : accuracy >= 50 ? 'Developing awareness — a few patterns are still slipping through.' : 'Your instincts are being overridden by some very common explanations. Let\'s look at what is happening.'}
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${CBORDER}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
              Your Response Pattern
            </div>
            {Object.entries(tally).map(([verdict, count]) => {
              const vm  = VERDICT_META[verdict];
              const pct = Math.round((count / RADAR_SCENARIOS.length) * 100);
              return (
                <div key={verdict} style={{ marginBottom: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: vm.color }}>{vm.icon} {vm.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: vm.color }}>{count} / {RADAR_SCENARIOS.length}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: vm.color, borderRadius: '6px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          <div style={{ background: CPALE, border: `2px solid ${CBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: CRIMSON, marginBottom: '8px' }}>
              💡 What Your Pattern Reveals
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75 }}>
              {tally.red >= 3
                ? 'You tend to explain away red flags through empathy, responsibility, or minimisation — giving benefit of the doubt in situations where a pattern has already been established. This is extremely common and is usually the result of being taught that relational discomfort is something to manage around rather than act on. The key shift: begin noticing the pattern rather than the single instance.'
                : tally.yellow >= 3
                ? 'You are reading the situations partially accurately — you sense something is off but stop short of naming it as a clear warning sign. This often reflects genuine relational intelligence alongside an instinct toward de-escalation. The next step: trust the "something feels off" signal more, even when you cannot immediately articulate why.'
                : 'Your relational instincts are well-calibrated — you are reading these dynamics accurately and not explaining them away. The ongoing challenge is applying these instincts in real situations where the emotional stakes are higher and the rationalisation is more seductive.'}
            </p>
          </div>

          <div style={{ background: 'white', border: `1.5px dashed ${CBORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: CRIMSON, fontStyle: 'italic', lineHeight: 1.55 }}>
              "A red flag is not an accusation. It is information. What you do with it is your choice."
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${CBORDER}`, color: CRIMSON,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retake the Radar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Scenario {current + 1} of {RADAR_SCENARIOS.length}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: CRIMSON }}>
            {Math.round((current / RADAR_SCENARIOS.length) * 100)}% complete
          </span>
        </div>
        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '5px',
            background: `linear-gradient(90deg, ${CRIMSON}, #C04040)`,
            width: `${(current / RADAR_SCENARIOS.length) * 100}%`, transition: 'width 0.35s ease',
          }} />
        </div>
      </div>

      {/* Context badge */}
      <div style={{ display: 'inline-block', background: CPALE, border: `1px solid ${CBORDER}`, borderRadius: '20px', padding: '4px 12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: CRIMSON }}>
          Context: {scenario.context}
        </span>
      </div>

      {/* Scenario */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: '1.5px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '7px' }}>
          The Situation
        </div>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: 'var(--ink)', lineHeight: 1.65 }}>
          {scenario.scenario}
        </p>
      </div>

      {/* Options */}
      <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        How would you most honestly interpret this situation?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {scenario.options.map(opt => {
          const isSelected = selected === opt.key;
          const vm         = VERDICT_META[opt.verdict];
          const showLabel  = revealed && isSelected;
          return (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              disabled={revealed}
              style={{
                padding: '14px 16px', borderRadius: '11px', border: '2px solid',
                borderColor: isSelected ? (revealed ? vm.color : CRIMSON) : 'var(--border)',
                background: isSelected ? (revealed ? vm.bg : CPALE) : 'white',
                cursor: revealed ? 'default' : 'pointer', fontFamily: font,
                textAlign: 'left', fontSize: '14px', fontWeight: '500',
                color: 'var(--ink)', lineHeight: 1.55, transition: 'all 0.18s',
                boxShadow: isSelected ? `0 0 0 2px ${revealed ? `${vm.color}40` : CBORDER}` : 'none',
              }}
            >
              <span style={{ marginRight: '8px', opacity: 0.5 }}>
                {opt.key === 'A' ? '🅐' : opt.key === 'B' ? '🅑' : '🅒'}
              </span>
              {opt.label}
              {showLabel && (
                <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: '700', color: vm.color }}>
                  — {vm.icon} {vm.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal / next */}
      {!revealed ? (
        <button onClick={handleReveal} disabled={!selected} style={{
          width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
          background: selected ? `linear-gradient(135deg, ${CRIMSON}, #C04040)` : 'var(--border)',
          color: 'white', fontWeight: '700', fontSize: '15px',
          cursor: selected ? 'pointer' : 'not-allowed', fontFamily: font,
          transition: 'all 0.2s', boxShadow: selected ? `0 6px 18px ${CBORDER}` : 'none',
        }}>
          {selected ? 'See the Analysis →' : 'Choose your interpretation above'}
        </button>
      ) : (
        <div style={{ animation: 'floatUp 0.3s ease' }}>
          {chosenOption && (
            <div style={{
              background: VERDICT_META[chosenOption.verdict].bg,
              border: `2px solid ${VERDICT_META[chosenOption.verdict].color}40`,
              borderRadius: '12px', padding: '18px 20px', marginBottom: '12px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: VERDICT_META[chosenOption.verdict].color, marginBottom: '8px' }}>
                {VERDICT_META[chosenOption.verdict].icon} {VERDICT_META[chosenOption.verdict].label}
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75 }}>
                {chosenOption.explain}
              </p>
            </div>
          )}
          <button onClick={handleNext} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: `linear-gradient(135deg, ${CRIMSON}, #C04040)`, color: 'white',
            fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
            boxShadow: `0 6px 18px ${CBORDER}`, transition: 'all 0.2s',
          }}>
            {isLast ? 'See My Results →' : 'Next Scenario →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RelationshipRedFlags({ navigate, relatedPosts }) {
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
      <p>Relationship red flags are almost never obvious at the start. They do not announce themselves. They arrive wrapped in flattery, in intensity that reads as passion, in possessiveness that reads as care, in control that reads as attentiveness. They are easy to explain away in the early stages — and precisely because they are easy to explain away, they tend to become entrenched before they are clearly seen.</p>

      <p>The psychology of why people miss <strong>relationship red flags</strong> is well-documented: we are wired for attachment, we give benefit of the doubt to people we care about, and we are surrounded by cultural narratives that romanticise the very patterns that research identifies as most harmful. Learning to identify red flags early is not about becoming cynical or suspicious. It is about developing the relational literacy to distinguish between normal relationship friction and warning patterns that, if ignored, will cost you significantly more later.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning how to identify relationship red flags early — warning signs in friendships, romantic relationships, and peer dynamics"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="red-vs-yellow">1. Red Flags vs Yellow Flags: What the Difference Actually Is</h3>
      <p>Not every concerning behaviour in a relationship is a red flag — and conflating all relational discomfort with danger produces a different problem: chronic suspicion and the inability to work through the normal difficulties that every relationship involves. The distinction matters.</p>
      <p><strong>A yellow flag</strong> is a behaviour or pattern that warrants attention and potentially a conversation — but that exists in a context where change is plausible, where the person has demonstrated genuine willingness to hear and adjust, and where the behaviour has not yet become an established pattern. A partner who occasionally goes quiet during conflict — not as a deliberate punishment but as a stress response they are aware of and actively working on — is a yellow flag situation. It deserves a conversation. It does not yet warrant the same response as a clear red flag.</p>
      <p><strong>A red flag</strong> is a pattern — not a single instance — of behaviour that signals a more fundamental incompatibility, a concerning dynamic, or a potential for harm. Three things consistently distinguish red flags from yellow flags: they are repeated despite being clearly communicated as a problem; they cause you to doubt your own perception, worth, or sanity; or they involve a fundamental violation of your safety — physical, emotional, or psychological. The key word in all three is <em>pattern</em>. A single difficult moment is data to observe. The same difficult moment repeated despite conversation is a pattern to act on.</p>
      <p>There is also a category worth naming separately: <strong>incompatibility flags</strong> — things that are not abusive or harmful, but that signal a fundamental mismatch in values, needs, or direction. Someone who is genuinely not emotionally available in the way you need is not necessarily a red flag in the sense of signalling harm. They are an incompatibility flag — and ignoring that signal has its own costs.</p>

      {/* ── Section 2 ── */}
      <h3 id="why-miss">2. Why Smart People Miss Red Flags (The Psychology)</h3>
      <p><strong>Intermittent reinforcement.</strong> Research on operant conditioning shows that variable reward schedules — rewards that come sometimes and not others, unpredictably — produce the strongest and most persistent behavioural attachment. A relationship with a person who is wonderful some of the time and harmful other times produces exactly this schedule. The unpredictability is not incidental to the attachment — it is the mechanism of it. The brain keeps seeking the reward, which keeps the person in the dynamic long past the point where consistent behaviour would have produced exit.</p>
      <p><strong>The sunk cost fallacy.</strong> The more time, emotional energy, and vulnerability you have invested in a relationship, the harder it is to acknowledge that the investment is not producing the outcome it should. This is the sunk cost fallacy applied to relationships — the unconscious logic that acknowledging a red flag would mean acknowledging that the investment was wrong. It was not wrong. The investment was made in good faith with the information available. The flag is new information, not a retroactive indictment of the past.</p>
      <p><strong>Normalisation through proximity.</strong> When a concerning behaviour is consistent enough and long-standing enough, it stops reading as unusual and begins reading as simply how this person is. This normalisation is gradual and invisible from the inside. People often only recognise that a behaviour was abnormal after they have left the relationship and seen it through the fresh eyes that distance provides. This is why outside perspective — from a trusted friend, a counsellor, or someone who knew you before the relationship — is so valuable for seeing patterns you have stopped being able to see.</p>
      <p><strong>Empathy working against you.</strong> Genuine empathy is one of the most valuable relational qualities a person can have. It also, applied without discernment, can be weaponised by a difficult relationship dynamic. "They are only like this because they had a hard childhood" may be true and completely irrelevant to whether the behaviour is acceptable. Understanding why someone does something does not obligate you to accept it. Empathy that consistently explains away harm rather than naming it has stopped serving you and started serving the dynamic.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="radar">3. Interactive: The Red Flag Radar</h3>
      <p>Reading about red flags in the abstract is useful. Applying that knowledge in specific, realistic scenarios is what actually builds the instinct. The Red Flag Radar presents six real-world situations drawn from student relationship contexts — romantic, friendship, family, academic, and peer dynamics. For each scenario, choose the most honest interpretation. After each choice, you will receive an analysis of what the situation actually signals and why that interpretation is accurate, partial, or a missed flag.</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '4px' }}>Choose the response that feels most genuinely true to how you would actually think about the situation — not the one that sounds most psychologically sophisticated.</p>

      <RedFlagRadar />

      {/* ── Section 4 ── */}
      <h3 id="eight-signs">4. Eight Early Warning Signs in Student Relationships</h3>
      <p><strong>1. Love bombing — overwhelming intensity in the early stages.</strong> Rapid declarations of uniqueness, exceptional depth of connection very early on, gifts or gestures that feel disproportionate to the length of the relationship, and visible distress when you do not reciprocate the intensity at the same pace. The warmth can be genuine. The velocity is what to watch.</p>
      <p><strong>2. Isolation from other relationships.</strong> Gradual discouragement of time spent with other friends, family, or connections — through jealousy, guilt, constant availability demands, or subtle criticism of the other people in your life. Each individual instance seems reasonable. The pattern produces a world where this person is your primary or only source of connection, which dramatically increases your dependence on them and their power over you.</p>
      <p><strong>3. Inconsistency between words and actions.</strong> What someone says about who they are matters less than what they consistently demonstrate. A person who says "I respect you completely" and then regularly dismisses your perspective is not lying and then telling the truth — they are simply showing you which one is real. The rule is simple: when words and actions conflict consistently, actions are always the more accurate data point.</p>
      <p><strong>4. Making you responsible for their emotions.</strong> The consistent pattern where your choices — including healthy, reasonable choices — are framed as causing their distress, and where you find yourself regularly modifying your behaviour to manage their emotional state. Caring about someone's feelings is healthy. Being responsible for regulating their emotions is not — and the confusion between these two things is one of the most common and costly emotional patterns in student relationships.</p>
      <p><strong>5. Disrespecting limits after they have been clearly stated.</strong> A single instance of crossing a limit is worth a conversation. The same limit being crossed repeatedly after it has been clearly communicated is a pattern — and it is one of the clearest possible indicators of how your expressed needs will be treated in this relationship over the long term.</p>
      <p><strong>6. Using your vulnerabilities against you.</strong> Information shared in trust and intimacy — about your fears, your insecurities, your past — later appearing as ammunition in conflict, as leverage in arguments, or as something shared with others without your consent. This pattern does not just hurt in the immediate instance. It conditions you to stop being honest to protect yourself, which is a rational but ultimately costly adaptation.</p>
      <p><strong>7. A double standard around accountability.</strong> They can do things that would be unacceptable if you did them. Their mistakes are contextualised and forgiven quickly. Yours are referenced repeatedly. This asymmetry reveals something important about how the relationship's power dynamic is structured — and it always gets more pronounced over time, not less.</p>
      <p><strong>8. Your friends and family consistently express concern.</strong> This is worth naming separately because it is both common and commonly dismissed. The people who knew you before this relationship and who are not invested in it the way you are have access to something you do not: who you were before, and who you seem to be becoming. When multiple people who genuinely care about you independently express concern about a specific relationship, that convergent external perception deserves more than defence.</p>

      {/* ── Section 5 ── */}
      <h3 id="prevention">5. Prevention: What to Do When You Spot a Red Flag</h3>
      <p><strong>Name it to yourself first, precisely.</strong> The instinct when a red flag appears is either to immediately confront or to explain it away. Neither is the right first move. The first move is to name it to yourself with specificity: not "this relationship feels off" but "every time I spend time with someone else, they respond with visible withdrawal and make comments that make me feel guilty for doing so." The more specific the description, the clearer the pattern becomes, and the clearer you can see whether it is a single instance or a recurring dynamic.</p>
      <p><strong>Have one clear, specific conversation.</strong> Before concluding that a pattern is irremovable, it deserves one honest, direct naming. "I have noticed that when I spend time with other people, you respond with withdrawal and comments that make me feel guilty. I want to understand your experience and I also need you to understand that this is affecting how I feel about spending time with you." A healthy relationship's response to this conversation is engagement, acknowledgment, and genuine effort to change. A relationship with a structural problem will dismiss, deflect, or escalate.</p>
      <p><strong>Watch the response, not the words.</strong> After naming a red flag, the instinct is to take the person's verbal response as the primary data. It is not. The primary data is their sustained behaviour in the weeks and months following the conversation. "I understand, I will work on it" followed by the same pattern resuming within two weeks is more information than the reassurance was. Behaviour over time is always the accurate measure.</p>
      <p><strong>Trust the pattern, not the exception.</strong> Most relationships with red flag dynamics also have genuinely good moments. Those good moments are real — and they are not sufficient counter-evidence to the pattern. The question is not "does this person have good qualities" (almost everyone does). It is "does the pattern of this relationship's behaviour produce safety, mutual respect, and growth for me" — assessed honestly over time, not during the good moments.</p>
      <p><strong>Seek outside perspective before deciding.</strong> The normalisation and isolation that damaging relationships produce make clear-sighted self-assessment very difficult from inside the dynamic. One trusted friend who knew you before this relationship began, one counsellor, or one honest conversation with someone who is not invested in the relationship continuing or ending can restore the perspective that proximity has eroded. You do not need to act on their input. You need the mirror they offer.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Relationship Red Flags FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Am I the red flag in some of my relationships?</strong><br />
        A: Possibly — and the fact that you are asking is itself a meaningful signal. The behaviours that constitute red flags — isolating a partner, using vulnerability against someone, dismissing communicated limits — are sometimes performed by people who are not consciously aware they are doing so, often because they were modelled in their own early relationships. Honest self-examination with a therapist or counsellor is the most effective way to identify patterns in your own behaviour that you cannot easily see from the inside.</p>

        <p><strong>Q: Can a relationship recover after a red flag is identified and named?</strong><br />
        A: Yes — with genuine, sustained behavioural change by the person whose pattern is producing the flag, and with sufficient trust-rebuilding to restore the safety that the pattern eroded. The specific conditions for recovery are: honest acknowledgment of the pattern (not justification or minimisation), changed behaviour observable over months rather than days, and the absence of escalation when the pattern is named. Many relationships have recovered from red flag dynamics. The work is real, it requires both people, and it requires the person producing the flag to genuinely want to change — not just to avoid the consequences of continuing.</p>

        <p><strong>Q: Is it safe to directly confront someone about a red flag?</strong><br />
        A: In most cases, a calm, specific naming of a pattern is safe and worth attempting. However, if the relationship involves any physical intimidation, a pattern of escalated responses to direct communication, or explicit threats, safety should take precedence over directness. In those situations, speaking with a counsellor, trusted adult, or support service before having the conversation is the more important first step. Your safety is not a secondary consideration to relational honesty — it is the precondition for it.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: CRIMSON, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "When someone shows you who they are, believe them the first time."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Maya Angelou</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          Spotting red flags early is not cynicism. It is self-respect. It is the commitment to taking your own experience seriously before the cost of ignoring it becomes too high to easily reverse. Your instincts are usually right before your explanations get to them. Learn to listen to them a little earlier.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: CRIMSON, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${CBORDER}` }}
          >
            Process This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: CRIMSON, border: `2px solid ${CRIMSON}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Building Your Relational Literacy:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/toxic-friendship-signs')} style={{ background: 'none', border: 'none', color: CRIMSON, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → 7 Signs of a Toxic Friendship You Should Not Ignore
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/relationships-mental-health')} style={{ background: 'none', border: 'none', color: CRIMSON, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How Relationships Affect Your Mental Health (Positive &amp; Negative)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background: 'none', border: 'none', color: CRIMSON, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Set Boundaries Without Feeling Guilty (Student Guide)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: CRIMSON, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
