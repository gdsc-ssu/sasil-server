import { Model, DataTypes, Sequelize } from '@sequelize/core';

class Commission extends Model {
  static initModel(sequelize: Sequelize) {
    return Commission.init(
      {
        title: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        thumbnail: {
          type: DataTypes.STRING(200),
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        modelName: 'commission',
        tableName: 'commission',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.Commission.belongsTo(models.User);
    models.Commission.hasMany(models.Experiment);
    models.Commission.hasMany(models.CommComment);
    models.Commission.belongsToMany(models.User, {
      through: 'comm_bookmark',
      as: 'CommBookmark_User',
    });
    models.Commission.belongsToMany(models.User, {
      through: 'comm_like',
      as: 'CommLike_User',
    });
    models.Commission.belongsToMany(models.Category, {
      through: 'comm_category',
    });
  }
}

export default Commission;
