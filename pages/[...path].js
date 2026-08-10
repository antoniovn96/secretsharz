import React from 'react';
import SecretSharzApp from '../src/App';

/**
 * Legacy application fallback.
 *
 * This is intentionally a non-optional catch-all route. The optional form
 * ([[...path]].js) also matches `/`, which conflicts with the dedicated
 * `pages/index.js` homepage in Next.js route sorting.
 *
 * Static Next.js public pages take precedence over this fallback. Remaining
 * authenticated/product routes continue through the existing App router until
 * they receive dedicated Next.js route modules.
 */
export default function LegacyApplicationRoute() {
  return <SecretSharzApp />;
}
