import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptGuardianRelationship } from '../../src/security/guardianRelationshipAcceptance.js';

function makeDb({ relatedPersonId='p1', status='pending', type='parent', consentRequired=true, ageBand='13_17' }={}) {
  const relationship = { subjectPersonId:'s1', relatedPersonId, status, type, consentRequired, startsAt:null };
  return {
    collection(name){
      if(name==='relationships') return { doc(){ return { async get(){ return {exists:true,data:()=>relationship}; } }; } };
      if(name==='users') return { doc(){ return { async get(){ return {exists:true,data:()=>({ageBand, dateOfBirth:'2012-01-01'})}; } }; } };
      throw new Error(`Unexpected collection ${name}`);
    },
    async runTransaction(fn){
      const tx={
        async get(ref){return ref.get();},
        update(_ref, patch){Object.assign(relationship,patch);},
      };
      return fn(tx);
    },
  };
}

test('only invited guardian can accept pending relationship', async()=>{
  await assert.rejects(()=>acceptGuardianRelationship({db:makeDb({relatedPersonId:'other'}),guardianId:'p1',relationshipId:'r1'}),/invited guardian/);
});

test('active relationship cannot be accepted again', async()=>{
  await assert.rejects(()=>acceptGuardianRelationship({db:makeDb({status:'active'}),guardianId:'p1',relationshipId:'r1'}),/pending/);
});

test('valid invited guardian can accept pending relationship', async()=>{
  const result=await acceptGuardianRelationship({db:makeDb(),guardianId:'p1',relationshipId:'r1'});
  assert.equal(result.status,'active');
  assert.equal(result.relatedPersonId,'p1');
});
