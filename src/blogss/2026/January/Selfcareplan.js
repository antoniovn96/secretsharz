import React, { useState, useEffect } from 'react';
import BlogPostTemplate from '../../../BlogPostTemplate';

// ── META ─────────────────────────────────────────────────────────────────────
export const meta = {
  title: "Creating a Personal Self-Care Plan That Works for You",
  excerpt: "Self-care isn't bubble baths and scented candles. It's a deliberate system for maintaining the energy and emotional capacity to show up for the things that matter. Here's how to build yours.",
  category: "Wellness",
  date: "27 Jan 2026",
  readTime: "8 min read",
  wordCount: 2000,
  imgUrl: "/blogss/2026/January/self-care-plan.jpg",
  tldr: "Self-care works only when it's tailored to you — your energy level, your schedule, your specific stressors. This post walks through all five types of self-care and lets you build a real, custom weekly plan you can screenshot and follow.",
  toc: [
    { id: "what-is-self-care", title: "What Self-Care Actually Is", level: 2 },
    { id: "types", title: "The 5 Types of Self-Care", level: 2 },
    { id: "plan-builder", title: "Build Your Weekly Plan ← Try This", level: 2 },
    { id: "custom-plan", title: "Making It Stick", level: 2 },
    { id: "weekly-structure", title: "Sample Weekly Structure", level: 2 },
  ],
};

// ── INTERACTIVE: SELF-CARE PLAN BUILDER ─────────────────────────────────────
const CATEGORIES = [
  {
    id: "physical",
    label: "Physical",
    icon: "💪",
    color: "#E8845A",
    colorPale: "#FDF0EA",
    desc: "Taking care of your body — the foundation everything else sits on.",
    activities: [
      { id: "p1", label: "10-min morning walk or stretch",     freq: "daily",    time: "10 min" },
      { id: "p2", label: "Cook or eat one nutritious meal",    freq: "daily",    time: "30 min" },
      { id: "p3", label: "7–8 hours of sleep",                 freq: "daily",    time: "All night" },
      { id: "p4", label: "Drink 8 glasses of water",           freq: "daily",    time: "Throughout" },
      { id: "p5", label: "30-min physical exercise or sport",  freq: "3x/week",  time: "30 min" },
      { id: "p6", label: "Spend 20 min outside in daylight",   freq: "daily",    time: "20 min" },
    ],
  },
  {
    id: "emotional",
    label: "Emotional",
    icon: "❤️",
    color: "#7C6FA0",
    colorPale: "#F0EDF8",
    desc: "Processing feelings and building emotional resilience.",
    activities: [
      { id: "e1", label: "5-min mood check-in journal",        freq: "daily",    time: "5 min" },
      { id: "e2", label: "Identify and name one feeling",      freq: "daily",    time: "2 min" },
      { id: "e3", label: "Write 3 things I'm grateful for",    freq: "daily",    time: "5 min" },
      { id: "e4", label: "Cry if I need to — let it out",      freq: "as needed", time: "5 min" },
      { id: "e5", label: "Watch something that makes me laugh", freq: "weekly",   time: "20 min" },
      { id: "e6", label: "Write an unsent letter to express what I can't say", freq: "weekly", time: "15 min" },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: "🤝",
    color: "#5B9EBF",
    colorPale: "#EAF4FA",
    desc: "Nurturing real connections and setting healthy limits.",
    activities: [
      { id: "s1", label: "Call or message someone I care about", freq: "3x/week", time: "10 min" },
      { id: "s2", label: "Say no to one thing I don't want to do", freq: "weekly", time: "— " },
      { id: "s3", label: "Have one real face-to-face conversation", freq: "daily",  time: "15 min" },
      { id: "s4", label: "Spend 30 min with family without phones",  freq: "daily",  time: "30 min" },
      { id: "s5", label: "Put phone away during meals",               freq: "daily",  time: "20 min" },
      { id: "s6", label: "Join one club, class or community activity", freq: "weekly", time: "1 hr" },
    ],
  },
  {
    id: "mental",
    label: "Mental",
    icon: "🧠",
    color: "#4A7C59",
    colorPale: "#EBF4EE",
    desc: "Stimulating your mind and protecting your cognitive space.",
    activities: [
      { id: "m1", label: "Read 15 pages of something I enjoy",     freq: "daily",    time: "15 min" },
      { id: "m2", label: "10-min guided meditation or breathing",  freq: "daily",    time: "10 min" },
      { id: "m3", label: "Learn something new for fun (not school)", freq: "3x/week", time: "20 min" },
      { id: "m4", label: "Brain dump — write all worries on paper", freq: "weekly",   time: "10 min" },
      { id: "m5", label: "Phone-free hour before bed",             freq: "daily",    time: "60 min" },
      { id: "m6", label: "Do a puzzle, crossword or strategy game", freq: "weekly",   time: "30 min" },
    ],
  },
  {
    id: "rest",
    label: "Rest & Play",
    icon: "🌿",
    color: "#2D5240",
    colorPale: "#E0EDE5",
    desc: "Recharging without guilt — rest is productive.",
    activities: [
      { id: "r1", label: "20-min nap or eyes-closed rest",          freq: "as needed", time: "20 min" },
      { id: "r2", label: "Do one thing purely for enjoyment",       freq: "daily",     time: "30 min" },
      { id: "r3", label: "Spend time in nature or a park",          freq: "3x/week",   time: "30 min" },
      { id: "r4", label: "One full rest day per week — no hustle",  freq: "weekly",    time: "All day" },
      { id: "r5", label: "Creative activity (draw, music, cook)",   freq: "3x/week",   time: "30 min" },
      { id: "r6", label: "Digital detox morning (phone off 2 hrs)", freq: "weekly",    time: "2 hrs" },
    ],
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLAN_CSS = `
  .builder-card { background: white; border: 1.5px solid var(--border); border-radius: 20px; margin: 32px 0; box-shadow: var(--shadow-sm); overflow: hidden; }
  .builder-top-tabs { display: flex; border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
  .builder-top-tabs::-webkit-scrollbar { display: none; }
  .builder-tab { padding: 14px 20px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: none; font-family: inherit; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all 0.2s; border-bottom: 3px solid transparent; color: var(--muted); }
  .builder-tab:hover { color: var(--ink); background: var(--sand); }
  .builder-tab.active { color: var(--ink); border-bottom-color: currentColor; background: white; }
  .builder-tab .tab-count { font-size: 10px; font-weight: 700; background: var(--sage-pale); color: var(--sage); border-radius: 20px; padding: 1px 6px; }
  .builder-tab.active .tab-count { background: var(--sage); color: white; }

  .builder-body { padding: 24px 28px; }
  .builder-cat-desc { font-size: 14px; color: var(--muted); margin-bottom: 18px; line-height: 1.6; }
  .activity-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .activity-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 2px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.18s; user-select: none; }
  .activity-item:hover { border-color: var(--sage-light); background: var(--sage-pale); }
  .activity-item.selected { border-color: var(--sage); background: var(--sage-pale); }
  .activity-check { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; transition: all 0.18s; }
  .activity-item.selected .activity-check { background: var(--sage); border-color: var(--sage); color: white; }
  .activity-info { flex: 1; }
  .activity-label { font-size: 14px; font-weight: 600; color: var(--ink); line-height: 1.3; }
  .activity-meta { display: flex; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
  .activity-badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
  .badge-daily { background: #D1FAE5; color: #065F46; }
  .badge-3x { background: #DBEAFE; color: #1E40AF; }
  .badge-weekly { background: #EDE9FE; color: #5B21B6; }
  .badge-needed { background: var(--sand); color: var(--muted); }
  .builder-nav { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
  .builder-nav-btn { padding: 11px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .builder-nav-btn.primary { background: var(--sage); color: white; border: none; }
  .builder-nav-btn.primary:hover { background: var(--moss); }
  .builder-nav-btn.ghost { background: white; color: var(--muted); border: 2px solid var(--border); }
  .builder-nav-btn.ghost:hover { border-color: var(--sage); color: var(--sage); }
  .builder-progress-dots { display: flex; gap: 6px; }
  .pdot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.3s; }
  .pdot.done { background: var(--sage); }
  .pdot.active { background: var(--sage); transform: scale(1.4); }

  /* Generated Plan */
  .plan-output { padding: 24px 28px; }
  .plan-output-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .plan-output-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
  .plan-week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 24px; }
  .plan-day-col { border-radius: 10px; overflow: hidden; border: 1px solid var(--border); }
  .plan-day-header { padding: 8px 4px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: var(--ink); color: white; }
  .plan-day-body { padding: 6px 4px; display: flex; flex-direction: column; gap: 4px; background: var(--sand); min-height: 80px; }
  .plan-activity-chip { padding: 3px 5px; border-radius: 5px; font-size: 9px; font-weight: 600; line-height: 1.3; text-align: center; cursor: default; }
  .plan-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .plan-summary-card { border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; border: 1px solid var(--border); }
  .plan-summary-icon { font-size: 24px; }
  .plan-summary-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 2px; }
  .plan-summary-val { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--ink); }
  .plan-restart-btn { background: white; border: 2px solid var(--sage); color: var(--sage); padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .plan-restart-btn:hover { background: var(--sage); color: white; }
  .plan-print-note { font-size: 12px; color: var(--muted); margin-top: 10px; font-style: italic; }
  @media(max-width: 700px) {
    .plan-week-grid { grid-template-columns: 1fr; }
    .plan-summary-grid { grid-template-columns: 1fr; }
    .builder-body { padding: 16px; }
  }
`;

const FREQ_CLASS = { daily: 'badge-daily', '3x/week': 'badge-3x', weekly: 'badge-weekly', 'as needed': 'badge-needed' };
const FREQ_DAYS  = { daily: [0,1,2,3,4,5,6], '3x/week': [0,2,4], weekly: [5], 'as needed': [] };

function SelfCarePlanBuilder() {
  const [catIdx,    setCatIdx]    = useState(0);
  const [selected,  setSelected]  = useState({});
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = PLAN_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const toggle = (actId) => {
    setSelected(prev => {
      const next = { ...prev };
      if (next[actId]) delete next[actId];
      else next[actId] = true;
      return next;
    });
  };

  const cat = CATEGORIES[catIdx];
  const isLast = catIdx === CATEGORIES.length - 1;

  const allSelected = CATEGORIES.flatMap(c =>
    c.activities.filter(a => selected[a.id]).map(a => ({ ...a, catId: c.id, catLabel: c.label, catColor: c.color, catPale: c.colorPale }))
  );

  // Build weekly schedule: for each day, which activities fall on it
  const weekSchedule = DAYS.map((day, di) => ({
    day,
    activities: allSelected.filter(a => {
      const days = FREQ_DAYS[a.freq] || [];
      return days.includes(di);
    }),
  }));

  const totalMinutes = allSelected.reduce((s, a) => {
    const mins = parseInt(a.time) || 0;
    const perWeek = { daily: 7, '3x/week': 3, weekly: 1, 'as needed': 1 }[a.freq] || 1;
    return s + mins * perWeek;
  }, 0);

  const catCount = (c) => c.activities.filter(a => selected[a.id]).length;

  if (generated) {
    return (
      <div className="builder-card">
        <div className="plan-output">
          <div className="plan-output-title">🗓️ Your Personal Self-Care Plan</div>
          <div className="plan-output-sub">
            Based on your selections: <strong>{allSelected.length} activities</strong> across <strong>{CATEGORIES.filter(c => c.activities.some(a => selected[a.id])).length} categories</strong>. Here's how they map across your week.
          </div>

          {/* Weekly Grid */}
          <div className="plan-week-grid">
            {weekSchedule.map(({ day, activities }) => (
              <div key={day} className="plan-day-col">
                <div className="plan-day-header">{day}</div>
                <div className="plan-day-body">
                  {activities.length === 0
                    ? <div style={{ fontSize: '9px', color: 'var(--muted)', textAlign: 'center', paddingTop: '8px' }}>Rest</div>
                    : activities.map(a => (
                      <div key={a.id} className="plan-activity-chip" style={{ background: a.catPale, color: a.catColor }}>
                        {a.label.slice(0, 28)}{a.label.length > 28 ? '…' : ''}
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Full list by category */}
          {CATEGORIES.map(c => {
            const acts = c.activities.filter(a => selected[a.id]);
            if (acts.length === 0) return null;
            return (
              <div key={c.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{c.icon}</span>
                  <span style={{ fontWeight: 700, color: c.color, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{c.label}</span>
                </div>
                {acts.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: c.colorPale, borderRadius: '8px', marginBottom: '5px', fontSize: '13px' }}>
                    <span style={{ color: c.color, fontWeight: 700 }}>✓</span>
                    <span style={{ flex: 1, fontWeight: 600, color: 'var(--ink)' }}>{a.label}</span>
                    <span className={`activity-badge ${FREQ_CLASS[a.freq]}`}>{a.freq}</span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{a.time}</span>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Summary stats */}
          <div className="plan-summary-grid">
            <div className="plan-summary-card" style={{ background: 'var(--sage-pale)' }}>
              <span className="plan-summary-icon">✅</span>
              <div><div className="plan-summary-label">Total Activities</div><div className="plan-summary-val">{allSelected.length}</div></div>
            </div>
            <div className="plan-summary-card" style={{ background: 'var(--lav-pale)' }}>
              <span className="plan-summary-icon">⏱</span>
              <div><div className="plan-summary-label">Est. Weekly Time</div><div className="plan-summary-val">~{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</div></div>
            </div>
            <div className="plan-summary-card" style={{ background: 'var(--peach-pale)' }}>
              <span className="plan-summary-icon">📅</span>
              <div><div className="plan-summary-label">Active Days</div><div className="plan-summary-val">{weekSchedule.filter(d => d.activities.length > 0).length} / 7</div></div>
            </div>
            <div className="plan-summary-card" style={{ background: '#EAF4FA' }}>
              <span className="plan-summary-icon">🌿</span>
              <div><div className="plan-summary-label">Categories Covered</div><div className="plan-summary-val">{CATEGORIES.filter(c => c.activities.some(a => selected[a.id])).length} / 5</div></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="plan-restart-btn" onClick={() => { setGenerated(false); setCatIdx(0); setSelected({}); }}>← Start Over</button>
            <button className="plan-restart-btn" style={{ background: 'var(--sage)', color: 'white', border: 'none' }} onClick={() => window.print()}>🖨️ Print My Plan</button>
          </div>
          <p className="plan-print-note">💡 Tip: Stick a printed copy on your study desk or set these as daily calendar reminders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-card">
      {/* Category Tabs */}
      <div className="builder-top-tabs">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            className={`builder-tab ${catIdx === i ? 'active' : ''}`}
            style={{ color: catIdx === i ? c.color : undefined, borderBottomColor: catIdx === i ? c.color : undefined }}
            onClick={() => setCatIdx(i)}
          >
            {c.icon} {c.label}
            <span className="tab-count">{catCount(c)}</span>
          </button>
        ))}
      </div>

      <div className="builder-body">
        <div style={{ marginBottom: '4px', fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: cat.color }}>{cat.icon} {cat.label} Self-Care</div>
        <div className="builder-cat-desc">{cat.desc} Select the activities you'd realistically do.</div>

        <div className="activity-list">
          {cat.activities.map(act => (
            <div key={act.id} className={`activity-item ${selected[act.id] ? 'selected' : ''}`} onClick={() => toggle(act.id)}>
              <div className="activity-check">{selected[act.id] ? '✓' : ''}</div>
              <div className="activity-info">
                <div className="activity-label">{act.label}</div>
                <div className="activity-meta">
                  <span className={`activity-badge ${FREQ_CLASS[act.freq]}`}>{act.freq}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>⏱ {act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="builder-nav">
          <button className="builder-nav-btn ghost" onClick={() => setCatIdx(i => Math.max(0, i - 1))} style={{ visibility: catIdx === 0 ? 'hidden' : 'visible' }}>← Previous</button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div className="builder-progress-dots">
              {CATEGORIES.map((_, i) => (
                <div key={i} className={`pdot ${i < catIdx ? 'done' : i === catIdx ? 'active' : ''}`} />
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', textAlign: 'center' }}>
              {allSelected.length} activit{allSelected.length !== 1 ? 'ies' : 'y'} selected
            </div>
          </div>

          {!isLast
            ? <button className="builder-nav-btn primary" onClick={() => setCatIdx(i => i + 1)}>Next: {CATEGORIES[catIdx + 1].label} →</button>
            : <button className="builder-nav-btn primary" onClick={() => { if (allSelected.length > 0) setGenerated(true); }} disabled={allSelected.length === 0}>
                Generate My Plan →
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ── POST COMPONENT ────────────────────────────────────────────────────────────
export default function SelfCarePlan({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <h2 id="what-is-self-care">What Self-Care Actually Is</h2>
      <p>
        The wellness industry has sold us a version of self-care that looks like scented candles, spa days, and green smoothies. These things aren't bad — but they're not self-care in any meaningful therapeutic sense. They're treats.
      </p>
      <p>
        Real self-care is the ongoing, deliberate practice of maintaining your <strong>physical, emotional, social, and mental resources</strong> so that you have enough capacity to function, connect, and grow. It's not about rewarding yourself when you're burnt out. It's about building the habits that prevent burnout in the first place.
      </p>
      <p>
        Think of it this way: an aeroplane oxygen mask instruction. You put yours on before helping others — not because you don't care about others, but because you can't help anyone if you've already passed out. Self-care is your oxygen mask.
      </p>
      <blockquote>
        "Caring for myself is not self-indulgence. It is self-preservation." — Audre Lorde
      </blockquote>
      <p>
        For Indian students specifically, self-care faces two unique barriers. First, it is often framed as selfish — taking time for yourself when you "should" be studying or helping at home. Second, the concept itself is new enough that most families don't model it. If you didn't see your parents practise self-care, you likely never learned that it was even an option.
      </p>

      <h2 id="types">The 5 Types of Self-Care</h2>
      <p>
        Self-care researchers identify five domains, and the evidence shows that sustainable wellbeing requires attending to <em>all five</em> — neglecting any one creates a drain that the others can't fully compensate for.
      </p>

      {[
        { icon: '💪', color: '#E8845A', title: 'Physical', desc: 'Sleep, movement, nutrition, and hydration. These are the literal biological foundations of mood regulation. Without adequate sleep alone, every other mental health strategy is working at a fraction of its power.' },
        { icon: '❤️', color: '#7C6FA0', title: 'Emotional', desc: 'Processing feelings rather than suppressing them. Journaling, crying, talking, naming what you feel — emotional care prevents the buildup of unprocessed experience that eventually manifests as anxiety, numbness, or explosive reactions.' },
        { icon: '🤝', color: '#5B9EBF', title: 'Social', desc: 'Nurturing real, reciprocal connections and practising healthy limits. Loneliness has been found to be as damaging to health as smoking 15 cigarettes a day. But chronic overextension — saying yes when you mean no — is equally damaging.' },
        { icon: '🧠', color: '#4A7C59', title: 'Mental', desc: 'Protecting your cognitive space from overstimulation and boredom alike. This includes reading for pleasure, meditation, digital limits, and learning things just because they interest you — not because they\'ll help your marks.' },
        { icon: '🌿', color: '#2D5240', title: 'Rest & Play', desc: 'Unstructured, unproductive time that allows your nervous system to fully recover. Rest isn\'t sleep — it\'s the absence of demands. Play is activity done for its own sake, with no performance or outcome attached.' },
      ].map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', padding: '18px 20px', borderRadius: '14px', marginBottom: '10px', border: `1.5px solid ${t.color}30`, background: `${t.color}0A` }}>
          <span style={{ fontSize: '28px', lineHeight: 1, marginTop: '2px' }}>{t.icon}</span>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: 700, color: t.color, marginBottom: '5px' }}>{t.title} Self-Care</div>
            <div style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{t.desc}</div>
          </div>
        </div>
      ))}

      {/* ── INTERACTIVE PLAN BUILDER ── */}
      <h2 id="plan-builder">Build Your Weekly Self-Care Plan</h2>
      <p>
        A self-care plan works only if it fits your actual life. Below, step through each of the five categories and select the specific activities that feel realistic and meaningful to you. At the end, you'll get a personalised weekly schedule you can print or screenshot.
      </p>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        Tip: Don't pick everything — be honest. A plan with 5 activities you'll actually do beats a plan with 20 you won't.
      </p>

      <SelfCarePlanBuilder />

      <h2 id="custom-plan">Making It Stick</h2>
      <p>
        The most common failure mode of a self-care plan is treating it as an emergency response rather than a routine. You try to do everything when you're already exhausted, don't sustain it, and conclude that "self-care doesn't work for me." It didn't fail — the implementation did.
      </p>
      <p>Here's what the research on habit formation actually tells us:</p>

      {[
        { title: "Anchor to existing habits", body: "The most reliable way to build a new behaviour is to attach it to something you already do every day. 'After I brush my teeth, I write three things I'm grateful for.' The existing behaviour becomes the trigger." },
        { title: "Start embarrassingly small", body: "Two minutes of journaling done every day beats 30 minutes done twice. Consistency builds the neural pathway. Length and depth come later." },
        { title: "Track visibly", body: "A simple paper habit tracker on your desk creates what researchers call a 'don't break the chain' effect. Each tick mark adds social and motivational pressure to maintain the streak." },
        { title: "Plan for disruptions", body: "Ask yourself: when this plan falls apart (and it will, temporarily), what's my recovery plan? The students with the most resilient self-care habits have explicitly planned for exam weeks, travel, and bad days." },
      ].map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--sage)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '4px', fontSize: '15px' }}>{t.title}</div>
            <div style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{t.body}</div>
          </div>
        </div>
      ))}

      <h2 id="weekly-structure">Sample Weekly Structure for Students</h2>
      <p>
        If you want a reference point before customising, here's a research-backed baseline for a typical school week:
      </p>

      <div style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--ink)', color: 'white' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderRadius: '10px 0 0 0' }}>Time of Day</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Weekdays</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderRadius: '0 10px 0 0' }}>Weekend</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: "Morning", weekday: "5-min gratitude journal + 10-min walk/stretch", weekend: "Phone-free 2 hrs + do one activity you enjoy" },
              { time: "Afternoon", weekday: "Nutritious lunch away from screen", weekend: "Nature walk or social activity with someone real" },
              { time: "Evening", weekday: "45-min study + 10-min break cycle", weekend: "Creative hobby or skill for pure enjoyment" },
              { time: "Night", weekday: "Phone off 1 hr before bed + 8h sleep goal", weekend: "Full digital detox evening once per fortnight" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'var(--sand)' : 'white' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--sage)' }}>{row.time}</td>
                <td style={{ padding: '10px 14px', color: 'var(--ink-soft)' }}>{row.weekday}</td>
                <td style={{ padding: '10px 14px', color: 'var(--ink-soft)' }}>{row.weekend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Self-care is not a luxury you earn after finishing everything else. It is the infrastructure that makes "everything else" possible. Start with the plan you built above — even three activities, done consistently for 21 days, will produce measurable changes in your mood and energy. Give yourself that.
      </p>

    </BlogPostTemplate>
  );
}
