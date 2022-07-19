import { getRepository } from 'typeorm';

import UserEntity, { LoginTypes } from '@/database/entity/user';
import ExperimentEntity from '@/database/entity/experiment';
import RequestEntity from '@/database/entity/request';
import ExpBookmarkEntity from '@/database/entity/exp-bookmark';
import ReqBookmarkEntity from '@/database/entity/req-bookmark';
import { BadRequestError, ServerError } from '@/errors/customErrors';

/**
 * id값으로 DB에서 유저 데이터 가져와 반환하는 함수
 *
 * @param id 유저의 id값
 * @returns 유저 데이터
 */
export const getUserById = async (id: number) => {
  const userData = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .where('user.id = :id', { id })
    .getOne();

  if (!userData) {
    throw new BadRequestError('존재하지 않는 유저에 대한 조회 요청입니다.');
  }

  return userData;
};

/**
 * email, loginType으로 DB에서 유저 데이터 가져와 반환하는 함수
 *
 * @param email 유저의 email
 * @param loginType 소셜 로그인 종류 ("apple" | "google" | "kakao")
 * @returns 유저 데이터
 */
export const getUserByLoginInfo = async (
  email: string,
  loginType: LoginTypes,
) => {
  const userData = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .where('user.email = :email', { email })
    .andWhere('user.login_type = :loginType', { loginType })
    .getOne();

  //* userData 존재하지 않는다고 에러처리하지 말것!!

  return userData;
};

/**
 * 회원가입 기능을 하는 함수
 *
 * @param email 유저의 email
 * @param nickname 랜덤 생성된 유저의 nickname
 * @param loginType 소셜 로그인 종류 ("apple" | "google" | "kakao")
 * @returns 유저 데이터
 */
export const addUser = async (
  email: string,
  nickname: string,
  loginType: LoginTypes,
) => {
  const userRepository = getRepository(UserEntity);

  const newUserData = userRepository.create({
    email,
    loginType,
    nickname, // TODO: random 생성
  });

  if (!newUserData) {
    throw new ServerError('DB에서 유저 데이터 생성에 실패하였습니다.');
  }

  await userRepository.save(newUserData);

  return newUserData;
};

/**
 * 회원탈퇴 기능을 하는 함수
 *
 * @param userId 유저의 id값
 * @returns
 */
export const deleteUser = async (userId: number) => {
  const deleteResult = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .softDelete()
    .where(`user.id = :userId`, { userId })
    .execute();

  if (deleteResult.affected !== 1) {
    throw new BadRequestError('존재하지 않는 유저에 대한 삭제 요청입니다.');
  }
};

/**
 * 유저가 작성한 실험 게시물 목록 반환
 *
 * @param userId user id
 * @param display posts number
 * @param page page number
 * @returns posts list
 */
export const getUserExperimentList = async (
  userId: number,
  display: number,
  page: number,
) => {
  const expListData = await getRepository(ExperimentEntity)
    .createQueryBuilder('experiment')
    .select([
      `experiment.id`,
      `experiment.createdAt`,
      `experiment.updatedAt`,
      `experiment.title`,
      `experiment.thumbnail`,
    ])
    .where(`experiment.user_id = :userId`, { userId })
    .innerJoin(
      (qb) =>
        qb
          .select(['subexp.id'])
          .from(ExperimentEntity, 'subexp')
          .groupBy('subexp.id')
          .offset((page - 1) * display)
          .limit(display)
          .orderBy('subexp.createdAt', 'DESC'),
      'topExps',
      'topExps.subexp_id = experiment.id',
    )
    .leftJoinAndSelect(`experiment.expCategories`, `expCategories`)
    .leftJoinAndSelect(`expCategories.category`, `category`)
    .loadRelationCountAndMap(`experiment.likeCount`, `experiment.expLikes`)
    .orderBy('experiment.createdAt', 'DESC')
    .getMany();

  const user = await getUserById(userId);

  const result = expListData.map((expData) => {
    const { expCategories, ...data } = expData;

    const categories = expCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, user, categories };
  });

  return result;
};

/**
 * 유저가 작성한 의뢰 게시물 목록 반환
 *
 * @param userId user id
 * @param display posts number
 * @param page page number
 * @returns posts list
 */
export const getUserRequestList = async (
  userId: number,
  display: number,
  page: number,
) => {
  const sortType = `request.createdAt`;

  const reqListData = await getRepository(RequestEntity)
    .createQueryBuilder('request')
    .select([
      `request.id`,
      `request.createdAt`,
      `request.updatedAt`,
      `request.title`,
      `request.thumbnail`,
    ])
    .where(`request.user_id = :userId`, { userId })
    .innerJoin(
      (qb) =>
        qb
          .select(['subreq.id'])
          .from(RequestEntity, 'subreq')
          .groupBy('subreq.id')
          .offset((page - 1) * display)
          .limit(display)
          .orderBy('subreq.createdAt', 'DESC'),
      'topReqs',
      'topReqs.subreq_id = request.id',
    )
    .leftJoinAndSelect(`request.reqCategories`, `reqCategories`)
    .leftJoinAndSelect(`reqCategories.category`, `category`)
    .loadRelationCountAndMap(`request.likeCount`, `request.reqLikes`)
    .orderBy(sortType, 'DESC')
    .getMany();

  const user = await getUserById(userId);

  const result = reqListData.map((reqData) => {
    const { reqCategories, ...data } = reqData;

    const categories = reqCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, user, categories };
  });

  return result;
};

/**
 * 유저가 북마크한 실험 게시물 목록 반환
 *
 * @param userId user id
 * @param display posts number
 * @param page page number
 * @returns posts list
 */
export const getUserBookmarkExperimentList = async (
  userId: number,
  display: number,
  page: number,
) => {
  const bookmarkExperimentList = await getRepository(ExpBookmarkEntity)
    .createQueryBuilder('exp_bookmark')
    .where(`exp_bookmark.user_id = :userId`, { userId })
    .leftJoinAndSelect(`exp_bookmark.experiment`, 'expBookmarks')
    .leftJoinAndSelect('expBookmarks.user', 'user')
    .leftJoinAndSelect(`expBookmarks.expCategories`, `expCategories`)
    .leftJoinAndSelect(`expCategories.category`, `category`)
    .loadRelationCountAndMap(`expBookmarks.likeCount`, `expBookmarks.expLikes`)
    .orderBy('expBookmarks.createdAt', 'DESC')
    .offset((page - 1) * display)
    .limit(display)
    .getMany();

  const result = bookmarkExperimentList.map((expData) => {
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
 * 유저가 북마크한 의뢰 게시물 목록 반환
 *
 * @param userId user id
 * @param display posts number
 * @param page page number
 * @returns posts list
 */
export const getUserBookmarkRequestList = async (
  userId: number,
  display: number,
  page: number,
) => {
  const bookmarkRequestList = await getRepository(ReqBookmarkEntity)
    .createQueryBuilder('req_bookmark')
    .where(`req_bookmark.user_id = :userId`, { userId })
    .leftJoinAndSelect(`req_bookmark.request`, 'reqBookmarks')
    .leftJoinAndSelect('reqBookmarks.user', 'user')
    .leftJoinAndSelect(`reqBookmarks.reqCategories`, `reqCategories`)
    .leftJoinAndSelect(`reqCategories.category`, `category`)
    .loadRelationCountAndMap(`reqBookmarks.likeCount`, `reqBookmarks.reqLikes`)
    .orderBy('reqBookmarks.createdAt', 'DESC')
    .offset((page - 1) * display)
    .limit(display)
    .getMany();

  const result = bookmarkRequestList.map((reqData) => {
    const { reqCategories, content, ...data } = reqData.request;

    const categories = reqCategories.map((categoryData) => ({
      id: categoryData.category.id,
      name: categoryData.category.name,
    }));

    return { ...data, categories };
  });
  return result;
};
