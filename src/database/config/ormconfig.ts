import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';

dotenv.config();

interface ormconfigType {
  dev: ConnectionOptions;
  prod: ConnectionOptions;
}

const ormconfig: ormconfigType = {
  dev: {
    type: 'mysql',
    host: process.env.DEV_DB_HOST,
    port: Number(DEV_SETTING.db.port),
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: DEV_SETTING.db.database,
    synchronize: true,
    logging: false,
    entities: ['src/database/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/database/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/database/entity',
      migrationsDir: 'src/database/migration',
      subscribersDir: 'src/database/subscriber',
    },
  },
  prod: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(PROD_SETTING.db.port),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: PROD_SETTING.db.database,
    synchronize: true,
    logging: false,
    entities: ['src/database/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/database/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/database/entity',
      migrationsDir: 'src/database/migration',
      subscribersDir: 'src/database/subscriber',
    },
  },
};

export default ormconfig;
