/**
 * Canonical service/purpose/audience release authority.
 * A release is a projection permission, not a replacement for the underlying
 * guardian/professional/institution relationship authorization.
 */

export const RELEASE_STATUS = Object.freeze({ ACTIVE: 'ACTIVE', REVOKED: 'REVOKED' });
export const RELEASE_AUDIENCES = Object.freeze({ PARENT: 'PARENT', INSTITUTION: 'INSTITUTION' });
export const RELEASE_SERVICES = Object.freeze({
  CAREER: 'career_guidance',
  SEN: 'sen',
  WELLBEING: 'wellbeing',
});

export function normalizeRelease(raw = {}) {
  return {
    releaseId: String(raw.releaseId || raw.id || '').trim(),
    studentAuthUid: String(raw.studentAuthUid || raw.authUid || '').trim(),
    ssStudentId: String(raw.ssStudentId || raw.studentId || '').trim(),
    service: String(raw.service || '').trim().toLowerCase(),
    purpose: String(raw.purpose || '').trim().toLowerCase(),
    audience: String(raw.audience || '').trim().toUpperCase(),
    scope: String(raw.scope || '').trim(),
    institutionId: String(raw.institutionId || '').trim() || null,
    releasedBy: String(raw.releasedBy || raw.createdBy || '').trim(),
    status: String(raw.status || RELEASE_STATUS.ACTIVE).toUpperCase(),
    createdAt: raw.createdAt || null,
    revokedAt: raw.revokedAt || null,
  };
}

export function isActiveRelease(release, now = new Date()) {
  const normalized = normalizeRelease(release);
  if (normalized.status !== RELEASE_STATUS.ACTIVE) return false;
  if (normalized.revokedAt && new Date(normalized.revokedAt).getTime() <= now.getTime()) return false;
  return true;
}

export function releaseMatches({ release, studentAuthUid, ssStudentId, service, purpose, audience, institutionId = null }) {
  const normalized = normalizeRelease(release);
  if (!isActiveRelease(normalized)) return false;
  if (studentAuthUid && normalized.studentAuthUid !== String(studentAuthUid)) return false;
  if (ssStudentId && normalized.ssStudentId !== String(ssStudentId)) return false;
  if (service && normalized.service !== String(service).toLowerCase()) return false;
  if (purpose && normalized.purpose !== String(purpose).toLowerCase()) return false;
  if (audience && normalized.audience !== String(audience).toUpperCase()) return false;
  if (institutionId && normalized.institutionId !== String(institutionId)) return false;
  return true;
}

export function assertReleaseScope({ service, purpose, audience }) {
  if (!service || !purpose || !audience) throw new Error('Release requires service, purpose and audience');
  if (![RELEASE_SERVICES.CAREER, RELEASE_SERVICES.SEN, RELEASE_SERVICES.WELLBEING].includes(service)) throw new Error('Unsupported release service');
  if (![RELEASE_AUDIENCES.PARENT, RELEASE_AUDIENCES.INSTITUTION].includes(audience)) throw new Error('Unsupported release audience');
}
