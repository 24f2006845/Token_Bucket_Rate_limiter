
import type { Bucket,PolicyData } from "../../types/Bucket.types.js";

const refill = (bucket: Bucket, policydata: PolicyData) => {
    const now = Math.floor(Date.now() / 1000);
    const elapsed  = now - bucket.lastRefill;
    const tokenperSecond = policydata.refillRate / policydata.interval;
    const tokensToAdd = Math.floor(elapsed * tokenperSecond);
    bucket.tokens = Math.min(bucket.tokens + tokensToAdd, policydata.capacity);
    bucket.lastRefill = now;
    return bucket;
}

const consumeToken = (bucket: Bucket) => {
    if ( bucket.tokens > 1 || bucket.tokens === 1) {
        bucket.tokens -= 1;
        const remainingTokens = bucket.tokens;
        return { allowed: true, remainingTokens ,bucket};
    }
    else{
        return { allowed: false, remainingTokens: 0 };
    }
}

const calculateRetryAfter = (bucket: Bucket, policydata: PolicyData) => {
    const tokenperSecond = policydata.refillRate / policydata.interval;
    const secondsToWait = Math.ceil((1 - bucket.tokens) / tokenperSecond);
    return secondsToWait;
}

export const TokenBucketService = (bucket: Bucket, policydata: PolicyData) => {
    const updateBucket = refill(bucket, policydata);
    const consumeResult = consumeToken(updateBucket);
    if (!consumeResult.allowed) {
        const retryAfter = calculateRetryAfter(updateBucket, policydata);
        return { allowed: false, remainingTokens: 0, retryAfter };
    }
    return { allowed: true, remainingTokens: consumeResult.remainingTokens, bucket: updateBucket  };

}










