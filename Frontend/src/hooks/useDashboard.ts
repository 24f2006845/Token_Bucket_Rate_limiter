import { useState, useCallback } from 'react';
import { apiKeyService } from '../services/apiKeyService';
import { policyService } from '../services/policyService';
import { ApiKey, Policy } from '../types';

// ─── useApiKeys ────────────────────────────────────────────────

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiKeyService.list();
      setApiKeys(res.data?.apiKeys || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateKey = useCallback(async (name: string): Promise<ApiKey> => {
    const res = await apiKeyService.generate(name);
    await fetchKeys();
    return res.data.apiKey;
  }, [fetchKeys]);

  const revokeKey = useCallback(async (keyId: string): Promise<void> => {
    await apiKeyService.revoke(keyId);
    await fetchKeys();
  }, [fetchKeys]);

  const activeKeys = apiKeys.filter((k) => k.status === 'ACTIVE').length;
  const revokedKeys = apiKeys.filter((k) => k.status === 'REVOKED').length;

  return { apiKeys, loading, error, fetchKeys, generateKey, revokeKey, activeKeys, revokedKeys };
}

// ─── usePolicies ───────────────────────────────────────────────

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await policyService.list();
      setPolicies(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePolicy = useCallback(async (id: string): Promise<void> => {
    await policyService.delete(id);
    await fetchPolicies();
  }, [fetchPolicies]);

  return { policies, loading, error, fetchPolicies, deletePolicy };
}
