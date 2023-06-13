import { Router } from 'express';
import { LoginController } from '../controllers';
import { AuthenticationMiddleware, LoginMiddleware } from '../middlewares';

const loginRoute = Router();

loginRoute.get('/role', AuthenticationMiddleware.authenticateUser, LoginController.getRole)
  .post('/', LoginMiddleware.validateLogin, LoginController.login);

export default loginRoute;
