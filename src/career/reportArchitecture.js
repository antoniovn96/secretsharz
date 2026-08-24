export const FREE_REPORT_PAGE_COUNT = 5;
export const PREMIUM_REPORT_PAGE_COUNT = 18;

export const STUDENT_FREE_REPORT = Object.freeze([
  { id: 'executive_snapshot', title: 'Career Snapshot', purpose: 'A concise picture of the student’s current interests, context and strongest exploration signals.' },
  { id: 'interest_personality', title: 'Interests & Personality Tendencies', purpose: 'Interpret the current interest pattern and personality tendencies without treating either as a fixed identity.' },
  { id: 'strengths_values', title: 'Strengths, Values & Preferences', purpose: 'Connect strengths, values, subject preferences and preferred work environments.' },
  { id: 'career_directions', title: 'Career Directions to Explore', purpose: 'Present leading career clusters and alternatives with reasons to investigate them.' },
  { id: 'next_steps', title: 'Your Next 90 Days', purpose: 'Give practical exploration, research, skill and conversation actions.' }
]);

export const STUDENT_PREMIUM_REPORT = Object.freeze([
  ...STUDENT_FREE_REPORT.slice(0, 3),
  { id: 'developmental_context', title: 'Developmental & Academic Context', purpose: 'Interpret education stage, subjects, marks and academic context together.' },
  { id: 'riasec_profile', title: 'Career Interest Profile', purpose: 'Detailed RIASEC interpretation and implications for exploration.' },
  { id: 'personality_profile', title: 'Personality Tendencies', purpose: 'Big Five tendencies and how they may interact with work environments.' },
  { id: 'career_values', title: 'Career Values', purpose: 'Explain the work conditions and outcomes that matter most to the student.' },
  { id: 'reasoning_profile', title: 'Reasoning Sampler', purpose: 'Describe observed reasoning performance without presenting an IQ or norm-referenced score.' },
  { id: 'decision_readiness', title: 'Career Decision Readiness', purpose: 'Identify current exploration and decision-process strengths and development areas.' },
  { id: 'adaptability', title: 'Adaptability & Career Resilience', purpose: 'Describe change-readiness and developmental opportunities.' },
  { id: 'work_environment', title: 'Preferred Work Environment', purpose: 'Translate preferences into real-world work-condition considerations.' },
  { id: 'top_career_directions', title: 'Top Career Directions', purpose: 'Show strongest career clusters with match, confidence and evidence.' },
  { id: 'alternative_careers', title: 'Alternative & Unexpected Careers', purpose: 'Surface viable alternatives, including exploratory recommendations outside the original shortlist.' },
  { id: 'pathway_analysis', title: 'Non-Linear Pathway Analysis', purpose: 'Map direct, bridge and alternative routes from the student’s current position.' },
  { id: 'stream_analysis', title: 'Stream & Subject Scenarios', purpose: 'Show what changes if the student chooses different streams or academic routes.' },
  { id: 'education_roadmap', title: 'Education Roadmap', purpose: 'Translate career directions into qualifications, prerequisites, timelines and alternatives.' },
  { id: 'skills_evidence', title: 'Skills & Evidence Plan', purpose: 'Identify capabilities to build and evidence through projects, internships and activities.' },
  { id: 'affordability', title: 'Affordability, Scholarships & Friction', purpose: 'Compare financial, academic, geographic, time and qualification friction.' },
  { id: 'action_roadmap', title: '90-Day Career Action Roadmap', purpose: 'Convert exploration, opportunity research and skill-building into measurable actions and milestones.' },
  { id: 'counsellor_review', title: 'Counsellor Conversation & Limitations', purpose: 'Frame the result as guidance and identify questions worth discussing with a qualified professional.' }
]);

export const PROFESSIONAL_PREMIUM_REPORT = Object.freeze([
  { id: 'executive_snapshot', title: 'Career Intelligence Executive Summary', purpose: 'Current career position, goals and major signals.' },
  { id: 'current_role', title: 'Current Career & Role Context', purpose: 'Current employer, role, responsibilities, satisfaction and environment.' },
  { id: 'interest_personality', title: 'Interests & Personality Tendencies', purpose: 'Career-relevant tendencies and work preferences.' },
  { id: 'career_values', title: 'Career Values & Priorities', purpose: 'What the professional needs from work.' },
  { id: 'reasoning_skills', title: 'Reasoning & Skills Profile', purpose: 'Observed reasoning plus actual transferable skills and evidence.' },
  { id: 'role_fit', title: 'Current Job / Role Fit', purpose: 'Fit between the person, current role and actual work environment.' },
  { id: 'career_fit', title: 'Career Fit', purpose: 'Fit with broader career directions, distinct from a single job.' },
  { id: 'satisfaction', title: 'Satisfaction, Burnout & Boredom Context', purpose: 'Separate role, workplace and career-level issues.' },
  { id: 'stay_grow', title: 'Stay & Grow Option', purpose: 'Promotion, specialisation, role expansion and employer alternatives.' },
  { id: 'lateral_move', title: 'Lateral Pivot Options', purpose: 'Adjacent roles using transferable capability.' },
  { id: 'industry_change', title: 'Industry Transition Options', purpose: 'Industry changes and domain gaps.' },
  { id: 'career_change', title: 'Complete Career Change Options', purpose: 'Substantial pivots and transition costs.' },
  { id: 'friction', title: 'Career Transition Friction', purpose: 'Time, money, skill, qualification, geography and regulatory friction.' },
  { id: 'skills_gap', title: 'Skills Gap & Bridge Plan', purpose: 'Prioritised skills and bridge credentials.' },
  { id: 'target_roles', title: 'Target Roles & Role Fit', purpose: 'Target-role comparison with confidence and evidence.' },
  { id: 'learning_roadmap', title: 'Upskilling & Learning Roadmap', purpose: 'Learning sequence based on impact and feasibility.' },
  { id: 'roi', title: 'Time / Cost / ROI Planning', purpose: 'Structured career-transition planning, not financial advice.' },
  { id: 'transition_plan', title: 'Transition Roadmap', purpose: 'Practical bridge from current state to target.' },
  { id: 'action_plan', title: '30 / 60 / 90-Day Plan', purpose: 'Measurable next steps.' },
  { id: 'review_limitations', title: 'Professional Review & Limitations', purpose: 'Human review, evidence requirements and responsible interpretation.' }
]);

export function getReportPages({ tier = 'free', pathway = 'student' } = {}) {
  const fullTiers = new Set(['full', 'premium', 'institution']);
  if (!fullTiers.has(tier)) return STUDENT_FREE_REPORT;
  return pathway === 'working_professional' ? PROFESSIONAL_PREMIUM_REPORT : STUDENT_PREMIUM_REPORT;
}
