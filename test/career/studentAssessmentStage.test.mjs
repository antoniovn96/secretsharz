import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STUDENT_ASSESSMENT_STAGES,
  assessmentStageForGrade,
  assessmentStageMeta,
  careerGoalModeForStage,
  isCareerAssessmentEligible,
  normaliseStudentGrade,
  studentAssessmentRouting,
} from '../../src/career/studentAssessmentStage.js';

test('career assessment is eligible from Class 7 through Class 12', () => {
  for (let grade = 7; grade <= 12; grade += 1) assert.equal(isCareerAssessmentEligible(grade), true);
  assert.equal(isCareerAssessmentEligible(6), false);
  assert.equal(isCareerAssessmentEligible(13), false);
});

test('grade routing matches the agreed developmental stages', () => {
  assert.equal(assessmentStageForGrade(7), STUDENT_ASSESSMENT_STAGES.GRADE_7_8);
  assert.equal(assessmentStageForGrade(8), STUDENT_ASSESSMENT_STAGES.GRADE_7_8);
  assert.equal(assessmentStageForGrade(9), STUDENT_ASSESSMENT_STAGES.GRADE_9);
  assert.equal(assessmentStageForGrade(10), STUDENT_ASSESSMENT_STAGES.GRADE_10);
  assert.equal(assessmentStageForGrade(11), STUDENT_ASSESSMENT_STAGES.GRADE_11);
  assert.equal(assessmentStageForGrade(12), STUDENT_ASSESSMENT_STAGES.GRADE_12);
});

test('grade parser accepts common Class/Grade labels', () => {
  assert.equal(normaliseStudentGrade('Class 7'), 7);
  assert.equal(normaliseStudentGrade('Grade 10'), 10);
  assert.equal(normaliseStudentGrade('11'), 11);
  assert.equal(normaliseStudentGrade('class 12'), 12);
});

test('stage metadata progressively increases career decision specificity', () => {
  assert.equal(assessmentStageMeta(STUDENT_ASSESSMENT_STAGES.GRADE_7_8).formalCareerDecision, false);
  assert.equal(assessmentStageMeta(STUDENT_ASSESSMENT_STAGES.GRADE_10).formalCareerDecision, true);
  assert.equal(assessmentStageMeta(STUDENT_ASSESSMENT_STAGES.GRADE_12).formalCareerDecision, true);
  assert.equal(careerGoalModeForStage(STUDENT_ASSESSMENT_STAGES.GRADE_7_8), 'light');
  assert.equal(careerGoalModeForStage(STUDENT_ASSESSMENT_STAGES.GRADE_12), 'specific');
});

test('vocational and ITI pathways route to vocational guidance', () => {
  assert.equal(studentAssessmentRouting({ grade: 10, pathway: 'ITI / CTS' }), STUDENT_ASSESSMENT_STAGES.DIPLOMA_VOCATIONAL);
  assert.equal(studentAssessmentRouting({ grade: 11, pathway: 'Diploma / Polytechnic' }), STUDENT_ASSESSMENT_STAGES.DIPLOMA_VOCATIONAL);
});

test('declared grade remains authoritative when age is not supplied', () => {
  assert.equal(studentAssessmentRouting({ grade: 'Class 11' }), STUDENT_ASSESSMENT_STAGES.GRADE_11);
});
