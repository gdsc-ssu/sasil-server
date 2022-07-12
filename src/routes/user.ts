import express, { Request, Response } from 'express';

import wrapAsync from '@/utils/wrapAsync';
import { deleteUser, getUserById } from '@/database/controllers/user';
import { checkLoggedIn } from './middleware';
import { UnauthorizedError } from '@/errors/customErrors';

const router = express.Router();

router.get(
  '/me',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const { userId } = req;

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    const userData = await getUserById(userId);
    return res.json(userData);
  }),
);

router.delete(
  '/me',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const { userId } = req;

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await deleteUser(userId);

    res.end();
  }),
);

export default router;
