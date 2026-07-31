import { UserRole } from '@/types/auth';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
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
