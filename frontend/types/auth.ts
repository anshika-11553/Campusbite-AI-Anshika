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

export interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
