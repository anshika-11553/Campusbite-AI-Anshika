'use client';

import React from 'react';
import { UserRole } from '@/types/auth';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NotificationCenter } from '@/components/common/NotificationCenter';

interface TopbarProps {
  role: UserRole;
  title: string;
  onToggleMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ role, title, onToggleMobileSidebar }) => {
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const roleLabelMap: Record<UserRole, string> = {
    student: 'Student',
    vendor: 'Vendor Outlet',
    chief: 'Head Chef',
    admin: 'System Admin',
  };

  const roleLabel = roleLabelMap[role] || role;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#054A36]"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors relative"
            aria-label="Open notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Dark/Light Theme Switch */}
        <ThemeToggle />

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Role & User Badge */}
        <div className="flex items-center gap-2.5">
          <Badge variant="emerald" className="uppercase text-[10px] tracking-wider font-bold">
            {roleLabel}
          </Badge>
          <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline-block">
            {user?.email ? user.email.split('@')[0] : 'Authenticated User'}
          </span>
        </div>
      </div>
    </header>
  );
};
