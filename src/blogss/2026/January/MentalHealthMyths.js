import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mental Health Myths You Should Stop Believing in 2026",
  excerpt: "Does asking for help mean you are weak? Does everyone with a mental health issue look sad? We are busting the biggest mental health myths holding students back today.",
  category: "Awareness",
  date: "28-01-2026",
  readTime: "6 min read",
  wordCount: 840,
  imgUrl: "/blogss/2026/January/mental-health-myths.jpg",
  tldr: "Social stigma thrives on misinformation. Mental health issues are biological, not character flaws. Busting these myths is the first step to creating a safer environment for yourself and your peers.",
  toc: [
    { id: "social-stigma", title: "1. The Danger of Social Stigma", level: 3 },
    { id: "interactive-buster", title: "2. Interactive: The Myth Buster", level: 3 },
    { id: "facts", title: "3. The Scientific Facts", level: 3 },
    { id: "awareness", title: "4. How to Spread Awareness", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-28T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function MentalHealthMyths({ navigate, relatedPosts }) {
  // Unique Interactivity: Myth Buster Cards
  const [busted, setBusted] = useState({});

  const myths = [
    { id: 'm1', myth: "You only need therapy if you have a severe mental illness.", fact: "Fact: Therapy is like going to the gym. You don't wait until you have a heart attack to start exercising. Therapy helps you process everyday stress and prevents burnout." },
    { id: 'm2', myth: "If someone is smiling and getting good grades, they are fine.", fact: "Fact: High-functioning anxiety and 'smiling depression' are very real. Many students use perfectionism and overachieving to mask deep internal panic." },
    { id: 'm3', myth: "Having a mental health issue means you are weak.", fact: "Fact: Mental health conditions are biological and psychological. Telling someone to 'just be strong' is like telling someone with a broken leg to just walk it off." }
  ];

  const handleBust = (id) => {
    setBusted(prev => ({ ...prev, [id]: true }));
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
      </Head>

      <p>Even in 2026, the whispers in school hallways and family dining rooms carry heavy, outdated assumptions about mental health. This misinformation stops millions of students from seeking the help they desperately need.</p>
      
      <p>It is time to separate fact from fiction.</p>

      <img 
        src={meta.imgUrl} 
        alt="Busting mental health myths for students in 2026" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="social-stigma">1. The Danger of Social Stigma</h3>
      <p>Stigma thrives in the dark. When we refuse to talk about anxiety, depression, or burnout, students internalize the struggle. They begin to believe that they are uniquely broken, rather than experiencing a very common human reaction to extreme academic and social pressure.</p>

      <h3 id="interactive-buster">2. Interactive: The Myth Buster</h3>
      <p>Test your knowledge. Tap the myths below to permanently strike them from your mind and reveal the psychological truth.</p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        {myths.map((m) => (
          <div 
            key={m.id} 
            onClick={() => handleBust(m.id)}
            style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', cursor: busted[m.id] ? 'default' : 'pointer', border: '1.5px solid', borderColor: busted[m.id] ? 'var(--success)' : 'var(--danger)', transition: 'all 0.3s', boxShadow: 'var(--shadow-sm)' }}
          >
            <div style={{ color: busted[m.id] ? 'var(--muted)' : 'var(--danger)', fontWeight: '600', textDecoration: busted[m.id] ? 'line-through' : 'none', marginBottom: busted[m.id] ? '10px' : '0' }}>
              ❌ Myth: &quot;{m.myth}&quot;
            </div>
            {busted[m.id] ? (
              <div style={{ color: 'var(--success)', fontWeight: '600', padding: '12px', background: '#E8F5EE', borderRadius: '6px', animation: 'fadeIn 0.4s' }}>
                ✅ {m.fact}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', textAlign: 'right' }}>Tap to Bust this Myth 🔨</div>
            )}
          </div>
        ))}
      </div>

      <h3 id="facts">3. The Scientific Facts</h3>
      <p>Research confirms that 1 in 4 people will experience a mental health condition at some point in their lives. Just as you catch a cold, you can catch anxiety. Healing begins the moment you stop treating mental health as a character flaw and start treating it as a medical reality.</p>

      <h3 id="awareness">4. How to Spread Awareness</h3>
      <p>You don&apos;t need to run a massive campaign. Spreading awareness is as simple as correcting a friend when they use the word &quot;depressed&quot; to describe feeling slightly sad, or reaching out to a classmate who has gone unusually quiet.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;There is no health without mental health.&quot;
        </h2>
        <button 
          onClick={() => navigate('/safe')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Access Safe Corner Support →
        </button>
      </div>
    </BlogPostTemplate>
  );
}
