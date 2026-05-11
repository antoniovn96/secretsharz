import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Stop Comparing Yourself to Others in 2026",
  excerpt: "Comparison is the thief of joy. Understand how social media warps reality, why your brain obsessively compares your grades to your peers, and how to finally break the cycle.",
  category: "Digital Wellbeing",
  date: "18-01-2026",
  readTime: "7 min read",
  wordCount: 910,
  imgUrl: "/blogss/2026/January/stop-comparing-yourself.jpg",
  tldr: "You are comparing your messy, behind-the-scenes reality to everyone else's curated highlight reel. Stop trying to 'beat' others; focus entirely on being 1% better than who you were yesterday.",
  toc: [
    { id: "social-comparison", title: "1. The Psychology of Social Comparison", level: 3 },
    { id: "interactive-reality", title: "2. Interactive: Highlight Reel vs. Reality", level: 3 },
    { id: "social-media", title: "3. The Social Media Mirage", level: 3 },
    { id: "strategies", title: "4. Strategies to Shift Your Focus", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-18T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function StopComparing({ navigate, relatedPosts }) {
  // Unique Interactivity: Highlight Reel vs Reality
  const [activeReveal, setActiveReveal] = useState(null);

  const posts = [
    { id: 1, highlight: "🎓 'Got a 98% on my Pre-Boards! Effort pays off!'", reality: "I sacrificed 3 weeks of sleep, had two panic attacks, and my relationship with my parents is severely strained right now." },
    { id: 2, highlight: "👯‍♀️ 'Best night ever with my squad! #Blessed'", reality: "I felt left out for half the night, forced myself to smile for the photo, and went home early feeling exhausted and lonely." },
    { id: 3, highlight: "💼 'Secured an amazing summer internship!'", reality: "I got rejected from 15 other places before getting this one. I still feel like an imposter who doesn't deserve it." }
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
      </Head>

      <p>It usually happens late at night. You are scrolling through Instagram, or perhaps looking at a class WhatsApp group, and suddenly your stomach drops. You see someone who is your exact age doing something amazing—getting top marks, winning an award, or having a perfect social life. Suddenly, your own life feels inadequate.</p>
      
      <p>President Theodore Roosevelt famously said, <em>&quot;Comparison is the thief of joy.&quot;</em> Here is how to stop letting it rob you of yours in 2026.</p>

      <img 
        src="/blogss/stop-comparing-yourself.jpg" 
        alt="Student learning how to stop comparing themselves to others on social media" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="social-comparison">1. The Psychology of Social Comparison</h3>
      <p>Your brain is wired to figure out where you stand in the social hierarchy. It is a survival instinct. However, our ancestors only had to compare themselves to the 50 people in their village. Today, because of the internet, you are forcing your brain to compete with the top 1% of the entire world. It is a game you are biologically destined to lose.</p>

      <h3 id="interactive-reality">2. Interactive: Highlight Reel vs. Reality</h3>
      <p>We forget that social media is highly curated. Tap on the "perfect" social media updates below to reveal the messy, human reality behind the screen.</p>

      <div style={{ background: 'var(--lav-pale)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ marginBottom: '16px' }}>
            <div 
              style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1.5px solid var(--lavender)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => setActiveReveal(activeReveal === post.id ? null : post.id)}
            >
              <span style={{ fontWeight: '600', color: 'var(--ink)' }}>{post.highlight}</span>
              <span style={{ fontSize: '12px', color: 'var(--lavender)', fontWeight: 'bold', background: 'rgba(124,111,160,0.1)', padding: '4px 10px', borderRadius: '50px' }}>
                {activeReveal === post.id ? 'Hide' : 'Reveal Reality'}
              </span>
            </div>
            
            {activeReveal === post.id && (
              <div style={{ background: '#1E2820', color: 'white', padding: '16px', borderRadius: '8px', marginTop: '8px', animation: 'fadeIn 0.3s', fontSize: '15px' }}>
                <strong>The Reality:</strong> {post.reality}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 id="social-media">3. The Social Media Mirage</h3>
      <p>You are comparing your unedited, messy, behind-the-scenes life to everyone else's heavily edited, filtered highlight reel. When you realize that the people making you feel insecure are probably deeply insecure themselves, the illusion shatters.</p>

      <h3 id="strategies">4. Strategies to Shift Your Focus</h3>
      <ul>
        <li><strong>Compare Down, Not Up:</strong> If you must compare, look at how far you have come. Compare yourself to the version of you from three years ago. You have survived every bad day and learned so much.</li>
        <li><strong>Mute Triggering Accounts:</strong> You do not owe anyone your mental peace. If an influencer, or even a friend, consistently posts things that trigger your anxiety or inadequacy, use the mute button. They won't know, and your brain will thank you.</li>
        <li><strong>Focus on Your Lane:</strong> A flower does not think of competing with the flower next to it. It just blooms. Redirect your energy away from monitoring what others are doing, and pour that energy into your own growth.</li>
      </ul>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;The only person you should try to be better than, is the person you were yesterday.&quot;
        </h2>
        <button 
          onClick={() => navigate('/wall')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Read the Truth on the Sharz Wall →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/negative-self-talk')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Deal with Negative Self-Talk in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/digital-detox')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Digital Detox: How Reducing Screen Time Improves Mental Health</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/build-confidence')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Build Confidence Through Self-Awareness</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
