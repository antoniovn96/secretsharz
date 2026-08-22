// Secret Sharz — server-side life-stage reconciliation.
// Reconciles authorization state without deleting relationship history.
import { FieldValue } from 'firebase-admin/firestore';
import { getStudentAgeBand } from './consentEligibility.js';

export async function reconcileStudentLifeStage({ db, studentId }) {
  if (!db || !studentId) return { changed: false, reason: 'missing_context' };
  const userRef = db.collection('users').doc(studentId);
  let result = { changed: false, reason: 'unchanged' };
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) { result = { changed: false, reason: 'student_not_found' }; return; }
    const data = snap.data() || {};
    const nextBand = getStudentAgeBand(data);
    if (nextBand === 'unknown') { result = { changed: false, reason: 'age_band_unknown' }; return; }
    const previousBand = data.lifecycle?.ageBand || data.ageBand || null;
    if (previousBand === nextBand) { result = { changed: false, reason: 'unchanged', ageBand: nextBand }; return; }
    const now = new Date().toISOString();
    tx.set(userRef, { lifecycle: { ...(data.lifecycle || {}), ageBand: nextBand, reconciledAt: now, previousAgeBand: previousBand }, ageBand: nextBand, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    if (nextBand === '18_plus' && previousBand !== '18_plus') {
      const relSnap = await tx.get(db.collection('relationships').where('subjectPersonId', '==', studentId).where('status', '==', 'active').limit(100));
      for (const doc of relSnap.docs) {
        const rel = doc.data() || {};
        if (rel.authorizationBasis === 'minor_guardian_acceptance') {
          tx.update(doc.ref, { status: 'ended', endsAt: now, endReason: 'student_reached_adulthood', updatedAt: now });
        }
      }
    }
    const auditRef = db.collection('auditEvents').doc();
    tx.set(auditRef, { action: 'LIFE_STAGE_RECONCILED', subjectPersonId: studentId, previousAgeBand: previousBand, ageBand: nextBand, occurredAt: now, source: 'server_lifecycle_reconciler' });
    result = { changed: true, previousAgeBand: previousBand, ageBand: nextBand, auditEventId: auditRef.id };
  });
  return result;
}
