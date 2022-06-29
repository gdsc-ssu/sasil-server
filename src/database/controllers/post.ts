import { getRepository } from 'typeorm';

import { ForbiddenError } from '@/errors/customErrors';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';
import ReqCommentEntity from '@/database/entity/req-comment';
import ExpCommentEntity from '@/database/entity/exp-comment';
import UserEntity from '@/database/entity/user';

type PostType = 'experiment' | 'request';

// 만약 의뢰에 따른 실험 게시물 목록 정보를 불러오는 것을 분리하면,
// getExperimentPost와 getRequestPost 통일 가능

/**
 * postId값에 따른 실험 게시물 정보를 반환
 *
 * @param postId 실험 게시물의 id값
 * @returns request post info | undefined
 */
export const getExperimentPost = async (postId: number) => {
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

  // expPostData가 없어도 오류 X

  return expPostData;
};

/**
 * id값에 따른 의뢰 게시물 정보를 반환
 *
 * @param postId 의뢰 게시물의 id값
 * @returns request posts info | undefined
 */
export const getRequestPost = async (postId: number) => {
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

  // reqPostData가 없어도 오류 X

  return reqPostData;
};

// 의뢰 게시물에 응답한 실험 게시물 목록 정보
// 실험 게시물이 응답한 의뢰 게시물 정보

/**
 * postId값에 따른 게시물의 댓글 목록을 반환
 *
 * @param postType 게시물 타입 (request | experiment)
 * @param postId 게시물의 id값
 * @returns request post info | undefined
 */
export const getComments = async (postType: PostType, postId: number) => {
  const [TargetEntity, entityName, idName] =
    postType === 'request'
      ? [ReqCommentEntity, 'req_comment', 'req_id']
      : [ExpCommentEntity, 'exp_comment', 'exp_id'];

  const commentsData = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .where(`${entityName}.${idName} = :postId`, { postId })
    .select([
      `${entityName}`,
      'commWriter.id',
      'commWriter.nickname',
      'commWriter.profile_img',
    ])
    .leftJoin(`${entityName}.user`, 'commWriter')
    .getMany();

  return commentsData;
};

// 댓글 작성 (로그인)
export const writeComment = async (
  postType: PostType,
  postId: number,
  userId: number,
  content: string,
) => {
  const [TargetEntity, PostEntity] = (
    postType === 'request'
      ? [ReqCommentEntity, RequestEntity]
      : [ExpCommentEntity, ExperimentEntity]
  ) as any;

  const repository = getRepository(TargetEntity);

  const user = new UserEntity();
  user.id = userId;

  const post = new PostEntity();
  post.id = postId;

  const newComment = new TargetEntity();
  newComment.content = content;
  newComment.user = user;
  newComment[postType] = post;

  await repository.save(newComment);
  return newComment;
};

// 댓글 삭제 (로그인, 본인 권한)
export const deleteComment = async (
  postType: PostType,
  commentId: number,
  userId: number,
) => {
  const [TargetEntity, entityName] =
    postType === 'request'
      ? [ReqCommentEntity, 'req_comment']
      : [ExpCommentEntity, 'exp_comment'];

  const deleteResult = await getRepository(TargetEntity)
    .createQueryBuilder(entityName)
    .delete()
    .where(`${entityName}.id = :commentId`, { commentId })
    .andWhere(`${entityName}.user_id = :userId`, { userId })
    .execute();

  if (deleteResult.affected === 0) {
    throw new ForbiddenError(
      '존재하지 않는 댓글입니다. (혹은 본인 댓글이 아닙니다.)',
    );
  }

  return deleteResult; // TODO: 어떤 값을 반환할지 결정
};

// 좋아요 (로그인)

// 좋아요 취소 (로그인)

// 북마크 추가 (로그인)

// 북마크 삭제 (로그인)

// 의뢰에 응답한 실험 게시물 목록 조회

// 실험이 응답한 의뢰 게시물 조회
