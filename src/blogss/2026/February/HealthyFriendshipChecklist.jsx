import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Weekly Relationship Check: Are Your Friendships Healthy?",
  excerpt: "Not all friendships are built to last, and that's okay. Use this healthy friendships checklist to evaluate your circle, recognize red flags, and build connections that actually support your mental health.",
  category: "Relationships",
  date: "07-02-2026",
  readTime: "7 min read",
  wordCount: 1100,
  imgUrl: "/blogss/2026/February/relationship-checklist.jpg",
  tldr: "Your mental health is heavily influenced by the people you spend the most time with. Use our interactive checklist to audit your friendships, learn to spot energy vampires, and understand the difference between a low-maintenance friend and a toxic one.",
  toc: [
    { id: "why-audit-friendships", title: "1. Why You Need a Friendship Audit", level: 3 },
    { id: "interactive-checklist", title: "2. Interactive: The Healthy Friendships Checklist", level: 3 },
    { id: "red-flags", title: "3. Red Flags: Spotting the Energy Vampires", level: 3 },
    { id: "green-flags", title: "4. Green Flags: What a Safe Friendship Looks Like", level: 3 },
    { id: "outgrowing-friends", title: "5. The Reality of Outgrowing People", level: 3 },
    { id: "faq", title: "6. Friendship FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-07T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I know if a friendship is toxic?",
      "acceptedAnswer": { "@type": "Answer", "text": "A toxic friendship consistently leaves you feeling drained, insecure, or anxious. If you find yourself hiding good news because they get jealous, or walking on eggshells to avoid their anger, the friendship is not healthy." }
    },
    {
      "@type": "Question",
      "name": "Is it normal to lose friends in college?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, it is completely normal. College is a time of massive personal growth. As your values, goals, and interests evolve, you will naturally outgrow friendships that were built purely on geographical proximity in high school." }
    },
    {
      "@type": "Question",
      "name": "What is a low-maintenance friendship?",
      "acceptedAnswer": { "@type": "Answer", "text": "A low-maintenance friendship is a healthy dynamic where both people understand that life gets busy. You don't have to text every day to prove your loyalty, and when you do reconnect, there is no guilt or resentment about the time that passed." }
    }
  ]
};

export default function HealthyFriendshipChecklist({ navigate, relatedPosts }) {
  // Unique Interactivity: Friendship Checklist Calculator
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 'q1', text: "Do I feel energized (rather than exhausted) after hanging out with them?" },
    { id: 'q2', text: "Can I share my successes without them making a sarcastic or jealous comment?" },
    { id: 'q3', text: "When I say 'no' to hanging out because I need to study or sleep, do they respect it without guilt-tripping me?" },
    { id: 'q4', text: "Do they apologize and change their behavior when they hurt my feelings?" },
    { id: 'q5', text: "Is the effort balanced? (I am not always the one initiating plans or doing the emotional heavy lifting)." }
  ];

  const handleAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach(val => {
      if (val === 'yes') total += 1;
    });
    setScore(total);
    setSubmitted(true);
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

      <p>We talk a lot about toxic romantic relationships, but we rarely talk about toxic friendships. As a student, your friend group is your primary support system. They are the people you vent to after a brutal exam, the ones you eat lunch with, and the ones who shape your daily reality.</p>
      
      <p>But what happens when the group chat starts giving you anxiety? What happens when you realize you are walking on eggshells around someone you call your "best friend"? Doing a weekly relationship check using a <strong>healthy friendships checklist</strong> is one of the most powerful ways to protect your mental health.</p>

      {/* Optimized Image SEO */}
      <img 
        src={meta.imgUrl} 
        alt="Student evaluating their social circle using a healthy friendships checklist" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h3 id="why-audit-friendships">1. Why You Need a Friendship Audit</h3>
      <p>You audit your study schedule, your finances, and your screen time. Why wouldn't you audit the people who consume the majority of your emotional bandwidth?</p>
      <p>Many students hold onto friendships out of pure nostalgia or convenience. You might think, <em>"We've been friends since 8th grade, I can't cut them off now,"</em> even if hanging out with them currently leaves you feeling drained, insecure, or constantly criticized. An audit isn't about being ruthless; it's about being honest about where your energy is going.</p>

      <h3 id="interactive-checklist">2. Interactive: The Healthy Friendships Checklist</h3>
      <p>Think about a specific friend or friend group that has been stressing you out lately. Answer the 5 questions below honestly to evaluate the health of that dynamic.</p>

      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '14px', marginBottom: '30px', border: '1px solid var(--border)' }}>
        {!submitted ? (
          <div>
            {questions.map((q) => (
              <div key={q.id} style={{ marginBottom: '20px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: 'var(--ink)' }}>{q.text}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleAnswer(q.id, 'yes')}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid var(--sage)', background: answers[q.id] === 'yes' ? 'var(--sage)' : 'transparent', color: answers[q.id] === 'yes' ? 'white' : 'var(--sage)', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => handleAnswer(q.id, 'no')}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid #C0392B', background: answers[q.id] === 'no' ? '#C0392B' : 'transparent', color: answers[q.id] === 'no' ? 'white' : '#C0392B', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={calculateScore}
              disabled={Object.keys(answers).length < 5}
              style={{ width: '100%', padding: '16px', background: Object.keys(answers).length < 5 ? '#ccc' : 'var(--ink)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: Object.keys(answers).length < 5 ? 'not-allowed' : 'pointer', transition: '0.2s' }}
            >
              See My Results
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '32px 24px', borderRadius: '12px', border: '2px solid var(--sage-light)', textAlign: 'center', animation: 'floatUp 0.3s ease', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{score >= 4 ? '🌱' : score >= 2 ? '⚠️' : '🛑'}</div>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--ink)', fontFamily: 'Fraunces', fontSize: '24px' }}>
              Your Score: {score}/5 Green Flags
            </h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '16px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
              {score >= 4 
                ? "This sounds like a highly supportive, safe friendship. Make sure to nurture it and reciprocate the good energy!" 
                : score >= 2 
                ? "There is friction here. The dynamic might not be toxic, but you need to have a serious conversation about boundaries and mutual respect." 
                : "Red Alert. This relationship is actively draining your mental health. It is okay to distance yourself to protect your peace."}
            </p>
            <button 
              onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }}
              style={{ background: 'transparent', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '10px 24px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Test another friendship ↺
            </button>
          </div>
        )}
      </div>

      <h3 id="red-flags">3. Red Flags: Spotting the Energy Vampires</h3>
      <p>Sometimes, toxicity isn't loud. It isn't screaming matches in the cafeteria. Often, it's quiet, draining behavior from "energy vampires." Look out for these subtle red flags:</p>
      <ul>
        <li><strong>The Crisis Creator:</strong> They only text you when their life is falling apart. They treat you like an unpaid therapist, but when <em>you</em> are having a bad day, they suddenly disappear or change the subject back to themselves.</li>
        <li><strong>The Sarcastic Saboteur:</strong> Whenever you achieve something (a good grade, a new opportunity), they offer "compliments" wrapped in sarcasm or immediately try to one-up you. <em>"Wow, I can't believe you got an A, the paper must have been graded easily."</em></li>
        <li><strong>The Guilt Tripper:</strong> They make you feel like a terrible person for prioritizing your studies, your family, or your sleep over hanging out with them.</li>
      </ul>

      <h3 id="green-flags">4. Green Flags: What a Safe Friendship Looks Like</h3>
      <p>If you've been in toxic dynamics for a long time, you might not even know what a healthy friendship feels like. A truly safe connection involves:</p>
      <ul>
        <li><strong>Low-Maintenance Loyalty:</strong> You don't have to text every single day to prove your friendship. When exam season hits, they say, <em>"Good luck, talk to you when it's over,"</em> without taking your absence personally.</li>
        <li><strong>Cheerleading:</strong> They say your name in rooms full of opportunities. They are genuinely, loudly proud of your successes.</li>
        <li><strong>Safe Corrections:</strong> When you mess up, they tell you privately and kindly, rather than embarrassing you in front of the group.</li>
      </ul>

      <h3 id="outgrowing-friends">5. The Reality of Outgrowing People</h3>
      <p>This is the hardest truth of student life: You are going to outgrow people. And that does not make them villains, and it does not make you a bad person.</p>
      <p>Many friendships are formed purely based on proximity—you sat next to each other in 9th-grade math. As you move through high school and college, your values, your ambition, and your worldview will drastically shift. If a friendship requires you to shrink yourself, hide your goals, or pretend to be someone you aren't just to "fit in," it is time to let it go. Grieve the loss, but do not cling to a connection that no longer serves you.</p>

      <h3 id="faq">6. Friendship FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is it okay to "ghost" a toxic friend?</strong><br/>
        A: If the person is physically or emotionally abusive, prioritizing your safety is paramount, and cutting contact is valid. However, if you simply outgrew them, a slow fade (being busy, responding less) or a kind but brief conversation is usually healthier and provides closure.</p>

        <p><strong>Q: What if I have no friends after I cut off the toxic ones?</strong><br/>
        A: Being alone is temporarily uncomfortable, but being surrounded by people who make you feel terrible is deeply damaging. Use the space to figure out who you actually are, and you will eventually attract people who align with your authentic self.</p>
      </div>

      {/* 📢 CALL TO ACTION & SHAREABLE QUOTE */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Surround yourself with people who talk about visions and ideas, not other people."
        </h2>
        <p style={{ marginBottom: '24px', color: 'var(--ink-soft)' }}>Your social circle is your psychological diet. Make sure you aren't feeding your brain junk food.</p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/mindspace')}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
          >
            Reflect in Mind Space →
          </button>
          <button 
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Discuss Friendships on the Wall
          </button>
        </div>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Deepen Your Mental Health Journey:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/stop-seeking-validation')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Stop Seeking Validation from Others</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Set Boundaries Without Feeling Guilty</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
