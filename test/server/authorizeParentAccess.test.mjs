import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeParentAccess } from '../../src/security/authorizeParentAccess.js';

function makeDb({ relationship = true, consent = true } = {}) {
  const relationshipDocs = relationship ? [{ id: 'r1', data: () => ({ status: 'active', type: 'parent' }) }] : [];
  const consentDocs = consent ? [{ id: 'c1', data: () => ({ action: 'granted', type: 'sen', createdAt: '2026-01-01T00:00:00.000Z' }) }] : [];
  return {
    collection(name) {
      if (name === 'relationships') return {
        where() { return this; },
        limit() { return this; },
        async get() { return { docs: relationshipDocs }; },
      };
      if (name === 'consents') return {
        where() { return this; },
        orderBy() { return this; },
        limit() { return this; },
        async get() { return { empty: consentDocs.length === 0, docs: consentDocs }; },
      };
      throw new Error(`Unexpected collection ${name}`);
    },
  };
}

test('parent access denies missing canonical relationship', async () => {
  const result = await authorizeParentAccess({ db: makeDb({ relationship: false }), parentId: 'p1', studentId: 's1', dataDomain: 'sen', consentType: 'sen' });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'parent_relationship_not_active');
});

test('parent access denies inactive service consent', async () => {
  const result = await authorizeParentAccess({ db: makeDb({ consent: false }), parentId: 'p1', studentId: 's1', dataDomain: 'sen', consentType: 'sen' });
  assert.equal(result.allowed, false);
});

test('parent access allows active relationship and service consent', async () => {
  const result = await authorizeParentAccess({ db: makeDb(), parentId: 'p1', studentId: 's1', dataDomain: 'sen', consentType: 'sen' });
  assert.equal(result.allowed, true);
});
