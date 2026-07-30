'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Utensils,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  History,
  Heart,
  Gift,
  User,
  Inbox,
  CheckCircle,
  BarChart3,
  Flame,
  Users,
  Store,
  ChefHat,
  Package,
  Sparkles,
  ShoppingCart,
  Ticket,
  FileSpreadsheet,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  className?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: 'main' | 'account';
  badge?: string;
}

export const getNavItemsForRole = (role: UserRole): NavItem[] => {
  switch (role) {
    case 'student':
      return [
        { label: 'Dashboard', href: '/student', icon: LayoutDashboard, section: 'main' },
        { label: 'Menu Explorer', href: '/student/menu', icon: UtensilsCrossed, section: 'main', badge: '35+' },
        { label: 'Cart', href: '/student/checkout', icon: ShoppingCart, section: 'main' },
        { label: 'Active Order', href: '/student', icon: Ticket, section: 'main', badge: 'Live' },
        { label: 'Order History', href: '/student/orders', icon: History, section: 'main' },
        { label: 'Favorites', href: '/student/favorites', icon: Heart, section: 'main' },
        { label: 'Rewards', href: '/student/rewards', icon: Gift, section: 'main', badge: '340 pts' },
        { label: 'Profile', href: '/student/profile', icon: User, section: 'account' },
        { label: 'Settings', href: '/student/settings', icon: Settings, section: 'account' },
      ];

    case 'vendor':
      return [
        { label: 'Dashboard', href: '/vendor', icon: LayoutDashboard, section: 'main' },
        { label: 'Incoming Orders', href: '/vendor/orders/incoming', icon: Inbox, section: 'main', badge: 'Live' },
        { label: 'Kitchen Queue', href: '/vendor/queue', icon: Utensils, section: 'main' },
        { label: 'Ready Orders', href: '/vendor/orders/ready', icon: CheckCircle, section: 'main' },
        { label: 'Analytics', href: '/vendor/analytics', icon: BarChart3, section: 'main' },
        { label: 'Profile', href: '/vendor/profile', icon: User, section: 'account' },
        { label: 'Settings', href: '/vendor/settings', icon: Settings, section: 'account' },
      ];

    case 'chief':
      return [
        { label: 'Dashboard', href: '/chief', icon: LayoutDashboard, section: 'main' },
        { label: 'Kitchen Queue', href: '/chief/queue', icon: Utensils, section: 'main' },
        { label: 'Preparing', href: '/chief/preparing', icon: Flame, section: 'main', badge: 'Active' },
        { label: 'Ready', href: '/chief/ready', icon: CheckCircle, section: 'main' },
        { label: 'Kitchen Stats', href: '/chief/stats', icon: BarChart3, section: 'main' },
        { label: 'Profile', href: '/chief/profile', icon: User, section: 'account' },
        { label: 'Settings', href: '/chief/settings', icon: Settings, section: 'account' },
      ];

    case 'admin':
      return [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, section: 'main' },
        { label: 'Students', href: '/admin/students', icon: Users, section: 'main' },
        { label: 'Vendors', href: '/admin/vendors', icon: Store, section: 'main' },
        { label: 'Head Chefs', href: '/admin/chefs', icon: ChefHat, section: 'main' },
        { label: 'Orders', href: '/admin/orders', icon: Package, section: 'main' },
        { label: 'Reports', href: '/admin/reports', icon: FileSpreadsheet, section: 'main' },
        { label: 'Settings', href: '/admin/settings', icon: Settings, section: 'account' },
      ];

    default:
      return [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard, section: 'main' },
        { label: 'Settings', href: '/settings', icon: Settings, section: 'account' },
      ];
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  className,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = getNavItemsForRole(role);
  const mainNavItems = navItems.filter((i) => i.section === 'main');
  const accountNavItems = navItems.filter((i) => i.section === 'account');

  const roleLabelMap: Record<UserRole, string> = {
    student: 'Student Portal',
    vendor: 'Vendor Outlet',
    chief: 'Head Chef Portal',
    admin: 'System Admin',
  };

  const roleLabel = roleLabelMap[role] || role;

  const isLinkActive = (href: string) => {
    if (href === pathname) return true;
    if (href !== '/student' && href !== '/vendor' && href !== '/chief' && href !== '/admin' && pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'bg-[#054A36] text-white flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 z-50',
          isCollapsed ? 'md:w-20' : 'md:w-64',
          'w-64 fixed md:relative inset-y-0 left-0 transform md:transform-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Header & Logo */}
        <div className="flex flex-col">
          <div className="p-4 md:p-5 flex items-center justify-between border-b border-emerald-800/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-300 ring-1 ring-emerald-400/30 shrink-0">
                <Utensils className="h-5 w-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <h2 className="font-extrabold text-base tracking-tight truncate text-white">
                    CampusBite AI
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/90 truncate flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                    {roleLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 shrink-0"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
            {/* Main Menu Section */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-emerald-300/60 mb-2">
                  Navigation
                </p>
              )}
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                      active
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 font-semibold'
                        : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-emerald-300/80')} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-bold rounded-full border',
                          active
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Account Section Divider & Links */}
            <div className="space-y-1 pt-3 border-t border-emerald-800/40">
              {!isCollapsed && (
                <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-emerald-300/60 mb-2">
                  Account & Profile
                </p>
              )}
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                      active
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 font-semibold'
                        : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-emerald-300/80')} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {/* Tooltip for Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: User Profile Badge & Logout */}
        <div className="p-3 border-t border-emerald-800/40 bg-emerald-950/40 space-y-2">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 text-[#054A36] font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
              {(user?.email?.[0] || 'U').toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-white truncate">
                  {user?.email ? user.email.split('@')[0] : 'Campus User'}
                </span>
                <span className="text-[10px] text-emerald-300/80 truncate">
                  {user?.email || 'authenticated'}
                </span>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => logout()}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={cn(
              'relative group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-red-100 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-0.5 text-red-300" />
            {!isCollapsed && <span>Sign Out</span>}

            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-red-950 text-red-200 text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
