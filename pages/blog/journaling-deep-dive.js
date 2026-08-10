import React from 'react';
import JournalingDeepDiveBlog from '../../src/blogss/2026/January/JournalingDeepDiveBlog';
import PublicShell from '../../src/PublicShell';

export default function JournalingDeepDivePage() {
  return (
    <PublicShell
      title="Journaling Deep Dive | Secret Sharz"
      description="A practical exploration of journaling, emotional processing and reflective wellbeing."
    >
      {({ navigate }) => <JournalingDeepDiveBlog navigate={navigate} />}
    </PublicShell>
  );
}
