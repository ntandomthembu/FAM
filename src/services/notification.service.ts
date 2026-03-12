import { SmsService } from './sms.service';
import { WhatsAppService } from './whatsapp.service';
import User from '../models/user.model';
import Farm from '../models/farm.model';
import { AlertChannel } from '../types/enums';
import { logInfo, logError } from '../utils/logger';

export class NotificationService {
    private smsService: SmsService;
    private whatsAppService: WhatsAppService;

    constructor() {
        this.smsService = new SmsService();
        this.whatsAppService = new WhatsAppService();
    }

    async sendNotification(
        userId: string,
        message: string,
        channels: AlertChannel[] = [AlertChannel.SMS]
    ): Promise<void> {
        const user = await User.findById(userId).exec();
        if (!user || !user.phone) {
            logError(`Cannot send notification: user ${userId} not found or no phone`);
            return;
        }

        const promises: Promise<void>[] = [];
        for (const channel of channels) {
            switch (channel) {
                case AlertChannel.SMS:
                    promises.push(this.smsService.sendSMS(user.phone, message));
                    break;
                case AlertChannel.WHATSAPP:
                    promises.push(this.whatsAppService.sendMessage(user.phone, message));
                    break;
                case AlertChannel.PUSH:
                    // FCM push notification - placeholder
                    logInfo(`Push notification to ${userId}: ${message}`);
                    break;
                case AlertChannel.EMAIL:
                    // Email notification - placeholder
                    logInfo(`Email notification to ${userId}: ${message}`);
                    break;
            }
        }

        await Promise.allSettled(promises);
        logInfo(`Notification sent to user ${userId} via ${channels.join(', ')}`);
    }

    async sendAlertToNearbyFarmers(
        longitude: number,
        latitude: number,
        radiusKm: number,
        message: string
    ): Promise<number> {
        const nearbyFarms = await Farm.find({
            gpsCoordinates: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: radiusKm * 1000,
                },
            },
        }).exec();

        const ownerIds = nearbyFarms.map((f) => f.ownerId).filter(Boolean);
        const uniqueOwnerIds = [...new Set(ownerIds.map(String))];

        for (const ownerId of uniqueOwnerIds) {
            await this.sendNotification(ownerId, message, [AlertChannel.SMS, AlertChannel.WHATSAPP]);
        }

        logInfo(`Alert sent to ${uniqueOwnerIds.length} farmers near [${longitude}, ${latitude}]`);
        return uniqueOwnerIds.length;
    }

    async broadcastAlert(message: string, channels: AlertChannel[] = [AlertChannel.SMS]): Promise<void> {
        const users = await User.find({ isActive: true }).exec();
        for (const user of users) {
            await this.sendNotification(user._id.toString(), message, channels);
        }
    }
}