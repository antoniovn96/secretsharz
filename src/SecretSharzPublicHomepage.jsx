import React from 'react';

const programmes = [
  {
    id: 'spark',
    name: 'Sharz Spark',
    descriptor: 'Learning & Inclusion',
    description: 'Discover strengths, get the right support and unlock potential for every learner.',
    route: '/sharz-spark',
    tone: 'spark',
    icon: '✳',
    items: ['Learning Support', 'Inclusive Tools', 'SEN Resources', 'Guidance for Parents & Educators'],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=720&q=78',
    alt: 'Learners taking part in a classroom activity',
  },
  {
    id: 'balance',
    name: 'Sharz Balance',
    descriptor: 'Mental Health & Wellbeing',
    description: 'Feel heard, build resilience and find the right support for a healthier, happier you.',
    route: '/sharz-balance',
    tone: 'balance',
    icon: '♡',
    items: ['Counselling Support', 'Self-Care Tools', 'Wellbeing Resources', 'Professional Guidance'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&q=78',
    alt: 'A young woman in soft natural light',
  },
  {
    id: 'compass',
    name: 'Sharz Compass',
    descriptor: 'Career Guidance & Discovery',
    description: 'Explore interests, understand your options and create a future that fits you.',
    route: '/sharz-compass',
    tone: 'compass',
    icon: '⌖',
    items: ['Career Assessments', 'Course & Career Pathways', 'Mentoring Guidance', 'Tools for Decision-Making'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=720&q=78',
    alt: 'Students working together on their future',
  },
];

const journey = [
  ['Pause', 'Take time to check in with yourself.', '⌁'],
  ['Understand', 'Explore your thoughts, needs and strengths.', '♧'],
  ['Connect', 'Access the right support and opportunities.', '♙'],
  ['Plan', 'Create a clear and personalised next step.', '◎'],
  ['Grow', 'Build skills, confidence and a brighter future.', '↗'],
];

export default function SecretSharzPublicHomepage({ navigate }) {
  const go = (path) => navigate?.(path);
  const goToSection = (id) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') {
      go('/');
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="ss-public-home">
      <main id="main-content" tabIndex="-1">
        <section className="ssh-hero" aria-labelledby="ssh-hero-title">
          <div className="ssh-hero-inner">
            <div className="ssh-hero-copy">
              <p className="ssh-eyebrow">A safe space for every journey</p>
              <h1 id="ssh-hero-title">Be Heard.<br />Find Your Path.<br />Build a <em>Brighter Tomorrow.</em></h1>
              <p className="ssh-hero-lead">
                Secret Sharz is a global platform for emotional wellbeing, learning support and career guidance.
                We bring together students, parents, educators and professionals to help every individual feel
                heard, supported, understood and empowered.
              </p>
              <div className="ssh-actions">
                <button className="ssh-button ssh-button-primary" type="button" onClick={() => goToSection('programmes')}>
                  Explore Our Programmes <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="ssh-principles" aria-label="Secret Sharz principles">
                <span><b aria-hidden="true">♢</b> Safe &amp; Confidential</span>
                <span><b aria-hidden="true">♧</b> Evidence-Informed</span>
                <span><b aria-hidden="true">◎</b> Global Community</span>
                <span><b aria-hidden="true">♡</b> For Every Journey</span>
              </div>
            </div>

            <div className="ssh-hero-art" aria-label="A hopeful journey through a sunlit landscape">
              <img className="ssh-landscape" src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=82" alt="" fetchPriority="high" />
              <div className="ssh-hero-wash" />
              <div className="ssh-hero-person-frame">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=82" alt="" fetchPriority="high" />
              </div>
              <span className="ssh-art-note note-a">A calmer mind</span>
              <span className="ssh-art-note note-b">A clearer path</span>
              <span className="ssh-art-note note-c">A brighter you</span>
              <div className="ssh-art-quote">“A safe space<br />to be me,<br />understand me<br />and become more<br />of who I can be.”</div>
              <div className="ssh-leaf leaf-one" aria-hidden="true" />
              <div className="ssh-leaf leaf-two" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="ssh-programmes" id="programmes" aria-labelledby="ssh-programmes-title">
          <div className="ssh-section-heading">
            <h2 id="ssh-programmes-title">Our Programmes</h2>
            <span className="ssh-heading-pill">Three areas. One shared purpose.</span>
            <button className="ssh-outline-button" type="button" onClick={() => goToSection('programmes')}>Explore all programmes <span aria-hidden="true">→</span></button>
          </div>
          <div className="ssh-programme-grid">
            {programmes.map((program) => (
              <article className={`ssh-programme-card ${program.tone}`} key={program.id}>
                <div className="ssh-card-copy">
                  <div className="ssh-programme-orb" aria-hidden="true">{program.icon}</div>
                  <div className="ssh-programme-heading">
                    <h3>{program.name}</h3>
                    <p className="ssh-programme-label">{program.descriptor}</p>
                  </div>
                  <p className="ssh-programme-description">{program.description}</p>
                  <ul>{program.items.map((item) => <li key={item}><span aria-hidden="true">✧</span>{item}</li>)}</ul>
                  <button type="button" className="ssh-programme-link" onClick={() => go(program.route)}>
                    Explore {program.name} <span aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="ssh-programme-visual">
                  <img src={program.image} alt={program.alt} loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ssh-journey" id="compass-journey" aria-labelledby="ssh-journey-title">
          <div className="ssh-section-heading">
            <h2 id="ssh-journey-title">The Compass Journey</h2>
            <span className="ssh-heading-pill">A simple framework for real progress.</span>
            <button className="ssh-outline-button" type="button" onClick={() => go('/about')}>See how it works <span aria-hidden="true">→</span></button>
          </div>
          <ol className="ssh-journey-grid">
            {journey.map(([title, text, icon], index) => (
              <li className="ssh-journey-step" key={title}>
                <span className={`ssh-journey-icon journey-${index + 1}`} aria-hidden="true">{icon}</span>
                <h3>{title}</h3><p>{text}</p>
                {index < journey.length - 1 && <span className="ssh-journey-arrow" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </section>
      </main>

      <style>{`
        .ss-public-home{--ssh-ink:#113c3d;--ssh-body:#4e5c62;--ssh-muted:#63736f;--ssh-teal:#064e4b;--ssh-cream:#fcfbf6;--ssh-line:#e7e9df;background:var(--ssh-cream);color:var(--ssh-ink);overflow:hidden;font-family:Arial,Helvetica,sans-serif}
        .ss-public-home *{box-sizing:border-box}.ss-public-home button,.ss-public-home a{font:inherit}.ss-public-home button{cursor:pointer}
        .ss-public-home button:focus-visible,.ss-public-home a:focus-visible{outline:3px solid #225d53;outline-offset:4px}
        .ssh-hero{padding:28px clamp(22px,4.2vw,64px) 30px;background:linear-gradient(110deg,#fffdf8 0%,#f3f5ed 100%)}
        .ssh-hero-inner{max-width:1450px;margin:0 auto;display:grid;grid-template-columns:minmax(330px,.83fr) minmax(420px,1.17fr);gap:clamp(20px,3vw,45px);align-items:center;min-height:400px}
        .ssh-eyebrow{margin:0 0 16px;color:#386a64;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
        .ssh-hero h1,.ssh-section-heading h2{font-family:Georgia,'Times New Roman',serif;font-weight:500;letter-spacing:-.045em}
        .ssh-hero h1{max-width:670px;margin:0 0 16px;font-size:clamp(38px,4.2vw,62px);line-height:.99}
        .ssh-hero h1 em{color:#247264;font-weight:500}
        .ssh-hero-lead{max-width:570px;margin:0;color:var(--ssh-body);font-size:14px;line-height:1.55}
        .ssh-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:19px}
        .ssh-button{min-height:42px;padding:11px 20px;border-radius:999px;display:inline-flex;gap:16px;align-items:center;justify-content:center;text-decoration:none;font-size:12px;font-weight:750;border:1px solid transparent}
        .ssh-button-primary{background:#064e4b;color:#fff;box-shadow:0 4px 11px rgba(6,78,75,.13)}.ssh-button-primary:hover{background:#043e3c}
        .ssh-principles{display:flex;gap:16px;flex-wrap:wrap;margin-top:22px;color:#526b67;font-size:10px}.ssh-principles span{display:flex;align-items:center;gap:6px;white-space:nowrap}.ssh-principles b{font-size:17px;font-weight:400;color:#246b65}
        .ssh-hero-art{position:relative;isolation:isolate;min-height:385px;border-radius:48% 42% 42% 46%/43% 40% 54% 52%;overflow:hidden;background:#e9ece0}
        .ssh-landscape{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:-2}
        .ssh-hero-wash{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(240,245,232,.92) 0%,rgba(239,242,225,.42) 38%,rgba(255,238,202,.12) 100%)}
        .ssh-hero-person-frame{position:absolute;left:14%;bottom:0;width:43%;height:88%;border-radius:48% 50% 8% 42%/42% 42% 9% 24%;overflow:hidden;border:7px solid rgba(255,255,255,.3);box-shadow:0 24px 50px rgba(28,62,52,.13);mask-image:linear-gradient(to bottom,#000 0%,#000 76%,transparent 100%)}
        .ssh-hero-person-frame img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .ssh-art-note{position:absolute;z-index:2;font-family:Georgia,serif;font-size:clamp(13px,1.5vw,19px);font-style:italic;color:#7f6647;white-space:nowrap}
        .ssh-art-note.note-a{left:20%;top:11%;transform:rotate(-12deg)}.ssh-art-note.note-b{right:12%;top:17%;transform:rotate(-7deg)}.ssh-art-note.note-c{right:27%;bottom:22%;transform:rotate(-6deg)}
        .ssh-art-quote{position:absolute;right:2%;top:42%;padding:12px 13px;color:#234c4b;background:rgba(255,253,246,.78);border-radius:56% 44% 47% 53%;font-family:Georgia,serif;font-style:italic;font-size:clamp(11px,1.2vw,15px);line-height:1.5;transform:rotate(4deg);text-align:left}
        .ssh-leaf{position:absolute;width:72px;height:124px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,rgba(101,151,124,.85),rgba(39,95,78,.25));border:1px solid rgba(255,255,255,.32);z-index:3;pointer-events:none}.ssh-leaf:after{content:'';position:absolute;top:10%;bottom:9%;left:51%;border-left:1px solid rgba(255,255,255,.72);transform:rotate(13deg)}
        .ssh-leaf.leaf-one{left:2%;top:23%;transform:rotate(-37deg)}.ssh-leaf.leaf-two{right:3%;bottom:8%;transform:rotate(30deg);width:59px;height:103px}
        .ssh-programmes{padding:21px clamp(22px,4.2vw,64px) 24px;max-width:1500px;margin:0 auto}
        .ssh-section-heading{display:flex;align-items:center;gap:15px;margin-bottom:14px}.ssh-section-heading h2{font-size:clamp(26px,2.65vw,36px);line-height:1.1;margin:0}
        .ssh-heading-pill{font-size:9px;letter-spacing:.035em;text-transform:uppercase;color:#466e68;background:#edf2e9;padding:7px 12px;border-radius:999px;white-space:nowrap}
        .ssh-outline-button{margin-left:auto;border:1px solid #60918b;background:transparent;color:#164c4b;border-radius:999px;padding:8px 14px;font-size:10px;font-weight:700;white-space:nowrap}.ssh-outline-button:hover{background:#edf4ee}
        .ssh-programme-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .ssh-programme-card{position:relative;isolation:isolate;overflow:hidden;min-height:350px;padding:18px 16px 14px;border:1px solid #ecdfd0;border-radius:13px;background:#fff;display:flex}
        .ssh-programme-card.spark{background:linear-gradient(145deg,#fff7ef,#fceade);border-color:#f2dfd0}.ssh-programme-card.balance{background:linear-gradient(145deg,#f1f8f3,#e6f0e8);border-color:#dce8dc}.ssh-programme-card.compass{background:linear-gradient(145deg,#f1f5ff,#e6effe);border-color:#dce6f9}
        .ssh-card-copy{position:relative;z-index:2;width:100%;display:flex;flex-direction:column;align-items:flex-start;padding-bottom:0}
        .ssh-programme-orb{width:52px;height:52px;flex:0 0 52px;display:grid;place-items:center;border-radius:50%;font-size:26px;color:#a64c22;background:rgba(255,255,255,.68);border:1px solid rgba(255,255,255,.92);margin-bottom:12px;box-shadow:0 2px 12px rgba(67,86,68,.05)}
        .balance .ssh-programme-orb{color:#216e5a}.compass .ssh-programme-orb{color:#335db4}
        .ssh-programme-heading{position:absolute;left:66px;top:4px;right:0}.ssh-programme-card h3{font-family:Georgia,'Times New Roman',serif;font-size:clamp(21px,2vw,28px);letter-spacing:-.025em;font-weight:500;margin:0 0 4px;color:#913e1a}
        .balance .ssh-programme-card h3,.ssh-programme-card.balance h3{color:#124b46}.ssh-programme-card.compass h3{color:#234a9c}
        .ssh-programme-label{margin:0;font-family:Georgia,serif;font-size:14px;color:#9d4f2c}.ssh-programme-card.balance .ssh-programme-label{color:#255f54}.ssh-programme-card.compass .ssh-programme-label{color:#3155a4}
        .ssh-programme-description{position:relative;z-index:2;margin:0 0 10px;max-width:250px;color:#4e5e61;font-size:12px;line-height:1.42}
        .ssh-programme-card ul{position:relative;z-index:3;list-style:none;padding:0;margin:0 0 11px;display:grid;gap:7px}
        .ssh-programme-card li{display:flex;gap:7px;align-items:center;font-size:10px;color:#50605e;line-height:1.3}.ssh-programme-card li span{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:rgba(255,255,255,.75);color:#a64c22;font-size:12px;flex:0 0 19px}
        .ssh-programme-card.balance li span{color:#26715c}.ssh-programme-card.compass li span{color:#315bbb}
        .ssh-programme-link{position:relative;z-index:4;margin-top:auto;display:inline-flex;align-items:center;justify-content:center;gap:10px;border:0;background:#9d431d;color:#fff;border-radius:999px;padding:10px 17px;min-width:168px;font-size:10px;font-weight:800}.ssh-programme-link:hover{filter:brightness(.94)}
        .ssh-programme-card.balance .ssh-programme-link{background:#075148}.ssh-programme-card.compass .ssh-programme-link{background:#254c8e}
        .ssh-programme-visual{position:absolute;z-index:1;right:0;bottom:0;width:58%;height:58%;overflow:hidden;border-radius:50% 0 0 0;opacity:.96;mask-image:linear-gradient(to bottom,transparent 0%,#000 28%,#000 100%)}
        .ssh-programme-visual img{height:100%;width:100%;object-fit:cover;object-position:center;display:block;mix-blend-mode:multiply}
        .ssh-programme-card.spark .ssh-programme-visual{width:65%;height:56%;right:-2%;bottom:0;mask-image:linear-gradient(120deg,transparent 0%,#000 24%,#000 100%)}
        .ssh-programme-card.balance .ssh-programme-visual{width:64%;height:57%;right:-2%;bottom:-3%;mask-image:linear-gradient(115deg,transparent 0%,#000 28%,#000 100%)}
        .ssh-programme-card.compass .ssh-programme-visual{width:65%;height:58%;right:-1%;bottom:0;mask-image:linear-gradient(115deg,transparent 0%,#000 24%,#000 100%)}
        .ssh-journey{padding:20px clamp(22px,4.2vw,64px) 22px;border-top:1px solid #edece4;border-bottom:1px solid #edece4;background:linear-gradient(90deg,#fbfaf5,#f7f8f0,#fbfaf5)}
        .ssh-journey .ssh-section-heading,.ssh-journey-grid{max-width:1370px;margin-left:auto;margin-right:auto}
        .ssh-journey-grid{padding:0;list-style:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:15px}
        .ssh-journey-step{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;min-width:0;padding:6px 8px;border-radius:14px}
        .ssh-journey-icon{display:grid;place-items:center;width:55px;height:55px;border-radius:50%;background:#dcefe4;color:#23705b;font-size:28px;margin-bottom:6px;box-shadow:0 1px 10px rgba(36,76,57,.05)}
        .journey-2{background:#ffeadc;color:#ac4f23}.journey-3{background:#e9e8fc;color:#3152ad}.journey-4{background:#e0eafa;color:#2959b5}.journey-5{background:#ffefd9;color:#ad5b17}
        .ssh-journey-step h3{margin:0 0 5px;font-family:Georgia,serif;font-size:17px;font-weight:500;color:#173e39}.ssh-journey-step p{max-width:180px;margin:0;color:#566663;font-size:10px;line-height:1.45}.ssh-journey-arrow{position:absolute;right:-18px;top:22px;z-index:2;color:#647f7c;font-size:21px}
        @media(max-width:1000px){.ssh-hero-inner{grid-template-columns:minmax(290px,.9fr) minmax(340px,1fr);gap:18px}.ssh-hero-art{min-height:345px}.ssh-principles{gap:10px}.ssh-programme-card{padding:14px 12px 12px;min-height:370px}.ssh-programme-heading{left:62px}.ssh-programme-card h3{font-size:22px}.ssh-programme-label{font-size:12px}.ssh-programme-description{max-width:210px}.ssh-programme-link{min-width:145px}.ssh-programme-card ul{gap:6px}}
        @media(max-width:720px){.ssh-hero{padding:28px 18px 24px}.ssh-hero-inner{grid-template-columns:1fr;gap:24px}.ssh-hero h1{font-size:clamp(40px,11vw,56px)}.ssh-hero-lead{font-size:13px}.ssh-hero-art{min-height:300px;max-width:590px;width:100%;margin:0 auto}.ssh-hero-person-frame{left:16%;width:45%;height:87%}.ssh-art-quote{right:2%;top:40%;font-size:11px}.ssh-programmes,.ssh-journey{padding:22px 18px}.ssh-section-heading{align-items:flex-start;flex-wrap:wrap;gap:9px}.ssh-section-heading h2{font-size:29px}.ssh-heading-pill{margin-top:6px}.ssh-outline-button{margin-left:0}.ssh-programme-grid{grid-template-columns:1fr;gap:12px}.ssh-programme-card{min-height:300px;padding:18px 16px 14px}.ssh-programme-heading{left:67px}.ssh-programme-card h3{font-size:25px}.ssh-programme-label{font-size:14px}.ssh-programme-description{max-width:300px;font-size:12px}.ssh-programme-card ul{gap:7px}.ssh-programme-card li{font-size:10px}.ssh-programme-visual{width:52%;height:58%}.ssh-journey-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.ssh-journey-step{padding:12px 5px}.ssh-journey-arrow{display:none}}
        @media(max-width:440px){.ssh-principles{gap:9px}.ssh-principles span{font-size:9px}.ssh-hero-art{min-height:250px}.ssh-programme-card{min-height:330px}.ssh-programme-visual{width:68%;height:49%}.ssh-programme-card ul{max-width:65%}.ssh-programme-link{min-width:150px}.ssh-journey-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(prefers-reduced-motion:reduce){.ss-public-home *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
      `}</style>
    </div>
  );
}
