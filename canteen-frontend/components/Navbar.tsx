"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ROLES } from "@/lib/api";
import {
  UtensilsCrossed,
  ShoppingBag,
  UserCheck,
  ChefHat,
  Store,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, activeRole, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();

  const getRoleConfig = (roleId: string) => {
    switch (roleId) {
      case ROLES.VENDOR:
        return { name: "Vendor Portal", icon: Store, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case ROLES.CHEF:
        return { name: "Chef Portal", icon: ChefHat, color: "bg-amber-50 text-amber-700 border-amber-200" };
      case ROLES.ADMIN:
        return { name: "Admin Portal", icon: ShieldCheck, color: "bg-purple-50 text-purple-700 border-purple-200" };
      default:
        return { name: "Student Portal", icon: UserCheck, color: "bg-orange-50 text-orange-700 border-orange-200" };
    }
  };

  const activeRoleConfig = getRoleConfig(activeRole);
  const ActiveIcon = activeRoleConfig.icon;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Swiggy / Amazon Style Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <UtensilsCrossed className="w-5 h-5 text-white font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Campus<span className="text-[#fc8019]">Bite</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-[#fc8019] rounded-md border border-orange-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#fc8019]" /> AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Campus Food & Kitchen Ordering</p>
          </div>
        </div>

        {/* Static Locked Role Badge for Active Profile */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${activeRoleConfig.color} shadow-sm`}
          >
            <ActiveIcon className="w-3.5 h-3.5" />
            <span>{activeRoleConfig.name}</span>
          </div>
        </div>

        {/* Right Section - Cart & Profile */}
        <div className="flex items-center gap-3">
          {activeRole === ROLES.STUDENT && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fc8019] text-white hover:bg-[#e5700e] transition-all font-bold text-xs shadow-md shadow-orange-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-[#fc8019] text-[11px] font-black rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </button>
          )}

          {user && (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{user.email}</p>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
