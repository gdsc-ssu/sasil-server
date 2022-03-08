import { Model, DataTypes, Sequelize } from '@sequelize/core';

class ExpComment extends Model {
  static initModel(sequelize: Sequelize) {
    return ExpComment.init(
      {
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        parentId: {
          type: DataTypes.STRING(30),
        },
      },
      {
        modelName: 'exp_comment',
        tableName: 'exp_comment',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.ExpComment.belongsTo(models.User);
    models.ExpComment.belongsTo(models.Experiment);
  }
}

export default ExpComment;
