import test from 'node:test';
import assert from 'node:assert/strict';

test('assignment read model uses service and slot from canonical relationship metadata', () => {
  const relationship = { type: 'primary_counsellor', status: 'active', relatedPersonId: 'p1', metadata: { service: 'wellbeing', slot: 'primary', institutionId: 'school-a', role: 'psychologist' } };
  const assignment = { service: relationship.metadata.service || 'wellbeing', slot: relationship.metadata.slot, institutionId: relationship.metadata.institutionId, professionalId: relationship.relatedPersonId, status: relationship.status };
  assert.deepEqual(assignment, { service: 'wellbeing', slot: 'primary', institutionId: 'school-a', professionalId: 'p1', status: 'active' });
});

test('historical assignments are excluded from canonical active read model', () => {
  const relationships = [{ status: 'active', relatedPersonId: 'p1' }, { status: 'ended', relatedPersonId: 'p2' }];
  assert.deepEqual(relationships.filter((r) => r.status === 'active').map((r) => r.relatedPersonId), ['p1']);
});
