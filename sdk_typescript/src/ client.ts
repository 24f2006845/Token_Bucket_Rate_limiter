export class RateLimiterClient{
    private readonly baseUrl: string;
    private readonly apiKey: string;
    constructor(apiKey: string) {
        this.baseUrl = 'https://localhost:3000';
        this.apiKey = apiKey;
    }
}