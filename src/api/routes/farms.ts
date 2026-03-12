import { Router } from 'express';
import {
    createFarm,
    getFarmById,
    updateFarm,
    deleteFarm,
    getAllFarms,
    getNearbyFarms,
} from '../controllers/farm.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createFarm);
router.get('/', getAllFarms);
router.get('/nearby', getNearbyFarms);
router.get('/:id', getFarmById);
router.put('/:id', authenticate, updateFarm);
router.delete('/:id', authenticate, deleteFarm);

export default router;