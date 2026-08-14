import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionContent, isVisibleToAudience, selectDashboardContent } from '../../src/institution/contentModel.js';
import { buildDashboardFeed, groupDashboardFeed } from '../../src/institution/dashboardFeed.js';

const now = new Date('2026-08-14T08:00:00Z');

test('content lifecycle and audience targeting are enforced', () => {
  const content = buildInstitutionContent({ id: 'n1', type: 'news', title: 'Career Week', authorId: 'admin', audience: ['career'], status: 'published', publishAt: '2026-08-13T00:00:00Z' });
  assert.equal(isVisibleToAudience(content, 'career', now), true);
  assert.equal(isVisibleToAudience(content, 'sen', now), false);
});

test('scheduled and expired content stays off the dashboard', () => {
  const scheduled = buildInstitutionContent({ id: 's', type: 'event', title: 'Later', authorId: 'admin', status: 'scheduled', publishAt: '2026-08-15T00:00:00Z' });
  const expired = buildInstitutionContent({ id: 'e', type: 'blog', title: 'Old', authorId: 'admin', status: 'published', publishAt: '2026-08-01T00:00:00Z', expiresAt: '2026-08-10T00:00:00Z' });
  assert.equal(isVisibleToAudience(scheduled, 'all', now), false);
  assert.equal(isVisibleToAudience(expired, 'all', now), false);
});

test('dashboard feed is grouped into useful dashboard sections', () => {
  const items = [
    buildInstitutionContent({ id: 'b', type: 'blog', title: 'Blog', authorId: 'admin', audience: ['all'], status: 'published' }),
    buildInstitutionContent({ id: 'a', type: 'announcement', title: 'Announcement', authorId: 'admin', audience: ['all'], status: 'published' }),
  ];
  const feed = buildDashboardFeed(items, 'career', now);
  assert.equal(feed[0].type, 'announcement');
  assert.equal(groupDashboardFeed(feed).blog.length, 1);
});

test('expiry must be after publication', () => {
  assert.throws(() => buildInstitutionContent({ id: 'x', type: 'news', title: 'x', authorId: 'admin', publishAt: '2026-08-15T00:00:00Z', expiresAt: '2026-08-14T00:00:00Z' }));
});
