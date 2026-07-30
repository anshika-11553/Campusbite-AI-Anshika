'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Store, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminVendorsPage() {
  return (
    <DashboardLayout role="admin" title="Vendor Outlets Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="h-6 w-6 text-purple-600" />
              Campus Food Vendors
            </h2>
            <p className="text-xs text-slate-500">Manage licensed campus canteens & food stalls</p>
          </div>
          <Button variant="primary" size="sm">+ Register New Outlet</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Main Campus Canteen', vendor: 'Ramesh Foods Pvt Ltd', rating: '4.8', status: 'Operational' },
            { name: 'South Express Food Hub', vendor: 'Venkatesh Caterers', rating: '4.7', status: 'Operational' },
          ].map((v, i) => (
            <Card key={i} className="p-5 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900">{v.name}</h3>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {v.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{v.vendor}</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{v.rating} / 5.0 Rating</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
