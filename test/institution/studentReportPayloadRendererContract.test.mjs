import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = path => readFile(fileURLToPath(new URL(path, root)), 'utf8');

const [serializer, contract, shell, dashboard] = await Promise.all([
  read('src/institution/institutionalCareerReportSerializer.js'),
  read('src/institution/careerReportDataContract.js'),
  read('src/institution/InstitutionCareerReportShell.jsx'),
  read('src/institution/InstitutionCareerDashboard.jsx'),
]);

test('institution serializer preserves every canonical report output field', () => {
  for (const field of [
    'executiveSnapshot','executiveSummary','snapshot','topCareerDirections','alternativeCareers',
    'pathwayAnalysis','pathways','streamAnalysis','streamScenarios','educationRoadmap','education',
    'skillsEvidence','skillsPlan','affordability','friction','actionRoadmap','actionPlan',
    'counsellorReview','reviewLimitations','workEnvironment','careerExploration','reflection'
  ]) assert.match(serializer, new RegExp(`\\b${field}\\b`), `serializer must preserve ${field}`);
});

test('institution serializer preserves student-visible career and intake evidence', () => {
  for (const field of [
    'explorationIndex','matchScore','interestAlignmentIndex','stream','desc','rationale',
    'age','ageBand','likedSubjects','dislikedSubjects','subjectsLiked','subjectsDisliked'
  ]) assert.match(serializer, new RegExp(`\\b${field}\\b`), `serializer must preserve ${field}`);
});

test('canonical contract and renderer cover every premium report section', () => {
  const ids = [
    'executive_snapshot','interest_personality','strengths_values','developmental_context',
    'riasec_profile','personality_profile','career_values','reasoning_profile','decision_readiness',
    'adaptability','work_environment','top_career_directions','alternative_careers',
    'pathway_analysis','stream_analysis','education_roadmap','skills_evidence','affordability',
    'action_roadmap','counsellor_review'
  ];
  for (const id of ids) assert.match(contract, new RegExp(`['\\"]${id}['\\"]`), `contract must contain ${id}`);
  for (const label of [
    'Executive snapshot','Academic & developmental context','Career interest profile','Personality tendencies',
    'Career values','Reasoning sampler','Career directions to explore','Top career directions',
    'Career decision readiness','Adaptability & career resilience','Preferred work environment',
    'Non-linear pathway analysis','Stream & subject scenarios','Education roadmap','Skills & evidence plan',
    'Affordability, scholarships & friction','Alternative & unexpected careers','90-day career action roadmap',
    'Counsellor conversation & limitations'
  ]) assert.match(shell, new RegExp(label.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')), `renderer must contain ${label}`);
});

test('Admin renderer displays student age and age-band when supplied', () => {
  assert.match(shell, /\[\['Age',intake\.age\]/);
  assert.match(shell, /\['Age band',intake\.ageBand\]/);
});

test('Admin career lists preserve student-visible direction evidence', () => {
  for (const field of ['explorationIndex','matchScore','interestAlignmentIndex','rationale','stream']) {
    assert.match(shell, new RegExp(`\\b${field}\\b`), `renderer must display ${field} when present`);
  }
});

test('Admin assessment displays remain gated by actual assessment evidence', () => {
  assert.match(shell, /const assessed=id=>Boolean\(evidence\.find\(x=>x\.id===id\)\?\.assessed\)/);
  assert.match(shell, /hasRiasec=assessed\('riasec_profile'\)/);
  assert.match(shell, /hasReasoning=assessed\('reasoning_profile'\)/);
  assert.match(shell, /hasValues=assessed\('career_values'\)/);
  assert.match(shell, /hasBig5=assessed\('personality_profile'\)/);
});

test('Admin report has a single canonical report renderer', () => {
  assert.doesNotMatch(dashboard, /InstitutionCareerReportViewV2/);
  assert.match(dashboard, /InstitutionCareerReportShell/);
});

test('renderer does not turn a generic reflection statement into a 90-day roadmap', () => {
  assert.match(shell, /hasActionRoadmap=sectionSource\('action_roadmap'\)!=='unavailable'/);
  assert.match(shell, /report\.actionRoadmap\|\|report\.actionPlan\|\|\{recommendedNextStep:report\.reflection\?\.recommendedNextStep\}/);
});
