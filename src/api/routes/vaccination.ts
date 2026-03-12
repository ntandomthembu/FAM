import { Router } from 'express';
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    recordVaccination,
    getVaccineStock,
    addVaccineStock,
    getVaccinationStats,
} from '../controllers/vaccination.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/campaigns', authenticate, createCampaign);
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaignById);
router.post('/records', authenticate, recordVaccination);
router.get('/stock', getVaccineStock);
router.post('/stock', authenticate, addVaccineStock);
router.get('/stats', getVaccinationStats);

export default router;