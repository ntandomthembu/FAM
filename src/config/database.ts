import mongoose from 'mongoose';
import { logInfo, logError } from '../utils/logger';

const getDatabaseConfig = () => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fmd_control_platform',
    options: {
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    },
});

export const connectDatabase = async (): Promise<void> => {
    const config = getDatabaseConfig();
    logInfo(`Connecting to MongoDB at ${config.uri.replace(/\/\/[^@]+@/, '//***@')}...`);
    try {
        await mongoose.connect(config.uri, config.options);
        logInfo('Connected to MongoDB successfully');
    } catch (error) {
        logError(`MongoDB connection error: ${error}`);
        logError('Server will start without database — API calls requiring DB will fail.');
    }
};

mongoose.connection.on('disconnected', () => {
    logError('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    logError(`MongoDB error: ${err}`);
});

export default getDatabaseConfig;