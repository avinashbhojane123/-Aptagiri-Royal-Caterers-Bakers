import { DataSource } from 'typeorm';
export declare class AnalyticsService {
    private dataSource;
    private cache;
    private readonly CACHE_TTL;
    constructor(dataSource: DataSource);
    getTopSellingCakes(): Promise<any[]>;
    getTopCaterersItems(): Promise<any[]>;
    getDashboardStats(): Promise<any>;
}
