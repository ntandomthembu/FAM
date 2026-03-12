import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { connectDatabase } from '../config/database';
import appConfig from '../config/app';
import { logInfo, logError } from '../utils/logger';

// Route imports
import authRoutes from './routes/auth';
import incidentRoutes from './routes/incidents';
import farmRoutes from './routes/farms';
import livestockRoutes from './routes/livestock';
import quarantineRoutes from './routes/quarantine';
import vaccinationRoutes from './routes/vaccination';
import veterinaryRoutes from './routes/veterinary';
import alertRoutes from './routes/alerts';
import permitRoutes from './routes/permits';
import dashboardRoutes from './routes/dashboard';
import exportComplianceRoutes from './routes/export-compliance';

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
    cors: { origin: appConfig.corsOrigins, methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors({ origin: appConfig.corsOrigins }));
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const API_PREFIX = '/api/v1';

app.get(`${API_PREFIX}/health`, (_req, res) => {
    res.status(200).json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/incidents`, incidentRoutes);
app.use(`${API_PREFIX}/farms`, farmRoutes);
app.use(`${API_PREFIX}/livestock`, livestockRoutes);
app.use(`${API_PREFIX}/quarantine`, quarantineRoutes);
app.use(`${API_PREFIX}/vaccination`, vaccinationRoutes);
app.use(`${API_PREFIX}/veterinary`, veterinaryRoutes);
app.use(`${API_PREFIX}/alerts`, alertRoutes);
app.use(`${API_PREFIX}/permits`, permitRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/export`, exportComplianceRoutes);

// Socket.io for real-time alerts
io.on('connection', (socket) => {
    logInfo(`Socket connected: ${socket.id}`);

    socket.on('join:farm', (farmId: string) => {
        socket.join(`farm:${farmId}`);
    });

    socket.on('disconnect', () => {
        logInfo(`Socket disconnected: ${socket.id}`);
    });
});

// Make io accessible to services
app.set('io', io);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logError(`Unhandled error: ${err.message}`);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(appConfig.env === 'development' && { stack: err.stack }),
    });
});

// Start server
const start = async () => {
    try {
        await connectDatabase();
        logInfo('Database connected');

        const PORT = appConfig.port;
        server.listen(PORT, () => {
            logInfo(`FMD Control Platform API running on port ${PORT}`);
            logInfo(`Environment: ${appConfig.env}`);
        });
    } catch (error: any) {
        logError(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

start();

export { app, io };