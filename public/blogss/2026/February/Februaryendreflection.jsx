import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "End-of-Month Reflection: Self-Love and Relationship Growth in February",
  excerpt: "February asked you to look at yourself and your relationships honestly. Before you close the month, take thirty minutes to reflect on what actually shifted, what you are still carrying, and where you want to go next. This guide includes journaling prompts, a February growth checklist, and an interactive reflection tool to help you close the month with intention.",
  category: "Mental Health",
  date: "28-02-2026",
  readTime: "6 min read",
  wordCount: 950,
  imgUrl: "/blogss/2026/February/february-self-love-reflection.jpg",
  tldr: "End-of-month reflections are one of the most underused tools for genuine personal growth. This closing guide for February takes stock of the self-love and relationship work done this month, gives you twelve journaling prompts across four reflection areas, a growth checklist to mark what shifted and what did not, and a personal intentions tool for the month ahead.",
  toc: [
    { id: "why-reflect",    title: "1. Why End-of-Month Reflection Actually Works",               level: 3 },
    { id: "what-february",  title: "2. What February Asked of You",                               level: 3 },
    { id: "reflection-tool",title: "3. Interactive: The February Growth Reflection Tool",         level: 3 },
    { id: "prompts",        title: "4. Twelve Journaling Prompts to Close the Month",             level: 3 },
    { id: "forward",        title: "5. Carrying It Forward: Setting Intentions for March",        level: 3 },
    { id: "faq",            title: "6. End-of-Month Reflection FAQs",                             level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-28T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "end of month reflection, self-love reflection, february self-love, monthly reflection journaling, relationship growth reflection, self-reflection prompts, monthly review mental health",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is monthly self-reflection important for mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Monthly reflection creates what psychologists call metacognitive awareness — the ability to observe your own thinking, patterns, and growth from a slight distance. Research by psychologist Tasha Eurich shows that regular structured self-reflection (as distinct from rumination, which reviews without conclusion) significantly increases emotional intelligence, decision quality, and resilience. A month is long enough to contain meaningful change and short enough to remember accurately — making it the ideal unit for personal growth review.",
      },
    },
    {
      "@type": "Question",
      "name": "What are good journaling prompts for self-love and relationship growth?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective journaling prompts for self-love and relationship growth are specific, honest, and forward-facing. Effective examples include: What is one way I treated myself better this month than last month? Where did I prioritise others' comfort over my own honesty — and what did that cost? What did I learn about what I need in relationships that I did not know clearly before? What would I do differently if I could repeat this month? What is the most important thing I want to carry forward?",
      },
    },
    {
      "@type": "Question",
      "name": "How do I make end-of-month reflections a consistent habit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective approach is to schedule it as a non-negotiable recurring event — last day of each month, same time, same format — rather than attempting it when inspiration strikes. Keep the format simple enough to complete in thirty minutes. Use a consistent set of prompts that you adapt slightly each month rather than reinventing the structure every time. And write it somewhere you will read it again — not to judge your past self but to track genuine movement over time.",
      },
    },
  ],
};

// ── Reflection Tool Data ───────────────────────────────────────────────────────
const GOLD    = '#B07B2A';
const GPALE   = '#FBF5EA';
const GBORDER = 'rgba(176,123,42,0.22)';

const CHECKLIST_SECTIONS = [
  {
    id:    'self_love',
    icon:  '💛',
    title: 'Self-Love',
    items: [
      { id: 'sl1', text: 'I have been speaking to myself more kindly than I was at the start of the month' },
      { id: 'sl2', text: 'I took at least one deliberate action this month purely because it nourished me' },
      { id: 'sl3', text: 'I practised some form of self-forgiveness — letting go of something I had been holding against myself' },
      { id: 'sl4', text: 'I said no to at least one thing I did not want to do, without excessive guilt' },
      { id: 'sl5', text: 'I spent meaningful time alone — not as avoidance, but as genuine self-companionship' },
    ],
  },
  {
    id:    'relationships',
    icon:  '🤝',
    title: 'Relationships',
    items: [
      { id: 'r1', text: 'I communicated a genuine need or feeling directly in at least one relationship this month' },
      { id: 'r2', text: 'I recognised or addressed at least one pattern in my relationships that was not serving me' },
      { id: 'r3', text: 'I invested genuine attention in a relationship that gives me real energy and reciprocity' },
      { id: 'r4', text: 'I held or attempted to hold at least one emotional boundary that I have previously let slide' },
      { id: 'r5', text: 'I was honest — with myself at least — about how a specific relationship is actually affecting me' },
    ],
  },
  {
    id:    'growth',
    icon:  '🌱',
    title: 'Inner Growth',
    items: [
      { id: 'g1', text: 'I learned something specific about myself — a pattern, a need, a tendency — that I did not see clearly before' },
      { id: 'g2', text: 'I chose to engage with something difficult rather than avoiding it' },
      { id: 'g3', text: 'My understanding of what I actually want — in life, relationships, or work — is clearer now than it was on February 1st' },
      { id: 'g4', text: 'I made at least one mistake this month that I learned from and did not spend excessive time punishing myself for' },
    ],
  },
  {
    id:    'moving_forward',
    icon:  '🚀',
    title: 'Moving Forward',
    items: [
      { id: 'mf1', text: 'I have identified at least one thing I want to do differently in March' },
      { id: 'mf2', text: 'I can name one specific habit or practice from February that I want to protect and continue' },
      { id: 'mf3', text: 'I feel, overall, slightly more capable of taking care of myself than I did at the start of the month' },
    ],
  },
];

const JOURNAL_PROMPTS = [
  { area: 'Self', icon: '💛', prompt: 'What is one way I treated myself better in February than I did in January? What made that shift possible?' },
  { area: 'Self', icon: '💛', prompt: 'What is the harshest thing I said to myself this month — and what would I say to a close friend who said that about themselves?' },
  { area: 'Self', icon: '💛', prompt: 'Where did I prioritise other people\'s comfort over my own honesty this month? What did that cost me?' },
  { area: 'Relationships', icon: '🤝', prompt: 'Which relationship gave me the most genuine energy this month? What specifically made it nourishing?' },
  { area: 'Relationships', icon: '🤝', prompt: 'Which relationship cost me the most this month? Am I honest with myself about why I continue to invest in it the way I do?' },
  { area: 'Relationships', icon: '🤝', prompt: 'Is there a conversation I have been avoiding in a relationship this month? What am I actually afraid will happen if I have it?' },
  { area: 'Growth', icon: '🌱', prompt: 'What is the most important thing I learned about myself in February — not from a blog or a lesson, but from my own experience?' },
  { area: 'Growth', icon: '🌱', prompt: 'What pattern — in myself or in my relationships — became visible to me this month that I had not clearly seen before?' },
  { area: 'Growth', icon: '🌱', prompt: 'What would I do differently if I could repeat this month — not to make it perfect, but to align it more closely with who I want to be?' },
  { area: 'Forward', icon: '🚀', prompt: 'What is the single most important thing I want to carry from February into March? How will I make sure I actually do?' },
  { area: 'Forward', icon: '🚀', prompt: 'What am I willing to let go of — a belief, a habit, a relationship dynamic, a story about myself — as I close this month?' },
  { area: 'Forward', icon: '🚀', prompt: 'Six months from now, looking back at February 2026, what do I want to be able to say about what this month meant for me?' },
];

const INTENTIONS_OPTIONS = [
  { id: 'i1',  area: 'Self-Talk',       text: 'Speak to myself with the same kindness I would give to someone I love' },
  { id: 'i2',  area: 'Boundaries',      text: 'Hold at least one boundary this month that I have previously let slide' },
  { id: 'i3',  area: 'Self-Care',       text: 'Protect one non-negotiable self-care practice, no matter how busy March gets' },
  { id: 'i4',  area: 'Communication',   text: 'Say one difficult true thing in a relationship rather than avoiding it' },
  { id: 'i5',  area: 'Connection',      text: 'Invest genuine time in one relationship that consistently gives me energy' },
  { id: 'i6',  area: 'Self-Knowledge',  text: 'Keep a brief daily emotion log to understand my patterns more clearly' },
  { id: 'i7',  area: 'Identity',        text: 'Reconnect with one interest or activity that is entirely mine — not shared or performed for anyone' },
  { id: 'i8',  area: 'Forgiveness',     text: 'Let go of one thing I have been holding against myself' },
  { id: 'i9',  area: 'Presence',        text: 'Be more fully present in my good moments — not rushing past them to the next task' },
  { id: 'i10', area: 'Solitude',        text: 'Protect meaningful time alone — not from loneliness, but for genuine self-companionship' },
  { id: 'i11', area: 'Growth',          text: 'Do one thing that scares me slightly in a good way — something that requires me to show up more fully' },
  { id: 'i12', area: 'Relationships',   text: 'Be honest with myself about one relationship that needs to either change or end' },
];

// ── Interactive Tool Component ──────────────────────────────────────────────────
function FebruaryReflectionTool() {
  const [tab,          setTab]          = useState('checklist');
  const [checked,      setChecked]      = useState({});
  const [checkDone,    setCheckDone]    = useState(false);
  const [openPrompt,   setOpenPrompt]   = useState(null);
  const [intentions,   setIntentions]   = useState([]);
  const [intSubmitted, setIntSubmitted] = useState(false);

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  // Checklist totals
  const totalItems    = CHECKLIST_SECTIONS.reduce((t, s) => t + s.items.length, 0);
  const checkedCount  = Object.values(checked).filter(Boolean).length;
  const checkProgress = Math.round((checkedCount / totalItems) * 100);

  const toggleCheck = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const toggleIntent = (id) => setIntentions(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 3 ? [...p, id] : p);

  const TAB_STYLE = (active) => ({
    flex: 1, padding: '10px 4px', border: 'none', borderRadius: '8px',
    background: active ? `linear-gradient(135deg, ${GOLD}, #D4A040)` : 'transparent',
    color: active ? 'white' : 'var(--muted)', fontWeight: '700', fontSize: '13px',
    cursor: 'pointer', fontFamily: font, transition: 'all 0.2s',
  });

  const sectionScores = CHECKLIST_SECTIONS.map(sec => ({
    sec,
    count: sec.items.filter(item => checked[item.id]).length,
    total: sec.items.length,
  }));

  const selectedIntentions = INTENTIONS_OPTIONS.filter(o => intentions.includes(o.id));

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--border)', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
        {[
          { key: 'checklist',  label: '✅ Growth Checklist' },
          { key: 'journal',    label: '📓 Journal Prompts'  },
          { key: 'intentions', label: '🚀 March Intentions' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={TAB_STYLE(tab === t.key)}>{t.label}</button>
        ))}
      </div>

      {/* ── CHECKLIST TAB ── */}
      {tab === 'checklist' && (
        <>
          {!checkDone ? (
            <>
              <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
                Your February Growth Checklist
              </p>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                Tick every item that is genuinely true for you this month — not aspirationally true, actually true. Be honest with yourself more than impressive to anyone else.
              </p>

              {/* Progress */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>{checkedCount} of {totalItems} items ticked</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: GOLD }}>{checkProgress}%</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(176,123,42,0.15)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${checkProgress}%`, background: `linear-gradient(90deg, ${GOLD}, #D4A040)`, borderRadius: '5px', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              {CHECKLIST_SECTIONS.map(sec => (
                <div key={sec.id} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', marginBottom: '10px', border: '1.5px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: GOLD, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{sec.icon}</span>{sec.title}
                  </div>
                  {sec.items.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '11px', marginBottom: '11px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                      <div onClick={() => toggleCheck(item.id)} style={{
                        width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                        border: '2px solid', borderColor: checked[item.id] ? GOLD : 'var(--border)',
                        background: checked[item.id] ? `linear-gradient(135deg, ${GOLD}, #D4A040)` : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: 'white', transition: 'all 0.15s', cursor: 'pointer',
                      }}>{checked[item.id] ? '✓' : ''}</div>
                      <span onClick={() => toggleCheck(item.id)} style={{ fontSize: '14px', color: checked[item.id] ? 'var(--muted)' : 'var(--ink)', lineHeight: 1.55, textDecoration: checked[item.id] ? 'line-through' : 'none', transition: 'all 0.2s', userSelect: 'none' }}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              ))}

              <button onClick={() => setCheckDone(true)} style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none', marginTop: '4px',
                background: `linear-gradient(135deg, ${GOLD}, #D4A040)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${GBORDER}`,
              }}>See My February Summary →</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              {/* Summary */}
              <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A040)`, borderRadius: '14px', padding: '24px', marginBottom: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {checkProgress >= 80 ? '🌟' : checkProgress >= 55 ? '🌱' : '🌿'}
                </div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                  February Growth: {checkProgress}%
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, maxWidth: '400px', margin: '0 auto' }}>
                  {checkProgress >= 80
                    ? 'You invested meaningfully in yourself this month. That investment shows — and it compounds.'
                    : checkProgress >= 55
                    ? 'Real movement happened this month, even if it was quieter than you hoped. What shifted is real.'
                    : 'February was hard, or you were gentler on yourself than you expected to be. Both are okay. The next month begins with what you learned, not with a score.'}
                </div>
              </div>

              {/* Per-section */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${GBORDER}` }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '14px' }}>
                  Your Growth Across Four Areas
                </div>
                {sectionScores.map(({ sec, count, total }) => {
                  const pct   = Math.round((count / total) * 100);
                  const color = pct >= 80 ? '#2D7D46' : pct >= 50 ? '#C07800' : '#C0392B';
                  return (
                    <div key={sec.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {sec.icon} {sec.title}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color }}>{count}/{total}</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '6px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* What to carry */}
              <div style={{ background: GPALE, border: `2px solid ${GBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: GOLD, marginBottom: '8px' }}>
                  💡 What Your Score Actually Means
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                  {checkProgress >= 80
                    ? 'You showed up for yourself consistently this month. The unchecked items are not failures — they are the honest frontier of your next chapter. Look at them with curiosity, not judgement.'
                    : checkProgress >= 55
                    ? 'More than half of this list reflects real movement. The items you did not tick are worth looking at — not as evidence that you failed, but as the most specific map of what you actually need to focus on in March.'
                    : 'The items you did not tick are worth sitting with — not with self-criticism, but with genuine curiosity. Why did they not happen? What got in the way? The honest answer is the most useful thing February can give you going into March.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setCheckDone(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: `1.5px solid ${GBORDER}`, background: 'transparent', color: GOLD, fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Review Again</button>
                <button onClick={() => setTab('journal')} style={{ flex: 1, padding: '12px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${GOLD}, #D4A040)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>Go to Journal Prompts →</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── JOURNAL PROMPTS TAB ── */}
      {tab === 'journal' && (
        <>
          <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Twelve Journaling Prompts — Choose the Ones That Have Charge
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            You do not have to answer all twelve. Choose the three that feel the most uncomfortable to answer — those are the ones with the most information in them. Open each one to expand it.
          </p>

          {['Self', 'Relationships', 'Growth', 'Forward'].map(area => {
            const areaPrompts = JOURNAL_PROMPTS.filter(p => p.area === area);
            const areaIcon = areaPrompts[0]?.icon;
            return (
              <div key={area} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: GOLD, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>{areaIcon}</span>{area === 'Self' ? 'Self-Love' : area === 'Forward' ? 'Moving Forward' : area}
                </div>
                {areaPrompts.map((p, i) => {
                  const key = `${area}_${i}`;
                  const isOpen = openPrompt === key;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                      <button onClick={() => setOpenPrompt(isOpen ? null : key)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)', lineHeight: 1.5 }}>
                          {p.prompt.length > 80 ? p.prompt.slice(0, 80) + '…' : p.prompt}
                        </span>
                        <span style={{ color: GOLD, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '14px 0 12px 0', fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: GOLD, fontStyle: 'italic', lineHeight: 1.65 }}>
                            "{p.prompt}"
                          </p>
                          <div style={{ background: GPALE, borderRadius: '8px', padding: '10px 14px', border: `1px solid ${GBORDER}` }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: GOLD, marginBottom: '4px' }}>
                              Writing tip
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                              Write without editing for at least five minutes. The first thing you write is usually the most defended. Keep going past it.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button onClick={() => setTab('intentions')} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none', marginTop: '4px',
            background: `linear-gradient(135deg, ${GOLD}, #D4A040)`, color: 'white',
            fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
            boxShadow: `0 6px 20px ${GBORDER}`,
          }}>Set My March Intentions →</button>
        </>
      )}

      {/* ── INTENTIONS TAB ── */}
      {tab === 'intentions' && (
        <>
          {!intSubmitted ? (
            <>
              <p style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
                Choose Your Three Intentions for March
              </p>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                Not goals — intentions. A goal is achieved or not. An intention is a direction you keep returning to, even when you fall short. Choose three that feel genuinely true to what you need next.
              </p>
              <p style={{ margin: '0 0 14px 0', fontSize: '12px', fontWeight: '700', color: GOLD }}>
                {intentions.length}/3 selected {intentions.length === 3 && '— you have reached the limit. Deselect one to choose differently.'}
              </p>

              {INTENTIONS_OPTIONS.map(opt => {
                const isSel  = intentions.includes(opt.id);
                const isMax  = intentions.length >= 3 && !isSel;
                return (
                  <button key={opt.id} onClick={() => !isMax && toggleIntent(opt.id)} style={{
                    width: '100%', padding: '13px 16px', borderRadius: '11px', border: '2px solid',
                    borderColor: isSel ? GOLD : 'var(--border)',
                    background: isSel ? GPALE : isMax ? '#fafafa' : 'white',
                    cursor: isMax ? 'not-allowed' : 'pointer', fontFamily: font, textAlign: 'left',
                    display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '7px',
                    opacity: isMax ? 0.5 : 1, transition: 'all 0.15s',
                    boxShadow: isSel ? `0 0 0 3px ${GBORDER}` : 'none',
                  }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                      background: isSel ? `linear-gradient(135deg, ${GOLD}, #D4A040)` : 'var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: 'white', transition: 'all 0.15s',
                    }}>{isSel ? '✓' : ''}</div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: GOLD, marginBottom: '2px' }}>{opt.area}</div>
                      <div style={{ fontSize: '14px', fontWeight: isSel ? '600' : '500', color: isSel ? GOLD : 'var(--ink)', lineHeight: 1.5 }}>{opt.text}</div>
                    </div>
                  </button>
                );
              })}

              <button onClick={() => { if (intentions.length === 3) setIntSubmitted(true); }} disabled={intentions.length !== 3} style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none', marginTop: '10px',
                background: intentions.length === 3 ? `linear-gradient(135deg, ${GOLD}, #D4A040)` : 'var(--border)',
                color: 'white', fontWeight: '700', fontSize: '15px',
                cursor: intentions.length === 3 ? 'pointer' : 'not-allowed', fontFamily: font,
                boxShadow: intentions.length === 3 ? `0 6px 20px ${GBORDER}` : 'none',
              }}>
                {intentions.length === 3 ? 'Commit to My March Intentions →' : `Select ${3 - intentions.length} more intention${3 - intentions.length !== 1 ? 's' : ''} to continue`}
              </button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A040)`, borderRadius: '14px', padding: '24px', marginBottom: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>🌅</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                  Your March Intentions
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)' }}>
                  Three directions. One month. Return to these when you lose your way.
                </div>
              </div>

              {selectedIntentions.map((opt, i) => (
                <div key={opt.id} style={{
                  background: 'white', borderRadius: '12px', padding: '16px 18px', marginBottom: '10px',
                  border: `2px solid ${GBORDER}`, borderLeft: `4px solid ${GOLD}`,
                }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: GOLD, marginBottom: '5px' }}>
                    Intention {i + 1} — {opt.area}
                  </div>
                  <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: GOLD, fontStyle: 'italic', lineHeight: 1.55 }}>
                    "{opt.text}"
                  </p>
                </div>
              ))}

              <div style={{ background: GPALE, border: `1.5px dashed ${GBORDER}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: GOLD, marginBottom: '8px' }}>
                  📌 How to Make These Land
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                  Write these three intentions somewhere you will see them daily — not on a digital note that gets buried, but somewhere physical. Read them at the start of each week. Not as a performance review, but as a compass check: "Am I moving in this direction today?" The intention does not require perfection. It just requires returning.
                </p>
              </div>

              <button onClick={() => { setIntentions([]); setIntSubmitted(false); }} style={{
                background: 'transparent', border: `1.5px solid ${GBORDER}`, color: GOLD,
                padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Choose different intentions</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FebruaryEndReflection({ navigate, relatedPosts }) {
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
      <p>February is over. Twenty-eight days of being asked to look — at yourself, at your relationships, at the patterns that quietly shape your life. Some of that looking was uncomfortable. Some of it surprised you. Some of it confirmed things you already knew but had not yet named.</p>

      <p>Before you move on, take thirty minutes to close the month deliberately. Not to judge what you did or did not accomplish, but to genuinely receive what this month offered — and to set a clear intention for what comes next. End-of-month reflections are one of the most underused tools for genuine personal growth. They are also one of the simplest. All they require is honesty and a little time.</p>

      <img
        src={meta.imgUrl}
        alt="Person doing an end-of-month reflection on self-love and relationship growth — journalling, reviewing, and setting intentions for March"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-reflect">1. Why End-of-Month Reflection Actually Works</h3>
      <p>Most people experience personal growth as something that happens to them — a gradual, largely invisible accumulation of experience that only becomes apparent in retrospect. End-of-month reflection is the practice of making that accumulation visible while it is still recent enough to examine clearly. It transforms experience from something that passes through you into something you can learn from deliberately.</p>
      <p>The psychological mechanism is what researchers call <em>metacognitive awareness</em> — the ability to observe your own thoughts, feelings, and patterns from a slight distance. Research by Tasha Eurich at the University of Colorado shows that this kind of structured self-reflection, when done honestly and with specific questions rather than open-ended rumination, produces measurable increases in emotional intelligence, decision-making quality, and resilience. The key word is "structured." Aimless self-reflection tends to become either self-criticism or self-justification. Structured reflection — with specific, honest prompts — tends to produce genuine insight.</p>
      <p>A month is the ideal unit for this kind of review. It is long enough to contain meaningful shifts — habits attempted, patterns noticed, conversations had or avoided, relationships that deepened or became clearer. And it is short enough to remember honestly — to access what actually happened rather than a heavily edited retrospective version of it. Thirty minutes at the end of each month, done consistently, produces a more accurate and compassionate self-understanding than years of unreflective living.</p>

      {/* ── Section 2 ── */}
      <h3 id="what-february">2. What February Asked of You</h3>
      <p>This February at Secret Sharz was a sustained invitation into honest self-examination across two interconnected themes: how you relate to yourself, and how you relate to others. The month moved through self-love and insecurity, through the psychology of self-acceptance and emotional boundaries, through the dynamics of toxic relationships and peer pressure, through red flags and repair, through the role of self-care in building healthy connections, and finally through the full arc of healing and growth.</p>
      <p>What February actually asked of you was more than reading. It asked you to notice — the quality of your inner voice, the dynamics you had been accepting without examination, the needs you had been burying under other people's comfort, the patterns that show up reliably when you are under pressure. It asked you to be curious about yourself rather than judgemental, and to apply the same care to your own inner life that you might more naturally extend to the people around you.</p>
      <p>Not everyone arrived at the same place. Some of this month's content will have landed like confirmation of things you already knew. Some of it will have landed like new information. Some of it will have produced a discomfort that is the specific feeling of something true being said about something you had been avoiding. All of those responses are valid. All of them are worth sitting with before the month closes.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="reflection-tool">3. Interactive: The February Growth Reflection Tool</h3>
      <p>The tool has three sections — work through them in order or move between them as you need. The Growth Checklist takes stock of what actually shifted in February. The Journaling Prompts give you twelve specific questions across four reflection areas — choose the three that feel most uncomfortable to answer. And the March Intentions tool asks you to choose three specific directions to carry forward from what this month taught you.</p>

      <FebruaryReflectionTool />

      {/* ── Section 4 ── */}
      <h3 id="prompts">4. Twelve Journaling Prompts to Close the Month</h3>
      <p>The prompts above are interactive. Below is the full set in writing — for those who prefer to journal with pen and paper, or who want to return to specific ones over the coming days rather than answering them all at once.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
        {JOURNAL_PROMPTS.map((p, i) => (
          <div key={i} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '11px', padding: '15px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: `linear-gradient(135deg, ${GOLD}, #D4A040)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              {p.prompt}
            </p>
          </div>
        ))}
      </div>

      <p>A note on how to use these: do not answer them in your head. Write. The act of writing forces specificity that mental review avoids. The first sentence is usually the most defended. The most useful information comes after you have written through it.</p>

      {/* ── Section 5 ── */}
      <h3 id="forward">5. Carrying It Forward: Setting Intentions for March</h3>
      <p>The difference between a resolution and an intention is important. A resolution is a commitment to a specific outcome — it is achieved or it is not, and the failure to achieve it tends to produce shame that makes future attempts harder. An intention is a commitment to a direction — it does not require perfection, just repeated return. You set an intention, you inevitably fall short at some point, and you return to it. That return is the practice.</p>
      <p>The most effective intentions for the coming month are specific enough to be actionable but not so prescriptive that they collapse the moment circumstances change. "I will practise speaking to myself more kindly" is an intention. "I will say three positive affirmations every morning" is a resolution — useful for some people, brittle for many others. The intention survives the bad week. The resolution often does not.</p>
      <p>As you set your intentions for March, consider what February genuinely illuminated — not what you think you should work on, but what the month actually showed you about where your attention is most needed. The most useful intentions are not the ones that look most impressive. They are the ones that address what you already know, honestly, needs to change.</p>
      <p>Write them somewhere physical — not just in an app or a digital note that will be buried under notifications by next Tuesday. A notebook. A sticky note on your mirror. The inside of your journal. Somewhere that will ask you to look at them without you having to choose to open something. Intentions need visibility to stay alive.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. End-of-Month Reflection FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if February felt like a month where I did not grow at all?</strong><br />
        A: The months that feel like stagnation are almost always months of quiet consolidation or necessary rest — and both of those are legitimate and important forms of growth that do not show up in a checklist. If the honest answer is "I did not grow this month," the most useful follow-up question is: "What specifically got in the way?" The answer to that question is the growth edge for March. Not having grown is not a verdict on your capacity to grow. It is information about what the next step needs to address.</p>

        <p><strong>Q: Is it normal for some journaling prompts to feel too difficult to answer?</strong><br />
        A: Yes — and a prompt that feels too difficult to answer is almost always the one most worth attempting. The resistance is usually a sign that the question is touching something real. If you cannot answer a prompt in full, try answering just the first sentence — what is the first thing that comes to mind before the defensive editing begins? That first response is often the most honest and the most useful starting point.</p>

        <p><strong>Q: What if I set intentions and then completely forget them two weeks into March?</strong><br />
        A: Then you return to them. Not with shame or self-punishment — with the simple recognition that intentions require re-engagement, not perfect continuity. The fact that you forget and return is not evidence that the intention did not work. It is the whole practice. Set a reminder for the 15th of March to check in with yourself: "Am I moving in the direction I intended?" That is all it requires.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>A Note to Close February</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: GOLD, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "The curious paradox is that when I accept myself just as I am, then I can change."
        </h2>
        <p style={{ marginBottom: '8px', color: 'var(--muted)', fontSize: '13px' }}>— Carl Rogers</p>
        <p style={{ marginBottom: '16px', color: 'var(--ink-soft)', marginTop: '16px' }}>
          February was not about becoming perfect. It was about becoming more honest — with yourself about what you need, with others about what you feel, and with both about what you will and will not accept. That honesty is not comfortable and it does not arrive all at once. It is built slowly, through attention and practice and the willingness to keep looking even when what you find is complicated.
        </p>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Whatever this month brought — whatever you saw clearly, whatever you are still figuring out, whatever you tried and whatever you avoided — you showed up enough to be reading this. That counts. March begins tomorrow. Take what you learned.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: GOLD, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${GBORDER}` }}
          >
            Continue Reflecting in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: GOLD, border: `2px solid ${GOLD}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Your February on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking: The Full February Series ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
          The Full February Series — Everything You Can Return To:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            ['/blog/handling-rejection',          'How to Handle Rejection Without Losing Confidence'],
            ['/blog/valentines-self-love',         "Valentine's Day Self-Love Guide"],
            ['/blog/self-kindness-check',          'Mid-Month Reset: Are You Treating Yourself with Kindness?'],
            ['/blog/social-media-comparison',      'How to Stop Comparing Yourself on Social Media'],
            ['/blog/self-respect-vs-ego',          'Self-Respect vs Ego: The Real Difference'],
            ['/blog/self-acceptance-confidence',   'How to Build Confidence Through Self-Acceptance'],
            ['/blog/saying-no-mental-health',      "Why Saying No is Important for Mental Health"],
            ['/blog/relationships-mental-health',  'How Relationships Affect Your Mental Health'],
            ['/blog/relationship-red-flags',       'How to Identify Red Flags in Relationships Early'],
            ['/blog/self-care-relationships',      'The Role of Self-Care in Healthy Relationships'],
            ['/blog/peer-pressure-students',       'How to Deal with Peer Pressure'],
            ['/blog/emotional-boundaries',         'Emotional Boundaries: What They Are'],
            ['/blog/relationship-with-yourself',   'How to Build a Relationship with Yourself'],
            ['/blog/relationship-mistakes-students','Common Relationship Mistakes Students Make'],
            ['/safe',                              'Access 24/7 Professional Support'],
          ].map(([path, label]) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: GOLD, lineHeight: 1.4, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'all 0.15s' }}
            >
              → {label}
            </button>
          ))}
        </div>
      </div>

    </BlogPostTemplate>
  );
}
