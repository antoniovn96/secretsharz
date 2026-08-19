import { resolveRelationship, RESOLUTION_SOURCES } from './relationshipResolver.js';
import { requireServiceConsent, CONSENT_TYPES } from './consentResolver.js';
import { assertAccess } from './accessDecisionService.js';

const COLLECTION = 'counsellingSessions';
const LEGACY_SUBCOLLECTION = 'counsellingSessions';
const NOTE_FIELDS = ['subjective', 'objective', 'assessment', 'plan'];

function cleanSoap(input = {}) {
  const soap = {};
  for (const field of NOTE_FIELDS) if (typeof input[field] === 'string') soap[field] = input[field].trim();
  return soap;
}
function assertNonEmptySoap(soap) {
  if (!NOTE_FIELDS.some((field) => soap[field])) throw new Error('Cannot save an empty clinical note.');
}

async function authorize({ db, studentId, professionalId }) {
  const relationship = await resolveRelationship({ db, subjectPersonId: studentId, relatedPersonId: professionalId, domain: 'counselling', type: 'primary_counsellor' });
  if (!relationship.allowed) throw new Error('Counselling relationship not authorised.');
  await requireServiceConsent({ db, userId: studentId, serviceType: CONSENT_TYPES.COUNSELLING });
  assertAccess({
    actor: { uid: professionalId, role: 'counsellor' },
    studentId,
    institutionId: relationship.relationship?.metadata?.institutionId || null,
    service: 'wellbeing',
    domain: 'counselling',
    relationship: relationship.relationship,
    consent: { required: true, status: 'active' },
    safeguarding: { restricted: false },
  });
  return relationship;
}

function canonicalSession(data, id) { return { id, studentAuthUid:data.studentAuthUid, providerId:data.providerId, institutionId:data.institutionId||null, domain:'counselling', format:'SOAP', soap:data.soap||{}, createdAt:data.createdAt||null, updatedAt:data.updatedAt||null, source:'canonical' }; }
function legacySession(data, id) { return { id:`legacy:${id}`, legacyId:id, studentAuthUid:data.studentAuthUid||null, providerId:data.providerId||null, institutionId:data.institutionId||null, domain:data.domain||'counselling', format:data.format||'SOAP', soap:data.soap||{}, createdAt:data.createdAt||null, updatedAt:data.updatedAt||null, source:'legacy' }; }

export async function getCounsellingSessions({ db, studentId, professionalId }) {
  await authorize({ db, studentId, professionalId });
  const canonicalSnap = await db.collection(COLLECTION).where('studentAuthUid','==',studentId).orderBy('createdAt','desc').limit(100).get();
  const legacySnap = await db.collection('students').doc(studentId).collection(LEGACY_SUBCOLLECTION).orderBy('createdAt','desc').limit(100).get();
  const canonical = canonicalSnap.docs.map(d=>canonicalSession(d.data(),d.id));
  const legacy = legacySnap.docs.map(d=>legacySession(d.data(),d.id));
  return { sessions:[...canonical,...legacy].sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))) };
}

export async function createCounsellingSession({ db, studentId, professionalId, soap }) {
  const relationship = await authorize({ db, studentId, professionalId });
  if (relationship.source !== RESOLUTION_SOURCES.CANONICAL) throw new Error('A canonical counselling relationship is required to create new clinical records.');
  const clean = cleanSoap(soap); assertNonEmptySoap(clean);
  const institutionId = relationship.relationship?.metadata?.institutionId || null;
  const now = new Date().toISOString();
  const ref = db.collection(COLLECTION).doc();
  const record = { studentAuthUid:studentId, providerId:professionalId, institutionId, domain:'counselling', format:'SOAP', soap:clean, createdAt:now, updatedAt:now };
  await db.runTransaction(async (tx)=>{ tx.create(ref,record); });
  return { id:ref.id, createdAt:now };
}
