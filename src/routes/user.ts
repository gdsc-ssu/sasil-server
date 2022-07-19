import express, { Request, Response } from 'express';

import wrapAsync from '@/utils/wrapAsync';
import {
  deleteUser,
  getUserById,
  getUserExperimentList,
  getUserRequestList,
} from '@/database/controllers/user';
import { checkLoggedIn } from './middleware';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@/errors/customErrors';

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

// 유저가 작성한 게시물 목록 조회 (최신순)
// query: display(default: 12), page(default: 1)
router.get(
  '/:id/posts/:postType',
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, userId] = [req.params.postType, Number(req.params.id)];
    const { display = '12', page = '1' } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new BadRequestError('올바르지 않은 userId 값을 포함한 요청입니다.');
    }

    const getUserPostList =
      postType === 'request' ? getUserRequestList : getUserExperimentList;

    if (displayNum > 0 && pageNum > 0) {
      const userPostsData = await getUserPostList(userId, displayNum, pageNum);
      return res.json(userPostsData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
