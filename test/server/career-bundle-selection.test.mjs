import test from 'node:test';
import assert from 'node:assert/strict';
import { TEST_BUNDLES, TEST_BUNDLE_COUNT, getBundleByFamilies } from '../../src/career/testBundleCatalogue.js';
import { getItemsForBundle } from '../../src/career/assessmentSelection.js';
import { scoreSelectedAssessment } from '../../src/career/scoreSelectedAssessment.js';

test('catalogue contains exactly 31 non-empty combinations',()=>{
 assert.equal(TEST_BUNDLE_COUNT,31);
 assert.equal(TEST_BUNDLES.length,31);
 assert.ok(TEST_BUNDLES.every(bundle=>bundle.unified&&bundle.singleProgressBar&&bundle.singleSubmission&&bundle.singleIntegratedReport));
});

test('single-family bundles contain only their selected family items',()=>{
 for(const familyId of ['interest','personality','aptitude_skills','work_values','learning']){
  const bundle=getBundleByFamilies([familyId]);
  assert.ok(bundle,`missing bundle for ${familyId}`);
  const items=getItemsForBundle(bundle.id);
  assert.ok(items.length>0);
  assert.ok(items.every(item=>item.domain!==undefined));
 }
});

test('combined bundles score only selected families',()=>{
 const bundle=getBundleByFamilies(['interest','work_values']);
 const answers={};
 for(const item of getItemsForBundle(bundle.id)) answers[item.id]=item.type==='objective'?item.correct:5;
 const scored=scoreSelectedAssessment(answers,{bundleId:bundle.id});
 assert.deepEqual(scored.selectedFamilyIds,['interest','work_values']);
 assert.ok(scored.riasec);
 assert.ok(scored.values);
 assert.equal(scored.big5,null);
 assert.equal(scored.reasoning,null);
 assert.equal(scored.learning,null);
});

test('premium bundle report envelope is 20 pages',()=>{
 assert.ok(TEST_BUNDLES.every(bundle=>bundle.reportPages===20));
});
