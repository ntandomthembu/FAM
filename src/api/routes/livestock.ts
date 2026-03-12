import { Router } from 'express';
import {
    registerLivestock,
    getLivestockByFarm,
    updateLivestock,
    traceLivestock,
    recordMovement,
    getMovementHistory,
    getTraceabilityData,
} from '../controllers/livestock.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, registerLivestock);
router.get('/farm/:farmId', getLivestockByFarm);
router.get('/traceability', getTraceabilityData);
router.get('/:id/trace', traceLivestock);
router.put('/:id', authenticate, updateLivestock);
router.post('/movements', authenticate, recordMovement);
router.get('/movements/farm/:farmId', getMovementHistory);

export default router;