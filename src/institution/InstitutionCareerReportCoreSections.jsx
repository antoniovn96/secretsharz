import React from 'react';

const card={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:20,boxShadow:'0 8px 28px rgba(15,23,42,.05)'};
const muted={color:'#64748b',lineHeight:1.7};
const hasObject=v=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length>0;
const hasArray=v=>Array.isArray(v)&&v.length>0;
const value=v=>v!==undefined&&v!==null&&v!=='';
const familySelected=(report,family)=>Array.isArray(report?.selectedFamilyIds)&&report.selectedFamilyIds.includes(family);
const NotAssessed=({children='This evidence is not available in this assessment.'})=><div style={{padding:14,background:'#f8fafc',border:'1px dashed #cbd5e1',borderRadius:12,...muted}}><strong>Not assessed in this attempt.</strong><div style={{marginTop:4}}>{children}</div></div>;
const Source=({children})=><span style={{display:'inline-block',marginLeft:8,fontSize:10,fontWeight:900,color:'#475569',background:'#f1f5f9',borderRadius:999,padding:'4px 8px'}}>{children}</span>;

export default function InstitutionCareerReportCoreSections({report}){
 const r=report||{},scores=r.scores||{},intake=r.intake||{};
 const interestAvailable=familySelected(r,'interest')&&(value(scores.riasecCode)||hasObject(scores.riasec));
 const personalityAvailable=familySelected(r,'personality')&&hasObject(scores.big5);
 const valuesAvailable=familySelected(r,'work_values')&&hasObject(scores.values);
 const executive=r.executiveSnapshot||r.executiveSummary||r.snapshot;
 return <>
  <section style={{...card,marginTop:12}} data-report-section="executive_snapshot"><h2 style={{marginTop:0}}>Executive Snapshot <Source>Student report evidence</Source></h2>{hasObject(executive)||value(executive)?<pre style={{whiteSpace:'pre-wrap',fontSize:13,...muted,margin:0}}>{typeof executive==='string'?executive:JSON.stringify(executive,null,2)}</pre>:<NotAssessed>No explicit executive snapshot is persisted in this assessment.</NotAssessed>}</section>
  <section style={{...card,marginTop:12}} data-report-section="interest_personality"><h2 style={{marginTop:0}}>Interests & Personality Tendencies <Source>Student report evidence</Source></h2>{interestAvailable||personalityAvailable?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>{interestAvailable?<div style={{background:'#f8fafc',padding:14,borderRadius:12}}><strong>Career interests</strong><div style={{fontSize:32,fontWeight:950,letterSpacing:5,color:'#4f46e5',marginTop:6}}>{scores.riasecCode||'Profile available'}</div><p style={{fontSize:12,...muted,marginBottom:0}}>Interest pattern from the persisted assessment. It is not a fixed identity.</p></div>:<NotAssessed>No RIASEC interest evidence is available.</NotAssessed>}{personalityAvailable?<div style={{background:'#f8fafc',padding:14,borderRadius:12}}><strong>Personality tendencies</strong><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:7,marginTop:10}}>{Object.entries(scores.big5).map(([k,v])=><div key={k} style={{padding:8,background:'#fff',borderRadius:8}}><strong>{k}</strong><div>{v}</div></div>)}</div></div>:<NotAssessed>No Big Five personality evidence is available.</NotAssessed>}</div>:<NotAssessed>Neither the Interest nor Personality assessment family is available in this attempt.</NotAssessed>}</section>
  <section style={{...card,marginTop:12}} data-report-section="strengths_values"><h2 style={{marginTop:0}}>Strengths, Values & Preferences <Source>Student report evidence + student context</Source></h2>{valuesAvailable||hasArray(intake.likedSubjects)||value(intake.hobbies)||value(intake.curiosity)?<><p style={muted}>Explicit assessment values are kept separate from contextual information supplied by the student. Context is not converted into a psychometric score.</p>{valuesAvailable&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:8}}>{Object.entries(scores.values).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,12).map(([k,v])=><div key={k} style={{background:'#f8fafc',padding:10,borderRadius:9}}><strong>{k}</strong><div>{v}/5</div></div>)}</div>}{hasArray(intake.likedSubjects)&&<p><strong>Liked subjects:</strong> {intake.likedSubjects.join(', ')}</p>}{value(intake.hobbies)&&<p><strong>Hobbies / interests:</strong> {intake.hobbies}</p>}{value(intake.curiosity)&&<p><strong>Current curiosity:</strong> {intake.curiosity}</p>}</>:<NotAssessed>No values or relevant student-context evidence is available.</NotAssessed>}</section>
 </>;
}
