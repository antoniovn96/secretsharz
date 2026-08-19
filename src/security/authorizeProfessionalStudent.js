import { getAdminAuth, getAdminFirestore } from './firebaseAdmin.js';
import { resolveStudentIdentity } from './studentIdentityResolver.js';
import { resolveCanonicalProfessionalAssignment, PROFESSIONAL_ASSIGNMENT_RULES } from './canonicalProfessionalAssignment.js';

export async function authorizeProfessionalStudent({ req, studentId, service, institutionId = null }) {
  if (!studentId) return { authorized:false, reason:'missing_student_id' };
  if (!PROFESSIONAL_ASSIGNMENT_RULES[service]) return { authorized:false, reason:'invalid_service' };
  const authHeader=req?.headers?.authorization||req?.headers?.Authorization||'';
  if(!authHeader.startsWith('Bearer ')) return { authorized:false, reason:'missing_auth' };
  let decoded;
  try { decoded=await getAdminAuth().verifyIdToken(authHeader.slice(7)); } catch { return { authorized:false, reason:'invalid_auth' }; }
  const db=getAdminFirestore();
  const viewerSnap=await db.collection('users').doc(decoded.uid).get();
  const viewer=viewerSnap.exists?viewerSnap.data():{};
  const roles=Array.isArray(viewer.roles)?viewer.roles:(viewer.role?[viewer.role]:[]);
  const isAdmin=roles.some(role=>['admin','super_admin','superadmin'].includes(String(role).toLowerCase()));
  const identity=await resolveStudentIdentity({db,authUid:studentId,ssStudentId:studentId}).catch(()=>null);
  if(!identity) return {authorized:false,reason:'student_not_found'};
  const canonicalStudent=await db.collection('students').doc(identity.documentId).get();
  const legacyStudent=await db.collection('users').doc(identity.documentId).get();
  const student=canonicalStudent.exists?canonicalStudent.data():(legacyStudent.exists?legacyStudent.data():{});
  if(isAdmin) return {authorized:true,viewerId:decoded.uid,studentId:identity.ssStudentId||studentId,authUid:identity.authUid,student,isAdmin:true,assignment:null};
  const assignment=await resolveCanonicalProfessionalAssignment({db,studentId:identity.authUid||identity.ssStudentId,professionalId:decoded.uid,service,institutionId});
  if(!assignment.found) return {authorized:false,reason:assignment.reason||'not_assigned'};
  return {authorized:true,viewerId:decoded.uid,studentId:identity.ssStudentId||studentId,authUid:identity.authUid,student,isAdmin:false,assignment:assignment.assignment};
}
