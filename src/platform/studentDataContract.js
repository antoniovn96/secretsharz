// Secret Sharz canonical Student Data Contract.
// This file is intentionally declarative: it defines what a student record means,
// who supplies each domain, and the intended visibility boundary for dashboards.
// It does not replace Firestore data by itself; services should migrate toward these
// canonical field names and use the access policy before exposing sensitive fields.

export const STUDENT_DOMAINS = Object.freeze({
  identity: 'identity',
  contact: 'contact',
  family: 'family',
  academic: 'academic',
  services: 'services',
  career: 'career',
  wellbeing: 'wellbeing',
  sen: 'sen',
  assessments: 'assessments',
  goals: 'goals',
  relationships: 'relationships',
  governance: 'governance',
});

export const STUDENT_FIELDS = Object.freeze({
  // Identity
  studentId: { domain: 'identity', source: 'system', sensitivity: 'standard' },
  name: { domain: 'identity', source: 'student_or_authorized_creator', sensitivity: 'standard' },
  preferredName: { domain: 'identity', source: 'student', sensitivity: 'standard' },
  photoURL: { domain: 'identity', source: 'student', sensitivity: 'standard' },
  dob: { domain: 'identity', source: 'student_or_authorized_creator', sensitivity: 'sensitive' },
  gender: { domain: 'identity', source: 'student', sensitivity: 'sensitive' },
  pronouns: { domain: 'identity', source: 'student', sensitivity: 'sensitive' },
  country: { domain: 'identity', source: 'student', sensitivity: 'standard' },
  city: { domain: 'identity', source: 'student', sensitivity: 'standard' },

  // Contact
  email: { domain: 'contact', source: 'system_or_student', sensitivity: 'standard' },
  contactNumber: { domain: 'contact', source: 'student_or_authorized_creator', sensitivity: 'personal' },
  contactCountryCode: { domain: 'contact', source: 'student_or_authorized_creator', sensitivity: 'standard' },
  preferredContactMethod: { domain: 'contact', source: 'student', sensitivity: 'standard' },

  // Family / guardians. Multiple parent accounts are supported.
  parents: { domain: 'family', source: 'admin_institution_professional', sensitivity: 'personal', repeatable: true },
  parentUid: { domain: 'family', source: 'relationship_system', sensitivity: 'personal', legacy: true },
  parentUids: { domain: 'family', source: 'relationship_system', sensitivity: 'personal', repeatable: true },
  parentName: { domain: 'family', source: 'legacy_intake', sensitivity: 'personal', legacy: true },
  parentContact: { domain: 'family', source: 'legacy_intake', sensitivity: 'personal', legacy: true },

  // Academic
  institutionId: { domain: 'academic', source: 'admin_institution_professional', sensitivity: 'relationship' },
  institutionName: { domain: 'academic', source: 'system', sensitivity: 'standard' },
  grade: { domain: 'academic', source: 'student_or_institution', sensitivity: 'standard' },
  section: { domain: 'academic', source: 'institution', sensitivity: 'standard' },
  academicYear: { domain: 'academic', source: 'institution', sensitivity: 'standard' },
  board: { domain: 'academic', source: 'student_or_institution', sensitivity: 'standard' },
  subjects: { domain: 'academic', source: 'student_or_institution', sensitivity: 'standard' },
  academicPerformance: { domain: 'academic', source: 'student_or_institution', sensitivity: 'standard' },
  academicStrengths: { domain: 'academic', source: 'student', sensitivity: 'standard' },
  academicChallenges: { domain: 'academic', source: 'student', sensitivity: 'standard' },

  // Services / relationships
  services: { domain: 'services', source: 'admin_institution_professional', sensitivity: 'relationship', repeatable: true },
  primary_path: { domain: 'services', source: 'system_or_assignment', sensitivity: 'relationship' },
  studentTrack: { domain: 'services', source: 'legacy_intake', sensitivity: 'relationship', legacy: true },
  assignedStaff: { domain: 'relationships', source: 'admin', sensitivity: 'restricted_relationship' },
  assignedProfessionalId: { domain: 'relationships', source: 'admin', sensitivity: 'restricted_relationship', legacy: true },
  assignedCounsellorId: { domain: 'relationships', source: 'admin', sensitivity: 'restricted_relationship', legacy: true },

  // Career
  career: { domain: 'career', source: 'student_system_professional', sensitivity: 'service' },
  riasecCode: { domain: 'career', source: 'assessment_system', sensitivity: 'service' },
  riasecScores: { domain: 'career', source: 'assessment_system', sensitivity: 'service' },
  careerAssessment: { domain: 'career', source: 'assessment_system', sensitivity: 'service' },
  careerGoals: { domain: 'career', source: 'student_professional', sensitivity: 'service' },
  careerRoadmap: { domain: 'career', source: 'professional_system', sensitivity: 'service' },

  // Wellbeing — professional notes must remain in a restricted service record.
  wellbeing: { domain: 'wellbeing', source: 'student_professional', sensitivity: 'restricted_service' },
  wellbeingIntake: { domain: 'wellbeing', source: 'student_professional', sensitivity: 'restricted_service' },
  wellbeingAssessments: { domain: 'wellbeing', source: 'assessment_system', sensitivity: 'restricted_service' },
  clinicalNotes: { domain: 'wellbeing', source: 'psychologist', sensitivity: 'highly_restricted' },
  wellbeingGoals: { domain: 'wellbeing', source: 'student_professional', sensitivity: 'restricted_service' },

  // SEN
  sen: { domain: 'sen', source: 'student_parent_professional_institution', sensitivity: 'restricted_service' },
  senNeeds: { domain: 'sen', source: 'professional', sensitivity: 'restricted_service' },
  iep: { domain: 'sen', source: 'sen_professional', sensitivity: 'restricted_service' },
  senGoals: { domain: 'sen', source: 'student_professional', sensitivity: 'restricted_service' },

  // Assessments
  assessments: { domain: 'assessments', source: 'assessment_system', sensitivity: 'service', repeatable: true },

  // Goals
  goals: { domain: 'goals', source: 'student_professional', sensitivity: 'service', repeatable: true },

  // Governance
  profileComplete: { domain: 'governance', source: 'system', sensitivity: 'administrative' },
  onboardingCompleted: { domain: 'governance', source: 'system', sensitivity: 'administrative' },
  consent: { domain: 'governance', source: 'student_parent_authorized_creator', sensitivity: 'highly_restricted' },
  createdBy: { domain: 'governance', source: 'system', sensitivity: 'audit' },
  createdAt: { domain: 'governance', source: 'system', sensitivity: 'audit' },
  updatedBy: { domain: 'governance', source: 'system', sensitivity: 'audit' },
  updatedAt: { domain: 'governance', source: 'system', sensitivity: 'audit' },
});

export const ROLE_VISIBILITY = Object.freeze({
  student: ['identity', 'contact', 'family', 'academic', 'services', 'career', 'wellbeing', 'sen', 'assessments', 'goals', 'relationships'],
  career_counsellor: ['identity', 'contact', 'academic', 'services', 'career', 'assessments', 'goals', 'relationships'],
  psychologist: ['identity', 'contact', 'academic', 'services', 'wellbeing', 'assessments', 'goals', 'relationships'],
  sen_educator: ['identity', 'contact', 'academic', 'family', 'services', 'sen', 'assessments', 'goals', 'relationships'],
  parent: ['identity', 'academic', 'services', 'career', 'wellbeing', 'sen', 'goals'],
  institution: ['identity', 'academic', 'services', 'relationships'],
  super_admin: ['identity', 'contact', 'family', 'academic', 'services', 'career', 'wellbeing', 'sen', 'assessments', 'goals', 'relationships', 'governance'],
});

export const PROFESSIONAL_ROLE_TO_SERVICE = Object.freeze({
  career_counsellor: 'career',
  psychologist: 'wellbeing',
  sen_educator: 'sen',
});

export function getStudentFieldPolicy(fieldName) {
  return STUDENT_FIELDS[fieldName] || null;
}

export function canViewStudentDomain(role, domain) {
  return Boolean(ROLE_VISIBILITY[role]?.includes(domain));
}

export function getServiceForProfessionalRole(role) {
  return PROFESSIONAL_ROLE_TO_SERVICE[String(role || '').trim().toLowerCase()] || null;
}
