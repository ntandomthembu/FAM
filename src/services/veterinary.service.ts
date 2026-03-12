import Incident, { IIncident } from '../models/incident.model';
import LabSample, { ILabSample } from '../models/lab-sample.model';
import Farm from '../models/farm.model';
import { IncidentStatus, LabSampleResult } from '../types/enums';
import { logInfo } from '../utils/logger';

export class VeterinaryService {
    async assignVetToIncident(incidentId: string, vetId: string): Promise<IIncident | null> {
        const updated = await Incident.findByIdAndUpdate(
            incidentId,
            { assignedVetId: vetId, status: IncidentStatus.UNDER_INVESTIGATION },
            { new: true }
        ).exec();
        if (updated) logInfo(`Vet ${vetId} assigned to incident ${incidentId}`);
        return updated;
    }

    async getAssignedIncidents(vetId: string): Promise<IIncident[]> {
        return Incident.find({ assignedVetId: vetId })
            .populate('farmId', 'name address province')
            .populate('reportedBy', 'username')
            .sort({ createdAt: -1 })
            .exec();
    }

    async submitLabSample(sampleData: Partial<ILabSample>): Promise<ILabSample> {
        const sample = new LabSample(sampleData);
        const saved = await sample.save();

        // Link sample to incident
        if (sampleData.incidentId) {
            await Incident.findByIdAndUpdate(sampleData.incidentId, {
                $push: { labSampleIds: saved._id },
            }).exec();
        }

        logInfo(`Lab sample ${saved._id} submitted for incident ${sampleData.incidentId}`);
        return saved;
    }

    async updateLabSampleResult(
        sampleId: string,
        result: LabSampleResult,
        notes?: string
    ): Promise<ILabSample | null> {
        return LabSample.findByIdAndUpdate(
            sampleId,
            { result, resultDate: new Date(), notes },
            { new: true }
        ).exec();
    }

    async getLabSamplesByIncident(incidentId: string): Promise<ILabSample[]> {
        return LabSample.find({ incidentId })
            .populate('collectedBy', 'username')
            .sort({ collectionDate: -1 })
            .exec();
    }

    async confirmOutbreak(incidentId: string): Promise<IIncident | null> {
        return Incident.findByIdAndUpdate(
            incidentId,
            {
                status: IncidentStatus.CONFIRMED_OUTBREAK,
                confirmedDate: new Date(),
            },
            { new: true }
        ).exec();
    }

    async resolveIncident(incidentId: string): Promise<IIncident | null> {
        return Incident.findByIdAndUpdate(
            incidentId,
            {
                status: IncidentStatus.RESOLVED,
                resolvedDate: new Date(),
            },
            { new: true }
        ).exec();
    }

    async getInvestigationDetails(incidentId: string): Promise<{
        incident: IIncident | null;
        labSamples: ILabSample[];
    }> {
        const [incident, labSamples] = await Promise.all([
            Incident.findById(incidentId)
                .populate('farmId')
                .populate('reportedBy', 'username email')
                .populate('assignedVetId', 'username email')
                .exec(),
            LabSample.find({ incidentId }).sort({ collectionDate: -1 }).exec(),
        ]);

        return { incident, labSamples };
    }
}