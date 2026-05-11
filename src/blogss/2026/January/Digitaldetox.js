import React, { useState, useEffect } from 'react';
import BlogPostTemplate from '../../../BlogPostTemplate';

// ── META ─────────────────────────────────────────────────────────────────────
export const meta = {
  title: "Digital Detox: How Reducing Screen Time Improves Mental Health",
  excerpt: "Your phone isn't just stealing your time — it's quietly rewiring your brain. Here's what the science says, and a step-by-step detox plan that actually works for Indian students.",
  category: "Digital Wellbeing",
  date: "25 Jan 2026",
  readTime: "7 min read",
  wordCount: 1750,
  imgUrl: "/blogss/2026/January/digital-detox-mental-health.jpg",
  tldr: "Excessive screen time physically alters the brain's reward system, worsens anxiety and sleep, and fuels comparison culture. But a structured detox — even just 7 days — measurably improves mood, focus, and sleep quality.",
  toc: [
    { id: "screen-addiction", title: "Are You Actually Addicted?", level: 2 },
    { id: "brain-effects", title: "What Screens Do to Your Brain", level: 2 },
    { id: "audit", title: "Your Screen Time Audit ← Try This", level: 2 },
    { id: "detox-plan", title: "The 7-Day Detox Plan", level: 2 },
    { id: "alternatives", title: "What to Do Instead", level: 2 },
  ],
};

// ── INTERACTIVE: SCREEN TIME AUDIT CALCULATOR ────────────────────────────────
const CATEGORIES = [
  { key: "social",  label: "Social Media",         icon: "📱", eg: "Instagram, Snapchat, Twitter" },
  { key: "video",   label: "Video Streaming",        icon: "📺", eg: "YouTube, Reels, Netflix" },
  { key: "gaming",  label: "Gaming",                 icon: "🎮", eg: "BGMI, Free Fire, Chess" },
  { key: "chat",    label: "Messaging & Calls",      icon: "💬", eg: "WhatsApp, Discord" },
  { key: "study",   label: "Study / Productive Use", icon: "📚", eg: "Khan Academy, Notes, Google" },
  { key: "other",   label: "Other Browsing",         icon: "🌐", eg: "News, Shopping, Random" },
];

const THRESHOLDS = {
  social: { safe: 1,   warn: 2 },
  video:  { safe: 1.5, warn: 2.5 },
  gaming: { safe: 1,   warn: 2 },
  chat:   { safe: 1,   warn: 2 },
  study:  { safe: 4,   warn: 6 },
  other:  { safe: 0.5, warn: 1 },
};

const ADVICE = {
  social:  ["Turn off all social media notifications", "Use Instagram's 'Daily Limit' feature to cap at 30 min", "Try a 48-hour social media fast this weekend"],
  video:   ["Replace one YouTube session with a podcast walk", "Disable autoplay on YouTube and Netflix", "Set a 'no video after 9pm' rule"],
  gaming:  ["Set a hard timer before you start — stop when it rings", "Replace one gaming session with a real-world hobby this week", "Use gaming as a reward after study, not before"],
  chat:    ["Check WhatsApp at scheduled times (e.g. 8am, 1pm, 6pm)", "Mute group chats that don't require immediate responses", "Have one 'phone in another room' hour per day"],
  study:   ["This is healthy — keep it. Just take eye breaks every 45 min", "Make sure study screen time doesn't bleed into bed time"],
  other:   ["Install a site blocker like Cold Turkey for impulse browsing", "Before opening a browser, ask: do I actually need this right now?"],
};

function getScore(hours) {
  // Healthy total is under 4h non-study. More = lower score
  const total   = Object.values(hours).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const nonStudy = total - (parseFloat(hours.study) || 0);
  let score = 100;
  score -= Math.max(0, (nonStudy - 2) * 12);
  score -= Math.max(0, ((parseFloat(hours.social) || 0) - THRESHOLDS.social.safe) * 15);
  score -= Math.max(0, ((parseFloat(hours.video)  || 0) - THRESHOLDS.video.safe)  * 10);
  score -= Math.max(0, ((parseFloat(hours.gaming) || 0) - THRESHOLDS.gaming.safe) * 10);
  return Math.max(0, Math.min(100, Math.round(score)));
}

const AUDIT_CSS = `
  .audit-card { background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 28px; margin: 32px 0; box-shadow: var(--shadow-sm); }
  .audit-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .audit-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
  .audit-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
  .audit-icon { font-size: 24px; width: 36px; flex-shrink: 0; }
  .audit-label-col { flex: 1; min-width: 160px; }
  .audit-label { font-size: 14px; font-weight: 700; color: var(--ink); }
  .audit-eg { font-size: 11px; color: var(--muted); }
  .audit-slider-col { flex: 2; min-width: 180px; display: flex; align-items: center; gap: 10px; }
  .audit-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; background: var(--sage-pale); outline: none; cursor: pointer; }
  .audit-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--sage); cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .audit-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--sage); cursor: pointer; border: 2px solid white; }
  .audit-val { font-size: 15px; font-weight: 700; color: var(--sage); min-width: 44px; text-align: right; }
  .audit-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin: 20px 0 8px; background: var(--sage-pale); }
  .audit-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease, background 0.5s ease; }
  .audit-score-wrap { text-align: center; padding: 20px 0 10px; }
  .audit-score-num { font-family: 'Fraunces', serif; font-size: 60px; font-weight: 700; line-height: 1; }
  .audit-score-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
  .audit-status-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 14px 0; justify-content: center; }
  .audit-cat-badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .audit-advice-list { list-style: none; padding: 0; margin: 0; }
  .audit-advice-list li { display: flex; gap: 10px; font-size: 14px; color: var(--ink-soft); padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); line-height: 1.5; }
  .audit-advice-list li::before { content: '→'; color: var(--sage); font-weight: 700; flex-shrink: 0; }
  .audit-total-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--muted); padding: 10px 0; border-top: 1px solid var(--border); margin-top: 8px; }
  .audit-cta-btn { display: block; width: 100%; margin-top: 20px; padding: 14px; background: var(--sage); color: white; border: none; border-radius: 50px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .audit-cta-btn:hover { background: var(--moss); }
  @media(max-width: 600px) { .audit-row { flex-direction: column; align-items: flex-start; } .audit-slider-col { width: 100%; } }
`;

function ScreenTimeAudit() {
  const [hours, setHours] = useState({ social: 2, video: 2, gaming: 1, chat: 1.5, study: 3, other: 0.5 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = AUDIT_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const score  = getScore(hours);
  const total  = Object.values(hours).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const color  = score >= 70 ? '#2D7D46' : score >= 45 ? '#B85C00' : '#8B1A1A';
  const emoji  = score >= 70 ? '🟢' : score >= 45 ? '🟡' : '🔴';
  const label  = score >= 70 ? 'Healthy Balance' : score >= 45 ? 'Needs Attention' : 'High Risk Zone';

  const problematic = CATEGORIES.filter(c => {
    const h = parseFloat(hours[c.key]) || 0;
    return c.key !== 'study' && h > THRESHOLDS[c.key].warn;
  });

  const allAdvice = problematic.flatMap(c => ADVICE[c.key]).slice(0, 6);

  const update = (key, val) => setHours(prev => ({ ...prev, [key]: parseFloat(val) }));

  return (
    <div className="audit-card">
      <div className="audit-title">🔍 Your Screen Time Audit</div>
      <div className="audit-sub">Drag each slider to match how many hours you spend per day. Be honest — this is just for you.</div>

      {CATEGORIES.map(cat => {
        const val = parseFloat(hours[cat.key]) || 0;
        const thr = THRESHOLDS[cat.key];
        const isSafe = val <= thr.safe;
        const isWarn = val > thr.safe && val <= thr.warn;
        const sliderColor = isSafe ? 'var(--sage)' : isWarn ? '#B85C00' : '#8B1A1A';
        return (
          <div className="audit-row" key={cat.key}>
            <span className="audit-icon">{cat.icon}</span>
            <div className="audit-label-col">
              <div className="audit-label">{cat.label}</div>
              <div className="audit-eg">{cat.eg}</div>
            </div>
            <div className="audit-slider-col">
              <input
                type="range" min={0} max={8} step={0.5}
                value={hours[cat.key]}
                onChange={e => update(cat.key, e.target.value)}
                className="audit-slider"
                style={{ background: `linear-gradient(to right, ${sliderColor} ${(val/8)*100}%, var(--sage-pale) ${(val/8)*100}%)` }}
              />
              <span className="audit-val">{val}h</span>
            </div>
          </div>
        );
      })}

      <div className="audit-total-row">
        <span>Total daily screen time</span>
        <span style={{ color: total > 6 ? '#8B1A1A' : 'var(--sage)' }}>{total.toFixed(1)} hours</span>
      </div>

      {!revealed ? (
        <button className="audit-cta-btn" onClick={() => setRevealed(true)}>
          See My Digital Health Score →
        </button>
      ) : (
        <>
          <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />
          <div className="audit-score-wrap">
            <div className="audit-score-num" style={{ color }}>{score}</div>
            <div className="audit-score-label" style={{ color }}>{emoji} {label}</div>
          </div>

          {/* Per-category bar */}
          <div style={{ margin: '20px 0 8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Your breakdown</div>
            {CATEGORIES.filter(c => c.key !== 'study').map(cat => {
              const val = parseFloat(hours[cat.key]) || 0;
              const pct = Math.min(100, (val / 6) * 100);
              const thr = THRESHOLDS[cat.key];
              const barColor = val <= thr.safe ? '#2D7D46' : val <= thr.warn ? '#B85C00' : '#8B1A1A';
              return (
                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', width: '22px' }}>{cat.icon}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--sage-pale)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: barColor, width: '32px' }}>{val}h</span>
                </div>
              );
            })}
          </div>

          {allAdvice.length > 0 && (
            <>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: '16px 0 8px' }}>
                Your personalised action steps
              </div>
              <ul className="audit-advice-list">
                {allAdvice.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </>
          )}

          {score >= 70 && (
            <div style={{ background: 'var(--sage-pale)', borderRadius: '12px', padding: '14px 18px', marginTop: '16px', fontSize: '14px', color: 'var(--sage)', fontWeight: 600 }}>
              ✅ Your screen habits look balanced. Keep using productive screen time as a tool, not a default activity.
            </div>
          )}

          <button className="audit-cta-btn" style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)' }} onClick={() => setRevealed(false)}>
            ← Adjust My Inputs
          </button>
        </>
      )}
    </div>
  );
}

// ── POST COMPONENT ────────────────────────────────────────────────────────────
export default function DigitalDetox({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <h2 id="screen-addiction">Are You Actually Addicted?</h2>
      <p>
        The average Indian teenager spends <strong>7.3 hours</strong> on screens per day — and that number has been climbing since 2020. But the real question isn't how much time you spend; it's whether you feel <em>unable to stop</em> even when you want to.
      </p>
      <p>
        Screen addiction isn't about willpower. Platforms like Instagram, YouTube, and BGMI are designed by teams of engineers and psychologists whose entire job is to make you stay longer. Variable reward schedules — the same mechanism used in slot machines — are hard-coded into every swipe-to-refresh gesture and every notification sound.
      </p>
      <blockquote>
        "If you opened your phone just to check the time and ended up putting it down 25 minutes later — that's not a coincidence. That's engineering."
      </blockquote>
      <p>Ask yourself honestly: Do you feel anxious or irritable when you can't check your phone? Do you pick it up the moment you feel bored or uncomfortable? Has anyone close to you mentioned your screen time? If yes to two or more — this article is for you.</p>

      <h2 id="brain-effects">What Screens Do to Your Brain</h2>
      <p>
        Every time you get a like, a new message, or a satisfying video, your brain releases a small burst of <strong>dopamine</strong> — the same neurotransmitter involved in eating, socialising, and achieving goals. The problem: this happens hundreds of times per day at a much lower effort cost than real achievements. Over time, your brain recalibrates its baseline.
      </p>
      <p>
        Things that used to feel rewarding — finishing homework, having a real conversation, going for a walk — start to feel flat compared to the constant micro-stimulation of a screen. This is called <strong>dopamine desensitisation</strong>, and it's a major driver of the motivation and concentration problems students report.
      </p>
      <p>
        Beyond dopamine, research from Harvard Medical School found that blue light from screens suppresses melatonin production, pushing your sleep onset back by up to 90 minutes. After two weeks of 11pm phone use, your cognitive performance on memory tasks drops to a level equivalent to being legally drunk.
      </p>
      <p>
        Social media specifically adds <strong>social comparison</strong> on top of this. Every time you view someone's highlight reel and compare it to your full, messy, real life — your brain registers a small stress response. Multiply that by 200 times per day and you have a chronically activated threat system.
      </p>

      {/* ── INTERACTIVE AUDIT ── */}
      <h2 id="audit">Your Screen Time Audit</h2>
      <p>
        Before building a detox plan, you need an honest baseline. Use the calculator below — it takes about 60 seconds and gives you a personalised Digital Health Score based on research-backed thresholds for each category.
      </p>

      <ScreenTimeAudit />

      <h2 id="detox-plan">The 7-Day Detox Plan</h2>
      <p>
        A "detox" doesn't mean throwing your phone in a river. It means intentionally reducing the passive, addictive use while keeping productive use intact. Here's a graduated plan:
      </p>

      {[
        { day: "Days 1–2", icon: "🧭", title: "Awareness", desc: "Turn on Screen Time (iPhone) or Digital Wellbeing (Android). Don't change anything yet — just observe. Most students are shocked by the real numbers versus what they estimated." },
        { day: "Days 3–4", icon: "🔇", title: "Notifications Off", desc: "Disable ALL non-essential notifications. Only keep calls, safety alerts, and calendar reminders. The average person checks their phone 96 times per day — 90% of those are notification-triggered." },
        { day: "Days 5–6", icon: "⏱️", title: "Time Limits Set", desc: "Set app daily limits: 30 min for social media, 45 min for video. When you hit the limit, put the phone in another room and do something physical for at least 10 minutes before reconsidering." },
        { day: "Day 7",    icon: "📵", title: "The Phone-Free Morning", desc: "For one full day, keep your phone off or in another room for the first two hours after waking. Notice how differently you feel. This one practice, extended over 21 days, is shown to reduce anxiety scores by 25%." },
      ].map(step => (
        <div key={step.day} style={{ display: 'flex', gap: '16px', background: 'var(--sand)', borderRadius: '12px', padding: '16px 18px', marginBottom: '12px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '28px', lineHeight: 1, marginTop: '2px' }}>{step.icon}</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--sage)', marginBottom: '3px' }}>{step.day}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '5px' }}>{step.title}</div>
            <div style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{step.desc}</div>
          </div>
        </div>
      ))}

      <h2 id="alternatives">What to Do Instead</h2>
      <p>
        The biggest mistake people make with detoxes is removing something without replacing it. Boredom is not an emergency — but your brain, rewired for constant stimulation, will treat it like one. Here are replacements that meet the same underlying needs:
      </p>

      {[
        { need: "Connection",      screen: "Scrolling social media",   replace: "15-min call with a friend you haven't spoken to in a month" },
        { need: "Entertainment",   screen: "YouTube Shorts / Reels",   replace: "Physical book, podcast on a walk, or a board game" },
        { need: "Stimulation",     screen: "Gaming",                   replace: "Puzzle, cooking a new recipe, or a 20-min sport" },
        { need: "Stress relief",   screen: "Mindless browsing",        replace: "4-7-8 breathing, journaling, or a 10-min walk outside" },
        { need: "Procrastination", screen: "Checking notifications",   replace: "The 2-minute rule: if a task takes under 2 minutes, do it now" },
      ].map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: i % 2 === 0 ? 'var(--sand)' : 'white', padding: '12px 14px', borderRadius: '10px', marginBottom: '6px', fontSize: '13px', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: 'var(--sage)' }}>{row.need}</span>
          <span style={{ color: '#8B1A1A', textDecoration: 'line-through', opacity: 0.7 }}>{row.screen}</span>
          <span style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>→ {row.replace}</span>
        </div>
      ))}

      <p style={{ marginTop: '24px' }}>
        A digital detox won't solve anxiety, depression, or loneliness on its own. But for many students, it removes a <em>constant amplifier</em> of those feelings — and that's often enough to make every other coping strategy work better. Start with one week. The clarity you feel by day 7 will be its own motivation to continue.
      </p>

      {/* 🧲 INTERNAL LINKING FOR SEO */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Exploring:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/mental-health-habits')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ 5 Simple Habits to Improve Your Mental Health in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/self-care-plan')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Creating a Personal Self-Care Plan That Works for You</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/blog/stop-comparing')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ How to Stop Comparing Yourself to Others in 2026</button></li>
          <li style={{ marginBottom: '12px' }}><button onClick={() => navigate('/safe')} style={{ background:'none', border:'none', color:'var(--sage)', fontWeight:'bold', cursor:'pointer', fontSize:'16px', padding:0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>→ Access 24/7 Professional Support in our Safe Corner</button></li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
