import React from 'react';

const choices = [
  { title: 'I need support', text: 'Something is difficult and I want to understand what kind of help may fit.', route: '/support', tone: 'sage' },
  { title: 'I want to understand myself', text: 'I want reflection, assessments, learning or resources to make sense of myself.', route: '/resources', tone: 'lavender' },
  { title: 'I am thinking about my future', text: 'I want to explore careers, education, colleges and possible directions.', route: '/vidyavantage', tone: 'gold' },
  { title: 'I want to connect or contribute', text: 'I want community, conversations, volunteering or ways to help.', route: '/about', tone: 'sky' },
];

export default function WayfinderPage({ navigate }) {
  return (
    <main className="ss-wayfinder">
      <section className="ss-wayfinder-hero">
        <p className="ss-wayfinder-eyebrow">You can start here</p>
        <h1>Not knowing is still a valid starting point.</h1>
        <p>There is no test you need to pass before you ask for help. Choose the direction that feels closest today. You can change it later.</p>
      </section>
      <section className="ss-wayfinder-options" aria-labelledby="wayfinder-title">
        <div className="ss-wayfinder-heading">
          <p className="ss-wayfinder-eyebrow">A simple next step</p>
          <h2 id="wayfinder-title">Which sounds most like you right now?</h2>
        </div>
        <div className="ss-wayfinder-grid">
          {choices.map((choice) => (
            <button key={choice.title} type="button" className={`ss-wayfinder-card ${choice.tone}`} onClick={() => navigate?.(choice.route)}>
              <span className="ss-wayfinder-arrow" aria-hidden="true">→</span>
              <strong>{choice.title}</strong>
              <span>{choice.text}</span>
            </button>
          ))}
        </div>
        <button type="button" className="ss-wayfinder-back" onClick={() => navigate?.('/')}>← Back to the Secret Sharz front door</button>
      </section>
      <style>{`
        .ss-wayfinder{min-height:100vh;background:#FDFCFA;color:#17231d}.ss-wayfinder *{box-sizing:border-box}.ss-wayfinder button{font:inherit}
        .ss-wayfinder-hero{padding:100px 20px 85px;text-align:center;background:linear-gradient(135deg,#F7FAF6,#FDFCFA)}.ss-wayfinder-hero>*{max-width:820px;margin-left:auto;margin-right:auto}.ss-wayfinder-eyebrow{margin-top:0;margin-bottom:14px;color:#2E6B4A;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.ss-wayfinder-hero h1{font-family:Fraunces,serif;font-size:clamp(44px,6vw,72px);line-height:1.04;letter-spacing:-.045em;margin-bottom:22px}.ss-wayfinder-hero>p:last-child{font-size:19px;line-height:1.7;color:#405048}
        .ss-wayfinder-options{padding:85px 6vw 105px;background:#fff}.ss-wayfinder-heading{width:min(720px,100%);margin:0 auto 42px;text-align:center}.ss-wayfinder-heading h2{font-family:Fraunces,serif;font-size:clamp(34px,4vw,52px);line-height:1.1;letter-spacing:-.035em;margin:0}.ss-wayfinder-grid{width:min(1000px,100%);margin:auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.ss-wayfinder-card{min-height:220px;text-align:left;position:relative;padding:30px;border-radius:22px;background:#FDFCFA;border:1px solid #DCE4DE;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.ss-wayfinder-card:hover{transform:translateY(-4px);box-shadow:0 18px 45px rgba(30,55,42,.1);border-color:#AFC1B5}.ss-wayfinder-card.sage{border-top:4px solid #5E8E6E}.ss-wayfinder-card.lavender{border-top:4px solid #7D7695}.ss-wayfinder-card.gold{border-top:4px solid #A38355}.ss-wayfinder-card.sky{border-top:4px solid #5B8CA7}.ss-wayfinder-arrow{position:absolute;right:24px;top:18px;font-size:24px;color:#2E6B4A}.ss-wayfinder-card strong{font-size:20px;margin-bottom:10px}.ss-wayfinder-card>span:last-child{color:#68766d;font-size:14px;line-height:1.6;max-width:440px}.ss-wayfinder-back{display:block;margin:30px auto 0;border:0;background:transparent;color:#2E6B4A;font-weight:800;cursor:pointer;padding:10px}.ss-wayfinder-back:hover{text-decoration:underline}
        @media(max-width:650px){.ss-wayfinder-hero{padding:72px 20px 65px}.ss-wayfinder-options{padding:70px 20px 85px}.ss-wayfinder-grid{grid-template-columns:1fr}.ss-wayfinder-card{min-height:190px}}
      `}</style>
    </main>
  );
}
