import test from 'node:test';
import assert from 'node:assert/strict';
import { assignmentType, assignmentDomain } from '../../src/security/serviceAssignmentDomain.js';

test('service assignment maps to canonical relationship type/domain', () => {
  assert.equal(assignmentType('wellbeing'), 'primary_counsellor');
  assert.equal(assignmentType('career_guidance'), 'career_counsellor');
  assert.equal(assignmentType('sen'), 'sen_professional');
  assert.equal(assignmentDomain('wellbeing'), 'counselling');
  assert.equal(assignmentDomain('career_guidance'), 'career');
  assert.equal(assignmentDomain('sen'), 'sen');
});

test('unsupported assignment service is rejected', () => {
  assert.throws(() => assignmentType('unknown'));
  assert.throws(() => assignmentDomain('unknown'));
});
