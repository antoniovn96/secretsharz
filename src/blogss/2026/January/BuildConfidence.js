import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build Confidence Through Self-Awareness",
  excerpt: "True confidence isn't about walking into a room thinking you are better than everyone else. It's about knowing exactly who you are. Learn the deep link between self-awareness and unshakable confidence.",
  category: "Personal Growth",
  date: "29-01-2026",
  readTime: "7 min read",
  wordCount: 920,
  imgUrl: "/blogss/2026/January/confidence-self-awareness.jpg",
  tldr: "Fake confidence relies on external validation (grades, likes, compliments). Real confidence is built on self-awareness: acknowledging your flaws without shame and playing to your natural strengths.",
  toc: [
    { id: "basics", title: "1. Self-Awareness Basics", level: 3 },
    { id: "interactive-audit", title: "2. Interactive: The Confidence Audit", level: 3 },
    { id: "confidence-link", title: "3. The Link Between Awareness and Confidence", level: 3 },
    { id: "application", title: "4. Real-Life Application for Students", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-29T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function BuildConfidence({ navigate, relatedPosts }) {
  // Unique Interactivity: Confidence Audit
  const [selectedResponse, setSelectedResponse] = useState(null);

  const responses = {
    defensive: { label: "A. I get defensive and point out their flaws.", result: "🚨 This is Insecurity masking as confidence. You are protecting your ego instead of learning." },
    crushed: { label: "B. I feel completely crushed and want to quit.", result: "🌧️ This is Self-Doubt. You are letting one piece of negative feedback define your entire worth." },
    aware: { label: "C. I listen, take what is useful, and discard the rest.", result: "✅ This is True Confidence! Rooted in self-awareness, you know feedback helps you grow, but it doesn't define you." }
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>

      <p>We often confuse confidence with arrogance. We think a confident student is the one who speaks the loudest, gets the best grades, and never seems nervous.</p>
      
      <p>But real confidence is much quieter. True confidence is simply <strong>self-awareness</strong>. It is the ability to look in the mirror, know exactly what you are bad at, know exactly what you are good at, and feel perfectly okay with both.</p>

      <img 
        src={meta.imgUrl} 
        alt="Student building confidence through self-awareness and reflection" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="basics">1. Self-Awareness Basics</h3>
      <p>Self-awareness is observing yourself from a neutral perspective. Instead of saying, <em>&quot;I am terrible at public speaking,&quot;</em> a self-aware student says, <em>&quot;My heart races when I speak in public, so I need to practice my opening line ten times to feel secure.&quot;</em> It removes the shame and replaces it with strategy.</p>

      <h3 id="interactive-audit">2. Interactive: The Confidence Audit</h3>
      <p>How do you react when your ego is threatened? Let&apos;s test your self-awareness.</p>
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        <p style={{ fontWeight: 'bold', color: 'var(--ink)', marginBottom: '16px' }}>Scenario: A teacher hands back your essay and says your arguments are weak.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.keys(responses).map((key) => (
            <button 
              key={key}
              onClick={() => setSelectedResponse(key)}
              style={{ textAlign: 'left', padding: '14px 16px', borderRadius: '8px', border: '2px solid', borderColor: selectedResponse === key ? 'var(--sage)' : 'transparent', background: selectedResponse === key ? 'var(--sage-pale)' : 'white', cursor: 'pointer', fontWeight: '600', color: 'var(--ink)', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
            >
              {responses[key].label}
            </button>
          ))}
        </div>

        {selectedResponse && (
          <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '8px', borderLeft: '4px solid var(--sage)', animation: 'fadeIn 0.3s' }}>
            <strong style={{ color: 'var(--ink)' }}>Analysis:</strong> 
            <p style={{ margin: '8px 0 0 0', color: 'var(--ink-soft)' }}>{responses[selectedResponse].result}</p>
          </div>
        )}
      </div>

      <h3 id="confidence-link">3. The Link Between Awareness and Confidence</h3>
      <p>When you lack self-awareness, your confidence relies on external validation (getting 95%, getting likes on a photo). The moment that external validation is removed, your confidence shatters.</p>
      <p>When you are self-aware, your confidence relies on internal reality. You know your worth isn&apos;t tied to a grade because you know you are a kind friend, a hard worker, and a creative thinker. External feedback is just data, not a judgement of your soul.</p>

      <h3 id="application">4. Real-Life Application for Students</h3>
      <p>Start a &quot;Brag File.&quot; Write down three things you are genuinely good at, and three things you genuinely struggle with. Accept both lists as neutral facts. The next time you fail at something on the struggle list, you won&apos;t panic—you already knew it was a weak spot. You will just work on improving it.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Confidence is not 'they will like me'. Confidence is 'I'll be fine if they don't'.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Build Self-Awareness in Mind Space →
        </button>
      </div>
      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/self-acceptance-confidence')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Build Confidence Through Self-Acceptance</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/stop-comparing')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Stop Comparing Yourself to Others in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/negative-self-talk')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Breaking the Cycle of Negative Self-Talk</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
