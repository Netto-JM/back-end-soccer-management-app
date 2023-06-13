import { Response, Request } from 'express';
import { LoginService } from '../services';
import statusCodes from '../statusCodes';
import LoginInfo from '../entities/LoginInfo';
import { AuthenticatedRequest } from '../middlewares/AuthenticationMiddleware';

class LoginController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const loginInfo: LoginInfo = new LoginInfo({ email, password });

    const token: string = await LoginService.login(loginInfo);

    return res.status(statusCodes.ok).json({ token });
  }

  public static async getRole(req: AuthenticatedRequest, res: Response) {
    return res.status(statusCodes.ok).json({ role: req.role });
  }
}

export default LoginController;
