import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileStudentLifeStage } from '../../src/security/lifeStageReconciler.js';

function makeDb({ dateOfBirth, lifecycle = {}, ageBand } = {}) {
  const user = { dateOfBirth, lifecycle, ageBand };
  const writes = [];
  const userRef = { async get(){ return { exists:true, data:()=>user }; } };
  return {
    writes,
    collection(name){
      if(name==='users') return { doc(){ return userRef; } };
      if(name==='auditEvents') return { doc(){ const ref={id:'audit-1'}; return ref; } };
      throw new Error(`Unexpected collection ${name}`);
    },
    async runTransaction(fn){
      const tx={ async get(ref){return ref.get();}, set(ref,value){writes.push({ref,value}); Object.assign(user,value.lifecycle||{}); if(value.ageBand) user.ageBand=value.ageBand;} };
      await fn(tx);
    },
  };
}

test('reconciliation is idempotent when age band is unchanged', async()=>{
  const db=makeDb({dateOfBirth:'2010-01-01',ageBand:'13_17'});
  const result=await reconcileStudentLifeStage({db,studentId:'s1'});
  assert.equal(result.changed,false);
});

test('reconciliation records an age-band transition', async()=>{
  const db=makeDb({dateOfBirth:'2007-01-01',ageBand:'13_17'});
  const result=await reconcileStudentLifeStage({db,studentId:'s1'});
  assert.equal(result.changed,true);
  assert.equal(result.ageBand,'18_plus');
});

test('unknown age does not mutate lifecycle', async()=>{
  const db=makeDb({dateOfBirth:null,ageBand:'13_17'});
  const result=await reconcileStudentLifeStage({db,studentId:'s1'});
  assert.equal(result.changed,false);
  assert.equal(result.reason,'age_band_unknown');
});
