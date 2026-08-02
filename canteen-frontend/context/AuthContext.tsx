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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>(ROLES.STUDENT);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Read persisted session on initial mount
    const savedToken = localStorage.getItem("campusbite_token");
    const savedUser = localStorage.getItem("campusbite_user");
    const savedRole = localStorage.getItem("campusbite_active_role");

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        setActiveRole(savedRole || parsedUser.role_id || ROLES.STUDENT);

        let resolvedRoleName = "student";
        if ((savedRole || parsedUser.role_id) === ROLES.VENDOR) resolvedRoleName = "vendor";
        else if ((savedRole || parsedUser.role_id) === ROLES.CHEF) resolvedRoleName = "chef";
        else if ((savedRole || parsedUser.role_id) === ROLES.ADMIN) resolvedRoleName = "admin";

        console.log("========== SESSION RESTORED ==========");
        console.log("Logged User ID:", parsedUser.id);
        console.log("Role ID:", parsedUser.role_id);
        console.log("Resolved Role:", resolvedRoleName);
        console.log("======================================");
      } catch (e) {
        console.error("Failed to parse saved session", e);
        localStorage.removeItem("campusbite_token");
        localStorage.removeItem("campusbite_user");
        localStorage.removeItem("campusbite_active_role");
      }
    }
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

      // Determine role from authUser or email fallback
      const lowerEmail = email.toLowerCase().trim();
      let userRole = authUser.role_id || ROLES.STUDENT;
      if (lowerEmail.includes("vendor")) userRole = ROLES.VENDOR;
      else if (lowerEmail.includes("chef")) userRole = ROLES.CHEF;
      else if (lowerEmail.includes("admin")) userRole = ROLES.ADMIN;

      authUser.role_id = userRole;

      let resolvedRoleName = "student";
      let redirectRoute = "/student";
      if (userRole === ROLES.VENDOR) {
        resolvedRoleName = "vendor";
        redirectRoute = "/vendor";
      } else if (userRole === ROLES.CHEF) {
        resolvedRoleName = "chef";
        redirectRoute = "/chef";
      } else if (userRole === ROLES.ADMIN) {
        resolvedRoleName = "admin";
        redirectRoute = "/admin";
      }

      console.log("========== ROLE RESOLUTION ==========");
      console.log("Logged User ID:", authUser.id);
      console.log("Role ID:", userRole);
      console.log("Resolved Role:", resolvedRoleName);
      console.log("Redirect Route:", redirectRoute);
      console.log("=====================================");

      const accessToken = res.data?.session?.access_token || "token-" + Date.now();

      setToken(accessToken);
      setUser(authUser);
      setActiveRole(userRole);

      localStorage.setItem("campusbite_token", accessToken);
      localStorage.setItem("campusbite_user", JSON.stringify(authUser));
      localStorage.setItem("campusbite_active_role", userRole);

      if (typeof window !== "undefined") {
        window.location.href = redirectRoute;
      }
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

      if (typeof window !== "undefined") {
        window.location.href = "/student";
      }
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

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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
