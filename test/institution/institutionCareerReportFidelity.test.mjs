import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeInstitutionalCareerReport } from '../../src/institution/institutionalCareerReportSerializer.js';
import { buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';
import { getAssessmentEvidenceCoverage } from '../../src/career/assessmentCoverage.js';

test('institution serializer preserves explicit report evidence and strips unrelated fields', () => {
  const source = {
    scores: {
      riasecCode: 'RIA', riasec: { R: 4 }, reasoning: { percent: 71 }, readinessPercent: 80,
      adaptabilityPercent: 76, values: { autonomy: 5 }, big5: { openness: 4 }, environment: { collaboration: true }
    },
    careerExploration: [{ id: 'c1', name: 'Engineer', interestAlignmentIndex: 82 }],
    topCareerDirections: [{ id: 'c1', name: 'Engineer' }],
    alternativeCareers: [{ id: 'c2', name: 'Technical Writer' }],
    educationRoadmap: { routes: ['BTech'] }, skillsEvidence: { skills: ['Python'] },
    affordability: { scholarships: ['Merit'] }, actionRoadmap: { days: 90 },
    privateClinicalRecord: { diagnosis: 'must not cross boundary' },
    senRecord: { plan: 'must not cross boundary' }
  };
  const report = serializeInstitutionalCareerReport(source);
  assert.equal(report.scores.riasecCode, 'RIA');
  assert.equal(report.scores.environment.collaboration, true);
  assert.equal(report.topCareerDirections[0].name, 'Engineer');
  assert.equal(report.educationRoadmap.routes[0], 'BTech');
  assert.equal(report.privateClinicalRecord, undefined);
  assert.equal(report.senRecord, undefined);
});

test('coverage does not convert missing premium evidence into availability', () => {
  const report = serializeInstitutionalCareerReport({ scores: { riasecCode: 'RIA' } });
  const coverage = getAssessmentEvidenceCoverage(report);
  const byId = Object.fromEntries(coverage.sections.map(x => [x.id, x.assessed]));
  assert.equal(byId.riasec_profile, true);
  assert.equal(byId.decision_readiness, false);
  assert.equal(byId.adaptability, false);
  assert.equal(byId.personality_profile, false);
});

test('admin contract requires explicit top-career evidence instead of reusing exploration', () => {
  const sections = buildInstitutionCareerReflection({ careerExploration: [{ name: 'Engineer' }] });
  const byId = Object.fromEntries(sections.map(x => [x.id, x.available]));
  assert.equal(byId.career_directions, true);
  assert.equal(byId.top_career_directions, false);
});
