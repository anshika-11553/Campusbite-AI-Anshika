import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from '@/components/ui/Card';
import { Utensils, QrCode, Clock, ShieldCheck, Zap } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      {/* Animated Glowing Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl mix-blend-multiply filter animate-blob pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000 pointer-events-none" />

      {/* Radial Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#054a36_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Section: Hero Highlights Visual */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 p-2 lg:p-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-[#054A36] text-xs font-semibold backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>Next-Gen Smart Campus Canteen</span>
            </div>

            <div className="flex items-center gap-3">
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
              Eliminate canteen queues, pre-order meals seamlessly, and track order status in real-time across your campus food outlets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#054A36]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Smart Queueing</h3>
                <p className="text-xs text-slate-500 mt-0.5">Zero wait time ordering</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Express QR Pickup</h3>
                <p className="text-xs text-slate-500 mt-0.5">Scan & collect instantly</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure university single sign-on & role-based authentication</span>
          </div>
        </div>

        {/* Right Section: Glassmorphism Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
          <Card className="p-6 sm:p-8 shadow-2xl shadow-slate-300/50 border-white/80 bg-white/90 backdrop-blur-xl">
            <div className="mb-6 space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">Sign In to Your Account</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Select your designated portal role and enter your credentials.
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don&apos;t have a campus account?{' '}
                <a href="/register" className="font-extrabold text-[#054A36] hover:underline">
                  Create Account
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
