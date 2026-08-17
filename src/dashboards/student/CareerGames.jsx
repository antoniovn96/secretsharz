import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const GAMES = [
  { id: 'sudoku', icon: '🔢', title: 'Mini Sudoku', subtitle: 'A calm 4×4 logic puzzle', free: 'Daily puzzle', pro: 'Unlimited puzzles + difficulty levels + progress insights' },
  { id: 'scramble', icon: '🔤', title: 'Word Scramble', subtitle: 'Build vocabulary and pattern speed', free: 'Starter word sets', pro: 'Full word library + themed career sets + mastery tracking' },
  { id: 'memory', icon: '🧠', title: 'Memory Match', subtitle: 'A gentle memory and attention challenge', free: 'Starter board', pro: 'Larger boards + themed decks + personal bests' },
  { id: 'careerquest', icon: '🧭', title: 'Career Quest', subtitle: 'Explore decisions, skills and pathways', free: 'Daily challenge', pro: 'Full quest library + personalised career scenarios' },
];
const storageKey = uid => `vidyavantage-games:${uid}`;

function MiniSudoku() {
  const solution = [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1];
  const editable = [0,3,5,6,9,10,12,15];
  const blank = () => solution.map((n,i) => editable.includes(i) ? '' : n);
  const [cells,setCells]=useState(blank); const [message,setMessage]=useState('');
  const reset=()=>{setCells(blank());setMessage('');};
  const check=()=>setMessage(cells.every((v,i)=>Number(v)===solution[i])?'Puzzle complete! Great work.':'Keep going — check the empty or incorrect squares.');
  return <div><div style={{display:'grid',gridTemplateColumns:'repeat(4,58px)',gap:5,justifyContent:'center',margin:'18px 0'}}>{cells.map((v,i)=><input key={i} value={v} disabled={!editable.includes(i)} onChange={e=>setCells(c=>c.map((x,j)=>j===i?e.target.value.replace(/[^1-4]/g,'').slice(-1):x))} style={{width:58,height:58,textAlign:'center',fontSize:22,fontWeight:900,border:'1px solid #cbd5e1',borderRadius:8,background:editable.includes(i)?'#fff':'#f8fafc',color:'#0f172a'}}/>)}</div><div style={{display:'flex',gap:8,justifyContent:'center'}}><button onClick={check} style={primaryBtn}>Check</button><button onClick={reset} style={secondaryBtn}>Reset</button></div>{message&&<div style={{textAlign:'center',marginTop:12,color:'#475569',fontWeight:800}}>{message}</div>}</div>;
}

function WordScramble({ pro }) {
  const words=pro?['ARCHITECT','PSYCHOLOGY','ANALYST','DESIGNER']:['CAREER','SKILL','VALUE']; const [index,setIndex]=useState(0); const [answer,setAnswer]=useState(''); const [message,setMessage]=useState(''); const word=words[index%words.length];
  const scrambled=useMemo(()=>{const chars=word.split('');for(let i=chars.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[chars[i],chars[j]]=[chars[j],chars[i]];}if(chars.join('')===word&&chars.length>1)[0];return chars.join('');},[word]);
  const check=()=>setMessage(answer.trim().toUpperCase()===word?'Correct! ⭐':'Not quite — try again.');
  return <div style={{textAlign:'center'}}><div style={{fontSize:30,fontWeight:950,letterSpacing:6,margin:'22px 0'}}>{scrambled}</div><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Unscramble the word" style={{...inputBase,maxWidth:300}}/><div style={{marginTop:12}}><button onClick={check} style={primaryBtn}>Check answer</button><button onClick={()=>{setIndex(i=>i+1);setAnswer('');setMessage('');}} style={secondaryBtn}>Next</button></div>{message&&<div style={{marginTop:12,fontWeight:800}}>{message}</div>}{!pro&&<div style={hintStyle}>Pro unlocks larger word libraries and career-themed sets.</div>}</div>;
}

function MemoryMatch({ pro }) {
  const values=pro?['🎨','🧪','⚖️','💻','🧠','🌱','📐','🎤']:['🎨','🧪','⚖️','💻']; const deck=useMemo(()=>[...values,...values].sort(()=>Math.random()-0.5),[values.join(',')]); const [open,setOpen]=useState([]); const [matched,setMatched]=useState([]);
  const click=i=>{if(open.includes(i)||matched.includes(i)||open.length>=2)return;const next=[...open,i];setOpen(next);if(next.length===2&&deck[next[0]]===deck[next[1]]){setMatched(m=>[...m,...next]);setOpen([]);}else if(next.length===2)setTimeout(()=>setOpen([]),650);};
  return <div><div style={{display:'grid',gridTemplateColumns:'repeat(4,58px)',gap:7,justifyContent:'center',margin:'18px 0'}}>{deck.map((v,i)=>{const shown=open.includes(i)||matched.includes(i);return <button key={i} onClick={()=>click(i)} style={{width:58,height:58,border:'1px solid #cbd5e1',borderRadius:10,background:shown?'#eef2ff':'#0f172a',fontSize:24,cursor:'pointer'}}>{shown?v:'?'}</button>;})}</div><div style={{textAlign:'center',fontWeight:800,color:'#475569'}}>{matched.length/2} pairs matched</div></div>;
}

function CareerQuest({ pro }) {
  const questions=pro?[['A school project needs someone to organise the plan and keep everyone on track. What would you enjoy most?',['Build the timeline','Create the visuals','Interview people','Solve the technical problem']],['You have one weekend to learn a new skill. Which feels most satisfying?',['Understand how a system works','Make something creative','Help someone improve','Analyse the numbers']]]:[['Which activity sounds most interesting today?',['Solve a puzzle','Design a poster','Help a friend','Plan a small project']]];
  const [step,setStep]=useState(0);const [choice,setChoice]=useState(null);const q=questions[step%questions.length];
  return <div><div style={{fontWeight:900,color:'#4f46e5',fontSize:12,textTransform:'uppercase'}}>Career scenario {step+1}</div><h3 style={{fontSize:20,lineHeight:1.5}}>{q[0]}</h3><div style={{display:'grid',gap:9}}>{q[1].map((x,i)=><button key={x} onClick={()=>setChoice(i)} style={{textAlign:'left',padding:13,borderRadius:11,border:choice===i?'2px solid #4f46e5':'1px solid #cbd5e1',background:choice===i?'#eef2ff':'#fff',fontWeight:800}}>{x}</button>)}</div>{choice!==null&&<button onClick={()=>{setStep(s=>s+1);setChoice(null)}} style={{...primaryBtn,marginTop:14}}>Continue →</button>}<div style={hintStyle}>{pro?'Your responses build a private exploration pattern; they do not overwrite psychometric assessment scores.':'Free mode gives a small daily challenge. Pro unlocks the full exploration library.'}</div></div>;
}

const inputBase={width:'100%',boxSizing:'border-box',padding:'12px 13px',border:'1px solid #cbd5e1',borderRadius:10,fontSize:14};
const primaryBtn={border:0,borderRadius:10,padding:'10px 15px',background:'#4f46e5',color:'#fff',fontWeight:900,cursor:'pointer'};
const secondaryBtn={border:'1px solid #cbd5e1',borderRadius:10,padding:'10px 15px',background:'#fff',fontWeight:800,marginLeft:8,cursor:'pointer'};
const hintStyle={marginTop:15,padding:12,borderRadius:10,background:'#f8fafc',color:'#64748b',fontSize:12,lineHeight:1.5};

export default function CareerGames({ currentUser, onUnlock }) {
  const [selected,setSelected]=useState('sudoku');const [pro,setPro]=useState(false);const [stats,setStats]=useState({played:0,best:0});const user=currentUser||auth.currentUser;
  useEffect(()=>{if(!user)return;(async()=>{try{const snap=await getDoc(doc(db,'users',user.uid));const data=snap.exists()?snap.data():{};setPro(data?.institutionAccess?.status==='active'||data?.gamesAccess?.status==='paid');const cached=localStorage.getItem(storageKey(user.uid));if(cached)setStats(JSON.parse(cached));}catch(_){}})();},[user]);
  const game=GAMES.find(x=>x.id===selected)||GAMES[0]; const render=()=>selected==='sudoku'?<MiniSudoku/>:selected==='scramble'?<WordScramble pro={pro}/>:selected==='memory'?<MemoryMatch pro={pro}/>:<CareerQuest pro={pro}/>;
  const record=()=>{const next={...stats,played:Number(stats.played||0)+1,best:Math.max(Number(stats.best||0),Number(stats.played||0)+1)};setStats(next);if(user)localStorage.setItem(storageKey(user.uid),JSON.stringify(next));};
  return <div style={{minHeight:'100vh',background:'#f8fafc',padding:'28px 24px 60px'}}><div style={{maxWidth:1040,margin:'0 auto'}}><div style={{background:'#0f172a',color:'#fff',borderRadius:20,padding:'28px 30px',display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}><div><div style={{fontSize:11,fontWeight:900,color:'#fbbf24',letterSpacing:1.5}}>VIDYAVANTAGE PLAYGROUND</div><h1 style={{margin:'6px 0',fontSize:31}}>Play, explore & discover.</h1><p style={{margin:0,color:'#cbd5e1'}}>Small challenges for curiosity, memory, words and career exploration — without public leaderboards or pressure.</p></div><div style={{background:'rgba(255,255,255,.08)',borderRadius:14,padding:15,minWidth:150}}><div style={{fontSize:10,fontWeight:900,color:'#cbd5e1'}}>YOUR PLAY STATS</div><div style={{fontSize:25,fontWeight:950}}>{stats.played}</div><div style={{fontSize:11,color:'#cbd5e1'}}>sessions completed</div></div></div><div style={{display:'grid',gridTemplateColumns:'230px 1fr',gap:18,marginTop:18}}><aside style={{...cardStyle,padding:12}}>{GAMES.map(g=><button key={g.id} onClick={()=>{setSelected(g.id);record();}} style={{width:'100%',textAlign:'left',border:0,borderRadius:11,padding:'12px 10px',background:selected===g.id?'#eef2ff':'transparent',color:selected===g.id?'#4338ca':'#475569',fontWeight:900,cursor:'pointer'}}>{g.icon} {g.title}</button>)}</aside><main style={cardStyle}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}><div><h2 style={{margin:0}}>{game.icon} {game.title}</h2><p style={{margin:'5px 0',color:'#64748b'}}>{game.subtitle}</p></div><span style={{padding:'6px 9px',borderRadius:999,background:pro?'#dcfce7':'#fef3c7',color:pro?'#166534':'#92400e',fontSize:11,fontWeight:900}}>{pro?'PRO UNLOCKED':'FREE PLAY'}</span></div>{render()}{!pro&&<div style={{marginTop:22,borderRadius:16,padding:20,background:'linear-gradient(135deg,#eef2ff,#f5f3ff)',border:'1px solid #c7d2fe'}}><div style={{fontSize:11,fontWeight:900,color:'#4338ca',textTransform:'uppercase'}}>Unlock the full potential</div><h3 style={{margin:'5px 0'}}>Turn games into a richer learning journey.</h3><p style={{margin:0,color:'#475569',lineHeight:1.6,fontSize:13}}>Unlock full game libraries, additional levels, themed challenges, personal progress insights and the complete Career Quest experience. Your game activity remains private and is not used to overwrite psychometric results.</p><button onClick={onUnlock} style={{...primaryBtn,marginTop:14}}>🔓 Unlock Games Pro</button></div>}</main></div></div></div>;
}

const cardStyle={background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:22,boxShadow:'0 7px 25px rgba(15,23,42,.04)'};
