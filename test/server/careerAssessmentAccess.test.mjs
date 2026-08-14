import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEntitlement, hasActiveFullEntitlement, resultAccessFromEntitlement } from '../../src/career/assessmentEntitlements.js';
import { buildResultView } from '../../src/career/assessmentResultView.js';

test('only an active matching entitlement unlocks a full career result', () => {
  const entitlement = buildEntitlement({ personId: 'p1', assessmentAttemptId: 'a1', providerReference: 'checkout_123' });
  assert.equal(hasActiveFullEntitlement(entitlement, { personId: 'p1', assessmentAttemptId: 'a1' }), true);
  assert.equal(resultAccessFromEntitlement(entitlement, { personId: 'p2', assessmentAttemptId: 'a1' }), 'partial');
  assert.equal(resultAccessFromEntitlement({ ...entitlement, status: 'revoked' }, { personId: 'p1', assessmentAttemptId: 'a1' }), 'partial');
});

test('partial result view does not expose paid career catalogue sections', () => {
  const view = buildResultView({
    access: 'partial',
    profile: { riasec: { hollandCode: 'SIA', ranked: [] }, dimensions: { values: 4 } },
    careerExploration: { primary: [{ careerId: 'psychology' }] },
    courses: [{ id: 'bsc-psychology' }],
    colleges: [{ id: 'college-1' }],
    roadmap: [{ id: 'r1' }],
    lockedSections: ['career_family_matches', 'course_recommendations', 'college_matches', 'personalised_roadmap'],
  });

  assert.equal(view.access, 'partial');
  assert.deepEqual(view.careers, []);
  assert.deepEqual(view.courses, []);
  assert.deepEqual(view.colleges, []);
  assert.deepEqual(view.roadmap, []);
});

test('full result view exposes catalogue sections', () => {
  const view = buildResultView({
    access: 'full',
    profile: { riasec: { hollandCode: 'SIA', ranked: [] }, dimensions: { values: 4 } },
    careerExploration: { primary: [{ careerId: 'psychology' }], additional: [{ careerId: 'ux-research' }] },
    courses: [{ id: 'bsc-psychology' }],
    colleges: [{ id: 'college-1' }],
    roadmap: [{ id: 'r1' }],
  });

  assert.equal(view.access, 'full');
  assert.equal(view.careers.length, 2);
  assert.equal(view.courses.length, 1);
  assert.equal(view.colleges.length, 1);
  assert.equal(view.roadmap.length, 1);
});
