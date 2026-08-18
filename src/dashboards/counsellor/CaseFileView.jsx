import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';

const CaseFileView = ({ studentId, currentUser }) => {
  const { navigate } = useDashboard();
  const [studentData, setStudentData] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [soap, setSoap] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const providerId = currentUser?.uid || auth.currentUser?.uid;
        const studentRef = doc(db, 'users', studentId);
        const snapshot = await getDoc(studentRef);
        if (!snapshot.exists()) {
          setSaveMessage({ text: 'Student record not found.', type: 'error' });
          return;
        }

        const data = snapshot.data();
        const isAdmin = data?.role === 'super_admin' || currentUser?.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';
        const assignedPsychologist = data?.assignedStaff?.psychologistId || data?.assignedStaff?.psychologyId;
        if (!isAdmin && assignedPsychologist !== providerId) {
          setAccessDenied(true);
          return;
        }

        if (data.primary_path !== 'wellbeing' && !isAdmin) {
          setAccessDenied(true);
          return;
        }

        setStudentData(data);

        // Use the student's actual mood check-ins instead of placeholder data.
        try {
          const logsSnapshot = await getDocs(query(collection(db, 'users', studentId, 'mood_logs'), orderBy('timestamp', 'desc'), limit(30)));
          const rows = logsSnapshot.docs.map(item => {
            const log = item.data();
            const timestamp = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp || 0);
            return {
              date: Number.isNaN(timestamp.getTime()) ? '' : timestamp.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
              mood: Number(log.moodValue) || 0,
            };
          }).filter(row => row.mood >= 1 && row.mood <= 5).reverse();
          setMoodData(rows);
        } catch (_) {
          setMoodData([]);
        }
      } catch (err) {
        console.error('Error fetching assigned case file:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId && currentUser) fetchStudentData();
  }, [studentId, currentUser]);

  const handleSoapChange = (e) => setSoap({ ...soap, [e.target.name]: e.target.value });

  const handleSaveSession = async (e) => {
    e.preventDefault();
    if (!soap.subjective && !soap.objective && !soap.assessment && !soap.plan) {
      setSaveMessage({ text: 'Cannot save an empty note.', type: 'error' });
      return;
    }
    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });
    try {
      const providerId = auth.currentUser?.uid || currentUser?.uid;
      if (!providerId) throw new Error('Professional identity is unavailable.');
      await addDoc(collection(db, 'users', studentId, 'sessions'), {
        providerId,
        timestamp: serverTimestamp(),
        soap: { ...soap }
      });
      setSaveMessage({ text: 'Session note saved securely.', type: 'success' });
      setSoap({ subjective: '', objective: '', assessment: '', plan: '' });
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error saving session note:', err);
      setSaveMessage({ text: 'Failed to save session note.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-black text-slate-900">Case access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">This case is not assigned to your counselling psychology account.</p>
          <button onClick={() => navigate('/provider/psychologist')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Back to Caseload</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center shadow-sm">
        <button onClick={() => navigate('/provider/psychologist')} className="text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-2 transition-colors"><span>←</span> Back to Caseload</button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold">{studentData?.name ? studentData.name.charAt(0) : 'S'}</div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{studentData?.name || 'Unknown Student'}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500"><span>🏫 {studentData?.schoolName || 'N/A'}</span><span>🎓 {studentData?.grade || 'N/A'}</span></div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm"><p className="font-bold text-slate-800 mb-1">Parent Contact</p><p className="text-slate-600">{studentData?.parentName || 'Not Provided'}</p><p className="text-indigo-600 font-semibold">{studentData?.parentContact || 'N/A'}</p></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span>📈</span> Mood Check-in Trend</h2>
          {moodData.length === 0 ? (
            <div className="h-48 flex items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-slate-500">No mood check-in data is available for this case.</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={val => ({ 5: '😄', 4: '🙂', 3: '😐', 2: '😟', 1: '😢' }[val] || val)} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} labelStyle={{ fontWeight: 'bold', color: '#1e293b' }} />
                  <Line type="monotone" dataKey="mood" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#4f46e5' }} activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><span>📝</span> Clinical Session Notes</h2><span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">SOAP Format</span></div>
          <form onSubmit={handleSaveSession} className="space-y-6">
            {[
              ['subjective', 'Subjective (S)', 'What the client reports feeling or experiencing.'],
              ['objective', 'Objective (O)', 'What you directly observed (body language, affect, measurable data).'],
              ['assessment', 'Assessment (A)', 'Your clinical analysis and synthesis of S and O.'],
              ['plan', 'Plan (P)', 'Next steps, homework, or interventions discussed.']
            ].map(([name, label, hint]) => (
              <div key={name} className="space-y-2"><label className="text-sm font-bold text-slate-700">{label}</label><p className="text-xs text-slate-500 mb-1">{hint}</p><textarea name={name} value={soap[name]} onChange={handleSoapChange} rows="3" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" /></div>
            ))}
            {saveMessage.text && <div className={`p-4 rounded-xl font-semibold text-sm ${saveMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{saveMessage.text}</div>}
            <button type="submit" disabled={isSaving} className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{isSaving ? 'Saving securely...' : '🔒 Securely Save Session Note'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaseFileView;
