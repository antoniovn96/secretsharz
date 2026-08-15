// VidyaVantage Career Assessment v2
// Design principle: one assessment journey, multiple distinct measurement modules.
// Scores are deterministic and versioned. This is intentionally IRT-ready rather than
// pretending to be IRT-calibrated before pilot data exists.

export const ASSESSMENT_VERSION = '2.0.0';

export const PATHWAYS = Object.freeze({
  STUDENT: 'student',
  PROFESSIONAL: 'working_professional',
  HR: 'hr_role_alignment',
});

export const AGE_BANDS = Object.freeze([
  { id: '13_14', min: 13, max: 14, label: '13–14', language: 'exploratory' },
  { id: '15_16', min: 15, max: 16, label: '15–16', language: 'guided' },
  { id: '17_18', min: 17, max: 18, label: '17–18', language: 'decision' },
  { id: '19_21', min: 19, max: 21, label: '19–21', language: 'higher_education' },
  { id: '22_25', min: 22, max: 25, label: '22–25', language: 'early_career' },
  { id: '26_35', min: 26, max: 35, label: '26–35', language: 'career_growth' },
  { id: '36_45', min: 36, max: 45, label: '36–45', language: 'mid_career' },
  { id: '46_plus', min: 46, max: 150, label: '46+', language: 'career_transition' },
]);

export const STUDENT_STAGES = Object.freeze([
  { id: 'grade_8_9', label: 'Grade 8–9 / early secondary', band: 'school_exploration' },
  { id: 'grade_10', label: 'Grade 10 / stream decision', band: 'stream_decision' },
  { id: 'grade_11_12', label: 'Grade 11–12 / PUC', band: 'higher_secondary' },
  { id: 'diploma', label: 'Diploma / vocational', band: 'vocational' },
  { id: 'undergraduate', label: 'Undergraduate / degree', band: 'undergraduate' },
  { id: 'postgraduate', label: 'Postgraduate', band: 'postgraduate' },
  { id: 'phd_research', label: 'PhD / research', band: 'research' },
  { id: 'gap_or_transition', label: 'Gap year / changing course', band: 'transition' },
]);

export const PROFESSIONAL_INTENTS = Object.freeze([
  { id: 'stay_grow', label: 'Stay in my field and grow' },
  { id: 'same_role_new_employer', label: 'Keep a similar role but change employer' },
  { id: 'lateral_pivot', label: 'Move to a different role using my existing skills' },
  { id: 'industry_pivot', label: 'Move to a different industry' },
  { id: 'complete_change', label: 'Make a substantial career change' },
  { id: 'entrepreneurship', label: 'Explore entrepreneurship / self-employment' },
  { id: 'return_to_work', label: 'Return to work after a break' },
  { id: 'retirement_transition', label: 'Plan a later-career transition / second career' },
]);

export const DOMAINS = Object.freeze([
  { id: 'riasec', label: 'Career Interests', description: 'Activities and work themes that attract the person.' },
  { id: 'big5', label: 'Personality Tendencies', description: 'Continuous Big Five personality dimensions.' },
  { id: 'values', label: 'Career Values', description: 'What the person wants work and life to provide.' },
  { id: 'reasoning', label: 'Reasoning Sampler', description: 'Objective verbal, numerical and logical reasoning items.' },
  { id: 'readiness', label: 'Career Decision Readiness', description: 'Confidence, exploration behaviour and decision process.' },
  { id: 'environment', label: 'Work Environment', description: 'Preferred people, pace, structure, autonomy and context.' },
  { id: 'adaptability', label: 'Adaptability & Resilience', description: 'Response to change, setbacks and uncertainty.' },
  { id: 'student_context', label: 'Academic & Life Context', description: 'Academic history, subjects, hobbies and aspirations.' },
  { id: 'professional_context', label: 'Professional Context', description: 'Current role, duties, qualifications and transition intent.' },
  { id: 'hr_context', label: 'Role Alignment Context', description: 'Role requirements and employee development context.' },
]);

const scale5 = ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'];
const scale5Labels = { min: 'Strongly disagree', max: 'Strongly agree' };

function likert(id, domain, question, construct, extra = {}) {
  return { id, domain, type: 'likert5', question, construct, options: scale5, scaleMin: 1, scaleMax: 5, scaleLabels: scale5Labels, ...extra };
}

export const RIASEC_ITEMS = [
  ['R','I enjoy building, repairing, assembling or operating things.'], ['R','I prefer practical activities where I can see a physical result.'], ['R','I enjoy using tools, equipment, machines or technical systems.'], ['R','I would rather demonstrate how something works than only read about it.'], ['R','Outdoor, field-based or hands-on work appeals to me.'], ['R','I like solving practical problems with a concrete solution.'],
  ['I','I enjoy investigating why something happens.'], ['I','I like analysing information before reaching a conclusion.'], ['I','I enjoy science, research, experiments or evidence-based questions.'], ['I','I like finding patterns in numbers, data or complex information.'], ['I','I enjoy problems where there is more than one hypothesis to test.'], ['I','I would enjoy work that requires sustained intellectual curiosity.'],
  ['A','I enjoy creating original visual, written, musical or dramatic work.'], ['A','I like expressing ideas in unusual or imaginative ways.'], ['A','I prefer open-ended tasks to tasks with one prescribed answer.'], ['A','I notice design, aesthetics, storytelling and presentation.'], ['A','I enjoy experimenting with style, media or creative technology.'], ['A','I would enjoy work where originality is an important part of the output.'],
  ['S','I enjoy helping people learn, recover, improve or feel supported.'], ['S','People often come to me when they need someone to listen.'], ['S','I enjoy teaching, mentoring, explaining or coaching.'], ['S','I find meaning in work that benefits other people.'], ['S','I prefer collaboration and human interaction to working alone all day.'], ['S','I would enjoy a role involving communication and service.'],
  ['E','I enjoy persuading, negotiating or influencing decisions.'], ['E','I like taking initiative when a group needs direction.'], ['E','I am interested in business, entrepreneurship or building something of my own.'], ['E','I enjoy presenting ideas and winning support for them.'], ['E','I am comfortable taking calculated risks to pursue an opportunity.'], ['E','I would enjoy roles involving leadership, sales, strategy or enterprise.'],
  ['C','I enjoy organising information, records or processes accurately.'], ['C','I like clear procedures, standards and expectations.'], ['C','I notice errors and enjoy correcting them.'], ['C','I prefer structured work with measurable outputs.'], ['C','I am comfortable working carefully with numbers, documents or schedules.'], ['C','I would enjoy roles where reliability and organisation matter greatly.'],
].map(([key, question], i) => likert(`riasec_${i+1}`, 'riasec', question, `riasec_${key}`, { riasecKey: key }));

export const BIG5_ITEMS = [
  ['O','I enjoy exploring unfamiliar ideas, cultures or perspectives.'], ['O','I am curious about subjects outside what I normally study or do.'], ['O','I enjoy learning simply because something interests me.'], ['O','I like experimenting with new approaches rather than always using the familiar one.'], ['O','I enjoy imagining how things could be different in the future.'], ['O','I am comfortable with ambiguity when exploring a difficult question.'],
  ['C','I make plans and usually follow through on them.'], ['C','I keep track of deadlines without needing frequent reminders.'], ['C','I check important work carefully before submitting it.'], ['C','I can work steadily even when the task is not exciting.'], ['C','I set goals and monitor my progress.'], ['C','Others can generally rely on me to do what I said I would do.'],
  ['E','I feel energised by meaningful interaction with other people.'], ['E','I am comfortable speaking up in groups.'], ['E','I can initiate a conversation with someone I do not know.'], ['E','I enjoy presenting ideas to an audience.'], ['E','I am comfortable taking a visible role when a group needs one.'], ['E','I tend to communicate rather than remain silent when I have a useful idea.'],
  ['A','I try to understand another person's point of view before responding.'], ['A','I cooperate even when my preferred approach is different.'], ['A','I care about the impact my decisions have on other people.'], ['A','I can give constructive feedback without humiliating someone.'], ['A','I value trust and fairness in relationships.'], ['A','I usually look for solutions that preserve relationships where possible.'],
  ['N','Unexpected setbacks can affect my concentration for a while.'], ['N','I sometimes worry about making the wrong decision.'], ['N','I can become tense when several important things happen at once.'], ['N','I may replay mistakes in my mind after they happen.'], ['N','Uncertainty can make me uncomfortable until I have a plan.'], ['N','I need time to recover after a highly stressful experience.'],
].map(([key, question], i) => likert(`big5_${i+1}`, 'big5', question, `big5_${key}`, { big5Key: key, reverse: key === 'N' }));

export const VALUE_ITEMS = [
  ['security','Stable income and job security matter strongly to me.'],
  ['autonomy','I want substantial freedom in how I organise my work.'],
  ['learning','Continuous learning is important to me.'],
  ['impact','I want my work to make a positive difference to people or society.'],
  ['creativity','I need opportunities to create or innovate.'],
  ['status','Recognition, reputation or professional standing matter to me.'],
  ['balance','Protecting time for family, health and life outside work matters strongly to me.'],
  ['leadership','I want opportunities to influence decisions and lead others.'],
  ['income','High earning potential is a major career priority for me.'],
  ['variety','I want variety rather than doing the same type of work every day.'],
  ['mastery','I want to become highly expert in a specialised area.'],
  ['belonging','I want to work in an environment where I feel connected to people.'],
].map(([key, question], i) => likert(`value_${i+1}`, 'values', question, `value_${key}`, { valueKey: key }));

export const READINESS_ITEMS = [
  ['clarity','I can describe at least three career directions I am genuinely willing to explore.'],
  ['exploration','I actively seek information about courses, careers or workplaces.'],
  ['decision','I can make a decision even when I do not have perfect information.'],
  ['selfknowledge','I can explain why I am attracted to my preferred career options.'],
  ['action','When I identify a goal, I can turn it into specific next steps.'],
  ['feedback','I am willing to change my plan when credible evidence suggests I should.'],
  ['support','I know who I can approach when I need guidance about a career decision.'],
  ['research','I compare multiple options rather than relying on one popular career.'],
  ['confidence','I believe I can learn skills I do not currently have.'],
  ['reflection','I regularly reflect on what I enjoy, what I can do well and what I want next.'],
].map(([key, question], i) => likert(`ready_${i+1}`, 'readiness', question, `readiness_${key}`));

export const ENVIRONMENT_ITEMS = [
  ['people','I prefer work that involves frequent interaction with people.'],
  ['autonomy','I prefer substantial autonomy over how I complete tasks.'],
  ['structure','I work best when expectations and processes are clearly defined.'],
  ['pace','I enjoy fast-moving environments where priorities can change.'],
  ['remote','I am comfortable working independently with limited in-person contact.'],
  ['competition','Competition motivates me to improve my performance.'],
  ['collaboration','I prefer solving problems with a team rather than alone.'],
  ['field','I would consider work that involves travel, fieldwork or changing locations.'],
].map(([key, question], i) => likert(`env_${i+1}`, 'environment', question, `environment_${key}`));

export const ADAPTABILITY_ITEMS = [
  ['change','When circumstances change, I can adjust my plan without giving up the goal.'],
  ['setback','After a setback, I can identify what I can learn from it.'],
  ['feedback','I can use criticism without automatically seeing it as a personal failure.'],
  ['uncertainty','I can continue taking sensible action while some information is unknown.'],
  ['recovery','I usually regain focus after a stressful period.'],
  ['persistence','I can continue working toward a meaningful goal when progress is slow.'],
  ['flexibility','I am willing to learn a new method when the old method no longer works.'],
  ['help','I can recognise when I need support and ask for it.'],
].map(([key, question], i) => likert(`adapt_${i+1}`, 'adaptability', question, `adaptability_${key}`));

export const REASONING_ITEMS = [
  { id:'reason_1', domain:'reasoning', type:'objective', construct:'verbal', question:'BOOK is to READING as FORK is to:', options:['Cooking','Writing','Painting','Driving'], correct:0 },
  { id:'reason_2', domain:'reasoning', type:'objective', construct:'numerical', question:'If 5 notebooks cost ₹150, what would 8 notebooks cost at the same rate?', options:['₹210','₹220','₹240','₹260'], correct:2 },
  { id:'reason_3', domain:'reasoning', type:'objective', construct:'logical', question:'All A are B. Some B are C. Which statement must be true?', options:['All A are C','Some A are C','No A are C','None of these is necessarily true'], correct:3 },
  { id:'reason_4', domain:'reasoning', type:'objective', construct:'numerical', question:'What comes next: 2, 6, 12, 20, 30, ?', options:['36','40','42','44'], correct:2 },
  { id:'reason_5', domain:'reasoning', type:'objective', construct:'verbal', question:'Choose the word closest in meaning to "concise".', options:['Detailed','Brief','Confusing','Emotional'], correct:1 },
  { id:'reason_6', domain:'reasoning', type:'objective', construct:'logical', question:'If every researcher is a learner and some learners are artists, which conclusion is safest?', options:['Every researcher is an artist','Some researchers are artists','No researcher is an artist','We cannot determine whether any researcher is an artist'], correct:3 },
  { id:'reason_7', domain:'reasoning', type:'numerical', construct:'numerical', question:'A class has 40 students. 25% are absent. How many are present?', options:['10','20','30','35'], correct:2 },
  { id:'reason_8', domain:'reasoning', type:'objective', construct:'logical', question:'Which item does not belong?', options:['Triangle','Square','Circle','Rectangle'], correct:2 },
  { id:'reason_9', domain:'reasoning', type:'numerical', construct:'numerical', question:'A number is multiplied by 3 and then 6 is added to give 30. What is the number?', options:['6','7','8','9'], correct:0 },
  { id:'reason_10', domain:'reasoning', type:'verbal', construct:'verbal', question:'Choose the best opposite of "rigid".', options:['Strict','Fixed','Flexible','Precise'], correct:2 },
  { id:'reason_11', domain:'reasoning', type:'logical', construct:'logical', question:'If Monday is coded as 1, Tuesday as 2, and so on, what is the code for Friday?', options:['4','5','6','7'], correct:1 },
  { id:'reason_12', domain:'reasoning', type:'numerical', construct:'numerical', question:'What is 15% of 200?', options:['15','20','30','35'], correct:2 },
];

export const ALL_CORE_ITEMS = Object.freeze([
  ...RIASEC_ITEMS,
  ...BIG5_ITEMS,
  ...VALUE_ITEMS,
  ...READINESS_ITEMS,
  ...ENVIRONMENT_ITEMS,
  ...ADAPTABILITY_ITEMS,
  ...REASONING_ITEMS,
]);

export const FREE_ITEM_LIMITS = Object.freeze({ riasec: 18, big5: 10, values: 6, reasoning: 4, readiness: 4, environment: 0, adaptability: 0 });

export function calculateAge(dob, now = new Date()) {
  if (!dob) return null;
  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function ageBandFor(age) {
  return AGE_BANDS.find((band) => age >= band.min && age <= band.max)?.id || null;
}

export function buildItemSet({ pathway, age, paid = false }) {
  const core = [...ALL_CORE_ITEMS];
  const selected = [];
  const limits = paid ? null : FREE_ITEM_LIMITS;
  for (const item of core) {
    if (!paid && limits[item.domain] === 0) continue;
    if (!paid && limits[item.domain] != null) {
      const current = selected.filter((x) => x.domain === item.domain).length;
      if (current >= limits[item.domain]) continue;
    }
    selected.push(item);
  }
  // Working professionals receive the same core measurement domains, but their
  // context branch is added by the UI and is never scored as personality.
  return selected;
}

export function scoreLikert(value, reverse = false) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const bounded = Math.max(1, Math.min(5, n));
  return reverse ? 6 - bounded : bounded;
}

export function scoreAssessment(answers) {
  const result = {
    version: ASSESSMENT_VERSION,
    domains: {},
    riasec: { R:0, I:0, A:0, S:0, E:0, C:0 },
    big5: { O:0, C:0, E:0, A:0, N:0 },
    values: {},
    readiness: 0,
    environment: {},
    adaptability: 0,
    reasoning: { correct:0, total:0, verbal:0, numerical:0, logical:0 },
  };
  for (const item of ALL_CORE_ITEMS) {
    const value = answers?.[item.id];
    if (item.type === 'objective') {
      result.reasoning.total += 1;
      if (Number(value) === item.correct) {
        result.reasoning.correct += 1;
        result.reasoning[item.construct] += 1;
      }
      continue;
    }
    const scored = scoreLikert(value, item.reverse);
    if (scored == null) continue;
    if (item.riasecKey) result.riasec[item.riasecKey] += scored;
    if (item.big5Key) result.big5[item.big5Key] += scored;
    if (item.valueKey) result.values[item.valueKey] = scored;
    if (item.domain === 'readiness') result.readiness += scored;
    if (item.environment) result.environment[item.environment] = scored;
    if (item.domain === 'adaptability') result.adaptability += scored;
  }
  result.riasecCode = Object.entries(result.riasec).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k).join('');
  result.big5 = Object.fromEntries(Object.entries(result.big5).map(([k,v]) => [k, Number(v.toFixed(2))]));
  result.reasoning.percent = result.reasoning.total ? Math.round((result.reasoning.correct / result.reasoning.total) * 100) : null;
  result.readinessPercent = Math.round((result.readiness / 50) * 100);
  result.adaptabilityPercent = Math.round((result.adaptability / 40) * 100);
  return result;
}

export function cosineSimilarity(a, b) {
  const keys = Array.from(new Set([...Object.keys(a || {}), ...Object.keys(b || {})]));
  let dot=0, aa=0, bb=0;
  for (const key of keys) { const x=Number(a?.[key]||0), y=Number(b?.[key]||0); dot += x*y; aa += x*x; bb += y*y; }
  if (!aa || !bb) return 0;
  return dot / (Math.sqrt(aa) * Math.sqrt(bb));
}

export function createUserVector(scored, context = {}) {
  return {
    riasec_R: scored.riasec.R, riasec_I: scored.riasec.I, riasec_A: scored.riasec.A,
    riasec_S: scored.riasec.S, riasec_E: scored.riasec.E, riasec_C: scored.riasec.C,
    big5_O: scored.big5.O, big5_C: scored.big5.C, big5_E: scored.big5.E, big5_A: scored.big5.A, big5_N: scored.big5.N,
    reasoning: scored.reasoning.percent || 0,
    readiness: scored.readinessPercent || 0,
    adaptability: scored.adaptabilityPercent || 0,
    academicAverage: Number(context.academicAverage || 0),
  };
}

export function matchCareerToProfile(career, scored, context = {}) {
  const vector = createUserVector(scored, context);
  const prototype = {
    riasec_R: (career.riasec || []).includes('R') ? 5 : 1,
    riasec_I: (career.riasec || []).includes('I') ? 5 : 1,
    riasec_A: (career.riasec || []).includes('A') ? 5 : 1,
    riasec_S: (career.riasec || []).includes('S') ? 5 : 1,
    riasec_E: (career.riasec || []).includes('E') ? 5 : 1,
    riasec_C: (career.riasec || []).includes('C') ? 5 : 1,
    big5_O: 3, big5_C: 3, big5_E: 3, big5_A: 3, big5_N: 3,
    reasoning: 60,
    readiness: 60,
    adaptability: 60,
    academicAverage: Number(context.academicAverage || 60),
  };
  const similarity = cosineSimilarity(vector, prototype);
  return { similarity, explorationIndex: Math.round(Math.max(0, Math.min(1, (similarity + 1) / 2)) * 100) };
}

export function reportPlan({ paid = false, pathway = PATHWAYS.STUDENT }) {
  if (!paid) return ['Snapshot', 'Your profile', 'Career directions & next steps'];
  if (pathway === PATHWAYS.PROFESSIONAL) return [
    'Executive summary','Current career profile','Personality tendencies','Career interests','Values & motivators','Reasoning sampler','Work environment','Adaptability','Career readiness','Role satisfaction','Current responsibilities','Transferable skills','Stay & grow option','Lateral pivot options','Industry pivot options','Upskilling gaps','Target-role exploration','Transition roadmap','90-day action plan','Professional review & limitations'
  ];
  if (pathway === PATHWAYS.HR) return [
    'Role alignment summary','Employee profile','Role requirements','Personality tendencies','Interests','Values','Reasoning sampler','Work environment','Adaptability','Motivation','Strengths','Competency evidence','Role alignment','Development gaps','Learning priorities','Internal mobility options','Succession considerations','Development plan','Manager conversation guide','Professional limitations & governance'
  ];
  return [
    'Executive summary','Career profile','Interest profile','Personality tendencies','Career values','Reasoning sampler','Decision readiness','Work environment','Adaptability & resilience','Academic profile','Subject strengths & preferences','Strengths & development areas','Career clusters to explore','Top pathway exploration','Alternative pathways','Education roadmap','Skills & experience plan','Opportunity plan','Action roadmap','Counsellor conversation & limitations'
  ];
}
