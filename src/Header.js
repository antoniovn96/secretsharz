import React from 'react';

export default function Header() {
  return (
    <header style={styles.header}>
      <div className="logo-container">
        {/* This path automatically looks in your new public folder */}
        <img 
          src="/secret-sharz-logo.png" 
          alt="Secret Sharz Logo" 
          style={styles.logo} 
        />
      </div>
      <nav>
        {/* You can add navigation links here later */}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #334155',
    zIndex: 1000 // Ensures it stays above other content
  },
  logo: {
    height: '40px', // Adjust this to fit your logo
    width: 'auto'
  }
};
