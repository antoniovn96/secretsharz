import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves a college to the authenticated student's own shortlist.
 * Professional student listing is intentionally not implemented here;
 * sensitive student lists must use an authenticated server-side API.
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
