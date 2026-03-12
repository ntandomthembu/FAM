const formatTimestamp = () => new Date().toISOString();

export const logInfo = (message: string) => {
    console.log(`[${formatTimestamp()}] INFO: ${message}`);
};

export const logError = (message: string) => {
    console.error(`[${formatTimestamp()}] ERROR: ${message}`);
};

export const logWarning = (message: string) => {
    console.warn(`[${formatTimestamp()}] WARN: ${message}`);
};