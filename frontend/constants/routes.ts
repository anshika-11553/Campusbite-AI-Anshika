import { UserRole } from '@/types/auth';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  STUDENT: '/student',
  VENDOR: '/vendor',
  ADMIN: '/admin',
  CHIEF: '/chief',
  UNAUTHORIZED: '/unauthorized',
} as const;

export const ROLE_ROUTE_MAP: Record<UserRole, string> = {
  student: ROUTES.STUDENT,
  vendor: ROUTES.VENDOR,
  admin: ROUTES.ADMIN,
  chief: ROUTES.CHIEF,
};
