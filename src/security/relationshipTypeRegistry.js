/**
 * Single registry for relationship semantics used by authorization code.
 * Legacy aliases are retained only for migration; callers should use canonical keys.
 */

export const RELATIONSHIP_TYPES = Object.freeze({
  GUARDIAN: 'guardian',
  PARENT: 'parent',
  INSTITUTION_STUDENT: 'institution_member',
  INSTITUTION_STAFF: 'institution_staff',
  WELLBEING_PRIMARY: 'primary_counsellor',
  CAREER_PRIMARY: 'career_counsellor',
  SEN_PROFESSIONAL: 'sen_professional',
});

const DEFINITIONS = Object.freeze({
  guardian: { domain: 'family', grantsAuthorization: true, service: null, slots: ['primary', 'secondary'] },
  parent: { domain: 'family', grantsAuthorization: true, service: null, slots: ['primary', 'secondary'] },
  institution_member: { domain: 'institution', grantsAuthorization: true, service: null, slots: [] },
  institution_staff: { domain: 'institution', grantsAuthorization: true, service: null, slots: [] },
  primary_counsellor: { domain: 'counselling', grantsAuthorization: true, service: 'wellbeing', slots: ['primary', 'backup'] },
  career_counsellor: { domain: 'career', grantsAuthorization: true, service: 'career_guidance', slots: ['primary'] },
  sen_professional: { domain: 'sen', grantsAuthorization: true, service: 'sen', slots: ['primary', 'team'] },
});

export function getRelationshipDefinition(type) {
  return DEFINITIONS[String(type || '').toLowerCase()] || null;
}

export function isKnownRelationshipType(type) {
  return Boolean(getRelationshipDefinition(type));
}

export function relationshipGrantsAuthorization(type) {
  return Boolean(getRelationshipDefinition(type)?.grantsAuthorization);
}

export function assertRelationshipType(type, { domain, service, slot } = {}) {
  const definition = getRelationshipDefinition(type);
  if (!definition) throw new Error(`Unknown relationship type: ${type}`);
  if (domain && definition.domain !== domain) throw new Error('Relationship domain mismatch.');
  if (service && definition.service !== service) throw new Error('Relationship service mismatch.');
  if (slot && definition.slots.length && !definition.slots.includes(slot)) throw new Error('Relationship slot is not permitted.');
  return definition;
}
