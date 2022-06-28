import express, { Request, Response } from 'express';
import wrapAsync from '@/utils/wrapAsync';

import {
  getExperimentList,
  getRequestList,
} from '@/database/controllers/posts';
import { BadRequestError } from '@/errors/customErrors';

const router = express.Router();

// GET posts/experiment
// query: display(default: 12), page(default: 1), sort(default: recent)
router.get(
  '/experiment',
  wrapAsync(async (req: Request, res: Response) => {
    const { display = '12', page = '1', sort = 'recent' } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (
      displayNum > 0 &&
      pageNum > 0 &&
      (sort === 'recent' || sort === 'popular')
    ) {
      const expListData = await getExperimentList(displayNum, pageNum, sort);
      return res.json(expListData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

// GET posts/request
// query: display(default: 12), page(default: 1), sort(default: recent), state(default: all)
router.get(
  '/request',
  wrapAsync(async (req: Request, res: Response) => {
    const {
      display = '12',
      page = '1',
      sort = 'recent',
      state = 'all',
    } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (
      displayNum > 0 &&
      pageNum > 0 &&
      (sort === 'recent' || sort === 'popular') &&
      (state === 'all' || state === 'wait' || state === 'answered')
    ) {
      const reqListData = await getRequestList(
        displayNum,
        pageNum,
        sort,
        state,
      );
      return res.json(reqListData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
