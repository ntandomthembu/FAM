import { Router } from 'express';
import {
    generateCertificate,
    getCertificateById,
    getCertificatesByFarm,
    getAllCertificates,
    approveCertificate,
    revokeCertificate,
} from '../controllers/export-compliance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/certificates', authenticate, generateCertificate);
router.get('/certificates', getAllCertificates);
router.get('/certificates/:id', getCertificateById);
router.get('/certificates/farm/:farmId', getCertificatesByFarm);
router.patch('/certificates/:id/approve', authenticate, approveCertificate);
router.patch('/certificates/:id/revoke', authenticate, revokeCertificate);

export default router;