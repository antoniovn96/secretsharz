import { collection, query, where, orderBy, limit, getDocs, writeBatch, doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../utils/constants';

export const generateMasterId = async () => {
  try {
    const year = new Date().getFullYear();
    const prefix = `SS-${year}-`;
    
    const q = query(
      collection(db, COLLECTIONS.STUDENTS),
      where('__name__', '>=', prefix),
      where('__name__', '<=', prefix + '\uf8ff'),
      orderBy('__name__', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    let newSequence = 1;
    if (!querySnapshot.empty) {
      const highestDoc = querySnapshot.docs[0];
      const highestId = highestDoc.id;
      const parts = highestId.split('-');
      if (parts.length === 3) {
        newSequence = parseInt(parts[2], 10) + 1;
      }
    }
    
    const paddedSequence = newSequence.toString().padStart(4, '0');
    return `${prefix}${paddedSequence}`;
  } catch (error) {
    console.error('Error generating master ID:', error);
    throw error;
  }
};

export const processIntake = async (userAuth, formData) => {
  try {
    const masterId = await generateMasterId();
    
    const batch = writeBatch(db);
    
    const studentRef = doc(db, COLLECTIONS.STUDENTS, masterId);
    batch.set(studentRef, {
      userId: userAuth?.uid || '',
      profile: {
        name: formData.profile?.name || '',
        dob: formData.profile?.dob || '',
        gender: formData.profile?.gender || '',
        phone: formData.profile?.phone || ''
      },
      school: {
        schoolId: formData.school?.schoolId || '',
        grade: formData.school?.grade || '',
        board: formData.school?.board || ''
      },
      parent: {
        name: formData.parent?.name || '',
        email: formData.parent?.email || '',
        phone: formData.parent?.phone || ''
      },
      intake: {
        primaryConcern: formData.intake?.primaryConcern || '',
        referralSource: formData.intake?.referralSource || ''
      },
      activeDivisions: [],
      assignedStaff: {}
    });
    
    const caseFileRef = doc(db, COLLECTIONS.CASE_FILES, masterId);
    batch.set(caseFileRef, {
      studentId: masterId,
      history: []
    });
    
    await batch.commit();
    return masterId;
  } catch (error) {
    console.error('Error processing intake:', error);
    throw error;
  }
};

export const assignStaffToStudent = async (adminUser, studentId, division, staffId) => {
  try {
    if (!adminUser || adminUser.role !== 'super_admin') {
      throw new Error('Unauthorized: Only super admins can assign staff.');
    }

    await runTransaction(db, async (transaction) => {
      const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId);
      const caseFileRef = doc(db, COLLECTIONS.CASE_FILES, studentId);

      const studentDoc = await transaction.get(studentRef);
      if (!studentDoc.exists()) {
        throw new Error(`Student document with ID ${studentId} does not exist.`);
      }

      const caseFileDoc = await transaction.get(caseFileRef);

      const studentData = studentDoc.data();
      
      const newAssignedStaff = { ...(studentData.assignedStaff || {}) };
      newAssignedStaff[division] = staffId;

      const activeDivisions = [...(studentData.activeDivisions || [])];
      if (!activeDivisions.includes(division)) {
        activeDivisions.push(division);
      }

      const updates = {
        assignedStaff: newAssignedStaff,
        activeDivisions: activeDivisions
      };

      if (studentData.status === 'onboarding') {
        updates.status = 'active';
      }

      transaction.update(studentRef, updates);

      const historyEntry = {
        type: 'assignment',
        division,
        staffId,
        assignedBy: adminUser.uid,
        timestamp: new Date()
      };

      if (caseFileDoc.exists()) {
        const history = [...(caseFileDoc.data().history || [])];
        history.push(historyEntry);
        transaction.update(caseFileRef, { history });
      } else {
        transaction.set(caseFileRef, {
          studentId,
          history: [historyEntry]
        });
      }
    });

    console.log(`Successfully assigned staff ${staffId} to student ${studentId} for division ${division}`);
  } catch (error) {
    console.error('Error assigning staff to student:', error);
    throw error;
  }
};
