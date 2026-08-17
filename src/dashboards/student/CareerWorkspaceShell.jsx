import React, { useEffect, useMemo, useState } from 'react';

export const CAREER_NAV = [
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

const STORAGE_PREFIX = 'vidyavantage-workspace-preferences:';

export function navigateCareer(path) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

function usePreferences(user) {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    textScale: 1,
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false,
  });

  useEffect(() => {
    if (!user?.uid || typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${user.uid}`);
      if (raw) setPreferences(current => ({ ...current, ...JSON.parse(raw) }));
    } catch (_) {}
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || typeof window === 'undefined') return;
    try { localStorage.setItem(`${STORAGE_PREFIX}${user.uid}`, JSON.stringify(preferences)); } catch (_) {}
  }, [user?.uid, preferences]);

  return [preferences, setPreferences];
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="vva11y-row">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} className="vva11y-switch" onClick={() => onChange(!checked)}>
        <span className={checked ? 'vva11y-switch-thumb is-on' : 'vva11y-switch-thumb'} />
      </button>
    </div>
  );
}

function AccessibilityPanel({ preferences, setPreferences, close }) {
  return (
    <div className="vv-accessibility-panel" role="dialog" aria-modal="true" aria-labelledby="vv-accessibility-title">
      <div className="vv-panel-head">
        <div>
          <div className="vv-eyebrow">ACCESSIBILITY</div>
          <h2 id="vv-accessibility-title">Make this space work for you</h2>
        </div>
        <button type="button" className="vv-icon-button vv-focus" aria-label="Close accessibility settings" onClick={close}>×</button>
      </div>

      <div className="vv-accessibility-group">
        <div className="vv-field-label">Text size</div>
        <div className="vv-size-options">
          {[1, 1.25, 1.5, 1.75, 2].map(value => (
            <button type="button" key={value} className={`vv-size-option vv-focus ${preferences.textScale === value ? 'is-selected' : ''}`} aria-pressed={preferences.textScale === value} onClick={() => setPreferences(p => ({ ...p, textScale: value }))}>
              {Math.round(value * 100)}%
            </button>
          ))}
        </div>
        <div className="vv-help-text">Text can be enlarged to 200% without hiding essential content.</div>
      </div>

      <Toggle label="High contrast" checked={preferences.highContrast} onChange={value => setPreferences(p => ({ ...p, highContrast: value }))} />
      <Toggle label="Reduce motion" checked={preferences.reduceMotion} onChange={value => setPreferences(p => ({ ...p, reduceMotion: value }))} />
      <Toggle label="Underline links" checked={preferences.underlineLinks} onChange={value => setPreferences(p => ({ ...p, underlineLinks: value }))} />

      <div className="vv-accessibility-note">Keyboard navigation, visible focus, labelled controls, responsive layouts and predictable navigation are built into the workspace.</div>
    </div>
  );
}

export default function CareerWorkspaceShell({ user, firstName = 'Student', active = 'home', children, eyebrow = 'VIDYAVANTAGE CAREER SPACE' }) {
  const [preferences, setPreferences] = usePreferences(user);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = preferences.theme === 'dark' ? 'dark' : 'light';

  const variables = useMemo(() => {
    const dark = theme === 'dark';
    const contrast = preferences.highContrast;
    return {
      '--vv-page': dark ? '#0b1120' : '#edf4ff',
      '--vv-surface': dark ? '#111827' : '#ffffff',
      '--vv-surface-2': dark ? '#1f2937' : '#f8fafc',
      '--vv-text': dark ? '#f8fafc' : '#0f172a',
      '--vv-muted': dark ? '#cbd5e1' : '#64748b',
      '--vv-border': dark ? '#475569' : '#dbe4ef',
      '--vv-accent': contrast ? '#005fcc' : '#4f46e5',
      '--vv-accent-soft': dark ? '#312e81' : '#eef2ff',
      '--vv-focus': '#f59e0b',
      '--vv-brand': dark ? '#93c5fd' : '#2563eb',
    };
  }, [theme, preferences.highContrast]);

  const style = `
    .vv-shell,.vv-shell *{box-sizing:border-box}
    .vv-shell{min-height:100vh;background:var(--vv-page);color:var(--vv-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:${preferences.textScale}em;padding:28px 24px 60px}
    .vv-shell a{text-decoration:${preferences.underlineLinks ? 'underline' : 'none'};text-underline-offset:3px}
    .vv-focus:focus-visible{outline:3px solid var(--vv-focus)!important;outline-offset:3px}
    .vv-focus:focus:not(:focus-visible){outline:none}
    .vv-skip{position:fixed;left:14px;top:10px;z-index:1000;transform:translateY(-180%);background:var(--vv-surface);color:var(--vv-text);border:2px solid var(--vv-accent);border-radius:9px;padding:10px 14px;font-weight:900}
    .vv-skip:focus{transform:translateY(0)}
    .vv-frame{max-width:1380px;margin:0 auto;min-height:calc(100vh - 88px);background:var(--vv-surface);border:1px solid var(--vv-border);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,.09)}
    .vv-header{height:78px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 24px;border-bottom:1px solid var(--vv-border);background:var(--vv-surface)}
    .vv-brand-lockup{display:flex;align-items:center;gap:12px;min-width:0}
    .vv-brand-mark{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--vv-accent-soft);color:var(--vv-accent);font-size:21px}
    .vv-brand-small{font-size:10px;font-weight:950;letter-spacing:1.6px;color:var(--vv-brand)}
    .vv-brand-title{font-size:18px;font-weight:950;margin-top:1px}
    .vv-header-actions{display:flex;align-items:center;gap:8px;position:relative}
    .vv-icon-button{width:44px;height:44px;border:1px solid var(--vv-border);border-radius:11px;background:var(--vv-surface);color:var(--vv-text);cursor:pointer;font-size:18px}
    .vv-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--vv-accent-soft);color:var(--vv-accent);font-weight:950;margin-left:2px}
    .vv-body{display:grid;grid-template-columns:245px minmax(0,1fr);min-height:760px}
    .vv-sidebar{border-right:1px solid var(--vv-border);background:var(--vv-surface);padding:18px}
    .vv-student-card{display:flex;align-items:center;gap:11px;padding:4px 8px 18px}
    .vv-student-name{font-weight:950}.vv-student-role{font-size:11px;color:var(--vv-muted);margin-top:2px}
    .vv-nav{display:grid;gap:4px}
    .vv-nav-button{width:100%;min-height:46px;border:0;border-radius:11px;background:transparent;color:var(--vv-muted);padding:10px 12px;text-align:left;font-weight:750;cursor:pointer}
    .vv-nav-button.is-active{background:var(--vv-accent-soft);color:var(--vv-accent);font-weight:950}
    .vv-sidebar-card{margin-top:20px;padding:14px;border-radius:14px;background:var(--vv-surface-2);border:1px solid var(--vv-border)}
    .vv-eyebrow{color:var(--vv-muted);font-size:10px;font-weight:950;letter-spacing:1px;text-transform:uppercase}
    .vv-sidebar-help{font-size:12px;color:var(--vv-muted);line-height:1.55;margin-top:7px}
    .vv-main{min-width:0;background:var(--vv-surface-2);padding:30px}
    .vv-content{max-width:1120px;margin:0 auto}
    .vv-accessibility-panel{position:absolute;right:0;top:52px;z-index:50;width:340px;max-width:calc(100vw - 28px);padding:18px;border:1px solid var(--vv-border);border-radius:16px;background:var(--vv-surface);color:var(--vv-text);box-shadow:0 18px 45px rgba(15,23,42,.18)}
    .vv-panel-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.vv-panel-head h2{font-size:18px;margin:4px 0 0;line-height:1.25}
    .vv-accessibility-group{margin-top:17px}.vv-field-label{font-size:11px;font-weight:900;color:var(--vv-muted);margin-bottom:7px}
    .vv-size-options{display:flex;gap:7px;flex-wrap:wrap}.vv-size-option{min-height:40px;border:1px solid var(--vv-border);border-radius:9px;background:var(--vv-surface-2);color:var(--vv-text);padding:8px 10px;font-weight:850;cursor:pointer}.vv-size-option.is-selected{background:var(--vv-accent-soft);border-color:var(--vv-accent);color:var(--vv-accent)}
    .vv-help-text,.vv-accessibility-note{font-size:11px;color:var(--vv-muted);line-height:1.55}.vv-help-text{margin-top:6px}
    .vva11y-row{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:13px;font-weight:850}
    .vva11y-switch{width:50px;height:28px;border:0;border-radius:999px;padding:3px;background:var(--vv-border);cursor:pointer}.vva11y-switch[aria-checked="true"]{background:var(--vv-accent)}.vva11y-switch-thumb{display:block;width:22px;height:22px;border-radius:50%;background:#fff;transform:translateX(0);transition:transform .18s}.vva11y-switch-thumb.is-on{transform:translateX(22px)}
    .vv-accessibility-note{margin-top:10px;padding:11px;border-radius:11px;background:var(--vv-surface-2);border:1px solid var(--vv-border)}
    @media(max-width:900px){.vv-body{grid-template-columns:1fr}.vv-sidebar{display:${mobileNavOpen ? 'block' : 'none'};border-right:0;border-bottom:1px solid var(--vv-border)}.vv-mobile-button{display:inline-flex!important}.vv-main{padding:22px 16px}.vv-shell{padding:12px 10px 30px}.vv-frame{border-radius:18px}.vv-header{height:auto;min-height:70px;padding:12px 14px}}
    @media(min-width:901px){.vv-mobile-button{display:none!important}}
    @media(prefers-reduced-motion:reduce){.vv-shell *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    ${preferences.reduceMotion ? '.vv-shell *{scroll-behavior:auto!important;transition:none!important;animation:none!important}' : ''}
    ${preferences.highContrast ? '.vv-shell{forced-color-adjust:none}.vv-nav-button.is-active{border:2px solid var(--vv-accent)}' : ''}
  `;

  return (
    <>
      <style>{style}</style>
      <div className="vv-shell" style={variables}>
        <a className="vv-skip vv-focus" href="#vv-main">Skip to main content</a>
        <div className="vv-frame">
          <header className="vv-header">
            <div className="vv-brand-lockup">
              <div className="vv-brand-mark" aria-hidden="true">🎓</div>
              <div>
                <div className="vv-brand-small">VIDYAVANTAGE</div>
                <div className="vv-brand-title">Career Space</div>
              </div>
            </div>
            <div className="vv-header-actions">
              <button type="button" className="vv-icon-button vv-focus" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'} onClick={() => setPreferences(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}>{theme === 'dark' ? '☀️' : '🌙'}</button>
              <button type="button" className="vv-icon-button vv-focus" aria-haspopup="dialog" aria-expanded={accessibilityOpen} aria-label="Open accessibility settings" onClick={() => setAccessibilityOpen(open => !open)}>♿</button>
              <button type="button" className="vv-icon-button vv-mobile-button vv-focus" aria-controls="vv-career-nav" aria-expanded={mobileNavOpen} aria-label="Open career navigation" onClick={() => setMobileNavOpen(open => !open)}>☰</button>
              <div className="vv-avatar" aria-label={`Signed in as ${firstName}`}>{String(firstName || 'S').charAt(0).toUpperCase()}</div>
              {accessibilityOpen && <AccessibilityPanel preferences={preferences} setPreferences={setPreferences} close={() => setAccessibilityOpen(false)} />}
            </div>
          </header>
          <div className="vv-body">
            <aside id="vv-career-nav" className="vv-sidebar" aria-label="Career workspace navigation">
              <div className="vv-student-card"><div className="vv-brand-mark" aria-hidden="true">👤</div><div><div className="vv-student-name">{firstName}</div><div className="vv-student-role">Career Guidance</div></div></div>
              <nav className="vv-nav" aria-label="Primary career navigation">
                {CAREER_NAV.map(([id, icon, label, path]) => <button type="button" key={id} className={`vv-nav-button vv-focus ${active === id ? 'is-active' : ''}`} aria-current={active === id ? 'page' : undefined} onClick={() => { setMobileNavOpen(false); navigateCareer(path); }}>{icon} <span style={{ marginLeft: 7 }}>{label}</span></button>)}
              </nav>
              <div className="vv-sidebar-card"><div className="vv-eyebrow">YOUR SPACE</div><div className="vv-sidebar-help">Explore at your pace. There are no public leaderboards, rankings or pressure to compare yourself with other students.</div></div>
            </aside>
            <main id="vv-main" className="vv-main" tabIndex={-1}>
              <div className="vv-content">
                <div className="vv-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
