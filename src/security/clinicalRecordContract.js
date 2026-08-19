/** Canonical counselling clinical-record contract. */
export const CLINICAL_RECORD_VERSION = '1.0.0';
export const CLINICAL_PURPOSE = 'clinical_care';

export function buildClinicalRecord({
  student,
  providerId,
  relationshipId,
  soap,
  now = new Date(),
}) {
  if (!student?.authUid) throw new Error('Clinical record requires student authUid');
  if (!student?.ssStudentId) throw new Error('Clinical record requires SS Student ID');
  if (!providerId) throw new Error('Clinical record requires providerId');
  if (!relationshipId) throw new Error('Clinical record requires relationshipId');

  return {
    contractVersion: CLINICAL_RECORD_VERSION,
    authUid: student.authUid,
    ssStudentId: student.ssStudentId,
    providerId,
    relationshipId,
    service: 'counselling',
    purpose: CLINICAL_PURPOSE,
    format: 'SOAP',
    soap,
    createdAt: now,
    updatedAt: now,
  };
}
