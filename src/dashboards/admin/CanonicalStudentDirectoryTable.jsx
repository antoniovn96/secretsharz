import React, { useMemo, useState } from 'react';
import { Search, Download, Eye, Edit3, Archive, UserRoundCog, SlidersHorizontal, X, ArrowUpDown, AlertCircle } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';
import { getAssessmentCode, getAssessmentStatus, getNeedsAttention, getProfileStatus, getSortValue, getStudentId, getStudentPath } from '../../platform/adminStudentDirectory';

const pathMeta = {
  career: { label: 'Career', className: 'bg-emerald-50 text-emerald-700' },
  wellbeing: { label: 'Wellbeing', className: 'bg-violet-50 text-violet-700' },
  sen: { label: 'SEN', className: 'bg-amber-50 text-amber-700' },
  unassigned: { label: 'Unassigned', className: 'bg-slate-100 text-slate-600' },
};

const dateLabel = value => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function CanonicalStudentDirectoryTable({ users = [], isLoading = false, filterOptions = {}, onViewDetails, onDelete, onEdit, onAssign, theme = 'light' }) {
  const dark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [institution, setInstitution] = useState('all');
  const [grade, setGrade] = useState('all');
  const [assessment, setAssessment] = useState('all');
  const [profile, setProfile] = useState('all');
  const [counsellor, setCounsellor] = useState('all');
  const [academicYear, setAcademicYear] = useState('all');
  const [enrollment, setEnrollment] = useState('all');
  const [attention, setAttention] = useState('all');
  const [sort, setSort] = useState('name');
  const [ascending, setAscending] = useState(true);

  const activeFilterCount = [institution, grade, assessment, profile, counsellor, academicYear, enrollment, attention].filter(value => value !== 'all').length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = users.filter(user => {
      const values = [user?.name, user?.preferredName, user?.email, getStudentId(user), user?.schoolName, user?.institutionName, user?.grade, user?.section, user?.academicYear, user?.assignedProfessionalName, getAssessmentCode(user)];
      const matchesQuery = !q || values.some(value => String(value || '').toLowerCase().includes(q));
      return matchesQuery
        && (institution === 'all' || (user.institutionName || user.schoolName) === institution)
        && (grade === 'all' || user.grade === grade)
        && (assessment === 'all' || getAssessmentStatus(user) === assessment)
        && (profile === 'all' || getProfileStatus(user) === profile)
        && (counsellor === 'all' || (user.assignedProfessionalName || 'Unassigned') === counsellor)
        && (academicYear === 'all' || user.academicYear === academicYear)
        && (enrollment === 'all' || (user.enrollmentStatus || 'active') === enrollment)
        && (attention === 'all' || String(getNeedsAttention(user)) === attention);
    });
    return result.sort((a, b) => {
      const left = getSortValue(a, sort);
      const right = getSortValue(b, sort);
      if (typeof left === 'number' && typeof right === 'number') return ascending ? left - right : right - left;
      return ascending ? String(left).localeCompare(String(right), undefined, { numeric: true }) : String(right).localeCompare(String(left), undefined, { numeric: true });
    });
  }, [users, query, institution, grade, assessment, profile, counsellor, academicYear, enrollment, attention, sort, ascending]);

  const resetFilters = () => { setInstitution('all'); setGrade('all'); setAssessment('all'); setProfile('all'); setCounsellor('all'); setAcademicYear('all'); setEnrollment('all'); setAttention('all'); };

  const exportCsv = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Institution', 'Grade', 'Section', 'Academic Year', 'Path', 'Assessment Status', 'RIASEC', 'Profile Status', 'Assigned Professional', 'Enrollment', 'Last Activity'];
    const rows = filtered.map(user => [getStudentId(user), user?.name || user?.preferredName || '', user?.email || '', user?.institutionName || user?.schoolName || '', user?.grade || '', user?.section || '', user?.academicYear || '', getStudentPath(user), getAssessmentStatus(user), getAssessmentCode(user), getProfileStatus(user), user?.assignedProfessionalName || 'Unassigned', user?.enrollmentStatus || 'active', user?.lastActivityAt || '']);
    const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(quote).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `secret-sharz-career-students-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className={`rounded-2xl border ${dark ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-white'} p-12 text-center text-sm text-slate-500`}>Loading student directory…</div>;

  return <div className={`rounded-2xl border overflow-hidden ${dark ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-white'}`}>
    <div className={`p-4 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-2xl">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input aria-label="Search students" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, Student ID, email, institution, grade, RIASEC…" className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-[#0b1220] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
            {query && <button aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}
          </div>
          <button aria-expanded={showFilters} aria-controls="student-directory-filters" onClick={() => setShowFilters(value => !value)} className={`px-3 py-2 rounded-xl border text-sm font-semibold flex items-center gap-2 ${dark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}><SlidersHorizontal className="w-4 h-4" /> Filters {activeFilterCount > 0 && <span className="inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">{activeFilterCount}</span>}</button>
        </div>
        <div className="flex items-center gap-3 justify-between"><span className="text-xs text-slate-500">{filtered.length} of {users.length} students</span><button onClick={exportCsv} disabled={!filtered.length} className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-40 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Download className="w-3.5 h-3.5" /> Export current view</button></div>
      </div>
      {showFilters && <div id="student-directory-filters" className={`mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl ${dark ? 'bg-[#0b1220]' : 'bg-slate-50'}`}>
        <Filter label="Institution" value={institution} onChange={setInstitution} options={filterOptions.institutions || []} />
        <Filter label="Grade" value={grade} onChange={setGrade} options={filterOptions.grades || []} />
        <Filter label="Assessment" value={assessment} onChange={setAssessment} options={['complete','pending']} labels={{ complete: 'Complete', pending: 'Pending' }} />
        <Filter label="Profile" value={profile} onChange={setProfile} options={['complete','incomplete']} labels={{ complete: 'Complete', incomplete: 'Incomplete' }} />
        <Filter label="Counsellor" value={counsellor} onChange={setCounsellor} options={['Unassigned', ...(filterOptions.counsellors || [])]} />
        <Filter label="Academic year" value={academicYear} onChange={setAcademicYear} options={filterOptions.academicYears || []} />
        <Filter label="Enrollment" value={enrollment} onChange={setEnrollment} options={['active','inactive']} labels={{ active: 'Active', inactive: 'Inactive' }} />
        <Filter label="Needs attention" value={attention} onChange={setAttention} options={['true','false']} labels={{ true: 'Needs attention', false: 'No attention flag' }} />
        <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-1"><span className="text-[11px] text-slate-500">Filters apply to the current service directory.</span><button onClick={resetFilters} className="text-xs font-semibold text-emerald-700 hover:underline">Reset filters</button></div>
      </div>}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1350px]"><caption className="sr-only">Student directory</caption>
        <thead className={dark ? 'bg-[#0b1220]' : 'bg-slate-50'}><tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
          <SortableHeader label="Student" field="name" sort={sort} ascending={ascending} onSort={(field) => { setSort(field); setAscending(sort === field ? !ascending : true); }} />
          <SortableHeader label="Institution / Grade" field="institution" sort={sort} ascending={ascending} onSort={(field) => { setSort(field); setAscending(sort === field ? !ascending : true); }} />
          <th className="px-5 py-3">Path</th><SortableHeader label="Assessment" field="assessment" sort={sort} ascending={ascending} onSort={(field) => { setSort(field); setAscending(sort === field ? !ascending : true); }} />
          <SortableHeader label="Profile" field="profile" sort={sort} ascending={ascending} onSort={(field) => { setSort(field); setAscending(sort === field ? !ascending : true); }} />
          <th className="px-5 py-3">Assigned professional</th><th className="px-5 py-3">Last activity</th><th className="px-5 py-3 text-right">Actions</th>
        </tr></thead>
        <tbody className={dark ? 'divide-y divide-slate-800' : 'divide-y divide-slate-100'}>
          {!filtered.length ? <tr><td colSpan={8} className="p-14 text-center"><div className="flex flex-col items-center gap-2 text-slate-500"><AlertCircle className="w-5 h-5" /><p className="text-sm font-medium">No students match the current search or filters.</p></div></td></tr> : filtered.map(user => {
            const identity = getProfileIdentity(user); const meta = pathMeta[getStudentPath(user)] || pathMeta.unassigned; const code = getAssessmentCode(user); const profileStatus = getProfileStatus(user); const attentionFlag = getNeedsAttention(user); const assigned = Boolean(user?.assignedProfessionalId || user?.assignedProfessionalName);
            return <tr key={user.id} onClick={() => onViewDetails?.(user)} className={`cursor-pointer ${attentionFlag ? (dark ? 'bg-amber-950/10 hover:bg-amber-950/20' : 'bg-amber-50/30 hover:bg-amber-50/60') : (dark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50')}`}>
              <td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden font-bold text-xs ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{identity.photoURL ? <img src={identity.photoURL} alt="" className="w-full h-full object-cover" /> : (identity.initial || 'S')}</div><div className="min-w-0"><div className={`font-semibold text-sm truncate max-w-[220px] ${dark ? 'text-white' : 'text-slate-900'}`}>{user?.name || user?.preferredName || 'Name pending'}</div><div className="text-[11px] font-mono text-slate-500">{getStudentId(user) || 'Student ID pending'}</div></div></div></td>
              <td className="px-5 py-4"><div className={`text-xs font-semibold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{user?.institutionName || user?.schoolName || 'Institution not set'}</div><div className="text-[11px] text-slate-500 mt-1">{user?.grade || 'Grade not set'}{user?.section ? ` · ${user.section}` : ''}</div></td>
              <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${meta.className}`}>{meta.label}</span></td>
              <td className="px-5 py-4"><div className="flex flex-col gap-1"><span className={`inline-flex w-fit px-2.5 py-1 rounded-md text-[10px] font-bold ${code ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{getAssessmentStatus(user) === 'complete' ? 'RIASEC Complete' : 'RIASEC Pending'}</span>{code && <span className="text-[10px] font-bold tracking-widest text-slate-500">{code}</span>}</div></td>
              <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ${profileStatus === 'complete' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{profileStatus === 'complete' ? 'Complete' : 'Incomplete'}</span>{profileStatus === 'incomplete' && user.profileMissing?.length > 0 && <div className="mt-1 text-[10px] text-slate-400">Missing: {user.profileMissing.join(', ')}</div>}</td>
              <td className="px-5 py-4"><div className="text-xs font-semibold text-slate-700">{user?.assignedProfessionalName || 'Unassigned'}</div><div className="text-[10px] text-slate-400 mt-1">{assigned ? 'Active assignment' : 'No counsellor assigned'}</div></td>
              <td className="px-5 py-4"><div className="text-xs text-slate-600">{dateLabel(user.lastActivityAt)}</div></td>
              <td className="px-5 py-4"><div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}><IconButton label="View student" onClick={() => onViewDetails?.(user)}><Eye className="w-4 h-4" /></IconButton><IconButton label={assigned ? 'Reassign counsellor' : 'Assign counsellor'} onClick={() => onAssign?.(user)}><UserRoundCog className="w-4 h-4" /></IconButton><IconButton label="Edit student" onClick={() => onEdit?.(user)}><Edit3 className="w-4 h-4" /></IconButton><IconButton label="Archive student" danger onClick={() => onDelete?.(user)}><Archive className="w-4 h-4" /></IconButton></div></td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    <div className={`px-5 py-3 text-[11px] text-slate-500 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>Student ID is the Secret Sharz human-facing identifier. Firebase UID is kept internal. Assignment changes are handled separately from profile editing and are authorization-sensitive.</div>
  </div>;
}

function Filter({ label, value, onChange, options, labels = {} }) { return <label className="text-xs font-semibold text-slate-500">{label}<select aria-label={label} value={value} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700"><option value="all">All</option>{options.map(option => <option key={option} value={option}>{labels[option] || option}</option>)}</select></label>; }
function SortableHeader({ label, field, sort, ascending, onSort }) { return <th className="px-5 py-3"><button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 font-bold uppercase tracking-wider hover:text-slate-900" aria-label={`Sort by ${label}`}><span>{label}</span><ArrowUpDown className={`w-3 h-3 ${sort === field ? 'text-emerald-600' : 'text-slate-400'}`} />{sort === field && <span className="sr-only">{ascending ? 'ascending' : 'descending'}</span>}</button></th>; }
function IconButton({ label, onClick, danger = false, children }) { return <button type="button" aria-label={label} title={label} onClick={onClick} className={`p-2 rounded-lg ${danger ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>{children}</button>; }
