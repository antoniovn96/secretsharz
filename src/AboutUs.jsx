import React, { useEffect } from 'react';
import Head from 'next/head';

const PAGE_CSS = `
  :root {
    --abt-ink:#17231d; --abt-text:#33443a; --abt-muted:#68766d; --abt-green:#2E6B4A;
    --abt-deep:#17352A; --abt-pale:#EBF4EE; --abt-cream:#F8F6F1; --abt-line:#DCE4DE;
    --abt-white:#FDFCFA; --abt-gold:#A38355; --abt-blue:#5B8CA7; --abt-lav:#7D7695;
  }
  .abt-page{min-height:100vh;background:var(--abt-white);color:var(--abt-ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .abt-page *{box-sizing:border-box}.abt-page button{font:inherit}
  .abt-shell{width:min(1240px,100%);margin:auto}
  .abt-topbar{height:60px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;background:var(--abt-ink);color:#fff;border-bottom:2px solid #4F8A66;position:sticky;top:0;z-index:20}
  .abt-back{border:0;background:transparent;color:rgba(255,255,255,.78);font-weight:800;cursor:pointer}.abt-back:hover{color:#fff}
  .abt-topbar-title{font-family:Fraunces,serif;font-size:17px}.abt-top-spacer{width:110px}
  .abt-hero{padding:105px 6vw 95px;background:linear-gradient(135deg,#FDFCFA 0%,#F2F6F0 100%);text-align:center}
  .abt-eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.14em;font-weight:900;color:var(--abt-green);margin:0 0 14px}
  .abt-hero h1,.abt-section h2,.abt-cta h2{font-family:Fraunces,serif;letter-spacing:-.04em;line-height:1.05}
  .abt-hero h1{font-size:clamp(46px,7vw,78px);max-width:1000px;margin:0 auto 24px}.abt-hero h1 em{color:var(--abt-green);font-style:italic}
  .abt-lead{max-width:900px;margin:0 auto;font-size:20px;line-height:1.7;color:var(--abt-text)}
  .abt-section{padding:95px 6vw}.abt-section h2{font-size:clamp(36px,4.5vw,58px);margin:0 0 22px}.abt-text{font-size:16px;line-height:1.75;color:var(--abt-text);margin:0 0 16px}
  .abt-story{display:grid;grid-template-columns:1.05fr .95fr;gap:70px;align-items:center}
  .abt-founder-card{background:var(--abt-ink);color:#fff;border-radius:30px;padding:38px;box-shadow:0 20px 55px rgba(30,55,42,.10)}
  .abt-founder-card blockquote{font-family:Fraunces,serif;font-size:25px;line-height:1.35;margin:0 0 26px}.abt-founder-card strong{color:#B9D6C2}.abt-founder-meta{color:rgba(255,255,255,.67);font-size:13px;line-height:1.55}
  .abt-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px}
  .abt-card,.abt-cap-card,.abt-value,.abt-trust-card{background:#fff;border:1px solid var(--abt-line);border-radius:22px;padding:28px;box-shadow:0 8px 25px rgba(30,55,42,.05)}
  .abt-card h3,.abt-cap-card h3,.abt-value h3{font-family:Fraunces,serif;font-size:26px;margin:0 0 10px}.abt-card p,.abt-trust-card p,.abt-value p{color:var(--abt-muted);line-height:1.6;margin:0}
  .abt-card .abt-chip{display:inline-block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;color:var(--abt-green);background:var(--abt-pale);padding:7px 10px;border-radius:999px;margin-bottom:14px}
  .abt-journey{background:var(--abt-deep);color:#fff;padding:105px 6vw}.abt-journey-inner{display:grid;grid-template-columns:.9fr 1.1fr;gap:80px;align-items:center}.abt-journey h2{color:#fff}.abt-journey .abt-eyebrow{color:#B9D6C2}.abt-journey .abt-text{color:rgba(255,255,255,.78)}
  .abt-journey-model{display:flex;flex-wrap:wrap;gap:12px}.abt-node{padding:14px 17px;border:1px solid rgba(255,255,255,.17);background:rgba(255,255,255,.055);border-radius:16px;font-weight:800}.abt-node.arrow{border:0;background:transparent;color:#9BC5A8;padding-left:2px;padding-right:2px}
  .abt-capabilities{background:var(--abt-cream)}.abt-cap-card ul{margin:0;padding-left:20px;color:var(--abt-muted);line-height:1.7}
  .abt-value{border-top:4px solid var(--abt-green)}.abt-trust{background:#F4F6F1}.abt-trust-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:38px}.abt-trust-card h3{font-size:17px;margin:0 0 8px}
  .abt-cta{padding:110px 6vw;text-align:center;background:linear-gradient(135deg,#FDFCFA,#EBF4EE)}.abt-cta h2{font-size:clamp(38px,5vw,62px);max-width:850px;margin:0 auto 20px}.abt-cta p{max-width:700px;margin:0 auto 28px;color:var(--abt-muted);font-size:18px;line-height:1.6}
  .abt-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.abt-btn{border-radius:14px;padding:14px 21px;cursor:pointer;font-weight:850;border:2px solid transparent}.abt-primary{background:var(--abt-green);color:#fff}.abt-secondary{background:#fff;color:var(--abt-deep);border-color:#B8C6BD}.abt-btn:focus-visible{outline:3px solid #1F6B46;outline-offset:4px}
  @media(max-width:1050px){.abt-story,.abt-journey-inner{grid-template-columns:1fr}.abt-grid-4{grid-template-columns:repeat(2,1fr)}.abt-trust-grid{grid-template-columns:1fr}.abt-top-spacer{display:none}}
  @media(max-width:650px){.abt-topbar{padding:0 20px}.abt-section,.abt-journey,.abt-hero,.abt-cta{padding-left:20px;padding-right:20px}.abt-grid-4{grid-template-columns:1fr}.abt-hero{padding-top:75px}.abt-lead{font-size:17px}.abt-actions{flex-direction:column}.abt-btn{width:100%}}
  @media(prefers-reduced-motion:reduce){.abt-page *{scroll-behavior:auto!important;transition:none!important}}
`;

export default function AboutUs({ navigate }) {
  useEffect(() => {
    const s = document.createElement("style"); s.textContent = PAGE_CSS; document.head.appendChild(s);
    window.scrollTo(0,0); return () => document.head.removeChild(s);
  }, []);

  const go = (path) => navigate && navigate(path);

  return (
    <>
      <Head>
        <title>About Secret Sharz | A Lifelong Human Journey</title>
        <meta name="description" content="Learn what Secret Sharz is, why it exists, and how one lifelong identity can connect support, learning, wellbeing, career direction, relationships and opportunity." />
      </Head>

      <div className="abt-page">
        <div className="abt-topbar">
          <button className="abt-back" onClick={() => go('/')}>← Back to Home</button>
          <div className="abt-topbar-title">About Secret Sharz</div>
          <div className="abt-top-spacer" />
        </div>

        <header className="abt-hero">
          <div className="abt-shell">
            <p className="abt-eyebrow">About Secret Sharz</p>
            <h1>A lifelong place to understand yourself, find support, and <em>move forward.</em></h1>
            <p className="abt-lead">Secret Sharz brings wellbeing, education, career direction, learning, relationships and opportunity together around one person and one continuing Journey.</p>
          </div>
        </header>

        <section className="abt-section">
          <div className="abt-shell abt-story">
            <div>
              <p className="abt-eyebrow">Why we exist</p>
              <h2>People are more than the problem they arrive with.</h2>
              <p className="abt-text">Secret Sharz grew from real conversations with students and the recognition that emotional wellbeing and future direction are deeply connected. Someone may arrive needing support, trying to understand themselves, exploring a career, looking for learning, or simply unsure what to do next.</p>
              <p className="abt-text">We want the experience to begin with the person — not with an organisational department, product category or diagnosis. You can start where you are and move between different kinds of support as your circumstances change.</p>
              <p className="abt-text"><strong>Our ambition is not to tell people who they should become. It is to help them understand themselves, see possibilities, and take the next step with greater clarity.</strong></p>
            </div>
            <aside className="abt-founder-card">
              <blockquote>“We started by listening — and built a platform designed to keep listening as people grow.”</blockquote>
              <div><strong>Antonio Vian Noronha</strong></div>
              <div className="abt-founder-meta">Founder, Secret Sharz<br/>MSW, Medical & Psychiatric Social Work<br/>Former School Counsellor</div>
            </aside>
          </div>
        </section>

        <section className="abt-section">
          <div className="abt-shell">
            <p className="abt-eyebrow">One ecosystem, many entry points</p>
            <h2>Different needs. One human story.</h2>
            <p className="abt-text" style={{maxWidth:820}}>Secret Sharz is designed as a connected ecosystem where specialist experiences can coexist without pretending they are the same thing.</p>
            <div className="abt-grid-4">
              {[
                ['Care & Support','Counselling, psychology, wellbeing, specialist support and guided pathways.'],
                ['SEN & Inclusive Learning','Support for learners and families, with multidisciplinary collaboration and role-aware access.'],
                ['VidyaVantage','Career discovery beyond a single test: assessment, career exploration, skills, courses, colleges, scholarships, projects, internships, jobs, mentors and continued development.'],
                ['Learning & Knowledge','Courses, resources, learning experiences, communities and a learning history that can continue across life stages.'],
                ['Relationships','Parents, guardians, mentors, professionals and educators — each with contextual access.'],
                ['Institutions & Employers','Schools, colleges, universities, organisations and employers can work with Secret Sharz without owning a person’s lifelong identity.'],
                ['Professional Ecosystem','Role-aware professional experiences, credentials, verification, workspaces, professional services and a user-controlled Professional Card.'],
                ['Opportunities & Community','User-controlled opportunity discovery and governed adult community experiences, alongside protected experiences for younger users.'],
              ].map(([title,text],i)=>(
                <article className="abt-card" key={title}><span className="abt-chip">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="abt-journey">
          <div className="abt-shell abt-journey-inner">
            <div>
              <p className="abt-eyebrow">My Journey</p>
              <h2>Your story stays connected as life changes.</h2>
              <p className="abt-text">My Journey is the centre of the authenticated Secret Sharz experience. It can hold meaningful continuity across goals, activities, reflections, growth, career exploration, learning, opportunities, relationships, achievements and transitions — while confidential professional, clinical and other restricted records remain appropriately separate.</p>
              <p className="abt-text">Continuity does not mean unrestricted visibility. Access depends on role, relationship, purpose, consent or authority, sensitivity and context.</p>
            </div>
            <div className="abt-journey-model" aria-label="Secret Sharz core model">
              <span className="abt-node">Person</span><span className="abt-node arrow">→</span>
              <span className="abt-node">Lifelong Identity</span><span className="abt-node arrow">→</span>
              <span className="abt-node">Journey</span><span className="abt-node arrow">→</span>
              <span className="abt-node">Relationships</span><span className="abt-node arrow">→</span>
              <span className="abt-node">Goals</span><span className="abt-node arrow">→</span>
              <span className="abt-node">Next Steps</span>
            </div>
          </div>
        </section>

        <section className="abt-section abt-capabilities">
          <div className="abt-shell">
            <p className="abt-eyebrow">What Secret Sharz brings together</p>
            <h2>Support, discovery, learning and opportunity — in one place.</h2>
            <div className="abt-grid-4">
              {[
                ['Understand yourself',['Reflection and self-understanding','Assessments and structured exploration','Accessible learning and resources']],
                ['Get the right support',['Counselling and psychology','SEN and inclusive support','Guided human handoff and Urgent Help pathways']],
                ['Plan your future',['VidyaVantage career exploration','Career assessment and integrated intelligence','Courses, colleges, scholarships and projects']],
                ['Keep developing',['Internships, jobs and mentors','Professional development and opportunities','Growth, contribution and learning history']],
              ].map(([title,items])=>(
                <article className="abt-cap-card" key={title}><h3>{title}</h3><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></article>
              ))}
            </div>
          </div>
        </section>

        <section className="abt-section">
          <div className="abt-shell">
            <p className="abt-eyebrow">Professional and learning life</p>
            <h2>Support can grow with you.</h2>
            <div className="abt-grid-4">
              {[
                ['Learning','Courses may be self-paced, live or hybrid, with learning records, certificates and detailed transcripts.'],
                ['Mentoring','Governed mentor relationships can support exploration, learning, development and opportunity.'],
                ['Professional identity','A user-controlled Professional Card can represent selected professional evidence without turning the platform into a public social résumé.'],
                ['Opportunity','Adults can control discovery through Open to Opportunities and other visibility settings.'],
              ].map(([title,text])=><article className="abt-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="abt-section abt-values">
          <div className="abt-shell">
            <p className="abt-eyebrow">What guides us</p>
            <h2>The principles behind the platform.</h2>
            <div className="abt-grid-4">
              {[
                ['Person before product','We begin with the human need, not the product category.'],
                ['Human agency','Technology can support decisions; it should not live a person’s life for them.'],
                ['Specialist expertise','Counselling, psychology, SEN, career guidance and professional services remain distinct areas of expertise.'],
                ['Continuity with boundaries','A connected Journey should never mean that everyone gets access to everything.'],
                ['Evidence over identity','Assessment can reveal patterns and possibilities. It does not define who someone is.'],
                ['Sponsored is not verified','Commercial support can improve access or visibility; it does not buy truth or recommendation.'],
                ['AI supports people','AI can explore, reflect, learn, plan, prepare, find, connect, support and create within permission and safeguarding boundaries.'],
                ['Growth, not a scoreboard','Progress is about capability, confidence, understanding and meaningful next steps — not a ranking of human worth.'],
              ].map(([title,text])=><article className="abt-value" key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="abt-section abt-trust">
          <div className="abt-shell">
            <p className="abt-eyebrow">Trust and safety</p>
            <h2>Your privacy is part of the experience.</h2>
            <div className="abt-trust-grid">
              <article className="abt-trust-card"><h3>Contextual access</h3><p>Parents, schools, professionals, employers and other relationships do not automatically unlock private information.</p></article>
              <article className="abt-trust-card"><h3>Protected younger users</h3><p>Under-18 experiences have stronger boundaries around discovery, community, communication and safeguarding.</p></article>
              <article className="abt-trust-card"><h3>Responsible AI</h3><p>AI is clearly identified, uses minimum necessary authorised context, cannot expand permissions and does not replace human professional responsibility.</p></article>
              <article className="abt-trust-card"><h3>Evidence and provenance</h3><p>Professional credentials, institutional information and assessment evidence have distinct meanings and verification states.</p></article>
              <article className="abt-trust-card"><h3>Stewardship of personal data</h3><p>Secret Sharz is designed around protecting personal information rather than treating sensitive data as a product to sell.</p></article>
              <article className="abt-trust-card"><h3>Accessible by design</h3><p>Accessibility, understandable communication, language support and inclusive experiences are part of the product itself.</p></article>
            </div>
          </div>
        </section>

        <section className="abt-cta">
          <div className="abt-shell">
            <p className="abt-eyebrow">Whenever you are ready</p>
            <h2>You do not need to have everything figured out before you arrive.</h2>
            <p>Start with support, self-understanding, career direction, learning or simply the question you have today. Secret Sharz is designed to grow with you.</p>
            <div className="abt-actions">
              <button className="abt-btn abt-primary" onClick={() => go('/auth')}>Start with Secret Sharz →</button>
              <button className="abt-btn abt-secondary" onClick={() => go('/vidyavantage')}>Explore VidyaVantage</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
