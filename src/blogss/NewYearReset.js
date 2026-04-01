import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "New Year Mental Reset: How to Start 2026 with a Clear Mind",
  excerpt: "Feeling overwhelmed by the pressure of the new year? Learn how to let go of 2025's emotional baggage, set realistic intentions, and start fresh.",
  category: "Self-Care",
  date: "01-01-2026",
  readTime: "6 min read",
  wordCount: 850,
  imgUrl: "/blogss/mental-reset-new-year-2026.jpg",
  tldr: "Don't rush into resolutions. Take a 1-minute stress relief pause, let go of academic pressure, and set flexible intentions instead of rigid rules.",
  toc: [
    { id: "students", title: "1. Why Students Feel Overwhelmed in the New Year", level: 3 },
    { id: "quick-reset", title: "2. 1-Minute Mental Reset for Students", level: 3 },
    { id: "routine", title: "3. The Full Study Stress Reset Routine", level: 3 },
    { id: "quiz", title: "4. Quick Mental Reset Check (Quiz)", level: 3 },
    { id: "journal", title: "5. 3 Journal Prompts for a Fresh Start", level: 3 },
    { id: "faq", title: "6. Student Mental Health FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-01T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do students reset mentally?",
      "acceptedAnswer": { "@type": "Answer", "text": "Students can reset by journaling, reducing screen time, and setting small, flexible goals instead of massive resolutions." }
    },
    {
      "@type": "Question",
      "name": "Why do New Year resolutions fail for students?",
      "acceptedAnswer": { "@type": "Answer", "text": "Because they are unrealistic and pressure-driven instead of intention-based. Focus on habits rather than end goals." }
    },
    {
      "@type": "Question",
      "name": "How can I reduce academic stress in 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "Focus on consistency, not perfection. Break goals into small steps and prioritize mental health breaks." }
    }
  ]
};

export default function NewYearReset({ navigate, relatedPosts }) {
  // Interactive States
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showRoutine, setShowRoutine] = useState(false);

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
        <meta property="og:image" content={meta.imgUrl} />
        <meta property="og:type" content="article" />
        <meta property="twitter:card" content="summary_large_image" />
        
        {/* Injecting Schema Markup invisibly into the page */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>The pressure students feel to set massive goals at the start of a new year can actually cause more anxiety than motivation. If you are wondering <strong>how to start a new year as a student</strong> without burning out by February, you don&apos;t need a massive resolution—you need a <strong>mental reset for students</strong>.</p>
      
      <p>Think of your brain like a smartphone that has had 100 tabs open for the last 365 days. A mental reset is simply turning the phone off and on again.</p>

      {/* Optimized Image SEO */}
      <img 
        src="/blogss/mental-reset-new-year-2026.jpg" 
        alt="mental reset for students new year 2026 stress relief tips" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px' }} 
      />

      <h3 id="students">1. Why Students Feel Overwhelmed in the New Year</h3>
      <p>Rushing into 2026 without acknowledging the heavy load you are carrying sets you up for failure. Most students feel paralyzed right now because of:</p>
      <ul>
        <li><strong>Academic Pressure:</strong> The looming dread of upcoming boards or college finals.</li>
        <li><strong>Comparison:</strong> Scrolling through social media seeing everyone else&apos;s &quot;perfect&quot; year recap.</li>
        <li><strong>Career Confusion:</strong> Being expected to know exactly what you want to do with your life.</li>
        <li><strong>Parental Expectations:</strong> The weight of trying to be the &quot;perfect&quot; child.</li>
      </ul>

      <h3 id="quick-reset">2. 1-Minute Mental Reset for Students</h3>
      <p>If you are feeling a panic attack coming on, try this featured 1 minute stress relief for students:</p>
      <ol style={{ background: 'var(--sage-pale)', padding: '20px 20px 20px 40px', borderRadius: '12px' }}>
        <li><strong>Close your eyes</strong> and drop your shoulders.</li>
        <li><strong>Take 5 deep breaths</strong> (Inhale for 4 seconds, exhale for 6).</li>
        <li><strong>Say out loud:</strong> <em>&quot;I don&apos;t need to figure everything out today. I am allowed to rest.&quot;</em></li>
      </ol>

      <h3 id="routine">3. The Full Study Stress Reset Routine</h3>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowRoutine(!showRoutine)}
          style={{ background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showRoutine ? 'Hide Reset Routine ↑' : 'Tap to reveal your reset routine ↓'}
        </button>
      </div>

      {showRoutine && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <h4>The 3-Step Process:</h4>
          <ul>
            <li><strong>The Brain Dump:</strong> Write down every single worry or to-do list item bouncing around your head.</li>
            <li><strong>Digital Detox:</strong> Put your phone in another room for exactly 30 minutes.</li>
            <li><strong>Forgive Last Year:</strong> Write down three mistakes you made in 2025, and literally cross them out with a pen. You are leaving them behind.</li>
          </ul>
        </div>
      )}

      <h3 id="quiz">4. Quick Mental Reset Check</h3>
      <p>Not sure if you are burning out? Take this quick interactive self-check:</p>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px' }} /> 
          Do you feel tired even after sleeping 8 hours?
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px' }} /> 
          Do you feel immense pressure to &quot;fix everything&quot; this year?
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px' }} /> 
          Do you compare yourself to your friends&apos; social media highlights?
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0 }}>⚠️ You checked {yesCount} boxes. You definitely need a mental reset before opening your textbooks.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0 }}>🌱 You checked {yesCount} boxes. You&apos;re doing okay, but keep prioritizing your peace!</p>
        )}
      </div>

      <h3 id="journal">5. 3 Journal Prompts for a Fresh Start</h3>
      <p>One of the best <strong>student mental health tips for 2026</strong> is guided journaling. Write these down:</p>
      <ul>
        <li>What heavy expectation am I holding onto from last year that I need to drop?</li>
        <li>What kind of person do I want to become this year, regardless of my grades?</li>
        <li>What is one small, 5-minute habit I can start today to protect my peace?</li>
      </ul>

      <h3 id="faq">6. Student Mental Health FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How do students reset mentally?</strong><br/>
        A: Students can reset by journaling to offload thoughts, taking intentional digital detoxes, and setting small, flexible daily intentions rather than rigid, stressful goals.</p>

        <p><strong>Q: Why do New Year resolutions fail for students?</strong><br/>
        A: Because they are usually unrealistic and driven by external pressure. Setting a goal to &quot;study 8 hours a day&quot; builds anxiety. Building a system to &quot;study in 30-minute focused blocks&quot; builds success.</p>

        <p><strong>Q: How can I reduce academic stress in 2026?</strong><br/>
        A: Focus on consistency, not perfection. Utilize the Pomodoro technique, take actual breaks away from screens, and remember that your marks do not define your entire future.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;You don&apos;t need a new year. You need a new mindset.&quot;
        </h2>
        <p style={{ marginBottom: '24px' }}>You don&apos;t need to become a completely new person this year. You just need to become a calmer, kinder version of yourself.</p>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Take a Free Mental Health Check →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Read More from Secret Sharz:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}><button onClick={() => navigate('/blog')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0 }}>→ How to manage board exam stress</button></li>
          <li style={{ marginBottom: '10px' }}><button onClick={() => navigate('/vidyavantage')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0 }}>→ Finding a career that actually fits your personality</button></li>
          <li style={{ marginBottom: '10px' }}><button onClick={() => navigate('/wall')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0 }}>→ See what other students are secretly feeling today</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
