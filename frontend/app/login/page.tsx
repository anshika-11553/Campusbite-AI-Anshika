import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from '@/components/ui/Card';
import { Utensils, QrCode, Clock, ShieldCheck, Zap } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Section: Hero Highlights Visual */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 p-2 lg:p-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#054A36] text-xs font-semibold">
              <Zap className="h-3.5 w-3.5" />
              <span>Next-Gen Smart Campus Canteen</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#054A36] rounded-2xl text-white shadow-md shadow-[#054A36]/20">
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
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#054A36]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Smart Queueing</h3>
                <p className="text-xs text-slate-500 mt-0.5">Zero wait time ordering</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
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

        {/* Right Section: Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
          <Card className="p-6 sm:p-8 shadow-xl shadow-slate-200/60 border-slate-200">
            <div className="mb-6 space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">Sign In to Your Account</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Select your designated portal role and enter your credentials.
              </p>
            </div>

            <LoginForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
