import api, { setAccessToken, clearAccessToken } from '../api/axios';
import { ApiResponse, AuthData, User } from '../types';

// ─── Auth Service ──────────────────────────────────────────────

export const authService = {
  async register(name: string, email: string, password: string): Promise<ApiResponse<AuthData>> {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/register', { name, email, password });
    return data;
  },

  async login(email: string, password: string): Promise<ApiResponse<AuthData>> {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', { email, password });
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    clearAccessToken();
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data;
  },

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const { data } = await api.get<ApiResponse<{ accessToken: string }>>('/auth/refresh-token');
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },
};
