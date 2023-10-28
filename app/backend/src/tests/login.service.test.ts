import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import LoginService from '../services/login.service';
import UserModel from '../database/models/User';
import jwtService from '../utils/auth';
import LoginInfo from '../entities/LoginInfo';
import * as chaiAsPromised from 'chai-as-promised';
import { UserAttributes } from '../../src/Interfaces/user';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('LoginService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should return a token for a valid user', async () => {
      // Arrange: Stub the UserModel's findOne method to return a mock user
      const id = 1;
      const username = 'validuser';
      const email = 'validuser@example.com';
      const password = 'validpassword';
      const user: UserAttributes   = {
        id,
        username,
        email,
        password: bcrypt.hashSync(password, 10), // Hash the password
        role: 'user',
      };
      sinon.stub(UserModel, 'findOne').resolves(user as unknown as UserModel);

      // Stub the bcrypt.compareSync method to always return true for password comparison
      sinon.stub(bcrypt, 'compareSync').returns(true);

      // Stub the jwtService's generateToken method to return a mock token
      sinon.stub(jwtService, 'generateToken').returns('mocktoken');

      const loginInfo = new LoginInfo({
        email: 'validuser@example.com',
        password: 'validpassword',
      });

      // Act: Attempt to log in with valid credentials
      const token = await LoginService.login(loginInfo);

      // Assert: Check that a valid token is returned
      expect(token).to.equal('mocktoken');
    });

    it('should throw an AuthenticationError for an invalid email', async () => {
      // Arrange: Stub the UserModel's findOne method to return null (user not found)
      sinon.stub(UserModel, 'findOne').resolves(null);

      const loginInfo = new LoginInfo({
        email: 'invaliduser@example.com',
        password: 'validpassword',
      });

      // Act & Assert: Attempt to log in with an invalid email and check for an AuthenticationError
      await expect(LoginService.login(loginInfo)).to.be.rejectedWith('Invalid email or password');
    });

    it('should throw an AuthenticationError for an invalid password', async () => {
      // Arrange: Stub the UserModel's findOne method to return a mock user
      const id = 1;
      const username = 'validuser';
      const email = 'validuser@example.com';
      const password = 'invalidpassword';
      const user: UserAttributes = {
        id,
        username,
        email,
        password: bcrypt.hashSync(password, 10), // Hash the password
        role: 'user',
      };
      sinon.stub(UserModel, 'findOne').resolves(user as unknown as UserModel);

      // Stub the bcrypt.compareSync method to return false for password comparison
      sinon.stub(bcrypt, 'compareSync').returns(false);

      const loginInfo = new LoginInfo({
        email: 'validuser@example.com',
        password: 'invalidpassword',
      });

      // Act & Assert: Attempt to log in with an invalid password and check for an AuthenticationError
      await expect(LoginService.login(loginInfo)).to.be.rejectedWith('Invalid email or password');
    });
  });
});
