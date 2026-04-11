import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Why Self-Worth is Important for Mental Health and Confidence",
  excerpt: "Discover why self-worth is the secret engine behind true confidence and mental well-being. Learn the hidden causes of low self-worth and practical strategies to rebuild your baseline.",
  category: "Mental Health",
  date: "05-02-2026",
  readTime: "8 min read",
  wordCount: 1180,
  imgUrl: "/blogss/2026/February/self-worth-importance.jpg",
  tldr: "Self-worth isn't about thinking you're perfect; it's about knowing you have value regardless of your grades, looks, or mistakes. By decoupling your identity from external achievements, you build an unshakable foundation for confidence and mental health.",
  toc: [
    { id: "worth-vs-esteem", title: "1. Self-Worth vs. Self-Esteem: What's the Difference?", level: 3 },
    { id: "causes-of-low-worth", title: "2. The Hidden Causes of Low Self-Worth in Students", level: 3 },
    { id: "interactive-reframe", title: "3. Interactive: The Cognitive Reframe Generator", level: 3 },
    { id: "driving-confidence", title: "4. How Self-Worth Drives Mental Health and Confidence", level: 3 },
    { id: "improvement-strategies", title: "5. Practical Strategies to Rebuild Your Self-Worth", level: 3 },
    { id: "faq", title: "6. Self-Worth FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-05T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is self-worth important for mental health?",
      "acceptedAnswer": { "@type": "Answer", "text": "Self-worth acts as a psychological buffer. When you believe you have inherent value, failures and rejections don't destroy your identity. This drastically reduces chronic anxiety, depression, and the fear of judgment, leading to stable mental health." }
    },
    {
      "@type": "Question",
      "name": "What causes low self-worth in students?",
      "acceptedAnswer": { "@type": "Answer", "text": "Common causes include conditional praise (being praised only for good grades), constant social media comparison, academic pressure, childhood trauma, and repeated peer rejection." }
    },
    {
      "@type": "Question",
      "name": "Does having high self-worth mean I am arrogant?",
      "acceptedAnswer": { "@type": "Answer", "text": "Not at all. Arrogance is believing you are superior to others, which is actually a defense mechanism for low self-worth. True self-worth is recognizing your own value while equally respecting the value of everyone else." }
    }
  ]
};

export default function SelfWorthImportance({ navigate, relatedPosts }) {
  // Unique Interactivity: Cognitive Reframe Generator
  const [activeTrigger, setActiveTrigger] = useState(null);

  const triggers = {
    grades: { icon: "📝", label: "A Bad Grade", advice: "Reframe: 'A grade measures my performance on a specific test on a specific day. It does NOT measure my intelligence, my potential, or my value as a human being.'" },
    social: { icon: "📱", label: "Social Media Comparison", advice: "Reframe: 'I am comparing my behind-the-scenes reality to someone else's curated highlight reel. Curation is not reality. My life does not need to look perfect to be valuable.'" },
    rejection: { icon: "💔", label: "Peer Rejection", advice: "Reframe: 'Someone else's inability to see my value does not decrease my worth. I am not going to be for everyone, and that is completely okay.'" },
    burnout: { icon: "🔋", label: "Feeling Unproductive", advice: "Reframe: 'My worth is not rent I pay through productivity and hustle. I deserve to exist, rest, and be treated with care even when I accomplish absolutely nothing today.'" }
  };

  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>
      
      {/* 🚀 EXPLICIT SOCIAL SHARING & SCHEMA TAGS 🚀 */}
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={meta.imgUrl} />
        <meta property="og:type" content="article" />
        <meta property="twitter:card" content="summary_large_image" />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>We live in a culture that constantly demands we prove our value. As a student, it is incredibly easy to fall into the trap of believing that your worth is a math equation: your grades, plus your social status, minus your mistakes.</p>
      
      <p>But when you tie your identity to external metrics, your mental health becomes a rollercoaster you cannot control. If you get an 'A', you are worthy. If you fail, you are worthless. Breaking this cycle is the most important psychological work you will ever do. Understanding <strong>why self-worth is important for mental health and confidence</strong> is the key to finally stepping off that exhausting ride.</p>

      {/* Optimized Image SEO */}
      <img 
        src={meta.imgUrl} 
        alt="Student building self-worth, mental health confidence, and self-esteem" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="worth-vs-esteem">1. Self-Worth vs. Self-Esteem: What's the Difference?</h3>
      <p>We often use these terms interchangeably, but they are fundamentally different:</p>
      <ul>
        <li><strong>Self-Esteem</strong> is what we think and feel about ourselves based on our traits and abilities. It can fluctuate. If you win a sports match, your self-esteem goes up. If you bomb an interview, it drops.</li>
        <li><strong>Self-Worth</strong> is the deep, internal belief that you are a good person who deserves love, respect, and care <em>simply because you exist</em>. It does not require evidence. It is unconditional.</li>
      </ul>
      <p>You can have high self-esteem about your coding skills but deeply low self-worth as a human being. True mental resilience requires both, but self-worth is the foundational bedrock.</p>

      <h3 id="causes-of-low-worth">2. The Hidden Causes of Low Self-Worth in Students</h3>
      <p>Nobody is born believing they are unworthy. Low self-worth is a learned behavior, typically stemming from:</p>
      <ul>
        <li><strong>Conditional Praise:</strong> Growing up in environments (school or home) where you were only celebrated, noticed, or praised when you achieved something (like top ranks). Your brain learns: "I am only loved when I perform."</li>
        <li><strong>The Comparison Economy:</strong> Social media algorithms are designed to show you people who appear richer, smarter, and happier than you. Chronic comparison slowly chips away at your baseline worth.</li>
        <li><strong>Internalized Criticism:</strong> When teachers, peers, or parents offer harsh, relentless criticism, students eventually internalize that voice. The external bully becomes the inner monologue.</li>
      </ul>

      <h3 id="interactive-reframe">3. Interactive: The Cognitive Reframe Generator</h3>
      <p>Low self-worth often manifests as catastrophic thinking during stressful events. To build confidence, you must learn to intercept these thoughts. <strong>Click on a situation below that is draining your self-worth today to see a healthier cognitive reframe.</strong></p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {Object.keys(triggers).map((key) => (
            <button 
              key={key}
              onClick={() => setActiveTrigger(key)}
              style={{ padding: '16px', borderRadius: '10px', border: '2px solid', borderColor: activeTrigger === key ? 'var(--sage)' : 'transparent', background: activeTrigger === key ? 'var(--sage)' : 'white', color: activeTrigger === key ? 'white' : 'var(--ink)', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}
            >
              <span style={{ fontSize: '24px' }}>{triggers[key].icon}</span>
              <span style={{ fontSize: '15px' }}>{triggers[key].label}</span>
            </button>
          ))}
        </div>

        {activeTrigger ? (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid var(--sage-light)', animation: 'floatUp 0.3s ease', boxShadow: 'var(--shadow-md)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--sage)', fontFamily: 'Fraunces', fontSize: '20px' }}>Shift Your Perspective:</h4>
            <p style={{ margin: '0', fontSize: '16px', color: 'var(--ink-soft)', lineHeight: '1.6', fontStyle: 'italic' }}>
              {triggers[activeTrigger].advice}
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontStyle: 'italic', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            👆 Select a trigger above to generate a protective thought reframe.
          </div>
        )}
      </div>

      <h3 id="driving-confidence">4. How Self-Worth Drives Mental Health and Confidence</h3>
      <p>Confidence is completely misunderstood. Most people think confidence is walking into a room and believing you are better than everyone else. That is arrogance.</p>
      <p>True <strong>mental health confidence</strong> is walking into a room and not having to compare yourself to anyone at all. When your self-worth is intact:</p>
      <ul>
        <li><strong>Anxiety decreases:</strong> Because you are no longer terrified of making a mistake. You know that a failure is just an event, not a reflection of your identity.</li>
        <li><strong>Boundaries become easier:</strong> When you value yourself, you naturally stop allowing people to treat you poorly. People-pleasing fades away.</li>
        <li><strong>Resilience skyrockets:</strong> If someone criticizes you, an internal shield of self-worth absorbs the blow, stopping it from destroying your core identity.</li>
      </ul>

      <h3 id="improvement-strategies">5. Practical Strategies to Rebuild Your Self-Worth</h3>
      <p>Rebuilding your self-worth takes intentional, daily practice. Here are clinical improvement strategies you can start today:</p>
      
      <p><strong>Step 1: Decouple Identity from Output</strong><br />
      Start observing how you talk about yourself. Instead of saying, <em>"I am a failure,"</em> switch to, <em>"I failed that exam."</em> Instead of, <em>"I am awkward,"</em> say, <em>"I felt awkward at that party."</em> Separate who you are from what happened to you.</p>

      <p><strong>Step 2: The "Best Friend" Protocol</strong><br />
      We say things to ourselves that we would never say to someone we love. The next time you make a mistake, imagine your best friend just made the exact same mistake. What would you say to them? Now, say that to yourself. Radical self-compassion is a requirement for high self-worth.</p>

      <p><strong>Step 3: Define Your Inherent Values</strong><br />
      Write down three things you value about yourself that have absolutely nothing to do with school, money, or looks. Are you deeply empathetic? Are you a loyal friend? Are you endlessly curious? Ground your worth in your character, not your trophies.</p>

      <h3 id="faq">6. Self-Worth FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Will having high self-worth make me lazy? If I accept myself, why would I try to improve?</strong><br/>
        A: This is a huge myth! Acceptance and ambition are not opposites. You can deeply love and accept yourself exactly as you are, while still wanting to learn, grow, and achieve. In fact, research shows that self-compassionate students bounce back from academic failures faster than self-critical ones.</p>

        <p><strong>Q: I feel so behind everyone else. How do I maintain self-worth?</strong><br/>
        A: Remember that the "timeline" of life is an illusion. Your worth is not tied to hitting milestones by a certain age. Focus on your own growth trajectory, mute accounts that trigger comparison, and celebrate your micro-wins.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Your worth is not a bill you pay through productivity and perfection. It is a fundamental human right."
        </h2>
        <p style={{ marginBottom: '24px', color: 'var(--ink-soft)' }}>Stop waiting until you achieve the next big goal to feel proud of yourself. You are worthy of your own care, right now.</p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/mindspace')}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
          >
            Practice Self-Compassion in Mind Space →
          </button>
          <button 
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Thoughts on the Wall
          </button>
        </div>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Deepen Your Mental Health Journey:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Set Boundaries Without Feeling Guilty (Student Guide)</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/self-care-plan')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Creating a Personal Self-Care Plan That Works for You</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
