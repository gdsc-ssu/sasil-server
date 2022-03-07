import { Sequelize } from 'sequelize';

import config from '@/database/config/config';
import Commission from './commission';
import CommCategory from './comm-category';
import CommComment from './comm-comment';
import Experiment from './experiment';
import ExpCategory from './exp-category';
import ExpComment from './exp-comment';
import Notification from './notification';
import User from './user';

type EnvType = 'production' | 'test' | 'development';
type DBType = {
  [key: string]: any; // 추가해야함!
};

const env = (process.env.NODE_ENV as EnvType) || 'development';

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env],
);

const models: DBType = {
  Commission,
  CommCategory,
  CommComment,
  Experiment,
  ExpCategory,
  ExpComment,
  Notification,
  User,
};

Object.keys(models).forEach((model) => {
  models[model].initModel(sequelize);
});

Object.keys(models).forEach((model) => {
  if (models[model].associate) {
    models[model].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
