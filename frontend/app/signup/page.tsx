'use client';

import React from 'react';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Card } from '@/components/ui/Card';
import { Utensils, Clock, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      {/* Animated Glowing Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl mix-blend-multiply filter animate-blob pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000 pointer-events-none" />

      {/* Radial Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#054a36_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Section: Hero Highlights Visual */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 p-2 lg:p-6">
          <div className="space-y-4">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#054A36] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Landing Page
            </Link>

            <div className="flex items-center gap-3 pt-2">
              <div className="p-3.5 bg-[#054A36] rounded-2xl text-white shadow-lg shadow-[#054A36]/30">
                <Utensils className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {siteConfig.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{siteConfig.tagline}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              Join thousands of campus students, vendors, and chefs streamlining university dining with zero wait times and live token tracking.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#054A36]">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-slate-700">Instant setup in under 60 seconds</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700">
                <Zap className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-slate-700">Multi-outlet campus dining integration</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure university identity & role authentication</span>
          </div>
        </div>

        {/* Right Section: Glassmorphism Register Card */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto">
          <Card className="p-6 sm:p-8 shadow-2xl shadow-slate-300/50 border-white/80 bg-white/95 backdrop-blur-xl">
            <div className="mb-6 space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">Create CampusBite Account</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Select your role and fill in your registration details below.
              </p>
            </div>

            <SignUpForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
