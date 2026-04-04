import React, { useState, useEffect } from 'react';
import BlogPostTemplate from '../../../BlogPostTemplate';

// ── META ─────────────────────────────────────────────────────────────────────
export const meta = {
  title: "How to Deal with Negative Self-Talk in 2026",
  excerpt: "The voice in your head is not always telling the truth. Learn how to identify the patterns, challenge them using CBT techniques, and replace them with something real — not just positive.",
  category: "Mental Health",
  date: "26-01-2026",
  readTime: "8 min read",
  wordCount: 2000,
  imgUrl: "/blogss/2026/January/negative-self-talk-fix.jpg",
  tldr: "Negative self-talk runs on automatic cognitive distortions that feel true but aren't. CBT-based reframing — catching the thought, naming the distortion, and writing a balanced alternative — can measurably reduce anxiety and depression within 6 weeks.",
  toc: [
    { id: "what-is-self-talk", title: "What Is Self-Talk?", level: 2 },
    { id: "patterns", title: "The 8 Patterns to Recognise", level: 2 },
    { id: "reframing-gym", title: "Thought Reframing Gym ← Try This", level: 2 },
    { id: "reframing-techniques", title: "Reframing Techniques That Work", level: 2 },
    { id: "affirmations", title: "Why Affirmations Alone Don't Work", level: 2 },
  ],
};

// ── INTERACTIVE: THOUGHT REFRAMING GYM ───────────────────────────────────────
const DISTORTIONS = [
  {
    id: "allornothing",
    label: "All-or-Nothing Thinking",
    icon: "⚫⚪",
    desc: "Seeing things in black and white with no middle ground.",
    example: '"I got one question wrong — I failed completely."',
    reframe: (thought) => `Notice that "${thought}" uses absolute language (always/never/completely/totally). Real life almost always has a middle ground. What percentage of this situation is actually going wrong, versus going okay?`,
  },
  {
    id: "overgeneralisation",
    label: "Overgeneralisation",
    icon: "∞",
    desc: "Taking one negative event and seeing it as a never-ending pattern.",
    example: '"I embarrassed myself once — I always do this."',
    reframe: (thought) => `The thought "${thought}" is drawing a permanent conclusion from a single event. Ask yourself: How many times has the opposite also been true? Can you name three specific examples that contradict this pattern?`,
  },
  {
    id: "mental-filter",
    label: "Mental Filter",
    icon: "🔍",
    desc: "Focusing exclusively on one negative detail while ignoring the whole picture.",
    example: '"My teacher praised my essay but pointed out two errors — it was terrible."',
    reframe: (thought) => `Your mind filtered to "${thought}" and may be discarding the rest of the picture. If a friend described this exact situation to you, what positives would you point out that they're ignoring?`,
  },
  {
    id: "mind-reading",
    label: "Mind Reading",
    icon: "🔮",
    desc: "Assuming you know what others are thinking, usually negatively.",
    example: '"They didn\'t reply — they\'re definitely angry with me."',
    reframe: (thought) => `"${thought}" assumes you can read minds. List three alternative explanations for the same situation that have nothing to do with how they feel about you. Which is most likely, honestly?`,
  },
  {
    id: "catastrophising",
    label: "Catastrophising",
    icon: "💥",
    desc: "Expecting the worst possible outcome.",
    example: '"If I fail this test, my entire future is ruined."',
    reframe: (thought) => `"${thought}" jumps to the worst-case scenario. Ask: What's the most realistic outcome? And even in the unlikely worst case — what's one thing you could do to cope or recover? Catastrophes rarely have no recovery path.`,
  },
  {
    id: "should-statements",
    label: '"Should" Statements',
    icon: "📏",
    desc: "Holding yourself to rigid rules that create guilt and shame.",
    example: '"I should be able to handle this. I shouldn\'t feel anxious."',
    reframe: (thought) => `"${thought}" contains an invisible rulebook — but who wrote those rules? Replace "should" with "it would be helpful if" or "I'd prefer if" and notice how much pressure lifts. You are not a machine with preset performance requirements.`,
  },
  {
    id: "personalisation",
    label: "Personalisation",
    icon: "🎯",
    desc: "Blaming yourself for things outside your control.",
    example: '"My parents are stressed — it must be because of me."',
    reframe: (thought) => `"${thought}" takes on responsibility that may not belong to you. List the external factors that also contributed to this situation. What percentage of this is actually within your control, and what percentage isn't?`,
  },
  {
    id: "emotional-reasoning",
    label: "Emotional Reasoning",
    icon: "❤️‍🔥",
    desc: "Assuming that because you feel something, it must be true.",
    example: '"I feel like a failure, so I must be one."',
    reframe: (thought) => `"${thought}" uses feelings as evidence of facts. Feelings are real and valid — but they're not always accurate reporters of reality. What concrete evidence exists FOR and AGAINST this thought? What would a fair judge conclude from that evidence?`,
  },
];

const GYM_CSS = `
  .gym-card { background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 28px; margin: 32px 0; box-shadow: var(--shadow-sm); }
  .gym-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .gym-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }
  .gym-step { display: flex; gap: 12px; margin-bottom: 20px; align-items: flex-start; }
  .gym-step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--sage); color: white; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .gym-step-body { flex: 1; }
  .gym-step-label { font-size: 13px; font-weight: 700; color: var(--sage); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .gym-textarea { width: 100%; padding: 13px 16px; border: 2px solid var(--border); border-radius: 12px; font-size: 15px; font-family: inherit; resize: none; color: var(--ink); line-height: 1.6; transition: border 0.2s; min-height: 90px; box-sizing: border-box; }
  .gym-textarea:focus { outline: none; border-color: var(--sage); }
  .distortion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .dist-btn { padding: 11px 14px; border: 2px solid var(--border); border-radius: 12px; background: white; text-align: left; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .dist-btn:hover { border-color: var(--sage-light); background: var(--sage-pale); }
  .dist-btn.selected { border-color: var(--sage); background: var(--sage-pale); }
  .dist-btn-top { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
  .dist-btn-icon { font-size: 14px; }
  .dist-btn-label { font-size: 13px; font-weight: 700; color: var(--ink); line-height: 1.2; }
  .dist-btn-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }
  .gym-reframe-box { background: linear-gradient(135deg, var(--sage-pale), var(--lav-pale)); border-radius: 14px; padding: 20px 22px; margin-top: 4px; border: 1px solid rgba(74,124,89,0.2); animation: gymFadeIn 0.4s ease; }
  @keyframes gymFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .gym-reframe-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--sage); color: white; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; }
  .gym-reframe-text { font-size: 15px; color: var(--ink-soft); line-height: 1.75; }
  .gym-action-btn { padding: 12px 28px; background: var(--sage); color: white; border: none; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; margin-top: 8px; }
  .gym-action-btn:hover { background: var(--moss); }
  .gym-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .gym-journal { margin-top: 24px; border-top: 1px solid var(--border); padding-top: 20px; }
  .gym-journal-title { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .gym-journal-entry { background: var(--sand); border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; font-size: 13px; }
  .gym-journal-meta { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; flex-wrap: wrap; }
  .gym-journal-dist { background: var(--sage-pale); color: var(--sage); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .gym-journal-time { font-size: 10px; color: var(--muted); }
  .gym-journal-thought { font-weight: 600; color: var(--ink); margin-bottom: 3px; }
  .gym-journal-reframe-preview { font-size: 12px; color: var(--ink-soft); opacity: 0.8; }
  @media(max-width: 600px) { .distortion-grid { grid-template-columns: 1fr; } }
`;

function ThoughtReframingGym() {
  const [thought, setThought]           = useState('');
  const [selectedDist, setSelectedDist] = useState(null);
  const [reframe, setReframe]           = useState(null);
  const [journal, setJournal]           = useState([]);
  const [phase, setPhase]               = useState('input'); // input | distortion | result

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = GYM_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const handleGenerate = () => {
    if (!thought.trim() || !selectedDist) return;
    const dist = DISTORTIONS.find(d => d.id === selectedDist);
    const r = dist.reframe(thought.trim());
    setReframe(r);
    setPhase('result');
  };

  const handleSave = () => {
    if (!reframe) return;
    const dist = DISTORTIONS.find(d => d.id === selectedDist);
    setJournal(prev => [
      {
        thought: thought.trim(),
        distortion: dist.label,
        reframe,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ].slice(0, 5));
    setThought('');
    setSelectedDist(null);
    setReframe(null);
    setPhase('input');
  };

  const handleReset = () => {
    setThought('');
    setSelectedDist(null);
    setReframe(null);
    setPhase('input');
  };

  return (
    <div className="gym-card">
      <div className="gym-title">🏋️ Thought Reframing Gym</div>
      <div className="gym-sub">Write a real thought that&apos;s been bothering you, identify its pattern, and get a personalised CBT reframe. Treat this like a private journal — no one else can see it.</div>

      {/* Step 1 */}
      <div className="gym-step">
        <div className="gym-step-num">1</div>
        <div className="gym-step-body">
          <div className="gym-step-label">Write the thought</div>
          <textarea
            className="gym-textarea"
            placeholder="&quot;I always mess things up.&quot; / &quot;Nobody really likes me.&quot; / &quot;I'll never be good enough...&quot;"
            value={thought}
            onChange={e => { setThought(e.target.value); setPhase('input'); setReframe(null); }}
            disabled={phase === 'result'}
            maxLength={300}
          />
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', textAlign: 'right' }}>{thought.length}/300</div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="gym-step">
        <div className="gym-step-num">2</div>
        <div className="gym-step-body">
          <div className="gym-step-label">Identify the pattern</div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>Which of these sounds most like your thought? (Pick the closest one — it doesn&apos;t have to be perfect)</p>
          <div className="distortion-grid">
            {DISTORTIONS.map(d => (
              <button
                key={d.id}
                className={`dist-btn ${selectedDist === d.id ? 'selected' : ''}`}
                onClick={() => { setSelectedDist(d.id); setPhase('distortion'); setReframe(null); }}
                disabled={phase === 'result'}
              >
                <div className="dist-btn-top">
                  <span className="dist-btn-icon">{d.icon}</span>
                  <span className="dist-btn-label">{d.label}</span>
                </div>
                <div className="dist-btn-desc">{d.desc}</div>
              </button>
            ))}
          </div>

          {selectedDist && phase !== 'result' && (
            <div style={{ marginTop: '12px', background: 'var(--sand)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: 'var(--ink-soft)' }}>
              <strong>Example of this pattern:</strong> {DISTORTIONS.find(d => d.id === selectedDist)?.example}
            </div>
          )}
        </div>
      </div>

      {/* Step 3 */}
      <div className="gym-step">
        <div className="gym-step-num">3</div>
        <div className="gym-step-body">
          <div className="gym-step-label">Get your reframe</div>
          {phase !== 'result' ? (
            <button
              className="gym-action-btn"
              onClick={handleGenerate}
              disabled={!thought.trim() || !selectedDist}
            >
              Reframe My Thought →
            </button>
          ) : (
            <>
              <div className="gym-reframe-box">
                <div className="gym-reframe-badge">🔄 CBT Reframe</div>
                <div className="gym-reframe-text">{reframe}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                <button className="gym-action-btn" onClick={handleSave}>Save to My Journal ✓</button>
                <button className="gym-action-btn" style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)' }} onClick={handleReset}>Try Another Thought</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Session Journal */}
      {journal.length > 0 && (
        <div className="gym-journal">
          <div className="gym-journal-title">📓 Your Session Journal ({journal.length} reframe{journal.length > 1 ? 's' : ''})</div>
          {journal.map((entry, i) => (
            <div className="gym-journal-entry" key={i}>
              <div className="gym-journal-meta">
                <span className="gym-journal-dist">{entry.distortion}</span>
                <span className="gym-journal-time">{entry.time}</span>
              </div>
              <div className="gym-journal-thought">&quot;{entry.thought}&quot;</div>
              <div className="gym-journal-reframe-preview">{entry.reframe.slice(0, 100)}…</div>
            </div>
          ))}
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic' }}>These are saved for this session only. Refresh the page to clear.</p>
        </div>
      )}
    </div>
  );
}

// ── POST COMPONENT ────────────────────────────────────────────────────────────
export default function NegativeSelfTalk({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <h2 id="what-is-self-talk">What Is Self-Talk?</h2>
      <p>
        You have an internal monologue running every waking hour. It comments on everything you do, compares you to others, predicts how situations will go, and interprets what people mean when they look at you a certain way. This is <strong>self-talk</strong> — and for most people, it&apos;s overwhelmingly negative.
      </p>
      <p>
        Research by the National Science Foundation found that people have approximately 6,200 thoughts per day, and for the average person, the majority of these are negative and repetitive. More alarmingly, 90% of today&apos;s negative thoughts are the same thoughts you had yesterday.
      </p>
      <p>
        Negative self-talk isn&apos;t just unpleasant. It&apos;s clinically linked to higher rates of anxiety, depression, lower academic performance, and weaker immune function. The voice in your head can literally make you sick.
      </p>
      <blockquote>
        &quot;You would never speak to a friend the way you speak to yourself in your worst moments. Why do you give yourself less compassion than a stranger?&quot;
      </blockquote>

      <h2 id="patterns">The 8 Patterns to Recognise</h2>
      <p>
        Cognitive Behavioural Therapy (CBT) — the most evidence-based form of therapy — identifies recurring patterns in negative self-talk called <strong>cognitive distortions</strong>. These are thinking errors that feel completely logical and true in the moment, but systematically distort reality in a negative direction.
      </p>
      <p>
        You don&apos;t need to have anxiety or depression to experience these. Every human brain runs on these shortcuts. The difference between someone with high self-compassion and someone who struggles is simply their ability to <em>notice and name</em> the distortion when it&apos;s happening.
      </p>

      {DISTORTIONS.map((d, i) => (
        <div key={d.id} style={{ display: 'flex', gap: '14px', padding: '14px', background: i % 2 === 0 ? 'var(--sand)' : 'white', borderRadius: '12px', marginBottom: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '22px', width: '28px', flexShrink: 0, marginTop: '2px' }}>{d.icon}</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '3px', fontSize: '15px' }}>{d.label}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>{d.desc}</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>e.g. {d.example}</div>
          </div>
        </div>
      ))}

      {/* ── INTERACTIVE GYM ── */}
      <h2 id="reframing-gym">Thought Reframing Gym</h2>
      <p>
        The fastest way to understand reframing is to practice it on your own actual thoughts. Use the tool below — type a real thought that&apos;s been weighing on you, identify which pattern it follows, and receive a personalised CBT reframe built around your specific words.
      </p>

      <ThoughtReframingGym />

      <h2 id="reframing-techniques">Reframing Techniques That Work</h2>
      <p>Beyond the tool, here are four portable techniques you can use anywhere, anytime:</p>

      {[
        { title: "The Prosecutor Test", body: "Ask: if this thought were on trial, what evidence exists FOR it, and what evidence exists AGAINST it? Most negative self-beliefs lose the case when examined as claims rather than facts." },
        { title: "The Best Friend Standard", body: 'Ask: if my best friend told me they were thinking this about themselves, what would I say? Now apply that exact response to yourself. You deserve the same compassion you offer others.' },
        { title: "Defusion (Naming the Thought)", body: 'Instead of "I\'m a failure", say "I\'m having the thought that I\'m a failure." This tiny linguistic shift creates distance between you and the thought. You are not your thoughts — you are the observer of them.' },
        { title: "The 5-Year Test", body: 'Ask: will this still matter in five years? For most of the situations that trigger negative self-talk — a bad test, an awkward conversation, a rejected idea — the answer is no. This reframes urgency.' },
      ].map((t, i) => (
        <div key={i} style={{ border: '1.5px solid var(--border)', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px', background: 'white', borderLeftWidth: '4px', borderLeftColor: 'var(--sage)' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>{t.title}</div>
          <div style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{t.body}</div>
        </div>
      ))}

      <h2 id="affirmations">Why Affirmations Alone Don&apos;t Work</h2>
      <p>
        The popular advice to &quot;just say positive affirmations&quot; is well-intentioned but misses a crucial mechanism. If your brain doesn&apos;t believe the affirmation, it generates an automatic counter-argument — <em>&quot;I am worthy&quot;</em> is immediately followed by <em>&quot;No you&apos;re not, remember what happened last Tuesday?&quot;</em> — and the net result is feeling worse.
      </p>
      <p>
        Research by Joanne Wood at the University of Waterloo found that positive self-statements actually decreased mood in people with low self-esteem — the people who need them most.
      </p>
      <p>
        The solution is <strong>balanced, specific, realistic self-talk</strong> rather than relentlessly positive talk. Instead of &quot;I am amazing at everything,&quot; try: <em>&quot;I struggled with this test, but I also helped my friend study, and I showed up even when I didn&apos;t feel like it.&quot;</em> That statement is credible. Your brain can accept it. And from credible foundations, genuine confidence is built.
      </p>
      <p>
        Start with the Reframing Gym above. Practice noticing one distorted thought per day. Over six weeks, this single habit — documented in dozens of CBT studies — consistently reduces symptoms of anxiety and depression by 30–50% without any other intervention. Your inner voice can change. It just needs a new script.
      </p>

    </BlogPostTemplate>
  );
}
