import redis from "../../config/redis.js";
import type { PolicyData } from "../../types/Bucket.types.js";

const tokenBucketScript = `
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local intervalMs = tonumber(ARGV[3])
local now = tonumber(ARGV[4])
local ttlMs = tonumber(ARGV[5])

local tokens = tonumber(redis.call('HGET', KEYS[1], 'tokens'))
local lastRefillMs = tonumber(redis.call('HGET', KEYS[1], 'lastRefillMs'))

if not tokens or not lastRefillMs then
  tokens = capacity
  lastRefillMs = now
end

local elapsedMs = math.max(0, now - lastRefillMs)
tokens = math.min(capacity, tokens + (elapsedMs * refillRate / intervalMs))
lastRefillMs = now

local allowed = 0
local retryAfter = 0
if tokens >= 1 then
  tokens = tokens - 1
  allowed = 1
else
  retryAfter = math.ceil((1 - tokens) * intervalMs / refillRate / 1000)
end

redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'lastRefillMs', tostring(lastRefillMs))
redis.call('PEXPIRE', KEYS[1], ttlMs)

return { allowed, tostring(tokens), retryAfter }
`;

export type TokenBucketResult = {
  allowed: boolean;
  limit: number;
  remainingTokens: number;
  retryAfter: number;
};

export const consumeTokenAtomically = async (
  key: string,
  policy: PolicyData,
): Promise<TokenBucketResult> => {
  const intervalMs = policy.interval * 1000;
  const ttlMs = Math.max(1, Math.ceil((policy.capacity * intervalMs) / policy.refillRate));
  const reply = await redis.eval(tokenBucketScript, {
    keys: [key],
    arguments: [
      String(policy.capacity),
      String(policy.refillRate),
      String(intervalMs),
      String(Date.now()),
      String(ttlMs),
    ],
  });
  const [allowed, remainingTokens, retryAfter] = reply as [number, string, number];

  return {
    allowed: allowed === 1,
    limit: policy.capacity,
    remainingTokens: Number(remainingTokens),
    retryAfter: Number(retryAfter),
  };
};
