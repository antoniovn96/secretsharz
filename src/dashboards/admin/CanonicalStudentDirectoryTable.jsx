import React, { useMemo, useState } from 'react';
import { Search, Download, Eye, Edit3, Trash2, SlidersHorizontal, X } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const pathMeta = {
  career: { label: 'Career', className: 'bg-emerald-50 text-emerald-700' },
  wellbeing: { label: 'Wellbeing', className: 'bg-violet-50 text-violet-700' },
  sen: { label: 'SEN', className: 'bg-amber-50 text-amber-700' },
  unassigned: { label: 'Unassigned', className: 'bg-slate-100 text-slate-600' },
};

const getPath = user => String(user?.primary_path || user?.studentTrack || 'unassigned').toLowerCase();
const getAssessmentCode = user => user?.careerDNA?.riasec?.code || user?.riasecCode || '';
const getAssessmentStatus = user => getAssessmentCode(user) ? 'complete' : 'pending';
const getStudentId = user => user?.ssStudentId || '';

export default function CanonicalStudentDirectoryTable({ users = [], isLoading = false, onViewDetails, onDelete, onEdit, theme = 'light' }) {
  const dark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [path, setPath] = useState('all');
  const [assessment, setAssessment] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(user => {
      const values = [user?.name, user?.preferredName, user?.email, getStudentId(user), user?.id, user?.schoolName, user?.institutionName, user?.grade, getAssessmentCode(user)];
      const matchesQuery = !q || values.some(value => String(value || '').toLowerCase().includes(q));
      const matchesPath = path === 'all' || getPath(user) === path;
      const matchesAssessment = assessment === 'all' || getAssessmentStatus(user) === assessment;
      return matchesQuery && matchesPath && matchesAssessment;
    }).sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || '')));
  }, [users, query, path, assessment]);

  const exportCsv = () => {
    const headers = ['Student ID', 'Name', 'Email', 'School', 'Grade', 'Section', 'Path', 'RIASEC', 'Profile'];
    const rows = filtered.map(user => [getStudentId(user) || 'Pending', user?.name || '', user?.email || '', user?.schoolName || user?.institutionName || '', user?.grade || '', user?.section || '', getPath(user), getAssessmentCode(user), user?.profileComplete ? 'Complete' : 'Incomplete']);
    const quote = value => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(quote).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secret-sharz-${getPath(users[0] || {}) || 'students'}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className={`rounded-xl border ${dark ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-white'} p-12 text-center text-sm text-slate-500`}>Loading students...</div>;

  return (
    <div className={`rounded-xl border overflow-hidden ${dark ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-white'}`}>
      <div className={`p-4 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, Student ID, email, school, RIASEC..." className={`w-full pl-10 pr-9 py-2.5 rounded-lg border text-sm outline-none ${dark ? 'bg-[#0b1220] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
              {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}
            </div>
            <button onClick={() => setShowFilters(v => !v)} className={`px-3 py-2 rounded-lg border text-sm font-semibold flex items-center gap-2 ${dark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}><SlidersHorizontal className="w-4 h-4" /> Filters</button>
          </div>
          <div className="flex items-center gap-3 justify-between">
            <span className="text-xs text-slate-500">{filtered.length} of {users.length} students</span>
            <button onClick={exportCsv} className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Download className="w-3.5 h-3.5" /> Export CSV</button>
          </div>
        </div>
        {showFilters && <div className={`mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg ${dark ? 'bg-[#0b1220]' : 'bg-slate-50'}`}>
          <label className="text-xs font-semibold text-slate-500">Path<select value={path} onChange={e => setPath(e.target.value)} className="mt-1 w-full p-2 rounded-lg border bg-transparent"><option value="all">All paths</option><option value="career">Career</option><option value="wellbeing">Wellbeing</option><option value="sen">SEN</option></select></label>
          <label className="text-xs font-semibold text-slate-500">RIASEC<select value={assessment} onChange={e => setAssessment(e.target.value)} className="mt-1 w-full p-2 rounded-lg border bg-transparent"><option value="all">All statuses</option><option value="complete">Complete</option><option value="pending">Pending</option></select></label>
        </div>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className={dark ? 'bg-[#0b1220]' : 'bg-slate-50'}><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3">Student</th><th className="px-5 py-3">School / Grade</th><th className="px-5 py-3">Path</th><th className="px-5 py-3">Assessment</th><th className="px-5 py-3">Profile</th><th className="px-5 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {!filtered.length ? <tr><td colSpan={6} className="p-14 text-center text-sm text-slate-500">No students match the current search or filters.</td></tr> : filtered.map(user => {
              const identity = getProfileIdentity(user);
              const meta = pathMeta[getPath(user)] || pathMeta.unassigned;
              const code = getAssessmentCode(user);
              return <tr key={user.id} onClick={() => onViewDetails?.(user)} className={`cursor-pointer ${dark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'}`}>
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden font-bold text-xs ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{identity.photoURL ? <img src={identity.photoURL} alt="" className="w-full h-full object-cover" /> : (identity.initial || 'S')}</div><div className="min-w-0"><div className={`font-semibold text-sm truncate max-w-[260px] ${dark ? 'text-white' : 'text-slate-900'}`}>{user?.name || user?.preferredName || 'Name pending'}</div><div className="text-[11px] font-mono text-slate-500">{getStudentId(user) || 'Student ID pending'}</div></div></div></td>
                <td className="px-5 py-4"><div className={`text-xs font-semibold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{user?.schoolName || user?.institutionName || 'School not set'}</div><div className="text-[11px] text-slate-500 mt-1">{user?.grade || 'Grade not set'}{user?.section ? ` · ${user.section}` : ''}</div></td>
                <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${meta.className}`}>{meta.label}</span></td>
                <td className="px-5 py-4"><div className="flex flex-col gap-1"><span className={`inline-flex w-fit px-2.5 py-1 rounded-md text-[10px] font-bold ${code ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{code ? 'RIASEC Complete' : 'RIASEC Pending'}</span>{code && <span className="text-[10px] font-bold tracking-widest text-slate-500">{code}</span>}</div></td>
                <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ${user?.profileComplete ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{user?.profileComplete ? 'Complete' : 'Incomplete'}</span></td>
                <td className="px-5 py-4"><div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}><button title="View" onClick={() => onViewDetails?.(user)} className="p-2 rounded-md text-slate-400 hover:text-black hover:bg-slate-100"><Eye className="w-4 h-4" /></button><button title="Edit" onClick={() => onEdit?.(user)} className="p-2 rounded-md text-slate-400 hover:text-black hover:bg-slate-100"><Edit3 className="w-4 h-4" /></button><button title="Delete" onClick={() => onDelete?.(user)} className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <div className={`px-5 py-3 text-[11px] text-slate-500 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>Student ID is the Secret Sharz human-facing identifier. Firebase UID is kept internal and is never displayed here.</div>
    </div>
  );
}
