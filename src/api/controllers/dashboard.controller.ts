import { Request, Response } from 'express';
import { DashboardService } from '../../services/dashboard.service';

const dashboardService = new DashboardService();

export const getDashboardData = async (_req: Request, res: Response) => {
    try {
        const data = await dashboardService.getDashboardData();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving dashboard data', error: error.message });
    }
};

export const getHeatmapData = async (_req: Request, res: Response) => {
    try {
        const data = await dashboardService.getIncidentHeatmapData();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving heatmap data', error: error.message });
    }
};