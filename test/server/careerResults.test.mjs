import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCareerResults, buildRoadmap } from '../../src/career/careerResults.js';

test('unpaid result is intentionally partial', () => {
  const result = buildCareerResults({ profile: { status: 'student', age: 16 }, matches: [{ rank: 1 }, { rank: 2 }, { rank: 3 }, { rank: 4 }], paid: false, catalogueVersion: 'catalog-v1.0' });
  assert.equal(result.access, 'partial');
  assert.equal(result.primaryMatches.length, 3);
  assert.deepEqual(result.additionalMatches, []);
  assert.equal(result.sections.includes('roadmap'), false);
});

test('paid result exposes the complete exploration structure', () => {
  const result = buildCareerResults({ profile: { status: 'working_professional', age: 30 }, matches: Array.from({ length: 10 }, (_, i) => ({ rank: i + 1 })), paid: true });
  assert.equal(result.access, 'full');
  assert.equal(result.primaryMatches.length, 5);
  assert.equal(result.additionalMatches.length, 5);
  assert.equal(result.sections.includes('colleges'), true);
  assert.equal(result.sections.includes('roadmap'), true);
});

test('roadmap preserves alternative college options', () => {
  const roadmap = buildRoadmap({ career: 'Psychologist', course: 'B.Sc. Psychology', collegeOptions: ['A', 'B'], steps: [{ title: 'Explore subjects' }, { title: 'Compare courses' }] });
  assert.deepEqual(roadmap.collegeOptions, ['A', 'B']);
  assert.equal(roadmap.steps.length, 2);
});
