import { Router } from 'express';
import {
    sendProximityAlert,
    sendOutbreakAlert,
    sendVaccinationReminder,
} from '../controllers/alert.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/proximity', authenticate, sendProximityAlert);
router.post('/outbreak/:incidentId', authenticate, sendOutbreakAlert);
router.post('/vaccination-reminder', authenticate, sendVaccinationReminder);

export default router;