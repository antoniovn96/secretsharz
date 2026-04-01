import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "5 Simple Habits to Improve Your Mental Health in 2026",
  excerpt: "Overhauling your life is exhausting. Learn how 5 tiny, simple habits—like fixing your sleep and screen time—can completely transform your mental health this year.",
  category: "Wellness",
  date: "05-01-2026",
  readTime: "5 min read",
  wordCount: 820,
  imgUrl: "/blogss/mental-health-habits-2026.jpg",
  tldr: "You don't need a massive life overhaul. Focus on 5 micro-habits: 8 hours of sleep, drinking water, 5 minutes of journaling, balancing screen time, and radical consistency.",
  toc: [
    { id: "big-changes", title: "1. Why Small Habits Beat Big Changes", level: 3 },
    { id: "habits", title: "2. The 5 Essential Mental Health Habits", level: 3 },
    { id: "quiz", title: "3. Interactive Check: Habit Audit", level: 3 },
    { id: "consistency", title: "4. How to Stay Consistent", level: 3 },
    { id: "faq", title: "5. Habit Building FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-05T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to form a mental health habit?",
      "acceptedAnswer": { "@type": "Answer", "text": "Science shows it takes anywhere from 18 to 254 days to form a new habit, with an average of 66 days. Consistency matters more than speed." }
    },
    {
      "@type": "Question",
      "name": "What is the best habit for student mental health?",
      "acceptedAnswer": { "@type": "Answer", "text": "Protecting your sleep. Sleep deprivation mimics the symptoms of clinical anxiety and depression in teenagers. Getting 8 hours is the foundation of all mental health." }
    }
  ]
};

export default function MentalHealthHabits({ navigate, relatedPosts }) {
  const [quizAnswers, setQuizAnswers] = useState({ q1: false, q2: false, q3: false });
  const [showTips, setShowTips] = useState(false);

  const yesCount = Object.values(quizAnswers).filter(Boolean).length;
  const progressPercent = Math.round((yesCount / 3) * 100);

  const handleQuizToggle = (q) => {
    setQuizAnswers(prev => ({ ...prev, [q]: !prev[q] }));
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

      <p>When students want to improve their mental health, they usually try to change everything at once. They promise to wake up at 5 AM, study for 6 hours, eat perfectly, and meditate daily. By January 4th, they are burnt out.</p>
      
      <p>The secret to <strong>student mental health in 2026</strong> isn&apos;t a massive life overhaul. It is the ruthless application of tiny, boring, beautiful habits.</p>

      <img 
        src="/blogss/mental-health-habits-2026.jpg" 
        alt="5 simple habits to improve mental health for students in 2026" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="big-changes">1. Why Small Habits Beat Big Changes</h3>
      <p>Your brain resists massive changes because they require too much cognitive energy. A &quot;micro-habit&quot; sneaks past your brain&apos;s defense system. Drinking one glass of water when you wake up is a micro-habit. Over time, these tiny actions compound into a radically different baseline of mental health.</p>

      <h3 id="habits">2. The 5 Essential Mental Health Habits</h3>
      <ul>
        <li><strong>1. Sleep:</strong> Sleep deprivation mimics clinical anxiety. Prioritize 8 hours. It is the cheapest, most effective therapy on the planet.</li>
        <li><strong>2. Hydration:</strong> Your brain is 73% water. Even 2% dehydration impairs focus, mood, and memory. Keep a bottle on your desk.</li>
        <li><strong>3. The 5-Minute Journal:</strong> Get the junk out of your head. Write down whatever is bothering you before you sleep so your brain doesn&apos;t have to process it at 2 AM.</li>
        <li><strong>4. Screen Time Boundaries:</strong> You don&apos;t have to quit Instagram. Just delay it. Don&apos;t look at your phone for the first 30 minutes after waking up.</li>
        <li><strong>5. Movement:</strong> You don&apos;t need a gym. A 15-minute walk while listening to music flushes cortisol out of your nervous system.</li>
      </ul>

      <h3 id="quiz">3. Interactive Check: Habit Audit</h3>
      <p>Which of these foundation habits are you currently neglecting?</p>
      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '30px', background: 'white' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q1} onChange={() => handleQuizToggle('q1')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I regularly sleep less than 6 hours a night.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q2} onChange={() => handleQuizToggle('q2')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I look at my phone within 5 minutes of waking up.
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer', lineHeight: '1.4' }}>
          <input type="checkbox" checked={quizAnswers.q3} onChange={() => handleQuizToggle('q3')} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} /> 
          I rarely drink plain water during the school day.
        </label>
        
        <div style={{ background: 'var(--sage-pale)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--sage)', transition: 'width 0.3s ease' }}></div>
        </div>
        
        {yesCount >= 2 ? (
          <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>⚠️ You checked {yesCount} boxes. Your physical habits are making your mental health harder to manage. Start small.</p>
        ) : (
          <p style={{ color: 'var(--sage)', fontWeight: 'bold', margin: 0, fontSize: '15px' }}>🌱 You checked {yesCount} boxes. You have a solid baseline! Keep it up.</p>
        )}
      </div>

      <h3 id="consistency">4. How to Stay Consistent</h3>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={() => setShowTips(!showTips)}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          {showTips ? 'Hide Consistency Rules ↑' : 'Tap to reveal the Consistency Rules ↓'}
        </button>
      </div>

      {showTips && (
        <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', animation: 'fadeIn 0.3s ease', marginBottom: '30px', borderLeft: '4px solid var(--sage)' }}>
          <ul>
            <li style={{ marginBottom: '10px' }}><strong>The Two-Day Rule:</strong> Never skip a habit two days in a row. Missing one day is a mistake. Missing two days is the start of a new (bad) habit.</li>
            <li style={{ marginBottom: '10px' }}><strong>Habit Stacking:</strong> Tie a new habit to an old one. (e.g., &quot;I will write in my journal <em>immediately after</em> I brush my teeth at night.&quot;)</li>
            <li><strong>Lower the Bar:</strong> If your goal is to walk for 30 minutes, but it&apos;s raining, just walk around your room for 5 minutes. Keep the promise to yourself, even if the effort is tiny.</li>
          </ul>
        </div>
      )}

      <h3 id="faq">5. Habit Building FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if I lose my motivation?</strong><br/>
        A: Motivation is a feeling. Habits are actions. You don&apos;t brush your teeth because you feel highly motivated to do so; you do it because it&apos;s just what you do. Aim for discipline, not motivation.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;You do not rise to the level of your goals. You fall to the level of your systems.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Track Your Habits in Mind Space →
        </button>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Read More from Secret Sharz:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/new-year-reset')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ New Year Mental Reset: How to Start 2026 with a Clear Mind</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mental-health-goals')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Goal Setting that Doesn't Cause Burnout</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
