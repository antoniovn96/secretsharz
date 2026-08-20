import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';
import { toAdminStudentDirectoryRecord } from '../../../src/platform/adminStudentDirectory.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeAuthError(error) {
  return {
    code: error?.code || null,
    message: error?.message || 'Unknown Firebase Auth verification error',
    expectedProjectId: getAdminApp()?.options?.projectId || null,
  };
}

async function getReferencedDocuments(db, collectionName, ids) {
  const uniqueIds = [...new Set(ids.filter(Boolean).map(String))];
  if (!uniqueIds.length) return new Map();
  const refs = uniqueIds.map(id => db.collection(collectionName).doc(id));
  const snapshots = await db.getAll(...refs);
  return new Map(snapshots.filter(snapshot => snapshot.exists).map(snapshot => [snapshot.id, snapshot.data() || {}]));
}

function professionalName(user = {}, profile = {}) {
  return user.name || user.fullName || profile.displayName || profile.name || '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[admin students auth] Firebase ID token verification failed:', safeAuthError(error));
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const isFounder = decodedToken.email_verified === true && decodedToken.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decodedToken.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });

  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection('users').get();
    const students = snapshot.docs
      .filter(doc => isStudentProfile(doc.data() || {}))
      .map(doc => toAdminStudentDirectoryRecord(doc.data() || {}, doc.id));

    const assignmentIds = students
      .flatMap(student => Object.values(student.assignments || {}))
      .filter(Boolean);
    const institutionIds = students.map(student => student.institutionId).filter(Boolean);

    const [professionalUsers, professionalProfiles, institutions] = await Promise.all([
      getReferencedDocuments(db, 'users', assignmentIds),
      getReferencedDocuments(db, 'professionals', assignmentIds),
      getReferencedDocuments(db, 'institutions', institutionIds),
    ]);

    const professionalDirectory = new Map();
    for (const id of new Set(assignmentIds)) {
      professionalDirectory.set(id, professionalName(professionalUsers.get(id) || {}, professionalProfiles.get(id) || {}));
    }

    students.forEach(student => {
      const assignedNames = Object.entries(student.assignments || {})
        .filter(([, professionalId]) => professionalId)
        .map(([service, professionalId]) => {
          const name = professionalDirectory.get(professionalId);
          return name ? `${service}: ${name}` : '';
        })
        .filter(Boolean);
      student.assignedProfessionalName = assignedNames.join(' · ');
      student.assignedProfessionalNames = Object.fromEntries(
        Object.entries(student.assignments || {})
          .filter(([, professionalId]) => professionalId)
          .map(([service, professionalId]) => [service, professionalDirectory.get(professionalId) || ''])
      );

      const institution = institutions.get(student.institutionId);
      if (institution) {
        student.institutionName = institution.name || student.institutionName;
        student.schoolName = student.institutionName;
        student.academicYear = institution.academicYear || student.academicYear;
      }
    });

    students.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      students,
      count: students.length,
      filters: {
        institutions: [...new Set(students.map(student => student.institutionName).filter(Boolean))].sort(),
        grades: [...new Set(students.map(student => student.grade).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })),
        academicYears: [...new Set(students.map(student => student.academicYear).filter(Boolean))].sort().reverse(),
        counsellors: [...new Set(students.map(student => student.assignedProfessionalName).filter(Boolean))].sort(),
      },
    });
  } catch (error) {
    console.error('[admin students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the student directory.' });
  }
}
