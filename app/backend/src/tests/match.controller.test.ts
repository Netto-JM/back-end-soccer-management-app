import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { MatchService } from '../services';
import MatchModel from '../database/models/Match';
import { MatchAtributes, MatchCreationalAtributes } from '../Interfaces/match';
import statusCodes from '../statusCodes';
import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';
import { TokenPayload } from '../Interfaces/tokenPayload';
import jwtService from '../utils/auth';

chai.use(chaiHttp);

const { expect } = chai;

const matchesMock: MatchAtributes[] = [
  { id: 1, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 0, awayTeamGoals: 0 },
  { id: 2, homeTeamId: 3, awayTeamId: 4, inProgress: false, homeTeamGoals: 2, awayTeamGoals: 1 },
];

describe('Match Controller', () => {
  beforeEach(() => {
    // Stub jwtService's validateToken to return a valid role
    sinon.stub(jwtService, 'validateToken').returns({ role: 'user' } as unknown as TokenPayload);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('listAll', () => {
    it('should return an array of matches', async () => {
      // Arrange: Stub the MatchService's findAll method to return a mock array of matches
      
      sinon.stub(MatchModel, 'findAll').resolves(matchesMock as unknown as MatchModel[]);

      // Act: Make a request to the controller's listAll method
      const response = await chai
        .request(app)
        .get('/matches')

      // Assert: Check the response status code and data
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body).to.be.deep.equal(matchesMock);
    });
  });

  describe('finishMatch', () => {
    it('should return a success message when finishing a match', async () => {
      // Arrange: Stub the MatchService's finishById method to succeed
      sinon.stub(MatchModel, 'findByPk').resolves(matchesMock[0] as unknown as MatchModel);
      sinon.stub(MatchService, 'finishById').resolves();

      // Act: Make a request to the controller's finishMatch method with a valid match ID
      const matchId = 1;
      const response = await chai
        .request(app)
        .patch(`/matches/${matchId}/finish`)
        .set('Authorization', 'validtoken');

      // Assert: Check the response status code and message
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body.message).to.equal('Finished');
    });

    it('should return a 404 error for an invalid match ID', async () => {
      // Arrange: Stub the MatchService's finishById method to throw a NotFoundError
      sinon.stub(MatchService, 'finishById').throws(new NotFoundError('There is no match with such id!'));

      // Act: Make a request to the controller's finishMatch method with an invalid match ID
      const matchId = 999;
      const response = await chai
        .request(app)
        .patch(`/matches/${matchId}/finish`)
        .set('Authorization', 'validtoken');

      // Assert: Check that the response is a 404 error
      expect(response).to.have.status(404);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('There is no match with such id!');
    });

    it('should return a 400 error when trying to finish an already finished match', async () => {
      // Arrange: Stub the MatchService's finishById method to throw a ValidationError
      sinon.stub(MatchService, 'finishById').throws(new ValidationError('Match is already finished'));

      // Act: Make a request to the controller's finishMatch method with a finished match ID
      const matchId = 2;
      const response = await chai
        .request(app)
        .patch(`/matches/${matchId}/finish`)
        .set('Authorization', 'validtoken');

      // Assert: Check that the response is a 400 error
      expect(response).to.have.status(400);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('Match is already finished');
    });
  });

  describe('updateMatch', () => {
    it('should return a success message when updating a match', async () => {
      // Arrange: Stub the MatchService's updateById method to succeed
      sinon.stub(MatchModel, 'findByPk').resolves(matchesMock[0] as unknown as MatchModel);
      sinon.stub(MatchService, 'updateById').resolves();

      // Act: Make a request to the controller's updateMatch method with valid data
      const matchId = 1;
      const updateData = { homeTeamGoals: 2, awayTeamGoals: 1 };
      const response = await chai.request(app)
        .patch(`/matches/${matchId}`)
        .send(updateData)
        .set('Authorization', 'validtoken');

      // Assert: Check the response status code and message
      expect(response).to.have.status(statusCodes.ok);
      expect(response.body.message).to.equal('Match updated');
    });

    it('should return a 404 error for an invalid match ID', async () => {
      // Arrange: Stub the MatchService's finishById method to throw a NotFoundError
      sinon.stub(MatchService, 'updateById').throws(new NotFoundError('There is no match with such id!'));

      // Act: Make a request to the controller's updateMatch method with an invalid match ID
      const matchId = 999;
      const updateData = { homeTeamGoals: 2, awayTeamGoals: 1 };
      const response = await chai.request(app)
        .patch(`/matches/${matchId}`)
        .send(updateData)
        .set('Authorization', 'validtoken');

      // Assert: Check that the response is a 404 error
      expect(response).to.have.status(404);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('There is no match with such id!');
    });

    it('should return a 400 error when trying to update an already finished match', async () => {
      // Arrange: Stub the MatchService's updateById method to throw a ValidationError
      sinon.stub(MatchService, 'updateById').throws(new ValidationError('Match is already finished'));

      // Act: Make a request to the controller's updateMatch method with a finished match ID
      const matchId = 2;
      const updateData = { homeTeamGoals: 2, awayTeamGoals: 1 };
      const response = await chai.request(app)
        .patch(`/matches/${matchId}`)
        .send(updateData)
        .set('Authorization', 'validtoken');

      // Assert: Check that the response is a 400 error
      expect(response).to.have.status(400);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('Match is already finished');
    });
  });

  describe('createMatch', () => {
    it('should create a new match and return it with a status of 201', async () => {
      // Arrange: Stub the MatchService's createMatch method to succeed
      const matchData: MatchCreationalAtributes = {
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      };
      sinon.stub(MatchService, 'createMatch').resolves(matchesMock[0] as unknown as MatchModel);

      // Act: Make a request to the controller's createMatch method with valid data
      const response = await chai.request(app)
        .post('/matches')
        .send(matchData)
        .set('Authorization', 'validtoken');

      // Assert: Check the response status code and data
      expect(response).to.have.status(statusCodes.created);
      expect(response.body).to.be.deep.equal(matchesMock[0]);
    });

    it('should return a 404 error for an invalid team ID', async () => {
    
      // Arrange: Stub the MatchService's createMatch method to throw an error
      const matchData: MatchCreationalAtributes = {
        homeTeamId: 0,
        awayTeamId: 999999999999,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
      };
      sinon.stub(MatchService, 'createMatch').rejects(new NotFoundError('There is no team with such id!'));

      // Act: Make a request to the controller's createMatch method with invalid team IDs
      const response = await chai.request(app)
        .post('/matches')
        .send(matchData)
        .set('Authorization', 'validtoken');

      // Assert: Check that the response is a 404 error
      expect(response).to.have.status(404);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('There is no team with such id!');
    });
  });
});
