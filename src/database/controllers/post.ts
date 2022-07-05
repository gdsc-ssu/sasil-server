import { getRepository } from 'typeorm';

import { BadRequestError, ServerError } from '@/errors/customErrors';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';
import ReqCommentEntity from '@/database/entity/req-comment';
import ExpCommentEntity from '@/database/entity/exp-comment';
import UserEntity from '@/database/entity/user';
import ReqLikeEntity from '@/database/entity/req-like';
import ExpLikeEntity from '@/database/entity/exp-like';
import ReqBookmarkEntity from '@/database/entity/req-bookmark';
import ExpBookmarkEntity from '@/database/entity/exp-bookmark';
import CategoryEntity from '@/database/entity/category';
import ReqCategoryEntity from '@/database/entity/req-category';
import ExpCategoryEntity from '@/database/entity/exp-category';

type PostType = 'experiment' | 'request';

/**
 * 실험 게시물 정보 반환
 *
 * @param postId 실험 게시물의 id값
 * @param userId 유저의 id값 (좋아요, 북마크 여부를 파악하기 위해)
 * @returns experiment post info
 */
export const getExperimentPost = async (
  postId: number,
  userId: number | undefined,
) => {
  const expPostData = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .where('experiment.id = :postId', { postId })
    .select(['experiment', 'user.id', 'user.nickname', 'user.profileImg'])
    .leftJoin('experiment.user', 'user')
    .leftJoinAndSelect('experiment.expCategories', 'expCategories')
    .leftJoinAndSelect('expCategories.category', 'categories')
    .loadRelationCountAndMap('experiment.likeCount', 'experiment.expLikes')
    .loadRelationCountAndMap(
      'experiment.bookmarkCount',
      'experiment.expBookmarks',
    )
    .getOne();

  if (!expPostData) {
    throw new BadRequestError('존재하지 않는 게시물입니다.');
  }

  // 좋아요, 북마크 여부 파악 (with userId)
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

  const { expCategories, ...data } = expPostData;
  const categories = expCategories.map((categoryData) => ({
    id: categoryData.category.id,
    name: categoryData.category.name,
  }));

  const result = {
    ...data,
    isLike,
    isBookmark,
    categories,
  };

  return result;
};

/**
 * 의뢰 게시물 정보 반환
 *
 * @param postId 의뢰 게시물의 id값
 * @param userId 유저의 id값 (좋아요, 북마크 여부를 파악하기 위해)
 * @returns request posts info
 */
export const getRequestPost = async (
  postId: number,
  userId: number | undefined,
) => {
  const reqPostData = await getRepository(RequestEntity)
    .createQueryBuilder('request')
    .where('request.id = :postId', { postId })
    .select(['request', 'user.id', 'user.nickname', 'user.profileImg'])
    .leftJoin('request.user', 'user')
    .leftJoinAndSelect('request.reqCategories', 'reqCategories')
    .leftJoinAndSelect('reqCategories.category', 'categories')
    .loadRelationCountAndMap('request.likeCount', 'request.reqLikes')
    .loadRelationCountAndMap('request.bookmarkCount', 'request.reqBookmarks')
    .getOne();

  if (!reqPostData) {
    throw new BadRequestError('존재하지 않는 게시물입니다.');
  }

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

  const { reqCategories, ...data } = reqPostData;
  const categories = reqCategories.map((categoryData) => ({
    id: categoryData.category.id,
    name: categoryData.category.name,
  }));

  const result = {
    ...data,
    isLike,
    isBookmark,
    categories,
  };

  return result;
};

/**
 * 특정 의뢰에 응답한 실험 게시물 목록 반환 (최신순)
 *
 * @param reqId 의뢰 게시물의 id값
 * @returns experiment posts list
 */
export const getExpListByReqId = async (reqId: number) => {
  const sortType = 'experiment.createdAt';

  const expPostList = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .where('experiment.req_id = :reqId', { reqId })
    .select([
      'experiment.id',
      'experiment.createdAt',
      'experiment.updatedAt',
      'experiment.title',
      'experiment.thumbnail',
      'user.id',
      'user.nickname',
      'user.profileImg',
    ])
    .leftJoin('experiment.user', 'user')
    .loadRelationCountAndMap('experiment.likeCount', 'experiment.expLikes')
    .orderBy(`${sortType}`, 'DESC')
    .getMany();

  return expPostList;
};

/**
 * 실험 게시물이 응답한 의뢰 게시물 반환
 *
 * @param expId 실험 게시물의 id값
 * @returns request post info
 */
export const getReqPostByExpId = async (expId: number) => {
  const reqPost = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .where('experiment.id = :expId', { expId })
    .select([
      'experiment.id',
      'request.id',
      'request.createdAt',
      'request.updatedAt',
      'request.title',
      'request.thumbnail',
      'user.id',
      'user.nickname',
      'user.profileImg',
    ])
    .leftJoin('experiment.request', 'request')
    .leftJoin('request.user', 'user')
    .loadRelationCountAndMap('request.likeCount', 'request.reqLikes')
    .loadRelationCountAndMap('request.bookmarkCount', 'request.reqBookmarks')
    .getOne();

  return reqPost?.request;
};

/**
 * 게시물의 댓글 목록 반환 (최신순)
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param page page number
 * @param display comments number
 * @returns comments list
 */
export const getComments = async (
  postType: PostType,
  postId: number,
  page: number,
  display: number,
) => {
  const [TargetEntity, entityName, idName] =
    postType === 'request'
      ? [ReqCommentEntity, 'req_comment', 'req_id']
      : [ExpCommentEntity, 'exp_comment', 'exp_id'];

  const sortType = `${entityName}.createdAt`;

  const commentsData = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .where(`${entityName}.${idName} = :postId`, { postId })
    .select([
      `${entityName}`,
      'commWriter.id',
      'commWriter.nickname',
      'commWriter.profileImg',
    ])
    .orderBy(sortType, 'DESC')
    .offset((page - 1) * display)
    .limit(display)
    .leftJoin(`${entityName}.user`, 'commWriter')
    .getMany();

  return commentsData;
};

/**
 * 댓글 작성
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param userId 유저의 id값
 * @param content 댓글 내용
 */
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

/**
 * 댓글 삭제
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param commentId 댓글 id값
 * @param userId 유저의 id값
 */
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

  if (deleteCommResult.affected !== 1) {
    throw new BadRequestError(
      '존재하지 않는 게시물/댓글에 대한 요청입니다. (혹은 본인 댓글이 아닙니다.)',
    );
  }
};

/**
 * 좋아요
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param userId 유저의 id값
 */
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

/**
 * 좋아요 취소
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param userId 유저의 id값
 */
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

  if (deleteLikeResult.affected !== 1) {
    throw new BadRequestError('존재하지 않는 게시물에 대한 요청입니다.');
  }
};

/**
 * 북마크 추가
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param userId 유저의 id값
 */
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

/**
 * 북마크 삭제
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @param userId 유저의 id값
 */
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

  if (deleteBookmarkResult.affected !== 1) {
    throw new BadRequestError('존재하지 않는 게시물에 대한 요청입니다.');
  }
};

/**
 * 게시글 추가
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param userId 유저의 id값
 * @param title 게시물 제목
 * @param content 게시물 내용
 * @param thumbnail 게시물 썸네일 (nullable)
 * @param categories 게시물의 카테고리 배열
 * @param reqId 실험 게시물이 수행한 의뢰 게시물의 id값
 */
export const addPost = async (
  postType: PostType,
  userId: number,
  title: string,
  content: string,
  thumbnail: string | undefined,
  categories: string[],
  reqId: number | undefined,
) => {
  const [PostEntity, PostCategoryEntity, postEntityName, categoryEntityName] = (
    postType === 'request'
      ? [RequestEntity, ReqCategoryEntity, 'request', 'req_category']
      : [ExperimentEntity, ExpCategoryEntity, 'experiment', 'exp_category']
  ) as any;

  // 유저 정보
  const newUser = new UserEntity();
  newUser.id = userId;

  // 게시물 정보
  const newPost = new PostEntity();
  newPost.user = newUser;
  newPost.title = title;
  newPost.content = content;

  if (thumbnail) {
    newPost.thumbnail = thumbnail;
  }

  // 실험 게시물 작성글이면서, 선택한 의뢰 게시물이 있는 경우
  if (postType === 'experiment' && reqId) {
    const reqPost = await getRepository(RequestEntity)
      .createQueryBuilder('request')
      .where('request.id = :reqId', { reqId })
      .select(['request.id', 'request.state'])
      .getOne();

    // 선택된 의뢰 게시물의 state가 'wait'인 경우, 'answered'로 변경
    if (reqPost?.state === 'wait') {
      const editRequStateResult = await getRepository(RequestEntity)
        .createQueryBuilder('request')
        .update()
        .set({ state: 'answered' })
        .where('request.id = :reqId', { reqId })
        .execute();

      if (editRequStateResult.affected !== 1) {
        throw new BadRequestError(
          '존재하지 않는 실험 게시물에 대한 요청입니다.',
        );
      }
    }

    newPost.request = reqPost;
  }

  const insertPostResult = await getRepository(PostEntity)
    .createQueryBuilder()
    .insert()
    .into(postEntityName)
    .values(newPost)
    .updateEntity(false)
    .execute();

  const postId = insertPostResult.raw.insertId; // insert 후, 해당 id값

  // 카테고리 처리 로직
  if (categories.length > 0) {
    categories.forEach(async (category) => {
      // 카테고리 이름으로 조회
      const categoryData = await getRepository(CategoryEntity)
        .createQueryBuilder('category')
        .where('category.name = :category', { category })
        .select()
        .getOne();

      let categoryId = categoryData?.id;

      // 없으면 추가
      if (!categoryData) {
        const insertCategoryResult = await getRepository(CategoryEntity)
          .createQueryBuilder()
          .insert()
          .into('category')
          .values({ name: category })
          .updateEntity(false)
          .execute();

        categoryId = insertCategoryResult.raw.insertId;
      }

      // 게시물-카테고리 추가
      if (!categoryId || !postId) {
        throw new ServerError(
          '카테고리 혹은 게시물 데이터가 정상적으로 생성되지 않았습니다.',
        );
      }

      const newCategory = new CategoryEntity();
      newCategory.id = categoryId;

      newPost.id = postId;

      const newPostCategory = new PostCategoryEntity();
      newPostCategory.category = newCategory;
      newPostCategory[postEntityName] = newPost;

      await getRepository(PostCategoryEntity)
        .createQueryBuilder()
        .insert()
        .into(categoryEntityName)
        .values(newPostCategory)
        .updateEntity(false)
        .execute();
    });
  }
};

// TODO: 삭제
// /**
//  * 게시글 삭제
//  *
//  * @param postType 게시물 타입 (request | experiment)
//  * @param postId 게시물 id값
//  * @param userId 유저의 id값
//  */
// export const deletePost = async (
//   postType: PostType,
//   postId: number,
//   userId: number,
// ) => {
//   const [PostEntity, entityName, entityId] =
//     postType === 'request'
//       ? [RequestEntity, 'request', 'req_id']
//       : [ExperimentEntity, 'experiment', 'exp_id'];

//   const deletePostResult = await getRepository(PostEntity)
//     .createQueryBuilder(entityName)
//     .delete()
//     .where(`${entityName}.id = :postId`, { postId })
//     .andWhere(`${entityName}.user_id = :userId`, { userId })
//     .execute();

//   if (deletePostResult.affected !== 1) {
//     throw new BadRequestError(
//       '존재하지 않는 게시물에 대한 요청입니다. (혹은 본인 게시물이 아닙니다.)',
//     );
//   }
// };

// TODO: 수정
// /**
//  * 게시글 수정
//  *
//  * @param postType 게시물 타입 (request | experiment)
//  * @param postId 게시물 id값
//  * @param userId 유저의 id값
//  */
// export const editPost = async (
//   postType: PostType,
//   postId: number,
//   userId: number,
//   title: string,
//   content: string,
//   thumbnail: string | undefined,
//   reqId: number | undefined,
// ) => {
//   const [PostEntity, entityName, entityId] =
//     postType === 'request'
//       ? [RequestEntity, 'request', 'req_id']
//       : [ExperimentEntity, 'experiment', 'exp_id'];

//   const editRequStateResult = await getRepository(PostEntity)
//     .createQueryBuilder(entityName)
//     .update()
//     .set({ title, content, thumbnail })
//     .where(`${entityName}.id = :postId`, { postId })
//     .andWhere(`${entityName}.user_id = :userId`, { userId })
//     .execute();

//   if (editRequStateResult.affected !== 1) {
//     throw new BadRequestError('존재하지 않는 실험 게시물에 대한 요청입니다.');
//   }
// };
