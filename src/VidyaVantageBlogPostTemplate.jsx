import React, { useState, useEffect, useRef } from 'react';

const VV_TEMPLATE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --saffron: #E8650A; --gold: #F0A500; --teal: #0A5C63;
    --cream: #FDF6EC; --parchment: #F5EDD8; --dark: #1C1208;
    --brown: #3D2205; --muted: #7A6248; --border: #E8DFD1;
  }

  .vv-blog-page { min-height: 100vh; background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--dark); padding-bottom: 80px; transition: background 0.3s; }
  
  /* ── Top Bar ── */
  .vv-post-top-bar { position: sticky; top: 0; background: rgba(253,246,236,0.95); backdrop-filter: blur(12px); z-index: 200; border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; justify-content: space-between; align-items: center; height: 56px; }
  .vv-reading-progress-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--border); }
  .vv-reading-progress-bar { height: 100%; background: linear-gradient(90deg, var(--saffron), var(--gold)); transition: width 0.1s linear; }
  .vv-post-back-btn { display: inline-flex; align-items: center; gap: 6px; color: var(--brown); font-weight: 700; font-size: 14px; cursor: pointer; border: none; background: transparent; font-family: inherit; padding: 0; transition: color 0.2s; }
  .vv-post-back-btn:hover { color: var(--saffron); }
  
  .vv-reading-time-pill { font-size: 12px; color: var(--brown); font-weight: 700; background: var(--parchment); padding: 6px 14px; border-radius: 50px; }

  /* ── Article Layout ── */
  .vv-post-view { max-width: 760px; margin: 0 auto; padding: 0 24px; }
  .vv-post-content { margin-top: 40px; }
  .vv-blog-tag { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; background: rgba(232,101,10,0.1); color: var(--saffron); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
  
  .vv-post-content h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 48px); color: var(--dark); line-height: 1.15; margin-bottom: 20px; }
  .vv-post-full-meta { display: flex; gap: 20px; font-size: 14px; color: var(--muted); margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); font-weight: 600; }
  .vv-post-hero-img { width: 100%; height: 360px; object-fit: cover; border-radius: 16px; margin-bottom: 32px; box-shadow: 0 8px 24px rgba(28,18,8,0.08); border: 1px solid var(--border); }

  /* ── Post Body ── */
  .vv-post-body { font-size: 17px; line-height: 1.85; color: var(--brown); }
  .vv-post-body p { margin-bottom: 20px; }
  .vv-post-body h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--dark); margin: 40px 0 16px; line-height: 1.2; }
  .vv-post-body h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--dark); margin: 32px 0 12px; }
  .vv-post-body strong { color: var(--dark); }
  .vv-post-body blockquote { border-left: 4px solid var(--saffron); padding: 16px 20px; background: var(--parchment); border-radius: 0 12px 12px 0; margin: 24px 0; font-style: italic; color: var(--brown); font-family: 'Playfair Display', serif; font-size: 19px; }
  .vv-post-body ul { padding-left: 20px; margin-bottom: 20px; }
  .vv-post-body li { padding: 4px 0; }

  /* ── TLDR & TOC ── */
  .vv-post-tldr { background: var(--parchment); padding: 20px 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid rgba(232,101,10,0.2); }
  .vv-post-tldr h4 { margin: 0 0 8px; color: var(--saffron); font-family: 'Playfair Display', serif; font-size: 18px; }
  
  .vv-toc-box { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
  .vv-toc-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 12px; }
  .vv-toc-list { list-style: none; padding: 0; margin: 0; }
  .vv-toc-item { padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
  .vv-toc-item:last-child { border-bottom: none; }
  .vv-toc-link { font-size: 14px; color: var(--brown); cursor: pointer; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
  .vv-toc-link:hover, .vv-toc-link.active { color: var(--saffron); font-weight: 700; }
  .vv-toc-link.h3-item { padding-left: 16px; font-size: 13px; }

  /* ── CTA Footer ── */
  .vv-cta-footer-box { margin-top: 60px; padding: 40px; background: linear-gradient(135deg, var(--dark), var(--brown)); border-radius: 20px; text-align: center; color: white; box-shadow: 0 12px 32px rgba(28,18,8,0.15); }
  .vv-cta-footer-box h3 { font-family: 'Playfair Display', serif; font-size: 26px; margin: 0 0 12px; color: white; }
  .vv-cta-footer-box p { font-size: 15px; color: rgba(255,255,255,0.7); margin: 0 0 24px; }
  .vv-btn-primary { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 14px 28px; border-radius: 50px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(232,101,10,0.3); }
  .vv-btn-primary:hover { transform: translateY(-2px); }
  .vv-btn-outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 12px 24px; border-radius: 50px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; font-family: 'DM Sans', sans-serif; }
  .vv-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: white; }

  @media(max-width: 768px) {
    .vv-post-hero-img { height: 220px; }
    .vv-cta-footer-box { padding: 32px 20px; }
  }
`;

function TableOfContents({ toc, activeId }) {
  if (!toc || toc.length === 0) return null;
  return (
    <div className="vv-toc-box">
      <div className="vv-toc-title">📋 In this article</div>
      <ul className="vv-toc-list">
        {toc.map(item => (
          <li key={item.id} className="vv-toc-item">
            <a
              className={`vv-toc-link ${item.level === 3 ? 'h3-item' : ''} ${activeId === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {activeId === item.id ? '→' : '•'} {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useReadingProgress(bodyRef) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalH = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = totalH > 0 ? Math.min(100, (scrolled / totalH) * 100) : 0;
      setProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bodyRef]);
  return progress;
}

export default function VidyaVantageBlogPostTemplate({ meta, navigate, children }) {
  const safeMeta = meta || {};
  const toc = safeMeta.toc || [];
  const bodyRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = VV_TEMPLATE_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const prev = document.title;
    if (safeMeta.title) document.title = `${safeMeta.title} | VidyaVantage`;
    return () => { document.title = prev; };
  }, [safeMeta.title]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const progress = useReadingProgress(bodyRef);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    toc.forEach(item => { const el = document.getElementById(item.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [toc]);

  return (
    <div className="vv-blog-page">
      <div className="vv-post-top-bar">
        <button className="vv-post-back-btn" onClick={() => navigate('/vidyavantage/blog')}>← Back to Career Insights</button>
        <span className="vv-reading-time-pill">⏱ {safeMeta.readTime || '5 min read'}</span>
        <div className="vv-reading-progress-container">
          <div className="vv-reading-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="vv-post-view">
        <div className="vv-post-content">
          {safeMeta.category && <span className="vv-blog-tag">{safeMeta.category}</span>}
          <h1>{safeMeta.title}</h1>

          <div className="vv-post-full-meta">
            <span>📅 {safeMeta.date}</span>
            <span>📝 {safeMeta.wordCount} words</span>
          </div>

          {safeMeta.imgUrl && (
            <img src={safeMeta.imgUrl} alt={safeMeta.title} className="vv-post-hero-img" />
          )}

          {safeMeta.tldr && (
            <div className="vv-post-tldr">
              <h4>Quick Summary 💡</h4>
              <p style={{margin:0}}>{safeMeta.tldr}</p>
            </div>
          )}

          <TableOfContents toc={toc} activeId={activeId} />

          <div ref={bodyRef} className="vv-post-body">
            {children}
          </div>

          <div className="vv-cta-footer-box">
            <h3>Ready to find your true path?</h3>
            <p>Stop guessing your future. Take the 25-minute AI assessment to unlock your personalized career roadmap.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="vv-btn-primary" onClick={() => navigate('/vidyavantage')}>Take Free Assessment →</button>
              <button className="vv-btn-outline" onClick={() => navigate('/vidyavantage')}>Explore Careers</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
