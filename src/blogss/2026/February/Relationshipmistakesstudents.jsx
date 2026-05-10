import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Common Relationship Mistakes Students Make (And How to Fix Them)",
  excerpt: "Most relationship mistakes students make are not failures of character — they are failures of skill. Nobody teaches us how to actually be in relationships. This guide names the eight most common mistakes, explains the psychology behind each one, and gives you a personalised Relationship Mistake Mirror to find your patterns and your fixes.",
  category: "Mental Health",
  date: "26-02-2026",
  readTime: "8 min read",
  wordCount: 1060,
  imgUrl: "/blogss/2026/February/relationship-mistakes-students.jpg",
  tldr: "Relationship mistakes students make are almost universally about one of three things: over-investing, under-communicating, or losing themselves in the dynamic. This guide covers eight of the most common, the psychology behind why they are so easy to fall into, and concrete solutions for each. The Relationship Mistake Mirror at the centre of the guide lets you select the patterns you recognise in yourself and generates a personalised fix plan for each one.",
  toc: [
    { id: "why-mistakes",  title: "1. Why Relationship Mistakes Are So Common in Student Life",        level: 3 },
    { id: "eight",         title: "2. The Eight Most Common Relationship Mistakes Students Make",       level: 3 },
    { id: "mirror",        title: "3. Interactive: The Relationship Mistake Mirror",                    level: 3 },
    { id: "patterns",      title: "4. The Three Underlying Patterns Behind Most Mistakes",              level: 3 },
    { id: "repair",        title: "5. How to Repair a Relationship After a Mistake",                   level: 3 },
    { id: "faq",           title: "6. Relationship Mistakes FAQs",                                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-26T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "relationship mistakes students, common relationship mistakes, relationship mistakes and solutions, how to fix relationship mistakes, student relationship problems, relationship advice students",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the most common relationship mistakes students make?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most common relationship mistakes students make include: losing their individual identity within a relationship, avoiding difficult conversations until they become explosions, expecting partners or friends to read their mind rather than communicating needs directly, keeping score of who gives more, making one person their entire social world, over-texting or checking in excessively from anxiety rather than genuine care, staying in relationships that have clearly passed their natural end, and comparing their relationship to curated social media versions of others'. Most of these mistakes share a root: unexamined anxiety about being enough, being wanted, and being safe in relationships.",
      },
    },
    {
      "@type": "Question",
      "name": "How do you fix relationship mistakes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fixing a relationship mistake requires three steps: honest acknowledgment of the specific behaviour and its impact (not a vague apology but a clear naming of what happened and why it mattered), a changed behaviour observable over time rather than just stated in conversation, and patience with the rebuilding of trust or connection that the mistake may have eroded. The most important element is the changed behaviour — not the apology, which is often the part that receives the most attention. Words are cheap; sustained differently-conducted behaviour is what actually repairs.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it normal to make relationship mistakes as a student?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not only is it normal — it is developmentally expected. Adolescence and early adulthood are the primary period for learning relationship skills, which means they are necessarily a period of practicing, failing, and gradually improving. Research by psychologist Jeffrey Arnett on 'emerging adulthood' identifies this life stage as characterised by identity exploration and relationship experimentation — both of which involve mistakes as an inherent feature of the learning process, not as evidence of being fundamentally unsuited for connection.",
      },
    },
  ],
};

// ── Mistake Mirror Data ────────────────────────────────────────────────────────
const BERRY   = '#8B3A5A';
const BPALE   = '#F8EEF3';
const BBORDER = 'rgba(139,58,90,0.22)';

const MISTAKES = [
  {
    id:      'm1',
    number:  '01',
    icon:    '📱',
    title:   'Over-checking and over-texting from anxiety',
    short:   'Sending multiple messages when one is not answered, checking whether they have seen your message, or needing constant contact to feel secure',
    why:     'Over-texting almost never comes from too much care — it comes from anxiety. The unanswered message triggers the brain\'s threat response: "Are they angry? Did I do something wrong? Do they not want to talk to me?" The repeated contact is an attempt to resolve the anxiety, not to express genuine affection. The problem is that it communicates the opposite of what is intended: instead of closeness, it signals insecurity, and it puts the other person in the position of managing your anxiety through their response timing.',
    fix:     'Identify the anxiety underneath the impulse to over-text. What specifically are you afraid of? Write it down before you send the second message. Most of the time, naming the fear is enough to interrupt the impulse. If the anxiety is persistent, the work is building the internal self-soothing capacity that means you do not need a message reply to feel safe.',
    script:  '"I noticed I have been over-messaging when I\'m anxious. I\'m working on that. If I send something and don\'t hear back, I\'ll trust that you\'ll respond when you can."',
    growth:  'Build the capacity to sit with the unanswered message for a full two hours before sending a follow-up. Each time you successfully wait, you strengthen the self-trust that the relationship does not require constant confirmation to be real.',
  },
  {
    id:      'm2',
    number:  '02',
    icon:    '🔮',
    title:   'Expecting people to read your mind',
    short:   'Not saying what you need, what is bothering you, or what you want — then being hurt when they do not provide it',
    why:     'Expecting mind-reading is one of the most universally common relationship mistakes. It usually comes from one of two sources: the belief that if they really cared, they would know (which is romantic and incorrect), or the fear that stating a need directly will make you look needy or demanding. The result is a relationship where both people are navigating with incomplete information, and where disappointment accumulates without ever being traceable to its actual source.',
    fix:     'Practise the direct statement of need in low-stakes situations first. Not "you never notice when I\'m upset" but "I am upset about something specific and I want to talk about it." Not "you should know what I want" but "I want [specific thing]." The directness feels vulnerable because it makes the need visible and therefore refusable. That vulnerability is the cost of genuine communication.',
    script:  '"I haven\'t been saying what I need directly — I\'ve been expecting you to pick it up. That\'s not fair. What I actually need right now is [specific thing]."',
    growth:  'Once a day for one week, practise stating one preference, need, or feeling directly — without softening it into a question or burying it in three other things. The directness muscle is built through small daily reps, not one dramatic conversation.',
  },
  {
    id:      'm3',
    number:  '03',
    icon:    '📊',
    title:   'Keeping score',
    short:   'Mentally tracking who did more, gave more, initiated more — and using the score to feel resentful or justified',
    why:     'Score-keeping in relationships is a symptom of a felt imbalance that has never been directly addressed. The scoreboard exists because the direct conversation about the imbalance feels too risky. Unfortunately, the scoreboard is a terrible substitute: it accumulates resentment without addressing the actual problem, it produces contempt rather than resolution, and it is reliably one-sided — you almost always have better access to your own contributions than to the other person\'s, which means the score is structurally biased toward you being ahead.',
    fix:     'When you notice yourself running a mental ledger, use it as a diagnostic rather than an indictment: "I am keeping score because I feel like the balance is off. Is that true? If yes — what specifically would I need to change for it to feel right? And have I communicated that clearly?" The answer to the last question is almost always no.',
    script:  '"I\'ve been keeping score internally instead of saying what I need — that\'s not fair to either of us. The honest thing I need from this relationship is [specific need]."',
    growth:  'For one month, experiment with radical non-reciprocity in one relationship — giving without tracking. Notice whether the felt imbalance is about actual reciprocity or about an unmet need that has nothing to do with keeping count.',
  },
  {
    id:      'm4',
    number:  '04',
    icon:    '🙈',
    title:   'Avoiding difficult conversations until they explode',
    short:   'Letting something that bothers you build up unaddressed until it comes out disproportionately or in the wrong moment',
    why:     'Conversation avoidance is one of the most studied relationship patterns. John Gottman\'s research identifies stonewalling — the refusal to engage with conflict — as one of the four strongest predictors of relationship dissolution. The avoidance feels protective: "If I raise it, we\'ll have an argument." But unaddressed issues do not disappear. They accumulate interest. The explosion that eventually comes — from a disproportionately small trigger that is actually carrying the weight of months of stored grievances — is significantly more damaging than the original conversation would have been.',
    fix:     'Address things at the first or second instance rather than the tenth. The threshold is simple: if something has bothered you more than twice, it deserves a conversation. Not a confrontation — a calm, specific, non-accusatory naming of what you noticed and how it affected you. "When [specific thing] happened, I felt [honest feeling]. I wanted to say it rather than let it sit."',
    script:  '"There\'s something I\'ve been avoiding saying because I didn\'t want to make it a thing. But I\'ve realised not saying it is making it bigger. Can I share it?"',
    growth:  'Practise the "24-hour rule": when something bothers you, give yourself 24 hours to decide whether it deserves a conversation. If after 24 hours it still feels significant — have the conversation. If it has passed, it was probably situational. This prevents both premature explosion and endless avoidance.',
  },
  {
    id:      'm5',
    number:  '05',
    icon:    '🌀',
    title:   'Losing yourself in the relationship',
    short:   'Gradually abandoning your interests, friendships, values, and opinions to merge with another person\'s world',
    why:     'Identity loss in relationships — sometimes called enmeshment — is one of the costliest mistakes because it is also one of the most invisible. It happens slowly and usually feels, in the early stages, like the beautiful expression of closeness. But a relationship where one person has dissolved into the other\'s preferences, social circle, and value system is not deep connection — it is codependence. And the person who has dissolved eventually either explodes back into themselves through conflict, or stays dissolved until the relationship ends and they discover they do not know who they are outside it.',
    fix:     'Maintain at least one friendship, one interest, and one value commitment that exists independently of your closest relationships. Not as a performance of independence — as genuine, lived, non-negotiable individuality. Paradoxically, the people who maintain their own identity within relationships are experienced as more attractive and more interesting by their partners and friends — because there is genuinely someone there.',
    script:  '"I\'ve realised I\'ve been losing myself in this — I haven\'t been protecting my own time and interests. I need to rebuild that, not because anything is wrong with us, but because I am a better person in this relationship when I am a whole person outside of it."',
    growth:  'Identify one thing you stopped doing after a close relationship began. Restart it this week — not as a rebellion, as a reclamation. Then protect it consistently.',
  },
  {
    id:      'm6',
    number:  '06',
    icon:    '🪢',
    title:   'Making one person your entire world',
    short:   'Allowing a single relationship — romantic or otherwise — to become your primary or only source of emotional support, social connection, and validation',
    why:     'This mistake is usually the expression of deep attachment need meeting limited social infrastructure. Student life can be isolating — familiar support networks are disrupted, building new ones takes time, and the intensity of a new close relationship fills the gap rapidly. The problem is the load: one person cannot sustainably be everything to another. When the relationship carries the full weight of all your social, emotional, and validation needs, any friction in that relationship becomes catastrophic — because there is no secondary network to absorb the impact.',
    fix:     'Diversify your relational portfolio deliberately. This does not mean making shallow connections — it means ensuring that no single relationship is carrying a disproportionate share of your emotional load. Invest in at least two or three relationships of different types: a close peer, a mentor or older connection, and if possible someone from outside your immediate environment.',
    script:  '"I think I\'ve been putting too much of my social needs on you and that\'s not fair. I need to build more connections rather than having this relationship carry everything."',
    growth:  'Make one new genuine social investment each month — not for networking, for actual connection. A coffee with someone you have been meaning to know better. A community or club that aligns with something you care about. The diversification happens incrementally.',
  },
  {
    id:      'm7',
    number:  '07',
    icon:    '🪞',
    title:   'Comparing your relationship to others\' curated versions',
    short:   'Measuring your relationships against what you see on social media or what other people present publicly — and finding yours lacking',
    why:     'Social comparison in relationships is almost always a comparison between your complete, unfiltered internal experience of your relationship and a carefully curated external presentation of someone else\'s. You have access to your own conflicts, doubts, boring moments, and difficult conversations. You have access to their highlight reel. This is not a fair comparison and it never produces accurate information. Research by social psychologist Leon Festinger shows that upward comparison — comparing yourself to someone who appears better off — reliably produces negative affect. Applied to relationships, it consistently produces dissatisfaction with perfectly good dynamics.',
    fix:     'When you notice comparison arising — "their relationship looks so easy, ours is so much work" — name the distortion: "I am comparing my inside to their outside." Then redirect the question: not "how does my relationship compare to theirs?" but "does this relationship meet the needs that matter most to me?" The second question has actual information in it.',
    script:  '"I\'ve been measuring us against how other relationships look from the outside and that\'s a bad comparison. I\'d rather focus on whether this actually works for the two of us."',
    growth:  'For one month, deliberately unfollow or mute any social media content that consistently produces relationship comparison. Observe whether your satisfaction with your own relationships changes.',
  },
  {
    id:      'm8',
    number:  '08',
    icon:    '⏳',
    title:   'Staying past the natural end',
    short:   'Remaining in a relationship — romantic, platonic, or otherwise — that has clearly run its course, out of habit, guilt, or fear of the alternative',
    why:     'Staying in a relationship past its natural end is one of the most expensive mistakes in terms of both time and emotional cost. The mechanisms that keep people in ended relationships are well-documented: sunk cost fallacy (we have put so much in), comfort with familiarity (even unhappy familiarity feels safer than unknown alternatives), guilt (they need me / I will hurt them), and fear of solitude (being alone feels worse than being wrong). None of these are good reasons. And all of them improve on the other side of the ending.',
    fix:     'The honest diagnostic is a single question: "If this relationship started today, exactly as it is, would I choose it?" If the answer is no — the relationship is being maintained by history and fear rather than by genuine current value. That does not automatically mean ending it — sometimes the diagnosis prompts a necessary repair conversation. But it is the most honest starting question.',
    script:  '"I\'ve been staying in a version of this that isn\'t working and that\'s not fair to either of us. I think we need an honest conversation about where this actually is."',
    growth:  'Write, privately and honestly, what this relationship is currently giving you versus what it is costing you. Not the relationship at its best — the relationship as it has actually been in the last three months. The resulting picture is usually clearer than the one that exists while you are inside the inertia.',
  },
];

// ── Mirror Component ───────────────────────────────────────────────────────────
function RelationshipMistakeMirror() {
  const [selected,    setSelected]    = useState([]);
  const [submitted,   setSubmitted]   = useState(false);
  const [openMistake, setOpenMistake] = useState(null);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleReset = () => { setSelected([]); setSubmitted(false); setOpenMistake(null); };

  const selectedMistakes = MISTAKES.filter(m => selected.includes(m.id));

  if (submitted && selectedMistakes.length > 0) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <div style={{ animation: 'floatUp 0.4s ease' }}>

          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${BERRY}, #B05278)`, borderRadius: '14px', padding: '24px', marginBottom: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🪞</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              Your Relationship Mistake Mirror
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
              You identified {selectedMistakes.length} pattern{selectedMistakes.length > 1 ? 's' : ''} — each one below comes with the psychology, the fix, and a ready-to-use script.
            </div>
          </div>

          {/* Intro insight */}
          <div style={{ background: 'white', border: `1.5px solid ${BBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: BERRY, marginBottom: '7px' }}>
              💡 Before You Read Your Fixes
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              {selectedMistakes.length === 1
                ? 'Identifying even one honest pattern is significant. Most people explain away their relationship habits rather than naming them. The fact that you have named this one is the beginning of changing it.'
                : selectedMistakes.length <= 3
                ? 'The patterns you have selected are connected — they almost certainly share a root cause. As you read through the fixes, notice whether the same underlying theme keeps appearing. It usually does.'
                : 'You have identified several patterns — which takes real honesty. Do not try to work on all of them simultaneously. Choose the one that costs you the most in your most important relationship and start there. Depth before breadth.'}
            </p>
          </div>

          {/* Individual fix cards */}
          {selectedMistakes.map((m, idx) => {
            const isOpen = openMistake === m.id;
            return (
              <div key={m.id} style={{ background: 'white', borderRadius: '13px', marginBottom: '10px', border: `1.5px solid ${BBORDER}`, borderLeft: `4px solid ${BERRY}`, overflow: 'hidden' }}>
                <button onClick={() => setOpenMistake(isOpen ? null : m.id)} style={{
                  width: '100%', padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', fontFamily: font,
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${BERRY}, #B05278)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span>{m.icon}</span>{m.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.4 }}>{m.short}</div>
                  </div>
                  <span style={{ color: BERRY, fontSize: '14px', flexShrink: 0, marginLeft: '8px' }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                    {/* Why */}
                    <div style={{ background: BPALE, borderRadius: '10px', padding: '13px 15px', margin: '14px 0 10px 0' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: BERRY, marginBottom: '6px' }}>🔬 Why This Happens</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{m.why}</p>
                    </div>

                    {/* Fix */}
                    <div style={{ background: 'white', border: `1.5px solid ${BBORDER}`, borderRadius: '10px', padding: '13px 15px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: BERRY, marginBottom: '6px' }}>✅ The Fix</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{m.fix}</p>
                    </div>

                    {/* Script */}
                    <div style={{ background: BPALE, border: `1.5px dashed ${BBORDER}`, borderRadius: '10px', padding: '13px 15px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: BERRY, marginBottom: '7px' }}>🎯 Ready-to-Use Script</div>
                      <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: BERRY, fontStyle: 'italic', lineHeight: 1.65 }}>{m.script}</p>
                    </div>

                    {/* Growth edge */}
                    <div style={{ background: 'white', border: `1px solid var(--border)`, borderRadius: '10px', padding: '13px 15px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '6px' }}>🌱 Growth Practice</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{m.growth}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Closing */}
          <div style={{ background: BPALE, border: `1.5px solid ${BBORDER}`, borderRadius: '12px', padding: '16px 20px', margin: '16px 0', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: BERRY, fontStyle: 'italic', lineHeight: 1.55 }}>
              "A mistake recognised is a mistake half-fixed. What you do with it now is the whole other half."
            </p>
          </div>

          <button onClick={handleReset} style={{
            background: 'transparent', border: `1.5px solid ${BBORDER}`, color: BERRY,
            padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
            fontWeight: '700', fontFamily: font,
          }}>↺ Select different patterns</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        Which of these patterns do you recognise in yourself?
      </p>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Select every one that honestly resonates — even if it is uncomfortable. The more honest your selection, the more useful your fix plan. You can select multiple.
      </p>

      {MISTAKES.map(m => {
        const isSel = selected.includes(m.id);
        return (
          <button key={m.id} onClick={() => toggleSelect(m.id)} style={{
            width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid',
            borderColor: isSel ? BERRY : 'var(--border)',
            background: isSel ? BPALE : 'white',
            cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
            display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px',
            boxShadow: isSel ? `0 0 0 3px ${BBORDER}` : 'var(--shadow-sm)',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
              background: isSel ? `linear-gradient(135deg, ${BERRY}, #B05278)` : 'var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: 'white', transition: 'all 0.15s',
            }}>
              {isSel ? '✓' : m.number}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: isSel ? BERRY : 'var(--ink)', display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                <span>{m.icon}</span>{m.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{m.short}</div>
            </div>
          </button>
        );
      })}

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '600' }}>
          {selected.length === 0 ? 'Select at least one pattern above' : `${selected.length} pattern${selected.length > 1 ? 's' : ''} selected`}
        </div>
        <button
          onClick={() => { if (selected.length > 0) setSubmitted(true); }}
          disabled={selected.length === 0}
          style={{
            marginLeft: 'auto', padding: '13px 28px', borderRadius: '50px', border: 'none',
            background: selected.length > 0 ? `linear-gradient(135deg, ${BERRY}, #B05278)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed', fontFamily: font,
            transition: 'all 0.2s', boxShadow: selected.length > 0 ? `0 6px 18px ${BBORDER}` : 'none',
          }}
        >
          Get My Fix Plan →
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RelationshipMistakesStudents({ navigate, relatedPosts }) {
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
      <p>Nobody hands you a manual for relationships. You arrive in them — romantic ones, deep friendships, complicated family dynamics — equipped largely with what you absorbed from watching other imperfect people navigate their own imperfect relationships. It is not surprising that mistakes happen. What is surprising is how consistently the same mistakes appear, across different people, different contexts, and different cultures.</p>

      <p>The <strong>relationship mistakes students make</strong> are not random. They cluster around predictable patterns — over-investing in the wrong ways, under-communicating the things that matter, and losing the self in the process of trying to maintain the connection. Understanding the pattern is not the same as excusing it. But it is the prerequisite for changing it.</p>

      <img
        src={meta.imgUrl}
        alt="Students learning about common relationship mistakes and how to fix them — practical relationship advice for young people"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-mistakes">1. Why Relationship Mistakes Are So Common in Student Life</h3>
      <p>Student life is a uniquely high-stakes relational environment. You are simultaneously navigating the most significant developmental task of early adulthood — building a stable, coherent identity — inside some of the most intense relational environments you will ever encounter. New institutions, new social hierarchies, disrupted family structures, and for the first time in most people's lives, relationships formed entirely outside the supervision and mediation of family. It is a lot to navigate without much preparation.</p>
      <p>Psychologist Jeffrey Arnett's research on "emerging adulthood" — the developmental stage roughly corresponding to the student years — identifies this period as characterised by identity exploration and instability. This is not a criticism. It is a description of what is supposed to happen. Identity exploration means trying on different versions of yourself, including different relational versions. It means making choices that sometimes work and sometimes do not. The mistakes are not evidence that something is wrong with you. They are the syllabus.</p>
      <p>The specific patterns that produce the most common relationship mistakes in student life tend to share common roots. Attachment anxiety — the fear of abandonment or disconnection — drives over-texting, mind-reading expectations, and the collapse of individual identity into a relationship. Conflict avoidance — the fear of disapproval or argument — drives the suppression of needs, the accumulation of unaddressed grievances, and the tendency to stay past a relationship's natural end. And the absence of relational skill-building — which is genuinely not taught in most educational contexts — means many of the patterns that produce most relationship friction go unnamed and therefore unexamined for years.</p>

      {/* ── Section 2 ── */}
      <h3 id="eight">2. The Eight Most Common Relationship Mistakes Students Make</h3>
      <p>The eight mistakes below are not a comprehensive list — there is no such thing. They are the patterns that appear most consistently, that cause the most identifiable damage, and that have the most practical and addressable solutions. They are presented here in brief; the interactive tool below goes deeper into each one with personalised fixes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
        {MISTAKES.map(m => (
          <div key={m.id} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `linear-gradient(135deg, ${BERRY}, #B05278)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{m.number}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{m.icon}</span>{m.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{m.short}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Interactive ── */}
      <h3 id="mirror">3. Interactive: The Relationship Mistake Mirror</h3>
      <p>The mirror works through honest self-recognition. Select every pattern from the eight above that you genuinely recognise in yourself — in any relationship, not just the most obvious one. The more honest your selection, the more targeted and useful your personalised fix plan will be. Each selected mistake comes with a detailed explanation of the psychology behind it, a concrete fix, a ready-to-use script, and a growth practice.</p>

      <RelationshipMistakeMirror />

      {/* ── Section 4 ── */}
      <h3 id="patterns">4. The Three Underlying Patterns Behind Most Mistakes</h3>
      <p>Most of the eight mistakes described above are surface expressions of one of three deeper patterns. Understanding which pattern you are working with matters more than understanding any individual mistake — because the pattern is what the fixes need to address, and individual mistake-by-mistake correction without addressing the pattern is like treating symptoms without diagnosing the condition.</p>
      <p><strong>Pattern One: Attachment Anxiety.</strong> Over-texting, expecting mind-reading, making one person your entire world, and losing yourself in a relationship all share the same root: fear that the connection is not secure unless constantly confirmed. Attachment anxiety — the chronic worry that you will be abandoned, rejected, or not enough — produces behaviours that feel like expressions of love but function as requests for constant reassurance. The long-term fix for attachment anxiety is not about changing specific behaviours but about building the internal security that reduces the need for external confirmation. This is the work of a strong relationship with yourself, which is the most direct path to less anxious relating to others.</p>
      <p><strong>Pattern Two: Conflict Avoidance.</strong> Storing grievances, avoiding difficult conversations, staying past the natural end, and expecting mind-reading are all, at their core, strategies for avoiding the discomfort of direct engagement with conflict. Conflict avoidance is almost always learned — most people grew up in environments where conflict either did not happen (was suppressed) or happened badly (explosively and without resolution). Neither model produces the skill set for navigating relational friction calmly, directly, and productively. The fix is not becoming someone who enjoys conflict — it is building enough tolerance for relational discomfort that you can engage with necessary conversations before they become crises.</p>
      <p><strong>Pattern Three: Comparison and External Validation.</strong> Comparing your relationship to others', keeping score, and over-investing in the performance of the relationship rather than the reality of it are all expressions of measuring relationship quality through external rather than internal criteria. The fix requires shifting the primary question from "how does this look?" or "how does this compare?" to "does this actually work for me and for us?" — which requires enough self-knowledge to have an honest answer, and enough self-trust to act on it.</p>

      {/* ── Section 5 ── */}
      <h3 id="repair">5. How to Repair a Relationship After a Mistake</h3>
      <p>Most relationship mistakes are repairable. The ones that are not are almost always ones where the repair was never genuinely attempted — where the apology substituted for the changed behaviour, or where the acknowledgment was so vague it never made contact with the actual harm. Genuine repair is more specific, more behavioural, and more patient than the version most people practise.</p>
      <p><strong>Step one: Name the specific behaviour, not the general character.</strong> "I have been keeping score and using it to justify resentment rather than saying what I needed" is repair language. "I haven't been great lately" is not. The specificity of the acknowledgment communicates that you actually understand what happened — which is the precondition for the other person believing you can change it.</p>
      <p><strong>Step two: Acknowledge the impact without qualification.</strong> "I know that hurt you, and I understand why" is repair language. "I know that hurt you, but I was stressed and you know I didn't mean it" is not. Every "but" in an apology reverses the acknowledgment. The impact is real regardless of the intention or the context. Name the impact fully before — or instead of — contextualising the cause.</p>
      <p><strong>Step three: Change behaviour rather than promising to change behaviour.</strong> Promises to change are abundant and cheap. Sustained changed behaviour is rare and meaningful. The most convincing evidence that a repair is genuine is the observation, over weeks and months, that the specific behaviour has actually shifted. Give the change time to accumulate before expecting the relationship to return fully to where it was. Trust is rebuilt slowly and through evidence, not through statements of intent.</p>
      <p><strong>Step four: Tolerate the gap between your repair and their readiness to receive it.</strong> Repair does not always produce immediate reconciliation. Sometimes the person who was hurt needs time to process before they can receive the acknowledgment, even if the acknowledgment is genuine and complete. This gap is not a sign that the repair failed. It is a sign that the harm was real and required real processing. Tolerating the gap — without withdrawing the repair or pressuring for a faster return to normal — is itself part of the repair.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Relationship Mistakes FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if the relationship mistake was serious — not just a habit but something that genuinely hurt someone?</strong><br />
        A: The repair framework above applies, but with greater weight on the acknowledgment of impact and the time required for trust to rebuild. Serious mistakes — betrayals of confidence, significant dishonesty, repeated violations of expressed limits — often require not just changed behaviour but genuine accountability: acknowledging the full scope of the harm without minimisation, allowing the other person to be fully hurt without rushing them toward forgiveness, and giving the changed behaviour a sustained period to demonstrate itself before any expectation of restored trust. In some cases, and this is worth holding honestly, some serious mistakes cannot be fully repaired within the same relationship — the repair may be genuine, and the relationship may still need to change significantly or end. Both outcomes can be the right one.</p>

        <p><strong>Q: How do I know if a relationship mistake is mine to fix or a dynamic we both created?</strong><br />
        A: Most relational patterns are co-created — they require two people's contributions to sustain themselves. Even the patterns above that look like individual mistakes almost always exist within a relational system that enables them: the person who over-texts is usually in a relationship with someone whose unavailability triggers the anxiety; the person who avoids difficult conversations is usually in a relationship where past attempts at directness produced disproportionate conflict. Taking ownership of your contribution to a pattern is both honest and productive. It does not mean taking ownership of the whole pattern — that is rarely accurate and is often a form of self-blame that lets the relational system off the hook.</p>

        <p><strong>Q: What if I recognise all eight mistakes in myself?</strong><br />
        A: Do not try to address all eight simultaneously — that is the surest way to address none of them. Instead, identify the one that is currently causing the most damage in your most important relationship and work on that one specifically for the next four to six weeks. Changes in one area of relational behaviour often produce ripple effects in others — particularly because many of the eight share the same underlying pattern. Fix the root pattern and several surface mistakes resolve without individual attention.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: BERRY, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "The measure of a person is not whether they make relationship mistakes — everyone does. It is what they do with them when they see them clearly."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          You will not get relationships perfectly right. Nobody does. But you can get progressively better — at seeing your patterns more quickly, at communicating more directly, at caring for others without losing yourself in the process. Each mistake recognised and addressed is a skill being built. That is what growing up actually looks like.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: BERRY, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${BBORDER}` }}
          >
            Reflect on This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: BERRY, border: `2px solid ${BERRY}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Growing in Your Relationships:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/relationship-red-flags',        '→ How to Identify Red Flags in Relationships Early'],
            ['/blog/relationships-mental-health',   '→ How Relationships Affect Your Mental Health (Positive & Negative)'],
            ['/blog/communication-relationships',   '→ How to Communicate Better in Relationships (Student Guide)'],
            ['/blog/emotional-boundaries',          '→ Emotional Boundaries: What They Are and How to Set Them'],
            ['/blog/relationship-with-yourself',    '→ How to Build a Strong Relationship with Yourself'],
            ['/safe',                               '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: BERRY, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
