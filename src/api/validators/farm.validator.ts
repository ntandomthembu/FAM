import { body } from 'express-validator';

export const farmValidator = [
    body('farmName')
        .notEmpty()
        .withMessage('Farm name is required.')
        .isString()
        .withMessage('Farm name must be a string.'),
    
    body('location')
        .notEmpty()
        .withMessage('Location is required.')
        .isObject()
        .withMessage('Location must be an object.'),
    
    body('location.latitude')
        .notEmpty()
        .withMessage('Latitude is required.')
        .isFloat()
        .withMessage('Latitude must be a valid number.'),
    
    body('location.longitude')
        .notEmpty()
        .withMessage('Longitude is required.')
        .isFloat()
        .withMessage('Longitude must be a valid number.'),
    
    body('animalTypes')
        .isArray()
        .withMessage('Animal types must be an array.')
        .notEmpty()
        .withMessage('Animal types cannot be empty.'),
    
    body('contactInfo')
        .notEmpty()
        .withMessage('Contact information is required.')
        .isObject()
        .withMessage('Contact information must be an object.'),
    
    body('contactInfo.phone')
        .notEmpty()
        .withMessage('Phone number is required.')
        .isString()
        .withMessage('Phone number must be a string.'),
    
    body('contactInfo.email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address.')
];