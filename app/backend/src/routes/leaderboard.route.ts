import { Router } from 'express';
import { LeaderboardController } from '../controllers';
// import { AuthenticationMiddleware, LoginMiddleware } from '../middlewares';

const leaderboardRoute = Router();

leaderboardRoute.get('/', LeaderboardController.listAllLeaderboard)
  .get('/home', LeaderboardController.listHomeLeaderboard)
  .get('/away', LeaderboardController.listAwayLeaderboard);

export default leaderboardRoute;
