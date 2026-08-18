import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import AdminSidebar from './AdminSidebar';
import OverviewTab from './OverviewTab';
import StudentDirectoryTab from './StudentDirectoryTab';
import ServiceStudentDirectory from './ServiceStudentDirectory';
import ServiceParentDirectory from './ServiceParentDirectory';
import ServiceInstitutionDirectory from './ServiceInstitutionDirectory';
import InstitutionDirectoryTab from './InstitutionDirectoryTab';
import InstitutionServicesTab from './InstitutionServicesTab';
import InstitutionPaymentsTab from './InstitutionPaymentsTab';
import ProfessionalDirectoryTab from './ProfessionalDirectoryTab';
import ParentDirectoryTab from './ParentDirectoryTab';
import SystemSettingsTab from './SystemSettingsTab';
import PricingTab from './PricingTab';
import CareerOffersTab from './CareerOffersTab';
import { Bell, CalendarDays, ChevronDown, Menu, Search, SlidersHorizontal, Sun, Moon, PanelLeft, LayoutDashboard, Globe2, X } from 'lucide-react';

const FALLBACK_STATS={totalUsers:{value:0,change:null,trend:'up',changeLabel:'live total'},recentSessions:{value:0,change:null,trend:'up',changeLabel:'sessions · 7d'},pendingIEPs:{value:0,change:null,trend:'up',changeLabel:'live total'},completedAssessments:{value:0,change:null,trend:'up',changeLabel:'live total'}};
const SERVICE_LABELS={careerStudents:'Career · Students',careerParents:'Career · Parents',careerInstitutions:'Career · Institutions',wellbeingStudents:'Wellbeing · Students',wellbeingParents:'Wellbeing · Parents',wellbeingInstitutions:'Wellbeing · Institutions',senStudents:'SEN · Students',senParents:'SEN · Parents',senInstitutions:'SEN · Institutions'};
const SERVICE_KEYS={careerStudents:'career',careerParents:'career',careerInstitutions:'career',wellbeingStudents:'wellbeing',wellbeingParents:'wellbeing',wellbeingInstitutions:'wellbeing',senStudents:'sen',senParents:'sen',senInstitutions:'sen'};

const ServiceView=({kind,service,theme})=>{
 if(kind==='student') return <ServiceStudentDirectory service={service} theme={theme}/>;
 if(kind==='parent') return <ServiceParentDirectory service={service} theme={theme}/>;
 return <ServiceInstitutionDirectory service={service} theme={theme}/>;
};

const SuperAdminView=({user,userData,onBackToApp})=>{
 const[activeTab,setActiveTab]=useState('overview');
 const[isLoading,setIsLoading]=useState(true);
 const[overviewData,setOverviewData]=useState({stats:FALLBACK_STATS,counts:{},pathDistribution:[],engagementData:[],limitations:{}});
 const[overviewError,setOverviewError]=useState('');
 const[theme,setTheme]=useState(()=>{if(typeof window==='undefined')return'light';return window.localStorage.getItem('secretsharz_admin_theme')||'light';});
 const[sidebarDark,setSidebarDark]=useState(()=>{if(typeof window==='undefined')return false;return window.localStorage.getItem('secretsharz_admin_sidebar_dark')==='true';});
 const[headerDark,setHeaderDark]=useState(()=>{if(typeof window==='undefined')return false;return window.localStorage.getItem('secretsharz_admin_header_dark')==='true';});
 const[borderedCards,setBorderedCards]=useState(()=>{if(typeof window==='undefined')return true;return window.localStorage.getItem('secretsharz_admin_bordered_cards')!=='false';});
 const[compactRadius,setCompactRadius]=useState(()=>{if(typeof window==='undefined')return false;return window.localStorage.getItem('secretsharz_admin_compact_radius')==='true';});
 const[sidebarCollapsed,setSidebarCollapsed]=useState(()=>{if(typeof window==='undefined')return false;return window.localStorage.getItem('secretsharz_admin_sidebar_collapsed')==='true';});
 const[showConfig,setShowConfig]=useState(false);
 const[mobileSidebar,setMobileSidebar]=useState(false);

 useEffect(()=>{if(typeof window==='undefined')return;window.localStorage.setItem('secretsharz_admin_theme',theme);window.localStorage.setItem('secretsharz_admin_sidebar_dark',String(sidebarDark));window.localStorage.setItem('secretsharz_admin_header_dark',String(headerDark));window.localStorage.setItem('secretsharz_admin_bordered_cards',String(borderedCards));window.localStorage.setItem('secretsharz_admin_compact_radius',String(compactRadius));window.localStorage.setItem('secretsharz_admin_sidebar_collapsed',String(sidebarCollapsed));},[theme,sidebarDark,headerDark,borderedCards,compactRadius,sidebarCollapsed]);
 useEffect(()=>{let mounted=true;(async()=>{try{setIsLoading(true);setOverviewError('');const current=auth.currentUser||user;if(!current)throw new Error('Authentication required.');let token=await current.getIdToken(true);let r=await fetch('/api/admin/overview-stats',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});if(r.status===401){token=await current.getIdToken(true);r=await fetch('/api/admin/overview-stats',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});}const p=await r.json();if(!r.ok)throw new Error(p?.error||'Unable to load overview statistics.');if(mounted)setOverviewData(p);}catch(e){if(mounted){setOverviewError(e?.message||'Unable to load live overview data.');setOverviewData(x=>({...x,stats:FALLBACK_STATS}));}}finally{if(mounted)setIsLoading(false);}})();return()=>{mounted=false;};},[user]);
 const logout=async()=>{try{await signOut(auth);if(onBackToApp)onBackToApp();}catch(e){console.error('Logout failed:',e);}};
 const content=()=>{if(isLoading&&activeTab==='overview')return <div className="flex flex-col items-center justify-center h-96"><div className={`w-10 h-10 border-4 rounded-full animate-spin mb-4 ${theme==='dark'?'border-[#333] border-t-white':'border-slate-200 border-t-black'}`}/><p className={`font-medium text-sm ${theme==='dark'?'text-slate-400':'text-slate-500'}`}>Loading live platform data...</p></div>;
  if(SERVICE_LABELS[activeTab]){const kind=activeTab.includes('Students')?'student':activeTab.includes('Parents')?'parent':'institution';return <ServiceView kind={kind} service={SERVICE_KEYS[activeTab]} theme={theme}/>;}
  switch(activeTab){case'overview':return <OverviewTab data={overviewData} theme={theme} borderedCards={borderedCards} compactRadius={compactRadius}/>;case'students':return <StudentDirectoryTab/>;case'institutions':return <InstitutionDirectoryTab/>;case'institutionServices':return <InstitutionServicesTab/>;case'institutionPayments':return <InstitutionPaymentsTab/>;case'professionals':return <ProfessionalDirectoryTab/>;case'parents':return <ParentDirectoryTab/>;case'pricing':return <PricingTab/>;case'offers':return <CareerOffersTab/>;case'settings':return <SystemSettingsTab/>;default:return <OverviewTab data={overviewData} theme={theme} borderedCards={borderedCards} compactRadius={compactRadius}/>;}};
 const dark=theme==='dark';
 const shellClass=dark?'bg-[#0a0a0a] text-white':'bg-[#f5f5f5] text-[#171717]';
 const headerClass=headerDark||dark?'bg-[#111111] text-white border-[#252525]':'bg-white text-[#171717] border-slate-200';
 return <div className={`ss-admin-root flex h-screen w-full overflow-hidden transition-colors duration-300 ${shellClass}`}>
   <div className={`${mobileSidebar?'translate-x-0':'-translate-x-full'} fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:translate-x-0 ${mobileSidebar?'block':'md:block'}`}><AdminSidebar activeTab={activeTab} onTabChange={(tab)=>{setActiveTab(tab);setMobileSidebar(false);}} user={user} onLogout={logout} theme={theme} onToggleTheme={()=>setTheme(x=>x==='dark'?'light':'dark')} collapsed={sidebarCollapsed} onToggleCollapsed={()=>setSidebarCollapsed(x=>!x)} sidebarDark={sidebarDark}/></div>
   {mobileSidebar&&<button aria-label="Close navigation" onClick={()=>setMobileSidebar(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden"/>}
   <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
     <header className={`h-[68px] shrink-0 px-4 md:px-6 flex items-center justify-between border-b shadow-[0_1px_0_rgba(0,0,0,.02)] transition-colors ${headerClass}`}>
       <div className="flex items-center gap-3 min-w-0">
         <button onClick={()=>setMobileSidebar(true)} className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"><Menu className="w-5 h-5"/></button>
         <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold opacity-60"><LayoutDashboard className="w-4 h-4"/><span>Admin</span><span>/</span></div>
         <div className="min-w-0"><h1 className="text-[15px] md:text-[17px] font-bold truncate">{SERVICE_LABELS[activeTab]||({overview:'Dashboard',professionals:'Professionals',institutions:'Institutions',institutionServices:'Service Entitlements',institutionPayments:'Revenue & Billing',students:'All Students',parents:'All Parents',pricing:'Pricing & Products',offers:'Offers & Coupons',settings:'System Settings'}[activeTab]||'Dashboard')}</h1><p className="hidden md:block text-[10px] opacity-50 font-medium">Secret Sharz · Super Admin Command Center</p></div>
       </div>
       <div className="flex items-center gap-1.5 md:gap-2">
         <div className={`hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] ${headerDark||dark?'border-[#2c2c2c] text-[#aaa]':'border-slate-200 text-slate-500'}`}><Search className="w-3.5 h-3.5"/><span>Search platform</span><kbd className="ml-4 text-[9px] px-1.5 py-0.5 rounded border opacity-50">⌘K</kbd></div>
         <button title="Calendar" className="p-2.5 rounded-lg hover:bg-black/5"><CalendarDays className="w-[17px] h-[17px]"/></button>
         <button title="Notifications" className="relative p-2.5 rounded-lg hover:bg-black/5"><Bell className="w-[17px] h-[17px]"/><span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500"/></button>
         <button onClick={()=>setShowConfig(x=>!x)} title="Dashboard settings" className={`p-2.5 rounded-lg hover:bg-black/5 ${showConfig?'bg-black/5':''}`}><SlidersHorizontal className="w-[17px] h-[17px]"/></button>
         <div className={`hidden md:flex items-center gap-2 pl-2 ml-1 border-l ${headerDark||dark?'border-[#303030]':'border-slate-200'}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${headerDark||dark?'bg-white text-black':'bg-black text-white'}`}>{user?.displayName?.charAt(0)||'A'}</div><div className="hidden lg:block"><p className="text-[11px] font-bold leading-tight">{user?.displayName||'Super Admin'}</p><p className="text-[9px] opacity-50">Administrator</p></div><ChevronDown className="w-3.5 h-3.5 opacity-50"/></div>
       </div>
     </header>
     {showConfig&&<div className={`absolute right-4 top-[76px] z-30 w-[290px] rounded-xl border shadow-2xl p-4 ${dark?'bg-[#151515] border-[#303030] text-white':'bg-white border-slate-200 text-slate-900'}`}>
       <div className="flex items-center justify-between mb-4"><div><p className="text-sm font-bold">Appearance</p><p className="text-[10px] opacity-50">Fila-inspired dashboard controls</p></div><button onClick={()=>setShowConfig(false)} className="p-1.5 rounded-md hover:bg-black/5"><X className="w-4 h-4"/></button></div>
       <div className="grid grid-cols-2 gap-2 mb-4"><button onClick={()=>setTheme('light')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[11px] font-bold ${!dark?'bg-black text-white border-black':'border-[#333] text-[#aaa]'}`}><Sun className="w-3.5 h-3.5"/>White</button><button onClick={()=>setTheme('dark')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[11px] font-bold ${dark?'bg-white text-black border-white':'border-slate-200 text-slate-500'}`}><Moon className="w-3.5 h-3.5"/>Black</button></div>
       <div className="space-y-1.5">
         {[['Dark sidebar',sidebarDark,setSidebarDark],['Dark header',headerDark,setHeaderDark],['Bordered cards',borderedCards,setBorderedCards],['Compact card radius',compactRadius,setCompactRadius],['Collapsed sidebar',sidebarCollapsed,setSidebarCollapsed]].map(([label,value,setter])=><button key={label} onClick={()=>setter(x=>!x)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[11px] font-semibold ${dark?'hover:bg-white/5':'hover:bg-slate-50'}`}><span>{label}</span><span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${value?(dark?'bg-white':'bg-black'):(dark?'bg-[#333]':'bg-slate-200')}`}><span className={`block w-4 h-4 rounded-full transition-transform ${value?'translate-x-4':'translate-x-0'} ${value&&dark?'bg-black':'bg-white'}`}/></span></button>)}
       </div>
     </div>}
     <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 ${dark?'bg-[#0a0a0a]':'bg-[#f5f5f5]'}`}>{content()}</main>
   </div>
 </div>;
};
export default SuperAdminView;
