import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Signs You Need a Mental Reset in Your Life",
  excerpt: "Are you just tired, or are you completely burnt out? Learn the hidden emotional and behavioral signs that indicate you desperately need a mental reset.",
  category: "Mental Health",
  date: "09-01-2026",
  readTime: "5 min read",
  wordCount: 840,
  imgUrl: "/blogss/2026/January/mental-reset-signs.jpg",
  tldr: "Burnout hides behind 'tiredness'. If you dread waking up, snap at loved ones, and feel emotionally numb, you don't need a nap—you need a full mental reset.",
  toc: [
    { id: "burnout", title: "1. The Sneaky Symptoms of Burnout", level: 3 },
    { id: "exhaustion", title: "2. Emotional vs. Physical Exhaustion", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Are You Ignoring the Signs?", level: 3 },
    { id: "behavioral", title: "4. Behavioral Red Flags to Watch For", level: 3 },
    { id: "what-to-do", title: "5. What to Do Next: Your Emergency Reset", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-09T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function MentalResetSigns({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showPlan, setShowPlan] = useState(false);

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
      </Head>

      <p>There is a massive difference between needing a good night&apos;s sleep and needing a complete mental overhaul. Many students try to fix emotional exhaustion with caffeine and naps, only to wake up feeling just as dreadful.</p>
      
      <p>If you are pushing yourself to the brink, your brain will eventually force you to stop. Here are the clear <strong>signs you need a mental reset</strong> right now.</p>

      <img 
        src="/blogss/mental-reset-signs.jpg" 
        alt="Signs of burnout and emotional exhaustion in students" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="burnout">1. The Sneaky Symptoms of Burnout</h3>
      <p>Burnout rarely happens overnight. It is a slow fade. You might start noticing that tasks that used to take you 20 minutes now take 2 hours. Your brain feels like it is moving through molasses, and you experience a heavy, cynical attitude toward school and life.</p>

      <h3 id="exhaustion">2. Emotional vs. Physical Exhaustion</h3>
      <p>If your muscles ache after playing a sport, that is physical exhaustion. A day of rest cures it. <strong>Emotional exhaustion</strong> is when your <em>soul</em> feels tired. It is the feeling of waking up after 9 hours of sleep and still wanting to cry when you remember you have to face the day.</p>

      <h3 id="quiz">3. Interactive Check: Are You Ignoring the Signs?</h3>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you feel a sense of dread as soon as you wake up in the morning?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Are you snapping at your friends and family over completely minor issues?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Have you lost interest in hobbies you used to genuinely love?
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. This is a red alert. You are officially burnt out and need a reset.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. Keep listening to your body to prevent future burnout.</p>
        )}
      </div>

      <h3 id="behavioral">4. Behavioral Red Flags to Watch For</h3>
      <p>Your behavior changes before your awareness does. Watch out for:</p>
      <ul>
        <li><strong>Isolation:</strong> Cancelling plans constantly because interacting with humans feels like &quot;too much work.&quot;</li>
        <li><strong>Numbness:</strong> Feeling completely empty or indifferent about grades that used to stress you out.</li>
        <li><strong>Escapism:</strong> Spending 6 hours a day scrolling TikTok just to avoid being alone with your thoughts.</li>
      </ul>

      <h3 id="what-to-do">5. What to Do Next: Your Emergency Reset Plan</h3>
      <p>If you recognized yourself in this article, it is time to hit the brakes.</p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowPlan(!showPlan)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--danger)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showPlan ? 'Hide the Plan ↑' : 'Reveal Your 24-Hour Emergency Reset ↓'}
        </button>
      </div>

      {showPlan && (
        <div style={{ background: '#FFF0F0', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--danger)' }}>
          <h4 style={{ color: 'var(--danger)', margin: '0 0 10px 0' }}>The 24-Hour Rule</h4>
          <ol style={{ paddingLeft: '20px', color: 'var(--ink)' }}>
            <li style={{ marginBottom: '10px' }}><strong>Cancel Everything:</strong> Clear your schedule for one full day. No studying, no social obligations.</li>
            <li style={{ marginBottom: '10px' }}><strong>Basic Biology:</strong> Drink water, eat a proper meal, and sleep without setting an alarm.</li>
            <li><strong>Speak Up:</strong> Tell one trusted person, "I am completely burnt out and I need a break."</li>
          </ol>
        </div>
      )}

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Rest is not a reward for burning out. It is a requirement for staying alive.&quot;
        </h2>
        <button 
          onClick={() => navigate('/wall')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          You Are Not Alone. Read the Sharz Wall →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mental-health-habits')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ 5 Simple Habits to Improve Your Mental Health in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/self-care-plan')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Creating a Personal Self-Care Plan That Works for You</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/student-mental-health-routine')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Building a Student Mental Health Routine That Sticks</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
