import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate'; // Corrected Path for deep folder

export const meta = {
  title: "Healthy vs Toxic Relationships: How to Know the Difference",
  excerpt: "Is your friend just having a bad day, or is the relationship actively destroying your peace? Learn the toxic relationships signs, see real student examples, and decode the subtle red flags.",
  category: "Relationships",
  date: "03-02-2026",
  readTime: "8 min read",
  wordCount: 1350,
  imgUrl: "/blogss/healthy-vs-toxic-relationships.jpg", // Image Path
  tldr: "A healthy relationship gives you energy, encourages your academic and personal growth, and respects your boundaries. A toxic relationship drains your energy, demands constant sacrifices, and makes you feel guilty for saying no.",
  toc: [
    { id: "the-confusion", title: "1. The Confusion Between Drama and Toxicity", level: 2 },
    { id: "interactive-decoder", title: "2. Interactive: The Red Flag Text Decoder", level: 2 },
    { id: "comparison-table", title: "3. Comparison: Healthy vs Toxic Relationships", level: 2 },
    { id: "toxic-signs", title: "4. The Biggest Toxic Relationships Signs", level: 2 },
    { id: "student-scenarios", title: "5. Real-Life Student Scenarios", level: 2 },
    { id: "how-to-leave", title: "6. How to Protect Your Peace", level: 2 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-03T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function HealthyVsToxic({ navigate, relatedPosts }) {
  // Unique Interactivity: Red Flag Text Decoder
  const [revealed, setRevealed] = useState({});

  const messages = [
    { id: 'm1', text: "Why didn't you reply instantly? I saw you were online 10 mins ago.", flag: "🔴 Red Flag: Control", reason: "This is controlling behavior. You are allowed to be online without owing anyone your immediate time and attention." },
    { id: 'm2', text: "I'm really stressed about the exams, but I know you're sleeping. We can talk tomorrow!", flag: "🟢 Green Flag: Respect", reason: "They are communicating their emotional struggle while actively respecting your physical boundaries (sleep)." },
    { id: 'm3', text: "You're too sensitive, I was obviously just joking when I made fun of your grades.", flag: "🔴 Red Flag: Gaslighting", reason: "This is a classic toxic relationships sign. A healthy friend apologizes if they hurt your feelings; they don't blame you for reacting." },
    { id: 'm4', text: "If you were really my best friend, you would skip studying to hang out with me today.", flag: "🔴 Red Flag: Manipulation", reason: "Emotional manipulation. Anyone who asks you to sabotage your own academic goals to prove your loyalty is toxic." },
    { id: 'm5', text: "I'm a little disappointed you can't come, but I get you need to study. Good luck!", flag: "🟢 Green Flag: Maturity", reason: "They are allowed to feel disappointed, but they express it without guilt-tripping you or demanding you change your plans." }
  ];

  const handleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>
      
      {/* 🚀 EXPLICIT SOCIAL SHARING & SCHEMA TAGS 🚀 */}
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        
        {/* Open Graph Tags for Social Media Sharing (WhatsApp, Facebook, LinkedIn) */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={meta.imgUrl} />
        <meta property="og:url" content="https://secretsharz.com/blog/healthy-vs-toxic" />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.excerpt} />
        <meta name="twitter:image" content={meta.imgUrl} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>

      <p>We have all heard the word &quot;toxic&quot; thrown around on TikTok and Instagram. People use it to describe everything from a bad date to a friend who takes too long to text back. But when the internet turns a clinical psychology term into a trendy buzzword, it loses its meaning.</p>
      
      <p>As a student navigating high school or college, your friendships and romantic relationships are your lifeline. But what happens when the people closest to you are the ones secretly draining your energy? How do you distinguish between a friend who is just having a rough week, and a relationship that is actively destroying your mental health?</p>

      <p>Today, we are breaking down the exact differences in <strong>healthy vs toxic relationships</strong>, the subtle signs you are being manipulated, and how to protect your peace.</p>

      {/* Optimized Image SEO */}
      <img 
        src={meta.imgUrl} 
        alt="Student learning the difference between healthy vs toxic relationships" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '30px', marginBottom: '30px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }} 
      />

      <h2 id="the-confusion">1. The Confusion Between Drama and Toxicity</h2>
      <p>Let&apos;s clear up a massive misconception: <strong>conflict does not equal toxicity</strong>. Every single relationship on earth—including the healthiest ones—will experience arguments, misunderstandings, and hurt feelings. You are two different human beings; you will eventually clash.</p>
      
      <p>The difference lies in <em>how</em> the conflict is handled. In a healthy relationship, an argument is &quot;You and Me vs. The Problem.&quot; In a toxic relationship, an argument is &quot;Me vs. You.&quot; Toxic relationships lack emotional safety. They are built on control, insecurity, and an unequal exchange of energy.</p>
      
      <p>The simplest way to evaluate any dynamic is the <strong>&quot;Battery Test.&quot;</strong> After spending an hour with this person, do you feel emotionally recharged, understood, and lighter? Or do you feel exhausted, anxious, and like you have been walking on eggshells? Healthy relationships charge your battery. Toxic relationships act as a parasitic drain.</p>

      <h2 id="interactive-decoder">2. Interactive: The Red Flag Text Decoder</h2>
      <p>Toxicity rarely starts with massive screaming matches. It usually sneaks in through casual, everyday text messages that make you feel slightly guilty or anxious. Tap on the text messages below to &quot;decode&quot; the psychology behind them.</p>

      <div style={{ background: 'var(--lav-pale)', padding: '24px', borderRadius: '14px', marginBottom: '40px', border: '1px solid var(--lavender)' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
            <div 
              onClick={() => handleReveal(msg.id)}
              style={{ background: 'white', padding: '16px 20px', borderRadius: '18px 18px 18px 4px', border: '1px solid var(--border)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative', width: 'fit-content', maxWidth: '85%', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: '1.5' }}>&quot;{msg.text}&quot;</span>
              <div style={{ fontSize: '11px', color: 'var(--lavender)', marginTop: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Tap to Decode 🔍</div>
            </div>

            {revealed[msg.id] && (
              <div style={{ background: msg.flag.includes('Red') ? '#FFF0F0' : '#E8F5EE', padding: '16px', borderRadius: '12px', marginTop: '8px', borderLeft: `4px solid ${msg.flag.includes('Red') ? 'var(--danger)' : 'var(--success)'}`, animation: 'floatUp 0.3s ease', maxWidth: '85%', alignSelf: 'flex-end', marginLeft: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                <strong style={{ display: 'block', marginBottom: '6px', color: msg.flag.includes('Red') ? 'var(--danger)' : 'var(--success)', fontSize: '14px' }}>{msg.flag}</strong>
                <span style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>{msg.reason}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 id="comparison-table">3. Comparison: Healthy vs Toxic Relationships</h2>
      <p>Sometimes, seeing the behaviors side-by-side provides the clarity you need. Here is a direct breakdown of how the same situations are handled differently.</p>

      <div style={{ overflowX: 'auto', marginBottom: '40px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'var(--ink)', color: 'white' }}>
              <th style={{ padding: '16px', borderBottom: '2px solid var(--border)' }}>Scenario</th>
              <th style={{ padding: '16px', borderBottom: '2px solid var(--border)', background: 'var(--success)', color: 'white' }}>Healthy Relationship 🟢</th>
              <th style={{ padding: '16px', borderBottom: '2px solid var(--border)', background: 'var(--danger)', color: 'white' }}>Toxic Relationship 🔴</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'white' }}>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 'bold', color: 'var(--ink)' }}>You get a higher grade</td>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>They celebrate your win and feel proud of your hard work.</td>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>They get visibly jealous, minimize your effort, or make it a competition.</td>
            </tr>
            <tr style={{ background: 'var(--sand)' }}>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 'bold', color: 'var(--ink)' }}>You say &quot;No&quot; to plans</td>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>They respect your boundary and understand you need rest.</td>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>They guilt-trip you, act like a victim, and call you a bad friend.</td>
            </tr>
            <tr style={{ background: 'white' }}>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 'bold', color: 'var(--ink)' }}>Making a mistake</td>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>They forgive you and focus on moving forward together.</td>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>They hold a grudge and constantly bring up the past to control you.</td>
            </tr>
            <tr style={{ background: 'var(--sand)' }}>
              <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--ink)' }}>Other friendships</td>
              <td style={{ padding: '16px', color: 'var(--ink-soft)' }}>They encourage you to have a wide circle of friends.</td>
              <td style={{ padding: '16px', color: 'var(--ink-soft)' }}>They demand you only spend time with them and isolate you.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="toxic-signs">4. The Biggest Toxic Relationships Signs Every Student Should Know</h2>
      <p>If you are wondering whether you should step back from a friend or partner, look out for these core psychological red flags:</p>
      
      <ul>
        <li style={{ marginBottom: '12px' }}><strong>The Emotional Dumpster Fire:</strong> This person treats you like an unpaid therapist. They will call you for 2 hours to vent about their drama, but the second you try to talk about your stress, they suddenly &quot;have to go&quot; or immediately change the subject back to themselves. It is a completely one-sided energy exchange.</li>
        <li style={{ marginBottom: '12px' }}><strong>The Academic Saboteur:</strong> In highly competitive environments like Indian schools, toxicity often masks itself as "academic pressure." A toxic friend will constantly ask you what you scored, hide study notes from you, or subtly try to make you doubt your own intelligence before a major exam.</li>
        <li style={{ marginBottom: '12px' }}><strong>Gaslighting:</strong> This is a severe form of manipulation where a person makes you question your own memory or reality. If you express that they hurt you, they will say things like, <em>&quot;You're crazy, that never happened,&quot;</em> or <em>&quot;You are always overreacting.&quot;</em></li>
      </ul>

      <h2 id="student-scenarios">5. Real-Life Student Scenarios</h2>
      <p>Let's look at how these dynamics play out in the daily life of a student in 2026.</p>

      <blockquote style={{ borderLeft: '4px solid var(--sage)', background: 'var(--sage-pale)', padding: '16px 20px', borderRadius: '0 12px 12px 0', margin: '24px 0', color: 'var(--ink-soft)' }}>
        <strong>Scenario A (The Guilt Trip):</strong> You have a massive pre-board exam on Monday. Your friend wants to hang out on Sunday afternoon. You politely decline, saying you need to study. 
        <br/><br/>
        <em>The Toxic Response:</em> &quot;Wow, okay. I guess your books are more important than me. Don't come crying to me when you have no friends left.&quot; (This forces you to choose between your future and their ego).
      </blockquote>

      <blockquote style={{ borderLeft: '4px solid var(--peach)', background: '#FDF0EA', padding: '16px 20px', borderRadius: '0 12px 12px 0', margin: '24px 0', color: 'var(--ink-soft)' }}>
        <strong>Scenario B (The Jealous Competitor):</strong> You excitedly tell your friend that you finally secured an interview for the college committee you wanted.
        <br/><br/>
        <em>The Toxic Response:</em> &quot;Oh, that's cool. I heard they are letting basically everyone in this year though, so it's not that hard.&quot; (They immediately minimize your achievement to make themselves feel taller).
      </blockquote>

      <h2 id="how-to-leave">6. How to Protect Your Peace</h2>
      <p>If reading this article made a specific person pop into your head, it is time to take action. You do not owe anyone a front-row seat to your life if they are constantly making you feel miserable.</p>
      
      <p>You don't always need a dramatic, movie-style breakup. Start by implementing the <strong>&quot;Gray Rock Method.&quot;</strong> Become as uninteresting and unresponsive as a gray rock. Give short, non-committal answers. Take longer to reply to texts. Slowly pull your emotional energy back until the toxic person gets bored and looks for drama elsewhere.</p>
      
      <p>Remember: You are allowed to outgrow people. Ending a toxic friendship isn't a failure; it is a profound act of self-care.</p>

      {/* 📢 CALL TO ACTION */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '60px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          &quot;You cannot heal in the same environment that made you sick. Choose your circle wisely.&quot;
        </h2>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/wall')}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
          >
            Seek Peer Advice on the Wall →
          </button>
          <button 
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Talk to a Professional Counsellor
          </button>
        </div>
      </div>

    </BlogPostTemplate>
  );
}
