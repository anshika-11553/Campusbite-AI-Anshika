'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Sparkles, Utensils, LogIn, UserPlus, Clock, ShieldCheck, Flame, Store, ChefHat, User } from 'lucide-react';

export default function AuthLandingPage() {
  const roles = [
    {
      title: 'Student Portal',
      icon: <User className="h-6 w-6 text-emerald-400" />,
      desc: 'Browse 35+ items, pre-order with instant two-digit tokens, & avoid canteen queues.',
    },
    {
      title: 'Vendor Portal',
      icon: <Store className="h-6 w-6 text-amber-400" />,
      desc: 'Manage incoming student orders, accept tickets, & forward directly to kitchen.',
    },
    {
      title: 'Head Chef KDS',
      icon: <ChefHat className="h-6 w-6 text-purple-400" />,
      desc: 'Kitchen Display System with preparation timers, priority tags, & ready markers.',
    },
    {
      title: 'Admin Portal',
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
      desc: 'Comprehensive campus analytics, revenue tracking, vendor management, & audit logs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#032219] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Gradient Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 font-extrabold shadow-lg">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-1.5 text-white">
              CampusBite <span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-[10px] text-emerald-200/70 font-bold uppercase tracking-wider">Smart Campus Canteen</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost" className="text-emerald-200 hover:text-white hover:bg-white/10 text-xs font-bold px-4 rounded-xl">
              Sign In
            </Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 rounded-xl shadow-md">
              Create Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Glassmorphism Hero Container */}
      <main className="container mx-auto px-6 py-12 flex flex-col items-center text-center relative z-10 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Next-Generation Token-Based Campus Canteen Platform</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-4">
          Smart Campus Food Ordering <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
            Experience
          </span>
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl font-normal leading-relaxed mb-8">
          Skip long canteen lines with instant two-digit tokens, live queue rank tracking, and real-time Kitchen Display System synchronization.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<LogIn className="h-5 w-5 text-[#054A36]" />}
              className="w-full sm:w-auto bg-white text-[#054A36] font-extrabold hover:bg-slate-100 px-8 py-4 text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              Sign In to Portal
            </Button>
          </Link>

          <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<UserPlus className="h-5 w-5" />}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-4 text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              Create New Account
            </Button>
          </Link>
        </div>

        {/* Role Explainer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl text-left">
          {roles.map((r, idx) => (
            <div
              key={idx}
              className="p-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/40 rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/10 shrink-0">{r.icon}</div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">{r.title}</h3>
                <p className="text-xs text-emerald-100/70 mt-1 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/60 relative z-10">
        <p>© 2026 CampusBite AI. All rights reserved.</p>
        <div className="flex items-center gap-4 font-semibold">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-emerald-400" /> Instant Two-Digit Tokens
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" /> Real-time Head Chef KDS
          </span>
        </div>
      </footer>
    </div>
  );
}
