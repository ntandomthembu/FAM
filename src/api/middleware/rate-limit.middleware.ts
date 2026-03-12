import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
});

// Apply the rate limiting middleware to all requests
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  limiter(req, res, next);
};