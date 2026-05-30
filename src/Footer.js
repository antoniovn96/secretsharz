import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <img 
        src="/secret-sharz-logo.png" 
        alt="Secret Sharz Logo" 
        style={styles.logo} 
      />

      {/* Social Media Links */}
      <div style={styles.socialRow}>
        <a
          href="https://www.facebook.com/secret.sharz"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Secret Sharz on Facebook"
          style={styles.socialLink}
        >
          {/* Facebook SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>

        <a
          href="https://www.instagram.com/secret.sharz/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Secret Sharz on Instagram"
          style={styles.socialLink}
        >
          {/* Instagram SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>

        <a
          href="https://www.linkedin.com/company/secret-sharz?trk=public_post_feed-actor-image"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Secret Sharz on LinkedIn"
          style={styles.socialLink}
        >
          {/* LinkedIn SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '10px', margin: 0 }}>
        © {new Date().getFullYear()} Secret Sharz. All rights reserved.
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    backgroundColor: '#0f172a',
    borderTop: '1px solid #334155',
    marginTop: 'auto',
    zIndex: 1000,
    gap: '12px',
  },
  logo: {
    height: '30px',
    width: 'auto',
    opacity: 0.6,
  },
  socialRow: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  socialLink: {
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
  },
};
