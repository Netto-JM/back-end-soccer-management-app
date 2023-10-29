import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import TeamModel from '../database/models/Team';
import { TeamAtributes } from '../Interfaces/team';

chai.use(chaiHttp);

const { expect } = chai;

describe('Team Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('listAll', () => {
    it('should return an array of teams', async () => {
      // Arrange: Stub the TeamService's findAll method to return a mock array of teams
      const teamsMock: TeamAtributes[] = [
        { id: 1, teamName: 'teamOne'},
        { id: 2, teamName: 'teamTwo'},
      ];
      sinon.stub(TeamModel, 'findAll').resolves(teamsMock as unknown as TeamModel[]);

      // Act: Make a request to the controller's listAll method
      const response = await chai.request(app).get('/teams');

      // Assert: Check the response status code and data
      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equal(teamsMock);
    });
  });

  describe('getById', () => {
    it('should return a team by ID', async () => {
      // Arrange: Stub the TeamService's findById method to return a mock team
      const teamMock: TeamAtributes = {id: 1, teamName: 'teamOne'};
      sinon.stub(TeamModel, 'findByPk').resolves(teamMock as unknown as TeamModel);

      // Act: Make a request to the controller's getById method with a valid team ID
      const teamId = 1;
      const response = await chai.request(app).get(`/teams/${teamId}`);

      // Assert: Check the response status code and data
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(teamMock);
    });

    it('should return a 404 error for an invalid team ID', async () => {
      // Arrange: Stub the TeamService's findById method to return null (team not found)
      sinon.stub(TeamModel, 'findByPk').resolves(null);

      // Act: Make a request to the controller's getById method with an invalid team ID
      const teamId = 999;
      const response = await chai.request(app).get(`/teams/${teamId}`);

      // Assert: Check that the response is a 404 error
      expect(response).to.have.status(404);
      const responseBody = JSON.parse(response.text); // Parse the JSON response
      expect(responseBody.message).to.equal('There is no team with such id!');
    });
  });
});
