import dotenv from 'dotenv';

dotenv.config();

type ConfigType = {
  database: string;
  username: string;
  password: string;
  dialect: 'mysql';
  host: string;
};

interface ConfigTypes {
  development: ConfigType;
  test: ConfigType;
  production: ConfigType;
}

const config: ConfigTypes = {
  development: {
    database: 'sasil-dev',
    username: 'root',
    password: process.env.DB_PASSWORD!,
    dialect: 'mysql',
    host: '127.0.0.1',
  },
  test: {
    database: 'sasil-dev',
    username: 'root',
    password: process.env.DB_PASSWORD!,
    dialect: 'mysql',
    host: '127.0.0.1',
  },
  production: {
    database: 'sasil',
    username: 'root',
    password: process.env.DB_PASSWORD!,
    dialect: 'mysql',
    host: '127.0.0.1',
  },
};

export default config;
