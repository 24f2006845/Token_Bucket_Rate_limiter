# Reading Guide: Security and Rate Limiting

Read this in order while opening the linked files. It follows a request from the route to the database and Redis state.

## 1. Application Startup

Start with [server.ts](Backend/server.ts). It loads environment variables, connects Prisma and Redis before accepting traffic, and uses `PORT` safely.

Then read [app.ts](Backend/src/app.ts). It limits JSON bodies to 16 KB, mounts each module, and registers the global error handler last.

The configuration files fail early when required values are missing:

- [db.ts](Backend/src/config/db.ts) requires `DATABASE_URL` before constructing Prisma.
- [redis.ts](Backend/src/config/redis.ts) requires `REDIS_URL`.
- [jwt.ts](Backend/src/utils/jwt.ts) requires both JWT secrets before signing or verifying tokens.

**Lesson:** validate configuration at startup. Do not write `process.env.VALUE as string`, because it hides a missing production secret until runtime.

## 2. Login and Refresh Sessions

Follow `POST /api/auth/login` in [auth.route.ts](Backend/src/modules/auth/auth.route.ts) to [auth.controller.ts](Backend/src/modules/auth/auth.controller.ts), then [auth.service.ts](Backend/src/modules/auth/auth.service.ts).

1. The route validates the login body.
2. The service checks the password and refuses suspended users.
3. It issues an access token and refresh token.
4. Only a SHA-256 hash of the refresh token is stored in PostgreSQL; the raw token is sent only in an HTTP-only cookie.
5. Refresh compares the incoming token hash with the stored hash. Logout clears the stored hash, invalidating the session.

**Mistake fixed:** logout previously only cleared the browser cookie, while the server-side token remained valid. Profile/logout also accepted `userId` from a client body.

**Rule:** client input describes data; verified credentials identify the actor. Use `req.user.userId`, never `req.body.userId`, for "my account" actions.

## 3. JWT-Protected Requests

Read [auth.middleware.ts](Backend/src/middlewares/auth.middleware.ts). It verifies the access token and checks the account is still active in the database before placing the identity on `req.user`.

Admin routes use [role.middleware.ts](Backend/src/middlewares/role.middleware.ts), which also requires the `ADMIN` role and an active account.

The API-key routes in [apiKey.route.ts](Backend/src/modules/api_key/apiKey.route.ts) use this middleware. Their controller takes the user ID from `req.user`, and [apiKey.validation.ts](Backend/src/modules/api_key/apiKey.validation.ts) validates only client-controlled fields such as a key name or key ID.

**Mistake fixed:** any logged-in user could previously send another user's UUID in the request body and manage that user's API keys. This is an insecure direct object reference (IDOR).

## 4. API-Key Authentication

For external services, open [apiKeyMiddleware.ts](Backend/src/middlewares/apiKeyMiddleware.ts), then [policy.service.ts](Backend/src/modules/policy/policy.service.ts).

1. The request sends the plaintext API key in `x-api-key`.
2. Middleware hashes it with SHA-256.
3. The database lookup accepts it only when the key and its owner are both `ACTIVE`.
4. The middleware stores only the key ID and owner ID on `req.apiKey`.

**Mistake fixed:** a revoked key remained usable because validation checked only whether the key existed.

## 5. Admin Operations

Read [admin.route.ts](Backend/src/modules/admin/admin.route.ts), [admin.validation.ts](Backend/src/modules/admin/admin.validation.ts), and [admin.controller.ts](Backend/src/modules/admin/admin.controller.ts).

The URL parameter `/:id` is validated and used directly. [admin.service.ts](Backend/src/modules/admin/admin.service.ts) uses explicit Prisma `select` fields, so passwords, refresh-token hashes, and API-key hashes never enter API responses.

Suspending a user clears their refresh session and revokes their API keys inside one database transaction.

**Mistake fixed:** handlers ignored the path ID and used a body ID instead; admin detail endpoints returned whole database records containing sensitive fields.

## 6. Policy Ownership

Policies are synchronized under an API key in [policy.routes.ts](Backend/src/modules/policy/policy.routes.ts). The database schema declares policy names unique per API key. The migration in [migration.sql](Backend/prisma/migrations/20260807120000_add_policy_unique_constraint/migration.sql) creates the matching database constraint.

**Lesson:** a Prisma schema is not enough. Every schema constraint needs a migration, and the migration must be deployed before relying on it.

## 7. Token-Bucket Request Flow

Follow `POST /api/limiter/check` in [limiter.routes.ts](Backend/src/modules/limiter/limiter.routes.ts).

1. [apiKeyMiddleware.ts](Backend/src/middlewares/apiKeyMiddleware.ts) authenticates an active API key.
2. [limiter.validation.ts](Backend/src/modules/limiter/limiter.validation.ts) validates `{ "policy": "uuid" }` in the body.
3. [limiter.controller.ts](Backend/src/modules/limiter/limiter.controller.ts) awaits the service and returns rate-limit headers.
4. [limiter.service.ts](Backend/src/modules/limiter/limiter.service.ts) loads the policy using both `policy.id` and the authenticated `apiKeyId`. This prevents one tenant from using another tenant's policy.
5. [tokenBucket.ts](Backend/src/modules/limiter/tokenBucket.ts) runs one Redis Lua script.

The script initializes a missing bucket, calculates fractional refill using milliseconds, consumes one token if available, calculates retry time if empty, updates state, and sets a TTL. Redis executes a Lua script as one operation, so concurrent application instances cannot both consume the final token.

**Mistakes fixed:** the former `GET -> JavaScript calculation -> SET` sequence raced under concurrent traffic, rounding discarded refill progress, and bucket keys never expired.

## 8. Errors and Validation

[validate.middleware.ts](Backend/src/middlewares/validate.middleware.ts) passes `{ body, params, query }` to each Zod schema. That is why limiter/admin/API-key schemas wrap their fields under `body` or `params`.

[AppError.ts](Backend/src/utils/AppError.ts) carries a status code and optional retry delay. [error.middleware.ts](Backend/src/middlewares/error.middleware.ts) turns it into the standard JSON error response and sends `Retry-After` for `429` responses.

**Lesson:** keep request schemas aligned with the middleware's input shape, and centralize HTTP error formatting.

## 9. Before You Add a Feature

Use the checklist in [report.md](report.md): identify the actor from credentials, scope each query by tenant/owner, validate input, decide how state behaves under concurrency, select safe response fields, add expiry/revocation rules, and run `npm test` before committing.

For the remaining infrastructure and test work, see [report.md](report.md#still-needed-before-production).
