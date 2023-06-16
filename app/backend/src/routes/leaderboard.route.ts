import { Router } from 'express';
import { LeaderboardController } from '../controllers';
// import { AuthenticationMiddleware, LoginMiddleware } from '../middlewares';

const leaderboardRoute = Router();

leaderboardRoute.get('/home', LeaderboardController.listHomePerformance);

export default leaderboardRoute;
