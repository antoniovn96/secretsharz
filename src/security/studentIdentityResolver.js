/** Canonical student identity resolver: Auth UID is internal, SS Student ID is external. */
export function normalizeStudentIdentity(raw = {}) {
  const authUid = String(raw.authUid || raw.uid || '').trim();
  const ssStudentId = String(raw.ssStudentId || raw.studentId || '').trim();
  if (!authUid && !ssStudentId) throw new Error('Student identity is required.');
  return { authUid: authUid || null, ssStudentId: ssStudentId || null };
}

export async function resolveStudentIdentity({ db, authUid, ssStudentId }) {
  const input = normalizeStudentIdentity({ authUid, ssStudentId });
  if (input.authUid) {
    const snap = await db.collection('students').where('authUid', '==', input.authUid).limit(2).get();
    if (snap.size > 1) throw new Error('Multiple student records share the same Auth UID.');
    if (snap.size === 1) {
      const data = snap.docs[0].data();
      return { authUid: input.authUid, ssStudentId: data.ssStudentId || null, documentId: snap.docs[0].id };
    }
  }
  if (input.ssStudentId) {
    const snap = await db.collection('students').where('ssStudentId', '==', input.ssStudentId).limit(2).get();
    if (snap.size > 1) throw new Error('Multiple student records share the same SS Student ID.');
    if (snap.size === 1) {
      const data = snap.docs[0].data();
      return { authUid: data.authUid || null, ssStudentId: input.ssStudentId, documentId: snap.docs[0].id };
    }
  }
  throw new Error('Student identity could not be resolved.');
}
