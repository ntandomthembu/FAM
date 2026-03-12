import axios from 'axios';
import notificationConfig from '../config/notification';
import { logInfo, logError } from '../utils/logger';

export class SmsService {
    private accountSid: string;
    private authToken: string;
    private fromNumber: string;

    constructor() {
        this.accountSid = notificationConfig.sms.accountSid;
        this.authToken = notificationConfig.sms.authToken;
        this.fromNumber = notificationConfig.sms.fromNumber;
    }

    async sendSMS(phoneNumber: string, message: string): Promise<void> {
        try {
            const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
            await axios.post(
                url,
                new URLSearchParams({
                    To: phoneNumber,
                    From: this.fromNumber,
                    Body: message,
                }).toString(),
                {
                    auth: { username: this.accountSid, password: this.authToken },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            );
            logInfo(`SMS sent to ${phoneNumber}`);
        } catch (error: any) {
            logError(`Failed to send SMS to ${phoneNumber}: ${error.message}`);
            throw new Error('Failed to send SMS');
        }
    }
}