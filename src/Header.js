import React, { useState, useEffect } from 'react';

export default function Header({ navigate, currentUser, handleLogout, isAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Helper to handle navigation and close menu automatically
  const handleNav = (path) => {
    setIsMenuOpen(false);
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <>
      <header style={styles.header}>
        {/* 1. CLICKABLE & LARGER LOGO */}
        <div 
          className="logo-container" 
          onClick={() => handleNav('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Go to Homepage"
        >
          <img 
            src="/secret-sharz-logo.png" 
            alt="Secret Sharz Logo" 
            style={styles.logo} 
          />
        </div>

        {/* HAMBURGER MENU BUTTON */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Menu"
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </header>

      {/* OVERLAY BACKDROP */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* 3. CREATIVE SIDE DRAWER MENU */}
      <div className={`side-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: 'var(--sage)', fontWeight: 'bold' }}>
            Menu
          </span>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>

        <nav className="drawer-nav">
          <button onClick={() => handleNav('/')} className="drawer-link">
            <span>🏠</span> Home
          </button>
          <button onClick={() => handleNav('/mindspace')} className="drawer-link">
            <span>🧠</span> Mind Space
          </button>
          <button onClick={() => handleNav('/wall')} className="drawer-link">
            <span>💬</span> Sharz Wall
          </button>
          <button onClick={() => handleNav('/vidyavantage')} className="drawer-link highlight-link">
            <span>🎓</span> VidyaVantage
          </button>

          <div className="drawer-divider"></div>

          {currentUser ? (
            <>
              {isAdmin && (
                <button onClick={() => handleNav('/admin')} className="drawer-link admin-link">
                  <span>⚙️</span> Admin Panel
                </button>
              )}
              <button onClick={() => handleNav('/dashboard')} className="drawer-link">
                <span>👤</span> My Dashboard
              </button>
              <button onClick={() => { setIsMenuOpen(false); handleLogout && handleLogout(); }} className="drawer-link logout-link">
                <span>🚪</span> Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('/auth')} className="drawer-link">
                <span>🔑</span> Sign In
              </button>
              <button onClick={() => handleNav('/auth')} className="drawer-cta">
                Join Secret Sharz
              </button>
            </>
          )}
        </nav>
      </div>

      {/* INLINE CSS FOR THE MENU ANIMATIONS */}
      <style>{`
        .hamburger-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 20px;
          width: 30px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }
        .hamburger-line {
          height: 3px;
          width: 100%;
          background-color: var(--sage);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .hamburger-btn:hover .hamburger-line {
          background-color: var(--sage-light);
        }

        /* DRAWER STYLES */
        .side-drawer {
          position: fixed;
          top: 0;
          right: -350px; /* Hidden off-screen by default */
          width: 320px;
          height: 100vh;
          background: var(--ink); /* Dark sleek background */
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          z-index: 2000;
          transition: right 0.4s cubic-bezier(0.82, 0.085, 0.395, 0.895);
          display: flex;
          flex-direction: column;
          padding: 30px;
        }
        .side-drawer.open {
          right: 0; /* Slides in */
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 15px;
        }
        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover {
          background: var(--danger);
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .drawer-link {
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          padding: 12px 15px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .drawer-link span {
          font-size: 20px;
        }
        .drawer-link:hover {
          background: rgba(255,255,255,0.05);
          color: var(--sage-light);
          transform: translateX(5px);
        }

        .highlight-link {
          background: rgba(124, 111, 160, 0.15); /* Lavender pale */
          color: var(--lav-pale);
        }
        .highlight-link:hover {
          background: var(--lavender);
          color: white;
        }

        .admin-link {
          color: #F59E0B; /* Warning yellow */
        }
        .logout-link {
          color: var(--danger);
        }
        .logout-link:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .drawer-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 15px 0;
        }

        .drawer-cta {
          background: var(--sage);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          margin-top: 10px;
        }
        .drawer-cta:hover {
          background: var(--moss);
          transform: translateY(-2px);
        }

        /* Mobile adjustments */
        @media (max-width: 600px) {
          .side-drawer {
            width: 80vw;
            right: -80vw;
          }
        }
      `}</style>
    </>
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
    zIndex: 1000, 
    position: 'sticky', // Makes header sticky if desired
    top: 0
  },
  logo: {
    height: '65px', // Increased from 40px to make it much more visible
    width: 'auto',
    transition: 'transform 0.2s ease'
  }
};
