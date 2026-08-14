import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCareerFamily, buildCareer, buildCourse, buildCollege, buildCatalogueRelationship, canPublishCollege } from '../../src/career/catalogueModel.js';
import { assertAdminCatalogueMutation } from '../../src/career/catalogueRepository.js';

test('catalogue entities are versioned and status controlled', () => {
  const family = buildCareerFamily({ id: 'people-behaviour', title: 'People & Behaviour', status: 'draft' });
  const career = buildCareer({ id: 'psychology', familyId: family.id, title: 'Psychology', riasec: ['S', 'I'] });
  const course = buildCourse({ id: 'bsc-psychology', title: 'B.Sc. Psychology', level: 'undergraduate' });
  assert.equal(family.entityType, 'careerFamily');
  assert.equal(career.version, 1);
  assert.equal(course.status, 'draft');
});

test('college publication requires verification and a source website', () => {
  const unverified = buildCollege({ id: 'c1', name: 'Example College', status: 'published' });
  assert.equal(canPublishCollege(unverified), false);
  const verified = buildCollege({ id: 'c2', name: 'Verified College', website: 'https://example.edu', verified: true, status: 'published' });
  assert.equal(canPublishCollege(verified), true);
});

test('catalogue relationships require valid entity types', () => {
  const relationship = buildCatalogueRelationship({ fromId: 'psychology', fromType: 'career', toId: 'bsc-psychology', toType: 'course', relation: 'related_course' });
  assert.equal(relationship.relation, 'related_course');
  assert.throws(() => buildCatalogueRelationship({ fromId: 'x', fromType: 'unknown', toId: 'y', toType: 'course', relation: 'x' }));
});

test('catalogue mutation policy requires an administrator', () => {
  assert.throws(() => assertAdminCatalogueMutation({ isAdmin: false }));
  assert.doesNotThrow(() => assertAdminCatalogueMutation({ isAdmin: true }));
});
