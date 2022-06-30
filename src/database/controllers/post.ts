import { getRepository } from 'typeorm';

import { ForbiddenError } from '@/errors/customErrors';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';
import ReqCommentEntity from '@/database/entity/req-comment';
import ExpCommentEntity from '@/database/entity/exp-comment';
import UserEntity from '@/database/entity/user';
import ReqLikeEntity from '@/database/entity/req-like';
import ExpLikeEntity from '@/database/entity/exp-like';
import ReqBookmarkEntity from '@/database/entity/req-bookmark';
import ExpBookmarkEntity from '@/database/entity/exp-bookmark';

type PostType = 'experiment' | 'request';

/**
 * postId값에 따른 실험 게시물 정보를 반환
 *
 * @param postId 실험 게시물의 id값
 * @returns request post info | undefined
 */
export const getExperimentPost = async (
  postId: number,
  userId: number | undefined,
) => {
  const expPostData = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .where('experiment.id = :postId', { postId })
    .select([
      'experiment',
      'user.id',
      'user.nickname',
      'user.profile_img',
      'categories.id',
      'categories.name',
    ])
    .leftJoin('experiment.user', 'user')
    .leftJoin('experiment.categories', 'categories')
    .loadRelationCountAndMap('experiment.likeCount', 'experiment.expLikes')
    .loadRelationCountAndMap(
      'experiment.bookmarkCount',
      'experiment.expBookmarks',
    )
    .getOne();

  const isLike = userId
    ? !!(await getRepository(ExpLikeEntity)
        .createQueryBuilder('exp_like')
        .where('exp_like.user_id = :userId', { userId })
        .andWhere('exp_like.exp_id = :postId', { postId })
        .getOne())
    : false;

  const isBookmark = userId
    ? !!(await getRepository(ExpBookmarkEntity)
        .createQueryBuilder('exp_bookmark')
        .where('exp_bookmark.user_id = :userId', { userId })
        .andWhere('exp_bookmark.exp_id = :postId', { postId })
        .getOne())
    : false;

  return { ...expPostData, isLike, isBookmark };
};

/**
 * id값에 따른 의뢰 게시물 정보를 반환
 *
 * @param postId 의뢰 게시물의 id값
 * @returns request posts info | undefined
 */
export const getRequestPost = async (
  postId: number,
  userId: number | undefined,
) => {
  const reqPostData = await getRepository(RequestEntity)
    .createQueryBuilder('request')
    .where('request.id = :postId', { postId })
    .select([
      'request',
      'user.id',
      'user.nickname',
      'user.profile_img',
      'categories.id',
      'categories.name',
    ])
    .leftJoin('request.user', 'user')
    .leftJoin('request.categories', 'categories')
    .loadRelationCountAndMap('request.likeCount', 'request.reqLikes')
    .loadRelationCountAndMap('request.bookmarkCount', 'request.reqBookmarks')
    .getOne();

  const isLike = userId
    ? !!(await getRepository(ReqLikeEntity)
        .createQueryBuilder('req_like')
        .where('req_like.user_id = :userId', { userId })
        .andWhere('req_like.req_id = :postId', { postId })
        .getOne())
    : false;

  const isBookmark = userId
    ? !!(await getRepository(ReqBookmarkEntity)
        .createQueryBuilder('req_bookmark')
        .where('req_bookmark.user_id = :userId', { userId })
        .andWhere('req_bookmark.req_id = :postId', { postId })
        .getOne())
    : false;

  return { ...reqPostData, isLike, isBookmark };
};

// 의뢰 게시물에 응답한 실험 게시물 목록 조회 (최신순)
export const getExpListByReqId = async (reqId: number) => {
  const sortType = 'experiment.created_at';

  const expListByReqId = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .where('experiment.req_id = :reqId', { reqId })
    .select([
      'experiment.id',
      'experiment.created_at',
      'experiment.updated_at',
      'experiment.title',
      'experiment.thumbnail',
      'user.id',
      'user.nickname',
      'user.profile_img',
    ])
    .leftJoin('experiment.user', 'user')
    .loadRelationCountAndMap('experiment.likeCount', 'experiment.expLikes')
    .orderBy(`${sortType}`, 'DESC')
    .getMany();

  return expListByReqId;
};

// 실험 게시물이 응답한 의뢰 게시물 조회
export const getReqPostByExpId = async (expId: number) => {
  const reqPost = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .where('experiment.id = :expId', { expId })
    .select([
      'experiment.id',
      'request.id',
      'request.created_at',
      'request.updated_at',
      'request.title',
      'request.thumbnail',
      'user.id',
      'user.nickname',
      'user.profile_img',
    ])
    .leftJoin('experiment.request', 'request')
    .leftJoin('request.user', 'user')
    .loadRelationCountAndMap('request.likeCount', 'request.reqLikes')
    .getOne();

  return reqPost;
};

/**
 * postId값에 따른 게시물의 댓글 목록을 반환 (최신순)
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @returns request post info | undefined
 */
export const getComments = async (
  postType: PostType,
  postId: number,
  display: number,
  page: number,
) => {
  const [TargetEntity, entityName, idName] =
    postType === 'request'
      ? [ReqCommentEntity, 'req_comment', 'req_id']
      : [ExpCommentEntity, 'exp_comment', 'exp_id'];

  const sortType = `${entityName}.created_at`;

  const commentsData = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .where(`${entityName}.${idName} = :postId`, { postId })
    .select([
      `${entityName}`,
      'commWriter.id',
      'commWriter.nickname',
      'commWriter.profile_img',
    ])
    .orderBy(sortType, 'DESC')
    .offset((page - 1) * display)
    .limit(display)
    .leftJoin(`${entityName}.user`, 'commWriter')
    .getMany();

  return commentsData;
};

// 댓글 작성 (로그인)
export const addComment = async (
  postType: PostType,
  postId: number,
  userId: number,
  content: string,
) => {
  const [TargetEntity, PostEntity, entityName] = (
    postType === 'request'
      ? [ReqCommentEntity, RequestEntity, 'req_comment']
      : [ExpCommentEntity, ExperimentEntity, 'exp_comment']
  ) as any;

  const user = new UserEntity();
  user.id = userId;

  const post = new PostEntity();
  post.id = postId;

  const newComment = new TargetEntity();
  newComment.content = content;
  newComment.user = user;
  newComment[postType] = post;

  await getRepository(TargetEntity)
    .createQueryBuilder()
    .insert()
    .into(entityName)
    .values(newComment)
    .updateEntity(false)
    .execute();
};

// 댓글 삭제 (로그인, 본인 권한)
export const deleteComment = async (
  postType: PostType,
  postId: number,
  commentId: number,
  userId: number,
) => {
  const [TargetEntity, entityName, entityId] =
    postType === 'request'
      ? [ReqCommentEntity, 'req_comment', 'req_id']
      : [ExpCommentEntity, 'exp_comment', 'exp_id'];

  const deleteCommResult = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .delete()
    .where(`${entityName}.id = :commentId`, { commentId })
    .andWhere(`${entityName}.${entityId} = :postId`, { postId })
    .andWhere(`${entityName}.user_id = :userId`, { userId })
    .execute();

  if (deleteCommResult.affected === 0) {
    throw new ForbiddenError(
      '존재하지 않는 게시물입니다. (혹은 본인 댓글이 아닙니다.)',
    );
  }
};

// 좋아요 (로그인)
export const addLike = async (
  postType: PostType,
  postId: number,
  userId: number,
) => {
  const [TargetEntity, PostEntity, entityName] = (
    postType === 'request'
      ? [ReqLikeEntity, RequestEntity, 'req_like']
      : [ExpLikeEntity, ExperimentEntity, 'exp_like']
  ) as any;

  const user = new UserEntity();
  user.id = userId;

  const post = new PostEntity();
  post.id = postId;

  const newLike = new TargetEntity();
  newLike.user = user;
  newLike[postType] = post;

  await getRepository(TargetEntity)
    .createQueryBuilder()
    .insert()
    .into(entityName)
    .values(newLike)
    .updateEntity(false)
    .execute();
};

// 좋아요 취소 (로그인)
export const deleteLike = async (
  postType: PostType,
  postId: number,
  userId: number,
) => {
  const [TargetEntity, entityName, entityId] =
    postType === 'request'
      ? [ReqLikeEntity, 'req_like', 'req_id']
      : [ExpLikeEntity, 'exp_like', 'exp_id'];

  const deleteLikeResult = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .delete()
    .where(`${entityName}.${entityId} = :postId`, { postId })
    .andWhere(`${entityName}.user_id = :userId`, { userId })
    .execute();

  if (deleteLikeResult.affected === 0) {
    throw new ForbiddenError('존재하지 않는 게시물입니다.');
  }
};

// 북마크 추가 (로그인)
export const addBookmark = async (
  postType: PostType,
  postId: number,
  userId: number,
) => {
  const [TargetEntity, PostEntity, entityName] = (
    postType === 'request'
      ? [ReqBookmarkEntity, RequestEntity, 'req_bookmark']
      : [ExpBookmarkEntity, ExperimentEntity, 'exp_bookmark']
  ) as any;

  const user = new UserEntity();
  user.id = userId;

  const post = new PostEntity();
  post.id = postId;

  const newBookmark = new TargetEntity();
  newBookmark.user = user;
  newBookmark[postType] = post;

  await getRepository(TargetEntity)
    .createQueryBuilder()
    .insert()
    .into(entityName)
    .values(newBookmark)
    .updateEntity(false)
    .execute();
};

// 북마크 삭제 (로그인)
export const deleteBookmark = async (
  postType: PostType,
  postId: number,
  userId: number,
) => {
  const [TargetEntity, entityName, entityId] =
    postType === 'request'
      ? [ReqBookmarkEntity, 'req_bookmark', 'req_id']
      : [ExpBookmarkEntity, 'exp_bookmark', 'exp_id'];

  const deleteBookmarkResult = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .delete()
    .where(`${entityName}.${entityId} = :postId`, { postId })
    .andWhere(`${entityName}.user_id = :userId`, { userId })
    .execute();

  if (deleteBookmarkResult.affected === 0) {
    throw new ForbiddenError('존재하지 않는 게시물입니다.');
  }
};
