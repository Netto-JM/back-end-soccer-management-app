export interface TeamAtributes {
  id: number;
  teamName: string;
}

export type TeamCreationalAtributes = Omit<TeamAtributes, 'id'>;
