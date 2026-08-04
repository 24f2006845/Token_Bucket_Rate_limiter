# Token Bucket Rate Limiter — Backend API

An Express, TypeScript, PostgreSQL, and Prisma backend that provides the identity and API-key management layer for a token-bucket rate-limiting service. Users can register, sign in with JWTs, refresh their access token, and create, view, and revoke API keys.

> **Current scope:** this repository contains the authentication and API-key foundation. Token-bucket consumption/refill logic and a request-enforcement endpoint or middleware have not been implemented yet.

## Features

- User registration with password validation and bcrypt password hashing
- JWT-based authentication
  - Access token valid for 15 minutes
  - Refresh token valid for 7 days and stored in an HTTP-only cookie
- API-key generation using cryptographically secure random values
- SHA-256 hashing of API keys before database storage
- List API-key metadata without returning the secret key
- Revoke an API key (its status changes to `REVOKED`)
- Admin dashboard API for viewing users, managing user status, and revoking API keys
- PostgreSQL persistence through Prisma
- Consistent JSON success and error responses

## Tech stack

- Node.js, Express 5, TypeScript
- PostgreSQL and Prisma 7
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt, Zod, cookie-parser

## Project structure

```text
Backend/
├── prisma/                 # Database schema and migrations
├── src/
│   ├── modules/auth/       # Register, login, logout, profile, refresh token
│   ├── modules/api_key/    # API-key generation, listing, and revocation
│   ├── modules/admin/      # Admin user and API-key management endpoints
│   ├── middlewares/        # JWT auth and error handling
│   └── utils/              # JWT helpers and application errors
└── server.ts               # Application entry point
```

## Run locally

### Prerequisites

- Node.js 20+
- PostgreSQL database

### 1. Configure environment variables

Create `Backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/token_bucket?schema=public"
ACCESS_TOKEN_SECRET="replace-with-a-long-random-secret"
REFRESH_TOKEN_SECRET="replace-with-a-different-long-random-secret"
PORT=3000
NODE_ENV=development
```

`PORT` is required by the current database configuration. The server currently listens on port `3000`, so use `PORT=3000`.

### 2. Install packages and prepare the database

```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate deploy
```

For local development where you want Prisma to create a new migration, use `npx prisma migrate dev` instead of `npx prisma migrate deploy`.

### 3. Start the API

```bash
npm run dev
```

The API is available at `http://localhost:3000`.

## API conventions

Base URL: `http://localhost:3000/api`

Successful responses follow this shape:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

Application errors follow this shape:

```json
{
  "success": false,
  "message": "..."
}
```

Protected API-key routes require an access token:

```http
Authorization: Bearer <accessToken>
```

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create an account |
| `POST` | `/auth/login` | No | Sign in and receive an access token |
| `POST` | `/auth/logout` | No* | Clear the refresh-token cookie |
| `GET` | `/auth/me` | No* | Get a user profile |
| `GET` | `/auth/refresh-token` | Refresh-token cookie | Issue a new access token |
| `POST` | `/apikey/generate` | Bearer token | Create an API key |
| `GET` | `/apikey/getapiKey` | Bearer token | List the user’s API keys |
| `DELETE` | `/apikey/delete` | Bearer token | Revoke an API key |
| `GET` | `/admin/users` | Admin bearer token | List all standard users |
| `GET` | `/admin/users/:id` | Admin bearer token | Get one user |
| `PATCH` | `/admin/users/:id/status` | Admin bearer token | Toggle a user between `ACTIVE` and `SUSPENDED` |
| `GET` | `/admin/users/:id/api-keys` | Admin bearer token | List a user’s API keys |
| `DELETE` | `/admin/api-keys/:id` | Admin bearer token | Revoke any user API key |

\* See the integration note below: the present implementation obtains `userId` from the request body for these routes.

### Register

`POST /api/auth/register`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "SecurePass123"
}
```

Password requirements: at least eight characters, with at least one uppercase and one lowercase letter.

**201 response**

```json
{
  "success": true,
  "data": {
    "userId": {
      "id": "user-uuid",
      "name": "Ada Lovelace"
    }
  },
  "message": "User registered successfully"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "ada@example.com",
  "password": "SecurePass123"
}
```

**200 response** — also sets an HTTP-only `refreshToken` cookie.

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": "user-uuid",
      "name": "Ada Lovelace",
      "role": "USER"
    }
  },
  "message": "Login successful"
}
```

### Refresh an access token

`GET /api/auth/refresh-token`

The browser must send the `refreshToken` cookie received at login.

**200 response**

```json
{
  "success": true,
  "data": { "accessToken": "eyJ..." },
  "message": "Access token refreshed successfully"
}
```

### Get profile

`GET /api/auth/me`

Current request body:

```json
{ "userId": "user-uuid" }
```

**200 response**

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "USER"
  },
  "message": "User details fetched successfully"
}
```

### Generate an API key

`POST /api/apikey/generate`

Headers:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Current request body:

```json
{
  "userId": "user-uuid",
  "name": "Production frontend"
}
```

**201 response**

```json
{
  "success": true,
  "data": { "apiKey": "the-plain-text-key" },
  "message": "API key generated successfully"
}
```

Save the returned `apiKey` immediately. The database stores only its hash, and listing keys will not return this value again.

### List API keys

`GET /api/apikey/getapiKey`

Headers: `Authorization: Bearer <accessToken>`

Current request body:

```json
{ "userId": "user-uuid" }
```

**200 response**

```json
{
  "success": true,
  "data": {
    "apiKeys": [
      {
        "id": "api-key-uuid",
        "name": "Production frontend",
        "status": "ACTIVE",
        "createdAt": "2026-08-03T10:00:00.000Z",
        "updatedAt": "2026-08-03T10:00:00.000Z"
      }
    ]
  },
  "message": "API keys retrieved successfully"
}
```

### Revoke an API key

`DELETE /api/apikey/delete`

Headers: `Authorization: Bearer <accessToken>`

```json
{
  "userId": "user-uuid",
  "apiKeyId": "api-key-uuid"
}
```

The key is retained for auditability but its status is changed to `REVOKED`.

## Admin module

The admin module is mounted at `/api/admin`. Every route is protected by `adminMiddleware`, which requires a valid access token whose JWT role is `ADMIN`.

```http
Authorization: Bearer <adminAccessToken>
```

An account is assigned the `USER` role by default. Set a user’s role to `ADMIN` directly in the database before using these routes.

### List users

`GET /api/admin/users`

This returns standard users (`role: USER`) as an array, not the usual `{ success, data, message }` envelope.

**200 response**

```json
[
  {
    "id": "user-uuid",
    "email": "ada@example.com",
    "status": "ACTIVE",
    "createdAt": "2026-08-03T10:00:00.000Z",
    "updatedAt": "2026-08-03T10:00:00.000Z"
  }
]
```

### Get a user

`GET /api/admin/users/:id`

Route parameter: `id` is the user ID. The current controller reads `req.body.id` instead of `req.params.id`; see the integration notes before using this endpoint in a browser.

### Change user status

`PATCH /api/admin/users/:id/status`

Route parameter: `id` is the user ID. The current controller also expects the same ID in the body:

```json
{ "id": "user-uuid" }
```

The status automatically toggles between `ACTIVE` and `SUSPENDED`.

### List a user’s API keys

`GET /api/admin/users/:id/api-keys`

Route parameter: `id` is the user ID. The current controller reads `req.body.id` rather than `req.params.id`; see the integration notes before using this endpoint in a browser.

### Revoke an API key as an admin

`DELETE /api/admin/api-keys/:id`

Route parameter: `id` is the API-key ID. The current controller also expects the same ID in the body:

```json
{ "id": "api-key-uuid" }
```

**200 response**

```json
{ "message": "API key deleted successfully" }
```

## Frontend integration reference

Install Axios in your frontend:

```bash
npm install axios
```

Store the access token in memory where possible, then attach it to every protected request. Because the refresh token is an HTTP-only cookie, JavaScript cannot read it; call the refresh endpoint with credentials enabled when the access token expires.

```ts
import axios from "axios";

type User = { id: string; name: string; role: string };
type ApiResponse<T> = { success: boolean; data: T; message: string };

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true // sends the HTTP-only refresh-token cookie
});

export async function login(email: string, password: string) {
  const response = await api.post<ApiResponse<{ accessToken: string; user: User }>>(
    "/auth/login",
    { email, password }
  );

  return response.data.data;
}

export async function generateApiKey(accessToken: string, userId: string, name: string) {
  const response = await api.post<ApiResponse<{ apiKey: string }>>(
    "/apikey/generate",
    { userId, name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return response.data.data.apiKey;
}

export async function refreshAccessToken() {
  const response = await api.get<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh-token"
  );

  return response.data.data.accessToken;
}

type AdminUser = {
  id: string;
  email: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

function adminHeaders(adminAccessToken: string) {
  return { headers: { Authorization: `Bearer ${adminAccessToken}` } };
}

// Returns all non-admin users for an admin dashboard table.
export async function getAdminUsers(adminAccessToken: string) {
  const response = await api.get<AdminUser[]>("/admin/users", adminHeaders(adminAccessToken));
  return response.data;
}

// The current backend needs the ID in both the path and JSON body.
export async function toggleUserStatus(adminAccessToken: string, userId: string) {
  const response = await api.patch(
    `/admin/users/${userId}/status`,
    { id: userId },
    adminHeaders(adminAccessToken)
  );
  return response.data;
}

// The current backend needs the ID in both the path and DELETE body.
export async function revokeAdminApiKey(adminAccessToken: string, apiKeyId: string) {
  const response = await api.delete(`/admin/api-keys/${apiKeyId}`, {
    ...adminHeaders(adminAccessToken),
    data: { id: apiKeyId }
  });
  return response.data;
}
```

### Important integration and security notes

- The API-key middleware validates the bearer token, but the current controllers use `req.body.userId` rather than the authenticated `req.user.userId`. A client can therefore provide a different user ID. Before deploying, change protected controllers to use the user ID supplied by the verified JWT.
- `/auth/me` and `/auth/logout` currently do not use the authentication middleware and accept `userId` in the request body. Protect them with `authMiddleware` and derive the ID from the JWT before production use.
- A `GET` request body is not reliable in browsers, including when Axios uses its browser adapter. As written, `/auth/me` and `/apikey/getapiKey` cannot be called from a browser with their required `userId` body. The recommended fix is to protect both routes and read `req.user.userId`; alternatively, change them to `POST` until that refactor is made.
- The same issue affects `GET /admin/users/:id` and `GET /admin/users/:id/api-keys`: their controllers ignore `req.params.id` and require `req.body.id`. Update them to use `req.params.id` before integrating these two admin-detail routes in a browser.
- The current admin detail services return complete database records. That can expose password hashes, refresh tokens, and API-key hashes. Before deploying, return explicitly selected safe fields only (for example, ID, name, email, role, status, timestamps, and API-key metadata).
- CORS is not enabled in `src/app.ts`. A frontend on another origin (for example, `localhost:5173`) will need a configured `cors` middleware. If cookies are used cross-origin, configure an explicit allowed origin and `credentials: true`; do not use `*` with credentials.
- The refresh cookie is `sameSite: "strict"`. For a frontend hosted on a different site, cookie settings must be deliberately adjusted for your deployment model.
- Never expose generated API keys in browser logs, screenshots, analytics, or source control.

## Suggested next step: token-bucket enforcement

To turn this into a working rate limiter, add middleware that:

1. Reads an API key from a request header.
2. Hashes it and verifies that the matching key is `ACTIVE`.
3. Tracks remaining tokens and last-refill time (typically in Redis).
4. Allows requests with available tokens and returns `429 Too Many Requests` when the bucket is empty.
5. Sends useful rate-limit headers such as `X-RateLimit-Remaining` and `Retry-After`.

## License

This project is currently unlicensed. Add a license file before distributing or using it as an open-source project.
