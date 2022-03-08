import { Model, DataTypes, Sequelize } from '@sequelize/core';

class User extends Model {
  static initModel(sequelize: Sequelize) {
    return User.init(
      {
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        profile: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: 'user',
        tableName: 'user',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.User.hasMany(models.Experiment);
    models.User.hasMany(models.Commission);
    models.User.hasMany(models.CommComment);
    models.User.hasMany(models.ExpComment);
    models.User.belongsToMany(models.Experiment, {
      through: 'exp_bookmark',
      as: 'ExpBookmark_Exp',
    });
    models.User.belongsToMany(models.Commission, {
      through: 'comm_bookmark',
      as: 'CommBookmark_Comm',
    });
    models.User.belongsToMany(models.Experiment, {
      through: 'exp_like',
      as: 'ExpLike_Exp',
    });
    models.User.belongsToMany(models.Commission, {
      through: 'comm_like',
      as: 'CommLike_Comm',
    });
  }
}

export default User;
