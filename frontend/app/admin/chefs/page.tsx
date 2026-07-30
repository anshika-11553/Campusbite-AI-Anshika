'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { ChefHat } from 'lucide-react';

export default function AdminChefsPage() {
  return (
    <DashboardLayout role="admin" title="Head Chef Registry">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-purple-600" />
              Kitchen Executive Staff
            </h2>
            <p className="text-xs text-slate-500">Certified head chefs and kitchen leads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Head Chef Vikrant Sharma', outlet: 'Main Canteen Kitchen', cert: 'Master Culinary Admin' },
            { name: 'Chef Suresh Kumar', outlet: 'South Express Kitchen', cert: 'Senior Line Supervisor' },
          ].map((c, i) => (
            <Card key={i} className="p-5 border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{c.name}</h3>
                <p className="text-xs text-slate-500">{c.outlet}</p>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {c.cert}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
