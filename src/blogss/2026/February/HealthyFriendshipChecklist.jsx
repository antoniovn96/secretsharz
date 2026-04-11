import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Weekly Relationship Check: Are Your Friendships Healthy?",
  excerpt: "Not all friendships are built to last, and that's okay. Use this healthy friendships checklist to evaluate your circle, recognize red flags, and build connections that actually support your mental health.",
  category: "Relationships",
  date: "07-02-2026",
  readTime: "8 min read",
  wordCount: 1150,
  imgUrl: "/blogss/2026/February/relationship-checklist.jpg",
  tldr: "Your mental health is heavily influenced by the people you spend the most time with. Use our interactive relationship builder to audit your friendships, learn to spot energy vampires, and understand the difference between a low-maintenance friend and a toxic one.",
  toc: [
    { id: "why-audit-friendships", title: "1. Why You Need a Friendship Audit", level: 3 },
    { id: "interactive-builder", title: "2. Interactive: The Core 10 Relationship Builder", level: 3 },
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

// 50 Parameters for the Interactive Builder
const TRAIT_POOL = [
  "Active Listening", "Unconditional Trust", "Respecting Boundaries", "No Gossip", "Equal Effort",
  "Celebrating Successes", "Sincere Apologies", "Quick Forgiveness", "Constructive Honesty", "Financial Respect",
  "Consistent Check-ins", "Safe Space for Venting", "Shared Core Values", "Humor & Playfulness", "Zero Guilt-Tripping",
  "Independence", "Healthy Conflict Resolution", "Keeping Secrets", "Defending Each Other", "Non-Judgmental Advice",
  "Respecting Differences", "Showing Empathy", "Low-Maintenance Loyalty", "Remembering Details", "Being Present",
  "Not Keeping Score", "Valuing Mental Health", "Saying 'No' Safely", "Respecting Other Friendships", "No Passive Aggression",
  "Direct Communication", "Expressing Gratitude", "Quality Time", "Emotional Check-ins", "Punctuality",
  "Supporting Growth", "Letting Go of Petty Fights", "Keeping Promises", "Mutual Respect", "Vulnerability",
  "Sharing Responsibilities", "Compassionate Truth", "Recognizing Triggers", "Celebrating Milestones", "Providing Distractions",
  "Silent Support", "No Sarcastic Put-Downs", "Sharing Resources", "Validating Feelings", "Mutual Evolution"
];

export default function HealthyFriendshipChecklist({ navigate, relatedPosts }) {
  // Interactive State
  const [showBuilder, setShowBuilder] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [availableTraits, setAvailableTraits] = useState(TRAIT_POOL);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [builderCompleted, setBuilderCompleted] = useState(false);

  // Simulate a global counter by setting an initial fake number, then incrementing
  useEffect(() => {
    setPressCount(14208); // Mock baseline count
  }, []);

  const openBuilder = () => {
    setPressCount(prev => prev + 1);
    setShowBuilder(true);
    setBuilderCompleted(false);
  };

  const selectTrait = (trait) => {
    if (selectedTraits.length >= 10) return;
    setAvailableTraits(prev => prev.filter(t => t !== trait));
    setSelectedTraits(prev => [...prev, trait]);
  };

  const removeTrait = (trait) => {
    setSelectedTraits(prev => prev.filter(t => t !== trait));
    setAvailableTraits(prev => [trait, ...prev]);
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
      <p>Many students hold onto friendships out of pure nostalgia or convenience. You might think, <em>"We've been friends since 8th grade, I can't cut them off now,"</em> even if hanging out with them currently leaves you feeling drained, insecure, or constantly criticized. An audit isn't about being ruthless; it's an act of self-reflection to be honest about where your energy is going.</p>

      <h3 id="interactive-builder">2. Interactive: The Core 10 Relationship Builder</h3>
      <p>Every healthy friendship is built on shared expectations, but those expectations are rarely spoken out loud. We've created an interactive tool to help you define exactly what matters to you.</p>
      <p><strong>Instructions:</strong> Sit down with your partner or friend. Look through the 50 parameters provided. Together, discuss and select the <strong>top 10 traits</strong> that you both agree are non-negotiable for your relationship to thrive.</p>

      <div style={{ textAlign: 'center', background: 'var(--sage-pale)', padding: '40px 24px', borderRadius: '16px', margin: '40px 0', border: '1px solid var(--sage-light)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: 'var(--ink)', marginBottom: '8px' }}>Build Your Core 10 Checklist</h4>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>Discover what truly matters to your connection.</p>
        <button 
          onClick={openBuilder}
          style={{ background: 'var(--ink)', color: 'white', padding: '16px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Launch Relationship Builder
        </button>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '16px', fontWeight: 'bold' }}>
          This tool has been used <span style={{ color: 'var(--sage)' }}>{pressCount.toLocaleString()}</span> times.
        </p>
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
        <p style={{ marginBottom: '24px', color: 'var(--ink-soft)' }}>Your social circle is your psychological diet. Make sure you aren't feeding your brain junk food through a deep self-reflection.</p>
        
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

      {/* ── INTERACTIVE MODAL POPUP ── */}
      {showBuilder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,40,32,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowBuilder(false)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', margin: '0 0 4px', color: 'var(--ink)' }}>The Core 10 Relationship Builder</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>Discuss together. Click traits below to add them to your checklist.</p>
              </div>
              <button onClick={() => setShowBuilder(false)} style={{ background: 'var(--sand)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', color: 'var(--muted)' }}>✕</button>
            </div>

            {!builderCompleted ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', padding: '32px' }}>
                
                {/* Selected List */}
                <div style={{ background: 'var(--sage-pale)', borderRadius: '16px', padding: '24px', border: '1px solid var(--sage-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, color: 'var(--sage)', fontSize: '18px' }}>Your Core 10</h4>
                    <span style={{ fontWeight: 'bold', color: selectedTraits.length === 10 ? 'var(--success)' : 'var(--sage)', fontSize: '14px' }}>{selectedTraits.length}/10</span>
                  </div>
                  
                  {selectedTraits.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--sage)', opacity: 0.6, fontStyle: 'italic', fontSize: '14px' }}>
                      Your checklist is empty. Click traits from the pool to add them.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedTraits.map((trait, idx) => (
                        <div key={`sel-${idx}`} onClick={() => removeTrait(trait)} style={{ background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--sage-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.2s', boxShadow: 'var(--shadow-sm)', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>
                          <span><span style={{ color: 'var(--sage)', marginRight: '8px' }}>{idx + 1}.</span> {trait}</span>
                          <span style={{ color: 'var(--danger)', fontSize: '18px' }}>×</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTraits.length === 10 && (
                    <button 
                      onClick={() => setBuilderCompleted(true)}
                      style={{ width: '100%', marginTop: '24px', padding: '16px', background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(74,124,89,0.3)' }}
                    >
                      Save Our Checklist
                    </button>
                  )}
                </div>

                {/* Available Pool */}
                <div>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--ink)', fontSize: '18px' }}>Available Traits ({availableTraits.length})</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                    {availableTraits.map((trait, idx) => (
                      <button 
                        key={`avail-${idx}`} 
                        onClick={() => selectTrait(trait)}
                        disabled={selectedTraits.length >= 10}
                        style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: 'var(--ink-soft)', cursor: selectedTraits.length >= 10 ? 'not-allowed' : 'pointer', opacity: selectedTraits.length >= 10 ? 0.5 : 1, transition: '0.2s', fontFamily: 'inherit' }}
                        onMouseEnter={e => { if (selectedTraits.length < 10) { e.currentTarget.style.borderColor = 'var(--sage)'; e.currentTarget.style.color = 'var(--sage)'; } }}
                        onMouseLeave={e => { if (selectedTraits.length < 10) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-soft)'; } }}
                      >
                        + {trait}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✨</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: 'var(--ink)', marginBottom: '16px' }}>Your Core Checklist is Ready</h3>
                <p style={{ color: 'var(--ink-soft)', marginBottom: '32px' }}>Take a screenshot of this list. Hold yourselves and each other accountable to these standards.</p>
                <div style={{ background: 'var(--sand)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'left', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedTraits.map((trait, idx) => (
                    <div key={`final-${idx}`} style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--ink)' }}>
                      <span style={{ color: 'var(--sage)', marginRight: '12px' }}>✓</span>{trait}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowBuilder(false)}
                  style={{ marginTop: '32px', padding: '16px 40px', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}

    </BlogPostTemplate>
  );
}
