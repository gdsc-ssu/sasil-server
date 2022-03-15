import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

import {
  DEV_DB_HOST,
  DEV_DB_PORT,
  DEV_DB_DATABASE,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
} from '@/constants/index';

dotenv.config();

interface ormconfigType {
  development: ConnectionOptions;
  production: ConnectionOptions;
}

const ormconfig: ormconfigType = {
  development: {
    type: 'mysql',
    host: DEV_DB_HOST,
    port: Number(DEV_DB_PORT),
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE,
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
  production: {
    type: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: DB_DATABASE,
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
