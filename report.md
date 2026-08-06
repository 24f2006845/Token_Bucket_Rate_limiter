# Security and Reliability Report

## Scope

This change hardens the existing API without redesigning the application. It fixes the authorization and limiter defects found in the review, makes the TypeScript build pass, and leaves unimplemented product features explicitly unavailable instead of silently behaving incorrectly.

## Fixed

| Previous issue | Fix applied | Prevention habit |
| --- | --- | --- |
| Protected endpoints trusted `userId` in the request body. | API key, profile, and logout actions use `req.user.userId` from a verified access token. | The server, never the client, decides the acting user. |
| Profile and logout routes were public. | Both now require JWT authentication. Logout invalidates the stored refresh-token hash. | Every route that reads or changes user data needs an explicit auth decision in the router. |
| Refresh tokens were stored in plaintext. | Only a SHA-256 hash is stored and compared. Existing logged-in sessions must sign in again after deployment. | Do not store reusable credentials in plaintext. |
| Suspended users and revoked API keys still worked. | JWT middleware checks active user status. API-key validation requires both an active key and active owner. Suspending a user clears its refresh session and revokes its API keys. | Enforce account and credential status at the authentication boundary. |
| Admin handlers ignored `/:id` and returned credential fields. | Admin handlers use validated path IDs and select only safe user/API-key fields. | Use narrow database `select` clauses for every API response. |
| The limiter validated the wrong request shape and returned an unresolved Promise. | Validation now matches the shared validation middleware and the controller awaits the service. | Test the full route, not only individual service functions. |
| Bucket reads and writes raced under concurrent requests. | A single Redis Lua script performs initialization, refill, consumption, retry calculation, persistence, and expiry atomically. | Any read-modify-write operation shared by requests must be atomic. |
| Refill rounding could permanently starve a frequently used bucket. | The script uses millisecond timestamps and fractional token values. | Keep precise state internally; round only values shown to clients. |
| Buckets accumulated in Redis forever. | Each bucket has a TTL equal to the time required to refill from empty. | Every cache/state key needs a defined lifecycle. |
| A key could apply another key's policy. | Policy lookup includes both policy ID and authenticated API-key ID. | Scope every resource lookup by its owner/tenant. |
| Schema declared a policy uniqueness rule absent from migrations. | Added a migration for the `(apiKeyId, name)` unique index. | Run migration status and integration tests before release. |
| Required configuration could be undefined and the server ignored `PORT`. | Environment values are validated before use and the server now listens on the configured `PORT` (default `3000`). | Validate configuration once at startup and fail fast. |

## Current Limiter Contract

- Only `TOKEN_BUCKET` policies are executed. Other persisted algorithm types return `400` rather than receiving the wrong algorithm.
- One successful `/api/limiter/check` request consumes one token.
- Successful responses include `X-RateLimit-Limit` and `X-RateLimit-Remaining`.
- Rejected requests return `429` and `Retry-After`.
- Redis is the shared state store, so multiple application instances observe the same bucket.

## Still Needed Before Production

These are not quick patches; they need infrastructure or product decisions.

- Add integration tests using real disposable PostgreSQL and Redis instances, including concurrent limiter requests, revocation, suspension, and policy ownership tests.
- Add CI to run type-checking, tests, migrations, dependency auditing, and linting on every pull request.
- Configure CORS with an explicit frontend allowlist. Do not use a permissive production CORS policy.
- Deploy behind HTTPS, use a secret manager, rotate JWT secrets/API keys, and add security headers such as Helmet.
- Add structured logs, request IDs, metrics, alerts, health/readiness endpoints, graceful shutdown, backups, and Redis/Postgres high availability.
- Decide whether refresh-token rotation and multi-device sessions are required. The current one-hash design intentionally supports one active refresh session per user.
- Implement fixed-window, sliding-window, and leaky-bucket algorithms only when their exact behavior and tests are defined.
- Add pagination and authorization/audit logging for admin operations.

## Practical Checklist

Before merging a backend feature, ask:

1. Where does the actor identity come from: verified credentials or request input?
2. Is every resource query scoped to its owning user, API key, or tenant?
3. Are disabled users, revoked keys, expired sessions, and malformed input rejected?
4. Could concurrent requests make this state inconsistent?
5. Are returned fields explicitly selected, with passwords, token hashes, and secrets excluded?
6. Is all persistent/cached state expired, revoked, or cleaned up intentionally?
7. Do tests cover the happy path, unauthorized path, and concurrent/failure path?
8. Does `npx tsc --noEmit` pass, and is there a database migration for schema changes?
