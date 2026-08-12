import  { RateLimiterClient } from "./ client.js";
import type { PolicyConfig, RateLimiterOptions } from "./types.js";

export class RateLimiter {
  private client: RateLimiterClient;
  constructor(options: RateLimiterOptions){
    this.client = new RateLimiterClient(options.apiKey);
  }
  public async configure(policies:PolicyConfig[]): Promise<void> {
    return await this.client.policySync(policies);
  }

  public async limiter(policy: string): Promise<void> {
    return await this.client.checkRateLimiter(policy);
  }

}