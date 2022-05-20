import express, { Request, Response } from 'express';
import wrapAsync from '@/errors/util';

import { getExperiments, getRequests } from '@/database/controllers/posts';

const router = express.Router();

// GET posts/experiment
// query: display(default: 12), page(default: 1), sort(default: date)
router.get(
  '/experiment',
  wrapAsync(async (req: Request, res: Response) => {
    const { display = '12', page = '1', sort = 'date' } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (
      displayNum > 0 &&
      pageNum > 0 &&
      (sort === 'date' || sort === 'popular')
    ) {
      const expData = await getExperiments(displayNum, pageNum, sort);
      return res.json(expData);
    }

    throw new Error(); // TODO: 주소가 이상하게 들어온 경우 클라이언트 에러 처리
  }),
);

// GET posts/request
// query: display(default: 12), page(default: 1), sort(default: date), state(default: all)
router.get(
  '/request',
  wrapAsync(async (req: Request, res: Response) => {
    const {
      display = '12',
      page = '1',
      sort = 'date',
      state = 'all',
    } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (
      displayNum > 0 &&
      pageNum > 0 &&
      (sort === 'date' || sort === 'popular') &&
      (state === 'all' || state === 'wait' || state === 'connected')
    ) {
      const expData = await getRequests(displayNum, pageNum, sort, state);
      return res.json(expData);
    }

    throw new Error(); // TODO: 주소가 이상하게 들어온 경우 클라이언트 에러 처리
  }),
);

export default router;
