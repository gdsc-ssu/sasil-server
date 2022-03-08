import { Sequelize } from '@sequelize/core';

import config from '@/database/config/config';
import Commission from './commission';
import Category from './category';
import CommComment from './comm-comment';
import Experiment from './experiment';
import ExpComment from './exp-comment';
import Notification from './notification';
import User from './user';

type EnvType = 'production' | 'test' | 'development';

const env = (process.env.NODE_ENV as EnvType) || 'development';

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env],
);

const models: any = {
  Commission,
  Category,
  CommComment,
  Experiment,
  ExpComment,
  Notification,
  User,
};

const modelKeys = Object.keys(models) as Array<keyof typeof models>;

modelKeys.forEach((model) => {
  models[model].initModel(sequelize);
});

modelKeys.forEach((model) => {
  if (models[model].associate) {
    models[model].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
