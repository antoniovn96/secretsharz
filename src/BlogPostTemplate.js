import React, { useEffect } from 'react';
import Head from 'next/head';

export default function BlogPostTemplate({ meta, navigate, children }) {
  // Scrolls to the top of the page when the component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page" style={{ padding: '0', background: 'white' }}>
      
      {/* 🚀 AUTOMATED SEO METADATA 🚀 */}
      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image" content={meta.imgUrl} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="post-view">
        <button className="back-to-blog" onClick={() => navigate('/blog')}>
          ← Back to all articles
        </button>
        
        <div className="post-content">
          <span className="blog-tag">{meta.category}</span>
          <h1 style={{ letterSpacing: '-1.5px' }}>{meta.title}</h1>
          
          <div className="post-full-meta">
            <span>📅 {meta.date}</span>
            <span>⏱️ {meta.readTime}</span>
          </div>
          
          {meta.imgUrl && (
            <img 
              src={meta.imgUrl} 
              alt={meta.title} 
              className="post-hero-img" 
            />
          )}
          
          {/* This renders whatever content you type inside your specific post files */}
          <div className="post-body">
            {children}
          </div>

          {/* Optional: Add a standard footer at the bottom of EVERY post automatically! */}
          <div style={{ marginTop: '50px', padding: '30px', background: 'var(--sage-pale)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
             <h3 style={{ margin: '0 0 10px 0', fontFamily: 'Fraunces', color: 'var(--ink)' }}>Need to talk?</h3>
             <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--ink-soft)' }}>Our safe space is always open. Connect anonymously.</p>
             <button onClick={() => navigate('/wall')} style={{ background: 'var(--sage)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>Visit Sharz Wall</button>
          </div>
        </div>
      </div>
    </div>
  );
}
