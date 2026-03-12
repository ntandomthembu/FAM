import { body } from 'express-validator';

export const permitValidator = [
    body('farmId')
        .exists()
        .withMessage('Farm ID is required')
        .isMongoId()
        .withMessage('Invalid Farm ID format'),
    
    body('animalIds')
        .exists()
        .withMessage('Animal IDs are required')
        .isArray()
        .withMessage('Animal IDs must be an array')
        .custom((value: any) => {
            if (value.length === 0) {
                throw new Error('Animal IDs array cannot be empty');
            }
            return true;
        }),

    body('destination')
        .exists()
        .withMessage('Destination is required')
        .isString()
        .withMessage('Destination must be a string'),

    body('reason')
        .optional()
        .isString()
        .withMessage('Reason must be a string'),

    body('dateOfMovement')
        .exists()
        .withMessage('Date of movement is required')
        .isISO8601()
        .withMessage('Date of movement must be a valid date'),
];