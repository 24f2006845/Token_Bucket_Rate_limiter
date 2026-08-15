import api from '../api/axios';
import { ApiResponse, User, ApiKey } from '../types';

// ─── Admin Service ─────────────────────────────────────────────

export const adminService = {
  async getUsers(): Promise<ApiResponse<User[]> | User[]> {
    const { data } = await api.get<ApiResponse<User[]> | User[]>('/admin/users');
    return data;
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    const { data } = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return data;
  },

  async toggleUserStatus(userId: string): Promise<ApiResponse<User>> {
    const { data } = await api.patch<ApiResponse<User>>(`/admin/users/${userId}/status`);
    return data;
  },

  async getUserApiKeys(userId: string): Promise<ApiResponse<{ apiKeys: ApiKey[] }> | ApiKey[]> {
    const { data } = await api.get<ApiResponse<{ apiKeys: ApiKey[] }> | ApiKey[]>(`/admin/users/${userId}/api-keys`);
    return data;
  },

  async revokeApiKey(apiKeyId: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/admin/api-keys/${apiKeyId}`);
    return data;
  },
};
