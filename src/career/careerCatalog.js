// Seedable career/course/college catalogue for VidyaVantage.
// This is intentionally a catalogue contract + starter dataset. Production
// college coverage should be populated from verified institution/course data.

export const CAREER_CATALOG_VERSION = 'catalog-v1.0';

export const CAREER_CATALOG = Object.freeze([
  {
    id: 'psychology-and-behaviour',
    title: 'Psychology & Human Behaviour',
    family: 'people_and_behaviour',
    riasec: ['S', 'I'],
    dimensions: ['interests', 'values', 'work_style', 'motivation'],
    keywords: ['psychology', 'behaviour', 'mental health', 'people', 'research'],
    description: 'A broad family covering psychological science, counselling, education, behaviour and human development.',
    careers: [
      'Psychologist',
      'Counsellor',
      'Educational Psychologist',
      'Behavioural Researcher',
      'UX Researcher',
      'Human Resources Specialist',
      'Special Educator',
    ],
    courses: [
      {
        id: 'bsc-psychology',
        title: 'B.Sc. Psychology',
        level: 'undergraduate',
        duration: '3 years',
        eligibility: 'Typically requires completion of Class 12; exact subject and percentage requirements vary by institution.',
        description: 'An undergraduate foundation in psychological science, human behaviour, research and applied psychology.',
        tags: ['psychology', 'behaviour', 'research', 'people'],
      },
    ],
  },
]);

export const COLLEGE_CATALOG = Object.freeze([
  {
    id: 'starter-college-record',
    name: 'College catalogue entry — to be verified',
    city: null,
    state: null,
    country: 'India',
    courses: [],
    verified: false,
    source: null,
  },
]);

export function getCareerById(id) {
  return CAREER_CATALOG.find((career) => career.id === id) || null;
}

export function getCoursesForCareer(careerId) {
  return getCareerById(careerId)?.courses || [];
}

export function getCollegesForCourse(courseId) {
  return COLLEGE_CATALOG.filter((college) => college.verified && college.courses.includes(courseId));
}
