import test from 'node:test';
import assert from 'node:assert/strict';
import { enrichFullCareerResult, getCourseDiscovery } from '../../src/career/resultEnrichment.js';

test('full result exposes broad career exploration and related courses', () => {
  const result = enrichFullCareerResult({
    baseResult: { access: 'full', assessmentVersion: 'career-v1.0' },
    dimensions: { interests: 5, values: 4, work_style: 4, motivation: 4 },
    riasec: { ranked: [{ code: 'S', score: 20 }, { code: 'I', score: 18 }, { code: 'A', score: 15 }] },
    candidate: { goals: ['psychology', 'help people'] },
  });

  assert.equal(result.access, 'full');
  assert.ok(result.exploration.primary.length >= 1);
  assert.ok(result.courses.some((course) => course.id === 'bsc-psychology'));
  assert.deepEqual(result.colleges, []);
});

test('course discovery returns the starter course', () => {
  const course = getCourseDiscovery('bsc-psychology');
  assert.equal(course.title, 'B.Sc. Psychology');
  assert.equal(course.careerId, 'psychology-and-behaviour');
});
