import express, { Request, Response } from 'express';

import wrapAsync from '@/utils/wrapAsync';
import {
  searchRequestListByTag,
  searchExperimentListByTag,
} from '@/database/controllers/search';
import { BadRequestError } from '@/errors/customErrors';

const router = express.Router();

// 카테고리 태그로 검색
router.get(
  '/tag/:postType',
  wrapAsync(async (req: Request, res: Response) => {
    const { postType } = req.params;
    const { display = '12', page = '1', tag } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    const tagName = decodeURIComponent(tag as string);

    if (!tagName) {
      throw new BadRequestError('잘못된 태그를 포함한 요청입니다.');
    }

    const getSearchPostList =
      postType === 'request'
        ? searchRequestListByTag
        : searchExperimentListByTag;

    if (displayNum > 0 && pageNum > 0) {
      const searchPostsData = await getSearchPostList(
        tagName,
        pageNum,
        displayNum,
      );
      return res.json(searchPostsData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
