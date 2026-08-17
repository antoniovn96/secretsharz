import React, { useMemo, useState } from 'react';
import { Search, X, Download, SlidersHorizontal, ChevronUp, ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const ParentDirectoryTable = ({ users = [], isLoading = false, onViewDetails, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const q = searchQuery.trim().toLowerCase();
    if (q) result = result.filter(parent => {
      const identity = getProfileIdentity(null, parent);
      return [identity.name, identity.email, parent.phone, parent.id, parent.city, parent.location, parent.occupation].some(value => String(value || '').toLowerCase().includes(q));
    });
    if (filterStatus !== 'all') result = result.filter(parent => (parent.status || 'active') === filterStatus);
    result.sort((a, b) => {
      const av = String(sortConfig.key === 'name' ? getProfileIdentity(null, a).name : sortConfig.key === 'children' ? (a.childrenCount || 0) : (a.status || 'active')).toLowerCase();
      const bv = String(sortConfig.key === 'name' ? getProfileIdentity(null, b).name : sortConfig.key === 'children' ? (b.childrenCount || 0) : (b.status || 'active')).toLowerCase();
      if (av === bv) return 0;
      const order = av < bv ? -1 : 1;
      return sortConfig.direction === 'asc' ? order : -order;
    });
    return result;
  }, [users, searchQuery, filterStatus, sortConfig]);

  const handleSort = key => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

  const exportCsv = () => {
    const headers = ['Parent ID', 'Name', 'Email', 'Phone', 'Children', 'Status'];
    const rows = filteredUsers.map(parent => { const identity = getProfileIdentity(null, parent); return [parent.id, identity.name, identity.email, parent.phone || '', parent.childrenCount || 0, parent.status || 'active']; });
    const escape = value => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `secret-sharz-parents-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><div className="p-8 flex flex-col items-center justify-center h-64"><div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mb-4" /><p className="text-slate-500 font-medium">Loading parents...</p></div></div>;

  return <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-4 border-b border-slate-100 space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full lg:w-auto"><div className="relative flex-1 lg:w-[380px]"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search parent name, email, phone..." className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />{searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>}</div><button onClick={() => setShowFilters(prev => !prev)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold ${showFilters ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><SlidersHorizontal className="w-4 h-4" /> Filters</button></div>
        <div className="flex items-center gap-2"><span className="text-sm text-slate-500 font-medium">{filteredUsers.length} of {users.length} parents</span><button onClick={exportCsv} className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"><Download className="w-4 h-4" /> Export CSV</button></div>
      </div>
      {showFilters && <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><label className="text-xs font-bold text-slate-500">STATUS<select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="mt-1 w-full md:w-64 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label></div>}
    </div>
    <div className="overflow-x-auto"><table className="w-full min-w-[900px]"><thead><tr className="bg-slate-50 border-b border-slate-100"><Header label="Parent" column="name" onSort={handleSort} config={sortConfig} /><th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th><Header label="Linked Children" column="children" onSort={handleSort} config={sortConfig} /><th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th><Header label="Status" column="status" onSort={handleSort} config={sortConfig} /><th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th></tr></thead>
      <tbody className="divide-y divide-slate-100">{filteredUsers.length === 0 ? <tr><td colSpan={6} className="px-4 py-14 text-center"><p className="text-slate-600 font-semibold">No parents found</p><p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p></td></tr> : filteredUsers.map(parent => { const identity = getProfileIdentity(null, parent); const status = parent.status || 'active'; return <tr key={parent.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onViewDetails?.(parent)}><td className="px-4 py-3"><div className="flex items-center gap-3">{identity.photoURL ? <img src={identity.photoURL} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm" /> : <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">{identity.initial}</div>}<div className="min-w-0"><p className="font-semibold text-slate-900 truncate max-w-[220px]">{identity.name}</p><p className="text-xs text-slate-400 font-mono truncate max-w-[220px]">{parent.id}</p></div></div></td><td className="px-4 py-3"><p className="text-sm font-semibold text-slate-700">{identity.email || 'No email'}</p><p className="text-xs text-slate-400 mt-0.5">{parent.phone || 'No phone'}</p></td><td className="px-4 py-3"><span className="inline-flex px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">{parent.childrenCount || 0} {parent.childrenCount === 1 ? 'child' : 'children'}</span></td><td className="px-4 py-3"><span className="text-sm text-slate-600">{parent.location || parent.city || 'Not specified'}</span></td><td className="px-4 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span></td><td className="px-4 py-3"><div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}><button title="View details" onClick={() => onViewDetails?.(parent)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Eye className="w-4 h-4" /></button><button title="Edit parent" onClick={() => onEdit?.(parent)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button><button title="Delete parent" onClick={() => onDelete?.(parent)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td></tr>; })}</tbody></table></div>
  </div>;
};

const Header = ({ label, column, onSort, config }) => <th className="px-4 py-3 text-left"><button onClick={() => onSort(column)} className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{label}{config.key === column ? (config.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4 text-rose-500" />) : <ChevronDown className="w-4 h-4 text-slate-300" />}</button></th>;

export default ParentDirectoryTable;
