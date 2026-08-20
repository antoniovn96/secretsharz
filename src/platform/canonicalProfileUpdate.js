/**
 * Canonical student-profile write bridge.
 *
 * Legacy UI components may send the ProfileEditor payload here, but the
 * server owns canonicalisation and persistence. The bridge waits for the
 * API response so callers only report success after the canonical profile
 * has actually been saved.
 */
export async function updateCanonicalStudentProfile(user, profile) {
  if (!user?.uid) throw new Error('Authenticated student account is required.');

  const token = await user.getIdToken();
  const response = await fetch('/api/student/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ studentId: user.uid, profile }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Unable to update the student profile.');
  return payload.studentProfile || payload.profile || payload;
}

export default updateCanonicalStudentProfile;
