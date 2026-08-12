import React, { useEffect, useRef, useState } from 'react';
import { useDashboard } from './context/DashboardContext';

/**
 * Secret Sharz Foundation Header
 *
 * Accessibility-first navigation for the public and authenticated shell.
 * Security note: visibility of admin controls is UX only. Authorisation must
 * be enforced by Firebase Security Rules / trusted server code.
 */
export default function Header({ navigate, currentUser, handleLogout, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [pathReady, setPathReady] = useState(false);
  const alertsRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  let notifications = [];
  let unreadCount = 0;
  let markNotificationRead = () => {};
  let markAllNotificationsRead = () => {};

  try {
    const ctx = useDashboard();
    notifications = ctx.notifications || [];
    unreadCount = notifications.filter((n) => !n.isRead).length;
    markNotificationRead = ctx.markNotificationRead || (() => {});
    markAllNotificationsRead = ctx.markAllNotificationsRead || (() => {});
  } catch (_) {
    // DashboardContext is not available on some public routes.
  }

  useEffect(() => {
    const updatePath = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      setCurrentPath(path);
      setPathReady(true);
    };

    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem('secretsharz-reduced-motion');
    const systemReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(saved === 'true' || (saved === null && systemReduced));

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setAlertsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) firstMenuItemRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target)) setAlertsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const toggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    window.localStorage.setItem('secretsharz-reduced-motion', String(next));
    document.documentElement.dataset.reducedMotion = next ? 'true' : 'false';
  };

  const go = (path) => {
    setMenuOpen(false);
    setAlertsOpen(false);
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Support', path: '/mindspace' },
    { label: 'Career', path: '/vidyavantage' },
    { label: 'Community', path: '/wall' },
    { label: 'Resources', path: '/resources' },
    { label: 'About', path: '/about' },
  ];

  if (currentPath.startsWith('/admin')) return null;

  const relativeTime = (value) => {
    if (!value) return '';
    const diff = Date.now() - new Date(value).getTime();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <a className="ss-skip-link" href="#main-content">Skip to main content</a>

      <header className="ss-header" data-reduced-motion={reducedMotion ? 'true' : 'false'}>
        <div className="ss-header-inner">
          <button className="ss-brand" onClick={() => go('/')} aria-label="Secret Sharz home">
            <img src="/secret-sharz-logo.png" alt="Secret Sharz" className="ss-brand-logo" />
          </button>

          <nav className="ss-desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive = pathReady && currentPath === item.path;
              return (
                <button
                  key={item.path}
                  className={`ss-nav-link ${isActive ? 'is-active' : ''}`}
                  onClick={() => go(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="ss-header-actions">
            <button
              className="ss-accessibility-btn"
              onClick={toggleReducedMotion}
              aria-pressed={reducedMotion}
              title={reducedMotion ? 'Animations reduced' : 'Reduce motion'}
            >
              {reducedMotion ? 'Motion reduced' : 'Reduce motion'}
            </button>

            {currentUser && (
              <div className="ss-alert-wrap" ref={alertsRef}>
                <button
                  className="ss-icon-btn"
                  onClick={() => setAlertsOpen((open) => !open)}
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  aria-expanded={alertsOpen}
                  aria-haspopup="dialog"
                >
                  <span aria-hidden="true">🔔</span>
                  {unreadCount > 0 && <span className="ss-alert-badge" aria-hidden="true">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>

                {alertsOpen && (
                  <section className="ss-alert-panel" role="dialog" aria-label="Notifications">
                    <div className="ss-alert-heading">
                      <h2>Notifications</h2>
                      {unreadCount > 0 && (
                        <button className="ss-text-btn" onClick={markAllNotificationsRead}>Mark all as read</button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="ss-alert-empty">You have no new notifications.</p>
                    ) : (
                      <div className="ss-alert-list">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            className={`ss-alert-item ${notification.isRead ? 'is-read' : ''}`}
                            onClick={() => {
                              if (!notification.isRead) markNotificationRead(notification.id);
                              go('/dashboard');
                            }}
                          >
                            <span className="ss-alert-dot" aria-hidden="true" />
                            <span>
                              <strong>{String(notification.title || 'Notification')}</strong>
                              <span>{String(notification.message || '')}</span>
                              <small>{relativeTime(notification.timestamp)}</small>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}

            {currentUser ? (
              <>
                {isAdmin && <button className="ss-admin-link" onClick={() => go('/admin')}>Admin</button>}
                <button className="ss-dashboard-btn" onClick={() => go('/dashboard')}>My space</button>
                <button className="ss-signout-btn" onClick={() => handleLogout?.()}>Sign out</button>
              </>
            ) : (
              <button className="ss-join-btn" onClick={() => go('/auth')}>Join Secret Sharz</button>
            )}
          </div>

          <button
            className="ss-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="secretsharz-mobile-menu"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="ss-mobile-layer" role="presentation">
          <button className="ss-mobile-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu" />
          <aside
            id="secretsharz-mobile-menu"
            className="ss-mobile-menu"
            aria-label="Mobile navigation"
            aria-modal="true"
            role="dialog"
          >
            <div className="ss-mobile-heading">
              <span>Secret Sharz</span>
              <button className="ss-icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">×</button>
            </div>

            <nav className="ss-mobile-nav" aria-label="Mobile primary navigation">
              {navItems.map((item, index) => {
                const isActive = pathReady && currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    ref={index === 0 ? firstMenuItemRef : undefined}
                    className={`ss-mobile-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => go(item.path)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="ss-mobile-divider" />
            <button className="ss-mobile-link" onClick={toggleReducedMotion} aria-pressed={reducedMotion}>
              {reducedMotion ? '✓ Motion reduced' : 'Reduce motion'}
            </button>
            {currentUser ? (
              <>
                {isAdmin && <button className="ss-mobile-link" onClick={() => go('/admin')}>Admin</button>}
                <button className="ss-mobile-link" onClick={() => go('/dashboard')}>My space</button>
                <button className="ss-mobile-link danger" onClick={() => { setMenuOpen(false); handleLogout?.(); }}>Sign out</button>
              </>
            ) : (
              <button className="ss-mobile-join" onClick={() => go('/auth')}>Join Secret Sharz</button>
            )}
          </aside>
        </div>
      )}

      <style>{`
        .ss-skip-link{position:fixed;left:16px;top:-100px;z-index:10000;background:#17352a;color:#fff;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.2)}
        .ss-skip-link:focus{top:16px;outline:3px solid #F4C95D;outline-offset:3px}
        .ss-header{position:sticky;top:0;z-index:3000;background:rgba(253,252,250,.96);border-bottom:1px solid rgba(30,40,32,.12);backdrop-filter:blur(16px)}
        .ss-header-inner{max-width:1440px;margin:0 auto;min-height:72px;padding:10px 28px;display:flex;align-items:center;gap:24px}
        .ss-brand{border:0;background:none;padding:4px;display:flex;align-items:center;cursor:pointer;border-radius:12px}
        .ss-brand-logo{display:block;height:42px;width:auto}
        .ss-desktop-nav{display:flex;align-items:center;gap:4px;margin-left:auto}
        .ss-nav-link,.ss-admin-link,.ss-signout-btn,.ss-text-btn{font:inherit;border:0;background:transparent;cursor:pointer}
        .ss-nav-link{color:#33443a;font-size:14px;font-weight:650;padding:10px 12px;border-radius:10px}
        .ss-nav-link:hover,.ss-nav-link.is-active{background:#EBF4EE;color:#24583a}
        .ss-nav-link:focus-visible,.ss-admin-link:focus-visible,.ss-signout-btn:focus-visible,.ss-accessibility-btn:focus-visible,.ss-icon-btn:focus-visible,.ss-dashboard-btn:focus-visible,.ss-join-btn:focus-visible,.ss-menu-btn:focus-visible,.ss-mobile-link:focus-visible,.ss-mobile-join:focus-visible{outline:3px solid #1F6B46;outline-offset:3px}
        .ss-header-actions{display:flex;align-items:center;gap:8px}
        .ss-accessibility-btn{border:1px solid #9CAAA0;background:#fff;color:#26372d;border-radius:10px;padding:9px 11px;font-size:12px;font-weight:700;cursor:pointer}
        .ss-icon-btn{position:relative;width:42px;height:42px;border-radius:11px;border:1px solid #CBD5CE;background:#fff;color:#20352a;cursor:pointer;font-size:18px}
        .ss-alert-badge{position:absolute;right:-5px;top:-5px;min-width:19px;height:19px;padding:0 5px;border-radius:99px;background:#B42318;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}
        .ss-dashboard-btn,.ss-join-btn{border:0;background:#2E6B4A;color:#fff;border-radius:12px;padding:11px 16px;font-weight:800;cursor:pointer}
        .ss-dashboard-btn:hover,.ss-join-btn:hover{background:#214F37}
        .ss-admin-link{color:#8A5B00;font-size:13px;font-weight:800;padding:9px}
        .ss-signout-btn{color:#7A2E2E;font-size:13px;font-weight:750;padding:9px}
        .ss-menu-btn{display:none;width:44px;height:44px;border-radius:11px;border:1px solid #CBD5CE;background:#fff;font-size:24px;cursor:pointer;color:#1E2820}
        .ss-alert-wrap{position:relative}
        .ss-alert-panel{position:absolute;right:0;top:52px;width:min(390px,calc(100vw - 32px));background:#fff;border:1px solid #D7DED9;border-radius:18px;box-shadow:0 20px 60px rgba(30,40,32,.16);overflow:hidden}
        .ss-alert-heading{padding:16px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E7ECE8}
        .ss-alert-heading h2{font-size:16px;margin:0;color:#1E2820}
        .ss-text-btn{font-size:12px;color:#24583a;font-weight:800}
        .ss-alert-empty{padding:24px;color:#66736b;font-size:14px}
        .ss-alert-list{max-height:420px;overflow:auto}
        .ss-alert-item{width:100%;display:grid;grid-template-columns:10px 1fr;gap:10px;text-align:left;padding:14px 18px;border:0;border-bottom:1px solid #EEF1EF;background:#fff;cursor:pointer;color:#1E2820}
        .ss-alert-item:hover{background:#F7FAF8}
        .ss-alert-item.is-read{opacity:.65}
        .ss-alert-item strong,.ss-alert-item span,.ss-alert-item small{display:block}
        .ss-alert-item strong{font-size:13px;margin-bottom:3px}.ss-alert-item span{font-size:12px;color:#56635B}.ss-alert-item small{font-size:11px;color:#849088;margin-top:4px}
        .ss-alert-dot{width:7px;height:7px;background:#2E6B4A;border-radius:50%;margin-top:5px}
        .ss-mobile-layer{position:fixed;inset:0;z-index:4000}
        .ss-mobile-backdrop{position:absolute;inset:0;border:0;background:rgba(15,23,42,.5);cursor:pointer}
        .ss-mobile-menu{position:absolute;right:0;top:0;height:100%;width:min(380px,92vw);background:#FDFCFA;box-shadow:-20px 0 70px rgba(0,0,0,.2);padding:24px;overflow:auto}
        .ss-mobile-heading{display:flex;align-items:center;justify-content:space-between;font-family:Fraunces,serif;font-size:24px;font-weight:700;color:#24583a;margin-bottom:24px}
        .ss-mobile-nav{display:flex;flex-direction:column;gap:6px}.ss-mobile-link{border:0;background:transparent;text-align:left;color:#24342b;font:inherit;font-size:17px;font-weight:700;padding:14px 12px;border-radius:12px;cursor:pointer}.ss-mobile-link:hover,.ss-mobile-link.is-active{background:#EBF4EE;color:#24583a}.ss-mobile-link.danger{color:#8B2E2E}.ss-mobile-divider{height:1px;background:#DCE3DE;margin:18px 0}.ss-mobile-join{width:100%;border:0;background:#2E6B4A;color:#fff;border-radius:12px;padding:14px;font:inherit;font-weight:800;cursor:pointer;margin-top:8px}
        @media(max-width:1100px){.ss-desktop-nav{display:none}.ss-header-actions{margin-left:auto}.ss-menu-btn{display:block}}
        @media(max-width:680px){.ss-header-inner{padding:10px 16px}.ss-brand-logo{height:38px}.ss-header-actions{gap:4px}.ss-accessibility-btn,.ss-admin-link,.ss-signout-btn{display:none}.ss-dashboard-btn,.ss-join-btn{padding:9px 12px;font-size:12px}}
        @media(prefers-reduced-motion:reduce){.ss-header *{scroll-behavior:auto!important}}
      `}</style>
    </>
  );
}
