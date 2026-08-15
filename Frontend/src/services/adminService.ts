import api from '../api/axios';

// ─── Admin Service ─────────────────────────────────────────────

export const adminService = {
  async getUsers() {
    const { data } = await api.get('/admin/users');
    return data;
  },

  async getUser(id) {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  async toggleUserStatus(userId) {
    const { data } = await api.patch(`/admin/users/${userId}/status`);
    return data;
  },

  async getUserApiKeys(userId) {
    const { data } = await api.get(`/admin/users/${userId}/api-keys`);
    return data;
  },

  async revokeApiKey(apiKeyId) {
    const { data } = await api.delete(`/admin/api-keys/${apiKeyId}`);
    return data;
  },
};
