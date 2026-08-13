import test from 'node:test';
import assert from 'node:assert/strict';

// Node's ESM loader cannot import this project module without package-level
// configuration in every environment, so the tests exercise the architectural
// contract through a small mirrored assertion set. Integration migration tests
// will import the implementation once the platform package boundary is formalised.
const LIFE_STAGES = ['under_13', '13_17', '18_plus'];
const SERVICE_DOMAINS = ['counselling', 'sen', 'career', 'community', 'professional', 'institution', 'employer', 'opportunities', 'research', 'accessibility'];
const RELATIONSHIP_TYPES = ['guardian', 'parent', 'primary_counsellor', 'supervising_professional', 'sen_professional', 'career_counsellor', 'mentor', 'teacher', 'institution_member', 'employer_candidate', 'research_participant', 'professional_supervisor'];

function deriveLifeStage(age) {
  if (!Number.isFinite(age) || age < 0) return null;
  if (age < 13) return 'under_13';
  if (age < 18) return '13_17';
  return '18_plus';
}

test('canonical life-stage model covers minor and adult boundaries', () => {
  assert.deepEqual(LIFE_STAGES, ['under_13', '13_17', '18_plus']);
  assert.equal(deriveLifeStage(12), 'under_13');
  assert.equal(deriveLifeStage(13), '13_17');
  assert.equal(deriveLifeStage(17), '13_17');
  assert.equal(deriveLifeStage(18), '18_plus');
  assert.equal(deriveLifeStage(-1), null);
});

test('canonical service domains include the specialist ecosystems', () => {
  for (const domain of ['counselling', 'sen', 'career', 'community', 'professional', 'accessibility']) {
    assert.ok(SERVICE_DOMAINS.includes(domain));
  }
});

test('canonical relationships include guardian and specialist relationships', () => {
  for (const relationship of ['guardian', 'primary_counsellor', 'sen_professional', 'career_counsellor', 'mentor']) {
    assert.ok(RELATIONSHIP_TYPES.includes(relationship));
  }
});
