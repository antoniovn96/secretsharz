import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAssignmentMutation } from '../../src/security/serviceAssignmentTransaction.js';

test('cannot create a second active wellbeing primary', () => {
  assert.throws(() => buildAssignmentMutation({ service: 'wellbeing', assignments: [{ relationshipId: 'p1', status: 'active', slot: 'primary' }], action: { type: 'assign', assignment: { relationshipId: 'p2', slot: 'primary' } } }));
});

test('cannot create a second career primary', () => {
  assert.throws(() => buildAssignmentMutation({ service: 'career_guidance', assignments: [{ relationshipId: 'p1', status: 'active', slot: 'primary' }], action: { type: 'assign', assignment: { relationshipId: 'p2', slot: 'primary' } } }));
});

test('wellbeing promotion ends current primary and promotes backup', () => {
  const result = buildAssignmentMutation({ service: 'wellbeing', assignments: [{ relationshipId: 'p1', status: 'active', slot: 'primary' }, { relationshipId: 'b1', status: 'active', slot: 'backup' }], action: { type: 'promote_backup', backupRelationshipId: 'b1' }, now: '2026-08-19T00:00:00.000Z' });
  assert.equal(result.find((a) => a.relationshipId === 'p1').status, 'ended');
  assert.equal(result.find((a) => a.relationshipId === 'b1').slot, 'primary');
});
