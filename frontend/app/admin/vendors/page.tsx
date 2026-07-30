'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Store, Star, Plus, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

interface VendorItem {
  id: string;
  name: string;
  vendor: string;
  rating: string;
  status: 'Operational' | 'Deactivated';
}

export default function AdminVendorsPage() {
  const { showToast } = useToast();
  const [vendors, setVendors] = useState<VendorItem[]>([
    { id: 'v-1', name: 'Main Campus Canteen', vendor: 'Ramesh Foods Pvt Ltd', rating: '4.8', status: 'Operational' },
    { id: 'v-2', name: 'South Express Food Hub', vendor: 'Venkatesh Caterers', rating: '4.7', status: 'Operational' },
    { id: 'v-3', name: 'North Canteen & Juice Corner', vendor: 'Gupta Refreshments', rating: '4.6', status: 'Operational' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newVendor, setNewVendor] = useState('');

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newVendor.trim()) {
      return showToast('Vendor name and licensee are required.', 'error');
    }

    if (editingId) {
      setVendors((prev) =>
        prev.map((v) => (v.id === editingId ? { ...v, name: newName, vendor: newVendor } : v))
      );
      showToast('Vendor outlet updated successfully!', 'success');
      setEditingId(null);
    } else {
      const created: VendorItem = {
        id: `v-${Date.now()}`,
        name: newName,
        vendor: newVendor,
        rating: '5.0',
        status: 'Operational',
      };
      setVendors((prev) => [created, ...prev]);
      showToast('New vendor outlet registered!', 'success');
    }

    setNewName('');
    setNewVendor('');
    setIsAdding(false);
  };

  const handleStartEdit = (v: VendorItem) => {
    setEditingId(v.id);
    setNewName(v.name);
    setNewVendor(v.vendor);
    setIsAdding(true);
  };

  const handleToggleStatus = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextStatus = v.status === 'Operational' ? 'Deactivated' : 'Operational';
          showToast(`Vendor ${v.name} status set to ${nextStatus}`, 'info');
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  const handleRemoveVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    showToast('Vendor outlet removed from registry.', 'warning');
  };

  return (
    <DashboardLayout role="admin" title="Vendor Outlets Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="h-6 w-6 text-purple-600" />
              Campus Food Vendors
            </h2>
            <p className="text-xs text-slate-500">Add, edit, activate, or deactivate campus canteen vendors</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingId(null);
              setNewName('');
              setNewVendor('');
              setIsAdding(!isAdding);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            {isAdding ? 'Close Form' : 'Register New Vendor'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-5 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 space-y-4">
            <h3 className="font-bold text-sm text-purple-900 dark:text-purple-300">
              {editingId ? 'Edit Vendor Outlet' : 'Register New Vendor Outlet'}
            </h3>
            <form onSubmit={handleAddVendor} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <Input
                placeholder="Outlet Name (e.g. Snack Station)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <Input
                placeholder="Licensee Company (e.g. Sharma Caterers)"
                value={newVendor}
                onChange={(e) => setNewVendor(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="bg-purple-700 hover:bg-purple-800 text-white font-bold">
                {editingId ? 'Save Edits' : 'Create Vendor'}
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((v) => (
            <Card key={v.id} className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{v.name}</h3>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    v.status === 'Operational'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">{v.vendor}</p>

              {/* Vendor UPI Payment Audit (Read Only for Admin) */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">UPI Payment Settings</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    QR Uploaded & Active
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#054A36] dark:text-emerald-400">
                  UPI ID: {v.id === 'v-1' ? 'maincampus.canteen@upi' : v.id === 'v-2' ? 'southexpress@okaxis' : 'northcanteen@paytm'}
                </p>
                <p className="text-[10px] text-slate-400">Admin Audit: Read-only access. Vendor manages personal QR credentials.</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{v.rating} / 5.0</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(v.id)}
                    className="p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                    title="Toggle Activate/Deactivate"
                  >
                    {v.status === 'Operational' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className="text-[11px]">{v.status === 'Operational' ? 'Deactivate' : 'Activate'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(v)}
                    className="p-1.5 text-slate-500 hover:text-purple-600"
                    title="Edit Vendor"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveVendor(v.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600"
                    title="Remove Vendor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
