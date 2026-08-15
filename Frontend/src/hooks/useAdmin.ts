import { useState, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { User, ApiKey } from '../types';

// ─── useAdminUsers ─────────────────────────────────────────────

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers(data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStatus = useCallback(async (userId: string) => {
    await adminService.toggleUserStatus(userId);
    await fetchUsers();
  }, [fetchUsers]);

  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED').length;

  return { users, loading, error, fetchUsers, toggleStatus, activeUsers, suspendedUsers };
}

// ─── useAdminApiKeys ───────────────────────────────────────────

export function useAdminApiKeys() {
  const [userKeys, setUserKeys] = useState<Record<string, ApiKey[]>>({});
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});

  const fetchUserKeys = useCallback(async (userId: string) => {
    setLoadingKeys((prev) => ({ ...prev, [userId]: true }));
    try {
      const data = await adminService.getUserApiKeys(userId);
      let keys: ApiKey[] = [];
      if (Array.isArray(data)) {
        keys = data;
      } else if (data.data) {
        if (Array.isArray(data.data)) {
          keys = data.data;
        } else if ('apiKeys' in data.data && Array.isArray(data.data.apiKeys)) {
          keys = data.data.apiKeys;
        }
      }
      setUserKeys((prev) => ({
        ...prev,
        [userId]: keys,
      }));
    } catch {
      setUserKeys((prev) => ({ ...prev, [userId]: [] }));
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [userId]: false }));
    }
  }, []);

  const revokeKey = useCallback(async (keyId: string, userId?: string) => {
    await adminService.revokeApiKey(keyId);
    if (userId) {
      await fetchUserKeys(userId);
    }
  }, [fetchUserKeys]);

  return { userKeys, loadingKeys, fetchUserKeys, revokeKey };
}
