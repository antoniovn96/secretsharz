import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Why You Feel Lost at the Start of the Year (And What to Do)",
  excerpt: "Everyone else seems to have their 2026 figured out, but you just feel empty and confused. Learn why this 'New Year fog' is completely normal and how to gently find your direction.",
  category: "Mental Health",
  date: "22-01-2026",
  readTime: "6 min read",
  wordCount: 880,
  imgUrl: "/blogss/2026/January/feeling-lost-new-year.jpg",
  tldr: "Feeling lost in January is a common psychological crash after the high expectations of the holidays. Stop trying to plan your whole life; focus only on taking the very next right step.",
  toc: [
    { id: "confusion", title: "1. The Anatomy of Emotional Confusion", level: 3 },
    { id: "identity", title: "2. Identity Questions: 'Who Am I?'", level: 3 },
    { id: "interactive-compass", title: "3. Interactive: The Identity Compass", level: 3 },
    { id: "normalizing", title: "4. Normalizing the 'New Year Fog'", level: 3 },
    { id: "steps", title: "5. Direction-Building Steps", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-22T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function FeelingLostNewYear({ navigate, relatedPosts }) {
  // Unique Interactivity: Identity Compass
  const [activeCompass, setActiveCompass] = useState(null);

  const compassData = {
    academics: { icon: "📚", title: "Lost in Academics", text: "You are not your grades. If you feel behind, zoom in. Don't look at the final exam; look at the chapter you need to read today. Action cures anxiety." },
    social: { icon: "👥", title: "Lost in Friendships", text: "Friendships shift. If you feel disconnected, it might be because you are growing. Reach out to one person today with zero expectations." },
    future: { icon: "🧭", title: "Lost about the Future", text: "Nobody has it figured out at your age. Every adult is improvising. You just need to figure out what you are curious about right now, not what you'll do at 40." }
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

      <p>It is January 2026. You open Instagram, and everyone is posting their vision boards, study schedules, and massive goals. Meanwhile, you are sitting on your bed staring at the ceiling, feeling completely, utterly lost.</p>

      <img 
        src="/blogss/feeling-lost-new-year.jpg" 
        alt="Student feeling lost and looking for direction in the new year" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="confusion">1. The Anatomy of Emotional Confusion</h3>
      <p>When the calendar flips to a new year, society tells us we should feel energized. When your internal reality (exhaustion, confusion, numbness) clashes with this external expectation (hustle, motivation), it creates massive emotional friction. You aren&apos;t just lost; you feel guilty for being lost.</p>

      <h3 id="identity">2. Identity Questions: &quot;Who Am I?&quot;</h3>
      <p>As a student, your identity is heavily tied to external markers: your stream (Science, Commerce, Arts), your friend group, or your rank in class. When you feel disconnected from those things, the terrifying question arises: <em>Who am I without them?</em></p>

      <h3 id="interactive-compass">3. Interactive: The Identity Compass</h3>
      <p>Where is the &quot;lost&quot; feeling hitting you the hardest right now? Tap a card to find your immediate grounding thought.</p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {Object.keys(compassData).map((key) => (
            <button 
              key={key}
              onClick={() => setActiveCompass(key)}
              style={{ padding: '16px 12px', borderRadius: '8px', border: '2px solid', borderColor: activeCompass === key ? 'var(--sage)' : 'transparent', background: activeCompass === key ? 'var(--sage)' : 'white', color: activeCompass === key ? 'white' : 'var(--ink)', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontSize: '28px' }}>{compassData[key].icon}</span>
              <span style={{ fontSize: '13px' }}>{compassData[key].title.split(' ')[2]}</span>
            </button>
          ))}
        </div>

        {activeCompass ? (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid var(--sage-light)', animation: 'fadeIn 0.3s' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--sage)' }}>{compassData[activeCompass].title}</h4>
            <p style={{ margin: '0', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>{compassData[activeCompass].text}</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontStyle: 'italic' }}>
            👆 Tap an area above to find your compass.
          </div>
        )}
      </div>

      <h3 id="normalizing">4. Normalizing the &quot;New Year Fog&quot;</h3>
      <p>You do not need to have your life mapped out by January 31st. In fact, people who rigidly lock in their plans often break under pressure. It is deeply normal to exist in a state of &quot;figuring it out.&quot; Give yourself permission to just be a work-in-progress.</p>

      <h3 id="steps">5. Direction-Building Steps</h3>
      <ul>
        <li><strong>Zoom In:</strong> Stop looking at the 10-year plan. Look at the next 10 hours. What is one useful thing you can do before you sleep today?</li>
        <li><strong>Follow Curiosity, Not Passion:</strong> &quot;Find your passion&quot; is terrifying advice. &quot;Follow your curiosity&quot; is easy. What is one topic, hobby, or subject you don&apos;t hate learning about? Spend 15 minutes on it.</li>
      </ul>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Not all who wander are lost. Some are simply exploring.&quot;
        </h2>
        <button 
          onClick={() => navigate('/vidyavantage')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Find Your Path with VidyaVantage →
        </button>
      </div>
      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/positive-mindset')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Build a Positive Mindset at the Start of the Year</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mental-health-goals')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Goal Setting for Mental Health: How to Set Intentions That Actually Work</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/self-reflection')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Why Self-Reflection is Important for Emotional Growth</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
