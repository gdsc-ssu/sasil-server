import { Sequelize } from 'sequelize';

import config from '@/database/config/config';

type EnvType = 'production' | 'test' | 'development';
type DBType = {
  [key: string]: any;
};

const env = (process.env.NODE_ENV as EnvType) || 'development';

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env],
);

const db: DBType = {};

Object.keys(db).forEach((model) => {
  db[model].initModel(sequelize);
});

Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
