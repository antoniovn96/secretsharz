import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

const TEMPLATE_CSS = `
  /* ── Top Bar ─────────────────────────────────────────────────────── */
  .post-top-bar { position: sticky; top: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 200; border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; justify-content: space-between; align-items: center; height: 56px; }
  .reading-progress-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--border); }
  .reading-progress-bar { height: 100%; background: linear-gradient(90deg, var(--sage), var(--sage-light)); transition: width 0.1s linear; }
  .post-back-btn { display: inline-flex; align-items: center; gap: 6px; color: var(--sage); font-weight: 600; font-size: 14px; cursor: pointer; border: none; background: transparent; font-family: inherit; padding: 0; transition: color 0.2s; white-space: nowrap; }
  .post-back-btn:hover { color: var(--moss); }
  .post-actions { display: flex; gap: 8px; align-items: center; }
  .action-icon-btn { background: var(--sage-pale); border: none; height: 36px; border-radius: 50px; display: flex; align-items: center; justify-content: center; color: var(--sage); font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; padding: 0 12px; gap: 5px; font-family: inherit; }
  .action-icon-btn:hover { background: var(--sage); color: white; transform: translateY(-1px); }
  .action-icon-btn.reading-mode-on { background: var(--ink); color: var(--sage-light); }
  .reading-time-pill { font-size: 12px; color: var(--muted); font-weight: 600; white-space: nowrap; background: var(--sand); padding: 6px 14px; border-radius: 50px; display: flex; align-items: center; gap: 5px; }
  .reading-time-pill.urgent { color: var(--sage); background: var(--sage-pale); }

  /* ── Reading Mode (Dark Mode) FIXED ──────────────────────────────── */
  .blog-page.reading-mode { 
    /* We swap the CSS variables so everything updates automatically */
    --ink: #f0ece4; 
    --ink-soft: #c8c0b4; 
    --muted: #a09a94; 
    --border: #333333; 
    --sand: #222222;
    --sage-pale: rgba(74,124,89,0.15);
    --lav-pale: rgba(124,111,160,0.15);
    background: #1a1a1a !important; 
  }
  .blog-page.reading-mode .post-view { background: #1a1a1a; }
  .blog-page.reading-mode .post-content h1 { color: var(--ink) !important; }
  
  /* Explicit overrides for high-specificity tags */
  .blog-page.reading-mode .post-body, 
  .blog-page.reading-mode .post-body p, 
  .blog-page.reading-mode .post-body li,
  .blog-page.reading-mode .post-body blockquote { color: var(--ink-soft) !important; }
  
  .blog-page.reading-mode .post-body h2, 
  .blog-page.reading-mode .post-body h3 { color: var(--ink) !important; }
  .blog-page.reading-mode .post-body blockquote { background: var(--sand) !important; }
  .blog-page.reading-mode .post-top-bar { background: rgba(26,26,26,0.98) !important; }
  .blog-page.reading-mode .post-tldr { background: var(--sand) !important; }
  
  /* Containers & Cards */
  .blog-page.reading-mode .reaction-box, 
  .blog-page.reading-mode .cta-footer-box,
  .blog-page.reading-mode .related-card,
  .blog-page.reading-mode .toc-box { background: var(--sand) !important; border-color: var(--border) !important; }
  
  /* Buttons */
  .blog-page.reading-mode .react-btn,
  .blog-page.reading-mode .share-btn { background: #2a2a2a !important; color: var(--ink-soft) !important; border-color: #444 !important; }
  
  /* Titles in widgets */
  .blog-page.reading-mode .reaction-box h3,
  .blog-page.reading-mode .cta-footer-box h3,
  .blog-page.reading-mode .related-title,
  .blog-page.reading-mode .related-card-title { color: var(--ink) !important; }
  
  /* Table of Contents */
  .blog-page.reading-mode .toc-title { color: var(--muted) !important; }
  .blog-page.reading-mode .toc-link { color: var(--ink-soft) !important; }
  .blog-page.reading-mode .toc-item { border-bottom-color: var(--border) !important; }
  .blog-page.reading-mode .share-label { color: var(--muted) !important; }

  /* ── Article Layout ──────────────────────────────────────────────── */
  .post-view { max-width: 760px; margin: 0 auto; padding: 0 24px 80px; transition: background 0.3s; }
  .post-content { margin-top: 32px; }
  .post-tag-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .blog-tag { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; background: var(--sage-pale); color: var(--sage); text-transform: uppercase; letter-spacing: 0.5px; }
  .post-content h1 { font-family: 'Fraunces', serif; font-size: clamp(30px, 5vw, 46px); color: var(--ink); line-height: 1.15; margin-bottom: 20px; letter-spacing: -1px; transition: color 0.3s; }
  .post-full-meta { display: flex; gap: 20px; font-size: 14px; color: var(--muted); margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); font-weight: 500; flex-wrap: wrap; transition: color 0.3s, border-color 0.3s; }
  .post-hero-img { width: 100%; height: 360px; object-fit: cover; border-radius: var(--r-md); margin-bottom: 32px; box-shadow: var(--shadow-md); border: 1px solid var(--border); }

  /* TL;DR */
  .post-tldr { background: var(--lav-pale); padding: 18px 22px; border-radius: 14px; margin-bottom: 28px; border-left: 4px solid var(--lavender); transition: background 0.3s, border-color 0.3s; }
  .post-tldr h4 { margin: 0 0 6px; color: var(--ink); font-family: 'Fraunces', serif; font-size: 15px; }
  .post-tldr p { margin: 0; font-size: 14px; color: var(--ink-soft); line-height: 1.65; }

  /* ── Table of Contents ───────────────────────────────────────────── */
  .toc-box { background: var(--sand); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; margin-bottom: 32px; }
  .toc-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .toc-list { list-style: none; padding: 0; margin: 0; }
  .toc-item { padding: 5px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .toc-item:last-child { border-bottom: none; }
  .toc-link { font-size: 14px; color: var(--ink-soft); cursor: pointer; font-weight: 500; transition: color 0.2s; display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .toc-link:hover { color: var(--sage); }
  .toc-link.active { color: var(--sage); font-weight: 700; }
  .toc-link.h3-item { padding-left: 16px; font-size: 13px; }
  .toc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); flex-shrink: 0; opacity: 0; transition: opacity 0.2s; }
  .toc-link.active .toc-dot { opacity: 1; }

  /* ── Post Body ───────────────────────────────────────────────────── */
  .post-body { transition: font-size 0.2s, color 0.3s; }
  .post-body.text-normal { font-size: 17px; line-height: 1.85; }
  .post-body.text-large { font-size: 20px; line-height: 1.9; }
  .post-body p { color: var(--ink-soft); margin-bottom: 20px; }
  .post-body h2 { font-family: 'Fraunces', serif; font-size: 26px; color: var(--ink); margin: 40px 0 14px; line-height: 1.2; }
  .post-body h3 { font-family: 'Fraunces', serif; font-size: 21px; color: var(--ink); margin: 32px 0 12px; }
  .post-body strong { color: var(--ink); }
  .post-body blockquote { border-left: 4px solid var(--sage); padding: 12px 20px; background: var(--sage-pale); border-radius: 0 10px 10px 0; margin: 24px 0; font-style: italic; color: var(--ink-soft); }
  .post-body ul { padding-left: 20px; margin-bottom: 20px; }
  .post-body li { padding: 4px 0; color: var(--ink-soft); }
  .post-body a { color: var(--sage); font-weight: 600; }

  /* ── Reaction Box ────────────────────────────────────────────────── */
  .reaction-box { margin-top: 60px; padding: 28px; border: 2px dashed var(--border); border-radius: var(--r-md); text-align: center; background: white; transition: all 0.4s; }
  .reaction-box.thank-you { background: var(--sage-pale); border: 2px solid var(--sage-light); border-style: solid; }
  .reaction-box h3 { font-family: 'Fraunces', serif; margin: 0 0 8px; }
  .reaction-box p { margin: 0; font-size: 14px; color: var(--muted); }
  .reaction-btns { display: flex; justify-content: center; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
  .react-btn { padding: 10px 22px; border-radius: 50px; border: 1.5px solid var(--border); background: white; cursor: pointer; font-weight: 600; font-family: inherit; color: var(--ink); transition: all 0.2s; display: flex; align-items: center; gap: 8px; font-size: 14px; }
  .react-btn:hover { background: var(--sage-pale); border-color: var(--sage); color: var(--sage); }

  /* ── CTA Footer ──────────────────────────────────────────────────── */
  .cta-footer-box { margin-top: 32px; padding: 28px; background: var(--sage-pale); border-radius: var(--r-md); text-align: center; transition: background 0.3s; }
  .cta-footer-box h3 { font-family: 'Fraunces', serif; margin: 0 0 8px; color: var(--ink); }
  .cta-footer-box p { font-size: 14px; color: var(--muted); margin: 0 0 16px; }

  /* ── Share Bar ───────────────────────────────────────────────────── */
  .share-bar { margin-top: 32px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .share-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-right: 4px; }
  .share-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 50px; border: 1.5px solid var(--border); background: white; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; color: var(--ink-soft); }
  .share-btn:hover { transform: translateY(-2px); }
  .share-btn.facebook:hover { background: #1877F2; border-color: #1877F2; color: white; }
  .share-btn.twitter:hover { background: #000000; border-color: #000000; color: white; }
  .share-btn.linkedin:hover { background: #0A66C2; border-color: #0A66C2; color: white; }
  .share-btn.pinterest:hover { background: #E60023; border-color: #E60023; color: white; }
  .share-btn.whatsapp:hover { background: #25D366; border-color: #25D366; color: white; }
  .share-btn.email:hover { background: #718096; border-color: #718096; color: white; }
  .share-btn.copy:hover { background: var(--sage); border-color: var(--sage); color: white; }
  .share-btn.copied { background: var(--sage); border-color: var(--sage); color: white; }

  /* ── Related Posts ───────────────────────────────────────────────── */
  .related-section { margin-top: 56px; border-top: 2px solid var(--border); padding-top: 40px; }
  .related-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .related-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.25s; }
  .related-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--sage-light); }
  .related-card-img { width: 100%; height: 130px; object-fit: cover; background: var(--sage-pale); }
  .related-card-img-placeholder { width: 100%; height: 130px; background: var(--sage-pale); display: flex; align-items: center; justify-content: center; font-size: 40px; }
  .related-card-body { padding: 14px 16px; }
  .related-card-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--sage); letter-spacing: 1px; margin-bottom: 5px; }
  .related-card-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--ink); line-height: 1.3; margin-bottom: 8px; }
  .related-card-meta { font-size: 11px; color: var(--muted); font-weight: 600; }

  /* ── Back to Top ─────────────────────────────────────────────────── */
  .back-to-top-btn { position: fixed; bottom: 32px; right: 32px; width: 46px; height: 46px; border-radius: 50%; background: var(--sage); color: white; border: none; font-size: 18px; cursor: pointer; box-shadow: var(--shadow-md); transition: all 0.3s; display: flex; align-items: center; justify-content: center; z-index: 300; opacity: 0; transform: translateY(20px) scale(0.8); pointer-events: none; }
  .back-to-top-btn.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
  .back-to-top-btn:hover { background: var(--moss); transform: translateY(-3px) scale(1.05); }

  @media(max-width: 768px) {
    .post-top-bar { padding: 0 16px; }
    .reading-time-pill { display: none; }
    .post-hero-img { height: 220px; }
    .related-grid { grid-template-columns: 1fr; }
    .share-bar { gap: 8px; }
    .toc-box { display: none; }
    .back-to-top-btn { bottom: 20px; right: 20px; width: 42px; height: 42px; }
  }
`;

// ── TOC BUILDER ──────────────────────────────────────────────────────────────
function TableOfContents({ toc, activeId }) {
  if (!toc || toc.length === 0) return null;
  return (
    <div className="toc-box">
      <div className="toc-title">📋 In this article</div>
      <ul className="toc-list">
        {toc.map(item => (
          <li key={item.id} className="toc-item">
            <a
              className={`toc-link ${item.level === 3 ? 'h3-item' : ''} ${activeId === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className="toc-dot" />
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── READING TIME REMAINING ───────────────────────────────────────────────────
function useReadingProgress(bodyRef, totalWords) {
  const [progress, setProgress] = useState(0);
  const [minsLeft, setMinsLeft] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalH = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = totalH > 0 ? Math.min(100, (scrolled / totalH) * 100) : 0;
      setProgress(pct);
      if (totalWords && pct < 100) {
        const wordsLeft = totalWords * (1 - pct / 100);
        const minsRemaining = Math.max(1, Math.ceil(wordsLeft / 250));
        setMinsLeft(minsRemaining);
      } else {
        setMinsLeft(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bodyRef, totalWords]);

  return { progress, minsLeft };
}

// ── ACTIVE TOC ITEM TRACKER ──────────────────────────────────────────────────
function useActiveTocId(toc) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);
  return activeId;
}

// ── MAIN TEMPLATE COMPONENT ──────────────────────────────────────────────────
export default function BlogPostTemplate({ meta, navigate, children, relatedPosts }) {
  const [isTextLarge, setIsTextLarge] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const bodyRef = useRef(null);

  const safeMeta = meta || {};
  const toc = safeMeta.toc || [];
  const totalWords = safeMeta.wordCount || 0;

  // ── Article Schema (JSON-LD) ─────────────────────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": safeMeta.title || "",
    "image": [ safeMeta.imgUrl ? `https://secretsharz.com${safeMeta.imgUrl}` : "https://secretsharz.com/default-blog-cover.jpg" ],
    "datePublished": safeMeta.publishedAt || safeMeta.date || "",
    "dateModified": safeMeta.updatedAt || safeMeta.publishedAt || safeMeta.date || "",
    "author": [{
      "@type": "Person",
      "name": safeMeta.authorName || "Secret Sharz Team",
      "url": "https://secretsharz.com/about"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Secret Sharz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://secretsharz.com/logo.png"
      }
    },
    "description": safeMeta.excerpt || ""
  };

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = TEMPLATE_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const prev = document.title;
    if (safeMeta.title) document.title = `${safeMeta.title} | Secret Sharz`;

    const ogTags = [
      { property: 'og:title', content: safeMeta.title },
      { property: 'og:description', content: safeMeta.excerpt },
      { property: 'og:image', content: safeMeta.imgUrl },
      { property: 'og:type', content: 'article' },
    ];
    const added = ogTags.map(({ property, content }) => {
      if (!content) return null;
      let el = document.querySelector(`meta[property="${property}"]`);
      const created = !el;
      if (created) { el = document.createElement('meta'); el.setAttribute('property', property); }
      el.setAttribute('content', content);
      if (created) document.head.appendChild(el);
      return created ? el : null;
    });

    return () => {
      document.title = prev;
      added.forEach(el => { if (el && el.parentNode) el.parentNode.removeChild(el); });
    };
  }, [safeMeta.title, safeMeta.excerpt, safeMeta.imgUrl]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { progress, minsLeft } = useReadingProgress(bodyRef, totalWords);
  const activeTocId = useActiveTocId(toc);

  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  }, []);

  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch (_) {}
    document.body.removeChild(ta);
  };

  const handleFacebookShare = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener');
  }, []);

  const handleTwitterShare = useCallback(() => {
    const text = `"${safeMeta.title}" via @SecretSharz — a must-read for every student`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener');
  }, [safeMeta.title]);

  const handleLinkedInShare = useCallback(() => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener');
  }, []);

  const handlePinterestShare = useCallback(() => {
    const text = safeMeta.title ? encodeURIComponent(safeMeta.title) : '';
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${text}`, '_blank', 'noopener');
  }, [safeMeta.title]);

  const handleWhatsAppShare = useCallback(() => {
    const text = `Read this article from Secret Sharz: "${safeMeta.title}" — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }, [safeMeta.title]);

  const handleEmailShare = useCallback(() => {
    const subject = safeMeta.title ? encodeURIComponent(safeMeta.title) : 'Check out this article';
    const body = `I thought you might find this interesting:%0A%0A${safeMeta.title || ''}%0A${window.location.href}`;
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [safeMeta.title]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`blog-page ${isReadingMode ? 'reading-mode' : ''}`} style={{ padding: 0, background: isReadingMode ? '#1a1a1a' : 'white', transition: 'background 0.3s' }}>

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </Head>

      <div className="post-top-bar">
        <button className="post-back-btn" onClick={() => navigate('/blog')}>← Back</button>

        {minsLeft !== null ? (
          <span className={`reading-time-pill ${minsLeft <= 2 ? 'urgent' : ''}`}>
            {minsLeft <= 1 ? '🎉 Almost done!' : `⏱ ${minsLeft} min left`}
          </span>
        ) : progress >= 99 ? (
          <span className="reading-time-pill urgent">✓ Article complete</span>
        ) : (
          <span className="reading-time-pill">⏱ {safeMeta.readTime || '5 min read'}</span>
        )}

        <div className="post-actions">
          <button
            className="action-icon-btn"
            title={isTextLarge ? 'Reduce text size' : 'Increase text size'}
            onClick={() => setIsTextLarge(p => !p)}
          >
            {isTextLarge ? 'Aa−' : 'Aa+'}
          </button>

          <button
            className={`action-icon-btn ${isReadingMode ? 'reading-mode-on' : ''}`}
            title={isReadingMode ? 'Exit reading mode' : 'Reading mode (dark)'}
            onClick={() => setIsReadingMode(p => !p)}
          >
            {isReadingMode ? '☀️' : '🌙'}
          </button>

          <button
            className={`action-icon-btn ${copied ? 'reading-mode-on' : ''}`}
            title="Copy link to share"
            onClick={handleCopyLink}
          >
            {copied ? '✓ Copied' : '🔗'}
          </button>
        </div>

        <div className="reading-progress-container">
          <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="post-view">
        <div className="post-content">
          <div className="post-tag-row">
            {safeMeta.category && <span className="blog-tag">{safeMeta.category}</span>}
          </div>
          <h1>{safeMeta.title}</h1>

          <div className="post-full-meta">
            {safeMeta.date && <span>📅 {safeMeta.date}</span>}
            {safeMeta.readTime && <span>⏱ {safeMeta.readTime}</span>}
          </div>

          {safeMeta.imgUrl && (
            <img src={safeMeta.imgUrl} alt={safeMeta.title} className="post-hero-img" />
          )}

          {safeMeta.tldr && (
            <div className="post-tldr">
              <h4>Quick Summary 💡</h4>
              <p>{safeMeta.tldr}</p>
            </div>
          )}

          <TableOfContents toc={toc} activeId={activeTocId} />

          <div ref={bodyRef} className={`post-body ${isTextLarge ? 'text-large' : 'text-normal'}`}>
            {children}
          </div>

          <div className="share-bar">
            <span className="share-label">Share</span>
            <button className="share-btn facebook" onClick={handleFacebookShare}>📘 Facebook</button>
            <button className="share-btn twitter" onClick={handleTwitterShare}>𝕏 X (Twitter)</button>
            <button className="share-btn linkedin" onClick={handleLinkedInShare}>💼 LinkedIn</button>
            <button className="share-btn pinterest" onClick={handlePinterestShare}>📌 Pinterest</button>
            <button className="share-btn whatsapp" onClick={handleWhatsAppShare}>💬 WhatsApp</button>
            <button className="share-btn email" onClick={handleEmailShare}>✉️ Email</button>
            <button className={`share-btn copy ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
          </div>

          <div className={`reaction-box ${reaction ? 'thank-you' : ''}`}>
            {reaction ? (
              <>
                <h3 style={{ color: 'var(--sage)' }}>Thank you for your feedback! 💚</h3>
                <p>Your response helps us create better content for students like you.</p>
              </>
            ) : (
              <>
                <h3>Was this article helpful?</h3>
                <p>Your feedback helps us write better content every week.</p>
                <div className="reaction-btns">
                  <button className="react-btn" onClick={() => setReaction('yes')}>👍 Yes, it helped</button>
                  <button className="react-btn" onClick={() => setReaction('no')}>👎 Needs work</button>
                  <button className="react-btn" onClick={() => setReaction('saved')}>🔖 I needed this</button>
                </div>
              </>
            )}
          </div>

          <div className="cta-footer-box">
            <h3>Need to talk?</h3>
            <p>Our safe space is always open. Share anonymously, no sign-up required.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/wall')}
                style={{ background: 'var(--sage)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', fontSize: '14px', transition: 'all 0.2s' }}
              >
                Visit Sharz Wall
              </button>
              <button
                onClick={() => navigate('/mindspace')}
                style={{ background: 'white', color: 'var(--sage)', border: '2px solid var(--sage)', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', fontSize: '14px', transition: 'all 0.2s' }}
              >
                🧠 Try Mind Space
              </button>
            </div>
          </div>

          {relatedPosts && relatedPosts.length > 0 && (
            <div className="related-section">
              <div className="related-title">📚 Keep Reading</div>
              <div className="related-grid">
                {relatedPosts.map(post => (
                  <div
                    key={post.id}
                    className="related-card"
                    onClick={() => {
                      navigate(`/blog/${post.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {post.imgUrl
                      ? <img src={post.imgUrl} alt={post.title} className="related-card-img" loading="lazy" />
                      : <div className="related-card-img-placeholder">📖</div>
                    }
                    <div className="related-card-body">
                      <div className="related-card-tag">{post.category}</div>
                      <div className="related-card-title">{post.title}</div>
                      <div className="related-card-meta">{post.readTime || '5 min read'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
