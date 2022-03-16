import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import ormconfig from '@/database/config/ormconfig';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';

dotenv.config();
const isProdMode: boolean = process.env.NODE_ENV === 'production';
const env = isProdMode ? 'production' : 'development';

createConnection(ormconfig[env]).then(() => {
  console.log('DB Connection!');
});

const app = express();
app.set('port', isProdMode ? PROD_SETTING.port : DEV_SETTING.port);

app.listen(app.get('port'), () => {
  console.log(`server is running on ${app.get('port')}`);
});
