import React, { useState, useEffect } from 'react';

const BLOG_CSS = `
  .blog-page { min-height: 100vh; background: var(--warm-white); padding-bottom: 80px; }
  .blog-header { background: var(--ink); color: white; padding: 60px 48px; text-align: center; border-bottom: 4px solid var(--sage); }
  .blog-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 48px); margin-bottom: 10px; }
  .blog-sub { color: rgba(255,255,255,0.7); font-size: 16px; max-width: 600px; margin: 0 auto; }
  
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; max-width: 1200px; margin: 50px auto; padding: 0 48px; }
  .blog-card { background: white; border-radius: var(--r-md); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: all 0.3s ease; cursor: pointer; display: flex; flex-direction: column; }
  .blog-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); border-color: var(--sage-light); }
  .blog-img { width: 100%; height: 200px; object-fit: cover; background: var(--sage-pale); border-bottom: 1px solid var(--border); }
  .blog-card-content { padding: 24px; display: flex; flex-direction: column; flex: 1; }
  .blog-tag { align-self: flex-start; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: var(--sage-pale); color: var(--sage); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
  .blog-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 10px; line-height: 1.3; }
  .blog-excerpt { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 20px; flex: 1; }
  .blog-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); font-weight: 500; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; }

  .post-view { max-width: 800px; margin: 40px auto; padding: 0 24px; animation: fadeIn 0.4s ease; }
  .back-to-blog { display: inline-flex; align-items: center; gap: 8px; color: var(--sage); font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 32px; border: none; background: transparent; transition: color 0.2s; }
  .back-to-blog:hover { color: var(--moss); }
  .post-hero-img { width: 100%; height: 350px; object-fit: cover; border-radius: var(--r-md); margin-bottom: 32px; box-shadow: var(--shadow-sm); }
  .post-content h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 46px); color: var(--ink); line-height: 1.15; margin-bottom: 16px; }
  .post-full-meta { display: flex; gap: 16px; font-size: 14px; color: var(--muted); margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .post-body { font-size: 17px; color: var(--ink-soft); line-height: 1.8; white-space: pre-wrap; }
`;

const BLOG_POSTS = [
  {
    id: 1,
    title: "Navigating Board Exam Anxiety: A Student's Guide",
    excerpt: "Practical, science-backed strategies for managing stress when the pressure of board exams feels like too much to handle.",
    category: "Mental Health",
    date: "April 1, 2026",
    readTime: "5 min read",
    imgUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    content: "Board exams bring an immense amount of pressure. It's completely normal to feel overwhelmed, but there are practical ways to manage it.\n\n1. Box Breathing\nBefore opening your textbook, inhale for 4 seconds, hold for 4, exhale for 4, and hold empty for 4. This resets your nervous system.\n\n2. Break Tasks Down\nInstead of 'Study Physics', write 'Read pages 12-15 of Chapter 3'. Smaller tasks stop the brain from freezing up in panic."
  },
  {
    id: 2,
    title: "The Habitat Way: Finding Your True Career Path",
    excerpt: "Stop guessing your future. A sneak peek into identifying a career that aligns with your natural aptitude and personality traits.",
    category: "Career Guidance",
    date: "March 28, 2026",
    readTime: "8 min read",
    imgUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    content: "Choosing a career shouldn't be about what your friends are doing or what pays the highest entry-level salary. It should be about alignment.\n\nThe Habitat Way focuses on aligning your inherent strengths—using frameworks like the RIASEC model—with long-term goals. When you work in a field that matches your personality type (whether you are Investigative, Artistic, or Enterprising), the friction of daily work disappears."
  },
  {
    id: 3,
    title: "Building Inclusive Classrooms: A Guide for Educators",
    excerpt: "Insights into teacher self-efficacy and fostering an environment where every single student thrives.",
    category: "For Educators",
    date: "March 15, 2026",
    readTime: "6 min read",
    imgUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    content: "Research shows that teacher attitudes fundamentally shape the success of inclusive education. Creating a safe space begins with understanding diverse psychological needs in primary and middle school environments.\n\nWhen teachers feel equipped and confident (high self-efficacy), students with varying emotional and academic needs are much more likely to succeed both inside and outside the classroom."
  }
];

export default function Blog() {
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = BLOG_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePost]);

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
            <div className="post-body">{activePost.content}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-h1">The SecretSharz Journal</h1>
        <p className="blog-sub">Insights, guides, and stories on mental health, career discovery, and student life.</p>
      </div>

      <div className="blog-grid">
        {BLOG_POSTS.map(post => (
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
        ))}
      </div>
    </div>
  );
}
