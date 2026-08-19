import { canAssignProfessional, assignmentConfig, validateAssignmentCounts } from './serviceAssignmentPolicy.js';
import { canEndAssignment, canPromoteBackup, ASSIGNMENT_STATUS } from './serviceAssignmentLifecycle.js';

const TYPE_BY_SERVICE = Object.freeze({
  wellbeing: 'primary_counsellor',
  career_guidance: 'career_counsellor',
  career: 'career_counsellor',
  sen: 'sen_professional',
});

const DOMAIN_BY_SERVICE = Object.freeze({ wellbeing: 'counselling', career_guidance: 'career', career: 'career', sen: 'sen' });

function serviceKey(service) { return String(service || '').toLowerCase(); }
function assignmentType(service) { const type = TYPE_BY_SERVICE[serviceKey(service)]; if (!type) throw new Error('Unsupported service assignment.'); return type; }
function assignmentDomain(service) { const domain = DOMAIN_BY_SERVICE[serviceKey(service)]; if (!domain) throw new Error('Unsupported service assignment.'); return domain; }

function normalize(doc) {
  const data = doc.data ? doc.data() : doc;
  return { ...(doc.id ? { relationshipId: doc.id } : {}), ...data, metadata: data.metadata || {} };
}

async function activeAssignments(tx, db, { studentId, service }) {
  const query = db.collection('relationships')
    .where('subjectPersonId', '==', studentId)
    .where('type', '==', assignmentType(service))
    .where('status', '==', ASSIGNMENT_STATUS.ACTIVE)
    .limit(50);
  const snap = await tx.get(query);
  return snap.docs.map(normalize).filter((item) => item.domain == null || item.domain === assignmentDomain(service));
}

function assertActor({ actorAuthorized, institutionAuthorized }) {
  if (!actorAuthorized) throw new Error('Actor is not authorized to manage this assignment.');
  if (!institutionAuthorized) throw new Error('Institution context is not authorized.');
}

export async function assignProfessional({ db, studentId, professionalId, service, role, institutionId, targetInstitutionId, professionalInstitutionActive, studentInstitutionActive, actorAuthorized, institutionAuthorized, slot = 'primary', metadata = {} }) {
  assertActor({ actorAuthorized, institutionAuthorized });
  const allowed = canAssignProfessional({ service, role, institutionId, targetInstitutionId, professionalInstitutionActive, studentInstitutionActive });
  if (!allowed) throw new Error('Professional cannot be assigned to this service/student context.');
  const key = serviceKey(service);
  const config = assignmentConfig(key);
  if (slot !== 'primary' && !(key === 'wellbeing' && slot === 'backup')) throw new Error('Invalid assignment slot.');

  let result;
  await db.runTransaction(async (tx) => {
    const active = await activeAssignments(tx, db, { studentId, service: key });
    const primaryCount = active.filter((a) => a.metadata.slot === 'primary' || (!a.metadata.slot && key !== 'wellbeing')).length;
    const backupCount = active.filter((a) => a.metadata.slot === 'backup').length;
    const nextPrimary = primaryCount + (slot === 'primary' ? 1 : 0);
    const nextBackup = backupCount + (slot === 'backup' ? 1 : 0);
    const counts = validateAssignmentCounts({ service: key, primaryCount: nextPrimary, backupCount: nextBackup });
    if (!counts.valid) throw new Error(counts.reason);
    if (active.some((a) => a.relatedPersonId === professionalId && a.metadata.slot === slot)) throw new Error('Professional is already assigned in this slot.');

    const ref = db.collection('relationships').doc();
    const now = new Date().toISOString();
    const document = {
      relationshipId: ref.id,
      subjectPersonId: studentId,
      relatedPersonId: professionalId,
      type: assignmentType(key),
      domain: assignmentDomain(key),
      status: ASSIGNMENT_STATUS.ACTIVE,
      startsAt: now,
      endsAt: null,
      consentRequired: true,
      metadata: { ...metadata, service: key, slot, institutionId, role },
      createdAt: now,
      updatedAt: now,
    };
    tx.create(ref, document);
    result = document;
  });
  return result;
}

export async function endProfessionalAssignment({ db, studentId, relationshipId, service, actorAuthorized, institutionAuthorized }) {
  assertActor({ actorAuthorized, institutionAuthorized });
  let ended;
  await db.runTransaction(async (tx) => {
    const ref = db.collection('relationships').doc(relationshipId);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('Assignment not found.');
    const assignment = normalize(snap);
    if (assignment.subjectPersonId !== studentId || assignment.type !== assignmentType(service) || assignment.status !== ASSIGNMENT_STATUS.ACTIVE) throw new Error('Active assignment not found.');
    if (!canEndAssignment({ assignment, actorAuthorized })) throw new Error('Assignment cannot be ended.');
    const now = new Date().toISOString();
    tx.update(ref, { status: ASSIGNMENT_STATUS.ENDED, endsAt: now, updatedAt: now });
    ended = { ...assignment, status: ASSIGNMENT_STATUS.ENDED, endsAt: now };
  });
  return ended;
}

export async function promoteWellbeingBackup({ db, studentId, backupRelationshipId, actorAuthorized, institutionAuthorized }) {
  assertActor({ actorAuthorized, institutionAuthorized });
  let result;
  await db.runTransaction(async (tx) => {
    const active = await activeAssignments(tx, db, { studentId, service: 'wellbeing' });
    const backup = active.find((a) => a.relationshipId === backupRelationshipId && a.metadata.slot === 'backup');
    const primary = active.find((a) => a.metadata.slot === 'primary');
    if (!canPromoteBackup({ service: 'wellbeing', primaryAssignment: primary, backupAssignment: backup, actorAuthorized })) throw new Error('Backup cannot be promoted.');
    const now = new Date().toISOString();
    if (primary) tx.update(db.collection('relationships').doc(primary.relationshipId), { status: ASSIGNMENT_STATUS.ENDED, endsAt: now, updatedAt: now });
    tx.update(db.collection('relationships').doc(backup.relationshipId), { 'metadata.slot': 'primary', updatedAt: now });
    result = { endedPrimaryId: primary?.relationshipId || null, promotedRelationshipId: backup.relationshipId, promotedAt: now };
  });
  return result;
}

export { assignmentType, assignmentDomain };
