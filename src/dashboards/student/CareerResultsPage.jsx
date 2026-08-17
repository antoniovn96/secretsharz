import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { getProfileIdentity } from '../../platform/profileIdentity';

const go = (path) => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
};

function NavButton({ active, children, onClick }) {
  return <button onClick={onClick} style={{ width:'100%', border:0, borderRadius:10, padding:'10px 12px', background:active?'#eef2ff':'transparent', color:active?'#4338ca':'#475569', fontWeight:active?900:700, textAlign:'left', cursor:'pointer', marginTop:4 }}>{children}</button>;
}

export default function CareerResultsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 900);
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const user = auth.currentUser;
      if (!user) { if (!cancelled) setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!cancelled && snap.exists()) {
          const raw = snap.data() || {};
          const assessment = raw.careerAssessment || {};
          const identity = getProfileIdentity(user, raw);
          const code = assessment.hollandCode || raw.riasecCode || '';
          setData({
            user,
            firstName: identity.firstName || 'Student',
            profileImage: identity.photoURL,
            profileInitial: identity.initial,
            hollandCode: Array.isArray(code) ? code : String(code).split('').filter(Boolean),
            riasecScores: assessment.riasecScores || raw.riasecScores || {},
            stream: assessment.streams?.[0]?.id || raw.recommendedStream || 'Pending',
            careers: (assessment.top5Careers || raw.topCareerMatches || []).slice(0, 3),
            accessPaid: raw?.careerReportAccess?.status === 'paid' || raw?.institutionAccess?.status === 'active',
          });
        }
      } catch (error) {
        console.error('[CareerResultsPage] failed to load results:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',color:'#64748b',fontWeight:800}}>Loading your career results…</div>;
  if (!data) return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,color:'#475569'}}>We could not load your career results. Please return to your Career Space.</div>;

  const scores = Object.entries(data.riasecScores || {}).sort((a,b) => Number(b[1]) - Number(a[1]));
  const goBack = () => go('/dashboard/career');

  const sidebar = <aside style={{width:mobile?'auto':250, flexShrink:0, padding:mobile?'12px 12px 0':24}}>
    <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,overflow:'hidden',position:mobile?'static':'sticky',top:20}}>
      <div style={{height:mobile?56:88,background:'linear-gradient(135deg,#4f46e5,#7c3aed)'}} />
      <div style={{padding:mobile?'12px 14px':'0 20px 18px',marginTop:mobile?0:-34}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {data.profileImage ? <img src={data.profileImage} alt="Profile" style={{width:mobile?50:68,height:mobile?50:68,borderRadius:'50%',objectFit:'cover',border:'4px solid #fff'}}/> : <div style={{width:mobile?50:68,height:mobile?50:68,borderRadius:'50%',background:'#e0e7ff',color:'#4338ca',border:'4px solid #fff',display:'grid',placeItems:'center',fontSize:24,fontWeight:900}}>{data.profileInitial}</div>}
          <div><div style={{fontWeight:900,color:'#0f172a'}}>{data.firstName}</div><div style={{fontSize:11,color:'#64748b'}}>Career Guidance</div></div>
        </div>
        <div style={{display:mobile?'flex':'block',gap:4,overflowX:mobile?'auto':'visible',marginTop:14}}>
          <NavButton onClick={goBack}>🏠 Home</NavButton>
          <NavButton active onClick={() => go('/dashboard/career/results')}>📊 Results</NavButton>
          <NavButton onClick={() => go('/dashboard/career/roadmap')}>🗺️ Roadmap</NavButton>
          <NavButton onClick={() => go('/dashboard/career/journal')}>✍️ Journal</NavButton>
          <NavButton onClick={() => go('/dashboard/career/sessions')}>💬 My Sessions</NavButton>
          <NavButton onClick={() => go('/dashboard/career/resources')}>📚 Resources</NavButton>
          <NavButton onClick={() => go('/dashboard/career/games')}>🎮 Games</NavButton>
          <NavButton onClick={() => go('/dashboard/career/profile')}>👤 My Profile</NavButton>
          <NavButton onClick={() => go('/dashboard/career/settings')}>⚙️ Settings</NavButton>
        </div>
        <button onClick={() => go('/dashboard/career/book')} style={{width:'100%',marginTop:14,border:0,borderRadius:11,padding:'12px 14px',background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',fontWeight:900,cursor:'pointer'}}>📅 Book a guidance session</button>
      </div>
    </div>
  </aside>;

  return <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',flexDirection:mobile?'column':'row'}}>
    {sidebar}
    <main style={{flex:1,minWidth:0,padding:mobile?'16px 12px 50px':'24px 28px 60px'}}>
      <div style={{maxWidth:1080,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:16,flexWrap:'wrap'}}>
          <div><div style={{color:'#4f46e5',fontSize:12,fontWeight:900,textTransform:'uppercase',letterSpacing:1}}>VIDYAVANTAGE CAREER INTELLIGENCE</div><div style={{fontSize:23,fontWeight:950,color:'#0f172a',marginTop:3}}>Career Results</div></div>
          <button onClick={goBack} style={{border:'1px solid #cbd5e1',borderRadius:10,background:'#fff',padding:'9px 12px',fontWeight:800,color:'#334155',cursor:'pointer'}}>← Back to Career Space</button>
        </div>
        <section style={{background:'#0f172a',color:'#fff',padding:'28px 32px',borderRadius:20,marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,textTransform:'uppercase',color:'#f59e0b'}}>VidyaVantage Career Intelligence</div>
          <h1 style={{margin:'4px 0',fontSize:32}}>Your Career Results Are Ready, {data.firstName}</h1>
          <p style={{margin:0,color:'#cbd5e1',lineHeight:1.6}}>Your Career Discovery preview brings your assessment findings together. Use them as a starting point for exploration, not as a fixed prediction of your future.</p>
        </section>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.4fr) minmax(280px,.6fr)',gap:20}}>
          <section style={card}>
            <div style={{display:'flex',justifyContent:'space-between',gap:20,marginBottom:24,flexWrap:'wrap'}}>
              <div><div style={eyebrow}>YOUR HOLLAND CODE</div><div style={{fontSize:46,fontWeight:950,letterSpacing:8,color:'#4f46e5',marginTop:8}}>{data.hollandCode.join('') || '—'}</div></div>
              <div style={{textAlign:'right'}}><div style={{color:'#64748b',fontSize:12}}>Recommended Stream</div><div style={{fontSize:22,fontWeight:900,marginTop:5}}>{data.stream}</div></div>
            </div>
            <div style={{borderTop:'1px solid #e2e8f0',paddingTop:22}}><div style={{fontSize:13,fontWeight:800,marginBottom:14}}>RIASEC PROFILE</div>{scores.length ? scores.map(([key,value]) => <div key={key} style={{marginBottom:10}}><div style={{display:'flex',justifyContent:'space-between',fontSize:12,fontWeight:800,marginBottom:5}}><span>{key}</span><span>{Number(value)}%</span></div><div style={{height:8,background:'#e2e8f0',borderRadius:999}}><div style={{width:`${Math.max(0,Math.min(100,Number(value)))}%`,height:'100%',background:'linear-gradient(90deg,#4f46e5,#7c3aed)',borderRadius:999}}/></div></div>) : <div style={{color:'#64748b'}}>Your score breakdown will appear here.</div>}</div>
          </section>
          <section style={{background:'#111827',color:'#fff',borderRadius:18,padding:28}}>
            <div style={{fontSize:12,fontWeight:800,color:data.accessPaid?'#86efac':'#fbbf24'}}>{data.accessPaid?'🔓 FULL REPORT':'🔒 FULL REPORT'}</div>
            <h2 style={{margin:'10px 0',fontSize:25}}>{data.accessPaid?'Your full report is unlocked':'See the complete career picture'}</h2>
            <p style={{color:'#cbd5e1',lineHeight:1.7}}>{data.accessPaid?'Your Career Intelligence report is ready with the deeper interpretation and pathway work.':'Unlock the deeper interpretation, pathway mapping and personalised roadmap.'}</p>
            <div style={{display:'grid',gap:9,margin:'20px 0'}}>{['Detailed psychometric interpretation','Career-by-career suitability analysis','Stream, course and pathway mapping','College and next-step guidance','Personalised career roadmap'].map(item=><div key={item} style={{fontSize:13}}>✓ {item}</div>)}</div>
            <button onClick={() => go(data.accessPaid?'/dashboard/career/results/full':'/dashboard/career/payment')} style={primaryWide}>{data.accessPaid?'Open Full Report →':'🔓 Unlock Full Career Intelligence'}</button>
            <button onClick={() => go('/dashboard/career/assessment')} style={secondaryWide}>Retake Assessment</button>
          </section>
        </div>
        <section style={{...card,marginTop:20,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><div><div style={eyebrow}>NEXT STEP</div><h2 style={{margin:'5px 0',fontSize:20}}>Talk it through with a career counsellor</h2><p style={{margin:0,color:'#64748b'}}>Your results are a starting point. A guidance session can help you interpret them in context and decide what to explore next.</p></div><button onClick={() => go('/dashboard/career/book')} style={primaryBtn}>Book Now</button></div>
        </section>
        <section style={{...card,marginTop:20,padding:22}}>
          <h3 style={{margin:'0 0 14px',fontSize:20}}>Top Career Matches — Preview</h3>
          {data.careers.length ? data.careers.map((career,index)=><div key={`${career.name||career.title||'career'}-${index}`} style={{display:'flex',justifyContent:'space-between',padding:15,background:'#f8fafc',borderRadius:12,marginBottom:10}}><div><strong>{career.name||career.title}</strong><div style={{fontSize:12,color:'#64748b',marginTop:3}}>{career.stream||'Career pathway'}</div></div>{career.matchScore!=null&&<strong style={{color:'#4f46e5'}}>{career.matchScore}%</strong>}</div>) : <div style={{color:'#64748b'}}>Your detailed career matches are included in the full report.</div>}
        </section>
      </div>
    </main>
  </div>;
}

const card={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:28};
const eyebrow={color:'#64748b',fontSize:12,fontWeight:800};
const primaryWide={width:'100%',border:0,borderRadius:12,padding:14,background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',fontWeight:900,cursor:'pointer'};
const secondaryWide={width:'100%',border:'1px solid #475569',borderRadius:12,padding:11,background:'transparent',color:'#cbd5e1',fontWeight:700,marginTop:10,cursor:'pointer'};
const primaryBtn={border:0,borderRadius:10,padding:'11px 16px',background:'#4f46e5',color:'#fff',fontWeight:900,cursor:'pointer'};
