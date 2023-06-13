import AuthenticationError from '../errors/AuthenticationError';

export default class UserPassword {
  static minLength = 6;

  constructor(
    private value: string,
  ) {
    if (value.length < UserPassword.minLength) {
      throw new AuthenticationError('Invalid email or password');
    }
  }

  getValue() {
    return this.value;
  }
}
