import express, { Request, Response } from 'express';
import wrapAsync from '@/utils/wrapAsync';

import { BadRequestError } from '@/errors/customErrors';
import { getExperimentPost, getRequestPost } from '@/database/controllers/post';

const router = express.Router();

router.get(
  '/:postType/:postId',
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];

    if (postId && (postType === 'experiment' || postType === 'request')) {
      const getPostData =
        postType === 'experiment' ? getExperimentPost : getRequestPost;

      const postData = await getPostData(postId);
      return res.json(postData);
    }

    throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
  }),
);

export default router;
