import { Router } from 'express';
import {
    requestPermit,
    getPermitById,
    getAllPermits,
    approvePermit,
    denyPermit,
    deletePermit,
} from '../controllers/permit.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, requestPermit);
router.get('/', getAllPermits);
router.get('/:id', getPermitById);
router.patch('/:id/approve', authenticate, approvePermit);
router.patch('/:id/deny', authenticate, denyPermit);
router.delete('/:id', authenticate, deletePermit);

export default router;