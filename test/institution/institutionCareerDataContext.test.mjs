import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const readSource=async(relativePath)=>readFile(fileURLToPath(new URL(relativePath,import.meta.url)),'utf8');
const source=await readSource('../../src/institution/InstitutionCareerDataContext.jsx');
const adapter=await readSource('../../src/institution/useInstitutionCareerDashboardData.js');
const dashboard=await readSource('../../src/institution/InstitutionCareerDashboard.jsx');

test('institution career data provider exposes one refresh boundary',()=>{
  assert.match(source,/export function InstitutionCareerDataProvider/);
  assert.match(source,/const refresh=useCallback/);
  assert.match(source,/requestRef/);
  assert.match(source,/setData\(\{institution:next\.institution\|\|null/);
});

test('institution dashboard data adapter consumes the shared provider',()=>{
  assert.match(adapter,/useInstitutionCareerData/);
  assert.match(adapter,/refresh/);
  assert.doesNotMatch(adapter,/fetch\(/);
});

test('career dashboard no longer owns the institutional dashboard API request',()=>{
  assert.match(dashboard,/useInstitutionCareerDashboardData/);
  assert.match(dashboard,/await refresh\(d\.institution\.id\)/);
  assert.doesNotMatch(dashboard,/fetch\(['\"]\/api\/institution\/dashboard/);
});
