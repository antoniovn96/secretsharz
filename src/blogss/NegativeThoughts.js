import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "How to Let Go of Negative Thoughts and Start Fresh in 2026",
  excerpt: "Struggling with overthinking and self-doubt? Learn what negative thought patterns are, why your brain holds onto them, and practical techniques to finally let them go.",
  category: "Mental Health",
  date: "15-01-2026",
  readTime: "7 min read",
  wordCount: 950, 
  imgUrl: "/blogss/let-go-negative-thoughts.jpg",
  tldr: "Negative thoughts are just habits, not facts. You can break the cycle by identifying cognitive distortions, using physical pattern interrupts, and doing a 5-minute release journal.",
  toc: [ 
    { id: "what-are-they", title: "1. What Are Negative Thought Patterns?", level: 3 },
    { id: "why-hold-on", title: "2. Why Do We Hold Onto Them?", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Are You Spiraling?", level: 3 },
    { id: "techniques", title: "4. 3 Techniques to Release Negative Thoughts", level: 3 },
    { id: "journaling", title: "5. A Guided Journaling Exercise for a Fresh Start", level: 3 },
    { id: "faq", title: "6. Overthinking FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-15T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stop negative thought patterns?",
      "acceptedAnswer": { "@type": "Answer", "text": "You stop them by first noticing them without judgment, labeling them as 'just thoughts' rather than facts, and using physical pattern interrupts like cold water or deep breathing." }
    },
    {
      "@type": "Question",
      "name": "Why do students overthink so much?",
      "acceptedAnswer": { "@type": "Answer", "text": "Students overthink because of high academic pressure, fear of failure, and constant comparison on social media. The brain over-analyzes to try and 'protect' you from failing." }
    },
    {
      "@type": "Question",
      "name": "Can journaling really help with negative thoughts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Writing thoughts down moves them from the emotional center of the brain (amygdala) to the logical center (prefrontal cortex), stripping away their emotional power." }
    }
  ]
};

export default function NegativeThoughts({ navigate, relatedPosts }) {
  // Interactive States
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showExercise, setShowExercise] = useState(false);

  const yesCount = Object.values(quizAnswers).filter(Boolean).length;
  const progressPercent = Math.round((yesCount / 3) * 100);

  const handleQuizToggle = (q) => {
    setQuizAnswers(prev => ({ ...prev, [q]: !prev[q] }));
  };

  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>
      
      {/* 🚀 EXPLICIT SOCIAL SHARING & SCHEMA TAGS 🚀 */}
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        {/* OG Tags for precise sharing previews on WhatsApp, Twitter, iMessage */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        {/* Using the Secret Sharz Logo as the specific sharing thumbnail as requested */}
        <meta property="og:image" content="/secret-sharz-logo.png" />
        <meta property="og:type" content="article" />
        <meta property="twitter:card" content="summary_large_image" />
        
        {/* Injecting Schema Markup invisibly into the page */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>Have you ever laid in bed at 2 AM, replaying a slightly embarrassing conversation from three years ago? Or convinced yourself that because you failed one test, your entire career is ruined? You are experiencing <strong>negative thought patterns</strong>.</p>
      
      <p>As we step into 2026, you don&apos;t need to carry the emotional baggage of past mistakes, academic pressure, or social anxiety with you. Here is exactly <strong>how to let go of negative thoughts</strong> and start fresh.</p>

      {/* Optimized Image SEO */}
      <img 
        src="/blogss/let-go-negative-thoughts.jpg" 
        alt="how to let go of negative thoughts mental health for students 2026" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-are-they">1. What Are Negative Thought Patterns?</h3>
      <p>Negative thought patterns (psychologists call them <em>cognitive distortions</em>) are basically your brain lying to you. They are mental filters that twist reality to make things look much worse than they actually are. For students, the most common ones are:</p>
      <ul>
        <li><strong>Catastrophizing:</strong> &quot;I messed up this assignment, which means I&apos;ll fail the class, which means I won&apos;t get into college, which means my life is over.&quot;</li>
        <li><strong>Mind Reading:</strong> &quot;My friend took 4 hours to reply. They definitely hate me.&quot;</li>
        <li><strong>All-or-Nothing Thinking:</strong> &quot;If I don&apos;t score 95%, I am a complete failure.&quot;</li>
      </ul>

      <h3 id="why-hold-on">2. Why Do We Hold Onto Them?</h3>
      <p>Why is it so much easier to remember an insult than a compliment? It is called the <strong>negativity bias</strong>. Thousands of years ago, paying attention to danger (like a tiger in the bushes) kept humans alive. Today, your brain reacts to a bad grade or a weird text message with that exact same life-or-death intensity.</p>
      <p>We hold onto negative thoughts because our brain thinks it is protecting us by keeping us hyper-aware of &quot;threats.&quot; The problem? Most of these threats aren&apos;t real.</p>

      <h3 id="quiz">3. Interactive Check: Are You Spiraling?</h3>
      <p>Check the boxes below if you&apos;ve experienced this in the last 48 hours:</p>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Assuming you know what someone else is thinking about you (and assuming it's bad)?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Taking one negative event and feeling like your whole week is ruined?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Ignoring your successes because you are hyper-focused on one mistake?
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. Your brain is in an overthinking spiral. Time to hit pause.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. You're doing okay, but keep practicing self-compassion!</p>
        )}
      </div>

      <h3 id="techniques">4. 3 Techniques to Release Negative Thoughts</h3>
      <p>You cannot stop a thought from entering your head, but you <em>can</em> decide how long it gets to stay. Try these student mental health tips:</p>
      <ul>
        <li><strong>The &quot;Is it a Fact or a Feeling?&quot; Test:</strong> When a thought tells you &quot;I am going to fail,&quot; ask for evidence. Is it a proven fact, or is it just anxiety talking?</li>
        <li><strong>The 5-4-3-2-1 Grounding Rule:</strong> When your mind is living in the past, force it into the present. Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.</li>
        <li><strong>Label the Story:</strong> Say out loud: <em>&quot;I am having the thought that I am not good enough.&quot;</em> This creates distance between YOU and the THOUGHT. You are not your thoughts.</li>
      </ul>

      <h3 id="journaling">5. A Guided Journaling Exercise for a Fresh Start</h3>
      <p>Ready to leave the emotional baggage behind? Try this 5-minute exercise.</p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowExercise(!showExercise)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showExercise ? 'Hide Journal Exercise ↑' : 'Tap to reveal the exercise ↓'}
        </button>
      </div>

      {showExercise && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <h4>Grab a pen and paper. Do not type this on your phone.</h4>
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Write down the heaviest thought</strong> you carried through 2025. Be brutally honest.</li>
            <li style={{ marginBottom: '10px' }}><strong>Ask yourself:</strong> Does believing this thought help me grow, or does it keep me stuck?</li>
            <li style={{ marginBottom: '10px' }}><strong>The Release:</strong> Cross it out aggressively with a pen, or tear the paper up and throw it away. Give your brain a physical cue that this thought is no longer welcome in 2026.</li>
            <li><strong>The Replacement:</strong> Write down one true, kind thing about yourself to replace it.</li>
          </ol>
        </div>
      )}

      <h3 id="faq">6. Overthinking FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Why is it so hard to just stop overthinking?</strong><br/>
        A: Because telling your brain to &quot;stop thinking&quot; makes it think harder. Instead of fighting the thought, acknowledge it, label it as anxiety, and gently shift your focus to a physical task.</p>

        <p><strong>Q: Are negative thoughts normal for students?</strong><br/>
        A: 100%. The pressure of exams, peers, and parents creates a perfect storm for cognitive distortions. Having bad thoughts doesn't mean your mental health is broken; it just means you're human.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Thoughts are just visitors. Let them come and go. Don&apos;t offer them a chair.&quot;
        </h2>
        <p style={{ marginBottom: '24px' }}>You have survived 100% of your bad days so far. Let go of the baggage, and step into 2026 lighter.</p>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Try the Mind Space Journal →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Read More from Secret Sharz:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/new-year-reset')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ New Year Mental Reset: How to Start 2026 with a Clear Mind</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/wall')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Post your worries anonymously on the Sharz Wall</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
