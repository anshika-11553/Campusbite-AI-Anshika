'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function AdminStudentsPage() {
  return (
    <DashboardLayout role="admin" title="Student Directory Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Registered Campus Students
            </h2>
            <p className="text-xs text-slate-500">Manage student accounts, meal wallets, & access</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-300">
            1,420 Active Students
          </span>
        </div>

        <div className="max-w-md">
          <Input placeholder="Search student by name, ID, or email..." leftIcon={<Search className="h-4 w-4" />} />
        </div>

        <Card className="p-4 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Wallet Balance</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { name: 'Alex Morgan', email: 'alex.m@college.edu', balance: '₹450.00', orders: 28, status: 'Active' },
                  { name: 'Rohan Sharma', email: 'rohan.s@college.edu', balance: '₹220.00', orders: 19, status: 'Active' },
                  { name: 'Ananya Gupta', email: 'ananya.g@college.edu', balance: '₹890.00', orders: 42, status: 'Active' },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3 font-semibold text-emerald-700">{s.balance}</td>
                    <td className="p-3">{s.orders}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
