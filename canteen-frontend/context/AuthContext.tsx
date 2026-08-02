"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, ROLES, api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: string;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRole: (roleId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with user = null so the Login Page ALWAYS appears first at start
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>(ROLES.STUDENT);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Clear any previous session on fresh page load so Login Page is ALWAYS presented first
    localStorage.removeItem("campusbite_token");
    localStorage.removeItem("campusbite_user");
    localStorage.removeItem("campusbite_active_role");
    setUser(null);
    setToken(null);
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, pass);
      const authUser = res.data?.campusUser || {
        id: res.data?.user?.id || "u-" + Date.now(),
        full_name: res.data?.user?.user_metadata?.full_name || email.split('@')[0],
        email: email,
        role_id: ROLES.STUDENT,
      };

      const accessToken = res.data?.session?.access_token || "token-" + Date.now();
      const userRole = authUser.role_id || ROLES.STUDENT;

      setToken(accessToken);
      setUser(authUser);
      setActiveRole(userRole);

      localStorage.setItem("campusbite_token", accessToken);
      localStorage.setItem("campusbite_user", JSON.stringify(authUser));
      localStorage.setItem("campusbite_active_role", userRole);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.register(name, email, pass);
      const authUser = res.data?.campusUser || {
        id: "u-" + Date.now(),
        full_name: name,
        email: email,
        role_id: ROLES.STUDENT,
      };

      const accessToken = res.data?.session?.access_token || "token-" + Date.now();

      setToken(accessToken);
      setUser(authUser);
      setActiveRole(ROLES.STUDENT);

      localStorage.setItem("campusbite_token", accessToken);
      localStorage.setItem("campusbite_user", JSON.stringify(authUser));
      localStorage.setItem("campusbite_active_role", ROLES.STUDENT);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setActiveRole(ROLES.STUDENT);
    localStorage.removeItem("campusbite_token");
    localStorage.removeItem("campusbite_user");
    localStorage.removeItem("campusbite_active_role");
  };

  const switchRole = (roleId: string) => {
    setActiveRole(roleId);
    localStorage.setItem("campusbite_active_role", roleId);
    if (user) {
      const updatedUser = { ...user, role_id: roleId };
      setUser(updatedUser);
      localStorage.setItem("campusbite_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeRole,
        loading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
