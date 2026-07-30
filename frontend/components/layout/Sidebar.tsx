import React from 'react';
import { UserRole } from '@/types/auth';
import { Utensils, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { logout } = useAuth();

  return (
    <aside className="w-full md:w-64 bg-[#054A36] text-white p-4 md:p-6 flex flex-col justify-between shrink-0 shadow-lg">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight">CampusBite AI</h2>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-300/80">
              {role} Portal
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-100/70 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </nav>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-red-100 font-medium text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
