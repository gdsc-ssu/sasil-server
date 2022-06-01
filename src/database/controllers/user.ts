import { getRepository } from 'typeorm';

import { ServerError } from '@/errors/customErrors';
import UserEntity, { LoginTypes } from '@/database/entity/user';

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
    throw new ServerError('DB에서 userData 조회를 실패하였습니다.');
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
    login_type: loginType,
    nickname, // TODO: random 생성
  });

  if (!newUserData) {
    throw new ServerError('DB에서 유저 데이터 생성에 실패하였습니다.');
  }

  await userRepository.save(newUserData);

  return newUserData;
};
