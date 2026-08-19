// Secret Sharz — consent reconciliation/reporting (SERVER-ONLY).
// Read-only by design: this module never fabricates or mutates consent history.
import { getConsentState } from './consentService.js';
import { getAgeBand } from './consentEligibility.js';

export async function reconcileCounsellingConsent({ db, studentIds = [] }) {
  const report = [];
  for (const studentId of studentIds) {
    const snap = await db.collection('users').doc(studentId).get();
    if (!snap.exists) { report.push({ studentId, status: 'student_not_found' }); continue; }
    const data = snap.data() || {};
    const ageBand = getAgeBand(data.dateOfBirth || data.dob || data.birthDate);
    const consent = await getConsentState({ db, userId: studentId, type: 'counselling' });
    let status = 'requires_consent';
    if (consent.state === 'active') status = 'verified_active';
    else if (consent.state === 'withdrawn') status = 'withdrawn';
    else if (consent.state === 'unknown') status = 'unknown';
    report.push({ studentId, ageBand, status, consentEventId: consent.event?.id || null, consentAction: consent.event?.action || null });
  }
  return { generatedAt: new Date().toISOString(), total: report.length, report };
}
