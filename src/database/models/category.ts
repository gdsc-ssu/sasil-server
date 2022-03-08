import { Model, DataTypes, Sequelize } from '@sequelize/core';

class Category extends Model {
  static initModel(sequelize: Sequelize) {
    return Category.init(
      {
        category: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
      },
      {
        modelName: 'category',
        tableName: 'category',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.Category.belongsToMany(models.Commission, {
      through: 'comm_category',
    });
    models.Category.belongsToMany(models.Experiment, {
      through: 'exp_category',
    });
  }
}

export default Category;
