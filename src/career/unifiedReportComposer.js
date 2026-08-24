/**
 * VidyaVantage Unified Bundle Report Composer
 *
 * A bundle is ONE report, not a collection of individual reports.
 * Every selected assessment family contributes evidence to the same report
 * narrative, while unselected families are never represented as completed.
 *
 * The complete five-family bundle also carries an embedded guidance layer for
 * decision readiness, work-environment preferences and adaptability. These are
 * not separate commercial tests.
 */

import { TEST_FAMILIES, getTestBundle } from './testBundleCatalogue';

const FAMILY_SECTIONS = Object.freeze({
  interest: { id:'interest_profile', title:'Career Interest Profile', domains:['riasec'], summary:'Explores the activities, environments and career themes that appear most interesting to the student.' },
  personality: { id:'personality_profile', title:'Personality Tendencies', domains:['big5'], summary:'Describes personality tendencies that may influence preferred ways of learning, working and interacting.' },
  aptitude_skills: { id:'aptitude_skills', title:'Aptitude & Skills Profile', domains:['reasoning','skills'], summary:'Brings together observed reasoning performance and available skills evidence without treating the result as an IQ score.' },
  work_values: { id:'work_values', title:'Work Values Profile', domains:['values'], summary:'Identifies the conditions, priorities and outcomes the student values in education and work.' },
  learning: { id:'learning_preferences', title:'Learning Preferences', domains:['learning'], summary:'Describes preferred learning conditions and study approaches without assigning a fixed learning-style label.' }
});

const GUIDANCE_LAYER = Object.freeze({
  id:'career_guidance_indicators',
  title:'Career Guidance Indicators',
  domains:['readiness','environment','adaptability'],
  summary:'Embedded guidance indicators covering current career-decision readiness, preferred work conditions and adaptability. These are developmental indicators, not diagnoses or fixed traits.'
});

const INTEGRATION_SECTIONS = Object.freeze([
  { id:'integrated_snapshot', title:'Integrated Career Snapshot', required:true, summary:'A single synthesis of the evidence contributed by the selected assessment families.' },
  { id:'career_interpretation', title:'What the Pattern May Mean for Career Exploration', required:true, summary:'Connects the selected evidence into career-exploration implications rather than issuing a single career verdict.' },
  { id:'pathway_alignment', title:'Career & Education Pathway Alignment', required:true, summary:'Uses the combined profile to identify pathways worth investigating and the evidence that supports each exploration direction.' },
  { id:'development_priorities', title:'Development Priorities', required:true, summary:'Identifies practical areas to strengthen based on the combined profile.' },
  { id:'action_roadmap', title:'90-Day Career Action Roadmap', required:true, summary:'Turns the integrated profile into concrete next steps.' },
  { id:'professional_review', title:'Counsellor Review & Reflection', required:true, summary:'Provides prompts for counsellor-led discussion and student reflection.' }
]);

function unique(items) { return [...new Set(items.filter(Boolean))]; }

export function composeUnifiedReport({ bundleId, report, completedFamilyIds } = {}) {
  const bundle = getTestBundle(bundleId);
  if (!bundle) throw new Error(`Unknown assessment bundle: ${bundleId}`);

  const familyIds = unique(completedFamilyIds?.length ? completedFamilyIds : bundle.familyIds).filter(id => bundle.familyIds.includes(id));
  const includedFamilies = familyIds.map(id => ({ id, title:TEST_FAMILIES[id].title, shortTitle:TEST_FAMILIES[id].shortTitle, contribution:FAMILY_SECTIONS[id] }));
  const evidenceDomains = unique(includedFamilies.flatMap(f => f.contribution?.domains || []));
  const moduleSections = includedFamilies.map(f => ({ ...f.contribution, familyId:f.id, familyTitle:f.title, evidenceDomains:f.contribution?.domains || [] }));
  const isFullBundle = bundle.familyCount === 5;
  const guidanceAvailable = isFullBundle && report?.scores && (
    report.scores.readinessPercent != null ||
    (report.scores.environment && Object.keys(report.scores.environment).length > 0) ||
    report.scores.adaptabilityPercent != null
  );
  const sections = [
    ...INTEGRATION_SECTIONS.map(section => ({ ...section, kind:'integration' })),
    ...moduleSections.map(section => ({ ...section, kind:'assessment_evidence' }))
  ];
  if (guidanceAvailable) sections.splice(1,0,{ ...GUIDANCE_LAYER, kind:'embedded_guidance_evidence', familyId:null, evidenceDomains:GUIDANCE_LAYER.domains });

  return {
    type:'vidyavantage_unified_bundle_report', version:'1.1.0', bundleId:bundle.id, bundleTitle:bundle.title,
    familyCount:familyIds.length, familyIds, includedFamilies, evidenceDomains:unique([...evidenceDomains,...(guidanceAvailable?GUIDANCE_LAYER.domains:[])]),
    guidanceLayer: isFullBundle ? { included:true, assessed:Boolean(guidanceAvailable), domains:GUIDANCE_LAYER.domains } : { included:false, assessed:false, domains:[] },
    unified:true, singleDocument:true, singleNarrative:true, singleIntegratedReport:true,
    reportPages:bundle.reportPages, estimatedAssessmentMinutes:bundle.durationMinutes, questionCount:bundle.questionCount || null, report,
    sections,
    integrationRules:{ neverCreateSeparateReports:true, neverDuplicateSharedSections:true, neverShowUnselectedFamilyAsCompleted:true, synthesiseBeforeRecommending:true, useOneCoverPage:true, useOneExecutiveSummary:true, useOneCareerRecommendationLayer:true, useOneActionRoadmap:true, useOneDisclaimer:true, appendOnlyWhenBundleExpands:true, preserveCompletedEvidence:true, guidanceIndicatorsAreDevelopmental:true }
  };
}

export function mergeBundleReports(existingReport, addedBundleId, completedFamilyIds = []) { return composeUnifiedReport({ bundleId:addedBundleId, report:existingReport, completedFamilyIds }); }
export function getIntegratedReportLabel(bundleId) { const bundle=getTestBundle(bundleId); return bundle?.familyCount>1 ? `${bundle.title} · Integrated Career Intelligence Report` : `${bundle?.title || 'Career Assessment'} · Career Intelligence Report`; }
