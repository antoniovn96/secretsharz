import React from 'react';
import SecretSharzApp from '../src/App';

/**
 * Legacy application fallback.
 *
 * Static Next.js public pages take precedence over this route. Remaining
 * authenticated/product routes continue through the existing App router until
 * they receive dedicated Next.js route modules.
 */
export default function LegacyApplicationRoute() {
  return <SecretSharzApp />;
}
