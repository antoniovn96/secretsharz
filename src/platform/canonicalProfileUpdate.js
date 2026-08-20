/**
 * Canonical student-profile write bridge.
 *
 * This is intentionally independent of DashboardContext. It allows legacy
 * components to migrate their student-owned profile writes without touching
 * administrative assignment state, bookings, notifications, or other context
 * responsibilities.
 */
export async function updateCanonicalStudentProfile(user, updates) {
  if (!user?.uid) {
    throw new Error('Authenticated student account is required.');
  }

  const token = await user.getIdToken();
  const response = await fetch('/api/student/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      studentId: user.uid,
      profile: updates,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to update the student profile.');
  }

  return payload.studentProfile || payload.profile || payload;
}

export function buildProfileEditorPatch(updates = {}) {
  const patch = {};

  if (updates.profilePicture !== undefined || updates.gender !== undefined) {
    patch.identity = {};
    if (updates.profilePicture !== undefined) patch.identity.profilePicture = updates.profilePicture || null;
    if (updates.gender !== undefined) patch.identity.gender = String(updates.gender || '');
  }

  if (updates.phone !== undefined || updates.email !== undefined) {
    patch.contact = {};
    if (updates.phone !== undefined) patch.contact.mobile = { number: String(updates.phone || '') };
    if (updates.email !== undefined) patch.contact.email = String(updates.email || '');
  }

  if (updates.fatherName !== undefined || updates.fatherPhone !== undefined || updates.fatherEmail !== undefined ||
      updates.motherName !== undefined || updates.motherPhone !== undefined || updates.motherEmail !== undefined) {
    patch.family = { guardians: [] };
    const father = {};
    const mother = {};
    if (updates.fatherName !== undefined) father.name = updates.fatherName;
    if (updates.fatherPhone !== undefined) father.phone = updates.fatherPhone;
    if (updates.fatherEmail !== undefined) father.email = updates.fatherEmail;
    if (Object.keys(father).length) patch.family.guardians.push({ relationship: 'father', ...father });
    if (updates.motherName !== undefined) mother.name = updates.motherName;
    if (updates.motherPhone !== undefined) mother.phone = updates.motherPhone;
    if (updates.motherEmail !== undefined) mother.email = updates.motherEmail;
    if (Object.keys(mother).length) patch.family.guardians.push({ relationship: 'mother', ...mother });
  }

  if (updates.education) patch.academic = { history: updates.education };

  if (updates.interests !== undefined || updates.hobbies !== undefined || updates.tvShows !== undefined ||
      updates.movies !== undefined || updates.games !== undefined || updates.sports !== undefined) {
    patch.personal = {
      interests: updates.interests,
      hobbies: updates.hobbies,
      preferences: {
        tvShows: updates.tvShows,
        movies: updates.movies,
        games: updates.games,
        sports: updates.sports,
      },
    };
  }

  if (updates.studentTrack !== undefined) {
    const track = updates.studentTrack;
    patch.services = {
      career: track === 'career_guidance' || track === 'both',
      wellbeing: track === 'counselling' || track === 'both',
    };
  }

  if (updates.counsellingConsentAgreed !== undefined) {
    patch.governance = {
      consents: { wellbeing: Boolean(updates.counsellingConsentAgreed) },
    };
  }

  return patch;
}

export default updateCanonicalStudentProfile;
