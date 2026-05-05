import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stop Comparing Yourself to Others on Social Media",
  excerpt: "Social media comparison is quietly one of the most damaging habits of student life — and it is designed to be. Learn the psychology of why scrolling makes you feel worse, practical detox strategies that actually work, and how to redirect your attention back to the only timeline that matters: yours.",
  category: "Mental Health",
  date: "16-02-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/February/social-media-comparison.jpg",
  tldr: "Social media comparison is not a character weakness — it is an engineered response to a product designed to produce exactly that feeling. This guide breaks down the neuroscience of why scrolling hurts, identifies the specific accounts and patterns that damage you most, and gives you a practical detox toolkit and self-focus strategy to use today.",
  toc: [
    { id: "engineered",     title: "1. Why Social Media Comparison Is Not Your Fault",                level: 3 },
    { id: "mental-health",  title: "2. The Mental Health Impact — What the Research Shows",           level: 3 },
    { id: "trigger-finder", title: "3. Interactive: Find Your Comparison Triggers",                   level: 3 },
    { id: "detox-tips",     title: "4. Practical Social Media Detox Tips That Actually Work",         level: 3 },
    { id: "self-focus",     title: "5. Self-Focus Strategies: Redirecting Your Attention Inward",     level: 3 },
    { id: "faq",            title: "6. Social Media Comparison FAQs",                                 level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-16T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "social media comparison, stop comparing yourself, social media mental health, comparison trap, social media detox, self-comparison social media, Instagram comparison",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does social media make me feel worse about myself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Social media platforms are algorithmically optimised for engagement, not wellbeing. They preferentially surface aspirational, high-performing, aesthetically curated content — which creates a consistent stream of upward social comparison. Research by psychologist Leon Festinger shows that upward comparison (comparing yourself to someone who appears to be doing better) reliably produces negative affect. When the comparison is constant, involuntary, and composed entirely of curated highlights rather than honest reality, the impact compounds significantly.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I stop comparing myself to others on social media?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective approach combines three elements: environmental change (auditing your feed to remove consistent comparison triggers), pattern interruption (identifying the specific moments and emotional states when you are most vulnerable to comparison), and attention redirection (deliberately building habits that anchor your attention to your own progress rather than others' presentations). No single technique works alone — the comparison habit is deeply reinforced and requires both structural and psychological intervention.",
      },
    },
    {
      "@type": "Question",
      "name": "Is social media comparison normal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Completely. Social comparison is a universal human behaviour — psychologist Leon Festinger identified it as a core feature of how humans evaluate themselves as far back as 1954. What is not normal, in evolutionary terms, is being exposed to the curated highlights of thousands of people simultaneously and involuntarily. Social media did not create the comparison instinct. It weaponised it.",
      },
    },
  ],
};

// ── Trigger Finder Data ────────────────────────────────────────────────────────
const INDIGO  = '#3B4B9A';
const PALE    = '#EEF0FA';
const IBORDER = 'rgba(59,75,154,0.22)';

const TRIGGER_CATEGORIES = [
  {
    key:   'appearance',
    icon:  '🪞',
    label: 'Appearance & Body',
    desc:  'Accounts or content that make you feel worse about how you look',
    triggers: [
      'Fitness transformation accounts or before-and-after posts',
      'Influencers whose appearance seems effortlessly perfect',
      'Fashion or beauty content that makes your wardrobe feel inadequate',
      'Skin, hair, or body type content that highlights what you wish were different',
    ],
    impact: 'Appearance comparison consistently produces the strongest negative body image effects — particularly for women, though not exclusively. The images you consume daily calibrate your brain\'s baseline for "normal." Curated fitness and beauty content creates a baseline that is structurally impossible for most people to meet.',
    reframe: 'The people you are comparing yourself to have professional lighting, editing software, strategic angles, and in many cases procedures or filters — none of which are disclosed. You are comparing your unfiltered, real-life, daily-reality self to someone\'s most advantageous possible presentation. That comparison has no valid information in it.',
    action: 'This week: mute or unfollow three accounts whose content consistently makes you feel worse about your appearance. Replace each one with an account that genuinely entertains, educates, or inspires you about something other than how you look.',
  },
  {
    key:   'academic',
    icon:  '📚',
    label: 'Academic & Career Wins',
    desc:  'Posts about achievements, results, internships, or acceptances',
    triggers: [
      'Rank announcements and percentage posts after exams',
      'University acceptance posts — especially from dream colleges',
      'Internship and job offer announcements with congratulatory comment sections',
      'Award, scholarship, or competition win announcements',
    ],
    impact: 'Academic comparison is particularly brutal in Indian student culture, where achievement is highly visible and closely tied to family and social identity. Research shows that passive exposure to others\' academic wins — scrolling without engaging — produces significantly more negative affect than active engagement, because passive scrolling prevents the emotional processing that conversation allows.',
    reframe: 'When someone posts their JEE rank or their Stanford acceptance, you are seeing the result of a journey you were not present for. You did not see the attempts that did not work, the support systems they had, the specific circumstances that shaped their path, or the things they are not posting because they are too private or too painful.',
    action: 'Create a "competition-free window" — a specific time of day (try mornings before 10am and evenings after 8pm) where no academic achievement content is consumed. Most destructive comparison happens when we are already tired or anxious.',
  },
  {
    key:   'social',
    icon:  '🎉',
    label: 'Social Life & Belonging',
    desc:  'Content that makes you feel excluded, left out, or socially behind',
    triggers: [
      'Group hangout posts you were not included in',
      'Stories from events you were not invited to',
      'Content from people whose social lives appear fuller and more exciting than yours',
      'Couple posts that make you feel behind on relationship milestones',
    ],
    impact: 'Social exclusion content triggers the same neural pain pathways as physical harm — Naomi Eisenberger\'s landmark research at UCLA demonstrated this clearly. When you see evidence of social events you were not part of, your brain processes it as a social threat. Repeated exposure to exclusion content keeps that threat response activated chronically.',
    reframe: 'Nobody posts the nights they stayed home, the cancelled plans, the friendships that fell apart, or the parties that were actually uncomfortable. What you are watching is the most socially successful moments from a life that contains just as much ordinary time, loneliness, and awkwardness as yours.',
    action: 'Identify the one person or account whose social life most consistently produces FOMO or feelings of inadequacy. Take a 14-day break from their content — not as punishment, but as data collection. Track how your mood changes.',
  },
  {
    key:   'lifestyle',
    icon:  '✈️',
    label: 'Lifestyle & Wealth',
    desc:  'Content about travel, possessions, or a life that seems financially out of reach',
    triggers: [
      'Travel content from peers — especially international travel',
      'Consumer purchases — clothes, gadgets, home aesthetics',
      'Restaurant and food content that highlights what you cannot afford',
      'Aesthetic "life setups" — desks, rooms, wardrobes that look curated and expensive',
    ],
    impact: 'Lifestyle comparison produces a specific form of inadequacy — not about who you are, but about what you have. Research by economists Erzo Luttmer and Andrew Clark shows that relative income and lifestyle position (how you compare to your immediate social circle) is a stronger predictor of happiness than absolute wealth. Social media artificially inflates your social circle to include the wealthiest and most visually curated people, distorting your perceived position completely.',
    reframe: 'The travel post does not show the debt, the parental funding, the financial anxiety, or the three days of careful Instagram strategy that surrounded it. Lifestyle content is the most deliberately produced category of social media — and the one most completely detached from the actual experience of the person\'s daily life.',
    action: 'For one week, before opening social media, write down three specific things in your current life that are genuinely good. Not aspirational — actual, present, real. This "gratitude prime" measurably reduces the intensity of subsequent comparison.',
  },
  {
    key:   'creative',
    icon:  '🎨',
    label: 'Creative Output & Talent',
    desc:  'Other people\'s creative work that makes yours feel small or inadequate',
    triggers: [
      'Art, writing, photography, or music that makes your own work feel inferior',
      'Content from creators who seem to produce effortlessly and at scale',
      'Viral creative content that you wish you had thought of first',
      'Portfolio or project posts from peers in your creative field',
    ],
    impact: 'Creative comparison is uniquely damaging because creative output is deeply personal — unlike academic or financial comparison, creative work is an extension of self-expression. Research on creative people consistently shows that exposure to peers\' creative work, when processed through a comparison lens rather than an appreciation lens, is one of the strongest predictors of creative block and reduced output.',
    reframe: 'Every creator you admire had years of work you never saw — years of output that was worse than what they are producing now, and often worse than what you are producing now. What you are seeing is the result of a volume of practice that is almost never visible in the finished post.',
    action: 'Before consuming any creative content today, spend 10 minutes creating something yourself — even badly. This "creation before consumption" pattern trains your brain to approach creative content from a maker\'s perspective rather than a comparison perspective.',
  },
];

const EMOTIONAL_MOMENTS = [
  { key: 'tired',   icon: '😴', label: 'When I am exhausted or sleep-deprived' },
  { key: 'anxious', icon: '😰', label: 'When I am already anxious or stressed' },
  { key: 'procras', icon: '📱', label: 'When I am avoiding something I should be doing' },
  { key: 'lonely',  icon: '🫂', label: 'When I am feeling lonely or left out' },
  { key: 'bored',   icon: '🙃', label: 'When I am bored with nothing specific to do' },
  { key: 'night',   icon: '🌙', label: 'Late at night when I should be sleeping' },
];

const MOMENT_ADVICE = {
  tired:   { note: 'Exhaustion dramatically reduces your brain\'s capacity to reality-check what you are seeing. When tired, the critical thinking that says "this is curated and not real" is offline. You are not in a state to compare fairly.', fix: 'Set a firm rule: no social media in the 30 minutes before bed and the 30 minutes after waking. These are your two highest-vulnerability windows.' },
  anxious: { note: 'Anxiety already has your threat-detection system activated. Social media comparison in this state is pouring comparison fuel onto an already-burning fire. The anxiety makes everything look worse, and the comparison makes the anxiety worse.', fix: 'Replace the scrolling impulse during anxious moments with a 5-minute physical reset — a short walk, cold water on your face, or 4-7-8 breathing. Anxiety needs a physical interrupt, not a digital one.' },
  procras: { note: 'Procrastination scrolling is a particularly cruel form of comparison, because you are already feeling guilty and inadequate about the task you are avoiding. Every achievement post lands on top of that guilt.', fix: 'Use an app timer or site blocker during study sessions. Not because you lack willpower — because willpower is finite and the algorithm is infinite.' },
  lonely:  { note: 'Loneliness is the state in which social comparison hurts most and distorts reality most. When you feel disconnected, your brain searches for explanations — and social media obligingly provides: "everyone else has connection, you do not."', fix: 'When you feel lonely and reach for social media, reach for a message instead. Text one specific person something real. Active connection is the remedy. Passive scrolling is the trap.' },
  bored:   { note: 'Boredom scrolling feels harmless because nothing feels at stake — but boredom is actually a creative state your brain needs. Filling it with comparison content replaces an opportunity with a deficit.', fix: 'Keep a "boredom list" — three things you genuinely enjoy that require no internet. When the scroll impulse hits from boredom, do one of those first. After 10 minutes, reassess.' },
  night:   { note: 'Late-night comparison is the most insidious because your emotional defences are lowest, the content feels most real, and you have no immediate action available — so the feelings just sit there, unresolved, until morning.', fix: 'Move your phone charger outside your bedroom. This single environmental change — removing the device from arm\'s reach at night — is the highest-impact single action for reducing comparison-related sleep disruption.' },
};

// ── Trigger Finder Component ───────────────────────────────────────────────────
function ComparisonTriggerFinder() {
  const [step,        setStep]        = useState(1);
  const [triggerKey,  setTriggerKey]  = useState(null);
  const [momentKeys,  setMomentKeys]  = useState([]);
  const [revealed,    setRevealed]    = useState(false);

  const font     = "'Plus Jakarta Sans', system-ui, sans-serif";
  const category = TRIGGER_CATEGORIES.find(c => c.key === triggerKey);

  const toggleMoment = (key) => {
    setMomentKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleReset = () => { setStep(1); setTriggerKey(null); setMomentKeys([]); setRevealed(false); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? INDIGO : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — Pick trigger category */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Which type of content triggers comparison the most for you?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {TRIGGER_CATEGORIES.map(cat => {
              const isSelected = triggerKey === cat.key;
              return (
                <button key={cat.key} onClick={() => setTriggerKey(cat.key)} style={{
                  padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSelected ? INDIGO : 'var(--border)',
                  background: isSelected ? PALE : 'white',
                  cursor: 'pointer', fontFamily: font, transition: 'all 0.15s', textAlign: 'left',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSelected ? `0 0 0 3px ${IBORDER}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? INDIGO : 'var(--ink)', marginBottom: '2px' }}>{cat.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{cat.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (triggerKey) setStep(2); }} disabled={!triggerKey} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: triggerKey ? INDIGO : 'var(--border)', color: 'white',
            fontWeight: '700', fontSize: '15px', cursor: triggerKey ? 'pointer' : 'not-allowed',
            fontFamily: font, transition: 'all 0.2s',
          }}>Next Step →</button>
        </>
      )}

      {/* STEP 2 — Pick vulnerability moments */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — When are you most vulnerable to comparison? Select all that apply.
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            The timing of your scrolling matters as much as the content. Choose every moment that honestly applies.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
            {EMOTIONAL_MOMENTS.map(m => {
              const isSelected = momentKeys.includes(m.key);
              return (
                <button key={m.key} onClick={() => toggleMoment(m.key)} style={{
                  padding: '13px 14px', borderRadius: '11px', border: '2px solid',
                  borderColor: isSelected ? INDIGO : 'var(--border)',
                  background: isSelected ? PALE : 'white',
                  cursor: 'pointer', fontFamily: font, transition: 'all 0.15s', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: isSelected ? `0 0 0 2px ${IBORDER}` : 'none',
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{m.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? INDIGO : 'var(--ink)', lineHeight: 1.35 }}>{m.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 20px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (momentKeys.length > 0) { setStep(3); setRevealed(false); } }} disabled={momentKeys.length === 0} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: momentKeys.length > 0 ? INDIGO : 'var(--border)', color: 'white',
              fontWeight: '700', fontSize: '15px', cursor: momentKeys.length > 0 ? 'pointer' : 'not-allowed',
              fontFamily: font, transition: 'all 0.2s',
            }}>Get My Comparison Profile →</button>
          </div>
        </>
      )}

      {/* STEP 3 — Full breakdown */}
      {step === 3 && category && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Your Personalised Comparison Profile
          </p>

          {!revealed ? (
            <button onClick={() => setRevealed(true)} style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${INDIGO}, #5C70C8)`, color: 'white',
              fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
              boxShadow: `0 6px 20px ${IBORDER}`, transition: 'all 0.2s',
            }}>🔍 Reveal My Comparison Profile</button>
          ) : (
            <div style={{ animation: 'floatUp 0.35s ease' }}>

              {/* Trigger breakdown */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{category.icon}</span>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '2px' }}>Your Primary Trigger Category</div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: INDIGO }}>{category.label}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO, marginBottom: '7px' }}>Specific triggers to watch for:</div>
                {category.triggers.map((t, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--ink-soft)', padding: '4px 0', lineHeight: 1.55, display: 'flex', gap: '8px' }}>
                    <span style={{ color: INDIGO, flexShrink: 0 }}>•</span>{t}
                  </div>
                ))}
              </div>

              {/* Impact card */}
              <div style={{ background: PALE, border: `2px solid ${IBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO, marginBottom: '8px' }}>🔬 Why This Type of Comparison Hits Hard</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{category.impact}</p>
              </div>

              {/* Reframe card */}
              <div style={{ background: 'white', border: `1.5px solid ${IBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO, marginBottom: '8px' }}>💡 The Reality Check</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{category.reframe}</p>
              </div>

              {/* Action card */}
              <div style={{ background: PALE, border: `1.5px dashed ${IBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO, marginBottom: '8px' }}>✅ Your Immediate Action Step</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{category.action}</p>
              </div>

              {/* Vulnerability moments */}
              {momentKeys.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO, marginBottom: '10px' }}>🕐 Your High-Risk Scrolling Windows — What to Do Instead</div>
                  {momentKeys.map(mk => {
                    const m = EMOTIONAL_MOMENTS.find(e => e.key === mk);
                    const advice = MOMENT_ADVICE[mk];
                    return (
                      <div key={mk} style={{ background: 'white', borderRadius: '11px', padding: '14px 16px', marginBottom: '8px', border: `1.5px solid ${IBORDER}`, borderLeft: `4px solid ${INDIGO}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                          <span style={{ fontSize: '18px' }}>{m.icon}</span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: INDIGO }}>{m.label}</span>
                        </div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{advice.note}</p>
                        <div style={{ background: PALE, borderRadius: '8px', padding: '10px 12px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: INDIGO }}>What to do instead: </span>
                          <span style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{advice.fix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Personalised affirmation */}
              <div style={{ background: `linear-gradient(135deg, ${INDIGO}15, ${INDIGO}06)`, border: `1.5px solid ${IBORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: INDIGO, marginBottom: '8px' }}>✨ Your Reminder for Today</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '600', color: INDIGO, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "Every minute you spend looking at someone else's timeline is a minute you are not building your own."
                </p>
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: `1.5px solid ${IBORDER}`, color: INDIGO,
                padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Find a different trigger</button>
            </div>
          )}

          {!revealed && (
            <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SocialMediaComparison({ navigate, relatedPosts }) {
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
      <p>You open Instagram for three minutes — or what felt like three minutes — and close it feeling somehow worse than when you opened it. Someone's semester results. A peer's internship announcement. A body that looks nothing like yours. A social event you were not part of. A life that looks, through the screen, effortless and complete.</p>

      <p>If this sounds familiar, you are not alone and you are not weak. <strong>Social media comparison</strong> is not a character flaw in the people who experience it — it is an engineered outcome of platforms that have spent billions of dollars studying exactly which content produces the most engagement. Comparison produces engagement. The product is working exactly as designed.</p>

      <img
        src={meta.imgUrl}
        alt="Student on phone experiencing social media comparison and its mental health impact — learning to stop comparing"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="engineered">1. Why Social Media Comparison Is Not Your Fault</h3>
      <p>In 1954, social psychologist Leon Festinger proposed his Social Comparison Theory — the idea that humans have a fundamental drive to evaluate their own opinions and abilities by comparing themselves to others. This is not pathological. It is evolutionary. In a small community, knowing where you stood relative to your peers was genuinely useful survival information.</p>
      <p>The problem is that social media has taken this ancient, context-specific instinct and subjected it to conditions it was never designed to handle. Instead of comparing yourself to the fifty or so people you meaningfully knew in a village — a number your brain evolved to process — you are now simultaneously exposed to the curated highlights of hundreds or thousands. The comparison drive did not change. The scale did. And the scale breaks the system.</p>
      <p>It gets worse. The content that rises to the top of your feed is not the content that reflects honest reality. It is the content that performs best — and performance on social media is driven primarily by aspiration, aesthetics, and achievement. The algorithm does not surface the ordinary Tuesday afternoon, the failed test, or the lonely Friday night. It surfaces the peak moments of the most photogenic version of the most successful-seeming people. Your brain is then asked to compare your honest, daily, unfiltered experience to this curated exhibition of everyone else's best moments.</p>
      <p>That comparison is not a fair one. It never was. And the fact that it makes you feel inadequate is not evidence that you are inadequate — it is evidence that you are running a broken comparison on broken data.</p>

      {/* ── Section 2 ── */}
      <h3 id="mental-health">2. The Mental Health Impact — What the Research Shows</h3>
      <p>The research on social media and mental health is now substantial enough to be unambiguous, even if the public conversation is still catching up to it. A landmark 2018 study by psychologists Amy Hunt and colleagues at the University of Pennsylvania found that reducing social media use to 30 minutes per day produced significant reductions in loneliness and depression within three weeks — not because the students suddenly had better lives, but because they stopped receiving a constant stream of information that their lives were inadequate.</p>
      <p><strong>Upward social comparison</strong> — comparing yourself to someone who appears to be doing better across any dimension — reliably produces negative affect. This is true even when you consciously know the comparison is unfair. The emotional system does not wait for the rational system to complete its analysis. The feeling comes first. The rationalisation that "it's just Instagram, it's not real" comes after the damage is already done.</p>
      <p><strong>Passive consumption</strong> — scrolling without commenting, liking, or engaging — consistently produces worse mental health outcomes than active engagement. This is counterintuitive until you understand the mechanism: passive scrolling means you are absorbing comparison data without the social connection that would contextualise it. You see the success without the conversation that might reveal the full picture.</p>
      <p>For students specifically, the impact concentrates in three areas: body image (consistently worsened by exposure to appearance-related content), academic self-efficacy (reduced by exposure to peers' achievement announcements), and social belonging (damaged by evidence of social events you were excluded from). All three are already under pressure during student years. Social media comparison applies specific, measurable stress to each.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="trigger-finder">3. Interactive: Find Your Comparison Triggers</h3>
      <p>Not all comparison works the same way. The content that sends your confidence off a cliff is specific to you — it relates to your particular insecurities, your current vulnerabilities, and the specific moments when your defences are lowest. Understanding your exact triggers is the first step to having any power over the pattern.</p>
      <p>Work through the three steps below to identify your primary comparison trigger category, your highest-risk scrolling moments, and a personalised action plan tailored to both.</p>

      <ComparisonTriggerFinder />

      {/* ── Section 4 ── */}
      <h3 id="detox-tips">4. Practical Social Media Detox Tips That Actually Work</h3>
      <p><strong>The environmental audit.</strong> Open each social media app you use and spend fifteen minutes in a deliberate unfollow or mute session. The criteria is simple: if this account has made me feel worse about myself more than once in the last month, it loses access to my feed. This is not aggression toward the person — it is basic curation of your psychological environment. You would not leave a television playing content that consistently made you anxious. Apply the same logic to your feed.</p>
      <p><strong>The friction principle.</strong> The easier something is to do, the more you do it. Remove social media apps from your phone's home screen and move them into a folder inside a folder — two extra taps to access. This tiny friction is enough to interrupt automatic, unconscious scrolling. You will still be able to use the apps intentionally. You will dramatically reduce the reflexive, mindless usage that produces most of the comparison damage.</p>
      <p><strong>The time-boxing approach.</strong> Instead of trying to eliminate social media — which almost never works sustainably — designate two specific windows per day for usage. Fifteen minutes after lunch and fifteen minutes in the early evening. Outside those windows, the apps are closed. This approach works not because it radically reduces your total time, but because it eliminates the most vulnerable scrolling windows: morning, night, and avoidance-driven sessions during study or work.</p>
      <p><strong>The seven-day consumption audit.</strong> For one week, every time you close a social media session, write one sentence about how you feel. Not a detailed journal — just one sentence. At the end of the week, read them in sequence. Most people are genuinely surprised by the consistency of the pattern: certain apps, certain account types, and certain times of day produce the same negative outcome reliably. Seeing the data about your own experience is more motivating than any external advice.</p>
      <p><strong>The replacement habit.</strong> Detox fails when it only removes without replacing. When the urge to scroll hits, you need an alternative that can occupy the same impulse — the need for stimulation, connection, or distraction. Identify three specific alternatives: something physical (a five-minute walk), something creative (a voice note to a friend, a line in a journal), and something absorbing (a podcast or audiobook you are actively following). The replacement works when it is specific and immediately available.</p>

      {/* ── Section 5 ── */}
      <h3 id="self-focus">5. Self-Focus Strategies: Redirecting Your Attention Inward</h3>
      <p>The long-term solution to social media comparison is not just limiting exposure to other people's content — it is building a more compelling relationship with your own. When your internal narrative is rich, specific, and engaged with your own progress, external comparison becomes less seductive because you have somewhere better to put your attention.</p>
      <p><strong>The personal progress journal.</strong> Begin tracking your own progress with the same granularity that social media documents other people's. Not publicly — privately. Write weekly about what you tried, what you learned, how you grew, and where you fell short. The act of documenting your own journey builds the kind of self-knowledge that makes comparison feel irrelevant. You become too absorbed in your own story to be consumed by someone else's highlight reel.</p>
      <p><strong>The contribution metric.</strong> Shift your primary measurement from performance (how you are doing relative to others) to contribution (what you are giving, building, or creating). Performance metrics are inherently comparative. Contribution metrics are inherently personal. When you measure yourself by what you have added to your own life and the lives of people around you, comparison becomes the wrong tool for the job.</p>
      <p><strong>The curiosity pivot.</strong> When you notice a comparison thought arising — "they have achieved so much more than me" — try replacing the comparative question with a curious one. Instead of "why do they have what I don't?" try "what specifically can I learn from how they got there?" This is not a trick to stop the feeling. It is a genuine redirection of the comparison instinct from envy toward inspiration — which research shows is the only form of social comparison that reliably produces positive outcomes.</p>
      <p><strong>The five-year timeline.</strong> Once a month, write about where you want to be in five years — not in vague, aspirational terms, but in specific, sensory, daily-life terms. What is your work like? Where do you live? How do you spend a typical Tuesday? This exercise anchors your attention to your own direction so firmly that the gap between your present and someone else's highlight loses its power. You are not on their timeline. You are on yours.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Social Media Comparison FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: My friends are all on social media. If I reduce it, will I miss out socially?</strong><br />
        A: The fear of missing out is one of the primary reasons people continue consuming content that makes them feel worse. But most genuinely important social information — plans, invitations, meaningful conversations — travels through direct message or call, not through passive feed content. Reducing your consumption does not reduce your connections. It reduces your exposure to comparison-inducing broadcast content, which is a different thing entirely.</p>

        <p><strong>Q: Is it possible to use social media without the comparison?</strong><br />
        A: Yes, with intentional structure. Active use — commenting, creating, direct messaging — consistently produces better mental health outcomes than passive consumption. If you use social media to create content, connect with specific people, or consume from accounts that genuinely inspire rather than deflate, the comparison effect is significantly reduced. The problem is almost entirely in the passive, scroll-driven consumption that constitutes most people's social media usage.</p>

        <p><strong>Q: What if I cannot stop comparing even when I try?</strong><br />
        A: The comparison instinct is deeply wired. The goal is not to eliminate it — that is not realistic. The goal is to reduce the frequency of automatic, unconscious comparison by removing exposure triggers, and to improve your response to comparison thoughts when they do arise — through reframing, self-compassion, and redirecting attention. If the comparison feels genuinely compulsive and is significantly affecting your daily functioning, speaking to a counsellor can help identify whether there is an underlying anxiety pattern worth addressing.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: INDIGO, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Comparison is the thief of joy — and social media is the world's most efficient delivery system for it."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Your timeline is not behind theirs. It is simply not theirs. The only competition that has ever mattered is between who you are today and who you want to become — and that race is run entirely inside your own life, not on anyone else's feed.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: INDIGO, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${IBORDER}` }}
          >
            Journal About This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: INDIGO, border: `2px solid ${INDIGO}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Building Your Mental Strength:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-kindness-check')} style={{ background: 'none', border: 'none', color: INDIGO, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Mid-Month Reset: Are You Treating Yourself with Kindness?
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-love-insecurity')} style={{ background: 'none', border: 'none', color: INDIGO, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Love Yourself Even When You Feel Insecure
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/handling-rejection')} style={{ background: 'none', border: 'none', color: INDIGO, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Handle Rejection Without Losing Confidence
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: INDIGO, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
