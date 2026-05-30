import React, { useState, useMemo, useCallback } from 'react';

// ─── CONTENT SAFETY FILTER ────────────────────────────────────────────────────
/**
 * isContentSafe(text)
 * Returns true if the text is safe to post, false if it contains blocked content.
 * Checks for: profanity, hate speech, death threats, self-harm keywords, and
 * common letter-substitution variations (e.g. f*ck, sh!t, etc.)
 */
export function isContentSafe(text) {
  if (!text || typeof text !== 'string') return true;
  const normalized = text
    .toLowerCase()
    .replace(/[*@#$!0]/g, (c) => ({ '*': '', '@': 'a', '#': '', '$': 's', '!': 'i', '0': 'o' }[c] || c))
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const BLOCKED_PATTERNS = [
    // Profanity
    /\bf+u+c+k+\b/,
    /\bsh[i1]+t+\b/,
    /\ba+s+s+h+o+l+e+\b/,
    /\bb[i1]+t+c+h+\b/,
    /\bc+u+n+t+\b/,
    /\bd+[i1]+c+k+\b/,
    /\bp+[i1]+s+s+\b/,
    /\bb+a+s+t+a+r+d+\b/,
    /\bm+o+t+h+e+r+f+u+c+k+\b/,
    /\bw+h+o+r+e+\b/,
    /\bs+l+u+t+\b/,
    /\bn+[i1]+g+g+[ae]+r+\b/,
    /\bf+a+g+g+[o0]+t+\b/,
    /\br+e+t+a+r+d+\b/,
    /\bc+r+a+p+\b/,
    /\bd+a+m+n+\b/,
    /\bh+e+l+l+\b/,
    /\bb+[o0]+l+l+[o0]+c+k+s+\b/,
    /\bw+a+n+k+e+r+\b/,
    /\bt+w+a+t+\b/,
    /\bb+u+g+g+e+r+\b/,
    /\bs+h+[i1]+t+e+\b/,
    /\ba+r+s+e+\b/,
    /\bb+l+[o0]+o+d+y+\b/,
    // Hate speech
    /\bh+a+t+e+\s+(you|him|her|them|all|everyone)\b/,
    /\b(kill|murder|destroy|eliminate)\s+(all|every|those)\b/,
    /\b(racist|racism|sexist|sexism|homophob)\b/,
    /\b(terrorist|terrorism|jihad)\b/,
    // Death threats / violence
    /\b(kill|murder|stab|shoot|bomb|attack|hurt|harm)\s+(you|him|her|them|myself|yourself|someone|people|everyone)\b/,
    /\bi\s+(want|will|gonna|going to|am going to)\s+(kill|murder|hurt|harm|destroy|end)\b/,
    /\b(death|die|dying)\s+(threat|wish|to|for)\b/,
    /\b(want|wish)\s+(you|him|her|them|everyone)\s+(dead|to die|to suffer)\b/,
    /\b(threaten|threatening|threat)\b/,
    // Self-harm / suicide keywords (protective filter)
    /\b(suicide|suicidal|kill myself|end my life|take my life|end it all)\b/,
    /\b(self.?harm|self.?hurt|cut myself|cutting myself|hurt myself)\b/,
    /\b(overdose|hang myself|jump off|slit my)\b/,
    /\b(want to die|wanna die|wish i was dead|better off dead|no reason to live)\b/,
    /\b(don.?t want to live|can.?t go on|no point in living)\b/,
  ];

  return !BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized));
}

// ─── DUMMY DATA: 50 UNIQUE POSITIVE STUDENT THOUGHTS ─────────────────────────
const BASE_NOTES = [
  { text: "Good luck on boards everyone! You've studied so hard for this. 💪", color: 'yellow' },
  { text: "Take a deep breath. You've got this. One question at a time.", color: 'blue' },
  { text: "Feeling overwhelmed today but trying my best. That's enough.", color: 'pink' },
  { text: "To whoever needs to hear this: your worth is not your marks.", color: 'green' },
  { text: "Just finished my last exam! To everyone still going — you're almost there! 🎉", color: 'yellow' },
  { text: "Remember to drink water and eat something today. Your brain needs fuel.", color: 'blue' },
  { text: "It's okay to not have everything figured out. You're still so young.", color: 'lavender' },
  { text: "Proud of myself for showing up today even when I didn't want to.", color: 'pink' },
  { text: "The fact that you're trying is already something to be proud of.", color: 'green' },
  { text: "Boards are just one chapter. Your whole story is still being written. 📖", color: 'yellow' },
  { text: "To the student crying in the bathroom — I see you. You're not alone.", color: 'blue' },
  { text: "Sleep is not laziness. Rest is part of the process. Take care of yourself.", color: 'lavender' },
  { text: "I got into my dream college today. Don't give up on yours. 🌟", color: 'pink' },
  { text: "Comparison is the thief of joy. Run your own race.", color: 'green' },
  { text: "Three more days. Just three more days. We can do this together.", color: 'yellow' },
  { text: "Your parents' dreams and your dreams can both be valid. Find the overlap.", color: 'blue' },
  { text: "I failed my mock test and I'm still here, still trying. Failure isn't final.", color: 'lavender' },
  { text: "Sending good vibes to every student pulling an all-nighter right now. 🌙", color: 'pink' },
  { text: "You don't have to be the topper to have a beautiful future.", color: 'green' },
  { text: "The anxiety before an exam is just your brain caring. Channel it.", color: 'yellow' },
  { text: "I used to think I was the only one struggling. This wall showed me I'm not.", color: 'blue' },
  { text: "To my future self reading this: you made it. I'm proud of you.", color: 'lavender' },
  { text: "Every expert was once a beginner. Keep going. 🚀", color: 'pink' },
  { text: "It's okay to ask for help. That's what the brave ones do.", color: 'green' },
  { text: "Your mental health matters more than your percentage. Always.", color: 'yellow' },
  { text: "I cried before my chemistry paper and still passed. Emotions don't define outcomes.", color: 'blue' },
  { text: "Wishing everyone calm nerves and clear minds for their exams today. 🍀", color: 'lavender' },
  { text: "You are more than your JEE rank. You are more than any number.", color: 'pink' },
  { text: "The path less taken is still a path. Don't be afraid to choose differently.", color: 'green' },
  { text: "To the first-generation college student: you're making history. Keep going.", color: 'yellow' },
  { text: "Breathe in for 4, hold for 7, out for 8. It actually works. Try it. 🌬️", color: 'blue' },
  { text: "I switched streams and it was the best decision I ever made. Trust yourself.", color: 'lavender' },
  { text: "Your hard work is seen, even when it feels invisible. Keep going.", color: 'pink' },
  { text: "Not every day will be productive. Some days, surviving is enough.", color: 'green' },
  { text: "To whoever is reading this at 2am studying: I'm right there with you. ✨", color: 'yellow' },
  { text: "Kindness costs nothing. Be kind to yourself today.", color: 'blue' },
  { text: "One bad exam does not define your intelligence or your future.", color: 'lavender' },
  { text: "I'm scared too. But scared and brave can exist at the same time.", color: 'pink' },
  { text: "Your journey is uniquely yours. Stop measuring it against someone else's.", color: 'green' },
  { text: "To the student who thinks they're not smart enough: you are. You really are.", color: 'yellow' },
  { text: "Progress, not perfection. That's the only goal worth chasing.", color: 'blue' },
  { text: "I found my passion at 19. Some find it at 30. There's no deadline.", color: 'lavender' },
  { text: "The world needs what only you can offer. Don't give up on finding it. 🌍", color: 'pink' },
  { text: "Sending a virtual hug to everyone who is doing their best today. 🤗", color: 'green' },
  { text: "You survived 100% of your worst days so far. That's a perfect record.", color: 'yellow' },
  { text: "It's okay to feel lost. Even GPS recalculates sometimes.", color: 'blue' },
  { text: "To the student who just got their results: your value was never in that number.", color: 'lavender' },
  { text: "Small steps still move you forward. Don't underestimate them.", color: 'pink' },
  { text: "I'm rooting for every single person on this wall. Genuinely. 💚", color: 'green' },
  { text: "The pressure will pass. What remains is who you became through it.", color: 'yellow' },
];

// ─── COLOR MAP ────────────────────────────────────────────────────────────────
const NOTE_COLORS = {
  yellow:   { bg: '#FFF9C4', border: '#F9E84A', shadow: 'rgba(249,232,74,0.35)', tape: '#F9E84A' },
  pink:     { bg: '#FCE4EC', border: '#F48FB1', shadow: 'rgba(244,143,177,0.35)', tape: '#F48FB1' },
  blue:     { bg: '#E3F2FD', border: '#90CAF9', shadow: 'rgba(144,202,249,0.35)', tape: '#90CAF9' },
  green:    { bg: '#E8F5E9', border: '#A5D6A7', shadow: 'rgba(165,214,167,0.35)', tape: '#A5D6A7' },
  lavender: { bg: '#EDE7F6', border: '#CE93D8', shadow: 'rgba(206,147,216,0.35)', tape: '#CE93D8' },
};

const COLOR_KEYS = Object.keys(NOTE_COLORS);

// ─── SHUFFLE UTILITY ─────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── GENERATE MASSIVE WALL (50 notes × 6 = 300 notes, shuffled) ──────────────
function generateWallNotes() {
  const expanded = [];
  for (let rep = 0; rep < 6; rep++) {
    BASE_NOTES.forEach((note, idx) => {
      expanded.push({
        id: `note-${rep}-${idx}`,
        text: note.text,
        color: rep === 0 ? note.color : COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)],
        rotation: (Math.random() - 0.5) * 6, // -3deg to +3deg
        scale: 0.95 + Math.random() * 0.1,   // 0.95 to 1.05
      });
    });
  }
  return shuffleArray(expanded);
}

// ─── STICKY NOTE COMPONENT ────────────────────────────────────────────────────
function StickyNote({ note }) {
  const c = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
  return (
    <div
      className="sw-note"
      style={{
        background: c.bg,
        borderColor: c.border,
        boxShadow: `3px 5px 18px ${c.shadow}, 0 1px 3px rgba(0,0,0,0.08)`,
        transform: `rotate(${note.rotation}deg) scale(${note.scale})`,
      }}
    >
      {/* Tape strip at top */}
      <div className="sw-note-tape" style={{ background: c.tape }} />
      <p className="sw-note-text">{note.text}</p>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SharzWall({ Maps }) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userNotes, setUserNotes] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 200;

  // Generate the massive wall once on mount
  const wallNotes = useMemo(() => generateWallNotes(), []);

  // All notes = user-posted notes (newest first) + the big wall
  const allNotes = useMemo(() => [...userNotes, ...wallNotes], [userNotes, wallNotes]);

  const handleTextChange = useCallback((e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setInputText(val);
      setCharCount(val.length);
      if (error) setError('');
    }
  }, [error]);

  const handlePost = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setError('Please write something before posting.');
      return;
    }
    if (trimmed.length < 5) {
      setError('Your note is too short. Share a little more! 😊');
      return;
    }
    if (!isContentSafe(trimmed)) {
      setError("Let's keep this space safe and positive. Please revise your note.");
      return;
    }
    // Add to wall
    const newNote = {
      id: `user-${Date.now()}`,
      text: trimmed,
      color: COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)],
      rotation: (Math.random() - 0.5) * 6,
      scale: 0.95 + Math.random() * 0.1,
      isNew: true,
    };
    setUserNotes(prev => [newNote, ...prev]);
    setInputText('');
    setCharCount(0);
    setError('');
    setSuccessMsg('Your note is on the wall! 💛 Thank you for spreading positivity.');
    setTimeout(() => setSuccessMsg(''), 4000);
  }, [inputText]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handlePost();
    }
  }, [handlePost]);

  return (
    <div className="sw-page">
      <style dangerouslySetInnerHTML={{ __html: SW_CSS }} />

      {/* ── TOP BAR ── */}
      <div className="sw-topbar">
        <button className="sw-back-btn" onClick={() => Maps && Maps('/')}>
          ← Back
        </button>
        <div className="sw-topbar-title">
          <span className="sw-topbar-icon">📌</span> The Sharz Wall
        </div>
        <div className="sw-topbar-count">{allNotes.length} notes</div>
      </div>

      {/* ── HERO ── */}
      <section className="sw-hero">
        <div className="sw-hero-inner">
          <div className="sw-hero-badge">✨ Anonymous · Positive · Safe</div>
          <h1 className="sw-hero-h1">The Sharz Wall</h1>
          <p className="sw-hero-sub">
            Leave a positive, anonymous thought for a fellow student. No names. No judgement. Just kindness.
          </p>
        </div>
      </section>

      {/* ── INPUT FORM ── */}
      <section className="sw-form-section">
        <div className="sw-form-card">
          <div className="sw-form-header">
            <span className="sw-form-icon">🖊️</span>
            <div>
              <h2 className="sw-form-title">Leave your thought</h2>
              <p className="sw-form-subtitle">Encouragement, a kind word, or something you wish someone had told you.</p>
            </div>
          </div>

          <div className="sw-textarea-wrap">
            <textarea
              className="sw-textarea"
              placeholder="e.g. &quot;Good luck on boards everyone! You've got this. 💪&quot;"
              value={inputText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={4}
              maxLength={MAX_CHARS}
            />
            <div className="sw-char-count" style={{ color: charCount > MAX_CHARS * 0.9 ? '#E8845A' : '#7A8A7D' }}>
              {charCount}/{MAX_CHARS}
            </div>
          </div>

          {error && (
            <div className="sw-error">
              <span>⚠️</span> {error}
            </div>
          )}
          {successMsg && (
            <div className="sw-success">
              <span>✅</span> {successMsg}
            </div>
          )}

          <div className="sw-form-footer">
            <p className="sw-anon-note">🔒 100% anonymous. No account needed.</p>
            <button className="sw-post-btn" onClick={handlePost}>
              Post to Wall 📌
            </button>
          </div>
          <p className="sw-hint">Tip: Press Ctrl+Enter to post quickly.</p>
        </div>
      </section>

      {/* ── WALL STATS STRIP ── */}
      <div className="sw-stats-strip">
        <div className="sw-stat">
          <span className="sw-stat-num">{allNotes.length}</span>
          <span className="sw-stat-label">Notes on the wall</span>
        </div>
        <div className="sw-stat-divider" />
        <div className="sw-stat">
          <span className="sw-stat-num">100%</span>
          <span className="sw-stat-label">Anonymous</span>
        </div>
        <div className="sw-stat-divider" />
        <div className="sw-stat">
          <span className="sw-stat-num">💚</span>
          <span className="sw-stat-label">Positivity only</span>
        </div>
      </div>

      {/* ── THE WALL ── */}
      <section className="sw-wall-section">
        <div className="sw-wall-grid">
          {allNotes.map((note) => (
            <StickyNote key={note.id} note={note} />
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <div className="sw-footer-cta">
        <p>Feeling overwhelmed? You're not alone.</p>
        <button className="sw-footer-btn" onClick={() => Maps && Maps('/mindspace')}>
          Try Emotional First Aid →
        </button>
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const SW_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .sw-page {
    min-height: 100vh;
    background: #F7F3ED;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding-bottom: 80px;
  }

  /* ── TOP BAR ── */
  .sw-topbar {
    background: #1E2820;
    color: white;
    height: 56px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 300;
    border-bottom: 3px solid #F9E84A;
  }
  .sw-back-btn {
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sw-back-btn:hover { color: white; }
  .sw-topbar-title {
    font-family: 'Fraunces', serif;
    font-size: 17px;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sw-topbar-icon { font-size: 18px; }
  .sw-topbar-count {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.5px;
  }

  /* ── HERO ── */
  .sw-hero {
    background: linear-gradient(135deg, #1E2820 0%, #2D4A38 60%, #3D5A48 100%);
    padding: 80px 48px 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .sw-hero::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(249,232,74,0.07), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .sw-hero::after {
    content: '';
    position: absolute;
    bottom: -60px; right: -40px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(165,214,167,0.08), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .sw-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 700px;
    margin: 0 auto;
  }
  .sw-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(249,232,74,0.12);
    border: 1px solid rgba(249,232,74,0.3);
    color: #F9E84A;
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 24px;
  }
  .sw-hero-h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }
  .sw-hero-sub {
    font-size: clamp(16px, 2vw, 19px);
    color: rgba(255,255,255,0.75);
    line-height: 1.65;
    max-width: 560px;
    margin: 0 auto;
    font-weight: 400;
  }

  /* ── FORM SECTION ── */
  .sw-form-section {
    max-width: 720px;
    margin: -48px auto 0;
    padding: 0 24px;
    position: relative;
    z-index: 20;
  }
  .sw-form-card {
    background: white;
    border-radius: 24px;
    padding: 36px 40px;
    box-shadow: 0 20px 60px rgba(30,40,32,0.14);
    border: 1px solid rgba(74,124,89,0.12);
  }
  .sw-form-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }
  .sw-form-icon {
    font-size: 32px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .sw-form-title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 700;
    color: #1E2820;
    margin-bottom: 4px;
  }
  .sw-form-subtitle {
    font-size: 14px;
    color: #7A8A7D;
    line-height: 1.5;
    margin: 0;
  }
  .sw-textarea-wrap {
    position: relative;
    margin-bottom: 16px;
  }
  .sw-textarea {
    width: 100%;
    border: 2px solid rgba(74,124,89,0.2);
    border-radius: 16px;
    padding: 18px 20px 36px;
    font-family: 'Caveat', cursive;
    font-size: 18px;
    color: #1E2820;
    background: #FDFCFA;
    resize: none;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.6;
  }
  .sw-textarea:focus {
    border-color: #4A7C59;
    box-shadow: 0 0 0 4px rgba(74,124,89,0.1);
    background: white;
  }
  .sw-textarea::placeholder {
    color: #B0BDB3;
    font-family: 'Caveat', cursive;
  }
  .sw-char-count {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: 12px;
    font-weight: 600;
    transition: color 0.2s;
  }
  .sw-error {
    background: #FFF0F0;
    border: 1.5px solid #F48FB1;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #C0392B;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sw-success {
    background: #E8F5E9;
    border: 1.5px solid #A5D6A7;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #2D7D46;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: sw-fade-in 0.3s ease;
  }
  @keyframes sw-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sw-form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .sw-anon-note {
    font-size: 13px;
    color: #7A8A7D;
    font-weight: 600;
    margin: 0;
  }
  .sw-post-btn {
    background: #4A7C59;
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 6px 20px rgba(74,124,89,0.35);
    transition: all 0.25s;
    white-space: nowrap;
  }
  .sw-post-btn:hover {
    background: #2D5240;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(74,124,89,0.4);
  }
  .sw-post-btn:active {
    transform: translateY(0);
  }
  .sw-hint {
    font-size: 12px;
    color: #B0BDB3;
    margin-top: 12px;
    text-align: right;
  }

  /* ── STATS STRIP ── */
  .sw-stats-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 32px 24px;
    max-width: 600px;
    margin: 40px auto 0;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(30,40,32,0.06);
    border: 1px solid rgba(74,124,89,0.1);
  }
  .sw-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .sw-stat-num {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 700;
    color: #4A7C59;
    line-height: 1;
  }
  .sw-stat-label {
    font-size: 12px;
    font-weight: 700;
    color: #7A8A7D;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
  .sw-stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(74,124,89,0.15);
  }

  /* ── WALL SECTION ── */
  .sw-wall-section {
    padding: 48px 24px 0;
    max-width: 1400px;
    margin: 0 auto;
  }
  .sw-wall-grid {
    columns: 5 200px;
    column-gap: 20px;
  }

  /* ── STICKY NOTE ── */
  .sw-note {
    break-inside: avoid;
    display: inline-block;
    width: 100%;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid;
    padding: 28px 20px 20px;
    margin-bottom: 20px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .sw-note:hover {
    transform: rotate(0deg) scale(1.04) !important;
    box-shadow: 6px 10px 28px rgba(0,0,0,0.18) !important;
    z-index: 10;
    position: relative;
  }
  .sw-note-tape {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 20px;
    border-radius: 3px;
    opacity: 0.6;
  }
  .sw-note-text {
    font-family: 'Caveat', cursive;
    font-size: 17px;
    line-height: 1.55;
    color: #2D3A30;
    margin: 0;
    word-break: break-word;
  }

  /* ── FOOTER CTA ── */
  .sw-footer-cta {
    text-align: center;
    padding: 60px 24px 40px;
    max-width: 500px;
    margin: 0 auto;
  }
  .sw-footer-cta p {
    font-size: 16px;
    color: #7A8A7D;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .sw-footer-btn {
    background: transparent;
    color: #4A7C59;
    border: 2px solid rgba(74,124,89,0.3);
    padding: 14px 32px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .sw-footer-btn:hover {
    background: #4A7C59;
    color: white;
    border-color: #4A7C59;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .sw-hero { padding: 60px 24px 80px; }
    .sw-form-card { padding: 28px 24px; }
    .sw-wall-grid { columns: 3 160px; }
    .sw-stats-strip { gap: 24px; }
  }
  @media (max-width: 600px) {
    .sw-topbar { padding: 0 16px; }
    .sw-hero { padding: 48px 20px 72px; }
    .sw-form-section { padding: 0 16px; }
    .sw-form-card { padding: 24px 20px; }
    .sw-wall-grid { columns: 2 140px; column-gap: 12px; }
    .sw-wall-section { padding: 32px 12px 0; }
    .sw-note { padding: 24px 14px 16px; margin-bottom: 12px; }
    .sw-note-text { font-size: 15px; }
    .sw-stats-strip { gap: 16px; padding: 24px 16px; }
    .sw-stat-num { font-size: 22px; }
    .sw-form-footer { flex-direction: column; align-items: stretch; }
    .sw-post-btn { width: 100%; text-align: center; }
  }
`;
