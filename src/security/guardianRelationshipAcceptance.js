// Secret Sharz — guardian relationship acceptance (SERVER-ONLY).
// Accepting an invitation is distinct from granting service consent.
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from './firebaseAdmin.js';
import { getStudentAgeBand, evaluateConsentEligibility } from './consentEligibility.js';
import { getActiveRelationship } from './relationshipStore.js';

const ALLOWED_TYPES = new Set(['parent', 'guardian']);

export async function acceptGuardianRelationship({ db = getAdminFirestore(), guardianId, relationshipId }) {
  if (!db || !guardianId || !relationshipId) throw new Error('Guardian and relationship are required.');
  const ref = db.collection('relationships').doc(relationshipId);
  let accepted = null;
  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) throw new Error('Relationship not found.');
    const relationship = snapshot.data() || {};
    if (!ALLOWED_TYPES.has(relationship.type)) throw new Error('Only parent or guardian relationships can be accepted here.');
    if (relationship.relatedPersonId !== guardianId) throw new Error('Only the invited guardian can accept this relationship.');
    if (relationship.status !== 'pending') throw new Error('Only pending relationships can be accepted.');
    if (relationship.consentRequired !== true) throw new Error('This relationship is not configured for guardian acceptance.');

    const studentSnap = await tx.get(db.collection('users').doc(relationship.subjectPersonId));
    if (!studentSnap.exists) throw new Error('Consent subject not found.');
    const ageBand = getStudentAgeBand(studentSnap.data() || {});
    if (ageBand === 'unknown') throw new Error('Student age band cannot be established.');
    const eligibility = evaluateConsentEligibility({ consentType: 'guardian', actorType: 'guardian', ageBand });
    if (!eligibility.allowed) throw new Error('Guardian acceptance is not eligible under the current service policy.');

    const now = new Date().toISOString();
    tx.update(ref, { status: 'active', startsAt: relationship.startsAt || now, acceptedAt: FieldValue.serverTimestamp(), acceptedBy: guardianId, updatedAt: now });
    accepted = { relationshipId, subjectPersonId: relationship.subjectPersonId, relatedPersonId: guardianId, type: relationship.type, status: 'active' };
  });
  return accepted;
}
