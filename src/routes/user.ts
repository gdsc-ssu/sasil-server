import express, { Request, Response } from 'express';

import wrapAsync from '@/errors/util';
import { getUserById } from '@/database/controllers/user';
import checkLoggedIn from './middleware';

const router = express.Router();

router.get(
  '/me',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const userData = await getUserById(req.userId!);
    if (userData) {
      return res.status(200).json(userData);
    }

    // 중간 과정에 문제가 없었는데도 userData에 값이 들어오지 않은 경우 에러 처리
    throw new Error('userData가 존재하지 않습니다.');
  }),
);

export default router;
