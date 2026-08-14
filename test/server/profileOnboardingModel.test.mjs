import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveProfileType, requiresGuardian, validateProfile, buildProfileRecord } from '../../src/platform/profileOnboardingModel.js';

test('students under 18 require guardian information', () => {
  assert.equal(requiresGuardian({ profileType: 'student', age: 16 }), true);
  assert.equal(validateProfile({ profileType: 'student', age: 16, name: 'A', grade: '11', parentName: '', parentContact: '' }).valid, false);
  assert.equal(validateProfile({ profileType: 'student', age: 16, name: 'A', grade: '11', parentName: 'Parent', parentContact: '+911234567890' }).valid, true);
});

test('adult students do not require guardian fields', () => {
  const result = validateProfile({ profileType: 'student', age: 20, name: 'A', grade: 'College' });
  assert.equal(result.valid, true);
});

test('working professionals do not require school or guardian fields', () => {
  const result = validateProfile({ profileType: 'working_professional', age: 30, name: 'A', contactNumber: '+911234567890', emergencyContactName: 'Emergency Person', emergencyContactNumber: '+919876543210' });
  assert.equal(result.valid, true);
  const profile = buildProfileRecord({ profileType: 'working_professional', age: 30, name: 'A', institutionName: '', professionalTitle: 'Designer', contactNumber: '+911234567890', emergencyContactName: 'Emergency Person', emergencyContactNumber: '+919876543210' });
  assert.equal(profile.grade, '');
  assert.equal(profile.parentName, '');
  assert.equal(profile.professionalTitle, 'Designer');
});

test('role can infer working-professional profile type', () => {
  assert.equal(deriveProfileType({ role: 'professional' }), 'working_professional');
  assert.equal(deriveProfileType({ role: 'student' }), 'student');
});
