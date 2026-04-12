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

    // 🚀 THE FIX: If navigating to the main blog page while inside a specific post,
    // force a clean navigation to reset the Blog component's internal state.
    if (path === '/blog' && window.location.pathname.startsWith('/blog/')) {
      window.location.href = '/blog';
      return;
    }

    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <>
      <header className="main-header">
        {/* CLICKABLE LOGO */}
        <div 
          className="logo-container" 
          onClick={() => handleNav('/')}
          title="Go to Homepage"
        >
          <img 
            src="/secret-sharz-logo.png" 
            alt="Secret Sharz Logo" 
            className="header-logo"
          />
        </div>

        {/* DESKTOP NAVIGATION (Visible on larger screens) */}
        <nav className="desktop-nav">
          <button onClick={() => handleNav('/')} className="nav-link">Home</button>
          
          {/* ABOUT US (Moved before Mind Space, styling fixed) */}
          <button onClick={() => handleNav('/about')} className="nav-link">About Us</button>          
          
          <button onClick={() => handleNav('/mindspace')} className="nav-link">Mind Space</button>
          <button onClick={() => handleNav('/resources')} className="nav-link">Resources</button>
          <button onClick={() => handleNav('/wall')} className="nav-link">Sharz Wall</button>
          <button onClick={() => handleNav('/blog')} className="nav-link">Blog</button>
          <button onClick={() => handleNav('/vidyavantage')} className="nav-link highlight-link">VidyaVantage</button>

          <div className="nav-divider"></div>

          {currentUser ? (
            <>
              {isAdmin && (
                <button onClick={() => handleNav('/admin')} className="nav-link admin-link">Admin Panel</button>
              )}
              <button onClick={() => handleNav('/dashboard')} className="nav-link">My Dashboard</button>
              <button onClick={() => handleLogout && handleLogout()} className="nav-link logout-link">Sign Out</button>
            </>
          ) : (
            <button onClick={() => handleNav('/auth')} className="nav-cta">
              Sign In / Join
            </button>
          )}
        </nav>

        {/* MOBILE HAMBURGER BUTTON (Visible only on small screens) */}
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

      {/* OVERLAY BACKDROP FOR MOBILE MENU */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* MOBILE SIDE DRAWER MENU */}
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
          
          {/* ABOUT US ADDED HERE FOR MOBILE (Before Mind Space) */}
          <button onClick={() => handleNav('/about')} className="drawer-link">
            <span>ℹ️</span> About Us
          </button>

          <button onClick={() => handleNav('/mindspace')} className="drawer-link">
            <span>🧠</span> Mind Space
          </button>
          <button onClick={() => handleNav('/resources')} className="drawer-link">
            <span>📚</span> Resources
          </button>
          <button onClick={() => handleNav('/wall')} className="drawer-link">
            <span>💬</span> Sharz Wall
          </button>
          <button onClick={() => handleNav('/blog')} className="drawer-link">
            <span>📰</span> Blog
          </button>
          <button onClick={() => handleNav('/vidyavantage')} className="drawer-link highlight-link-mobile">
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
              <button onClick={() => handleNav('/auth')} className="drawer-cta-mobile">
                Join Secret Sharz
              </button>
            </>
          )}
        </nav>
      </div>

      {/* CSS STYLES */}
      <style>{`
        /* MAIN HEADER */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 48px;
          background-color: #0f172a;
          border-bottom: 1px solid #334155;
          z-index: 1000;
          position: sticky;
          top: 0;
          height: 65px;
        }

        .logo-container {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .header-logo {
          height: 40px;
          width: auto;
          transition: transform 0.2s ease;
        }

        /* DESKTOP NAVIGATION */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 8px 12px;
          border-radius: 8px;
        }
        
        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .highlight-link {
          color: #E8650A;
          font-weight: 600;
        }
        .highlight-link:hover {
          color: #F0A500;
        }

        .nav-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 5px;
        }

        .admin-link {
          color: #F59E0B;
        }
        .logout-link {
          color: #ef4444;
        }

        .nav-cta {
          background: var(--sage, #4A7C59);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .nav-cta:hover {
          background: var(--moss, #2D5240);
          transform: translateY(-1px);
        }

        /* HAMBURGER BUTTON */
        .hamburger-btn {
          display: none;
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
          background-color: white;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        /* DRAWER STYLES */
        .side-drawer {
          position: fixed;
          top: 0;
          right: -350px;
          width: 320px;
          height: 100vh;
          background: #0f172a;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          z-index: 2000;
          transition: right 0.4s cubic-bezier(0.82, 0.085, 0.395, 0.895);
          display: flex;
          flex-direction: column;
          padding: 30px;
        }
        .side-drawer.open {
          right: 0;
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
          background: #ef4444;
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .drawer-link {
          background: transparent;
          border: none;
          color: white;
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
          transform: translateX(5px);
        }

        .highlight-link-mobile {
          background: rgba(232, 101, 10, 0.15); 
          color: #F0A500;
        }

        .drawer-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 15px 0;
        }

        .drawer-cta-mobile {
          background: var(--sage, #4A7C59);
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

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 950px) {
          .main-header {
            padding: 10px 24px;
          }
          .desktop-nav {
            display: none;
          }
          .hamburger-btn {
            display: flex;
          }
          .side-drawer {
            width: 80vw;
            right: -80vw;
          }
        }
      `}</style>
    </>
  );
}
