// Secret Sharz — First-class relationship storage (SERVER-ONLY).
//
// Relationships are an authorization primitive, not profile decoration.
// This module deliberately keeps relationship state outside `users/*` so
// downstream services can evaluate relationship + domain + status without
// trusting denormalized profile fields.
import { createRelationshipRecord, isKnownValue, RELATIONSHIP_TYPES, SERVICE_DOMAINS, RELATIONSHIP_STATUSES } from '../platform/canonicalModel.js';

const COLLECTION = 'relationships';

function normalizeTimestamp(value) {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' || typeof value === 'number') return value;
  return null;
}

export function buildRelationshipDocument(input) {
  const record = createRelationshipRecord(input);
  return {
    ...record,
    startsAt: normalizeTimestamp(record.startsAt),
    endsAt: normalizeTimestamp(record.endsAt),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function validateRelationshipPatch(patch = {}) {
  if (patch.type !== undefined && !isKnownValue(patch.type, RELATIONSHIP_TYPES)) {
    throw new Error('Unknown relationship type.');
  }
  if (patch.domain !== undefined && patch.domain !== null && !isKnownValue(patch.domain, SERVICE_DOMAINS)) {
    throw new Error('Unknown service domain.');
  }
  if (patch.status !== undefined && !isKnownValue(patch.status, RELATIONSHIP_STATUSES)) {
    throw new Error('Unknown relationship status.');
  }
  if (patch.subjectPersonId !== undefined && !patch.subjectPersonId) {
    throw new Error('subjectPersonId cannot be empty.');
  }
  if (patch.relatedPersonId !== undefined && !patch.relatedPersonId) {
    throw new Error('relatedPersonId cannot be empty.');
  }
  if (patch.subjectPersonId && patch.relatedPersonId && patch.subjectPersonId === patch.relatedPersonId) {
    throw new Error('A relationship cannot target the same person.');
  }
  return true;
}

async function findActiveRelationships({ db, subjectPersonId, type, domain = null }) {
  if (!db) throw new Error('Firestore instance is required.');
  if (!subjectPersonId || !type) return [];
  const snapshot = await db.collection(COLLECTION)
    .where('subjectPersonId', '==', subjectPersonId)
    .where('type', '==', type)
    .where('status', '==', 'active')
    .limit(50)
    .get();

  return snapshot.docs
    .map(doc => ({ ref: doc.ref, id: doc.id, ...doc.data() }))
    .filter(item => domain == null || item.domain == null || item.domain === domain);
}

export async function createRelationship({ db, ...input }) {
  if (!db) throw new Error('Firestore instance is required.');
  const document = buildRelationshipDocument(input);
  const ref = db.collection(COLLECTION).doc();
  await ref.set({ ...document, relationshipId: ref.id });
  return { id: ref.id, ...document, relationshipId: ref.id };
}

/**
 * Atomically replace the active relationship for a student/domain/type.
 * The previous relationship is retained as history with status=ended.
 * This function intentionally does not mutate user/student profile fields;
 * callers should update any denormalized compatibility projection in the
 * same transaction when required by the application.
 */
export async function reassignRelationship({ db, subjectPersonId, relatedPersonId, type, domain = null, consentRequired = true, startsAt = new Date().toISOString(), metadata = {} }) {
  if (!db) throw new Error('Firestore instance is required.');
  validateRelationshipPatch({ subjectPersonId, relatedPersonId, type, domain });
  if (domain !== null && !isKnownValue(domain, SERVICE_DOMAINS)) throw new Error('Unknown service domain.');

  const now = new Date().toISOString();
  const transaction = db.runTransaction ? db.runTransaction.bind(db) : null;
  if (!transaction) throw new Error('Firestore transactions are required for relationship reassignment.');

  let result = null;
  await transaction(async (tx) => {
    const active = await findActiveRelationships({ db, subjectPersonId, type, domain });
    const conflicting = active.filter(item => item.relatedPersonId !== relatedPersonId);

    for (const relationship of conflicting) {
      tx.update(relationship.ref, {
        status: 'ended',
        endsAt: now,
        updatedAt: now,
      });
    }

    const existingTarget = active.find(item => item.relatedPersonId === relatedPersonId);
    if (existingTarget) {
      result = { id: existingTarget.id, ...existingTarget, status: 'active', reassigned: conflicting.length > 0 };
      return;
    }

    const document = buildRelationshipDocument({
      subjectPersonId,
      relatedPersonId,
      type,
      domain,
      status: 'active',
      startsAt,
      endsAt: null,
      consentRequired,
    });
    const ref = db.collection(COLLECTION).doc();
    tx.set(ref, { ...document, relationshipId: ref.id, metadata });
    result = { id: ref.id, ...document, relationshipId: ref.id, metadata, reassigned: conflicting.length > 0 };
  });

  return result;
}

export async function endRelationships({ db, subjectPersonId, type, domain = null, endsAt = new Date().toISOString() }) {
  if (!db) throw new Error('Firestore instance is required.');
  validateRelationshipPatch({ subjectPersonId, type, domain });
  const active = await findActiveRelationships({ db, subjectPersonId, type, domain });
  if (!active.length) return 0;
  await db.runTransaction(async (tx) => {
    for (const relationship of active) {
      tx.update(relationship.ref, { status: 'ended', endsAt, updatedAt: endsAt });
    }
  });
  return active.length;
}

export async function getActiveRelationship({ db, subjectPersonId, relatedPersonId, type, domain = null }) {
  if (!db) throw new Error('Firestore instance is required.');
  if (!subjectPersonId || !relatedPersonId || !type) return null;
  const snapshot = await db.collection(COLLECTION)
    .where('subjectPersonId', '==', subjectPersonId)
    .where('relatedPersonId', '==', relatedPersonId)
    .where('type', '==', type)
    .where('status', '==', 'active')
    .limit(20)
    .get();

  const matches = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(item => domain == null || item.domain == null || item.domain === domain);

  return matches[0] || null;
}

export async function hasActiveRelationship({ db, subjectPersonId, relatedPersonId, types = [], domain = null }) {
  const allowedTypes = Array.isArray(types) ? types : [types];
  for (const type of allowedTypes.filter(Boolean)) {
    const relationship = await getActiveRelationship({
      db,
      subjectPersonId,
      relatedPersonId,
      type,
      domain,
    });
    if (relationship) return true;
  }
  return false;
}

export const RELATIONSHIP_COLLECTION = COLLECTION;
