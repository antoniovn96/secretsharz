import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const COMMON_ACCOMMODATIONS = ['Extra Time (25%)','Extra Time (50%)','Quiet Testing Area','Calculator Use','Visual Schedules','Sensory Breaks','Text-to-Speech Software','Scribe / Writer'];

const IEPBuilderView = ({ studentId, currentUser }) => {
  const { navigate } = useDashboard();
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [plop, setPlop] = useState('');
  const [goals, setGoals] = useState(['']);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  const authorizedRequest = async (path, options = {}) => {
    const user = auth.currentUser || currentUser;
    if (!user) throw new Error('Professional identity is unavailable.');
    const token = await user.getIdToken();
    const response = await fetch(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.error || 'Unable to complete the SEN request.');
    return body;
  };

  useEffect(() => {
    let cancelled = false;
    const fetchStudentData = async () => {
      try {
        const payload = await authorizedRequest(`/api/professional/sen/iep?studentId=${encodeURIComponent(studentId)}`);
        if (cancelled) return;
        setStudentData(payload.student || null);
        const latest = payload.ieps?.[0];
        if (latest) {
          setPlop(latest.plop || '');
          setGoals(Array.isArray(latest.goals) && latest.goals.length ? latest.goals : ['']);
          setSelectedAccommodations(Array.isArray(latest.accommodations) ? latest.accommodations : []);
        }
      } catch (err) {
        if (!cancelled) {
          setAccessDenied(err?.message?.toLowerCase().includes('assigned') || err?.message?.toLowerCase().includes('access'));
          setSaveMessage({ text: err?.message || 'Unable to load the SEN student record.', type: 'error' });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    if (studentId && currentUser) fetchStudentData();
    return () => { cancelled = true; };
  }, [studentId, currentUser]);

  const handleAddGoal = () => setGoals([...goals, '']);
  const handleGoalChange = (index, value) => { const next = [...goals]; next[index] = value; setGoals(next); };
  const handleRemoveGoal = index => { const next = [...goals]; next.splice(index, 1); setGoals(next); };
  const toggleAccommodation = acc => setSelectedAccommodations(current => current.includes(acc) ? current.filter(item => item !== acc) : [...current, acc]);

  const handleSaveIEP = async e => {
    e.preventDefault();
    if (!plop.trim() && goals.every(g => !g.trim()) && selectedAccommodations.length === 0) { setSaveMessage({ text: 'Cannot save an empty IEP.', type: 'error' }); return; }
    setIsSaving(true); setSaveMessage({ text: '', type: '' });
    try {
      await authorizedRequest(`/api/professional/sen/iep?studentId=${encodeURIComponent(studentId)}`, {
        method: 'POST',
        body: JSON.stringify({ plop, goals: goals.filter(g => g.trim() !== ''), accommodations: selectedAccommodations }),
      });
      setSaveMessage({ text: 'IEP saved securely to the SEN Master Record.', type: 'success' });
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error saving IEP:', err);
      setSaveMessage({ text: err?.message || 'Failed to save IEP.', type: 'error' });
    } finally { setIsSaving(false); }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div></div>;
  if (accessDenied) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"><div className="text-4xl mb-3">🔒</div><h1 className="text-xl font-black text-slate-900">IEP access restricted</h1><p className="mt-2 text-sm leading-6 text-slate-600">This student is not assigned to your SEN professional account.</p><button onClick={() => navigate('/provider/educator')} className="mt-5 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white">Back to SEN Caseload</button></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center shadow-sm"><button onClick={() => navigate('/provider/educator')} className="text-slate-500 hover:text-amber-600 font-semibold flex items-center gap-2"><span>←</span> Back to SEN Caseload</button></div>
      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6"><div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">{studentData?.name ? studentData.name.charAt(0) : 'S'}</div><div className="flex-1"><div className="flex flex-wrap items-center gap-3 mb-1"><h1 className="text-3xl font-extrabold text-slate-900">{studentData?.name || 'Unknown Student'}</h1><span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">IEP Workspace</span></div><div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500"><span>🏫 {studentData?.schoolName || 'N/A'}</span><span>🎓 {studentData?.grade || 'N/A'}</span>{studentData?.section&&<span>📚 {studentData.section}</span>}</div></div></div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"><div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100"><h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><span className="bg-amber-100 text-amber-600 p-2 rounded-xl text-xl">🏗️</span> Individualized Education Program</h2></div>
          <form onSubmit={handleSaveIEP} className="space-y-10">
            <div className="space-y-3"><label className="text-lg font-bold text-slate-800">Present Levels of Performance (PLOP)</label><p className="text-sm text-slate-500">Document the student's current academic and functional performance, including strengths and areas requiring support.</p><textarea value={plop} onChange={e => setPlop(e.target.value)} rows="5" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" /></div>
            <div className="space-y-4"><div><label className="text-lg font-bold text-slate-800">SMART Goals</label><p className="text-sm text-slate-500">By [Date], [Student] will [Action] with [Accuracy]% accuracy.</p></div><div className="space-y-3">{goals.map((goal,index) => <div key={index} className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold flex-shrink-0 mt-1">{index+1}</div><input type="text" value={goal} onChange={e => handleGoalChange(index,e.target.value)} className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />{goals.length>1 && <button type="button" onClick={() => handleRemoveGoal(index)} className="p-3 text-red-400 hover:text-red-600 rounded-xl">✕</button>}</div>)}</div><button type="button" onClick={handleAddGoal} className="text-amber-600 font-bold text-sm">+ Add another goal</button></div>
            <div className="space-y-4 pt-4 border-t border-slate-100"><label className="text-lg font-bold text-slate-800">Required Accommodations</label><p className="text-sm text-slate-500">Select the necessary structural or testing accommodations for this student.</p><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{COMMON_ACCOMMODATIONS.map(acc => { const selected=selectedAccommodations.includes(acc); return <button key={acc} type="button" onClick={() => toggleAccommodation(acc)} className={`p-4 rounded-xl border text-left font-semibold transition-all flex items-center justify-between ${selected ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}><span>{acc}</span>{selected&&<span className="text-emerald-500">✓</span>}</button>; })}</div></div>
            <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-between">{saveMessage.text?<div className={`p-4 rounded-xl font-semibold text-sm ${saveMessage.type==='error'?'bg-red-50 text-red-700':'bg-emerald-50 text-emerald-700'}`}>{saveMessage.text}</div>:<div/>}<button type="submit" disabled={isSaving} className={`px-8 py-4 rounded-xl font-extrabold text-white shadow-lg ${isSaving?'bg-amber-400':'bg-amber-500 hover:bg-amber-600'}`}>{isSaving?'Saving securely...':'🗄️ Save IEP to Master Record'}</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IEPBuilderView;
