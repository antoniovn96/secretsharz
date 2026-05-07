import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Deal with Peer Pressure Without Losing Yourself",
  excerpt: "Peer pressure on students is not always dramatic — it is rarely someone threatening you. More often it is quiet, subtle, and works by making you feel like the only one who sees things differently. Learn the psychology behind why it works, how to build the decision-making confidence to resist it, and practise your responses in our Pressure Proof Trainer.",
  category: "Mental Health",
  date: "23-02-2026",
  readTime: "7 min read",
  wordCount: 1040,
  imgUrl: "/blogss/2026/February/peer-pressure-students.jpg",
  tldr: "Peer pressure on students works because belonging is a biological need and the fear of social exclusion is neurologically real. This guide covers the psychology of why peer pressure is so effective, the specific forms it takes in Indian student life, practical decision-making frameworks, and includes the Pressure Proof Trainer — six realistic student scenarios where you practise identifying pressure and choosing your own response.",
  toc: [
    { id: "why-works",    title: "1. Why Peer Pressure Works (The Neuroscience of Belonging)",         level: 3 },
    { id: "forms",        title: "2. The Forms Peer Pressure Takes in Student Life",                   level: 3 },
    { id: "trainer",      title: "3. Interactive: The Pressure Proof Trainer",                         level: 3 },
    { id: "decisions",    title: "4. Decision-Making Tips That Actually Hold Under Pressure",           level: 3 },
    { id: "confidence",   title: "5. Building the Confidence to Stay Yourself",                        level: 3 },
    { id: "faq",          title: "6. Peer Pressure FAQs",                                              level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-23T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "peer pressure students, how to deal with peer pressure, peer pressure tips, dealing with peer pressure, peer pressure student life, peer pressure confidence, say no to peer pressure",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do students deal with peer pressure effectively?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective strategies for dealing with peer pressure combine three elements: clarity about your own values before the pressure situation arrives (so you are not making decisions in the moment from a blank slate), a pre-prepared response that does not require extensive explanation or justification, and the recognition that the discomfort of saying no is temporary while the consequences of saying yes against your values are often longer-lasting. Building confidence through small acts of self-assertion in low-stakes situations also develops the capacity to hold your ground in higher-stakes ones.",
      },
    },
    {
      "@type": "Question",
      "name": "What are examples of peer pressure in student life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Peer pressure on students takes many forms beyond the obvious ones. Academic peer pressure includes being pressured to share answers, downplay your achievements to fit in, or follow group study patterns that do not suit you. Social pressure includes going along with exclusion of classmates, attending events you do not want to attend, or behaving differently around certain groups to maintain acceptance. Lifestyle pressure includes adopting habits, spending patterns, or opinions that belong to the group rather than genuinely to you. The common thread is the implicit or explicit message that belonging requires conformity.",
      },
    },
    {
      "@type": "Question",
      "name": "Is peer pressure always negative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No — positive peer influence, sometimes called 'positive peer pressure,' is a real and powerful force. Being in a group that values academic excellence, physical health, creative ambition, or ethical behaviour creates genuine positive pressure that can motivate and sustain behaviour that serves you. The distinction between positive and negative peer pressure is not primarily about intensity — it is about direction. Pressure that moves you toward who you genuinely want to become is useful. Pressure that moves you away from your values and authentic self is the kind this guide addresses.",
      },
    },
  ],
};

// ── Pressure Proof Trainer Data ────────────────────────────────────────────────
const SLATE   = '#2C4A6E';
const SPALE   = '#EEF2F8';
const SBORDER = 'rgba(44,74,110,0.22)';

const SCENARIOS = [
  {
    id: 'p1',
    context: 'Academic integrity — exam season',
    setup: 'Your study group has been sharing answer sheets before internal exams. "Everyone does it," they say. "The teacher doesn\'t even check. You\'re making it weird for everyone else by not participating." You have not cheated before and are uncomfortable with it.',
    options: [
      {
        key:   'A',
        type:  'CAVE',
        label: 'Go along with it to avoid the tension. You can always make up for it with the final exam.',
        why:   'The "I\'ll make up for it later" rationalisation is one of the most common ways peer pressure succeeds — it delays the discomfort of asserting a value rather than resolving it. The participation also builds a habit: once you have done it once, the next time the threshold is lower.',
        cost:  'Academic risk, erosion of self-trust, increased dependence on the group\'s approval.',
      },
      {
        key:   'B',
        type:  'OWN',
        label: 'Say clearly: "I am not comfortable with this — I am going to study from my own notes. You all do what you need to do."',
        why:   'This response is non-judgemental (you are not telling them what to do), clear about your own position, and does not require their agreement. "You\'re making it weird" is a social pressure tactic — making your self-respect into the group\'s inconvenience. Your response recognises that and does not accept the reframe.',
        cost:  'Temporary social discomfort. Possible short-term distance from the group.',
      },
      {
        key:   'C',
        type:  'DEFLECT',
        label: 'Pretend you already submitted and come up with a reason to leave early every time it happens.',
        why:   'Avoidance protects you in the immediate moment but does not resolve the pattern. You will keep having to manage the avoidance indefinitely, and the group dynamic remains unchanged. This is a strategy that costs energy without building anything.',
        cost:  'Ongoing management burden, no genuine resolution, no clarity established.',
      },
    ],
    insight: 'Academic pressure is among the most effective forms because it combines fear of falling behind with the social threat of group exclusion. The phrase "everyone does it" is specifically designed to make your values look like the outlier. They are not — they are just more visible when others are not applying them.',
    script: '"I\'m not going to participate in this — that\'s my decision for me, not a comment on anyone else\'s choice. I\'ll see you after."',
  },
  {
    id: 'p2',
    context: 'Social exclusion — friend group dynamics',
    setup: 'Your friend group has decided to freeze out a classmate who upset one of them. They expect you to do the same — ignoring her messages, not inviting her to things. You do not actually have an issue with her. The group says, "If you are really our friend, you will back us up."',
    options: [
      {
        key:   'A',
        type:  'CAVE',
        label: 'Go along with it. You do not want to lose the whole group over one person.',
        why:   '"If you\'re really our friend you will do this" is conditional love language — it makes group membership contingent on compliance with group behaviour. Accepting this framing once teaches the group that your values are negotiable when the price is social belonging.',
        cost:  'Participating in behaviour that conflicts with your values; teaching others that your loyalty is purchasable through social threat.',
      },
      {
        key:   'B',
        type:  'OWN',
        label: 'Say: "I hear that you\'re upset with her. I\'ll support you through that. But I\'m not going to freeze her out — that\'s not something I do. I am still your friend."',
        why:   'This response separates two things the group has tried to conflate: supporting your friend emotionally and participating in collective exclusion. You can do the first without doing the second. The clear statement "I am still your friend" addresses the implicit threat without accepting its premise.',
        cost:  'Group tension. Possible temporary friction.',
      },
      {
        key:   'C',
        type:  'DEFLECT',
        label: 'Stay quiet and just be less responsive to both sides, hoping it blows over.',
        why:   'Silence in a group exclusion situation is functionally participation — the person being excluded experiences your absence from the group\'s collective behaviour as choosing the group. Hoping it "blows over" avoids the difficulty but also abandons your values and the person being excluded.',
        cost:  'Complicity through inaction; no clarity for anyone including yourself.',
      },
    ],
    insight: '"If you\'re really my friend" is one of the most effective peer pressure phrases in existence because it reframes your values as a loyalty problem. Real friendship does not require you to compromise your character. A group that demands that is not asking for your loyalty — it is demanding your compliance.',
    script: '"I support you, I\'m not going anywhere as your friend. And I\'m also going to keep being decent to her — that\'s just who I am."',
  },
  {
    id: 'p3',
    context: 'Lifestyle and money — spending patterns',
    setup: 'Your college friend group regularly eats out at expensive restaurants and travels on weekends. You cannot afford it consistently, but every time you decline you get "Oh come on, it\'s not that expensive" or subtle comments that make you feel like you are being difficult. You have gone a few times and regretted the financial stress afterward.',
    options: [
      {
        key:   'A',
        type:  'CAVE',
        label: 'Keep going so you do not feel left out, and deal with the financial stress separately.',
        why:   'Chronic financial overextension to maintain social belonging is one of the most concrete and measurable costs of peer pressure. The stress accumulates, the resentment builds, and the social dynamic that required the compromise does not even know it happened.',
        cost:  'Real financial harm, accumulated resentment, no authentic change in the dynamic.',
      },
      {
        key:   'B',
        type:  'OWN',
        label: 'Be honest: "This is outside my budget right now — I\'m going to sit this one out. Let me know when you want to do something that works for me too."',
        why:   'Financial honesty is one of the most countercultural forms of self-respect in student social environments. "This is outside my budget" requires no apology, no elaborate explanation, and no alternative justification. It is a factual statement about your reality, and offering a genuine alternative signals that you want the connection without the specific financial pressure.',
        cost:  'Temporary FOMO. Possible mild social friction.',
      },
      {
        key:   'C',
        type:  'DEFLECT',
        label: 'Always find a different reason — busy, tired, not feeling well — to avoid the financial explanation.',
        why:   'Excuse-making perpetuates the assumption that if the excuse were not present, you would participate. It also becomes exhausting to maintain. The real reason — "this doesn\'t work for my finances" — is straightforward and requires no ongoing management.',
        cost:  'Ongoing excuse manufacturing, no change in dynamic, dishonesty that gradually erodes self-trust.',
      },
    ],
    insight: '"It\'s not that expensive" from someone who does not share your financial reality is a perspective, not a fact. Your budget is yours. Changing your spending to maintain social acceptance is not generosity — it is financial self-harm in service of approval.',
    script: '"My budget is a real thing and I\'m not going to apologise for it. What else can we do together that works for everyone?"',
  },
  {
    id: 'p4',
    context: 'Opinion and identity — group conformity',
    setup: 'In a group conversation, your friend group is expressing a strong opinion about something — a political view, a judgement about another person, or a social stance — that you genuinely disagree with. The consensus is clearly formed. Agreeing would be easy. Speaking up feels risky.',
    options: [
      {
        key:   'A',
        type:  'CAVE',
        label: 'Stay quiet or nod along. It is not worth the argument, and maybe you are wrong anyway.',
        why:   '"Maybe I am wrong anyway" is the internal language of self-silencing under social pressure. Sometimes you are wrong and changing your view is growth. But suppressing a genuine view specifically because expressing it feels socially risky — while privately still holding it — is a different thing. It produces the specific loneliness of pretending to be someone you are not with people who think they know you.',
        cost:  'Gradual erosion of authentic presence in the group; private loneliness; the group never knowing the real you.',
      },
      {
        key:   'B',
        type:  'OWN',
        label: 'Say: "I actually see it differently — I think [your view]. I\'m not trying to start a fight, I just don\'t want to pretend I agree when I don\'t."',
        why:   'Naming your disagreement without requiring others to change their view is the language of intellectual self-respect. "I\'m not trying to start a fight" pre-empts the common group interpretation of any dissent. Your right to hold a different view is not contingent on being able to convince them.',
        cost:  'Possible pushback or tension. Being the dissenting voice.',
      },
      {
        key:   'C',
        type:  'DEFLECT',
        label: 'Change the subject or make a joke that moves the conversation on without committing either way.',
        why:   'Deflection is a valid short-term tactic in genuinely unsafe environments. In a friend group, it is usually avoidance of the discomfort of disagreement rather than a genuine safety concern. It leaves you present physically and absent genuinely.',
        cost:  'Authenticity lost; the pattern of self-erasure in group settings deepens.',
      },
    ],
    insight: 'Group consensus is powerful precisely because it activates the brain\'s social conformity circuitry — named the "Solomon Asch effect" after his famous conformity experiments in the 1950s, which showed that people will state clearly wrong answers to agree with a group. Knowing the mechanism is the first step to choosing differently.',
    script: '"I\'m going to be honest — I see this differently. I might be wrong, but I\'d rather say it than pretend I agree."',
  },
  {
    id: 'p5',
    context: 'Substances and risky behaviour',
    setup: 'At a college gathering, you are offered something — alcohol, a substance — that you do not want. The group is relaxed and welcoming but persistent: "Just one," "Don\'t be so uptight," "You\'re not going to have fun otherwise." You feel the pull to participate so you do not look different.',
    options: [
      {
        key:   'A',
        type:  'CAVE',
        label: 'Go along with it — just this once, to avoid the social weirdness.',
        why:   '"Just this once" is how most long-term patterns begin. The social weirdness of declining lasts minutes. The decision to participate when you did not want to can last much longer in how you feel about yourself and in the pattern it establishes for future situations.',
        cost:  'Immediate physical and personal cost of doing something you did not want to; precedent set for future situations.',
      },
      {
        key:   'B',
        type:  'OWN',
        label: '"No thanks — I\'m good as I am." (No explanation, no apology, no elongated justification.)',
        why:   'A short, confident no is more effective than a long explanation in these situations. Explanations invite counter-arguments. "No thanks" is complete. The confidence comes from the delivery, not the words — and each time you deliver it cleanly, the next time becomes slightly easier.',
        cost:  'The momentary social weirdness that dissolves within minutes.',
      },
      {
        key:   'C',
        type:  'DEFLECT',
        label: 'Say you are driving later, on medication, or have an early morning — any reason that is not the real one.',
        why:   'An excuse in this context is understandable — particularly when safety is a factor in the specific environment. However, the repeated use of excuses rather than honest nos keeps you in a dynamic where your actual values are never known or respected, and where you carry the cognitive load of constructing and maintaining false reasons.',
        cost:  'Ongoing excuse management; values permanently hidden from your social circle.',
      },
    ],
    insight: '"You\'re not going to have fun otherwise" is a false premise. Fun does not require participation in any specific activity. And a group whose idea of fun requires your compliance with their substance choices is not asking you to join the fun — they are asking you to validate their choices.',
    script: '"No thanks, I\'m good." (Said once, not repeated, not explained. If pushed again: "I said no thanks.")',
  },
  {
    id: 'p6',
    context: 'Academic competition — downplaying achievement',
    setup: 'You did well on an exam your friend group struggled with. You can feel the tension when results come up. The group culture implicitly — and sometimes explicitly — expects you to downplay your result, make jokes about it, or redirect to someone else\'s topic. You have started doing this automatically.',
    options: [
      {
        key:   'A',
        type:  'CAVE',
        label: 'Keep minimising your results to keep the peace. It is not worth the awkwardness.',
        why:   'Systematically shrinking your accomplishments to manage others\' comfort is a specific form of peer pressure cost that is rarely discussed. Over time it produces: resentment toward the group, a privately distorted self-narrative, and the exhausting maintenance of a persona that is smaller than who you actually are.',
        cost:  'Chronic self-erasure; resentment; gradual loss of authentic connection with the group.',
      },
      {
        key:   'B',
        type:  'OWN',
        label: 'Receive it honestly — "I did well, I worked hard for it" — and then genuinely ask how you can help others catch up.',
        why:   'Acknowledging your achievement without either performing it or hiding it is the genuine middle ground. Immediately offering to help reframes your result as a resource for the group rather than a threat. It is both honest and relational — and it does not require you to pretend you did not work hard.',
        cost:  'Some initial awkwardness. Being the person who names the dynamic differently.',
      },
      {
        key:   'C',
        type:  'DEFLECT',
        label: 'Change the subject before anyone can ask about your result.',
        why:   'Pre-emptive deflection means you are already anticipating the social cost of your own achievement before it has been demanded. This is internalised peer pressure — you are doing the shrinking before anyone even asks. The avoidance provides short-term relief but reinforces the belief that your success is socially dangerous.',
        cost:  'Internalised self-suppression; no change in the underlying dynamic.',
      },
    ],
    insight: 'A group where your success requires apology or minimisation is not a group that is celebrating you — it is a group that has made your containment a condition of belonging. Genuine friendship can hold the tension of differential outcomes without requiring anyone to shrink. You are allowed to succeed without performing shame about it.',
    script: '"I did well — I worked hard for it and I\'m pleased. What do you need help understanding before the next one?"',
  },
];

const TYPE_META = {
  OWN:     { label: 'Assertive Response',  icon: '✅', color: '#2D7D46', bg: '#E8F5EE' },
  CAVE:    { label: 'Pressure Cave-In',    icon: '🔴', color: '#C0392B', bg: '#FDECEA' },
  DEFLECT: { label: 'Strategic Deflection', icon: '🟡', color: '#C07800', bg: '#FFF8E1' },
};

// ── Trainer Component ──────────────────────────────────────────────────────────
function PressureProofTrainer() {
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [done,     setDone]     = useState(false);

  const font     = "'Plus Jakarta Sans', system-ui, sans-serif";
  const scenario = SCENARIOS[current];
  const isLast   = current === SCENARIOS.length - 1;

  const handleSelect = (key) => { if (!revealed) setSelected(key); };
  const handleReveal = () => { if (!selected) return; setRevealed(true); setAnswers(prev => ({ ...prev, [scenario.id]: selected })); };
  const handleNext   = () => { if (isLast) { setDone(true); return; } setSelected(null); setRevealed(false); setCurrent(c => c + 1); };
  const handleReset  = () => { setCurrent(0); setAnswers({}); setSelected(null); setRevealed(false); setDone(false); };

  const tally = { OWN: 0, CAVE: 0, DEFLECT: 0 };
  Object.entries(answers).forEach(([sid, key]) => {
    const sc  = SCENARIOS.find(s => s.id === sid);
    const opt = sc?.options.find(o => o.key === key);
    if (opt) tally[opt.type]++;
  });

  const chosenOption = scenario?.options.find(o => o.key === selected);

  if (done) {
    const assertPct = Math.round((tally.OWN / SCENARIOS.length) * 100);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          {/* Score */}
          <div style={{ background: `linear-gradient(135deg, ${SLATE}, #3D6490)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              Pressure Proof Score: {assertPct}%
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
              {assertPct >= 70
                ? 'Strong. You are holding your own in most pressure situations. The work now is consistency — maintaining this under higher emotional stakes.'
                : assertPct >= 40
                ? 'Developing. You are assertive in some situations but cave or deflect in others. Understanding which situations trigger which response is the key next step.'
                : 'You have significant room to build your pressure-resistance. The good news: this is entirely learnable, and every scenario you practise changes the neural pathway.'}
            </div>
          </div>

          {/* Tally */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${SBORDER}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
              Your Response Pattern
            </div>
            {Object.entries(tally).map(([type, count]) => {
              const tm  = TYPE_META[type];
              const pct = Math.round((count / SCENARIOS.length) * 100);
              return (
                <div key={type} style={{ marginBottom: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: tm.color }}>{tm.icon} {tm.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: tm.color }}>{count} / {SCENARIOS.length}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: tm.color, borderRadius: '6px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          <div style={{ background: SPALE, border: `2px solid ${SBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: SLATE, marginBottom: '8px' }}>
              💡 Your Pressure Profile
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75 }}>
              {tally.CAVE >= 3
                ? 'Your primary pattern under pressure is to cave — to prioritise social harmony and belonging over your own values in the moment. This is not weakness; it is the result of a nervous system that has learned that disagreement is dangerous. The retraining happens through practice in low-stakes situations, building evidence that asserting yourself is survivable and often respected.'
                : tally.DEFLECT >= 3
                ? 'Your primary pattern is deflection — avoiding direct confrontation through excuses, humour, or redirection. This protects you without fully caving, which shows genuine self-awareness. The growth edge is moving from managing the pressure to addressing it, which requires practising the direct response even when the indirect one is easier.'
                : 'You show a strong tendency toward assertive responses — naming your position clearly without aggression. The key development area is consistency: applying this pattern not just in the scenarios where it comes naturally, but in the ones that involve the highest emotional stakes for you personally.'}
            </p>
          </div>

          {/* Key mantra */}
          <div style={{ background: 'white', border: `1.5px dashed ${SBORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: SLATE, marginBottom: '8px' }}>
              Your Pressure Proof Mantra
            </div>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: SLATE, fontStyle: 'italic', lineHeight: 1.55 }}>
              {tally.CAVE >= 3
                ? '"Their comfort with my compliance is not more important than my comfort with myself."'
                : tally.DEFLECT >= 3
                ? '"The direct answer is braver than the clever dodge — and I am capable of it."'
                : '"Staying myself in a crowd is not arrogance. It is the most honest thing I can offer."'}
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${SBORDER}`, color: SLATE,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retrain the Scenarios</button>
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
            Scenario {current + 1} of {SCENARIOS.length}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: SLATE }}>{Math.round((current / SCENARIOS.length) * 100)}% complete</span>
        </div>
        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '5px', background: `linear-gradient(90deg, ${SLATE}, #3D6490)`, width: `${(current / SCENARIOS.length) * 100}%`, transition: 'width 0.35s ease' }} />
        </div>
      </div>

      {/* Context badge */}
      <div style={{ display: 'inline-block', background: SPALE, border: `1px solid ${SBORDER}`, borderRadius: '20px', padding: '4px 12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: SLATE }}>
          Context: {scenario.context}
        </span>
      </div>

      {/* Setup */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: '1.5px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>The Situation</div>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: 'var(--ink)', lineHeight: 1.65 }}>{scenario.setup}</p>
      </div>

      {/* Options */}
      <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        What would you most honestly do?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {scenario.options.map(opt => {
          const isSel = selected === opt.key;
          const tm    = TYPE_META[opt.type];
          return (
            <button key={opt.key} onClick={() => handleSelect(opt.key)} disabled={revealed} style={{
              padding: '14px 16px', borderRadius: '11px', border: '2px solid',
              borderColor: isSel ? (revealed ? tm.color : SLATE) : 'var(--border)',
              background: isSel ? (revealed ? tm.bg : SPALE) : 'white',
              cursor: revealed ? 'default' : 'pointer', fontFamily: font,
              textAlign: 'left', fontSize: '14px', fontWeight: '500',
              color: 'var(--ink)', lineHeight: 1.55, transition: 'all 0.18s',
              boxShadow: isSel ? `0 0 0 2px ${revealed ? tm.color + '40' : SBORDER}` : 'none',
            }}>
              <span style={{ marginRight: '8px', opacity: 0.5 }}>{opt.key === 'A' ? '🅐' : opt.key === 'B' ? '🅑' : '🅒'}</span>
              {opt.label}
              {revealed && isSel && (
                <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: '700', color: tm.color }}>
                  — {tm.icon} {tm.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal / Next */}
      {!revealed ? (
        <button onClick={handleReveal} disabled={!selected} style={{
          width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
          background: selected ? `linear-gradient(135deg, ${SLATE}, #3D6490)` : 'var(--border)',
          color: 'white', fontWeight: '700', fontSize: '15px',
          cursor: selected ? 'pointer' : 'not-allowed', fontFamily: font,
          transition: 'all 0.2s', boxShadow: selected ? `0 6px 18px ${SBORDER}` : 'none',
        }}>
          {selected ? 'See the Analysis →' : 'Choose a response above to continue'}
        </button>
      ) : (
        <div style={{ animation: 'floatUp 0.3s ease' }}>
          {/* Analysis card */}
          {chosenOption && (
            <div style={{ background: TYPE_META[chosenOption.type].bg, border: `2px solid ${TYPE_META[chosenOption.type].color}40`, borderRadius: '12px', padding: '16px 18px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: TYPE_META[chosenOption.type].color, marginBottom: '7px' }}>
                {TYPE_META[chosenOption.type].icon} {TYPE_META[chosenOption.type].label} — Why
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75 }}>{chosenOption.why}</p>
              {chosenOption.cost && (
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted)' }}>
                  <span style={{ fontWeight: '700', color: 'var(--ink-soft)' }}>Hidden cost: </span>{chosenOption.cost}
                </div>
              )}
            </div>
          )}
          {/* Insight + script */}
          <div style={{ background: SPALE, border: `1.5px solid ${SBORDER}`, borderRadius: '12px', padding: '15px 18px', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE, marginBottom: '7px' }}>🧠 The Pressure Insight</div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{scenario.insight}</p>
          </div>
          <div style={{ background: 'white', border: `1.5px dashed ${SBORDER}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE, marginBottom: '7px' }}>🎯 The Assertive Script</div>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: SLATE, fontStyle: 'italic', lineHeight: 1.6 }}>{scenario.script}</p>
          </div>
          <button onClick={handleNext} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: `linear-gradient(135deg, ${SLATE}, #3D6490)`, color: 'white',
            fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
            boxShadow: `0 6px 18px ${SBORDER}`, transition: 'all 0.2s',
          }}>
            {isLast ? 'See My Results →' : 'Next Scenario →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PeerPressureStudents({ navigate, relatedPosts }) {
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
      <p>Peer pressure on students is rarely the scene from a movie — the dramatic moment where someone stands in front of you with an ultimatum. Real peer pressure is quieter. It is the group's raised eyebrows when you decline. The casual "everyone does it" that makes your values feel like a personality defect. The slow, barely-noticed accumulation of small compromises until one day you look in the mirror and cannot quite recognise the person looking back.</p>

      <p>Losing yourself to peer pressure does not happen in one dramatic moment. It happens in the repeated choice of other people's comfort over your own clarity — until your clarity stops being available when you reach for it. Learning to deal with <strong>peer pressure as a student</strong> is not about becoming confrontational or antisocial. It is about knowing who you are clearly enough that the pressure does not find any purchase.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning how to deal with peer pressure while staying confident and true to themselves"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-works">1. Why Peer Pressure Works (The Neuroscience of Belonging)</h3>
      <p>Peer pressure is effective not because students are weak or easily manipulated — but because it targets something neurologically fundamental. Belonging is not a nice-to-have. It is a survival mechanism. Human beings evolved in small groups where social exclusion was a genuine existential threat: separation from the tribe in ancestral environments meant reduced protection, reduced food access, and reduced chances of survival. The brain that learned to prioritise social harmony and conformity was the brain that survived.</p>
      <p>Neuroscientist Naomi Eisenberger's research at UCLA demonstrated that social rejection activates the same neural circuitry as physical pain — the anterior cingulate cortex and anterior insula. This means the discomfort of saying no to a group, of being the one who sees things differently, of risking exclusion by asserting an unpopular position, is neurologically real. It is not weakness or oversensitivity. It is biology.</p>
      <p>Solomon Asch's landmark conformity studies in the 1950s added another layer: when shown clearly incorrect answers, a significant majority of participants gave the wrong answer simply because the group had. The pressure to conform did not require threats, punishment, or even explicit persuasion — the mere presence of social consensus was sufficient to override individual perception. Your brain is wired to treat group consensus as information about reality, not just about social preference.</p>
      <p>Understanding this changes the self-talk around peer pressure significantly. The moment of hesitation before asserting your position in a group is not evidence that you are a pushover. It is your amygdala doing its job — assessing social threat and running its standard cost-benefit on belonging vs. autonomy. What changes with awareness and practice is not the presence of that hesitation but what you choose to do with it.</p>

      {/* ── Section 2 ── */}
      <h3 id="forms">2. The Forms Peer Pressure Takes in Student Life</h3>
      <p><strong>Academic pressure</strong> is one of the most common and least discussed forms. It includes pressure to share answers or assessments, pressure to downplay achievements so others do not feel threatened, pressure to follow group study patterns that do not suit your learning style, and pressure to pick courses, streams, or career paths based on what the group is doing rather than what genuinely calls you. The particular danger of academic peer pressure is that it often comes disguised as loyalty: "We are a team, we help each other" — which is true and valuable until helping the team means compromising your own integrity.</p>
      <p><strong>Social conformity pressure</strong> operates through inclusion and exclusion mechanics. Going along with the group's assessment of a person you actually have no issue with, adopting opinions you do not hold to fit a social space, and suppressing genuine reactions to maintain the group's emotional climate — these are the everyday texture of social peer pressure in student environments. It rarely announces itself. It just makes the alternative — being the person who sees it differently — feel increasingly costly over time.</p>
      <p><strong>Lifestyle and spending pressure</strong> is particularly acute in college environments where socioeconomic diversity is high and visible. The pressure to match spending patterns, lifestyle choices, and leisure habits that belong to the wealthiest or most socially dominant segment of a group produces real financial and psychological costs — and is almost never named or acknowledged as peer pressure because it is so structurally normalised.</p>
      <p><strong>Identity and aspiration pressure</strong> is perhaps the most personally costly in the long run. The slow recalibration of what you want, what you value, and who you are toward what the group wants, values, and is — such that eventually your own preferences become genuinely unclear to you, because they have been subordinated for so long that you have stopped being able to access them reliably.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="trainer">3. Interactive: The Pressure Proof Trainer</h3>
      <p>Reading about peer pressure builds understanding. Practising responses to realistic pressure scenarios builds the actual capacity to respond differently when you are in one. The Pressure Proof Trainer presents six scenarios drawn directly from student life — academic, social, financial, and identity contexts. For each one, choose what you would most honestly do. After each response, you will receive an analysis of the response pattern, the hidden cost, and the assertive script that works in that situation.</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '4px' }}>Choose the response that is honest, not the one that sounds most assertive. The value is in the accuracy of the self-assessment, not the performance of confidence.</p>

      <PressureProofTrainer />

      {/* ── Section 4 ── */}
      <h3 id="decisions">4. Decision-Making Tips That Actually Hold Under Pressure</h3>
      <p><strong>Decide before the moment, not in it.</strong> The single most effective decision-making strategy for managing peer pressure is to have already decided — in the quiet, before the social situation — what your values are and what you will and will not do. When you are in a pressure situation, your cognitive resources are occupied by social processing, threat assessment, and emotional regulation. There is genuinely less capacity for values-based reasoning in the moment than outside it. The decision made in advance is the one that holds. The decision improvised under social pressure is the one that caves.</p>
      <p><strong>Use the two-question test.</strong> When you feel pressure to do something, two questions cut through the social noise quickly. First: "Would I do this if none of these people were watching and there were no social consequence either way?" If the honest answer is no, the motivation is entirely social rather than genuine. Second: "How will I feel about this tomorrow, and the day after?" Peer pressure decisions often feel immediately comfortable and later costly. Your future self's opinion is more reliable than your present social anxiety.</p>
      <p><strong>Separate the person from the pressure.</strong> Most peer pressure is not malicious — it comes from people who have not examined their own conformity and who genuinely expect yours. Separating "my friend is a good person" from "this specific request is something I do not want to do" makes it possible to decline without it feeling like a rejection of the whole relationship. You are not rejecting them. You are declining the specific ask. Holding that distinction in your own mind makes your response cleaner and less emotionally loaded.</p>
      <p><strong>Use time as a buffer.</strong> "Let me think about it" is a complete and legitimate response to any pressure situation that does not require an immediate answer. It creates space between the social activation and the decision, during which the pressure diminishes and your own perspective becomes more accessible. "Let me think about it" is not avoidance — it is deliberate use of time to restore the decision-making capacity that social pressure temporarily depletes. Many decisions that feel impossible to refuse in the moment feel easy to decline the following morning.</p>

      {/* ── Section 5 ── */}
      <h3 id="confidence">5. Building the Confidence to Stay Yourself</h3>
      <p><strong>Know your values explicitly, not just implicitly.</strong> Most people have a vague sense of what matters to them. They would struggle to write it down clearly. The problem with implicit values is that they are harder to access under pressure — when the social threat response has activated, you are operating from the part of the brain that asks "what will make me safe?" rather than "what do I actually believe?" Writing your values down — three to five clear statements about what you will and will not do, and why — makes them accessible in the moment in a way that a vague sense of yourself cannot.</p>
      <p><strong>Build pressure-resistance through small consistent acts.</strong> The capacity to resist peer pressure in significant situations is built through practice in small ones. Every time you order what you actually want rather than what someone expects. Every time you say you did not enjoy a film everyone loved. Every time you express a genuine opinion in a group, knowing it might not be popular. These micro-acts of self-assertion are the training ground for the significant ones. They accumulate into a nervous system that has evidence that asserting yourself is survivable — often even respected.</p>
      <p><strong>Find at least one other person who sees it similarly.</strong> Asch's conformity experiments had a powerful finding: when even one other person in the group gave the accurate (non-conformist) answer, the conformity rate in other participants dropped dramatically. You do not need a majority. You need one person — one friend, one classmate, one person in any group context — who holds similar values and is willing to act on them. That one person changes the social calculus entirely. Finding your people does not mean finding people exactly like you — it means finding people who will not require you to erase yourself as the price of admission.</p>
      <p><strong>Reframe social rejection as relational information.</strong> The fear that powers most peer pressure capitulation is the fear that saying no will produce rejection. Sometimes it does produce friction. Rarely does it produce the catastrophic social collapse the fear predicts. And when a relationship cannot survive your honesty, your values, or your priorities — that is information about the relationship, not about you. A social circle that holds together only through conformity is not a safe community. It is a managed performance. You are allowed to want something more durable than that.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Peer Pressure FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: My entire social group pressures me. If I start saying no, I will be completely alone. What do I do?</strong><br />
        A: This is the most honest and most common fear behind sustained peer pressure capitulation. The answer is uncomfortable but worth hearing: a social group that can only hold together through universal compliance is already providing a fragile form of belonging. You are not really known in it — a performance of you is known. The work of building genuine belonging — finding people who can accept your actual preferences, values, and opinions — begins with enough self-assertion to signal who you actually are. That process is gradual and does not require burning every bridge simultaneously. Start small. One honest statement. One declined request. Observe what happens. The apocalyptic social consequence is almost always smaller than the fear predicted.</p>

        <p><strong>Q: How do I handle peer pressure from Indian parents or family, not just peers?</strong><br />
        A: Family pressure shares the psychological architecture of peer pressure — it activates belonging needs, uses implicit and explicit threat of disapproval, and targets conformity to group norms — but operates with significantly higher power dynamics and deeper emotional stakes. The assertiveness framework that works with peers requires modification for family contexts: more patient negotiation, more explicit framing of your choices in terms of collective outcomes ("I choose this because it will help me contribute more"), and a longer timeline for change. The goal is not confrontation but incremental honest self-representation within relationships where the power differential is real and the stakes are genuinely high.</p>

        <p><strong>Q: Is it ever okay to go along with the group even when you disagree?</strong><br />
        A: Yes — and distinguishing when this is healthy compromise versus unhealthy capitulation is important. Healthy flexibility is choosing to go along with something minor that does not conflict with your values because maintaining relational harmony in that specific context matters more. Unhealthy capitulation is regularly overriding your genuine values, preferences, or wellbeing to avoid social discomfort. The question to ask is: "Am I choosing this from genuine flexibility, or from fear?" One is self-determined. The other is pressure-driven. Both produce the same external behaviour — but they have very different internal costs over time.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SLATE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Ralph Waldo Emerson</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          The most powerful thing you can bring to any group is a clear, honest version of yourself. Not a version that has been quietly calibrated to match what the group expects — the actual, whole, sometimes-inconvenient version. That person is the one worth knowing. And the groups worth being in are the ones that agree.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SLATE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORDER}` }}
          >
            Build Your Confidence in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: SLATE, border: `2px solid ${SLATE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Building Your Resilience:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/saying-no-mental-health')} style={{ background: 'none', border: 'none', color: SLATE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Why Saying No is Important for Mental Health
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-respect-vs-ego')} style={{ background: 'none', border: 'none', color: SLATE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Self-Respect vs Ego: Understanding the Real Difference
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-acceptance-confidence')} style={{ background: 'none', border: 'none', color: SLATE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Build Confidence Through Self-Acceptance
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: SLATE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
