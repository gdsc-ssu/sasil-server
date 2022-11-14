import express, { Request, Response } from 'express';

import wrapAsync from '@/utils/wrapAsync';
import {
  searchRequestListByTag,
  searchExperimentListByTag,
  searchRequestListByQuery,
  searchExperimentListByQuery,
} from '@/database/controllers/search';
import { BadRequestError } from '@/errors/customErrors';

const router = express.Router();

// 카테고리 태그로 검색
router.get(
  '/tag/:postType',
  wrapAsync(async (req: Request, res: Response) => {
    const { postType } = req.params;
    const { display = '12', page = '1', sort = 'recent', tag } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    const tagName = decodeURIComponent(tag as string);

    if (!tagName) {
      throw new BadRequestError('잘못된 태그를 포함한 요청입니다.');
    }

    const searchPostListByTag =
      postType === 'request'
        ? searchRequestListByTag
        : searchExperimentListByTag;

    if (
      displayNum > 0 &&
      pageNum > 0 &&
      (sort === 'recent' || sort === 'popular')
    ) {
      const searchPostsData = await searchPostListByTag(
        tagName,
        pageNum,
        displayNum,
        sort,
      );
      return res.json(searchPostsData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

// 키워드(쿼리)로 검색
router.get(
  '/query/:postType',
  wrapAsync(async (req: Request, res: Response) => {
    const { postType } = req.params;
    const { display = '12', page = '1', sort = 'recent', query } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    const queryName = decodeURIComponent(query as string);

    if (!queryName) {
      throw new BadRequestError('잘못된 쿼리를 포함한 요청입니다.');
    }

    const searchPostListByQuery =
      postType === 'request'
        ? searchRequestListByQuery
        : searchExperimentListByQuery;

    if (
      displayNum > 0 &&
      pageNum > 0 &&
      (sort === 'recent' || sort === 'popular')
    ) {
      const searchPostsData = await searchPostListByQuery(
        queryName,
        pageNum,
        displayNum,
        sort,
      );
      return res.json(searchPostsData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
