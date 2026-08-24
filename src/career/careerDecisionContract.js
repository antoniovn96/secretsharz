import { buildCareerDecisionProfile, buildCareerDecisionExplanation } from './careerDecisionProfile.js';

export function buildCareerDecisionResult(career = {}, studentContext = {}, match = {}) {
  const profile = buildCareerDecisionProfile(career, studentContext);
  const explanation = buildCareerDecisionExplanation(profile, match.explanation || {});
  return {
    id: profile.careerId,
    name: profile.title,
    category: profile.cluster,
    interestAlignmentIndex: Number.isFinite(Number(match.interestAlignmentIndex)) ? Number(match.interestAlignmentIndex) : null,
    scoreLabel: 'Interest Alignment Index',
    explanation,
    decisionProfile: profile,
    evidenceUsed: {
      studentTopInterests: match.explanation?.studentTopInterests || [],
      careerInterestProfile: match.explanation?.careerInterestProfile || profile.fit.interestProfile,
      overlappingInterests: match.explanation?.overlappingInterests || [],
    },
    limitations: profile.limitations,
  };
}
