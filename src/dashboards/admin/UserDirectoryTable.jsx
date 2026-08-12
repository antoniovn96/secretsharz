import React, { useMemo, useState } from 'react';
import {
  Search, ChevronDown, ChevronUp, Edit3, Trash2, Eye, X,
  Download, SlidersHorizontal
} from 'lucide-react';

const PATH_COLORS = {
  wellbeing: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  sen: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  career: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  unassigned: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const getPath = (user) => String(user?.primary_path || user?.studentTrack || 'unassigned').toLowerCase();

const getAssessmentStatus = (user) => {
  const code = user?.careerDNA?.riasec?.code || user?.riasecCode;
  return typeof code === 'string' && code.trim() ? 'completed' : 'pending';
};

const getProfileStatus = (user) => user?.profileComplete === true ? 'complete' : 'incomplete';

const UserDirectoryTable = ({
  users = [],
  isLoading = false,
  onViewDetails,
  onDelete,
  onEdit,
  userRole = 'student'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPath, setFilterPath] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterAssessment, setFilterAssessment] = useState('all');
  const [filterProfile, setFilterProfile] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const gradeOptions = useMemo(() => {
    const grades = [...new Set(users.map(user => user?.grade || user?.classLevel).filter(Boolean))];
    return grades.sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      result = result.filter(user => [
        user.name,
        user.email,
        user.grade,
        user.classLevel,
        user.schoolName,
        user.institutionName,
        user.id,
        user.riasecCode,
        user?.careerDNA?.riasec?.code,
      ].some(value => String(value || '').toLowerCase().includes(q)));
    }

    if (filterPath !== 'all') result = result.filter(user => getPath(user) === filterPath);
    if (filterGrade !== 'all') result = result.filter(user => (user.grade || user.classLevel) === filterGrade);
    if (filterAssessment !== 'all') result = result.filter(user => getAssessmentStatus(user) === filterAssessment);
    if (filterProfile !== 'all') result = result.filter(user => getProfileStatus(user) === filterProfile);

    result.sort((a, b) => {
      const getValue = (user) => {
        if (sortConfig.key === 'grade') return user.grade || user.classLevel || '';
        if (sortConfig.key === 'path') return getPath(user);
        if (sortConfig.key === 'assessment') return getAssessmentStatus(user);
        if (sortConfig.key === 'profile') return getProfileStatus(user);
        return user[sortConfig.key] || '';
      };
      let aVal = getValue(a);
      let bVal = getValue(b);
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchQuery, filterPath, filterGrade, filterAssessment, filterProfile, sortConfig]);

  const activeFilterCount = [filterPath, filterGrade, filterAssessment, filterProfile].filter(value => value !== 'all').length;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterPath('all');
    setFilterGrade('all');
    setFilterAssessment('all');
    setFilterProfile('all');
  };

  const exportCsv = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Grade', 'School', 'Path', 'RIASEC', 'Assessment', 'Profile'];
    const rows = filteredUsers.map(user => [
      user.id,
      user.name || '',
      user.email || '',
      user.grade || user.classLevel || '',
      user.schoolName || user.institutionName || '',
      getPath(user),
      user?.careerDNA?.riasec?.code || user.riasecCode || '',
      getAssessmentStatus(user),
      getProfileStatus(user),
    ]);
    const escape = value => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `secret-sharz-students-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="w-4 h-4 text-slate-300" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-emerald-500" />
      : <ChevronDown className="w-4 h-4 text-emerald-500" />;
  };

  const getPathBadge = (path) => {
    const colors = PATH_COLORS[path] || PATH_COLORS.unassigned;
    const label = path === 'wellbeing' ? 'Wellbeing' : path === 'sen' ? 'SEN' : path === 'career' ? 'Career' : 'Unassigned';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        {label}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600',
      'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600',
      'from-rose-400 to-rose-600', 'from-indigo-400 to-indigo-600',
    ];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[360px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, school, ID, RIASEC..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}
            </div>
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${showFilters || activeFilterCount ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <span className="text-sm text-slate-500 font-medium">{filteredUsers.length} of {users.length} students</span>
            <button onClick={exportCsv} className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50" title="Export filtered students">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <FilterSelect label="Learning Path" value={filterPath} onChange={setFilterPath} options={[
              ['all', 'All paths'], ['wellbeing', 'Wellbeing'], ['sen', 'SEN'], ['career', 'Career'], ['unassigned', 'Unassigned']
            ]} />
            <FilterSelect label="Grade / Class" value={filterGrade} onChange={setFilterGrade} options={[
              ['all', 'All grades'], ...gradeOptions.map(grade => [grade, grade])
            ]} />
            <FilterSelect label="RIASEC Assessment" value={filterAssessment} onChange={setFilterAssessment} options={[
              ['all', 'All statuses'], ['completed', 'Completed'], ['pending', 'Pending']
            ]} />
            <FilterSelect label="Profile" value={filterProfile} onChange={setFilterProfile} options={[
              ['all', 'All profiles'], ['complete', 'Complete'], ['incomplete', 'Incomplete']
            ]} />
            {activeFilterCount > 0 && <button onClick={clearFilters} className="sm:col-span-2 xl:col-span-4 text-xs font-bold text-rose-600 hover:text-rose-700 text-left">Clear all filters</button>}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <SortableHeader label="Student" columnKey="name" onSort={handleSort} SortIcon={SortIcon} />
              <SortableHeader label="School / Grade" columnKey="grade" onSort={handleSort} SortIcon={SortIcon} />
              <SortableHeader label="Path" columnKey="path" onSort={handleSort} SortIcon={SortIcon} />
              <SortableHeader label="Assessment" columnKey="assessment" onSort={handleSort} SortIcon={SortIcon} />
              <SortableHeader label="Profile" columnKey="profile" onSort={handleSort} SortIcon={SortIcon} />
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-14 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Search className="w-8 h-8 text-slate-300" /></div>
                  <p className="text-slate-600 font-semibold mb-1">No students found</p>
                  <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
                </div>
              </td></tr>
            ) : filteredUsers.map(user => {
              const assessment = getAssessmentStatus(user);
              const profile = getProfileStatus(user);
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onViewDetails?.(user)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>{getInitials(user.name)}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[220px]">{user.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 font-mono truncate max-w-[220px]">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">{user.schoolName || user.institutionName || 'School not set'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user.grade || user.classLevel || 'Grade not set'}</p>
                  </td>
                  <td className="px-4 py-3">{getPathBadge(getPath(user))}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex w-fit px-2 py-1 rounded-lg text-xs font-bold ${assessment === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{assessment === 'completed' ? 'RIASEC Complete' : 'RIASEC Pending'}</span>
                      {(user?.careerDNA?.riasec?.code || user?.riasecCode) && <span className="text-xs font-bold tracking-wider text-slate-500">{user?.careerDNA?.riasec?.code || user.riasecCode}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${profile === 'complete' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{profile === 'complete' ? 'Complete' : 'Incomplete'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <ActionButton title="View details" onClick={() => onViewDetails?.(user)}><Eye className="w-4 h-4" /></ActionButton>
                      <ActionButton title="Edit student" onClick={() => onEdit?.(user)} className="hover:text-blue-600 hover:bg-blue-50"><Edit3 className="w-4 h-4" /></ActionButton>
                      <ActionButton title="Delete student" onClick={() => onDelete?.(user)} className="hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between"><p className="text-xs text-slate-500">Showing {filteredUsers.length} of {users.length} students</p><p className="text-xs text-slate-400">Click a row to open the student master record</p></div>}
    </div>
  );
};

const SortableHeader = ({ label, columnKey, onSort, SortIcon }) => (
  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700" onClick={() => onSort(columnKey)}>
    <div className="flex items-center gap-2">{label}<SortIcon columnKey={columnKey} /></div>
  </th>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">{label}</span>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full appearance-none px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </label>
);

const ActionButton = ({ children, onClick, title, className = '' }) => (
  <button onClick={onClick} title={title} className={`p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all ${className}`}>{children}</button>
);

export default UserDirectoryTable;
