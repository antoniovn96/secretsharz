const SERVICE_BY_DIVISION = Object.freeze({
  career: 'career',
  psych: 'wellbeing',
  sen: 'sen',
});

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

  const canonicalAssignments = {
    ...existingAssignments,
    [service]: staffId,
  };

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

  const legacyField = { career: 'careerId', psych: 'psychId', sen: 'senId' }[division];
  const legacyAssignments = {
    ...existingLegacy,
    [legacyField]: staffId,
    [division]: staffId,
  };

  return {
    assignedStaff: legacyAssignments,
    relationships: {
      ...existingRelationships,
      assignments: canonicalAssignments,
    },
    services: canonicalServices,
  };
}

export function getCanonicalAssignment(studentData = {}, division) {
  const service = SERVICE_BY_DIVISION[division];
  if (!service) return null;
  return studentData.relationships?.assignments?.[service] || null;
}

export const SERVICE_BY_DIVISION_MAP = SERVICE_BY_DIVISION;
