import type { PolicyConfig } from "./types.js";
export class RateLimiterClient{
    private readonly baseUrl: string;
    private readonly apiKey: string;
    constructor(apiKey: string) {
        this.baseUrl = 'http://localhost:3000';
        this.apiKey = apiKey;
    }
    private async request(endpoint: string, options: RequestInit) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = new Headers(options.headers);
        headers.set("x-api-key", this.apiKey);
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Request failed with status ${response.status} :${error}`);
        }
        return response.json();
    }

    public async checkRateLimiter(policy: string) {
        return this.request('/api/limiter/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ policy })
        });
    }
    public async policySync(policies: PolicyConfig[]) {
        return this.request('/api/policy/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ policies })
        });
    }
}