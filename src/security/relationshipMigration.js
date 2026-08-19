// Secret Sharz — legacy relationship reconciliation (SERVER-ONLY).
//
// This module translates relationship information already present in a student
// record into first-class `relationships/*` documents. It is intentionally
// idempotent and non-destructive: it never deletes or rewrites legacy fields.
//
// Migration sources are limited to fields already understood by the canonical
// student normalizer. Missing person IDs are reported as unresolved instead of
// creating synthetic identities from names/emails.
import crypto from 'crypto';
import { normalizeStudentRecord } from '../platform/studentRecordNormalizer.js';
import { buildRelationshipDocument, RELATIONSHIP_COLLECTION } from './relationshipStore.js';

function relationshipIdFor({ subjectPersonId, relatedPersonId, type, domain }) {
  return crypto
    .createHash('sha256')
    .update(`${subjectPersonId}|${relatedPersonId}|${type}|${domain || 'global'}`)
    .digest('hex');
}

function candidate({ studentId, relatedPersonId, type, domain, source }) {
  if (!relatedPersonId) return null;
  const document = buildRelationshipDocument({
    subjectPersonId: studentId,
    relatedPersonId,
    type,
    domain,
    status: 'active',
    consentRequired: type === 'guardian' || type === 'parent',
  });
  const relationshipId = relationshipIdFor({ studentId, subjectPersonId: studentId, relatedPersonId, type, domain });
  return {
    relationshipId,
    ...document,
    migration: { source, version: 1 },
  };
}

export function buildLegacyRelationshipCandidates(studentId, rawStudentRecord = {}) {
  if (!studentId) throw new Error('studentId is required.');
  const record = normalizeStudentRecord(rawStudentRecord, studentId);
  const candidates = [];
  const unresolved = [];

  for (const guardian of record.family.guardians || []) {
    if (!guardian.accountId) {
      unresolved.push({ type: guardian.relationship === 'parent' ? 'parent' : 'guardian', name: guardian.name || null, reason: 'missing_account_id' });
      continue;
    }
    const type = guardian.relationship === 'parent' ? 'parent' : 'guardian';
    candidates.push(candidate({
      studentId,
      relatedPersonId: guardian.accountId,
      type,
      domain: null,
      source: 'student_record_guardian',
    }));
  }

  const assignmentMap = record.relationships?.assignments || {};
  if (assignmentMap.career) {
    candidates.push(candidate({ studentId, relatedPersonId: assignmentMap.career, type: 'career_counsellor', domain: 'career', source: 'student_record_assignment' }));
  }
  if (assignmentMap.wellbeing) {
    candidates.push(candidate({ studentId, relatedPersonId: assignmentMap.wellbeing, type: 'primary_counsellor', domain: 'counselling', source: 'student_record_assignment' }));
  }
  if (assignmentMap.sen) {
    candidates.push(candidate({ studentId, relatedPersonId: assignmentMap.sen, type: 'sen_professional', domain: 'sen', source: 'student_record_assignment' }));
  }

  return { candidates: candidates.filter(Boolean), unresolved };
}

export async function reconcileStudentRelationships({ db, studentId, rawStudentRecord, dryRun = true }) {
  if (!db) throw new Error('Firestore instance is required.');
  const { candidates, unresolved } = buildLegacyRelationshipCandidates(studentId, rawStudentRecord);
  if (dryRun) return { dryRun: true, written: 0, candidates, unresolved };

  const batch = db.batch();
  for (const relationship of candidates) {
    const ref = db.collection(RELATIONSHIP_COLLECTION).doc(relationship.relationshipId);
    batch.set(ref, relationship, { merge: true });
  }
  if (candidates.length) await batch.commit();
  return { dryRun: false, written: candidates.length, candidates, unresolved };
}

export { relationshipIdFor };
