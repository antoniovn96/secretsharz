import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeInstitutionKey,
  normalizeNullableSourceValue,
  parseDteRows,
  splitChoiceCodeVariant,
  splitInstitutionStatus,
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

test('removes source-only provider status from an institute heading', () => {
  assert.deepEqual(
    splitInstitutionStatus('Government Polytechnic, Murtijapur( Government )'),
    {
      displayName: 'Government Polytechnic, Murtijapur',
      providerStatus: 'Government',
    }
  );
});

test('splits DTE choice-code variants without creating a new programme name', () => {
  assert.deepEqual(splitChoiceCodeVariant('100619111T'), {
    baseChoiceCode: '100619111',
    choiceCodeVariant: 'T',
  });
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

test('parses the actual DTE institute-heading + course-row shape', () => {
  const records = parseDteRows([
    ['1006-Government Polytechnic, Murtijapur( Government )'],
    ['1', '100619110', 'Civil Engineering', 'Government', 'English-Marathi(द्विभाषिक)', '60'],
    ['2', '100619111T', 'Civil Engineering', 'Government', 'English-Marathi(द्विभाषिक)', '3'],
    ['TOTAL', '63'],
  ], 'https://poly24.dtemaharashtra.gov.in/diploma24/index.php/hp_controller/instcourses');

  const institution = records.find((r) => r.recordType === 'institution');
  const programmes = records.filter((r) => r.recordType === 'programme');

  assert.equal(institution.institutionDisplayName, 'Government Polytechnic, Murtijapur');
  assert.equal(institution.sourceInstitutionCode, '1006');
  assert.equal(institution.providerStatus, 'Government');

  assert.equal(programmes.length, 2);
  assert.equal(programmes[0].sourceChoiceCode, '100619110');
  assert.equal(programmes[0].programmeDisplayName, 'Civil Engineering');
  assert.equal(programmes[0].sanctionedIntake, 60);
  assert.equal(programmes[1].choiceCodeVariant, 'T');
  assert.equal(programmes[1].programmeDisplayName, 'Civil Engineering');
});
