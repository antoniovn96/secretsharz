import React from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * CareerMatchesModal
 * Shows the student's top 3 career exploration directions.
 * The current quantitative ranking is an Interest Alignment Index, not a
 * prediction of success, suitability or probability of career fit.
 */
export default function CareerMatchesModal({ onClose, localUserData }) {
  const { userProfile } = useDashboard();
  const topMatches = (() => {
    if (localUserData?.topCareerMatches?.length) return localUserData.topCareerMatches.slice(0, 3);
    const fallback = [];
    if (localUserData?.bestCareer) fallback.push({ name: localUserData.bestCareer.title, matchScore: localUserData.bestCareer.matchPercent, scoreLabel: 'Interest Alignment Index', tags: [localUserData.bestCareer.subtitle], stream: '', riasec: [], _isFallback: true, pros: localUserData.bestCareer.pros || [] });
    if (localUserData?.recommendedCareer) fallback.push({ name: localUserData.recommendedCareer.title, matchScore: localUserData.recommendedCareer.matchPercent, scoreLabel: 'Interest Alignment Index', tags: [localUserData.recommendedCareer.subtitle], stream: '', riasec: [], _isFallback: true, pros: localUserData.recommendedCareer.pros || [] });
    return fallback.slice(0, 3);
  })();
  const RANK_STYLES = [
    { label: '🥇 Strongest direction', bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', border: '#6EE7B7', color: '#065F46', barColor: '#34D399' },
    { label: '🥈 Next direction', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '#FCD34D', color: '#92400E', barColor: '#FBBF24' },
    { label: '🥉 Another direction', bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', border: '#C4B5FD', color: '#5B21B6', barColor: '#8B5CF6' },
  ];
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:20, backdropFilter:'blur(6px)' }} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{ background:'white', borderRadius:28, maxWidth:560, width:'100%', maxHeight:'88vh', overflow:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.22)' }}>
        <div style={{ background:'linear-gradient(135deg, #0D1117 0%, #1C2850 100%)', padding:'28px 28px 24px', borderRadius:'28px 28px 0 0', position:'relative' }}>
          <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.1)', border:'none', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer', color:'white' }}>✕</button>
          <div style={{ fontSize:11, fontWeight:800, color:'#F0A500', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>🎯 Career Intelligence</div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize:22, fontWeight:700, color:'white', marginBottom:4 }}>Career Directions Worth Exploring</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)' }}>Based on your RIASEC interest profile: <span style={{ color:'#F0A500', fontWeight:800, letterSpacing:2 }}>{String(localUserData?.riasecCode || userProfile?.riasecCode || '—')}</span></div>
        </div>
        <div style={{ padding:'20px 28px 28px', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:14, padding:'12px 14px', fontSize:12, color:'#475569', lineHeight:1.55 }}>
            <strong>How to read this:</strong> the current index measures alignment with the career's RIASEC interest profile. It is an exploration aid, not a prediction of success, suitability, salary or future outcomes.
          </div>
          {topMatches.length === 0 ? <div style={{ textAlign:'center', padding:'40px 0' }}><div style={{ fontSize:48, marginBottom:12 }}>🧠</div><div style={{ fontFamily:"'Fraunces', serif", fontSize:18, fontWeight:700, color:'#1C2333', marginBottom:8 }}>No Career Directions Yet</div><div style={{ fontSize:13, color:'#6B7280' }}>Complete the RIASEC assessment to unlock personalised career directions.</div></div> : topMatches.map((career,i)=>{
            const style=RANK_STYLES[i]||RANK_STYLES[2];
            const score=Number(career.interestAlignmentIndex ?? career.matchScore ?? career.explorationIndex ?? 0);
            return <div key={i} style={{ background:style.bg, border:`1.5px solid ${style.border}`, borderRadius:16, padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ flex:1 }}><div style={{ fontSize:10, fontWeight:800, color:style.color, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>{style.label}</div><div style={{ fontFamily:"'Fraunces', serif", fontSize:18, fontWeight:700, color:'#0D1117', marginBottom:2 }}>{String(career.name||'')}</div>{career.tags?.length>0&&<div style={{ fontSize:12, color:'#6B7280', fontWeight:500 }}>{career.tags.map(String).join(' · ')}</div>}</div>
                <div style={{ background:'white', border:`1.5px solid ${style.border}`, borderRadius:12, padding:'8px 14px', textAlign:'center', flexShrink:0, marginLeft:12 }}><div style={{ fontFamily:"'Fraunces', serif", fontSize:22, fontWeight:900, color:style.color, lineHeight:1 }}>{score}%</div><div style={{ fontSize:9, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:.5, marginTop:2 }}>Interest alignment</div></div>
              </div>
              <div style={{ height:5, background:'rgba(0,0,0,0.08)', borderRadius:5, overflow:'hidden', marginBottom:10 }}><div style={{ width:`${score}%`, height:'100%', background:style.barColor, borderRadius:5 }} /></div>
              {career.riasec?.length>0&&<div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>{career.riasec.map((code,j)=><span key={j} style={{ background:'rgba(0,0,0,0.07)', color:style.color, fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:20, letterSpacing:.5 }}>{String(code)}</span>)}</div>}
              {career.rationale&&<div style={{ marginTop:10, fontSize:12, color:'#475569', lineHeight:1.55 }}><strong>Why it appeared:</strong> {String(career.rationale)}</div>}
            </div>;
          })}
          <button onClick={onClose} style={{ width:'100%', padding:12, background:'linear-gradient(135deg, #111827, #374151)', color:'white', border:'none', borderRadius:50, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:4 }}>Close</button>
        </div>
      </div>
    </div>
  );
}
