const SERVICE_BY_DIVISION = Object.freeze({
  career: 'career',
  psych: 'wellbeing',
  sen: 'sen',
});

const LEGACY_FIELD_BY_DIVISION = Object.freeze({
  career: 'careerId',
  psych: 'psychId',
  sen: 'senId',
});

/**
 * Resolve the currently assigned professional during the migration period.
 * Canonical relationships win; legacy assignedStaff is the compatibility
 * fallback for records that have not yet been migrated.
 */
export function getEffectiveStaffAssignment(studentData = {}, division) {
  const service = SERVICE_BY_DIVISION[division];
  if (!service) return null;

  const canonical = studentData.relationships?.assignments?.[service];
  if (canonical) return canonical;

  const legacy = studentData.assignedStaff || {};
  return legacy[LEGACY_FIELD_BY_DIVISION[division]] || legacy[division] || null;
}

/**
 * Build a migration-safe assignment update.
 * Canonical relationships are written first-class while legacy assignedStaff
 * remains populated for existing consumers during the migration period.
 */
export function buildStaffAssignmentUpdate(studentData = {}, division, staffId) {
  const service = SERVICE_BY_DIVISION[division];
  if (!service) throw new Error('Invalid professional division. Choose career, psych, or sen.');
  if (!staffId) throw new Error('A professional must be selected.');

  const existingLegacy = studentData.assignedStaff && typeof studentData.assignedStaff === 'object'
    ? studentData.assignedStaff
    : {};
  const existingRelationships = studentData.relationships && typeof studentData.relationships === 'object'
    ? studentData.relationships
    : {};
  const existingAssignments = existingRelationships.assignments && typeof existingRelationships.assignments === 'object'
    ? existingRelationships.assignments
    : {};
  const existingServices = studentData.services && typeof studentData.services === 'object'
    ? studentData.services
    : {};

  const canonicalAssignments = { ...existingAssignments, [service]: staffId };
  const canonicalServices = {
    ...existingServices,
    [service]: {
      ...(existingServices[service] && typeof existingServices[service] === 'object' ? existingServices[service] : {}),
      status: 'active',
      active: true,
      assignedProfessionalId: staffId,
      updatedAt: new Date(),
    },
  };

  const legacyAssignments = {
    ...existingLegacy,
    [LEGACY_FIELD_BY_DIVISION[division]]: staffId,
    [division]: staffId,
  };

  return {
    assignedStaff: legacyAssignments,
    relationships: { ...existingRelationships, assignments: canonicalAssignments },
    services: canonicalServices,
  };
}

export function getCanonicalAssignment(studentData = {}, division) {
  const service = SERVICE_BY_DIVISION[division];
  if (!service) return null;
  return studentData.relationships?.assignments?.[service] || null;
}

export const SERVICE_BY_DIVISION_MAP = SERVICE_BY_DIVISION;
