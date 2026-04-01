import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "Weekly Mental Health Check-In: How Are You Really Feeling?",
  excerpt: "Stop running on autopilot. Learn the importance of a weekly mental health check-in, how to build mood awareness, and a simple template to track your emotional wellbeing.",
  category: "Self-Care",
  date: "07-01-2026",
  readTime: "6 min read",
  wordCount: 880,
  imgUrl: "/blogss/mental-health-check-in.jpg",
  tldr: "A weekly check-in prevents burnout by catching stress early. Use our 5-minute template to assess your physical energy, emotional state, and what you need to let go of this week.",
  toc: [
    { id: "importance", title: "1. The Importance of Weekly Check-Ins", level: 3 },
    { id: "mood-awareness", title: "2. Building True Mood Awareness", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Are You Running on Autopilot?", level: 3 },
    { id: "template", title: "4. The 5-Minute Check-In Template", level: 3 },
    { id: "seek-help", title: "5. When to Seek Professional Help", level: 3 },
    { id: "faq", title: "6. Check-In FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-07T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I do a mental health check-in?",
      "acceptedAnswer": { "@type": "Answer", "text": "Take 5 minutes once a week to ask yourself: How is my body feeling? What was my main emotion this week? What do I need to prioritize next week?" }
    },
    {
      "@type": "Question",
      "name": "Why is mood awareness important for students?",
      "acceptedAnswer": { "@type": "Answer", "text": "Because students often mask their stress to keep up with academic pressure. Mood awareness helps you identify burnout before it leads to a mental breakdown." }
    }
  ]
};

export default function WeeklyCheckIn({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showTemplate, setShowTemplate] = useState(false);

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

      <p>When was the last time someone asked you, <em>&quot;How are you?&quot;</em> and you gave an honest answer instead of just saying &quot;I&apos;m fine&quot;? As a student, you are probably running on autopilot, moving from one assignment to the next without pausing.</p>
      
      <p>If you don&apos;t schedule time to check in with your mind, your mind will eventually force you to take a break through burnout. Here is how to master the <strong>weekly mental health check-in</strong>.</p>

      <img 
        src="/blogss/mental-health-check-in.jpg" 
        alt="Student doing a weekly mental health check in journal" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="importance">1. The Importance of Weekly Check-Ins</h3>
      <p>A weekly check-in is like a diagnostic scan for your brain. By taking just 5 minutes every Sunday evening to evaluate your emotional state, you can spot the early signs of stress, anxiety, or depression before they spiral out of control. It shifts you from <em>reacting</em> to your emotions to <em>managing</em> them.</p>

      <h3 id="mood-awareness">2. Building True Mood Awareness</h3>
      <p>Mood awareness means having the vocabulary to describe what you are feeling. &quot;Bad&quot; is not an emotion. Are you feeling drained? Inadequate? Lonely? Frustrated? When you accurately name the emotion, it loses half of its power over you.</p>

      <h3 id="quiz">3. Interactive Check: Are You Running on Autopilot?</h3>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I often realize at the end of the day that I haven&apos;t taken a single deep breath.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          When people ask how I am, I automatically say &quot;fine&quot; even if I am struggling.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I feel easily triggered or irritated, but I don&apos;t know exactly why.
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. You are completely disconnected from your feelings. Time to pause.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. You are fairly in tune with yourself. Keep it up!</p>
        )}
      </div>

      <h3 id="template">4. The 5-Minute Check-In Template</h3>
      <p>Want a structured way to check in? Grab a notebook and use this exact template every weekend.</p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowTemplate(!showTemplate)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showTemplate ? 'Hide Template ↑' : 'Tap to reveal the Check-In Template ↓'}
        </button>
      </div>

      {showTemplate && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <h4>Ask yourself these 4 questions:</h4>
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Physical:</strong> How is my body feeling right now? (Tense, exhausted, rested?)</li>
            <li style={{ marginBottom: '10px' }}><strong>Emotional:</strong> What was the dominant emotion I felt this week?</li>
            <li style={{ marginBottom: '10px' }}><strong>Release:</strong> What am I holding onto from this week that I need to forgive and let go of?</li>
            <li><strong>Intention:</strong> What is one kind thing I can do for myself next week?</li>
          </ol>
        </div>
      )}

      <h3 id="seek-help">5. When to Seek Professional Help</h3>
      <p>Check-ins are great for maintenance, but they don&apos;t replace a mechanic. If your weekly check-ins consistently show that you are feeling hopeless, disconnected, or unable to function in your daily student life, it is time to talk to a professional counsellor.</p>

      <h3 id="faq">6. Check-In FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I don&apos;t like writing. Can I do this in my head?</strong><br/>
        A: Writing forces your brain to slow down and process logic. If you hate writing, try recording a voice memo on your phone instead!</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;You can&apos;t navigate out of a storm if you don&apos;t know where you are.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Do Your Check-In on Mind Space →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
