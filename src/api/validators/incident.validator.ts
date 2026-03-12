import { body } from 'express-validator';

export const incidentValidator = [
    body('farmLocation')
        .notEmpty()
        .withMessage('Farm location is required.'),
    body('numberOfAnimalsAffected')
        .isInt({ gt: 0 })
        .withMessage('Number of affected animals must be a positive integer.'),
    body('species')
        .notEmpty()
        .withMessage('Species is required.'),
    body('symptoms')
        .isArray()
        .withMessage('Symptoms must be an array.'),
    body('photos')
        .optional()
        .isArray()
        .withMessage('Photos must be an array if provided.'),
    body('timeSymptomsStarted')
        .isISO8601()
        .withMessage('Time symptoms started must be a valid date.'),
];