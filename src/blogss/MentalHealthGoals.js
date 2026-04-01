import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "Goal Setting for Mental Health: How to Set Intentions That Actually Work",
  excerpt: "Tired of failing your New Year resolutions? Discover the difference between rigid goals and flexible intentions, and learn how to plan for a mentally healthy 2026.",
  category: "Self-Care",
  date: "04-01-2026",
  readTime: "6 min read",
  wordCount: 910,
  imgUrl: "/blogss/mental-health-goals.jpg",
  tldr: "Drop the toxic productivity. Swap rigid SMART goals for flexible intentions, prioritize consistency over perfection, and set goals that focus on how you FEEL, not just what you ACHIEVE.",
  toc: [
    { id: "difference", title: "1. The Difference Between Goals and Intentions", level: 3 },
    { id: "mental-health-goals", title: "2. What Are Mental Health-Focused Goals?", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Are Your Goals Toxic?", level: 3 },
    { id: "avoid-pressure", title: "4. How to Avoid the Pressure Trap", level: 3 },
    { id: "faq", title: "5. Goal Setting FAQs", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-04T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between a goal and an intention?",
      "acceptedAnswer": { "@type": "Answer", "text": "A goal focuses on the future outcome (e.g., 'Get an A on the math exam'). An intention focuses on the present process and mindset (e.g., 'Study consistently for 30 minutes daily without stressing over perfection')." }
    },
    {
      "@type": "Question",
      "name": "Why are rigid goals bad for students?",
      "acceptedAnswer": { "@type": "Answer", "text": "Rigid goals leave no room for human error. When students inevitably miss a day or underperform, rigid goals cause guilt and make them want to quit entirely." }
    }
  ]
};

export default function MentalHealthGoals({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showTips, setShowTips] = useState(false);

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

      <p>Every January, the internet is flooded with &quot;New Year, New Me&quot; productivity hacks. As a student, you are constantly told to set SMART goals, hustle harder, and optimize every second of your day.</p>
      
      <p>But what if that toxic productivity is exactly what&apos;s causing your burnout? This year, let&apos;s talk about <strong>goal setting for mental health</strong>—a system that actually supports your peace of mind.</p>

      <img 
        src="/blogss/mental-health-goals.jpg" 
        alt="Student setting mental health goals and intentions" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="difference">1. The Difference Between Goals and Intentions</h3>
      <p>A <strong>Goal</strong> is an external destination. (<em>&quot;I will score 95% on my board exams.&quot;</em>) It is rigid. If you get a 93%, your brain perceives it as a total failure.</p>
      <p>An <strong>Intention</strong> is an internal compass. (<em>&quot;I intend to study consistently and ask my teachers for help when I am confused.&quot;</em>) Intentions focus on the <em>process</em> rather than the outcome. They allow for bad days, low energy, and human error without punishing you with guilt.</p>

      <h3 id="mental-health-goals">2. What Are Mental Health-Focused Goals?</h3>
      <p>Instead of only tracking academics or fitness, mental health goals track your relationship with yourself. Examples include:</p>
      <ul>
        <li>I will stop apologizing when I haven&apos;t done anything wrong.</li>
        <li>I will prioritize 8 hours of sleep over last-minute cramming.</li>
        <li>I will speak to myself with the same kindness I use when speaking to my best friend.</li>
      </ul>

      <h3 id="quiz">3. Interactive Check: Are Your Goals Toxic?</h3>
      <p>Let&apos;s check if your current 2026 resolutions are doing more harm than good:</p>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you feel immensely guilty if you miss one day of your planned routine?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Are your goals entirely focused on numbers (grades, followers, weight)?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Did you set your goals based on what your parents or friends expect of you?
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. Your goals are rigid and pressure-driven. It's time to re-evaluate.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. You have a healthy, balanced approach to self-improvement!</p>
        )}
      </div>

      <h3 id="avoid-pressure">4. How to Avoid the Pressure Trap</h3>
      <p>If you want to actually stick to your routines this year, you need to build flexibility into your system.</p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowTips(!showTips)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showTips ? 'Hide Tips ↑' : 'Tap to reveal the &quot;Anti-Burnout&quot; strategy ↓'}
        </button>
      </div>

      {showTips && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <ul>
            <li style={{ marginBottom: '10px' }}><strong>The &quot;Never Miss Twice&quot; Rule:</strong> If you are too exhausted to study on Tuesday, that is completely fine. Just make sure you pick the habit back up on Wednesday. Guilt breaks habits; forgiveness sustains them.</li>
            <li style={{ marginBottom: '10px' }}><strong>Set Minimum Baselines:</strong> Instead of "I will read 2 chapters a day," make your goal "I will open my book and read 1 paragraph." 90% of the time, you will read more. But on bad days, that 1 paragraph counts as a massive win.</li>
            <li><strong>Focus on How You Feel:</strong> Check in with yourself weekly. If a goal is causing you chronic dread, it is not serving you. Adjust it.</li>
          </ul>
        </div>
      )}

      <h3 id="faq">5. Goal Setting FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Are SMART goals bad?</strong><br/>
        A: Not inherently! Specific, Measurable, Achievable, Relevant, and Time-bound (SMART) goals are great for project management. But for personal development and mental health, they can sometimes be too rigid. Blend them with flexible intentions.</p>

        <p><strong>Q: What if I lose my motivation by February?</strong><br/>
        A: Motivation is an emotion; it is supposed to fade. Rely on systems and habits, not motivation. Make your habits so small and easy that you can do them even when you have zero motivation.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Growth is not a straight upward line. It is a messy, beautiful zigzag.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Set Your Intentions in Mind Space →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Read More from Secret Sharz:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/emotional-detox')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Need an emotional detox? Here's how.</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/vidyavantage')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Set career goals that match your personality</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
