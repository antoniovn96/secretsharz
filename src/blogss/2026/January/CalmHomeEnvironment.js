import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Create a Calm and Positive Environment at Home",
  excerpt: "A cluttered desk equals a cluttered mind. Discover how your physical space impacts your mental health and learn how to create a stress-free sanctuary in your own room.",
  category: "Wellness",
  date: "16-01-2026",
  readTime: "6 min read",
  wordCount: 880,
  imgUrl: "/blogss/2026/January/calm-home-environment.jpg",
  tldr: "Your physical environment constantly sends signals to your brain. By clearing visual clutter, creating a dedicated 'safe space,' and implementing a digital detox zone, you can drastically lower your baseline anxiety.",
  toc: [
    { id: "impact", title: "1. The Impact of Your Environment", level: 3 },
    { id: "interactive-vibe", title: "2. Interactive: The Room Vibe Meter", level: 3 },
    { id: "decluttering", title: "3. The 10-Minute Declutter Rule", level: 3 },
    { id: "safe-space", title: "4. Creating a Psychological Safe Space", level: 3 },
    { id: "digital-detox", title: "5. Building a Digital Detox Zone", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-16T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does a messy room affect mental health?",
      "acceptedAnswer": { "@type": "Answer", "text": "Visual clutter overloads your brain with excess stimuli, causing your senses to work overtime. This increases cortisol (the stress hormone) and makes it harder to focus." }
    },
    {
      "@type": "Question",
      "name": "How do I make my room a safe space for studying?",
      "acceptedAnswer": { "@type": "Answer", "text": "Separate your sleep zone from your study zone. Ensure your desk is clear of non-essential items, use warm lighting, and keep your phone in another room while working." }
    }
  ]
};

export default function CalmHomeEnvironment({ navigate, relatedPosts }) {
  // Unique Interactivity: Room Vibe Meter
  const [tasks, setTasks] = useState({ t1: false, t2: false, t3: false, t4: false });
  
  const completedCount = Object.values(tasks).filter(Boolean).length;
  
  // Calculate a background color that shifts from a stressful gray to a calm sage green
  const getVibeColor = () => {
    if (completedCount === 0) return '#E5E7EB'; // Stressed Gray
    if (completedCount === 1) return '#D1D5DB'; // Slightly better
    if (completedCount === 2) return '#D1FAE5'; // Getting calm
    if (completedCount === 3) return 'var(--sage-pale)'; // Very calm
    return 'var(--sage)'; // Ultimate Zen
  };

  const toggleTask = (t) => {
    setTasks(prev => ({ ...prev, [t]: !prev[t] }));
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>Have you ever noticed how much harder it is to focus when your desk is covered in old papers, empty cups, and tangled wires? That isn&apos;t just a coincidence—it is neuroscience.</p>
      
      <p>Your physical environment acts as a mirror for your internal mental state. If you want to clear your mind, the fastest and easiest first step is to clear your room.</p>

      <img 
        src="/blogss/calm-home-environment.jpg" 
        alt="A clean, calm study environment for student mental health" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="impact">1. The Impact of Your Environment</h3>
      <p>Our brains are constantly scanning our surroundings for information. When your room is cluttered, your brain is bombarded with visual stimuli. It essentially screams, <em>&quot;Look at all this unfinished work!&quot;</em> This low-level, constant distraction drains your cognitive battery and spikes your anxiety before you even open a textbook.</p>

      <h3 id="interactive-vibe">2. Interactive: The Room Vibe Meter</h3>
      <p>Want to see the psychological shift in real-time? Check off these micro-tasks and watch how the &quot;vibe&quot; of the box below transforms from chaotic to calm.</p>

      <div style={{ border: '1px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: getVibeColor(), transition: 'background 0.5s ease', color: completedCount === 4 ? 'white' : 'var(--ink)' }}>
        <h4 style={{ margin: '0 0 16px 0', fontFamily: 'Fraunces, serif', color: completedCount === 4 ? 'white' : 'var(--ink)' }}>
          {completedCount === 4 ? '✨ Ultimate Zen Achieved ✨' : 'Current Vibe: Chaotic'}
        </h4>
        
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', cursor: 'pointer', fontWeight: '500' }}>
          <input type="checkbox" checked={tasks.t1} onChange={() => toggleTask('t1')} style={{ width: '22px', height: '22px', flexShrink: 0 }} /> 
          Take all the cups and plates to the kitchen.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', cursor: 'pointer', fontWeight: '500' }}>
          <input type="checkbox" checked={tasks.t2} onChange={() => toggleTask('t2')} style={{ width: '22px', height: '22px', flexShrink: 0 }} /> 
          Throw away any obvious garbage (old wrappers, torn paper).
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', cursor: 'pointer', fontWeight: '500' }}>
          <input type="checkbox" checked={tasks.t3} onChange={() => toggleTask('t3')} style={{ width: '22px', height: '22px', flexShrink: 0 }} /> 
          Stack your books into one neat pile.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '0', cursor: 'pointer', fontWeight: '500' }}>
          <input type="checkbox" checked={tasks.t4} onChange={() => toggleTask('t4')} style={{ width: '22px', height: '22px', flexShrink: 0 }} /> 
          Make your bed.
        </label>
      </div>

      <h3 id="decluttering">3. The 10-Minute Declutter Rule</h3>
      <p>Do not attempt to &quot;deep clean&quot; your entire room when you are already stressed. You will just create a bigger mess and give up. Instead, use the 10-Minute Rule: Set a timer for exactly 10 minutes. Put on your favorite song, and only clean the <em>surface</em> of your desk. When the timer rings, you stop. Momentum is built in small bursts.</p>

      <h3 id="safe-space">4. Creating a Psychological Safe Space</h3>
      <p>Your brain is highly associative. If you study, eat, watch Netflix, and stress-cry all on your bed, your brain doesn&apos;t know what to do when you lie down to sleep. You need to create zones:</p>
      <ul>
        <li><strong>The Sleep Zone:</strong> Your bed is strictly for sleeping. No textbooks allowed.</li>
        <li><strong>The Focus Zone:</strong> A desk or a specific chair where you only do work.</li>
      </ul>

      <h3 id="digital-detox">5. Building a Digital Detox Zone</h3>
      <p>Your physical environment includes the digital devices inside it. A truly calm home environment requires a &quot;No-Phone Zone.&quot; Try leaving your phone in the kitchen or living room while you sleep. Buying a cheap ₹200 digital alarm clock will save you from the toxic habit of doom-scrolling at 2 AM.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Outer order contributes to inner calm.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Track Your Calm Days in Mind Space →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
