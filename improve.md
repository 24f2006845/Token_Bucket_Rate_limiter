# Backend Performance Improvement Guide

This document is a roadmap for making this backend faster and more scalable. Do not add every technique at once. Measure first, improve the real bottleneck, then measure again.

## 1. How to Think About Performance

Track these numbers before changing code:

- `p50`, `p95`, and `p99` response time, not only average latency.
- Requests per second (RPS).
- Error rate and `429` rate.
- PostgreSQL query time, connection-pool usage, and slow queries.
- Redis command latency, memory usage, and cache hit rate.
- Node.js CPU, memory, event-loop delay, and garbage collection pauses.

Useful tools: OpenTelemetry, Prometheus, Grafana, Sentry, k6, Artillery, autocannon, PostgreSQL `EXPLAIN ANALYZE`, and Redis `SLOWLOG`.

Skills to learn: observability, load testing, distributed systems basics, capacity planning, and performance profiling.

## 2. Fast Rate-Limiter Path

The limiter endpoint is the most performance-sensitive endpoint. Its ideal request path is:

1. Validate the request body.
2. Authenticate the API key from Redis cache.
3. Read policy configuration from Redis cache.
4. Run one atomic Redis Lua script to refill and consume a token.
5. Return a small JSON response with rate-limit headers.

Avoid a PostgreSQL query for every limiter request. PostgreSQL should remain the source of truth for users, keys, and policies, while Redis handles hot, short-lived lookup data and bucket state.

Technique: cache-aside pattern.

- On cache hit, use Redis data.
- On cache miss, load from PostgreSQL and store a short TTL cache entry.
- On key revocation, user suspension, policy update, or policy deletion, invalidate affected cache keys immediately.
- Keep a short TTL even with invalidation so stale data has a bounded lifetime.

Skills to learn: Redis data types, TTLs, cache invalidation, Lua scripts, cache-aside, and multi-tenant cache-key design.

## 3. Redis Optimization

Use Redis for the correct jobs:

- Token bucket state: Redis hash plus TTL.
- API-key identity cache: short TTL, for example 30-60 seconds.
- Policy cache: short TTL, for example 1-5 minutes.
- Idempotency keys for retry-safe write endpoints.
- Distributed locks only when truly required; prefer atomic Redis operations first.

Keep commands small and minimize round trips. A Lua script is valuable because it performs several bucket operations on the Redis server atomically in one network call.

For larger deployments:

- Use Redis Cluster or managed Redis with replicas and failover.
- Use a connection pool/client per process, not one connection per request.
- Use key prefixes and Redis hash tags consistently when using cluster mode.
- Set expiration for every temporary key to prevent memory leaks.
- Define a failure policy: fail closed for protected limiter traffic, or fail open only when product requirements explicitly allow it.

Skills to learn: Redis clustering, persistence, eviction policies, replication, failure modes, and Lua scripting.

## 4. PostgreSQL and Prisma Optimization

Database work is often the next bottleneck after the limiter path is cached.

- Add indexes for real query filters and joins, not every column.
- Use `EXPLAIN ANALYZE` before adding an index.
- Select only required fields with Prisma `select`.
- Paginate every list endpoint; never return an unbounded user, API-key, or policy list.
- Prefer cursor pagination for large/changing datasets.
- Avoid N+1 queries: load related data in one intentional query or batch it.
- Use transactions for related writes that must succeed together.
- Keep transactions short; do not make network calls inside them.
- Use a properly sized PostgreSQL connection pool and a pooler such as PgBouncer at scale.

Indexes relevant to this project include:

- `Policy(apiKeyId, name)` for policy synchronization and uniqueness.
- `ApiKey(keyHash)` for API-key authentication.
- `ApiKey(userId)` for listing a user's keys.
- `Policy(apiKeyId)` for listing a key's policies when that query becomes common.
- `User(email)` for login, already unique and indexed.

Skills to learn: SQL joins, B-tree indexes, query planning, transactions, isolation levels, deadlocks, pagination, and connection pooling.

## 5. API Response Time and Network Latency

Most network latency cannot be removed by application code, but it can be reduced:

- Host the API, PostgreSQL, Redis, and workers in the same cloud region.
- Keep Redis and PostgreSQL in private networking, not across the public internet.
- Reuse HTTP connections with keep-alive.
- Enable compression only for larger text responses; do not waste CPU compressing tiny limiter responses.
- Return small response shapes and avoid large nested objects.
- Use CDN or edge caching for public, read-heavy content. Do not cache authenticated private responses without careful cache keys.
- Use HTTP caching headers (`ETag`, `Cache-Control`) for stable read endpoints when appropriate.
- Put static frontend assets behind a CDN, not your Express server.

Skills to learn: HTTP/1.1 keep-alive, HTTP/2 or HTTP/3, TLS, CDN behavior, cache headers, DNS, and cloud networking.

## 6. Node.js and Express Performance

- Keep request handlers non-blocking. Never use synchronous filesystem, crypto, or CPU-heavy loops in handlers.
- Move slow tasks such as reports, emails, exports, and cleanup into a queue worker.
- Limit request body size and validate input early.
- Use structured logging with request IDs; avoid excessive `console.log` on hot endpoints.
- Add graceful shutdown so instances stop accepting new traffic before closing Redis and PostgreSQL connections.
- Run multiple processes or containers behind a load balancer. Node.js processes are single-threaded for JavaScript work.
- Use worker threads only for CPU-heavy tasks, not ordinary I/O.

Skills to learn: Node.js event loop, promises, async I/O, worker threads, process lifecycle, queues, and load balancing.

## 7. Asynchronous Work and Queues

Use a queue when the client does not need to wait for the work:

- Audit logs.
- Emails and notifications.
- Analytics events.
- Large exports.
- Background cleanup.
- Retryable integrations with external services.

Possible tools: BullMQ with Redis, RabbitMQ, Kafka, SQS, or a managed cloud queue.

Important queue concepts:

- Idempotency: running the same job twice must be safe.
- Retry with exponential backoff and a maximum retry count.
- Dead-letter queues for permanently failed jobs.
- At-least-once delivery is common, so consumers must handle duplicates.

Skills to learn: message queues, idempotency, retries, eventual consistency, and the outbox pattern.

## 8. Horizontal Scaling

To run many API instances safely:

- Keep Express instances stateless.
- Store shared state in Redis/PostgreSQL, never process memory.
- Use JWTs or centralized sessions; do not require sticky sessions unless unavoidable.
- Put instances behind a load balancer.
- Use managed PostgreSQL read replicas only after measuring read pressure and understanding replication lag.
- Use Redis as shared limiter state so all instances enforce the same limit.

Skills to learn: stateless services, load balancers, autoscaling, containers, Kubernetes or ECS, read replicas, and consistency tradeoffs.

## 9. Reliability and Security While Optimizing

Performance shortcuts can create security bugs. Keep these rules:

- Cache only safe, minimal data; never cache raw passwords, refresh tokens, or plaintext API keys.
- Invalidate API-key cache entries when a key is revoked.
- Invalidate all of a user's active-key cache entries when the user is suspended.
- Scope every cache key and database query by user/API key/tenant ownership.
- Rate-limit login and registration endpoints separately to reduce brute-force attacks.
- Use timeouts for Redis, PostgreSQL, and external HTTP calls.
- Add circuit breakers or graceful degradation only after deciding whether a failure should fail open or fail closed.
- Keep dependency updates, secret rotation, TLS, CORS allowlists, and security headers in the deployment baseline.

Skills to learn: threat modeling, OWASP API Security Top 10, timeout/retry design, circuit breakers, and incident response.

## 10. Recommended Learning Order

1. HTTP, REST API design, status codes, headers, and caching.
2. SQL, PostgreSQL indexes, `EXPLAIN ANALYZE`, and transactions.
3. Redis, TTLs, hashes, Lua scripts, and cache invalidation.
4. Node.js event loop, profiling, connection reuse, and queues.
5. Docker, cloud networking, load balancers, and environment configuration.
6. Observability: logs, metrics, tracing, dashboards, and load tests.
7. Distributed systems: consistency, retries, idempotency, leader/follower systems, and failure modes.
8. Security: authentication, authorization, OWASP, secrets, and secure deployment.

## 11. Practical Improvement Plan for This Project

1. Add integration tests for concurrent limiter calls against a real temporary Redis instance.
2. Add metrics for limiter allow/deny counts, Redis latency, PostgreSQL latency, and cache hit rate.
3. Add pagination to user, API-key, and policy listing endpoints.
4. Cache active API-key identity and token-bucket policy configuration in Redis with correct invalidation.
5. Add structured logging, request IDs, readiness/health endpoints, and graceful shutdown.
6. Load test with k6 or autocannon, record p95/p99 latency, and identify the real bottleneck.
7. Containerize the service and deploy API, Redis, and PostgreSQL in one region behind a load balancer.
8. Add CI that runs type checks, tests, Prisma validation, and dependency auditing.

## Final Rule

Do not optimize based on a guess. Establish a baseline, make one measurable change, load test again, and keep the change only when it improves the target metric without reducing correctness or security.
