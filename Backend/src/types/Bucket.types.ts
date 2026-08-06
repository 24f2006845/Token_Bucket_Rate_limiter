export interface Bucket {
    tokens: number;
    lastRefill: number;
}
export interface PolicyData {
    id: string;
    name: string;
    capacity: number;
    refillRate: number;
    interval: number;
}   

