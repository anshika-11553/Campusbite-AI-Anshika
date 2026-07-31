'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, AuthUser, LoginCredentials, UserRole } from '@/types/auth';
import { firebaseAuthProvider } from '@/services/auth/firebaseAuth';
import { logger } from '@/utils/logger';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuthProvider.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setRole(authUser ? authUser.role : null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await firebaseAuthProvider.login(credentials);
      setUser(loggedInUser);
      setRole(credentials.role);
      setIsLoading(false);
      return loggedInUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please verify credentials.';
      logger.error('Login Error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await firebaseAuthProvider.logout();
      setUser(null);
      setRole(null);
    } catch (err: unknown) {
      logger.error('Logout Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    try {
      await firebaseAuthProvider.resetPassword(email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email.';
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
