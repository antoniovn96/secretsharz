import assert from 'node:assert/strict';
import { buildCareerEvidenceMatrix, getCareerEvidenceMatrixSummary } from '../../src/career/careerEvidenceMatrix.js';

const sample = [
  { id: 'one', title: 'One', category: 'Test', riasec: ['I', 'S'] },
  { id: 'two', title: 'Two', category: 'Test', riasec: [] },
];

const matrix = buildCareerEvidenceMatrix(sample);
assert.equal(matrix.length, 2);
assert.deepEqual(matrix[0].supportedDimensions, ['riasec']);
assert.equal(matrix[0].dimensions.personality, 'unavailable');
assert.deepEqual(matrix[1].supportedDimensions, []);

const summary = getCareerEvidenceMatrixSummary(sample);
assert.equal(summary.careerCount, 2);
assert.equal(summary.dimensions.riasec.supportedCareerCount, 1);
assert.equal(summary.dimensions.values.status, 'unavailable');

console.log('careerEvidenceMatrix.test.mjs passed');
