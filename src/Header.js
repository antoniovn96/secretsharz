import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from './context/DashboardContext';

// Helper: format relative time
function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Helper: notification priority color
function getNotifColor(priority, isRead) {
  if (isRead) return '#6B7280';
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    default: return '#10B981';
  }
}

export default function Header({ navigate, currentUser, handleLogout, isAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const alertsRef = useRef(null);

  // Safely try to use DashboardContext — it may not be available on all pages
  let notifications = [];
  let unreadCount = 0;
  let markNotificationRead = () => {};
  let markAllNotificationsRead = () => {};
  try {
    const ctx = useDashboard();
    notifications = ctx.notifications || [];
    unreadCount = notifications.filter(n => !n.isRead).length;
    markNotificationRead = ctx.markNotificationRead;
    markAllNotificationsRead = ctx.markAllNotificationsRead;
  } catch (_) {
    // DashboardContext not available — bell icon hidden
  }

  // Close menu / alerts dropdown when pressing escape or clicking outside
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); setIsAlertsOpen(false); }
    };
    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setIsAlertsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

              {/* ── BELL ICON WITH DROPDOWN ── */}
              <div ref={alertsRef} style={{ position: 'relative' }}>
                <button
                  className="bell-btn"
                  onClick={() => setIsAlertsOpen(prev => !prev)}
                  aria-label="Notifications"
                  title="Alerts"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {isAlertsOpen && (
                  <div className="alerts-dropdown">
                    <div className="alerts-dropdown-header">
                      <span className="alerts-dropdown-title">
                        🔔 Alerts
                        {unreadCount > 0 && (
                          <span className="alerts-unread-badge">{unreadCount}</span>
                        )}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          className="alerts-mark-all"
                          onClick={() => markAllNotificationsRead()}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="alerts-dropdown-body">
                      {notifications.length === 0 ? (
                        <div className="alerts-empty">No notifications yet.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="alerts-item"
                            style={{ opacity: notif.isRead ? 0.6 : 1 }}
                            onClick={() => {
                              if (!notif.isRead) markNotificationRead(notif.id);
                              setIsAlertsOpen(false);
                              handleNav('/dashboard');
                            }}
                          >
                            <div
                              className="alerts-dot"
                              style={{ background: notif.isRead ? 'transparent' : getNotifColor(notif.priority, notif.isRead) }}
                            />
                            <div className="alerts-content">
                              <div className="alerts-notif-title">{String(notif.title)}</div>
                              <div className="alerts-notif-msg">
                                {String(notif.message).substring(0, 80)}{notif.message.length > 80 ? '…' : ''}
                              </div>
                              <div className="alerts-notif-time">{relativeTime(notif.timestamp)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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

        /* ── BELL ICON ── */
        .bell-btn {
          position: relative;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .bell-btn:hover {
          background: rgba(255,255,255,0.15);
          transform: scale(1.08);
        }
        .bell-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #EF4444;
          color: white;
          font-size: 9px;
          font-weight: 800;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 1.5px solid #0f172a;
          line-height: 1;
        }

        /* ── ALERTS DROPDOWN ── */
        .alerts-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 340px;
          background: #1E293B;
          border: 1px solid #334155;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.45);
          z-index: 3000;
          overflow: hidden;
          animation: alertsSlideDown 0.2s ease;
        }
        @keyframes alertsSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .alerts-dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .alerts-dropdown-title {
          font-size: 14px;
          font-weight: 700;
          color: #E4E6EB;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .alerts-unread-badge {
          background: #EF4444;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 10px;
        }
        .alerts-mark-all {
          font-size: 11px;
          font-weight: 700;
          color: #60A5FA;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s;
        }
        .alerts-mark-all:hover { color: #93C5FD; }
        .alerts-dropdown-body {
          max-height: 360px;
          overflow-y: auto;
          padding: 6px 0;
        }
        .alerts-dropdown-body::-webkit-scrollbar { width: 4px; }
        .alerts-dropdown-body::-webkit-scrollbar-track { background: transparent; }
        .alerts-dropdown-body::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .alerts-empty {
          padding: 24px 16px;
          text-align: center;
          font-size: 13px;
          color: #6B7280;
        }
        .alerts-item {
          padding: 10px 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .alerts-item:last-child { border-bottom: none; }
        .alerts-item:hover { background: rgba(255,255,255,0.04); }
        .alerts-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .alerts-content { flex: 1; }
        .alerts-notif-title {
          font-size: 12px;
          font-weight: 700;
          color: #E4E6EB;
          line-height: 1.4;
          margin-bottom: 2px;
        }
        .alerts-notif-msg {
          font-size: 11px;
          color: #9CA3AF;
          line-height: 1.5;
        }
        .alerts-notif-time {
          font-size: 10px;
          color: #6B7280;
          font-weight: 600;
          margin-top: 3px;
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
