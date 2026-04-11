import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Set Boundaries Without Feeling Guilty (Student Guide)",
  excerpt: "Learning how to set boundaries is the ultimate student survival skill. Discover practical scripts to say no, real-life scenarios, and why protecting your energy is essential for your mental health.",
  category: "Mental Health",
  date: "04-02-2026",
  readTime: "7 min read",
  wordCount: 1150,
  imgUrl: "/blogss/2026/February/setting-boundaries-guide.jpg",
  tldr: "Setting boundaries doesn't make you a bad friend; it makes you a healthy human. Learn the psychology behind people-pleasing, use our script generator to say no gracefully, and understand why the initial guilt is actually a sign of growth.",
  toc: [
    { id: "what-are-boundaries", title: "1. What Are Boundaries (And Why Do Students Need Them?)", level: 3 },
    { id: "the-guilt-trap", title: "2. The Guilt Trap: Why Saying No Feels So Bad", level: 3 },
    { id: "interactive-scripts", title: "3. Interactive: The 'How to Say No' Script Generator", level: 3 },
    { id: "real-life-scenarios", title: "4. Real-Life Scenarios: Setting Boundaries in Action", level: 3 },
    { id: "handling-pushback", title: "5. How to Handle the Pushback (The Extinction Burst)", level: 3 },
    { id: "faq", title: "6. Boundary Setting FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-04T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How to set boundaries with friends as a student?",
      "acceptedAnswer": { "@type": "Answer", "text": "Set boundaries with friends by being clear, kind, and direct. Use 'I' statements. For example, instead of saying 'You always distract me,' say 'I need to focus on studying tonight, so I'll be turning my phone off until tomorrow.'" }
    },
    {
      "@type": "Question",
      "name": "Why do I feel guilty when I say no?",
      "acceptedAnswer": { "@type": "Answer", "text": "Guilt happens because you are breaking a habit of people-pleasing. Your brain confuses 'disappointing someone' with 'doing something wrong.' Remember that guilt is just a feeling of discomfort, not a sign that you made the wrong choice." }
    },
    {
      "@type": "Question",
      "name": "What is an emotional boundary?",
      "acceptedAnswer": { "@type": "Answer", "text": "An emotional boundary is recognizing that you are not responsible for fixing other people's feelings. It means listening to a friend vent without absorbing their anxiety as your own, and knowing when to step back if a conversation becomes too heavy." }
    }
  ]
};

export default function SettingBoundariesGuide({ navigate, relatedPosts }) {
  // Unique Interactivity: "How to Say No" Script Generator
  const [activeScenario, setActiveScenario] = useState(null);

  const scenarios = {
    freeloader: { icon: "📝", label: "The Group Project Slacker", advice: "Script: 'Hey, I’ve completed my half of the presentation. I won't be able to do the remaining slides, so please make sure your section is uploaded by 8 PM tonight so we don't lose points.' (Clear, firm, outcome-focused)." },
    texter: { icon: "📱", label: "The 2 AM Panic Texter", advice: "Script: 'I can see you're super stressed about the exam, but I need to sleep now so my brain functions tomorrow. Let's quickly review the formulas together in the cafeteria tomorrow morning. Goodnight!' (Validates them, protects your sleep)." },
    family: { icon: "🏠", label: "Demanding Family Time", advice: "Script: 'I really want to spend time with everyone, but I have a massive deadline this week. I need to stay in my room and study for the next two hours, but I'll join you for dinner right after.' (Offers an alternative time)." },
    venting: { icon: "🗣️", label: "The Constant Complainer", advice: "Script: 'I really value our friendship, but I don't have the emotional bandwidth to talk about this drama right now. Can we talk about something lighter today, or catch up later in the week?' (Honest about your emotional capacity)." }
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
        
        {/* Injecting Schema Markup invisibly into the page */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <p>As a student, your time and energy are your most valuable resources, yet they are constantly under attack. Between group projects where you do all the work, friends treating you like a 24/7 therapist, and family members demanding your attention during exam season, you are likely exhausted.</p>
      
      <p>You say "yes" to keep the peace. You say "sure, no problem" to avoid being called a bad friend. But internally, your resentment is building, and your mental health is tanking. If this sounds familiar, it is time to learn <strong>how to set boundaries</strong>.</p>

      {/* Optimized Image SEO */}
      <img 
        src={meta.imgUrl} 
        alt="Student learning how to set boundaries and say no without feeling guilty" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-are-boundaries">1. What Are Boundaries (And Why Do Students Need Them?)</h3>
      <p>A boundary is simply a property line for your life. It communicates to others: <em>"Here is where I end, and you begin. Here is what is acceptable, and here is what is not."</em></p>
      <p>For students, boundaries usually fall into three categories:</p>
      <ul>
        <li><strong>Time Boundaries:</strong> Guarding your study hours and sleep schedule. (e.g., "I don't reply to school-related texts after 10 PM.")</li>
        <li><strong>Emotional Boundaries:</strong> Protecting your mental bandwidth. (e.g., Not absorbing your friend's anxiety about a test as your own.)</li>
        <li><strong>Academic Boundaries:</strong> Refusing to let others take credit for your hard work or copy your assignments.</li>
      </ul>
      <p>Without boundaries, you will inevitably burn out. You cannot pour from an empty cup, and you certainly cannot ace your finals with one.</p>

      <h3 id="the-guilt-trap">2. The Guilt Trap: Why Saying No Feels So Bad</h3>
      <p>The number one reason students avoid setting boundaries is guilt. When you finally tell a friend you can't proofread their essay because you need to sleep, a voice in your head screams: <em>"You are selfish. You are a bad friend."</em></p>
      <p>Here is the psychological truth: <strong>Guilt is not a sign that you did something wrong.</strong> Guilt is simply your brain reacting to breaking an old habit. If your habit is people-pleasing, setting a boundary will feel incredibly uncomfortable at first. You are retraining your brain to understand that disappointing someone else is a survivable event, but abandoning yourself is not.</p>
      <p>Remember: You are not responsible for other people's emotional reactions to your healthy boundaries.</p>

      <h3 id="interactive-scripts">3. Interactive: The "How to Say No" Script Generator</h3>
      <p>The hardest part of boundary-setting is finding the right words in the heat of the moment. We've created clinical scripts for the most common student dilemmas. <strong>Click a scenario below to get your exact response script.</strong></p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {Object.keys(scenarios).map((key) => (
            <button 
              key={key}
              onClick={() => setActiveScenario(key)}
              style={{ padding: '16px', borderRadius: '10px', border: '2px solid', borderColor: activeScenario === key ? 'var(--sage)' : 'transparent', background: activeScenario === key ? 'var(--sage)' : 'white', color: activeScenario === key ? 'white' : 'var(--ink)', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}
            >
              <span style={{ fontSize: '24px' }}>{scenarios[key].icon}</span>
              <span style={{ fontSize: '15px' }}>{scenarios[key].label}</span>
            </button>
          ))}
        </div>

        {activeScenario ? (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid var(--sage-light)', animation: 'floatUp 0.3s ease', boxShadow: 'var(--shadow-md)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--sage)', fontFamily: 'Fraunces', fontSize: '20px' }}>Use this script:</h4>
            <p style={{ margin: '0', fontSize: '16px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
              {scenarios[activeScenario].advice}
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontStyle: 'italic', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            👆 Select a tough situation above to get your copy-paste boundary script.
          </div>
        )}
      </div>

      <h3 id="real-life-scenarios">4. Real-Life Scenarios: Setting Boundaries in Action</h3>
      <p>Let's look at how the "Acknowledge + Boundary + Alternative" formula works in the wild.</p>
      
      <p><strong>The Scenario:</strong> Your friend calls you in tears about drama in their friend group. You have a massive physics exam tomorrow and are already running on fumes.</p>
      <p><strong>The Bad Response (No Boundary):</strong> You stay on the phone for two hours, fail your exam the next day, and silently resent your friend.</p>
      <p><strong>The Aggressive Response (Wall, not a Boundary):</strong> "I don't care about your drama, I have an exam. Stop bothering me."</p>
      <p><strong>The Healthy Boundary:</strong> "I am so sorry you are dealing with this right now, and I really want to be there for you <em>(Acknowledge)</em>. However, my brain is completely fried studying for physics and I can't give you the attention you deserve tonight <em>(Boundary)</em>. Can we call right after my exam tomorrow at 2 PM? <em>(Alternative)</em>."</p>

      <h3 id="handling-pushback">5. How to Handle the Pushback (The Extinction Burst)</h3>
      <p>When you start setting boundaries, people will test them. In psychology, this is called an <strong>Extinction Burst</strong>. When a behavior that used to work (guilt-tripping you into doing their work) suddenly stops working, the person will temporarily escalate their behavior to force you to revert to your old ways.</p>
      <p>They might say: <em>"You've changed,"</em> or <em>"You're being selfish."</em></p>
      <p>When this happens, do not argue. Do not over-explain. Simply hold the line. A boundary without enforcement is just a suggestion. Repeat your boundary calmly like a broken record. Eventually, the people around you will adapt to the new, healthier version of you—and those who refuse to adapt were benefiting from your lack of boundaries in the first place.</p>

      <h3 id="faq">6. Boundary Setting FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if they get mad at me?</strong><br/>
        A: They are allowed to be mad. You cannot control their reaction; you can only control your delivery. Disappointment is a normal human emotion, and they will survive it.</p>

        <p><strong>Q: Is it rude to leave text messages unread while I study?</strong><br/>
        A: Absolutely not. You are not a 24/7 customer service hotline. Your phone exists for your convenience, not everyone else's instant access. Turn on "Do Not Disturb" and reclaim your focus.</p>

        <p><strong>Q: How do I set boundaries with Indian parents?</strong><br/>
        A: This is historically tricky due to cultural dynamics. Start small. Instead of declaring grand boundaries, negotiate time. "Ma, I want to help with the chores, but if I do them now, my study flow breaks. Can I promise to do them at 6 PM instead?" Frame the boundary as a tool that helps you succeed academically.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Daring to set boundaries is about having the courage to love ourselves, even when we risk disappointing others."
        </h2>
        <p style={{ marginBottom: '24px', color: 'var(--ink-soft)' }}>Your energy is a VIP lounge, not a public park. Start treating it like one.</p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/mindspace')}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
          >
            Practice Boundary Setting in Mind Space →
          </button>
          <button 
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Vent Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Deepen Your Mental Health Journey:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/self-care-plan')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Creating a Personal Self-Care Plan That Works for You</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mental-health-goals')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Goal Setting for Mental Health: How to Set Intentions</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
