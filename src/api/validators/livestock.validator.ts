import { body } from 'express-validator';

export const livestockValidator = [
    body('farmId')
        .exists()
        .withMessage('Farm ID is required')
        .isString()
        .withMessage('Farm ID must be a string'),

    body('species')
        .exists()
        .withMessage('Species is required')
        .isString()
        .withMessage('Species must be a string'),

    body('numberOfAnimals')
        .exists()
        .withMessage('Number of animals is required')
        .isInt({ gt: 0 })
        .withMessage('Number of animals must be a positive integer'),

    body('healthStatus')
        .optional()
        .isString()
        .withMessage('Health status must be a string'),

    body('symptoms')
        .optional()
        .isArray()
        .withMessage('Symptoms must be an array of strings')
        .custom((value: any) => {
            value.forEach((symptom: string) => {
                if (typeof symptom !== 'string') {
                    throw new Error('Each symptom must be a string');
                }
            });
            return true;
        }),

    body('location')
        .exists()
        .withMessage('Location is required')
        .isObject()
        .withMessage('Location must be an object')
        .custom((value: any) => {
            if (!value.latitude || !value.longitude) {
                throw new Error('Location must contain latitude and longitude');
            }
            return true;
        }),
];