import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';
import ormconfig from '@/database/config/ormconfig';
import passportConfig from '@/auth/index';
import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';

dotenv.config();
const isProdMode: boolean = process.env.NODE_ENV === 'production';
const env = isProdMode ? 'production' : 'development';

// DB
createConnection(ormconfig[env]).then(() => {
  console.log('DB Connection!');
});

// Express
const app = express();
app.set('port', isProdMode ? PROD_SETTING.port : DEV_SETTING.port);

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: isProdMode ? PROD_SETTING.clientURL : true,
    credentials: true,
  }),
);

app.use(passport.initialize());
passportConfig();

// routers
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(app.get('port'), () => {
  console.log(`server is running on ${app.get('port')}`);
});
