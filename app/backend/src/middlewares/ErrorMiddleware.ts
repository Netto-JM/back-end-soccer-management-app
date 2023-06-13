import { NextFunction, Request, Response } from 'express';
import ValidationError from '../errors/ValidationError';
import AuthenticationError from '../errors/AuthenticationError';
import NotFoundError from '../errors/NotFoundError';
import UnprocessableError from '../errors/UnprocessableError';
import statusCodes from '../statusCodes';

export default class ErrorMiddleware {
  static handleError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof ValidationError) {
      return res.status(statusCodes.badRequest).json({ message: error.message });
    }

    if (error instanceof AuthenticationError) {
      return res.status(statusCodes.unauthorized).json({ message: error.message });
    }

    if (error instanceof NotFoundError) {
      return res.status(statusCodes.notFound).json({ message: error.message });
    }

    if (error instanceof UnprocessableError) {
      return res.status(statusCodes.unprocessableEntity).json({ message: error.message });
    }

    console.error(error);
    res.status(statusCodes.internalServerError).end();
  }
}
