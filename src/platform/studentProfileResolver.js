import normalizeStudentRecord from './studentRecordNormalizer.js';

const ROLE_ALIASES = {
  career: ['career', 'career_counsellor', 'career-counsellor', 'career counsellor'],
  wellbeing: ['wellbeing', 'psychologist', 'psychology', 'counsellor', 'counselor'],
  sen: ['sen', 'sen_teacher', 'sen_educator', 'educator', 'special_education'],
  institution: ['institution', 'institution_member', 'institution-member', 'institution member', 'school', 'school_coordinator', 'coordinator'],
};

const DOMAIN_BY_ROLE = {
  student: ['identity', 'contact', 'family', 'institution', 'academic', 'services', 'career', 'wellbeing', 'sen', 'assessments', 'goals', 'relationships', 'onboarding', 'governance'],
  parent: ['identity', 'academic', 'institution', 'services', 'career', 'wellbeing', 'sen', 'goals'],
  career_counsellor: ['identity', 'contact', 'institution', 'academic', 'services', 'career', 'assessments', 'goals', 'relationships'],
  psychologist: ['identity', 'contact', 'institution', 'academic', 'services', 'wellbeing', 'assessments', 'goals', 'relationships'],
  sen_educator: ['identity', 'contact', 'institution', 'academic', 'family', 'services', 'sen', 'assessments', 'goals', 'relationships'],
  institution: ['identity', 'academic', 'institution', 'services', 'relationships'],
  super_admin: ['identity', 'contact', 'family', 'institution', 'academic', 'services', 'career', 'wellbeing', 'sen', 'assessments', 'goals', 'relationships', 'onboarding', 'governance'],
};

function canonicalRole(role = '', institutionRole = '') {
  const value = String(role).trim().toLowerCase().replace(/\s+/g, '_');
  const institutionValue = String(institutionRole).trim().toLowerCase().replace(/\s+/g, '_');
  if (['admin', 'superadmin', 'super_admin'].includes(value)) return 'super_admin';
  if (ROLE_ALIASES.career.includes(value.replace(/_/g, ' ')) || value === 'career_counsellor') return 'career_counsellor';
  if (ROLE_ALIASES.wellbeing.includes(value.replace(/_/g, ' ')) || value === 'psychologist') return 'psychologist';
  if (ROLE_ALIASES.sen.includes(value.replace(/_/g, ' ')) || value === 'sen_educator') return 'sen_educator';
  if (value === 'parent' || value === 'guardian') return 'parent';
  if (ROLE_ALIASES.institution.includes(value.replace(/_/g, ' ')) || value === 'institution_member' || ['coordinator', 'institution_coordinator', 'school_coordinator', 'administrator'].includes(institutionValue)) return 'institution';
  return 'student';
}

function clone(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(clone);
  if (typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]));
}

function redactRestricted(profile) {
  const result = clone(profile);
  if (result.wellbeing && typeof result.wellbeing === 'object') {
    delete result.wellbeing.privateNotes;
    delete result.wellbeing.clinicalNotes;
    delete result.wellbeing.internalNotes;
  }
  if (result.sen && typeof result.sen === 'object') delete result.sen.internalNotes;
  return result;
}

/**
 * Pure projection resolver. Cross-user authorization MUST be established by
 * a server-side relationship resolver before calling this function.
 * Denormalized profile relationships are never sufficient by themselves.
 */
export function resolveStudentProfile(rawStudent = {}, viewer = {}) {
  const profile = normalizeStudentRecord(rawStudent, rawStudent.id || rawStudent.uid || null);
  const role = canonicalRole(viewer.role || viewer.userRole || viewer.profileType, viewer.institutionRole || viewer.institution?.role);
  const viewerId = viewer.id || viewer.uid || null;
  const viewerInstitutionId = viewer.institutionId || viewer.institution?.id || null;
  const domains = DOMAIN_BY_ROLE[role] || DOMAIN_BY_ROLE.student;
  const isStudentOwner = role === 'student' && viewerId && viewerId === profile.id;
  const isRelationshipAuthorized = viewer.relationshipAuthorized === true;
  const isParentLinked = role === 'parent' && isRelationshipAuthorized;
  const isInstitutionLinked = role === 'institution' && isRelationshipAuthorized && Boolean(viewerInstitutionId);
  const assignedService = role === 'career_counsellor' ? 'career' : role === 'psychologist' ? 'wellbeing' : role === 'sen_educator' ? 'sen' : null;
  const isProfessionalLinked = isRelationshipAuthorized && Boolean(assignedService && viewerId);

  let allowedDomains = [];
  if (role === 'super_admin' || isStudentOwner || isParentLinked || isInstitutionLinked || isProfessionalLinked) allowedDomains = domains;
  else return { allowed: false, role, reason: 'Viewer has no permitted relationship with this student.' };

  const visible = {};
  allowedDomains.forEach((domain) => { if (profile[domain] !== undefined) visible[domain] = clone(profile[domain]); });
  if (role !== 'super_admin' && !isStudentOwner) {
    if (role === 'career_counsellor') { delete visible.wellbeing; delete visible.sen; }
    if (role === 'psychologist') { delete visible.career; delete visible.sen; }
    if (role === 'sen_educator') { delete visible.career; delete visible.wellbeing; }
    if (role === 'institution') { delete visible.family; delete visible.wellbeing; delete visible.sen; delete visible.career; }
  }
  return { allowed: true, role, service: assignedService, profile: redactRestricted(visible) };
}

export default resolveStudentProfile;
