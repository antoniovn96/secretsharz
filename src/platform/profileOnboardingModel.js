// Unified profile/onboarding rules for students and working professionals.
// This model keeps school/guardian fields out of professional profiles and
// requires reliable contact/emergency information for adult self-service users.

import { EMPTY_LOCATION, normalizeLocation } from './locationModel.js';

export const PROFILE_TYPES = Object.freeze(['student', 'working_professional']);

export function deriveProfileType({ profileType, role } = {}) {
  if (PROFILE_TYPES.includes(profileType)) return profileType;
  if (role === 'professional' || role === 'mentor' || role === 'employer') return 'working_professional';
  return 'student';
}

export function requiresGuardian({ profileType, age }) {
  return profileType === 'student' && Number(age) < 18;
}

export function normalizeProfileLocation(value) {
  return normalizeLocation(value || EMPTY_LOCATION);
}

export function formatCountryPhone(countryCode, countryName, phone) {
  const code = String(countryCode || '').trim();
  const country = String(countryName || '').trim();
  const number = String(phone || '').trim();
  return [code, country ? `(${country})` : '', number].filter(Boolean).join(' ');
}

export function isProfileComplete(data = {}) {
  if (data.profileComplete === true || data.onboardingCompleted === true) return true;

  const type = deriveProfileType({ profileType: data.profileType, role: data.role });
  const name = data.name || data.fullName;
  const dob = data.dob || data.dateOfBirth;
  const phone = data.contactNumber || data.phone;
  const emergencyName = data.emergencyContactName || data.emergencyName;
  const emergencyNumber = data.emergencyContactNumber || data.emergencyContactPhone;
  const age = Number(data.age);

  if (!name || !dob || !phone) return false;
  if (type === 'working_professional') return Boolean(emergencyName && emergencyNumber);
  if (!data.grade && !data.gradeOrCourse) return false;
  if (requiresGuardian({ profileType: type, age })) return Boolean(data.parentName && data.parentContact);
  return true;
}

export function validateProfile({
  profileType,
  age,
  name,
  grade = '',
  schoolName = '',
  parentName = '',
  parentContact = '',
  contactNumber = '',
  emergencyContactName = '',
  emergencyContactNumber = '',
}) {
  const type = deriveProfileType({ profileType });
  const errors = [];
  const numericAge = Number(age);
  if (!name?.trim()) errors.push('Full name is required.');
  if (!Number.isFinite(numericAge) || numericAge < 10 || numericAge > 120) errors.push('Please enter a valid age.');
  if (type === 'student') {
    if (!grade?.trim()) errors.push('Current grade / class is required for students.');
    if (requiresGuardian({ profileType: type, age: numericAge })) {
      if (!parentName?.trim()) errors.push('Parent / guardian name is required for students under 18.');
      if (!parentContact?.trim()) errors.push('Parent / guardian contact number is required for students under 18.');
    }
  }
  if (type === 'working_professional') {
    if (!contactNumber?.trim()) errors.push('Your contact number is required for a professional profile.');
    if (!emergencyContactName?.trim()) errors.push('Emergency contact name is required for a professional profile.');
    if (!emergencyContactNumber?.trim()) errors.push('Emergency contact number is required for a professional profile.');
  }
  return { valid: errors.length === 0, errors, profileType: type };
}

export function buildProfileRecord(input) {
  const validation = validateProfile(input);
  if (!validation.valid) throw new Error(validation.errors[0]);
  const type = validation.profileType;
  const location = normalizeProfileLocation(input.location);
  return {
    profileType: type,
    name: input.name.trim(),
    age: Number(input.age),
    dob: input.dob || '',
    grade: type === 'student' ? String(input.grade || '').trim() : '',
    schoolName: type === 'student' ? String(input.schoolName || '').trim() : '',
    institutionName: type === 'working_professional' ? String(input.institutionName || '').trim() : '',
    professionalTitle: type === 'working_professional' ? String(input.professionalTitle || '').trim() : '',
    parentName: type === 'student' ? String(input.parentName || '').trim() : '',
    parentContact: type === 'student' ? String(input.parentContact || '').trim() : '',
    contactNumber: String(input.contactNumber || '').trim(),
    countryCode: String(input.countryCode || location.countryCode || '').trim(),
    countryName: String(input.countryName || location.countryName || '').trim(),
    location,
    emergencyContactName: String(input.emergencyContactName || '').trim(),
    emergencyContactNumber: String(input.emergencyContactNumber || '').trim(),
    profileComplete: true,
    updatedAt: new Date().toISOString(),
  };
}
