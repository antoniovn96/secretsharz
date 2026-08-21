import { collection, query, where, orderBy, limit, getDocs, getDoc, writeBatch, doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../utils/constants';
import { buildStaffAssignmentUpdate } from '../platform/studentRelationshipBridge';

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
      const parts = highestDoc.id.split('-');
      if (parts.length === 3) newSequence = parseInt(parts[2], 10) + 1;
    }
    return `${prefix}${newSequence.toString().padStart(4, '0')}`;
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
      assignedStaff: {
        careerId: null,
        psychId: null,
        senId: null,
        career: null,
        psych: null,
        sen: null
      },
      relationships: {
        assignments: {
          career: null,
          wellbeing: null,
          sen: null
        }
      },
      services: {
        career: { status: 'inactive' },
        wellbeing: { status: 'inactive' },
        sen: { status: 'inactive' }
      }
    });

    const caseFileRef = doc(db, COLLECTIONS.CASE_FILES, masterId);
    batch.set(caseFileRef, { studentId: masterId, history: [] });
    await batch.commit();
    return masterId;
  } catch (error) {
    console.error('Error processing intake:', error);
    throw error;
  }
};

const ROLE_BY_DIVISION = {
  career: ['career_counsellor'],
  psych: ['psychologist', 'counsellor'],
  sen: ['educator']
};

/**
 * Assign exactly one appropriately-role-matched professional to a student's
 * service pathway. The canonical relationship is written alongside the
 * legacy assignedStaff fields during the migration period.
 */
export const assignStaffToStudent = async (adminUser, studentId, division, staffId) => {
  try {
    if (!adminUser || adminUser.role !== 'super_admin') {
      throw new Error('Unauthorized: Only super admins can assign staff.');
    }
    if (!ROLE_BY_DIVISION[division]) {
      throw new Error('Invalid professional division. Choose career, psych, or sen.');
    }
    if (!staffId) throw new Error('A professional must be selected.');

    const staffRef = doc(db, COLLECTIONS.STAFF || 'staff', staffId);
    const staffDoc = await getDoc(staffRef);
    if (!staffDoc.exists()) throw new Error('Selected professional was not found.');

    const staffData = staffDoc.data();
    const role = staffData.role || staffData.professionalRole || '';
    if (!ROLE_BY_DIVISION[division].includes(role)) {
      const labels = {
        career: 'Career Counsellor',
        psych: 'Psychology Counsellor / Psychologist',
        sen: 'SEN Teacher / Educator'
      };
      throw new Error(`This professional cannot be assigned to ${labels[division]}. Please select an appropriate professional.`);
    }

    await runTransaction(db, async (transaction) => {
      const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId);
      const caseFileRef = doc(db, COLLECTIONS.CASE_FILES, studentId);
      const studentDoc = await transaction.get(studentRef);
      if (!studentDoc.exists()) throw new Error(`Student document with ID ${studentId} does not exist.`);

      const caseFileDoc = await transaction.get(caseFileRef);
      const studentData = studentDoc.data() || {};
      const relationshipUpdate = buildStaffAssignmentUpdate(studentData, division, staffId);

      const activeDivisions = [...(studentData.activeDivisions || [])];
      if (!activeDivisions.includes(division)) activeDivisions.push(division);

      const updates = {
        ...relationshipUpdate,
        activeDivisions,
        updatedAt: new Date()
      };
      if (studentData.status === 'onboarding') updates.status = 'active';
      transaction.update(studentRef, updates);

      const previousAssignment = studentData.relationships?.assignments?.[
        { career: 'career', psych: 'wellbeing', sen: 'sen' }[division]
      ] || null;
      const historyEntry = {
        type: 'assignment',
        division,
        service: { career: 'career', psych: 'wellbeing', sen: 'sen' }[division],
        staffId,
        previousStaffId: previousAssignment,
        assignedBy: adminUser.uid,
        timestamp: new Date()
      };

      if (caseFileDoc.exists()) {
        const history = [...(caseFileDoc.data().history || []), historyEntry];
        transaction.update(caseFileRef, { history });
      } else {
        transaction.set(caseFileRef, { studentId, history: [historyEntry] });
      }
    });

    console.log(`Successfully assigned staff ${staffId} to student ${studentId} for division ${division}`);
  } catch (error) {
    console.error('Error assigning staff to student:', error);
    throw error;
  }
};
