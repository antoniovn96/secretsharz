import React, { useEffect, useState } from 'react';

/**
 * Secret Sharz Foundation Homepage
 *
 * Production principles:
 * - No invented usage statistics, testimonials, partnerships or outcomes.
 * - Student-friendly without looking childish.
 * - Calm, restrained palette with purposeful motion.
 * - Designed for keyboard, screen-reader, zoom and reduced-motion users.
 * - Public YouTube content is live and sourced from the Secret Sharz channel.
 */
export default function FoundationHomepage({ navigate, currentUser }) {
  const go = (path) => navigate?.(path);
  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState('');

  useEffect(() => {
    let active = true;
    const loadVideos = async () => {
      try {
        const response = await fetch('/api/youtube-videos?limit=3');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load videos');
        if (active) setVideos(data.items || []);
      } catch (error) {
        if (active) setVideoError(error.message || 'We could not load the latest videos.');
      } finally {
        if (active) setVideoLoading(false);
      }
    };
    loadVideos();
    return () => { active = false; };
  }, []);

  const pathways = [
    {
      title: 'I need someone to talk to',
      text: 'Find a calm first step, learn about support, or connect with a professional when you are ready.',
      route: '/mindspace',
      tone: 'care',
    },
    {
      title: 'I want to understand myself',
      text: 'Explore reflection, assessments and resources that can help you make sense of yourself.',
      route: '/dashboard',
      tone: 'understand',
    },
    {
      title: 'I am thinking about my future',
      text: 'Explore careers, courses, colleges and the possibilities that could fit you.',
      route: '/vidyavantage',
      tone: 'future',
    },
    {
      title: 'I want to connect with people',
      text: 'Find community, conversations, events and opportunities to contribute.',
      route: '/wall',
      tone: 'connect',
    },
  ];

  const services = [
    ['Professional support', 'Counselling, psychology and specialised support when human help is what you need.', '/mindspace'],
    ['Self-discovery', 'Reflection, assessments and learning resources designed to help you understand yourself.', '/resources'],
    ['Career & opportunity', 'Career exploration, colleges, education pathways and future opportunities.', '/vidyavantage'],
    ['Community', 'A place for people to listen, learn, share and contribute without losing sight of safety.', '/wall'],
  ];

  return (
    <div className="ss-foundation-page">
      <section className="ss-fh-hero" aria-labelledby="ss-fh-title">
        <div className="ss-fh-orb ss-fh-orb-one" aria-hidden="true" />
        <div className="ss-fh-orb ss-fh-orb-two" aria-hidden="true" />
        <div className="ss-fh-hero-grid">
          <div className="ss-fh-hero-copy">
            <p className="ss-fh-kicker"><span aria-hidden="true">●</span> A place to begin again</p>
            <h1 id="ss-fh-title">You do not have to figure out life <em>alone.</em></h1>
            <p className="ss-fh-lead">
              Secret Sharz is a lifelong digital platform that helps people understand themselves,
              access professional support, and flourish throughout every stage of life.
            </p>
            <div className="ss-fh-actions" aria-label="Start your Secret Sharz journey">
              <button className="ss-fh-primary" onClick={() => go(currentUser ? '/dashboard' : '/auth')}>
                {currentUser ? 'Continue my journey' : 'Start your journey'}
              </button>
              <button className="ss-fh-secondary" onClick={() => go('/about')}>
                Understand Secret Sharz <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="ss-fh-note">Human-centred. Professional-led. Built to grow with you.</p>
          </div>

          <div className="ss-fh-hero-art" aria-label="Ways to begin with Secret Sharz">
            <div className="ss-fh-art-card ss-fh-art-main">
              <span className="ss-fh-art-label">Your next step</span>
              <strong>There is no single right way to begin.</strong>
              <span>Start where you are. Move at your pace.</span>
            </div>
            <div className="ss-fh-art-card ss-fh-art-float one" aria-hidden="true">Care</div>
            <div className="ss-fh-art-card ss-fh-art-float two" aria-hidden="true">Discover</div>
            <div className="ss-fh-art-card ss-fh-art-float three" aria-hidden="true">Grow</div>
          </div>
        </div>
      </section>

      <section className="ss-fh-pathways" aria-labelledby="ss-fh-pathways-title">
        <div className="ss-fh-section-heading">
          <p className="ss-fh-eyebrow">Start with what you need today</p>
          <h2 id="ss-fh-pathways-title">You can begin anywhere.</h2>
          <p>Life is not a straight line. Secret Sharz should not make you choose one either.</p>
        </div>
        <div className="ss-fh-path-grid">
          {pathways.map((item) => (
            <button key={item.title} className={`ss-fh-path-card ${item.tone}`} onClick={() => go(item.route)}>
              <span className="ss-fh-path-arrow" aria-hidden="true">↗</span>
              <span className="ss-fh-path-title">{item.title}</span>
              <span className="ss-fh-path-text">{item.text}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ss-fh-share" aria-labelledby="ss-fh-share-title">
        <div className="ss-fh-share-copy">
          <p className="ss-fh-eyebrow">Our approach</p>
          <h2 id="ss-fh-share-title">S.H.A.R.E. is a way of caring, not a checklist.</h2>
          <p>
            Speak. Heal. Assess. Route. Empower. You may enter at any point and return to different
            parts of the journey as your life changes.
          </p>
          <button className="ss-fh-text-link" onClick={() => go('/about')}>Explore our approach <span aria-hidden="true">→</span></button>
        </div>
        <ol className="ss-fh-share-list">
          {[
            ['S', 'Speak', 'Be heard without shame.'],
            ['H', 'Heal', 'Find appropriate support and tools.'],
            ['A', 'Assess', 'Understand yourself with care.'],
            ['R', 'Route', 'Turn understanding into direction.'],
            ['E', 'Empower', 'Build the confidence to take your next step.'],
          ].map(([letter, title, text], index) => (
            <li key={letter} className="ss-fh-share-step">
              <span className="ss-fh-share-letter" aria-hidden="true">{letter}</span>
              <span><strong>{title}</strong><small>{text}</small></span>
              {index < 4 && <span className="ss-fh-share-line" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>

      <section className="ss-fh-services" aria-labelledby="ss-fh-services-title">
        <div className="ss-fh-section-heading">
          <p className="ss-fh-eyebrow">A connected ecosystem</p>
          <h2 id="ss-fh-services-title">Support for the person, not just the problem.</h2>
          <p>Different parts of life can connect without giving everyone access to everything about you.</p>
        </div>
        <div className="ss-fh-service-grid">
          {services.map(([title, text, route]) => (
            <article key={title} className="ss-fh-service-card">
              <h3>{title}</h3>
              <p>{text}</p>
              <button onClick={() => go(route)} aria-label={`Explore ${title}`}>Explore <span aria-hidden="true">→</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="ss-fh-human" aria-labelledby="ss-fh-human-title">
        <div className="ss-fh-human-inner">
          <div>
            <p className="ss-fh-eyebrow light">The principle behind the platform</p>
            <h2 id="ss-fh-human-title">Technology should make care easier to reach — not make people feel replaceable.</h2>
          </div>
          <div className="ss-fh-human-points">
            <p><strong>Human support matters.</strong><span>When you need a professional, Secret Sharz connects you with people.</span></p>
            <p><strong>AI has a role.</strong><span>It can assist, organise and guide within professionally approved boundaries.</span></p>
            <p><strong>Your dignity comes first.</strong><span>Privacy, accessibility and safety are part of the product itself.</span></p>
          </div>
        </div>
      </section>

      <section className="ss-fh-video" aria-labelledby="ss-fh-video-title">
        <div className="ss-fh-section-heading">
          <p className="ss-fh-eyebrow">From Secret Sharz</p>
          <h2 id="ss-fh-video-title">Real people. Real conversations.</h2>
          <p>Watch the latest videos published on the official Secret Sharz YouTube channel. New public uploads appear here automatically.</p>
        </div>

        {videoLoading ? (
          <div className="ss-fh-video-state" role="status" aria-live="polite">Loading the latest Secret Sharz videos…</div>
        ) : videoError ? (
          <div className="ss-fh-video-state ss-fh-video-error" role="alert">
            <strong>The video library is temporarily unavailable.</strong>
            <p>{videoError}</p>
            <button className="ss-fh-secondary" onClick={() => go('/videos')}>Open video library</button>
          </div>
        ) : videos.length ? (
          <>
            <div className="ss-fh-video-grid">
              {videos.map((video) => (
                <article key={video.videoId} className="ss-fh-video-card">
                  <button
                    type="button"
                    className="ss-fh-video-thumb"
                    onClick={() => go('/videos')}
                    aria-label={`Open video library to watch: ${video.title}`}
                  >
                    {video.thumbnail ? <img src={video.thumbnail} alt="" loading="lazy" /> : <span aria-hidden="true">Secret Sharz video</span>}
                    <span className="ss-fh-video-play" aria-hidden="true">▶</span>
                  </button>
                  <div className="ss-fh-video-card-body">
                    <h3>{video.title}</h3>
                    {video.publishedAt ? <p>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(video.publishedAt))}</p> : null}
                  </div>
                </article>
              ))}
            </div>
            <div className="ss-fh-video-actions">
              <button className="ss-fh-primary" onClick={() => go('/videos')}>View all Secret Sharz videos <span aria-hidden="true">→</span></button>
            </div>
          </>
        ) : (
          <div className="ss-fh-video-state">No public videos are currently available on the official channel.</div>
        )}

        <p className="ss-fh-video-note">Videos are loaded directly from the official Secret Sharz YouTube channel. Captions remain available through YouTube when provided, and Secret Sharz can publish transcripts alongside recordings where available.</p>
      </section>

      <section className="ss-fh-final" aria-labelledby="ss-fh-final-title">
        <p className="ss-fh-eyebrow">Whenever you are ready</p>
        <h2 id="ss-fh-final-title">You can start small.</h2>
        <p>You do not need to have everything figured out before you arrive.</p>
        <button className="ss-fh-primary" onClick={() => go(currentUser ? '/dashboard' : '/auth')}>
          {currentUser ? 'Continue my journey' : 'Begin with Secret Sharz'}
        </button>
      </section>

      <style>{`
        .ss-foundation-page{--fh-ink:#17231d;--fh-text:#33443a;--fh-muted:#68766d;--fh-green:#2E6B4A;--fh-deep:#17352A;--fh-pale:#EBF4EE;--fh-line:#DCE4DE;background:#FDFCFA;color:var(--fh-ink);overflow:hidden}
        .ss-foundation-page *{box-sizing:border-box}.ss-foundation-page button{font:inherit}
        .ss-fh-hero{position:relative;background:linear-gradient(135deg,#FDFCFA 0%,#F5F7F1 100%);min-height:calc(100vh - 72px);display:flex;align-items:center;padding:80px 6vw;overflow:hidden}
        .ss-fh-hero-grid{width:min(1260px,100%);margin:auto;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:70px;align-items:center;position:relative;z-index:2}
        .ss-fh-kicker,.ss-fh-eyebrow{font-size:13px;text-transform:uppercase;letter-spacing:.14em;font-weight:850;color:var(--fh-green);margin:0 0 16px}.ss-fh-kicker span{display:inline-block;margin-right:8px;animation:ss-pulse 2.6s ease-in-out infinite}
        .ss-fh-hero h1{font-family:Fraunces,serif;font-size:clamp(46px,6vw,78px);line-height:1.04;letter-spacing:-.045em;max-width:780px;margin:0 0 24px;font-weight:700}.ss-fh-hero h1 em{color:var(--fh-green);font-style:italic}
        .ss-fh-lead{font-size:clamp(18px,2vw,22px);line-height:1.65;color:var(--fh-text);max-width:720px;margin:0 0 32px}.ss-fh-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
        .ss-fh-primary,.ss-fh-secondary{min-height:50px;border-radius:14px;padding:13px 21px;cursor:pointer;font-weight:800;border:2px solid transparent}.ss-fh-primary{background:var(--fh-green);color:#fff;box-shadow:0 10px 26px rgba(46,107,74,.18)}.ss-fh-primary:hover{background:#214F37;transform:translateY(-2px)}
        .ss-fh-secondary{background:#fff;color:var(--fh-deep);border-color:#B8C6BD}.ss-fh-secondary:hover{border-color:var(--fh-green);background:var(--fh-pale)}
        .ss-fh-primary:focus-visible,.ss-fh-secondary:focus-visible,.ss-fh-path-card:focus-visible,.ss-fh-service-card button:focus-visible,.ss-fh-text-link:focus-visible,.ss-fh-video-thumb:focus-visible{outline:3px solid #1F6B46;outline-offset:4px}
        .ss-fh-note{font-size:13px;color:var(--fh-muted);margin-top:18px}.ss-fh-orb{position:absolute;border-radius:50%;filter:blur(2px);pointer-events:none}.ss-fh-orb-one{width:480px;height:480px;right:-170px;top:-120px;background:radial-gradient(circle,rgba(94,145,108,.16),transparent 68%);animation:ss-drift 13s ease-in-out infinite}.ss-fh-orb-two{width:320px;height:320px;left:30%;bottom:-230px;background:radial-gradient(circle,rgba(206,184,119,.13),transparent 68%);animation:ss-drift 17s ease-in-out infinite reverse}
        .ss-fh-hero-art{min-height:460px;position:relative;display:flex;align-items:center;justify-content:center}.ss-fh-art-card{border:1px solid rgba(30,60,45,.12);background:rgba(255,255,255,.9);box-shadow:0 24px 70px rgba(26,47,36,.13);backdrop-filter:blur(14px);border-radius:28px}.ss-fh-art-main{width:min(390px,90%);padding:42px;display:flex;flex-direction:column;gap:12px;position:relative;z-index:2;animation:ss-float 7s ease-in-out infinite}.ss-fh-art-label{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:var(--fh-green);font-weight:850}.ss-fh-art-main strong{font-family:Fraunces,serif;font-size:32px;line-height:1.15}.ss-fh-art-main span:last-child{color:var(--fh-muted);line-height:1.55}.ss-fh-art-float{position:absolute;padding:15px 20px;border-radius:18px;font-weight:850;color:var(--fh-deep);z-index:3}.ss-fh-art-float.one{top:35px;right:20px;background:#E9F3EC;transform:rotate(5deg);animation:ss-float 6s 1s ease-in-out infinite}.ss-fh-art-float.two{bottom:85px;left:20px;background:#F2EEE3;transform:rotate(-5deg);animation:ss-float 7s 2s ease-in-out infinite}.ss-fh-art-float.three{bottom:25px;right:55px;background:#E9EEF1;transform:rotate(4deg);animation:ss-float 8s 1.5s ease-in-out infinite}
        .ss-fh-pathways,.ss-fh-services,.ss-fh-video{padding:105px 6vw}.ss-fh-pathways{background:#fff}.ss-fh-section-heading{max-width:760px;margin:0 auto 48px;text-align:center}.ss-fh-section-heading h2,.ss-fh-share h2,.ss-fh-human h2,.ss-fh-final h2{font-family:Fraunces,serif;font-size:clamp(34px,4.2vw,55px);line-height:1.1;letter-spacing:-.035em;margin:0 0 18px}.ss-fh-section-heading>p:last-child{color:var(--fh-text);font-size:18px;line-height:1.65;margin:0}
        .ss-fh-path-grid{width:min(1200px,100%);margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.ss-fh-path-card{text-align:left;border:1px solid var(--fh-line);background:#FDFCFA;border-radius:22px;padding:28px;min-height:235px;cursor:pointer;position:relative;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}.ss-fh-path-card:hover{transform:translateY(-5px);box-shadow:0 18px 45px rgba(30,55,42,.10);border-color:#AFC1B5}.ss-fh-path-card.care{border-top:4px solid #5E8E6E}.ss-fh-path-card.understand{border-top:4px solid #6D8195}.ss-fh-path-card.future{border-top:4px solid #A38355}.ss-fh-path-card.connect{border-top:4px solid #7D7695}.ss-fh-path-arrow{position:absolute;right:22px;top:20px;font-size:22px;color:var(--fh-green)}.ss-fh-path-title{display:block;font-size:20px;font-weight:850;max-width:240px;padding-top:20px;margin-bottom:12px}.ss-fh-path-text{display:block;color:var(--fh-muted);line-height:1.6;font-size:15px}
        .ss-fh-share{background:var(--fh-deep);color:#fff;padding:110px 6vw;display:grid;grid-template-columns:minmax(0,.9fr) minmax(420px,1.1fr);gap:90px;align-items:center}.ss-fh-share .ss-fh-eyebrow,.ss-fh-eyebrow.light{color:#B9D6C2}.ss-fh-share h2{color:#fff}.ss-fh-share-copy>p:not(.ss-fh-eyebrow){color:rgba(255,255,255,.78);font-size:18px;line-height:1.7;max-width:610px}.ss-fh-text-link{margin-top:25px;border:0;background:transparent;color:#fff;font-weight:850;padding:8px 0;cursor:pointer;border-bottom:2px solid #9BC5A8}.ss-fh-share-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}.ss-fh-share-step{display:grid;grid-template-columns:58px 1fr 8px;gap:18px;align-items:start;min-height:105px;position:relative}.ss-fh-share-letter{width:48px;height:48px;border-radius:50%;background:#2E6B4A;border:1px solid #76A88A;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff}.ss-fh-share-step strong{display:block;font-size:20px;margin-bottom:5px}.ss-fh-share-step small{display:block;color:rgba(255,255,255,.68);font-size:14px;line-height:1.5}.ss-fh-share-line{position:absolute;left:24px;top:52px;height:53px;width:1px;background:rgba(185,214,194,.35)}
        .ss-fh-service-grid{width:min(1200px,100%);margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.ss-fh-service-card{border:1px solid var(--fh-line);border-radius:22px;padding:30px;background:#fff;min-height:250px;display:flex;flex-direction:column}.ss-fh-service-card h3{font-family:Fraunces,serif;font-size:28px;margin:0 0 12px}.ss-fh-service-card p{color:var(--fh-muted);line-height:1.65;margin:0 0 25px}.ss-fh-service-card button{margin-top:auto;width:max-content;border:0;background:none;color:var(--fh-green);font-weight:850;padding:8px 0;cursor:pointer}
        .ss-fh-human{background:#F1EEE6;padding:105px 6vw}.ss-fh-human-inner{width:min(1200px,100%);margin:auto;display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:center}.ss-fh-human h2{font-size:clamp(36px,4vw,56px)}.ss-fh-human-points{display:grid;gap:18px}.ss-fh-human-points p{margin:0;background:#fff;border:1px solid #DCD7C9;border-radius:18px;padding:22px}.ss-fh-human-points strong,.ss-fh-human-points span{display:block}.ss-fh-human-points strong{font-size:17px;margin-bottom:6px}.ss-fh-human-points span{color:var(--fh-muted);line-height:1.55;font-size:14px}
        .ss-fh-video{background:#fff}.ss-fh-video-grid{width:min(1000px,100%);margin:0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.ss-fh-video-card{background:#fff;border:1px solid var(--fh-line);border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(30,40,32,.07)}.ss-fh-video-thumb{display:block;position:relative;width:100%;aspect-ratio:16/9;padding:0;border:0;background:#EAF0EB;cursor:pointer;overflow:hidden}.ss-fh-video-thumb img{width:100%;height:100%;object-fit:cover;display:block}.ss-fh-video-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:#2E6B4A;color:#fff;display:grid;place-items:center;font-size:18px;padding-left:3px;box-shadow:0 10px 25px rgba(0,0,0,.2)}.ss-fh-video-card-body{padding:17px}.ss-fh-video-card-body h3{font-size:16px;line-height:1.4;margin:0 0 7px}.ss-fh-video-card-body p{font-size:12px;color:var(--fh-muted);margin:0}.ss-fh-video-actions{text-align:center;margin:30px 0 0}.ss-fh-video-state{width:min(1000px,100%);margin:0 auto;padding:32px;border:1px solid var(--fh-line);border-radius:18px;background:#F7F3ED;color:var(--fh-text);text-align:center}.ss-fh-video-state strong{display:block;margin-bottom:8px}.ss-fh-video-state p{margin:0 0 18px}.ss-fh-video-note{width:min(1000px,100%);margin:18px auto 0;color:var(--fh-muted);font-size:13px;line-height:1.6}
        .ss-fh-final{text-align:center;padding:120px 6vw;background:linear-gradient(135deg,#FDFCFA,#EBF4EE)}.ss-fh-final>p:not(.ss-fh-eyebrow){font-size:18px;color:var(--fh-muted);margin:0 0 28px}
        @keyframes ss-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes ss-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-15px)}}@keyframes ss-pulse{0%,100%{opacity:1}50%{opacity:.45}}
        @media(max-width:1050px){.ss-fh-hero-grid{grid-template-columns:1fr;gap:30px}.ss-fh-hero-copy{max-width:800px;margin:auto;text-align:center}.ss-fh-actions{justify-content:center}.ss-fh-note{text-align:center}.ss-fh-hero-art{min-height:360px}.ss-fh-path-grid,.ss-fh-service-grid{grid-template-columns:repeat(2,1fr)}.ss-fh-share,.ss-fh-human-inner{grid-template-columns:1fr;gap:50px}.ss-fh-video-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.ss-fh-hero{padding:60px 20px}.ss-fh-hero h1{font-size:clamp(42px,13vw,58px)}.ss-fh-lead{font-size:17px}.ss-fh-actions{flex-direction:column;align-items:stretch}.ss-fh-primary,.ss-fh-secondary{width:100%}.ss-fh-hero-art{min-height:300px}.ss-fh-art-main{padding:28px}.ss-fh-art-main strong{font-size:25px}.ss-fh-art-float{font-size:13px;padding:11px 14px}.ss-fh-pathways,.ss-fh-services,.ss-fh-video,.ss-fh-share,.ss-fh-human,.ss-fh-final{padding:75px 20px}.ss-fh-path-grid,.ss-fh-service-grid,.ss-fh-video-grid{grid-template-columns:1fr}.ss-fh-share-step{min-height:100px}.ss-fh-section-heading{margin-bottom:35px}}
        @media(prefers-reduced-motion:reduce){.ss-foundation-page *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
        html[data-reduced-motion="true"] .ss-foundation-page *{scroll-behavior:auto!important;animation:none!important;transition:none!important}
      `}</style>
    </div>
  );
}
