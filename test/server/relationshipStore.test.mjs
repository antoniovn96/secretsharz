import test from 'node:test';
import assert from 'node:assert/strict';
import { reassignRelationship, endRelationships, buildRelationshipDocument, createPendingRelationship, activateRelationship } from '../../src/security/relationshipStore.js';

function makeDb(initial = []) {
  const docs = new Map(initial.map((item, index) => [item.id || `r${index + 1}`, { ...item }]));
  const collection = () => ({
    where() { return this; },
    limit() { return this; },
    async get() {
      const values = [...docs.entries()].map(([id, data]) => ({ id, ref: { id }, data: () => data }));
      return { docs: values };
    },
    doc() {
      const id = `new-${docs.size + 1}`;
      return { id, async set(data) { docs.set(id, data); } };
    },
  });
  return {
    collection,
    async runTransaction(work) {
      const tx = {
        async get(query) { return query.get(); },
        update(ref, patch) { const current = docs.get(ref.id) || {}; docs.set(ref.id, { ...current, ...patch }); },
        set(ref, data) { docs.set(ref.id, data); },
      };
      return work(tx);
    },
    _docs: docs,
  };
}

test('buildRelationshipDocument creates active relationship vocabulary', () => {
  const record = buildRelationshipDocument({ subjectPersonId: 's1', relatedPersonId: 'p1', type: 'primary_counsellor', domain: 'counselling', status: 'active' });
  assert.equal(record.status, 'active');
  assert.equal(record.domain, 'counselling');
});

test('consent-gated relationship creation starts pending', async () => {
  const db = makeDb();
  const result = await createPendingRelationship({ db, subjectPersonId: 's1', relatedPersonId: 'p1', type: 'parent', domain: null });
  assert.equal(result.status, 'pending');
  assert.equal(result.consentRequired, true);
});

test('reassignRelationship requires verified consent for consent-gated assignments', async () => {
  const db = makeDb([{ id: 'old', subjectPersonId: 's1', relatedPersonId: 'p1', type: 'primary_counsellor', domain: 'counselling', status: 'active' }]);
  await assert.rejects(() => reassignRelationship({ db, subjectPersonId: 's1', relatedPersonId: 'p2', type: 'primary_counsellor', domain: 'counselling' }), /Verified consent/);
});

test('reassignRelationship ends the previous professional and creates one active replacement after consent', async () => {
  const db = makeDb([{ id: 'old', subjectPersonId: 's1', relatedPersonId: 'p1', type: 'primary_counsellor', domain: 'counselling', status: 'active' }]);
  const result = await reassignRelationship({ db, subjectPersonId: 's1', relatedPersonId: 'p2', type: 'primary_counsellor', domain: 'counselling', consentVerified: true });
  assert.equal(result.reassigned, true);
  assert.equal(db._docs.get('old').status, 'ended');
  assert.equal([...db._docs.values()].filter(x => x.status === 'active').length, 1);
  assert.equal([...db._docs.values()].find(x => x.status === 'active').relatedPersonId, 'p2');
});

test('reassignRelationship is idempotent when the target is already active and consent is verified', async () => {
  const db = makeDb([{ id: 'current', subjectPersonId: 's1', relatedPersonId: 'p2', type: 'career_counsellor', domain: 'career', status: 'active' }]);
  const result = await reassignRelationship({ db, subjectPersonId: 's1', relatedPersonId: 'p2', type: 'career_counsellor', domain: 'career', consentVerified: true });
  assert.equal(result.reassigned, false);
  assert.equal(db._docs.size, 1);
});

test('endRelationships ends all active relationships for the student/domain/type', async () => {
  const db = makeDb([
    { id: 'r1', subjectPersonId: 's1', relatedPersonId: 'p1', type: 'sen_professional', domain: 'sen', status: 'active' },
    { id: 'r2', subjectPersonId: 's1', relatedPersonId: 'p2', type: 'sen_professional', domain: 'sen', status: 'active' },
  ]);
  const count = await endRelationships({ db, subjectPersonId: 's1', type: 'sen_professional', domain: 'sen' });
  assert.equal(count, 2);
  assert.equal([...db._docs.values()].every(x => x.status === 'ended'), true);
});
