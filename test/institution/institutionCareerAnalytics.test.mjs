import assert from 'node:assert/strict';
import { careerStatusCounts, careerFollowUpQueue, careerClassAnalytics, careerAnalyticsSummary } from '../../src/institution/institutionCareerAnalytics.js';
const students=[{assessmentStatus:'not_started',className:'10'},{assessmentStatus:'in_progress',className:'10'},{assessmentStatus:'completed',className:'10'},{assessmentStatus:'completed',className:'11'}];
assert.deepEqual(careerStatusCounts(students),{not_started:1,in_progress:1,completed:2});
assert.equal(careerFollowUpQueue(students).length,2);
assert.equal(careerClassAnalytics(students).find(x=>x.name==='10').completed,1);
assert.deepEqual(careerAnalyticsSummary(students,{reportsReady:2}),{total:4,started:3,completed:2,reportsReady:2,participationPercent:75,completionPercent:50,followUpCount:2});
console.log('institutionCareerAnalytics.test.mjs passed');
