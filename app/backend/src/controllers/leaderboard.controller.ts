import { Response, Request } from 'express';
import { MatchService } from '../services';
import statusCodes from '../statusCodes';
import { MatchQueryInterface } from '../Interfaces/match';
import { IPerformance, IUpdatePerfInfo } from '../Interfaces/performance';

class LeaderboardController {
  private static getPerformanceEmptyObject(name: string): IPerformance {
    const performance: IPerformance = {
      name,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '0',
    };

    return performance;
  }

  private static getPoints(goalsFavor: number, goalsOwn: number): number {
    if (goalsFavor > goalsOwn) return 3;
    if (goalsFavor < goalsOwn) return 0;
    return 1;
  }

  private static sortLeaderboard(perfA: IPerformance, perfB: IPerformance): number {
    if (perfA.totalPoints > perfB.totalPoints) return -1;
    if (perfA.totalPoints < perfB.totalPoints) return 1;
    if (perfA.totalVictories > perfB.totalVictories) return -1;
    if (perfA.totalVictories < perfB.totalVictories) return 1;
    if (perfA.goalsBalance > perfB.goalsBalance) return -1;
    if (perfA.goalsBalance < perfB.goalsBalance) return 1;
    if (perfA.goalsFavor > perfB.goalsFavor) return -1;
    if (perfA.goalsFavor < perfB.goalsFavor) return 1;
    return 0;
  }

  private static updateInfo(perfInfo: IUpdatePerfInfo, performance: IPerformance): IPerformance {
    const { name, goalsFavor, goalsOwn } = perfInfo;
    const matchPoints = LeaderboardController.getPoints(goalsFavor, goalsOwn);

    const updatedPerformance: IPerformance = {
      name,
      totalPoints: performance.totalPoints + matchPoints,
      totalGames: performance.totalGames + 1,
      totalVictories: performance.totalVictories + Number(goalsFavor > goalsOwn),
      totalDraws: performance.totalDraws + Number(goalsFavor === goalsOwn),
      totalLosses: performance.totalLosses + Number(goalsFavor < goalsOwn),
      goalsFavor: performance.goalsFavor + goalsFavor,
      goalsOwn: performance.goalsOwn + goalsOwn,
      goalsBalance: performance.goalsBalance + goalsFavor - goalsOwn,
      efficiency: performance.efficiency,
    };

    const { totalPoints, totalGames } = updatedPerformance;

    updatedPerformance.efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return updatedPerformance;
  }

  public static async listHomePerformance(_req: Request, res: Response) {
    const matches = await MatchService.findByProgress(false) as MatchQueryInterface[];

    const initialValue: IPerformance[] = [];

    const leaderboard = matches.reduce((acc, match) => {
      const { homeTeam: { teamName: name } } = match;
      const { homeTeamGoals: goalsFavor, awayTeamGoals: goalsOwn } = match;
      const perfInfo: IUpdatePerfInfo = { name, goalsFavor, goalsOwn };
      if (!acc.some((performance) => performance.name === name)) {
        acc[acc.length] = LeaderboardController.getPerformanceEmptyObject(name);
      }
      const currentIndex = acc.findIndex((performance) => performance.name === name);
      acc[currentIndex] = LeaderboardController.updateInfo(perfInfo, acc[currentIndex]);
      return acc;
    }, initialValue);

    const sortedLeaderboard = leaderboard.sort(LeaderboardController.sortLeaderboard);

    return res.status(statusCodes.ok).json(sortedLeaderboard);
  }
}

export default LeaderboardController;
