import React, { useState, useEffect, useMemo } from 'react';

const BLOG_CSS = `
  .blog-page { min-height: 100vh; background: var(--warm-white); padding-bottom: 80px; }
  .blog-header { background: var(--ink); color: white; padding: 80px 48px 60px; text-align: center; border-bottom: 4px solid var(--sage); margin-bottom: 40px; }
  .blog-h1 { font-family: 'Fraunces', serif; font-size: clamp(36px, 6vw, 56px); margin-bottom: 12px; letter-spacing: -1px; }
  .blog-sub { color: rgba(255,255,255,0.7); font-size: 17px; max-width: 600px; margin: 0 auto; line-height: 1.6; }
  
  /* Filter Bar */
  .blog-controls { max-width: 900px; margin: 0 auto 50px; padding: 0 24px; display: flex; flex-direction: column; gap: 24px; align-items: center; }
  .blog-search-wrapper { position: relative; width: 100%; max-width: 500px; }
  .blog-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 18px; }
  .blog-search-input { width: 100%; padding: 14px 20px 14px 44px; border-radius: 50px; border: 2px solid var(--border); font-size: 16px; font-family: inherit; color: var(--ink); transition: all 0.3s ease; box-shadow: var(--shadow-sm); outline: none; }
  .blog-search-input:focus { border-color: var(--sage); box-shadow: 0 0 0 4px rgba(74, 124, 89, 0.1); }
  
  .blog-filters { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .filter-btn { background: white; border: 1.5px solid var(--border); color: var(--ink-soft); padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .filter-btn:hover { border-color: var(--sage-light); color: var(--sage); background: var(--sage-pale); transform: translateY(-2px); }
  .filter-btn.active { background: var(--sage); color: white; border-color: var(--sage); box-shadow: var(--shadow-sm); }

  /* Blog Grid */
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; max-width: 1200px; margin: 0 auto; padding: 0 48px; }
  .blog-card { background: white; border-radius: var(--r-md); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); cursor: pointer; display: flex; flex-direction: column; position: relative; top: 0; }
  .blog-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: var(--sage-light); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; background: var(--sage-pale); border-bottom: 1px solid var(--border); transition: transform 0.5s ease; }
  .blog-card:hover .blog-img { transform: scale(1.05); }
  .blog-img-wrapper { overflow: hidden; width: 100%; height: 220px; }
  .blog-card-content { padding: 28px; display: flex; flex-direction: column; flex: 1; background: white; z-index: 1; }
  .blog-tag { align-self: flex-start; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; background: var(--sage-pale); color: var(--sage); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; transition: background 0.2s ease; }
  .blog-card:hover .blog-tag { background: var(--sage); color: white; }
  .blog-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 12px; line-height: 1.3; }
  .blog-excerpt { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 24px; flex: 1; }
  .blog-meta { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); font-weight: 500; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; }

  /* Empty State */
  .blog-empty { text-align: center; padding: 80px 20px; color: var(--muted); width: 100%; grid-column: 1 / -1; background: white; border-radius: var(--r-md); border: 2px dashed var(--border); }
  .blog-empty-icon { font-size: 48px; margin-bottom: 16px; animation: floatUp 1s ease infinite alternate; display: inline-block; }
  
  /* Fallback Post View (Only used if template fails) */
  .post-view { max-width: 800px; margin: 40px auto; padding: 0 24px; animation: fadeIn 0.4s ease; }
  .back-to-blog { display: inline-flex; align-items: center; gap: 8px; color: var(--sage); font-weight: 600; font-size: 15px; cursor: pointer; margin-bottom: 40px; border: none; background: transparent; transition: color 0.2s; padding: 0; }
  .back-to-blog:hover { color: var(--moss); }
  .post-hero-img { width: 100%; height: 400px; object-fit: cover; border-radius: var(--r-md); margin-bottom: 40px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
  .post-content h1 { font-family: 'Fraunces', serif; font-size: clamp(36px, 5vw, 52px); color: var(--ink); line-height: 1.15; margin-bottom: 20px; letter-spacing: -1px; }
  .post-full-meta { display: flex; gap: 20px; font-size: 14px; color: var(--muted); margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid var(--border); font-weight: 500; }
  .post-body { font-size: 18px; color: var(--ink-soft); line-height: 1.8; white-space: pre-wrap; }
  .post-body h3 { font-family: 'Fraunces', serif; font-size: 24px; color: var(--ink); margin: 32px 0 16px; }

  @media(max-width: 768px) {
    .blog-header { padding: 60px 24px 40px; }
    .blog-grid { padding: 0 24px; }
  }
`;

// ── AUTO-DETECT BLOG POSTS FROM FOLDER ─────────────────────────────────────
let AUTO_BLOG_POSTS = [];
try {
  const req = require.context('./blogss', false, /\.js$/);
  
  AUTO_BLOG_POSTS = req.keys().map((fileName, index) => {
    const module = req(fileName);
    const meta = module.meta || {}; 
    
    // Automatically generate a URL-safe slug from the filename
    // e.g. "./NewYearReset.js" becomes "newyearreset"
    const generatedSlug = fileName.replace('./', '').replace('.js', '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return {
      id: index + 1,
      slug: meta.slug || generatedSlug,
      title: meta.title || fileName.replace('./', '').replace('.js', ''),
      excerpt: meta.excerpt || "Click to read more...",
      category: meta.category || "Mental Health",
      date: meta.date || "",
      readTime: meta.readTime || "",
      imgUrl: meta.imgUrl || "",
      content: meta.content || "",
      component: module.default 
    };
  });
} catch (error) {
  console.warn("Could not auto-load from ./blogss folder.", error);
}

// Fallback data
const FALLBACK_POSTS = [
  {
    id: 'f1',
    slug: 'board-exam-anxiety',
    title: "Navigating Board Exam Anxiety: A Student's Survival Guide",
    excerpt: "Practical, science-backed strategies for managing stress when the pressure of 10th and 12th board exams feels like too much to handle.",
    category: "Exam Stress",
    date: "April 1, 2026",
    readTime: "5 min read",
    imgUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    content: "<p>Board exams bring an immense amount of pressure...</p>"
  },
  {
    id: 'f2',
    slug: 'high-functioning-anxiety',
    title: "Why You Can't 'Just Be Happy': Understanding High-Functioning Anxiety",
    excerpt: "You get good grades, you smile for photos, and you never miss a deadline. But inside, your mind is racing constantly. You are not alone.",
    category: "Mental Health",
    date: "March 28, 2026",
    readTime: "7 min read",
    imgUrl: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800&q=80",
    content: "<p>High-functioning anxiety is tricky because it hides behind success...</p>"
  }
];

const BLOG_POSTS = AUTO_BLOG_POSTS.length > 0 ? AUTO_BLOG_POSTS : FALLBACK_POSTS;

export default function Blog({ navigate }) {
  const [activePost, setActivePost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Automatically read the URL on page load and on back/forward navigation
  useEffect(() => {
    const checkUrlForPost = () => {
      if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        // If URL looks like /blog/newyearreset
        if (pathParts[0] === 'blog' && pathParts[1]) {
          const slugToFind = pathParts[1];
          const post = BLOG_POSTS.find(p => p.slug === slugToFind);
          if (post) {
            setActivePost(post);
          }
        } else {
          setActivePost(null);
        }
      }
    };

    checkUrlForPost(); // Check immediately
    window.addEventListener('popstate', checkUrlForPost); // Listen for browser back button
    return () => window.removeEventListener('popstate', checkUrlForPost);
  }, []);

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = BLOG_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Scroll to top when opening a post
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePost]);

  // Intercept navigation commands from the Template
  const smartNavigate = (path) => {
    if (path === '/blog') {
      setActivePost(null); // Clear the screen state when going back to grid
    }
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  // Open post and push the slug to the URL history
  const handleOpenPost = (post) => {
    setActivePost(post);
    smartNavigate(`/blog/${post.slug}`);
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCats = new Set(BLOG_POSTS.map(post => post.category));
    return Array.from(uniqueCats);
  }, []);

  // Filter posts by category AND search query
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Render Single Post Component if clicked
  if (activePost) {
    if (activePost.component) {
      const PostComponent = activePost.component;
      // We pass the 'smartNavigate' interceptor down to the template
      return <PostComponent navigate={smartNavigate} />;
    }

    // Fallback if there is no separate React component file for this post
    return (
      <div className="blog-page" style={{ padding: '0', background: 'white' }}>
        <div className="post-view">
          <button className="back-to-blog" onClick={() => smartNavigate('/blog')}>
            ← Back to all articles
          </button>
          <div className="post-content">
            <span className="blog-tag">{activePost.category}</span>
            <h1>{activePost.title}</h1>
            <div className="post-full-meta">
              <span>📅 {activePost.date}</span>
              <span>⏱️ {activePost.readTime}</span>
            </div>
            {activePost.imgUrl && (
              <img src={activePost.imgUrl} alt={activePost.title} className="post-hero-img" />
            )}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: activePost.content }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Blog Listing
  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-h1">The SecretSharz Journal</h1>
        <p className="blog-sub">A safe space for insights, guides, and stories on mental health, overcoming anxiety, and navigating student life.</p>
      </div>

      {/* INTERACTIVE SEARCH & FILTER BAR */}
      <div className="blog-controls">
        <div className="blog-search-wrapper">
          <span className="blog-search-icon">🔍</span>
          <input 
            type="text" 
            className="blog-search-input" 
            placeholder="Search articles, topics, or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="blog-filters">
          <button 
            className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`} 
            onClick={() => setActiveCategory('All')}
          >
            All Articles
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} 
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* BLOG GRID */}
      <div className="blog-grid">
        {filteredPosts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">🌱</div>
            <h3>No articles found</h3>
            <p>Try adjusting your search or category filter. We're always adding new content to help you heal.</p>
            <button 
              className="filter-btn active" 
              style={{ marginTop: '16px' }}
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="blog-card" onClick={() => handleOpenPost(post)}>
              {post.imgUrl && (
                <div className="blog-img-wrapper">
                  <img src={post.imgUrl} alt={post.title} className="blog-img" />
                </div>
              )}
              <div className="blog-card-content">
                <span className="blog-tag">{post.category}</span>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
