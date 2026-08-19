// Secret Sharz — legacy relationship reconciliation (SERVER-ONLY).
// Idempotent, non-destructive migration with dry-run comparison reporting.
import crypto from 'crypto';
import { normalizeStudentRecord } from '../platform/studentRecordNormalizer.js';
import { buildRelationshipDocument, RELATIONSHIP_COLLECTION } from './relationshipStore.js';

function relationshipIdFor({ subjectPersonId, relatedPersonId, type, domain }) {
  return crypto.createHash('sha256').update(`${subjectPersonId}|${relatedPersonId}|${type}|${domain || 'global'}`).digest('hex');
}

function candidate({ studentId, relatedPersonId, type, domain, source }) {
  if (!relatedPersonId) return null;
  const document = buildRelationshipDocument({ subjectPersonId: studentId, relatedPersonId, type, domain, status: 'active', consentRequired: type === 'guardian' || type === 'parent' });
  const relationshipId = relationshipIdFor({ subjectPersonId: studentId, relatedPersonId, type, domain });
  return { relationshipId, ...document, migration: { source, version: 1 } };
}

export function buildLegacyRelationshipCandidates(studentId, rawStudentRecord = {}) {
  if (!studentId) throw new Error('studentId is required.');
  const record = normalizeStudentRecord(rawStudentRecord, studentId);
  const candidates = [];
  const unresolved = [];
  for (const guardian of record.family.guardians || []) {
    if (!guardian.accountId) { unresolved.push({ type: guardian.relationship === 'parent' ? 'parent' : 'guardian', name: guardian.name || null, reason: 'missing_account_id' }); continue; }
    const type = guardian.relationship === 'parent' ? 'parent' : 'guardian';
    candidates.push(candidate({ studentId, relatedPersonId: guardian.accountId, type, domain: null, source: 'student_record_guardian' }));
  }
  const assignmentMap = record.relationships?.assignments || {};
  if (assignmentMap.career) candidates.push(candidate({ studentId, relatedPersonId: assignmentMap.career, type: 'career_counsellor', domain: 'career', source: 'student_record_assignment' }));
  if (assignmentMap.wellbeing) candidates.push(candidate({ studentId, relatedPersonId: assignmentMap.wellbeing, type: 'primary_counsellor', domain: 'counselling', source: 'student_record_assignment' }));
  if (assignmentMap.sen) candidates.push(candidate({ studentId, relatedPersonId: assignmentMap.sen, type: 'sen_professional', domain: 'sen', source: 'student_record_assignment' }));
  return { candidates: candidates.filter(Boolean), unresolved };
}

export function reconcileRelationshipReport({ candidates = [], existing = [], unresolved = [] }) {
  const candidateMap = new Map(candidates.map(item => [item.relationshipId, item]));
  const existingMap = new Map(existing.map(item => [item.relationshipId || item.id, item]));
  const matching = [], missing = [], conflicts = [];
  for (const candidateRecord of candidates) {
    const current = existingMap.get(candidateRecord.relationshipId);
    if (!current) { missing.push(candidateRecord); continue; }
    const sameCore = current.subjectPersonId === candidateRecord.subjectPersonId && current.relatedPersonId === candidateRecord.relatedPersonId && current.type === candidateRecord.type && (current.domain || null) === (candidateRecord.domain || null);
    if (sameCore && current.status === candidateRecord.status) matching.push(candidateRecord);
    else conflicts.push({ candidate: candidateRecord, existing: current });
  }
  const stale = existing.filter(item => !candidateMap.has(item.relationshipId || item.id));
  return { summary: { candidates: candidates.length, matching: matching.length, missing: missing.length, conflicts: conflicts.length, stale: stale.length, unresolved: unresolved.length }, matching, missing, conflicts, stale, unresolved };
}

export async function reconcileStudentRelationships({ db, studentId, rawStudentRecord, existingRelationships = [], dryRun = true }) {
  if (!db) throw new Error('Firestore instance is required.');
  const { candidates, unresolved } = buildLegacyRelationshipCandidates(studentId, rawStudentRecord);
  const report = reconcileRelationshipReport({ candidates, existing: existingRelationships, unresolved });
  if (dryRun) return { dryRun: true, written: 0, ...report };
  // Migration never deletes stale records and never overwrites conflicts.
  const batch = db.batch();
  for (const relationship of report.missing) {
    const ref = db.collection(RELATIONSHIP_COLLECTION).doc(relationship.relationshipId);
    batch.set(ref, relationship, { merge: true });
  }
  if (report.missing.length) await batch.commit();
  return { dryRun: false, written: report.missing.length, ...report };
}

export { relationshipIdFor };
