/**
 * Canonical student onboarding schema.
 *
 * UI components should render from this schema rather than inventing student
 * fields independently. The canonical profile separates current academics from
 * academic history and personal discovery data from assessment results.
 */

export const STUDENT_ONBOARDING_STEPS = [
  { id: 'identity', title: 'About You', description: 'Tell us the basics about you.' },
  { id: 'contact', title: 'Contact', description: 'How Secret Sharz can contact you.' },
  { id: 'academic', title: 'School & Studies', description: 'Your current academic context.' },
  { id: 'family', title: 'Parent & Guardian', description: 'People responsible for or supporting you.' },
  { id: 'journey', title: 'Your Journey', description: 'Choose the Secret Sharz services you want to use.' },
  { id: 'service', title: 'Your Goals', description: 'A short service-specific starting point.' },
  { id: 'consent', title: 'Privacy & Consent', description: 'Review how your information is used.' },
];

const EDUCATION_TIER_FIELDS = [
  { key: 'schoolName', label: 'School / institution', type: 'text', required: false },
  { key: 'marksType', label: 'Marks type', type: 'select', required: false },
  { key: 'marksValue', label: 'Marks / percentage / CGPA', type: 'text', required: false },
  { key: 'marksMax', label: 'Maximum marks', type: 'text', required: false },
  { key: 'marksObtained', label: 'Marks obtained', type: 'text', required: false },
  { key: 'subjects', label: 'Subjects', type: 'multi_select', required: false },
];

export const STUDENT_ONBOARDING_FIELDS = {
  identity: [
    { key: 'identity.fullName', label: 'Full name', type: 'text', source: 'student', required: true },
    { key: 'identity.preferredName', label: 'What should we call you?', type: 'text', source: 'student', required: false },
    { key: 'identity.dateOfBirth', label: 'Date of birth', type: 'date', source: 'student', required: true },
    { key: 'identity.gender', label: 'Gender', type: 'select', source: 'student', required: false },
    { key: 'identity.pronouns', label: 'Pronouns', type: 'text', source: 'student', required: false },
    { key: 'identity.photoURL', label: 'Profile photo', type: 'image', source: 'student', required: false },
  ],
  contact: [
    { key: 'contact.email', label: 'Email address', type: 'email', source: 'system', required: true, readonly: true },
    { key: 'contact.mobile.countryCode', label: 'Country', type: 'country', source: 'student', required: true },
    { key: 'contact.mobile.number', label: 'Mobile number', type: 'phone', source: 'student', required: true },
    { key: 'contact.city', label: 'City', type: 'text', source: 'student', required: false },
  ],
  academic: [
    { key: 'academic.current.institutionId', label: 'Institution', type: 'institution', source: 'institution_or_student', required: true },
    { key: 'academic.current.academicYear', label: 'Academic year', type: 'text', source: 'institution_or_student', required: true },
    { key: 'academic.current.grade', label: 'Grade / class / year', type: 'text', source: 'institution_or_student', required: true },
    { key: 'academic.current.section', label: 'Section', type: 'text', source: 'institution_or_student', required: false },
    { key: 'academic.current.curriculum', label: 'Board / curriculum', type: 'text', source: 'institution_or_student', required: false },
    { key: 'academic.current.stream', label: 'Stream', type: 'text', source: 'student_or_institution', required: false },
    { key: 'academic.current.subjects', label: 'Subjects', type: 'multi_select', source: 'student_or_institution', required: false },
    { key: 'academic.history.tenth', label: 'Class 10 academic record', type: 'education_tier', source: 'student', required: false, fields: EDUCATION_TIER_FIELDS },
    { key: 'academic.history.twelfth', label: 'Class 12 / PUC academic record', type: 'education_tier', source: 'student', required: false, fields: EDUCATION_TIER_FIELDS },
    { key: 'academic.history.graduate', label: 'Graduate academic record', type: 'education_tier', source: 'student', required: false, fields: EDUCATION_TIER_FIELDS },
    { key: 'academic.history.postGraduate', label: 'Postgraduate academic record', type: 'education_tier', source: 'student', required: false, fields: EDUCATION_TIER_FIELDS },
  ],
  personal: [
    { key: 'personal.interests', label: 'Interests', type: 'multi_select', source: 'student', required: false },
    { key: 'personal.hobbies', label: 'Hobbies', type: 'multi_select', source: 'student', required: false },
    { key: 'personal.preferences.tvShows', label: 'TV shows', type: 'multi_select', source: 'student', required: false },
    { key: 'personal.preferences.movies', label: 'Movies', type: 'multi_select', source: 'student', required: false },
    { key: 'personal.preferences.games', label: 'Games', type: 'multi_select', source: 'student', required: false },
    { key: 'personal.preferences.sports', label: 'Sports', type: 'multi_select', source: 'student', required: false },
  ],
  family: [
    { key: 'family.guardians[].relationship', label: 'Relationship', type: 'select', source: 'student_or_parent', required: true },
    { key: 'family.guardians[].name', label: 'Parent / guardian name', type: 'text', source: 'student_or_parent', required: true },
    { key: 'family.guardians[].email', label: 'Parent / guardian email', type: 'email', source: 'student_or_parent', required: true },
    { key: 'family.guardians[].phone', label: 'Parent / guardian phone', type: 'phone', source: 'student_or_parent', required: true },
    { key: 'family.guardians[].legalGuardian', label: 'Legal guardian', type: 'boolean', source: 'student_or_parent', required: false },
  ],
  journey: [
    { key: 'services.career.status', label: 'Career Guidance', type: 'service_toggle', source: 'student_or_referrer', required: false },
    { key: 'services.wellbeing.status', label: 'Wellbeing / Counselling', type: 'service_toggle', source: 'student_or_referrer', required: false },
    { key: 'services.sen.status', label: 'SEN Support', type: 'service_toggle', source: 'student_or_referrer', required: false },
  ],
  service: {
    career: [
      { key: 'career.interests', label: 'What subjects, activities or areas interest you?', type: 'textarea', source: 'student', required: false },
      { key: 'career.aspirations', label: 'What careers or future paths are you considering?', type: 'textarea', source: 'student', required: false },
      { key: 'career.goals', label: 'What would you like help with?', type: 'textarea', source: 'student', required: false },
    ],
    wellbeing: [
      { key: 'wellbeing.presentingConcern', label: 'What would you like support with?', type: 'textarea', source: 'student', required: false, sensitive: true },
      { key: 'wellbeing.goals', label: 'What would you like to be different?', type: 'textarea', source: 'student', required: false, sensitive: true },
    ],
    sen: [
      { key: 'sen.learningPreferences', label: 'How do you learn best?', type: 'textarea', source: 'student', required: false, sensitive: true },
      { key: 'sen.supportNeeds', label: 'Is there anything you would like extra support with?', type: 'textarea', source: 'student', required: false, sensitive: true },
    ],
  },
  consent: [
    { key: 'governance.privacyAcknowledged', label: 'I understand how my information will be used.', type: 'consent', source: 'student_or_parent', required: true },
    { key: 'governance.serviceConsent.career', label: 'Career Guidance consent', type: 'consent', source: 'student_or_parent', required: false },
    { key: 'governance.serviceConsent.wellbeing', label: 'Wellbeing / Counselling consent', type: 'consent', source: 'student_or_parent', required: false, sensitive: true },
    { key: 'governance.serviceConsent.sen', label: 'SEN Support consent', type: 'consent', source: 'student_or_parent', required: false, sensitive: true },
  ],
};

export const STUDENT_ONBOARDING_SOURCE_RULES = {
  institutionProvisioned: {
    prefill: ['academic.current.institutionId', 'academic.current.academicYear', 'academic.current.grade', 'academic.current.section', 'academic.current.curriculum'],
    studentCompletes: ['identity', 'contact', 'academic.history', 'personal', 'family', 'journey', 'service', 'consent'],
  },
  directStudent: {
    studentCompletes: ['identity', 'contact', 'academic', 'personal', 'family', 'journey', 'service', 'consent'],
  },
};

export const STUDENT_ONBOARDING_SERVICE_RULES = {
  career: { domain: 'career', professionalRole: 'career_counsellor' },
  wellbeing: { domain: 'wellbeing', professionalRole: 'psychologist' },
  sen: { domain: 'sen', professionalRole: 'sen_educator' },
};

export function getVisibleOnboardingSteps({ provisionedByInstitution = false } = {}) {
  return STUDENT_ONBOARDING_STEPS.map(step => ({
    ...step,
    prefilled: provisionedByInstitution && step.id === 'academic',
  }));
}

export function getServiceFields(service) {
  return STUDENT_ONBOARDING_FIELDS.service?.[service] || [];
}