import React,{useEffect,useMemo,useState} from 'react';
import {auth} from '../firebase';

const card={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:20,boxShadow:'0 8px 28px rgba(15,23,42,.05)'};
const muted={color:'#64748b'};
const pct=(n,d)=>d?Math.round((n/d)*100):0;
const statusLabel=(s)=>({not_started:'Not started',in_progress:'In progress',completed:'Completed'}[s]||'Unknown');

function Stat({label,value,detail}){return <div style={card}><div style={{fontSize:11,fontWeight:900,textTransform:'uppercase',...muted}}>{label}</div><div style={{fontSize:28,fontWeight:950,marginTop:5,color:'#0f172a'}}>{value}</div>{detail&&<div style={{fontSize:12,marginTop:4,...muted}}>{detail}</div>}</div>}
function Meter({label,value}){return <div style={{marginTop:12}}><div style={{display:'flex',justifyContent:'space-between',fontSize:12,fontWeight:800,color:'#475569'}}><span>{label}</span><span>{value}%</span></div><div style={{height:8,background:'#eef2f7',borderRadius:99,overflow:'hidden',marginTop:5}}><div style={{height:'100%',width:`${Math.max(0,Math.min(100,value))}%`,background:'#4f46e5',borderRadius:99}}/></div></div>}

export default function InstitutionCareerInsights(){
 const [data,setData]=useState({institution:null,students:[],summary:{}});const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{(async()=>{try{const token=await auth.currentUser?.getIdToken();if(!token)return;const r=await fetch('/api/institution/dashboard',{headers:{Authorization:`Bearer ${token}`}});const d=await r.json();if(!r.ok)throw new Error(d?.error||'Unable to load career guidance analytics.');setData({institution:d.institution||null,students:Array.isArray(d.students)?d.students:[],summary:d.summary||{}});}catch(e){setError(e.message||'Unable to load career guidance analytics.');}finally{setLoading(false);}})();},[]);
 const students=data.students;const total=students.length;
 const counts=useMemo(()=>({not_started:students.filter(s=>s.assessmentStatus==='not_started').length,in_progress:students.filter(s=>s.assessmentStatus==='in_progress').length,completed:students.filter(s=>s.assessmentStatus==='completed').length}),[students]);
 const reportReady=Number(data.summary?.reportsReady||0);
 const started=counts.in_progress+counts.completed;
 const followUp=useMemo(()=>students.filter(s=>s.assessmentStatus!=='completed'||(s.assessmentStatus==='completed'&&reportReady<counts.completed)),[students,reportReady,counts.completed]);
 const classes=useMemo(()=>{const map={};students.forEach(s=>{const key=s.className||'Class not supplied';if(!map[key])map[key]={name:key,total:0,not_started:0,in_progress:0,completed:0};map[key].total+=1;if(map[key][s.assessmentStatus]!=null)map[key][s.assessmentStatus]+=1;});return Object.values(map).sort((a,b)=>String(a.name).localeCompare(String(b.name)));},[students]);
 if(loading)return null;
 if(error)return <div style={{...card,margin:'0 0 14px',color:'#991b1b',background:'#fef2f2'}}>Career guidance analytics unavailable: {error}</div>;
 if(!total)return null;
 const completion=pct(counts.completed,total);const participation=pct(started,total);const reportRate=pct(reportReady,total);
 return <section style={{maxWidth:1200,margin:'0 auto 14px'}}>
  <div style={{...card,background:'linear-gradient(135deg,#eef2ff,#ffffff)',borderColor:'#c7d2fe'}}>
   <div style={{fontSize:11,fontWeight:900,letterSpacing:1.4,color:'#4338ca'}}>VIDYAVANTAGE · CAREER GUIDANCE INTELLIGENCE</div>
   <h2 style={{margin:'6px 0 4px',fontSize:24}}>Institutional career guidance overview</h2>
   <p style={{margin:0,...muted}}>A workflow and data-quality layer for institutional staff. It does not create psychological conclusions or replace counsellor interpretation.</p>
  </div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:12}}>
   <Stat label="Participation" value={`${participation}%`} detail={`${started} of ${total} students started`}/>
   <Stat label="Completion" value={`${completion}%`} detail={`${counts.completed} completed`}/>
   <Stat label="Reports ready" value={`${reportRate}%`} detail={`${reportReady} reports available`}/>
   <Stat label="Follow-up queue" value={followUp.length} detail="Students needing workflow attention"/>
  </div>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
   <section style={card}><h3 style={{marginTop:0}}>Assessment status integrity</h3><p style={{fontSize:13,...muted}}>Provisioning is not counted as assessment completion. Only the status supplied by the institutional service is used.</p><Meter label="Not started" value={pct(counts.not_started,total)}/><Meter label="In progress" value={pct(counts.in_progress,total)}/><Meter label="Completed" value={pct(counts.completed,total)}/><div style={{marginTop:14,padding:12,borderRadius:10,background:'#f8fafc',fontSize:12,color:'#475569'}}>Unknown or missing assessment states are intentionally not converted into completed results.</div></section>
   <section style={card}><h3 style={{marginTop:0}}>Follow-up queue</h3>{followUp.length?<div style={{maxHeight:240,overflowY:'auto'}}>{followUp.slice(0,12).map((s,i)=><div key={s.id||i} style={{display:'flex',justifyContent:'space-between',gap:10,padding:'10px 0',borderBottom:'1px solid #eef2f7'}}><div><div style={{fontWeight:900}}>{s.fullName||'Student'}</div><div style={{fontSize:12,...muted}}>{s.className||'Class not supplied'} · {s.section||'Section not supplied'}</div></div><span style={{fontSize:11,fontWeight:900,color:'#b45309'}}>{statusLabel(s.assessmentStatus)}</span></div>)}</div>:<div style={{padding:'20px 0',color:'#15803d',fontWeight:800}}>No workflow follow-ups currently identified.</div>}{followUp.length>12&&<div style={{marginTop:8,fontSize:12,...muted}}>Showing first 12. Use Student Management for the complete queue.</div>}</section>
  </div>
  <section style={{...card,marginTop:12}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:12,flexWrap:'wrap'}}><div><h3 style={{marginTop:0,marginBottom:4}}>Class-wise participation and completion</h3><p style={{margin:0,fontSize:13,...muted}}>Operational analytics only; these figures do not evaluate student ability or suitability.</p></div><div style={{fontSize:12,...muted}}>{data.institution?.name||'Institution'}</div></div><div style={{overflowX:'auto',marginTop:10}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr>{['Class','Students','Not started','In progress','Completed','Completion'].map(h=><th key={h} style={{textAlign:'left',padding:'9px',borderBottom:'1px solid #e2e8f0',fontSize:11,textTransform:'uppercase',color:'#64748b'}}>{h}</th>)}</tr></thead><tbody>{classes.map(c=><tr key={c.name}><td style={{padding:9,fontWeight:900,borderBottom:'1px solid #f1f5f9'}}>{c.name}</td><td style={{padding:9,borderBottom:'1px solid #f1f5f9'}}>{c.total}</td><td style={{padding:9,borderBottom:'1px solid #f1f5f9'}}>{c.not_started}</td><td style={{padding:9,borderBottom:'1px solid #f1f5f9'}}>{c.in_progress}</td><td style={{padding:9,borderBottom:'1px solid #f1f5f9'}}>{c.completed}</td><td style={{padding:9,fontWeight:900,borderBottom:'1px solid #f1f5f9'}}>{pct(c.completed,c.total)}%</td></tr>)}</tbody></table></div></section>
  <section style={{...card,marginTop:12,background:'#fffbeb',borderColor:'#fde68a'}}><h3 style={{marginTop:0}}>Interpretation and data-quality boundary</h3><p style={{margin:0,fontSize:13,lineHeight:1.7,color:'#713f12'}}>Institutional analytics show participation, completion and workflow status only. They must not be interpreted as measures of intelligence, mental health, diagnosis, academic worth, employability or career certainty. Individual career results should be reviewed from the student report and interpreted with qualified career guidance.</p></section>
 </section>;
}
