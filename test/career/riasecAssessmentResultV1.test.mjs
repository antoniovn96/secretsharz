import test from 'node:test';
import assert from 'node:assert/strict';
import { RIASEC_V1, scoreRiasecV1 } from '../../src/career/riasecInterestExplorerV1.js';
import { buildRiasecAssessmentResultV1 } from '../../src/career/riasecAssessmentResultV1.js';

test('maps a completed RIASEC result to the canonical assessment record',()=>{
 const answers=Object.fromEntries(RIASEC_V1.items.map((item)=>[item.id,3]));
 const scored=scoreRiasecV1(answers,{startedAt:'2026-09-25T08:00:00Z',completedAt:'2026-09-25T08:15:00Z'});
 const record=buildRiasecAssessmentResultV1({score:scored,personId:'person-1',accountId:'account-1'});
 assert.equal(record.personId,'person-1');
 assert.equal(record.status,'scored');
 assert.equal(record.instrument.instrumentId,'CAREER-INTEREST-RIASEC');
 assert.equal(record.responses.length,60);
 assert.equal(record.scores.length,6);
 assert.equal(record.scores[0].transformedScore,3);
 assert.ok(record.attempt.scoredAt);
});

test('incomplete RIASEC result remains non-final in the canonical record',()=>{
 const answers=Object.fromEntries(RIASEC_V1.items.slice(0,53).map((item)=>[item.id,3]));
 const scored=scoreRiasecV1(answers);
 const record=buildRiasecAssessmentResultV1({score:scored,personId:'person-1'});
 assert.equal(record.status,'started');
 assert.equal(record.attempt.completionPercent<100,true);
});