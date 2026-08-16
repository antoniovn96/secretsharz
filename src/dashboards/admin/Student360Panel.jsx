import React, { useEffect, useMemo, useState } from 'react';
import { X, User, Route, ClipboardCheck, Users, History, ShieldCheck, Calendar, GraduationCap, HeartHandshake, BriefcaseBusiness, Brain, BookOpen, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth } from '../../firebase';

const PATHS = {
  wellbeing: { label: 'Emotional Wellbeing', icon: HeartHandshake, tone: 'purple' },
  sen: { label: 'Learning & SEN', icon: Brain, tone: 'amber' },
  career: { label: 'Career Discovery', icon: BriefcaseBusiness, tone: 'emerald' },
};

const fmtDate = value => {
  if (!value) return 'Not recorded';
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getName = user => user?.displayName || user?.name || 'Student';
const initials = name => name.split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase() || 'S';

const Badge = ({ children, tone = 'slate' }) => <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold bg-${tone}-50 text-${tone}-700`}>{children}</span>;
const Section = ({ title, icon: Icon, children }) => <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><Icon className="h-4 w-4 text-slate-500" /><h3 className="text-sm font-bold text-slate-900">{title}</h3></div>{children}</section>;
const Metric = ({ label, value }) => <div className="rounded-xl bg-slate-50 p-4"><p className="text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>;
const Relationship = ({ value }) => <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">{value}</div>;

const Student360Panel = ({ student, isOpen, onClose }) => {
  const [record, setRecord] = useState(student || null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [savingJourney, setSavingJourney] = useState(false);
  const [journeyError, setJourneyError] = useState('');
  const [journeySuccess, setJourneySuccess] = useState('');
  const [nextPath, setNextPath] = useState('');
  const [reason, setReason] = useState('');

  const loadRecord = async () => {
    if (!student?.id) return;
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required.');
      const idToken = await currentUser.getIdToken(true);
      const response = await fetch(`/api/admin/student-360?id=${encodeURIComponent(student.id)}`, { headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to load the Student 360 record.');
      setRecord(payload.student || student);
      setHistory(Array.isArray(payload.decisionHistory) ? payload.decisionHistory : []);
    } catch (error) {
      console.error('[Student360Panel] failed to load sanitised record:', error);
      setJourneyError(error?.message || 'Unable to load the Student 360 record.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!isOpen || !student?.id) return;
    setActiveTab('overview'); setRecord(student); setHistory([]); setJourneyError(''); setJourneySuccess(''); setNextPath(''); setReason('');
    loadRecord();
  }, [isOpen, student?.id]);

  const pathKey = record?.primary_path || record?.primaryPath || record?.path;
  const path = PATHS[pathKey];
  const services = useMemo(() => {
    const keys = Array.isArray(record?.serviceMemberships) ? record.serviceMemberships.filter(Boolean) : [];
    if (pathKey && !keys.includes(pathKey)) keys.unshift(pathKey);
    return [...new Set(keys)];
  }, [record, pathKey]);

  const changeJourney = async event => {
    event.preventDefault();
    setJourneyError(''); setJourneySuccess('');
    if (!nextPath || !reason.trim()) { setJourneyError('Select a new journey and provide a reason.'); return; }
    setSavingJourney(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required.');
      const idToken = await currentUser.getIdToken(true);
      const response = await fetch('/api/admin/student-journey', { method: 'POST', headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUid: record.id, nextPath, expectedPreviousPath: pathKey || null, reason: reason.trim() }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to change the student journey.');
      setJourneySuccess(`Journey changed to ${PATHS[payload.nextPath]?.label || payload.nextPath}. Decision recorded.`);
      setNextPath(''); setReason('');
      await loadRecord();
    } catch (error) { setJourneyError(error?.message || 'Unable to change the student journey.'); }
    finally { setSavingJourney(false); }
  };

  if (!isOpen || !record) return null;
  const tabs = [['overview', 'Overview', User], ['journey', 'Human Journey', Route], ['assessments', 'Assessments', ClipboardCheck], ['relationships', 'Relationships', Users], ['history', 'Decision History', History]];

  return <>
    <div className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
    <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-4xl flex-col overflow-hidden bg-slate-50 shadow-2xl">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-bold text-white">{record.photoURL ? <img src={record.photoURL} alt="" className="h-full w-full object-cover" /> : initials(getName(record))}</div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-slate-900">{getName(record)}</h2><Badge tone="emerald">Student Master Record</Badge></div><p className="mt-1 font-mono text-xs text-slate-500">{record.id}</p></div></div><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close Student 360"><X className="h-5 w-5" /></button></div>
        <div className="mt-5 flex flex-wrap gap-2">{path ? <Badge tone={path.tone}>{path.label} · Primary journey</Badge> : <Badge>Primary journey not selected</Badge>}{record.profileComplete || record.onboardingCompleted ? <Badge tone="emerald">Profile complete</Badge> : <Badge tone="amber">Profile incomplete</Badge>}{record.parentId ? <Badge tone="blue">Guardian linked</Badge> : <Badge>Guardian not linked</Badge>}</div>
      </header>
      <nav className="border-b border-slate-200 bg-white px-6"><div className="flex gap-1 overflow-x-auto">{tabs.map(([key, label, Icon]) => <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${activeTab === key ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><Icon className="h-4 w-4" />{label}</button>)}</div></nav>
      <main className="relative flex-1 overflow-y-auto p-6">
        {loading && <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow">Refreshing record…</div>}
        {activeTab === 'overview' && <div className="space-y-5"><div className="grid gap-4 md:grid-cols-3"><Section title="Identity" icon={User}><p className="text-sm text-slate-600">Email: {record.email || 'Not provided'}</p><p className="mt-2 text-sm text-slate-600">Joined: {fmtDate(record.createdAt)}</p></Section><Section title="Academic" icon={GraduationCap}><p className="text-sm text-slate-600">Grade: {record.grade || 'Not recorded'}</p><p className="mt-2 text-sm text-slate-600">School: {record.schoolName || 'Not recorded'}</p></Section><Section title="Continuity" icon={Calendar}><p className="text-sm text-slate-600">Sessions: {record.sessionsAttended || 0}</p><p className="mt-2 text-sm text-slate-600">Assessments: {record.assessmentsCompleted || 0}</p></Section></div><Section title="Service Memberships" icon={ShieldCheck}><div className="flex flex-wrap gap-2">{services.length ? services.map(key => <Badge key={key}>{PATHS[key]?.label || key}</Badge>) : <span className="text-sm text-slate-500">No service membership recorded.</span>}</div><p className="mt-4 text-xs text-slate-400">Membership visibility is administrative metadata; specialist records remain inside their authorised domain.</p></Section></div>}
        {activeTab === 'journey' && <div className="space-y-5"><Section title="Primary Journey" icon={Route}><div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Current routing state</p><p className="mt-1 text-lg font-bold text-slate-900">{path?.label || 'No primary journey selected'}</p><p className="mt-2 text-sm text-slate-600">{record.primaryJourneyDecisionAt ? `Selected ${fmtDate(record.primaryJourneyDecisionAt)}` : 'No decision timestamp recorded.'}</p></div></Section><Section title="Change Primary Journey" icon={Save}><form onSubmit={changeJourney} className="space-y-4"><div><label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">New journey</label><select value={nextPath} onChange={e => setNextPath(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" disabled={savingJourney}><option value="">Select a journey…</option>{Object.entries(PATHS).filter(([key]) => key !== pathKey).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div><div><label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Reason for decision</label><textarea value={reason} onChange={e => setReason(e.target.value)} maxLength={500} rows={3} placeholder="Why is the student's primary journey being changed?" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" disabled={savingJourney} /></div>{journeyError && <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{journeyError}</div>}{journeySuccess && <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{journeySuccess}</div>}<div className="flex justify-end"><button type="submit" disabled={savingJourney || !nextPath || !reason.trim()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{savingJourney ? 'Saving decision…' : 'Save journey decision'}</button></div></form></Section><Section title="Goals & Milestones" icon={BookOpen}>{record.goals?.length ? <ul className="space-y-2">{record.goals.map((goal, index) => <li key={goal.id || index} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{goal.title}</li>)}</ul> : <p className="text-sm text-slate-500">No shared journey goals recorded yet.</p>}</Section></div>}
        {activeTab === 'assessments' && <div className="space-y-5"><Section title="Assessment Continuity" icon={ClipboardCheck}><div className="grid gap-3 sm:grid-cols-3"><Metric label="Completed" value={record.assessmentsCompleted || 0} /><Metric label="RIASEC" value={record.riasecCode || '—'} /><Metric label="XP" value={record.xp || 0} /></div></Section><Section title="Assessment Results" icon={ClipboardCheck}><p className="text-sm text-slate-500">Detailed assessment results must be opened through their authorised specialist workflow. Student 360 shows status and continuity, not unrestricted professional content.</p></Section></div>}
        {activeTab === 'relationships' && <div className="space-y-5"><Section title="Guardian Relationship" icon={Users}><Relationship value={record.parentId ? `Linked guardian · ${record.parentId}` : 'No guardian relationship recorded'} /></Section><Section title="Professional Relationships" icon={Users}><Relationship value={record.assignedCounsellorId ? `Assigned counsellor · ${record.assignedCounsellorId}` : 'No counsellor assignment recorded'} /></Section><p className="text-xs text-slate-400">Relationship metadata is surfaced here; private counselling notes, safeguarding records and specialist case content remain domain-restricted.</p></div>}
        {activeTab === 'history' && <Section title="Immutable Decision History" icon={History}>{history.length ? <div className="space-y-3">{history.map(event => <div key={event.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-800">{event.previousPath ? `${PATHS[event.previousPath]?.label || event.previousPath} → ${PATHS[event.nextPath]?.label || event.nextPath}` : PATHS[event.nextPath]?.label || 'Journey decision'}</p><span className="text-xs text-slate-400">{fmtDate(event.createdAt)}</span></div><p className="mt-1 text-sm text-slate-600">{event.reason || 'Recorded platform decision.'}</p><p className="mt-2 text-xs text-slate-400">Recorded by {event.actorEmail || 'authorised administrator'} · {event.source || 'ADMIN_STUDENT_360'}</p></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5"><p className="text-sm font-semibold text-slate-600">No decision history events are available in this record yet.</p><p className="mt-1 text-xs text-slate-400">Historical events are never fabricated. Future journey changes append a new immutable event.</p></div>}</Section>}
      </main>
      <footer className="border-t border-slate-200 bg-white px-6 py-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-slate-400">Student 360 is a continuity and administrative workspace, not a substitute for specialist records.</p><button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button></div></footer>
    </aside>
  </>;
};

export default Student360Panel;
