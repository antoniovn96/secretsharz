import { assignmentConfig, validateAssignmentCounts, canAssignProfessional } from './serviceAssignmentPolicy.js';
import { ASSIGNMENT_STATUS } from './serviceAssignmentLifecycle.js';

const REL_TYPE = { wellbeing: 'primary_counsellor', career_guidance: 'career_counsellor', sen: 'sen_professional' };
const DOMAIN = { wellbeing: 'counselling', career_guidance: 'career', sen: 'sen' };

export async function assignProfessionalTransaction({ db, actor, studentId, professionalId, service, slot, institutionId, role }) {
  const config = assignmentConfig(service);
  if (!config) throw new Error('Unsupported service.');
  if (actor.role !== 'super_admin' && actor.uid !== professionalId) throw new Error('Actor is not authorized for this assignment.');
  const professionalRef = db.collection('relationships').where('subjectPersonId','==',professionalId).where('type','==','institution_member').where('status','==','active').limit(50);
  const studentRef = db.collection('relationships').where('subjectPersonId','==',studentId).where('type','==','institution_member').where('status','==','active').limit(50);
  const [professionalSnap, studentSnap] = await Promise.all([professionalRef.get(), studentRef.get()]);
  const professionalMembership = professionalSnap.docs.find(d => d.data().metadata?.institutionId === institutionId);
  const studentMembership = studentSnap.docs.find(d => d.data().metadata?.institutionId === institutionId);
  if (!professionalMembership || !studentMembership) throw new Error('Active institution memberships are required.');
  if (actor.role !== 'super_admin' && !canAssignProfessional({ service, role, institutionId, targetInstitutionId: institutionId, professionalInstitutionActive: true, studentInstitutionActive: true })) throw new Error('Professional role is not authorized for this service.');

  const relationshipQuery = db.collection('relationships').where('subjectPersonId','==',studentId).where('type','==',REL_TYPE[service]).where('status','==','active').limit(100);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(relationshipQuery);
    const active = snap.docs.map(d => ({ id:d.id, ...d.data(), slot:d.data().metadata?.slot || (service === 'sen' ? 'team' : 'primary') }));
    const primaryCount = active.filter(a => a.slot === 'primary').length + (slot === 'primary' ? 1 : 0);
    const backupCount = active.filter(a => a.slot === 'backup').length + (slot === 'backup' ? 1 : 0);
    const countCheck = validateAssignmentCounts({ service, primaryCount, backupCount });
    if (!countCheck.valid) throw new Error(countCheck.reason);
    if (active.some(a => a.relatedPersonId === professionalId)) throw new Error('Professional is already actively assigned to this service.');
    const ref = db.collection('relationships').doc();
    const now = new Date().toISOString();
    tx.create(ref, { subjectPersonId: studentId, relatedPersonId: professionalId, type: REL_TYPE[service], domain: DOMAIN[service], status: ASSIGNMENT_STATUS.ACTIVE, startsAt: now, endsAt: null, consentRequired: false, metadata: { service, slot, institutionId, role }, createdAt: now, updatedAt: now });
    return { id: ref.id, studentId, professionalId, service, slot, institutionId, status: ASSIGNMENT_STATUS.ACTIVE };
  });
}

export async function endAssignmentTransaction({ db, actor, relationshipId }) {
  const ref = db.collection('relationships').doc(relationshipId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('Assignment not found.');
    const data = snap.data();
    if (data.status !== ASSIGNMENT_STATUS.ACTIVE) throw new Error('Assignment is not active.');
    if (actor.role !== 'super_admin' && actor.uid !== data.relatedPersonId) throw new Error('Actor is not authorized to end this assignment.');
    const now = new Date().toISOString();
    tx.update(ref, { status: ASSIGNMENT_STATUS.ENDED, endsAt: now, updatedAt: now });
    return { id: relationshipId, status: ASSIGNMENT_STATUS.ENDED, endsAt: now };
  });
}

export async function promoteWellbeingBackupTransaction({ db, actor, relationshipId }) {
  const backupRef = db.collection('relationships').doc(relationshipId);
  return db.runTransaction(async (tx) => {
    const backupSnap = await tx.get(backupRef);
    if (!backupSnap.exists) throw new Error('Backup assignment not found.');
    const backup = backupSnap.data();
    if (backup.status !== ASSIGNMENT_STATUS.ACTIVE || backup.domain !== DOMAIN.wellbeing || backup.metadata?.service !== 'wellbeing' || backup.metadata?.slot !== 'backup') throw new Error('Active wellbeing backup assignment required.');
    if (actor.role !== 'super_admin' && actor.uid !== backup.relatedPersonId) throw new Error('Actor is not authorized to promote this backup.');
    const query = db.collection('relationships').where('subjectPersonId','==',backup.subjectPersonId).where('type','==',REL_TYPE.wellbeing).where('status','==','active').limit(20);
    const snap = await tx.get(query);
    const primary = snap.docs.find(d => d.data().metadata?.slot === 'primary');
    const now = new Date().toISOString();
    if (primary) tx.update(primary.ref, { status: ASSIGNMENT_STATUS.ENDED, endsAt: now, updatedAt: now });
    tx.update(backupRef, { 'metadata.slot': 'primary', updatedAt: now });
    return { promotedRelationshipId: relationshipId, endedPrimaryRelationshipId: primary?.id || null };
  });
}
