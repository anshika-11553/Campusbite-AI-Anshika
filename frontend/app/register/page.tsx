'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { authApiService } from '@/services/api/v1/auth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import {
  Utensils,
  User,
  Store,
  ChefHat,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  IdCard,
  Building,
  GraduationCap,
  Upload,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [department, setDepartment] = useState<string>('Computer Science & Engineering');
  const [yearSemester, setYearSemester] = useState<string>('3rd Year / 5th Semester');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);

  // Password Visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roleDefinitions = [
    {
      id: 'student' as UserRole,
      title: 'Student',
      icon: <User className="h-5 w-5" />,
      badge: '🎓 Campus Student',
      description: 'Pre-order meals, track live queue token status & earn canteen rewards.',
    },
    {
      id: 'vendor' as UserRole,
      title: 'Vendor',
      icon: <Store className="h-5 w-5" />,
      badge: '🏪 Food Stall Vendor',
      description: 'Manage incoming student orders, accept tickets, & forward to kitchen.',
    },
    {
      id: 'chief' as UserRole,
      title: 'Head Chef',
      icon: <ChefHat className="h-5 w-5" />,
      badge: '👨‍🍳 Kitchen Display System',
      description: 'Monitor live cooking timers, item prep queues, & mark orders ready.',
    },
    {
      id: 'admin' as UserRole,
      title: 'Admin',
      icon: <ShieldCheck className="h-5 w-5" />,
      badge: '🛡️ Portal Administrator',
      description: 'Campus canteen analytics, revenue tracking, & system configuration.',
    },
  ];

  // Password Strength Estimator
  const getPasswordStrength = () => {
    if (!password) return { label: '', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: 'Weak', score: 33, color: 'bg-red-500' };
    if (score <= 4) return { label: 'Medium', score: 66, color: 'bg-amber-500' };
    return { label: 'Strong 💪', score: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handlePhotoPlaceholderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setProfilePhoto(fileName);
      showToast(`Selected photo: ${fileName}`, 'info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) return setErrorMessage('Please enter your Full Name.');
    if (!email.trim() || !email.includes('@')) return setErrorMessage('Please enter a valid College Email address.');
    if (!mobileNumber.trim() || mobileNumber.length < 10) return setErrorMessage('Please enter a 10-digit Mobile Number.');
    if (!studentId.trim()) return setErrorMessage('Please enter your Student / Staff ID Number.');
    if (!password) return setErrorMessage('Please enter a password.');
    if (password !== confirmPassword) return setErrorMessage('Passwords do not match. Please re-enter.');
    if (!agreedTerms) return setErrorMessage('You must agree to the Terms & Conditions to register.');

    setIsSubmitting(true);

    try {
      const res = await authApiService.registerUser({
        fullName,
        email,
        mobileNumber,
        studentId,
        department,
        yearSemester,
        password,
        role: selectedRole,
        profilePhotoUrl: profilePhoto || undefined,
      });

      if (res.success) {
        showToast('Registration successful! Redirecting to login portal...', 'success');
        setTimeout(() => {
          router.push(ROUTES.LOGIN);
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#032219] via-[#054A36] to-[#021812] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Subtle Shimmer Background Accents */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-2xl p-6 sm:p-8 border-white/20 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl my-8 relative z-10">
        {/* Header Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-[#054A36] flex items-center justify-center text-white font-extrabold shadow-md">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Create Campus Account
              </h2>
              <p className="text-xs text-slate-500 font-medium">Join CampusBite AI Smart Canteen Platform</p>
            </div>
          </div>

          <Link href={ROUTES.LOGIN} className="text-xs font-extrabold text-[#054A36] hover:underline flex items-center gap-1">
            Sign In Instead <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            Select Your Campus Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {roleDefinitions.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#054A36] text-white border-[#054A36] shadow-md scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={isSelected ? 'text-white' : 'text-slate-600'}>{role.icon}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
                  </div>
                  <span className="font-extrabold text-xs">{role.title}</span>
                  <span className={`text-[9px] font-semibold line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {role.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Error Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 mb-5">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Full Name & College Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <Input
                placeholder="e.g. Anshika Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="h-4 w-4 text-slate-400" />}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">College Email *</label>
              <Input
                type="email"
                placeholder="e.g. anshika@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                required
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Row 2: Mobile Number & Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
              <Input
                type="tel"
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {selectedRole === 'student' ? 'Student ID / Roll No. *' : 'Staff / Employee ID *'}
              </label>
              <Input
                placeholder="e.g. CS-2024-892"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                leftIcon={<IdCard className="h-4 w-4 text-slate-400" />}
                required
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Row 3: Department & Year/Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
              <div className="relative">
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  leftIcon={<Building className="h-4 w-4 text-slate-400" />}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Year / Semester</label>
              <Input
                value={yearSemester}
                onChange={(e) => setYearSemester(e.target.value)}
                leftIcon={<GraduationCap className="h-4 w-4 text-slate-400" />}
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Row 4: Profile Picture Upload Placeholder */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Profile Photo (Optional)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-between p-3 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50/50 transition-all">
                <span className="text-xs font-semibold text-slate-600 truncate">
                  {profilePhoto ? `Selected: ${profilePhoto}` : 'Upload avatar image (PNG, JPG)'}
                </span>
                <Upload className="h-4 w-4 text-slate-400 shrink-0" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoPlaceholderUpload} />
              </label>
            </div>
          </div>

          {/* Row 5: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                  required
                  className="rounded-xl border-slate-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Progress */}
              {password && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Strength: {strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password *</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                  required
                  className="rounded-xl border-slate-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <span className="text-[10px] text-red-600 font-bold block mt-1">Passwords do not match</span>
              )}
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 font-medium">
              I agree to the CampusBite AI <span className="text-[#054A36] font-bold underline">Terms of Service</span> &{' '}
              <span className="text-[#054A36] font-bold underline">Privacy Policy</span>.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg text-sm mt-4"
          >
            {isSubmitting ? 'Registering Account...' : 'Complete Registration'}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-6 border-t border-slate-100 mt-6">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="font-extrabold text-[#054A36] hover:underline">
              Sign In to your portal
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
