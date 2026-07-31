'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authApiService } from '@/services/api/v1/auth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      return setErrorMessage('Please enter a valid registered College Email.');
    }

    setIsSubmitting(true);

    try {
      const res = await authApiService.forgotPassword({ email });
      if (res.success) {
        setIsSent(true);
        showToast(`Reset email dispatched to ${email}! 📩`, 'success');
      } else {
        setErrorMessage(res.message || 'Failed to send reset link. Try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#032219] via-[#054A36] to-[#021812] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md p-6 sm:p-8 border-white/20 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl relative z-10">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold shadow-lg">
            <KeyRound className="h-7 w-7 text-slate-950" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Enter your college email address to receive password reset instructions.
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-sm text-slate-900">Reset Link Sent!</h3>
            <p className="text-xs text-slate-600">
              We dispatched password recovery instructions to <span className="font-bold text-slate-900">{email}</span>. Please check your inbox and spam folder.
            </p>
            <Link href={ROUTES.LOGIN} className="block pt-2">
              <Button variant="primary" className="w-full bg-[#054A36] text-white font-extrabold rounded-xl py-2.5">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Registered College Email *</label>
              <Input
                type="email"
                placeholder="e.g. student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md text-xs"
            >
              {isSubmitting ? 'Sending Instructions...' : 'Send Reset Password Link'}
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link href={ROUTES.LOGIN} className="text-xs font-extrabold text-[#054A36] hover:underline inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
