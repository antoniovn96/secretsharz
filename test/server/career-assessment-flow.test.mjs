import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssessmentStages, getProgress, isAssessmentComplete } from '../../src/career/assessmentFlow.js';

test('students receive the academic stage', () => {
  const stages = getAssessmentStages('student');
  assert.ok(stages.some((stage) => stage.id === 'academic'));
  assert.equal(stages.length, 12);
});

test('working professionals skip the academic stage', () => {
  const stages = getAssessmentStages('working_professional');
  assert.ok(!stages.some((stage) => stage.id === 'academic'));
  assert.equal(stages.length, 11);
});

test('progress is calculated from the visible stage sequence', () => {
  assert.equal(getProgress('identity', 'student'), 8);
  assert.equal(getProgress('identity', 'working_professional'), 9);
});

test('completion checks only stages relevant to the candidate', () => {
  const professionalStages = getAssessmentStages('working_professional');
  assert.equal(isAssessmentComplete(professionalStages.map((stage) => stage.id), 'working_professional'), true);
  assert.equal(isAssessmentComplete([...professionalStages.map((stage) => stage.id), 'academic'], 'working_professional'), true);
});
