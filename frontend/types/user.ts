import { UserRole } from './auth';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  avatarUrl?: string;
  collegeId?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}
