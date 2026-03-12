import { Job } from 'bull';
import { PermitService } from '../services/permit.service';
import { NotificationService } from '../services/notification.service';
import { MovementPermitStatus, AlertChannel } from '../types/enums';
import MovementPermit from '../models/movement-permit.model';
import { logInfo, logError } from '../utils/logger';

const permitExpiryJob = async (_job: Job) => {
    const permitService = new PermitService();
    const notificationService = new NotificationService();

    try {
        const expiredPermits = await permitService.getExpiredPermits();
        logInfo(`Permit expiry job: found ${expiredPermits.length} expired permits`);

        for (const permit of expiredPermits) {
            await MovementPermit.findByIdAndUpdate(permit._id, {
                status: MovementPermitStatus.EXPIRED,
            }).exec();

            if (permit.applicantId) {
                await notificationService.sendNotification(
                    permit.applicantId.toString(),
                    `Your movement permit ${permit._id} has expired.`,
                    [AlertChannel.SMS]
                );
            }
        }
    } catch (error: any) {
        logError(`Permit expiry job failed: ${error.message}`);
    }
};

export default permitExpiryJob;