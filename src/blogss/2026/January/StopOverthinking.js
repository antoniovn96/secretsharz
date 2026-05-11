import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Overthinking in the New Year: How to Stop and Take Control",
  excerpt: "Caught in an endless loop of 'what ifs'? Learn the common triggers for student overthinking and practical grounding exercises to quiet your racing mind.",
  category: "Mental Health",
  date: "11-01-2026",
  readTime: "7 min read",
  wordCount: 950,
  imgUrl: "/blogss/2026/January/stop-overthinking-2026.jpg",
  tldr: "Overthinking is a fear response, not a problem-solving strategy. Break the loop by recognizing triggers, giving your anxiety an 'appointment time,' and grounding yourself in the physical present.",
  toc: [
    { id: "causes", title: "1. What Actually Causes Overthinking?", level: 3 },
    { id: "triggers", title: "2. Common Triggers for Students", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Are You Stuck in a Loop?", level: 3 },
    { id: "techniques", title: "4. Practical Techniques to Break the Cycle", level: 3 },
    { id: "grounding", title: "5. Instant Grounding Exercises", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-11T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function StopOverthinking({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showTechnique, setShowTechnique] = useState(false);

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

      <p>Overthinking feels productive. Your brain convinces you that if you just analyze a situation from 50 different angles, you will eventually find the perfect solution and avoid failure. But in reality, overthinking is a trap that drains your energy and leaves you paralyzed.</p>

      <img 
        src="/blogss/stop-overthinking-2026.jpg" 
        alt="Student stopping overthinking and finding mental clarity" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="causes">1. What Actually Causes Overthinking?</h3>
      <p>Overthinking is an evolutionary defense mechanism. When your brain senses uncertainty (like an upcoming exam or a vague text from a friend), it hates the lack of control. To regain control, it generates endless &quot;What if?&quot; scenarios to prepare you for the worst.</p>

      <h3 id="triggers">2. Common Triggers for Students</h3>
      <p>The academic environment is a breeding ground for rumination. Triggers include waiting for results, comparing your study progress to peers, fearing you picked the wrong stream, or dwelling on an awkward social interaction.</p>

      <h3 id="quiz">3. Interactive Check: Are You Stuck in a Loop?</h3>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you spend more time worrying about an assignment than actually doing it?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you frequently ask friends for reassurance but still don&apos;t feel better?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you replay past mistakes in your head when trying to fall asleep?
        </label>
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You are trapped in an overthinking cycle. It is time to intervene.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You manage your thoughts well, but keep practicing mindfulness!</p>
        )}
      </div>

      <h3 id="techniques">4. Practical Techniques to Break the Cycle</h3>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowTechnique(!showTechnique)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showTechnique ? 'Hide Technique ↑' : 'Reveal the "Worry Time" Technique ↓'}
        </button>
      </div>

      {showTechnique && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <h4>Schedule Your Anxiety</h4>
          <p>You cannot banish thoughts, but you can reschedule them. Set a timer for 15 minutes at 5:00 PM every day. This is your &quot;Worry Time.&quot; Write down every worst-case scenario. When the timer rings, close the book. If you start overthinking at 10 AM, tell your brain: <em>&quot;We are not allowed to worry about this until 5 PM.&quot;</em></p>
        </div>
      )}

      <h3 id="grounding">5. Instant Grounding Exercises</h3>
      <p>When overthinking spirals into a panic attack, you must reconnect with your physical body to tell your brain you are safe.</p>
      <ul>
        <li><strong>Hold an Ice Cube:</strong> The intense cold forces your brain to stop imagining future disasters and focus entirely on the present physical sensation.</li>
        <li><strong>The 5-4-3-2-1 Method:</strong> Look around your room. Name 5 things you see, touch 4 things, listen for 3 sounds, smell 2 things, and taste 1 thing.</li>
      </ul>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Worrying is like a rocking chair. It gives you something to do, but gets you nowhere.&quot;
        </h2>
        <button 
          onClick={() => navigate('/wall')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Dump Your Thoughts on the Wall →
        </button>
      </div>
      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mindfulness-daily-life')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Practice Mindfulness in Daily Life (Simple Techniques)</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/negative-self-talk')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Deal with Negative Self-Talk in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/understanding-emotions')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Understanding Your Emotions: A Beginner's Guide for Students</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
