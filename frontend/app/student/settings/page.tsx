'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Settings, Bell, Shield, Moon } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function StudentSettingsPage() {
  const { showToast } = useToast();
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);

  const handleSave = () => {
    showToast('Preferences saved successfully!', 'success');
  };

  return (
    <DashboardLayout role="student" title="Student Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Settings className="h-6 w-6 text-[#054A36]" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Portal & Alert Preferences</h2>
              <p className="text-xs text-slate-500">Configure notifications, theme preferences, and security</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#054A36]" />
                <div>
                  <span className="font-bold text-slate-800 block">Real-time Order Status Toasts</span>
                  <span className="text-slate-400">Receive instant alerts when token status changes</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => {
                  setOrderAlerts(e.target.checked);
                  handleSave();
                }}
                className="h-4 w-4 text-[#054A36] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-800 block">Campus Special Offers</span>
                  <span className="text-slate-400">Receive discount notifications (CAMPUS20)</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={promoAlerts}
                onChange={(e) => {
                  setPromoAlerts(e.target.checked);
                  handleSave();
                }}
                className="h-4 w-4 text-[#054A36] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-purple-600" />
                <div>
                  <span className="font-bold text-slate-800 block">Dark Mode Support</span>
                  <span className="text-slate-400">Use theme switcher in topbar to toggle dark/light theme</span>
                </div>
              </div>
              <span className="font-extrabold text-[#054A36]">Enabled</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
