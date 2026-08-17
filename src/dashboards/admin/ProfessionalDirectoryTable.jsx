import React, { useMemo, useState } from 'react';
import { Search, X, Download, SlidersHorizontal, ChevronUp, ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const ROLE_LABELS = {
  counsellor: 'Counsellor',
  career_counsellor: 'Career Counsellor',
  psychologist: 'Psychologist',
  educator: 'Educator',
};

const ROLE_STYLES = {
  counsellor: 'bg-purple-100 text-purple-700',
  career_counsellor: 'bg-indigo-100 text-indigo-700',
  psychologist: 'bg-blue-100 text-blue-700',
  educator: 'bg-emerald-100 text-emerald-700',
};

const getRole = user => user?.role || user?.professionalRole || 'unknown';

const ProfessionalDirectoryTable = ({ users = [], isLoading = false, onViewDetails, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      result = result.filter(user => {
        const identity = getProfileIdentity(null, user);
        return [
          identity.name,
          identity.email,
          user.phone,
          user.specialization,
          user.qualification,
          user.institutionName,
          user.registrationNumber,
          ROLE_LABELS[getRole(user)],
          user.id,
        ].some(value => String(value || '').toLowerCase().includes(q));
      });
    }

    if (filterRole !== 'all') result = result.filter(user => getRole(user) === filterRole);
    if (filterStatus !== 'all') result = result.filter(user => (user.status || 'active') === filterStatus);

    result.sort((a, b) => {
      const value = user => {
        const identity = getProfileIdentity(null, user);
        if (sortConfig.key === 'name') return identity.name;
        if (sortConfig.key === 'role') return ROLE_LABELS[getRole(user)] || getRole(user);
        if (sortConfig.key === 'status') return user.status || 'active';
        return user[sortConfig.key] || '';
      };
      const av = String(value(a)).toLowerCase();
      const bv = String(value(b)).toLowerCase();
      if (av === bv) return 0;
      const order = av < bv ? -1 : 1;
      return sortConfig.direction === 'asc' ? order : -order;
    });

    return result;
  }, [users, searchQuery, filterRole, filterStatus, sortConfig]);

  const handleSort = key => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

  const exportCsv = () => {
    const headers = ['Professional ID', 'Name', 'Email', 'Phone', 'Role', 'Specialisation', 'Qualification', 'Organisation', 'Registration No.', 'Status'];
    const rows = filteredUsers.map(user => {
      const identity = getProfileIdentity(null, user);
      return [
        user.id, identity.name, identity.email, user.phone || '', ROLE_LABELS[getRole(user)] || getRole(user),
        user.specialization || '', user.qualification || '', user.institutionName || '', user.registrationNumber || '', user.status || 'active',
      ];
    });
    const escape = value => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `secret-sharz-professionals-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading professionals...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[380px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search name, email, role, specialisation..." className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}
            </div>
            <button onClick={() => setShowFilters(prev => !prev)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold ${showFilters ? 'border-purple-300 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium">{filteredUsers.length} of {users.length} professionals</span>
            <button onClick={exportCsv} className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <label className="text-xs font-bold text-slate-500">ROLE
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                <option value="all">All roles</option>
                {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-slate-500">STATUS
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <Header label="Professional" column="name" onSort={handleSort} config={sortConfig} />
              <Header label="Role" column="role" onSort={handleSort} config={sortConfig} />
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Specialisation</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification / Organisation</th>
              <Header label="Status" column="status" onSort={handleSort} config={sortConfig} />
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-14 text-center"><div className="flex flex-col items-center"><div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Search className="w-8 h-8 text-slate-300" /></div><p className="text-slate-600 font-semibold mb-1">No professionals found</p><p className="text-sm text-slate-400">Try adjusting your search or filters.</p></div></td></tr>
            ) : filteredUsers.map(user => {
              const identity = getProfileIdentity(null, user);
              const role = getRole(user);
              const status = user.status || 'active';
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onViewDetails?.(user)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {identity.photoURL ? <img src={identity.photoURL} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm" /> : <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">{identity.initial}</div>}
                      <div className="min-w-0"><p className="font-semibold text-slate-900 truncate max-w-[220px]">{identity.name}</p><p className="text-xs text-slate-400 truncate max-w-[240px]">{identity.email || 'No email'}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${ROLE_STYLES[role] || 'bg-slate-100 text-slate-600'}`}>{ROLE_LABELS[role] || role}</span></td>
                  <td className="px-4 py-3"><p className="text-sm font-semibold text-slate-700">{user.specialization || 'Not specified'}</p><p className="text-xs text-slate-400 mt-0.5">{user.phone || 'No phone'}</p></td>
                  <td className="px-4 py-3"><p className="text-sm font-semibold text-slate-700">{user.qualification || 'Not specified'}</p><p className="text-xs text-slate-400 mt-0.5">{user.institutionName || 'Organisation not specified'}</p></td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}><button title="View details" onClick={() => onViewDetails?.(user)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button><button title="Edit professional" onClick={() => onEdit?.(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Pencil className="w-4 h-4" /></button><button title="Delete professional" onClick={() => onDelete?.(user)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Header = ({ label, column, onSort, config }) => (
  <th className="px-4 py-3 text-left"><button onClick={() => onSort(column)} className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{label}{config.key === column ? (config.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />) : <ChevronDown className="w-4 h-4 text-slate-300" />}</button></th>
);

export default ProfessionalDirectoryTable;
