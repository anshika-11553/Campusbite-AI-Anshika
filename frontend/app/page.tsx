'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Sparkles, 
  ChefHat, 
  Store, 
  GraduationCap, 
  CheckCircle2, 
  Star,
  Flame,
  ShieldCheck,
  Award
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[125px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Radial Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Navigation Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl text-white shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              Smart Canteen Ecosystem
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.LOGIN}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all border border-slate-700/60 hover:border-slate-500 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4 text-emerald-400" />
            Sign In
          </Link>
          <Link
            href={ROUTES.SIGNUP}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all border border-emerald-400/30 flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-xl shadow-inner">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Zero-Wait Smart Campus Dining</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                AI Powered
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Skip lines.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Pre-order meals.
              </span>{' '}
              Savor every minute.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              CampusBite AI transforms university dining into a lightning-fast digital experience. Track live token status, explore 35+ menu offerings, order from top campus outlets, and collect via express counter pickup.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href={ROUTES.LOGIN}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-emerald-400/40"
              >
                <span>Sign In to Portal</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href={ROUTES.SIGNUP}
                className="px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-base border border-slate-700/80 hover:border-slate-500 transition-all flex items-center justify-center gap-3 backdrop-blur-xl shadow-lg"
              >
                <UserPlus className="h-5 w-5 text-emerald-400" />
                <span>Create New Account</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-400 font-medium">Real-Time Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-400 font-medium">35+ Menu Catalogue</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-400 font-medium">4 Portal Roles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role Portal Cards Grid */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-700/50 via-slate-800/40 to-slate-900/60 backdrop-blur-2xl border border-slate-700/60 shadow-2xl">
              <div className="p-6 rounded-[22px] bg-slate-950/80 space-y-6">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      Select Portal Access
                    </h2>
                    <p className="text-xs text-slate-400">Choose your role to get started</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                    <Flame className="h-3 w-3" /> Campus Active
                  </span>
                </div>

                {/* Role Highlights Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`${ROUTES.LOGIN}?role=student`}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 hover:from-emerald-950/60 hover:to-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer"
                  >
                    <div className="p-2.5 w-fit bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-white mt-3 group-hover:text-emerald-300 transition-colors">
                      Student Portal
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Order food & track tokens live</p>
                  </Link>

                  <Link
                    href={`${ROUTES.LOGIN}?role=vendor`}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 hover:from-teal-950/60 hover:to-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all group cursor-pointer"
                  >
                    <div className="p-2.5 w-fit bg-teal-500/20 text-teal-400 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-all">
                      <Store className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-white mt-3 group-hover:text-teal-300 transition-colors">
                      Vendor Outlet
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Manage live order queues</p>
                  </Link>

                  <Link
                    href={`${ROUTES.LOGIN}?role=chief`}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 hover:from-amber-950/60 hover:to-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group cursor-pointer"
                  >
                    <div className="p-2.5 w-fit bg-amber-500/20 text-amber-400 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <ChefHat className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-white mt-3 group-hover:text-amber-300 transition-colors">
                      Head Chef
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Control kitchen prep steps</p>
                  </Link>

                  <Link
                    href={`${ROUTES.LOGIN}?role=admin`}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 hover:from-purple-950/60 hover:to-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group cursor-pointer"
                  >
                    <div className="p-2.5 w-fit bg-purple-500/20 text-purple-400 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-white mt-3 group-hover:text-purple-300 transition-colors">
                      System Admin
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Analytics & outlet management</p>
                  </Link>
                </div>

                {/* Quick Demo Credentials Footer */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400 shrink-0 fill-amber-400" />
                    <span>Quick Demo: Instant role switching enabled</span>
                  </div>
                  <Link href={ROUTES.LOGIN} className="text-emerald-400 font-semibold hover:underline">
                    Sign In →
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-slate-300">{siteConfig.name}</span>
            <span>— {siteConfig.tagline}</span>
          </div>
          <p>© {new Date().getFullYear()} CampusBite AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
