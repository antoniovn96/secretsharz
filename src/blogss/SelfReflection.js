import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "Why Self-Reflection is Important for Emotional Growth",
  excerpt: "Most students are so busy moving forward that they never stop to look inward. Learn what self-reflection actually is, why it prevents burnout, and how to start doing it.",
  category: "Mental Health",
  date: "06-01-2026",
  readTime: "7 min read",
  wordCount: 890,
  imgUrl: "/blogss/self-reflection-growth.jpg",
  tldr: "Self-reflection is the act of evaluating your own thoughts and behaviors. It separates who you ARE from what you DO, helping you avoid repeating the same academic and emotional mistakes.",
  toc: [
    { id: "what-is-it", title: "1. What Exactly is Self-Reflection?", level: 3 },
    { id: "benefits", title: "2. Why Students Desperately Need It", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Are You Self-Aware?", level: 3 },
    { id: "questions", title: "4. 5 Deep Reflection Questions", level: 3 },
    { id: "mistakes", title: "5. Mistakes to Avoid", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-06T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does self-reflection help with anxiety?",
      "acceptedAnswer": { "@type": "Answer", "text": "It helps you identify the root causes and triggers of your anxiety, rather than just reacting to the symptoms. Once you know the trigger, you can prepare for it." }
    },
    {
      "@type": "Question",
      "name": "Is self-reflection the same as overthinking?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Overthinking is cyclical and focuses on uncontrollable past or future events. Self-reflection is linear, focuses on lessons learned, and ends with actionable takeaways." }
    }
  ]
};

export default function SelfReflection({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showMistakes, setShowMistakes] = useState(false);

  const yesCount = Object.values(quizAnswers).filter(Boolean).length;
  const progressPercent = Math.round((yesCount / 3) * 100);

  const handleQuizToggle = (q) => {
    setQuizAnswers(prev => ({ ...prev, [q]: !prev[q] }));
  };

  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>
      
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content="/secret-sharz-logo.png" />
        <meta property="og:type" content="article" />
        <meta property="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>As a student, your life is likely a blur of classes, exams, social media, and sleep. You are constantly moving forward. But if you never stop to process what is happening, you will find yourself making the exact same mistakes year after year.</p>
      
      <p>This is why <strong>self-reflection is critical for emotional growth</strong>. It is the pause button that prevents burnout.</p>

      <img 
        src="/blogss/self-reflection-growth.jpg" 
        alt="Importance of self reflection for students emotional growth" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-is-it">1. What Exactly is Self-Reflection?</h3>
      <p>Self-reflection is the deliberate act of taking a step back to evaluate your own thoughts, emotions, and behaviors. It is the difference between saying, <em>&quot;I am so angry right now!&quot;</em> and asking yourself, <em>&quot;Why did that specific comment make me react with anger?&quot;</em></p>

      <h3 id="benefits">2. Why Students Desperately Need It</h3>
      <ul>
        <li><strong>It prevents emotional explosions:</strong> When you process small frustrations daily, you don&apos;t blow up over a minor inconvenience a month later.</li>
        <li><strong>It builds self-awareness:</strong> You begin to understand how you learn best, when you are most productive, and which friends actually drain your energy.</li>
        <li><strong>It separates your worth from your grades:</strong> Reflection helps you realize that failing a test means your <em>study strategy</em> failed, not that <em>you</em> are a failure.</li>
      </ul>

      <h3 id="quiz">3. Interactive Check: Are You Self-Aware?</h3>
      <p>Do you actually self-reflect, or do you just overthink? Check the boxes below:</p>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          When I get a bad grade, my first thought is "I'm stupid" rather than "My study method didn't work."
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I replay embarrassing moments in my head for hours without learning anything from them.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I rarely know WHY I feel anxious, I just know that I DO feel anxious.
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. You are overthinking, not self-reflecting! You need to shift from judging yourself to observing yourself.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. You have a great handle on processing your emotions logically!</p>
        )}
      </div>

      <h3 id="questions">4. 5 Deep Reflection Questions to Ask Today</h3>
      <ol style={{ paddingLeft: '20px', marginBottom: '30px' }}>
        <li style={{ marginBottom: '10px' }}>What drained my energy the most this week? (How can I do less of it?)</li>
        <li style={{ marginBottom: '10px' }}>What is a belief I held a year ago that I no longer believe today?</li>
        <li style={{ marginBottom: '10px' }}>When I feel stressed, what is my default toxic habit? (Scrolling, isolating, snapping at family?)</li>
        <li style={{ marginBottom: '10px' }}>Who brings out the calmest version of me?</li>
        <li>What am I trying to prove to others that I no longer care about?</li>
      </ol>

      <h3 id="mistakes">5. Mistakes to Avoid While Reflecting</h3>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowMistakes(!showMistakes)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showMistakes ? 'Hide Mistakes ↑' : 'Tap to reveal Reflection Traps ↓'}
        </button>
      </div>

      {showMistakes && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <ul>
            <li style={{ marginBottom: '10px' }}><strong>Trapped in the Past:</strong> Reflection is looking back so you can move forward. If you are just staring at the past and feeling guilty, that is rumination, not reflection.</li>
            <li style={{ marginBottom: '10px' }}><strong>Being Too Harsh:</strong> Talk to yourself like you would talk to a friend. If your friend failed a test, you wouldn&apos;t call them stupid. Don&apos;t do it to yourself.</li>
            <li><strong>Doing it "In Your Head":</strong> Thoughts lie. Paper does not. Always reflect by writing things down. It forces your brain to make logical sense of chaotic feelings.</li>
          </ul>
        </div>
      )}

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Experience does not create wisdom. Reflecting on experience creates wisdom.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Start a Reflection Journal Here →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Read More from Secret Sharz:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/let-go-negative-thoughts')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to break out of a negative thought spiral</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/wall')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Share your deepest reflections anonymously</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
