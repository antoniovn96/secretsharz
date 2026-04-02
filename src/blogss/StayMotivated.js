import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "How to Stay Motivated Without Burning Out",
  excerpt: "Relying on motivation is a trap. Learn the vital difference between motivation and discipline, how to spot burnout, and strategies for healthy, sustainable productivity.",
  category: "Productivity",
  date: "21-01-2026",
  readTime: "6 min read",
  wordCount: 910,
  imgUrl: "/blogss/stay-motivated-no-burnout.jpg",
  tldr: "Motivation is an emotion; it fades. Discipline is an action; it stays. You avoid burnout by lowering your daily expectations to 'minimum baselines' and prioritizing rest as a productive strategy.",
  toc: [
    { id: "motivation-vs-discipline", title: "1. The Motivation Trap", level: 3 },
    { id: "interactive-converter", title: "2. Interactive: The Discipline Converter", level: 3 },
    { id: "burnout-signs", title: "3. Warning Signs of Burnout", level: 3 },
    { id: "balance", title: "4. The 'Minimum Baseline' Strategy", level: 3 },
    { id: "faq", title: "5. Productivity FAQs", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-21T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function StayMotivated({ navigate, relatedPosts }) {
  // Unique Interactivity: Motivation to Discipline Converter
  const [converted, setConverted] = useState({ c1: false, c2: false, c3: false });

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

      <p>Have you ever watched a motivational YouTube video at 11 PM, promised yourself you would change your entire life tomorrow, and then completely given up by 2 PM the next day? You are not lazy. You just fell into the motivation trap.</p>

      <img 
        src="/blogss/stay-motivated-no-burnout.jpg" 
        alt="Student maintaining healthy productivity and staying motivated" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="motivation-vs-discipline">1. The Motivation Trap</h3>
      <p>Motivation is an emotion. Like happiness or anger, it is biologically designed to be temporary. If you only study or work out when you &quot;feel motivated,&quot; you will be wildly inconsistent.</p>
      <p><strong>Discipline is an action.</strong> Discipline is what makes you brush your teeth every morning even when you aren&apos;t &quot;motivated&quot; to do it. It is just what you do. To succeed without burning out, you must convert emotional motivation into boring, automated discipline.</p>

      <h3 id="interactive-converter">2. Interactive: The Discipline Converter</h3>
      <p>When you feel unmotivated, your brain feeds you excuses. Tap the toxic &quot;motivation thoughts&quot; below to convert them into &quot;discipline actions.&quot;</p>

      <div style={{ background: 'var(--sage-pale)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--sage-light)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div onClick={() => setConverted({...converted, c1: true})} style={{ background: converted.c1 ? 'var(--sage)' : 'white', color: converted.c1 ? 'white' : 'var(--ink)', padding: '16px', borderRadius: '8px', cursor: converted.c1 ? 'default' : 'pointer', border: '1px solid var(--border)', transition: 'all 0.4s', boxShadow: 'var(--shadow-sm)' }}>
            {converted.c1 ? "✅ Discipline: I will set a timer for 5 minutes and just read the first paragraph. If I want to quit after 5 minutes, I can." : "🥱 Motivation: 'I don't feel like studying for 3 hours today. I'll just do it tomorrow.' (Tap to convert)"}
          </div>

          <div onClick={() => setConverted({...converted, c2: true})} style={{ background: converted.c2 ? 'var(--sage)' : 'white', color: converted.c2 ? 'white' : 'var(--ink)', padding: '16px', borderRadius: '8px', cursor: converted.c2 ? 'default' : 'pointer', border: '1px solid var(--border)', transition: 'all 0.4s', boxShadow: 'var(--shadow-sm)' }}>
            {converted.c2 ? "✅ Discipline: Missing one day is human. I forgive myself. I will resume my routine tomorrow. I will not miss twice." : "🥱 Motivation: 'I missed my workout yesterday, so the whole week is ruined. I give up.' (Tap to convert)"}
          </div>

          <div onClick={() => setConverted({...converted, c3: true})} style={{ background: converted.c3 ? 'var(--sage)' : 'white', color: converted.c3 ? 'white' : 'var(--ink)', padding: '16px', borderRadius: '8px', cursor: converted.c3 ? 'default' : 'pointer', border: '1px solid var(--border)', transition: 'all 0.4s', boxShadow: 'var(--shadow-sm)' }}>
            {converted.c3 ? "✅ Discipline: Rest is a requirement, not a reward. Taking tonight off will make me 2x faster tomorrow." : "🥱 Motivation: 'If I take a break tonight, I am lazy and will fail my exams.' (Tap to convert)"}
          </div>
        </div>
      </div>

      <h3 id="burnout-signs">3. Warning Signs of Burnout</h3>
      <p>Hustle culture tells you to push through the pain. Biology tells you that if you do, your body will shut down. You are burning out if:</p>
      <ul>
        <li>You feel physically exhausted even after sleeping 8 hours.</li>
        <li>Things you used to love doing now feel like a massive chore.</li>
        <li>Your brain feels &quot;foggy&quot; and you have to read the same paragraph 4 times to understand it.</li>
      </ul>

      <h3 id="balance">4. The &quot;Minimum Baseline&quot; Strategy</h3>
      <p>The ultimate anti-burnout strategy is the Minimum Baseline. Instead of setting a goal to &quot;study 4 hours a day,&quot; set a goal to &quot;open the textbook for 10 minutes a day.&quot; On good days, you will study for hours. On days when you are exhausted, sad, or sick, you will just do the 10 minutes. You keep the promise to yourself, you don&apos;t break the habit streak, and you avoid the guilt spiral.</p>

      <h3 id="faq">5. Productivity FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is it normal to completely lose motivation halfway through the year?</strong><br/>
        A: It is 100% normal. We are not machines. Energy moves in cycles. When motivation drops, lean on your minimum baselines until your energy returns.</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Consistency beats intensity every single time.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Build Healthy Habits in Mind Space →
        </button>
      </div>
    </BlogPostTemplate>
  );
}
