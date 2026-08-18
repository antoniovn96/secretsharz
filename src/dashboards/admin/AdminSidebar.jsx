import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Settings, Shield, LogOut, ChevronDown, GraduationCap, UserCheck, Building2, Tag, TicketPercent, CreditCard, ShieldCheck, HeartHandshake, BriefcaseBusiness, Brain, Sun, Moon, ExternalLink, Stethoscope, Search, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const PROFESSIONAL_DASHBOARDS = [
  { id: 'professionalCareer', label: 'Career Counsellor', icon: BriefcaseBusiness, path: '/provider/career' },
  { id: 'professionalPsychology', label: 'Psychology Counsellor', icon: Stethoscope, path: '/provider/psychologist' },
  { id: 'professionalSEN', label: 'SEN Teacher', icon: Brain, path: '/provider/educator' }
];

const SERVICE_GROUPS = [
  { id: 'career', label: 'Career Guidance', icon: BriefcaseBusiness, children: [{ id: 'careerStudents', label: 'Students' }, { id: 'careerParents', label: 'Parents' }, { id: 'careerInstitutions', label: 'Institutions' }] },
  { id: 'wellbeing', label: 'Counselling & Wellbeing', icon: HeartHandshake, children: [{ id: 'wellbeingStudents', label: 'Students' }, { id: 'wellbeingParents', label: 'Parents' }, { id: 'wellbeingInstitutions', label: 'Institutions' }] },
  { id: 'sen', label: 'SEN / Learning Support', icon: Brain, children: [{ id: 'senStudents', label: 'Students' }, { id: 'senParents', label: 'Parents' }, { id: 'senInstitutions', label: 'Institutions' }] }
];

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'professionals', label: 'Professionals', icon: UserCheck },
  { id: 'institutions', label: 'Institutions', icon: Building2 },
  { id: 'institutionServices', label: 'Service Entitlements', icon: ShieldCheck },
  { id: 'institutionPayments', label: 'Revenue & Billing', icon: CreditCard },
  { id: 'students', label: 'All Students', icon: GraduationCap },
  { id: 'parents', label: 'All Parents', icon: UserCheck },
  { id: 'pricing', label: 'Pricing & Products', icon: Tag },
  { id: 'offers', label: 'Offers & Coupons', icon: TicketPercent },
  { id: 'settings', label: 'System Settings', icon: Settings }
];

export default function AdminSidebar({ activeTab, onTabChange, user, onLogout, theme, onToggleTheme, collapsed = false, onToggleCollapsed, sidebarDark = false }) {
  const [openService, setOpenService] = useState(() => {
    if (typeof window === 'undefined') return 'career';
    return window.localStorage.getItem('secretsharz_admin_service') || 'career';
  });
  useEffect(() => { if (typeof window !== 'undefined') window.localStorage.setItem('secretsharz_admin_service', openService); }, [openService]);

  const goToWebsite = () => { if (typeof window !== 'undefined') window.location.href = '/'; };
  const goToProfessionalDashboard = (path) => { if (typeof window !== 'undefined') window.location.href = path; };
  const dark = sidebarDark || theme === 'dark';

  return <aside className={`ss-admin-sidebar ${collapsed ? 'ss-admin-sidebar-collapsed' : ''} flex flex-col h-full shrink-0 border-r transition-all duration-300 ${dark ? 'bg-[#111111] border-[#252525] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
    <div className={`px-4 py-4 border-b ${dark ? 'border-[#252525]' : 'border-slate-100'}`}>
      <div className="flex items-center gap-2">
        <button onClick={goToWebsite} className="flex items-center gap-3 text-left group min-w-0 flex-1" title="Back to Secret Sharz">
          <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-[1.03] transition-transform ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Shield className="w-5 h-5" /></div>
          {!collapsed && <div className="min-w-0"><div className={`text-[14px] font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Secret Sharz</div><div className={`text-[10px] font-bold tracking-[0.14em] uppercase ${dark ? 'text-[#777]' : 'text-slate-400'}`}>Admin Center</div></div>}
        </button>
        {!collapsed && <button onClick={onToggleCollapsed} className={`p-2 rounded-lg transition-colors ${dark ? 'text-[#777] hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`} title="Collapse sidebar"><PanelLeftClose className="w-4 h-4" /></button>}
      </div>
      {collapsed && <button onClick={onToggleCollapsed} className={`mt-3 w-full flex justify-center p-2 rounded-lg ${dark ? 'text-[#777] hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`} title="Expand sidebar"><PanelLeftOpen className="w-4 h-4" /></button>}
    </div>

    <nav className="flex-1 py-4 px-2 overflow-y-auto ss-admin-scrollbar">
      <p className={`px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] ${dark ? 'text-[#666]' : 'text-slate-400'} ${collapsed ? 'text-center' : ''}`}>{collapsed ? '•' : 'Main'}</p>
      <div className="space-y-0.5">
        <button onClick={() => onTabChange('overview')} title={collapsed ? 'Dashboard' : ''} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeTab === 'overview' ? (dark ? 'bg-white text-black' : 'bg-black text-white') : (dark ? 'text-[#aaa] hover:text-white hover:bg-white/[0.06]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50')}`}><LayoutDashboard className="w-[17px] h-[17px] shrink-0" /><span className={`${collapsed ? 'hidden' : 'block'} font-semibold text-[12px] flex-1 text-left`}>Dashboard</span>{activeTab === 'overview' && !collapsed && <span className="w-1.5 h-1.5 rounded-full bg-current" />}</button>
      </div>

      {!collapsed && <p className={`px-3 mt-6 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Professional Management</p>}
      <div className="space-y-0.5">
        {PROFESSIONAL_DASHBOARDS.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => goToProfessionalDashboard(item.path)} title={collapsed ? item.label : ''} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${dark ? 'text-[#aaa] hover:text-white hover:bg-white/[0.06]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'}`}><Icon className="w-[17px] h-[17px] shrink-0" /><span className={`${collapsed ? 'hidden' : 'block'} font-semibold text-[12px] flex-1 text-left`}>{item.label}</span>{!collapsed && <ExternalLink className="w-3 h-3 opacity-40" />}</button>; })}
      </div>

      {!collapsed && <p className={`px-3 mt-6 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Services</p>}
      <div className="space-y-0.5">
        {SERVICE_GROUPS.map(group => { const Icon = group.icon; const open = openService === group.id || group.children.some(c => c.id === activeTab); return <div key={group.id}>
          <button onClick={() => !collapsed && setOpenService(open ? '' : group.id)} title={collapsed ? group.label : ''} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${open ? (dark ? 'text-white bg-white/[0.05]' : 'text-slate-950 bg-slate-50') : (dark ? 'text-[#aaa] hover:text-white hover:bg-white/[0.06]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50')}`}><Icon className="w-[17px] h-[17px] shrink-0" /><span className={`${collapsed ? 'hidden' : 'block'} font-semibold text-[12px] flex-1 text-left`}>{group.label}</span>{!collapsed && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />}</button>
          {open && !collapsed && <div className={`ml-4 pl-3 border-l space-y-0.5 py-1 ${dark ? 'border-[#303030]' : 'border-slate-200'}`}>{group.children.map(child => <button key={child.id} onClick={() => onTabChange(child.id)} className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-semibold transition-colors ${activeTab === child.id ? (dark ? 'bg-white text-black' : 'bg-slate-900 text-white') : (dark ? 'text-[#777] hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}>{child.label}</button>)}</div>}
        </div>; })}
      </div>

      {!collapsed && <p className={`px-3 mt-6 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] ${dark ? 'text-[#666]' : 'text-slate-400'}`}>Management</p>}
      <div className="space-y-0.5">{NAV_ITEMS.slice(1).map(item => { const Icon = item.icon; const active = activeTab === item.id; return <button key={item.id} onClick={() => onTabChange(item.id)} title={collapsed ? item.label : ''} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? (dark ? 'bg-white text-black' : 'bg-black text-white') : (dark ? 'text-[#aaa] hover:text-white hover:bg-white/[0.06]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50')}`}><Icon className="w-[17px] h-[17px] shrink-0" /><span className={`${collapsed ? 'hidden' : 'block'} font-semibold text-[12px] flex-1 text-left`}>{item.label}</span>{active && !collapsed && <span className="w-1.5 h-1.5 rounded-full bg-current" />}</button>; })}</div>
    </nav>

    {!collapsed && <div className={`mx-2 mb-2 px-3 py-2.5 rounded-lg border ${dark ? 'bg-white/[0.03] border-[#252525]' : 'bg-slate-50 border-slate-100'}`}><div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/><span className={`text-[10px] font-semibold ${dark ? 'text-[#aaa]' : 'text-slate-600'}`}>All systems operational</span></div></div>}
    <div className={`p-2 border-t ${dark ? 'border-[#252525]' : 'border-slate-100'}`}>
      <div className={`flex items-center gap-2 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{user?.displayName?.charAt(0) || 'A'}</div>{!collapsed && <div className="flex-1 min-w-0"><p className={`text-[11px] font-bold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{user?.displayName || 'Super Admin'}</p><p className={`text-[9px] truncate ${dark ? 'text-[#666]' : 'text-slate-400'}`}>{user?.email || 'admin@secretsharz.com'}</p></div>}</div>
      {!collapsed && <div className="grid grid-cols-2 gap-1.5 mt-1"><button onClick={onToggleTheme} className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-[10px] font-semibold border ${dark ? 'border-[#303030] text-[#bbb] hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{theme === 'dark' ? <Sun className="w-3 h-3"/> : <Moon className="w-3 h-3"/>}{theme === 'dark' ? 'Light' : 'Dark'}</button><button onClick={onLogout} className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-[10px] font-semibold border ${dark ? 'border-[#303030] text-[#888] hover:text-red-400' : 'border-slate-200 text-slate-500 hover:text-red-600'}`}><LogOut className="w-3 h-3"/>Sign out</button></div>}
    </div>
  </aside>;
}
