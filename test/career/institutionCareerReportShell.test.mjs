import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read=(relativePath)=>fs.readFileSync(path.join(process.cwd(),relativePath),'utf8');

test('canonical institutional report shell uses evidence and coverage components',()=>{
 const file=read('src/institution/InstitutionCareerReportShell.jsx');
 assert.match(file,/InstitutionCareerEvidencePanel/);
 assert.match(file,/InstitutionCareerReportCoverage/);
 assert.match(file,/assessmentEvidence/);
 assert.match(file,/Professional-use boundary/);
});

test('institution career dashboard delegates report rendering to the canonical shell',()=>{
 const file=read('src/institution/InstitutionCareerDashboard.jsx');
 assert.match(file,/import InstitutionCareerReportShell from '\.\/InstitutionCareerReportShell';/);
 assert.match(file,/if\(selectedReport\)return <InstitutionCareerReportShell payload=\{selectedReport\}/);
 assert.doesNotMatch(file,/function ReportView\(/);
});

test('institution career insights contains analytics only and no duplicate report renderer',()=>{
 const file=read('src/institution/InstitutionCareerInsights.jsx');
 assert.doesNotMatch(file,/function ReportPreview\(/);
 assert.doesNotMatch(file,/InstitutionCareerReportCoverage/);
 assert.doesNotMatch(file,/InstitutionCareerEvidencePanel/);
 assert.match(file,/Institutional career guidance overview/);
});
