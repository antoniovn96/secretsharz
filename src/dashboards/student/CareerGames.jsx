import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const GAMES = [
  { id: 'sudoku', icon: '🔢', title: 'Mini Sudoku', subtitle: 'Official Sudoku Puzzle Hub experience', free: 'Play online', pro: 'Progress insights + expanded access', externalUrl: 'https://sudokupuzzlehub.com/mini-sudoku/' },
  { id: 'scramble', icon: '🔤', title: 'Word Scramble', subtitle: 'Build vocabulary and pattern speed', free: 'Starter word sets', pro: 'Full word library + themed career sets' },
  { id: 'memory', icon: '🧠', title: 'Memory Match', subtitle: 'A gentle memory and attention challenge', free: 'Starter board', pro: 'Larger boards + themed decks + personal bests' },
  { id: 'careerquest', icon: '🧭', title: 'Career Quest', subtitle: 'Explore decisions, skills and pathways', free: 'Daily challenge', pro: 'Full quest library + personalised scenarios' },
];
const storageKey = uid => `vidyavantage-games:${uid}`;
const prefKey = uid => `vidyavantage-accessibility:${uid}`;
const focusStyle = { outline: '3px solid var(--focus)', outlineOffset: 2 };

const NAV = [
  ['home', '🏠', 'Dashboard', '/dashboard/career'],
  ['assessment', '🧭', 'Assessment', '/dashboard/career/assessment'],
  ['results', '📊', 'Results', '/dashboard/career/results'],
  ['roadmap', '🗺️', 'Roadmap', '/dashboard/career/roadmap'],
  ['journal', '✍️', 'Journal', '/dashboard/career/journal'],
  ['sessions', '💬', 'Sessions', '/dashboard/career/sessions'],
  ['resources', '📚', 'Resources', '/dashboard/career/resources'],
  ['games', '🎮', 'Games', '/dashboard/career/games'],
  ['profile', '👤', 'My Profile', '/dashboard/career/profile'],
  ['settings', '⚙️', 'Settings', '/dashboard/career/settings'],
];

function navigate(path) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

function useA11y(user) {
  const [settings, setSettings] = useState({ theme: 'light', textScale: 1, highContrast: false, reduceMotion: false, underlineLinks: false });
  useEffect(() => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(prefKey(user.uid));
      if (stored) setSettings(s => ({ ...s, ...JSON.parse(stored) }));
    } catch (_) {}
  }, [user]);
  useEffect(() => {
    if (!user) return;
    try { localStorage.setItem(prefKey(user.uid), JSON.stringify(settings)); } catch (_) {}
  }, [user, settings]);
  return [settings, setSettings];
}

function AccessibilityPanel({ settings, setSettings, onClose }) {
  return <div role="dialog" aria-modal="true" aria-labelledby="accessibility-title" style={{ position: 'absolute', right: 0, top: 52, zIndex: 30, width: 330, maxWidth: 'calc(100vw - 28px)', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, boxShadow: '0 18px 45px rgba(15,23,42,.18)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><div><div style={eyebrow}>ACCESSIBILITY</div><h2 id="accessibility-title" style={{ margin: '4px 0 0', fontSize: 19 }}>Make this space work for you</h2></div><button aria-label="Close accessibility settings" onClick={onClose} className="a11y-focus" style={iconButton}>×</button></div>
    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      <div><div style={fieldLabel}>Text size</div><div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>{[1, 1.25, 1.5, 1.75, 2].map(scale => <button key={scale} aria-pressed={settings.textScale === scale} onClick={() => setSettings(s => ({ ...s, textScale: scale }))} className="a11y-focus" style={{ ...smallChoice, background: settings.textScale === scale ? 'var(--accent-soft)' : 'var(--surface-2)', color: 'var(--text)', borderColor: settings.textScale === scale ? 'var(--accent)' : 'var(--border)' }}>{Math.round(scale * 100)}%</button>)}</div><div style={{ marginTop: 5, color: 'var(--muted)', fontSize: 11 }}>Supports enlargement up to 200%.</div></div>
      <Toggle label="High contrast" checked={settings.highContrast} onChange={v => setSettings(s => ({ ...s, highContrast: v }))} />
      <Toggle label="Reduce motion" checked={settings.reduceMotion} onChange={v => setSettings(s => ({ ...s, reduceMotion: v }))} />
      <Toggle label="Underline links" checked={settings.underlineLinks} onChange={v => setSettings(s => ({ ...s, underlineLinks: v }))} />
    </div>
    <div style={{ marginTop: 14, padding: 11, borderRadius: 11, background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 11, lineHeight: 1.55 }}>Keyboard navigation, visible focus indicators, labelled controls and predictable layouts are supported throughout this workspace.</div>
  </div>;
}

function Toggle({ label, checked, onChange }) {
  return <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, cursor: 'pointer', minHeight: 44 }}><span style={{ fontWeight: 800, fontSize: 13 }}>{label}</span><button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="a11y-focus" style={{ width: 50, height: 28, border: 0, borderRadius: 999, padding: 3, background: checked ? 'var(--accent)' : 'var(--muted-border)', cursor: 'pointer' }}><span style={{ display: 'block', width: 22, height: 22, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(22px)' : 'translateX(0)', transition: checked ? 'transform .18s' : 'none' }} /></button></label>;
}

function WordScramble({ pro }) {
  const words = pro ? ['ARCHITECT', 'PSYCHOLOGY', 'ANALYST', 'DESIGNER'] : ['CAREER', 'SKILL', 'VALUE'];
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState(''); const [message, setMessage] = useState(''); const word = words[index % words.length];
  const scramble = value => { const chars = value.split(''); for (let i = chars.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [chars[i], chars[j]] = [chars[j], chars[i]]; } return chars.join(''); };
  const [scrambled, setScrambled] = useState(() => scramble(word)); useEffect(() => setScrambled(scramble(word)), [word]);
  const check = () => setMessage(answer.trim().toUpperCase() === word ? 'Correct! ⭐' : 'Not quite — try again.');
  return <div style={{ textAlign: 'center' }}><div style={{ fontSize: 30, fontWeight: 950, letterSpacing: 6, margin: '22px 0' }} aria-label="Scrambled word">{scrambled}</div><label htmlFor="scramble-answer" style={{ display: 'block', textAlign: 'left', maxWidth: 320, margin: '0 auto 6px', fontWeight: 800, fontSize: 12 }}>Your answer</label><input id="scramble-answer" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') check(); }} placeholder="Unscramble the word" style={inputBase} /><div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}><button onClick={check} className="a11y-focus" style={primaryBtn}>Check answer</button><button onClick={() => { setIndex(i => i + 1); setAnswer(''); setMessage(''); }} className="a11y-focus" style={secondaryBtn}>Next</button></div>{message && <div role="status" aria-live="polite" style={{ marginTop: 12, fontWeight: 800 }}>{message}</div>}{!pro && <div style={hintStyle}>Pro unlocks larger word libraries and career-themed sets.</div>}</div>;
}

function MemoryMatch({ pro }) {
  const values = pro ? ['🎨', '🧪', '⚖️', '💻', '🧠', '🌱', '📐', '🎤'] : ['🎨', '🧪', '⚖️', '💻'];
  const [deck, setDeck] = useState([]); const [open, setOpen] = useState([]); const [matched, setMatched] = useState([]);
  useEffect(() => { setDeck([...values, ...values].sort(() => Math.random() - 0.5)); setOpen([]); setMatched([]); }, [pro]);
  const click = i => { if (open.includes(i) || matched.includes(i) || open.length >= 2) return; const next = [...open, i]; setOpen(next); if (next.length === 2 && deck[next[0]] === deck[next[1]]) { setMatched(m => [...m, ...next]); setOpen([]); } else if (next.length === 2) setTimeout(() => setOpen([]), 650); };
  return <div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(48px, 62px))', gap: 8, justifyContent: 'center', margin: '18px 0' }}>{deck.map((v, i) => { const shown = open.includes(i) || matched.includes(i); return <button key={i} onClick={() => click(i)} aria-label={shown ? `Memory card ${i + 1}, ${v}` : `Memory card ${i + 1}, hidden`} className="a11y-focus" style={{ width: '100%', aspectRatio: '1', border: '1px solid var(--border)', borderRadius: 10, background: shown ? 'var(--accent-soft)' : 'var(--navy)', color: shown ? 'var(--text)' : '#fff', fontSize: 24, cursor: 'pointer' }}>{shown ? v : '?'}</button>; })}</div><div role="status" aria-live="polite" style={{ textAlign: 'center', fontWeight: 800, color: 'var(--muted)' }}>{matched.length / 2} pairs matched</div></div>;
}

function CareerQuest({ pro }) {
  const questions = pro ? [['A school project needs someone to organise the plan and keep everyone on track. What would you enjoy most?', ['Build the timeline', 'Create the visuals', 'Interview people', 'Solve the technical problem']], ['You have one weekend to learn a new skill. Which feels most satisfying?', ['Understand how a system works', 'Make something creative', 'Help someone improve', 'Analyse the numbers']]] : [['Which activity sounds most interesting today?', ['Solve a puzzle', 'Design a poster', 'Help a friend', 'Plan a small project']]];
  const [step, setStep] = useState(0); const [choice, setChoice] = useState(null); const q = questions[step % questions.length];
  return <div><div style={{ fontWeight: 900, color: 'var(--accent)', fontSize: 12, textTransform: 'uppercase' }}>Career scenario {step + 1}</div><h3 style={{ fontSize: 20, lineHeight: 1.5 }}>{q[0]}</h3><div style={{ display: 'grid', gap: 9 }}>{q[1].map((x, i) => <button key={x} onClick={() => setChoice(i)} aria-pressed={choice === i} className="a11y-focus" style={{ textAlign: 'left', minHeight: 48, padding: 13, borderRadius: 11, border: choice === i ? '2px solid var(--accent)' : '1px solid var(--border)', background: choice === i ? 'var(--accent-soft)' : 'var(--surface)', color: 'var(--text)', fontWeight: 800, cursor: 'pointer' }}>{x}</button>)}</div>{choice !== null && <button onClick={() => { setStep(s => s + 1); setChoice(null); }} className="a11y-focus" style={{ ...primaryBtn, marginTop: 14 }}>Continue →</button>}<div style={hintStyle}>{pro ? 'Your responses build a private exploration pattern; they do not overwrite psychometric assessment scores.' : 'Free mode gives a small daily challenge. Pro unlocks the full exploration library.'}</div></div>;
}

function Sudoku({ record }) {
  const levels = [['Easy', 'Best starting point', 'https://sudokupuzzlehub.com/mini-sudoku/'], ['Medium', 'More deduction', 'https://sudokupuzzlehub.com/mini-sudoku/medium/'], ['Hard', 'Careful candidate tracking', 'https://sudokupuzzlehub.com/mini-sudoku/']];
  const open = url => { window.open(url, '_blank', 'noopener,noreferrer'); record(); };
  return <div style={{ padding: '12px 0' }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 58, marginBottom: 8 }}>🔢</div><h3 style={{ margin: '0 0 6px' }}>Mini Sudoku by Sudoku Puzzle Hub</h3><p style={{ color: 'var(--muted)', lineHeight: 1.6, maxWidth: 650, margin: '0 auto' }}>A compact 6×6 Sudoku designed for quick, low-pressure play. The official experience includes Easy, Medium and Hard options, notes, hints, undo and personal progress on the publisher's site.</p></div><div style={{ margin: '22px auto 0', maxWidth: 720, border: '1px solid var(--border)', borderRadius: 16, padding: 18, background: 'var(--surface-2)' }}><div style={eyebrow}>CHOOSE YOUR CHALLENGE</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginTop: 12 }}>{levels.map(([name, desc, url]) => <button key={name} onClick={() => open(url)} className="a11y-focus" style={{ textAlign: 'left', minHeight: 90, padding: 14, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}><div style={{ fontWeight: 950 }}>{name}</div><div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{desc}</div><div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 900, marginTop: 9 }}>Open puzzle →</div></button>)}</div></div><div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}><a href="https://sudokupuzzlehub.com/sudoku-solver/" target="_blank" rel="noreferrer" className="a11y-focus" style={toolLinkStyle}>🧩 Sudoku Solver</a><a href="https://sudokupuzzlehub.com/sudoku-downloads/" target="_blank" rel="noreferrer" className="a11y-focus" style={toolLinkStyle}>🖨️ Printable Puzzles</a></div><div style={hintStyle}><strong>VidyaVantage integration:</strong> Sudoku remains hosted by Sudoku Puzzle Hub. VidyaVantage records that the student opened the activity, while the third-party puzzle state stays with the official game.</div></div>;
}

export default function CareerGames({ currentUser, onUnlock }) {
  const user = currentUser || auth.currentUser;
  const [selected, setSelected] = useState('sudoku'); const [pro, setPro] = useState(false); const [stats, setStats] = useState({ played: 0 }); const [a11yOpen, setA11yOpen] = useState(false); const [mobileNav, setMobileNav] = useState(false);
  const [settings, setSettings] = useA11y(user);
  const [firstName, setFirstName] = useState(() => String(user?.displayName || '').trim().split(' ')[0] || 'Student');
  useEffect(() => { if (!user) return; (async () => { try { const snap = await getDoc(doc(db, 'users', user.uid)); const data = snap.exists() ? snap.data() : {}; setPro(data?.institutionAccess?.status === 'active' || data?.gamesAccess?.status === 'paid'); const cached = localStorage.getItem(storageKey(user.uid)); if (cached) setStats(JSON.parse(cached)); const profile = data?.careerProfile || {}; const name = profile.firstName || data?.firstName || user.displayName?.split(' ')?.[0]; if (name) setFirstName(name); } catch (_) {} })(); }, [user]);
  const record = () => { const next = { ...stats, played: Number(stats.played || 0) + 1 }; setStats(next); if (user) localStorage.setItem(storageKey(user.uid), JSON.stringify(next)); };
  const game = useMemo(() => GAMES.find(x => x.id === selected) || GAMES[0], [selected]);
  const highContrast = settings.highContrast;
  const theme = settings.theme === 'dark' ? 'dark' : 'light';
  const css = `:root{--surface:${theme === 'dark' ? '#111827' : '#ffffff'};--surface-2:${theme === 'dark' ? '#1f2937' : '#f8fafc'};--page:${theme === 'dark' ? '#0b1120' : '#eef5ff'};--text:${theme === 'dark' ? '#f8fafc' : '#0f172a'};--muted:${theme === 'dark' ? '#cbd5e1' : '#64748b'};--border:${theme === 'dark' ? '#475569' : '#e2e8f0'};--muted-border:${theme === 'dark' ? '#64748b' : '#cbd5e1'};--accent:${highContrast ? '#005fcc' : '#4f46e5'};--accent-soft:${theme === 'dark' ? '#312e81' : '#eef2ff'};--navy:${theme === 'dark' ? '#020617' : '#0f172a'};--focus:#f59e0b}*{box-sizing:border-box}.a11y-focus:focus-visible{outline:3px solid var(--focus)!important;outline-offset:3px}.a11y-focus:focus:not(:focus-visible){outline:none}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}${settings.reduceMotion ? '*{scroll-behavior:auto!important;transition:none!important;animation:none!important}' : ''}${settings.underlineLinks ? 'a{text-decoration:underline!important;text-underline-offset:3px}' : ''}${highContrast ? 'body{forced-color-adjust:none}' : ''}`;
  const renderGame = () => selected === 'sudoku' ? <Sudoku record={record} /> : selected === 'scramble' ? <WordScramble pro={pro} /> : selected === 'memory' ? <MemoryMatch pro={pro} /> : <CareerQuest pro={pro} />;
  return <>
    <style>{css}</style>
    <a href="#career-games-main" className="a11y-focus" style={{ position: 'fixed', left: 12, top: 10, zIndex: 100, transform: 'translateY(-150%)', padding: '10px 14px', borderRadius: 9, background: 'var(--surface)', color: 'var(--text)', fontWeight: 900, border: '2px solid var(--accent)' }} onFocus={e => { e.currentTarget.style.transform = 'translateY(0)'; }} onBlur={e => { e.currentTarget.style.transform = 'translateY(-150%)'; }}>Skip to main content</a>
    <div style={{ minHeight: '100vh', background: 'var(--page)', color: 'var(--text)', fontSize: `${settings.textScale}em`, padding: '28px 24px 60px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(15,23,42,.08)', minHeight: 'calc(100vh - 88px)' }}>
        <header style={{ minHeight: 78, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}><button onClick={() => navigate('/dashboard/career')} aria-label="Back to Career Dashboard" className="a11y-focus" style={{ border: 0, background: 'transparent', color: 'var(--accent)', fontWeight: 950, cursor: 'pointer', minHeight: 44 }}>←</button><div><div style={{ fontSize: 11, fontWeight: 950, letterSpacing: 1.4, color: 'var(--accent)' }}>VIDYAVANTAGE</div><div style={{ fontSize: 18, fontWeight: 950 }}>Career Space</div></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={{ display: 'none' }} aria-hidden="true">Student search</div>
            <button onClick={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'} className="a11y-focus" style={iconButton}>{theme === 'dark' ? '☀️' : '🌙'}</button>
            <button onClick={() => setA11yOpen(v => !v)} aria-expanded={a11yOpen} aria-haspopup="dialog" aria-label="Open accessibility settings" className="a11y-focus" style={{ ...iconButton, fontSize: 16 }}>⚙️</button>
            <button onClick={() => setMobileNav(v => !v)} aria-expanded={mobileNav} aria-controls="career-nav" className="a11y-focus" style={{ ...iconButton, display: 'none' }} aria-label="Open navigation">☰</button>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950 }} aria-label={`Signed in as ${firstName}`}>{firstName.charAt(0).toUpperCase()}</div>
            {a11yOpen && <AccessibilityPanel settings={settings} setSettings={setSettings} onClose={() => setA11yOpen(false)} />}
          </div>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '245px minmax(0,1fr)', minHeight: 720 }}>
          <aside id="career-nav" aria-label="Career workspace navigation" style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 8px 18px' }}><div style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', fontSize: 21 }}>🎓</div><div><div style={{ fontWeight: 950 }}>{firstName}</div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Career Guidance</div></div></div>
              <nav aria-label="Primary career navigation" style={{ display: 'grid', gap: 4 }}>{NAV.map(([id, icon, label, path]) => <button key={id} onClick={() => navigate(path)} aria-current={id === 'games' ? 'page' : undefined} className="a11y-focus" style={{ width: '100%', minHeight: 46, border: 0, borderRadius: 11, padding: '10px 12px', textAlign: 'left', background: id === 'games' ? 'var(--accent-soft)' : 'transparent', color: id === 'games' ? 'var(--accent)' : 'var(--muted)', fontWeight: id === 'games' ? 950 : 750, cursor: 'pointer' }}>{icon} <span style={{ marginLeft: 7 }}>{label}</span></button>)}</nav>
            </div>
            <div style={{ margin: '0 18px 18px', padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--border)' }}><div style={eyebrow}>YOUR PLAY STATS</div><div style={{ fontSize: 28, fontWeight: 950, marginTop: 3 }}>{stats.played}</div><div style={{ color: 'var(--muted)', fontSize: 11 }}>sessions opened</div></div>
          </aside>
          <main id="career-games-main" tabIndex={-1} style={{ minWidth: 0, background: 'var(--surface-2)', padding: '28px 30px 45px' }}>
            <div style={{ maxWidth: 930, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}><div><div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 950, letterSpacing: 1.5 }}>VIDYAVANTAGE PLAYGROUND</div><h1 style={{ margin: '5px 0 4px', fontSize: 32, lineHeight: 1.15 }}>Play, explore & discover.</h1><p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>Small challenges for curiosity, memory, words and career exploration — without public leaderboards or pressure.</p></div><div style={{ padding: '8px 13px', borderRadius: 999, background: pro ? '#dcfce7' : '#fef3c7', color: pro ? '#166534' : '#92400e', fontSize: 11, fontWeight: 950 }}>{pro ? 'GAMES PRO' : 'FREE ACCESS'}</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 235px', gap: 18 }}>
                <section style={cardStyle} aria-labelledby="selected-game-title"><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', paddingBottom: 14, borderBottom: '1px solid var(--border)' }}><div><h2 id="selected-game-title" style={{ margin: 0, fontSize: 22 }}>{game.icon} {game.title}</h2><p style={{ margin: '5px 0 0', color: 'var(--muted)', fontSize: 13 }}>{game.subtitle}</p></div><span style={{ padding: '6px 9px', borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 10, fontWeight: 950 }}>{selected === 'sudoku' ? 'OFFICIAL HOST' : `VIDYAVANTAGE ${pro ? 'PRO' : 'FREE'}`}</span></div><div style={{ paddingTop: 12 }}>{renderGame()}</div>{selected !== 'sudoku' && !pro && <div style={{ marginTop: 18, borderRadius: 14, padding: 18, background: 'var(--accent-soft)', border: '1px solid var(--border)' }}><div style={{ fontSize: 11, fontWeight: 950, color: 'var(--accent)', textTransform: 'uppercase' }}>Unlock the full potential</div><h3 style={{ margin: '5px 0' }}>Turn games into a richer learning journey.</h3><p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: 13 }}>Unlock full game libraries, additional levels, themed challenges, personal progress insights and the complete Career Quest experience.</p><button onClick={onUnlock} className="a11y-focus" style={{ ...primaryBtn, marginTop: 14 }}>🔓 Unlock Games Pro</button></div>}</section>
                <aside aria-label="Games overview" style={{ display: 'grid', gap: 12, alignContent: 'start' }}><section style={sideCard}><div style={eyebrow}>YOUR GAMES</div><div style={{ display: 'grid', gap: 5, marginTop: 10 }}>{GAMES.map(g => <button key={g.id} onClick={() => { setSelected(g.id); record(); }} aria-current={selected === g.id ? 'page' : undefined} className="a11y-focus" style={{ minHeight: 52, border: 0, borderRadius: 11, padding: '9px 10px', background: selected === g.id ? 'var(--accent-soft)' : 'transparent', color: selected === g.id ? 'var(--accent)' : 'var(--muted)', fontWeight: selected === g.id ? 950 : 750, textAlign: 'left', cursor: 'pointer' }}>{g.icon} <span style={{ marginLeft: 6 }}>{g.title}</span></button>)}</div></section><section style={sideCard}><div style={eyebrow}>LEARNING NOTE</div><p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 12, lineHeight: 1.6 }}>Games are exploratory activities. They do not diagnose ability or replace a formal career assessment.</p></section><section style={sideCard}><div style={eyebrow}>PRIVATE BY DESIGN</div><p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 12, lineHeight: 1.6 }}>No public leaderboard is used. Your activity stays within your VidyaVantage space.</p></section></aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </>;
}

const eyebrow = { color: 'var(--muted)', fontSize: 10, fontWeight: 950, textTransform: 'uppercase', letterSpacing: 1 };
const fieldLabel = { color: 'var(--muted)', fontSize: 11, fontWeight: 900, marginBottom: 7 };
const inputBase = { width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, background: 'var(--surface)', color: 'var(--text)', outline: 'none', minHeight: 46 };
const primaryBtn = { border: 0, borderRadius: 10, padding: '11px 16px', minHeight: 46, background: 'var(--accent)', color: '#fff', fontWeight: 950, cursor: 'pointer' };
const secondaryBtn = { border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', minHeight: 46, background: 'var(--surface)', color: 'var(--text)', fontWeight: 850, cursor: 'pointer' };
const smallChoice = { border: '1px solid var(--border)', borderRadius: 9, padding: '8px 10px', minHeight: 40, fontWeight: 850, cursor: 'pointer' };
const iconButton = { width: 44, height: 44, borderRadius: 11, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: 18 };
const toolLinkStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', color: 'var(--text)', fontSize: 12, fontWeight: 850, textDecoration: 'none' };
const hintStyle = { marginTop: 15, padding: 12, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, lineHeight: 1.55 };
const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };
const sideCard = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 15, padding: 15 };
