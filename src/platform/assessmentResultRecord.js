// Secret Sharz — Canonical Assessment Result Record V1
// Pure application contract. No database/provider code.

export const ASSESSMENT_RESULT_SCHEMA_VERSION = '1.0.0';
export const ATTEMPT_STATUSES = Object.freeze(['created','started','submitted','scored','reported','abandoned','invalidated','superseded']);
export const ASSESSMENT_RESULT_AUDIENCES = Object.freeze(['student','parent_guardian','institution','teacher','counsellor_coach','administrator']);

function isPlainObject(value){ return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function asNullableString(value){ return value == null || value === '' ? null : String(value); }
function asIsoOrNull(value){ if(value == null || value === '') return null; const date=value instanceof Date ? value : new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString(); }
function clone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
function requireField(value,name){ if(value == null || value === '') throw new Error('Assessment result requires ' + name); }

export function createAssessmentResultRecord(input = {}) {
  requireField(input.personId,'personId');
  requireField(input.instrumentId,'instrumentId');
  requireField(input.instrumentVersion,'instrumentVersion');
  requireField(input.itemBankVersion,'itemBankVersion');
  requireField(input.scoringVersion,'scoringVersion');
  const now=asIsoOrNull(input.createdAt)||new Date().toISOString();
  return {
    schemaVersion:ASSESSMENT_RESULT_SCHEMA_VERSION,
    id:asNullableString(input.id),
    personId:String(input.personId),
    accountId:asNullableString(input.accountId),
    institutionRelationshipId:asNullableString(input.institutionRelationshipId),
    serviceEngagementId:asNullableString(input.serviceEngagementId),
    status:input.status||'created',
    attempt:{startedAt:asIsoOrNull(input.startedAt),submittedAt:asIsoOrNull(input.submittedAt),scoredAt:asIsoOrNull(input.scoredAt),reportedAt:asIsoOrNull(input.reportedAt),completionPercent:Number.isFinite(Number(input.completionPercent))?Number(input.completionPercent):0,attemptNumber:Number.isInteger(input.attemptNumber)?input.attemptNumber:1,abandonmentReason:asNullableString(input.abandonmentReason),invalidationReason:asNullableString(input.invalidationReason)},
    instrument:{instrumentId:String(input.instrumentId),instrumentVersion:String(input.instrumentVersion),itemBankVersion:String(input.itemBankVersion),scoringVersion:String(input.scoringVersion),reportVersion:asNullableString(input.reportVersion),normVersion:asNullableString(input.normVersion),algorithmVersion:asNullableString(input.algorithmVersion),language:asNullableString(input.language),locale:asNullableString(input.locale)},
    responses:Array.isArray(input.responses)?clone(input.responses):[],
    scores:Array.isArray(input.scores)?clone(input.scores):[],
    evidenceQuality:isPlainObject(input.evidenceQuality)?clone(input.evidenceQuality):{},
    contextSnapshot:isPlainObject(input.contextSnapshot)?clone(input.contextSnapshot):{},
    reports:Array.isArray(input.reports)?clone(input.reports):[],
    longitudinal:{previousAssessmentResultId:asNullableString(input.previousAssessmentResultId),reassessmentReason:asNullableString(input.reassessmentReason),recommendedRetakeDate:asIsoOrNull(input.recommendedRetakeDate),sequence:Number.isInteger(input.longitudinalSequence)?input.longitudinalSequence:1},
    entitlement:{entitlementId:asNullableString(input.entitlementId),orderId:asNullableString(input.orderId)},
    audit:Array.isArray(input.audit)?clone(input.audit):[],
    createdAt:now,updatedAt:asIsoOrNull(input.updatedAt)||now,
  };
}

export function validateAssessmentResultRecord(record){
  const errors=[];
  if(!isPlainObject(record)) errors.push('record must be an object');
  if(!record?.personId) errors.push('personId is required');
  if(!record?.instrument?.instrumentId) errors.push('instrument.instrumentId is required');
  if(!record?.instrument?.instrumentVersion) errors.push('instrument.instrumentVersion is required');
  if(!record?.instrument?.itemBankVersion) errors.push('instrument.itemBankVersion is required');
  if(!record?.instrument?.scoringVersion) errors.push('instrument.scoringVersion is required');
  if(!ATTEMPT_STATUSES.includes(record?.status)) errors.push('status is invalid');
  const completion=Number(record?.attempt?.completionPercent);
  if(!Number.isFinite(completion)||completion<0||completion>100) errors.push('attempt.completionPercent must be between 0 and 100');
  if(!Array.isArray(record?.responses)) errors.push('responses must be an array');
  if(!Array.isArray(record?.scores)) errors.push('scores must be an array');
  if(!Array.isArray(record?.reports)) errors.push('reports must be an array');
  return {valid:errors.length===0,errors};
}

export function createAssessmentResponse(input={}){
  requireField(input.itemId,'response.itemId');
  return {itemId:String(input.itemId),itemVersion:asNullableString(input.itemVersion),responseValue:clone(input.responseValue),responseType:asNullableString(input.responseType),responseTimestamp:asIsoOrNull(input.responseTimestamp),responseDurationMs:Number.isFinite(Number(input.responseDurationMs))?Number(input.responseDurationMs):null,presentationOrder:Number.isInteger(input.presentationOrder)?input.presentationOrder:null};
}

export function createAssessmentScore(input={}){
  requireField(input.construct,'score.construct');
  return {construct:String(input.construct),subscale:asNullableString(input.subscale),rawScore:input.rawScore??null,transformedScore:input.transformedScore??null,displayScore:input.displayScore??null,scoringVersion:asNullableString(input.scoringVersion),interpretationStatus:asNullableString(input.interpretationStatus),normativeReference:isPlainObject(input.normativeReference)?clone(input.normativeReference):null};
}

export function appendAssessmentAuditEvent(record,event={}){
  if(!isPlainObject(record)) throw new Error('record is required');
  requireField(event.action,'audit.action');
  const next=clone(record);
  next.audit=Array.isArray(next.audit)?next.audit:[];
  next.audit.push({eventId:asNullableString(event.eventId),action:String(event.action),actorPersonId:asNullableString(event.actorPersonId),actorAccountId:asNullableString(event.actorAccountId),occurredAt:asIsoOrNull(event.occurredAt)||new Date().toISOString(),purpose:asNullableString(event.purpose),outcome:asNullableString(event.outcome)});
  next.updatedAt=new Date().toISOString();
  return next;
}

export function transitionAssessmentResult(record,nextStatus,metadata={}){
  if(!ATTEMPT_STATUSES.includes(nextStatus)) throw new Error('Unknown assessment attempt status: '+nextStatus);
  const next=clone(record);
  next.status=nextStatus;
  if(nextStatus==='started') next.attempt.startedAt=next.attempt.startedAt||new Date().toISOString();
  if(nextStatus==='submitted') next.attempt.submittedAt=next.attempt.submittedAt||new Date().toISOString();
  if(nextStatus==='scored') next.attempt.scoredAt=next.attempt.scoredAt||new Date().toISOString();
  if(nextStatus==='reported') next.attempt.reportedAt=next.attempt.reportedAt||new Date().toISOString();
  if(metadata.completionPercent!=null) next.attempt.completionPercent=Number(metadata.completionPercent);
  next.updatedAt=new Date().toISOString();
  return next;
}

export default {createAssessmentResultRecord,validateAssessmentResultRecord,createAssessmentResponse,createAssessmentScore,appendAssessmentAuditEvent,transitionAssessmentResult};