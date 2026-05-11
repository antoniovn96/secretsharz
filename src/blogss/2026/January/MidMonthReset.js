import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mid-Month Mental Health Reset: Are You on Track?",
  excerpt: "The initial motivation of the new year has faded. It's time for a mid-month energy audit to adjust your goals, check your emotions, and regain your footing.",
  category: "Self-Care",
  date: "15-01-2026",
  readTime: "6 min read",
  wordCount: 850,
  imgUrl: "/blogss/2026/January/mid-month-reset.jpg",
  tldr: "Don't wait until February to fix a failing routine. Use our interactive energy audit to pinpoint exactly which area of your life is draining you, and adjust your plans accordingly.",
  toc: [
    { id: "slump", title: "1. The Mid-Month Motivation Slump", level: 3 },
    { id: "audit", title: "2. Interactive: The Energy Audit", level: 3 },
    { id: "adjusting", title: "3. Adjusting Plans Without Guilt", level: 3 },
    { id: "staying-motivated", title: "4. How to Sustain Momentum", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-15T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function MidMonthReset({ navigate, relatedPosts }) {
  // Unique Interactivity: Energy Audit Slider
  const [scores, setScores] = useState({ sleep: 5, study: 5, social: 5 });

  const getFeedback = () => {
    const lowest = Math.min(scores.sleep, scores.study, scores.social);
    if (lowest > 7) return { emoji: "🔥", text: "You are crushing it! Keep your systems exactly as they are." };
    if (scores.sleep === lowest) return { emoji: "🛌", text: "Your sleep battery is flashing red. Drop one study task tonight and get 8 hours. Sleep is your highest priority." };
    if (scores.study === lowest) return { emoji: "📚", text: "Academics are dragging you down. Break your next assignment into 3 micro-tasks to regain momentum." };
    if (scores.social === lowest) return { emoji: "💬", text: "You are socially depleted. It's okay to put your phone on DND and say 'no' to plans this weekend." };
    return { emoji: "⚖️", text: "Things are a bit rocky. Focus on a gentle reset tonight." };
  };

  const feedback = getFeedback();

  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content="/secret-sharz-logo.png" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>

      <p>We are halfway through January 2026. If you are like 90% of students, the explosive motivation you felt on January 1st has completely vanished, replaced by the crushing reality of homework, cold mornings, and slipping habits.</p>
      <p>Do not wait until February 1st to try again. The most successful students don&apos;t have perfect discipline; they just course-correct faster. It is time for a <strong>mid-month reset</strong>.</p>

      <img 
        src="/blogss/mid-month-reset.jpg" 
        alt="Student conducting a mid-month mental health and goal reset" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="slump">1. The Mid-Month Motivation Slump</h3>
      <p>The "Mid-Month Slump" happens because adrenaline fades. Adrenaline gets you to write down a massive goal, but it cannot sustain the boring, daily actions required to achieve it. When you miss a few days of your new routine, your brain assumes the entire month is ruined. It isn&apos;t.</p>

      <h3 id="audit">2. Interactive: The Energy Audit</h3>
      <p>To fix the slump, you need to know exactly where your energy is leaking. Use the sliders below to rate your current batteries from 1 (Exhausted) to 10 (Excellent).</p>

      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'var(--sand)' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)' }}>
            <span>Physical Battery (Sleep/Food)</span>
            <span>{scores.sleep}/10</span>
          </div>
          <input type="range" min="1" max="10" value={scores.sleep} onChange={(e) => setScores({...scores, sleep: parseInt(e.target.value)})} style={{ width: '100%', accentColor: 'var(--sage)', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)' }}>
            <span>Focus Battery (Study/Academics)</span>
            <span>{scores.study}/10</span>
          </div>
          <input type="range" min="1" max="10" value={scores.study} onChange={(e) => setScores({...scores, study: parseInt(e.target.value)})} style={{ width: '100%', accentColor: 'var(--sage)', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)' }}>
            <span>Social Battery (Friends/Family)</span>
            <span>{scores.social}/10</span>
          </div>
          <input type="range" min="1" max="10" value={scores.social} onChange={(e) => setScores({...scores, social: parseInt(e.target.value)})} style={{ width: '100%', accentColor: 'var(--sage)', cursor: 'pointer' }} />
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '24px' }}>{feedback.emoji}</span>
          <span style={{ fontSize: '14px', color: 'var(--ink-soft)', fontWeight: '500', lineHeight: '1.4' }}>{feedback.text}</span>
        </div>
      </div>

      <h3 id="adjusting">3. Adjusting Plans Without Guilt</h3>
      <p>Look at your lowest score from the audit above. If your original goal was &quot;Study 4 hours a day&quot; but your Focus Battery is at a 2, your goal is currently toxic. <strong>Lower the bar.</strong> Adjust your goal to &quot;Study 45 minutes a day&quot; for the rest of January. Progress is better than perfection.</p>

      <h3 id="staying-motivated">4. How to Sustain Momentum</h3>
      <p>To survive the rest of the month, drop the &quot;all-or-nothing&quot; mindset. If you eat one piece of junk food, you don&apos;t throw the whole diet away. If you slack off on a Wednesday, don&apos;t wait until next Monday to start trying again. Thursday morning is a fresh start.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;You don't have to be perfect to be making progress.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Track Your Daily Mood →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/small-wins')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ The Power of Small Wins: How to Build Momentum</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/stay-motivated')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Stay Motivated When You Feel Like Giving Up</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/monthly-reflection')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ January Monthly Reflection: Rose, Bud, Thorn</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
