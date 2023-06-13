import { Router } from 'express';
import { MatchController } from '../controllers';
import { AuthenticationMiddleware, MatchMiddleware } from '../middlewares';

const matchRoute = Router();

matchRoute.get('/', MatchController.listAll)
  .post(
    '/',
    AuthenticationMiddleware.authenticateUser,
    MatchMiddleware.validateMatch,
    MatchController.createMatch,
  )
  .patch('/:id/', AuthenticationMiddleware.authenticateUser, MatchController.updateMatch)
  .patch('/:id/finish', AuthenticationMiddleware.authenticateUser, MatchController.finishMatch);

export default matchRoute;
