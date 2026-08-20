// Canonical human-facing student identity helpers.
// Firebase UID remains the internal account/document key; ssStudentId is the
// stable Secret Sharz identifier shown to users and staff.

const STUDENT_ID_PREFIX = 'SS-STD-';
const STUDENT_ID_PATTERN = /^SS-STD-\d{6,}$/;

function normaliseExistingId(value) {
  const id = String(value || '').trim();
  return STUDENT_ID_PATTERN.test(id) ? id : '';
}

export function getExistingStudentId(data = {}) {
  return normaliseExistingId(
    data?.studentProfile?.identity?.ssStudentId ||
    data?.studentProfile?.ssStudentId ||
    data?.identity?.ssStudentId ||
    data?.ssStudentId ||
    data?.studentId
  );
}

export function formatStudentId(sequence) {
  const numeric = Number(sequence);
  if (!Number.isInteger(numeric) || numeric < 1) return '';
  return `${STUDENT_ID_PREFIX}${String(numeric).padStart(6, '0')}`;
}

export function parseStudentIdSequence(value) {
  const id = normaliseExistingId(value);
  if (!id) return 0;
  const sequence = Number(id.slice(STUDENT_ID_PREFIX.length));
  return Number.isInteger(sequence) ? sequence : 0;
}

export default { getExistingStudentId, formatStudentId, parseStudentIdSequence };
