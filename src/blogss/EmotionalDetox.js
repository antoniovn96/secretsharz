import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "Emotional Detox Guide: Clean Your Mind for the New Year",
  excerpt: "Feeling mentally drained and emotionally exhausted? Learn how to recognize the signs of emotional buildup and execute a step-by-step mental detox for 2026.",
  category: "Wellness",
  date: "03-01-2026",
  readTime: "6 min read",
  wordCount: 880,
  imgUrl: "/blogss/emotional-detox-guide.jpg",
  tldr: "An emotional detox clears out accumulated stress and negativity. Start by identifying your emotional triggers, doing a digital detox, and replacing toxic habits with mindful routines.",
  toc: [
    { id: "what-is-it", title: "1. What is an Emotional Detox?", level: 3 },
    { id: "signs", title: "2. Interactive Check: Do You Need a Detox?", level: 3 },
    { id: "plan", title: "3. Your Step-by-Step Detox Plan", level: 3 },
    { id: "habits", title: "4. Daily Habits for a Clean Mind", level: 3 },
    { id: "faq", title: "5. Emotional Detox FAQs", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-03T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an emotional detox?",
      "acceptedAnswer": { "@type": "Answer", "text": "An emotional detox is the process of intentionally clearing out negative emotions, stress, and mental clutter that accumulate from academic pressure and daily life." }
    },
    {
      "@type": "Question",
      "name": "How long does a mental detox take?",
      "acceptedAnswer": { "@type": "Answer", "text": "It can be as short as a 24-hour weekend reset or a gradual 7-day process. The goal is to break the cycle of chronic stress, not to rush the healing process." }
    },
    {
      "@type": "Question",
      "name": "Why do students need an emotional detox?",
      "acceptedAnswer": { "@type": "Answer", "text": "Students absorb immense pressure from exams, peers, and social media. Detoxing helps prevent burnout and restores focus and emotional stability." }
    }
  ]
};

export default function EmotionalDetox({ navigate, relatedPosts }) {
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>We detox our bodies with healthy food and water, but we rarely think about detoxing our minds. After a long year of exams, social drama, and endless scrolling, your brain accumulates &quot;emotional junk.&quot;</p>
      
      <p>If you want to start 2026 with a clear mind and sharp focus, an <strong>emotional detox for students</strong> is exactly what you need.</p>

      <img 
        src="/blogss/emotional-detox-guide.jpg" 
        alt="Student relaxing for an emotional detox mental health" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-is-it">1. What is an Emotional Detox?</h3>
      <p>An emotional detox is the intentional process of clearing out toxic feelings, stress, and mental clutter. Just like a computer slows down when its hard drive is full, your brain slows down—causing brain fog, irritability, and exhaustion—when it&apos;s holding onto too much unexpressed emotion.</p>
      <p>For students, this often looks like releasing the guilt of past academic failures, muting comparisons to peers, and stepping away from doom-scrolling.</p>

      <h3 id="signs">2. Interactive Check: Do You Need a Detox?</h3>
      <p>Check the boxes below to see if your emotional &quot;hard drive&quot; is full:</p>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you feel easily irritated or snap at your friends/family over small things?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you find yourself mindlessly scrolling on your phone to avoid thinking?
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          Do you feel emotionally exhausted, even when you haven&apos;t done much physical work?
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. Your emotional cup is overflowing. It is time for a detox.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. You&apos;re managing well, but a light reset wouldn&apos;t hurt!</p>
        )}
      </div>

      <h3 id="plan">3. Your Step-by-Step Detox Plan</h3>
      <p>Ready to clear the clutter? Follow this structured reset plan over the weekend.</p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowPlan(!showPlan)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showPlan ? 'Hide the Detox Plan ↑' : 'Tap to reveal the Detox Plan ↓'}
        </button>
      </div>

      {showPlan && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <h4>Phase 1: Disconnect (Saturday Morning)</h4>
          <p>Delete Instagram and TikTok off your phone for 48 hours. The fear of missing out (FOMO) will spike initially, but the mental silence that follows is worth it.</p>
          
          <h4>Phase 2: Extract (Saturday Evening)</h4>
          <p>Get a notebook. Write down every single thing that is bothering you—friendship drama, syllabus anxiety, parental pressure. Don&apos;t filter it. Just let the poison out onto the page.</p>

          <h4>Phase 3: Replenish (Sunday)</h4>
          <p>Do one low-stimulation activity that brings you joy. Read a fiction book, go for a walk without earphones, or sketch. Reintroduce calm to your nervous system.</p>
        </div>
      )}

      <h3 id="habits">4. Daily Habits for a Clean Mind</h3>
      <p>A detox isn&apos;t just a one-time event. Keep your mind clean throughout 2026 by practicing these daily habits:</p>
      <ul>
        <li><strong>The 10-Minute Morning Rule:</strong> Do not check your phone for the first 10 minutes after waking up. Let your brain boot up naturally.</li>
        <li><strong>Unfollow Negativity:</strong> Audit your social media. If an account makes you feel inadequate or stressed, unfollow or mute them immediately.</li>
        <li><strong>Protect Your Boundaries:</strong> You are allowed to say &quot;No&quot; to group study sessions if you need quiet time to yourself.</li>
      </ul>

      <h3 id="faq">5. Emotional Detox FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Will an emotional detox cure my anxiety?</strong><br/>
        A: No, but it lowers your baseline stress levels significantly. It gives you the mental bandwidth to handle daily anxieties better.</p>

        <p><strong>Q: I feel guilty taking a break from studying to detox. What should I do?</strong><br/>
        A: Rest is productive. A car with no fuel cannot drive. Taking 24 hours to emotionally reset will make your next 5 days of studying twice as effective.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;You cannot heal in the same environment that made you sick. Step back and breathe.&quot;
        </h2>
        <button 
          onClick={() => navigate('/wall')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Vent Anonymously on the Sharz Wall →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mental-health-goals')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to set intentions that actually work</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/mindspace')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Try the free Mood Tracker</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
