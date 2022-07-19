import { getRepository } from 'typeorm';

import { ServerError } from '@/errors/customErrors';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';

/**
 * 기준에 따른 실험 게시물 목록을 반환
 *
 * @param display posts number
 * @param page page number
 * @param sort 정렬 기준 (popular | recent)
 * @returns experiment posts
 */
const getExperimentList = async (
  display: number,
  page: number,
  sort: 'popular' | 'recent',
) => {
  const sortType = {
    popular: {
      first: 'likeCount',
      second: 'topExps.likeCount',
    },
    recent: {
      first: 'subexp.createdAt',
      second: 'experiment.createdAt',
    },
  };

  const expListData = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .select([
      'experiment.id',
      'experiment.createdAt',
      'experiment.updatedAt',
      'experiment.title',
      'experiment.thumbnail',
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
    .leftJoinAndSelect('experiment.user', 'user')
    .leftJoinAndSelect('experiment.expCategories', 'expCategories')
    .leftJoinAndSelect('expCategories.category', 'category')
    .loadRelationCountAndMap('experiment.likeCount', 'experiment.expLikes')
    .orderBy(sortType[sort].second, 'DESC')
    .getMany();

  if (!expListData) {
    throw new ServerError('DB에서 expListData 조회를 실패하였습니다.');
  }

  const result = expListData.map((expData) => {
    const { expCategories, ...data } = expData;

    const categories = expCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, categories };
  });

  return result;
};

/**
 * 기준에 따른 의뢰 게시물 목록을 반환
 *
 * @param display posts number
 * @param page page number
 * @param sort 정렬 기준 (popular | recent)
 * @param state request에 experiment가 있는지에 따른 구분 (all | wait | answered)
 * @returns request posts
 */
const getRequestList = async (
  display: number,
  page: number,
  sort: 'popular' | 'recent',
  state: 'all' | 'wait' | 'answered',
) => {
  const sortType = {
    popular: {
      first: 'likeCount',
      second: 'topReqs.likeCount',
    },
    recent: {
      first: 'subreq.createdAt',
      second: 'request.createdAt',
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
      'request.createdAt',
      'request.updatedAt',
      'request.title',
      'request.thumbnail',
      'request.state',
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
    .leftJoinAndSelect('request.user', 'user')
    .leftJoinAndSelect('request.reqCategories', 'reqCategories')
    .leftJoinAndSelect('reqCategories.category', 'category')
    .loadRelationCountAndMap('request.likeCount', 'request.reqLikes')
    .orderBy(sortType[sort].second, 'DESC')
    .getMany();

  if (!reqListData) {
    throw new ServerError('DB에서 reqListData 조회를 실패하였습니다.');
  }

  const result = reqListData.map((expData) => {
    const { reqCategories, ...data } = expData;

    const categories = reqCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, categories };
  });

  return result;
};

export { getExperimentList, getRequestList };
