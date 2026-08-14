import { CAREER_CATALOG, COLLEGE_CATALOG } from './careerCatalog';

export function discoverCareerOptions({ careerMatches = [], includeAdditional = true, limit = 15 } = {}) {
  const ranked = careerMatches
    .filter(match => match?.careerId)
    .slice(0, includeAdditional ? limit : 5);

  return ranked.map(match => {
    const family = CAREER_CATALOG.find(item => item.id === match.careerId);
    return {
      ...match,
      familyTitle: family?.title || null,
      careers: family?.careers || [],
      courses: family?.courses || [],
    };
  });
}

export function discoverVerifiedColleges({ courseIds = [], city = null, state = null } = {}) {
  const requested = new Set(courseIds);
  return COLLEGE_CATALOG.filter(college => {
    if (!college.verified || !college.source) return false;
    if (!college.courses?.some(courseId => requested.has(courseId))) return false;
    if (city && college.city?.toLowerCase() !== city.toLowerCase()) return false;
    if (state && college.state?.toLowerCase() !== state.toLowerCase()) return false;
    return true;
  });
}

export function buildExplorationDisclaimer() {
  return 'These options are based on the information provided and verified catalogue data. They are exploration suggestions, not guarantees or limits. Interests can change, and with learning, effort, qualifications and support, students can pursue many pathways.';
}
