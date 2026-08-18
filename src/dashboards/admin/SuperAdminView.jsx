import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import AdminSidebar from './AdminSidebar';
import OverviewTab from './OverviewTab';
import StudentDirectoryTab from './StudentDirectoryTab';
import ServiceStudentDirectory from './ServiceStudentDirectory';
import ServiceParentDirectory from './ServiceParentDirectory';
import ServiceInstitutionDirectory from './ServiceInstitutionDirectory';
import InstitutionDirectoryTab from './InstitutionDirectoryTab';
import InstitutionDetailPanel from './InstitutionDetailPanel';
import InstitutionServicesTab from './InstitutionServicesTab';
import InstitutionPaymentsTab from './InstitutionPaymentsTab';
import ProfessionalDirectoryTab from './ProfessionalDirectoryTab';
import ParentDirectoryTab from './ParentDirectoryTab';
import SystemSettingsTab from './SystemSettingsTab';
import PricingTab from './PricingTab';
import CareerOffersTab from './CareerOffersTab';
import { Bell, CalendarDays, ChevronDown, Menu, Search, SlidersHorizontal, Sun, Moon, LayoutDashboard, X } from 'lucide-react';

const FALLBACK_STATS = {
  totalUsers: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  recentSessions: { value: 0, change: null, trend: 'up', changeLabel: 'sessions · 7d' },
  pendingIEPs: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  completedAssessments: { value: 0, change: null, trend: 'up', changeLabel: 'live total' }
};

const SERVICE_LABELS = {
  careerStudents: 'Career · Students', careerParents: 'Career · Parents', careerInstitutions: 'Career · Institutions',
  wellbeingStudents: 'Wellbeing · Students', wellbeingParents: 'Wellbeing · Parents', wellbeingInstitutions: 'Wellbeing · Institutions',
  senStudents: 'SEN · Students', senParents: 'SEN · Parents', senInstitutions: 'SEN · Institutions'
};
const SERVICE_KEYS = {
  careerStudents: 'career', careerParents: 'career', careerInstitutions: 'career',
  wellbeingStudents: 'wellbeing', wellbeingParents: 'wellbeing', wellbeingInstitutions: 'wellbeing',
  senStudents: 'sen', senParents: 'sen', senInstitutions: 'sen'
};

const ServiceView = ({ kind, service, theme }) => {
  if (kind === 'student') return <ServiceStudentDirectory service={service} theme={theme} />;
  if (kind === 'parent') return <ServiceParentDirectory service={service} theme={theme} />;
  return <ServiceInstitutionDirectory service={service} theme={theme} />;
};

export default function SuperAdminView({ user, onBackToApp }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({ stats: FALLBACK_STATS, counts: {}, pathDistribution: [], engagementData: [], limitations: {} });
  const [theme, setTheme] = useState(() => typeof window === 'undefined' ? 'light' : window.localStorage.getItem('secretsharz_admin_theme') || 'light');
  const [sidebarDark, setSidebarDark] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('secretsharz_admin_sidebar_dark') === 'true');
  const [headerDark, setHeaderDark] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('secretsharz_admin_header_dark') === 'true');
  const [borderedCards, setBorderedCards] = useState(() => typeof window === 'undefined' || window.localStorage.getItem('secretsharz_admin_bordered_cards') !== 'false');
  const [compactRadius, setCompactRadius] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('secretsharz_admin_compact_radius') === 'true');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('secretsharz_admin_sidebar_collapsed') === 'true');
  const [showConfig, setShowConfig] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('secretsharz_admin_theme', theme);
    window.localStorage.setItem('secretsharz_admin_sidebar_dark', String(sidebarDark));
    window.localStorage.setItem('secretsharz_admin_header_dark', String(headerDark));
    window.localStorage.setItem('secretsharz_admin_bordered_cards', String(borderedCards));
    window.localStorage.setItem('secretsharz_admin_compact_radius', String(compactRadius));
    window.localStorage.setItem('secretsharz_admin_sidebar_collapsed', String(sidebarCollapsed));
  }, [theme, sidebarDark, headerDark, borderedCards, compactRadius, sidebarCollapsed]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const current = auth.currentUser || user;
        if (!current) throw new Error('Authentication required.');
        const token = await current.getIdToken(true);
        const response = await fetch('/api/admin/overview-stats', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load overview statistics.');
        if (mounted) setOverviewData(payload);
      } catch (error) {
        console.error('Admin overview load failed:', error);
        if (mounted) setOverviewData(current => ({ ...current, stats: FALLBACK_STATS }));
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  const logout = async () => {
    try { await signOut(auth); onBackToApp?.(); } catch (error) { console.error('Logout failed:', error); }
  };

  const handleInstitutionClick = async event => {
    if (activeTab !== 'institutions') return;
    const row = event.target?.closest?.('tbody tr');
    if (!row) return;
    const code = row.querySelector('td:nth-child(2)')?.textContent?.trim();
    const name = row.querySelector('td:nth-child(1) div')?.textContent?.trim();
    if (!code && !name) return;
    try {
      const current = auth.currentUser || user;
      if (!current) return;
      const token = await current.getIdToken(true);
      const response = await fetch('/api/admin/institutions', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load institution.');
      const match = (payload.institutions || []).find(item => (code && item.institutionCode === code) || (name && item.name === name));
      if (match) setSelectedInstitution(match);
    } catch (error) {
      console.error('Institution selection failed:', error);
    }
  };

  const content = () => {
    if (isLoading && activeTab === 'overview') {
      return <div className="flex h-96 flex-col items-center justify-center"><div className={`mb-4 h-10 w-10 animate-spin rounded-full border-4 ${theme === 'dark' ? 'border-[#333] border-t-white' : 'border-slate-200 border-t-black'}`} /><p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Loading live platform data...</p></div>;
    }
    if (SERVICE_LABELS[activeTab]) {
      const kind = activeTab.includes('Students') ? 'student' : activeTab.includes('Parents') ? 'parent' : 'institution';
      return <ServiceView kind={kind} service={SERVICE_KEYS[activeTab]} theme={theme} />;
    }
    switch (activeTab) {
      case 'overview': return <OverviewTab data={overviewData} theme={theme} borderedCards={borderedCards} compactRadius={compactRadius} />;
      case 'students': return <StudentDirectoryTab theme={theme} />;
      case 'institutions': return <InstitutionDirectoryTab theme={theme} />;
      case 'institutionServices': return <InstitutionServicesTab theme={theme} />;
      case 'institutionPayments': return <InstitutionPaymentsTab theme={theme} />;
      case 'professionals': return <ProfessionalDirectoryTab theme={theme} />;
      case 'parents': return <ParentDirectoryTab theme={theme} />;
      case 'pricing': return <PricingTab theme={theme} />;
      case 'offers': return <CareerOffersTab theme={theme} />;
      case 'settings': return <SystemSettingsTab theme={theme} />;
      default: return <OverviewTab data={overviewData} theme={theme} borderedCards={borderedCards} compactRadius={compactRadius} />;
    }
  };

  const dark = theme === 'dark';
  const shellClass = dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f5f5f5] text-[#171717]';
  const headerClass = headerDark || dark ? 'bg-[#111111] text-white border-[#252525]' : 'bg-white text-[#171717] border-slate-200';

  return <div className={`ss-admin-root flex h-screen w-full overflow-hidden transition-colors duration-300 ${shellClass}`}>
    <style>{`.ss-admin-content .bg-white{background-color:${dark ? '#151515' : '#fff'} !important}.ss-admin-content .text-slate-900{color:${dark ? '#fff' : '#171717'} !important}.ss-admin-content .text-slate-700,.ss-admin-content .text-slate-600{color:${dark ? '#b5b5b5' : '#475569'} !important}.ss-admin-content .border-slate-100,.ss-admin-content .border-slate-200{border-color:${dark ? '#292929' : '#e2e8f0'} !important}`}</style>
    <div className={`${mobileSidebar ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:translate-x-0`}>
      <AdminSidebar activeTab={activeTab} onTabChange={tab => { setActiveTab(tab); setMobileSidebar(false); setSelectedInstitution(null); }} user={user} onLogout={logout} theme={theme} onToggleTheme={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed(value => !value)} sidebarDark={sidebarDark} />
    </div>
    {mobileSidebar && <button aria-label="Close navigation" onClick={() => setMobileSidebar(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />}
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className={`flex h-[68px] shrink-0 items-center justify-between border-b px-4 shadow-[0_1px_0_rgba(0,0,0,.02)] transition-colors md:px-6 ${headerClass}`}>
        <div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileSidebar(true)} className="rounded-lg p-2 hover:bg-black/5 md:hidden"><Menu className="h-5 w-5" /></button><div className="hidden items-center gap-2 text-[11px] font-semibold opacity-60 lg:flex"><LayoutDashboard className="h-4 w-4" /><span>Admin</span><span>/</span></div><div className="min-w-0"><h1 className="truncate text-[15px] font-bold md:text-[17px]">{SERVICE_LABELS[activeTab] || ({ overview: 'Dashboard', professionals: 'Professionals', institutions: 'Institutions', institutionServices: 'Service Entitlements', institutionPayments: 'Revenue & Billing', students: 'All Students', parents: 'All Parents', pricing: 'Pricing & Products', offers: 'Offers & Coupons', settings: 'System Settings' }[activeTab] || 'Dashboard')}</h1><p className="hidden text-[10px] font-medium opacity-50 md:block">Secret Sharz · Super Admin Command Center</p></div></div>
        <div className="flex shrink-0 items-center gap-1.5 md:gap-2"><div className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-[11px] xl:flex ${headerDark || dark ? 'border-[#2c2c2c] text-[#aaa]' : 'border-slate-200 text-slate-500'}`}><Search className="h-3.5 w-3.5" /><span>Search platform</span><kbd className="ml-4 rounded border px-1.5 py-0.5 text-[9px] opacity-50">⌘K</kbd></div><button title="Calendar" className="rounded-lg p-2.5 hover:bg-black/5"><CalendarDays className="h-[17px] w-[17px]" /></button><button title="Notifications" className="relative rounded-lg p-2.5 hover:bg-black/5"><Bell className="h-[17px] w-[17px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" /></button><button onClick={() => setShowConfig(value => !value)} title="Dashboard settings" className="rounded-lg p-2.5 hover:bg-black/5"><SlidersHorizontal className="h-[17px] w-[17px]" /></button><div className={`hidden items-center gap-2 border-l pl-2 md:flex ${headerDark || dark ? 'border-[#303030]' : 'border-slate-200'}`}><div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${headerDark || dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{user?.displayName?.charAt(0) || 'A'}</div><div className="hidden lg:block"><p className="text-[11px] font-bold leading-tight">{user?.displayName || 'Super Admin'}</p><p className="text-[9px] opacity-50">Administrator</p></div><ChevronDown className="h-3.5 w-3.5 opacity-50" /></div></div>
      </header>
      {showConfig && <div className={`absolute right-4 top-[76px] z-30 w-[290px] rounded-xl border p-4 shadow-2xl ${dark ? 'border-[#303030] bg-[#151515] text-white' : 'border-slate-200 bg-white text-slate-900'}`}><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-bold">Appearance</p><p className="text-[10px] opacity-50">Dashboard controls</p></div><button onClick={() => setShowConfig(false)} className="rounded-md p-1.5 hover:bg-black/5"><X className="h-4 w-4" /></button></div><div className="mb-4 grid grid-cols-2 gap-2"><button onClick={() => setTheme('light')} className={`rounded-lg border py-2.5 text-[11px] font-bold ${!dark ? 'border-black bg-black text-white' : 'border-[#333] text-[#aaa]'}`}><Sun className="mr-2 inline h-3.5 w-3.5" />White</button><button onClick={() => setTheme('dark')} className={`rounded-lg border py-2.5 text-[11px] font-bold ${dark ? 'border-white bg-white text-black' : 'border-slate-200 text-slate-500'}`}><Moon className="mr-2 inline h-3.5 w-3.5" />Black</button></div><div className="space-y-1.5">{[['Dark sidebar', sidebarDark, setSidebarDark], ['Dark header', headerDark, setHeaderDark], ['Bordered cards', borderedCards, setBorderedCards], ['Compact card radius', compactRadius, setCompactRadius], ['Collapsed sidebar', sidebarCollapsed, setSidebarCollapsed]].map(([label, value, setter]) => <button key={label} onClick={() => setter(current => !current)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[11px] font-semibold ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}><span>{label}</span><span className={`h-5 w-9 rounded-full p-0.5 ${value ? (dark ? 'bg-white' : 'bg-black') : (dark ? 'bg-[#333]' : 'bg-slate-200')}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : ''} ${value && dark ? 'bg-black' : ''}`} /></span></button>)}</div></div>}
      <main onClick={handleInstitutionClick} className={`ss-admin-content min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-7 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}>{content()}</main>
    </div>
    <InstitutionDetailPanel institution={selectedInstitution} isOpen={Boolean(selectedInstitution)} onClose={() => setSelectedInstitution(null)} onEdit={() => setSelectedInstitution(null)} />
  </div>;
}
