import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "7 Signs of a Toxic Friendship You Should Not Ignore",
  excerpt: "Not every friendship is good for your mental health. Learn to recognise the 7 clear signs of a toxic friendship, understand why you stay in them, and discover practical steps to protect your emotional wellbeing as a student.",
  category: "Mental Health",
  date: "09-02-2026",
  readTime: "6 min read",
  wordCount: 1020,
  imgUrl: "/blogss/2026/February/toxic-friendship-signs.jpg",
  tldr: "Toxic friendships drain your energy, damage your self-worth, and increase anxiety — and they are far more common in student life than most people admit. Learn the 7 red flags, use our interactive Friendship Health Check to audit your own relationships, and find out exactly what to do next.",
  toc: [
    { id: "what-is-toxic",        title: "1. What Makes a Friendship Toxic?",                          level: 3 },
    { id: "seven-signs",          title: "2. The 7 Signs You Should Not Ignore",                       level: 3 },
    { id: "health-check",         title: "3. Interactive: Friendship Health Check",                    level: 3 },
    { id: "why-you-stay",         title: "4. Why Smart People Stay in Toxic Friendships",              level: 3 },
    { id: "what-to-do",           title: "5. What to Actually Do About It",                            level: 3 },
    { id: "faq",                  title: "6. Toxic Friendship FAQs",                                   level: 3 },
  ],
};

// ── JSON-LD Schema for Google ─────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-09T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "toxic friendship signs, toxic friendship, unhealthy friendship, student mental health, how to leave a toxic friend",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the signs of a toxic friendship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The clearest signs of a toxic friendship include: consistently feeling drained after spending time with them, being guilt-tripped when you set limits, having your secrets shared publicly, feeling like you are always the problem, and experiencing anxiety before meeting them. If more than three of these apply, the friendship may be harming your mental health.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it okay to end a toxic friendship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Ending a friendship that consistently harms your mental health is an act of self-respect, not cruelty. You do not owe anyone unlimited access to your time and emotional energy. A friendship that makes you smaller is not worth keeping.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I know if I am the toxic friend?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If you regularly cancel plans without explanation, vent without asking if your friend has the capacity, compete instead of celebrate, or only reach out when you need something — it is worth honestly reflecting on your own patterns. Recognising this is the first step toward becoming a better friend.",
      },
    },
  ],
};

// ── Friendship Health Check data ──────────────────────────────────────────────
const QUESTIONS = [
  { id: 'q1', text: 'After hanging out with this person, I feel energised and good about myself.' },
  { id: 'q2', text: 'They celebrate my wins without making it about themselves or competing with me.' },
  { id: 'q3', text: 'I feel safe sharing personal things knowing they will not gossip or use it against me.' },
  { id: 'q4', text: 'They show up for me even when they do not need anything from me in return.' },
  { id: 'q5', text: 'I can say no to them without being guilt-tripped, punished, or made to feel selfish.' },
  { id: 'q6', text: 'Disagreements between us are resolved without blame, silent treatment, or explosive anger.' },
  { id: 'q7', text: 'I look forward to spending time with them rather than feeling anxious before we meet.' },
];

const OPTIONS = [
  { label: 'Almost never', value: 0 },
  { label: 'Sometimes',    value: 1 },
  { label: 'Often',        value: 2 },
  { label: 'Almost always',value: 3 },
];

function getResult(score) {
  if (score >= 17) return { label: 'Healthy Friendship',    color: '#2D7D46', bg: '#E8F5EE', icon: '💚', desc: 'This friendship appears to be a genuinely positive force in your life. Nurture it — healthy friendships are rare and worth protecting.' };
  if (score >= 11) return { label: 'Mixed Signals',         color: '#C07800', bg: '#FFF8E1', icon: '🟡', desc: 'There are real strengths here, but also patterns that deserve an honest conversation. Some friendships can grow with open communication — others have a natural expiry date.' };
  if (score >= 5)  return { label: 'Cause for Concern',     color: '#B54708', bg: '#FEF3C7', icon: '🟠', desc: 'Several red flags are present in this friendship. Your mental health and self-worth are being affected. Consider whether this relationship is truly serving you.' };
  return             { label: 'Likely Toxic Friendship',   color: '#C0392B', bg: '#FDECEA', icon: '🔴', desc: 'This friendship is consistently draining and damaging. You deserve relationships that make you feel safe, valued, and energised — not the opposite. It may be time to create some distance.' };
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ToxicFriendshipSigns({ navigate, relatedPosts }) {
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total    = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 3;
  const result   = submitted ? getResult(total) : null;
  const allDone  = Object.keys(answers).length === QUESTIONS.length;

  const handleAnswer = (qid, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = () => { if (allDone) setSubmitted(true); };

  const handleReset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description"          content={meta.excerpt} />
        <meta property="og:title"         content={meta.title} />
        <meta property="og:description"   content={meta.excerpt} />
        <meta property="og:image"         content={meta.imgUrl} />
        <meta property="og:type"          content="article" />
        <meta property="twitter:card"     content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      {/* ── Introduction ── */}
      <p>Not every person who calls themselves your friend is good for you. Some friendships quietly chip away at your confidence, your energy, and your sense of self — so gradually that you do not even notice until you are completely depleted.</p>

      <p>The word "toxic" gets thrown around casually, but <strong>toxic friendship signs</strong> are real, measurable, and proven to impact mental health. Research from the University of California found that high-conflict friendships increase cortisol levels as much as openly hostile relationships. In other words, a bad friendship is a chronic stressor — and for students already carrying exam pressure, family expectations, and career anxiety, it can be the thing that breaks the camel's back.</p>

      <img
        src={meta.imgUrl}
        alt="Student recognising toxic friendship signs and protecting their mental health"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-is-toxic">1. What Makes a Friendship Toxic?</h3>
      <p>A toxic friendship is not necessarily one filled with screaming fights and obvious cruelty. More often, it is <em>subtle</em>. It is the friend who makes a cutting remark and calls it a joke. The one who always needs you in a crisis but disappears when life is going well for you. The one who leaves you feeling vaguely bad about yourself but you cannot quite put your finger on why.</p>
      <p>The defining feature of a toxic friendship is this: <strong>the emotional cost of the friendship consistently outweighs the emotional benefit.</strong> Healthy friendships are not perfect — they have disagreements and difficult seasons — but they leave you feeling fundamentally valued, safe, and like yourself.</p>

      {/* ── Section 2 ── */}
      <h3 id="seven-signs">2. The 7 Signs You Should Not Ignore</h3>

      <p><strong>Sign 1: You always feel drained afterward.</strong> After spending time with a healthy friend, you feel replenished — even if you talked about hard things. If you consistently need to emotionally recover after seeing someone, your nervous system is telling you something important. Listen to it.</p>

      <p><strong>Sign 2: They guilt-trip you relentlessly.</strong> Any time you say no, decline a plan, or prioritise yourself, they weaponise your guilt. Phrases like <em>"I thought we were best friends"</em> or <em>"You've changed"</em> are not expressions of hurt — they are manipulation tools designed to override your boundaries and keep you in service to their needs.</p>

      <p><strong>Sign 3: Your wins make them uncomfortable.</strong> A real friend celebrates your success. A toxic friend competes with it, minimises it, or subtly undermines it. Watch for patterns like changing the subject when you share good news, one-upping your achievements, or going quiet and distant when things are going well for you.</p>

      <p><strong>Sign 4: They share what you tell them in confidence.</strong> Trust is the entire foundation of close friendship. If your private struggles, embarrassing moments, or personal secrets have a way of becoming known by others — that friendship is structurally unsafe for your mental and social wellbeing.</p>

      <p><strong>Sign 5: In conflict, you are always the problem.</strong> Healthy relationships require both people to take accountability. If every disagreement somehow ends with you apologising regardless of what actually happened — if their feelings always count more than yours — the power dynamic is dangerously unequal.</p>

      <p><strong>Sign 6: They only appear when they need something.</strong> You are their emergency contact, their free therapist, their hype person — but when you are struggling, they are unavailable, distracted, or suddenly very busy. Friendships that function entirely on one person's terms are not friendships. They are a service arrangement.</p>

      <p><strong>Sign 7: You feel anxious before you meet them.</strong> Your body knows. If getting a message from a specific person triggers a knot in your stomach, if you mentally prepare and brace yourself before spending time with someone, if you rehearse what you will say to avoid their reaction — that physiological response is your nervous system accurately assessing threat. It is not an overreaction.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="health-check">3. Interactive: Friendship Health Check</h3>
      <p>Think of a specific friendship that has been on your mind. Answer each question honestly about that one person. <strong>This is private — no data is stored anywhere.</strong></p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)' }}>

        {QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < QUESTIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: 'var(--ink)', fontSize: '15px', lineHeight: '1.5' }}>
              {i + 1}. {q.text}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {OPTIONS.map(opt => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(q.id, opt.value)}
                    disabled={submitted}
                    style={{
                      padding: '8px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600',
                      cursor: submitted ? 'default' : 'pointer', transition: 'all 0.18s',
                      border: '2px solid', fontFamily: 'inherit',
                      borderColor: isSelected ? 'var(--sage)' : 'var(--border)',
                      background: isSelected ? 'var(--sage)' : 'white',
                      color: isSelected ? 'white' : 'var(--ink-soft)',
                    }}
                  >{opt.label}</button>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allDone}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: allDone ? 'var(--sage)' : 'var(--border)', cursor: allDone ? 'pointer' : 'not-allowed',
              color: allDone ? 'white' : 'var(--muted)', fontWeight: '700', fontSize: '15px',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            {allDone ? 'See My Friendship Score →' : `Answer all ${QUESTIONS.length - Object.keys(answers).length} remaining questions to continue`}
          </button>
        ) : (
          <div style={{ background: result.bg, borderRadius: '12px', padding: '24px', border: `2px solid ${result.color}`, animation: 'floatUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px' }}>{result.icon}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: result.color, marginBottom: '2px' }}>
                  Your Score: {total} / {maxScore}
                </div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: result.color }}>
                  {result.label}
                </div>
              </div>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: '1.65' }}>{result.desc}</p>
            <button
              onClick={handleReset}
              style={{ background: 'transparent', border: `1.5px solid ${result.color}`, color: result.color, padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'inherit' }}
            >↺ Check a different friendship</button>
          </div>
        )}
      </div>

      {/* ── Section 4 ── */}
      <h3 id="why-you-stay">4. Why Smart People Stay in Toxic Friendships</h3>
      <p>If it is so obvious, why do we not just leave? Because human beings are not rational — we are relational. The psychology of staying is powerful and valid.</p>
      <p><strong>The Sunk Cost Fallacy:</strong> <em>"We have been friends since Class 6. I cannot throw away ten years."</em> The years you have already invested are gone regardless of what you do next. The only question is whether the next ten years will cost you more.</p>
      <p><strong>Intermittent Reinforcement:</strong> Toxic friendships rarely feel toxic all the time. The good moments — the deep conversations, the genuine laughter, the history — are real. This on-again, off-again experience of warmth and hurt is actually more psychologically addictive than a consistently positive relationship. Your brain keeps holding on, waiting for the good version to come back.</p>
      <p><strong>Fear of Loneliness:</strong> In Indian student culture especially, friend groups are tightly bound to school, college, and family social circles. Leaving a friendship can feel like social exile. It is a real fear — and it is okay to acknowledge it while still choosing your peace.</p>

      {/* ── Section 5 ── */}
      <h3 id="what-to-do">5. What to Actually Do About It</h3>
      <p>You have three real options, and none of them is wrong:</p>
      <p><strong>Option 1 — Have the honest conversation.</strong> Some toxic patterns exist because nobody has ever named them. If the friendship has enough genuine value, a direct and calm conversation using "I" statements can create real change. <em>"I feel dismissed when I share good news and the subject gets changed. I would really appreciate if we could work on celebrating each other more."</em> If they respond with defensiveness and blame, you have your answer.</p>
      <p><strong>Option 2 — Create gradual distance.</strong> You do not always need a dramatic confrontation. Responding more slowly, declining more plans, and redirecting your emotional energy is a valid strategy — especially in contained school or college environments where a clean break is socially complicated.</p>
      <p><strong>Option 3 — End it clearly and with compassion.</strong> Sometimes the most loving thing you can do for both yourself and the other person is to step away with honesty. <em>"I think we have grown in different directions, and I need to prioritise my wellbeing right now."</em> Brief, kind, and final.</p>

      {/* ── Section 6: FAQ ── */}
      <h3 id="faq">6. Toxic Friendship FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if we are in the same class or friend group?</strong><br />
        A: This makes it harder but not impossible. You do not need to avoid them entirely — just stop investing emotionally. Be polite in group settings while redirecting your one-on-one time and emotional energy elsewhere. Social distance is not the same as drama.</p>

        <p><strong>Q: Am I overreacting? Maybe it is just a rough patch.</strong><br />
        A: There is a difference between a friendship going through a hard season and a pattern of consistent harm. Ask yourself: has this been happening for weeks, or for years? Is this isolated, or is it recurring? Patterns over time are data — not overreactions.</p>

        <p><strong>Q: I confronted them and they called me sensitive. Now what?</strong><br />
        A: When someone responds to a valid concern by attacking your emotional response rather than addressing the concern itself, that is called DARVO — Deny, Attack, Reverse Victim and Offender. It is a manipulation tactic. You are not too sensitive. You are accurately perceiving something real.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Letting go of a toxic friendship is not a failure. It is proof that you finally decided your own peace matters."
        </h2>
        <p style={{ marginBottom: '24px', color: 'var(--ink-soft)' }}>
          You are allowed to outgrow people. You are allowed to choose relationships that charge you rather than drain you. You are allowed to be selective with something as precious as your trust.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
          >
            Share Anonymously on the Wall →
          </button>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Process This in Mind Space
          </button>
        </div>
      </div>

      {/* ── Internal Linking for SEO ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Continue Your Mental Health Journey:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Set Boundaries Without Feeling Guilty (Student Guide)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/negative-self-talk')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Breaking the Cycle of Negative Self-Talk
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
