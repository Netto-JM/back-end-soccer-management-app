import { Router } from 'express';
import { LeaderboardController } from '../controllers';

const leaderboardRoute = Router();

leaderboardRoute.get('/', LeaderboardController.listAllLeaderboard)
  .get('/home', LeaderboardController.listHomeLeaderboard)
  .get('/away', LeaderboardController.listAwayLeaderboard);

export default leaderboardRoute;
