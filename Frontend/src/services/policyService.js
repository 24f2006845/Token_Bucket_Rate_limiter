import api from '../api/axios';

// ─── Policy Service ────────────────────────────────────────────

export const policyService = {
  async list() {
    const { data } = await api.get('/policy');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/policy/${id}`);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/policy/delete/${id}`);
    return data;
  },
};
