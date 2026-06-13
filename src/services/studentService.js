import { doc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves a college to the user's shortlist in a specific tier.
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
 * Fetches all students assigned to a specific counsellor.
 * @param {string} counsellorUid - The UID of the counsellor.
 * @returns {Promise<Array>} Array of student objects assigned to this counsellor.
 */
export const getAssignedStudents = async (counsellorUid) => {
  try {
    if (!counsellorUid) {
      throw new Error('Counsellor UID is required.');
    }

    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('assignedStaff.careerId', '==', counsellorUid));
    const querySnapshot = await getDocs(q);

    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return students;
  } catch (error) {
    console.error('Error fetching assigned students:', error);
    throw error;
  }
};
