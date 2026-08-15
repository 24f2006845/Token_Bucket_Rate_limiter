export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Policy {
  id: string;
  name: string;
  algorithm: string;
  capacity: number;
  refillRate: number;
  interval: number;
  createdAt: string;
  updatedAt: string;
  apiKeyId: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface AuthData {
  user: User;
  accessToken?: string;
}

export interface ApiKeysData {
  apiKeys: ApiKey[];
}

export interface ApiKeyGenerateData {
  apiKey: ApiKey;
}
