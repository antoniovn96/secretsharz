import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Love Yourself Even When You Feel Insecure",
  excerpt: "Feeling insecure does not mean something is wrong with you — it means you are human. Learn the science behind self-love when insecure, tackle your most common insecurities head-on, and build a daily self-compassion practice that actually sticks.",
  category: "Mental Health",
  date: "10-02-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/February/self-love-insecurity.jpg",
  tldr: "Insecurity is not a character flaw — it is a misfiring survival mechanism. This guide walks you through the science of self-worth, translates your harshest inner-critic thoughts into compassionate ones, gives you 5 evidence-backed self-love exercises, and provides affirmations built specifically for the things Indian students feel most insecure about.",
  toc: [
    { id: "what-insecurity-is",    title: "1. What Insecurity Actually Is (And Isn't)",                level: 3 },
    { id: "common-insecurities",   title: "2. The 5 Most Common Student Insecurities",                 level: 3 },
    { id: "critic-translator",     title: "3. Interactive: The Inner Critic Translator",               level: 3 },
    { id: "practical-exercises",   title: "4. 5 Practical Self-Love Exercises to Start Today",         level: 3 },
    { id: "affirmations",          title: "5. Affirmations That Actually Work",                        level: 3 },
    { id: "faq",                   title: "6. Self-Love FAQs",                                         level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-10T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "self-love when insecure, how to love yourself, self-worth, student insecurities, self-compassion, affirmations for insecurity",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I love myself when I feel insecure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start by separating what you feel from what is factually true. Insecurity is an emotion, not evidence. Practice self-compassion by speaking to yourself the way you would speak to a friend in pain. Small daily rituals — journaling, movement, limiting comparison triggers — compound over time into genuine self-worth.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it normal to feel insecure as a student?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Completely normal. Students face a unique cocktail of identity pressure, academic comparison, social scrutiny, and family expectations simultaneously. Research shows insecurity peaks between ages 14 and 22 — precisely the student years. You are not broken; you are in the most psychologically turbulent season of your life.",
      },
    },
    {
      "@type": "Question",
      "name": "Do affirmations actually work for insecurity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, with an important caveat. Generic affirmations like 'I am perfect' backfire for people with low self-esteem because the brain rejects what it does not believe. The most effective affirmations are honest, specific, and process-focused — for example, 'I am learning to trust myself more each day' rather than 'I love everything about myself.'",
      },
    },
  ],
};

// ── Inner Critic Translator Data ──────────────────────────────────────────────
const CRITIC_DATA = {
  appearance: {
    label: "My Appearance",
    icon: "🪞",
    thoughts: [
      {
        critic: "I am too fat / too thin / not attractive enough.",
        concept: "Appearance insecurity is the most universally shared experience — 94% of teenage girls and 65% of boys report dissatisfaction with their body at some point (NCBI). Social media curates the top 1% of human appearance and presents it as average.",
        coach: "My body carries me through every single day. It is not an ornament to be evaluated — it is a living, working miracle. I am choosing to nourish it rather than punish it.",
        affirmation: "I am more than the shape of my body. My worth is not determined by how I look.",
      },
      {
        critic: "Everyone notices my skin / hair / the way I dress.",
        concept: "This is called the Spotlight Effect — a cognitive bias where we overestimate how much others notice and judge us. In reality, everyone is far too preoccupied with their own insecurities to scrutinise yours.",
        coach: "People are mostly absorbed in their own inner worlds. The judgment I imagine is largely a story my anxious brain is telling me to keep me 'safe'.",
        affirmation: "I take up space in this world, and I am allowed to be exactly as I am.",
      },
    ],
  },
  academic: {
    label: "My Intelligence",
    icon: "📚",
    thoughts: [
      {
        critic: "I am not as smart as everyone else in my class.",
        concept: "Comparison is your brain trying to place itself in the social hierarchy — an evolutionary instinct, not a reflection of truth. Academic environments create an artificial spotlight on a very narrow definition of intelligence.",
        coach: "I have a unique combination of strengths that a single exam score cannot begin to measure. Intelligence is not fixed — it is a skill that expands with practice and the right environment.",
        affirmation: "I am capable of learning anything I give my consistent attention to.",
      },
      {
        critic: "I will fail and everyone will know I am not good enough.",
        concept: "This is called Imposter Syndrome, and studies show it affects 70% of high-achieving people at some point. The voice that says 'I am a fraud' is loudest precisely when you are growing beyond your comfort zone.",
        coach: "The fact that I care deeply about doing well proves I belong in this space. Struggling is not the same as failing — it is how learning actually works.",
        affirmation: "I am allowed to be a work in progress. My effort matters more than perfection.",
      },
    ],
  },
  social: {
    label: "My Social Self",
    icon: "💬",
    thoughts: [
      {
        critic: "I am boring and people do not actually enjoy my company.",
        concept: "Loneliness distorts our self-perception — when we feel disconnected, the brain searches for reasons why, and it almost always lands on personal failings rather than circumstance. This is a survival error, not a truth.",
        coach: "The people who genuinely know me value me. I do not need to perform or be entertaining to deserve connection. Simply being present and honest is enough.",
        affirmation: "My presence is enough. I do not need to earn my place in a room.",
      },
      {
        critic: "I said something embarrassing and everyone is still thinking about it.",
        concept: "This is the Spotlight Effect again combined with the Recency Bias. Other people's working memory of social interactions is far shorter than ours. The moment that replays on loop in your mind was largely forgotten by everyone else within minutes.",
        coach: "One awkward moment does not define how people see me. I can be kind to the version of me that was just trying their best in the moment.",
        affirmation: "I have survived every embarrassing moment so far. I will survive this one too.",
      },
    ],
  },
  future: {
    label: "My Future",
    icon: "🧭",
    thoughts: [
      {
        critic: "Everyone has their life figured out and I am completely lost.",
        concept: "The 'everyone has it together' illusion is one of the most damaging myths of student life. What you see on the outside — the confident classmate, the put-together Instagram profile — is a curated performance. Nobody has it figured out at 17 or 21.",
        coach: "Not knowing exactly who I am or where I am going is completely developmentally appropriate. My path does not have to look like anyone else's timeline.",
        affirmation: "I am exactly where I need to be for who I am right now. My story is still being written.",
      },
      {
        critic: "I am going to choose the wrong career and ruin my life.",
        concept: "This catastrophic thinking pattern — called Fortune-Telling in Cognitive Behavioural Therapy — treats an uncertain future as a decided bad outcome. In reality, most adults change careers multiple times, and no single decision determines the rest of your life.",
        coach: "I cannot control where my path goes, only how I show up for the next step in front of me. Curiosity is a better guide than fear.",
        affirmation: "I trust myself to figure it out as I go. I do not need all the answers today.",
      },
    ],
  },
};

// ── Inner Critic Translator Component ─────────────────────────────────────────
function InnerCriticTranslator() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeThought,  setActiveThought]  = useState(0);
  const [revealed,       setRevealed]       = useState(false);

  const category = activeCategory ? CRITIC_DATA[activeCategory] : null;
  const thought  = category ? category.thoughts[activeThought] : null;

  const handleCategory = (key) => {
    setActiveCategory(key);
    setActiveThought(0);
    setRevealed(false);
  };

  const handleThought = (idx) => {
    setActiveThought(idx);
    setRevealed(false);
  };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)' }}>

      {/* Step 1 — Pick category */}
      <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        Step 1 — What are you most insecure about right now?
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {Object.entries(CRITIC_DATA).map(([key, val]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => handleCategory(key)}
              style={{
                padding: '14px 12px', borderRadius: '12px', border: '2px solid',
                borderColor: isActive ? 'var(--lavender)' : 'var(--border)',
                background: isActive ? 'var(--lav-pale)' : 'white',
                color: isActive ? 'var(--lavender)' : 'var(--ink-soft)',
                cursor: 'pointer', fontWeight: '700', fontSize: '14px',
                fontFamily: 'inherit', transition: 'all 0.18s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                boxShadow: isActive ? '0 0 0 3px rgba(124,111,160,0.15)' : 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '24px' }}>{val.icon}</span>
              {val.label}
            </button>
          );
        })}
      </div>

      {/* Step 2 — Pick the specific thought */}
      {category && (
        <>
          <p style={{ margin: '0 0 10px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — Which thought feels most familiar?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {category.thoughts.map((t, i) => {
              const isActive = activeThought === i;
              return (
                <button
                  key={i}
                  onClick={() => handleThought(i)}
                  style={{
                    padding: '14px 18px', borderRadius: '10px', border: '2px solid',
                    borderColor: isActive ? 'var(--lavender)' : 'var(--border)',
                    background: isActive ? 'var(--lav-pale)' : 'white',
                    color: 'var(--ink)', cursor: 'pointer', fontWeight: '600',
                    fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.18s',
                    textAlign: 'left', lineHeight: '1.5',
                    boxShadow: isActive ? '0 0 0 3px rgba(124,111,160,0.15)' : 'none',
                  }}
                >
                  <span style={{ opacity: 0.5, marginRight: '8px' }}>💭</span>
                  {t.critic}
                </button>
              );
            })}
          </div>

          {/* Step 3 — Reveal translation */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                background: 'var(--lavender)', color: 'white', fontWeight: '700',
                fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(124,111,160,0.35)',
              }}
            >
              ✨ Translate This Thought →
            </button>
          ) : (
            <div style={{ animation: 'floatUp 0.35s ease' }}>

              {/* The inner critic card */}
              <div style={{ background: '#FFF0F0', border: '2px solid rgba(192,57,43,0.3)', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#C0392B', marginBottom: '8px' }}>
                  🔴 Your Inner Critic says...
                </div>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--ink-soft)', fontSize: '15px', lineHeight: '1.6' }}>
                  "{thought.critic}"
                </p>
              </div>

              {/* The psychology concept */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>
                  🔬 The Psychology Behind It
                </div>
                <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '14px', lineHeight: '1.7' }}>
                  {thought.concept}
                </p>
              </div>

              {/* The inner coach card */}
              <div style={{ background: 'var(--sage-pale)', border: '2px solid rgba(74,124,89,0.4)', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--sage)', marginBottom: '8px' }}>
                  💚 Your Inner Coach responds...
                </div>
                <p style={{ margin: 0, color: 'var(--ink)', fontSize: '15px', lineHeight: '1.7', fontWeight: '500' }}>
                  {thought.coach}
                </p>
              </div>

              {/* The affirmation */}
              <div style={{ background: 'var(--lav-pale)', border: '2px solid rgba(124,111,160,0.35)', borderRadius: '12px', padding: '18px 20px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--lavender)', marginBottom: '8px' }}>
                  ✨ Your Affirmation for Today
                </div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', color: 'var(--lavender)', fontSize: '18px', lineHeight: '1.5', fontWeight: '600', fontStyle: 'italic' }}>
                  "{thought.affirmation}"
                </p>
              </div>

              <button
                onClick={() => setRevealed(false)}
                style={{
                  background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--muted)',
                  padding: '9px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                  fontWeight: '700', fontFamily: 'inherit',
                }}
              >↺ Try a different thought</button>
            </div>
          )}
        </>
      )}

      {!category && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontStyle: 'italic', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
          👆 Select a category above to begin translating your inner critic's voice
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SelfLoveInsecurity({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description"        content={meta.excerpt} />
        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image"       content={meta.imgUrl} />
        <meta property="og:type"        content="article" />
        <meta property="twitter:card"   content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      {/* ── Introduction ── */}
      <p>There is a voice in your head that has an opinion about everything you do. It tells you your body is wrong, your intelligence is not enough, your personality is too much or too little, and that everyone else has somehow figured out a game you were never given the rules to.</p>

      <p>Learning <strong>self-love when insecure</strong> does not mean silencing that voice through force or drowning it in toxic positivity. It means understanding where it comes from, challenging it with truth, and slowly — imperfectly — building a different relationship with yourself. One where you are not the enemy.</p>

      <img
        src={meta.imgUrl}
        alt="Student practising self-love when insecure, journalling and reflecting with compassion"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-insecurity-is">1. What Insecurity Actually Is (And Isn't)</h3>
      <p>Insecurity is not evidence that something is wrong with you. It is your brain's threat detection system — designed hundreds of thousands of years ago to keep you accepted within your tribe — misfiring in a world it was never built for. Being rejected from a social group once meant death. So the brain learned to be extremely vigilant about signs of not being good enough. That vigilance is now pointed inward, constantly scanning you for flaws that might get you expelled from the group.</p>
      <p>Understanding this changes everything. <strong>Feeling insecure is not a character failing. It is a biological hangover from a world that no longer exists.</strong> You are not broken — you are running ancient software on a modern problem. And software can be updated.</p>

      {/* ── Section 2 ── */}
      <h3 id="common-insecurities">2. The 5 Most Common Student Insecurities</h3>
      <p><strong>Appearance insecurity</strong> is the most universally shared. Social media's relentless stream of curated beauty creates a false benchmark — you are comparing your unfiltered reality to someone else's most flattering, edited, carefully lit moment. It is an inherently unfair comparison that your self-worth was never designed to survive.</p>
      <p><strong>Academic insecurity</strong> — the feeling that everyone else understood the lesson and you alone are lost — affects even the highest achievers. Psychologists call it Imposter Syndrome: the persistent internal belief that you are not as capable as others believe you to be, and that you will eventually be found out. Studies show it affects 70% of people at some point. You are in very good company.</p>
      <p><strong>Social insecurity</strong> — the deep worry that you are boring, too intense, too awkward, or simply not likeable — tends to peak in school and college environments where social hierarchies feel permanent and high-stakes. They are neither.</p>
      <p><strong>Career and future insecurity</strong> is particularly brutal for Indian students, who often face the dual pressure of figuring out their own identity while simultaneously meeting family expectations that have been held for years. The pressure to choose correctly — and immediately — is immense and largely unrealistic.</p>
      <p><strong>Family comparison insecurity</strong> — being measured against a sibling, a cousin, a neighbour's child — creates a wound that is uniquely deep because it comes from people whose love should be unconditional. It is not a reflection of your worth. It is a reflection of a generational communication pattern that many Indian families are still working through.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="critic-translator">3. Interactive: The Inner Critic Translator</h3>
      <p>Your inner critic speaks in absolutes. It is loud, fast, and convincing. Below, you can take a specific insecure thought and hear what the psychology actually says about it — then read the compassionate inner coach response and walk away with a grounded affirmation. <strong>Pick what is most alive for you right now.</strong></p>

      <InnerCriticTranslator />

      {/* ── Section 4 ── */}
      <h3 id="practical-exercises">4. Five Practical Self-Love Exercises to Start Today</h3>
      <p><strong>Exercise 1 — The Three Things Practice.</strong> Every evening before you sleep, write down three things that are true and specific about you — not accomplishments, but qualities. Not "I finished my homework" but "I was patient with someone today even when I was tired." Over 30 days, this practice physically rewires the brain's negativity bias through what neuroscientists call self-directed neuroplasticity.</p>
      <p><strong>Exercise 2 — The Best Friend Audit.</strong> The next time your inner critic fires, ask: "Would I say this to my best friend if they were in this situation?" If the answer is no — and it almost always is — write down what you would actually say to them. Then say it to yourself. The words are exactly as true when directed inward.</p>
      <p><strong>Exercise 3 — The Comparison Fast.</strong> Choose one person you compare yourself to most painfully — on social media or in real life — and take a deliberate 7-day break from consuming their content. Notice what happens to your baseline mood within 72 hours. The data from your own experiment is more powerful than any advice.</p>
      <p><strong>Exercise 4 — Body Gratitude, Not Body Praise.</strong> Instead of trying to love how you look — which can feel impossible on hard days — shift to loving what your body does. Your legs carried you somewhere today. Your lungs breathed while you were busy thinking about everything else. Gratitude for function bypasses the appearance trap entirely.</p>
      <p><strong>Exercise 5 — The 10-Year Letter.</strong> Write a letter to yourself from your 10-years-older self. What do you wish you had known? What do you wish you had been kinder to yourself about? What do you know now that you couldn't see then? Reading it back — even knowing you wrote it — produces a measurable shift in self-compassion. This exercise is used in clinical trauma therapy for precisely that reason.</p>

      {/* ── Section 5 ── */}
      <h3 id="affirmations">5. Affirmations That Actually Work</h3>
      <p>Traditional affirmations — "I am beautiful, I am perfect, I am enough" — can backfire. Research by Joanne Wood at the University of Waterloo found that for people with low self-esteem, extreme positive self-statements actually increase negative mood. The brain rejects what it does not believe.</p>
      <p>The affirmations that work are <em>honest</em>, <em>specific</em>, and <em>process-oriented</em> — they acknowledge where you are while pointing toward growth.</p>

      <div style={{ background: 'var(--lav-pale)', borderRadius: '14px', padding: '24px', border: '1.5px solid rgba(124,111,160,0.2)', marginBottom: '30px' }}>
        {[
          "I am learning to trust myself, and that is enough for today.",
          "I do not need to earn my place in a room. I already belong.",
          "My worth is not a score on a test, a number on a scale, or someone else's approval.",
          "I am allowed to be a work in progress and still be worthy of love.",
          "I have survived every difficult day so far. My track record is 100%.",
          "I can hold my insecurities with kindness instead of judgment.",
          "The right people will stay. I do not need to shrink myself to be loved.",
        ].map((aff, i) => (
          <div key={i} style={{
            padding: '14px 18px', marginBottom: i < 6 ? '8px' : 0,
            background: 'white', borderRadius: '10px', border: '1px solid rgba(124,111,160,0.15)',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}>
            <span style={{ color: 'var(--lavender)', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✦</span>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', color: 'var(--ink)', lineHeight: '1.5', fontStyle: 'italic' }}>
              "{aff}"
            </p>
          </div>
        ))}
      </div>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Self-Love FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Self-love sounds selfish. Is it?</strong><br />
        A: Self-love is not the same as selfishness or narcissism. It is the recognition that you cannot give from an empty place. You become a better friend, student, and family member when you stop running on fumes of self-contempt. Caring for yourself is not in opposition to caring for others — it is the foundation of it.</p>

        <p><strong>Q: I have been insecure my whole life. Can this actually change?</strong><br />
        A: Yes. Self-worth is not a fixed trait — it is a skill. The brain is neuroplastic, meaning it physically changes in response to repeated thought patterns. The exercises in this article are not motivational fluff; they are evidence-based interventions that change how your brain processes self-referential information over time. The keyword is time. Not overnight. But with consistency, absolutely yes.</p>

        <p><strong>Q: What if I try self-love and it feels fake or hollow?</strong><br />
        A: That feeling is normal and expected, especially early on. It does not mean you are doing it wrong. It means you are breaking a pattern that has been deeply ingrained. Feeling hollow is not a sign to stop — it is a sign you have started. Keep going.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: 'var(--lavender)', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You have been criticising yourself for years and it hasn't worked. Try approving of yourself and see what happens."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Louise Hay</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          You do not need to feel completely secure before you begin treating yourself with kindness. You just need to begin.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: 'var(--lavender)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(124,111,160,0.35)' }}
          >
            Start Your Self-Love Journal →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: 'var(--lavender)', border: '2px solid var(--lavender)', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Going — You Are Worth It:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/toxic-friendship-signs')} style={{ background: 'none', border: 'none', color: 'var(--lavender)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → 7 Signs of a Toxic Friendship You Should Not Ignore
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background: 'none', border: 'none', color: 'var(--lavender)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Set Boundaries Without Feeling Guilty (Student Guide)
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/negative-self-talk')} style={{ background: 'none', border: 'none', color: 'var(--lavender)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Breaking the Cycle of Negative Self-Talk
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: 'var(--lavender)', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
