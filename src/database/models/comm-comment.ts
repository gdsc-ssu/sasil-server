import { Model, DataTypes, Sequelize } from '@sequelize/core';

class CommComment extends Model {
  static initModel(sequelize: Sequelize) {
    return CommComment.init(
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
        modelName: 'comm_comment',
        tableName: 'comm_comment',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.CommComment.belongsTo(models.User);
    models.CommComment.belongsTo(models.Commission);
  }
}

export default CommComment;
