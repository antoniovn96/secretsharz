/** Transaction-safe lifecycle rules for student-specific service assignments. */

export const ASSIGNMENT_STATUS = Object.freeze({ ACTIVE: 'active', ENDED: 'ended', SUSPENDED: 'suspended' });

export function canEndAssignment({ assignment, actorAuthorized }) {
  return Boolean(actorAuthorized && assignment && assignment.status === ASSIGNMENT_STATUS.ACTIVE);
}

export function canPromoteBackup({ service, primaryAssignment, backupAssignment, actorAuthorized }) {
  if (!actorAuthorized || !backupAssignment || backupAssignment.status !== ASSIGNMENT_STATUS.ACTIVE) return false;
  if (service !== 'wellbeing') return false;
  if (primaryAssignment?.status === ASSIGNMENT_STATUS.ACTIVE && primaryAssignment.relationshipId === backupAssignment.relationshipId) return false;
  return true;
}

export function nextAssignmentState({ service, currentAssignments = [], action }) {
  const active = currentAssignments.filter((a) => a.status === ASSIGNMENT_STATUS.ACTIVE);
  if (action.type === 'end') {
    return currentAssignments.map((a) => a.relationshipId === action.relationshipId ? { ...a, status: ASSIGNMENT_STATUS.ENDED, endsAt: action.at } : a);
  }
  if (action.type === 'promote_backup') {
    return currentAssignments.map((a) => {
      if (a.relationshipId === action.backupRelationshipId) return { ...a, slot: 'primary' };
      if (service === 'wellbeing' && a.slot === 'primary' && a.status === ASSIGNMENT_STATUS.ACTIVE) return { ...a, slot: 'ended' };
      return a;
    });
  }
  return active;
}
