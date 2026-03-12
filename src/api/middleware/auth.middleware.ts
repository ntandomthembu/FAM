import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '../../config/app';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, appConfig.jwtSecret);
        (req as any).user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};