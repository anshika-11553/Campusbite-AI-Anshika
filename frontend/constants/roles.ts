import { UserRole } from '@/types/auth';

export const ROLES: Record<string, UserRole> = {
  STUDENT: 'student',
  VENDOR: 'vendor',
  ADMIN: 'admin',
  CHIEF: 'chief',
};

export interface RoleMetadata {
  id: UserRole;
  label: string;
  description: string;
  redirectPath: string;
}

export const ROLE_METADATA_LIST: RoleMetadata[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Pre-order food & track live queue',
    redirectPath: '/student',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    description: 'Manage live orders & canteen queue',
    redirectPath: '/vendor',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Manage canteen operations & staff',
    redirectPath: '/admin',
  },
  {
    id: 'chief',
    label: 'Head Chef',
    description: 'Monitor kitchen operations & cooking progress',
    redirectPath: '/chief',
  },
];
