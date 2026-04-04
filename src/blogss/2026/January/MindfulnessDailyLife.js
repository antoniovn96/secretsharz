import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Practice Mindfulness in Daily Life (Simple Techniques)",
  excerpt: "You don't have to meditate on a mountain to be mindful. Learn how students can use quick, practical mindfulness techniques to lower anxiety and find calm during a chaotic school day.",
  category: "Wellness",
  date: "24-01-2026",
  readTime: "5 min read",
  wordCount: 840,
  imgUrl: "/blogss/2026/January/mindfulness-daily-life.jpg",
  tldr: "Mindfulness is just paying attention to the present moment without judging it. Use our interactive 5-Senses tool or practice 'mindful walking' to instantly lower your stress hormones.",
  toc: [
    { id: "what-is-it", title: "1. What is Mindfulness (Really)?", level: 3 },
    { id: "interactive-tracker", title: "2. Interactive: The 5-Senses Grounding Tool", level: 3 },
    { id: "techniques", title: "3. Easy Student-Friendly Techniques", level: 3 },
    { id: "benefits", title: "4. The Neurological Benefits", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-24T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function MindfulnessDailyLife({ navigate, relatedPosts }) {
  // Unique Interactivity: 5-Senses Grounding Tracker
  const [step, setStep] = useState(0);

  const sensesSteps = [
    { num: 5, sense: "Things you can SEE", hint: "Look around. A pen, the sky, your shoes..." },
    { num: 4, sense: "Things you can FEEL", hint: "The texture of your shirt, the chair beneath you..." },
    { num: 3, sense: "Things you can HEAR", hint: "A fan, traffic outside, your own breath..." },
    { num: 2, sense: "Things you can SMELL", hint: "Food, perfume, or just the air..." },
    { num: 1, sense: "Thing you can TASTE", hint: "The lingering taste of toothpaste or coffee..." }
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

      <p>When you hear the word &quot;mindfulness,&quot; you probably picture someone sitting cross-legged on a yoga mat with their eyes closed for an hour. Who has time for that when you have three assignments due tomorrow?</p>
      <p>Here is the truth: Mindfulness is not about clearing your mind. It is simply about bringing your attention back to the present moment. And you can do it in 60 seconds.</p>

      <img 
        src="/blogss/mindfulness-daily-life.jpg" 
        alt="Student practicing simple mindfulness techniques" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-is-it">1. What is Mindfulness (Really)?</h3>
      <p>Anxiety lives in the future (worrying about an exam). Depression often lives in the past (regretting a mistake). Peace lives exclusively in the present. Mindfulness is the biological hack to snap your brain out of time-traveling and force it to look at what is happening right in front of you.</p>

      <h3 id="interactive-tracker">2. Interactive: The 5-Senses Grounding Tool</h3>
      <p>When you feel a panic attack or extreme stress building, use the 5-4-3-2-1 method to anchor yourself. Tap through the exercise below right now.</p>

      <div style={{ background: 'var(--sand)', padding: '30px 24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)', textAlign: 'center' }}>
        {step < 5 ? (
          <div style={{ animation: 'fadeIn 0.4s' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--sage)', fontFamily: 'Fraunces', lineHeight: '1', marginBottom: '10px' }}>
              {sensesSteps[step].num}
            </div>
            <h4 style={{ color: 'var(--ink)', marginBottom: '8px', fontSize: '20px' }}>
              {sensesSteps[step].sense}
            </h4>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
              {sensesSteps[step].hint}
            </p>
            <button 
              onClick={() => setStep(step + 1)}
              style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
            >
              Done. Next →
            </button>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌿</div>
            <h4 style={{ color: 'var(--sage)', fontSize: '22px', marginBottom: '10px' }}>You are anchored.</h4>
            <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>Notice how your heart rate has slowed down? You are safe in the present moment.</p>
            <button 
              onClick={() => setStep(0)}
              style={{ background: 'transparent', color: 'var(--muted)', border: '2px solid var(--border)', padding: '10px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Restart Exercise
            </button>
          </div>
        )}
      </div>

      <h3 id="techniques">3. Easy Student-Friendly Techniques</h3>
      <ul>
        <li><strong>Mindful Walking:</strong> When walking between classes, stop looking at your phone. Feel the exact moment your heel strikes the ground. Notice the temperature of the air.</li>
        <li><strong>The Single-Task Rule:</strong> Stop eating while watching YouTube. Stop listening to podcasts while reading. Pick one task and give it 100% of your sensory attention.</li>
      </ul>

      <h3 id="benefits">4. The Neurological Benefits</h3>
      <p>Scientific studies show that practicing just 10 minutes of mindfulness a day shrinks the amygdala (the fear center of your brain) and thickens the prefrontal cortex (the area responsible for focus and decision-making). It is literal strength training for your attention span.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Wherever you are, be totally there.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Access Guided Breathing in Mind Space →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
