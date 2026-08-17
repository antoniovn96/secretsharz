import React from 'react';

/**
 * Canonical VidyaVantage Career Workspace navigation.
 *
 * This is intentionally separate from individual page content so every
 * /dashboard/career/* route can use the same navigation contract.
 */
export const CAREER_WORKSPACE_NAV = [
  { id: 'home', label: 'Dashboard', icon: '⌂', href: '/dashboard/career' },
  { id: 'journey', label: 'My Journey', icon: '◈', href: '/dashboard/career/journey' },
  { id: 'results', label: 'My Results', icon: '◉', href: '/dashboard/career/results' },
  { id: 'roadmap', label: 'Career Roadmap', icon: '↗', href: '/dashboard/career/roadmap' },
  { id: 'journal', label: 'Reflection Journal', icon: '✎', href: '/dashboard/career/journal' },
  { id: 'booking', label: 'Book a Session', icon: '□', href: '/dashboard/career/sessions/book' },
  { id: 'sessions', label: 'My Sessions', icon: '◷', href: '/dashboard/career/sessions' },
  { id: 'resources', label: 'Resources', icon: '▤', href: '/dashboard/career/resources' },
  { id: 'games', label: 'Career Games', icon: '◇', href: '/dashboard/career/games' },
];

export const CAREER_WORKSPACE_UTILITY_NAV = [
  { id: 'profile', label: 'My Profile', icon: '○', href: '/dashboard/career/profile' },
  { id: 'settings', label: 'Settings', icon: '⚙', href: '/dashboard/career/settings' },
];

export function CareerWorkspaceNavigation({ pathname = '', onNavigate, compact = false }) {
  const active = (item) => {
    if (item.id === 'home') return pathname === '/dashboard/career' || pathname === '/dashboard/career/';
    if (item.id === 'journey') return pathname.includes('/dashboard/career/journey') || pathname.includes('/dashboard/career/assessment');
    return pathname.startsWith(item.href);
  };

  const navigate = (href) => {
    if (onNavigate) onNavigate(href);
    else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav aria-label="VidyaVantage Career navigation" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ padding: '0 10px 10px', fontSize: 11, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase', color: '#94a3b8' }}>
        Career Space
      </div>
      {CAREER_WORKSPACE_NAV.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => navigate(item.href)}
          aria-current={active(item) ? 'page' : undefined}
          title={compact ? item.label : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 11, width: '100%',
            padding: compact ? '11px 12px' : '11px 13px', border: 0, borderRadius: 10,
            background: active(item) ? '#eef2ff' : 'transparent',
            color: active(item) ? '#4338ca' : '#475569',
            fontSize: 13, fontWeight: active(item) ? 900 : 700, cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span aria-hidden="true" style={{ width: 20, textAlign: 'center', fontSize: 16 }}>{item.icon}</span>
          {!compact && <span>{item.label}</span>}
        </button>
      ))}
      <div aria-hidden="true" style={{ height: 1, background: '#e2e8f0', margin: '12px 8px' }} />
      {CAREER_WORKSPACE_UTILITY_NAV.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => navigate(item.href)}
          aria-current={active(item) ? 'page' : undefined}
          title={compact ? item.label : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 11, width: '100%',
            padding: compact ? '11px 12px' : '11px 13px', border: 0, borderRadius: 10,
            background: active(item) ? '#eef2ff' : 'transparent',
            color: active(item) ? '#4338ca' : '#475569',
            fontSize: 13, fontWeight: active(item) ? 900 : 700, cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span aria-hidden="true" style={{ width: 20, textAlign: 'center', fontSize: 16 }}>{item.icon}</span>
          {!compact && <span>{item.label}</span>}
        </button>
      ))}
      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{ width: '100%', padding: '10px 13px', border: 0, background: 'transparent', color: '#64748b', fontSize: 12, fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
        >
          ← Back to Secret Sharz
        </button>
      </div>
    </nav>
  );
}

export default CareerWorkspaceNavigation;
