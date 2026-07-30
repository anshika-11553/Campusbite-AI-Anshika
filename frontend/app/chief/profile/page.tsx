'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChefHat, Flame, ShieldCheck, CheckCircle2, User, Camera } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function ChefProfilePage() {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [chefName, setChefName] = useState('Head Chef Vikrant Sharma');
  const [title, setTitle] = useState('Executive Campus Kitchen Director');
  const [station, setStation] = useState('Station 1 - Main Hot Kitchen & Grill');
  const [status, setStatus] = useState('Active on Burner (High Capacity)');
  const [experience, setExperience] = useState('12 Years Culinary Operations');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chefName.trim()) return showToast('Chef name is required.', 'error');
    setIsEditing(false);
    showToast('Head Chef Profile & Kitchen Status updated!', 'success');
  };

  return (
    <DashboardLayout role="chief" title="Head Chef Profile & Station Status">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-6 border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300">
                  <ChefHat className="h-9 w-9" />
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Profile photo update placeholder trigger', 'info')}
                  className="absolute -bottom-1 -right-1 p-1 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow"
                  title="Change avatar"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{chefName}</h2>
                <p className="text-xs text-slate-500 font-medium">{title}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                  <Flame className="h-3 w-3 text-amber-600 animate-pulse" /> {status}
                </span>
              </div>
            </div>

            <Button
              variant={isEditing ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile & Kitchen Info'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Chef Name *</label>
                <Input
                  value={chefName}
                  onChange={(e) => setChefName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Culinary Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Kitchen Workstation</label>
                  <Input
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    leftIcon={<ChefHat className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Live Cooking Status</label>
                  <Input
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    leftIcon={<Flame className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Culinary Experience</label>
                  <Input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 rounded-xl"
              >
                Save Kitchen Profile & Status
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Assigned Workstation</span>
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-amber-600" /> {station}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Experience SLA</span>
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> {experience}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-800 block">
                  Kitchen Operations Responsibilities
                </span>
                <p className="leading-relaxed">
                  Directing line prep cooks, monitoring preparation timers for instant pre-orders, verifying hygiene protocols, and confirming dish quality before dispatching to express pickup counters.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
