import { RateLimiterClient } from "./client.js";
import { RateLimitError } from "./errors.js";
import type {
  PolicyConfig,
  RateLimitResult,
  RateLimiterOptions,
  SyncPoliciesResult,
} from "./types.js";

/** High-level SDK interface for configuring and checking rate-limit policies. */
export class RateLimiter {
  private readonly client: RateLimiterClient;

  constructor(options: RateLimiterOptions) {
    this.client = new RateLimiterClient(options);
  }

  /** Create or update the supplied policies. */
  public configure(policies: PolicyConfig[]): Promise<SyncPoliciesResult> {
    return this.client.syncPolicies(policies);
  }

  /**
   * Check a policy and consume one token when it is available.
   * A rate-limited response is returned as `{ allowed: false }`; other API failures throw.
   */
  public async check(policy: string): Promise<RateLimitResult> {
    try {
      return await this.client.checkRateLimit(policy);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return error.retryAfter === undefined
          ? { allowed: false }
          : { allowed: false, retryAfter: error.retryAfter };
      }
      throw error;
    }
  }
}
