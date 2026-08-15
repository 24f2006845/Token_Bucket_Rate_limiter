import { useState, useCallback } from 'react';
import { adminService } from '../services/adminService';

// ─── useAdminUsers ─────────────────────────────────────────────

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStatus = useCallback(async (userId) => {
    await adminService.toggleUserStatus(userId);
    await fetchUsers();
  }, [fetchUsers]);

  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED').length;

  return { users, loading, error, fetchUsers, toggleStatus, activeUsers, suspendedUsers };
}

// ─── useAdminApiKeys ───────────────────────────────────────────

export function useAdminApiKeys() {
  const [userKeys, setUserKeys] = useState({});
  const [loadingKeys, setLoadingKeys] = useState({});

  const fetchUserKeys = useCallback(async (userId) => {
    setLoadingKeys((prev) => ({ ...prev, [userId]: true }));
    try {
      const data = await adminService.getUserApiKeys(userId);
      setUserKeys((prev) => ({
        ...prev,
        [userId]: Array.isArray(data) ? data : (data.data?.apiKeys || data.data || []),
      }));
    } catch {
      setUserKeys((prev) => ({ ...prev, [userId]: [] }));
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [userId]: false }));
    }
  }, []);

  const revokeKey = useCallback(async (keyId, userId) => {
    await adminService.revokeApiKey(keyId);
    if (userId) {
      await fetchUserKeys(userId);
    }
  }, [fetchUserKeys]);

  return { userKeys, loadingKeys, fetchUserKeys, revokeKey };
}
