/**
 * Parent projection contract.
 * This is a data-shape contract only. It must be populated by an
 * authorization-aware server/API layer; never use this module to grant access.
 */

export const PARENT_SHARING_VERSION = '1.0.0';

export function normalizeParentStudentProjection(raw = {}) {
  return {
    contractVersion: PARENT_SHARING_VERSION,
    student: {
      authUid: raw.student?.authUid || '',
      ssStudentId: raw.student?.ssStudentId || '',
      name: raw.student?.name || '',
      grade: raw.student?.grade || '',
      section: raw.student?.section || '',
    },
    sharing: {
      career: raw.sharing?.career === true,
      wellbeing: raw.sharing?.wellbeing === true,
      sen: raw.sharing?.sen === true,
      journal: raw.sharing?.journal === true,
    },
    career: raw.sharing?.career ? raw.career || null : null,
    wellbeing: raw.sharing?.wellbeing ? raw.wellbeing || null : null,
    sen: raw.sharing?.sen ? raw.sen || null : null,
  };
}
