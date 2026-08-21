import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Edit3, Trash2, Eye, X, Download, SlidersHorizontal } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const PATH_COLORS = {
  wellbeing: { light: 'bg-purple-50 text-purple-700', dark: 'bg-white/10 text-white' },
  sen: { light: 'bg-amber-50 text-amber-700', dark: 'bg-white/10 text-white' },
  career: { light: 'bg-emerald-50 text-emerald-700', dark: 'bg-white/10 text-white' },
  unassigned: { light: 'bg-slate-100 text-slate-600', dark: 'bg-white/10 text-[#aaa]' },
};

const asText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    return asText(value.international || value.number || value.display || value.label || value.name || value.code || value.cityName || value.countryName || '');
  }
  return '';
};

const getPath = user => {
  const raw = asText(user?.primary_path || user?.path || user?.studentTrack || 'unassigned').toLowerCase();
  return ['wellbeing', 'sen', 'career'].includes(raw) ? raw : 'unassigned';
};

const getAssessmentStatus = user => {
  const code = asText(user?.careerDNA?.riasec?.code || user?.riasecCode);
  return code.trim() || user?.assessmentCompletedAt || user?.careerAssessment?.completedAt ? 'completed' : 'pending';
};

const getProfileStatus = user => user?.profileComplete === true || user?.onboardingCompleted === true ? 'complete' : 'incomplete';

const getGrade = user => asText(user?.grade || user?.classLevel || user?.gradeLevel);
const getSchool = user => asText(user?.schoolName || user?.institutionName || user?.institution?.name);
const getRiasec = user => asText(user?.careerDNA?.riasec?.code || user?.riasecCode);

const UserDirectoryTable = ({ users = [], isLoading = false, onViewDetails, onDelete, onEdit, userRole = 'student', theme = 'light' }) => {
  const dark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPath, setFilterPath] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterAssessment, setFilterAssessment] = useState('all');
  const [filterProfile, setFilterProfile] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const gradeOptions = useMemo(() => {
    const grades = [...new Set(users.map(getGrade).filter(Boolean))];
    return grades.sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const q = searchQuery.trim().toLowerCase();
    if (q) result = result.filter(user => [
      user.name, user.email, getGrade(user), getSchool(user), user.id, getRiasec(user), getPath(user),
      user?.contact?.mobile, user?.phone, user?.contactNumber,
    ].map(asText).some(value => value.toLowerCase().includes(q)));
    if (filterPath !== 'all') result = result.filter(user => getPath(user) === filterPath);
    if (filterGrade !== 'all') result = result.filter(user => getGrade(user) === filterGrade);
    if (filterAssessment !== 'all') result = result.filter(user => getAssessmentStatus(user) === filterAssessment);
    if (filterProfile !== 'all') result = result.filter(user => getProfileStatus(user) === filterProfile);
    result.sort((a, b) => {
      const getValue = user => {
        if (sortConfig.key === 'grade') return getGrade(user);
        if (sortConfig.key === 'path') return getPath(user);
        if (sortConfig.key === 'assessment') return getAssessmentStatus(user);
        if (sortConfig.key === 'profile') return getProfileStatus(user);
        return asText(user?.[sortConfig.key]);
      };
      let aVal = getValue(a), bVal = getValue(b);
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [users, searchQuery, filterPath, filterGrade, filterAssessment, filterProfile, sortConfig]);

  const activeFilterCount = [filterPath, filterGrade, filterAssessment, filterProfile].filter(value => value !== 'all').length;
  const handleSort = key => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const clearFilters = () => { setSearchQuery(''); setFilterPath('all'); setFilterGrade('all'); setFilterAssessment('all'); setFilterProfile('all'); };

  const exportCsv = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Grade', 'School', 'Path', 'RIASEC', 'Assessment', 'Profile'];
    const rows = filteredUsers.map(user => [user.id, asText(user.name), asText(user.email), getGrade(user), getSchool(user), getPath(user), getRiasec(user), getAssessmentStatus(user), getProfileStatus(user)]);
    const escape = value => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `secret-sharz-students-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  const SortIcon = ({ columnKey }) => sortConfig.key !== columnKey ? <ChevronDown className={`w-3.5 h-3.5 ${dark ? 'text-[#555]' : 'text-slate-300'}`} /> : sortConfig.direction === 'asc' ? <ChevronUp className={`w-3.5 h-3.5 ${dark ? 'text-white' : 'text-slate-700'}`} /> : <ChevronDown className={`w-3.5 h-3.5 ${dark ? 'text-white' : 'text-slate-700'}`} />;
  const getPathBadge = path => {
    const label = path === 'wellbeing' ? 'Wellbeing' : path === 'sen' ? 'SEN' : path === 'career' ? 'Career' : 'Unassigned';
    const palette = PATH_COLORS[path] || PATH_COLORS.unassigned;
    return <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${dark ? palette.dark : palette.light}`}>{label}</span>;
  };

  const surface = dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200';
  const header = dark ? 'bg-[#111] border-[#292929]' : 'bg-slate-50 border-slate-100';
  const primaryText = dark ? 'text-white' : 'text-slate-900';
  const secondaryText = dark ? 'text-[#999]' : 'text-slate-500';
  const control = dark ? 'bg-[#111] border-[#303030] text-white placeholder:text-[#555]' : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400';
  const hoverRow = dark ? 'hover:bg-white/[0.035]' : 'hover:bg-slate-50';

  if (isLoading) return <div className={`${surface} border rounded-lg overflow-hidden`}><div className="p-8 flex flex-col items-center justify-center h-64"><div className={`w-8 h-8 border-2 rounded-full animate-spin mb-4 ${dark ? 'border-[#444] border-t-white' : 'border-slate-200 border-t-black'}`} /><p className={`${secondaryText} text-sm font-medium`}>Loading students...</p></div></div>;

  return (
    <div className={`${surface} border rounded-lg overflow-hidden`}>
      <div className={`p-4 border-b ${dark ? 'border-[#292929]' : 'border-slate-100'} space-y-3`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[360px]"><Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${secondaryText}`} /><input type="text" placeholder="Search name, email, school, ID, RIASEC..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-9 py-2.5 border rounded-lg text-xs focus:outline-none focus:ring-1 ${dark ? 'focus:ring-white' : 'focus:ring-slate-400'} ${control}`} />{searchQuery && <button onClick={() => setSearchQuery('')} className={`absolute right-3 top-1/2 -translate-y-1/2 ${secondaryText}`}><X className="w-3.5 h-3.5" /></button>}</div>
            <button onClick={() => setShowFilters(prev => !prev)} className={`relative flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold ${dark ? 'border-[#303030] bg-[#111] text-[#ccc] hover:bg-white/5' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}><SlidersHorizontal className="w-3.5 h-3.5" /> Filters{activeFilterCount > 0 && <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{activeFilterCount}</span>}</button>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end"><span className={`${secondaryText} text-xs font-medium`}>{filteredUsers.length} of {users.length} students</span><button onClick={exportCsv} className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-xs font-semibold ${dark ? 'border-[#303030] bg-white text-black hover:bg-[#e5e5e5]' : 'border-slate-200 bg-black text-white hover:bg-slate-800'}`}><Download className="w-3.5 h-3.5" /> Export CSV</button></div>
        </div>
        {showFilters && <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-3 rounded-lg border ${dark ? 'bg-[#111] border-[#292929]' : 'bg-slate-50 border-slate-100'}`}><FilterSelect dark={dark} label="Learning Path" value={filterPath} onChange={setFilterPath} options={[['all','All paths'],['wellbeing','Wellbeing'],['sen','SEN'],['career','Career'],['unassigned','Unassigned']]} /><FilterSelect dark={dark} label="Grade / Class" value={filterGrade} onChange={setFilterGrade} options={[['all','All grades'], ...gradeOptions.map(grade => [grade, grade])]} /><FilterSelect dark={dark} label="RIASEC Assessment" value={filterAssessment} onChange={setFilterAssessment} options={[['all','All statuses'],['completed','Completed'],['pending','Pending']]} /><FilterSelect dark={dark} label="Profile" value={filterProfile} onChange={setFilterProfile} options={[['all','All profiles'],['complete','Complete'],['incomplete','Incomplete']]} />{activeFilterCount > 0 && <button onClick={clearFilters} className="sm:col-span-2 xl:col-span-4 text-[10px] font-bold text-red-500 hover:text-red-400 text-left">Clear all filters</button>}</div>}
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1080px]"><thead><tr className={`border-b ${header}`}><SortableHeader label="Student" columnKey="name" onSort={handleSort} SortIcon={SortIcon} dark={dark} /><SortableHeader label="School / Grade" columnKey="grade" onSort={handleSort} SortIcon={SortIcon} dark={dark} /><SortableHeader label="Path" columnKey="path" onSort={handleSort} SortIcon={SortIcon} dark={dark} /><SortableHeader label="Assessment" columnKey="assessment" onSort={handleSort} SortIcon={SortIcon} dark={dark} /><SortableHeader label="Profile" columnKey="profile" onSort={handleSort} SortIcon={SortIcon} dark={dark} /><th className={`px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider ${secondaryText}`}>Actions</th></tr></thead>
        <tbody className={`divide-y ${dark ? 'divide-[#292929]' : 'divide-slate-100'}`}>
          {filteredUsers.length === 0 ? <tr><td colSpan={6} className="px-4 py-14 text-center"><div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${dark ? 'bg-white/5' : 'bg-slate-100'}`}><Search className={`w-6 h-6 ${dark ? 'text-[#555]' : 'text-slate-300'}`} /></div><p className={`${primaryText} font-semibold text-sm mb-1`}>No students found</p><p className={`${secondaryText} text-xs`}>Try adjusting your search or filters.</p></td></tr> : filteredUsers.map(user => {
            const assessment = getAssessmentStatus(user), profile = getProfileStatus(user), identity = getProfileIdentity(user);
            return <tr key={asText(user.id) || identity.name} className={`${hoverRow} transition-colors cursor-pointer group`} onClick={() => onViewDetails?.(user)}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><ProfileAvatar user={user} dark={dark} /><div className="min-w-0"><p className={`${primaryText} font-semibold text-sm truncate max-w-[220px]`}>{asText(identity.name)}</p><p className={`${secondaryText} text-[10px] font-mono truncate max-w-[220px]`}>{asText(user.id)}</p></div></div></td>
              <td className="px-4 py-3"><p className={`${dark ? 'text-[#ddd]' : 'text-slate-700'} text-xs font-semibold`}>{getSchool(user) || 'School not set'}</p><p className={`${secondaryText} text-[10px] mt-0.5`}>{getGrade(user) || 'Grade not set'}</p></td>
              <td className="px-4 py-3">{getPathBadge(getPath(user))}</td>
              <td className="px-4 py-3"><div className="flex flex-col gap-1"><span className={`inline-flex w-fit px-2 py-1 rounded-md text-[10px] font-bold ${dark ? 'bg-white/10 text-white' : assessment === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{assessment === 'completed' ? 'RIASEC Complete' : 'RIASEC Pending'}</span>{getRiasec(user) && <span className={`${secondaryText} text-[10px] font-bold tracking-wider`}>{getRiasec(user)}</span>}</div></td>
              <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${dark ? 'bg-white/10 text-white' : profile === 'complete' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{profile === 'complete' ? 'Complete' : 'Incomplete'}</span></td>
              <td className="px-4 py-3"><div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}><ActionButton dark={dark} title="View details" onClick={() => onViewDetails?.(user)}><Eye className="w-3.5 h-3.5" /></ActionButton><ActionButton dark={dark} title="Open student record" onClick={() => onEdit?.(user)}><Edit3 className="w-3.5 h-3.5" /></ActionButton><ActionButton dark={dark} title="Delete student" onClick={() => onDelete?.(user)} danger><Trash2 className="w-3.5 h-3.5" /></ActionButton></div></td>
            </tr>;
          })}
        </tbody></table></div>
      {filteredUsers.length > 0 && <div className={`px-4 py-3 border-t flex items-center justify-between ${dark ? 'border-[#292929] bg-[#111]' : 'border-slate-100 bg-slate-50/50'}`}><p className={`${secondaryText} text-[10px]`}>Showing {filteredUsers.length} of {users.length} students</p><p className={`${secondaryText} text-[10px]`}>Click a row to open the student master record</p></div>}
    </div>
  );
};

const ProfileAvatar = ({ user, dark, className = 'w-9 h-9' }) => {
  const identity = getProfileIdentity(user);
  const [imageFailed, setImageFailed] = useState(false);
  if (identity.photoURL && !imageFailed) return <img src={identity.photoURL} alt="" className={`${className} rounded-lg object-cover ${dark ? 'bg-[#222]' : 'bg-slate-100'}`} onError={() => setImageFailed(true)} />;
  return <div className={`${className} rounded-lg flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'} font-bold text-xs`}>{identity.initial || 'S'}</div>;
};

const SortableHeader = ({ label, columnKey, onSort, SortIcon, dark }) => <th className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider cursor-pointer ${dark ? 'text-[#888] hover:text-white' : 'text-slate-500 hover:text-slate-800'}`} onClick={() => onSort(columnKey)}><div className="flex items-center gap-1.5">{label}<SortIcon columnKey={columnKey} /></div></th>;

const FilterSelect = ({ label, value, onChange, options, dark }) => <label className="block"><span className={`block text-[9px] font-bold uppercase tracking-wide mb-1 ${dark ? 'text-[#777]' : 'text-slate-400'}`}>{label}</span><div className="relative"><select value={value} onChange={e => onChange(e.target.value)} className={`w-full appearance-none px-3 py-2 bg-transparent border rounded-lg text-xs font-medium focus:outline-none ${dark ? 'border-[#303030] text-white' : 'border-slate-200 text-slate-700'}`}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue} className={dark ? 'bg-[#151515] text-white' : ''}>{optionLabel}</option>)}</select><ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? 'text-[#666]' : 'text-slate-400'}`} /></div></label>;

const ActionButton = ({ children, onClick, title, dark, danger = false }) => <button onClick={onClick} title={title} className={`p-2 rounded-md transition-all ${danger ? (dark ? 'text-[#777] hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50') : (dark ? 'text-[#777] hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-black hover:bg-slate-100')}`}>{children}</button>;

export default UserDirectoryTable;
