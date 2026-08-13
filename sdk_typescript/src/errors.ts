/** Base error for failures returned by, or encountered while calling, the SDK. */
export class RateLimiterError extends Error {
  public readonly statusCode?: number;
  public readonly payload?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    options: { cause?: unknown; payload?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "RateLimiterError";
    if (statusCode !== undefined) {
      this.statusCode = statusCode;
    }
    if (options.payload !== undefined) {
      this.payload = options.payload;
    }
  }
}

/** The API key is missing, invalid, revoked, or unauthorized. */
export class AuthenticationError extends RateLimiterError {
  constructor(message: string, statusCode = 401) {
    super(message, statusCode);
    this.name = "AuthenticationError";
  }
}

/** The request contains invalid SDK input or was rejected by API validation. */
export class ValidationError extends RateLimiterError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
    this.name = "ValidationError";
  }
}

/** A policy has no available tokens. */
export class RateLimitError extends RateLimiterError {
  public readonly retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message, 429);
    this.name = "RateLimitError";
    if (retryAfter !== undefined) {
      this.retryAfter = retryAfter;
    }
  }
}

/** The rate limiter API could not be reached. */
export class NetworkError extends RateLimiterError {
  constructor(message: string, options: { cause?: unknown } = {}) {
    super(message, undefined, options);
    this.name = "NetworkError";
  }
}
