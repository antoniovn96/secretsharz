import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { resolveLatestCareerAssessment } from '../../../src/platform/careerAssessmentResolver.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeString(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function toPublicAssessment(raw) {
  const resolved = resolveLatestCareerAssessment(raw || {});
  const source = resolved.source === 'canonical' && resolved.raw ? resolved.raw : raw?.careerAssessmentV2 || raw?.careerAssessment || {};
  const scores = resolved.riasecScores || source?.scores?.riasec || source?.riasecScores || {};
  const code = resolved.riasecCode || source?.scores?.riasecCode || source?.hollandCode || raw?.riasecCode || '';
  const codeString = Array.isArray(code) ? code.join('') : safeString(code, 20);
  const report = source && typeof source === 'object' ? source : {};
  const intake = report.intake || {};
  const profile = report.profile || {};
  const careers = resolved.top5Careers || report.careerExploration || report.top5Careers || raw?.topCareerMatches || [];

  return {
    status: resolved.status,
    source: resolved.source,
    id: resolved.id || null,
    pathway: report.pathway || 'student',
    reportTier: report.reportTier || raw?.careerAssessmentReportTier || 'full',
    reportPages: Number(report.reportPages || raw?.careerAssessmentReportPages || 20),
    bundle: {
      id: report.bundleId || null,
      sku: report.bundleSku || null,
      title: report.bundleTitle || 'Career Intelligence Assessment',
      selectedFamilyIds: Array.isArray(report.selectedFamilyIds) ? report.selectedFamilyIds : [],
    },
    completedAt: resolved.completedAt || report.completedAt || raw?.assessmentCompletedAt || null,
    intake,
    scores: {
      riasecCode: codeString,
      riasec: scores,
      readinessPercent: Number(report.scores?.readinessPercent ?? resolved.maturityPct ?? report.maturityPct ?? raw?.maturityPct ?? 0),
    },
    careerExploration: Array.isArray(careers) ? careers.slice(0, 12) : [],
    profile,
  };
}

function hasReportAccess(data) {
  return data?.careerReportAccess?.status === 'paid' || data?.institutionAccess?.status === 'active' || data?.careerAssessmentReportTier === 'institution' || data?.careerAssessmentReportTier === 'premium';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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

  try {
    const snapshot = await getAdminFirestore().collection('users').doc(decoded.uid).get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Account not found.' });

    const data = snapshot.data() || {};
    if (!hasReportAccess(data)) return res.status(403).json({ error: 'Full Career Intelligence access is not active.' });

    const assessment = resolveLatestCareerAssessment(data);
    if (assessment.status === 'not_started') return res.status(404).json({ error: 'Career assessment has not been completed.' });

    const identity = data.identity || data.profile || {};
    const name = safeString(identity.fullName || identity.legalName || data.name || decoded.name || 'Student', 160);

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      student: {
        id: decoded.uid,
        name,
        preferredName: safeString(identity.preferredName || data.preferredName, 120),
        photoURL: safeString(identity.photoURL || data.photoURL, 2000),
      },
      access: { unlocked: true },
      assessment: toPublicAssessment(data),
    });
  } catch (error) {
    console.error('[career/report] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to load the career report.' });
  }
}
