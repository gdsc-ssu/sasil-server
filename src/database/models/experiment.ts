import { Model, DataTypes, Sequelize } from '@sequelize/core';

class Experiment extends Model {
  static initModel(sequelize: Sequelize) {
    return Experiment.init(
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
        modelName: 'experiment',
        tableName: 'experiment',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.Experiment.belongsTo(models.User);
    models.Experiment.belongsTo(models.Commission);
    models.Experiment.hasMany(models.ExpComment);
    models.Experiment.belongsToMany(models.User, {
      through: 'exp_bookmark',
      as: 'ExpBookmark_User',
    });
    models.Experiment.belongsToMany(models.User, {
      through: 'exp_like',
      as: 'ExpLike_User',
    });
    models.Experiment.belongsToMany(models.Category, {
      through: 'exp_category',
    });
  }
}

export default Experiment;
