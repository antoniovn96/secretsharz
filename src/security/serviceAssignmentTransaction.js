/**
 * Firestore transaction helpers for service assignment lifecycle.
 * Callers must supply an authenticated transaction-capable Firestore client.
 */
import { assignmentConfig, validateAssignmentCounts } from './serviceAssignmentPolicy.js';
import { ASSIGNMENT_STATUS } from './serviceAssignmentLifecycle.js';

export function buildAssignmentMutation({ service, assignments, action, now = new Date().toISOString() }) {
  const config = assignmentConfig(service);
  if (!config) throw new Error('Unsupported service.');
  const current = assignments.map((a) => ({ ...a }));

  if (action.type === 'end') {
    const target = current.find((a) => a.relationshipId === action.relationshipId && a.status === ASSIGNMENT_STATUS.ACTIVE);
    if (!target) throw new Error('Active assignment not found.');
    target.status = ASSIGNMENT_STATUS.ENDED;
    target.endsAt = now;
    return current;
  }

  if (action.type === 'promote_backup') {
    if (service !== 'wellbeing') throw new Error('Backup promotion is only supported for wellbeing.');
    const backup = current.find((a) => a.relationshipId === action.backupRelationshipId && a.status === ASSIGNMENT_STATUS.ACTIVE && a.slot === 'backup');
    if (!backup) throw new Error('Active wellbeing backup assignment not found.');
    const primary = current.find((a) => a.status === ASSIGNMENT_STATUS.ACTIVE && a.slot === 'primary');
    if (primary) {
      primary.status = ASSIGNMENT_STATUS.ENDED;
      primary.endsAt = now;
    }
    backup.slot = 'primary';
    return current;
  }

  if (action.type === 'assign') {
    const next = { ...action.assignment, status: ASSIGNMENT_STATUS.ACTIVE, createdAt: action.assignment.createdAt || now };
    const prospective = [...current, next];
    const primaryCount = prospective.filter((a) => a.status === ASSIGNMENT_STATUS.ACTIVE && a.slot === 'primary').length;
    const backupCount = prospective.filter((a) => a.status === ASSIGNMENT_STATUS.ACTIVE && a.slot === 'backup').length;
    const result = validateAssignmentCounts({ service, primaryCount, backupCount });
    if (!result.valid) throw new Error(result.reason);
    return prospective;
  }

  throw new Error('Unsupported assignment action.');
}

export async function runAssignmentTransaction({ db, assignmentRefs, mutate }) {
  if (!db?.runTransaction) throw new Error('Transaction-capable Firestore instance required.');
  return db.runTransaction(async (transaction) => {
    const snapshots = [];
    for (const ref of assignmentRefs) snapshots.push(await transaction.get(ref));
    const current = snapshots.filter((s) => s.exists).map((s) => s.data());
    const next = mutate(current);
    for (const item of next) {
      const ref = assignmentRefs.find((candidate) => candidate.id === item.relationshipId);
      if (!ref) continue;
      transaction.set(ref, item, { merge: true });
    }
    return next;
  });
}
