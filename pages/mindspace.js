import React from 'react';
import MindSpace from '../src/MindSpace';
import PublicShell from '../src/PublicShell';

export default function MindSpacePage() {
  return (
    <PublicShell
      title="MindSpace | Emotional First Aid | Secret Sharz"
      description="A calm starting point for emotional first aid, grounding and everyday wellbeing tools."
    >
      {({ currentUser, userData, navigate }) => (
        <MindSpace
          userData={userData}
          onNavigate={(targetTab) => {
            if (!currentUser) {
              navigate('/auth');
              return;
            }
            navigate(`/dashboard?tab=${encodeURIComponent(targetTab)}`);
          }}
        />
      )}
    </PublicShell>
  );
}
