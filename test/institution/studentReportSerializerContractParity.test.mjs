import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeInstitutionalCareerReport } from '../../src/institution/institutionalCareerReportSerializer.js';
import { buildInstitutionCareerReflection, STUDENT_CAREER_ADMIN_CONTRACT } from '../../src/institution/careerReportDataContract.js';

const setPath=(target,path,value)=>{
  const parts=path.split('.');
  let cursor=target;
  for(let i=0;i<parts.length-1;i++) cursor=cursor[parts[i]]??(cursor[parts[i]]={});
  cursor[parts.at(-1)]=value;
};

const representativeValue=(path)=>{
  if(path.endsWith('Code')) return 'RIA';
  if(path.includes('likedSubjects')||path.includes('hobbies')||path.includes('curiosity')) return ['example'];
  if(path.includes('Percent')) return 72;
  if(path.includes('intake')) return { age: 16 };
  if(path.includes('careerDirections')||path.includes('alternative')||path.includes('topCareer')) return [{ name: 'Example Career' }];
  if(path.includes('reasoning')) return { percent: 72 };
  return { evidence: 'example' };
};

test('serializer preserves every canonical contract data path in a representative report',()=>{
  const source={intake:{},scores:{}};
  for(const [, , paths] of STUDENT_CAREER_ADMIN_CONTRACT){
    for(const path of paths){
      const normalized=path.replace(/^reflection\./,'reflection.');
      setPath(source,normalized,representativeValue(path));
    }
  }
  const serialized=serializeInstitutionalCareerReport(source);
  const reflection=buildInstitutionCareerReflection(serialized);
  for(const [id] of STUDENT_CAREER_ADMIN_CONTRACT){
    const section=reflection.find(x=>x.id===id);
    assert.ok(section,`missing contract section ${id}`);
  }
});

test('serializer-normalized empty intake does not create false developmental coverage',()=>{
  const serialized=serializeInstitutionalCareerReport({});
  const reflection=buildInstitutionCareerReflection(serialized);
  const section=reflection.find(x=>x.id==='developmental_context');
  assert.equal(section.available,false);
  assert.equal(section.source,'unavailable');
});

test('serializer-normalized empty optional objects do not create false coverage',()=>{
  const serialized=serializeInstitutionalCareerReport({ scores: {}, intake: {} });
  const reflection=buildInstitutionCareerReflection(serialized);
  for(const id of ['riasec_profile','personality_profile','career_values','reasoning_profile','work_environment']){
    const section=reflection.find(x=>x.id===id);
    assert.equal(section.available,false,`${id} should not be available`);
  }
});
