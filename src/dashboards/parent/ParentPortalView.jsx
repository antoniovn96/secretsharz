import React, { useState, useEffect } from 'react';

const ParentPortalView = ({ userData, currentUser }) => {
  const dynamicName = userData?.name || currentUser?.displayName || 'Parent';
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [parentInfo, setParentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        if (!currentUser) throw new Error('Authentication required.');
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/parent/overview', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load your parent space.');
        if (cancelled) return;
        setParentInfo(payload.parent || null);
        setChildren(Array.isArray(payload.children) ? payload.children : []);
        setSelectedChildId(payload.children?.[0]?.id || '');
      } catch (error) {
        if (!cancelled) setErrorMsg(error?.message || 'Unable to load your parent space.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [currentUser]);

  const childData = children.find(child => child.id === selectedChildId) || children[0] || null;

  const renderCareer = () => {
    if (!childData?.services?.career) return null;
    if (!childData.career?.released) return <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200"><h2 className="text-2xl font-bold text-stone-800">Career Guidance</h2><p className="text-sm text-stone-500 mt-3">Career information has not been explicitly released for parent viewing yet.</p></div>;
    return <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200"><div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4"><div className="flex items-center gap-3"><span className="text-3xl bg-indigo-100 p-2 rounded-xl">🗺️</span><h2 className="text-2xl font-bold text-stone-800">Career Guidance</h2></div>{childData.career.hollandCode&&<div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 text-center"><span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Career Profile</span><span className="block text-xl font-black text-indigo-600">{childData.career.hollandCode}</span></div>}</div><div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">{childData.career.roadmapSummary || 'No published career roadmap summary is available yet.'}</p></div><p className="text-xs text-stone-500 mt-4">Only information intentionally released for parent access is shown.</p></div>;
  };

  const renderSEN = () => {
    if (!childData?.services?.sen) return null;
    if (!childData.sen?.released) return <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200"><div className="flex items-center gap-3 mb-4"><span className="text-3xl bg-amber-100 p-2 rounded-xl">🏗️</span><h2 className="text-2xl font-bold text-stone-800">Learning Support</h2></div><p className="text-sm text-stone-500">Learning-support information will appear here only after the SEN team explicitly releases it for parent viewing.</p></div>;
    return <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200"><div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4"><span className="text-3xl bg-amber-100 p-2 rounded-xl">🏗️</span><h2 className="text-2xl font-bold text-stone-800">Learning Support Overview</h2></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3 className="text-lg font-bold text-stone-700 mb-3">🎯 Published Goals</h3>{childData.sen.goals.length?<ul className="space-y-3">{childData.sen.goals.map((goal,index)=><li key={index} className="flex items-start gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100"><span className="text-amber-600 font-bold">•</span><span className="text-sm text-stone-600">{goal}</span></li>)}</ul>:<p className="text-sm text-stone-500 italic">No published learning goals are available yet.</p>}</div><div><h3 className="text-lg font-bold text-stone-700 mb-3">🪪 Published Accommodations</h3>{childData.sen.accommodations.length?<div className="flex flex-wrap gap-2">{childData.sen.accommodations.map((item,index)=><span key={index} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">✓ {item}</span>)}</div>:<p className="text-sm text-stone-500 italic">No published accommodations are available yet.</p>}</div></div></div>;
  };

  const renderWellbeing = () => {
    if (!childData?.services?.wellbeing) return null;
    return <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200"><div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4"><span className="text-3xl bg-teal-100 p-2 rounded-xl">🌿</span><h2 className="text-2xl font-bold text-stone-800">Wellbeing Support</h2></div><div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100 flex items-center gap-5"><div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm text-teal-600">✓</div><div><h3 className="text-lg font-bold text-stone-800 mb-1">Your child's wellbeing information is protected</h3><p className="text-sm text-stone-600 font-medium">Support information that is appropriate to share with you will appear here.</p><p className="text-xs text-stone-500 mt-2 italic">Clinical session notes and private therapeutic information are not displayed in the parent portal.</p></div></div></div>;
  };

  return <div className="flex min-h-screen bg-stone-50 font-sans"><div className="w-64 bg-white border-r border-stone-200 flex flex-col p-6 shadow-sm z-10"><div className="mb-10 mt-2"><h2 className="text-2xl font-black text-stone-800 tracking-tight">Secret Sharz</h2><p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Parent Portal</p></div><nav className="flex flex-col gap-2 flex-1"><button className="flex items-center gap-3 w-full px-4 py-3.5 bg-stone-100 text-stone-800 font-bold rounded-2xl"><span className="text-xl">📊</span> Child Overview</button><button className="flex items-center gap-3 w-full px-4 py-3.5 text-stone-500 hover:bg-stone-100 font-semibold rounded-2xl"><span className="text-xl">📄</span> Published Reports</button><button className="flex items-center gap-3 w-full px-4 py-3.5 text-stone-500 hover:bg-stone-100 font-semibold rounded-2xl"><span className="text-xl">📅</span> Upcoming Meetings</button><button className="flex items-center gap-3 w-full px-4 py-3.5 text-stone-500 hover:bg-stone-100 font-semibold rounded-2xl"><span className="text-xl">✍️</span> Consent Forms</button></nav></div><div className="flex-1 p-8 lg:p-12 overflow-y-auto"><div className="max-w-5xl mx-auto space-y-8"><div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"/><div className="relative z-10 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-4xl font-extrabold mb-3 tracking-tight">Welcome, {parentInfo?.name || dynamicName}</h1><p className="text-stone-300 text-lg font-medium">Here is the latest secure information available for your family.</p></div>{parentInfo?.relationship&&<span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold tracking-wide">{parentInfo.relationship}</span>}</div></div>{isLoading?<div className="flex flex-col items-center justify-center py-20"><div className="w-12 h-12 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin mb-4"/><p className="text-stone-500 font-medium">Loading secure family information...</p></div>:errorMsg?<div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center shadow-sm"><div className="text-4xl mb-4 opacity-50">📂</div><h3 className="text-lg font-bold text-red-800 mb-2">Unable to load your family space</h3><p className="text-sm text-red-600">{errorMsg}</p></div>:children.length===0?<div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-stone-200"><div className="text-4xl mb-4">👨‍👩‍👧‍👦</div><h3 className="text-xl font-bold text-stone-800 mb-2">Your family link is being prepared</h3><p className="text-sm text-stone-500">Your parent account has no currently linked student profiles.</p></div>:<>{children.length>1&&<div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200"><label className="block text-sm font-bold text-stone-700 mb-2">Select child</label><select value={selectedChildId} onChange={e=>setSelectedChildId(e.target.value)} className="w-full max-w-md px-4 py-3 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800">{children.map(child=><option key={child.id} value={child.id}>{child.name}{child.classLevel?` · ${child.classLevel}`:''} · {child.guardianRelationship}</option>)}</select></div>}{children.length===1&&<div className="text-sm font-semibold text-stone-500">Linked as {childData.guardianRelationship}</div>}<div className="space-y-8">{renderCareer()}{renderSEN()}{renderWellbeing()}</div></>}</div></div></div>;
};

export default ParentPortalView;
