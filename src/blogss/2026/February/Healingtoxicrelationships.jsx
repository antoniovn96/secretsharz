import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Heal from Toxic Relationships and Move Forward Stronger",
  excerpt: "Healing from a toxic relationship is not a single moment of decision — it is a process that happens in stages, with setbacks, and on a timeline that cannot be rushed. Learn the psychology of why toxic relationships damage so deeply, the real stages of recovery, and use our Healing Stage Identifier to find exactly where you are and what you need next.",
  category: "Mental Health",
  date: "27-02-2026",
  readTime: "8 min read",
  wordCount: 1070,
  imgUrl: "/blogss/2026/February/healing-toxic-relationships.jpg",
  tldr: "Healing from toxic relationships is one of the most underestimated recovery processes a person can go through — underestimated because the damage is often invisible, accumulated slowly, and not always recognised as harm until well after the relationship has ended. This guide covers the psychology of toxic relationship damage, the five real stages of recovery, practical emotional healing tools for each stage, and an interactive Healing Stage Identifier that tells you exactly where you are in your recovery and what to focus on next.",
  toc: [
    { id: "why-hard",    title: "1. Why Healing from Toxic Relationships Is Harder Than It Looks",       level: 3 },
    { id: "damage",      title: "2. What Toxic Relationships Actually Do to Your Psychology",            level: 3 },
    { id: "identifier",  title: "3. Interactive: The Healing Stage Identifier",                         level: 3 },
    { id: "stages",      title: "4. The Five Stages of Recovery — and What Each One Needs",             level: 3 },
    { id: "tips",        title: "5. Emotional Healing Tips That Actually Work",                          level: 3 },
    { id: "faq",         title: "6. Healing from Toxic Relationships FAQs",                             level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-27T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "healing toxic relationships, how to heal from a toxic relationship, recovering from toxic relationship, toxic relationship recovery, emotional healing toxic relationship, moving on from toxic relationship, toxic relationship effects",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to heal from a toxic relationship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There is no universal timeline for healing from a toxic relationship, and anyone who offers one is oversimplifying. Research on trauma recovery suggests that healing time correlates with three factors: the duration of the relationship (longer relationships produce more entrenched patterns to unlearn), the severity of the harm (relationships involving manipulation, emotional abuse, or coercive control take longer to recover from than those involving incompatibility or poor communication), and the quality of post-relationship support (professional support, safe relationships, and structured recovery practices significantly accelerate healing). Most people find that the acute phase — where the relationship occupies most of their emotional bandwidth — lasts weeks to months. The deeper healing, involving identity reconstruction and pattern change, often takes a year or more and unfolds alongside regular life rather than as a separate project.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I know if I am healed from a toxic relationship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Healing is not marked by the absence of all feeling about the relationship — some residual sadness, anger, or understanding may remain indefinitely and is not evidence of incomplete healing. True markers of recovery include: being able to think about the relationship without being destabilised by it, having rebuilt a sense of yourself that is not primarily defined by what the relationship did to you, being able to recognise the patterns you participated in without excessive self-blame, and feeling genuinely interested in your own present and future rather than primarily oriented toward the past relationship.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it normal to miss someone who was toxic?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — completely and almost universally. Missing someone who was harmful to you is not evidence of weakness, poor judgement, or that the relationship was not actually toxic. It is evidence that you were genuinely attached to a person who also caused harm — and attachment does not switch off when the harm is recognised. Research on attachment theory explains that the brain's bonding system does not distinguish between safe and unsafe attachments — it registers loss regardless of the quality of what was lost. The longing is real. It does not mean going back is right.",
      },
    },
  ],
};

// ── Healing Stage Identifier Data ─────────────────────────────────────────────
const JADE    = '#3D7A6B';
const JPALE   = '#EDF5F3';
const JBORDER = 'rgba(61,122,107,0.22)';

const RELATIONSHIP_TYPES = [
  { key: 'romantic',   icon: '💔', label: 'Romantic relationship',         desc: 'A partner, ex, or situationship that was consistently draining or harmful' },
  { key: 'friendship', icon: '🌧️', label: 'A friendship',                   desc: 'A close friend whose dynamic consistently cost you more than it gave' },
  { key: 'family',     icon: '🏚️', label: 'A family relationship',          desc: 'A parent, sibling, or relative whose pattern of behaviour caused real harm' },
  { key: 'mentor',     icon: '📐', label: 'A mentor or authority figure',   desc: 'A teacher, coach, or senior whose influence was harmful rather than constructive' },
];

const HEALING_DIMENSIONS = [
  {
    id:    'recognition',
    icon:  '👁️',
    label: 'Recognition',
    desc:  'How clearly you see the relationship and its impact for what it was',
    q:     'I can see clearly what was harmful in this relationship without minimising it or catastrophising it.',
  },
  {
    id:    'grief',
    icon:  '🌊',
    label: 'Grief Processing',
    desc:  'Whether you have allowed yourself to genuinely feel and move through the loss',
    q:     'I have allowed myself to genuinely grieve what this relationship cost me — not suppressed it or gotten stuck in it.',
  },
  {
    id:    'identity',
    icon:  '🪞',
    label: 'Identity Reclamation',
    desc:  'How much of your sense of self you have rebuilt since the relationship ended or changed',
    q:     'I have a clear sense of who I am that is not primarily defined by what this relationship did to me.',
  },
  {
    id:    'patterns',
    icon:  '🔄',
    label: 'Pattern Awareness',
    desc:  'Whether you have begun to understand what drew you to or kept you in this dynamic',
    q:     'I have some understanding of the patterns — in me and in the relationship — that allowed this dynamic to develop and persist.',
  },
  {
    id:    'forward',
    icon:  '🌱',
    label: 'Forward Orientation',
    desc:  'How much of your attention and energy is genuinely directed toward your present and future',
    q:     'My attention and energy are genuinely more focused on my present life than on what happened in this relationship.',
  },
];

const SCALE_OPTS = [
  { label: 'Not at all', value: 1 },
  { label: 'A little',   value: 2 },
  { label: 'Mostly',     value: 3 },
  { label: 'Fully',      value: 4 },
];

const STAGE_DATA = {
  shock: {
    label:    'Early Recovery — Processing & Stabilisation',
    icon:     '🌫️',
    color:    '#7B3FA0',
    range:    [5, 10],
    summary:  'You are in the early, most disorienting stage of healing. The relationship\'s grip — emotional, cognitive, physiological — is still very strong. This is not failure. This is what the beginning of recovery looks like, and it is completely survivable.',
    what_happening: 'Your nervous system is still calibrated to the relational environment you have just left. The patterns it developed to navigate that environment — hypervigilance, people-pleasing, self-doubt — do not disappear when the relationship does. They need time, safety, and deliberate re-patterning to update.',
    focus: 'Stabilisation before processing. Your primary task right now is not to understand the relationship — it is to create enough safety and routine that your nervous system can begin to regulate.',
    steps: [
      'Establish one non-negotiable daily anchor — something simple and physical that you do at the same time every day. A morning walk, a specific meal, a bedtime routine. Routine signals safety to a dysregulated nervous system.',
      'Limit contact with the person and with information about them. Each exposure restarts the grief cycle and delays stabilisation. This is not forever — it is for now.',
      'Tell one trusted person what is happening. Not to process everything at once, but to reduce the isolation that trauma thrives in. You do not need to explain perfectly. You just need to not be alone with it.',
    ],
    healing_tip: 'Do not try to make sense of everything yet. Understanding comes after stabilisation. Right now, your only job is to get through each day in a way that does not make things worse.',
    affirmation: '"I do not need to have this figured out to be okay. I just need to get through today."',
  },
  processing: {
    label:    'Active Processing — Grief & Anger',
    icon:     '🌧️',
    color:    '#C07800',
    range:    [11, 14],
    summary:  'You have enough distance to begin processing — but the emotions are still raw, present, and sometimes overwhelming. This stage is characterised by the full arrival of feelings that may have been suppressed during the relationship or immediately after it.',
    what_happening: 'Grief does not follow a neat sequence. What is more common is a turbulent mixture of anger, sadness, relief, guilt, longing, and clarity that appears in no predictable order and at no predictable intensity. All of this is appropriate. The emotions are not the problem. They are the process.',
    focus: 'Feeling without getting stuck. The goal is to allow the emotional processing to happen — not to rush it, not to suppress it, but also not to let it become a permanent residence.',
    steps: [
      'Give the grief a container: a specific time each day or week where you fully allow the difficult feelings, then consciously return to your present life. This is not artificial — it is the structure that keeps processing from becoming flooding.',
      'Write what you are genuinely angry about. Not what you think you should be angry about — what actually produces the heat when you encounter it. Anger in the processing stage is often clarity about harm that was minimised during the relationship.',
      'Begin the process of naming what the relationship cost you — specifically. Not vaguely "it damaged my confidence" but "I stopped applying for things I wanted because I had internalised the belief that I would fail." The specificity is what makes the reclamation specific later.',
    ],
    healing_tip: 'The goal of processing is not to stop feeling — it is to feel all the way through rather than stopping in the middle. Emotions that are felt completely tend to move. Emotions that are suppressed or avoided tend to stay.',
    affirmation: '"I am allowed to feel everything this cost me. That is not weakness — that is honesty."',
  },
  reclaiming: {
    label:    'Identity Reclamation — Rebuilding',
    icon:     '🌤️',
    color:    JADE,
    range:    [15, 17],
    summary:  'The acute pain has begun to soften and your attention is increasingly available for the work of rebuilding — recovering the sense of self that the relationship gradually eroded, and discovering who you are now that you are not defined by that dynamic.',
    what_happening: 'Toxic relationships, particularly long ones, produce a specific kind of damage to identity: the gradual replacement of your own preferences, opinions, and self-assessments with versions shaped by the other person\'s perceptions. The reclamation stage involves the sometimes surprising and sometimes disorienting process of rediscovering who you actually are.',
    focus: 'Rediscovering and reasserting your own preferences, values, and identity — not dramatically, but in the small specific daily choices that accumulate into a life that feels genuinely yours.',
    steps: [
      'Make one decision this week entirely based on what you want — not what the relationship would have approved of, not what you think others expect. It can be small: a food, a film, a way of spending an hour. The decision itself matters less than the practice of consulting yourself.',
      'Return to something you abandoned during the relationship — an interest, a friendship, a creative practice, a way of being. The return signals to your nervous system that the self that was pushed aside is still there and still welcome.',
      'Write a description of who you are that does not reference the relationship — positively or negatively. Who are you in your own words, without that context? This is harder than it sounds and more valuable than it seems.',
    ],
    healing_tip: 'The identity you reclaim will not be identical to the one you had before. It will be more honest and more deliberate — because now you know what the cost of losing it is. That knowledge is part of what "moving forward stronger" actually means.',
    affirmation: '"I am more than what happened to me. I am also what I choose now."',
  },
  integration: {
    label:    'Integration — Making Meaning',
    icon:     '🌿',
    color:    '#2D7D46',
    range:    [18, 19],
    summary:  'You are in the stage where the experience begins to integrate — where it becomes part of your story without being the primary lens through which you see yourself or your future. Integration does not mean the harm was acceptable. It means you are no longer defined by it.',
    what_happening: 'Post-traumatic growth — the real phenomenon of coming through a damaging experience with expanded capacity, clearer values, and stronger self-knowledge — becomes possible in the integration stage. This is not the silver lining narrative imposed on trauma. It is the genuine reality that surviving and recovering from a harmful relationship often produces wisdom that no other path would have.',
    focus: 'Making meaning from the experience without romanticising or minimising it. Understanding what the relationship revealed about your patterns, your needs, and your values — and using that understanding as input for what comes next.',
    steps: [
      'Write the story of the relationship and its ending from the perspective of what you learned — not what you suffered. Not in denial of the suffering, but examining it for the specific knowledge it produced. What do you know now about yourself that you did not know before?',
      'Identify one value or clarity that emerged from this experience that would not have been as sharply defined without it. What do you now know you need in a relationship? What do you now know you will not accept?',
      'Consider what the patterns that contributed to this relationship can teach you about your attachment style, your self-worth, and your relational tendencies — without assigning blame. This is not self-criticism. It is the pattern-learning that prevents repetition.',
    ],
    healing_tip: 'Integration is the stage where the relationship becomes a chapter rather than the whole story. You are ready to turn the page when looking back feels like reading — informative, sometimes moving — rather than being pulled back into the middle of it.',
    affirmation: '"This happened. It shaped me. And I get to decide what I do with what it taught me."',
  },
  thriving: {
    label:    'Thriving — Renewed and Forward',
    icon:     '🌳',
    color:    '#2D7D46',
    range:    [20, 20],
    summary:  'You have done significant healing work and are genuinely living forward rather than backward. This does not mean perfect or finished — it means the relationship is no longer the dominant weight on your present. You have rebuilt, reclaimed, and are moving with genuine momentum.',
    what_happening: 'This stage is less a destination than a direction — a consistent orientation toward your own present and future rather than toward what happened. The relationship is understood, the lessons are integrated, and the self that emerged from the experience is genuinely more capable than the one that entered it.',
    focus: 'Maintenance and continued growth. Protecting what you have built. Staying alert to the patterns that made you vulnerable to this dynamic, not from fear, but from the wise attention that prevents unnecessary repetition.',
    steps: [
      'Write what you want your next significant relationship — of any kind — to look, feel, and function like. Be specific. The specificity is the blueprint that your integrated experience now makes possible.',
      'Invest in sharing what you have learned — not as performance, but as genuine contribution. Whether through honest conversation with people navigating similar experiences, through creative expression, or through the way you now show up in your other relationships.',
      'Practise the specific self-protective awareness that this experience has built: noticing earlier, naming what you notice, and acting on what you name — before the pattern has time to establish itself.',
    ],
    healing_tip: 'Thriving after a toxic relationship does not mean being invulnerable to future harm. It means being significantly more equipped — more self-aware, more boundaried, more honest — to avoid unnecessary harm and to act earlier when warning signs appear.',
    affirmation: '"I came through this. Everything I built in the process is mine to keep."',
  },
};

function getStageKey(total) {
  if (total <= 10) return 'shock';
  if (total <= 14) return 'processing';
  if (total <= 17) return 'reclaiming';
  if (total <= 19) return 'integration';
  return 'thriving';
}

// ── Identifier Component ───────────────────────────────────────────────────────
function HealingStageIdentifier() {
  const [step,       setStep]       = useState(1);
  const [relType,    setRelType]    = useState(null);
  const [ratings,    setRatings]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [openStep,   setOpenStep]   = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const allRated = HEALING_DIMENSIONS.every(d => ratings[d.id] !== undefined);
  const total    = Object.values(ratings).reduce((a, b) => a + b, 0);
  const stageKey = submitted ? getStageKey(total) : null;
  const stage    = stageKey ? STAGE_DATA[stageKey] : null;
  const rel      = RELATIONSHIP_TYPES.find(r => r.key === relType);

  const handleReset = () => { setStep(1); setRelType(null); setRatings({}); setSubmitted(false); setOpenStep(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step bar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? JADE : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {!submitted && (
        <>
          {/* Step 1 — relationship type */}
          <div style={{ marginBottom: '22px' }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
              Which type of relationship are you healing from?
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Choose the one that is most present in your mind right now — the one whose weight you are carrying.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {RELATIONSHIP_TYPES.map(r => {
                const isSel = relType === r.key;
                return (
                  <button key={r.key} onClick={() => setRelType(r.key)} style={{
                    padding: '13px 16px', borderRadius: '11px', border: '2px solid',
                    borderColor: isSel ? JADE : 'var(--border)', background: isSel ? JPALE : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    boxShadow: isSel ? `0 0 0 2px ${JBORDER}` : 'none',
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? JADE : 'var(--ink)', marginBottom: '2px' }}>{r.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{r.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — dimension ratings */}
          <div>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
              Rate where you are in your healing across five dimensions
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Rate each honestly — based on where you genuinely are right now, not where you want to be or think you should be.
            </p>
            {HEALING_DIMENSIONS.map(dim => (
              <div key={dim.id} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', marginBottom: '10px', border: '2px solid', borderColor: ratings[dim.id] ? JADE : 'var(--border)', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '18px' }}>{dim.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{dim.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{dim.desc}</div>
                  </div>
                  {ratings[dim.id] && <span style={{ marginLeft: 'auto', background: JADE, color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>✓</span>}
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, fontStyle: 'italic' }}>{dim.q}</p>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  {SCALE_OPTS.map(opt => {
                    const isSel = ratings[dim.id] === opt.value;
                    return (
                      <button key={opt.value} onClick={() => setRatings(p => ({ ...p, [dim.id]: opt.value }))} style={{
                        padding: '7px 13px', borderRadius: '50px', fontSize: '13px', fontWeight: '600',
                        border: '2px solid', fontFamily: font, cursor: 'pointer', transition: 'all 0.15s',
                        borderColor: isSel ? JADE : 'var(--border)',
                        background: isSel ? JADE : 'white',
                        color: isSel ? 'white' : 'var(--ink-soft)',
                      }}>{opt.label}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { if (allRated && relType) { setStep(2); setSubmitted(true); } }}
            disabled={!allRated || !relType}
            style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none', marginTop: '6px',
              background: allRated && relType ? `linear-gradient(135deg, ${JADE}, #5AAA95)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: font,
              cursor: allRated && relType ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              boxShadow: allRated && relType ? `0 6px 20px ${JBORDER}` : 'none',
            }}
          >
            {!relType ? 'Select a relationship type above to continue' : !allRated ? `Rate all ${HEALING_DIMENSIONS.filter(d => !ratings[d.id]).length} remaining dimensions to continue` : 'Find My Healing Stage →'}
          </button>
        </>
      )}

      {/* RESULTS */}
      {submitted && stage && (
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Stage hero */}
          <div style={{ background: `linear-gradient(135deg, ${JADE}, #5AAA95)`, borderRadius: '14px', padding: '26px 22px', marginBottom: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{stage.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              {stage.label}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '14px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>
              Healing from: {rel?.label}
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
              {stage.summary}
            </p>
          </div>

          {/* Dimension scores */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${JBORDER}` }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>Your Healing Profile</div>
            {HEALING_DIMENSIONS.map(dim => {
              const val  = ratings[dim.id] || 0;
              const pct  = (val / 4) * 100;
              const col  = val >= 3 ? '#2D7D46' : val >= 2 ? '#C07800' : '#C0392B';
              const lbl  = SCALE_OPTS.find(o => o.value === val)?.label || '';
              return (
                <div key={dim.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {dim.icon} {dim.label}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: col }}>{lbl}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: '6px', transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* What is happening + focus */}
          <div style={{ background: JPALE, border: `2px solid ${JBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: JADE, marginBottom: '8px' }}>
              🔬 What Is Happening in This Stage
            </div>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{stage.what_happening}</p>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: JADE, marginBottom: '7px' }}>
              🎯 Your Focus Right Now
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{stage.focus}</p>
          </div>

          {/* Recovery steps — expandable */}
          <div style={{ background: 'white', border: `1.5px solid ${JBORDER}`, borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
            <button onClick={() => setOpenStep(s => s === 'steps' ? null : 'steps')} style={{ width: '100%', padding: '15px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: JADE }}>🌱 Your Three Recovery Steps</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Specific, stage-appropriate actions for your next two weeks</div>
              </div>
              <span style={{ color: JADE, fontSize: '14px', flexShrink: 0, marginLeft: '10px' }}>{openStep === 'steps' ? '▲' : '▼'}</span>
            </button>
            {openStep === 'steps' && (
              <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                {stage.steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', padding: '13px 0', borderBottom: i < stage.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `linear-gradient(135deg, ${JADE}, #5AAA95)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75 }}>{s}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Healing tip */}
          <div style={{ background: JPALE, border: `1.5px solid ${JBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: JADE, marginBottom: '7px' }}>
              💛 Healing Tip for This Stage
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{stage.healing_tip}</p>
          </div>

          {/* Affirmation */}
          <div style={{ background: 'white', border: `1.5px dashed ${JBORDER}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: JADE, marginBottom: '8px' }}>
              ✨ Your Healing Affirmation
            </div>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '600', color: JADE, fontStyle: 'italic', lineHeight: 1.55 }}>
              {stage.affirmation}
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${JBORDER}`, color: JADE,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Retake the assessment</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HealingToxicRelationships({ navigate, relatedPosts }) {
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
      <p>If you have come to this page, something in you already knows that a relationship you were in — or are still navigating — was not healthy. That knowing deserves to be taken seriously, even if the relationship had genuinely good parts, even if the person was not wholly bad, and even if you are still not entirely sure what to call what happened.</p>

      <p><strong>Healing from toxic relationships</strong> is one of the most underestimated recovery processes a person can go through. It is underestimated because the damage is often invisible — accumulated in small moments, in gradual erosions of self-worth, in the quiet recalibration of what you began to accept as normal. It is underestimated because there is rarely a clear incident to point to, and because people often minimise what they experienced relative to "worse" cases. And it is underestimated because the cultural scripts for relationship endings emphasise moving on quickly rather than recovering properly.</p>

      <img
        src={meta.imgUrl}
        alt="Student healing from a toxic relationship — understanding the recovery stages and building emotional strength"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-hard">1. Why Healing from Toxic Relationships Is Harder Than It Looks</h3>
      <p>The most common response people receive after leaving a toxic relationship is some version of "you are better off without them." This is probably true and completely unhelpful. Knowing you are better off does not neutralise the attachment. It does not dissolve the habits, patterns, and self-perceptions the relationship produced. And it does not account for the specific feature of toxic relationships that makes them so psychologically complex to recover from: intermittent reinforcement.</p>
      <p>Unlike relationships that are consistently harmful — which produce a clearer emotional case for leaving — toxic relationships are almost universally characterised by cycles. Periods of genuine warmth, connection, and the relationship you hoped it would be, alternating with the patterns of harm. Research on operant conditioning, originally applied to gambling behaviour, shows that variable reward schedules — rewards that come sometimes and not others, unpredictably — produce the strongest and most persistent psychological attachment. The brain does not attach to the harm. It attaches to the hope — the inconsistent, maddening, completely convincing hope — that the good version will return permanently.</p>
      <p>This mechanism explains the specific grief of leaving a toxic relationship: you are not only grieving the relationship that existed. You are grieving the relationship you believed was possible. You are grieving a version that was real enough to produce real attachment, and rare enough to be perpetually pursued. That is a complex, layered loss — and it deserves a complex, layered recovery.</p>
      <p>The healing is also complicated by the identity damage that accompanies most toxic relationships. Over time, chronic invalidation, manipulation, or emotional control reshapes how you see yourself. You may have internalised the other person's characterisation of you as too sensitive, too demanding, too much, or not enough. You may have lost contact with preferences, friendships, and values that were yours before the relationship began. The recovery from a toxic relationship is not only about grieving the loss — it is about reclaiming the self that was gradually displaced.</p>

      {/* ── Section 2 ── */}
      <h3 id="damage">2. What Toxic Relationships Actually Do to Your Psychology</h3>
      <p><strong>They narrow your window of emotional tolerance.</strong> Living in a chronically stressful or unpredictable relational environment keeps the nervous system in a state of hypervigilance — constantly scanning for threat, braced for the next difficult interaction. This hypervigilance does not turn off when the relationship ends. People who have been in toxic relationships often find themselves emotionally reactive in ways that feel disproportionate to their current situation — snapping at people, interpreting neutral behaviour as threatening, or experiencing sudden emotional intensity with no obvious trigger. This is not them being difficult. It is their nervous system still calibrated to the previous environment.</p>
      <p><strong>They distort self-perception in measurable ways.</strong> Research on the long-term effects of emotional abuse consistently shows that people who have been consistently criticised, invalidated, or manipulated develop significantly lower self-esteem, higher rates of self-doubt, and a reduced capacity to trust their own perceptions — sometimes called "epistemic learned helplessness." The self you emerge with from a long toxic relationship is often a contracted, more fearful, less self-trusting version of the one who entered it. Understanding this is not self-pity — it is accurate diagnosis of what the recovery needs to address.</p>
      <p><strong>They affect subsequent relationships through patterned expectations.</strong> Perhaps the most enduring consequence of toxic relationships is the patterns they produce in how you approach future ones. Hypervigilance for signs of harm, excessive people-pleasing as pre-emptive protection, difficulty trusting genuine warmth, or alternatively — the recreating of familiar dynamics without realising it. Research on trauma bonding by psychologist Patrick Carnes shows that the neural pathways established in a significant relationship do not disappear when the relationship ends — they continue to shape relational responses until they are consciously recognised and deliberately worked with.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="identifier">3. Interactive: The Healing Stage Identifier</h3>
      <p>Recovery from a toxic relationship is not linear — it moves through genuine stages, and what you need in each stage is different. Stabilisation is not the same as processing. Processing is not the same as rebuilding identity. Providing the wrong kind of support at the wrong stage is like putting on a winter coat when what you need is sunscreen. The Healing Stage Identifier assesses where you are across five dimensions of recovery and gives you a personalised stage diagnosis with specific steps, an emotional healing tip, and an affirmation calibrated to exactly where you are right now.</p>

      <HealingStageIdentifier />

      {/* ── Section 4 ── */}
      <h3 id="stages">4. The Five Stages of Recovery — and What Each One Needs</h3>
      <p>Recovery from toxic relationships does not follow the Kübler-Ross model of grief, which was developed for bereavement and imposes a sequential structure that most people's actual experience does not match. What research on relational trauma recovery does consistently identify are five broad phases — not sequential, not universally experienced in the same order, but recognisable enough to be useful as a map.</p>
      <p><strong>Stage One: Shock and Disorientation.</strong> Even when a toxic relationship ends through your own decision, the immediate aftermath is often characterised by disorientation — the nervous system recalibrating to an environment without the chronic stress it had adapted to, the mind scrambling to make sense of what happened, and the emotions arriving in no predictable order. The need in this stage is stabilisation: routine, safety, limited contact, and at least one person who knows what is happening. Not understanding. Not processing. Stabilising.</p>
      <p><strong>Stage Two: Active Grief and Anger.</strong> When the shock begins to settle, what arrives is usually the full weight of the emotional reality — grief for what was lost (including the relationship you wanted it to be), anger about what happened, guilt about your own role, confusion about why you did not leave sooner. This stage is characterised by emotional intensity and unpredictability. The need here is not for the emotions to stop but for a safe container to process them in — journalling, therapy, trusted relationships — and for the explicit permission to feel them fully without rushing toward resolution.</p>
      <p><strong>Stage Three: Identity Reclamation.</strong> As the acute emotional intensity begins to soften, the work of rebuilding who you are — outside of, and before, the relationship — becomes possible. This stage involves returning to abandoned interests, re-establishing friendships that were deprioritised, and the sometimes disorienting rediscovery of your own preferences and opinions when you no longer have the relationship's framework overwriting them. The need here is for small, consistent acts of self-reference — consulting yourself, acting on what you find, and gradually rebuilding the internal landscape.</p>
      <p><strong>Stage Four: Integration and Meaning-Making.</strong> Healing does not mean forgetting or achieving complete emotional neutrality about what happened. It means integrating the experience — finding it a place in your story where it is informative rather than defining. This stage involves making sense of the patterns that contributed to the relationship, identifying what you now know about yourself and your needs, and beginning to convert the experience into the wisdom that is its most legitimate legacy.</p>
      <p><strong>Stage Five: Renewed Forward Orientation.</strong> In the final stage, your primary orientation is genuinely toward your present and future rather than your past. The relationship is understood, its lessons are integrated, and your attention is free to invest in the life ahead. This stage is not the absence of all feeling about the past — it is the development of enough internal richness in the present that the past no longer dominates your focus.</p>

      {/* ── Section 5 ── */}
      <h3 id="tips">5. Emotional Healing Tips That Actually Work</h3>
      <p><strong>No contact is not punishment — it is medicine.</strong> The most consistent finding in research on toxic relationship recovery is that limited or no contact with the person significantly accelerates healing, while any ongoing contact — including indirect contact through social media surveillance — keeps the grief cycle perpetually restarting. Each exposure to the person, their activities, or their social media presence re-activates the attachment system and delays the regulation that healing requires. No contact is not a power move or a punishment. It is the removal of the trigger that is keeping the nervous system from down-regulating.</p>
      <p><strong>Write the relationship honestly, not charitably.</strong> One of the most therapeutic practices in the processing stage is writing the story of the relationship from a position of honest witness rather than charitable retrospect. Not to vilify — to see clearly. This means writing what actually happened, what it cost you, how it changed you, and what you minimised or explained away at the time. This is not the same as writing to someone — it is writing to yourself, as a way of completing the recognition that is the first step of all subsequent recovery.</p>
      <p><strong>Rebuild your nervous system through the body, not only the mind.</strong> The impact of a toxic relationship is not only cognitive — it is physiological. The chronic stress response has left real traces in the body: disrupted sleep, altered cortisol patterns, hypersensitivity to certain stimuli. Healing through the body — through physical movement, through adequate sleep, through breath practices that activate the parasympathetic nervous system, through physical environments that feel genuinely safe — is not supplementary to cognitive processing. It is often the prerequisite for it.</p>
      <p><strong>Find or build the relationships that demonstrate a different possibility.</strong> One of the most powerful mechanisms of healing is the corrective relational experience — an encounter with genuine, consistent warmth that gradually updates the nervous system's expectations about how relationships feel. This does not need to be a new romantic relationship. It can be a therapist, a close friend, a mentor, or a community that consistently demonstrates that safety, reciprocity, and honest communication are actually possible in human connection. The exposure to these experiences is not supplementary to healing. For many people, it is the mechanism through which the deepest healing actually happens.</p>
      <p><strong>Name the patterns without using them to define your future.</strong> Understanding the patterns that made you vulnerable to the toxic dynamic — your attachment tendencies, your people-pleasing, your tolerance for discomfort as normalised — is important and necessary work. But there is a version of this insight that becomes its own trap: using your pattern-awareness to conclude that you are fundamentally destined to repeat the dynamic. You are not. Patterns, once named and understood, become navigable. The self-awareness that emerges from this kind of experience is not just theoretical — it is operationally useful in every subsequent relationship you enter.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Healing from Toxic Relationships FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I still have feelings for someone who was harmful to me. Does that mean I am not healing?</strong><br />
        A: No — persisting feelings for someone who caused harm are one of the most universal features of toxic relationship recovery and are completely compatible with genuine healing progress. The attachment system does not deactivate based on rational assessment of the relationship's quality. It deactivates through time, through limited exposure, and through the gradual accumulation of alternative relational experiences. Having feelings for someone who hurt you is not evidence that the hurt did not happen or that the relationship was actually fine. It is evidence that you were genuinely attached. Both things are true simultaneously.</p>

        <p><strong>Q: How do I know if what I experienced was actually a toxic relationship and not just a normal difficult one?</strong><br />
        A: The distinction between a difficult relationship and a toxic one is primarily about pattern and effect. Every relationship has difficult periods — this is expected and does not constitute toxicity. A relationship is more accurately described as toxic when: the difficult patterns are consistent rather than situational, when they involve systematic invalidation, manipulation, or control, when your sense of self has been measurably eroded during the relationship, or when the relationship consistently produces anxiety, self-doubt, or the contraction of your life and identity rather than the expansion of them. The label matters less than the honest assessment of impact.</p>

        <p><strong>Q: Is professional support necessary for healing from a toxic relationship?</strong><br />
        A: Not in every case — many people heal effectively through time, supported relationships, and deliberate self-reflection. But professional support significantly accelerates the process and is strongly recommended when: the relationship involved any form of abuse (including emotional or psychological), when you find yourself unable to move through the acute grief phase after several months, when the relationship was with a family member (where the complexity of the healing is usually greater), or when you notice yourself recreating similar dynamics in new relationships. Therapy for this specific recovery is not about being unable to cope — it is about choosing the most efficient and thorough path through.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: JADE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You survived what you thought would break you. Now comes the part where you discover what it made you capable of."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Healing from a toxic relationship is not about getting back to who you were before — it is about becoming the version of you who knows enough, finally, to build something different. That knowledge is real. It was earned through real cost. And it belongs entirely to you, to use in every relationship that comes after this one.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: JADE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${JBORDER}` }}
          >
            Begin Your Healing Journey in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: JADE, border: `2px solid ${JADE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access Professional Support Now
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Continue Your Recovery Journey:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/relationship-red-flags',        '→ How to Identify Red Flags in Relationships Early'],
            ['/blog/emotional-boundaries',          '→ Emotional Boundaries: What They Are and How to Set Them'],
            ['/blog/handling-rejection',            '→ How to Handle Rejection Without Losing Confidence'],
            ['/blog/self-acceptance-confidence',    '→ How to Build Confidence Through Self-Acceptance'],
            ['/blog/relationship-with-yourself',    '→ How to Build a Strong Relationship with Yourself'],
            ['/blog/self-kindness-check',           '→ Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/safe',                               '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: JADE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
