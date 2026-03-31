import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <img 
        src="/secret-sharz-logo.png" 
        alt="Secret Sharz Logo" 
        style={styles.logo} 
      />
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
    padding: '20px',
    backgroundColor: '#0f172a',
    borderTop: '1px solid #334155',
    marginTop: 'auto', // Pushes footer to the bottom of the screen
    zIndex: 1000
  },
  logo: {
    height: '30px',
    width: 'auto',
    opacity: 0.6 
  }
};
