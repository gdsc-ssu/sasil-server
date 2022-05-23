import express, { Request, Response } from 'express';
import wrapAsync from '@/utils/wrapAsync';

import { getExperiments, getRequests } from '@/database/controllers/posts';
import { BadRequestError } from '@/errors/customErrors';

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

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
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
      (state === 'all' || state === 'wait' || state === 'answered')
    ) {
      const expData = await getRequests(displayNum, pageNum, sort, state);
      return res.json(expData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
