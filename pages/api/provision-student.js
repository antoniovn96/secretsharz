import { getAdminAuth, getAdminFirestore } from '../../src/security/firebaseAdmin.js';
import { canProvisionRole, assertInstitutionScope, getRequesterRole } from '../../src/security/provisioningAuthorization.js';
import { provisionStudentAccount } from '../../src/security/provisionStudentAccount.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 180) {
  return String(value || '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  if (!canProvisionRole(decoded, 'student')) {
    return res.status(403).json({ error: 'Only an administrator, authorised professional, or institution may create student accounts.' });
  }

  const name = clean(req.body?.name);
  const email = clean(req.body?.email, 254).toLowerCase();
  const institutionId = clean(req.body?.institutionId, 120) || null;
  const institutionName = clean(req.body?.institutionName, 180);
  const role = getRequesterRole(decoded);

  if (!name || !email) return res.status(400).json({ error: 'Student name and email are required.' });
  if (!email.includes('@')) return res.status(400).json({ error: 'A valid student email is required.' });
  if (role === 'institution' && !assertInstitutionScope(decoded, institutionId)) {
    return res.status(403).json({ error: 'The institution account may only provision students within its own institution.' });
  }

  try {
    const result = await provisionStudentAccount({
      adminAuth: getAdminAuth(),
      adminDb: getAdminFirestore(),
      studentName: name,
      studentEmail: email,
      institutionId,
      institutionName,
      provisionedByRole: role,
      profile: {
        grade: clean(req.body?.grade, 80) || null,
        classLevel: clean(req.body?.classLevel, 80) || null,
        primary_path: clean(req.body?.primary_path, 40) || 'unassigned',
        track: clean(req.body?.track, 40) || 'hybrid',
        profileSource: 'provisioned'
      }
    });

    try {
      await getAdminFirestore().collection('auditEvents').add({
        actorUid: decoded.uid || null,
        actorEmail: decoded.email || null,
        actorRole: role,
        targetUid: result.uid,
        targetRole: 'student',
        action: 'provision_student',
        institutionId,
        createdAt: new Date().toISOString()
      });
    } catch (auditError) {
      console.error('[provision-student] audit write failed:', auditError?.message || auditError);
    }

    return res.status(200).json({ success: true, student: { ...result } });
  } catch (error) {
    console.error('[provision-student] failed:', error?.message || error);
    return res.status(409).json({ error: error?.message || 'Unable to provision the student account.' });
  }
}
