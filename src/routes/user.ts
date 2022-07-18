import express, { Request, Response } from 'express';

import wrapAsync from '@/utils/wrapAsync';
import { deleteUser, getUserById } from '@/database/controllers/user';
import { checkLoggedIn } from './middleware';
import { BadRequestError, UnauthorizedError } from '@/errors/customErrors';

const router = express.Router();

// 내 정보 조회
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

// 회원 탈퇴
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

// 유저 정보 조회
router.get(
  '/:id',
  wrapAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (!userId) {
      throw new BadRequestError('올바르지 않은 userId 값을 포함한 요청입니다.');
    }

    const userData = await getUserById(userId);
    return res.json(userData);
  }),
);

export default router;
