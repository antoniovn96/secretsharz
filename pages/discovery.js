import React from 'react';
import { useRouter } from 'next/router';
import InstitutionalDiscoveryHub from '../src/InstitutionalDiscoveryHub';

export default function DiscoveryPage() {
  const router = useRouter();
  const navigate = (path) => {
    if (path === '/discover') return;
    if (typeof window !== 'undefined') window.location.href = path;
  };

  return <InstitutionalDiscoveryHub navigate={navigate} />;
}
