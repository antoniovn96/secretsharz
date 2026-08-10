import React from 'react';
import VidyaVantageBlog from '../../src/VidyaVantageBlog';
import PublicShell from '../../src/PublicShell';

export default function VidyaVantageBlogPage() {
  return (
    <PublicShell
      title="VidyaVantage Blog | Career Discovery | Secret Sharz"
      description="Career discovery, stream selection and future-readiness conversations from VidyaVantage."
    >
      {({ navigate }) => <VidyaVantageBlog navigate={navigate} />}
    </PublicShell>
  );
}
