export type UserRole = 'student' | 'vendor' | 'admin' | 'chief';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role: UserRole;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  mobileNumber: string;
  studentId: string;
  department: string;
  yearSemester: string;
  password?: string;
  role: UserRole;
  profilePhotoUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
