import React,{useMemo} from 'react';
import {STUDENT_PREMIUM_REPORT} from '../career/reportArchitecture';
import {buildInstitutionCareerReflection} from './careerReportDataContract';
const card={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:20,boxShadow:'0 8px 28px rgba(15,23,42,.05)'};
const SOURCE_LABELS={assessed:'Assessed',derived_from_assessment:'Derived from assessment evidence',career_catalogue:'Career catalogue information',not_assessed:'Not assessed',unavailable:'Not available'};
const SOURCE_TONES={assessed:['#f0fdf4','#15803d'],derived_from_assessment:['#eff6ff','#1d4ed8'],career_catalogue:['#fffbeb','#a16207'],not_assessed:['#fff7ed','#c2410c'],unavailable:['#f8fafc','#64748b']};
export default function InstitutionCareerReportCoverage({report={}}){
 const contract=useMemo(()=>buildInstitutionCareerReflection(report),[report]);
 const byId=new Map(contract.map(row=>[row.id,row]));
 const rows=STUDENT_PREMIUM_REPORT.map(section=>{const row=byId.get(section.id);const source=row?.source||'unavailable';return {...section,source,status:SOURCE_LABELS[source]||SOURCE_LABELS.unavailable,tone:source==='unavailable'?'missing':source==='not_assessed'?'not_assessed':'available'};});
 const available=rows.filter(x=>x.tone==='available').length;
 const assessed=rows.filter(x=>x.source==='assessed').length;
 const derived=rows.filter(x=>x.source==='derived_from_assessment').length;
 const catalogue=rows.filter(x=>x.source==='career_catalogue').length;
 const notAssessed=rows.filter(x=>x.source==='not_assessed').length;
 const unavailable=rows.filter(x=>x.source==='unavailable').length;
 return <section style={{...card,marginTop:14}}>
  <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'baseline',flexWrap:'wrap'}}>
   <div><div style={{fontSize:11,fontWeight:900,letterSpacing:1.2,color:'#4338ca'}}>REPORT COVERAGE</div><h2 style={{margin:'5px 0'}}>Student report → institutional reflection</h2><p style={{margin:0,color:'#64748b',fontSize:13}}>Availability and evidence provenance are separate. “Available” does not mean that the section was independently assessed.</p></div>
   <div style={{fontWeight:950,color:'#0f172a'}}>{available}/{rows.length} available</div>
  </div>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12,fontSize:11,fontWeight:900}}><span>Assessed: {assessed}</span><span>Derived: {derived}</span><span>Catalogue: {catalogue}</span><span>Not assessed: {notAssessed}</span><span>Not available: {unavailable}</span></div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginTop:14}}>{rows.map((r,i)=>{const tone=SOURCE_TONES[r.source]||SOURCE_TONES.unavailable;return <div key={r.id} style={{padding:12,border:'1px solid #eef2f7',borderRadius:12,background:tone[0]}}><div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center'}}><span style={{fontWeight:900,fontSize:13}}>{i+1}. {r.title}</span><span style={{fontSize:10,fontWeight:900,color:tone[1]}}>{r.status}</span></div><div style={{marginTop:4,fontSize:11,color:'#64748b'}}>{r.purpose}</div></div>})}</div>
 </section>;
}