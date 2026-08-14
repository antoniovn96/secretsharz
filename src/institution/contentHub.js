import { CONTENT_TYPES, isVisibleToAudience } from './contentModel';

export function groupPublishedContent(records = [], audience = 'all', now = new Date()) {
  const grouped = Object.fromEntries(CONTENT_TYPES.map(type => [type, []]));
  for (const record of records) {
    if (isVisibleToAudience(record, audience, now)) grouped[record.type].push(record);
  }
  for (const type of CONTENT_TYPES) grouped[type].sort((a, b) => String(b.publishAt || '').localeCompare(String(a.publishAt || '')));
  return grouped;
}

export function buildInstitutionDashboardContent(records = [], audience = 'all', now = new Date()) {
  const grouped = groupPublishedContent(records, audience, now);
  return {
    featured: grouped.news.slice(0, 3),
    upcomingEvents: grouped.event.slice(0, 4),
    latestBlogs: grouped.blog.slice(0, 4),
    announcements: grouped.announcement.slice(0, 5),
    guidelineUpdates: grouped.guideline.slice(0, 4),
    dailyChallenges: grouped.challenge.slice(0, 3),
    achievements: grouped.achievement.slice(0, 4),
  };
}
