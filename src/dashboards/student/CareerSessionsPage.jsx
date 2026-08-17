import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const go = (path) => { if (typeof window === 'undefined') return; window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0,0); };

export default function CareerSessionsPage() {
  const [sessions,setSessions] = useState([]);
  const [requests,setRequests] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{let cancelled=false;(async()=>{const user=auth.currentUser;if(!user){setLoading(false);return;}try{const snap=await getDoc(doc(db,'users',user.uid));if(!cancelled&&snap.exists()){const d=snap.data()||{};setSessions(Array.isArray(d.careerSessions)?d.careerSessions:[]);setRequests(Array.isArray(d.careerBookingRequests)?d.careerBookingRequests:[]);}}catch(e){console.error('[CareerSessionsPage] load failed:',e);}finally{if(!cancelled)setLoading(false);}})();return()=>{cancelled=true;};},[]);
  if(loading)return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',color:'#64748b',fontWeight:800}}>Loading your sessions…</div>;
  return <div style={{minHeight:'100vh',background:'#f8fafc',padding:'28px 20px 60px'}}><div style={{maxWidth:900,margin:'0 auto'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><div><div style={eyebrow}>VIDYAVANTAGE CAREER SPACE</div><h1 style={{margin:'5px 0',fontSize:30}}>My Sessions</h1><p style={{margin:0,color:'#64748b'}}>Keep track of your career guidance requests and confirmed sessions.</p></div><button onClick={()=>go('/dashboard/career/book')} style={primaryBtn}>📅 Book Now</button></div>
    <section style={{...card,marginTop:20,padding:22}}><div style={eyebrow}>BOOKING REQUESTS</div><h2 style={{margin:'6px 0 14px',fontSize:20}}>Pending and recent requests</h2>{requests.length?requests.map(item=><article key={item.id} style={row}><div><strong>{item.requestedDate} at {item.requestedTime}</strong><div style={{fontSize:12,color:'#64748b',marginTop:4}}>{item.mode} · {item.status||'requested'}</div>{item.notes&&<div style={{fontSize:13,color:'#475569',marginTop:8}}>{item.notes}</div>}</div><span style={status}>{item.status||'requested'}</span></article>):<div style={empty}>You have no booking requests yet.</div>}</section>
    <section style={{...card,marginTop:16,padding:22}}><div style={eyebrow}>CONFIRMED SESSIONS</div><h2 style={{margin:'6px 0 14px',fontSize:20}}>Your guidance sessions</h2>{sessions.length?sessions.map((item,index)=><article key={item.id||index} style={row}><div><strong>{item.title||item.name||'Career guidance session'}</strong><div style={{fontSize:12,color:'#64748b',marginTop:4}}>{item.date||'Date to be confirmed'}{item.time?` · ${item.time}`:''}</div></div>{item.status&&<span style={status}>{item.status}</span>}</article>):<div style={empty}>No confirmed career guidance sessions yet.</div>}</section>
    <button onClick={()=>go('/dashboard/career')} style={{marginTop:16,border:'1px solid #cbd5e1',background:'#fff',borderRadius:10,padding:'9px 12px',fontWeight:800,color:'#334155',cursor:'pointer'}}>← Back to Career Space</button>
  </div></div>;
}
const card={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18};
const eyebrow={color:'#64748b',fontSize:12,fontWeight:900,textTransform:'uppercase',letterSpacing:1};
const row={display:'flex',justifyContent:'space-between',gap:15,alignItems:'flex-start',padding:15,border:'1px solid #e2e8f0',borderRadius:12,marginBottom:10,background:'#fff'};
const status={fontSize:11,fontWeight:900,color:'#4338ca',background:'#eef2ff',borderRadius:999,padding:'7px 9px',whiteSpace:'nowrap'};
const empty={padding:22,border:'1px dashed #cbd5e1',borderRadius:12,color:'#64748b',textAlign:'center'};
const primaryBtn={border:0,borderRadius:10,padding:'11px 15px',background:'#4f46e5',color:'#fff',fontWeight:900,cursor:'pointer'};
