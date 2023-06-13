import UserPassword from './UserPassword';
import UserEmail from './UserEmail';

export type LoginParams = {
  email: string;
  password: string;
};

export default class LoginInfo {
  private email: UserEmail;
  private password: UserPassword;

  constructor(params: LoginParams) {
    this.email = new UserEmail(params.email);
    this.password = new UserPassword(params.password);
  }

  getEmail() {
    return this.email.getValue();
  }

  getPassword() {
    return this.password.getValue();
  }
}
