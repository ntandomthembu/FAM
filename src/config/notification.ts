const notificationConfig = {
    sms: {
        enabled: process.env.SMS_ENABLED === 'true',
        provider: 'twilio',
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        fromNumber: process.env.SMS_FROM_NUMBER || '',
    },
    whatsapp: {
        enabled: process.env.WHATSAPP_ENABLED === 'true',
        apiUrl: process.env.WHATSAPP_API_URL || '',
        apiKey: process.env.WHATSAPP_API_KEY || '',
        fromNumber: process.env.WHATSAPP_FROM_NUMBER || '',
    },
    push: {
        enabled: process.env.FCM_ENABLED === 'true',
        serverKey: process.env.FCM_SERVER_KEY || '',
        projectId: process.env.FCM_PROJECT_ID || '',
    },
    email: {
        enabled: process.env.EMAIL_ENABLED === 'true',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
        fromAddress: process.env.EMAIL_FROM || 'noreply@fmd-platform.com',
    },
};

export default notificationConfig;