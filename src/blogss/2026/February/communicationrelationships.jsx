import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Communicate Better in Relationships (Student Guide)",
  excerpt: "Poor communication is the root cause of most relationship problems — not bad intentions, not incompatibility. Learn the exact scripts, listening techniques, and mistakes to avoid that will transform how you connect with friends, family, and partners.",
  category: "Mental Health",
  date: "12-02-2026",
  readTime: "7 min read",
  wordCount: 1040,
  imgUrl: "/blogss/2026/February/communication-relationships.jpg",
  tldr: "Communication skills in relationships are not about being articulate — they are about being brave enough to say the true thing in the right way. This guide covers the 4 communication styles, scripts for the hardest conversations, the most damaging listening mistakes students make, and a personalised style finder that reveals exactly how you communicate under pressure.",
  toc: [
    { id: "why-it-breaks",     title: "1. Why Relationships Break Down (It Is Usually This)",         level: 3 },
    { id: "four-styles",       title: "2. The 4 Communication Styles — Which One Are You?",           level: 3 },
    { id: "style-finder",      title: "3. Interactive: Find Your Communication Style",                level: 3 },
    { id: "scripts",           title: "4. Scripts for the Hardest Conversations",                     level: 3 },
    { id: "listening",         title: "5. The Listening Mistakes That Destroy Conversations",         level: 3 },
    { id: "faq",               title: "6. Communication in Relationships FAQs",                       level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-12T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "communication skills in relationships, how to communicate better, assertive communication, active listening, student relationships, relationship communication tips",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I improve communication skills in relationships?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most impactful improvements come from three shifts: moving from 'You' statements to 'I' statements, replacing assumption with curiosity ('What did you mean by that?'), and learning to listen to understand rather than to reply. Assertive communication — expressing your needs clearly while respecting others — is the research-backed gold standard for healthy relationship communication.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the biggest communication mistakes in friendships?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most common and damaging mistakes include: interrupting to offer solutions when someone needs to feel heard, using silent treatment as a conflict strategy, making assumptions instead of asking questions, and defaulting to passive or aggressive responses under stress. Each of these creates distance rather than connection.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I start a difficult conversation without it becoming a fight?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with a time request rather than an ambush: 'Can we talk about something later when you have a few minutes?' Begin with your observation, not your verdict: 'I noticed X' instead of 'You always Y.' Use the format: Observation + Impact + Request. This structure is taught in conflict resolution training and consistently reduces defensive responses.",
      },
    },
  ],
};

// ── Communication Style Finder Data ───────────────────────────────────────────
// Styles: P = Passive, PA = Passive-Aggressive, A = Aggressive, As = Assertive
const SCENARIOS = [
  {
    situation: "Your group project partner has not done their section and the deadline is tomorrow morning.",
    options: [
      { style: 'P',  text: "I will just do it myself. No point making things awkward before a deadline." },
      { style: 'PA', text: "Fine. I guess I will do everything as usual." },
      { style: 'A',  text: "You are completely useless. I am telling the teacher you contributed nothing." },
      { style: 'As', text: "The deadline is tomorrow and your section is not done. Can we figure out how to finish this tonight?" },
    ],
  },
  {
    situation: "A friend has cancelled plans with you at the last minute for the third time this month.",
    options: [
      { style: 'P',  text: "It is fine, I understand you are busy. Do not worry about it." },
      { style: 'PA', text: "Sure, no problem." — you never initiate plans again and slowly drift away." },
      { style: 'A',  text: "You always do this. You clearly do not care about this friendship at all." },
      { style: 'As', text: "I want to mention — this is the third time this month. It is starting to affect me. Can we talk about it?" },
    ],
  },
  {
    situation: "A classmate says something that genuinely hurts your feelings in the group chat.",
    options: [
      { style: 'P',  text: "You laugh it off with an emoji and say nothing, but it stays with you all day." },
      { style: 'PA', text: "You post something vague that is clearly about them and wait for people to notice." },
      { style: 'A',  text: "You call them out immediately in the group chat in front of everyone." },
      { style: 'As', text: "You message them privately: 'That comment really stung. I do not think you meant to — but it did.'" },
    ],
  },
  {
    situation: "A family member dismisses your exam stress by saying 'It is not that serious, stop overthinking.'",
    options: [
      { style: 'P',  text: "You go quiet, agree, and carry the stress alone for the rest of the day." },
      { style: 'PA', text: "You say 'fine' and then vent about them to everyone else for the next week." },
      { style: 'A',  text: "You raise your voice, say it is not fair, and storm out of the room." },
      { style: 'As', text: "I hear you. But this is genuinely stressful for me, even if it seems small. I just need to feel heard right now." },
    ],
  },
  {
    situation: "A classmate keeps interrupting you every time you speak in group discussions.",
    options: [
      { style: 'P',  text: "You trail off, let them take over, and stop contributing to discussions." },
      { style: 'PA', text: "You start doing the same to them without saying anything directly." },
      { style: 'A',  text: "You cut them off mid-sentence and say loudly: 'I was not finished speaking.'" },
      { style: 'As', text: "You hold up a hand calmly and say: 'I would like to finish my thought — I will hear yours right after.'" },
    ],
  },
];

const RESULTS = {
  P: {
    style: 'Passive',
    colour: '#2448A0', pale: '#EBF5FB', border: 'rgba(36,72,160,0.25)',
    icon: '🌊',
    headline: 'You prioritise others\' peace over your own truth.',
    description: 'You are likely seen as easygoing, agreeable, and low-drama — which feels safe. But underneath, you may often feel unheard, resentful, or invisible. You say yes when you mean no, and then quietly absorb the cost. Over time, unexpressed needs do not disappear. They accumulate into distance, burnout, and relationships that feel hollow because the other person is connecting with a version of you that is only partially real.',
    upgrade: 'Start small. You do not need to have every hard conversation at once. Pick one low-stakes moment this week and say the true thing instead of the safe thing. Notice what actually happens. It is almost never as catastrophic as the anticipatory anxiety suggests.',
    mantra: 'My needs are not an inconvenience. They are information.',
  },
  PA: {
    style: 'Passive-Aggressive',
    colour: '#B54708', pale: '#FEF3C7', border: 'rgba(181,71,8,0.25)',
    icon: '🌫️',
    headline: 'Your frustration is real — but it travels underground.',
    description: 'Passive-aggressive communication develops when someone learns that direct expression is unsafe or ineffective — usually from early experience. It is a completely understandable adaptation. The problem is that indirect signals — vague posts, cold responses, doing the minimum — confuse the other person, who often does not even know what they did. The issue never gets resolved. The same pattern repeats. And you carry the frustration alone because no one ever knows exactly what is wrong.',
    upgrade: 'The next time you notice yourself crafting an indirect signal, pause and ask: "What do I actually want the other person to understand?" Write it in plain language. You do not have to send it immediately — but naming it directly, even just to yourself, is the first step toward saying it aloud.',
    mantra: 'Saying the true thing directly is not an attack. It is an invitation to fix something.',
  },
  A: {
    style: 'Aggressive',
    colour: '#C0392B', pale: '#FDECEA', border: 'rgba(192,57,43,0.25)',
    icon: '⚡',
    headline: 'You are direct and you advocate for yourself — both genuinely valuable.',
    description: 'Aggressive communication often comes from a deep sense of justice, frustration that has been swallowed too many times, or environments where softness was read as weakness. The core instinct — that your needs matter and should be heard — is entirely correct. The delivery is the problem. When communication triggers the other person\'s threat response, they stop listening and start defending. You end up saying exactly the right things in a way that guarantees they will not land.',
    upgrade: 'Before an important conversation, ask yourself: "Do I want to be right, or do I want to be understood?" They require different approaches. Try adding one sentence of acknowledgment before your concern: "I know you have been under pressure too" — not to be polite, but to lower their defences enough to actually hear you.',
    mantra: 'The loudest version of the truth is rarely the one that gets through.',
  },
  As: {
    style: 'Assertive',
    colour: '#185A24', pale: '#E8F5EE', border: 'rgba(24,90,36,0.25)',
    icon: '🌿',
    headline: 'You express your needs clearly while genuinely respecting others.',
    description: 'Assertive communication is the research-backed gold standard — not because it is the nicest or most polite style, but because it actually works. You say what is true without attacking, you hold boundaries without building walls, and you create the conditions for genuine resolution rather than temporary ceasefire. This is a real skill that took real practice, and it shows. The ongoing challenge for assertive communicators is consistency — maintaining this under high stress, with people who are not operating at the same level.',
    upgrade: 'Your growth edge is helping others come to meet you. When someone responds passively or aggressively, practise slowing the conversation down: "I want us to actually work this out. Can we try again from the beginning?" You model the thing you want to receive.',
    mantra: 'Clear is kind. Unclear is unkind.',
  },
};

// ── Style Finder Component ─────────────────────────────────────────────────────
function CommunicationStyleFinder() {
  const [answers,   setAnswers]   = useState({});
  const [current,   setCurrent]   = useState(0);
  const [done,      setDone]      = useState(false);
  const [selected,  setSelected]  = useState(null);

  const total     = SCENARIOS.length;
  const answered  = Object.keys(answers).length;
  const allDone   = answered === total;

  // tally dominant style
  const getResult = () => {
    const counts = { P: 0, PA: 0, A: 0, As: 0 };
    Object.values(answers).forEach(s => { counts[s] = (counts[s] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleSelect = (style) => {
    setSelected(style);
  };

  const handleNext = () => {
    if (selected === null) return;
    const next = { ...answers, [current]: selected };
    setAnswers(next);
    setSelected(null);
    if (current < total - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setAnswers({}); setCurrent(0); setDone(false); setSelected(null);
  };

  const scenario = SCENARIOS[current];
  const styleKey = done ? getResult() : null;
  const result   = styleKey ? RESULTS[styleKey] : null;

  // shuffle options order consistently per question
  const shuffled = scenario
    ? [...scenario.options].sort((a, b) =>
        (a.style.charCodeAt(0) * 3 + current) % 4 - (b.style.charCodeAt(0) * 3 + current) % 4
      )
    : [];

  const styleColours = {
    P:  { bg: '#EBF5FB', border: 'rgba(36,72,160,0.3)',    text: '#2448A0' },
    PA: { bg: '#FEF3C7', border: 'rgba(181,71,8,0.3)',     text: '#B54708' },
    A:  { bg: '#FDECEA', border: 'rgba(192,57,43,0.3)',    text: '#C0392B' },
    As: { bg: '#E8F5EE', border: 'rgba(24,90,36,0.3)',     text: '#185A24' },
  };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)' }}>

      {!done ? (
        <>
          {/* Progress bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Scenario {current + 1} of {total}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--sky)' }}>
                {Math.round(((current) / total) * 100)}% complete
              </span>
            </div>
            <div style={{ height: '5px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '5px',
                background: 'linear-gradient(90deg, var(--sky), var(--sage))',
                width: `${(current / total) * 100}%`,
                transition: 'width 0.35s ease',
              }} />
            </div>
          </div>

          {/* Scenario */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '16px', border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>
              What would you most likely do?
            </div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--ink)', lineHeight: '1.55' }}>
              {scenario.situation}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {shuffled.map((opt, i) => {
              const isActive = selected === opt.style;
              const sc = styleColours[opt.style];
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.style)}
                  style={{
                    padding: '14px 18px', borderRadius: '10px', border: '2px solid',
                    borderColor: isActive ? sc.text : 'var(--border)',
                    background: isActive ? sc.bg : 'white',
                    color: 'var(--ink)', cursor: 'pointer', fontWeight: '500',
                    fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.15s',
                    textAlign: 'left', lineHeight: '1.55',
                    boxShadow: isActive ? `0 0 0 3px ${sc.border}` : 'none',
                  }}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={selected === null}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: selected !== null ? 'var(--sky)' : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              fontFamily: 'inherit', cursor: selected !== null ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {current < total - 1 ? 'Next Scenario →' : 'Reveal My Communication Style →'}
          </button>
        </>
      ) : (
        result && (
          <div style={{ animation: 'floatUp 0.35s ease' }}>

            {/* Result header */}
            <div style={{
              background: result.pale, border: `2px solid ${result.border}`,
              borderRadius: '14px', padding: '22px 24px', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <span style={{ fontSize: '36px' }}>{result.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: result.colour, marginBottom: '3px' }}>
                    Your Primary Communication Style
                  </div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: '700', color: result.colour }}>
                    {result.style}
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: result.colour, fontStyle: 'italic' }}>
                "{result.headline}"
              </p>
            </div>

            {/* Description */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${result.border}` }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>
                What this style looks like from the outside
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.75' }}>
                {result.description}
              </p>
            </div>

            {/* Upgrade path */}
            <div style={{ background: result.pale, borderRadius: '12px', padding: '18px 20px', marginBottom: '12px', border: `1.5px solid ${result.border}` }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: result.colour, marginBottom: '8px' }}>
                Your communication upgrade
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: '1.75', fontWeight: '500' }}>
                {result.upgrade}
              </p>
            </div>

            {/* Mantra */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', border: `1.5px dashed ${result.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>
                Your communication mantra
              </div>
              <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '600', color: result.colour, fontStyle: 'italic', lineHeight: '1.5' }}>
                "{result.mantra}"
              </p>
            </div>

            <button
              onClick={handleReset}
              style={{
                background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--muted)',
                padding: '9px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: 'inherit',
              }}
            >↺ Retake the quiz</button>
          </div>
        )
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CommunicationRelationships({ navigate, relatedPosts }) {
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
      <p>Think about the last relationship problem you had — with a friend, a family member, a classmate, or someone you were close to. Now think honestly: was the core problem that the two of you were incompatible? Or was it that something true never got said clearly, and both of you ended up filling the silence with assumptions?</p>

      <p>Research from the Gottman Institute — the most extensive study of relationship communication ever conducted — found that the quality of communication in a relationship is a stronger predictor of its health than compatibility, shared interests, or even affection. In other words: <strong>communication skills in relationships</strong> are not a nice-to-have. They are the thing.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning communication skills in relationships — active listening and assertive expression"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-it-breaks">1. Why Relationships Break Down (It Is Usually This)</h3>
      <p>Most relationship damage does not happen in one dramatic confrontation. It accumulates in small moments of miscommunication that were never repaired — a comment that landed wrong and nobody acknowledged, a need that was implied but never stated, a hurt that got swallowed instead of spoken.</p>
      <p>The Gottman Institute's research identified what they call the Four Horsemen of relationship deterioration: criticism (attacking the person rather than the behaviour), contempt (expressing superiority or disgust), defensiveness (meeting a concern with a counter-complaint), and stonewalling (complete emotional shutdown and withdrawal). All four are communication failures. All four are correctable with specific, learnable skills.</p>
      <p>The good news is that relationships rarely die from one catastrophic failure. They die from the accumulation of small communication gaps that nobody bothered to close. Which means they can almost always be repaired — if at least one person is willing to change how they show up to a conversation.</p>

      {/* ── Section 2 ── */}
      <h3 id="four-styles">2. The 4 Communication Styles — Which One Are You?</h3>
      <p>Psychologists and communication researchers consistently identify four primary styles that people default to under stress. Each has a distinct internal logic — a reason it developed — and a distinct external cost that the person using it often cannot see clearly.</p>
      <p><strong>Passive communication</strong> prioritises relational peace at the expense of personal truth. The passive communicator says yes when they mean no, stays quiet when they feel hurt, and hopes the other person will somehow intuit what they need without being told. The result is safety in the short term and quiet resentment in the long term.</p>
      <p><strong>Aggressive communication</strong> prioritises personal truth at the expense of relational safety. The aggressive communicator is direct — admirably so — but the delivery triggers the other person's threat response, which means the message stops being heard the moment it gets loud or accusatory. Ironically, aggressive communicators are often misunderstood despite being maximally direct.</p>
      <p><strong>Passive-aggressive communication</strong> expresses frustration indirectly — through sarcasm, withdrawal, vague social media posts, or doing the absolute minimum without explanation. It protects the person from direct conflict but creates a fog of confusion that makes resolution nearly impossible, because the issue is never named clearly enough to be addressed.</p>
      <p><strong>Assertive communication</strong> is the research-backed ideal: expressing your needs, observations, and feelings clearly and specifically, while genuinely respecting the other person's perspective. It is not the same as being polite or nice — it is being precise. And precision is what allows real problems to be solved.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="style-finder">3. Interactive: Find Your Communication Style</h3>
      <p>How you communicate under pressure is often different from how you think you communicate. Work through the five scenarios below — each based on a common student relationship situation — and respond with what you would <em>most honestly</em> do, not what you think the right answer is. At the end, you will get a full breakdown of your dominant style and a personalised upgrade path.</p>

      <CommunicationStyleFinder />

      {/* ── Section 4 ── */}
      <h3 id="scripts">4. Scripts for the Hardest Conversations</h3>
      <p>Knowing what to say and actually being able to say it in the moment are very different things. The gap between them closes with preparation. Here are word-for-word scripts for the situations students most commonly freeze in:</p>

      <p><strong>Script 1 — Starting a difficult conversation without triggering defensiveness:</strong><br />
      <em>"I want to talk about something that has been on my mind. It is not an accusation — I just want us to understand each other better. Can we find 10 minutes?"</em><br />
      Why it works: You request consent, remove the threat framing, and signal collaborative intent before the conversation begins. Their nervous system stays regulated enough to listen.</p>

      <p><strong>Script 2 — Expressing hurt without blame:</strong><br />
      <em>"When [specific thing happened], I felt [specific emotion] — not because of what you intended, but because of how it landed for me. I wanted to tell you instead of letting it sit."</em><br />
      Why it works: It separates impact from intent, keeps the focus on your experience rather than their character, and signals that your goal is clarity — not punishment.</p>

      <p><strong>Script 3 — Saying no without over-explaining:</strong><br />
      <em>"I cannot do that right now. I do not have the capacity. I hope you understand."</em><br />
      Why it works: You do not owe an exhaustive justification. An over-explained no sounds apologetic and invites negotiation. A clean, warm no is more respectful to both people.</p>

      <p><strong>Script 4 — Repairing after a fight:</strong><br />
      <em>"I did not handle that well. I said [specific thing] in a way I regret. What I actually wanted to say was [clearer version]. Can we try again?"</em><br />
      Why it works: It takes specific accountability rather than a vague apology, and it offers the corrected version — which gives the relationship something to move forward from.</p>

      {/* ── Section 5 ── */}
      <h3 id="listening">5. The Listening Mistakes That Destroy Conversations</h3>
      <p>Poor listening is responsible for more relationship damage than poor speaking — because most people believe they are better listeners than they are. Research by Dr Ralph Nichols at the University of Minnesota found that the average person listens at only 25% efficiency, meaning they miss or distort three quarters of what is actually being said.</p>
      <p><strong>Mistake 1 — Listening to reply, not to understand.</strong> While the other person is speaking, you are composing your response. You catch fragments and fill the gaps with assumption. The other person feels subtly unheard even if they cannot articulate why. The fix: genuinely hold your response until they finish, even if there is a pause afterward. Let the pause sit.</p>
      <p><strong>Mistake 2 — Jumping to solutions when someone needs to feel heard.</strong> Someone tells you they are stressed about their parents. You immediately list three action steps. They go quiet. They were not asking to be fixed — they were asking to be understood. The most powerful question in these moments is: <em>"Do you want advice, or do you just need to vent right now?"</em> Asking this changes everything.</p>
      <p><strong>Mistake 3 — Minimising with comparison.</strong> "At least you do not have to deal with what I have to deal with." Even with kind intentions, this communicates: your pain is not big enough to deserve this conversation. It shuts people down completely.</p>
      <p><strong>Mistake 4 — Using silence as punishment.</strong> The silent treatment is not neutral communication — it is aggressive communication without words. It creates anxiety, breeds assumption, and resolves nothing. If you genuinely need time before you can speak constructively, say exactly that: <em>"I need a few hours before I can talk about this properly."</em> That is honest. Disappearing without explanation is not.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Communication in Relationships FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if I try to communicate openly and the other person shuts down?</strong><br />
        A: You cannot control someone else's communication style — only your own. What you can do is name what is happening without blame: "I notice when I bring this up, the conversation closes down. I want us to be able to talk about hard things. Can we figure out a better way to approach this together?" Sometimes the way in is slower and more indirect than you would like. And sometimes the other person simply is not ready or willing — which is its own answer.</p>

        <p><strong>Q: Is it ever okay to send a difficult message over text rather than face-to-face?</strong><br />
        A: Yes, with conditions. Text removes tone, facial expression, and the real-time ability to clarify — which dramatically increases the chance of misinterpretation. For anything emotionally significant, text is only appropriate as a way to open the door: <em>"Can we talk about [topic] later today?"</em> The actual conversation should happen in a medium where both of you can actually hear each other.</p>

        <p><strong>Q: How do I communicate better with family members who grew up in a very different communication culture?</strong><br />
        A: Cross-generational communication in Indian families often requires meeting people where they are rather than insisting on a format they are not familiar with. Focus on timing (not during stress, not in public), framing (position your need as helping the family, not just yourself), and starting smaller than you think is necessary. Change in communication patterns within families is slow but absolutely possible.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sky)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "The single biggest problem in communication is the illusion that it has taken place."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— George Bernard Shaw</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          You cannot unhurt someone with the right words after the fact. But you can build the habit of saying the true thing earlier, more gently, and more precisely — so the hurt does not accumulate in the first place.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: 'var(--sky)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(91,158,191,0.4)' }}
          >
            Journal About a Relationship in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: 'var(--sky)', border: '2px solid var(--sky)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Building Your Relationship Skills:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Set Boundaries Without Feeling Guilty (Student Guide)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/toxic-friendship-signs')} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → 7 Signs of a Toxic Friendship You Should Not Ignore
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-love-insecurity')} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Love Yourself Even When You Feel Insecure
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
