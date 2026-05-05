import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Self-Respect vs Ego: Understanding the Real Difference",
  excerpt: "Self-respect and ego are often confused — and the confusion is expensive. One is the foundation of healthy relationships and genuine confidence. The other quietly destroys both. Learn the clear psychological distinction, see how each shows up in real life, and discover where you actually land on the spectrum.",
  category: "Mental Health",
  date: "17-02-2026",
  readTime: "7 min read",
  wordCount: 1040,
  imgUrl: "/blogss/2026/February/self-respect-vs-ego.jpg",
  tldr: "Self-respect is knowing your worth without needing to prove it. Ego is needing to prove your worth because you are not sure of it. The difference sounds small and has enormous consequences — for your relationships, your emotional health, and whether you keep growing. This guide defines both clearly, shows you what each looks like in real situations, and gives you an interactive scenario test to find out where you naturally lean.",
  toc: [
    { id: "definitions",    title: "1. Clear Definitions: What Each One Actually Means",              level: 3 },
    { id: "psychology",     title: "2. The Psychology Behind Self-Respect and Ego",                   level: 3 },
    { id: "scenario-test",  title: "3. Interactive: Self-Respect or Ego? Scenario Sorter",           level: 3 },
    { id: "real-life",      title: "4. Real-Life Examples: How Each One Shows Up Daily",              level: 3 },
    { id: "balance",        title: "5. The Healthy Balance: Confidence Without Fragility",            level: 3 },
    { id: "faq",            title: "6. Self-Respect vs Ego FAQs",                                     level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-17T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "self-respect vs ego, difference between self-respect and ego, what is self-respect, ego vs confidence, healthy self-respect, ego in relationships, self-worth vs ego",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between self-respect and ego?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Self-respect is a stable, internally sourced sense of your own worth that does not require external validation or comparison to others. It allows you to hold your ground without needing to diminish someone else. Ego, in the psychological sense, is a defended sense of identity that relies on superiority, approval, or control to stay intact. Self-respect is secure — it does not feel threatened by other people's success or criticism. Ego is fragile — it does require constant reinforcement and collapses under genuine challenge.",
      },
    },
    {
      "@type": "Question",
      "name": "Is having an ego bad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In everyday language, 'ego' is often used to mean an inflated or defensive sense of self — the kind that needs to win arguments, cannot admit mistakes, and treats criticism as an attack. In this sense, a dominant ego pattern does cause real damage to relationships and personal growth. However, in Freudian psychology, the ego simply refers to the part of the mind that mediates between impulse and reality — which is neutral and necessary. When people ask whether ego is bad, they are usually asking about ego defensiveness, not the ego structure itself.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I build self-respect without becoming arrogant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Arrogance is not the overflow of self-respect — it is the mask ego wears when self-worth is insecure. Genuine self-respect is quiet, because it does not need an audience. Building it involves three practices: keeping commitments to yourself (which builds self-trust), setting and maintaining limits with other people (which builds self-advocacy), and separating your worth from your performance (which builds unconditional self-regard). None of these require being better than anyone else — which is precisely what makes them self-respect rather than ego.",
      },
    },
  ],
};

// ── Scenario Sorter Data ───────────────────────────────────────────────────────
const AMBER  = '#9B6B1A';
const PALE   = '#FDF5E8';
const ABORDER = 'rgba(155,107,26,0.22)';

const SCENARIOS = [
  {
    id: 's1',
    situation: 'A classmate gets a higher mark than you on an exam you studied hard for. Your immediate internal response is:',
    options: [
      {
        key:    'A',
        label:  'Genuine frustration at the gap — and a quiet curiosity about what they did differently.',
        type:   'SR',
        why:    'Self-respect can coexist with disappointment. Feeling frustrated is honest. Immediately becoming curious about what you can learn — rather than defensive about your rank — is the mark of a secure identity. You are not threatened by their success, because your worth is not defined by being ranked above them.',
      },
      {
        key:    'B',
        label:  'A need to find out how they did it so you can dismiss it — "they probably just got lucky" or "the teacher likes them."',
        type:   'EGO',
        why:    'Ego cannot tolerate someone else succeeding in its territory without finding a way to invalidate the result. Searching for reasons to discount their achievement is not critical thinking — it is identity protection. It is the mind trying to restore the hierarchy without doing the work of actually improving.',
      },
      {
        key:    'C',
        label:  'A heavy crash in how you feel about yourself overall — not just about the exam, but about everything.',
        type:   'NEITHER',
        why:    'Neither self-respect nor ego — this is conditional self-worth. When a single result collapses your entire sense of self, the problem is that your identity is too tightly tied to performance. This is not ego (ego would defend or attack). It is fragility — worth that is only intact when outcomes go well.',
      },
    ],
  },
  {
    id: 's2',
    situation: 'Someone criticises your work in front of others. Your first instinct is to:',
    options: [
      {
        key:    'A',
        label:  'Feel stung in the moment, take a breath, and ask a genuine question to understand what they mean.',
        type:   'SR',
        why:    'The sting is honest — criticism in public always activates the social threat response. But pausing before reacting and asking a clarifying question rather than defending or attacking is self-respect in action. It says: "My work can be improved without that meaning I am inadequate."',
      },
      {
        key:    'B',
        label:  'Immediately counter-attack — point out their flaws, dismiss the criticism, or go very cold and withdrawn.',
        type:   'EGO',
        why:    'Ego treats criticism as a threat to the entire self, not as information about a specific piece of work. The counter-attack or withdrawal is the ego\'s defence system activating — protecting the identity by refusing to let anything challenging actually land. The problem is that it also refuses to let any genuinely useful feedback land either.',
      },
      {
        key:    'C',
        label:  'Mentally replay it for days, catastrophise about what everyone now thinks of you, and over-apologise.',
        type:   'NEITHER',
        why:    'This is wounded self-worth, not ego. Ego would defend. Over-apologising and ruminating is the opposite — it is collapsing into the criticism and letting it define you far beyond what it merited. Self-respect would feel the criticism, assess it honestly, take what is useful, and release the rest.',
      },
    ],
  },
  {
    id: 's3',
    situation: 'A friend achieves something you have been working toward and have not yet reached. How do you genuinely respond?',
    options: [
      {
        key:    'A',
        label:  'Feel a flicker of envy and celebrate them anyway — and then use the envy as information about what you want.',
        type:   'SR',
        why:    'This is one of the most honest and courageous emotional responses possible. Feeling envy is human and automatic. What you do with it is the choice. Self-respect can hold both the genuine happiness for someone else and the honest acknowledgment of personal longing — without letting either one override the other.',
      },
      {
        key:    'B',
        label:  'Feel a strong need to remind yourself (and others) of your own achievements, or to subtly highlight why theirs is not as impressive.',
        type:   'EGO',
        why:    'Ego experiences another person\'s success as a threat to its own position. The need to re-assert your status — either internally or in the conversation — is ego trying to restore the hierarchy. Genuine self-respect can celebrate someone else wholeheartedly without needing to rebalance the scoreboard.',
      },
      {
        key:    'C',
        label:  'Feel genuinely happy for them in the moment and then quietly spiral into feeling behind and hopeless.',
        type:   'NEITHER',
        why:    'Again, this is conditional self-worth rather than ego. The capacity to feel happy for others is beautiful. But when other people\'s progress consistently makes you feel like you are failing, the issue is that your self-assessment depends too heavily on how you compare to others, rather than on your own direction of travel.',
      },
    ],
  },
  {
    id: 's4',
    situation: 'You realise you were wrong about something you argued strongly about. What happens next?',
    options: [
      {
        key:    'A',
        label:  'You feel a moment of awkwardness and then say clearly: "I was wrong about that."',
        type:   'SR',
        why:    'The ability to admit being wrong without making it a catastrophe is one of the cleanest indicators of genuine self-respect. It requires a stable identity that is not threatened by being incorrect. "Being wrong" and "being inadequate" are different things — and self-respect knows the difference.',
      },
      {
        key:    'B',
        label:  'You find a way to reframe it so you were not really wrong — or simply change the subject and never acknowledge it.',
        type:   'EGO',
        why:    'For ego, being wrong in public is a crisis — because ego equates being wrong with being inferior. The elaborate reframe or disappearing act is not dishonesty in the simple sense. It is the ego\'s survival strategy. The problem is that it forecloses genuine growth, destroys credibility over time, and exhausts everyone around it.',
      },
      {
        key:    'C',
        label:  'You apologise excessively, feel deeply ashamed, and bring it up again unprompted to keep demonstrating remorse.',
        type:   'NEITHER',
        why:    'Over-apologising and extended shame are not self-respect, but they are also not ego. They are self-punishment — identity that is so fragile it cannot bear the weight of a normal human mistake. Self-respect takes accountability proportionally: "I was wrong, here is what I should have said, I am moving on."',
      },
    ],
  },
  {
    id: 's5',
    situation: 'Someone close to you does something that genuinely crosses a line for you. You:',
    options: [
      {
        key:    'A',
        label:  'Have an honest, direct conversation about how it affected you — even if it is uncomfortable.',
        type:   'SR',
        why:    'Advocating for yourself clearly and directly without attacking the other person is self-respect in its most functional form. You are saying: "This matters to me, and so does our relationship, so I am going to address it rather than silently absorb it or dramatically escalate it."',
      },
      {
        key:    'B',
        label:  'Make sure they know you are unhappy — through cold behaviour, pointed comments, or making them come to you first.',
        type:   'EGO',
        why:    'Indirect punishment — the cold shoulder, the loaded comment, the refusal to address it directly — is ego maintaining control through emotional leverage. It is using the relationship as a stage for a power dynamic rather than a space for genuine connection. It does not resolve anything. It just establishes dominance and creates distance.',
      },
      {
        key:    'C',
        label:  'Say nothing, absorb it, and quietly add it to a list of reasons you feel resentful.',
        type:   'NEITHER',
        why:    'Saying nothing is not self-respect — it is the absence of self-advocacy, usually driven by a fear of conflict or a belief that your needs do not justify a conversation. The resentment that builds is the cost of unexpressed self-respect. Over time, those unexpressed needs either explode or corrode the relationship entirely.',
      },
    ],
  },
  {
    id: 's6',
    situation: 'Someone disagrees with your opinion on something that matters to you. You:',
    options: [
      {
        key:    'A',
        label:  'Listen to understand their position — and if you still disagree, say so without needing them to agree with you.',
        type:   'SR',
        why:    'Self-respect is not the need to be right. It is the security to hold a position while genuinely listening to a challenge. "I understand your point and I still see it differently" is the language of a person whose identity is not on the line in the disagreement.',
      },
      {
        key:    'B',
        label:  'Feel a strong need to convince them, get frustrated when you cannot, and think less of them for disagreeing.',
        type:   'EGO',
        why:    'Ego cannot tolerate a disagreement remaining a disagreement. If someone does not come around to your view, ego experiences it as a defeat — and assigns blame to the other person for being unreasonable or inferior. The compulsion to convince is not intellectual rigour. It is identity protection wearing the mask of debate.',
      },
      {
        key:    'C',
        label:  'Quickly back down even if you are not convinced — to avoid the discomfort of conflict.',
        type:   'NEITHER',
        why:    'This is not self-respect — it is conflict avoidance driven by anxiety about disapproval. Genuine self-respect includes the ability to hold a position when challenged without either attacking (ego) or collapsing (people-pleasing). The premature backdown sends the message — to yourself most of all — that your views do not deserve to be held.',
      },
    ],
  },
];

const TYPE_META = {
  SR: {
    label:  'Self-Respect',
    icon:   '🌿',
    color:  '#2D7D46',
    bg:     '#E8F5EE',
    border: 'rgba(45,125,70,0.25)',
    desc:   'This response comes from a secure, internally anchored sense of worth. It can hold discomfort without becoming defensive, and it does not require winning, being right, or being ranked above others.',
  },
  EGO: {
    label:  'Ego-Driven',
    icon:   '⚡',
    color:  '#C0392B',
    bg:     '#FDECEA',
    border: 'rgba(192,57,43,0.25)',
    desc:   'This response is driven by a need to protect or restore a fragile sense of status or superiority. It is not necessarily malicious — it is usually a defence mechanism operating below conscious awareness.',
  },
  NEITHER: {
    label:  'Wounded Self-Worth',
    icon:   '🌧️',
    color:  '#B54708',
    bg:     '#FEF3C7',
    border: 'rgba(181,71,8,0.25)',
    desc:   'This response is neither ego nor self-respect — it is the response of a self-worth that is conditional and fragile. It collapses rather than defends. Building self-respect is the long-term solution here.',
  },
};

// ── Scenario Sorter Component ──────────────────────────────────────────────────
function ScenarioSorter() {
  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [selected,  setSelected]  = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [done,      setDone]      = useState(false);

  const font     = "'Plus Jakarta Sans', system-ui, sans-serif";
  const scenario = SCENARIOS[current];
  const isLast   = current === SCENARIOS.length - 1;

  const handleSelect = (key) => {
    if (revealed) return;
    setSelected(key);
  };

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

  const handleReset = () => {
    setCurrent(0); setAnswers({}); setSelected(null); setRevealed(false); setDone(false);
  };

  // Results tally
  const counts = { SR: 0, EGO: 0, NEITHER: 0 };
  Object.entries(answers).forEach(([sid, key]) => {
    const sc  = SCENARIOS.find(s => s.id === sid);
    const opt = sc?.options.find(o => o.key === key);
    if (opt) counts[opt.type]++;
  });
  const dominant = done ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] : null;

  const ResultSummary = () => {
    const meta_d = TYPE_META[dominant];
    const SR_pct = Math.round((counts.SR / SCENARIOS.length) * 100);
    return (
      <div style={{ animation: 'floatUp 0.4s ease' }}>
        {/* Hero result */}
        <div style={{ background: `linear-gradient(135deg, ${AMBER}, #C49B3C)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{meta_d.icon}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
            Your Dominant Pattern: {meta_d.label}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
            {meta_d.desc}
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${ABORDER}` }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
            Your Response Pattern Across All 6 Scenarios
          </div>
          {Object.entries(counts).map(([type, count]) => {
            const tm  = TYPE_META[type];
            const pct = Math.round((count / SCENARIOS.length) * 100);
            return (
              <div key={type} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: tm.color }}>{tm.icon} {tm.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: tm.color }}>{count} / {SCENARIOS.length}</span>
                </div>
                <div style={{ height: '7px', background: 'var(--border)', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: tm.color, borderRadius: '7px', transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* What it means */}
        <div style={{ background: PALE, border: `2px solid ${ABORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: AMBER, marginBottom: '8px' }}>
            💡 What This Pattern Means for You
          </div>
          {dominant === 'SR' && (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              Your responses are largely grounded in genuine self-respect — a secure, internally sourced sense of worth that does not require the external world to confirm it. This does not mean you never feel threatened or defensive. It means that your default response is one of security rather than reaction. The challenge for people at this end of the spectrum is maintaining this groundedness under sustained pressure — particularly in environments that consistently reward ego behaviour.
            </p>
          )}
          {dominant === 'EGO' && (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              Your responses show a pattern of ego-driven defence that is more common than most people would admit, and almost always rooted in a self-worth that was built on performance and comparison rather than unconditional self-regard. The ego does not mean you are arrogant or malicious — it means that your sense of self needs frequent reinforcement and does not yet feel stable enough to handle challenge without defending. This is correctable, but it requires becoming curious about what is underneath the defensiveness.
            </p>
          )}
          {dominant === 'NEITHER' && (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              Your responses show a pattern of collapsed self-worth rather than inflated ego — you tend toward absorbing, shrinking, and over-adapting rather than defending or attacking. The path toward self-respect from here involves learning that your needs, limits, and perspectives are legitimate enough to be expressed — not sometimes, when you have earned it, but consistently, as a function of simply being a person. The work is in building the internal advocate that says "this matters to me" before the resentment builds.
            </p>
          )}
        </div>

        {/* Key insight */}
        <div style={{ background: 'white', border: `1.5px dashed ${ABORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: AMBER, marginBottom: '8px' }}>
            Your Key Insight
          </div>
          <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: AMBER, fontStyle: 'italic', lineHeight: 1.55 }}>
            {dominant === 'SR'      && '"Self-respect is not the absence of ego — it is the ongoing practice of not needing it."'}
            {dominant === 'EGO'     && '"The ego is loudest when the self-worth underneath it is quietest. Attend to the silence."'}
            {dominant === 'NEITHER' && '"Shrinking is not humility. Your needs are not too much. Self-respect begins the moment you stop treating your own voice as optional."'}
          </p>
        </div>

        <button onClick={handleReset} style={{
          background: 'transparent', border: `1.5px solid ${ABORDER}`, color: AMBER,
          padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
          fontWeight: '700', fontFamily: font,
        }}>↺ Retake the Scenarios</button>
      </div>
    );
  };

  if (done) return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <ResultSummary />
    </div>
  );

  const chosenOption = scenario.options.find(o => o.key === selected);

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Scenario {current + 1} of {SCENARIOS.length}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: AMBER }}>
            {Math.round((current / SCENARIOS.length) * 100)}% complete
          </span>
        </div>
        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '5px',
            background: `linear-gradient(90deg, ${AMBER}, #C49B3C)`,
            width: `${(current / SCENARIOS.length) * 100}%`, transition: 'width 0.35s ease',
          }} />
        </div>
      </div>

      {/* Situation */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: '1.5px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '7px' }}>
          The Situation
        </div>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--ink)', lineHeight: 1.6 }}>
          {scenario.situation}
        </p>
      </div>

      {/* Options */}
      <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        Which response feels most honest for you?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.key;
          const tm = TYPE_META[opt.type];
          const showType = revealed && isSelected;
          return (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              disabled={revealed}
              style={{
                padding: '14px 16px', borderRadius: '11px', border: '2px solid',
                borderColor: isSelected ? (revealed ? tm.color : AMBER) : 'var(--border)',
                background: isSelected ? (revealed ? tm.bg : PALE) : 'white',
                cursor: revealed ? 'default' : 'pointer', fontFamily: font,
                textAlign: 'left', fontSize: '14px', fontWeight: '500',
                color: 'var(--ink)', lineHeight: 1.55, transition: 'all 0.18s',
                boxShadow: isSelected ? `0 0 0 2px ${revealed ? tm.border : ABORDER}` : 'none',
              }}
            >
              <span style={{ marginRight: '8px', opacity: 0.5 }}>
                {opt.key === 'A' ? '🅐' : opt.key === 'B' ? '🅑' : '🅒'}
              </span>
              {opt.label}
              {showType && (
                <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: '700', color: tm.color }}>
                  — {tm.icon} {tm.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal / explanation */}
      {!revealed ? (
        <button
          onClick={handleReveal}
          disabled={!selected}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: selected ? `linear-gradient(135deg, ${AMBER}, #C49B3C)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: selected ? 'pointer' : 'not-allowed', fontFamily: font,
            transition: 'all 0.2s', boxShadow: selected ? `0 6px 18px ${ABORDER}` : 'none',
          }}
        >
          {selected ? 'See the Analysis →' : 'Choose a response above to continue'}
        </button>
      ) : (
        <div style={{ animation: 'floatUp 0.3s ease' }}>
          {/* Analysis card */}
          {chosenOption && (
            <div style={{
              background: TYPE_META[chosenOption.type].bg,
              border: `2px solid ${TYPE_META[chosenOption.type].border}`,
              borderRadius: '12px', padding: '18px 20px', marginBottom: '12px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: TYPE_META[chosenOption.type].color, marginBottom: '8px' }}>
                {TYPE_META[chosenOption.type].icon} Why this is {TYPE_META[chosenOption.type].label}
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>
                {chosenOption.why}
              </p>
            </div>
          )}
          <button
            onClick={handleNext}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${AMBER}, #C49B3C)`, color: 'white',
              fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
              boxShadow: `0 6px 18px ${ABORDER}`, transition: 'all 0.2s',
            }}
          >
            {isLast ? 'See My Full Results →' : 'Next Scenario →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SelfRespectVsEgo({ navigate, relatedPosts }) {
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
      <p>There is a conversation that happens constantly — in self-help content, in relationship advice, in conversations between students — where <strong>self-respect and ego</strong> are used interchangeably, as if they are the same thing in different proportions. They are not. They are fundamentally different in their origin, their function, and the kind of life they build for the person operating from each one.</p>

      <p>Getting this distinction wrong is expensive. People who mistake ego for self-respect spend enormous energy defending a sense of superiority that needs constant maintenance. People who mistake the absence of ego for low self-respect stay in relationships and situations that diminish them, telling themselves they are being humble. Both confusions cause real harm. This guide is about seeing the difference clearly.</p>

      <img
        src={meta.imgUrl}
        alt="Exploring the difference between self-respect and ego — psychology and real-life examples for students"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="definitions">1. Clear Definitions: What Each One Actually Means</h3>
      <p><strong>Self-respect</strong> is the stable, internally sourced recognition of your own worth. It does not require comparison to establish itself, does not require external validation to remain intact, and does not feel threatened when someone else succeeds, disagrees with you, or points out a mistake. It is quiet. It is consistent. And it allows for genuine accountability — the ability to say "I was wrong" or "that was not okay" without the admission destroying your entire sense of self.</p>
      <p>Self-respect is built through specific, repeatable behaviours: keeping commitments to yourself, advocating for your own needs, separating your worth from your performance, and treating yourself with the same basic dignity you extend to others. It is not a feeling you have — it is a practice you do.</p>
      <p><strong>Ego</strong> — in the psychological sense used here, as distinct from Freud's structural definition — is a defended sense of identity that requires superiority, approval, or control to remain stable. The ego is not inherently arrogant. More often, it presents as defensive, competitive, easily threatened, and unable to sustain genuine accountability. Its fundamental operating principle is comparison: "I am only valuable if I am more valuable than someone else."</p>
      <p>The crucial distinction is this: <strong>self-respect is a floor — a minimum standard below which you will not allow yourself to be treated</strong>, including by your own inner voice. Ego is a ceiling people keep raising — a perpetual performance of superiority that can never quite be satisfying because it depends on others cooperating with the hierarchy.</p>

      {/* ── Section 2 ── */}
      <h3 id="psychology">2. The Psychology Behind Self-Respect and Ego</h3>
      <p>Psychologist Abraham Maslow described self-esteem in his famous hierarchy of needs as having two components: the esteem you derive from actual achievement and competence (lower self-esteem), and the esteem you derive from recognition and status in the eyes of others (higher self-esteem). What Maslow did not fully account for — and what later research by psychologists like Kristin Neff and Mark Leary filled in — is a third form: <em>self-compassion-based self-worth</em>, which operates independently of both achievement and recognition.</p>
      <p>This third form is closest to what we are calling self-respect. Research consistently shows that people whose self-worth is built on this foundation are more resilient after failure, more genuinely compassionate toward others, less competitive and defensive in relationships, and more honest in their self-assessment. They can hear difficult feedback without becoming defensive because the feedback threatens the work, not the self.</p>
      <p>Ego-driven behaviour, by contrast, is almost always a defence mechanism operating in response to underlying insecurity. The psychologist Alfred Adler described what he called the "superiority striving" — the drive to compensate for feelings of inferiority by seeking power, status, and control. The ego is not the problem itself. The unaddressed sense of inadequacy underneath it is. The ego is just the loudest and most visible symptom.</p>
      <p>This is why ego behaviour is so often exhausting — both to observe and to maintain. It is not a stable structure. It is a continuous performance requiring constant environmental cooperation. When the environment stops cooperating — when someone succeeds at "your" thing, or disagrees with your position, or does not give you the acknowledgment you were counting on — the ego-driven person has a crisis. The self-respecting person has an inconvenience.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="scenario-test">3. Interactive: Self-Respect or Ego? Scenario Sorter</h3>
      <p>The gap between self-respect and ego is clearest in specific, concrete moments — the ones that put your identity under mild pressure and ask how you respond. Below are six real-life scenarios from student life. For each one, choose the response that is most honestly true for you — not the one that sounds best. At the end, you will receive a full breakdown of your dominant pattern and what it reveals about your current relationship with your own sense of worth.</p>

      <ScenarioSorter />

      {/* ── Section 4 ── */}
      <h3 id="real-life">4. Real-Life Examples: How Each One Shows Up Daily</h3>
      <p><strong>In receiving criticism:</strong> Self-respect can hear critical feedback about specific work or behaviour without experiencing it as a verdict on personhood. "My presentation had weak data" and "I am not capable" are genuinely different statements, and self-respect can hold that difference. Ego cannot — it hears all criticism as an attack on the self and responds by defending, dismissing, or attacking back.</p>
      <p><strong>In celebrating others:</strong> Self-respect can celebrate someone else's success without needing to reposition itself in relation to that success. A friend's achievement does not require commentary, diminishment, or an assertion of your own comparable achievements. Ego experiences other people's wins as information about the hierarchy — and either needs to find a reason to discount the win or immediately reassert its own position.</p>
      <p><strong>In admitting mistakes:</strong> Self-respect can say "I was wrong" in the same tone it uses to say "I was right" — as a simple assessment of reality, not a catastrophe or a crisis. Ego cannot admit error without finding a way to redistribute blame, reframe the situation, or minimise the failure. It cannot, because being wrong is experienced as being lesser — and being lesser is the thing the ego structure was built to prevent at all costs.</p>
      <p><strong>In setting limits:</strong> Self-respect sets limits from a place of clarity — "this is not acceptable to me and I am naming it" — without requiring the other person to apologise, change immediately, or be made to feel bad. Ego sets limits as dominance assertions — "you owe me an apology," "how dare you," "I will not be treated this way by someone like you" — where the limit is less about protecting the self and more about re-establishing superiority.</p>
      <p><strong>In disagreement:</strong> Self-respect can hold a position under pressure while genuinely listening to a counter-argument. The position may change based on new information — that is intellectual honesty, not weakness. Ego holds a position under pressure and calls it principle. It cannot distinguish between being genuinely convinced and being outmanoeuvred, so it refuses to be either.</p>

      {/* ── Section 5 ── */}
      <h3 id="balance">5. The Healthy Balance: Confidence Without Fragility</h3>
      <p>The goal is not the total elimination of ego. That is both impossible and probably undesirable — some degree of self-assertion, competitive drive, and identity protection serves real purposes. The goal is a self-worth that is secure enough that the ego does not need to work overtime to defend it.</p>
      <p>Psychologists call this <strong>non-contingent self-worth</strong> — worth that does not depend on external outcomes, comparative ranking, or continuous approval to remain stable. Building it is not a personality overhaul. It is a slow, repeatable practice across three specific domains.</p>
      <p><strong>Self-trust, built through self-commitment.</strong> Every time you make a commitment to yourself — however small — and follow through on it, you send your nervous system a message: "I am reliable to myself." This builds an internal foundation that external validation is not needed to supplement. It starts small. Go to sleep when you said you would. Complete the one task you promised yourself. Over months, these small kept promises accumulate into a stable sense of being someone you can count on.</p>
      <p><strong>Self-advocacy, built through honest expression.</strong> Every time you express a genuine need, limit, or preference — even imperfectly — rather than swallowing it, you strengthen the internal advocate. This is the voice that says "this matters to me" before resentment forces the conversation. Ego screams its needs as entitlements. Self-respect states them as facts. The practice is learning the difference and choosing the latter.</p>
      <p><strong>Self-separation, built through accountability.</strong> Every time you can say "I was wrong about that" or "I did not handle that well" without it becoming a crisis — you widen the gap between your identity and your behaviour. This separation is the foundation of genuine growth. Ego fuses identity and behaviour, which means any behavioural failure is an existential one. Self-respect separates them, which means failure is just information.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Self-Respect vs Ego FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Can someone have both self-respect and a strong ego at the same time?</strong><br />
        A: Yes, and it is more common than either extreme. Most people have areas of genuine self-respect — domains where their identity is secure and not threatened by challenge — and areas where ego operates defensively because the underlying self-worth is more fragile. The goal is not to eliminate all ego behaviour overnight. It is to gradually expand the secure territory until the defensive posturing has less and less ground to cover.</p>

        <p><strong>Q: How do I know if I am being self-respecting or just having a big ego in the moment?</strong><br />
        A: The fastest diagnostic is to ask: "Am I doing this because it reflects my values, or because I need to win?" Self-respecting behaviour is consistent regardless of audience — you hold the same limit whether or not anyone is watching. Ego behaviour is often audience-dependent: it performs most strongly when status is at stake and relaxes when no one is there to observe the hierarchy being established.</p>

        <p><strong>Q: Is it possible to build genuine self-respect if you grew up in an environment that damaged it?</strong><br />
        A: Yes — and this is one of the areas where the psychological research is most consistently encouraging. Self-worth is not fixed by early experience. It is rebuilt through the accumulation of new evidence, most of which comes from your own behaviour toward yourself: the commitments you keep, the limits you enforce, the care you extend. Therapy can significantly accelerate the process. But the rebuilding does not require a therapist — it requires a practice, applied consistently, over time.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: AMBER, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "The ego asks: am I better than them? Self-respect asks: am I being true to myself?"
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          One of those questions has an answer that depends entirely on other people. The other has an answer that is entirely yours. The one you spend more time asking will shape the kind of life — and the kind of relationships — you build.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: AMBER, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${ABORDER}` }}
          >
            Reflect Further in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: AMBER, border: `2px solid ${AMBER}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Thoughts Anonymously
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Building Your Inner Foundation:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-kindness-check')} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Mid-Month Reset: Are You Treating Yourself with Kindness?
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Set Boundaries Without Feeling Guilty (Student Guide)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/psychology-self-love')} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → The Psychology Behind Self-Love and Emotional Wellbeing
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
