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
  getExpListByReqId,
  getReqPostByExpId,
  getComments,
  addComment,
  deleteComment,
  addLike,
  deleteLike,
  addBookmark,
  deleteBookmark,
  addPost,
  deletePost,
  editPost,
} from '@/database/controllers/post';
import { checkLoggedIn, getUserId } from './middleware';
import { getImgUploadURL } from '@/utils/uploadImage';

const router = express.Router();

// 게시물 정보 조회 (로그인 [선택])
router.get(
  '/:postType/:postId',
  getUserId,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req; // 비회원이 요청 시, userId === undefined

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    const getPostData =
      postType === 'experiment' ? getExperimentPost : getRequestPost;

    const postData = await getPostData(postId, userId);

    return res.json(postData);
  }),
);

// 관련 게시물 목록 조회 (최신순)
router.get(
  '/:postType/:postId/relative',
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    const getRelativePosts =
      postType === 'experiment' ? getReqPostByExpId : getExpListByReqId;

    const result = await getRelativePosts(postId);
    return res.json(result);
  }),
);

// 게시물의 댓글 목록 조회 (최신순)
router.get(
  '/:postType/:postId/comments',
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { display = '12', page = '1' } = req.query;
    const [displayNum, pageNum] = [Number(display), Number(page)];

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 query를 포함한 요청입니다.');
    }

    const commentsData = await getComments(
      postType,
      postId,
      pageNum,
      displayNum,
    );

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
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await addComment(postType, postId, userId, content);

    res.end();
  }),
);

// 댓글 삭제 (로그인, 본인만)
router.delete(
  '/:postType/:postId/comment/:commentId',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId, commentId] = [
      req.params.postType,
      Number(req.params.postId),
      Number(req.params.commentId),
    ];
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!commentId || !postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await deleteComment(postType, postId, commentId, userId);

    res.end();
  }),
);

// 좋아요 추가 (로그인)
router.post(
  '/:postType/:postId/like',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await addLike(postType, postId, userId);

    return res.end();
  }),
);

// 좋아요 취소 (로그인)
router.delete(
  '/:postType/:postId/like',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await deleteLike(postType, postId, userId);

    return res.end();
  }),
);

// 북마크 추가 (로그인)
router.post(
  '/:postType/:postId/bookmark',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await addBookmark(postType, postId, userId);

    res.end();
  }),
);

// 북마크 삭제 (로그인)
router.delete(
  '/:postType/:postId/bookmark',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await deleteBookmark(postType, postId, userId);

    res.end();
  }),
);

// 게시글 추가
router.post(
  '/:postType',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const { postType } = req.params;
    const { title, content, thumbnail, categories, reqId } = req.body;
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    const result = await addPost(
      postType,
      userId,
      title,
      content,
      thumbnail,
      categories,
      reqId,
    );

    return res.json(result);
  }),
);

// 이미지 업로드 URL 반환
router.get(
  '/:image',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const imgUploadURL = await getImgUploadURL();

    return res.json(imgUploadURL);
  }),
);

// 게시물 삭제
router.delete(
  '/:postType/:postId',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await deletePost(postType, postId, userId);

    res.end();
  }),
);

// 게시물 수정
router.patch(
  '/:postType/:postId',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const [postType, postId] = [req.params.postType, Number(req.params.postId)];
    const { userId } = req;
    const { title, content, thumbnail, newCategories, delCategories } =
      req.body;

    if (!(postType === 'experiment' || postType === 'request')) {
      throw new NotFoundError('잘못된 postType을 포함한 요청입니다.');
    }

    if (!postId) {
      throw new BadRequestError('올바르지 않은 postId값을 포함한 요청입니다.');
    }

    if (!userId) {
      throw new UnauthorizedError('로그인이 필요한 요청입니다.');
    }

    await editPost(
      postType,
      postId,
      userId,
      title,
      content,
      thumbnail,
      newCategories,
      delCategories,
    );

    res.end();
  }),
);

export default router;
