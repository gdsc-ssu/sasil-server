import { Model, DataTypes, Sequelize } from '@sequelize/core';

class Notification extends Model {
  static initModel(sequelize: Sequelize) {
    return Notification.init(
      {
        notiType: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        postId: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        postType: {
          type: DataTypes.ENUM('exp', 'comm'),
          allowNull: false,
        },
      },
      {
        modelName: 'notification',
        tableName: 'notification',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.Notification.belongsTo(models.User, { as: 'sender' });
    models.Notification.belongsTo(models.User, { as: 'receiver' });
  }
}

export default Notification;
