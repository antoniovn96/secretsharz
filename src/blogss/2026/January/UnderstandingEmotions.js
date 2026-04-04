import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Understanding Your Emotions: A Beginner's Guide for Students",
  excerpt: "Saying 'I feel bad' doesn't help you fix the problem. Learn how to accurately identify, name, and process your complex emotions to drastically reduce your daily anxiety.",
  category: "Mental Health",
  date: "17-01-2026",
  readTime: "7 min read",
  wordCount: 940,
  imgUrl: "/blogss/2026/January/understanding-emotions.jpg",
  tldr: "You cannot manage an emotion you cannot name. By expanding your emotional vocabulary beyond 'mad, sad, and glad,' you strip intense feelings of their power and gain control over your reactions.",
  toc: [
    { id: "types", title: "1. Why 'Fine' and 'Bad' Are Dangerous Words", level: 3 },
    { id: "interactive-decoder", title: "2. Interactive: The Emotion Decoder", level: 3 },
    { id: "name-it", title: "3. 'Name It to Tame It'", level: 3 },
    { id: "tracking", title: "4. The Power of Emotional Tracking", level: 3 },
    { id: "faq", title: "5. Emotion Processing FAQs", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-17T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function UnderstandingEmotions({ navigate, relatedPosts }) {
  // Unique Interactivity: Emotion Decoder
  const [selectedBase, setSelectedBase] = useState(null);

  const emotionMap = {
    anger: { emoji: "😡", label: "Anger", deeper: ["Betrayed", "Disrespected", "Frustrated", "Powerless"] },
    sadness: { emoji: "😢", label: "Sadness", deeper: ["Lonely", "Disappointed", "Grieving", "Inadequate"] },
    fear: { emoji: "😨", label: "Fear / Anxiety", deeper: ["Overwhelmed", "Insecure", "Rejected", "Out of Control"] },
    tired: { emoji: "😮‍💨", label: "Tired", deeper: ["Burnt Out", "Apathetic", "Bored", "Unmotivated"] }
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

      <p>When someone asks you how your day was, what do you usually say? If you are like most students, you probably default to &quot;Fine,&quot; &quot;Okay,&quot; or &quot;Bad.&quot;</p>
      
      <p>The problem is that &quot;bad&quot; is not an emotion. It is a blanket statement that hides what is actually going on. If you don&apos;t know what is truly bothering you, you have zero power to fix it.</p>

      <img 
        src="/blogss/understanding-emotions.jpg" 
        alt="Student learning emotional intelligence and understanding feelings" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="types">1. Why &quot;Fine&quot; and &quot;Bad&quot; Are Dangerous Words</h3>
      <p>Imagine going to a doctor and just saying, &quot;My body feels bad.&quot; The doctor can&apos;t help you until they know if it is a headache, a broken bone, or a stomach bug. Your mental health works the exact same way.</p>
      <p>Emotional literacy is the ability to specifically identify what you are feeling. Are you &quot;angry&quot; that your friend cancelled plans, or are you actually feeling <em>disrespected</em> and <em>lonely</em>? The cure for anger is different from the cure for loneliness.</p>

      <h3 id="interactive-decoder">2. Interactive: The Emotion Decoder</h3>
      <p>Often, basic emotions are just masks for deeper, more vulnerable feelings. Click on a basic emotion below to &quot;decode&quot; what might actually be hiding underneath it.</p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {Object.entries(emotionMap).map(([key, data]) => (
            <button 
              key={key}
              onClick={() => setSelectedBase(key)}
              style={{ padding: '12px', borderRadius: '8px', border: '2px solid', borderColor: selectedBase === key ? 'var(--sage)' : 'var(--border)', background: selectedBase === key ? 'var(--sage-pale)' : 'white', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', color: 'var(--ink)', transition: 'all 0.2s' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{data.emoji}</div>
              {data.label}
            </button>
          ))}
        </div>

        {selectedBase ? (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid var(--sage-light)', animation: 'fadeIn 0.3s' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--sage)' }}>What you might actually be feeling:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {emotionMap[selectedBase].deeper.map((deepFeeling, i) => (
                <span key={i} style={{ background: 'var(--sage-pale)', color: 'var(--ink)', padding: '6px 14px', borderRadius: '50px', fontSize: '14px', fontWeight: '600' }}>
                  {deepFeeling}
                </span>
              ))}
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
              Once you name the specific feeling, the intensity of the emotion drops.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontStyle: 'italic' }}>
            👆 Tap an emotion above to decode it.
          </div>
        )}
      </div>

      <h3 id="name-it">3. &quot;Name It to Tame It&quot;</h3>
      <p>Psychiatrist Dr. Dan Siegel coined the phrase &quot;Name it to tame it.&quot; When you experience an intense emotion, your amygdala (the survival brain) is firing rapidly. The moment you search for a precise word to describe the feeling, you activate your prefrontal cortex (the logic brain). This chemical shift immediately calms your nervous system down.</p>

      <h3 id="tracking">4. The Power of Emotional Tracking</h3>
      <p>You can&apos;t fix a pattern you don&apos;t see. Tracking your emotions daily helps you realize that your &quot;random bad moods&quot; aren&apos;t random at all. You might notice you always feel &quot;inadequate&quot; after scrolling through Instagram, or &quot;overwhelmed&quot; specifically on Tuesday evenings before math class. Data gives you power.</p>

      <h3 id="faq">5. Emotion Processing FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is it okay to just distract myself from bad feelings?</strong><br/>
        A: Distraction is fine for temporary relief, but if you constantly suppress an emotion, your brain stores it as tension in your body. It will eventually explode as a panic attack or burnout. Feel it so you can heal it.</p>
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;Emotions are tunnels. You have to go all the way through the darkness to get to the light at the end.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Track Your Mood in Mind Space →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
