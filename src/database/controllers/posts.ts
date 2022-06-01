import { getRepository } from 'typeorm';

import { ServerError } from '@/errors/customErrors';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';

/**
 * 기준에 따른 실험 게시물 목록을 반환
 *
 * @param display posts number
 * @param page page number
 * @param sort 정렬 기준 (popular | date)
 * @returns experiment posts
 */
const getExperimentList = async (
  display: number,
  page: number,
  sort: 'popular' | 'date',
) => {
  const sortType = {
    popular: {
      first: 'likeCount',
      second: 'topExps.likeCount',
    },
    date: {
      first: 'subexp.created_at',
      second: 'experiment.created_at',
    },
  };

  const expListData = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .select([
      'experiment.id',
      'experiment.created_at',
      'experiment.updated_at',
      'experiment.title',
      'experiment.thumbnail',
      'user.id',
      'user.nickname',
      'user.profile_img',
      'categories.id',
      'categories.name',
    ])
    .innerJoin(
      (qb) =>
        qb
          .select(['subexp.id', 'COUNT(likes.id) as likeCount'])
          .from(ExperimentEntity, 'subexp')
          .leftJoin('subexp.expLikes', 'likes')
          .groupBy('subexp.id')
          .offset((page - 1) * display)
          .limit(display)
          .orderBy(sortType[sort].first, 'DESC'),
      'topExps',
      'topExps.subexp_id = experiment.id',
    )
    .leftJoin('experiment.user', 'user')
    .leftJoin('experiment.categories', 'categories')
    .loadRelationCountAndMap('experiment.likeCount', 'experiment.expLikes')
    .orderBy(sortType[sort].second, 'DESC')
    .getMany();

  if (!expListData) {
    throw new ServerError('DB에서 expListData 조회를 실패하였습니다.');
  }

  return expListData;
};

/**
 * 기준에 따른 의뢰 게시물 목록을 반환
 *
 * @param display posts number
 * @param page page number
 * @param sort 정렬 기준 (popular | date)
 * @param state request에 experiment가 있는지에 따른 구분 (all | wait | answered)
 * @returns request posts
 */
const getRequestList = async (
  display: number,
  page: number,
  sort: 'popular' | 'date',
  state: 'all' | 'wait' | 'answered',
) => {
  const sortType = {
    popular: {
      first: 'likeCount',
      second: 'topReqs.likeCount',
    },
    date: {
      first: 'subreq.created_at',
      second: 'request.created_at',
    },
  };

  const reverseState = {
    all: 'all',
    wait: 'answered',
    answered: 'wait',
  };

  const reqListData = await getRepository(RequestEntity)
    .createQueryBuilder('request')
    .select([
      'request.id',
      'request.created_at',
      'request.updated_at',
      'request.title',
      'request.thumbnail',
      'request.state',
      'user.id',
      'user.nickname',
      'user.profile_img',
      'categories.id',
      'categories.name',
    ])
    .innerJoin(
      (qb) =>
        qb
          .select(['subreq.id', 'COUNT(likes.id) as likeCount'])
          .from(RequestEntity, 'subreq')
          .where('subreq.state != :reverseState ', {
            reverseState: reverseState[state],
          })
          .leftJoin('subreq.reqLikes', 'likes')
          .groupBy('subreq.id')
          .offset((page - 1) * display)
          .limit(display)
          .orderBy(sortType[sort].first, 'DESC'),
      'topReqs',
      'topReqs.subreq_id = request.id',
    )
    .leftJoin('request.user', 'user')
    .leftJoin('request.categories', 'categories')
    .loadRelationCountAndMap('request.likeCount', 'request.reqLikes')
    .orderBy(sortType[sort].second, 'DESC')
    .getMany();

  if (!reqListData) {
    throw new ServerError('DB에서 reqListData 조회를 실패하였습니다.');
  }

  return reqListData;
};

export { getExperimentList, getRequestList };
