import React from 'react';

const paths = [
  {
    id: 'support',
    eyebrow: 'Support',
    title: 'I need support',
    text: 'Emotional wellbeing, learning, family or professional support.',
    route: '/support',
    tone: 'sage',
  },
  {
    id: 'understand',
    eyebrow: 'Understand',
    title: 'I want to understand myself',
    text: 'Reflection, assessments, resources and self-discovery.',
    route: '/resources',
    tone: 'lavender',
  },
  {
    id: 'future',
    eyebrow: 'Future',
    title: 'I am thinking about my future',
    text: 'Career exploration, education, colleges and possible directions.',
    route: '/vidyavantage',
    tone: 'gold',
  },
  {
    id: 'connect',
    eyebrow: 'Connect',
    title: 'I want to connect or contribute',
    text: 'Community, conversations, volunteering and ways to help.',
    route: '/wall',
    tone: 'sky',
  },
];

export default function JourneyBridge({ navigate, currentUser }) {
  const go = (route) => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(
          'secretsharz_journey_entry',
          JSON.stringify({ route, createdAt: new Date().toISOString() })
        );
      } catch (_) {}
    }
    navigate?.(route);
  };

  return (
    <section className="ss-journey-bridge" aria-labelledby="journey-bridge-title">
      <div className="ss-journey-bridge-inner">
        <div className="ss-journey-bridge-heading">
          <div>
            <p className="ss-journey-eyebrow">One continuing journey</p>
            <h2 id="journey-bridge-title">Where would you like to go next?</h2>
          </div>
          <p>
            Secret Sharz is not a set of disconnected services. You can begin in one place,
            change direction and continue without starting over.
          </p>
        </div>

        <div className="ss-journey-grid">
          {paths.map((path) => (
            <button
              key={path.id}
              type="button"
              className={`ss-journey-card ${path.tone}`}
              onClick={() => go(path.route)}
            >
              <span className="ss-journey-card-eyebrow">{path.eyebrow}</span>
              <strong>{path.title}</strong>
              <span>{path.text}</span>
              <span className="ss-journey-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <div className="ss-journey-footer">
          <div>
            <strong>Still not sure?</strong>
            <span>Explore the four institutional pathways and choose the direction that feels closest today.</span>
          </div>
          <button type="button" onClick={() => go('/discover')}>
            Explore the four paths <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <style>{`
        .ss-journey-bridge{padding:78px 6vw;background:#F4F7F3;color:#17231d;border-top:1px solid #E1E8E2;border-bottom:1px solid #E1E8E2}
        .ss-journey-bridge *{box-sizing:border-box}.ss-journey-bridge button{font:inherit}
        .ss-journey-bridge-inner{width:min(1180px,100%);margin:0 auto}
        .ss-journey-bridge-heading{display:flex;justify-content:space-between;align-items:end;gap:50px;margin-bottom:30px}.ss-journey-bridge-heading>div{max-width:650px}.ss-journey-eyebrow{margin:0 0 10px;color:#2E6B4A;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.ss-journey-bridge h2{font-family:Fraunces,serif;font-size:clamp(32px,4vw,50px);line-height:1.08;letter-spacing:-.035em;margin:0}.ss-journey-bridge-heading>p{max-width:430px;margin:0;color:#637169;font-size:14px;line-height:1.65}
        .ss-journey-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.ss-journey-card{position:relative;min-height:205px;text-align:left;padding:24px;border:1px solid #D8E2DA;border-radius:20px;background:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.ss-journey-card:hover{transform:translateY(-3px);box-shadow:0 15px 38px rgba(23,53,42,.09);border-color:#AFC2B5}.ss-journey-card:focus-visible,.ss-journey-footer button:focus-visible{outline:3px solid #1F6B46;outline-offset:3px}.ss-journey-card.sage{border-top:4px solid #5E8E6E}.ss-journey-card.lavender{border-top:4px solid #7D7695}.ss-journey-card.gold{border-top:4px solid #A38355}.ss-journey-card.sky{border-top:4px solid #5B8CA7}.ss-journey-card-eyebrow{color:#6D7A72;font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;margin-bottom:8px}.ss-journey-card strong{font-size:17px;line-height:1.3;margin-bottom:8px}.ss-journey-card>span:not(.ss-journey-card-eyebrow):not(.ss-journey-arrow){color:#68766d;font-size:12px;line-height:1.55;max-width:250px}.ss-journey-arrow{position:absolute;right:20px;top:17px;color:#2E6B4A;font-size:21px}
        .ss-journey-footer{margin-top:12px;padding:20px 22px;border-radius:18px;background:#17352A;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:20px}.ss-journey-footer strong,.ss-journey-footer span{display:block}.ss-journey-footer strong{font-family:Fraunces,serif;font-size:22px;margin-bottom:4px}.ss-journey-footer span{font-size:12px;line-height:1.5;color:#D0DDD5}.ss-journey-footer button{white-space:nowrap;border:0;border-radius:12px;padding:11px 15px;background:#fff;color:#17352A;font-weight:850;cursor:pointer}.ss-journey-footer button:hover{background:#EDF7F0}
        @media(max-width:950px){.ss-journey-grid{grid-template-columns:repeat(2,1fr)}.ss-journey-bridge-heading{align-items:flex-start;flex-direction:column;gap:18px}}
        @media(max-width:600px){.ss-journey-bridge{padding:65px 20px}.ss-journey-grid{grid-template-columns:1fr}.ss-journey-card{min-height:170px}.ss-journey-footer{align-items:flex-start;flex-direction:column}.ss-journey-footer button{width:100%}}
        @media(prefers-reduced-motion:reduce){.ss-journey-card{transition:none}.ss-journey-card:hover{transform:none}}
      `}</style>
    </section>
  );
}
