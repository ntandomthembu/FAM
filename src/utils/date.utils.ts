export const formatDate = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes('YYYY')) {
        options.year = 'numeric';
    }
    if (format.includes('MM')) {
        options.month = '2-digit';
    }
    if (format.includes('DD')) {
        options.day = '2-digit';
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const parseDate = (dateString: string): Date => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }
    return date;
};

export const isDateValid = (date: Date): boolean => {
    return !isNaN(date.getTime());
};