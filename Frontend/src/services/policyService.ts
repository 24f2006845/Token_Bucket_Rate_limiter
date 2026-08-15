import api from '../api/axios';
import { ApiResponse, Policy } from '../types';

// ─── Policy Service ────────────────────────────────────────────

export const policyService = {
  async list(): Promise<ApiResponse<Policy[]>> {
    const { data } = await api.get<ApiResponse<Policy[]>>('/policy');
    return data;
  },

  async getById(id: string): Promise<ApiResponse<Policy>> {
    const { data } = await api.get<ApiResponse<Policy>>(`/policy/${id}`);
    return data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/policy/delete/${id}`);
    return data;
  },
};
