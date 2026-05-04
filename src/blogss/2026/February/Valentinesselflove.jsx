import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Valentine's Day Self-Love Guide: Love Yourself First",
  excerpt: "This Valentine's Day, the most important relationship to invest in is the one you have with yourself. Learn why self-love is not selfish, how it differs from external love, discover beautiful ways to celebrate solo, and write yourself a love letter you actually need to read.",
  category: "Mental Health",
  date: "14-02-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/February/valentines-self-love.jpg",
  tldr: "Valentine's Day is relentlessly marketed as a celebration of romantic love — but the relationship research is clear: the quality of your relationship with yourself sets the ceiling for every other relationship in your life. This guide explores the psychology of self-love vs external love, gives you five beautiful ways to celebrate solo, and walks you through a personalised love letter — written to you, by you.",
  toc: [
    { id: "self-vs-external",  title: "1. Self-Love vs External Love: What the Research Says",        level: 3 },
    { id: "why-solo-matters",  title: "2. Why Spending Valentine's Day Alone Can Be an Act of Power", level: 3 },
    { id: "love-letter",       title: "3. Interactive: Write Yourself a Love Letter",                 level: 3 },
    { id: "solo-ideas",        title: "4. Five Solo Valentine's Celebration Ideas That Actually Work", level: 3 },
    { id: "red-flags",         title: "5. Red Flags That Signal You Are Outsourcing Your Self-Worth", level: 3 },
    { id: "faq",               title: "6. Valentine's Self-Love FAQs",                                level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-14T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "valentines day self-love, self-love valentine, love yourself first, solo valentines day, self-love vs external love, valentines day alone",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I practise self-love on Valentine's Day when I am single?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Treat it as a deliberate investment in your most important relationship — the one with yourself. Do one thing today that is purely for your own pleasure, comfort, or growth. Write yourself a letter. Cook your favourite meal. Give yourself permission to fully enjoy the day without apology or performance. The goal is not to pretend you do not want romantic love — it is to stop making that wanting the condition for your happiness today.",
      },
    },
    {
      "@type": "Question",
      "name": "Is self-love on Valentine's Day just toxic positivity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No — if it is honest. Toxic positivity would be telling yourself that being single is always perfect or that you never want a relationship. Genuine self-love acknowledges that you might genuinely wish today looked different, while also choosing to treat yourself with care regardless. It holds both the longing and the kindness at the same time.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the difference between self-love and self-esteem?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Self-esteem is conditional — it fluctuates based on your performance, appearance, and external validation. Self-love is unconditional — it is a stable commitment to treating yourself with care and respect regardless of your current results or circumstances. Research by Dr Kristin Neff shows that self-compassion (the foundation of self-love) produces better long-term mental health outcomes than self-esteem, precisely because it does not depend on being exceptional.",
      },
    },
  ],
};

// ── Love Letter Generator Data ─────────────────────────────────────────────────
const ROSE   = '#B5234A';
const PALE   = '#FEF0F4';
const BORDER = 'rgba(181,35,74,0.22)';

const QUESTIONS = [
  {
    id: 'q1',
    prompt: 'What is one thing you have done in the past year that took genuine courage — even if nobody noticed?',
    placeholder: 'e.g. I went to a new place alone, I finally said no to someone, I tried something I was scared of failing at…',
    letter: (v) => `You did something this year that most people never talk about — something that cost you real courage. ${v} That moment happened. Nobody can take it back. A braver version of you exists because of it, and that version is the one writing this letter.`,
  },
  {
    id: 'q2',
    prompt: 'Name one quality in yourself that you genuinely respect — not a talent, a quality. Who you are, not what you can do.',
    placeholder: 'e.g. I am deeply loyal, I notice when people are struggling, I keep trying even when it is hard…',
    letter: (v) => `Here is something I want you to stop taking for granted about yourself: ${v} This is not something everyone has. Not even close. The people in your life who have felt truly seen, or truly held, or truly accompanied — they felt that because of this quality in you. It is not small. It is the reason people stay.`,
  },
  {
    id: 'q3',
    prompt: 'What is one way you have been unkind to yourself recently — something you would never say to someone you loved?',
    placeholder: 'e.g. I told myself I was stupid for making that mistake, I compared my life to someone else\'s and decided I was failing…',
    letter: (v) => `I need to address something directly. You said to yourself recently: "${v}" — and I want you to sit with how that would feel if someone said it to someone you love. You would not allow it. You would defend them. I am asking you to extend that same defence to yourself. Not because you are perfect. Because you are human, you are trying, and you deserve the same basic dignity you give to everyone else.`,
  },
  {
    id: 'q4',
    prompt: 'What is one thing you genuinely enjoy — that is just yours, that does not need to impress anyone or produce anything?',
    placeholder: 'e.g. Reading alone, making playlists, drawing, cooking something elaborate, long walks with music…',
    letter: (v) => `${v} — this is yours. No algorithm recommended it for your productivity. No one gave you a mark for it. You simply love it, and that love is one of the cleanest, truest things about you. Please protect this. The world will keep trying to make your private joy into something useful or shareable. Let it stay yours.`,
  },
  {
    id: 'q5',
    prompt: 'What is one thing you are genuinely looking forward to — in your life, not just today?',
    placeholder: 'e.g. Getting to a place where I feel more settled, a trip I want to take, work I want to do, a version of myself I am moving toward…',
    letter: (v) => `And here is the thing about your future that you need to hear on a day that makes everyone feel behind: ${v} — that is real. That is where you are headed. The version of you reading this letter is the one building that future, one imperfect day at a time. You are not late. You are exactly in the middle of it.`,
  },
];

// ── Love Letter Component ──────────────────────────────────────────────────────
function LoveLetterGenerator() {
  const [answers,   setAnswers]   = useState({});
  const [generated, setGenerated] = useState(false);
  const [openCard,  setOpenCard]  = useState(null);

  const allDone = QUESTIONS.every(q => (answers[q.id] || '').trim().length > 5);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const handleGenerate = () => { if (allDone) setGenerated(true); };
  const handleReset    = () => { setAnswers({}); setGenerated(false); setOpenCard(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {!generated ? (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Five questions. One letter. Entirely for you.
          </p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.65' }}>
            Answer each question as honestly as you can — not for anyone else to read. The letter generated from your answers will be more true, and more useful, the more honest you are.
          </p>

          {QUESTIONS.map((q, i) => {
            const val = answers[q.id] || '';
            const done = val.trim().length > 5;
            return (
              <div key={q.id} style={{
                background: 'white', borderRadius: '12px', padding: '18px 20px',
                marginBottom: '12px', border: '2px solid',
                borderColor: done ? ROSE : 'var(--border)',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: ROSE }}>
                    Question {i + 1}
                  </div>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    background: done ? ROSE : 'rgba(181,35,74,0.1)',
                    border: `2px solid ${done ? ROSE : BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: 'white', transition: 'all 0.2s',
                  }}>
                    {done ? '✓' : ''}
                  </div>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: 'var(--ink)', lineHeight: '1.5' }}>{q.prompt}</p>
                <textarea
                  value={val}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder={q.placeholder}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)',
                    borderRadius: '10px', fontSize: '14px', fontFamily: font,
                    color: 'var(--ink)', background: '#fafafa', outline: 'none',
                    resize: 'vertical', lineHeight: '1.6',
                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = ROSE; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
            );
          })}

          <button
            onClick={handleGenerate}
            disabled={!allDone}
            style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
              background: allDone ? `linear-gradient(135deg, ${ROSE}, #E05080)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: allDone ? 'pointer' : 'not-allowed', fontFamily: font,
              transition: 'all 0.2s', boxShadow: allDone ? `0 6px 20px ${BORDER}` : 'none',
            }}
          >
            {allDone ? '💌 Generate My Love Letter →' : `Answer all ${QUESTIONS.filter(q => !(answers[q.id] || '').trim()).length} remaining questions to continue`}
          </button>
        </>
      ) : (
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          {/* Letter header */}
          <div style={{
            background: `linear-gradient(135deg, ${ROSE}, #E05080)`,
            borderRadius: '14px', padding: '28px 24px', marginBottom: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💌</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
              A Love Letter to You
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.5px' }}>
              From you. For you. On the most important Valentine's Day of all.
            </div>
          </div>

          {/* Letter salutation */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px 22px', marginBottom: '10px', border: `1.5px solid ${BORDER}` }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', color: 'var(--ink)', lineHeight: 1.8, fontStyle: 'italic' }}>
              Dear you,
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              I want to write you a letter that is honest — not the kind of love letter that pretends everything is perfect, but the kind that sees you clearly and chooses you anyway. Every line below came from something you told me about yourself. I just put it into words you may not have been saying to yourself lately.
            </p>
          </div>

          {/* Letter paragraphs — accordion reveal */}
          {QUESTIONS.map((q, i) => {
            const val = answers[q.id] || '';
            const isOpen = openCard === i;
            const paragraph = q.letter(val);
            return (
              <div key={q.id} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => setOpenCard(isOpen ? null : i)}
                  style={{
                    width: '100%', padding: '14px 18px', borderRadius: isOpen ? '12px 12px 0 0' : '12px',
                    border: `1.5px solid ${isOpen ? ROSE : BORDER}`,
                    background: isOpen ? PALE : 'white',
                    cursor: 'pointer', fontFamily: font, textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '700', color: isOpen ? ROSE : 'var(--ink)' }}>
                    {['On your courage', 'On who you are', 'On how you speak to yourself', 'On what you love', 'On your future'][i]}
                  </span>
                  <span style={{ color: ROSE, fontSize: '18px', flexShrink: 0, marginLeft: '10px' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{
                    background: PALE, border: `1.5px solid ${ROSE}`, borderTop: 'none',
                    borderRadius: '0 0 12px 12px', padding: '18px 20px',
                    animation: 'floatUp 0.25s ease',
                  }}>
                    <p style={{ margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--ink)', lineHeight: 1.85, fontStyle: 'italic' }}>
                      {paragraph}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Letter closing */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px 22px', margin: '10px 0 16px 0', border: `1.5px solid ${BORDER}` }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', color: 'var(--ink)', lineHeight: 1.8, fontStyle: 'italic' }}>
              I am not telling you that you should not want romantic love. Of course you should — connection is one of the most human things there is. But on this particular day, I want you to know that the love you are looking for from someone else already lives in the person reading this letter. It is just waiting to be practised.
            </p>
            <p style={{ margin: '14px 0 0 0', fontFamily: 'Fraunces, serif', fontSize: '17px', color: ROSE, lineHeight: 1.8, fontStyle: 'italic', fontWeight: '600' }}>
              With all the love you deserve,<br />You.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleReset} style={{
              padding: '10px 20px', borderRadius: '50px', border: `1.5px solid ${BORDER}`,
              background: 'transparent', color: ROSE, fontWeight: '700', fontSize: '13px',
              cursor: 'pointer', fontFamily: font,
            }}>↺ Write a new letter</button>
            <div style={{ fontSize: '13px', color: 'var(--muted)', padding: '10px 0', fontStyle: 'italic', alignSelf: 'center' }}>
              💌 This letter is private — nothing is stored or sent anywhere.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ValentinesSelfLove({ navigate, relatedPosts }) {
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
      <p>Every year on the fourteenth of February, the world becomes very loud about a particular kind of love — the kind that requires another person. Flowers arrive at desks, couples post photographs, and if you are alone, the message from every billboard and every algorithm is the same: you are missing something.</p>

      <p>But here is what does not make the cards or the adverts: the research on what actually makes people capable of loving and being loved well. And that research points, consistently and clearly, to the same thing. The quality of your relationship with yourself — your genuine self-love, not your performance of confidence — sets the ceiling for every other relationship in your life. <strong>Valentine's Day self-love</strong> is not a consolation prize for being single. It is the foundation everything else is built on.</p>

      <img
        src={meta.imgUrl}
        alt="Person celebrating Valentine's Day through self-love — journalling, flowers, and peaceful solo time"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="self-vs-external">1. Self-Love vs External Love: What the Research Says</h3>
      <p>There is a persistent cultural story that self-love and romantic love are in opposition — that needing someone else is real love, and loving yourself is a kind of retreat from intimacy. The psychological evidence runs in exactly the opposite direction.</p>
      <p>Dr Kristin Neff's foundational research on self-compassion — the active practice of treating yourself with the same care you would extend to someone you love — consistently shows that people with higher self-compassion are <em>better</em> romantic partners, not more self-contained ones. They are less likely to be defensive during conflict. Less likely to require constant reassurance. Less likely to make their partner responsible for their emotional regulation. Less likely to stay in relationships that diminish them out of fear that they are not enough to survive alone.</p>
      <p>External love — being chosen, admired, desired, or validated by another person — produces a real and genuine warmth. But it is inherently unstable, because it depends entirely on another person's choices and perceptions, which you cannot control. <strong>Self-love is stable.</strong> It does not leave when someone else does. It does not rise and fall with your social media engagement. It does not require a specific date on the calendar to feel real.</p>
      <p>The relationship research is not romantic about this — it is simply accurate. People who like themselves are more likeable. People who treat themselves with respect attract people who treat them with respect. People who have a stable, internally anchored sense of self-worth are the ones who build the relationships they actually wanted, rather than just the ones they were afraid to refuse.</p>

      {/* ── Section 2 ── */}
      <h3 id="why-solo-matters">2. Why Spending Valentine's Day Alone Can Be an Act of Power</h3>
      <p>There is a version of spending Valentine's Day alone that is resigned and small — waiting out the day, avoiding social media, getting through until the fifteenth. And there is a version that is genuinely powerful. The difference is not circumstance. It is intention.</p>
      <p>Choosing to spend the day investing in yourself — deliberately, specifically, as an act of self-care rather than self-protection — sends a message to your nervous system that is far more nourishing than anything external validation can offer. It says: I do not need a witness for this day to matter. I do not need an audience for my enjoyment to be real. I do not need permission to take up space on a day the world has decided belongs to couples.</p>
      <p>That is not resignation. That is a kind of freedom most people spend years chasing.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="love-letter">3. Interactive: Write Yourself a Love Letter</h3>
      <p>The most powerful love letter you will ever receive is one that knows you — not the curated version, not the performing version, but the honest, daily, trying version. Answer five questions below as honestly as you can. Your answers will be woven into a letter written <em>to you, by you</em> — addressed to the parts of yourself that need to hear it most today.</p>
      <p style={{ color: 'var(--muted)', fontSize: '14px', fontStyle: 'italic', marginBottom: '4px' }}>Nothing you write is stored, sent, or visible to anyone else. This is entirely private.</p>

      <LoveLetterGenerator />

      {/* ── Section 4 ── */}
      <h3 id="solo-ideas">4. Five Solo Valentine's Celebration Ideas That Actually Work</h3>
      <p>The standard advice — "treat yourself to chocolate, watch a rom-com" — is fine, but it is generic. These five ideas are designed to leave you feeling genuinely better at the end of the day, not just distracted through it.</p>

      <p><strong>1. The Sensory Evening.</strong> Choose one activity that engages each of your senses in something genuinely pleasurable — your favourite meal cooked from scratch (taste), a long warm shower with a good product (touch), music that moves you played properly not through a phone speaker (sound), candles or your favourite scent (smell), and one beautiful thing to look at — a film, a walk in golden hour light, a book with gorgeous design (sight). Pleasure in solitude is not a lesser pleasure. It is often the purest form of it.</p>

      <p><strong>2. The Gratitude Inventory — About Yourself.</strong> Gratitude lists are typically about external things. Tonight, write one about yourself. Not your achievements — your qualities. The way you listen. The loyalty you show people. The times you tried something that scared you. The small kindnesses nobody noticed. Write at least ten. Most people cannot get past four without feeling uncomfortable — which is exactly why this is worth doing.</p>

      <p><strong>3. The Future Self Letter.</strong> Write a letter from your future self — five years from now — to the person reading this today. What do you know in that future that you could not see now? What do you wish you had been kinder to yourself about? What would you tell yourself not to worry about? This exercise is used in clinical self-compassion therapy and consistently produces what researchers call a "compassionate detachment" — the ability to see yourself from a caring distance.</p>

      <p><strong>4. The Unfollowing Ritual.</strong> Spend twenty minutes auditing your social media feeds and unfollowing or muting every account that consistently leaves you feeling worse about yourself. This is not dramatic or permanent — it is basic emotional hygiene. Your social media feed is a curated environment. You are allowed to curate it in your favour.</p>

      <p><strong>5. The Permission Slip.</strong> Write yourself a formal permission slip for something you have been denying yourself — permission to rest without guilt, to spend money on something that brings you joy, to want what you actually want, to stop pursuing a goal that belongs to someone else's vision for your life, to take up more space. Make it specific. Sign it. Put it somewhere you will see it tomorrow.</p>

      {/* ── Section 5 ── */}
      <h3 id="red-flags">5. Red Flags That Signal You Are Outsourcing Your Self-Worth</h3>
      <p>Self-love is not something you either have or do not have. It is a practice that erodes quietly under certain conditions, often without you noticing. These are the patterns that signal it has been eroding.</p>
      <p><strong>You cannot tolerate being alone for extended periods</strong> without filling the silence with content, noise, or social contact. This is not introversion or extroversion — it is the discomfort of being left alone with a self you are not entirely comfortable with.</p>
      <p><strong>Your mood is primarily determined by how other people respond to you.</strong> A compliment makes the day good. A curt reply makes it bad. This degree of external mood regulation suggests that your internal emotional ecosystem is running on borrowed fuel.</p>
      <p><strong>You find it genuinely difficult to receive care.</strong> People who struggle to let others help, compliment, or comfort them often do so because they do not believe they deserve it. This is not humility. It is a form of self-rejection wearing humility's clothing.</p>
      <p><strong>You are significantly kinder to other people about their mistakes than you are to yourself about yours.</strong> This double standard is the clearest diagnostic for conditional self-love — love that is contingent on performing adequately.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Valentine's Self-Love FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: Is it okay to feel sad about being single on Valentine's Day?</strong><br />
        A: Completely. Acknowledging that you want something you do not currently have is not self-pity — it is honesty. The goal of self-love is not to stop wanting connection. It is to stop making the absence of connection mean something terrible about you. You can want more and still treat yourself well in the meantime.</p>

        <p><strong>Q: Can you practise self-love if you are in a relationship?</strong><br />
        A: Yes — and it is arguably more important in a relationship than outside one. The most common way self-love erodes in relationships is when we start outsourcing all of our emotional needs to one person, making them responsible for our self-worth. Maintaining your own practices, friendships, and internal sense of value is not self-centredness. It is what makes you a sustainable partner.</p>

        <p><strong>Q: What if self-love feels fake or forced?</strong><br />
        A: It almost always does at first, and that is not a sign that you are doing it wrong. It is a sign that you are doing something unfamiliar. The discomfort of treating yourself kindly when it does not feel natural is exactly the same discomfort of any new practice — it fades with repetition. The moments of genuine warmth toward yourself, which will come, are not performances. They are the real thing emerging through the practice.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: ROSE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You yourself, as much as anybody in the entire universe, deserve your love and affection."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Attributed to the Buddha</p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          Whoever is waiting to love you romantically will arrive — or they already have — and when that happens, you will be ready. Not because you waited perfectly, but because you used the waiting to become someone who knows how to love well. And that starts here.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: ROSE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${BORDER}` }}
          >
            Continue in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: ROSE, border: `2px solid ${ROSE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your Valentine's Thoughts Anonymously
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More on the Journey of Loving Yourself:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-love-insecurity')} style={{ background: 'none', border: 'none', color: ROSE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Love Yourself Even When You Feel Insecure
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/psychology-self-love')} style={{ background: 'none', border: 'none', color: ROSE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → The Psychology Behind Self-Love and Emotional Wellbeing
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/handling-rejection')} style={{ background: 'none', border: 'none', color: ROSE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Handle Rejection Without Losing Confidence
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: ROSE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
