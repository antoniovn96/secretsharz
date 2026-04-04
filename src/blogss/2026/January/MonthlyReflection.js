import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "End-of-Month Reflection: What Did You Learn About Yourself?",
  excerpt: "January is over. Before you rush into February, take a moment to pause. Learn how to effectively track your growth, extract lessons from your failures, and set your next steps.",
  category: "Personal Growth",
  date: "31-01-2026",
  readTime: "6 min read",
  wordCount: 850,
  imgUrl: "/blogss/2026/January/monthly-reflection-january.jpg",
  tldr: "Don't let the months blur together. End-of-month reflection allows you to close the mental tabs of the past 30 days. Use the 'Rose, Bud, Thorn' method to safely process your wins, challenges, and future hopes.",
  toc: [
    { id: "why-reflect", title: "1. Why End-of-Month Reflection Matters", level: 3 },
    { id: "interactive-reflection", title: "2. Interactive: The Rose, Bud, Thorn Board", level: 3 },
    { id: "lessons", title: "3. Documenting Your Lessons Learned", level: 3 },
    { id: "next-steps", title: "4. Planning Your Next Steps", level: 3 },
    { id: "faq", title: "5. Reflection FAQs", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-31T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is monthly reflection important for students?",
      "acceptedAnswer": { "@type": "Answer", "text": "Students live in a constant state of moving forward to the next assignment or exam. Monthly reflection acts as a pause button, preventing burnout and helping you realize how much you have actually accomplished." }
    },
    {
      "@type": "Question",
      "name": "What is the Rose, Bud, Thorn exercise?",
      "acceptedAnswer": { "@type": "Answer", "text": "It is a simple mindfulness exercise. A 'Rose' is a highlight or success, a 'Thorn' is a challenge or stressor you faced, and a 'Bud' is a new idea or something you are looking forward to." }
    }
  ]
};

export default function MonthlyReflection({ navigate, relatedPosts }) {
  // Unique Interactivity: Rose, Bud, Thorn Generator
  const [rose, setRose] = useState('');
  const [thorn, setThorn] = useState('');
  const [bud, setBud] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    if (rose.trim() && thorn.trim() && bud.trim()) {
      setIsGenerated(true);
    }
  };

  const handleReset = () => {
    setRose('');
    setThorn('');
    setBud('');
    setIsGenerated(false);
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>January is officially over. For many students, the first month of the year feels like it lasted an eternity, yet somehow flew by in a blur of assignments, cold mornings, and broken New Year&apos;s resolutions.</p>
      
      <p>It is incredibly easy to just roll right into February without a second thought. But if you never stop to process the last 30 days, your months will simply blur together into one giant ball of stress. It is time for an <strong>end-of-month reflection</strong>.</p>

      <img 
        src={meta.imgUrl} 
        alt="Student writing an end of month reflection journal" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="why-reflect">1. Why End-of-Month Reflection Matters</h3>
      <p>As a student, you are trained to constantly look forward: the next test, the next semester, the next admission cycle. Your brain rarely gets permission to look back and say, <em>&quot;Wow, I survived that.&quot;</em></p>
      <p>Reflection is how you extract value from your failures. Without reflection, a failed math test is just a source of shame. With reflection, a failed math test becomes data: <em>&quot;I learned that studying at 2 AM doesn&apos;t work for me.&quot;</em> It turns your emotional baggage into wisdom.</p>

      <h3 id="interactive-reflection">2. Interactive: The Rose, Bud, Thorn Board</h3>
      <p>The easiest way to summarize your month is the classic &quot;Rose, Bud, Thorn&quot; mindfulness exercise. Fill out the fields below to generate your personal January 2026 Reflection Card.</p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        {!isGenerated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s' }}>
            
            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>🌹 The Rose (A highlight or win this month)</label>
              <input 
                type="text" 
                placeholder="e.g., I finally understood that chemistry concept..."
                value={rose}
                onChange={(e) => setRose(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border)', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>🌵 The Thorn (A challenge or stressor you faced)</label>
              <input 
                type="text" 
                placeholder="e.g., I struggled to balance sleep and assignments..."
                value={thorn}
                onChange={(e) => setThorn(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border)', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>🌱 The Bud (Something you are looking forward to)</label>
              <input 
                type="text" 
                placeholder="e.g., Trying a new hobby or seeing my friends..."
                value={bud}
                onChange={(e) => setBud(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid var(--border)', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!rose.trim() || !thorn.trim() || !bud.trim()}
              style={{ width: '100%', background: (!rose.trim() || !thorn.trim() || !bud.trim()) ? 'var(--muted)' : 'var(--sage)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: (!rose.trim() || !thorn.trim() || !bud.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '10px' }}
            >
              Generate My Reflection Card ✨
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid var(--sage-light)', boxShadow: 'var(--shadow-md)', animation: 'floatUp 0.4s ease' }}>
            <h4 style={{ textAlign: 'center', fontFamily: 'Fraunces', color: 'var(--ink)', fontSize: '22px', marginBottom: '20px' }}>My January 2026 Summary</h4>
            
            <div style={{ marginBottom: '16px', background: '#FFF0F0', padding: '14px', borderRadius: '8px', borderLeft: '4px solid var(--danger)' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '4px' }}>🌵 What Challenged Me</strong>
              <span style={{ color: 'var(--ink-soft)' }}>&quot;{thorn}&quot;</span>
            </div>

            <div style={{ marginBottom: '16px', background: '#FDF0EA', padding: '14px', borderRadius: '8px', borderLeft: '4px solid var(--peach)' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--peach)', textTransform: 'uppercase', marginBottom: '4px' }}>🌹 What I Am Proud Of</strong>
              <span style={{ color: 'var(--ink-soft)' }}>&quot;{rose}&quot;</span>
            </div>

            <div style={{ marginBottom: '24px', background: 'var(--sage-pale)', padding: '14px', borderRadius: '8px', borderLeft: '4px solid var(--sage)' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--sage)', textTransform: 'uppercase', marginBottom: '4px' }}>🌱 Where I Am Growing</strong>
              <span style={{ color: 'var(--ink-soft)' }}>&quot;{bud}&quot;</span>
            </div>

            <button 
              onClick={handleReset}
              style={{ width: '100%', background: 'transparent', color: 'var(--muted)', border: '2px solid var(--border)', padding: '10px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ← Write Another
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '12px', fontStyle: 'italic' }}>Take a screenshot to save your progress!</p>
          </div>
        )}
      </div>

      <h3 id="lessons">3. Documenting Your Lessons Learned</h3>
      <p>Look closely at your &quot;Thorn&quot; from the exercise above. A bad month is only a waste if you didn&apos;t learn anything from it. Did you burn out because you said &quot;yes&quot; to too many things? Did you feel anxious because you were doom-scrolling before bed? Write down the clear, objective lesson. The pain is temporary; the lesson is permanent.</p>

      <h3 id="next-steps">4. Planning Your Next Steps</h3>
      <p>Now, look at your &quot;Bud.&quot; How can you nurture it in February? Do not set ten massive goals. Pick one small, flexible intention. Instead of <em>&quot;I will study 5 hours a day,&quot;</em> shift to, <em>&quot;I will make sure my phone is in another room when I do my homework.&quot;</em> Close the door on January, and step into February with a lighter backpack.</p>

      <h3 id="faq">5. Reflection FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if I can&apos;t think of a single &quot;Rose&quot; (highlight) for this month?</strong><br/>
        A: When you are exhausted, your brain&apos;s negativity bias blocks out good memories. A &quot;Rose&quot; doesn&apos;t have to be an award or a 100% on a test. Getting out of bed on a day you felt depressed is a massive Rose. Drinking enough water is a Rose. Surviving is a Rose.</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;You cannot connect the dots looking forward; you can only connect them looking backwards.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Start Your February Journal in Mind Space →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
