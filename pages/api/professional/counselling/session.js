import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { resolveDomainRelationship } from '../../../../src/security/relationshipResolver.js';
import { resolveServiceConsent, CONSENT_TYPES } from '../../../../src/security/consentResolver.js';
import { buildClinicalRecord } from '../../../../src/security/clinicalRecordContract.js';
import { normalizeCanonicalStudent, assertCanonicalStudentIdentity } from '../../../../src/platform/canonicalStudentContract.js';

const NOTE_FIELDS = ['subjective', 'objective', 'assessment', 'plan'];
const CANONICAL_COLLECTION = 'counsellingClinicalRecords';

function cleanSoap(input = {}) {
  const soap = {};
  for (const field of NOTE_FIELDS) {
    if (typeof input[field] === 'string') soap[field] = input[field].trim();
  }
  return soap;
}

async function resolveStudent(db, studentId) {
  let snapshot = await db.collection('students').doc(studentId).get();
  if (!snapshot.exists) snapshot = await db.collection('users').doc(studentId).get();
  if (!snapshot.exists) return null;
  const student = normalizeCanonicalStudent(snapshot.data() || {}, studentId);
  assertCanonicalStudentIdentity(student);
  return student;
}

function serializeSession(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || null,
  };
}

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const db = getAdminFirestore();
    const studentId = String(req.query.studentId || req.body?.studentId || '');
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const requesterId = decoded.uid;
    const relationship = await resolveDomainRelationship({
      db,
      subjectPersonId: studentId,
      relatedPersonId: requesterId,
      domain: 'counselling',
    });

    if (decoded.role !== 'super_admin' && !relationship.allowed) {
      return res.status(403).json({ error: 'Counselling relationship not authorised' });
    }

    // Clinical records require both service consent and the clinical-care purpose.
    // The purpose is recorded on every new canonical record. A super-admin does not
    // manufacture student consent.
    const consent = await resolveServiceConsent({
      db,
      userId: studentId,
      serviceType: CONSENT_TYPES.COUNSELLING,
    });
    if (!consent.allowed) {
      return res.status(403).json({
        error: 'Required counselling consent is not active',
        code: 'CONSENT_REQUIRED',
      });
    }

    const student = await resolveStudent(db, studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const canonicalCollection = db.collection(CANONICAL_COLLECTION);

    if (req.method === 'GET') {
      const snapshot = await canonicalCollection
        .where('authUid', '==', student.authUid)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      return res.status(200).json({
        source: 'canonical',
        sessions: snapshot.docs.map(serializeSession),
      });
    }

    if (req.method === 'POST') {
      const soap = cleanSoap(req.body?.soap);
      if (!NOTE_FIELDS.some(field => soap[field])) {
        return res.status(400).json({ error: 'Cannot save an empty clinical note' });
      }

      // A canonical relationship is mandatory for a clinical record. During the
      // migration window, legacy-fallback authorization is deliberately insufficient
      // for creating new clinical records.
      if (relationship.source !== 'canonical' || !relationship.relationship?.id) {
        return res.status(403).json({
          error: 'A canonical active counselling relationship is required for new clinical records',
          code: 'CANONICAL_RELATIONSHIP_REQUIRED',
        });
      }

      const now = new Date();
      const record = buildClinicalRecord({
        student,
        providerId: requesterId,
        relationshipId: relationship.relationship.id,
        soap,
        now,
      });

      const ref = canonicalCollection.doc();
      await ref.set({
        ...record,
        recordId: ref.id,
        migrationSource: 'canonical-v1',
      });

      return res.status(201).json({
        id: ref.id,
        recordId: ref.id,
        createdAt: now.toISOString(),
        source: 'canonical',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Counselling session API error:', error);
    return res.status(500).json({ error: 'Unable to process counselling session request' });
  }
}
