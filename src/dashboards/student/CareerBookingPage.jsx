import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const go = (path) => {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
};

export default function CareerBookingPage() {
  const user = auth.currentUser;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('Online');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!user || !date || !time) return;
    setSaving(true);
    setMessage('');
    try {
      const now = new Date().toISOString();
      const request = { id:`booking_${Date.now()}`, requestedDate:date, requestedTime:time, mode, notes:notes.trim(), status:'requested', createdAt:now };
      await setDoc(doc(db, 'users', user.uid), { careerBookingRequests: [request], careerBookingUpdatedAt: now }, { merge:true });
      setMessage('Your request has been sent. The session is not confirmed until Secret Sharz confirms the appointment.');
    } catch (error) {
      setMessage(error?.message || 'Unable to send the booking request.');
    } finally {
      setSaving(false);
    }
  };

  return <div style={{minHeight:'100vh',background:'#f8fafc',padding:'28px 20px 60px'}}>
    <div style={{maxWidth:760,margin:'0 auto'}}>
      <button onClick={() => go('/dashboard/career')} style={{border:'1px solid #cbd5e1',background:'#fff',borderRadius:10,padding:'9px 12px',fontWeight:800,color:'#334155',cursor:'pointer'}}>← Back to Career Space</button>
      <section style={{background:'#0f172a',color:'#fff',borderRadius:20,padding:'30px 32px',marginTop:16}}>
        <div style={{color:'#f59e0b',fontSize:12,fontWeight:900,textTransform:'uppercase',letterSpacing:1}}>CAREER GUIDANCE</div>
        <h1 style={{margin:'7px 0',fontSize:32}}>Book a guidance session</h1>
        <p style={{margin:0,color:'#cbd5e1',lineHeight:1.7}}>Choose a preferred date and time. This is a request, not an automatic appointment confirmation.</p>
      </section>
      <section style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:24,marginTop:18}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <label style={label}>Preferred date<input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} style={input}/></label>
          <label style={label}>Preferred time<input type="time" value={time} onChange={e=>setTime(e.target.value)} style={input}/></label>
        </div>
        <div style={{marginTop:14}}><div style={labelText}>Session mode</div><div style={{display:'flex',gap:8,marginTop:8}}>{['Online','In person'].map(item=><button key={item} onClick={()=>setMode(item)} style={{border:'1px solid '+(mode===item?'#a5b4fc':'#cbd5e1'),borderRadius:999,padding:'9px 13px',background:mode===item?'#eef2ff':'#fff',color:mode===item?'#4338ca':'#475569',fontWeight:800,cursor:'pointer'}}>{item}</button>)}</div></div>
        <label style={{...label,display:'block',marginTop:16}}>What would you like help with?<textarea rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional: tell us what you would like to explore in the session." style={{...input,resize:'vertical'}}/></label>
        {message && <div style={{marginTop:14,padding:13,borderRadius:11,background:'#f1f5f9',color:'#475569',fontSize:13,lineHeight:1.6}}>{message}</div>}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginTop:18,flexWrap:'wrap'}}><span style={{fontSize:11,color:'#64748b'}}>Your counsellor will confirm the final appointment time.</span><button disabled={saving||!date||!time} onClick={submit} style={{border:0,borderRadius:11,padding:'12px 18px',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'#fff',fontWeight:900,cursor:'pointer',opacity:(saving||!date||!time)?0.5:1}}>{saving?'Sending…':'Request Session'}</button></div>
      </section>
    </div>
  </div>;
}

const label={display:'grid',gap:7,fontSize:12,fontWeight:900,color:'#334155'};
const labelText={fontSize:12,fontWeight:900,color:'#334155'};
const input={width:'100%',boxSizing:'border-box',marginTop:7,padding:'11px 12px',border:'1px solid #cbd5e1',borderRadius:10,fontFamily:'inherit',fontSize:13,background:'#fff'};
