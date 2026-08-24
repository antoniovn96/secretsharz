import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCareerEvidenceProfile, buildInterestAlignmentExplanation } from '../../src/career/careerEvidenceProfile.js';
import { matchCareerToSelectedProfile } from '../../src/career/scoreSelectedAssessment.js';

test('career evidence profile only exposes catalogue-backed fields', () => {
  const profile = buildCareerEvidenceProfile({ id:'software', title:'Software Engineer', riasec:['I','R'], stream:['Science'], skills:['Coding'], education:'4 yrs' });
  assert.deepEqual(profile.interestProfile, ['I','R']);
  assert.deepEqual(profile.streams, ['Science']);
  assert.deepEqual(profile.skills, ['Coding']);
  assert.equal(profile.personality, undefined);
  assert.equal(profile.values, undefined);
});

test('career matcher ranks using RIASEC evidence only', () => {
  const scored = { riasec:{I:30,R:28,A:5,S:5,E:4,C:4}, big5:{O:30,C:30,E:30,A:30,N:30}, values:{autonomy:5}, reasoning:{percent:100}, skills:{percent:100}, learning:{percent:100}, readinessPercent:100, adaptabilityPercent:100, environment:{people:5} };
  const result = matchCareerToSelectedProfile({ id:'software', title:'Software Engineer', riasec:['I','R'], stream:['Science'], skills:['Coding'] }, scored);
  assert.equal(result.scoreLabel, 'Interest Alignment Index');
  assert.equal(result.excludedFromRanking.includes('big5'), true);
  assert.equal(result.excludedFromRanking.includes('academicAverage'), true);
  assert.ok(Number.isInteger(result.interestAlignmentIndex));
  assert.equal(result.interestAlignmentIndex, result.explorationIndex);
  assert.equal(result.rankingStatus, 'available');
});

test('career matcher refuses to calculate an alignment score without RIASEC evidence', () => {
  const result = matchCareerToSelectedProfile(
    { id:'software', title:'Software Engineer', riasec:['I','R'], stream:['Science'], skills:['Coding'] },
    { riasec:null, big5:{O:30,C:30,E:30,A:30,N:30}, values:{autonomy:5}, reasoning:{percent:100} }
  );
  assert.equal(result.interestAlignmentIndex, null);
  assert.equal(result.explorationIndex, null);
  assert.equal(result.similarity, null);
  assert.equal(result.rankingStatus, 'insufficient_evidence');
  assert.match(result.rankingLimitation, /RIASEC/i);
});

test('zeroed RIASEC containers cannot manufacture an alignment score', () => {
  const result = matchCareerToSelectedProfile(
    { id:'software', title:'Software Engineer', riasec:['I','R'] },
    { riasec:{R:0,I:0,A:0,S:0,E:0,C:0} }
  );
  assert.equal(result.interestAlignmentIndex, null);
  assert.equal(result.rankingStatus, 'insufficient_evidence');
});

test('career explanation identifies actual overlapping interest themes', () => {
  const explanation = buildInterestAlignmentExplanation({I:30,R:25,A:4,S:4,E:3,C:3}, ['I','C']);
  assert.deepEqual(explanation.studentTopInterests.slice(0,2), ['I','R']);
  assert.deepEqual(explanation.overlappingInterests, ['I']);
  assert.match(explanation.rationale, /I/);
});
