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
    throw new Error('Unknown relationship domain.');
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

export async function createRelationship({ db, ...input }) {
  if (!db) throw new Error('Firestore instance is required.');
  const document = buildRelationshipDocument(input);
  const ref = db.collection(COLLECTION).doc();
  await ref.set({ ...document, relationshipId: ref.id });
  return { id: ref.id, ...document, relationshipId: ref.id };
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
