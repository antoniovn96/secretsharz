import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareContext } from '../../src/career/assessmentSelection.js';
import { isCareerAssessmentEligible, assessmentStageForGrade } from '../../src/career/studentAssessmentStage.js';

test('prepareContext preserves subjectDetails and derives subjectMarks', () => {
  const context = prepareContext({
    age: 15,
    className: 'Class 10',
    board: 'CBSE',
    stream: 'science',
    subjectDetails: {
      Mathematics: { mark: 62, enjoyment: 84 },
      Science: { mark: 78, enjoyment: 91 },
    },
    goal: 'Engineering',
  });

  assert.equal(context.grade, 10);
  assert.deepEqual(context.subjectMarks, { Mathematics: 62, Science: 78 });
  assert.equal(context.subjectDetails.Mathematics.enjoyment, 84);
  assert.ok(context.subjects.includes('Mathematics'));
  assert.equal(context.academicContext.subjectPerformance.find(x => x.subject === 'Mathematics').status, 'developing');
});

test('career assessment eligibility is Class 7 through Class 12 only', () => {
  assert.equal(isCareerAssessmentEligible('Class 6'), false);
  assert.equal(isCareerAssessmentEligible('Class 7'), true);
  assert.equal(isCareerAssessmentEligible('Grade 10'), true);
  assert.equal(isCareerAssessmentEligible('Class 12'), true);
  assert.equal(isCareerAssessmentEligible('Class 13'), false);
});

test('assessment stage follows declared class', () => {
  assert.equal(assessmentStageForGrade('Class 7'), 'grade_7_8');
  assert.equal(assessmentStageForGrade('Class 8'), 'grade_7_8');
  assert.equal(assessmentStageForGrade('Class 9'), 'grade_9');
  assert.equal(assessmentStageForGrade('Class 10'), 'grade_10');
  assert.equal(assessmentStageForGrade('Class 11'), 'grade_11');
  assert.equal(assessmentStageForGrade('Class 12'), 'grade_12');
});
