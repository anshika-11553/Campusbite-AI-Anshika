import React from 'react';
import { UserRole } from '@/types/auth';
import { ROLE_METADATA_LIST } from '@/constants/roles';
import { GraduationCap, Store, ShieldCheck, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'vendor':
        return <Store className="h-4 w-4" />;
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'chief':
        return <Crown className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Select Portal Role
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="Portal Role Selection">
        {ROLE_METADATA_LIST.map((roleItem) => {
          const isSelected = selectedRole === roleItem.id;
          return (
            <button
              key={roleItem.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectRole(roleItem.id)}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all duration-200 gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#054A36]',
                isSelected
                  ? 'bg-[#054A36] text-white border-[#054A36] shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {getRoleIcon(roleItem.id)}
              <span>{roleItem.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
