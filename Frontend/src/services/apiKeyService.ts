import api from '../api/axios';
import { ApiResponse, ApiKey, ApiKeysData, ApiKeyGenerateData } from '../types';

// ─── API Key Service ───────────────────────────────────────────

export const apiKeyService = {
  async generate(name: string): Promise<ApiResponse<ApiKeyGenerateData>> {
    const { data } = await api.post<ApiResponse<ApiKeyGenerateData>>('/apikey/generate', { name });
    return data;
  },

  async list(): Promise<ApiResponse<ApiKeysData>> {
    const { data } = await api.get<ApiResponse<ApiKeysData>>('/apikey/getapiKey');
    return data;
  },

  async revoke(apiKeyId: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>('/apikey/delete', {
      data: { apiKeyId },
    });
    return data;
  },
};
