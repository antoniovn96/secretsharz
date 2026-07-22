import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, MoreHorizontal, Edit3, Trash2, Eye, X, ChevronRight } from 'lucide-react';

const PATH_COLORS = {
  wellbeing: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  sen: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  career: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  unassigned: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

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
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [openMenuId, setOpenMenuId] = useState(null);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.grade?.toLowerCase().includes(query)
      );
    }
    
    // Apply path filter
    if (filterPath !== 'all') {
      result = result.filter(user => user.primary_path === filterPath);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key] || '';
      let bVal = b[sortConfig.key] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [users, searchQuery, filterPath, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-emerald-500" />
      : <ChevronDown className="w-4 h-4 text-emerald-500" />;
  };

  const getPathBadge = (path) => {
    const colors = PATH_COLORS[path] || PATH_COLORS.unassigned;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
        {path === 'wellbeing' ? 'Wellbeing' : path === 'sen' ? 'SEN' : path === 'career' ? 'Career' : 'Unassigned'}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-emerald-400 to-emerald-600',
      'from-amber-400 to-amber-600',
      'from-rose-400 to-rose-600',
      'from-indigo-400 to-indigo-600',
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header with Search and Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Path Filter */}
          <div className="relative">
            <select
              value={filterPath}
              onChange={(e) => setFilterPath(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Paths</option>
              <option value="wellbeing">Wellbeing</option>
              <option value="sen">SEN</option>
              <option value="career">Career</option>
              <option value="unassigned">Unassigned</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-500 font-medium">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  User <SortIcon columnKey="name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 group"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-2">
                  Email <SortIcon columnKey="email" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 group"
                onClick={() => handleSort('primary_path')}
              >
                <div className="flex items-center gap-2">
                  Path <SortIcon columnKey="primary_path" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 group"
                onClick={() => handleSort('grade')}
              >
                <div className="flex items-center gap-2">
                  Grade <SortIcon columnKey="grade" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-600 font-semibold mb-1">No users found</p>
                    <p className="text-sm text-slate-400">
                      {searchQuery || filterPath !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'No student accounts exist yet'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onViewDetails?.(user)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-600">{user.email || 'No email'}</p>
                  </td>
                  <td className="px-4 py-3">
                    {getPathBadge(user.primary_path)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-600">{user.grade || user.classLevel || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onViewDetails?.(user)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit User"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(user)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {filteredUsers.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <p className="text-xs text-slate-400">
            Click a row to view details
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDirectoryTable;
