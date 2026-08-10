import React from 'react';
import Resources from '../src/Resources';
import PublicShell from '../src/PublicShell';

export default function ResourcesPage() {
  return (
    <PublicShell
      title="Mental Health, SEN & Life Skills Resources | Secret Sharz"
      description="Explore practical mental health, SEN, life skills, soft skills, POCSO and POSH resources from Secret Sharz."
    >
      {({ navigate }) => <Resources navigate={navigate} />}
    </PublicShell>
  );
}
