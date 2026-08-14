import { selectDashboardContent } from './contentModel';

const ORDER = Object.freeze(['announcement', 'event', 'news', 'guideline', 'blog', 'challenge', 'achievement']);
const MAX_FEED_ITEMS = 12;

export function buildDashboardFeed(contents, audience, now = new Date()) {
  const visible = selectDashboardContent(contents, audience, now);
  return visible
    .sort((a, b) => {
      const typeA = ORDER.indexOf(a.type);
      const typeB = ORDER.indexOf(b.type);
      if (typeA !== typeB) return typeA - typeB;
      return String(b.publishAt || '').localeCompare(String(a.publishAt || ''));
    })
    .slice(0, MAX_FEED_ITEMS);
}

export function groupDashboardFeed(contents) {
  return contents.reduce((groups, item) => {
    (groups[item.type] ||= []).push(item);
    return groups;
  }, {});
}
