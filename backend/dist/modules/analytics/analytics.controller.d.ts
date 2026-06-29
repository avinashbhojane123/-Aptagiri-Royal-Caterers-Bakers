import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getTopSelling(): Promise<any[]>;
    getCaterersTopSelling(): Promise<any[]>;
    getStats(): Promise<any>;
}
