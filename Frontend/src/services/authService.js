import api, { setAccessToken, clearAccessToken } from '../api/axios';

// ─── Auth Service ──────────────────────────────────────────────

export const authService = {
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    clearAccessToken();
  },

  async getProfile() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async refreshToken() {
    const { data } = await api.get('/auth/refresh-token');
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },
};
