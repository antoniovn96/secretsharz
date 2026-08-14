import { buildCareerExplorationSet } from './careerMatcher';
import { getCareerById, getCoursesForCareer, getCollegesForCourse, CAREER_CATALOG_VERSION } from './careerCatalog';

export function enrichFullCareerResult({ baseResult, dimensions, riasec, candidate }) {
  const exploration = buildCareerExplorationSet({ dimensions, riasec, candidate });
  const matchedCareerIds = [...exploration.primary, ...exploration.additional].map((match) => match.careerId);

  const careerDetails = matchedCareerIds
    .map((careerId) => getCareerById(careerId))
    .filter(Boolean);

  const courses = careerDetails.flatMap((career) => career.courses.map((course) => ({
    ...course,
    careerId: career.id,
    careerTitle: career.title,
  })));

  const colleges = courses.flatMap((course) => getCollegesForCourse(course.id));

  return {
    ...baseResult,
    catalogueVersion: CAREER_CATALOG_VERSION,
    exploration,
    careerDetails,
    courses,
    colleges,
    roadmap: [],
  };
}

export function getCourseDiscovery(courseId) {
  for (const career of [getCareerById('psychology-and-behaviour')].filter(Boolean)) {
    const course = getCoursesForCareer(career.id).find((item) => item.id === courseId);
    if (course) return { ...course, careerId: career.id, careerTitle: career.title };
  }
  return null;
}
