import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../types/enums';

const roleGuard = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    };
};

export default roleGuard;