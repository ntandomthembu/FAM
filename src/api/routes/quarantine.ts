import { Router } from 'express';
import {
    createQuarantineZone,
    getQuarantineZones,
    getQuarantineZoneById,
    updateQuarantineZone,
    liftQuarantineZone,
    deleteQuarantineZone,
} from '../controllers/quarantine.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createQuarantineZone);
router.get('/', getQuarantineZones);
router.get('/:id', getQuarantineZoneById);
router.put('/:id', authenticate, updateQuarantineZone);
router.patch('/:id/lift', authenticate, liftQuarantineZone);
router.delete('/:id', authenticate, deleteQuarantineZone);

export default router;