import React, { useMemo, useState } from 'react';

/**
 * Institutional Discovery Hub
 *
 * This is intentionally non-diagnostic. A person's choice is a starting
 * context, not a determination of what service they need.
 *
 * The four institutional pathways map to the platform blueprint:
 * Support, Understand, Future and Connect.
 */
export default function InstitutionalDiscoveryHub({ navigate, journeyContext = null }) {
  const [active, setActive] = useState(null);

  const pathways = useMemo(() => [
    {
      id: 'support',
      eyebrow: 'Support',
      title: 'I need support',
      description: 'Find human support, professional services, learning support and safe next steps.',
      reassurance: 'You do not need to know which professional or service you need first.',
      actions: [
        ['Talk to someone', '/support'],
        ['Explore support', '/mindspace'],
      ],
      tone: 'sage',
      icon: '♡',
    },
    {
      id: 'understand',
      eyebrow: 'Understand',
      title: 'I want to understand myself',
      description: 'Reflect, learn, explore assessments and build self-awareness without turning a result into a label.',
      reassurance: 'Assessment is a tool for understanding, not a diagnosis or destiny.',
      actions: [
        ['Explore resources', '/resources'],
        ['Start my journey', '/dashboard'],
      ],
      tone: 'lavender',
      icon: '✦',
    },
    {
      id: 'future',
      eyebrow: 'Future',
      title: 'I am thinking about my future',
      description: 'Explore careers, courses, colleges, pathways, skills and opportunities at your own pace.',
      reassurance: 'You can explore without having to choose your entire future today.',
      actions: [
        ['Explore careers', '/vidyavantage'],
        ['Career discovery', '/dashboard/career'],
      ],
      tone: 'gold',
      icon: '↗',
    },
    {
      id: 'connect',
      eyebrow: 'Connect',
      title: 'I want to connect and contribute',
      description: 'Discover community, events, mentors, volunteering, opportunities and ways to participate safely.',
      reassurance: 'Community participation should remain voluntary, moderated and safety-aware.',
      actions: [
        ['Explore community', '/wall'],
        ['Find opportunities', '/vidyavantage'],
      ],
      tone: 'sky',
      icon: '◎',
    },
  ], []);

  const selected = pathways.find((item) => item.id === active);
  const previousLabel = journeyContext?.label || journeyContext?.intentLabel || journeyContext?.selectedLabel || null;

  const continueTo = (path) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          'secretsharz_institutional_pathway',
          JSON.stringify({
            pathway: selected?.id || null,
            source: 'institutional-discovery-hub',
            previousContext: journeyContext || null,
            updatedAt: new Date().toISOString(),
          })
        );
      }
    } catch (_) {}
    navigate?.(path);
  };

  return (
    <main className="ss-id-hub" id="main-content" tabIndex="-1" aria-labelledby="ss-id-title">
      <div className="ss-id-inner">
        <header className="ss-id-header">
          <p className="ss-id-kicker">Your next step</p>
          <h1 id="ss-id-title">Where would you like to begin?</h1>
          <p>
            Secret Sharz brings support, understanding, future direction and connection into one
            continuing human journey. Choose what feels most relevant today — you can change direction later.
          </p>
        </header>

        {previousLabel && (
          <aside className="ss-id-context" aria-label="Your previous starting point">
            <span>Previously, you told us:</span>
            <strong>{previousLabel}</strong>
            <button type="button" onClick={() => setActive(null)}>Choose again</button>
          </aside>
        )}

        <section className="ss-id-grid" aria-label="Four ways to continue">
          {pathways.map((item) => {
            const isActive = active === item.id;
            return (
              <article key={item.id} className={`ss-id-card ${item.tone}${isActive ? ' active' : ''}`}>
                <button
                  type="button"
                  className="ss-id-card-trigger"
                  aria-expanded={isActive}
                  onClick={() => setActive(isActive ? null : item.id)}
                >
                  <span className="ss-id-icon" aria-hidden="true">{item.icon}</span>
                  <span className="ss-id-copy">
                    <span className="ss-id-eyebrow">{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="ss-id-arrow" aria-hidden="true">{isActive ? '−' : '→'}</span>
                </button>

                {isActive && (
                  <div className="ss-id-expanded" aria-live="polite">
                    <p>{item.reassurance}</p>
                    <div className="ss-id-actions">
                      {item.actions.map(([label, path]) => (
                        <button key={path} type="button" onClick={() => continueTo(path)}>
                          {label} <span aria-hidden="true">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section className="ss-id-no-wrong-door" aria-labelledby="ss-id-no-wrong-door-title">
          <div>
            <p className="ss-id-kicker">No wrong door</p>
            <h2 id="ss-id-no-wrong-door-title">Not sure where you belong?</h2>
            <p>
              That is okay. You can start with a conversation, explore the platform or simply tell us
              what is happening. Secret Sharz should help you find a direction rather than make you learn its departments.
            </p>
          </div>
          <button type="button" onClick={() => navigate?.('/start')}>Help me find my way <span aria-hidden="true">→</span></button>
        </section>

        <p className="ss-id-footnote">
          Human support remains human. Choices here are routing preferences, not clinical, psychological or career determinations.
        </p>
      </div>

      <style>{`
        .ss-id-hub{--ink:#17231d;--deep:#17352A;--muted:#68766d;--line:#DCE5DF;--green:#2E6B4A;min-height:100%;background:linear-gradient(180deg,#F8FAF7,#FDFCFA);color:var(--ink);padding:76px 6vw 90px}
        .ss-id-hub *{box-sizing:border-box}
        .ss-id-hub button{font:inherit}
        .ss-id-inner{width:min(1180px,100%);margin:auto}
        .ss-id-header{max-width:800px;margin:0 auto 34px;text-align:center}
        .ss-id-kicker,.ss-id-eyebrow{margin:0;color:var(--green);font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
        .ss-id-header h1{font-family:Fraunces,serif;font-size:clamp(42px,5.5vw,68px);line-height:1.05;letter-spacing:-.045em;margin:12px 0 18px}
        .ss-id-header>p:last-child{font-size:17px;line-height:1.7;color:#405048;margin:0}
        .ss-id-context{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:13px 16px;border:1px solid #D7E4DB;background:#F1F7F2;border-radius:15px;margin-bottom:16px;color:#405048;font-size:13px}
        .ss-id-context strong{color:var(--deep)}
        .ss-id-context button{margin-left:auto;border:0;background:transparent;text-decoration:underline;color:var(--green);font-weight:800;cursor:pointer}
        .ss-id-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .ss-id-card{background:#fff;border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 14px 50px rgba(23,53,42,.055);transition:box-shadow .2s,border-color .2s,transform .2s}
        .ss-id-card:hover,.ss-id-card.active{border-color:#9DBEAA;box-shadow:0 18px 55px rgba(23,53,42,.09)}
        .ss-id-card.active{transform:translateY(-2px)}
        .ss-id-card-trigger{width:100%;display:grid;grid-template-columns:52px 1fr 24px;gap:16px;align-items:center;text-align:left;border:0;background:#fff;padding:24px;cursor:pointer;color:var(--ink)}
        .ss-id-card-trigger:focus-visible,.ss-id-actions button:focus-visible,.ss-id-no-wrong-door button:focus-visible{outline:3px solid var(--green);outline-offset:3px}
        .ss-id-icon{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;font-size:22px;font-weight:900;background:#EBF4EE;color:var(--green)}
        .ss-id-card.lavender .ss-id-icon{background:#F0EDF7;color:#665A8A}
        .ss-id-card.gold .ss-id-icon{background:#F7F1DF;color:#826C2D}
        .ss-id-card.sky .ss-id-icon{background:#EAF4FA;color:#427F9D}
        .ss-id-copy{display:flex;flex-direction:column;gap:5px}
        .ss-id-copy strong{font-size:19px;line-height:1.25}
        .ss-id-copy small{font-size:13px;line-height:1.55;color:#718077}
        .ss-id-arrow{font-size:22px;color:#87958D}
        .ss-id-expanded{border-top:1px solid var(--line);padding:18px 24px 24px;background:#FBFCFB}
        .ss-id-expanded p{font-size:13px;color:#506158;line-height:1.6;margin:0 0 14px}
        .ss-id-actions{display:flex;gap:9px;flex-wrap:wrap}
        .ss-id-actions button,.ss-id-no-wrong-door>button{border:0;border-radius:12px;padding:11px 14px;background:var(--deep);color:#fff;font-weight:850;cursor:pointer}
        .ss-id-actions button+button{background:#EEF4F0;color:var(--deep)}
        .ss-id-no-wrong-door{display:flex;align-items:center;justify-content:space-between;gap:28px;margin-top:18px;padding:28px;border-radius:24px;background:#17352A;color:#fff}
        .ss-id-no-wrong-door .ss-id-kicker{color:#A8D1B6}
        .ss-id-no-wrong-door h2{font-family:Fraunces,serif;font-size:30px;line-height:1.1;margin:7px 0 9px}
        .ss-id-no-wrong-door p:last-child{max-width:760px;color:#D2DED7;line-height:1.6;margin:0}
        .ss-id-no-wrong-door>button{background:#fff;color:var(--deep);white-space:nowrap}
        .ss-id-footnote{text-align:center;color:#718077;font-size:11px;line-height:1.6;margin:20px auto 0;max-width:850px}
        @media(max-width:760px){.ss-id-hub{padding:58px 18px 70px}.ss-id-grid{grid-template-columns:1fr}.ss-id-card-trigger{padding:20px}.ss-id-no-wrong-door{flex-direction:column;align-items:flex-start}.ss-id-no-wrong-door>button{width:100%}.ss-id-context button{margin-left:0}}
        @media(prefers-reduced-motion:reduce){.ss-id-card{transition:none}.ss-id-card.active{transform:none}}
        @media(forced-colors:active){.ss-id-card,.ss-id-card-trigger,.ss-id-expanded{border:1px solid CanvasText}.ss-id-icon{border:1px solid CanvasText}.ss-id-actions button,.ss-id-no-wrong-door>button{border:1px solid ButtonText}}
      `}</style>
    </main>
  );
}
