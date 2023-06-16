import { Response, Request } from 'express';
import { MatchService } from '../services';
import statusCodes from '../statusCodes';
import { MatchAtributes, MatchCreationalAtributes } from '../Interfaces/match';

class MatchController {
  public static async listAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    const matches = inProgress ? await MatchService.findByProgress(inProgress === 'true')
      : await MatchService.findAll();

    return res.status(statusCodes.ok).json(matches);
  }

  public static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    MatchService.finishById(+id);

    return res.status(statusCodes.ok).json({ message: 'Finisshed' });
  }

  public static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    MatchService.updateById(+id, +homeTeamGoals, +awayTeamGoals);

    return res.status(statusCodes.ok).json({ message: 'Match updated' });
  }

  public static async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    const matchData: MatchCreationalAtributes = {
      homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress: true,
    };

    const match: MatchAtributes = await MatchService.createMatch(matchData);

    return res.status(statusCodes.created).json(match);
  }
}

export default MatchController;
