import { getRepository } from 'typeorm';

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
