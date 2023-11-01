import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as chaiAsPromised from 'chai-as-promised';
import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';
import { MatchService } from '../services';
import { MatchAtributes, MatchCreationalAtributes } from '../Interfaces/match';

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const { expect } = chai;

const matchesMock: MatchAtributes[] = [
  { id: 1, homeTeamId: 1, awayTeamId: 2, inProgress: true, homeTeamGoals: 0, awayTeamGoals: 0 },
  { id: 2, homeTeamId: 3, awayTeamId: 4, inProgress: false, homeTeamGoals: 2, awayTeamGoals: 1 },
];

describe('Match Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createMatch', () => { 
    it('should throw "Team not found" error if any provided ids are invalid' , async () => {
      // Arrange
      const matchData: MatchCreationalAtributes = {
        homeTeamId: 0,
        awayTeamId: 999999999999,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
      };

      sinon.stub(TeamModel, 'findByPk').resolves(null);

      // act & assert
      await expect(MatchService.createMatch(matchData as unknown as MatchCreationalAtributes))
        .to.be.rejectedWith('There is no team with such id!');
      });
    });

    it('should create a new match if both homeTeamId and awayTeamId existes', async () => {
      // Arrange
      const matchData: MatchCreationalAtributes = {
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      };

      sinon.stub(TeamModel, 'findByPk').resolves(matchesMock[0] as unknown as MatchModel);
      sinon.stub(MatchModel, 'create').resolves(matchesMock[0] as unknown as MatchModel);

      // Act
      const newMatch = await MatchService.createMatch(matchData as unknown as MatchCreationalAtributes);

      // Assert
      expect(newMatch).to.deep.equal(matchesMock[0]);
    });

  describe('findAll', () => {
    it('should return an empty array if database is empty', async () => {
      sinon.stub(MatchModel, 'findAll').resolves([]);
      const matches = await MatchService.findAll();
      expect(matches).to.be.deep.equal([]);
    });

    it('should return an array of matches if database is not empty', async () => {
      sinon.stub(MatchModel, 'findAll').resolves(matchesMock as unknown as MatchModel[]);
      const matches = await MatchService.findAll();
      expect(matches).to.be.deep.equal(matchesMock);
    });
  });

  describe('findByProgress', () => {
    it('should return an empty array if database is empty', async () => {
      sinon.stub(MatchModel, 'findAll').resolves([]);
      const matches = await MatchService.findByProgress(false);
      expect(matches).to.be.deep.equal([]);
    });

    it('should return an array of matches based on the match progress if database is not empty', async () => {
      // Filter the matches based on progress
      const matchesWithProgress = matchesMock.filter(
        (match) => match.inProgress === true
      );
      sinon.stub(MatchModel, 'findAll').resolves(matchesWithProgress as unknown as MatchModel[]);
      const matches = await MatchService.findByProgress(true);
      expect(matches).to.be.deep.equal(matchesWithProgress);
    });
  });

  describe('finishById', () => {
    it('should throw "Match not found" error if na invalid match id is provided', async () => {
      sinon.stub(MatchModel, 'findByPk').resolves(null);

      await expect(MatchService.finishById(9999999))
        .to.be.rejectedWith('There is no match with such id!');
    });

    it('returns true when a match is successfully finished', async () => {
      const matchInstance: any = {
        id: 1, // Include any necessary attributes
        inProgress: true,
        save: sinon.stub().resolves(true),
      };

      sinon.stub(MatchModel, 'findByPk').resolves(matchInstance);

      const result = await MatchService.finishById(1);

      expect(result).to.be.true;
      expect(matchInstance.save.calledOnce).to.be.true;
    });
  });

  describe('updateById', () => {
    it('should throw "Match not found" error if an invalid match id is provided', async () => {
      sinon.stub(MatchModel, 'findByPk').resolves(null);

      await expect(MatchService.updateById(9999999, 1, 2))
        .to.be.rejectedWith('There is no match with such id!');
    });

    it('should throw "Match is already finished" error if updating a finished match', async () => {
      const finishedMatch: any = {
        id: 1,
        inProgress: false,
        save: sinon.stub().resolves(true),
      };

      sinon.stub(MatchModel, 'findByPk').resolves(finishedMatch);

      await expect(MatchService.updateById(1, 2, 3))
        .to.be.rejectedWith('Match is already finished');
    });

    it('should successfully update the match and return true', async () => {
      const matchToUpdate: any = {
        id: 1,
        inProgress: true,
        homeTeamGoals: 1,
        awayTeamGoals: 2,
        save: sinon.stub().resolves(true),
      };

      sinon.stub(MatchModel, 'findByPk').resolves(matchToUpdate);

      const result = await MatchService.updateById(1, 3, 4);

      expect(result).to.be.true;
      expect(matchToUpdate.homeTeamGoals).to.equal(3);
      expect(matchToUpdate.awayTeamGoals).to.equal(4);
      expect(matchToUpdate.save.calledOnce).to.be.true;
    });
  });
});
