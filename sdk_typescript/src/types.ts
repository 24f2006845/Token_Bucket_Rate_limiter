export interface RateLimiterOptions {
  apiKey: string;
}
export interface PolicyConfig {
  name: string;
  capacity: number;
  refillRate: number;
  interval: number;
}