import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { CAREER_DATA } from '../../../src/data/careers.js';
import { ASSESSMENT_VERSION, matchCareerToProfile, scoreAssessment } from '../../../src/career/careerAssessmentBlueprint.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function safeString(value, max = 300) {
  return String(value || '').trim().slice(0, max);
}

function buildCareerMatches(scored, intake) {
  const academicAverage = Number(intake?.academicAverage || 0);
  return CAREER_DATA.map((career) => {
    const match = matchCareerToProfile(career, scored, { academicAverage });
    return {
      id: career.id,
      name: career.title,
      category: career.category,
      stream: Array.isArray(career.stream) ? career.stream.join(' / ') : '',
      riasec: career.riasec || [],
      explorationIndex: match.explorationIndex,
      rationale: `This pathway shares some characteristics with the profile's interest pattern. Explore the pathway details before making a decision.`
    };
  }).sort((a, b) => b.explorationIndex - a.explorationIndex).slice(0, 12);
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

  const body = req.body || {};
  const pathway = ['student', 'working_professional', 'hr_role_alignment'].includes(body.pathway) ? body.pathway : 'student';
  const intake = safeObject(body.intake);
  const answers = safeObject(body.answers);
  const scored = scoreAssessment(answers);
  const matches = buildCareerMatches(scored, intake);
  const paid = body.reportTier === 'premium' || body.reportTier === 'institution';

  // The server never trusts a client assertion that a report was purchased.
  // A premium tier is accepted only when an existing server-side entitlement exists.
  let entitlement = null;
  try {
    const userSnap = await getAdminFirestore().collection('users').doc(decoded.uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};
    entitlement = userData.careerReportAccess || null;
  } catch (_) {}

  const institutionId = safeString(intake.institutionId, 120);
  let institutionEntitled = false;
  if (institutionId) {
    try {
      const codeId = safeString(intake.licenseCode, 120);
      if (codeId) {
        const codeSnap = await getAdminFirestore().collection('institutionCodes').doc(codeId).get();
        institutionEntitled = codeSnap.exists && codeSnap.data()?.status === 'redeemed' && codeSnap.data()?.redeemedBy === decoded.uid;
      }
    } catch (_) {}
  }

  const fullAccess = entitlement?.status === 'paid' || institutionEntitled || body.reportTier === 'free' && !paid;
  const reportTier = fullAccess && (entitlement?.status === 'paid' || institutionEntitled) ? (institutionEntitled ? 'institution' : 'premium') : 'free';

  const report = {
    version: ASSESSMENT_VERSION,
    pathway,
    reportTier,
    completedAt: new Date().toISOString(),
    intake: {
      dob: safeString(intake.dob, 30),
      age: Number.isFinite(Number(intake.age)) ? Number(intake.age) : null,
      ageBand: safeString(intake.ageBand, 30),
      educationStage: safeString(intake.educationStage, 80),
      board: safeString(intake.board, 100),
      stream: safeString(intake.stream, 100),
      institutionName: safeString(intake.institutionName, 160),
      currentRole: safeString(intake.currentRole, 160),
      professionalIntent: safeString(intake.professionalIntent, 80),
      academicAverage: Number(intake.academicAverage || 0),
    },
    scores: scored,
    careerExploration: matches,
    reflection: {
      statement: 'Results are a structured starting point for exploration, not a verdict about the person.',
      recommendedNextStep: pathway === 'working_professional' ? 'Review the stay/grow, lateral pivot and industry pivot pathways with a career professional.' : 'Explore at least three pathways and compare their education, work, skills and lived experience before deciding.'
    }
  };

  try {
    const userRef = getAdminFirestore().collection('users').doc(decoded.uid);
    await userRef.set({
      careerAssessmentV2: report,
      careerAssessment: {
        version: ASSESSMENT_VERSION,
        completedAt: report.completedAt,
        hollandCode: scored.riasecCode.split('').slice(0, 3),
        riasecScores: scored.riasec,
        top5Careers: matches.slice(0, 5).map((career) => ({ name: career.name, stream: career.stream, matchScore: career.explorationIndex, tags: career.riasec })),
      },
      assessmentCompletedAt: report.completedAt,
      riasecCode: scored.riasecCode,
      riasecScores: scored.riasec,
    }, { merge: true });

    return res.status(200).json({ saved: true, report });
  } catch (error) {
    console.error('[career/submit-v2] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to save the career assessment.' });
  }
}
