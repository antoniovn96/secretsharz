import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';

test('admin contract does not infer unsupported premium sections from context or generic career matches',()=>{
 const report={
   bundleTitle:'Full Career Intelligence Test Bundle',
   intake:{stream:'Commerce',goal:'Choose a college'},
   scores:{riasecCode:'RIA',big5:{O:4,C:3,E:2,A:4,N:2},values:{autonomy:5}},
   careerExploration:[{name:'Designer',explorationIndex:82}],
   reflection:{statement:'Explore carefully.',recommendedNextStep:'Research three pathways.'}
 };
 const rows=Object.fromEntries(buildInstitutionCareerReflection(report).map(row=>[row.id,row]));
 assert.equal(rows.executive_snapshot.available,true);
 assert.equal(rows.developmental_context.available,true);
 assert.equal(rows.interest_personality.available,true);
 assert.equal(rows.riasec_profile.available,true);
 assert.equal(rows.personality_profile.available,true);
 assert.equal(rows.career_values.available,true);
 assert.equal(rows.career_directions.available,true);
 assert.equal(rows.top_career_directions.available,false);
 assert.equal(rows.alternative_careers.available,false);
 assert.equal(rows.stream_analysis.available,false);
 assert.equal(rows.education_roadmap.available,false);
 assert.equal(rows.work_environment.available,false);
 assert.equal(rows.decision_readiness.available,false);
 assert.equal(rows.adaptability.available,false);
});

test('empty report exposes no institutional report-section evidence',()=>{
 const rows=buildInstitutionCareerReflection({});
 assert.equal(rows.some(row=>row.available),false);
});
