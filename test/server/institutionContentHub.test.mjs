import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionContent } from '../../src/institution/contentModel.js';
import { buildInstitutionDashboardContent } from '../../src/institution/contentHub.js';

const base = { authorId: 'admin-1', status: 'published', audience: ['all'] };

test('institution content validates type and status', () => {
  const item = buildInstitutionContent({ ...base, id: 'n1', type: 'news', title: 'Welcome' });
  assert.equal(item.type, 'news');
  assert.throws(() => buildInstitutionContent({ ...base, id: 'x', type: 'unknown', title: 'X' }));
});

test('dashboard groups published content into useful sections', () => {
  const records = [
    buildInstitutionContent({ ...base, id: 'n1', type: 'news', title: 'News', publishAt: '2026-08-01' }),
    buildInstitutionContent({ ...base, id: 'b1', type: 'blog', title: 'Blog', publishAt: '2026-08-02' }),
    buildInstitutionContent({ ...base, id: 'e1', type: 'event', title: 'Event', publishAt: '2026-08-03' }),
    buildInstitutionContent({ ...base, id: 'g1', type: 'guideline', title: 'Guideline', publishAt: '2026-08-04' }),
  ];
  const view = buildInstitutionDashboardContent(records, 'all', new Date('2026-08-10'));
  assert.equal(view.featured.length, 1);
  assert.equal(view.latestBlogs.length, 1);
  assert.equal(view.upcomingEvents.length, 1);
  assert.equal(view.guidelineUpdates.length, 1);
});

test('scheduled and expired content stays hidden', () => {
  const records = [
    buildInstitutionContent({ ...base, id: 'future', type: 'news', title: 'Future', publishAt: '2026-09-01' }),
    buildInstitutionContent({ ...base, id: 'old', type: 'news', title: 'Old', publishAt: '2026-07-01', expiresAt: '2026-08-01' }),
  ];
  const view = buildInstitutionDashboardContent(records, 'all', new Date('2026-08-10'));
  assert.equal(view.featured.length, 0);
});
