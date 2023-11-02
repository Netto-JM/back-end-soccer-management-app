import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import LoginService from '../services/login.service';
import AuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import statusCodes from '../statusCodes';
import jwtService from '../utils/auth';
import AuthenticationError from '../errors/AuthenticationError';
import { TokenPayload } from '../Interfaces/tokenPayload';

chai.use(chaiHttp);

const { expect } = chai;

describe('LoginController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should return a token for a valid user', async () => {
      // Arrange: Stub the LoginService's login method to return a mock token
      sinon.stub(LoginService, 'login').resolves('mocktoken');

      // Create a valid LoginInfo object with email and password
      const loginInfo = {
        email: 'validuser@example.com',
        password: 'validpassword',
      };

      // Act: Make a request to the controller's login method with valid login data
      const response = await chai
        .request(app)
        .post('/login')
        .send(loginInfo);

      // Assert: Check that the response contains the token and has a 200 status
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.equal('mocktoken');
    });

    it('should return a 401 error for an invalid email or password', async () => {
      // Arrange: Stub the LoginService's login method to throw an AuthenticationError
      sinon.stub(LoginService, 'login').throws(new AuthenticationError('Invalid email or password'));

      // Create an invalid LoginInfo object with email and password
      const loginInfo = {
        email: 'invaliduser@example.com',
        password: 'invalidpassword',
      };

      // Act: Make a request to the controller's login method with invalid login data
      const response = await chai
        .request(app)
        .post('/login')
        .send(loginInfo);

      // Assert: Check that the response is a 401 error with the expected message
      expect(response).to.have.status(statusCodes.unauthorized);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('Invalid email or password');
    });
  });

  describe('getRole', () => {
    it('should return the user role with a valid token', async () => {
      // Arrange: Stub the AuthenticationMiddleware's authenticateUser method to set the role
      sinon.stub(AuthenticationMiddleware, 'authenticateUser').callsFake((req, _res, next) => {
        req.role = 'user';
        next();
      });

      // Stub jwtService's validateToken to return a valid role
      sinon.stub(jwtService, 'validateToken').returns({ role: 'user' } as unknown as TokenPayload);

      // Act: Make a request to the controller's getRole method with a valid token
      //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5ODU0MzQ4NywiZXhwIjoxNjk4NjI5ODg3fQ.UwntmzIKOvONmmIZla8yrh0qtSDMH1_B7Xc2XkQ661c'; // Replace with an actual valid JWT token
      
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', 'validtoken');

      // Assert: Check that the response contains the role and has a 200 status
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body).to.have.property('role');
      expect(response.body.role).to.equal('user');
    });

    it('should return a 401 error for an invalid token', async () => {
      // Arrange: Stub the AuthenticationMiddleware's authenticateUser method to throw an AuthenticationError
      sinon.stub(AuthenticationMiddleware, 'authenticateUser').throws(new AuthenticationError('Token must be a valid token'));

      // Act: Make a request to the controller's getRole method with an invalid token
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', 'invalidtoken');

      // Assert: Check that the response is a 401 error with the expected message
      expect(response).to.have.status(statusCodes.unauthorized);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('Token must be a valid token');
    });
  });
});
