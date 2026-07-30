import { AuthUser, LoginCredentials } from '@/types/auth';

export interface IAuthProvider {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  logout(): Promise<void>;
  getToken(): Promise<string | null>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
  resetPassword(email: string): Promise<void>;
}
