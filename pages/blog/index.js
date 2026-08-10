import React from 'react';
import Blog from '../../src/Blog';
import PublicShell from '../../src/PublicShell';

export default function BlogPage() {
  return (
    <PublicShell
      title="Secret Sharz Blog | Mental Health, Student Wellbeing & Careers"
      description="Evidence-informed conversations about mental health, student wellbeing, life skills and career discovery."
    >
      {({ navigate }) => <Blog navigate={navigate} />}
    </PublicShell>
  );
}
