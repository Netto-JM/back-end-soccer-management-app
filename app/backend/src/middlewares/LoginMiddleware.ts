import { Request, Response, NextFunction } from 'express';
import ValidationError from '../errors/ValidationError';

export default class LoginMiddleware {
  static validateLogin(req: Request, _res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('All fields must be filled');
    }

    next();
  }
}
