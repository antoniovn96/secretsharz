import { resolveStudentIdentity } from './studentIdentityResolver.js';

/** Resolve the actual students/{documentId} reference without confusing Auth UID or SS Student ID with the document ID. */
export async function resolveStudentDocumentRef({ db, authUid = null, ssStudentId = null }) {
  const identity = await resolveStudentIdentity({ db, authUid, ssStudentId });
  if (!identity.documentId) throw new Error('Canonical student document is unavailable.');
  return {
    ...identity,
    collection: 'students',
    path: `students/${identity.documentId}`,
    ref: db.collection('students').doc(identity.documentId),
  };
}
