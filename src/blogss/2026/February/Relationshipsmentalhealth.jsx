import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How Relationships Affect Your Mental Health (Positive & Negative)",
  excerpt: "Every relationship you are in right now is either adding to your mental health or subtracting from it — often both, in different ways. Learn the psychology of how relationships shape your brain, what case examples reveal about healthy versus harmful dynamics, and use our Relationship Impact Tracker to understand exactly what a specific relationship is doing to you.",
  category: "Mental Health",
  date: "20-02-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/February/relationships-mental-health.jpg",
  tldr: "Relationships are the single strongest environmental predictor of mental health — stronger than income, education, or even physical health. This guide covers the science of how positive and negative relationships physically change your brain, walks through four case examples that show the patterns clearly, and gives you a Relationship Impact Tracker to assess what a specific relationship in your life is actually doing to your emotional wellbeing.",
  toc: [
    { id: "science",        title: "1. The Science: How Relationships Change the Brain",               level: 3 },
    { id: "positive",       title: "2. What Positive Relationships Do for Mental Health",              level: 3 },
    { id: "tracker",        title: "3. Interactive: The Relationship Impact Tracker",                  level: 3 },
    { id: "negative",       title: "4. What Negative Relationships Do to Mental Health",               level: 3 },
    { id: "adjustments",    title: "5. Healthy Adjustments: What to Actually Do",                     level: 3 },
    { id: "faq",            title: "6. Relationships and Mental Health FAQs",                          level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-20T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "relationships mental health, how relationships affect mental health, positive relationships mental health, toxic relationships mental health, relationship impact emotional health, healthy relationships wellbeing",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do relationships affect mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Relationships affect mental health through multiple measurable mechanisms. Positive relationships activate oxytocin and serotonin pathways that reduce stress, increase emotional regulation, and build resilience. Negative or high-conflict relationships chronically activate the cortisol stress response, which over time suppresses immune function, disrupts sleep, increases anxiety and depression, and reduces cognitive performance. Research by Robert Waldinger at Harvard's longest-running happiness study confirms that the quality of relationships is the single strongest predictor of mental and physical health in adulthood.",
      },
    },
    {
      "@type": "Question",
      "name": "Can a bad relationship cause depression or anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — research consistently links high-conflict, emotionally invalidating, or chronically stressful relationships with significantly elevated rates of both depression and anxiety. Abusive relationships in particular — including emotional and psychological abuse, which is often less visible than physical abuse — are among the most reliable environmental predictors of clinical depression. The mechanism is partly neurological (chronic stress responses) and partly cognitive (repeated invalidation reshapes beliefs about self-worth and safety).",
      },
    },
    {
      "@type": "Question",
      "name": "What makes a relationship healthy for mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research identifies five consistent markers of mentally healthy relationships: felt safety (you can be yourself without fear of judgement or retaliation), mutual investment (both people actively contribute to the relationship's quality), repair capacity (conflicts are resolved rather than stored), emotional validation (your feelings are acknowledged as real even when disagreed with), and growth orientation (both people are supported in becoming more fully themselves). A relationship does not need to be conflict-free to be healthy — it needs to be honest, mutual, and repairable.",
      },
    },
  ],
};

// ── Relationship Impact Tracker Data ──────────────────────────────────────────
const PLUM    = '#7B3FA0';
const PPALE   = '#F3EEF8';
const PBORDER = 'rgba(123,63,160,0.22)';

const REL_TYPES = [
  { key: 'romantic',    icon: '💑', label: 'Romantic partner or ex',           desc: 'Current relationship, situationship, or someone you are still emotionally connected to' },
  { key: 'friendship',  icon: '🤝', label: 'A close friend',                   desc: 'Someone you would consider a real friend but who has been on your mind lately' },
  { key: 'family',      icon: '🏠', label: 'A family member',                  desc: 'Parent, sibling, relative — anyone in your immediate family dynamic' },
  { key: 'classmate',   icon: '📚', label: 'A classmate or academic peer',     desc: 'Someone in your study environment whose presence consistently affects you' },
  { key: 'mentor',      icon: '🎓', label: 'A mentor, teacher, or authority figure', desc: 'Someone whose opinion you rely on and whose dynamic with you affects your confidence' },
];

const IMPACT_DIMENSIONS = [
  {
    id:     'safety',
    label:  'Emotional Safety',
    icon:   '🛡️',
    desc:   'How safe you feel being honest, vulnerable, or imperfect around them',
    low:    'Rarely safe',
    high:   'Completely safe',
  },
  {
    id:     'energy',
    label:  'Energy Exchange',
    icon:   '⚡',
    desc:   'How you feel after spending time with them — energised or drained',
    low:    'Always drained',
    high:   'Usually energised',
  },
  {
    id:     'worth',
    label:  'Sense of Self-Worth',
    icon:   '🌟',
    desc:   'How your self-perception holds up during and after interactions',
    low:    'Feel worse about myself',
    high:   'Feel good about myself',
  },
  {
    id:     'growth',
    label:  'Personal Growth',
    icon:   '🌱',
    desc:   'Whether this relationship supports or limits who you are becoming',
    low:    'Holds me back',
    high:   'Helps me grow',
  },
  {
    id:     'authentic',
    label:  'Authenticity',
    icon:   '🎭',
    desc:   'How much of your real self you get to show in this relationship',
    low:    'Constantly performing',
    high:   'Completely myself',
  },
];

const ADJUSTMENTS = {
  romantic: {
    nourishing: {
      title: 'This relationship appears to be a genuine source of support.',
      body: 'A romantic relationship that consistently registers positively across emotional safety, energy, self-worth, growth, and authenticity is rare and worth protecting. The ongoing work is maintenance: continuing to invest in honest communication, repairing quickly when conflict arises, and not allowing busy seasons to quietly erode the quality of connection you have built.',
      actions: [
        'Tell them one specific thing you genuinely appreciate about how they show up for you. Specific appreciation is more nourishing than general affection.',
        'Check in with yourself monthly: is this still feeling mutual? Healthy relationships require ongoing attention, not just initial effort.',
        'Protect the quality of your own inner life as the relationship deepens — your relationship with yourself feeds your relationship with them.',
      ],
    },
    mixed: {
      title: 'This relationship has real strengths alongside patterns that deserve attention.',
      body: 'Most romantic relationships land in the mixed zone — genuinely good in some dimensions and genuinely costly in others. The question is not whether it is perfect but whether the difficult patterns are addressable. Mixed results often indicate areas where honest conversation is overdue, where unspoken expectations are creating friction, or where one person\'s needs have gone unaddressed for long enough to create distance.',
      actions: [
        'Identify the one dimension that scored lowest. Name the specific pattern — not the emotion — that is producing that score. Patterns can be discussed. Emotions alone often become arguments.',
        'Use the sentence: "I feel [feeling] when [specific behaviour happens]. What I need instead is [specific alternative]." This format reduces defensiveness and creates actionable conversation.',
        'Give the conversation a genuine attempt before deciding the pattern is permanent. Many mixed-zone relationships move into nourishing territory when specific dynamics are named and addressed.',
      ],
    },
    draining: {
      title: 'This relationship is consistently costly to your emotional wellbeing.',
      body: 'A romantic relationship that chronically drains energy, reduces self-worth, limits growth, and prevents authentic expression is producing real mental health costs. This does not automatically mean ending it — it means taking the pattern seriously rather than normalising it. Chronically draining romantic relationships often involve: emotional invalidation (your feelings are dismissed or minimised), inconsistency (warm and cold in cycles that keep you anxious), control (your choices or self-expression feel monitored or constrained), or simply a fundamental incompatibility that affection cannot resolve.',
      actions: [
        'Separate what is uncomfortable but normal in any relationship (conflict, adjustment, compromise) from what is genuinely harmful (consistent invalidation, fear, control). One requires work. The other requires honest reassessment.',
        'Have one clear, specific conversation about the pattern that concerns you most. Their response — not their reassurances, their actual sustained behaviour — is the information you need.',
        'Speak to someone you trust about what you are experiencing. Isolating within a draining romantic relationship is one of the most common and damaging patterns — outside perspective can restore clarity that has been eroded by proximity.',
      ],
    },
  },
  friendship: {
    nourishing: {
      title: 'This friendship is genuinely good for your mental health.',
      body: 'A friendship where you feel safe, energised, valued, growing, and authentically yourself is one of the most significant protective factors for mental health that research identifies. The Harvard happiness study — the longest-running study of human wellbeing ever conducted — found that the quality of close friendships in young adulthood is one of the strongest predictors of mental and physical health decades later. Protect this one.',
      actions: [
        'Tell them directly that this friendship matters to you. Healthy friendships benefit from explicit appreciation as much as any relationship.',
        'Be equally intentional about being a nourishing presence for them as you are about receiving it. Mutual nourishment is what makes these friendships last.',
        'Use this friendship as the template when evaluating others. It shows you what is possible.',
      ],
    },
    mixed: {
      title: 'This friendship nourishes you in some ways and costs you in others.',
      body: 'Mixed friendships are worth examining carefully because the cost areas often become clearer as the friendship deepens. Common patterns in mixed-zone friendships include: imbalanced emotional labour (you consistently support them but do not feel supported), subtle competition that prevents genuine celebration of each other\'s wins, or a mismatch in values that has become more apparent over time. None of these require ending the friendship — most require one honest conversation.',
      actions: [
        'Name the specific pattern that is costing you energy — not as an accusation, but as an observation. "I have noticed that when I share good news, the conversation quickly moves to your experiences. I want us to be able to celebrate each other properly."',
        'Observe whether the pattern is consistent or situational. Situational stress in a friend produces temporary imbalance. A consistent pattern over months is structural.',
        'Adjust your investment level to match the actual dynamic rather than the ideal. You can care about someone and also protect your energy — the two are not mutually exclusive.',
      ],
    },
    draining: {
      title: 'This friendship is consistently reducing your emotional reserves.',
      body: 'A friendship that regularly drains energy, reduces self-worth, restricts authenticity, or prevents growth is a friendship that is costing more than it is giving — regardless of shared history, loyalty, or genuine affection for the person. The most common patterns in draining friendships are: chronic one-sidedness (you give, they take, the imbalance never corrects), negativity contamination (their persistent pessimism or drama consistently lowers your mood), competition without celebration (your achievements create distance rather than connection), or control dynamics (the friendship has unspoken rules about how you are allowed to behave or who you are allowed to be around).',
      actions: [
        'Create gradual distance rather than dramatic confrontation. Respond more slowly, invest less proactively, decline more consistently. Observe whether the friendship recalibrates or whether the distance is noticed and addressed.',
        'If the pattern is serious and long-standing, one direct conversation is worth having — not to save the friendship necessarily, but to honour both of you with honesty. "I have been feeling disconnected from us recently and I want to understand why."',
        'Give yourself explicit permission to grieve the friendship you wanted this to be, rather than only the friendship that exists. The grief is real and deserves acknowledgment.',
      ],
    },
  },
  family: {
    nourishing: {
      title: 'This family relationship is a genuine source of strength.',
      body: 'A family relationship that scores consistently well across emotional safety, energy, self-worth, growth, and authenticity is one of the most durable mental health assets a person can have. Research by psychologist Susan Johnson shows that secure attachment within family relationships in young adulthood creates a neurological "safe haven" that reduces the physiological stress response across all other domains of life. This relationship is worth being intentional about sustaining.',
      actions: [
        'Invest in it before you need it. Family relationships that carry you through hard times are built in the ordinary ones.',
        'Express your appreciation specifically and directly. Many family relationships operate on assumed love without explicit acknowledgment — closing that gap makes a measurable difference.',
        'If this relationship required work to become this healthy, honour that. It did not happen by accident.',
      ],
    },
    mixed: {
      title: 'This family relationship has genuine warmth alongside patterns that cost you.',
      body: 'Most family relationships land in the mixed zone — and for good reason. Family dynamics involve layers of shared history, established roles, unresolved conflicts, and intergenerational patterns that create both genuine love and genuine friction. The mixed zone in family relationships often reflects the coexistence of deep affection and real damage — both of which can be true simultaneously. The goal in mixed family dynamics is not repair to perfection but thoughtful navigation: getting more of what nourishes and building more protection around what costs.',
      actions: [
        'Identify the specific pattern — not the relationship overall — that is producing the cost. Family relationships are easier to work with when you can name the dynamic precisely rather than reacting to the whole.',
        'Manage your expectations based on evidence rather than aspiration. Some family members will change; many will not. Adjusting what you need from specific people based on what they are actually capable of giving is self-protection, not giving up.',
        'Find the language of "I" statements for difficult family conversations: "I feel [x] when [y happens]. I would find it easier if [z]." It reduces the defensiveness that family history tends to amplify.',
      ],
    },
    draining: {
      title: 'This family relationship is significantly affecting your wellbeing.',
      body: 'A family relationship that consistently scores as draining across emotional safety, energy, self-worth, growth, and authenticity carries particular weight because family relationships are harder to exit than other relationships, involve deeper historical wounds, and often involve significant power imbalances. The fact that someone is family does not make their impact on your mental health any less real. Emotional invalidation, chronic criticism, control, manipulation, and unaddressed trauma within families cause genuine, documented, long-term mental health consequences.',
      actions: [
        'Reduce your emotional exposure before reducing your physical presence. Shorter interactions, less disclosure of your inner life, more predictable topics — these reduce the cost without requiring explicit confrontation.',
        'Find one person outside the family system — a counsellor, a trusted friend, a mentor — to be honest with about what this relationship costs you. The isolation that family dynamics often produce is part of what makes them so damaging.',
        'Recognise that loving a family member and limiting their access to your emotional life are not contradictory. You can care about someone and still protect yourself from the specific ways they cause harm.',
      ],
    },
  },
  classmate: {
    nourishing: {
      title: 'This academic relationship is a genuine asset.',
      body: 'A classmate or peer relationship that scores well across emotional safety, energy, self-worth, growth, and authenticity in the academic context is rare and more valuable than it might initially seem. Academic environments are naturally competitive, which makes genuinely supportive peer relationships — ones where someone genuinely celebrates your wins without competing, helps you understand without condescension, and challenges you without diminishing you — particularly precious.',
      actions: [
        'Be equally generous in the relationship as you receive. Mutually supportive peer relationships compound over time and often evolve into the professional and personal networks that matter most.',
        'Name what makes this dynamic work for you. Understanding the specific qualities that make this relationship nourishing helps you identify similar dynamics and replicate them intentionally.',
        'Protect it from the competitive pressures that academic environments produce. The default in many academic settings is competition — choosing differently, together, is worth protecting.',
      ],
    },
    mixed: {
      title: 'This academic relationship helps you in some ways and costs you in others.',
      body: 'Mixed academic peer relationships often involve genuine intellectual connection alongside dynamics that subtly damage self-confidence — comparative self-talk, the implication that your approach is less valid, or the chronic feeling of being slightly behind or slightly not-enough. These are among the most insidious dynamics in academic settings because they are rarely explicit: the competition is never named, the undermining is rarely direct, and the effect on your confidence accumulates quietly.',
      actions: [
        'Notice the specific moments after which you feel less confident in your own academic ability. Timing specificity is the key — it reveals the pattern rather than the general feeling.',
        'Limit the interactions that produce the most cost without fully withdrawing. Study groups can be attended less consistently. Comparative conversations can be redirected. You are allowed to manage your exposure.',
        'Counterbalance with deliberate acknowledgment of your own progress in ways that are independent of comparison. What have you understood this week that you did not understand last week? That data point belongs to you, not to any comparison.',
      ],
    },
    draining: {
      title: 'This academic relationship is affecting your confidence and focus.',
      body: 'An academic peer relationship that drains energy, reduces self-worth, and limits authenticity in a study environment is affecting your performance as well as your wellbeing — because confidence and cognitive performance are deeply connected. Research by psychologist Claude Steele on stereotype threat demonstrates that social environments that signal inadequacy to a person can measurably reduce their performance on tasks they are objectively capable of. A consistently invalidating peer relationship in an academic setting is a genuine performance obstacle, not just a personal discomfort.',
      actions: [
        'Reduce shared study time with this person and observe whether your confidence and productivity shift. The data from your own experience is more persuasive than any external advice.',
        'Find at least one academic environment — a different study group, a class where this person is absent — where you can experience your own competence without this dynamic shaping how you perceive it.',
        'If the dynamic involves active bullying, undermining, or harassment, name it to a trusted teacher, counsellor, or administrator. Academic environments have responsibility for the relational safety of their students, and you are entitled to invoke that.',
      ],
    },
  },
  mentor: {
    nourishing: {
      title: 'This mentorship relationship is genuinely building you.',
      body: 'A mentor, teacher, or authority figure relationship that scores well across safety, energy, self-worth, growth, and authenticity is one of the most accelerating forces for personal and professional development that research identifies. Mentorship relationships that combine challenge with belief — where you are pushed to grow and simultaneously made to feel capable of the growth — are rare and have measurable long-term effects on career, confidence, and resilience. This one deserves explicit acknowledgment and intentional cultivation.',
      actions: [
        'Tell them directly what their belief in you has meant. Mentors who know their impact stay invested — and the acknowledgment costs you nothing.',
        'Be a proactive mentee rather than a passive one. Come with specific questions, specific challenges, specific things you want feedback on. Mentors invest more deeply in people who engage deliberately.',
        'At some point, pay it forward. The received mentorship that you felt most clearly is often the template for the mentorship you can most authentically offer someone else.',
      ],
    },
    mixed: {
      title: 'This authority relationship helps you in important ways but also costs you something.',
      body: 'Mixed mentor or teacher relationships are common — particularly in Indian academic settings where authority dynamics are complex, where the line between demanding standards and demoralising criticism can be thin, and where the power imbalance makes it difficult to name what is not working. A mentor who genuinely challenges you but also makes you feel fundamentally less than capable is producing a mixed outcome: the growth is real, and so is the damage. Understanding which is dominant in this specific relationship clarifies what, if anything, should change.',
      actions: [
        'Separate the content of their guidance (which may be genuinely useful) from the manner of delivery (which may be consistently undermining). You can take the content without absorbing the manner as a statement about your worth.',
        'Find a second mentorship relationship or peer group where you can experience competent, demanding feedback delivered without the cost. Comparison creates perspective about what is normal and what is not.',
        'If the relationship includes an element of genuine safety, name one specific pattern with them: "I find it easier to implement your feedback when it is delivered as a correction rather than a judgement." Some mentors genuinely do not know the impact they are having and respond to specific, respectful naming.',
      ],
    },
    draining: {
      title: 'This authority relationship is damaging your confidence.',
      body: 'A mentor, teacher, or authority figure relationship that consistently drains energy, reduces self-worth, restricts authenticity, and hinders growth is not mentorship — it is misuse of authority. The specific patterns that make authority relationships damaging include: chronic public humiliation (using your mistakes as examples of inadequacy rather than as learning opportunities), inconsistent standards (approval that cannot be predicted or relied on), conditional regard (warmth that is only available when you perform to a specific standard), and dismissal of your identity or perspective as irrelevant. These patterns cause real damage to confidence, academic performance, and long-term relationship with the subject matter or field.',
      actions: [
        'Find at least one other authority figure — a different teacher, an outside mentor, a professional in your field — to offer a genuinely alternative perspective on your capability. You need counter-evidence, not just counter-reassurance.',
        'Speak to a counsellor, student welfare officer, or trusted older peer about what you are experiencing. You deserve a witness for the impact, and naming it to someone else reduces its power.',
        'If the relationship involves formal power over your grades, progression, or opportunities, document specific instances of concern. This is not about escalation — it is about having an honest record if escalation ever becomes necessary.',
      ],
    },
  },
};

function getZone(total) {
  const max = IMPACT_DIMENSIONS.length * 4;
  const pct = total / max;
  if (pct >= 0.70) return 'nourishing';
  if (pct >= 0.40) return 'mixed';
  return 'draining';
}

const ZONE_META = {
  nourishing: { label: 'Broadly Nourishing',    icon: '💚', color: '#2D7D46', bg: '#E8F5EE', border: 'rgba(45,125,70,0.25)', bar: '#2D7D46' },
  mixed:      { label: 'Mixed Impact',           icon: '🌤️', color: '#C07800', bg: '#FFF8E1', border: 'rgba(192,120,0,0.25)',  bar: '#C07800' },
  draining:   { label: 'Consistently Draining',  icon: '🔴', color: '#C0392B', bg: '#FDECEA', border: 'rgba(192,57,43,0.25)',   bar: '#C0392B' },
};

// ── Tracker Component ──────────────────────────────────────────────────────────
function RelationshipImpactTracker() {
  const [step,      setStep]      = useState(1);
  const [relType,   setRelType]   = useState(null);
  const [ratings,   setRatings]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openAdj,   setOpenAdj]   = useState(false);

  const font      = "'Plus Jakarta Sans', system-ui, sans-serif";
  const rel       = REL_TYPES.find(r => r.key === relType);
  const allRated  = IMPACT_DIMENSIONS.every(d => ratings[d.id] !== undefined);
  const total     = Object.values(ratings).reduce((a, b) => a + b, 0);
  const zone      = submitted ? getZone(total) : null;
  const zoneMeta  = zone ? ZONE_META[zone] : null;
  const adjData   = submitted && relType ? ADJUSTMENTS[relType]?.[zone] : null;

  const handleReset = () => { setStep(1); setRelType(null); setRatings({}); setSubmitted(false); setOpenAdj(false); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? PLUM : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — relationship type */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Which relationship do you want to examine?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Pick the relationship that has been on your mind most — the one whose impact you most want to understand honestly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {REL_TYPES.map(r => {
              const isSel = relType === r.key;
              return (
                <button key={r.key} onClick={() => setRelType(r.key)} style={{
                  padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? PLUM : 'var(--border)',
                  background: isSel ? PPALE : 'white',
                  cursor: 'pointer', fontFamily: font, transition: 'all 0.15s', textAlign: 'left',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${PBORDER}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? PLUM : 'var(--ink)', marginBottom: '2px' }}>{r.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (relType) setStep(2); }} disabled={!relType} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: relType ? `linear-gradient(135deg, ${PLUM}, #A060C8)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: relType ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: relType ? `0 6px 18px ${PBORDER}` : 'none',
          }}>Next Step →</button>
        </>
      )}

      {/* STEP 2 — rate the dimensions */}
      {step === 2 && rel && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — Rate this relationship across five emotional dimensions
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Rate each dimension from 1 (very low) to 4 (very high), based on how this relationship genuinely feels — not how you think it should feel or how it feels on its best days.
          </p>

          {IMPACT_DIMENSIONS.map(dim => (
            <div key={dim.id} style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '10px', border: '2px solid', borderColor: ratings[dim.id] !== undefined ? PLUM : 'var(--border)', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>{dim.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{dim.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px', lineHeight: 1.4 }}>{dim.desc}</div>
                </div>
                {ratings[dim.id] !== undefined && (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: PLUM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', flexShrink: 0 }}>✓</div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0 6px 0' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600' }}>{dim.low}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600' }}>{dim.high}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4].map(v => {
                  const isSel = ratings[dim.id] === v;
                  const lbls  = ['Very low', 'Low', 'High', 'Very high'];
                  return (
                    <button key={v} onClick={() => setRatings(p => ({ ...p, [dim.id]: v }))} style={{
                      flex: 1, padding: '10px 4px', borderRadius: '9px', border: '2px solid',
                      borderColor: isSel ? PLUM : 'var(--border)',
                      background: isSel ? PLUM : 'white',
                      color: isSel ? 'white' : 'var(--muted)', fontWeight: '700', fontSize: '14px',
                      cursor: 'pointer', fontFamily: font, transition: 'all 0.15s', textAlign: 'center',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                    }}>
                      <span>{v}</span>
                      <span style={{ fontSize: '9px', fontWeight: '600', opacity: 0.75 }}>{lbls[v - 1]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (allRated) { setStep(3); setSubmitted(true); } }} disabled={!allRated} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: allRated ? `linear-gradient(135deg, ${PLUM}, #A060C8)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: allRated ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>
              {allRated ? 'See My Impact Report →' : `Rate all ${IMPACT_DIMENSIONS.filter(d => ratings[d.id] === undefined).length} remaining dimensions to continue`}
            </button>
          </div>
        </>
      )}

      {/* STEP 3 — results */}
      {step === 3 && submitted && zoneMeta && adjData && (
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Result header */}
          <div style={{ background: `linear-gradient(135deg, ${PLUM}, #A060C8)`, borderRadius: '14px', padding: '22px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{zoneMeta.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
              {zoneMeta.label}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>
              Impact report for: {rel?.label}
            </div>
          </div>

          {/* Dimension bars */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${PBORDER}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
              Your Ratings Across Five Dimensions
            </div>
            {IMPACT_DIMENSIONS.map(dim => {
              const val = ratings[dim.id] || 0;
              const pct = (val / 4) * 100;
              const barColor = val >= 3 ? '#2D7D46' : val >= 2 ? '#C07800' : '#C0392B';
              return (
                <div key={dim.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{dim.icon}</span>{dim.label}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: barColor }}>{val}/4</span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--border)', borderRadius: '7px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '7px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zone summary */}
          <div style={{ background: zoneMeta.bg, border: `2px solid ${zoneMeta.border}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: zoneMeta.color, marginBottom: '7px' }}>
              {zoneMeta.icon} What This Pattern Means
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: zoneMeta.color, marginBottom: '8px' }}>{adjData.title}</div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{adjData.body}</p>
          </div>

          {/* Healthy adjustments — accordion */}
          <div style={{ background: 'white', border: `1.5px solid ${PBORDER}`, borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
            <button
              onClick={() => setOpenAdj(o => !o)}
              style={{ width: '100%', padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left' }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: PLUM }}>🌱 Healthy Adjustments for You</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Three specific steps based on your impact report</div>
              </div>
              <span style={{ color: PLUM, fontSize: '16px', flexShrink: 0, marginLeft: '10px' }}>{openAdj ? '▲' : '▼'}</span>
            </button>
            {openAdj && (
              <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                {adjData.actions.map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: i < adjData.actions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `linear-gradient(135deg, ${PLUM}, #A060C8)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>
                      {i + 1}
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7 }}>{action}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reflection prompt */}
          <div style={{ background: PPALE, border: `1.5px dashed ${PBORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: PLUM, marginBottom: '8px' }}>
              ✨ One Question Worth Sitting With
            </div>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: PLUM, fontStyle: 'italic', lineHeight: 1.55 }}>
              {zone === 'nourishing' && '"What specifically makes this relationship safe enough to be real in? And how can I protect that quality intentionally?"'}
              {zone === 'mixed'      && '"Which single pattern, if shifted, would move the most significant dimension from where it is to where I need it to be?"'}
              {zone === 'draining'  && '"What would I advise someone I love to do if they described exactly this situation to me?"'}
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${PBORDER}`, color: PLUM,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Track a different relationship</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RelationshipsMentalHealth({ navigate, relatedPosts }) {
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
      <p>Of all the factors that shape your mental health — sleep, exercise, diet, stress management — the one that the research consistently identifies as most powerful is one that never appears on a wellness checklist. It is not a habit or a practice or a supplement. It is the quality of your relationships.</p>

      <p>Robert Waldinger, director of Harvard's 75-year-long Study of Adult Development — the most comprehensive longitudinal study of human happiness ever conducted — arrived at a conclusion that surprised many people with its simplicity: the people who were most mentally and physically healthy in later life were not the ones with the most prestigious careers, the most money, or the most achievements. They were the ones who had the warmest, most connected, most honest relationships. <strong>Relationships affect mental health</strong> more profoundly and more durably than almost any other variable in a person's life.</p>

      <img
        src={meta.imgUrl}
        alt="How relationships affect mental health — positive and negative emotional impact of connections on student wellbeing"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="science">1. The Science: How Relationships Change the Brain</h3>
      <p>Relationships do not just affect how you feel — they physically change the structure and function of your brain. This is not metaphor. It is documented neuroscience.</p>
      <p>The neurologist and interpersonal psychiatrist Daniel Siegel coined the term "interpersonal neurobiology" to describe the field of research showing that human brains are literally shaped by their relational environments. The prefrontal cortex — responsible for emotional regulation, decision-making, and self-awareness — develops most robustly in environments characterised by what Siegel calls "PACE": playfulness, acceptance, curiosity, and empathy. These are, essentially, the qualities of a safe, nourishing relationship. Conversely, chronic exposure to fear, unpredictability, invalidation, or control in close relationships is associated with measurable structural differences in brain regions associated with stress regulation and threat response.</p>
      <p>The autonomic nervous system — which governs your baseline level of physiological safety or threat — is continuously co-regulated by your social environment. Polyvagal theory, developed by neuroscientist Stephen Porges, explains how your nervous system uses social cues — tone of voice, facial expression, physical proximity — to assess whether you are safe. In nourishing relationships, these cues consistently signal safety, which keeps the nervous system in the ventral vagal state associated with calm, connection, and creativity. In threatening or high-conflict relationships, these cues consistently signal danger, keeping the nervous system in states of chronic fight, flight, or freeze.</p>
      <p>The practical implications of this are significant: the relationships you spend the most time in are not just emotionally pleasant or unpleasant. They are actively shaping your baseline nervous system state, your emotional regulation capacity, your immune function, your sleep quality, and your cognitive performance. Every relationship you are in right now is either adding to your neurological architecture or gradually degrading it.</p>

      {/* ── Section 2 ── */}
      <h3 id="positive">2. What Positive Relationships Do for Mental Health</h3>
      <p><strong>They reduce the physiological stress response.</strong> Research by psychologist Sheldon Cohen at Carnegie Mellon University showed that people with larger, more diverse social networks are significantly less susceptible to viral illness — not because they have stronger immune systems by default, but because the social support available to them reduces the cortisol response that suppresses immune function. Being genuinely supported by other people lowers the body's stress chemistry in measurable, physical ways.</p>
      <p><strong>They provide a mirror for accurate self-perception.</strong> One of the most damaging consequences of isolation or of exclusively negative relationships is a distorted self-narrative — an inner story about who you are that goes unchallenged and uncorrected. Positive relationships provide the external perspective that corrects the internal distortion. A friend who says "that was genuinely impressive" after you dismiss your own achievement is not offering flattery — they are offering an accurate counter-narrative to the inner critic's running commentary.</p>
      <p><strong>They build resilience through repair.</strong> Psychologist John Gottman's research on relationships found that it is not the absence of conflict but the capacity for repair after conflict that characterises mentally healthy relationships. Every time a relationship goes through a rupture — a misunderstanding, a disappointment, an argument — and comes back to connection, it builds what attachment researchers call "earned security": the lived experience that relationships can survive difficulty. This capacity transfers. People who have experienced repair in close relationships are more able to navigate difficulty in all relationships, because they have evidence that disconnection is temporary.</p>

      <p><strong>Case example — Priya, Class 12:</strong> Priya was preparing for JEE under enormous pressure. Her friend group had fractured earlier in the year and she was studying largely alone. One teacher began noticing her withdrawal and started a weekly fifteen-minute check-in — not about syllabus content, but about how she was doing. Within three months, Priya reported sleeping better, retaining more of what she studied, and feeling able to manage setbacks without catastrophising. The academic support was unchanged. The relational support shifted everything else.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="tracker">3. Interactive: The Relationship Impact Tracker</h3>
      <p>Not all relationships affect you the same way, and the same relationship can nourish you in one dimension while costing you in another. The Relationship Impact Tracker takes one specific relationship you want to understand and rates it across five emotional dimensions that research has identified as most predictive of mental health outcomes. The result is a personalised Impact Report with specific, actionable adjustments tailored to your relationship type and your actual ratings.</p>

      <RelationshipImpactTracker />

      {/* ── Section 4 ── */}
      <h3 id="negative">4. What Negative Relationships Do to Mental Health</h3>
      <p><strong>They produce chronic physiological stress.</strong> Every significant relationship in your life that involves unpredictability, high conflict, emotional invalidation, or fear activates the HPA (hypothalamic-pituitary-adrenal) axis — the body's primary stress response system. In acute, short-term situations, cortisol is useful: it mobilises energy, sharpens focus, and prepares the body for challenge. In chronic, ongoing situations — where the stress trigger is a relationship you cannot easily exit — cortisol stays elevated, and its cumulative effects include: disrupted sleep, suppressed immune function, reduced hippocampal volume (affecting memory and learning), and increased risk of anxiety and depression.</p>
      <p><strong>They distort self-perception in durable ways.</strong> The psychological term "gaslighting" — having your perception of reality consistently questioned or denied — describes a relationship dynamic that actively degrades your ability to trust your own experience. Less severe versions of the same mechanism are far more common: being consistently told your feelings are too much, your needs are unreasonable, your interpretations are wrong, or your reactions are disproportionate. Over time, this invalidation does not just produce hurt — it produces genuine uncertainty about whether your internal experience can be trusted. That uncertainty is one of the most insidious long-term effects of negative relationships.</p>
      <p><strong>Case example — Arjun, first-year UG:</strong> Arjun entered college with high confidence and genuine academic ability. His roommate and primary social group were consistently competitive and subtly undermining — celebrating when Arjun underperformed, going quiet when he did well, reframing his achievements as luck. By semester two, Arjun's grades had declined, he was sleeping poorly, and he described feeling "like I forgot how to study." The academic environment was the same. The relational environment had changed everything. After deliberately expanding his social circle to include a study group outside his roommate's, his performance recovered within one semester.</p>
      <p><strong>They narrow the window of emotional tolerance.</strong> A central concept in trauma-informed psychology is the "window of tolerance" — the range of emotional arousal within which a person can function effectively. Chronically stressful relationships narrow this window over time, making a person more reactive to minor triggers and less able to return to calm after being activated. This shows up in student life as: difficulty concentrating during study, disproportionate emotional responses to relatively minor academic setbacks, chronic low-grade anxiety that does not seem to have a clear cause, and difficulty making decisions. The relationship is not the presenting problem. The narrowed nervous system window is.</p>

      {/* ── Section 5 ── */}
      <h3 id="adjustments">5. Healthy Adjustments: What to Actually Do</h3>
      <p><strong>Audit your relational diet, not just your relationship status.</strong> Most people think about relationships in binary terms — in or out, friend or not friend, good or bad. The more useful question is: what is the quality of my relational diet across all the relationships I am spending time in? Are there enough relationships characterised by safety, reciprocity, and genuine connection to offset the cost of the high-friction ones? Like a nutritional diet, what matters is the overall composition — not any single item.</p>
      <p><strong>Invest intentionally in the relationships that are already working.</strong> The instinct is to spend energy trying to fix the relationships that are difficult. But the highest mental health return on relational investment comes from deepening the ones that are already nourishing. Schedule the coffee. Send the message. Prioritise the people who consistently leave you feeling better about yourself and the world. These are the relationships that provide the buffer capacity to handle the difficult ones without being overwhelmed.</p>
      <p><strong>Name patterns rather than personalities.</strong> One of the most common mistakes in difficult relationships is making the problem the person rather than the pattern. "They are toxic" closes the possibility of change and usually escalates conflict. "When you do X, I feel Y, and I would find it easier if Z" identifies a specific, changeable behaviour and makes a specific request. Some patterns can be addressed this way and improve. Others cannot — and the failure of the conversation tells you something important about whether the pattern is addressable in this relationship.</p>
      <p><strong>Lower disclosure gradually before lowering presence.</strong> In relationships that are costing you but are hard to exit — family, long-standing friendships, classroom settings — the first healthy adjustment is often not distance but reduced intimacy. Sharing less of your inner life with someone who consistently invalidates or weaponises it is self-protective without being confrontational. You can be present and warm while also being more guarded about what you share. This is not dishonesty — it is appropriate calibration of disclosure to trust.</p>
      <p><strong>Seek professional support when the relational cost is significant.</strong> Relationships that consistently reduce self-worth, produce anxiety or depression, involve any form of abuse, or leave you chronically depleted are beyond the scope of self-help strategies. A counsellor provides both the relational experience of being genuinely listened to — which is itself therapeutic — and the professional tools to understand the pattern, develop a response, and build the internal resources to navigate or exit the situation safely.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Relationships and Mental Health FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Can I have good mental health even if my close relationships are difficult?</strong><br />
        A: Yes, but it requires intentional strategies that most people do not naturally deploy. Building relationships outside the difficult ones, developing a strong private practice of self-care and self-compassion, finding professional support, and deliberately managing your exposure to the most costly relational dynamics all meaningfully offset the impact. The human need for genuine connection does not require that any single relationship be perfect — it requires that the overall relational diet includes enough genuine connection to meet the need.</p>

        <p><strong>Q: How do I help a friend whose relationship is clearly affecting their mental health?</strong><br />
        A: The most effective approach is to be a consistent, non-judgmental presence rather than an interventionist. People rarely leave difficult relationships because someone told them to — they leave when they feel supported enough to do so. Provide evidence of genuine connection, avoid ultimatums about the relationship, and gently name what you observe: "I have noticed you seem less like yourself lately — I am here if you want to talk about it." If you believe they are in danger, name that concern directly and offer specific resources.</p>

        <p><strong>Q: Is it possible for a previously negative relationship to become healthy?</strong><br />
        A: Yes — with genuine acknowledgment of the pattern that created the damage, consistent behavioural change over time (not just intent), and sufficient trust rebuilding to restore safety. The research on relationship repair is genuinely hopeful: relationships with significant history and genuine mutual investment can shift substantially when both people are willing to name what was not working and behave differently. The key word is both — unilateral repair attempts almost never produce lasting change, because the relational pattern requires both participants to change for the dynamic to shift.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: PLUM, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Good relationships keep us happier and healthier. Period."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Robert Waldinger, Harvard Study of Adult Development</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          The most important investments you make are not in skills or qualifications or achievements — though those matter. They are in the relationships that make you feel safe enough to be fully yourself. Those relationships are worth finding, building, protecting, and if necessary, grieving when they end. They are not a supplement to a good life. They are the architecture of one.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: PLUM, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${PBORDER}` }}
          >
            Process This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: PLUM, border: `2px solid ${PLUM}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Explore More on Relationships and Wellbeing:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/toxic-friendship-signs')} style={{ background: 'none', border: 'none', color: PLUM, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → 7 Signs of a Toxic Friendship You Should Not Ignore
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/communication-relationships')} style={{ background: 'none', border: 'none', color: PLUM, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Communicate Better in Relationships (Student Guide)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/saying-no-mental-health')} style={{ background: 'none', border: 'none', color: PLUM, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Why Saying No is Important for Mental Health
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: PLUM, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
