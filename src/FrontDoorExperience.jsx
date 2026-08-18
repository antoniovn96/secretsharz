import React, { useMemo, useState } from 'react';

/**
 * Secret Sharz Front Door
 *
 * The public entry experience is organised around human need, not internal
 * departments. It intentionally does not diagnose or algorithmically decide
 * what a person "needs". A selected concern simply helps the platform preserve
 * context as the person takes their next step.
 */
export default function FrontDoorExperience({ navigate, currentUser }) {
  const [selected, setSelected] = useState(null);

  const pathways = useMemo(() => [
    { id: 'not-ok', label: "I'm not feeling okay", detail: 'A gentle place to begin when something feels difficult.', route: '/mindspace', tone: 'rose', icon: '◌' },
    { id: 'talk', label: 'I want someone to talk to', detail: 'Learn about human support and connect when you are ready.', route: '/mindspace', tone: 'sage', icon: '○' },
    { id: 'child', label: "I'm worried about my child", detail: 'Find parent, family, learning and professional support.', route: '/dashboard', tone: 'sand', icon: '⌂' },
    { id: 'self', label: 'I want to understand myself', detail: 'Reflect, learn and explore assessments with care.', route: '/dashboard', tone: 'lavender', icon: '✦' },
    { id: 'future', label: "I'm confused about my future", detail: 'Explore possibilities without having to choose a destiny today.', route: '/vidyavantage', tone: 'sky', icon: '↗' },
    { id: 'sen', label: 'I need learning or SEN support', detail: 'Explore inclusive learning, accommodations and support.', route: '/resources', tone: 'mint', icon: '□' },
    { id: 'career', label: 'I want help with my career', detail: 'Discover careers, courses, colleges, roadmaps and opportunities.', route: '/vidyavantage', tone: 'gold', icon: '⌁' },
    { id: 'grow', label: 'I want to build myself', detail: 'Develop skills, resilience, life skills and confidence.', route: '/resources', tone: 'peach', icon: '+' },
    { id: 'help', label: 'I want to help someone', detail: 'Learn how to contribute safely as a supporter, mentor or volunteer.', route: '/about', tone: 'blue', icon: '♡' },
    { id: 'opportunities', label: "I'm looking for opportunities", detail: 'Explore the future ecosystem of learning, internships and work.', route: '/vidyavantage', tone: 'green', icon: '→' },
  ], []);

  const chosen = pathways.find((item) => item.id === selected);

  const begin = () => {
    const route = chosen?.route || '/auth';
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('secretsharz_front_door_intent', JSON.stringify({
          id: chosen?.id || 'unknown',
          label: chosen?.label || "I don't know. Help me find my way.",
          createdAt: new Date().toISOString(),
        }));
      } catch (_) {}
    }
    navigate?.(currentUser ? route : '/auth');
  };

  return (
    <section className="ss-front-door" aria-labelledby="ss-front-door-title">
      <div className="ss-front-door-glow one" aria-hidden="true" />
      <div className="ss-front-door-glow two" aria-hidden="true" />

      <div className="ss-front-door-inner">
        <div className="ss-front-door-intro">
          <span className="ss-front-door-mark" aria-hidden="true">SS</span>
          <p className="ss-front-door-kicker">Welcome to Secret Sharz</p>
          <h2 id="ss-front-door-title">You don't have to figure everything out alone.</h2>
          <p className="ss-front-door-lead">
            You don't need to know which service you need. Start with what is true for you today.
          </p>
        </div>

        <div className="ss-front-door-question">
          <p className="ss-front-door-question-label">What brings you here today?</p>
          <div className="ss-front-door-grid" role="list">
            {pathways.map((item) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`ss-front-door-option tone-${item.tone}${selected === item.id ? ' is-selected' : ''}`}
                aria-pressed={selected === item.id}
                onClick={() => setSelected(item.id)}
              >
                <span className="ss-front-door-option-icon" aria-hidden="true">{item.icon}</span>
                <span className="ss-front-door-option-copy">
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="ss-front-door-chevron" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`ss-front-door-unsure${selected === 'unknown' ? ' is-selected' : ''}`}>
          <div>
            <p className="ss-front-door-unsure-kicker">No label required</p>
            <h3>I don't know. Help me find my way.</h3>
            <p>That's a perfectly good place to start. We'll keep the first step simple and human.</p>
          </div>
          <button
            type="button"
            className="ss-front-door-unsure-button"
            onClick={() => setSelected('unknown')}
            aria-pressed={selected === 'unknown'}
          >
            Start here <span aria-hidden="true">→</span>
          </button>
        </div>

        {selected && (
          <div className="ss-front-door-next" aria-live="polite">
            <div>
              <span className="ss-front-door-next-label">Your starting point</span>
              <strong>{chosen?.label || "I don't know. Help me find my way."}</strong>
              <p>
                {chosen?.detail || 'You can begin without having the answer. We will preserve this context as you continue.'}
              </p>
            </div>
            <button type="button" className="ss-front-door-next-button" onClick={begin}>
              {currentUser ? 'Continue' : 'Continue securely'} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        <p className="ss-front-door-reassurance">
          <span aria-hidden="true">✦</span> Human-centred routing · Professional support remains human · Your information is handled with care
        </p>
      </div>

      <style>{`
        .ss-front-door{--fd-ink:#17231d;--fd-text:#405048;--fd-muted:#718077;--fd-green:#2E6B4A;--fd-deep:#17352A;--fd-line:#DDE6E0;--fd-white:#fff;position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(180deg,#F8FAF7 0%,#FDFCFA 100%);padding:110px 6vw 100px;color:var(--fd-ink)}
        .ss-front-door *{box-sizing:border-box}.ss-front-door button{font:inherit}
        .ss-front-door-inner{width:min(1160px,100%);margin:0 auto;position:relative;z-index:2}
        .ss-front-door-intro{text-align:center;max-width:780px;margin:0 auto 58px}.ss-front-door-mark{width:48px;height:48px;display:grid;place-items:center;margin:0 auto 18px;border-radius:16px;background:var(--fd-deep);color:#fff;font-size:12px;font-weight:900;letter-spacing:.08em;box-shadow:0 12px 30px rgba(23,53,42,.16)}
        .ss-front-door-kicker,.ss-front-door-question-label,.ss-front-door-unsure-kicker,.ss-front-door-next-label{margin:0;color:var(--fd-green);font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.ss-front-door-kicker{margin-bottom:14px}
        .ss-front-door h2{font-family:Fraunces,serif;font-size:clamp(42px,5vw,66px);line-height:1.05;letter-spacing:-.045em;margin:0 0 20px}.ss-front-door-lead{font-size:18px;line-height:1.7;color:var(--fd-text);margin:0 auto;max-width:650px}
        .ss-front-door-question{background:rgba(255,255,255,.8);border:1px solid rgba(46,107,74,.11);border-radius:30px;padding:34px;box-shadow:0 24px 80px rgba(23,53,42,.07);backdrop-filter:blur(10px)}.ss-front-door-question-label{font-size:13px;margin-bottom:20px;color:var(--fd-deep)}
        .ss-front-door-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ss-front-door-option{display:grid;grid-template-columns:44px 1fr 24px;gap:14px;align-items:center;text-align:left;min-height:94px;padding:16px 17px;border:1px solid var(--fd-line);border-radius:20px;background:#fff;color:var(--fd-ink);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease}.ss-front-door-option:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(23,53,42,.08);border-color:#B6C8BC}.ss-front-door-option.is-selected{border-color:var(--fd-green);background:#F2F8F3;box-shadow:0 10px 28px rgba(46,107,74,.1)}
        .ss-front-door-option:focus-visible,.ss-front-door-unsure-button:focus-visible,.ss-front-door-next-button:focus-visible{outline:3px solid #1F6B46;outline-offset:3px}.ss-front-door-option-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;font-size:20px;font-weight:800}
        .tone-rose .ss-front-door-option-icon{background:#F7ECEB;color:#8D4E4B}.tone-sage .ss-front-door-option-icon{background:#EAF4EE;color:#2E6B4A}.tone-sand .ss-front-door-option-icon{background:#F4F0E6;color:#7A6540}.tone-lavender .ss-front-door-option-icon{background:#F0EDF7;color:#665A8A}.tone-sky .ss-front-door-option-icon{background:#EAF4FA;color:#427F9D}.tone-mint .ss-front-door-option-icon{background:#EAF6F1;color:#357C63}.tone-gold .ss-front-door-option-icon{background:#F7F1DF;color:#826C2D}.tone-peach .ss-front-door-option-icon{background:#FBEDE6;color:#A85D3E}.tone-blue .ss-front-door-option-icon{background:#E9F0F6;color:#496C86}.tone-green .ss-front-door-option-icon{background:#EAF4EE;color:#2E6B4A}
        .ss-front-door-option-copy{display:flex;flex-direction:column;gap:5px;min-width:0}.ss-front-door-option-copy strong{font-size:15px;line-height:1.3}.ss-front-door-option-copy small{font-size:12px;line-height:1.45;color:var(--fd-muted)}.ss-front-door-chevron{color:#91A097;font-size:18px;transition:transform .2s ease}.ss-front-door-option:hover .ss-front-door-chevron,.ss-front-door-option.is-selected .ss-front-door-chevron{transform:translateX(3px);color:var(--fd-green)}
        .ss-front-door-unsure{margin-top:14px;padding:24px 26px;border:1px solid #D8D3BF;border-radius:22px;background:linear-gradient(135deg,#FBF9F0,#F7F3E8);display:flex;justify-content:space-between;align-items:center;gap:24px}.ss-front-door-unsure.is-selected{border-color:var(--fd-green);box-shadow:0 12px 34px rgba(46,107,74,.08)}.ss-front-door-unsure h3{font-family:Fraunces,serif;font-size:27px;line-height:1.15;margin:7px 0}.ss-front-door-unsure p:last-child{margin:0;color:var(--fd-text);font-size:14px;line-height:1.55}.ss-front-door-unsure-button{white-space:nowrap;border:1px solid #A99E7E;background:#fff;border-radius:14px;padding:12px 17px;font-weight:800;color:var(--fd-deep);cursor:pointer}.ss-front-door-unsure-button:hover{border-color:var(--fd-green);background:#F5FAF6}
        .ss-front-door-next{margin-top:14px;padding:25px 26px;border-radius:22px;background:var(--fd-deep);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;animation:fd-rise .35s ease both}.ss-front-door-next-label{color:#A8D1B6;font-size:11px}.ss-front-door-next strong{display:block;font-family:Fraunces,serif;font-size:26px;margin:7px 0}.ss-front-door-next p{margin:0;color:#D2DED7;font-size:13px;line-height:1.5;max-width:650px}.ss-front-door-next-button{white-space:nowrap;border:0;border-radius:14px;background:#fff;color:var(--fd-deep);padding:13px 18px;font-weight:850;cursor:pointer}.ss-front-door-next-button:hover{background:#EDF7F0}
        .ss-front-door-reassurance{margin:24px 0 0;text-align:center;color:var(--fd-muted);font-size:11px;letter-spacing:.02em}.ss-front-door-reassurance span{color:var(--fd-green);margin-right:6px}.ss-front-door-glow{position:absolute;border-radius:50%;pointer-events:none;filter:blur(8px);z-index:0}.ss-front-door-glow.one{width:420px;height:420px;right:-180px;top:-120px;background:radial-gradient(circle,rgba(94,145,108,.15),transparent 68%)}.ss-front-door-glow.two{width:360px;height:360px;left:-180px;bottom:-170px;background:radial-gradient(circle,rgba(213,189,129,.13),transparent 68%)}
        @keyframes fd-rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width:820px){.ss-front-door{padding:80px 20px}.ss-front-door-question{padding:22px;border-radius:24px}.ss-front-door-grid{grid-template-columns:1fr}.ss-front-door-unsure,.ss-front-door-next{flex-direction:column;align-items:flex-start}.ss-front-door-unsure-button,.ss-front-door-next-button{width:100%}.ss-front-door-option{min-height:86px}}
        @media (prefers-reduced-motion:reduce){.ss-front-door-option,.ss-front-door-next{transition:none;animation:none}.ss-front-door-option:hover{transform:none}}
      `}</style>
    </section>
  );
}
