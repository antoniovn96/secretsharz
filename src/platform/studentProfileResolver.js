import normalizeStudentRecord from './studentRecordNormalizer.js';

const ROLE_ALIASES = {
  career: ['career', 'career_counsellor', 'career-counsellor', 'career counsellor'],
  wellbeing: ['wellbeing', 'psychologist', 'psychology', 'counsellor', 'counselor'],
  sen: ['sen', 'sen_teacher', 'sen_educator', 'educator', 'special_education'],
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

function canonicalRole(role = '') {
  const value = String(role).trim().toLowerCase().replace(/\s+/g, '_');
  if (['admin', 'superadmin', 'super_admin'].includes(value)) return 'super_admin';
  if (ROLE_ALIASES.career.includes(value.replace(/_/g, ' ')) || value === 'career_counsellor') return 'career_counsellor';
  if (ROLE_ALIASES.wellbeing.includes(value.replace(/_/g, ' ')) || value === 'psychologist') return 'psychologist';
  if (ROLE_ALIASES.sen.includes(value.replace(/_/g, ' ')) || value === 'sen_educator') return 'sen_educator';
  if (value === 'parent' || value === 'guardian') return 'parent';
  if (value === 'institution') return 'institution';
  return 'student';
}

function hasAssignment(profile, service, viewerId) {
  if (!viewerId) return false;
  return profile.relationships?.assignments?.[service] === viewerId;
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
  if (result.sen && typeof result.sen === 'object') {
    delete result.sen.internalNotes;
  }
  return result;
}

export function resolveStudentProfile(rawStudent = {}, viewer = {}) {
  const profile = normalizeStudentRecord(rawStudent, rawStudent.id || rawStudent.uid || null);
  const role = canonicalRole(viewer.role || viewer.userRole || viewer.profileType);
  const viewerId = viewer.id || viewer.uid || null;
  const viewerInstitutionId = viewer.institutionId || viewer.institution?.id || null;
  const domains = DOMAIN_BY_ROLE[role] || DOMAIN_BY_ROLE.student;
  const isStudentOwner = role === 'student' && viewerId && viewerId === profile.id;
  const isParentLinked = role === 'parent' && profile.relationships.parents.includes(viewerId);
  const isInstitutionLinked = role === 'institution' && viewerInstitutionId && viewerInstitutionId === profile.relationships.institutionId;
  const assignedService = role === 'career_counsellor' ? 'career' : role === 'psychologist' ? 'wellbeing' : role === 'sen_educator' ? 'sen' : null;
  const isProfessionalLinked = Boolean(assignedService && hasAssignment(profile, assignedService, viewerId));

  let allowedDomains = [];
  if (role === 'super_admin' || isStudentOwner) allowedDomains = domains;
  else if (isParentLinked) allowedDomains = domains;
  else if (isInstitutionLinked) allowedDomains = domains;
  else if (isProfessionalLinked) allowedDomains = domains;
  else return { allowed: false, role, reason: 'Viewer has no permitted relationship with this student.' };

  const visible = {};
  allowedDomains.forEach((domain) => {
    if (profile[domain] !== undefined) visible[domain] = clone(profile[domain]);
  });

  if (role !== 'super_admin' && !isStudentOwner) {
    if (role === 'career_counsellor') {
      delete visible.wellbeing;
      delete visible.sen;
    }
    if (role === 'psychologist') {
      delete visible.career;
      delete visible.sen;
    }
    if (role === 'sen_educator') {
      delete visible.career;
      delete visible.wellbeing;
    }
    if (role === 'institution') {
      delete visible.family;
      delete visible.wellbeing;
      delete visible.sen;
      delete visible.career;
    }
  }

  return {
    allowed: true,
    role,
    service: assignedService,
    profile: redactRestricted(visible),
  };
}

export default resolveStudentProfile;
