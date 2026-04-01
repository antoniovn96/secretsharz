import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "Daily Mental Health Routine for Students in 2026",
  excerpt: "A consistent daily routine is the foundation of student mental health. Learn how to structure your morning, school day, and night to avoid burnout and stay balanced.",
  category: "Wellness",
  date: "10-01-2026",
  readTime: "7 min read",
  wordCount: 920,
  imgUrl: "/blogss/student-mental-health-routine.jpg",
  tldr: "You don't need a complicated 3-hour morning routine. Focus on 10 minutes of screen-free mornings, micro-breaks at school, and a brain-dumping night routine to protect your peace.",
  toc: [
    { id: "morning", title: "1. The Morning Routine (Setting the Tone)", level: 3 },
    { id: "school", title: "2. School-Time Coping Strategies", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Is Your Routine Broken?", level: 3 },
    { id: "night", title: "4. The Night Routine (Closing the Tabs)", level: 3 },
    { id: "balance", title: "5. Tips for Academic and Mental Balance", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-10T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function StudentMentalHealthRoutine({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showRoutine, setShowRoutine] = useState(false);

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

      <p>As a student, your day is dictated by timetables, bells, and deadlines. When you have zero control over your schedule, anxiety spikes. The best way to take back control of your mental health is by establishing a simple, unbreakable daily routine.</p>

      <img 
        src="/blogss/student-mental-health-routine.jpg" 
        alt="Student practicing a daily mental health routine in 2026" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="morning">1. The Morning Routine (Setting the Tone)</h3>
      <p>How you spend the first 20 minutes of your day dictates your stress baseline for the next 12 hours. If you wake up and immediately check WhatsApp or Instagram, you are starting your day in a state of <em>reaction</em>.</p>
      <ul>
        <li><strong>No Screens:</strong> Keep your phone out of reach for the first 15 minutes.</li>
        <li><strong>Hydrate:</strong> Drink a full glass of water before caffeine.</li>
        <li><strong>One Intention:</strong> Set one simple goal for the day (e.g., &quot;Today I will not stress over things I cannot control.&quot;)</li>
      </ul>

      <h3 id="school">2. School-Time Coping Strategies</h3>
      <p>School is an overstimulating environment. To survive without burning out, you need micro-breaks. Use the 5 minutes between periods to close your eyes, relax your jaw, and take three deep breaths rather than rushing to review notes.</p>

      <h3 id="quiz">3. Interactive Check: Is Your Routine Broken?</h3>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you check social media before you even get out of bed?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you study right up until the minute you fall asleep?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you skip meals because you feel too busy or stressed?
        </label>
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ Your routine is increasing your baseline anxiety. It&apos;s time to build healthier bookends to your day.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You have a solid routine foundation! Keep protecting your peace.</p>
        )}
      </div>

      <h3 id="night">4. The Night Routine (Closing the Tabs)</h3>
      <p>If your brain is a computer, sleep is the shutdown process. But you cannot shut down properly if you leave 50 tabs open. You need a transition phase between studying and sleeping.</p>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowRoutine(!showRoutine)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showRoutine ? 'Hide Night Routine ↑' : 'Reveal the Ultimate Night Routine ↓'}
        </button>
      </div>

      {showRoutine && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>The Cut-Off (9 PM):</strong> Close all textbooks. No studying within 60 minutes of sleeping.</li>
            <li style={{ marginBottom: '10px' }}><strong>The Brain Dump:</strong> Write tomorrow&apos;s to-do list down so you don&apos;t have to actively remember it while trying to sleep.</li>
            <li><strong>Low Light:</strong> Turn off bright overhead lights and switch to a warm lamp. This signals to your brain to release melatonin.</li>
          </ol>
        </div>
      )}

      <h3 id="balance">5. Tips for Academic and Mental Balance</h3>
      <p>Consistency beats intensity. Studying 2 hours every day is far better for your mental health (and grades) than cramming for 8 hours on Sunday while crying.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Routine is not a prison. Routine is the framework that buys you freedom.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Build Your Routine in Mind Space →
        </button>
      </div>
    </BlogPostTemplate>
  );
}
