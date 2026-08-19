import { normaliseStudentRecord } from './studentRecordNormalizer.js';

const CANONICAL_SCHEMA_VERSION = 2;

function clone(value) { if (value === undefined) return undefined; return JSON.parse(JSON.stringify(value)); }
function hasValue(value) { if (value === null || value === undefined) return false; if (typeof value === 'string') return value.trim() !== ''; if (Array.isArray(value)) return value.length > 0; if (typeof value === 'object') return Object.keys(value).length > 0; return true; }
function uniqueBy(items, keyFn) { const seen = new Set(); return items.filter(item => { const key = keyFn(item); if (!key || seen.has(key)) return false; seen.add(key); return true; }); }
function mergeDefined(existing, incoming) {
  if (Array.isArray(existing) || Array.isArray(incoming)) return uniqueBy([...(Array.isArray(existing) ? existing : []), ...(Array.isArray(incoming) ? incoming : [])], item => { if (typeof item !== 'object') return String(item); return item.id || item.accountId || item.assessmentId || item.goalId || JSON.stringify(item); });
  if (existing && typeof existing === 'object' && incoming && typeof incoming === 'object') {
    const result = { ...existing };
    Object.entries(incoming).forEach(([key, value]) => { if (!hasValue(result[key])) result[key] = clone(value); else if (typeof result[key] === 'object' && typeof value === 'object' && !Array.isArray(result[key]) && !Array.isArray(value)) result[key] = mergeDefined(result[key], value); });
    return result;
  }
  return hasValue(existing) ? existing : clone(incoming);
}

export function buildMigratedStudentRecord(rawStudent = {}) {
  const canonical = normaliseStudentRecord(rawStudent);
  const existingCanonical = rawStudent.studentProfile || {};
  const studentProfile = mergeDefined(existingCanonical, canonical);
  studentProfile.schemaVersion = CANONICAL_SCHEMA_VERSION;
  studentProfile.migration = { ...(studentProfile.migration || {}), source: 'legacy-student-record-normalizer', migratedAt: studentProfile.migration?.migratedAt || new Date().toISOString(), idempotencyKey: studentProfile.migration?.idempotencyKey || `student:${rawStudent.id || rawStudent.uid || rawStudent.studentId || 'unknown'}:v${CANONICAL_SCHEMA_VERSION}` };
  return studentProfile;
}

export function getStudentMigrationPatch(rawStudent = {}) { return { studentProfile: buildMigratedStudentRecord(rawStudent) }; }
export function migrationChanged(rawStudent = {}) { return JSON.stringify(rawStudent.studentProfile || {}) !== JSON.stringify(buildMigratedStudentRecord(rawStudent)); }
export default buildMigratedStudentRecord;
