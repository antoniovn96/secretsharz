import test from 'node:test';
import assert from 'node:assert/strict';
import { ageGradeGuidance, buildAcademicDecisionContext, expectedStageFromAge, getSubjectOptions, subjectPerformanceInterpretation } from '../../src/career/academicContext.js';

test('age-stage guidance follows the requested Indian school-age model',()=>{
  assert.equal(expectedStageFromAge(3),'nursery'); assert.equal(expectedStageFromAge(4),'lkg'); assert.equal(expectedStageFromAge(5),'ukg');
  assert.equal(expectedStageFromAge(6),'grade_1'); assert.equal(expectedStageFromAge(15),'grade_10'); assert.equal(expectedStageFromAge(16),'grade_11');
  assert.equal(expectedStageFromAge(17),'grade_11'); assert.equal(expectedStageFromAge(18),'grade_12');
});

test('declared grade remains authoritative and age is a soft consistency check',()=>{
  const result=ageGradeGuidance(17,12); assert.equal(result.declaredGrade,12); assert.equal(result.ageExpectedGrade,11); assert.equal(result.ageGradeMismatch,true); assert.equal(result.ageGradeCheck,'soft_check_only');
});

test('grades 10 and below use subject performance as guidance context',()=>{
  assert.equal(subjectPerformanceInterpretation({subject:'Mathematics',marks:82,grade:10}).status,'strong');
  assert.equal(subjectPerformanceInterpretation({subject:'Mathematics',marks:44,grade:10}).status,'needs_support');
  const context=buildAcademicDecisionContext({age:15,grade:10,board:'cbse',subjectMarks:{Mathematics:44},goal:'become an engineer'});
  assert.equal(context.level,'secondary_or_below'); assert.equal(context.subjectPerformance[0].goalPath,'goal_plus_support_plus_alternative');
});

test('grades 11 and 12 preserve chosen subjects as pathway context',()=>{
  const context=buildAcademicDecisionContext({age:17,grade:11,board:'cbse',stream:'science_pcm',subjects:['Physics','Chemistry','Mathematics'],subjectMarks:{Mathematics:58},goal:'engineering'});
  assert.equal(context.level,'senior_secondary_or_above'); assert.equal(context.subjectPerformance[0].status,'senior_secondary_context_only');
  assert.equal(context.subjectOptions.includes('Physics'),true); assert.equal(context.subjectOptions.includes('Information Technology (802)'),true);
});

test('ITI is represented as a pathway and not falsely as a CBSE school subject',()=>{
  const options=getSubjectOptions({grade:11,board:'cbse',pathway:'iti'}); assert.deepEqual(options,['ITI trade — select from current DGT/NCVT/SCVT catalogue']);
});
