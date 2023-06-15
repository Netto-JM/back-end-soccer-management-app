import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import { MatchAtributes, MatchCreationalAtributes } from '../../Interfaces/match';

import Team from './Team';

class Match extends Model<MatchAtributes, MatchCreationalAtributes> implements MatchAtributes {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Match.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  homeTeamId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Match.belongsTo(Team, {
  foreignKey: 'homeTeamId', as: 'homeTeam',
});

Team.hasMany(Match, {
  foreignKey: 'homeTeamId', as: 'homeMatch',
});

Match.belongsTo(Team, {
  foreignKey: 'awayTeamId', as: 'awayTeam',
});

Team.hasMany(Match, {
  foreignKey: 'awayTeamId', as: 'awayMatch',
});

export default Match;
