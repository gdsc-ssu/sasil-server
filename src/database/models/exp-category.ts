import { Model, DataTypes, Sequelize } from 'sequelize';

class ExpCategory extends Model {
  static initModel(sequelize: Sequelize) {
    return ExpCategory.init(
      {
        category: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
      },
      {
        modelName: 'exp_category',
        tableName: 'exp_category',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.ExpCategory.belongsToMany(models.Experiment, {
      through: 'exp_category_rel',
    });
  }
}

export default ExpCategory;
