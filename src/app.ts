import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';
import ormconfig from '@/database/config/ormconfig';
import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';

dotenv.config();
const isProdMode: boolean = process.env.NODE_ENV === 'production';
const env = isProdMode ? 'prod' : 'dev';
const port = isProdMode ? PROD_SETTING.port : DEV_SETTING.port;

// DB
createConnection(ormconfig[env]).then(() => {
  console.log('DB Connection!');
});

// Express
const app = express();

// 보안
if (isProdMode) {
  app.use(hpp());
  app.use(helmet());
}

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

// routers
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
