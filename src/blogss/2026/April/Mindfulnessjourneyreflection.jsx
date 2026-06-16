import React, { useState, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "End-of-Month Reflection: Your Mindfulness Journey",
  excerpt: "April has been a month of thirty-one practices, thirty days of opportunity, and one consistent invitation: to turn toward your inner life with curiosity and kindness rather than away from it. This final blog is not another technique — it is a space to look back at what the month produced, to honour what shifted, and to carry forward what genuinely served you into May's mental health awareness month.",
  category: "Mental Health",
  date: "30-04-2026",
  readTime: "6 min read",
  wordCount: 900,
  imgUrl: "/blogss/2026/April/mindfulness-journey-reflection.jpg",
  tldr: "April's mindfulness series offered 29 practices across breathing, emotional regulation, focus, grounding, self-connection, and daily routines. This reflection blog provides a growth checklist, five journaling prompts, and a forward-looking CTA into May's mental health awareness content. The most important question: what specifically changed in how you relate to your own experience over this month?",
  toc: [
    { id: "what-month",  title: "1. What April's Mindfulness Month Was About",                       level: 3 },
    { id: "research",    title: "2. What One Month of Practice Actually Produces",                   level: 3 },
    { id: "review",      title: "3. Interactive: The April Journey Review",                          level: 3 },
    { id: "prompts",     title: "4. Journaling Prompts for Month-End Reflection",                   level: 3 },
    { id: "forward",     title: "5. Carrying Forward — What to Keep, What to Build",               level: 3 },
    { id: "may",         title: "6. Into May — Mental Health Awareness Month",                       level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-30T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mindfulness journey reflection, end of month mindfulness, monthly mindfulness review, mindfulness growth checklist, April mindfulness reflection, mindfulness journaling prompts, mental health awareness May",
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const GOLD   = '#8A6820';
const GPALE  = '#F8F3E6';
const GBORD  = 'rgba(138,104,32,0.22)';

// ── Growth Areas ───────────────────────────────────────────────────────────────
const GROWTH_AREAS = [
  {
    id:    'breathing',
    icon:  '😮‍💨',
    title: 'Breathing & Physiological Regulation',
    color: '#1A7272',
    bg:    '#EBF5F5',
    items: [
      { id: 'b1', text: 'I know how to do the physiological sigh and have used it' },
      { id: 'b2', text: 'I have tried box breathing (4-4-4-4) during a stressful moment' },
      { id: 'b3', text: 'I understand why the extended exhale calms the nervous system' },
      { id: 'b4', text: 'I have used breathing to interrupt an anxiety or stress spike' },
      { id: 'b5', text: 'Breath-based practices feel more accessible than they did a month ago' },
    ],
  },
  {
    id:    'grounding',
    icon:  '👣',
    title: 'Grounding & Presence',
    color: '#9A6040',
    bg:    '#FAF3EE',
    items: [
      { id: 'g1', text: 'I have practised the 5-4-3-2-1 grounding technique' },
      { id: 'g2', text: 'I know what feet-on-floor grounding is and can do it anywhere' },
      { id: 'g3', text: 'I have used a grounding technique during a genuinely stressful moment' },
      { id: 'g4', text: 'I am more aware of when I am mentally absent from the present moment' },
      { id: 'g5', text: 'I have walked somewhere mindfully — without the phone — at least once' },
    ],
  },
  {
    id:    'emotional',
    icon:  '💛',
    title: 'Emotional Awareness & Regulation',
    color: '#A05070',
    bg:    '#F8EEF3',
    items: [
      { id: 'e1', text: 'I have named a specific emotion more precisely than "stressed" or "fine"' },
      { id: 'e2', text: 'I understand the difference between suppressing and processing an emotion' },
      { id: 'e3', text: 'I have used the STOP technique in a reactive moment' },
      { id: 'e4', text: 'I can identify at least one emotional pattern I did not recognise a month ago' },
      { id: 'e5', text: 'I feel more like the one experiencing my emotions rather than being driven by them' },
    ],
  },
  {
    id:    'focus',
    icon:  '🎯',
    title: 'Focus & Mental Clarity',
    color: '#3858A8',
    bg:    '#EBF0FA',
    items: [
      { id: 'f1', text: 'I understand why phone proximity reduces focus even when not in use' },
      { id: 'f2', text: 'I have studied with the phone in a different room at least once' },
      { id: 'f3', text: 'I have used a pre-study ritual (brain dump + sighs + one written task)' },
      { id: 'f4', text: 'I have tried the noting technique during a study session' },
      { id: 'f5', text: 'I notice mind-wandering more quickly than I did a month ago' },
    ],
  },
  {
    id:    'selfconnect',
    icon:  '🌸',
    title: 'Self-Connection & Reflection',
    color: '#7A3858',
    bg:    '#F8EEF3',
    items: [
      { id: 's1', text: 'I have written in a journal at least three times this month' },
      { id: 's2', text: 'I have asked myself "How am I actually feeling?" with genuine curiosity' },
      { id: 's3', text: 'I understand what mindfulness journaling is and how it differs from ordinary journaling' },
      { id: 's4', text: 'I can name at least two things I have genuinely learned about myself this month' },
      { id: 's5', text: 'I feel more familiar with my own inner life than I did on April 1st' },
    ],
  },
  {
    id:    'daily',
    icon:  '🌅',
    title: 'Daily Routines & Habits',
    color: '#5A4A7A',
    bg:    '#EEEBf8',
    items: [
      { id: 'd1', text: 'I have a morning practice I do before picking up my phone (even 30 seconds)' },
      { id: 'd2', text: 'I have eaten at least one meal per week without screens this month' },
      { id: 'd3', text: 'I have tried at least one type of mindfulness exercise at school' },
      { id: 'd4', text: 'I understand the difference between restoring breaks and stimulating ones' },
      { id: 'd5', text: 'I have noticed an improvement in sleep quality or sleep onset in the past two weeks' },
    ],
  },
];

// ── April Blog Timeline ────────────────────────────────────────────────────────
const APRIL_SERIES = [
  { date: '01-04', slug: '/blog/daily-mindfulness-practice',     title: 'How to Practice Mindfulness Daily',                     icon: '🧘', color: '#1A7272' },
  { date: '02-04', slug: '/blog/benefits-of-mindfulness',        title: 'Benefits of Mindfulness for Students',                  icon: '✨', color: '#3A4D8A' },
  { date: '03-04', slug: '/blog/benefits-of-mindfulness',        title: 'The Benefits of Mindfulness',                           icon: '🌿', color: '#8B3A5A' },
  { date: '04-04', slug: '/blog/breathing-exercises-stress',     title: 'Breathing Exercises to Reduce Stress',                  icon: '😮‍💨', color: '#1F5C8A' },
  { date: '05-04', slug: '/blog/stay-present-stop-overthinking', title: 'Stay Present, Stop Overthinking',                       icon: '🧠', color: '#3D6B4F' },
  { date: '06-04', slug: '/blog/mindfulness-techniques-beginners','title': 'Mindfulness Techniques for Beginners',              icon: '🌱', color: '#C07030' },
  { date: '07-04', slug: '/blog/control-thoughts-emotions',      title: 'How to Control Thoughts and Emotions',                  icon: '⚡', color: '#6B3D8A' },
  { date: '08-04', slug: '/blog/mindfulness-reduce-anxiety',     title: 'Mindfulness to Reduce Anxiety',                        icon: '💚', color: '#1F6B7A' },
  { date: '09-04', slug: '/blog/body-awareness-mental-health',   title: 'Body Awareness and Mental Health',                      icon: '✋', color: '#6B4F2A' },
  { date: '10-04', slug: '/blog/stay-calm-school-stress',        title: 'Stay Calm During School Stress',                        icon: '🏫', color: '#B54F20' },
  { date: '11-04', slug: '/blog/guided-meditation-students',     title: 'Guided Meditation for Students',                        icon: '🌙', color: '#3A5F8A' },
  { date: '12-04', slug: '/blog/build-self-awareness',           title: 'How to Build Self-Awareness',                           icon: '🪞', color: '#3A6B52' },
  { date: '13-04', slug: '/blog/mindfulness-focus-concentration','title': 'Mindfulness for Focus and Concentration',            icon: '🎯', color: '#2E4FA0' },
  { date: '14-04', slug: '/blog/mindful-gratitude-practice',     title: 'How to Practice Gratitude Mindfully',                   icon: '💛', color: '#9B6B2A' },
  { date: '15-04', slug: '/blog/mindfulness-exercises-school',   title: 'Mindfulness Exercises for School Life',                 icon: '📚', color: '#2D7A65' },
  { date: '16-04', slug: '/blog/manage-emotions-mindfulness',    title: 'Manage Emotions with Mindfulness',                      icon: '💔', color: '#C24B35' },
  { date: '17-04', slug: '/blog/mindfulness-stop-overthinking',  title: 'Stop Overthinking with Mindfulness',                    icon: '🌊', color: '#3D7080' },
  { date: '18-04', slug: '/blog/develop-inner-peace',            title: 'Develop Inner Peace in a Busy Life',                    icon: '🕊️', color: '#4A7A5A' },
  { date: '19-04', slug: '/blog/daily-mindfulness-routine',      title: 'Daily Mindfulness Routine for Students',                icon: '🌅', color: '#5A4A7A' },
  { date: '20-04', slug: '/blog/emotional-awareness-daily',      title: 'Become More Emotionally Aware Every Day',               icon: '🌸', color: '#A05070' },
  { date: '21-04', slug: '/blog/observe-thoughts-mindfully',     title: 'Observe Your Thoughts Without Judging Them',            icon: '☁️', color: '#2A5F9A' },
  { date: '22-04', slug: '/blog/mental-clarity-mindfulness',     title: 'Build Mental Clarity Through Mindfulness',              icon: '🧹', color: '#3A7A5A' },
  { date: '23-04', slug: '/blog/stay-grounded-stress',           title: 'Stay Grounded During Stressful Moments',               icon: '⚓', color: '#9A6040' },
  { date: '24-04', slug: '/blog/reduce-mental-noise',            title: 'Reduce Mental Noise and Distractions',                  icon: '🔇', color: '#2A7A9A' },
  { date: '25-04', slug: '/blog/mindfulness-emotional-balance',  title: 'Mindfulness and Emotional Balance',                     icon: '⚖️', color: '#7080A0' },
  { date: '26-04', slug: '/blog/daily-calmness-routine',         title: 'Build Calmness in Your Daily Routine',                  icon: '🌿', color: '#7A9070' },
  { date: '27-04', slug: '/blog/mentally-present-school-life',   title: 'Stay Mentally Present in School Life',                  icon: '🏫', color: '#5A68A8' },
  { date: '28-04', slug: '/blog/focus-awareness-practices',      title: 'Improve Focus Through Awareness Practices',             icon: '🔍', color: '#3858A8' },
  { date: '29-04', slug: '/blog/connect-with-yourself-mindfulness','title': 'Connect with Yourself Through Mindfulness',         icon: '💜', color: '#7A3858' },
];

// ── May Preview ────────────────────────────────────────────────────────────────
const MAY_TOPICS = [
  { icon: '🧠', topic: 'Understanding anxiety and depression in young adults', color: '#2D5A8A' },
  { icon: '💬', topic: 'How to talk about mental health — with friends and family', color: '#2D6B45' },
  { icon: '🆘', topic: 'When to seek help — recognising crisis signals', color: '#8B2635' },
  { icon: '💪', topic: 'Building long-term psychological resilience', color: '#C07800' },
  { icon: '🤝', topic: 'Supporting a friend who is struggling', color: '#5B3A8B' },
  { icon: '🏥', topic: 'Mental health resources available in India', color: GOLD },
  { icon: '📖', topic: 'Destigmatising therapy and professional support', color: '#1A7272' },
  { icon: '🌍', topic: 'The social and systemic factors behind student mental health', color: '#9A6040' },
];

// ── Interactive Review Component ───────────────────────────────────────────────
function AprilJourneyReview({ navigate }) {
  const [checkedItems,   setCheckedItems]   = useState({});
  const [activeSection,  setActiveSection]  = useState(null);
  const [journalEntries, setJournalEntries] = useState({});
  const [showInsight,    setShowInsight]    = useState(false);
  const [activeTab,      setActiveTab]      = useState('checklist');
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const JOURNAL_PROMPTS = [
    { id: 'jp1', icon: '🌱', prompt: 'What is the single most useful thing you discovered about yourself through April\'s mindfulness content?', color: GOLD },
    { id: 'jp2', icon: '🔄', prompt: 'Which practice from April have you actually used outside of reading about it? What happened?', color: '#2D6B45' },
    { id: 'jp3', icon: '🌊', prompt: 'What was the most challenging aspect of the month — what did you resist or avoid, and what might that avoidance be telling you?', color: '#2D5A8A' },
    { id: 'jp4', icon: '✨', prompt: 'In what specific way do you relate to your own emotions differently than you did on April 1st?', color: '#5B3A8B' },
    { id: 'jp5', icon: '🎯', prompt: 'What is the one practice you want to build into a daily habit in May — and what specific daily anchor will you use?', color: '#8B2635' },
  ];

  const toggleItem = (id) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const totalItems  = GROWTH_AREAS.reduce((sum, a) => sum + a.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const pct = Math.round((checkedCount / totalItems) * 100);

  const getInsight = () => {
    if (pct >= 80) return { label: 'Deep Engagement', msg: 'You have engaged substantially with April\'s content — the breadth of your checklist reflects genuine exploration across the full spectrum of mindfulness practice. The most valuable next step is consolidation: identify the two or three practices you want to make automatic in May, and commit to those specifically.', color: GOLD };
    if (pct >= 55) return { label: 'Active Exploration', msg: 'You have explored broadly and engaged genuinely with multiple practice areas. The gaps in the checklist are not failures — they are the map of what is still available. May is the opportunity to go deeper into what resonated most, rather than continuing to breadth-explore.', color: '#2D7A65' };
    if (pct >= 30) return { label: 'Beginning Practice', msg: 'You have begun — and beginning is the entire point of the first month. The practices you have encountered and the ones you have not yet tried are all still available. April\'s content remains accessible; the journey continues at whatever pace is genuine for you.', color: '#2D5A8A' };
    return { label: 'Seeds Planted', msg: 'Even reading about these practices has planted seeds in awareness. The intellectual understanding of mindfulness is the foundation — the experiential practice builds from it. May is the invitation to begin, one practice, one morning, one sigh before one phone pickup.', color: '#5B3A8B' };
  };

  const insight = getInsight();

  return (
    <div style={{ background: 'var(--sand)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '30px', fontFamily: font }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {[
          { key: 'checklist', label: '✅ Growth Checklist' },
          { key: 'journal',   label: '📖 Journal Prompts' },
          { key: 'timeline',  label: '📅 April Journey' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: '13px 8px', background: 'transparent', border: 'none',
            borderBottom: activeTab === tab.key ? `3px solid ${GOLD}` : '3px solid transparent',
            cursor: 'pointer', fontFamily: font, fontSize: '12px',
            fontWeight: activeTab === tab.key ? '700' : '500',
            color: activeTab === tab.key ? GOLD : 'var(--muted)', transition: 'all 0.15s',
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>

        {/* ── CHECKLIST TAB ── */}
        {activeTab === 'checklist' && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>APRIL GROWTH CHECK-IN</span>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: GOLD }}>{checkedCount}/{totalItems}</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '4px', background: `linear-gradient(90deg, ${GOLD}, #C49035)`, width: `${pct}%`, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{pct}% of practices explored</div>
            </div>

            {/* Area sections */}
            {GROWTH_AREAS.map(area => {
              const areaChecked = area.items.filter(i => checkedItems[i.id]).length;
              const isOpen = activeSection === area.id;
              return (
                <div key={area.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', border: `1.5px solid ${isOpen ? area.color : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
                  <button onClick={() => setActiveSection(isOpen ? null : area.id)} style={{ width: '100%', padding: '13px 15px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px', fontFamily: font, textAlign: 'left' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: area.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{area.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: area.color }}>{area.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{areaChecked}/{area.items.length} explored</div>
                    </div>
                    <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', background: area.color, width: `${(areaChecked / area.items.length) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ color: area.color, fontSize: '13px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 15px 14px 15px', borderTop: '1px solid var(--border)' }}>
                      {area.items.map(item => (
                        <button key={item.id} onClick={() => toggleItem(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: font, textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${checkedItems[item.id] ? area.color : 'var(--border)'}`, background: checkedItems[item.id] ? area.color : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'all 0.2s' }}>
                            {checkedItems[item.id] && <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>✓</span>}
                          </div>
                          <span style={{ fontSize: '13px', color: checkedItems[item.id] ? area.color : 'var(--ink)', lineHeight: 1.55, fontWeight: checkedItems[item.id] ? '600' : '400', textDecoration: checkedItems[item.id] ? 'none' : 'none' }}>{item.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Insight */}
            {checkedCount >= 3 && (
              <div style={{ marginTop: '14px' }}>
                {!showInsight ? (
                  <button onClick={() => setShowInsight(true)} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${GOLD}, #C49035)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 18px ${GBORD}` }}>
                    ✨ See My Growth Insight
                  </button>
                ) : (
                  <div style={{ background: insight.color + '12', border: `2px solid ${insight.color}30`, borderRadius: '12px', padding: '16px', animation: 'floatUp 0.4s ease' }}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: insight.color, marginBottom: '6px' }}>{insight.label}</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75 }}>{insight.msg}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── JOURNAL TAB ── */}
        {activeTab === 'journal' && (
          <div>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Five prompts for genuine month-end reflection. Write honestly — this is not a performance evaluation. It is a conversation with yourself about what April was.
            </p>
            {[
              { id: 'jp1', icon: '🌱', prompt: 'What is the single most useful thing you discovered about yourself through April\'s mindfulness content?', color: GOLD },
              { id: 'jp2', icon: '🔄', prompt: 'Which practice from April have you actually used outside of reading about it? What happened when you used it?', color: '#2D6B45' },
              { id: 'jp3', icon: '🌊', prompt: 'What was most challenging — what did you resist or avoid, and what might that resistance be telling you?', color: '#2D5A8A' },
              { id: 'jp4', icon: '✨', prompt: 'In what specific way do you relate to your own emotional experience differently than you did on April 1st?', color: '#5B3A8B' },
              { id: 'jp5', icon: '🎯', prompt: 'What one practice do you want to build into a genuine daily habit in May — and what specific anchor will you use?', color: '#8B2635' },
            ].map((jp, i) => (
              <div key={jp.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', border: `1.5px solid ${jp.color}25`, borderLeft: `4px solid ${jp.color}` }}>
                <div style={{ padding: '13px 15px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{jp.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: jp.color, textTransform: 'uppercase', letterSpacing: '1px' }}>Prompt {i + 1}</span>
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: jp.color, fontWeight: '600', fontStyle: 'italic', lineHeight: 1.55 }}>"{jp.prompt}"</p>
                </div>
                <div style={{ padding: '12px 15px' }}>
                  <textarea
                    value={journalEntries[jp.id] || ''}
                    onChange={e => setJournalEntries(prev => ({ ...prev, [jp.id]: e.target.value }))}
                    placeholder="Write here — honest, specific, uncensored. This is for you alone..."
                    rows={4}
                    style={{ width: '100%', padding: '10px 13px', borderRadius: '8px', border: `1.5px solid ${(journalEntries[jp.id] || '').length > 30 ? jp.color : 'var(--border)'}`, fontFamily: font, fontSize: '13px', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: (journalEntries[jp.id] || '').length > 30 ? `${jp.color}05` : 'var(--sand)', transition: 'all 0.2s' }}
                  />
                  {(journalEntries[jp.id] || '').length > 50 && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: jp.color, fontWeight: '600' }}>✓ Writing honestly is the whole practice.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TIMELINE TAB ── */}
        {activeTab === 'timeline' && (
          <div>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Twenty-nine practices across April — tap any to revisit it.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
              {APRIL_SERIES.map(blog => (
                <button key={blog.date} onClick={() => navigate(blog.slug)} style={{ padding: '10px 11px', borderRadius: '10px', border: `1.5px solid ${blog.color}25`, background: `${blog.color}08`, cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{blog.icon}</span>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: blog.color, marginBottom: '2px' }}>{blog.date}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink)', lineHeight: 1.35, fontWeight: '500' }}>{blog.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulnessJourneyReflection({ navigate, relatedPosts }) {
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

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
      </Head>

      {/* ── Introduction ── */}
      <p>Thirty days ago, April began with a simple invitation: to pay attention to your inner life. To practise, even briefly, the specific skills that research consistently identifies as the foundations of psychological wellbeing — awareness, regulation, presence, and self-connection. Whether you read every post or three, whether you practised daily or occasionally, whether you felt significant shifts or subtle ones — you have been part of something worth pausing to acknowledge.</p>

      <p>This final April post is different from the others. There are no new techniques to learn today. There is only the space to look back honestly at the past thirty days — what landed, what did not, what surprised you, what you want to carry forward. This is the reflection that turns a collection of practices into a genuine journey.</p>

      <img
        src={meta.imgUrl}
        alt="End of April mindfulness journey reflection — growth checklist, journaling prompts, and looking forward to May mental health awareness month"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-month">1. What April's Mindfulness Month Was About</h3>

      <p>April's content covered the full landscape of mindfulness as it applies to student life — not as a spiritual discipline but as a practical psychological toolkit. The twenty-nine posts moved through breathing and physiological regulation, grounding and present-moment presence, emotional awareness and regulation, focus and mental clarity, self-connection and journaling, daily routines and habits, and the specific situations students face: exams, school life, overthinking, digital distraction, inner peace, and emotional balance.</p>

      <p>The through-line was consistent across all twenty-nine posts: mindfulness is not the elimination of difficult experience but the development of a different relationship to it. The anxious thought is still present; what changes is the relationship to the anxious thought — from being inside it to observing it. The overwhelming emotion is still felt; what changes is the capacity to feel it without being driven by it. The distracted mind still wanders; what changes is the speed and ease with which it returns. Every technique, every exercise, every guided practice in April was in service of this single underlying capacity: the ability to be genuinely present with your own experience, whatever that experience is.</p>

      <p><strong>What this month was not about.</strong> April was not about achieving a particular emotional state. It was not about becoming a person who never gets anxious, never gets distracted, never feels overwhelmed. It was not about performing wellness or demonstrating that you have mastered mindfulness. The research is clear and the experience of genuine practitioners confirms it: mindfulness does not produce perfect minds. It produces minds that are slightly more aware, slightly more regulated, and slightly more at home with the full range of human experience. The "slightly" accumulates. Across weeks it becomes measurable; across months it becomes visible in daily life; across years it becomes characteristic.</p>

      {/* ── Section 2 ── */}
      <h3 id="research">2. What One Month of Practice Actually Produces</h3>

      <p><strong>The research timeline — what to expect at thirty days.</strong> Research on mindfulness and neuroplasticity provides a clear picture of what one month of consistent daily practice produces. Studies by Hölzel and colleagues at Massachusetts General Hospital and Harvard document that eight weeks of daily practice produce structural brain changes — but measurable functional improvements begin much earlier. Research by Mrazek at UCSB documents significant reductions in mind-wandering and improvements in working memory after just two weeks. Research by Zeidan at Wake Forest shows measurable cognitive improvements after four days of practice. The thirty-day window of April sits within the period when the first genuine neurological changes are becoming established — not complete, but begun.</p>

      <p><strong>What changes first.</strong> In the order they typically become noticeable across the first month of consistent practice: improved sleep onset (the pre-sleep breathing and worry download practices produce this within one to two weeks); reduced emotional reactivity to minor daily events (the noting practice and affect labelling produce this within two to three weeks); faster recovery from difficult emotional events (the combination of body scan and self-compassion practices produces this within three to four weeks); and early improvements in sustained attention during study (the pre-study ritual and mindful Pomodoro produce this within two to four weeks of consistent use). Structural brain changes — the durable architectural improvements that make these functional gains lasting — require six to eight weeks of daily practice to accumulate meaningfully.</p>

      <p><strong>What consistency matters more than.</strong> Research by Lally at UCL on habit formation confirms what practitioners report: the specific practice matters less than the consistency of some daily practice. The student who did three physiological sighs before their morning phone every single day across April has likely produced more neurological benefit than the student who meditated for thirty minutes occasionally. Daily minimum-viable practice produces compounding returns; intermittent elaborate practice does not accumulate the same way. The insight for May: choose the smallest version of each practice that is genuinely achievable every day, and commit to that — adding complexity only after the simple version is fully automatic.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="review">3. Interactive: The April Journey Review</h3>
      <p>The Review has three sections: the Growth Checklist (thirty items across six practice areas — check what you have genuinely explored this month), the Journal Prompts (five reflection questions with write-in space), and the April Timeline (all twenty-nine blogs accessible for revisiting). Take your time here — this is not a test. It is a map of what the month produced.</p>

      <AprilJourneyReview navigate={navigate} />

      {/* ── Section 4 ── */}
      <h3 id="prompts">4. Journaling Prompts for Month-End Reflection</h3>

      <p>These five prompts are also available in the Journal tab of the Review above. They are reproduced here for students who prefer to use their physical notebook — which research consistently shows produces better reflective depth than digital journaling for most people.</p>

      {[
        { num: '01', icon: '🌱', color: GOLD,      prompt: 'What is the single most useful thing you discovered about yourself through April\'s mindfulness content?', guide: 'Useful to yourself — not to others, not for performance. Something that genuinely changed how you understand or relate to your own experience.' },
        { num: '02', icon: '🔄', color: '#2D6B45',  prompt: 'Which practice from April have you actually used in real life (outside of reading about it)? What happened when you used it?', guide: 'Be specific. "I did three physiological sighs before the Chemistry test and noticed X." The specificity is where the learning lives.' },
        { num: '03', icon: '🌊', color: '#2D5A8A',  prompt: 'What was most challenging — what did you resist or avoid, and what might that resistance be telling you?', guide: 'Resistance is data. The things that felt most uncomfortable or irrelevant to try often point most directly at what needs attention.' },
        { num: '04', icon: '✨', color: '#5B3A8B',  prompt: 'In what specific way do you relate to your own emotional experience differently than you did on April 1st?', guide: 'Even a small shift counts. "I notice I can name what I\'m feeling slightly more often" is a genuine change worth acknowledging.' },
        { num: '05', icon: '🎯', color: '#8B2635',  prompt: 'What one practice do you want to build into a genuine daily habit in May — and what specific anchor will you use?', guide: 'The anchor is the existing behaviour you will attach the practice to. "Before I pick up my phone each morning" is an anchor. "When I remember" is not.' },
      ].map(p => (
        <div key={p.num} style={{ background: 'white', borderRadius: '13px', padding: '18px 20px', marginBottom: '14px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${p.color}`, fontFamily: font }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: `${p.color}40` }}>{p.num}</span>
            <span style={{ fontSize: '20px' }}>{p.icon}</span>
          </div>
          <p style={{ margin: '0 0 10px 0', fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: p.color, fontStyle: 'italic', lineHeight: 1.55 }}>"{p.prompt}"</p>
          <div style={{ background: `${p.color}10`, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${p.color}20` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: p.color, marginBottom: '3px', textTransform: 'uppercase' }}>📍 WRITING GUIDE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{p.guide}</p>
          </div>
        </div>
      ))}

      {/* ── Section 5 ── */}
      <h3 id="forward">5. Carrying Forward — What to Keep, What to Build</h3>

      <p><strong>The consolidation principle — why doing less is more effective than continuing to explore.</strong> April offered breadth — twenty-nine different practices and approaches across the full spectrum of mindfulness application. May is the opportunity for depth — taking the two or three practices that genuinely resonated and building them to the automaticity that transforms useful techniques into a character-level capacity. Research on habit formation consistently shows that three automatic daily practices produce more wellbeing benefit than ten occasional ones. The question for May is not "what else can I try?" but "what do I want to become automatic?" and then committing fully to that, nothing else.</p>

      <p><strong>The minimum viable daily practice for May — what the research supports as the starting structure.</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Morning (45 seconds):</strong> Three physiological sighs before the morning phone pickup — already a habit for many April readers. If this is not yet automatic, this single practice is the entire morning commitment for May.</li>
        <li><strong>Study sessions (3 minutes each):</strong> The pre-study ritual — brain dump, three sighs, one written task. Every session. Not some. Every session, because the habit builds in the repetition.</li>
        <li><strong>Evening (5-10 minutes):</strong> One of the body scan, worry download, or gratitude entry before sleep. Choose the one that produced the most concrete benefit in April and use that one — consistently, not alternating.</li>
      </ul>

      <p><strong>The one practice to add in May.</strong> Beyond the minimum viable structure, choose one practice from April that felt genuinely interesting but was never properly tried — and commit to trying it every day for two weeks, just long enough to assess it accurately. The one-week assessment is too brief to accurately evaluate any awareness practice; two weeks provides the minimum data set for an honest evaluation of whether the practice is working.</p>

      <p><strong>A letter from April to May.</strong> April, at its best, was the beginning of a relationship with yourself. Not the whole relationship — beginnings are not wholes — but the first genuine steps of turning inward with the intention of developing genuine familiarity. May is the continuation: not the same month repeated but the natural next chapter, in which what was started becomes more rooted, more reliable, and more simply part of who you are. The research does not say "practice mindfulness until you are calm enough." It says: keep practising, because the person who practises for thirty days is neurologically different from the person who practised for none, and the person who practises for ninety days is different again. The April version of you has already changed. The May version will be further still.</p>

      {/* ── Section 6 ── */}
      <h3 id="may">6. Into May — Mental Health Awareness Month</h3>

      <div style={{ background: `linear-gradient(135deg, #2D5A8A, #3A7A8A)`, borderRadius: '16px', padding: '28px', marginBottom: '28px', textAlign: 'center', fontFamily: font }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>💚</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '10px', lineHeight: 1.3 }}>May is Mental Health Awareness Month</div>
        <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          April built the inner foundation — the awareness, the regulation, the connection with your own experience. May turns outward: to understanding mental health more clearly, to reducing stigma, to learning how to support yourself and others, and to knowing when and how to seek help.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.75)', marginBottom: '10px' }}>COMING IN MAY:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {MAY_TOPICS.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.4 }}>{t.topic}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'rgba(255,255,255,0.80)', fontStyle: 'italic' }}>
          "Mental health is not a destination you arrive at. It is the ongoing practice of caring for yourself — and May's content is a companion for that practice."
        </p>
      </div>

      <p>The transition from April to May is a natural deepening: April built the attentional and regulatory foundation through mindfulness practice; May builds the knowledge foundation — understanding mental health clearly enough to recognise when it is struggling, speak about it honestly, support others effectively, and seek help without shame when help is needed. The two months are designed as a whole: the April practices make the May conversations possible; the May knowledge makes the April practices meaningful in the larger context of a life.</p>

      <p>If you have been engaging with SecretSharz this month — reading, practising, reflecting — you have already done something significant. You turned toward your inner life at a time when every external signal pointed away from it. You considered practices that are unfamiliar and sometimes uncomfortable. You showed up, in whatever way was possible, for the quiet work of developing the relationship with yourself that everything else in life depends on.</p>

      <p>That is worth acknowledging. Not as performance — as genuine recognition. You began. And beginning, in any direction worth going, is the hardest and most important part.</p>

      {/* ── Final ── */}
      <div style={{ textAlign: 'center', margin: '50px 0 40px 0', fontFamily: font }}>
        <h2 style={{ fontFamily: 'Fraunces', color: GOLD, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '28px' }}>
          "April was the beginning. May is the continuation. The journey is the whole of it."
        </h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto', fontSize: '15px', lineHeight: 1.7 }}>
          Thank you for a month of genuine exploration. See you in May — for the next chapter of the most important subject available: understanding and caring for the human mind.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: `linear-gradient(135deg, ${GOLD}, #C49035)`, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${GBORD}` }}
          >
            Carry Your Practice Into May →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: GOLD, border: `2px solid ${GOLD}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Visit Our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Full April Archive ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px', fontFamily: font }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>The Complete April Mindfulness Series:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {APRIL_SERIES.map(blog => (
            <button key={blog.date} onClick={() => navigate(blog.slug)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${blog.color}25`, background: `${blog.color}06`, cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{blog.icon}</span>
              <div>
                <div style={{ fontSize: '9px', color: blog.color, fontWeight: '700', marginBottom: '1px' }}>{blog.date}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink)', lineHeight: 1.35 }}>{blog.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </BlogPostTemplate>
  );
}
