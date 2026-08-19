import test from 'node:test';
import assert from 'node:assert/strict';
import { assertRelationshipType, getRelationshipDefinition, relationshipGrantsAuthorization } from '../../src/security/relationshipTypeRegistry.js';

test('registry defines canonical service relationships', () => {
  assert.equal(getRelationshipDefinition('primary_counsellor').service, 'wellbeing');
  assert.equal(getRelationshipDefinition('career_counsellor').service, 'career_guidance');
  assert.equal(getRelationshipDefinition('sen_professional').service, 'sen');
});

test('registry distinguishes institution staff and student membership', () => {
  assert.equal(getRelationshipDefinition('institution_staff').domain, 'institution');
  assert.equal(getRelationshipDefinition('institution_member').domain, 'institution');
});

test('registry rejects cross-domain and invalid slot usage', () => {
  assert.throws(() => assertRelationshipType('career_counsellor', { service: 'sen' }));
  assert.throws(() => assertRelationshipType('career_counsellor', { slot: 'backup' }));
});

test('only known authorization relationships grant authorization', () => {
  assert.equal(relationshipGrantsAuthorization('guardian'), true);
  assert.equal(relationshipGrantsAuthorization('unknown_type'), false);
});
