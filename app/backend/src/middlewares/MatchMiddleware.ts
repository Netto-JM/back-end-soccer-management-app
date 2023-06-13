import { Request, Response, NextFunction } from 'express';
import UnprocessableError from '../errors/UnprocessableError';

export default class MatchMiddleware {
  static validateMatch(req: Request, _res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;

    if (homeTeamId === awayTeamId) {
      throw new UnprocessableError('It is not possible to create a match with two equal teams');
    }

    next();
  }
}
