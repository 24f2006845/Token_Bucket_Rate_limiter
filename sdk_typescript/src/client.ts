import {
  AuthenticationError,
  NetworkError,
  RateLimitError,
  RateLimiterError,
  ValidationError,
} from "./errors.js";
import type {
  ApiResponse,
  PolicyConfig,
  RateLimitCheckData,
  RateLimiterOptions,
  SyncPoliciesResult,
} from "./types.js";

// Set this to the public URL of your deployed rate-limiter API before publishing.
const RATE_LIMITER_API_URL = "http://localhost:3000";

/** Low-level client for the Token Bucket Rate Limiter HTTP API. */
export class RateLimiterClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: RateLimiterOptions) {
    if (!options.apiKey.trim()) {
      throw new ValidationError("An API key is required.");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = RATE_LIMITER_API_URL.replace(/\/$/, "");
  }

  /** Synchronize one or more rate-limit policies with the API. */
  public async syncPolicies(policies: PolicyConfig[]): Promise<SyncPoliciesResult> {
    if (policies.length === 0) {
      throw new ValidationError("At least one policy is required.");
    }

    return this.request<SyncPoliciesResult>("/api/policy/sync", {
      method: "POST",
      body: JSON.stringify({ policies }),
    });
  }

  /** Consume a token for a named policy. */
  public async checkRateLimit(policy: string): Promise<RateLimitCheckData> {
    if (!policy.trim()) {
      throw new ValidationError("A policy name is required.");
    }

    return this.request<RateLimitCheckData>("/api/limiter/check", {
      method: "POST",
      body: JSON.stringify({ policy }),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          ...init.headers,
        },
      });
    } catch (cause) {
      throw new NetworkError("Unable to reach the rate limiter API.", { cause });
    }

    const payload = await this.readPayload(response);

    if (!response.ok) {
      throw this.toError(response, payload);
    }

    if (!this.isApiResponse(payload) || !payload.success) {
      throw new RateLimiterError("The API returned an invalid response.", response.status);
    }

    return payload.data as T;
  }

  private async readPayload(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return undefined;

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  private toError(response: Response, payload: unknown): RateLimiterError {
    const message = this.isApiResponse(payload)
      ? payload.message ?? `Request failed with status ${response.status}.`
      : typeof payload === "string" && payload
        ? payload
        : `Request failed with status ${response.status}.`;
    const retryAfter = this.parseRetryAfter(response.headers.get("retry-after"));

    if (response.status === 429) {
      return new RateLimitError(message, retryAfter);
    }
    if (response.status === 401 || response.status === 403) {
      return new AuthenticationError(message, response.status);
    }
    if (response.status === 400 || response.status === 422) {
      return new ValidationError(message, response.status);
    }
    return new RateLimiterError(message, response.status, { payload });
  }

  private parseRetryAfter(value: string | null): number | undefined {
    if (!value) return undefined;
    const seconds = Number(value);
    return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined;
  }

  private isApiResponse(value: unknown): value is ApiResponse<unknown> {
    return typeof value === "object" && value !== null && "success" in value;
  }
}
