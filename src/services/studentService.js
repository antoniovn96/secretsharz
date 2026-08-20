import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

/**
 * Saves a college to the user's shortlist in a specific tier.
 *
 * NOTE: shortlist persistence remains on the legacy Career student document
 * until the dedicated canonical Career profile/shortlist write API is migrated.
 * Do not use this helper for assignment or authorization decisions.
 *
 * @param {Object} currentUser - The current user object containing at least the uid.
 * @param {Object} collegeData - The college data to save.
 * @param {string} tier - The tier to save to: 'dream', 'target', or 'safe'.
 */
export const saveCollegeToShortlist = async (currentUser, collegeData, tier) => {
  try {
    if (!currentUser || !currentUser.uid) {
      throw new Error('User must be logged in to save colleges.');
    }

    const validTiers = ['dream', 'target', 'safe'];
    if (!validTiers.includes(tier)) {
      throw new Error(`Invalid tier: ${tier}. Must be one of ${validTiers.join(', ')}`);
    }

    const studentRef = doc(db, 'students', currentUser.uid);

    await updateDoc(studentRef, {
      [`collegeShortlist.${tier}`]: arrayUnion({
        id: collegeData.id || Date.now().toString(),
        name: collegeData.name,
        course: collegeData.course || '',
        location: collegeData.location || '',
        addedAt: new Date().toISOString()
      })
    });

    return true;
  } catch (error) {
    console.error('Error saving college to shortlist:', error);
    throw error;
  }
};

/**
 * Fetches the current professional's authorised students through the server-side
 * caseload API. The counsellor UID is retained for backward compatibility, but
 * it must match the currently authenticated Firebase account; the client no
 * longer queries the legacy students collection directly.
 *
 * @param {string} counsellorUid - UID of the currently authenticated counsellor.
 * @returns {Promise<Array>} Array of authorised Career students.
 */
export const getAssignedStudents = async (counsellorUid) => {
  try {
    if (!counsellorUid) throw new Error('Counsellor UID is required.');
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== counsellorUid) {
      throw new Error('The authenticated counsellor does not match the requested account.');
    }

    const token = await currentUser.getIdToken(true);
    const response = await fetch('/api/professional/caseload?service=career', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Unable to load the authorised Career caseload.');
    return Array.isArray(payload.students) ? payload.students : [];
  } catch (error) {
    console.error('Error fetching assigned students:', error);
    throw error;
  }
};
