import Incident, { IIncident } from '../models/incident.model';
import Farm from '../models/farm.model';
import { Types } from 'mongoose';
import { IncidentStatus } from '../types/enums';
import { logInfo, logError } from '../utils/logger';

export class IncidentService {
    async createIncident(incidentData: Partial<IIncident>): Promise<IIncident> {
        if (!incidentData.farmId || !Types.ObjectId.isValid(String(incidentData.farmId))) {
            throw new Error('Valid farmId is required');
        }

        const farm = await Farm.findById(String(incidentData.farmId)).exec();
        if (!farm) {
            throw new Error('Farm not found');
        }

        const preparedIncidentData: Partial<IIncident> = {
            ...incidentData,
            gpsLocation: incidentData.gpsLocation || {
                type: 'Point',
                coordinates: farm.location.coordinates,
            },
            timeSymptomsStarted: incidentData.timeSymptomsStarted || new Date(),
            numberOfAnimalsAffected: incidentData.numberOfAnimalsAffected || 1,
        };

        const incident = new Incident(preparedIncidentData);
        const saved = await incident.save();
        logInfo(`Incident created: ${saved._id}`);
        return saved;
    }

    async getIncidentById(id: string): Promise<IIncident | null> {
        return Incident.findById(id)
            .populate('farmId', 'name address province')
            .populate('reportedBy', 'username email')
            .populate('assignedVetId', 'username email')
            .exec();
    }

    async getAllIncidents(filters?: {
        status?: IncidentStatus;
        farmId?: string;
        page?: number;
        limit?: number;
    }): Promise<{ incidents: IIncident[]; total: number }> {
        const query: any = {};
        if (filters?.status) query.status = filters.status;
        if (filters?.farmId) query.farmId = filters.farmId;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [incidents, total] = await Promise.all([
            Incident.find(query)
                .populate('farmId', 'name address province')
                .populate('reportedBy', 'username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            Incident.countDocuments(query).exec(),
        ]);

        return { incidents, total };
    }

    async getRecentIncidents(limit: number = 10): Promise<IIncident[]> {
        return Incident.find()
            .populate('farmId', 'name address')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }

    async updateIncidentStatus(id: string, status: IncidentStatus, vetId?: string): Promise<IIncident | null> {
        const updateData: any = { status };
        if (status === IncidentStatus.UNDER_INVESTIGATION && vetId) {
            updateData.assignedVetId = vetId;
        }
        if (status === IncidentStatus.CONFIRMED_OUTBREAK) {
            updateData.confirmedDate = new Date();
        }
        if (status === IncidentStatus.RESOLVED) {
            updateData.resolvedDate = new Date();
        }

        const updated = await Incident.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (updated) {
            logInfo(`Incident ${id} status updated to ${status}`);
        }
        return updated;
    }

    async updateIncident(id: string, updateData: Partial<IIncident>): Promise<IIncident | null> {
        return Incident.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async deleteIncident(id: string): Promise<boolean> {
        const result = await Incident.findByIdAndDelete(id).exec();
        return !!result;
    }

    async getIncidentsNearLocation(longitude: number, latitude: number, radiusKm: number): Promise<IIncident[]> {
        return Incident.find({
            gpsLocation: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: radiusKm * 1000,
                },
            },
        }).exec();
    }

    async getIncidentStats(): Promise<{
        total: number;
        reported: number;
        underInvestigation: number;
        confirmed: number;
        resolved: number;
        falseAlarm: number;
    }> {
        const [total, reported, underInvestigation, confirmed, resolved, falseAlarm] = await Promise.all([
            Incident.countDocuments().exec(),
            Incident.countDocuments({ status: IncidentStatus.REPORTED }).exec(),
            Incident.countDocuments({ status: IncidentStatus.UNDER_INVESTIGATION }).exec(),
            Incident.countDocuments({ status: IncidentStatus.CONFIRMED_OUTBREAK }).exec(),
            Incident.countDocuments({ status: IncidentStatus.RESOLVED }).exec(),
            Incident.countDocuments({ status: IncidentStatus.FALSE_ALARM }).exec(),
        ]);

        return { total, reported, underInvestigation, confirmed, resolved, falseAlarm };
    }
}