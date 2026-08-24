import test from 'node:test';
import assert from 'node:assert/strict';

const source = await (await fetch(new URL('../../src/institution/InstitutionCareerDataContext.jsx', import.meta.url))).text();

test('institution career data provider exposes one refresh boundary',()=>{
  assert.match(source,/export function InstitutionCareerDataProvider/);
  assert.match(source,/const refresh=useCallback/);
  assert.match(source,/requestRef/);
  assert.match(source,/setData\(\{institution:next\.institution\|\|null/);
});

test('institution dashboard data adapter consumes the shared provider',async()=>{
  const adapter=await (await fetch(new URL('../../src/institution/useInstitutionCareerDashboardData.js', import.meta.url))).text();
  assert.match(adapter,/useInstitutionCareerData/);
  assert.match(adapter,/refresh/);
  assert.doesNotMatch(adapter,/fetch\(/);
});
