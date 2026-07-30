'use client';

import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Wallet, Award, Mail, ShieldCheck, Phone, GraduationCap, Camera, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/constants/currency';
import { useToast } from '@/hooks/useToast';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.displayName || 'Anshika Sharma');
  const [email, setEmail] = useState(user?.email || 'student@college.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [department, setDepartment] = useState('Computer Science & Eng.');
  const [academicYear, setAcademicYear] = useState('3rd Year / 6th Sem');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        showToast('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return showToast('Full name cannot be empty.', 'error');
    if (!email.trim()) return showToast('Email cannot be empty.', 'error');

    setIsEditing(false);
    showToast('Student profile details saved successfully!', 'success');
  };

  return (
    <DashboardLayout role="student" title="Student Profile & Wallet">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-emerald-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#054A36] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                    {(fullName[0] || 'A').toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow"
                  title="Upload profile photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {fullName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {email}
                </p>
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#054A36] dark:text-emerald-400 text-[10px] font-extrabold">
                  <ShieldCheck className="h-3 w-3" /> Verified Student ID: STD-2026-89
                </span>
              </div>
            </div>

            <Button
              variant={isEditing ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#054A36] hover:bg-emerald-800 text-white"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Student Name *</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Campus Email *</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    leftIcon={<GraduationCap className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Academic Year</label>
                  <Input
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="w-full bg-[#054A36] text-white font-extrabold py-3 rounded-xl"
              >
                Save Profile Changes
              </Button>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 space-y-1">
                  <div className="flex items-center gap-2 text-[#054A36] dark:text-emerald-400 font-bold text-xs">
                    <Wallet className="h-4 w-4" /> Canteen Meal Wallet
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(650)}</p>
                  <span className="text-[10px] text-slate-400">Pre-loaded for express 1-tap checkout</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 space-y-1">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Award className="h-4 w-4" /> Reward Loyalty Points
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">340 PTS</p>
                  <span className="text-[10px] text-slate-400">+10 PTS earned per ₹100 spent</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-500" /> Academic & Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-400 block font-medium">Phone</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-400 block font-medium">Department</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{department}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-400 block font-medium">Academic Year</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{academicYear}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
