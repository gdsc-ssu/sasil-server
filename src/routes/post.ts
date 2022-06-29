import express, { Request, Response } from 'express';
import wrapAsync from '@/utils/wrapAsync';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@/errors/customErrors';
import {
  getExperimentPost,
  getRequestPost,
  getComments,
  writeComment,
  deleteComment,
} from '@/database/controllers/post';
import checkLoggedIn from './middleware';

const router = express.Router();

// 게시물 정보 조회
router.get(
  '/:postType/:postId',
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('존재하지 않는 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
    }

    const getPostData =
      postType === 'experiment' ? getExperimentPost : getRequestPost;

    const postData = await getPostData(postId);
    return res.json(postData);
  }),
);

// 게시물에 대한 댓글 정보 조회
router.get(
  '/:postType/:postId/comments',
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('존재하지 않는 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
    }

    const commentsData = await getComments(postType, postId);
    return res.json(commentsData);
  }),
);

// 댓글 작성 (로그인)
router.post(
  '/:postType/:postId/comment',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { content } = req.body;
    const { userId } = req; // chckedLoggedIn middleware를 거치면서 생성

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('존재하지 않는 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    const commentData = await writeComment(postType, postId, userId, content);
    return res.json(commentData);
  }),
);

// 댓글 삭제 (로그인, 본인 권한)
router.delete(
  '/:postType/comment/:commentId',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, commentId] = [
      req.params.postType,
      Number(req.params.commentId),
    ];

    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('존재하지 않는 요청입니다.');
    }

    if (!commentId) {
      throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    const deleteResult = await deleteComment(postType, commentId, userId);
    return res.json(deleteResult);
  }),
);

export default router;
