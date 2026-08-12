import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

import AdminSidebar from './AdminSidebar';
import OverviewTab from './OverviewTab';
import StudentDirectoryTab from './StudentDirectoryTab';
import ProfessionalDirectoryTab from './ProfessionalDirectoryTab';
import ParentDirectoryTab from './ParentDirectoryTab';
import SystemSettingsTab from './SystemSettingsTab';

const FALLBACK_STATS = {
  totalUsers: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  activeUsers: { value: 0, change: null, trend: 'up', changeLabel: 'active users · 7d' },
  pendingIEPs: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
  completedAssessments: { value: 0, change: null, trend: 'up', changeLabel: 'live total' },
};

const SuperAdminView = ({ user, userData, onBackToApp }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    stats: FALLBACK_STATS,
    counts: {},
    pathDistribution: [],
    engagementData: [],
    limitations: {},
  });
  const [overviewError, setOverviewError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        setOverviewError('');

        const currentUser = auth.currentUser || user;
        if (!currentUser) throw new Error('Authentication required.');

        const idToken = await currentUser.getIdToken();
        const response = await fetch('/api/admin/overview-stats', {
          method: 'GET',
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load overview statistics.');

        if (isMounted) setOverviewData(payload);
      } catch (error) {
        console.error('[Secret Sharz] Admin overview unavailable:', error);
        if (isMounted) {
          setOverviewError(error?.message || 'Unable to load live overview data.');
          setOverviewData(prev => ({ ...prev, stats: FALLBACK_STATS }));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOverview();
    return () => { isMounted = false; };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onBackToApp) onBackToApp();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderTabContent = () => {
    if (isLoading && activeTab === 'overview') {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading live platform data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            {overviewError && (
              <div className="mb-4 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm font-medium">
                {overviewError}
              </div>
            )}
            <OverviewTab data={overviewData} />
          </>
        );
      case 'students': return <StudentDirectoryTab />;
      case 'professionals': return <ProfessionalDirectoryTab />;
      case 'parents': return <ParentDirectoryTab />;
      case 'settings': return <SystemSettingsTab />;
      default: return <OverviewTab data={overviewData} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 capitalize">{activeTab.replace('_', ' ')}</h2>
            <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">{userData?.role || 'super_admin'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input type="text" placeholder="Search users, settings..." className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-7 7 7 7 0 0114 0z" /></svg>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <button onClick={onBackToApp} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Back to App</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{renderTabContent()}</main>
      </div>
    </div>
  );
};

export default SuperAdminView;
