// View-model helpers for the student-facing career assessment result.
// Keeps the dashboard presentation separate from trusted scoring/persistence.

export function buildResultView(result = {}) {
  const partial = result.access !== 'full';
  const profile = result.profile || {};
  const exploration = result.careerExploration || {};

  return {
    access: partial ? 'partial' : 'full',
    title: partial ? 'Your Career Snapshot' : 'Your Comprehensive Career Profile',
    disclaimer: result.disclaimer || '',
    profile: {
      hollandCode: profile.riasec?.hollandCode || null,
      topInterests: profile.riasec?.ranked?.slice(0, 3) || [],
      strongestDimensions: Object.entries(profile.dimensions || {})
        .filter(([, score]) => Number(score) > 0)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5)
        .map(([dimension, score]) => ({ dimension, score })),
    },
    careers: partial
      ? []
      : [...(exploration.primary || []), ...(exploration.additional || [])],
    courses: partial ? [] : result.courses || [],
    colleges: partial ? [] : result.colleges || [],
    roadmap: partial ? [] : result.roadmap || [],
    lockedSections: result.lockedSections || [],
  };
}
