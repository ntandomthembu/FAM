import Redis from 'ioredis';
import { logInfo, logError } from '../utils/logger';

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB) || 0,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
    },
};

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        redisClient = new Redis(redisConfig);

        redisClient.on('connect', () => {
            logInfo('Connected to Redis successfully');
        });

        redisClient.on('error', (err) => {
            logError(`Redis connection error: ${err}`);
        });
    }
    return redisClient;
};

export default redisConfig;