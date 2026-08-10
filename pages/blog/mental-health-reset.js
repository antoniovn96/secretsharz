import React from 'react';
import MentalHealthResetBlog from '../../src/blogss/2026/February/MentalHealthResetBlog';
import PublicShell from '../../src/PublicShell';

export default function MentalHealthResetPage() {
  return (
    <PublicShell
      title="Mental Health Reset | Secret Sharz"
      description="Practical strategies for a calmer, more intentional mental health reset."
    >
      {({ navigate }) => <MentalHealthResetBlog navigate={navigate} />}
    </PublicShell>
  );
}
