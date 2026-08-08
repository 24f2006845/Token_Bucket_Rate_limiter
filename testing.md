# Test Report — 2026-08-08

## Result summary

| Test | Result | Evidence |
| --- | --- | --- |
| TypeScript type check | PASS | `cd Backend && npm test` completed successfully (`tsc --noEmit`). |
| API root endpoint | PASS | `GET /` returned `200` with `Hello World!`. |
| Policy request validation | PASS | `POST /api/policy/sync` with `{}` returned `400` and reported that `body.policies` is required. |
| Limiter API-key validation | PASS | `POST /api/limiter/check` without `x-api-key` returned `400` with `API key is missing`. |
| Registration | PASS | A temporary test user was created; `POST /api/auth/register` returned `201`. |
| Login | PASS | The temporary user logged in; `POST /api/auth/login` returned `200` and an access token. |
| API-key creation | PASS | `POST /api/apikey/generate` returned `201`. The secret key is intentionally not recorded here. |
| Policy synchronization (retest) | PASS | After the pending migration was applied, the valid request returned `200` with `synced: 1`. |
| Limiter allowed requests | PASS | The first two immediate checks for a capacity-two policy returned `200`. Rate-limit headers reported a limit of `2` and remaining capacity. |
| Limiter exhaustion | PASS | The third immediate check returned `429 Too Many Requests` with `Retry-After: 60` and `Rate limit exceeded`. |

## Correct client policy request

The external client must send the *plain-text generated API key* in `x-api-key`. It must not use the dashboard JWT for this endpoint.

```http
POST /api/policy/sync
Content-Type: application/json
x-api-key: <plain-text-api-key>
```

```json
{
  "policies": [
    {
      "name": "standard",
      "capacity": 10,
      "refillRate": 2,
      "interval": 60
    }
  ]
}
```

Validation rules:

- `policies` must be a non-empty array.
- `name` must be a non-empty string.
- `capacity`, `refillRate`, and `interval` must be positive integers.
- The API key must be active and belong to an active user.
- Repeating the same `name` for the same API key should update that policy.

The actual valid test payload used was:

```json
{
  "policies": [
    {
      "name": "codex-test-limit",
      "capacity": 2,
      "refillRate": 1,
      "interval": 60
    }
  ]
}
```

The first attempt returned `500`, so the request shape and API-key authentication were accepted but persistence failed. After the migration below was applied, the exact same request returned:

```json
{
  "success": true,
  "message": "Policies synchronized successfully",
  "data": { "synced": 1 }
}
```

## Root cause of the policy-sync failure

`npx prisma migrate status` reported that this migration has not been applied:

```text
20260807120000_add_policy_unique_constraint
```

The policy-sync service uses Prisma `upsert` with the composite unique selector `apiKeyId_name`. That selector depends on this migration, which creates the required `Policy(apiKeyId, name)` unique index.

## Remediation applied before retest

The pending migration was applied, and `npx prisma migrate status` then reported that the database schema is up to date. For a database with this same issue, apply the pending migration from the `Backend` directory:

```bash
npx prisma migrate deploy
```

For local development, this is also appropriate:

```bash
npx prisma migrate dev
```

Restart the API after applying it, then rerun the policy request above. Once sync succeeds, fetch the policy ID with `GET /api/policy` using `Authorization: Bearer <access-token>`, and use that ID to test the limiter:

```http
POST /api/limiter/check
Content-Type: application/json
x-api-key: <plain-text-api-key>

{
  "policy": "<policy-uuid>"
}
```

Final limiter results for the capacity-two test policy:

| Request | HTTP status | Key result |
| --- | --- | --- |
| 1 | `200` | `X-RateLimit-Limit: 2`, `X-RateLimit-Remaining: 1` |
| 2 | `200` | `X-RateLimit-Remaining: 0.0048666666666666` |
| 3 | `429` | `Retry-After: 60`, `Rate limit exceeded` |

The small fractional remaining value on request two is expected from the current continuous token-refill calculation.
