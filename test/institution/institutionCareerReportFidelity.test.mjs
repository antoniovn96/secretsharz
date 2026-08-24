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

test('institution serializer has an explicit top-level allowlist', () => {
  const report = serializeInstitutionalCareerReport({ unexpectedPrivateField: 'secret', counsellingNotes: 'private' });
  const allowed = new Set([
    'version','pathway','bundleId','bundleSku','bundleTitle','selectedFamilyIds','selectedTestCount','deliveryMode',
    'estimatedMinutes','questionCount','reportPages','reportType','reportTier','embeddedGuidanceLayer','careerMatching',
    'completedAt','executiveSnapshot','executiveSummary','snapshot','topCareerDirections','alternativeCareers',
    'pathwayAnalysis','pathways','streamAnalysis','streamScenarios','educationRoadmap','education','skillsEvidence',
    'skillsPlan','affordability','friction','actionRoadmap','actionPlan','counsellorReview','reviewLimitations',
    'workEnvironment','intake','scores','careerExploration','decisionSupportCoverage','reflection'
  ]);
  for (const key of Object.keys(report)) assert.equal(allowed.has(key), true, `Unexpected serialized field: ${key}`);
  assert.equal(report.unexpectedPrivateField, undefined);
  assert.equal(report.counsellingNotes, undefined);
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

test('explicit family selection prevents stale score objects from inflating evidence coverage', () => {
  const report = serializeInstitutionalCareerReport({
    selectedFamilyIds: ['interest'],
    scores: {
      riasecCode: 'RIA', big5: { openness: 4 }, values: { autonomy: 5 }, reasoning: { percent: 90 },
      readinessPercent: 95, adaptabilityPercent: 95, environment: { collaboration: true },
      skills: { percent: 88 }, learning: { percent: 88 }
    },
    careerExploration: [{ id: 'c1', name: 'Engineer' }]
  });
  const coverage = getAssessmentEvidenceCoverage(report);
  const byId = Object.fromEntries(coverage.sections.map(x => [x.id, x.assessed]));
  assert.equal(byId.riasec_profile, true);
  assert.equal(byId.career_directions, true);
  assert.equal(byId.personality_profile, false);
  assert.equal(byId.career_values, false);
  assert.equal(byId.reasoning_profile, false);
  assert.equal(byId.decision_readiness, false);
  assert.equal(byId.adaptability, false);
  assert.equal(byId.work_environment, false);
  assert.equal(byId.skills_profile, false);
  assert.equal(byId.learning_preferences, false);
});

test('full family selection is required for embedded guidance evidence', () => {
  const report = serializeInstitutionalCareerReport({
    selectedFamilyIds: ['interest', 'personality', 'aptitude_skills', 'work_values'],
    scores: { readinessPercent: 80, adaptabilityPercent: 75, environment: { collaboration: true } }
  });
  const coverage = getAssessmentEvidenceCoverage(report);
  const byId = Object.fromEntries(coverage.sections.map(x => [x.id, x.assessed]));
  assert.equal(byId.decision_readiness, false);
  assert.equal(byId.adaptability, false);
  assert.equal(byId.work_environment, false);
  report.selectedFamilyIds.push('learning');
  const fullCoverage = getAssessmentEvidenceCoverage(report);
  const fullById = Object.fromEntries(fullCoverage.sections.map(x => [x.id, x.assessed]));
  assert.equal(fullById.decision_readiness, true);
  assert.equal(fullById.adaptability, true);
  assert.equal(fullById.work_environment, true);
});

test('admin contract requires explicit top-career evidence instead of reusing exploration', () => {
  const sections = buildInstitutionCareerReflection({ careerExploration: [{ name: 'Engineer' }] });
  const byId = Object.fromEntries(sections.map(x => [x.id, x]));
  assert.equal(byId.career_directions, undefined);
  assert.equal(byId.top_career_directions.available, false);
});

test('affordability provenance is only catalogue when explicitly declared', () => {
  const catalogue = buildInstitutionCareerReflection({ affordability: { source: 'career_catalogue', scholarships: ['Merit'] } });
  const catalogueRow = catalogue.find(x => x.id === 'affordability');
  assert.equal(catalogueRow.available, true);
  assert.equal(catalogueRow.source, 'career_catalogue');
  const derived = buildInstitutionCareerReflection({ affordability: { scholarships: ['Merit'] } });
  const derivedRow = derived.find(x => x.id === 'affordability');
  assert.equal(derivedRow.source, 'derived_from_assessment');
});
