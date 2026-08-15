function isVisible(item, audience, now) {
  if (!item || item.status !== 'published') return false;
  const audiences = Array.isArray(item.audience) ? item.audience : [];
  if (!(audiences.includes('all') || audiences.includes(audience))) return false;

  const current = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (item.publishAt && new Date(item.publishAt).getTime() > current) return false;
  if (item.expiresAt && new Date(item.expiresAt).getTime() <= current) return false;
  return true;
}

export function buildInstitutionDashboardContent(records = [], audience = 'all', now = new Date()) {
  const visible = records
    .filter((item) => isVisible(item, audience, now))
    .sort((a, b) => new Date(b.publishAt || 0).getTime() - new Date(a.publishAt || 0).getTime());

  const byType = (type) => visible.filter((item) => item.type === type);

  return {
    // The newest published news item is the dashboard's featured item.
    featured: byType('news').slice(0, 1),
    latestBlogs: byType('blog').slice(0, 5),
    upcomingEvents: byType('event').slice(0, 5),
    guidelineUpdates: byType('guideline').slice(0, 5),
  };
}
