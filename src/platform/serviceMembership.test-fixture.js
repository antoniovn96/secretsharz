// Test-only fixture helpers for the canonical service membership model.
// Kept separate from application code so onboarding tests can use the same
// vocabulary without introducing persistence side-effects.

export function buildInitialCareerMembership(personId, institutionId = null) {
  return {
    personId,
    institutionId,
    domain: 'career',
    status: 'active',
    source: 'student',
    isPrimary: true,
    startedAt: null,
    endedAt: null,
  };
}
