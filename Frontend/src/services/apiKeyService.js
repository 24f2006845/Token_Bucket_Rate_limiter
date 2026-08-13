import api from '../api/axios';

// ─── API Key Service ───────────────────────────────────────────

export const apiKeyService = {
  async generate(name) {
    const { data } = await api.post('/apikey/generate', { name });
    return data;
  },

  async list() {
    const { data } = await api.get('/apikey/getapiKey');
    return data;
  },

  async revoke(apiKeyId) {
    const { data } = await api.delete('/apikey/delete', {
      data: { apiKeyId },
    });
    return data;
  },
};
