// Secret Sharz Career Interest Explorer — RIASEC V1
// Original draft instrument. NOT psychometrically validated.

export const RIASEC_V1 = Object.freeze({
  instrumentId: 'CAREER-INTEREST-RIASEC',
  version: '1.0.0-draft',
  status: 'draft',
  responseScale: Object.freeze([
    { value: 1, label: 'Would really dislike doing this' },
    { value: 2, label: 'Would probably not enjoy this' },
    { value: 3, label: 'Not sure / might enjoy this' },
    { value: 4, label: 'Would probably enjoy this' },
    { value: 5, label: 'Would really enjoy this' },
  ]),
  dimensions: Object.freeze(['R','I','A','S','E','C']),
  items: Object.freeze([
  { id: 'R-001', dimension: 'R', prompt: "I would enjoy building or assembling something using tools." },
  { id: 'R-002', dimension: 'R', prompt: "I would enjoy working with machines or equipment to make something work." },
  { id: 'R-003', dimension: 'R', prompt: "I would enjoy doing practical tasks where I can see a physical result." },
  { id: 'R-004', dimension: 'R', prompt: "I would enjoy working outdoors on projects involving plants, land, buildings or equipment." },
  { id: 'R-005', dimension: 'R', prompt: "I would enjoy fixing an object when I understand what is wrong with it." },
  { id: 'R-006', dimension: 'R', prompt: "I would enjoy learning how to safely use tools for a practical project." },
  { id: 'R-007', dimension: 'R', prompt: "I would enjoy putting materials together to create or repair something." },
  { id: 'R-008', dimension: 'R', prompt: "I would enjoy doing a hands-on experiment where I can change something and observe the result." },
  { id: 'R-009', dimension: 'R', prompt: "I would enjoy setting up a practical project and making sure the materials are ready." },
  { id: 'R-010', dimension: 'R', prompt: "I would enjoy learning how things work by taking apart, examining and rebuilding simple objects." },
  { id: 'I-001', dimension: 'I', prompt: "I would enjoy finding out why something happens." },
  { id: 'I-002', dimension: 'I', prompt: "I would enjoy solving a difficult puzzle that requires careful thinking." },
  { id: 'I-003', dimension: 'I', prompt: "I would enjoy comparing information to find patterns." },
  { id: 'I-004', dimension: 'I', prompt: "I would enjoy doing an experiment and recording what I observe." },
  { id: 'I-005', dimension: 'I', prompt: "I would enjoy asking questions and researching the answers." },
  { id: 'I-006', dimension: 'I', prompt: "I would enjoy analysing numbers or data to discover something interesting." },
  { id: 'I-007', dimension: 'I', prompt: "I would enjoy figuring out how a system works." },
  { id: 'I-008', dimension: 'I', prompt: "I would enjoy testing different ideas to see which one works best." },
  { id: 'I-009', dimension: 'I', prompt: "I would enjoy investigating a problem before deciding what to do." },
  { id: 'I-010', dimension: 'I', prompt: "I would enjoy learning more about a topic simply because I want to understand it better." },
  { id: 'A-001', dimension: 'A', prompt: "I would enjoy creating a drawing, illustration or visual design." },
  { id: 'A-002', dimension: 'A', prompt: "I would enjoy writing a story, poem or other original piece." },
  { id: 'A-003', dimension: 'A', prompt: "I would enjoy creating or performing music." },
  { id: 'A-004', dimension: 'A', prompt: "I would enjoy creating a video, photograph or other visual project." },
  { id: 'A-005', dimension: 'A', prompt: "I would enjoy designing something in my own style rather than following one exact model." },
  { id: 'A-006', dimension: 'A', prompt: "I would enjoy acting, performing or presenting creatively." },
  { id: 'A-007', dimension: 'A', prompt: "I would enjoy turning an idea into a creative project." },
  { id: 'A-008', dimension: 'A', prompt: "I would enjoy experimenting with colours, shapes, sounds or words to create something new." },
  { id: 'A-009', dimension: 'A', prompt: "I would enjoy improving how something looks or feels through creative design." },
  { id: 'A-010', dimension: 'A', prompt: "I would enjoy making something original that communicates an idea or feeling." },
  { id: 'S-001', dimension: 'S', prompt: "I would enjoy helping someone understand something they are struggling with." },
  { id: 'S-002', dimension: 'S', prompt: "I would enjoy listening carefully when someone wants to talk about a problem." },
  { id: 'S-003', dimension: 'S', prompt: "I would enjoy teaching a skill to another person." },
  { id: 'S-004', dimension: 'S', prompt: "I would enjoy working with a group to help people achieve a shared goal." },
  { id: 'S-005', dimension: 'S', prompt: "I would enjoy supporting someone who is learning something new." },
  { id: 'S-006', dimension: 'S', prompt: "I would enjoy planning an activity that helps people feel included." },
  { id: 'S-007', dimension: 'S', prompt: "I would enjoy helping resolve a disagreement between people." },
  { id: 'S-008', dimension: 'S', prompt: "I would enjoy volunteering for an activity that helps my school or community." },
  { id: 'S-009', dimension: 'S', prompt: "I would enjoy encouraging someone who is finding something difficult." },
  { id: 'S-010', dimension: 'S', prompt: "I would enjoy learning about how people think, feel and work together." },
  { id: 'E-001', dimension: 'E', prompt: "I would enjoy leading a group project." },
  { id: 'E-002', dimension: 'E', prompt: "I would enjoy presenting an idea and convincing others to consider it." },
  { id: 'E-003', dimension: 'E', prompt: "I would enjoy organising an event or project from start to finish." },
  { id: 'E-004', dimension: 'E', prompt: "I would enjoy making decisions when a group needs someone to take the lead." },
  { id: 'E-005', dimension: 'E', prompt: "I would enjoy thinking of a new idea and finding a way to make it happen." },
  { id: 'E-006', dimension: 'E', prompt: "I would enjoy negotiating when two people want different things." },
  { id: 'E-007', dimension: 'E', prompt: "I would enjoy speaking to a group about a project I care about." },
  { id: 'E-008', dimension: 'E', prompt: "I would enjoy planning how a small project could attract customers, supporters or participants." },
  { id: 'E-009', dimension: 'E', prompt: "I would enjoy taking responsibility for the result of a team project." },
  { id: 'E-010', dimension: 'E', prompt: "I would enjoy identifying an opportunity and deciding what to do next." },
  { id: 'C-001', dimension: 'C', prompt: "I would enjoy organising information so it is easy to find later." },
  { id: 'C-002', dimension: 'C', prompt: "I would enjoy checking details to make sure information is accurate." },
  { id: 'C-003', dimension: 'C', prompt: "I would enjoy creating or maintaining a clear schedule." },
  { id: 'C-004', dimension: 'C', prompt: "I would enjoy sorting information into categories or groups." },
  { id: 'C-005', dimension: 'C', prompt: "I would enjoy following a clear process when completing a task." },
  { id: 'C-006', dimension: 'C', prompt: "I would enjoy keeping records up to date." },
  { id: 'C-007', dimension: 'C', prompt: "I would enjoy working with tables, lists or structured information." },
  { id: 'C-008', dimension: 'C', prompt: "I would enjoy noticing small errors that other people might miss." },
  { id: 'C-009', dimension: 'C', prompt: "I would enjoy arranging steps in the correct order to complete a task efficiently." },
  { id: 'C-010', dimension: 'C', prompt: "I would enjoy making a system that keeps a project organised." },
  ]),
});

const DIMENSION_LABELS = Object.freeze({
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
});

function numericAnswer(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

function sortDimensions(scores) {
  return [...RIASEC_V1.dimensions].sort((a, b) => {
    const scoreDiff = (scores[b] ?? -Infinity) - (scores[a] ?? -Infinity);
    return scoreDiff || RIASEC_V1.dimensions.indexOf(a) - RIASEC_V1.dimensions.indexOf(b);
  });
}

export function validateRiasecAnswers(answers = {}) {
  const valid = {};
  const invalidIds = [];
  for (const item of RIASEC_V1.items) {
    const value = numericAnswer(answers[item.id]);
    if (value === null) invalidIds.push(item.id);
    else valid[item.id] = value;
  }
  return { valid, invalidIds, answered: Object.keys(valid).length, total: RIASEC_V1.items.length };
}

export function scoreRiasecV1(answers = {}, metadata = {}) {
  const { valid, invalidIds, answered, total } = validateRiasecAnswers(answers);
  const completionPercent = Math.round((answered / total) * 100);
  const scored = answered >= 54;
  const profileAvailable = scored;

  const rawScores = Object.fromEntries(RIASEC_V1.dimensions.map((dimension) => [dimension, 0]));
  const answeredByDimension = Object.fromEntries(RIASEC_V1.dimensions.map((dimension) => [dimension, 0]));

  for (const item of RIASEC_V1.items) {
    const value = valid[item.id];
    if (value == null) continue;
    rawScores[item.dimension] += value;
    answeredByDimension[item.dimension] += 1;
  }

  const meanScores = Object.fromEntries(
    RIASEC_V1.dimensions.map((dimension) => {
      const count = answeredByDimension[dimension];
      return [dimension, count ? Number((rawScores[dimension] / count).toFixed(4)) : null];
    }),
  );

  const displayIndex = Object.fromEntries(
    RIASEC_V1.dimensions.map((dimension) => {
      const mean = meanScores[dimension];
      return [dimension, mean == null ? null : Math.round(((mean - 1) / 4) * 100)];
    }),
  );

  const rankedDimensions = profileAvailable
    ? sortDimensions(meanScores.filter ? meanScores : meanScores)
    : [];

  const ordered = profileAvailable
    ? sortDimensions(meanScores).filter((dimension) => meanScores[dimension] != null)
    : [];

  const topThree = ordered.slice(0, 3);
  const topCode = topThree.join('');
  const topTwoSpread = ordered.length >= 2
    ? Number((meanScores[ordered[0]] - meanScores[ordered[1]]).toFixed(4))
    : null;
  const profileSpread = ordered.length
    ? Number((Math.max(...ordered.map((d) => meanScores[d])) - Math.min(...ordered.map((d) => meanScores[d]))).toFixed(4))
    : null;

  let completionStatus = 'incomplete';
  if (answered === total) completionStatus = 'complete';
  else if (answered >= 54) completionStatus = 'provisionally_scorable';

  return {
    instrumentId: RIASEC_V1.instrumentId,
    assessmentVersion: RIASEC_V1.version,
    itemBankVersion: RIASEC_V1.version,
    scoringVersion: '1.0.0-draft',
    submissionId: metadata.submissionId || null,
    startedAt: metadata.startedAt || null,
    completedAt: metadata.completedAt || null,
    completionStatus,
    answered,
    total,
    completionPercent,
    rawResponses: valid,
    rawScores: profileAvailable ? rawScores : null,
    meanScores: profileAvailable ? meanScores : null,
    displayIndex: profileAvailable ? displayIndex : null,
    rankedDimensions: profileAvailable ? ordered : [],
    topThree,
    topCode: profileAvailable ? topCode : null,
    topTwoSpread,
    profileSpread,
    dimensionLabels: DIMENSION_LABELS,
    invalidItemIds: invalidIds,
    responseQuality: {
      incompleteItemCount: invalidIds.length,
      allItemsAnswered: answered === total,
      qualityFlags: [],
      note: 'Quality flags require interpretation alongside completion/time data; they do not label response truthfulness.',
    },
  };
}

export function buildRiasecSnapshot(score) {
  if (!score || !score.meanScores) {
    return {
      available: false,
      reason: 'RIASEC profile is not yet scorable.',
    };
  }

  return {
    available: true,
    assessmentVersion: score.assessmentVersion,
    completedAt: score.completedAt,
    topCode: score.topCode,
    strongestSignals: score.rankedDimensions.slice(0, 3).map((dimension) => ({
      dimension,
      label: DIMENSION_LABELS[dimension],
      mean: score.meanScores[dimension],
      index: score.displayIndex[dimension],
    })),
    allDimensions: RIASEC_V1.dimensions.map((dimension) => ({
      dimension,
      label: DIMENSION_LABELS[dimension],
      mean: score.meanScores[dimension],
      index: score.displayIndex[dimension],
    })),
    spread: score.profileSpread,
    topTwoSpread: score.topTwoSpread,
  };
}
