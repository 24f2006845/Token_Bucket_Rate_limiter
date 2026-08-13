# SDK Configuration

Before configuring your SDK, log into the RLaaS Dashboard and generate a secure API key.

---

## 1. Environment Variable Setup

Keep your API key secure. Never commit it to version control or bundle it in frontend code.

Add the key to your server environment variables or a `.env` file:

```env
RLAAS_API_KEY=rlaas_live_your_generated_secure_api_key_hash
```

---

## 2. Initialize the client

### TypeScript

```typescript
import { RateLimiter } from "token-bucket-rate-limiter-sdk";

const limiter = new RateLimiter({
  apiKey: process.env.RLAAS_API_KEY!
});
```

### Python

```python
from rlaas_sdk import RateLimiter

limiter = RateLimiter(
    api_key="rlaas_live_your_generated_secure_api_key_hash"
)
```

---

## 3. Configuring Rate Limiting Policies

A policy defines the rules of your token bucket (how many tokens it holds, and how fast they refill). You declare policies by syncing them with the RLaaS API.

### TypeScript

```typescript
await limiter.configure([
  {
    name: "user-login",
    capacity: 5,       // Max tokens in the bucket
    refillRate: 1,     // Refill 1 token per interval
    interval: 60       // Interval in seconds
  },
  {
    name: "public-api",
    capacity: 100,
    refillRate: 10,
    interval: 60
  }
]);
```

### Python

```python
await limiter.configure([
    {
        "name": "user-login",
        "capacity": 5,
        "refillRate": 1,
        "interval": 60
    },
    {
        "name": "public-api",
        "capacity": 100,
        "refillRate": 10,
        "interval": 60
    }
])
```

---

## 4. Policy Configuration Reference

Every policy contains these mandatory fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| **`name`** | `string` | Unique identifier for the policy within your API Key scope. |
| **`capacity`** | `number` | Maximum tokens the bucket can hold. This controls request bursts. |
| **`refillRate`** | `number` | The number of tokens added to the bucket per interval. |
| **`interval`** | `number` | The duration of the refill interval (in seconds). |
