import React from 'react';
import { UserRole } from '@/types/auth';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  role: UserRole;
  title: string;
}

export const Topbar: React.FC<TopbarProps> = ({ role, title }) => {
  const { user } = useAuth();
  const roleLabel = role === 'chief' ? 'Head Chef' : role;

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-lg md:text-xl font-bold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <Badge variant="emerald" className="uppercase text-[10px] tracking-wider">
          {roleLabel}
        </Badge>
        <span className="text-xs md:text-sm font-medium text-slate-700">
          {user?.email || 'Authenticated User'}
        </span>
      </div>
    </header>
  );
};
