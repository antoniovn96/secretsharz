import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../BlogPostTemplate';

export const meta = {
  title: "The Importance of Setting Boundaries for Mental Health",
  excerpt: "Saying 'yes' to everyone means saying 'no' to your own peace. Learn what boundaries actually are, why students need them, and how to use polite scripts to protect your energy.",
  category: "Relationships",
  date: "23-01-2026",
  readTime: "7 min read",
  wordCount: 910,
  imgUrl: "/blogss/mental-health-boundaries.jpg",
  tldr: "A boundary is not a wall to keep people out; it's a door with a lock that you control. Learn the difference between emotional and social boundaries, and how to communicate them without feeling guilty.",
  toc: [
    { id: "what-are-they", title: "1. What Are Boundaries?", level: 3 },
    { id: "types", title: "2. Types of Boundaries (Social & Emotional)", level: 3 },
    { id: "interactive-scripts", title: "3. Interactive: The Boundary Script Builder", level: 3 },
    { id: "saying-no", title: "4. The Guilt of Saying 'No'", level: 3 },
    { id: "examples", title: "5. Real-Life Applications", level: 3 },
  ]
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-01-23T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function MentalHealthBoundaries({ navigate, relatedPosts }) {
  // Unique Interactivity: Boundary Script Builder
  const [activeScript, setActiveScript] = useState(null);

  const scripts = [
    { id: 1, label: "The Exhausting Friend", scenario: "A friend wants to vent, but your emotional battery is at 1%.", script: "I really care about what you're going through, but I am completely drained today and wouldn't be a good listener. Can we talk about this tomorrow?" },
    { id: 2, label: "The Academic Pressure", scenario: "Classmates are obsessively discussing what they studied and causing you panic.", script: "I'm feeling really anxious about the exam right now, so I'm going to step away from discussing the syllabus. Let's talk about something else!" },
    { id: 3, label: "The Personal Time", scenario: "You are asked to join a group study, but you desperately need to rest.", script: "Thanks so much for including me! I really need to recharge by myself tonight, so I'm going to pass this time. Good luck with the studying!" }
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

      <p>If you feel constantly drained, resentful of your friends, or overwhelmed by academic demands, it is highly likely you have a boundary problem. Students are conditioned to be &quot;good&quot;—which usually means being endlessly available and agreeable.</p>
      <p>But you cannot pour from an empty cup. Setting boundaries isn&apos;t selfish; it is basic emotional survival.</p>

      <img 
        src="/blogss/mental-health-boundaries.jpg" 
        alt="Student setting healthy mental health boundaries" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="what-are-they">1. What Are Boundaries?</h3>
      <p>A boundary is simply communicating where you end and another person begins. It is the invisible line that dictates what you are comfortable with and how you expect to be treated. It is not an aggressive wall to keep people out; it is an instruction manual on how to love and interact with you safely.</p>

      <h3 id="types">2. Types of Boundaries</h3>
      <ul>
        <li><strong>Social/Time Boundaries:</strong> Guarding your time. (e.g., &quot;I stop replying to text messages after 10 PM.&quot;)</li>
        <li><strong>Emotional Boundaries:</strong> Guarding your energy. (e.g., &quot;I cannot be the only person you vent to about your problems.&quot;)</li>
      </ul>

      <h3 id="interactive-scripts">3. Interactive: The Boundary Script Builder</h3>
      <p>The hardest part of setting a boundary is finding the words. Tap a scenario below to generate a polite, firm script you can use in real life.</p>

      <div style={{ background: 'var(--sage-pale)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--sage-light)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scripts.map((item) => (
            <div key={item.id}>
              <button 
                onClick={() => setActiveScript(activeScript === item.id ? null : item.id)}
                style={{ width: '100%', textAlign: 'left', padding: '16px', borderRadius: '8px', border: '1.5px solid', borderColor: activeScript === item.id ? 'var(--sage)' : 'var(--border)', background: 'white', color: 'var(--ink)', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{item.label}</span>
                <span style={{ color: 'var(--sage)' }}>{activeScript === item.id ? '▼' : '▶'}</span>
              </button>
              
              {activeScript === item.id && (
                <div style={{ background: 'white', padding: '16px', borderRadius: '0 0 8px 8px', border: '1.5px solid var(--sage)', borderTop: 'none', marginTop: '-4px', animation: 'fadeIn 0.3s' }}>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 8px 0' }}><strong>Scenario:</strong> {item.scenario}</p>
                  <p style={{ fontSize: '15px', color: 'var(--ink)', margin: 0, fontStyle: 'italic', borderLeft: '3px solid var(--sage)', paddingLeft: '12px' }}>
                    &quot;{item.script}&quot;
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <h3 id="saying-no">4. The Guilt of Saying &quot;No&quot;</h3>
      <p>When you start setting boundaries, people who benefited from you having none might get upset. You will feel guilty. <strong>Let the guilt happen.</strong> Guilt does not mean you did something wrong; it just means you are breaking an old, people-pleasing habit. Your peace is worth more than their temporary convenience.</p>

      <h3 id="examples">5. Real-Life Applications</h3>
      <p>Start small. Don&apos;t try to set boundaries with everyone at once. Put your phone on DND while studying. Tell your group project members you will only be working on it until 8 PM. A boundary only works if you enforce it with actions.</p>

      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px' }}>
          &quot;&apos;No&apos; is a complete sentence. It does not require a justification.&quot;
        </h2>
        <button 
          onClick={() => navigate('/mindspace')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Track Your Triggers in Mind Space →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
