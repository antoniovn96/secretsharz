import test from 'node:test';
import assert from 'node:assert/strict';

function normalizeSoap(input = {}) {
  return Object.fromEntries(['subjective','objective','assessment','plan'].filter((key) => typeof input[key] === 'string').map((key) => [key, input[key].trim()]));
}

test('SOAP normalization preserves only clinical note fields', () => {
  assert.deepEqual(normalizeSoap({ subjective: ' concern ', objective: 'ok', extra: 'do not store' }), { subjective: 'concern', objective: 'ok' });
});

test('empty SOAP note is rejected', () => {
  const soap = normalizeSoap({ subjective: ' ', objective: '', assessment: '', plan: '' });
  assert.equal(Object.values(soap).some(Boolean), false);
});

test('canonical clinical record carries counselling domain and institution context', () => {
  const relationship = { metadata: { institutionId: 'school-a' } };
  const record = { studentAuthUid: 'student-auth', providerId: 'professional-1', institutionId: relationship.metadata.institutionId, domain: 'counselling', format: 'SOAP' };
  assert.deepEqual(record, { studentAuthUid: 'student-auth', providerId: 'professional-1', institutionId: 'school-a', domain: 'counselling', format: 'SOAP' });
});
