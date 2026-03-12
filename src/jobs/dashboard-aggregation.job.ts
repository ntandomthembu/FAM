import { Job } from 'bull';
import { DashboardService } from '../services/dashboard.service';
import { getRedisClient } from '../config/redis';
import { logInfo, logError } from '../utils/logger';

const CACHE_KEY = 'dashboard:aggregated';
const CACHE_TTL = 300; // 5 minutes

const dashboardAggregationJob = async (_job: Job) => {
    const dashboardService = new DashboardService();

    try {
        const data = await dashboardService.getDashboardData();

        // Cache aggregated data in Redis
        try {
            const redis = getRedisClient();
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(data));
            logInfo('Dashboard data cached in Redis');
        } catch {
            // Redis caching is non-critical
            logInfo('Dashboard data aggregated (Redis cache unavailable)');
        }
    } catch (error: any) {
        logError(`Dashboard aggregation job failed: ${error.message}`);
        throw error;
    }
};

export default dashboardAggregationJob;