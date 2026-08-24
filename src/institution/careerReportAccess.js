// Client-side decision helper. The server remains the source of truth and must re-authorize every request.
export function getCareerReportActionState(student = {}, institution = {}) {
  if (!student?.id) return { allowed:false, reason:'Student record is missing.' };
  if (!student.claimedBy) return { allowed:false, reason:'Student has not claimed the assessment code.' };
  if (student.assessmentStatus !== 'completed' && student.reportStatus !== 'ready') return { allowed:false, reason:'Career assessment is not completed.' };
  if (institution?.paymentStatus !== 'paid') return { allowed:false, reason:'Institutional entitlement is not active.' };
  return { allowed:true, reason:'' };
}
