import React from 'react';
import InstitutionalDiscoveryHub from '../src/InstitutionalDiscoveryHub';

export default function DiscoverPage() {
  const navigate = (path) => {
    if (typeof window !== 'undefined') window.location.href = path;
  };

  return <InstitutionalDiscoveryHub navigate={navigate} />;
}
