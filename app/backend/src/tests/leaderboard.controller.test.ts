import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app'; // Assuming 'app' is your Express application
import LeaderboardController from '../controllers/leaderboard.controller';
import { MatchService } from '../services';
import statusCodes from '../statusCodes';
import { MatchQueryInterface } from '../Interfaces/match';
import { IPerformance } from '../Interfaces/performance';

chai.use(chaiHttp);

const { expect } = chai;

const mockMatches: MatchQueryInterface[] = [
  {
    id: 1,
    homeTeamId: 1,
    homeTeamGoals: 2,
    awayTeamId: 2,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: { teamName: 'Team A' },
    awayTeam: { teamName: 'Team B' },
  },
  {
    id: 2,
    homeTeamId: 3,
    homeTeamGoals: 0,
    awayTeamId: 1,
    awayTeamGoals: 3,
    inProgress: false,
    homeTeam: { teamName: 'Team C' },
    awayTeam: { teamName: 'Team A' },
  },
  {
    id: 3,
    homeTeamId: 4,
    homeTeamGoals: 1,
    awayTeamId: 5,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: { teamName: 'Team D' },
    awayTeam: { teamName: 'Team E' },
  },
  {
    id: 4,
    homeTeamId: 6,
    homeTeamGoals: 2,
    awayTeamId: 7,
    awayTeamGoals: 4,
    inProgress: false,
    homeTeam: { teamName: 'Team F' },
    awayTeam: { teamName: 'Team G' },
  },
  {
    id: 5,
    homeTeamId: 8,
    homeTeamGoals: 3,
    awayTeamId: 9,
    awayTeamGoals: 3,
    inProgress: false,
    homeTeam: { teamName: 'Team H' },
    awayTeam: { teamName: 'Team I' },
  },
  {
    id: 6,
    homeTeamId: 10,
    homeTeamGoals: 2,
    awayTeamId: 11,
    awayTeamGoals: 0,
    inProgress: false,
    homeTeam: { teamName: 'Team J' },
    awayTeam: { teamName: 'Team K' },
  },
  {
    id: 7,
    homeTeamId: 12,
    homeTeamGoals: 1,
    awayTeamId: 13,
    awayTeamGoals: 2,
    inProgress: false,
    homeTeam: { teamName: 'Team L' },
    awayTeam: { teamName: 'Team M' },
  },
];

const expectedHomeLeaderboard: IPerformance[] = [
  {
    name: 'Team J',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 0,
    goalsBalance: 2,
    efficiency: '100.00'
  },
  {
    name: 'Team A',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 1,
    goalsBalance: 1,
    efficiency: '100.00'
  },
  {
    name: 'Team H',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 3,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team D',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team L',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: '0.00'
  },
  {
    name: 'Team F',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 2,
    goalsOwn: 4,
    goalsBalance: -2,
    efficiency: '0.00'
  },
  {
    name: 'Team C',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 0,
    goalsOwn: 3,
    goalsBalance: -3,
    efficiency: '0.00'
  }
];

const expectedAwayLeaderboard: IPerformance[] = [
  {
    name: 'Team A',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 0,
    goalsBalance: 3,
    efficiency: '100.00'
  },
  {
    name: 'Team G',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 4,
    goalsOwn: 2,
    goalsBalance: 2,
    efficiency: '100.00'
  },
  {
    name: 'Team M',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 1,
    goalsBalance: 1,
    efficiency: '100.00'
  },
  {
    name: 'Team I',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 3,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team E',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team B',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: '0.00'
  },
  {
    name: 'Team K',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 0,
    goalsOwn: 2,
    goalsBalance: -2,
    efficiency: '0.00'
  }
];

const expectedGeneralLeaderboard: IPerformance[] = [
  {
    name: 'Team A',
    totalPoints: 6,
    totalGames: 2,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 5,
    goalsOwn: 1,
    goalsBalance: 4,
    efficiency: '100.00'
  },
  {
    name: 'Team G',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 4,
    goalsOwn: 2,
    goalsBalance: 2,
    efficiency: '100.00'
  },
  {
    name: 'Team J',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 0,
    goalsBalance: 2,
    efficiency: '100.00'
  },
  {
    name: 'Team M',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 1,
    goalsBalance: 1,
    efficiency: '100.00'
  },
  {
    name: 'Team H',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 3,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team I',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 3,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team D',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team E',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: '33.33'
  },
  {
    name: 'Team B',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: '0.00'
  },
  {
    name: 'Team L',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: '0.00'
  },
  {
    name: 'Team F',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 2,
    goalsOwn: 4,
    goalsBalance: -2,
    efficiency: '0.00'
  },
  {
    name: 'Team K',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 0,
    goalsOwn: 2,
    goalsBalance: -2,
    efficiency: '0.00'
  },
  {
    name: 'Team C',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 0,
    goalsOwn: 3,
    goalsBalance: -3,
    efficiency: '0.00'
  }
];



describe('LeaderboardController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('listHomeLeaderboard', () => {
    it('should return the home leaderboard', async () => {
      // Arrange: Stub the MatchService.findByProgress method to return mock data
      sinon.stub(MatchService, 'findByProgress').resolves(mockMatches);

      // Act: Make a request to the controller's listHomeLeaderboard method
      const response = await chai.request(app).get('/leaderboard/home');

      // Assert: Check that the response is successful and contains the expected data
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body).to.deep.equal(expectedHomeLeaderboard);
    });
  });

  describe('listAwayLeaderboard', () => {
    it('should return the away leaderboard', async () => {
      // Arrange: Stub the MatchService.findByProgress method to return mock data
      sinon.stub(MatchService, 'findByProgress').resolves(mockMatches);

      // Act: Make a request to the controller's listAwayLeaderboard method
      const response = await chai.request(app).get('/leaderboard/away');

      // Assert: Check that the response is successful and contains the expected data
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body).to.deep.equal(expectedAwayLeaderboard);
    });
  });

  describe('listAllLeaderboard', () => {
    it('should return the general leaderboard', async () => {
      // Arrange: Stub the MatchService.findByProgress method to return mock data
      sinon.stub(MatchService, 'findByProgress').resolves(mockMatches);

      // Act: Make a request to the controller's listAllLeaderboard method
      const response = await chai.request(app).get('/leaderboard');

      // Assert: Check that the response is successful and contains the expected data
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body).to.deep.equal(expectedGeneralLeaderboard);
    });
  });
});
