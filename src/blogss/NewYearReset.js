import React, { useEffect } from 'react';
import Head from 'next/head';

export const meta = {
  title: "New Year Mental Reset: How to Start 2026 with a Clear Mind",
  excerpt: "Feeling overwhelmed by the pressure of the new year? Learn how to let go of 2025's emotional baggage, set realistic intentions, and start fresh.",
  category: "Self-Care",
  date: "01-01-2026",
  readTime: "5 min read",
  imgUrl: "/blogss/mental-reset-new-year-2026.jpg"
};

export default function NewYearReset({ navigate }) {
  
  // Scrolls to the top of the page when the component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page" style={{ padding: '0', background: 'white' }}>
      
      {/* 🚀 SEO METADATA INJECTION 🚀 */}
      {/* This is what Google, WhatsApp, and Twitter will read when you share the link */}
      <Head>
        <title>New Year Mental Reset: How to Start 2026 with a Clear Mind | Secret Sharz</title>
        <meta name="description" content="Learn the importance of a mental reset, how to let go of past emotional baggage, set realistic intentions, and a simple routine to start 2026 with a clear mind." />
        <meta property="og:title" content="New Year Mental Reset: How to Start 2026 with a Clear Mind" />
        <meta property="og:description" content="Feeling overwhelmed by the pressure of the new year? Learn how to let go of 2025's emotional baggage and start fresh." />
        {/* Your specific image path is added here for social media previews */}
        <meta property="og:image" content="/blogss/mental-reset-new-year-2026.jpg" />
        <meta property="og:type" content="article" />
      </Head>

      <div className="post-view">
        <button className="back-to-blog" onClick={() => navigate('/blog')}>
          ← Back to all articles
        </button>
        
        <div className="post-content">
          <span className="blog-tag">Self-Care</span>
          <h1 style={{ letterSpacing: '-1.5px' }}>New Year Mental Reset: How to Start 2026 with a Clear Mind</h1>
          
          <div className="post-full-meta">
            <span>📅 01-01-2026</span>
            <span>⏱️ 5 min read</span>
          </div>
          
          {/* Your specific image path is used here */}
          <img 
            src="/blogss/mental-reset-new-year-2026.jpg" 
            alt="Student writing in a journal for a mental reset" 
            className="post-hero-img" 
          />
          
          <div className="post-body">
            <p>The clock strikes midnight, the calendar flips to 2026, and suddenly, you are expected to become a completely new person. The pressure to set massive goals, wake up at 5 AM, and completely transform your life can actually cause more anxiety than motivation.</p>
            
            <p>Before you write down a single resolution, you need a <strong>mental reset</strong>. Think of your brain like a smartphone that has had 100 tabs open for the last 365 days. A mental reset is simply turning the phone off and on again. Here is how to clear your mind and start 2026 on your own terms.</p>

            <h3>1. The Importance of a Mental Reset</h3>
            <p>When we rush into the new year without pausing, we carry our old stress into our new goals. A mental reset creates a buffer zone between the chaos of last year and the possibilities of this one. It lowers cortisol (the stress hormone), reduces burnout, and gives you the clarity to figure out what <em>you</em> actually want—not just what your parents or teachers expect from you.</p>

            <h3>2. Letting Go of Past Emotional Baggage</h3>
            <p>You cannot fill a cup that is already overflowing. To make space for 2026, we have to forgive 2025. Did you score lower than expected on your pre-boards? Did a close friendship fade away? Did you struggle with anxiety more than usual?</p>
            <ul>
              <li><strong>Acknowledge it:</strong> Write down three things that hurt you last year on a piece of paper.</li>
              <li><strong>Release it:</strong> Literally tear the paper up. Give yourself permission to leave those specific worries in December. They do not get to walk into January with you.</li>
            </ul>

            <h3>3. Setting Realistic Intentions</h3>
            <p>Resolutions fail because they are rigid. If your resolution is &quot;I will study 6 hours every single day,&quot; failing on January 3rd makes you want to quit entirely. Instead, set <strong>Intentions</strong>.</p>
            <p>Intentions are flexible directions. Instead of strict rules, try: <em>&quot;My intention for 2026 is to be kinder to myself when I make a mistake,&quot;</em> or <em>&quot;My intention is to ask for help when I feel overwhelmed.&quot;</em> Intentions allow for human error; resolutions do not.</p>

            <h3>4. Your Simple Reset Routine</h3>
            <p>If you have 15 minutes today, try this simple routine to officially hit the reset button:</p>
            <ul>
              <li><strong>The Brain Dump (5 mins):</strong> Write down every single thought, worry, or to-do list item bouncing around your head. Get it out of your brain and onto paper.</li>
              <li><strong>Digital Detox (5 mins):</strong> Put your phone in another room. Sit in silence. Don&apos;t look at how other people are celebrating the new year.</li>
              <li><strong>Hydrate &amp; Breathe (3 mins):</strong> Drink a full glass of water. Take 5 deep breaths (inhale for 4 seconds, exhale for 6).</li>
              <li><strong>One Positive Anchor (2 mins):</strong> Write down one thing you are genuinely looking forward to this year.</li>
            </ul>

            <p style={{ marginTop: '30px', fontStyle: 'italic', color: 'var(--sage)' }}>
              Remember, January 1st is just another day. You are allowed to heal and grow at your own pace. If you ever feel the pressure getting too heavy this year, the <strong>Secret Sharz Wall</strong> and our anonymous counsellors are always here for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
