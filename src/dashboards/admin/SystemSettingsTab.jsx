import React from 'react';
import { Settings, Bell, Shield, Database, Key } from 'lucide-react';

const SystemSettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
        <p className="text-slate-500 font-medium mt-1">Configure platform-wide settings and permissions</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Notifications</h3>
          <p className="text-sm text-slate-500">Configure email alerts, push notifications, and reminder settings</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Security & Roles</h3>
          <p className="text-sm text-slate-500">Manage user roles, permissions, and access controls</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Data Management</h3>
          <p className="text-sm text-slate-500">Export data, manage backups, and configure retention policies</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">API & Integrations</h3>
          <p className="text-sm text-slate-500">Configure third-party integrations and API access</p>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-bold">Platform Configuration</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm">Version</p>
            <p className="font-bold">2.4.1</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Environment</p>
            <p className="font-bold">Production</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Last Deploy</p>
            <p className="font-bold">2 hours ago</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Region</p>
            <p className="font-bold">Asia-Pacific</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;
