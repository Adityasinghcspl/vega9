import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';

// Extend the Express Request type to include the user property
interface AuthenticatedRequest extends Request {
  user?: any; // You can replace `any` with your decoded user type if known
}

const validateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = config.ACCESS_TOKEN_SECRET;

      if (!secret) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      req.user = decoded.user; // Attach decoded user info
      return next();
    }

    res.status(401);
    throw new Error('User is not authorized or token is missing');
  } catch (err: any) {
    res.status(401).json({
      message: err.message || 'User is not authorized',
    });
  }
};

export default validateToken;
