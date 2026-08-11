import  { RateLimiterClient } from "./ client.js";
import type { RateLimiterOptions } from "./types.js";

export class RateLimiter {
  private client: RateLimiterClient;
  constructor(options: RateLimiterOptions){
    this.client = new RateLimiterClient(options.apiKey);
  }
}