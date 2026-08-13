# RLaaS SDK Documentation

RLaaS (Rate Limiter as a Service) provides distributed, Redis-backed rate limiting with atomic token-bucket enforcement. 

This directory contains the integration guides for RLaaS SDKs to help you protect your backend APIs.

## SDK Documentation Modules

To get started, follow these guides:

1. **[Installation](INSTALLATION.md)** — Install the TypeScript or Python SDK.
2. **[Configuration](CONFIGURATION.md)** — Initialize the client and configure rate limit policies.
3. **[Usage Guide](USAGE.md)** — Learn how to check rate limits manually or use the built-in Express middleware.

---

## Core Flow

Once a user logs into the RLaaS Dashboard, they can generate an API key. This key is then used by the SDK in the backend application to sync policies and check rate limits:

```
┌──────────────────┐      Authenticates &      ┌───────────────┐
│  Your Backend    ├──────────────────────────>│   RLaaS API   │
│  Application     │      Syncs Policies       │   Dashboard   │
└────────┬─────────┘                           └───────────────┘
         │
         │ Enforces Rate Limits
         ▼
┌──────────────────┐
│  Redis Cache     │ (Atomic Token Bucket execution via Lua)
└──────────────────┘
```

---

## Quick Reference

Here is a minimal TypeScript integration:

```typescript
import { RateLimiter } from "token-bucket-rate-limiter-sdk";

// 1. Initialize client
const limiter = new RateLimiter({
  apiKey: process.env.RLAAS_API_KEY!
});

// 2. Configure policy
await limiter.configure([
  {
    name: "api-read",
    capacity: 100,
    refillRate: 10,
    interval: 60 // seconds
  }
]);

// 3. Check rate limit
const result = await limiter.check("api-read");
if (!result.allowed) {
  throw new Error("Rate limit exceeded");
}
```
