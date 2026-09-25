import test from 'node:test';
import assert from 'node:assert/strict';
import {createAssessmentResultRecord,validateAssessmentResultRecord,createAssessmentResponse,createAssessmentScore,appendAssessmentAuditEvent,transitionAssessmentResult} from '../../src/platform/assessmentResultRecord.js';

test('creates a versioned result with canonical identity linkage',()=>{
  const result=createAssessmentResultRecord({id:'assessment-result-1',personId:'person-1',accountId:'account-1',instrumentId:'CAREER-INTEREST-RIASEC',instrumentVersion:'1.0.0-draft',itemBankVersion:'1.0.0',scoringVersion:'1.0.0-draft'});
  assert.equal(result.schemaVersion,'1.0.0');
  assert.equal(result.personId,'person-1');
  assert.equal(result.instrument.instrumentId,'CAREER-INTEREST-RIASEC');
});

test('requires version metadata for reproducibility',()=>{
  assert.throws(()=>createAssessmentResultRecord({personId:'person-1',instrumentId:'CAREER-INTEREST-RIASEC',instrumentVersion:'1.0.0'}),/itemBankVersion/);
});

test('validates result shape with response and score records',()=>{
  const result=createAssessmentResultRecord({personId:'person-1',instrumentId:'CAREER-INTEREST-RIASEC',instrumentVersion:'1.0.0-draft',itemBankVersion:'1.0.0',scoringVersion:'1.0.0-draft',responses:[createAssessmentResponse({itemId:'R-001',responseValue:5,itemVersion:'1.0.0'})],scores:[createAssessmentScore({construct:'RIASEC',subscale:'R',rawScore:42,displayScore:80,scoringVersion:'1.0.0-draft'})]});
  assert.equal(validateAssessmentResultRecord(result).valid,true);
});

test('audit append returns a new record and preserves prior record',()=>{
  const result=createAssessmentResultRecord({personId:'person-1',instrumentId:'CAREER-INTEREST-RIASEC',instrumentVersion:'1.0.0-draft',itemBankVersion:'1.0.0',scoringVersion:'1.0.0-draft'});
  const updated=appendAssessmentAuditEvent(result,{action:'attempt_created',actorPersonId:'person-admin'});
  assert.equal(updated.audit.length,1);
  assert.equal(result.audit.length,0);
});

test('status transitions preserve the same result identity',()=>{
  const result=createAssessmentResultRecord({id:'assessment-result-1',personId:'person-1',instrumentId:'CAREER-INTEREST-RIASEC',instrumentVersion:'1.0.0-draft',itemBankVersion:'1.0.0',scoringVersion:'1.0.0-draft'});
  const started=transitionAssessmentResult(result,'started');
  const submitted=transitionAssessmentResult(started,'submitted',{completionPercent:100});
  assert.equal(submitted.id,'assessment-result-1');
  assert.equal(submitted.status,'submitted');
  assert.equal(submitted.attempt.completionPercent,100);
  assert.ok(submitted.attempt.startedAt);
  assert.ok(submitted.attempt.submittedAt);
});

test('rejects assessment status regression',()=>{
  const result=createAssessmentResultRecord({id:'assessment-result-1',personId:'person-1',instrumentId:'CAREER-INTEREST-RIASEC',instrumentVersion:'1.0.0-draft',itemBankVersion:'1.0.0',scoringVersion:'1.0.0-draft'});
  const started=transitionAssessmentResult(result,'started');
  assert.throws(()=>transitionAssessmentResult(started,'created'),/Invalid assessment status transition/);
});
