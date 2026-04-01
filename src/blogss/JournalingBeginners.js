import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "Journaling for Mental Clarity: A Beginner's Guide",
  excerpt: "Heard that journaling is good for your mental health but don't know how to start? Learn the benefits, different styles, and beginner prompts to clear your mind.",
  category: "Self-Care",
  date: "12-01-2026",
  readTime: "5 min read",
  wordCount: 810,
  imgUrl: "/blogss/journaling-mental-clarity.jpg",
  tldr: "Journaling moves anxious thoughts from the emotional part of your brain to the logical part. You don't need to be a writer; just do a 5-minute brain dump to declutter your mind.",
  toc: [
    { id: "benefits", title: "1. The True Benefits of Journaling", level: 3 },
    { id: "types", title: "2. Types of Journaling for Students", level: 3 },
    { id: "prompts", title: "3. Interactive Prompts for Beginners", level: 3 },
    { id: "consistency", title: "4. How to Stay Consistent", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-12T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function JournalingBeginners({ navigate, relatedPosts }) {
  const [showPrompts, setShowPrompts] = useState(false);

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

      <p>If you have ever felt like your brain has too many tabs open, you are not alone. Between academics, friendships, and thinking about the future, a student&apos;s mind is a noisy place. Journaling is the ultimate tool to silence that noise.</p>

      <img 
        src="/blogss/journaling-mental-clarity.jpg" 
        alt="Student journaling for mental health clarity" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="benefits">1. The True Benefits of Journaling</h3>
      <p>When you feel anxious, the emotional center of your brain (the amygdala) is in overdrive. The physical act of translating emotions into words forces you to use the logical center of your brain (the prefrontal cortex). Journaling literally rewires your brain, stripping anxiety of its emotional intensity and turning it into a solvable problem.</p>

      <h3 id="types">2. Types of Journaling for Students</h3>
      <ul>
        <li><strong>The Brain Dump:</strong> Exactly what it sounds like. Set a timer for 5 minutes and write without stopping. Don&apos;t worry about grammar; just get every single worry onto the paper.</li>
        <li><strong>Gratitude Journaling:</strong> Writing down three hyper-specific things you are thankful for (e.g., &quot;The cold water I drank after PT period&quot; instead of just &quot;water&quot;). This fights the brain&apos;s negativity bias.</li>
        <li><strong>Worry Scripting:</strong> Write down your worst-case scenario. Then, right next to it, write down how you would realistically handle it if it actually happened.</li>
      </ul>

      <h3 id="prompts">3. Interactive Prompts for Beginners</h3>
      <p>Staring at a blank page can be intimidating. If you don&apos;t know what to write, use guided prompts.</p>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowPrompts(!showPrompts)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showPrompts ? 'Hide Prompts ↑' : 'Reveal 3 Deep Prompts ↓'}
        </button>
      </div>

      {showPrompts && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>What is an expectation I am carrying right now that does not actually belong to me?</li>
            <li style={{ marginBottom: '10px' }}>If I spoke to myself the way I speak to my best friend, what would I tell myself today?</li>
            <li>What is one small thing I did today that I am proud of, even if nobody else noticed?</li>
          </ol>
        </div>
      )}

      <h3 id="consistency">4. How to Stay Consistent</h3>
      <p>Don&apos;t buy a fancy, expensive notebook—it creates pressure to write &quot;perfectly.&quot; Buy a cheap notebook so you aren&apos;t afraid to make a mess. Tie your journaling habit to an existing one. For example: <em>&quot;I will journal for 3 minutes immediately after I brush my teeth at night.&quot;</em></p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Paper has more patience than people.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Use Our Digital AI Journal →
        </button>
      </div>
    </BlogPostTemplate>
  );
}
