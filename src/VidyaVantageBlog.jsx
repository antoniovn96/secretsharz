import React, { useState, useEffect, useMemo, useCallback } from 'react';

const VV_BLOG_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --saffron: #E8650A; --gold: #F0A500; --teal: #0A5C63;
    --cream: #FDF6EC; --parchment: #F5EDD8; --dark: #1C1208;
    --brown: #3D2205; --muted: #7A6248; --border: #E8DFD1;
  }

  .vv-hub-root { min-height: 100vh; background: var(--cream); font-family: 'DM Sans', sans-serif; padding-bottom: 100px; }
  
  .vv-hub-header { background: var(--dark); color: white; padding: 80px 40px 60px; text-align: center; border-bottom: 4px solid var(--saffron); }
  .vv-hub-h1 { font-family: 'Playfair Display', serif; font-size: clamp(36px, 6vw, 56px); margin-bottom: 16px; }
  .vv-hub-h1 span { color: var(--gold); font-style: italic; }
  .vv-hub-sub { color: rgba(255,255,255,0.7); font-size: 17px; max-width: 600px; margin: 0 auto 32px; line-height: 1.6; }
  
  .vv-hub-nav { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .vv-hub-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; font-family: inherit; }
  .vv-hub-btn:hover { border-color: var(--saffron); color: var(--saffron); }

  .vv-hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; max-width: 1200px; margin: 60px auto 0; padding: 0 40px; }
  .vv-hub-card { background: white; border-radius: 20px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(28,18,8,0.04); cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; }
  .vv-hub-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(28,18,8,0.1); border-color: var(--saffron); }
  
  .vv-card-img { width: 100%; height: 200px; object-fit: cover; background: var(--parchment); }
  .vv-card-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
  .vv-card-tag { display: inline-block; padding: 4px 12px; background: rgba(232,101,10,0.1); color: var(--saffron); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; align-self: flex-start; }
  .vv-card-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--dark); margin-bottom: 10px; line-height: 1.3; }
  .vv-card-excerpt { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; flex: 1; }
  .vv-card-meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: var(--brown); border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; }

  .vv-empty { text-align: center; padding: 80px 20px; color: var(--muted); grid-column: 1 / -1; }
`;

// ── AUTO-DETECT POSTS FROM THE NEW FOLDER ──
let VV_POSTS = [];
try {
  // CRITICAL: This points to the NEW folder 'vv-blogs'
  const req = require.context('./vv-blogs', true, /\.(js|jsx)$/); 
  
  VV_POSTS = req.keys().map((fileName, index) => {
    const module = req(fileName);
    const meta = module.meta || {}; 
    return {
      id: index + 1,
      slug: meta.slug || fileName.replace('./', '').replace(/\.jsx?$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: meta.title || "Untitled Career Post",
      excerpt: meta.excerpt || "",
      category: meta.category || "Career Guidance",
      date: meta.date || "",
      readTime: meta.readTime || "5 min read",
      imgUrl: meta.imgUrl || "",
      component: module.default 
    };
  });
} catch (error) {
  console.warn("Could not auto-load from ./vv-blogs folder. Ensure the folder exists.", error);
}

export default function VidyaVantageBlog({ navigate }) {
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = VV_BLOG_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // URL-aware routing logic specifically for VV
  useEffect(() => {
    const checkUrl = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts[0] === 'vidyavantage' && parts[1] === 'blog' && parts[2]) {
        const found = VV_POSTS.find(p => p.slug === parts[2]);
        if (found) { setActivePost(found); return; }
      }
      setActivePost(null);
    };
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

  const smartNavigate = useCallback((path) => {
    if (path === '/vidyavantage/blog') {
      window.history.pushState({}, '', '/vidyavantage/blog');
      setActivePost(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (path.startsWith('/vidyavantage/blog/')) {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (navigate) navigate(path);
    else window.location.href = path;
  }, [navigate]);

  if (activePost && activePost.component) {
    const PostComponent = activePost.component;
    const relatedPosts = VV_POSTS.filter(p => p.id !== activePost.id).slice(0, 3);
    return <PostComponent navigate={smartNavigate} relatedPosts={relatedPosts} />;
  }

  return (
    <div className="vv-hub-root">
      <div className="vv-hub-header">
        <h1 className="vv-hub-h1">Career <span>Insights</span></h1>
        <p className="vv-hub-sub">Data-driven strategies to help you choose the right stream, clear entrance exams, and build a successful career.</p>
        <div className="vv-hub-nav">
          <button className="vv-hub-btn" onClick={() => navigate('/vidyavantage')}>← Back to Assessment</button>
          <button className="vv-hub-btn" onClick={() => navigate('/')}>Secret Sharz Home</button>
        </div>
      </div>

      <div className="vv-hub-grid">
        {VV_POSTS.length === 0 ? (
          <div className="vv-empty">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--dark)' }}>No articles yet</h3>
            <p>Create your first `.jsx` file inside the `src/vv-blogs/` folder to see it appear here.</p>
          </div>
        ) : (
          VV_POSTS.map(post => (
            <div key={post.id} className="vv-hub-card" onClick={() => {
              setActivePost(post);
              smartNavigate(`/vidyavantage/blog/${post.slug}`);
            }}>
              {post.imgUrl && <img src={post.imgUrl} alt={post.title} className="vv-card-img" loading="lazy" />}
              <div className="vv-card-body">
                <span className="vv-card-tag">{post.category}</span>
                <h3 className="vv-card-title">{post.title}</h3>
                <p className="vv-card-excerpt">{post.excerpt}</p>
                <div className="vv-card-meta">
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
