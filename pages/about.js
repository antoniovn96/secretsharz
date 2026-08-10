import React from 'react';
import AboutUs from '../src/AboutUs';
import PublicShell from '../src/PublicShell';

export default function AboutPage() {
  return (
    <PublicShell
      title="About Secret Sharz | Our Story & Methodology"
      description="Discover the story behind Secret Sharz, its S.H.A.R.E. methodology, and its mission to connect emotional wellbeing with career discovery."
    >
      {({ navigate }) => <AboutUs navigate={navigate} />}
    </PublicShell>
  );
}
