import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Building Emotional Strength: Simple Daily Practices",
  excerpt: "Emotional strength isn't about never crying; it's about how fast you bounce back. Learn the daily exercises to build mental resilience and handle academic setbacks like a pro.",
  category: "Mental Health",
  date: "19-01-2026",
  readTime: "6 min read",
  wordCount: 880,
  imgUrl: "/blogss/2026/January/emotional-strength-building.jpg",
  tldr: "You build emotional strength the same way you build physical strength: through small, daily resistance. Practice setting boundaries, accepting failure as data, and utilizing radical self-compassion.",
  toc: [
    { id: "what-is-it", title: "1. What Actually is Emotional Strength?", level: 3 },
    { id: "interactive-reframe", title: "2. Interactive: The Resilience Reframe Engine", level: 3 },
    { id: "daily-exercises", title: "3. 3 Daily Exercises for Mental Muscle", level: 3 },
    { id: "self-support", title: "4. The Art of Self-Support", level: 3 },
    { id: "faq", title: "5. Emotional Strength FAQs", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-19T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does being emotionally strong mean I shouldn't feel sad?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Emotional strength is not the absence of emotion; it is the ability to feel deep sadness or anxiety without letting it permanently dictate your actions." }
    },
    {
      "@type": "Question",
      "name": "How do students build emotional resilience?",
      "acceptedAnswer": { "@type": "Answer", "text": "By treating small daily failures as learning data, practicing self-compassion instead of harsh self-criticism, and setting healthy boundaries." }
    }
  ]
};

export default function EmotionalStrength({ navigate, relatedPosts }) {
  // Unique Interactivity: Resilience Reframe Engine
  const [activeScenario, setActiveScenario] = useState(null);

  const scenarios = [
    { id: 1, trigger: "You got a much lower grade than you expected.", fragile: "I am stupid. I shouldn't even bother trying for the finals.", resilient: "This hurts, but it's just feedback. My study strategy didn't work. I need to change my approach." },
    { id: 2, trigger: "Your friends hung out without inviting you.", fragile: "Nobody actually likes me. I'm going to isolate myself from them.", resilient: "I feel left out and sad right now. I will let myself feel this, but I won't assume they hate me." },
    { id: 3, trigger: "You have a massive presentation tomorrow.", fragile: "I'm going to mess up and everyone will laugh at me.", resilient: "I am nervous because this matters to me. Even if I stumble, I will survive it." }
  ];

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>There is a dangerous myth that emotionally strong people never cry, never get anxious, and never feel overwhelmed. As a student facing board exams, entrance tests, and peer pressure, trying to act like a robot will only break you faster.</p>

      <div style={{ position: 'relative' }}>
        <img 
          src="/blogss/emotional-strength-building.jpg" 
          alt="Student practicing emotional strength and mindfulness" 
          style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '8px', border: '1px solid var(--border)' }} 
        />
        <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', marginBottom: '20px', fontStyle: 'italic' }}>
          Photo by Marija Zaric on Unsplash
        </p>
      </div>

      <h3 id="what-is-it">1. What Actually is Emotional Strength?</h3>
      <p>Physical strength isn&apos;t the ability to never feel heavy weights; it is the ability to lift them. <strong>Emotional strength is the exact same thing.</strong> It is not the absence of anxiety or sadness; it is your &quot;bounce-back&quot; rate. If a bad grade used to ruin your entire week, but now it only ruins your afternoon—you have gotten emotionally stronger.</p>

      <h3 id="interactive-reframe">2. Interactive: The Resilience Reframe Engine</h3>
      <p>Emotional strength comes from how you talk to yourself after a setback. Tap the scenarios below to see the difference between a fragile reaction and a resilient one.</p>

      <div style={{ background: 'var(--lav-pale)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        {scenarios.map((item) => (
          <div key={item.id} style={{ marginBottom: '16px' }}>
            <div 
              style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1.5px solid var(--lavender)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => setActiveScenario(activeScenario === item.id ? null : item.id)}
            >
              <span style={{ fontWeight: '600', color: 'var(--ink)' }}>{item.trigger}</span>
              <span style={{ fontSize: '20px' }}>{activeScenario === item.id ? '−' : '+'}</span>
            </div>
            
            {activeScenario === item.id && (
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginTop: '8px', animation: 'fadeIn 0.3s', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <strong style={{ color: 'var(--danger)', fontSize: '13px', textTransform: 'uppercase' }}>Fragile Reaction:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--ink-soft)' }}>{item.fragile}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--sage)', fontSize: '13px', textTransform: 'uppercase' }}>Resilient Reaction:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: 'var(--ink)', fontWeight: '500' }}>{item.resilient}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 id="daily-exercises">3. 3 Daily Exercises for Mental Muscle</h3>
      <p>You cannot build muscles by staring at a gym; you have to lift weights. You build emotional strength through small daily friction:</p>
      <ul>
        <li><strong>The 10-Minute Delay:</strong> When you feel the urge to stress-scroll social media or complain, delay it by exactly 10 minutes. You are training your brain to tolerate discomfort.</li>
        <li><strong>Set One Boundary:</strong> Say &quot;No&quot; to one small thing today. A group study session you don&apos;t have energy for, or answering a text immediately.</li>
        <li><strong>The Reality Check:</strong> When anxiety spikes, ask yourself: &quot;Is this a permanent disaster, or just a temporary uncomfortable feeling?&quot;</li>
      </ul>

      <h3 id="self-support">4. The Art of Self-Support</h3>
      <p>The most emotionally resilient students share one trait: <strong>Radical Self-Compassion.</strong> If you fail an exam and your internal voice screams, <em>&quot;You are such an idiot,&quot;</em> you are breaking yourself down. Talk to yourself the exact same way you would talk to your best friend if they were crying.</p>

      <h3 id="faq">5. Emotional Strength FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I feel weak because I cry a lot. Is that bad?</strong><br/>
        A: Crying is a biological stress-release valve. It flushes cortisol out of your body. Crying actually resets your nervous system so you can be strong again. It is a tool, not a weakness.</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Rock bottom is a beautiful place to build a solid foundation.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Track Your Resilience in Mind Space →
        </button>
      </div>
      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/understanding-emotions')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Understanding Your Emotions: A Beginner's Guide for Students</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/emotional-detox')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Emotional Detox Guide: Clean Your Mind for the New Year</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/letting-go-failure')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Let Go of Past Failures and Move Forward</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
