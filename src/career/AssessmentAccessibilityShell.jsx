import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'vv_assessment_accessibility_v1';

const DEFAULTS = Object.freeze({
  zoom: 100,
  highContrast: false,
  largeSpacing: false,
  dyslexiaFriendly: false,
  reducedMotion: false,
});

function readPreferences() {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    return { ...DEFAULTS, ...(saved || {}) };
  } catch (_) {
    return DEFAULTS;
  }
}

function clampZoom(value) {
  return Math.min(150, Math.max(100, Number(value) || 100));
}

export default function AssessmentAccessibilityShell({ children }) {
  const [preferences, setPreferences] = useState(readPreferences);
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch (_) {}
  }, [preferences]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.zoom = `${preferences.zoom}%`;
    return () => { root.style.zoom = ''; };
  }, [preferences.zoom]);

  useEffect(() => {
    return () => {
      try { window.speechSynthesis?.cancel(); } catch (_) {}
    };
  }, []);

  const className = useMemo(() => [
    'vv-a11y-shell',
    preferences.highContrast ? 'vv-a11y-high-contrast' : '',
    preferences.largeSpacing ? 'vv-a11y-large-spacing' : '',
    preferences.dyslexiaFriendly ? 'vv-a11y-dyslexia-friendly' : '',
    preferences.reducedMotion ? 'vv-a11y-reduced-motion' : '',
  ].filter(Boolean).join(' '), [preferences]);

  const update = (key, value) => setPreferences(current => ({ ...current, [key]: value }));
  const reset = () => setPreferences(DEFAULTS);

  const stopReading = () => {
    try { window.speechSynthesis?.cancel(); } catch (_) {}
    setSpeaking(false);
  };

  const readAssessment = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (speaking) return stopReading();
    const target = document.getElementById('vv-assessment-content');
    const text = target?.innerText?.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={className}>
      <style>{`
        .vv-a11y-skip{position:fixed;left:12px;top:10px;z-index:10000;transform:translateY(-180%);background:#111827;color:#fff;border:3px solid #fff;border-radius:10px;padding:12px 16px;font-weight:900;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25)}
        .vv-a11y-skip:focus{transform:translateY(0);outline:4px solid #fbbf24;outline-offset:2px}
        .vv-a11y-toolbar{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 auto 14px;padding:10px 12px;background:#fff;border:2px solid #cbd5e1;border-radius:14px;box-shadow:0 5px 18px rgba(15,23,42,.10)}
        .vv-a11y-toolbar button{min-height:44px;padding:9px 12px;border:2px solid #334155;border-radius:10px;background:#fff;color:#0f172a;font-weight:900;cursor:pointer}
        .vv-a11y-toolbar button:focus-visible,.vv-a11y-toolbar input:focus-visible{outline:4px solid #f59e0b;outline-offset:2px}
        .vv-a11y-panel{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .vv-a11y-status{font-size:12px;font-weight:900;color:#334155}
        .vv-a11y-large-spacing #vv-assessment-content,
        .vv-a11y-large-spacing #vv-assessment-content p,
        .vv-a11y-large-spacing #vv-assessment-content label,
        .vv-a11y-large-spacing #vv-assessment-content button{line-height:1.8!important;letter-spacing:.035em!important;word-spacing:.12em!important}
        .vv-a11y-dyslexia-friendly #vv-assessment-content{font-family:Verdana,Arial,sans-serif!important}
        .vv-a11y-dyslexia-friendly #vv-assessment-content p,
        .vv-a11y-dyslexia-friendly #vv-assessment-content label,
        .vv-a11y-dyslexia-friendly #vv-assessment-content button,
        .vv-a11y-dyslexia-friendly #vv-assessment-content input,
        .vv-a11y-dyslexia-friendly #vv-assessment-content textarea,
        .vv-a11y-dyslexia-friendly #vv-assessment-content select{letter-spacing:.025em!important;word-spacing:.08em!important;line-height:1.75!important}
        .vv-a11y-high-contrast{background:#fff!important;color:#000!important}
        .vv-a11y-high-contrast .vv-a11y-toolbar{background:#000;color:#fff;border-color:#000}
        .vv-a11y-high-contrast .vv-a11y-toolbar button{background:#fff;color:#000;border-color:#fff}
        .vv-a11y-high-contrast #vv-assessment-content{filter:contrast(1.28)}
        .vv-a11y-high-contrast #vv-assessment-content input,
        .vv-a11y-high-contrast #vv-assessment-content textarea,
        .vv-a11y-high-contrast #vv-assessment-content select,
        .vv-a11y-high-contrast #vv-assessment-content button{outline-color:#000}
        .vv-a11y-reduced-motion *,
        .vv-a11y-reduced-motion *::before,
        .vv-a11y-reduced-motion *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
        @media (max-width:700px){.vv-a11y-toolbar{position:relative}.vv-a11y-toolbar button{flex:1 1 auto}.vv-a11y-panel{width:100%}}
        @media (prefers-reduced-motion:reduce){.vv-a11y-shell *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}
      `}</style>

      <a className="vv-a11y-skip" href="#vv-assessment-content">Skip to assessment</a>

      <div className="vv-a11y-toolbar" aria-label="Assessment accessibility controls">
        <div className="vv-a11y-panel">
          <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>
            Accessibility options
          </button>
          <button type="button" onClick={readAssessment} aria-pressed={speaking}>
            {speaking ? 'Stop reading' : 'Read assessment aloud'}
          </button>
        </div>
        <span className="vv-a11y-status" role="status" aria-live="polite">
          {preferences.zoom}% zoom{preferences.highContrast ? ' · high contrast' : ''}
        </span>
      </div>

      {open && (
        <section className="vv-a11y-toolbar" aria-labelledby="vv-a11y-title">
          <div style={{ width:'100%' }}>
            <h2 id="vv-a11y-title" style={{ margin:'0 0 6px', fontSize:18 }}>Make the assessment easier to use</h2>
            <p style={{ margin:'0 0 12px', fontSize:12, lineHeight:1.6 }}>
              These settings change presentation only. They do not change questions, answers, scoring or results.
            </p>
            <div className="vv-a11y-panel">
              <button type="button" onClick={() => update('zoom', clampZoom(preferences.zoom - 10))} aria-label="Decrease assessment zoom">A−</button>
              <button type="button" onClick={() => update('zoom', clampZoom(preferences.zoom + 10))} aria-label="Increase assessment zoom">A+</button>
              <button type="button" onClick={() => update('highContrast', !preferences.highContrast)} aria-pressed={preferences.highContrast}>High contrast</button>
              <button type="button" onClick={() => update('largeSpacing', !preferences.largeSpacing)} aria-pressed={preferences.largeSpacing}>More spacing</button>
              <button type="button" onClick={() => update('dyslexiaFriendly', !preferences.dyslexiaFriendly)} aria-pressed={preferences.dyslexiaFriendly}>Reading-friendly text</button>
              <button type="button" onClick={() => update('reducedMotion', !preferences.reducedMotion)} aria-pressed={preferences.reducedMotion}>Reduce motion</button>
              <button type="button" onClick={reset}>Reset</button>
            </div>
            <p style={{ margin:'10px 0 0', fontSize:11, lineHeight:1.6 }}>
              Keyboard users can operate the assessment controls with Tab and Enter/Space. Screen-reader users should also be able to use the native form controls.
            </p>
          </div>
        </section>
      )}

      <main id="vv-assessment-content" tabIndex="-1">
        {children}
      </main>
    </div>
  );
}
