import * as Joi from 'joi';
import AuthenticationError from '../errors/AuthenticationError';

export default class UserEmail {
  static emailSchema = Joi.string().email().required();

  constructor(
    private value: string,
  ) {
    const { error } = UserEmail.emailSchema.validate(value);
    if (error) {
      throw new AuthenticationError('Invalid email or password');
    }
  }

  getValue() {
    return this.value;
  }
}
