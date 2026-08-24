import assert from 'node:assert/strict';
import { careerAnalyticsSummary, careerStatusCounts, careerFollowUpQueue, careerClassAnalytics } from '../../src/institution/institutionCareerAnalytics.js';
const students=[{assessmentStatus:'not_started',className:'10'},{assessmentStatus:'in_progress',className:'10'},{assessmentStatus:'completed',className:'10'},{assessmentStatus:'completed',className:'11'}];
const summary={total:4,claimed:3,started:3,completed:2,reportsReady:2};
const analytics={summary:careerAnalyticsSummary(students,summary),statusCounts:careerStatusCounts(students),followUpCount:careerFollowUpQueue(students).length,classBreakdown:careerClassAnalytics(students)};
assert.equal(analytics.summary.participationPercent,75);assert.equal(analytics.summary.completionPercent,50);assert.equal(analytics.statusCounts.in_progress,1);assert.equal(analytics.followUpCount,2);assert.equal(analytics.classBreakdown.length,2);
console.log('dashboardAnalyticsContract.test.mjs passed');
