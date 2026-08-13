const API_BASE = 'http://localhost:3000/api';

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

async function request(path, options = {}) {
  const { headers = {}, auth = false, ...rest } = options;

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth && accessToken) {
    finalHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: finalHeaders,
    credentials: 'include',
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ─── Auth ────────────────────────────────────────────────────────

export async function register(name, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }
  return res;
}

export async function logout() {
  const res = await request('/auth/logout', {
    method: 'POST',
    auth: true,
  });
  clearAccessToken();
  return res;
}

export async function getProfile() {
  return request('/auth/me', { auth: true });
}

export async function refreshToken() {
  const res = await request('/auth/refresh-token');
  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }
  return res;
}

// ─── API Keys ────────────────────────────────────────────────────

export async function generateApiKey(name) {
  return request('/apikey/generate', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ name }),
  });
}

export async function listApiKeys() {
  return request('/apikey/getapiKey', { auth: true });
}

export async function revokeApiKey(apiKeyId) {
  return request('/apikey/delete', {
    method: 'DELETE',
    auth: true,
    body: JSON.stringify({ apiKeyId }),
  });
}

// ─── Policies ────────────────────────────────────────────────────

export async function listPolicies() {
  return request('/policy', { auth: true });
}

export async function deletePolicy(id) {
  return request(`/policy/delete/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

// ─── Admin ───────────────────────────────────────────────────────

export async function adminGetUsers() {
  return request('/admin/users', { auth: true });
}

export async function adminGetUser(id) {
  return request(`/admin/users/${id}`, { auth: true });
}

export async function adminToggleUserStatus(userId) {
  return request(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    auth: true,
  });
}

export async function adminGetUserApiKeys(userId) {
  return request(`/admin/users/${userId}/api-keys`, { auth: true });
}

export async function adminRevokeApiKey(apiKeyId) {
  return request(`/admin/api-keys/${apiKeyId}`, {
    method: 'DELETE',
    auth: true,
  });
}
