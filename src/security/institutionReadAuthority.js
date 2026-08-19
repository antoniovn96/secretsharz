import { getActiveRelationship } from './relationshipStore.js';

export async function assertInstitutionReadAccess({ db, actorUid, actorRole, institutionId, studentId }) {
  if (actorRole === 'super_admin') return true;
  if (!actorUid || !institutionId || !studentId) throw new Error('Institution read context is incomplete.');
  const staff = await getActiveRelationship({ db, subjectPersonId: actorUid, relatedPersonId: institutionId, type: 'institution_staff', domain: 'institution' }) || await getActiveRelationship({ db, subjectPersonId: actorUid, relatedPersonId: institutionId, type: 'institution_member', domain: 'institution' });
  if (!staff) throw new Error('Active staff institution membership required.');
  const student = await getActiveRelationship({ db, subjectPersonId: studentId, relatedPersonId: institutionId, type: 'institution_member', domain: 'institution' });
  if (!student) throw new Error('Active student institution membership required.');
  return true;
}
