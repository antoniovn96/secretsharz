import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const TEMPLATE_CSS = `
  /* Interactive Top Bar */
  .post-top-bar { position: sticky; top: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid var(--border); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
  .reading-progress-container { position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: transparent; }
  .reading-progress-bar { height: 100%; background: var(--sage); width: 0%; transition: width 0.1s ease-out; }
  
  .post-actions { display: flex; gap: 12px; }
  .action-icon-btn { background: var(--sage-pale); border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sage); font-size: 16px; cursor: pointer; transition: all 0.2s; }
  .action-icon-btn:hover { background: var(--sage); color: white; transform: translateY(-2px); }

  /* Body Text Resizing */
  .post-body.text-normal { font-size: 18px; line-height: 1.8; }
  .post-body.text-large { font-size: 22px; line-height: 1.9; }

  /* Helpful Reaction */
  .reaction-box { margin-top: 60px; padding: 30px; border: 2px dashed var(--border); border-radius: var(--r-md); text-align: center; background: white; transition: all 0.3s; }
  .reaction-box.thank-you { background: var(--sage-pale); border-color: var(--sage-light); border-style: solid; }
  .reaction-btns { display: flex; justify-content: center; gap: 16px; margin-top: 16px; }
  .react-btn { padding: 10px 24px; border-radius: 50px; border: 1.5px solid var(--border); background: white; cursor: pointer; font-weight: 600; font-family: inherit; color: var(--ink); transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
  .react-btn:hover { background: var(--sage-pale); border-color: var(--sage); color: var(--sage); }

  .post-tldr { background: var(--lav-pale); padding: 20px 24px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid var(--lavender); }
  .post-tldr h4 { margin: 0 0 8px 0; color: var(--ink); font-family: 'Fraunces', serif; }
  .post-tldr p { margin: 0; font-size: 15px; color: var(--ink-soft); line-height: 1.6; }
`;

export default function BlogPostTemplate({ meta, navigate, children }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTextLarge, setIsTextLarge] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [copied, setCopied] = useState(false);

  // Inject Template CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = TEMPLATE_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Calculate Reading Progress
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(scroll * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="blog-page" style={{ padding: '0', background: 'white' }}>
      
      {/* SEO METADATA */}
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={meta.imgUrl} />
        <meta property="og:type" content="article" />
      </Head>

      {/* INTERACTIVE TOP BAR */}
      <div className="post-top-bar">
        <button className="back-to-blog" style={{ margin: 0 }} onClick={() => navigate('/blog')}>
          ← Back
        </button>
        <div className="post-actions">
          <button 
            className="action-icon-btn" 
            title="Adjust Text Size"
            onClick={() => setIsTextLarge(!isTextLarge)}
          >
            Aa
          </button>
          <button 
            className="action-icon-btn" 
            title="Copy Link to Share"
            onClick={handleCopyLink}
          >
            {copied ? '✓' : '🔗'}
          </button>
        </div>
        <div className="reading-progress-container">
          <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <div className="post-view">
        <div className="post-content" style={{ marginTop: '20px' }}>
          <span className="blog-tag">{meta.category}</span>
          <h1 style={{ letterSpacing: '-1.5px' }}>{meta.title}</h1>
          
          <div className="post-full-meta">
            <span>📅 {meta.date}</span>
            <span>⏱️ {meta.readTime}</span>
          </div>
          
          {meta.imgUrl && (
            <img src={meta.imgUrl} alt={meta.title} className="post-hero-img" />
          )}

          {/* Quick Summary / TL;DR Box (if you add 'tldr' to your meta object) */}
          {meta.tldr && (
            <div className="post-tldr">
              <h4>Quick Summary 💡</h4>
              <p>{meta.tldr}</p>
            </div>
          )}
          
          {/* Dynamic Font Sizing for Accessibility */}
          <div className={`post-body ${isTextLarge ? 'text-large' : 'text-normal'}`}>
            {children}
          </div>

          {/* INTERACTIVE REACTION BOX */}
          <div className={`reaction-box ${reaction ? 'thank-you' : ''}`}>
            {reaction ? (
              <>
                <h3 style={{ fontFamily: 'Fraunces', color: 'var(--sage)', margin: '0 0 10px 0' }}>Thank you for your feedback! 💚</h3>
                <p style={{ margin: 0, color: 'var(--ink-soft)' }}>We're glad to know how this article impacted you.</p>
              </>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Fraunces', margin: '0 0 10px 0' }}>Was this article helpful?</h3>
                <div className="reaction-btns">
                  <button className="react-btn" onClick={() => setReaction('yes')}>👍 Yes, it helped</button>
                  <button className="react-btn" onClick={() => setReaction('no')}>👎 Needs work</button>
                </div>
              </>
            )}
          </div>

          {/* CTA Footer */}
          <div style={{ marginTop: '30px', padding: '30px', background: 'var(--sage-pale)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
             <h3 style={{ margin: '0 0 10px 0', fontFamily: 'Fraunces', color: 'var(--ink)' }}>Need to talk?</h3>
             <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--ink-soft)' }}>Our safe space is always open. Connect anonymously.</p>
             <button onClick={() => navigate('/wall')} style={{ background: 'var(--sage)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>Visit Sharz Wall</button>
          </div>

        </div>
      </div>
    </div>
  );
}
