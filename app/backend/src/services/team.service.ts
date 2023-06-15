import NotFoundError from '../errors/NotFoundError';
import TeamModel from '../database/models/Team';
import { TeamAtributes } from '../Interfaces/team';

export default class TeamService {
  public static async findAll(): Promise<TeamAtributes[]> {
    const teams = await TeamModel.findAll();

    return teams;
  }

  public static async findById(id: number): Promise<TeamAtributes> {
    const team = await TeamModel.findByPk(id);

    if (team) return team;
    throw new NotFoundError('There is no team with such id!');
  }
}
