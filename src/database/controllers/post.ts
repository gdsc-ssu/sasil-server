import { getRepository } from 'typeorm';

import { ServerError } from '@/errors/customErrors';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';

// 만약 의뢰에 따른 실험 게시물 목록 정보를 불러오는 것을 분리하면,
// getExperimentPost와 getRequestPost 통일 가능

/**
 * id값에 따른 실험 게시물 정보를 반환
 *
 * @param postId 실험 게시물의 id값
 * @returns request post info | undefined
 */
const getExperimentPost = async (postId: number) => {
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
const getRequestPost = async (postId: number) => {
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

// 의뢰 게시물에 응답한 실험 게시물 목록

// 댓글 작성 (로그인)

// 댓글 삭제 (로그인)

// 좋아요 (로그인)

// 좋아요 취소 (로그인)

// 북마크 추가 (로그인)

// 북마크 삭제 (로그인)

export { getExperimentPost, getRequestPost };
