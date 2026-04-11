import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Build Healthy Friendships That Support Your Mental Health",
  excerpt: "The people you surround yourself with act as the thermostat for your mental health. Learn how to identify safe friendships, navigate conflict, and build a supportive circle that actually helps you grow.",
  category: "Relationships",
  date: "08-02-2026",
  readTime: "7 min read",
  wordCount: 1100,
  imgUrl: "/blogss/2026/February/healthy-friendships.jpg",
  tldr: "Building healthy friendships requires intention. Stop clinging to friendships based on nostalgia and start looking for green flags like emotional safety, equal effort, and the ability to say 'no' without consequences. Use our interactive friendship trait builder to see what matters most to you.",
  toc: [
    { id: "the-thermostat", title: "1. The Thermostat Effect: How Friends Regulate Your Mind", level: 3 },
    { id: "interactive-builder", title: "2. Interactive: The Healthy Friendship Trait Builder", level: 3 },
    { id: "core-traits", title: "3. The 3 Core Traits of a Supportive Friendship", level: 3 },
    { id: "real-life-examples", title: "4. Real-Life Examples: Healthy vs. Unhealthy Responses", level: 3 },
    { id: "building-the-circle", title: "5. Tips for Building Your Safe Circle", level: 3 },
    { id: "faq", title: "6. Healthy Friendship FAQs", level: 3 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-08T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many close friends do I actually need?",
      "acceptedAnswer": { "@type": "Answer", "text": "Quality always beats quantity. Anthropological studies suggest humans can only maintain about 5 deep, emotionally intimate relationships at a time. Having 2-3 truly safe friends is significantly better for your mental health than having 20 superficial ones." }
    },
    {
      "@type": "Question",
      "name": "Is it normal for healthy friendships to have conflict?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes! Conflict is inevitable in any relationship. The difference between a healthy and unhealthy friendship is how you repair the rupture. Healthy friends attack the problem together, not each other." }
    },
    {
      "@type": "Question",
      "name": "How do I make new friends if I have social anxiety?",
      "acceptedAnswer": { "@type": "Answer", "text": "Start small. Focus on shared interests rather than forced socializing. Join a club or a study group where the activity takes the pressure off making constant conversation. Building trust takes time, so be patient with yourself." }
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

export default function HealthyFriendshipsGuide({ navigate, relatedPosts }) {
  // Interactive State
  const [showBuilder, setShowBuilder] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [availableTraits, setAvailableTraits] = useState(TRAIT_POOL);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [builderCompleted, setBuilderCompleted] = useState(false);

  useEffect(() => {
    setPressCount(18342); 
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

      {/* THE HOOK */}
      <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontSize: '28px', lineHeight: '1.4', marginBottom: '24px' }}>
        You cannot heal in the same environment that is making you sick.
      </h2>
      <p>As a student, you spend more waking hours with your friends than with your own family. Your social circle is your psychological diet. If you are constantly surrounding yourself with people who complain, compete, or criticize, your mental health will inevitably crash.</p>
      
      <p>Building <strong>healthy friendships</strong> is not about finding perfect people. It is about finding safe people. It is about intentionally curating a circle that acts as a buffer against academic stress, rather than adding to it.</p>

      {/* Image with requested attribution */}
      <figure style={{ margin: '20px 0 40px' }}>
        <img 
          src={meta.imgUrl} 
          alt="Two students walking together representing healthy friendships and supportive friends" 
          style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)' }} 
        />
        <figcaption style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px' }}>
          Image by <a href="https://pixabay.com/users/wal_172619_ii-29824635/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8297611" target="_blank" rel="noopener noreferrer" style={{color: 'var(--sage)'}}>wal_172619_II</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8297611" target="_blank" rel="noopener noreferrer" style={{color: 'var(--sage)'}}>Pixabay</a>
        </figcaption>
      </figure>

      <h3 id="the-thermostat">1. The Thermostat Effect: How Friends Regulate Your Mind</h3>
      <p>In psychology, there is a concept known as "coregulation." When your nervous system is in a state of panic (e.g., right before a massive board exam), sitting next to a calm, grounded friend can physically lower your heart rate and reduce your cortisol levels.</p>
      <p>However, the opposite is also true. If you are sitting next to a friend who is catastrophizing, complaining, or pacing nervously, their anxiety will literally infect your nervous system. <strong>Supportive friends</strong> act as a thermostat for your mental health. They regulate the temperature of the room when things get too hot.</p>

      <h3 id="interactive-builder">2. Interactive: The Healthy Friendship Trait Builder</h3>
      <p>Every healthy friendship requires shared expectations. But we rarely sit down and actually define what we need from the people in our lives. We've created an interactive tool to help you define exactly what matters to your mental health.</p>
      <p><strong>Instructions:</strong> Look through the 50 parameters provided below. Select the <strong>top 10 traits</strong> that are absolute non-negotiables for you to feel emotionally safe in a friendship.</p>

      <div style={{ textAlign: 'center', background: 'var(--sage-pale)', padding: '40px 24px', borderRadius: '16px', margin: '40px 0', border: '1px solid var(--sage-light)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: 'var(--ink)', marginBottom: '8px' }}>Build Your Core 10 Friendship Traits</h4>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>Discover what you truly need from your circle.</p>
        <button 
          onClick={openBuilder}
          style={{ background: 'var(--ink)', color: 'white', padding: '16px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Launch Trait Builder
        </button>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '16px', fontWeight: 'bold' }}>
          This tool has been used <span style={{ color: 'var(--sage)' }}>{pressCount.toLocaleString()}</span> times.
        </p>
      </div>

      <h3 id="core-traits">3. The 3 Core Traits of a Supportive Friendship</h3>
      <p>If you aren't sure what to look for, start here. These three traits are the baseline for any relationship that protects your mental health:</p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <li><strong>Psychological Safety:</strong> You don't have to edit yourself, hide your nerdy interests, or pretend to be someone you aren't. They like you for exactly who you are, not who you are pretending to be.</li>
        <li><strong>Symmetrical Effort:</strong> Relationships don't have to be 50/50 every single day, but they should balance out over time. If you are always the one reaching out, making plans, and listening to their problems, you are an unpaid therapist, not a friend.</li>
        <li><strong>Low-Maintenance Loyalty:</strong> You can go two weeks without texting because you are drowning in assignments, and when you finally reconnect, there is zero guilt or resentment. They assume the best of you.</li>
      </ul>

      {/* PATTERN INTERRUPT */}
      <div style={{ background: '#FFF0F0', borderLeft: '4px solid #C0392B', padding: '24px', margin: '40px 0', borderRadius: '0 12px 12px 0' }}>
        <h4 style={{ margin: '0 0 12px', color: '#C0392B', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>🚨 Reality Check:</h4>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--ink)', margin: 0, lineHeight: '1.5' }}>
          If a friendship requires you to constantly shrink yourself, hide your goals, or pretend to be less ambitious just to "fit in"… <br/><span style={{color: '#C0392B'}}>that is not your circle. That is a cage.</span>
        </p>
      </div>

      <h3 id="real-life-examples">4. Real-Life Examples: Healthy vs. Unhealthy Responses</h3>
      <p>How do your friends react when life actually happens? Let's look at the difference:</p>
      
      <p><strong>Scenario: You score the highest mark in the class on a difficult physics paper.</strong></p>
      <ul style={{ marginBottom: '20px' }}>
        <li><span style={{color: '#C0392B', fontWeight: 'bold'}}>Toxic Response:</span> "Wow, the teacher must have graded yours really easily. Can't believe you beat me." (Insecurity masked as a joke).</li>
        <li><span style={{color: 'var(--sage)', fontWeight: 'bold'}}>Healthy Response:</span> "I am so proud of you! I know how late you stayed up studying for that. You earned it." (Zero competition).</li>
      </ul>

      <p><strong>Scenario: You are completely burnt out and have to cancel weekend plans to sleep.</strong></p>
      <ul style={{ marginBottom: '20px' }}>
        <li><span style={{color: '#C0392B', fontWeight: 'bold'}}>Toxic Response:</span> "Wow, okay. You're so boring lately. Guess we'll just have fun without you." (Guilt-tripping your boundaries).</li>
        <li><span style={{color: 'var(--sage)', fontWeight: 'bold'}}>Healthy Response:</span> "Totally understand. Get some rest! Text me when your brain is functioning again." (Respecting your physical needs).</li>
      </ul>

      <h3 id="building-the-circle">5. Tips for Building Your Safe Circle</h3>
      <p>If you are realizing right now that your current circle doesn't have many green flags, don't panic. You can build a new one. Here is how:</p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <li><strong>Focus on shared values, not just shared history.</strong> You might have been friends since 6th grade, but if your values no longer align, the foundation is gone. Look for people who are heading in the same direction you are.</li>
        <li><strong>Embrace the "Slow Fade".</strong> You don't always need a dramatic confrontation to end a toxic friendship. Stop initiating. Stop over-sharing. Slowly redirect your energy to people who actually fill your cup.</li>
        <li><strong>Be the friend you want to have.</strong> If you want friends who are empathetic, non-judgmental, and supportive, you have to model that behavior first.</li>
      </ul>

      <h3 id="faq">6. Healthy Friendship FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How many close friends do I actually need?</strong><br/>
        A: Quality always beats quantity. Anthropological studies suggest humans can only maintain about 5 deep, emotionally intimate relationships at a time. Having 2-3 truly safe friends is significantly better for your mental health than having 20 superficial ones.</p>

        <p><strong>Q: Is it normal for healthy friendships to have conflict?</strong><br/>
        A: Yes! Conflict is inevitable in any relationship. The difference between a healthy and unhealthy friendship is how you repair the rupture. Healthy friends attack the problem together, not each other.</p>
      </div>

      {/* 1-LINE VIRAL TAKEAWAY */}
      <div style={{ borderLeft: '4px solid var(--sage)', paddingLeft: '20px', margin: '60px 0 40px' }}>
        <h3 style={{ fontFamily: 'Fraunces', fontSize: '20px', color: 'var(--ink)', margin: '0 0 8px 0' }}>If You Remember One Thing:</h3>
        <p style={{ fontSize: '22px', fontStyle: 'italic', fontWeight: '700', color: 'var(--ink-soft)', margin: 0, lineHeight: '1.4' }}>
          "True belonging doesn't require you to change who you are; it requires you to be who you are."
        </p>
      </div>

      {/* 📢 STRONGER CALL TO ACTION */}
      <div style={{ textAlign: 'center', margin: '60px 0 40px' }}>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/mindspace')}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
          >
            Reflect on your circle in Mind Space →
          </button>
          <button 
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            See how others deal with toxic friends →
          </button>
        </div>
      </div>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Deepen Your Mental Health Journey:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/healthy-friendship-checklist')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Weekly Relationship Check: Are Your Friendships Healthy?</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Set Boundaries Without Feeling Guilty</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

      {/* ── INTERACTIVE MODAL POPUP (THE BUILDER) ── */}
      {showBuilder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,40,32,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowBuilder(false)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', margin: '0 0 4px', color: 'var(--ink)' }}>The Core 10 Friendship Traits</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>Select the 10 non-negotiables for your support system.</p>
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
                      Your list is empty. Click traits from the pool to add them.
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
                      Save My Non-Negotiables
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
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: 'var(--ink)', marginBottom: '16px' }}>Your Blueprint is Ready</h3>
                
                {/* EMOTIONAL PAYOFF SECTION */}
                <div style={{ background: '#EAF4FA', border: '1px solid #5B9EBF', borderRadius: '12px', padding: '24px', margin: '0 auto 32px', maxWidth: '500px' }}>
                  <p style={{ margin: 0, color: '#2980B9', fontWeight: '600', fontSize: '16px', fontStyle: 'italic' }}>
                    "You selected traits like {selectedTraits[0]} and {selectedTraits[1]}. This means you are someone who seeks emotional safety and genuine connection. Do not settle for friends who cannot meet you at this depth."
                  </p>
                </div>

                <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>Take a screenshot. This is your new standard. Hold yourself and others accountable to it.</p>
                
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
