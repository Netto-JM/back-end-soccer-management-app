import { Request, Response, NextFunction } from 'express';
import AuthenticationError from '../errors/AuthenticationError';
import jwtService from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  role?: string;
}

export default class AuthenticationMiddleware {
  static authenticateUser(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const { authorization: token } = req.headers;

    if (!token) {
      throw new AuthenticationError('Token not found');
    }

    try {
      const { role } = jwtService.validateToken(token);
      req.role = role;
    } catch (error) {
      console.log(error);
      throw new AuthenticationError('Token must be a valid token');
    }

    next();
  }
}
