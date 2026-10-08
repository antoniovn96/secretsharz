import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeInstitutionKey,
  normalizeNullableSourceValue,
  splitSourceCodePrefix,
} from '../../scripts/career-intelligence-crawler.mjs';

test('removes numeric institution prefix from display name but preserves source code', () => {
  assert.deepEqual(
    splitSourceCodePrefix('1006-Government Polytechnic, Murtijapur'),
    {
      sourceCode: '1006',
      displayName: 'Government Polytechnic, Murtijapur',
    }
  );
});

test('supports separators other than a plain hyphen', () => {
  assert.deepEqual(
    splitSourceCodePrefix('2010 – Government Polytechnic, Aurangabad'),
    {
      sourceCode: '2010',
      displayName: 'Government Polytechnic, Aurangabad',
    }
  );
});

test('does not invent a code when the source name has no identifier prefix', () => {
  assert.deepEqual(
    splitSourceCodePrefix('Government Polytechnic, Amravati'),
    {
      sourceCode: null,
      displayName: 'Government Polytechnic, Amravati',
    }
  );
});

test('converts unavailable source values to null', () => {
  assert.equal(normalizeNullableSourceValue('Not available'), null);
  assert.equal(normalizeNullableSourceValue('N/A'), null);
  assert.equal(normalizeNullableSourceValue('-'), null);
  assert.equal(normalizeNullableSourceValue('Maharashtra'), 'Maharashtra');
});

test('creates a stable identity key without changing the display name', () => {
  assert.equal(
    normalizeInstitutionKey("Shree Shivaji Education Society's Dr. Panjabrao Deshmukh Polytechnic, Amravati"),
    'shreeshivajieducationsocietysdrpanjabraodeshmukhpolytechnicamravati'
  );
});
