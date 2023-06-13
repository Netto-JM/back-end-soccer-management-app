import { Response, Request } from 'express';
import { TeamService } from '../services';
import statusCodes from '../statusCodes';

class TeamController {
  public static async listAll(_req: Request, res: Response) {
    const teams = await TeamService.findAll();

    return res.status(statusCodes.ok).json(teams);
  }

  public static async getById(req: Request, res: Response) {
    const { id } = req.params;

    const team = await TeamService.findById(+id);

    return res.status(statusCodes.ok).json(team);
  }
}

export default TeamController;
