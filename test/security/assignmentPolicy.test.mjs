import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssignmentPolicy, validateAssignmentSlot, assertAssignmentCapacity } from '../../src/security/assignmentPolicy.js';

test('wellbeing permits one primary and one backup', () => {
  assert.deepEqual(getAssignmentPolicy('wellbeing'), { primary: 1, backup: 1 });
});

test('career permits one primary only', () => {
  assert.deepEqual(getAssignmentPolicy('career'), { primary: 1 });
});

test('SEN permits one primary and unlimited multidisciplinary assignments', () => {
  assert.equal(getAssignmentPolicy('sen').primary, 1);
  assert.equal(getAssignmentPolicy('sen').multidisciplinary, Infinity);
});

test('wellbeing backup slot is valid', () => {
  assert.deepEqual(validateAssignmentSlot('wellbeing', 'backup'), { service:'wellbeing', slot:'backup', maximum:1 });
});

test('capacity rejects a second primary wellbeing assignment', () => {
  assert.throws(() => assertAssignmentCapacity('wellbeing', 'primary', 1), /capacity reached/);
});

test('capacity allows additional SEN multidisciplinary members', () => {
  assert.equal(assertAssignmentCapacity('sen', 'multidisciplinary', 20), true);
});
