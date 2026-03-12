import { Router } from 'express';
import {
    assignVet,
    getAssignedIncidents,
    submitLabSample,
    updateLabSampleResult,
    getInvestigationDetails,
    confirmOutbreak,
    resolveIncident,
} from '../controllers/veterinary.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/assign/:incidentId', authenticate, assignVet);
router.get('/assigned', authenticate, getAssignedIncidents);
router.post('/lab-samples', authenticate, submitLabSample);
router.patch('/lab-samples/:sampleId/result', authenticate, updateLabSampleResult);
router.get('/investigation/:incidentId', authenticate, getInvestigationDetails);
router.patch('/confirm/:incidentId', authenticate, confirmOutbreak);
router.patch('/resolve/:incidentId', authenticate, resolveIncident);

export default router;