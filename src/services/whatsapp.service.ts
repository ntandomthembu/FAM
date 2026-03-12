import axios from 'axios';
import notificationConfig from '../config/notification';
import { logInfo, logError } from '../utils/logger';

export class WhatsAppService {
    private apiUrl: string;
    private apiToken: string;

    constructor() {
        this.apiUrl = notificationConfig.whatsapp.apiUrl;
        this.apiToken = notificationConfig.whatsapp.apiKey;
    }

    async sendMessage(phoneNumber: string, message: string): Promise<void> {
        try {
            await axios.post(
                `${this.apiUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: phoneNumber,
                    type: 'text',
                    text: { body: message },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            logInfo(`WhatsApp message sent to ${phoneNumber}`);
        } catch (error: any) {
            logError(`Failed to send WhatsApp message to ${phoneNumber}: ${error.message}`);
            throw error;
        }
    }
}