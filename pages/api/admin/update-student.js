import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { mergeCanonicalStudentProfile } from '../../../src/platform/studentProfileWriteAdapter.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function isSuperAdmin(decoded = {}) {
  return decoded.role === 'super_admin' || (decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com');
}

function stringValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildEditablePatch(input = {}, currentProfile = {}) {
  const allowedKeys = new Set(['identity', 'contact', 'academic', 'institution']);
  const unexpectedKeys = Object.keys(input).filter(key => !allowedKeys.has(key));
  if (unexpectedKeys.length) throw new Error(`Unsupported profile fields: ${unexpectedKeys.join(', ')}`);

  if (input.contact && Object.prototype.hasOwnProperty.call(input.contact, 'email')) {
    throw new Error('Email changes require the account identity workflow and cannot be changed from this profile editor.');
  }

  const patch = {
    identity: {},
    contact: { mobile: {} },
    academic: { current: {} },
    institution: {},
  };

  if (input.identity && typeof input.identity === 'object') {
    if (Object.prototype.hasOwnProperty.call(input.identity, 'fullName')) patch.identity.fullName = stringValue(input.identity.fullName);
    if (Object.prototype.hasOwnProperty.call(input.identity, 'preferredName')) patch.identity.preferredName = stringValue(input.identity.preferredName);
  }

  if (input.contact?.mobile && typeof input.contact.mobile === 'object' && Object.prototype.hasOwnProperty.call(input.contact.mobile, 'number')) {
    patch.contact.mobile.number = stringValue(input.contact.mobile.number);
  }

  if (input.academic?.current && typeof input.academic.current === 'object') {
    const current = input.academic.current;
    if (Object.prototype.hasOwnProperty.call(current, 'grade')) patch.academic.current.grade = stringValue(current.grade);
    if (Object.prototype.hasOwnProperty.call(current, 'section')) patch.academic.current.section = stringValue(current.section);
    if (Object.prototype.hasOwnProperty.call(current, 'stream')) patch.academic.current.stream = stringValue(current.stream);
    if (Object.prototype.hasOwnProperty.call(current, 'institutionId')) {
      throw new Error('Institution membership cannot be changed from the student profile editor.');
    }
  }

  const currentInstitutionId = currentProfile.institution?.id || currentProfile.academic?.current?.institutionId || '';
  if (input.institution && typeof input.institution === 'object' && Object.prototype.hasOwnProperty.call(input.institution, 'name')) {
    const name = stringValue(input.institution.name);
    if (currentInstitutionId && name && name !== String(currentProfile.institution?.name || currentProfile.academic?.current?.institutionName || '').trim()) {
      throw new Error('This student has an authoritative institution relationship. Change the institution through Institution Membership management.');
    }
    if (!currentInstitutionId) patch.institution.name = name;
  }

  return patch;
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
  if (!isSuperAdmin(decoded)) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentId = String(req.body?.studentId || '').trim();
  const input = req.body?.profile;
  if (!studentId || !input || typeof input !== 'object' || Array.isArray(input)) return res.status(400).json({ error: 'studentId and profile are required.' });

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });

    const raw = { id: snapshot.id, ...snapshot.data() };
    if (!isStudentProfile(raw)) return res.status(400).json({ error: 'The target record is not a student profile.' });

    const existing = raw.studentProfile || normalizeStudentRecord(raw, studentId);
    let editablePatch;
    try {
      editablePatch = buildEditablePatch(input, existing);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const nextProfile = mergeCanonicalStudentProfile({ ...existing, id: studentId }, editablePatch);
    const now = new Date().toISOString();
    const auditRef = db.collection('auditEvents').doc();
    const batch = db.batch();

    batch.set(ref, { studentProfile: nextProfile, updatedAt: now }, { merge: true });
    batch.set(auditRef, {
      eventType: 'student_profile_updated',
      actorId: decoded.uid,
      actorRole: 'super_admin',
      resourceType: 'student',
      resourceId: studentId,
      purpose: 'administration',
      outcome: 'success',
      changedDomains: Object.keys(editablePatch).filter(key => Object.keys(editablePatch[key] || {}).length > 0),
      timestamp: now,
    });
    await batch.commit();

    return res.status(200).json({ ok: true, studentId, studentProfile: nextProfile });
  } catch (error) {
    console.error('[admin update-student] failed:', error);
    return res.status(500).json({ error: 'Unable to update the student profile.' });
  }
}
