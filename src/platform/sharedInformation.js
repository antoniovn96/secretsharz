/**
 * Server-side helpers for participant-owned information intentionally
 * projected to another authorised audience. This is a projection layer,
 * not a second source of truth.
 */

export const SHARED_INFORMATION_STATUS = Object.freeze({ ACTIVE: 'ACTIVE', REVOKED: 'REVOKED' });
export const SHARED_INFORMATION_AUDIENCES = Object.freeze({ STUDENT: 'STUDENT', PARENT: 'PARENT', INSTITUTION: 'INSTITUTION' });

export function careerRoadmapShareId(studentId) { return `careerRoadmap_${String(studentId || '').trim()}`; }

export function buildCareerRoadmapShare({ studentId, roadmapId, providerId, phases, institutionId = null, now, audiences = [SHARED_INFORMATION_AUDIENCES.STUDENT] }) {
  const cleanPhases = Object.fromEntries(
    ['phase1_unlock', 'phase2_explore', 'phase3_expand', 'phase4_inspire', 'phase5_ignite']
      .map((key) => [key, String(phases?.[key] || '').trim().slice(0, 5000)])
  );
  const allowed = new Set(Object.values(SHARED_INFORMATION_AUDIENCES));
  const cleanAudiences = [...new Set((Array.isArray(audiences) ? audiences : []).filter((audience) => allowed.has(audience)))];
  if (!cleanAudiences.includes(SHARED_INFORMATION_AUDIENCES.STUDENT)) cleanAudiences.unshift(SHARED_INFORMATION_AUDIENCES.STUDENT);
  return {
    studentId, serviceId: 'CAREER_GUIDANCE', shareType: 'CAREER_ROADMAP_SUMMARY', sourceRecordId: roadmapId,
    createdBy: providerId, audiences: cleanAudiences, institutionId: institutionId || null,
    status: SHARED_INFORMATION_STATUS.ACTIVE, scope: 'CAREER_ROADMAP_SUMMARY',
    data: { phases: cleanPhases, summary: cleanPhases.phase2_explore || cleanPhases.phase1_unlock || '' },
    createdAt: now, updatedAt: now, revokedAt: null,
  };
}
