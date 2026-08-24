const NORMALIZATION_RULES = [
  ['coding', ['coding', 'programming', 'python', 'javascript', 'software development']],
  ['algorithms', ['algorithms', 'algorithmic thinking']],
  ['problem_solving', ['problem solving', 'problem-solving', 'analytical problem solving']],
  ['mathematics', ['mathematics', 'maths', 'mathematical']],
  ['statistics', ['statistics', 'statistical']],
  ['research', ['research', 'research methods', 'investigative research']],
  ['communication', ['communication', 'patient communication', 'client communication', 'presentation']],
  ['writing', ['writing', 'report writing', 'drafting']],
  ['critical_thinking', ['critical thinking', 'analytical thinking']],
  ['leadership', ['leadership', 'team leadership']],
  ['decision_making', ['decision making', 'decision-making']],
  ['design_thinking', ['design thinking', 'design']],
  ['creativity', ['creativity', 'creative']],
  ['negotiation', ['negotiation', 'negotiating']],
  ['active_listening', ['active listening', 'listening']],
];

export function normalizeCareerSkill(label = '') {
  const value = String(label).trim().toLowerCase();
  if (!value) return null;
  return NORMALIZATION_RULES.find(([, aliases]) => aliases.some(alias => value === alias || value.includes(alias)))?.[0] || null;
}

export function normalizeCareerSkills(skills = []) {
  return [...new Set((Array.isArray(skills) ? skills : []).map(normalizeCareerSkill).filter(Boolean))];
}

/**
 * Career skill labels are descriptors, not calibrated ability requirements.
 * Keep the normalized vocabulary separate from psychometric norms.
 */
export function buildCareerSkillEvidence(career = {}) {
  const labels = Array.isArray(career.skills) ? career.skills.filter(Boolean).map(String) : [];
  return {
    labels,
    normalizedSkills: normalizeCareerSkills(labels),
    evidenceType: 'career_descriptor',
    supportsQuantitativeAbilityMatching: false,
  };
}

export const CAREER_SKILL_ONTOLOGY_VERSION = '1.0.0';
