import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const BLOG_CSS = `
  /* ── Page Shell ──────────────────────────────────────────────────── */
  .blog-page { min-height: 100vh; background: var(--warm-white); padding-bottom: 100px; }

  /* ── Header ──────────────────────────────────────────────────────── */
  .blog-header { background: var(--ink); color: white; padding: 80px 48px 60px; text-align: center; border-bottom: 4px solid var(--sage); }
  .blog-h1 { font-family: 'Fraunces', serif; font-size: clamp(36px, 6vw, 56px); margin-bottom: 12px; letter-spacing: -1px; }
  .blog-sub { color: rgba(255,255,255,0.7); font-size: 17px; max-width: 600px; margin: 0 auto 28px; line-height: 1.6; }
  .blog-header-stats { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
  .bhs-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bhs-num { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: var(--sage-light); line-height: 1; }
  .bhs-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); }

  /* ── Featured Post ───────────────────────────────────────────────── */
  .blog-featured-wrap { max-width: 1200px; margin: 48px auto 0; padding: 0 48px; }
  .blog-featured { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-radius: var(--r-md); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border); cursor: pointer; background: white; transition: transform 0.3s; }
  .blog-featured:hover { transform: translateY(-4px); box-shadow: 0 24px 60px rgba(30,40,32,0.16); }
  .blog-featured-img-wrap { overflow: hidden; height: 380px; }
  .blog-featured-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .blog-featured:hover .blog-featured-img { transform: scale(1.04); }
  .blog-featured-body { padding: 48px 44px; display: flex; flex-direction: column; justify-content: center; }
  .blog-featured-badge { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, var(--sage-pale), var(--lav-pale)); border: 1px solid var(--border); color: var(--sage); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 50px; margin-bottom: 20px; }
  .blog-featured-title { font-family: 'Fraunces', serif; font-size: clamp(24px, 3vw, 34px); font-weight: 700; color: var(--ink); line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.5px; }
  .blog-featured-excerpt { font-size: 15px; color: var(--muted); line-height: 1.75; margin-bottom: 28px; flex: 1; }
  .blog-featured-meta { display: flex; align-items: center; gap: 16px; font-size: 13px; color: var(--muted); font-weight: 600; flex-wrap: wrap; }
  .blog-featured-cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; background: var(--sage); color: white; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .blog-featured-cta:hover { background: var(--moss); transform: translateY(-1px); }
  .blog-featured-no-img { grid-template-columns: 1fr; }
  .blog-featured-no-img .blog-featured-body { padding: 48px; }

  /* ── Controls ────────────────────────────────────────────────────── */
  .blog-controls-wrap { max-width: 1200px; margin: 40px auto 32px; padding: 0 48px; }
  .blog-controls-row1 { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-bottom: 18px; }
  .blog-search-wrapper { position: relative; flex: 1; min-width: 240px; max-width: 460px; }
  .blog-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 16px; pointer-events: none; }
  .blog-search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: var(--border); border: none; width: 20px; height: 20px; border-radius: 50%; font-size: 11px; cursor: pointer; color: var(--muted); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .blog-search-clear:hover { background: var(--sage); color: white; }
  .blog-search-input { width: 100%; padding: 13px 40px 13px 44px; border-radius: 50px; border: 2px solid var(--border); font-size: 15px; font-family: inherit; color: var(--ink); background: white; transition: all 0.25s; box-shadow: var(--shadow-sm); outline: none; }
  .blog-search-input:focus { border-color: var(--sage); box-shadow: 0 0 0 4px rgba(74,124,89,0.1); }
  .blog-sort-select { padding: 12px 18px; border-radius: 50px; border: 2px solid var(--border); font-size: 14px; font-family: inherit; font-weight: 600; color: var(--ink-soft); background: white; cursor: pointer; outline: none; transition: border-color 0.2s; box-shadow: var(--shadow-sm); }
  .blog-sort-select:focus { border-color: var(--sage); }
  .blog-results-count { font-size: 13px; color: var(--muted); font-weight: 600; }
  .blog-results-count strong { color: var(--sage); }

  .blog-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .filter-label { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-right: 4px; }
  .filter-btn { background: white; border: 1.5px solid var(--border); color: var(--ink-soft); padding: 8px 18px; border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
  .filter-btn:hover { border-color: var(--sage-light); color: var(--sage); background: var(--sage-pale); }
  .filter-btn.active { background: var(--sage); color: white; border-color: var(--sage); }
  .filter-count { font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 20px; margin-left: 4px; }
  .filter-btn.active .filter-count { background: rgba(255,255,255,0.3); }
  .filter-btn:not(.active) .filter-count { background: var(--sage-pale); color: var(--sage); }

  /* ── Blog Grid ───────────────────────────────────────────────────── */
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; max-width: 1200px; margin: 0 auto; padding: 0 48px; }
  .blog-card { background: white; border-radius: var(--r-md); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); cursor: pointer; display: flex; flex-direction: column; opacity: 0; transform: translateY(20px); }
  .blog-card.card-visible { opacity: 1; transform: translateY(0); transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s, border-color 0.3s; }
  .blog-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--sage-light); }
  .blog-img-wrapper { overflow: hidden; width: 100%; height: 200px; background: var(--sage-pale); }
  .blog-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .blog-card:hover .blog-img { transform: scale(1.06); }
  .blog-card-content { padding: 24px; display: flex; flex-direction: column; flex: 1; }
  .blog-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .blog-tag { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: var(--sage-pale); color: var(--sage); text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; }
  .blog-card:hover .blog-tag { background: var(--sage); color: white; }
  .blog-read-time { font-size: 11px; color: var(--muted); font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .blog-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 10px; line-height: 1.3; }
  .blog-excerpt { font-size: 14px; color: var(--ink-soft); line-height: 1.65; margin-bottom: 20px; flex: 1; }
  /* Search highlight */
  .search-hl { background: rgba(74,124,89,0.15); border-radius: 3px; padding: 0 2px; font-weight: 700; color: var(--sage); }
  .blog-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted); font-weight: 500; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 14px; gap: 8px; }
  .blog-meta-date { display: flex; align-items: center; gap: 4px; }
  .blog-card-footer-cta { display: flex; align-items: center; gap: 4px; color: var(--sage); font-weight: 700; font-size: 12px; }

  /* ── No-image card variant ───────────────────────────────────────── */
  .blog-card-no-img .blog-card-content { padding-top: 28px; }

  /* ── Empty State ─────────────────────────────────────────────────── */
  .blog-empty { text-align: center; padding: 80px 20px; color: var(--muted); grid-column: 1 / -1; background: white; border-radius: var(--r-md); border: 2px dashed var(--border); }
  .blog-empty-icon { font-size: 48px; margin-bottom: 16px; display: inline-block; animation: floatUp 1.5s ease infinite alternate; }

  /* ── Load More ───────────────────────────────────────────────────── */
  .blog-load-more-wrap { text-align: center; margin: 48px 0 0; }
  .blog-load-more-btn { background: white; border: 2px solid var(--sage); color: var(--sage); padding: 14px 40px; border-radius: 50px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.25s; box-shadow: var(--shadow-sm); }
  .blog-load-more-btn:hover { background: var(--sage); color: white; transform: translateY(-2px); }
  .blog-load-more-hint { font-size: 13px; color: var(--muted); margin-top: 10px; }

  /* ── Post View (fallback) ────────────────────────────────────────── */
  .post-view { max-width: 760px; margin: 40px auto; padding: 0 24px 80px; }
  .back-to-blog { display: inline-flex; align-items: center; gap: 8px; color: var(--sage); font-weight: 600; font-size: 15px; cursor: pointer; margin-bottom: 40px; border: none; background: transparent; transition: color 0.2s; padding: 0; font-family: inherit; }
  .back-to-blog:hover { color: var(--moss); }
  .post-hero-img { width: 100%; height: 380px; object-fit: cover; border-radius: var(--r-md); margin-bottom: 36px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
  .post-content h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 48px); color: var(--ink); line-height: 1.15; margin-bottom: 20px; letter-spacing: -1px; }
  .post-full-meta { display: flex; gap: 20px; font-size: 14px; color: var(--muted); margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--border); font-weight: 500; flex-wrap: wrap; }
  .post-body { font-size: 18px; color: var(--ink-soft); line-height: 1.85; }
  .post-body h2, .post-body h3 { font-family: 'Fraunces', serif; color: var(--ink); margin: 36px 0 14px; }
  .post-body h2 { font-size: 26px; }
  .post-body h3 { font-size: 22px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .blog-spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--sage); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 60px auto; }

  @media(max-width: 900px) {
    .blog-header { padding: 60px 24px 40px; }
    .blog-featured-wrap { padding: 0 24px; }
    .blog-featured { grid-template-columns: 1fr; }
    .blog-featured-img-wrap { height: 240px; }
    .blog-featured-body { padding: 28px 24px; }
    .blog-controls-wrap { padding: 0 24px; }
    .blog-grid { padding: 0 24px; grid-template-columns: 1fr; }
    .blog-controls-row1 { flex-direction: column; align-items: stretch; }
    .blog-search-wrapper { max-width: 100%; }
    .blog-header-stats { gap: 20px; }
  }
`;

// ── HELPERS ──────────────────────────────────────────────────────────────────
const POSTS_PER_PAGE = 6;

// A reliable date parser to convert "DD-MM-YYYY" or standard dates into a timestamp for sorting
function parseDateToTs(dateStr) {
  if (!dateStr) return 0;
  // Handle DD-MM-YYYY or DD/MM/YYYY seamlessly
  if (dateStr.includes('-') || dateStr.includes('/')) {
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3 && parts[0].length <= 2) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}T00:00:00Z`).getTime();
    }
  }
  // Fallback for other formats
  const parsed = new Date(dateStr).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

// Automatically formats any valid date strictly into "DD-MM-YYYY" for screen display
function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  
  const ts = parseDateToTs(dateStr);
  if (ts === 0) return dateStr; 
  
  const d = new Date(ts);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  
  return `${day}-${month}-${year}`;
}

function estimateReadTime(wordCount) {
  const mins = Math.max(1, Math.round(wordCount / 250));
  return `${mins} min read`;
}

function highlightText(text, query) {
  if (!query || query.trim().length < 2) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="search-hl">{part}</mark>
      : part
  );
}

// ── AUTO-DETECT BLOG POSTS FROM FOLDER ─────────────────────────────────────
let BLOG_POSTS = [];
try {
  // Webpack magic: reads all .js files inside the /blogss/ folder automatically.
  // CRITICAL FIX: The regex /^(?!.*(Blog\.js|BlogPostTemplate\.js)).*\.js$/ explicitly ignores 
  // Blog.js and BlogPostTemplate.js to prevent Vercel from crashing in an infinite loop!
  const req = require.context('./blogss', true, /^(?!.*(Blog\.js|BlogPostTemplate\.js)).*\.js$/); 
  
  BLOG_POSTS = req.keys().map((fileName, index) => {
    const module = req(fileName);
    const meta = module.meta || {}; 
    const calculatedDateTs = meta.dateTs || parseDateToTs(meta.date);
    const displayDate = formatDisplayDate(meta.date);

    return {
      id: index + 1,
      slug: meta.slug || fileName.replace('./', '').replace('.js', '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: meta.title || fileName.replace('./', '').replace('.js', ''),
      excerpt: meta.excerpt || "Click to read more...",
      category: meta.category || "Mental Health",
      date: displayDate,
      dateTs: calculatedDateTs,
      readTime: meta.readTime || "",
      wordCount: meta.wordCount || 0,
      imgUrl: meta.imgUrl || "",
      featured: meta.featured || false,
      content: meta.content || "",
      component: module.default 
    };
  });
} catch (error) {
  console.warn("Could not auto-load from ./blogss folder.", error);
}

// ── BLOG CARD COMPONENT ──────────────────────────────────────────────────────
function BlogCard({ post, onClick, searchQuery, animDelay }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { el.classList.add('card-visible'); obs.disconnect(); }
      }, { threshold: 0.1 });
      obs.observe(el);
      return () => obs.disconnect();
    }, animDelay);
    return () => clearTimeout(timer);
  }, [animDelay]);

  const rt = post.readTime || estimateReadTime(post.wordCount || 300);

  return (
    <div
      ref={cardRef}
      className={`blog-card ${!post.imgUrl ? 'blog-card-no-img' : ''}`}
      onClick={() => onClick(post)}
    >
      {post.imgUrl && (
        <div className="blog-img-wrapper">
          <img src={post.imgUrl} alt={post.title} className="blog-img" loading="lazy" />
        </div>
      )}
      <div className="blog-card-content">
        <div className="blog-card-top">
          <span className="blog-tag">{post.category}</span>
          <span className="blog-read-time">⏱ {rt}</span>
        </div>
        <h3 className="blog-title">{highlightText(post.title, searchQuery)}</h3>
        <p className="blog-excerpt">{highlightText(post.excerpt, searchQuery)}</p>
        <div className="blog-meta">
          <span className="blog-meta-date">📅 {post.date}</span>
          <span className="blog-card-footer-cta">Read →</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN BLOG COMPONENT ──────────────────────────────────────────────────────
export default function Blog({ navigate }) {
  const [activePost, setActivePost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const searchRef = useRef(null);

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = BLOG_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Scroll to top when opening/closing a post
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activePost]);

  // URL-aware post detection
  useEffect(() => {
    const checkUrl = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts[0] === 'blog' && parts[1]) {
        const found = BLOG_POSTS.find(p => p.slug === parts[1]);
        if (found) { setActivePost(found); return; }
      }
      setActivePost(null);
    };
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

  // Custom navigation to handle internal SPA routing vs external
  const smartNavigate = useCallback((path) => {
    if (path === '/blog') {
      window.history.pushState({}, '', '/blog');
      setActivePost(null);
      return;
    }
    if (path.startsWith('/blog/')) {
      window.history.pushState({}, '', path);
      return;
    }
    if (navigate) navigate(path);
    else window.location.href = path;
  }, [navigate]);

  const handleOpenPost = useCallback((post) => {
    setActivePost(post);
    smartNavigate(`/blog/${post.slug}`);
  }, [smartNavigate]);

  // Unique categories with counts
  const categoryMeta = useMemo(() => {
    const map = {};
    BLOG_POSTS.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, []);
  const categories = useMemo(() => Object.keys(categoryMeta), [categoryMeta]);

  // Sort Featured post (Safeguard in case it's not explicitly flagged, grab newest)
  const featuredPost = useMemo(() => {
    const explicitFeatured = BLOG_POSTS.find(p => p.featured);
    if (explicitFeatured) return explicitFeatured;
    
    // Fallback to the absolute newest post
    const sorted = [...BLOG_POSTS].sort((a, b) => (b.dateTs || 0) - (a.dateTs || 0));
    return sorted[0];
  }, []);

  // Filter + sort
  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    
    // Reliable timestamp sorting
    if (sortOrder === 'newest') posts = [...posts].sort((a, b) => (b.dateTs || 0) - (a.dateTs || 0));
    else if (sortOrder === 'oldest') posts = [...posts].sort((a, b) => (a.dateTs || 0) - (b.dateTs || 0));
    else if (sortOrder === 'longest') posts = [...posts].sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
    
    return posts;
  }, [activeCategory, searchQuery, sortOrder]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(POSTS_PER_PAGE); }, [activeCategory, searchQuery, sortOrder]);

  // ── Render single post ──
  if (activePost) {
    if (activePost.component) {
      const PostComponent = activePost.component;
      const relatedPosts = BLOG_POSTS
        .filter(p => p.id !== activePost.id && (p.category === activePost.category || p.featured))
        .slice(0, 3);
      return <PostComponent navigate={smartNavigate} allPosts={BLOG_POSTS} relatedPosts={relatedPosts} />;
    }
    // Fallback inline post view
    return (
      <div className="blog-page" style={{ background: 'white', padding: 0 }}>
        <div className="post-view">
          <button className="back-to-blog" onClick={() => smartNavigate('/blog')}>← Back to all articles</button>
          <div className="post-content">
            <span className="blog-tag">{activePost.category}</span>
            <h1>{activePost.title}</h1>
            <div className="post-full-meta">
              <span>📅 {activePost.date}</span>
              <span>⏱ {activePost.readTime || estimateReadTime(activePost.wordCount || 300)}</span>
            </div>
            {activePost.imgUrl && <img src={activePost.imgUrl} alt={activePost.title} className="post-hero-img" />}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: activePost.content }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Render blog listing ──
  return (
    <div className="blog-page">
      {/* HEADER */}
      <div className="blog-header">
        <h1 className="blog-h1">The SecretSharz Journal</h1>
        <p className="blog-sub">A safe space for insights, guides, and stories on mental health, overcoming anxiety, and navigating student life.</p>
        <div className="blog-header-stats">
          <div className="bhs-item"><div className="bhs-num">{BLOG_POSTS.length}</div><div className="bhs-label">Articles</div></div>
          <div className="bhs-item"><div className="bhs-num">{categories.length}</div><div className="bhs-label">Topics</div></div>
          <div className="bhs-item"><div className="bhs-num">{BLOG_POSTS.reduce((s, p) => s + (p.wordCount || 0), 0).toLocaleString()}</div><div className="bhs-label">Words of support</div></div>
          <div className="bhs-item"><div className="bhs-num">Free</div><div className="bhs-label">Always</div></div>
        </div>
      </div>

      {/* FEATURED POST */}
      {featuredPost && (
        <div className="blog-featured-wrap">
          <div className={`blog-featured ${!featuredPost.imgUrl ? 'blog-featured-no-img' : ''}`} onClick={() => handleOpenPost(featuredPost)}>
            {featuredPost.imgUrl && (
              <div className="blog-featured-img-wrap">
                <img src={featuredPost.imgUrl} alt={featuredPost.title} className="blog-featured-img" />
              </div>
            )}
            <div className="blog-featured-body">
              <div className="blog-featured-badge">⭐ Editor's Pick</div>
              <div className="blog-featured-title">{featuredPost.title}</div>
              <div className="blog-featured-excerpt">{featuredPost.excerpt}</div>
              <div className="blog-featured-meta">
                <span className="blog-tag" style={{ margin: 0 }}>{featuredPost.category}</span>
                <span>📅 {featuredPost.date}</span>
                <span>⏱ {featuredPost.readTime || estimateReadTime(featuredPost.wordCount || 300)}</span>
              </div>
              <button className="blog-featured-cta">Read Article →</button>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="blog-controls-wrap">
        <div className="blog-controls-row1">
          <div className="blog-search-wrapper">
            <span className="blog-search-icon">🔍</span>
            <input
              ref={searchRef}
              type="text"
              className="blog-search-input"
              placeholder="Search articles, topics, keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="blog-search-clear" onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}>✕</button>
            )}
          </div>

          <select className="blog-sort-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="longest">Longest Reads</option>
          </select>

          <span className="blog-results-count">
            Showing <strong>{Math.min(visibleCount, filteredPosts.length)}</strong> of <strong>{filteredPosts.length}</strong> articles
          </span>
        </div>

        <div className="blog-filters">
          <span className="filter-label">Filter:</span>
          <button
            className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All Articles
            <span className="filter-count">{BLOG_POSTS.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              <span className="filter-count">{categoryMeta[cat]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="blog-grid">
        {visiblePosts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">🌱</div>
            <h3 style={{ fontFamily: 'Fraunces, serif', marginBottom: '8px' }}>No articles found</h3>
            <p style={{ marginBottom: '20px' }}>Try adjusting your search or filter. New content is added every week.</p>
            <button className="filter-btn active" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Clear Filters</button>
          </div>
        ) : (
          visiblePosts.map((post, i) => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={handleOpenPost}
              searchQuery={searchQuery}
              animDelay={i * 60}
            />
          ))
        )}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="blog-load-more-wrap">
          <button className="blog-load-more-btn" onClick={() => setVisibleCount(c => c + POSTS_PER_PAGE)}>
            Load More Articles
          </button>
          <p className="blog-load-more-hint">{filteredPosts.length - visibleCount} more articles waiting</p>
        </div>
      )}
    </div>
  );
}
