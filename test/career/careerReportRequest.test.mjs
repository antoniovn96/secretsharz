import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchInstitutionCareerReport } from '../../src/institution/careerReportRequest.js';

test('requests the institution report with encoded identifiers and bearer token',async()=>{let called;const payload={student:{fullName:'A'},report:{},coverage:{}};const result=await fetchInstitutionCareerReport({institutionId:'inst/1',rosterId:'row 1',getToken:async()=> 'token',fetchImpl:async(url,options)=>{called={url,options};return {ok:true,json:async()=>payload};}});assert.deepEqual(result,payload);assert.match(called.url,/institutionId=inst%2F1/);assert.match(called.url,/rosterId=row%201/);assert.equal(called.options.headers.Authorization,'Bearer token');});
test('surfaces server report errors',async()=>{await assert.rejects(()=>fetchInstitutionCareerReport({institutionId:'i',rosterId:'r',getToken:async()=> 't',fetchImpl:async()=>({ok:false,json:async()=>({error:'Report is not ready.'})})}),/Report is not ready/);});
