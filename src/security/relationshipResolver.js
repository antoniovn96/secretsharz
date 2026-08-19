// Secret Sharz — canonical relationship resolver (SERVER-ONLY).
// Canonical relationships are authoritative; legacy data is fallback-only.
import { getActiveRelationship, RELATIONSHIP_COLLECTION } from './relationshipStore.js';
import { buildLegacyRelationshipCandidates } from './relationshipMigration.js';

export const RESOLUTION_SOURCES = Object.freeze({ CANONICAL: 'canonical', LEGACY: 'legacy', NONE: 'none' });
const candidateTypeForDomain = Object.freeze({ career: ['career_counsellor'], counselling: ['primary_counsellor'], sen: ['sen_professional'] });

export async function resolveRelationship({ db, subjectPersonId, relatedPersonId, domain, type }) {
  if (!db || !subjectPersonId || !relatedPersonId) return { allowed: false, source: RESOLUTION_SOURCES.NONE, relationship: null };
  if (type) {
    const canonical = await getActiveRelationship({ db, subjectPersonId, relatedPersonId, type, domain });
    if (canonical) return { allowed: true, source: RESOLUTION_SOURCES.CANONICAL, relationship: canonical };
    const snapshot = await db.collection(RELATIONSHIP_COLLECTION).where('subjectPersonId', '==', subjectPersonId).where('relatedPersonId', '==', relatedPersonId).where('type', '==', type).limit(20).get();
    if (!snapshot.empty) return { allowed: false, source: RESOLUTION_SOURCES.CANONICAL, relationship: null, blockedByCanonicalStatus: true };
  }

  // Legacy student records exist in both `students/*` and `users/*` during migration.
  // The source is read-only fallback; canonical relationships remain authoritative.
  let studentSnap = await db.collection('students').doc(subjectPersonId).get();
  if (!studentSnap.exists) studentSnap = await db.collection('users').doc(subjectPersonId).get();
  if (!studentSnap.exists) return { allowed: false, source: RESOLUTION_SOURCES.NONE, relationship: null };
  const { candidates } = buildLegacyRelationshipCandidates(subjectPersonId, studentSnap.data() || {});
  const legacy = candidates.find(item => item.relatedPersonId === relatedPersonId && (!type || item.type === type) && (!domain || item.domain === domain));
  if (legacy) return { allowed: true, source: RESOLUTION_SOURCES.LEGACY, relationship: legacy, migrationFallback: true };
  return { allowed: false, source: RESOLUTION_SOURCES.NONE, relationship: null };
}

export async function resolveDomainRelationship({ db, subjectPersonId, relatedPersonId, domain }) {
  const types = candidateTypeForDomain[domain] || [];
  for (const type of types) {
    const result = await resolveRelationship({ db, subjectPersonId, relatedPersonId, domain, type });
    if (result.allowed || result.blockedByCanonicalStatus) return result;
  }
  return { allowed: false, source: RESOLUTION_SOURCES.NONE, relationship: null };
}
