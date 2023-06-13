import bcrypt = require('bcryptjs');
import UserModel from '../database/models/User';
import LoginInfo from '../entities/LoginInfo';
import AuthenticationError from '../errors/AuthenticationError';
import jwtService from '../utils/auth';

export default class LoginService {
  public static async login(loginInfo: LoginInfo): Promise<string> {
    const email = loginInfo.getEmail();
    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) throw new AuthenticationError('Invalid email or password');

    const isValidPassword = bcrypt.compareSync(loginInfo.getPassword(), user.password);

    if (!isValidPassword) throw new AuthenticationError('Invalid email or password');

    const token = jwtService.generateToken({ email, role: user.role });

    return token;
  }
}
