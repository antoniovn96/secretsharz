/**
 * Server-side helpers for participant-owned information that is intentionally
 * projected to another authorised audience. This is a projection layer, not
 * a second source of truth.
 */

export const SHARED_INFORMATION_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED',
});

export const SHARED_INFORMATION_AUDIENCES = Object.freeze({
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  INSTITUTION: 'INSTITUTION',
});

export function careerRoadmapShareId(studentId) {
  return `careerRoadmap_${String(studentId || '').trim()}`;
}

export function buildCareerRoadmapShare({ studentId, roadmapId, providerId, phases, institutionId = null, now }) {
  const cleanPhases = Object.fromEntries(
    ['phase1_unlock', 'phase2_explore', 'phase3_expand', 'phase4_inspire', 'phase5_ignite']
      .map((key) => [key, String(phases?.[key] || '').trim().slice(0, 5000)])
  );

  return {
    studentId,
    serviceId: 'CAREER_GUIDANCE',
    shareType: 'CAREER_ROADMAP_SUMMARY',
    sourceRecordId: roadmapId,
    createdBy: providerId,
    audiences: [SHARED_INFORMATION_AUDIENCES.STUDENT, SHARED_INFORMATION_AUDIENCES.PARENT],
    institutionId: institutionId || null,
    status: SHARED_INFORMATION_STATUS.ACTIVE,
    scope: 'CAREER_ROADMAP_SUMMARY',
    data: {
      phases: cleanPhases,
      summary: cleanPhases.phase2_explore || cleanPhases.phase1_unlock || '',
    },
    createdAt: now,
    updatedAt: now,
    revokedAt: null,
  };
}
