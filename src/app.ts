import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';
import ormconfig from '@/database/config/ormconfig';
import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';
import swaggerRouter from '@/routes/docs';

dotenv.config();

const isProdMode: boolean = process.env.NODE_ENV === 'production';
const REAL_SETTING = isProdMode ? PROD_SETTING : DEV_SETTING;

// DB
createConnection(ormconfig[REAL_SETTING.mode]).then(() => {
  console.log('DB Connection is Successful!');
});

// Express
const app = express();

// 보안
if (isProdMode) {
  app.use(hpp());
  app.use(helmet());
  app.enable('trust proxy');
}

// logger
app.use(morgan(REAL_SETTING.morganMode));

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
app.use('/docs', swaggerRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// 연결 확인용
app.get('/', (req, res) => {
  res.send('Welcome to Sasil Server!');
});

app.listen(REAL_SETTING.port, () => {
  console.log(`server is running on ${REAL_SETTING.port}`);
});
