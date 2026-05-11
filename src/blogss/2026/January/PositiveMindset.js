import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build a Positive Mindset at the Start of the Year",
  excerpt: "Tired of feeling pessimistic? Learn the difference between toxic positivity and a genuinely resilient mindset, complete with daily affirmations for students.",
  category: "Wellness",
  date: "08-01-2026",
  readTime: "7 min read",
  wordCount: 920,
  imgUrl: "/blogss/2026/January/positive-mindset-2026.jpg",
  tldr: "A positive mindset isn't about ignoring the bad; it's about believing you can handle the bad. Learn to reframe negative thoughts and use realistic affirmations to build academic resilience.",
  toc: [
    { id: "what-is-it", title: "1. What Exactly is a Mindset?", level: 3 },
    { id: "negative-positive", title: "2. Negative vs. Positive Thinking", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Is Your Mindset Blocking You?", level: 3 },
    { id: "reframing", title: "4. How to Reframe Toxic Thoughts", level: 3 },
    { id: "affirmations", title: "5. Daily Affirmations for Students", level: 3 },
    { id: "mistakes", title: "6. Mistakes to Avoid (Toxic Positivity)", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-08T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you build a positive mindset as a student?",
      "acceptedAnswer": { "@type": "Answer", "text": "You build it by reframing failures as data, using grounded daily affirmations, and practicing self-compassion instead of harsh self-criticism." }
    },
    {
      "@type": "Question",
      "name": "What is toxic positivity?",
      "acceptedAnswer": { "@type": "Answer", "text": "Toxic positivity is forcing yourself to be 'happy' and ignoring genuine pain. True positivity acknowledges the struggle but maintains hope." }
    }
  ]
};

export default function PositiveMindset({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showAffirmations, setShowAffirmations] = useState(false);

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

      <p>When someone tells a stressed student to <em>&quot;just think positive,&quot;</em> it usually feels like an insult. You cannot simply smile your way through academic pressure, entrance exams, and career confusion.</p>
      
      <p>But building a genuine <strong>positive mindset</strong> isn&apos;t about ignoring the bad stuff. It is about building the mental resilience to handle the bad stuff without letting it destroy your self-worth.</p>

      <img 
        src="/blogss/positive-mindset-2026.jpg" 
        alt="Student practicing positive mindset and affirmations" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-is-it">1. What Exactly is a Mindset?</h3>
      <p>Your mindset is the lens through which you view the world. If you wear red glasses, everything looks red. If your mindset is wired for anxiety, every minor inconvenience looks like a catastrophe.</p>

      <h3 id="negative-positive">2. Negative vs. Positive Thinking</h3>
      <p>Negative thinking assumes the worst possible outcome is a guaranteed fact. <em>&quot;I didn&apos;t understand this chapter, therefore I will fail the board exam.&quot;</em> Positive thinking isn&apos;t delusion; it is logic. It says: <em>&quot;I don&apos;t understand this chapter yet, but I can ask for help tomorrow.&quot;</em></p>

      <h3 id="quiz">3. Interactive Check: Is Your Mindset Blocking You?</h3>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you automatically expect the worst outcome in new situations?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          When someone compliments your work, do you immediately dismiss it?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you focus entirely on the 1 question you got wrong instead of the 9 you got right?
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. Your inner critic is driving the car. It is time to reframe.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. Your mindset is relatively balanced!</p>
        )}
      </div>

      <h3 id="reframing">4. How to Reframe Toxic Thoughts</h3>
      <p>Reframing is a cognitive behavioral technique where you catch a negative thought and actively rewrite it.</p>
      <ul>
        <li><strong>Instead of:</strong> &quot;I am terrible at math.&quot;</li>
        <li><strong>Reframe to:</strong> &quot;Math is challenging for me, but I am capable of learning difficult things.&quot;</li>
      </ul>

      <h3 id="affirmations">5. Daily Affirmations for Students</h3>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowAffirmations(!showAffirmations)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showAffirmations ? 'Hide Affirmations ↑' : 'Tap to reveal 5 Student Affirmations ↓'}
        </button>
      </div>

      {showAffirmations && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <p>Repeat these to yourself in the mirror or write them in your notebook before studying:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>My worth is not determined by my exam scores.</li>
            <li style={{ marginBottom: '8px' }}>I am allowed to make mistakes; that is how I learn.</li>
            <li style={{ marginBottom: '8px' }}>I am doing my best, and my best is enough for today.</li>
            <li style={{ marginBottom: '8px' }}>I cannot control everything, but I can control my effort.</li>
            <li>I deserve rest just as much as I deserve success.</li>
          </ul>
        </div>
      )}

      <h3 id="mistakes">6. Mistakes to Avoid (Toxic Positivity)</h3>
      <p>Do not force yourself to &quot;look on the bright side&quot; when something genuinely hurts. Toxic positivity denies human emotion. If you failed a test, you are allowed to be sad! A true positive mindset says: <em>&quot;I am really sad about this grade, but I know this one grade doesn&apos;t destroy my future.&quot;</em></p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;The mind is like a muscle. The more you train it to look for solutions, the stronger it gets.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Practice Reframing in Mind Space →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/negative-self-talk')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Deal with Negative Self-Talk in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/letting-go-failure')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Let Go of Past Failures and Move Forward</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/stop-comparing')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Stop Comparing Yourself to Others in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
