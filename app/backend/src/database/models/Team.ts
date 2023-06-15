import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';
import { TeamAtributes, TeamCreationalAtributes } from '../../Interfaces/team';

class Team extends Model<TeamAtributes, TeamCreationalAtributes> implements TeamAtributes {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  teamName: {
    type: STRING(30),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default Team;
