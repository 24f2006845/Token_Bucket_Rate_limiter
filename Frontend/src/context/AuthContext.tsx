import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '../services/authService';
import { clearAccessToken } from '../api/axios';
import { User, ApiResponse, AuthData } from '../types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<AuthData>>;
  register: (name: string, email: string, password: string) => Promise<ApiResponse<AuthData>>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const tryRefresh = useCallback(async () => {
    try {
      await authService.refreshToken();
      const profileRes = await authService.getProfile();
      setUser(profileRes.data);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    tryRefresh();
  }, [tryRefresh]);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setUser(res.data.user);
    return res;
  };

  const register = async (name: string, email: string, password: string) => {
    return authService.register(name, email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
