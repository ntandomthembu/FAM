import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }
        next();
    });
};