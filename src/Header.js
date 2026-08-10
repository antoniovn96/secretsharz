import React, { useEffect, useRef, useState } from 'react';
import { useDashboard } from './context/DashboardContext';

/**
 * Secret Sharz canonical public navigation.
 *
 * Information architecture is task-based rather than organisational:
 * Support, Career, Community, Learn and About. Detailed destinations are
 * progressively disclosed in click/keyboard-operated panels so the header
 * remains calm without hiding important functionality.
 *
 * Security note: visible Admin controls are UX only. Authorisation must be
 * enforced by Firebase Security Rules and trusted server code.
 */
const NAV_GROUPS = [
  {
    label: 'Support',
    items: [
      { label: 'MindSpace', description: 'A calmer place to reflect and begin.', path: '/mindspace' },
      { label: 'Professional support', description: 'Explore support and connect when you are ready.', path: '/mindspace' },
    ],
  },
  {
    label: 'Career',
    items: [
      { label: 'VidyaVantage', description: 'Explore yourself, careers and pathways.', path: '/vidyavantage' },
      { label: 'Career paths', description: 'Explore possible directions for your future.', path: '/career-paths' },
      { label: 'Colleges', description: 'Explore colleges and education options.', path: '/colleges' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Sharz Wall', description: 'Read and share human experiences safely.', path: '/wall' },
      { label: 'Blog', description: 'Longer conversations, ideas and reflections.', path: '/blog' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { label: 'Resources', description: 'Practical information and self-help resources.', path: '/resources' },
      { label: 'Videos & events', description: 'Watch the official Secret Sharz video library and recordings.', path: '/videos' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About Secret Sharz', description: 'Why Secret Sharz exists and how it works.', path: '/about' },
    ],
  },
];

function useNotifications() {
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
    // Public routes may not have a DashboardContext.
  }

  return { notifications, unreadCount, markNotificationRead, markAllNotificationsRead };
}

function NavAnchor({ item, navigate, onNavigate, className = '' }) {
  const handleClick = (event) => {
    if (!navigate) return;
    event.preventDefault();
    onNavigate?.();
    navigate(item.path);
  };

  return (
    <a className={className} href={item.path} onClick={handleClick}>
      <span>{item.label}</span>
      {item.description ? <small>{item.description}</small> : null}
    </a>
  );
}

export default function Header({ navigate, currentUser, handleLogout, isAdmin }) {
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const headerRef = useRef(null);
  const mobileRef = useRef(null);
  const menuButtonRef = useRef(null);
  const groupButtonRefs = useRef({});
  const alertsRef = useRef(null);
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useNotifications();

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const activeGroup = NAV_GROUPS.find((group) => group.items.some((item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`)))?.label;

  useEffect(() => {
    const saved = window.localStorage.getItem('secretsharz-reduced-motion');
    const systemReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const initial = saved === 'true' || (saved === null && systemReduced);
    setReducedMotion(initial);
    document.documentElement.dataset.reducedMotion = initial ? 'true' : 'false';
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (mobileOpen) {
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        } else if (openGroup) {
          setOpenGroup(null);
          groupButtonRefs.current[openGroup]?.focus();
        } else if (alertsOpen) {
          setAlertsOpen(false);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, openGroup, alertsOpen]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenGroup(null);
        setAlertsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.activeElement;
    const root = mobileRef.current;
    const selector = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusable = () => Array.from(root?.querySelectorAll(selector) || []);
    requestAnimationFrame(() => focusable()[0]?.focus());

    const trap = (event) => {
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      previous?.focus?.();
    };
  }, [mobileOpen]);

  const go = (path) => {
    setOpenGroup(null);
    setAlertsOpen(false);
    setMobileOpen(false);
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const toggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    window.localStorage.setItem('secretsharz-reduced-motion', String(next));
    document.documentElement.dataset.reducedMotion = next ? 'true' : 'false';
  };

  const relativeTime = (value) => {
    if (!value) return '';
    const diff = Date.now() - new Date(value).getTime();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (currentPath.startsWith('/admin')) return null;

  return (
    <>
      <a className="ss-skip-link" href="#main-content">Skip to main content</a>

      <header ref={headerRef} className="ss-header" data-reduced-motion={reducedMotion ? 'true' : 'false'}>
        <div className="ss-header-inner">
          <a className="ss-brand" href="/" aria-label="Secret Sharz home" onClick={(event) => { if (!navigate) return; event.preventDefault(); go('/'); }}>
            <img src="/secret-sharz-logo.png" alt="Secret Sharz" className="ss-brand-logo" />
          </a>

          <nav className="ss-desktop-nav" aria-label="Primary navigation">
            <ul className="ss-nav-list">
              {NAV_GROUPS.map((group) => {
                const isOpen = openGroup === group.label;
                const isActive = activeGroup === group.label;
                const buttonId = `ss-nav-${group.label.toLowerCase()}`;
                const panelId = `${buttonId}-panel`;
                return (
                  <li key={group.label} className="ss-nav-item">
                    <button
                      ref={(node) => { groupButtonRefs.current[group.label] = node; }}
                      id={buttonId}
                      type="button"
                      className={`ss-nav-trigger ${isActive ? 'is-active' : ''}`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenGroup(isOpen ? null : group.label)}
                    >
                      {group.label}<span aria-hidden="true" className="ss-nav-chevron">⌄</span>
                    </button>
                    {isOpen && (
                      <div id={panelId} className="ss-nav-panel" role="region" aria-labelledby={buttonId}>
                        <div className="ss-nav-panel-inner">
                          {group.items.map((item) => (
                            <NavAnchor key={`${group.label}-${item.path}-${item.label}`} item={item} navigate={navigate} onNavigate={() => setOpenGroup(null)} className={`ss-nav-card ${currentPath === item.path || currentPath.startsWith(`${item.path}/`) ? 'is-current' : ''}`} />
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ss-header-actions">
            <button className="ss-accessibility-btn" type="button" onClick={toggleReducedMotion} aria-pressed={reducedMotion} title="Toggle reduced motion">
              {reducedMotion ? 'Motion reduced' : 'Reduce motion'}
            </button>

            {currentUser && (
              <div className="ss-alert-wrap" ref={alertsRef}>
                <button className="ss-icon-btn" type="button" onClick={() => setAlertsOpen((open) => !open)} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={alertsOpen} aria-controls="ss-notifications">
                  <span aria-hidden="true">🔔</span>
                  {unreadCount > 0 && <span className="ss-alert-badge" aria-hidden="true">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
                {alertsOpen && (
                  <section id="ss-notifications" className="ss-alert-panel" aria-label="Notifications">
                    <div className="ss-alert-heading">
                      <h2>Notifications</h2>
                      {unreadCount > 0 && <button className="ss-text-btn" type="button" onClick={markAllNotificationsRead}>Mark all as read</button>}
                    </div>
                    {notifications.length === 0 ? <p className="ss-alert-empty">You have no new notifications.</p> : (
                      <div className="ss-alert-list">
                        {notifications.map((notification) => (
                          <button key={notification.id} type="button" className={`ss-alert-item ${notification.isRead ? 'is-read' : ''}`} onClick={() => { if (!notification.isRead) markNotificationRead(notification.id); go('/dashboard'); }}>
                            <span className="ss-alert-dot" aria-hidden="true" />
                            <span><strong>{String(notification.title || 'Notification')}</strong><span>{String(notification.message || '')}</span><small>{relativeTime(notification.timestamp)}</small></span>
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
                {isAdmin && <button className="ss-admin-link" type="button" onClick={() => go('/admin')}>Admin</button>}
                <button className="ss-dashboard-btn" type="button" onClick={() => go('/dashboard')}>My space</button>
                <button className="ss-signout-btn" type="button" onClick={() => handleLogout?.()}>Sign out</button>
              </>
            ) : <button className="ss-join-btn" type="button" onClick={() => go('/auth')}>Join Secret Sharz</button>}
          </div>

          <button ref={menuButtonRef} className="ss-menu-btn" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileOpen} aria-controls="secretsharz-mobile-menu">
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="ss-mobile-layer">
          <button className="ss-mobile-backdrop" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" />
          <aside ref={mobileRef} id="secretsharz-mobile-menu" className="ss-mobile-menu" role="dialog" aria-modal="true" aria-labelledby="ss-mobile-title">
            <div className="ss-mobile-heading"><span id="ss-mobile-title">Secret Sharz</span><button className="ss-icon-btn" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu">×</button></div>
            <nav aria-label="Mobile primary navigation">
              <ul className="ss-mobile-nav">
                <li><NavAnchor item={{ label: 'Home', path: '/' }} navigate={navigate} onNavigate={() => setMobileOpen(false)} className="ss-mobile-link" /></li>
                {NAV_GROUPS.map((group) => (
                  <li key={group.label} className="ss-mobile-group">
                    <details open={activeGroup === group.label}>
                      <summary className={activeGroup === group.label ? 'is-active' : ''}>{group.label}</summary>
                      <ul>{group.items.map((item) => <li key={`${group.label}-${item.path}-${item.label}`}><NavAnchor item={item} navigate={navigate} onNavigate={() => setMobileOpen(false)} className="ss-mobile-sublink" /></li>)}</ul>
                    </details>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="ss-mobile-divider" />
            <button className="ss-mobile-link" type="button" onClick={toggleReducedMotion} aria-pressed={reducedMotion}>{reducedMotion ? '✓ Motion reduced' : 'Reduce motion'}</button>
            {currentUser ? <>{isAdmin && <button className="ss-mobile-link" type="button" onClick={() => go('/admin')}>Admin</button>}<button className="ss-mobile-link" type="button" onClick={() => go('/dashboard')}>My space</button><button className="ss-mobile-link danger" type="button" onClick={() => { setMobileOpen(false); handleLogout?.(); }}>Sign out</button></> : <button className="ss-mobile-join" type="button" onClick={() => go('/auth')}>Join Secret Sharz</button>}
          </aside>
        </div>
      )}

      <style>{`
        .ss-skip-link{position:fixed;left:16px;top:-100px;z-index:10000;background:#17352a;color:#fff;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.2)}.ss-skip-link:focus{top:16px;outline:3px solid #F4C95D;outline-offset:3px}
        .ss-header{position:sticky;top:0;z-index:3000;background:rgba(253,252,250,.97);border-bottom:1px solid rgba(30,40,32,.12);backdrop-filter:blur(16px)}.ss-header-inner{max-width:1440px;margin:0 auto;min-height:72px;padding:10px 28px;display:flex;align-items:center;gap:18px}.ss-brand{border-radius:12px;padding:4px;display:flex;align-items:center;flex:0 0 auto}.ss-brand-logo{display:block;height:42px;width:auto}.ss-desktop-nav{margin-left:auto}.ss-nav-list{display:flex;align-items:center;gap:2px;list-style:none;margin:0;padding:0}.ss-nav-item{position:relative}.ss-nav-trigger{min-height:44px;padding:10px 11px;border:0;background:transparent;color:#33443a;border-radius:10px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px}.ss-nav-trigger:hover,.ss-nav-trigger.is-active,.ss-nav-trigger[aria-expanded="true"]{background:#EBF4EE;color:#24583a}.ss-nav-chevron{font-size:14px;line-height:1;transition:transform .18s ease}.ss-nav-trigger[aria-expanded="true"] .ss-nav-chevron{transform:rotate(180deg)}
        .ss-nav-panel{position:absolute;left:50%;top:calc(100% + 8px);transform:translateX(-50%);width:min(620px,calc(100vw - 32px));background:#FDFCFA;border:1px solid #D7DED9;border-radius:18px;box-shadow:0 22px 70px rgba(30,40,32,.16);padding:10px;z-index:3100}.ss-nav-panel-inner{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.ss-nav-card{display:block;text-decoration:none;color:#24342b;padding:14px;border-radius:13px}.ss-nav-card:hover,.ss-nav-card:focus-visible,.ss-nav-card.is-current{background:#EBF4EE;color:#24583a}.ss-nav-card span{display:block;font-weight:800;font-size:14px}.ss-nav-card small{display:block;color:#66736b;font-size:12px;line-height:1.45;margin-top:4px}
        .ss-header-actions{display:flex;align-items:center;gap:7px}.ss-accessibility-btn{min-height:44px;border:1px solid #9CAAA0;background:#fff;color:#26372d;border-radius:10px;padding:9px 11px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap}.ss-icon-btn{position:relative;width:44px;height:44px;border-radius:11px;border:1px solid #CBD5CE;background:#fff;color:#20352a;cursor:pointer;font-size:18px}.ss-alert-badge{position:absolute;right:-5px;top:-5px;min-width:19px;height:19px;padding:0 5px;border-radius:99px;background:#B42318;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}.ss-dashboard-btn,.ss-join-btn{min-height:44px;border:0;background:#2E6B4A;color:#fff;border-radius:12px;padding:10px 15px;font-weight:800;cursor:pointer;white-space:nowrap}.ss-dashboard-btn:hover,.ss-join-btn:hover{background:#214F37}.ss-admin-link,.ss-signout-btn,.ss-text-btn{min-height:44px;font:inherit;border:0;background:transparent;cursor:pointer}.ss-admin-link{color:#8A5B00;font-size:13px;font-weight:800;padding:8px}.ss-signout-btn{color:#7A2E2E;font-size:13px;font-weight:750;padding:8px}.ss-menu-btn{display:none;width:44px;height:44px;border-radius:11px;border:1px solid #CBD5CE;background:#fff;font-size:24px;cursor:pointer;color:#1E2820}
        .ss-alert-wrap{position:relative}.ss-alert-panel{position:absolute;right:0;top:52px;width:min(390px,calc(100vw - 32px));background:#fff;border:1px solid #D7DED9;border-radius:18px;box-shadow:0 20px 60px rgba(30,40,32,.16);overflow:hidden}.ss-alert-heading{padding:16px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E7ECE8}.ss-alert-heading h2{font-size:16px;margin:0;color:#1E2820}.ss-text-btn{font-size:12px;color:#24583a;font-weight:800}.ss-alert-empty{padding:24px;color:#66736b;font-size:14px}.ss-alert-list{max-height:420px;overflow:auto}.ss-alert-item{width:100%;display:grid;grid-template-columns:10px 1fr;gap:10px;text-align:left;padding:14px 18px;border:0;border-bottom:1px solid #EEF1EF;background:#fff;cursor:pointer;color:#1E2820}.ss-alert-item:hover{background:#F7FAF8}.ss-alert-item.is-read{opacity:.65}.ss-alert-item strong,.ss-alert-item span,.ss-alert-item small{display:block}.ss-alert-item strong{font-size:13px;margin-bottom:3px}.ss-alert-item span{font-size:12px;color:#56635B}.ss-alert-item small{font-size:11px;color:#849088;margin-top:4px}.ss-alert-dot{width:7px;height:7px;background:#2E6B4A;border-radius:50%;margin-top:5px}
        .ss-mobile-layer{position:fixed;inset:0;z-index:4000}.ss-mobile-backdrop{position:absolute;inset:0;border:0;background:rgba(15,23,42,.5);cursor:pointer}.ss-mobile-menu{position:absolute;right:0;top:0;height:100%;width:min(400px,94vw);background:#FDFCFA;box-shadow:-20px 0 70px rgba(0,0,0,.2);padding:24px;overflow:auto}.ss-mobile-heading{display:flex;align-items:center;justify-content:space-between;font-family:Fraunces,serif;font-size:24px;font-weight:700;color:#24583a;margin-bottom:20px}.ss-mobile-nav,.ss-mobile-nav ul{list-style:none;margin:0;padding:0}.ss-mobile-group{border-bottom:1px solid #E3E8E4}.ss-mobile-group details summary{list-style:none;cursor:pointer;min-height:52px;display:flex;align-items:center;justify-content:space-between;padding:12px;color:#24342b;font-size:17px;font-weight:800}.ss-mobile-group details summary::-webkit-details-marker{display:none}.ss-mobile-group details summary::after{content:'+';font-size:22px;font-weight:400}.ss-mobile-group details[open] summary::after{content:'−'}.ss-mobile-group details summary.is-active{color:#24583a;background:#EBF4EE;border-radius:12px}.ss-mobile-group details ul{padding:0 0 8px 12px}.ss-mobile-link,.ss-mobile-sublink{display:block;width:100%;text-align:left;color:#24342b;font:inherit;font-size:16px;font-weight:700;padding:13px 12px;border-radius:12px;text-decoration:none;background:transparent;border:0;cursor:pointer;min-height:44px}.ss-mobile-sublink{font-size:15px;font-weight:600;color:#536158}.ss-mobile-link:hover,.ss-mobile-sublink:hover,.ss-mobile-sublink:focus-visible{background:#F0F5F1;color:#24583a}.ss-mobile-divider{height:1px;background:#DCE3DE;margin:18px 0}.ss-mobile-join{width:100%;min-height:48px;border:0;background:#2E6B4A;color:#fff;border-radius:12px;padding:14px;font:inherit;font-weight:800;cursor:pointer;margin-top:8px}
        :where(.ss-nav-trigger,.ss-nav-card,.ss-brand,.ss-accessibility-btn,.ss-icon-btn,.ss-dashboard-btn,.ss-join-btn,.ss-admin-link,.ss-signout-btn,.ss-text-btn,.ss-menu-btn,.ss-mobile-link,.ss-mobile-sublink,.ss-mobile-join):focus-visible{outline:3px solid #1F6B46;outline-offset:3px}
        @media(max-width:1180px){.ss-header-inner{gap:10px;padding-inline:20px}.ss-nav-trigger{padding-inline:8px;font-size:13px}.ss-accessibility-btn{font-size:11px}.ss-header-actions{gap:4px}.ss-dashboard-btn,.ss-join-btn{padding-inline:12px}}
        @media(max-width:980px){.ss-desktop-nav,.ss-header-actions{display:none}.ss-menu-btn{display:block;margin-left:auto}.ss-header-inner{min-height:68px;padding:10px 16px}}@media(max-width:640px){.ss-brand-logo{height:38px}.ss-mobile-menu{padding:18px}.ss-nav-panel{width:calc(100vw - 24px)}.ss-nav-panel-inner{grid-template-columns:1fr}}
        @media(prefers-reduced-motion:reduce){.ss-nav-chevron{transition:none}.ss-nav-card,.ss-mobile-sublink{transition:none}}@media(max-width:980px){html[data-reduced-motion="true"] *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}
      `}</style>
    </>
  );
}
