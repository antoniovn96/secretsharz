import { buildCareerSkillEvidence, normalizeCareerSkills } from './careerSkillOntology.js';

/**
 * Skill alignment is intentionally evidence-gated. A student's skill score is
 * not treated as demonstrated ability unless the scoring payload explicitly
 * identifies the evidence type. The current V2 payload does not do that.
 */
export function buildSkillAlignmentEvidence(scored = {}, career = {}) {
  const careerEvidence = buildCareerSkillEvidence(career);
  const studentSkills = scored?.skills;
  const evidenceType = studentSkills?.evidenceType || null;
  const studentLabels = Array.isArray(studentSkills?.labels) ? studentSkills.labels : [];
  const studentNormalized = normalizeCareerSkills(studentLabels);
  const comparable = evidenceType === 'demonstrated' && studentNormalized.length > 0 && careerEvidence.normalizedSkills.length > 0;

  if (!comparable) {
    return {
      status: 'unavailable',
      label: 'Skills alignment not assessed',
      evidenceType: evidenceType || 'unknown',
      careerSkills: careerEvidence.normalizedSkills,
      matchedSkills: [],
      limitation: 'The current assessment does not provide demonstrated skill evidence that can be quantitatively compared with career descriptors.',
    };
  }

  const matchedSkills = studentNormalized.filter(skill => careerEvidence.normalizedSkills.includes(skill));
  return {
    status: 'descriptive',
    label: 'Skills to explore',
    evidenceType,
    careerSkills: careerEvidence.normalizedSkills,
    matchedSkills,
    limitation: 'This describes overlap in skill evidence; it is not a probability of success or a psychometric fit score.',
  };
}
