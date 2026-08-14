export const CAREER_CHALLENGES = Object.freeze([
  { id: 'career-of-day', title: 'Career of the Day', type: 'knowledge', points: 15, prompt: 'Explore one career you have never considered before.' },
  { id: 'skill-detective', title: 'Skill Detective', type: 'reflection', points: 15, prompt: 'Pick one career and identify three skills it uses.' },
  { id: 'course-explorer', title: 'Course Explorer', type: 'knowledge', points: 20, prompt: 'Open one course and find one subject you would enjoy studying.' },
  { id: 'career-myth', title: 'Career Myth or Fact', type: 'knowledge', points: 10, prompt: 'Decide whether a career statement is a myth or a fact, then reveal the explanation.' },
  { id: 'future-self', title: 'Future Self', type: 'reflection', points: 15, prompt: 'Imagine a workday five years from now and write three things you would like it to include.' },
]);

export function getCareerChallenge(id) {
  return CAREER_CHALLENGES.find(item => item.id === id) || null;
}
