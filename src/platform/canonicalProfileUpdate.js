/**
 * Canonical student-profile write bridge.
 *
 * This is intentionally independent of DashboardContext. It allows legacy
 * components to migrate their student-owned profile writes without touching
 * administrative assignment state, bookings, notifications, or other context
 * responsibilities.
 */
export async function updateCanonicalStudentProfile(user, profile) {
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
      profile,
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

  if (updates.phone !== undefined || updates.email !== undefined) {
    patch.contact = {};
    if (updates.phone !== undefined) {
      patch.contact.mobile = { number: String(updates.phone || '') };
    }
    if (updates.email !== undefined) {
      patch.contact.email = String(updates.email || '');
    }
  }

  if (
    updates.fatherName !== undefined || updates.fatherPhone !== undefined || updates.fatherEmail !== undefined ||
    updates.motherName !== undefined || updates.motherPhone !== undefined || updates.motherEmail !== undefined
  ) {
    patch.family = { guardians: [] };
    const father = {};
    const mother = {};

    if (updates.fatherName !== undefined) father.name = String(updates.fatherName || '').trim();
    if (updates.fatherPhone !== undefined) father.phone = String(updates.fatherPhone || '').trim();
    if (updates.fatherEmail !== undefined) father.email = String(updates.fatherEmail || '').trim();
    if (Object.keys(father).length) patch.family.guardians.push({ relationship: 'father', ...father });

    if (updates.motherName !== undefined) mother.name = String(updates.motherName || '').trim();
    if (updates.motherPhone !== undefined) mother.phone = String(updates.motherPhone || '').trim();
    if (updates.motherEmail !== undefined) mother.email = String(updates.motherEmail || '').trim();
    if (Object.keys(mother).length) patch.family.guardians.push({ relationship: 'mother', ...mother });
  }

  if (updates.education) {
    patch.academic = {
      history: updates.education,
      highestLevel: updates.education.highestLevel,
      address: updates.education.address,
      yearOfPassing: updates.education.yearOfPassing,
      isPursuing: updates.education.isPursuing,
      current: {
        institutionName: updates.education.schoolName,
        subjects: updates.education.subjects,
      },
    };
  }

  if (
    updates.interests !== undefined || updates.hobbies !== undefined || updates.tvShows !== undefined ||
    updates.movies !== undefined || updates.games !== undefined || updates.sports !== undefined
  ) {
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
    const track = String(updates.studentTrack || 'unassigned').toLowerCase();
    const active = (value) => ({ status: value ? 'active' : 'inactive' });

    patch.services = {
      career: active(track === 'career_guidance' || track === 'career' || track === 'both'),
      wellbeing: active(track === 'counselling' || track === 'wellbeing' || track === 'both'),
      sen: active(track === 'sen' || track === 'both'),
    };
  }

  if (updates.counsellingConsentAgreed !== undefined) {
    patch.governance = {
      consent: {
        wellbeing: Boolean(updates.counsellingConsentAgreed),
      },
    };
  }

  if (updates.profilePicture !== undefined || updates.gender !== undefined) {
    patch.identity = {};
    if (updates.profilePicture !== undefined) {
      patch.identity.photoURL = String(updates.profilePicture || '');
    }
    if (updates.gender !== undefined) {
      patch.identity.gender = String(updates.gender || '').trim();
    }
  }

  return patch;
}

export default updateCanonicalStudentProfile;
