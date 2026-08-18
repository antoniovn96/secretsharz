import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Users, CheckCircle2, Clock3, FileText, RefreshCw, LogOut, ExternalLink, Search } from 'lucide-react';
import { auth } from '../../firebase';

const InstitutionDashboard = ({ currentUser, userData, onBack, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const user = auth.currentUser || currentUser;
      if (!user) throw new Error('Authentication required.');
      const token = await user.getIdToken(true);
      const institutionId = userData?.institutionId || userData?.institution?.id || '';
      const url = institutionId ? `/api/institution/dashboard?institutionId=${encodeURIComponent(institutionId)}` : '/api/institution/dashboard';
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load institution dashboard.');
      setData(payload);
    } catch (err) { setError(err?.message || 'Unable to load institution dashboard.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [currentUser?.uid, userData?.institutionId]);

  const students = useMemo(() => {
    const rows = data?.students || [];
    const needle = search.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(student => [student.fullName, student.className, student.section, student.rollNumber, student.status].some(value => String(value || '').toLowerCase().includes(needle)));
  }, [data, search]);

  const summary = data?.summary || {};
  const institution = data?.institution || {};
  const percentage = (value) => summary.total ? Math.min(100, (value / summary.total) * 100) : 0;

  const Stat = ({ icon: Icon, label, value, detail }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icon className="w-5 h-5" /></div><span className="text-xs font-bold text-slate-400">LIVE</span></div>
      <div className="mt-4 text-3xl font-black text-slate-900">{value}</div><div className="mt-1 text-sm font-bold text-slate-600">{label}</div>{detail && <div className="mt-1 text-xs text-slate-400">{detail}</div>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto bg-[#f6f8fb] text-slate-900">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1500px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0"><button onClick={onBack} title="Back to Secret Sharz" className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm hover:bg-emerald-600"><ExternalLink className="w-4 h-4" /></button><div className="min-w-0"><div className="text-[10px] uppercase tracking-[0.16em] font-black text-slate-400">Secret Sharz · Institution</div><h1 className="font-black text-lg truncate">{institution.name || userData?.institutionName || 'Institution Dashboard'}</h1></div></div>
          <div className="flex items-center gap-2"><button onClick={load} className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs flex items-center gap-2 hover:bg-slate-50"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh</button><button onClick={onLogout} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs flex items-center gap-2 hover:text-red-600 hover:bg-red-50"><LogOut className="w-3.5 h-3.5" />Sign out</button></div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-5 md:px-8 py-7">
        <div className="mb-7"><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">Coordinator Dashboard</p><h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Good morning, {userData?.name || currentUser?.displayName || 'Coordinator'}.</h2><p className="text-slate-500 mt-2 max-w-2xl">Manage your institution's Secret Sharz participation, student roster and programme progress from one place.</p></div>
        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm font-semibold">{error}</div>}
        <div className="flex gap-2 mb-5 overflow-x-auto"><button onClick={() => setActiveTab('overview')} className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Overview</button><button onClick={() => setActiveTab('students')} className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${activeTab === 'students' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Students</button></div>

        {loading && !data ? <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center"><RefreshCw className="w-7 h-7 animate-spin mx-auto text-emerald-500" /><p className="mt-3 text-sm font-semibold text-slate-500">Loading your institution workspace...</p></div> : activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><Stat icon={Users} label="Students" value={summary.total || 0} detail={`${summary.claimed || 0} activated`} /><Stat icon={Clock3} label="Started" value={summary.started || 0} detail="Assessment journey" /><Stat icon={CheckCircle2} label="Completed" value={summary.completed || 0} detail="Assessment journey" /><Stat icon={FileText} label="Reports ready" value={summary.reportsReady || 0} detail="Available to authorised users" /></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5"><section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-black text-lg">Institution profile</h3><p className="text-sm text-slate-500 mt-1">Your coordinator access and programme entitlement.</p></div><Building2 className="w-6 h-6 text-emerald-500" /></div><div className="grid sm:grid-cols-2 gap-4 mt-6"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400 uppercase">Institution code</p><p className="font-mono font-black mt-1">{institution.tenantCode || '—'}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400 uppercase">Status</p><p className="font-black mt-1 capitalize">{institution.status || '—'}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400 uppercase">Payment</p><p className="font-black mt-1 capitalize">{institution.paymentStatus || '—'}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400 uppercase">Purchased licenses</p><p className="font-black mt-1">{institution.licenses?.purchased || 0}</p></div></div></section><section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><h3 className="font-black text-lg">Programme progress</h3><div className="mt-6 space-y-5"><div><div className="flex justify-between text-xs font-bold"><span>Activated students</span><span>{Math.round(percentage(summary.claimed || 0))}%</span></div><div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: `${percentage(summary.claimed || 0)}%`}} /></div></div><div><div className="flex justify-between text-xs font-bold"><span>Completed</span><span>{Math.round(percentage(summary.completed || 0))}%</span></div><div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{width: `${percentage(summary.completed || 0)}%`}} /></div></div></div></section></div>
          </>
        ) : (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"><div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-400" /></div><span className="text-xs font-bold text-slate-500">{students.length} shown</span></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="text-left px-5 py-3 text-xs font-black text-slate-500">Student</th><th className="text-left px-5 py-3 text-xs font-black text-slate-500">Class</th><th className="text-left px-5 py-3 text-xs font-black text-slate-500">Status</th><th className="text-left px-5 py-3 text-xs font-black text-slate-500">Assessment</th><th className="text-left px-5 py-3 text-xs font-black text-slate-500">Report</th></tr></thead><tbody className="divide-y divide-slate-100">{students.map(student => <tr key={student.id} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="font-black text-slate-900">{student.fullName || 'Unnamed Student'}</div><div className="text-xs text-slate-400 mt-1">{student.rollNumber || 'No roll number'}</div></td><td className="px-5 py-4 font-semibold text-slate-700">{student.className || '—'} {student.section ? `· ${student.section}` : ''}</td><td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${student.status === 'claimed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{student.status}</span></td><td className="px-5 py-4 font-semibold text-slate-700 capitalize">{String(student.assessmentStatus || '').replace(/_/g, ' ')}</td><td className="px-5 py-4 font-semibold text-slate-700 capitalize">{String(student.reportStatus || '').replace(/_/g, ' ')}</td></tr>)}</tbody></table>{students.length === 0 && <div className="p-12 text-center text-slate-500 font-semibold">No students found.</div>}</div></section>
        )}
      </main>
    </div>
  );
};

export default InstitutionDashboard;
