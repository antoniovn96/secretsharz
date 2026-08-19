import { resolveCanonicalProfessionalAssignment } from './canonicalProfessionalAssignment.js';
import { resolveStudentDocumentRef } from './studentDocumentRef.js';
import { requireServiceConsent, CONSENT_TYPES } from './consentResolver.js';
import { assertAccess } from './accessDecisionService.js';

const COLLECTION = 'counsellingSessions';
const LEGACY_SUBCOLLECTION = 'counsellingSessions';
const NOTE_FIELDS = ['subjective', 'objective', 'assessment', 'plan'];

function cleanSoap(input = {}) { const soap = {}; for (const field of NOTE_FIELDS) if (typeof input[field] === 'string') soap[field] = input[field].trim(); return soap; }
function assertNonEmptySoap(soap) { if (!NOTE_FIELDS.some((field) => soap[field])) throw new Error('Cannot save an empty clinical note.'); }

async function authorize({ db, studentId, professionalId, institutionId = null }) {
  const identity = await resolveStudentDocumentRef({ db, authUid: studentId, ssStudentId: studentId });
  const assignment = await resolveCanonicalProfessionalAssignment({ db, studentId: identity.authUid || identity.ssStudentId, professionalId, service: 'psychology', institutionId });
  if (!assignment.found) throw new Error('Counselling relationship not authorised.');
  await requireServiceConsent({ db, userId: identity.authUid || identity.ssStudentId, serviceType: CONSENT_TYPES.COUNSELLING });
  assertAccess({ actor: { uid: professionalId, role: 'counsellor' }, studentId: identity.authUid, institutionId: assignment.assignment?.institutionId || institutionId || null, service: 'wellbeing', domain: 'counselling', relationship: { ...assignment.assignment, metadata: { institutionId: assignment.assignment?.institutionId || institutionId, service: 'psychology', slot: assignment.assignment?.slot || 'primary' } }, consent: { required: true, status: 'active' }, safeguarding: { restricted: false } });
  return { identity, assignment: assignment.assignment };
}

function canonicalSession(data, id) { return { id, studentAuthUid:data.studentAuthUid, ssStudentId:data.ssStudentId||null, providerId:data.providerId, institutionId:data.institutionId||null, assignmentSlot:data.assignmentSlot||null, relationshipId:data.relationshipId||null, domain:'counselling', format:'SOAP', soap:data.soap||{}, createdAt:data.createdAt||null, updatedAt:data.updatedAt||null, source:'canonical' }; }
function legacySession(data, id) { return { id:`legacy:${id}`, legacyId:id, studentAuthUid:data.studentAuthUid||null, ssStudentId:data.ssStudentId||null, providerId:data.providerId||null, institutionId:data.institutionId||null, domain:data.domain||'counselling', format:data.format||'SOAP', soap:data.soap||{}, createdAt:data.createdAt||null, updatedAt:data.updatedAt||null, source:'legacy' }; }

export async function getCounsellingSessions({ db, studentId, professionalId, institutionId = null }) {
  const authorization = await authorize({ db, studentId, professionalId, institutionId });
  const canonicalSnap = await db.collection(COLLECTION).where('studentAuthUid','==',authorization.identity.authUid).orderBy('createdAt','desc').limit(100).get();
  const legacySnap = await authorization.identity.ref.collection(LEGACY_SUBCOLLECTION).orderBy('createdAt','desc').limit(100).get();
  const canonical = canonicalSnap.docs.map(d=>canonicalSession(d.data(),d.id));
  const legacy = legacySnap.docs.map(d=>legacySession(d.data(),d.id));
  return { student:{studentId:authorization.identity.ssStudentId,ssStudentId:authorization.identity.ssStudentId,authUid:authorization.identity.authUid}, assignment:authorization.assignment, sessions:[...canonical,...legacy].sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))) };
}

export async function createCounsellingSession({ db, studentId, professionalId, institutionId = null, soap }) {
  const authorization = await authorize({ db, studentId, professionalId, institutionId });
  const clean = cleanSoap(soap); assertNonEmptySoap(clean);
  const identity = authorization.identity; const assignment = authorization.assignment; const now = new Date().toISOString(); const ref = db.collection(COLLECTION).doc();
  const record = { studentAuthUid:identity.authUid, ssStudentId:identity.ssStudentId, providerId:professionalId, institutionId:assignment.institutionId || institutionId || null, assignmentSlot:assignment.slot || 'primary', relationshipId:assignment.id, domain:'counselling', format:'SOAP', soap:clean, createdAt:now, updatedAt:now };
  await db.runTransaction(async (tx)=>{ tx.create(ref,record); });
  return { id:ref.id, studentId:identity.ssStudentId, ssStudentId:identity.ssStudentId, authUid:identity.authUid, assignmentSlot:record.assignmentSlot, createdAt:now };
}
