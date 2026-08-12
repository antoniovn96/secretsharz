// Secret Sharz — consent policy model
// UX/schema source of truth only. Final legal text requires review.

export const CONSENT_POLICY_VERSION = '1.0.0';

export const CONSENT_TYPES = Object.freeze({
  ACCOUNT: 'account_privacy',
  COUNSELLING: 'counselling',
  SEN: 'sen',
  CAREER: 'career_guidance',
  COMMUNITY: 'community',
  AI_FEATURE: 'ai_feature',
  PROFESSIONAL_CONTENT: 'professional_content',
  GUARDIAN: 'guardian',
});

export const CONSENT_ACTIONS = Object.freeze({
  GRANTED: 'granted',
  WITHDRAWN: 'withdrawn',
  UPDATED: 'updated',
});

export const AGE_BANDS = Object.freeze({
  CHILD: 'under_13',
  ADOLESCENT: '13_17',
  ADULT: '18_plus',
});

export const SERVICE_COPY = Object.freeze({
  [CONSENT_TYPES.ACCOUNT]: {
    title: 'Your Secret Sharz account',
    summary: 'We need to process the information required to create, secure and operate your account.',
  },
  [CONSENT_TYPES.COUNSELLING]: {
    title: 'Counselling and professional support',
    summary: 'Counselling information is kept within the counselling domain and shared only according to the authorised professional relationship, consent and safeguarding rules.',
  },
  [CONSENT_TYPES.SEN]: {
    title: 'SEN and learning support',
    summary: 'SEN information is protected as its own domain and is not automatically shared with other professional domains.',
  },
  [CONSENT_TYPES.CAREER]: {
    title: 'Career guidance',
    summary: 'Career information may include assessments, interests, education and goals used to provide career guidance and opportunities.',
  },
  [CONSENT_TYPES.COMMUNITY]: {
    title: 'Community participation',
    summary: 'Community contributions can use an anonymous or pseudonymous identity according to the options available to you.',
  },
});

export const buildConsentEvent = ({
  userId,
  type,
  action,
  actorType = 'self',
  relationshipId = null,
  serviceContext = null,
}) => ({
  userId,
  type,
  action,
  actorType,
  relationshipId,
  serviceContext,
  policyVersion: CONSENT_POLICY_VERSION,
  createdAt: 'server_timestamp_required',
});

export const isKnownConsentType = (type) => Object.values(CONSENT_TYPES).includes(type);
export const isKnownConsentAction = (action) => Object.values(CONSENT_ACTIONS).includes(action);
