import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionReportViewModel } from '../../src/institution/institutionReportViewModel.js';

test('institution report view model preserves API coverage and evidence', () => {
  const vm = buildInstitutionReportViewModel({
    student: { fullName: 'Test Student' },
    report: { intake: { className: '10' }, scores: { riasecCode: 'RIA' } },
    coverage: { sections: [{ id: 'riasec_profile', available: true }] },
    assessmentEvidence: { assessedFamilies: 2 }
  });
  assert.equal(vm.student.fullName, 'Test Student');
  assert.equal(vm.assessmentEvidence.assessedFamilies, 2);
  assert.equal(vm.showSection('riasec_profile'), true);
  assert.equal(vm.showSection('education_roadmap'), false);
});
