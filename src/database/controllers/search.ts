import { getRepository } from 'typeorm';

import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';
import CategoryEntity from '@/database/entity/category';
import ReqCategoryEntity from '@/database/entity/req-category';
import ExpCategoryEntity from '@/database/entity/exp-category';

/**
 * 태그 의뢰 검색
 *
 * @param tag 카테고리 태그 이름
 * @param page page number
 * @param display posts count
 * @returns posts list
 */
export const searchRequestListByTag = async (
  tag: string,
  page: number,
  display: number,
) => {
  const targetCategory = await getRepository(CategoryEntity)
    .createQueryBuilder('category')
    .where('category.name = :tag', { tag })
    .getOne();

  const categoryId = targetCategory?.id;

  const requestListByTag = await getRepository(ReqCategoryEntity)
    .createQueryBuilder('req_category')
    .where('req_category.category_id = :categoryId', { categoryId })
    .leftJoinAndSelect('req_category.request', 'request')
    .leftJoinAndSelect('request.user', 'user')
    .leftJoinAndSelect(`request.reqCategories`, `reqCategories`)
    .leftJoinAndSelect(`reqCategories.category`, `category`)
    .loadRelationCountAndMap(`request.likeCount`, `request.reqLikes`)
    .orderBy('request.createdAt', 'DESC')
    .offset((page - 1) * display)
    .limit(display)
    .getMany();

  const result = requestListByTag.map((reqData) => {
    const { reqCategories, content, ...data } = reqData.request;

    const categories = reqCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, categories };
  });

  return result;
};

/**
 * 태그 실험 검색
 *
 * @param tag 카테고리 태그 이름
 * @param page page number
 * @param display posts count
 * @returns posts list
 */
export const searchExperimentListByTag = async (
  tag: string,
  page: number,
  display: number,
) => {
  const targetCategory = await getRepository(CategoryEntity)
    .createQueryBuilder('category')
    .where('category.name = :tag', { tag })
    .getOne();

  const categoryId = targetCategory?.id;

  const experimentListByTag = await getRepository(ExpCategoryEntity)
    .createQueryBuilder('exp_category')
    .where('exp_category.category_id = :categoryId', { categoryId })
    .leftJoinAndSelect('exp_category.experiment', 'experiment')
    .leftJoinAndSelect('experiment.user', 'user')
    .leftJoinAndSelect(`experiment.expCategories`, `expCategories`)
    .leftJoinAndSelect(`expCategories.category`, `category`)
    .loadRelationCountAndMap(`experiment.likeCount`, `experiment.expLikes`)
    .orderBy('experiment.createdAt', 'DESC')
    .offset((page - 1) * display)
    .limit(display)
    .getMany();

  const result = experimentListByTag.map((expData) => {
    const { expCategories, content, ...data } = expData.experiment;

    const categories = expCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, categories };
  });

  return result;
};

/**
 * 키워드(쿼리)를 이용한 의뢰 검색
 *
 * @param query 검색 키워드
 * @param page page number
 * @param display posts number
 * @param sort 정렬 기준 (popular | recent)
 * @returns request posts
 */
export const searchRequestListByQuery = async (
  query: string,
  page: number,
  display: number,
  sort: 'popular' | 'recent',
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
          .where('subreq.title like :query', { query: `%${query}%` })
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

/**
 * 키워드(쿼리)를 이용한 실험 검색
 *
 * @param query 검색 키워드
 * @param page page number
 * @param display posts number
 * @param sort 정렬 기준 (popular | recent)
 * @returns request posts
 */
export const searchExperimentListByQuery = async (
  query: string,
  page: number,
  display: number,
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
          .where('subexp.title like :query', { query: `%${query}%` })
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
