import test from 'node:test';
import assert from 'node:assert/strict';
import { STUDENT_PREMIUM_REPORT } from '../../src/career/reportArchitecture.js';
import { STUDENT_CAREER_ADMIN_CONTRACT } from '../../src/institution/careerReportDataContract.js';

test('student premium report and admin contract contain the same section ids', () => {
  const studentIds = STUDENT_PREMIUM_REPORT.map(section => section.id);
  const adminIds = STUDENT_CAREER_ADMIN_CONTRACT.map(([id]) => id);
  assert.deepEqual(adminIds.sort(), studentIds.sort());
});

test('admin contract has one and only one mapping per student report section', () => {
  const ids = STUDENT_CAREER_ADMIN_CONTRACT.map(([id]) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, STUDENT_PREMIUM_REPORT.length);
});

test('admin mappings have a title and at least one approved evidence path', () => {
  for (const [id, title, paths] of STUDENT_CAREER_ADMIN_CONTRACT) {
    assert.ok(id, 'missing section id');
    assert.ok(title, `missing title for ${id}`);
    assert.ok(Array.isArray(paths) && paths.length > 0, `missing evidence paths for ${id}`);
  }
});
