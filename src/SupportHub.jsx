import React from 'react';

const supportAreas = [
  {
    title: 'Counselling & psychology',
    text: 'Professional support for emotional wellbeing, relationships, stress, adjustment and other concerns where talking to a trained professional may help.',
    tone: 'sage',
  },
  {
    title: 'SEN & inclusive learning',
    text: 'Explore learning support, accommodations, inclusive education and guidance for children and young people who may need additional support.',
    tone: 'lavender',
  },
  {
    title: 'Parent & family support',
    text: 'A place for parents and caregivers to understand concerns, ask questions and find an appropriate next step for a child or family.',
    tone: 'sand',
  },
  {
    title: 'Mentoring & life skills',
    text: 'Build confidence, self-awareness, resilience, communication and practical skills with guidance that supports growth over time.',
    tone: 'sky',
  },
];

export default function SupportHub({ navigate }) {
  return (
    <main className="ss-support-page">
      <section className="ss-support-hero">
        <div className="ss-support-hero-inner">
          <div>
            <p className="ss-support-eyebrow">Support</p>
            <h1>You do not need to know the right service before asking for help.</h1>
            <p className="ss-support-lead">
              Start with what is happening in your life. We can help you understand the options and find the right human support when you need it.
            </p>
            <div className="ss-support-actions">
              <button type="button" onClick={() => navigate?.('/mindspace')}>I need a gentle place to begin <span>→</span></button>
              <button type="button" className="secondary" onClick={() => navigate?.('/')} >Back to the front door</button>
            </div>
          </div>
          <div className="ss-support-note">
            <span>Human support remains human.</span>
            <p>Digital tools can help you discover, prepare and navigate. Professional care is provided by people.</p>
          </div>
        </div>
      </section>

      <section className="ss-support-section" aria-labelledby="support-options-title">
        <div className="ss-support-heading">
          <p className="ss-support-eyebrow">Find your starting point</p>
          <h2 id="support-options-title">Different needs. One connected journey.</h2>
          <p>You can move between these areas as your needs change. Choosing one does not define you.</p>
        </div>
        <div className="ss-support-grid">
          {supportAreas.map((area) => (
            <article key={area.title} className={`ss-support-card ${area.tone}`}>
              <div className="ss-support-card-mark" aria-hidden="true">✦</div>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
              <button type="button" onClick={() => navigate?.('/auth')}>Learn about support <span>→</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="ss-support-principles" aria-labelledby="support-principles-title">
        <div>
          <p className="ss-support-eyebrow light">What you can expect</p>
          <h2 id="support-principles-title">Care should feel safe, clear and respectful.</h2>
        </div>
        <div className="ss-support-principle-list">
          <p><strong>No wrong door.</strong><span>You can start wherever feels most natural and change direction later.</span></p>
          <p><strong>No forced diagnosis.</strong><span>Starting a conversation is not the same as being labelled or diagnosed.</span></p>
          <p><strong>Human judgement matters.</strong><span>Professionals remain responsible for professional support and decisions.</span></p>
          <p><strong>Your dignity comes first.</strong><span>Privacy, accessibility and safety belong in the experience from the beginning.</span></p>
        </div>
      </section>

      <style>{`
        .ss-support-page{background:#FDFCFA;color:#17231d;min-height:100vh}
        .ss-support-page *{box-sizing:border-box}.ss-support-page button{font:inherit}
        .ss-support-hero{padding:96px 6vw 82px;background:linear-gradient(135deg,#F7FAF6,#FDFCFA)}
        .ss-support-hero-inner{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(280px,.65fr);gap:70px;align-items:end}
        .ss-support-eyebrow{margin:0 0 14px;color:#2E6B4A;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.ss-support-eyebrow.light{color:#B9D6C2}
        .ss-support-hero h1{font-family:Fraunces,serif;font-size:clamp(42px,5.5vw,70px);line-height:1.04;letter-spacing:-.045em;margin:0 0 22px;max-width:820px}
        .ss-support-lead{font-size:19px;line-height:1.7;color:#405048;max-width:740px;margin:0}
        .ss-support-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.ss-support-actions button{border:0;border-radius:13px;padding:13px 18px;background:#2E6B4A;color:#fff;font-weight:800;cursor:pointer}.ss-support-actions button:hover{background:#214F37}.ss-support-actions .secondary{background:#fff;color:#24342b;border:1px solid #BFCBC2}
        .ss-support-note{border:1px solid #D8E2DB;border-radius:22px;padding:25px;background:#fff;box-shadow:0 18px 50px rgba(23,53,42,.07)}.ss-support-note span{font-family:Fraunces,serif;font-size:24px;font-weight:700;color:#17352A}.ss-support-note p{color:#68766d;line-height:1.6;font-size:14px;margin:10px 0 0}
        .ss-support-section{padding:100px 6vw;background:#fff}.ss-support-heading{width:min(760px,100%);margin:0 auto 48px;text-align:center}.ss-support-heading h2,.ss-support-principles h2{font-family:Fraunces,serif;font-size:clamp(34px,4.2vw,54px);line-height:1.1;letter-spacing:-.035em;margin:0 0 16px}.ss-support-heading>p:last-child{font-size:17px;line-height:1.65;color:#68766d;margin:0}
        .ss-support-grid{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.ss-support-card{border:1px solid #DCE4DE;border-radius:22px;padding:28px;min-height:310px;background:#FDFCFA;display:flex;flex-direction:column}.ss-support-card.sage{border-top:4px solid #5E8E6E}.ss-support-card.lavender{border-top:4px solid #7D7695}.ss-support-card.sand{border-top:4px solid #A38355}.ss-support-card.sky{border-top:4px solid #5B8CA7}.ss-support-card-mark{width:42px;height:42px;border-radius:14px;background:#EBF4EE;color:#2E6B4A;display:grid;place-items:center;margin-bottom:20px}.ss-support-card h3{font-family:Fraunces,serif;font-size:27px;line-height:1.15;margin:0 0 12px}.ss-support-card p{color:#68766d;font-size:14px;line-height:1.65;margin:0 0 22px}.ss-support-card button{margin-top:auto;width:max-content;border:0;background:transparent;color:#2E6B4A;font-weight:850;cursor:pointer;padding:7px 0}.ss-support-card button span,.ss-support-actions span{margin-left:5px}
        .ss-support-principles{padding:105px 6vw;background:#17352A;color:#fff;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:80px;align-items:start}.ss-support-principles h2{font-size:clamp(36px,4vw,55px)}.ss-support-principle-list{display:grid;gap:14px}.ss-support-principle-list p{margin:0;background:rgba(255,255,255,.06);border:1px solid rgba(185,214,194,.2);border-radius:18px;padding:20px}.ss-support-principle-list strong,.ss-support-principle-list span{display:block}.ss-support-principle-list strong{font-size:16px;margin-bottom:5px}.ss-support-principle-list span{font-size:13px;line-height:1.55;color:rgba(255,255,255,.7)}
        @media(max-width:1000px){.ss-support-hero-inner,.ss-support-principles{grid-template-columns:1fr;gap:40px}.ss-support-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:650px){.ss-support-hero,.ss-support-section,.ss-support-principles{padding:72px 20px}.ss-support-grid{grid-template-columns:1fr}.ss-support-actions{flex-direction:column;align-items:stretch}.ss-support-actions button{width:100%}}
      `}</style>
    </main>
  );
}
