import { Model, DataTypes, Sequelize } from 'sequelize';

class CommCategory extends Model {
  static initModel(sequelize: Sequelize) {
    return CommCategory.init(
      {
        category: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
      },
      {
        modelName: 'comm_category',
        tableName: 'comm_category',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      },
    );
  }

  static associate(models: any) {
    models.CommCategory.belongsToMany(models.Commission, {
      through: 'comm_category_rel',
    });
  }
}

export default CommCategory;
