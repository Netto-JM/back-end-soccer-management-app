export interface IPerformance {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}

export interface IUpdatePerfInfo {
  name: string,
  goalsFavor: number,
  goalsOwn: number,
}
