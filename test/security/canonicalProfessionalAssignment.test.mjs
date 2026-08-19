import test from 'node:test';
import assert from 'node:assert/strict';
import { PROFESSIONAL_ASSIGNMENT_RULES } from '../../src/security/canonicalProfessionalAssignment.js';

test('career uses one primary career counsellor assignment',()=>{
  assert.deepEqual(PROFESSIONAL_ASSIGNMENT_RULES.career,{domain:'career',types:['career_counsellor'],slots:['primary']});
});

test('wellbeing permits primary and backup counsellor assignments',()=>{
  assert.deepEqual(PROFESSIONAL_ASSIGNMENT_RULES.psychology,{domain:'counselling',types:['primary_counsellor'],slots:['primary','backup']});
});

test('SEN permits primary and multidisciplinary assignments',()=>{
  assert.deepEqual(PROFESSIONAL_ASSIGNMENT_RULES.sen,{domain:'sen',types:['sen_professional'],slots:['primary','multidisciplinary']});
});
