import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Let Go of Past Failures and Move Forward",
  excerpt: "Still dwelling on a bad grade or a missed opportunity? Discover why your brain holds onto failure, how to reframe it, and techniques to finally move forward.",
  category: "Mental Health",
  date: "13-01-2026",
  readTime: "6 min read",
  wordCount: 890,
  imgUrl: "/blogss/2026/January/letting-go-failure.jpg",
  tldr: "Failure isn't a reflection of your worth; it's just data. By using emotional release techniques and adopting a growth mindset, you can train your brain to learn from mistakes instead of obsessing over them.",
  toc: [
    { id: "why-hold-on", title: "1. Why We Hold Onto Failure", level: 3 },
    { id: "interactive-reframe", title: "2. Interactive: The Reframe Tool", level: 3 },
    { id: "emotional-release", title: "3. Emotional Release Techniques", level: 3 },
    { id: "growth-mindset", title: "4. Developing a Growth Mindset", level: 3 },
    { id: "faq", title: "5. Dealing with Failure FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-13T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is it so hard to let go of failure?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our brains have a negativity bias, meaning we are evolutionarily wired to remember negative experiences more strongly than positive ones to protect us from future 'danger'." }
    },
    {
      "@type": "Question",
      "name": "How do you bounce back from a bad grade?",
      "acceptedAnswer": { "@type": "Answer", "text": "Separate your self-worth from the result. Analyze what study strategies failed, adjust them, and view the bad grade as helpful feedback rather than a permanent label." }
    }
  ]
};

export default function LettingGoFailure({ navigate, relatedPosts }) {
  // Unique Interactivity: Thought Reframer
  const [activeReframe, setActiveReframe] = useState(null);

  const reframeScenarios = [
    { id: 1, toxic: "I failed my math pre-board. I'm going to ruin my future.", growth: "I failed this test because my revision strategy didn't work. I now know which chapters need more focus." },
    { id: 2, toxic: "Everyone else is figuring it out faster than me.", growth: "Everyone has a different timeline. I am comparing my behind-the-scenes struggles to their public highlight reel." },
    { id: 3, toxic: "I gave the wrong answer in class and everyone thinks I'm stupid.", growth: "People are too worried about their own lives to obsess over my minor mistake. Taking risks is how I learn." }
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
        <meta property="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>Have you ever cringed at a memory of a mistake you made three years ago? Whether it is failing an important exam, embarrassing yourself in front of a crush, or getting rejected from an opportunity, past failures have a sneaky way of haunting our present.</p>

      <img 
        src="/blogss/letting-go-failure.jpg" 
        alt="Student letting go of past failures and embracing a growth mindset" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="why-hold-on">1. Why We Hold Onto Failure</h3>
      <p>You aren&apos;t crazy for dwelling on failure; you are biological. Humans have a <strong>negativity bias</strong>. Thousands of years ago, forgetting where a tiger lived could kill you, but forgetting where a pretty flower grew didn&apos;t matter. Your brain holds onto failures because it thinks it is protecting you from future pain.</p>
      <p>The problem is that a bad grade is not a tiger. Holding onto the shame doesn&apos;t protect you; it just paralyses you.</p>

      <h3 id="interactive-reframe">2. Interactive: The Reframe Tool</h3>
      <p>The fastest way to let go of a failure is to reframe it. Click on the toxic thoughts below to instantly translate them into a Growth Mindset.</p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        {reframeScenarios.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveReframe(activeReframe === item.id ? null : item.id)}
            style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', border: '1.5px solid', borderColor: activeReframe === item.id ? 'var(--sage)' : 'var(--border)', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
          >
            <div style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: activeReframe === item.id ? '10px' : '0' }}>
              ❌ Thought: &quot;{item.toxic}&quot;
            </div>
            {activeReframe === item.id && (
              <div style={{ color: 'var(--success)', fontWeight: '600', padding: '10px', background: 'var(--sage-pale)', borderRadius: '6px', animation: 'fadeIn 0.3s' }}>
                💡 Reframe: &quot;{item.growth}&quot;
              </div>
            )}
            {activeReframe !== item.id && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Tap to reframe 👆</div>}
          </div>
        ))}
      </div>

      <h3 id="emotional-release">3. Emotional Release Techniques</h3>
      <p>You cannot logic your way out of a deep emotional wound. You have to physically release it. When the shame of a past failure hits you, try this:</p>
      <ul>
        <li><strong>The 90-Second Rule:</strong> Neuroscientists found that an emotion chemically flushes through your body in exactly 90 seconds. If you just sit still and breathe through the cringe without fighting it, it will fade in a minute and a half.</li>
        <li><strong>Burn the Draft:</strong> Write down exactly why you feel like a failure on a piece of paper. Don&apos;t hold back. Then, literally tear it up into tiny pieces and throw it away.</li>
      </ul>

      <h3 id="growth-mindset">4. Developing a Growth Mindset</h3>
      <p>A fixed mindset says: <em>&quot;I failed, therefore I am a failure.&quot;</em><br/>
      A growth mindset says: <em>&quot;I failed, therefore I found a strategy that doesn&apos;t work.&quot;</em></p>
      <p>Failure is just data. It is the universe giving you a highly specific piece of feedback on how to adjust your approach for next time.</p>

      <h3 id="faq">5. Dealing with Failure FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if my parents are the ones holding onto my past failures?</strong><br/>
        A: You cannot control their reaction, but you can control your boundary. Gently but firmly say, &quot;I have learned from that mistake and I am focusing on what I can do differently today.&quot;</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Your past mistakes are meant to guide you, not define you.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Reframe Your Thoughts in Mind Space →
        </button>
      </div>
    </BlogPostTemplate>
  );
}
