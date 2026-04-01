import React, { useState, useEffect, useMemo } from 'react';

const BLOG_CSS = `
  .blog-page { min-height: 100vh; background: var(--warm-white); padding-bottom: 80px; }
  .blog-header { background: var(--ink); color: white; padding: 80px 48px 60px; text-align: center; border-bottom: 4px solid var(--sage); margin-bottom: 40px; }
  .blog-h1 { font-family: 'Fraunces', serif; font-size: clamp(36px, 6vw, 56px); margin-bottom: 12px; letter-spacing: -1px; }
  .blog-sub { color: rgba(255,255,255,0.7); font-size: 17px; max-width: 600px; margin: 0 auto; line-height: 1.6; }
  
  /* Filter Bar */
  .blog-filters { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; padding: 0 24px; max-width: 900px; margin: 0 auto 50px; }
  .filter-btn { background: white; border: 1.5px solid var(--border); color: var(--ink-soft); padding: 10px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .filter-btn:hover { border-color: var(--sage-light); color: var(--sage); background: var(--sage-pale); }
  .filter-btn.active { background: var(--sage); color: white; border-color: var(--sage); box-shadow: var(--shadow-sm); }

  /* Blog Grid */
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; max-width: 1200px; margin: 0 auto; padding: 0 48px; }
  .blog-card { background: white; border-radius: var(--r-md); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: all 0.3s ease; cursor: pointer; display: flex; flex-direction: column; }
  .blog-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); border-color: var(--sage-light); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; background: var(--sage-pale); border-bottom: 1px solid var(--border); }
  .blog-card-content { padding: 28px; display: flex; flex-direction: column; flex: 1; }
  .blog-tag { align-self: flex-start; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; background: var(--sage-pale); color: var(--sage); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
  .blog-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 12px; line-height: 1.3; }
  .blog-excerpt { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 24px; flex: 1; }
  .blog-meta { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); font-weight: 500; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; }

  /* Empty State */
  .blog-empty { text-align: center; padding: 60px 20px; color: var(--muted); width: 100%; grid-column: 1 / -1; }
  .blog-empty-icon { font-size: 48px; margin-bottom: 16px; }

  /* Individual Post View */
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
    .post-hero-img { height: 250px; }
  }
`;

// ── SECRET SHARZ BLOG DATA ───────────────────────────────────────────────────
// This acts as your database. You can add new posts here anytime.
const BLOG_POSTS = [
  {
    id: 1,
    title: "Navigating Board Exam Anxiety: A Student's Survival Guide",
    excerpt: "Practical, science-backed strategies for managing stress when the pressure of 10th and 12th board exams feels like too much to handle.",
    category: "Exam Stress",
    date: "April 1, 2026",
    readTime: "5 min read",
    imgUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    content: "Board exams bring an immense amount of pressure. From parental expectations to societal comparisons, it's completely normal to feel overwhelmed. But there are practical ways to manage it.\n\n<h3>1. The 4-7-8 Breathing Method</h3>\nBefore opening your textbook or entering the exam hall, inhale for 4 seconds, hold for 7, and exhale for 8. This physically forces your nervous system out of 'fight or flight' mode and brings your heart rate down.\n\n<h3>2. Break Tasks Down to the Ridiculous</h3>\nInstead of putting 'Study Physics' on your to-do list, write 'Read pages 12-15 of Chapter 3'. When the brain sees a massive task, it freezes in panic. Micro-tasks create momentum.\n\n<h3>3. You Are More Than Your Marks</h3>\nRemember that this exam is a stepping stone, not a destination. Five years from now, nobody will ask you about your Class 12 chemistry score. Be kind to yourself today."
  },
  {
    id: 2,
    title: "Why You Can't 'Just Be Happy': Understanding High-Functioning Anxiety",
    excerpt: "You get good grades, you smile for photos, and you never miss a deadline. But inside, your mind is racing constantly. You are not alone.",
    category: "Mental Health",
    date: "March 28, 2026",
    readTime: "7 min read",
    imgUrl: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800&q=80",
    content: "High-functioning anxiety is tricky because it hides behind success. To the outside world, you look like you have it all together. You get your work done, you're responsible, and you're the 'good kid'.\n\nBut internally, that success is driven by fear.\n\n<h3>The Symptoms We Ignore</h3>\n- Overthinking every conversation you had that day.\n- The inability to truly rest because you feel you 'should be doing something productive'.\n- Constant fear of letting people down.\n- Physical symptoms like tight shoulders, shallow breathing, or jaw clenching.\n\n<h3>How to Start Healing</h3>\nThe first step is acknowledging that feeling exhausted by your own mind isn't a badge of honor. It's okay to lower the bar. It's okay to rest without earning it. Try using the Secret Sharz Mind Space tools to log your anxious triggers without judging them."
  },
  {
    id: 3,
    title: "How to Help a Friend Who Is Struggling Silently",
    excerpt: "We often don't know what to say when a friend is depressed or anxious. Here is exactly what to say (and what to avoid).",
    category: "Relationships",
    date: "March 15, 2026",
    readTime: "6 min read",
    imgUrl: "https://images.unsplash.com/photo-1529156069898-49953eb1b5af?auto=format&fit=crop&w=800&q=80",
    content: "When a friend is going through a tough time, our instinct is to try and 'fix' it. We want to offer solutions or tell them to look on the bright side. But often, that's the exact opposite of what they need.\n\n<h3>Things to Avoid Saying</h3>\n- 'Just don't think about it.'\n- 'Other people have it much worse.'\n- 'You have so much to be happy about.'\nThese phrases invalidate their pain and make them feel guilty for struggling.\n\n<h3>What Actually Helps</h3>\nInstead of trying to fix the problem, validate the emotion.\n- 'That sounds really heavy. I'm so sorry you're dealing with this.'\n- 'I don't know exactly what to say, but I'm here for you.'\n- 'Do you want to talk about it, or do you just want a distraction right now?'\n\nSometimes, simply sitting in silence with someone is the most profound support you can offer."
  },
  {
    id: 4,
    title: "5 Grounding Techniques for When Everything Feels Too Much",
    excerpt: "Panic attacks and overwhelming stress can disconnect you from reality. Here are quick, discreet ways to anchor yourself.",
    category: "Self-Care",
    date: "March 2, 2026",
    readTime: "4 min read",
    imgUrl: "https://images.unsplash.com/photo-1508124785461-127e28fc100b?auto=format&fit=crop&w=800&q=80",
    content: "When anxiety peaks, your brain believes you are in immediate physical danger. Grounding techniques use your five senses to remind your brain that you are safe in the present moment.\n\n<h3>1. The 5-4-3-2-1 Method</h3>\nLook around and identify:\n- 5 things you can see\n- 4 things you can physically feel (the chair, your shoes)\n- 3 things you can hear\n- 2 things you can smell\n- 1 thing you can taste\n\n<h3>2. Temperature Shock</h3>\nHold an ice cube in your hand or splash freezing cold water on your face. The intense physical sensation forces your brain to shift focus from racing thoughts to the physical reality of the cold.\n\n<h3>3. Category Naming</h3>\nPick a category—like 'Cities in India', 'Dog breeds', or 'Movies'—and try to name as many as you can. This engages the logical part of your brain, overriding the emotional panic center."
  }
];

export default function Blog() {
  const [activePost, setActivePost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

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

  // Extract unique categories for the filter bar
  const categories = useMemo(() => {
    const uniqueCats = new Set(BLOG_POSTS.map(post => post.category));
    return Array.from(uniqueCats);
  }, []);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === activeCategory);
  }, [activeCategory]);

  // Render Single Post View
  if (activePost) {
    return (
      <div className="blog-page" style={{ padding: '0', background: 'white' }}>
        <div className="post-view">
          <button className="back-to-blog" onClick={() => setActivePost(null)}>
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
            {/* The dangerouslySetInnerHTML is used safely here because we control the static content, 
                allowing us to render HTML tags like <h3> directly from the database string */}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: activePost.content }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Blog Listing with Filters
  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-h1">The SecretSharz Journal</h1>
        <p className="blog-sub">A safe space for insights, guides, and stories on mental health, overcoming anxiety, and navigating student life.</p>
      </div>

      {/* FILTER BAR */}
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

      {/* BLOG GRID */}
      <div className="blog-grid">
        {filteredPosts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">🌱</div>
            <h3>No articles found in this category</h3>
            <p>Check back later, we're always adding new content to help you heal.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="blog-card" onClick={() => setActivePost(post)}>
              {post.imgUrl && (
                <img src={post.imgUrl} alt={post.title} className="blog-img" />
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
