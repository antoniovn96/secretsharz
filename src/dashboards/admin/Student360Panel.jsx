import React, { useEffect, useMemo, useState } from 'react';
import { X, User, Route, ClipboardCheck, Users, History, ShieldCheck, Calendar, GraduationCap, HeartHandshake, BriefcaseBusiness, Brain, BookOpen } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

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

const Badge = ({ children, tone = 'slate' }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold bg-${tone}-50 text-${tone}-700`}>
    {children}
  </span>
);

const Section = ({ title, icon: Icon, children }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-slate-500" />
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
    </div>
    {children}
  </section>
);

const Student360Panel = ({ student, isOpen, onClose }) => {
  const [record, setRecord] = useState(student || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !student?.id) return;
    setActiveTab('overview');
    setRecord(student);
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const snapshot = await getDoc(doc(db, 'users', student.id));
        if (mounted && snapshot.exists()) setRecord({ id: snapshot.id, ...snapshot.data() });
      } catch (error) {
        console.error('[Student360Panel] failed to load student record:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isOpen, student?.id]);

  const pathKey = record?.primary_path || record?.primaryPath || record?.path;
  const path = PATHS[pathKey];
  const services = useMemo(() => {
    const memberships = Array.isArray(record?.serviceMemberships) ? record.serviceMemberships : [];
    const keys = memberships.map(item => typeof item === 'string' ? item : item?.service).filter(Boolean);
    if (pathKey && !keys.includes(pathKey)) keys.unshift(pathKey);
    return [...new Set(keys)];
  }, [record, pathKey]);

  if (!isOpen || !record) return null;

  const tabs = [
    ['overview', 'Overview', User],
    ['journey', 'Human Journey', Route],
    ['assessments', 'Assessments', ClipboardCheck],
    ['relationships', 'Relationships', Users],
    ['history', 'Decision History', History],
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-4xl flex-col overflow-hidden bg-slate-50 shadow-2xl">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-bold text-white">
                {record.photoURL || record.photoUrl || record.profilePicture ? (
                  <img src={record.photoURL || record.photoUrl || record.profilePicture} alt="" className="h-full w-full object-cover" />
                ) : initials(getName(record))}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{getName(record)}</h2>
                  <Badge tone="emerald">Student Master Record</Badge>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-500">{record.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close Student 360">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {path ? <Badge tone={path.tone}>{path.label} · Primary journey</Badge> : <Badge>Primary journey not selected</Badge>}
            {record.profileComplete || record.onboardingCompleted ? <Badge tone="emerald">Profile complete</Badge> : <Badge tone="amber">Profile incomplete</Badge>}
            {record.parentId ? <Badge tone="blue">Guardian linked</Badge> : <Badge>Guardian not linked</Badge>}
          </div>
        </header>

        <nav className="border-b border-slate-200 bg-white px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(([key, label, Icon]) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${activeTab === key ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </nav>

        <main className="relative flex-1 overflow-y-auto p-6">
          {loading && <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow">Refreshing record…</div>}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Section title="Identity" icon={User}><p className="text-sm text-slate-600">Email: {record.email || 'Not provided'}</p><p className="mt-2 text-sm text-slate-600">Joined: {fmtDate(record.createdAt || record.onboardingDate)}</p></Section>
                <Section title="Academic" icon={GraduationCap}><p className="text-sm text-slate-600">Grade: {record.grade || record.classLevel || 'Not recorded'}</p><p className="mt-2 text-sm text-slate-600">School: {record.schoolName || 'Not recorded'}</p></Section>
                <Section title="Continuity" icon={Calendar}><p className="text-sm text-slate-600">Sessions: {record.sessionsAttended || 0}</p><p className="mt-2 text-sm text-slate-600">Assessments: {record.assessmentsCompleted || 0}</p></Section>
              </div>
              <Section title="Service Memberships" icon={ShieldCheck}>
                <div className="flex flex-wrap gap-2">{services.length ? services.map(key => <Badge key={key}>{PATHS[key]?.label || key}</Badge>) : <span className="text-sm text-slate-500">No service membership recorded.</span>}</div>
                <p className="mt-4 text-xs text-slate-400">Membership visibility is administrative metadata; specialist records remain inside their authorised domain.</p>
              </Section>
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="space-y-5">
              <Section title="Primary Journey" icon={Route}>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Current routing state</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{path?.label || 'No primary journey selected'}</p>
                  <p className="mt-2 text-sm text-slate-600">{record.primaryJourneyDecisionAt ? `Selected ${fmtDate(record.primaryJourneyDecisionAt)}` : 'No decision timestamp recorded.'}</p>
                </div>
              </Section>
              <Section title="Goals & Milestones" icon={BookOpen}>
                {Array.isArray(record.goals) && record.goals.length ? <ul className="space-y-2">{record.goals.map((goal, index) => <li key={goal.id || index} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{goal.title || goal.name || String(goal)}</li>)}</ul> : <p className="text-sm text-slate-500">No shared journey goals recorded yet.</p>}
              </Section>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-5">
              <Section title="Assessment Continuity" icon={ClipboardCheck}>
                <div className="grid gap-3 sm:grid-cols-3"><Metric label="Completed" value={record.assessmentsCompleted || 0} /><Metric label="RIASEC" value={record.riasecCode || record.careerDNA?.riasec?.code || '—'} /><Metric label="XP" value={record.xp || record.exPoints || 0} /></div>
              </Section>
              <Section title="Assessment Results" icon={ClipboardCheck}><p className="text-sm text-slate-500">Detailed assessment results should be opened through their authorised specialist workflow. Student 360 shows status and continuity, not unrestricted professional content.</p></Section>
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="space-y-5">
              <Section title="Guardian Relationship" icon={Users}><Relationship value={record.parentId ? `Linked guardian · ${record.parentId}` : 'No guardian relationship recorded'} /></Section>
              <Section title="Professional Relationships" icon={Users}><Relationship value={record.assignedCounsellorId ? `Assigned counsellor · ${record.assignedCounsellorId}` : 'No counsellor assignment recorded'} /></Section>
              <p className="text-xs text-slate-400">Relationship metadata is surfaced here; private counselling notes, safeguarding records and specialist case content remain domain-restricted.</p>
            </div>
          )}

          {activeTab === 'history' && (
            <Section title="Immutable Decision History" icon={History}>
              {Array.isArray(record.decisionHistory) && record.decisionHistory.length ? <div className="space-y-3">{record.decisionHistory.map((event, index) => <div key={event.id || index} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-800">{event.action || event.type || 'Journey decision'}</p><span className="text-xs text-slate-400">{fmtDate(event.createdAt || event.timestamp)}</span></div><p className="mt-1 text-sm text-slate-600">{event.summary || event.reason || 'Recorded platform decision.'}</p></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5"><p className="text-sm font-semibold text-slate-600">No decision history events are available in this record yet.</p><p className="mt-1 text-xs text-slate-400">Do not fabricate historical events. Future primary-journey changes must append an immutable event.</p></div>}
            </Section>
          )}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-3"><p className="text-xs text-slate-400">Student 360 is a continuity and administrative workspace, not a substitute for specialist records.</p><button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button></div>
        </footer>
      </aside>
    </>
  );
};

const Metric = ({ label, value }) => <div className="rounded-xl bg-slate-50 p-4"><p className="text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>;
const Relationship = ({ value }) => <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">{value}</div>;

export default Student360Panel;
