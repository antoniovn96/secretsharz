import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "The Power of Small Wins for Mental Health Improvement",
  excerpt: "Feeling unmotivated? Learn the neuroscience behind 'small wins' and how checking off tiny tasks can flood your brain with dopamine and cure academic burnout.",
  category: "Wellness",
  date: "14-01-2026",
  readTime: "5 min read",
  wordCount: 810,
  imgUrl: "/blogss/2026/January/small-wins-mental-health.jpg",
  tldr: "When you achieve a 'small win' (like making your bed), your brain releases dopamine, which motivates you to do a bigger task. Momentum is built in inches, not miles.",
  toc: [
    { id: "what-are-they", title: "1. What Are Small Wins?", level: 3 },
    { id: "why-they-matter", title: "2. Why They Matter (The Dopamine Effect)", level: 3 },
    { id: "interactive-tracker", title: "3. Interactive: The Momentum Tracker", level: 3 },
    { id: "examples", title: "4. Examples of Student Micro-Wins", level: 3 },
    { id: "tracking", title: "5. How to Track Progress Without Pressure", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-14T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function SmallWins({ navigate, relatedPosts }) {
  // Unique Interactivity: Dopamine/Momentum Tracker
  const [wins, setWins] = useState({ w1: false, w2: false, w3: false, w4: false });
  
  const checkedCount = Object.values(wins).filter(Boolean).length;
  const progressPercent = (checkedCount / 4) * 100;

  const toggleWin = (w) => {
    setWins(prev => ({ ...prev, [w]: !prev[w] }));
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

      <p>When you are depressed or burnt out, the advice to &quot;just study harder&quot; or &quot;start a workout routine&quot; feels like being asked to climb Mount Everest with a broken leg. The gap between where you are and where you want to be is terrifying.</p>
      <p>The secret to escaping this paralysis isn&apos;t a massive burst of motivation. It is the neuroscience of <strong>small wins</strong>.</p>

      <img 
        src="/blogss/small-wins-mental-health.jpg" 
        alt="Student tracking small wins for mental health momentum" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-are-they">1. What Are Small Wins?</h3>
      <p>A small win is a task so ridiculously easy that you cannot possibly fail at it. It is not &quot;writing a 5-page essay.&quot; It is &quot;opening a Google Doc and typing the title.&quot; It is not &quot;cleaning your entire messy room.&quot; It is &quot;putting your shoes in the closet.&quot;</p>

      <h3 id="why-they-matter">2. Why They Matter (The Dopamine Effect)</h3>
      <p>When you complete a task—no matter how small—your brain releases a hit of dopamine. Dopamine is the chemical of reward and motivation. When you get that hit, your brain wants more, which propels you into the next action. By stacking tiny, achievable tasks, you artificially create a wave of momentum.</p>

      <h3 id="interactive-tracker">3. Interactive: The Momentum Tracker</h3>
      <p>Try it right now. See how clicking off even the most basic achievements visually builds your momentum.</p>
      
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: 'var(--ink)' }}>
            <span>Dopamine Level</span>
            <span>{checkedCount}/4 Wins</span>
          </div>
          <div style={{ background: 'var(--sage-pale)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--peach), var(--sage))', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', cursor: 'pointer', opacity: wins.w1 ? 0.6 : 1, textDecoration: wins.w1 ? 'line-through' : 'none' }}>
          <input type="checkbox" checked={wins.w1} onChange={() => toggleWin('w1')} style={{ width: '22px', height: '22px', accentColor: 'var(--sage)' }} /> 
          I drank a glass of water today.
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', cursor: 'pointer', opacity: wins.w2 ? 0.6 : 1, textDecoration: wins.w2 ? 'line-through' : 'none' }}>
          <input type="checkbox" checked={wins.w2} onChange={() => toggleWin('w2')} style={{ width: '22px', height: '22px', accentColor: 'var(--sage)' }} /> 
          I got out of bed before noon.
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', cursor: 'pointer', opacity: wins.w3 ? 0.6 : 1, textDecoration: wins.w3 ? 'line-through' : 'none' }}>
          <input type="checkbox" checked={wins.w3} onChange={() => toggleWin('w3')} style={{ width: '22px', height: '22px', accentColor: 'var(--sage)' }} /> 
          I took 3 deep breaths.
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', cursor: 'pointer', opacity: wins.w4 ? 0.6 : 1, textDecoration: wins.w4 ? 'line-through' : 'none' }}>
          <input type="checkbox" checked={wins.w4} onChange={() => toggleWin('w4')} style={{ width: '22px', height: '22px', accentColor: 'var(--sage)' }} /> 
          I opened a textbook (even if I didn't read it yet).
        </label>

        {checkedCount === 4 && (
          <div style={{ marginTop: '16px', color: 'var(--success)', fontWeight: 'bold', textAlign: 'center', animation: 'floatUp 0.3s' }}>
            🎉 Momentum unlocked! You are officially in motion. What's next?
          </div>
        )}
      </div>

      <h3 id="examples">4. Examples of Student Micro-Wins</h3>
      <ul>
        <li><strong>Academic:</strong> Highlight the headings of one chapter. (Just highlight, don&apos;t study yet).</li>
        <li><strong>Social:</strong> Send one meme to a friend you haven&apos;t talked to in a while.</li>
        <li><strong>Environment:</strong> Take the empty cups and plates out of your room.</li>
      </ul>

      <h3 id="tracking">5. How to Track Progress Without Pressure</h3>
      <p>The goal of tracking small wins is encouragement, not perfectionism. If you use a habit tracker, use the &quot;Ta-Da List&quot; method. Instead of a massive &quot;To-Do&quot; list that causes anxiety, write down 3 tiny things you already did today and celebrate them.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Greatness is just a bunch of small things done consistently well.&quot;
        </h2>
      </div>
    </BlogPostTemplate>
  );
}
