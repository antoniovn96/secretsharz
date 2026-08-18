import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Settings, Shield, LogOut, ChevronDown, GraduationCap, UserCheck, Building2, Tag, TicketPercent, CreditCard, ShieldCheck, HeartHandshake, BriefcaseBusiness, Brain, Sun, Moon, ExternalLink, Stethoscope } from 'lucide-react';

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

export default function AdminSidebar({ activeTab, onTabChange, user, onLogout, theme, onToggleTheme }) {
  const [openService, setOpenService] = useState(() => {
    if (typeof window === 'undefined') return 'career';
    return window.localStorage.getItem('secretsharz_admin_service') || 'career';
  });
  useEffect(() => { if (typeof window !== 'undefined') window.localStorage.setItem('secretsharz_admin_service', openService); }, [openService]);

  const goToWebsite = () => { if (typeof window !== 'undefined') window.location.href = '/'; };
  const goToProfessionalDashboard = (path) => { if (typeof window !== 'undefined') window.location.href = path; };
  const dark = theme === 'dark';

  return <aside className={`w-[292px] flex flex-col h-full shrink-0 border-r transition-colors duration-300 ${dark ? 'bg-[#0b1020] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
    <div className={`px-5 py-5 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
      <button onClick={goToWebsite} className="w-full flex items-center gap-3 text-left group" title="Back to Secret Sharz">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-[1.03] transition-transform"><Shield className="w-5 h-5 text-white" /></div>
        <div className="min-w-0"><div className={`text-[15px] font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Secret Sharz</div><div className={`text-[11px] font-semibold tracking-[0.14em] uppercase ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Command Center</div></div>
        <ExternalLink className={`ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
      </button>
    </div>

    <nav className="flex-1 py-5 px-3 overflow-y-auto">
      <p className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>My Dashboard</p>
      <div className="space-y-1">
        <button onClick={() => onTabChange('overview')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${activeTab === 'overview' ? (dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-950') : (dark ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50')}`}><LayoutDashboard className={`w-[18px] h-[18px] ${activeTab === 'overview' ? 'text-emerald-500' : ''}`} /><span className="font-semibold text-[13px] flex-1 text-left">Super Admin</span>{activeTab === 'overview' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}</button>
      </div>

      <p className={`px-3 mt-7 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Professional Management</p>
      <div className="space-y-1">
        {PROFESSIONAL_DASHBOARDS.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => goToProfessionalDashboard(item.path)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${dark ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'}`}><Icon className="w-[18px] h-[18px] text-emerald-500" /><span className="font-semibold text-[13px] flex-1 text-left">{item.label}</span><ExternalLink className={`w-3.5 h-3.5 ${dark ? 'text-slate-600' : 'text-slate-300'}`} /></button>; })}
      </div>

      <p className={`px-3 mt-7 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Services</p>
      <div className="space-y-1">
        {SERVICE_GROUPS.map(group => { const Icon = group.icon; const open = openService === group.id || group.children.some(c => c.id === activeTab); return <div key={group.id}>
          <button onClick={() => setOpenService(open ? '' : group.id)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${open ? (dark ? 'text-white bg-white/[0.035]' : 'text-slate-950 bg-slate-50') : (dark ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50')}`}><Icon className="w-[18px] h-[18px] text-emerald-500" /><span className="font-semibold text-[13px] flex-1 text-left">{group.label}</span><ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} /></button>
          {open && <div className={`ml-5 pl-4 border-l space-y-0.5 py-1 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>{group.children.map(child => <button key={child.id} onClick={() => onTabChange(child.id)} className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${activeTab === child.id ? (dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700') : (dark ? 'text-slate-500 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')}`}>{child.label}</button>)}</div>}
        </div>; })}
      </div>

      <p className={`px-3 mt-7 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Management</p>
      <div className="space-y-1">{NAV_ITEMS.slice(1).map(item => { const Icon = item.icon; const active = activeTab === item.id; return <button key={item.id} onClick={() => onTabChange(item.id)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${active ? (dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-950') : (dark ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50')}`}><Icon className={`w-[18px] h-[18px] ${active ? 'text-emerald-500' : ''}`} /><span className="font-semibold text-[13px] flex-1 text-left">{item.label}</span>{active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}</button>; })}</div>
    </nav>

    <div className={`mx-3 mb-3 px-3.5 py-3 rounded-xl border ${dark ? 'bg-emerald-500/[0.04] border-slate-800' : 'bg-emerald-50/60 border-emerald-100'}`}><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"/><span className={`text-[11px] font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>All systems operational</span></div></div>
    <div className={`p-3 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="flex items-center gap-3 px-2 py-2"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs">{user?.displayName?.charAt(0) || 'A'}</div><div className="flex-1 min-w-0"><p className={`text-[12px] font-bold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{user?.displayName || 'Super Admin'}</p><p className={`text-[10px] truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email || 'admin@secretsharz.com'}</p></div></div>
      <div className="grid grid-cols-2 gap-2 mt-2"><button onClick={onToggleTheme} className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-semibold border ${dark ? 'border-slate-800 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{dark ? <Sun className="w-3.5 h-3.5"/> : <Moon className="w-3.5 h-3.5"/>}{dark ? 'Light mode' : 'Dark mode'}</button><button onClick={onLogout} className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-semibold border ${dark ? 'border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/5' : 'border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50'}`}><LogOut className="w-3.5 h-3.5"/>Sign out</button></div>
    </div>
  </aside>;
}