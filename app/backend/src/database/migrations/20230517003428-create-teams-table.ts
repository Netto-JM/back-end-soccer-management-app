import { Model, QueryInterface, DataTypes } from 'sequelize';
import { TeamAtributes } from '../../Interfaces/team';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<TeamAtributes>>('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'team_name',
      },
    });
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams');
  }
};
