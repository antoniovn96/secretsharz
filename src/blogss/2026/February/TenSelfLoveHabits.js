import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate'; // Corrected path for 3 levels deep

export const meta = {
  title: "10 Simple Self-Love Habits to Improve Your Mental Health",
  excerpt: "Loving yourself doesn't require a complete life overhaul. Discover 10 tiny, actionable self-love habits and daily mental health tips that students can easily sneak into a chaotic schedule.",
  category: "Wellness",
  date: "02-02-2026",
  readTime: "9 min read",
  wordCount: 1350,
  imgUrl: "/blogss/2026/February/self-love-habits-daily.jpg", // Corrected image path
  tldr: "Building better mental health is about consistency, not intensity. By adopting daily mental health tips like screen-free mornings, micro-boundaries, and the 'Best Friend' inner voice, you can fundamentally rewire your brain for self-compassion.",
  toc: [
    { id: "intro", title: "Why Micro-Habits Matter", level: 2 },
    { id: "interactive-battery", title: "Interactive: The Mental Battery Charger", level: 2 },
    { id: "habit-1", title: "1. Start Your Morning Screen-Free", level: 2 },
    { id: "habit-2", title: "2. Practice the 'Best Friend' Inner Voice", level: 2 },
    { id: "habit-3", title: "3. Set Micro-Boundaries with Your Time", level: 2 },
    { id: "habit-4", title: "4. Curate Your Digital Environment", level: 2 },
    { id: "habit-5", title: "5. Schedule Your 'Worry Time'", level: 2 },
    { id: "habit-6", title: "6. Celebrate the Micro-Wins", level: 2 },
    { id: "habit-7", title: "7. Move Your Body for Joy, Not Punishment", level: 2 },
    { id: "habit-8", title: "8. Embrace 'Good Enough' to Fight Perfectionism", level: 2 },
    { id: "habit-9", title: "9. Nourish Your Body Intentionally", level: 2 },
    { id: "habit-10", title: "10. End Your Day with a Brain Dump", level: 2 },
    { id: "conclusion", title: "How to Actually Make Them Stick", level: 2 },
  ]
};

// 🚀 ADVANCED SEO: JSON-LD Schemas for Google 🚀
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-02T08:00:00+08:00",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt
};

export default function TenSelfLoveHabits({ navigate, relatedPosts }) {
  // Unique Interactivity: Mental Battery Charger
  const [habitsDone, setHabitsDone] = useState({ h1: false, h2: false, h3: false, h4: false, h5: false });
  
  const completedCount = Object.values(habitsDone).filter(Boolean).length;
  const chargePercent = (completedCount / 5) * 100;
  
  const getBatteryColor = () => {
    if (completedCount === 0) return '#C0392B'; // Red (Depleted)
    if (completedCount <= 2) return '#E67E22'; // Orange (Low)
    if (completedCount <= 4) return '#F1C40F'; // Yellow (Charging)
    return 'var(--success)'; // Green (Full)
  };

  const toggleHabit = (h) => {
    setHabitsDone(prev => ({ ...prev, [h]: !prev[h] }));
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>

      <p>When you are a student drowning in assignments, entrance exam prep, and the complex social dynamics of high school or college, adding a "self-care routine" to your plate can feel like just another chore. You might think that improving your mental health requires a complete life overhaul, expensive wellness retreats, or hours of daily meditation.</p>
      
      <p>The truth is entirely different. True mental resilience is built in the margins of your day. It is built through tiny, consistent <strong>self-love habits</strong> that fundamentally rewire how you treat yourself under pressure. Incorporating <strong>daily mental health tips</strong> into your existing routine is the secret to sustainable well-being.</p>

      {/* Optimized Image SEO */}
      <img 
        src={meta.imgUrl} 
        alt="Student practicing daily mental health tips and self-love habits" 
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }} 
      />

      <h2 id="intro">Why Micro-Habits Matter</h2>
      <p>In psychology, there is a concept called neuroplasticity—the brain's ability to form and reorganize synaptic connections. Every time you criticize yourself, you strengthen the neural pathway for self-doubt. But every time you practice a self-love habit, even a tiny one, you build a new pathway for resilience. Over time, these micro-habits compound, turning self-compassion from a conscious effort into an automatic reflex.</p>

      <h2 id="interactive-battery">Interactive: The Mental Battery Charger</h2>
      <p>Before we dive into the list, let's look at how small actions stack up. Click the micro-habits below to see how quickly you can recharge your emotional battery.</p>

      <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '14px', marginBottom: '40px', background: 'var(--sand)' }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Your Daily Mental Battery
          </div>
          <div style={{ background: 'rgba(0,0,0,0.05)', height: '24px', borderRadius: '50px', overflow: 'hidden', border: '2px solid var(--border)', position: 'relative' }}>
            <div style={{ width: `${chargePercent}%`, height: '100%', background: getBatteryColor(), transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px', fontWeight: '600' }}>
            {completedCount === 5 ? "⚡ Fully Charged! You are ready for anything." : `Capacity: ${chargePercent}%`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', opacity: habitsDone.h1 ? 0.7 : 1 }}>
            <input type="checkbox" checked={habitsDone.h1} onChange={() => toggleHabit('h1')} style={{ width: '20px', height: '20px', accentColor: 'var(--sage)' }} /> 
            <span style={{ textDecoration: habitsDone.h1 ? 'line-through' : 'none', fontWeight: '500', color: 'var(--ink)' }}>Drank a full glass of water this morning</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', opacity: habitsDone.h2 ? 0.7 : 1 }}>
            <input type="checkbox" checked={habitsDone.h2} onChange={() => toggleHabit('h2')} style={{ width: '20px', height: '20px', accentColor: 'var(--sage)' }} /> 
            <span style={{ textDecoration: habitsDone.h2 ? 'line-through' : 'none', fontWeight: '500', color: 'var(--ink)' }}>Took 3 deep, slow breaths</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', opacity: habitsDone.h3 ? 0.7 : 1 }}>
            <input type="checkbox" checked={habitsDone.h3} onChange={() => toggleHabit('h3')} style={{ width: '20px', height: '20px', accentColor: 'var(--sage)' }} /> 
            <span style={{ textDecoration: habitsDone.h3 ? 'line-through' : 'none', fontWeight: '500', color: 'var(--ink)' }}>Forgave myself for a small mistake</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', opacity: habitsDone.h4 ? 0.7 : 1 }}>
            <input type="checkbox" checked={habitsDone.h4} onChange={() => toggleHabit('h4')} style={{ width: '20px', height: '20px', accentColor: 'var(--sage)' }} /> 
            <span style={{ textDecoration: habitsDone.h4 ? 'line-through' : 'none', fontWeight: '500', color: 'var(--ink)' }}>Said 'No' to something I didn't want to do</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', opacity: habitsDone.h5 ? 0.7 : 1 }}>
            <input type="checkbox" checked={habitsDone.h5} onChange={() => toggleHabit('h5')} style={{ width: '20px', height: '20px', accentColor: 'var(--sage)' }} /> 
            <span style={{ textDecoration: habitsDone.h5 ? 'line-through' : 'none', fontWeight: '500', color: 'var(--ink)' }}>Stepped outside for 5 minutes of sunlight</span>
          </label>
        </div>
      </div>

      <p>Now that you see how powerful small actions can be, let's dive into the 10 daily mental health tips you can start applying today.</p>

      <h2 id="habit-1">1. Start Your Morning Screen-Free</h2>
      <p>When you wake up and immediately check Instagram, WhatsApp, or the news, you are hijacking your brain's natural waking process. You are instantly flooding your system with dopamine hits and cortisol (stress hormone) spikes before you have even brushed your teeth.</p>
      <p><strong>The Action:</strong> Buy a cheap digital alarm clock. Leave your phone in another room or across the room while you sleep. Give yourself just 15 minutes of screen-free time in the morning to stretch, drink water, or stare out the window. You own your morning; do not give it to the algorithm.</p>

      <h2 id="habit-2">2. Practice the 'Best Friend' Inner Voice</h2>
      <p>We are often our own worst bullies. If you get a bad grade, your inner voice might scream, <em>"You are so stupid, you're going to fail at life."</em> If you spoke to your best friend like that, you wouldn't have any friends left. This negative self-talk is one of the biggest destroyers of student mental health.</p>
      <p><strong>The Action:</strong> Implement the "Best Friend Rule." The next time you make a mistake, pause. Ask yourself: <em>"What would I say to my best friend if they just did this?"</em> You would probably say, <em>"It's okay, you tried your best. Let's look at what went wrong and try again."</em> Apply that exact script to yourself.</p>

      <h2 id="habit-3">3. Set Micro-Boundaries with Your Time</h2>
      <p>As a student, you likely feel pressure to be available 24/7. Friends expect instant replies, and study groups expect you to join late-night sessions. Saying "yes" to everything means saying "no" to your own peace.</p>
      <p><strong>The Action:</strong> Start setting micro-boundaries. You do not have to confront people aggressively. Simply say, <em>"I need to recharge tonight, so I'm putting my phone on Do Not Disturb at 9 PM."</em> Protecting your time is the ultimate act of self-love.</p>

      <h2 id="habit-4">4. Curate Your Digital Environment</h2>
      <p>You are the average of the five things you consume the most online. If your feed is full of hyper-productive students pulling 14-hour study days, fitness models with unrealistic bodies, and luxury lifestyles, your brain will constantly tell you that you are falling behind.</p>
      <p><strong>The Action:</strong> Do a ruthless social media purge today. Unfollow, mute, or block any account that makes you feel anxious, insecure, or inadequate. Fill your feed with art, comedy, mental health advocates, and things that actually bring you joy.</p>

      <h2 id="habit-5">5. Schedule Your 'Worry Time'</h2>
      <p>It is impossible to tell an anxious student to "just stop worrying." Anxiety demands to be felt. However, if you let it run wild, it will ruin your entire day and paralyze your ability to study.</p>
      <p><strong>The Action:</strong> Contain the anxiety by scheduling it. Set aside 15 minutes at 5:00 PM every day as your official "Worry Time." If you start panicking about exams at 11:00 AM, tell your brain, <em>"We have an appointment to worry about this at 5 PM. I will think about it then."</em> Write the worry down and return to your task.</p>

      <h2 id="habit-6">6. Celebrate the Micro-Wins</h2>
      <p>The academic system trains you to only celebrate massive milestones: a graduation, a 95% on a board exam, getting into college. This leaves huge gaps of time where you feel unaccomplished and exhausted.</p>
      <p><strong>The Action:</strong> Hijack your dopamine system by celebrating micro-wins. Did you finally open the textbook you have been avoiding? That is a win. Did you ask a question in class? That is a win. Acknowledge these moments. Saying "Good job, me" out loud literally builds self-esteem.</p>

      <h2 id="habit-7">7. Move Your Body for Joy, Not Punishment</h2>
      <p>Many young people only exercise because they hate how they look, using cardio or the gym as a form of punishment for what they ate. This turns physical health into a mental health hazard.</p>
      <p><strong>The Action:</strong> Redefine movement. You do not need to run a marathon. Put on your favorite playlist and dance in your room for 10 minutes. Go for a slow walk without a podcast. Move your body simply to release stagnant energy and flush cortisol out of your system. Treat exercise as a celebration of what your body can do.</p>

      <h2 id="habit-8">8. Embrace 'Good Enough' to Fight Perfectionism</h2>
      <p>Perfectionism is not a strength; it is a shield. We try to be perfect so that no one can criticize us. But the pursuit of perfection leads straight to severe burnout and procrastination (because if you can't do it perfectly, you don't want to start at all).</p>
      <p><strong>The Action:</strong> Adopt the "B-Minus Work" philosophy. Sometimes, an assignment just needs to be done, not perfect. Give yourself permission to submit work that is simply "good enough" so that you can protect your sleep schedule.</p>

      <h2 id="habit-9">9. Nourish Your Body Intentionally</h2>
      <p>Your gut and your brain are physically connected by the vagus nerve. Around 90% of your body's serotonin (the happy chemical) is produced in your digestive tract. Surviving entirely on energy drinks, instant noodles, and caffeine crashes your blood sugar and directly spikes your anxiety.</p>
      <p><strong>The Action:</strong> You don't need a strict diet. Just add one act of nutritional self-love a day. Eat a piece of fruit. Drink water before you drink coffee. Treat feeding yourself as an act of profound self-respect.</p>

      <h2 id="habit-10">10. End Your Day with a Brain Dump</h2>
      <p>Laying in bed staring at the ceiling while your brain reviews every embarrassing thing you've done since 2018 is a universal student experience. Your brain holds onto these thoughts because it is afraid you will forget them.</p>
      <p><strong>The Action:</strong> Keep a notebook next to your bed. Before you lie down, do a 3-minute "Brain Dump." Write down everything you need to do tomorrow, every stray thought, and every worry. Once it is on paper, your brain no longer has to hold onto it, allowing you to actually sleep.</p>

      <h2 id="conclusion">How to Actually Make Them Stick</h2>
      <p>If you try to implement all 10 of these self-love habits tomorrow, you will fail, feel guilty, and abandon the entire concept. <strong>Do not do that.</strong></p>
      <p>Pick exactly <strong>ONE</strong> habit from this list. Just one. Use a technique called "Habit Stacking": attach your new habit to something you already do every day. For example: <em>"After I brush my teeth (existing habit), I will write down one micro-win (new habit)."</em></p>
      <p>Do it for two weeks. Once it feels automatic, come back and pick a second one. You are not racing to a finish line; you are slowly building a lifelong foundation of mental resilience.</p>

      {/* 📢 CALL TO ACTION */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Your Next Step</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <button 
          onClick={() => navigate('/blog/self-care-plan')}
          style={{ width: '100%', maxWidth: '350px', background: 'var(--ink)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-md)' }}
        >
          Build Your Full Self-Care Routine Here →
        </button>
      </div>

    </BlogPostTemplate>
  );
}
