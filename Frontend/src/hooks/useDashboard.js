import { useState, useCallback } from 'react';
import { apiKeyService } from '../services/apiKeyService';
import { policyService } from '../services/policyService';

// ─── useApiKeys ────────────────────────────────────────────────

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiKeyService.list();
      setApiKeys(res.data?.apiKeys || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateKey = useCallback(async (name) => {
    const res = await apiKeyService.generate(name);
    await fetchKeys();
    return res.data.apiKey;
  }, [fetchKeys]);

  const revokeKey = useCallback(async (keyId) => {
    await apiKeyService.revoke(keyId);
    await fetchKeys();
  }, [fetchKeys]);

  const activeKeys = apiKeys.filter((k) => k.status === 'ACTIVE').length;
  const revokedKeys = apiKeys.filter((k) => k.status === 'REVOKED').length;

  return { apiKeys, loading, error, fetchKeys, generateKey, revokeKey, activeKeys, revokedKeys };
}

// ─── usePolicies ───────────────────────────────────────────────

export function usePolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await policyService.list();
      setPolicies(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePolicy = useCallback(async (id) => {
    await policyService.delete(id);
    await fetchPolicies();
  }, [fetchPolicies]);

  return { policies, loading, error, fetchPolicies, deletePolicy };
}
