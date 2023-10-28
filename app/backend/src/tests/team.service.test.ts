import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as chaiAsPromised from 'chai-as-promised';
import TeamModel from '../database/models/Team';
import { TeamService } from '../services';
import { TeamAtributes } from '../Interfaces/team';

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const { expect } = chai;

const teamsMock: TeamAtributes[] = [
  { id: 1, teamName: 'teamOne'},
  { id: 2, teamName: 'teamTwo'},
];

describe('Team Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('findAll', () => {
    describe('if database is empty', () => {
      it('returns an empty array', async () => {
        // arrange
        sinon.stub(TeamModel, 'findAll').resolves([]);
        // act
        const teams = await TeamService.findAll();
        // assert
        expect(teams).to.be.deep.equal([]);
      });
    });

    describe('if database is not empty', () => {
      it('returns an array of teams', async () => {
        // arrange
        sinon.stub(TeamModel, 'findAll').resolves(teamsMock as unknown as TeamModel[]);
        // act
        const teams = await TeamService.findAll();
        // assert
        expect(teams).to.be.deep.equal(teamsMock);
      });
    });
  });

  describe('findById', () => {
    describe('given a invalid id', () => {
      it('throws "Team not found" error', async () => {
        // arrange
        sinon.stub(TeamModel, 'findOne').resolves(undefined);
        // act & assert
        await expect(TeamService.findById(999999999999))
          .to.be.rejectedWith('There is no team with such id!');
      });
    });

    describe('given a valid id', () => {
      it('returns a team', async () => {
        // arrange
        sinon.stub(TeamModel, 'findOne').resolves(teamsMock[1]  as unknown as TeamModel);
        // act
        const team = await TeamService.findById(1);
        // assert
        expect(team).to.be.deep.equal(teamsMock[1]);
      });
    });
  });
});