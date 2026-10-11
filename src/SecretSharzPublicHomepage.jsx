import React from 'react';

const programmes = [
  {
    id: 'spark',
    name: 'Sharz Spark',
    descriptor: 'Learning & Inclusion',
    description: 'Learning support, inclusive tools and guidance that help every learner build on their strengths.',
    route: '/sharz-spark',
    tone: 'spark',
    icon: '✳',
    items: ['Learning support', 'SEN resources', 'Inclusive learning'],
  },
  {
    id: 'balance',
    name: 'Sharz Balance',
    descriptor: 'Mental Health & Wellbeing',
    description: 'A welcoming place to explore emotional wellbeing, self-care and appropriate human support.',
    route: '/sharz-balance',
    tone: 'balance',
    icon: '♡',
    items: ['Wellbeing resources', 'Counselling pathways', 'Self-care tools'],
  },
  {
    id: 'compass',
    name: 'Sharz Compass',
    descriptor: 'Career Guidance & Discovery',
    description: 'Understand your interests, explore education and career options, and plan your next steps.',
    route: '/sharz-compass',
    tone: 'compass',
    icon: '⌖',
    items: ['Career assessments', 'Course exploration', 'Career planning'],
  },
];

const journey = [
  ['Pause', 'Take a moment to notice what matters to you.'],
  ['Understand', 'Explore your thoughts, needs, interests and strengths.'],
  ['Connect', 'Find relevant resources, people or professional support.'],
  ['Plan', 'Choose a next step that feels manageable.'],
  ['Grow', 'Review what you learn and keep moving at your own pace.'],
];

export default function SecretSharzPublicHomepage({ navigate }) {
  const go = (path) => navigate?.(path);

  return (
    <div className="ss-public-home">
      <main id="main-content" tabIndex="-1">
        <section className="ssh-hero" aria-labelledby="ssh-hero-title">
          <div className="ssh-hero-inner">
            <div className="ssh-hero-copy">
              <p className="ssh-eyebrow"><span aria-hidden="true">✦</span> A safe space for every journey</p>
              <h1 id="ssh-hero-title">Be heard.<br />Find your path.<br />Build a <em>brighter tomorrow.</em></h1>
              <p className="ssh-hero-lead">
                Secret Sharz brings together emotional wellbeing, inclusive learning and career discovery
                in one connected platform. Start with the part of life you want support with today.
              </p>
              <div className="ssh-actions">
                <a className="ssh-button ssh-button-primary" href="#programmes">Explore our programmes <span aria-hidden="true">→</span></a>
                <button className="ssh-button ssh-button-secondary" type="button" onClick={() => go('/about')}>Get to know Secret Sharz</button>
              </div>
              <div className="ssh-principles" aria-label="Secret Sharz principles">
                <span><b aria-hidden="true">◈</b> People first</span>
                <span><b aria-hidden="true">◎</b> Inclusive by design</span>
                <span><b aria-hidden="true">↗</b> Support for your next step</span>
              </div>
            </div>

            <div className="ssh-hero-art" aria-label="An abstract illustration representing a calmer mind and a clearer path">
              <div className="ssh-art-glow" />
              <div className="ssh-art-leaf leaf-a" />
              <div className="ssh-art-leaf leaf-b" />
              <div className="ssh-art-leaf leaf-c" />
              <div className="ssh-art-path" />
              <div className="ssh-art-sun" />
              <div className="ssh-art-note note-a">A calmer mind</div>
              <div className="ssh-art-note note-b">A clearer path</div>
              <div className="ssh-art-card"><span>Your journey</span><strong>One step at a time.</strong><small>At your pace. In your way.</small></div>
            </div>
          </div>
        </section>

        <section className="ssh-programmes" id="programmes" aria-labelledby="ssh-programmes-title">
          <div className="ssh-section-heading">
            <div>
              <p className="ssh-eyebrow">Three pathways. One shared purpose.</p>
              <h2 id="ssh-programmes-title">Explore our programmes</h2>
            </div>
            <p>Choose the space that best fits what you are looking for. Each programme has its own information, tools and secure workspace.</p>
          </div>
          <div className="ssh-programme-grid">
            {programmes.map((program) => (
              <article className={`ssh-programme-card ${program.tone}`} key={program.id}>
                <div className="ssh-programme-orb" aria-hidden="true">{program.icon}</div>
                <p className="ssh-programme-label">{program.descriptor}</p>
                <h3>{program.name}</h3>
                <p className="ssh-programme-description">{program.description}</p>
                <ul>{program.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <button type="button" className="ssh-programme-link" onClick={() => go(program.route)}>
                  Explore {program.name} <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="ssh-journey" id="compass-journey" aria-labelledby="ssh-journey-title">
          <div className="ssh-section-heading">
            <div>
              <p className="ssh-eyebrow">A flexible guide, not a checklist</p>
              <h2 id="ssh-journey-title">The Compass Journey</h2>
            </div>
            <p>You can begin wherever you are. The journey can look different depending on your needs and the support you choose.</p>
          </div>
          <ol className="ssh-journey-grid">
            {journey.map(([title, text], index) => (
              <li className="ssh-journey-step" key={title}>
                <span className={`ssh-journey-icon journey-${index + 1}`} aria-hidden="true">{['⌁', '◉', '◎', '↗', '✳'][index]}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
                {index < journey.length - 1 && <span className="ssh-journey-arrow" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
          <div className="ssh-journey-note"><span aria-hidden="true">✦</span><p>There is no single right way to begin. You can explore information first, seek support when you are ready, or return to your journey as your needs change.</p></div>
        </section>

        <section className="ssh-about-strip" aria-labelledby="ssh-about-title">
          <div className="ssh-about-mark" aria-hidden="true">SS</div>
          <div>
            <p className="ssh-eyebrow">The idea behind Secret Sharz</p>
            <h2 id="ssh-about-title">Support the whole person, while respecting every person's privacy.</h2>
            <p>Learning, wellbeing and future planning can connect through a person's journey without making sensitive records visible across programmes.</p>
          </div>
          <button type="button" className="ssh-button ssh-button-light" onClick={() => go('/about')}>About Secret Sharz <span aria-hidden="true">→</span></button>
        </section>
      </main>

      <style>{`
        .ss-public-home{--ssh-ink:#123b39;--ssh-body:#40514e;--ssh-muted:#657571;--ssh-teal:#14564f;--ssh-cream:#fcfbf7;--ssh-line:#e2e9e2;background:var(--ssh-cream);color:var(--ssh-ink);overflow:hidden}
        .ss-public-home *{box-sizing:border-box}.ss-public-home button,.ss-public-home a{font:inherit}.ss-public-home button{cursor:pointer}
        .ss-public-home button:focus-visible,.ss-public-home a:focus-visible{outline:3px solid #225d53;outline-offset:4px}
        .ssh-hero{position:relative;padding:76px 5.5vw 68px;background:radial-gradient(ellipse at 72% 25%,rgba(210,225,208,.55),transparent 42%),linear-gradient(120deg,#fffdf9 2%,#f4f7ef 100%)}
        .ssh-hero-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(380px,.95fr);gap:48px;align-items:center}
        .ssh-eyebrow{margin:0 0 14px;color:#3d7265;font-size:11px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
        .ssh-hero h1,.ssh-section-heading h2,.ssh-about-strip h2{font-family:Georgia,'Times New Roman',serif;font-weight:500;letter-spacing:-.045em}
        .ssh-hero h1{max-width:780px;margin:0 0 22px;font-size:clamp(42px,5vw,72px);line-height:1.02}
        .ssh-hero h1 em{color:#276f61;font-weight:500}
        .ssh-hero-lead{max-width:650px;margin:0;color:var(--ssh-body);font-size:17px;line-height:1.7}
        .ssh-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
        .ssh-button{min-height:47px;padding:12px 18px;border-radius:999px;display:inline-flex;gap:12px;align-items:center;justify-content:center;text-decoration:none;font-size:13px;font-weight:750;border:1px solid transparent}
        .ssh-button-primary{background:#124f49;color:#fff}.ssh-button-primary:hover{background:#0c3f3a}
        .ssh-button-secondary{background:rgba(255,255,255,.8);color:#174b45;border-color:#a9c0b7}.ssh-button-secondary:hover{background:#eef5ee}
        .ssh-principles{display:flex;gap:20px;flex-wrap:wrap;margin-top:28px;color:#526b63;font-size:11px}.ssh-principles span{display:flex;align-items:center;gap:7px}.ssh-principles b{font-size:17px;color:#397b6c}
        .ssh-hero-art{position:relative;min-height:425px;border-radius:46% 54% 48% 52%/45% 42% 58% 55%;overflow:hidden;background:linear-gradient(145deg,#e3eee4 0%,#f7e9d8 45%,#d6e8df 100%);border:1px solid rgba(78,131,112,.15)}
        .ssh-art-glow{position:absolute;inset:12% 10%;border-radius:50%;background:radial-gradient(circle at 50% 55%,rgba(255,255,255,.95),rgba(255,255,255,.3) 42%,transparent 72%)}
        .ssh-art-sun{position:absolute;right:16%;top:12%;width:94px;height:94px;border-radius:50%;background:radial-gradient(circle,#fff7d5 0%,#efd9a2 45%,rgba(239,217,162,0) 74%)}
        .ssh-art-path{position:absolute;width:68%;height:77%;left:18%;top:17%;border:3px solid rgba(255,255,255,.82);border-left-color:transparent;border-bottom-color:rgba(255,255,255,.45);border-radius:50%;transform:rotate(-29deg)}
        .ssh-art-leaf{position:absolute;width:110px;height:180px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#8db39c,#316e5f);opacity:.63;transform:rotate(26deg)}
        .ssh-art-leaf:after{content:'';position:absolute;left:50%;top:8%;height:82%;border-left:1px solid rgba(255,255,255,.65);transform:rotate(-15deg)}
        .ssh-art-leaf.leaf-a{left:4%;top:20%;transform:rotate(-38deg)}.ssh-art-leaf.leaf-b{left:22%;bottom:-15%;transform:rotate(52deg);background:linear-gradient(135deg,#bdd4b5,#5d8d6f)}.ssh-art-leaf.leaf-c{right:7%;bottom:2%;transform:rotate(75deg);width:90px;height:150px;background:linear-gradient(135deg,#b6d1c2,#5a8e7b)}
        .ssh-art-note{position:absolute;font-family:Georgia,serif;font-style:italic;font-size:19px;color:#4c705e}.ssh-art-note.note-a{left:15%;top:12%;transform:rotate(-8deg)}.ssh-art-note.note-b{right:11%;top:32%;transform:rotate(5deg);color:#976744}
        .ssh-art-card{position:absolute;left:22%;right:17%;bottom:15%;padding:22px 24px;border:1px solid rgba(255,255,255,.8);border-radius:22px;background:rgba(255,253,247,.83);box-shadow:0 18px 50px rgba(33,76,61,.08);backdrop-filter:blur(8px);display:grid;gap:7px}.ssh-art-card span{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#52806d;font-weight:800}.ssh-art-card strong{font-family:Georgia,serif;font-size:24px;font-weight:500;color:#174740}.ssh-art-card small{font-size:12px;color:#667771}
        .ssh-programmes,.ssh-journey{padding:72px 5.5vw;max-width:1440px;margin:0 auto}
        .ssh-section-heading{display:flex;align-items:end;justify-content:space-between;gap:36px;margin-bottom:28px}.ssh-section-heading>div{max-width:620px}.ssh-section-heading h2{font-size:clamp(32px,4vw,48px);line-height:1.08;margin:0}.ssh-section-heading>p{max-width:455px;color:var(--ssh-muted);font-size:14px;line-height:1.65;margin:0}
        .ssh-programme-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px}
        .ssh-programme-card{position:relative;isolation:isolate;overflow:hidden;min-height:355px;padding:28px;border:1px solid var(--ssh-line);border-radius:24px;background:#fff;display:flex;flex-direction:column;align-items:flex-start}
        .ssh-programme-card:before{content:'';position:absolute;z-index:-1;width:245px;height:245px;right:-82px;top:-100px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.8),transparent 72%)}
        .ssh-programme-card.spark{background:linear-gradient(145deg,#fff7ed,#fbebda);border-color:#f0dfcd}.ssh-programme-card.balance{background:linear-gradient(145deg,#f1f8f2,#e4f0e7);border-color:#d7e7db}.ssh-programme-card.compass{background:linear-gradient(145deg,#f0f4ff,#e5ecfc);border-color:#d8e1f5}
        .ssh-programme-orb{width:56px;height:56px;display:grid;place-items:center;border-radius:50%;font-size:31px;color:#174b45;background:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.9);margin-bottom:20px}
        .spark .ssh-programme-orb{color:#a34d20}.balance .ssh-programme-orb{color:#236956}.compass .ssh-programme-orb{color:#3659a7}
        .ssh-programme-label{margin:0 0 6px;font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:#687671}
        .ssh-programme-card h3{font-family:Georgia,'Times New Roman',serif;font-size:31px;letter-spacing:-.03em;font-weight:500;margin:0 0 12px;color:#153e39}
        .spark h3{color:#91471f}.compass h3{color:#294d9a}
        .ssh-programme-description{margin:0;color:#4a5b55;font-size:14px;line-height:1.65;max-width:360px}
        .ssh-programme-card ul{list-style:none;padding:0;margin:20px 0 26px;display:flex;flex-wrap:wrap;gap:8px}.ssh-programme-card li{border:1px solid rgba(73,104,89,.16);background:rgba(255,255,255,.6);border-radius:999px;padding:7px 10px;font-size:11px;color:#536a5f}
        .ssh-programme-link{margin-top:auto;display:inline-flex;align-items:center;gap:14px;border:0;background:#15564f;color:#fff;border-radius:999px;padding:12px 17px;font-size:12px;font-weight:800}.ssh-programme-link:hover{filter:brightness(.94)}.spark .ssh-programme-link{background:#98491d}.compass .ssh-programme-link{background:#2f519d}
        .ssh-journey{border-top:1px solid #e5ebe4;border-bottom:1px solid #e5ebe4;background:#f4f7f1;max-width:none}
        .ssh-journey>.ssh-section-heading,.ssh-journey-grid,.ssh-journey-note{max-width:1280px;margin-left:auto;margin-right:auto}.ssh-journey-grid{padding:0;list-style:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}
        .ssh-journey-step{position:relative;display:flex;gap:13px;align-items:flex-start;padding:18px 12px;border-radius:18px;background:rgba(255,255,255,.68);border:1px solid #e2e9e0;min-width:0}
        .ssh-journey-icon{flex:0 0 43px;height:43px;display:grid;place-items:center;border-radius:50%;background:#dcefe4;color:#276e5b;font-size:21px}.journey-2{background:#f9e5d5;color:#9a542e}.journey-3{background:#e4e9fa;color:#4059a0}.journey-4{background:#f5e9d2;color:#896334}.journey-5{background:#e7e0f6;color:#6e5599}
        .ssh-journey-step h3{margin:3px 0 7px;font-family:Georgia,serif;font-size:20px;font-weight:500;color:#173e39}.ssh-journey-step p{margin:0;color:#65736c;font-size:12px;line-height:1.6}.ssh-journey-arrow{position:absolute;right:-17px;top:30px;z-index:2;color:#8ba79a;font-size:18px}
        .ssh-journey-note{display:flex;gap:13px;align-items:flex-start;margin-top:18px;padding:16px 19px;border-radius:16px;background:#e8f0e6;color:#416054}.ssh-journey-note span{font-size:20px}.ssh-journey-note p{margin:0;font-size:13px;line-height:1.65}
        .ssh-about-strip{padding:44px max(5.5vw,calc((100vw - 1280px)/2));background:#164b44;color:#fff;display:flex;gap:25px;align-items:center}.ssh-about-strip .ssh-about-mark{flex:0 0 64px;height:64px;border-radius:20px;display:grid;place-items:center;background:rgba(255,255,255,.11);font-family:Georgia,serif;font-size:25px}.ssh-about-strip>div:nth-child(2){flex:1}.ssh-about-strip .ssh-eyebrow{color:#c3e4d2}.ssh-about-strip h2{max-width:740px;font-size:clamp(26px,3vw,38px);line-height:1.12;margin:0 0 10px}.ssh-about-strip p:not(.ssh-eyebrow){max-width:780px;margin:0;color:#e0eee7;font-size:13px;line-height:1.7}.ssh-button-light{background:#fff;color:#174b45;white-space:nowrap}
        @media(max-width:1050px){.ssh-hero-inner{grid-template-columns:1fr 0.9fr;gap:28px}.ssh-hero-art{min-height:360px}.ssh-journey-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ssh-journey-arrow{display:none}.ssh-about-strip{flex-wrap:wrap}.ssh-about-strip>div:nth-child(2){min-width:calc(100% - 100px)}}
        @media(max-width:760px){.ssh-hero{padding:54px 20px 48px}.ssh-hero-inner{grid-template-columns:1fr;gap:32px}.ssh-hero h1{font-size:clamp(42px,11vw,62px)}.ssh-hero-lead{font-size:16px}.ssh-hero-art{min-height:300px;max-width:570px;width:100%;margin:0 auto}.ssh-programmes,.ssh-journey{padding:52px 20px}.ssh-section-heading{align-items:flex-start;flex-direction:column;gap:12px}.ssh-programme-grid{grid-template-columns:1fr}.ssh-programme-card{min-height:0}.ssh-journey-grid{grid-template-columns:1fr}.ssh-journey-step{min-height:94px}.ssh-about-strip{padding:38px 20px;align-items:flex-start}.ssh-about-strip>div:nth-child(2){min-width:0;width:calc(100% - 90px)}.ssh-about-strip .ssh-button-light{width:100%}}
        @media(prefers-reduced-motion:reduce){.ss-public-home *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
      `}</style>
    </div>
  );
}
