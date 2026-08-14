const DEFAULT_DISCLAIMER = 'These results are based on the information you provided and the available verified catalogue data. They are exploration suggestions, not guarantees or limits. Interests can change, and with learning, qualifications, effort and support, you can pursue many different pathways.';

export function buildCareerResults({ profile = {}, matches = [], paid = false, catalogueVersion = null }) {
  const primary = matches.filter(item => item.rank <= 5);
  const additional = matches.filter(item => item.rank > 5 && item.rank <= 15);
  return {
    access: paid ? 'full' : 'partial',
    profile: {
      age: profile.age ?? null,
      status: profile.status ?? null,
      favouriteSubjects: profile.favouriteSubjects || [],
      interests: profile.interests || [],
      dislikes: profile.dislikes || [],
      goals: profile.goals || [],
    },
    strengths: profile.strengths || [],
    primaryMatches: paid ? primary : primary.slice(0, 3),
    additionalMatches: paid ? additional : [],
    catalogueVersion,
    sections: paid
      ? ['profile', 'strengths', 'primaryMatches', 'additionalMatches', 'courses', 'colleges', 'alternativePathways', 'roadmap', 'actionPlan']
      : ['profile', 'strengths', 'primaryMatches', 'unlockPrompt'],
    disclaimer: DEFAULT_DISCLAIMER,
  };
}

export function buildRoadmap({ career, course, collegeOptions = [], steps = [] }) {
  return {
    career: career || null,
    course: course || null,
    collegeOptions: collegeOptions.filter(Boolean),
    steps: steps.map((step, index) => ({ id: step.id || `step-${index + 1}`, title: step.title, description: step.description || '', status: step.status || 'not_started' })),
  };
}
