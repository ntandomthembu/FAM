import { Request, Response } from 'express';
import { ExportComplianceService } from '../../services/export-compliance.service';

const exportService = new ExportComplianceService();

export const generateCertificate = async (req: Request, res: Response) => {
    try {
        const cert = await exportService.generateExportCertificate(req.body);
        res.status(201).json(cert);
    } catch (error: any) {
        res.status(500).json({ message: 'Error generating certificate', error: error.message });
    }
};

export const getCertificateById = async (req: Request, res: Response) => {
    try {
        const cert = await exportService.getCertificateById(req.params.id);
        if (!cert) return res.status(404).json({ message: 'Certificate not found' });
        res.status(200).json(cert);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching certificate', error: error.message });
    }
};

export const getCertificatesByFarm = async (req: Request, res: Response) => {
    try {
        const certs = await exportService.getCertificatesByFarm(req.params.farmId);
        res.status(200).json(certs);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching certificates', error: error.message });
    }
};

export const getAllCertificates = async (req: Request, res: Response) => {
    try {
        const { status, page, limit } = req.query;
        const result = await exportService.getAllCertificates({
            status: status as any,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching certificates', error: error.message });
    }
};

export const approveCertificate = async (req: Request, res: Response) => {
    try {
        const issuerId = (req as any).user?.id;
        const cert = await exportService.approveCertificate(req.params.id, issuerId);
        if (!cert) return res.status(404).json({ message: 'Certificate not found' });
        res.status(200).json(cert);
    } catch (error: any) {
        res.status(500).json({ message: 'Error approving certificate', error: error.message });
    }
};

export const revokeCertificate = async (req: Request, res: Response) => {
    try {
        const cert = await exportService.revokeCertificate(req.params.id);
        if (!cert) return res.status(404).json({ message: 'Certificate not found' });
        res.status(200).json(cert);
    } catch (error: any) {
        res.status(500).json({ message: 'Error revoking certificate', error: error.message });
    }
};