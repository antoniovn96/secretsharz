import React, { useEffect } from 'react';
import { X, Mail, Calendar, GraduationCap, Users, BookOpen, Clock, AlertCircle, CheckCircle, Link, TrendingUp, Building2, Briefcase, ShieldCheck, Edit3, Archive } from 'lucide-react';

const RIASEC_LABELS = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };

const dateLabel = value => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function SlideOutDetailPanel({ user, isOpen, onClose, onEdit, onArchive, isLoading = false, error = '' }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handler = event => { if (event.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const identity = user?.identity || {};
  const institution = user?.institution || {};
  const academic = user?.academic || {};
  const assignment = user?.assignment || {};
  const assessment = user?.assessment || {};
  const profile = user?.profile || {};
  const guardians = user?.guardians || {};
  const name = identity.fullName || user?.name || user?.preferredName || 'Student';
  const studentId = user?.ssStudentId || user?.authUid || user?.id || 'Pending';
  const scores = assessment.riasecScores || user?.riasecScores || {};

  return <>
    <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
    <aside role="dialog" aria-modal="true" aria-labelledby="student-detail-title" className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5">
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">Career Guidance · Student Record</p><h2 id="student-detail-title" className="mt-1 truncate text-xl font-bold text-slate-900">{name}</h2><p className="mt-1 truncate font-mono text-xs text-slate-500">{studentId}</p></div>
        <button type="button" onClick={onClose} aria-label="Close student record" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 p-5">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700" role="alert">{error}</div>}
        {isLoading && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500" role="status">Loading the authorized student record…</div>}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatusCard label="Profile" value={profile.status === 'complete' ? 'Complete' : 'Incomplete'} ok={profile.status === 'complete'} />
          <StatusCard label="RIASEC" value={assessment.status === 'complete' ? assessment.riasecCode || 'Complete' : 'Pending'} ok={assessment.status === 'complete'} />
          <StatusCard label="Assignment" value={assignment.status === 'assigned' ? 'Assigned' : 'Unassigned'} ok={assignment.status === 'assigned'} />
          <StatusCard label="Enrollment" value={institution.enrollmentStatus || 'Active'} ok={(institution.enrollmentStatus || 'active') === 'active'} />
        </div>

        <SectionCard title="Identity & contact" icon={ShieldCheck}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><InfoItem icon={Mail} label="Email" value={user?.contact?.email || user?.email || 'Not provided'} /><InfoItem icon={Calendar} label="Created" value={dateLabel(user?.governance?.createdAt || user?.createdAt)} /><InfoItem icon={Building2} label="Institution" value={institution.name || 'Not set'} /><InfoItem icon={BookOpen} label="Academic year" value={institution.academicYear || 'Not set'} /></div>
        </SectionCard>

        <SectionCard title="Academic details" icon={GraduationCap}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><InfoItem icon={BookOpen} label="Grade / class" value={academic.grade || 'Not set'} /><InfoItem icon={BookOpen} label="Section" value={academic.section || 'Not set'} /><InfoItem icon={BookOpen} label="Curriculum" value={academic.curriculum || 'Not set'} /><InfoItem icon={BookOpen} label="Stream" value={academic.stream || 'Not set'} /></div>
          {Array.isArray(academic.subjects) && academic.subjects.length > 0 && <p className="mt-4 text-sm text-slate-600"><span className="font-semibold">Subjects:</span> {academic.subjects.join(', ')}</p>}
        </SectionCard>

        <SectionCard title="Career assessment" icon={TrendingUp}>
          {assessment.status === 'complete' ? <>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold tracking-[0.2em] text-emerald-700">{assessment.riasecCode}</span><span className="text-xs text-slate-500">Completed {dateLabel(assessment.completedAt)}</span></div>
            {Object.keys(scores).length > 0 && <div className="mt-4 space-y-2">{Object.entries(scores).filter(([key]) => RIASEC_LABELS[key]).sort((a,b) => Number(b[1]) - Number(a[1])).map(([key, value]) => <div key={key} className="flex items-center gap-3"><div className="w-8 text-xs font-bold text-slate-700">{key}</div><div className="flex-1"><div className="mb-1 flex justify-between text-xs text-slate-500"><span>{RIASEC_LABELS[key]}</span><span>{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, Number(value) || 0) / 12 * 100)}%` }} /></div></div></div>)}</div>}
          </> : <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-800"><AlertCircle className="h-5 w-5" />RIASEC assessment has not been completed.</div>}
        </SectionCard>

        <SectionCard title="Relationships" icon={Link}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><RelationshipItem icon={Building2} label="Institution" value={institution.name || 'Not linked'} /><RelationshipItem icon={Briefcase} label="Career professional" value={assignment.professionalName || 'Not assigned'} /><RelationshipItem icon={Users} label="Guardians" value={`${guardians.count || 0} linked`} /></div>
          {Array.isArray(guardians.relationships) && guardians.relationships.length > 0 && <div className="mt-3 space-y-2">{guardians.relationships.map((guardian, index) => <div key={`${guardian.relationship}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"><span className="font-medium text-slate-700">{guardian.name || 'Guardian'} <span className="text-slate-400">· {guardian.relationship || 'guardian'}</span></span><span className="text-xs text-slate-500">{guardian.consentStatus || 'Consent status not recorded'}</span></div>)}</div>}
        </SectionCard>

        <SectionCard title="Governance" icon={ShieldCheck}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><InfoItem icon={CheckCircle} label="Consent" value={formatConsent(user?.governance?.consent)} /><InfoItem icon={Clock} label="Last updated" value={dateLabel(user?.governance?.updatedAt || user?.updatedAt)} /></div>
          {profile.status === 'incomplete' && profile.missing?.length > 0 && <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800"><span className="font-semibold">Core profile missing:</span> {profile.missing.join(', ')}</div>}
        </SectionCard>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white">Close</button><div className="flex gap-2"><button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"><Edit3 className="h-4 w-4" />Edit</button><button type="button" onClick={onArchive} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"><Archive className="h-4 w-4" />Archive</button></div></div>
    </aside>
  </>;
}

function formatConsent(consent) {
  if (!consent) return 'Not recorded';
  if (typeof consent === 'object') {
    const values = Object.entries(consent).filter(([, value]) => value).map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, value => value.toUpperCase()));
    return values.length ? values.join(', ') : 'Not recorded';
  }
  return String(consent);
}

function StatusCard({ label, value, ok }) { return <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 text-xs font-bold ${ok ? 'text-emerald-700' : 'text-amber-700'}`}>{value}</p></div>; }
function SectionCard({ title, icon: Icon, children }) { return <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3"><Icon className="h-4 w-4 text-slate-500" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">{title}</h3></div><div className="p-4">{children}</div></section>; }
function InfoItem({ icon: Icon, label, value }) { return <div className="flex items-start gap-2"><Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" /><div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-800">{value || '—'}</p></div></div>; }
function RelationshipItem({ icon: Icon, label, value }) { return <div className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-xs text-slate-400"><Icon className="h-4 w-4" />{label}</div><p className="mt-1 truncate text-sm font-semibold text-slate-800">{value || '—'}</p></div>; }
