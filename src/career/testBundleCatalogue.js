/**
 * VidyaVantage Test Bundle Catalogue
 *
 * Five independent assessment families produce 2^5 - 1 = 31 possible
 * non-empty combinations. A bundle is one continuous assessment experience:
 * modules are composed behind the scenes, then interpreted into one integrated
 * result/report. Users are never sent through separate checkout/report flows
 * simply because more than one family is included.
 *
 * IMPORTANT:
 * - "Learning Preferences" is used instead of a fixed learning-style claim.
 * - Aptitude is a reasoning sampler; it does not produce an IQ score.
 * - Scores are exploratory career-guidance evidence, not diagnosis or destiny.
 */

export const TEST_BUNDLE_CATALOGUE_VERSION = '1.0.0';

export const TEST_FAMILIES = Object.freeze({
  interest: {
    id: 'interest',
    sku: 'TEST_INTEREST',
    title: 'Career Interest Inventory',
    shortTitle: 'Career Interests',
    description: 'Maps vocational interests using RIASEC-oriented career exploration dimensions.',
    durationMinutes: { min: 20, max: 25 },
    estimatedMinutes: 23,
    reportOutput: [
      'Interest profile and strongest interest themes',
      'Career-cluster alignment',
      'Activities and environments likely to sustain interest',
      'Career directions to explore'
    ],
    bestFor: ['career exploration', 'stream exploration', 'career discovery'],
    scientificNote: 'Exploratory vocational-interest information; it does not determine a career.',
    assessmentModuleIds: ['career_interest_inventory']
  },

  personality: {
    id: 'personality',
    sku: 'TEST_PERSONALITY',
    title: 'Personality Profile',
    shortTitle: 'Personality',
    description: 'Describes Big Five personality tendencies and how they may relate to preferred work and study environments.',
    durationMinutes: { min: 15, max: 20 },
    estimatedMinutes: 18,
    reportOutput: [
      'Big Five tendency profile',
      'Likely work and learning preferences',
      'Strengths and watch-outs for career environments',
      'Career-environment compatibility insights'
    ],
    bestFor: ['self-understanding', 'career fit', 'work-environment exploration'],
    scientificNote: 'Describes tendencies; it is not a clinical personality diagnosis.',
    assessmentModuleIds: ['personality_profile']
  },

  aptitude_skills: {
    id: 'aptitude_skills',
    sku: 'TEST_APTITUDE_SKILLS',
    title: 'Aptitude & Skills Assessment',
    shortTitle: 'Aptitude & Skills',
    description: 'Combines a reasoning sampler with an evidence-based skills profile. Aptitude reflects observed task performance; skills reflect what the user reports and/or demonstrates.',
    durationMinutes: { min: 30, max: 40 },
    estimatedMinutes: 35,
    reportOutput: [
      'Verbal, numerical, logical and analytical reasoning profile',
      'Skill inventory and evidence status',
      'Strengths and development areas',
      'Career and education implications'
    ],
    bestFor: ['academic planning', 'career fit', 'skills-gap planning', 'professional transitions'],
    scientificNote: 'The reasoning sampler is not an IQ test and does not establish a standardized IQ score.',
    assessmentModuleIds: ['career_aptitude_sampler']
  },

  work_values: {
    id: 'work_values',
    sku: 'TEST_WORK_VALUES',
    title: 'Work Values Assessment',
    shortTitle: 'Work Values',
    description: 'Identifies the conditions and outcomes the person values most in education and work.',
    durationMinutes: { min: 10, max: 15 },
    estimatedMinutes: 13,
    reportOutput: [
      'Top career and work values',
      'Value priorities and trade-offs',
      'Potential sources of career satisfaction',
      'Career environments aligned with stated priorities'
    ],
    bestFor: ['career choice', 'career change', 'work satisfaction', 'parent discussions'],
    scientificNote: 'Values are preferences and priorities, not fixed predictions of future satisfaction.',
    assessmentModuleIds: ['work_values_assessment']
  },

  learning: {
    id: 'learning',
    sku: 'TEST_LEARNING_PREFERENCES',
    title: 'Learning Preferences Evaluation',
    shortTitle: 'Learning Preferences',
    description: 'Identifies preferred learning conditions, study approaches and educational environments without treating learners as fixed learning-style types.',
    durationMinutes: { min: 10, max: 15 },
    estimatedMinutes: 13,
    reportOutput: [
      'Preferred learning conditions',
      'Study and practice preferences',
      'Potentially supportive educational environments',
      'Practical study recommendations'
    ],
    bestFor: ['school students', 'college planning', 'study planning', 'professional upskilling'],
    scientificNote: 'Reports learning preferences, not a fixed learning style or a prescription for how someone must be taught.',
    assessmentModuleIds: ['learning_preferences']
  }
});

const FAMILY_ORDER = ['interest', 'personality', 'aptitude_skills', 'work_values', 'learning'];

const titleJoin = ids => ids.map(id => TEST_FAMILIES[id].shortTitle).join(' + ');

const integratedOutputs = ids => {
  const outputs = [];
  ids.forEach(id => {
    TEST_FAMILIES[id].reportOutput.forEach(output => {
      if (!outputs.includes(output)) outputs.push(output);
    });
  });
  return outputs;
};

const recommendedUses = ids => {
  const uses = [];
  ids.forEach(id => {
    TEST_FAMILIES[id].bestFor.forEach(use => {
      if (!uses.includes(use)) uses.push(use);
    });
  });
  return uses;
};

/**
 * Combined tests run as ONE continuous assessment. The estimate includes a
 * small integration allowance rather than treating each test as a separate
 * appointment. The UI should present one progress bar and one final submit.
 */
const calculateUnifiedDuration = ids => {
  const raw = ids.reduce((sum, id) => sum + TEST_FAMILIES[id].estimatedMinutes, 0);
  const integrationEfficiency = ids.length > 1 ? 0.92 : 1;
  return Math.max(10, Math.round(raw * integrationEfficiency));
};

const reportPagesFor = count => ({
  1: 6,
  2: 9,
  3: 12,
  4: 16,
  5: 20
}[count]);

const bundleIdFor = ids => `bundle_${ids.join('__')}`;

/**
 * Generates every non-empty subset of the five test families.
 * 2^5 - 1 = 31 bundles, deliberately including all five single-test bundles
 * and the complete five-test Career Intelligence bundle.
 */
export const TEST_BUNDLES = Object.freeze(
  FAMILY_ORDER.flatMap((_, start) => {
    const bundles = [];
    for (let mask = 1; mask < (1 << FAMILY_ORDER.length); mask += 1) {
      const ids = FAMILY_ORDER.filter((__, index) => mask & (1 << index));
      if (ids.length !== start + 1) continue;
      bundles.push({
        id: bundleIdFor(ids),
        sku: `BUNDLE_${ids.map(id => TEST_FAMILIES[id].sku.replace('TEST_', '')).join('_')}`,
        title: ids.length === 5 ? 'Full Career Intelligence Test Bundle' : titleJoin(ids),
        familyIds: ids,
        familyCount: ids.length,
        unified: true,
        deliveryMode: 'single_continuous_assessment',
        singleProgressBar: true,
        singleSubmission: true,
        singleIntegratedReport: true,
        durationMinutes: calculateUnifiedDuration(ids),
        durationLabel: `${calculateUnifiedDuration(ids)} minutes estimated`,
        reportPages: reportPagesFor(ids.length),
        reportType: ids.length === 5 ? 'full_career_intelligence' : 'integrated_test_bundle',
        reportOutputs: integratedOutputs(ids),
        recommendedUses: recommendedUses(ids),
        assessmentModuleIds: ids.flatMap(id => TEST_FAMILIES[id].assessmentModuleIds),
        scientificNotes: ids.map(id => TEST_FAMILIES[id].scientificNote),
        upgradePath: ids.length < 5 ? 'Can be expanded later using already-valid completed modules; do not retest completed modules solely because the bundle expands.' : null
      });
    }
    return bundles;
  })
);

export const TEST_BUNDLE_COUNT = TEST_BUNDLES.length;

export function getTestFamily(familyId) {
  return TEST_FAMILIES[familyId] || null;
}

export function getTestBundle(bundleId) {
  return TEST_BUNDLES.find(bundle => bundle.id === bundleId) || null;
}

export function getBundlesContainingFamilies(familyIds = []) {
  const required = new Set(familyIds);
  return TEST_BUNDLES.filter(bundle => familyIds.length === bundle.familyCount && familyIds.every(id => required.has(id)));
}

export function getBundleByFamilies(familyIds = []) {
  const normalized = [...new Set(familyIds)].sort((a, b) => FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b));
  return TEST_BUNDLES.find(bundle => bundle.familyIds.join('|') === normalized.join('|')) || null;
}

export function getBundleForCompletedFamilies(completedFamilyIds = []) {
  const completed = new Set(completedFamilyIds);
  return TEST_BUNDLES
    .filter(bundle => bundle.familyIds.every(id => completed.has(id)))
    .sort((a, b) => b.familyCount - a.familyCount)[0] || null;
}

export function getAdditionalFamiliesForBundle(bundleId, completedFamilyIds = []) {
  const bundle = getTestBundle(bundleId);
  if (!bundle) return [];
  const completed = new Set(completedFamilyIds);
  return bundle.familyIds.filter(id => !completed.has(id));
}

export function getBundleCoverageSummary() {
  const byCount = {};
  TEST_BUNDLES.forEach(bundle => {
    byCount[bundle.familyCount] = (byCount[bundle.familyCount] || 0) + 1;
  });
  return {
    version: TEST_BUNDLE_CATALOGUE_VERSION,
    familyCount: FAMILY_ORDER.length,
    bundleCount: TEST_BUNDLES.length,
    expectedBundleCount: (2 ** FAMILY_ORDER.length) - 1,
    complete: TEST_BUNDLES.length === (2 ** FAMILY_ORDER.length) - 1,
    combinationsByFamilyCount: byCount
  };
}
