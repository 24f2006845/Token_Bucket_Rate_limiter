# SDK Usage Guide

Once your client is initialized and policies are configured, you can enforce rate limits on your endpoints.

---

## 1. Checking Rate Limits Manually

You can query the RLaaS API to check if a policy has tokens remaining and atomically consume one.

### TypeScript

```typescript
const result = await limiter.check("user-login");

if (!result.allowed) {
  // Rate limit exceeded
  console.log(`Rate limit reached. Retry after ${result.retryAfter} seconds.`);
  
  return res.status(429).json({
    error: "Too many requests",
    retryAfter: result.retryAfter
  });
}

// Proceed with handler logic
```

### Python

```python
result = await limiter.check("user-login")

if not result.allowed:
    # Rate limit exceeded
    print(f"Rate limit reached. Retry after {result.retry_after} seconds.")
    
    return JSONResponse(
        status_code=429,
        content={
            "error": "Too many requests",
            "retryAfter": result.retry_after
        }
    )

# Proceed with handler logic
```

---

## 2. Express Middleware (TypeScript / Node)

The SDK provides a built-in Express middleware wrapper for automatic rate limit checks.

```typescript
import { rateLimit } from "token-bucket-rate-limiter-sdk";

// Define route-specific rate limiter middlewares
const loginRateLimiter = rateLimit(limiter, "user-login");
const apiRateLimiter = rateLimit(limiter, "public-api");

// Route integration
app.post("/api/auth/login", loginRateLimiter, (req, res) => {
  res.json({ message: "Login successful" });
});

app.get("/api/data", apiRateLimiter, (req, res) => {
  res.json({ data: "General public resource data" });
});
```

### Automatic Headers Added by Middleware

When using `rateLimit` middleware, the following headers are appended to the response automatically:

- **On Allowed Requests:**
  - `X-RateLimit-Limit`: Maximum bucket capacity.
  - `X-RateLimit-Remaining`: Tokens remaining after this check.
  
- **On Denied Requests (429):**
  - `Retry-After`: Seconds until tokens are refilled.

---

## 3. Python Integration (e.g. FastAPI / Flask)

You can write custom dependencies or decorators to wrap the manual check.

### FastAPI Dependency Example

```python
from fastapi import HTTPException, Header, Depends
from rlaas_sdk import RateLimiter, RateLimitBlockedResult

limiter = RateLimiter(api_key="your_api_key")

async def check_api_rate_limit():
    result = await limiter.check("public-api")
    if not result.allowed:
        headers = {"Retry-After": str(result.retry_after)} if result.retry_after else {}
        raise HTTPException(
            status_code=429, 
            detail="Too many requests", 
            headers=headers
        )

@app.get("/api/data", dependencies=[Depends(check_api_rate_limit)])
async def get_data():
    return {"data": "General public resource data"}
```
