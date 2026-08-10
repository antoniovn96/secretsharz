/**
 * Secret Sharz motion helpers.
 *
 * Motion is progressive enhancement: all interactions remain usable without it.
 * Components should use CSS tokens plus the user's reduced-motion preference.
 */
export const MOTION = Object.freeze({
  fast: 'var(--ss-motion-fast)',
  standard: 'var(--ss-motion-standard)',
  slow: 'var(--ss-motion-slow)',
  easing: 'var(--ss-motion-ease)',
});

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.documentElement.dataset.reducedMotion === 'true';
}

export function setReducedMotionPreference(enabled) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.reducedMotion = enabled ? 'true' : 'false';
  window.localStorage?.setItem('secretsharz-reduced-motion', String(enabled));
}
