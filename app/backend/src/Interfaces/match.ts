export interface MatchAtributes {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface MatchQueryInterface extends MatchAtributes {
  homeTeam: { teamName: string };
  awayTeam: { teamName: string };
}

export type MatchCreationalAtributes = Omit<MatchAtributes, 'id' | 'inProgress'> & {
  inProgress?: true;
};
