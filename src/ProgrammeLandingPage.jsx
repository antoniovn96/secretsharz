import React from 'react';

const PROGRAMMES = {
  spark: {
    name: 'Sharz Spark',
    descriptor: 'Learning & Inclusion',
    eyebrow: 'Every mind has its own way',
    headline: 'Find support for the way you learn.',
    intro: 'Sharz Spark brings together learning support, inclusive resources and guidance for learners, families, educators and specialists.',
    tone: 'spark',
    symbol: '✳',
    route: '/dashboard/sen',
    features: [
      ['Learning support', 'Explore resources and strategies that can help learners participate and build on their strengths.'],
      ['Inclusive planning', 'Support conversations around individual learning needs, accommodations and next steps.'],
      ['Family and educator resources', 'Find information to help the people around a learner work together appropriately.'],
      ['Professional support', 'Explore routes to relevant learning and SEN professionals.'],
    ],
    note: 'Learning resources are informational and do not replace an individual assessment or professional advice.',
  },
  balance: {
    name: 'Sharz Balance',
    descriptor: 'Mental Health & Wellbeing',
    eyebrow: 'A space to feel heard',
    headline: 'Your wellbeing deserves care.',
    intro: 'Sharz Balance brings together wellbeing resources, reflection and pathways to appropriate human support, at a pace that feels right for you.',
    tone: 'balance',
    symbol: '♡',
    route: '/dashboard/wellbeing',
    features: [
      ['Wellbeing resources', 'Explore practical information for understanding feelings and caring for yourself.'],
      ['Counselling pathways', 'Learn about options for connecting with an appropriate counsellor or mental health professional.'],
      ['Self-reflection', 'Use guided prompts to organise your thoughts and identify what support may help.'],
      ['Support with care', 'Access should be guided by consent, privacy and appropriate safeguarding.'],
    ],
    note: 'This programme is not an emergency service and online resources are not a substitute for urgent or professional care.',
  },
  compass: {
    name: 'Sharz Compass',
    descriptor: 'Career Guidance & Discovery',
    eyebrow: 'Discover your direction',
    headline: 'Your future has more than one possibility.',
    intro: 'Sharz Compass helps people explore interests, strengths, education options and potential career directions, then turn what they learn into practical next steps.',
    tone: 'compass',
    symbol: '⌖',
    route: '/dashboard/career',
    features: [
      ['Career assessments', 'Explore available assessments and understand what each one is designed to help you examine.'],
      ['Course and college exploration', 'Research education options and the routes they may open.'],
      ['Career pathways', 'Compare potential directions and build an informed exploration plan.'],
      ['Planning and guidance', 'Organise goals, questions and next steps for independent exploration or professional guidance.'],
    ],
    note: 'Assessment results are one source of information, not a diagnosis or a fixed prediction of future success.',
  },
};

export default function ProgrammeLandingPage({ programme = 'spark', navigate, currentUser }) {
  const item = PROGRAMMES[programme] || PROGRAMMES.spark;
  const go = (path) => navigate?.(path);

  return (
    <div className={`ss-programme-page ${item.tone}`}>
      <main id="main-content" tabIndex="-1">
        <section className="spp-hero" aria-labelledby="spp-title">
          <div className="spp-copy">
            <p className="spp-eyebrow"><span aria-hidden="true">{item.symbol}</span> {item.descriptor}</p>
            <p className="spp-kicker">{item.eyebrow}</p>
            <h1 id="spp-title">{item.headline}</h1>
            <p className="spp-intro">{item.intro}</p>
            <div className="spp-actions">
              <button className="spp-primary" type="button" onClick={() => go(currentUser ? item.route : '/auth')}>
                {currentUser ? 'Open my programme' : 'Log in or get started'} <span aria-hidden="true">→</span>
              </button>
              <button className="spp-secondary" type="button" onClick={() => go('/')}>Explore all programmes</button>
            </div>
            <p className="spp-privacy-note">Your access and information depend on your account, relationships, consent and role.</p>
          </div>
          <div className="spp-art" aria-hidden="true"><div className="spp-art-disc"/><div className="spp-art-ring"/><div className="spp-art-symbol">{item.symbol}</div><div className="spp-art-note">{item.name}<small>{item.descriptor}</small></div></div>
        </section>

        <section className="spp-features" aria-labelledby="spp-features-title">
          <p className="spp-eyebrow">Explore the programme</p>
          <h2 id="spp-features-title">Ways we can help you move forward</h2>
          <div className="spp-feature-grid">
            {item.features.map(([title, text], i) => <article key={title} className="spp-feature"><span aria-hidden="true">{['01','02','03','04'][i]}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="spp-next" aria-labelledby="spp-next-title">
          <div><p className="spp-eyebrow">Your next step</p><h2 id="spp-next-title">Start with what you need today.</h2><p>You can explore information first. Sign in when you are ready to enter the secure parts of the programme.</p></div>
          <button className="spp-primary" type="button" onClick={() => go(currentUser ? item.route : '/auth')}>{currentUser ? 'Continue to workspace' : 'Continue securely'} <span aria-hidden="true">→</span></button>
        </section>
        {item.note && <p className="spp-note">{item.note}</p>}
      </main>
      <style>{`
        .ss-programme-page{--spp-ink:#153f39;--spp-text:#4c5f59;--spp-muted:#6c7b75;--spp-line:#dfe8e1;background:#fcfbf7;color:var(--spp-ink);min-height:72vh}
        .ss-programme-page *{box-sizing:border-box}.ss-programme-page button{font:inherit;cursor:pointer}
        .ss-programme-page button:focus-visible{outline:3px solid #225d53;outline-offset:4px}
        .spp-hero{padding:74px 5.5vw;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:60px;align-items:center;background:radial-gradient(ellipse at 75% 30%,var(--spp-wash),transparent 52%),linear-gradient(120deg,#fffdfa,#f5f7ef)}
        .ss-programme-page.spark{--spp-accent:#a45427;--spp-wash:#f9e4d1}.ss-programme-page.balance{--spp-accent:#246d59;--spp-wash:#dceddf}.ss-programme-page.compass{--spp-accent:#3557a1;--spp-wash:#e2e9fb}
        .spp-copy,.spp-features,.spp-next{width:min(1200px,100%);margin:auto}
        .spp-eyebrow{color:var(--spp-accent);font-size:11px;font-weight:850;letter-spacing:.12em;text-transform:uppercase;margin:0 0 13px}
        .spp-kicker{font-family:Georgia,serif;font-style:italic;color:var(--spp-muted);font-size:20px;margin:0 0 10px}
        .spp-hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(42px,5vw,66px);font-weight:500;letter-spacing:-.04em;line-height:1.04;margin:0 0 21px;max-width:750px}
        .spp-intro{max-width:700px;font-size:17px;line-height:1.75;color:var(--spp-text);margin:0}
        .spp-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.spp-primary,.spp-secondary{min-height:47px;padding:12px 18px;border-radius:999px;font-size:13px;font-weight:800}.spp-primary{border:1px solid transparent;background:var(--spp-accent);color:#fff}.spp-primary:hover{filter:brightness(.93)}.spp-secondary{border:1px solid #b9c8bf;color:#254e45;background:rgba(255,255,255,.76)}
        .spp-privacy-note{margin:18px 0 0;color:var(--spp-muted);font-size:12px;line-height:1.6}
        .spp-art{position:relative;min-height:340px;border:1px solid rgba(255,255,255,.9);border-radius:44% 56% 55% 45%/52% 44% 56% 48%;overflow:hidden;background:linear-gradient(145deg,var(--spp-wash),#fffdf8 55%,#dcebe1)}
        .spp-art-disc{position:absolute;width:70%;aspect-ratio:1;left:15%;top:10%;border-radius:50%;background:radial-gradient(circle at 42% 35%,rgba(255,255,255,.97),rgba(255,255,255,.23) 62%,transparent 70%);border:1px solid rgba(255,255,255,.85)}
        .spp-art-ring{position:absolute;width:60%;height:78%;top:10%;left:20%;border:2px solid rgba(255,255,255,.8);border-left-color:transparent;border-radius:50%;transform:rotate(31deg)}
        .spp-art-symbol{position:absolute;left:0;right:0;top:21%;text-align:center;font-family:Georgia,serif;font-size:120px;color:var(--spp-accent);opacity:.82}
        .spp-art-note{position:absolute;left:16%;right:16%;bottom:13%;padding:19px 22px;border-radius:20px;border:1px solid rgba(255,255,255,.8);background:rgba(255,255,255,.83);backdrop-filter:blur(8px);font-family:Georgia,serif;font-size:21px;box-shadow:0 15px 35px rgba(20,70,54,.08)}
        .spp-art-note small{display:block;margin-top:4px;font-family:Arial,sans-serif;font-size:11px;color:var(--spp-muted)}
        .spp-features{padding:65px 5.5vw 72px}.spp-features>h2,.spp-next h2{font-family:Georgia,serif;font-weight:500;letter-spacing:-.035em;font-size:clamp(30px,3.5vw,43px);line-height:1.15;margin:0 0 26px}
        .spp-feature-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}.spp-feature{padding:24px;border:1px solid var(--spp-line);border-radius:19px;background:#fff}.spp-feature>span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--spp-wash);color:var(--spp-accent);font-size:11px;font-weight:850}.spp-feature h3{font-size:17px;margin:20px 0 9px;color:var(--spp-ink)}.spp-feature p{font-size:13px;line-height:1.7;color:var(--spp-muted);margin:0}
        .spp-next{padding:32px 5.5vw;margin-bottom:26px;background:#eaf2e9;border:1px solid #dce8dc;border-radius:24px;display:flex;align-items:center;justify-content:space-between;gap:24px}.spp-next h2{margin-bottom:9px}.spp-next p:not(.spp-eyebrow){max-width:700px;color:var(--spp-text);font-size:14px;line-height:1.65;margin:0}.spp-next .spp-primary{white-space:nowrap}.spp-note{max-width:1200px;margin:0 auto;padding:0 5.5vw 35px;color:var(--spp-muted);font-size:12px;line-height:1.6}
        @media(max-width:900px){.spp-hero{gap:28px}.spp-feature-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.spp-art{min-height:300px}}
        @media(max-width:650px){.spp-hero{grid-template-columns:1fr;padding:52px 20px}.spp-art{min-height:255px;max-width:500px;width:100%;margin:auto}.spp-art-symbol{font-size:90px}.spp-features{padding:48px 20px}.spp-feature-grid{grid-template-columns:1fr}.spp-next{margin:0 20px 22px;padding:24px;align-items:flex-start;flex-direction:column}.spp-note{padding:0 20px 25px}.spp-next .spp-primary{width:100%}}
        @media(prefers-reduced-motion:reduce){.ss-programme-page *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
      `}</style>
    </div>
  );
}
