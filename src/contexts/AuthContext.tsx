import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";
import { getUser, setUser, clearUser, devLogin, seedSampleData } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    if (stored) {
      setUserState(stored);
      seedSampleData();
    }
    setLoading(false);
  }, []);

  const login = () => {
    const u = devLogin();
    setUserState(u);
    seedSampleData();
  };

  const logout = () => {
    clearUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
