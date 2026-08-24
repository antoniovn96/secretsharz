import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('canonical institutional report shell uses evidence and coverage components',()=>{
 const file=fs.readFileSync(path.join(process.cwd(),'src/institution/InstitutionCareerReportShell.jsx'),'utf8');
 assert.match(file,/InstitutionCareerEvidencePanel/);
 assert.match(file,/InstitutionCareerReportCoverage/);
 assert.match(file,/assessmentEvidence/);
 assert.match(file,/Professional-use boundary/);
});
