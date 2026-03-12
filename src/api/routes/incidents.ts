import { Router } from 'express';
import {
    reportIncident,
    getIncidents,
    getIncidentById,
    updateIncident,
    updateIncidentStatus,
    deleteIncident,
    getNearbyIncidents,
    getIncidentStats,
} from '../controllers/incident.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, reportIncident);
router.get('/', getIncidents);
router.get('/stats', getIncidentStats);
router.get('/nearby', getNearbyIncidents);
router.get('/:id', getIncidentById);
router.put('/:id', authenticate, updateIncident);
router.patch('/:id/status', authenticate, updateIncidentStatus);
router.delete('/:id', authenticate, deleteIncident);

export default router;