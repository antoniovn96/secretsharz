import { getCupEligibility } from './engagementModel';

export function buildDashboardWidgets({ audience, engagement = {}, content = {}, journey = {} }) {
  const cups = getCupEligibility(engagement, engagement.completedDays || 0);
  const common = [
    { id: 'daily-challenge', type: 'challenge', title: 'Today\'s Challenge', data: content.dailyChallenge || null },
    { id: 'progress', type: 'progress', title: 'Your Progress', data: { xp: engagement.totalXp || 0, streak: engagement.currentStreak || 0 } },
    { id: 'updates', type: 'content', title: 'What\'s New', data: content.news || [] },
    { id: 'events', type: 'events', title: 'Upcoming Events', data: content.events || [] },
    { id: 'cups', type: 'achievements', title: 'Your Milestones', data: cups },
  ];

  if (audience === 'counselling') {
    return [
      ...common,
      { id: 'brain-break', type: 'activity', title: 'Brain Break', data: content.brainBreak || null },
      { id: 'reflection', type: 'reflection', title: 'Private Reflection', data: content.reflection || null },
      { id: 'appointments', type: 'appointments', title: 'Counsellor Booking', data: journey.appointments || [] },
    ];
  }

  if (audience === 'career') {
    return [
      ...common,
      { id: 'career-journey', type: 'journey', title: 'Career Discovery', data: journey.career || {} },
      { id: 'courses', type: 'courses', title: 'Courses For You', data: journey.courses || [] },
      { id: 'career-events', type: 'events', title: 'Career Events', data: content.careerEvents || [] },
    ];
  }

  if (audience === 'sen') {
    return [
      { id: 'welcome', type: 'welcome', title: 'My Space', data: {} },
      { id: 'daily-activity', type: 'activity', title: 'Today\'s Activity', data: content.senActivity || null },
      { id: 'visual-progress', type: 'progress', title: 'My Progress', data: { xp: engagement.totalXp || 0, streak: engagement.currentStreak || 0 } },
      { id: 'appointments', type: 'appointments', title: 'My Counsellor', data: journey.appointments || [] },
      { id: 'events', type: 'events', title: 'Things Happening', data: content.events || [] },
    ];
  }

  return common;
}
