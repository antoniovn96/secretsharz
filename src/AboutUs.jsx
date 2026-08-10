import React, { useEffect } from 'react';
import Head from 'next/head';

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --sage: #4A7C59; --sage-light: #6FAA80; --sage-pale: #EBF4EE; --moss: #2D5240;
    --lavender: #7C6FA0; --lav-pale: #F0EDF8; --peach: #E8845A; --peach-pale: #FDF0EA;
    --sky: #5B9EBF; --sky-pale: #EAF4FA; --sand: #F7F3ED; --warm-white: #FDFCFA;
    --ink: #1E2820; --ink-soft: #3D4A40; --muted: #7A8A7D; --border: rgba(74,124,89,0.15);
    --shadow-sm: 0 4px 16px rgba(30,40,32,0.06); --shadow-md: 0 12px 40px rgba(30,40,32,0.10);
    --r-md: 20px; --r-lg: 32px;
  }

  * { box-sizing: border-box; }
  .abt-page { background: var(--warm-white); min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink); }
  /* The public Header is the single canonical navigation. */
  .abt-topbar { display: none; }
  .abt-hero { padding: 100px 48px; text-align: center; background: linear-gradient(180deg, var(--sand), var(--warm-white)); position: relative; overflow: hidden; }
  .abt-hero-inner { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
  .abt-eyebrow { display: inline-block; font-size: 13px; font-weight: 800; color: var(--sage); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
  .abt-h1 { font-family: 'Fraunces', serif; font-size: clamp(40px, 6vw, 64px); font-weight: 700; line-height: 1.1; color: var(--ink); margin-bottom: 24px; letter-spacing: -1px; }
  .abt-h1 em { font-style: italic; color: var(--sage); }
  .abt-hero-p { font-size: 18px; color: var(--ink-soft); line-height: 1.7; max-width: 800px; margin: 0 auto; }
  .abt-section { padding: 80px 48px; max-width: 1200px; margin: 0 auto; }
  .abt-section-title { font-family: 'Fraunces', serif; font-size: clamp(28px, 4vw, 40px); font-weight: 700; color: var(--ink); margin-bottom: 24px; }
  .abt-text { font-size: 16px; color: var(--ink-soft); line-height: 1.8; margin-bottom: 16px; }
  .abt-story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .abt-story-card { background: var(--ink); color: white; padding: 40px; border-radius: var(--r-lg); box-shadow: var(--shadow-md); position: relative; }
  .abt-story-card::before { content: '“'; position: absolute; top: 10px; left: 20px; font-family: 'Fraunces', serif; font-size: 80px; color: rgba(255,255,255,0.1); line-height: 1; }
  .abt-founder-name { font-family: 'Fraunces', serif; font-size: 20px; color: var(--sage-light); margin-bottom: 4px; font-weight: 700; }
  .abt-founder-cred { font-size: 13px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }
  .abt-dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 40px; }
  .abt-engine-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 40px; box-shadow: var(--shadow-sm); transition: transform 0.2s; }
  .abt-engine-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
  .abt-engine-icon { font-size: 40px; margin-bottom: 20px; }
  .abt-engine-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--ink); margin-bottom: 12px; }
  .abt-engine-tag { display: inline-block; padding: 4px 12px; background: var(--sand); color: var(--muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; margin-bottom: 16px; }
  .abt-share-wrap { background: var(--sage-pale); padding: 80px 48px; border-radius: var(--r-lg); margin: 60px auto; max-width: 1200px; }
  .abt-share-grid { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; max-width: 800px; margin-left: auto; margin-right: auto; }
  .abt-share-item { background: white; padding: 24px 32px; border-radius: 16px; display: flex; align-items: center; gap: 24px; box-shadow: var(--shadow-sm); border: 1px solid rgba(74,124,89,0.1); }
  .abt-share-letter { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 700; color: var(--sage); width: 60px; height: 60px; background: var(--sage-pale); display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0; }
  .abt-share-content h4 { font-size: 18px; font-weight: 700; color: var(--ink); margin: 0 0 4px 0; }
  .abt-share-content p { margin: 0; font-size: 15px; color: var(--ink-soft); line-height: 1.5; }
  .abt-values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 40px; }
  .abt-value-card { background: white; padding: 32px; border-radius: var(--r-md); border-top: 4px solid var(--sage); box-shadow: var(--shadow-sm); }
  .abt-value-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--ink); }
  .abt-impact { text-align: center; max-width: 800px; margin: 0 auto; padding: 60px 0; }
  .abt-sdg-tags { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin: 24px 0; }
  .abt-sdg { background: #E8F4F8; color: #2C3E50; padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; }
  .abt-cta-box { background: var(--ink); color: white; text-align: center; padding: 80px 48px; border-radius: var(--r-lg); margin-top: 60px; }
  .abt-cta-h2 { font-family: 'Fraunces', serif; font-size: 36px; margin-bottom: 32px; }
  .abt-btn-group { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
  .abt-btn { padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; min-height: 48px; }
  .abt-btn-primary { background: var(--sage); color: white; }
  .abt-btn-primary:hover { background: var(--moss); transform: translateY(-2px); }
  .abt-btn-secondary { background: transparent; border: 2px solid rgba(255,255,255,0.2); color: white; }
  .abt-btn-secondary:hover { border-color: white; background: rgba(255,255,255,0.05); }
  :where(.abt-page a,.abt-page button):focus-visible { outline: 3px solid #1F6B46; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { .abt-engine-card:hover,.abt-btn-primary:hover { transform:none; } }
  @media(max-width: 900px) {
    .abt-hero { padding: 60px 24px; }
    .abt-h1 { font-size: 36px; }
    .abt-section, .abt-share-wrap, .abt-cta-box { padding: 60px 24px; }
    .abt-story-grid, .abt-dual-grid { grid-template-columns: 1fr; gap: 40px; }
    .abt-share-item { flex-direction: column; text-align: center; align-items: center; gap: 16px; }
    .abt-btn-group { flex-direction: column; width: 100%; }
    .abt-btn { width: 100%; justify-content: center; }
  }
`;

export default function AboutUs({ navigate }) {
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    window.scrollTo(0, 0);
    return () => document.head.removeChild(s);
  }, []);

  return (
    <>
      <Head>
        <title>About Secret Sharz | Our Story & Methodology</title>
        <meta name="description" content="Discover the story behind Secret Sharz. Built by school counselors, we are India's first integrated emotional safe space and career discovery ecosystem." />
      </Head>

      <div className="abt-page">
        <section className="abt-hero" aria-labelledby="about-page-title">
          <div className="abt-hero-inner">
            <span className="abt-eyebrow">Our Philosophy</span>
            <h1 id="about-page-title" className="abt-h1">Mental clarity is the prerequisite for <em>career clarity.</em></h1>
            <p className="abt-hero-p">
              At Secret Sharz, we believe that no student should have to sacrifice their mental health to secure their future. We are India’s first integrated emotional safe space and career discovery ecosystem, designed to help youth navigate the heavy pressures of academics, expectations, and growing up.
            </p>
          </div>
        </section>

        <section className="abt-section" aria-labelledby="about-story-title">
          <div className="abt-story-grid">
            <div>
              <h2 id="about-story-title" className="abt-section-title">Built from real conversations behind closed doors.</h2>
              <p className="abt-text">Secret Sharz didn’t start in a tech boardroom; it started in a school counseling office.</p>
              <p className="abt-text">Day in and day out, the same pattern repeated itself: brilliant, capable students would walk through the door and finally let their guard down. Away from the pressure of grades and the watchful eyes of their peers, the truth came out. They were struggling silently under the crushing weight of expectations. They were paralyzed by anxiety about their futures.</p>
              <p className="abt-text">Students didn't lack the vocabulary to express their feelings; they lacked a safe, judgment-free place to do it. We expect young people to figure out their entire lives—to choose the perfect stream, score top marks, and pick a lifelong career—while they are actively struggling just to regulate their daily emotions. We were asking them to build a house while the ground was shaking beneath them.</p>
              <p className="abt-text" style={{ fontWeight: 700, color: 'var(--sage)', fontSize: '18px' }}>Secret Sharz was born to stop the shaking.</p>
              <p className="abt-text">We took the safety, empathy, and psychological tools of that physical counseling room and scaled it digitally.</p>
            </div>
            <div className="abt-story-card">
              <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '32px', position: 'relative', zIndex: 1 }}>&quot;We cannot demand career clarity from a mind that is consumed by emotional survival. We have to fix the foundation first.&quot;</p>
              <div className="abt-founder-name">Antonio Vian Noronha</div>
              <div className="abt-founder-cred">MSW, Medical & Psychiatric Social Work<br/>Founder & Former School Counselor</div>
            </div>
          </div>
        </section>

        <section className="abt-section" style={{ background: 'var(--sand)', borderRadius: '32px', padding: '80px 48px' }} aria-labelledby="dual-engine-title">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span className="abt-eyebrow">The Ecosystem</span>
            <h2 id="dual-engine-title" className="abt-section-title">The Dual-Engine Approach</h2>
            <p className="abt-text">We realize that healing isn't the final destination; it’s the launchpad. That is why our platform operates as a dual-engine system.</p>
          </div>
          <div className="abt-dual-grid">
            <div className="abt-engine-card">
              <div className="abt-engine-icon" aria-hidden="true">🛡️</div>
              <div className="abt-engine-tag">1. The Anchor</div>
              <h3 className="abt-engine-title">Secret Sharz</h3>
              <p className="abt-text">A radically anonymous sanctuary where identities don't matter, but feelings do. It is a place for students to drop the heavy bags they carry all day, use clinical micro-interventions (Emotional First Aid) to calm their nervous systems, and realize through our anonymous community wall that they are never alone.</p>
            </div>
            <div className="abt-engine-card" style={{ borderColor: 'rgba(232,132,90,0.3)' }}>
              <div className="abt-engine-icon" aria-hidden="true">🚀</div>
              <div className="abt-engine-tag" style={{ background: 'var(--peach-pale)', color: 'var(--peach)' }}>2. The Launchpad</div>
              <h3 className="abt-engine-title">VidyaVantage</h3>
              <p className="abt-text">Once a student clears the noise from their mind, they finally have the space to figure out who they actually are. VidyaVantage is our premium career guidance subsidiary. It takes emotionally regulated students and maps their true personality (via Holland's RIASEC theory) to data-backed college and career pathways.</p>
            </div>
          </div>
        </section>

        <section className="abt-share-wrap" aria-labelledby="share-title">
          <div style={{ textAlign: 'center' }}>
            <span className="abt-eyebrow">Our Framework</span>
            <h2 id="share-title" className="abt-section-title">The S.H.A.R.E. Methodology</h2>
            <p className="abt-text" style={{ maxWidth: '700px', margin: '0 auto' }}>Everything we build is guided by our proprietary psychological framework, designed to take a student from emotional overwhelm to unshakeable confidence.</p>
          </div>
          <div className="abt-share-grid">
            <div className="abt-share-item"><div className="abt-share-letter" aria-hidden="true">S</div><div className="abt-share-content"><h4>🗣️ Speak (The Secret)</h4><p>Let out hidden thoughts safely and anonymously on the Sharz Wall.</p></div></div>
            <div className="abt-share-item"><div className="abt-share-letter" aria-hidden="true">H</div><div className="abt-share-content"><h4>🌿 Heal (The First Aid)</h4><p>Regulate your nervous system using our Mind Space tools.</p></div></div>
            <div className="abt-share-item"><div className="abt-share-letter" aria-hidden="true">A</div><div className="abt-share-content"><h4>🧠 Assess (The Transition)</h4><p>Discover how your unique brain works through our SEN resources and learning profiles without judgment.</p></div></div>
            <div className="abt-share-item"><div className="abt-share-letter" aria-hidden="true">R</div><div className="abt-share-content"><h4>🗺️ Route (The Strategy)</h4><p>Use VidyaVantage to map your personality to the exact colleges and careers that fit you best.</p></div></div>
            <div className="abt-share-item"><div className="abt-share-letter" aria-hidden="true">E</div><div className="abt-share-content"><h4>🚀 Empower (The Outcome)</h4><p>Step into your future using actionable roadmaps and unshakeable confidence.</p></div></div>
          </div>
        </section>

        <section className="abt-section" aria-labelledby="values-title">
          <div style={{ textAlign: 'center' }}><h2 id="values-title" className="abt-section-title">Our Core Values</h2></div>
          <div className="abt-values-grid">
            <div className="abt-value-card"><div className="abt-value-title">🎭 Radical Anonymity</div><p className="abt-text" style={{ fontSize: '15px' }}>We believe true vulnerability requires safety. Real names are never used here.</p></div>
            <div className="abt-value-card" style={{ borderTopColor: 'var(--lavender)' }}><div className="abt-value-title">⚖️ Zero Judgment</div><p className="abt-text" style={{ fontSize: '15px' }}>We provide a space free from toxic positivity and comparison. Every feeling is valid.</p></div>
            <div className="abt-value-card" style={{ borderTopColor: 'var(--peach)' }}><div className="abt-value-title">🛡️ Proactive, Not Reactive</div><p className="abt-text" style={{ fontSize: '15px' }}>We don't wait for a breaking point. We provide early-intervention tools for daily emotional regulation.</p></div>
            <div className="abt-value-card" style={{ borderTopColor: 'var(--sky)' }}><div className="abt-value-title">🧩 Holistic Potential</div><p className="abt-text" style={{ fontSize: '15px' }}>A student is more than their marks. We champion neurodiversity and provide tailored SEN resources so every mind can thrive.</p></div>
          </div>
        </section>

        <section className="abt-impact" aria-labelledby="impact-title">
          <span className="abt-eyebrow">Global Impact</span>
          <h2 id="impact-title" className="abt-section-title">Aligned with the UN SDGs</h2>
          <p className="abt-text">Secret Sharz is proud to align our mission with the United Nations Sustainable Development Goals (SDGs) by democratizing access to psychological first aid and foundational career discovery for all youth.</p>
          <div className="abt-sdg-tags">
            <span className="abt-sdg">🏥 SDG 3: Good Health & Well-being</span>
            <span className="abt-sdg">📚 SDG 4: Quality Education</span>
            <span className="abt-sdg">💼 SDG 8: Decent Work & Economic Growth</span>
          </div>
          <div className="abt-cta-box">
            <h2 className="abt-cta-h2">Don&apos;t keep it a secret. <br/><span style={{ color: 'var(--sage-light)' }}>S.H.A.R.E. it, heal, and own your future.</span></h2>
            <div className="abt-btn-group">
              <button className="abt-btn abt-btn-primary" type="button" onClick={() => navigate && navigate('/auth')}>Join the Safe Space Today →</button>
              <button className="abt-btn abt-btn-secondary" type="button" onClick={() => window.location.href = "mailto:antonio.antonio.noronha@gmail.com?subject=School Partnership Inquiry"}>Partner With Us (For Schools)</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
