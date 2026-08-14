export function buildResultsCards(result) {
  return [
    { id: 'profile', title: 'Your Profile', visible: true },
    { id: 'strengths', title: 'Your Strengths', visible: true },
    { id: 'primary', title: 'Strong Matches', visible: true, items: result.primaryMatches },
    { id: 'more', title: 'More Careers to Explore', visible: result.access === 'full', items: result.additionalMatches },
    { id: 'courses', title: 'Courses', visible: result.access === 'full' },
    { id: 'colleges', title: 'Colleges', visible: result.access === 'full' },
    { id: 'pathways', title: 'Alternative Pathways', visible: result.access === 'full' },
    { id: 'roadmap', title: 'Your Roadmap', visible: result.access === 'full' },
    { id: 'next', title: 'What You Can Do Next', visible: result.access === 'full' },
    { id: 'unlock', title: 'Unlock Your Full Report', visible: result.access === 'partial' },
  ].filter(card => card.visible);
}
