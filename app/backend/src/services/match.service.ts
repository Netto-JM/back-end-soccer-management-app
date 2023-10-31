import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';
import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';
import { MatchAtributes, MatchCreationalAtributes } from '../Interfaces/match';

export default class MatchService {
  public static async createMatch(match: MatchCreationalAtributes): Promise<MatchAtributes> {
    const homeTeam = await TeamModel.findByPk(match.homeTeamId);

    const awayTeam = await TeamModel.findByPk(match.awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new NotFoundError('There is no team with such id!');
    }

    const newMatch: MatchAtributes = await MatchModel.create(match);

    return newMatch;
  }

  public static async findAll(): Promise<MatchAtributes[]> {
    const matches = await MatchModel.findAll({
      include: [
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        }],
    });

    return matches;
  }

  public static async findByProgress(inProgress: boolean): Promise<MatchAtributes[]> {
    const matches = await MatchModel.findAll({
      where: { inProgress },
      include: [
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        }],
    });

    return matches;
  }

  public static async finishById(id: number): Promise<void> {
    const match = await MatchModel.findByPk(id);

    if (!match) {
      throw new NotFoundError(`Match with ID ${id} not found`);
    }

    match.inProgress = false;

    await match.save();
  }

  public static async updateById(id: number, homeGoals: number, awayGoals: number): Promise<void> {
    const match = await MatchModel.findByPk(id);

    if (!match) {
      throw new NotFoundError(`Match with ID ${id} not found`);
    }

    if (!match.inProgress) {
      throw new ValidationError('Match is already finished');
    }

    match.homeTeamGoals = homeGoals;
    match.awayTeamGoals = awayGoals;

    await match.save();
  }
}
