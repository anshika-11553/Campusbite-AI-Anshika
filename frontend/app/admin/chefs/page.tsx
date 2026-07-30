'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { ChefHat, Plus, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

interface ChefItem {
  id: string;
  name: string;
  outlet: string;
  cert: string;
  status: 'Active' | 'Deactivated';
}

export default function AdminChefsPage() {
  const { showToast } = useToast();
  const [chefs, setChefs] = useState<ChefItem[]>([
    { id: 'c-1', name: 'Head Chef Vikrant Sharma', outlet: 'Main Canteen Kitchen', cert: 'Master Culinary Admin', status: 'Active' },
    { id: 'c-2', name: 'Chef Suresh Kumar', outlet: 'South Express Kitchen', cert: 'Senior Line Supervisor', status: 'Active' },
    { id: 'c-3', name: 'Chef Meenakshi Rao', outlet: 'North Kitchen', cert: 'Quality Assurance Lead', status: 'Active' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newOutlet, setNewOutlet] = useState('');
  const [newCert, setNewCert] = useState('');

  const handleSaveChef = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newOutlet.trim()) {
      return showToast('Chef name and kitchen outlet are required.', 'error');
    }

    if (editingId) {
      setChefs((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name: newName, outlet: newOutlet, cert: newCert || 'Certified Lead' } : c))
      );
      showToast('Head Chef details updated!', 'success');
      setEditingId(null);
    } else {
      const created: ChefItem = {
        id: `c-${Date.now()}`,
        name: newName,
        outlet: newOutlet,
        cert: newCert || 'Certified Lead',
        status: 'Active',
      };
      setChefs((prev) => [created, ...prev]);
      showToast('New Head Chef registered!', 'success');
    }

    setNewName('');
    setNewOutlet('');
    setNewCert('');
    setIsAdding(false);
  };

  const handleStartEdit = (c: ChefItem) => {
    setEditingId(c.id);
    setNewName(c.name);
    setNewOutlet(c.outlet);
    setNewCert(c.cert);
    setIsAdding(true);
  };

  const handleToggleStatus = (id: string) => {
    setChefs((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Deactivated' : 'Active';
          showToast(`Chef ${c.name} status set to ${nextStatus}`, 'info');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleRemoveChef = (id: string) => {
    setChefs((prev) => prev.filter((c) => c.id !== id));
    showToast('Head Chef removed from staff registry.', 'warning');
  };

  return (
    <DashboardLayout role="admin" title="Head Chef Registry">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-purple-600" />
              Kitchen Executive Staff
            </h2>
            <p className="text-xs text-slate-500">Add, edit, activate, or deactivate certified head chefs</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingId(null);
              setNewName('');
              setNewOutlet('');
              setNewCert('');
              setIsAdding(!isAdding);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            {isAdding ? 'Close Form' : 'Register New Head Chef'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-5 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 space-y-4">
            <h3 className="font-bold text-sm text-purple-900 dark:text-purple-300">
              {editingId ? 'Edit Head Chef Staff' : 'Register New Head Chef Staff'}
            </h3>
            <form onSubmit={handleSaveChef} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <Input
                placeholder="Full Chef Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <Input
                placeholder="Kitchen Outlet (e.g. Main Kitchen)"
                value={newOutlet}
                onChange={(e) => setNewOutlet(e.target.value)}
                required
              />
              <Input
                placeholder="Certification Title"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
              />
              <Button type="submit" variant="primary" className="bg-purple-700 hover:bg-purple-800 text-white font-bold">
                {editingId ? 'Save Edits' : 'Register Chef'}
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chefs.map((c) => (
            <Card key={c.id} className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 rounded-2xl">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.outlet}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    c.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                  {c.cert}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(c.id)}
                    className="p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                    title="Toggle Activate/Deactivate"
                  >
                    {c.status === 'Active' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className="text-[11px]">{c.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(c)}
                    className="p-1.5 text-slate-500 hover:text-purple-600"
                    title="Edit Head Chef"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveChef(c.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600"
                    title="Remove Head Chef"
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
