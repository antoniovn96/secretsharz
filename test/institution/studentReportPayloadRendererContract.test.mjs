import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = path => readFile(fileURLToPath(new URL(path, root)), 'utf8');

const [serializer, contract, shell] = await Promise.all([
  read('src/institution/institutionalCareerReportSerializer.js'),
  read('src/institution/careerReportDataContract.js'),
  read('src/institution/InstitutionCareerReportShell.jsx'),
]);

test('institution serializer preserves every canonical report output field', () => {
  for (const field of [
    'executiveSnapshot','executiveSummary','snapshot','topCareerDirections','alternativeCareers',
    'pathwayAnalysis','pathways','streamAnalysis','streamScenarios','educationRoadmap','education',
    'skillsEvidence','skillsPlan','affordability','friction','actionRoadmap','actionPlan',
    'counsellorReview','reviewLimitations','workEnvironment','careerExploration','reflection'
  ]) assert.match(serializer, new RegExp(`\\b${field}\\b`), `serializer must preserve ${field}`);
});

test('canonical contract and renderer cover every premium report section', () => {
  const ids = [
    'executive_snapshot','interest_personality','strengths_values','developmental_context',
    'riasec_profile','personality_profile','career_values','reasoning_profile','decision_readiness',
    'adaptability','work_environment','career_directions','top_career_directions','alternative_careers',
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

test('renderer does not turn a generic reflection statement into a 90-day roadmap', () => {
  assert.match(shell, /hasActionRoadmap=sectionSource\('action_roadmap'\)!=='unavailable'/);
  assert.match(shell, /report\.actionRoadmap\|\|report\.actionPlan\|\|\{recommendedNextStep:report\.reflection\?\.recommendedNextStep\}/);
});
