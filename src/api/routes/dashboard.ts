import { Router } from 'express';
import { getDashboardData, getHeatmapData } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getDashboardData);
router.get('/heatmap', authenticate, getHeatmapData);

export default router;