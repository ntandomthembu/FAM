import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    port: parseInt(process.env.PORT || process.env.APP_PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    apiPrefix: '/api/v1',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001', 'http://localhost:3002'],
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100,
    outbreakClusterRadiusKm: 15,
    proximityAlertRadiusKm: 10,
    permitExpiryWarningDays: 7,
    uploadMaxSizeMb: 10,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/quicktime'],
};

export default appConfig;