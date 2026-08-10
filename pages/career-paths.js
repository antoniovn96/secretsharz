import React from 'react';
import CareerExplorer from '../src/CareerExplorer';
import PublicShell from '../src/PublicShell';

export default function CareerPathsPage() {
  return (
    <PublicShell
      title="Career Paths | VidyaVantage | Secret Sharz"
      description="Explore career paths, interests, streams and possible directions before taking the Secret Sharz career assessment."
    >
      {({ navigate }) => <CareerExplorer navigate={navigate} />}
    </PublicShell>
  );
}
