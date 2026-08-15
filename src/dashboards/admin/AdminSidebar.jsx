import React from 'react';
import {
  LayoutDashboard, UserCircle, Settings, Shield, LogOut, ChevronRight, Activity,
  GraduationCap, UserCheck, Building2
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview (KPIs)', icon: LayoutDashboard },
  { id: 'students', label: 'Student Directory', icon: GraduationCap },
  { id: 'institutions', label: 'Institutions', icon: Building2 },
  { id: 'professionals', label: 'Professional Directory', icon: UserCheck },
  { id: 'parents', label: 'Parent Directory', icon: UserCircle },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const AdminSidebar = ({ activeTab, onTabChange, user, onLogout }) => {
  return (
    <aside className="w-72 bg-slate-900 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Secret Sharz</h1>
            <p className="text-xs text-slate-400 font-medium">Super Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-semibold text-sm flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="px-4 py-4 mx-3 mb-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-400" /><span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">System Status</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div><span className="text-sm text-slate-400">All systems operational</span></div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">{user?.displayName?.charAt(0) || 'A'}</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{user?.displayName || 'Admin'}</p><p className="text-xs text-slate-400 truncate">{user?.email || 'admin@secretsharz.com'}</p></div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-200 font-medium text-sm"><LogOut className="w-4 h-4" />Sign Out</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
