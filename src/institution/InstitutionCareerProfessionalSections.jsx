import React from 'react';

const card={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:20,boxShadow:'0 8px 28px rgba(15,23,42,.05)'};
const muted={color:'#64748b'};

function DataBlock({title,value,empty='Not available'}){
  const has=value!==undefined&&value!==null&&value!==''&&(Array.isArray(value)?value.length:Object.keys(value||{}).length||typeof value!=='object');
  return <section style={card}><h3 style={{marginTop:0}}>{title}</h3>{has?<pre style={{whiteSpace:'pre-wrap',fontSize:12,color:'#475569',margin:0}}>{typeof value==='string'||typeof value==='number'?String(value):JSON.stringify(value,null,2)}</pre>:<p style={{margin:0,...muted}}>{empty}</p>}</section>;
}

export default function InstitutionCareerProfessionalSections({report={}}){
 const work=report.workEnvironment||report.preferredWorkEnvironment;
 const pathway=report.pathwayAnalysis;
 const friction=report.affordability||report.friction;
 const review=report.counsellorReview||report.reviewLimitations;
 return <div style={{display:'grid',gap:12,marginTop:12}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
   <DataBlock title="Preferred work environment" value={work} empty="Work-environment preferences have not been assessed or are not available in this report."/>
   <DataBlock title="Non-linear pathway analysis" value={pathway} empty="No direct, bridge or alternative pathway evidence is available."/>
  </div>
  <DataBlock title="Affordability, scholarships & friction" value={friction} empty="No evidence-based affordability or transition-friction information is available."/>
  <DataBlock title="Counsellor conversation & limitations" value={review} empty="No additional counsellor-review data is attached to this report."/>
  <section style={{...card,background:'#f8fafc'}}><h3 style={{marginTop:0}}>Institutional interpretation rule</h3><p style={{margin:0,fontSize:13,lineHeight:1.7,...muted}}>These sections are reflections of evidence stored in the student's career report. An unavailable section must not be treated as a negative result, and the institutional view must not generate a recommendation that is absent from the underlying student report.</p></section>
 </div>;
}
