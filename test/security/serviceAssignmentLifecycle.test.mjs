import test from 'node:test';
import assert from 'node:assert/strict';
import { canEndAssignment, canPromoteBackup, nextAssignmentState } from '../../src/security/serviceAssignmentLifecycle.js';

test('authorized actor can end an active assignment', () => {
  assert.equal(canEndAssignment({ assignment: { status: 'active' }, actorAuthorized: true }), true);
  assert.equal(canEndAssignment({ assignment: { status: 'ended' }, actorAuthorized: true }), false);
});

test('wellbeing backup can be promoted', () => {
  const backup = { relationshipId: 'backup-1', status: 'active', slot: 'backup' };
  assert.equal(canPromoteBackup({ service: 'wellbeing', primaryAssignment: { relationshipId: 'primary-1', status: 'active' }, backupAssignment: backup, actorAuthorized: true }), true);
  assert.equal(canPromoteBackup({ service: 'career_guidance', primaryAssignment: null, backupAssignment: backup, actorAuthorized: true }), false);
});

test('ending an assignment preserves historical record', () => {
  const result = nextAssignmentState({ service: 'career_guidance', currentAssignments: [{ relationshipId: 'r1', status: 'active', slot: 'primary' }], action: { type: 'end', relationshipId: 'r1', at: '2026-08-19T00:00:00.000Z' } });
  assert.equal(result[0].status, 'ended');
  assert.equal(result[0].endsAt, '2026-08-19T00:00:00.000Z');
});
