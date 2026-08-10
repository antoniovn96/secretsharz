import React from 'react';
import SharzWall from '../src/SharzWall';
import PublicShell from '../src/PublicShell';

export default function WallPage() {
  return (
    <PublicShell
      title="Sharz Wall | Anonymous Student Stories | Secret Sharz"
      description="Share what you are feeling anonymously, read experiences from others, and remember that you are not alone."
    >
      {({ navigate }) => <SharzWall Maps={navigate} />}
    </PublicShell>
  );
}
