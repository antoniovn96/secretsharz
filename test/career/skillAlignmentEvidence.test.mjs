import assert from 'node:assert/strict';
import { buildCareerSkillEvidence, normalizeCareerSkills } from '../../src/career/careerSkillOntology.js';
import { buildSkillAlignmentEvidence } from '../../src/career/skillAlignmentEvidence.js';

assert.deepEqual(normalizeCareerSkills(['Coding', 'Problem Solving', 'Unknown']), ['coding', 'problem_solving']);
const career = { id: 'software', title: 'Software Engineer', skills: ['Coding', 'Algorithms', 'Problem Solving', 'Mathematics'] };
const careerEvidence = buildCareerSkillEvidence(career);
assert.equal(careerEvidence.evidenceType, 'career_descriptor');
assert.equal(careerEvidence.supportsQuantitativeAbilityMatching, false);

const unavailable = buildSkillAlignmentEvidence({ skills: { coding: 5 } }, career);
assert.equal(unavailable.status, 'unavailable');
assert.equal(unavailable.matchedSkills.length, 0);

const descriptive = buildSkillAlignmentEvidence({ skills: { evidenceType: 'demonstrated', labels: ['Coding', 'Problem Solving'] } }, career);
assert.equal(descriptive.status, 'descriptive');
assert.deepEqual(descriptive.matchedSkills, ['coding', 'problem_solving']);

console.log('skillAlignmentEvidence.test.mjs passed');
