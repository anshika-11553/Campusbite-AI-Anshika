"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/api";
import {
  Utensils,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Store,
  ChefHat,
  GraduationCap,
  AlertCircle,
  KeyRound,
  MousePointerClick,
} from "lucide-react";

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      if (isLoginTab) {
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        await login(email, password);
      } else {
        if (!fullName || !email || !password) {
          throw new Error("All fields are required");
        }
        await register(fullName, email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentialsOnly = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMsg("");
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10 my-8">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-gradient-to-br from-[#fc8019] to-amber-500 rounded-2xl shadow-lg shadow-orange-500/20 mb-3">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Campus<span className="text-[#fc8019]">Bite</span> AI
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
            Smart Food Ordering & Kitchen Automation Platform
          </p>
        </div>

        {/* Swiggy Style Clean Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl space-y-6">
          
          {/* Preset Profile Credentials Auto-Fill Box */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-[#fc8019] uppercase tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Select Profile Credentials to Auto-Fill</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#fc8019] text-white rounded-md flex items-center gap-1">
                <MousePointerClick className="w-3 h-3" /> Fill Inputs
              </span>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentialsOnly("student@gmail.com", "1234")}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-left transition-all group flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="font-extrabold text-slate-900 group-hover:text-[#fc8019] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#fc8019]" />
                    <span>Student Profile</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">student@gmail.com</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: 1234</div>
                </div>
                <span className="text-[10px] font-extrabold text-[#fc8019] opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill ↵
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentialsOnly("vendor@gmail.com", "1234")}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-left transition-all group flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="font-extrabold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vendor Profile</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">vendor@gmail.com</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: 1234</div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill ↵
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentialsOnly("chef@gmail.com", "1234")}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-500 text-left transition-all group flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="font-extrabold text-slate-900 group-hover:text-amber-600 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chef Profile</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">chef@gmail.com</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: 1234</div>
                </div>
                <span className="text-[10px] font-extrabold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill ↵
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentialsOnly("admin@gmail.com", "1234")}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-500 text-left transition-all group flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="font-extrabold text-slate-900 group-hover:text-purple-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Profile</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">admin@gmail.com</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: 1234</div>
                </div>
                <span className="text-[10px] font-extrabold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill ↵
                </span>
              </button>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => { setIsLoginTab(true); setErrorMsg(""); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                isLoginTab ? "bg-[#fc8019] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In with Credentials
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setErrorMsg(""); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isLoginTab ? "bg-[#fc8019] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create New Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Shaswat Singh"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com or vendor@gmail.com..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019] focus:bg-white transition-colors font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019] focus:bg-white transition-colors font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-[#fc8019] hover:bg-[#e5700e] text-white font-extrabold rounded-xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login to Profile Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
